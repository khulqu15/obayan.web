<template>
  <div class="space-y-6 p-6">
    <!-- Jika belum login -->
    <div v-if="!session" class="p-6 rounded-2xl border border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-900/40">
      Anda belum masuk sebagai wali. <NuxtLink to="/waliLogin" class="underline">Masuk sekarang</NuxtLink>.
    </div>

    <template v-else>
      <!-- Top: Profil santri + identitas wali -->
      <section class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
        <div class="p-5 flex items-start gap-4">
          <img :src="avatarUrl" alt="Foto Santri" class="size-16 rounded-2xl object-cover ring-2 ring-blue-100 dark:ring-blue-900/40" />
          <div class="min-w-0">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {{ santri?.santri || session?.santriName }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-neutral-400">
              {{ santri?.noInduk ? `NIS: ${santri.noInduk}` : 'NIS: -' }} • {{ santri?.kelasFormal || santri?.jenjang || '-' }}
            </p>
            <div class="mt-2 flex flex-wrap gap-2">
              <span class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30">
                <Icon icon="lucide:venetian-mask" class="size-3.5" /> {{ santri?.gender==='P'?'Perempuan':'Laki-laki' }}
              </span>
              <span class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30">
                <Icon icon="lucide:home" class="size-3.5" /> {{ santri?.maskan || '-' }}
              </span>
              <span class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30">
                <Icon icon="lucide:bed" class="size-3.5" /> Kamar {{ santri?.kamar || '-' }}
              </span>
              <span class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-violet-50 dark:bg-violet-900/30">
                <Icon icon="ri:rfid-fill" class="size-3.5" /> RFID {{ santri?.rfid || '-' }}
              </span>
            </div>
          </div>

          <!-- Term selector -->
          <div class="ms-auto text-right">
            <div class="text-xs text-gray-500 dark:text-neutral-400">Term Akademik</div>
            <div class="mt-1">
              <select v-model="termKey" @change="loadGrades" class="select select-sm rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/70">
                <option v-for="t in termKeys" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Identitas Akun Wali -->
        <div class="px-5 pb-5">
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div class="p-3 rounded-xl bg-gray-50 dark:bg-neutral-800/70">
              <dt class="text-gray-500 dark:text-neutral-400">Wali (Akun Anda)</dt>
              <dd class="font-medium text-gray-800 dark:text-neutral-100 truncate">
                {{ waliNameDisplay }}
              </dd>
            </div>
            <div class="p-3 rounded-xl bg-gray-50 dark:bg-neutral-800/70">
              <dt class="text-gray-500 dark:text-neutral-400">Kontak Akun</dt>
              <dd class="font-medium text-gray-800 dark:text-neutral-100 truncate">
                {{ waliContactDisplay }}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <!-- Nilai per Mapel -->
      <section class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
        <header class="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-neutral-800">
          <h3 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon icon="lucide:book-open" class="size-5" /> Rekap Nilai • {{ termKey || '-' }}
          </h3>
          <div class="text-sm">
            <span class="text-gray-500 dark:text-neutral-400">Rata-rata Akhir: </span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ avgFinal || 0 }}</span>
          </div>
        </header>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50 dark:bg-neutral-800/70">
              <tr>
                <th class="px-4 py-3 text-left font-semibold">Mata Pelajaran</th>
                <th class="px-4 py-3 text-center">Tugas</th>
                <th class="px-4 py-3 text-center">Harian</th>
                <th class="px-4 py-3 text-center">PTS</th>
                <th class="px-4 py-3 text-center">PAS</th>
                <th class="px-4 py-3 text-center">Proyek</th>
                <th class="px-4 py-3 text-center">Lainnya</th>
                <th class="px-4 py-3 text-center">Akhir</th>
                <th class="px-4 py-3 text-center">Predikat</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-neutral-800">
              <tr v-for="row in tableRows" :key="row.mapelId" class="hover:bg-gray-50/70 dark:hover:bg-neutral-800/60">
                <td class="px-4 py-3">
                  <div class="font-medium text-gray-900 dark:text-white">{{ row.mapelName }}</div>
                  <div class="text-xs text-gray-500 dark:text-neutral-400">KKM: {{ row.kkm || 0 }}</div>
                </td>
                <td class="px-4 py-3 text-center">{{ row.tugas ?? '-' }}</td>
                <td class="px-4 py-3 text-center">{{ row.harian ?? '-' }}</td>
                <td class="px-4 py-3 text-center">{{ row.pts ?? '-' }}</td>
                <td class="px-4 py-3 text-center">{{ row.pas ?? '-' }}</td>
                <td class="px-4 py-3 text-center">{{ row.proyek ?? '-' }}</td>
                <td class="px-4 py-3 text-center">{{ row.lainnya ?? '-' }}</td>
                <td class="px-4 py-3 text-center font-semibold">{{ row.akhir ?? '-' }}</td>
                <td class="px-4 py-3 text-center">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs"
                        :class="predBadgeClass(row.predikat)">
                    {{ row.predikat || '-' }}
                  </span>
                </td>
              </tr>

              <tr v-if="!loading && !tableRows.length">
                <td colspan="9" class="px-4 py-8 text-center text-gray-500 dark:text-neutral-400">
                  Belum ada nilai untuk term ini.
                </td>
              </tr>

              <tr v-if="loading">
                <td colspan="9" class="px-4 py-8 text-center text-gray-500 dark:text-neutral-400">
                  Memuat nilai…
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { usePelajaran } from '@/composables/data/usePelajaran'
import { useNuxtApp } from '#app'
import { get, ref as dref, onValue, off } from 'firebase/database'

