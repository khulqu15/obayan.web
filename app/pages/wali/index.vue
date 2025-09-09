<template>
  <div class="space-y-6 p-6">
    <!-- Top: Profil santri + Pengumuman -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Card Santri -->
      <section class="xl:col-span-1 rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
        <div class="p-5 flex items-start gap-4">
          <img :src="santri.avatar" alt="Foto Santri" class="size-16 rounded-2xl object-cover ring-2 ring-blue-100 dark:ring-blue-900/40" />
          <div class="min-w-0">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white truncate">{{ santri.name }}</h2>
            <p class="text-sm text-gray-500 dark:text-neutral-400">{{ santri.nis }} • {{ santri.jenjang }}</p>
            <div class="mt-2 flex flex-wrap gap-2">
              <span class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30">
                <Icon icon="lucide:venetian-mask" class="size-3.5" /> {{ santri.gen }}
              </span>
              <span class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-50 -700 dark:bg-emerald-900/30 dark:-300">
                <Icon icon="lucide:home" class="size-3.5" /> {{ santri.maskan }}
              </span>
              <span class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                <Icon icon="lucide:bed" class="size-3.5" /> Kamar {{ santri.kamar }}
              </span>
              <span class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                <Icon icon="ri:rfid-fill" class="size-3.5" /> RFID {{ santri.rfid }}
              </span>
            </div>
          </div>
        </div>

        <div class="px-5 pb-5">
          <dl class="grid grid-cols-2 gap-3 text-sm">
            <div class="p-3 rounded-xl bg-gray-50 dark:bg-neutral-800/70">
              <dt class="text-gray-500 dark:text-neutral-400">Wali</dt>
              <dd class="font-medium text-gray-800 dark:text-neutral-100 truncate">{{ santri.wali }}</dd>
            </div>
            <div class="p-3 rounded-xl bg-gray-50 dark:bg-neutral-800/70">
              <dt class="text-gray-500 dark:text-neutral-400">Kontak Wali</dt>
              <dd class="font-medium text-gray-800 dark:text-neutral-100">{{ santri.waliPhone }}</dd>
            </div>
          </dl>
        </div>
      </section>

      <!-- Card Pengumuman -->
      <section class="xl:col-span-2 rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
        <header class="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-neutral-800">
          <h3 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon icon="lucide:megaphone" class="size-5" /> Pengumuman Terbaru
          </h3>
          <NuxtLink to="/wali/pengumuman" class="text-sm">Lihat semua</NuxtLink>
        </header>

        <ul class="divide-y divide-gray-200 dark:divide-neutral-800">
          <li v-for="p in pengumuman" :key="p.id" class="px-5 py-4 hover:bg-gray-50/70 dark:hover:bg-neutral-800/60 transition">
            <div class="flex items-start gap-3">
              <span
                class="mt-0.5 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                :class="p.badgeClass"
              >
                <Icon :icon="p.icon" class="size-3.5" /> {{ p.kategori }}
              </span>
              <div class="min-w-0">
                <p class="font-medium text-gray-900 dark:text-white line-clamp-1">{{ p.judul }}</p>
                <p class="text-sm text-gray-600 dark:text-neutral-300 line-clamp-2">{{ p.ringkas }}</p>
                <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">{{ p.tanggal }}</p>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </div>

    <!-- Middle: Pembayaran SPP + Transport -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- SPP -->
      <section class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
        <header class="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-neutral-800">
          <h3 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon icon="hugeicons:invoice-01" class="size-5" /> Pembayaran SPP
          </h3>
          <span class="text-xs px-2 py-1 rounded-full"
                :class="spp.statusPaidThisMonth ? 'bg-emerald-50 -700 dark:bg-emerald-900/30 dark:-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'">
            {{ spp.statusPaidThisMonth ? 'Lunas bulan ini' : 'Belum lunas' }}
          </span>
        </header>

        <div class="px-5 py-4 grid md:grid-cols-3 gap-4">
          <div class="p-4 rounded-xl bg-gray-50 dark:bg-neutral-800/70">
            <p class="text-xs text-gray-500 dark:text-neutral-400">Tarif / bulan</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ toIDR(spp.tarif) }}</p>
          </div>
          <div class="p-4 rounded-xl bg-gray-50 dark:bg-neutral-800/70">
            <p class="text-xs text-gray-500 dark:text-neutral-400">Jatuh tempo</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ spp.jatuhTempo }}</p>
          </div>
          <div class="p-4 rounded-xl bg-gray-50 dark:bg-neutral-800/70">
            <p class="text-xs text-gray-500 dark:text-neutral-400">Tunggakan</p>
            <p class="text-lg font-semibold"
               :class="spp.tunggakan > 0 ? 'text-rose-600 dark:text-rose-400' : '-600 dark:-400'">
              {{ spp.tunggakan }} bln
            </p>
          </div>
        </div>

        <div class="px-5 pb-5">
          <div class="text-xs text-gray-500 dark:text-neutral-400 mb-2">Status 6 bulan terakhir</div>
          <div class="flex flex-wrap gap-2">
            <div v-for="m in spp.riwayat6Bulan" :key="m.bulan"
                 class="flex items-center gap-2 px-3 py-2 rounded-xl border"
                 :class="m.lunas ? 'bg-emerald-50 border-emerald-200 -700 dark:bg-emerald-900/20 dark:border-emerald-900/40 dark:-300'
                                : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-900/40 dark:text-rose-300'">
              <span class="font-medium">{{ m.bulan }}</span>
              <Icon :icon="m.lunas ? 'lucide:check' : 'lucide:x'" class="size-4" />
            </div>
          </div>
        </div>
      </section>

      <!-- Transport -->
      <section class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
        <header class="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-neutral-800">
          <h3 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon icon="lets-icons:money-light" class="size-5 text-amber-600 dark:text-amber-400" /> Pembayaran Syahriyah
          </h3>
          <span class="text-xs px-2 py-1 rounded-full"
                :class="transport.statusPaidThisMonth ? 'bg-emerald-50 -700 dark:bg-emerald-900/30 dark:-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'">
            {{ transport.statusPaidThisMonth ? 'Lunas bulan ini' : 'Belum lunas' }}
          </span>
        </header>

        <div class="px-5 py-4 grid md:grid-cols-3 gap-4">
          <div class="p-4 rounded-xl bg-gray-50 dark:bg-neutral-800/70">
            <p class="text-xs text-gray-500 dark:text-neutral-400">Tarif / bulan</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ toIDR(transport.tarif) }}</p>
          </div>
          <div class="p-4 rounded-xl bg-gray-50 dark:bg-neutral-800/70">
            <p class="text-xs text-gray-500 dark:text-neutral-400">Jatuh tempo</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ transport.jatuhTempo }}</p>
          </div>
          <div class="p-4 rounded-xl bg-gray-50 dark:bg-neutral-800/70">
            <p class="text-xs text-gray-500 dark:text-neutral-400">Tunggakan</p>
            <p class="text-lg font-semibold"
               :class="transport.tunggakan > 0 ? 'text-rose-600 dark:text-rose-400' : ''">
              {{ transport.tunggakan }} bln
            </p>
          </div>
        </div>

        <div class="px-5 pb-5">
          <div class="text-xs text-gray-500 dark:text-neutral-400 mb-2">Status 6 bulan terakhir</div>
          <div class="flex flex-wrap gap-2">
            <div v-for="m in transport.riwayat6Bulan" :key="m.bulan"
                 class="flex items-center gap-2 px-3 py-2 rounded-xl border"
                 :class="m.lunas ? 'bg-emerald-50 border-emerald-200 -700 dark:bg-emerald-900/20 dark:border-emerald-900/40 dark:-300'
                                : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-900/40 dark:text-rose-300'">
              <span class="font-medium">{{ m.bulan }}</span>
              <Icon :icon="m.lunas ? 'lucide:check' : 'lucide:x'" class="size-4" />
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Bottom: Statistik Riwayat Pembayaran -->
    <section class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
      <header class="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-neutral-800">
        <h3 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Icon icon="solar:chart-linear" class="size-5 text-indigo-600 dark:text-indigo-400" /> Statistik Pembayaran (12 bulan)
        </h3>
        <div class="flex items-center gap-3 text-sm">
          <span class="text-gray-500 dark:text-neutral-400">Total Bayar</span>
          <span class="font-semibold text-gray-900 dark:text-white">{{ toIDR(total12Bulan) }}</span>
        </div>
      </header>

      <div class="grid lg:grid-cols-3 gap-6 p-5">
        <!-- Chart -->
        <div class="lg:col-span-2">
          <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-4">
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-neutral-400 px-1">
              <span>0</span>
              <span>Rata-rata {{ toIDR(rerataBulanan) }}</span>
              <span>{{ toIDR(maxY) }}</span>
            </div>
            <div class="mt-2">
              <!-- Simple SVG line chart -->
              <svg :viewBox="`0 0 ${chartW} ${chartH}`" class="w-full h-44">
                <!-- grid -->
                <g stroke="currentColor" class="text-gray-200 dark:text-neutral-800">
                  <line v-for="(y, i) in 4" :key="'g'+i" :x1="0" :y1="(i+1)*(chartH/5)" :x2="chartW" :y2="(i+1)*(chartH/5)" stroke-width="1" />
                </g>
                <!-- area -->
                <path
                  :d="areaPath"
                  fill="currentColor"
                  class="text-indigo-200 dark:text-indigo-900/50"
                />
                <!-- line -->
                <path
                  :d="linePath"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  class="text-indigo-500 dark:text-indigo-400"
                />
                <!-- points -->
                <g>
                  <circle v-for="(pt,i) in points" :key="'p'+i" :cx="pt.x" :cy="pt.y" r="3" class="fill-indigo-500 dark:fill-indigo-400" />
                </g>
              </svg>
              <div class="mt-2 grid grid-cols-12 gap-1 text-[11px] text-gray-500 dark:text-neutral-400">
                <span v-for="m in labels" :key="m" class="text-center truncate">{{ m }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabel transaksi -->
        <div>
          <div class="rounded-xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-200 dark:border-neutral-800 font-medium">Transaksi Terakhir</div>
            <ul class="divide-y divide-gray-200 dark:divide-neutral-800">
              <li v-for="t in transaksiTerakhir" :key="t.id" class="px-4 py-3 flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ t.jenis }}</p>
                  <p class="text-xs text-gray-500 dark:text-neutral-400">{{ t.tanggal }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ toIDR(t.nominal) }}</p>
                  <span class="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full"
                        :class="t.status==='Lunas' ? 'bg-emerald-50 -700 dark:bg-emerald-900/30 dark:-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'">
                    {{ t.status }}
                  </span>
                </div>
              </li>
            </ul>
            <div class="px-4 py-3 text-right">
              <NuxtLink to="/wali/pembayaran" class="text-sm">Lihat semua pembayaran</NuxtLink>
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

