<template>
  <section class="space-y-6 p-4 md:p-6">
    <!-- Hero / Greeting -->
    <div class="relative overflow-hidden rounded-[32px] border border-green-100 bg-gradient-to-br from-green-600 via-green-600 to-lime-500 p-5 text-white shadow-[0_24px_70px_-28px_rgba(22,163,74,0.55)] dark:border-neutral-800 md:p-7">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-white blur-3xl"></div>
        <div class="absolute -bottom-14 left-8 h-40 w-40 rounded-full bg-lime-200 blur-3xl"></div>
      </div>

      <div class="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div class="min-w-0">
          <div class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold ring-1 ring-white/20 backdrop-blur">
            <span class="h-2 w-2 rounded-full bg-lime-300"></span>
            Portal Wali Santri
          </div>

          <h1 class="mt-4 text-2xl font-black tracking-tight md:text-4xl">
            Assalamu’alaikum, {{ waliName }}
          </h1>

          <p class="mt-2 max-w-xl text-sm leading-6 text-green-50/90 md:text-base">
            Pantau informasi santri, pembayaran, akademik, izin, dan pengumuman dari satu halaman yang ringkas.
          </p>
        </div>

        <div class="grid grid-cols-3 gap-2 md:min-w-[340px]">
          <div class="rounded-3xl bg-white/13 p-3 text-center ring-1 ring-white/15 backdrop-blur">
            <div class="text-xl font-black">{{ totalSantri }}</div>
            <div class="mt-1 text-[11px] font-semibold text-green-50/80">Santri</div>
          </div>

          <div class="rounded-3xl bg-white/13 p-3 text-center ring-1 ring-white/15 backdrop-blur">
            <div class="text-xl font-black">{{ unreadInfo }}</div>
            <div class="mt-1 text-[11px] font-semibold text-green-50/80">Info</div>
          </div>

          <div class="rounded-3xl bg-white/13 p-3 text-center ring-1 ring-white/15 backdrop-blur">
            <div class="text-xl font-black">{{ todayLabel }}</div>
            <div class="mt-1 text-[11px] font-semibold text-green-50/80">Hari Ini</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Cards -->
    <div class="grid gap-3 md:grid-cols-3">
      <NuxtLink
        to="/wali/pembayaran"
        class="group overflow-hidden rounded-[28px] border border-white/80 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div class="flex items-center gap-3">
          <div class="grid h-12 w-12 place-items-center rounded-2xl bg-green-100 text-green-700 transition group-hover:bg-green-600 group-hover:text-white dark:bg-green-900/20 dark:text-green-300">
            <Icon icon="akar-icons:money" class="h-6 w-6" />
          </div>

          <div class="min-w-0">
            <div class="font-black text-slate-900 dark:text-white">Pembayaran</div>
            <div class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">Cek tagihan & riwayat</div>
          </div>

          <Icon icon="lucide:chevron-right" class="ml-auto h-5 w-5 text-slate-300 transition group-hover:text-green-600" />
        </div>
      </NuxtLink>

      <NuxtLink
        to="/wali/akademik"
        class="group overflow-hidden rounded-[28px] border border-white/80 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div class="flex items-center gap-3">
          <div class="grid h-12 w-12 place-items-center rounded-2xl bg-green-100 text-green-700 transition group-hover:bg-green-600 group-hover:text-white dark:bg-green-900/20 dark:text-green-300">
            <Icon icon="solar:chart-linear" class="h-6 w-6" />
          </div>

          <div class="min-w-0">
            <div class="font-black text-slate-900 dark:text-white">Akademik</div>
            <div class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">Nilai, hafalan, absensi</div>
          </div>

          <Icon icon="lucide:chevron-right" class="ml-auto h-5 w-5 text-slate-300 transition group-hover:text-green-600" />
        </div>
      </NuxtLink>

      <NuxtLink
        to="/wali/perizinan"
        class="group overflow-hidden rounded-[28px] border border-white/80 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div class="flex items-center gap-3">
          <div class="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-700 transition group-hover:bg-amber-500 group-hover:text-white dark:bg-amber-900/20 dark:text-amber-300">
            <Icon icon="solar:letter-linear" class="h-6 w-6" />
          </div>

          <div class="min-w-0">
            <div class="font-black text-slate-900 dark:text-white">Perizinan</div>
            <div class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">Ajukan & pantau izin</div>
          </div>

          <Icon icon="lucide:chevron-right" class="ml-auto h-5 w-5 text-slate-300 transition group-hover:text-amber-600" />
        </div>
      </NuxtLink>
    </div>

    <!-- Gojek Style Menu -->
    <div class="rounded-[32px] border border-white/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-5">
      <div class="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 class="text-base font-black text-slate-900 dark:text-white">
            Layanan Wali
          </h2>
          <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
            Pilih menu sesuai kebutuhan
          </p>
        </div>

        <button
          type="button"
          @click="showAllMenu = !showAllMenu"
          class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          {{ showAllMenu ? 'Ringkas' : 'Lihat Semua' }}
        </button>
      </div>

      <div class="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
        <NuxtLink
          v-for="menu in displayedMenus"
          :key="menu.href"
          :to="menu.href"
          class="group flex min-w-0 flex-col items-center rounded-[24px] p-2.5 text-center transition hover:-translate-y-1 hover:bg-slate-50 dark:hover:bg-neutral-800"
        >
          <span
            :class="[
              'grid h-13 w-13 place-items-center rounded-[22px] shadow-sm transition group-hover:scale-105 group-hover:shadow-lg',
              menu.color
            ]"
          >
            <Icon :icon="menu.icon" class="h-6 w-6" />
          </span>

          <span class="mt-2 line-clamp-2 min-h-[28px] text-[11px] font-black leading-tight text-slate-700 dark:text-neutral-200">
            {{ menu.label }}
          </span>
        </NuxtLink>
      </div>
    </div>

    <!-- Santri Preview + Announcement -->
    <div class="grid gap-4 lg:grid-cols-[1fr,0.85fr]">
      <div class="rounded-[32px] border border-white/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-5">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-black text-slate-900 dark:text-white">
              Ringkasan Santri
            </h2>
            <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
              Informasi singkat santri terhubung
            </p>
          </div>

          <NuxtLink
            to="/wali/santri"
            class="rounded-2xl bg-green-50 px-3 py-2 text-xs font-black text-green-700 transition hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300"
          >
            Detail
          </NuxtLink>
        </div>

        <div class="space-y-3">
          <div
            v-for="item in santriCards"
            :key="item.label"
            class="flex items-center gap-3 rounded-[24px] border border-slate-100 bg-slate-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/60"
          >
            <div :class="['grid h-11 w-11 place-items-center rounded-2xl', item.iconClass]">
              <Icon :icon="item.icon" class="h-5 w-5" />
            </div>

            <div class="min-w-0 flex-1">
              <div class="text-xs font-bold text-slate-500 dark:text-neutral-400">
                {{ item.label }}
              </div>
              <div class="mt-0.5 truncate text-sm font-black text-slate-900 dark:text-white">
                {{ item.value }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-[32px] border border-white/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-5">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-black text-slate-900 dark:text-white">
              Pengumuman Cepat
            </h2>
            <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
              Informasi penting untuk wali
            </p>
          </div>

          <NuxtLink
            to="/wali/pengumuman"
            class="rounded-2xl bg-green-50 px-3 py-2 text-xs font-black text-green-700 transition hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300"
          >
            Lihat
          </NuxtLink>
        </div>

        <div class="space-y-3">
          <div
            v-for="announcement in quickAnnouncements"
            :key="announcement.title"
            class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
          >
            <div class="flex items-start gap-3">
              <div :class="['grid h-10 w-10 shrink-0 place-items-center rounded-2xl', announcement.color]">
                <Icon :icon="announcement.icon" class="h-5 w-5" />
              </div>

              <div class="min-w-0">
                <div class="font-black text-slate-900 dark:text-white">
                  {{ announcement.title }}
                </div>
                <p class="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  {{ announcement.desc }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- News Section -->
    <div class="rounded-[32px] border border-white/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-5">
      <div class="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 class="text-base font-black text-slate-900 dark:text-white">
            Berita & Informasi
          </h2>
          <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
            Update terbaru dari pondok/sekolah
          </p>
        </div>

        <NuxtLink
          to="/news"
          class="rounded-2xl bg-green-50 px-3 py-2 text-xs font-black text-green-700 transition hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300"
        >
          Semua Berita
        </NuxtLink>
      </div>

      <div v-if="pending" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div
          v-for="i in 3"
          :key="i"
          class="h-72 animate-pulse rounded-[28px] bg-slate-100 dark:bg-neutral-800"
        ></div>
      </div>

      <div
        v-else-if="latestNews.length === 0"
        class="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-800/60"
      >
        <div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-green-50 text-2xl text-green-700 dark:bg-green-900/20 dark:text-green-300">
          📰
        </div>
        <h3 class="mt-4 font-black text-slate-900 dark:text-white">
          Belum ada berita
        </h3>
        <p class="mt-1 text-sm text-slate-500 dark:text-neutral-400">
          Informasi terbaru akan tampil di bagian ini.
        </p>
      </div>

      <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="news in latestNews"
          :key="news.id"
          class="group overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div class="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-neutral-800">
            <img
              v-if="news.cover"
              :src="news.cover"
              :alt="news.title"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            />

            <div v-else class="grid h-full place-items-center text-4xl">
              🕌
            </div>

            <div class="absolute left-3 top-3">
              <span class="rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
                {{ news.category || 'Informasi' }}
              </span>
            </div>
          </div>

          <div class="p-4">
            <div class="flex items-center justify-between gap-3 text-[11px] font-semibold text-slate-400 dark:text-neutral-500">
              <span>{{ formatDate(news.publishedAt) }}</span>
              <span>{{ news.readTime || 1 }} min baca</span>
            </div>

            <h3 class="mt-2 line-clamp-2 text-base font-black text-slate-900 dark:text-white">
              {{ news.title }}
            </h3>

            <p class="mt-2 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-neutral-400">
              {{ news.excerpt || 'Baca informasi selengkapnya.' }}
            </p>

            <NuxtLink
              :to="`/news?slug=${encodeURIComponent(news.slug || news.id)}`"
              class="mt-4 inline-flex items-center gap-2 rounded-2xl bg-green-50 px-3 py-2 text-xs font-black text-green-700 transition hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300"
            >
              Baca Berita
              <Icon icon="lucide:arrow-right" class="h-3.5 w-3.5" />
            </NuxtLink>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useState } from 'nuxt/app'
