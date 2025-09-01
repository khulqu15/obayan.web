// composables/data/useKunjungan.ts
import { ref as vRef, computed } from 'vue'
import {
  child, get, ref as dbRef, push, set, update, remove,
  onChildAdded, onValue, query, limitToLast, serverTimestamp
} from 'firebase/database'

export type VisitRow = {
  id: string
  santriId?: string
  name: string
  maskan?: string
  kamar?: string
  visitor?: string
  relation?: string
  ts: number
  // info tambahan
  by?: 'manual'|'rfid'
  deviceId?: string
  unlinked?: boolean // true bila tidak terhubung ke santriId
}

export const useKunjungan = () => {
  const loading = vRef(false)
  const error = vRef<string|null>(null)

  // bulan aktif (YYYY-MM)
  const monthKey = vRef(getMonthKey(new Date()))
  const logs = vRef<VisitRow[]>([])          // semua log bulan aktif
  const counts = vRef<Record<string, number>>({}) // santriId -> jumlah di bulan aktif
  const live = vRef<VisitRow[]>([])          // live feed singkat

  function getMonthKey(d: Date) {
    const pad = (n:number)=> String(n).padStart(2,'0')
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}`
  }

  // ===== Fetch/Subscribe Bulanan =====
  let unsubMonth: null | (()=>void) = null
  async function subscribeMonth(mKey?: string) {
    const { $realtimeDb } = useNuxtApp()
    const key = mKey || monthKey.value
    if (unsubMonth) unsubMonth()
    const node = dbRef($realtimeDb, `alberr/kunjungan/logs/${key}`)
    const off = onValue(node, (snap) => {
      const val = snap.val() || {}
      const arr: VisitRow[] = Object.entries<any>(val).map(([id, v]) => ({
        id,
        santriId: v.santriId || '',
        name: String(v.name ?? ''),
        maskan: String(v.maskan ?? ''),
        kamar: String(v.kamar ?? ''),
        visitor: String(v.visitor ?? ''),
        relation: String(v.relation ?? ''),
        ts: Number(v.ts || 0),
        by: (v.by || 'manual') as any,
        deviceId: v.deviceId || '',
        unlinked: !!v.unlinked,
      }))
      // urut terbaru
      arr.sort((a,b)=> (b.ts||0)-(a.ts||0))
      logs.value = arr

      // hitung ulang counts per santriId (hanya yang punya id)
      const map: Record<string, number> = {}
      for (const r of arr) {
        const id = r.santriId
        if (!id) continue
        map[id] = (map[id] || 0) + 1
      }
      counts.value = map
    })
    unsubMonth = () => off()
    return unsubMonth
  }

  // ===== Live feed =====
  let unsubLive: null | (()=>void) = null
  function subscribeLive(limit=40) {
    const { $realtimeDb } = useNuxtApp()
    if (unsubLive) unsubLive()
    live.value = []
    const q = query(dbRef($realtimeDb, 'alberr/kunjungan/live'), limitToLast(limit))
    const off = onChildAdded(q, (snap) => {
      const v = snap.val() || {}
      const e: VisitRow = {
        id: snap.key || '',
        santriId: v.santriId || '',
        name: String(v.name ?? ''),
        maskan: String(v.maskan ?? ''),
        kamar: String(v.kamar ?? ''),
        visitor: String(v.visitor ?? ''),
        relation: String(v.relation ?? ''),
        ts: Number(v.ts || Date.now()),
        by: (v.by || 'rfid'),
        deviceId: String(v.deviceId ?? ''),
        unlinked: !!v.unlinked,
      }
      live.value = [...live.value, e].slice(-limit)
    })
    unsubLive = () => off()
    return unsubLive
  }

  const monthTitle = computed(() => {
    const [y,m] = monthKey.value.split('-').map(Number)
    const d = new Date(y, (m-1)||0, 1)
    return d.toLocaleDateString('id-ID', { month:'long', year:'numeric' })
  })
  const liveSorted = computed(() => [...live.value].sort((a,b)=> (b.ts||0)-(a.ts||0)))
  function visitsThisMonth(santriId?: string) {
    if (!santriId) return 0
    return counts.value[santriId] || 0
  }

  async function createVisit(p: {
    santriId?: string
    name: string
    maskan?: string
    kamar?: string
    visitor?: string
    relation?: string
    by?: 'manual'|'rfid'
    deviceId?: string
  }) {
    const { $realtimeDb } = useNuxtApp()
    const now = Date.now()
    const mKey = monthKey.value

    let linkId = (p.santriId || '').trim()
    let unlinked = false

    if (!linkId) {
      try {
        const { useSantri } = await import('~/composables/data/useSantri')
        const { rows } = useSantri()
        const found = rows.value.filter(s => String(s.santri||'').toLowerCase().trim() === String(p.name||'').toLowerCase().trim())
        if (found.length === 1) linkId = found[0]!.id
      } catch {}
    }
    if (linkId) {
      const cnt = visitsThisMonth(linkId)
      if (cnt >= 2) {
        throw new Error('Kuota kunjungan bulan ini sudah 2x untuk santri ini.')
      }
    } else {
      unlinked = true // tidak bisa dihitung limit; tetap izinkan tapi ditandai
    }

    const node = push(dbRef($realtimeDb, `alberr/kunjungan/logs/${mKey}`))
    const row = {
      santriId: linkId || '',
      name: String(p.name||''),
      maskan: String(p.maskan||''),
      kamar: String(p.kamar||''),
      visitor: String(p.visitor||''),
      relation: String(p.relation||''),
      by: (p.by || 'manual'),
      deviceId: String(p.deviceId||''),
      unlinked,
      ts: serverTimestamp(),
    }
    await set(node, row)

    const liveRef = push(dbRef($realtimeDb, 'alberr/kunjungan/live'))
    await set(liveRef, row)

  }

  async function deleteVisit(id: string) {
    const { $realtimeDb } = useNuxtApp()
    await remove(dbRef($realtimeDb, `alberr/kunjungan/logs/${monthKey.value}/${id}`))
  }

  async function setMonth(mKey: string) {
    monthKey.value = mKey
    await subscribeMonth(mKey)
  }

  async function handleRFIDVisit(santriId: string, name: string, extra?: { maskan?: string; kamar?: string; visitor?: string; relation?: string; deviceId?: string }) {
    await createVisit({
      santriId, name,
      maskan: extra?.maskan, kamar: extra?.kamar,
      visitor: extra?.visitor, relation: extra?.relation,
      by: 'rfid', deviceId: extra?.deviceId
    })
  }

  return {
    loading, error, monthKey, monthTitle, logs, counts, live, liveSorted,
    subscribeMonth, subscribeLive, setMonth,
    createVisit, deleteVisit, handleRFIDVisit,
    visitsThisMonth,
  }
}
