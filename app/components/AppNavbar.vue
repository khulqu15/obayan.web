<template>
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
        <img src="/assets/logo.png" class="w-10" alt="">
          <span class="lg:inline-block hidden">{{ brand }}</span>
          <span class="lg:hidden inline-block">{{ brandShorten }}</span>
        </a>

        <button
          type="button"
          class="hs-collapse-toggle md:hidden relative size-9 flex justify-center items-center font-medium text-sm rounded-lg transition-colors"
          :class="!isScrolledOrOpen
                ? 'border border-white/30 text-white hover:bg-white/10 focus:bg-white/10'
                : 'border border-gray-200 text-gray-800 hover:bg-gray-100 focus:bg-gray-100 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'"
          id="hs-header-base-collapse"
          aria-expanded="false"
          aria-controls="hs-header-base"
          aria-label="Toggle navigation"
          data-hs-collapse="#hs-header-base"
        >
          <ClientOnly>
            <Icon :class="['hs-collapse-open:hidden size-5', isTop ? 'text-white' : 'text-current']" icon="lucide:menu" />
            <Icon :class="['hs-collapse-open:block hidden size-5', isTop ? 'text-white' : 'text-current']" icon="lucide:x" />
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
                    <Icon :icon="l.icon" class="shrink-0 size-4 me-3 md:me-2 block md:hidden" :class="isTop ? 'text-white' : 'text-gray-800 dark:text-neutral-200'" />
                    <template #fallback><span class="w-4 h-4 me-2 inline-block" /></template>
                  </ClientOnly>
                  {{ l.label }}
                </a>

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
                      <Icon icon="ph:book-open" class="shrink-0 size-4 me-3 md:me-2 block md:hidden" :class="isTop ? 'text-white' : 'text-gray-800 dark:text-neutral-200'" />
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
                        <a
                          v-for="it in g.items"
                          :key="it.label"
                          :href="it.href"
                          class="p-3 flex gap-x-4 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        >
                          <ClientOnly>
                            <Icon :icon="it.icon" class="shrink-0 size-5 mt-1 text-gray-800 dark:text-neutral-200" />
                            <template #fallback><span class="w-5 h-5 mt-1 inline-block" /></template>
                          </ClientOnly>
                          <div class="grow">
                            <p class="font-medium text-sm text-gray-800 dark:text-neutral-200">{{ it.label }}</p>
                            <p v-if="it.desc" class="text-sm text-gray-500 dark:text-neutral-500">{{ it.desc }}</p>
                          </div>
                        </a>
                      </div>

                      <div class="mt-2 md:mt-0 flex flex-col">
                        <span class="ms-2.5 mb-2 font-semibold text-xs uppercase text-gray-800 dark:text-neutral-200">Program Khusus</span>
                        <a
                          v-for="ex in megaMenu[2]?.items || []"
                          :key="ex.label"
                          :href="ex.href"
                          class="p-3 flex gap-x-4 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        >
                          <ClientOnly>
                            <Icon :icon="ex.icon" class="shrink-0 size-5 mt-1 text-gray-800 dark:text-neutral-200" />
                            <template #fallback><span class="w-5 h-5 mt-1 inline-block" /></template>
                          </ClientOnly>
                          <div class="grow">
                            <p class="font-medium text-sm text-gray-800 dark:text-neutral-200">{{ ex.label }}</p>
                            <p v-if="ex.desc" class="text-sm text-gray-500 dark:text-neutral-500">{{ ex.desc }}</p>
                          </div>
                        </a>

                        <!-- CTA -->
                        <div class="mt-3 p-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
                          <div class="flex gap-x-4 items-center">
                            <img class="size-24 rounded-lg object-cover" :src="ppdbCta.image" alt="PPDB" />
                            <div class="grow">
                              <p class="text-sm text-gray-800 dark:text-neutral-200 font-medium">{{ ppdbCta.title }}</p>
                              <p class="text-sm text-gray-500 dark:text-neutral-500">{{ ppdbCta.desc }}</p>
                              <a :href="ppdbCta.href" class="mt-2 inline-flex items-center gap-x-1 text-sm text-blue-600 dark:text-blue-400 font-medium">
                                Daftar sekarang
                                <ClientOnly>
                                  <Icon icon="lucide:arrow-right" class="size-4" />
                                </ClientOnly>
                              </a>
                            </div>
                          </div>
                        </div>
                        <!-- /CTA -->
                      </div>
                    </div>
                  </div>
                </div>
                <!-- /Mega menu -->
              </div>
            </div>

            <!-- Divider -->
            <div class="my-2 md:my-0 md:mx-2">
              <div class="w-full h-px md:w-px md:h-4" :class="!isScrolledOrOpen ? 'bg-white/25' : 'bg-gray-100 md:bg-gray-300 dark:bg-neutral-700'"></div>
            </div>

            <!-- CTAs -->
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
      <!-- /Collapse -->
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'

