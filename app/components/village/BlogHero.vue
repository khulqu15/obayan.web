<template>
    <section id="warta" aria-label="Warta" class="relative overflow-hidden bg-slate-50 py-20 text-slate-950">
        <!-- Background -->
        <div class="pointer-events-none absolute inset-0 -z-10">
            <div class="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[42px_42px] opacity-40" />
            <div class="absolute -left-36 top-10 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
            <div class="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl" />
        </div>
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                    <div class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                        <ClientOnly>
                            <Icon icon="lucide:newspaper" class="h-4 w-4" />
                        </ClientOnly>
                        {{ c.eyebrow }}
                    </div>
                    <h2 class="mt-4 max-w-2xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                        {{ c.title }}
                    </h2>
                    <p class="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                        {{ c.subtitle }}
                    </p>
                </div>
                <a :href="c.viewAllHref" class="group inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                    {{ c.viewAllLabel }}
                    <ClientOnly>
                        <Icon icon="lucide:arrow-up-right" class="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </ClientOnly>
                </a>
            </div>
            <!-- Loading -->
            <div v-if="pending" class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div class="min-h-[520px] animate-pulse rounded-4xl border border-slate-200 bg-white">
                    <div class="h-full min-h-[520px] rounded-4xl bg-slate-200" />
                </div>
                <aside class="rounded-4xl border border-slate-200 bg-white/85 p-3 shadow-sm">
                    <div class="flex items-center justify-between px-2 py-2">
                        <div>
                            <div class="h-3 w-24 animate-pulse rounded bg-slate-200" />
                            <div class="mt-2 h-5 w-32 animate-pulse rounded bg-slate-200" />
                        </div>
                        <div class="h-8 w-8 animate-pulse rounded-full bg-slate-200" />
                    </div>
                    <div class="mt-2 space-y-3">
                        <div v-for="i in 5" :key="i" class="grid grid-cols-[92px_minmax(0,1fr)] gap-3 rounded-[1.35rem] border border-slate-200 p-2">
                            <div class="h-24 animate-pulse rounded-2xl bg-slate-200" />
                            <div class="space-y-2 py-1">
                                <div class="h-3 w-24 animate-pulse rounded bg-slate-200" />
                                <div class="h-4 w-full animate-pulse rounded bg-slate-200" />
                                <div class="h-3 w-3/4 animate-pulse rounded bg-slate-200" />
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
            <!-- Error -->
            <div v-else-if="errorMessage" class="rounded-4xl border border-rose-200 bg-rose-50 p-8 text-center">
                <p class="text-sm font-bold text-rose-700">
                    {{ errorMessage }}
                </p>
                <button type="button" class="mt-4 inline-flex h-10 items-center justify-center rounded-2xl bg-rose-600 px-4 text-sm font-black text-white transition hover:bg-rose-700" @click="refresh()">
              Muat Ulang
            </button>
            </div>
            <!-- Empty -->
            <div v-else-if="!articles.length" class="rounded-4xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                    <ClientOnly>
                        <Icon icon="lucide:newspaper" class="h-7 w-7" />
                    </ClientOnly>
                </div>
                <p class="mt-4 text-base font-black text-slate-900">
                    Belum ada warta.
                </p>
                <p class="mt-2 text-sm text-slate-500">
                    Data berita untuk tenant
                    <span class="font-bold text-slate-700">{{ tenantSlug }}</span> belum tersedia.
                </p>
            </div>
            <!-- Main content -->
            <div v-else-if="activeArticle" class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                <!-- Featured slider -->
                <article class="group relative min-h-[520px] overflow-hidden rounded-4xl border border-white bg-white shadow-[0_28px_80px_-45px_rgba(15,23,42,0.65)]">
                    <div class="absolute inset-0">
                        <img :src="activeArticle.image" :alt="activeArticle.title" class="h-full w-full object-cover transition duration-700 group-hover:scale-105">
                        <div class="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/35 to-transparent" />
                        <div class="absolute inset-0 bg-linear-to-r from-slate-950/50 via-transparent to-transparent" />
                    </div>
                    <div class="relative z-10 flex h-full min-h-[520px] flex-col justify-between p-5 sm:p-7 lg:p-8">
                        <div class="flex items-start justify-between gap-4">
                            <div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                                <ClientOnly>
                                    <Icon icon="lucide:sparkles" class="h-4 w-4 text-blue-200" />
                                </ClientOnly>
                                Artikel Pilihan
                            </div>
                            <div class="hidden rounded-full border border-white/15 bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur sm:block">
                                {{ activeIndex + 1 }} / {{ articles.length }}
                            </div>
                        </div>
                        <div class="max-w-3xl">
                            <div class="mb-4 flex flex-wrap items-center gap-2">
                                <span class="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-black text-white">
                                    {{ activeArticle.category }}
                                </span>
                                <span class="rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                                    {{ activeArticle.date }}
                                </span>
                            </div>
                            <h3 class="max-w-3xl text-2xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                                {{ activeArticle.title }}
                            </h3>
                            <p class="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                                {{ activeArticle.excerpt }}
                            </p>
                            <div class="mt-6 flex flex-wrap items-center gap-3">
                                <a :href="activeArticle.href" class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-black text-slate-950 transition hover:bg-blue-50 hover:text-blue-700">
                                    Baca Selengkapnya
                                    <ClientOnly>
                                        <Icon icon="lucide:arrow-right" class="h-4 w-4" />
                                    </ClientOnly>
                                </a>
                                <button type="button" class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20" @click="toggleBookmark(activeArticle.id)">
                                    <ClientOnly>
                                        <Icon :icon="isBookmarked(activeArticle.id) ? 'lucide:bookmark-check' : 'lucide:bookmark'" class="h-4 w-4" />
                                    </ClientOnly>
                                    Simpan
                                </button>
                            </div>
                        </div>
                        <!-- Controls -->
                        <div class="mt-8 flex items-center justify-between gap-4">
                            <div class="flex items-center gap-2">
                                <button type="button" class="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/15 text-white backdrop-blur transition hover:bg-white hover:text-slate-950" aria-label="Artikel sebelumnya" @click="prevArticle">
                                    <ClientOnly>
                                        <Icon icon="lucide:chevron-left" class="h-5 w-5" />
                                    </ClientOnly>
                                </button>
                                <button type="button" class="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/15 text-white backdrop-blur transition hover:bg-white hover:text-slate-950" aria-label="Artikel berikutnya" @click="nextArticle">
                                    <ClientOnly>
                                        <Icon icon="lucide:chevron-right" class="h-5 w-5" />
                                    </ClientOnly>
                                </button>
                            </div>
                            <div class="hidden flex-1 items-center gap-2 sm:flex">
                                <button v-for="(_, index) in articles" :key="index" type="button" class="h-2 rounded-full transition" :class="index === activeIndex ? 'w-10 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'" :aria-label="`Pilih artikel ${index + 1}`" @click="setActive(index)"/>
                            </div>
                        </div>
                    </div>
                </article>
                <!-- Side list -->
                <aside v-if="sideArticles.length > 0" class="rounded-4xl border border-slate-200 bg-white/85 p-3 shadow-sm backdrop-blur-xl">
                    <div class="flex items-center justify-between px-2 py-2">
                        <div>
                            <p class="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                                Populer
                            </p>
                            <h3 class="mt-1 text-lg font-black text-slate-950">
                                Banyak Dibaca
                            </h3>
                        </div>
                        <ClientOnly>
                            <Icon icon="lucide:trending-up" class="h-5 w-5 text-blue-600" />
                        </ClientOnly>
                    </div>
                    <div class="mt-2 space-y-3">
                        <button v-for="(item, index) in sideArticles" :key="item.id" type="button" class="group grid w-full grid-cols-[92px_minmax(0,1fr)] gap-3 rounded-[1.35rem] border p-2 text-left transition hover:-translate-y-0.5" :class="activeArticle && item.id === activeArticle.id ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/60'" @click="setArticleById(item.id)">
                            <div class="relative overflow-hidden rounded-2xl">
                                <img :src="item.image" :alt="item.title" class="h-24 w-full object-cover transition duration-500 group-hover:scale-110">
                                <div class="absolute left-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-xs font-black text-blue-700 shadow-sm">
                                    {{ index + 1 }}
                                </div>
                            </div>
                            <div class="min-w-0 py-1">
                                <div class="flex flex-wrap items-center gap-1.5">
                                    <span class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-500">
                                        {{ item.category }}
                                    </span>
                                    <span class="text-[10px] font-bold text-slate-400">
                                        {{ item.date }}
                                    </span>
                                </div>
                                <h4 class="mt-2 line-clamp-2 text-sm font-black leading-5 text-slate-900 group-hover:text-blue-700">
                                    {{ item.title }}
                                </h4>
                                <p class="mt-1 line-clamp-1 text-xs text-slate-500">
                                    {{ item.excerpt }}
                                </p>
                            </div>
                        </button>
                    </div>
                </aside>
            </div>
            <!-- Latest -->
            <div v-if="latestArticles.length" class="mt-12">
                <div class="mb-5 flex items-center justify-between gap-4">
                    <div>
                        <h3 class="text-xl font-black text-slate-950">
                            Terbaru untuk Anda
                        </h3>
                        <p class="mt-1 text-sm text-slate-500">
                            Kabar terbaru seputar pelayanan, warga, kegiatan, dan potensi lokal.
                        </p>
                    </div>
                    <div class="hidden items-center gap-2 sm:flex">
                        <button type="button" class="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700" aria-label="Geser kiri" @click="scrollLatest('left')">
                            <ClientOnly>
                                <Icon icon="lucide:chevron-left" class="h-4 w-4" />
                            </ClientOnly>
                        </button>
                        <button type="button" class="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700" aria-label="Geser kanan" @click="scrollLatest('right')">
                            <ClientOnly>
                                <Icon icon="lucide:chevron-right" class="h-4 w-4" />
                            </ClientOnly>
                        </button>
                    </div>
                </div>
                <div ref="latestScrollEl" class="latest-scroll -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
                    <article v-for="item in latestArticles" :key="`latest-${item.id}`" class="group w-[290px] shrink-0 snap-start overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 sm:w-[310px]">
                        <a :href="item.href" class="block">
                            <div class="relative h-44 overflow-hidden">
                                <img :src="item.image" :alt="item.title" class="h-full w-full object-cover transition duration-500 group-hover:scale-110">
                                <div class="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-slate-950/60 to-transparent" />
                                <span class="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-blue-700 shadow-sm backdrop-blur">
                                    {{ item.category }}
                                </span>
                            </div>
                            <div class="p-4">
                                <div class="flex items-center gap-2 text-xs font-bold text-slate-400">
                                    <ClientOnly>
                                        <Icon icon="lucide:calendar-days" class="h-3.5 w-3.5" />
                                    </ClientOnly>
                                    {{ item.date }}
                                </div>
                                <h4 class="mt-2 line-clamp-2 text-base font-black leading-6 text-slate-950 transition group-hover:text-blue-700">
                                    {{ item.title }}
                                </h4>
                                <p class="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                                    {{ item.excerpt }}
                                </p>
                                <div class="mt-4 flex items-center justify-between">
                                    <span class="text-xs font-black text-blue-600">
                                        Baca Berita
                                    </span>
                                    <span class="grid h-8 w-8 place-items-center rounded-full bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                                        <ClientOnly>
                                            <Icon icon="lucide:arrow-up-right" class="h-4 w-4" />
                                        </ClientOnly>
                                    </span>
                                </div>
                            </div>
                        </a>
                    </article>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useRuntimeConfig, useFetch } from 'nuxt/app'
