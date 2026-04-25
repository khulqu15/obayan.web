<template>
  <div class="flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
    <!-- Header -->
    <div
      ref="headerEl"
      class="sticky top-0 z-20 border-b border-slate-100 bg-white/90 p-4 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/90"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="flex shrink-0 items-center gap-2">
          <button
            type="button"
            @click="markAllRead"
            class="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Tandai
          </button>

          <button
            type="button"
            @click="clearAll"
            class="inline-flex h-10 items-center justify-center rounded-2xl bg-slate-950 px-3 text-xs font-black text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950"
          >
            Bersihkan
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="mt-4 grid grid-cols-3 gap-2">
        <div class="rounded-2xl bg-slate-50 p-3 dark:bg-neutral-800/70">
          <div class="text-lg font-black text-slate-900 dark:text-white">{{ filtered.length }}</div>
          <div class="mt-0.5 text-[11px] font-bold text-slate-400 dark:text-neutral-500">Total</div>
        </div>

        <div class="rounded-2xl bg-green-50 p-3 dark:bg-green-900/10">
          <div class="text-lg font-black text-green-700 dark:text-green-300">{{ unreadCount }}</div>
          <div class="mt-0.5 text-[11px] font-bold text-green-500/70 dark:text-green-300/70">Unread</div>
        </div>

        <div class="rounded-2xl bg-green-50 p-3 dark:bg-green-900/10">
          <div class="text-lg font-black text-green-700 dark:text-green-300">{{ todayCount }}</div>
          <div class="mt-0.5 text-[11px] font-bold text-green-500/70 dark:text-green-300/70">Hari Ini</div>
        </div>
      </div>

      <!-- Filters -->
      <div class="mt-4 space-y-3">
        <div class="flex gap-2 overflow-x-auto pb-1">
          <button
            v-for="c in categories"
            :key="c.key"
            type="button"
            @click="activeCategory = c.key"
            :class="[
              'inline-flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2 text-xs font-black transition',
              activeCategory === c.key
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'
            ]"
          >
            <Icon :icon="c.icon" class="h-4 w-4" />
            {{ c.label }}
            <span
              :class="[
                'rounded-full px-2 py-0.5 text-[10px]',
                activeCategory === c.key
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-500 dark:bg-neutral-800 dark:text-neutral-400'
              ]"
            >
              {{ countByCategory(c.key) }}
            </span>
          </button>
        </div>

        <div class="grid gap-2 sm:grid-cols-[140px,1fr]">
          <select
            v-model="active"
            class="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-xs font-black text-slate-700 outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
            title="Filter status"
          >
            <option value="all">Semua</option>
            <option value="unread">Belum dibaca</option>
          </select>

          <div class="relative">
            <input
              v-model="query"
              type="search"
              placeholder="Cari judul atau pesan..."
              class="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-xs font-medium text-slate-700 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:focus:ring-green-500/10"
            />

            <Icon
              icon="lucide:search"
              class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />

            <button
              v-if="query"
              type="button"
              @click="query = ''"
              class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
              title="Bersihkan"
            >
              <Icon icon="lucide:x" class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- List -->
    <div
      ref="listWrap"
      class="min-h-0 flex-1 overflow-y-auto p-3"
      :style="listStyle"
    >
      <ul class="space-y-2">
        <li
          v-if="isInitialLoading"
          class="space-y-2"
        >
          <div
            v-for="i in 5"
            :key="'s-' + i"
            class="animate-pulse rounded-[24px] border border-slate-100 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="flex gap-3">
              <div class="h-11 w-11 rounded-2xl bg-slate-100 dark:bg-neutral-800"></div>
              <div class="flex-1 space-y-2">
                <div class="h-3 w-1/3 rounded bg-slate-100 dark:bg-neutral-800"></div>
                <div class="h-3 w-2/3 rounded bg-slate-100 dark:bg-neutral-800"></div>
              </div>
            </div>
          </div>
        </li>

        <li
          v-for="n in visible"
          :key="n.id"
        >
          <button
            type="button"
            class="group w-full rounded-[24px] border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md"
            :class="[
              !n.read
                ? 'border-green-100 bg-green-50/70 dark:border-green-900/30 dark:bg-green-900/10'
                : 'border-slate-100 bg-white hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800/70'
            ]"
            @click="open(n)"
          >
            <div class="flex items-start gap-3">
              <div :class="['grid h-11 w-11 shrink-0 place-items-center rounded-2xl', iconBoxClass(n.type)]">
                <Icon :icon="n.icon" class="h-5 w-5" />
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-start gap-2">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                      <p class="truncate text-sm font-black text-slate-900 dark:text-white">
                        {{ n.title }}
                      </p>

                      <span
                        v-if="!n.read"
                        class="h-2 w-2 shrink-0 rounded-full bg-green-500"
                      ></span>
                    </div>

                    <p
                      v-if="n.message"
                      class="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-neutral-400"
                    >
                      {{ n.message }}
                    </p>
                  </div>

                  <span class="shrink-0 text-[11px] font-bold text-slate-400 dark:text-neutral-500">
                    {{ relativeTime(n.timestamp) }}
                  </span>
                </div>

                <div class="mt-3 flex flex-wrap items-center gap-2">
                  <span :class="['rounded-full px-2.5 py-1 text-[10px] font-black', badgeClass(n.type)]">
                    {{ menuMap[n.type].label }}
                  </span>

                  <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:bg-neutral-800 dark:text-neutral-400">
                    {{ formatDateShort(n.timestamp) }}
                  </span>
                </div>
              </div>
            </div>
          </button>
        </li>

        <li
          v-if="!isInitialLoading && !filtered.length"
          class="py-10 text-center"
        >
          <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
            <Icon icon="ph:bell-slash-duotone" class="h-9 w-9" />
          </div>

          <h4 class="mt-4 text-base font-black text-slate-900 dark:text-white">
            Tidak ada notifikasi
          </h4>

          <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
            Notifikasi yang lebih dari 7 hari otomatis disembunyikan.
          </p>
        </li>
      </ul>

      <div ref="sentinel" class="h-8"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue'
