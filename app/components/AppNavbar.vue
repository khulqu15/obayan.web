<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ease-out transform-gpu will-change-transform',
      isScrolledOrOpen ? scrolledHeaderClass : topHeaderClass
    ]"
  >
    <nav class="relative max-w-[85rem] w-full mx-auto md:flex md:items-center md:justify-between md:gap-3 py-2 px-4 sm:px-6 lg:px-8">
      <!-- Brand + Toggle -->
      <div class="flex justify-between items-center gap-x-2">
        <a href="/" class="flex items-center gap-2">
          <img src="/logo.png" class="h-8 w-auto rounded-sm" alt="Obayan">
          <span class="font-extrabold text-lg tracking-tight">Obayan</span>
        </a>

        <!-- Mobile toggle -->
        <button
          type="button"
          id="hs-header-base-collapse"
          class="hs-collapse-toggle md:hidden relative size-9 flex justify-center items-center rounded-lg transition-colors"
          :class="!isScrolledOrOpen
                ? 'border border-white/30 text-white hover:bg-white/10 focus:bg-white/10'
                : 'border border-gray-200 text-gray-800 hover:bg-gray-100 focus:bg-gray-100 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'"
          aria-expanded="false"
          aria-controls="hs-header-base"
          aria-label="Toggle navigation"
          data-hs-collapse="#hs-header-base"
        >
          <ClientOnly>
            <Icon :class="['hs-collapse-open:hidden size-5', isTop ? 'text-base-content' : 'text-current']" icon="lucide:menu" />
            <Icon :class="['hs-collapse-open:block hidden size-5', isTop ? 'text-base-content' : 'text-current']" icon="lucide:x" />
            <template #fallback><span class="w-5 h-5 inline-block" /></template>
          </ClientOnly>
          <span class="sr-only">Toggle navigation</span>
        </button>
      </div>

      <!-- Collapse body -->
      <div id="hs-header-base" class="hs-collapse hidden transition-all duration-300 basis-full grow md:block" aria-labelledby="hs-header-base-collapse">
        <div class="max-h-[75vh] overflow-y-auto md:overflow-visible [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
          <div class="py-2 md:py-0 flex flex-col md:flex-row md:items-center gap-0.5 md:gap-1">
            <div class="grow">
              <div class="flex flex-col md:flex-row md:justify-end md:items-center gap-0.5 md:gap-1">
                <!-- Simple links -->
                <NuxtLink
                  v-for="l in navLinks"
                  :key="l.label"
                  :to="l.href"
                  :class="[linkBaseClass, !isScrolledOrOpen ? linkTopClass : linkScrolledClass]"
                >
                  <ClientOnly>
                    <Icon :icon="l.icon" class="shrink-0 size-4 me-3 md:me-2 block md:hidden" :class="isTop ? 'text-base-content' : 'text-gray-800 dark:text-neutral-200'" />
                    <template #fallback><span class="w-4 h-4 me-2 inline-block" /></template>
                  </ClientOnly>
                  {{ l.label }}
                </NuxtLink>

                <!-- Dropdown: Fitur -->
                <div class="hs-dropdown relative md:inline-flex md:[--strategy:fixed] [--strategy:static] [--adaptive:none] [--is-collapse:true] md:[--is-collapse:false]">
                  <button
                    id="hs-header-fitur"
                    type="button"
                    class="hs-dropdown-toggle w-full p-2 flex items-center text-sm rounded-lg transition-colors"
                    :class="!isScrolledOrOpen ? 'text-base-content hover:bg-white/10 focus:bg-white/10' : 'text-gray-800 hover:bg-gray-100 focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'"
                    aria-haspopup="menu"
                    aria-expanded="false"
                  >
                    <ClientOnly>
                      <Icon icon="ph:squares-four" class="shrink-0 size-4 me-3 md:me-2 block md:hidden" :class="isTop ? 'text-base-content' : 'text-gray-800 dark:text-neutral-200'" />
                      <template #fallback><span class="w-4 h-4 me-2 inline-block" /></template>
                    </ClientOnly>
                    Fitur
                    <ClientOnly>
                      <Icon icon="lucide:chevron-down" class="duration-300 shrink-0 size-4 ms-auto md:ms-1" :class="isScrolledOrOpen ? 'text-gray-500 dark:text-neutral-500' : 'text-base-content'" />
                    </ClientOnly>
                  </button>

                  <!-- Mega menu Fitur -->
                  <div
                    class="hs-dropdown-menu transition duration-150 opacity-0 hs-dropdown-open:opacity-100 pt-8 hidden md:fixed left-0 w-full min-w-60 z-10 top-full start-0 md:before:fixed before:-top-5 before:start-0 before:w-full before:h-5 md:mx-6 lg:mx-8 md:bg-white md:rounded-lg md:shadow-md dark:md:bg-neutral-800"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="hs-header-fitur"
                  >
                    <div class="py-1 md:p-2 md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div v-for="col in fiturMenu" :key="col.title" class="flex flex-col">
                        <span class="ms-2.5 mb-2 font-semibold text-xs uppercase text-gray-800 dark:text-neutral-200">{{ col.title }}</span>
                        <a
                          v-for="it in col.items"
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
                    </div>
                  </div>
                </div>

                <!-- Dropdown: Produk -->
                <div class="hs-dropdown relative md:inline-flex md:[--strategy:fixed] [--strategy:static] [--adaptive:none] [--is-collapse:true] md:[--is-collapse:false]">
                  <button
                    id="hs-header-produk"
                    type="button"
                    class="hs-dropdown-toggle w-full p-2 flex items-center text-sm rounded-lg transition-colors"
                    :class="!isScrolledOrOpen ? 'text-base-content hover:bg-white/10 focus:bg-white/10' : 'text-gray-800 hover:bg-gray-100 focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'"
                    aria-haspopup="menu"
                    aria-expanded="false"
                  >
                    <ClientOnly>
                      <Icon icon="ph:bag" class="shrink-0 size-4 me-3 md:me-2 block md:hidden" :class="isTop ? 'text-base-content' : 'text-gray-800 dark:text-neutral-200'" />
                      <template #fallback><span class="w-4 h-4 me-2 inline-block" /></template>
                    </ClientOnly>
                    Produk
                    <ClientOnly>
                      <Icon icon="lucide:chevron-down" class="duration-300 shrink-0 size-4 ms-auto md:ms-1" :class="isScrolledOrOpen ? 'text-gray-500 dark:text-neutral-500' : 'text-base-content'" />
                    </ClientOnly>
                  </button>

                  <!-- Mega menu Produk -->
                  <div
                    class="hs-dropdown-menu transition duration-150 opacity-0 pt-8 hs-dropdown-open:opacity-100 hidden md:fixed left-0 w-full min-w-60 z-10 top-full start-0 md:before:fixed before:-top-5 before:start-0 before:w-full before:h-5 md:mx-6 lg:mx-8 md:bg-white md:rounded-lg md:shadow-md dark:md:bg-neutral-800"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="hs-header-produk"
                  >
                    <div class="py-1 md:p-2 md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div v-for="col in produkMenu" :key="col.title" class="flex flex-col">
                        <span class="ms-2.5 mb-2 font-semibold text-xs uppercase text-gray-800 dark:text-neutral-200">{{ col.title }}</span>
                        <a
                          v-for="it in col.items"
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

                    </div>
                  </div>
                </div>
                <!-- /Dropdowns -->
              </div>
            </div>

            <!-- Divider -->
            <div class="my-2 md:my-0 md:mx-2">
              <div class="w-full h-px md:w-px md:h-4" :class="!isScrolledOrOpen ? 'bg-white/25' : 'bg-gray-100 md:bg-gray-300 dark:bg-neutral-700'"></div>
            </div>

            <!-- CTAs -->
            <div class="flex flex-wrap items-center gap-x-1.5">
              <NuxtLink to="/#pricing" :class="!isScrolledOrOpen ? outlineTopClass : outlineScrolledClass">Harga</NuxtLink>
              <a href="#demo" :class="!isScrolledOrOpen ? primaryTopClass : primaryScrolledClass">Coba Demo</a>
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

