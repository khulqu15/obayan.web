<template>
  <div class="min-h-screen bg-gray-100 text-gray-800 dark:bg-neutral-950 dark:text-neutral-200">
    <AppLoading v-if="authLoading" :force="true" label="Memuat dashboard" sublabel="Menyiapkan sesi dan hak akses" />

    <div v-else class="min-h-screen">
      <div
        v-if="mobileSidebarOpen"
        class="fixed inset-0 z-[70] bg-neutral-950/50 backdrop-blur-sm lg:hidden"
        @click="mobileSidebarOpen = false"
      />

      <div
        v-if="rightOpen"
        class="fixed inset-0 z-[65] bg-black/20 backdrop-blur-[1px] lg:hidden"
        @click="rightOpen = false"
      />

      <header class="fixed inset-x-0 top-0 z-[80] px-3 pt-3 lg:px-4">
        <div class="mx-auto flex h-16 max-w-[1920px] items-center justify-between rounded-[24px] border border-white/70 bg-white/90 px-3 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.18)] backdrop-blur dark:border-white/10 dark:bg-neutral-900/85 dark:shadow-[0_14px_36px_-14px_rgba(0,0,0,0.55)]">
          <div class="flex min-w-0 items-center gap-2 lg:gap-3">
            <button
              type="button"
              class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 lg:hidden dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              @click="mobileSidebarOpen = true"
              aria-label="Buka sidebar"
            >
              <Icon icon="lucide:panel-left" class="h-4 w-4" />
            </button>

            <div class="flex min-w-0 items-center gap-3">
              <div class="grid h-11 w-11 place-items-center overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                <img src="/assets/logo.png" alt="Logo Alinayah" class="h-9 w-9 object-contain" />
              </div>
              <div class="min-w-0">
                <p class="truncate text-sm font-bold text-gray-900 dark:text-white">{{ titleSidebar }}</p>
                <p class="truncate text-xs text-gray-500 dark:text-neutral-400">{{ subtitileSidebar }}</p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 lg:gap-3">
            <div class="hidden md:flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
              <span class="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
              {{ tokenUser?.role || 'guest' }}
            </div>

            <button
              type="button"
              class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              @click="rightOpen = !rightOpen"
              aria-label="Buka notifikasi"
            >
              <Icon icon="iconamoon:notification-light" class="h-5 w-5" />
            </button>

            <div class="relative">
              <button
                type="button"
                class="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-2 py-1.5 shadow-sm transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                @click="accountOpen = !accountOpen"
                aria-label="Account menu"
              >
                <img :src="user.avatar" alt="Avatar" class="h-8 w-8 rounded-xl object-cover" />
                <div class="hidden min-w-0 text-left sm:block">
                  <div class="truncate text-xs font-semibold text-gray-900 dark:text-white">{{ user.name }}</div>
                  <div class="truncate text-[11px] text-gray-500 dark:text-neutral-400">{{ user.email }}</div>
                </div>
                <Icon icon="lucide:chevron-down" class="hidden h-4 w-4 text-gray-400 sm:block" />
              </button>

              <div
                v-if="accountOpen"
                class="absolute right-0 top-[calc(100%+10px)] z-[90] w-72 overflow-hidden rounded-[24px] border border-gray-200 bg-white p-2 shadow-[0_24px_48px_-18px_rgba(15,23,42,0.25)] dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-[0_24px_48px_-18px_rgba(0,0,0,0.55)]"
              >
                <div class="rounded-2xl bg-gray-50 p-3 dark:bg-neutral-800">
                  <div class="flex items-center gap-3">
                    <img :src="user.avatar" alt="Avatar" class="h-11 w-11 rounded-2xl object-cover" />
                    <div class="min-w-0">
                      <div class="truncate text-sm font-bold text-gray-900 dark:text-white">{{ user.name }}</div>
                      <div class="truncate text-xs text-gray-500 dark:text-neutral-400">{{ user.email }}</div>
                    </div>
                  </div>
                </div>

                <div class="mt-2 space-y-1">
                  <NuxtLink
                    v-for="item in accountMenu.filter(i => i.label !== 'Logout')"
                    :key="item.label"
                    :to="item.href"
                    class="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="accountOpen = false"
                  >
                    <Icon :icon="item.icon" class="h-4 w-4" />
                    {{ item.label }}
                  </NuxtLink>

                  <button
                    type="button"
                    class="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20"
                    @click="openLogoutModal"
                  >
                    <Icon icon="lucide:log-out" class="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <aside
        :class="[
          'fixed bottom-4 left-3 top-[84px] z-[75] w-[280px] transition-transform duration-300 lg:left-4',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-[110%] lg:translate-x-0'
        ]"
      >
        <div class="flex h-full flex-col overflow-hidden rounded-[30px] border border-white/10 bg-neutral-950/95 shadow-[0_30px_60px_-16px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <div class="border-b border-white/10 px-4 py-4">
            <div class="flex items-center justify-between lg:hidden">
              <div>
                <div class="text-sm font-bold text-white">Menu Navigasi</div>
                <div class="text-xs text-neutral-400">Akses sesuai role login</div>
              </div>
              <button
                type="button"
                class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-neutral-200 hover:bg-white/10"
                @click="mobileSidebarOpen = false"
              >
                <Icon icon="lucide:x" class="h-4 w-4" />
              </button>
            </div>

            <div class="mt-1 rounded-[22px] border border-white/10 bg-white/5 p-3">
              <div class="flex items-center gap-3">
                <img :src="user.avatar" alt="Avatar" class="h-11 w-11 rounded-2xl object-cover ring-2 ring-white/10" />
                <div class="min-w-0">
                  <div class="truncate text-sm font-semibold text-white">{{ user.name }}</div>
                  <div class="truncate text-xs text-neutral-400">{{ user.email }}</div>
                </div>
              </div>
            </div>
          </div>

          <nav class="flex-1 overflow-y-auto px-3 py-3 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
            <div v-if="sidebarGroups.length === 0" class="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center text-sm text-neutral-400">
              Belum ada menu yang bisa diakses.
            </div>

            <div v-else class="space-y-3">
              <section
                v-for="group in sidebarGroups"
                :key="group.title"
                class="rounded-[24px] border border-white/8 bg-white/[0.03] p-2"
              >
                <button
                  type="button"
                  class="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left"
                  @click="toggleGroup(groupKey(group))"
                >
                  <div class="flex items-center gap-2">
                    <span
                      class="inline-block h-2 w-2 rounded-full"
                      :class="isGroupActive(group) ? 'bg-blue-400 shadow-[0_0_0_6px_rgba(96,165,250,0.14)]' : 'bg-neutral-600'"
                    />
                    <span class="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                      {{ group.title }}
                    </span>
                  </div>
                  <Icon
                    icon="lucide:chevron-down"
                    class="h-4 w-4 text-neutral-500 transition-transform"
                    :class="isCollapsed(groupKey(group)) ? '-rotate-90' : 'rotate-0'"
                  />
                </button>

                <div v-if="!isCollapsed(groupKey(group))" class="mt-1 space-y-1 px-1 pb-1">
                  <NuxtLink
                    v-for="item in group.items"
                    :key="item.href"
                    :to="item.href"
                    :class="menuClass(item)"
                    @click="handleNavClick(item.href, $event)"
                  >
                    <span class="flex items-center gap-3">
                      <span :class="menuIconClass(item)">
                        <Icon v-if="item.icon" :icon="item.icon" class="h-4 w-4" />
                      </span>
                      <span class="truncate text-sm font-medium">{{ item.label }}</span>
                    </span>
                    <Icon v-if="isItemActive(route.path, item.href)" icon="lucide:chevron-right" class="h-4 w-4 text-blue-300" />
                  </NuxtLink>
                </div>
              </section>
            </div>
          </nav>
        </div>
      </aside>

      <main class="pb-4 pl-3 pr-3 pt-[92px] transition-all duration-300 lg:pl-[308px] lg:pr-4">
        <div class="mx-auto max-w-[1920px]">
          <div class="h-[calc(100vh-108px)] overflow-hidden rounded-[30px] border border-white/70 bg-white/92 shadow-[0_24px_50px_-18px_rgba(15,23,42,0.18)] backdrop-blur dark:border-white/10 dark:bg-neutral-900/92 dark:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]">
            <div class="flex h-full min-h-0">
              <div class="min-w-0 flex-1 overflow-y-auto">
                <template v-if="!isProtectedRoute(route.path) || !aclReady || hasAccessTo(route.path)">
                  <div class="min-h-full">
                    <slot />
                  </div>
                </template>

                <template v-else>
                  <div class="grid min-h-[calc(100vh-108px)] place-items-center p-8">
                    <div class="max-w-md text-center">
                      <div class="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-[22px] bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-300">
                        <Icon icon="lucide:shield-alert" class="h-7 w-7" />
                      </div>
                      <h2 class="mt-4 text-xl font-bold text-gray-900 dark:text-white">Akses Ditolak</h2>
                      <p class="mt-2 text-sm text-gray-500 dark:text-neutral-400">
                        Menu dan halaman hanya tampil sesuai hak akses user yang sedang login.
                      </p>
                      <NuxtLink
                        :to="firstAllowedPath || '/app'"
                        class="mt-5 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
                      >
                        <Icon icon="lucide:arrow-left" class="h-4 w-4" />
                        Kembali ke halaman yang diizinkan
                      </NuxtLink>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </main>

      <aside
        :class="[
          'fixed bottom-4 right-3 top-[84px] z-[76] w-[340px] transition-transform duration-300 lg:right-4',
          rightOpen ? 'translate-x-0' : 'translate-x-[112%]'
        ]"
      >
        <div class="flex h-full flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/95 shadow-[0_24px_50px_-18px_rgba(15,23,42,0.18)] backdrop-blur dark:border-white/10 dark:bg-neutral-900/95 dark:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]">
          <div class="flex items-center justify-between border-b border-gray-200 px-4 py-4 dark:border-neutral-800">
            <div>
              <div class="text-sm font-bold text-gray-900 dark:text-white">Notifikasi</div>
              <div class="text-xs text-gray-500 dark:text-neutral-400">Ringkas dan fokus</div>
            </div>
            <button
              type="button"
              class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              @click="rightOpen = false"
            >
              <Icon icon="lucide:x" class="h-4 w-4" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto">
            <WidgetNotificationView />
          </div>
        </div>
      </aside>

      <Teleport to="body">
        <div v-if="logoutOpen" class="fixed inset-0 z-[100]">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="logoutOpen = false" />
          <div class="relative mx-auto mt-24 w-[92%] max-w-md">
            <div class="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
              <div class="p-6">
                <div class="flex items-start gap-4">
                  <div class="shrink-0 rounded-2xl bg-rose-100 p-3 dark:bg-rose-900/20">
                    <Icon icon="lucide:log-out" class="h-6 w-6 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 class="text-base font-bold text-gray-900 dark:text-white">Konfirmasi Keluar</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                      Anda akan keluar dari dashboard. Pastikan tidak ada perubahan yang belum disimpan.
                    </p>
                  </div>
                </div>

                <div class="mt-6 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="logoutOpen = false"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
                    @click="doLogout"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import AppLoading from '~/components/AppLoading.vue'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { get, off, onValue, ref as dbRef } from 'firebase/database'

