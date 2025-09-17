<template>
  <section class="relative">
    <!-- BG grid + radial -->
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
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <h1 class="text-lg font-semibold">Kunjungan Santri</h1>
          <div class="inline-flex rounded-lg border border-gray-200 dark:border-neutral-700 overflow-hidden">
            <button @click="activeTipe='ALL'"   :class="['px-3 py-1.5 text-xs', activeTipe==='ALL' ? 'bg-blue-600 text-white':'' ]">Semua</button>
            <button @click="activeTipe='Putra'" :class="['px-3 py-1.5 text-xs', activeTipe==='Putra' ? 'bg-blue-600 text-white':'' ]">Putra</button>
            <button @click="activeTipe='Putri'" :class="['px-3 py-1.5 text-xs', activeTipe==='Putri' ? 'bg-blue-600 text-white':'' ]">Putri</button>
          </div>
          <div class="inline-flex items-center gap-2 text-xs">
            <span class="px-2 py-1 rounded border border-gray-200 dark:border-neutral-700">Bulan: {{ monthTitle }}</span>
            <input type="month" v-model="monthInput" @change="changeMonth" class="px-2 py-1 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"/>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button @click="openCreate" class="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">+ Catat Kunjungan</button>
          <button @click="reloadAll" class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Muat Ulang</button>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-6 gap-4">
        <div class="xl:col-span-4">
          <DataTable
            title="Log Kunjungan (bulan berjalan)"
            :rows="filteredLogs"
            :columns="columns"
            :show-actions="true"
            :rowKey="(r)=>r.id"
          >
            <template #cell-ts="{ row }">{{ formatDate(row.ts) }}</template>
            <template #cell-santri="{ row }">
              <div class="font-medium">{{ row.name }}</div>
              <div class="text-[11px] text-gray-500">
                Maskan {{ row.maskan || '-' }} • Kamar {{ row.kamar || '-' }}
              </div>
              <div v-if="row.santriId" class="text-[11px] text-gray-500">
                Bulan ini: {{ visitsThisMonth(row.santriId) }}/2
              </div>
              <div v-else class="text-[11px] text-amber-600">Tidak terhubung ke data santri</div>
            </template>
            <template #cell-visitor="{ row }">
              <div class="font-medium">{{ row.visitor || '-' }}</div>
              <div class="text-[11px] text-gray-500">{{ row.relation || '—' }}</div>
            </template>
            <template #cell-by="{ row }">
              <span class="inline-flex items-center px-2 py-0.5 text-xs rounded border border-gray-200 dark:border-neutral-700">
                {{ (row.by || 'manual').toUpperCase() }}
              </span>
            </template>
            <template #cell-action="{ row }">
              <button @click="del(row.id)" class="text-xs px-2 py-1 rounded border text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">Hapus</button>
            </template>
          </DataTable>
        </div>

        <div class="xl:col-span-2 xl:self-start">
          <div class="xl:sticky xl:top-4">
            <div class="space-y-4 xl:max-h-[calc(100vh-2rem)] xl:overflow-y-auto xl:pr-1">
              <div class="rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden shadow-sm bg-white/80 dark:bg-neutral-900/70">
                <div class="px-4 py-3 bg-gray-50/70 dark:bg-neutral-900/60">
                  <h3 class="font-semibold">Speaker Pengumuman (Realtime)</h3>
                  <p class="text-xs text-gray-600 dark:text-neutral-300">Mengumumkan kunjungan baru via Text-to-Speech.</p>
                </div>
                <div class="px-4 py-3 space-y-2 text-sm">
                  <div class="flex items-center justify-between">
                    <label class="inline-flex items-center gap-2">
                      <input type="checkbox" v-model="tts.enabled" class="shrink-0" />
                      Aktifkan pengumuman
                    </label>
                    <button @click="testSpeak" class="text-xs px-2 py-1 rounded border hover:bg-gray-50 dark:hover:bg-neutral-800">Test</button>
                  </div>
                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <label class="text-xs">Voice</label>
                      <select v-model="tts.voiceURI" class="w-full px-2 py-1 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
                        <option v-for="v in voices" :key="v.voiceURI" :value="v.voiceURI">{{ v.name }}</option>
                      </select>
                    </div>
                    <div>
                      <label class="text-xs">Rate</label>
                      <input type="range" min="0.7" max="1.3" step="0.05" v-model.number="tts.rate" class="w-full"/>
                    </div>
                    <div>
                      <label class="text-xs">Pitch</label>
                      <input type="range" min="0.8" max="1.2" step="0.05" v-model.number="tts.pitch" class="w-full"/>
                    </div>
                    <div>
                      <label class="text-xs">Volume</label>
                      <input type="range" min="0.5" max="1" step="0.05" v-model.number="tts.volume" class="w-full"/>
                    </div>
                  </div>
                  <p class="text-[11px] text-gray-500">Note: Browser perlu interaksi pengguna (klik) agar audio bisa diputar.</p>
                </div>
              </div>

              <div class="rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden shadow-sm bg-white/80 dark:bg-neutral-900/70">
                <div class="px-4 py-3 bg-indigo-50/70 dark:bg-indigo-900/20">
                  <h3 class="font-semibold">Catat Kunjungan (Cepat)</h3>
                </div>
                <div class="px-4 py-3 space-y-2">
                  <div class="relative">
                    <input
                      v-model.trim="quickSantri"
                      @focus="quickSantriFocus=true"
                      @blur="setTimeout(()=>quickSantriFocus=false, 150)"
                      placeholder="Nama santri (pilih/ketik)…"
                      class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"
                    />
                    <div v-if="quickSantriFocus && santriOptions.length" class="absolute z-20 mt-1 w-full rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg max-h-56 overflow-auto">
                      <button v-for="s in santriOptions" :key="s.id" type="button"
                              @mousedown.prevent="pickQuickSantri(s)"
                              class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800">
                        <div class="text-sm font-medium truncate">{{ s.santri }}</div>
                        <div class="text-[11px] text-gray-500 truncate">Maskan {{ s.maskan || '-' }} • Kamar {{ s.kamar || '-' }}</div>
                      </button>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-2">
                    <div class="relative">
                      <input v-model.trim="quickMaskan" placeholder="Maskan" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"/>
                    </div>
                    <div class="relative">
                      <input v-model.trim="quickKamar" placeholder="Kamar" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"/>
                    </div>
                  </div>
                  <input v-model.trim="quickVisitor" placeholder="Nama Pengunjung" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"/>
                  <input v-model.trim="quickRelation" placeholder="Hubungan (Orang Tua/Wali/…)" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"/>

                  <button @click="submitQuick" class="w-full text-xs px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Simpan</button>
                </div>
              </div>

              <div class="rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden shadow-sm bg-white/80 dark:bg-neutral-900/70">
                <div class="px-4 py-3 bg-gray-50/70 dark:bg-neutral-900/60">
                  <h3 class="font-semibold">Realtime Kunjungan</h3>
                  <p class="text-xs text-gray-600 dark:text-neutral-300">Setiap kunjungan baru muncul di sini dan diumumkan (jika Speaker aktif).</p>
                </div>
                <div class="max-h-[360px] overflow-auto divide-y divide-gray-200 dark:divide-neutral-800">
                  <div v-for="e in liveSorted" :key="e.id" class="px-4 py-3">
                    <div class="font-medium">{{ e.name }}</div>
                    <div class="text-[11px] text-gray-500">
                      {{ e.visitor || '—' }} • {{ e.relation || '—' }} • Maskan {{ e.maskan || '-' }} • Kamar {{ e.kamar || '-' }} • {{ (e.by||'').toUpperCase() }}
                    </div>
                    <div class="text-[11px] text-gray-500">{{ timeAgo(e.ts) }}</div>
                  </div>
                  <div v-if="!liveSorted.length" class="px-4 py-6 text-sm text-gray-500">Belum ada aktivitas.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalShell v-model="showForm" title="Catat Kunjungan">
        <form class="space-y-3" @submit.prevent="submitForm">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="sm:col-span-2">
              <label class="text-xs text-gray-600 dark:text-neutral-300">Nama Santri</label>
              <div class="relative">
                <input v-model.trim="form.name" @focus="formSantriFocus=true" @blur="setTimeout(()=>formSantriFocus=false,150)"
                       placeholder="pilih/ketik nama santri…" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"/>
                <div v-if="formSantriFocus && santriOptionsForm.length" class="absolute z-20 mt-1 w-full rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg max-h-56 overflow-auto">
                  <button v-for="s in santriOptionsForm" :key="s.id" type="button"
                          @mousedown.prevent="pickFormSantri(s)"
                          class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800">
                    <div class="text-sm font-medium truncate">{{ s.santri }}</div>
                    <div class="text-[11px] text-gray-500 truncate">Maskan {{ s.maskan || '-' }} • Kamar {{ s.kamar || '-' }}</div>
                  </button>
                </div>
              </div>
              <div v-if="form.santriId" class="text-[11px] text-gray-500 mt-1">SantriID: {{ form.santriId }}</div>
            </div>
            <div>
              <label class="text-xs">Maskan</label>
              <input v-model.trim="form.maskan" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"/>
            </div>
            <div>
              <label class="text-xs">Kamar</label>
              <input v-model.trim="form.kamar" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"/>
            </div>
            <div>
              <label class="text-xs">Pengunjung</label>
              <input v-model.trim="form.visitor" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"/>
            </div>
            <div>
              <label class="text-xs">Hubungan</label>
              <input v-model.trim="form.relation" placeholder="Orang Tua / Wali / ..." class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"/>
            </div>
          </div>
          <p v-if="formError" class="text-sm text-rose-600">{{ formError }}</p>
        </form>
        <template #footer>
          <button @click="showForm=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
          <button :disabled="saving" @click="submitForm" class="px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60">
            {{ saving ? 'Menyimpan…' : 'Simpan' }}
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
import { useKunjungan } from '~/composables/data/useKunjungan'
import { useSantri } from '~/composables/data/useSantri'
import { useMaskan } from '~/composables/data/useMaskan'

