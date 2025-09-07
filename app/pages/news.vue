<template>
  <section id="news" class="relative overflow-hidden dark:bg-neutral-900 bg-gray-100">
    <!-- Subtle BG grid + blobs -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div class="absolute top-10 -left-24 w-[42rem] h-[42rem] rounded-full opacity-40 blur-3xl
                  bg-gradient-to-br from-blue-200 to-blue-200 dark:from-blue-900/40 dark:to-blue-900/30" />
      <div class="absolute bottom-10 -right-24 w-[36rem] h-[36rem] rounded-full opacity-30 blur-3xl
                  bg-gradient-to-tr from-blue-100 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/30" />
      <div class="absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent_80%)]">
        <div class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,0,0,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,.06)_1px,transparent_1px)] bg-[size:32px_32px]
                    dark:bg-[linear-gradient(to_right,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.06)_1px,transparent_1px)]" />
      </div>
    </div>

    <!-- HERO -->
    <div class="relative">
      <div class="absolute inset-0">
        <img :src="cfg.hero.cover" class="w-full heroH object-cover opacity-80"
             :style="{'--hero-sm': cfg.hero.heightSm, '--hero-lg': cfg.hero.heightLg}" alt="Cover News">
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
      </div>
      <div class="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 heroH flex items-end"
           :style="{'--hero-sm': cfg.hero.heightSm, '--hero-lg': cfg.hero.heightLg}">
        <div class="mb-10">
          <p class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-blue-200">
            <span class="inline-block size-2 rounded-full bg-blue-400" /> {{ cfg.hero.badge }}
          </p>
          <h1 class="mt-1 text-3xl sm:text-5xl font-bold text-white">{{ cfg.hero.title }}</h1>
          <p class="mt-2 text-blue-100">{{ cfg.hero.subtitle }}</p>
        </div>
      </div>
    </div>

    <!-- BODY -->
    <div class="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
      <!-- DETAIL -->
      <div v-if="isDetail" class="max-w-3xl mx-auto">
        <div class="flex items-center justify-between">
          <button @click="backToList" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-3 py-1.5 text-sm hover:bg-blue-700">
            <Icon icon="ph:arrow-left" class="size-4" /> Kembali
          </button>

          <div class="flex items-center gap-2">
            <button @click="copyLink" class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 px-3 py-1.5 text-sm text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-700">
              <Icon icon="ph:link" class="size-4" /> Salin Tautan
            </button>
            <button type="button"
                data-hs-overlay="#hs-share-modal"
                class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 px-3 py-1.5 text-sm text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-700">
              <Icon icon="ph:share-network" class="size-4" /> Bagikan
            </button>
          </div>
        </div>

        <div v-if="!current && !pending" class="mt-8 rounded-2xl border border-dashed border-gray-300 dark:border-neutral-700 p-10 text-center">
          <p class="text-gray-600 dark:text-neutral-300">{{ cfg.texts.notFound }}</p>
          <button @click="backToList" class="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700">
            <Icon icon="ph:arrow-left" class="size-4" /> Kembali ke Daftar
          </button>
        </div>

        <div v-if="pending" class="mt-6 space-y-3">
          <div class="h-8 w-3/4 bg-gray-200/70 dark:bg-neutral-700 rounded animate-pulse" />
          <div class="h-4 w-1/2 bg-gray-200/70 dark:bg-neutral-700 rounded animate-pulse" />
          <div class="h-72 bg-gray-200/70 dark:bg-neutral-700 rounded-xl animate-pulse" />
          <div class="h-40 bg-gray-200/70 dark:bg-neutral-700 rounded animate-pulse" />
        </div>

        <article v-else-if="current" class="mt-6">
          <h2 class="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">{{ current.title }}</h2>

          <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-gray-600 dark:text-neutral-300">
            <span class="inline-flex items-center gap-1">
              <Icon icon="ph:calendar" class="size-4" />
              {{ formatDate(current.publishedAt) }}
            </span>
            <span aria-hidden="true">•</span>
            <span class="inline-flex items-center gap-1">
              <Icon icon="ph:clock" class="size-4" />
              {{ current.readTime }} min read
            </span>
            <template v-if="current.category">
              <span aria-hidden="true">•</span>
              <span class="inline-flex items-center gap-1">
                <Icon icon="ph:bookmark-simple" class="size-4" />
                {{ current.category }}
              </span>
            </template>
            <template v-if="current.tags?.length">
              <span aria-hidden="true">•</span>
              <span class="inline-flex items-center gap-1">
                <Icon icon="ph:hash" class="size-4" />
                <span class="flex items-center gap-1">
                  <span v-for="t in current.tags" :key="t" class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-neutral-700">{{ t }}</span>
                </span>
              </span>
            </template>
          </div>

          <img v-if="current.cover" :src="current.cover" :alt="current.title" class="mt-5 w-full rounded-2xl border border-gray-200 dark:border-neutral-700" />

          <div class="mt-6 leading-relaxed text-[15px] text-gray-800 dark:text-neutral-100 space-y-4" v-html="renderedDetailHtml" />

          <div class="mt-10">
            <button @click="backToList" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700">
              <Icon icon="ph:arrow-left" class="size-4" /> Kembali ke Daftar
            </button>
          </div>
        </article>
      </div>

      <!-- LIST -->
      <div v-else>
        <!-- Filters -->
        <div class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-4">
          <div class="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div class="flex-1 flex items-center gap-2">
              <label class="relative flex-1">
                <input v-model="q" type="text" :placeholder="cfg.texts.searchPlaceholder"
                       class="w-full rounded-lg border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-100 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600">
                <span class="absolute right-3 top-2.5 text-gray-400 text-xs">{{ filtered.length }} hasil</span>
              </label>

              <div>
                <select v-model="selectedCategory"
                        class="block w-52 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm text-gray-700 dark:text-neutral-200 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="">Semua Kategori</option>
                  <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>

              <div class="hidden sm:block">
                <select v-model="sortBy"
                        class="rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/90 text-gray-800 dark:text-neutral-100 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden">
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="title">Judul (A–Z)</option>
                </select>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <button v-for="t in allTags" :key="t" @click="toggleTag(t)"
                      class="text-[12px] px-2.5 py-1.5 rounded-full border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-100"
                      :class="selectedTags.has(t) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/80 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300'">
                #{{ t }}
              </button>
              <button @click="resetFilters" class="text-[12px] px-2.5 py-1.5 rounded-full border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-100 hover:bg-gray-50 dark:hover:bg-neutral-800">
                Reset
              </button>
            </div>
          </div>
        </div>

        <div class="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <template v-if="pending">
            <div v-for="i in 6" :key="i" class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 p-3">
              <div class="h-40 bg-gray-200/70 dark:bg-neutral-700 rounded-xl animate-pulse" />
              <div class="mt-3 h-4 w-32 bg-gray-200/70 dark:bg-neutral-700 rounded animate-pulse" />
              <div class="mt-2 h-6 w-3/4 bg-gray-200/70 dark:bg-neutral-700 rounded animate-pulse" />
              <div class="mt-2 h-4 w-5/6 bg-gray-200/70 dark:bg-neutral-700 rounded animate-pulse" />
            </div>
          </template>

          <template v-else>
            <article v-for="a in paged" :key="a.slug"
                     @click="openDetail(a.slug)"
                     class="group relative cursor-pointer rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 hover:shadow transition">
              <div class="relative h-44 overflow-hidden">
                <img :src="a.cover" :alt="a.title" class="w-full h-full object-cover group-hover:scale-[1.02] transition" />
                <span v-if="a.category" class="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/55 text-white px-2 py-0.5 text-[11px]">
                  {{ a.category }}
                </span>
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-gray-900 dark:text-white line-clamp-2">{{ a.title }}</h3>
                <p class="mt-2 text-sm text-gray-600 dark:text-neutral-300 line-clamp-3">{{ a.excerpt }}</p>
                <div class="mt-3 flex items-center justify-between text-[12px] text-gray-500 dark:text-neutral-400">
                  <div class="flex items-center gap-2">
                    <span>{{ formatDate(a.publishedAt) }}</span>
                    <span aria-hidden="true">•</span>
                    <span>{{ a.readTime }} min read</span>
                  </div>
                  <div class="hidden sm:flex flex-wrap gap-1">
                    <span v-for="t in a.tags" :key="t" class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-neutral-700">#{{ t }}</span>
                  </div>
                </div>
              </div>
            </article>
          </template>
        </div>

        <div v-if="!pending && filtered.length === 0" class="mt-10 rounded-2xl border border-dashed border-gray-300 dark:border-neutral-700 p-10 text-center">
          <p class="text-gray-600 dark:text-neutral-300">{{ cfg.texts.emptyList }}</p>
        </div>

        <div v-if="hasMore && !pending" class="mt-8 text-center">
          <button @click="loadMore" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700">
            <Icon icon="ph:arrow-circle-down" class="size-4" />
            {{ cfg.texts.loadMore }}
          </button>
        </div>
      </div>

      <!-- Share Modal (Preline) -->
      <div id="hs-share-modal"
           class="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-y-auto pointer-events-none">
        <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-300 mt-0 opacity-0 transition-all
                    sm:max-w-md mx-auto p-4 max-h-[calc(100%-3.5rem)] h-auto">
          <div class="pointer-events-auto bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700
                      rounded-2xl shadow-lg">
            <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-neutral-700">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">Bagikan</h3>
              <button type="button" class="size-8 inline-flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700"
                      data-hs-overlay="#hs-share-modal" aria-label="Tutup">
                <Icon icon="ph:x" class="size-4 text-gray-500 dark:text-neutral-300" />
              </button>
            </div>

            <div class="p-4 grid gap-2">
              <button type="button"
                      @click="nativeShare"
                      class="w-full inline-flex items-center gap-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-neutral-700">
                <Icon icon="ph:device-mobile" class="size-4" />
                <span>Sistem Bagikan</span>
              </button>

              <a :href="facebookHref" target="_blank" rel="noopener"
                 class="w-full inline-flex items-center gap-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-neutral-700">
                <Icon icon="mdi:facebook" class="size-4" />
                <span>Facebook</span>
              </a>

              <a :href="twitterHref" target="_blank" rel="noopener"
                 class="w-full inline-flex items-center gap-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-neutral-700">
                <Icon icon="ri:twitter-x-line" class="size-4" />
                <span>X (Twitter)</span>
              </a>

              <a :href="whatsappHref" target="_blank" rel="noopener"
                 class="w-full inline-flex items-center gap-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-neutral-700">
                <Icon icon="mdi:whatsapp" class="size-4" />
                <span>WhatsApp</span>
              </a>

              <button type="button"
                      @click="copyShare"
                      class="w-full inline-flex items-center justify-between gap-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-neutral-700">
                <span class="inline-flex items-center gap-3">
                  <Icon icon="ph:link" class="size-4" />
                  <span>Salin link</span>
                </span>
                <span v-if="copied" class="text-xs text-green-600 dark:text-green-400">Tersalin!</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="error" class="mt-8 rounded-2xl border border-rose-300/60 dark:border-rose-700 bg-rose-50/60 dark:bg-rose-900/30 p-4 text-sm text-rose-700 dark:text-rose-200">
        {{ error }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useNews } from '~/composables/data/useNews'
