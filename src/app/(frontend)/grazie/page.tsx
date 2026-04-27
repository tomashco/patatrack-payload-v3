import React from 'react'
import Link from 'next/link'
import { getStripe } from '@/utilities/stripe'
import { TIERS } from '@/blocks/FestivalRegistration/tiers'

type Props = {
  searchParams: Promise<{ session_id?: string }>
}

export const dynamic = 'force-dynamic'

async function loadSession(sessionId: string | undefined) {
  if (!sessionId) return null
  try {
    const stripe = getStripe()
    return await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['custom_fields'],
    })
  } catch (err) {
    console.error('grazie: failed to retrieve session', err)
    return null
  }
}

export default async function GraziePage({ searchParams }: Props) {
  const { session_id } = await searchParams
  const session = await loadSession(session_id)

  const paid = session?.payment_status === 'paid'
  const tierKey = session?.metadata?.tier
  const tier = TIERS.find((t) => t.key === tierKey)
  const tshirt = session?.custom_fields?.find((f) => f.key === 'tshirt')?.dropdown?.value

  return (
    <main className="container my-24 max-w-2xl text-center">
      {paid ? (
        <>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Grazie per la tua iscrizione!</h1>
          <p className="text-lg mb-2">
            Hai scelto: <strong>{tier?.title ?? 'iscrizione festival'}</strong>
          </p>
          {tshirt && (
            <p className="text-lg mb-6">
              Taglia maglietta: <strong>{tshirt}</strong>
            </p>
          )}
          <p className="text-base mb-8">
            Riceverai una mail di conferma da Stripe con la ricevuta. Ci vediamo al festival!
          </p>
        </>
      ) : session && session.payment_status === 'unpaid' ? (
        <>
          <h1 className="text-4xl font-bold mb-6">Pagamento non completato</h1>
          <p className="mb-8">Il pagamento non è andato a buon fine. Puoi riprovare dalla pagina del festival.</p>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-6">Stiamo verificando il pagamento</h1>
          <p className="mb-8">
            Se hai completato il pagamento riceverai una mail di conferma da Stripe a breve.
          </p>
        </>
      )}
      <Link href="/portage-bike-festival" className="underline">
        Torna alla pagina del festival
      </Link>
    </main>
  )
}
