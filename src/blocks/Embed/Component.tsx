import React from 'react'
import type { EmbedBlock as EmbedBlockProps } from '@/payload-types'

export const EmbedBlock: React.FC<EmbedBlockProps> = ({ url, height, title }) => {
  if (!url) return null

  return (
    <div className="container my-16">
      <iframe
        src={url}
        width="100%"
        height={height || 600}
        allowFullScreen
        title={title || 'Embedded content'}
        style={{ border: 0 }}
      />
    </div>
  )
}