type Item = { label: string; href: string; icon?: string }
type SidebarGroup = { title: string; key?: string; items: Item[] }
type PlainSession = {
  sub?: string
  uid?: string
  role?: string
  name?: string
  email?: string
  phone?: string
  waliPhone?: string
  waliName?: string
  santriId?: string
  santriName?: string
  allowedRoutes?: string[]
  iat?: number
  exp?: number
}

type AccountItem = { label: 'Profile' | 'Settings' | 'Logout'; icon: string; href: string }

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { $realtimeDb, $auth } = useNuxtApp() as any

const AUTH_KEY = 'alinayah:auth'
const PASSPHRASE = 'alinayah-admin-secret'
const SALT = 'alinayah-static-salt'
const ITER = 120_000

const titleSidebar = ref('SINAYAH')
const subtitileSidebar = ref('SIAKAD Ponpes. ALINAYAH')

const mobileSidebarOpen = ref(false)
const rightOpen = ref(false)
const accountOpen = ref(false)
const logoutOpen = ref(false)

const authLoading = useState<boolean>('authLoading', () => true)
const sessionUser = useState<any>('sessionUser', () => ({}))
const tokenUser = ref<{ uid: string; email: string; role: string; name: string; allowedRoutes: string[] } | null>(null)
const aclReady = ref(false)

