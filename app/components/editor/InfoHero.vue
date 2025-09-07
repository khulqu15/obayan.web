<template>
  <div>
    <!-- Sub Tabs -->
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

    <div class="mt-3">
      <div v-show="activeTab === 'Konten'" class="grid sm:grid-cols-2 gap-3">
        <div class="sm:col-span-2">
          <label class="text-xs text-gray-500">Heading Prefix</label>
          <input v-model.trim="form.headingPrefix" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
        </div>
        <div>
          <label class="text-xs text-gray-500">Brand Text</label>
          <input v-model.trim="form.brandText" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
        </div>
        <div class="sm:col-span-2">
          <label class="text-xs text-gray-500">Subtitle</label>
          <textarea v-model.trim="form.subtitle" rows="3" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"></textarea>
        </div>
        <div class="sm:col-span-2">
          <label class="text-xs text-gray-500">Link Profil</label>
          <input v-model.trim="form.profilHref" placeholder="/profile" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
        </div>
      </div>

      <div v-show="activeTab === 'Reasons'" class="space-y-3">
        <div
          v-for="(r, ri) in form.reasons"
          :key="'r'+ri"
          class="rounded-lg border border-gray-200 dark:border-neutral-800 p-3"
        >
          <div class="grid sm:grid-cols-3 gap-3">
            <div>
              <label class="text-xs text-gray-500">Icon (Iconify)</label>
              <div class="mt-1 flex items-center gap-2">
                <div class="inline-flex items-center gap-2 flex-1">
                  <ClientOnly>
                    <Icon v-if="r.icon" :icon="r.icon" class="size-5 shrink-0" />
                  </ClientOnly>
                </div>
                <button type="button" class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800"
                        @click="openIconPicker({ kind:'reasons', index: ri })">
                  Pilih
                </button>
              </div>
            </div>
            <div class="sm:col-span-2">
              <label class="text-xs text-gray-500">Title</label>
              <input v-model.trim="r.title" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
            <div class="sm:col-span-3">
              <label class="text-xs text-gray-500">Desc</label>
              <textarea v-model.trim="r.desc" rows="2" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"></textarea>
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50 border-gray-200 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  @click="form.reasons.push({ title:'Judul', desc:'...', icon:'ph:info' })">
            Tambah Reason
          </button>
          <button v-if="form.reasons.length>0"
                  class="px-2 py-1 text-xs rounded border text-rose-600 hover:bg-rose-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  @click="form.reasons.pop()">
            Hapus Terakhir
          </button>
        </div>
      </div>

      <div v-show="activeTab === 'Visi & Misi'" class="space-y-4">
        <div>
          <label class="text-xs text-gray-500">Visi</label>
          <textarea v-model.trim="form.visi" rows="3" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"></textarea>
        </div>
        <div class="space-y-3">
          <div
            v-for="(m, mi) in form.misi"
            :key="'m'+mi"
            class="rounded-lg border border-gray-200 dark:border-neutral-800 p-3"
          >
            <div class="grid sm:grid-cols-3 gap-3">
              <div>
                <label class="text-xs text-gray-500">Icon</label>
                <div class="mt-1 flex items-center gap-2">
                  <div class="inline-flex items-center gap-2 flex-1">
                    <ClientOnly>
                      <Icon v-if="m.icon" :icon="m.icon" class="size-5 shrink-0" />
                    </ClientOnly>
                  </div>
                  <button type="button" class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800"
                          @click="openIconPicker({ kind:'misi', index: mi })">
                    Pilih
                  </button>
                </div>
              </div>
              <div class="sm:col-span-2">
                <label class="text-xs text-gray-500">Title</label>
                <input v-model.trim="m.title" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
              </div>
              <div class="sm:col-span-3">
                <label class="text-xs text-gray-500">Desc</label>
                <textarea v-model.trim="m.desc" rows="2" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"></textarea>
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50 border-gray-200 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    @click="form.misi.push({ title:'Misi', desc:'...', icon:'ph:check-circle' })">
              Tambah Misi
            </button>
            <button v-if="form.misi.length>0"
                    class="px-2 py-1 text-xs rounded border text-rose-600 hover:bg-rose-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    @click="form.misi.pop()">
              Hapus Terakhir
            </button>
          </div>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <p v-if="savedNote" class="text-[11px] text-emerald-600">{{ savedNote }}</p>
        <p v-if="errNote" class="text-[11px] text-rose-600">{{ errNote }}</p>
      </div>
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
              @click="iconModal.activeTab = t"
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
              placeholder="Search icons (e.g. home, bolt, printer)"
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
                <ClientOnly>
                  <Icon :icon="name" width="24" height="24" />
                </ClientOnly>
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
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { reactive, ref, watch } from 'vue'
import { useWeb } from '~/composables/data/useWeb'

