import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
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
      siteUrl: 'https://alinayah.sencra.io',
      siteName: 'Pondok Pesantren alinayah',
      siteDescription: 'Pondok pesantren inovatif: diniyah, tahfidz, dan pendidikan formal berkarakter.',
      twitterSite: '@alinayah',
      public: {
        cloudinaryCloudName: process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
        cloudinaryUploadPreset: process.env.NUXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
      },
    }
  },

  modules: ['nuxt-tiptap-editor'],
  tiptap: {
    prefix: 'Tiptap',
  },
})