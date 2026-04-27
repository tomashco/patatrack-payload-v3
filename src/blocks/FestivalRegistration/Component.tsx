import React from 'react'

import type { FestivalRegistrationBlock as FestivalRegistrationBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'
import { CheckoutButton } from './CheckoutButton'
import { TIERS } from './tiers'

export const FestivalRegistrationBlock: React.FC<FestivalRegistrationBlockProps> = ({
  heading,
  description,
}) => {
  return (
    <section className="container my-16">
      {heading && (
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-center">{heading}</h2>
      )}
      {description && (
        <div className="max-w-3xl mx-auto mb-10 text-center">
          <RichText data={description} enableGutter={false} />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TIERS.map((tier) => (
          <div
            key={tier.key}
            className="flex flex-col rounded-xl border border-border p-6 bg-card shadow-sm"
          >
            <h3 className="text-xl font-semibold mb-2">{tier.title}</h3>
            <p className="text-3xl font-bold mb-4">{tier.priceLabel}</p>
            <ul className="flex-1 space-y-1 text-sm mb-6 list-disc pl-5">
              {tier.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <CheckoutButton tierKey={tier.key} />
          </div>
        ))}
      </div>
    </section>
  )
}