definePageMeta({ layout: 'app', layoutProps: { title: 'Beranda Wali' } })

/* ===== Session & profile ===== */
const AUTH_KEY = 'alberr:auth'
const session = ref<any | null>(null)

const { $realtimeDb } = useNuxtApp() as any
const santri = ref<any | null>(null)
const avatarUrl = '/assets/pp.jpg'

/* ===== Pelajaran & Nilai helpers ===== */
const {
  subjects, subscribeSubjects, unbindSubjects,
  readWeights, computeFinal
} = usePelajaran()

/* ===== Term & nilai state ===== */
const termKeys = ref<string[]>([])
const termKey = ref<string | ''>('')
const nilaiByMapel = ref<Record<string, any>>({})
const loading = ref(false)

/* ===== Computed tabel ===== */
const tableRows = computed(() => {
  return Object.entries(nilaiByMapel.value).map(([mapelId, rec]: any) => {
    const subj = subjects.value.find(s => s.id === mapelId)
    return {
      mapelId,
      mapelName: subj?.name || mapelId,
      kkm: subj?.kkm ?? 0,
      tugas: rec.tugas ?? null,
      harian: rec.harian ?? null,
      pts:    rec.pts ?? null,
      pas:    rec.pas ?? null,
      proyek: rec.proyek ?? null,
      lainnya: rec.lainnya ?? null,
      akhir: rec.akhir ?? null,
      predikat: rec.predikat ?? null
    }
  })
})
const avgFinal = computed(() => {
  const vals = tableRows.value.map(r => Number(r.akhir)).filter(n => Number.isFinite(n))
  if (!vals.length) return 0
  return Math.round(vals.reduce((a,b)=>a+b,0)/vals.length)
})

/* ===== Badge class predikat ===== */
function predBadgeClass(pred?: string){
  if (pred === 'A') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
  if (pred === 'B') return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
  if (pred === 'C') return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
  if (pred === 'D' || pred === 'E') return 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
  return 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300'
}