let aclRef: ReturnType<typeof dbRef> | null = null
let profileRef: ReturnType<typeof dbRef> | null = null

const url = computed(() => new URL(route.fullPath || '/', config.public.siteUrl).toString())
useSeoMeta({
  title: 'Ponpes ALINAYAH | Pesantren Inovatif & Informatif',
  description: 'Selamat datang di Ponpes ALINAYAH Purwosari: KMI/Diniyah, Tahfidz, MTs/MA, kegiatan santri, dan PPDB online.',
  ogTitle: 'Ponpes ALINAYAH | Pesantren Inovatif & Informatif',
  ogDescription: 'Selamat datang di Ponpes ALINAYAH Purwosari: KMI/Diniyah, Tahfidz, MTs/MA, kegiatan santri, dan PPDB online.',
  ogType: 'website',
  ogUrl: url.value,
  ogImage: '/assets/logo.png',
  twitterCard: 'summary_large_image',
  themeColor: '#0ea5e9',
  robots: 'index, follow'
})
useHead({ link: [{ rel: 'canonical', href: url.value }] })

const ADMIN_SIDEBAR: SidebarGroup[] = [
  {
    title: 'Beranda',
    items: [
      { label: 'Dashboard', href: '/app', icon: 'lucide:layout-dashboard' },
      { label: 'Berita Informasi', href: '/app/news', icon: 'hugeicons:news' },
      { label: 'Pengumuman', href: '/app/announcement', icon: 'lucide:info' },
      { label: 'Agenda', href: '/app/agenda', icon: 'solar:calendar-line-duotone' }
    ]
  },
  {
    title: 'Form',
    items: [
      { label: 'Registrasi Putra', href: '/app/registration', icon: 'fluent:form-24-regular' },
      { label: 'Registrasi Putri', href: '/app/registration-girl', icon: 'fluent:form-24-regular' }
    ]
  },
  {
    title: 'Kesantrian',
    items: [
      { label: 'Santri', href: '/app/santri', icon: 'lucide:users' },
      { label: 'Maskan Kamar', href: '/app/maskan', icon: 'lucide:bed' },
      { label: 'Kelas', href: '/app/class', icon: 'streamline:class-lesson' },
      { label: 'Wali Santri', href: '/app/wali', icon: 'lucide:user-round' }
    ]
  },
  {
    title: 'Rutinitas',
    items: [
      { label: 'Galeri', href: '/app/gallery', icon: 'streamline-flex:gallery' },
      { label: 'Absensi Harian', href: '/app/absen', icon: 'hugeicons:note-03' },
      { label: 'Kunjungan', href: '/app/kunjungan', icon: 'material-symbols:parent-child-dining-outline-rounded' },
      { label: 'Jadwal Piket', href: '/app/picket', icon: 'lucide:calendar-days' },
      { label: 'Registrasi RFID', href: '/app/setting-rfid', icon: 'ri:rfid-fill' }
    ]
  },
  {
    title: 'Keamanan',
    items: [
      { label: 'Pelanggaran', href: '/app/faults', icon: 'mingcute:fault-line' },
      { label: 'Perizinan', href: '/app/izin', icon: 'solar:letter-linear' }
    ]
  },
  {
    title: 'Akademik',
    items: [
      { label: 'Buku / Kitab', href: '/app/book', icon: 'ion:book-outline' },
      { label: 'Nilai', href: '/app/nilai', icon: 'solar:chart-linear' },
      { label: 'Hafalan', href: '/app/hafalan', icon: 'ooui:italic-arab-keheh-jeem' },
      { label: 'Guru', href: '/app/teacher', icon: 'tabler:chalkboard-teacher' }
    ]
  },
  {
    title: 'Ketertiban',
    items: [{ label: 'Buku Sabar', href: '/app/patience', icon: 'dinkie-icons:translate-arabic-latin' }]
  },
  {
    title: 'Keuangan',
    items: [
      { label: 'Pembayaran', href: '/app/payment', icon: 'akar-icons:money' },
      { label: 'Laporan Keuangan', href: '/app/report-money', icon: 'streamline-plump:file-report' }
    ]
  },
  {
    title: 'Pengaturan',
    items: [
      { label: 'Profil', href: '/app/profile', icon: 'iconamoon:profile' },
      { label: 'Kontak', href: '/app/contact', icon: 'hugeicons:contact-01' },
      { label: 'Navbar', href: '/app/navbar', icon: 'tabler:menu-3' },
      { label: 'Hak Akses', href: '/app/user', icon: 'solar:key-broken' },
      { label: 'Website', href: '/app/web', icon: 'icon-park-outline:web-page' }
    ]
  }
]

