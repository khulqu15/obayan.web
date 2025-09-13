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
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
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
      <div class="grid grid-cols-1 xl:grid-cols-6 gap-4">
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
              <template #cell-urgency="{ row }">
                <span :class="chipUrgency(row.urgency)">{{ row.urgency }}</span>
              </template>
              <template #cell-status="{ row }">
                <span :class="chipStatus(row.status)">{{ labelStatus(row.status) }}</span>
              </template>
              <template #cell-santri="{ row }">
                <div class="font-medium">{{ row.name }}</div>
                <div class="text-[11px] text-gray-500">Maskan {{ row.maskan || '-' }} • Kamar {{ row.kamar || '-' }}</div>
              </template>
              <template #cell-action="{ row }">
                <div class="flex flex-wrap gap-1">
                  <button v-if="row.status==='pending'" @click="approveIzin(row.id)" class="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Approve</button>
                  <button v-if="row.status==='pending' || row.status==='approved'" @click="markOut(row.id)" class="text-xs px-2 py-1 rounded border hover:bg-gray-50 dark:hover:bg-neutral-800">Out</button>
                  <button v-if="row.status==='out'" @click="markReturned(row.id)" class="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Return</button>
                  <button v-if="row.status!=='returned'" @click="rejectIzin(row.id)" class="text-xs px-2 py-1 rounded border text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">Reject</button>
                  <button @click="openEdit(row)" class="text-xs px-2 py-1 rounded border hover:bg-gray-50 dark:hover:bg-neutral-800">Edit</button>
                  <button @click="openDelete(row)" class="text-xs px-2 py-1 rounded border text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">Hapus</button>
                  <button @click="printIzin(row)" class="text-xs px-2 py-1 rounded border hover:bg-gray-50 dark:hover:bg-neutral-800">Print (Dot Matrix)</button>
                </div>
              </template>
            </DataTable>
          </div>

          <!-- HISTORY SEDERHANA (daftar sesi) -->
          <div v-else>
            <div class="flex items-end gap-2 mb-2">
              <div>
                <label class="text-xs text-gray-600 dark:text-neutral-300">Tanggal</label>
                <input v-model="histDate" type="date" class="px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
              </div>
              <div>
                <label class="text-xs text-gray-600 dark:text-neutral-300">Batas sesi</label>
                <select v-model.number="histLimit" class="px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
                  <option :value="10">10</option>
                  <option :value="20">20</option>
                  <option :value="50">50</option>
                </select>
              </div>
              <button @click="reloadHistory" class="text-xs px-3 py-2 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Muat History</button>
            </div>

            <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-neutral-700">
              <table class="min-w-full text-sm">
                <thead class="bg-gray-50 dark:bg-neutral-900/40">
                  <tr class="text-left">
                    <th class="px-3 py-2">Sesi</th>
                    <th class="px-3 py-2">Total</th>
                    <th class="px-3 py-2 w-32">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-neutral-800">
                  <tr v-for="s in history" :key="s.id">
                    <td class="px-3 py-2 font-medium">{{ s.id }}</td>
                    <td class="px-3 py-2">{{ s.meta?.total || 0 }}</td>
                    <td class="px-3 py-2">
                      <div class="flex items-center gap-2">
                        <button @click="openHistoryDetail(s.id)" class="text-xs px-2 py-1 rounded border hover:bg-gray-50 dark:hover:bg-neutral-800">Detail</button>
                        <button @click="exportHistoryCSV(s.id)" class="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Export CSV</button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="!history.length">
                    <td colspan="3" class="px-3 py-6 text-center text-gray-500">Belum ada history.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- KANAN: sticky (RFID + Quick Add) -->
        <div class="xl:col-span-2 xl:self-start">
          <div class="xl:sticky xl:top-4">
            <div class="space-y-4 xl:max-h-[calc(100vh-2rem)] xl:overflow-y-auto xl:pr-1">
              <!-- CARD Realtime RFID -->
              <div class="rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden shadow-sm bg-white/80 dark:bg-neutral-900/70">
                <div class="px-4 py-3 bg-indigo-50/70 dark:bg-indigo-900/20 flex items-center justify-between">
                  <div>
                    <h3 class="font-semibold">RFID Live Feed</h3>
                    <p class="text-xs text-gray-600 dark:text-neutral-300">Perizinan realtime via RFID</p>
                  </div>
                </div>
                <div class="max-h-[360px] overflow-auto divide-y divide-gray-200 dark:divide-neutral-800">
                  <div v-for="e in liveSorted" :key="e.id" class="px-4 py-3">
                    <div class="font-medium">{{ e.name }}</div>
                    <div class="text-[11px] text-gray-500">
                      {{ e.action.toUpperCase() }} • {{ e.maskan ? 'Maskan '+e.maskan : '-' }} • {{ e.kamar ? 'Kamar '+e.kamar : '-' }} • {{ (e.by||'').toUpperCase() }}
                    </div>
                    <div class="text-[11px] text-gray-500">{{ timeAgo(e.ts) }}</div>
                  </div>
                  <div v-if="!liveSorted.length" class="px-4 py-6 text-sm text-gray-500">Belum ada aktivitas.</div>
                </div>
              </div>

              <!-- CARD Tambah Manual Cepat -->
              <div class="rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden shadow-sm bg-white/80 dark:bg-neutral-900/70">
                    <div class="px-4 py-3 bg-gray-50/70 dark:bg-neutral-900/60">
                        <h3 class="font-semibold">Tambah Izin (Cepat)</h3>
                    </div>
                    <div class="px-4 py-3 space-y-2">
                        <!-- Nama santri (autocomplete / manual) -->
                        <div class="relative">
                        <input
                            v-model.trim="quick.name"
                            @focus="quickSantriFocused=true"
                            @blur="setTimeout(()=>quickSantriFocused=false, 150)"
                            @input="quickSantriSearch = quick.name"
                            placeholder="Nama santri (pilih / isi manual)…"
                            class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"
                        />
                        <div
                            v-if="(quickSantriFocused || quickSantriSearch) && quickSantriOptions.length"
                            class="absolute z-20 mt-1 w-full rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg max-h-56 overflow-auto"
                        >
                            <button
                            v-for="s in quickSantriOptions"
                            :key="s.id"
                            type="button"
                            @mousedown.prevent="pickQuickSantri(s)"
                            class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hoverbg-neutral-800"
                            >
                            <div class="text-sm font-medium truncate">{{ s.santri }}</div>
                            <div class="text-[11px] text-gray-500 truncate">Maskan {{ s.maskan || '-' }} • Kamar {{ s.kamar || '-' }}</div>
                            </button>
                        </div>
                        </div>

                        <!-- Maskan (combobox / manual) -->
                        <div class="relative">
                        <input
                            v-model.trim="quick.maskan"
                            @focus="quickMaskanFocused=true"
                            @blur="setTimeout(()=>quickMaskanFocused=false, 150)"
                            @input="quickMaskanSearch = quick.maskan"
                            placeholder="Maskan (pilih / isi manual)…"
                            class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"
                        />
                        <div
                            v-if="(quickMaskanFocused || quickMaskanSearch) && quickMaskanOptions.length"
                            class="absolute z-20 mt-1 w-full rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg max-h-56 overflow-auto"
                        >
                            <button
                            v-for="m in quickMaskanOptions"
                            :key="m.id"
                            type="button"
                            @mousedown.prevent="pickQuickMaskan(m.name)"
                            class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800"
                            >
                            <div class="text-sm font-medium">Maskan {{ m.name }}</div>
                            <div class="text-[11px] text-gray-500">{{ m.tipe }}</div>
                            </button>
                        </div>
                        </div>

                        <!-- Kamar (combobox / manual) -->
                        <div class="relative">
                        <input
                            v-model.trim="quick.kamar"
                            @focus="quickKamarFocused=true"
                            @blur="setTimeout(()=>quickKamarFocused=false, 150)"
                            @input="quickKamarSearch = quick.kamar"
                            :placeholder="quick.maskan ? 'Kamar (pilih / isi)…' : 'Kamar (isi)…'"
                            class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"
                        />
                        <div
                            v-if="quick.maskan && (quickKamarFocused || quickKamarSearch) && quickKamarOptions.length"
                            class="absolute z-20 mt-1 w-full rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg max-h-56 overflow-auto"
                        >
                            <button
                            v-for="num in quickKamarOptions"
                            :key="num"
                            type="button"
                            @mousedown.prevent="pickQuickKamar(num)"
                            class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800"
                            >
                            Kamar {{ num }}
                            </button>
                        </div>
                        </div>

                        <!-- Alasan + Urgensi -->
                        <input v-model.trim="quick.reason" placeholder="Alasan" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
                        <select v-model="quick.urgency" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
                        <option>Rendah</option><option>Normal</option><option>Tinggi</option><option>Darurat</option>
                        </select>

                        <button @click="submitQuick" class="w-full text-xs px-3 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700">Simpan</button>
                    </div>
                </div>


              <!-- Info Tipe Filter -->
              <div class="rounded-xl border border-gray-200 dark:border-neutral-700 p-3 text-xs bg-white/80 dark:bg-neutral-900/70">
                Menampilkan: <strong>{{ activeTipe }}</strong>. Data ditentukan dari tipe Maskan santri (Putra/Putri).
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL Create/Edit -->
      <ModalShell v-model="showForm" :title="formMode==='create' ? 'Tambah Izin' : 'Ubah Izin'">
        <form class="space-y-3" @submit.prevent="submitForm">
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
  <!-- hint santriId -->
  <div class="mt-1 text-[11px] text-gray-500" v-if="form.santriId">SantriID: {{ form.santriId }}</div>
