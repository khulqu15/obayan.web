<!-- pages/gallery.vue -->
<template>
  <section id="gallery" class="relative overflow-hidden dark:bg-neutral-900 bg-gray-100">
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
    <div class="relative pt-36">
      <div class="absolute inset-0">
        <img :src="hero.cover" class="w-full h-full object-cover opacity-80" alt="Cover Gallery">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      </div>

      <!-- height mengikuti data editor (hero.heightSm / hero.heightLg) -->
      <div
        class="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 flex items-end"
        :style="{ height: heroHeight }"
      >
        <div class="mb-10">
          <p class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-blue-200">
            <span class="inline-block size-2 rounded-full bg-blue-400" /> {{ hero.badge }}
          </p>
          <h1 class="mt-1 text-3xl sm:text-5xl font-bold text-white">{{ hero.title }}</h1>
          <p class="mt-2 text-blue-100">{{ hero.subtitle }}</p>
        </div>
      </div>
    </div>

    <!-- FILTER BAR -->
    <div class="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
      <div class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-4">
        <div class="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div class="flex-1 flex items-center gap-2">
            <label class="relative flex-1">
              <input v-model="q" type="text" :placeholder="texts.searchPlaceholder"
                     class="w-full rounded-lg border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-100 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600">
              <span class="absolute right-3 top-2.5 text-gray-400 text-xs">{{ filtered.length }} hasil</span>
            </label>

            <div>
              <select v-model="selectedCategory"
                      @change="setCategory(selectedCategory)"
                      class="block w-52 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm text-gray-700 dark:text-neutral-200 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">{{ texts.categoryAll }}</option>
                <option v-for="c in categories" :key="c" :value="c">
                  {{ c }}
                </option>
              </select>
            </div>

            <div class="hidden sm:block">
              <select v-model="sortBy"
                      class="rounded-lg border border-gray-200 text-gray-800 dark:text-neutral-100 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden">
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="title">Judul (A–Z)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mt-3">
          <button v-for="t in tagsUi" :key="t"
                  @click="toggleTag(t)"
                  class="text-[12px] px-2.5 py-1.5 rounded-full border border-gray-200 dark:border-neutral-700"
                  :class="selectedTags.has(t) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/80 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300'">
            #{{ t }}
          </button>
          <button @click="resetFilters"
                  class="text-[12px] px-2.5 py-1.5 rounded-full border text-gray-800 dark:text-neutral-100 border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
            Reset
          </button>
        </div>
      </div>

      <!-- MASONRY -->
      <div class="mt-6 columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
        <div v-for="(img, idx) in paged" :key="img.src" class="mb-4 break-inside-avoid">
          <figure class="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60">
            <img
              :src="img.src"
              :alt="img.title"
              loading="lazy"
              class="w-full h-auto object-cover group-hover:scale-[1.02] transition"
              @click="openLightbox(startIndex + idx)"
            />
            <figcaption class="pointer-events-none absolute inset-x-0 bottom-0 p-3 text-white text-xs
                                bg-gradient-to-t from-black/50 via-black/10 to-transparent">
              <div class="flex items-center justify-between gap-2">
                <div class="truncate">{{ img.title }}</div>
                <div class="hidden sm:flex flex-wrap gap-1 opacity-90">
                  <span v-for="t in img.tags" :key="t" class="px-1.5 py-0.5 rounded bg-black/40">#{{ t }}</span>
                </div>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>

      <!-- LOAD MORE -->
      <div v-if="hasMore" class="mt-6 text-center">
        <button
          class="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700"
          @click="loadMore"
        >
          <ClientOnly><Icon icon="ph:arrow-circle-down" class="size-4" /></ClientOnly>
          {{ texts.loadMore }}
        </button>
      </div>
    </div>

    <!-- LIGHTBOX -->
    <div id="hs-lightbox" class="hs-overlay hidden size-full fixed top-0 start-0 z-[90] overflow-x-hidden overflow-y-auto" role="dialog" tabindex="-1" aria-labelledby="hs-lightbox-label">
      <div class="hs-overlay-open:opacity-100 hs-overlay-open:duration-300 opacity-0 ease-out transition-all max-w-[96rem] w-full mx-auto p-3">
        <div class="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-800 bg-neutral-950/90">
          <!-- Toolbar -->
          <div class="absolute z-20 top-2 right-2 flex items-center gap-2">
            <button @click="prev" class="size-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center">
              <ClientOnly><Icon icon="ph:caret-left-bold" class="size-5" /></ClientOnly>
            </button>
            <button @click="next" class="size-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center">
              <ClientOnly><Icon icon="ph:caret-right-bold" class="size-5" /></ClientOnly>
            </button>
            <button @click="resetZoom" class="size-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center">
              <ClientOnly><Icon icon="ph:magnifying-glass" class="size-5" /></ClientOnly>
            </button>
            <button type="button" class="size-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center"
                    data-hs-overlay="#hs-lightbox" aria-label="Close">
              <ClientOnly><Icon icon="ph:x-bold" class="size-5" /></ClientOnly>
            </button>
          </div>

          <!-- Canvas -->
          <div class="relative h-[80vh] bg-white select-none">
            <div
              ref="stageRef"
              :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
              class="absolute inset-0"
              @wheel="onWheel"
              @mousedown="onPointerDown"
              @mousemove="onPointerMove"
              @mouseup="onPointerUp"
              @mouseleave="onPointerUp"
              @touchstart.passive="onTouchStart"
              @touchmove.prevent="onTouchMove"
              @touchend="onTouchEnd"
              @dblclick="onDblClick"
            >
              <img
                :src="current?.src"
                :alt="current?.title"
                class="absolute top-1/2 left-1/2 will-change-transform"
                :style="imgStyle"
                draggable="false"
              />
            </div>

            <div class="absolute bottom-2 left-2 right-2 text-white/90 text-sm flex items-center justify-between">
              <div class="truncate">{{ current?.title }}</div>
              <div class="text-xs">{{ (scale * 100).toFixed(0) }}% • {{ index + 1 }} / {{ filtered.length }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute } from '#imports'
