<template>
  <div>
    <!-- Tabs -->
    <div class="flex gap-1 border-b flex-wrap border-gray-200 dark:border-neutral-800">
      <button v-for="t in tabs" :key="t"
              class="px-3 py-2 text-xs rounded-t-lg"
              :class="activeTab===t ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800'"
              @click="activeTab=t">
        {{ t }}
      </button>
      <div class="ml-auto flex gap-2 mb-2">
        <button class="px-2 py-1 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700" @click="resetToDefault">Isi Default</button>
        <button class="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700" @click="save">Simpan</button>
      </div>
    </div>

    <!-- Konten -->
    <div v-show="activeTab==='Konten'" class="mt-3 grid sm:grid-cols-2 gap-3">
      <div class="sm:col-span-2">
        <label class="text-xs text-gray-500">Badge</label>
        <input v-model.trim="form.badge" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
      </div>
      <div>
        <label class="text-xs text-gray-500">Heading Awal</label>
        <input v-model.trim="form.headingLead" placeholder="Nyaman, Tertib," class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
      </div>
      <div>
        <label class="text-xs text-gray-500">Highlight 1</label>
        <input v-model.trim="form.highlight1" placeholder="Inklusif" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
      </div>
      <div class="sm:col-span-2">
        <label class="text-xs text-gray-500">Highlight 2 / Ekor</label>
        <input v-model.trim="form.highlight2" placeholder="dirancang untuk bertumbuh" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
      </div>
      <div class="sm:col-span-2">
        <label class="text-xs text-gray-500">Deskripsi</label>
        <textarea v-model.trim="form.description" rows="3" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"></textarea>
      </div>
    </div>

    <!-- Stats -->
    <div v-show="activeTab==='Stats'" class="mt-3 space-y-3">
      <div v-for="(s, i) in form.stats" :key="'st'+i"
           class="rounded-lg border border-gray-200 dark:border-neutral-800 p-3">
        <div class="grid sm:grid-cols-3 gap-3 items-center">
          <div>
            <label class="text-xs text-gray-500">Label</label>
            <input v-model.trim="s.label" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
          </div>
          <div>
            <label class="text-xs text-gray-500">Value</label>
            <input v-model.trim="s.value" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
          </div>
          <div>
            <label class="text-xs text-gray-500">Icon</label>
            <div class="mt-1 flex flex-wrap items-center gap-2">
              <ClientOnly><Icon v-if="s.icon" :icon="s.icon" class="size-5" /></ClientOnly>
              <button type="button" class="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                      @click="openIconPicker({ kind:'stat', index:i })">
                Pilih
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <button class="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                @click="form.stats.push({label:'Label', value:'0', icon:'ph:info'})">Tambah Stat</button>
        <button v-if="form.stats.length>0" class="px-2 py-1 text-xs rounded border border-gray-200 text-rose-600 hover:bg-rose-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                @click="form.stats.pop()">Hapus Terakhir</button>
      </div>
    </div>

    <!-- Galeri -->
    <div v-show="activeTab==='Galeri'" class="mt-3 space-y-3">
      <div v-for="(g, gi) in form.gallery" :key="'g'+gi"
           class="rounded-lg border border-gray-200 dark:border-neutral-800 p-3">
        <div class="grid sm:grid-cols-3 gap-3">
          <div class="sm:col-span-2">
            <label class="text-xs text-gray-500">Gambar {{ gi+1 }}</label>
            <div class="mt-1">
              <input v-model.trim="g.src" placeholder="URL gambar atau upload…" class="w-full rounded-md border px-3 py-2 text-sm border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
              <input type="file" accept="image/*" class="text-xs w-full mt-1" @change="(e:any)=>upload(e, `gallery.${gi}`)">
            </div>
            <div class="mt-2">
              <img v-if="g.src" :src="g.src" class="h-24 w-full object-cover rounded-lg border dark:border-neutral-800" :alt="g.alt || ('Foto '+(gi+1))">
            </div>
            <p v-if="progress[`gallery.${gi}`]!=null" class="text-[11px] mt-1">Upload: {{ progress[`gallery.${gi}`] }}%</p>
          </div>
          <div>
            <label class="text-xs text-gray-500">Label & Icon</label>
            <input v-model.trim="g.label" placeholder="Masjid & Aula" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
            <div class="mt-2 flex items-center gap-2">
              <ClientOnly><Icon v-if="g.icon" :icon="g.icon" class="size-5" /></ClientOnly>
              <button type="button" class="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                      @click="openIconPicker({ kind:'gallery', index:gi })">
                Pilih
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <button class="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                @click="form.gallery.push({ src:'', alt:'', label:'Label', icon:'ph:info' })">
          Tambah Item
        </button>
        <button v-if="form.gallery.length>0" class="px-2 py-1 text-xs rounded border border-gray-200 text-rose-600 hover:bg-rose-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                @click="form.gallery.pop()">Hapus Terakhir</button>
      </div>
    </div>

    <!-- Brosur -->
    <div v-show="activeTab==='Brosur'" class="mt-3 space-y-3">
      <div v-for="(b, bi) in form.brochures" :key="'b'+bi"
           class="rounded-lg border border-gray-200 dark:border-neutral-800 p-3">
        <label class="text-xs text-gray-500">Brosur {{ bi+1 }}</label>
        <div class="mt-1">
          <input v-model.trim="form.brochures[bi]" placeholder="URL gambar atau upload…" class="w-full rounded-md border px-3 py-2 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700">
          <input type="file" accept="image/*" class="text-xs w-full mt-1" @change="(e)=>upload(e, `brosur.${bi}`)">
        </div>
        <div class="mt-2">
          <img v-if="b" :src="b" class="h-24 w-full object-cover rounded-lg border dark:border-neutral-800" :alt="'Brosur '+(bi+1)">
        </div>
        <p v-if="progress[`brosur.${bi}`]!=null" class="text-[11px] mt-1">Upload: {{ progress[`brosur.${bi}`] }}%</p>
        <div class="mt-2 flex gap-2">
          <button class="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800" @click="moveBrochure(bi,-1)" :disabled="bi===0">▲</button>
          <button class="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800" @click="moveBrochure(bi,1)" :disabled="bi===form.brochures.length-1">▼</button>
          <button class="px-2 py-1 text-xs rounded border border-gray-200 text-rose-600 hover:bg-rose-50 dark:border-neutral-700 dark:hover:bg-neutral-800" @click="removeBrochure(bi)">Hapus</button>
        </div>
      </div>
      <div>
        <button class="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800" @click="form.brochures.push('')">Tambah Brosur</button>
      </div>
    </div>

    <div class="mt-4 flex flex-wrap gap-2">
      <p v-if="savedNote" class="text-[11px] text-emerald-600">{{ savedNote }}</p>
      <p v-if="errNote" class="text-[11px] text-rose-600">{{ errNote }}</p>
    </div>

    <div v-if="iconModal.show" class="fixed left-0 top-0 w-full z-[1002] h-screen flex items-start py-24 overflow-y-auto justify-center bg-black/0 px-4" @click.self="closeIconPicker">
      <div class="w-full max-w-3xl rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700">
        <div class="p-4 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
          <h3 class="text-base font-semibold">Select Icon</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="closeIconPicker">×</button>
        </div>
        <div class="p-4 space-y-3">
          <div class="inline-flex bg-white/80 border border-gray-200 rounded-lg p-1 shadow-xs dark:bg-neutral-800/70 dark:border-neutral-700">
            <button v-for="t in iconModal.tabs" :key="t" @click="iconModal.activeTab = t" :class="[
              'px-3 py-1.5 rounded-md text-sm',
              iconModal.activeTab === t ? 'bg-gray-900 text-white dark:bg-neutral-200 dark:text-neutral-900' : 'text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700'
            ]">
              {{ t }}
            </button>
          </div>

          <div class="flex gap-2">
            <input v-model.trim="iconModal.query" type="text" placeholder="Search icons…" class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800" @input="onIconSearchInput" @keydown.enter.prevent="searchOnline(true)" />
            <button v-if="iconModal.allowOnline" class="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 text-sm" :disabled="iconModal.loading" @click="searchOnline" title="Search online via Iconify API">
              {{ iconModal.loading ? 'Searching…' : 'Search Online' }}
            </button>
          </div>

          <div class="max-h-[420px] overflow-auto rounded-lg border border-gray-200 dark:border-neutral-800 p-3">
            <div class="grid sm:grid-cols-6 grid-cols-4 gap-3">
              <button v-for="name in iconModal.visible" :key="name" type="button" @click="chooseIcon(name)" class="group p-3 rounded-xl border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 text-xs flex flex-col items-center gap-2">
                <ClientOnly><Icon :icon="name" width="24" height="24" /></ClientOnly>
                <span class="truncate w-full text-center" :title="name">{{ name }}</span>
              </button>
            </div>
            <p v-if="!iconModal.visible.length" class="text-sm text-gray-500 mt-3">No icons found.</p>
          </div>

          <div class="mt-3 flex items-center justify-between text-xs text-gray-600 dark:text-neutral-300" v-if="iconModal.allowOnline && iconModal.total > iconModal.limit">
            <span>
              Showing {{ Math.min(iconModal.total, iconModal.start + 1) }}–{{ Math.min(iconModal.total, iconModal.start + iconModal.limit) }}
              of {{ iconModal.total }}
            </span>
            <div class="inline-flex gap-2">
              <button type="button" class="px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 disabled:opacity-50" :disabled="iconModal.start === 0 || iconModal.loading" @click="prevPage">Prev</button>
              <button type="button" class="px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 disabled:opacity-50" :disabled="iconModal.start + iconModal.limit >= iconModal.total || iconModal.loading" @click="nextPage">Next</button>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-gray-200 dark:border-neutral-800 flex justify-end">
          <button class="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700" @click="closeIconPicker">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { reactive, ref, watch } from 'vue'
