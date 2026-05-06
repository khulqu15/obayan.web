<template>
  <header :class="[ 'fixed top-0 left-0 right-0 z-9999 transition-all duration-300 ease-out transform-gpu will-change-transform', isScrolledOrOpen ? scrolledHeaderClass : topHeaderClass ]">
    <div class="px-3 sm:px-5 lg:px-6 pt-3">
      <nav :class="[ 'relative max-w-344 mx-auto rounded-[1.75rem] border backdrop-blur-xl transition-all duration-300', navbarShellClass ]">
        <div class="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 lg:px-6">
          <a href="/" aria-label="Brand" class="group flex min-w-0 items-center gap-3 focus:outline-none" >
            <div :class="[ 'flex h-11 w-11 items-center justify-center rounded-2xl ring-1 transition-all duration-300 overflow-hidden', isLightSurface ? 'bg-white ring-green-200 shadow-lg shadow-green-200/60' : 'bg-white/14 ring-white/20 shadow-lg shadow-black/10']">
              <img :src="appLogo" class="h-7 w-7 object-contain" :alt="`Logo ${clientDisplayName}`" />
            </div>

            <div class="min-w-0">
              <span :class="[ 'hidden lg:block truncate text-[1.02rem] font-extrabold tracking-tight transition-colors', adaptiveTextClass ]">
                {{ brand }}
              </span>
              <span :class="[ 'block lg:hidden truncate text-[1rem] font-extrabold tracking-tight transition-colors', adaptiveTextClass ]">
                {{ brandShorten }}
              </span>
              <p :class="[ 'hidden sm:block text-xs font-medium transition-colors', adaptiveSubTextClass ]"> {{ brandSubtitle }} </p>
            </div>
          </a>

          <div class="hidden md:flex items-center gap-2">
            <a v-for="l in navLinks" :key="l.label" :href="l.href" :class="[desktopLinkClass]">
              {{ l.label }}
            </a>

            <div class="hs-dropdown relative inline-flex [--strategy:fixed] [--adaptive:none]">
              <button id="hs-header-program" type="button" :class="[desktopLinkClass, 'hs-dropdown-toggle gap-2']" aria-haspopup="menu" aria-expanded="false">
                Program
                <ClientOnly>
                  <Icon icon="lucide:chevron-down" :class="[ 'size-4 transition-transform duration-300', isLightSurface ? 'text-slate-500' : 'text-white/75' ]"/>
                </ClientOnly>
              </button>

              <div
                class="hs-dropdown-menu hidden opacity-0 transition-[opacity,margin] duration-200 hs-dropdown-open:opacity-100 z-20 w-[min(94vw,70rem)] rounded-[1.75rem] border border-white/60 bg-white/95 p-3 shadow-[0_20px_80px_-20px_rgba(16,185,129,0.30)] backdrop-blur-2xl dark:border-neutral-800 dark:bg-neutral-900/95 md:!fixed md:!left-1/2 md:!right-auto md:!top-[1.5rem] md:!mt-0 md:!-translate-x-1/2"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="hs-header-program"
              >
                <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <div
                    v-for="g in megaMenu.slice(0, 2)"
                    :key="g.title"
                    class="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-800/50"
                  >
                    <p class="mb-3 px-2 text-xs font-extrabold uppercase tracking-[0.18em] text-green-700 dark:text-green-400">
                      {{ g.title }}
                    </p>

                    <button
                      v-for="it in g.items"
                      :key="it.label"
                      type="button"
                      @click.prevent="openMega(it)"
                      class="group flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-white hover:shadow-sm dark:hover:bg-neutral-700/60"
                    >
                      <div class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-green-500 text-white shadow-sm">
                        <ClientOnly>
                          <Icon :icon="it.icon || 'ph:book-open-text'" class="size-5" />
                        </ClientOnly>
                      </div>
                      <div class="min-w-0">
                        <p class="truncate text-sm font-bold text-slate-900 dark:text-neutral-100">
                          {{ it.label }}
                        </p>
                        <p v-if="it.desc" class="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-neutral-400">
                          {{ it.desc }}
                        </p>
                      </div>
                    </button>
                  </div>

                  <div class="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-800/50">
                    <p class="mb-3 px-2 text-xs font-extrabold uppercase tracking-[0.18em] text-green-700 dark:text-green-400">
                      Program Khusus
                    </p>

                    <button
                      v-for="ex in megaMenu[2]?.items || []"
                      :key="ex.label"
                      type="button"
                      @click.prevent="openMega(ex)"
                      class="group flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-white hover:shadow-sm dark:hover:bg-neutral-700/60"
                    >
                      <div class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-green-500 text-white shadow-sm">
                        <ClientOnly>
                          <Icon :icon="ex.icon || 'ph:book-open-text'" class="size-5" />
                        </ClientOnly>
                      </div>
                      <div class="min-w-0">
                        <p class="truncate text-sm font-bold text-slate-900 dark:text-neutral-100">
                          {{ ex.label }}
                        </p>
                        <p v-if="ex.desc" class="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-neutral-400">
                          {{ ex.desc }}
                        </p>
                      </div>
                    </button>

                    <div class="mt-4 rounded-3xl bg-linear-to-br from-green-500 to-green-500 p-4 text-white shadow-lg shadow-green-200/60">
                      <div class="flex items-center gap-3">
                        <img class="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/30" :src="ppdbCta.image" alt="PPDB" />
                        <div class="min-w-0">
                          <p class="truncate text-sm font-extrabold">{{ ppdbCta.title }}</p>
                          <p class="mt-1 line-clamp-2 text-sm text-white/85">{{ ppdbCta.desc }}</p>
                        </div>
                      </div>
                      <a
                        :href="ppdbCta.href"
                        class="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-green-700 transition hover:bg-green-50"
                      >
                        Daftar sekarang
                        <ClientOnly><Icon icon="lucide:arrow-right" class="size-4" /></ClientOnly>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              :class="[
                'mx-1 h-7 w-px rounded-full transition-colors',
                isLightSurface ? 'bg-slate-200' : 'bg-white/15'
              ]"
            />

            <div class="flex items-center gap-2">
              <a
                v-for="btn in ctaButtons"
                :key="btn.label"
                :href="btn.href"
                :class="btn.style === 'primary' ? primaryButtonClass : secondaryButtonClass"
              >
                {{ btn.label }}
              </a>
            </div>
          </div>

          <!-- Mobile toggle -->
          <button
            type="button"
            class="relative z-10 md:hidden inline-flex h-11 w-11 items-center justify-center rounded-2xl transition-all active:scale-95"
            :class="mobileToggleClass"
            id="hs-header-base-collapse"
            :aria-expanded="String(isMobileOpen)"
            aria-controls="hs-header-base"
            aria-label="Toggle navigation"
            @click.stop.prevent="toggleMobileMenu"
          >
            <ClientOnly>
              <Icon
                v-if="!isMobileOpen"
                :class="['size-5', adaptiveTextClass]"
                icon="lucide:menu"
              />
              <Icon
                v-else
                :class="['size-5', adaptiveTextClass]"
                icon="lucide:x"
              />
              <template #fallback><span class="inline-block h-5 w-5" /></template>
            </ClientOnly>
          </button>
        </div>

        <!-- Mobile collapse -->
        <div
          id="hs-header-base"
          class="basis-full border-t transition-all duration-300 md:hidden"
          :class="[
            isMobileOpen ? 'block opacity-100 translate-y-0' : 'hidden opacity-0 -translate-y-2',
            isLightSurface ? 'border-slate-200/80' : 'border-white/10'
          ]"
          aria-labelledby="hs-header-base-collapse"
        >
          <div class="max-h-[75vh] overflow-y-auto px-4 pb-4 pt-3">
            <div class="flex flex-col gap-1.5">
              <a
                v-for="l in navLinks"
                :key="l.label"
                :href="l.href"
                @click="closeMobileIfOpen"
                class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition"
                :class="mobileLinkClass"
              >
                <ClientOnly>
                  <Icon :icon="l.icon" class="size-5 shrink-0" />
                </ClientOnly>
                {{ l.label }}
              </a>

              <div
                class="mt-2 rounded-3xl border p-2"
                :class="isLightSurface ? 'border-slate-200 bg-slate-50/80' : 'border-white/10 bg-white/5'"
              >
                <button
                  id="hs-header-program-mobile"
                  type="button"
                  class="hs-dropdown-toggle flex w-full items-center rounded-2xl px-3 py-3 text-sm font-bold transition"
                  :class="mobileLinkClass"
                >
                  <ClientOnly>
                    <Icon icon="ph:book-open" class="mr-3 size-5 shrink-0" />
                  </ClientOnly>
                  Program
                </button>

                <div class="mt-1 space-y-2">
                  <template v-for="g in megaMenu" :key="g.title">
                    <div class="px-3 pt-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-green-600 dark:text-green-400">
                      {{ g.title }}
                    </div>
                    <button
                      v-for="it in g.items"
                      :key="it.label"
                      type="button"
                      @click.prevent="openMega(it)"
                      class="flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition"
                      :class="mobileLinkClass"
                    >
                      <ClientOnly>
                        <Icon :icon="it.icon || 'ph:book-open-text'" class="mt-0.5 size-5 shrink-0" />
                      </ClientOnly>
                      <div class="min-w-0">
                        <p class="truncate text-sm font-bold">{{ it.label }}</p>
                        <p v-if="it.desc" class="mt-1 line-clamp-2 text-xs opacity-75">{{ it.desc }}</p>
                      </div>
                    </button>
                  </template>
                </div>
              </div>

              <div class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <a
                  v-for="btn in ctaButtons"
                  :key="btn.label"
                  :href="btn.href"
                  @click="closeMobileIfOpen"
                  :class="btn.style === 'primary' ? primaryButtonClass : secondaryButtonClass"
                >
                  {{ btn.label }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>

  <!-- Fullscreen Mega Modal -->
  <transition name="fade" appear>
    <div
      v-if="showMegaModal && selectedMegaItem"
      class="fixed inset-0 z-80"
      aria-modal="true"
      role="dialog"
    >
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="closeMega" />

      <div class="relative flex h-full w-full items-stretch overflow-y-auto">
        <div class="relative mx-auto my-auto h-[90vh] min-h-0 w-[95vw] max-w-6xl overflow-hidden rounded-4xl bg-white shadow-xl transition-all dark:bg-neutral-900">
          <div class="grid h-full min-h-0 min-w-0 grid-cols-1 lg:grid-cols-2">
            <div class="relative h-64 lg:h-full">
              <img
                :src="selectedMegaItem.cover || defaultCover"
                class="absolute inset-0 h-full w-full object-cover"
                :alt="selectedMegaItem.label"
              />
              <div class="absolute inset-0 bg-linear-to-t from-black/60 via-black/15 to-transparent"></div>

              <div class="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-white backdrop-blur-md">
                <ClientOnly>
                  <Icon :icon="selectedMegaItem.icon || 'ph:book-open-text'" class="size-4" />
                </ClientOnly>
                <span class="text-[11px] font-bold uppercase tracking-[0.16em]">{{ megaSectionOf(selectedMegaItem) }}</span>
              </div>
            </div>

            <div class="flex min-h-0 min-w-0 flex-col">
              <div class="grow space-y-5 overflow-y-auto p-6 lg:p-8">
                <div class="flex items-start justify-between gap-4">
                  <h3 class="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-neutral-100">
                    {{ selectedMegaItem.label }}
                  </h3>
                  <button
                    type="button"
                    @click="closeMega"
                    class="rounded-2xl p-2 transition hover:bg-slate-100 dark:hover:bg-neutral-800"
                    aria-label="Tutup"
                  >
                    <ClientOnly><Icon icon="lucide:x" class="size-5 text-slate-700 dark:text-neutral-300" /></ClientOnly>
                  </button>
                </div>

                <p v-if="selectedMegaItem.description || selectedMegaItem.desc" class="text-slate-600 dark:text-neutral-300">
                  {{ selectedMegaItem.description || selectedMegaItem.desc }}
                </p>

                <ul v-if="selectedMegaItem.points?.length" class="ms-5 list-disc space-y-1 text-slate-600 dark:text-neutral-300">
                  <li v-for="(p, i) in selectedMegaItem.points" :key="i">{{ p }}</li>
                </ul>

                <div v-if="selectedMegaItem.meta" class="text-xs text-slate-400 dark:text-neutral-500">
                  {{ selectedMegaItem.meta }}
                </div>
              </div>

              <div class="flex flex-wrap gap-2 border-t border-slate-100 p-6 lg:p-8 dark:border-neutral-800">
                <a
                  v-if="selectedMegaItem.href"
                  :href="selectedMegaItem.href"
                  class="inline-flex items-center gap-2 rounded-2xl bg-green-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-600"
                >
                  Kunjungi Halaman
                  <ClientOnly><Icon icon="lucide:arrow-right" class="size-4" /></ClientOnly>
                </a>
                <button
                  type="button"
                  @click="closeMega"
                  class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'
import { useNuxtApp, useRuntimeConfig } from 'nuxt/app'
import { ref as dbRef, onValue } from 'firebase/database'
import { useRoute } from 'vue-router'

const config = useRuntimeConfig()
const { $realtimeDb } = useNuxtApp() as any

const clientName = String(config.public.clientName || 'alinayah')
const clientDisplayName = String(config.public.clientDisplayName || 'Al-Inayah')
const siteName = String(config.public.siteName || 'Pondok Pesantren Al-Inayah')
const appName = String(config.public.appName || 'SINAYAH')
const appSubtitle = String(config.public.appSubtitle || 'SIAKAD Ponpes. AL-INAYAH')
const appLogo = String(config.public.appLogo || '/assets/logo.png')

const NAVBAR_PATH = `${clientName}/site/navbar`

const route = useRoute()

const isHomePage = computed(() => route.path === '/')
const forceLightNavbar = computed(() => !isHomePage.value)

const brand = ref(siteName)
const brandShorten = ref(appName)
const brandLogo = ref(appLogo)
const brandSubtitle = ref(appSubtitle)

const isTop = ref(true)
const threshold = 8
const onScroll = () => {
  isTop.value = window.scrollY <= threshold
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
})

