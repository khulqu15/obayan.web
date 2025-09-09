<template>
  <div>
    <div class="flex flex-wrap gap-1 border-b border-gray-200 dark:border-neutral-800">
      <button v-for="t in tabs" :key="t"
              class="px-3 py-2 text-xs rounded-t-lg"
              :class="active===t ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800'"
              @click="active = t">
        {{ t }}
      </button>
      <div class="ml-auto flex gap-2 mb-2">
        <button class="px-2 py-1 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700" @click="resetDefault">Isi Default</button>
        <button class="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700" @click="save">Simpan</button>
      </div>
    </div>

    <!-- ====== TAB: Heading ====== -->
    <div v-show="active==='Heading'" class="mt-3 grid gap-3">
      <div>
        <label class="text-xs text-gray-500">Judul</label>
        <input v-model.trim="form.headingTitle" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
      </div>
      <div>
        <label class="text-xs text-gray-500">Deskripsi</label>
        <textarea v-model.trim="form.headingDesc" rows="3" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"></textarea>
      </div>
    </div>

    <!-- ====== TAB: Featured (manual/custom) ====== -->
    <div v-show="active==='Featured'" class="mt-3 grid sm:grid-cols-2 gap-3">
      <div class="sm:col-span-2">
        <label class="text-xs text-gray-500">Judul Featured</label>
        <input v-model.trim="form.featured.title" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
      </div>
      <div>
        <label class="text-xs text-gray-500">Kategori</label>
        <input v-model.trim="form.featured.category" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
      </div>
      <div>
        <label class="text-xs text-gray-500">Tanggal (teks)</label>
        <input v-model.trim="form.featured.dateText" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
      </div>
      <div class="sm:col-span-2">
        <label class="text-xs text-gray-500">Tags (pisahkan koma)</label>
        <input :value="featuredTagsText" @input="onFeaturedTagsInput(($event.target as HTMLInputElement).value)"
          class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" placeholder="tahfidz, murajaah, edtech">
      </div>
      <div class="sm:col-span-2">
        <label class="text-xs text-gray-500">Link</label>
        <input v-model.trim="(form.featured.href as any)" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" placeholder="#">
      </div>
      <div class="sm:col-span-2">
        <label class="text-xs text-gray-500">Cover Featured</label>
        <div class="mt-1">
          <input v-model.trim="form.featured.cover" placeholder="URL gambar atau upload…" class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
          <input type="file" accept="image/*" class="text-xs w-full mt-1" @change="(e:any)=>upload(e,'featured.cover')">
        </div>
        <div class="mt-2">
          <img v-if="form.featured.cover" :src="form.featured.cover" class="h-28 w-full object-cover rounded-lg border dark:border-neutral-800" alt="featured">
        </div>
        <p v-if="progress['featured.cover']!=null" class="text-[11px] mt-1">Upload: {{ progress['featured.cover'] }}%</p>
      </div>
    </div>

    <!-- ====== TAB: Posts (manual/custom) ====== -->
    <div v-show="active==='Posts'" class="mt-3 space-y-4">
      <div v-for="(p, i) in form.posts" :key="p.id" class="rounded-lg border border-gray-200 dark:border-neutral-800 p-3">
        <div class="grid sm:grid-cols-3 gap-3">
          <div class="sm:col-span-3">
            <label class="text-xs text-gray-500">Judul</label>
            <input v-model.trim="form.posts[i].title" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
          </div>
          <div>
            <label class="text-xs text-gray-500">Kategori</label>
            <input v-model.trim="form.posts[i].category" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
          </div>
          <div>
            <label class="text-xs text-gray-500">Tanggal (teks)</label>
            <input v-model.trim="form.posts[i].dateText" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
          </div>
          <div>
            <label class="text-xs text-gray-500">Durasi baca (menit)</label>
            <input type="number" min="1" v-model.number="form.posts[i].readTime" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
          </div>
          <div class="sm:col-span-3">
            <label class="text-xs text-gray-500">Excerpt</label>
            <input v-model.trim="form.posts[i].excerpt" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
          </div>
          <div class="sm:col-span-2">
            <label class="text-xs text-gray-500">Cover</label>
            <div class="mt-1">
              <input v-model.trim="form.posts[i].cover" placeholder="URL gambar atau upload…" class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
              <input type="file" accept="image/*" class="text-xs w-full mt-1" @change="(e:any)=>upload(e, `posts.${i}.cover`)">
            </div>
            <div class="mt-2">
              <img v-if="form.posts[i].cover" :src="form.posts[i].cover" class="h-24 w-full object-cover rounded-lg border dark:border-neutral-800" alt="">
            </div>
            <p v-if="progress[`posts.${i}.cover`]!=null" class="text-[11px] mt-1">Upload: {{ progress[`posts.${i}.cover`] }}%</p>
          </div>
          <div>
            <label class="text-xs text-gray-500">Tags (koma)</label>
            <input :value="getTagsText(i)" @input="setTagsText(i, ($event.target as HTMLInputElement).value)"
                   class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" placeholder="tag1, tag2">
          </div>
          <div class="sm:col-span-3">
            <label class="text-xs text-gray-500">Link</label>
            <input v-model.trim="form.posts[i].href" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
          </div>
        </div>
        <div class="mt-2 flex justify-between">
          <button class="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800" @click="dupPost(i)">Duplikat</button>
          <button class="px-2 py-1 text-xs rounded border text-rose-600 hover:bg-rose-50 dark:border-neutral-700 dark:hover:bg-neutral-800" @click="delPost(i)">Hapus</button>
        </div>
      </div>

      <div class="flex gap-2">
        <button class="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800" @click="addPost">
          Tambah Post
        </button>
      </div>
    </div>

    <!-- ====== TAB: Berita (mode auto/manual dari useNews) ====== -->
    <div v-show="active==='Berita'" class="mt-3 space-y-4">
      <div class="rounded-lg border border-gray-200 dark:border-neutral-800 p-3 space-y-3">
        <p class="text-[12px] text-gray-600 dark:text-neutral-300">
          Pilih sumber berita untuk ditampilkan di <code>hero/BlogHero.vue</code>.
        </p>

        <!-- Mode pilih -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-3">
          <label class="inline-flex items-center gap-2 text-sm">
            <input type="radio" class="size-4" value="custom" v-model="form.newsSource.mode">
            <span>Konten custom (pakai tab Featured & Posts)</span>
          </label>
          <label class="inline-flex items-center gap-2 text-sm">
            <input type="radio" class="size-4" value="auto" v-model="form.newsSource.mode">
            <span>Otomatis (berdasarkan berita terbaru)</span>
          </label>
          <label class="inline-flex items-center gap-2 text-sm">
            <input type="radio" class="size-4" value="manual" v-model="form.newsSource.mode">
            <span>Pilih manual dari daftar berita</span>
          </label>
        </div>

        <!-- Opsi AUTO -->
        <div v-if="form.newsSource.mode==='auto'" class="grid sm:grid-cols-3 gap-3">
          <div class="sm:col-span-1">
            <label class="text-xs text-gray-500">Jumlah total item (1 featured + N posts)</label>
            <input type="number" min="2" max="12" v-model.number="form.newsSource.autoTotal"
                   class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
            <p class="text-[11px] text-gray-500 mt-1">Contoh: 5 = 1 featured + 4 posts.</p>
          </div>
          <div class="sm:col-span-2">
            <div class="p-3 rounded-lg bg-gray-50 dark:bg-neutral-800/40 border border-dashed dark:border-neutral-700">
              <p class="text-xs text-gray-600 dark:text-neutral-300">
                Akan otomatis mengambil berita terbaru (urut <em>publishedAt</em>) dari <code>alberr/news</code>.
                Item pertama menjadi Featured, sisanya menjadi Posts.
              </p>
            </div>
          </div>
        </div>

        <!-- Opsi MANUAL -->
        <div v-else-if="form.newsSource.mode==='manual'" class="space-y-3">
          <div class="flex flex-wrap items-center gap-2">
            <input v-model="news.q.value" placeholder="Cari judul/tag…" class="w-full sm:w-64 rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
            <button class="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    @click="pickLatestManual">
              Pilih Terbaru
            </button>
            <button class="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    @click="clearManual">
              Kosongkan
            </button>
            <span class="ml-auto text-[12px] text-gray-600 dark:text-neutral-300">
              Terpilih: <b>Featured:</b> {{ shortId(form.newsSource.featuredId) || '-' }} •
              <b>Posts:</b> {{ form.newsSource.postIds.length }}
            </span>
          </div>

          <div class="max-h-80 overflow-auto rounded-lg border border-gray-200 dark:border-neutral-800 divide-y divide-gray-200 dark:divide-neutral-800">
            <div v-for="n in (news.filtered.value as any[])" :key="n.id"
                 class="p-3 flex items-center gap-3">
              <img :src="n.cover" alt="" class="w-16 h-10 object-cover rounded border dark:border-neutral-800">
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium truncate">{{ n.title }}</p>
                <p class="text-[11px] text-gray-500 truncate">
                  {{ new Date(n.publishedAt||0).toLocaleString('id-ID') }} • {{ n.category || 'Umum' }} • {{ (n.tags||[]).join(', ') }}
                </p>
              </div>

              <div class="flex items-center gap-3">
                <label class="inline-flex items-center gap-1 text-xs">
                  <input type="radio" name="featured-radio" :value="n.id" :checked="form.newsSource.featuredId===n.id"
                         @change="setFeatured(n.id)">
                  <span>Featured</span>
                </label>
                <label class="inline-flex items-center gap-1 text-xs">
                  <input type="checkbox" :value="n.id" :checked="form.newsSource.postIds.includes(n.id)"
                         @change="togglePost(n.id)">
                  <span>Post</span>
                </label>
              </div>
            </div>
          </div>

          <p class="text-[11px] text-gray-500">
            Catatan: jika item dipilih sebagai Featured, otomatis dihapus dari daftar Posts.
          </p>
        </div>

        <!-- Mode CUSTOM info -->
        <div v-else class="p-3 rounded-lg bg-gray-50 dark:bg-neutral-800/40 border border-dashed dark:border-neutral-700">
          <p class="text-xs text-gray-600 dark:text-neutral-300">
            Mode custom akan menampilkan data dari tab <b>Featured</b> & <b>Posts</b>.
          </p>
        </div>
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
import { useNews } from '~/composables/data/useNews'