const DEFAULT_WALI_ROUTES = ['/wali', '/wali/santri', '/wali/pembayaran', '/wali/pengumuman']
const WALI_SIDEBAR: SidebarGroup[] = [
  {
    title: 'Wali',
    items: [
      { label: 'Beranda', href: '/wali', icon: 'lucide:house' },
      { label: 'Santri', href: '/wali/santri', icon: 'lucide:user-round' },
      { label: 'Pembayaran', href: '/wali/pembayaran', icon: 'akar-icons:money' },
      { label: 'Pengumuman', href: '/wali/pengumuman', icon: 'lucide:megaphone' },
      { label: 'Akademik', href: '/wali/akademik', icon: 'solar:chart-linear' },
      { label: 'Perizinan', href: '/wali/perizinan', icon: 'solar:letter-linear' },
      { label: 'Kunjungan', href: '/wali/kunjungan', icon: 'material-symbols:parent-child-dining-outline-rounded' }
    ]
  }
]

const collapsedGroups = useState<Record<string, boolean>>('sidebarCollapsed', () => ({}))
const STORAGE_KEY = 'alinayah:sidebar:collapsed'

function normalize(path: string) {
  try {
    const u = new URL(path, 'http://x')
    return u.pathname.replace(/\/+$/, '') || '/'
  } catch {
    return (path || '').replace(/\/+$/, '') || '/'
  }
}

