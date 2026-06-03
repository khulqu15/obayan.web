<template>
  <div id="home">
    <section aria-label="Hero Ponpes" class="relative isolate min-h-screen overflow-hidden py-12">
      <!-- Background -->
      <div class="absolute inset-0 -z-10">
        <img
          v-if="c.bgImage"
          :src="c.bgImage"
          :alt="`Lingkungan pesantren ${c.brand}`"
          class="h-full w-full object-cover"
        />

        <div
          v-else
          class="grid h-full w-full place-items-center bg-gradient-to-br from-green-800 via-green-700 to-lime-600 text-white"
        >
          <div class="text-center">
            <ClientOnly>
              <Icon icon="lucide:image-off" class="mx-auto size-10 opacity-90" />
            </ClientOnly>
            <p class="mt-3 text-sm font-bold">Background belum tersedia</p>
          </div>
        </div>

        <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
        <div class="absolute inset-0 bg-black/10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      </div>

      <div class="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 md:pb-24 lg:px-8">
        <div class="grid items-center gap-10 lg:grid-cols-2">
          <!-- LEFT -->
          <div>
            <div class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/20 backdrop-blur">
              <ClientOnly>
                <Icon icon="ph:sparkle" class="size-4 text-white" />
              </ClientOnly>
              <span class="text-xs font-medium tracking-wide text-white/90">
                {{ c.tagline }}
              </span>
            </div>

            <h1 class="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              {{ c.titleMain }}
              <span class="text-blue-200">{{ c.titleHighlight }}</span>
            </h1>

            <p class="mt-4 max-w-xl text-base text-white/80">
              {{ c.subtitle }}
            </p>

            <div v-if="c.badges.length" class="mt-4 flex flex-wrap gap-2">
              <span
                v-for="badge in c.badges"
                :key="badge.label"
                class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/20 backdrop-blur"
              >
                <ClientOnly>
                  <Icon :icon="badge.icon" class="size-4 text-emerald-300" />
                </ClientOnly>
                {{ badge.label }}
              </span>
            </div>

            <!-- CTA BUTTONS: now synced with editor ctas[] -->
            <div v-if="c.ctas.length" class="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                v-for="(cta, index) in c.ctas"
                :key="`${cta.label}-${cta.href}-${index}`"
                :href="normalizeHref(cta.href)"
                :target="isExternalHref(cta.href) ? '_blank' : undefined"
                :rel="isExternalHref(cta.href) ? 'noopener noreferrer' : undefined"
                class="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition focus:outline-hidden"
                :class="index === 0
                  ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-transparent'
                  : 'text-white/90 ring-1 ring-white/30 hover:bg-white/10'"
              >
                <ClientOnly>
                  <Icon
                    :icon="getCtaIcon(cta, index)"
                    class="size-4"
                  />
                </ClientOnly>

                {{ cta.label }}
              </a>
            </div>
          </div>

          <!-- RIGHT: stats + photos -->
          <div class="relative">
            <dl v-if="c.stats.length" class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                v-for="stat in c.stats"
                :key="stat.label"
                class="rounded-xl bg-white/10 p-3 text-white/90 ring-1 ring-white/20 backdrop-blur"
              >
                <dt class="text-[11px] uppercase tracking-wide text-white/70">
                  {{ stat.label }}
                </dt>
                <dd class="mt-1 text-xl font-semibold">
                  {{ stat.value }}
                </dd>
              </div>
            </dl>

            <div v-if="validPhotos.length" class="mt-5 grid grid-cols-3 gap-2">
              <img
                v-for="(photo, index) in validPhotos"
                :key="`${photo}-${index}`"
                :src="photo"
                class="h-28 w-full rounded-xl object-cover sm:h-32"
                :alt="`Kegiatan santri ${index + 1}`"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Info -->
      <div v-if="c.quicks.length" class="relative">
        <div class="mx-auto -mt-6 max-w-7xl px-4 sm:px-6 md:-mt-10 lg:px-8">
          <div class="rounded-2xl bg-white/90 shadow-lg ring-1 ring-black/5 backdrop-blur dark:bg-neutral-900">
            <div class="grid divide-y divide-gray-200/70 dark:divide-neutral-800 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3 lg:divide-x">
              <div
                v-for="quick in c.quicks"
                :key="quick.label"
                class="flex items-center gap-3 p-4"
              >
                <ClientOnly>
                  <Icon :icon="quick.icon" class="size-5 text-blue-600 dark:text-blue-500" />
                </ClientOnly>

                <div v-if="quick.label !== 'Admin'">
                  <p class="text-xs text-gray-500 dark:text-neutral-400">
                    {{ quick.label }}
                  </p>
                  <p class="text-sm font-medium text-gray-900 dark:text-neutral-100">
                    {{ quick.value }}
                  </p>
                </div>

                <div v-else>
                  <a :href="`https://wa.me/${c.waIntl}`" target="_blank" rel="noopener">
                    <p class="text-xs text-gray-500 dark:text-neutral-400">
                      {{ quick.label }}
                    </p>
                    <p class="text-sm font-medium text-gray-900 dark:text-neutral-100">
                      {{ quick.value }}
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

