<!-- components/editor/NewsPage.vue -->
<template>
  <div>
    <!-- Tabs: hanya Hero & Teks Lain -->
    <div class="flex gap-1 border-b border-gray-200 dark:border-neutral-800">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="px-3 py-2 text-xs rounded-t-lg"
        :class="activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800'"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>

      <div class="ml-auto flex flex-wrap gap-2 mb-2">
        <button class="px-2 py-1 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700" @click="resetToDefault">
          Isi Default
        </button>
        <button class="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700" @click="save">
          Simpan
        </button>
      </div>
    </div>

    <!-- HERO -->
    <div v-show="activeTab === 'Hero'" class="mt-3 grid sm:grid-cols-2 gap-4">
      <div class="sm:col-span-2">
        <label class="text-xs text-gray-500">Gambar Cover (URL/Data URL)</label>
        <div class="mt-1 flex items-center gap-2">
          <input
            v-model.trim="form.hero.cover"
            placeholder="/assets/images/profile.png"
            class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"
          />
          <label class="inline-flex items-center gap-2 px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer">
            <input type="file" accept="image/*" class="hidden" @change="onPickImage" />
            Unggah
          </label>
          <button
            v-if="form.hero.cover"
            class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800"
            @click="form.hero.cover = ''"
          >
            Hapus
          </button>
        </div>
        <p class="mt-1 text-[11px] text-gray-500">Bisa path lokal, URL publik, atau Data URL (base64).</p>
      </div>

      <div>
        <label class="text-xs text-gray-500">Badge</label>
        <input v-model.trim="form.hero.badge" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
      </div>
      <div>
        <label class="text-xs text-gray-500">Judul Utama</label>
        <input v-model.trim="form.hero.title" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
      </div>
      <div class="sm:col-span-2">
        <label class="text-xs text-gray-500">Subjudul</label>
        <textarea v-model.trim="form.hero.subtitle" rows="2" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"></textarea>
      </div>

      <div class="sm:col-span-2">
        <label class="text-xs text-gray-500">Tinggi Hero (mobile / desktop)</label>
        <div class="mt-1 grid grid-cols-2 gap-2">
          <input v-model.trim="form.hero.heightSm" placeholder="36vh" class="rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
          <input v-model.trim="form.hero.heightLg" placeholder="44vh" class="rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
        </div>
      </div>

      <!-- PREVIEW -->
      <div class="sm:col-span-2">
        <label class="text-xs text-gray-500">Pratinjau</label>
        <div class="mt-2 relative h-48 rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700">
          <img v-if="form.hero.cover" :src="form.hero.cover" alt="preview" class="w-full h-full object-cover opacity-80" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10"></div>
          <div class="absolute bottom-3 left-3 right-3 text-white">
            <p class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-blue-200">
              <span class="inline-block size-2 rounded-full bg-blue-400" /> {{ form.hero.badge || '—' }}
            </p>
            <h3 class="mt-1 text-lg font-bold">{{ form.hero.title || '—' }}</h3>
            <p class="text-xs opacity-90">{{ form.hero.subtitle || '—' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- TEKS LAIN -->
    <div v-show="activeTab === 'Teks Lain'" class="mt-3 grid gap-3">
      <div>
        <label class="text-xs text-gray-500">Placeholder Pencarian</label>
        <input v-model.trim="form.texts.searchPlaceholder" placeholder="Cari berita (judul/isi/tag)…" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
      </div>
      <div>
        <label class="text-xs text-gray-500">Teks Kosong (daftar)</label>
        <input v-model.trim="form.texts.emptyList" placeholder="Berita masih kosong." class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
      </div>
      <div>
        <label class="text-xs text-gray-500">Teks Tidak Ditemukan (detail)</label>
        <input v-model.trim="form.texts.notFound" placeholder="Berita tidak ditemukan." class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
      </div>
      <div>
        <label class="text-xs text-gray-500">Label Tombol “Tampilkan Lebih Banyak”</label>
        <input v-model.trim="form.texts.loadMore" placeholder="Tampilkan Lebih Banyak" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
      </div>
    </div>

    <div class="mt-4 flex flex-wrap gap-2">
      <p v-if="savedNote" class="text-[11px] text-emerald-600">{{ savedNote }}</p>
      <p v-if="errNote" class="text-[11px] text-rose-600">{{ errNote }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useWeb } from '~/composables/data/useWeb'

type Shape = {
  hero: {
    cover: string
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
  section: { id: string; key: string; props?: Partial<Shape> },
  pagePath?: string,
  web?: ReturnType<typeof useWeb>
}>()

const defaults: Shape = {
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
      emptyList: patch?.texts?.emptyList ?? base.texts.emptyList,
      notFound: patch?.texts?.notFound ?? base.texts.notFound,
      loadMore: patch?.texts?.loadMore ?? base.texts.loadMore
    }
  }
}

const form = reactive<Shape>(merge(defaults, props.section?.props))
const savedNote = ref(''); const errNote = ref('')
const tabs = ['Hero', 'Teks Lain'] as const
const activeTab = ref<typeof tabs[number]>('Hero')

watch(() => props.section?.props, (p) => { Object.assign(form, merge(defaults, p)) })

const web = props.web || useWeb()

function normalize(p?: string) {
  const n = p || '/'
  return web?.normalizePath ? web.normalizePath(String(n)) : String(n)
}

async function save() {
  try {
    errNote.value = ''
    const path = normalize(props.pagePath)
    web?.setActivePath?.(path)
    await web.updateSection(props.section.id, { props: JSON.parse(JSON.stringify(form)) }, path)
    savedNote.value = 'Tersimpan.'; setTimeout(() => (savedNote.value = ''), 1500)
  } catch (e:any) {
    errNote.value = e?.message || 'Gagal menyimpan'
  }
}

function resetToDefault() {
  Object.assign(form, JSON.parse(JSON.stringify(defaults)))
  activeTab.value = 'Hero'
}

async function onPickImage(ev: Event) {
  const input = ev.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    const path = web.normalizePath?.(props.pagePath || '/')
    web.setActivePath?.(path)
    const up = await web.uploadMedia(file, {
      folder: '',
      pathOverride: props.pagePath,
      filenamePrefix: 'hero'
    })
    if (up?.url) form.hero.cover = up.url
  } finally {
    if (input) input.value = ''
  }
}

</script>
