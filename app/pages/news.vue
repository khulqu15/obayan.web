<template>
  <section id="news" class="relative overflow-hidden bg-gray-100 dark:bg-neutral-900">
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div
        class="absolute -left-24 top-10 h-[42rem] w-[42rem] rounded-full bg-gradient-to-br from-blue-200 to-blue-200 opacity-40 blur-3xl dark:from-blue-900/40 dark:to-blue-900/30"
      />
      <div
        class="absolute -right-24 bottom-10 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-blue-100 to-blue-100 opacity-30 blur-3xl dark:from-blue-900/30 dark:to-blue-900/30"
      />
      <div class="absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent_80%)]">
        <div
          class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,0,0,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,.06)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.06)_1px,transparent_1px)]"
        />
      </div>
    </div>

    <div class="relative">
      <div class="absolute inset-0">
        <img
          :src="profile.heroImage"
          class="h-[36vh] w-full object-cover opacity-80 sm:h-[44vh]"
          :alt="profile.title"
          @error="onHeroImageError"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
      </div>

      <div class="relative mx-auto flex h-[36vh] max-w-[85rem] items-end px-4 sm:h-[44vh] sm:px-6 lg:px-8">
        <div class="mb-10">
          <p class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-blue-200">
            <span class="inline-block size-2 rounded-full bg-blue-400" />
            {{ profile.eyebrow }}
          </p>
          <h1 class="mt-1 text-3xl font-bold text-white sm:text-5xl">
            {{ profile.title }}
          </h1>
          <p class="mt-2 max-w-3xl text-blue-100">
            {{ profile.subtitle }}
          </p>
        </div>
      </div>
    </div>

    <div class="relative mx-auto max-w-[85rem] px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div v-if="isDetail" class="mx-auto max-w-3xl">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
            @click="backToList"
          >
            <Icon icon="ph:arrow-left" class="size-4" />
            Kembali
          </button>

          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white/70 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-200 dark:hover:bg-neutral-700"
              @click="copyLink"
            >
              <Icon icon="ph:link" class="size-4" />
              Salin Tautan
            </button>

            <button
              type="button"
              data-hs-overlay="#hs-share-modal"
              class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white/70 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-200 dark:hover:bg-neutral-700"
            >
              <Icon icon="ph:share-network" class="size-4" />
              Bagikan
            </button>
          </div>
        </div>

        <div v-if="!current && !pending" class="mt-8 rounded-2xl border border-dashed border-gray-300 p-10 text-center dark:border-neutral-700">
          <p class="text-gray-600 dark:text-neutral-300">Berita tidak ditemukan.</p>
          <button
            type="button"
            class="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            @click="backToList"
          >
            <Icon icon="ph:arrow-left" class="size-4" />
            Kembali ke Daftar
          </button>
        </div>

        <div v-if="pending" class="mt-6 space-y-3">
          <div class="h-8 w-3/4 animate-pulse rounded bg-gray-200/70 dark:bg-neutral-700" />
          <div class="h-4 w-1/2 animate-pulse rounded bg-gray-200/70 dark:bg-neutral-700" />
          <div class="h-72 animate-pulse rounded-xl bg-gray-200/70 dark:bg-neutral-700" />
          <div class="h-40 animate-pulse rounded bg-gray-200/70 dark:bg-neutral-700" />
        </div>

        <article v-else-if="current" class="mt-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            {{ current.title }}
          </h2>

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
                <span class="flex flex-wrap items-center gap-1">
                  <span v-for="tag in current.tags" :key="tag" class="rounded bg-gray-100 px-1.5 py-0.5 dark:bg-neutral-700">
                    {{ tag }}
                  </span>
                </span>
              </span>
            </template>
          </div>

          <img
            v-if="current.cover"
            :src="current.cover"
            :alt="current.title"
            class="mt-5 w-full rounded-2xl border border-gray-200 dark:border-neutral-700"
          >

          <div
            class="news-content mt-6 space-y-4 text-[15px] leading-relaxed text-gray-800 dark:text-neutral-100"
            v-html="renderedDetailHtml"
          />

          <div class="mt-10">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              @click="backToList"
            >
              <Icon icon="ph:arrow-left" class="size-4" />
              Kembali ke Daftar
            </button>
          </div>
        </article>
      </div>

      <div v-else>
        <div class="rounded-2xl border border-gray-200 bg-white/80 p-4 backdrop-blur dark:border-neutral-700 dark:bg-neutral-800/60">
          <div class="flex flex-col gap-3 md:items-center md:justify-between">
            <div class="flex flex-wrap items-center gap-2">
              <label class="relative w-full">
                <input
                  v-model="q"
                  type="text"
                  placeholder="Cari berita (judul/isi/tag)…"
                  class="w-full rounded-lg border border-gray-200 bg-white/90 px-3 py-2 pr-20 text-sm text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                >
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  {{ filtered.length }} hasil
                </span>
              </label>

              <div class="w-full md:w-auto">
                <select
                  v-model="selectedCategory"
                  class="block w-full rounded-lg border border-gray-200 bg-white/90 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 md:w-auto"
                >
                  <option value="">Semua Kategori</option>
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>

              <div class="hidden sm:block">
                <select
                  v-model="sortBy"
                  class="rounded-lg border border-gray-200 bg-white/90 px-3 py-2 text-sm text-gray-800 focus:outline-hidden dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                >
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="title">Judul (A-Z)</option>
                </select>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in allTags"
                :key="tag"
                type="button"
                class="rounded-full border border-gray-200 px-2.5 py-1.5 text-[12px] text-gray-800 dark:border-neutral-700 dark:text-neutral-100"
                :class="selectedTags.has(tag) ? 'border-blue-600 bg-blue-600 text-white' : 'bg-white/80 text-gray-700 dark:bg-neutral-900 dark:text-neutral-300'"
                @click="toggleTag(tag)"
              >
                #{{ tag }}
              </button>

              <button
                type="button"
                class="rounded-full border border-gray-200 px-2.5 py-1.5 text-[12px] text-gray-800 hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800"
                @click="resetFilters"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <template v-if="pending">
            <div
              v-for="index in 6"
              :key="index"
              class="rounded-2xl border border-gray-200 bg-white/70 p-3 dark:border-neutral-700 dark:bg-neutral-800/60"
            >
              <div class="h-40 animate-pulse rounded-xl bg-gray-200/70 dark:bg-neutral-700" />
              <div class="mt-3 h-4 w-32 animate-pulse rounded bg-gray-200/70 dark:bg-neutral-700" />
              <div class="mt-2 h-6 w-3/4 animate-pulse rounded bg-gray-200/70 dark:bg-neutral-700" />
              <div class="mt-2 h-4 w-5/6 animate-pulse rounded bg-gray-200/70 dark:bg-neutral-700" />
            </div>
          </template>

          <template v-else>
            <article
              v-for="article in paged"
              :key="article.slug"
              class="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white/80 transition hover:shadow dark:border-neutral-700 dark:bg-neutral-800/60"
              @click="openDetail(article.slug)"
            >
              <div class="relative h-44 overflow-hidden bg-gray-100 dark:bg-neutral-800">
                <img
                  v-if="article.cover"
                  :src="article.cover"
                  :alt="article.title"
                  class="h-full w-full object-cover transition group-hover:scale-[1.02]"
                >
                <div v-else class="flex h-full w-full items-center justify-center text-blue-600">
                  <Icon icon="solar:document-text-bold-duotone" class="h-10 w-10" />
                </div>
                <span
                  v-if="article.category"
                  class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[11px] text-white"
                >
                  {{ article.category }}
                </span>
              </div>

              <div class="p-4">
                <h3 class="line-clamp-2 font-semibold text-gray-900 dark:text-white">
                  {{ article.title }}
                </h3>
                <p class="mt-2 line-clamp-3 text-sm text-gray-600 dark:text-neutral-300">
                  {{ article.excerpt }}
                </p>
                <div class="mt-3 flex items-center justify-between text-[12px] text-gray-500 dark:text-neutral-400">
                  <div class="flex items-center gap-2">
                    <span>{{ formatDate(article.publishedAt) }}</span>
                    <span aria-hidden="true">•</span>
                    <span>{{ article.readTime }} min read</span>
                  </div>
                  <div class="hidden flex-wrap gap-1 sm:flex">
                    <span v-for="tag in article.tags" :key="tag" class="rounded bg-gray-100 px-1.5 py-0.5 dark:bg-neutral-700">
                      #{{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </template>
        </div>

        <div v-if="!pending && filtered.length === 0" class="mt-10 rounded-2xl border border-dashed border-gray-300 p-10 text-center dark:border-neutral-700">
          <p class="text-gray-600 dark:text-neutral-300">Berita masih kosong.</p>
        </div>

        <div v-if="hasMore && !pending" class="mt-8 text-center">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            @click="loadMore"
          >
            <Icon icon="ph:arrow-circle-down" class="size-4" />
            Tampilkan Lebih Banyak
          </button>
        </div>
      </div>

      <div id="hs-share-modal" class="hs-overlay pointer-events-none fixed start-0 top-0 z-[80] hidden size-full overflow-y-auto">
        <div class="m-3 mt-0 h-auto max-h-[calc(100%-3.5rem)] opacity-0 transition-all hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-300 sm:mx-auto sm:max-w-md">
          <div class="pointer-events-auto rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
            <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-neutral-700">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">Bagikan</h3>
              <button
                type="button"
                class="inline-flex size-8 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700"
                data-hs-overlay="#hs-share-modal"
                aria-label="Tutup"
              >
                <Icon icon="ph:x" class="size-4 text-gray-500 dark:text-neutral-300" />
              </button>
            </div>

            <div class="grid gap-2 p-4">
              <button
                type="button"
                class="inline-flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                @click="nativeShare"
              >
                <Icon icon="ph:device-mobile" class="size-4" />
                <span>Sistem Bagikan</span>
              </button>

              <a :href="facebookHref" target="_blank" rel="noopener" class="inline-flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700">
                <Icon icon="mdi:facebook" class="size-4" />
                <span>Facebook</span>
              </a>

              <a :href="twitterHref" target="_blank" rel="noopener" class="inline-flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700">
                <Icon icon="ri:twitter-x-line" class="size-4" />
                <span>X (Twitter)</span>
              </a>

              <a :href="whatsappHref" target="_blank" rel="noopener" class="inline-flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700">
                <Icon icon="mdi:whatsapp" class="size-4" />
                <span>WhatsApp</span>
              </a>

              <button
                type="button"
                class="inline-flex w-full items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                @click="copyShare"
              >
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

      <div v-if="error" class="mt-8 rounded-2xl border border-rose-300/60 bg-rose-50/60 p-4 text-sm text-rose-700 dark:border-rose-700 dark:bg-rose-900/30 dark:text-rose-200">
        {{ errorMessage }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useHead, useRequestURL, useRoute, useRuntimeConfig, useSeoMeta, useRouter } from 'nuxt/app'
