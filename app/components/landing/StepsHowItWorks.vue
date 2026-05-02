<template>
  <section
    ref="sectionRef"
    class="relative overflow-hidden py-20 sm:py-24 lg:py-28"
  >
    <!-- Background -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-gradient-to-b from-green-50/80 via-white to-white dark:from-green-950/25 dark:via-neutral-950 dark:to-neutral-950" />
      <div class="absolute inset-0 [background-image:linear-gradient(to_right,rgba(34,197,94,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,197,94,0.06)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div class="absolute -left-28 top-20 size-80 rounded-full bg-green-300/25 blur-3xl dark:bg-green-500/10" />
      <div class="absolute -right-28 top-1/3 size-96 rounded-full bg-lime-300/20 blur-3xl dark:bg-lime-500/10" />
      <div class="absolute bottom-0 left-1/2 size-80 -translate-x-1/2 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10" />
    </div>

    <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <!-- Heading -->
      <div
        class="mx-auto max-w-3xl text-center transition-all duration-700"
        :class="sectionVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
      >
        <div class="inline-flex items-center gap-2 rounded-full border border-green-200/70 bg-white/80 px-4 py-2 text-xs font-bold text-green-700 shadow-sm shadow-green-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-green-300">
          <span class="relative flex size-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
            <span class="relative inline-flex size-2 rounded-full bg-green-600" />
          </span>
          Cara Kerja Obayan
        </div>

        <h2 class="mt-5 text-3xl font-black tracking-tight text-gray-950 dark:text-white sm:text-5xl">
          Dari order sampai sistem pondok
          <span class="bg-gradient-to-r from-green-600 via-emerald-500 to-lime-500 bg-clip-text text-transparent">
            berjalan efisien
          </span>
        </h2>

        <p class="mx-auto mt-4 max-w-2xl text-base leading-8 text-gray-600 dark:text-neutral-300">
          Alur implementasi dibuat bertahap, rapi, dan terukur agar pondok bisa mulai dari modul prioritas lalu berkembang sesuai kebutuhan.
        </p>
      </div>

      <!-- KPI -->
      <div
        class="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
        :class="sectionVisible ? 'opacity-100' : 'opacity-0'"
      >
        <div
          v-for="(k, i) in kpis"
          :key="k.label"
          class="kpi-card rounded-[1.35rem] border border-gray-200/70 bg-white/75 p-4 text-center shadow-sm shadow-gray-950/[0.03] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-green-900/10 dark:border-white/10 dark:bg-white/[0.04]"
          :style="{ '--delay': `${i * 90}ms` }"
        >
          <div class="mx-auto mb-3 grid size-10 place-items-center rounded-2xl bg-green-50 text-green-600 ring-1 ring-green-200/70 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-400/20">
            <Icon :icon="k.icon" class="size-5" />
          </div>
          <p class="text-xs font-medium text-gray-500 dark:text-neutral-400">{{ k.label }}</p>
          <p class="mt-1 text-lg font-black text-gray-950 dark:text-white">{{ k.value }}</p>
        </div>
      </div>

      <!-- Timeline -->
      <div class="relative mt-16">
        <!-- Center line desktop -->
        <div class="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 lg:block">
          <div class="absolute inset-0 rounded-full bg-green-200/60 dark:bg-white/10" />
          <div
            class="absolute left-0 top-0 w-px rounded-full bg-gradient-to-b from-green-400 via-emerald-500 to-lime-400 transition-[height] duration-300"
            :style="{ height: `${Math.max(4, smoothProgress * 100)}%` }"
          />
        </div>

        <!-- Left line mobile -->
        <div class="pointer-events-none absolute left-5 top-0 h-full w-px lg:hidden">
          <div class="absolute inset-0 rounded-full bg-green-200/70 dark:bg-white/10" />
          <div
            class="absolute left-0 top-0 w-px rounded-full bg-gradient-to-b from-green-400 via-emerald-500 to-lime-400 transition-[height] duration-300"
            :style="{ height: `${Math.max(4, smoothProgress * 100)}%` }"
          />
        </div>

        <div class="space-y-7 lg:space-y-10">
          <article
            v-for="(s, i) in fullSteps"
            :key="s.title"
            :ref="(el) => setStepRef(el, i)"
            class="timeline-item relative grid gap-5 pl-14 lg:grid-cols-[1fr_88px_1fr] lg:gap-0 lg:pl-0"
            :class="[
              visibleIndexes.has(i) ? 'is-visible' : '',
              activeIndex === i ? 'is-active' : '',
            ]"
            :style="{ '--delay': `${Math.min(i * 80, 640)}ms` }"
          >
            <!-- Desktop left/right empty side -->
            <div
              class="hidden lg:block"
              :class="i % 2 === 0 ? 'lg:col-start-1' : 'lg:col-start-3'"
            >
              <div
                class="step-card group relative overflow-hidden rounded-[1.75rem] border border-gray-200/70 bg-white/80 p-6 shadow-sm shadow-gray-950/[0.03] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:border-green-200 hover:bg-white hover:shadow-2xl hover:shadow-green-900/10 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-green-400/30 dark:hover:bg-white/[0.07]"
              >
                <div class="absolute -right-14 -top-14 size-36 rounded-full bg-green-300/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div class="relative flex items-start gap-4">
                  <div
                    class="grid size-12 shrink-0 place-items-center rounded-2xl text-sm font-black text-white shadow-xl shadow-green-500/20"
                    :style="{ background: numberBg(i) }"
                  >
                    {{ String(i + 1).padStart(2, '0') }}
                  </div>

                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <ClientOnly>
                        <Icon :icon="s.icon" class="size-5 text-green-600 dark:text-green-300" aria-hidden="true" />
                      </ClientOnly>
                      <span class="text-xs font-bold uppercase tracking-wide text-green-700 dark:text-green-300">
                        Step {{ i + 1 }}
                      </span>
                    </div>

                    <h3 class="mt-2 text-lg font-black tracking-tight text-gray-950 dark:text-white">
                      {{ s.title }}
                    </h3>

                    <p class="mt-2 text-sm leading-7 text-gray-600 dark:text-neutral-300">
                      {{ s.desc }}
                    </p>
                  </div>
                </div>

                <ul v-if="s.items?.length" class="relative mt-5 grid gap-2">
                  <li
                    v-for="it in s.items"
                    :key="it"
                    class="flex items-start gap-2 rounded-2xl bg-green-50/70 px-3 py-2 text-sm text-gray-700 dark:bg-green-500/10 dark:text-neutral-200"
                  >
                    <Icon icon="ph:check-circle-duotone" class="mt-0.5 size-4 shrink-0 text-green-600 dark:text-green-300" />
                    <span>{{ it }}</span>
                  </li>
                </ul>

                <div class="relative mt-5 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 transition-[width] duration-700"
                    :style="{ width: progressWidth(i, fullSteps.length) }"
                  />
                </div>
              </div>
            </div>

            <!-- Center node -->
            <div class="absolute left-0 top-6 lg:static lg:col-start-2 lg:flex lg:items-start lg:justify-center">
              <div
                class="timeline-node relative z-10 grid size-10 place-items-center rounded-2xl border border-white bg-green-600 text-white shadow-xl shadow-green-500/25 ring-8 ring-green-100 transition-all duration-500 dark:border-white/10 dark:ring-green-500/10"
                :class="activeIndex === i ? 'scale-110 bg-green-500' : ''"
              >
                <Icon :icon="s.icon" class="size-5" />
              </div>
            </div>

            <!-- Mobile card -->
            <div class="lg:hidden">
              <div class="step-card group relative overflow-hidden rounded-[1.75rem] border border-gray-200/70 bg-white/80 p-5 shadow-sm shadow-gray-950/[0.03] backdrop-blur-2xl transition-all duration-500 hover:border-green-200 hover:bg-white hover:shadow-2xl hover:shadow-green-900/10 dark:border-white/10 dark:bg-white/[0.04]">
                <div class="flex items-start gap-4">
                  <div
                    class="grid size-11 shrink-0 place-items-center rounded-2xl text-sm font-black text-white shadow-xl shadow-green-500/20"
                    :style="{ background: numberBg(i) }"
                  >
                    {{ String(i + 1).padStart(2, '0') }}
                  </div>

                  <div>
                    <h3 class="text-lg font-black tracking-tight text-gray-950 dark:text-white">
                      {{ s.title }}
                    </h3>
                    <p class="mt-2 text-sm leading-7 text-gray-600 dark:text-neutral-300">
                      {{ s.desc }}
                    </p>
                  </div>
                </div>

                <ul v-if="s.items?.length" class="mt-5 grid gap-2">
                  <li
                    v-for="it in s.items"
                    :key="it"
                    class="flex items-start gap-2 rounded-2xl bg-green-50/70 px-3 py-2 text-sm text-gray-700 dark:bg-green-500/10 dark:text-neutral-200"
                  >
                    <Icon icon="ph:check-circle-duotone" class="mt-0.5 size-4 shrink-0 text-green-600 dark:text-green-300" />
                    <span>{{ it }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- CTA -->
      <div
        class="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row"
        :class="sectionVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
      >
        <a
          href="#demo"
          class="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-green-500/20 transition duration-300 hover:-translate-y-0.5 hover:bg-green-700 sm:w-auto"
        >
          <Icon icon="ph:play-circle-duotone" class="size-5" />
          Lihat Demo
        </a>

        <a
          href="#contact"
          class="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-800 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 sm:w-auto"
        >
          <Icon icon="ph:chat-circle-dots-duotone" class="size-5" />
          Konsultasi Implementasi
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)
const stepRefs = ref<HTMLElement[]>([])
const sectionVisible = ref(false)
const visibleIndexes = ref<Set<number>>(new Set())
const activeIndex = ref(0)
const smoothProgress = ref(0)

