import Stripe from 'stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createSupabaseAdminClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === 'checkout.session.completed') {
    if (!session?.metadata?.courseId || !session?.metadata?.userId) {
      return new NextResponse('Webhook Error: Missing metadata', { status: 400 })
    }

    const supabase = createSupabaseAdminClient()

    // Create the enrollment
    await supabase.from('enrollments').insert({
      student_id: session.metadata.userId,
      course_id: session.metadata.courseId,
      payment_status: 'completed',
      payment_id: session.id,
      amount_paid: session.amount_total ? session.amount_total / 100 : 0
    })

    // Update total students count on course
    await supabase.rpc('increment_course_students', { course_id: session.metadata.courseId })
  }

  return new NextResponse('Webhook Received', { status: 200 })
}
