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
      <!-- DIGANTI: Uang Keluar -> Syahriyah Menunggak -->
      <InfoStatCard
        label="Syahriyah Menunggak"
        :value="fmtMoney(totalTunggakan)"
        :percent="0"
        icon="lucide:alert-circle"
        sub="Akumulasi tunggakan aktif"
      />
      <InfoStatCard
        label="Saldo Kas"
        :value="fmtMoney(saldoKas)"
        :percent="0"
        icon="lucide:piggy-bank"
        sub="Nett per hari ini"
      />
    </div>

    <!-- ===== Charts Row (Agenda Terdekat pindah ke sini) ===== -->
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

      <!-- Agenda Terdekat -->
      <div class="p-4 rounded-xl border border-gray-200 bg-white shadow-xs dark:bg-neutral-800 dark:border-neutral-700">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-800 dark:text-neutral-100">Agenda Terdekat (7 hari)</h3>
          <NuxtLink to="/app/agenda" class="text-xs text-blue-600 hover:underline">Lihat semua</NuxtLink>
        </div>

        <ul v-if="agendaTerdekat.length" class="space-y-2 text-sm">
          <li v-for="a in agendaTerdekat" :key="a.id" class="flex items-start gap-2" @click="openAgendaDetail(a.id)">
            <span class="inline-block w-2.5 h-2.5 rounded-full mt-1" :style="{ background: a.color }"></span>
            <div class="min-w-0">
              <p class="text-gray-800 dark:text-neutral-100 truncate">{{ a.title }}</p>
              <p class="text-[12px] text-gray-500 dark:text-neutral-400">
                {{ a.when }} <span v-if="a.time">· {{ a.time }}</span><span v-if="a.where"> · {{ a.where }}</span>
              </p>
            </div>
          </li>
        </ul>
        <p v-else class="text-sm text-gray-500 dark:text-neutral-400">Tidak ada agenda 7 hari ke depan.</p>
      </div>
    </div>

    <!-- ===== Row berikut: Komposisi Jenjang pindah ke sini ===== -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <DonutChart
        title="Komposisi Jenjang"
        :data="jenjangChart"
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
          <h3 class="font-semibold text-gray-800 dark:text-neutral-100">Absensi Pengurus (Hari Ini)</h3>
        </div>
        <DonutChart
          :data="pengurusDonut"
          :options="{ cutout: '60%' }"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <!-- Perizinan Terbaru -->
      <DataTable
        title="Perizinan Terbaru"
        :rows="izinRows"
        :columns="izinCols"
        :rowKey="r => r.id"
      >
        <!-- badge status -->
        <template #cell-status="{ row }">
          <span :class="badgeClass(row.status)">{{ row.statusLabel }}</span>
        </template>

        <!-- badge urgensi -->
        <template #cell-urgency="{ row }">
          <span :class="urgencyClass(row.urgency)">{{ row.urgency }}</span>
        </template>

        <!-- jadwal rencana (keluar – kembali) -->
        <template #cell-planned="{ row }">
          <span class="text-xs text-gray-700 dark:text-neutral-200">{{ row.planned }}</span>
        </template>

        <!-- maskan / kamar -->
        <template #cell-maskan="{ row }">
          <span class="text-xs text-gray-700 dark:text-neutral-200">
            {{ row.maskan || '—' }}<span v-if="row.kamar"> · Kamar {{ row.kamar }}</span>
          </span>
        </template>

        <!-- waktu diminta -->
        <template #cell-requestedAt="{ row }">
          <span class="text-xs text-gray-700 dark:text-neutral-200">{{ row.requestedAtLabel }}</span>
        </template>

        <template #cell-actions="{ row }">
          <NuxtLink :to="'/app/izin?focus='+row.id" class="text-xs 600 hover:underline">Lihat</NuxtLink>
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
          <NuxtLink :to="'/app/faults?focus='+row.id" class="text-xs 600 hover:underline">Lihat</NuxtLink>
        </template>
      </DataTable>
    </div>
    <teleport to="body">
      <div v-if="agendaDetailId && selectedAgenda" class="fixed inset-0 z-[100]">
        <div class="absolute inset-0 bg-black/40" @click="closeAgendaDetail"></div>

        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-lg rounded-2xl border border-gray-100 bg-white shadow-xl dark:bg-neutral-800 dark:border-neutral-700">
            <div class="p-4 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
              <h3 class="font-semibold truncate">{{ selectedAgenda.title || 'Agenda' }}</h3>
              <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700" @click="closeAgendaDetail">
                <Icon icon="lucide:x" class="size-4" />
              </button>
            </div>

            <div class="p-4 space-y-3 max-h-[75vh] overflow-y-auto">
              <div v-if="selectedAgenda.thumbUrl" class="rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700">
                <img :src="selectedAgenda.thumbUrl" alt="thumb" class="w-full h-48 object-cover" />
              </div>

              <div class="text-sm space-y-1">
                <div class="flex items-start gap-2">
                  <Icon icon="lucide:calendar" class="size-4 mt-0.5 text-gray-500 dark:text-neutral-400" />
                  <div>
                    <div class="font-medium">
                      {{ fmtDateTimeRange(selectedAgenda.startAt, selectedAgenda.endAt, selectedAgenda.allDay) }}
                    </div>
                    <div v-if="selectedAgenda.location" class="text-gray-500 dark:text-neutral-400">
                      <Icon icon="lucide:map-pin" class="inline size-4 -mt-0.5 mr-1" />
                      {{ selectedAgenda.location }}
                    </div>
                  </div>
                </div>

                <div v-if="selectedAgenda.desc" class="pt-2 whitespace-pre-wrap text-gray-700 dark:text-neutral-200">
                  {{ selectedAgenda.desc }}
                </div>
              </div>
            </div>

            <div class="p-4 border-t border-gray-200 dark:border-neutral-700 flex items-center justify-between">
              <div class="inline-flex items-center gap-2">
                <span class="inline-block w-3 h-3 rounded-full" :style="{ background: selectedAgenda.color || '#3b82f6' }"></span>
                <span class="text-xs text-gray-500 dark:text-neutral-400">Label warna</span>
              </div>
              <div class="flex items-center gap-2">
                <NuxtLink
                  :to="`/app/agenda`"
                  class="px-3 py-1.5 rounded-lg border hover:bg-gray-50 border-gray-200 dark:border-neutral-700 dark:hover:bg-neutral-700 text-sm"
                >
                  Edit di Halaman Agenda
                </NuxtLink>
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-lg border hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700 text-sm text-rose-600"
                  @click="deleteAgendaFromDetail"
                  :disabled="agendaDeleting"
                >
                  <Icon v-if="agendaDeleting" icon="ph:spinner" class="size-4 animate-spin" />
                  <span>{{ agendaDeleting ? 'Menghapus…' : 'Hapus' }}</span>
                </button>
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
                  @click="closeAgendaDetail"
                >
                  Tutup
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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
import { useAgenda } from '~/composables/data/useAgenda'