import { useWeb } from '~/composables/data/useWeb'

type Stat = { label: string; value: string; icon: string }
type GalleryItem = { src: string; alt?: string; label: string; icon: string }
type Shape = {
  badge: string
  headingLead: string
  highlight1: string
  highlight2: string
  description: string
  stats: Stat[]
  gallery: GalleryItem[]
  brochures: string[]
}

const props = defineProps<{ section: { id: string; key: string; props?: Partial<Shape> } }>()

const defaults: Shape = {
  badge: 'Fasilitas Pondok Alberr',
  headingLead: 'Nyaman, Tertib,',
  highlight1: 'Inklusif',
  highlight2: 'dirancang untuk bertumbuh',
  description: 'Dari asrama yang rapi, masjid yang lapang, ruang kelas interaktif, hingga perpustakaan. Semua disiapkan untuk mendukung adab, akademik, dan kemandirian santri.',
  stats: [
    { label: 'Asrama', value: '8', icon: 'ph:house' },
    { label: 'Ruang Kelas', value: '24', icon: 'ph:chalkboard-teacher' },
    { label: 'Perpustakaan', value: '1', icon: 'ph:books' },
    { label: 'Lapangan', value: '3', icon: 'ph:soccer-ball' },
  ],
  gallery: [
    { src: '/assets/images/masjid.jpg',    alt:'Masjid pondok',       label:'Masjid & Aula',        icon:'ph:mosque' },
    { src: '/assets/images/kelas.jpg',     alt:'Ruang kelas',         label:'Kelas Interaktif',     icon:'ph:chalkboard-teacher' },
    { src: '/assets/images/activity.jpg',  alt:'Perpustakaan',        label:'Perpustakaan',         icon:'ph:books' },
    { src: '/assets/images/lapangan.jpg',  alt:'Lapangan olahraga',   label:'Lapangan Olahraga',    icon:'ph:soccer-ball' },
    { src: '/assets/images/asrama.jpg',    alt:'Asrama santri',       label:'Asrama & Kafetaria',   icon:'ph:house' },
  ],
  brochures: [
    '/assets/images/brochures/1.jpg',
    '/assets/images/brochures/2.jpg',
  ],
}