import type { NewsItem, NewsListResponse } from '~/types/news'
import { useAppApi } from '../composables/useAppApi'

type NewsMode = 'martopuro' | 'obayan'
type NewsSort = 'newest' | 'oldest' | 'title'

type NewsCard = NewsItem & {
  excerpt: string
  cover: string
}

const runtime = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const requestUrl = useRequestURL()

const q = ref('')
const selectedCategory = ref('')
const selectedTags = ref<Set<string>>(new Set())
const sortBy = ref<NewsSort>('newest')
const page = ref(1)
const pageSize = ref(6)
const copied = ref(false)
const heroImageFailed = ref(false)

const hostname = computed(() => {
  return String(requestUrl.hostname || '')
    .replace(/^www\./, '')
    .toLowerCase()
})

const envClientName = computed(() => {
  return String(runtime.public.clientName || 'obayan')
    .trim()
    .toLowerCase()
})

const isRailwayDomain = computed(() => {
  return (
    hostname.value == 'obayanweb-production.up.railway.app' ||
    hostname.value.endsWith('.railway.app') ||
    hostname.value.endsWith('.up.railway.app')
  )
})

const tenantSlug = computed(() => {
  if (isRailwayDomain.value) return 'martopuro'
  if (hostname.value.includes('martopuro')) return 'martopuro'
  if (hostname.value.includes('obayan')) return 'obayan'
  return envClientName.value || 'obayan'
})

