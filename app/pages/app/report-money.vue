<template>
  <div class="p-6 space-y-6 text-gray-800 dark:text-neutral-300">
    <!-- Header + KPI -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold">Laporan Keuangan</h1>
        <p class="text-sm text-gray-500 dark:text-neutral-400">Daftar pembayaran santri (dummy).</p>
      </div>
      <div class="flex gap-2">
        <span class="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-blue-100 -700 dark:bg-blue-900/30 dark:-300">
          Transaksi: {{ filteredRows.length }}
        </span>
        <span class="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-emerald-100 700 dark:bg-emerald-900/30 dark:300">
          Total: {{ fmtMoney(totalAmount) }}
        </span>
        <span class="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          Pending: {{ pendingCount }}
        </span>
      </div>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white shadow-xs dark:bg-neutral-800 dark:border-neutral-700 p-4">
      <div class="grid grid-cols-1 lg:grid-cols-6 gap-3">
        <div class="lg:col-span-2">
          <label class="text-xs text-gray-500 dark:text-neutral-400">Cari (Nama/NIS/Kode)</label>
          <input v-model.trim="filters.q" type="text" class="mt-1 w-full rounded-lg border px-3 py-2 bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 text-sm" placeholder="mis. Ahmad / S-2025-010 / INV-..." />
        </div>

        <div>
          <label class="text-xs text-gray-500 dark:text-neutral-400">Tipe</label>
          <select v-model="filters.type" class="mt-1 w-full rounded-lg border px-3 py-2 bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 text-sm">
            <option value="">Semua</option>
            <option value="SPP">SPP</option>
            <option value="Bulanan">Bulanan/Asrama</option>
            <option value="Makanan">Makanan</option>
            <option value="Transportasi">Transportasi</option>
          </select>
        </div>

        <div>
          <label class="text-xs text-gray-500 dark:text-neutral-400">Metode</label>
          <select v-model="filters.method" class="mt-1 w-full rounded-lg border px-3 py-2 bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 text-sm">
            <option value="">Semua</option>
            <option value="BCA">BCA VA</option>
            <option value="DANA">DANA</option>
            <option value="GoPay">GoPay</option>
            <option value="QRIS">QRIS</option>
          </select>
        </div>

        <div>
          <label class="text-xs text-gray-500 dark:text-neutral-400">Status</label>
          <select v-model="filters.status" class="mt-1 w-full rounded-lg border px-3 py-2 bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 text-sm">
            <option value="">Semua</option>
            <option value="Berhasil">Berhasil</option>
            <option value="Pending">Pending</option>
            <option value="Gagal">Gagal</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-xs text-gray-500 dark:text-neutral-400">Dari</label>
            <input v-model="filters.from" type="date" class="mt-1 w-full rounded-lg border px-3 py-2 bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 text-sm" />
          </div>
          <div>
            <label class="text-xs text-gray-500 dark:text-neutral-400">Sampai</label>
            <input v-model="filters.to" type="date" class="mt-1 w-full rounded-lg border px-3 py-2 bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 text-sm" />
          </div>
        </div>
      </div>

      <div class="mt-3 flex flex-wrap gap-2">
        <button @click="exportExcel()" class="text-sm px-3 py-1.5 rounded border-gray-200 bg-emerald-600 text-white hover:bg-emerald-700">Export Excel</button>
        <button @click="exportCSV()" class="text-sm px-3 py-1.5 rounded border-gray-200 border hover:bg-gray-50 dark:hover:bg-neutral-700/50">Export CSV</button>
        <button @click="resetFilters()" class="text-sm px-3 py-1.5 rounded border-gray-200 border hover:bg-gray-50 dark:hover:bg-neutral-700/50">Reset Filter</button>
        <button @click="regenerateDummy()" class="text-sm px-3 py-1.5 rounded border-gray-200 border hover:bg-gray-50 dark:hover:bg-neutral-700/50">Refresh</button>
      </div>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white shadow-xs dark:bg-neutral-800 dark:border-neutral-700">
      <div class="p-4 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
        <h2 class="font-semibold">List Pembayaran Santri</h2>
        <div class="text-xs text-gray-500 dark:text-neutral-400">Menampilkan {{ pageInfo.start }}–{{ pageInfo.end }} dari {{ filteredRows.length }}</div>
      </div>

      <div class="p-4 overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="text-left text-gray-500 dark:text-neutral-400">
            <tr>
              <th class="py-2 pe-3">Tanggal</th>
              <th class="py-2 pe-3">NIS / Nama</th>
              <th class="py-2 pe-3">Kelas</th>
              <th class="py-2 pe-3">Tipe</th>
              <th class="py-2 pe-3">Metode</th>
              <th class="py-2 pe-3">Nominal</th>
              <th class="py-2 pe-3">Status</th>
              <th class="py-2 pe-3">Kode</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-neutral-700">
            <tr v-for="r in paginatedRows" :key="r.id" class="hover:bg-gray-50/60 dark:hover:bg-neutral-700/40">
              <td class="py-2 pe-3 whitespace-nowrap">{{ new Date(r.paidAt).toLocaleString('id-ID') }}</td>
              <td class="py-2 pe-3">
                <div class="font-medium text-gray-900 dark:text-neutral-100">{{ r.name }}</div>
                <div class="text-xs text-gray-500 dark:text-neutral-400">{{ r.nis }}</div>
              </td>
              <td class="py-2 pe-3">{{ r.kelas }}</td>
              <td class="py-2 pe-3">
                <span :class="badgeType(r.type)">{{ r.type }}</span>
              </td>
              <td class="py-2 pe-3">
                <span :class="badgeMethod(r.method)">{{ r.method }}</span>
              </td>
              <td class="py-2 pe-3 font-medium">{{ fmtMoney(r.amount) }}</td>
              <td class="py-2 pe-3"><span :class="badgeStatus(r.status)">{{ r.status }}</span></td>
              <td class="py-2 pe-3">{{ r.code }}</td>
            </tr>
            <tr v-if="!paginatedRows.length">
              <td class="py-6 text-gray-500 dark:text-neutral-400" colspan="8">Tidak ada data pada filter ini.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="p-4 border-t border-gray-200 dark:border-neutral-700 flex items-center justify-between">
        <div class="text-xs text-gray-500 dark:text-neutral-400">
          Halaman {{ page }} dari {{ totalPages }}
        </div>
        <div class="flex gap-2">
          <button :disabled="page<=1" @click="page--" class="text-sm px-3 py-1.5 rounded border hover:bg-gray-50 disabled:opacity-50 dark:hover:bg-neutral-700/50">Sebelumnya</button>
          <button :disabled="page>=totalPages" @click="page++" class="text-sm px-3 py-1.5 rounded border hover:bg-gray-50 disabled:opacity-50 dark:hover:bg-neutral-700/50">Berikutnya</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'