import { useRuntimeConfig, useSeoMeta, useHead } from '#app'
import { useWeb } from '~/composables/data/useWeb'

definePageMeta({ ssr: false }) // opsional, agar meta reaktif dari client

/* ======= Ambil meta + sections dari useWeb untuk path /gallery ======= */
const route = useRoute()
const config = useRuntimeConfig()
const web = useWeb()
const { subscribePage, sections, meta } = web

const PATH = '/gallery'
onMounted(async () => {
  (web as any)?.setActivePath?.(PATH)
  await subscribePage(PATH)
})
watch(() => route.path, async () => {
  (web as any)?.setActivePath?.(PATH)
  await subscribePage(PATH)
})

/* ======= SEO dari meta CMS (fallback ke defaults) ======= */
const fallbackTitle = 'Galeri ALBERR'
const fallbackDesc = 'Dokumentasi kegiatan, fasilitas, dan momen terbaik di pesantren.'
const canonical = computed(() => new URL(PATH, config.public.siteUrl).toString())
const seoTitle = computed(() => meta.value?.title || fallbackTitle)
const seoDesc  = computed(() => meta.value?.description || fallbackDesc)
const ogImage  = computed(() => meta.value?.ogImage || '/assets/logo.png')

useSeoMeta({
  title: seoTitle,
  description: seoDesc,
  ogTitle: seoTitle,
  ogDescription: seoDesc,
  ogType: 'website',
  ogUrl: canonical,
  ogImage,
  twitterCard: 'summary_large_image',
  themeColor: '#0ea5e9',
  robots: 'index, follow'
})
useHead({ link: [{ rel: 'canonical', href: canonical.value }] })

/* ======= Props Galeri dari section 'GalleryPage' ======= */
type Shape = {
  hero: { cover: string; badge: string; title: string; subtitle: string; heightSm: string; heightLg: string },
  texts: { searchPlaceholder: string; categoryAll: string; loadMore: string },
  gallery: { items: Array<{ src: string; title: string; category: string; tagsText?: string; tags?: string[]; createdAt?: number }> }
}
const defaults: Shape = {
  hero: {
    cover: '/assets/images/activity1.jpg',
    badge: 'Galeri ALBERR',
    title: 'Galeri ALBERR',
    subtitle: 'Dokumentasi kegiatan, fasilitas, dan momen terbaik di pesantren.',
    heightSm: '36vh',
    heightLg: '44vh'
  },
  texts: {
    searchPlaceholder: 'Cari foto (judul/tag/kategori)…',
    categoryAll: 'All',
    loadMore: 'Tampilkan Lebih Banyak'
  },
  gallery: { items: [] }
}

function merge(base: Shape, patch?: Partial<Shape>): Shape {
  return {
    hero: {
      cover: patch?.hero?.cover ?? base.hero.cover,
      badge: patch?.hero?.badge ?? base.hero.badge,
      title: patch?.hero?.title ?? base.hero.title,
      subtitle: patch?.hero?.subtitle ?? base.hero.subtitle,
      heightSm: patch?.hero?.heightSm ?? base.hero.heightSm,
      heightLg: patch?.hero?.heightLg ?? base.hero.heightLg
    },
    texts: {
      searchPlaceholder: patch?.texts?.searchPlaceholder ?? base.texts.searchPlaceholder,
      categoryAll: patch?.texts?.categoryAll ?? base.texts.categoryAll,
      loadMore: patch?.texts?.loadMore ?? base.texts.loadMore
    },
    gallery: {
      items: Array.isArray(patch?.gallery?.items) ? patch!.gallery!.items : []
    }
  }
}

