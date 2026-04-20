// /composables/data/usePayment.ts
import { ref as vRef, computed } from 'vue'
import { useNuxtApp } from '#app'
import {
  ref as dbRef, get, set, update, remove, onValue, off,
} from 'firebase/database'
import type { SantriRow } from '~/composables/data/useSantri'

export type ChargeItem = {
  key: string
  title: string
  amount: number
  active?: boolean
}

export type DiscountItem = {
  chargeKey: string
  type: 'amount' | 'percent'
  value: number
}

export type BillRow = {
  id: string
  santriId: string
  month: string               // 'yyyymm'
  items: Array<{
    key: string
    title: string
    amount: number            // final after discount
    original: number          // base before discount
    discount?: number         // absolute discount applied
  }>
  total: number
  status: 'unpaid' | 'paid'
  dueAt?: number | null
  paidAt?: number | null
  method?: string | null
  note?: string | null
}

function ymFromDate(d = new Date()) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`
}

export const usePayment = () => {
  const loading = vRef(false)
  const error = vRef<string | null>(null)

  /** ========== Rooms (dari santri) ========== */
  const rooms = vRef<{ maskan: string; kamar: string }[]>([])
  const santriByRoom = vRef<Record<string, SantriRow[]>>({}) // key: `${maskan}|||${kamar}`
  let _unsubSantri: null | (() => void) = null

  const { $realtimeDb } = useNuxtApp() as any

  function subscribeRooms() {
    const ref = dbRef($realtimeDb, 'alinayah/santri')
    const cb = (snap: any) => {
      const val = snap.val() || {}
      const rmMap = new Map<string, { maskan: string; kamar: string }>()
      const byRoom: Record<string, SantriRow[]> = {}
      for (const [id, v] of Object.entries<any>(val)) {
        const maskan = String(v.maskan || '').trim()
        const kamar = String(v.kamar || v.asrama || '').trim()
        const key = `${maskan}|||${kamar}`
        if (!rmMap.has(key)) rmMap.set(key, { maskan, kamar })
        if (!byRoom[key]) byRoom[key] = []
        byRoom[key].push({
          id,
          gen: v.gen || '',
          santri: v.santri || v.nama || '',
          walisantri: v.walisantri || v.wali || v.ortu || '',
          nohp: v.nohp || v.no_wa || v.whatsapp || v?.ppdb?.ortu?.hp1 || '',
          kamar, maskan,
          alamat: v.alamat || '',
          status: v.status || '',
          jenjang: v.jenjang || v.jenjang_pendidikan || v.kelas || '',
          rfid: v.rfid || '',
          fingerprint: v.fingerprint || '',
          gender: (v?.gender ?? v?.tipe ?? v?.ppdb?.siswa?.jk ?? '').toString().toUpperCase() === 'P' ? 'P' : (v.gender ? 'L' : ''),
          tipe: (v?.gender ?? v?.tipe ?? v?.ppdb?.siswa?.jk ?? '').toString().toUpperCase() === 'P' ? 'Putri' : 'Putra',
          ppdbCode: v.ppdbCode || '',
          dokumen: v.dokumen || null,
          nik: v?.ppdb?.siswa?.nik || '',
          ayahNama: v?.ppdb?.ortu?.ayah?.nama || '',
          ibuNama: v?.ppdb?.ortu?.ibu?.nama || '',
          dokumenCount: 0,
        } as SantriRow)
      }
      rooms.value = Array.from(rmMap.values())
        .filter(r => r.maskan || r.kamar)
        .sort((a, b) => `${a.maskan}-${a.kamar}`.localeCompare(`${b.maskan}-${b.kamar}`, 'id'))
      santriByRoom.value = byRoom
    }
    onValue(ref, cb)
    _unsubSantri = () => off(ref, 'value', cb)
  }
  function unsubscribeRooms() { _unsubSantri?.(); _unsubSantri = null }

  /** ========== Charges per (month/maskan/kamar) ========== */
  const charges = vRef<ChargeItem[]>([])
  let _unsubCharges: null | (() => void) = null

  function subscribeCharges(month: string, maskan: string, kamar: string) {
    unsubscribeCharges()
    const path = `alinayah/paymentSettings/${month}/${maskan}/${kamar}/charges`
    const ref = dbRef($realtimeDb, path)
    const cb = (snap: any) => {
      const v = snap.val() || {}
      const arr: ChargeItem[] = Object.entries<any>(v).map(([k, x]) => ({
        key: k,
        title: x.title,
        amount: Number(x.amount || 0),
        active: x.active !== false,
      }))
      charges.value = arr.sort((a, b) => a.title.localeCompare(b.title, 'id'))
    }
    onValue(ref, cb)
    _unsubCharges = () => off(ref, 'value', cb)
  }
  function unsubscribeCharges() { _unsubCharges?.(); _unsubCharges = null }

  async function ensureDefaultCharges(month: string, maskan: string, kamar: string) {
    const path = `alinayah/paymentSettings/${month}/${maskan}/${kamar}/charges`
    const snap = await get(dbRef($realtimeDb, path))
    if (snap.exists()) return
    await update(dbRef($realtimeDb, path), {
      syahriyah: { title: 'Syahriyah', amount: 390000, active: true },
      spp: { title: 'SPP Bulanan', amount: 100000, active: true },
    })
  }
  async function upsertCharge(month: string, maskan: string, kamar: string, item: ChargeItem) {
    const path = `alinayah/paymentSettings/${month}/${maskan}/${kamar}/charges/${item.key}`
    await set(dbRef($realtimeDb, path), {
      title: item.title,
      amount: Number(item.amount || 0),
      active: item.active !== false,
    })
  }
  async function deleteCharge(month: string, maskan: string, kamar: string, key: string) {
    await remove(dbRef($realtimeDb, `alinayah/paymentSettings/${month}/${maskan}/${kamar}/charges/${key}`))
  }

  /** ========== Discounts per (month/santri) ========== */
  const discounts = vRef<Record<string, DiscountItem[]>>({})

  async function loadDiscounts(month: string, santriIds: string[]) {
    discounts.value = {}
    const base = `alinayah/paymentDiscounts/${month}`
    const snap = await get(dbRef($realtimeDb, base))
    const v = snap.val() || {}
    for (const sid of santriIds) {
      const src = v?.[sid] || {}
      const arr: DiscountItem[] = Object.entries<any>(src).map(([ck, dv]) => ({
        chargeKey: ck,
        type: dv?.type === 'percent' ? 'percent' : 'amount',
        value: Number(dv?.value || 0),
      }))
      if (arr.length) discounts.value[sid] = arr
    }
  }
  async function setDiscount(month: string, santriId: string, d: DiscountItem) {
    const base = `alinayah/paymentDiscounts/${month}/${santriId}`
    await update(dbRef($realtimeDb, base), {
      [d.chargeKey]: { type: d.type, value: d.value },
    })
  }
  async function deleteDiscount(month: string, santriId: string, chargeKey: string) {
    await remove(dbRef($realtimeDb, `alinayah/paymentDiscounts/${month}/${santriId}/${chargeKey}`))
  }

  /** ========== Bills per (month/santri) ========== */
  const bills = vRef<BillRow[]>([])
  let _unsubBills: null | (() => void) = null

  function subscribeBills(month: string, santriIds: string[]) {
    unsubscribeBills()
    const path = `alinayah/bills/${month}`
    const ref = dbRef($realtimeDb, path)
    const ids = new Set(santriIds)
    const cb = (snap: any) => {
      const v = snap.val() || {}
      const arr: BillRow[] = []
      for (const sid of Object.keys(v)) {
        if (!ids.has(sid)) continue
        const sub = v[sid] || {}
        for (const [bid, b] of Object.entries<any>(sub)) {
          arr.push({
            id: bid,
            santriId: sid,
            month,
            items: (b.items || []).map((it: any) => ({
              key: it.key, title: it.title,
              amount: Number(it.amount || 0),
              original: Number(it.original || it.amount || 0),
              discount: Number(it.discount || 0),
            })),
            total: Number(b.total || 0),
            status: (b.status || 'unpaid') as 'unpaid' | 'paid',
            dueAt: b.dueAt ?? null,
            paidAt: b.paidAt ?? null,
            method: b.method ?? null,
            note: b.note ?? null,
          })
        }
      }
      bills.value = arr.sort((a, b) => (b.dueAt || 0) - (a.dueAt || 0))
    }
    onValue(ref, cb)
    _unsubBills = () => off(ref, 'value', cb)
  }
  function unsubscribeBills() { _unsubBills?.(); _unsubBills = null }

  function buildItemsForSantri(santriId: string, baseCharges: ChargeItem[]) {
    const dmap = new Map<string, DiscountItem>()
    for (const d of (discounts.value[santriId] || [])) dmap.set(d.chargeKey, d)
    const items = baseCharges
      .filter(c => c.active !== false)
      .map(c => {
        const original = Number(c.amount || 0)
        const dis = dmap.get(c.key)
        let discountAbs = 0
        if (dis) discountAbs = dis.type === 'percent'
          ? Math.round(original * (dis.value / 100))
          : Math.min(original, Math.round(dis.value))
        const amount = Math.max(0, original - discountAbs)
        return { key: c.key, title: c.title, amount, original, discount: discountAbs }
      })
    const total = items.reduce((a, b) => a + b.amount, 0)
    return { items, total }
  }

  async function upsertBill(month: string, santriId: string, billId: string, data: Partial<BillRow>) {
    const base = `alinayah/bills/${month}/${santriId}/${billId}`
    await update(dbRef($realtimeDb, base), {
      id: billId, santriId, month,
      items: data.items || [],
      total: Number(data.total ?? 0),
      status: data.status || 'unpaid',
      dueAt: data.dueAt ?? null,
      paidAt: data.paidAt ?? null,
      method: data.method ?? null,
      note: data.note ?? null,
    })
  }
  async function deleteBill(month: string, santriId: string, billId: string) {
    await remove(dbRef($realtimeDb, `alinayah/bills/${month}/${santriId}/${billId}`))
  }
  async function markPaid(month: string, santriId: string, billId: string, method: string) {
    await update(dbRef($realtimeDb, `alinayah/bills/${month}/${santriId}/${billId}`), {
      status: 'paid',
      method,
      paidAt: Date.now(),
    })
  }

  async function generateBillsForRoom(month: string, maskan: string, kamar: string, dueAt?: number) {
    await ensureDefaultCharges(month, maskan, kamar)
    // read snapshot charges
    const snap = await get(dbRef($realtimeDb, `alinayah/paymentSettings/${month}/${maskan}/${kamar}/charges`))
    const val = snap.val() || {}
    const baseCharges: ChargeItem[] = Object.entries<any>(val).map(([k, v]) => ({
      key: k, title: v.title, amount: Number(v.amount || 0), active: v.active !== false
    }))

    const key = `${maskan}|||${kamar}`
    const list = (santriByRoom.value[key] || []).map(s => s.id)
    await loadDiscounts(month, list)

    const updates: Record<string, any> = {}
    for (const sid of list) {
      const { items, total } = buildItemsForSantri(sid, baseCharges)
      const billId = month // satu bill gabungan per santri per bulan
      const base = `alinayah/bills/${month}/${sid}/${billId}`
      updates[`${base}/id`] = billId
      updates[`${base}/santriId`] = sid
      updates[`${base}/month`] = month
      updates[`${base}/items`] = items
      updates[`${base}/total`] = total
      updates[`${base}/status`] = 'unpaid'
      updates[`${base}/dueAt`] = dueAt ?? null
    }
    if (Object.keys(updates).length) await update(dbRef($realtimeDb), updates)
  }

  /** ========== Utilities ========== */
  const totalUnpaidByRoom = computed(() => {
    const map: Record<string, number> = {}
    for (const b of bills.value) {
      if (b.status !== 'unpaid') continue
      const roomKey = Object.entries(santriByRoom.value)
        .find(([, arr]) => arr.some(s => s.id === b.santriId))?.[0]
      if (!roomKey) continue
      map[roomKey] = (map[roomKey] || 0) + b.total
    }
    return map
  })

  return {
    // state
    rooms, santriByRoom, charges, discounts, bills, loading, error,
    // subscriptions
    subscribeRooms, unsubscribeRooms,
    subscribeCharges, unsubscribeCharges,
    subscribeBills, unsubscribeBills,
    // config
    ensureDefaultCharges, upsertCharge, deleteCharge,
    // discounts
    loadDiscounts, setDiscount, deleteDiscount,
    // bills
    buildItemsForSantri, upsertBill, deleteBill, markPaid, generateBillsForRoom,
    // utils
    ymFromDate, totalUnpaidByRoom,
  }
}