function isProtectedRoute(path: string) {
  return path.startsWith('/app') || path.startsWith('/wali')
}

function isAllowed(path: string, allowed: string[]) {
  const a = normalize(path)
  const list = (allowed || []).map(normalize)

  return list.some((r) => {
    if (r === '/app' || r === '/wali') return a === r
    return a === r || (r !== '/' && a.startsWith(r + '/'))
  })
}

function coerceRoutes(v: any): string[] {
  if (Array.isArray(v)) return v.map(String)
  if (v && typeof v === 'object') return Object.values(v).filter((x) => typeof x === 'string').map(String)
  return []
}

function uniq(arr: string[]) {
  return Array.from(new Set(arr.map(normalize)))
}

function groupKey(g: SidebarGroup) {
  return g.key ?? g.title.toLowerCase().trim().replace(/[^\w]+/g, '-')
}

function isCollapsed(key: string) {
  return collapsedGroups.value[key] ?? false
}

function persistCollapsed() {
  if (!process.client) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsedGroups.value))
  } catch {}
}

function toggleGroup(key: string) {
  collapsedGroups.value[key] = !isCollapsed(key)
  persistCollapsed()
}

function getSidebarForRole(role?: string, currentPath?: string) {
  if (role === 'wali') return WALI_SIDEBAR
  if (role === 'admin' || role === 'superadmin' || role === 'operator' || role === 'staff' || role === 'pengurus') {
    return ADMIN_SIDEBAR
  }
  return currentPath?.startsWith('/wali') ? WALI_SIDEBAR : ADMIN_SIDEBAR
}

