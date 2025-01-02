import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/cn'
import Image from 'next/image'

export const CallToActionBlock: React.FC<CTABlockProps> = ({
  links,
  richText,
  bgColor,
  media,
  duotone,
}) => {
  return (
    <div className={`${bgColor}`}>
      {media && typeof media === 'object' && (
        <div className={cn('absolute w-full h-[400px]', duotone && 'duotone')}>
          <Image
            src={media.url || ''}
            alt={media.alt || ''}
            sizes="100vw"
            fill
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            width={0}
            height={0}
          />
        </div>
      )}
      <div className="container relative z-10">
        <div
          className={cn(
            'p-4 flex flex-col gap-8 items-center text-center',
            media && 'flex-row items-end justify-between h-[400px]',
          )}
        >
          <div className="max-w-[48rem] flex items-center">
            {richText && (
              <RichText
                className="mb-0  lg:[&>h1]:text-[6.5rem] lg:[&>p]:text-[1.5rem] [&>h1]:font-['LemonMilk']"
                data={richText}
                enableGutter={false}
              />
            )}
          </div>
          <div className="flex flex-col gap-8 lg:[&>a]:text-[1.5rem] [&>a]:font-['LemonMilk']">
            {(links || []).map(({ link }, i) => {
              return <CMSLink key={i} size="lg" {...link} />
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