const isMobileOpen = ref(false)
const showMegaModal = ref(false)
const selectedMegaItem = ref<MegaItem | null>(null)
const isScrolledOrOpen = computed(() =>
  forceLightNavbar.value ||
  !isTop.value ||
  isMobileOpen.value ||
  showMegaModal.value
)

/**
 * Light surface:
 * - saat scroll / mobile open / modal open => navbar jadi terang
 * Dark surface:
 * - saat di hero/top transparan => anggap background hero cenderung gelap
 */
const isLightSurface = computed(() =>
  forceLightNavbar.value ||
  !isTop.value ||
  isMobileOpen.value ||
  showMegaModal.value
)

const adaptiveTextClass = computed(() =>
  forceLightNavbar.value
    ? 'text-slate-900'
    : isLightSurface.value
      ? 'text-slate-900 dark:text-white'
      : 'text-white'
)

const adaptiveSubTextClass = computed(() =>
  isLightSurface.value ? 'text-slate-500 dark:text-neutral-400' : 'text-white/70'
)

const navbarShellClass = computed(() =>
  isLightSurface.value
    ? 'border-white/70 bg-white/80 shadow-[0_18px_60px_-20px_rgba(15,23,42,0.18)]'
    : 'border-white/10 bg-white/8 shadow-none'
)

