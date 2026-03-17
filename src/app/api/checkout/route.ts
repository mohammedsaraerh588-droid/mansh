import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const { courseId } = await req.json()
    const supabase = createSupabaseServerClient()

    // 1. Get user session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // 2. Get course details
    const { data: course } = await supabase
      .from('courses')
      .select('id, title, price, thumbnail_url, teacher_id')
      .eq('id', courseId)
      .single()

    if (!course) {
      return new NextResponse('Course not found', { status: 404 })
    }

    // 3. Create Stripe Checkout Session
    const line_items = [
      {
        quantity: 1,
        price_data: {
          currency: 'usd', // Assuming USD for now. Could grab from course.currency
          product_data: {
            name: course.title,
            description: `الوصول مدى الحياة لدورة: ${course.title}`,
          },
          unit_amount: Math.round(course.price * 100), // Stripe expects cents
        }
      }
    ]

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}`,
      metadata: {
        courseId: course.id,
        userId: session.user.id,
      }
    })

    return NextResponse.json({ url: checkoutSession.url })

  } catch (error: any) {
     console.error('[CHECKOUT_ERROR]', error)
     return new NextResponse('Internal Error', { status: 500 })
  }
}
