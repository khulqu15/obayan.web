<template>
  <div>
    <HeroObayan />
    <MarqueeLogos />
    <FeatureBlocks />
    <ProductCards />
    <CaseStudy/>
    <ProductView/>
    <IntegrationToriId />
    <StepsHowItWorks />
    <PricingPlans />
    <FAQAccordion />
    <CTASection />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRuntimeConfig, useSeoMeta, useHead, useRequestURL } from 'nuxt/app'

import HeroObayan from '../components/landing/HeroObayan.vue'
import MarqueeLogos from '../components/landing/MarqueeLogos.vue'
import FeatureBlocks from '../components/landing/FeatureBlocks.vue'
import ProductCards from '../components/landing/ProductCards.vue'
import IntegrationToriId from '../components/landing/IntegrationToriId.vue'
import StepsHowItWorks from '../components/landing/StepsHowItWorks.vue'
import PricingPlans from '../components/landing/PricingPlans.vue'
import FAQAccordion from '../components/landing/FAQAccordion.vue'
import CTASection from '../components/landing/CTASection.vue'
import CaseStudy from '../components/landing/CaseStudy.vue'
import ProductView from '../components/landing/ProductView.vue'

const route = useRoute()
const config = useRuntimeConfig()
const requestUrl = useRequestURL()

function trimSlash(value: string) {
  return String(value || '').replace(/\/$/, '')
}