const brand = ref('Pondok Pesantren Al Berr')
const brandShorten = ref('Al Berr')
const isTop = ref(true)
const threshold = 8 // px
const onScroll = () => { isTop.value = window.scrollY <= threshold }
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

const topHeaderClass = 'bg-transparent border-transparent text-white scale-95'
const scrolledHeaderClass = 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-neutral-100 shadow-sm scale-100'

const linkBaseClass = 'p-2 flex items-center text-sm rounded-lg transition-colors'
const linkTopClass = 'text-white hover:bg-white/10 focus:bg-white/10'
const linkScrolledClass = 'text-gray-800 hover:bg-gray-100 focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'

const outlineTopClass = 'py-[7px] px-2.5 inline-flex items-center font-medium text-sm rounded-lg border border-white/30 text-white hover:bg-white/10'
const outlineScrolledClass = 'py-[7px] px-2.5 inline-flex items-center font-medium text-sm rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700'

const primaryTopClass = 'py-2 px-2.5 inline-flex items-center font-medium text-sm rounded-lg bg-white/15 text-white hover:bg-white/25'
const primaryScrolledClass = 'py-2 px-2.5 inline-flex items-center font-medium text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'

const navLinks = ref([
  { label: 'Beranda', href: '/#home', icon: 'ph:house' },
  { label: 'Tentang', href: '/#information', icon: 'ph:info' },
  { label: 'Fasilitas', href: '/#facility', icon: 'ph:buildings' },
  { label: 'Berita', href: '/#news', icon: 'ph:newspaper' },
  { label: 'Kontak', href: '/#contact', icon: 'ph:phone' },
])

const isMobileOpen = ref(false)

const isScrolledOrOpen = computed(() => !isTop.value || isMobileOpen.value)

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })

  const btn = document.getElementById('hs-header-base-collapse')
  const update = () => { isMobileOpen.value = btn?.getAttribute('aria-expanded') === 'true' }
  update()

  const mo = btn ? new MutationObserver(update) : null
  mo?.observe(btn!, { attributes: true, attributeFilter: ['aria-expanded'] })

  btn?.addEventListener('click', () => queueMicrotask(update))

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    mo?.disconnect()
  })
})


const megaMenu = ref([
  {
    title: 'Pendidikan',
    items: [
      { label: 'SMA Al Berr', href: '#', icon: 'ph:book-open-text', desc: 'Sekolah Menengah Atas Al Berr' },
      { label: 'SMP Al Berr', href: '#', icon: 'ph:student', desc: 'Sekolah Menengah Pertama Al Berr' },
    ],
  },
  {
    title: 'Kegiatan Santri',
    items: [
      { label: 'Kajian Kitab', href: '#', icon: 'ph:scroll', desc: 'Pendalaman kitab kuning' },
      { label: 'Muhadhoroh', href: '#', icon: 'ph:megaphone-simple', desc: 'Latihan pidato & public speaking' },
      { label: 'Khidmah Sosial', href: '#', icon: 'ph:handshake', desc: 'Pengabdian & kemasyarakatan' },
      { label: 'Rihlah / Daurah', href: '#', icon: 'ph:globe-hemisphere-west', desc: 'Kegiatan luar asrama edukatif' },
    ],
  },
  {
    title: 'Program Khusus',
    items: [
      { label: 'Tahfidzul Quran', href: '#', icon: 'mdi:religion-muslim' },
      { label: 'Metode Baca Kitab Amtsilati', href: '#', icon: 'hugeicons:muslim' },
      { label: 'Bahasa Arab', href: '#', icon: 'hugeicons:alphabet-arabic' },
      { label: 'BLK Komunitas TIK', href: '#', icon: 'fluent:people-community-16-regular' },
    ],
  },
])

const ppdbCta = ref({
  title: 'PPDB Online 2025/2026',
  desc: 'Penerimaan Peserta Didik Baru. Daftar mudah & cepat secara online.',
  href: '#',
  image: '/assets/images/activity.jpg',
})

const ctaButtons = ref([
  { label: 'Login Wali', href: '/waliLogin', style: 'primary' as const },
  // { label: 'Daftar PPDB', href: '/registrationPPDB', style: 'primary' as const },
])
</script>