const effectiveAllowedRoutes = computed<string[]>(() => {
  const role = tokenUser.value?.role
  const raw = tokenUser.value?.allowedRoutes
  const routes = Array.isArray(raw) ? uniq(raw.map(String)) : []

  if (routes.length) return routes

  if (role === 'wali') return DEFAULT_WALI_ROUTES
  if (['admin', 'superadmin', 'operator', 'staff', 'pengurus'].includes(role || '')) return ['/app']

  return []
})

const rawSidebar = computed<SidebarGroup[]>(() => getSidebarForRole(tokenUser.value?.role, route.path))

const sidebarGroups = computed<SidebarGroup[]>(() => {
  const routes = effectiveAllowedRoutes.value
  return rawSidebar.value
    .map((g) => ({ ...g, items: g.items.filter((it) => isAllowed(it.href, routes)) }))
    .filter((g) => g.items.length > 0)
})

const allMenuPaths = computed(() => rawSidebar.value.flatMap((g) => g.items.map((i) => i.href)))

const firstAllowedPath = computed<string | null>(() => {
  const role = tokenUser.value?.role
  const allowed = effectiveAllowedRoutes.value
  if (role === 'wali') return '/wali'
  if (!allowed.length) return null
  if (allowed.some((a) => normalize(a) === '/app')) return '/app'
  for (const p of allMenuPaths.value) if (isAllowed(p, allowed)) return p
  return null
})

function hasAccessTo(path: string) {
  return isAllowed(path, effectiveAllowedRoutes.value)
}

function isItemActive(currentPath: string, href: string) {
  const a = normalize(currentPath)
  const b = normalize(href)
  if (b === '/app' || b === '/wali') return a === b
  return a === b || a.startsWith(b + '/')
}

function isGroupActive(g: SidebarGroup) {
  return g.items?.some((i) => isItemActive(route.path, i.href)) ?? false
}

function menuClass(item: Item) {
  const active = isItemActive(route.path, item.href)
  return [
    'flex items-center justify-between rounded-[22px] px-3 py-3 text-sm transition focus:outline-none',
    active
      ? 'bg-blue-600/18 text-white ring-1 ring-blue-500/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
      : 'text-neutral-300 hover:bg-white/6 hover:text-white'
  ].join(' ')
}

function menuIconClass(item: Item) {
  const active = isItemActive(route.path, item.href)
  return [
    'inline-flex h-9 w-9 items-center justify-center rounded-2xl transition',
    active ? 'bg-blue-500/18 text-blue-200' : 'bg-white/[0.04] text-neutral-400'
  ].join(' ')
}

const accountMenu = computed<AccountItem[]>(() => {
  const base = tokenUser.value?.role === 'wali' || route.path.startsWith('/wali') ? '/wali' : '/app'
  return [
    { label: 'Profile', icon: 'lucide:user', href: `${base}/profile` },
    { label: 'Settings', icon: 'lucide:settings-2', href: `${base}/setting` },
    { label: 'Logout', icon: 'lucide:log-out', href: '#' }
  ]
})

