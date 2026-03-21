import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const { courseId, couponCode } = await req.json()
    const supabase = await createSupabaseServerClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return new NextResponse('Unauthorized', { status: 401 })

    const { data: course } = await supabase
      .from('courses').select('id,title,price,slug,teacher_id,currency')
      .eq('id', courseId).single()
    if (!course) return new NextResponse('Course not found', { status: 404 })

    // التحقق من التسجيل المسبق
    const { data: existingEnrollment } = await supabase
      .from('enrollments').select('id')
      .eq('student_id', session.user.id).eq('course_id', courseId).maybeSingle()
    if (existingEnrollment) {
      return NextResponse.json({ url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}/learn` })
    }

    // تسجيل مجاني
    if (!course.price || course.price === 0) {
      const { error } = await supabase.from('enrollments').upsert({
        student_id: session.user.id, course_id: courseId,
        payment_status: 'free', enrolled_at: new Date().toISOString(),
        progress_percentage: 0,
      }, { onConflict: 'student_id,course_id' })
      if (error) return new NextResponse('Enrollment failed', { status: 500 })
      await supabase.rpc('increment_course_students', { course_id: courseId }).catch(()=>{})
      return NextResponse.json({ url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?course=${course.slug}` })
    }

    // تطبيق كوبون الخصم
    let finalPrice = course.price
    let discountInfo: string | undefined
    if (couponCode) {
      const { data: coupon } = await supabase.from('coupons')
        .select('*').eq('code', couponCode.toUpperCase().trim()).maybeSingle()
      if (coupon?.is_active && (!coupon.expires_at || new Date(coupon.expires_at) > new Date())) {
        const discount = coupon.discount_percent / 100
        finalPrice = Math.round(course.price * (1 - discount) * 100) / 100
        discountInfo = `خصم ${coupon.discount_percent}%`
        // تحديث عدد الاستخدامات
        await supabase.from('coupons').update({ used_count: (coupon.used_count||0) + 1 }).eq('id', coupon.id)
      }
    }

    // إذا كان السعر صفر بعد الخصم
    if (finalPrice === 0) {
      await supabase.from('enrollments').upsert({
        student_id: session.user.id, course_id: courseId,
        payment_status: 'coupon_free', enrolled_at: new Date().toISOString(),
        progress_percentage: 0,
      }, { onConflict: 'student_id,course_id' })
      await supabase.rpc('increment_course_students', { course_id: courseId }).catch(()=>{})
      return NextResponse.json({ url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?course=${course.slug}` })
    }

    // Stripe Checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: course.currency || 'usd',
          product_data: {
            name: course.title,
            description: discountInfo,
          },
          unit_amount: Math.round(finalPrice * 100),
        }
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}`,
      metadata: { courseId: course.id, userId: session.user.id },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error: any) {
    console.error('[CHECKOUT_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
