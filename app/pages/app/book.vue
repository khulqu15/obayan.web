<!-- pages/app/books.vue -->
<template>
  <section class="relative p-4 md:p-6 text-gray-800 dark:text-neutral-200">
    <!-- BG -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-white dark:bg-neutral-950 [background-image:radial-gradient(theme(colors.emerald.100)_1px,transparent_1px)] [background-size:18px_18px] dark:[background-image:radial-gradient(theme(colors.emerald.900/.25)_1px,transparent_1px)]"></div>
    </div>

    <!-- HEADER -->
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center gap-2">
        <h1 class="text-xl font-semibold">Perpustakaan (Admin)</h1>
        <span class="text-sm text-gray-500 dark:text-neutral-400">({{ filtered.length }})</span>
      </div>

      <!-- Filter bar -->
      <div class="flex w-full flex-col sm:flex-row sm:flex-wrap md:w-auto gap-2">
        <div class="relative sm:w-72 w-full">
          <Icon icon="lucide:search" class="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input v-model="q" type="search" placeholder="Cari judul/penulis/tag…"
                 class="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-emerald-100 bg-white/90 backdrop-blur focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:bg-neutral-800 dark:border-neutral-700" />
        </div>

        <select v-model="fCategory" class="w-full sm:w-auto px-3 py-2 text-sm rounded-xl border border-emerald-100 bg-white/90 backdrop-blur dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
          <option value="all">Semua Kategori</option>
          <option v-for="c in BOOK_CATEGORIES" :key="c" :value="c">{{ c }}</option>
        </select>

        <select v-model="fAktif" class="w-full sm:w-auto px-3 py-2 text-sm rounded-xl border border-emerald-100 bg-white/90 backdrop-blur dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
          <option value="all">Semua</option>
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>

        <button @click="openCreate"
                class="inline-flex items-center justify-center gap-x-2 rounded-xl bg-emerald-600 text-white px-3 py-2 text-sm font-medium hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 active:scale-[.98] transition-all">
          <Icon icon="lucide:plus" class="size-4" />
          Tambah Buku
        </button>
      </div>
    </div>

    <!-- LIST -->
    <div class="mt-5 grid grid-cols-1 xl:grid-cols-2 gap-3 md:gap-4">
      <div v-for="b in filtered" :key="b.id"
           class="group rounded-3xl border border-emerald-100/70 bg-white/90 dark:bg-neutral-800/90 dark:border-emerald-900/30 shadow-xs hover:shadow-lg transition-all hover:-translate-y-0.5 overflow-hidden backdrop-blur">
        <div class="flex">
          <!-- Cover -->
          <div class="relative w-24 shrink-0">
            <img v-if="b.coverUrl" :src="b.coverUrl" class="w-full h-full object-cover aspect-[3/4]" alt="Cover" />
            <div v-else class="w-full h-full aspect-[3/4] flex items-center justify-center bg-emerald-50 dark:bg-neutral-700">
              <Icon icon="lucide:book" class="size-7 600" />
            </div>
            <div class="absolute bottom-1 left-1">
              <span class="text-[10px] px-1.5 py-0.5 rounded-md ring-1"
                    :class="b.aktif !== false ? 'bg-emerald-100 700 ring-emerald-200 dark:bg-emerald-900/30 dark:300 dark:ring-emerald-900/40'
                                             : 'bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:ring-rose-900/40'">
                {{ b.aktif !== false ? 'Aktif' : 'Nonaktif' }}
              </span>
            </div>
          </div>

          <!-- Body -->
          <div class="p-3 w-full">
            <div class="flex flex-wrap items-start justify-between gap-2 w-full">
              <div class="min-w-0">
                <h3 class="font-semibold truncate leading-tight">{{ b.title }}</h3>
                <p class="text-xs text-gray-500 dark:text-neutral-400 truncate">
                  {{ b.author || '—' }} · {{ b.category }} <span v-if="b.year">· {{ b.year }}</span>
                  <span v-if="b.pages">· {{ b.pages }} hlm</span>
                </p>
                <div v-if="b.tags?.length" class="mt-1 flex flex-wrap gap-1">
                  <span v-for="t in b.tags" :key="t" class="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 700 ring-1 ring-emerald-100 dark:bg-emerald-900/20 dark:300 dark:ring-emerald-900/30">
                    #{{ t }}
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-1.5">
                <a v-if="b.pdfUrl" :href="b.pdfUrl" target="_blank" class="px-2 py-1.5 text-xs rounded-md border border-blue-200/60 700 hover:bg-blue-50 dark:border-blue-900/30 dark:300 dark:hover:bg-blue-900/20">
                  PDF
                </a>
                <button class="px-2 py-1.5 text-xs rounded-md border border-emerald-100/70 hover:bg-emerald-50 dark:border-neutral-700 dark:hover:bg-neutral-700" @click="openEdit(b)">Edit</button>
                <button class="px-2 py-1.5 text-xs rounded-md border border-rose-200/60 text-rose-600 hover:bg-rose-50 dark:border-rose-900/30 dark:hover:bg-rose-900/20" @click="askDelete(b)">Hapus</button>
              </div>
            </div>

            <p v-if="b.description" class="mt-2 text-[11px] text-gray-600 dark:text-neutral-300 line-clamp-2">{{ b.description }}</p>
          </div>
        </div>
      </div>

      <div v-if="!filtered.length" class="col-span-full p-6 text-sm text-gray-600 border border-dashed border-emerald-200 rounded-2xl bg-emerald-50/40 dark:bg-neutral-800 dark:text-neutral-400 dark:border-emerald-900/30">
        Belum ada data / tidak ditemukan.
      </div>
    </div>

    <!-- MODAL CREATE/EDIT -->
    <teleport to="body">
      <div v-if="modal.open" class="fixed inset-0 z-[90]">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-3xl rounded-3xl border border-emerald-100/70 bg-white/95 shadow-2xl ring-1 ring-black/5 dark:bg-neutral-800 dark:border-neutral-700">
            <div class="sticky top-0 z-10 p-4 border-b border-emerald-100/70 bg-white/90 backdrop-blur dark:bg-neutral-800/90 dark:border-neutral-700 flex items-center justify-between rounded-t-3xl">
              <h3 class="font-semibold">{{ modal.mode === 'create' ? 'Tambah Buku' : 'Edit Buku' }}</h3>
              <button class="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-neutral-700" @click="closeModal">
                <Icon icon="lucide:x" class="size-4" />
              </button>
            </div>

            <form class="p-4 space-y-5 max-h-[80vh] overflow-y-auto" @submit.prevent="save">
              <!-- File & Cover -->
              <div class="grid gap-3 sm:grid-cols-[auto,1fr]">
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Cover</label>
                  <div class="mt-2 flex items-start gap-3">
                    <div class="relative w-24 rounded-xl overflow-hidden border border-emerald-100/70 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900">
                      <div class="w-full aspect-[3/4]">
                        <img v-if="form.coverPreview" :src="form.coverPreview" class="w-full h-full object-cover" />
                        <img v-else-if="modal.mode==='edit' && form.initialCoverUrl && !form.removeCover" :src="form.initialCoverUrl" class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full flex items-center justify-center text-xs text-gray-400">Tidak ada cover</div>
                      </div>
                      <span v-if="modal.mode==='edit' && (form.coverPreview || form.initialCoverUrl)" class="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                        {{ form.coverPreview ? 'Baru' : (form.removeCover ? 'Akan dihapus' : 'Saat ini') }}
                      </span>
                    </div>

                    <div class="flex-1 flex flex-col gap-2">
                      <label class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-100/70 hover:bg-emerald-50 dark:border-neutral-700 dark:hover:bg-neutral-700 cursor-pointer w-fit">
                        <Icon icon="lucide:upload" class="size-4" />
                        <span class="text-sm">Pilih Cover</span>
                        <input type="file" accept="image/*" class="hidden" @change="onCoverInput" />
                      </label>

                      <div class="flex flex-wrap items-center gap-2">
                        <button v-if="form.coverPreview" type="button" class="px-3 py-1.5 rounded-xl border border-rose-200/60 text-rose-600 hover:bg-rose-50 dark:border-rose-900/30 dark:hover:bg-rose-900/20" @click="clearNewCover">
                          <Icon icon="lucide:trash-2" class="inline size-4 mr-1 -mt-0.5" /> Batalkan Cover
                        </button>

                        <button v-if="modal.mode==='edit' && !form.coverPreview && form.initialCoverUrl && !form.removeCover"
                                type="button"
                                class="px-3 py-1.5 rounded-xl border border-rose-200/60 text-rose-600 hover:bg-rose-50 dark:border-rose-900/30 dark:hover:bg-rose-900/20"
                                @click="modalDeleteCover.open=true">
                          <Icon icon="lucide:trash-2" class="inline size-4 mr-1 -mt-0.5" /> Hapus Cover
                        </button>
                        <span v-if="form.removeCover" class="text-xs text-rose-600">Cover akan dihapus saat disimpan</span>
                      </div>

                      <p class="text-[11px] text-gray-500 dark:text-neutral-400">Opsional. JPG/PNG, disarankan rasio 3:4.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div class="grid gap-2 sm:grid-cols-2">
                    <div class="sm:col-span-2">
                      <label class="text-xs text-gray-500 dark:text-neutral-400">Judul</label>
                      <input v-model.trim="form.title" required type="text" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                    </div>
                    <div>
                      <label class="text-xs text-gray-500 dark:text-neutral-400">Penulis</label>
                      <input v-model.trim="form.author" type="text" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label class="text-xs text-gray-500 dark:text-neutral-400">Kategori</label>
                      <select v-model="form.category" required class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm">
                        <option v-for="c in BOOK_CATEGORIES" :key="c" :value="c">{{ c }}</option>
                      </select>
                    </div>
                    <div>
                      <label class="text-xs text-gray-500 dark:text-neutral-400">Tahun</label>
                      <input v-model.number="form.year" type="number" min="0" max="9999" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label class="text-xs text-gray-500 dark:text-neutral-400">Halaman</label>
                      <input v-model.number="form.pages" type="number" min="0" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm" />
                    </div>
                    <div class="sm:col-span-2">
                      <label class="text-xs text-gray-500 dark:text-neutral-400">Tag (pisah dengan koma)</label>
                      <input v-model.trim="tagInput" @blur="applyTags" @keydown.enter.prevent="applyTags"
                             type="text" placeholder="contoh: fiqih, akhlak"
                             class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm" />
                      <div class="mt-2 flex flex-wrap gap-1">
                        <span v-for="t in form.tags" :key="t" class="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 700 ring-1 ring-emerald-100 dark:bg-emerald-900/20 dark:300 dark:ring-emerald-900/30">
                          #{{ t }}
                        </span>
                      </div>
                    </div>
                    <div class="sm:col-span-2">
                      <label class="text-xs text-gray-500 dark:text-neutral-400">Deskripsi</label>
                      <textarea v-model.trim="form.description" rows="3" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm" />
                    </div>
                    <div class="sm:col-span-2">
                      <label class="text-xs text-gray-500 dark:text-neutral-400">PDF</label>
                      <div class="mt-1 flex items-center gap-2">
                        <input v-model="form.pdfName" type="text" class="w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm opacity-70" placeholder="Belum dipilih" readonly />
                        <label class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-100/70 hover:bg-emerald-50 dark:border-neutral-700 dark:hover:bg-neutral-700 cursor-pointer w-fit">
                          <Icon icon="lucide:file-input" class="size-4" />
                          <span class="text-sm">Pilih PDF</span>
                          <input type="file" accept="application/pdf" class="hidden" @change="onPdfInput" />
                        </label>
                        <button v-if="modal.mode==='edit' && !form.pdfFile && form.initialPdfUrl && !form.removePdf"
                                type="button"
                                class="px-3 py-2 rounded-xl border border-rose-200/60 text-rose-600 hover:bg-rose-50 dark:border-rose-900/30 dark:hover:bg-rose-900/20 text-sm inline-flex items-center gap-1"
                                @click="modalDeletePdf.open=true">
                          <Icon icon="lucide:trash-2" class="size-4" /> Hapus PDF
                        </button>
                        <span v-if="form.removePdf" class="text-xs text-rose-600">PDF akan dihapus saat disimpan</span>
                      </div>
                      <p class="text-[11px] text-gray-500 dark:text-neutral-400">Wajib saat menambah buku. Opsional saat edit.</p>
                    </div>
                    <div class="sm:col-span-2">
                      <label class="inline-flex items-center gap-2">
                        <input type="checkbox" v-model="form.aktif" class="rounded border-emerald-200 600 focus:ring-emerald-500" />
                        Aktif
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-end pt-1">
                <button type="submit" class="px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 active:scale-[.98] transition-all">
                  <Icon v-if="saving" icon="ph:spinner" class="size-4 animate-spin" />
                  <span>{{ saving ? 'Menyimpan…' : (modal.mode==='create' ? 'Simpan' : 'Update') }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </teleport>

    <!-- MODAL: Konfirmasi Hapus Buku -->
    <teleport to="body">
      <div v-if="modalDelete.open" class="fixed inset-0 z-[95]">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeDelete()"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-md rounded-2xl border border-rose-200/60 bg-white/95 dark:bg-neutral-800 dark:border-rose-900/30 shadow-xl">
            <div class="p-4 border-b border-rose-200/60 dark:border-rose-900/30 flex items-center gap-2">
              <Icon icon="lucide:alert-triangle" class="size-5 text-rose-600" />
              <h3 class="font-semibold">Hapus Buku</h3>
            </div>
            <div class="p-4 text-sm">
              <p>Anda yakin ingin menghapus <span class="font-semibold">{{ modalDelete.title }}</span>? File PDF & cover juga akan dihapus.</p>
            </div>
            <div class="p-4 flex items-center justify-end gap-2">
              <button @click="closeDelete()" class="px-3 py-2 rounded-xl border dark:border-neutral-700">Batal</button>
              <button @click="confirmDelete()" class="px-3 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700">Hapus</button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- MODAL: Konfirmasi Hapus PDF -->
    <teleport to="body">
      <div v-if="modalDeletePdf.open" class="fixed inset-0 z-[95]">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="modalDeletePdf.open=false"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-md rounded-2xl border border-rose-200/60 bg-white/95 dark:bg-neutral-800 dark:border-rose-900/30 shadow-xl">
            <div class="p-4 border-b border-rose-200/60 dark:border-rose-900/30 flex items-center gap-2">
              <Icon icon="lucide:file" class="size-5 text-rose-600" />
              <h3 class="font-semibold">Hapus PDF</h3>
            </div>
            <div class="p-4 text-sm">
              <p>PDF akan dihapus saat Anda menekan <b>{{ modal.mode==='create' ? 'Simpan' : 'Update' }}</b>.</p>
            </div>
            <div class="p-4 flex items-center justify-end gap-2">
              <button @click="modalDeletePdf.open=false" class="px-3 py-2 rounded-xl border dark:border-neutral-700">Batal</button>
              <button @click="confirmDeletePdf()" class="px-3 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700">Hapus PDF</button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- MODAL: Konfirmasi Hapus Cover -->
    <teleport to="body">
      <div v-if="modalDeleteCover.open" class="fixed inset-0 z-[95]">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="modalDeleteCover.open=false"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-md rounded-2xl border border-rose-200/60 bg-white/95 dark:bg-neutral-800 dark:border-rose-900/30 shadow-xl">
            <div class="p-4 border-b border-rose-200/60 dark:border-rose-900/30 flex items-center gap-2">
              <Icon icon="lucide:image-off" class="size-5 text-rose-600" />
              <h3 class="font-semibold">Hapus Cover</h3>
            </div>
            <div class="p-4 text-sm">
              <p>Cover akan dihapus saat Anda menekan <b>{{ modal.mode==='create' ? 'Simpan' : 'Update' }}</b>.</p>
            </div>
            <div class="p-4 flex items-center justify-end gap-2">
              <button @click="modalDeleteCover.open=false" class="px-3 py-2 rounded-xl border dark:border-neutral-700">Batal</button>
              <button @click="confirmDeleteCover()" class="px-3 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700">Hapus Cover</button>
            </div>
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
import { Icon } from '@iconify/vue'
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { useBook, BOOK_CATEGORIES, type BookItem, type BookCategory } from '~/composables/data/useBook'

definePageMeta({ layout: 'app', layoutProps: { title: 'Buku / Kitab' }, ssr: false })

/** ===== useBook (list & CRUD) ===== */
const {
  filtered, q, fCategory, fAktif,
  subscribeAll, unbindList,
  createBook, updateBook, deleteBook,
  BOOKS_NODE
} = useBook()

/** ===== Toast sederhana ===== */
type Toast = { id: number; message: string; type?: 'success'|'error'|'info' }
const toasts = ref<Toast[]>([])
function toast(message: string, type: Toast['type']='success') {
  const id = Date.now() + Math.random()
  toasts.value.push({ id, message, type })
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 3200)
}