const user = computed(() => ({
  name: sessionUser.value?.name || tokenUser.value?.name || 'Pengguna',
  email: sessionUser.value?.email || tokenUser.value?.email || '-',
  avatar: sessionUser.value?.avatar || '/assets/pp.jpg'
}))

function looksLikeEmail(v?: string) {
  return !!(v && v.includes('@') && !/^\s*-\s*$/.test(v))
}

function primaryContactFromSession(sess?: PlainSession | null) {
  if (!sess) return '-'
  if (looksLikeEmail(sess.email)) return String(sess.email)
  return (sess.phone || sess.waliPhone || '-').toString()
}

async function deriveKey(pass: string, salt: string) {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(pass), { name: 'PBKDF2' }, false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: ITER, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  )
}

function fromB64(b64: string) {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)).buffer
}

function isLikelyEncryptedToken(raw: string) {
  try {
    const o = JSON.parse(raw)
    return !!(o && typeof o === 'object' && o.iv && o.ct)
  } catch {
    return false
  }
}

async function decryptJSON(serialized: string) {
  const obj = JSON.parse(serialized)
  const key = await deriveKey(PASSPHRASE, SALT)
  const iv = new Uint8Array(fromB64(obj.iv))
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, fromB64(obj.ct))
  return JSON.parse(new TextDecoder().decode(plain))
}

async function readAuthToken(): Promise<PlainSession | null> {
  const raw = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY)
  if (!raw) return null
  try {
    if (isLikelyEncryptedToken(raw)) {
      return (await decryptJSON(raw)) as PlainSession
    }
    return JSON.parse(raw) as PlainSession
  } catch {
    return null
  }
}

function applyProfile(uid: string, v: any) {
  const nextName = v?.displayName || v?.name || sessionUser.value?.name || tokenUser.value?.name || 'Pengguna'
  const nextEmail = v?.email || sessionUser.value?.email || tokenUser.value?.email || '-'
  const nextAvatar = v?.avatar || sessionUser.value?.avatar || '/assets/pp.jpg'

  sessionUser.value = {
    ...(sessionUser.value || {}),
    uid,
    name: nextName,
    email: nextEmail,
    avatar: nextAvatar
  }

  if (tokenUser.value) {
    tokenUser.value = { ...tokenUser.value, name: nextName, email: nextEmail }
  }
}

async function startProfileWatcher(uid?: string | null) {
  if (!uid) return
  try {
    if (profileRef) off(profileRef)
  } catch {}

  profileRef = dbRef($realtimeDb, `/alinayah/users/${uid}`)

  try {
    const snap = await get(profileRef)
    if (snap.exists()) applyProfile(uid, snap.val())
  } catch {}

  onValue(profileRef, (snap) => applyProfile(uid, snap.val()))
}

function applyAllowedRoutes(uid: string, routesRaw: any) {
  const coerced = uniq(coerceRoutes(routesRaw))
  const prev = tokenUser.value || {
    uid,
    email: $auth?.currentUser?.email || '-',
    name: $auth?.currentUser?.displayName || 'Pengguna',
    role: 'wali',
    allowedRoutes: []
  }

  const fallbackDefault =
    prev.role === 'wali'
      ? DEFAULT_WALI_ROUTES
      : (['admin', 'superadmin', 'operator', 'staff', 'pengurus'].includes(prev.role) ? ['/app'] : [])

  const nextAllowed = coerced.length ? coerced : fallbackDefault

  tokenUser.value = {
    ...prev,
    uid,
    allowedRoutes: nextAllowed
  }

  aclReady.value = true
  enforceRouteAccess(route.path)
}