import { useAppApi } from '~/composables/useAppApi'

type NewsStatus = 'draft' | 'published' | 'archived'
type NewsItem = {
    id: number
    tenantId: number
    title: string
    slug: string
    descriptionCard: string
    descriptionContent: string
    excerpt: string
    cover: string
    coverUrl: string | null
    category: string | null
    categorySlug: string | null
    categoryId: number | null
    tags: string[]
    tagSlugs: string[]
    status: NewsStatus
    readTime: number
    publishedAt: number
    createdAt: number
    updatedAt: number
}
type NewsListResponse = {
    data: NewsItem[]
    meta: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}
type BlogArticle = {
    id: string
    title: string
    excerpt: string
    image: string
    category: string
    date: string
    href: string
}
type BlogHeroProps = {
    eyebrow ? : string
    title ? : string
    subtitle ? : string
    viewAllLabel ? : string
    viewAllHref ? : string
    /**
     * Optional override dari parent.
     * Kalau props ini dikirim, komponen akan memakai data props.
     * Kalau kosong, komponen akan mengambil dari MySQL API.
     */
    articles ? : BlogArticle[]
    latest ? : BlogArticle[]
}
const props = defineProps < BlogHeroProps > ()
const runtime = useRuntimeConfig()
const tenantSlug = computed(() => {
    const value = runtime.public.clientName || 'martopuro'
    return String(value)
        .trim()
        .toLowerCase()
})
const clientDisplayName = computed(() => {
    return String(runtime.public.clientDisplayName || tenantSlug.value || 'Martopuro')
})

