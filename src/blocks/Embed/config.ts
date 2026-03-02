import type { Block } from 'payload'

export const Embed: Block = {
  slug: 'embed',
  interfaceName: 'EmbedBlock',
  labels: {
    singular: 'Embed',
    plural: 'Embeds',
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'URL',
      admin: {
        description: 'The URL to embed (e.g. https://moduli.golee.it/...)',
      },
    },
    {
      name: 'height',
      type: 'number',
      defaultValue: 600,
      label: 'Height (px)',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      admin: {
        description: 'Accessible title for the embed',
      },
    },
  ],
}
