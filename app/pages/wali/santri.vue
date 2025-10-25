<template>
  <div class="space-y-6 p-6">
    <!-- ====== KETIKA BELUM LOGIN / SESSION KOSONG ====== -->
    <div
      v-if="!session"
      class="p-6 rounded-2xl border border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-900/40"
    >
      Anda belum masuk sebagai wali. <NuxtLink to="/waliLogin" class="underline">Masuk sekarang</NuxtLink>.
    </div>

    <template v-else>
      <!-- ====== HEADER: Wali info + Filter ====== -->
      <section class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div class="space-y-1">
            <div class="text-sm text-gray-500 dark:text-neutral-400">Wali (Akun Anda)</div>
            <div class="font-medium text-gray-900 dark:text-white">
              {{ waliNameDisplay }}
            </div>
            <div class="text-sm text-gray-500 dark:text-neutral-400">
              Kontak: {{ waliPhoneDisplay }}
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <div class="relative">
              <Icon icon="lucide:search" class="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input
                v-model="q"
                type="search"
                placeholder="Cari nama/nis/rfid/kamar/maskan…"
                class="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700 w-64"
              />
            </div>

            <select v-model="fJenjang" class="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
              <option value="">Semua Jenjang</option>
              <option v-for="j in jenjangList" :key="j" :value="j">{{ j }}</option>
            </select>

            <select v-model="fMaskan" class="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
              <option value="">Semua Maskan</option>
              <option v-for="m in maskanList" :key="m" :value="m">{{ m }}</option>
            </select>

            <div class="inline-flex rounded-lg border border-gray-200 dark:border-neutral-700 overflow-hidden">
              <button type="button" @click="fGen=''" :class="segClass(fGen==='')">Semua</button>
              <button type="button" @click="fGen='L'" :class="segClass(fGen==='L')">L</button>
              <button type="button" @click="fGen='P'" :class="segClass(fGen==='P')">P</button>
            </div>

            <button
              type="button"
              @click="resetFilter"
              class="px-3 py-2 rounded-lg text-sm border border-gray-200 bg-gray-50 hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-neutral-700"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      <!-- ====== RINGKASAN ====== -->
      <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500 dark:text-neutral-400">Total Santri</p>
            <Icon icon="lucide:users" class="size-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{{ filtered.length }}</p>
          <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">Milik akun wali ini</p>
        </div>
        <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500 dark:text-neutral-400">Laki-laki</p>
            <Icon icon="lucide:shirt" class="size-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{{ countL }}</p>
          <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">Dalam hasil saat ini</p>
        </div>
        <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500 dark:text-neutral-400">Perempuan</p>
            <Icon icon="lucide:sparkles" class="size-5 text-pink-600 dark:text-pink-400" />
          </div>
          <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{{ countP }}</p>
          <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">Dalam hasil saat ini</p>
        </div>
        <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500 dark:text-neutral-400">Jenjang Terbanyak</p>
            <Icon icon="lucide:graduation-cap" class="size-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{{ topJenjang.label }}</p>
          <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">{{ topJenjang.count }} santri</p>
        </div>
      </section>

      <!-- ====== GRID KARTU SANTRI ====== -->
      <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="s in filtered"
          :key="s.id"
          class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 hover:shadow-sm transition"
        >
          <div class="flex items-start gap-4">
            <img :src="s.avatar || '/assets/pp.jpg'" class="size-14 rounded-xl object-cover ring-1 ring-gray-200 dark:ring-neutral-800" alt="Foto" />
            <div class="min-w-0">
              <h3 class="font-semibold text-gray-900 dark:text-white truncate">{{ s.santri || s.name }}</h3>
              <p class="text-xs text-gray-500 dark:text-neutral-400">NIS: {{ s.noInduk || s.nis || '-' }}</p>
              <div class="mt-2 flex flex-wrap gap-1.5">
                <span class="px-2 py-1 text-[11px] rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{{ s.kelasFormal || s.jenjang || '-' }}</span>
                <span class="px-2 py-1 text-[11px] rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">{{ s.maskan || '-' }}</span>
                <span class="px-2 py-1 text-[11px] rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Kamar {{ s.kamar || '-' }}</span>
                <span class="px-2 py-1 text-[11px] rounded-full bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">RFID {{ s.rfid || '-' }}</span>
              </div>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-neutral-300">
            <div class="p-2 rounded-lg bg-gray-50 dark:bg-neutral-800/60">
              <span class="text-[11px] text-gray-500 dark:text-neutral-400">Jenis kelamin</span>
              <p class="font-medium">{{ (s.gender||s.gen)==='L' ? 'Laki-laki' : 'Perempuan' }}</p>
            </div>
            <div class="p-2 rounded-lg bg-gray-50 dark:bg-neutral-800/60">
              <span class="text-[11px] text-gray-500 dark:text-neutral-400">Wali</span>
              <p class="font-medium truncate">{{ displaySantriWali(s) }}</p>
            </div>
          </div>
        </article>

        <div v-if="!filtered.length" class="col-span-full text-center text-gray-500 dark:text-neutral-400 py-8">
          Tidak ada santri yang cocok untuk akun wali ini.
        </div>
      </section>

      <!-- ====== NILAI SECTION (Mapel & Term) ====== -->
      <section class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 space-y-3">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div class="font-semibold">Nilai Santri (milik wali)</div>
          <div class="flex flex-wrap items-center gap-2">
            <select v-model="selectedMapelId" class="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700">
              <option disabled value="">Pilih Mapel…</option>
              <option v-for="m in subjects" :key="m.id" :value="m.id">
                {{ m.name }} <span v-if="m.jenjang">({{ m.jenjang }})</span>
              </option>
            </select>

            <select v-model="termKey" class="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700">
              <option disabled value="">Pilih Term…</option>
              <option v-for="t in termKeys" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
        </div>

        <!-- Statistik -->
        <div class="grid grid-cols-2 md:grid-cols-6 gap-3 text-sm" v-if="selectedMapelId && termKey">
          <div class="rounded-lg border border-gray-200 dark:border-neutral-700 p-3">
            <div class="text-gray-500">Rata-rata</div><div class="text-lg font-semibold">{{ nStats.avg }}</div>
          </div>
          <div class="rounded-lg border border-gray-200 dark:border-neutral-700 p-3">
            <div class="text-gray-500">Total Santri</div><div class="text-lg font-semibold">{{ nStats.count }}</div>
          </div>
          <div v-for="g in ['A','B','C','D','E']" :key="g" class="rounded-lg border border-gray-200 dark:border-neutral-700 p-3">
            <div class="text-gray-500">Pred {{ g }}</div>
            <div class="text-lg font-semibold">{{ nStats.dist[g as 'A'|'B'|'C'|'D'|'E'] }}</div>
          </div>
        </div>

        <!-- Tabel Nilai (read-only) -->
        <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-neutral-700" v-if="selectedMapelId && termKey">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50 dark:bg-neutral-900/40">
              <tr>
                <th class="px-3 py-2 text-left w-56">Santri</th>
                <th class="px-3 py-2 text-left w-40">Maskan/Kamar</th>
                <th class="px-3 py-2 text-center w-20">Tugas</th>
                <th class="px-3 py-2 text-center w-20">Harian</th>
                <th class="px-3 py-2 text-center w-20">PTS</th>
                <th class="px-3 py-2 text-center w-20">PAS</th>
                <th class="px-3 py-2 text-center w-20">Akhir</th>
                <th class="px-3 py-2 text-center w-16">Pred</th>
                <th class="px-3 py-2 text-left">Catatan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-neutral-700">
              <tr v-for="s in filtered" :key="'n-'+s.id">
                <td class="px-3 py-2">
                  <div class="font-medium truncate">{{ s.santri || s.name }}</div>
                  <div class="text-[11px] text-gray-500 truncate">{{ s.kelasFormal || s.jenjang || '-' }}</div>
                </td>
                <td class="px-3 py-2 text-[12px]">{{ s.maskan || '-' }} · {{ s.kamar || '-' }}</td>

                <td class="px-1 py-1 text-center">{{ nilaiMap[s.id]?.tugas ?? '-' }}</td>
                <td class="px-1 py-1 text-center">{{ nilaiMap[s.id]?.harian ?? '-' }}</td>
                <td class="px-1 py-1 text-center">{{ nilaiMap[s.id]?.pts ?? '-' }}</td>
                <td class="px-1 py-1 text-center">{{ nilaiMap[s.id]?.pas ?? '-' }}</td>

                <td class="px-3 py-2 text-center font-semibold">{{ akhirFor(s.id) ?? '-' }}</td>
                <td class="px-3 py-2 text-center">{{ predikatFor(s.id) ?? '-' }}</td>

                <td class="px-3 py-2">{{ nilaiMap[s.id]?.catatan || '—' }}</td>
              </tr>
              <tr v-if="loadingNilai">
                <td colspan="9" class="px-3 py-6 text-center text-gray-500">Memuat nilai…</td>
              </tr>
              <tr v-else-if="!filtered.length">
                <td colspan="9" class="px-3 py-6 text-center text-gray-500">Tidak ada data pada halaman ini.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="text-sm text-gray-500 dark:text-neutral-400">
          Pilih <b>Mapel</b> dan <b>Term</b> untuk melihat nilai.
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useNuxtApp } from '#app'
import { ref as dref, onValue, off, get } from 'firebase/database'
import { usePelajaran, makeTermKey, DEFAULT_WEIGHTS, type GradeRecord } from '~/composables/data/usePelajaran'

