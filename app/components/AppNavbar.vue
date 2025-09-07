<template>
  <!-- NAVBAR -->
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 border-b md:overflow-y-visible overflow-y-auto transition-all duration-300 max-h-[90vh] ease-out transform-gpu will-change-transform',
      isScrolledOrOpen ? scrolledHeaderClass : topHeaderClass
    ]"
  >
    <nav class="relative max-w-[85rem] w-full mx-auto md:flex md:items-center md:justify-between md:gap-3 py-2 px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center gap-x-1">
        <a
          class="flex-none font-semibold text-xl flex items-center gap-3 focus:outline-hidden focus:opacity-80"
          :class="isScrolledOrOpen ? 'text-black dark:text-white' : 'text-white'"
          href="/"
          aria-label="Brand"
        >
          <img :src="brandLogo" class="w-10" alt="logo">
          <span class="lg:inline-block hidden">{{ brand }}</span>
          <span class="lg:hidden inline-block">{{ brandShorten }}</span>
        </a>

        <button
          type="button"
          class="hs-collapse-toggle md:hidden relative size-9 flex justify-center items-center font-medium text-sm rounded-lg transition-colors"
        
          id="hs-header-base-collapse"
          aria-expanded="false"
          aria-controls="hs-header-base"
          aria-label="Toggle navigation"
          data-hs-collapse="#hs-header-base"
        >
          <ClientOnly>
            <Icon :class="['hs-collapse-open:hidden size-5', isScrolledOrOpen ? 'text-current' : 'text-white']" icon="lucide:menu" />
            <Icon :class="['hs-collapse-open:block hidden size-5', isScrolledOrOpen ? 'text-current' : 'text-white']" icon="lucide:x" />
            <template #fallback><span class="w-5 h-5 inline-block" /></template>
          </ClientOnly>
          <span class="sr-only">Toggle navigation</span>
        </button>
      </div>

      <div id="hs-header-base" class="hs-collapse hidden transition-all duration-300 basis-full grow md:block" aria-labelledby="hs-header-base-collapse">
        <div class="max-h-[75vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
          <div class="py-2 md:py-0 flex flex-col md:flex-row md:items-center gap-0.5 md:gap-1">
            <div class="grow">
              <div class="flex flex-col md:flex-row md:justify-end md:items-center gap-0.5 md:gap-1">
                <a
                  v-for="l in navLinks"
                  :key="l.label"
                  :href="l.href"
                  :class="[linkBaseClass, !isScrolledOrOpen ? linkTopClass : linkScrolledClass]"
                >
                  <ClientOnly>
                    <Icon :icon="l.icon" class="shrink-0 size-4 me-3 md:me-2 block md:hidden" :class="isScrolledOrOpen ? 'text-gray-800 dark:text-neutral-200' : 'text-white'" />
                    <template #fallback><span class="w-4 h-4 me-2 inline-block" /></template>
                  </ClientOnly>
                  {{ l.label }}
                </a>

                <!-- Mega Dropdown -->
                <div class="hs-dropdown relative md:inline-flex md:[--strategy:fixed] [--strategy:static] [--adaptive:none] [--is-collapse:true] md:[--is-collapse:false]">
                  <button
                    id="hs-header-program"
                    type="button"
                    class="hs-dropdown-toggle w-full p-2 flex items-center text-sm rounded-lg transition-colors"
                    :class="!isScrolledOrOpen ? 'text-white' : 'text-gray-800 dark:text-neutral-200'"
                    aria-haspopup="menu"
                    aria-expanded="false"
                  >
                    <ClientOnly>
                      <Icon icon="ph:book-open" class="shrink-0 size-4 me-3 md:me-2 block md:hidden" :class="isScrolledOrOpen ? 'text-gray-800 dark:text-neutral-200' : 'text-white'" />
                      <template #fallback><span class="w-4 h-4 me-2 inline-block" /></template>
                    </ClientOnly>
                    Program
                    <ClientOnly>
                      <Icon icon="lucide:chevron-down" class="duration-300 shrink-0 size-4 ms-auto md:ms-1" :class="!isScrolledOrOpen ? 'hs-dropdown-open:rotate-0 text-white' : 'hs-dropdown-open:rotate-0 text-gray-500 dark:text-neutral-500'" />
                      <template #fallback><span class="w-4 h-4 inline-block" /></template>
                    </ClientOnly>
                  </button>

                  <div
                    class="hs-dropdown-menu transition duration-150 opacity-0 hs-dropdown-open:opacity-100 hidden md:fixed left-0 w-full min-w-60 z-10 top-full start-0 md:before:fixed before:-top-5 before:start-0 before:w-full before:h-5 md:mx-6 lg:mx-8 md:bg-white md:rounded-lg md:shadow-md dark:md:bg-neutral-800"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="hs-header-program"
                  >
                    <div class="py-1 md:p-2 md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div v-for="g in megaMenu.slice(0,2)" :key="g.title" class="flex flex-col">
                        <span class="ms-2.5 mb-2 font-semibold text-xs uppercase text-gray-800 dark:text-neutral-200">{{ g.title }}</span>
                        <button
                          v-for="it in g.items"
                          :key="it.label"
                          type="button"
                          @click.prevent="openMega(it)"
                          class="text-start p-3 flex gap-x-4 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        >
                          <ClientOnly>
                            <Icon :icon="it.icon" class="shrink-0 size-5 mt-1 text-gray-800 dark:text-neutral-200" />
                            <template #fallback><span class="w-5 h-5 mt-1 inline-block" /></template>
                          </ClientOnly>
                          <div class="grow">
                            <p class="font-medium text-sm text-gray-800 dark:text-neutral-200">{{ it.label }}</p>
                            <p v-if="it.desc" class="text-sm text-gray-500 dark:text-neutral-500">{{ it.desc.substring(0, 50) }}...</p>
                          </div>
                        </button>
                      </div>

                      <!-- Kolom 3: Program Khusus + CTA PPDB -->
                      <div class="mt-2 md:mt-0 flex flex-col">
                        <span class="ms-2.5 mb-2 font-semibold text-xs uppercase text-gray-800 dark:text-neutral-200">Program Khusus</span>

                        <button
                          v-for="ex in megaMenu[2]?.items || []"
                          :key="ex.label"
                          type="button"
                          @click.prevent="openMega(ex)"
                          class="text-start p-3 flex gap-x-4 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        >
                          <ClientOnly>
                            <Icon :icon="ex.icon" class="shrink-0 size-5 mt-1 text-gray-800 dark:text-neutral-200" />
                            <template #fallback><span class="w-5 h-5 mt-1 inline-block" /></template>
                          </ClientOnly>
                          <div class="grow">
                            <p class="font-medium text-sm text-gray-800 dark:text-neutral-200">{{ ex.label }}</p>
                            <p v-if="ex.desc" class="text-sm text-gray-500 dark:text-neutral-500">{{ ex.desc.substring(0,50) }}...</p>
                          </div>
                        </button>

                        <div class="mt-3 p-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
                          <div class="flex gap-x-4 items-center">
                            <img class="size-24 rounded-lg object-cover" :src="ppdbCta.image" alt="PPDB" />
                            <div class="grow">
                              <p class="text-sm text-gray-800 dark:text-neutral-200 font-medium">{{ ppdbCta.title }}</p>
                              <p class="text-sm text-gray-500 dark:text-neutral-500">{{ ppdbCta.desc }}</p>
                              <a :href="ppdbCta.href" class="mt-2 inline-flex items-center gap-x-1 text-sm font-medium">
                                Daftar sekarang
                                <ClientOnly><Icon icon="lucide:arrow-right" class="size-4" /></ClientOnly>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="my-2 md:my-0 md:mx-2">
              <div class="w-full h-px md:w-px md:h-4" :class="!isScrolledOrOpen ? 'bg-white/25' : 'bg-gray-100 md:bg-gray-300 dark:bg-neutral-700'"></div>
            </div>

            <div class="flex flex-wrap items-center gap-x-1.5">
              <a
                v-for="btn in ctaButtons"
                :key="btn.label"
                :href="btn.href"
                :class="btn.style === 'primary'
                  ? (!isScrolledOrOpen ? primaryTopClass : primaryScrolledClass)
                  : (!isScrolledOrOpen ? outlineTopClass : outlineScrolledClass)"
              >
                {{ btn.label }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <!-- ===== Fullscreen Mega Modal (sibling to header to avoid fixed/transform issues) ===== -->
  <transition name="fade" appear>
    <div
      v-if="showMegaModal && selectedMegaItem"
      class="fixed inset-0 z-[80]"
      aria-modal="true"
      role="dialog"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        @click="closeMega"
      />

      <div class="relative h-full w-full flex items-stretch overflow-y-auto">
        <div class="relative mx-auto my-auto w-[95vw] h-[90vh] max-w-6xl rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-neutral-900 min-h-0 transition-all">
          <div class="grid grid-cols-1 lg:grid-cols-2 h-full min-h-0 min-w-0">
            <div class="relative h-64 lg:h-full">
              <img
                :src="selectedMegaItem.cover || defaultCover"
                class="absolute inset-0 w-full h-full object-cover"
                :alt="selectedMegaItem.label"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-black/10"></div>

              <div class="absolute top-4 left-4 flex items-center gap-2 text-white/90">
                <ClientOnly>
                  <Icon :icon="selectedMegaItem.icon || 'ph:book-open-text'" class="size-5" />
                </ClientOnly>
                <span class="text-xs uppercase tracking-wide">{{ megaSectionOf(selectedMegaItem) }}</span>
              </div>
            </div>

            <!-- Text -->
            <div class="flex flex-col h-full min-h-0 min-w-0">
              <div class="p-6 lg:p-8 overflow-y-auto grow space-y-5 scroll-touch">
                <div class="flex items-start justify-between gap-4">
                  <h3 class="text-2xl font-semibold text-gray-900 dark:text-neutral-100 leading-tight">
                    {{ selectedMegaItem.label }}
                  </h3>
                  <button
                    type="button"
                    @click="closeMega"
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
                    aria-label="Tutup"
                  >
                    <ClientOnly><Icon icon="lucide:x" class="size-5 text-gray-700 dark:text-neutral-300" /></ClientOnly>
                  </button>
                </div>

                <p v-if="selectedMegaItem.description || selectedMegaItem.desc"
                   class="text-gray-700 dark:text-neutral-300">
                  {{ selectedMegaItem.description || selectedMegaItem.desc }}
                </p>

                <ul v-if="selectedMegaItem.points?.length" class="list-disc ms-5 space-y-1 text-gray-700 dark:text-neutral-300">
                  <li v-for="(p, i) in selectedMegaItem.points" :key="i">{{ p }}</li>
                </ul>

                <div v-if="selectedMegaItem.meta" class="text-xs text-gray-500 dark:text-neutral-400">
                  {{ selectedMegaItem.meta }}
                </div>
              </div>

              <!-- Actions -->
              <div class="p-6 lg:p-8 border-t border-gray-100 dark:border-neutral-800 flex flex-wrap gap-2">
                <a
                  v-if="selectedMegaItem.href"
                  :href="selectedMegaItem.href"
                  class="inline-flex items-center gap-2 py-2 px-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Kunjungi Halaman
                  <ClientOnly><Icon icon="lucide:arrow-right" class="size-4" /></ClientOnly>
                </a>
                <button
                  type="button"
                  @click="closeMega"
                  class="inline-flex items-center gap-2 py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
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
import { useNuxtApp } from '#app'
import { ref as dbRef, onValue } from 'firebase/database'

const { $realtimeDb } = useNuxtApp() as any
const NAVBAR_PATH = 'alberr/site/navbar'
const NAVBAR_MEGA_ROOT = 'alberr/site/navbar/megaMenu'

const brand = ref('Pondok Pesantren ALBERR')
const brandShorten = ref('ALBERR')
const brandLogo = ref('/assets/logo.png')
const isTop = ref(true)
const threshold = 8
const onScroll = () => { isTop.value = window.scrollY <= threshold }

let collapseObserver: MutationObserver | null = null

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)

  const el = document.getElementById('hs-header-base')
  const updateOpen = () => {
    isMobileOpen.value = !!el && !el.classList.contains('hidden')
  }

  if (el) {
    ;['open.hs.collapse','show.hs.collapse','close.hs.collapse','hide.hs.collapse']
      .forEach(evt => el.addEventListener(evt as any, updateOpen as any))
    collapseObserver = new MutationObserver(updateOpen)
    collapseObserver.observe(el, { attributes: true, attributeFilter: ['class', 'style'] })
    updateOpen()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  collapseObserver?.disconnect()
})

