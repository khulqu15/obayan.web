<template>
  <div class="min-h-dvh bg-neutral-100 text-neutral-900">
    <!-- Desktop Sidebar -->
    <aside
      class="fixed inset-y-0 start-0 z-50 hidden border-e border-neutral-200 bg-white transition-all duration-300 lg:flex lg:flex-col"
      :class="desktopSidebarCollapsed ? 'lg:w-20' : 'lg:w-72'"
    >
      <!-- Brand -->
      <div class="flex h-16 items-center gap-3 border-b border-neutral-200 px-4">
        <NuxtLink
          to="/app"
          class="flex min-w-0 flex-1 items-center gap-3"
        >
          <div class="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-2xl text-white shadow-sm">
            <img
              v-if="appLogo && !logoError"
              :src="appLogo"
              :alt="appName"
              class="h-7 w-7 rounded-xl object-contain"
              @error="logoError = true"
            >
            <Icon
              v-else
              icon="solar:widget-5-bold-duotone"
              class="h-6 w-6"
            />
          </div>

          <div
            v-if="!desktopSidebarCollapsed"
            class="min-w-0"
          >
            <p class="truncate text-sm font-black text-neutral-950">
              {{ appName }}
            </p>
            <p class="truncate text-xs font-semibold text-neutral-500">
              {{ appSubtitle }}
            </p>
          </div>
        </NuxtLink>

        <button
          type="button"
          class="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
          @click="desktopSidebarCollapsed = !desktopSidebarCollapsed"
        >
          <Icon
            :icon="desktopSidebarCollapsed ? 'solar:sidebar-minimalistic-bold-duotone' : 'solar:sidebar-code-bold-duotone'"
            class="h-5 w-5"
          />
        </button>
      </div>

      <!-- Search -->
      <div class="border-b border-neutral-200 p-3">
        <button
          type="button"
          class="flex w-full items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm font-semibold text-neutral-500 transition hover:border-neutral-300 hover:bg-white"
          :class="desktopSidebarCollapsed ? 'justify-center px-2' : ''"
        >
          <Icon icon="solar:magnifer-linear" class="h-5 w-5 shrink-0" />

          <span
            v-if="!desktopSidebarCollapsed"
            class="truncate"
          >
            Search menu
          </span>

          <span
            v-if="!desktopSidebarCollapsed"
            class="ms-auto rounded-lg border border-neutral-200 bg-white px-1.5 py-0.5 text-[10px] font-black text-neutral-400"
          >
            ⌘K
          </span>
        </button>
      </div>

      <!-- Desktop Menu -->
      <nav class="min-h-0 flex-1 overflow-y-auto p-3 scrollbar-thin-neutral">
        <div
          v-for="group in sidebarGroups"
          :key="group.title"
          class="mb-5 last:mb-0"
        >
          <p
            v-if="!desktopSidebarCollapsed"
            class="mb-2 px-2 text-[11px] font-black uppercase tracking-[0.16em] text-neutral-400"
          >
            {{ group.title }}
          </p>

          <ul class="space-y-1">
            <li
              v-for="item in group.items"
              :key="item.href"
            >
              <NuxtLink
                :to="item.href"
                class="group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition"
                :class="[
                  isActive(item.href)
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950',
                  desktopSidebarCollapsed ? 'justify-center px-2' : ''
                ]"
              >
                <Icon
                  :icon="item.icon"
                  class="h-5 w-5 shrink-0"
                  :class="isActive(item.href) ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-700'"
                />

                <span
                  v-if="!desktopSidebarCollapsed"
                  class="truncate"
                >
                  {{ item.label }}
                </span>

                <span
                  v-if="!desktopSidebarCollapsed && item.badge"
                  class="ms-auto rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-black text-neutral-500"
                  :class="isActive(item.href) ? 'bg-white/15 text-white' : ''"
                >
                  {{ item.badge }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Desktop Footer User -->
      <div class="border-t border-neutral-200 p-3">
        <div
          class="rounded-3xl border border-neutral-200 bg-neutral-50 p-3"
          :class="desktopSidebarCollapsed ? 'px-2' : ''"
        >
          <div
            class="flex items-center gap-3"
            :class="desktopSidebarCollapsed ? 'justify-center' : ''"
          >
            <img
              :src="displayUser.avatar"
              :alt="displayUser.name"
              class="h-10 w-10 shrink-0 rounded-2xl object-cover ring-1 ring-neutral-200"
            >

            <div
              v-if="!desktopSidebarCollapsed"
              class="min-w-0 flex-1"
            >
              <p class="truncate text-sm font-black text-neutral-950">
                {{ displayUser.name }}
              </p>
              <p class="truncate text-xs font-semibold text-neutral-500">
                {{ displayUser.email }}
              </p>
            </div>
          </div>

          <button
            v-if="!desktopSidebarCollapsed"
            type="button"
            class="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-black text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-950"
            @click="handleLogout"
          >
            <Icon icon="solar:logout-3-bold-duotone" class="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>

    <!-- Top Header -->
    <header
      class="fixed inset-x-0 top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur-xl transition-all duration-300"
      :class="desktopSidebarCollapsed ? 'lg:ps-20' : 'lg:ps-72'"
    >
      <div class="flex h-16 items-center gap-3 px-4 sm:px-6">
        <!-- Mobile Brand -->
        <NuxtLink
          to="/app"
          class="flex min-w-0 items-center gap-3 lg:hidden"
        >
          <div class="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-2xl text-white shadow-sm">
            <img
              v-if="appLogo && !logoError"
              :src="appLogo"
              :alt="appName"
              class="h-7 w-7 rounded-xl object-contain"
              @error="logoError = true"
            >
            <Icon
              v-else
              icon="solar:widget-5-bold-duotone"
              class="h-6 w-6"
            />
          </div>

          <div class="min-w-0">
            <p class="truncate text-sm font-black text-neutral-950">
              {{ appName }}
            </p>
            <p class="truncate text-xs font-semibold text-neutral-500">
              {{ currentPageTitle }}
            </p>
          </div>
        </NuxtLink>

        <!-- Desktop Title -->
        <div class="hidden min-w-0 lg:block">
          <p class="text-xs font-black uppercase tracking-[0.16em] text-neutral-400">
            Workspace
          </p>
          <h1 class="truncate text-lg font-black text-neutral-950">
            {{ currentPageTitle }}
          </h1>
        </div>

        <div class="ms-auto flex items-center gap-2">
          <button
            type="button"
            class="hidden items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-bold text-neutral-600 transition hover:border-neutral-300 hover:bg-white hover:text-neutral-950 sm:inline-flex"
          >
            <Icon icon="solar:magnifer-linear" class="h-5 w-5" />
            <span class="hidden md:inline">Search</span>
          </button>

          <button
            type="button"
            class="relative grid h-10 w-10 place-items-center rounded-2xl border border-neutral-200 bg-neutral-50 text-neutral-600 transition hover:border-neutral-300 hover:bg-white hover:text-neutral-950"
            @click="rightOpen = true"
          >
            <Icon icon="solar:bell-bing-bold-duotone" class="h-5 w-5" />
            <span class="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          <!-- Account Dropdown -->
          <div class="relative">
            <button
              type="button"
              class="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-1.5 pe-3 transition hover:border-neutral-300 hover:bg-white"
              @click="accountOpen = !accountOpen"
            >
              <img
                :src="displayUser.avatar"
                :alt="displayUser.name"
                class="h-8 w-8 rounded-xl object-cover"
              >

              <span class="hidden max-w-28 truncate text-sm font-black text-neutral-700 sm:inline">
                {{ displayUser.name }}
              </span>

              <Icon
                icon="solar:alt-arrow-down-linear"
                class="hidden h-4 w-4 text-neutral-400 sm:block"
              />
            </button>

            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="translate-y-1 opacity-0"
              enter-to-class="translate-y-0 opacity-100"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="translate-y-0 opacity-100"
              leave-to-class="translate-y-1 opacity-0"
            >
              <div
                v-if="accountOpen"
                class="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.14)]"
              >
                <div class="p-4">
                  <div class="flex items-center gap-3">
                    <img
                      :src="displayUser.avatar"
                      :alt="displayUser.name"
                      class="h-12 w-12 rounded-2xl object-cover"
                    >

                    <div class="min-w-0">
                      <p class="truncate text-sm font-black text-neutral-950">
                        {{ displayUser.name }}
                      </p>
                      <p class="truncate text-xs font-semibold text-neutral-500">
                        {{ displayUser.email }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="border-t border-neutral-100 p-2">
                  <NuxtLink
                    v-for="item in accountLinks"
                    :key="item.href"
                    :to="item.href"
                    class="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950"
                    @click="accountOpen = false"
                  >
                    <Icon :icon="item.icon" class="h-5 w-5 text-neutral-400" />
                    {{ item.label }}
                  </NuxtLink>

                  <button
                    type="button"
                    class="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
                    @click="handleLogout"
                  >
                    <Icon icon="solar:logout-3-bold-duotone" class="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </header>

    <!-- Page Content -->
    <main
      class="min-h-dvh pt-16 transition-all duration-300 lg:pb-0"
      :class="[
        desktopSidebarCollapsed ? 'lg:ps-20' : 'lg:ps-72',
        'pb-24'
      ]"
    >
      <div class="p-3 sm:p-4 lg:p-5">
        <div class="min-h-[calc(100dvh-5.75rem)] overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white shadow-sm">
          <div class="min-h-[calc(100dvh-5.75rem)]">
            <slot />
          </div>
        </div>
      </div>
    </main>

    <!-- Notification Panel -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-full opacity-0"
    >
      <div
        v-if="rightOpen"
        class="fixed inset-0 z-[80]"
      >
        <div
          class="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px]"
          @click="rightOpen = false"
        ></div>

        <aside class="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-neutral-200 bg-white shadow-2xl">
          <div class="flex h-16 items-center justify-between border-b border-neutral-200 px-4">
            <div>
              <p class="text-sm font-black text-neutral-950">
                Notifikasi
              </p>
              <p class="text-xs font-semibold text-neutral-500">
                Aktivitas terbaru dashboard
              </p>
            </div>

            <button
              type="button"
              class="grid h-10 w-10 place-items-center rounded-2xl text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
              @click="rightOpen = false"
            >
              <Icon icon="solar:close-circle-bold-duotone" class="h-6 w-6" />
            </button>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto">
            <WidgetNotificationView />
          </div>
        </aside>
      </div>
    </Transition>

    <!-- Mobile Bottom Dock -->
    <nav
      class="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-16px_50px_rgba(15,23,42,0.10)] backdrop-blur-xl lg:hidden"
      @touchstart.passive="onDockTouchStart"
      @touchend.passive="onDockTouchEnd"
    >
      <div class="mx-auto mb-2 h-1.5 w-12 rounded-full bg-neutral-200"></div>

      <div class="mx-auto grid max-w-md grid-cols-5 gap-1">
        <NuxtLink
          v-for="item in mobileDockItems"
          :key="item.href"
          :to="item.href"
          class="flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-black transition"
          :class="isActive(item.href)
            ? 'bg-neutral-900 text-white'
            : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950'"
        >
          <Icon :icon="item.icon" class="h-5 w-5" />
          <span class="truncate">
            {{ item.label }}
          </span>
        </NuxtLink>

        <button
          type="button"
          class="flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-black text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
          @click="openMobileMenu"
        >
          <Icon icon="solar:hamburger-menu-bold-duotone" class="h-5 w-5" />
          <span>Menu</span>
        </button>
      </div>
    </nav>

    <!-- Mobile Menu Bottom Sheet -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 z-[90] lg:hidden"
      >
        <div
          class="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px]"
          @click="closeMobileMenu"
        ></div>

        <section
          class="absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-hidden rounded-t-[2rem] border-t border-neutral-200 bg-white shadow-[0_-24px_80px_rgba(15,23,42,0.22)]"
          :style="mobileSheetStyle"
          @touchstart.passive="onSheetTouchStart"
          @touchmove.passive="onSheetTouchMove"
          @touchend.passive="onSheetTouchEnd"
        >
          <div class="sticky top-0 z-10 border-b border-neutral-200 bg-white/95 px-4 pb-3 pt-3 backdrop-blur-xl">
            <div class="mx-auto mb-3 h-1.5 w-14 rounded-full bg-neutral-200"></div>

            <div class="flex items-center justify-between gap-3">
              <div class="flex min-w-0 items-center gap-3">
                <div class="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-neutral-900 text-white">
                  <img
                    v-if="appLogo && !logoError"
                    :src="appLogo"
                    :alt="appName"
                    class="h-8 w-8 rounded-xl object-contain"
                    @error="logoError = true"
                  >
                  <Icon
                    v-else
                    icon="solar:widget-5-bold-duotone"
                    class="h-6 w-6"
                  />
                </div>

                <div class="min-w-0">
                  <p class="truncate text-sm font-black text-neutral-950">
                    {{ appName }}
                  </p>
                  <p class="truncate text-xs font-semibold text-neutral-500">
                    Swipe down untuk menutup
                  </p>
                </div>
              </div>

              <button
                type="button"
                class="grid h-10 w-10 place-items-center rounded-2xl text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
                @click="closeMobileMenu"
              >
                <Icon icon="solar:close-circle-bold-duotone" class="h-6 w-6" />
              </button>
            </div>
          </div>

          <div class="max-h-[calc(88dvh-5.5rem)] overflow-y-auto px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
            <div class="mb-4 rounded-3xl border border-neutral-200 bg-neutral-50 p-4">
              <div class="flex items-center gap-3">
                <img
                  :src="displayUser.avatar"
                  :alt="displayUser.name"
                  class="h-12 w-12 rounded-2xl object-cover ring-1 ring-neutral-200"
                >

                <div class="min-w-0">
                  <p class="truncate text-sm font-black text-neutral-950">
                    {{ displayUser.name }}
                  </p>
                  <p class="truncate text-xs font-semibold text-neutral-500">
                    {{ displayUser.email }}
                  </p>
                </div>
              </div>
            </div>

            <div
              v-for="group in sidebarGroups"
              :key="group.title"
              class="mb-5 last:mb-0"
            >
              <p class="mb-2 px-1 text-[11px] font-black uppercase tracking-[0.16em] text-neutral-400">
                {{ group.title }}
              </p>

              <div class="grid grid-cols-2 gap-2">
                <NuxtLink
                  v-for="item in group.items"
                  :key="item.href"
                  :to="item.href"
                  class="rounded-3xl border p-4 transition"
                  :class="isActive(item.href)
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50'"
                  @click="closeMobileMenu"
                >
                  <div
                    class="grid h-11 w-11 place-items-center rounded-2xl"
                    :class="isActive(item.href)
                      ? 'bg-white/15 text-white'
                      : 'bg-neutral-100 text-neutral-500'"
                  >
                    <Icon :icon="item.icon" class="h-5 w-5" />
                  </div>

                  <p class="mt-3 truncate text-sm font-black">
                    {{ item.label }}
                  </p>
                  <p
                    class="mt-1 line-clamp-2 text-xs font-semibold leading-5"
                    :class="isActive(item.href) ? 'text-white/70' : 'text-neutral-400'"
                  >
                    {{ item.description || 'Buka menu dashboard' }}
                  </p>
                </NuxtLink>
              </div>
            </div>

            <button
              type="button"
              class="mt-2 flex w-full items-center justify-center gap-2 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-black text-red-600"
              @click="handleLogout"
            >
              <Icon icon="solar:logout-3-bold-duotone" class="h-5 w-5" />
              Logout
            </button>
          </div>
        </section>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  navigateTo,
  useHead,
  useRoute,
  useRuntimeConfig,
  useSeoMeta
} from 'nuxt/app'
import { useAuth } from '../composables/data/useAuth'

