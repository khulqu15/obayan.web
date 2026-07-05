<template>
  <div class="min-h-screen bg-slate-100 text-slate-800 dark:bg-neutral-950 dark:text-neutral-200">
    <AppLoading
      v-if="authLoading"
      :force="true"
      label="Memuat Portal Wali"
      sublabel="Menyiapkan sesi dan data wali"
    />

    <div v-else class="min-h-screen">
      <!-- Mobile Overlay -->
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 z-70 bg-neutral-950/50 backdrop-blur-sm lg:hidden"
        @click="mobileMenuOpen = false"
      ></div>

      <!-- Desktop Sidebar -->
      <aside class="fixed bottom-4 left-4 top-4 z-60 hidden w-[292px] lg:block">
        <div class="flex h-full flex-col overflow-hidden rounded-4xl border border-white/10 bg-neutral-950 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.65)]">
          <div class="border-b border-white/10 p-4">
            <div class="rounded-[26px] border border-white/10 bg-white/4 p-4">
              <div class="flex items-center gap-3">
                <div class="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-white">
                  <img
                    :src="appLogo"
                    :alt="`Logo ${clientDisplayName}`"
                    class="h-9 w-9 object-contain"
                  />
                </div>

                <div class="min-w-0">
                  <div class="truncate text-sm font-black text-white">
                    {{ appName }}
                  </div>
                  <div class="truncate text-xs text-neutral-400">
                    Portal Wali Santri
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-3 rounded-[26px] border border-green-400/20 bg-green-400/10 p-4">
              <div class="flex items-center gap-3">
                <img
                  :src="user.avatar"
                  alt="Avatar"
                  class="h-11 w-11 rounded-2xl object-cover ring-2 ring-green-400/20"
                />

                <div class="min-w-0">
                  <div class="truncate text-sm font-bold text-white">
                    {{ user.name }}
                  </div>
                  <div class="truncate text-xs text-green-100/70">
                    {{ userSubtitle }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <nav class="flex-1 overflow-y-auto px-3 py-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-track]:bg-transparent">
            <div class="space-y-2">
              <NuxtLink
                v-for="item in visibleMenu"
                :key="item.href"
                :to="item.href"
                :class="desktopMenuClass(item)"
                @click="handleNavClick(item.href, $event)"
              >
                <span class="flex min-w-0 items-center gap-3">
                  <span :class="desktopIconClass(item)">
                    <Icon :icon="item.icon" class="h-5 w-5" />
                  </span>

                  <span class="truncate text-sm font-semibold">
                    {{ item.label }}
                  </span>
                </span>

                <Icon
                  v-if="isItemActive(route.path, item.href)"
                  icon="lucide:chevron-right"
                  class="h-4 w-4 text-green-200"
                />
              </NuxtLink>
            </div>
          </nav>

          <div class="border-t border-white/10 p-3">
            <button
              type="button"
              class="flex w-full items-center justify-center gap-2 rounded-[22px] bg-rose-500/12 px-4 py-3 text-sm font-bold text-rose-300 transition hover:bg-rose-500/20"
              @click="logoutOpen = true"
            >
              <Icon icon="lucide:log-out" class="h-4 w-4" />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      <!-- Mobile Bottom Sheet Menu -->
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-x-3 bottom-24 z-80 overflow-hidden rounded-4xl border border-white/80 bg-white/95 p-3 shadow-[0_30px_70px_-20px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/95 lg:hidden"
      >
        <div class="mb-3 flex items-center justify-between px-2 pt-1">
          <div>
            <div class="text-sm font-black text-slate-900 dark:text-white">
              Semua Menu
            </div>
            <div class="text-xs text-slate-500 dark:text-neutral-400">
              Portal wali santri
            </div>
          </div>

          <button
            type="button"
            class="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-200"
            @click="mobileMenuOpen = false"
          >
            <Icon icon="lucide:x" class="h-4 w-4" />
          </button>
        </div>

        <div class="grid grid-cols-4 gap-2">
          <NuxtLink
            v-for="item in visibleMenu"
            :key="item.href"
            :to="item.href"
            :class="mobileSheetMenuClass(item)"
            @click="mobileMenuOpen = false"
          >
            <span :class="mobileSheetIconClass(item)">
              <Icon :icon="item.icon" class="h-5 w-5" />
            </span>
            <span class="mt-1 line-clamp-1 text-[11px] font-bold">
              {{ item.label }}
            </span>
          </NuxtLink>
        </div>
      </div>

      <!-- Top Navbar -->
      <header class="fixed inset-x-0 top-0 z-50 px-3 pt-3 lg:left-[308px] lg:px-4">
        <div class="mx-auto flex h-16 max-w-[1600px] items-center justify-between rounded-[28px] border border-white/80 bg-white/90 px-3 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/90">
          <div class="flex min-w-0 items-center gap-3">
            <button
              type="button"
              class="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 lg:hidden"
              @click="mobileMenuOpen = true"
              aria-label="Buka menu"
            >
              <Icon icon="lucide:grid-2x2" class="h-5 w-5" />
            </button>

            <div class="grid h-11 w-11 place-items-center overflow-hidden rounded-2xl bg-green-500 shadow-lg shadow-green-500/20 lg:hidden">
              <img
                :src="appLogo"
                :alt="`Logo ${clientDisplayName}`"
                class="h-8 w-8 object-contain"
              />
            </div>

            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <p class="truncate text-sm font-black text-slate-900 dark:text-white sm:text-base">
                  {{ currentPageTitle }}
                </p>

                <span class="hidden rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700 dark:bg-green-900/20 dark:text-green-300 sm:inline-flex">
                  Wali
                </span>
              </div>

              <p class="truncate text-xs text-slate-500 dark:text-neutral-400">
                {{ mobileTopSubtitle }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="relative grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              @click="notificationOpen = true"
              aria-label="Buka notifikasi"
            >
              <Icon icon="iconamoon:notification-light" class="h-5 w-5" />
              <span class="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white dark:ring-neutral-900"></span>
            </button>

            <div class="relative">
              <button
                type="button"
                class="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                @click="accountOpen = !accountOpen"
                aria-label="Account menu"
              >
                <img
                  :src="user.avatar"
                  alt="Avatar"
                  class="h-8 w-8 rounded-xl object-cover"
                />

                <div class="hidden min-w-0 text-left sm:block">
                  <div class="max-w-32 truncate text-xs font-bold text-slate-900 dark:text-white">
                    {{ user.name }}
                  </div>
                  <div class="max-w-32 truncate text-[11px] text-slate-500 dark:text-neutral-400">
                    {{ userSubtitle }}
                  </div>
                </div>

                <Icon icon="lucide:chevron-down" class="hidden h-4 w-4 text-slate-400 sm:block" />
              </button>

              <div
                v-if="accountOpen"
                class="absolute right-0 top-[calc(100%+10px)] z-90 w-72 overflow-hidden rounded-[28px] border border-slate-200 bg-white p-2 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)] dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div class="rounded-[22px] bg-slate-50 p-3 dark:bg-neutral-800">
                  <div class="flex items-center gap-3">
                    <img
                      :src="user.avatar"
                      alt="Avatar"
                      class="h-11 w-11 rounded-2xl object-cover"
                    />

                    <div class="min-w-0">
                      <div class="truncate text-sm font-black text-slate-900 dark:text-white">
                        {{ user.name }}
                      </div>
                      <div class="truncate text-xs text-slate-500 dark:text-neutral-400">
                        {{ userSubtitle }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-2 space-y-1">
                  <NuxtLink
                    to="/wali/profile"
                    class="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="accountOpen = false"
                  >
                    <Icon icon="lucide:user" class="h-4 w-4" />
                    Profil Wali
                  </NuxtLink>

                  <NuxtLink
                    to="/wali/setting"
                    class="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="accountOpen = false"
                  >
                    <Icon icon="lucide:settings-2" class="h-4 w-4" />
                    Pengaturan
                  </NuxtLink>

                  <button
                    type="button"
                    class="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20"
                    @click="openLogoutModal"
                  >
                    <Icon icon="lucide:log-out" class="h-4 w-4" />
                    Keluar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="px-3 pb-28 pt-[92px] transition-all duration-300 lg:pl-[324px] lg:pr-4 lg:pb-4">
        <div class="mx-auto max-w-[1600px]">
          <div class="min-h-[calc(100vh-108px)] overflow-hidden rounded-4xl border border-white/80 bg-white/95 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/95">
            <div class="min-h-[calc(100vh-108px)]">
              <slot />
            </div>
          </div>
        </div>
      </main>

      <!-- Mobile Bottom Navigation like Gojek -->
      <nav class="fixed inset-x-0 bottom-0 z-55 border-t border-slate-200/80 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-16px_40px_-24px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/95 lg:hidden">
        <div class="mx-auto grid max-w-md grid-cols-5 gap-1">
          <NuxtLink
            v-for="item in bottomMenu"
            :key="item.href"
            :to="item.href"
            :class="bottomMenuClass(item)"
          >
            <span :class="bottomIconClass(item)">
              <Icon :icon="item.icon" class="h-5 w-5" />
            </span>
            <span class="mt-1 line-clamp-1 text-[10px] font-black">
              {{ item.shortLabel || item.label }}
            </span>
          </NuxtLink>

          <button
            type="button"
            :class="[
              'flex min-w-0 flex-col items-center justify-center rounded-[22px] px-1 py-2 text-center transition',
              mobileMenuOpen ? 'text-green-700 dark:text-green-300' : 'text-slate-500 dark:text-neutral-400'
            ]"
            @click="mobileMenuOpen = true"
          >
            <span
              :class="[
                'grid h-10 w-10 place-items-center rounded-[18px] transition',
                mobileMenuOpen
                  ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                  : 'bg-slate-100 text-slate-500 dark:bg-neutral-800 dark:text-neutral-400'
              ]"
            >
              <Icon icon="lucide:grid-2x2" class="h-5 w-5" />
            </span>
            <span class="mt-1 text-[10px] font-black">Menu</span>
          </button>
        </div>
      </nav>

      <!-- Notification Drawer -->
      <div v-if="notificationOpen" class="fixed inset-0 z-95">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="notificationOpen = false"></div>

        <aside class="absolute bottom-0 right-0 top-0 w-full max-w-md bg-white shadow-2xl dark:bg-neutral-900 sm:m-4 sm:rounded-4xl">
          <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-neutral-800">
            <div>
              <div class="text-sm font-black text-slate-900 dark:text-white">
                Notifikasi
              </div>
              <div class="text-xs text-slate-500 dark:text-neutral-400">
                Informasi terbaru untuk wali
              </div>
            </div>

            <button
              type="button"
              class="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-200"
              @click="notificationOpen = false"
            >
              <Icon icon="lucide:x" class="h-4 w-4" />
            </button>
          </div>

          <div class="h-[calc(100%-73px)] overflow-y-auto">
            <LazyWidgetNotificationView />
          </div>
        </aside>
      </div>

      <!-- Logout Modal -->
      <Teleport to="body">
        <div v-if="logoutOpen" class="fixed inset-0 z-100">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="logoutOpen = false"></div>

          <div class="relative mx-auto mt-24 w-[92%] max-w-md">
            <div class="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
              <div class="p-6">
                <div class="flex items-start gap-4">
                  <div class="shrink-0 rounded-2xl bg-rose-100 p-3 dark:bg-rose-900/20">
                    <Icon icon="lucide:log-out" class="h-6 w-6 text-rose-600 dark:text-rose-400" />
                  </div>

                  <div>
                    <h3 class="text-base font-black text-slate-900 dark:text-white">
                      Konfirmasi Keluar
                    </h3>
                    <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                      Anda akan keluar dari portal wali. Pastikan semua aktivitas sudah selesai.
                    </p>
                  </div>
                </div>

                <div class="mt-6 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="logoutOpen = false"
                  >
                    Batal
                  </button>

                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700"
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
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { get, off, onValue, ref as dbRef } from 'firebase/database'
import { useRoute, useRouter } from 'vue-router'
import { useRuntimeConfig, useNuxtApp, useHead, useSeoMeta, useState } from 'nuxt/app'

type WaliMenuItem = {
  label: string
  shortLabel?: string
  href: string
  icon: string
}

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

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { $realtimeDb, $auth } = useNuxtApp() as any

const clientName = String(config.public.clientName || 'alinayah')
const siteUrl = String(config.public.siteUrl || 'https://alinayah.sencra.io')
const siteName = String(config.public.siteName || 'Portal Wali')
const siteDescription = String(config.public.siteDescription || '')
const twitterSite = String(config.public.twitterSite || '@obayan')

const appName = String(config.public.appName || 'OBAYAN')
const clientDisplayName = String(config.public.clientDisplayName || 'Obayan')
const appLogo = String(config.public.appLogo || '/assets/logo.png')
const appThemeColor = String(config.public.appThemeColor || '#16a34a')

const firebaseRoot = clientName
const userPath = `${firebaseRoot}/users`

const AUTH_KEY = `${clientName}:auth`
const PASSPHRASE = `${clientName}-wali-secret`
const SALT = `${clientName}-wali-static-salt`
const ITER = 120_000

const DEFAULT_WALI_ROUTES = [
  '/wali',
  '/wali/santri',
  '/wali/pembayaran',
  '/wali/pengumuman',
  '/wali/akademik',
  '/wali/absensi',
  '/wali/hafalan',
  '/wali/perizinan',
  '/wali/kunjungan',
  '/wali/jadwal',
  '/wali/pelanggaran',
  '/wali/book',
  '/wali/contact',
  '/wali/profile',
  '/wali/setting'
]

const WALI_MENU: WaliMenuItem[] = [
  { label: 'Beranda', shortLabel: 'Home', href: '/wali', icon: 'lucide:house' },
  { label: 'Santri', shortLabel: 'Santri', href: '/wali/santri', icon: 'lucide:user-round' },
  { label: 'Pembayaran', shortLabel: 'Bayar', href: '/wali/pembayaran', icon: 'akar-icons:money' },
  { label: 'Pengumuman', shortLabel: 'Info', href: '/wali/pengumuman', icon: 'lucide:megaphone' },
  { label: 'Akademik', shortLabel: 'Nilai', href: '/wali/akademik', icon: 'solar:chart-linear' },
  { label: 'Absensi', shortLabel: 'Absen', href: '/wali/absensi', icon: 'hugeicons:note-03' },
  { label: 'Hafalan', shortLabel: 'Hafalan', href: '/wali/hafalan', icon: 'ooui:italic-arab-keheh-jeem' },
  { label: 'Perizinan', shortLabel: 'Izin', href: '/wali/perizinan', icon: 'solar:letter-linear' },
  { label: 'Kunjungan', shortLabel: 'Visit', href: '/wali/kunjungan', icon: 'material-symbols:parent-child-dining-outline-rounded' },
  { label: 'Jadwal', shortLabel: 'Jadwal', href: '/wali/jadwal', icon: 'solar:calendar-line-duotone' },
  { label: 'Pelanggaran', shortLabel: 'Pelanggaran', href: '/wali/pelanggaran', icon: 'mingcute:fault-line' },
  { label: 'Buku / Kitab', shortLabel: 'Kitab', href: '/wali/book', icon: 'ion:book-outline' },
  { label: 'Kontak', shortLabel: 'Kontak', href: '/wali/contact', icon: 'hugeicons:contact-01' },
  { label: 'Profil', shortLabel: 'Profil', href: '/wali/profile', icon: 'lucide:user' },
  { label: 'Pengaturan', shortLabel: 'Setting', href: '/wali/setting', icon: 'lucide:settings-2' }
]

const mobileMenuOpen = ref(false)
const notificationOpen = ref(false)
const accountOpen = ref(false)
const logoutOpen = ref(false)

const authLoading = useState<boolean>('waliAuthLoading', () => true)
const sessionUser = useState<any>('sessionUser', () => ({}))
const tokenUser = ref<{
  uid: string
  email: string
  role: string
  name: string
  allowedRoutes: string[]
} | null>(null)

const aclReady = ref(false)
let aclRef: ReturnType<typeof dbRef> | null = null
let profileRef: ReturnType<typeof dbRef> | null = null

const url = computed(() => new URL(route.fullPath || '/', siteUrl).toString())

useSeoMeta({
  title: siteName,
  description: siteDescription,
  ogTitle: siteName,
  ogDescription: siteDescription,
  ogType: 'website',
  ogUrl: url.value,
  ogImage: appLogo,
  twitterCard: 'summary_large_image',
  twitterSite,
  themeColor: appThemeColor,
  robots: 'index, follow'
})

useHead({
  link: [{ rel: 'canonical', href: url.value }]
})

function normalize(path: string) {
  try {
    const url = new URL(path, 'http://x')
    return url.pathname.replace(/\/+$/, '') || '/'
  } catch {
    return (path || '').replace(/\/+$/, '') || '/'
  }
}

function isProtectedRoute(path: string) {
  return path.startsWith('/wali')
}

function isAllowed(path: string, allowed: string[]) {
  const current = normalize(path)
  const list = (allowed || []).map(normalize)

  return list.some((allowedPath) => {
    if (allowedPath === '/wali') return current === '/wali'
    return current === allowedPath || current.startsWith(allowedPath + '/')
  })
}

function coerceRoutes(value: unknown) {
  if (Array.isArray(value)) return value.map(String)

  if (value && typeof value === 'object') {
    return Object.values(value)
      .filter((item) => typeof item === 'string')
      .map(String)
  }

  return []
}

function uniq(items: string[]) {
  return Array.from(new Set(items.map(normalize)))
}

const effectiveAllowedRoutes = computed(() => {
  return DEFAULT_WALI_ROUTES
})

const visibleMenu = computed(() => {
  return WALI_MENU
})

const bottomMenu = computed(() => {
  const preferred = ['/wali', '/wali/santri', '/wali/pembayaran', '/wali/pengumuman']
  const items = preferred
    .map((href) => visibleMenu.value.find((item) => normalize(item.href) === normalize(href)))
    .filter(Boolean) as WaliMenuItem[]

  return items.slice(0, 4)
})

const firstAllowedPath = computed(() => {
  if (effectiveAllowedRoutes.value.some((path) => normalize(path) === '/wali')) return '/wali'

  return visibleMenu.value[0]?.href || '/wali'
})

const currentPageTitle = computed(() => {
  const current = visibleMenu.value.find((item) => isItemActive(route.path, item.href))
  return current?.label || 'Portal Wali'
})

const mobileTopSubtitle = computed(() => {
  if (sessionUser.value?.santriName || tokenUser.value?.name) {
    return sessionUser.value?.santriName
      ? `Santri: ${sessionUser.value.santriName}`
      : `Halo, ${tokenUser.value?.name}`
  }

  return clientDisplayName
})

const userSubtitle = computed(() => {
  const santriName = sessionUser.value?.santriName
  if (santriName) return `Wali dari ${santriName}`

  return sessionUser.value?.email || tokenUser.value?.email || '-'
})

const user = computed(() => ({
  name: sessionUser.value?.name || tokenUser.value?.name || 'Wali Santri',
  email: sessionUser.value?.email || tokenUser.value?.email || '-',
  avatar: sessionUser.value?.avatar || '/assets/pp.jpg'
}))

function hasAccessTo(path: string) {
  // return isAllowed(path, effectiveAllowedRoutes.value)
  return true
}

function isItemActive(currentPath: string, href: string) {
  const current = normalize(currentPath)
  const target = normalize(href)

  if (target === '/wali') return current === '/wali'
  return current === target || current.startsWith(target + '/')
}

function desktopMenuClass(item: WaliMenuItem) {
  const active = isItemActive(route.path, item.href)

  return [
    'flex items-center justify-between rounded-[24px] px-3 py-3 transition focus:outline-none',
    active
      ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
      : 'text-neutral-300 hover:bg-white/[0.06] hover:text-white'
  ].join(' ')
}

function desktopIconClass(item: WaliMenuItem) {
  const active = isItemActive(route.path, item.href)

  return [
    'inline-flex h-10 w-10 items-center justify-center rounded-2xl transition',
    active
      ? 'bg-white/18 text-white'
      : 'bg-white/[0.05] text-neutral-400'
  ].join(' ')
}

function bottomMenuClass(item: WaliMenuItem) {
  const active = isItemActive(route.path, item.href)

  return [
    'flex min-w-0 flex-col items-center justify-center rounded-[22px] px-1 py-2 text-center transition',
    active
      ? 'text-green-700 dark:text-green-300'
      : 'text-slate-500 dark:text-neutral-400'
  ].join(' ')
}

function bottomIconClass(item: WaliMenuItem) {
  const active = isItemActive(route.path, item.href)

  return [
    'grid h-10 w-10 place-items-center rounded-[18px] transition',
    active
      ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
      : 'bg-slate-100 text-slate-500 dark:bg-neutral-800 dark:text-neutral-400'
  ].join(' ')
}

function mobileSheetMenuClass(item: WaliMenuItem) {
  const active = isItemActive(route.path, item.href)

  return [
    'flex min-w-0 flex-col items-center rounded-[22px] p-3 text-center transition',
    active
      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
      : 'text-slate-600 hover:bg-slate-50 dark:text-neutral-300 dark:hover:bg-neutral-800'
  ].join(' ')
}

function mobileSheetIconClass(item: WaliMenuItem) {
  const active = isItemActive(route.path, item.href)

  return [
    'grid h-11 w-11 place-items-center rounded-[18px]',
    active
      ? 'bg-green-600 text-white shadow-lg shadow-green-500/25'
      : 'bg-slate-100 text-slate-500 dark:bg-neutral-800 dark:text-neutral-400'
  ].join(' ')
}

async function deriveKey(pass: string, salt: string) {
  const enc = new TextEncoder()

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(pass),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: ITER,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

function fromB64(b64: string) {
  return Uint8Array.from(atob(b64), (char) => char.charCodeAt(0)).buffer
}

function isLikelyEncryptedToken(raw: string) {
  try {
    const parsed = JSON.parse(raw)
    return Boolean(parsed && typeof parsed === 'object' && parsed.iv && parsed.ct)
  } catch {
    return false
  }
}

async function decryptJSON(serialized: string) {
  const obj = JSON.parse(serialized)
  const key = await deriveKey(PASSPHRASE, SALT)
  const iv = new Uint8Array(fromB64(obj.iv))

  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    fromB64(obj.ct)
  )

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

function looksLikeEmail(value?: string) {
  return Boolean(value && value.includes('@') && !/^\s*-\s*$/.test(value))
}

function primaryContactFromSession(session?: PlainSession | null) {
  if (!session) return '-'
  if (looksLikeEmail(session.email)) return String(session.email)

  return String(session.phone || session.waliPhone || '-')
}

function applyProfile(uid: string, value: any) {
  const nextName =
    value?.displayName ||
    value?.waliName ||
    value?.name ||
    sessionUser.value?.name ||
    tokenUser.value?.name ||
    'Wali Santri'

  const nextEmail =
    value?.email ||
    sessionUser.value?.email ||
    tokenUser.value?.email ||
    '-'

  const nextAvatar =
    value?.avatar ||
    sessionUser.value?.avatar ||
    '/assets/pp.jpg'

  const profileSantriIds = Array.isArray(value?.santriIds)
    ? value.santriIds.map(String).filter(Boolean)
    : []

  sessionUser.value = {
    ...(sessionUser.value || {}),
    uid,
    name: nextName,
    email: nextEmail,
    avatar: nextAvatar,
    santriId: value?.santriId || profileSantriIds[0] || sessionUser.value?.santriId || null,
    santriIds: profileSantriIds.length
      ? profileSantriIds
      : sessionUser.value?.santriIds || (value?.santriId ? [String(value.santriId)] : []),
    santriName: value?.santriName || sessionUser.value?.santriName || null,
    waliPhone: value?.phone || value?.nohp || value?.waliPhone || sessionUser.value?.waliPhone || null
  }

  if (tokenUser.value) {
    tokenUser.value = {
      ...tokenUser.value,
      name: nextName,
      email: nextEmail
    }
  }
}

async function startProfileWatcher(uid?: string | null) {
  if (!uid || !$realtimeDb) return

  try {
    if (profileRef) off(profileRef)
  } catch {}

  profileRef = dbRef($realtimeDb, `${userPath}/${uid}`)

  try {
    const snap = await get(profileRef)
    if (snap.exists()) applyProfile(uid, snap.val())
  } catch {}

  onValue(profileRef, (snap) => {
    applyProfile(uid, snap.val() || {})
  })
}

function applyAllowedRoutes(uid: string, routesRaw: unknown) {
  const coerced = uniq(coerceRoutes(routesRaw))

  const prev = tokenUser.value || {
    uid,
    email: $auth?.currentUser?.email || '-',
    name: $auth?.currentUser?.displayName || 'Wali Santri',
    role: 'wali',
    allowedRoutes: []
  }

  tokenUser.value = {
    ...prev,
    uid,
    role: 'wali',
    allowedRoutes: coerced.length ? coerced : DEFAULT_WALI_ROUTES
  }

  aclReady.value = true
  enforceRouteAccess(route.path)
}

async function startAclWatcher(uidHint?: string | null) {
  let uid = uidHint || $auth?.currentUser?.uid || null

  if (!uid && $auth) {
    await new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(
        $auth,
        (user) => {
          uid = user?.uid || null
          unsubscribe()
          resolve()
        },
        () => resolve()
      )
    })
  }

  if (!uid || !$realtimeDb) {
    aclReady.value = true
    return
  }

  aclRef = dbRef($realtimeDb, `${userPath}/${uid}/allowedRoutes`)

  try {
    const snap = await get(aclRef)

    if (snap.exists()) {
      applyAllowedRoutes(uid, snap.val())
    } else {
      applyAllowedRoutes(uid, DEFAULT_WALI_ROUTES)
    }
  } catch {
    applyAllowedRoutes(uid, DEFAULT_WALI_ROUTES)
  }

  onValue(aclRef, (snap) => {
    applyAllowedRoutes(uid!, snap.val() || DEFAULT_WALI_ROUTES)
  })
}

function enforceRouteAccess(path: string) {
  if (!isProtectedRoute(path)) return

  if (!tokenUser.value) {
    if (normalize(path) !== '/waliLogin') {
      router.replace('/waliLogin')
    }
  }
}

function handleNavClick(to: string, event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()

  if (!to || normalize(to) === normalize(route.path)) return

  mobileMenuOpen.value = false
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
    if ($auth) await signOut($auth)
  } catch {}

  localStorage.removeItem(AUTH_KEY)
  sessionStorage.removeItem(AUTH_KEY)

  tokenUser.value = null
  sessionUser.value = {}
  logoutOpen.value = false

  router.replace('/waliLogin')
}

function handleWindowClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null

  if (!target) return

  if (!target.closest('[aria-label="Account menu"]')) {
    accountOpen.value = false
  }
}

onMounted(async () => {
  try {
    const session = await readAuthToken()

    if (!session) throw new Error('no token')

    const now = Math.floor(Date.now() / 1000)

    if (!session.exp || now >= session.exp) throw new Error('expired')

    const uid = session.uid || session.sub || ''
    const role = 'wali'
    const name = session.name || session.waliName || session.santriName || 'Wali Santri'
    const contact = primaryContactFromSession(session)

    tokenUser.value = {
      uid,
      email: contact,
      role,
      name,
      allowedRoutes: Array.isArray(session.allowedRoutes) ? session.allowedRoutes : DEFAULT_WALI_ROUTES
    }

    sessionUser.value = {
      ...(sessionUser.value || {}),
      uid,
      name,
      email: contact,
      santriId: session.santriId || null,
      santriName: session.santriName || null,
      waliPhone: session.phone || session.waliPhone || null,
      avatar: sessionUser.value?.avatar || '/assets/pp.jpg',
      santriIds: Array.isArray(session.santriId)
      ? session.santriId.map(String).filter(Boolean)
      : session.santriId
        ? [String(session.santriId)]
        : [],
    }

    await nextTick()

    if (uid) {
      // await startAclWatcher(uid)
      await startProfileWatcher(uid)
    // } else {
      // applyAllowedRoutes(uid, tokenUser.value?.allowedRoutes || DEFAULT_WALI_ROUTES)
    }

    if (['/', '/login', '/cakAdmin', '/waliLogin'].includes(normalize(route.path))) {
      router.replace(firstAllowedPath.value || '/wali')
    } else {
      enforceRouteAccess(route.path)
    }
  } catch {
    localStorage.removeItem(AUTH_KEY)
    sessionStorage.removeItem(AUTH_KEY)
    aclReady.value = true

    if (route.path.startsWith('/wali')) {
      router.replace('/waliLogin')
    }
  } finally {
    authLoading.value = false
  }

  window.addEventListener('click', handleWindowClick)
})

watch(
  () => route.fullPath,
  () => {
    accountOpen.value = false
    mobileMenuOpen.value = false
    notificationOpen.value = false
    enforceRouteAccess(route.path)
  }
)

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
