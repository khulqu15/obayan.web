<template>
  <div>
    <div class="flex gap-1 border-b border-gray-200 flex-wrap dark:border-neutral-800">
      <button v-for="tab in tabs" :key="tab"
              class="px-3 py-2 text-xs rounded-t-lg"
              :class="activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800'"
              @click="activeTab = tab">
        {{ tab }}
      </button>
      <div class="ml-auto flex gap-2 mb-3">
        <button class="px-2 py-1 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700"
                @click="resetToDefault">Isi Default</button>
        <button class="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                @click="save">Simpan</button>
      </div>
    </div>

    <div class="mt-3">
      <div v-show="activeTab === 'Konten'" class="grid sm:grid-cols-2 gap-3">
        <div>
          <label class="text-xs text-gray-500">Brand</label>
          <input v-model.trim="form.brand" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
        </div>
        <div>
          <label class="text-xs text-gray-500">Tagline</label>
          <input v-model.trim="form.tagline" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
        </div>
        <div class="sm:col-span-2">
          <label class="text-xs text-gray-500">Judul (Main)</label>
          <input v-model.trim="form.titleMain" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
        </div>
        <div>
          <label class="text-xs text-gray-500">Judul (Highlight)</label>
          <input v-model.trim="form.titleHighlight" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
        </div>
        <div>
          <label class="text-xs text-gray-500">WA Admin (intl)</label>
          <input v-model.trim="form.waIntl" placeholder="62xxxxxxxxxxx" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
        </div>
        <div class="sm:col-span-2">
          <label class="text-xs text-gray-500">Subjudul</label>
          <textarea v-model.trim="form.subtitle" rows="3" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"></textarea>
        </div>
      </div>

      <!-- Media -->
      <div v-show="activeTab === 'Media'" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="sm:col-span-2">
          <label class="text-xs text-gray-500">Background</label>
          <div class="mt-1">
            <input v-model.trim="form.bgImage" placeholder="URL gambar atau upload…" class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
            <input type="file" accept="image/*" @change="(e:any)=>upload(e, 'bgImage')" class="text-xs w-full mt-1" />
          </div>
          <div class="mt-2">
            <img v-if="form.bgImage" :src="form.bgImage" alt="bg" class="h-28 w-full object-cover rounded-lg border dark:border-neutral-800">
          </div>
          <p v-if="progress['bgImage'] != null" class="text-[11px] mt-1">Upload: {{ progress['bgImage'] }}%</p>
        </div>
        <div v-for="idx in 3" :key="'p'+idx">
          <label class="text-xs text-gray-500">Photo {{ idx }}</label>
          <div class="mt-1">
            <input v-model.trim="form.photos[idx-1]" placeholder="URL gambar atau upload…" class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
            <input type="file" accept="image/*" @change="(e:any)=>upload(e, `photos.${idx-1}`)" class="text-xs w-full mt-1" />
          </div>
          <div class="mt-2">
            <img v-if="form.photos[idx-1]" :src="form.photos[idx-1]" class="h-24 w-full object-cover rounded-lg border dark:border-neutral-800" :alt="'photo-'+idx">
          </div>
          <p v-if="progress[`photos.${idx-1}`] != null" class="text-[11px] mt-1">Upload: {{ progress[`photos.${idx-1}`] }}%</p>
        </div>
      </div>

      <!-- CTA -->
      <div v-show="activeTab === 'CTA'" class="grid sm:grid-cols-2 gap-3">
        <div>
          <label class="text-xs text-gray-500">CTA Primary Label</label>
          <input v-model.trim="form.ctaPrimary.label" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
        </div>
        <div>
          <label class="text-xs text-gray-500">CTA Primary Href</label>
          <input v-model.trim="form.ctaPrimary.href" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
        </div>
        <div>
          <label class="text-xs text-gray-500">CTA Secondary Label</label>
          <input v-model.trim="form.ctaSecondary.label" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
        </div>
        <div>
          <label class="text-xs text-gray-500">CTA Secondary Href</label>
          <input v-model.trim="form.ctaSecondary.href" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
        </div>
      </div>

      <!-- Stats -->
      <div v-show="activeTab === 'Stats'" class="space-y-3">
        <div class="grid sm:grid-cols-2 gap-3" v-for="(st, si) in form.stats" :key="'st'+si">
          <div>
            <label class="text-xs text-gray-500">Label</label>
            <input v-model.trim="st.label" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
          </div>
          <div>
            <label class="text-xs text-gray-500">Value</label>
            <input v-model.trim="st.value" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
          </div>
        </div>
        <div class="flex gap-2">
          <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50 border-gray-200 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  @click="form.stats.push({label:'Label', value:'0'})">
            Tambah Stat
          </button>
          <button v-if="form.stats.length>0"
                  class="px-2 py-1 text-xs rounded border text-rose-600 hover:bg-rose-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  @click="form.stats.pop()">
            Hapus Terakhir
          </button>
        </div>
      </div>

      <!-- Quick Info -->
      <div v-show="activeTab === 'Quick Info'" class="space-y-3">
        <div class="grid sm:grid-cols-3 gap-3" v-for="(q, qi) in form.quicks" :key="'q'+qi">
          <div>
            <label class="text-xs text-gray-500">Label</label>
            <input v-model.trim="q.label" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
          </div>
          <div>
            <label class="text-xs text-gray-500">Value</label>
            <input v-model.trim="q.value" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
          </div>
          <div>
            <label class="text-xs text-gray-500">Icon</label>
            <div class="mt-1 flex items-center gap-2">
              <button
                type="button"
                class="px-2 py-1 text-xs rounded-md border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                @click="openIconPickerQuick(qi)"
              >Pilih</button>
              <Icon v-if="q.icon" :icon="q.icon" class="size-5 text-gray-700 dark:text-neutral-200" />
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50 border-gray-200 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  @click="form.quicks.push({label:'Info', value:'-', icon:'ph:info'})">
            Tambah Info
          </button>
          <button v-if="form.quicks.length>0"
                  class="px-2 py-1 text-xs rounded border text-rose-600 hover:bg-rose-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  @click="form.quicks.pop()">
            Hapus Terakhir
          </button>
        </div>
      </div>
    </div>

    <div class="mt-4 flex flex-wrap gap-2">
      <p v-if="savedNote" class="text-[11px] text-emerald-600">{{ savedNote }}</p>
      <p v-if="errNote" class="text-[11px] text-rose-600">{{ errNote }}</p>
    </div>

    <!-- Icon Picker Modal -->
    <div
      v-if="iconModal.show"
      class="fixed left-0 top-0 w-full z-[1002] h-screen flex items-start py-24 overflow-y-auto justify-center bg-black/0 px-4"
      @click.self="closeIconPicker"
    >
      <div class="w-full max-w-3xl rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700">
        <div class="p-4 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
          <h3 class="text-base font-semibold">Select Icon</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="closeIconPicker">×</button>
        </div>

        <div class="p-4 space-y-3">
          <div class="inline-flex bg-white/80 border border-gray-200 rounded-lg p-1 shadow-xs dark:bg-neutral-800/70 dark:border-neutral-700">
            <button
              v-for="t in iconModal.tabs"
              :key="t"
              @click="setTab(t)"
              :class="[
                'px-3 py-1.5 rounded-md text-sm',
                iconModal.activeTab === t ? 'bg-gray-900 text-white dark:bg-neutral-200 dark:text-neutral-900' : 'text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700'
              ]"
            >
              {{ t }}
            </button>
          </div>

          <div class="flex gap-2">
            <input
              v-model.trim="iconModal.query"
              type="text"
              placeholder="Search icons (e.g. calendar, phone, info)"
              class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800"
              @input="onSearchInput"
              @keydown.enter.prevent="searchOnline(true)"
            />
            <button
              v-if="iconModal.allowOnline"
              class="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 text-sm"
              :disabled="iconModal.loading"
              @click="searchOnline()"
              title="Search online via Iconify API"
            >
              {{ iconModal.loading ? 'Searching…' : 'Search Online' }}
            </button>
          </div>

          <div class="max-h-[420px] overflow-auto rounded-lg border border-gray-200 dark:border-neutral-800 p-3">
            <div class="grid sm:grid-cols-6 grid-cols-4 gap-3">
              <button
                v-for="name in iconModal.visible"
                :key="name"
                type="button"
                @click="chooseIcon(name)"
                class="group p-3 rounded-xl border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 text-xs flex flex-col items-center gap-2"
              >
                <Icon :icon="name" width="24" height="24" />
                <span class="truncate w-full text-center" :title="name">{{ name }}</span>
              </button>
            </div>
            <p v-if="!iconModal.visible.length" class="text-sm text-gray-500 mt-3">No icons found.</p>
          </div>

          <div
            class="mt-3 flex items-center justify-between text-xs text-gray-600 dark:text-neutral-300"
            v-if="iconModal.allowOnline && iconModal.total > iconModal.limit"
          >
            <span>
              Showing
              {{ Math.min(iconModal.total, iconModal.start + 1) }}–{{ Math.min(iconModal.total, iconModal.start + iconModal.limit) }}
              of {{ iconModal.total }}
            </span>
            <div class="inline-flex gap-2">
              <button
                type="button"
                class="px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 disabled:opacity-50"
                :disabled="iconModal.start === 0 || iconModal.loading"
                @click="prevPage"
              >
                Prev
              </button>
              <button
                type="button"
                class="px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 disabled:opacity-50"
                :disabled="iconModal.start + iconModal.limit >= iconModal.total || iconModal.loading"
                @click="nextPage"
              >
                Next
              </button>
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
    <!-- /Icon Picker Modal -->
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from 'vue'
import { useWeb } from '~/composables/data/useWeb'
import { Icon } from '@iconify/vue'

