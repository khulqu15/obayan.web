<template>
  <div class="space-y-6 p-6">
    <!-- Header -->
    <div class="flex items-center flex-wrap gap-3 justify-between">
      <h1 class="text-xl font-semibold">Data Santri</h1>
      <div class="flex items-center flex-wrap gap-3 gap-2">
        <button @click="openCreate()" class="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">
          + Tambah Santri
        </button>
        <button @click="reload" class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
          Muat Ulang
        </button>
      </div>
    </div>

    <div v-if="error" class="p-3 rounded border border-rose-200 bg-rose-50 text-rose-700 text-sm dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300">
      {{ error }}
    </div>
    <div v-if="loading" class="text-sm text-gray-500">Memuat data...</div>

    <!-- ===================== TABEL: CALON SANTRI (TAHUN INI) ===================== -->
    <section v-if="!loading" class="space-y-3">
      <div class="flex items-center flex-wrap gap-3 justify-between">
        <h2 class="text-base font-semibold">Calon Santri ({{ currentYear }})</h2>
        <div class="flex flex-wrap items-center gap-2">
          <!-- Filters -->
          <input v-model="filtersCalon.q" placeholder="Cari nama / wali / alamat…" class="w-52 text-xs px-3 py-1.5 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          <select v-model="filtersCalon.status" class="text-xs px-2 py-1.5 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
            <option value="semua">Semua Status</option>
            <option v-for="s in statusOptionsCalon" :key="s" :value="s">{{ s }}</option>
          </select>
          <select v-model="filtersCalon.jenjang" class="text-xs px-2 py-1.5 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
            <option value="semua">Semua Jenjang</option>
            <option v-for="j in jenjangOptionsCalon" :key="j" :value="j">{{ j }}</option>
          </select>

          <!-- Import / Export -->
          <input type="file" ref="fileInputCalon" class="hidden" accept=".xlsx,.xls,.csv" @change="handleImport('calon', $event)" />
          <button @click="triggerImport('calon')" class="text-xs px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700">Import</button>
          <button @click="downloadTemplate('calon')" class="text-xs px-3 py-1.5 rounded border border-dashed border-gray-300 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
            Template CSV
          </button>
          <button @click="exportCSV(filteredCalonRows, `calon_santri_${currentYear}.csv`)" class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Export CSV</button>
          <button @click="exportExcel(filteredCalonRows, `calon_santri_${currentYear}.xlsx`)" class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Export Excel</button>
        </div>
      </div>

      <DataTable
        title="Calon Santri"
        :rows="filteredCalonRows"
        :columns="columns"
        :rowKey="(r) => r.id"
      >
        <template #cell-nohp="{ row }">
          <a v-if="row.nohp" :href="`tel:${row.nohp}`" class="text-blue-600 hover:underline">{{ row.nohp }}</a>
          <span v-else class="text-gray-400">-</span>
        </template>

        <template #cell-status="{ row }">
          <p class="capitalize">{{ row.status == 'nonaktif' ? 'calon santri' : 'santri baru' }}</p>
        </template>

        <template #cell-kuotaKunjunganBulanIni="{ row }">
          <span
            :class="[
              'text-xs px-2 py-0.5 rounded',
              (row.kuotaKunjunganBulanIni ?? 0) > 0
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
            ]"
          >
            {{ row.kuotaKunjunganBulanIni ?? 0 }}x / bulan ini
          </span>
        </template>

        <template #cell-kamar="{row}">
          {{ row.kamar }} - {{ row.maskan }}
        </template>

        <template #cell-action="{ row }">
          <div class="flex items-center flex-wrap gap-3 gap-2">
            <button @click="openEdit(row)" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Edit</button>
            <button @click="openConfirm(row)" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">Hapus</button>
          </div>
        </template>
      </DataTable>
    </section>

    <!-- ===================== TABEL: SANTRI LAMA ===================== -->
    <section v-if="!loading" class="space-y-3">
      <div class="flex items-center flex-wrap gap-3 justify-between">
        <h2 class="text-base font-semibold">Santri Lama</h2>
        <div class="flex flex-wrap items-center gap-2">
          <!-- Filters -->
          <input v-model="filtersLama.q" placeholder="Cari nama / wali / alamat…" class="w-52 text-xs px-3 py-1.5 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          <select v-model="filtersLama.status" class="text-xs px-2 py-1.5 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
            <option value="semua">Semua Status</option>
            <option v-for="s in statusOptionsLama" :key="s" :value="s">{{ s }}</option>
          </select>
          <select v-model="filtersLama.jenjang" class="text-xs px-2 py-1.5 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
            <option value="semua">Semua Jenjang</option>
            <option v-for="j in jenjangOptionsLama" :key="j" :value="j">{{ j }}</option>
          </select>

          <!-- Import / Export -->
          <input type="file" ref="fileInputLama" class="hidden" accept=".xlsx,.xls,.csv" @change="handleImport('lama', $event)" />
          <button @click="triggerImport('lama')" class="text-xs px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700">Import</button>
          <button @click="downloadTemplate('lama')" class="text-xs px-3 py-1.5 rounded border border-dashed border-gray-300 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
            Template CSV
          </button>
          <button @click="exportCSV(filteredLamaRows, 'santri_lama.csv')" class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Export CSV</button>
          <button @click="exportExcel(filteredLamaRows, 'santri_lama.xlsx')" class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Export Excel</button>
        </div>
      </div>

      <DataTable
        title="Santri Lama"
        :rows="filteredLamaRows"
        :columns="columns"
        :rowKey="(r) => r.id"
      >
        <template #cell-nohp="{ row }">
          <a v-if="row.nohp" :href="`tel:${row.nohp}`" class="text-blue-600 hover:underline">{{ row.nohp }}</a>
          <span v-else class="text-gray-400">-</span>
        </template>

        <template #cell-kuotaKunjunganBulanIni="{ row }">
          <span
            :class="[
              'text-xs px-2 py-0.5 rounded',
              (row.kuotaKunjunganBulanIni ?? 0) > 0
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
            ]"
          >
            {{ row.kuotaKunjunganBulanIni ?? 0 }}x / bulan ini
          </span>
        </template>

        <template #cell-kamar="{row}">
          {{ row.kamar }} - {{ row.maskan }}
        </template>

        <template #cell-action="{ row }">
          <div class="flex items-center flex-wrap gap-3 gap-2">
            <button @click="openEdit(row)" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Edit</button>
            <button @click="openConfirm(row)" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">Hapus</button>
          </div>
        </template>
      </DataTable>
    </section>

    <!-- ========== MODALS ========== -->
    <ModalShell v-model="showForm" :title="formMode === 'create' ? 'Tambah Santri' : 'Ubah Santri'">
      <form class="space-y-3" @submit.prevent="submitForm">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Gen</label>
            <input v-model.trim="form.gen" required class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" placeholder="mis. 2024"/>
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Nama Santri</label>
            <input v-model.trim="form.santri" required class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Wali Santri</label>
            <input v-model.trim="form.walisantri" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">No HP Wali</label>
            <input v-model.trim="form.nohp" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Kuota Kunjungan</label>
            <input v-model.number="form.kuotaKunjunganBulanIni" type="number" min="0" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Kamar</label>
            <input v-model.trim="form.kamar" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Jenjang</label>
            <input v-model.trim="form.jenjang" placeholder="KMI / MTs / MA / ..." class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Status</label>
            <select v-model="form.status" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
              <option value="lulus">Lulus</option>
              <option value="cuti">Cuti</option>
            </select>
          </div>
          <div class="sm:col-span-2">
            <label class="text-xs text-gray-600 dark:text-neutral-300">Alamat</label>
            <textarea v-model.trim="form.alamat" rows="2" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" placeholder="Alamat lengkap wali/santri" />
          </div>
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

    <ModalShell v-model="showConfirm" title="Hapus Data">
      <p class="text-sm text-gray-700 dark:text-neutral-200">
        Apakah Anda yakin ingin menghapus data santri
        <strong>{{ current?.santri }}</strong>? Tindakan ini tidak dapat dibatalkan.
      </p>
      <template #footer>
        <button @click="showConfirm=false" class="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="deleting" @click="confirmDelete" class="px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60">
          {{ deleting ? 'Menghapus…' : 'Hapus' }}
        </button>
      </template>
    </ModalShell>

    <!-- Modal Progress Import -->
    <ModalShell v-model="showProgress" :title="`Import Data (${importTargetLabel})`">
      <div class="space-y-3">
        <div class="w-full bg-gray-200 dark:bg-neutral-800 rounded h-3 overflow-hidden">
          <div class="bg-blue-600 h-3 transition-all duration-300" :style="{ width: progress+'%' }"></div>
        </div>
        <p class="text-sm text-gray-700 dark:text-neutral-200">{{ progressStatus }}</p>
      </div>
      <template #footer>
        <button
          @click="showProgress=false"
          class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-800"
          :disabled="progress < 100"
        >Tutup</button>
      </template>
    </ModalShell>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue'