const agendaApi = useAgenda()

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

const agendaDetailId = ref<string | null>(null)
const agendaDeleting = ref(false)

const selectedAgenda = computed(() =>
  agendaDetailId.value
    ? (agendaApi.rows.value || []).find(a => a.id === agendaDetailId.value) || null
    : null
)

function fmtDateTimeRange(a?: number, b?: number, allDay?: boolean) {
  if (!a && !b) return ''
  if (allDay) {
    const d = a ? new Date(a) : b ? new Date(b) : new Date()
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) + ' · Seharian'
  }
  const A = a ? new Date(a) : null
  const B = b ? new Date(b) : null
  const fmtD = (d: Date) => d.toLocaleDateString('id-ID', { weekday:'long', day:'2-digit', month:'long', year:'numeric' })
  const fmtT = (d: Date) => d.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' })
  if (A && B) {
    const sameDay = A.toDateString() === B.toDateString()
    return sameDay
      ? `${fmtD(A)} · ${fmtT(A)}–${fmtT(B)}`
      : `${fmtD(A)} ${fmtT(A)} — ${fmtD(B)} ${fmtT(B)}`
  }
  if (A) return `${fmtD(A)} · ${fmtT(A)}`
  return `${fmtD(B!)} · ${fmtT(B!)}`
}

function openAgendaDetail(id: string) {
  agendaDetailId.value = id
}
function closeAgendaDetail() {
  agendaDetailId.value = null
}

async function deleteAgendaFromDetail() {
  if (!selectedAgenda.value) return
  const ok = confirm('Apakah Anda yakin ingin menghapus agenda ini?')
  if (!ok) return
  try {
    agendaDeleting.value = true
    await agendaApi.deleteAgenda(selectedAgenda.value.id)
    closeAgendaDetail()
  } catch (e) {
    console.error(e)
    alert('Gagal menghapus agenda.')
  } finally {
    agendaDeleting.value = false
  }
}

