<template>
  <section class="relative overflow-hidden bg-white/90 dark:bg-neutral-900 dark:border-neutral-800" id="news">
    <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 -top-40 h-64 bg-gradient-to-b from-blue-100/70 to-transparent dark:from-emerald-900/20" />
    <div class="max-w-[85rem] relative mx-auto min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-6">
      <!-- heading -->
      <div class="grid lg:grid-cols-12 gap-6">
        <div class="lg:col-span-7">
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            {{ headingTitle }}
          </h1>
          <p class="mt-3 text-gray-600 dark:text-neutral-300 max-w-2xl">
            {{ headingDesc }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-6 mt-8">
        <!-- Featured -->
        <div class="lg:col-span-6 col-span-12">
          <div v-if="resolvedFeatured.title" class="card-blog max-h-[34rem] min-h-[34rem] overflow-hidden relative h-full w-full border rounded-xl border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 backdrop-blur-sm hover:shadow-md transition-shadow">
            <img class="card-blog-image transition-all" :src="resolvedFeatured.cover" :alt="resolvedFeatured.title">
            <NuxtLink :to="resolvedFeatured.href">
              <div class="card-blog-content p-5 overflow-hidden">
                <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-lg text-xs font-medium bg-blue-100 dark:bg-blue-800/30 mb-3">{{ resolvedFeatured.category }}</span>
                <h1 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {{ resolvedFeatured.title }}
                </h1>
                <div class="flex justify-between items-center flex-wrap mt-3">
                  <div class="flex-grow flex gap-1">
                    <span v-for="t in (resolvedFeatured.tags || [])" :key="t"
                          class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-md text-xs font-medium border border-gray-200 bg-white text-gray-800 shadow-2xs dark:bg-neutral-900 dark:border-neutral-700 dark:text-white">
                      {{ t }}
                    </span>
                  </div>
                  <div class="flex-grow md:w-auto w-full text-right">
                    <span class="text-sm text-gray-800 dark:text-white">{{ resolvedFeatured.dateText }}</span>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-6 space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            <div class="hs-dropdown [--strategy:fixed] relative inline-flex">
              <button type="button"
                      class="hs-dropdown-toggle inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-700">
                <span class="inline-block w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                {{ selectedCategory }}
                <svg class="size-4 text-gray-500 dark:text-neutral-400 hs-dropdown-open:rotate-180 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6"/></svg>
              </button>
              <div class="hs-dropdown-menu mt-2 w-56 z-20 hidden rounded-lg border border-gray-200 bg-white p-2 shadow-md dark:bg-neutral-800 dark:border-neutral-700">
                <label v-for="cat in categoriesUi" :key="cat"
                       class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer">
                  <input type="radio" name="blog-category"
                         class="shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600"
                         :value="cat" :checked="selectedCategory === cat" @change="setCategory(cat)">
                  <span class="text-sm text-gray-800 dark:text-neutral-200">{{ cat }}</span>
                </label>
              </div>
            </div>

            <div class="hs-dropdown [--strategy:fixed] relative inline-flex">
              <button type="button"
                      class="hs-dropdown-toggle inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-700">
                Tags
                <span v-if="selectedTags.size" class="inline-flex items-center rounded-full bg-blue-600 text-white text-[11px] px-1.5 py-0.5">{{ selectedTags.size }}</span>
                <svg class="size-4 text-gray-500 dark:text-neutral-400 hs-dropdown-open:rotate-180 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6"/></svg>
              </button>
              <div class="hs-dropdown-menu mt-2 w-64 z-20 hidden rounded-lg border border-gray-200 bg-white p-2 shadow-md dark:bg-neutral-800 dark:border-neutral-700">
                <div class="max-h-60 overflow-auto pr-1">
                  <label v-for="tag in tagsUi" :key="tag"
                         class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer">
                    <input type="checkbox"
                           class="shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600"
                           :checked="selectedTags.has(tag)" @change="toggleTag(tag)">
                    <span class="text-sm text-gray-800 dark:text-neutral-200">#{{ tag }}</span>
                  </label>
                </div>
                <div class="mt-2 flex justify-between gap-2">
                  <button @click="clearTags" class="text-xs px-2 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700 text-gray-700 dark:text-neutral-200">Clear</button>
                  <button @click="applyFilters" class="text-xs px-2 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700">Apply</button>
                </div>
              </div>
            </div>
          </div>

          <!-- slider -->
          <div v-if="slides.length" class="w-full bg-white rounded-lg shadow-md dark:bg-neutral-800" :data-hs-carousel="JSON.stringify(hsOptions)">
            <div class="relative">
              <div class="hs-carousel relative overflow-hidden w-full min-h-64 bg-white rounded-lg dark:bg-neutral-900">
                <div class="hs-carousel-body absolute top-0 bottom-0 start-0 flex flex-nowrap transition-transform duration-700 opacity-0">
                  <div v-for="(post, idx) in slides" :key="post.href || idx" class="hs-carousel-slide">
                    <article class="flex justify-center h-full p-0">
                      <div class="relative h-full w-full overflow-hidden rounded-lg">
                        <img :src="post.cover" :alt="post.title" class="absolute inset-0 h-full w-full object-cover">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent"></div>
                        <div class="relative h-full p-5 flex flex-col justify-end">
                          <div class="flex flex-wrap items-center gap-2">
                            <span class="inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-full bg-white/10 ring-1 ring-white/20 text-white">
                              {{ post.category }}
                            </span>
                            <span v-for="t in post.tags" :key="t" class="text-[11px] text-white/90">#{{ t }}</span>
                          </div>
                          <h3 class="mt-2 text-white text-lg sm:text-xl font-semibold leading-snug line-clamp-2">
                            <NuxtLink :to="post.href" class="hover:underline">{{ post.title }}</NuxtLink>
                          </h3>
                          <p class="mt-1 text-white/90 line-clamp-2">{{ post.excerpt }}</p>
                          <div class="mt-3 flex items-center gap-3 text-xs text-white/85">
                            <span>{{ post.dateText }}</span>
                            <span>•</span>
                            <span>{{ post.readTime }} min read</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
              <button type="button" class="hs-carousel-prev hs-carousel-disabled:opacity-50 disabled:pointer-events-none absolute inset-y-0 start-0 inline-flex justify-center items-center w-12 h-full text-gray-800 hover:bg-gray-800/10 focus:outline-hidden focus:bg-gray-800/10 rounded-s-lg dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10">
                <span class="text-2xl" aria-hidden="true">
                  <svg class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6"/></svg>
                </span>
                <span class="sr-only">Previous</span>
              </button>
              <button type="button" class="hs-carousel-next hs-carousel-disabled:opacity-50 disabled:pointer-events-none absolute inset-y-0 end-0 inline-flex justify-center items-center w-12 h-full text-gray-800 hover:bg-gray-800/10 focus:outline-hidden focus:bg-gray-800/10 rounded-e-lg dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10">
                <span class="sr-only">Next</span>
                <span class="text-2xl" aria-hidden="true">
                  <svg class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6"/></svg>
                </span>
              </button>
              <div class="hs-carousel-pagination flex justify-center absolute bottom-3 start-0 end-0 space-x-2"></div>
            </div>
          </div>

          <!-- mini list -->
          <div class="grid sm:grid-cols-2 gap-3">
            <NuxtLink v-for="(post, i) in miniList" :key="post.href || i" :to="post.href"
               class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700">
              <img :src="post.cover" class="size-14 rounded-md object-cover" alt="">
              <div>
                <p class="text-xs text-gray-500 dark:text-neutral-400">{{ post.category }} • {{ post.readTime }}m</p>
                <h4 class="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{{ post.title }}</h4>
              </div>
            </NuxtLink>
          </div>
        </div>

        <NuxtLink to="/news" class="text-right flex justify-end col-span-12">
          <button class="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
            Berita Selengkapnya
          </button>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useWeb } from '~/composables/data/useWeb'