definePageMeta({ layout: 'app', layoutProps: { title: 'Kunjungan' } })

const { rows: santriRows, fetchSantri } = useSantri()
const { rows: maskanRows } = useMaskan()
const {
  monthKey, monthTitle, logs, counts, liveSorted,
  subscribeMonth, subscribeLive, setMonth,
  createVisit, deleteVisit, visitsThisMonth
} = useKunjungan()

const activeTipe = ref<'ALL'|'Putra'|'Putri'>('ALL')

// ===== table columns
const columns = [
  { key: 'ts', label: 'Waktu', sortable: true },
  { key: 'santri', label: 'Santri' },
  { key: 'visitor', label: 'Pengunjung' },
  { key: 'by', label: 'Sumber', sortable: true },
]

// ===== filter tipe berdasarkan maskan.tipe
function tipeForMaskan(name?: string) {
  const m = maskanRows.value.find(x => (x.name||'').toLowerCase().trim() === (name||'').toLowerCase().trim())
  return m?.tipe || 'Unknown'
}
const filteredLogs = computed(() => {
  if (activeTipe.value === 'ALL') return logs.value
  return logs.value.filter(r => tipeForMaskan(r.maskan) === activeTipe.value)
})

// ===== month control
const monthInput = ref(monthKey.value) // YYYY-MM
async function changeMonth() {
  await setMonth(monthInput.value)
}

