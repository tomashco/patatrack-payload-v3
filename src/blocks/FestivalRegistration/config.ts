import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const FestivalRegistration: Block = {
  slug: 'festivalRegistration',
  interfaceName: 'FestivalRegistrationBlock',
  labels: {
    singular: 'Festival Registration',
    plural: 'Festival Registrations',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading (optional)',
      admin: {
        description: 'Optional title shown above the tier cards.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description (optional)',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      admin: {
        description: 'Optional intro copy shown above the tier cards.',
      },
    },
  ],
}
