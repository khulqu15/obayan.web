<!-- pages/app/announcement.vue -->
<template>
  <div class="space-y-4 p-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-xl font-semibold">Pengumuman</h1>
      <div class="flex items-center gap-2">
        <label class="flex items-center gap-2 text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700">
          <input type="checkbox" v-model="ttsEnabledGlobal" />
          TTS Realtime Aktif
        </label>
        <button @click="openCreate()" class="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">
          + Tambah Pengumuman
        </button>
        <button @click="reload" class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
          Muat Ulang
        </button>
      </div>
    </div>

    <div v-if="!supportsTTS" class="p-3 rounded border border-amber-200 bg-amber-50 text-amber-700 text-sm dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-300">
      Browser Anda tidak mendukung Speech Synthesis API. Fitur TTS tidak dapat digunakan.
    </div>
    <div v-if="error" class="p-3 rounded border border-rose-200 bg-rose-50 text-rose-700 text-sm dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300">
      {{ error }}
    </div>
    <div v-if="loading" class="text-sm text-gray-500">Memuat data…</div>

    <DataTable  v-else  title="Daftar Pengumuman"  :rows="tableRows"  :columns="columns"  :rowKey="(r) => r.id" :show-actions="true">
      <template #cell-level="{ row }">
        <span
          class="text-[11px] px-2 py-0.5 rounded"
          :class="{
            'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300': row.level==='urgent',
            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300': row.level==='warning',
            'bg-emerald-100 dark:bg-emerald-900/30': row.level==='info'
          }"
        >{{ row.level }}</span>
      </template>

      <template #cell-active="{ row }">
        <label class="inline-flex items-center gap-2 text-xs">
          <input type="checkbox" :checked="!!row.active" @change="toggleActive(row)" />
          <span>{{ row.active ? 'Aktif' : 'Nonaktif' }}</span>
        </label>
      </template>

      <template #cell-schedule="{ row }">
        <div class="text-xs">
          <div class="font-medium">{{ scheduleLabel(row) }}</div>
          <div class="text-gray-500 dark:text-neutral-400">Next: {{ nextOne(row) }}</div>
        </div>
      </template>

      <template #cell-lastAnnouncedAt="{ row }">
        <span class="text-xs">{{ fmtDateTime(row.lastAnnouncedAt) || '-' }}</span>
      </template>

      <template #cell-action="{ row }">
        <div class="flex items-center gap-2">
          <button @click="testSpeak(row)" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
            Test
          </button>
          <button @click="openEdit(row)" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
            Edit
          </button>
          <button @click="openConfirm(row)" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">
            Hapus
          </button>
        </div>
      </template>
    </DataTable>

    <ModalShell v-model="showForm" :title="formMode==='create' ? 'Tambah Pengumuman' : 'Ubah Pengumuman'">
      <form class="space-y-4 overflow-y-auto scrollbar-none max-h-[70vh]" @submit.prevent="submitForm">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Judul</label>
            <input v-model.trim="form.title" required class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Kategori</label>
            <input v-model.trim="form.category" placeholder="umum / event / darurat" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
        </div>
        <div>
          <label class="text-xs text-gray-600 dark:text-neutral-300">Pesan</label>
          <textarea v-model.trim="form.message" rows="3" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"></textarea>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Level</label>
            <select v-model="form.level" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
              <option value="info">info</option>
              <option value="warning">warning</option>
              <option value="urgent">urgent</option>
            </select>
          </div>
          <div class="flex items-end gap-2">
            <label class="text-xs text-gray-600 dark:text-neutral-300 w-full">
              <span>Aktif</span>
              <div class="mt-1">
                <input type="checkbox" v-model="form.active" />
                <span class="ml-2 text-xs">{{ form.active ? 'Ya' : 'Tidak' }}</span>
              </div>
            </label>
          </div>
        </div>
        <div>
          <label class="text-xs text-gray-600 dark:text-neutral-300">Hari</label>
          <div class="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <label v-for="(label, idx) in dayLabels" :key="idx" class="flex items-center gap-2 border rounded px-2 py-1">
              <input type="checkbox" :value="idx" v-model="daysTemp" />
              <span>{{ label }}</span>
            </label>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between">
            <label class="text-xs text-gray-600 dark:text-neutral-300">Jam</label>
            <button type="button" @click="addTime()" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">+ Jam</button>
          </div>
          <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <div v-for="(t, i) in timesTemp" :key="i" class="flex items-center gap-2">
              <input type="time" step="60" v-model="timesTemp[i]" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
              <button type="button" @click="removeTime(i)" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Hapus</button>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Mulai (opsional)</label>
            <input type="date" v-model="startDateInput" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Selesai (opsional)</label>
            <input type="date" v-model="endDateInput" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Bahasa</label>
            <input v-model.trim="form.ttsLang" placeholder="id-ID" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Voice</label>
            <select v-model="form.ttsVoice" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
              <option value="">(Auto)</option>
              <option v-for="v in voices" :key="v.name + v.lang" :value="v.name">{{ v.name }} — {{ v.lang }}</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Rate</label>
            <input type="number" step="0.1" min="0.5" max="2" v-model.number="form.ttsRate" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Pitch</label>
            <input type="number" step="0.1" min="0" max="2" v-model.number="form.ttsPitch" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
        </div>
        <div class="flex items-center gap-2">
          <label class="flex items-center gap-2 text-xs">
            <input type="checkbox" v-model="form.ttsEnabled" />
            Aktifkan TTS untuk item ini
          </label>
          <span class="text-xs text-gray-500">Preview: {{ schedulePreview }}</span>
        </div>
        <p v-if="formError" class="text-sm text-rose-600">{{ formError }}</p>
      </form>

      <template #footer>
        <button @click="showForm=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="saving" @click="submitForm" class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
          {{ saving ? 'Menyimpan…' : (formMode==='create' ? 'Simpan' : 'Update') }}
        </button>
      </template>
    </ModalShell>

    <ModalShell v-model="showConfirm" title="Hapus Pengumuman">
      <p class="text-sm text-gray-700 dark:text-neutral-200">
        Hapus pengumuman <strong>{{ current?.title }}</strong>?
      </p>
      <template #footer>
        <button @click="showConfirm=false" class="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="deleting" @click="confirmDelete" class="px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60">
          {{ deleting ? 'Menghapus…' : 'Hapus' }}
        </button>
      </template>
    </ModalShell>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import DataTable from '~/components/widget/DataTable.vue'