</div>

<!-- ====== MASKAN (COMBOBOX / MANUAL) ====== -->
<div>
  <label class="text-xs text-gray-600 dark:text-neutral-300">Maskan</label>
  <div class="relative">
    <input
      v-model.trim="form.maskan"
      @focus="maskanFocused=true"
      @blur="setTimeout(()=>maskanFocused=false, 150)"
      @input="maskanSearch = form.maskan"
      placeholder="Pilih / isi maskan"
      class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"
    />
    <div
      v-if="(maskanFocused || maskanSearch) && maskanOptions.length"
      class="absolute z-20 mt-1 w-full rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg max-h-56 overflow-auto"
    >
      <button
        v-for="m in maskanOptions"
        :key="m.id"
        type="button"
        @mousedown.prevent="pickFormMaskan(m.name)"
        class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800"
      >
        <div class="text-sm font-medium">Maskan {{ m.name }}</div>
        <div class="text-[11px] text-gray-500">{{ m.tipe }}</div>
      </button>
    </div>
  </div>
</div>

<!-- ====== KAMAR (COMBOBOX / MANUAL) ====== -->
<div>
  <label class="text-xs text-gray-600 dark:text-neutral-300">Kamar</label>
  <div class="relative">
    <input
      v-model.trim="form.kamar"
      @focus="kamarFocused=true"
      @blur="setTimeout(()=>kamarFocused=false, 150)"
      @input="kamarSearch = form.kamar"
      :placeholder="form.maskan ? 'Pilih / isi kamar untuk Maskan '+form.maskan : 'Isi kamar…'"
      class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"
    />
    <div
      v-if="form.maskan && (kamarFocused || kamarSearch) && kamarOptions.length"
      class="absolute z-20 mt-1 w-full rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg max-h-56 overflow-auto"
    >
      <button
        v-for="num in kamarOptions"
        :key="num"
        type="button"
        @mousedown.prevent="pickFormKamar(num)"
        class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800"
      >
        Kamar {{ num }}
      </button>
    </div>
  </div>
