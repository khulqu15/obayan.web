<template>
  <div class="relative">
    <!-- Soft Deco -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-white dark:bg-neutral-950
                  [background-image:radial-gradient(theme(colors.blue.100)_1px,transparent_1px)]
                  [background-size:18px_18px] [background-position:0_0]
                  dark:[background-image:radial-gradient(theme(colors.emerald.900/.25)_1px,transparent_1px)]"></div>
      <div class="absolute -top-32 -left-40 h-[520px] w-[520px] rounded-full blur-3xl
                  bg-[radial-gradient(closest-side,theme(colors.blue.300/.35),transparent)]
                  opacity-30"></div>
      <div class="absolute -bottom-24 -right-40 h-[520px] w-[520px] rounded-full blur-3xl
                  bg-[radial-gradient(closest-side,theme(colors.emerald.300/.35),transparent)]
                  opacity-30"></div>
    </div>

    <div class="p-6 space-y-6">
      <!-- HEADER -->
      <div class="flex items-start justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide 700 dark:400">
            <Icon icon="ph:student" class="size-4" />
            PPDB • {{ thisYear }}/{{ thisYear + 1 }}
          </div>
          <h1 class="text-xl sm:text-2xl font-bold mt-1">Pendaftaran Santri Baru</h1>
          <p class="text-sm text-gray-600 dark:text-neutral-300">Kelola calon santri & status pendaftaran (buka/tutup).</p>
        </div>

        <div class="shrink-0 flex items-center gap-2">
          <NuxtLink
            to="/registrationPPDB"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700">
            <Icon icon="ph:link-simple" class="size-4" /> Buka Form
          </NuxtLink>
          <button @click="copy(formUrl)"
                  class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white text-xs font-medium hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800">
            <Icon icon="ph:copy" class="size-4" /> Salin Link
          </button>
        </div>
      </div>

      <!-- STATUS CARD -->
      <section
        class="rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40 bg-white/85 dark:bg-neutral-900/80 backdrop-blur-xl shadow-[0_14px_60px_rgba(16,185,129,.12)]">
        <div class="p-4 sm:p-6">
          <div class="flex items-center justify-between flex-wrap gap-3">
            <div class="flex items-center gap-3">
              <div class="size-10 grid place-items-center rounded-2xl bg-emerald-100 700 dark:bg-emerald-900/40 dark:300">
                <Icon :icon="isClosed ? 'ph:lock' : 'ph:lock-open'" class="size-5" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-semibold">Status Pendaftaran</h3>
                  <span :class="badgeClass">
                    {{ isClosed ? 'Ditutup' : 'Dibuka' }}
                  </span>
                </div>
                <p class="text-xs text-gray-600 dark:text-neutral-400">
                  {{ statusCaption }}
                </p>
              </div>
            </div>

            <!-- Switches -->
            <div class="flex items-center flex-wrap gap-3">
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" class="shrink-0 hs-tooltip-toggle relative w-11 h-6 bg-gray-200 rounded-full cursor-pointer transition-colors ease-in-out duration-200
                      focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-600
                      dark:bg-neutral-700"
                       :checked="!isClosed"
                       @change="toggleManual(!$event.target.checked)">
                <span class="text-sm">Buka/Tutup (Manual)</span>
              </label>

              <label class="inline-flex items-center gap-2">
                <input type="checkbox" class="shrink-0 hs-tooltip-toggle relative w-11 h-6 bg-gray-200 rounded-full cursor-pointer transition-colors ease-in-out duration-200
                      focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-600
                      dark:bg-neutral-700"
                       :checked="settings.autoCloseEnabled"
                       @change="saveSettings({ autoCloseEnabled: $event.target.checked })">
                <span class="text-sm">Tutup Otomatis</span>
              </label>
            </div>
          </div>

          <!-- Scheduler -->
          <div class="mt-4 grid sm:grid-cols-2 gap-3">
            <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-3">
              <label class="block text-xs text-gray-500 dark:text-neutral-400 mb-1">Tanggal Tutup (otomatis)</label>
              <input type="datetime-local"
                     :value="autoCloseLocal"
                     @change="onChangeAutoClose($event)"
                     class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm" />
            </div>

            <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-3 bg-emerald-50/50 dark:bg-neutral-800/40">
              <div class="flex items-center gap-2 text-sm font-semibold">
                <Icon icon="ph:timer" class="size-4 700 dark:300" />
                Hitung Mundur
              </div>
              <p class="mt-1 text-lg font-bold"
                 :class="isClosed ? 'text dark:text-rose-400' : '700 dark:300'">
                {{ countdownText }}
              </p>
              <p class="text-[11px] text-gray-500 dark:text-neutral-400">Akan menutup otomatis jika diaktifkan.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- DATA CALON SANTRI -->
      <section class="space-y-3">
        <div class="flex items-center flex-wrap gap-3 justify-between">
          <h2 class="text-base font-semibold">Calon Santri ({{ thisYear }})</h2>
          <div class="flex flex-wrap items-center gap-2">
            <input v-model="filtersCalon.q" placeholder="Cari nama / wali / alamat…"
                   class="w-52 text-xs px-3 py-1.5 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
            <select v-model="filtersCalon.jenjang" class="text-xs px-2 py-1.5 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
              <option value="semua">Semua Jenjang</option>
              <option v-for="j in jenjangOptionsCalon" :key="j" :value="j">{{ j }}</option>
            </select>
            <button @click="approveSelected"
                    :disabled="savingBulk || selectedCalon.size===0"
                    class="text-xs px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60">
              Terima Terpilih ({{ selectedCalon.size }})
            </button>
            <button @click="approveAllFiltered"
                    :disabled="savingBulk || filteredCalon.length===0"
                    class="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
              Terima Semua ({{ filteredCalon.length }})
            </button>
            <button @click="exportCSV(filteredCalon, `calon_santri_${thisYear}.csv`)"
                    class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Export CSV</button>
            <button @click="exportExcel(filteredCalon, `calon_santri_${thisYear}.xlsx`)"
                    class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Export Excel</button>
          </div>
        </div>

        <DataTable
          title="Calon Santri"
          :rows="filteredCalon"
          :columns="columns"
          :rowKey="(r) => r.id"
        >
        <template #cell-_sel="{ row }">
        <input type="checkbox"
                class="rounded border-gray-300 dark:border-neutral-700"
                :checked="isSelectedCalon(row.id)"
                @change="toggleSelectCalon(row.id, $event.target.checked)" />
        </template>
          <template #cell-nohp="{ row }">
            <a v-if="row.nohp" :href="`tel:${row.nohp}`" class="600 hover:underline">{{ row.nohp }}</a>
            <span v-else class="text-gray-400">-</span>
          </template>

          <template #cell-status="{ row }">
            <span class="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
              Calon
            </span>
          </template>

          <template #cell-kamar="{row}">
            {{ row.kamar || '-' }} <span v-if="row.maskan">- {{ row.maskan }}</span>
          </template>

          <template #cell-action="{ row }">
            <div class="flex items-center flex-wrap gap-2">
              <button @click="approve(row)"
                      class="text-xs px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700">Terima</button>
              <button @click="openEdit(row)"
                      class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Edit</button>
              <button @click="openConfirm(row)"
                      class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">Hapus</button>
            </div>
          </template>
        </DataTable>
      </section>

      <section class="space-y-3">
        <div class="flex items-center flex-wrap gap-3 justify-between">
          <h2 class="text-base font-semibold">Santri Baru ({{ thisYear }})</h2>
          <div class="flex flex-wrap items-center gap-2">
            <input v-model="filtersBaru.q" placeholder="Cari nama / wali / alamat…"
                   class="w-52 text-xs px-3 py-1.5 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
            <select v-model="filtersBaru.jenjang" class="text-xs px-2 py-1.5 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
              <option value="semua">Semua Jenjang</option>
              <option v-for="j in jenjangOptionsBaru" :key="j" :value="j">{{ j }}</option>
            </select>
            <button @click="revertSelectedBaru"
                    :disabled="savingBulkRevert || selectedBaru.size===0"
                    class="text-xs px-3 py-1.5 rounded bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-60">
            Jadikan Calon Terpilih ({{ selectedBaru.size }})
            </button>
            <button @click="revertAllFilteredBaru"
                    :disabled="savingBulkRevert || filteredBaru.length===0"
                    class="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
            Jadikan Calon Semua ({{ filteredBaru.length }})
            </button>
            <button @click="exportCSV(filteredBaru, `santri_baru_${thisYear}.csv`)"
                    class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Export CSV</button>
            <button @click="exportExcel(filteredBaru, `santri_baru_${thisYear}.xlsx`)"
                    class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Export Excel</button>
          </div>
        </div>

        <DataTable
          title="Santri Baru"
          :rows="filteredBaru"
          :columns="columnsBaru"
          :rowKey="(r) => r.id"
        >
          <template #cell-nohp="{ row }">
            <a v-if="row.nohp" :href="`tel:${row.nohp}`" class="600 hover:underline">{{ row.nohp }}</a>
            <span v-else class="text-gray-400">-</span>
          </template>

          <template #cell-status="{ row }">
            <span class="text-xs px-2 py-0.5 rounded bg-emerald-100 700 dark:bg-emerald-900/30 dark:300">
              Diterima
            </span>
          </template>

          <template #cell-kamar="{row}">
            {{ row.kamar || '-' }} <span v-if="row.maskan">- {{ row.maskan }}</span>
          </template>

          <template #cell-action="{ row }">
            <div class="flex items-center flex-wrap gap-2">
              <button @click="onRevertToCalon(row)"
                      class="text-xs px-2 py-1 rounded bg-amber-600 text-white hover:bg-amber-700">Jadikan Calon</button>
              <button @click="openEdit(row)"
                      class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Edit</button>
              <button @click="openConfirm(row)"
                      class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">Hapus</button>
            </div>
          </template>
        </DataTable>
      </section>

      <ModalShell v-model="showForm" :title="formMode === 'edit' ? 'Ubah Data' : 'Tambah Pendaftar'">
        <form class="space-y-3" @submit.prevent="saveRow">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-gray-600 dark:text-neutral-300">Gen</label>
              <input v-model.trim="form.gen" required class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
            <div>
              <label class="text-xs text-gray-600 dark:text-neutral-300">Nama Santri</label>
              <input v-model.trim="form.santri" required class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
            <div>
              <label class="text-xs text-gray-600 dark:text-neutral-300">Wali</label>
              <input v-model.trim="form.walisantri" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
            <div>
              <label class="text-xs text-gray-600 dark:text-neutral-300">No. HP</label>
              <input v-model.trim="form.nohp" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
            <div>
              <label class="text-xs text-gray-600 dark:text-neutral-300">Kamar</label>
              <input v-model.trim="form.kamar" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
            <div>
              <label class="text-xs text-gray-600 dark:text-neutral-300">Jenjang</label>
              <input v-model.trim="form.jenjang" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
            <div class="sm:col-span-2">
              <label class="text-xs text-gray-600 dark:text-neutral-300">Alamat</label>
              <textarea v-model.trim="form.alamat" rows="2"
                        class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"></textarea>
            </div>
          </div>
          <p v-if="formError" class="text-sm text-rose-600">{{ formError }}</p>
        </form>
        <template #footer>
          <button @click="showForm=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
          <button :disabled="saving" @click="saveRow" class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
            {{ saving ? 'Menyimpan…' : (formMode === 'edit' ? 'Update' : 'Simpan') }}
          </button>
        </template>
      </ModalShell>

      <ModalShell v-model="showConfirm" title="Hapus Data">
        <p class="text-sm text-gray-700 dark:text-neutral-200">
          Hapus data <strong>{{ current?.santri }}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <template #footer>
          <button @click="showConfirm=false" class="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
          <button :disabled="deleting" @click="confirmDelete" class="px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60">
            {{ deleting ? 'Menghapus…' : 'Hapus' }}
          </button>
        </template>
      </ModalShell>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, reactive, ref } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'