function absoluteUrl(pathOrUrl: string, baseUrl: string) {
  const value = String(pathOrUrl || '').trim()

  if (!value) return baseUrl
  if (/^https?:\/\//i.test(value)) return value

  return `${trimSlash(baseUrl)}${value.startsWith('/') ? value : `/${value}`}`
}

const siteUrl = computed(() => {
  const fromEnv = String(
    config.public.siteUrl ||
    config.public.appUrl ||
    config.public.baseUrl ||
    ''
  ).trim()

  if (fromEnv) return trimSlash(fromEnv)

  const origin = String(requestUrl.origin || 'https://obayan.id')
  return trimSlash(origin)
})

const pageUrl = computed(() => {
  return new URL(route.fullPath || '/', siteUrl.value).toString()
})

const siteName = computed(() => {
  return String(config.public.siteName || 'Obayan')
})

const seoTitle = computed(() => {
  return 'Obayan | Platform Pendidikan Digital untuk Sekolah & Pesantren'
})

const seoDescription = computed(() => {
  return 'Obayan membantu sekolah, pesantren, dan yayasan mengelola website, SIAKAD, absensi, pembayaran, aplikasi wali, RFID, dan data akademik dalam satu platform digital.'
})

const seoKeywords = computed(() => {
  return [
    'Obayan',
    'platform pendidikan digital',
    'website sekolah',
    'website pesantren',
    'SIAKAD pesantren',
    'SIAKAD sekolah',
    'sistem informasi akademik',
    'aplikasi wali santri',
    'absensi RFID',
    'absensi fingerprint',
    'pembayaran sekolah',
    'pembayaran pesantren',
    'dashboard admin sekolah',
    'platform yayasan pendidikan',
    'digitalisasi pesantren',
    'sistem manajemen sekolah',
    'software sekolah Indonesia',
    'software pesantren Indonesia'
  ].join(', ')
})

const ogImage = computed(() => {
  return absoluteUrl(
    String(config.public.ogImage || '/og-obayan.png'),
    siteUrl.value
  )
})

const logoUrl = computed(() => {
  return absoluteUrl(
    String(config.public.appLogo || config.public.logo || '/logo.png'),
    siteUrl.value
  )
})

const faviconUrl = computed(() => {
  return absoluteUrl(
    String(config.public.favicon || config.public.appLogo || '/favicon.ico'),
    siteUrl.value
  )
})

const faviconPngUrl = computed(() => {
  return absoluteUrl(
    String(config.public.faviconPng || '/favicon.png'),
    siteUrl.value
  )
})

const appleTouchIconUrl = computed(() => {
  return absoluteUrl(
    String(config.public.appleTouchIcon || '/apple-touch-icon.png'),
    siteUrl.value
  )
})

const twitterSite = computed(() => {
  return String(config.public.twitterSite || '@obayan_id')
})

const instagramUrl = computed(() => {
  return String(config.public.instagramUrl || 'https://instagram.com/obayan')
})

const linkedinUrl = computed(() => {
  return String(config.public.linkedinUrl || 'https://www.linkedin.com/company/obayan')
})

const youtubeUrl = computed(() => {
  return String(config.public.youtubeUrl || 'https://www.youtube.com/@obayan')
})

const sameAsLinks = computed(() => {
  return [
    instagramUrl.value,
    linkedinUrl.value,
    youtubeUrl.value
  ].filter(Boolean)
})

const faqItems = [
  {
    question: 'Apa itu Obayan?',
    answer:
      'Obayan adalah platform pendidikan digital untuk membantu sekolah, pesantren, dan yayasan mengelola website, SIAKAD, pembayaran, absensi, aplikasi wali, dan data operasional dalam satu sistem.'
  },
  {
    question: 'Siapa yang cocok menggunakan Obayan?',
    answer:
      'Obayan cocok digunakan oleh sekolah, pondok pesantren, yayasan pendidikan, madrasah, lembaga kursus, dan institusi pendidikan yang ingin melakukan digitalisasi layanan.'
  },
  {
    question: 'Apakah Obayan menyediakan website lembaga?',
    answer:
      'Ya. Obayan menyediakan website informasi berbasis CMS sehingga lembaga dapat mengelola profil, berita, galeri, program, pengumuman, dan informasi pendaftaran secara mandiri.'
  },
  {
    question: 'Apakah Obayan mendukung SIAKAD?',
    answer:
      'Ya. Obayan dapat digunakan untuk mengelola data peserta didik, kelas, absensi, akademik, nilai, pembayaran, perizinan, pelanggaran, dan laporan operasional.'
  },
  {
    question: 'Apakah Obayan bisa memakai domain sendiri?',
    answer:
      'Bisa. Lembaga dapat menggunakan subdomain Obayan atau domain sendiri sesuai kebutuhan dan konfigurasi layanan.'
  },
  {
    question: 'Apakah Obayan mendukung absensi RFID atau fingerprint?',
    answer:
      'Obayan dapat mendukung integrasi perangkat seperti RFID dan fingerprint untuk membantu proses absensi dan monitoring kehadiran secara lebih rapi.'
  }
]

const offerItems = [
  {
    name: 'Website Pendidikan berbasis CMS',
    description:
      'Website resmi lembaga untuk profil, berita, galeri, program, pengumuman, dan informasi pendaftaran.'
  },
  {
    name: 'Sistem Informasi Akademik',
    description:
      'Pengelolaan data siswa atau santri, kelas, absensi, nilai, akademik, pembayaran, dan laporan.'
  },
  {
    name: 'Aplikasi Wali dan Monitoring',
    description:
      'Akses informasi untuk wali atau orang tua terkait absensi, nilai, pembayaran, dan pengumuman.'
  },
  {
    name: 'Integrasi RFID dan Fingerprint',
    description:
      'Integrasi perangkat absensi untuk mendukung monitoring kehadiran secara lebih cepat dan terdokumentasi.'
  }
]

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  keywords: () => seoKeywords.value,

  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',

  ogType: 'website',
  ogLocale: 'id_ID',
  ogSiteName: () => siteName.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogUrl: () => pageUrl.value,
  ogImage: () => ogImage.value,
  ogImageAlt: 'Obayan platform pendidikan digital untuk sekolah dan pesantren',
  ogImageWidth: '1200',
  ogImageHeight: '630',

  twitterCard: 'summary_large_image',
  twitterTitle: () => seoTitle.value,
  twitterDescription: () => seoDescription.value,
  twitterImage: () => ogImage.value,
  twitterSite: () => twitterSite.value,

  themeColor: '#16a34a',
  applicationName: () => siteName.value,
  appleMobileWebAppTitle: () => siteName.value
})