</div>
          <p v-if="formError" class="text-sm text-rose-600">{{ formError }}</p>
          </div>
        </form>
        <template #footer>
          <button @click="showForm=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
          <button :disabled="saving" @click="submitForm" class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
            {{ saving ? 'Menyimpan…' : (formMode==='create' ? 'Simpan' : 'Update') }}
          </button>
        </template>
      </ModalShell>

      <!-- MODAL History Detail (opsional ringan) -->
      <ModalShell v-model="showHistDetail" :title="`Detail Sesi ${histDetailId||''} — ${activeTipe}`">
        <div class="max-h-[70vh] overflow-auto">
          <table class="min-w-full text-xs">
            <thead><tr class="text-left">
              <th class="px-3 py-2">Nama</th>
              <th class="px-3 py-2">Maskan</th>
              <th class="px-3 py-2">Kamar</th>
              <th class="px-3 py-2">Urgensi</th>
              <th class="px-3 py-2">Status</th>
            </tr></thead>
            <tbody class="divide-y divide-gray-200 dark:divide-neutral-800">
              <tr v-for="r in histRowsFiltered" :key="r.key">
                <td class="px-3 py-2">{{ r.name }}</td>
                <td class="px-3 py-2">{{ r.maskan || '-' }}</td>
                <td class="px-3 py-2">{{ r.kamar || '-' }}</td>
                <td class="px-3 py-2">{{ r.urgency }}</td>
                <td class="px-3 py-2">{{ r.status }}</td>
              </tr>
              <tr v-if="!histRowsFiltered.length">
                <td colspan="5" class="px-3 py-3 text-gray-500">Kosong.</td>
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
import { computed, onMounted, ref } from 'vue'
import DataTable from '~/components/widget/DataTable.vue'
import ModalShell from '~/components/widget/ModalShell.vue'
import { useIzin, type IzinRow, type Urgency, type IzinStatus } from '~/composables/data/useIzin'
import { useMaskan } from '~/composables/data/useMaskan'
import { useSantri } from '~/composables/data/useSantri'
import { useAbsensi } from '~/composables/data/useAbsensi'