type Reason = { title: string; desc: string; icon: string }
type Mission = { title: string; desc: string; icon: string }
type Shape = {
  headingPrefix: string
  brandText: string
  subtitle: string
  reasons: Reason[]
  visi: string
  misi: Mission[]
  profilHref: string
}

const props = defineProps<{ section: { id: string; key: string; props?: Partial<Shape> } }>()
const defaults: Shape = {
  headingPrefix: 'Kenapa Memilih',
  brandText: 'Pondok Alberr',
  subtitle: 'Perpaduan diniyah dan umum, pembinaan akhlak, serta layanan digital yang memudahkan wali santri.',
  reasons: [
    { title: 'Pusat Pendidikan Akhlaq dan Ilmu Pengetahuan', desc: 'Membentuk generasi berilmu dan berakhlak mulia sebagai bekal kehidupan.', icon: 'ph:student' },
    { title: 'Integrasi Ilmu Agama dan Umum', desc: 'Menggabungkan kurikulum agama dan umum secara harmonis dan seimbang.', icon: 'ph:book-open-text' },
    { title: 'Pendidikan Salaf dan Modern yang Terpadu', desc: 'Memadukan metode tradisional pesantren dan pendekatan modern berbasis teknologi.', icon: 'ph:chalkboard-teacher' },
    { title: 'Pembelajaran Siswa Aktif dengan Presentasi', desc: 'Mendorong siswa berperan aktif melalui diskusi, presentasi, dan praktik langsung.', icon: 'ph:megaphone' },
    { title: 'Program Cepat Belajar Kitab Kuning Metode Amtsilati', desc: 'Pendekatan sistematis untuk memahami kitab kuning dengan lebih cepat dan mudah.', icon: 'ph:book-bookmark' },
    { title: 'Pesantren yang Asri dan Bersih', desc: 'Lingkungan hijau, fasilitas terawat, serta budaya menjaga kebersihan dan kenyamanan.', icon: 'ph:leaf' },
  ],
  visi: 'Mencetak generasi berilmu, berakhlak karimah, dan berdaya saing global berlandaskan Al-Qur’an dan Sunnah.',
  misi: [
    { title: 'Manajemen Terpadu', desc: 'Menerapkan sistem manajemen terpadu untuk mewujudkan tata kelola pesantren yang efektif dan efisien.', icon: 'ph:gear-six' },
    { title: 'Pendidikan Islam Terpadu', desc: 'Menerapkan pendidikan Islam terpadu yang berorientasi pada pembentukan akhlaq mulia.', icon: 'ph:book-open-text' },
    { title: 'Jaringan Kerja Sama', desc: 'Mengembangkan dan meningkatkan jaringan kerja sama dengan berbagai pihak secara berkelanjutan.', icon: 'ph:handshake' },
    { title: 'Hubungan Kekeluargaan', desc: 'Meningkatkan hubungan kekeluargaan yang harmonis antar santri, pengasuh, dan masyarakat.', icon: 'ph:users-three' },
    { title: 'Kreatifitas & Kemandirian', desc: 'Mendorong kreatifitas dan kemandirian santri melalui program inovatif dan kewirausahaan.', icon: 'ph:lightbulb' },
    { title: 'Pengembangan Potensi', desc: 'Mengembangkan potensi yang dimiliki untuk dimanfaatkan sebagai sumber daya yang bermanfaat.', icon: 'ph:plant' },
  ],
  profilHref: '/profile',
}

const tabs = ['Konten', 'Reasons', 'Visi & Misi'] as const
const activeTab = ref<typeof tabs[number]>('Konten')
const form = reactive<Shape>(merge(defaults, props.section?.props || {}))
const savedNote = ref('')
const errNote = ref('')

watch(() => props.section?.props, (p) => {
  Object.assign(form, merge(defaults, p || {}))
})