import { useWeb } from '~/composables/data/useWeb'

defineOptions({ name: 'NewsPage' })

const {
  pending, error, items,
  q, selectedCategory, selectedTags, sortBy, toggleTag, resetFilters,
  filtered, paged, hasMore, page, pageSize,
  isDetail, current, openDetail, backToList,
  renderedDetailHtml, categories
} = useNews()

function loadMore() { page.value++ }
function formatDate(ts: number) {
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(ts)
}

const PAGE_DEFAULTS = {
  hero: {
    cover: '/assets/images/profile.png',
    badge: 'Kabar Terbaru',
    title: 'Berita Pondok Pesantren Alberr',
    subtitle: 'Informasi kegiatan, pengumuman, dan liputan santri.',
    heightSm: '36vh',
    heightLg: '44vh'
  },
  texts: {
    searchPlaceholder: 'Cari berita (judul/isi/tag)…',
    emptyList: 'Berita masih kosong.',
    notFound: 'Berita tidak ditemukan.',
    loadMore: 'Tampilkan Lebih Banyak'
  }
} as const

const route = useRoute()
const runtime = useRuntimeConfig()
const siteUrl = runtime.public?.siteUrl || ''

const web = useWeb()
const { data: pageSnap } = await useAsyncData(`webpage-${route.path}`, () => web.getPageSnapshot(route.path))

