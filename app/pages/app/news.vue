<!-- pages/app/news.vue -->
<template>
  <section class="p-6 space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold">Manajemen Berita</h1>
        <p class="text-sm text-gray-500 dark:text-neutral-400">Kelola artikel dengan editor Tiptap.</p>
      </div>
      <div class="flex items-center gap-2">
        <input v-model="search" type="text" placeholder="Cari judul/tag…"
               class="hidden sm:block text-sm px-3 py-2 rounded border border-gray-200 dark:border-neutral-700 dark:bg-neutral-900" />
        <button @click="openCreate" class="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">
          + Tulis Artikel
        </button>
      </div>
    </div>

    <!-- Info/Error -->
    <div v-if="error" class="p-3 rounded border border-rose-200 bg-rose-50 text-rose-700 text-sm dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300">
      {{ error }}
    </div>
    <div v-if="pending" class="text-sm text-gray-500">Memuat berita…</div>

    <!-- Empty -->
    <div v-if="!pending && filtered.length === 0" class="p-10 text-center rounded-2xl border border-dashed border-gray-300 dark:border-neutral-700">
      <p class="text-gray-700 dark:text-neutral-300">Data berita kosong.</p>
      <button @click="openCreate" class="mt-4 text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">+ Tulis Artikel</button>
    </div>

    <!-- Grid Cards -->
    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <article v-for="n in paged" :key="n.id" class="group rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60">
        <div class="relative h-40 bg-gray-100 dark:bg-neutral-700">
          <img v-if="n.cover" :src="n.cover" :alt="n.title" class="w-full h-full object-cover" />
          <div class="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-full bg-black/55 text-white">
            {{ n.category || 'Umum' }}
          </div>
        </div>
        <div class="p-4 space-y-2">
          <h3 class="font-semibold text-gray-900 dark:text-white line-clamp-2">{{ n.title }}</h3>
          <p class="text-sm text-gray-600 dark:text-neutral-300 line-clamp-3">{{ n.excerpt }}</p>
          <div class="text-[12px] text-gray-500 dark:text-neutral-400 flex items-center justify-between">
            <span>{{ formatDate(n.publishedAt) }} · {{ n.readTime }} min</span>
            <div class="hidden lg:flex flex-wrap gap-1">
              <span v-for="t in n.tags" :key="t" class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-neutral-700">#{{ t }}</span>
            </div>
          </div>
          <div class="pt-2 flex items-center gap-2">
            <button @click="openEdit(n)" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700">Edit</button>
            <button @click="openDelete(n)" class="text-xs px-2 py-1 rounded border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-900/20">Hapus</button>
            <NuxtLink :to="`/news?slug=${encodeURIComponent(n.slug)}`" class="ml-auto text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700">Lihat</NuxtLink>
          </div>
        </div>
      </article>
    </div>

    <!-- Load more -->
    <div v-if="hasMore && !pending" class="mt-6 text-center">
      <button @click="page++" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm hover:bg-blue-700">
        Muat Lainnya
      </button>
    </div>

    <!-- FORM MODAL -->
    <ModalShell v-model="showForm" :title="formMode==='create' ? 'Tulis Artikel' : 'Ubah Artikel'" size="fullscreen">
      <form class="space-y-4" @submit.prevent="submit">
        <!-- meta -->
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Judul</label>
            <input v-model.trim="form.title" required class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Kategori</label>
            <input v-model.trim="form.category" placeholder="Kegiatan / Pengumuman / ..." class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Tag (pisah koma)</label>
            <input v-model.trim="form.tagsInput" placeholder="santri, tahfidz, lomba" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Tanggal Terbit</label>
            <input v-model="publishedAtLocal" type="datetime-local" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
        </div>

        <div>
          <label class="text-xs text-gray-600 dark:text-neutral-300">Ringkasan (excerpt)</label>
          <textarea v-model.trim="form.excerpt" rows="2" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"></textarea>
        </div>

        <!-- Cover uploader + Editor -->
        <div class="grid sm:grid-cols-[180px,1fr] gap-4 items-start">
          <!-- cover -->
          <div class="space-y-2">
            <div class="w-44 h-32 border border-gray-200 dark:border-neutral-700 rounded overflow-hidden bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
              <img v-if="coverPreview" :src="coverPreview" alt="Cover preview" class="w-full h-full object-cover" />
              <span v-else class="text-xs text-gray-400">Tidak ada cover</span>
            </div>
            <input ref="coverInput" type="file" accept="image/*" class="hidden" @change="onPickCover" />
            <div class="flex gap-2">
              <button type="button" @click="triggerPickCover" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 text-xs">
                Pilih Cover
              </button>
              <button type="button" v-if="form.cover" @click="clearCover" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 text-xs">
                Hapus Cover
              </button>
            </div>
            <p v-if="uploading" class="text-xs text-gray-500">Mengunggah cover…</p>
          </div>

          <!-- editor -->
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300 mb-1 block">Konten</label>

            <!-- Toolbar (fitur dari StarterKit) -->
            <div v-if="editor != null" class="flex flex-wrap gap-1 mb-2 text-[13px]">
              <div class="flex gap-1">
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().setParagraph().run())" :class="isActive('paragraph')">P</button>
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().toggleHeading({ level: 2 }).run())" :class="isActive('heading', { level: 2 })">H2</button>
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().toggleHeading({ level: 3 }).run())" :class="isActive('heading', { level: 3 })">H3</button>
              </div>
              <!-- marks -->
              <div class="flex gap-1">
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().toggleBold().run())" :class="isActive('bold')"><b>B</b></button>
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().toggleItalic().run())" :class="isActive('italic')"><i>I</i></button>
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().toggleStrike().run())" :class="isActive('strike')"><s>S</s></button>
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().toggleCode().run())" :class="isActive('code')">{x}</button>
              </div>
              <!-- lists & block -->
              <div class="flex gap-1">
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().toggleBulletList().run())" :class="isActive('bulletList')">• List</button>
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().toggleOrderedList().run())" :class="isActive('orderedList')">1. List</button>
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().toggleBlockquote().run())" :class="isActive('blockquote')">❝ Quote</button>
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().toggleCodeBlock().run())" :class="isActive('codeBlock')">{ }</button>
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().setHorizontalRule().run())">— HR</button>
              </div>
              <!-- history -->
              <div class="flex gap-1">
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().undo().run())">Undo</button>
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().redo().run())">Redo</button>
              </div>
            </div>

            <!-- Editor view -->
            <ClientOnly>
              <div class="rounded border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
                <EditorContent :editor="editor" class="prose dark:prose-invert max-w-none p-3 min-h-[280px] focus:outline-none" />
              </div>
            </ClientOnly>
          </div>
        </div>

        <p v-if="formError" class="text-sm text-rose-600">{{ formError }}</p>
      </form>

      <template #footer>
        <button @click="showForm=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="saving || uploading" @click="submit" class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
          {{ saving ? 'Menyimpan…' : (formMode==='create' ? 'Terbitkan' : 'Update') }}
        </button>
      </template>
    </ModalShell>

    <!-- Delete Modal -->
    <ModalShell v-model="showDelete" title="Hapus Artikel">
      <p class="text-sm text-gray-700 dark:text-neutral-200">
        Hapus artikel <strong>{{ current?.title }}</strong>? Tindakan ini tidak dapat dibatalkan.
      </p>
      <template #footer>
        <button @click="showDelete=false" class="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="deleting" @click="confirmDelete" class="px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60">
          {{ deleting ? 'Menghapus…' : 'Hapus' }}
        </button>
      </template>
    </ModalShell>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick, shallowRef } from 'vue'