type Stat = {
  label: string
  value: string
}

type Quick = {
  label: 'PPDB Berakhir' | 'Jenjang' | 'Admin' | string
  value: string
  icon: string
}

type CTA = {
  label: string
  href: string
}

type Badge = {
  label: string
  icon: string
}

type HeaderHeroProps = {
  brand?: string
  bgImage?: string
  titleMain?: string
  titleHighlight?: string
  tagline?: string
  subtitle?: string
  photos?: string[]
  waIntl?: string

  /**
   * Legacy CTA fields.
   * Masih didukung supaya data lama tetap aman.
   */
  ctaPrimary?: CTA
  ctaSecondary?: CTA
  ctaPPDB?: CTA

  /**
   * New dynamic CTA list from editor.
   */
  ctas?: CTA[]

  badges?: Badge[]
  stats?: Stat[]
  quicks?: Quick[]
}

type HeaderHeroComputed = Required<Omit<HeaderHeroProps, 'badges' | 'ctas' | 'ctaPrimary' | 'ctaSecondary' | 'ctaPPDB'>> & {
  ctaPrimary: CTA
  ctaSecondary: CTA
  ctaPPDB: CTA
  ctas: CTA[]
  badges: Badge[]
}

const defaults: HeaderHeroComputed = {
  brand: 'Al-Inayah',
  bgImage: '/assets/images/masjid.jpg',
  titleMain: 'Pesantren Pencetak Insan ',
  titleHighlight: 'Berakhlaqul Karimah',
  tagline: 'Pondok Pesantren Inovatif',
  subtitle:
    'Pondok Pesantren Al-Inayah hadir sebagai pusat pendidikan akhlaq mulia dan ilmu pengetahuan, mengintegrasikan agama-umum, salaf-modern, pembelajaran aktif, fasilitas memadai, serta lingkungan bersih, indah, dan nyaman.',
  photos: [
    '/assets/images/activity.jpg',
    '/assets/images/activity1.jpg',
    '/assets/images/activity2.jpg'
  ],
  waIntl: '6285856376399',
  ctaPrimary: {
    label: 'Login Wali',
    href: '/waliLogin'
  },
  ctaSecondary: {
    label: 'Pelajari Program',
    href: '/program'
  },
  ctaPPDB: {
    label: 'Daftar PSB',
    href: '/registration'
  },
  ctas: [
    {
      label: 'Login Wali',
      href: '/waliLogin'
    },
    {
      label: 'Pelajari Program',
      href: '/program'
    }
  ],
  badges: [
    {
      label: 'SIAKAD',
      icon: 'ph:chalkboard-teacher'
    },
    {
      label: 'App',
      icon: 'ph:device-mobile'
    },
    {
      label: 'Attendance',
      icon: 'ph:qr-code'
    },
    {
      label: 'Academic',
      icon: 'ph:graduation-cap'
    }
  ],
  stats: [
    {
      label: 'Santri Putra',
      value: '1000+'
    },
    {
      label: 'Santri Putri',
      value: '50+'
    },
    {
      label: 'Pengajar',
      value: '50+'
    },
    {
      label: 'Prestasi',
      value: '50+'
    }
  ],
  quicks: [
    {
      label: 'PPDB Berakhir',
      value: '1 Oktober - Kuota Terpenuhi',
      icon: 'ph:calendar-check'
    },
    {
      label: 'Jenjang',
      value: 'SMP - SMK Al-Inayah',
      icon: 'ph:student'
    },
    {
      label: 'Admin',
      value: 'WA: 085856376399',
      icon: 'ph:phone'
    }
  ]
}

const props = defineProps<HeaderHeroProps>()