const desktopLinkClass = computed(() =>
  [
    'inline-flex items-center rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200',
    isLightSurface.value
      ? 'text-slate-700 hover:bg-green-50 hover:text-green-700 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-green-400'
      : 'text-white hover:bg-white/10 hover:text-white'
  ].join(' ')
)

const mobileLinkClass = computed(() =>
  isLightSurface.value
    ? 'text-slate-700 hover:bg-white hover:text-green-700 dark:text-neutral-200 dark:hover:bg-neutral-800'
    : 'text-white hover:bg-white/10 hover:text-white'
)

const mobileToggleClass = computed(() =>
  isLightSurface.value
    ? 'bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700'
    : 'bg-white/10 hover:bg-white/15'
)

const primaryButtonClass = computed(() =>
  [
    'inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-bold transition-all duration-200',
    'bg-green-500 text-white shadow-lg shadow-green-200/50 hover:-translate-y-0.5 hover:bg-green-600'
  ].join(' ')
)

const secondaryButtonClass = computed(() =>
  [
    'inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-bold transition-all duration-200',
    isLightSurface.value
      ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700'
      : 'border border-white/20 bg-white/10 text-white hover:bg-white/15'
  ].join(' ')
)

const topHeaderClass = 'bg-transparent'
const scrolledHeaderClass = 'bg-transparent'