import { Icon } from '@iconify/vue'
import DataTable from '~/components/widget/DataTable.vue'
import ModalShell from '~/components/widget/ModalShell.vue'
import { usePendaftaran, type PendaftaranRow, type PendaftaranSettings } from '~/composables/data/usePendaftaran'

definePageMeta({ layout: 'app', layoutProps: { title: 'Pendaftaran' } })
const TZ_JKT = 'Asia/Jakarta'

/** ===== Composable ===== */
const {
  calonRows, baruRows, loading, error,
  fetchAll, approveCalon, revertToCalon: revertToCalonApi, updateRow, createRow, deleteRow,
  settings, fetchSettings, saveSettings
} = usePendaftaran()

/** ===== Header helpers ===== */
const thisYear = tzYearFromMs(Date.now())
const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
const route = useRoute()
const config = useRuntimeConfig()
const formUrl = computed(() => new URL('/registrationPPDB', config.public.siteUrl || window?.location?.origin || '').toString())
async function copy(t: string){ try { await navigator.clipboard.writeText(t) } catch {} }

/** ===== Filters ===== */
type Filters = { q: string, jenjang: string }
const filtersCalon = reactive<Filters>({ q: '', jenjang: 'semua' })
const filtersBaru  = reactive<Filters>({ q: '', jenjang: 'semua' })