definePageMeta({ layout: 'app', layoutProps: { title: 'Laporan Keuangan' } })

/** ============== Dummy Data Types ============== */
type Row = {
  id: string
  nis: string
  name: string
  kelas: string
  type: 'SPP' | 'Bulanan' | 'Makanan' | 'Transportasi'
  method: 'BCA' | 'DANA' | 'GoPay' | 'QRIS'
  status: 'Berhasil' | 'Pending' | 'Gagal'
  amount: number
  paidAt: number
  code: string
}

/** ============== State ============== */
const rows = ref<Row[]>([])
const loading = ref(true)

/** Filters */
const filters = reactive<{
  q: string
  type: '' | Row['type']
  method: '' | Row['method']
  status: '' | Row['status']
  from: string | null
  to: string | null
}>({
  q: '',
  type: '',
  method: '',
  status: '',
  from: null,
  to: null,
})

/** Pagination */
const page = ref(1)
const pageSize = ref(10)

/** ============== Utils ============== */
const fmtMoney = (n?: number | null) =>
  (Number(n ?? 0)).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })

const badgeStatus = (s: Row['status']) => {
  if (s === 'Berhasil') return 'inline-flex text-xs px-2 py-0.5 rounded bg-emerald-100 700 dark:bg-emerald-900/30 dark:300'
  if (s === 'Pending')  return 'inline-flex text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
  return 'inline-flex text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
}
const badgeType = (t: Row['type']) => {
  if (t === 'SPP') return 'inline-flex text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
  if (t === 'Bulanan') return 'inline-flex text-xs px-2 py-0.5 rounded bg-emerald-100 700 dark:bg-emerald-900/30 dark:300'
  if (t === 'Makanan') return 'inline-flex text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
  return 'inline-flex text-xs px-2 py-0.5 rounded bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
}
const badgeMethod = (m: Row['method']) => {
  if (m === 'BCA') return 'inline-flex text-xs px-2 py-0.5 rounded bg-blue-100 -700 dark:bg-blue-900/30 dark:-300'
  if (m === 'DANA') return 'inline-flex text-xs px-2 py-0.5 rounded bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
  if (m === 'GoPay') return 'inline-flex text-xs px-2 py-0.5 rounded bg-emerald-100 700 dark:bg-emerald-900/30 dark:300'
  return 'inline-flex text-xs px-2 py-0.5 rounded bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300'
}

/** ============== Dummy Generator ============== */
const firstNames = ['Ahmad','Aisyah','Budi','Siti','Rina','Fajar','Rafi','Nurul','Dewi','Zaki','Raka','Lina','Hana','Yusuf','Nadia']
const classes = ['VII A','VII B','VIII A','VIII B','IX A','X IPA','X IPS','XI IPA','XI IPS','XII IPA','XII IPS']
const pick = <T,>(a: T[]) => a[Math.floor(Math.random()*a.length)]
const rand = (min:number,max:number)=> Math.floor(Math.random()*(max-min+1))+min
const types: Row['type'][] = ['SPP','Bulanan','Makanan','Transportasi']
const methods: Row['method'][] = ['BCA','DANA','GoPay','QRIS']
const statuses: Row['status'][] = ['Berhasil','Pending','Gagal']

