<template>
  <section id="facility" class="relative overflow-hidden bg-white py-16 dark:bg-neutral-950">

    <div class="relative mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-10 lg:grid-cols-12">
        <!-- Copy -->
        <div class="lg:col-span-6">
          <div class="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-green-700 shadow-sm backdrop-blur dark:border-green-900/40 dark:bg-neutral-900/80 dark:text-green-300">
            <span class="h-2 w-2 rounded-full bg-green-600"></span>
            {{ eyebrow }}
          </div>

          <h1 class="mt-5 text-3xl font-black leading-tight tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
            {{ headingMain }}
            <span class="text-green-600 dark:text-green-400">{{ headingHi1 }}</span>
            <span class="text-green-600 dark:text-green-400"> {{ headingHi2 }}</span>
          </h1>

          <p class="mt-4 max-w-2xl text-base leading-8 text-slate-600 dark:text-neutral-300">
            {{ description }}
          </p>

          <!-- Stats -->
          <div class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            <div
              v-for="s in stats"
              :key="`${s.label}-${s.value}`"
              class="group rounded-[24px] border border-white/80 bg-white/85 p-4 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900/85"
            >
              <div class="flex items-center gap-3">
                <div class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-600 transition group-hover:bg-green-600 group-hover:text-white dark:bg-green-900/20 dark:text-green-300">
                  <ClientOnly>
                    <Icon :icon="s.icon || 'ph:info'" class="h-5 w-5" />
                    <template #fallback>
                      <span class="h-5 w-5"></span>
                    </template>
                  </ClientOnly>
                </div>

                <div class="min-w-0">
                  <p class="truncate text-xs font-semibold text-slate-500 dark:text-neutral-400">
                    {{ s.label }}
                  </p>
                  <p class="mt-0.5 truncate text-xl font-black text-slate-950 dark:text-white">
                    {{ s.value }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- CTA -->
          <div class="mt-8 flex flex-wrap gap-3">
            <a
              :href="galleryHref"
              class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:-translate-y-0.5 hover:bg-green-700"
            >
              <ClientOnly>
                <Icon icon="lucide:image" class="h-4 w-4" />
              </ClientOnly>
              Lihat Galeri
            </a>

            <button
              v-if="brochureItems.length"
              type="button"
              class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-5 text-sm font-bold text-slate-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900/90 dark:text-neutral-100 dark:hover:bg-neutral-800"
              @click="openBrochureModal"
            >
              <ClientOnly>
                <Icon icon="lucide:file-text" class="h-4 w-4" />
              </ClientOnly>
              Lihat Brosur
            </button>
          </div>

          <!-- Brochure mini cards -->
          <div v-if="brochureItems.length" class="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              v-for="(item, index) in brochureItems.slice(0, 2)"
              :key="`brochure-mini-${index}`"
              type="button"
              class="group flex items-center gap-3 rounded-[22px] border border-slate-200 bg-white/80 p-3 text-left shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/80 dark:hover:border-green-900/60"
              @click="openBrochureModal(index)"
            >
              <span class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-300">
                <ClientOnly>
                  <Icon icon="lucide:file-text" class="h-5 w-5" />
                </ClientOnly>
              </span>

              <span class="min-w-0">
                <span class="block truncate text-sm font-black text-slate-900 dark:text-white">
                  {{ item.title || `Brosur ${index + 1}` }}
                </span>
                <span class="mt-0.5 block truncate text-xs text-slate-500 dark:text-neutral-400">
                  {{ item.note || 'Klik untuk melihat preview PDF' }}
                </span>
              </span>

              <ClientOnly>
                <Icon icon="lucide:chevron-right" class="ml-auto h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5" />
              </ClientOnly>
            </button>
          </div>
        </div>

        <!-- Gallery -->
        <div class="lg:col-span-6">
          <div class="relative">
            <div class="absolute -inset-4 rounded-[36px] bg-gradient-to-br from-green-200/40 via-white/20 to-green-200/40 blur-2xl dark:from-green-900/20 dark:via-transparent dark:to-green-900/20"></div>

            <div class="relative grid grid-cols-12 gap-3 sm:gap-4">
              <div v-if="tiles[0]" class="col-span-7">
                <FacilityTile :tile="tiles[0]" class-name="h-64 sm:h-80" />
              </div>

              <div class="col-span-5 space-y-3 sm:space-y-4">
                <FacilityTile v-if="tiles[1]" :tile="tiles[1]" class-name="h-[7.75rem] sm:h-[9.5rem]" />
                <FacilityTile v-if="tiles[2]" :tile="tiles[2]" class-name="h-[7.75rem] sm:h-[9.5rem]" />
              </div>

              <div v-if="tiles[3]" class="col-span-6">
                <FacilityTile :tile="tiles[3]" class-name="h-40 sm:h-48" />
              </div>

              <div v-if="tiles[4]" class="col-span-6">
                <FacilityTile :tile="tiles[4]" class-name="h-40 sm:h-48" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Brochure Modal -->
    <Teleport to="body">
      <div v-if="brochureModalOpen" class="fixed inset-0 z-99999">
        <div class="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" @click="closeBrochureModal"></div>

        <div class="absolute inset-0 flex items-center justify-center p-3 sm:p-5">
          <div class="flex max-h-[92dvh] w-full max-w-6xl flex-col overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950">
            <!-- Modal Header -->
            <div class="flex shrink-0 items-start justify-between gap-3 border-b border-slate-200 bg-gradient-to-br from-white via-green-50/60 to-green-50/60 px-5 py-4 dark:border-neutral-800 dark:from-neutral-950 dark:via-green-950/20 dark:to-green-950/10">
              <div class="min-w-0">
                <div class="inline-flex items-center gap-2 rounded-full bg-green-600 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-white shadow-lg shadow-green-500/20">
                  <ClientOnly>
                    <Icon icon="lucide:file-text" class="h-3.5 w-3.5" />
                  </ClientOnly>
                  Brosur Fasilitas
                </div>

                <h3 class="mt-3 truncate text-lg font-black text-slate-950 dark:text-white sm:text-xl">
                  {{ activeBrochure?.title || `Brosur ${selectedBrochure + 1}` }}
                </h3>

                <p class="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-neutral-400">
                  {{ activeBrochure?.note || 'Preview dokumen brosur pondok.' }}
                </p>
              </div>

              <button
                type="button"
                class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                @click="closeBrochureModal"
              >
                <ClientOnly>
                  <Icon icon="lucide:x" class="h-4 w-4" />
                </ClientOnly>
              </button>
            </div>

            <!-- Body -->
            <div class="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[280px,minmax(0,1fr)]">
              <!-- Sidebar -->
              <aside class="hidden border-r border-slate-200 bg-slate-50/80 p-3 dark:border-neutral-800 dark:bg-neutral-900/60 lg:block">
                <div class="flex flex-wrap gap-3">
                  <button
                    v-for="(item, index) in brochureItems"
                    :key="`brochure-list-${index}`"
                    type="button"
                    class="flex pr-3 items-center gap-3 rounded-[20px] p-3 text-left transition"
                    :class="selectedBrochure === index
                      ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
                      : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-800'"
                    @click="selectedBrochure = index"
                  >
                    <span
                      class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl"
                      :class="selectedBrochure === index
                        ? 'bg-white/20 text-white'
                        : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-300'"
                    >
                      <ClientOnly>
                        <Icon :icon="isPdf(item.url) ? 'lucide:file-text' : 'lucide:image'" class="h-5 w-5" />
                      </ClientOnly>
                    </span>

                    <span class="min-w-0">
                      <span class="block truncate text-sm font-black">
                        {{ item.title || `Brosur ${index + 1}` }}
                      </span>
                      <span class="block truncate text-[11px] opacity-75">
                        {{ isPdf(item.url) ? 'PDF' : 'Gambar' }}
                      </span>
                    </span>
                  </button>
                </div>
              </aside>

              <!-- Preview -->
              <main class="min-h-0 overflow-y-auto bg-slate-100 p-3 dark:bg-neutral-900 sm:p-4">
                <div
                  v-if="brochureHtml"
                  class="mb-4 rounded-[24px] border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-600 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
                >
                  <div class="prose prose-sm max-w-none dark:prose-invert" v-html="brochureHtml"></div>
                </div>

                <div class="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                  <iframe
                    v-if="activeBrochure?.url && isPdf(activeBrochure.url)"
                    :src="embedPdfUrl(activeBrochure.url)"
                    class="h-[72dvh] min-h-[460px] w-full bg-white"
                    loading="lazy"
                  ></iframe>

                  <img
                    v-else-if="activeBrochure?.url"
                    :src="activeBrochure.url"
                    :alt="activeBrochure.title || 'Brosur'"
                    class="mx-auto max-h-[72dvh] w-full object-contain bg-white"
                  />

                  <div v-else class="grid h-[420px] place-items-center p-8 text-center">
                    <div>
                      <div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-neutral-900">
                        <ClientOnly>
                          <Icon icon="lucide:file-x" class="h-6 w-6" />
                        </ClientOnly>
                      </div>
                      <p class="mt-3 text-sm font-black text-slate-900 dark:text-white">
                        Link brosur belum tersedia
                      </p>
                      <p class="mt-1 text-xs text-slate-500 dark:text-neutral-400">
                        Isi link PDF di editor FacilityHero.
                      </p>
                    </div>
                  </div>
                </div>
              </main>
            </div>

            <!-- Footer -->
            <div class="flex shrink-0 flex-col gap-2 border-t border-slate-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex items-center gap-2 overflow-x-auto lg:hidden">
                <button
                  v-for="(item, index) in brochureItems"
                  :key="`brochure-chip-${index}`"
                  type="button"
                  class="inline-flex shrink-0 items-center rounded-full px-3 py-1.5 text-xs font-bold transition"
                  :class="selectedBrochure === index
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-100 text-slate-700 dark:bg-neutral-900 dark:text-neutral-300'"
                  @click="selectedBrochure = index"
                >
                  {{ item.title || `Brosur ${index + 1}` }}
                </button>
              </div>

              <div class="flex shrink-0 items-center gap-2 sm:ml-auto">
                <a
                  v-if="activeBrochure?.url"
                  :href="activeBrochure.url"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <ClientOnly>
                    <Icon icon="lucide:external-link" class="h-4 w-4" />
                  </ClientOnly>
                  Buka
                </a>

                <a
                  v-if="activeBrochure?.url"
                  :href="activeBrochure.url"
                  download
                  class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white transition hover:bg-green-700"
                >
                  <ClientOnly>
                    <Icon icon="lucide:download" class="h-4 w-4" />
                  </ClientOnly>
                  Unduh
                </a>

                <button
                  type="button"
                  class="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="closeBrochureModal"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, defineComponent, h, ref } from 'vue'

type Stat = {
  label?: string
  value?: string | number
  icon?: string
}

type Tile = {
  src: string
  label: string
  icon: string
  alt?: string
}

type BrochureInput =
  | string
  | {
      title?: string
      pdfUrl?: string
      url?: string
      src?: string
      note?: string
    }

type BrochureView = {
  title: string
  url: string
  note: string
}

type Shape = {
  eyebrow: string
  headingMain: string
  headingHi1: string
  headingHi2: string
  description: string
  stats: Stat[]
  gallery: Tile[]
  brochures: BrochureInput[]
  brochureHtml?: string
  galleryHref: string
}

type EditorFields = {
  badge?: string
  headingLead?: string
  highlight1?: string
  highlight2?: string
  brochureHtml?: string
  brochures?: BrochureInput[]
  galleryHref?: string
}

const defaults: Shape = {
  eyebrow: 'Fasilitas Pondok Al-Inayah',
  headingMain: 'Nyaman, Tertib,',
  headingHi1: 'Inklusif',
  headingHi2: 'dirancang untuk bertumbuh',
  description:
    'Dari asrama yang rapi, masjid yang lapang, ruang kelas interaktif, hingga perpustakaan. Semua disiapkan untuk mendukung adab, akademik, dan kemandirian santri.',
  stats: [
    { label: 'Asrama', value: '8', icon: 'ph:house' },
    { label: 'Ruang Kelas', value: '24', icon: 'ph:chalkboard-teacher' },
    { label: 'Perpustakaan', value: '1', icon: 'ph:books' },
    { label: 'Lapangan', value: '3', icon: 'ph:soccer-ball' }
  ],
  gallery: [
    { src: '/assets/images/masjid.jpg', label: 'Masjid & Aula', icon: 'ph:mosque', alt: 'Masjid pondok' },
    { src: '/assets/images/kelas.jpg', label: 'Kelas Interaktif', icon: 'ph:chalkboard-teacher', alt: 'Ruang kelas' },
    { src: '/assets/images/activity.jpg', label: 'Perpustakaan', icon: 'ph:books', alt: 'Perpustakaan' },
    { src: '/assets/images/lapangan.jpg', label: 'Lapangan Olahraga', icon: 'ph:soccer-ball', alt: 'Lapangan olahraga' },
    { src: '/assets/images/asrama.jpg', label: 'Asrama & Kafetaria', icon: 'ph:house', alt: 'Asrama santri' }
  ],
  brochures: [],
  brochureHtml:
    '<p>Unduh dan lihat brosur resmi pondok untuk informasi pendaftaran, program pendidikan, fasilitas, dan kontak administrasi.</p>',
  galleryHref: '/gallery'
}

const raw = defineProps<Partial<Shape> & EditorFields & { props?: Partial<Shape> & EditorFields }>()

const merged = computed<Shape>(() => {
  const { props: inner, ...outer } = raw as any
  const flat = {
    ...(inner || {}),
    ...(outer || {})
  }

  return normalize(flat)
})

const eyebrow = computed(() => merged.value.eyebrow)
const headingMain = computed(() => merged.value.headingMain)
const headingHi1 = computed(() => merged.value.headingHi1)
const headingHi2 = computed(() => merged.value.headingHi2)
const description = computed(() => merged.value.description)
const stats = computed(() => merged.value.stats)
const tiles = computed(() => merged.value.gallery)
const brochureHtml = computed(() => merged.value.brochureHtml || '')
const brochureItems = computed(() => normalizeBrochureItems(merged.value.brochures))
const galleryHref = computed(() => merged.value.galleryHref)

const brochureModalOpen = ref(false)
const selectedBrochure = ref(0)

const activeBrochure = computed(() => brochureItems.value[selectedBrochure.value] || null)

function normalize(input: any): Shape {
  const p = input || {}

  const stats = Array.isArray(p.stats) && p.stats.length
    ? p.stats.map((item: any) => ({
        label: String(item?.label ?? ''),
        value: item?.value ?? '',
        icon: String(item?.icon || 'ph:info')
      }))
    : defaults.stats

  const gallery = (Array.isArray(p.gallery) && p.gallery.length ? p.gallery : defaults.gallery)
    .map((item: any) => ({
      src: String(item?.src || ''),
      label: String(item?.label || item?.alt || 'Fasilitas'),
      icon: String(item?.icon || 'ph:image'),
      alt: String(item?.alt || item?.label || 'Foto fasilitas')
    }))
    .filter((item: Tile) => !!item.src)

  return {
    eyebrow: p.eyebrow ?? p.badge ?? defaults.eyebrow,
    headingMain: p.headingMain ?? p.headingLead ?? defaults.headingMain,
    headingHi1: p.headingHi1 ?? p.highlight1 ?? defaults.headingHi1,
    headingHi2: p.headingHi2 ?? p.highlight2 ?? defaults.headingHi2,
    description: p.description ?? defaults.description,
    stats,
    gallery,
    brochures: Array.isArray(p.brochures) ? p.brochures : defaults.brochures,
    brochureHtml: p.brochureHtml ?? defaults.brochureHtml,
    galleryHref: p.galleryHref ?? defaults.galleryHref
  }
}

function normalizeBrochureItems(items: BrochureInput[]) {
  return items
    .map((item, index) => {
      if (typeof item === 'string') {
        return {
          title: `Brosur ${index + 1}`,
          url: item,
          note: ''
        }
      }

      return {
        title: item?.title || `Brosur ${index + 1}`,
        url: item?.pdfUrl || item?.url || item?.src || '',
        note: item?.note || ''
      }
    })
    .filter((item: BrochureView) => !!item.url)
}

function openBrochureModal(index = 0) {
  selectedBrochure.value = Math.max(0, Math.min(index, brochureItems.value.length - 1))
  brochureModalOpen.value = true
}

function closeBrochureModal() {
  brochureModalOpen.value = false
}

function isPdf(url?: string) {
  return String(url || '').split('?')[0].toLowerCase().endsWith('.pdf')
}

function embedPdfUrl(url: string) {
  if (!url) return ''
  if (url.includes('#')) return url
  return `${url}#toolbar=1&navpanes=0&scrollbar=1`
}

const FacilityTile = defineComponent({
  name: 'FacilityTile',
  props: {
    tile: {
      type: Object as () => Tile,
      required: true
    },
    className: {
      type: String,
      default: 'h-52'
    }
  },
  setup(props) {
    return () =>
      h(
        'div',
        {
          class: [
            'group relative overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-neutral-800 dark:bg-neutral-900',
            props.className
          ].join(' ')
        },
        [
          h('img', {
            src: props.tile.src,
            alt: props.tile.alt || props.tile.label,
            class: 'absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110',
            loading: 'lazy'
          }),
          h('div', {
            class: 'absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent'
          }),
          h(
            'div',
            {
              class: 'absolute inset-x-0 bottom-0 p-4'
            },
            [
              h(
                'div',
                {
                  class:
                    'inline-flex max-w-full items-center gap-2 rounded-2xl bg-white/15 px-3 py-2 text-xs font-bold text-white ring-1 ring-white/20 backdrop-blur'
                },
                [
                  h(Icon, {
                    icon: props.tile.icon || 'ph:image',
                    class: 'h-4 w-4 shrink-0'
                  }),
                  h(
                    'span',
                    {
                      class: 'truncate'
                    },
                    props.tile.label
                  )
                ]
              )
            ]
          )
        ]
      )
  }
})
</script>