function matchSearch(r: PendaftaranRow, q: string) {
  if (!q) return true
  const s = q.toLowerCase()
  const hay = [
    r.santri, r.walisantri, r.nohp, r.kamar, (r as any).maskan, r.alamat, r.jenjang, r.gen, r.status
  ].map(v => String(v || '').toLowerCase()).join(' | ')
  return hay.includes(s)
}
function matchJenjang(r: PendaftaranRow, jj: string) {
  if (jj === 'semua') return true
  return String(r.jenjang || '').toLowerCase() === jj.toLowerCase()
}

const selectedBaru = ref<Set<string>>(new Set())
function isSelectedBaru(id: string) { return selectedBaru.value.has(id) }
function toggleSelectBaru(id: string, checked: boolean) {
  const s = new Set(selectedBaru.value)
  checked ? s.add(id) : s.delete(id)
  selectedBaru.value = s
}

const savingBulkRevert = ref(false)
async function revertSelectedBaru() {
  const ids = Array.from(selectedBaru.value)
  if (!ids.length) { alert('Pilih minimal satu santri baru.'); return }
  savingBulkRevert.value = true
  try {
    for (const id of ids) await revertToCalonApi(id)
    selectedBaru.value.clear()
    await fetchAll()
  } finally { savingBulkRevert.value = false }
}