import { Icon } from '@iconify/vue'

import { useAbsensi } from '~/composables/data/useAbsensi'
import { useAnnouncements } from '~/composables/data/useAnnouncements'
import { useFaults } from '~/composables/data/useFaults'
import { useIzin } from '~/composables/data/useIzin'
import { useKunjungan } from '~/composables/data/useKunjungan'
import { useMaskan } from '~/composables/data/useMaskan'
import { useNews } from '~/composables/data/useNews'
import { usePiket } from '~/composables/data/usePiket'
import { useRFID } from '~/composables/data/useRfid'
import { useSantri } from '~/composables/data/useSantri'
import { useWali } from '~/composables/data/useWali'

const menuMap = {
  absensi: {
    href: '/app/absen',
    icon: 'hugeicons:note-03',
    color: 'text-green-600',
    label: 'Absensi'
  },
  announcement: {
    href: '/app/announcement',
    icon: 'lucide:info',
    color: 'text-green-600',
    label: 'Pengumuman'
  },
  faults: {
    href: '/app/faults',
    icon: 'mingcute:fault-line',
    color: 'text-rose-600',
    label: 'Pelanggaran'
  },
  izin: {
    href: '/app/izin',
    icon: 'solar:letter-linear',
    color: 'text-amber-600',
    label: 'Perizinan'
  },
  kunjungan: {
    href: '/app/kunjungan',
    icon: 'material-symbols:parent-child-dining-outline-rounded',
    color: 'text-purple-600',
    label: 'Kunjungan'
  },
  santri: {
    href: '/app/santri',
    icon: 'lucide:users',
    color: 'text-green-500',
    label: 'Data Santri'
  },
  wali: {
    href: '/app/wali',
    icon: 'lucide:user-round',
    color: 'text-cyan-500',
    label: 'Wali'
  },
  maskan: {
    href: '/app/maskan',
    icon: 'lucide:bed',
    color: 'text-indigo-500',
    label: 'Asrama/Kamar'
  },
  piket: {
    href: '/app/picket',
    icon: 'lucide:calendar-days',
    color: 'text-fuchsia-500',
    label: 'Jadwal Piket'
  },
  rfid: {
    href: '/app/setting-rfid',
    icon: 'ri:rfid-fill',
    color: 'text-green-600',
    label: 'Registrasi RFID'
  },
  news: {
    href: '/app/news',
    icon: 'hugeicons:news',
    color: 'text-sky-600',
    label: 'Informasi'
  }
} as const

type NotifType = keyof typeof menuMap

