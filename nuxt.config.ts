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
      titleTemplate: (titleChunk) => (titleChunk ? `${titleChunk} · Obayan` : 'Obayan · Modern Pesantren Platform'),
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#58CC02' },
        { name: 'description', content: 'Obayan — platform modern untuk pondok pesantren: web profile, SIAKAD, pembayaran, akademik, absensi, kunjungan, pelanggaran, perizinan — terintegrasi RFID & Fingerprint (ToriID).'},
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Obayan · Modern Pesantren Platform' },
        { property: 'og:description', content: 'Web profile, SIAKAD, pembayaran, akademik, absensi RFID & Fingerprint (ToriID), kunjungan, pelanggaran, perizinan.' },
        { property: 'og:image', content: '/og-obayan.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap' }
      ]
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