async function revertAllFilteredBaru() {
  const ids = filteredBaru.value.map(r => r.id)
  if (!ids.length) { alert('Tidak ada data pada filter saat ini.'); return }
  if (!confirm(`Jadikan calon semua (${ids.length}) santri baru pada hasil filter?`)) return
  savingBulkRevert.value = true
  try {
    for (const id of ids) await revertToCalonApi(id)
    selectedBaru.value.clear()
    await fetchAll()
  } finally { savingBulkRevert.value = false }
}

const filteredCalon = computed(() => (calonRows.value || [])
  .filter((r: any) => matchSearch(r, filtersCalon.q))
  .filter((r: any) => matchJenjang(r, filtersCalon.jenjang))
)
const filteredBaru = computed(() => (baruRows.value || [])
  .filter((r: any) => matchSearch(r, filtersBaru.q))
  .filter((r: any) => matchJenjang(r, filtersBaru.jenjang))
)
const jenjangOptionsCalon = computed(() => uniqueNonEmpty(calonRows.value.map((r: any) => r.jenjang)))
const jenjangOptionsBaru  = computed(() => uniqueNonEmpty(baruRows.value.map((r: any) => r.jenjang)))
function uniqueNonEmpty(arr: (string|number|undefined|null)[]) { return [...new Set(arr.map(v => String(v || '').trim()).filter(Boolean))] }

/** ===== Columns ===== */
const columns = [
  { key: '_sel', label: '', sortable: false },
  { key: 'gen', label: 'Gen', sortable: true },
  { key: 'santri', label: 'Santri', sortable: true },
  { key: 'walisantri', label: 'Wali Santri', sortable: true },
  { key: 'nohp', label: 'No. HP', sortable: true },
  { key: 'kamar', label: 'Kamar', sortable: true },
  { key: 'alamat', label: 'Alamat', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'jenjang', label: 'Jenjang', sortable: true },
]
const columnsBaru = [
  { key: '_selB', label: '', sortable: false },
  ...columns.filter(c => c.key !== '_sel')
]

async function approveMany(ids: string[]) {
  for (const id of ids) await approveCalon(id)
}

