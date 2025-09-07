<!-- pages/program.vue -->
<template>
  <section id="program" class="relative overflow-hidden dark:bg-neutral-900 bg-gray-100">
    <!-- BG grid + blobs -->
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
        <img :src="cfg.hero.cover" class="w-full heroH object-cover opacity-80" alt="Pelajari Program"
             :style="{'--hero-sm': cfg.hero.heightSm, '--hero-lg': cfg.hero.heightLg}">
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
      </div>
      <div class="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 heroH flex items-end"
           :style="{'--hero-sm': cfg.hero.heightSm, '--hero-lg': cfg.hero.heightLg}">
        <div class="mb-10">
          <p class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-blue-200">
            <span class="inline-block size-2 rounded-full bg-blue-400" /> {{ cfg.hero.badge }}
          </p>
          <h1 class="mt-1 text-3xl sm:text-5xl font-bold text-white">{{ cfg.hero.title }}</h1>
          <p class="mt-2 text-blue-100 max-w-3xl">{{ cfg.hero.subtitle }}</p>
          <div class="mt-5 flex flex-wrap gap-2">
            <NuxtLink to="#ringkas" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700">Ringkasan</NuxtLink>
            <NuxtLink to="#kurikulum" class="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 backdrop-blur px-4 py-2.5 text-sm font-medium text-white hover:bg-white/20">Kurikulum</NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- BODY -->
    <div class="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
      <!-- Loading skeleton -->
      <div v-if="pending" class="grid gap-6">
        <div class="h-48 sm:h-56 rounded-2xl bg-gray-200/60 dark:bg-neutral-800/60 animate-pulse" />
        <div class="h-40 rounded-2xl bg-gray-200/60 dark:bg-neutral-800/60 animate-pulse" />
        <div class="h-64 rounded-2xl bg-gray-200/60 dark:bg-neutral-800/60 animate-pulse" />
      </div>

      <template v-else>
        <!-- Ringkas/Stats -->
        <section id="ringkas" class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="s in cfg.stats" :key="s.label" class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-5">
            <div class="flex items-center gap-3">
              <ClientOnly><Icon :icon="s.icon" class="size-7 text-blue-600" /></ClientOnly>
              <div>
                <p class="text-2xl font-bold text-gray-900 dark:text-white leading-none">{{ s.value }}</p>
                <p class="text-[12px] text-gray-500 dark:text-neutral-400">{{ s.label }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- FILTER -->
        <section class="mt-8 rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-4">
          <div class="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div class="flex items-center gap-2">
              <label class="text-xs text-gray-600 dark:text-neutral-300">Jenjang</label>
              <select v-model="level" class="rounded-lg border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-100 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm">
                <option value="">Semua</option>
                <option v-for="l in cfg.filters.levels" :key="l" :value="l">{{ l }}</option>
              </select>
            </div>

            <div class="flex items-center gap-2">
              <label class="text-xs text-gray-600 dark:text-neutral-300">Kategori</label>
              <select v-model="category" class="rounded-lg border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-100 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm">
                <option value="">Semua</option>
                <option v-for="c in cfg.filters.categories" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>

            <div class="flex-1">
              <input v-model="q" type="text" placeholder="Cari program (judul/keyword)…"
                     class="w-full rounded-lg border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-100 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600">
            </div>
          </div>
        </section>

        <!-- GRID PROGRAM -->
        <section class="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          <article v-for="p in filteredPrograms" :key="p.id"
                   class="group relative rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 hover:shadow transition">
            <div class="relative h-44 overflow-hidden">
              <img :src="p.cover" :alt="p.title" class="w-full h-full object-cover group-hover:scale-[1.02] transition" />
              <div class="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/50 text-white px-2 py-0.5 text-[11px]">
                {{ p.level }} <span aria-hidden="true">•</span> {{ p.category }}
              </div>
            </div>
            <div class="p-5">
              <h3 class="font-semibold text-gray-900 dark:text-white">{{ p.title }}</h3>
              <p class="mt-2 text-sm text-gray-600 dark:text-neutral-300 line-clamp-3">{{ p.desc }}</p>
              <div class="mt-3 flex items-center justify-between text-[12px] text-gray-500 dark:text-neutral-400">
                <div class="flex items-center gap-2">
                  <ClientOnly><Icon icon="ph:clock" class="size-4" /></ClientOnly>
                  <span>{{ p.intensity }}</span>
                </div>
                <a href="#kurikulum" class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700">
                  Lihat Kurikulum
                  <ClientOnly><Icon icon="ph:arrow-right" class="size-4" /></ClientOnly>
                </a>
              </div>
            </div>
          </article>
        </section>

        <!-- KURIKULUM -->
        <section id="kurikulum" class="mt-10">
          <div class="text-center mb-6">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Kurikulum Inti per Jenjang</h2>
            <p class="mt-2 text-gray-600 dark:text-neutral-300">Ringkasan materi utama & kitab yang dipelajari.</p>
          </div>

          <div class="space-y-3">
            <div v-for="(k,i) in cfg.curriculum" :key="k.level" class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60">
              <button type="button" class="w-full text-left px-5 py-4 flex items-center justify-between" @click="toggleCurriculum(i)">
                <div class="flex items-center gap-3">
                  <ClientOnly><Icon :icon="k.icon" class="size-6 text-blue-600" /></ClientOnly>
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white">{{ k.level }}</p>
                    <p class="text-[12px] text-gray-500 dark:text-neutral-400">{{ k.subtitle }}</p>
                  </div>
                </div>
                <ClientOnly><Icon icon="ph:caret-down" class="size-4 text-gray-500 transition-transform" :class="openCurriculum===i ? 'rotate-180' : ''" /></ClientOnly>
              </button>
              <div v-show="openCurriculum===i" class="px-5 pb-5">
                <p class="text-sm text-gray-600 dark:text-neutral-300 mb-4">{{ k.description }}</p>
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="rounded-xl border border-gray-200 dark:border-neutral-700 p-4">
                    <h4 class="font-semibold text-gray-900 dark:text-white">Materi Utama</h4>
                    <ul class="mt-2 text-sm text-gray-700 dark:text-neutral-300 list-disc list-inside space-y-1">
                      <li v-for="m in k.subjects" :key="m">{{ m }}</li>
                    </ul>
                  </div>
                  <div class="rounded-xl border border-gray-200 dark:border-neutral-700 p-4">
                    <h4 class="font-semibold text-gray-900 dark:text-white">Kitab</h4>
                    <ul class="mt-2 text-sm text-gray-700 dark:text-neutral-300 list-disc list-inside space-y-1">
                      <li v-for="b in k.books" :key="b">{{ b }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- TIMETABLE -->
        <section class="mt-10 rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-6">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Contoh Jadwal Harian</h3>
          <div class="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div v-for="s in cfg.schedule" :key="s.time" class="rounded-xl border border-gray-200 dark:border-neutral-700 p-4">
              <p class="text-xs text-gray-500 dark:text-neutral-400">{{ s.time }}</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ s.title }}</p>
              <p class="text-sm text-gray-600 dark:text-neutral-300">{{ s.note }}</p>
            </div>
          </div>
        </section>

        <!-- FAQ -->
        <section class="mt-10">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Pertanyaan Umum</h2>
          </div>
          <div class="space-y-3">
            <div v-for="(f,i) in cfg.faqs" :key="i" class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60">
              <button type="button" class="w-full text-left px-5 py-4 flex items-center justify-between" @click="toggleFaq(i)">
                <span class="font-medium text-gray-900 dark:text-white">{{ f.q }}</span>
                <ClientOnly><Icon icon="ph:caret-down" class="size-4 text-gray-500 transition-transform" :class="openFaq===i ? 'rotate-180' : ''" /></ClientOnly>
              </button>
              <div v-show="openFaq===i" class="px-5 pb-4">
                <p class="text-sm text-gray-600 dark:text-neutral-300">{{ f.a }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- CTA -->
        <section v-if="cfg.cta.enabled" class="mt-10 text-center">
          <div class="rounded-3xl bg-blue-600 text-white px-6 py-10">
            <h3 class="text-2xl font-bold">{{ cfg.cta.title }}</h3>
            <p class="mt-1 text-blue-100">{{ cfg.cta.subtitle }}</p>
            <NuxtLink :to="cfg.cta.buttonHref" class="inline-flex mt-5 items-center gap-2 bg-white text-blue-600 font-medium px-5 py-3 rounded-lg shadow hover:bg-gray-100">
              {{ cfg.cta.buttonText }}
            </NuxtLink>
          </div>
        </section>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'
import { useWeb } from '~/composables/data/useWeb'
import { useRoute, useRuntimeConfig } from '#imports'
import { onValue, ref as dref, off as dbOff } from 'firebase/database'

defineOptions({ name: 'ProgramPage' })

/* ===== Types ===== */
type Program   = { id: string; title: string; level: string; category: string; desc: string; intensity: string; cover: string }
type Curriculum= { level: string; subtitle: string; icon: string; description: string; subjects: string[]; books: string[] }
type Shape = {
  hero: { cover: string; badge: string; title: string; subtitle: string; heightSm: string; heightLg: string }
  stats: { label: string; value: string; icon: string }[]
  filters: { levels: string[]; categories: string[] }
  programs: Program[]
  curriculum: Curriculum[]
  schedule: { time: string; title: string; note: string }[]
  faqs: { q: string; a: string }[]
  cta: { enabled: boolean; title: string; subtitle: string; buttonText: string; buttonHref: string }
}
type MetaShape = { title?: string; description?: string; ogImage?: string | null; status?: 'draft'|'published' }

/* ===== Defaults ===== */
const DEFAULTS: Shape = {
  hero: {
    cover: '/assets/images/activity2.jpg',
    badge: 'Pondok Pesantren Alberr',
    title: 'Pelajari Program',
    subtitle: 'Integrasi diniyah–akademik–karakter: kurikulum terpadu, tahfidz, bahasa, kepemimpinan, kewirausahaan.',
    heightSm: '40vh', heightLg: '52vh'
  },
  stats: [
    { label: 'Target Hafalan', value: '5–15 Juz', icon: 'ph:book-open-text' },
    { label: 'Bahasa Asing', value: 'Arab & Inggris', icon: 'ph:translate' },
    { label: 'Ekstrakurikuler', value: '10+ Klub', icon: 'ph:medal-military' },
    { label: 'Jenjang', value: 'SMP–SMA', icon: 'ph:student' }
  ],
  filters: { levels: ['SMP','SMA'], categories: ['Tahfidz','Bahasa','Kepemimpinan','Akademik','Keterampilan'] },
  programs: [],
  curriculum: [],
  schedule: [
    { time: '03.30', title: 'Qiyamul Lail & Tahajjud', note: 'Shalat malam & doa' },
    { time: '04.30', title: 'Shalat Subuh & Kultum', note: 'Kajian singkat' },
    { time: '07.00', title: 'KBM Akademik', note: 'Mapel umum + diniyah' },
    { time: '17.00', title: 'Halaqah Tahfidz', note: 'Setoran & murajaah' },
    { time: '20.00', title: 'Pengajian Kitab', note: 'Kajian kitab bersama Kyai' },
    { time: '22.00', title: 'Istirahat Malam', note: 'Tidur' }
  ],
  faqs: [{ q:'Apakah ada target hafalan?', a:'SMP min 5 juz, SMA min 10 juz.' }],
  cta: { enabled:true, title:'Siap bergabung dengan program AlBerr?', subtitle:'Daftar PPDB Online tahun ajaran berjalan.', buttonText:'Daftar Sekarang', buttonHref:'#' }
}

/* ===== Helpers ===== */
function merge(base: Shape, patch?: Partial<Shape>): Shape {
  const p = patch || {}
  return {
    hero: { ...base.hero, ...(p.hero||{}) },
    stats: Array.isArray(p.stats)&&p.stats.length ? p.stats : base.stats,
    filters: {
      levels: Array.isArray(p.filters?.levels)&&p.filters!.levels!.length ? p.filters!.levels! : base.filters.levels,
      categories: Array.isArray(p.filters?.categories)&&p.filters!.categories!.length ? p.filters!.categories! : base.filters.categories
    },
    programs: Array.isArray(p.programs) ? p.programs : base.programs,
    curriculum: Array.isArray(p.curriculum) ? p.curriculum : base.curriculum,
    schedule: Array.isArray(p.schedule)&&p.schedule.length ? p.schedule : base.schedule,
    faqs: Array.isArray(p.faqs)&&p.faqs.length ? p.faqs : base.faqs,
    cta: { ...base.cta, ...(p.cta||{}) }
  }
}
function absUrl(u?: string | null, origin = '') {
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u
  try { return new URL(u, origin || (typeof window !== 'undefined' ? window.location.origin : '/')).toString() }
  catch { return u }
}

/* ===== State: content from editor/sections (useWeb) ===== */
const web = useWeb()
const cfg = reactive<Shape>({ ...DEFAULTS })
const pending = ref(true)

/* props section "ProgramPage" / "Program" */
const sectionProps = computed<Partial<Shape> | null>(() => {
  const list = (web.sortedSections?.value || web.sections?.value || []) as any[]
  const found =
    list.find(s => String(s?.key).toLowerCase() === 'programpage') ||
    list.find(s => String(s?.key).toLowerCase() === 'program') ||
    null
  return (found?.props || null) as Partial<Shape> | null
})
watch(sectionProps, (p) => { Object.assign(cfg, merge(DEFAULTS, p || undefined)) }, { immediate: true })

/* subscribe page /program via useWeb */
const route = useRoute()
const pagePath = computed(() => web.normalizePath?.(route?.path || '/program') || '/program')
watch(pagePath, async (p) => { pending.value = true; try { await web.subscribePage(p) } finally { pending.value = false } }, { immediate: true })

/* ===== Filters & search ===== */
const level = ref<string>('')   // all
const category = ref<string>('')// all
const q = ref<string>('')

const filteredPrograms = computed(() => {
  const term = (q.value || '').toLowerCase()
  return (cfg.programs || []).filter(p => {
    const okL = !level.value || p.level === level.value
    const okC = !category.value || p.category === category.value
    const okQ = !term || p.title.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term)
    return okL && okC && okQ
  })
})