definePageMeta({ layout: 'app', layoutProps: { title: 'Beranda Wali' } })

/* ================== DUMMY DATA ================== */
const santri = {
  avatar: '/assets/pp.jpg',
  name: 'Muhammad Rizky Alfarizi',
  nis: 'NIS: 2023.045',
  gen: 'Laki-laki',
  maskan: 'Baitus Salam',
  kamar: 'A3',
  rfid: 'RF12345678',
  jenjang: 'KMI • MTs Kelas 2',
  wali: 'Ahmad Fauzi',
  waliPhone: '0812-3456-7890'
}

const pengumuman = [
  {
    id: 'p1',
    kategori: 'Akademik',
    icon: 'lucide:book-open',
    judul: 'Ujian Tengah Semester dimulai 16–20 Sep 2025',
    ringkas: 'Pastikan santri mempersiapkan materi dan hadir tepat waktu.',
    tanggal: '1 Sep 2025, 13:30',
    badgeClass: 'bg-blue-50 dark:bg-blue-900/30'
  },
  {
    id: 'p2',
    kategori: 'Kesantrian',
    icon: 'lucide:users',
    judul: 'Kegiatan Muharram: Doa bersama & santunan',
    ringkas: 'Kegiatan bersama di masjid utama pada Jumat malam.',
    tanggal: '29 Agu 2025, 19:00',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-900/30'
  }
]