definePageMeta({ layout: 'app', layoutProps: { title: 'Perizinan' } })

const { rows, loading, error, fetchIzin, createIzin, updateIzin, deleteIzin,
        approveIzin, rejectIzin, markOut, markReturned,
        live, subscribeLive } = useIzin()
const { rows: maskan } = useMaskan()
const { rows: santri, fetchSantri } = useSantri()

const activeTab = ref<'list'|'history'>('list')
const activeTipe = ref<'ALL'|'Putra'|'Putri'>('ALL')

const columns = [
  { key: 'requestedAt', label: 'Waktu', sortable: true },
  { key: 'santri', label: 'Santri' },
  { key: 'reason', label: 'Alasan', sortable: true },
  { key: 'urgency', label: 'Urgensi', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
]

const SURAT_HEADER = {
  title: 'Surat Perizinan',
  pondok: 'Pondok Pesantren ALBERR',
  alamat: 'Jl. Pesantren Sangarejo Karangjati Pandaan Pasuruan',
  telp: '0823-3781-5634',
  logo: '/logo.png'
}

onMounted(async () => {
  await Promise.all([fetchSantri(), fetchIzin()])
  unsub = subscribeLive(60)
})
let unsub: null | (()=>void) = null

function two(n:number){ return String(n).padStart(2,'0') }
function formatDT(ts?: number){
  if(!ts) return '—'
  const d = new Date(ts)
  return `${two(d.getDate())}/${two(d.getMonth()+1)}/${d.getFullYear()} ${two(d.getHours())}:${two(d.getMinutes())}`
}
function genNomorSurat(row: IzinRow){
  const d = row.requestedAt ? new Date(row.requestedAt) : new Date()
  const seg = `${String(d.getFullYear()).slice(-2)}${two(d.getMonth()+1)}${two(d.getDate())}`
  const suf = (row.id||'').slice(-4).toUpperCase()
  return `SP/ALBERR/${seg}/${suf}`
}

function resolveSantriFor(row: IzinRow) {
  if (row.santriId) {
    const byId = santri.value.find(s => s.id === row.santriId)
    if (byId) return byId
  }
  const q = (row.name || '').normalize('NFKC').trim().toLowerCase()
  if (!q) return null
  return santri.value.find(
    s => (s.santri || '').normalize('NFKC').trim().toLowerCase() === q
  ) || null
}

function findSantriById(id?: string){
  if(!id) return null
  return santri.value.find(s => s.id === id) || null
}
function pickAlamatTelp(s:any){
  if(!s) return { alamat:'-', telp:'-' }
  const alamat = s.alamat || s.address || s.desa || s.kelurahan || s.kecamatan || '-'
  const telp = s.phone || s.telp || s.hp || s.nohp || s.waliPhone || s.phone_wali || '-'
  return { alamat: String(alamat), telp: String(telp) }
}

function buildSuratHTML(row: IzinRow){
  const s = resolveSantriFor(row)
  const alamat = s?.alamat?.trim() ? s.alamat : '-'
  const telp   = s?.nohp?.trim()   ? s.nohp   : '-'

  const noSurat = genNomorSurat(row)
  const waktuIzin = row.outAt || row.approvedAt || row.requestedAt
  const waktuKembali = row.returnedAt

  let akun = '-'
  try {
    // @ts-ignore - jika ada auth inject
    const u = (useNuxtApp() as any).$auth?.currentUser
    akun = u?.displayName || u?.email || '-'
  } catch {}

  // CSS print ramah dot-matrix (monospace, margin kecil, hitam-putih)
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
    .mt8{ margin-top:8px } .mt12{ margin-top:12px } .mt20{ margin-top:20px }
    .row { display:flex; gap:8px; margin:2px 0; }
    .lab { width: 160px; }
    .val { flex:1; }
    .hr { border-top:1px dashed #000; margin:8px 0; }
    .note { text-align:center; margin-top:32px; }
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
        <div class="row"><div class="lab">No. Telp</div><div class="val">: ${telp}</div></div>
        <div class="row"><div class="lab">Keterangan</div><div class="val">: ${row.reason || '-'}</div></div>
        <div class="row"><div class="lab">Waktu Izin - Waktu Kembali</div><div class="val">: ${formatDT(waktuIzin)}  -  ${formatDT(waktuKembali)}</div></div>
      </div>

      <div class="hr"></div>

      <div class="sign">
        <div class="col">
          Pengurus Perizinan
          <div class="ttd">Ttd</div>
        </div>
        <div class="col">
          Wali Santri
          <div class="ttd">Ttd</div>
        </div>
        <div class="col">
          Akun yang memberi izin<br/><small>(${akun})</small>
          <div class="ttd">Ttd</div>
        </div>
      </div>

      <div class="note">
        Surat ini harus diserahkan ke Pengurus Perizinan ketika santri kembali ke Pondok
      </div>
    </div>
  </body></html>`
  return html
}

/* ================== CETAK ================== */
function printIzin(row: IzinRow){
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
    if (activeTipe.value === 'ALL') return true
    return t === activeTipe.value
  })
})

// --- Live feed helpers ---
const liveSorted = computed(() => [...live.value].sort((a,b) => (b.ts||0)-(a.ts||0)))
function timeAgo(ts?: number) {
  if (!ts) return '—'
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

// --- Chips style ---
function chipUrgency(u: Urgency) {
  const base = 'inline-flex items-center px-2 py-0.5 text-xs rounded'
  if (u==='Darurat') return `${base} bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300`
  if (u==='Tinggi')  return `${base} bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300`
  if (u==='Normal')  return `${base} bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300`
  return `${base} bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300`
}
function chipStatus(s: IzinStatus) {
  const base = 'inline-flex items-center px-2 py-0.5 text-xs rounded'
  const map: Record<IzinStatus,string> = {
    pending:  `${base} bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300`,
    approved: `${base} bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300`,
    out:      `${base} bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300`,
    returned: `${base} bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300`,
    rejected: `${base} bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300`,
  }
  return map[s]
}
function labelStatus(s: IzinStatus) {
  if (s==='out') return 'Keluar'
  if (s==='returned') return 'Kembali'
  if (s==='approved') return 'Disetujui'
  if (s==='rejected') return 'Ditolak'
  return 'Menunggu'
}

// --- Create/Edit Modal ---
const showForm = ref(false)
const formMode = ref<'create'|'edit'>('create')
const saving = ref(false)
const formError = ref<string|null>(null)
const current = ref<IzinRow|null>(null)

const form = ref<{
  santriId?: string; name: string; reason: string; urgency: Urgency; status: IzinStatus;
  maskan?: string; kamar?: string; note?: string;
}>({ name:'', reason:'', urgency:'Normal', status:'pending', santriId:'', maskan:'', kamar:'', note:'' })

function openCreate() {
  formMode.value = 'create'
  form.value = { name:'', reason:'', urgency:'Normal', status:'pending', santriId:'', maskan:'', kamar:'', note:'' }
  formError.value = null
  showForm.value = true
}
function openEdit(r: IzinRow) {
  current.value = r
  formMode.value = 'edit'
  form.value = {
    santriId: r.santriId || '',
    name: r.name, reason: r.reason, urgency: r.urgency, status: r.status,
    maskan: r.maskan || '', kamar: r.kamar || '', note: r.note || ''
  }
  showForm.value = true
}
async function submitForm() {
  if (!form.value.name?.trim()) { formError.value = 'Nama wajib diisi'; return }
  if (!form.value.reason?.trim()) { formError.value = 'Alasan wajib diisi'; return }
  saving.value = true
  try {
    if (formMode.value==='create') {
      await createIzin({ ...form.value })
    } else if (current.value?.id) {
      await updateIzin(current.value.id, { ...form.value })
    }
    showForm.value = false
  } catch (e:any) {
    formError.value = e?.message ?? 'Gagal menyimpan'
  } finally { saving.value = false }
}
function openDelete(r: IzinRow) {
  if (confirm(`Hapus izin ${r.name}?`)) deleteIzin(r.id)
}

// --- Quick add (panel kanan) ---
const quick = ref({ name:'', maskan:'', kamar:'', reason:'', urgency:'Normal' as Urgency })
async function submitQuick() {
  const n = quick.value.name.trim()
  if (!n) return
  const id = await createIzin({
    name: n,
    reason: quick.value.reason.trim() || 'Perizinan',
    urgency: quick.value.urgency,
    maskan: quick.value.maskan.trim(),
    kamar: quick.value.kamar.trim(),
    note: '',
    santriId: '',
    status: 'pending'
  })
  const r = rows.value.find(x => x.id === id)
  if (r) printIzin(r)

  quick.value = { name:'', maskan:'', kamar:'', reason:'', urgency:'Normal' }
}

// --- HISTORY sederhana (opsional) ---
const { history, fetchHistory, readHistorySession } = useAbsensi()
const histDate = ref<string>(''); const histLimit = ref<number>(20)
const showHistDetail = ref(false); const histDetailId = ref<string>(''); const histDetail = ref<Record<string, any>>({})
async function reloadHistory() { await fetchHistory({ limit: histLimit.value, date: histDate.value || undefined }) }
async function openHistoryDetail(id: string) { histDetailId.value = id; histDetail.value = await readHistorySession(id); showHistDetail.value = true }
const histRowsFiltered = computed(() => {
  // filter tipe berdasarkan maskan
  const arr: any[] = []
  for (const [key, v] of Object.entries(histDetail.value || {})) {
    const r = v as any
    const tipe = tipeForMaskan(r.maskan || (santri.value.find(x=>x.id===r.santriId)?.maskan))
    if (activeTipe.value!=='ALL' && tipe!==activeTipe.value) continue
    arr.push({ key, name: r.name, maskan: r.maskan, kamar: r.kamar, urgency: r.urgency, status: r.status })
  }
  return arr
})
function exportHistoryCSV(id: string) {
  if (histDetailId.value !== id) { alert('Buka detail sesi dulu untuk export.'); return }
  const rows = histRowsFiltered.value
  const header = ['Nama','Maskan','Kamar','Urgensi','Status']
  const lines = [header.join(',')]
  for (const r of rows) {
    const line = [r.name, r.maskan||'', r.kamar||'', r.urgency||'', r.status||''].map(x => `"${String(x).replace(/"/g,'""')}"`).join(',')
    lines.push(line)
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob); const a = document.createElement('a')
  a.href = url; a.download = `izin_${id}_${activeTipe.value.toLowerCase()}.csv`; a.click(); URL.revokeObjectURL(url)
}

