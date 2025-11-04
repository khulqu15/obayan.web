<template>
  <div class="min-h-screen overflow-x-hidden w-full relative">
    <!-- subtle background grid / gradients -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div class="absolute top-10 -left-24 w-[42rem] h-[42rem] rounded-full opacity-40 blur-3xl bg-gradient-to-br from-emerald-200 to-sky-200 dark:from-blue-900/40 dark:to-blue-900/30" />
      <div class="absolute bottom-10 -right-24 w-[36rem] h-[36rem] rounded-full opacity-30 blur-3xl bg-gradient-to-tr from-blue-100 to-teal-100 dark:from-blue-900/30 dark:to-blue-900/30" />
      <div class="absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent_80%)]">
        <div class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,0,0,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,.06)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.06)_1px,transparent_1px)]" />
      </div>
    </div>

    <div class="flex justify-center">
      <div class="max-w-7xl w-full relative pt-28 px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 class="text-2xl font-semibold tracking-tight">Realtime Attendance</h1>
            <p class="text-sm text-gray-500">Scan kartu RFID atau input manual untuk menandai kehadiran.</p>
          </div>
          <div class="flex items-center gap-2">
            <button class="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-3 py-2 shadow" @click="openSettings = true">
              <Icon icon="mdi:cog" class="mr-1" width="18" height="18" /> Settings
            </button>
            <button class="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-3 py-2 shadow" @click="exportCSV">
              <Icon icon="mdi:download" class="mr-1" width="18" height="18" /> Export CSV
            </button>
            <label class="btn btn-sm bg-white hover:bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 shadow cursor-pointer">
              <Icon icon="mdi:upload" class="mr-1" width="18" height="18" /> Import CSV
              <input ref="fileInput" type="file" class="hidden" accept=".csv" @change="onImportFile" />
            </label>
            <button class="btn btn-sm bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-3 py-2 shadow" @click="confirmReset">
              <Icon icon="mdi:refresh" class="mr-1" width="18" height="18" /> Reset Sesi
            </button>
          </div>
        </div>

        <!-- KPI cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <div class="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div class="text-sm text-gray-500">Now Present</div>
            <div class="text-3xl font-semibold leading-tight">{{ presentCount }}</div>
          </div>
          <div class="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div class="text-sm text-gray-500">Live Events</div>
            <div class="text-3xl font-semibold leading-tight">{{ live.length }}</div>
          </div>
          <div class="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div class="text-sm text-gray-500">Last Reset</div>
            <div class="text-lg font-medium">{{ lastResetLabel }}</div>
          </div>
          <div class="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div class="text-sm text-gray-500">Auto Reset Times</div>
            <div class="text-lg font-medium truncate" :title="(settings.resetTimes||[]).join(', ')">
              {{ (settings.resetTimes||[]).join(', ') || '—' }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Left: Live Widget -->
          <div class="lg:col-span-1">
            <div class="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div class="flex items-center justify-between mb-2">
                <h2 class="font-semibold">Live Feed</h2>
                <button class="btn btn-xs bg-white hover:bg-gray-50 border border-gray-200 rounded-lg" @click="refresh()">
                  <Icon icon="mdi:refresh" width="16" height="16" class="mr-1"/>
                </button>
              </div>
              <div class="border rounded-lg overflow-hidden h-64 overflow-y-auto divide-y border-gray-200">
                <template v-if="live.length">
                  <div v-for="e in [...live].slice().reverse()" :key="e.id" class="p-3 flex items-center gap-3 border-gray-100">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-200 to-emerald-400 flex items-center justify-center">
                      <Icon icon="ri:rfid-fill" width="22" height="22" class="text-emerald-800"/>
                    </div>
                    <div class="min-w-0">
                      <div class="font-medium truncate">{{ e.name || 'Santri Fulan' }}</div>
                      <div class="text-xs text-gray-500 truncate">
                        {{ e.maskan || '—' }} • {{ e.kamar || '—' }} • {{ formatTime(e.ts) }}
                      </div>
                    </div>
                    <div class="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white">{{ (e.by||'').toUpperCase() }}</div>
                  </div>
                </template>
                <div v-else class="h-full grid place-items-center text-sm text-gray-500">Belum ada event.</div>
              </div>
            </div>
          </div>

          <!-- Right: Table -->
          <div class="lg:col-span-2">
            <div class="p-4 rounded-xl bg-white border border-gray-200 shadow-xl shadow-gray-50/40">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <h2 class="font-semibold">Attendance Log (Current)</h2>
                <div class="flex items-center gap-2 flex-wrap">
                  <div class="relative">
                    <Icon icon="mdi:magnify" class="absolute left-2 top-1/2 -translate-y-1/2" width="18" height="18" />
                    <input v-model="search" type="search" placeholder="Cari nama/maskan/kamar…" class="input input-sm pl-8 rounded-lg border border-gray-200 w-64" />
                  </div>
                  <select v-model="sortKey" class="select select-sm rounded-lg border border-gray-200">
                    <option value="time_desc">Waktu ↓</option>
                    <option value="time_asc">Waktu ↑</option>
                    <option value="name_asc">Nama A→Z</option>
                    <option value="name_desc">Nama Z→A</option>
                  </select>
                  <select v-model="pageSize" class="select select-sm rounded-lg border border-gray-200">
                    <option :value="10">10 / page</option>
                    <option :value="25">25 / page</option>
                    <option :value="50">50 / page</option>
                    <option :value="100">100 / page</option>
                  </select>
                </div>
              </div>
              <div class="overflow-x-auto rounded-lg border border-gray-200">
                <table class="w-full table-auto border border-gray-200-collapse text-sm">
                  <thead>
                    <tr class="bg-gray-50">
                      <th class="text-left p-3 border-b border-gray-200">Nama</th>
                      <th class="text-left p-3 border-b border-gray-200">Santri ID</th>
                      <th class="text-left p-3 border-b border-gray-200">Maskan / Kamar</th>
                      <th class="text-left p-3 border-b border-gray-200">Waktu</th>
                      <th class="text-left p-3 border-b border-gray-200">Metode</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in pagedRows" :key="row.key" class="hover:bg-gray-50">
                      <td class="p-3 border-b border-gray-200 font-medium">{{ row.name }}</td>
                      <td class="p-3 border-b border-gray-200">{{ row.santriId || '—' }}</td>
                      <td class="p-3 border-b border-gray-200">{{ row.maskan || '—' }}<span v-if="row.kamar"> / {{ row.kamar }}</span></td>
                      <td class="p-3 border-b border-gray-200">{{ formatTime(row.ts) }}</td>
                      <td class="p-3 border-b border-gray-200">
                        <span class="px-2 py-0.5 rounded-full text-white text-[11px] font-semibold inline-block"
                              :class="row.by?.startsWith('manual') || row.by==='manual' ? 'bg-amber-600' : 'bg-blue-600'">
                          {{ (row.by || 'manual').toUpperCase() }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="!pagedRows.length">
                      <td colspan="5" class="p-6 text-center text-gray-500">Tidak ada data.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <div class="flex items-center justify-between mt-4">
                <div class="text-xs text-gray-500">Menampilkan {{ startIndex+1 }}–{{ Math.min(startIndex+pageSize, filteredRows.length) }} dari {{ filteredRows.length }}</div>
                <div class="flex items-center gap-2">
                  <button class="btn btn-xs border border-gray-200 rounded-lg px-2" :disabled="page===1" @click="page=1">⟪</button>
                  <button class="btn btn-xs border border-gray-200 rounded-lg px-2" :disabled="page===1" @click="page--">‹</button>
                  <span class="text-xs">Hal {{ page }} / {{ totalPages }}</span>
                  <button class="btn btn-xs border border-gray-200 rounded-lg px-2" :disabled="page===totalPages" @click="page++">›</button>
                  <button class="btn btn-xs border border-gray-200 rounded-lg px-2" :disabled="page===totalPages" @click="page=totalPages">⟫</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings Modal -->
        <teleport to="body">
            <div v-if="openSettings" class="fixed inset-0 z-[100]">
                <div class="absolute inset-0 bg-black/40" @click="openSettings=false" />
                <div class="absolute inset-0 grid place-items-center p-4">
                    <div class="w-full max-w-xl rounded-2xl bg-white border border-gray-200 shadow-xl">
                        <div class="p-5">
                            <h3 class="font-semibold text-lg mb-3">Attendance Settings</h3>
                            <div class="space-y-4">
                                <div>
                                    <label class="text-sm font-medium">Auto Reset Times (HH:MM, 24h)</label>
                                    <div class="mt-1 flex items-center gap-2">
                                        <input ref="timesInputEl" v-model="timesInput" type="text" placeholder="e.g. 06:30, 12:00, 20:45" class="input input-sm w-full rounded-lg border border-gray-200"/>
                                        <button class="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg" @click="saveTimes">Simpan</button>
                                    </div>
                                    <p class="text-xs text-gray-500 mt-1">Pisahkan dengan koma. Nilai tidak valid akan diabaikan otomatis.</p>
                                </div>


                                <div class="grid grid-cols-2 gap-3">
                                    <div>
                                        <div class="text-xs text-gray-500">Last Reset At</div>
                                        <div class="font-medium">{{ lastResetFull }}</div>
                                    </div>
                                    <div>
                                        <div class="text-xs text-gray-500">Last Reset Key</div>
                                        <div class="font-mono text-sm">{{ settings.lastResetKey || '—' }}</div>
                                    </div>
                                </div>


                                <div class="flex items-center justify-between pt-3">
                                    <button class="btn btn-sm px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg" @click="confirmReset">Reset Sekarang</button>
                                    <div class="flex items-center gap-2">
                                        <button class="btn btn-sm px-3 py-2 bg-white border border-gray-200 rounded-lg" @click="openSettings=false">Tutup</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </teleport>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { Icon } from '@iconify/vue'
// IMPORTANT: ensure your composable includes:  import { useNuxtApp } from '#app'
// and is exported from '@/composables/useAbsensi' (or adjust the path below)
import { useAbsensi } from '~/composables/data/useAbsensi'

// —— Composable ——
const {
  loading, error, current, live, settings, currentCount,
  fetchCurrent, fetchSettings, saveSettings, subscribeLive,
  resetSession, shouldResetNow
} = useAbsensi()

// —— UI State ——
const search = ref('')
const sortKey = ref<'time_desc'|'time_asc'|'name_asc'|'name_desc'>('time_desc')
const page = ref(1)
const pageSize = ref(25)
const fileInput = ref<HTMLInputElement|null>(null)
const openSettings = ref(false)
const settingsDlg = ref<HTMLDialogElement|null>(null)
const timesInput = ref('')

// present count shows unique keys in current
const presentCount = computed(() => currentCount.value)

// normalize current map -> array rows
const rows = computed(() => {
  const out: Array<{ key:string; name:string; santriId?:string; maskan?:string; kamar?:string; ts:number; by?:string }> = []
  const m = current.value || {}
  for (const k of Object.keys(m)) {
    const v = m[k] || {}
    out.push({
      key: k,
      name: String(v.name || 'Santri Fulan'),
      santriId: v.santriId ? String(v.santriId) : undefined,
      maskan: v.maskan ? String(v.maskan) : undefined,
      kamar: v.kamar ? String(v.kamar) : undefined,
      ts: typeof v.ts === 'number' ? v.ts : Date.now(),
      by: String(v.by || '')
    })
  }
  return out
})

// search filter
const filteredRows = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return rows.value
  return rows.value.filter(r => [r.name, r.maskan, r.kamar, r.santriId].filter(Boolean).some(x => String(x).toLowerCase().includes(q)))
})

