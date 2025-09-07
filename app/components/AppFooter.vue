<template>
  <div class="dark:bg-neutral-900 bg-gray-100">
    <HeroContactHero/>
    <footer class="mt-auto w-full py-10 max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto">
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-10">
        <div class="col-span-full hidden lg:col-span-1 lg:block">
          <a class="flex-none font-semibold text-xl text-black dark:text-white" href="#" aria-label="Brand">
            {{ footerBrand.name }}
          </a>
          <p class="mt-3 text-xs sm:text-sm text-gray-600 dark:text-neutral-400">
            {{ footerBrand.desc }}
          </p>
        </div>

        <div v-for="section in footerSections" :key="section.title">
          <h4 class="text-xs font-semibold text-gray-900 uppercase dark:text-neutral-100">
            {{ section.title }}
          </h4>
          <div class="mt-3 grid space-y-3 text-sm">
            <p v-for="item in section.items" :key="item.label">
              <a
                :href="item.href"
                class="inline-flex items-center gap-x-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200"
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

            <!-- Legal -->
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
            <div class="mt-3 sm:hidden">
              <a class="flex-none font-semibold text-xl text-black dark:text-white" href="#" aria-label="Brand">
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
                rel="noopener"
              >
                <ClientOnly>
                  <Icon :icon="s.icon" class="shrink-0 size-4" />
                  <template #fallback><span class="w-4 h-4 inline-block" /></template>
                </ClientOnly>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
    <BannerSencraBanner/>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'
import { useNuxtApp } from '#app'
import { ref as dbRef, onValue, off } from 'firebase/database'

type FooterItem = { label: string; href: string; icon?: string; badge?: string }
type FooterSection = { title: string; items: FooterItem[] }
type Language = { code: string; label: string; icon: string }

const year = 2025
const footerBrand = ref({ name: 'ALBERR', desc: `© ${year} Ponpes ALBERR.` })

/* sections & bottom links tetap default */
const footerSections = ref<FooterSection[]>([
  { title: 'Program', items: [
    { label: 'Kurikulum', href: '/program', icon: 'ph:book-open' },
    { label: 'Kegiatan Santri', href: '/#news', icon: 'ph:calendar-check' },
  ]},
  { title: 'Tentang Kami', items: [
    { label: 'Profil Pesantren', href: '/profile', icon: 'ph:student' },
    { label: 'Visi & Misi', href: '/#information', icon: 'ph:target' },
    { label: 'Berita', href: '/news', icon: 'ph:newspaper' },
    { label: 'Kontak', href: '#contact', icon: 'ph:phone' },
  ]},
  { title: 'Layanan Digital', items: [
    { label: 'Portal WaliSantri', href: '/waliLogin', icon: 'ph:graduation-cap' },
    { label: 'Sistem Informasi Akademik', href: '/program', icon: 'ph:desktop' },
    { label: 'Pembayaran', href: '/waliLogin', icon: 'ph:qr-code' },
  ]},
])
const footerBottomLinks = ref([
  { label: 'Terms', href: '#' },
  { label: 'Privacy', href: '#' },
  { label: 'Status', href: '#' }
])

/* Sosial: replace oleh RTDB */
const socialLinks = ref([
  { label: 'Instagram', href: '#', icon: 'mdi:instagram' },
  { label: 'YouTube', href: '#', icon: 'mdi:youtube' },
  { label: 'Facebook', href: '#', icon: 'mdi:facebook' },
])

/* Bahasa (dummy) */
const languages = ref<Language[]>([
  { code: 'id', label: 'Bahasa Indonesia', icon: 'circle-flags:id' },
  { code: 'en', label: 'English (US)', icon: 'circle-flags:us' },
  { code: 'ar', label: 'العربية', icon: 'circle-flags:sa' },
])
const selectedLanguage = ref<Language>(languages.value[0]!)
function setLanguage(code: string) {
  const found = languages.value.find((l) => l.code === code)
  if (found) selectedLanguage.value = found
}

/* Subscribe brand & socials dari /alberr/contact */
let unbind: null | (() => void) = null
function bindFooter() {
  const { $realtimeDb } = useNuxtApp() as any
  const r = dbRef($realtimeDb, 'alberr/contact')
  const h = onValue(r, (s) => {
    const data = s.val() || {}
    const brand = data?.footer?.brand
    const socials = Array.isArray(data?.socials) ? data.socials : null
    if (brand?.name || brand?.desc) {
      footerBrand.value = {
        name: brand?.name || footerBrand.value.name,
        desc: brand?.desc || footerBrand.value.desc
      }
    }
    if (socials) {
      socialLinks.value = socials
    }
  })
  unbind = () => off(r, 'value', h as any)
}
onMounted(bindFooter)
onBeforeUnmount(()=>{ unbind?.(); unbind=null })
</script>