const tabs = ['Konten','Stats','Galeri','Brosur'] as const
const activeTab = ref<typeof tabs[number]>('Konten')

const form = reactive<Shape>(merge(defaults, props.section?.props || {}))
const savedNote = ref(''); const errNote = ref('')
const progress = reactive<Record<string, number>>({})

watch(() => props.section?.props, (p) => {
  Object.assign(form, merge(defaults, p || {}))
})

function merge(b: Shape, p: Partial<Shape>): Shape {
  return {
    badge: p.badge ?? b.badge,
    headingLead: p.headingLead ?? b.headingLead,
    highlight1: p.highlight1 ?? b.highlight1,
    highlight2: p.highlight2 ?? b.highlight2,
    description: p.description ?? b.description,
    stats: Array.isArray(p.stats) && p.stats.length ? p.stats : [...b.stats],
    gallery: Array.isArray(p.gallery) && p.gallery.length ? p.gallery : [...b.gallery],
    brochures: Array.isArray(p.brochures) && p.brochures.length ? p.brochures : [...b.brochures],
  }
}

const { updateSection } = useWeb()

async function save() {
  try {
    errNote.value = ''
    await updateSection(props.section.id, { props: JSON.parse(JSON.stringify(form)) })
    savedNote.value = 'Tersimpan.'; setTimeout(()=>savedNote.value='', 1500)
  } catch (e:any) {
    errNote.value = e?.message || 'Gagal menyimpan'
  }
}

