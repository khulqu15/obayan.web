<template>
  <!-- GLOBAL BACKGROUND (kotak-kotak + radial gradient 30%) -->
  <section class="relative">
    <!-- grid dots background -->
    <div class="pointer-events-none absolute inset-0
                bg-white dark:bg-neutral-950
                [background-image:radial-gradient(#e5e7eb_1px,transparent_1px)]
                [background-size:16px_16px] [background-position:0_0]
                dark:[background-image:radial-gradient(#262626_1px,transparent_1px)]">
    </div>
    <!-- radial gradient overlay 30% -->
    <div class="pointer-events-none absolute -top-32 -left-40 h-[520px] w-[520px] rounded-full blur-3xl
                bg-[radial-gradient(closest-side,theme(colors.indigo.400/.3),transparent)]
                opacity-30"></div>

    <!-- CONTENT -->
    <div class="relative p-6">
      <div class="mb-4 flex items-center justify-between flex-wrap gap-4">
        <div class="flex items-center flex-wrap gap-3">
            <h1 class="text-lg font-semibold">Absensi Santri</h1>
            <!-- Tabs -->
            <div class="inline-flex rounded-lg border border-gray-200 dark:border-neutral-700 overflow-hidden">
            <button @click="activeTab='realtime'" :class="['px-3 py-1.5 text-xs', activeTab==='realtime' ? 'bg-blue-600 text-white' : '']">
                Realtime
            </button>
            <button @click="activeTab='history'" :class="['px-3 py-1.5 text-xs', activeTab==='history' ? 'bg-blue-600 text-white' : '']">
                History
            </button>
            </div>
            <!-- Filter tipe -->
            <div class="inline-flex rounded-lg border border-gray-200 dark:border-neutral-700 overflow-hidden">
            <button @click="activeTipe='ALL'"   :class="['px-3 py-1.5 text-xs', activeTipe==='ALL' ? 'bg-blue-600 text-white' : '']">Semua</button>
            <button @click="activeTipe='Putra'" :class="['px-3 py-1.5 text-xs', activeTipe==='Putra' ? 'bg-blue-600 text-white' : '']">Putra</button>
            <button @click="activeTipe='Putri'" :class="['px-3 py-1.5 text-xs', activeTipe==='Putri' ? 'bg-blue-600 text-white' : '']">Putri</button>
            </div>
        </div>
        <div class="flex items-center gap-2" v-if="activeTab==='realtime'">
            <button @click="resetNow" class="text-xs px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700">Reset Sekarang</button>
            <button @click="reloadAll" class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Muat Ulang</button>
        </div>
    </div>

      <div v-if="activeTab==='realtime'" class="grid grid-cols-1 xl:grid-cols-6 gap-4">
        <!-- COL 4: Maskan -> Kamar + Progress -->
        <div class="xl:col-span-4 space-y-4">
          <div
            v-for="m in maskanRows"
            :key="m.id"
            class="rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden shadow-sm bg-white/80 dark:bg-neutral-900/70"
          >
            <div class="flex items-center justify-between px-4 py-3 bg-gray-50/70 dark:bg-neutral-900/60">
              <div>
                <h3 class="font-semibold">Maskan {{ m.name }} <span class="text-xs text-gray-500">({{ m.tipe }})</span></h3>
                <p class="text-xs text-gray-500">{{ m.deskripsi || '—' }}</p>
              </div>
              <div class="text-right">
                <div class="text-xs text-gray-600 dark:text-neutral-300">Sudah absen</div>
                <div class="font-semibold">{{ presentByMaskan(m.id) }} / {{ totalByMaskan(m.id) }}</div>
              </div>
            </div>

            <div class="divide-y divide-gray-200 dark:divide-neutral-800">
              <div
                v-for="r in m.rooms"
                :key="r.id"
                class="px-4 py-3 flex items-center justify-between"
              >
                <div class="min-w-0">
                  <div class="font-medium">Kamar {{ r.number }}</div>
                  <div class="text-xs text-gray-500">Kapasitas: {{ roomSize(m.id, r.number) }}</div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="text-right">
                    <div class="text-xs text-gray-600 dark:text-neutral-300">Sudah absen</div>
                    <div class="font-semibold">{{ presentByRoom(m.id, r.number) }} / {{ roomSize(m.id, r.number) }}</div>
                  </div>
                  <div class="w-40">
                    <div class="w-full h-2 rounded bg-gray-200 dark:bg-neutral-800 overflow-hidden">
                      <div class="h-2 rounded bg-emerald-500 transition-all" :style="{ width: roomProgress(m.id, r.number) + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="!m.rooms.length" class="px-4 py-6 text-sm text-gray-500">Belum ada data kamar.</div>
            </div>
          </div>
        </div>

        <div class="xl:col-span-2 space-y-4 relative">
          <div class="sticky top-10 space-y-4">
          <div class="rounded-xl border border-gray-200 relative dark:border-neutral-700 overflow-hidden shadow-sm bg-white/80 dark:bg-neutral-900/70">
            <div class="px-4 py-3 bg-indigo-50/70 dark:bg-indigo-900/20 flex items-center justify-between">
              <div>
                <h3 class="font-semibold">RFID Live Feed</h3>
                <p class="text-xs text-gray-600 dark:text-neutral-300">Terkini dari perangkat</p>
              </div>
              <div class="text-right">
                <div class="text-xs text-gray-600 dark:text-neutral-300">Dalam sesi</div>
                <div class="font-semibold">{{ currentCount }} absen</div>
              </div>
            </div>
            <div class="max-h-[360px] overflow-auto divide-y divide-gray-200 dark:divide-neutral-800">
              <div v-for="e in liveSorted" :key="e.id" class="px-4 py-3 flex items-start gap-3">
                <div class="h-2.5 w-2.5 mt-1 rounded-full bg-emerald-500"></div>
                <div class="min-w-0">
                  <div class="font-medium truncate">{{ e.name }}</div>
                  <div class="text-[11px] text-gray-500 truncate">
                    {{ e.maskan ? 'Maskan '+e.maskan : 'Maskan -' }} • {{ e.kamar ? 'Kamar '+e.kamar : 'Kamar -' }} • {{ e.by?.toUpperCase() || 'manual' }}
                  </div>
                </div>
                <div class="ml-auto text-[11px] text-gray-500">{{ timeAgo(e.ts) }}</div>
              </div>
              <div v-if="!liveSorted.length" class="px-4 py-6 text-sm text-gray-500">Belum ada aktivitas.</div>
            </div>
          </div>

          <!-- Manual Entry Absen -->
          <div class="rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden shadow-sm bg-white/80 dark:bg-neutral-900/70">
            <div class="px-4 py-3 bg-gray-50/70 dark:bg-neutral-900/60">
              <h3 class="font-semibold">Tambah Absen (Manual)</h3>
            </div>
            <div class="px-4 py-3 space-y-3">
              <!-- Mode tabs -->
              <div class="inline-flex rounded-lg border border-gray-200 dark:border-neutral-700 overflow-hidden">
                <button @click="manualMode='santri'" :class="['px-3 py-1.5 text-xs', manualMode==='santri' ? 'bg-blue-600 text-white' : 'bg-transparent']">Pilih Santri</button>
                <button @click="manualMode='manual'" :class="['px-3 py-1.5 text-xs', manualMode==='manual' ? 'bg-blue-600 text-white' : 'bg-transparent']">Isi Manual</button>
              </div>

              <!-- Pilih Santri -->
              <div v-if="manualMode==='santri'" class="space-y-2">
                <input v-model.trim="man.q" placeholder="Cari nama/kamar/maskan…" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
                <div v-if="manCandidates.length" class="max-h-48 overflow-auto rounded border border-gray-200 dark:border-neutral-700 divide-y dark:divide-neutral-800">
                  <button v-for="s in manCandidates" :key="s.id" @click="pickManualSantri(s)" class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800">
                    <div class="text-sm font-medium truncate">{{ s.santri }}</div>
                    <div class="text-[11px] text-gray-500 truncate">Gen {{ s.gen || '-' }} • {{ s.kamar || '-' }} {{ s.maskan || '' }}</div>
                  </button>
                </div>
                <div v-else-if="man.q" class="text-xs text-gray-500">Tidak ditemukan.</div>

                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="text-xs text-gray-600 dark:text-neutral-300">Maskan</label>
                    <input :value="man.sel?.maskan || '-'" disabled class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 dark:text-neutral-300">Kamar</label>
                    <input :value="man.sel?.kamar || '-'" disabled class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
                  </div>
                </div>
                <button :disabled="!man.sel" @click="submitManualPicked" class="w-full text-xs px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">Catat Absen</button>
              </div>

              <!-- Isi Manual -->
              <div v-else class="space-y-2">
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="text-xs text-gray-600 dark:text-neutral-300">Maskan</label>
                    <select v-model="man.manual.mId" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
                      <option v-for="m in maskanRows" :key="m.id" :value="m.id">Maskan {{ m.name }} ({{ m.tipe }})</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 dark:text-neutral-300">Kamar</label>
                    <select v-model="man.manual.room" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
                      <option v-for="r in roomsOf(man.manual.mId)" :key="r.id" :value="r.number">{{ r.number }}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="text-xs text-gray-600 dark:text-neutral-300">Nama</label>
                  <input v-model.trim="man.manual.name" placeholder="ketik nama" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
                </div>
                <button :disabled="!man.manual.name" @click="submitManualName" class="w-full text-xs px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">Catat Absen</button>
              </div>
            </div>
          </div>

          <!-- Multi Reset Times -->
          <div class="rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden shadow-sm bg-white/80 dark:bg-neutral-900/70">
            <div class="px-4 py-3 bg-gray-50/70 dark:bg-neutral-900/60">
              <h3 class="font-semibold">Jadwal Reset Harian (Multi Jam)</h3>
            </div>
            <div class="px-4 py-3 space-y-3">
              <div class="flex flex-wrap items-center gap-2">
                <div class="flex items-center gap-2">
                  <input v-model="newReset" placeholder="HH:MM" type="time" class="px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700 w-24 text-center" />
                  <button @click="addResetSlot" class="text-xs px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Tambah Jam</button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span v-for="t in resetTimes" :key="t" class="inline-flex items-center gap-2 px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 text-xs">
                    {{ t }}
                    <button @click="removeResetSlot(t)" class="text-gray-500 hover:text-rose-600">×</button>
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button @click="saveResetTimes" class="text-xs px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Simpan</button>
                <button @click="resetNow" class="text-xs px-3 py-2 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Reset Sekarang</button>
              </div>
              <div class="text-[11px] text-gray-500">
                Terakhir reset: <strong v-if="settings.lastResetAt">{{ formatDate(settings.lastResetAt) }}</strong><span v-else>—</span>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
      <div v-if="activeTab==='history'" class="space-y-4">
  <!-- Filter tanggal & reload -->
  <div class="flex flex-wrap items-end gap-2">
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
    <button @click="reloadHistory" class="text-xs px-3 py-2 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
      Muat History
    </button>
  </div>

  <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-neutral-700">
    <table class="min-w-full text-sm">
      <thead class="bg-gray-50 dark:bg-neutral-900/40">
        <tr class="text-left">
          <th class="px-3 py-2">Sesi</th>
          <th class="px-3 py-2">Waktu</th>
          <th class="px-3 py-2">Total</th>
          <th class="px-3 py-2">Reset By</th>
          <th class="px-3 py-2 w-32">Action</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-neutral-800">
        <tr v-for="s in history" :key="s.id">
          <td class="px-3 py-2 font-medium">{{ s.id }}</td>
          <td class="px-3 py-2">
            <div class="text-xs">Mulai: {{ s.meta.startedAt ? formatDate(s.meta.startedAt) : '—' }}</div>
            <div class="text-xs">Selesai: {{ s.meta.endedAt ? formatDate(s.meta.endedAt) : '—' }}</div>
          </td>
          <td class="px-3 py-2">{{ s.meta.total || 0 }}</td>
          <td class="px-3 py-2 text-xs">{{ s.meta.resetBy || '—' }}</td>
          <td class="px-3 py-2">
            <div class="flex items-center gap-2">
              <button @click="openHistoryDetail(s.id)" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
                Detail
              </button>
              <button @click="exportHistoryCSV(s.id)" class="text-xs px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700">
                Export CSV
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="!history.length">
          <td colspan="5" class="px-3 py-6 text-center text-gray-500 dark:text-neutral-400">Belum ada history.</td>
        </tr>
      </tbody>
    </table>
  </div>
  <ModalShell v-model="showHistDetail" :title="`Detail Sesi ${histDetailId || ''} — ${activeTipe==='ALL' ? 'Semua' : activeTipe}`">
    <div class="space-y-3">
      <div class="text-xs text-gray-600 dark:text-neutral-300">Tampilan sesuai filter tipe: <strong>{{ activeTipe }}</strong></div>
  
      <!-- Ringkas per Maskan -->
      <div class="rounded border border-gray-200 dark:border-neutral-700 overflow-hidden">
        <div class="bg-gray-50 dark:bg-neutral-900/40 px-3 py-2 text-xs font-medium">Ringkasan per Maskan</div>
        <div class="max-h-60 overflow-auto divide-y divide-gray-200 dark:divide-neutral-800">
          <div v-for="g in groupedByMaskan" :key="g.m" class="px-3 py-2 text-sm flex items-center justify-between">
            <div class="truncate">Maskan {{ g.m }}</div>
            <div class="font-semibold">{{ g.count }}</div>
          </div>
          <div v-if="!groupedByMaskan.length" class="px-3 py-3 text-sm text-gray-500">Tidak ada data sesuai filter.</div>
        </div>
      </div>
  
      <!-- Daftar baris -->
      <div class="rounded border border-gray-200 dark:border-neutral-700 overflow-hidden">
        <div class="bg-gray-50 dark:bg-neutral-900/40 px-3 py-2 text-xs font-medium">Daftar Absen</div>
        <div class="max-h-72 overflow-auto">
          <table class="min-w-full text-xs">
            <thead>
              <tr class="text-left">
                <th class="px-3 py-2">Nama</th>
                <th class="px-3 py-2">Maskan</th>
                <th class="px-3 py-2">Kamar</th>
                <th class="px-3 py-2">Sumber</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-neutral-800">
              <tr v-for="r in filteredRows" :key="r.key">
                <td class="px-3 py-2">{{ r.name }}</td>
                <td class="px-3 py-2">{{ r.maskan || '-' }}</td>
                <td class="px-3 py-2">{{ r.kamar || '-' }}</td>
                <td class="px-3 py-2">{{ r.by?.toUpperCase() || 'manual' }}</td>
              </tr>
              <tr v-if="!filteredRows.length">
                <td colspan="4" class="px-3 py-3 text-gray-500">Kosong.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  
    <template #footer>
      <button @click="showHistDetail=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Tutup</button>
    </template>
  </ModalShell>
</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useMaskan, type MaskanRow } from '~/composables/data/useMaskan'
import { useSantri } from '~/composables/data/useSantri'
import { useAbsensi, history, fetchHistory, readHistorySession } from '~/composables/data/useAbsensi'
import ModalShell from '~/components/widget/ModalShell.vue'

definePageMeta({ layout: 'app', layoutProps: { title: 'Absensi Harian' } })

const { rows: maskan, fetchMaskan } = useMaskan()
const { rows: santri, fetchSantri } = useSantri()
const {
  loading, current, live, settings, currentCount,
  fetchCurrent, fetchSettings, saveSettings, subscribeLive,
  markPresentBySantriId, markPresentManual, resetSession, shouldResetNow
} = useAbsensi()

const { history, fetchHistory, readHistorySession } = useAbsensi()
const histDate = ref<string>('')
const histLimit = ref<number>(20)

onMounted(async () => {
  await Promise.all([fetchMaskan(), fetchSantri(), fetchCurrent(), fetchSettings(), await fetchHistory({ limit: histLimit.value })])
  unsub = subscribeLive(50)
  timer = window.setInterval(async () => {
    if (shouldResetNow()) await resetSession({ resetBy: 'auto' })
  }, 30000)
})

async function reloadHistory() {
  await fetchHistory({ limit: histLimit.value, date: histDate.value || undefined })
}

const showHistDetail = ref(false)
const histDetailId = ref<string>('')
const histDetailMembers = ref<Record<string, any>>({})

async function openHistoryDetail(id: string) {
  histDetailId.value = id
  histDetailMembers.value = await readHistorySession(id)
  showHistDetail.value = true
}

function tipeForMember(row: any): 'Putra'|'Putri'|'Unknown' {
  // prioritas: santriId -> lihat santri -> lihat maskan santri -> cek tipe dari daftar maskan
  if (row.santriId) {
    const s = santri.value.find(x => x.id === row.santriId)
    if (s) {
      const m = maskan.value.find(mm => (mm.name||'').toLowerCase().trim() === (s.maskan||'').toLowerCase().trim())
      return (m?.tipe as any) || 'Unknown'
    }
  }
  // fallback manual maskan
  if (row.maskan) {
    const m = maskan.value.find(mm => (mm.name||'').toLowerCase().trim() === (row.maskan||'').toLowerCase().trim())
    return (m?.tipe as any) || 'Unknown'
  }
  return 'Unknown'
}

// baris untuk tabel detail (terfilter tipe)
const filteredRows = computed(() => {
  const arr: Array<{ key:string; name:string; maskan?:string; kamar?:string; by?:string; tipe:string }> = []
  for (const [k, v] of Object.entries(histDetailMembers.value || {})) {
    const r = v as any
    const tipe = tipeForMember(r)
    if (activeTipe.value !== 'ALL' && tipe !== activeTipe.value) continue
    arr.push({
      key: k,
      name: r.name || '',
      maskan: r.maskan || (santri.value.find(x=>x.id===r.santriId)?.maskan || ''),
      kamar: r.kamar || (santri.value.find(x=>x.id===r.santriId)?.kamar || ''),
      by: r.by || 'manual',
      tipe,
    })
  }
  return arr.sort((a,b) => (a.maskan||'').localeCompare(b.maskan||'', 'id') || (a.name||'').localeCompare(b.name||'', 'id'))
})

const groupedByMaskan = computed(() => {
  const map = new Map<string, number>()
  for (const r of filteredRows.value) {
    const k = (r.maskan || '-')
    map.set(k, (map.get(k)||0) + 1)
  }
  return [...map.entries()].map(([m, count]) => ({ m, count })).sort((a,b)=> a.m.localeCompare(b.m, 'id'))
})

function exportHistoryCSV(id: string) {
  if (histDetailId.value !== id) {
    alert('Buka detail sesi terlebih dahulu untuk export sesuai filter tipe.')
    return
  }
  const rows = filteredRows.value
  const header = ['Nama', 'Maskan', 'Kamar', 'Sumber', 'Tipe']
  const lines = [header.join(',')]
  for (const r of rows) {
    const line = [r.name, r.maskan || '', r.kamar || '', (r.by||'').toUpperCase(), r.tipe]
      .map(x => `"${String(x).replace(/"/g,'""')}"`).join(',')
    lines.push(line)
  }
  const csv = lines.join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `absensi_${id}_${activeTipe.value.toLowerCase()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

onBeforeUnmount(() => { if (unsub) unsub(); if (timer) clearInterval(timer) })
let unsub: (()=>void)|null = null
let timer: number|undefined

const activeTab = ref<'realtime'|'history'>('realtime')
const tipeTabs = ['ALL','Putra','Putri'] as const
const activeTipe = ref<typeof tipeTabs[number]>('ALL')

const maskanRows = computed(() =>
  maskan.value.filter(m => activeTipe.value==='ALL' ? true : m.tipe===activeTipe.value)
)

function santriInRoom(maskanName: string, kamarNumber: string) {
  const mKey = (maskanName || '').toLowerCase().trim()
  const kKey = String(kamarNumber || '').toLowerCase().trim()
  return santri.value.filter(s =>
    (s.maskan || '').toLowerCase().trim() === mKey &&
    String(s.kamar || '').toLowerCase().trim() === kKey
  )
}

function roomSize(mId: string, roomNumber: string) {
  const m = maskan.value.find(x => x.id === mId)
  if (!m) return 0
  return santriInRoom(m.name, roomNumber).length
}
function presentByMaskan(mId: string) {
  const m = maskan.value.find(x => x.id === mId)
  if (!m) return 0
  const mKey = (m.name || '').toLowerCase().trim()
  let count = 0
  for (const [, e] of Object.entries(current.value || {})) {
    const ev = e as any
    if (ev.santriId) {
      const s = santri.value.find(x => x.id === ev.santriId)
      if ((s?.maskan || '').toLowerCase().trim() === mKey) count++
    } else if ((ev.maskan || '').toLowerCase().trim() === mKey) count++
  }
  return count
}
function presentByRoom(mId: string, roomNumber: string) {
  const m = maskan.value.find(x => x.id === mId)
  if (!m) return 0
  const mKey = (m.name || '').toLowerCase().trim()
  const rKey = String(roomNumber || '').toLowerCase().trim()
  let count = 0
  for (const [, e] of Object.entries(current.value || {})) {
    const ev = e as any
    if (ev.santriId) {
      const s = santri.value.find(x => x.id === ev.santriId)
      if ((s?.maskan || '').toLowerCase().trim() === mKey &&
          String(s?.kamar || '').toLowerCase().trim() === rKey) count++
    } else if ((ev.maskan || '').toLowerCase().trim() === mKey &&
               String(ev.kamar || '').toLowerCase().trim() === rKey) count++
  }
  return count
}
function totalByMaskan(mId:string) {
  const m = maskan.value.find(x => x.id === mId)
  if (!m) return 0
  const key = (m.name || '').toLowerCase().trim()
  return santri.value.filter(s => (s.maskan||'').toLowerCase().trim() === key).length
}
function roomProgress(mId: string, roomNumber: string) {
  const total = roomSize(mId, roomNumber)
  if (total <= 0) return 0
  const ok = presentByRoom(mId, roomNumber)
  return Math.min(100, Math.round((ok / total) * 100))
}

const liveSorted = computed(() => [...live.value].sort((a,b) => (b.ts ?? 0) - (a.ts ?? 0)))
function timeAgo(ts?: number) {
  if (!ts) return '—'
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'baru saja'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60), rm = m % 60
  return `${h}j ${rm}m`
}
function formatDate(ts?: number) {
  if (!ts) return '—'
  const d = new Date(ts)
  return d.toLocaleString()
}

const manualMode = ref<'santri'|'manual'>('santri')
const man = ref({
  q: '',
  sel: null as null | { id: string; name: string; maskan?: string; kamar?: string },
  manual: { mId: '' as string, room: '' as string, name: '' as string }
})

const manCandidates = computed(() => {
  const q = man.value.q.trim().toLowerCase()
  if (!q) return []
  return santri.value
    .filter(s =>
      (s.santri||'').toLowerCase().includes(q) ||
      (s.kamar||'').toLowerCase().includes(q) ||
      (s.maskan||'').toLowerCase().includes(q)
    )
    .slice(0, 30)
})

function pickManualSantri(s:any) {
  man.value.sel = { id: s.id, name: s.santri, maskan: s.maskan, kamar: s.kamar }
  man.value.q = ''
}
function roomsOf(mId?: string) {
  const m = maskan.value.find(x => x.id === mId)
  return m?.rooms || []
}
async function submitManualPicked() {
  const s = man.value.sel
  if (!s) return
  await markPresentBySantriId(s.id, s.name, { maskan: s.maskan, kamar: s.kamar })
  man.value.sel = null
}
async function submitManualName() {
  const mId = man.value.manual.mId
  const m = maskan.value.find(x => x.id === mId)
  const maskanName = m?.name || ''
  const room = man.value.manual.room || ''
  const name = man.value.manual.name.trim()
  if (!name) return
  await markPresentManual(name, { maskan: maskanName, kamar: room })
  man.value.manual.name = ''
}

const resetTimes = ref<string[]>([])
const newReset = ref<string>('')

watch(() => settings.value.resetTimes, (v) => {
  resetTimes.value = Array.isArray(v) ? [...v] : []
}, { immediate: true })

onMounted(() => {
    console.log(settings.value.resetTimes)
  const arr = Array.isArray(settings.value.resetTimes) ? settings.value.resetTimes : []
  const single = settings.value.resetTime ? [settings.value.resetTime] : []
  const merged = [...new Set([...arr, ...single])]
  resetTimes.value = merged
})

function validHHMM(s: string) {
  if (!/^\d{2}:\d{2}$/.test(s)) return false
  const [h, m] = s.split(':').map(Number)
  return h! >= 0 && h! < 24 && m! >= 0 && m! < 60
}
function addResetSlot() {
  const t = (newReset.value || '').trim()
  if (!validHHMM(t)) return
  if (!resetTimes.value.includes(t)) resetTimes.value = [...resetTimes.value, t].sort()
  newReset.value = ''
}
function removeResetSlot(t: string) {
  resetTimes.value = resetTimes.value.filter(x => x !== t)
}
async function saveResetTimes() {
  await saveSettings({ resetTimes: resetTimes.value })
}

async function resetNow() {
  await resetSession({ resetBy: 'manual' })
}
async function reloadAll() {
  await Promise.all([fetchMaskan(), fetchSantri(), fetchCurrent(), fetchSettings()])
}
</script>
