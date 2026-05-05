<!-- components/editor/NewsPage.vue -->
<template>
  <section class="relative overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
    <!-- Header -->
    <div class="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-green-50 via-white to-lime-50 px-5 py-5 dark:border-neutral-800 dark:from-green-950/20 dark:via-neutral-900 dark:to-neutral-900 md:px-6">
      <div class="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-green-300/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-20 left-8 h-40 w-40 rounded-full bg-lime-300/20 blur-3xl"></div>

      <div class="relative z-10">
        <div class="inline-flex items-center gap-2 rounded-full border border-green-100 bg-white/80 px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm backdrop-blur dark:border-green-900/40 dark:bg-neutral-900/70 dark:text-green-300">
          <span class="h-2 w-2 rounded-full bg-green-500"></span>
          News Page Editor
        </div>

        <h2 class="mt-4 text-xl font-black tracking-tight text-gray-950 dark:text-white">
          Kelola Halaman Berita
        </h2>

        <p class="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
          Atur hero halaman berita dan teks pendukung. Upload file gambar masuk Cloudinary, sedangkan link gambar langsung disimpan ke Firebase Realtime Database setelah divalidasi.
        </p>
      </div>

      <!-- Tabs -->
      <div class="relative z-10 mt-5 flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-black transition"
          :class="activeTab === tab.key
            ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
            : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white'"
          @click="activeTab = tab.key"
        >
          <Icon :icon="tab.icon" class="h-4 w-4" />
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Notices -->
    <div v-if="savedNote || errNote || uploadError || deleteError" class="px-5 pt-5 md:px-6">
      <div
        v-if="savedNote"
        class="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 dark:border-green-900/40 dark:bg-green-900/10 dark:text-green-300"
      >
        {{ savedNote }}
      </div>

      <div
        v-if="errNote || uploadError || deleteError"
        class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300"
      >
        {{ errNote || uploadError || deleteError }}
      </div>
    </div>

    <div class="p-5 pb-28 md:p-6 md:pb-28">
      <!-- HERO -->
      <div v-show="activeTab === 'Hero'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Hero Berita
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Atur cover, badge, judul, subjudul, dan tinggi hero halaman berita.
              </p>
            </div>

            <div class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm ring-1 ring-green-100 dark:bg-neutral-900 dark:text-green-300 dark:ring-green-900/40">
              <span class="h-2 w-2 rounded-full bg-green-500"></span>
              JPG / PNG / WebP · Max 5 MB
            </div>
          </div>
        </div>

        <!-- Cover -->
        <section class="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="grid gap-5 p-5 lg:grid-cols-[1fr,1.05fr]">
            <div class="relative overflow-hidden rounded-[26px] border border-gray-200 bg-gray-100 dark:border-neutral-800 dark:bg-neutral-800">
              <img
                v-if="form.hero.cover"
                :src="form.hero.cover"
                alt="Cover Berita"
                class="h-72 w-full object-cover"
              />

              <div v-else class="grid h-72 place-items-center text-center">
                <div>
                  <Icon icon="lucide:image-plus" class="mx-auto h-10 w-10 text-gray-400" />
                  <p class="mt-2 text-sm font-semibold text-gray-500 dark:text-neutral-400">
                    Belum ada cover
                  </p>
                </div>
              </div>

              <div
                v-if="progressCover != null"
                class="absolute inset-x-4 bottom-4 overflow-hidden rounded-full bg-white/70 p-1 backdrop-blur dark:bg-neutral-950/70"
              >
                <div
                  class="h-2 rounded-full bg-green-500 transition-all"
                  :style="{ width: `${progressCover}%` }"
                ></div>
              </div>
            </div>

            <div class="space-y-4">
              <div class="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                <button
                  type="button"
                  class="rounded-xl px-3 py-2 text-xs font-bold transition"
                  :class="mediaMode === 'upload'
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                    : 'text-gray-500 dark:text-neutral-300'"
                  @click="mediaMode = 'upload'"
                >
                  Upload
                </button>

                <button
                  type="button"
                  class="rounded-xl px-3 py-2 text-xs font-bold transition"
                  :class="mediaMode === 'url'
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                    : 'text-gray-500 dark:text-neutral-300'"
                  @click="mediaMode = 'url'"
                >
                  URL
                </button>
              </div>

              <div
                v-if="mediaMode === 'upload'"
                class="rounded-[24px] border border-dashed border-green-200 bg-green-50/60 p-5 dark:border-green-900/40 dark:bg-green-900/10"
              >
                <input
                  id="news-hero-cover-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  class="hidden"
                  @change="uploadCoverImage"
                />

                <label
                  for="news-hero-cover-upload"
                  class="flex cursor-pointer flex-col items-center justify-center rounded-[22px] bg-white px-5 py-8 text-center ring-1 ring-green-100 transition hover:bg-green-50 dark:bg-neutral-900 dark:ring-green-900/40 dark:hover:bg-neutral-800"
                >
                  <Icon icon="lucide:upload-cloud" class="h-9 w-9 text-green-600 dark:text-green-300" />
                  <span class="mt-3 text-sm font-black text-gray-900 dark:text-white">
                    Upload Cover
                  </span>
                  <span class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                    Gambar otomatis dioptimalkan sebelum disimpan.
                  </span>
                </label>
              </div>

              <div v-else class="space-y-3">
                <input
                  v-model.trim="coverUrlDraft"
                  type="url"
                  placeholder="https://example.com/cover.jpg"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                />

                <button
                  type="button"
                  class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
                  :disabled="mediaBusy || !coverUrlDraft"
                  @click="applyCoverUrl"
                >
                  <Icon icon="lucide:shield-check" class="h-4 w-4" />
                  Gunakan Link
                </button>
              </div>

              <button
                v-if="form.hero.cover"
                type="button"
                class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white px-4 text-sm font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
                :disabled="mediaBusy"
                @click="removeCoverImage"
              >
                <Icon icon="lucide:trash-2" class="h-4 w-4" />
                Hapus Cover
              </button>
            </div>
          </div>
        </section>

        <!-- Form Hero -->
        <div class="grid gap-4 md:grid-cols-2">
          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Badge
            </label>
            <input
              v-model.trim="form.hero.badge"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Kabar Terbaru"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Judul Utama
            </label>
            <input
              v-model.trim="form.hero.title"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Berita Pondok Pesantren Al-Inayah"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50 md:col-span-2">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Subjudul
            </label>
            <textarea
              v-model.trim="form.hero.subtitle"
              rows="4"
              class="block w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Informasi kegiatan, pengumuman, dan liputan santri."
            ></textarea>
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Tinggi Mobile
            </label>
            <input
              v-model.trim="form.hero.heightSm"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="36vh"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Tinggi Desktop
            </label>
            <input
              v-model.trim="form.hero.heightLg"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="44vh"
            />
          </div>
        </div>
      </div>

      <!-- TEKS LAIN -->
      <div v-show="activeTab === 'Teks Lain'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white">
              Teks Pendukung Berita
            </h3>
            <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
              Atur teks pencarian, pesan kosong, pesan berita tidak ditemukan, dan label tombol load more.
            </p>
          </div>
        </div>

        <div class="grid gap-4">
          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Placeholder Pencarian
            </label>
            <input
              v-model.trim="form.texts.searchPlaceholder"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Cari berita (judul/isi/tag)…"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Teks Kosong
            </label>
            <input
              v-model.trim="form.texts.emptyList"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Berita masih kosong."
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Teks Tidak Ditemukan
            </label>
            <input
              v-model.trim="form.texts.notFound"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Berita tidak ditemukan."
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Label Tombol Load More
            </label>
            <input
              v-model.trim="form.texts.loadMore"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Tampilkan Lebih Banyak"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Save Bar -->
    <div class="fixed inset-x-3 bottom-3 z-[90] xl:left-[370px] xl:right-8">
      <div class="flex flex-col gap-3 rounded-[24px] border border-gray-200 bg-white p-3 shadow-[0_-18px_50px_-28px_rgba(15,23,42,0.35)] dark:border-neutral-800 dark:bg-neutral-950 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <div
            class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl"
            :class="saving || mediaBusy
              ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300'
              : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'"
          >
            <Icon
              :icon="saving || mediaBusy ? 'lucide:loader-circle' : 'lucide:badge-check'"
              class="h-5 w-5"
              :class="saving || mediaBusy ? 'animate-spin' : ''"
            />
          </div>

          <div class="min-w-0">
            <p class="text-sm font-black text-gray-900 dark:text-white">
              {{ saving ? 'Menyimpan perubahan...' : mediaBusy ? 'Memproses media...' : 'Perubahan siap disimpan' }}
            </p>
          </div>
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <button
            type="button"
            class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            :disabled="mediaBusy || saving"
            @click="resetToDefault"
          >
            <Icon icon="lucide:rotate-ccw" class="h-4 w-4" />
            <span class="hidden sm:inline">Isi Default</span>
            <span class="sm:hidden">Default</span>
          </button>

          <button
            type="button"
            class="inline-flex h-11 min-w-[120px] items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="mediaBusy || saving"
            @click="save"
          >
            <Icon
              :icon="saving ? 'lucide:loader-circle' : 'lucide:save'"
              class="h-4 w-4"
              :class="saving ? 'animate-spin' : ''"
            />
            {{ saving ? 'Saving...' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Error Modal -->
    <Teleport to="body">
      <div
        v-if="errorModal.show"
        class="fixed inset-0 z-[1200] flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm"
        @click.self="closeErrorModal"
      >
        <div class="w-full max-w-md overflow-hidden rounded-[30px] border border-rose-200 bg-white shadow-2xl dark:border-rose-900/40 dark:bg-neutral-900">
          <div class="p-6">
            <div class="flex items-start gap-4">
              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-300">
                <Icon icon="lucide:triangle-alert" class="h-6 w-6" />
              </div>

              <div class="min-w-0">
                <h3 class="text-base font-black text-gray-900 dark:text-white">
                  {{ errorModal.title }}
                </h3>
                <p class="mt-2 text-sm leading-6 text-gray-500 dark:text-neutral-400">
                  {{ errorModal.message }}
                </p>
              </div>
            </div>

            <div class="mt-6 flex justify-end">
              <button
                type="button"
                class="inline-flex h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 text-sm font-bold text-white transition hover:bg-rose-700"
                @click="closeErrorModal"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, reactive, ref, watch } from 'vue'
import { useWeb } from '~/composables/data/useWeb'
import { useCloudinaryUpload } from '~/composables/useCloudinaryUpload'

type Shape = {
  hero: {
    cover: string
    coverPublicId?: string | null
    badge: string
    title: string
    subtitle: string
    heightSm: string
    heightLg: string
  }
  texts: {
    searchPlaceholder: string
    emptyList: string
    notFound: string
    loadMore: string
  }
}

const props = defineProps<{
  section: {
    id: string
    key: string
    props?: Partial<Shape>
  }
  pagePath?: string
  web?: ReturnType<typeof useWeb> | any
}>()

const web = props.web || useWeb()

function normalizePath(path?: string) {
  const raw = path || '/'
  return web?.normalizePath ? web.normalizePath(String(raw)) : String(raw)
}

watch(
  () => props.pagePath,
  (pagePath) => {
    if ((web as any)?.setActivePath) {
      ;(web as any).setActivePath(normalizePath(pagePath))
    }
  },
  { immediate: true }
)

const tabs = [
  { key: 'Hero', label: 'Hero', icon: 'lucide:layout-template' },
  { key: 'Teks Lain', label: 'Teks Lain', icon: 'lucide:type' }
] as const

type TabKey = typeof tabs[number]['key']

const activeTab = ref<TabKey>('Hero')

const defaults: Shape = {
  hero: {
    cover: '/assets/images/profile.png',
    coverPublicId: null,
    badge: 'Kabar Terbaru',
    title: 'Berita Pondok Pesantren Al-Inayah',
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
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

function merge(base: Shape, patch: Partial<Shape> = {}): Shape {
  return {
    hero: {
      cover: patch.hero?.cover ?? base.hero.cover,
      coverPublicId: patch.hero?.coverPublicId ?? base.hero.coverPublicId ?? null,
      badge: patch.hero?.badge ?? base.hero.badge,
      title: patch.hero?.title ?? base.hero.title,
      subtitle: patch.hero?.subtitle ?? base.hero.subtitle,
      heightSm: patch.hero?.heightSm ?? base.hero.heightSm,
      heightLg: patch.hero?.heightLg ?? base.hero.heightLg
    },
    texts: {
      searchPlaceholder: patch.texts?.searchPlaceholder ?? base.texts.searchPlaceholder,
      emptyList: patch.texts?.emptyList ?? base.texts.emptyList,
      notFound: patch.texts?.notFound ?? base.texts.notFound,
      loadMore: patch.texts?.loadMore ?? base.texts.loadMore
    }
  }
}

const form = reactive<Shape>(merge(defaults, props.section?.props || {}))

watch(
  () => props.section?.props,
  (nextProps) => {
    Object.assign(form, merge(defaults, nextProps || {}))
    coverUrlDraft.value = form.hero.cover || ''
  }
)

const savedNote = ref('')
const errNote = ref('')
const saving = ref(false)

const {
  uploadImage,
  deleteImage,
  uploading,
  deleting,
  uploadError,
  deleteError
} = useCloudinaryUpload()

const mediaBusy = computed(() => uploading.value || deleting.value)
const mediaMode = ref<'upload' | 'url'>('upload')
const coverUrlDraft = ref(form.hero.cover || '')
const progressCover = ref<number | null>(null)

const errorModal = reactive({
  show: false,
  title: '',
  message: ''
})

function showErrorModal(title: string, message: string) {
  errorModal.title = title
  errorModal.message = message
  errorModal.show = true
}

function closeErrorModal() {
  errorModal.show = false
  errorModal.title = ''
  errorModal.message = ''
}

/* ===== Save / Reset ===== */
async function save() {
  try {
    saving.value = true
    errNote.value = ''

    const path = normalizePath(props.pagePath)

    if ((web as any)?.setActivePath) {
      ;(web as any).setActivePath(path)
    }

    await web.updateSection(props.section.id, {
      props: clone(form)
    }, path)

    savedNote.value = 'Tersimpan.'
    setTimeout(() => {
      savedNote.value = ''
    }, 1500)
  } catch (error: any) {
    errNote.value = error?.message || 'Gagal menyimpan.'
    showErrorModal('Gagal menyimpan', errNote.value)
  } finally {
    saving.value = false
  }
}

async function resetToDefault() {
  if (form.hero.coverPublicId) {
    try {
      await deleteImage(form.hero.coverPublicId)
    } catch {}
  }

  Object.assign(form, clone(defaults))
  coverUrlDraft.value = form.hero.cover || ''
  activeTab.value = 'Hero'

  savedNote.value = 'Form dikembalikan ke default.'
  setTimeout(() => {
    savedNote.value = ''
  }, 1500)
}

/* ===== Image Upload / URL ===== */
const allowedImageTypes = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
])

const MAX_IMAGE_SIZE = 5 * 1024 * 1024

function isAllowedImage(file: File) {
  if (!allowedImageTypes.has(file.type)) {
    return 'Format gambar harus JPG, PNG, atau WebP. SVG/GIF tidak diperbolehkan.'
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return 'Ukuran gambar maksimal 5 MB.'
  }

  return ''
}

function isHttpUrl(url: string) {
  return /^https?:\/\//i.test(String(url || ''))
}

function isLocalAssetUrl(url: string) {
  return String(url || '').startsWith('/')
}

function validateRemoteImageUrl(url: string) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image()

    const timer = window.setTimeout(() => {
      img.src = ''
      reject(new Error('Gambar terlalu lama dimuat. Pastikan link gambar bisa diakses publik.'))
    }, 8000)

    img.onload = () => {
      window.clearTimeout(timer)

      if (!img.naturalWidth || !img.naturalHeight) {
        reject(new Error('Link tidak terbaca sebagai gambar yang valid.'))
        return
      }

      resolve()
    }

    img.onerror = () => {
      window.clearTimeout(timer)
      reject(new Error('Gambar tidak ditemukan atau link menolak akses gambar.'))
    }

    img.referrerPolicy = 'no-referrer'
    img.src = url
  })
}