type SidebarItem = {
  label: string
  href: string
  icon: string
  badge?: string
  description?: string
}

type SidebarGroup = {
  title: string
  items: SidebarItem[]
}

const route = useRoute()
const config = useRuntimeConfig()

const {
  user: authUser,
  fetchMe,
  logout
} = useAuth()

const rightOpen = ref(false)
const accountOpen = ref(false)
const mobileMenuOpen = ref(false)
const desktopSidebarCollapsed = ref(false)
const logoError = ref(false)

const dockTouchStartY = ref(0)
const sheetTouchStartY = ref(0)
const sheetDragY = ref(0)

const appName = computed(() => {
  return String(
    config.public.appName ||
    config.public.siteName ||
    config.public.clientDisplayName ||
    'Obayan'
  )
})

const appSubtitle = computed(() => {
  return String(
    config.public.appSubtitle ||
    config.public.clientName ||
    'Dashboard'
  )
})

const appLogo = computed(() => {
  return normalizeAssetUrl(
    String(
      config.public.appLogo ||
      config.public.logo ||
      '/logo.png'
    )
  )
})

const siteUrl = computed(() => {
  return String(config.public.siteUrl || 'https://obayan.id').replace(/\/$/, '')
})

const pageUrl = computed(() => {
  return `${siteUrl.value}${route.fullPath || '/app'}`
})