type Stat = { label: string; value: string }
type Quick = { label: string; value: string; icon: string }
type CTA = { label: string; href: string }
type Shape = {
  brand: string
  bgImage: string
  titleMain: string
  titleHighlight: string
  tagline: string
  subtitle: string
  photos: string[]
  waIntl: string
  ctaPrimary: CTA
  ctaSecondary: CTA
  stats: Stat[]
  quicks: Quick[]
}

const props = defineProps<{ section: { id: string; key: string; props?: Partial<Shape> } }>()

const defaults: Shape = {
  brand: 'Al-Berr',
  bgImage: '/assets/images/masjid.jpg',
  titleMain: 'Pesantren Pencetak Insan ',
  titleHighlight: 'Berakhlaqul Karimah',
  tagline: 'Pondok Pesantren Inovatif',
  subtitle:
    'Pondok Pesantren Al-Berr hadir sebagai pusat pendidikan akhlaq mulia dan ilmu pengetahuan, mengintegrasikan agama-umum, salaf-modern, metode Amtsilati, pembelajaran aktif, fasilitas memadai, serta lingkungan bersih, indah, dan nyaman.',
  photos: ['/assets/images/activity.jpg', '/assets/images/activity1.jpg', '/assets/images/activity2.jpg'],
  waIntl: '6285856376399',
  ctaPrimary: { label: 'Login Wali', href: '/waliLogin' },
  ctaSecondary: { label: 'Pelajari Program', href: '/program' },
  stats: [
    { label: 'Santri Putra', value: '1000+' },
    { label: 'Santri Putri', value: '50+' },
    { label: 'Pengajar', value: '50+' },
    { label: 'Prestasi', value: '50+' }
  ],
  quicks: [
    { label: 'PPDB Berakhir', value: '1 Oktober - Kuota Terpenuhi', icon: 'ph:calendar-check' },
    { label: 'Jenjang', value: 'SMP - SMA Al Berr', icon: 'ph:student' },
    { label: 'Admin', value: 'WA: 085856376399', icon: 'ph:phone' }
  ]
}