let sectionObserver: IntersectionObserver | null = null
let stepObserver: IntersectionObserver | null = null
let rafId = 0
let targetProgress = 0

const kpis = [
  {
    label: 'Implementasi',
    value: 'Modular',
    icon: 'ph:squares-four-duotone',
  },
  {
    label: 'Konektivitas',
    value: 'Wi-Fi / LAN',
    icon: 'ph:wifi-high-duotone',
  },
  {
    label: 'Branding',
    value: 'Custom',
    icon: 'ph:paint-brush-duotone',
  },
  {
    label: 'Skalabilitas',
    value: 'Multi-Campus',
    icon: 'ph:buildings-duotone',
  },
]

const fullSteps: Array<{
  title: string
  desc: string
  icon: string
  items?: string[]
}> = [
  {
    title: 'Order & Kebutuhan',
    desc: 'Tentukan paket dan modul yang dibutuhkan, termasuk preferensi branding lembaga.',
    icon: 'ph:shopping-cart-simple-duotone',
    items: ['Pilih paket utama', 'Tentukan modul prioritas', 'Siapkan logo dan warna brand'],
  },
  {
    title: 'Onboarding & Timeline',
    desc: 'Kickoff singkat untuk menyamakan tujuan, peran tim, dan rencana implementasi.',
    icon: 'ph:calendar-check-duotone',
    items: ['Target go-live', 'Pembagian peran', 'Milestone mingguan'],
  },
  {
    title: 'Instalasi Perangkat',
    desc: 'Siapkan ToriID atau perangkat pendukung pada titik operasional yang dibutuhkan.',
    icon: 'ph:device-mobile-duotone',
    items: ['Penempatan perangkat', 'Uji konektivitas', 'Branding display dan casing'],
  },
  {
    title: 'Migrasi Data',
    desc: 'Impor data santri, kelas, wali, presensi, atau keuangan jika sudah tersedia sebelumnya.',
    icon: 'ph:database-duotone',
    items: ['Template CSV/Sheets', 'Validasi dan deduplikasi', 'Uji data sampel'],
  },
  {
    title: 'Konfigurasi Sistem',
    desc: 'Atur tahun ajaran, struktur kelas, hak akses, tagihan, notifikasi, dan template dokumen.',
    icon: 'ph:sliders-duotone',
    items: ['RBAC per peran', 'SPP dan cicilan', 'Template WA dan surat'],
  },
  {
    title: 'Pelatihan Pengguna',
    desc: 'Pelatihan admin, wali kelas, bendahara, operator gerbang, dan pihak yang terlibat.',
    icon: 'ph:chalkboard-teacher-duotone',
    items: ['Panduan singkat', 'Skenario harian', 'Bank tanya-jawab'],
  },
  {
    title: 'Go-Live Bertahap',
    desc: 'Mulai dari modul prioritas, lalu lanjut ke modul tambahan setelah proses utama stabil.',
    icon: 'ph:rocket-launch-duotone',
    items: ['Soft-launch', 'Pantau error awal', 'Feedback cepat'],
  },
  {
    title: 'Otomasi Harian',
    desc: 'Aktifkan notifikasi, pengingat, rekap otomatis, dan alur administrasi harian.',
    icon: 'ph:arrows-clockwise-duotone',
    items: ['Pengingat jatuh tempo', 'Broadcast wali', 'Rekap otomatis'],
  },
  {
    title: 'Monitoring & Audit',
    desc: 'Pantau data realtime, audit log aktivitas, dan laporan berkala untuk evaluasi.',
    icon: 'ph:chart-line-up-duotone',
    items: ['Grafik SPP dan presensi', 'Log perangkat', 'Ekspor XLS/CSV'],
  },
  {
    title: 'Scale-Up & Integrasi',
    desc: 'Tambah modul, device, multi-campus, atau integrasi API sesuai kebutuhan lembaga.',
    icon: 'ph:arrows-out-cardinal-duotone',
    items: ['Tambah modul', 'Multi-campus', 'API/Webhook'],
  },
]