type Post = {
  id: string
  title: string
  href: string
  excerpt: string
  cover: string
  dateText: string
  readTime: number
  category: string
  tags: string[]
}
type Featured = {
  title: string
  cover: string
  dateText: string
  category: string
  tags: string[]
  href?: string
}
type NewsSource = {
  mode: 'custom' | 'auto' | 'manual'
  /** total item untuk hero: 1 featured + (autoTotal-1) posts */
  autoTotal: number
  featuredId?: string
  postIds: string[]
}
type Shape = {
  headingTitle: string
  headingDesc: string
  featured: Featured
  posts: Post[]
  newsSource: NewsSource
}
const props = defineProps<{ section: { id: string; key: string; props?: Partial<Shape> } }>()

const defaults: Shape = {
  headingTitle: 'Kegiatan Harian & Mingguan Santri',
  headingDesc: 'Pantau jadwal kajian, ibadah, dan aktivitas santri Pondok Pesantren Alberr Pandaan secara teratur. Temukan kegiatan yang sesuai dengan minat dan kebutuhan Anda.',
  featured: {
    title: 'Tahfidz Berbasis Target & Analitik: Metrik Hafalan yang Membumi',
    cover: '/assets/images/activity.jpg',
    dateText: '12 Agustus 2025 15:30',
    category: 'Tahfidz',
    tags: ['tahfidz','murajaah','edtech'],
    href: '#'
  },
  posts: [
    { id:'p-01', title:'Integrasi Diniyah & Literasi Digital: Model Kelas Hybrid', href:'#', excerpt:'Kurikulum diniyah diperkaya literasi digital...', cover:'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1200&auto=format&fit=crop', dateText:'10 Agustus 2025', readTime:7, category:'Pendidikan', tags:['kurikulum','digital','inovasi'] },
    { id:'p-02', title:'Analitik Tahfidz: Metrik Hafalan yang Membumi', href:'#', excerpt:'Mengukur kualitas setoran & murajaah...', cover:'/assets/images/activity2.jpg', dateText:'5 Agustus 2025', readTime:6, category:'Tahfidz', tags:['tahfidz','murajaah','edtech'] },
    { id:'p-03', title:'Ekosistem E-Learning Pesantren: SIAKAD dan E-Library', href:'#', excerpt:'Bangun ekosistem pembelajaran digital...', cover:'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop', dateText:'1 Agustus 2025', readTime:8, category:'Teknologi', tags:['e-learning','siakad','library'] },
    { id:'p-04', title:'Muhadhoroh: Public Speaking Santri', href:'#', excerpt:'Jadwal & rubrik penilaian sederhana...', cover:'https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?q=80&w=1200&auto=format&fit=crop', dateText:'28 Juli 2025', readTime:5, category:'Kegiatan Santri', tags:['muhadhoroh','soft-skill'] },
  ],
  newsSource: {
    mode: 'custom',
    autoTotal: 5,
    featuredId: '',
    postIds: []
  }
}

