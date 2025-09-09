<!-- File: pages/wali/kunjungan.vue -->
<template>
  <div class="space-y-6 p-4 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Kunjungan Santri</h1>
        <p class="text-sm text-gray-600 dark:text-neutral-400">
          Riwayat kunjungan dan kuota kunjungan per bulan untuk wali santri.
        </p>
      </div>
      <div class="flex gap-2">
        <NuxtLink to="#" class="hidden items-center gap-2 px-3 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700">
          <Icon icon="lucide:calendar-plus" class="size-4" /> Ajukan Kunjungan
        </NuxtLink>
        <NuxtLink to="#" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
          <Icon icon="lucide:download" class="size-4" /> Unduh Riwayat
        </NuxtLink>
      </div>
    </div>

    <!-- Kuota & Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Donut quota -->
      <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 flex items-center gap-4">
        <div
          class="relative grid place-items-center size-24 rounded-full"
          :style="{ background: donutBg }"
        >
          <div class="absolute inset-3 rounded-full bg-white dark:bg-neutral-900"></div>
          <div class="relative text-center">
            <p class="text-xl font-semibold text-gray-900 dark:text-white">{{ usedCount }}/{{ monthlyLimit }}</p>
            <p class="text-[11px] text-gray-500 dark:text-neutral-400 -mt-1">Terpakai</p>
          </div>
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-900 dark:text-white">Kuota Kunjungan Bulan Ini</p>
          <div class="mt-2 h-2 rounded-full bg-gray-100 dark:bg-neutral-800 overflow-hidden">
            <div class="h-full rounded-full bg-blue-600" :style="{ width: usedPct+'%' }"></div>
          </div>
          <div class="mt-2 flex items-center justify-between text-xs">
            <span class="text-gray-600 dark:text-neutral-400">Sisa kuota</span>
            <span class="font-medium" :class="remainingCount>0 ? '600' : 'text-rose-600'">
              {{ remainingCount }} kunjungan
            </span>
          </div>
          <p class="mt-1 text-[11px] text-gray-500 dark:text-neutral-400">
            Reset {{ resetLabel }}.
          </p>
        </div>
      </div>

      <!-- Quick stats -->
      <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
        <p class="text-sm font-medium text-gray-900 dark:text-white">Ringkasan Bulan Ini</p>
        <div class="grid grid-cols-2 gap-3 mt-3">
          <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-3">
            <p class="text-[11px] text-gray-500 dark:text-neutral-400">Total Kunjungan</p>
            <p class="text-lg font-semibold">{{ thisMonthTotal }}</p>
          </div>
          <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-3">
            <p class="text-[11px] text-gray-500 dark:text-neutral-400">Disetujui</p>
            <p class="text-lg font-semibold 600">{{ thisMonthApproved }}</p>
          </div>
          <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-3">
            <p class="text-[11px] text-gray-500 dark:text-neutral-400">Menunggu</p>
            <p class="text-lg font-semibold text-amber-600">{{ thisMonthPending }}</p>
          </div>
          <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-3">
            <p class="text-[11px] text-gray-500 dark:text-neutral-400">Ditolak</p>
            <p class="text-lg font-semibold text-rose-600">{{ thisMonthRejected }}</p>
          </div>
        </div>
      </div>

      <!-- Info aturan -->
      <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
        <p class="text-sm font-medium text-gray-900 dark:text-white">Aturan Kuota</p>
        <ul class="mt-2 space-y-2 text-sm text-gray-700 dark:text-neutral-300">
          <li class="flex gap-2">
            <Icon icon="lucide:check-circle2" class="size-4 600 mt-0.5" />
            <span>Maksimal {{ monthlyLimit }} kunjungan per bulan/keluarga.</span>
          </li>
          <li class="flex gap-2">
            <Icon icon="lucide:clock" class="size-4 600 mt-0.5" />
            <span>Jam besuk: Sabtu–Minggu, 09.00–16.00 WIB.</span>
          </li>
          <li class="flex gap-2">
            <Icon icon="lucide:info" class="size-4 text-amber-600 mt-0.5" />
            <span>Kuota tidak diakumulasikan ke bulan berikutnya.</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Filter -->
    <div class="grid gap-3 md:grid-cols-3">
      <div class="relative">
        <Icon icon="lucide:calendar" class="size-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <select v-model="monthKey" class="w-full pl-9 pr-8 py-2 rounded-lg text-sm border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
          <option v-for="opt in monthOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>
      <div>
        <select v-model="statusFilter" class="w-full pl-3 pr-8 py-2 rounded-lg text-sm border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
          <option value="Semua">Semua Status</option>
          <option value="Menunggu">Menunggu</option>
          <option value="Disetujui">Disetujui</option>
          <option value="Ditolak">Ditolak</option>
          <option value="Selesai">Selesai</option>
        </select>
      </div>
      <div class="relative">
        <input v-model.trim="q" type="search" placeholder="Cari tamu / santri / keperluan..." class="w-full pl-9 pr-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900" />
        <Icon icon="lucide:search" class="size-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>
    </div>

    <!-- Tabel / Cards -->
    <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900">
      <div class="p-4 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
        <h2 class="font-semibold text-gray-900 dark:text-white">Riwayat Kunjungan</h2>
        <p class="text-sm text-gray-500 dark:text-neutral-400">{{ filtered.length }} data</p>
      </div>

      <!-- Desktop -->
      <div class="hidden md:block">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-neutral-800/60">
            <tr class="text-gray-600 dark:text-neutral-300">
              <th class="text-left px-4 py-3 font-medium">Tanggal</th>
              <th class="text-left px-4 py-3 font-medium">Tamu</th>
              <th class="text-left px-4 py-3 font-medium">Santri</th>
              <th class="text-left px-4 py-3 font-medium">Keperluan</th>
              <th class="text-left px-4 py-3 font-medium">Waktu</th>
              <th class="text-left px-4 py-3 font-medium">Status</th>
              <th class="text-left px-4 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-neutral-800">
            <tr v-for="v in paged" :key="v.id" class="hover:bg-gray-50/60 dark:hover:bg-neutral-800/40">
              <td class="px-4 py-3">{{ fmtDT(v.date) }}</td>
              <td class="px-4 py-3">
                <div class="min-w-0">
                  <p class="font-medium text-gray-900 dark:text-white">{{ v.visitorName }}</p>
                  <p class="text-xs text-gray-500 dark:text-neutral-400">{{ v.relation }}</p>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <img :src="studentById(v.studentId)?.avatar" class="size-7 rounded-full" alt="">
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ studentById(v.studentId)?.name }}</p>
                    <p class="text-xs text-gray-500 dark:text-neutral-400">
                      {{ studentById(v.studentId)?.jenjang }} • {{ studentById(v.studentId)?.kamar }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">{{ v.purpose }}</td>
              <td class="px-4 py-3">
                <span class="text-xs">{{ v.checkIn || '-' }} <span class="text-gray-400">→</span> {{ v.checkOut || '-' }}</span>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium" :class="statusBadge(v.status)">
                  <span class="size-1.5 rounded-full" :class="dotClass(v.status)"></span> {{ v.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <NuxtLink to="#" class="600 hover:underline">Detail</NuxtLink>
                  <NuxtLink v-if="v.status==='Disetujui' || v.status==='Selesai'" to="#" class="600 hover:underline">Tiket</NuxtLink>
                </div>
              </td>
            </tr>
            <tr v-if="!paged.length">
              <td colspan="7" class="px-4 py-10 text-center text-sm text-gray-500 dark:text-neutral-400">Tidak ada data sesuai filter.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile -->
      <div class="md:hidden divide-y divide-gray-100 dark:divide-neutral-800">
        <div v-for="v in paged" :key="v.id" class="p-4">
          <div class="flex items-start gap-3">
            <img :src="studentById(v.studentId)?.avatar" class="size-9 rounded-full" alt="">
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between">
                <p class="font-medium text-gray-900 dark:text-white">{{ studentById(v.studentId)?.name }}</p>
                <span class="text-xs text-gray-500 dark:text-neutral-400">{{ fmtDT(v.date) }}</span>
              </div>
              <p class="text-xs text-gray-500 dark:text-neutral-400">{{ v.visitorName }} • {{ v.relation }}</p>
              <div class="mt-2 flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium" :class="statusBadge(v.status)">
                  <span class="size-1.5 rounded-full" :class="dotClass(v.status)"></span> {{ v.status }}
                </span>
                <span class="text-xs">{{ v.checkIn || '-' }} → {{ v.checkOut || '-' }}</span>
              </div>
              <p class="mt-2 text-sm">{{ v.purpose }}</p>
              <div class="mt-2 flex items-center gap-3">
                <NuxtLink to="#" class="text-sm 600 hover:underline">Detail</NuxtLink>
                <NuxtLink v-if="v.status==='Disetujui' || v.status==='Selesai'" to="#" class="text-sm 600 hover:underline">Tiket</NuxtLink>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!paged.length" class="p-10 text-center text-sm text-gray-500 dark:text-neutral-400">Tidak ada data sesuai filter.</div>
      </div>

      <!-- Pagination -->
      <div class="p-4 border-t border-gray-200 dark:border-neutral-800 flex items-center justify-between">
        <p class="text-xs text-gray-500 dark:text-neutral-400">Menampilkan {{ startIndex + 1 }}–{{ Math.min(endIndex, filtered.length) }} dari {{ filtered.length }}</p>
        <div class="flex items-center gap-2">
          <button class="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-neutral-700 disabled:opacity-50" :disabled="page===1" @click="page--">Sebelumnya</button>
          <button class="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-neutral-700 disabled:opacity-50" :disabled="endIndex>=filtered.length" @click="page++">Berikutnya</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'app', layoutProps: { title: 'Kunjungan' } })

type Status = 'Menunggu' | 'Disetujui' | 'Ditolak' | 'Selesai'
type Student = { id: string; name: string; jenjang: string; kamar: string; avatar: string }

const students = ref<Student[]>([
  { id: 'S001', name: 'Ahmad Fauzi',   jenjang: 'KMI 2', kamar: 'Maskan B • Kamar 12', avatar: '/assets/pp.jpg' },
  { id: 'S002', name: 'Bilal Hidayat', jenjang: 'MTs 3', kamar: 'Maskan A • Kamar 04', avatar: '/assets/pp.jpg' },
])

type Visit = {
  id: string
  date: string         // ISO
  studentId: string
  visitorName: string
  relation: string
  purpose: string
  status: Status
  checkIn?: string     // HH:MM
  checkOut?: string    // HH:MM
  notes?: string
}

const visits = ref<Visit[]>([
  { id: 'V-001', date: '2025-09-14T10:00:00', studentId: 'S001', visitorName: 'H. Suyono', relation: 'Ayah',   purpose: 'Kunjungan rutin', status: 'Selesai',    checkIn: '10:05', checkOut: '11:20' },
  { id: 'V-002', date: '2025-09-07T09:30:00', studentId: 'S002', visitorName: 'Ibu Siti',   relation: 'Ibu',    purpose: 'Antar pakaian',  status: 'Selesai',    checkIn: '09:35', checkOut: '10:00' },
  { id: 'V-003', date: '2025-09-21T13:30:00', studentId: 'S001', visitorName: 'Pak Rahmat', relation: 'Paman',  purpose: 'Silaturahmi',     status: 'Disetujui',  checkIn: '',      checkOut: '' },
  { id: 'V-004', date: '2025-09-28T15:00:00', studentId: 'S002', visitorName: 'Bpk. Hasan', relation: 'Ayah',   purpose: 'Penyerahan dok.', status: 'Menunggu',   checkIn: '',      checkOut: '' },
  { id: 'V-005', date: '2025-08-25T10:00:00', studentId: 'S001', visitorName: 'Bu Rina',    relation: 'Bibi',   purpose: 'Urgent keluarga', status: 'Ditolak',    checkIn: '',      checkOut: '' },
])

/* Kuota bulanan (dummy) */
const monthlyLimit = 4

/* Helpers */
function yyyymm(d: Date) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}` }
function parseISO(s: string) { const d = new Date(s); return isNaN(d.getTime()) ? new Date() : d }
function monthNameID(m: number) {
  return ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][m] || ''
}
function fmtDT(s: string) {
  const d = parseISO(s)
  const pad = (n:number)=> String(n).padStart(2,'0')
  return `${pad(d.getDate())} ${monthNameID(d.getMonth())} ${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
function endOfMonthLabel(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  return `${String(d.getDate()).padStart(2,'0')} ${monthNameID(d.getMonth())} ${d.getFullYear()}`
}
const resetLabel = computed(() => endOfMonthLabel())

/* Filter bulan: 6 bulan terakhir + bulan sekarang */
const monthKey = ref(yyyymm(new Date()))
const monthOptions = computed(() => {
  const opts: { value: string; label: string }[] = []
  const now = new Date()
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    opts.push({ value: yyyymm(d), label: `${monthNameID(d.getMonth())} ${d.getFullYear()}` })
  }
  return opts
})

