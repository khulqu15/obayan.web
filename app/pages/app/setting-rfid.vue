<template>
  <section class="relative">
    <!-- BG -->
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

    <div class="relative p-6 grid grid-cols-7 gap-3">
      <div class="col-span-6">
        <div class="mb-4 flex items-center justify-between">
          <h1 class="text-lg font-semibold">Registrasi / Penggantian Kartu RFID</h1>
          <div class="flex items-center gap-2">
            <button @click="reloadAll"
                    class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
              Muat Ulang
            </button>
          </div>
        </div>
      </div>

      <!-- Panel waiting live scan singleton (/alberr/rfid/live) -->
      <div class="lg:col-span-2 col-span-6">
        <div class="sticky top-10">
          <div class="rounded-xl border border-gray-200 dark:border-neutral-700 p-4 relative overflow-hidden">
            <div class="relative inset-0 flex items-center justify-center pointer-events-none">
              <div class="relative h-44 w-44">
                <div class="absolute inset-0 rounded-full bg-indigo-500/10"></div>
                <div class="absolute inset-0 rounded-full animate-ping bg-blue-500/20"></div>
                <div class="absolute inset-0 rounded-full [animation:ping_2s_ease-out_infinite] bg-indigo-500/10"></div>
                <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-2xl border-2 border-indigo-400/60 backdrop-blur-sm bg-white/40 dark:bg-neutral-900/40 shadow-[0_0_30px_rgba(99,102,241,0.35)] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18v3m0-3a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v9a3 3 0 0 0 3 3zm0-15v3m6 6a6 6 0 1 0-12 0" />
                  </svg>
                </div>
              </div>
            </div>
            <div class="relative">
              <p class="mt-4 text-center">Menunggu RFID...</p>
              <div class="mt-3 text-xs rounded border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/50 px-3 py-2">
                Terakhir: <strong>{{ liveScanHex }}</strong><br>
                Waktu: <strong>{{ liveScanTime }}</strong>
              </div>
              <div class="mt-2 flex items-center justify-center gap-2">
                <button @click="cancelLive"
                        class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
                  Bersihkan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabel santri + aksi bind/replace/unbind -->
      <div class="lg:col-span-5 col-span-6">
        <DataTable title="Daftar Santri & Kartu" :rows="tableRows" :columns="columns" :rowKey="(r) => r.id" :show-actions="true">
          <template #cell-santri="{ row }">
            <div class="font-medium">{{ row.santri }}</div>
            <div class="text-[11px] text-gray-500">Maskan {{ row.maskan || '-' }} • Kamar {{ row.kamar || '-' }}</div>
          </template>
          <template #cell-uid="{ row }">
            <span v-if="row.uid" class="inline-flex items-center px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-neutral-800">
              {{ shortenUid(row.uid) }}
            </span>
            <span v-else class="text-gray-400">—</span>
          </template>
          <template #cell-action="{ row }">
            <div class="flex flex-wrap gap-1">
              <button v-if="row.uid" @click="openReplace(row)" class="text-xs px-2 py-1 rounded border hover:bg-gray-50 dark:hover:bg-neutral-800">Ganti Kartu</button>
              <button v-else @click="openBind(row)" class="text-xs px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700">Bind Baru</button>
              <button v-if="row.uid" @click="askUnbind(row)" class="text-xs px-2 py-1 rounded border text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">Hapus</button>
            </div>
          </template>
        </DataTable>
      </div>

      <!-- Modal bind dari /alberr/rfid/live (singleton) -->
      <ModalShell v-model="showLive" title="Scan RFID Terdeteksi" size="3xl">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div class="lg:col-span-2 order-1 lg:order-2">
            <div class="rounded-xl border border-gray-200 dark:border-neutral-700 p-4 relative overflow-hidden">
              <div class="relative inset-0 flex items-center justify-center pointer-events-none">
                <div class="relative h-44 w-44">
                  <div class="absolute inset-0 rounded-full bg-indigo-500/10"></div>
                  <div class="absolute inset-0 rounded-full animate-ping bg-blue-500/20"></div>
                  <div class="absolute inset-0 rounded-full [animation:ping_2s_ease-out_infinite] bg-indigo-500/10"></div>
                  <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                              h-20 w-20 rounded-2xl border-2 border-indigo-400/60
                              backdrop-blur-sm bg-white/40 dark:bg-neutral-900/40
                              shadow-[0_0_30px_rgba(99,102,241,0.35)] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M12 18v3m0-3a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v9a3 3 0 0 0 3 3zm0-15v3m6 6a6 6 0 1 0-12 0" />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="relative mt-3 space-y-2">
                <div class="text-xs text-gray-600 dark:text-neutral-300">RFID (HEX)</div>
                <div class="font-mono text-lg font-semibold break-all">
                  {{ liveScanHex }}
                </div>
                <div class="text-xs text-gray-600 dark:text-neutral-300 mt-2">Terakhir scan</div>
                <div class="text-sm">
                  {{ liveScanTime }}
                </div>
              </div>
            </div>
          </div>
          <div class="lg:col-span-3 order-2 lg:order-1">
            <div class="rounded-xl border border-gray-200 dark:border-neutral-700 p-4 space-y-3">
              <label class="text-xs text-gray-600 dark:text-neutral-300">Nama Santri</label>
              <input
                v-model="nameInput"
                list="santriNameList"
                @change="onNamePicked"
                placeholder="Ketik / pilih nama santri…"
                class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"
              />
              <datalist id="santriNameList">
                <option v-for="s in santriRows" :key="s.id" :value="s.santri" />
              </datalist>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="text-xs text-gray-600 dark:text-neutral-300">Maskan / Kamar</label>
                  <input
                    :value="selectedSantri ? `${selectedSantri.maskan || '-'} / ${selectedSantri.kamar || '-'}` : ''"
                    readonly
                    class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"
                  />
                </div>
                <div>
                  <label class="text-xs text-gray-600 dark:text-neutral-300">Jenjang</label>
                  <input
                    :value="selectedSantri?.jenjang || ''"
                    readonly
                    class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"
                  />
                </div>
              </div>

              <p v-if="liveError" class="text-xs text-rose-600">{{ liveError }}</p>
            </div>
          </div>
        </div>

        <template #footer>
          <button @click="cancelLive" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
            Tutup
          </button>
          <button
            :disabled="!canBindLive"
            @click="confirmBindLive"
            class="px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            Bind
          </button>
        </template>
      </ModalShell>

      <!-- Modal menunggu tap (mode bind/replace) dari /alberr/rfid/scans (mode=Registrasi) -->
      <ModalShell v-model="showWait" :title="waitMode==='replace' ? 'Ganti Kartu RFID' : 'Registrasi Kartu RFID'">
        <div class="grid grid-cols-1 gap-4">
          <div class="rounded-xl border border-gray-200 dark:border-neutral-700 p-4 relative overflow-hidden">
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="relative h-44 w-44">
                <div class="absolute inset-0 rounded-full bg-indigo-500/10"></div>
                <div class="absolute inset-0 rounded-full animate-ping bg-blue-500/20"></div>
                <div class="absolute inset-0 rounded-full [animation:ping_2s_ease-out_infinite] bg-indigo-500/10"></div>
                <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                            h-20 w-20 rounded-2xl border-2 border-indigo-400/60
                            backdrop-blur-sm bg-white/40 dark:bg-neutral-900/40
                            shadow-[0_0_30px_rgba(99,102,241,0.35)] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                          d="M12 18v3m0-3a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v9a3 3 0 0 0 3 3zm0-15v3m6 6a6 6 0 1 0-12 0" />
                  </svg>
                </div>
              </div>
            </div>
            <div class="relative">
              <p class="text-sm text-gray-700 dark:text-neutral-200">
                Silakan <strong>tap</strong> kartu RFID di reader…
              </p>
              <ul class="mt-2 text-xs text-gray-600 dark:text-neutral-300 list-disc pl-4 space-y-1">
                <li>Pastikan perangkat reader online.</li>
                <li>Jika kartu lama hilang, cukup tap kartu baru.</li>
              </ul>
              <div class="mt-3 text-xs rounded border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/50 px-3 py-2">
                Target: <strong>{{ target?.santri || '-' }}</strong><br>
                Mode: <strong>{{ waitMode==='replace' ? 'Ganti' : 'Bind Baru' }}</strong><br>
                Status: <strong>{{ lastTap ? 'Kartu terdeteksi' : (waiting ? 'Menunggu…' : 'Berhenti') }}</strong>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 dark:border-neutral-700 p-4 space-y-3">
            <label class="text-xs text-gray-600 dark:text-neutral-300">UID Hasil Tap</label>
            <input
              :value="lastTap?.uid || ''"
              placeholder="— belum ada —"
              readonly
              class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"
            />

            <div class="text-center text-xs text-gray-500">atau masukkan UID manual</div>

            <input
              v-model.trim="manualUid"
              placeholder="Tulis UID baru…"
              class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"
            />

            <p v-if="waitError" class="text-xs text-rose-600">{{ waitError }}</p>
          </div>
        </div>

        <template #footer>
          <button @click="stopWait" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
            Batal
          </button>
          <button
            :disabled="!candidateUid"
            @click="confirmBind"
            class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            Gunakan UID
          </button>
        </template>
      </ModalShell>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import DataTable from '~/components/widget/DataTable.vue'
