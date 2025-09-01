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
      siteUrl: 'https://alberr.hayago.id',
      siteName: 'Pondok Pesantren Alberr',
      siteDescription: 'Pondok pesantren inovatif: diniyah, tahfidz, dan pendidikan formal berkarakter.',
      twitterSite: '@alberr'
    }
  },

  modules: ['nuxt-tiptap-editor'],
  tiptap: {
    prefix: 'Tiptap',
  },
})