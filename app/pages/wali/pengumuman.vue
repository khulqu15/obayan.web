<!-- File: pages/wali/pengumuman.vue -->
<template>
  <div class="space-y-6 p-4 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Pengumuman</h1>
        <p class="text-sm text-gray-600 dark:text-neutral-400">Informasi terbaru untuk wali santri.</p>
      </div>
      <div class="flex gap-2">
        <NuxtLink to="#" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
          <Icon icon="lucide:rss" class="size-4" /> Langganan RSS
        </NuxtLink>
        <NuxtLink to="#" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700">
          <Icon icon="lucide:bell" class="size-4" /> Aktifkan Notifikasi
        </NuxtLink>
      </div>
    </div>

    <!-- Filters -->
    <div class="grid gap-3 md:grid-cols-3">
      <div class="md:col-span-2">
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="c in categories"
            :key="c"
            @click="activeCategory = (activeCategory === c ? 'Semua' : c)"
            class="px-3 py-1.5 rounded-full text-sm border"
            :class="activeCategory === c
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800'"
          >
            {{ c }}
          </button>
          <button
            v-if="activeCategory !== 'Semua'"
            @click="activeCategory = 'Semua'"
            class="px-3 py-1.5 rounded-full text-sm border bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800"
          >
            Reset
          </button>
        </div>
      </div>
      <div class="md:col-span-1">
        <div class="flex gap-2">
          <div class="relative flex-1">
            <input
              v-model.trim="q"
              type="search"
              placeholder="Cari judul / isi..."
              class="w-full pl-9 pr-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
            />
            <Icon icon="lucide:search" class="size-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <div class="relative">
            <select v-model="sortBy" class="pl-3 pr-8 py-2 rounded-lg text-sm border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="title">Judul A-Z</option>
            </select>
            <Icon icon="lucide:chevron-down" class="size-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>

    <!-- Pinned / Highlight -->
    <div v-if="pinned.length" class="grid md:grid-cols-2 gap-4">
      <article
        v-for="n in pinned"
        :key="n.id"
        class="rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900"
      >
        <div class="p-4 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
              <Icon icon="lucide:pin" class="size-3.5" /> Disematkan
            </span>
            <span class="text-xs text-gray-500 dark:text-neutral-400">{{ n.date }}</span>
          </div>
          <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium"
                :class="badgeClass(n.category)">
            {{ n.category }}
          </span>
        </div>
        <div class="p-4">
          <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            {{ n.title }}
          </h2>
          <p class="mt-1 text-sm text-gray-700 dark:text-neutral-300 line-clamp-3">{{ n.body }}</p>
          <div class="mt-3 flex flex-wrap items-center gap-2">
            <NuxtLink to="#" class="text-sm 600 hover:underline">Baca selengkapnya</NuxtLink>
            <span class="text-gray-300">•</span>
            <NuxtLink to="#" class="text-sm 600 hover:underline">Lampiran ({{ n.attachments.length }})</NuxtLink>
          </div>
        </div>
      </article>
    </div>

    <!-- List -->
    <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900">
      <div class="p-4 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
        <h2 class="font-semibold text-gray-900 dark:text-white">Daftar Pengumuman</h2>
        <p class="text-sm text-gray-500 dark:text-neutral-400">{{ filtered.length }} item</p>
      </div>
      <ul class="divide-y divide-gray-200 dark:divide-neutral-800">
        <li v-for="n in paged" :key="n.id" class="p-4 hover:bg-gray-50/60 dark:hover:bg-neutral-800/50">
          <div class="flex items-start gap-3">
            <span class="mt-0.5 inline-flex items-center justify-center size-8 rounded-lg bg-blue-50 600 dark:bg-blue-900/20 dark:300">
              <Icon :icon="n.icon" class="size-4" />
            </span>
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="font-medium text-gray-900 dark:text-white">{{ n.title }}</h3>
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium" :class="badgeClass(n.category)">
                  {{ n.category }}
                </span>
                <span v-if="n.pinned" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                  <Icon icon="lucide:pin" class="size-3.5" /> pin
                </span>
              </div>
              <p class="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                {{ n.date }} • oleh {{ n.author }}
              </p>
              <p class="mt-2 text-sm text-gray-700 dark:text-neutral-300 line-clamp-2">
                {{ n.body }}
              </p>
              <div class="mt-3 flex flex-wrap items-center gap-3">
                <NuxtLink to="#" class="text-sm 600 hover:underline">Baca</NuxtLink>
                <NuxtLink v-if="n.attachments.length" to="#" class="text-sm 600 hover:underline">Lampiran ({{ n.attachments.length }})</NuxtLink>
                <NuxtLink to="#" class="text-sm 600 hover:underline">Bagikan</NuxtLink>
              </div>
            </div>
          </div>
        </li>
        <li v-if="!paged.length" class="p-10 text-center text-sm text-gray-500 dark:text-neutral-400">
          Tidak ada pengumuman yang cocok dengan filter.
        </li>
      </ul>
      <!-- Pagination -->
      <div class="p-4 border-t border-gray-200 dark:border-neutral-800 flex items-center justify-between">
        <p class="text-xs text-gray-500 dark:text-neutral-400">
          Menampilkan {{ startIndex + 1 }}–{{ Math.min(endIndex, filtered.length) }} dari {{ filtered.length }}
        </p>
        <div class="flex items-center gap-2">
          <button
            class="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-neutral-700 disabled:opacity-50"
            :disabled="page === 1"
            @click="page--"
          >
            Sebelumnya
          </button>
          <button
            class="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-neutral-700 disabled:opacity-50"
            :disabled="endIndex >= filtered.length"
            @click="page++"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'app', layoutProps: { title: 'Pengumuman' } })