type NotifItem = {
  id: string
  type: NotifType
  title: string
  message?: string
  href: string
  icon: string
  color: string
  timestamp: number
  time: string
  read: boolean
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000
const pageStep = 20
const NAV = 0

const notifications = ref<NotifItem[]>([])
const isInitialLoading = ref(true)
const active = ref<'all' | 'unread'>('all')
const query = ref('')
const take = ref(pageStep)

const headerEl = ref<HTMLElement | null>(null)
const listWrap = ref<HTMLElement | null>(null)
const sentinel = ref<HTMLElement | null>(null)
const headerH = ref(0)
const now = ref(Date.now())

let ro: ResizeObserver | null = null
let observer: IntersectionObserver | null = null
let nowTimer: ReturnType<typeof setInterval> | null = null

const categories = [
  {
    key: 'all',
    label: 'Semua',
    icon: 'ph:squares-four-duotone',
    types: Object.keys(menuMap) as NotifType[]
  },
  {
    key: 'rutinitas',
    label: 'Rutinitas',
    icon: 'ph:calendar-check-duotone',
    types: ['absensi', 'piket'] as NotifType[]
  },
  {
    key: 'perizinan',
    label: 'Perizinan',
    icon: 'solar:letter-linear',
    types: ['izin', 'kunjungan'] as NotifType[]
  },
  {
    key: 'kedis',
    label: 'Kedisiplinan',
    icon: 'ph:warning-circle-duotone',
    types: ['faults'] as NotifType[]
  },
  {
    key: 'informasi',
    label: 'Informasi',
    icon: 'ph:megaphone-duotone',
    types: ['announcement', 'news'] as NotifType[]
  },
  {
    key: 'data',
    label: 'Data Master',
    icon: 'ph:database-duotone',
    types: ['santri', 'wali', 'maskan'] as NotifType[]
  },
  {
    key: 'perangkat',
    label: 'Perangkat',
    icon: 'ri:rfid-fill',
    types: ['rfid'] as NotifType[]
  }
] as const

type CategoryKey = typeof categories[number]['key']
const activeCategory = ref<CategoryKey>('all')

const absensi = useAbsensi()
const announcements = useAnnouncements()
const faults = useFaults()
const izin = useIzin()
const kunjungan = useKunjungan()
const maskan = useMaskan()
const news = useNews()
const piket = usePiket()
const rfid = useRFID()
const santri = useSantri()
const wali = useWali()

const norm = (s?: string) => {
  return String(s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\s+/g, ' ')
    .trim()
}

const fmtTime = (ts: number) => {
  try {
    return new Date(ts).toLocaleString('id-ID')
  } catch {
    return ''
  }
}

const pickId = (x: any) => {
  return x?.id ?? x?._id ?? x?.key ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const pickTs = (x: any) => {
  const v = x?.timestamp ?? x?.createdAt ?? x?.created_at ?? x?.updatedAt ?? x?.time ?? x?.date ?? x?.tanggal

  if (!v) return Date.now()

  if (typeof v === 'object') {
    if (v._seconds) return Number(v._seconds) * 1000
    if (typeof v.toMillis === 'function') return v.toMillis()
  }

  if (typeof v === 'string') {
    const parsed = new Date(v).getTime()
    return Number.isNaN(parsed) ? Date.now() : parsed
  }

  const n = Number(v)

  if (!Number.isFinite(n)) return Date.now()

  return n < 10_000_000_000 ? n * 1000 : n
}

const truncate = (s?: string, n = 140) => {
  const str = String(s ?? '')
  return str.length > n ? str.slice(0, n - 1) + '…' : str
}

function isFresh(ts: number) {
  if (!Number.isFinite(ts)) return false

  const maxFutureTolerance = now.value + DAY_MS
  const minDate = now.value - WEEK_MS

  return ts >= minDate && ts <= maxFutureTolerance
}

function pruneExpired(items: NotifItem[]) {
  return items.filter((item) => isFresh(item.timestamp))
}

function upsertNotifs(incoming: NotifItem[]) {
  const map = new Map<string, NotifItem>()

  for (const n of pruneExpired(notifications.value)) {
    map.set(n.id, n)
  }

  for (const n of pruneExpired(incoming)) {
    const existing = map.get(n.id)

    map.set(n.id, {
      ...n,
      read: existing?.read ?? n.read
    })
  }

  const arr = Array.from(map.values())
  arr.sort((a, b) => b.timestamp - a.timestamp)

  notifications.value = arr
}

function measureHeader() {
  headerH.value = headerEl.value?.offsetHeight ?? 0
}

function mapAbsensiLive(): NotifItem[] {
  const meta = menuMap.absensi
  const arr = Array.isArray(absensi.live?.value) ? absensi.live.value : []

  return arr.map((x: any) => ({
    id: `absensi-${pickId(x)}`,
    type: 'absensi',
    title: x?.title ?? 'Absensi Terekam',
    message: truncate(x?.message ?? x?.santri ?? x?.desc),
    href: meta.href,
    icon: meta.icon,
    color: meta.color,
    timestamp: pickTs(x),
    time: fmtTime(pickTs(x)),
    read: false
  }))
}

function mapAnnouncements(): NotifItem[] {
  const meta = menuMap.announcement
  const rows = Array.isArray(announcements.rows?.value) ? announcements.rows.value : []

  return rows.map((x: any) => ({
    id: `announcement-${pickId(x)}`,
    type: 'announcement',
    title: x?.title ?? x?.judul ?? 'Pengumuman',
    message: truncate(x?.message ?? x?.content ?? x?.isi),
    href: meta.href,
    icon: meta.icon,
    color: meta.color,
    timestamp: pickTs(x),
    time: fmtTime(pickTs(x)),
    read: Boolean(x?.read)
  }))
}

function mapFaults(): NotifItem[] {
  const meta = menuMap.faults
  const rows = Array.isArray(faults.rows?.value) ? faults.rows.value : []

  return rows.map((x: any) => ({
    id: `fault-${pickId(x)}`,
    type: 'faults',
    title: x?.title ?? x?.kategori ?? x?.pelanggaran ?? 'Pelanggaran',
    message: truncate(x?.deskripsi ?? x?.message ?? x?.keterangan),
    href: meta.href,
    icon: meta.icon,
    color: meta.color,
    timestamp: pickTs(x),
    time: fmtTime(pickTs(x)),
    read: Boolean(x?.read)
  }))
}

function mapIzinLive(): NotifItem[] {
  const meta = menuMap.izin
  const arr = Array.isArray(izin.live?.value) ? izin.live.value : []

  return arr.map((x: any) => ({
    id: `izin-${pickId(x)}`,
    type: 'izin',
    title: x?.title ?? `Perizinan ${x?.status ?? ''}`.trim(),
    message: truncate(x?.alasan ?? x?.message ?? x?.keperluan),
    href: meta.href,
    icon: meta.icon,
    color: meta.color,
    timestamp: pickTs(x),
    time: fmtTime(pickTs(x)),
    read: Boolean(x?.read)
  }))
}

function mapKunjunganLive(): NotifItem[] {
  const meta = menuMap.kunjungan
  const arr = Array.isArray(kunjungan.live?.value) ? kunjungan.live.value : []

  return arr.map((x: any) => ({
    id: `kunjungan-${pickId(x)}`,
    type: 'kunjungan',
    title: x?.title ?? x?.purpose ?? 'Kunjungan',
    message: truncate(x?.visitor ?? x?.visitorName ?? x?.message),
    href: meta.href,
    icon: meta.icon,
    color: meta.color,
    timestamp: pickTs(x),
    time: fmtTime(pickTs(x)),
    read: Boolean(x?.read)
  }))
}

function mapMaskan(): NotifItem[] {
  const meta = menuMap.maskan
  const rows = Array.isArray(maskan.rows?.value) ? maskan.rows.value : []

  return rows.map((x: any) => ({
    id: `maskan-${pickId(x)}`,
    type: 'maskan',
    title: x?.title ?? `Asrama/Kamar: ${x?.nama ?? x?.room ?? ''}`.trim(),
    message: truncate(x?.deskripsi ?? x?.message),
    href: meta.href,
    icon: meta.icon,
    color: meta.color,
    timestamp: pickTs(x),
    time: fmtTime(pickTs(x)),
    read: Boolean(x?.read)
  }))
}

function mapNews(): NotifItem[] {
  const meta = menuMap.news
  const items = Array.isArray(news.items?.value) ? news.items.value : []

  return items.map((x: any) => ({
    id: `news-${pickId(x)}`,
    type: 'news',
    title: x?.title ?? 'Informasi',
    message: truncate(x?.excerpt ?? x?.message ?? x?.content),
    href: meta.href,
    icon: meta.icon,
    color: meta.color,
    timestamp: pickTs(x),
    time: fmtTime(pickTs(x)),
    read: Boolean(x?.read)
  }))
}

function mapPiket(): NotifItem[] {
  const meta = menuMap.piket
  const data = piket.data?.value ?? {}

  return Object.entries<any>(data).map(([key, val]) => ({
    id: `piket-${key}`,
    type: 'piket',
    title: `Jadwal Piket ${key.toUpperCase?.() ?? key}`,
    message: truncate((val?.members || []).join(', ')),
    href: meta.href,
    icon: meta.icon,
    color: meta.color,
    timestamp: pickTs(val),
    time: fmtTime(pickTs(val)),
    read: false
  }))
}

function mapRfidEvents(): NotifItem[] {
  const meta = menuMap.rfid
  const lt = rfid.lastTap?.value

  return lt
    ? [
        {
          id: `rfid-lastTap-${pickId(lt)}`,
          type: 'rfid',
          title: 'RFID Tap Terdeteksi',
          message: truncate(`${lt?.cardId ?? ''} • ${lt?.santri ?? ''}`.trim()),
          href: meta.href,
          icon: meta.icon,
          color: meta.color,
          timestamp: pickTs(lt),
          time: fmtTime(pickTs(lt)),
          read: false
        }
      ]
    : []
}

function mapSantri(): NotifItem[] {
  const meta = menuMap.santri
  const rows = Array.isArray(santri.rows?.value) ? santri.rows.value : []

  return rows.map((x: any) => ({
    id: `santri-${pickId(x)}`,
    type: 'santri',
    title: x?.nama ? `Santri: ${x?.nama}` : 'Data Santri',
    message: truncate(x?.kelas ?? x?.maskan ?? x?.kamar),
    href: meta.href,
    icon: meta.icon,
    color: meta.color,
    timestamp: pickTs(x),
    time: fmtTime(pickTs(x)),
    read: Boolean(x?.read)
  }))
}

function mapWali(): NotifItem[] {
  const meta = menuMap.wali
  const rows = Array.isArray(wali.rows?.value) ? wali.rows.value : []

  return rows.map((x: any) => ({
    id: `wali-${pickId(x)}`,
    type: 'wali',
    title: x?.nama ? `Wali: ${x?.nama}` : 'Data Wali',
    message: truncate(x?.nohp ?? x?.alamat),
    href: meta.href,
    icon: meta.icon,
    color: meta.color,
    timestamp: pickTs(x),
    time: fmtTime(pickTs(x)),
    read: Boolean(x?.read)
  }))
}

function open(n: NotifItem) {
  notifications.value = notifications.value.map((item) => {
    if (item.id !== n.id) return item
    return { ...item, read: true }
  })

  navigateTo(n.href)
}

function markAllRead() {
  notifications.value = notifications.value.map((n) => ({ ...n, read: true }))
}

function clearAll() {
  notifications.value = []
}

function relativeTime(ts: number) {
  const diff = now.value - ts
  const abs = Math.abs(diff)

  if (abs < 60_000) return 'Baru saja'

  const minute = Math.floor(abs / 60_000)
  if (minute < 60) return `${minute} menit`

  const hour = Math.floor(abs / 3_600_000)
  if (hour < 24) return `${hour} jam`

  const day = Math.floor(abs / DAY_MS)
  return `${day} hari`
}

function formatDateShort(ts: number) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short'
  }).format(new Date(ts))
}

