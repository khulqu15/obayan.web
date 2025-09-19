<!-- /pages/app/gallery.vue -->
<template>
  <section class="relative p-4 md:p-6 text-gray-800 dark:text-neutral-200">
    <!-- BG -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-white dark:bg-neutral-950 [background-image:radial-gradient(theme(colors.emerald.100)_1px,transparent_1px)] [background-size:18px_18px] [background-position:0_0] dark:[background-image:radial-gradient(theme(colors.emerald.900/.25)_1px,transparent_1px)]"></div>
      <div class="absolute -top-24 -left-28 w-[38rem] h-[38rem] rounded-full opacity-30 blur-3xl bg-[radial-gradient(closest-side,theme(colors.emerald.300/.35),transparent)] dark:bg-[radial-gradient(closest-side,theme(colors.emerald.700/.25),transparent)]" />
      <div class="absolute top-28 -right-24 w-[34rem] h-[34rem] rounded-full opacity-25 blur-3xl bg-[radial-gradient(closest-side,theme(colors.sky.300/.35),transparent)] dark:bg-[radial-gradient(closest-side,theme(colors.sky.700/.25),transparent)]" />
    </div>

    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Galeri</h1>
        <p class="text-sm text-gray-500 dark:text-neutral-400">Kelola hero, teks, dan koleksi foto.</p>
      </div>
      <div class="flex items-center gap-2">
        <NuxtLink to="/app" class="inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-white dark:bg-neutral-900 dark:border-neutral-700 px-3 py-2 text-sm hover:shadow">
          <Icon icon="lucide:arrow-left" class="size-4" /> Kembali
        </NuxtLink>
        <button class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-3 py-2 text-sm hover:bg-emerald-700"
                @click="openItemCreate">
          <Icon icon="lucide:plus" class="size-4" /> Tambah Foto
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="mt-4 border-b border-gray-100 dark:border-neutral-800 flex flex-wrap gap-1">
      <button v-for="t in tabs" :key="t"
              class="px-3 py-2 text-xs rounded-t-lg"
              :class="activeTab===t ? 'bg-emerald-600 text-white' : 'text-gray-600 dark:text-neutral-300 dark:hover:bg-neutral-800'"
              @click="activeTab=t">
        {{ t }}
      </button>

      <div class="ml-auto flex gap-2 mb-3">
        <button class="px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-neutral-700 hover:bg-emerald-50 dark:hover:bg-neutral-800"
                @click="resetDefaults">
          Isi Default
        </button>
        <button class="px-3 py-2 text-xs flex rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                :disabled="savingConfig" @click="saveConfig">
          <Icon :icon="savingConfig?'svg-spinners:3-dots-fade':'lucide:save'" class="size-4" />
          <span class="ml-1">{{ savingConfig ? 'Menyimpan…' : 'Simpan' }}</span>
        </button>
      </div>
    </div>

    <!-- TAB: Hero & Teks -->
    <div v-show="activeTab==='Hero & Teks'" class="mt-4 grid lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 p-4">
        <h3 class="font-semibold mb-3 flex items-center gap-2">
          <Icon icon="lucide:images" class="size-4 text-emerald-600" /> Hero
        </h3>

        <div class="grid sm:grid-cols-[1fr,auto] gap-3 items-start">
          <div>
            <label class="text-xs text-gray-500">Gambar Cover (URL)</label>
            <div class="mt-1 flex items-center gap-2">
              <input v-model.trim="form.hero.cover"
                     placeholder="/assets/images/activity1.jpg"
                     class="w-full rounded-lg border border-gray-100 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm" />
              <label class="inline-flex items-center gap-2 px-3 py-2 text-xs rounded-xl border border-gray-100 dark:border-neutral-700 hover:bg-emerald-50 dark:hover:bg-neutral-800 cursor-pointer">
                <input type="file" accept="image/*" class="hidden" @change="onPickHero" />
                Unggah
              </label>
              <button v-if="form.hero.cover"
                      class="px-3 py-2 text-xs rounded-xl border border-rose-200 dark:border-rose-900/30 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10"
                      @click="form.hero.cover=''">
                Hapus
              </button>
            </div>

            <div class="mt-3">
              <p class="text-xs text-gray-500 mb-1">Pratinjau</p>
              <div class="h-40 rounded-xl overflow-hidden border border-gray-100 dark:border-neutral-800 bg-emerald-50/60 dark:bg-neutral-800 grid place-items-center">
                <img v-if="form.hero.cover" :src="form.hero.cover" alt=""
                     class="w-full h-full object-cover" @error="onImgError" />
                <div v-else class="text-xs text-gray-400">Belum ada cover</div>
              </div>
            </div>
          </div>

          <div class="grid gap-2">
            <div>
              <label class="text-xs text-gray-500">Badge</label>
              <input v-model.trim="form.hero.badge" class="mt-1 w-full rounded-lg border border-gray-100 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="text-xs text-gray-500">Tinggi (mobile/desktop)</label>
              <div class="mt-1 grid grid-cols-2 gap-2">
                <input v-model.trim="form.hero.heightSm" placeholder="36vh" class="rounded-lg border border-gray-100 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm" />
                <input v-model.trim="form.hero.heightLg" placeholder="44vh" class="rounded-lg border border-gray-100 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm" />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-3 grid gap-2">
          <div>
            <label class="text-xs text-gray-500">Judul Utama</label>
            <input v-model.trim="form.hero.title" class="mt-1 w-full rounded-lg border border-gray-100 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="text-xs text-gray-500">Subjudul</label>
            <textarea v-model.trim="form.hero.subtitle" rows="2" class="mt-1 w-full rounded-lg border border-gray-100 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"></textarea>
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 p-4">
        <h3 class="font-semibold mb-3 flex items-center gap-2">
          <Icon icon="lucide:text-cursor-input" class="size-4 text-sky-600" /> Teks
        </h3>
        <div class="grid gap-2">
          <div>
            <label class="text-xs text-gray-500">Placeholder Pencarian</label>
            <input v-model.trim="form.texts.searchPlaceholder" class="mt-1 w-full rounded-lg border border-gray-100 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="text-xs text-gray-500">Label Kategori “All”</label>
            <input v-model.trim="form.texts.categoryAll" class="mt-1 w-full rounded-lg border border-gray-100 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="text-xs text-gray-500">Label “Load More”</label>
            <input v-model.trim="form.texts.loadMore" class="mt-1 w-full rounded-lg border border-gray-100 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm" />
          </div>
        </div>
      </div>
    </div>

    <!-- TAB: Galeri -->
    <div v-show="activeTab==='Galeri'" class="mt-5">
      <!-- Toolbar -->
      <div class="flex flex-wrap items-center gap-2">
        <div class="relative w-full sm:w-80">
          <Icon icon="lucide:search" class="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input v-model="q" type="search" placeholder="Cari judul/kategori/tag…"
                 class="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-gray-100 bg-white/90 dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
        </div>
        <div class="flex gap-1.5 items-center overflow-x-auto no-scrollbar">
          <button class="px-3 py-1.5 text-xs rounded-full border"
                  :class="fCategory==='all'?'bg-emerald-600 text-white border-gray-600':'border-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-700'"
                  @click="fCategory='all'">Semua</button>
          <button v-for="c in categories" :key="c" class="px-3 py-1.5 text-xs rounded-full border"
                  :class="fCategory===c?'bg-emerald-600 text-white border-gray-600':'border-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-700'"
                  @click="fCategory=c">{{ c }}</button>
        </div>
        <span class="text-xs text-gray-500 dark:text-neutral-400 ml-auto">({{ filtered.length }} item)</span>
      </div>

      <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-3">
        <template v-if="loading">
          <div v-for="i in 12" :key="i" class="rounded-xl overflow-hidden border border-gray-100/60 dark:border-gray-900/30 bg-white/70 dark:bg-neutral-800/70">
            <div class="aspect-square animate-pulse bg-emerald-100/40 dark:bg-neutral-700/40"></div>
            <div class="p-3 space-y-2">
              <div class="h-3 rounded bg-emerald-100/60 dark:bg-neutral-700/60"></div>
              <div class="h-3 w-1/2 rounded bg-emerald-100/60 dark:bg-neutral-700/60"></div>
            </div>
          </div>
        </template>

        <div v-else v-for="(g, idx) in filtered" :key="idx"
             class="group rounded-2xl overflow-hidden border border-gray-100/60 dark:border-gray-900/30 bg-white/90 dark:bg-neutral-800/90 hover:shadow-md">
          <div class="relative">
            <img v-if="g.src" :src="g.src" class="w-full h-full object-cover aspect-square" alt="" @error="onImgError" />
            <div v-else class="w-full aspect-square grid place-items-center bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-neutral-700 dark:to-neutral-700">
              <Icon icon="lucide:image" class="size-8 text-emerald-600" />
            </div>
            <div class="absolute top-2 left-2">
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600/90 text-white">{{ g.category || '—' }}</span>
            </div>
          </div>
          <div class="p-3">
            <p class="font-medium truncate">{{ g.title || 'Tanpa judul' }}</p>
            <p class="text-[11px] text-gray-500 dark:text-neutral-400 truncate">{{ (g.tagsText||'').split(',').map(s=>s.trim()).filter(Boolean).slice(0,3).join(', ') }}</p>
            <div class="mt-2 flex items-center gap-1.5">
              <button class="px-2 py-1.5 text-xs rounded-lg border border-gray-100/70 hover:bg-emerald-50 dark:border-neutral-700 dark:hover:bg-neutral-700" @click="openItemEdit(idx)">
                Edit
              </button>
              <button class="px-2 py-1.5 text-xs rounded-lg border border-rose-200/60 text-rose-600 hover:bg-rose-50 dark:border-rose-900/30 dark:hover:bg-rose-900/10" @click="openDelete(idx)">
                Hapus
              </button>
            </div>
          </div>
        </div>

        <div v-if="!loading && !filtered.length" class="col-span-full p-6 text-sm text-gray-600 border border-dashed border-gray-200 rounded-2xl bg-emerald-50/40 dark:bg-neutral-800 dark:text-neutral-400 dark:border-gray-900/30">
          Tidak ada item.
        </div>
      </div>
    </div>

    <!-- MODAL: Create/Edit Item -->
    <teleport to="body">
      <div v-if="itemModal.open" class="fixed inset-0 z-[95]">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeItemModal"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-2xl rounded-3xl border border-gray-100/70 bg-white/95 shadow-2xl ring-1 ring-black/5 dark:bg-neutral-800 dark:border-neutral-700">
            <div class="p-4 border-b border-gray-100/70 dark:border-neutral-700 flex items-center justify-between rounded-t-3xl">
              <h3 class="font-semibold">{{ itemModal.mode==='create' ? 'Tambah Foto' : 'Edit Foto' }}</h3>
              <button class="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-neutral-700" @click="closeItemModal">
                <Icon icon="lucide:x" class="size-4" />
              </button>
            </div>

            <form class="p-4 space-y-4" @submit.prevent="saveItem">
              <div class="grid sm:grid-cols-[1fr,auto] gap-3 items-start">
                <div>
                  <label class="text-xs text-gray-500">Sumber Gambar (URL)</label>
                  <div class="mt-1 flex items-center gap-2">
                    <input v-model.trim="itemForm.src" placeholder="https://…" class="w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-gray-100/70 dark:border-neutral-700 px-3 py-2 text-sm" />
                    <label class="inline-flex items-center gap-2 px-3 py-2 text-xs rounded-xl border border-gray-100/70 dark:border-neutral-700 hover:bg-emerald-50 dark:hover:bg-neutral-700 cursor-pointer">
                      <input type="file" accept="image/*" class="hidden" @change="onPickItemImage" />
                      Unggah
                    </label>
                  </div>
                </div>
                <div class="w-36">
                  <div class="text-xs text-gray-500">Pratinjau</div>
                  <div class="mt-1 aspect-square rounded-xl overflow-hidden border border-gray-100/70 dark:border-neutral-700 dark:bg-neutral-800 grid place-items-center">
                    <img v-if="itemForm.src" :src="itemForm.src" alt="" class="w-full h-full object-cover" @error="onImgError" />
                    <div v-else class="text-[11px] text-gray-400">No image</div>
                  </div>
                </div>
              </div>

              <div class="grid sm:grid-cols-2 gap-3">
                <div>
                  <label class="text-xs text-gray-500">Judul</label>
                  <input v-model.trim="itemForm.title" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-gray-100/70 dark:border-neutral-700 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500">Kategori</label>
                  <input v-model.trim="itemForm.category" placeholder="Kegiatan / Fasilitas / ..." class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-gray-100/70 dark:border-neutral-700 px-3 py-2 text-sm" />
                </div>
              </div>

              <div>
                <label class="text-xs text-gray-500">Tags (pisahkan dengan koma)</label>
                <input v-model.trim="itemForm.tagsText" placeholder="santri, kajian" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-gray-100/70 dark:border-neutral-700 px-3 py-2 text-sm" />
              </div>

              <div class="flex items-center justify-end gap-2">
                <button type="button" class="px-3 py-2 rounded-xl border dark:border-neutral-700" @click="closeItemModal">Batal</button>
                <button type="submit" class="px-3 py-2 rounded-xl flex bg-emerald-600 text-white hover:bg-emerald-700">
                  <Icon v-if="itemSaving" icon="ph:spinner" class="size-4 animate-spin" />
                  <span>{{ itemSaving ? 'Menyimpan…' : (itemModal.mode==='create' ? 'Simpan' : 'Update') }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </teleport>

    <!-- MODAL: Delete -->
    <teleport to="body">
      <div v-if="delModal.open" class="fixed inset-0 z-[96]">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeDelete"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-md rounded-2xl border border-rose-200/60 bg-white/95 dark:bg-neutral-800 dark:border-rose-900/30 shadow-xl">
            <div class="p-4 border-b border-rose-200/60 dark:border-rose-900/30 flex items-center gap-2">
              <Icon icon="lucide:alert-triangle" class="size-5 text-rose-600" />
              <h3 class="font-semibold">Hapus Item</h3>
              <button class="ml-auto p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/10" @click="closeDelete">
                <Icon icon="lucide:x" class="size-4" />
              </button>
            </div>
            <div class="p-4 text-sm">
              <p>Anda yakin menghapus <span class="font-semibold">{{ delModal.title }}</span>?</p>
            </div>
            <div class="p-4 flex items-center justify-end gap-2">
              <button class="px-3 py-2 rounded-xl border dark:border-neutral-700" @click="closeDelete">Batal</button>
              <button class="px-3 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700" @click="doDelete">Hapus</button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- TOAST -->
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
import { ref, reactive, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useWeb } from '~/composables/data/useWeb'

definePageMeta({ layout: 'app', layoutProps: { title: 'Galeri' }, ssr: false })

type GalleryItem = { src: string; title: string; category: string; tagsText?: string }
type Shape = {
  hero: { cover: string; badge: string; title: string; subtitle: string; heightSm: string; heightLg: string },
  texts: { searchPlaceholder: string; categoryAll: string; loadMore: string },
  gallery: { items: GalleryItem[] }
}

const tabs = ['Hero & Teks', 'Galeri'] as const 
const activeTab = ref<typeof tabs[number]>('Hero & Teks')

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
const clone = <T,>(v:T)=>JSON.parse(JSON.stringify(v))

/* ====== Sumber data tunggal: useWeb pada path /gallery ====== */
const ACTIVE_PATH = '/gallery'
const web = useWeb()
const { subscribePage, sections, updateSection, uploadMedia, addSection, normalizePath } = web

onMounted(async () => {
  // pastikan path aktif
  (web as any)?.setActivePath?.(ACTIVE_PATH)
  await subscribePage(ACTIVE_PATH)
  ensureSectionExists()
  hydrateForm()
})

/* Temukan / buat section GalleryPage */
const sectionId = computed(() => sections.value.find(s => s.key === 'GalleryPage')?.id || null)
async function ensureSectionExists() {
  if (!sectionId.value) {
    await addSection({ key: 'GalleryPage', enabled: true, props: clone(defaults) }, normalizePath(ACTIVE_PATH))
  }
}

/* ====== Form ====== */
const form = reactive<Shape>(clone(defaults))
const loading = ref(true)
const savingConfig = ref(false)

function hydrateForm(){
  const sec = sections.value.find(s => s.key === 'GalleryPage')
  const props = (sec?.props || {}) as Partial<Shape>
  const merged: Shape = {
    hero: { ...defaults.hero, ...(props.hero||{}) },
    texts: { ...defaults.texts, ...(props.texts||{}) },
    gallery: { items: Array.isArray(props.gallery?.items) ? props.gallery!.items : clone(defaults.gallery.items) }
  }
  Object.assign(form, clone(merged))
  loading.value = false
}

/* ====== Filters & UI (sama seperti punyamu) ====== */
const q = ref('')
const fCategory = ref<'all'|string>('all')
const items = computed(() => form.gallery.items || [])
const categories = computed(() => {
  const set = new Set<string>()
  for (const it of items.value) if ((it.category||'').trim()) set.add(it.category.trim())
  return Array.from(set).sort()
})
const filtered = computed(() => {
  const qv = q.value.trim().toLowerCase()
  return items.value.filter(it => {
    if (fCategory.value!=='all' && (it.category||'') !== fCategory.value) return false
    if (!qv) return true
    const hay = [it.title, it.category, it.tagsText].join(' ').toLowerCase()
    return hay.includes(qv)
  })
})

/* ====== SAVE CONFIG (semua props → section GalleryPage) ====== */
async function saveConfig() {
  try {
    savingConfig.value = true
    if (!sectionId.value) await ensureSectionExists()
    await updateSection(sectionId.value as string, { props: clone(form) })
    toast('Konfigurasi tersimpan.')
  } catch (e) {
    console.error(e); toast('Gagal menyimpan konfigurasi.', 'error')
  } finally {
    savingConfig.value = false
  }
}
function resetDefaults() { Object.assign(form, clone(defaults)); toast('Diisi nilai default.', 'info') }

/* ====== CRUD Item ====== */
const itemModal = reactive<{open:boolean; mode:'create'|'edit'; idx:number|null}>({ open:false, mode:'create', idx:null })
const itemForm = reactive<GalleryItem>({ src:'', title:'', category:'', tagsText:'' })
const itemSaving = ref(false)

function openItemCreate(){ itemModal.open = true; itemModal.mode='create'; itemModal.idx=null; Object.assign(itemForm, { src:'', title:'', category:'', tagsText:'' }) }
function openItemEdit(idx: number){ itemModal.open = true; itemModal.mode='edit'; itemModal.idx=idx; Object.assign(itemForm, clone(items.value[idx]||{ src:'', title:'', category:'', tagsText:'' })) }
function closeItemModal(){ itemModal.open=false; itemModal.idx=null }

/* Upload lewat useWeb */
async function onPickHero(e: Event){
  const file = (e.target as HTMLInputElement).files?.[0]; (e.target as HTMLInputElement).value=''
  if (!file) return
  try { const up = await uploadMedia(file); if (up?.url) form.hero.cover = up.url; toast('Cover diunggah.') } catch { toast('Gagal unggah cover.', 'error') }
}
async function onPickItemImage(e: Event){
  const file = (e.target as HTMLInputElement).files?.[0]; (e.target as HTMLInputElement).value=''
  if (!file) return
  try { const up = await uploadMedia(file); if (up?.url) itemForm.src = up.url; toast('Gambar diunggah.') } catch { toast('Gagal unggah gambar.', 'error') }
}

async function saveItem(){
  try {
    itemSaving.value = true
    const arr = clone(items.value)
    if (itemModal.mode==='create') arr.push(clone(itemForm))
    else if (itemModal.idx!=null) arr[itemModal.idx] = clone(itemForm)
    await updateSection(sectionId.value as string, { props: clone({ ...form, gallery: { items: arr } }) })
    Object.assign(form.gallery, { items: arr })
    toast(itemModal.mode==='create'?'Item ditambahkan.':'Item diperbarui.')
    closeItemModal()
  } catch (e) {
    console.error(e); toast('Gagal menyimpan item.', 'error')
  } finally { itemSaving.value = false }
}

/* Delete */
const delModal = reactive<{open:boolean; idx:number|null; title?:string}>({ open:false, idx:null, title:'' })
function openDelete(idx:number){ delModal.open=true; delModal.idx=idx; delModal.title = items.value[idx]?.title || '(tanpa judul)' }
function closeDelete(){ delModal.open=false; delModal.idx=null }
async function doDelete(){
  if (delModal.idx==null) return
  try {
    const arr = clone(items.value); arr.splice(delModal.idx, 1)
    await updateSection(sectionId.value as string, { props: clone({ ...form, gallery: { items: arr } }) })
    Object.assign(form.gallery, { items: arr })
    toast('Item dihapus.')
  } catch (e) {
    console.error(e); toast('Gagal menghapus item.', 'error')
  } finally { closeDelete() }
}

/* ====== Utils ====== */
function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  el.src = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="100%" height="100%" fill="#f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12">No Image</text></svg>')
}
type Toast = { id:number; message:string; type?:'success'|'error'|'info' }
const toasts = ref<Toast[]>([])
function toast(message:string, type:Toast['type']='success'){
  const id = Date.now()+Math.random()
  toasts.value.push({ id, message, type })
  setTimeout(()=>{ toasts.value = toasts.value.filter(t=>t.id!==id) }, 3000)
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar{ display:none; }
.no-scrollbar{ -ms-overflow-style:none; scrollbar-width:none; }
</style>
