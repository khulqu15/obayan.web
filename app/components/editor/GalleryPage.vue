<!-- components/editor/GalleryPage.vue -->
<template>
  <div>
    <!-- Tabs -->
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

    <div v-show="activeTab === 'Hero'" class="mt-3 grid sm:grid-cols-2 gap-4">
      <div class="sm:col-span-2">
        <label class="text-xs text-gray-500">Gambar Cover (URL/Data URL)</label>
        <div class="mt-1 flex items-center gap-2">
          <input
            v-model.trim="form.hero.cover"
            placeholder="/assets/images/activity1.jpg"
            class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"
          />
          <label class="inline-flex items-center gap-2 px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer">
            <input type="file" accept="image/*" class="hidden" @change="onPickHeroImage" />
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

        <div class="mt-3">
          <div class="text-xs text-gray-500 mb-1">Pratinjau Cover</div>
          <div class="h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 flex items-center justify-center">
            <img
              v-if="form.hero.cover"
              :src="form.hero.cover"
              alt="preview-hero"
              class="w-full h-full object-cover"
              @error="onImgError"
            />
            <div v-else class="text-xs text-gray-400">Belum ada gambar</div>
          </div>
        </div>
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
    </div>

    <div v-show="activeTab === 'Teks'" class="mt-3 grid gap-3">
      <div>
        <label class="text-xs text-gray-500">Placeholder Pencarian</label>
        <input v-model.trim="form.texts.searchPlaceholder" placeholder="Cari foto (judul/tag/kategori)…" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
      </div>
      <div class="grid sm:grid-cols-2 gap-3">
        <div>
          <label class="text-xs text-gray-500">Label Kategori “All”</label>
          <input v-model.trim="form.texts.categoryAll" placeholder="All" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
        </div>
        <div>
          <label class="text-xs text-gray-500">Label “Load More”</label>
          <input v-model.trim="form.texts.loadMore" placeholder="Tampilkan Lebih Banyak" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
        </div>
      </div>
    </div>

    <div v-show="activeTab === 'Galeri'" class="mt-3 space-y-3">
      <div
        v-for="(it, i) in form.gallery.items"
        :key="'g'+i"
        class="rounded-xl border border-gray-200 dark:border-neutral-800 p-3"
      >
        <div class="flex flex-wrap items-start gap-3">
          <div class="w-full h-20 shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 flex items-center justify-center">
            <img
              v-if="it.src"
              :src="it.src"
              :alt="it.title || ('Gambar #' + (i+1))"
              class="w-full h-full object-cover"
              @error="onImgError"
            />
            <div v-else class="text-[10px] text-gray-400 px-2 text-center">No image</div>
          </div>
          <div class="flex-1 grid sm:grid-cols-3 gap-3">
            <div class="sm:col-span-2">
              <label class="text-xs text-gray-500">Sumber Gambar (URL)</label>
              <div class="mt-1 flex items-center gap-2">
                <input v-model.trim="it.src" placeholder="/assets/images/gallery/1.jpg" class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
                <label class="inline-flex items-center gap-2 px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer">
                  <input type="file" accept="image/*" class="hidden" @change="onPickItemImage($event, i)" />
                  Unggah
                </label>
                <button v-if="it.src" class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800" @click="it.src=''">
                  Hapus
                </button>
              </div>
            </div>

            <div>
              <label class="text-xs text-gray-500">Judul</label>
              <input v-model.trim="it.title" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
            </div>

            <div>
              <label class="text-xs text-gray-500">Kategori</label>
              <input v-model.trim="it.category" placeholder="Kegiatan / Fasilitas / ..." class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
            </div>

            <div class="sm:col-span-3">
              <label class="text-xs text-gray-500">Tags (pisahkan dengan koma)</label>
              <input v-model.trim="it.tagsText" placeholder="santri, kajian" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-2">
        <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50 border-gray-200 dark:border-neutral-700 dark:hover:bg-neutral-800"
                @click="form.gallery.items.push({ src:'', title:'', category:'', tagsText:'' })">
          Tambah Foto
        </button>
        <button v-if="form.gallery.items.length>0"
                class="px-2 py-1 text-xs rounded border text-rose-600 hover:bg-rose-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                @click="form.gallery.items.pop()">
          Hapus Terakhir
        </button>
      </div>
    </div>

    <div class="mt-4 flex flex-wrap gap-2">
      <p v-if="savedNote" class="text-[11px] text-emerald-600">{{ savedNote }}</p>
      <p v-if="errNote" class="text-[11px] text-rose-600">{{ errNote }}</p>
    </div>
  </div>
</template>

<!-- components/editor/GalleryPage.vue -->
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
  },
  texts: {
    searchPlaceholder: string
    categoryAll: string
    loadMore: string
  },
  gallery: {
    items: Array<{ src: string; title: string; category: string; tagsText?: string }>
  }
}

const props = defineProps<{
  section: { id: string; key: string; props?: Partial<Shape> }
  pagePath?: string
}>()

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
  gallery: {
    items: [
      { src: '/assets/images/gallery/1.jpg', title: 'Dokumentasi #1', category: 'Kegiatan', tagsText: 'santri, kajian' },
      { src: '/assets/images/gallery/2.jpg', title: 'Dokumentasi #2', category: 'Fasilitas', tagsText: 'kelas, perpustakaan' }
    ]
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
      categoryAll: patch?.texts?.categoryAll ?? base.texts.categoryAll,
      loadMore: patch?.texts?.loadMore ?? base.texts.loadMore
    },
    gallery: {
      items: Array.isArray(patch?.gallery?.items) && patch!.gallery!.items.length
        ? patch!.gallery!.items
        : [...base.gallery.items]
    }
  }
}

const form = reactive<Shape>(merge(defaults, props.section?.props))
const savedNote = ref(''); const errNote = ref('')
const tabs = ['Hero', 'Teks', 'Galeri'] as const
const activeTab = ref<typeof tabs[number]>('Hero')

watch(() => props.section?.props, (p) => { Object.assign(form, merge(defaults, p)) })

const webApi = useWeb()
watch(() => props.pagePath, (p) => { (webApi as any)?.setActivePath?.(p) }, { immediate: true })
const { updateSection, uploadMedia } = webApi

async function save() {
  try {
    errNote.value = ''
    await updateSection(props.section.id, { props: JSON.parse(JSON.stringify(form)) })
    savedNote.value = 'Tersimpan.'; setTimeout(() => (savedNote.value = ''), 1500)
  } catch (e:any) {
    errNote.value = e?.message || 'Gagal menyimpan'
  }
}

function resetToDefault() {
  Object.assign(form, JSON.parse(JSON.stringify(defaults)))
  activeTab.value = 'Hero'
}

async function onPickHeroImage(ev: Event) {
  const input = ev.target as HTMLInputElement
  const file = input.files?.[0]; if (!file) return
  try {
    const up = await uploadMedia(file)
    if (up?.url) form.hero.cover = up.url
  } catch {}
  input.value = ''
}

async function onPickItemImage(ev: Event, idx: number) {
  const input = ev.target as HTMLInputElement
  const file = input.files?.[0]; if (!file) return
  try {
    const up = await uploadMedia(file)
    if (up?.url) form.gallery.items[idx]!.src = up.url
  } catch {}
  input.value = ''
}

function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  el.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="100%" height="100%" fill="#f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12">No Image</text></svg>'
  )
}
</script>