import ModalShell from '~/components/widget/ModalShell.vue'
import { useSantri } from '~/composables/data/useSantri'
import { useRFID } from '~/composables/data/useRFID'

definePageMeta({ layout: 'app', layoutProps: { title: 'Registrasi RFID' } })

const { rows: santriRows, fetchSantri } = useSantri()
const {
  loading, error, bySantri, byCard, fetchBindings, isCardBound, unbindSantri, bindCardToSantri,
  waiting, lastTap, startWaitingTap, stopWaitingTap, subscribeLive, unsubscribeLive, live, clearLive
} = useRFID()

onMounted(async () => {
  await Promise.all([fetchSantri(), fetchBindings()])
  subscribeLive()
})

const showLive = ref(false)
const nameInput = ref('')
const selectedSantri = ref<ReturnType<typeof useSantri>['rows']['value'][number] | null>(null)
const liveError = ref<string | null>(null)

watch(live, (v) => {
  // Tampilkan modal bind dari singleton live
  if (v && v.rfid) {
    showLive.value = true
    liveError.value = null
    nameInput.value = ''
    selectedSantri.value = null
  }
})

const columns = [
  { key: 'santri', label: 'Santri', sortable: true },
  { key: 'uid', label: 'UID', sortable: true },
]

const tableRows = computed(() => {
  return santriRows.value.map(s => {
    const curUid = bySantri.value?.[s.id]?.uid || s.rfid || ''
    return {
      id: s.id,
      santri: s.santri,
      maskan: s.maskan || '',
      kamar: s.kamar || '',
      uid: curUid,
    }
  })
})

