import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { isRateLimited, getIP } from '@/lib/rateLimit'
import { isValidUUID, sanitizeStr } from '@/lib/validate'

export async function POST(req: Request) {
  // ⛔ Rate limit: 10 طلبات كل 60 ثانية
  if (isRateLimited(getIP(req), { limit: 10, window: 60 })) {
    return NextResponse.json(
      { error: 'طلبات كثيرة جداً، يرجى الانتظار ثم المحاولة مجدداً.' },
      { status: 429 }
    )
  }
  try {
    const body = await req.json()
    const courseId    = sanitizeStr(body.courseId, 36)
    if (!isValidUUID(courseId)) return new NextResponse('Invalid courseId', { status: 400 })

    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return new NextResponse('Unauthorized', { status: 401 })

    const { data: course } = await supabase
      .from('courses').select('id,title,price,slug,teacher_id')
      .eq('id', courseId).single()
    if (!course) return new NextResponse('Course not found', { status: 404 })

    // تسجيل مجاني
    if (!course.price || course.price === 0) {
      const { error } = await supabase.from('enrollments').upsert({
        student_id:     session.user.id,
        course_id:      courseId,
        payment_status: 'free',
        enrolled_at:    new Date().toISOString(),
        progress_percentage: 0,
      }, { onConflict: 'student_id,course_id' })
      if (error) { console.error('[FREE_ENROLL]', error); return new NextResponse('Enrollment failed', { status: 500 }) }
      try { await supabase.rpc('increment_course_students', { course_id: courseId }) } catch (e) { console.error('[RPC]', e) }
      return NextResponse.json({ url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}/learn` })
    }

    // دفع عبر Stripe
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      line_items: [{ quantity: 1, price_data: {
        currency: 'usd',
        product_data: { name: course.title },
        unit_amount: Math.round(course.price * 100),
      }}],
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
