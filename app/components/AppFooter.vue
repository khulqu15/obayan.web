<template>
  <div class="dark:bg-neutral-900 bg-gray-100">
    <HeroContactHero />

    <footer class="mt-auto w-full py-10 max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto">
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-10">
        <div class="col-span-full hidden lg:col-span-1 lg:block">
          <a class="font-semibold text-xl text-black dark:text-white flex items-center gap-3" href="/" aria-label="Obayan">
            <img src="/logo.png" class="w-10" alt=""> <span>{{ footerBrand.name }}</span>
          </a>
          <p class="mt-3 text-xs sm:text-sm text-gray-600 dark:text-neutral-400">
            {{ footerBrand.desc }}
          </p>
        </div>

        <!-- Sections -->
        <div v-for="section in footerSections" :key="section.title">
          <h4 class="text-xs font-semibold text-gray-900 uppercase dark:text-neutral-100">
            {{ section.title }}
          </h4>
          <div class="mt-3 grid space-y-3 text-sm">
            <p v-for="item in section.items" :key="item.label">
              <a
                :href="item.href"
                class="inline-flex items-center gap-x-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                :aria-label="item.label"
              >
                <ClientOnly v-if="item.icon">
                  <Icon :icon="item.icon" class="shrink-0 size-4" aria-hidden="true" />
                  <template #fallback>
                    <span class="inline-block w-4 h-4 rounded-sm bg-gray-200 dark:bg-neutral-700" />
                  </template>
                </ClientOnly>
                <span>{{ item.label }}</span>
                <span v-if="item.badge" class="inline text-blue-600 dark:text-blue-500">— {{ item.badge }}</span>
              </a>
            </p>
          </div>
        </div>
      </div>

      <div class="pt-5 mt-5 border-t border-gray-200 dark:border-neutral-700">
        <div class="sm:flex sm:justify-between sm:items-center">
          <div class="flex flex-wrap items-center gap-3">
            <!-- Language -->
            <div class="hs-dropdown [--placement:top-left] relative inline-flex">
              <button
                id="hs-footer-language-dropdown"
                type="button"
                class="hs-dropdown-toggle py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-label="Language Dropdown"
              >
                <ClientOnly>
                  <Icon :icon="selectedLanguage.icon" class="shrink-0 size-4 rounded-full" />
                  <template #fallback><span class="w-4 h-4 rounded-full bg-gray-200 inline-block" /></template>
                </ClientOnly>
                {{ selectedLanguage.label }}
                <ClientOnly>
                  <Icon icon="lucide:chevron-down" class="shrink-0 size-4 text-gray-500 dark:text-neutral-500" />
                  <template #fallback><span class="w-4 h-4 inline-block" /></template>
                </ClientOnly>
              </button>

              <div
                class="hs-dropdown-menu w-44 transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden z-10 bg-white shadow-md rounded-lg p-2 dark:bg-neutral-800 dark:border dark:border-neutral-700"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="hs-footer-language-dropdown"
              >
                <a
                  v-for="lang in languages"
                  :key="lang.code"
                  href="#"
                  class="flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm hover:bg-gray-100 text-gray-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                  role="menuitem"
                  @click.prevent="setLanguage(lang.code)"
                >
                  <ClientOnly>
                    <Icon :icon="lang.icon" class="shrink-0 size-4 rounded-full" />
                    <template #fallback><span class="w-4 h-4 rounded-full bg-gray-200 inline-block" /></template>
                  </ClientOnly>
                  <span>{{ lang.label }}</span>
                </a>
              </div>
            </div>

            <!-- Legal shortcuts -->
            <div class="space-x-4 text-sm">
              <a
                v-for="l in footerBottomLinks"
                :key="l.label"
                :href="l.href"
                class="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200"
              >
                {{ l.label }}
              </a>
            </div>
          </div>

          <!-- Right: brand (sm only) + socials -->
          <div class="flex flex-wrap justify-between items-center gap-3">
            <!-- Brand (sm only) -->
            <div class="mt-3 sm:hidden">
              <a class="flex-none font-semibold text-xl text-black dark:text-white" href="/" aria-label="Obayan">
                {{ footerBrand.name }}
              </a>
              <p class="mt-1 text-xs sm:text-sm text-gray-600 dark:text-neutral-400">
                {{ footerBrand.desc }}
              </p>
            </div>

            <!-- Socials -->
            <div class="space-x-4">
              <a
                v-for="s in socialLinks"
                :key="s.label"
                :href="s.href"
                class="inline-block text-gray-500 hover:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200"
                :aria-label="s.label"
                rel="noopener noreferrer"
                target="_blank"
              >
                <ClientOnly>
                  <Icon :icon="s.icon" class="shrink-0 size-4" />
                  <template #fallback><span class="w-4 h-4 inline-block" /></template>
                </ClientOnly>
              </a>
            </div>
          </div>
        </div>

        <p class="mt-4 text-xs text-gray-500 dark:text-neutral-400">
          © {{ year }} Obayan. All rights reserved.
        </p>
      </div>
    </footer>

    <BannerSencraBanner />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

