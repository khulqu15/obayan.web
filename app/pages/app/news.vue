<!-- pages/app/news.vue -->
<template>
  <section class="p-6 space-y-4">
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

    <div class="pt-1">
      <nav class="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50 text-sm dark:bg-neutral-900 dark:border-neutral-700">
        <button type="button" :class="tabBtn('articles')" @click="activeTab='articles'">Artikel</button>
        <button type="button" :class="tabBtn('history')"  @click="activeTab='history'">History</button>
      </nav>
    </div>

    <div v-if="error && activeTab==='articles'" class="p-3 rounded border border-rose-200 bg-rose-50 text-rose-700 text-sm dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300">
      {{ error }}
    </div>
    <div v-if="pending && activeTab==='articles'" class="text-sm text-gray-500">Memuat berita…</div>

    <div v-if="!pending && filtered.length === 0" class="p-10 text-center rounded-2xl border border-dashed border-gray-300 dark:border-neutral-700">
      <div v-show="activeTab==='articles' && !pending && filtered.length === 0" class="p-10 text-center rounded-2xl border border-dashed border-gray-300 dark:border-neutral-700">
        <p class="text-gray-700 dark:text-neutral-300">Data berita kosong.</p>
        <button @click="openCreate" class="mt-4 text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">+ Tulis Artikel</button>
      </div>
    </div>

    <div v-else>
      <div v-show="activeTab==='articles' && filtered.length > 0" class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
            <div class="flex items-center gap-2 mt-1">
              <img
                v-if="n.author?.avatar"
                :src="n.author.avatar"
                alt="author"
                class="size-6 rounded-full object-cover border border-gray-200 dark:border-neutral-700"
              />
              <div
                v-else
                class="size-6 rounded-full bg-gray-200 text-gray-700 dark:bg-neutral-700 dark:text-neutral-200 grid place-items-center text-[10px] font-semibold"
                aria-hidden="true"
              >
                {{ initials(n.author?.name || 'Admin Alberr') }}
              </div>
              <span class="text-[12px] text-gray-600 dark:text-neutral-300 truncate">
                oleh {{ n.author?.name || 'CakAdmin' }}
              </span>
            </div>
            <div class="pt-2 flex items-center gap-2">
              <button @click="openEdit(n)" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700">Edit</button>
              <button @click="openDelete(n)" class="text-xs px-2 py-1 rounded border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-900/20">Hapus</button>
              <NuxtLink :to="`/news?slug=${encodeURIComponent(n.slug)}`" class="ml-auto text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700">Lihat</NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div v-if="hasMore && !pending" class="mt-6 text-center">
      <div v-if="activeTab==='articles' && hasMore && !pending" class="mt-6 text-center">
        <button @click="page++" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm hover:bg-blue-700">
          Muat Lainnya
        </button>
      </div>
    </div>

    <div v-show="activeTab==='history'" class="space-y-3">
      <div class="flex items-center gap-2">
        <input v-model="searchHist" type="text" placeholder="Cari author/judul/kategori/aksi/slug/id…"
               class="text-sm px-3 py-2 rounded border border-gray-200 dark:border-neutral-700 dark:bg-neutral-900 w-full sm:w-96" />
      </div>
  
      <div class="rounded-2xl border border-gray-200 dark:border-neutral-700 overflow-auto bg-white dark:bg-neutral-900">
        <table class="min-w-[900px] w-full text-sm">
          <thead class="bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300">
            <tr>
              <th class="text-left p-3">Waktu</th>
              <th class="text-left p-3">Aksi</th>
              <th class="text-left p-3">Judul</th>
              <th class="text-left p-3">Kategori</th>
              <th class="text-left p-3">Author</th>
              <th class="text-left p-3">News ID / Slug</th>
              <th class="text-left p-3">Tags</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in pagedHist" :key="e.id" class="border-t border-gray-100 dark:border-neutral-800">
              <td class="p-3 whitespace-nowrap">{{ formatDateTime(e.at) }}</td>
              <td class="p-3">
                <span :class="{
                  'px-2 py-0.5 rounded text-[12px] bg-emerald-100 dark:bg-emerald-900/20': e.action==='create',
                  'px-2 py-0.5 rounded text-[12px] bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300': e.action==='update',
                  'px-2 py-0.5 rounded text-[12px] bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300': e.action==='delete'
                }">{{ e.action }}</span>
              </td>
              <td class="p-3">{{ e.meta.title || '—' }}</td>
              <td class="p-3">{{ e.meta.category || '—' }}</td>
              <td class="p-3">
                <div class="leading-tight">
                  <div class="font-medium truncate">{{ e.author.name || '—' }}</div>
                  <div class="text-[12px] text-gray-500 dark:text-neutral-400 truncate">
                    {{ e.author.email || '—' }} • {{ e.author.role || '—' }} • <span class="text-gray-400">UID:</span> {{ e.author.uid || '—' }}
                  </div>
                </div>
              </td>
              <td class="p-3">
                <div class="leading-tight">
                  <div class="truncate">{{ e.newsId || '—' }}</div>
                  <div class="text-[12px] text-gray-500 dark:text-neutral-400 truncate">{{ e.meta.slug || '—' }}</div>
                </div>
              </td>
              <td class="p-3">
                <div class="flex flex-wrap gap-1">
                  <span v-for="t in (e.meta.tags||[])" :key="t" class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-neutral-800 text-[12px]">#{{ t }}</span>
                </div>
              </td>
            </tr>
            <tr v-if="pagedHist.length===0">
              <td colspan="7" class="p-6 text-center text-gray-500 dark:text-neutral-400">Belum ada riwayat.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="hasMoreHist" class="text-center">
        <button @click="pageHist++" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm hover:bg-blue-700">
          Muat Riwayat Lainnya
        </button>
      </div>
    </div>
    <ModalShell v-model="showForm" :title="formMode==='create' ? 'Tulis Artikel' : 'Ubah Artikel'" size="fullscreen">
      <form class="space-y-4" @submit.prevent="submit">
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

        <div class="grid sm:grid-cols-[180px,1fr] gap-4 items-start">
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

          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300 mb-1 block">Konten</label>
            <div v-if="editor != null" class="flex flex-wrap gap-1 mb-2 text-[13px]">
              <div class="flex gap-1">
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().setParagraph().run())" :class="isActive('paragraph')">P</button>
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().toggleHeading({ level: 2 }).run())" :class="isActive('heading', { level: 2 })">H2</button>
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().toggleHeading({ level: 3 }).run())" :class="isActive('heading', { level: 3 })">H3</button>
              </div>
              <div class="flex gap-1">
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().toggleBold().run())" :class="isActive('bold')"><b>B</b></button>
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().toggleItalic().run())" :class="isActive('italic')"><i>I</i></button>
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().toggleStrike().run())" :class="isActive('strike')"><s>S</s></button>
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().toggleCode().run())" :class="isActive('code')">{x}</button>
              </div>
              <div class="flex gap-1">
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().toggleBulletList().run())" :class="isActive('bulletList')">• List</button>
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().toggleOrderedList().run())" :class="isActive('orderedList')">1. List</button>
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().toggleBlockquote().run())" :class="isActive('blockquote')">❝ Quote</button>
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().toggleCodeBlock().run())" :class="isActive('codeBlock')">{ }</button>
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().setHorizontalRule().run())">— HR</button>
              </div>
              <div class="flex gap-1">
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().undo().run())">Undo</button>
                <button class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 focus:outline-hidden focus:border-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:focus:border-blue-600" @click.prevent="chain(() => editor.chain().focus().redo().run())">Redo</button>
              </div>
            </div>

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
import { useNuxtApp } from '#app'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { push, ref as dbRef, onValue, off } from 'firebase/database'

