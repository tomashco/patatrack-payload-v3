import { NextResponse } from 'next/server'
import { getStripe } from '@/utilities/stripe'
import { getServerSideURL } from '@/utilities/getURL'
import {
  getPriceIdForTier,
  isTierKey,
} from '@/blocks/FestivalRegistration/tiers'

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 })
  }

  const tierKey = (body as { tierKey?: unknown })?.tierKey
  if (!isTierKey(tierKey)) {
    return NextResponse.json({ error: 'invalid_tier' }, { status: 400 })
  }

  const priceId = getPriceIdForTier(tierKey)
  if (!priceId) {
    console.error(`festival-checkout: missing Stripe Price ID for tier ${tierKey}`)
    return NextResponse.json({ error: 'misconfigured' }, { status: 500 })
  }

  const origin = getServerSideURL()

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      custom_fields: [
        {
          key: 'tshirt',
          label: { type: 'custom', custom: 'Taglia maglietta' },
          type: 'dropdown',
          dropdown: {
            options: [
              { label: 'XS', value: 'XS' },
              { label: 'S', value: 'S' },
              { label: 'M', value: 'M' },
              { label: 'L', value: 'L' },
              { label: 'XL', value: 'XL' },
              { label: 'XXL', value: 'XXL' },
            ],
          },
        },
      ],
      locale: 'it',
      metadata: { tier: tierKey },
      success_url: `${origin}/grazie?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/portage-bike-festival`,
    })

    if (!session.url) {
      console.error('festival-checkout: Stripe returned session without url')
      return NextResponse.json({ error: 'stripe_error' }, { status: 502 })
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('festival-checkout: Stripe error', err)
    return NextResponse.json({ error: 'stripe_error' }, { status: 502 })
  }
}
