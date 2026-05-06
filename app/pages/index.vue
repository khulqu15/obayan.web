<template>
  <div>
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isPageLoading"
          class="fixed inset-0 z-[9999] overflow-hidden bg-white text-slate-900"
        >
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,#ecfdf5_0%,transparent_32%),radial-gradient(circle_at_bottom_right,#eff6ff_0%,transparent_32%)]"></div>

          <div class="relative flex min-h-screen items-center justify-center px-4 py-8">
            <div class="w-full max-w-2xl">
              <div class="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
                <div class="flex items-center gap-4">
                  <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <img
                      :src="appLogo"
                      :alt="clientDisplayName"
                      class="h-9 w-9 object-contain"
                      draggable="false"
                    />
                  </div>

                  <div class="min-w-0">
                    <p class="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                      Memuat Halaman
                    </p>
                    <h2 class="truncate text-lg font-semibold tracking-tight text-slate-900">
                      {{ clientDisplayName }}
                    </h2>
                  </div>
                </div>

                <div class="my-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

                <div>
                  <div class="mb-4 flex items-center justify-between gap-3">
                    <span
                      class="inline-flex items-center rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs font-medium capitalize text-green-700"
                    >
                      {{ currentText.type }}
                    </span>

                    <span class="text-right text-xs font-medium text-slate-400">
                      {{ currentText.dalil }}
                    </span>
                  </div>

                  <blockquote>
                    <p
                      dir="rtl"
                      class="min-h-[92px] font-serif text-2xl font-semibold leading-[2.25] tracking-normal text-slate-900 sm:text-3xl"
                    >
                      {{ typedArabic }}<span class="typing-caret"></span>
                    </p>

                    <p class="mt-5 min-h-[72px] text-base font-medium leading-8 text-slate-600 sm:text-lg">
                      “{{ typedMeaning }}”
                    </p>
                  </blockquote>

                  <div class="mt-5 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p class="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                      Sumber
                    </p>
                    <p class="mt-1 min-h-5 text-sm font-medium text-slate-600">
                      {{ typedSource }}
                    </p>
                  </div>
                </div>

                <div class="mt-6 flex items-center justify-between gap-4">
                  <p class="text-xs text-slate-400">
                    Menyiapkan konten terbaik untuk Anda
                  </p>

                  <div class="flex items-center gap-1.5">
                    <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    <span class="h-1.5 w-1.5 rounded-full bg-green-300"></span>
                    <span class="h-1.5 w-1.5 rounded-full bg-green-100"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Content tetap dirender di belakang loading -->
    <div :class="isPageLoading ? 'pointer-events-none select-none' : ''">
      <ClientOnly>
        <component
          v-for="section in displayedSections"
          :key="section.renderKey || section.id"
          :is="resolveSection(section.key)"
          v-bind="getSectionProps(section)"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useHead, useRuntimeConfig, useSeoMeta } from 'nuxt/app'
import { useWeb } from '~/composables/data/useWeb'
import { useLoadingText } from '~/composables/useLoadingText'

import HeaderHero from '~/components/hero/HeaderHero.vue'
import InfoHero from '~/components/hero/InfoHero.vue'
import BlogHero from '~/components/hero/BlogHero.vue'
import InvitationHero from '~/components/hero/InvitationHero.vue'
import HeroFacilityHero from '~/components/hero/FacilityHero.vue'
import HeroProgramHero from '~/components/hero/ProgramHero.vue'

const HOME_PATH = '/'

const config = useRuntimeConfig()
const publicConfig = config.public as Record<string, any>
const web = useWeb()

const {
  meta,
  sortedSections,
  subscribePage,
  normalizePath,
  currentPath
} = web as any

const pageReady = ref(false)
const isPageLoading = ref(true)

const {
  currentText,
  typedArabic,
  typedMeaning,
  typedSource
} = useLoadingText('muslimPatience', {
  arabicTypingSpeed: 16,
  meaningTypingSpeed: 12,
  sourceTypingSpeed: 10,
  meaningDelay: 250,
  sourceDelay: 280
})

let savedScrollY = 0

function lockScroll() {
  if (typeof window === 'undefined') return

  savedScrollY = window.scrollY || window.pageYOffset || 0

  document.documentElement.classList.add('overflow-hidden')
  document.body.classList.add('overflow-hidden')

  document.body.style.position = 'fixed'
  document.body.style.top = `-${savedScrollY}px`
  document.body.style.left = '0'
  document.body.style.right = '0'
  document.body.style.width = '100%'
}

function unlockScroll() {
  if (typeof window === 'undefined') return

  document.documentElement.classList.remove('overflow-hidden')
  document.body.classList.remove('overflow-hidden')

  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.left = ''
  document.body.style.right = ''
  document.body.style.width = ''

  window.scrollTo(0, savedScrollY)
}