function resetToDefault() {
  Object.assign(form, JSON.parse(JSON.stringify(defaults)))
  activeTab.value = 'Konten'
}
function moveBrochure(i:number, dir:number) {
  const j = i + dir; if (j<0 || j>=form.brochures.length) return
  const tmp = form.brochures[i]; form.brochures[i] = form.brochures[j]; form.brochures[j] = tmp
}
function removeBrochure(i:number) { form.brochures.splice(i,1) }

/* Upload ke /alberr/web/facility */
async function upload(e: Event, fieldKey: string) {
  const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return
  progress[fieldKey] = 0
  try {
    const { getStorage, ref, uploadBytesResumable, getDownloadURL } = await import('firebase/storage')
    const storage = getStorage()
    const path = `alberr/web/facility/${Date.now()}_${file.name.replace(/\s+/g,'_')}`
    const r = ref(storage, path)
    const task = uploadBytesResumable(r, file, { contentType: file.type })
    await new Promise<void>((res, rej) => {
      task.on('state_changed',
        s => progress[fieldKey] = Math.round(100 * s.bytesTransferred / s.totalBytes),
        rej,
        async () => {
          const url = await getDownloadURL(task.snapshot.ref)
          const gmatch = fieldKey.match(/^gallery\.(\d+)$/)
          const bmatch = fieldKey.match(/^brosur\.(\d+)$/)
          if (gmatch) {
            const idx = Number(gmatch[1]); if (!form.gallery[idx]) form.gallery[idx] = { src:'', label:'', icon:'ph:info' }
            form.gallery[idx].src = url
          } else if (bmatch) {
            const idx = Number(bmatch[1]); form.brochures[idx] = url
          }
          res()
        })
    })
  } catch (e:any) {
    errNote.value = e?.message || 'Upload gagal'
  } finally {
    setTimeout(()=>{ delete progress[fieldKey] }, 1200)
    ;(e.target as HTMLInputElement).value = ''
  }
}