import DataTable from '~/components/widget/DataTable.vue'
import ModalShell from '~/components/widget/ModalShell.vue'
import { useSantri, type SantriRow } from '~/composables/data/useSantri'

definePageMeta({ layout: 'app', layoutProps: { title: 'Santri' } })

const { rows, loading, error, fetchSantri, createSantri, updateSantri, deleteSantri, importFromExcelWithProgress } = useSantri()
onMounted(fetchSantri)
const reload = () => fetchSantri()

/** ================= Columns (shared) ================= */
const columns = [
  { key: 'gen', label: 'Gen', sortable: true },
  { key: 'santri', label: 'Santri', sortable: true },
  { key: 'walisantri', label: 'Wali Santri', sortable: true },
  { key: 'nohp', label: 'No. HP Wali', sortable: true },
  { key: 'kuotaKunjunganBulanIni', label: 'Kuota Kunjungan (bln ini)', sortable: true },
  { key: 'kamar', label: 'Kamar', sortable: true },
  { key: 'alamat', label: 'Alamat', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'jenjang', label: 'Jenjang', sortable: true },
  { key: 'action', label: '', sortable: false },
]

/** ================= Split logic: Calon tahun ini vs Santri lama ================= */
const currentYear = new Date().getFullYear()

function extractYear(r: any): number | null {
  // Prefer parse from ppdbCode: ALB-YYYYMMDD-XXXXX
  if (typeof r?.ppdbCode === 'string' && /^ALB-\d{8}-/i.test(r.ppdbCode)) {
    return parseInt(r.ppdbCode.slice(4, 8))
  }
  // Try createdAt (number or Firestore-like)
  const ca = (r as any)?.createdAt
  if (typeof ca === 'number') return new Date(ca).getFullYear()
  if (ca && typeof ca === 'object') {
    // Firestore timestamp {_seconds}
    const ms = ca._seconds ? ca._seconds * 1000 : ca?.toMillis?.()
    if (ms) return new Date(ms).getFullYear()
  }
  // Fallback to gen if 4-digit
  const g = (r as any)?.gen
  if (g && /^\d{4}$/.test(String(g))) return parseInt(g)
  return null
}