definePageMeta({ layout: 'app', layoutProps: { title: 'Santri Wali' } })

/* ========= SESSION dari local/session storage ========= */
const AUTH_KEY = 'alberr:auth'
const session = ref<any|null>(null)
function readSession(){
  const raw = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY)
  try { session.value = raw ? JSON.parse(raw) : null } catch { session.value = null }
}
onMounted(readSession)

/* ========= UTIL & DISPLAY ========= */
function normalizePhone(s: string){
  const t = (s||'').replace(/[\s\-.]/g,'')
  return t.startsWith('+62') ? '0' + t.slice(3) : t
}
const waliNameDisplay = computed(()=> (session.value?.waliName || session.value?.name || '').toString().trim() || 'Wali')
const waliPhoneDisplay = computed(()=>{
  const p = (session.value?.waliPhone || session.value?.phone || '').toString().trim()
  return p || '-'
})
function displaySantriWali(s:any){
  const nm = (s.waliName || s?.wali?.nama || '').toString().trim()
  const hp = (s.waliPhone || s?.wali?.phone || s?.wali?.hp || s?.wali?.nohp || '').toString().trim()
  return [nm, hp].filter(Boolean).join(' • ')
}

/* ========= DB refs ========= */
const { $realtimeDb } = useNuxtApp() as any
const DEFAULT_WEIGHTS = { tugas: 30, harian: 20, pts: 20, pas: 30 }