definePageMeta({ layout: 'app', layoutProps: { title: 'Berita Informasi' } })

const { pending, error, items, loadNews, createNews, updateNews, deleteNews } = useNews()
onMounted(loadNews)

const activeTab = ref<'articles'|'history'>('articles')
function tabBtn(t:'articles'|'history') {
  return `px-3 py-1.5 rounded-md ${
    activeTab.value===t
      ? 'bg-white text-gray-900 dark:bg-neutral-200'
      : 'text-gray-600 hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white'
  }`
}

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

const { $realtimeDb } = useNuxtApp() as any
const sessionUser = useState<any>('sessionUser', () => null)

const currentAuthor = computed(() => ({
  uid: sessionUser.value?.uid || '-',
  name: sessionUser.value?.name || sessionUser.value?.displayName || 'Unknown',
  email: sessionUser.value?.email || '-',
  role: sessionUser.value?.role || '-',
  avatar: sessionUser.value?.avatar || sessionUser.value?.photoURL || ''
}))

function initials(name: string) {
  if (!name) return '?'
  return name
    .trim()
    .split(/\s+/)
    .map(s => s[0] || '')
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

type NewsAction = 'create' | 'update' | 'delete'
async function logNews(action: NewsAction, newsId: string | null, payload: Partial<NewsItem>) {
  try {
    const author = {
      uid: sessionUser.value?.uid || '-',
      name: sessionUser.value?.name || sessionUser.value?.displayName || 'Unknown',
      email: sessionUser.value?.email || '-',
      role: sessionUser.value?.role || '-',
    }
    const entry = {
      action,
      newsId: newsId || null,
      author,
      at: Date.now(),
      meta: {
        title: payload.title || '',
        category: payload.category || '',
        slug: (payload as any)?.slug || '',
        tags: payload.tags || [],
      },
    }
    const path = newsId ? `alberr/news_history/${newsId}` : `alberr/news_history/_general`
    await push(dbRef($realtimeDb, path), entry)
  } catch (e) {
    console.error('logNews failed', e)
  }
}

type NewsLog = {
  id: string
  newsId: string|null
  action: 'create'|'update'|'delete'
  at: number
  author: { uid:string; name:string; email:string; role:string }
  meta: { title:string; category:string; slug?:string; tags?:string[] }
}
const history = ref<NewsLog[]>([])
const searchHist = ref('')
let _histRef: any = null
let _histCB: any = null

onMounted(() => {
  _histRef = dbRef($realtimeDb, 'alberr/news_history')
  _histCB = (snap:any) => {
    const val = snap.val() || {}
    const arr: NewsLog[] = []
    for (const k of Object.keys(val)) {
      const node = val[k] || {}
      for (const logId of Object.keys(node)) {
        const e = node[logId]
        arr.push({
          id: logId,
          newsId: k === '_general' ? null : k,
          action: e.action, at: e.at,
          author: e.author || { uid:'-', name:'Unknown', email:'-', role:'-' },
          meta: e.meta || { title:'', category:'', slug:'', tags:[] }
        })
      }
    }
    history.value = arr.sort((a,b)=> b.at - a.at)
  }
  onValue(_histRef, _histCB)
})
onBeforeUnmount(() => { try { if (_histRef) off(_histRef) } catch {} })

const historyFiltered = computed(() => {
  const q = searchHist.value.trim().toLowerCase()
  if (!q) return history.value
  return history.value.filter(e => {
    const hay = [
      e.action, e.newsId || '', e.author.name, e.author.email, e.author.role,
      e.meta.title, e.meta.category, e.meta.slug || '', ...(e.meta.tags || [])
    ].join(' ').toLowerCase()
    return hay.includes(q)
  })
})
const pageHist = ref(1)
const pageSizeHist = 25
const pagedHist = computed(() => historyFiltered.value.slice(0, pageHist.value * pageSizeHist))
const hasMoreHist = computed(() => pagedHist.value.length < historyFiltered.value.length)

function formatDateTime(ts:number) {
  return new Intl.DateTimeFormat('id-ID', { dateStyle:'medium', timeStyle:'short' }).format(ts)
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

const { $storage } = useNuxtApp()
const coverInput = ref<HTMLInputElement|null>(null)
const coverFile = shallowRef<File|null>(null)
const coverPreview = ref<string>('')
const uploading = ref(false)

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
      const created: any = await createNews({
        title: form.title,
        excerpt: form.excerpt,
        cover: form.cover,
        category: form.category,
        tags: form.tagsArr,
        publishedAt: form.publishedAt,
        author: currentAuthor.value,
        content,
      })
      let createdId = (created && (created.id || created.key || created._id)) ? (created.id || created.key || created._id) : ''
      if (!createdId) {
        await loadNews()
        const guess = items.value.find(n => n.title === form.title && n.publishedAt === form.publishedAt)
        createdId = guess?.id || ''
        await logNews('create', createdId || null, { ...guess, title: form.title, category: form.category, tags: form.tagsArr })
      } else await logNews('create', createdId, { title: form.title, category: form.category, tags: form.tagsArr })
    } else if (current.value) {
      await updateNews(current.value.id, {
        title: form.title,
        excerpt: form.excerpt,
        cover: form.cover,
        category: form.category,
        tags: form.tagsArr,
        publishedAt: form.publishedAt,
        updatedBy: currentAuthor.value,
        content
      })
      await logNews('update', current.value.id, {
        title: form.title,
        category: form.category,
        tags: form.tagsArr,
        slug: current.value.slug
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
    const target = current.value
    await deleteNews(target.id)
    await logNews('delete', target.id, {
      title: target.title,
      category: target.category,
      tags: target.tags,
      slug: target.slug
    })
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
