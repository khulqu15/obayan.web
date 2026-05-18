import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  devtools: { enabled: true },
  hub: {
    db: 'mysql',
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

  nitro: {
    prerender: {
      crawlLinks: false,
      failOnError: false,
      routes: [
        '/',
        '/news',
        '/profile',
        '/status',
        '/apbd',
        '/facilities',
        '/institutions',
        '/organizations',
        '/login',
        '/register'
      ],
      ignore: [
        '/dev',
        '/dev/**',
        '/app',
        '/app/**',
        '/news/**',
        '/facilities/**',
        '/potentials/**',
        '/organizations',
        '/organizations/**'
      ]
    }
  },
  routeRules: {
    '/app/**': { prerender: false },
    '/dev/**': { prerender: false },
    '/news/**': { prerender: false },
    '/facilities/**': { prerender: false },
    '/potentials/**': { prerender: false },
    '/organizations/**': { prerender: false }
  },

  imports: {
    autoImport: true
  },

  app: {
    head: {
      titleTemplate: (titleChunk: string) => (titleChunk ? `${titleChunk} · Obayan` : 'Obayan · Modern Pesantren Platform'),
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
      devVersion: process.env.NUXT_PUBLIC_DEV_VERSION || false,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://obayan.id',
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || 'Obayan',
      siteDescription: process.env.NUXT_PUBLIC_SITE_DESCRIPTION || 'Obayan — platform modern untuk pondok pesantren: web profile, SIAKAD, pembayaran, akademik, absensi, kunjungan, pelanggaran, perizinan — terintegrasi RFID & Fingerprint (ToriID).',
      twitterSite: process.env.NUXT_PUBLIC_TWITTER_SITE || '@obayan',
      
      clientName: process.env.NUXT_PUBLIC_CLIENT_NAME || 'Obayan',
      clientDisplayName: process.env.NUXT_PUBLIC_CLIENT_DISPLAY_NAME || 'Obayan',

      appName: process.env.NUXT_PUBLIC_APP_NAME || 'Obayan',
      appSubtitle: process.env.NUXT_PUBLIC_APP_SUBTITLE || 'Modern Education Platform',
      appLogo: process.env.NUXT_PUBLIC_APP_LOGO || '/assets/logo.png',
      appThemeColor: process.env.NUXT_PUBLIC_APP_THEME_COLOR || '#16a34a',
      
      heroBgImage: process.env.NUXT_PUBLIC_HERO_BG_IMAGE || '',
      heroTitleMain: process.env.NUXT_PUBLIC_HERO_TITLE_MAIN || '',
      heroTitleHighlight: process.env.NUXT_PUBLIC_HERO_TITLE_HIGHLIGHT || '',
      heroTagline: process.env.NUXT_PUBLIC_HERO_TAGLINE || '',
      heroSubtitle: process.env.NUXT_PUBLIC_HERO_SUBTITLE || '',
      waIntl: process.env.NUXT_PUBLIC_WA_INTL || '',
      schoolLevels: process.env.NUXT_PUBLIC_SCHOOL_LEVELS || '',
      ppdbTimeline: process.env.NUXT_PUBLIC_PPDB_TIMELINE || '',
      heroPrimaryLabel: process.env.NUXT_PUBLIC_HERO_PRIMARY_LABEL || '',
      heroPrimaryHref: process.env.NUXT_PUBLIC_HERO_PRIMARY_HREF || '',
      heroSecondaryLabel: process.env.NUXT_PUBLIC_HERO_SECONDARY_LABEL || '',
      heroSecondaryHref: process.env.NUXT_PUBLIC_HERO_SECONDARY_HREF || '',
      heroPpdbLabel: process.env.NUXT_PUBLIC_HERO_PPDB_LABEL || '',
      heroPpdbHref: process.env.NUXT_PUBLIC_HERO_PPDB_HREF || '',
      adminLabel: process.env.NUXT_PUBLIC_ADMIN_LABEL || '',

      cloudinaryCloudName: process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || '',
      cloudinaryUploadPreset: process.env.NUXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',

      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || '',
      apiRemoteEnabled: process.env.NUXT_PUBLIC_API_REMOTE_ENABLED || false,
      
      midtransClientKey: process.env.NUXT_PUBLIC_MIDTRANS_CLIENT_KEY || '',
      midtransIsProduction: process.env.NUXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'

    },
    midtransServerKey: process.env.MIDTRANS_SERVER_KEY || '',
    midtransIsProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',

    databaseHost: process.env.DATABASE_HOST || 'localhost',
    databasePort: process.env.DATABASE_PORT || '3306',
    databaseUser: process.env.DATABASE_USER || 'root',
    databasePassword: process.env.DATABASE_PASSWORD || '',
    databaseName: process.env.DATABASE_NAME || 'obayan',
    databaseConnectionLimit: process.env.DATABASE_CONNECTION_LIMIT || '10',
    jwtSecret: process.env.JWT_SECRET || 'supersecretkey',
    authSecret: process.env.AUTH_SECRET || 'arsades_secret_2026',
    authCookieName: process.env.AUTH_COOKIE_NAME || 'arsades_auth',
    authCookieMaxAge: process.env.AUTH_COOKIE_MAX_AGE || '604800000',
  },

  modules: ['nuxt-tiptap-editor'],
  tiptap: {
    prefix: 'Tiptap',
  },
})