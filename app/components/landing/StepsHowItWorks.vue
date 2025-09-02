<template>
  <section class="py-24 relative overflow-hidden">
    <!-- background lembut -->
    <div class="absolute inset-0 -z-10">
      <div class="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(16,185,129,0.07)_1px,transparent_1px)] [background-size:18px_18px]" />
    </div>

    <div class="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto">
        <h2 class="text-3xl sm:text-5xl font-extrabold tracking-tight">
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">
            Cara Kerja dari Order hingga Sistem Pondok Efisien
          </span>
        </h2>
        <p class="mt-3 text-gray-600 dark:text-neutral-300">
          Alur terstruktur dari pemesanan sampai automasi harian semua terukur dan bisa ditingkatkan kapan saja.
        </p>
      </div>

      <!-- KPI ringkas -->
      <div class="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div class="rounded-2xl border border-gray-200/70 dark:border-neutral-800 bg-white/70 dark:bg-white/5 backdrop-blur p-4">
          <p class="text-xs text-gray-600 dark:text-neutral-400">Implementasi bertahap</p>
          <p class="mt-1 text-lg font-extrabold">Modular</p>
        </div>
        <div class="rounded-2xl border border-gray-200/70 dark:border-neutral-800 bg-white/70 dark:bg-white/5 backdrop-blur p-4">
          <p class="text-xs text-gray-600 dark:text-neutral-400">Konektivitas</p>
          <p class="mt-1 text-lg font-extrabold">Wi-Fi / LAN / USB</p>
        </div>
        <div class="rounded-2xl border border-gray-200/70 dark:border-neutral-800 bg-white/70 dark:bg-white/5 backdrop-blur p-4">
          <p class="text-xs text-gray-600 dark:text-neutral-400">Branding</p>
          <p class="mt-1 text-lg font-extrabold">Display + Casing</p>
        </div>
        <div class="rounded-2xl border border-gray-200/70 dark:border-neutral-800 bg-white/70 dark:bg-white/5 backdrop-blur p-4">
          <p class="text-xs text-gray-600 dark:text-neutral-400">Skalabilitas</p>
          <p class="mt-1 text-lg font-extrabold">Multi-Campus</p>
        </div>
      </div>

      <!-- Grid langkah + connectors -->
      <div class="mt-10 relative">
        <!-- connector horizontal (desktop) -->
        <div class="hidden lg:block absolute left-0 right-0 top-1/2 -translate-y-1/2 mx-2" aria-hidden="true">
          <div class="h-[2px] bg-gradient-to-r from-emerald-200 via-emerald-300/60 to-emerald-200 dark:from-emerald-700/30 dark:via-emerald-600/30 dark:to-emerald-700/30"></div>
        </div>

        <!-- connector vertikal (mobile) -->
        <div class="lg:hidden absolute left-4 top-0 bottom-0" aria-hidden="true">
          <div class="w-[2px] h-full bg-gradient-to-b from-emerald-200 via-emerald-300/60 to-emerald-200 dark:from-emerald-700/30 dark:via-emerald-600/30 dark:to-emerald-700/30"></div>
        </div>

        <div class="grid gap-5 lg:grid-cols-5">
          <article
            v-for="(s,i) in fullSteps"
            :key="s.title"
            class="group relative p-5 rounded-2xl border bg-white/70 dark:bg-white/5 border-gray-200/70 dark:border-neutral-800 backdrop-blur-xl shadow-sm hover:shadow-2xl transition-all duration-300 will-change-transform lg:hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-emerald-400"
            :class="i < 5 ? '' : 'lg:mt-10'"
          >
            <!-- dot connector desktop -->
            <span
              class="hidden lg:inline-block absolute top-1/2 -translate-y-1/2 -right-3 size-3 rounded-full bg-emerald-500/70 ring-4 ring-emerald-500/15"
              v-if="i !== fullSteps.length - 1"
              aria-hidden="true"
            />
            <!-- dot connector mobile -->
            <span
              class="lg:hidden absolute left-3 top-5 size-3 rounded-full bg-emerald-500/70 ring-4 ring-emerald-500/15"
              aria-hidden="true"
            />

            <!-- nomor + ikon -->
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm select-none" :style="{ background: numberBg(i) }">
                {{ i + 1 }}
              </div>
              <ClientOnly>
                <Icon :icon="s.icon" class="size-6 text-emerald-600" aria-hidden="true" />
              </ClientOnly>
            </div>

            <h3 class="mt-3 font-semibold tracking-tight text-gray-900 dark:text-neutral-50">
              {{ s.title }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-neutral-300 mt-1">
              {{ s.desc }}
            </p>

            <!-- sub items nyata bila ada -->
            <ul v-if="s.items?.length" class="mt-3 space-y-1.5 text-sm text-gray-700 dark:text-neutral-300">
              <li v-for="it in s.items" :key="it" class="flex items-start gap-2">
                <Icon icon="mdi:check-circle" class="mt-0.5 w-4 h-4 text-emerald-500" aria-hidden="true" />
                <span>{{ it }}</span>
              </li>
            </ul>

            <!-- progress bar -->
            <div class="mt-4 h-1.5 w-full rounded-full bg-gray-200 dark:bg-neutral-800 overflow-hidden">
              <div class="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-[width] duration-500" :style="{ width: progressWidth(i, fullSteps.length) }" />
            </div>
          </article>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-10 flex justify-center gap-3">
        <a href="#demo" class="inline-flex items-center justify-center rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 text-sm font-semibold transition focus:outline-hidden focus:ring-2 focus:ring-emerald-400">
          Lihat Demo
        </a>
        <a href="#contact" class="inline-flex items-center justify-center rounded-2xl border border-gray-300 dark:border-neutral-700 px-5 py-3 text-sm font-semibold text-gray-800 dark:text-neutral-100 hover:bg-gray-50 dark:hover:bg-neutral-800 transition">
          Konsultasi Implementasi
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

/** 10 langkah lengkap: dari order sampai efisiensi berkelanjutan */
const fullSteps: Array<{
  title: string
  desc: string
  icon: string
  items?: string[]
}> = [
  {
    title: 'Order & Kebutuhan',
    desc: 'Tentukan paket & modul yang dibutuhkan, sertakan preferensi branding.',
    icon: 'ph:shopping-cart-simple',
    items: ['Pilih paket (Basic/Pro/Enterprise)', 'Modul prioritas', 'Logo & warna brand']
  },
  {
    title: 'Onboarding & Timeline',
    desc: 'Kickoff singkat: tujuan, peran tim, dan rencana implementasi.',
    icon: 'ph:calendar-check',
    items: ['Target go-live', 'Pembagian peran', 'Milestone mingguan']
  },
  {
    title: 'Instalasi Perangkat',
    desc: 'Siapkan ToriID di titik masuk, koneksi via Wi-Fi/LAN/USB.',
    icon: 'ph:device-mobile',
    items: ['Penempatan perangkat', 'Uji konektivitas', 'Branding display & casing']
  },
  {
    title: 'Migrasi Data',
    desc: 'Impor data santri, kelas, wali, dan histori presensi/keuangan (bila ada).',
    icon: 'ph:database',
    items: ['Template CSV/Sheets', 'Validasi & dedup', 'Uji sampel']
  },
  {
    title: 'Konfigurasi Sistem',
    desc: 'Atur tahun ajaran, struktur kelas, hak akses, tagihan & notifikasi.',
    icon: 'ph:sliders',
    items: ['RBAC per peran', 'SPP & cicilan', 'Template WA & surat']
  },
  {
    title: 'Pelatihan Pengguna',
    desc: 'Pelatihan admin, wali kelas, bendahara, dan operator gerbang.',
    icon: 'ph:chalkboard-teacher',
    items: ['Panduan singkat', 'Skenario harian', 'Bank tanya-jawab']
  },
  {
    title: 'Go-Live Bertahap',
    desc: 'Mulai dari presensi & pembayaran, lanjut modul akademik/kunjungan.',
    icon: 'ph:rocket-launch',
    items: ['Soft-launch', 'Pantau error awal', 'Feedback cepat']
  },
  {
    title: 'Otomasi Harian',
    desc: 'Notifikasi WA otomatis, pengingat SPP, rekap presensi & izin.',
    icon: 'ph:arrows-clockwise',
    items: ['Pengingat jatuh tempo', 'Broadcast wali', 'Rekap otomatis']
  },
  {
    title: 'Monitoring & Audit',
    desc: 'Dashboard realtime, audit log aktivitas, dan laporan berkala.',
    icon: 'ph:chart-line-up',
    items: ['Grafik SPP & presensi', 'Log perangkat', 'Ekspor XLS/CSV']
  },
  {
    title: 'Scale-Up & Integrasi',
    desc: 'Tambah device, multi-campus, integrasi ERP/keuangan sesuai kebutuhan.',
    icon: 'ph:arrows-out-cardinal',
    items: ['Tambah modul', 'Multi-campus', 'API/Webhook']
  }
]

/** Warna gradasi badge nomor */
function numberBg(i: number) {
  const palettes = [
    'linear-gradient(135deg,#10B981,#34D399)', // emerald
    'linear-gradient(135deg,#14B8A6,#22D3EE)', // teal/cyan
    'linear-gradient(135deg,#06B6D4,#60A5FA)', // cyan/blue
    'linear-gradient(135deg,#0EA5E9,#22C55E)', // sky/green
  ]
  return palettes[i % palettes.length]
}

/** Lebar progress: proporsional posisi langkah */
function progressWidth(i: number, total: number) {
  if (total <= 1) return '100%'
  const pct = Math.round(((i + 1) / total) * 100)
  return `${pct}%`
}
</script>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  .group { transition: none !important; }
}
</style>