/* ===== Curriculum & FAQ toggles ===== */
const openCurriculum = ref<number|null>(null)
const openFaq = ref<number|null>(null)
function toggleCurriculum(i: number){ openCurriculum.value = openCurriculum.value===i ? null : i }
function toggleFaq(i: number){ openFaq.value = openFaq.value===i ? null : i }

/* ===== SEO from RTDB: alberr/web/program/meta ===== */
const { $realtimeDb } = useNuxtApp() as any
const runtime = useRuntimeConfig()
const siteUrl = runtime.public?.siteUrl || ''

const canonical = computed(() => {
  try { return new URL(route.fullPath || '/', siteUrl).toString() } catch { return siteUrl || '/' }
})

const pageMeta = reactive<Required<MetaShape>>({
  title: 'Program | Pondok Pesantren Alberr',
  description: 'Program unggulan Pondok Pesantren Alberr.',
  ogImage: '/assets/logo.png',
  status: 'draft'
})

let metaUnsub: (() => void) | null = null
onMounted(() => {
  if (!$realtimeDb) return
  const node = dref($realtimeDb, 'alberr/web/pages/program/meta')
  const handler = onValue(node, (snap) => {
    const v = (snap.val() || {}) as MetaShape
    console.log(v)
    if (v.title)       pageMeta.title = v.title
    if (v.description) pageMeta.description = v.description
    if (v.ogImage !== undefined) pageMeta.ogImage = v.ogImage
    if (v.status)      pageMeta.status = v.status
  })
  metaUnsub = () => dbOff(node, 'value', handler as any)
})
onBeforeUnmount(() => { try { metaUnsub?.() } catch {} })

useSeoMeta({
  title: computed(()=> pageMeta.title),
  description: computed(()=> pageMeta.description),
  ogTitle: computed(()=> pageMeta.title),
  ogDescription: computed(()=> pageMeta.description),
  ogType: 'website',
  ogUrl: canonical,
  ogImage: computed(()=> absUrl(pageMeta.ogImage, siteUrl) || absUrl('/assets/logo.png', siteUrl)),
  twitterCard: 'summary_large_image',
  themeColor: '#0ea5e9',
  robots: computed(()=> pageMeta.status === 'published' ? 'index, follow' : 'noindex, nofollow')
})
useHead({ link: [{ rel:'canonical', href: canonical.value }] })
</script>

<style scoped>
.heroH { height: var(--hero-sm); }
@media (min-width: 640px) { .heroH { height: var(--hero-lg); } }
</style>