async function uploadCoverImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  errNote.value = ''
  savedNote.value = ''

  const validation = isAllowedImage(file)

  if (validation) {
    showErrorModal('Gambar tidak valid', validation)
    input.value = ''
    return
  }

  progressCover.value = 5

  let timer: ReturnType<typeof window.setInterval> | null = null

  try {
    const oldPublicId = form.hero.coverPublicId || null

    timer = window.setInterval(() => {
      if (progressCover.value != null && progressCover.value < 92) {
        progressCover.value += 7
      }
    }, 180)

    const result = await uploadImage(file, {
      folder: 'obayan-web/news-page',
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.84
    })

    form.hero.cover = result.secure_url
    form.hero.coverPublicId = result.public_id
    coverUrlDraft.value = result.secure_url

    if (oldPublicId && oldPublicId !== result.public_id) {
      await deleteImage(oldPublicId)
    }

    progressCover.value = 100
    savedNote.value = 'Gambar berhasil diupload.'
    setTimeout(() => {
      savedNote.value = ''
    }, 1500)
  } catch (error: any) {
    showErrorModal(
      'Upload gagal',
      uploadError.value || error?.message || 'Gagal upload gambar.'
    )
  } finally {
    if (timer) window.clearInterval(timer)

    setTimeout(() => {
      progressCover.value = null
    }, 1000)

    input.value = ''
  }
}