function isCalonThisYear(r: any): boolean {
  const y = extractYear(r)
  const yearMatch = (y === currentYear)
  const hasPpdb = 'ppdbCode' in r || 'ppdb' in r || ('username' in r && 'publicToken' in r)
  const looksNew = (r.status === 'nonaktif') && (!r.kamar || r.kamar === '-' )
  return (yearMatch && (hasPpdb || looksNew))
}

const rowsCalon = computed(() => (rows.value || []).filter(isCalonThisYear))
const rowsLama  = computed(() => (rows.value || []).filter(r => !isCalonThisYear(r)))

/** ================= Filters per table ================= */
type Filters = { q: string, status: string, jenjang: string }
const filtersCalon = reactive<Filters>({ q: '', status: 'semua', jenjang: 'semua' })
const filtersLama  = reactive<Filters>({ q: '', status: 'semua', jenjang: 'semua' })

function matchSearch(r: SantriRow, q: string) {
  if (!q) return true
  const s = q.toLowerCase()
  const hay = [
    r.santri, r.walisantri, r.nohp, r.kamar, (r as any).maskan, r.alamat, r.jenjang, r.gen, r.status
  ].map(v => String(v || '').toLowerCase()).join(' | ')
  return hay.includes(s)
}
function matchStatus(r: SantriRow, st: string) {
  if (st === 'semua') return true
  return String(r.status || '').toLowerCase() === st.toLowerCase()
}
function matchJenjang(r: SantriRow, jj: string) {
  if (jj === 'semua') return true
  return String(r.jenjang || '').toLowerCase() === jj.toLowerCase()
}

