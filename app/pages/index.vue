<template>
  <div v-if="isMartopuroDomain">
    <HeaderHeroVillage />
    <BlogHeroVillage />
    <InvitationHeroVillage />
    <InfoHeroVillage />
    <ArsadesHeroVillage />
  </div>
  <div v-if="isObayanDomain">
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

import HeaderHeroVillage from '../components/village/HeaderHero.vue'
import BlogHeroVillage from '../components/village/BlogHero.vue'
import InvitationHeroVillage from '../components/village/InvitationHero.vue'
import InfoHeroVillage from '../components/village/InfoHero.vue'
import ArsadesHeroVillage from '../components/village/ArsadesHero.vue'

const route  = useRoute()
const config = useRuntimeConfig()
const requestUrl = useRequestURL()
const currentHostname = computed(() => {
  return String(requestUrl.hostname || '').replace(/^www\./, '').toLowerCase()
})

const isMartopuroDomain = computed(() => {
  const host = String(currentHostname.value || '')
    .replace(/^www\./, '')
    .replace(/:\d+$/, '')
    .toLowerCase()

  return (
    host === 'martopuro.com' ||
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === 'obayanweb-production.up.railway.app' ||
    host.endsWith('.up.railway.app')
  )
})

const isObayanDomain = computed(() => {
  return (
    currentHostname.value === 'obayan.id'
  )
})

const isSencraDomain = computed(() => {
  return currentHostname.value === 'sencra.io'
})

type SeoProfile = {
  siteUrl: string
  siteName: string
  title: string
  description: string
  keywords: string
  ogImage: string
  logo: string
  favicon: string
  themeColor: string
  twitterSite: string
  organizationType: string
  sameAs: string[]
  faq: {
    question: string
    answer: string
  }[]
}

function trimSlash(value: string) {
  return String(value || '').replace(/\/$/, '')
}