const currentPageTitle = computed(() => {
  const allItems = sidebarGroups.value.flatMap((group) => group.items)
  const found = allItems.find((item) => isActive(item.href))

  return found?.label || 'Dashboard'
})

const displayUser = computed(() => {
  const current = authUser.value as any

  return {
    name:
      current?.name ||
      current?.fullName ||
      current?.email?.split('@')?.[0] ||
      'Admin',
    email:
      current?.email ||
      'admin@obayan.id',
    avatar:
      current?.avatar ||
      current?.avatarUrl ||
      current?.photoUrl ||
      '/assets/pp.jpg'
  }
})

const accountLinks = [
  {
    label: 'Profile',
    icon: 'solar:user-rounded-bold-duotone',
    href: '/app/profile'
  },
  {
    label: 'Settings',
    icon: 'solar:settings-bold-duotone',
    href: '/app/setting'
  }
]

const sidebarGroups = ref<SidebarGroup[]>([
  {
    title: 'Platform Desa',
    items: [
      {
        label: 'Home',
        href: '/app',
        icon: 'solar:home-2-bold-duotone',
        description: 'Ringkasan website desa, statistik konten, dan aktivitas terbaru.'
      },
      {
        label: 'Berita Informasi',
        href: '/app/news',
        icon: 'solar:document-text-bold-duotone',
        description: 'Kelola berita, informasi publik, agenda, dan pengumuman desa.'
      },
      {
        label: 'Organisasi',
        href: '/app/organizations',
        icon: 'solar:document-text-bold-duotone',
        description: 'Kelola berita, informasi publik, agenda, dan pengumuman desa.'
      },
      {
        label: 'Fasilitas',
        href: '/app/facilities',
        icon: 'solar:document-text-bold-duotone',
        description: 'Kelola berita, informasi publik, agenda, dan pengumuman desa.'
      },
      {
        label: 'Potensi',
        href: '/app/potentials',
        icon: 'solar:document-text-bold-duotone',
        description: 'Kelola berita, informasi publik, agenda, dan pengumuman desa.'
      },
      {
        label: 'Lembaga',
        href: '/app/institutions',
        icon: 'solar:document-text-bold-duotone',
        description: 'Kelola berita, informasi publik, agenda, dan pengumuman desa.'
      },
      {
        label: 'Keuangan',
        href: '/app/#finance',
        icon: 'solar:wallet-money-bold-duotone',
        badge: 'PRO',
        description: 'Kelola APBDes, pemasukan, pengeluaran, laporan, dan transparansi keuangan desa.'
      },
      {
        label: 'Dokumen Letter C',
        href: '/app/#letter-c',
        icon: 'solar:folder-with-files-bold-duotone',
        badge: 'PRO',
        description: 'Manajemen arsip Letter C, data tanah, riwayat kepemilikan, dan dokumen pertanahan.'
      },
      {
        label: 'Pengajuan Surat Online',
        href: '/app/#letters',
        icon: 'solar:letter-unread-bold-duotone',
        badge: 'PRO',
        description: 'Kelola pengajuan surat warga secara online, status verifikasi, dan riwayat layanan.'
      }
    ]
  },
  {
    title: 'Pengaturan',
    items: [
      {
        label: 'Profil Desa',
        href: '/app/profile',
        icon: 'solar:buildings-3-bold-duotone',
        description: 'Kelola identitas desa, logo, alamat, kontak, dan informasi pemerintah desa.'
      },
      {
        label: 'Website Desa',
        href: '/app/web',
        icon: 'solar:window-frame-bold-duotone',
        description: 'Atur tampilan website, halaman, hero, SEO, dan konten landing page desa.'
      },
      {
        label: 'Pengaturan',
        href: '/app/setting',
        icon: 'solar:settings-bold-duotone',
        description: 'Konfigurasi akun, tenant, preferensi sistem, dan akses dashboard.'
      }
    ]
  }
])