const isTop = ref(true)
const threshold = 8
const onScroll = () => { isTop.value = window.scrollY <= threshold }

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

/* Visual styles */
const topHeaderClass =
  'bg-white/10 backdrop-blur-xl border-transparent shadow-none scale-[0.99]'
const scrolledHeaderClass =
  'bg-white/90 dark:bg-neutral-800/90 backdrop-blur-xl border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-neutral-100 shadow-sm scale-100'

const linkBaseClass = 'p-2 flex items-center text-sm rounded-lg transition-colors'
const linkTopClass = 'hover:bg-white/10 focus:bg-white/10'
const linkScrolledClass = 'text-gray-800 hover:bg-gray-100 focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'

const outlineTopClass = 'py-[7px] px-2.5 inline-flex items-center font-medium text-sm rounded-lg border border-white/30 hover:bg-white/10'
const outlineScrolledClass = 'py-[7px] px-2.5 inline-flex items-center font-medium text-sm rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700'

const primaryTopClass = 'py-2 px-2.5 inline-flex items-center font-medium text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600'
const primaryScrolledClass = 'py-2 px-2.5 inline-flex items-center font-medium text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600'

/* Primary links */
const navLinks = ref([
  { label: 'Beranda', href: '/#home', icon: 'ph:house' },
  { label: 'Tentang', href: '/tentang', icon: 'ph:info' }
])