import { useNews } from '~/composables/data/useNews'

definePageMeta({
  layout: 'wali'
})

type MenuItem = {
  label: string
  href: string
  icon: string
  color: string
}

type AnnouncementItem = {
  title: string
  desc: string
  icon: string
  color: string
}

const sessionUser = useState<any>('sessionUser', () => ({}))

const {
  pending,
  items,
  loadNews
} = useNews()

onMounted(() => {
  loadNews()
})

const waliName = computed(() => {
  return sessionUser.value?.name || sessionUser.value?.waliName || 'Wali Santri'
})

const santriName = computed(() => {
  return sessionUser.value?.santriName || 'Santri'
})

const totalSantri = computed(() => {
  const ids = sessionUser.value?.santriIds

  if (Array.isArray(ids) && ids.length) {
    return ids.length
  }

  return sessionUser.value?.santriId ? 1 : 1
})

const unreadInfo = computed(() => {
  return Math.min(items.value?.length || 0, 9)
})

const todayLabel = computed(() => {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'short'
  }).format(new Date())
})

const menus: MenuItem[] = [
  {
    label: 'Data Santri',
    href: '/wali/santri',
    icon: 'lucide:user-round',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  },
  {
    label: 'Pembayaran',
    href: '/wali/pembayaran',
    icon: 'akar-icons:money',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  },
  {
    label: 'Akademik',
    href: '/wali/akademik',
    icon: 'solar:chart-linear',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
  },
  {
    label: 'Absensi',
    href: '/wali/absensi',
    icon: 'hugeicons:note-03',
    color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300'
  },
  {
    label: 'Hafalan',
    href: '/wali/hafalan',
    icon: 'ooui:italic-arab-keheh-jeem',
    color: 'bg-lime-100 text-lime-700 dark:bg-lime-900/20 dark:text-lime-300'
  },
  {
    label: 'Perizinan',
    href: '/wali/perizinan',
    icon: 'solar:letter-linear',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  },
  {
    label: 'Kunjungan',
    href: '/wali/kunjungan',
    icon: 'material-symbols:parent-child-dining-outline-rounded',
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300'
  },
  {
    label: 'Pengumuman',
    href: '/wali/pengumuman',
    icon: 'lucide:megaphone',
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
  },
  {
    label: 'Jadwal',
    href: '/wali/jadwal',
    icon: 'solar:calendar-line-duotone',
    color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300'
  },
  {
    label: 'Pelanggaran',
    href: '/wali/pelanggaran',
    icon: 'mingcute:fault-line',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
  },
  {
    label: 'Buku / Kitab',
    href: '/wali/book',
    icon: 'ion:book-outline',
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300'
  },
  {
    label: 'Kontak',
    href: '/wali/contact',
    icon: 'hugeicons:contact-01',
    color: 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
  }
]

