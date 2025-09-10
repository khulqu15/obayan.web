<!-- ~/components/CaseStudyHeroAlberr.vue -->
<template>
  <section
    class="relative w-full min-h-[520px] sm:min-h-[620px] lg:min-h-[680px] overflow-hidden"
    :style="bgStyle(active.image)"
    aria-label="Studi Kasus Alberr"
  >
    <!-- Background overlay & decoration -->
    <div class="absolute inset-0 bg-black/60 dark:bg-black/60"></div>
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div class="absolute -top-24 -left-24 w-[42rem] h-[42rem] rounded-full opacity-30 blur-3xl bg-gradient-to-br from-emerald-400/40 to-cyan-400/30"></div>
      <div class="absolute top-28 -right-24 w-[36rem] h-[36rem] rounded-full opacity-25 blur-3xl bg-gradient-to-tr from-amber-300/40 to-fuchsia-300/30"></div>
      <div class="absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_40%,#000,transparent_70%)]">
        <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>
    </div>

    <!-- Content -->
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Top pills (switcher) -->
      <div class="pt-6 sm:pt-8 flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          v-for="(c, i) in cases"
          :key="c.slug"
          @click="go(i)"
          class="px-3 py-1.5 rounded-2xl text-sm font-semibold transition border backdrop-blur"
          :class="i === index
            ? 'bg-white text-gray-900 border-white/20 shadow-sm'
            : 'bg-white/40 text-white/85 hover:bg-white/20 border-white/20'"
        >
          <span class="inline-flex items-center gap-1.5">
            <Icon :icon="c.icon" class="size-4" />
            {{ c.pill }}
          </span>
        </button>
      </div>

      <!-- Hero body -->
      <div class="py-10 sm:py-14 lg:py-20 grid lg:grid-cols-12 gap-6 lg:gap-10 items-center">
        <div class="lg:col-span-7">
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-white/15 text-white/90 ring-1 ring-white/25">
            <Icon icon="solar:stars-line-duotone" class="size-4" />
            Studi Kasus • Alberr
          </span>

          <h1 class="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-white">
            {{ active.title }}
          </h1>
          <p class="mt-3 sm:mt-4 text-white/90 max-w-2xl">
            {{ active.subtitle }}
          </p>

          <!-- Badges -->
          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="t in active.tags"
              :key="t"
              class="px-2.5 py-1 rounded-xl text-xs font-medium bg-white/15 text-white ring-1 ring-white/20"
            >
              {{ t }}
            </span>
          </div>

          <!-- KPIs -->
          <div class="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl">
            <div
              v-for="(k, i) in active.kpis"
              :key="i"
              class="rounded-2xl p-4 bg-white/12 ring-1 ring-white/15 text-white/95 backdrop-blur"
            >
              <p class="text-lg font-extrabold">{{ k.value }}</p>
              <p class="text-[12px] text-white/80">{{ k.label }}</p>
            </div>
          </div>

          <!-- CTAs -->
          <div class="mt-7 flex flex-wrap items-center gap-2 sm:gap-3">
            <a
              :href="projectUrl"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold bg-emerald-500 text-white hover:bg-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-white/50"
            >
              <Icon icon="lucide:external-link" class="size-4" />
              Buka Proyek
            </a>
            <a
              :href="active.more || '#demo'"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold bg-white/15 text-white hover:bg-white/25 ring-1 ring-white/25"
            >
              <Icon icon="lucide:book-open" class="size-4" />
              Pelajari Implementasi
            </a>
          </div>

          <!-- Footnote -->
          <p class="mt-3 text-xs text-white/70">
            Dibangun di ekosistem Obayan Sencra
          </p>
        </div>

        <!-- Side card (highlights) -->
        <div class="lg:col-span-5">
          <div class="rounded-3xl bg-white/15 text-white ring-1 ring-white/20 backdrop-blur p-5 sm:p-6">
            <div class="flex items-start gap-3">
              <div class="size-12 rounded-2xl flex items-center justify-center bg-white/20">
                <Icon :icon="active.icon" class="size-6" />
              </div>
              <div class="grow">
                <p class="font-extrabold text-lg">{{ active.card.title }}</p>
                <p class="text-sm text-white/85">{{ active.card.desc }}</p>
              </div>
            </div>
            <ul class="mt-4 space-y-2">
              <li v-for="(h, i) in active.card.points" :key="i" class="flex items-start gap-2">
                <Icon icon="lucide:check-circle-2" class="size-5 mt-[2px] text-emerald-300" />
                <span class="text-sm">{{ h }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom pager -->
      <div class="pb-6 sm:pb-8 flex items-center gap-2">
        <button
          v-for="(c, i) in cases"
          :key="c.slug + '-dot'"
          @click="go(i)"
          class="size-2 rounded-full transition"
          :class="i === index ? 'bg-white' : 'bg-white/40 hover:bg-white/70'"
          aria-label="Switch case"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'

type KPI = { label: string; value: string }
type Case = {
  slug: string
  pill: string
  title: string
  subtitle: string
  icon: string
  image: string
  tags: string[]
  kpis: KPI[]
  more?: string
  card: { title: string; desc: string; points: string[] }
}

const props = withDefaults(defineProps<{
  projectUrl?: string
  autoplayMs?: number
  images?: Partial<Record<'web'|'rfid'|'siakad', string>>
}>(), {
  projectUrl: 'https://alberr-obayan.sencra.io',
  autoplayMs: 8000
})

const cases = ref<Case[]>([
  {
    slug: 'web-profile-alberr',
    pill: 'Web Profile Alberr',
    title: 'Web Profile Alberr — Cepat, SEO-ready, editor visual',
    subtitle: 'Brand site untuk Alberr: halaman profil, berita, prestasi. Lighthouse tinggi & mudah dikelola tim non-teknis.',
    icon: 'ph:globe',
    image: props.images?.web || '/assets/images/activity.jpg',
    tags: ['Website', 'CMS', 'SEO'],
    kpis: [
      { label: 'Go-live', value: '4 hari' },
      { label: 'Skor Lighthouse', value: '98/100' },
      { label: 'TTFB', value: '< 150 ms' }
    ],
    more: '/produk?slug=obayan-cms',
    card: {
      title: 'Sorotan Implementasi',
      desc: 'Tema konsisten, editor blok, dan struktur SEO otomatis.',
      points: [
        'Editor drag & drop untuk halaman kunci',
        'Berita/Prestasi terhubung ke modul internal',
        'Sitemap + schema.org + OG tags otomatis'
      ]
    }
  },
  {
    slug: 'rfid-absensi-alberr',
    pill: 'RFID Absensi Alberr',
    title: 'RFID Presensi Realtime — Antrian turun, wali terinfo',
    subtitle: 'Integrasi ToriID untuk presensi RFID/QR, notifikasi wali otomatis, dan dashboard keterlambatan.',
    icon: 'ph:identification-badge',
    image: props.images?.rfid || '/assets/images/cases/0.png',
    tags: ['Attendance', 'RFID/QR', 'Realtime'],
    kpis: [
      { label: 'Antrian Gerbang', value: '↓ 55%' },
      { label: 'Notifikasi Wali', value: 'Realtime' },
      { label: 'Integrasi', value: 'SIAKAD & Kelas' }
    ],
    more: '/produk?slug=toriid',
    card: {
      title: 'Sorotan Implementasi',
      desc: 'Presensi multi-metode dan alur data end-to-end.',
      points: [
        'RFID + fallback QR di titik padat',
        'Anti-duplikasi & device/geo logging',
        'Grafik keterlambatan per kelas'
      ]
    }
  },
  {
    slug: 'siberr-siakad-alberr',
    pill: 'SiBerr (SIAKAD Alberr)',
    title: 'SiBerr — SIAKAD Alberr yang jadi satu sumber data',
    subtitle: 'Data induk, rombel, nilai, rapor hingga arsip semester dalam satu dashboard. Terhubung ke Web Profile & Presensi.',
    icon: 'lucide:school',
    image: props.images?.siakad || '/assets/images/activity2.jpg',
    tags: ['SIAKAD', 'Rapor', 'Data Induk'],
    kpis: [
      { label: 'Waktu Admin', value: '↓ 60%' },
      { label: 'Akurasi Data', value: '↑ 99%' },
      { label: 'Cetak Rapor', value: 'Massal' }
    ],
    more: '/produk?slug=obayan-siakad',
    card: {
      title: 'Sorotan Implementasi',
      desc: 'Struktur multi-unit, template rapor, dan audit log.',
      points: [
        'Kenaikan/kelulusan massal + arsip semester',
        'Template rapor kustom + QR verifikasi',
        'RBAC granular & audit perubahan'
      ]
    }
  }
])

/* State */
const index = ref(0)
const active = computed(() => cases.value[index.value])

function go(i: number) {
  index.value = i % cases.value.length
}

/* Background style */
function bgStyle(src: string) {
  return {
    backgroundImage: `url('${src}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } as Record<string, string>
}

/* Autoplay */
let timer: number | undefined
onMounted(() => {
  timer = window.setInterval(() => {
    index.value = (index.value + 1) % cases.value.length
  }, props.autoplayMs)
})
onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})

const projectUrl = computed(() => props.projectUrl)
</script>