function onNamePicked() {
  const q = (nameInput.value || '').trim().toLowerCase()
  const match = santriRows.value.find(s => (s.santri || '').trim().toLowerCase() === q)
  selectedSantri.value = match || null
}

const liveScanHex = computed(() => {
  const uid = live.value?.rfid || ''
  const hex = uid.replace(/[^a-fA-F0-9]/g, '').toUpperCase()
  if (!hex) return '—'
  return hex.match(/.{1,2}/g)?.join(' ') || hex
})

const liveScanTime = computed(() => {
  const ts = live.value?.timestamp
  if (!ts) return '—'
  try {
    const n = typeof ts === 'number' ? ts : Date.parse(String(ts))
    return isNaN(n) ? String(ts) : new Date(n).toLocaleString('id-ID')
  } catch { return String(ts) }
})

async function cancelLive() {
  try { await clearLive() } finally { showLive.value = false }
}

const canBindLive = computed(() => !!(live.value?.rfid && selectedSantri.value?.id))

async function confirmBindLive() {
  if (!canBindLive.value || !live.value || !selectedSantri.value) return
  liveError.value = null
  try {
    const uid = String(live.value.rfid).trim()
    const used = await isCardBound(uid)
    const sameOwner = used && used.santriId === selectedSantri.value.id
    if (used && !sameOwner) {
      liveError.value = `Kartu sudah terdaftar untuk: ${used.name}`
      return
    }
    await bindCardToSantri({
      uid,
      santriId: selectedSantri.value.id,
      name: selectedSantri.value.santri,
      maskan: selectedSantri.value.maskan,
      kamar: selectedSantri.value.kamar
    })
    await Promise.all([fetchSantri(), fetchBindings()])
    showLive.value = false
    await clearLive()
  } catch (e: any) {
    liveError.value = e?.message ?? 'Gagal melakukan bind'
  }
}

