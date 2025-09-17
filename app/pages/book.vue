<!-- /pages/book.vue -->
<template>
  <section class="relative px-4 pb-12 pt-24 text-gray-800 dark:text-neutral-200 overflow-hidden">
    <div class="absolute w-full bg-gradient-to-b from-emerald-700/50 to-blue-700/0 top-0 left-0 h-[20vh]"></div>
    <!-- Decorative BG -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-white dark:bg-neutral-950 [background-image:radial-gradient(theme(colors.emerald.100)_1px,transparent_1px)] [background-size:18px_18px] [background-position:0_0] dark:[background-image:radial-gradient(theme(colors.emerald.900/.25)_1px,transparent_1px)]"></div>
      <div class="absolute -top-24 -left-28 w-[38rem] h-[38rem] rounded-full opacity-30 blur-3xl bg-[radial-gradient(closest-side,theme(colors.emerald.300/.35),transparent)] dark:bg-[radial-gradient(closest-side,theme(colors.emerald.700/.25),transparent)]" />
      <div class="absolute top-28 -right-24 w-[34rem] h-[34rem] rounded-full opacity-25 blur-3xl bg-[radial-gradient(closest-side,theme(colors.sky.300/.35),transparent)] dark:bg-[radial-gradient(closest-side,theme(colors.sky.700/.25),transparent)]" />
    </div>

    <!-- Header -->
    <div class="flex relative z-20 flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div class="space-y-1">
        <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight">
          Pustaka Digital
        </h1>
        <p class="text-sm text-gray-500 dark:text-neutral-400">
          Jelajahi koleksi buku, kitab, modul, dan lain-lain.
        </p>
      </div>

      <!-- Search + Filter -->
      <div class="flex w-full flex-col sm:flex-row sm:flex-wrap md:w-auto gap-2">
        <div class="relative sm:w-80 w-full">
          <Icon icon="lucide:search" class="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            v-model="q"
            type="search"
            placeholder="Cari judul/penulis/tag…"
            class="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-gray-100 bg-white/90 backdrop-blur focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:bg-neutral-800 dark:border-neutral-700"
          />
        </div>

        <div class="flex flex-wrap gap-1.5 items-center overflow-x-auto no-scrollbar">
          <button
            class="px-3 py-2 text-xs rounded-full border transition"
            :class="fCategory==='all' ? 'bg-emerald-600 text-white border-gray-600' : 'bg-white dark:bg-neutral-800 dark:border-neutral-700 border-gray-200 dark:hover:bg-neutral-700'"
            @click="fCategory='all'"
          >
            Semua
          </button>
          <button
            v-for="c in BOOK_CATEGORIES" :key="c"
            class="px-3 py-2 text-xs rounded-full border transition"
            :class="fCategory===c ? 'bg-emerald-600 text-white border-gray-600' : 'bg-white dark:bg-neutral-800 dark:border-neutral-700 border-gray-200 dark:hover:bg-neutral-700'"
            @click="fCategory=c"
          >
            {{ c }}
          </button>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
      <Icon icon="lucide:info" class="size-4" />
      <span>Menampilkan {{ publicList.length }} dari {{ totalCount }} item.</span>
    </div>

    <!-- Grid -->
    <div class="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4">
      <!-- Loading skeletons -->
      <template v-if="loading">
        <div v-for="i in 8" :key="i" class="rounded-2xl overflow-hidden border border-gray-100/60 dark:border-gray-900/30 bg-white/70 dark:bg-neutral-800/70">
          <div class="aspect-[3/4] animate-pulse bg-emerald-100/40 dark:bg-neutral-700/40"></div>
          <div class="p-3 space-y-2">
            <div class="h-3 rounded bg-emerald-100/60 dark:bg-neutral-700/60"></div>
            <div class="h-3 w-1/2 rounded bg-emerald-100/60 dark:bg-neutral-700/60"></div>
          </div>
        </div>
      </template>

      <!-- Cards -->
      <div
        v-else
        v-for="b in publicList"
        :key="b.id"
        class="group rounded-2xl overflow-hidden border border-gray-100/60 dark:border-gray-900/30 bg-white/90 dark:bg-neutral-800/90 hover:shadow-lg hover:-translate-y-0.5 transition-all"
      >
        <div class="relative">
          <img v-if="b.coverUrl" :src="b.coverUrl" alt="" class="w-full h-full object-cover aspect-[3/4]" />
          <div v-else class="w-full aspect-[3/4] bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-neutral-700 dark:to-neutral-700 grid place-items-center">
            <Icon icon="lucide:book-open-check" class="size-9 600" />
          </div>

          <div class="absolute top-2 left-2 flex gap-1">
            <span class="px-2 py-0.5 text-[10px] rounded-full bg-emerald-600/90 text-white backdrop-blur ring-1 ring-emerald-800/30">{{ b.category }}</span>
            <span v-if="b.year" class="px-2 py-0.5 text-[10px] rounded-full bg-sky-600/90 text-white backdrop-blur ring-1 ring-sky-800/30">{{ b.year }}</span>
          </div>

          <div class="absolute bottom-2 right-2 flex gap-1">
            <button
              v-if="b.pdfUrl"
              class="px-2 py-1 rounded-lg bg-white/90 dark:bg-neutral-900/80 text-[11px] shadow ring-1 ring-emerald-100/70 dark:ring-emerald-900/40 hover:bg-white"
              @click.stop="openViewer(b)"
            >
              <Icon icon="lucide:book-open" class="inline size-4 -mt-0.5" /> Baca
            </button>
          </div>
        </div>

        <div class="p-3">
          <h3 class="font-semibold line-clamp-2 min-h-[2.4em]">{{ b.title }}</h3>
          <p class="text-xs text-gray-500 dark:text-neutral-400 line-clamp-1 mt-0.5">{{ b.author || '—' }}</p>

          <div class="mt-2 flex items-center gap-1.5">
            <button class="px-2 py-1.5 text-xs rounded-lg border border-gray-100/70 hover:bg-emerald-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
                    @click="openDetail(b)">
              Detail
            </button>
            <button class="px-2 py-1.5 text-xs rounded-lg border border-gray-200 700 hover:bg-blue-50 dark:border-gray-700 dark:300 dark:hover:bg-blue-900/20"
                    @click="openDownload(b)">
              Unduh
            </button>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-if="!loading && !publicList.length" class="col-span-full p-6 text-sm text-gray-600 border border-dashed border-gray-200 rounded-2xl bg-emerald-50/40 dark:bg-neutral-800 dark:text-neutral-400 dark:border-gray-900/30">
        Belum ada koleksi aktif atau tidak ditemukan.
      </div>
    </div>

    <!-- MODAL: Detail -->
    <teleport to="body">
      <div v-if="detailModal.open" class="fixed inset-0 z-[95]">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeDetail()"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-3xl rounded-3xl border border-gray-100/70 bg-white/95 shadow-2xl ring-1 ring-black/5 dark:bg-neutral-800 dark:border-neutral-700 overflow-hidden">
            <div class="flex flex-col md:flex-row">
              <!-- Cover -->
              <div class="md:w-48">
                <img v-if="detailModal.item?.coverUrl" :src="detailModal.item?.coverUrl" alt="" class="w-full h-full object-cover aspect-[3/4]" />
                <div v-else class="w-full aspect-[3/4] bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-neutral-700 dark:to-neutral-700 grid place-items-center">
                  <Icon icon="lucide:book" class="size-8 600" />
                </div>
              </div>

              <!-- Body -->
              <div class="flex-1 p-4">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <h3 class="font-semibold text-lg leading-snug">{{ detailModal.item?.title }}</h3>
                    <p class="text-xs text-gray-500 dark:text-neutral-400">
                      {{ detailModal.item?.author || '—' }} • {{ detailModal.item?.category }}
                      <template v-if="detailModal.item?.year"> • {{ detailModal.item?.year }}</template>
                      <template v-if="detailModal.item?.pages"> • {{ detailModal.item?.pages }} hlm</template>
                    </p>
                  </div>
                  <button class="p-2 rounded-lg bg-gray-200 dark:hover:bg-neutral-700" @click="closeDetail()">
                    <Icon icon="lucide:x" class="size-4" />
                  </button>
                </div>

                <p v-if="detailModal.item?.description" class="mt-3 text-sm leading-relaxed text-gray-700 dark:text-neutral-300">
                  {{ detailModal.item?.description }}
                </p>

                <div v-if="detailModal.item?.tags?.length" class="mt-3 flex flex-wrap gap-1">
                  <span v-for="t in detailModal.item!.tags!" :key="t" class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 700 ring-1 ring-emerald-100 dark:bg-emerald-900/20 dark:300 dark:ring-emerald-900/30">#{{ t }}</span>
                </div>

                <div class="mt-4 flex flex-wrap items-center gap-2">
                  <button v-if="detailModal.item?.pdfUrl" class="inline-flex items-center gap-x-2 rounded-xl bg-emerald-600 text-white px-3 py-2 text-sm font-medium hover:bg-emerald-700"
                          @click="openViewer(detailModal.item!)">
                    <Icon icon="lucide:book-open" class="size-4" /> Baca
                  </button>
                  <button class="inline-flex items-center gap-x-2 rounded-xl border border-gray-200 700 bg-white px-3 py-2 text-sm font-medium hover:bg-blue-50 dark:border-gray-700 dark:300 dark:bg-neutral-800 dark:hover:bg-blue-900/20"
                          @click="openDownload(detailModal.item!)">
                    <Icon icon="lucide:download" class="size-4" /> Unduh
                  </button>
                </div>
              </div>
            </div>

            <div class="p-3 border-t border-gray-100/70 dark:border-neutral-700 text-[11px] text-gray-500 dark:text-neutral-400">
              Terakhir diperbarui: {{ timeAgo(detailModal.item?.updatedAt || Date.now()) }}
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- MODAL: Download -->
    <teleport to="body">
      <div v-if="downloadModal.open" class="fixed inset-0 z-[96]">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeDownload()"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-md rounded-2xl border border-sky-200/60 bg-white/95 dark:bg-neutral-800 dark:border-sky-900/30 shadow-xl">
            <div class="p-4 border-b border-sky-200/60 dark:border-sky-900/30 flex items-center gap-2">
              <Icon icon="lucide:download" class="size-5 text-sky-600" />
              <h3 class="font-semibold">Unduh Berkas</h3>
              <button class="ml-auto p-2 rounded-lg hover:bg-sky-50 dark:hover:bg-neutral-700" @click="closeDownload()">
                <Icon icon="lucide:x" class="size-4" />
              </button>
            </div>
            <div class="p-4 text-sm space-y-3">
              <p><span class="font-medium">{{ downloadModal.item?.title }}</span></p>
              <p class="text-gray-600 dark:text-neutral-300">Berkas PDF akan dibuka atau diunduh di tab baru. Pastikan koneksi internet stabil.</p>
              <label class="inline-flex items-center gap-2 text-xs">
                <input type="checkbox" v-model="downloadModal.agree" class="rounded border-gray-200 600 focus:ring-emerald-500" />
                Saya setuju untuk menggunakan berkas ini secara wajar.
              </label>
            </div>
            <div class="p-4 flex items-center justify-end gap-2">
              <button class="px-3 py-2 rounded-xl border dark:border-neutral-700" @click="closeDownload()">Batal</button>
              <button :disabled="!downloadModal.agree || !downloadModal.item?.pdfUrl"
                      class="px-3 py-2 rounded-xl text-white"
                      :class="(!downloadModal.agree || !downloadModal.item?.pdfUrl) ? 'bg-emerald-600/60' : 'bg-emerald-600 hover:bg-emerald-700'"
                      @click="doDownload(downloadModal.item!)">
                Unduh Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- MODAL: PDF Viewer -->
    <teleport to="body">
      <div v-if="viewer.open" class="fixed inset-0 z-[97]">
        <div class="absolute inset-0 bg-black/70" @click="closeViewer()"></div>
        <div class="absolute inset-0 flex flex-col">
          <!-- Toolbar -->
          <div class="p-3 flex items-center justify-between bg-neutral-950/70 text-white backdrop-blur">
            <div class="flex items-center gap-2 min-w-0">
              <Icon icon="lucide:file-text" class="size-5" />
              <p class="truncate">{{ viewer.item?.title || '—' }}</p>
            </div>
            <div class="flex items-center gap-2">
              <a v-if="viewer.item?.pdfUrl" :href="viewer.item?.pdfUrl" target="_blank"
                 class="inline-flex items-center gap-1 rounded-lg border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10">
                <Icon icon="lucide:external-link" class="size-4" /> Buka Tab
              </a>
              <button class="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs" @click="closeViewer()">
                <Icon icon="lucide:x" class="size-4" /> Tutup
              </button>
            </div>
          </div>
          <!-- Frame -->
          <div class="flex-1 min-h-0 bg-neutral-900">
            <iframe
              v-if="viewer.item?.pdfUrl"
              :src="viewer.item?.pdfUrl + '#toolbar=0&view=FitH'"
              class="w-full h-full"
              title="PDF Viewer"
            />
            <div v-else class="w-full h-full grid place-items-center text-white/80">PDF tidak tersedia.</div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- TOASTS -->
    <teleport to="body">
      <div class="fixed bottom-4 right-4 z-[100] space-y-2">
        <div v-for="t in toasts" :key="t.id"
             class="rounded-xl px-4 py-3 shadow-lg ring-1 backdrop-blur"
             :class="t.type==='success' ? 'bg-emerald-600/90 text-white ring-emerald-800/50'
                                        : t.type==='error' ? 'bg-rose-600/90 text-white ring-rose-800/50'
                                        : 'bg-neutral-800/90 text-white ring-black/20'">
          <div class="flex items-center gap-2">
            <Icon :icon="t.type==='success' ? 'lucide:check-circle' : t.type==='error' ? 'lucide:alert-triangle' : 'lucide:info'" class="size-4" />
            <span class="text-sm">{{ t.message }}</span>
          </div>
        </div>
      </div>
    </teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useBook, BOOK_CATEGORIES, type BookItem } from '~/composables/data/useBook'