function merge(base: Shape, patch: Partial<Shape> = {}): Shape {
  return {
    headingTitle: patch.headingTitle ?? base.headingTitle,
    headingDesc: patch.headingDesc ?? base.headingDesc,
    featured: {
      title: patch.featured?.title ?? base.featured.title,
      cover: patch.featured?.cover ?? base.featured.cover,
      dateText: patch.featured?.dateText ?? base.featured.dateText,
      category: patch.featured?.category ?? base.featured.category,
      tags: Array.isArray(patch.featured?.tags) ? patch.featured!.tags : base.featured.tags,
      href: patch.featured?.href ?? base.featured.href
    },
    posts: Array.isArray(patch.posts) && patch.posts.length ? patch.posts : base.posts,
    newsSource: {
      mode: patch.newsSource?.mode ?? base.newsSource.mode,
      autoTotal: Number(patch.newsSource?.autoTotal ?? base.newsSource.autoTotal) || 5,
      featuredId: patch.newsSource?.featuredId ?? base.newsSource.featuredId,
      postIds: Array.isArray(patch.newsSource?.postIds) ? patch.newsSource!.postIds : base.newsSource.postIds
    }
  }
}

const form = reactive<Shape>(merge(defaults, props.section?.props || {}))
const progress = reactive<Record<string, number>>({})
const savedNote = ref(''); const errNote = ref('')