function resolveElement(el: unknown): HTMLElement | null {
  if (el instanceof HTMLElement) return el

  const maybeComponent = el as { $el?: unknown } | null

  if (maybeComponent?.$el instanceof HTMLElement) {
    return maybeComponent.$el
  }

  return null
}

function setStepRef(el: unknown, index: number) {
  const element = resolveElement(el)
  if (!element) return

  stepRefs.value[index] = element

  if (stepObserver) {
    stepObserver.observe(element)
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function updateScrollState() {
  if (!sectionRef.value) return

  const rect = sectionRef.value.getBoundingClientRect()
  const scrollable = Math.max(rect.height - window.innerHeight, 1)

  targetProgress = clamp(-rect.top / scrollable, 0, 1)

  const focusLine = window.innerHeight * 0.45
  let closestIndex = activeIndex.value
  let closestDistance = Number.POSITIVE_INFINITY

  stepRefs.value.forEach((step, index) => {
    const stepRect = step.getBoundingClientRect()
    const center = stepRect.top + stepRect.height / 2
    const distance = Math.abs(center - focusLine)

    if (distance < closestDistance) {
      closestDistance = distance
      closestIndex = index
    }
  })

  activeIndex.value = closestIndex
}

function animateProgress() {
  smoothProgress.value += (targetProgress - smoothProgress.value) * 0.075

  if (Math.abs(targetProgress - smoothProgress.value) < 0.001) {
    smoothProgress.value = targetProgress
  }

  rafId = requestAnimationFrame(animateProgress)
}

function numberBg(i: number) {
  const palettes = [
    'linear-gradient(135deg,#16a34a,#22c55e)',
    'linear-gradient(135deg,#10b981,#84cc16)',
    'linear-gradient(135deg,#059669,#14b8a6)',
    'linear-gradient(135deg,#22c55e,#65a30d)',
  ]

  return palettes[i % palettes.length]
}

function progressWidth(i: number, total: number) {
  if (total <= 1) return '100%'
  return `${Math.round(((i + 1) / total) * 100)}%`
}

onMounted(async () => {
  sectionVisible.value = true
  await nextTick()

  if (!('IntersectionObserver' in window)) {
    visibleIndexes.value = new Set(fullSteps.map((_, index) => index))
    updateScrollState()
    animateProgress()
    window.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState, { passive: true })
    return
  }

  sectionObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        sectionVisible.value = true
      }
    },
    {
      threshold: 0.08,
    },
  )

  stepObserver = new IntersectionObserver(
    (entries) => {
      const next = new Set(visibleIndexes.value)

      entries.forEach((entry) => {
        const index = stepRefs.value.findIndex((el) => el === entry.target)

        if (entry.isIntersecting && index >= 0) {
          next.add(index)
        }
      })

      visibleIndexes.value = next
    },
    {
      threshold: 0.14,
      rootMargin: '0px 0px -8% 0px',
    },
  )

  if (sectionRef.value) {
    sectionObserver.observe(sectionRef.value)
  }

  stepRefs.value.forEach((step) => {
    stepObserver?.observe(step)
  })

  requestAnimationFrame(() => {
    visibleIndexes.value = new Set([0])
    updateScrollState()
  })

  animateProgress()

  window.addEventListener('scroll', updateScrollState, { passive: true })
  window.addEventListener('resize', updateScrollState, { passive: true })
})

