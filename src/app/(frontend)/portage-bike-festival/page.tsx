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

export default async function Page() {
  const { isEnabled: draft } = await draftMode()
  const url = '/' + SLUG

  const page: PageType | null = await queryPageBySlug({ slug: SLUG })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article className="pt-16">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <header className="container py-12 text-center">
        <img
          src="/logo/PORTAGE-Logotipo_purple.svg"
          alt="Portage"
          className="mx-auto mb-6 h-32 w-auto md:h-40"
        />
        <h1
          className="text-5xl tracking-tight md:text-6xl"
          style={{ fontFamily: '"AthenaVKF", sans-serif', color: '#322250' }}
        >
          Bike Festival
        </h1>
      </header>

      <RenderHero {...hero} />
      <div className="[&_.container]:max-w-none [&_.container]:px-0 [&>*:last-child_.container]:mb-0">
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