import ModalShell from '~/components/widget/ModalShell.vue'
import { useAnnouncements, type AnnouncementRow } from '~/composables/data/useAnnouncements'

definePageMeta({ layout: 'app', layoutProps: { title: 'Pengumuman' } })

const {
  rows, loading, error,
  fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement,
  subscribeAnnouncements, unsubscribeAnnouncements,
  getDueAnnouncements, markAnnounced, scheduleLabel, nextOccurrencesOf
} = useAnnouncements()

const supportsTTS = typeof window !== 'undefined' && 'speechSynthesis' in window
const ttsEnabledGlobal = ref(true)
const voices = ref<SpeechSynthesisVoice[]>([])

function loadVoices() {
  if (!supportsTTS) return
  const v = window.speechSynthesis.getVoices()
  if (v && v.length) voices.value = v
}
if (supportsTTS) {
  loadVoices()
  window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
}

let ticker: any = null
function startTicker() {
  stopTicker()
  ticker = setInterval(checkDue, 15000)
}
function stopTicker() { if (ticker) { clearInterval(ticker); ticker = null } }

async function checkDue() {
  if (!ttsEnabledGlobal.value || !supportsTTS) return
  const due = getDueAnnouncements(new Date(), 59)
  for (const r of due) {
    if (r.ttsEnabled === false) continue
    await speakAnnouncement(r, { mark: true })
  }
}