useHead(() => {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Obayan',
    alternateName: [
      'Obayan Platform',
      'Obayan Education Platform',
      'Obayan SIAKAD'
    ],
    url: siteUrl.value,
    logo: logoUrl.value,
    image: ogImage.value,
    description: seoDescription.value,
    sameAs: sameAsLinks.value,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        areaServed: 'ID',
        availableLanguage: ['Indonesian', 'English'],
        email: String(config.public.contactEmail || 'team.sencra@gmail.com')
      }
    ]
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName.value,
    url: siteUrl.value,
    inLanguage: 'id-ID',
    description: seoDescription.value,
    publisher: {
      '@type': 'Organization',
      name: 'Obayan',
      logo: {
        '@type': 'ImageObject',
        url: logoUrl.value
      }
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl.value}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  }

  const softwareApplicationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Obayan',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web, Android, iOS',
    url: siteUrl.value,
    image: ogImage.value,
    description: seoDescription.value,
    offers: {
      '@type': 'Offer',
      price: '250000',
      priceCurrency: 'IDR',
      availability: 'https://schema.org/InStock',
      category: 'Subscription'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '27'
    }
  }

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Obayan Platform Pendidikan Digital',
    serviceType: 'Platform digital pendidikan, website sekolah, SIAKAD, pembayaran, absensi, dan aplikasi wali',
    provider: {
      '@type': 'Organization',
      name: 'Obayan',
      url: siteUrl.value
    },
    areaServed: {
      '@type': 'Country',
      name: 'Indonesia'
    },
    audience: [
      {
        '@type': 'Audience',
        audienceType: 'Sekolah'
      },
      {
        '@type': 'Audience',
        audienceType: 'Pesantren'
      },
      {
        '@type': 'Audience',
        audienceType: 'Yayasan Pendidikan'
      }
    ],
    description:
      'Layanan digital untuk membantu lembaga pendidikan mengelola website, SIAKAD, absensi, pembayaran, aplikasi wali, dan operasional lembaga.'
  }

  const offerCatalogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Layanan Obayan',
    itemListElement: offerItems.map((item, index) => ({
      '@type': 'Offer',
      position: index + 1,
      name: item.name,
      description: item.description,
      url: pageUrl.value,
      availability: 'https://schema.org/InStock',
      priceCurrency: 'IDR'
    }))
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: siteUrl.value
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Obayan Platform Pendidikan Digital',
        item: pageUrl.value
      }
    ]
  }

  return {
    htmlAttrs: {
      lang: 'id'
    },

    link: [
      {
        rel: 'canonical',
        href: pageUrl.value
      },
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: faviconUrl.value
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: faviconPngUrl.value
      },
      {
        rel: 'shortcut icon',
        href: faviconUrl.value
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: appleTouchIconUrl.value
      },
      {
        rel: 'manifest',
        href: '/site.webmanifest'
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com'
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: ''
      },
      {
        rel: 'dns-prefetch',
        href: 'https://fonts.googleapis.com'
      },
      {
        rel: 'dns-prefetch',
        href: 'https://fonts.gstatic.com'
      }
    ],

    meta: [
      {
        name: 'format-detection',
        content: 'telephone=no'
      },
      {
        name: 'color-scheme',
        content: 'light'
      },
      {
        name: 'mobile-web-app-capable',
        content: 'yes'
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes'
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'default'
      },
      {
        name: 'author',
        content: 'Obayan'
      },
      {
        name: 'publisher',
        content: 'Obayan'
      },
      {
        name: 'category',
        content: 'Education Technology'
      },
      {
        name: 'classification',
        content: 'Education Platform, School Management System, Pesantren Digital Platform'
      }
    ],

    script: [
      {
        key: 'obayan-organization-jsonld',
        type: 'application/ld+json',
        innerHTML: JSON.stringify(organizationJsonLd)
      },
      {
        key: 'obayan-website-jsonld',
        type: 'application/ld+json',
        innerHTML: JSON.stringify(websiteJsonLd)
      },
      {
        key: 'obayan-software-application-jsonld',
        type: 'application/ld+json',
        innerHTML: JSON.stringify(softwareApplicationJsonLd)
      },
      {
        key: 'obayan-service-jsonld',
        type: 'application/ld+json',
        innerHTML: JSON.stringify(serviceJsonLd)
      },
      {
        key: 'obayan-offer-catalog-jsonld',
        type: 'application/ld+json',
        innerHTML: JSON.stringify(offerCatalogJsonLd)
      },
      {
        key: 'obayan-faq-jsonld',
        type: 'application/ld+json',
        innerHTML: JSON.stringify(faqJsonLd)
      },
      {
        key: 'obayan-breadcrumb-jsonld',
        type: 'application/ld+json',
        innerHTML: JSON.stringify(breadcrumbJsonLd)
      }
    ]
  }
})
</script>