const mode = computed<NewsMode>(() => {
  if (tenantSlug.value === 'martopuro') return 'martopuro'
  return 'obayan'
})

const profile = computed(() => {
  const clientDisplayName = String(
    runtime.public.clientDisplayName ||
    runtime.public.siteName ||
    runtime.public.appName ||
    (mode.value === 'martopuro' ? 'Desa Martopuro' : 'Obayan')
  )

  const titleFromEnv = String(runtime.public.newsTitle || '').trim()
  const subtitleFromEnv = String(runtime.public.newsSubtitle || '').trim()
  const eyebrowFromEnv = String(runtime.public.newsEyebrow || '').trim()
  const authorFromEnv = String(runtime.public.newsAuthor || '').trim()
  const logoFromEnv = String(runtime.public.appLogo || runtime.public.logo || '').trim()
  const heroFromEnv = String(runtime.public.newsHeroImage || runtime.public.heroImage || '').trim()
  const themeFromEnv = String(runtime.public.themeColor || runtime.public.primaryColor || '').trim()

  if (mode.value === 'martopuro') {
    return {
      name: clientDisplayName,
      title: titleFromEnv || `Berita ${clientDisplayName}`,
      subtitle:
        subtitleFromEnv ||
        `Informasi resmi ${clientDisplayName}, mulai dari pelayanan publik, kegiatan warga, pengumuman desa, pembangunan, kesehatan, pendidikan, hingga potensi lokal.`,
      eyebrow: eyebrowFromEnv || 'Kabar Terbaru',
      baseTitle: titleFromEnv || `Berita | ${clientDisplayName}`,
      baseDesc: subtitleFromEnv || `Kumpulan berita dan informasi resmi ${clientDisplayName}.`,
      authorName: authorFromEnv || clientDisplayName,
      logo: logoFromEnv || '/assets/images/logo-martopuro.png',
      heroImage: heroImageFailed.value ? '/assets/images/profile.png' : heroFromEnv || '/assets/images/profile.png',
      themeColor: themeFromEnv || '#2563eb'
    }
  }

  return {
    name: clientDisplayName,
    title: titleFromEnv || `Berita ${clientDisplayName}`,
    subtitle:
      subtitleFromEnv ||
      `Informasi terbaru dari ${clientDisplayName}, mulai dari update produk, tutorial, artikel edukasi, case study, hingga pengumuman platform.`,
    eyebrow: eyebrowFromEnv || 'Kabar Terbaru',
    baseTitle: titleFromEnv || `Berita | ${clientDisplayName}`,
    baseDesc: subtitleFromEnv || `Kumpulan berita, artikel, dan informasi resmi ${clientDisplayName}.`,
    authorName: authorFromEnv || clientDisplayName,
    logo: logoFromEnv || '/logo.png',
    heroImage: heroImageFailed.value ? '/assets/images/profile.png' : heroFromEnv || '/assets/images/profile.png',
    themeColor: themeFromEnv || '#58cc02'
  }
})