function iconBoxClass(type: NotifType) {
  if (type === 'faults') return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
  if (type === 'izin') return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  if (type === 'kunjungan') return 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
  if (type === 'announcement') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (type === 'news') return 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300'
  if (type === 'rfid') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (type === 'piket') return 'bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-900/20 dark:text-fuchsia-300'
  if (type === 'maskan') return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300'
  return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
}

function badgeClass(type: NotifType) {
  return iconBoxClass(type)
}

function countByCategory(key: CategoryKey) {
  const allowedTypes = categories.find((c) => c.key === key)?.types ?? []
  return notifications.value.filter((n) => allowedTypes.includes(n.type)).length
}

function onIntersect(entries: IntersectionObserverEntry[]) {
  const [entry] = entries

  if (entry?.isIntersecting && take.value < filtered.value.length) {
    take.value = Math.min(take.value + pageStep, filtered.value.length)
  }
}

const listStyle = computed(() => ({
  minHeight: `calc(100dvh - ${NAV}px - ${headerH.value}px)`
}))

const unreadCount = computed(() => {
  return filtered.value.filter((n) => !n.read).length
})

const todayCount = computed(() => {
  const today = new Date()
  return filtered.value.filter((n) => {
    const date = new Date(n.timestamp)

    return date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
  }).length
})

