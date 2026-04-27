// Public-safe display data. Imported by the server component that renders
// the tier cards AND by the API route. Stripe Price IDs are NOT here.
export const TIERS = [
  {
    key: 'rifugio',
    title: 'Rifugio (mezza pensione)',
    priceLabel: '95€',
    includes: [
      'mezza pensione in rifugio',
      'partecipazione alla ride',
      'pacco gara',
      'partecipazione ai contest',
    ],
  },
  {
    key: 'tenda-ferrino',
    title: 'Tenda Ferrino in loco',
    priceLabel: '65€',
    includes: [
      'tenda Ferrino fornita',
      'partecipazione alla ride',
      'pacco gara',
      'partecipazione ai contest',
    ],
  },
  {
    key: 'posto-tenda',
    title: 'Posto tenda',
    priceLabel: '50€',
    includes: [
      'posto tenda',
      'partecipazione alla ride',
      'pacco gara',
      'partecipazione ai contest',
    ],
  },
  {
    key: 'ride-only',
    title: 'Solo ride + pacco gara',
    priceLabel: '25€',
    includes: [
      'partecipazione alla ride',
      'pacco gara',
      'partecipazione ai contest',
    ],
  },
] as const

export type TierKey = (typeof TIERS)[number]['key']

export const TIER_KEYS: TierKey[] = TIERS.map((t) => t.key) as TierKey[]

export function isTierKey(value: unknown): value is TierKey {
  return typeof value === 'string' && (TIER_KEYS as string[]).includes(value)
}

// SERVER ONLY — only imported by the API route.
// Returns the Stripe Price ID for a tier, reading from env.
export function getPriceIdForTier(key: TierKey): string | undefined {
  switch (key) {
    case 'rifugio':
      return process.env.STRIPE_PRICE_RIFUGIO
    case 'tenda-ferrino':
      return process.env.STRIPE_PRICE_TENDA_FERRINO
    case 'posto-tenda':
      return process.env.STRIPE_PRICE_POSTO_TENDA
    case 'ride-only':
      return process.env.STRIPE_PRICE_RIDE_ONLY
  }
}
