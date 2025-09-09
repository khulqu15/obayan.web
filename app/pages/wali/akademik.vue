<!-- File: pages/wali/akademik.vue -->
<template>
  <div class="space-y-6 p-4 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Perkembangan Akademik</h1>
        <p class="text-sm text-gray-600 dark:text-neutral-400">
          Statistik akademik, nilai ngaji, dan pelanggaran untuk wali santri.
        </p>
      </div>
      <div class="flex gap-2">
        <NuxtLink to="#" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
          <Icon icon="lucide:download" class="size-4" /> Unduh Rekap
        </NuxtLink>
      </div>
    </div>

    <!-- Filter -->
    <div class="grid gap-3 md:grid-cols-3">
      <div class="relative">
        <Icon icon="lucide:calendar" class="size-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <select v-model="term" class="w-full pl-9 pr-8 py-2 rounded-lg text-sm border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
          <option v-for="t in terms" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
      <div class="relative">
        <Icon icon="lucide:graduation-cap" class="size-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <select v-model="kelas" class="w-full pl-9 pr-8 py-2 rounded-lg text-sm border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
          <option value="Semua">Semua Kelas</option>
          <option v-for="k in kelasOptions" :key="k" :value="k">{{ k }}</option>
        </select>
      </div>
      <div class="relative">
        <input v-model.trim="q" type="search" placeholder="Cari santri / pelajaran..." class="w-full pl-9 pr-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900" />
        <Icon icon="lucide:search" class="size-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>
    </div>

    <!-- Ringkasan -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
        <p class="text-[11px] text-gray-500 dark:text-neutral-400">Rata-rata Akademik</p>
        <p class="mt-1 text-2xl font-semibold">{{ summary.avgAcademy.toFixed(1) }}</p>
        <div class="mt-2 h-2 rounded-full bg-gray-100 dark:bg-neutral-800">
          <div class="h-2 bg-blue-600 rounded-full" :style="{ width: (summary.avgAcademy)+'%' }"></div>
        </div>
      </div>
      <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
        <p class="text-[11px] text-gray-500 dark:text-neutral-400">Rata-rata Ngaji</p>
        <p class="mt-1 text-2xl font-semibold">{{ summary.avgNgaji.toFixed(1) }}</p>
        <div class="mt-2 h-2 rounded-full bg-gray-100 dark:bg-neutral-800">
          <div class="h-2 bg-emerald-600 rounded-full" :style="{ width: (summary.avgNgaji)+'%' }"></div>
        </div>
      </div>
      <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
        <p class="text-[11px] text-gray-500 dark:text-neutral-400">Total Pelanggaran Poin</p>
        <p class="mt-1 text-2xl font-semibold text-rose-600">{{ summary.totalPoints }}</p>
        <p class="text-[11px] text-gray-500 dark:text-neutral-400 mt-1">Semua santri ({{ filtered.length }})</p>
      </div>
      <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
        <p class="text-[11px] text-gray-500 dark:text-neutral-400">Subjek Teratas</p>
        <div class="mt-2 space-y-1.5">
          <div v-for="s in summary.topSubjects" :key="s.name" class="flex items-center justify-between text-sm">
            <span>{{ s.name }}</span>
            <span class="font-medium">{{ s.avg.toFixed(1) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Kartu Santri -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <article
        v-for="st in filtered"
        :key="st.id"
        class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden"
      >
        <div class="p-4 flex items-start gap-3">
          <img :src="st.avatar" class="size-12 rounded-xl object-cover" alt="">
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="font-semibold text-gray-900 dark:text-white truncate">{{ st.name }}</h3>
              <span class="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-neutral-800">{{ st.jenjang }} • {{ st.kelas }}</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-neutral-400">{{ st.maskan }} • {{ st.kamar }}</p>
          </div>
          <div class="ms-auto">
            <button @click="openDetail(st)" class="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
              <Icon icon="lucide:maximize-2" class="size-4" /> Detail
            </button>
          </div>
        </div>

        <!-- Quick stats -->
        <div class="p-4 grid grid-cols-3 gap-3">
          <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-3 text-center">
            <p class="text-[11px] text-gray-500 dark:text-neutral-400">Akademik</p>
            <p class="text-xl font-semibold">{{ avgAkademik(st).toFixed(1) }}</p>
          </div>
          <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-3 text-center">
            <p class="text-[11px] text-gray-500 dark:text-neutral-400">Ngaji</p>
            <p class="text-xl font-semibold 600">{{ st.ngaji.avg }}</p>
          </div>
          <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-3 text-center">
            <p class="text-[11px] text-gray-500 dark:text-neutral-400">Poin Pel.</p>
            <p class="text-xl font-semibold" :class="totalPoints(st)>0 ? 'text-rose-600':'600'">{{ totalPoints(st) }}</p>
          </div>
        </div>

        <!-- Nilai beberapa mapel -->
        <div class="px-4 pb-4">
          <p class="text-xs text-gray-500 dark:text-neutral-400 mb-2">Nilai per Pelajaran</p>
          <div class="space-y-2">
            <div v-for="sub in st.subjects.slice(0,4)" :key="sub.name">
              <div class="flex items-center justify-between text-sm">
                <span class="truncate">{{ sub.name }}</span>
                <span class="font-medium">{{ subjectAvg(sub).toFixed(1) }}</span>
              </div>
              <div class="h-2 rounded-full bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                <div class="h-full bg-blue-600 rounded-full" :style="{ width: subjectAvg(sub)+'%' }"></div>
              </div>
            </div>
          </div>
          <div class="mt-3 flex items-center justify-between">
            <NuxtLink to="#" class="text-sm 600 hover:underline">Lihat Rapor</NuxtLink>
            <button @click="openDetail(st)" class="text-sm inline-flex items-center gap-1 text-gray-700 hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white">
              Detail lengkap <Icon icon="lucide:arrow-right" class="size-4" />
            </button>
          </div>
        </div>
      </article>
    </div>

    <!-- Modal Fullscreen -->
    <transition name="fade">
      <div v-if="detail" class="fixed inset-0">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="detail=null"></div>
        <div class="absolute inset-0 md:w-1/2 w-full mx-auto max-h-[80vh] mt-10 md:inset-6 rounded-none md:rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div class="px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-neutral-800 flex items-center gap-3">
            <img :src="detail.avatar" class="size-9 rounded-lg" alt="">
            <div class="min-w-0">
              <h3 class="font-semibold text-gray-900 dark:text-white truncate">{{ detail.name }}</h3>
              <p class="text-xs text-gray-500 dark:text-neutral-400">{{ detail.jenjang }} • {{ detail.kelas }} • {{ detail.maskan }} • {{ detail.kamar }}</p>
            </div>
            <div class="ms-auto flex items-center gap-2">
              <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-neutral-800">Akademik: <b>{{ avgAkademik(detail).toFixed(1) }}</b></span>
              <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-50 700 dark:bg-emerald-900/20 dark:300">Ngaji: <b>{{ detail.ngaji.avg }}</b></span>
              <span class="text-xs px-2 py-0.5 rounded-full" :class="totalPoints(detail)>0 ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300':'bg-emerald-50 700 dark:bg-emerald-900/20 dark:300'">
                Poin Pel: <b>{{ totalPoints(detail) }}</b>
              </span>
              <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800" @click="detail=null" aria-label="Tutup">
                <Icon icon="lucide:x" class="size-5" />
              </button>
            </div>
          </div>

          <!-- Modal body -->
          <div class="h-full overflow-y-auto p-4 sm:p-6 space-y-6">
            <!-- Tabs (simulasi) -->
            <div class="grid lg:grid-cols-3 gap-4">
              <!-- Nilai Akademik -->
              <section class="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <div class="p-4 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
                  <h4 class="font-semibold text-gray-900 dark:text-white">Nilai per Pelajaran ({{ term }})</h4>
                  <NuxtLink to="#" class="text-sm 600 hover:underline">Unduh Nilai</NuxtLink>
                </div>
                <div class="divide-y divide-gray-100 dark:divide-neutral-800">
                  <div v-for="sub in detail.subjects" :key="sub.name" class="p-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium">{{ sub.name }}</p>
                        <p class="text-xs text-gray-500 dark:text-neutral-400">Tugas: {{ sub.tugas }} • Ulangan: {{ sub.ulangan }} • UTS: {{ sub.uts }} • UAS: {{ sub.uas }}</p>
                      </div>
                      <div class="text-right">
                        <p class="text-sm">Rata-rata</p>
                        <p class="text-xl font-semibold">{{ subjectAvg(sub).toFixed(1) }}</p>
                      </div>
                    </div>
                    <div class="mt-2 h-2 rounded-full bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                      <div class="h-full bg-blue-600 rounded-full" :style="{ width: subjectAvg(sub)+'%' }"></div>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Ngaji & Pelanggaran -->
              <section class="space-y-4">
                <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
                  <h4 class="font-semibold text-gray-900 dark:text-white">Nilai Ngaji</h4>
                  <div class="mt-3 space-y-2 text-sm">
                    <div class="flex items-center justify-between">
                      <span>Tajwid</span><span class="font-semibold">{{ detail.ngaji.tajwid }}</span>
                    </div>
                    <div class="h-2 rounded-full bg-gray-100 dark:bg-neutral-800">
                      <div class="h-full bg-emerald-600 rounded-full" :style="{ width: detail.ngaji.tajwid+'%' }"></div>
                    </div>
                    <div class="flex items-center justify-between">
                      <span>Tilawah</span><span class="font-semibold">{{ detail.ngaji.tilawah }}</span>
                    </div>
                    <div class="h-2 rounded-full bg-gray-100 dark:bg-neutral-800">
                      <div class="h-full bg-emerald-600 rounded-full" :style="{ width: detail.ngaji.tilawah+'%' }"></div>
                    </div>
                    <div class="flex items-center justify-between">
                      <span>Hafalan</span><span class="font-semibold">{{ detail.ngaji.hafalan }} hlm</span>
                    </div>
                    <p class="mt-1 text-[11px] text-gray-500 dark:text-neutral-400">Rata-rata ngaji: <b>{{ detail.ngaji.avg }}</b></p>
                  </div>
                </div>

                <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
                  <h4 class="font-semibold text-gray-900 dark:text-white">Pelanggaran</h4>
                  <p class="text-sm text-gray-500 dark:text-neutral-400">Total poin: <b :class="totalPoints(detail)>0 ? 'text-rose-600':'600'">{{ totalPoints(detail) }}</b></p>
                  <ul class="mt-3 divide-y divide-gray-100 dark:divide-neutral-800">
                    <li v-for="(v,i) in detail.violations" :key="i" class="py-3">
                      <div class="flex items-start justify-between">
                        <div>
                          <p class="text-sm font-medium">{{ v.type }}</p>
                          <p class="text-xs text-gray-500 dark:text-neutral-400">{{ fmtDate(v.date) }} • {{ v.desc }}</p>
                        </div>
                        <span class="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">+{{ v.points }}</span>
                      </div>
                    </li>
                    <li v-if="!detail.violations.length" class="py-4 text-sm text-gray-500 dark:text-neutral-400">Tidak ada catatan.</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'app', layoutProps: { title: 'Akademik' } })