function genDummy(count=80) {
  const now = Date.now()
  const out: Row[] = []
  for (let i=0;i<count;i++) {
    const name = pick(firstNames) + ' ' + ['Putra','Putri','Fadil','Nabila','Ramadhan','Khoirun','Zahra'][rand(0,6)]
    const nis = `S-${2025}-${String(rand(1,250)).padStart(3,'0')}`
    const kelas = pick(classes)
    const type = pick(types)
    const method = pick(methods)
    const status = Math.random() < 0.75 ? 'Berhasil' : pick(statuses) // 75% berhasil
    let amount = 0
    if (type==='SPP') amount = rand(200000,300000)
    else if (type==='Bulanan') amount = rand(150000,250000)
    else if (type==='Makanan') amount = rand(250000,400000)
    else amount = rand(100000,200000)
    const paidAt = now - rand(0,45)*86400000 - rand(0,86400000)
    const code = `INV-${type.substring(0,3).toUpperCase()}-${String(rand(1,9999)).padStart(4,'0')}`
    out.push({ id: `R-${i}-${paidAt}`, nis, name, kelas, type, method, status, amount, paidAt, code })
  }
  return out.sort((a,b)=> b.paidAt - a.paidAt)
}

/** ============== Load Dummy (client) ============== */
onMounted(() => {
  rows.value = genDummy(120)
  loading.value = false
})

/** ============== Filtering ============== */
const filteredRows = computed(() => {
  let data = rows.value.slice()

  // text
  if (filters.q) {
    const q = filters.q.toLowerCase()
    data = data.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.nis.toLowerCase().includes(q) ||
      r.code.toLowerCase().includes(q)
    )
  }
  // selects
  if (filters.type)   data = data.filter(r => r.type === filters.type)
  if (filters.method) data = data.filter(r => r.method === filters.method)
  if (filters.status) data = data.filter(r => r.status === filters.status)

  // date range
  if (filters.from) {
    const fromTs = new Date(filters.from + 'T00:00:00').getTime()
    data = data.filter(r => r.paidAt >= fromTs)
  }
  if (filters.to) {
    const toTs = new Date(filters.to + 'T23:59:59').getTime()
    data = data.filter(r => r.paidAt <= toTs)
  }

  return data
})

const totalAmount = computed(() => filteredRows.value.reduce((a,r)=>a+r.amount,0))
const pendingCount = computed(() => filteredRows.value.filter(r=>r.status==='Pending').length)

/** ============== Pagination Derived ============== */
const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value)))
const paginatedRows = computed(() => {
  page.value = Math.min(page.value, totalPages.value)
  const start = (page.value-1)*pageSize.value
  return filteredRows.value.slice(start, start + pageSize.value)
})
const pageInfo = computed(() => {
  const start = (page.value-1)*pageSize.value + 1
  const end = Math.min(filteredRows.value.length, page.value*pageSize.value)
  return { start: filteredRows.value.length ? start : 0, end }
})

/** ============== Actions ============== */
function resetFilters() {
  filters.q = ''
  filters.type = ''
  filters.method = ''
  filters.status = ''
  filters.from = null
  filters.to = null
  page.value = 1
}
function regenerateDummy() {
  rows.value = genDummy(120)
  page.value = 1
}

/** ============== Export ============== */
function toPlain(row: Row) {
  return {
    Tanggal: new Date(row.paidAt).toLocaleString('id-ID'),
    NIS: row.nis,
    Nama: row.name,
    Kelas: row.kelas,
    Tipe: row.type,
    Metode: row.method,
    Nominal: row.amount,
    Status: row.status,
    Kode: row.code,
  }
}
function filename(ext:string) {
  const d = new Date()
  const ts = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}_${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}`
  return `laporan-keuangan_${ts}.${ext}`
}

async function exportExcel() {
  const data = filteredRows.value.map(toPlain)
  try {
    const XLSX = await import('xlsx') // pastikan sudah install: npm i xlsx
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan')
    XLSX.writeFile(wb, filename('xlsx'))
  } catch (e) {
    // fallback CSV
    exportCSV()
  }
}

function exportCSV() {
  const data = filteredRows.value.map(toPlain)
  if (!data.length) return
  const headers = Object.keys(data[0])
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => {
      const v = (row as any)[h]
      const s = typeof v === 'string' ? v : String(v)
      // escape
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g,'""')}"`
      }
      return s
    }).join(','))
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename('csv')
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
</script>