// sort
const sortedRows = computed(() => {
  const arr = [...filteredRows.value]
  switch (sortKey.value) {
    case 'time_asc':
      arr.sort((a,b)=> a.ts - b.ts); break
    case 'name_asc':
      arr.sort((a,b)=> a.name.localeCompare(b.name)); break
    case 'name_desc':
      arr.sort((a,b)=> b.name.localeCompare(a.name)); break
    default:
      arr.sort((a,b)=> b.ts - a.ts); break
  }
  return arr
})

// pagination
const totalPages = computed(() => Math.max(1, Math.ceil(sortedRows.value.length / pageSize.value)))
watch([sortedRows, pageSize], () => { page.value = 1 })
const startIndex = computed(() => (page.value - 1) * pageSize.value)
const pagedRows = computed(() => sortedRows.value.slice(startIndex.value, startIndex.value + pageSize.value))

// labels
const lastResetLabel = computed(() => {
  if (!settings.value.lastResetAt) return '—'
  return new Date(settings.value.lastResetAt!).toLocaleString()
})
const lastResetFull = computed(() => {
  if (!settings.value.lastResetAt) return '—'
  const d = new Date(settings.value.lastResetAt!)
  return `${d.toISOString()} (${d.toLocaleString()})`
})

// helpers
function formatTime(ts?: number) {
  const d = ts ? new Date(ts) : new Date()
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

// actions
async function refresh() {
  await Promise.all([fetchSettings(), fetchCurrent()])
}

function confirmReset() {
  if (confirm('Yakin reset sesi sekarang? Data current akan dipindahkan ke history.')) {
    resetSession({ resetBy: 'manual' }).catch(console.error)
  }
}

// export CSV (current)
function exportCSV() {
  const headers = ['key','name','santriId','maskan','kamar','time','by']
  const lines = [headers.join(',')]
  for (const r of sortedRows.value) {
    const line = [
      r.key,
      csvEsc(r.name),
      csvEsc(r.santriId||''),
      csvEsc(r.maskan||''),
      csvEsc(r.kamar||''),
      new Date(r.ts).toISOString(),
      csvEsc(r.by||'')
    ].join(',')
    lines.push(line)
  }
  const blob = new Blob(["\ufeff" + lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `attendance_current_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
function csvEsc(s: string) {
  const needs = /[",\n]/.test(s)
  return needs ? '"' + s.replace(/"/g,'""') + '"' : s
}

// import CSV (columns: name,santriId,maskan,kamar,deviceId)
async function onImportFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    const text = await file.text()
    const rows = parseCSV(text)
    // try headers
    const hdr = rows.shift() || []
    const idx = {
      name: hdr.findIndex(h => /name/i.test(h)),
      santriId: hdr.findIndex(h => /santri.?id/i.test(h)),
      maskan: hdr.findIndex(h => /maskan/i.test(h)),
      kamar: hdr.findIndex(h => /kamar/i.test(h)),
      deviceId: hdr.findIndex(h => /device.?id/i.test(h)),
    }
    let count = 0
    for (const r of rows) {
      const name = valAt(r, idx.name) || 'Santri Fulan'
      const santriId = valAt(r, idx.santriId)
      const maskan = valAt(r, idx.maskan)
      const kamar = valAt(r, idx.kamar)
      const deviceId = valAt(r, idx.deviceId)
      if (santriId) {
        await useAbsensi().markPresentBySantriId(santriId, name, { maskan, kamar, deviceId })
        count++
      } else if (name) {
        await useAbsensi().markPresentManual(name, { maskan, kamar, deviceId })
        count++
      }
    }
    alert(`Import selesai: ${count} baris ditandai hadir.`)
  } catch (err) {
    console.error(err)
    alert('Gagal import CSV')
  } finally {
    if (fileInput.value) fileInput.value.value = ''
  }
}

function parseCSV(text: string): string[][] {
  const lines = text.split(/\r?\n/).filter(Boolean)
  const rows: string[][] = []
  for (const line of lines) {
    const out: string[] = []
    let cur = ''
    let quoted = false
    for (let i=0; i<line.length; i++) {
      const ch = line[i]
      if (quoted) {
        if (ch === '"') {
          if (line[i+1] === '"') { cur += '"'; i++ } else { quoted = false }
        } else { cur += ch }
      } else {
        if (ch === '"') quoted = true
        else if (ch === ',') { out.push(cur); cur = '' }
        else { cur += ch }
      }
    }
    out.push(cur)
    rows.push(out.map(s=>s.trim()))
  }
  return rows
}
function valAt(row: string[], idx: number) { return idx >= 0 ? (row[idx]||'').trim() : '' }

// auto reset checker (every 30s)
let timer: number | null = null
onMounted(async () => {
  await refresh()
  const off = subscribeLive(50)
  // keep a reference to call on unmount
  unsub = off
  // prepare settings input
  timesInput.value = (settings.value.resetTimes || []).join(', ')
  timer = window.setInterval(async () => {
    try {
      if (shouldResetNow()) {
        await resetSession({ resetBy: 'auto' })
      }
    } catch (e) { console.error(e) }
  }, 30000)
})

let unsub: null | (()=>void) = null
onBeforeUnmount(() => {
  if (unsub) unsub()
  if (timer) window.clearInterval(timer)
})

watch(() => openSettings.value, (v) => {
  if (v) timesInput.value = (settings.value.resetTimes || []).join(', ')
})

async function saveTimes() {
  const parts = timesInput.value.split(',').map(s=>s.trim()).filter(Boolean)
  await saveSettings({ resetTimes: parts })
  timesInput.value = (settings.value.resetTimes || []).join(', ')
  alert('Reset times disimpan.')
}
</script>

<style scoped lang="postcss">
.btn { @apply inline-flex items-center justify-center font-medium; }
.input { @apply bg-white border border-gray-200-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500; }
.select { @apply bg-white border border-gray-200-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500; }
.modal { @apply fixed inset-0 grid place-items-center bg-black/30; }
.modal-box { @apply bg-white; }
.modal-backdrop { @apply fixed inset-0; }
</style>
