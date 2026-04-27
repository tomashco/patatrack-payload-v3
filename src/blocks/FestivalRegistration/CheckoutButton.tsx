'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { TierKey } from './tiers'

type Props = { tierKey: TierKey }

export const CheckoutButton: React.FC<Props> = ({ tierKey }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/festival-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierKey }),
      })
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const data = (await res.json()) as { url?: string }
      if (!data.url) {
        throw new Error('Missing checkout URL')
      }
      window.location.href = data.url
    } catch (err) {
      console.error('checkout failed', err)
      setError('Si è verificato un errore. Riprova.')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleClick} disabled={loading} className="w-full">
        {loading ? 'Attendi...' : 'Iscriviti'}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