// ============ AUTOCOMPLETE HELPERS (FORM + QUICK ADD) ============
const norm = (s?: any) => String(s ?? '').normalize('NFKC').trim().toLowerCase()

// Cari maskan by "nama"
function maskanByName(name?: string) {
  if (!name) return null
  return maskan.value.find(m => norm(m.name) === norm(name)) || null
}
// List room untuk maskan by "nama"
function roomsOfByMaskanName(name?: string) {
  const m = maskanByName(name)
  return (m?.rooms ?? []).map(r => r.number)
}

// ======== Modal Form: Autocomplete Santri, Maskan, Kamar ========
const santriSearch = ref('')                 // query untuk santri
const santriFocused = ref(false)
const santriOptions = computed(() => {
  const q = norm(santriSearch.value)
  if (!q) return []
  // cari by nama / maskan / kamar
  return santri.value
    .filter(s =>
      norm(s.santri).includes(q) ||
      norm(s.maskan).includes(q) ||
      norm(s.kamar).includes(q)
    )
    .slice(0, 20)  // batasi 20
})

function pickFormSantri(s: any) {
  // isi field form dari santri terpilih
  form.value.santriId = s.id
  form.value.name     = s.santri
  form.value.maskan   = s.maskan || ''
  form.value.kamar    = s.kamar || ''
  // reset query
  santriSearch.value = ''
  santriFocused.value = false
}