/* Mobile state */
const isMobileOpen = ref(false)
const isScrolledOrOpen = computed(() => !isTop.value || isMobileOpen.value)

/* Mega menus */
const fiturMenu = ref([
  {
    title: 'Akademik',
    items: [
      { label: 'SIAKAD', href: '/fitur?slug=siakad', icon: 'ph:student', desc: 'Manajemen data santri / murid, guru' },
      { label: 'Kelas Akademik', href: '/fitur?slug=kelas-akademik', icon: 'streamline-plump:class-lesson', desc: 'Jadwal, materi, tugas, ujian.' },
      { label: 'Data Nilai', href: '/fitur?slug=nilai-rapor', icon: 'tabler:chart-line', desc: 'Manajemen perkembangan santri / murid' },
      { label: 'Prestasi', href: '/fitur?slug=prestasi', icon: 'fluent:trophy-20-regular', desc: 'Simpan dan publish data prestasi' },
      { label: 'Absensi', href: '/fitur?slug=absensi', icon: 'lucide:user-check', desc: 'Absensi harian & per-sesi terintegrasi' },
  ]
  },
  {
    title: 'Operasional',
    items: [
      { label: 'Agenda', href: '/fitur?slug=agenda', icon: 'mynaui:calendar', desc: 'Manajemen data agenda dan acara' },
      { label: 'Pengumuman', href: '/fitur?slug=pengumuman', icon: 'mingcute:announcement-line', desc: 'Pengumuman internal dan external secara realtime' },
      { label: 'Berita Informasi', href: '/fitur?slug=berita-informasi', icon: 'iconamoon:news-light', desc: 'Publish dan manajemen data berita, article' },
      { label: 'Perizinan & Printout', href: '/fitur?slug=perizinan-printout', icon: 'hugeicons:note', desc: 'Record data perizinan dan integrasikan pada printer' },
      { label: 'Pelanggaran', href: '/fitur?slug=pelanggaran', icon: 'mingcute:fault-line', desc: 'Izin keluar/sakit/tugas.' },
      { label: 'Jadwal Piket', href: '/fitur?slug=perizinan', icon: 'uil:list-ol', desc: 'Jadwalkan piket secara berkala dan printout' }
    ]
  },
  {
    title: 'Lain lain',
    items: [
      { label: 'Pembayaran', href: '/fitur?slug=pembayaran', icon: 'akar-icons:money', desc: 'SPP, Syahriyah & Rekonsiliasi.' },
      { label: 'Laporan Keuangan', href: '/fitur?slug=laporan-keuangan', icon: 'mynaui:chart-line', desc: 'Laporan keuangan setiap hari' },
      { label: 'Profile Web Editor', href: '/fitur?slug=profile-web-editor', icon: 'fluent:design-ideas-24-regular', desc: 'Kustomisasi dan edit kebutuhan web tanpa ribet' },
      { label: 'Hak Akses', href: '/fitur?slug=hak-akses', icon: 'hugeicons:access', desc: 'Tugaskan pengurus secara spesifik menjadi admin' },
    ]
  }
])

const produkMenu = ref([
  {
    title: 'Website',
    items: [
      { label: 'Obayan Siakad', href: '/produk?slug=obayan-siakad', icon: 'mingcute:web-line', desc: 'Sistem Management Pendidikan' },
      { label: 'Obayan CMS', href: '/produk?slug=obayan-cms', icon: 'ph:globe', desc: 'Website Customable dan Editable' },
    ]
  },
  {
    title: 'Mobile App',
    items: [
      { label: 'Obayan App', href: '/produk?slug=obayan-app', icon: 'duo-icons:app', desc: 'Aplikasi Monitoring Santri / Murid' },
      { label: 'Obayan CBT', href: '/produk?slug=obayan-cbt', icon: 'garden:app-26', desc: 'Aplikasi Ujian Pendidikan' },
    ]
  },
  {
    title: 'Best Add-On',
    items: [
      { label: 'ToriID', href: '/produk?slug=toriid', icon: 'ph:identification-badge', desc: 'System Attendance Terintegrasi & Realtime' },
      { label: 'Autobot', href: '/produk?slug=autobot', icon: 'mage:robot', desc: 'Bot messaging email / whatsapp / telegram' },
    ]
  },
])

/* CTA card in Produk */
const ppdbCta = ref({
  title: 'PPDB Online 2025/2026',
  desc: 'Penerimaan Peserta Didik Baru. Daftar mudah & cepat.',
  href: '/#ppdb',
  image: '/assets/images/activity.jpg'
})
</script>