import ModalShell from '~/components/widget/ModalShell.vue'
import { useNews, type NewsItem } from '~/composables/data/useNews'

import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

definePageMeta({ layout: 'app', layoutProps: { title: 'Berita Informasi' } })

const { pending, error, items, loadNews, createNews, updateNews, deleteNews } = useNews()
onMounted(loadNews)

const search = ref('')
const page = ref(1)
const pageSize = 12
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return items.value
  return items.value.filter(n => {
    const hay = [n.title, n.excerpt, ...(n.tags||[])].join(' ').toLowerCase()
    return hay.includes(q)
  })
})
const paged = computed(() => filtered.value.slice(0, page.value * pageSize))
const hasMore = computed(() => paged.value.length < filtered.value.length)
function formatDate(ts:number) {
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(ts)
}

const showForm = ref(false)
const formMode = ref<'create'|'edit'>('create')
const saving = ref(false)
const formError = ref<string|null>(null)
const current = ref<NewsItem|null>(null)

const editor = shallowRef<Editor | null>(null)
function ensureEditor() {
  if (editor.value) return
  editor.value = new Editor({
    content: '<p></p>',
    extensions: [StarterKit.configure({ heading: { levels: [2,3] } })],
    editorProps: { attributes: { class: 'outline-none' } }
  })
}
onBeforeUnmount(() => editor.value?.destroy())

import { ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage'
const { $storage } = useNuxtApp()
const coverInput = ref<HTMLInputElement|null>(null)
const coverFile = shallowRef<File|null>(null)
const coverPreview = ref<string>('')
const uploading = ref(false)

/* Form data */
const form = reactive({
  title: '',
  category: '',
  tagsInput: '',
  tagsArr: [] as string[],
  cover: '',
  excerpt: '',
  publishedAt: Date.now()
})

const publishedAtLocal = computed({
  get() {
    const d = new Date(form.publishedAt || Date.now())
    const pad = (n:number)=> String(n).padStart(2,'0')
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  },
  set(v: string) {
    const t = v ? new Date(v).getTime() : Date.now()
    if (!Number.isNaN(t)) form.publishedAt = t
  }
})

function resetForm() {
  form.title = ''
  form.category = ''
  form.tagsInput = ''
  form.tagsArr = []
  form.cover = ''
  form.excerpt = ''
  form.publishedAt = Date.now()
  coverFile.value = null
  coverPreview.value = ''
  formError.value = null
  ensureEditor()
  editor.value!.commands.setContent('<p></p>')
}
function setEditorFromNews(n?: NewsItem) {
  ensureEditor()
  const c:any = (n as any)?.content
  if (c?.kind === 'tiptap' && c.json) editor.value!.commands.setContent(c.json)
  else if (c?.kind === 'tiptap' && c.html) editor.value!.commands.setContent(c.html)
  else if (typeof c === 'string' && c.trim().startsWith('<')) editor.value!.commands.setContent(c)
  else editor.value!.commands.setContent('<p></p>')
}

function openCreate() {
  formMode.value = 'create'
  resetForm()
  showForm.value = true
  nextTick(() => setEditorFromNews())
}
function openEdit(n: NewsItem) {
  formMode.value = 'edit'
  current.value = n
  form.title = n.title
  form.category = n.category || ''
  form.tagsArr = n.tags || []
  form.tagsInput = form.tagsArr.join(', ')
  form.cover = n.cover || ''
  form.excerpt = n.excerpt || ''
  form.publishedAt = n.publishedAt || Date.now()
  coverFile.value = null
  coverPreview.value = ''
  showForm.value = true
  nextTick(() => setEditorFromNews(n))
}
function triggerPickCover() { coverInput.value?.click() }
function onPickCover(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] || null
  coverFile.value = file
  coverPreview.value = file ? URL.createObjectURL(file) : ''
}
function clearCover() {
  coverFile.value = null
  coverPreview.value = ''
  form.cover = ''
}
async function uploadCoverIfAny(): Promise<string> {
  if (!coverFile.value) return form.cover || ''
  uploading.value = true
  try {
    const ext = coverFile.value.name.split('.').pop() || 'jpg'
    const path = `alberr/news/covers/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
    const fileRef = sRef($storage, path)
    await uploadBytes(fileRef, coverFile.value)
    const url = await getDownloadURL(fileRef)
    form.cover = url
    return url
  } finally {
    uploading.value = false
  }
}

function chain(run: () => boolean) { run() }
function isActive(name: string, attrs?: any) { return editor.value?.isActive(name, attrs) ? 'bg-blue-600 text-white' : '' }

async function submit() {
  if (!form.title.trim()) { formError.value = 'Judul wajib diisi.'; return }
  saving.value = true
  try {
    form.tagsArr = form.tagsInput.split(',').map(s => s.trim()).filter(Boolean)
    await uploadCoverIfAny()

    ensureEditor()
    const json = editor.value!.getJSON()
    const html = editor.value!.getHTML()
    const content = { kind: 'tiptap', json, html }

    if (formMode.value === 'create') {
      await createNews({
        title: form.title,
        excerpt: form.excerpt,
        cover: form.cover,
        category: form.category,
        tags: form.tagsArr,
        publishedAt: form.publishedAt,
        content
      })
    } else if (current.value) {
      await updateNews(current.value.id, {
        title: form.title,
        excerpt: form.excerpt,
        cover: form.cover,
        category: form.category,
        tags: form.tagsArr,
        publishedAt: form.publishedAt,
        content
      })
    }
    showForm.value = false
  } catch (e:any) {
    formError.value = e?.message ?? 'Gagal menyimpan artikel'
  } finally {
    saving.value = false
  }
}

const showDelete = ref(false)
const deleting = ref(false)
function openDelete(n: NewsItem) {
  current.value = n
  showDelete.value = true
}
async function confirmDelete() {
  if (!current.value) return
  deleting.value = true
  try {
    await deleteNews(current.value.id)
    showDelete.value = false
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped lang="postcss">
.btn-tt {
  @apply px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800;
}
</style>