// Autocomplete maskan (pakai nama maskan)
const maskanSearch = ref('')
const maskanFocused = ref(false)
const maskanOptions = computed(() => {
  const q = norm(maskanSearch.value || form.value.maskan)
  if (!q) return maskan.value.slice(0, 30)
  return maskan.value.filter(m => norm(m.name).includes(q)).slice(0, 30)
})
function pickFormMaskan(name: string) {
  form.value.maskan = name || ''
  maskanSearch.value = ''
  maskanFocused.value = false
  // opsional: kosongkan kamar kalau sebelumnya bukan bagian dari maskan ini
  if (form.value.kamar) {
    const rooms = roomsOfByMaskanName(form.value.maskan)
    if (!rooms.includes(form.value.kamar)) form.value.kamar = ''
  }
}

// Autocomplete kamar: tergantung maskan terpilih
const kamarSearch = ref('')
const kamarFocused = ref(false)
const kamarOptions = computed(() => {
  const list = roomsOfByMaskanName(form.value.maskan)
  const q = norm(kamarSearch.value || form.value.kamar)
  if (!q) return list.slice(0, 50)
  return list.filter(n => norm(n).includes(q)).slice(0, 50)
})
function pickFormKamar(num: string) {
  form.value.kamar = String(num)
  kamarSearch.value = ''
  kamarFocused.value = false
}

