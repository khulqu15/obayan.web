<template>
  <div class="space-y-6 p-6">
    <!-- HEADER / SUMMARY -->
    <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500 dark:text-neutral-400">Total Santri</p>
          <Icon icon="lucide:users" class="size-5 -600 dark:-400" />
        </div>
        <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{{ filtered.length }}</p>
        <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">Dari {{ santri.length }} data</p>
      </div>
      <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500 dark:text-neutral-400">Laki-laki</p>
          <Icon icon="lucide:shirt" class="size-5 600 dark:400" />
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

    <!-- FILTERS -->
    <section class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="flex gap-2 items-center w-full md:w-auto">
          <div class="relative flex-1 md:w-80">
            <Icon icon="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              v-model.trim="q"
              type="text"
              class="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-gray-800 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              placeholder="Cari nama / NIS / RFID / kamar / maskan…"
            />
          </div>

          <button
            type="button"
            @click="resetFilter"
            class="px-3 py-2 rounded-lg text-sm border border-gray-200 bg-gray-50 hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-neutral-700"
          >
            Reset
          </button>
        </div>

        <div class="flex flex-wrap gap-2">
          <select v-model="fJenjang" class="px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
            <option value="">Semua Jenjang</option>
            <option v-for="j in jenjangList" :key="j" :value="j">{{ j }}</option>
          </select>

          <select v-model="fMaskan" class="px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
            <option value="">Semua Maskan</option>
            <option v-for="m in maskanList" :key="m" :value="m">{{ m }}</option>
          </select>

          <div class="inline-flex rounded-lg border border-gray-200 dark:border-neutral-700 overflow-hidden">
            <button @click="fGen=''" :class="segClass(fGen==='')">Semua</button>
            <button @click="fGen='L'" :class="segClass(fGen==='L')">L</button>
            <button @click="fGen='P'" :class="segClass(fGen==='P')">P</button>
          </div>

          <button
            type="button"
            @click="exportCSV"
            class="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-gray-200 bg-white hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-700"
          >
            <Icon icon="lucide:download" class="size-4" /> Export CSV
          </button>
        </div>
      </div>
    </section>

    <!-- GRID CARDS -->
    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="s in filtered"
        :key="s.id"
        class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 hover:shadow-sm transition"
      >
        <div class="flex items-start gap-4">
          <img :src="s.avatar" class="size-14 rounded-xl object-cover ring-1 ring-gray-200 dark:ring-neutral-800" alt="Foto" />
          <div class="min-w-0">
            <h3 class="font-semibold text-gray-900 dark:text-white truncate">{{ s.name }}</h3>
            <p class="text-xs text-gray-500 dark:text-neutral-400">NIS: {{ s.nis }}</p>
            <div class="mt-2 flex flex-wrap gap-1.5">
              <span class="px-2 py-1 text-[11px] rounded-full bg-blue-50 -700 dark:bg-blue-900/30 dark:-300">{{ s.jenjang }}</span>
              <span class="px-2 py-1 text-[11px] rounded-full bg-emerald-50 700 dark:bg-emerald-900/30 dark:300">{{ s.maskan }}</span>
              <span class="px-2 py-1 text-[11px] rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Kamar {{ s.kamar }}</span>
              <span class="px-2 py-1 text-[11px] rounded-full bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">RFID {{ s.rfid }}</span>
            </div>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-neutral-300">
          <div class="p-2 rounded-lg bg-gray-50 dark:bg-neutral-800/60">
            <span class="text-[11px] text-gray-500 dark:text-neutral-400">Jenis kelamin</span>
            <p class="font-medium">{{ s.gen === 'L' ? 'Laki-laki' : 'Perempuan' }}</p>
          </div>
          <div class="p-2 rounded-lg bg-gray-50 dark:bg-neutral-800/60">
            <span class="text-[11px] text-gray-500 dark:text-neutral-400">Status SPP</span>
            <p :class="s.sppLunas ? '600 dark:400' : 'text-rose-600 dark:text-rose-400'">
              {{ s.sppLunas ? 'Lunas bulan ini' : 'Belum lunas' }}
            </p>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <NuxtLink
            to="#"
            class="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700"
          >
            <Icon icon="hugeicons:invoice-01" class="size-4" /> Pembayaran
          </NuxtLink>
          <NuxtLink
            to="#"
            class="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            <Icon icon="lucide:eye" class="size-4" /> Detail
          </NuxtLink>
          <NuxtLink
            to="#"
            class="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            <Icon icon="lucide:calendar-days" class="size-4" /> Absen
          </NuxtLink>
        </div>
      </article>
    </section>

    <!-- TABLE -->
    <section class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
        <div class="font-medium">Daftar Lengkap</div>
        <div class="flex items-center gap-2 text-sm">
          <span class="text-gray-500 dark:text-neutral-400">Urut:</span>
          <button @click="sortBy('name')" :class="sortBtn('name')">Nama</button>
          <button @click="sortBy('jenjang')" :class="sortBtn('jenjang')">Jenjang</button>
          <button @click="sortBy('kamar')" :class="sortBtn('kamar')">Kamar</button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-neutral-800/60 text-gray-600 dark:text-neutral-300">
            <tr>
              <th class="text-left px-4 py-3 font-medium">Santri</th>
              <th class="text-left px-4 py-3 font-medium">Jenjang</th>
              <th class="text-left px-4 py-3 font-medium">Maskan / Kamar</th>
              <th class="text-left px-4 py-3 font-medium">RFID</th>
              <th class="text-left px-4 py-3 font-medium">SPP</th>
              <th class="text-right px-4 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-neutral-800">
            <tr v-for="s in filteredSorted" :key="'t-'+s.id" class="hover:bg-gray-50/70 dark:hover:bg-neutral-800/50">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img :src="s.avatar" class="size-9 rounded-lg object-cover ring-1 ring-gray-200 dark:ring-neutral-800" />
                  <div class="min-w-0">
                    <p class="font-medium text-gray-900 dark:text-white truncate">{{ s.name }}</p>
                    <p class="text-xs text-gray-500 dark:text-neutral-400">NIS: {{ s.nis }} • {{ s.gen === 'L' ? 'Laki-laki' : 'Perempuan' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">{{ s.jenjang }}</td>
              <td class="px-4 py-3">
                <div>{{ s.maskan }}</div>
                <div class="text-xs text-gray-500 dark:text-neutral-400">Kamar {{ s.kamar }}</div>
              </td>
              <td class="px-4 py-3">{{ s.rfid }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                  :class="s.sppLunas ? 'bg-emerald-50 700 dark:bg-emerald-900/30 dark:300' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'">
                  <Icon :icon="s.sppLunas ? 'lucide:check' : 'lucide:clock'" class="size-3.5" />
                  {{ s.sppLunas ? 'Lunas bulan ini' : 'Belum' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <NuxtLink to="#" class="-600 hover:-700 dark:-400 dark:hover:-300">Pembayaran</NuxtLink>
              </td>
            </tr>

            <tr v-if="!filtered.length">
              <td colspan="6" class="px-4 py-8 text-center text-gray-500 dark:text-neutral-400">
                Tidak ada data yang cocok dengan filter.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'app', layoutProps: { title: 'Santri' } })

/** ===== Dummy data — ganti dengan fetch dari DB ===== */
type Santri = {
  id: string
  avatar: string
  name: string
  nis: string
  gen: 'L' | 'P'
  maskan: string
  kamar: string
  rfid: string
  jenjang: string
  sppLunas: boolean
}

const santri = reactive<Santri[]>([
  { id: 's1', avatar: '/assets/pp.jpg', name: 'Muhammad Rizky Alfarizi', nis: '2023.045', gen: 'L', maskan: 'Baitus Salam', kamar: 'A3', rfid: 'RF12345678', jenjang: 'KMI • MTs 2', sppLunas: true },
  { id: 's2', avatar: '/assets/pp.jpg', name: 'Aisyah Zahra Putri',       nis: '2022.118', gen: 'P', maskan: 'Baitul Fadilah', kamar: 'B1', rfid: 'RF99887766', jenjang: 'KMI • MA 1',  sppLunas: false },
  { id: 's3', avatar: '/assets/pp.jpg', name: 'Fadhil Naufal',             nis: '2021.077', gen: 'L', maskan: 'Baitus Salam',   kamar: 'A1', rfid: 'RF11223344', jenjang: 'KMI • MTs 3', sppLunas: true },
  { id: 's4', avatar: '/assets/pp.jpg', name: 'Nabila Khairunnisa',        nis: '2024.009', gen: 'P', maskan: 'Baitul Fadilah', kamar: 'B2', rfid: 'RF55667788', jenjang: 'KMI • MTs 1', sppLunas: true },
])

/** ===== Filters & search ===== */
const q = ref('')
const fJenjang = ref('')
const fMaskan = ref('')
const fGen = ref<'' | 'L' | 'P'>('')

const jenjangList = computed(() => [...new Set(santri.map(s => s.jenjang))])
const maskanList  = computed(() => [...new Set(santri.map(s => s.maskan))])

const filtered = computed(() => {
  const key = q.value.toLowerCase()
  return santri.filter(s => {
    const matchQ = !key || [
      s.name, s.nis, s.rfid, s.kamar, s.maskan, s.jenjang
    ].some(v => String(v).toLowerCase().includes(key))

    const matchJenjang = !fJenjang.value || s.jenjang === fJenjang.value
    const matchMaskan  = !fMaskan.value  || s.maskan  === fMaskan.value
    const matchGen     = !fGen.value     || s.gen     === fGen.value

    return matchQ && matchJenjang && matchMaskan && matchGen
  })
})

/** ===== Summary counts ===== */
const countL = computed(() => filtered.value.filter(s => s.gen === 'L').length)
const countP = computed(() => filtered.value.filter(s => s.gen === 'P').length)
const topJenjang = computed(() => {
  const map = new Map<string, number>()
  for (const s of filtered.value) map.set(s.jenjang, (map.get(s.jenjang) || 0) + 1)
  let label = '-', count = 0
  for (const [k, v] of map.entries()) if (v > count) { label = k; count = v }
  return { label, count }
})

/** ===== Sorting for table ===== */
const sortKey = ref<'name' | 'jenjang' | 'kamar'>('name')
const sortAsc = ref(true)
function sortBy(k: 'name' | 'jenjang' | 'kamar') {
  if (sortKey.value === k) sortAsc.value = !sortAsc.value
  else { sortKey.value = k; sortAsc.value = true }
}
const filteredSorted = computed(() => {
  const arr = [...filtered.value]
  arr.sort((a, b) => {
    const A = String(a[sortKey.value]).toLowerCase()
    const B = String(b[sortKey.value]).toLowerCase()
    if (A < B) return sortAsc.value ? -1 : 1
    if (A > B) return sortAsc.value ?  1 : -1
    return 0
  })
  return arr
})

/** ===== UI helpers ===== */
function segClass(active: boolean) {
  return [
    'px-3 py-2 text-sm',
    active
      ? 'bg-blue-600 text-white'
      : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800'
  ]
}
function sortBtn(k: 'name'|'jenjang'|'kamar') {
  const active = sortKey.value === k
  return [
    'px-2 py-1 rounded-md border text-xs',
    active
      ? 'bg-blue-600 text-white border-blue-600'
      : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-200 border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800'
  ]
}
function resetFilter() {
  q.value = ''
  fJenjang.value = ''
  fMaskan.value = ''
  fGen.value = ''
}

/** ===== Export CSV (hasil filter) ===== */
function exportCSV() {
  const header = ['ID','Nama','NIS','Gen','Maskan','Kamar','RFID','Jenjang','SPP_Lunas']
  const rows = filteredSorted.value.map(s => [
    s.id, s.name, s.nis, s.gen, s.maskan, s.kamar, s.rfid, s.jenjang, s.sppLunas ? 'Ya' : 'Tidak'
  ])
  const csv = [header, ...rows].map(r =>
    r.map(cell => {
      const c = String(cell ?? '')
      return /[",\n]/.test(c) ? `"${c.replace(/"/g,'""')}"` : c
    }).join(',')
  ).join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'santri.csv'
  a.click()
  URL.revokeObjectURL(url)
}
</script>