const filtered = computed<NotifItem[]>(() => {
  const q = norm(query.value)
  const allowedTypes = categories.find((c) => c.key === activeCategory.value)?.types ?? []

  let base = pruneExpired(notifications.value).filter((n) => allowedTypes.includes(n.type))

  if (active.value === 'unread') {
    base = base.filter((i) => !i.read)
  }

  if (q) {
    base = base.filter((i) => norm(i.title).includes(q) || norm(i.message).includes(q))
  }

  return base
})

const visible = computed(() => {
  return filtered.value.slice(0, take.value)
})

watch(now, () => {
  notifications.value = pruneExpired(notifications.value)
})

watch(filtered, () => {
  take.value = Math.min(pageStep, filtered.value.length)
})

watchEffect(() => upsertNotifs(mapAbsensiLive()))

watch(() => announcements.rows?.value, () => upsertNotifs(mapAnnouncements()), { deep: true })
watch(() => faults.rows?.value, () => upsertNotifs(mapFaults()), { deep: true })
watch(() => izin.live?.value, () => upsertNotifs(mapIzinLive()), { deep: true })
watch(() => kunjungan.live?.value, () => upsertNotifs(mapKunjunganLive()), { deep: true })
watch(() => santri.rows?.value, () => upsertNotifs(mapSantri()), { deep: true })
watch(() => wali.rows?.value, () => upsertNotifs(mapWali()), { deep: true })
watch(() => maskan.rows?.value, () => upsertNotifs(mapMaskan()), { deep: true })
watch(() => piket.data?.value, () => upsertNotifs(mapPiket()), { deep: true })
watch(() => news.items?.value, () => upsertNotifs(mapNews()), { deep: true })
watch(() => rfid.lastTap?.value, () => upsertNotifs(mapRfidEvents()), { deep: true })