/* ========== Icon Picker (Local + Online) ========== */
type Target = { kind: 'stat'|'gallery'; index: number }
const iconModal = reactive({
  show:false,
  tabs: ['Local','Online'] as const,
  activeTab: 'Local' as 'Local'|'Online',
  query: '',
  visible: [] as string[],
  allowOnline: true,
  loading: false,
  total: 0, limit: 48, start: 0,
  controller: null as AbortController|null,
  target: null as Target|null,
  localAll: [] as string[],
})
iconModal.localAll = [
  'ph:house','ph:chalkboard-teacher','ph:books','ph:soccer-ball','ph:mosque',
  'ph:users-three','ph:handshake','ph:gear-six','ph:leaf','ph:lightbulb',
  'lucide:home','lucide:image','lucide:book','mdi:school-outline','mdi:book-open-variant',
  'tabler:book-2','tabler:leaf','material-symbols:school-outline','ic:baseline-emoji-people'
]
function openIconPicker(t:Target){ iconModal.target=t; iconModal.show=true; iconModal.activeTab='Local'; iconModal.query=''; filterLocal() }
function closeIconPicker(){ try{iconModal.controller?.abort?.()}catch{} iconModal.controller=null; iconModal.show=false; iconModal.visible=[]; iconModal.query=''; iconModal.total=0; iconModal.start=0 }
function chooseIcon(name:string){
  if (!iconModal.target) return
  if (iconModal.target.kind==='stat')  form.stats[iconModal.target.index].icon = name
  if (iconModal.target.kind==='gallery') form.gallery[iconModal.target.index].icon = name
  closeIconPicker()
}
function filterLocal(){
  const q = iconModal.query.trim().toLowerCase()
  const base = iconModal.localAll
  iconModal.visible = q ? base.filter(n=>n.toLowerCase().includes(q)) : base.slice(0, iconModal.limit)
  iconModal.total = iconModal.visible.length
}
watch(()=>iconModal.activeTab, (t)=>{ t==='Local' ? filterLocal() : searchOnline(true) })
function onIconSearchInput(){ if (iconModal.activeTab==='Local') filterLocal() }
let searchDebounce: number | null = null as unknown as number
function resetOnlinePaging(){ iconModal.start=0; iconModal.total=0 }
async function searchOnline(reset=true){
  if (!iconModal.allowOnline || typeof window==='undefined') return
  const q = iconModal.query.trim()
  if (!q){ resetOnlinePaging(); return filterLocal() }
  if (reset) iconModal.start=0
  if (searchDebounce) window.clearTimeout(searchDebounce)
  searchDebounce = window.setTimeout(async ()=>{
    try{ iconModal.controller?.abort?.() }catch{}
    iconModal.controller = new AbortController()
    iconModal.loading = true
    try{
      const prefixes = ['mdi','tabler','material-symbols','ic','ph','lucide']
      const url = `https://api.iconify.design/search?query=${encodeURIComponent(q)}&limit=${encodeURIComponent(iconModal.limit)}&start=${encodeURIComponent(iconModal.start)}&prefixes=${encodeURIComponent(prefixes.join(','))}`
      const res = await fetch(url, { headers:{Accept:'application/json'}, signal: iconModal.controller.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json() as { icons?: string[]; total?: number; limit?: number; start?: number }
      const hits = Array.isArray(data.icons) ? data.icons : []
      iconModal.visible = hits
      iconModal.total = Number(data.total || hits.length || 0)
      if (typeof data.limit==='number') iconModal.limit = data.limit
      if (typeof data.start==='number') iconModal.start = data.start
      if (!hits.length) filterLocal()
    } catch(e:any){
      if (e?.name!=='AbortError'){ console.error('Iconify /search error:', e); filterLocal() }
    } finally { iconModal.loading = false }
  }, 220) as unknown as number
}
function prevPage(){ if (iconModal.start===0) return; iconModal.start = Math.max(0, iconModal.start - iconModal.limit); searchOnline(false) }
function nextPage(){ if (iconModal.start + iconModal.limit >= iconModal.total) return; iconModal.start += iconModal.limit; searchOnline(false) }
</script>