const tabs = ['Konten','Media','CTA','Stats','Quick Info'] as const
const activeTab = ref<typeof tabs[number]>('Konten')

const form = reactive<Shape>(merge(defaults, props.section?.props || {}))
const progress = reactive<Record<string, number>>({})
const savedNote = ref('')
const errNote = ref('')

watch(() => props.section?.props, (p) => {
  Object.assign(form, merge(defaults, p || {}))
})

function ensure3(arr: unknown): string[] {
  const a = Array.isArray(arr) ? [...arr] : []
  while (a.length < 3) a.push('')
  return a.slice(0,3)
}
function merge(base: Shape, patch: Partial<Shape>): Shape {
  return {
    brand: patch.brand ?? base.brand,
    bgImage: patch.bgImage ?? base.bgImage,
    titleMain: patch.titleMain ?? base.titleMain,
    titleHighlight: patch.titleHighlight ?? base.titleHighlight,
    tagline: patch.tagline ?? base.tagline,
    subtitle: patch.subtitle ?? base.subtitle,
    photos: ensure3(patch.photos ?? base.photos),
    waIntl: patch.waIntl ?? base.waIntl,
    ctaPrimary: { ...base.ctaPrimary, ...(patch.ctaPrimary || {}) },
    ctaSecondary: { ...base.ctaSecondary, ...(patch.ctaSecondary || {}) },
    stats: Array.isArray(patch.stats) && patch.stats.length ? patch.stats : [...base.stats],
    quicks: Array.isArray(patch.quicks) && patch.quicks.length ? patch.quicks : [...base.quicks],
  }
}

function resetToDefault() {
  Object.assign(form, JSON.parse(JSON.stringify(defaults)))
  activeTab.value = 'Konten'
}

const { updateSection } = useWeb()