onMounted(async () => {
  nowTimer = setInterval(() => {
    now.value = Date.now()
  }, 60_000)

  try { absensi.subscribeLive?.() } catch {}
  try { announcements.subscribeAnnouncements?.() } catch {}
  try { faults.subscribeFaults?.() } catch {}
  try { izin.subscribeLive?.() } catch {}
  try { kunjungan.subscribeLive?.() } catch {}
  try { santri.subscribeSantri?.() } catch {}

  try { await maskan.fetchMaskan?.() } catch {}
  try { await news.loadNews?.() } catch {}
  try { await piket.fetchPiket?.() } catch {}
  try { await rfid.fetchBindings?.() } catch {}
  try { await wali.fetchWali?.() } catch {}

  upsertNotifs([
    ...mapAbsensiLive(),
    ...mapAnnouncements(),
    ...mapFaults(),
    ...mapIzinLive(),
    ...mapKunjunganLive(),
    ...mapSantri(),
    ...mapWali(),
    ...mapMaskan(),
    ...mapPiket(),
    ...mapNews(),
    ...mapRfidEvents()
  ])

  isInitialLoading.value = false

  measureHeader()

  ro = new ResizeObserver(measureHeader)

  if (headerEl.value) {
    ro.observe(headerEl.value)
  }

  window.addEventListener('resize', measureHeader)

  observer = new IntersectionObserver(onIntersect, {
    root: null,
    threshold: 0.1
  })

  if (sentinel.value) {
    observer.observe(sentinel.value)
  }
})

onBeforeUnmount(() => {
  try { announcements.unsubscribeAnnouncements?.() } catch {}
  try { faults.unsubscribeFaults?.() } catch {}
  try { santri.unsubscribeSantri?.() } catch {}

  if (ro && headerEl.value) {
    ro.unobserve(headerEl.value)
  }

  ro = null

  if (observer && sentinel.value) {
    observer.unobserve(sentinel.value)
  }

  observer = null

  if (nowTimer) {
    clearInterval(nowTimer)
  }

  nowTimer = null

  window.removeEventListener('resize', measureHeader)
})
</script>