/* ===== Wali (akun) display ===== */
const waliNameDisplay = computed(() => {
  // Prioritas: sesi → data santri → 'Wali'
  const sName = (session.value?.waliName || '').toString().trim()
  if (sName) return sName
  const alt = (santri.value?.walisantri || '').toString().trim()
  return alt || 'Wali'
})
const waliContactDisplay = computed(() => {
  // Jika ada email valid pada sesi → gunakan email; else phone
  const email = (session.value as any)?.email
  const isValidEmail = typeof email === 'string' && email.includes('@') && !/^\s*-\s*$/.test(email)
  if (isValidEmail) return email

  const p1 = (session.value?.waliPhone || '').toString().trim()
  if (p1) return p1
  const p2 = (santri.value?.nohp || '').toString().trim()
  return p2 || '-'
})

/* ===== Utils ===== */
function numOrNull(v:any){ return Number.isFinite(Number(v)) ? Number(v) : null }
function hasNum(v:any){ return v!==undefined && v!==null && v!=='' && Number.isFinite(Number(v)) }

/* ===== Load session ===== */
function readSession(){
  const raw = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY)
  try { session.value = raw ? JSON.parse(raw) : null } catch { session.value = null }
}

/* ===== Load santri profile ===== */
async function loadSantriProfile(){
  if (!session.value?.santriId) return
  const snap = await get(dref($realtimeDb, `alberr/santri/${session.value.santriId}`))
  santri.value = snap.exists() ? snap.val() : null
}

/* ===== Bind term keys ===== */
let unsubNilaiRoot: null | (()=>void) = null
function bindTermKeys(){
  if (unsubNilaiRoot) unsubNilaiRoot()
  const node = dref($realtimeDb, 'alberr/nilai')
  const h = onValue(node, snap=>{
    const keys:string[] = []
    snap.forEach(ch=>keys.push(ch.key!))
    keys.sort() // contoh: "2024-2025_Ganjil" ... urut naik
    termKeys.value = keys
    if (!termKey.value && keys.length) {
      termKey.value = keys[keys.length-1] // term terbaru
      loadGrades()
    }
  })
  unsubNilaiRoot = () => off(node, 'value', h as any)
}

/* ===== Muat nilai utk term terpilih (satu santri) ===== */
async function loadGrades(){
  if (!session.value?.santriId || !termKey.value) return
  loading.value = true
  try {
    const termRef = dref($realtimeDb, `alberr/nilai/${termKey.value}`)
    const termSnap = await get(termRef)
    const data = termSnap.exists() ? (termSnap.val() || {}) : {}

    const merged: Record<string, any> = {}
    const entries = Object.entries<any>(data) // [mapelId, { santriId: GradeRecord, ... }]
    for (const [mapelId, val] of entries) {
      const rec = (val && val[session.value.santriId]) || null
      if (!rec) continue

      // Baca weight dan KKM lalu hitung akhir+predikat
      const weights = await readWeights(termKey.value, mapelId)
      const subj = subjects.value.find(s => s.id === mapelId)
      const { akhir, predikat } = computeFinal(rec, weights, subj?.kkm)

      merged[mapelId] = {
        tugas: numOrNull(rec.tugas),
        harian: numOrNull(rec.harian),
        pts:    numOrNull(rec.pts),
        pas:    numOrNull(rec.pas),
        proyek: hasNum(rec.proyek) ? Number(rec.proyek) : null,
        lainnya: hasNum(rec.lainnya) ? Number(rec.lainnya) : null,
        akhir: Math.round(akhir),
        predikat
      }
    }

    nilaiByMapel.value = merged
  } catch (e:any){
    console.error(e)
    nilaiByMapel.value = {}
  } finally {
    loading.value = false
  }
}

/* ===== Lifecycle ===== */
onMounted(async ()=>{
  readSession()
  if (!session.value) return
  subscribeSubjects() // metadata mapel (nama, KKM)
  await loadSantriProfile()
  bindTermKeys()
})
watch(termKey, ()=> loadGrades())
onUnmounted(()=>{
  unbindSubjects()
  if (unsubNilaiRoot) { unsubNilaiRoot(); unsubNilaiRoot=null }
})
</script>

<style scoped>
svg path { shape-rendering: geometricPrecision; }
</style>