import { useNews } from '~/composables/data/useNews'

type Post = {
  title: string
  href: string
  excerpt?: string
  cover?: string
  dateText?: string
  readTime?: number
  category?: string
  tags?: string[]
}
type Featured = Post

const defaults = {
  headingTitle: 'Kegiatan Harian & Mingguan Santri',
  headingDesc: 'Pantau jadwal kajian, ibadah, dan aktivitas santri Pondok Pesantren Alberr Pandaan secara teratur. Temukan kegiatan yang sesuai dengan minat dan kebutuhan Anda.',
  featured: {
    title: 'Tahfidz Berbasis Target & Analitik: Metrik Hafalan yang Membumi',
    cover: '/assets/images/activity.jpg',
    dateText: '12 Agustus 2025 15:30',
    category: 'Tahfidz',
    tags: ['tahfidz','murajaah','edtech'],
    href: '#'
  } as Featured,
  posts: [] as Post[],
  newsSource: {
    mode: 'custom' as 'custom'|'auto'|'manual',
    autoTotal: 5,
    featuredId: '',
    postIds: [] as string[]
  }
}

const route = useRoute()
const web = useWeb()
const news = useNews()

/** Ensure we are bound to the current page once (safe to call if already bound by parent) */
onMounted(async () => {
  const path = web.normalizePath((route as any).path || '/')
  if (!web.meta.value) {
    await web.subscribePage(path)
  } else {
    web.setActivePath(path)
  }
  initCarousel()
})