const newsSectionProps = computed<any>(() => {
  const sections = pageSnap.value?.sections || []
  return sections.find((s: any) => s?.key === 'NewsPage')?.props || {}
})

const cfg = computed(() => ({
  hero: {
    cover: newsSectionProps.value?.hero?.cover || PAGE_DEFAULTS.hero.cover,
    badge: newsSectionProps.value?.hero?.badge || PAGE_DEFAULTS.hero.badge,
    title: newsSectionProps.value?.hero?.title || PAGE_DEFAULTS.hero.title,
    subtitle: newsSectionProps.value?.hero?.subtitle || PAGE_DEFAULTS.hero.subtitle,
    heightSm: newsSectionProps.value?.hero?.heightSm || PAGE_DEFAULTS.hero.heightSm,
    heightLg: newsSectionProps.value?.hero?.heightLg || PAGE_DEFAULTS.hero.heightLg
  },
  texts: {
    searchPlaceholder: newsSectionProps.value?.texts?.searchPlaceholder || PAGE_DEFAULTS.texts.searchPlaceholder,
    emptyList: newsSectionProps.value?.texts?.emptyList || PAGE_DEFAULTS.texts.emptyList,
    notFound: newsSectionProps.value?.texts?.notFound || PAGE_DEFAULTS.texts.notFound,
    loadMore: newsSectionProps.value?.texts?.loadMore || PAGE_DEFAULTS.texts.loadMore
  }
}))

