<template>
  <section
    id="culture"
    aria-label="Budaya, Musik, dan Kuliner Martopuro"
    class="relative isolate overflow-hidden bg-slate-50 py-20 text-slate-950 sm:py-24"
  >
    <!-- Background -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-[linear-linear(to_right,#e2e8f0_1px,transparent_1px),linear-linear(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[44px_44px] opacity-40"></div>
      <div class="absolute -left-32 top-0 h-[480px] w-[480px] rounded-full bg-blue-100 blur-3xl"></div>
      <div class="absolute -right-32 bottom-0 h-[480px] w-[480px] rounded-full bg-cyan-200/60 blur-3xl"></div>
      <div class="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 blur-3xl"></div>
    </div>

    <div class="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <!-- Left Content -->
      <div>
        <div class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-xs font-black text-blue-700 shadow-sm backdrop-blur">
          <ClientOnly>
            <Icon :icon="c.eyebrowIcon" class="h-4 w-4" />
          </ClientOnly>
          {{ c.eyebrow }}
        </div>

        <h2 class="mt-6 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
          {{ c.title }}
          <span class="bg-linear-to-r from-blue-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
            {{ c.highlight }}
          </span>
        </h2>

        <p class="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
          {{ c.subtitle }}
        </p>

        <!-- Pills -->
        <div class="mt-7 flex flex-wrap gap-2">
          <button
            v-for="item in c.categories"
            :key="item.key"
            type="button"
            class="inline-flex h-10 items-center gap-2 rounded-2xl border px-4 text-sm font-bold transition"
            :class="activeCategory === item.key
              ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'border-slate-200 bg-white/80 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'"
            @click="activeCategory = item.key"
          >
            <ClientOnly>
              <Icon :icon="item.icon" class="h-4 w-4" />
            </ClientOnly>
            {{ item.label }}
          </button>
        </div>

        <!-- Active Info -->
        <div v-if="activeProgram" class="mt-6 rounded-[1.75rem] border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-xl sm:p-5">
          <div class="flex items-start gap-4">
            <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600">
              <ClientOnly>
                <Icon :icon="activeProgram.icon" class="h-5 w-5" />
              </ClientOnly>
            </div>

            <div class="min-w-0">
              <p class="text-sm font-black text-slate-950">
                {{ activeProgram.title }}
              </p>
              <p class="mt-1 text-sm leading-6 text-slate-500">
                {{ activeProgram.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            :href="c.primaryCta.href"
            target="_blank"
            rel="noopener"
            class="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-black text-white shadow-xl shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            {{ c.primaryCta.label }}
            <ClientOnly>
              <Icon icon="lucide:arrow-up-right" class="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </ClientOnly>
          </a>

          <button
            type="button"
            class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-5 text-sm font-black text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            @click="copyInstagram"
          >
            {{ copied ? 'Username Disalin' : c.secondaryCta.label }}
            <ClientOnly>
              <Icon :icon="copied ? 'lucide:check' : 'lucide:instagram'" class="h-4 w-4" />
            </ClientOnly>
          </button>
        </div>
      </div>

<!-- Right Visual Collage -->
      <div class="relative min-h-[520px] lg:min-h-[600px]">
        <!-- Floating Badge -->
        <div
          class="absolute right-4 top-0 z-30 hidden rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-black text-blue-700 shadow-xl shadow-slate-900/10 backdrop-blur sm:inline-flex lg:-right-4 lg:-top-8"
        >
          {{ c.floatingBadge }}
        </div>

        <div class="relative mx-auto h-[520px] max-w-2xl sm:h-[580px] lg:h-[620px]">
          <!-- Glow -->
          <div class="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200/40 blur-3xl sm:h-[460px] sm:w-[460px]"></div>

          <!-- Image 1 -->
          <div
            class="group absolute left-2 top-8 z-10 w-[54%] overflow-hidden rounded-4xl border border-white bg-white p-2 shadow-2xl shadow-slate-900/10 -rotate-2 sm:left-4 sm:top-6 sm:w-[50%] lg:left-2 lg:top-2"
          >
            <div class="h-48 overflow-hidden rounded-3xl sm:h-64 lg:h-72">
              <img
                :src="c.images[0]"
                :alt="`${c.title} 1`"
                class="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
            </div>
          </div>

          <!-- Image 2 -->
          <div
            class="group absolute right-0 top-20 z-20 w-[56%] overflow-hidden rounded-4xl border border-white bg-white p-2 shadow-2xl shadow-slate-900/10 rotate-2 sm:top-16 sm:w-[54%] lg:right-0 lg:top-12"
          >
            <div class="h-52 overflow-hidden rounded-3xl sm:h-72 lg:h-80">
              <img
                :src="c.images[1]"
                :alt="`${c.title} 2`"
                class="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
            </div>
          </div>

          <!-- Image 3 -->
          <div
            class="group absolute bottom-20 left-4 z-20 w-[52%] overflow-hidden rounded-4xl border border-white bg-white p-2 shadow-2xl shadow-slate-900/10 rotate-2 sm:bottom-24 sm:left-8 sm:w-[48%] lg:bottom-28 lg:left-6"
          >
            <div class="h-44 overflow-hidden rounded-3xl sm:h-60 lg:h-64">
              <img
                :src="c.images[2]"
                :alt="`${c.title} 3`"
                class="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
            </div>
          </div>

          <!-- Image 4 -->
          <div
            class="group absolute bottom-12 right-4 z-10 w-[50%] overflow-hidden rounded-4xl border border-white bg-white p-2 shadow-2xl shadow-slate-900/10 -rotate-1 sm:bottom-10 sm:right-8 sm:w-[48%] lg:bottom-14 lg:right-6"
          >
            <div class="h-40 overflow-hidden rounded-3xl sm:h-52 lg:h-56">
              <img
                :src="c.images[3]"
                :alt="`${c.title} 4`"
                class="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
            </div>
          </div>

          <!-- Center Logo -->
          <div
            class="absolute left-1/2 top-[47%] z-30 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[6px] border-white bg-linear-to-br from-blue-600 to-cyan-500 p-3 text-center shadow-2xl shadow-blue-900/20 sm:h-28 sm:w-28 lg:top-1/2"
          >
            <div>
              <p class="text-[9px] font-black uppercase leading-none tracking-wide text-blue-100 sm:text-[10px]">
                Martopuro
              </p>
              <p class="mt-1 text-xs font-black leading-none text-white sm:text-sm">
                Culture Fest
              </p>
            </div>
          </div>

          <!-- Floating Card -->
          <div
            v-if="activeProgram"
            class="absolute bottom-0 right-2 z-40 w-[245px] rounded-3xl border border-white bg-white/95 p-4 shadow-2xl shadow-slate-900/12 backdrop-blur-xl sm:right-6 sm:w-[270px] lg:bottom-2"
          >
            <div class="flex items-center gap-3">
              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-orange-50 text-orange-600">
                <ClientOnly>
                  <Icon icon="lucide:sparkles" class="h-5 w-5" />
                </ClientOnly>
              </div>

              <div class="min-w-0">
                <p class="truncate text-sm font-black text-slate-950">
                  {{ activeProgram.title }}
                </p>
                <p class="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                  {{ activeProgram.short }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile mini info -->
        <div class="mt-6 grid gap-3 sm:hidden">
          <article
            v-for="item in c.stats"
            :key="`mobile-${item.label}`"
            class="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p class="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
              {{ item.label }}
            </p>
            <p class="mt-1 text-base font-black text-slate-950">
              {{ item.value }}
            </p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'

type CategoryKey = 'schedule' | 'umkm' | 'performance'

type CategoryItem = {
  key: CategoryKey
  label: string
  icon: string
  title: string
  description: string
  short: string
}

type StatItem = {
  label: string
  value: string
}

type CtaItem = {
  label: string
  href: string
}

type CultureHeroProps = {
  eyebrow?: string
  eyebrowIcon?: string
  title?: string
  highlight?: string
  subtitle?: string
  instagram?: string
  floatingBadge?: string
  primaryCta?: CtaItem
  secondaryCta?: CtaItem
  categories?: CategoryItem[]
  stats?: StatItem[]
  images?: string[]
}

const defaults = {
  eyebrow: 'Martopuro Culture Fest',
  eyebrowIcon: 'lucide:ticket',
  title: 'Budaya, Musik, & Kuliner ',
  highlight: 'Martopuro!',
  subtitle:
    'Parade seni tradisi, UMKM lokal, pentas musik, lomba warga, dan kuliner khas dalam satu perayaan meriah. Ikuti informasi terbaru dan rangkaian acara melalui kanal resmi desa.',
  instagram: '@martopuroculturefest',
  floatingBadge: 'Festival Desa Digital',
  primaryCta: {
    label: 'Buka Instagram',
    href: 'https://instagram.com/martopuroculturefest'
  },
  secondaryCta: {
    label: '@martopuroculturefest',
    href: '#'
  },
  images: [
    'https://martopuro.sencra.io/assets/culturefest/2.JPG',
    'https://martopuro.sencra.io/assets/culturefest/0.JPG',
    'https://martopuro.sencra.io/assets/culturefest/1.JPG',
    'https://martopuro.sencra.io/assets/culturefest/2.JPG',
  ],
  categories: [
    {
      key: 'schedule',
      label: 'Jadwal & Highlight Acara',
      icon: 'lucide:layout-list',
      title: 'Jadwal Acara',
      description:
        'Lihat rangkaian acara utama, mulai dari pembukaan, parade budaya, penampilan musik, lomba warga, hingga malam puncak.',
      short: 'Pantau jadwal terbaru'
    },
    {
      key: 'umkm',
      label: 'UMKM & Kuliner Lokal',
      icon: 'lucide:store',
      title: 'UMKM & Kuliner',
      description:
        'Temukan tenant makanan, minuman, produk lokal, dan karya warga Martopuro yang hadir selama festival berlangsung.',
      short: 'Dukung produk lokal'
    },
    {
      key: 'performance',
      label: 'Lomba & Pentas Seni',
      icon: 'lucide:star',
      title: 'Seni · Musik · Kuliner',
      description:
        'Nikmati panggung seni, musik warga, pertunjukan budaya, dan lomba kreatif yang melibatkan komunitas desa.',
      short: 'Follow untuk jadwal'
    }
  ],
  stats: [
    {
      label: 'Agenda',
      value: '3 Hari Acara'
    },
    {
      label: 'Tenant',
      value: 'UMKM Lokal'
    },
    {
      label: 'Lokasi',
      value: 'Desa Martopuro'
    }
  ]
}

const props = defineProps<CultureHeroProps>()

const activeCategory = ref<any>('schedule')
const copied = ref(false)

const c = computed(() => {
  return {
    eyebrow: props.eyebrow || defaults.eyebrow,
    eyebrowIcon: props.eyebrowIcon || defaults.eyebrowIcon,
    title: props.title || defaults.title,
    highlight: props.highlight || defaults.highlight,
    subtitle: props.subtitle || defaults.subtitle,
    instagram: props.instagram || defaults.instagram,
    floatingBadge: props.floatingBadge || defaults.floatingBadge,
    primaryCta: {
      ...defaults.primaryCta,
      ...(props.primaryCta || {})
    },
    secondaryCta: {
      ...defaults.secondaryCta,
      ...(props.secondaryCta || {})
    },
    categories: props.categories?.length ? props.categories : defaults.categories,
    stats: props.stats?.length ? props.stats : defaults.stats,
    images: props.images?.length ? props.images : defaults.images
  }
})

const activeProgram = computed(() => {
  return c.value.categories.find((item) => item.key === activeCategory.value) || c.value.categories[0]
})

async function copyInstagram() {
  copied.value = true

  try {
    await navigator.clipboard.writeText(c.value.instagram)
  } catch {}

  window.setTimeout(() => {
    copied.value = false
  }, 1400)
}
</script>

<style scoped>
.bg-size-\[44px_44px\] {
  background-size: 44px 44px;
}
</style>