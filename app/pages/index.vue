<template>
  <div>
    <!-- CMS mode -->
    <ClientOnly v-if="cmsActive">
      <component
        v-for="s in enabledSections"
        :is="resolveSection(s.key)"
        :key="s.id"
        v-bind="s.props || {}"
      />
    </ClientOnly>

    <!-- Fallback ke layout statis (kalau belum ada data CMS atau status draft) -->
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
import { computed, onMounted } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'
import { useWeb } from '~/composables/data/useWeb'

import HeaderHero from '~/components/hero/HeaderHero.vue'
import InfoHero from '~/components/hero/InfoHero.vue'
import BlogHero from '~/components/hero/BlogHero.vue'
import InvitationHero from '~/components/hero/InvitationHero.vue'
import HeroFacilityHero from '~/components/hero/FacilityHero.vue'
import HeroProgramHero from '~/components/hero/ProgramHero.vue'

const {
  meta, sortedSections, subscribePage,
} = useWeb()

onMounted(() => {
  subscribePage('/')
})

const enabledSections = computed(() =>
  sortedSections.value.filter(s => s.enabled !== false)
)

const cmsActive = computed(() =>
  enabledSections.value.length > 0 && (meta.value?.status || 'draft') === 'published'
)

const registry: Record<string, any> = {
  HeaderHero,
  HeroHeaderHero: HeaderHero,
  InfoHero,
  HeroInfoHero: InfoHero,
  BlogHero,
  HeroBlogHero: BlogHero,
  InvitationHero,
  HeroInvitationHero: InvitationHero,
  HeroFacilityHero,
  HeroProgramHero,
}

const heroModules = import.meta.glob('~/components/hero/**/*.vue', { eager: true }) as Record<string, any>
function resolveSection(key: string) {
  if (registry[key]) return registry[key]
  for (const path in heroModules) {
    if (path.endsWith(`/${key}.vue`)) return heroModules[path].default
  }
  return {
    template: `<div class="p-4">
      <div class="rounded-lg border border-dashed text-sm p-4 text-gray-500 dark:text-neutral-400">
        Unknown section: <b>{{ key }}</b>
      </div>
    </div>`,
    props: { key: { type: String, required: true } },
  }
}

const route = useRoute()
const config = useRuntimeConfig()
const fallbackTitle = 'Ponpes Alberr | Pesantren Inovatif & Informatif'
const fallbackDescription = 'Selamat datang di Ponpes Alberr Pandaan: KMI/Diniyah, Tahfidz, MTs/MA, kegiatan santri, dan PPDB online.'
const url = computed(() => new URL(route.fullPath || '/', config.public.siteUrl).toString())

const seoTitle = computed(() => meta.value?.title || fallbackTitle)
const seoDesc  = computed(() => meta.value?.description || fallbackDescription)
const ogImage  = computed(() => meta.value?.ogImage || '/assets/logo.png')

useSeoMeta({
  title: seoTitle,
  description: seoDesc,
  ogTitle: seoTitle,
  ogDescription: seoDesc,
  ogType: 'website',
  ogUrl: url,
  ogImage: ogImage,
  twitterCard: 'summary_large_image',
  twitterSite: () => (config.public.twitterSite || undefined),
  themeColor: '#0ea5e9',
  robots: 'index, follow'
})

useHead({
  link: [{ rel: 'canonical', href: url.value }],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: config.public.siteName,
        url: config.public.siteUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${config.public.siteUrl}/search?q={query}`,
          'query-input': 'required name=query'
        }
      }))
    },
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Pondok Pesantren Alberr',
        url: config.public.siteUrl,
        logo: `${config.public.siteUrl}/assets/logo.png`,
        sameAs: [
          'https://facebook.com/alberr',
          'https://instagram.com/alberr'
        ]
      }))
    }
  ]
})
</script>