watch(() => props.section?.props, (p) => {
  Object.assign(form, merge(defaults, p || {}))
})

const tabs = ['Heading','Featured','Posts','Berita'] as const
const active = ref<typeof tabs[number]>('Heading')

/** ====== useNews untuk pilihan manual/auto ====== */
const news = useNews()
// useNews sudah auto onMounted(loadNews). Tidak perlu dipanggil lagi.

/** ====== Helpers tags (featured/posts custom) ====== */
const featuredTagsText = computedStr(
  () => (form.featured.tags || []).join(', '),
  (v) => form.featured.tags = splitTags(v)
)
function onFeaturedTagsInput(v: string) { featuredTagsText.set(v) }
function getTagsText(i: number) { return (form.posts[i]?.tags || []).join(', ') }
function setTagsText(i: number, v: string) { form.posts[i].tags = splitTags(v) }
function splitTags(v: string) { return v.split(',').map(s => s.trim()).filter(Boolean) }

/** ====== CRUD posts custom ====== */
function addPost() {
  form.posts.push({
    id: `p-${Date.now()}`, title: 'Judul', href:'#', excerpt:'',
    cover:'', dateText: new Date().toLocaleDateString('id-ID'), readTime: 5, category: 'Umum', tags:[]
  })
}
function delPost(i: number) { form.posts.splice(i,1) }
function dupPost(i: number) {
  const src = form.posts[i]
  form.posts.splice(i+1, 0, { ...src, id:`p-${Date.now()}` })
}