function shortenUid(uid: string) {
  const u = String(uid || '')
  if (u.length <= 8) return u || '—'
  return `${u.slice(0,4)}…${u.slice(-4)}`
}

const target = ref<{ id: string; santri: string; maskan?: string; kamar?: string; currentUid?: string } | null>(null)
const waitMode = ref<'bind'|'replace'>('bind')
const showWait = ref(false)
const manualUid = ref('')
const waitError = ref<string|null>(null)

function openBind(row: any) {
  target.value = { id: row.id, santri: row.santri, maskan: row.maskan, kamar: row.kamar, currentUid: '' }
  waitMode.value = 'bind'
  waitError.value = null
  manualUid.value = ''
  showWait.value = true
  startWaitingTap()
}

function openReplace(row: any) {
  target.value = { id: row.id, santri: row.santri, maskan: row.maskan, kamar: row.kamar, currentUid: row.uid }
  waitMode.value = 'replace'
  waitError.value = null
  manualUid.value = ''
  showWait.value = true
  startWaitingTap()
}

function stopWait() {
  stopWaitingTap()
  waitError.value = null
  manualUid.value = ''
  showWait.value = false
}

const candidateUid = computed(() => (lastTap.value?.uid || manualUid.value || '').trim())

async function confirmBind() {
  if (!target.value) return
  waitError.value = null
  const uid = candidateUid.value
  if (!uid) { waitError.value = 'UID kosong'; return }

  try {
    const used = await isCardBound(uid)
    const sameOwner = used && used.santriId === target.value.id
    if (used && !sameOwner) {
      waitError.value = `Kartu sudah terdaftar untuk: ${used.name}`
      return
    }
    await bindCardToSantri({
      uid,
      santriId: target.value.id,
      name: target.value.santri,
      maskan: target.value.maskan,
      kamar: target.value.kamar,
      replacedFrom: waitMode.value === 'replace' ? (target.value.currentUid || '') : undefined
    })
    stopWait()
    await Promise.all([fetchSantri(), fetchBindings()])
  } catch (e:any) {
    waitError.value = e?.message ?? 'Gagal menyimpan'
  }
}

async function askUnbind(row: any) {
  if (!row?.id) return
  if (!confirm(`Hapus kartu untuk ${row.santri}?`)) return
  await unbindSantri(row.id)
  await Promise.all([fetchSantri(), fetchBindings()])
}

async function reloadAll() {
  await Promise.all([fetchSantri(), fetchBindings()])
}

onBeforeUnmount(() => {
  stopWaitingTap()
  unsubscribeLive()
})
</script>

<style scoped>
@keyframes ping_2s_ease-out_infinite {
  0%   { transform: scale(1);   opacity: 0.35; }
  70%  { transform: scale(1.35); opacity: 0; }
  100% { transform: scale(1.35); opacity: 0; }
}
</style>
