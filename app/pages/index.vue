<template>
  <div>
    <!-- CMS mode: mengambil data dari path "/" -->
    <ClientOnly v-if="cmsActive">
      <component
        v-for="section in enabledSections"
        :key="section.id"
        :is="resolveSection(section.key)"
        v-bind="section.props || {}"
      />
    </ClientOnly>

    <!-- Fallback statis kalau path "/" belum published / belum ada section -->
    <template v-else>
      <HeaderHero />
      <InfoHero />
      <BlogHero />
      <HeroFacilityHero />
      <InvitationHero />
      <HeroProgramHero />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useHead, useRuntimeConfig, useSeoMeta } from '#imports'
import { useWeb } from '~/composables/data/useWeb'

import HeaderHero from '~/components/hero/HeaderHero.vue'
import InfoHero from '~/components/hero/InfoHero.vue'
import BlogHero from '~/components/hero/BlogHero.vue'
import InvitationHero from '~/components/hero/InvitationHero.vue'
import HeroFacilityHero from '~/components/hero/FacilityHero.vue'
import HeroProgramHero from '~/components/hero/ProgramHero.vue'

const HOME_PATH = '/'

const route = useRoute()
const config = useRuntimeConfig()
const web = useWeb()

const {
  meta,
  sortedSections,
  subscribePage,
  normalizePath,
  currentPath
} = web as any

const pageReady = ref(false)

async function loadHomePage() {
  const path = normalizePath ? normalizePath(HOME_PATH) : HOME_PATH

  if (typeof currentPath?.value !== 'undefined') {
    currentPath.value = path
  }

  ;(web as any)?.setActivePath?.(path)

  await subscribePage(path)

  pageReady.value = true
}

onMounted(async () => {
  await loadHomePage()
})

const enabledSections = computed(() => {
  return sortedSections.value.filter((section: any) => section.enabled !== false)
})

const cmsActive = computed(() => {
  const status = meta.value?.status || 'draft'
  return pageReady.value && enabledSections.value.length > 0 && status === 'published'
})

const registry: Record<string, any> = {
  HeaderHero,
  HeroHeaderHero: HeaderHero,

  InfoHero,
  HeroInfoHero: InfoHero,

  BlogHero,
  HeroBlogHero: BlogHero,

  InvitationHero,
  HeroInvitationHero: InvitationHero,

  FacilityHero: HeroFacilityHero,
  HeroFacilityHero,

  ProgramHero: HeroProgramHero,
  HeroProgramHero
}

const heroModules = import.meta.glob('~/components/hero/**/*.vue', {
  eager: true
}) as Record<string, any>

const UnknownSection = defineComponent({
  name: 'UnknownSection',
  props: {
    sectionKey: {
      type: String,
      required: true
    }
  },
  setup(props) {
    return () =>
      h('div', { class: 'p-4' }, [
        h(
          'div',
          {
            class:
              'rounded-lg border border-dashed p-4 text-sm text-gray-500 dark:text-neutral-400'
          },
          [
            'Unknown section: ',
            h('b', props.sectionKey)
          ]
        )
      ])
  }
})

function resolveSection(key: string) {
  if (registry[key]) return registry[key]

  for (const path in heroModules) {
    if (path.endsWith(`/${key}.vue`)) {
      return heroModules[path].default
    }
  }

  return defineComponent({
    name: `UnknownSection_${key}`,
    setup() {
      return () => h(UnknownSection, { sectionKey: key })
    }
  })
}

/* =========================
   SEO META - sync path "/"
========================= */

const siteUrl = computed(() => {
  const raw =
    config.public.siteUrl ||
    config.public.siteURL ||
    config.public.site_url ||
    'https://alinayah.sencra.io'

  return String(raw).replace(/\/$/, '')
})

const siteName = computed(() => {
  return String(
    config.public.siteName ||
      config.public.clientDisplayName ||
      'Ponpes Alinayah'
  )
})

const clientDisplayName = computed(() => {
  return String(config.public.clientDisplayName || siteName.value)
})

const appLogo = computed(() => {
  return String(config.public.appLogo || '/assets/logo.png')
})

const themeColor = computed(() => {
  return String(config.public.appThemeColor || config.public.themeColor || '#16a34a')
})

const fallbackTitle = computed(() => {
  return `${clientDisplayName.value} | Pesantren Inovatif & Informatif`
})

const fallbackDescription = computed(() => {
  return String(
    config.public.siteDescription ||
      `Selamat datang di ${clientDisplayName.value}. Informasi profil, program, berita, fasilitas, kegiatan santri, dan pendaftaran online.`
  )
})

function cleanText(value?: string) {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function limitText(value?: string, max = 160) {
  const clean = cleanText(value)

  if (!clean) return ''

  return clean.length > max
    ? `${clean.slice(0, max).trim()}...`
    : clean
}

function absoluteUrl(path?: string | null) {
  const raw = String(path || appLogo.value || '/assets/logo.png').trim()

  if (/^https?:\/\//i.test(raw)) return raw

  return `${siteUrl.value}${raw.startsWith('/') ? raw : `/${raw}`}`
}

const canonicalUrl = computed(() => {
  return `${siteUrl.value}/`
})

const seoTitle = computed(() => {
  return meta.value?.title || fallbackTitle.value
})

const seoDescription = computed(() => {
  return limitText(meta.value?.description || fallbackDescription.value, 160)
})

const seoImage = computed(() => {
  return absoluteUrl(meta.value?.ogImage || appLogo.value)
})

const twitterSite = computed(() => {
  return config.public.twitterSite || undefined
})

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,

  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogType: 'website',
  ogUrl: () => canonicalUrl.value,
  ogImage: () => seoImage.value,
  ogImageAlt: () => seoTitle.value,
  ogSiteName: () => siteName.value,
  ogLocale: 'id_ID',

  twitterCard: 'summary_large_image',
  twitterTitle: () => seoTitle.value,
  twitterDescription: () => seoDescription.value,
  twitterImage: () => seoImage.value,
  twitterImageAlt: () => seoTitle.value,
  twitterSite: () => twitterSite.value,

  robots: () => {
    return meta.value?.status === 'published' ? 'index, follow' : 'noindex, nofollow'
  },

  themeColor: () => themeColor.value
})

useHead(() => {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: siteName.value,
    url: siteUrl.value,
    logo: absoluteUrl(appLogo.value)
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName.value,
    url: siteUrl.value,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl.value}/search?q={query}`,
      'query-input': 'required name=query'
    }
  }

  return {
    htmlAttrs: {
      lang: 'id'
    },
    link: [
      { rel: 'canonical', href: canonicalUrl.value },
      { rel: 'icon', href: appLogo.value },
      { rel: 'apple-touch-icon', href: appLogo.value }
    ],
    meta: [
      { name: 'thumbnail', content: seoImage.value },
      { name: 'application-name', content: siteName.value },
      { name: 'apple-mobile-web-app-title', content: siteName.value },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(websiteJsonLd)
      },
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(organizationJsonLd)
      }
    ]
  }
})
</script>