async function applyCoverUrl() {
  const url = String(coverUrlDraft.value || '').trim()

  if (!url) {
    showErrorModal('URL kosong', 'Masukkan link gambar terlebih dahulu.')
    return
  }

  if (isLocalAssetUrl(url)) {
    await clearCloudinaryCover()

    form.hero.cover = url
    form.hero.coverPublicId = null

    savedNote.value = 'Path lokal digunakan. Klik Simpan untuk menyimpan.'
    setTimeout(() => {
      savedNote.value = ''
    }, 1500)
    return
  }

  if (!isHttpUrl(url)) {
    showErrorModal('URL tidak valid', 'Link gambar harus diawali http:// atau https://.')
    return
  }

  try {
    await validateRemoteImageUrl(url)
    await clearCloudinaryCover()

    form.hero.cover = url
    form.hero.coverPublicId = null

    savedNote.value = 'Link gambar berhasil digunakan. Klik Simpan untuk menyimpan.'
    setTimeout(() => {
      savedNote.value = ''
    }, 1500)
  } catch (error: any) {
    showErrorModal(
      'Gambar tidak bisa digunakan',
      error?.message || 'Link gambar invalid, tidak ditemukan, atau tidak bisa diakses.'
    )
  }
}

async function clearCloudinaryCover() {
  const publicId = form.hero.coverPublicId

  if (!publicId) return

  try {
    await deleteImage(publicId)
  } catch {}

  form.hero.coverPublicId = null
}

async function removeCoverImage() {
  try {
    await clearCloudinaryCover()

    form.hero.cover = ''
    form.hero.coverPublicId = null
    coverUrlDraft.value = ''

    savedNote.value = 'Cover dihapus. Klik Simpan untuk menyimpan.'
    setTimeout(() => {
      savedNote.value = ''
    }, 1500)
  } catch (error: any) {
    showErrorModal(
      'Gagal menghapus gambar',
      deleteError.value || error?.message || 'Gagal menghapus gambar.'
    )
  }
}
</script>