/** ===== Modal & Form ===== */
const modal = reactive<{ open:boolean; mode:'create'|'edit'; id?:string }>({ open:false, mode:'create', id: undefined })

type FormState = {
  title: string
  author: string
  category: BookCategory
  year: number | null
  pages: number | null
  tags: string[]
  description: string
  aktif: boolean
  // pdf
  pdfFile: File | null
  pdfName: string
  initialPdfUrl: string | null
  removePdf: boolean
  // cover
  coverFile: File | null
  coverPreview: string | null
  initialCoverUrl: string | null
  removeCover: boolean
}
const form = reactive<FormState>({
  title:'', author:'', category:'Buku', year:null, pages:null, tags:[], description:'', aktif:true,
  pdfFile:null, pdfName:'', initialPdfUrl:null, removePdf:false,
  coverFile:null, coverPreview:null, initialCoverUrl:null, removeCover:false
})
const tagInput = ref('')

function resetForm(){
  form.title=''; form.author=''; form.category='Buku'; form.year=null; form.pages=null; form.tags=[]; form.description=''; form.aktif=true
  form.pdfFile=null; form.pdfName=''; form.initialPdfUrl=null; form.removePdf=false
  if(form.coverPreview) URL.revokeObjectURL(form.coverPreview)
  form.coverFile=null; form.coverPreview=null; form.initialCoverUrl=null; form.removeCover=false
  tagInput.value = ''
}