/** ===== Export helpers (CSV/Excel) ===== */
const csvHeaders = ['gen','santri','walisantri','nohp','kamar','alamat','status','jenjang'] as const
type CsvRow = Record<(typeof csvHeaders)[number], string|number|null|undefined>
function mapRowToCsv(r: PendaftaranRow): CsvRow {
  return {
    gen: r.gen ?? '', santri: r.santri ?? '', walisantri: r.walisantri ?? '', nohp: r.nohp ?? '',
    kamar: r.kamar ?? '', alamat: r.alamat ?? '', status: r.status ?? '', jenjang: r.jenjang ?? ''
  }
}
function toCSV(rows: PendaftaranRow[]) {
  const esc = (v: any) => { const s = String(v ?? ''); const needs = /[",\n]/.test(s); const x = s.replace(/"/g, '""'); return needs ? `"${x}"` : x }
  const head = csvHeaders.join(',')
  const body = rows.map((r: any) => csvHeaders.map(h => esc((mapRowToCsv(r) as any)[h])).join(',')).join('\n')
  return head + '\n' + body
}

const selectedCalon = ref<Set<string>>(new Set())
function isSelectedCalon(id: string) { return selectedCalon.value.has(id) }
function toggleSelectCalon(id: string, checked: boolean) {
  const s = new Set(selectedCalon.value)
  checked ? s.add(id) : s.delete(id)
  selectedCalon.value = s
}

const savingBulk = ref(false)
async function approveSelected() {
  const ids = Array.from(selectedCalon.value)
  if (!ids.length) { alert('Pilih minimal satu calon.'); return }
  savingBulk.value = true
  try {
    for (const id of ids) await approveCalon(id)
    selectedCalon.value.clear()
    await fetchAll()
  } finally { savingBulk.value = false }
}
async function approveAllFiltered() {
  const ids = filteredCalon.value.map(r => r.id)
  if (!ids.length) { alert('Tidak ada data pada filter saat ini.'); return }
  if (!confirm(`Terima semua (${ids.length}) calon pada hasil filter?`)) return
  savingBulk.value = true
  try {
    for (const id of ids) await approveCalon(id)
    selectedCalon.value.clear()
    await fetchAll()
  } finally { savingBulk.value = false }
}

async function onRevertToCalon(row: PendaftaranRow) {
  await (revertToCalon as any)(row.id) // panggil fungsi dari composable
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
}
function exportCSV(source: PendaftaranRow[], filename: string) {
  const csv = toCSV(source); const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }); downloadBlob(filename, blob)
}
async function exportExcel(source: PendaftaranRow[], filename: string) {
  try {
    // @ts-ignore
    const XLSX = (await import('xlsx')).default || (await import('xlsx'))
    const data = source.map((r: any) => mapRowToCsv(r))
    const ws = XLSX.utils.json_to_sheet(data, { header: csvHeaders as any })
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Data'); XLSX.writeFile(wb, filename)
  } catch { exportCSV(source, filename.replace(/\.xlsx$/i, '.csv')) }
}

function toInputValueInTZ(iso: string | null, tz = TZ_JKT) {
  if (!iso) return ''
  const d = new Date(iso)
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, year:'numeric', month:'2-digit', day:'2-digit',
    hour:'2-digit', minute:'2-digit', hour12:false
  }).formatToParts(d)
  const get = (t:string)=>parts.find(p=>p.type===t)?.value || '00'
  const y=get('year'), m=get('month'), day=get('day'), hh=get('hour'), mm=get('minute')
  return `${y}-${m}-${day}T${hh}:${mm}`
}

function isoFromJktLocal(inputValue: string) {
  const [date, time] = inputValue.split('T')
  const [y, m, d] = date!.split('-').map(Number)
  const [hh, mm] = time!.split(':').map(Number)
  const utcMs = Date.UTC(y!, m!-1, d, hh! - 7, mm)
  return new Date(utcMs).toISOString()
}



/** ===== Settings & Status ===== */
const isClosed = computed(() => !!settings.value.isClosed)
const autoCloseLocal = computed(() => toInputValueInTZ(settings.value.autoCloseAt, TZ_JKT))
function onChangeAutoClose(e: Event){
  const v = (e.target as HTMLInputElement).value
  if (!v) return saveSettings({ autoCloseAt: null })
  saveSettings({ autoCloseAt: isoFromJktLocal(v) })
}

