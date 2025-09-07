<template>
  <div class="space-y-4 p-6">
    <!-- ===== Top KPIs ===== -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <InfoStatCard
        label="Total Santri"
        :value="fmtNumber(totalSantri)"
        :percent="trendSantri"
        icon="lucide:users"
        sub="Total terdaftar"
      />
      <InfoStatCard
        label="Kehadiran Hari Ini"
        :value="presentTodayPct !== null ? (presentTodayPct.toFixed(0) + '%') : '—'"
        :percent="trendAbsensi"
        icon="lucide:clipboard-check"
        sub="Presentase hadir"
      />
      <InfoStatCard
        label="Izin Pending"
        :value="fmtNumber(izinPending)"
        :percent="0"
        icon="lucide:clock"
        sub="Menunggu persetujuan"
      />
      <InfoStatCard
        label="Pelanggaran Aktif"
        :value="fmtNumber(faultUnresolved)"
        :percent="0"
        icon="lucide:shield-alert"
        sub="Belum diselesaikan"
      />
       <InfoStatCard
        label="Uang Masuk (Bulan Ini)"
        :value="fmtMoney(uangMasukBulan)"
        :percent="trendIncomeMonth"
        icon="lucide:wallet"
        sub="Penerimaan bulan berjalan"
      />
      <InfoStatCard
        label="Uang Masuk (Tahun Ini)"
        :value="fmtMoney(uangMasukTahun)"
        :percent="trendIncomeYear"
        icon="lucide:calendar-range"
        sub="Akumulasi tahun berjalan"
      />
      <InfoStatCard
        label="Uang Keluar (Bulan Ini)"
        :value="fmtMoney(uangKeluarBulan)"
        :percent="trendExpenseMonth"
        icon="lucide:arrow-down-circle"
        sub="Pengeluaran bulan berjalan"
      />
      <InfoStatCard
        label="Saldo Kas"
        :value="fmtMoney(saldoKas)"
        :percent="0"
        icon="lucide:piggy-bank"
        sub="Nett per hari ini"
      />
    </div>

    <!-- ===== Charts Row ===== -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <AreaLineChart
        class="lg:col-span-2"
        title="Trend Kehadiran (30 hari)"
        :data="attendanceChart"
        :options="chartOpts"
      >
        <template #actions>
          <button class="text-xs px-2 py-1 rounded border hover:bg-gray-50 dark:hover:bg-neutral-800"
                  @click="reloadAbsensiHistory">
            Reload
          </button>
        </template>
      </AreaLineChart>

      <DonutChart
        title="Komposisi Jenjang"
        :data="jenjangChart"
        :options="{ cutout: '60%' }"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <DonutChart
        title="Absensi Pengurus (Hari Ini)"
        :data="pengurusDonut"
        :options="{ cutout: '60%' }"
      />
      <BarChart
        class="lg:col-span-2"
        title="Jurnal Keuangan — Penerimaan (30 hari)"
        :data="receiptsChart"
        :options="chartOpts"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <BarChart
        class="lg:col-span-2"
        title="Pelanggaran per Kategori (30 hari)"
        :data="faultChart"
        :options="chartOpts"
      />

      <div class="p-4 rounded-xl border border-gray-200 bg-white shadow-xs dark:bg-neutral-800 dark:border-neutral-700">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-800 dark:text-neutral-100">Agenda Terdekat</h3>
          <NuxtLink to="/app/announcement" class="text-xs text-blue-600 hover:underline">Lihat semua</NuxtLink>
        </div>

        <ul v-if="agenda.length" class="space-y-2 text-sm">
          <li v-for="a in agenda.slice(0,6)" :key="a.id" class="flex items-start gap-2">
            <Icon icon="lucide:calendar" width="16" height="16" class="mt-0.5 text-gray-600 dark:text-neutral-300"/>
            <div class="min-w-0">
              <p class="text-gray-800 dark:text-neutral-100 truncate">{{ a.title }}</p>
              <p class="text-[12px] text-gray-500 dark:text-neutral-400">
                {{ a.when }} <span v-if="a.where">· {{ a.where }}</span>
              </p>
            </div>
          </li>
        </ul>
        <p v-else class="text-sm text-gray-500 dark:text-neutral-400">Belum ada agenda terjadwal.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <DataTable
        title="Perizinan Terbaru"
        :rows="izinRows"
        :columns="izinCols"
        :rowKey="r => r.id"
      >
        <template #cell-status="{ row }">
          <span :class="badgeClass(row.status)">{{ row.status }}</span>
        </template>
        <template #cell-actions="{ row }">
          <NuxtLink :to="'/app/izin?focus='+row.id" class="text-xs text-blue-600 hover:underline">Lihat</NuxtLink>
        </template>
      </DataTable>

      <DataTable
        title="Pelanggaran Terbaru"
        :rows="faultRows"
        :columns="faultCols"
        :rowKey="r => r.id"
      >
        <template #cell-status="{ row }">
          <span :class="badgeClass(row.status || (row.resolved ? 'Selesai' : 'Aktif'))">
            {{ row.status || (row.resolved ? 'Selesai' : 'Aktif') }}
          </span>
        </template>
        <template #cell-actions="{ row }">
          <NuxtLink :to="'/app/faults?focus='+row.id" class="text-xs text-blue-600 hover:underline">Lihat</NuxtLink>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import InfoStatCard from '~/components/widget/InfoStatCard.vue'