/** Find my section config from RTDB: pick the first enabled section with key 'BlogHero' (or 'NewsHero' fallback) */
const mySection = computed(() => {
  const list = web.enabledSections.value || []
  return list.find(s => s.key === 'BlogHero')
      || list.find(s => s.key === 'NewsHero')
      || null
})

/** Live listen for newsSource.mode on this section (as requested) */
const liveMode = ref<'custom'|'auto'|'manual'|null>(null)
let _unsubMode: (() => void) | null = null

watch(mySection, async (sec, _, onCleanup) => {
  // cleanup old
  if (_unsubMode) { try { _unsubMode() } catch {} _unsubMode = null }

  if (!sec) return
  try {
    const { $realtimeDb } = useNuxtApp()
    const { ref: dbRef, onValue, off } = await import('firebase/database')
    const k = web.currentKey.value
    const r = dbRef($realtimeDb, `alberr/web/pages/${k}/sections/${sec.id}/props/newsSource/mode`)
    const handler = onValue(r, (snap) => {
      const v = String(snap.val() ?? '')
      liveMode.value = (v === 'custom' || v === 'auto' || v === 'manual') ? (v as any) : null
    })
    _unsubMode = () => off(r, 'value', handler as any)
    onCleanup(() => { try { _unsubMode?.() } catch {} _unsubMode = null })
  } catch {}
}, { immediate: true })

onBeforeUnmount(() => { try { _unsubMode?.() } catch {} _unsubMode = null })

/** props/config effective (props from section.props; fallback to defaults) */
const cfgProps = computed<any>(() => {
  const p = mySection.value?.props || {}
  return {
    headingTitle: p.headingTitle ?? defaults.headingTitle,
    headingDesc: p.headingDesc ?? defaults.headingDesc,
    featured: {
      title: p.featured?.title ?? defaults.featured.title,
      cover: p.featured?.cover ?? defaults.featured.cover,
      dateText: p.featured?.dateText ?? defaults.featured.dateText,
      category: p.featured?.category ?? defaults.featured.category,
      tags: Array.isArray(p.featured?.tags) ? p.featured.tags : defaults.featured.tags,
      href: p.featured?.href ?? defaults.featured.href
    },
    posts: Array.isArray(p.posts) ? p.posts : defaults.posts,
    newsSource: {
      mode: p.newsSource?.mode ?? defaults.newsSource.mode,
      autoTotal: Number(p.newsSource?.autoTotal ?? defaults.newsSource.autoTotal) || 5,
      featuredId: p.newsSource?.featuredId ?? '',
      postIds: Array.isArray(p.newsSource?.postIds) ? p.newsSource.postIds : []
    }
  }
})

/** Heading bindings */
const headingTitle = computed(() => cfgProps.value.headingTitle)
const headingDesc  = computed(() => cfgProps.value.headingDesc)

/** Effective mode (liveMode overrides props) */
const effectiveMode = computed<'custom'|'auto'|'manual'>(() =>
  (liveMode.value ?? cfgProps.value.newsSource.mode) as 'custom'|'auto'|'manual'
)

/** Load news when mode needs it */
watch(effectiveMode, (m) => {
  if (m !== 'custom') news.loadNews()
}, { immediate: true })

/** Mapping helpers */
function mapNewsToHero(n: any): Post {
  return {
    title: n.title,
    href: `/news?slug=${n.slug}`,
    excerpt: n.excerpt || '',
    cover: n.cover || '',
    dateText: new Date(Number(n.publishedAt||Date.now())).toLocaleString('id-ID'),
    readTime: Number(n.readTime || 3),
    category: n.category || 'Umum',
    tags: Array.isArray(n.tags) ? n.tags : []
  }
}