const navLinks = ref<Array<{ label: string; href: string; icon: string }>>([
  { label: 'Beranda', href: '/#home', icon: 'ph:house' },
  { label: 'Tentang', href: '/#information', icon: 'ph:info' },
  { label: 'Fasilitas', href: '/#facility', icon: 'ph:buildings' },
  { label: 'Berita', href: '/#news', icon: 'ph:newspaper' },
  { label: 'Kitab', href: '/book', icon: 'ion:book-outline' },
  { label: 'Kontak', href: '/#contact', icon: 'ph:phone' }
])

type MegaItem = {
  label: string
  href?: string
  icon?: string
  desc?: string
  description?: string
  cover?: string
  points?: string[]
  meta?: string
}

type MegaGroup = {
  title: string
  items: MegaItem[]
}

const megaMenu = ref<MegaGroup[]>([])

const ppdbCta = ref({
  title: 'PPDB Online 2025/2026',
  desc: 'Penerimaan Peserta Didik Baru. Daftar mudah & cepat secara online.',
  href: '/registration',
  image: '/assets/images/activity.jpg'
})

const ctaButtons = ref([
  { label: 'Login Wali', href: '/waliLogin', style: 'primary' as const },
  { label: 'Registrasi', href: '/registration', style: 'primary' as const }
])