type Subject = { name: string; tugas: number; ulangan: number; uts: number; uas: number }
type Violation = { date: string; type: string; desc: string; points: number }
type Ngaji = { tajwid: number; tilawah: number; hafalan: number; avg: number }
type Student = {
  id: string
  name: string
  jenjang: string
  kelas: string
  maskan: string
  kamar: string
  avatar: string
  subjects: Subject[]
  violations: Violation[]
  ngaji: Ngaji
}

const terms = ['Semester Ganjil 2024/2025', 'Semester Genap 2023/2024']
const term = ref(terms[0])
const kelas = ref<'Semua' | string>('Semua')
const q = ref('')

/** DUMMY DATA */
const students = ref<Student[]>([
  {
    id: 'S001',
    name: 'Ahmad Fauzi',
    jenjang: 'KMI 2',
    kelas: 'B',
    maskan: 'Maskan B',
    kamar: 'Kamar 12',
    avatar: '/assets/pp.jpg',
    subjects: [
      { name: 'Matematika', tugas: 88, ulangan: 86, uts: 84, uas: 90 },
      { name: 'Bahasa Arab', tugas: 92, ulangan: 90, uts: 88, uas: 90 },
      { name: 'Bahasa Inggris', tugas: 84, ulangan: 82, uts: 80, uas: 85 },
      { name: 'Fiqih', tugas: 90, ulangan: 88, uts: 86, uas: 92 },
      { name: 'Sejarah', tugas: 86, ulangan: 84, uts: 83, uas: 87 },
    ],
    violations: [
      { date: '2025-09-02', type: 'Terlambat', desc: 'Terlambat apel', points: 2 },
      { date: '2025-09-18', type: 'Atribut tidak lengkap', desc: 'Lupa dasi', points: 1 },
    ],
    ngaji: { tajwid: 88, tilawah: 92, hafalan: 35, avg: 90 },
  },
  {
    id: 'S002',
    name: 'Bilal Hidayat',
    jenjang: 'MTs 3',
    kelas: 'A',
    maskan: 'Maskan A',
    kamar: 'Kamar 04',
    avatar: '/assets/pp.jpg',
    subjects: [
      { name: 'Matematika', tugas: 76, ulangan: 78, uts: 80, uas: 82 },
      { name: 'Bahasa Arab', tugas: 85, ulangan: 84, uts: 83, uas: 86 },
      { name: 'Bahasa Inggris', tugas: 88, ulangan: 86, uts: 84, uas: 87 },
      { name: 'Hadits', tugas: 82, ulangan: 82, uts: 80, uas: 84 },
      { name: 'Aqidah', tugas: 86, ulangan: 84, uts: 85, uas: 87 },
    ],
    violations: [],
    ngaji: { tajwid: 90, tilawah: 88, hafalan: 28, avg: 89 },
  },
  {
    id: 'S003',
    name: 'Cahyani Putri',
    jenjang: 'MA 1',
    kelas: 'C',
    maskan: 'Maskan C',
    kamar: 'Kamar 07',
    avatar: '/assets/pp.jpg',
    subjects: [
      { name: 'Matematika', tugas: 94, ulangan: 92, uts: 90, uas: 95 },
      { name: 'Kimia', tugas: 88, ulangan: 90, uts: 91, uas: 92 },
      { name: 'Fisika', tugas: 86, ulangan: 88, uts: 87, uas: 90 },
      { name: 'Bahasa Arab', tugas: 90, ulangan: 92, uts: 90, uas: 92 },
      { name: 'Fiqih', tugas: 92, ulangan: 90, uts: 91, uas: 93 },
    ],
    violations: [{ date: '2025-08-10', type: 'HP saat jam belajar', desc: 'HP aktif', points: 5 }],
    ngaji: { tajwid: 85, tilawah: 87, hafalan: 40, avg: 86 },
  },
])