const { tenantApiUrl } = useAppApi()

const newsApiUrl = computed(() => {
    return tenantApiUrl(tenantSlug.value, '/news')
})
const {
    data: newsResponse,
    pending,
    error,
    refresh
} = useFetch < NewsListResponse > (newsApiUrl, {
    key: computed(() => `tenant-news-${tenantSlug.value}`),
    query: computed(() => ({
        status: 'published',
        limit: 12,
        sort: 'newest'
    })),
    watch: [tenantSlug],
    default: () => ({
        data: [],
        meta: {
            page: 1,
            limit: 12,
            total: 0,
            totalPages: 1
        }
    })
})
const errorMessage = computed(() => {
    if (!error.value) return ''
    const err = error.value as {
        statusMessage ? : string
        message ? : string
    }
    return err.statusMessage || err.message || 'Gagal mengambil data warta dari server.'
})
const activeIndex = ref(0)
const bookmarkedIds = ref < string[] > ([])
const latestScrollEl = ref < HTMLElement | null > (null)
const c = computed(() => {
    return {
        eyebrow: props.eyebrow || `Warta ${clientDisplayName.value}`,
        title: props.title || 'Artikel Pilihan & Terbaru',
        subtitle: props.subtitle ||
            `Ikuti informasi terbaru dari ${clientDisplayName.value}, mulai dari pelayanan publik, kegiatan warga, UMKM, kesehatan, pendidikan, hingga agenda terbaru.`,
        viewAllLabel: props.viewAllLabel || 'Lihat Semua',
        viewAllHref: props.viewAllHref || '/news'
    }
})
function dedupeArticles(items: BlogArticle[]) {
  const map = new Map<string, BlogArticle>()

  for (const item of items) {
    const key = String(item.id || item.href || item.title)
      .trim()
      .toLowerCase()

    if (!key) continue
    if (map.has(key)) continue

    map.set(key, item)
  }

  return Array.from(map.values())
}
const newsItems = computed(() => {
    return newsResponse.value?.data || []
})
const articlesFromApi = computed < BlogArticle[] > (() => {
    return newsItems.value.map((item) => mapNewsToArticle(item))
})