const topHeaderClass = 'bg-transparent border-transparent text-white scale-95'
const scrolledHeaderClass = 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-neutral-100 shadow-sm scale-100'

const linkBaseClass = 'p-2 flex items-center text-sm rounded-lg transition-colors'
const linkTopClass = 'text-white hover:bg-white/10 focus:bg-white/10'
const linkScrolledClass = 'text-gray-800 hover:bg-gray-100 focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'

const outlineTopClass = 'py-[7px] px-2.5 inline-flex items-center font-medium text-sm rounded-lg border border-white/30 text-white hover:bg-white/10'
const outlineScrolledClass = 'py-[7px] px-2.5 inline-flex items-center font-medium text-sm rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700'

const primaryTopClass = 'py-2 px-2.5 inline-flex items-center font-medium text-sm rounded-lg bg-white/15 text-white hover:bg-white/25'
const primaryScrolledClass = 'py-2 px-2.5 inline-flex items-center font-medium text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'

// Data defaults
const navLinks = ref<Array<{ label: string; href: string; icon: string }>>([
  { label: 'Beranda', href: '/#home', icon: 'ph:house' },
  { label: 'Tentang', href: '/#information', icon: 'ph:info' },
  { label: 'Fasilitas', href: '/#facility', icon: 'ph:buildings' },
  { label: 'Berita', href: '/#news', icon: 'ph:newspaper' },
  { label: 'Kontak', href: '/#contact', icon: 'ph:phone' },
])