// ===== common helpers
function formatDate(ts?: number) { if (!ts) return '—'; return new Date(ts).toLocaleString('id-ID') }
function timeAgo(ts?: number) {
  if (!ts) return '—'
  const diff = Date.now() - ts
  const m = Math.floor(diff/60000)
  if (m < 1) return 'baru saja'
  if (m < 60) return `${m}m`
  const h = Math.floor(m/60), rm = m%60
  return `${h}j ${rm}m`
}

// ===== init
let offMonth: null | (()=>void) = null
let offLive: null | (()=>void) = null
onMounted(async () => {
  await fetchSantri()
  offMonth = await subscribeMonth()
  offLive = subscribeLive(60)
  initVoices()
})
onBeforeUnmount(() => { offMonth && offMonth(); offLive && offLive() })

// ===== CRUD
async function del(id: string) {
  if (!confirm('Hapus log kunjungan ini?')) return
  await deleteVisit(id)
}

const showForm = ref(false)
const saving = ref(false)
const formError = ref<string|null>(null)
const form = ref({ santriId:'', name:'', maskan:'', kamar:'', visitor:'', relation:'' })

function openCreate() {
  formError.value = null
  form.value = { santriId:'', name:'', maskan:'', kamar:'', visitor:'', relation:'' }
  showForm.value = true
}