const galleryProps = computed<Partial<Shape> | undefined>(() =>
  sections.value.find(s => s.key === 'GalleryPage')?.props as any
)
const shape = computed<Shape>(() => merge(defaults, galleryProps.value))

/* ======= Derivasi untuk UI ======= */
const hero = computed(() => shape.value.hero)
const texts = computed(() => shape.value.texts)
const items = computed(() =>
  (shape.value.gallery.items || []).map((it, idx) => {
    const tags = Array.isArray((it as any).tags)
      ? (it as any).tags
      : (it.tagsText || '').split(',').map(t => t.trim()).filter(Boolean)
    return {
      src: it.src,
      title: it.title || `Dokumentasi #${idx + 1}`,
      category: it.category || '',
      tags,
      createdAt: it.createdAt ?? (Date.now() - (idx + 1) * 86400000)
    }
  })
)

/* Responsive hero height */
const isLg = ref(false)
const heroHeight = computed(() => (isLg.value ? hero.value.heightLg : hero.value.heightSm))
onMounted(() => {
  const mq = window.matchMedia('(min-width: 1024px)')
  const handler = () => (isLg.value = mq.matches)
  handler(); mq.addEventListener('change', handler)
  onBeforeUnmount(() => mq.removeEventListener('change', handler))
})

/* Filter / Sort / Pagination (tetap seperti punyamu) */
const q = ref('')
const selectedCategory = ref<string>('')
const sortBy = ref<'newest' | 'oldest' | 'title'>('newest')
const categories = computed(() => Array.from(new Set(items.value.map(i => i.category).filter(Boolean))))
const allTags = computed(() => Array.from(new Set(items.value.flatMap(i => i.tags))))
const selectedTags = ref<Set<string>>(new Set())
const tagsUi = computed(() => allTags.value)
function setCategory(c: string){ selectedCategory.value = c || '' }
function toggleTag(t: string){ const s=new Set(selectedTags.value); s.has(t)?s.delete(t):s.add(t); selectedTags.value=s }
function resetFilters(){ q.value=''; selectedCategory.value=''; selectedTags.value=new Set(); sortBy.value='newest' }

const filtered = computed(() => {
  let out = items.value.filter(i => {
    const mq = q.value.trim().toLowerCase()
    const matchQ = !mq || i.title.toLowerCase().includes(mq) || i.tags.some(t => t.toLowerCase().includes(mq)) || i.category.toLowerCase().includes(mq)
    const matchC = !selectedCategory.value || i.category === selectedCategory.value
    const matchT = selectedTags.value.size === 0 || [...selectedTags.value].every(t => i.tags.includes(t))
    return matchQ && matchC && matchT
  })
  if (sortBy.value === 'newest') out.sort((a, b) => b.createdAt - a.createdAt)
  if (sortBy.value === 'oldest') out.sort((a, b) => a.createdAt - b.createdAt)
  if (sortBy.value === 'title') out.sort((a, b) => a.title.localeCompare(b.title))
  return out
})
const page = ref(1)
const pageSize = 12
const startIndex = computed(() => 0)
const paged = computed(() => filtered.value.slice(0, page.value * pageSize))
const hasMore = computed(() => paged.value.length < filtered.value.length)
function loadMore(){ page.value++ }

/* Lightbox (tetap) */
const index = ref(0)
const current = computed(() => filtered.value[index.value])
function openLightbox(i:number){ index.value=i; resetZoom(); const el=document.getElementById('hs-lightbox'); el?.classList.remove('hidden'); el?.classList.add('block'); document.addEventListener('keydown', onKey) }
function closeLightbox(){ const el=document.getElementById('hs-lightbox'); el?.classList.add('hidden'); el?.classList.remove('block'); document.removeEventListener('keydown', onKey) }
function prev(){ index.value = (index.value - 1 + filtered.value.length) % filtered.value.length; resetZoom(false) }
function next(){ index.value = (index.value + 1) % filtered.value.length; resetZoom(false) }
function onKey(e: KeyboardEvent){ if (e.key==='Escape') closeLightbox(); if (e.key==='ArrowLeft') prev(); if (e.key==='ArrowRight') next() }