const pageMeta = computed<any>(() => pageSnap.value?.meta || {})

const canonical = computed(() => {
  try { return new URL(route.fullPath || '/', siteUrl).toString() }
  catch { return siteUrl || '/' }
})

const baseTitle = computed(() => pageMeta.value?.title || 'Berita | Pondok Pesantren Alberr')
const baseDesc  = computed(() => pageMeta.value?.description || 'Kumpulan kabar terbaru: kegiatan, pengumuman, prestasi, kajian santri.')
const twitterSite = computed(() => pageMeta.value?.twitterSite || undefined)
const themeColor  = computed(() => pageMeta.value?.themeColor || '#0ea5e9')
const robots      = computed(() => pageMeta.value?.robots || 'index, follow')
const ogImage     = computed(() => current?.value?.cover || pageMeta.value?.ogImage || '/assets/logo.png')

const pageTitle = computed(() => isDetail.value ? (current?.value?.title ?? baseTitle.value) : baseTitle.value)
const pageDesc  = computed(() => isDetail.value ? (current?.value?.excerpt || baseDesc.value) : baseDesc.value)

useSeoMeta({
  title: pageTitle,
  description: pageDesc,
  ogTitle: pageTitle,
  ogDescription: pageDesc,
  ogType: computed(() => isDetail.value ? 'article' : 'website'),
  ogUrl: canonical,
  ogImage,
  twitterCard: 'summary_large_image',
  twitterSite,
  themeColor,
  robots
})

useHead({ link: [{ rel: 'canonical', href: canonical.value }] })

watch(current, () => {
  if (!current?.value) return
  const art = current.value
  const origin = siteUrl || (typeof window !== 'undefined' ? window.location.origin : '/')
  useHead({
    script: [{
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: art.title,
        datePublished: new Date(art.publishedAt || Date.now()).toISOString(),
        dateModified: new Date(art.publishedAt || Date.now()).toISOString(),
        image: art.cover ? [ new URL(art.cover, origin).toString() ] : [],
        author: { '@type': 'Organization', name: 'Pondok Pesantren Alberr' },
        publisher: {
          '@type': 'Organization',
          name: 'Pondok Pesantren Alberr',
          logo: { '@type': 'ImageObject', url: new URL('/assets/logo.png', origin).toString() }
        },
        mainEntityOfPage: canonical.value
      })
    }]
  })
})

async function copyLink() { try { await navigator.clipboard.writeText(canonical.value) } catch {} }
const shareText   = computed(() => (current?.value?.title && isDetail.value) ? current.value.title : 'Berita Ponpes Alberr')
const encodedUrl  = computed(() => encodeURIComponent(canonical.value))
const encodedText = computed(() => encodeURIComponent(`${shareText.value} – ${canonical.value}`))
const facebookHref = computed(() => `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl.value}`)
const twitterHref  = computed(() => `https://twitter.com/intent/tweet?url=${encodedUrl.value}&text=${encodeURIComponent(shareText.value)}`)
const whatsappHref = computed(() => `https://wa.me/?text=${encodedText.value}`)

const copied = ref(false)
async function copyShare() { await copyLink(); copied.value = true; setTimeout(() => (copied.value = false), 1200) }
async function nativeShare() {
  try {
    if (navigator.share) { await navigator.share({ title: shareText.value, text: shareText.value, url: canonical.value }) }
    else { await copyShare() }
  } catch {}
}
</script>

<style scoped>
.heroH { height: var(--hero-sm); }
@media (min-width: 640px) {
  .heroH { height: var(--hero-lg); }
}
</style>