const mobileDockItems = computed(() => {
  return [
    {
      label: 'Home',
      href: '/app',
      icon: 'solar:home-2-bold-duotone'
    },
    {
      label: 'Berita',
      href: '/app/news',
      icon: 'solar:document-text-bold-duotone'
    },
    {
      label: 'Keuangan',
      href: '/app/#finance',
      icon: 'solar:wallet-money-bold-duotone',
      badge: 'PRO'
    },
    {
      label: 'Surat',
      href: '/app/#letters',
      icon: 'solar:letter-unread-bold-duotone',
      badge: 'PRO'
    }
  ]
})

const mobileSheetStyle = computed(() => {
  return {
    transform: `translateY(${sheetDragY.value}px)`,
    transition: sheetDragY.value === 0 ? 'transform 180ms ease' : 'none'
  }
})

useSeoMeta({
  title: () => `${currentPageTitle.value} · ${appName.value}`,
  description: () => `Dashboard ${appName.value}`,
  ogTitle: () => `${currentPageTitle.value} · ${appName.value}`,
  ogDescription: () => `Dashboard ${appName.value}`,
  ogType: 'website',
  ogUrl: () => pageUrl.value,
  robots: 'noindex, nofollow',
  themeColor: '#171717'
})

useHead(() => ({
  htmlAttrs: {
    lang: 'id'
  },
  link: [
    {
      rel: 'canonical',
      href: pageUrl.value
    },
    {
      rel: 'icon',
      href: appLogo.value
    },
    {
      rel: 'apple-touch-icon',
      href: appLogo.value
    }
  ],
  meta: [
    {
      name: 'theme-color',
      content: '#171717'
    }
  ]
}))