// ======== Quick Add (panel kanan): Autocomplete opsional ========
const quickSantriSearch = ref('')
const quickSantriFocused = ref(false)
const quickSantriOptions = computed(() => {
  const q = norm(quickSantriSearch.value)
  if (!q) return []
  return santri.value
    .filter(s =>
      norm(s.santri).includes(q) ||
      norm(s.maskan).includes(q) ||
      norm(s.kamar).includes(q)
    )
    .slice(0, 20)
})
function pickQuickSantri(s:any) {
  quick.value.name   = s.santri
  quick.value.maskan = s.maskan || ''
  quick.value.kamar  = s.kamar || ''
  quickSantriSearch.value = ''
  quickSantriFocused.value = false
}

// Quick: maskan/kamar juga bisa autocomplete
const quickMaskanSearch = ref('')
const quickMaskanFocused = ref(false)
const quickMaskanOptions = computed(() => {
  const q = norm(quickMaskanSearch.value || quick.value.maskan)
  if (!q) return maskan.value.slice(0, 30)
  return maskan.value.filter(m => norm(m.name).includes(q)).slice(0, 30)
})
function pickQuickMaskan(name: string) {
  quick.value.maskan = name || ''
  quickMaskanSearch.value = ''
  quickMaskanFocused.value = false
  if (quick.value.kamar) {
    const rooms = roomsOfByMaskanName(quick.value.maskan)
    if (!rooms.includes(quick.value.kamar)) quick.value.kamar = ''
  }
}

const quickKamarSearch = ref('')
const quickKamarFocused = ref(false)
const quickKamarOptions = computed(() => {
  const list = roomsOfByMaskanName(quick.value.maskan)
  const q = norm(quickKamarSearch.value || quick.value.kamar)
  if (!q) return list.slice(0, 50)
  return list.filter(n => norm(n).includes(q)).slice(0, 50)
})
function pickQuickKamar(num: string) {
  quick.value.kamar = String(num)
  quickKamarSearch.value = ''
  quickKamarFocused.value = false
}


</script>
