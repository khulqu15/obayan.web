<template>
  <div class="p-6 space-y-6 text-gray-800 dark:text-neutral-300">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold">Pembayaran</h1>
        <p class="text-sm text-gray-500 dark:text-neutral-400">Kelola tagihan dan pilih metode pembayaran.</p>
      </div>
      <div class="flex gap-2">
        <span class="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
          Tagihan Aktif: {{ unpaidCount }}
        </span>
        <span class="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          Total Terhutang: {{ fmtMoney(totalDue) }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 space-y-4">
        <div class="rounded-xl border border-gray-200 bg-white shadow-xs dark:bg-neutral-800 dark:border-neutral-700">
          <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-700">
            <h2 class="font-semibold">Tagihan Aktif</h2>
            <button class="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-700/50" @click="regenerateDummy()">
              Refresh
            </button>
          </div>
          <div class="divide-y divide-gray-100 dark:divide-neutral-700">
            <div
              v-for="b in bills"
              :key="b.id"
              class="p-4 flex items-start justify-between gap-3 hover:bg-gray-50/60 dark:hover:bg-neutral-700/40 transition-colors"
            >
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center text-[11px] px-2 py-0.5 rounded-full"
                        :class="badgeClass(b.type)">
                    {{ b.type }}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-neutral-400">Periode: {{ b.period }}</span>
                </div>
                <div class="mt-1 font-medium truncate">{{ b.title }}</div>
                <div class="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                  Jatuh tempo: {{ new Date(b.dueAt).toLocaleDateString('id-ID') }} • Kode: {{ b.code }}
                </div>
              </div>
              <div class="text-right shrink-0">
                <div class="font-semibold">{{ fmtMoney(b.amount) }}</div>
                <div class="mt-2 flex items-center gap-2">
                  <button
                    class="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                    @click="selectBill(b)"
                  >
                    Bayar
                  </button>
                </div>
              </div>
            </div>
            <div v-if="!bills.length" class="p-6 text-sm text-gray-500 dark:text-neutral-400">
              Tidak ada tagihan saat ini.
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white shadow-xs dark:bg-neutral-800 dark:border-neutral-700">
          <div class="p-4 border-b border-gray-200 dark:border-neutral-700">
            <h2 class="font-semibold">Pilih Metode Pembayaran</h2>
            <p class="text-xs text-gray-500 dark:text-neutral-400">Metode akan menampilkan instruksi dan nomor VA/QR.</p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3 p-4">
            <button
              class="relative p-3 rounded-lg border text-center bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700/40 transition-colors"
              :class="{ 'ring-2 ring-blue-500/50 border-blue-500/60': selectedMethod?.key==='bca-va' }"
              @click="selectMethod(methods.find(m=>m.key==='bca-va'))"
            >
              <img src="/assets/images/mitra/bca.png" alt="BCA" class="h-5 mx-auto mb-2 opacity-90">
              <div class="text-xs font-medium">BCA VA</div>
            </button>

            <button
              class="relative p-3 rounded-lg border text-center bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700/40 transition-colors"
              :class="{ 'ring-2 ring-blue-500/50 border-blue-500/60': selectedMethod?.key==='dana' }"
              @click="selectMethod(methods.find(m=>m.key==='dana'))"
            >
              <img src="/assets/images/mitra/dana.png" alt="DANA" class="h-5 mx-auto mb-2 opacity-90">
              <div class="text-xs font-medium">DANA</div>
            </button>

            <button
              class="relative p-3 rounded-lg border text-center bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700/40 transition-colors"
              :class="{ 'ring-2 ring-blue-500/50 border-blue-500/60': selectedMethod?.key==='gopay' }"
              @click="selectMethod(methods.find(m=>m.key==='gopay'))"
            >
              <img src="/assets/images/mitra/gopay.png" alt="GoPay" class="h-5 mx-auto mb-2 opacity-90">
              <div class="text-xs font-medium">GoPay</div>
            </button>

            <button
              class="relative p-3 rounded-lg border text-center bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700/40 transition-colors"
              :class="{ 'ring-2 ring-blue-500/50 border-blue-500/60': selectedMethod?.key==='qris' }"
              @click="selectMethod(methods.find(m=>m.key==='qris'))"
            >
              <img src="/assets/qris.png" alt="QRIS" class="h-5 mx-auto mb-2 opacity-90">
              <div class="text-xs font-medium">QRIS</div>
            </button>
          </div>
        </div>
      </div>

      <!-- RIGHT: Instructions -->
      <div class="space-y-4">
        <div class="rounded-xl border border-gray-200 bg-white shadow-xs dark:bg-neutral-800 dark:border-neutral-700">
          <div class="p-4 border-b border-gray-200 dark:border-neutral-700">
            <h2 class="font-semibold">Instruksi Pembayaran</h2>
            <p class="text-xs text-gray-500 dark:text-neutral-400">
              Pilih tagihan & metode untuk melihat detail.
            </p>
          </div>

          <div class="p-4 space-y-3" v-if="selectedBill && selectedMethod">
            <div class="text-sm">
              <div class="font-medium">{{ selectedBill.title }}</div>
              <div class="text-gray-500 dark:text-neutral-400">Nominal: <span class="font-medium text-gray-800 dark:text-neutral-200">{{ fmtMoney(selectedBill.amount) }}</span></div>
            </div>

            <!-- VA / QR -->
            <div v-if="selectedMethod.key !== 'qris'" class="space-y-2">
              <div class="text-xs text-gray-500 dark:text-neutral-400">Nomor Virtual Account :</div>
              <div class="flex items-center gap-2">
                <code class="px-2 py-1 rounded bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-neutral-100 select-all">
                  {{ currentVA }}
                </code>
                <button class="text-xs px-2 py-1 rounded border hover:bg-gray-50 dark:hover:bg-neutral-700/50" @click="copy(currentVA)">
                  Salin
                </button>
              </div>
            </div>

            <div v-else class="space-y-2">
              <div class="text-xs text-gray-500 dark:text-neutral-400">Pindai QRIS :</div>
              <div class="rounded-lg border border-gray-200 bg-white p-3 dark:bg-neutral-900 dark:border-neutral-700">
                <img :src="qrisImage" alt="QRIS" class="w-full rounded">
              </div>
            </div>

            <!-- Steps -->
            <div class="pt-2">
              <div class="text-sm font-medium mb-1">Tata Cara {{ selectedMethod.title }}</div>
              <ol class="list-decimal ms-4 text-sm space-y-1">
                <li v-for="(s,i) in steps" :key="i">{{ s }}</li>
              </ol>
              <p class="mt-2 text-[12px] text-amber-600 dark:text-amber-400">* Ini hanya simulasi. Nomor VA/QR tidak dapat digunakan untuk transaksi nyata.</p>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <button
                class="text-sm px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                @click="markAsPaid()"
              >
                Tandai Sudah Bayar
              </button>
              <button
                class="text-sm px-3 py-1.5 rounded border hover:bg-gray-50 dark:hover:bg-neutral-700/50"
                @click="resetSelection()"
              >
                Batalkan
              </button>
            </div>
          </div>

          <div v-else class="p-4 text-sm text-gray-500 dark:text-neutral-400">
            Pilih tagihan dan metode pembayaran di panel kiri.
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white shadow-xs dark:bg-neutral-800 dark:border-neutral-700 p-4">
          <div class="flex items-center justify-between">
            <div class="text-sm">
              <div class="text-gray-500 dark:text-neutral-400">Total Terhutang</div>
              <div class="text-lg font-semibold">{{ fmtMoney(totalDue) }}</div>
            </div>
            <div class="text-sm">
              <div class="text-gray-500 dark:text-neutral-400">Tagihan Aktif</div>
              <div class="text-lg font-semibold text-right">{{ unpaidCount }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white shadow-xs dark:bg-neutral-800 dark:border-neutral-700">
      <div class="p-4 border-b border-gray-200 dark:border-neutral-700">
        <h2 class="font-semibold">Riwayat Pembayaran </h2>
      </div>
      <div class="p-4 overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="text-left text-gray-500 dark:text-neutral-400">
            <tr>
              <th class="py-2">Tanggal</th>
              <th class="py-2">Jenis</th>
              <th class="py-2">Metode</th>
              <th class="py-2">Nominal</th>
              <th class="py-2">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-neutral-700">
            <tr v-for="h in history" :key="h.id">
              <td class="py-2">{{ new Date(h.paidAt).toLocaleString('id-ID') }}</td>
              <td class="py-2">{{ h.type }}</td>
              <td class="py-2">{{ h.method }}</td>
              <td class="py-2">{{ fmtMoney(h.amount) }}</td>
              <td class="py-2">
                <span class="inline-flex text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30">Berhasil</span>
              </td>
            </tr>
            <tr v-if="!history.length">
              <td class="py-6 text-gray-500 dark:text-neutral-400" colspan="5">Belum ada riwayat pembayaran.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'

definePageMeta({ layout: 'app', layoutProps: { title: 'Pembayaran' } })

const user = reactive({
  id: 'S-2025-001',
  name: 'Admin',
  email: 'admin@alberr.sch.id',
})

type Bill = {
  id: string
  type: 'Bulanan' | 'Makanan' | 'Transportasi' | 'SPP'
  title: string
  period: string
  amount: number
  dueAt: number
  code: string
}
const now = new Date()
const pad = (n:number)=> String(n).padStart(2,'0')
const monthLbl = (d:Date)=> `${pad(d.getMonth()+1)}/${d.getFullYear()}`
const bills = ref<Bill[]>([
  { id: 'b1', type: 'SPP',         title: 'SPP Sekolah',     period: monthLbl(now), amount: 250_000, dueAt: +new Date(now.getFullYear(), now.getMonth(), 15), code: 'INV-SPP-001' },
  { id: 'b2', type: 'Bulanan',     title: 'Asrama Bulanan',  period: monthLbl(now), amount: 200_000, dueAt: +new Date(now.getFullYear(), now.getMonth(), 10), code: 'INV-ASR-001' },
  { id: 'b3', type: 'Makanan',     title: 'Uang Makan',      period: monthLbl(now), amount: 300_000, dueAt: +new Date(now.getFullYear(), now.getMonth(), 20), code: 'INV-MKN-001' },
  { id: 'b4', type: 'Transportasi',title: 'Transport Bulan', period: monthLbl(now), amount: 150_000, dueAt: +new Date(now.getFullYear(), now.getMonth(), 25), code: 'INV-TRP-001' },
])

type Method = { key: 'bca-va'|'dana'|'gopay'|'qris'; title: string }
const methods: Method[] = [
  { key: 'bca-va', title: 'BCA Virtual Account' },
  { key: 'dana',   title: 'DANA via VA' },
  { key: 'gopay',  title: 'GoPay via VA' },
  { key: 'qris',   title: 'QRIS' },
]

const selectedBill   = ref<Bill|null>(null)
const selectedMethod = ref<Method|null>(null)
const qrisImage      = '/assets/qris.png'

function selectBill(b: Bill) {
  selectedBill.value = b
  if (!selectedMethod.value) selectedMethod.value = methods[0]
}
function selectMethod(m?: Method) {
  if (!m) return
  selectedMethod.value = m
}

const unpaidCount = computed(()=> bills.value.length)
const totalDue = computed(()=> bills.value.reduce((a,b)=>a+b.amount,0))

function genVA(m: Method, bill: Bill) {
  const digits = (user.id.match(/\d+/g)?.join('') || '0000')
  const last4  = digits.slice(-4).padStart(4,'0')
  const mm     = pad(new Date(bill.dueAt).getMonth()+1)
  const suf    = bill.id.replace(/\D/g,'').padStart(2,'0').slice(-2)

  if (m.key === 'bca-va') return `8800${last4}${mm}${suf}`
  if (m.key === 'dana')   return `3901${last4}${mm}${suf}`        // 3901 = dummy pattern
  if (m.key === 'gopay')  return `70001${last4}${mm}${suf}`       // 70001 = dummy pattern
  return ''
}
const currentVA = computed(()=>{
  if (!selectedBill.value || !selectedMethod.value) return ''
  return genVA(selectedMethod.value, selectedBill.value)
})

const steps = computed(()=>{
  const b = selectedBill.value, m = selectedMethod.value
  if (!b || !m) return []
  const nominal = `Nominal: ${fmtMoney(b.amount)}`
  if (m.key === 'bca-va') return [
    'Buka BCA mobile / myBCA atau ATM BCA',
    'Pilih menu “m-Transfer” → “BCA Virtual Account”',
    `Masukkan No. VA: ${currentVA.value}`,
    nominal,
    'Konfirmasi dan selesaikan pembayaran',
  ]
  if (m.key === 'dana') return [
    'Buka aplikasi DANA',
    'Pilih “Kirim ke Bank / Virtual Account”',
    `Masukkan No. VA (DANA via VA): ${currentVA.value}`,
    nominal,
    'Konfirmasi dan bayar',
  ]
  if (m.key === 'gopay') return [
    'Buka Gojek → GoPay',
    'Pilih “Bayar Tagihan” / “Virtual Account”',
    `Masukkan No. VA (GoPay via VA): ${currentVA.value}`,
    nominal,
    'Konfirmasi dan bayar',
  ]
  return [
    'Buka aplikasi pembayaran yang mendukung QRIS',
    'Pindai kode QR di atas',
    nominal,
    'Konfirmasi dan selesaikan pembayaran',
  ]
})

async function copy(text: string) {
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text)
    else {
      const ta = document.createElement('textarea')
      ta.value = text; document.body.appendChild(ta); ta.select()
      document.execCommand('copy'); document.body.removeChild(ta)
    }
  } catch {}
}