function openCreate(){ resetForm(); modal.mode='create'; modal.open=true; modal.id=undefined }
function openEdit(b: BookItem){
  resetForm(); modal.mode='edit'; modal.open=true; modal.id=b.id
  form.title=b.title; form.author=b.author || ''; form.category=b.category; form.year=(b.year as any) ?? null; form.pages=(b.pages as any) ?? null
  form.tags=[...(b.tags || [])]; form.description=b.description || ''; form.aktif=b.aktif !== false
  form.initialPdfUrl=b.pdfUrl || null
  form.initialCoverUrl=b.coverUrl || null
}
function closeModal(){ if(form.coverPreview) URL.revokeObjectURL(form.coverPreview); modal.open=false }

/** Tag helper */
function applyTags(){
  if(!tagInput.value.trim()) return
  const parts = tagInput.value.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
  const set = new Set([...(form.tags||[]), ...parts])
  form.tags = Array.from(set)
  tagInput.value = ''
}

/** File handlers */
function onPdfInput(ev: Event){
  const file = (ev.target as HTMLInputElement).files?.[0]
  if(!file) return
  if(file.type !== 'application/pdf') return toast('Hanya menerima PDF.', 'error')
  form.pdfFile = file
  form.pdfName = file.name
  form.removePdf = false
}
function onCoverInput(ev: Event){
  const file = (ev.target as HTMLInputElement).files?.[0]
  if(!file) return
  if(form.coverPreview) URL.revokeObjectURL(form.coverPreview)
  form.coverFile = file
  form.coverPreview = URL.createObjectURL(file)
  form.removeCover = false
}
function clearNewCover(){ if(form.coverPreview) URL.revokeObjectURL(form.coverPreview); form.coverFile=null; form.coverPreview=null }

