import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')
  if (!sessionId) return NextResponse.json({ error: 'missing session_id' }, { status: 400 })

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    })
    return NextResponse.json({ status: session.payment_status, course: null })
  } catch {
    return NextResponse.json({ status: 'unknown' })
  }
}