/** ====== Pilih Berita (manual) ====== */
function setFeatured(id: string) {
  form.newsSource.featuredId = id
  // pastikan tidak double di posts
  const idx = form.newsSource.postIds.indexOf(id)
  if (idx >= 0) form.newsSource.postIds.splice(idx,1)
}
function togglePost(id: string) {
  const i = form.newsSource.postIds.indexOf(id)
  if (i >= 0) form.newsSource.postIds.splice(i,1)
  else {
    if (id === form.newsSource.featuredId) return // jangan duplikasi dengan featured
    form.newsSource.postIds.push(id)
  }
}
function pickLatestManual() {
  // ambil urutan terbaru dari news.items (sudah tersort di useNews.loadNews -> kita pastikan lagi)
  const arr = [...(news.items.value||[])].sort((a,b)=>(b.publishedAt||0)-(a.publishedAt||0))
  if (!arr.length) return
  const total = clamp(form.newsSource.autoTotal||5, 2, 12)
  form.newsSource.featuredId = arr[0].id
  form.newsSource.postIds = arr.slice(1, total).map(x=>x.id)
}
function clearManual() {
  form.newsSource.featuredId = ''
  form.newsSource.postIds = []
}
function shortId(v?: string) { return v ? (v.length>8 ? v.slice(0,8)+'…' : v) : '' }
function clamp(n:number, a:number,b:number){ return Math.max(a, Math.min(b, n)) }

/** ====== Save / Reset ====== */
const { updateSection } = useWeb()
async function save() {
  try {
    errNote.value = ''
    // bersihkan tags di custom mode
    form.featured.tags = form.featured.tags.map(t => t.trim()).filter(Boolean)
    form.posts = form.posts.map(p => ({ ...p, tags: (p.tags||[]).map(t=>t.trim()).filter(Boolean) }))
    // clamp autoTotal
    form.newsSource.autoTotal = clamp(Number(form.newsSource.autoTotal || 5), 2, 12)
    await updateSection(props.section.id, { props: JSON.parse(JSON.stringify(form)) })
    savedNote.value = 'Tersimpan.'; setTimeout(()=>savedNote.value='', 1500)
  } catch (e:any) {
    errNote.value = e?.message || 'Gagal menyimpan'
  }
}
function resetDefault() {
  Object.assign(form, JSON.parse(JSON.stringify(defaults)))
  active.value = 'Heading'
}

/** ====== Upload ====== */
async function upload(e: Event, key: string) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  progress[key] = 0
  try {
    const { getStorage, ref, uploadBytesResumable, getDownloadURL } = await import('firebase/storage')
    const storage = getStorage()
    const safe = file.name.replace(/\s+/g,'_')
    const path = `alberr/web/blog/${Date.now()}_${safe}`
    const r = ref(storage, path)
    const task = uploadBytesResumable(r, file, { contentType: file.type })
    await new Promise<void>((res, rej) => {
      task.on('state_changed',
        s => progress[key] = Math.round((s.bytesTransferred/s.totalBytes)*100),
        rej,
        async () => {
          const url = await getDownloadURL(task.snapshot.ref)
          if (key === 'featured.cover') form.featured.cover = url
          else {
            const m = key.match(/^posts\.(\d+)\.cover$/)
            if (m) form.posts[Number(m[1])].cover = url
          }
          res()
        })
    })
  } catch (e:any) {
    errNote.value = e?.message || 'Upload gagal'
  } finally {
    setTimeout(()=>{ delete progress[key] }, 1200)
    ;(e.target as HTMLInputElement).value = ''
  }
}

/** ====== util computed string dua arah ====== */
function computedStr(getter: ()=>string, setter:(v:string)=>void) {
  const box = ref(getter())
  watch(() => getter(), v => box.value = v)
  return {
    get value(){ return box.value },
    set value(v: string){ box.value = v; setter(v) },
    set: (v:string) => { box.value = v; setter(v) }
  }
}
</script>