onMounted(async () => {
  const d = new Date()
  agendaApi.subscribeMonth(d.getFullYear(), d.getMonth())

  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  const day     = d.getDate()
  if (lastDay - day <= 7) {
    const y = d.getFullYear(), m1 = d.getMonth() + 1
    setTimeout(() => agendaApi.subscribeMonth(y + (m1>11?1:0), (m1%12)), 100)
  }

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

const saldoKas = computed(() => {
  const s = finance.summary?.value
  if (s?.balance != null) return Number(s.balance)
  const tx = finance.transactions?.value || []
  const inc = tx.filter(isIncome).reduce((a: any, t: any) => a + amount(t), 0)
  const exp = tx.filter(isExpense).reduce((a: any, t: any) => a + amount(t), 0)
  return inc - exp
})

const totalTunggakan = computed(() => {
  const s = finance.summary?.value
  if (s?.arrears != null) return Number(s.arrears)
  return 0
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
      const t = Number(f?.timestamp || f?.createdAt || Date.parse(f?.date||'')) || 0
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

const nowMs = () => Date.now()
const in7DaysMs = () => nowMs() + 7 * 86400000

const fmtTimeRange = (a?: number, b?: number, allDay?: boolean) => {
  if (!a && !b) return ''
  if (allDay) return 'Seharian'
  const A = a ? new Date(a) : null
  const B = b ? new Date(b) : null
  const time = (d: Date) => d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  if (A && B) return `${time(A)}–${time(B)}`
  if (A) return time(A)
  return time(B!)
}

const agendaTerdekat = computed(() => {
  const list = agendaApi.rows.value || []
  const start = nowMs()
  const end   = in7DaysMs()
  return list
    .filter(a => {
      const s = Number(a.startAt || 0)
      const e = Number(a.endAt || a.startAt || 0)
      return (s >= start && s <= end) || (e >= start && e <= end) || (s <= start && e >= start) // overlap juga masuk
    })
    .sort((a,b) => (a.startAt - b.startAt) || (a.title||'').localeCompare(b.title||''))
    .slice(0, 10)
    .map((a, i) => ({
      id: a.id || ('a'+i),
      title: a.title || 'Agenda',
      when: new Date(a.startAt).toLocaleDateString('id-ID', { weekday:'short', day:'2-digit', month:'short' }),
      time: fmtTimeRange(a.startAt, a.endAt, a.allDay),
      where: a.location || '',
      color: a.color || '#3b82f6',
      thumb: a.thumbUrl || null
    }))
})


const izinCols = [
  { key: 'name',        label: 'Santri',            sortable: true },
  { key: 'maskan',      label: 'Maskan / Kamar',    sortable: true },
  { key: 'reason',      label: 'Alasan',            sortable: true },
  { key: 'urgency',     label: 'Urgensi',           sortable: true },
  { key: 'planned',     label: 'Rencana',           sortable: false },
  { key: 'requestedAt', label: 'Diminta',           sortable: true },
  { key: 'status',      label: 'Status',            sortable: true },
  { key: 'actions',     label: '',                  sortable: false },
]

const fmtDateTime = (ms?: number) =>
  ms ? new Date(ms).toLocaleString('id-ID', { dateStyle:'medium', timeStyle:'short' }) : '—'

const fmtRange = (a?: number, b?: number) => {
  const A = a ? new Date(a) : null
  const B = b ? new Date(b) : null
  if (!A && !B) return '—'
  if (A && !B)  return `${A.toLocaleString('id-ID', { dateStyle:'medium', timeStyle:'short' })}`
  if (!A && B)  return `s.d. ${B.toLocaleString('id-ID', { dateStyle:'medium', timeStyle:'short' })}`
  return `${A!.toLocaleString('id-ID', { dateStyle:'medium', timeStyle:'short' })} – ${B!.toLocaleString('id-ID', { dateStyle:'medium', timeStyle:'short' })}`
}

const humanStatus = (s?: string) => {
  const x = String(s||'').toLowerCase()
  if (x === 'pending')  return 'Menunggu'
  if (x === 'approved') return 'Disetujui'
  if (x === 'rejected') return 'Ditolak'
  if (x === 'out')      return 'Keluar'
  if (x === 'returned') return 'Kembali'
  return s || '-'
}

const urgencyClass = (u?: string) => {
  const x = String(u||'Normal').toLowerCase()
  if (x === 'darurat') return 'text-xs px-2 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
  if (x === 'tinggi')  return 'text-xs px-2 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
  if (x === 'rendah')  return 'text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 dark:bg-neutral-700/40 dark:text-neutral-200'
  return 'text-xs px-2 py-0.5 rounded bg-blue-100 700 dark:bg-blue-900/30 dark:300'
}

const izinRows = computed(() => {
  const list = izin.rows?.value || []
  return list
    .slice()
    .sort((a:any,b:any)=> Number(b?.requestedAt||0) - Number(a?.requestedAt||0))
    .slice(0, 20)
    .map((x:any) => ({
      id: x.id,
      name: x.name || 'Santri Fulan',
      maskan: x.maskan || '',
      kamar: x.kamar || '',
      reason: x.reason || '-',
      urgency: x.urgency || 'Normal',
      planned: fmtRange(x.plannedOutAt, x.plannedReturnAt),
      requestedAt: x.requestedAt || 0,
      requestedAtLabel: fmtDateTime(x.requestedAt),
      status: x.status || 'pending',
      statusLabel: humanStatus(x.status),
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

const pengurusDonut = computed(() => {
  const t = pengurus?.today?.value || pengurus?.current?.value || {}
  const present = Number(t?.present ?? t?.hadir ?? 0)
  const total   = Number(t?.total   ?? t?.jumlah ?? 0)
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