async function save() {
  try {
    errNote.value = ''
    await updateSection(props.section.id, { props: JSON.parse(JSON.stringify(form)) })
    savedNote.value = 'Tersimpan.'; setTimeout(() => (savedNote.value = ''), 1500)
  } catch (e:any) {
    errNote.value = e?.message || 'Gagal menyimpan'
  }
}

/* Upload ke Firebase Storage /alberr/web/hero/… */
async function upload(e: Event, fieldKey: string) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  progress[fieldKey] = 0
  try {
    const { getStorage, ref, uploadBytesResumable, getDownloadURL } = await import('firebase/storage')
    const storage = getStorage()
    const safe = file.name.replace(/\s+/g, '_')
    const path = `alberr/web/hero/${Date.now()}_${safe}`
    const r = ref(storage, path)
    const task = uploadBytesResumable(r, file, { contentType: file.type })
    await new Promise<void>((res, rej) => {
      task.on('state_changed',
        (snap) => { progress[fieldKey] = Math.round((snap.bytesTransferred/snap.totalBytes)*100) },
        (err) => rej(err),
        async () => {
          const url = await getDownloadURL(task.snapshot.ref)
          if (fieldKey === 'bgImage') (form as any).bgImage = url
          else {
            const m = fieldKey.match(/^photos\.(\d)$/)
            if (m) form.photos[Number(m[1])] = url
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

/* ====== Icon Picker (Iconify API) ====== */
type TabName = 'Popular' | 'Online'
const iconModal = reactive({
  show: false,
  tabs: ['Popular', 'Online'] as TabName[],
  activeTab: 'Popular' as TabName,
  allowOnline: true,
  query: '',
  loading: false,
  limit: 72,
  start: 0,
  total: 0,
  visible: [] as string[],
  popular: [
    'ph:calendar-check','ph:student','ph:phone','ph:info',
    'mdi:instagram','mdi:youtube','mdi:facebook','mdi:twitter','mdi:tiktok',
    'mdi:whatsapp','mdi:telegram','mdi:linkedin','mdi:web','mdi:email',
    'mdi:phone','mdi:map-marker','ph:instagram-logo','ph:youtube-logo',
    'ph:facebook-logo','ph:whatsapp-logo','ph:telegram-logo','ph:globe',
    'ph:envelope-simple','ph:map-pin','mdi:school','mdi:google',
  ] as string[],
  target: { kind: 'quick' as 'quick', index: -1 }
})

function setTab(t: TabName) {
  iconModal.activeTab = t
  if (t === 'Popular') {
    iconModal.visible = iconModal.popular.slice()
  } else if (t === 'Online') {
    iconModal.visible = []
  }
}

let iconSearchTimer: any = null
function onSearchInput() {
  iconModal.start = 0
  if (iconModal.activeTab !== 'Online') iconModal.activeTab = 'Online'
  if (iconSearchTimer) clearTimeout(iconSearchTimer)
  iconSearchTimer = setTimeout(() => searchOnline(), 400)
}

async function searchOnline(forced = false) {
  if (typeof window === 'undefined') return
  if (!iconModal.allowOnline) return
  const q = iconModal.query.trim()
  if (!q && !forced) return

  try {
    iconModal.loading = true
    const url = `https://api.iconify.design/search?query=${encodeURIComponent(q || 'logo')}&limit=${iconModal.limit}&start=${iconModal.start}`
    const res = await fetch(url)
    const json = await res.json().catch(() => ({}))
    const icons: string[] = Array.isArray(json?.icons) ? json.icons : []
    iconModal.visible = icons
    iconModal.total = Number(json?.total || icons.length || 0)
  } catch {
    iconModal.visible = []
    iconModal.total = 0
  } finally {
    iconModal.loading = false
  }
}
function prevPage() {
  if (iconModal.start === 0) return
  iconModal.start = Math.max(0, iconModal.start - iconModal.limit)
  searchOnline(true)
}
function nextPage() {
  if (iconModal.start + iconModal.limit >= iconModal.total) return
  iconModal.start = iconModal.start + iconModal.limit
  searchOnline(true)
}

function openIconPickerQuick(index: number) {
  iconModal.target = { kind: 'quick', index }
  iconModal.query = ''
  iconModal.start = 0
  iconModal.total = 0
  iconModal.activeTab = 'Popular'
  iconModal.visible = iconModal.popular.slice()
  iconModal.show = true
}
function closeIconPicker() {
  iconModal.show = false
  iconModal.target.index = -1
}
function chooseIcon(name: string) {
  if (iconModal.target.kind === 'quick' && iconModal.target.index >= 0) {
    form.quicks[iconModal.target.index].icon = name
  }
  closeIconPicker()
}
</script>