import AreaLineChart from '~/components/widget/AreaLineChart.vue'
import DonutChart from '~/components/widget/DonutChart.vue'
import BarChart from '~/components/widget/BarChart.vue'
import DataTable from '~/components/widget/DataTable.vue'
import { useFinance } from '~/composables/data/useFinance'
import { usePengurus } from '~/composables/data/usePengurus'

import { useAbsensi } from '~/composables/data/useAbsensi'
import { useSantri } from '~/composables/data/useSantri'
import { useIzin } from '~/composables/data/useIzin'
import { useFaults } from '~/composables/data/useFaults'
import { useAnnouncements } from '~/composables/data/useAnnouncements'

definePageMeta({ layout: 'app', layoutProps: { title: 'Dashboard' } })

const fmtNumber = (n?: number | null) =>
  (n ?? 0).toLocaleString('id-ID')

const pct = (a: number, b: number) => (b > 0 ? (a / b) * 100 : null)

const badgeClass = (status?: string) => {
  const s = (status || '').toLowerCase()
  if (['approved','disetujui','selesai','lunas'].some(k => s.includes(k)))
    return 'text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
  if (['pending','menunggu','sebagian'].some(k => s.includes(k)))
    return 'text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
  return 'text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
}

const absensi = useAbsensi()
const santri  = useSantri()
const izin    = useIzin()
const faults  = useFaults()
const ann     = useAnnouncements()
const finance  = useFinance()
const pengurus = usePengurus?.()

onMounted(async () => {
  try { santri.subscribeSantri?.() } catch {}
  try { await santri.fetchSantri?.() } catch {}

  try { await absensi.fetchCurrent?.() } catch {}
  try { await absensi.fetchHistory?.() } catch {}
  try { absensi.subscribeLive?.() } catch {}

  try { await izin.fetchIzin?.() } catch {}
  try { izin.subscribeLive?.() } catch {}

  try { await faults.fetchFaults?.() } catch {}
  try { faults.subscribeFaults?.() } catch {}

  try { await ann.fetchAnnouncements?.() } catch {}
  try { ann.subscribeAnnouncements?.() } catch {}

  try { await finance.fetchSummary?.() } catch {}
  try { await finance.fetchTransactions?.() } catch {}
  try { await finance.fetchReceiptsHistory?.({ days: 30 }) } catch {}
  try { finance.subscribeFinance?.() } catch {}

  try { await pengurus?.fetchAbsensiToday?.() } catch {}
  try { pengurus?.subscribeAbsensiLive?.() } catch {}
})

const totalSantri = computed(() => Number(santri.rows?.value?.length || 0))

const presentTodayPct = computed(() => {
  const curr = absensi.current?.value
  const present = Number(curr?.present || curr?.hadir || 0)
  const total   = Number(curr?.total   || curr?.jumlah || 0)
  return pct(present, total) // bisa null
})