const c = computed<HeaderHeroComputed>(() => {
  const ctaPrimary = normalizeCta({
    ...defaults.ctaPrimary,
    ...(props.ctaPrimary || {})
  })

  const ctaSecondary = normalizeCta({
    ...defaults.ctaSecondary,
    ...(props.ctaSecondary || {})
  })

  const ctaPPDB = normalizeCta({
    ...defaults.ctaPPDB,
    ...(props.ctaPPDB || {})
  })

  const legacyCtas = [ctaPrimary, ctaSecondary, ctaPPDB].filter(hasCtaValue)
  const dynamicCtas = normalizeCtas(props.ctas)

  return {
    brand: props.brand ?? defaults.brand,
    bgImage: props.bgImage ?? defaults.bgImage,
    titleMain: props.titleMain ?? defaults.titleMain,
    titleHighlight: props.titleHighlight ?? defaults.titleHighlight,
    tagline: props.tagline ?? defaults.tagline,
    subtitle: props.subtitle ?? defaults.subtitle,
    photos: normalizePhotos(props.photos, defaults.photos),
    waIntl: props.waIntl ?? defaults.waIntl,
    ctaPrimary,
    ctaSecondary,
    ctaPPDB,
    ctas: dynamicCtas.length ? dynamicCtas : legacyCtas,
    badges: normalizeBadges(props.badges, defaults.badges),
    stats: normalizeStats(props.stats, defaults.stats),
    quicks: normalizeQuicks(props.quicks, defaults.quicks)
  }
})

const validPhotos = computed(() => {
  return c.value.photos.filter(Boolean).slice(0, 3)
})

function normalizeCta(value?: Partial<CTA> | null): CTA {
  return {
    label: String(value?.label || '').trim(),
    href: String(value?.href || '').trim()
  }
}

function normalizeCtas(value?: CTA[]) {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => normalizeCta(item))
    .filter(hasCtaValue)
}

function hasCtaValue(value: CTA) {
  return Boolean(value.label || value.href)
}

function normalizePhotos(value: string[] | undefined, fallback: string[]) {
  if (!Array.isArray(value) || !value.length) return fallback

  const next = value
    .map((item) => String(item || '').trim())
    .filter(Boolean)

  return next.length ? next : fallback
}

function normalizeBadges(value: Badge[] | undefined, fallback: Badge[]) {
  if (!Array.isArray(value) || !value.length) return fallback

  const next = value
    .map((item) => ({
      label: String(item?.label || '').trim(),
      icon: String(item?.icon || '').trim()
    }))
    .filter((item) => item.label && item.icon)

  return next.length ? next : fallback
}

function normalizeStats(value: Stat[] | undefined, fallback: Stat[]) {
  if (!Array.isArray(value) || !value.length) return fallback

  const next = value
    .map((item) => ({
      label: String(item?.label || '').trim(),
      value: String(item?.value || '').trim()
    }))
    .filter((item) => item.label || item.value)

  return next.length ? next : fallback
}

function normalizeQuicks(value: Quick[] | undefined, fallback: Quick[]) {
  if (!Array.isArray(value) || !value.length) return fallback

  const next = value
    .map((item) => ({
      label: String(item?.label || '').trim(),
      value: String(item?.value || '').trim(),
      icon: String(item?.icon || '').trim() || 'ph:info'
    }))
    .filter((item) => item.label || item.value)

  return next.length ? next : fallback
}

function normalizeHref(href?: string) {
  const value = String(href || '').trim()

  if (!value) return '#'

  return value
}

function isExternalHref(href?: string) {
  return /^https?:\/\//i.test(String(href || ''))
}

function getCtaIcon(cta: CTA, index: number) {
  const label = `${cta.label} ${cta.href}`.toLowerCase()

  if (label.includes('wa.me') || label.includes('whatsapp') || label.includes('wa:')) {
    return 'mdi:whatsapp'
  }

  if (label.includes('login') || label.includes('wali')) {
    return 'lucide:log-in'
  }

  if (label.includes('daftar') || label.includes('ppdb') || label.includes('psb') || label.includes('registration')) {
    return 'lucide:user-plus'
  }

  if (label.includes('program') || label.includes('pelajari')) {
    return 'ph:book-open'
  }

  return index === 0 ? 'lucide:arrow-right' : 'lucide:external-link'
}
</script>

<style scoped>
:global(html.dark) .shadow-lg {
  box-shadow: 0 10px 25px -10px rgba(0, 0, 0, 0.5);
}
</style>