import { ref as vRef, computed } from 'vue'
import {
  child, get, ref as dbRef, push, set, update, remove,
  onChildAdded, onValue, query, limitToLast, serverTimestamp
} from 'firebase/database'

export type VisitRow = {
  id: string; uid?: string; santriId?: string; name: string; maskan?: string; kamar?: string; visitor?: string; relation?: string; ts: number; by?: 'manual'|'rfid'; deviceId?: string; unlinked?: boolean
}

let _toneEl: HTMLAudioElement | null = null
function playToneOnce() { if (typeof Audio === 'undefined') return; try { if (!_toneEl) { _toneEl = new Audio('/tone.mp3'); _toneEl.preload = 'auto' } _toneEl.currentTime = 0; void _toneEl.play().catch(() => {}) } catch {} }
async function resolveByUID(uid?: string) {
  if (!uid) return null
  const { $realtimeDb } = useNuxtApp()
  try { const s = await get(child(dbRef($realtimeDb), `alberr/rfid/bindings/${uid}`))
    const v = s.val(); if (!v) return null
    return { santriId: String(v.santriId || ''), name: String(v.name || 'Santri Fulan'), maskan: String(v.maskan || ''), kamar: String(v.kamar || '') }
  } catch { return null }
}

export const useKunjungan = () => {
  const loading = vRef(false); const error = vRef<string|null>(null)
  const monthKey = vRef(getMonthKey(new Date()))
  const logs = vRef<VisitRow[]>([]); const counts = vRef<Record<string, number>>({}); const live = vRef<VisitRow[]>([])

  function getMonthKey(d: Date) { const pad = (n:number)=> String(n).padStart(2,'0'); return `${d.getFullYear()}-${pad(d.getMonth()+1)}` }

  let unsubMonth: null | (()=>void) = null
  async function subscribeMonth(mKey?: string) {
    const { $realtimeDb } = useNuxtApp()
    const key = mKey || monthKey.value
    if (unsubMonth) unsubMonth()
    const node = dbRef($realtimeDb, `alberr/kunjungan/logs/${key}`)
    const off = onValue(node, (snap) => {
      const val = snap.val() || {}
      const arr: VisitRow[] = Object.entries<any>(val).map(([id, v]) => ({
        id, uid: String(v.uid || ''), santriId: v.santriId || '', name: String(v.name || 'Santri Fulan'),
        maskan: String(v.maskan || ''), kamar: String(v.kamar || ''), visitor: String(v.visitor || ''), relation: String(v.relation || ''), ts: +v.ts || 0, by: (v.by || 'manual'), deviceId: String(v.deviceId || ''), unlinked: !!v.unlinked,
      }))
      arr.sort((a,b)=> (b.ts||0)-(a.ts||0)); logs.value = arr
      const map: Record<string, number> = {}; for (const r of arr) { const id = r.santriId; if (!id) continue; map[id] = (map[id] || 0) + 1 } counts.value = map
    })
    unsubMonth = () => off(); return unsubMonth
  }

  let unsubLive: null | (()=>void) = null
  function subscribeLive(limit=40) {
    const { $realtimeDb } = useNuxtApp()
    if (unsubLive) unsubLive(); live.value = []
    const q = query(dbRef($realtimeDb, 'alberr/kunjungan/live'), limitToLast(limit))
    const off = onChildAdded(q, async (snap) => {
      const v = snap.val() || {}
      const uid = String(v.uid || '')
      let e: VisitRow = {
        id: snap.key || '', uid, santriId: v.santriId || '', name: String(v.name || 'Santri Fulan'), maskan: String(v.maskan || ''), kamar: String(v.kamar || ''),
        visitor: String(v.visitor || ''), relation: String(v.relation || ''), ts: Number(v.ts || Date.now()), by: (v.by || 'rfid'), deviceId: String(v.deviceId || ''), unlinked: !!v.unlinked,
      }
      live.value = [...live.value, e].slice(-limit); playToneOnce()
      if ((!v.name || !v.santriId) && uid) {
        const r = await resolveByUID(uid)
        if (r) { e = { ...e, ...r }; live.value = live.value.map(x => x.id === e.id ? e : x) }
      }
    })
    unsubLive = () => off(); return unsubLive
  }

  const monthTitle = computed(() => {
    const [y,m] = monthKey.value.split('-').map(Number); const d = new Date(y, (m-1)||0, 1)
    return d.toLocaleDateString('id-ID', { month:'long', year:'numeric' })
  })
  const liveSorted = computed(() => [...live.value].sort((a,b)=> (b.ts||0)-(a.ts||0)))
  function visitsThisMonth(santriId?: string) { if (!santriId) return 0; return counts.value[santriId] || 0 }

  async function createVisit(p: { santriId?: string; name: string; maskan?: string; kamar?: string; visitor?: string; relation?: string; by?: 'manual'|'rfid'; deviceId?: string }) {
    const { $realtimeDb } = useNuxtApp()
    const mKey = monthKey.value; let linkId = (p.santriId || '').trim(); let unlinked = false
    if (!linkId) {
      try {
        const { useSantri } = await import('~/composables/data/useSantri')
        const { rows } = useSantri(); const found = rows.value.filter(s => String(s.santri||'').toLowerCase().trim() === String(p.name||'').toLowerCase().trim())
        if (found.length === 1) linkId = found[0]!.id
      } catch {}
    }
    if (linkId) { const cnt = visitsThisMonth(linkId); if (cnt >= 2) throw new Error('Kuota kunjungan bulan ini sudah 2x untuk santri ini.') } else { unlinked = true }

    const node = push(dbRef($realtimeDb, `alberr/kunjungan/logs/${mKey}`))
    const row = { santriId: linkId || '', name: String(p.name || 'Santri Fulan'), maskan: String(p.maskan || ''), kamar: String(p.kamar || ''), visitor: String(p.visitor || ''), relation: String(p.relation || ''), by: (p.by || 'manual'), deviceId: String(p.deviceId || ''), unlinked, ts: serverTimestamp() }
    await set(node, row); await set(push(dbRef($realtimeDb, 'alberr/kunjungan/live')), row)
  }
  async function deleteVisit(id: string) { const { $realtimeDb } = useNuxtApp(); await remove(dbRef($realtimeDb, `alberr/kunjungan/logs/${monthKey.value}/${id}`)) }
  async function setMonth(mKey: string) { monthKey.value = mKey; await subscribeMonth(mKey) }
  async function handleRFIDVisit(santriId: string, name: string, extra?: { maskan?: string; kamar?: string; visitor?: string; relation?: string; deviceId?: string }) {
    await createVisit({ santriId, name: name || 'Santri Fulan', maskan: extra?.maskan, kamar: extra?.kamar, visitor: extra?.visitor, relation: extra?.relation, by: 'rfid', deviceId: extra?.deviceId })
  }

  return { loading, error, monthKey, monthTitle, logs, counts, live, liveSorted, subscribeMonth, subscribeLive, setMonth, createVisit, deleteVisit, handleRFIDVisit, visitsThisMonth }
}