import { useWeb } from '~/composables/data/useWeb'
import { definePageMeta } from '#imports'
import { useRuntimeConfig } from 'nuxt/app'

const {
  meta, sortedSections, subscribePage,
} = useWeb()

const router = useRouter()
const route = useRoute()

definePageMeta({ ssr: false }) // client-only, karena baca Firebase via plugin/composable
const config = useRuntimeConfig()
const fallbackTitle = 'Kitab Ponpes Alberr | Pesantren Inovatif & Informatif'
const fallbackDescription = 'Selamat datang di Ponpes Alberr Pandaan: KMI/Diniyah, Tahfidz, MTs/MA, kegiatan santri, dan PPDB online.'
const url = computed(() => new URL(route.fullPath || '/', config.public.siteUrl).toString())

const seoTitle = computed(() => meta.value?.title || fallbackTitle)
const seoDesc  = computed(() => meta.value?.description || fallbackDescription)
const ogImage  = computed(() => meta.value?.ogImage || '/assets/logo.png')

useSeoMeta({
  title: seoTitle,
  description: seoDesc,
  ogTitle: seoTitle,
  ogDescription: seoDesc,
  ogType: 'website',
  ogUrl: url,
  ogImage: ogImage,
  twitterCard: 'summary_large_image',
  twitterSite: () => (config.public.twitterSite || undefined),
  themeColor: '#0ea5e9',
  robots: 'index, follow'
})