function absoluteUrl(pathOrUrl: string, baseUrl: string) {
  const value = String(pathOrUrl || '')

  if (!value) return baseUrl
  if (/^https?:\/\//i.test(value)) return value

  return `${trimSlash(baseUrl)}${value.startsWith('/') ? value : `/${value}`}`
}

const currentOrigin = computed(() => {
  return trimSlash(requestUrl.origin || 'https://obayan.id')
})

const siteBaseUrl = computed(() => {
  if (isMartopuroDomain.value) {
    return currentHostname.value === 'localhost' || currentHostname.value === '127.0.0.1'
      ? currentOrigin.value
      : 'https://martopuro.com'
  }

  if (isObayanDomain.value) {
    return 'https://obayan.id'
  }

  if (isSencraDomain.value) {
    return 'https://sencra.io'
  }

  return currentOrigin.value
})

const seoProfile = computed<SeoProfile>(() => {
  if (isMartopuroDomain.value) {
    const logo = String(config.public.appLogo || '/assets/images/logo-martopuro.png')
    const ogImage = String(config.public.ogImage || '/og-martopuro.png')

    return {
      siteUrl: siteBaseUrl.value,
      siteName: 'Desa Martopuro',
      title: 'Desa Martopuro · Portal Resmi Pemerintah Desa',
      description:
        'Portal resmi Desa Martopuro, Kecamatan Purwosari, Kabupaten Pasuruan. Informasi desa, berita, layanan surat online, APBDes, lembaga desa, fasilitas, potensi lokal, dan kegiatan masyarakat.',
      keywords:
        'Desa Martopuro, Martopuro, Purwosari, Pasuruan, website desa, portal desa, layanan surat online, APBDes, berita desa, pemerintah desa Martopuro',
      ogImage,
      logo,
      favicon: logo,
      themeColor: '#2563eb',
      twitterSite: '',
      organizationType: 'GovernmentOrganization',
      sameAs: [
        String(config.public.instagramUrl || ''),
        String(config.public.facebookUrl || ''),
        String(config.public.youtubeUrl || '')
      ].filter(Boolean),
      faq: [
        {
          question: 'Apa itu website resmi Desa Martopuro?',
          answer:
            'Website resmi Desa Martopuro adalah portal informasi dan layanan digital untuk masyarakat Desa Martopuro, Kecamatan Purwosari, Kabupaten Pasuruan.'
        },
        {
          question: 'Informasi apa saja yang tersedia di website Desa Martopuro?',
          answer:
            'Website ini memuat profil desa, berita, agenda, lembaga desa, fasilitas, potensi lokal, APBDes, dan informasi layanan publik.'
        },
        {
          question: 'Apakah warga bisa mengakses layanan surat online?',
          answer:
            'Website dapat menyediakan layanan pengajuan surat online sesuai fitur yang diaktifkan oleh Pemerintah Desa Martopuro.'
        }
      ]
    }
  }

  if (isObayanDomain.value) {
    return {
      siteUrl: siteBaseUrl.value,
      siteName: 'Obayan',
      title: 'Obayan · Platform Pesantren Modern',
      description:
        'Obayan menyatukan web profile, SIAKAD, pembayaran, akademik, absensi RFID & Fingerprint, kunjungan, pelanggaran, dan perizinan dalam satu portal.',
      keywords:
        'obayan, pesantren, siakad, rfid, fingerprint, toriid, absensi, pembayaran, qris, aplikasi pesantren',
      ogImage: '/og-obayan.png',
      logo: '/logo.png',
      favicon: String(config.public.appLogo || '/favicon.png'),
      themeColor: '#58CC02',
      twitterSite: String(config.public.twitterSite || '@obayan_id'),
      organizationType: 'Organization',
      sameAs: [
        'https://instagram.com/obayan',
        'https://www.youtube.com/@obayan',
        'https://www.linkedin.com/company/obayan'
      ],
      faq: [
        {
          question: 'Apa itu Obayan?',
          answer:
            'Obayan adalah platform digital untuk lembaga pendidikan dan pesantren yang mencakup website, SIAKAD, pembayaran, absensi, dan modul operasional.'
        },
        {
          question: 'Apakah Obayan bisa custom branding?',
          answer:
            'Bisa. Logo, warna, domain, konten website, dan susunan halaman dapat disesuaikan dengan kebutuhan lembaga.'
        },
        {
          question: 'Metode pembayaran apa yang didukung?',
          answer:
            'Obayan dapat mendukung QRIS, Virtual Account, transfer manual dengan unggah bukti, dan rekonsiliasi pembayaran sesuai konfigurasi.'
        }
      ]
    }
  }

  return {
    siteUrl: siteBaseUrl.value,
    siteName: String(config.public.siteName || 'Sencra'),
    title: String(config.public.siteTitle || 'Sencra · Digital Platform'),
    description: String(
      config.public.siteDescription ||
        'Platform digital untuk website, sistem informasi, otomasi bisnis, dan layanan teknologi.'
    ),
    keywords: String(config.public.siteKeywords || 'sencra, software, website, platform digital'),
    ogImage: String(config.public.ogImage || '/og.png'),
    logo: String(config.public.appLogo || '/logo.png'),
    favicon: String(config.public.appLogo || '/favicon.png'),
    themeColor: '#2563eb',
    twitterSite: String(config.public.twitterSite || ''),
    organizationType: 'Organization',
    sameAs: [],
    faq: []
  }
})

const pageUrl = computed(() => {
  return new URL(route.fullPath || '/', seoProfile.value.siteUrl).toString()
})

const absoluteOgImage = computed(() => {
  return absoluteUrl(seoProfile.value.ogImage, seoProfile.value.siteUrl)
})

const absoluteLogo = computed(() => {
  return absoluteUrl(seoProfile.value.logo, seoProfile.value.siteUrl)
})

const absoluteFavicon = computed(() => {
  return absoluteUrl(seoProfile.value.favicon, seoProfile.value.siteUrl)
})

useSeoMeta({
  title: () => seoProfile.value.title,
  description: () => seoProfile.value.description,

  ogTitle: () => seoProfile.value.title,
  ogDescription: () => seoProfile.value.description,
  ogType: 'website',
  ogSiteName: () => seoProfile.value.siteName,
  ogUrl: () => pageUrl.value,
  ogImage: () => absoluteOgImage.value,
  ogLocale: 'id_ID',

  twitterCard: 'summary_large_image',
  twitterTitle: () => seoProfile.value.title,
  twitterDescription: () => seoProfile.value.description,
  twitterImage: () => absoluteOgImage.value,
  twitterSite: () => seoProfile.value.twitterSite,

  themeColor: () => seoProfile.value.themeColor,
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  applicationName: () => seoProfile.value.siteName,
  appleMobileWebAppTitle: () => seoProfile.value.siteName,
  keywords: () => seoProfile.value.keywords
})

useHead(() => {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': seoProfile.value.organizationType,
    name: seoProfile.value.siteName,
    url: seoProfile.value.siteUrl,
    logo: absoluteLogo.value,
    sameAs: seoProfile.value.sameAs
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seoProfile.value.siteName,
    url: seoProfile.value.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${seoProfile.value.siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  }

  const faqJsonLd = seoProfile.value.faq.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: seoProfile.value.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }))
      }
    : null

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
        href: absoluteFavicon.value
      },
      {
        rel: 'shortcut icon',
        href: absoluteFavicon.value
      },
      {
        rel: 'apple-touch-icon',
        href: absoluteFavicon.value
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: ''
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com'
      }
    ],
    meta: [
      {
        name: 'format-detection',
        content: 'telephone=no'
      }
    ],
    script: [
      {
        key: 'organization-jsonld',
        type: 'application/ld+json',
        innerHTML: JSON.stringify(organizationJsonLd)
      },
      {
        key: 'website-jsonld',
        type: 'application/ld+json',
        innerHTML: JSON.stringify(websiteJsonLd)
      },
      ...(faqJsonLd
        ? [
            {
              key: 'faq-jsonld',
              type: 'application/ld+json',
              innerHTML: JSON.stringify(faqJsonLd)
            }
          ]
        : [])
    ]
  }
})
</script>