type Notice = {
  id: string
  title: string
  body: string
  date: string
  author: string
  category: 'Akademik' | 'Keuangan' | 'Kesantrian' | 'Umum'
  attachments: string[]
  pinned?: boolean
  icon: string
}

const categories = ['Semua', 'Akademik', 'Keuangan', 'Kesantrian', 'Umum'] as const
const activeCategory = ref<typeof categories[number]>('Semua')
const q = ref('')
const sortBy = ref<'newest' | 'oldest' | 'title'>('newest')
const page = ref(1)
const pageSize = 6

const data = ref<Notice[]>([
  {
    id: 'N-2025-0901',
    title: 'Jadwal UTS Ganjil 2025/2026',
    body: 'Pelaksanaan UTS untuk seluruh jenjang dimulai 16–21 September 2025. Mohon memastikan kehadiran dan perlengkapan belajar.',
    date: '01 Sep 2025',
    author: 'Bag. Akademik',
    category: 'Akademik',
    attachments: ['jadwal-uts.pdf'],
    pinned: true,
    icon: 'lucide:calendar-days'
  },
  {
    id: 'N-2025-0902',
    title: 'Tagihan SPP September',
    body: 'SPP bulan September telah diterbitkan. Batas pembayaran 10 September 2025. Tersedia metode VA BSI/BRI/BCA.',
    date: '02 Sep 2025',
    author: 'Bag. Keuangan',
    category: 'Keuangan',
    attachments: [],
    icon: 'lucide:receipt'
  },
  {
    id: 'N-2025-0903',
    title: 'Perubahan Jadwal Kunjungan Wali',
    body: 'Jadwal kunjungan wali pada pekan ketiga dimajukan menjadi pekan kedua karena agenda pesantren.',
    date: '03 Sep 2025',
    author: 'Kesantrian',
    category: 'Kesantrian',
    attachments: ['surat-edaran.pdf'],
    icon: 'lucide:megaphone'
  },
  {
    id: 'N-2025-0829',
    title: 'Pengumuman Umum: Kebersihan Asrama',
    body: 'Demi kenyamanan bersama, mohon memperhatikan kebersihan asrama. Jadwal piket telah disosialisasikan.',
    date: '29 Agu 2025',
    author: 'Pengurus',
    category: 'Umum',
    attachments: [],
    icon: 'lucide:brush'
  },
  {
    id: 'N-2025-0825',
    title: 'Laporan Kegiatan Muharram',
    body: 'Terima kasih atas dukungan seluruh wali dalam kegiatan Muharram. Berikut dokumentasi dan ringkasan kegiatan.',
    date: '25 Agu 2025',
    author: 'Pengurus',
    category: 'Umum',
    attachments: ['ringkasan.pdf', 'foto.zip'],
    icon: 'lucide:images'
  },
  {
    id: 'N-2025-0821',
    title: 'Informasi Transportasi Bulanan',
    body: 'Pembayaran transportasi bulan September mengikuti skema sebelumnya. Cek jalur dan jam keberangkatan terbaru.',
    date: '21 Agu 2025',
    author: 'Transport',
    category: 'Kesantrian',
    attachments: [],
    icon: 'lucide:bus'
  },
  {
    id: 'N-2025-0818',
    title: 'Panduan Platform Wali',
    body: 'Wali dapat memantau absensi, nilai, dan pembayaran melalui portal. Silakan membaca panduan singkat berikut.',
    date: '18 Agu 2025',
    author: 'Admin',
    category: 'Umum',
    attachments: ['panduan-wali.pdf'],
    icon: 'lucide:book-open-text'
  }
])

const pinned = computed(() => data.value.filter(n => n.pinned))
const nonPinned = computed(() => data.value.filter(n => !n.pinned))

const filtered = computed(() => {
  let arr = nonPinned.value
  if (activeCategory.value !== 'Semua') {
    arr = arr.filter(n => n.category === activeCategory.value)
  }
  if (q.value) {
    const s = q.value.toLowerCase()
    arr = arr.filter(n =>
      n.title.toLowerCase().includes(s) ||
      n.body.toLowerCase().includes(s) ||
      n.author.toLowerCase().includes(s)
    )
  }
  if (sortBy.value === 'title') {
    arr = [...arr].sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortBy.value === 'oldest') {
    arr = [...arr].sort((a, b) => toDate(a.date) - toDate(b.date))
  } else {
    arr = [...arr].sort((a, b) => toDate(b.date) - toDate(a.date))
  }
  return arr
})

const startIndex = computed(() => (page.value - 1) * pageSize)
const endIndex = computed(() => startIndex.value + pageSize)
const paged = computed(() => filtered.value.slice(startIndex.value, endIndex.value))

function toDate(d: string) {
  // d format: "01 Sep 2025"
  try {
    const [day, mon, year] = d.split(' ')
    const map: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, Mei: 4, Jun: 5,
      Jul: 6, Agt: 7, Agu: 7, Sep: 8, Okt: 9, Nov: 10, Des: 11
    }
    const m = map[mon] ?? new Date(d).getMonth()
    return new Date(Number(year), m, Number(day)).getTime()
  } catch { return new Date().getTime() }
}

function badgeClass(cat: Notice['category']) {
  switch (cat) {
    case 'Akademik': return 'bg-emerald-50 700 dark:bg-emerald-900/20 dark:300'
    case 'Keuangan': return 'bg-blue-50 700 dark:bg-blue-900/20 dark:300'
    case 'Kesantrian': return 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300'
    default: return 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300'
  }
}
</script>
