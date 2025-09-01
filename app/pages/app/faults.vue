<template>
  <div class="space-y-4 p-6">
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-xl font-semibold">Manajemen Pelanggaran Santri</h1>
      <div class="flex items-center gap-2">
        <button @click="openCreate()" class="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">
          + Tambah Pelanggaran
        </button>
        <button @click="reload" class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
          Muat Ulang
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="p-4 rounded-xl border border-gray-200 bg-white shadow-xs dark:bg-neutral-800 dark:border-neutral-700">
      <div class="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3">
        <div>
          <label class="block text-xs text-gray-500 dark:text-neutral-400 mb-1">Cari Nama</label>
          <input v-model.trim="filters.name" type="search" placeholder="Ketik nama santri…"
                 class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"/>
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-neutral-400 mb-1">Maskan</label>
          <select v-model="filters.maskan" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
            <option value="">Semua</option>
            <option v-for="m in maskanOptions" :key="m" :value="m">{{ m || '(Kosong)' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-neutral-400 mb-1">Kamar</label>
          <select v-model="filters.kamar" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
            <option value="">Semua</option>
            <option v-for="k in kamarOptions" :key="k" :value="k">{{ k || '(Kosong)' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-neutral-400 mb-1">Urutkan</label>
          <select v-model="sortPreset" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
            <option value="tanggal_desc">Tanggal ↓</option>
            <option value="tanggal_asc">Tanggal ↑</option>
            <option value="santri_asc">Nama A–Z</option>
            <option value="santri_desc">Nama Z–A</option>
            <option value="maskan_asc">Maskan A–Z</option>
            <option value="maskan_desc">Maskan Z–A</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Alerts -->
    <div v-if="error" class="p-3 rounded border border-rose-200 bg-rose-50 text-rose-700 text-sm dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300">
      {{ error }}
    </div>
    <div v-if="loading" class="text-sm text-gray-500">Memuat data…</div>

    <!-- Table -->
    <DataTable
      v-else
      title="Daftar Pelanggaran"
      :rows="tableRows"
      :columns="columns"
      :rowKey="(r) => r.id"
    >
      <template #cell-tanggal="{ row }">
        <span class="whitespace-nowrap">{{ fmtDate(row.tanggal) }}</span>
      </template>

      <template #cell-poin="{ row }">
        <span class="text-xs px-2 py-0.5 rounded"
          :class="(row.poin||0) >= 10
            ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
            : (row.poin||0) >= 5
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'">
          {{ row.poin || 0 }}
        </span>
      </template>

      <template #cell-status="{ row }">
        <span class="text-xs px-2 py-0.5 rounded"
          :class="row.status==='selesai'
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
            : row.status==='diproses'
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
              : 'bg-gray-100 text-gray-700 dark:bg-neutral-700/50 dark:text-neutral-200'">
          {{ row.status || 'baru' }}
        </span>
      </template>

      <template #cell-action="{ row }">
        <div class="flex items-center gap-2">
          <button @click="openEdit(row)" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Edit</button>
          <button @click="openConfirm(row)" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">Hapus</button>
        </div>
      </template>
    </DataTable>

    <!-- Modal Form -->
    <ModalShell v-model="showForm" :title="formMode==='create' ? 'Tambah Pelanggaran' : 'Ubah Pelanggaran'">
      <form class="space-y-4 max-h-[60vh] overflow-y-auto scrollbar-none" @submit.prevent="submitForm">
        <!-- Autocomplete Santri -->
        <div>
          <label class="text-xs text-gray-600 dark:text-neutral-300">Santri</label>
          <div class="relative">
            <input
              v-model="santriQuery"
              @focus="showSantriSuggest = true"
              @input="onSantriInput"
              placeholder="Ketik nama santri lalu pilih…"
              class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"
            />
            <ul v-show="showSantriSuggest && santriQuery.trim().length > 0"
                class="absolute z-20 mt-1 max-h-60 overflow-auto w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-md shadow">
              <li v-for="s in santriSuggest" :key="s.id">
                <button
                  type="button"
                  class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800"
                  @click="pickSantri(s)"
                >
                  <div class="font-medium">{{ s.santri }}</div>
                  <div class="text-xs text-gray-500">{{ s.maskan || '-' }} • {{ s.kamar || '-' }} • {{ s.jenjang || '-' }}</div>
                </button>
              </li>
              <li v-if="!santriSuggest.length" class="px-3 py-2 text-xs text-gray-400">Tidak ditemukan</li>
            </ul>
          </div>
          <p class="text-[11px] mt-1 text-gray-500" v-if="!form.santriId">Pilih santri dari daftar agar data maskan/kamar terisi otomatis.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Tanggal & Waktu</label>
            <input type="datetime-local" v-model="tanggalInput"
                   class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Jenis Pelanggaran</label>
            <input v-model.trim="form.jenis" placeholder="Terlambat / Ikhtilat / ..." class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Kategori</label>
            <input v-model.trim="form.kategori" placeholder="Ringan / Sedang / Berat" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Poin</label>
            <input v-model.number="form.poin" type="number" min="0" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Maskan</label>
            <input v-model.trim="form.maskan" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Kamar</label>
            <input v-model.trim="form.kamar" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Jenjang</label>
            <input v-model.trim="form.jenjang" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Pelapor</label>
            <input v-model.trim="form.pelapor" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Status</label>
            <select v-model="form.status" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
              <option value="baru">baru</option>
              <option value="diproses">diproses</option>
              <option value="selesai">selesai</option>
            </select>
          </div>
        </div>

        <div>
          <label class="text-xs text-gray-600 dark:text-neutral-300">Deskripsi</label>
          <textarea v-model.trim="form.deskripsi" rows="3" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"></textarea>
        </div>
        <div>
          <label class="text-xs text-gray-600 dark:text-neutral-300">Tindakan</label>
          <textarea v-model.trim="form.tindakan" rows="2" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"></textarea>
        </div>
        <div>
          <label class="text-xs text-gray-600 dark:text-neutral-300">Lampiran URL (opsional)</label>
          <input v-model.trim="form.lampiranUrl" placeholder="https://..." class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
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

    <!-- Modal Hapus -->
    <ModalShell v-model="showConfirm" title="Hapus Pelanggaran">
      <p class="text-sm text-gray-700 dark:text-neutral-200">
        Hapus pelanggaran milik <strong>{{ current?.santri }}</strong> ({{ fmtDate(current?.tanggal) }})?
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
import { computed, onMounted, reactive, ref, watch } from 'vue'
import DataTable from '~/components/widget/DataTable.vue'
import ModalShell from '~/components/widget/ModalShell.vue'
import { useFaults, type FaultRow } from '~/composables/data/useFaults'
import { useSantri, type SantriRow } from '~/composables/data/useSantri'

definePageMeta({ layout: 'app', layoutProps: { title: 'Pelanggaran' } })

// Composables
const { rows: faultRows, loading, error, fetchFaults, createFault, updateFault, deleteFault } = useFaults()
const { rows: santriRows, fetchSantri } = useSantri()

onMounted(async () => {
  await Promise.all([fetchFaults(), fetchSantri()])
})

const reload = () => Promise.all([fetchFaults(), fetchSantri()])

const filters = reactive({ name: '', maskan: '', kamar: '' })
const sortPreset = ref<'tanggal_desc'|'tanggal_asc'|'santri_asc'|'santri_desc'|'maskan_asc'|'maskan_desc'>('tanggal_desc')

const maskanOptions = computed(() => {
  const set = new Set<string>()
  santriRows.value.forEach(s => set.add(s.maskan || ''))
  return Array.from(set).sort((a,b)=>a.localeCompare(b,'id'))
})
const kamarOptions = computed(() => {
  const set = new Set<string>()
  // Saring kamar berdasarkan maskan jika dipilih, supaya relevan
  const candidate = filters.maskan
    ? santriRows.value.filter(s => (s.maskan || '') === filters.maskan)
    : santriRows.value
  candidate.forEach(s => set.add(s.kamar || ''))
  return Array.from(set).sort((a,b)=>a.localeCompare(b,'id'))
})

const filteredFaults = computed(() => {
  const name = filters.name.trim().toLowerCase()
  const msk = filters.maskan
  const kmr = filters.kamar
  return faultRows.value.filter(r => {
    const okName = !name || (r.santri || '').toLowerCase().includes(name)
    const okMaskan = !msk || (r.maskan || '') === msk
    const okKamar = !kmr || (r.kamar || '') === kmr
    return okName && okMaskan && okKamar
  })
})

const sortedFaults = computed(() => {
  const arr = [...filteredFaults.value]
  const byStr = (k: keyof FaultRow, rev=false) =>
    arr.sort((a,b) => ((a[k]||'') as string).toString().localeCompare(((b[k]||'') as string).toString(),'id') * (rev?-1:1))
  const byNum = (k: keyof FaultRow, rev=false) =>
    arr.sort((a,b) => ((Number(a[k]||0)) - (Number(b[k]||0))) * (rev? -1: 1))

  switch (sortPreset.value) {
    case 'tanggal_asc':  return byNum('tanggal', false)
    case 'santri_asc':   return byStr('santri', false)
    case 'santri_desc':  return byStr('santri', true)
    case 'maskan_asc':   return byStr('maskan', false)
    case 'maskan_desc':  return byStr('maskan', true)
    case 'tanggal_desc':
    default:             return byNum('tanggal', true)
  }
})

// Baris final yang dilempar ke DataTable (DataTable masih punya search internal tambahan)
const tableRows = computed(() => sortedFaults.value)

// -------- Tabel definition --------
const columns = [
  { key: 'tanggal', label: 'Tanggal', sortable: true },
  { key: 'santri', label: 'Santri', sortable: true },
  { key: 'jenis', label: 'Jenis', sortable: true },
  { key: 'kategori', label: 'Kategori', sortable: true },
  { key: 'poin', label: 'Poin', sortable: true },
  { key: 'maskan', label: 'Maskan', sortable: true },
  { key: 'kamar', label: 'Kamar', sortable: true },
  { key: 'status', label: 'Status', sortable: true }
]

// -------- Helpers --------
function fmtDate(t?: number) {
  if (!t) return '-'
  try {
    return new Date(t).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
  } catch { return '-' }
}

function toLocalInputValue(ms?: number) {
  if (!ms) return ''
  const d = new Date(ms)
  const pad = (n:number) => String(n).padStart(2,'0')
  const yyyy = d.getFullYear()
  const MM = pad(d.getMonth()+1)
  const dd = pad(d.getDate())
  const hh = pad(d.getHours())
  const mm = pad(d.getMinutes())
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`
}

// -------- Form state --------
const showForm = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const saving = ref(false)
const formError = ref<string | null>(null)
const current = ref<FaultRow | null>(null)
const form = reactive<Omit<FaultRow, 'id'>>({
  santriId: '',
  santri: '',
  tanggal: Date.now(),
  jenis: 'Umum',
  kategori: '',
  poin: 0,
  deskripsi: '',
  pelapor: '',
  status: 'baru',
  tindakan: '',
  lampiranUrl: '',
  maskan: '',
  kamar: '',
  jenjang: ''
})

// input datetime-local binder
const tanggalInput = computed({
  get: () => toLocalInputValue(form.tanggal),
  set: (v: string) => {
    const t = v ? new Date(v).getTime() : Date.now()
    form.tanggal = isNaN(t) ? Date.now() : t
  }
})

// -------- Autocomplete Santri --------
const santriQuery = ref('')
const showSantriSuggest = ref(false)

const santriSuggest = computed(() => {
  const q = santriQuery.value.trim().toLowerCase()
  if (!q) return []
  return santriRows.value
    .filter(s => (s.santri || '').toLowerCase().includes(q))
    .slice(0, 8)
})

function onSantriInput() {
  showSantriSuggest.value = true
  // jangan reset langsung; tunggu pick
}

function pickSantri(s: SantriRow) {
  form.santriId = s.id
  form.santri = s.santri
  form.maskan = s.maskan || ''
  form.kamar = s.kamar || ''
  form.jenjang = s.jenjang || ''
  santriQuery.value = s.santri
  showSantriSuggest.value = false
}

// Tutup dropdown jika klik di luar
if (process.client) {
  window.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('[data-santri-autocomplete]')) {
      showSantriSuggest.value = false
    }
  })
}

// -------- Open/Reset Form --------
function resetForm() {
  form.santriId = ''
  form.santri = ''
  form.tanggal = Date.now()
  form.jenis = 'Umum'
  form.kategori = ''
  form.poin = 0
  form.deskripsi = ''
  form.pelapor = ''
  form.status = 'baru'
  form.tindakan = ''
  form.lampiranUrl = ''
  form.maskan = ''
  form.kamar = ''
  form.jenjang = ''
  santriQuery.value = ''
  formError.value = null
}

function openCreate() {
  formMode.value = 'create'
  resetForm()
  showForm.value = true
}

function openEdit(row: FaultRow) {
  formMode.value = 'edit'
  current.value = row
  // isi form
  form.santriId = row.santriId || ''
  form.santri = row.santri || ''
  form.tanggal = row.tanggal || Date.now()
  form.jenis = row.jenis || 'Umum'
  form.kategori = row.kategori || ''
  form.poin = row.poin || 0
  form.deskripsi = row.deskripsi || ''
  form.pelapor = row.pelapor || ''
  form.status = row.status || 'baru'
  form.tindakan = row.tindakan || ''
  form.lampiranUrl = row.lampiranUrl || ''
  form.maskan = row.maskan || ''
  form.kamar = row.kamar || ''
  form.jenjang = row.jenjang || ''
  santriQuery.value = row.santri || ''
  formError.value = null
  showForm.value = true
}

// -------- Submit/Delete --------
async function submitForm() {
  if (!(form.santriId || form.santri?.trim())) {
    formError.value = 'Santri wajib dipilih/diisi.'
    return
  }
  if (!form.tanggal) form.tanggal = Date.now()

  saving.value = true
  try {
    if (formMode.value === 'create') {
      await createFault({ ...form })
    } else if (current.value?.id) {
      await updateFault(current.value.id, { ...form })
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
function openConfirm(row: FaultRow) {
  current.value = row
  showConfirm.value = true
}
async function confirmDelete() {
  if (!current.value?.id) return
  deleting.value = true
  try {
    await deleteFault(current.value.id)
    showConfirm.value = false
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
/* marker untuk klik-luar autocomplete (optional jika mau gunakan) */
[data-santri-autocomplete] { position: relative; }
</style>