/** Resolve featured & posts from mode */
const resolvedFeatured = computed<Featured>(() => {
  const src = cfgProps.value.newsSource
  const mode = effectiveMode.value

  if (mode === 'custom') {
    return {
      title: cfgProps.value.featured.title,
      href: cfgProps.value.featured.href || '#',
      cover: cfgProps.value.featured.cover,
      dateText: cfgProps.value.featured.dateText,
      readTime: undefined,
      category: cfgProps.value.featured.category,
      tags: cfgProps.value.featured.tags
    }
  }
  const arr = news.items.value || []
  if (!arr.length) return { title: '', href: '#' }

  if (mode === 'auto') {
    const sorted = [...arr].sort((a,b)=>(b.publishedAt||0)-(a.publishedAt||0))
    return mapNewsToHero(sorted[0])
  } else {
    const pick = arr.find(n => n.id === src.featuredId) || arr.find(n => n.slug === src.featuredId)
    return pick ? mapNewsToHero(pick) : { title: '', href: '#' }
  }
})

const resolvedPosts = computed<Post[]>(() => {
  const src = cfgProps.value.newsSource
  const mode = effectiveMode.value
  const arr = news.items.value || []

  if (mode === 'custom') {
    return (cfgProps.value.posts || []).map((x:any) => ({
      title: x.title, href: x.href || '#', excerpt: x.excerpt || '',
      cover: x.cover || '', dateText: x.dateText || '', readTime: x.readTime,
      category: x.category || 'Umum', tags: x.tags || []
    }))
  }
  if (!arr.length) return []

  if (mode === 'auto') {
    const total = Math.max(2, Math.min(12, Number(src.autoTotal || 5)))
    const sorted = [...arr].sort((a,b)=>(b.publishedAt||0)-(a.publishedAt||0))
    return sorted.slice(1, total).map(mapNewsToHero)
  } else {
    const ids = new Set(src.postIds || [])
    const feat = src.featuredId
    const list = arr.filter(n => ids.has(n.id) && n.id !== feat)
    return list.map(mapNewsToHero)
  }
})

/** Filters (based on resolvedPosts) */
const selectedCategory = ref<'Semua' | string>('Semua')
const selectedTags = ref<Set<string>>(new Set())
const pendingTags = ref<Set<string>>(new Set())

const categoriesUi = computed(() => ['Semua', ...Array.from(new Set(resolvedPosts.value.map(p => p.category))).sort()])
const tagsUi = computed(() => Array.from(new Set(resolvedPosts.value.flatMap(p => p.tags || []))).sort((a,b)=>a.localeCompare(b)))

function setCategory(cat: string) { selectedCategory.value = cat as any }
function toggleTag(tag: string) {
  const next = new Set(pendingTags.value.size ? pendingTags.value : selectedTags.value)
  next.has(tag) ? next.delete(tag) : next.add(tag)
  pendingTags.value = next
}
function clearTags() { pendingTags.value = new Set() }
function applyFilters() {
  selectedTags.value = pendingTags.value.size ? new Set(pendingTags.value) : new Set()
}

const filtered = computed(() => {
  const catOk = (p: Post) => selectedCategory.value === 'Semua' || p.category === selectedCategory.value
  const tagsOk = (p: Post) => Array.from(selectedTags.value).every(t => (p.tags || []).includes(t))
  return resolvedPosts.value.filter(p => catOk(p) && tagsOk(p))
})
const slides = computed(() => filtered.value.slice(0, 4))
const miniList = computed(() => filtered.value.slice(4, 10))

/** Preline carousel init */
const hsOptions = {
  isAutoPlay: true,
  interval: 3800,
  isInfinite: true,
  slidesView: 1,
  gap: 16,
  breakpoints: { 640:{slidesView:2,gap:16}, 1024:{slidesView:2,gap:16}, 1280:{slidesView:3,gap:16} },
  loadingClasses: 'opacity-0'
}
async function initCarousel() {
  try {
    const mod = await import('@preline/carousel')
    // @ts-ignore
    mod.autoInit?.()
    // @ts-ignore
    window.HSStaticMethods?.autoInit?.()
  } catch {
    const { HSStaticMethods } = await import('preline')
    HSStaticMethods?.autoInit?.()
    // @ts-ignore
    window.HSStaticMethods?.autoInit?.()
  }
}
watch([slides, miniList], async () => { await nextTick(); initCarousel() })
</script>

<style>
.card-blog-image{width:100%;height:65%;object-fit:cover;object-position:center;}
.card-blog:hover .card-blog-image{width:100%;height:100%;object-fit:cover;object-position:center;}
.card-blog:hover .card-blog-content{position:absolute;bottom:2%;left:2%;width:96%;border-radius:16px;background:white;}
.dark .card-blog:hover .card-blog-content{background:rgba(23,23,23,0.8);backdrop-filter:blur(6px);}
</style>
