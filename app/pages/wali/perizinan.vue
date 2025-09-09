<!-- File: pages/wali/perizinan.vue -->
<template>
  <div class="space-y-6 p-4 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Perizinan Santri</h1>
        <p class="text-sm text-gray-600 dark:text-neutral-400">
          Lihat riwayat izin (pulang, sakit, urgent) dan ajukan perizinan baru.
        </p>
      </div>
      <div class="flex gap-2">
        <button @click="openModal()" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700">
          <Icon icon="lucide:plus" class="size-4" /> Ajukan Perizinan
        </button>
        <NuxtLink to="#" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
          <Icon icon="lucide:download" class="size-4" /> Unduh Riwayat
        </NuxtLink>
      </div>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
        <p class="text-xs text-gray-500 dark:text-neutral-400">Total Izin</p>
        <p class="mt-1 text-2xl font-semibold">{{ stats.total }}</p>
      </div>
      <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
        <p class="text-xs text-gray-500 dark:text-neutral-400">Menunggu</p>
        <p class="mt-1 text-2xl font-semibold">{{ stats.pending }}</p>
      </div>
      <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
        <p class="text-xs text-gray-500 dark:text-neutral-400">Disetujui</p>
        <p class="mt-1 text-2xl font-semibold 600">{{ stats.approved }}</p>
      </div>
      <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
        <p class="text-xs text-gray-500 dark:text-neutral-400">Ditolak</p>
        <p class="mt-1 text-2xl font-semibold text-rose-600">{{ stats.rejected }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="grid gap-3 md:grid-cols-3">
      <div class="flex items-center gap-2">
        <button
          v-for="t in types"
          :key="t"
          @click="typeFilter = (typeFilter === t ? 'Semua' : t)"
          class="px-3 py-1.5 rounded-full text-sm border"
          :class="typeFilter === t
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800'"
        >
          {{ t }}
        </button>
        <button
          v-if="typeFilter !== 'Semua'"
          @click="typeFilter = 'Semua'"
          class="px-3 py-1.5 rounded-full text-sm border bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800"
        >
          Reset
        </button>
      </div>
      <div class="flex items-center gap-2">
        <select v-model="statusFilter" class="w-full md:w-auto pl-3 pr-8 py-2 rounded-lg text-sm border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
          <option value="Semua">Semua Status</option>
          <option value="Menunggu">Menunggu</option>
          <option value="Disetujui">Disetujui</option>
          <option value="Ditolak">Ditolak</option>
        </select>
      </div>
      <div class="relative">
        <input v-model.trim="q" type="search" placeholder="Cari santri / alasan / tujuan..." class="w-full pl-9 pr-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900" />
        <Icon icon="lucide:search" class="size-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>
    </div>

    <!-- Table (desktop) / Cards (mobile) -->
    <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900">
      <div class="p-4 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
        <h2 class="font-semibold text-gray-900 dark:text-white">Riwayat Perizinan</h2>
        <p class="text-sm text-gray-500 dark:text-neutral-400">{{ filtered.length }} data</p>
      </div>

      <!-- Desktop table -->
      <div class="hidden md:block">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-neutral-800/60">
            <tr class="text-gray-600 dark:text-neutral-300">
              <th class="text-left px-4 py-3 font-medium">Tanggal</th>
              <th class="text-left px-4 py-3 font-medium">Santri</th>
              <th class="text-left px-4 py-3 font-medium">Jenis</th>
              <th class="text-left px-4 py-3 font-medium">Rentang</th>
              <th class="text-left px-4 py-3 font-medium">Tujuan / Alasan</th>
              <th class="text-left px-4 py-3 font-medium">Status</th>
              <th class="text-left px-4 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-neutral-800">
            <tr v-for="x in paged" :key="x.id" class="hover:bg-gray-50/60 dark:hover:bg-neutral-800/40">
              <td class="px-4 py-3">{{ x.createdAt }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <img :src="x.student.avatar" class="size-7 rounded-full" alt="">
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ x.student.name }}</p>
                    <p class="text-xs text-gray-500 dark:text-neutral-400">{{ x.student.jenjang }} • {{ x.student.kamar }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium" :class="typeBadge(x.type)">
                  <Icon :icon="typeIcon(x.type)" class="size-3.5" /> {{ x.type }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="text-xs">{{ x.start }} → {{ x.end }}</span>
              </td>
              <td class="px-4 py-3">
                <div class="line-clamp-2">{{ x.reason || x.destination }}</div>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium" :class="statusBadge(x.status)">
                  <span class="size-1.5 rounded-full" :class="dotClass(x.status)"></span> {{ x.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <NuxtLink to="#" class="600 hover:underline">Detail</NuxtLink>
                  <NuxtLink to="#" class="600 hover:underline" v-if="x.status==='Disetujui'">Surat</NuxtLink>
                </div>
              </td>
            </tr>
            <tr v-if="!paged.length">
              <td colspan="7" class="px-4 py-10 text-center text-sm text-gray-500 dark:text-neutral-400">Tidak ada data sesuai filter.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile cards -->
      <div class="md:hidden divide-y divide-gray-100 dark:divide-neutral-800">
        <div v-for="x in paged" :key="x.id" class="p-4">
          <div class="flex items-start gap-3">
            <img :src="x.student.avatar" class="size-9 rounded-full" alt="">
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between">
                <p class="font-medium text-gray-900 dark:text-white">{{ x.student.name }}</p>
                <span class="text-xs text-gray-500 dark:text-neutral-400">{{ x.createdAt }}</span>
              </div>
              <div class="mt-1 flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium" :class="typeBadge(x.type)">
                  <Icon :icon="typeIcon(x.type)" class="size-3.5" /> {{ x.type }}
                </span>
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium" :class="statusBadge(x.status)">
                  <span class="size-1.5 rounded-full" :class="dotClass(x.status)"></span> {{ x.status }}
                </span>
              </div>
              <p class="mt-2 text-xs text-gray-500 dark:text-neutral-400">{{ x.start }} → {{ x.end }}</p>
              <p class="mt-1 text-sm">{{ x.reason || x.destination }}</p>
              <div class="mt-2 flex items-center gap-3">
                <NuxtLink to="#" class="text-sm 600 hover:underline">Detail</NuxtLink>
                <NuxtLink to="#" v-if="x.status==='Disetujui'" class="text-sm 600 hover:underline">Surat</NuxtLink>
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

    <!-- Modal: Ajukan Perizinan -->
    <transition name="fade">
      <div v-if="show" class="fixed inset-0 z-[80]">
        <div class="absolute inset-0 bg-black/50" @click="closeModal()"></div>
        <div class="absolute inset-x-0 top-10 mx-auto w-[95%] max-w-2xl pt-10">
          <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl overflow-hidden">
            <div class="p-4 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 class="font-semibold text-gray-900 dark:text-white">Form Pengajuan Perizinan</h3>
              <button @click="closeModal()" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800">
                <Icon icon="lucide:x" class="size-4" />
              </button>
            </div>
            <form @submit.prevent="submit">
              <div class="p-4 space-y-4">
                <div class="grid md:grid-cols-2 gap-3">
                  <label class="block">
                    <span class="text-xs text-gray-600 dark:text-neutral-300">Santri</span>
                    <select v-model="form.studentId" required class="mt-1 w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm">
                      <option value="" disabled>Pilih santri</option>
                      <option v-for="s in students" :key="s.id" :value="s.id">{{ s.name }} — {{ s.jenjang }}</option>
                    </select>
                  </label>
                  <label class="block">
                    <span class="text-xs text-gray-600 dark:text-neutral-300">Jenis Izin</span>
                    <select v-model="form.type" required class="mt-1 w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm">
                      <option disabled value="">Pilih jenis</option>
                      <option>Izin Pulang</option>
                      <option>Izin Sakit</option>
                      <option>Izin Urgent</option>
                    </select>
                  </label>
                </div>

                <div v-if="form.type==='Izin Urgent'" class="grid md:grid-cols-2 gap-3">
                  <label class="block">
                    <span class="text-xs text-gray-600 dark:text-neutral-300">Kategori Urgent</span>
                    <select v-model="form.urgentType" class="mt-1 w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm">
                      <option value="">Pilih kategori</option>
                      <option>Kematian</option>
                      <option>Pernikahan</option>
                      <option>Musibah</option>
                      <option>Lainnya</option>
                    </select>
                  </label>
                  <label class="block">
                    <span class="text-xs text-gray-600 dark:text-neutral-300">Hubungan dengan santri</span>
                    <input v-model.trim="form.relation" type="text" placeholder="Misal: Kakek, Saudara, Tetangga" class="mt-1 w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm">
                  </label>
                </div>

                <div class="grid md:grid-cols-2 gap-3">
                  <label class="block">
                    <span class="text-xs text-gray-600 dark:text-neutral-300">Mulai (tanggal & jam)</span>
                    <input v-model="form.start" type="datetime-local" required class="mt-1 w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm">
                  </label>
                  <label class="block">
                    <span class="text-xs text-gray-600 dark:text-neutral-300">Kembali (tanggal & jam)</span>
                    <input v-model="form.end" type="datetime-local" required class="mt-1 w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm">
                  </label>
                </div>

                <div class="grid md:grid-cols-2 gap-3">
                  <label class="block">
                    <span class="text-xs text-gray-600 dark:text-neutral-300">Tujuan / Alamat</span>
                    <input v-model.trim="form.destination" type="text" placeholder="Alamat tujuan / RS / Lokasi acara" class="mt-1 w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm">
                  </label>
                  <label class="block">
                    <span class="text-xs text-gray-600 dark:text-neutral-300">Kontak yang dapat dihubungi</span>
                    <input v-model.trim="form.contact" type="text" placeholder="Nama & No. HP" class="mt-1 w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm">
                  </label>
                </div>

                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Keterangan</span>
                  <textarea v-model.trim="form.reason" rows="3" placeholder="Jelaskan alasan perizinan..." class="mt-1 w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"></textarea>
                </label>

                <div class="grid md:grid-cols-2 gap-3">
                  <label class="block">
                    <span class="text-xs text-gray-600 dark:text-neutral-300">Lampiran (opsional)</span>
                    <input type="file" class="mt-1 block w-full text-sm file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 dark:file:bg-neutral-800 dark:file:text-neutral-200">
                    <p class="text-[11px] text-gray-500 dark:text-neutral-400 mt-1">Contoh: surat undangan, surat dokter, dsb.</p>
                  </label>
                  <label class="block">
                    <span class="text-xs text-gray-600 dark:text-neutral-300">Transportasi</span>
                    <select v-model="form.transport" class="mt-1 w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm">
                      <option value="">Pilih Transportasi</option>
                      <option>Jemput Orang Tua</option>
                      <option>Transport Pesantren</option>
                      <option>Kendaraan Umum</option>
                      <option>Lainnya</option>
                    </select>
                  </label>
                </div>

                <label class="inline-flex items-start gap-2 text-sm">
                  <input v-model="form.consent" type="checkbox" class="mt-0.5 rounded border-gray-300 dark:border-neutral-700">
                  <span>Saya menyatakan data yang diajukan benar dan bertanggung jawab selama masa perizinan.</span>
                </label>

                <p v-if="error" class="text-sm text-rose-600">{{ error }}</p>
                <p v-if="success" class="text-sm 600">{{ success }}</p>
              </div>

              <div class="p-4 border-t border-gray-200 dark:border-neutral-800 flex items-center justify-end gap-2">
                <button type="button" class="px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800" @click="closeModal()">Batal</button>
                <button type="submit" class="px-3 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700" :disabled="submitting">
                  <Icon v-if="submitting" icon="lucide:loader-2" class="size-4 animate-spin" />
                  <span v-else>Kirim Pengajuan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'app', layoutProps: { title: 'Perizinan' } })

type Status = 'Menunggu' | 'Disetujui' | 'Ditolak'
type Type = 'Izin Pulang' | 'Izin Sakit' | 'Izin Urgent'
type Student = { id: string; name: string; jenjang: string; kamar: string; avatar: string }

const students = ref<Student[]>([
  { id: 'S001', name: 'Ahmad Fauzi', jenjang: 'KMI 2', kamar: 'Maskan B • Kamar 12', avatar: '/assets/pp.jpg' },
  { id: 'S002', name: 'Bilal Hidayat', jenjang: 'MTs 3', kamar: 'Maskan A • Kamar 04', avatar: '/assets/pp.jpg' },
])

type Permit = {
  id: string
  createdAt: string
  student: Student
  type: Type
  start: string
  end: string
  destination?: string
  reason?: string
  status: Status
}

const permits = ref<Permit[]>([
  {
    id: 'IZN-240901-01',
    createdAt: '01 Sep 2025 08:10',
    student: students.value[0],
    type: 'Izin Pulang',
    start: '05 Sep 2025 15:30',
    end:   '08 Sep 2025 17:00',
    destination: 'Sidoarjo',
    reason: 'Kondisi keluarga',
    status: 'Disetujui'
  },
  {
    id: 'IZN-240901-02',
    createdAt: '01 Sep 2025 10:20',
    student: students.value[1],
    type: 'Izin Sakit',
    start: '02 Sep 2025 08:00',
    end:   '04 Sep 2025 10:00',
    destination: 'RSUD Pandaan',
    reason: 'Demam tinggi',
    status: 'Menunggu'
  },
  {
    id: 'IZN-240829-03',
    createdAt: '29 Agu 2025 14:05',
    student: students.value[0],
    type: 'Izin Urgent',
    start: '29 Agu 2025 16:00',
    end:   '31 Agu 2025 18:00',
    destination: 'Gresik',
    reason: 'Kematian keluarga',
    status: 'Disetujui'
  },
  {
    id: 'IZN-240826-04',
    createdAt: '26 Agu 2025 09:22',
    student: students.value[1],
    type: 'Izin Pulang',
    start: '28 Agu 2025 13:00',
    end:   '29 Agu 2025 17:30',
    destination: 'Pasuruan',
    reason: 'Keperluan keluarga',
    status: 'Ditolak'
  }
])

/* Filters */
const types = ['Semua', 'Izin Pulang', 'Izin Sakit', 'Izin Urgent'] as const
const typeFilter = ref<typeof types[number]>('Semua')
const statusFilter = ref<'Semua' | Status>('Semua')
const q = ref('')

/* Pagination */
const page = ref(1)
const pageSize = 8
const startIndex = computed(() => (page.value - 1) * pageSize)
const endIndex = computed(() => startIndex.value + pageSize)

/* Derived */
const filtered = computed(() => {
  let arr = permits.value
  if (typeFilter.value !== 'Semua') arr = arr.filter(v => v.type === typeFilter.value)
  if (statusFilter.value !== 'Semua') arr = arr.filter(v => v.status === statusFilter.value)
  if (q.value) {
    const s = q.value.toLowerCase()
    arr = arr.filter(v =>
      v.student.name.toLowerCase().includes(s) ||
      (v.reason || '').toLowerCase().includes(s) ||
      (v.destination || '').toLowerCase().includes(s)
    )
  }
  return [...arr].sort((a,b) => toDate(b.createdAt) - toDate(a.createdAt))
})
const paged = computed(() => filtered.value.slice(startIndex.value, endIndex.value))

const stats = computed(() => ({
  total: permits.value.length,
  pending: permits.value.filter(v => v.status === 'Menunggu').length,
  approved: permits.value.filter(v => v.status === 'Disetujui').length,
  rejected: permits.value.filter(v => v.status === 'Ditolak').length,
}))

function toDate(s: string) {
  // "01 Sep 2025 08:10"
  try {
    const [d, mon, y, hm] = s.split(' ')
    const map: Record<string, number> = { Jan:0, Feb:1, Mar:2, Apr:3, Mei:4, Jun:5, Jul:6, Agt:7, Agu:7, Sep:8, Okt:9, Nov:10, Des:11 }
    const [h, m] = (hm || '00:00').split(':').map(Number)
    return new Date(Number(y), map[mon] ?? 0, Number(d), h, m).getTime()
  } catch { return Date.now() }
}

/* UI helpers */
function typeBadge(t: Type) {
  switch (t) {
    case 'Izin Pulang': return 'bg-blue-50 700 dark:bg-blue-900/20 dark:300'
    case 'Izin Sakit': return 'bg-emerald-50 700 dark:bg-emerald-900/20 dark:300'
    default: return 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300'
  }
}
function typeIcon(t: Type) {
  return t === 'Izin Pulang' ? 'lucide:home' : t === 'Izin Sakit' ? 'lucide:stethoscope' : 'lucide:alert-triangle'
}
function statusBadge(s: Status) {
  if (s === 'Disetujui') return 'bg-emerald-50 700 dark:bg-emerald-900/20 dark:300'
  if (s === 'Ditolak') return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
  return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
}
function dotClass(s: Status) {
  if (s === 'Disetujui') return 'bg-emerald-500'
  if (s === 'Ditolak') return 'bg-rose-500'
  return 'bg-amber-500'
}

/* Modal & form */
const show = ref(false)
const submitting = ref(false)
const error = ref('')
const success = ref('')

const form = ref({
  studentId: '',
  type: '' as '' | Type,
  urgentType: '',
  relation: '',
  start: defaultDT(0),
  end: defaultDT(2 * 60), // +2 jam
  destination: '',
  contact: '',
  reason: '',
  transport: '',
  consent: false
})

function defaultDT(offsetMin: number) {
  const dt = new Date(Date.now() + offsetMin * 60000)
  dt.setSeconds(0); dt.setMilliseconds(0)
  const pad = (n:number)=> String(n).padStart(2,'0')
  const y=dt.getFullYear(), m=pad(dt.getMonth()+1), d=pad(dt.getDate()), h=pad(dt.getHours()), mn=pad(dt.getMinutes())
  return `${y}-${m}-${d}T${h}:${mn}`
}

function openModal() {
  error.value = ''; success.value = ''
  show.value = true
}
function closeModal() { show.value = false }

function validate() {
  if (!form.value.studentId) return 'Silakan pilih santri.'
  if (!form.value.type) return 'Silakan pilih jenis izin.'
  if (!form.value.start || !form.value.end) return 'Isi rentang tanggal & jam.'
  if (new Date(form.value.end) <= new Date(form.value.start)) return 'Waktu kembali harus setelah waktu mulai.'
  if (form.value.type === 'Izin Urgent' && !form.value.urgentType) return 'Pilih kategori urgent.'
  if (!form.value.reason && !form.value.destination) return 'Isi alasan atau tujuan.'
  if (!form.value.consent) return 'Centang pernyataan tanggung jawab.'
  return ''
}

function submit() {
  error.value = ''; success.value = ''
  const v = validate()
  if (v) { error.value = v; return }
  submitting.value = true
  setTimeout(() => {
    const s = students.value.find(x => x.id === form.value.studentId)!
    const id = `IZN-${new Date().toISOString().slice(2,10).replaceAll('-','')}-${Math.random().toString(36).slice(2,6).toUpperCase()}`
    const fmt = (s: string) => {
      const d = new Date(s)
      const pad = (n:number)=> String(n).padStart(2,'0')
      const mon = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][d.getMonth()]
      return `${pad(d.getDate())} ${mon} ${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
    }
    permits.value.unshift({
      id,
      createdAt: fmt(new Date().toISOString()),
      student: s,
      type: form.value.type as Type,
      start: fmt(form.value.start),
      end: fmt(form.value.end),
      destination: form.value.destination,
      reason: form.value.reason || form.value.urgentType,
      status: 'Menunggu'
    })
    success.value = 'Pengajuan berhasil dikirim. Menunggu persetujuan admin.'
    submitting.value = false
    // reset ringan
    form.value.type = ''
    form.value.urgentType = ''
    form.value.relation = ''
    form.value.reason = ''
    form.value.destination = ''
    form.value.contact = ''
    form.value.transport = ''
    form.value.consent = false
    // tetap buka modal biar user lihat pesan sukses; bisa ditutup manual
  }, 600)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s }
.fade-enter-from, .fade-leave-to { opacity: 0 }
</style>