const trendAbsensi = computed(() => {
  const hist = absensi.history?.value || []
  if (hist.length < 2) return 0
  const last  = hist[hist.length-1]
  const prev  = hist[hist.length-2]
  const p1 = pct(Number(last?.present||0), Number(last?.total||0)) ?? 0
  const p0 = pct(Number(prev?.present||0), Number(prev?.total||0)) ?? 0
  return Number((p1 - p0).toFixed(1))
})

const trendSantri = 0

const fmtMoney = (n?: number | null) =>
  (Number(n ?? 0)).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })

const toDate = (v: any) => {
  if (v instanceof Date) return v
  const t = Number(v)
  if (!Number.isNaN(t) && t > 0) return new Date(t)
  const d = new Date(String(v || ''))
  return Number.isNaN(d.getTime()) ? new Date() : d
}
const sameMonth = (d: Date, ref: Date) =>
  d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth()
const sameYear = (d: Date, ref: Date) =>
  d.getFullYear() === ref.getFullYear()

const amount = (t: any) => Number(t?.amount ?? t?.nominal ?? t?.nilai ?? 0)
const isIncome = (t: any) => {
  const s = String(t?.type ?? t?.jenis ?? t?.direction ?? '').toLowerCase()
  return /income|masuk|penerimaan/.test(s) || (!!t?.isIncome && t.isIncome === true)
}
const isExpense = (t: any) => {
  const s = String(t?.type ?? t?.jenis ?? t?.direction ?? '').toLowerCase()
  return /expense|keluar|pengeluaran/.test(s) || (!!t?.isExpense && t.isExpense === true)
}

const now = new Date()

const uangMasukBulan = computed(() => {
  const s = finance.summary?.value
  if (s?.incomeMonth != null) return Number(s.incomeMonth)
  const tx = finance.transactions?.value || []
  return tx.filter((t: any) => isIncome(t) && sameMonth(toDate(t?.date ?? t?.tanggal ?? t?.ts), now))
           .reduce((a: any, t: any) => a + amount(t), 0)
})

const uangMasukTahun = computed(() => {
  const s = finance.summary?.value
  if (s?.incomeYear != null) return Number(s.incomeYear)
  const tx = finance.transactions?.value || []
  return tx.filter((t: any) => isIncome(t) && sameYear(toDate(t?.date ?? t?.tanggal ?? t?.ts), now))
           .reduce((a: any, t: any) => a + amount(t), 0)
})

const uangKeluarBulan = computed(() => {
  const s = finance.summary?.value
  if (s?.expenseMonth != null) return Number(s.expenseMonth)
  const tx = finance.transactions?.value || []
  return tx.filter((t: any) => isExpense(t) && sameMonth(toDate(t?.date ?? t?.tanggal ?? t?.ts), now))
           .reduce((a: any, t: any) => a + amount(t), 0)
})

const saldoKas = computed(() => {
  const s = finance.summary?.value
  if (s?.balance != null) return Number(s.balance)
  // fallback: total income - total expense dari semua transaksi yang ada
  const tx = finance.transactions?.value || []
  const inc = tx.filter(isIncome).reduce((a: any, t: any) => a + amount(t), 0)
  const exp = tx.filter(isExpense).reduce((a: any, t: any) => a + amount(t), 0)
  return inc - exp
})



const izinPending = computed(() => {
  const rows = izin.rows?.value || []
  return rows.filter(r => String(r?.status||'').toLowerCase().includes('pending')).length
})

const faultUnresolved = computed(() =>
  Number(faults.unresolvedCount?.value || (faults.rows?.value || []).filter(x => !x?.resolved).length || 0)
)

