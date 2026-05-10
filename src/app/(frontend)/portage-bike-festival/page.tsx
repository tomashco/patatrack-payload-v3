import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'

import type { Page as PageType } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

const SLUG = 'portage-bike-festival'

const PURPLE = '#322250'

const sponsors = [
  {
    name: 'Workless Collective',
    url: '#',
    logo: '/api/media/file/logo-workless-black-300x300.png',
  },
  {
    name: 'Patatrack',
    url: '#',
    logo: '/api/media/file/Patatrack-logo-black-300x288.png',
  },
  {
    name: 'Capanna Mautino',
    url: '#',
    logo: '/api/media/file/logo-capanna-mautino-300x348.webp',
  },
]

export default async function Page() {
  const { isEnabled: draft } = await draftMode()
  const url = '/' + SLUG

  const page: PageType | null = await queryPageBySlug({ slug: SLUG })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article>
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {/* Top section: heading + CTA + tagline over portage-background-top.webp */}
      <section className="relative overflow-hidden">
        <img
          src="/api/media/file/portage-background-top.webp"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-bottom"
        />
        <div className="relative">
          <div className="container py-8 md:py-12">
            {/* Heading row: date | logo | location */}
            <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-6">
              <div
                className="flex-1 text-center text-3xl leading-tight md:pt-4 md:text-right md:text-4xl"
                style={{ fontFamily: `"AthenaVKF", sans-serif`, color: PURPLE }}
              >
                27 — 28
                <br />
                giugno
              </div>
              <img
                src="/logo/PORTAGE-Logo_purple.svg"
                alt="Portage"
                className="h-[28rem] w-auto flex-shrink-0 md:h-[28rem] lg:h-[32rem]"
              />
              <div
                className="flex-1 text-center text-3xl leading-tight md:pt-4 md:text-left md:text-4xl"
                style={{ fontFamily: `"AthenaVKF", sans-serif`, color: PURPLE }}
              >
                Capanna Mautino
                <br />
                Bousson — Cesana
                <br />
                Torinese (TO)
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 flex justify-center md:mt-20">
              <a
                href="#iscrizione"
                className="rounded-full px-14 py-5 text-xl font-semibold text-white shadow-md transition hover:opacity-90"
                style={{ backgroundColor: PURPLE }}
              >
                Iscriviti
              </a>
            </div>

            {/* Tagline below CTA */}
            <p
              className="mt-6 text-center text-3xl leading-tight md:mt-8 md:text-4xl"
              style={{ fontFamily: `"AthenaVKF", sans-serif`, color: PURPLE }}
            >
              (not) just another gravel gathering
            </p>
          </div>
        </div>
      </section>

      {/* Bottom section: sponsors anchored at bottom of portage-background-bottom.webp */}
      <section className="relative grid">
        <img
          src="/api/media/file/portage-background-bottom.webp"
          alt=""
          aria-hidden
          className="col-start-1 row-start-1 block h-auto w-full"
        />
        <div className="col-start-1 row-start-1 flex flex-col justify-end">
          <div className="container pb-6 text-center md:pb-12">
            <h2 className="mb-4 text-sm uppercase tracking-widest text-gray-700 md:mb-8">
              con il supporto di
            </h2>
            <div className="grid grid-cols-3 items-center gap-3 md:gap-16">
              {sponsors.map((s) => (
                <div key={s.name} className="flex justify-center">
                  {s.logo ? (
                    <img src={s.logo} alt={s.name} className="h-20 w-auto md:h-32" />
                  ) : (
                    <div className="flex h-12 w-full items-center justify-center rounded border-2 border-dashed border-gray-400 bg-white/70 px-1 text-center text-[9px] uppercase tracking-wide text-gray-600 md:h-20 md:px-4 md:text-xs">
                      {s.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <RenderHero {...hero} />
      <div
        id="iscrizione"
        className="scroll-mt-16 [&_.container]:max-w-none [&_.container]:px-0 [&>*:last-child_.container]:mb-0"
      >
        <RenderBlocks blocks={layout} />
      </div>
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryPageBySlug({ slug: SLUG })
  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