useHead({
  link: [{ rel: 'canonical', href: url.value }],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: config.public.siteName,
        url: config.public.siteUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${config.public.siteUrl}/search?q={query}`,
          'query-input': 'required name=query'
        }
      }))
    },
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Pondok Pesantren Alberr',
        url: config.public.siteUrl,
        logo: `${config.public.siteUrl}/assets/logo.png`,
        sameAs: [
          'https://facebook.com/alberr',
          'https://instagram.com/alberr'
        ]
      }))
    }
  ]
})

/** Data buku (Realtime) */
const { filtered, q, fCategory, fAktif, subscribeAll, unbindList } = useBook()
const loading = computed(() => false) // loading ada di composable; jika kamu expose, ganti ini dengan state asli
fAktif.value = 'aktif' // hanya tampilkan yang aktif untuk publik

const publicList = computed(() => filtered.value.filter(b => b.aktif !== false))
const totalCount = computed(() => filtered.value.length)

/** Toast */
type Toast = { id: number; message: string; type?: 'success'|'error'|'info' }
const toasts = ref<Toast[]>([])
function toast(message: string, type: Toast['type']='success') {
  const id = Date.now() + Math.random()
  toasts.value.push({ id, message, type })
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 3200)
}

/** Modal: Detail */
const detailModal = ref<{ open:boolean; item: BookItem|null }>({ open:false, item:null })
function openDetail(b: BookItem){ detailModal.value.open = true; detailModal.value.item = b }
function closeDetail(){ detailModal.value.open = false; detailModal.value.item = null }

/** Modal: Download */
const downloadModal = ref<{ open:boolean; item: BookItem|null; agree:boolean }>({ open:false, item:null, agree:false })
function openDownload(b: BookItem){
  if(!b.pdfUrl){ toast('PDF tidak tersedia.', 'error'); return }
  downloadModal.value = { open:true, item:b, agree:false }
}
function closeDownload(){ downloadModal.value.open = false; downloadModal.value.item = null; downloadModal.value.agree = false }
function doDownload(b: BookItem){
  if(!b.pdfUrl) return
  // trigger download/open new tab
  const a = document.createElement('a')
  a.href = b.pdfUrl
  a.target = '_blank'
  a.rel = 'noopener'
  // sebagian hosting Storage tidak support "download", jadi fallback open tab
  try { a.setAttribute('download', (b.title || 'file') + '.pdf') } catch {}
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
  toast('Mengunduh berkas…', 'info')
  closeDownload()
}

/** Modal: Viewer */
const viewer = ref<{ open:boolean; item: BookItem|null }>({ open:false, item:null })
function openViewer(b: BookItem){
  if(!b.pdfUrl){ toast('PDF tidak tersedia.', 'error'); return }
  viewer.value.open = true; viewer.value.item = b
  const q = { ...route.query, viewer: String(b.id || b.slug || b.title) }
  router.push({ query: q })
}

function closeViewer(){
  // hapus ?viewer tanpa pindah halaman
  const q: Record<string, any> = { ...route.query }
  if ('viewer' in q) { delete q.viewer; router.replace({ query: q }) }
  viewer.value.open = false; viewer.value.item = null
}
// sinkronkan modal dengan URL (menangkap tombol Back pada mobile)
watch(() => route.query.viewer, (val) => {
  if (!val) { viewer.value.open = false; viewer.value.item = null; return }
  const id = String(val)
  const item = publicList.value.find((b: any) => String(b.id||b.slug||b.title) === id)
  if (item) { viewer.value.open = true; viewer.value.item = item }
})

onMounted(() => {
  const v = route.query.viewer
  if (v) {
    const id = String(v)
    const item = publicList.value.find((b: any) => String(b.id||b.slug||b.title) === id)
    if (item) { viewer.value.open = true; viewer.value.item = item }
  }
})

/** Utils */
function timeAgo(ts: number){
  const diff = Math.max(1, Math.round((Date.now() - ts) / 1000))
  if (diff < 60) return `${diff}s lalu`
  const m = Math.round(diff / 60)
  if (m < 60) return `${m}m lalu`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}j lalu`
  const d = Math.round(h / 24)
  return `${d}h lalu`
}

/** Lifecycles */
onMounted(() => { subscribeAll() })
onUnmounted(() => { unbindList() })
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar{ display:none; }
.no-scrollbar{ -ms-overflow-style:none; scrollbar-width:none; }
</style>