const attendanceChart = computed(() => {
  const hist = (absensi.history?.value || []).slice(-30)
  const labels = hist.map((s: any) => {
    const d = new Date(s?.date || s?.tanggal || s?.ts || Date.now())
    const mm = String(d.getMonth()+1).padStart(2,'0')
    const dd = String(d.getDate()).padStart(2,'0')
    return `${dd}/${mm}`
  })
  const data = hist.map((s: any) => pct(Number(s?.present||0), Number(s?.total||0)) ?? 0)

  return {
    labels,
    datasets: [{
      label: 'Hadir (%)',
      data,
      fill: true,
      tension: 0.35,
      backgroundColor: 'rgba(59,130,246,0.15)',
      borderColor: 'rgba(59,130,246,1)',
      pointRadius: 0
    }]
  }
})
const reloadAbsensiHistory = () => absensi.fetchHistory?.()

const jenjangChart = computed(() => {
  const rows = santri.rows?.value || []
  const countBy: Record<string, number> = {}
  for (const s of rows) {
    const raw = String(s?.jenjang || s?.kelas || 'Lainnya')
    let key = 'Lainnya'
    if (/^(vii|viii|ix)/i.test(raw)) key = 'MTs'
    else if (/^(x|xi|xii)/i.test(raw)) key = 'MA'
    else if (/kmi|diniyah/i.test(raw)) key = 'KMI/Diniyah'
    else key = raw
    countBy[key] = (countBy[key] || 0) + 1
  }
  const labels = Object.keys(countBy)
  const data   = labels.map(k => countBy[k])

  return {
    labels,
    datasets: [{ data, backgroundColor: ['#3b82f6','#06b6d4','#f59e0b','#10b981','#a78bfa','#ef4444'] }]
  }
})

const faultChart = computed(() => {
  const sum = faults.summaryByKategori?.value
  let labels: string[] = []
  let data: number[] = []
  if (sum && Array.isArray(sum)) {
    labels = sum.map((x:any) => x.kategori || x.title || '—')
    data   = sum.map((x:any) => Number(x.count || x.total || 0))
  } else {
    const rows = faults.rows?.value || []
    const since = Date.now() - 30*86400000
    const map: Record<string, number> = {}
    for (const f of rows) {
      const t = Number(f?.timestamp || f?.createdAt || Date.parse(f?.date||''))
      if (!t || t < since) continue
      const k = String(f?.kategori || 'Lainnya')
      map[k] = (map[k] || 0) + 1
    }
    labels = Object.keys(map)
    data   = labels.map(k => map[k])
  }
  return {
    labels,
    datasets: [{ label: 'Kasus', data, backgroundColor: 'rgba(16,185,129,0.6)' }]
  }
})

const agenda = computed(() => {
  const nexts = ann.getDueAnnouncements?.() || []
  if (Array.isArray(nexts) && nexts.length) {
    return nexts
      .slice(0, 10)
      .map((x:any, i:number) => ({
        id: x?.id || ('a'+i),
        title: x?.title || x?.text || 'Pengumuman',
        when: ann.scheduleLabel?.(x) || x?.when || '',
        where: x?.place || x?.location || ''
      }))
  }
  const rows = (ann.rows?.value || [])
    .filter((x:any) => Number(x?.timestamp || Date.parse(x?.date||'')) >= Date.now()-86400000)
    .sort((a:any,b:any) => Number(a?.timestamp||0) - Number(b?.timestamp||0))
  return rows.slice(0,10).map((x:any,i:number)=>({
    id: x?.id || ('r'+i),
    title: x?.title || 'Pengumuman',
    when: ann.scheduleLabel?.(x) || '',
    where: x?.place || ''
  }))
})

const izinCols = [
  { key: 'pemohon', label: 'Santri', sortable: true },
  { key: 'alasan',  label: 'Alasan', sortable: true },
  { key: 'waktu',   label: 'Waktu',  sortable: true },
  { key: 'status',  label: 'Status', sortable: true },
  { key: 'actions', label: '',       sortable: false },
]
const izinRows = computed(() => {
  const rows = izin.rows?.value || []
  return rows
    .slice()
    .sort((a:any,b:any)=> Number(b?.timestamp||0) - Number(a?.timestamp||0))
    .slice(0,20)
    .map((x:any) => ({
      id: x?.id || x?._id,
      pemohon: x?.santri || x?.pemohon || x?.nama || '-',
      alasan: x?.alasan || x?.reason || '-',
      waktu: new Date(Number(x?.timestamp || Date.parse(x?.tanggal||Date.now()))).toLocaleString(),
      status: x?.status || '-'
    }))
})