const kelasOptions = computed(() => {
  const set = new Set<string>()
  for (const s of students.value) set.add(s.kelas)
  return Array.from(set).sort()
})

/** Helpers */
function subjectAvg(s: Subject) {
  return (s.tugas * 0.25) + (s.ulangan * 0.25) + (s.uts * 0.25) + (s.uas * 0.25)
}
function avgAkademik(st: Student) {
  if (!st.subjects.length) return 0
  return st.subjects.reduce((a, b) => a + subjectAvg(b), 0) / st.subjects.length
}
function totalPoints(st: Student) {
  return st.violations.reduce((a, b) => a + (b.points || 0), 0)
}
function fmtDate(s: string) {
  const d = new Date(s)
  const m = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][d.getMonth()]
  return `${String(d.getDate()).padStart(2,'0')} ${m} ${d.getFullYear()}`
}

/** Filtering */
const filtered = computed(() => {
  let arr = students.value.slice()
  if (kelas.value !== 'Semua') arr = arr.filter(s => s.kelas === kelas.value)
  if (q.value) {
    const s = q.value.toLowerCase()
    arr = arr.filter(st =>
      st.name.toLowerCase().includes(s) ||
      st.subjects.some(sub => sub.name.toLowerCase().includes(s))
    )
  }
  // sort by akademik desc
  return arr.sort((a, b) => avgAkademik(b) - avgAkademik(a))
})