function isActive(href: string) {
  if (href === '/app') {
    return route.path === '/app'
  }

  return route.path === href || route.path.startsWith(`${href}/`)
}

function openMobileMenu() {
  sheetDragY.value = 0
  mobileMenuOpen.value = true
}

function closeMobileMenu() {
  sheetDragY.value = 0
  mobileMenuOpen.value = false
}

function onDockTouchStart(event: TouchEvent) {
  dockTouchStartY.value = event.changedTouches[0]?.clientY || 0
}

function onDockTouchEnd(event: TouchEvent) {
  const endY = event.changedTouches[0]?.clientY || 0
  const deltaY = endY - dockTouchStartY.value

  if (deltaY < -32) {
    openMobileMenu()
  }
}

function onSheetTouchStart(event: TouchEvent) {
  sheetTouchStartY.value = event.changedTouches[0]?.clientY || 0
}

function onSheetTouchMove(event: TouchEvent) {
  const currentY = event.changedTouches[0]?.clientY || 0
  const deltaY = currentY - sheetTouchStartY.value

  sheetDragY.value = Math.max(0, deltaY)
}

function onSheetTouchEnd() {
  if (sheetDragY.value > 90) {
    closeMobileMenu()
    return
  }

  sheetDragY.value = 0
}

async function handleLogout() {
  accountOpen.value = false
  rightOpen.value = false
  closeMobileMenu()

  try {
    await logout()
  } catch {
    await navigateTo('/login')
  }
}

