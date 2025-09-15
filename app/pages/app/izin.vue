<template>
  <section class="relative">
    <!-- BG belakang -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute inset-0
                  bg-white dark:bg-neutral-950
                  [background-image:radial-gradient(#e5e7eb_1px,transparent_1px)]
                  [background-size:16px_16px] [background-position:0_0]
                  dark:[background-image:radial-gradient(#262626_1px,transparent_1px)]"></div>
      <div class="absolute -top-32 -left-40 h-[520px] w-[520px] rounded-full blur-3xl
                  bg-[radial-gradient(closest-side,theme(colors.indigo.400/.3),transparent)]
                  opacity-30"></div>
    </div>

    <div class="relative p-6">
      <!-- Header + Tabs + Filter tipe -->
      <div class="mb-4 flex items-center flex-wrap justify-between">
        <div class="flex items-center flex-wrap gap-3">
          <h1 class="text-lg font-semibold">Perizinan Pulang</h1>
          <div class="inline-flex rounded-lg border border-gray-200 dark:border-neutral-700 overflow-hidden">
            <button @click="activeTab='list'" :class="['px-3 py-1.5 text-xs', activeTab==='list' ? 'bg-blue-600 text-white' : '']">Daftar</button>
            <button @click="activeTab='history'" :class="['px-3 py-1.5 text-xs', activeTab==='history' ? 'bg-blue-600 text-white' : '']">History</button>
          </div>
          <div class="inline-flex rounded-lg border border-gray-200 dark:border-neutral-700 overflow-hidden">
            <button @click="activeTipe='ALL'"   :class="['px-3 py-1.5 text-xs', activeTipe==='ALL' ? 'bg-blue-600 text-white' : '']">Semua</button>
            <button @click="activeTipe='Putra'" :class="['px-3 py-1.5 text-xs', activeTipe==='Putra' ? 'bg-blue-600 text-white' : '']">Putra</button>
            <button @click="activeTipe='Putri'" :class="['px-3 py-1.5 text-xs', activeTipe==='Putri' ? 'bg-blue-600 text-white' : '']">Putri</button>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button @click="openCreate" class="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">+ Tambah Izin</button>
          <button @click="reloadAll" class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Muat Ulang</button>
        </div>
      </div>

      <!-- GRID 6 -->
      <div class="grid grid-cols-1 gap-4">
                <!-- KANAN: Info filter (RFID feed dihapus) -->
        <div class="xl:col-span-2 xl:self-start">
          <div class="xl:sticky xl:top-4">
            <div class="space-y-4 xl:max-h-[calc(100vh-2rem)] xl:overflow-y-auto xl:pr-1">
              <div class="rounded-xl border border-gray-200 dark:border-neutral-700 p-3 text-xs bg-white/80 dark:bg-neutral-900/70">
                Menampilkan: <strong>{{ activeTipe }}</strong>. Data ditentukan dari tipe Maskan santri (Putra/Putri).
              </div>
            </div>
          </div>
        </div>
        <!-- KIRI: LIST / HISTORY -->
        <div class="xl:col-span-4 space-y-4">
          <!-- LIST AKTIF -->
          <div v-if="activeTab==='list'">
            <DataTable
              title="Perizinan Aktif"
              :rows="filteredRows"
              :columns="columns"
              :rowKey="(r) => r.id"
            >
              <template #cell-requestedAt="{ row }">
                {{ formatDate(row.requestedAt) }}
              </template>

              <!-- Santri -->
              <template #cell-santri="{ row }">
                <div class="font-medium">{{ row.name }}</div>
                <div class="text-[11px] text-gray-500">Maskan {{ row.maskan || '-' }} • Kamar {{ row.kamar || '-' }}</div>
              </template>

              <!-- Status Izin -->
              <template #cell-status="{ row }">
                <span :class="chipStatus(row.status)">{{ labelStatus(row.status) }}</span>
              </template>

              <!-- Status RFID -->
              <template #cell-rfid="{ row }">
                <div class="flex items-center gap-2">
                  <span :class="rfidPill(row).cls">{{ rfidPill(row).label }}</span>
                  <span v-if="rfidPill(row).when" class="text-[11px] text-gray-500">• {{ rfidPill(row).when }}</span>
                </div>
              </template>

              <!-- Waktu Keluar / Kembali -->
              <template #cell-waktukeluar="{ row }">
                {{ formatDT((row as any).plannedOutAt || (row as any).outAt) }}
              </template>
              <template #cell-waktukembali="{ row }">
                {{ formatDT((row as any).plannedReturnAt || (row as any).returnedAt) }}
              </template>

              <!-- Action -->
              <template #cell-action="{ row }">
                <div class="flex flex-wrap gap-1">
                  <button v-if="row.status!=='returned' && row.status!=='done'" @click="markReturned(row.id)" class="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Return</button>
                  <button @click="openEdit(row)" class="text-xs px-2 py-1 rounded border hover:bg-gray-50 dark:hover:bg-neutral-800">Edit</button>
                  <button @click="openDelete(row)" class="text-xs px-2 py-1 rounded border text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">Hapus</button>
                  <button @click="printIzin(row)" class="text-xs px-2 py-1 rounded border hover:bg-gray-50 dark:hover:bg-neutral-800">Print (Dot Matrix)</button>
                </div>
              </template>
            </DataTable>
          </div>

          <!-- HISTORY: tampilkan hanya yang selesai (returned/done) -->
          <div v-else>
            <div class="flex items-center flex-wrap justify-between mb-2">
              <h3 class="font-semibold">History</h3>
              <div class="flex items-center justify-end gap-3">
                <button @click="exportAllHistoryCSV" class="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">
                  Export CSV
                </button>
                <button
                  :disabled="!historyRows.length || deletingAll"
                  @click="openDeleteAllModal"
                  class="text-xs px-3 py-1.5 rounded border border-rose-300 text-rose-700 hover:bg-rose-50
                        dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20 disabled:opacity-60"
                >
                  {{ deletingAll ? 'Menghapus…' : 'Delete All' }}
                </button>
              </div>
            </div>

            <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-neutral-700">
              <table class="min-w-full text-sm">
                <thead class="bg-gray-50 dark:bg-neutral-900/40">
                  <tr class="text-left">
                    <th class="px-3 py-2">Nama</th>
                    <th class="px-3 py-2">Maskan</th>
                    <th class="px-3 py-2">Kamar</th>
                    <th class="px-3 py-2">Status</th>
                    <th class="px-3 py-2">Keluar</th>
                    <th class="px-3 py-2">Kembali</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-neutral-800">
                  <tr v-for="r in historyRows" :key="r.id">
                    <td class="px-3 py-2">{{ r.name }}</td>
                    <td class="px-3 py-2">{{ r.maskan || '-' }}</td>
                    <td class="px-3 py-2">{{ r.kamar || '-' }}</td>
                    <td class="px-3 py-2">{{ labelStatus(r.status) }}</td>
                    <td class="px-3 py-2">{{ formatDT(outTs(r)) }}</td>
                    <td class="px-3 py-2">{{ formatDT(backTs(r)) }}</td>
                  </tr>
                  <tr v-if="!historyRows.length">
                    <td colspan="6" class="px-3 py-6 text-center text-gray-500">Belum ada data.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      <ModalShell v-model="showDeleteAllModal" title="Hapus Semua History">
        <div class="space-y-3 text-sm">
          <p class="text-rose-600 font-medium">Tindakan ini permanen.</p>
          <p>
            Anda akan menghapus <strong>{{ historyRows.length }}</strong> data perizinan
            yang sudah selesai (<code>returned/done</code>).
          </p>
          <ul class="list-disc pl-5 text-gray-600 dark:text-neutral-300">
            <li>Data yang dihapus tidak bisa dikembalikan.</li>
            <li>Data aktif (belum kembali) tidak ikut terhapus.</li>
          </ul>
        </div>
        <template #footer>
          <button
            @click="showDeleteAllModal=false"
            class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700
                  hover:bg-gray-50 dark:hover:bg-neutral-800"
          >
            Batal
          </button>
          <button
            :disabled="deletingAll"
            @click="confirmDeleteAll"
            class="px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60"
          >
            {{ deletingAll ? 'Menghapus…' : 'Hapus Semua' }}
          </button>
        </template>
      </ModalShell>

      <!-- MODAL Create/Edit -->
      <ModalShell v-model="showForm" :title="formMode==='create' ? 'Tambah Izin' : 'Ubah Izin'">
        <form class="space-y-4 max-h-[50vh] overflow-y-auto scrollbar-none" @submit.prevent="submitForm">
          <!-- SANTRI -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="sm:col-span-2">
              <label class="text-xs text-gray-600 dark:text-neutral-300">Nama Santri</label>
              <div class="relative">
                <input
                  v-model.trim="form.name"
                  @focus="santriFocused=true"
                  @blur="setTimeout(()=>santriFocused=false, 150)"
                  @input="santriSearch = form.name"
                  placeholder="Ketik nama santri…"
                  class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"
                />
                <!-- dropdown -->
                <div
                  v-if="(santriFocused || santriSearch) && santriOptions.length"
                  class="absolute z-20 mt-1 w-full rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg max-h-60 overflow-auto"
                >
                  <button
                    v-for="s in santriOptions"
                    :key="s.id"
                    type="button"
                    @mousedown.prevent="pickFormSantri(s)"
                    class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800"
                  >
                    <div class="text-sm font-medium truncate">{{ s.santri }}</div>
                    <div class="text-[11px] text-gray-500 truncate">Maskan {{ s.maskan || '-' }} • Kamar {{ s.kamar || '-' }}</div>
                  </button>
                </div>
              </div>
              <div class="mt-1 text-[11px] text-gray-500" v-if="form.santriId">SantriID: {{ form.santriId }}</div>
            </div>

            <!-- MASKAN-KAMAR (otomatis, hanya tampil) -->
            <div>
              <label class="text-xs text-gray-600 dark:text-neutral-300">Maskan</label>
              <input v-model.trim="form.maskan" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" disabled />
            </div>
            <div>
              <label class="text-xs text-gray-600 dark:text-neutral-300">Kamar</label>
              <input v-model.trim="form.kamar" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" disabled />
            </div>
          </div>

          <!-- ALAMAT (otomatis) -->
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Alamat</label>
            <input v-model.trim="form.alamat" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" disabled />
          </div>

          <!-- WAKTU -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-gray-600 dark:text-neutral-300">Waktu Keluar</label>
              <input v-model="plannedOutAtInput" type="datetime-local" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
            <div>
              <label class="text-xs text-gray-600 dark:text-neutral-300">Waktu Kembali</label>
              <input v-model="plannedReturnAtInput" type="datetime-local" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
          </div>

          <!-- PENJEMPUT -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="text-xs text-gray-600 dark:text-neutral-300">Penjemput (Nama)</label>
              <input v-model.trim="form.penjemputNama" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" placeholder="Nama penjemput…" />
            </div>
            <div>
              <label class="text-xs text-gray-600 dark:text-neutral-300">Hubungan</label>
              <input v-model.trim="form.penjemputHubungan" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" placeholder="Orang tua/Wali/Kakak…" />
            </div>
            <div>
              <label class="text-xs text-gray-600 dark:text-neutral-300">No. Telp</label>
              <input v-model.trim="form.penjemputTelp" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" placeholder="08xxxxxxxxxx" />
            </div>
          </div>

          <!-- CATATAN -->
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Catatan</label>
            <textarea v-model.trim="form.note" rows="2" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" placeholder="Catatan tambahan…"></textarea>
          </div>

          <label class="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" v-model="form.cetakOtomatis" class="checkbox checkbox-sm" />
            Cetak surat otomatis setelah simpan
          </label>

          <p v-if="formError" class="text-sm text-rose-600">{{ formError }}</p>
        </form>

        <template #footer>
          <button @click="showForm=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
          <button :disabled="saving" @click="submitForm" class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
            {{ saving ? 'Menyimpan…' : (formMode==='create' ? 'Simpan' : 'Update') }}
          </button>
        </template>
      </ModalShell>

      <!-- MODAL History Detail -->
      <ModalShell v-model="showHistDetail" :title="`Detail Sesi ${histDetailId||''} — ${activeTipe}`">
        <div class="max-h-[70vh] overflow-auto">
          <table class="min-w-full text-xs">
            <thead><tr class="text-left">
              <th class="px-3 py-2">Nama</th>
              <th class="px-3 py-2">Maskan</th>
              <th class="px-3 py-2">Kamar</th>
              <th class="px-3 py-2">Status</th>
            </tr></thead>
            <tbody class="divide-y divide-gray-200 dark:divide-neutral-800">
              <tr v-for="r in histRowsFiltered" :key="r.key">
                <td class="px-3 py-2">{{ r.name }}</td>
                <td class="px-3 py-2">{{ r.maskan || '-' }}</td>
                <td class="px-3 py-2">{{ r.kamar || '-' }}</td>
                <td class="px-3 py-2">{{ labelStatus(r.status) }}</td>
              </tr>
              <tr v-if="!histRowsFiltered.length">
                <td colspan="4" class="px-3 py-3 text-gray-500">Kosong.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <template #footer>
          <button @click="showHistDetail=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Tutup</button>
        </template>
      </ModalShell>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import DataTable from '~/components/widget/DataTable.vue'
import ModalShell from '~/components/widget/ModalShell.vue'
import { useIzin, type IzinRow, type IzinStatus } from '~/composables/data/useIzin'
import { useMaskan } from '~/composables/data/useMaskan'
import { useSantri } from '~/composables/data/useSantri'
import { useAbsensi } from '~/composables/data/useAbsensi'

definePageMeta({ layout: 'app', layoutProps: { title: 'Perizinan' } })

const { rows, fetchIzin, createIzin, updateIzin, deleteIzin,
        markReturned, live, subscribeLive } = useIzin()
const { rows: maskan } = useMaskan()
const { rows: santri, fetchSantri } = useSantri()

const activeTab = ref<'list'|'history'>('list')
const activeTipe = ref<'ALL'|'Putra'|'Putri'>('ALL')

const columns = [
  { key: 'requestedAt', label: 'Waktu', sortable: true },
  { key: 'santri', label: 'Santri' },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'rfid', label: 'Status RFID' },
  { key: 'waktukeluar', label: 'Waktu Keluar', sortable: true },
  { key: 'waktukembali', label: 'Waktu Kembali', sortable: true },
]

const SURAT_HEADER = {
  title: 'Surat Perizinan',
  pondok: 'Pondok Pesantren ALBERR',
  alamat: 'Jl. Pesantren Sangarejo Karangjati Pandaan Pasuruan',
  telp: '0823-3781-5634',
  logo: '/assets/logo.png'
}

let unsub: null | (()=>void) = null
onMounted(async () => {
  await Promise.all([fetchSantri(), fetchIzin()])
  unsub = subscribeLive(60) // tetap subscribe agar kolom "Status RFID" realtime
})
onBeforeUnmount(() => { if (unsub) try { unsub() } catch {} })

function two(n:number){ return String(n).padStart(2,'0') }
function formatDT(ts?: number){
  if(!ts) return '—'
  const d = new Date(ts)
  return `${two(d.getDate())}/${two(d.getMonth()+1)}/${d.getFullYear()} ${two(d.getHours())}:${two(d.getMinutes())}`
}

// === Delete All (History) ===
const showDeleteAllModal = ref(false)
const deletingAll = ref(false)

function openDeleteAllModal() {
  if (!historyRows.value.length) return
  showDeleteAllModal.value = true
}

async function confirmDeleteAll() {
  if (!historyRows.value.length) { showDeleteAllModal.value = false; return }
  deletingAll.value = true
  try {
    // ambil id unik agar aman
    const ids = Array.from(new Set(historyRows.value.map(r => r.id)))
    // hapus paralel tapi batasi (kalau perlu sequential, ganti ke for..of await)
    await Promise.all(ids.map(id => deleteIzin(id)))
    showDeleteAllModal.value = false
    // refresh list
    await fetchIzin()
  } catch (e) {
    console.error(e)
    alert('Gagal menghapus semua history.')
  } finally {
    deletingAll.value = false
  }
}


function toLocalInputValue(ts?: number) {
  if (!ts) return ''
  const d = new Date(ts)
  const yyyy = d.getFullYear()
  const MM = two(d.getMonth()+1)
  const dd = two(d.getDate())
  const hh = two(d.getHours())
  const mm = two(d.getMinutes())
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`
}
function fromLocalInputValue(s?: string) {
  if (!s) return undefined
  const t = Date.parse(s)
  return Number.isNaN(t) ? undefined : t
}

function genNomorSurat(row: IzinRow){
  const d = row.requestedAt ? new Date(row.requestedAt) : new Date()
  const seg = `${String(d.getFullYear()).slice(-2)}${two(d.getMonth()+1)}${two(d.getDate())}`
  const suf = (row.id||'').slice(-4).toUpperCase()
  return `SP/ALBERR/${seg}/${suf}`
}

function resolveSantriFor(row: IzinRow | (IzinRow & Partial<ExtendedIzinForm>)) {
  if ((row as any).santriId) {
    const byId = santri.value.find(s => s.id === (row as any).santriId)
    if (byId) return byId
  }
  const q = (row.name || '').normalize('NFKC').trim().toLowerCase()
  if (!q) return null
  return santri.value.find(
    s => (s.santri || '').normalize('NFKC').trim().toLowerCase() === q
  ) || null
}

function buildSuratHTML(row: IzinRow & Partial<ExtendedIzinForm>){
  const s = resolveSantriFor(row)
  const alamat = (row.alamat && row.alamat.trim()) ? row.alamat : (s?.alamat?.trim() ? s.alamat : '-')
  const telp   = row.penjemputTelp?.trim() || s?.nohp?.trim() || '-'
  const noSurat = genNomorSurat(row)

  const waktuIzin = row.plannedOutAt || row.outAt || row.requestedAt
  const waktuKembali = row.plannedReturnAt || row.returnedAt

  let akun = '-'
  try {
    // @ts-ignore
    const u = (useNuxtApp() as any).$auth?.currentUser
    akun = u?.displayName || u?.email || '-'
  } catch {}

  const css = `
  <style>
    @page { size: A5 portrait; margin: 10mm; }
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { font-family: "Courier New", Courier, monospace; font-size: 12pt; color:#000; }
    .wrap { width: 100%; }
    .hdr { display:flex; align-items:flex-start; gap:16px; }
    .hdr .txt { flex:1; }
    .hdr h1 { font-size: 18pt; margin:0; line-height:1.2; font-weight:700; }
    .hdr h2 { font-size: 14pt; margin:2px 0 4px; font-weight:700; }
    .hdr .meta { font-size: 10pt; }
    .logo { width:72px; height:72px; object-fit:contain; }
    .mt12{ margin-top:12px } .hr { border-top:1px dashed #000; margin:8px 0; }
    .row { display:flex; gap:8px; margin:2px 0; }
    .lab { width: 200px; }
    .val { flex:1; }
    .sign { display:flex; justify-content:space-between; margin-top:28px; }
    .sign .col { width: 32%; text-align:center; }
    .ttd { margin-top:48px; }
  </style>`

  const html = `
  <html><head><meta charset="utf-8">${css}</head>
  <body onload="window.focus(); setTimeout(()=>window.print(), 200)">
    <div class="wrap">
      <div class="hdr">
        <div class="txt">
          <h1>${SURAT_HEADER.title}</h1>
          <h2>${SURAT_HEADER.pondok}</h2>
          <div class="meta">${SURAT_HEADER.alamat}<br/>No. Telp ${SURAT_HEADER.telp}</div>
        </div>
        <img src="${SURAT_HEADER.logo}" class="logo" />
      </div>

      <div class="mt12">
        <div class="row"><div class="lab">No</div><div class="val">: ${noSurat}</div></div>
        <div class="row"><div class="lab">Nama</div><div class="val">: ${row.name || '-'}</div></div>
        <div class="row"><div class="lab">Kamar  - Maskan</div><div class="val">: ${row.kamar || '-'}  -  ${row.maskan || '-'}</div></div>
        <div class="row"><div class="lab">Alamat</div><div class="val">: ${alamat}</div></div>
        <div class="row"><div class="lab">Penjemput (Hubungan)</div><div class="val">: ${row.penjemputNama || '-'} (${row.penjemputHubungan || '-'})</div></div>
        <div class="row"><div class="lab">No. Telp</div><div class="val">: ${telp}</div></div>
        <div class="row"><div class="lab">Waktu Keluar - Waktu Kembali</div><div class="val">: ${formatDT(waktuIzin)}  -  ${formatDT(waktuKembali)}</div></div>
        <div class="row"><div class="lab">Catatan</div><div class="val">: ${row.note || '-'}</div></div>
      </div>

      <div class="hr"></div>

      <div class="sign">
        <div class="col">
          Pengurus Perizinan<br/><small>(${akun})</small>
          <div class="ttd">Ttd</div>
        </div>
        <div class="col">
          Wali Santri
          <div class="ttd">Ttd</div>
        </div>
      </div>
    </div>
  </body></html>`
  return html
}

/* ================== CETAK ================== */
function printIzin(row: IzinRow & Partial<ExtendedIzinForm>){
  const html = buildSuratHTML(row)
  const w = window.open('', '_blank', 'width=900,height=700')
  if(!w) return alert('Pop-up diblokir, izinkan pop-up untuk mencetak.')
  w.document.open()
  w.document.write(html)
  w.document.close()
}

function tipeForMaskan(name?: string): 'Putra'|'Putri'|'Unknown' {
  if (!name) return 'Unknown'
  const m = maskan.value.find(x => (x.name||'').toLowerCase().trim() === name.toLowerCase().trim())
  return (m?.tipe as any) || 'Unknown'
}
const filteredRows = computed(() => {
  return rows.value.filter(r => {
    const t = tipeForMaskan(r.maskan)
    if (activeTipe.value !== 'ALL' && t !== activeTipe.value) return false
    // hanya tampilkan yang masih aktif (bukan returned/done)
    const st = (r.status || '').toLowerCase()
    return st !== 'returned' && st !== 'done'
  })
})

// Live feed helpers (untuk kolom "Status RFID")
const liveSorted = computed(() => [...live.value].sort((a,b) => (b.ts||0)-(a.ts||0)))
function timeAgo(ts?: number) {
  if (!ts) return ''
  const diff = Date.now() - ts
  const m = Math.floor(diff/60000)
  if (m < 1) return 'baru saja'
  if (m < 60) return `${m}m`
  const h = Math.floor(m/60), rm = m%60
  return `${h}j ${rm}m`
}
function formatDate(ts?: number) {
  if (!ts) return '—'
  const d = new Date(ts)
  return d.toLocaleString()
}
const norm = (s?: any) => String(s ?? '').normalize('NFKC').trim().toLowerCase()
function latestRFIDEvent(row: IzinRow) {
  const sid = (row as any).santriId
  const nm = norm(row.name)
  return liveSorted.value.find(e =>
    (sid && (e as any).santriId && (e as any).santriId === sid) || norm((e as any).name) === nm
  ) || null
}
function rfidPill(row: IzinRow) {
  const e:any = latestRFIDEvent(row)
  if (!e) return { label: '—', when: '', cls: 'inline-flex items-center px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300' }
  const isReturn = (e.action || '').toLowerCase() === 'return'
  return {
    label: isReturn ? 'Kembali' : 'Keluar',
    when: timeAgo(e.ts),
    cls: `inline-flex items-center px-2 py-0.5 text-xs rounded ${isReturn
      ? 'bg-blue-100 700 dark:bg-blue-900/30 dark:300'
      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`
  }
}

// Chips
function chipStatus(s: any) {
  const base = 'inline-flex items-center px-2 py-0.5 text-xs rounded'
  const map: Record<string,string> = {
    pending:  `${base} bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300`,
    approved: `${base} bg-blue-100 700 dark:bg-blue-900/30 dark:300`,
    out:      `${base} bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300`,
    returned: `${base} bg-blue-100 700 dark:bg-blue-900/30 dark:300`,
    done:     `${base} bg-blue-100 700 dark:bg-blue-900/30 dark:300`,
    rejected: `${base} bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300`,
  }
  return map[(s||'').toLowerCase()] || map.pending
}
function labelStatus(s: any) {
  const v = (s||'').toLowerCase()
  if (v==='returned' || v==='done') return 'Sudah Kembali'
  if (v==='approved') return 'Disetujui'
  if (v==='out') return 'Keluar'
  if (v==='rejected') return 'Ditolak'
  return 'Menunggu'
}

/* ======== FORM (modal) ======== */
type ExtendedIzinForm = {
  santriId?: string
  name: string
  status: IzinStatus
  maskan?: string
  kamar?: string
  alamat?: string
  note?: string
  penjemputNama?: string
  penjemputHubungan?: string
  penjemputTelp?: string
  plannedOutAt?: number
  plannedReturnAt?: number
  cetakOtomatis?: boolean
  // compatibility (backend lama mungkin butuh reason)
  reason?: string
}

const showForm = ref(false)
const formMode = ref<'create'|'edit'>('create')
const saving = ref(false)
const formError = ref<string|null>(null)
const current = ref<IzinRow|null>(null)

const form = ref<ExtendedIzinForm>({
  name:'', status:'approved',
  santriId:'', maskan:'', kamar:'', alamat:'', note:'',
  penjemputNama:'', penjemputHubungan:'', penjemputTelp:'',
  plannedOutAt: undefined, plannedReturnAt: undefined, cetakOtomatis: true,
  reason: 'Izin pulang'
})

// datetime-local binding (string)
const plannedOutAtInput = ref<string>('')    // YYYY-MM-DDTHH:mm
const plannedReturnAtInput = ref<string>('')

function openCreate() {
  formMode.value = 'create'
  form.value = {
    name:'', status:'approved',
    santriId:'', maskan:'', kamar:'', alamat:'', note:'',
    penjemputNama:'', penjemputHubungan:'', penjemputTelp:'',
    plannedOutAt: undefined, plannedReturnAt: undefined, cetakOtomatis: true,
    reason: 'Izin pulang'
  }
  plannedOutAtInput.value = ''
  plannedReturnAtInput.value = ''
  formError.value = null
  showForm.value = true
}
function openEdit(r: IzinRow) {
  current.value = r
  formMode.value = 'edit'
  form.value = {
    santriId: (r as any).santriId || '',
    name: r.name, status: r.status,
    maskan: r.maskan || '', kamar: r.kamar || '',
    alamat: (r as any).alamat || resolveSantriFor(r)?.alamat || '',
    note: (r as any).note || '',
    penjemputNama: (r as any).penjemputNama || '',
    penjemputHubungan: (r as any).penjemputHubungan || '',
    penjemputTelp: (r as any).penjemputTelp || '',
    plannedOutAt: (r as any).plannedOutAt, plannedReturnAt: (r as any).plannedReturnAt,
    cetakOtomatis: true,
    reason: (r as any).reason || 'Izin pulang'
  }
  plannedOutAtInput.value = toLocalInputValue(form.value.plannedOutAt)
  plannedReturnAtInput.value = toLocalInputValue(form.value.plannedReturnAt)
  formError.value = null
  showForm.value = true
}

function outTs(r: IzinRow) { return (r as any).outAt ?? (r as any).plannedOutAt }
function backTs(r: IzinRow) { return (r as any).returnedAt ?? (r as any).plannedReturnAt }

// Semua history tanpa filter, urut terbaru: returnedAt > outAt > requestedAt
const historyRows = computed(() =>
  rows.value
    .filter(r => ['returned','done'].includes((r.status || '').toLowerCase()))
    .sort((a, b) =>
      ((b as any).returnedAt ?? (b as any).outAt ?? b.requestedAt ?? 0) -
      ((a as any).returnedAt ?? (a as any).outAt ?? a.requestedAt ?? 0)
    )
)

function exportAllHistoryCSV() {
  const header = ['Nama','Maskan','Kamar','Status','Keluar','Kembali']
  const lines = [header.join(',')]
  for (const r of historyRows.value) {
    const cols = [
      r.name, r.maskan || '', r.kamar || '', labelStatus(r.status),
      formatDT(outTs(r)), formatDT(backTs(r))
    ].map(x => `"${String(x ?? '').replace(/"/g,'""')}"`)
    lines.push(cols.join(','))
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `izin_history_returned.csv`; a.click()
  URL.revokeObjectURL(url)
}


async function submitForm() {
  // sync datetime
  form.value.plannedOutAt = fromLocalInputValue(plannedOutAtInput.value)
  form.value.plannedReturnAt = fromLocalInputValue(plannedReturnAtInput.value)

  // basic validation
  if (!form.value.name?.trim()) { formError.value = 'Nama wajib diisi'; return }
  if (!form.value.maskan?.trim()) { formError.value = 'Maskan wajib diisi (otomatis dari santri)'; return }
  if (!form.value.kamar?.trim())  { formError.value = 'Kamar wajib diisi (otomatis dari santri)'; return }
  if (form.value.plannedOutAt && form.value.plannedReturnAt && form.value.plannedOutAt > form.value.plannedReturnAt) {
    formError.value = 'Waktu kembali harus setelah waktu keluar'; return
  }

  // fallback reason untuk kompatibilitas backend
  if (!form.value.reason) form.value.reason = form.value.note || 'Izin pulang'

  saving.value = true
  try {
    if (formMode.value==='create') {
      // langsung Disetujui (tanpa Approve)
      const id = await createIzin({ ...(form.value as any), status: 'approved' })
      if (form.value.cetakOtomatis) {
        const r = rows.value.find(x => x.id === id)
        if (r) printIzin({ ...r, ...(form.value as any) })
      }
    } else if (current.value?.id) {
      await updateIzin(current.value.id, { ...(form.value as any) })
    }
    showForm.value = false
  } catch (e:any) {
    formError.value = e?.message ?? 'Gagal menyimpan'
  } finally { saving.value = false }
}

function openDelete(r: IzinRow) {
  if (confirm(`Hapus izin ${r.name}?`)) deleteIzin(r.id)
}

// ============ AUTOCOMPLETE (SANTRI) ============
const santriSearch = ref(''), santriFocused = ref(false)
const santriOptions = computed(() => {
  const q = norm(santriSearch.value)
  if (!q) return []
  return santri.value
    .filter(s =>
      norm(s.santri).includes(q) ||
      norm(s.maskan).includes(q) ||
      norm(s.kamar).includes(q)
    )
    .slice(0, 20)
})
function pickFormSantri(s: any) {
  form.value.santriId = s.id
  form.value.name     = s.santri
  form.value.maskan   = s.maskan || ''
  form.value.kamar    = s.kamar || ''
  form.value.alamat   = s.alamat || ''
  // prefill penjemput default dari wali
  if (!form.value.penjemputNama && s.walisantri) form.value.penjemputNama = s.walisantri
  if (!form.value.penjemputHubungan) form.value.penjemputHubungan = 'Wali'
  if (!form.value.penjemputTelp && (s.nohp || s.phone)) form.value.penjemputTelp = s.nohp || s.phone
  santriSearch.value = ''
  santriFocused.value = false
}

/* ======== HISTORY ======== */
const { history, fetchHistory, readHistorySession } = useAbsensi()
const histDate = ref<string>(''); const histLimit = ref<number>(20)
const showHistDetail = ref(false); const histDetailId = ref<string>(''); const histDetail = ref<Record<string, any>>({})
async function reloadHistory() { await fetchHistory({ limit: histLimit.value, date: histDate.value || undefined }) }
async function openHistoryDetail(id: string) { histDetailId.value = id; histDetail.value = await readHistorySession(id); showHistDetail.value = true }
const histRowsFiltered = computed(() => {
  const arr: any[] = []
  for (const [key, v] of Object.entries(histDetail.value || {})) {
    const r = v as any
    const tipe = tipeForMaskan(r.maskan || (santri.value.find(x=>x.id===r.santriId)?.maskan))
    if (activeTipe.value!=='ALL' && tipe!==activeTipe.value) continue
    arr.push({ key, name: r.name, maskan: r.maskan, kamar: r.kamar, status: r.status })
  }
  return arr
})
function exportHistoryCSV(id: string) {
  if (histDetailId.value !== id) { alert('Buka detail sesi dulu untuk export.'); return }
  const rows = histRowsFiltered.value
  const header = ['Nama','Maskan','Kamar','Status']
  const lines = [header.join(',')]
  for (const r of rows) {
    const line = [r.name, r.maskan||'', r.kamar||'', labelStatus(r.status)].map(x => `"${String(x).replace(/"/g,'""')}"`).join(',')
    lines.push(line)
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob); const a = document.createElement('a')
  a.href = url; a.download = `izin_${id}_${activeTipe.value.toLowerCase()}.csv`; a.click(); URL.revokeObjectURL(url)
}

/* ======== UTIL ======== */
function reloadAll(){ fetchIzin() }
</script>