const activeSlug = computed(() => {
  const value = route.query.news
  return typeof value === 'string' ? value : ''
})

const { tenantApiUrl } = useAppApi()
const apiUrl = computed(() => tenantApiUrl(tenantSlug.value, '/news'))

const {
  data,
  pending,
  error,
  refresh
} = await useFetch<NewsListResponse>(apiUrl, {
  key: computed(() => `public-news-sql-${tenantSlug.value}`),
  query: computed(() => ({
    status: 'published',
    limit: 100,
    sort: 'newest'
  })),
  watch: [tenantSlug],
  default: () => ({
    data: [],
    meta: {
      page: 1,
      limit: 100,
      total: 0,
      totalPages: 1
    }
  })
})

const items = computed<NewsCard[]>(() => {
  return (data.value?.data || []).map(normalizeNewsItem)
})

const isDetail = computed(() => Boolean(activeSlug.value))

const current = computed(() => {
  if (!activeSlug.value) return null
  return items.value.find((item) => item.slug === activeSlug.value) || null
})

const categories = computed(() => {
  return Array.from(
    new Set(
      items.value
        .map((item) => item.category)
        .filter(Boolean) as string[]
    )
  )
})

const allTags = computed(() => {
  return Array.from(new Set(items.value.flatMap((item) => item.tags || [])))
})

