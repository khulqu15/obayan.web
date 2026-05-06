import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  alias: {
    '~': fileURLToPath(new URL('./app', import.meta.url)),
    '@': fileURLToPath(new URL('./app', import.meta.url)),
  },
  css: [
    '~/assets/css/main.css',
  ],

  vite: {
    plugins: [
      tailwindcss()
    ],
  },

  plugins: [
    '~/plugins/firebase.client.ts',
    '~/plugins/preline.client.ts',
    '~/plugins/page-loading.client.ts',
  ],

  imports: {
    autoImport: true
  },

  app: {
    head: {
      htmlAttrs: { lang: 'id' }
    }
  },

  runtimeConfig: {
    public: {
      clientName: process.env.NUXT_PUBLIC_CLIENT_NAME || 'alinayah',
      clientDisplayName: process.env.NUXT_PUBLIC_CLIENT_DISPLAY_NAME || 'Al-Inayah',

      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://alinayah.sencra.io',
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || 'Pondok Pesantren Al-Inayah',
      siteDescription: process.env.NUXT_PUBLIC_SITE_DESCRIPTION || 'Pondok pesantren inovatif dan informatif.',
      twitterSite: process.env.NUXT_PUBLIC_TWITTER_SITE || '@alinayah',

      appName: process.env.NUXT_PUBLIC_APP_NAME || 'SINAYAH',
      appSubtitle: process.env.NUXT_PUBLIC_APP_SUBTITLE || 'SIAKAD Ponpes. AL-INAYAH',
      appLogo: process.env.NUXT_PUBLIC_APP_LOGO || '/assets/logo.png',
      appThemeColor: process.env.NUXT_PUBLIC_APP_THEME_COLOR || '#0ea5e9',

      cloudinaryCloudName: process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || '',
      cloudinaryUploadPreset: process.env.NUXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
    }
  },

  modules: ['nuxt-tiptap-editor'],
  tiptap: {
    prefix: 'Tiptap',
  },
})