/* Zoom/pan (tetap) */
const stageRef = ref<HTMLElement | null>(null)
const scale = ref(1), minScale=1, maxScale=4
const tx = ref(0), ty = ref(0)
const isDragging = ref(false)
let startX=0, startY=0, startTx=0, startTy=0, pinchStartDist=0, pinchStartScale=1
let pinchCenter = { x:0, y:0 }
const imgStyle = computed(()=>({ transform:`translate(-50%,-50%) translate(${tx.value}px, ${ty.value}px) scale(${scale.value})`, transformOrigin:'center center', maxWidth:'none', maxHeight:'none'}))
function resetZoom(center=true){ scale.value=0.6; tx.value=0; ty.value=0; if(center) clampPan() }
function clampPan(){ if (scale.value<=1){ tx.value=0; ty.value=0; return } const el=stageRef.value; if(!el) return; const r=el.getBoundingClientRect(); const bx=(r.width*(scale.value-1))/2; const by=(r.height*(scale.value-1))/2; tx.value=Math.max(Math.min(tx.value,bx),-bx); ty.value=Math.max(Math.min(ty.value,by),-by) }
function onWheel(e: WheelEvent){ const rect=(e.currentTarget as HTMLElement).getBoundingClientRect(); const cx=e.clientX-rect.left-rect.width/2; const cy=e.clientY-rect.top-rect.height/2; const isPinch=e.ctrlKey===true; if(isPinch){ e.preventDefault(); const prev=scale.value; let next=prev*(1 - e.deltaY*0.02); next=Math.min(Math.max(next,minScale),maxScale); if(next===prev) return; const k=next/prev; tx.value=cx - k*(cx - tx.value); ty.value=cy - k*(cy - ty.value); scale.value=next; clampPan(); return } if (scale.value>1){ e.preventDefault(); tx.value -= e.deltaX; ty.value -= e.deltaY; clampPan() } }
function onPointerDown(e: MouseEvent){ if(e.button!==0) return; isDragging.value=true; startX=e.clientX; startY=e.clientY; startTx=tx.value; startTy=ty.value }
function onPointerMove(e: MouseEvent){ if(!isDragging.value) return; tx.value=startTx+(e.clientX-startX); ty.value=startTy+(e.clientY-startY); clampPan() }
function onPointerUp(){ isDragging.value=false }
function onDblClick(e: MouseEvent){ const rect=(e.currentTarget as HTMLElement).getBoundingClientRect(); const cx=e.clientX-rect.left-rect.width/2; const cy=e.clientY-rect.top-rect-rect.height/2; const prev=scale.value; const next=prev<2?2:1; const k=next/prev; tx.value=cx - k*(cx - tx.value); ty.value=cy - k*(cy - ty.value); scale.value=next; if(next===1){ tx.value=0; ty.value=0 } clampPan() }
function distance(t1: Touch, t2: Touch){ const dx=t2.clientX-t1.clientX, dy=t2.clientY-t1.clientY; return Math.hypot(dx,dy) }
function midpoint(t1: Touch, t2: Touch, rect: DOMRect){ return { x:((t1.clientX+t2.clientX)/2)-rect.left-rect.width/2, y:((t1.clientY+t2.clientY)/2)-rect.top-rect.height/2 } }
function onTouchStart(e: TouchEvent){ if(e.touches.length===1){ isDragging.value=true; startX=e.touches[0]!.clientX; startY=e.touches[0]!.clientY; startTx=tx.value; startTy=ty.value } else if(e.touches.length===2){ const rect=(e.currentTarget as HTMLElement).getBoundingClientRect(); pinchStartDist=distance(e.touches[0]!, e.touches[1]!); pinchStartScale=scale.value; pinchCenter=midpoint(e.touches[0]!, e.touches[1]!, rect) } }
function onTouchMove(e: TouchEvent){ if(e.touches.length===1 && isDragging.value){ tx.value=startTx + (e.touches[0]!.clientX-startX); ty.value=startTy + (e.touches[0]!.clientY-startY); clampPan() } else if(e.touches.length===2 && pinchStartDist>0){ const rect=(e.currentTarget as HTMLElement).getBoundingClientRect(); const curr=distance(e.touches[0]!, e.touches[1]!); let next=pinchStartScale * (curr/pinchStartDist); next=Math.min(Math.max(next,minScale),maxScale); const prev=scale.value; const k=next/prev; tx.value=pinchCenter.x - k*(pinchCenter.x - tx.value); ty.value=pinchCenter.y - k*(pinchCenter.y - ty.value); scale.value=next; clampPan() } }
function onTouchEnd(){ isDragging.value=false; if(pinchStartDist>0 && scale.value<1.02) resetZoom(); pinchStartDist=0 }

/* cleanup overlay */
onMounted(() => { document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox() }) })
onBeforeUnmount(() => { document.removeEventListener('keydown', onKey) })
</script>