type FooterItem = { label: string; href: string; icon?: string; badge?: string }
type FooterSection = { title: string; items: FooterItem[] }
type Language = { code: string; label: string; icon: string }

const year = new Date().getFullYear()

const footerBrand = ref({
  name: 'Obayan',
  desc: 'Platform Pesantren Modern, Web Profile, SIAKAD, Pembayaran, Akademik, Absensi (ToriID), Kunjungan, Pelanggaran, Perizinan.'
})

/** ======= OBAYAN SECTIONS ======= */
const footerSections = ref<FooterSection[]>([
  {
    title: 'Produk',
    items: [
      { label: 'Web Profile', href: '/#products', icon: 'ph:globe' },
      { label: 'SIAKAD', href: '/#products', icon: 'ph:student' },
      { label: 'Pembayaran', href: '/#products', icon: 'ph:bank' },
      { label: 'Akademik', href: '/#products', icon: 'ph:chalkboard-teacher' },
      { label: 'Absensi (ToriID)', href: '/#integrations', icon: 'ph:identification-badge' },
      { label: 'Kunjungan', href: '/#products', icon: 'ph:map-pin' },
      { label: 'Pelanggaran', href: '/#products', icon: 'ph:warning' },
      { label: 'Perizinan', href: '/#products', icon: 'ph:note-pencil' },
    ],
  },
  {
    title: 'Sumber Daya',
    items: [
      { label: 'Dokumentasi API', href: '#', icon: 'ph:book-open-text' },
      { label: 'Status Layanan', href: '#', icon: 'ph:activity' },
      { label: 'Pusat Bantuan', href: '#', icon: 'ph:lifebuoy' },
      { label: 'Changelog', href: '#', icon: 'ph:git-commit' },
    ],
  },
  {
    title: 'Perusahaan',
    items: [
      { label: 'Tentang Obayan', href: '#', icon: 'ph:info' },
      { label: 'Karier', href: '#', icon: 'ph:briefcase' },
      { label: 'Kemitraan', href: '#', icon: 'ph:handshake' },
      { label: 'Kontak', href: '#', icon: 'ph:phone' },
      { label: 'Blog & Berita', href: '#', icon: 'ph:newspaper' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { label: 'Ketentuan Layanan', href: '#', icon: 'ph:scroll' },
      { label: 'Kebijakan Privasi', href: '#', icon: 'ph:lock' },
      { label: 'DPA', href: '#', icon: 'ph:file-text' },
      { label: 'SLA', href: '#', icon: 'ph:shield-check' },
    ],
  },
])

/** ======= LINKS BAWAH ======= */
const footerBottomLinks = ref([
  { label: 'Terms', href: '#' },
  { label: 'Privacy', href: '#' },
  { label: 'Security', href: '#' },
  { label: 'Status', href: '#' },
])

/** ======= SOSMED ======= */
const socialLinks = ref([
  { label: 'X (Twitter)', href: 'https://x.com/obayan', icon: 'ri:twitter-x-fill' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/obayan', icon: 'mdi:linkedin' },
  { label: 'GitHub', href: 'https://github.com/obayan', icon: 'mdi:github' },
  { label: 'YouTube', href: 'https://youtube.com/@obayan', icon: 'mdi:youtube' },
  { label: 'Instagram', href: 'https://instagram.com/obayan', icon: 'mdi:instagram' },
])

/** ======= BAHASA ======= */
const languages = ref<Language[]>([
  { code: 'id', label: 'Bahasa Indonesia', icon: 'circle-flags:id' },
  { code: 'en', label: 'English (US)', icon: 'circle-flags:us' },
  { code: 'ar', label: 'العربية', icon: 'circle-flags:sa' },
])
const selectedLanguage = ref<Language>(languages.value[0]!)

function setLanguage(code: string) {
  const found = languages.value.find((l) => l.code === code)
  if (found) {
    selectedLanguage.value = found
    if (process.client) localStorage.setItem('obayan-lang', code)
    // tinggal sambungkan ke i18n router kalau sudah ada
  }
}

onMounted(() => {
  if (process.client) {
    const saved = localStorage.getItem('obayan-lang')
    if (saved) {
      const found = languages.value.find((l) => l.code === saved)
      if (found) selectedLanguage.value = found
    }
  }
})
</script>