const trendIncomeMonth = computed(() => {
  const s = finance.summary?.value
  const cur = Number(s?.incomeMonth ?? uangMasukBulan.value)
  const prev = Number(s?.incomePrevMonth ?? 0)
  if (prev <= 0) return 0
  return Number((((cur - prev) / prev) * 100).toFixed(1))
})

const trendIncomeYear = computed(() => {
  const s = finance.summary?.value
  const cur = Number(s?.incomeYear ?? uangMasukTahun.value)
  const prev = Number(s?.incomePrevYear ?? 0)
  if (prev <= 0) return 0
  return Number((((cur - prev) / prev) * 100).toFixed(1))
})

const trendExpenseMonth = computed(() => {
  const s = finance.summary?.value
  const cur = Number(s?.expenseMonth ?? uangKeluarBulan.value)
  const prev = Number(s?.expensePrevMonth ?? 0)
  if (prev <= 0) return 0
  return Number((((cur - prev) / prev) * 100).toFixed(1))
})

const pengurusDonut = computed(() => {
  const t = pengurus?.today?.value || pengurus?.current?.value || {}
  const present = Number(t?.present ?? t?.hadir ?? 0)
  const total   = Number(t?.total ?? t?.jumlah ?? 0)
  const absent  = Math.max(total - present, 0)
  return {
    labels: ['Masuk', 'Tidak Masuk'],
    datasets: [{ data: [present, absent], backgroundColor: ['#10b981', '#ef4444'] }]
  }
})

const receiptsChart = computed(() => {
  const hist = finance.receiptsHistory?.value
  const days = 30
  const labels: string[] = []
  const data: number[] = []

  if (Array.isArray(hist) && hist.length) {
    const sliced = hist.slice(-days)
    for (const it of sliced) {
      const d = toDate(it?.date ?? it?.tanggal ?? it?.ts ?? Date.now())
      const mm = String(d.getMonth()+1).padStart(2,'0')
      const dd = String(d.getDate()).padStart(2,'0')
      labels.push(`${dd}/${mm}`)
      data.push(Number(it?.total ?? it?.amount ?? it?.nominal ?? 0))
    }
  } else {
    const tx = (finance.transactions?.value || []).filter(isIncome)
    const since = Date.now() - days * 86400000
    const map: Record<string, number> = {}
    for (const t of tx) {
      const d = toDate(t?.date ?? t?.tanggal ?? t?.ts)
      if (+d < since) continue
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
      map[key] = (map[key] || 0) + amount(t)
    }
    const keys = Object.keys(map).sort()
    for (const k of keys) {
      const [Y,M,D] = k.split('-')
      labels.push(`${D}/${M}`)
      data.push(map[k]!)
    }
  }

  return {
    labels,
    datasets: [{ label: 'Penerimaan (IDR)', data, backgroundColor: 'rgba(59,130,246,0.6)' }]
  }
})

const faultCols = [
  { key: 'santri', label: 'Santri', sortable: true },
  { key: 'kategori', label: 'Kategori', sortable: true },
  { key: 'poin', label: 'Poin', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'waktu', label: 'Waktu', sortable: true },
  { key: 'actions', label: '', sortable: false },
]
const faultRows = computed(() => {
  const rows = faults.rows?.value || []
  return rows
    .slice()
    .sort((a:any,b:any)=> Number(b?.timestamp||0) - Number(a?.timestamp||0))
    .slice(0,20)
    .map((x:any) => ({
      id: x?.id || x?._id,
      santri: x?.santri || x?.nama || '-',
      kategori: x?.kategori || '-',
      poin: Number(x?.poin || x?.point || 0),
      status: x?.resolved ? 'Selesai' : 'Aktif',
      waktu: new Date(Number(x?.timestamp || Date.parse(x?.tanggal||Date.now()))).toLocaleString()
    }))
})

const chartOpts = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { mode: 'index', intersect: false }
  },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: 'rgba(0,0,0,0.06)' } }
  }
}
</script>
