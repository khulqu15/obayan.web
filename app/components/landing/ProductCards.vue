<template>
  <section id="products" class="relative overflow-hidden py-20 sm:py-24">
    <!-- Background -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-gradient-to-b from-green-50/80 via-white to-white dark:from-green-950/25 dark:via-neutral-950 dark:to-neutral-950" />
      <div class="absolute -left-24 top-10 size-80 rounded-full bg-green-300/25 blur-3xl dark:bg-green-500/10" />
      <div class="absolute -right-24 bottom-0 size-96 rounded-full bg-lime-300/20 blur-3xl dark:bg-lime-500/10" />
    </div>

    <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 rounded-full border border-green-200/70 bg-white/80 px-4 py-2 text-xs font-black text-green-700 shadow-sm shadow-green-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-green-300">
            <span class="relative flex size-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
              <span class="relative inline-flex size-2 rounded-full bg-green-600" />
            </span>
            Modul Fitur Obayan
          </div>

          <h2 class="mt-4 text-3xl font-black tracking-tight text-gray-950 dark:text-white sm:text-5xl">
            Pilih fitur sesuai kebutuhan,
            <span class="bg-gradient-to-r from-green-600 via-emerald-500 to-lime-500 bg-clip-text text-transparent">
              hidupkan bertahap
            </span>
          </h2>

          <p class="mt-4 text-base leading-8 text-gray-600 dark:text-neutral-300">
            Setiap modul bisa dipakai mandiri atau dipadukan dalam satu ekosistem untuk website, SIAKAD, absensi, pembayaran, hingga layanan wali.
          </p>
        </div>

        <NuxtLink
          to="/fitur"
          class="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-gray-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-xl dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
        >
          Semua Fitur
          <Icon icon="ph:arrow-right-bold" class="size-4" />
        </NuxtLink>
      </div>

      <!-- Cards -->
      <div class="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <NuxtLink
          v-for="(p, i) in localProducts"
          :key="p.key"
          :to="{ path: '/fitur', query: { slug: p.demoHref } }"
          class="feature-card group relative overflow-hidden rounded-[1.75rem] border border-gray-200/70 bg-white/80 p-5 shadow-sm shadow-gray-950/[0.03] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:border-green-200 hover:bg-white hover:shadow-2xl hover:shadow-green-900/10 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-green-400/30 dark:hover:bg-white/[0.07]"
          :style="{ '--delay': `${i * 90}ms` }"
        >
          <!-- Badge -->
          <div
            v-if="p.featured"
            class="absolute right-4 top-4 z-20 rounded-full bg-green-600/10 px-2.5 py-1 text-[11px] font-black text-green-700 ring-1 ring-green-600/10 dark:text-green-300"
          >
            Populer
          </div>

          <!-- Glow -->
          <div class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div class="absolute -right-16 -top-16 size-44 rounded-full bg-green-300/20 blur-3xl" />
            <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/70 to-transparent" />
          </div>

          <!-- Animated Widget -->
          <div class="relative mb-5 h-36 overflow-hidden rounded-[1.35rem] border border-green-100/80 bg-gradient-to-br from-green-50 via-white to-lime-50 p-4 shadow-inner shadow-white/80 dark:border-white/10 dark:from-green-950/40 dark:via-neutral-950 dark:to-neutral-900">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.18),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(132,204,22,0.14),transparent_24%)]" />

            <!-- Web Profile -->
            <div v-if="p.widgetType === 'browser'" class="relative h-full">
              <div class="widget-window h-full rounded-2xl border border-white/80 bg-white/90 p-3 shadow-xl dark:border-white/10 dark:bg-neutral-900/80">
                <div class="mb-3 flex items-center gap-1.5">
                  <span class="size-2 rounded-full bg-red-300" />
                  <span class="size-2 rounded-full bg-yellow-300" />
                  <span class="size-2 rounded-full bg-green-400" />
                </div>
                <div class="h-12 rounded-xl bg-green-100 dark:bg-green-500/15" />
                <div class="mt-3 grid grid-cols-3 gap-2">
                  <span class="h-8 rounded-xl bg-lime-100 dark:bg-lime-500/15" />
                  <span class="h-8 rounded-xl bg-emerald-100 dark:bg-emerald-500/15" />
                  <span class="h-8 rounded-xl bg-green-100 dark:bg-green-500/15" />
                </div>
              </div>
            </div>

            <!-- SIAKAD -->
            <div v-else-if="p.widgetType === 'cards'" class="relative grid h-full grid-cols-2 gap-2">
              <div class="widget-float-a rounded-2xl bg-white/90 p-3 shadow-lg dark:bg-neutral-900/80">
                <div class="h-8 rounded-xl bg-green-100 dark:bg-green-500/15" />
                <div class="mt-3 h-2 w-4/5 rounded-full bg-green-200 dark:bg-green-400/20" />
              </div>
              <div class="widget-float-b rounded-2xl bg-white/90 p-3 shadow-lg dark:bg-neutral-900/80">
                <div class="h-12 rounded-xl bg-lime-100 dark:bg-lime-500/15" />
                <div class="mt-3 h-2 w-3/5 rounded-full bg-green-100 dark:bg-white/10" />
              </div>
              <div class="widget-float-c col-span-2 rounded-2xl bg-white/90 p-3 shadow-lg dark:bg-neutral-900/80">
                <div class="grid grid-cols-4 gap-2">
                  <span class="h-7 rounded-xl bg-green-100 dark:bg-green-500/15" />
                  <span class="h-7 rounded-xl bg-emerald-100 dark:bg-emerald-500/15" />
                  <span class="h-7 rounded-xl bg-lime-100 dark:bg-lime-500/15" />
                  <span class="h-7 rounded-xl bg-green-100 dark:bg-green-500/15" />
                </div>
              </div>
            </div>

            <!-- Payment -->
            <div v-else-if="p.widgetType === 'bars'" class="relative flex h-full items-end justify-center gap-2">
              <span class="widget-bar h-9 w-4 rounded-full bg-green-500" />
              <span class="widget-bar widget-bar-delay h-16 w-4 rounded-full bg-lime-500" />
              <span class="widget-bar widget-bar-delay-2 h-12 w-4 rounded-full bg-emerald-500" />
              <span class="widget-bar widget-bar-delay-3 h-20 w-4 rounded-full bg-green-600" />
              <span class="widget-bar widget-bar-delay-4 h-14 w-4 rounded-full bg-teal-500" />
            </div>

            <!-- Academic -->
            <div v-else-if="p.widgetType === 'line'" class="relative h-full">
              <svg viewBox="0 0 260 110" class="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
                <path
                  class="widget-line-soft"
                  d="M8 88 C42 72 52 40 82 58 C112 76 118 22 150 38 C184 56 194 24 226 18 C242 15 252 18 258 20"
                  stroke="rgba(34,197,94,0.16)"
                  stroke-width="14"
                  stroke-linecap="round"
                />
                <path
                  class="widget-line"
                  d="M8 88 C42 72 52 40 82 58 C112 76 118 22 150 38 C184 56 194 24 226 18 C242 15 252 18 258 20"
                  stroke="#16a34a"
                  stroke-width="5"
                  stroke-linecap="round"
                />
              </svg>
            </div>

            <!-- Attendance -->
            <div v-else-if="p.widgetType === 'scan'" class="relative flex h-full items-center justify-center">
              <div class="widget-orbit absolute size-24 rounded-full border border-green-300/60 dark:border-green-400/20">
                <span class="absolute -top-1 left-1/2 size-3 -translate-x-1/2 rounded-full bg-green-500 shadow-lg shadow-green-500/40" />
              </div>

              <div class="widget-scan-line absolute left-8 right-8 top-1/2 h-0.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />

              <div class="relative grid size-16 place-items-center rounded-2xl bg-white text-green-600 shadow-xl shadow-green-900/10 ring-1 ring-green-100 dark:bg-neutral-900 dark:text-green-300 dark:ring-white/10">
                <Icon :icon="p.icon" class="size-7" />
              </div>
            </div>

            <!-- Visitor -->
            <div v-else-if="p.widgetType === 'map'" class="relative h-full">
              <div class="absolute inset-3 rounded-2xl border border-dashed border-green-200 dark:border-green-400/20" />
              <span class="widget-pin absolute left-[20%] top-[28%] size-4 rounded-full bg-green-500 shadow-lg shadow-green-500/30" />
              <span class="widget-pin widget-pin-delay absolute left-[58%] top-[50%] size-4 rounded-full bg-lime-500 shadow-lg shadow-lime-500/30" />
              <span class="widget-pin widget-pin-delay-2 absolute left-[72%] top-[22%] size-4 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30" />
              <span class="absolute left-[22%] top-[30%] h-px w-[38%] rotate-[18deg] bg-green-300 dark:bg-green-400/30" />
              <span class="absolute left-[58%] top-[44%] h-px w-[16%] -rotate-[36deg] bg-lime-300 dark:bg-lime-400/30" />
            </div>

            <!-- Violation -->
            <div v-else-if="p.widgetType === 'alert'" class="flex h-full items-center justify-center">
              <div class="widget-alert rounded-[1.5rem] border border-amber-100 bg-white/90 px-5 py-4 shadow-lg dark:border-amber-400/20 dark:bg-neutral-900/80">
                <div class="flex items-center gap-3">
                  <span class="grid size-10 place-items-center rounded-2xl bg-amber-500 text-white">
                    <Icon :icon="p.icon" class="size-5" />
                  </span>
                  <div>
                    <div class="h-2 w-24 rounded-full bg-amber-200 dark:bg-amber-400/20" />
                    <div class="mt-2 h-2 w-16 rounded-full bg-amber-100 dark:bg-white/10" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Permission -->
            <div v-else class="flex h-full flex-col justify-center gap-3">
              <div
                v-for="n in 3"
                :key="n"
                class="widget-check flex items-center gap-3 rounded-2xl border border-green-100 bg-white/80 px-3 py-2 shadow-sm dark:border-white/10 dark:bg-neutral-900/70"
                :style="{ '--check-delay': `${n * 180}ms` }"
              >
                <span class="grid size-6 place-items-center rounded-full bg-green-600 text-white">
                  <Icon icon="ph:check-bold" class="size-3.5" />
                </span>
                <span class="h-2 rounded-full bg-green-200 dark:bg-green-500/20" :class="n === 1 ? 'w-24' : n === 2 ? 'w-32' : 'w-20'" />
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="relative">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-black tracking-tight text-gray-950 dark:text-white">
                  {{ p.title }}
                </h3>
                <p class="mt-1.5 text-sm leading-6 text-gray-600 dark:text-neutral-300">
                  {{ p.desc }}
                </p>
              </div>

              <span class="grid size-9 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-600 transition group-hover:bg-green-600 group-hover:text-white dark:bg-green-500/10 dark:text-green-300">
                <Icon icon="ph:arrow-up-right-bold" class="size-4" />
              </span>
            </div>

            <div class="mt-5 flex flex-wrap gap-1.5">
              <span
                v-for="t in p.tags"
                :key="t"
                class="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-700 transition-colors duration-300 group-hover:bg-green-50 group-hover:text-green-700 dark:bg-neutral-800 dark:text-neutral-200 dark:group-hover:bg-green-500/10 dark:group-hover:text-green-300"
              >
                {{ t }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

type ProductKey =
  | 'webprofile'
  | 'siakad'
  | 'payment'
  | 'academic'
  | 'attendance'
  | 'visitor'
  | 'violation'
  | 'permission'

type WidgetType =
  | 'browser'
  | 'cards'
  | 'bars'
  | 'line'
  | 'scan'
  | 'map'
  | 'alert'
  | 'checklist'

const localProducts: Array<{
  key: ProductKey
  title: string
  desc: string
  icon: string
  widgetType: WidgetType
  tags: string[]
  featured?: boolean
  demoHref: string
  salesHref: string
}> = [
  {
    key: 'webprofile',
    title: 'Web Profile',
    desc: 'Profil pondok yang hangat, ringan, dan SEO-ready.',
    icon: 'ph:globe',
    widgetType: 'browser',
    tags: ['SEO', 'Blog', 'Profil'],
    featured: false,
    demoHref: 'profile-web-editor',
    salesHref: '#contact?module=webprofile',
  },
  {
    key: 'siakad',
    title: 'SIAKAD',
    desc: 'Manajemen data santri, kelas, nilai, dan rapor.',
    icon: 'ph:student',
    widgetType: 'cards',
    tags: ['Rapor', 'Kelas', 'Data'],
    featured: true,
    demoHref: 'siakad',
    salesHref: '#contact?module=siakad',
  },
  {
    key: 'payment',
    title: 'Pembayaran',
    desc: 'Tagihan, cicilan, beasiswa; QRIS/VA & rekonsiliasi.',
    icon: 'ph:bank',
    widgetType: 'bars',
    tags: ['QRIS', 'VA', 'SPP'],
    featured: true,
    demoHref: 'pembayaran',
    salesHref: '#contact?module=payment',
  },
  {
    key: 'academic',
    title: 'Akademik',
    desc: 'Jadwal, materi, tugas, ujian/CBT dasar.',
    icon: 'ph:chalkboard-teacher',
    widgetType: 'line',
    tags: ['Jadwal', 'Materi', 'CBT'],
    featured: false,
    demoHref: 'nilai-rapor',
    salesHref: '#contact?module=academic',
  },
  {
    key: 'attendance',
    title: 'Absensi',
    desc: 'RFID & Fingerprint (ToriID), shift, keterlambatan.',
    icon: 'ph:identification-badge',
    widgetType: 'scan',
    tags: ['RFID', 'Fingerprint', 'Shift'],
    featured: true,
    demoHref: 'absensi',
    salesHref: '#contact?module=attendance',
  },
  {
    key: 'visitor',
    title: 'Kunjungan',
    desc: 'Pengajuan wali, jadwal, pass, & log keamanan.',
    icon: 'ph:map-pin',
    widgetType: 'map',
    tags: ['Security', 'Pass', 'Wali'],
    featured: false,
    demoHref: 'pengumuman',
    salesHref: '#contact?module=visitor',
  },
  {
    key: 'violation',
    title: 'Pelanggaran',
    desc: 'Poin pelanggaran, pembinaan, & notifikasi.',
    icon: 'ph:warning',
    widgetType: 'alert',
    tags: ['Poin', 'Pembinaan', 'Notifikasi'],
    featured: false,
    demoHref: 'pelanggaran',
    salesHref: '#contact?module=violation',
  },
  {
    key: 'permission',
    title: 'Perizinan',
    desc: 'Izin keluar, sakit, tugas; alur persetujuan.',
    icon: 'ph:note-pencil',
    widgetType: 'checklist',
    tags: ['Approval', 'Surat', 'Arsip'],
    featured: false,
    demoHref: 'perizinan-printout',
    salesHref: '#contact?module=permission',
  },
]
</script>

<style scoped>
.feature-card {
  opacity: 0;
  transform: translate3d(0, 24px, 0) scale(0.985);
  filter: blur(10px);
  animation: cardReveal 760ms cubic-bezier(0.22, 1, 0.36, 1) var(--delay) both;
}

.widget-window {
  animation: windowFloat 4.4s ease-in-out infinite;
}

.widget-float-a {
  animation: floatA 5.5s ease-in-out infinite;
}

.widget-float-b {
  animation: floatB 6.2s ease-in-out infinite;
}

.widget-float-c {
  animation: floatC 5.8s ease-in-out infinite;
}

.widget-bar {
  transform-origin: bottom;
  animation: barWave 2.6s ease-in-out infinite;
}

.widget-bar-delay {
  animation-delay: 180ms;
}

.widget-bar-delay-2 {
  animation-delay: 360ms;
}

.widget-bar-delay-3 {
  animation-delay: 540ms;
}

.widget-bar-delay-4 {
  animation-delay: 720ms;
}

.widget-line,
.widget-line-soft {
  stroke-dasharray: 420;
  stroke-dashoffset: 420;
  animation: drawLine 3.6s ease-in-out infinite;
}

.widget-orbit {
  animation: orbitSpin 8.5s linear infinite;
}

.widget-scan-line {
  animation: scanMove 2.4s ease-in-out infinite;
}

.widget-pin {
  animation: pinPulse 2.8s ease-in-out infinite;
}

.widget-pin-delay {
  animation-delay: 400ms;
}

.widget-pin-delay-2 {
  animation-delay: 800ms;
}

.widget-alert {
  animation: alertBounce 3.2s ease-in-out infinite;
}

.widget-check {
  animation: checkFloat 3.2s ease-in-out infinite;
  animation-delay: var(--check-delay);
}

@keyframes cardReveal {
  0% {
    opacity: 0;
    transform: translate3d(0, 24px, 0) scale(0.985);
    filter: blur(10px);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
    filter: blur(0);
  }
}

@keyframes windowFloat {
  0%,
  100% {
    transform: translateY(0) rotate(-0.8deg);
  }

  50% {
    transform: translateY(-6px) rotate(0.8deg);
  }
}

@keyframes floatA {
  0%,
  100% {
    transform: translate3d(0, 0, 0) rotate(-1deg);
  }

  50% {
    transform: translate3d(10px, -12px, 0) rotate(1deg);
  }
}

@keyframes floatB {
  0%,
  100% {
    transform: translate3d(0, 0, 0) rotate(1deg);
  }

  50% {
    transform: translate3d(-12px, 10px, 0) rotate(-1deg);
  }
}

@keyframes floatC {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  50% {
    transform: translate3d(8px, -8px, 0);
  }
}

@keyframes barWave {
  0%,
  100% {
    transform: scaleY(0.55);
    opacity: 0.65;
  }

  50% {
    transform: scaleY(1);
    opacity: 1;
  }
}

@keyframes drawLine {
  0% {
    stroke-dashoffset: 420;
    opacity: 0.35;
  }

  45%,
  70% {
    stroke-dashoffset: 0;
    opacity: 1;
  }

  100% {
    stroke-dashoffset: -420;
    opacity: 0.25;
  }
}

@keyframes orbitSpin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes scanMove {
  0%,
  100% {
    transform: translateY(-30px);
    opacity: 0.25;
  }

  50% {
    transform: translateY(30px);
    opacity: 1;
  }
}

@keyframes pinPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.8;
  }

  50% {
    transform: scale(1.18);
    opacity: 1;
  }
}

@keyframes alertBounce {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-7px);
  }
}

@keyframes checkFloat {
  0%,
  100% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .feature-card,
  .widget-window,
  .widget-float-a,
  .widget-float-b,
  .widget-float-c,
  .widget-bar,
  .widget-line,
  .widget-line-soft,
  .widget-orbit,
  .widget-scan-line,
  .widget-pin,
  .widget-alert,
  .widget-check {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }
}
</style>