// Types for Mega Menu
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

type MegaGroup = { title: string; items: MegaItem[] }

const megaMenu = ref<MegaGroup[]>([])

const ppdbCta = ref({
  title: 'PPDB Online 2025/2026',
  desc: 'Penerimaan Peserta Didik Baru. Daftar mudah & cepat secara online.',
  href: '/registrationPPDB',
  image: '/assets/images/activity.jpg',
})

const ctaButtons = ref([{ label: 'Login Wali', href: '/waliLogin', style: 'primary' as const }])

const isMobileOpen = ref(false)
const isScrolledOrOpen = computed(() => !isTop.value || isMobileOpen.value || showMegaModal.value)

function closeMobileIfOpen() {
  const el = document.getElementById('hs-header-base')
  isMobileOpen.value = false
  try {
    const HSCollapse = (window as any)?.HSCollapse
    if (HSCollapse && el) {
      const inst = HSCollapse.getInstance(el, true)
      inst?.hide?.()
    } else {
      el?.classList.add('hidden')
    }
  } catch {}
}

// ====== Modal state & helpers ======
function normalizeItem(raw: any): MegaItem {
  return {
    label: raw?.label ?? 'Tanpa Judul',
    href: raw?.href ?? '#',
    icon: raw?.icon ?? 'ph:book-open-text',
    desc: raw?.desc ?? '',
    description: raw?.description ?? raw?.desc ?? '',
    cover: raw?.cover,
    points: raw?.points,
    meta: raw?.meta,
  }
}
const showMegaModal = ref(false)
const selectedMegaItem = ref<MegaItem | null>(null)
const defaultCover = '/assets/images/activity.jpg'

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
  try { document.documentElement.style.overflow = 'hidden' } catch {}
}