const filtered = computed(() => {
  let rows = [...items.value]

  const keyword = q.value.trim().toLowerCase()

  if (keyword) {
    rows = rows.filter((item) => {
      return [
        item.title,
        item.excerpt,
        item.descriptionCard,
        item.descriptionContent,
        item.category,
        ...(item.tags || [])
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(keyword)
    })
  }

  if (selectedCategory.value) {
    rows = rows.filter((item) => item.category === selectedCategory.value)
  }

  if (selectedTags.value.size) {
    rows = rows.filter((item) => item.tags?.some((tag) => selectedTags.value.has(tag)))
  }

  if (sortBy.value === 'newest') {
    rows.sort((a, b) => Number(b.publishedAt || 0) - Number(a.publishedAt || 0))
  }

  if (sortBy.value === 'oldest') {
    rows.sort((a, b) => Number(a.publishedAt || 0) - Number(b.publishedAt || 0))
  }

  if (sortBy.value === 'title') {
    rows.sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')))
  }

  return rows
})

const paged = computed(() => filtered.value.slice(0, page.value * pageSize.value))
const hasMore = computed(() => paged.value.length < filtered.value.length)

const renderedDetailHtml = computed(() => {
  if (!current.value) return ''
  return sanitizeHtml(current.value.descriptionContent || '<p>Belum ada konten berita.</p>')
})

const errorMessage = computed(() => {
  if (!error.value) return ''
  return error.value?.message || 'Terjadi kesalahan saat memuat berita.'
})

function normalizeNewsItem(item: NewsItem): NewsCard {
  const excerpt = item.descriptionCard || plainText(item.descriptionContent || '').slice(0, 180)

  return {
    ...item,
    cover: item.cover || item.coverUrl || '',
    excerpt
  } as NewsCard
}

function toggleTag(tag: string) {
  const next = new Set(selectedTags.value)

  if (next.has(tag)) next.delete(tag)
  else next.add(tag)

  selectedTags.value = next
  page.value = 1
}

function resetFilters() {
  q.value = ''
  selectedCategory.value = ''
  selectedTags.value = new Set()
  sortBy.value = 'newest'
  page.value = 1
}

async function openDetail(slug: string) {
  await router.push({
    query: {
      ...route.query,
      news: slug
    }
  })
}

async function backToList() {
  const query = { ...route.query }
  delete query.news
  await router.push({ query })
}

function loadMore() {
  page.value += 1
}

function formatDate(timestamp?: number) {
  if (!timestamp) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium'
  }).format(new Date(timestamp))
}

