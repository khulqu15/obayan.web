<template>
  <div class="p-6 space-y-6 text-gray-800 dark:text-neutral-300">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold">Pembayaran</h1>
        <p class="text-sm text-gray-500 dark:text-neutral-400">
          Tabel santri per kamar per maskan. Kelola beban tagihan & diskon per santri dan lihat total tagihan belum terbayar.
        </p>
      </div>
    </div>

    <!-- Filter Bulan / Maskan / Kamar -->
    <div class="grid md:grid-cols-3 gap-3">
      <div>
        <label class="text-xs text-gray-500 dark:text-neutral-400">Bulan</label>
        <input type="month" v-model="monthInput"
               class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800"/>
      </div>
      <div>
        <label class="text-xs text-gray-500 dark:text-neutral-400">Maskan</label>
        <select v-model="maskan" class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800">
          <option value="">— Pilih —</option>
          <option v-for="m in uniqueMaskan" :key="m" :value="m">{{ m || '—' }}</option>
        </select>
      </div>
      <div>
        <label class="text-xs text-gray-500 dark:text-neutral-400">Kamar</label>
        <select v-model="kamar" class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800">
          <option value="">— Pilih —</option>
          <option v-for="r in roomsFilteredByMaskan" :key="`${r.maskan}|||${r.kamar}`" :value="r.kamar">{{ r.kamar }}</option>
        </select>
      </div>
    </div>

    <!-- Satu Tabel: Santri di kamar terpilih -->
    <div class="rounded-xl border border-gray-200 bg-white shadow-xs dark:bg-neutral-800 dark:border-neutral-700">
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-700">
        <h2 class="font-semibold">Santri — {{ maskan || '—' }} / {{ kamar || '—' }} ({{ month }})</h2>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center text-[11px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30">
            {{ santriList.length }} santri
          </span>
        </div>
      </div>

      <div class="p-4 overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="text-left text-gray-500 dark:text-neutral-400">
            <tr>
              <th class="py-2">Santri</th>
              <th class="py-2">Maskan</th>
              <th class="py-2">Kamar</th>
              <th class="py-2">Tagihan (bulan ini)</th>
              <th class="py-2">Total Belum Terbayar</th>
              <th class="py-2">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-neutral-700">
            <tr v-for="s in santriList" :key="s.id">
              <td class="py-2">
                <div class="font-medium">{{ s.santri }}</div>
                <div class="text-[11px] text-gray-500">{{ s.jenjang || '-' }}</div>
              </td>
              <td class="py-2">{{ s.maskan || '—' }}</td>
              <td class="py-2">{{ s.kamar || '—' }}</td>
              <td class="py-2">
                <!-- ringkas tagihan aktif (dari charges) + indikator diskon -->
                <div class="flex flex-wrap gap-x-2 gap-y-1">
                  <template v-for="c in charges" :key="c.key">
                    <span class="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border border-gray-200 dark:border-neutral-600">
                      {{ c.title }}: {{ fmtMoney(c.amount) }}
                      <span v-if="getDiscount(s.id, c.key)" class="text-amber-600">−{{ discountLabel(getDiscount(s.id, c.key)) }}</span>
                    </span>
                  </template>
                  <span v-if="!charges.length" class="text-xs text-gray-500">Belum ada beban (akan otomatis dibuat default)</span>
                </div>
              </td>
              <td class="py-2 font-semibold">
                {{ fmtMoney(unpaidTotalFor(s.id)) }}
              </td>
              <td class="py-2">
                <button class="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                        @click="openManage(s)">
                  Kelola
                </button>
              </td>
            </tr>
            <tr v-if="!santriList.length">
              <td colspan="99" class="py-6 text-gray-500 dark:text-neutral-400">Pilih maskan & kamar untuk melihat santri.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Kelola Tagihan & Diskon -->
    <div v-if="showManage" class="fixed inset-0 z-[70] flex items-center justify-center">
      <div class="fixed inset-0 bg-black/40"></div>
      <div class="relative w-full max-w-3xl mx-4 rounded-2xl border border-gray-200 bg-white shadow-xl dark:bg-neutral-900 dark:border-neutral-800">
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-neutral-800">
          <h3 class="text-sm font-semibold">
            Kelola Tagihan — {{ currentSantri?.santri }} ({{ maskan }}/{{ kamar }}) — {{ month }}
          </h3>
          <button @click="closeManage" class="inline-flex size-8 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="px-4 py-4 space-y-6">
          <!-- BEBAN (CRUD) -->
          <section>
            <div class="flex items-center justify-between mb-2">
              <div>
                <div class="font-medium">Beban Anggaran Kamar (bulan ini)</div>
                <p class="text-xs text-gray-500 dark:text-neutral-400">Mengatur daftar beban untuk semua santri kamar ini.</p>
              </div>
              <div class="flex items-center gap-2">
                <button class="text-xs px-2 py-1 rounded border hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800" @click="addChargeRow">
                  + Beban
                </button>
                <button class="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700" @click="saveCharges">
                  Simpan Beban
                </button>
              </div>
            </div>

            <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-neutral-800">
              <table class="min-w-full text-sm">
                <thead class="text-left text-gray-500 dark:text-neutral-400">
                  <tr>
                    <th class="py-2 px-2">Key</th>
                    <th class="py-2 px-2">Nama</th>
                    <th class="py-2 px-2">Nominal</th>
                    <th class="py-2 px-2">Aktif</th>
                    <th class="py-2 px-2"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-neutral-800">
                  <tr v-for="(c, i) in editCharges" :key="c._uid">
                    <td class="py-2 px-2"><input v-model="c.key" class="w-40 px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 dark:bg-neutral-900" placeholder="syahriyah"></td>
                    <td class="py-2 px-2"><input v-model="c.title" class="w-56 px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 dark:bg-neutral-900" placeholder="Syahriyah"></td>
                    <td class="py-2 px-2"><input v-model.number="c.amount" type="number" min="0" class="w-40 text-right px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 dark:bg-neutral-900"></td>
                    <td class="py-2 px-2"><input type="checkbox" v-model="c.active"></td>
                    <td class="py-2 px-2 text-right">
                      <button class="text-xs px-2 py-1 rounded border text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20" @click="removeChargeRow(i)">Hapus</button>
                    </td>
                  </tr>
                  <tr v-if="!editCharges.length">
                    <td colspan="99" class="py-4 px-2 text-gray-500 dark:text-neutral-400">Belum ada beban.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- DISKON per SANTRI -->
          <section>
            <div class="flex items-center justify-between mb-2">
              <div>
                <div class="font-medium">Diskon untuk {{ currentSantri?.santri }}</div>
                <p class="text-xs text-gray-500 dark:text-neutral-400">Diskon terapkan ke salah satu beban.</p>
              </div>
              <div class="flex items-center gap-2">
                <label class="text-xs text-gray-500 dark:text-neutral-400">Jatuh Tempo:
                  <input type="date" v-model="dueDateInput" class="ms-2 px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 dark:bg-neutral-900"/>
                </label>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <select v-model="draft(currentSantri!.id).chargeKey" class="px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 dark:bg-neutral-900">
                <option disabled value="">Pilih Beban</option>
                <option v-for="c in charges" :key="c.key" :value="c.key">{{ c.title }}</option>
              </select>

              <select v-model="draft(currentSantri!.id).type" class="px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 dark:bg-neutral-900">
                <option value="amount">Rp</option>
                <option value="percent">%</option>
              </select>

              <input v-model.number="draft(currentSantri!.id).value" type="number" min="0"
                     class="w-24 text-right px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 dark:bg-neutral-900"/>

              <button class="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700" @click="applyDiscount(currentSantri!.id)">Set</button>
              <button v-if="draft(currentSantri!.id).chargeKey" class="text-xs px-2 py-1 rounded border hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                      @click="removeDiscount(currentSantri!.id, draft(currentSantri!.id).chargeKey)">
                Hapus Diskon
              </button>
            </div>

            <div class="mt-2 flex flex-wrap gap-1">
              <button v-for="d in (discounts[currentSantri!.id] || [])"
                      :key="d.chargeKey"
                      @click="removeDiscount(currentSantri!.id, d.chargeKey)"
                      class="text-[11px] px-1.5 py-0.5 rounded border border-amber-300 text-amber-700 dark:border-amber-900/40 dark:text-amber-300">
                {{ findCharge(d.chargeKey)?.title || d.chargeKey }}: −{{ discountLabel(d) }} ✕
              </button>
            </div>
          </section>
        </div>

        <div class="flex items-center justify-between gap-2 px-4 py-3 border-t border-gray-200 dark:border-neutral-800">
          <div class="text-xs text-gray-500 dark:text-neutral-400">
            Estimasi total: <span class="font-semibold text-gray-800 dark:text-neutral-200">{{ fmtMoney(currentEstimateTotal) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button @click="closeManage" class="px-3 py-1.5 rounded-lg border hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800">Tutup</button>
            <button @click="saveAndGenerate" class="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Simpan & Generate Tagihan</button>
          </div>
        </div>
      </div>
    </div>
    <!-- /Modal -->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, reactive, ref, watch, watchEffect } from 'vue'
import { usePayment } from '~/composables/data/usePayment'
import { useSantri } from '~/composables/data/useSantri'

definePageMeta({ layout: 'app', layoutProps: { title: 'Pembayaran' } })

/** ===== Composables ===== */
const { rows: santriRows, fetchSantri } = useSantri()
const {
  rooms, santriByRoom, charges, discounts, bills,
  subscribeRooms, unsubscribeRooms,
  subscribeCharges, unsubscribeCharges,
  subscribeBills, unsubscribeBills,
  ensureDefaultCharges, upsertCharge, deleteCharge,
  loadDiscounts, setDiscount, deleteDiscount,
  buildItemsForSantri, deleteBill, markPaid, generateBillsForRoom,
} = usePayment()

/** ===== Bulan YYYY-MM <-> yyyymm ===== */
const toYYYYMM = (d = new Date()) => `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}`
const toYearMonth = (yyyymm: string) => `${yyyymm.slice(0,4)}-${yyyymm.slice(4,6)}`
const monthInput = ref<string>(toYearMonth(toYYYYMM()))
const month = computed<string>({
  get(){ return /^\d{4}-\d{2}$/.test(monthInput.value) ? monthInput.value.replace('-', '') : toYYYYMM() },
  set(yyyymm: string){ if (/^\d{6}$/.test(yyyymm)) monthInput.value = toYearMonth(yyyymm) }
})

/** ===== Filter kamar ===== */
const maskan = ref<string>(''); const kamar = ref<string>('')
const uniqueMaskan = computed(() => Array.from(new Set(rooms.value.map(r => r.maskan || ''))).sort((a,b)=>a.localeCompare(b,'id')))
const roomsFilteredByMaskan = computed(() => rooms.value.filter(r => !maskan.value || r.maskan === maskan.value))
const roomKey = computed(()=> `${maskan.value}|||${kamar.value}`)
const santriList = computed(()=> santriByRoom.value[roomKey.value] || [])

/** ===== Subs data kamar & bulan ===== */
watch([month, maskan, kamar], async ([m, mk, km]) => {
  unsubscribeCharges()
  unsubscribeBills()
  if (m && mk && km) {
    await ensureDefaultCharges(m, mk, km)
    subscribeCharges(m, mk, km)
    await loadDiscounts(m, santriList.value.map(s => s.id))
    subscribeBills(m, santriList.value.map(s => s.id))
    seedEditCharges()
  }
})
watchEffect(async () => {
  if (!month.value || !maskan.value || !kamar.value) return
  await loadDiscounts(month.value, santriList.value.map(s => s.id))
  subscribeBills(month.value, santriList.value.map(s => s.id))
})

/** ===== Edit charges buffer (untuk modal) ===== */
type EditCharge = { _uid: string; key: string; title: string; amount: number; active: boolean }
const editCharges = ref<EditCharge[]>([])
function seedEditCharges() {
  editCharges.value = charges.value.map(c => ({ _uid: `${c.key}-${Math.random().toString(36).slice(2,8)}`, key: c.key, title: c.title, amount: c.amount, active: c.active !== false }))
}
function addChargeRow(){ editCharges.value.push({ _uid: 'tmp-'+Math.random().toString(36).slice(2,8), key:'', title:'', amount:0, active:true }) }
function removeChargeRow(i:number){ editCharges.value.splice(i,1) }
async function saveCharges(){
  if (!month.value || !maskan.value || !kamar.value) return
  const m = month.value, mk = maskan.value, km = kamar.value
  const keep = new Set(editCharges.value.filter(e=>e.key.trim()).map(e=>e.key.trim()))
  for (const c of charges.value) if (!keep.has(c.key)) await deleteCharge(m, mk, km, c.key)
  for (const e of editCharges.value) {
    if (!e.key.trim() || !e.title.trim()) continue
    await upsertCharge(m, mk, km, { key: e.key.trim(), title: e.title.trim(), amount: Number(e.amount||0), active: e.active })
  }
}

/** ===== Draft diskon per santri (modal) ===== */
const discountDraft = reactive<Record<string, { chargeKey: string; type: 'amount'|'percent'; value: number }>>({})
function draft(sid: string){
  // @ts-ignore dynamic index
  return (discountDraft[sid] ??= { chargeKey:'', type:'amount', value:0 })
}
function getDiscount(sid: string, ck: string){ return (discounts.value[sid]||[]).find(d=>d.chargeKey===ck) }
function findCharge(key: string){ return charges.value.find(c=>c.key===key) }
function discountLabel(d?: {type:'amount'|'percent'; value:number}){ return !d ? '' : d.type==='percent' ? `${d.value}%` : fmtMoney(d.value) }

/** ===== Unpaid total per santri (baca bills) ===== */
const roomBillMap = computed(() => {
  const map = new Map<string, any>()
  for (const b of bills.value) map.set(`${b.santriId}|||${b.id}`, b)
  return map
})
function unpaidTotalFor(sid: string){
  const key = `${sid}|||${month.value}`
  const b = roomBillMap.value.get(key)
  if (b && b.status === 'unpaid') return Number(b.total || 0)
  return 0
}

/** ===== Modal state ===== */
const showManage = ref(false)
const currentSantri = ref<any|null>(null)
const dueDateInput = ref<string>('') // YYYY-MM-DD

const currentEstimateTotal = computed(() => {
  if (!currentSantri.value) return 0
  const base = editCharges.value.map(c => ({ key: c.key, title: c.title, amount: c.amount, active: c.active }))
  const dmap = new Map<string, {type:'amount'|'percent'; value:number}>()
  for (const d of (discounts.value[currentSantri.value.id] || [])) dmap.set(d.chargeKey, d)
  // gabungkan draft diskon yang lagi diedit juga (override)
  const dr = draft(currentSantri.value.id)
  if (dr.chargeKey) dmap.set(dr.chargeKey, { type: dr.type, value: Number(dr.value||0) })

  // hitung manual (mirroring buildItemsForSantri):
  const items = base.filter(c => c.active !== false).map(c => {
    const original = Number(c.amount || 0)
    const dd = dmap.get(c.key)
    let disc = 0
    if (dd) disc = dd.type === 'percent' ? Math.round(original * (dd.value/100)) : Math.min(original, Math.round(dd.value))
    return Math.max(0, original - disc)
  })
  return items.reduce((a,b)=>a+b,0)
})

function openManage(s: any){
  currentSantri.value = s
  // seed edit charges dari charges aktif sekarang
  seedEditCharges()
  // seed draft diskon agar selalu ada object saat v-model
  draft(s.id)
  showManage.value = true
}
function closeManage(){ showManage.value = false; currentSantri.value = null }

/** ===== Apply diskon + Simpan & Generate ===== */
async function applyDiscount(sid: string){
  const d = draft(sid)
  if (!d.chargeKey) return
  await setDiscount(month.value, sid, { chargeKey: d.chargeKey, type: d.type, value: Number(d.value||0) })
  await loadDiscounts(month.value, santriList.value.map(ss => ss.id))
}
async function removeDiscount(sid: string, ck: string){
  await deleteDiscount(month.value, sid, ck)
  await loadDiscounts(month.value, santriList.value.map(ss => ss.id))
}
async function saveAndGenerate(){
  if (!currentSantri.value) return
  await saveCharges()
  const dueAt = dueDateInput.value ? Date.parse(dueDateInput.value) : undefined
  await generateBillsForRoom(month.value, maskan.value, kamar.value, dueAt)
  closeManage()
}

/** ===== Money util ===== */
const fmtMoney = (n?: number | null) =>
  (Number(n ?? 0)).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })

/** ===== Lifecycle ===== */
onMounted(async () => {
  await fetchSantri()
  subscribeRooms()
})
onBeforeUnmount(() => {
  unsubscribeRooms()
  unsubscribeCharges()
  unsubscribeBills()
})
</script>