const articles = computed<BlogArticle[]>(() => {
  const source = props.articles?.length
    ? props.articles
    : articlesFromApi.value

  return dedupeArticles(source)
})

const activeArticle = computed(() => {
  return articles.value[activeIndex.value] || articles.value[0] || null
})

const activeArticleId = computed(() => {
  return activeArticle.value?.id || ''
})

const sideArticles = computed(() => {
  return articles.value
    .filter((item) => item.id !== activeArticleId.value)
    .slice(0, 5)
})

const sideArticleIds = computed(() => {
  return new Set(sideArticles.value.map((item) => item.id))
})

const latestSource = computed<BlogArticle[]>(() => {
  const source = props.latest?.length
    ? props.latest
    : articles.value

  return dedupeArticles(source)
})

const latestArticles = computed<BlogArticle[]>(() => {
  const usedIds = new Set<string>()

  if (activeArticleId.value) {
    usedIds.add(activeArticleId.value)
  }

  for (const item of sideArticles.value) {
    usedIds.add(item.id)
  }

  return latestSource.value
    .filter((item) => !usedIds.has(item.id))
    .slice(0, 8)
})
watch(articles, (items) => {
    if (!items.length) {
        activeIndex.value = 0
        return
    }
    if (activeIndex.value > items.length - 1) {
        activeIndex.value = 0
    }
})
function mapNewsToArticle(item: NewsItem): BlogArticle {
    return {
        id: String(item.id || item.slug),
        title: item.title || 'Tanpa Judul',
        excerpt: item.excerpt || item.descriptionCard || 'Belum ada deskripsi.',
        image: item.cover || item.coverUrl || '/assets/images/profile.png',
        category: item.category || 'Umum',
        date: formatDate(item.publishedAt),
        href: `/news/${item.slug}`
    }
}
function formatDate(timestamp ? : number) {
    if (!timestamp) return '-'
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(new Date(timestamp))
}
function setActive(index: number) {
    if (!articles.value.length) return
    activeIndex.value = Math.max(0, Math.min(index, articles.value.length - 1))
}
function setArticleById(id: string) {
    const index = articles.value.findIndex((item) => item.id === id)
    if (index >= 0) {
        activeIndex.value = index
    }
}
function nextArticle() {
    if (!articles.value.length) return
    activeIndex.value = (activeIndex.value + 1) % articles.value.length
}
function prevArticle() {
    if (!articles.value.length) return
    activeIndex.value =
        activeIndex.value === 0 ?
        articles.value.length - 1 :
        activeIndex.value - 1
}
function isBookmarked(id: string) {
    return bookmarkedIds.value.includes(id)
}
function toggleBookmark(id: string) {
    if (bookmarkedIds.value.includes(id)) {
        bookmarkedIds.value = bookmarkedIds.value.filter((item) => item !== id)
        return
    }
    bookmarkedIds.value = [...bookmarkedIds.value, id]
}
function scrollLatest(direction: 'left' | 'right') {
    const el = latestScrollEl.value
    if (!el) return
    const amount = direction === 'left' ? -340 : 340
    el.scrollBy({
        left: amount,
        behavior: 'smooth'
    })
}
</script>

<style scoped>
.bg-size-\[42px_42px\] {
    background-size: 42px 42px;
}
.latest-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgb(37 99 235) rgb(226 232 240);
}
.latest-scroll::-webkit-scrollbar {
    height: 8px;
}
.latest-scroll::-webkit-scrollbar-track {
    border-radius: 999px;
    background: rgb(226 232 240);
}
.latest-scroll::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: rgb(37 99 235);
}
</style>