function closeMobileIfOpen() {
  isMobileOpen.value = false
}

function normalizeItem(raw: any): MegaItem {
  return {
    label: raw?.label ?? 'Tanpa Judul',
    href: raw?.href ?? '#',
    icon: raw?.icon ?? 'ph:book-open-text',
    desc: raw?.desc ?? '',
    description: raw?.description ?? raw?.desc ?? '',
    cover: raw?.cover,
    points: raw?.points,
    meta: raw?.meta
  }
}

const defaultCover = '/assets/images/activity.jpg'

function toggleMobileMenu() {
  isMobileOpen.value = !isMobileOpen.value
}

function megaSectionOf(item: MegaItem) {
  for (const g of megaMenu.value) {
    if (g.items?.some((i: MegaItem) => i.label === item.label)) return g.title || 'Program'
  }
  return 'Program'
}

function openMega(item: MegaItem) {
  closeMobileIfOpen()
  selectedMegaItem.value = item
  showMegaModal.value = true
  try {
    document.documentElement.style.overflow = 'hidden'
  } catch {}
}

function closeMega() {
  showMegaModal.value = false
  selectedMegaItem.value = null
  try {
    document.documentElement.style.overflow = ''
  } catch {}
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && showMegaModal.value) closeMega()
}

if ($realtimeDb) {
  onMounted(() => {
    onValue(dbRef($realtimeDb, NAVBAR_PATH), (snap) => {
      const val = snap.val()

      if (!val) return

      brand.value = String(val.brand || siteName)
      brandShorten.value = String(val.brandShorten || appName)
      brandSubtitle.value = String(val.brandSubtitle || appSubtitle)

      if (val.brandLogo) {
        brandLogo.value = String(val.brandLogo)
      } else {
        brandLogo.value = appLogo
      }

      if (Array.isArray(val.navLinks)) {
        navLinks.value = val.navLinks
          .map((item: any) => ({
            label: String(item?.label || '').trim(),
            href: String(item?.href || '#').trim(),
            icon: String(item?.icon || 'ph:circle').trim()
          }))
          .filter((item: any) => item.label)
      }

      if (Array.isArray(val.megaMenu)) {
        megaMenu.value = val.megaMenu
          .map((group: any, index: number) => ({
            title: String(group?.title || `Grup ${index + 1}`).trim(),
            items: Array.isArray(group?.items)
              ? group.items.map((raw: any) => normalizeItem(raw)).filter((item: MegaItem) => item.label)
              : []
          }))
          .filter((group: MegaGroup) => group.title || group.items.length)
      }

      if (val.ppdbCta && typeof val.ppdbCta === 'object') {
        ppdbCta.value = {
          ...ppdbCta.value,
          title: String(val.ppdbCta.title || ppdbCta.value.title),
          desc: String(val.ppdbCta.desc || ppdbCta.value.desc),
          href: String(val.ppdbCta.href || ppdbCta.value.href),
          image: String(val.ppdbCta.image || ppdbCta.value.image)
        }
      }

      if (Array.isArray(val.ctaButtons)) {
        ctaButtons.value = val.ctaButtons
          .map((button: any) => ({
            label: String(button?.label || '').trim(),
            href: String(button?.href || '#').trim(),
            style: button?.style === 'outline' ? 'outline' as const : 'primary' as const
          }))
          .filter((button: any) => button.label)
      }
    })
  })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>