// autocomplete form santri
const formSantriFocus = ref(false)
const santriOptionsForm = computed(() => {
  const q = String(form.value.name||'').toLowerCase().trim()
  if (!q) return []
  return santriRows.value
    .filter(s => String(s.santri||'').toLowerCase().includes(q) || String(s.maskan||'').toLowerCase().includes(q) || String(s.kamar||'').toLowerCase().includes(q))
    .slice(0, 20)
})
function pickFormSantri(s:any) {
  form.value.santriId = s.id
  form.value.name     = s.santri
  form.value.maskan   = s.maskan || ''
  form.value.kamar    = s.kamar || ''
  formSantriFocus.value = false
}
async function submitForm() {
  if (!form.value.name?.trim()) { formError.value = 'Nama santri wajib'; return }
  saving.value = true
  try {
    await createVisit({
      santriId: form.value.santriId || '',
      name: form.value.name,
      maskan: form.value.maskan,
      kamar: form.value.kamar,
      visitor: form.value.visitor,
      relation: form.value.relation,
      by: 'manual'
    })
    showForm.value = false
  } catch (e:any) {
    formError.value = e?.message ?? 'Gagal menyimpan'
  } finally { saving.value = false }
}

// ===== Quick Entry (kanan)
const quickSantri = ref('')
const quickSantriFocus = ref(false)
const quickMaskan = ref('')
const quickKamar = ref('')
const quickVisitor = ref('')
const quickRelation = ref('')
const santriOptions = computed(() => {
  const q = quickSantri.value.toLowerCase().trim()
  if (!q) return []
  return santriRows.value
    .filter(s => String(s.santri||'').toLowerCase().includes(q) || String(s.maskan||'').toLowerCase().includes(q) || String(s.kamar||'').toLowerCase().includes(q))
    .slice(0, 20)
})
function pickQuickSantri(s:any) {
  quickSantri.value = s.santri
  quickMaskan.value = s.maskan || ''
  quickKamar.value  = s.kamar || ''
  quickSantriFocus.value = false
}
async function submitQuick() {
  const name = quickSantri.value.trim()
  if (!name) return
  await createVisit({
    // santriId coba mapping otomatis akan dilakukan di composable
    name,
    maskan: quickMaskan.value.trim(),
    kamar: quickKamar.value.trim(),
    visitor: quickVisitor.value.trim(),
    relation: quickRelation.value.trim(),
    by: 'manual'
  })
  quickVisitor.value = quickRelation.value = ''
}

// ====== TTS (Text-to-Speech) ======
const tts = ref({ enabled: false, voiceURI: '', rate: 1, pitch: 1, volume: 1 })
const voices = ref<SpeechSynthesisVoice[]>([])
let ttsQueue: string[] = []
let speaking = false

function initVoices() {
  const load = () => {
    voices.value = window.speechSynthesis.getVoices()
    if (!tts.value.voiceURI && voices.value.length) {
      // pilih voice Indo kalau ada, else default
      const idVoice = voices.value.find(v => /id|Indonesian/i.test(v.lang || v.name))
      tts.value.voiceURI = (idVoice?.voiceURI) || voices.value[0]!.voiceURI
    }
  }
  load()
  window.speechSynthesis.onvoiceschanged = load
}

// antrian bicara
function speak(text: string) {
  if (!tts.value.enabled || !text) return
  ttsQueue.push(text)
  if (!speaking) playNext()
}
function playNext() {
  if (!ttsQueue.length) { speaking = false; return }
  speaking = true
  const utt = new SpeechSynthesisUtterance(ttsQueue.shift()!)
  const v = voices.value.find(x => x.voiceURI === tts.value.voiceURI)
  if (v) utt.voice = v
  utt.rate = tts.value.rate
  utt.pitch = tts.value.pitch
  utt.volume = tts.value.volume
  utt.onend = () => { speaking = false; playNext() }
  window.speechSynthesis.speak(utt)
}
function testSpeak() {
  speak('Pengujian suara. Sistem pengumuman kunjungan aktif.')
}

// saat ada live event baru, umumkan
watch(liveSorted, (arr, old) => {
  if (!arr.length) return
  const newest = arr[0]!
  // jika event sama seperti sebelumnya, abaikan (kasus reload)
  if (old && old.length && newest.id === old[0]?.id) return
  const nama = newest.name || 'Santri'
  const pengunjung = newest.visitor ? `oleh ${newest.visitor}` : ''
  const tujuan = newest.maskan ? `di maskan ${newest.maskan}` : ''
  const kalimat = `Pengumuman. Kunjungan untuk santri ${nama} ${pengunjung}. Silakan menuju ruang kunjungan ${tujuan}.`
  speak(kalimat.replace(/\s+/g,' ').trim())
})

// ===== misc
async function reloadAll() {
  await Promise.all([fetchSantri(), setMonth(monthKey.value)])
}
</script>
