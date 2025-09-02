<template>
  <div class="text-gray-800 dark:text-neutral-400">
    <header class="fixed top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-48 lg:z-61 w-full bg-zinc-100 text-sm py-2.5 dark:bg-neutral-900">
      <nav class="px-4 sm:px-5.5 flex basis-full items-center w-full mx-auto">
        <div class="w-full flex items-center gap-x-1.5">
          <ul class="flex items-center gap-1.5">
            <li class="inline-flex items-center relative text-gray-200 pe-1.5 last:pe-0 last:after:hidden after:absolute after:top-1/2 after:end-0 after:inline-block after:w-px after:h-3.5 after:bg-gray-300 after:rounded-full after:-translate-y-1/2 after:rotate-12 dark:text-neutral-200 dark:after:bg-neutral-700">
              <a class="shrink-0 inline-flex justify-center items-center size-8 rounded-md text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80" href="#" aria-label="Brand">
                <img src="/logo.png" alt="Logo AlBerr">
                <Icon icon="mdi:hexagon-multiple" class="text-white text-[20px]" />
              </a>

              <button
                type="button"
                class="ms-1.5 p-1.5 size-7.5 inline-flex items-center gap-x-1 text-xs rounded-md border border-transparent text-gray-500 hover:text-gray-800 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
                aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-pro-sidebar" data-hs-overlay="#hs-pro-sidebar"
              >
                <Icon icon="lucide:panel-left" class="size-3.5" />
                <span class="sr-only">Sidebar Toggle</span>
              </button>
            </li>
          </ul>

          <ul class="flex flex-row items-center gap-x-3 ms-auto">
            <button type="button" class="py-2 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-bray-200 text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" @click="rightOpen = !rightOpen">
                <Icon icon="iconamoon:notification-light" width="16" height="16" />
            </button>

            <li class="inline-flex items-center gap-1.5 relative text-gray-500 pe-3 last:pe-0 last:after:hidden after:absolute after:top-1/2 after:end-0 after:inline-block after:w-px after:h-3.5 after:bg-gray-300 after:rounded-full after:-translate-y-1/2 after:rotate-12 dark:text-neutral-200 dark:after:bg-neutral-700">
              <div class="h-8">
                <div class="hs-dropdown inline-flex [--strategy:absolute] [--auto-close:inside] [--placement:bottom-right] relative text-start">
                  <button id="acct-btn" type="button" class="p-0.5 inline-flex shrink-0 items-center gap-x-3 text-start rounded-full hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 dark:focus:bg-neutral-800 dark:focus:text-neutral-200 dark:text-neutral-500" aria-haspopup="menu" aria-expanded="false" aria-label="Account menu">
                    <img class="shrink-0 size-7 rounded-full" :src="user.avatar" alt="Avatar">
                  </button>
                  <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-60 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white border border-gray-200 rounded-xl shadow-xl dark:bg-neutral-900 dark:border-neutral-700" role="menu" aria-orientation="vertical" aria-labelledby="acct-btn">
                    <div class="py-2 px-3.5">
                      <span class="font-medium text-gray-800 dark:text-neutral-300">{{ user.name }}</span>
                      <p class="text-sm text-gray-500 dark:text-neutral-500">{{ user.email }}</p>
                    </div>
                    <div class="px-4 py-2 border-t border-gray-200 dark:border-neutral-800">
                      <div class="flex flex-wrap justify-between items-center gap-2">
                        <span class="flex-1 cursor-pointer text-sm text-gray-600 dark:text-neutral-400">Theme</span>
                        <div class="p-0.5 inline-flex cursor-pointer bg-gray-100 rounded-full dark:bg-neutral-800">
                          <button type="button" class="size-7 flex justify-center items-center bg-white shadow-sm text-gray-800 rounded-full dark:text-neutral-200 hs-auto-mode-active:bg-transparent hs-auto-mode-active:shadow-none hs-dark-mode-active:bg-transparent hs-dark-mode-active:shadow-none" data-hs-theme-click-value="default">
                            <Icon icon="lucide:sun" class="size-4" />
                            <span class="sr-only">Default (Light)</span>
                          </button>
                          <button type="button" class="size-7 flex justify-center items-center text-gray-800 rounded-full dark:text-neutral-200 hs-dark-mode-active:bg-white hs-dark-mode-active:shadow-sm hs-dark-mode-active:text-neutral-800" data-hs-theme-click-value="dark">
                            <Icon icon="lucide:moon" class="size-4" />
                            <span class="sr-only">Dark</span>
                          </button>
                          <button type="button" class="size-7 flex justify-center items-center text-gray-800 rounded-full dark:text-neutral-200 hs-auto-light-mode-active:bg-white hs-auto-dark-mode-active:bg-red-800 hs-auto-mode-active:shadow-sm" data-hs-theme-click-value="auto">
                            <Icon icon="lucide:laptop" class="size-4" />
                            <span class="sr-only">Auto (System)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="p-1 border-t border-gray-200 dark:border-neutral-800">
                      <a v-for="item in accountMenu" :href="item.href" :key="item.label" class="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
                        <Icon :icon="item.icon" class="size-4" />
                        {{ item.label }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <div id="hs-pro-sidebar" class="hs-overlay [--body-scroll:true] lg:[--overlay-backdrop:false] [--is-layout-affect:true] [--opened:lg] [--auto-close:lg] hs-overlay-open:translate-x-0 lg:hs-overlay-layout-open:translate-x-0 -translate-x-full transition-all duration-300 transform w-60 hidden fixed inset-y-0 z-60 start-0 bg-zinc-100 lg:block lg:-translate-x-full lg:end-auto lg:bottom-0 dark:bg-neutral-900" role="dialog" tabindex="-1" aria-label="Sidebar">
      <div class="lg:pt-13 relative flex flex-col h-full max-h-full">
        <nav class="p-3 size-full flex flex-col overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
          <div class="lg:hidden mb-2 flex items-center justify-between">
            <button type="button" class="flex items-center gap-x-1.5 py-2 px-2.5 font-medium text-xs bg-black text-white rounded-lg focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none dark:bg-white dark:text-black">
              <Icon icon="lucide:sparkles" class="size-4" />
              Ask AI
            </button>
            <button type="button" class="p-1.5 size-7.5 inline-flex items-center gap-x-1 text-xs rounded-md text-gray-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden dark:text-neutral-500" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-pro-sidebar" data-hs-overlay="#hs-pro-sidebar">
              <Icon icon="lucide:x" class="size-3.5" />
              <span class="sr-only">Sidebar Toggle</span>
            </button>
          </div>
          <button type="button" class="p-1.5 ps-2.5 w-full inline-flex items-center gap-x-2 text-sm rounded-lg bg-white border border-gray-200 text-gray-600 shadow-xs hover:border-gray-300 focus:outline-hidden focus:border-gray-300 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-600 dark:focus:border-neutral-600" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-pro-cmsssm" data-hs-overlay="#hs-pro-cmsssm">
            Search
            <span class="ms-auto flex items-center gap-x-1 py-px px-1.5 border border-gray-200 rounded-md dark:border-neutral-700">
              <Icon icon="lucide:command" class="size-2.5" />
              <span class="text-[11px] uppercase">K</span>
            </span>
          </button>
          <div v-for="group in sidebarGroups" :key="group.title" class="pt-3 mt-3 flex flex-col border-t border-gray-200 first:border-t-0 first:pt-0 first:mt-0 dark:border-neutral-700">
            <span class="block ps-2.5 mb-2 font-medium text-xs uppercase text-gray-500 dark:text-neutral-500">
              {{ group.title }}
            </span>
            <ul class="flex flex-col gap-y-1">
              <li v-for="item in group.items" :key="item.label">
                <NuxtLink class="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm rounded-lg focus:outline-hidden" :to="item.href" :class="menuClass(item)">
                  <Icon v-if="item.icon" :icon="item.icon" class="size-4" />
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>

    <main class="lg:hs-overlay-layout-open:ps-60 bg-gray-100 transition-all duration-300 lg:fixed lg:inset-0 pt-13 px-3 pb-3 dark:bg-neutral-900">
      <div class="h-[calc(100dvh-62px)] lg:h-full overflow-hidden flex flex-col bg-white border border-gray-200 shadow-xs rounded-lg dark:bg-neutral-800 dark:border-neutral-700">
        <div class="flex-1 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:w-0">
          <div class="flex-1 flex flex-col lg:flex-row">
            <div class="flex-1 min-w-0 flex flex-col border-e border-gray-200 dark:border-neutral-700">
              <slot />
            </div>
            <div v-show="rightOpen" class="z-[70] fixed inset-y-0 top-12 right-0">
              <div class="absolute inset-0 bg-black/40 backdrop-blur-[1px] lg:hidden" @click="rightOpen = false"></div>
              <aside class="relative h-dvh w-80 bg-white dark:bg-neutral-800 border-l border-gray-200 dark:border-neutral-700 shadow-xl">
                <div class="flex items-center justify-between p-3 border-b border-gray-200 dark:border-neutral-700 lg:hidden">
                  <span class="font-medium text-gray-800 dark:text-neutral-200">Notifikasi</span>
                  <button type="button" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700" @click="rightOpen = false" aria-label="Tutup Notifikasi">
                    <Icon icon="lucide:x" class="size-4" />
                  </button>
                </div>
                <div class="h-[100vh] overflow-y-auto">
                  <WidgetNotificationView />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const AUTH_KEY = 'alberr:auth'

const PASSPHRASE = 'alberr-admin-secret'
const SALT       = 'alberr-static-salt'
const ITER       = 120_000
const IV_BYTES   = 12

const url = computed(() => new URL(route.fullPath || '/', config.public.siteUrl).toString())
const titlePage = 'Ponpes Alberr | Pesantren Inovatif & Informatif'
const description = 'Selamat datang di Ponpes Alberr Pandaan: KMI/Diniyah, Tahfidz, MTs/MA, kegiatan santri, dan PPDB online.'

useSeoMeta({
  title: titlePage,
  description: description,
  ogTitle: titlePage,
  ogDescription: description,
  ogType: 'website',
  ogUrl: url.value,
  ogImage: 'logo.png',
  twitterCard: 'summary_large_image',
  twitterSite: config.public.twitterSite || undefined,
  themeColor: '#0ea5e9',
  robots: 'index, follow'
})

useHead({
  link: [{ rel: 'canonical', href: url.value }],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: config.public.siteName,
        url: config.public.siteUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${config.public.siteUrl}/search?q={query}`,
          'query-input': 'required name=query'
        }
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Pondok Pesantren Alberr',
        url: config.public.siteUrl,
        logo: `${config.public.siteUrl}/logo.png`,
        sameAs: [
          'https://facebook.com/alberr',
          'https://instagram.com/alberr'
        ]
      })
    }
  ]
})

const props = defineProps<{
  title?: string
  darkMode?: boolean
}>()

const rightOpen = ref(false)

const accountMenu = ref([
  { label: 'Profile',  icon: 'lucide:user', href: '/app/profile' },
  { label: 'Settings', icon: 'lucide:settings-2', href: '/app/setting' },
  { label: 'Log out',  icon: 'lucide:log-out', href: '/cakAdmin' },
])

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
function fromB64(b64: string) { return Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer }

async function decryptJSON(serialized: string) {
  const obj = JSON.parse(serialized)
  const key = await deriveKey(PASSPHRASE, SALT)
  const iv = new Uint8Array(fromB64(obj.iv))
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, fromB64(obj.ct))
  return JSON.parse(new TextDecoder().decode(plain))
}

const currentUser = ref<{ email: string; role: string } | null>(null)

function menuClass(item: any) {
  if(item.label == props.title) return 'bg-blue-600 text-white hover:bg-blue-700'
  else return 'text-gray-800 hover:bg-gray-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 dark:text-neutral-200'
}

const user = ref({
  name: 'Cak Admin',
  email: 'admin@alberr.sch.id',
  avatar: '/assets/pp.jpg'
})

const sidebarGroups = ref([
  {
    title: 'Beranda',
    items: [
      { label: 'Dashboard', href: '/app', icon: 'lucide:layout-dashboard' },
      { label: 'Berita Informasi', href: '/app/news', icon: 'hugeicons:news' },
      { label: 'Pengumuman', href: '/app/announcement', icon: 'lucide:info' },
      { label: 'Agenda', href: '/app/agenda', icon: 'solar:calendar-line-duotone' },
    ]
  },
  {
    title: 'Kesantrian',
    items: [
      { label: 'Santri',     href: '/app/santri',          icon: 'lucide:users' },
      { label: 'Maskan Kamar',href: '/app/maskan',         icon: 'lucide:bed' },
      { label: 'Kelas',     href: '/app/class',         icon: 'streamline:class-lesson' },
      { label: 'Wali Santri',href: '/app/wali',            icon: 'lucide:user-round' },
    ]
  },
  {
    title: 'Rutinitas',
    items: [
      { label: 'Absensi Harian', href: '/app/absen', icon: 'hugeicons:note-03' },
      { label: 'Kunjungan',      href: '/app/kunjungan', icon: 'material-symbols:parent-child-dining-outline-rounded' },
      { label: 'Jadwal Piket',     href: '/app/picket',          icon: 'lucide:calendar-days' },
      { label: 'Registrasi RFID', href: '/app/setting-rfid',  icon: 'ri:rfid-fill' },
    ]
  },
  {
    title: 'Keamanan & Ketertiban',
    items: [
      { label: 'Pelanggaran', href: '/app/faults', icon: 'mingcute:fault-line' },
      { label: 'Perizinan',      href: '/app/izin', icon: 'solar:letter-linear' },
    ]
  },
  {
    title: 'Pengaturan',
    items: [
      { label: 'Profil', href: '/app/profile',  icon: 'iconamoon:profile' },
      { label: 'Website', href: '/app/web',  icon: 'icon-park-outline:web-page' },
    ]
  }
])

onMounted(async() => {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) throw new Error('no token')
    const data = await decryptJSON(raw)
    const now = Math.floor(Date.now() / 1000)
    if (!data?.exp || now >= data.exp) throw new Error('expired')
    currentUser.value = { email: data.email, role: data.role }
    if (route.path === '/' || route.path === '/login') {
      router.replace('/app')
    }
  } catch (e) {
    localStorage.removeItem(AUTH_KEY)
    if (!route.path.startsWith('/auth') && route.path !== '/' && route.path !== '/login') {
      router.replace('/');
    }
  }
  const mql = window.matchMedia('(min-width: 1024px)')
  const applyLock = () => {
    const isDesktop = mql.matches
    if (rightOpen.value && !isDesktop) {
      document.documentElement.classList.add('overflow-hidden')
    } else {
      document.documentElement.classList.remove('overflow-hidden')
    }
  }
  applyLock()

  const onChange = () => applyLock()
  const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') rightOpen.value = false }

  mql.addEventListener('change', onChange)
  window.addEventListener('keydown', onEsc)

  const stopWatch = watch(rightOpen, applyLock)

  onBeforeUnmount(() => {
    mql.removeEventListener('change', onChange)
    window.removeEventListener('keydown', onEsc)
    stopWatch()
    document.documentElement.classList.remove('overflow-hidden')
  })
})

watch(() => route.fullPath, () => { rightOpen.value = false })

</script>

<style scoped>
.size-7-5 { width: 1.875rem; height: 1.875rem; }
.size-8 { width: 2rem; height: 2rem; }
.size-6 { width: 1.5rem; height: 1.5rem; }
.size-5 { width: 1.25rem; height: 1.25rem; }
.size-4 { width: 1rem; height: 1rem; }
.size-3-5 { width: 0.875rem; height: 0.875rem; }
</style>