const filteredCalonRows = computed(() =>
  rowsCalon.value
    .filter(r => matchSearch(r, filtersCalon.q))
    .filter(r => matchStatus(r, filtersCalon.status))
    .filter(r => matchJenjang(r, filtersCalon.jenjang))
)

const filteredLamaRows = computed(() =>
  rowsLama.value
    .filter(r => matchSearch(r, filtersLama.q))
    .filter(r => matchStatus(r, filtersLama.status))
    .filter(r => matchJenjang(r, filtersLama.jenjang))
)

// Build options dynamically dari dataset masing-masing
const statusOptionsCalon = computed(() => uniqueNonEmpty(rowsCalon.value.map(r => r.status)))
const statusOptionsLama  = computed(() => uniqueNonEmpty(rowsLama.value.map(r => r.status)))
const jenjangOptionsCalon = computed(() => uniqueNonEmpty(rowsCalon.value.map(r => r.jenjang)))
const jenjangOptionsLama  = computed(() => uniqueNonEmpty(rowsLama.value.map(r => r.jenjang)))

function uniqueNonEmpty(arr: (string|number|undefined|null)[]) {
  return [...new Set(arr.map(v => String(v || '').trim()).filter(Boolean))]
}

/** ================= Import per tabel (dengan progress) ================= */
const fileInputCalon = ref<HTMLInputElement | null>(null)
const fileInputLama  = ref<HTMLInputElement | null>(null)

function triggerImport(which: 'calon'|'lama') {
  (which === 'calon' ? fileInputCalon.value : fileInputLama.value)?.click()
}

const showProgress = ref(false)
const progress = ref(0)
const progressStatus = ref("")
const importTargetLabel = ref('')

async function handleImport(which: 'calon'|'lama', e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return

  importTargetLabel.value = which === 'calon' ? `Calon Santri (${currentYear})` : 'Santri Lama'
  showProgress.value = true
  progress.value = 0
  progressStatus.value = "Menyiapkan import..."

  await importFromExcelWithProgress(input.files[0]!, (percent, status) => {
    progress.value = percent
    progressStatus.value = status
  })

  input.value = ""
  await fetchSantri()
}

/** ================= Export & Template ================= */
const csvHeaders = ['gen','santri','walisantri','nohp','kuotaKunjunganBulanIni','kamar','alamat','status','jenjang'] as const
type CsvRow = Record<(typeof csvHeaders)[number], string|number|null|undefined>

function mapRowToCsv(r: SantriRow): CsvRow {
  return {
    gen: r.gen ?? '',
    santri: r.santri ?? '',
    walisantri: r.walisantri ?? '',
    nohp: r.nohp ?? '',
    kuotaKunjunganBulanIni: r.kuotaKunjunganBulanIni ?? 0,
    kamar: r.kamar ?? '',
    alamat: r.alamat ?? '',
    status: (r.status as any) ?? '',
    jenjang: r.jenjang ?? ''
  }
}