const showAllMenu = useState<boolean>('waliShowAllMenu', () => false)

const displayedMenus = computed(() => {
  return showAllMenu.value ? menus : menus.slice(0, 8)
})

const santriCards = computed(() => [
  {
    label: 'Nama Santri',
    value: santriName.value,
    icon: 'lucide:user-round',
    iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  },
  {
    label: 'Status Informasi',
    value: 'Aktif dipantau',
    icon: 'ph:shield-check-duotone',
    iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  },
  {
    label: 'Portal Wali',
    value: 'Akses tersedia',
    icon: 'ph:check-circle-duotone',
    iconClass: 'bg-lime-100 text-lime-700 dark:bg-lime-900/20 dark:text-lime-300'
  }
])

const quickAnnouncements: AnnouncementItem[] = [
  {
    title: 'Pantau Pembayaran',
    desc: 'Cek tagihan dan riwayat pembayaran santri secara berkala melalui menu pembayaran.',
    icon: 'akar-icons:money',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  },
  {
    title: 'Informasi Akademik',
    desc: 'Nilai, hafalan, dan absensi santri dapat diakses melalui menu akademik.',
    icon: 'solar:chart-linear',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  },
  {
    title: 'Pengumuman Pondok',
    desc: 'Pengumuman penting akan tampil pada menu pengumuman dan bagian berita terbaru.',
    icon: 'lucide:megaphone',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  }
]

const latestNews = computed(() => {
  return [...(items.value || [])]
    .sort((a, b) => Number(b.publishedAt || 0) - Number(a.publishedAt || 0))
    .slice(0, 3)
})

function formatDate(value?: number) {
  if (!value) return 'Tanggal belum tersedia'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium'
  }).format(new Date(value))
}
</script>