async function startAclWatcher(uidHint?: string | null) {
  let uid = uidHint || $auth?.currentUser?.uid || null

  if (!uid) {
    await new Promise<void>((resolve) => {
      const unsub = onAuthStateChanged($auth, (u) => {
        uid = u?.uid || null
        unsub()
        resolve()
      }, () => resolve())
    })
  }

  if (!uid) {
    aclReady.value = true
    return
  }

  aclRef = dbRef($realtimeDb, `/alinayah/users/${uid}/allowedRoutes`)
  const r = aclRef

  try {
    const snap = await get(r)
    if (snap.exists()) applyAllowedRoutes(uid, snap.val())
    else applyAllowedRoutes(uid, [])
  } catch {
    applyAllowedRoutes(uid, [])
  }

  onValue(r, (snap) => applyAllowedRoutes(uid!, snap.val()))
}

function enforceRouteAccess(path: string) {
  if (!isProtectedRoute(path)) return
  if (!aclReady.value) return

  if (!tokenUser.value) {
    if (path !== '/cakAdmin') router.replace('/cakAdmin')
    return
  }

  if (hasAccessTo(path)) return

  const fallback = firstAllowedPath.value || (tokenUser.value.role === 'wali' ? '/wali' : '/cakAdmin')
  if (path !== fallback) router.replace(fallback)
}

function handleNavClick(to: string, e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  if (!to || to === route.path) return
  if (!hasAccessTo(to)) {
    enforceRouteAccess(route.path)
    return
  }
  mobileSidebarOpen.value = false
  accountOpen.value = false
  router.push(to)
}

function openLogoutModal() {
  accountOpen.value = false
  logoutOpen.value = true
}

async function doLogout() {
  try {
    if (aclRef) off(aclRef)
  } catch {}
  try {
    if (profileRef) off(profileRef)
  } catch {}
  try {
    await signOut($auth)
  } catch {}

  localStorage.removeItem(AUTH_KEY)
  sessionStorage.removeItem(AUTH_KEY)
  tokenUser.value = null
  sessionUser.value = {} as any
  logoutOpen.value = false
  router.replace('/cakAdmin')
}

function handleWindowClick(e: MouseEvent) {
  const target = e.target as HTMLElement | null
  if (!target) return
  if (!target.closest('[aria-label="Account menu"]') && !target.closest('.account-popover')) {
    accountOpen.value = false
  }
}

onMounted(async () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) collapsedGroups.value = JSON.parse(saved)
  } catch {}

  try {
    const sess = await readAuthToken()
    if (!sess) throw new Error('no token')

    const now = Math.floor(Date.now() / 1000)
    if (!sess.exp || now >= sess.exp) throw new Error('expired')

    const uid = sess.uid || sess.sub || 'wali'
    const role = sess.role || (route.path.startsWith('/wali') ? 'wali' : 'admin')
    const name = sess.name || sess.waliName || sess.santriName || 'Wali'
    const contact = primaryContactFromSession(sess)

    tokenUser.value = {
      uid,
      email: contact,
      role,
      name,
      allowedRoutes: Array.isArray(sess.allowedRoutes) ? sess.allowedRoutes : []
    }

    if (route.path === '/' || route.path === '/login' || route.path === '/cakAdmin') {
      router.replace(role === 'wali' ? '/wali' : '/app')
    }

    await nextTick()
    if (uid) {
      await startAclWatcher(uid)
      await startProfileWatcher(uid)
    } else {
      applyAllowedRoutes(uid, tokenUser.value?.allowedRoutes || [])
    }
  } catch {
    localStorage.removeItem(AUTH_KEY)
    sessionStorage.removeItem(AUTH_KEY)
    aclReady.value = true
  } finally {
    authLoading.value = false
  }

  window.addEventListener('click', handleWindowClick)
})

watch(() => route.fullPath, () => {
  rightOpen.value = false
  accountOpen.value = false
  mobileSidebarOpen.value = false
  enforceRouteAccess(route.path)
})

watch(collapsedGroups, persistCollapsed, { deep: true })

onUnmounted(() => {
  try {
    if (aclRef) off(aclRef)
  } catch {}
  try {
    if (profileRef) off(profileRef)
  } catch {}
  window.removeEventListener('click', handleWindowClick)
})
</script>