function toCSV(rows: SantriRow[]) {
  const esc = (v: any) => {
    const s = String(v ?? '')
    const needs = /[",\n]/.test(s)
    const x = s.replace(/"/g, '""')
    return needs ? `"${x}"` : x
  }
  const head = csvHeaders.join(',')
  const body = rows.map(r => csvHeaders.map(h => esc((mapRowToCsv(r) as any)[h])).join(',')).join('\n')
  return head + '\n' + body
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function exportCSV(source: SantriRow[], filename: string) {
  const csv = toCSV(source)
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(filename, blob)
}

async function exportExcel(source: SantriRow[], filename: string) {
  try {
    // dynamic import agar ringan; fallback ke CSV bila gagal
    // @ts-ignore
    const XLSX = (await import('xlsx')).default || (await import('xlsx'))
    const data = source.map(r => mapRowToCsv(r))
    const ws = XLSX.utils.json_to_sheet(data, { header: csvHeaders as any })
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Data')
    XLSX.writeFile(wb, filename)
  } catch (e) {
    console.warn('xlsx tidak tersedia, fallback ke CSV', e)
    exportCSV(source, filename.replace(/\.xlsx$/i, '.csv'))
  }
}

function downloadTemplate(which: 'calon'|'lama') {
  // template default: baris contoh 1 record
  const example: CsvRow = {
    gen: String(currentYear),
    santri: which==='calon' ? 'Ahmad Contoh' : 'Budi Contoh',
    walisantri: which==='calon' ? 'H. Sulaiman' : 'Sdr. Wali',
    nohp: '081234567890',
    kuotaKunjunganBulanIni: which==='calon' ? 0 : 2,
    kamar: which==='calon' ? '-' : 'B2',
    alamat: 'Jl. Mawar No. 5, Desa Sejuk',
    status: which==='calon' ? 'nonaktif' : 'aktif',
    jenjang: which==='calon' ? 'KMI • MTs 1' : 'KMI • MA 2'
  }
  const head = csvHeaders.join(',')
  const esc = (v: any) => {
    const s = String(v ?? '')
    const needs = /[",\n]/.test(s)
    const x = s.replace(/"/g, '""')
    return needs ? `"${x}"` : x
  }
  const row = csvHeaders.map(h => esc((example as any)[h])).join(',')
  const csv = head + '\n' + row
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const name = which==='calon' ? `template_csu_${currentYear}.csv` : 'template_santri_lama.csv'
  downloadBlob(name, blob)
}

/** ================= CRUD form ================= */
const showForm = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const saving = ref(false)
const formError = ref<string | null>(null)
const current = ref<SantriRow | null>(null)
const form = reactive<Omit<SantriRow, 'id'>>({
  gen: '',
  santri: '',
  walisantri: '',
  nohp: '',
  kuotaKunjunganBulanIni: 0,
  kamar: '',
  jenjang: '',
  alamat: '',
  status: 'aktif'
})
function resetForm() {
  form.gen = ''
  form.santri = ''
  form.walisantri = ''
  form.nohp = ''
  form.kuotaKunjunganBulanIni = 0
  form.kamar = ''
  form.jenjang = ''
  form.alamat = ''
  form.status = 'aktif'
  formError.value = null
}
function openCreate() {
  formMode.value = 'create'
  resetForm()
  showForm.value = true
}
function openEdit(row: SantriRow) {
  formMode.value = 'edit'
  current.value = row
  form.gen = row.gen || ''
  form.santri = row.santri
  form.walisantri = row.walisantri || ''
  form.nohp = row.nohp || ''
  form.kuotaKunjunganBulanIni = row.kuotaKunjunganBulanIni ?? 0
  form.kamar = row.kamar || ''
  form.jenjang = row.jenjang || ''
  form.alamat = row.alamat || ''
  form.status = (row.status as any) || 'aktif'
  formError.value = null
  showForm.value = true
}
async function submitForm() {
  if (!form.santri?.trim()) { formError.value = 'Nama santri wajib diisi.'; return }
  if (!form.gen?.trim())     { formError.value = 'Gen wajib diisi.'; return }
  saving.value = true
  try {
    if (formMode.value === 'create') {
      await createSantri({ ...form })
    } else if (current.value?.id) {
      await updateSantri(current.value.id, { ...form })
    }
    showForm.value = false
    await fetchSantri()
  } catch (e: any) {
    formError.value = e?.message ?? 'Gagal menyimpan data'
  } finally {
    saving.value = false
  }
}

/** ================= Delete ================= */
const showConfirm = ref(false)
const deleting = ref(false)
function openConfirm(row: SantriRow) {
  current.value = row
  showConfirm.value = true
}
async function confirmDelete() {
  if (!current.value?.id) return
  deleting.value = true
  try {
    await deleteSantri(current.value.id)
    showConfirm.value = false
    await fetchSantri()
  } catch (e) {
  } finally {
    deleting.value = false
  }
}
</script>