watch(
  isPageLoading,
  (loading) => {
    if (loading) {
      lockScroll()
    } else {
      unlockScroll()
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  unlockScroll()
})

async function waitWithTimeout<T>(promise: Promise<T>, timeoutMs = 4500) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const timeoutPromise = new Promise<null>((resolve) => {
    timeoutId = setTimeout(() => resolve(null), timeoutMs)
  })

  try {
    return await Promise.race([promise, timeoutPromise])
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}

async function loadHomePage() {
  isPageLoading.value = true

  try {
    const path = normalizePath ? normalizePath(HOME_PATH) : HOME_PATH

    if (typeof currentPath?.value !== 'undefined') {
      currentPath.value = path
    }

    ;(web as any)?.setActivePath?.(path)

    await waitWithTimeout(Promise.resolve(subscribePage(path)), 4500)
  } catch (error) {
    console.error('[HomePage] Failed to load CMS page:', error)
  } finally {
    pageReady.value = true

    // tunggu Vue selesai render component fallback/CMS
    await nextTick()

    // beri sedikit delay agar transisi tidak terlalu patah
    window.setTimeout(() => {
      isPageLoading.value = false
    }, 180)
  }
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

const safeClientName = computed(() => {
  return String(
    publicConfig.clientDisplayName ||
      publicConfig.siteName ||
      publicConfig.appName ||
      publicConfig.clientName ||
      'Pondok Pesantren'
  )
})

const headerHeroFallbackProps = computed(() => {
  const brand = safeClientName.value

  return {
    brand,
    bgImage: String(
      publicConfig.heroBgImage ||
        publicConfig.appHeroImage ||
        '/assets/images/masjid.jpg'
    ),
    titleMain: String(publicConfig.heroTitleMain || `${brand} `),
    titleHighlight: String(
      publicConfig.heroTitleHighlight || 'Berakhlaqul Karimah'
    ),
    tagline: String(publicConfig.heroTagline || 'Pondok Pesantren Inovatif'),
    subtitle: String(
      publicConfig.heroSubtitle ||
        publicConfig.siteDescription ||
        `${brand} hadir sebagai pusat pendidikan akhlaq mulia, ilmu pengetahuan, dan pembinaan santri secara terpadu.`
    ),
    waIntl: String(publicConfig.waIntl || publicConfig.whatsappIntl || ''),

    ctaPrimary: {
      label: String(publicConfig.heroPrimaryLabel || 'Login Wali'),
      href: String(publicConfig.heroPrimaryHref || '/waliLogin')
    },

    ctaSecondary: {
      label: String(publicConfig.heroSecondaryLabel || 'Pelajari Program'),
      href: String(publicConfig.heroSecondaryHref || '/program')
    },

    ctaPPDB: {
      label: String(publicConfig.heroPpdbLabel || 'Daftar PSB'),
      href: String(publicConfig.heroPpdbHref || '/registration')
    },

    quicks: [
      {
        label: 'PPDB Berakhir',
        value: String(
          publicConfig.ppdbTimeline || 'Menyesuaikan jadwal pendaftaran'
        ),
        icon: 'ph:calendar-check'
      },
      {
        label: 'Jenjang',
        value: String(publicConfig.schoolLevels || 'Jenjang pendidikan pesantren'),
        icon: 'ph:student'
      },
      {
        label: 'Admin',
        value: String(publicConfig.adminLabel || 'Hubungi Admin'),
        icon: 'ph:phone'
      }
    ]
  }
})

const defaultSections = computed(() => {
  return [
    {
      id: 'default-header-hero',
      renderKey: 'default-header-hero',
      key: 'HeaderHero',
      enabled: true,
      props: headerHeroFallbackProps.value
    },
    {
      id: 'default-info-hero',
      renderKey: 'default-info-hero',
      key: 'InfoHero',
      enabled: true,
      props: {}
    },
    {
      id: 'default-blog-hero',
      renderKey: 'default-blog-hero',
      key: 'BlogHero',
      enabled: true,
      props: {}
    },
    {
      id: 'default-facility-hero',
      renderKey: 'default-facility-hero',
      key: 'FacilityHero',
      enabled: true,
      props: {}
    },
    {
      id: 'default-invitation-hero',
      renderKey: 'default-invitation-hero',
      key: 'InvitationHero',
      enabled: true,
      props: {}
    },
    {
      id: 'default-program-hero',
      renderKey: 'default-program-hero',
      key: 'ProgramHero',
      enabled: true,
      props: {}
    }
  ]
})

const displayedSections = computed(() => {
  if (cmsActive.value) {
    return enabledSections.value.map((section: any) => ({
      ...section,
      renderKey: `cms-${section.id || section.key}`
    }))
  }

  return defaultSections.value
})

function isHeaderHeroKey(key?: string) {
  return ['HeaderHero', 'HeroHeaderHero'].includes(String(key || ''))
}

function getSectionProps(section: any) {
  const props = section?.props || {}

  if (!isHeaderHeroKey(section?.key)) {
    return props
  }

  const fallback = headerHeroFallbackProps.value

  return {
    ...fallback,
    ...props,

    ctaPrimary: {
      ...fallback.ctaPrimary,
      ...(props.ctaPrimary || {})
    },

    ctaSecondary: {
      ...fallback.ctaSecondary,
      ...(props.ctaSecondary || {})
    },

    ctaPPDB: {
      ...fallback.ctaPPDB,
      ...(props.ctaPPDB || {})
    },

    quicks:
      Array.isArray(props.quicks) && props.quicks.length
        ? props.quicks
        : fallback.quicks
  }
}

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

<style scoped>
.typing-caret {
  display: inline-block;
  width: 0.08em;
  height: 1em;
  margin-left: 0.08em;
  transform: translateY(0.16em);
  border-radius: 999px;
  background: currentColor;
  opacity: 0.75;
  animation: caretBlink 1s ease-in-out infinite;
}

@keyframes caretBlink {
  0%, 45% {
    opacity: 0.75;
  }

  46%, 100% {
    opacity: 0;
  }
}
</style>