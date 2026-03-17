import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia' as any, // Bypass TS error for specific alpha/beta versions
  typescript: true,
})
