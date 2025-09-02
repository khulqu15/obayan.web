<template>
  <div>
    <HeroObayan />
    <MarqueeLogos />
    <FeatureBlocks />
    <ProductCards />
    <IntegrationToriId />
    <StepsHowItWorks />
    <PricingPlans />
    <FAQAccordion />
    <CTASection />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute, useRuntimeConfig, useSeoMeta, useHead } from '#imports'
  import HeroObayan from '~/components/landing/HeroObayan.vue'
  import MarqueeLogos from '~/components/landing/MarqueeLogos.vue'
  import FeatureBlocks from '~/components/landing/FeatureBlocks.vue'
  import ProductCards from '~/components/landing/ProductCards.vue'
  import IntegrationToriId from '~/components/landing/IntegrationToriId.vue'
  import StepsHowItWorks from '~/components/landing/StepsHowItWorks.vue'
  import PricingPlans from '~/components/landing/PricingPlans.vue'
  import FAQAccordion from '~/components/landing/FAQAccordion.vue'
  import CTASection from '~/components/landing/CTASection.vue'

  
  const route  = useRoute()
  const config = useRuntimeConfig()

  const siteUrl   = config.public.siteUrl   || 'https://obayan.sencra.io'
  const siteName  = config.public.siteName  || 'Obayan'
  const twitterId = config.public.twitterSite || '@obayan_id'
  const ogImage   = '/og-obayan.png'
  const logoPath  = '/logo.png'

  const pageTitle = 'Obayan · Platform Pesantren Modern'
  const pageDesc  = 'Obayan menyatukan web profile, SIAKAD, pembayaran, akademik, absensi RFID & Fingerprint (ToriID), kunjungan, pelanggaran, dan perizinan dalam satu portal yang ringan dan menyenangkan.'
  const pageUrl = computed(() => new URL(route.fullPath || '/', siteUrl).toString())

  useSeoMeta({
    title: pageTitle,
    description: pageDesc,
    ogTitle: pageTitle,
    ogDescription: pageDesc,
    ogType: 'website',
    ogSiteName: siteName,
    ogUrl: pageUrl,
    ogImage: () => siteUrl + ogImage,
    ogLocale: 'id_ID',
    twitterCard: 'summary_large_image',
    twitterSite: () => twitterId,
    themeColor: '#58CC02',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    applicationName: siteName,
    appleMobileWebAppTitle: siteName,
    keywords: 'obayan, pesantren, siakad, rfid, fingerprint, toriid, absensi, pembayaran, qris'
  })

  useHead({
    htmlAttrs: { lang: 'id' },
    link: [
      { rel: 'canonical', href: pageUrl.value },
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' }
    ],
    meta: [
      { name: 'format-detection', content: 'telephone=no' }
    ],
    script: [
      // Organization
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: siteName,
          url: siteUrl,
          logo: siteUrl + logoPath,
          sameAs: [
            'https://instagram.com/obayan',
            'https://www.youtube.com/@obayan',
            'https://www.linkedin.com/company/obayan'
          ]
        })
      },
      // WebSite + SearchAction
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: siteName,
          url: siteUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${siteUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        })
      },
      // SoftwareApplication (SaaS)
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: siteName,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          description: pageDesc,
          url: siteUrl,
          image: siteUrl + ogImage,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'IDR',
            price: '399000',
            category: 'subscription',
            availability: 'https://schema.org/InStock'
          }
        })
      },
      // FAQPage (selaraskan dengan konten FAQ di landing kamu)
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Apa itu ToriID dan bagaimana integrasinya?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'ToriID adalah perangkat RFID + Fingerprint yang terhubung ke Obayan melalui gateway. Setiap scan dikirim ke endpoint aman bertanda tenant untuk absensi, izin, dan kunjungan secara real-time.'
              }
            },
            {
              '@type': 'Question',
              name: 'Apakah bisa custom branding?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Bisa. Logo, warna, domain, hingga susunan halaman dapat disesuaikan tanpa mengubah kode inti.'
              }
            },
            {
              '@type': 'Question',
              name: 'Metode pembayaran apa yang didukung?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'QRIS, Virtual Account, transfer manual dengan unggah bukti, dan rekonsiliasi otomatis.'
              }
            },
            {
              '@type': 'Question',
              name: 'Bagaimana skema lisensi?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Berbasis langganan per modul (bulanan atau tahunan) dengan opsi diskon untuk multi-campus.'
              }
            }
          ]
        })
      }
    ]
  })
</script>