onBeforeUnmount(() => {
  sectionObserver?.disconnect()
  stepObserver?.disconnect()
  cancelAnimationFrame(rafId)

  window.removeEventListener('scroll', updateScrollState)
  window.removeEventListener('resize', updateScrollState)
})
</script>

<style scoped>
.kpi-card {
  opacity: 0;
  transform: translate3d(0, 18px, 0) scale(0.985);
  animation: kpiReveal 720ms cubic-bezier(0.22, 1, 0.36, 1) var(--delay) both;
}

.timeline-item {
  opacity: 0;
  transform: translate3d(0, 34px, 0) scale(0.985);
  filter: blur(12px);
}

.timeline-item.is-visible {
  animation: timelineReveal 840ms cubic-bezier(0.22, 1, 0.36, 1) var(--delay) both;
}

.timeline-item.is-active .step-card {
  border-color: rgba(34, 197, 94, 0.38);
  box-shadow: 0 28px 80px rgba(20, 83, 45, 0.12);
}

.timeline-item.is-active .timeline-node {
  box-shadow: 0 20px 50px rgba(34, 197, 94, 0.35);
}

@keyframes kpiReveal {
  0% {
    opacity: 0;
    transform: translate3d(0, 18px, 0) scale(0.985);
    filter: blur(8px);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
    filter: blur(0);
  }
}

@keyframes timelineReveal {
  0% {
    opacity: 0;
    transform: translate3d(0, 34px, 0) scale(0.985);
    filter: blur(12px);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
    filter: blur(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .kpi-card,
  .timeline-item,
  .timeline-item.is-visible {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }

  * {
    transition-duration: 0.01ms !important;
  }
}
</style>