const history = ref<{id:string; type:string; method:string; amount:number; paidAt:number}[]>([])
function markAsPaid() {
  if (!selectedBill.value || !selectedMethod.value) return
  const b = selectedBill.value, m = selectedMethod.value
  history.value.unshift({
    id: `H-${Date.now()}`,
    type: b.type,
    method: m.title,
    amount: b.amount,
    paidAt: Date.now(),
  })
  bills.value = bills.value.filter(x=>x.id !== b.id)
  resetSelection()
}

function resetSelection() {
  selectedBill.value = null
  selectedMethod.value = null
}

function regenerateDummy() {
  const base = [
    { id: 'b1', type: 'SPP',         title: 'SPP Sekolah',     amount: 200_000 },
    { id: 'b2', type: 'Bulanan',     title: 'Asrama Bulanan',  amount: 180_000 },
    { id: 'b3', type: 'Makanan',     title: 'Uang Makan',      amount: 320_000 },
    { id: 'b4', type: 'Transportasi',title: 'Transport Bulan', amount: 140_000 },
  ] as const
  const d = new Date()
  bills.value = base.map((x, i)=>({
    id: `b${i+1}`,
    type: x.type as Bill['type'],
    title: x.title,
    period: monthLbl(d),
    amount: x.amount + Math.round(Math.random()*50_000),
    dueAt: +new Date(d.getFullYear(), d.getMonth(), 10 + i*5),
    code: `INV-${x.type.substring(0,3).toUpperCase()}-${String(i+1).padStart(3,'0')}`
  }))
}

const fmtMoney = (n?: number | null) =>
  (Number(n ?? 0)).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })

const badgeClass = (type: Bill['type']) => {
  if (type === 'SPP') return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
  if (type === 'Bulanan') return 'bg-emerald-100 dark:bg-emerald-900/30'
  if (type === 'Makanan') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
  return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
}
</script>