/* ========= AMBIL DATA SANTRI (milik wali login) ========= */
type Row = {
  id:string; santri?:string; name?:string; noInduk?:string; nis?:string; gender?:'L'|'P'; gen?:'L'|'P';
  maskan?:string; kamar?:string; rfid?:string; kelasFormal?:string; jenjang?:string; avatar?:string;
  waliName?:string; waliPhone?:string; wali?:{ nama?:string; phone?:string; hp?:string; nohp?:string }
}
const rows = reactive<Row[]>([])
let santriRef: ReturnType<typeof dref> | null = null
function subscribeSantri(){
  santriRef = dref($realtimeDb, '/alberr/santri')
  onValue(santriRef, snap => {
    const val = snap.val() || {}
    const out: Row[] = []
    for (const id of Object.keys(val)) out.push({ id, ...val[id] })
    rows.splice(0, rows.length, ...out)
  }, { onlyOnce:false })
}
onMounted(subscribeSantri)
onUnmounted(()=>{ try { if (santriRef) off(santriRef) } catch{} })

/* ========= FILTER: hanya milik wali bersangkutan ========= */
function getWaliFromSession(){
  const nm = (session.value?.waliName || session.value?.name || '').toString().trim().toLowerCase()
  const hp = normalizePhone((session.value?.waliPhone || session.value?.phone || '').toString().trim())
  return { nm, hp }
}
function pick(obj:any, paths:string[]){
  for (const p of paths){
    const v = p.split('.').reduce((a:any,k)=> (a && a[k]!==undefined) ? a[k] : undefined, obj)
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  return ''
}
const mine = computed<Row[]>(()=>{
  if (!session.value) return []
  const { nm, hp } = getWaliFromSession()
  if (!nm && !hp) return []
  return rows.filter(r => {
    const rnm = (pick(r, ['waliName','wali.nama']) || '').toLowerCase()
    const rhp = normalizePhone(pick(r, ['waliPhone','wali.phone','wali.hp','wali.nohp']))
    const okNm = nm ? rnm === nm : true
    const okHp = hp ? rhp === hp : true
    return okNm && okHp
  })
})

/* ========= UI FILTERS ========= */
const q = ref(''); const fJenjang = ref(''); const fMaskan = ref(''); const fGen = ref<''|'L'|'P'>('')
const jenjangList = computed(()=> Array.from(new Set(mine.value.map(s => s.kelasFormal || s.jenjang || '').filter(Boolean))))
const maskanList  = computed(()=> Array.from(new Set(mine.value.map(s => s.maskan || '').filter(Boolean))))
const filtered = computed(()=> {
  const key = q.value.trim().toLowerCase()
  return mine.value.filter(s => {
    const matchQ = !key || [
      s.santri, s.name, s.noInduk, s.nis, s.rfid, s.kamar, s.maskan, s.kelasFormal, s.jenjang
    ].some(v => String(v||'').toLowerCase().includes(key))
    const jen = (s.kelasFormal || s.jenjang || '')
    const g = (s.gender || s.gen || '') as any
    const okJen = !fJenjang.value || jen === fJenjang.value
    const okMas = !fMaskan.value || (s.maskan||'') === fMaskan.value
    const okGen = !fGen.value || g === fGen.value
    return matchQ && okJen && okMas && okGen
  })
})
const countL = computed(()=> filtered.value.filter(s => (s.gender||s.gen)==='L').length)
const countP = computed(()=> filtered.value.filter(s => (s.gender||s.gen)==='P').length)
const topJenjang = computed(()=>{
  const map = new Map<string, number>()
  for (const s of filtered.value) map.set((s.kelasFormal || s.jenjang || '-') , (map.get(s.kelasFormal || s.jenjang || '-') || 0)+1)
  let label='-', count=0; for (const [k,v] of map.entries()) if (v>count){ label=k; count=v }
  return { label, count }
})
function segClass(active:boolean){
  return [
    'px-3 py-2 text-sm',
    active
      ? 'bg-blue-600 text-white'
      : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800'
  ]
}
function resetFilter(){ q.value=''; fJenjang.value=''; fMaskan.value=''; fGen.value='' }

/* ========= NILAI (read-only) ========= */
const {
  subjects, subscribeSubjects, unbindSubjects,
  readWeights, computeFinal
} = usePelajaran()

onMounted(()=> subscribeSubjects())
onUnmounted(()=> unbindSubjects())

// daftar term dari root nilai
const termKeys = ref<string[]>([])
let termRef: ReturnType<typeof dref> | null = null
let termOff: any = null
function bindTermKeys(){
  termRef = dref($realtimeDb, 'alberr/nilai')
  const h = onValue(termRef, snap=>{
    const keys:string[] = []
    snap.forEach(ch=> keys.push(ch.key!))
    keys.sort()
    termKeys.value = keys
    if (!termKey.value && keys.length) termKey.value = keys[keys.length-1]
  })
  termOff = () => off(termRef!, 'value', h as any)
}
onMounted(bindTermKeys)
onUnmounted(()=> { try { termOff?.() } catch{} })

const termKey = ref<string>('')           // pilih dari dropdown
const selectedMapelId = ref<string>('')   // pilih mapel
const loadingNilai = ref(false)

// map nilai per santri id (terfilter-milik-wali) → record nilai
const nilaiMap = reactive<Record<string, GradeRecord>>({})

watch([termKey, selectedMapelId, filtered], async ()=>{
  nilaiMapReset()
  if (!termKey.value || !selectedMapelId.value || !filtered.value.length) return
  loadingNilai.value = true
  try {
    const node = dref($realtimeDb, `alberr/nilai/${termKey.value}/${selectedMapelId.value}`)
    const snap = await get(node)
    const all = snap.exists() ? (snap.val() || {}) : {}
    for (const s of filtered.value) {
      const rec = all[s.id]
      if (rec) nilaiMap[s.id] = rec
    }
  } finally {
    loadingNilai.value = false
  }
})
function nilaiMapReset(){ for (const k of Object.keys(nilaiMap)) delete nilaiMap[k] }

// bobot untuk hitung akhir/predikat
const weights = reactive({ ...DEFAULT_WEIGHTS })
watch([termKey, selectedMapelId], async ()=>{
  if (!termKey.value || !selectedMapelId.value) return
  Object.assign(weights, await readWeights(termKey.value, selectedMapelId.value))
})

function akhirFor(id:string){
  const n = nilaiMap[id]; if (!n) return null
  const subj = subjects.value.find(s => s.id === selectedMapelId.value)
  const { akhir } = computeFinal(n, weights, subj?.kkm)
  return Math.round(akhir)
}
function predikatFor(id:string){
  const n = nilaiMap[id]; if (!n) return null
  const subj = subjects.value.find(s => s.id === selectedMapelId.value)
  const { predikat } = computeFinal(n, weights, subj?.kkm)
  return predikat
}

// statistik
const nStats = computed(()=>{
  const ids = filtered.value.map(s=>s.id).filter(id => nilaiMap[id])
  let total=0; const dist:Record<'A'|'B'|'C'|'D'|'E',number>={A:0,B:0,C:0,D:0,E:0}
  for (const id of ids){
    const a = akhirFor(id) ?? 0; total += a
    const p = (predikatFor(id) || 'E') as 'A'|'B'|'C'|'D'|'E'
    dist[p]++
  }
  const avg = Math.round(total / Math.max(1, ids.length))
  return { avg, dist, count: ids.length }
})
</script>

<style scoped>
svg path{ shape-rendering:geometricPrecision }
</style>