function normalizeAssetUrl(value: string) {
  const cleanValue = String(value || '').trim()

  if (!cleanValue) return '/logo.png'
  if (/^https?:\/\//i.test(cleanValue)) return cleanValue
  if (cleanValue.startsWith('/')) return cleanValue

  return `/${cleanValue}`
}

function lockDocumentScroll() {
  if (typeof document === 'undefined') return

  if (rightOpen.value || mobileMenuOpen.value) {
    document.documentElement.classList.add('overflow-hidden')
    document.body.classList.add('overflow-hidden')
  } else {
    document.documentElement.classList.remove('overflow-hidden')
    document.body.classList.remove('overflow-hidden')
  }
}

watch(
  () => route.fullPath,
  () => {
    rightOpen.value = false
    accountOpen.value = false
    closeMobileMenu()
  }
)

watch([rightOpen, mobileMenuOpen], lockDocumentScroll)

onMounted(async () => {
  /**
   * Tidak ada force redirect di layout ini.
   * fetchMe hanya mencoba mengisi data user untuk avatar/header.
   * Kalau gagal, layout tetap tampil dan tidak diarahkan ke login/home.
   */
  try {
    await fetchMe()
  } catch {
    // intentionally empty
  }

  lockDocumentScroll()

  const onEsc = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return

    rightOpen.value = false
    accountOpen.value = false
    closeMobileMenu()
  }

  window.addEventListener('keydown', onEsc)

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onEsc)

    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('overflow-hidden')
      document.body.classList.remove('overflow-hidden')
    }
  })
})
</script>

<style scoped>
.scrollbar-thin-neutral {
  scrollbar-width: thin;
  scrollbar-color: #d4d4d4 transparent;
}

.scrollbar-thin-neutral::-webkit-scrollbar {
  width: 8px;
}

.scrollbar-thin-neutral::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin-neutral::-webkit-scrollbar-thumb {
  background: #d4d4d4;
  border-radius: 999px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>