function readCollapseOpen(): boolean {
  const target = document.getElementById('hs-header-base')
  const toggler = document.getElementById('hs-header-base-collapse')
  if (!target) return false
  const cs = window.getComputedStyle(target)
  const viaDisplay = cs.display !== 'none' && cs.visibility !== 'hidden'
  const viaHiddenClass = !target.classList.contains('hidden')
  const viaAria = toggler?.getAttribute('aria-expanded') === 'true'
  return Boolean(viaAria || viaDisplay || viaHiddenClass)
}

function closeMega() {
  showMegaModal.value = false
  selectedMegaItem.value = null
  try { document.documentElement.style.overflow = '' } catch {}
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && showMegaModal.value) closeMega()
}

// Load from Firebase RTDB (optional)
if ($realtimeDb) {
  onMounted(() => {
  onValue(dbRef($realtimeDb, NAVBAR_PATH), (snap) => {
    const val = snap.val()
    if (!val) return
    brand.value = val.brand ?? brand.value
    brandShorten.value = val.brandShorten ?? brandShorten.value
    if (val.coverPonpes) brandLogo.value = val.coverPonpes
    if (val.ppdbCta) ppdbCta.value = { ...ppdbCta.value, ...val.ppdbCta }
    if (Array.isArray(val.ctaButtons)) ctaButtons.value = val.ctaButtons
  })

  // === Listen mega menu at: /alberr/site/navbar/megaMenu/<index>/items<index>/ ===
  onValue(dbRef($realtimeDb, NAVBAR_MEGA_ROOT), (snap) => {
    const root = snap.val()
    if (!root) { megaMenu.value = []; return }

    const groups: MegaGroup[] = []
    Object.keys(root)
      .sort((a, b) => Number(a) - Number(b))
      .forEach((k) => {
        const g = root[k] || {}
        const itemsKey = 'items' + String(k)
        let itemsList: any = g[itemsKey] ?? g.items ?? []
        if (Array.isArray(itemsList)) {
          // ok
        } else if (itemsList && typeof itemsList === 'object') {
          itemsList = Object.values(itemsList)
        } else {
          itemsList = []
        }
        const mapped: MegaItem[] = (itemsList as any[]).map((raw) => normalizeItem(raw))
        groups.push({ title: g.title ?? `Grup ${k}`, items: mapped })
      })

    megaMenu.value = groups
  })
})
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.scroll-touch{ -webkit-overflow-scrolling: touch; }
</style>