function merge(base: Shape, patch: Partial<Shape>): Shape {
  return {
    headingPrefix: patch.headingPrefix ?? base.headingPrefix,
    brandText: patch.brandText ?? base.brandText,
    subtitle: patch.subtitle ?? base.subtitle,
    reasons: Array.isArray(patch.reasons) && patch.reasons.length ? patch.reasons : [...base.reasons],
    visi: patch.visi ?? base.visi,
    misi: Array.isArray(patch.misi) && patch.misi.length ? patch.misi : [...base.misi],
    profilHref: patch.profilHref ?? base.profilHref,
  }
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

function resetToDefault() {
  Object.assign(form, JSON.parse(JSON.stringify(defaults)))
  activeTab.value = 'Konten'
}

/* ========= ICON PICKER ========= */
type Target = { kind: 'reasons' | 'misi'; index: number }

const iconModal = reactive({
  show: false,
  tabs: ['Local', 'Online'] as const,
  activeTab: 'Local' as 'Local' | 'Online',
  query: '',
  visible: [] as string[],
  allowOnline: true,
  loading: false,
  total: 0,
  limit: 48,
  start: 0,
  controller: null as AbortController | null,
  target: null as Target | null,
  localAll: [] as string[],
})

iconModal.localAll = [
  'ph:student','ph:book-open-text','ph:chalkboard-teacher','ph:megaphone','ph:book-bookmark','ph:leaf',
  'ph:gear-six','ph:handshake','ph:users-three','ph:lightbulb','ph:plant','ph:calendar-check','ph:check-circle','ph:info',
  'lucide:search','lucide:home','lucide:book','lucide:school','lucide:leaf','lucide:users','lucide:bolt',
  'mdi:school-outline','mdi:book-open-variant','mdi:handshake-outline','mdi:leaf','mdi:account-group-outline','mdi:lightbulb-on-outline',
  'tabler:book-2','tabler:leaf','tabler:users','tabler:sparkles','tabler:certificate',
  'material-symbols:school-outline','material-symbols:library-books-outline','ic:baseline-emoji-people'
]

function openIconPicker(target: Target) {
  iconModal.target = target
  iconModal.show = true
  iconModal.activeTab = 'Local'
  iconModal.query = ''
  filterLocal()
}

function closeIconPicker() {
  try { iconModal.controller?.abort?.() } catch {}
  iconModal.controller = null
  iconModal.show = false
  iconModal.visible = []
  iconModal.query = ''
  iconModal.total = 0
  iconModal.start = 0
}

function chooseIcon(name: string) {
  if (!iconModal.target) return
  if (iconModal.target.kind === 'reasons') {
    if (form.reasons[iconModal.target.index]) form.reasons[iconModal.target.index]!.icon = name
  } else {
    if (form.misi[iconModal.target.index]) form.misi[iconModal.target.index]!.icon = name
  }
  closeIconPicker()
}

/* Local search */
function filterLocal() {
  const q = iconModal.query.trim().toLowerCase()
  const base = iconModal.localAll
  iconModal.visible = q ? base.filter(n => n.toLowerCase().includes(q)) : base.slice(0, iconModal.limit)
  iconModal.total = iconModal.visible.length
}

/* Tab change => cari lokal/online */
watch(() => iconModal.activeTab, (t) => {
  if (t === 'Local') {
    filterLocal()
  } else {
    searchOnline(true)
  }
})

function onSearchInput() {
  if (iconModal.activeTab === 'Local') filterLocal()
}

/* Online search via Iconify API (with your snippet) */
let searchDebounce: number | null = null as unknown as number
function resetOnlinePaging() {
  iconModal.start = 0
  iconModal.total = 0
}
async function searchOnline(reset = true) {
  if (!iconModal.allowOnline) return
  if (typeof window === 'undefined') return
  const q = iconModal.query.trim()
  if (!q) {
    resetOnlinePaging()
    return filterLocal()
  }
  if (reset) iconModal.start = 0
  if (searchDebounce) window.clearTimeout(searchDebounce)
  searchDebounce = window.setTimeout(async () => {
    try {
      iconModal.controller?.abort?.()
    } catch {}
    iconModal.controller = new AbortController()
    iconModal.loading = true
    try {
      const prefixes = ['mdi','tabler','material-symbols','ic','ph','lucide']
      const url = `https://api.iconify.design/search` +
        `?query=${encodeURIComponent(q)}` +
        `&limit=${encodeURIComponent(iconModal.limit)}` +
        `&start=${encodeURIComponent(iconModal.start)}` +
        `&prefixes=${encodeURIComponent(prefixes.join(','))}`
      const res = await fetch(url, { headers: { Accept: 'application/json' }, signal: iconModal.controller.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json() as { icons?: string[]; total?: number; limit?: number; start?: number }
      const hits = Array.isArray(data.icons) ? data.icons : []
      iconModal.visible = hits
      iconModal.total = Number(data.total || hits.length || 0)
      if (typeof data.limit === 'number') iconModal.limit = data.limit
      if (typeof data.start === 'number') iconModal.start = data.start
      if (!hits.length) filterLocal()
    } catch (e:any) {
      if (e?.name !== 'AbortError') {
        console.error('Iconify /search error:', e)
        filterLocal()
      }
    } finally {
      iconModal.loading = false
    }
  }, 220) as unknown as number
}

function prevPage() {
  if (iconModal.start === 0) return
  iconModal.start = Math.max(0, iconModal.start - iconModal.limit)
  searchOnline(false)
}
function nextPage() {
  if (iconModal.start + iconModal.limit >= iconModal.total) return
  iconModal.start = iconModal.start + iconModal.limit
  searchOnline(false)
}
</script>