const spp = {
  tarif: 100_000,
  jatuhTempo: 'Setiap tanggal 10',
  statusPaidThisMonth: true,
  tunggakan: 0,
  riwayat6Bulan: [
    { bulan: 'Apr', lunas: true },
    { bulan: 'Mei', lunas: true },
    { bulan: 'Jun', lunas: true },
    { bulan: 'Jul', lunas: true },
    { bulan: 'Agu', lunas: true },
    { bulan: 'Sep', lunas: true },
  ]
}

const transport = {
  tarif: 390_000,
  jatuhTempo: 'Setiap tanggal 10',
  statusPaidThisMonth: false,
  tunggakan: 1,
  riwayat6Bulan: [
    { bulan: 'Apr', lunas: true },
    { bulan: 'Mei', lunas: false },
    { bulan: 'Jun', lunas: true },
    { bulan: 'Jul', lunas: true },
    { bulan: 'Agu', lunas: false },
    { bulan: 'Sep', lunas: false },
  ]
}

// 12 bulan data gabungan (SPP + Transport) — nominal per bulan
const series12 = [
  500_000, 350_000, 350_000, 350_000, 500_000, 350_000,
  500_000, 0,       350_000, 350_000, 500_000, 350_000
]
// label bulan (kiri ke kanan)
const labels = ['Okt', 'Nov', 'Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep']