const columns = [
  { key: 'title', label: 'Judul', sortable: true },
  { key: 'level', label: 'Level', sortable: true },
  { key: 'active', label: 'Aktif', sortable: false },
  { key: 'schedule', label: 'Jadwal', sortable: false },
  { key: 'lastAnnouncedAt', label: 'Terakhir Diumumkan', sortable: true }
]
const tableRows = computed(() =>
  rows.value.map(r => ({
    ...r,
    schedule: scheduleLabel(r)
  }))
)

// -------- Helpers --------
function fmtDateTime(ms?: number | null) {
  if (!ms) return ''
  try { return new Date(ms).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) } catch { return '' }
}
function nextOne(r: AnnouncementRow) {
  const next = nextOccurrencesOf(r, 1)[0]
  return next ? next.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'
}

// -------- Actions in table --------
function toggleActive(row: AnnouncementRow) {
  updateAnnouncement(row.id, { active: !row.active }, { refresh: false })
}
function testSpeak(row: AnnouncementRow) {
  speakAnnouncement(row, { mark: false })
}

// -------- Speak helper --------
function pickVoice(lang?: string, wantName?: string) {
  if (!supportsTTS) return undefined
  const list = voices.value.length ? voices.value : window.speechSynthesis.getVoices()
  if (wantName) {
    const exact = list.find(v => v.name === wantName)
    if (exact) return exact
    const fuzzy = list.find(v => v.name.toLowerCase().includes(wantName.toLowerCase()))
    if (fuzzy) return fuzzy
  }
  if (lang) {
    const byLang = list.find(v => v.lang === lang)
    if (byLang) return byLang
  }
  return list[0]
}
async function speakAnnouncement(r: AnnouncementRow, opts: { mark?: boolean } = {}) {
  if (!supportsTTS) return
  // stop suara sebelumnya
  window.speechSynthesis.cancel()

  const text = `${r.title ? r.title + '. ' : ''}${r.message}`
  const u = new SpeechSynthesisUtterance(text)
  u.lang = r.ttsLang || 'id-ID'
  u.rate = r.ttsRate && r.ttsRate > 0 ? r.ttsRate : 1
  u.pitch = r.ttsPitch && r.ttsPitch > 0 ? r.ttsPitch : 1
  const voice = pickVoice(r.ttsLang, r.ttsVoice)
  if (voice) u.voice = voice

  if (opts.mark) {
    const onStart = () => {
      markAnnounced(r.id, Date.now())
      u.removeEventListener('start', onStart)
    }
    u.addEventListener('start', onStart)
  }

  window.speechSynthesis.speak(u)
}

// -------- Form state --------
const showForm = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const saving = ref(false)
const formError = ref<string | null>(null)
const current = ref<AnnouncementRow | null>(null)

const dayLabels = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']

const form = reactive<Omit<AnnouncementRow, 'id'>>({
  title: '',
  message: '',
  days: [],
  times: [],
  startDate: null,
  endDate: null,
  active: true,
  category: '',
  level: 'info',
  ttsEnabled: true,
  ttsLang: 'id-ID',
  ttsVoice: '',
  ttsRate: 1,
  ttsPitch: 1,
  speakerChannel: 'main',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  lastAnnouncedAt: null
})

const daysTemp = ref<number[]>([])
const timesTemp = ref<string[]>(['07:00'])
const startDateInput = ref<string>('') // YYYY-MM-DD
const endDateInput = ref<string>('')

const schedulePreview = computed(() => {
  const tempRow: AnnouncementRow = {
    ...(current.value || { id: 'tmp' } as any),
    ...form,
    days: daysTemp.value.slice(),
    times: timesTemp.value.slice()
  } as AnnouncementRow
  const next = nextOccurrencesOf(tempRow, 1)[0]
  return next ? next.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'
})

function addTime() { timesTemp.value.push('07:00') }
function removeTime(i: number) { timesTemp.value.splice(i, 1) }