/** Summary */
const summary = computed(() => {
  const arr = filtered.value
  const n = arr.length || 1
  const avgAcademy = arr.reduce((a, st) => a + avgAkademik(st), 0) / n
  const avgNgaji = arr.reduce((a, st) => a + (st.ngaji?.avg || 0), 0) / n
  const totalPointsAll = arr.reduce((a, st) => a + totalPoints(st), 0)

  // top subjects by average across students
  const subjectMap = new Map<string, number[]>()
  for (const st of arr) {
    for (const sub of st.subjects) {
      const avg = subjectAvg(sub)
      if (!subjectMap.has(sub.name)) subjectMap.set(sub.name, [])
      subjectMap.get(sub.name)!.push(avg)
    }
  }
  const topSubjects = Array.from(subjectMap.entries())
    .map(([name, scores]) => ({ name, avg: scores.reduce((a,b)=>a+b,0)/scores.length }))
    .sort((a,b) => b.avg - a.avg)
    .slice(0, 3)

  return {
    avgAcademy,
    avgNgaji,
    totalPoints: totalPointsAll,
    topSubjects,
  }
})

/** Modal detail */
const detail = ref<Student | null>(null)
function openDetail(st: Student) { detail.value = st }

/** Accessibility: ESC to close */
if (process.client) {
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') detail.value = null })
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
