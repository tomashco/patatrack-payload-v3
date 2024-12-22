// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { s3Storage } from '@payloadcms/storage-s3'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailer from 'nodemailer'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SENDAS_ADDRESS!,
    defaultFromName: process.env.SENDAS_NAME!,
    // Any Nodemailer transport
    transport: await nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    }),
  }),
  collections: [Pages, Posts, Media, Categories, Users],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins: [
    ...plugins,
    s3Storage({
      collections: {
        media: true,
      },
      acl: 'public-read',
      bucket: process.env.S3_BUCKET!,
      config: {
        endpoint: process.env.PAYLOAD_PUBLIC_CLOUDFLARE_ENDPOINT || '',
        region: process.env.S3_REGION,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
        // ... Other S3 configuration
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