function toggleManual(closeNow: boolean){
  // if closeNow === true berarti user menggeser switch ke "Tutup"
  saveSettings({ isClosed: closeNow })
}
function tzYearFromMs(ms: number) {
  return Number(new Intl.DateTimeFormat('en-CA', { timeZone: TZ_JKT, year:'numeric' }).format(new Date(ms)))
}
const badgeClass = computed(() =>
  isClosed.value
    ? 'inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
    : 'inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 700 dark:bg-emerald-900/30 dark:300'
)
const statusCaption = computed(() => {
  if (isClosed.value) return 'Pendaftaran ditutup. Form publik sebaiknya dinonaktifkan.'
  if (settings.value.autoCloseEnabled && settings.value.autoCloseAt) {
    const d = new Date(settings.value.autoCloseAt)
    return `Terbuka • akan tutup otomatis ${d.toLocaleString()}`
  }
  return 'Terbuka • tutup otomatis tidak aktif'
})

/** ===== Countdown & auto-close worker ===== */
const nowTick = ref(Date.now())
let intervalId: any = null
const countdownText = computed(() => {
  if (!settings.value.autoCloseEnabled || !settings.value.autoCloseAt) {
    return isClosed.value ? 'Ditutup' : '—'
  }
  const t = +new Date(settings.value.autoCloseAt) - nowTick.value
  if (t <= 0) return '00:00:00'
  const sec = Math.floor(t/1000)
  const h = Math.floor(sec/3600)
  const m = Math.floor((sec%3600)/60)
  const s = sec%60
  const pad = (n:number)=>String(n).padStart(2,'0')
  if (h >= 24) {
    const d = Math.floor(h/24); const rh = h % 24
    return `${d}d ${pad(rh)}:${pad(m)}:${pad(s)}`
  }
  return `${pad(h)}:${pad(m)}:${pad(s)}`
})

async function checkAutoClose(){
  if (!settings.value.autoCloseEnabled || !settings.value.autoCloseAt) return
  if (isClosed.value) return
  const due = +new Date(settings.value.autoCloseAt)
  if (Date.now() >= due) {
    await saveSettings({ isClosed: true })
  }
}

onMounted(async () => {
  await Promise.all([fetchSettings(), fetchAll()])
  intervalId = setInterval(() => {
    nowTick.value = Date.now()
    checkAutoClose()
  }, 1000)
})
onBeforeUnmount(() => { if (intervalId) clearInterval(intervalId) })

/** ===== CRUD helpers ===== */
const showForm = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const formError = ref<string | null>(null)
const saving = ref(false)
const current = ref<PendaftaranRow | null>(null)
const form = reactive<Omit<PendaftaranRow, 'id'>>({
  gen: String(thisYear), santri: '', walisantri: '', nohp: '', kamar: '', alamat: '', status: 'nonaktif', jenjang: ''
})
function openEdit(r: PendaftaranRow) {
  formMode.value = 'edit'; current.value = r
  form.gen = r.gen || String(thisYear); form.santri = r.santri
  form.walisantri = r.walisantri || ''; form.nohp = r.nohp || ''
  form.kamar = r.kamar || ''; form.alamat = r.alamat || ''
  form.status = r.status || 'nonaktif'; form.jenjang = r.jenjang || ''
  formError.value = null; showForm.value = true
}
async function saveRow(){
  if (!form.santri?.trim()) { formError.value = 'Nama santri wajib diisi.'; return }
  if (!form.gen?.trim())     { formError.value = 'Gen wajib diisi.'; return }
  saving.value = true
  try {
    if (formMode.value === 'edit' && current.value?.id) {
      await updateRow(current.value.id, { ...form })
    } else {
      await createRow({ ...form })
    }
    showForm.value = false
  } catch (e:any) {
    formError.value = e?.message ?? 'Gagal menyimpan data'
  } finally {
    saving.value = false
  }
}
const showConfirm = ref(false)
const deleting = ref(false)
function openConfirm(r: PendaftaranRow){ current.value = r; showConfirm.value = true }
async function confirmDelete(){
  if (!current.value?.id) return
  deleting.value = true
  try { await deleteRow(current.value.id); showConfirm.value = false } finally { deleting.value = false }
}

async function approve(row: PendaftaranRow){
  await approveCalon(row.id)
}
</script>