/** Modal hapus PDF/Cover (tanpa alert/confirm) */
const modalDeletePdf = reactive({ open:false })
const modalDeleteCover = reactive({ open:false })
function confirmDeletePdf(){ form.removePdf = true; form.pdfFile = null; form.pdfName=''; modalDeletePdf.open=false }
function confirmDeleteCover(){ form.removeCover = true; form.coverFile = null; form.coverPreview=null; modalDeleteCover.open=false }

/** Hapus Buku */
const modalDelete = reactive<{open:boolean; id?:string; title?:string}>({ open:false })
function askDelete(b: BookItem){ modalDelete.open=true; modalDelete.id=b.id; modalDelete.title=b.title }
function closeDelete(){ modalDelete.open=false; modalDelete.id=undefined; modalDelete.title=undefined }
async function confirmDelete(){
  if(!modalDelete.id) return
  try {
    await deleteBook(modalDelete.id)
    toast('Buku dihapus.')
  } catch (e) {
    console.error(e)
    toast('Gagal menghapus buku.', 'error')
  } finally {
    closeDelete()
  }
}

const saving = ref(false)
async function save(){
  if(saving.value) return
  try{
    saving.value = true

    if(modal.mode==='create'){
      if(!form.title) return toast('Judul wajib diisi.', 'error')
      // PDF wajib saat create (kalau mau dibuat wajib)
      if(!form.pdfFile) return toast('Silakan pilih PDF.', 'error')

      await createBook({
        title: form.title,
        author: form.author || undefined,
        category: form.category,
        year: form.year ?? null,
        pages: form.pages ?? null,
        tags: form.tags,
        description: form.description || '',
        aktif: form.aktif,
        pdfFile: form.pdfFile || undefined,
        coverFile: form.coverFile || undefined
      })
      toast('Buku ditambahkan.')
    } else if(modal.mode==='edit' && modal.id){
      await updateBook(modal.id, {
        title: form.title,
        author: form.author || undefined,
        category: form.category,
        year: form.year ?? null,
        pages: form.pages ?? null,
        tags: form.tags,
        description: form.description || '',
        aktif: form.aktif,
        pdfFile: form.pdfFile || undefined,
        coverFile: form.coverFile || undefined,
        removePdf: form.removePdf,
        removeCover: form.removeCover
      })
      toast('Buku diperbarui.')
    }

    closeModal()
  } catch (e) {
    console.error(e)
    toast('Gagal menyimpan data.', 'error')
  } finally {
    saving.value = false
  }
}

/** mount */
onMounted(() => { subscribeAll() })
onUnmounted(() => { unbindList() })
</script>