/* Filter lain */
const statusFilter = ref<'Semua' | Status>('Semua')
const q = ref('')
const page = ref(1)
const pageSize = 8
const startIndex = computed(() => (page.value - 1) * pageSize)
const endIndex = computed(() => startIndex.value + pageSize)

/* Derived data */
const filtered = computed(() => {
  page.value = 1 // reset halaman saat filter berubah
  let arr = visits.value.filter(v => yyyymm(parseISO(v.date)) === monthKey.value)
  if (statusFilter.value !== 'Semua') arr = arr.filter(v => v.status === statusFilter.value)
  if (q.value) {
    const s = q.value.toLowerCase()
    arr = arr.filter(v =>
      v.visitorName.toLowerCase().includes(s) ||
      studentById(v.studentId)?.name.toLowerCase().includes(s) ||
      v.purpose.toLowerCase().includes(s)
    )
  }
  return arr.sort((a,b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
})
const paged = computed(() => filtered.value.slice(startIndex.value, endIndex.value))

/* Kuota kalkulasi */
const usedCount = computed(() => {
  // hitung kunjungan bulan ini yang Disetujui atau Selesai
  return visits.value.filter(v => {
    const sameMonth = yyyymm(parseISO(v.date)) === monthKey.value
    return sameMonth && (v.status === 'Disetujui' || v.status === 'Selesai')
  }).length
})
const remainingCount = computed(() => Math.max(0, monthlyLimit - usedCount.value))
const usedPct = computed(() => Math.min(100, Math.round((usedCount.value / monthlyLimit) * 100)))
const donutBg = computed(() => {
  const p = usedPct.value
  // blue -> used, gray -> remaining
  return `conic-gradient(rgb(37,99,235) ${p}%, rgba(229,231,235,.9) 0)`
})

/* Stats bulan ini */
const thisMonth = computed(() => visits.value.filter(v => yyyymm(parseISO(v.date)) === monthKey.value))
const thisMonthTotal = computed(() => thisMonth.value.length)
const thisMonthApproved = computed(() => thisMonth.value.filter(v => v.status === 'Disetujui' || v.status === 'Selesai').length)
const thisMonthPending = computed(() => thisMonth.value.filter(v => v.status === 'Menunggu').length)
const thisMonthRejected = computed(() => thisMonth.value.filter(v => v.status === 'Ditolak').length)

/* Lookup */
function studentById(id: string) {
  return students.value.find(s => s.id === id)
}

/* UI badges */
function statusBadge(s: Status) {
  if (s === 'Disetujui' || s === 'Selesai') return 'bg-emerald-50 700 dark:bg-emerald-900/20 dark:300'
  if (s === 'Ditolak') return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
  return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
}
function dotClass(s: Status) {
  if (s === 'Disetujui' || s === 'Selesai') return 'bg-white'
  if (s === 'Ditolak') return 'bg-rose-500'
  return 'bg-amber-500'
}
</script>