/* ================== HELPERS ================== */
const toIDR = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

/* ================== CHART (SVG sederhana) ================== */
const chartW = 600
const chartH = 160
const padX = 24
const padY = 14

const maxY = computed(() => Math.max(...series12, 1))
const minY = 0
const stepX = computed(() => (chartW - padX * 2) / (series12.length - 1))
const scaleY = (v: number) => {
  const h = chartH - padY * 2
  const ratio = (v - minY) / (maxY.value - minY || 1)
  return chartH - padY - ratio * h
}

const points = computed(() =>
  series12.map((v, i) => ({
    x: padX + i * stepX.value,
    y: scaleY(v)
  }))
)
const linePath = computed(() =>
  points.value.reduce((d, p, i) => d + (i ? ` L ${p.x} ${p.y}` : `M ${p.x} ${p.y}`), '')
)
const areaPath = computed(() => {
  if (!points.value.length) return ''
  const first = points.value[0]
  const last = points.value[points.value.length - 1]
  return `M ${first.x} ${chartH - padY} L ${first.x} ${first.y}` +
         points.value.slice(1).map(p => ` L ${p.x} ${p.y}`).join('') +
         ` L ${last.x} ${chartH - padY} Z`
})

/* ================== AGGREGATES ================== */
const total12Bulan = computed(() => series12.reduce((a, b) => a + b, 0))
const rerataBulanan = computed(() => Math.round(total12Bulan.value / series12.length))

/* ================== TRANSAKSI TERAKHIR (dummy) ================== */
const transaksiTerakhir = [
  { id: 't4', jenis: 'SPP Syahriyah - Sep 2025',          tanggal: '02 Sep 2025', nominal: 490_000, status: 'Lunas' },
  { id: 't2', jenis: 'SPP Syahriyah - Agu 2025',          tanggal: '02 Agu 2025', nominal: 490_000, status: 'Lunas' },
  { id: 't1', jenis: 'SPP Syahriyah - Jul 2025',          tanggal: '03 Jul 2025', nominal: 490_000, status: 'Lunas' },
]
</script>

<style scoped>
/* optional: smooth line edges */
svg path { shape-rendering: geometricPrecision; }
</style>