const safeSiteUrl = computed(() => {
  const value = String(runtime.public.siteUrl || '').trim()
  if (value) return value.replace(/\/$/, '')
  return `${requestUrl.protocol}//${requestUrl.host}`
})

const canonical = computed(() => new URL(route.fullPath || '/', safeSiteUrl.value).toString())
const shareUrl = computed(() => canonical.value)

async function copyLink() {
  try {
    await navigator.clipboard.writeText(canonical.value)
  } catch {}
}

const pageTitle = computed(() => {
  if (isDetail.value && current.value?.title) return `${current.value.title} | ${profile.value.name}`
  return profile.value.baseTitle
})

const pageDesc = computed(() => {
  if (isDetail.value && current.value?.excerpt) return current.value.excerpt
  return profile.value.baseDesc
})

const pageImage = computed(() => current.value?.cover || profile.value.logo || '/assets/logo.png')

useSeoMeta({
  title: pageTitle,
  description: pageDesc,
  ogTitle: pageTitle,
  ogDescription: pageDesc,
  ogType: computed(() => (isDetail.value ? 'article' : 'website')),
  ogUrl: canonical,
  ogImage: pageImage,
  twitterCard: 'summary_large_image',
  twitterSite: runtime.public.twitterSite || undefined,
  themeColor: computed(() => profile.value.themeColor),
  robots: 'index, follow'
})

useHead(() => {
  const scripts = []

  if (current.value) {
    const article = current.value

    scripts.push({
      key: `news-jsonld-${article.id || article.slug}`,
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: article.title,
        datePublished: new Date(article.publishedAt || Date.now()).toISOString(),
        dateModified: new Date(article.updatedAt || article.publishedAt || Date.now()).toISOString(),
        image: article.cover ? [new URL(article.cover, safeSiteUrl.value).toString()] : [],
        author: {
          '@type': 'Organization',
          name: profile.value.authorName
        },
        publisher: {
          '@type': 'Organization',
          name: profile.value.authorName,
          logo: {
            '@type': 'ImageObject',
            url: new URL(String(profile.value.logo || '/assets/logo.png'), safeSiteUrl.value).toString()
          }
        },
        mainEntityOfPage: canonical.value
      })
    })
  }

  return {
    link: [
      {
        rel: 'canonical',
        href: canonical.value
      }
    ],
    meta: [
      {
        name: 'theme-color',
        content: profile.value.themeColor
      }
    ],
    script: scripts
  }
})

const shareText = computed(() => {
  return current.value?.title && isDetail.value ? current.value.title : profile.value.baseTitle
})

const encodedUrl = computed(() => encodeURIComponent(shareUrl.value))
const encodedText = computed(() => encodeURIComponent(`${shareText.value} - ${shareUrl.value}`))

const facebookHref = computed(() => `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl.value}`)
const twitterHref = computed(() => `https://twitter.com/intent/tweet?url=${encodedUrl.value}&text=${encodeURIComponent(shareText.value)}`)
const whatsappHref = computed(() => `https://wa.me/?text=${encodedText.value}`)

async function copyShare() {
  await copyLink()
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1200)
}

async function nativeShare() {
  try {
    if (navigator.share) {
      await navigator.share({
        title: shareText.value,
        text: shareText.value,
        url: shareUrl.value
      })
    } else {
      await copyShare()
    }
  } catch {}
}

function plainText(value: string) {
  return String(value || '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function sanitizeHtml(value: string) {
  return String(value || '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
}

function onHeroImageError() {
  heroImageFailed.value = true
}
</script>

<style scoped>
.news-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 1rem;
  border: 1px solid rgb(229 231 235);
}

.news-content :deep(iframe) {
  width: 100%;
  min-height: 420px;
  border: 0;
  border-radius: 1rem;
}

.news-content :deep(a) {
  color: rgb(37 99 235);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 4px;
}
</style>