function openCreate() {
  formMode.value = 'create'
  resetForm()
  showForm.value = true
}
function openEdit(row: AnnouncementRow) {
  formMode.value = 'edit'
  current.value = row
  form.title = row.title || ''
  form.message = row.message || ''
  form.active = row.active !== false
  form.category = row.category || ''
  form.level = row.level || 'info'
  form.ttsEnabled = row.ttsEnabled !== false
  form.ttsLang = row.ttsLang || 'id-ID'
  form.ttsVoice = row.ttsVoice || ''
  form.ttsRate = row.ttsRate || 1
  form.ttsPitch = row.ttsPitch || 1
  form.speakerChannel = row.speakerChannel || 'main'
  form.startDate = row.startDate ?? null
  form.endDate = row.endDate ?? null
  daysTemp.value = (row.days || []).slice()
  timesTemp.value = (row.times || []).slice()
  startDateInput.value = row.startDate ? toYMD(row.startDate) : ''
  endDateInput.value = row.endDate ? toYMD(row.endDate) : ''
  formError.value = null
  showForm.value = true
}

function resetForm() {
  current.value = null
  form.title = ''
  form.message = ''
  form.days = []
  form.times = []
  form.startDate = null
  form.endDate = null
  form.active = true
  form.category = ''
  form.level = 'info'
  form.ttsEnabled = true
  form.ttsLang = 'id-ID'
  form.ttsVoice = ''
  form.ttsRate = 1
  form.ttsPitch = 1
  form.speakerChannel = 'main'
  form.lastAnnouncedAt = null
  daysTemp.value = []
  timesTemp.value = ['07:00']
  startDateInput.value = ''
  endDateInput.value = ''
  formError.value = null
}

function toYMD(ms: number) {
  const d = new Date(ms)
  const pad = (n:number)=>String(n).padStart(2,'0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
}
function ymdToMs(ymd: string | undefined): number | null {
  if (!ymd) return null
  const [y,m,d] = ymd.split('-').map(Number)
  if (!y || !m || !d) return null
  const dt = new Date(y, m-1, d, 0, 0, 0, 0)
  return isNaN(dt.getTime()) ? null : dt.getTime()
}

async function submitForm() {
  if (!form.title?.trim()) { formError.value = 'Judul wajib diisi.'; return }
  if ((daysTemp.value?.length || 0) === 0) { formError.value = 'Pilih minimal 1 hari.'; return }
  if ((timesTemp.value?.length || 0) === 0) { formError.value = 'Tambahkan minimal 1 jam.'; return }

  form.days = daysTemp.value.slice()
  form.times = timesTemp.value.filter(Boolean)

  form.startDate = ymdToMs(startDateInput.value || undefined)
  form.endDate = ymdToMs(endDateInput.value || undefined)

  saving.value = true
  try {
    if (formMode.value === 'create') {
      await createAnnouncement({ ...form })
    } else if (current.value?.id) {
      await updateAnnouncement(current.value.id, { ...form })
    }
    showForm.value = false
  } catch (e: any) {
    formError.value = e?.message ?? 'Gagal menyimpan data'
  } finally {
    saving.value = false
  }
}

const showConfirm = ref(false)
const deleting = ref(false)
function openConfirm(row: AnnouncementRow) {
  current.value = row
  showConfirm.value = true
}
async function confirmDelete() {
  if (!current.value?.id) return
  deleting.value = true
  try {
    await deleteAnnouncement(current.value.id)
    showConfirm.value = false
  } finally {
    deleting.value = false
  }
}

// -------- Lifecycle --------
const reload = () => fetchAnnouncements()
onMounted(async () => {
  await fetchAnnouncements()
  subscribeAnnouncements()
  startTicker()
})
onBeforeUnmount(() => {
  stopTicker()
  unsubscribeAnnouncements()
  if (supportsTTS) window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
})
</script>
