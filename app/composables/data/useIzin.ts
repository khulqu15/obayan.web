import { ref as vRef } from 'vue'
import {
  child, get, ref as dbRef, push, set, update, remove,
  onChildAdded, serverTimestamp, query, limitToLast, onValue
} from 'firebase/database'

export type Urgency = 'Rendah'|'Normal'|'Tinggi'|'Darurat'
export type IzinStatus = 'pending'|'approved'|'rejected'|'out'|'returned'
export type IzinRow = {
  id: string; santriId?: string; name: string; reason: string; urgency: Urgency; status: IzinStatus;
  maskan?: string; kamar?: string; note?: string; requestedAt: number; approvedAt?: number; outAt?: number; returnedAt?: number
}
export type LiveIzinEvent = {
  id: string; uid?: string; santriId?: string; name: string; maskan?: string; kamar?: string; action: 'request'|'out'|'return'; by: 'rfid'|'manual'; deviceId?: string; ts?: number
}

let _toneEl: HTMLAudioElement | null = null
function playToneOnce() {
  if (typeof Audio === 'undefined') return
  try { if (!_toneEl) { _toneEl = new Audio('/tone.mp3'); _toneEl.preload = 'auto' }
    _toneEl.currentTime = 0; void _toneEl.play().catch(() => {}) } catch {}
}
async function resolveByUID(uid?: string) {
  if (!uid) return null
  const { $realtimeDb } = useNuxtApp()
  try {
    const s = await get(child(dbRef($realtimeDb), `alberr/rfid/bindings/${uid}`))
    const v = s.val(); if (!v) return null
    return { santriId: String(v.santriId || ''), name: String(v.name || 'Santri Fulan'), maskan: String(v.maskan || ''), kamar: String(v.kamar || '') }
  } catch { return null }
}

export const useIzin = () => {
  const loading = vRef(false)
  const error = vRef<string|null>(null)
  const rows = vRef<IzinRow[]>([])
  const live = vRef<LiveIzinEvent[]>([])

  async function fetchIzin() {
    loading.value = true; error.value = null
    try {
      const { $realtimeDb } = useNuxtApp()
      const snap = await get(child(dbRef($realtimeDb), 'alberr/izin/current'))
      const val = snap.val() || {}
      const arr: IzinRow[] = Object.entries<any>(val).map(([id, v]) => ({
        id, santriId: v.santriId || '', name: String(v.name || 'Santri Fulan'), reason: String(v.reason || 'RFID Request'),
        urgency: (v.urgency || 'Normal'), status: (v.status || 'pending'),
        maskan: String(v.maskan || ''), kamar: String(v.kamar || ''), note: String(v.note || ''),
        requestedAt: Number(v.requestedAt || 0), approvedAt: v.approvedAt ? +v.approvedAt : undefined, outAt: v.outAt ? +v.outAt : undefined, returnedAt: v.returnedAt ? +v.returnedAt : undefined,
      }))
      rows.value = arr.sort((a,b) => (b.requestedAt||0) - (a.requestedAt||0))
    } catch (e:any) { console.error(e); error.value = e?.message ?? 'Gagal memuat perizinan' }
    finally { loading.value = false }
  }

  async function createIzin(payload: Omit<IzinRow,'id'|'requestedAt'|'status'> & { status?: IzinStatus }) {
    const { $realtimeDb } = useNuxtApp()
    const node = push(dbRef($realtimeDb, 'alberr/izin/current'))
    const p = {
      santriId: String(payload.santriId || ''), name: String(payload.name || 'Santri Fulan'),
      reason: String(payload.reason || 'RFID Request'), urgency: (payload.urgency || 'Normal') as Urgency,
      status: (payload.status || 'pending') as IzinStatus, maskan: String(payload.maskan || ''), kamar: String(payload.kamar || ''), note: String(payload.note || ''), requestedAt: serverTimestamp(),
    }
    await set(node, p)
    await pushLive({ action:'request', by:'manual', name:p.name, santriId:p.santriId, maskan:p.maskan, kamar:p.kamar })
    await fetchIzin()
    return node.key
  }
  async function updateIzin(id: string, patch: Partial<Omit<IzinRow,'id'>>) {
    const { $realtimeDb } = useNuxtApp()
    const node = dbRef($realtimeDb, `alberr/izin/current/${id}`)
    const u:any = {}
    if (patch.santriId !== undefined) u.santriId = String(patch.santriId || '')
    if (patch.name !== undefined) u.name = String(patch.name || 'Santri Fulan')
    if (patch.reason !== undefined) u.reason = String(patch.reason || 'RFID Request')
    if (patch.urgency !== undefined) u.urgency = patch.urgency
    if (patch.status !== undefined) u.status = patch.status
    if (patch.maskan !== undefined) u.maskan = String(patch.maskan || '')
    if (patch.kamar !== undefined) u.kamar = String(patch.kamar || '')
    if (patch.note !== undefined) u.note = String(patch.note || '')
    if (patch.requestedAt !== undefined) u.requestedAt = Number(patch.requestedAt) || 0
    if (patch.approvedAt !== undefined) u.approvedAt = Number(patch.approvedAt) || 0
    if (patch.outAt !== undefined) u.outAt = Number(patch.outAt) || 0
    if (patch.returnedAt !== undefined) u.returnedAt = Number(patch.returnedAt) || 0
    await update(node, u); await fetchIzin()
  }
  async function deleteIzin(id: string) { const { $realtimeDb } = useNuxtApp(); await remove(dbRef($realtimeDb, `alberr/izin/current/${id}`)); await fetchIzin() }

  async function approveIzin(id: string) { await updateIzin(id, { status:'approved', approvedAt: Date.now() }) }
  async function rejectIzin(id: string)  { const r = rows.value.find(x => x.id === id); if (!r) return; await archiveAndRemove(r, 'rejected') }
  async function markOut(id: string)     { await updateIzin(id, { status:'out', outAt: Date.now() }) }
  async function markReturned(id: string) {
    await updateIzin(id, {
      status: 'returned',
      returnedAt: Date.now()
    })
  }


  async function archiveAndRemove(r: IzinRow, finalStatus?: IzinStatus) {
    const { $realtimeDb } = useNuxtApp()
    const pad = (n:number)=> String(n).padStart(2,'0'); const d = new Date()
    const sess = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}`
    const node = dbRef($realtimeDb, `alberr/izin/history/${sess}/${r.id}`)
    const payload:any = {
      santriId: r.santriId || '', name: r.name || 'Santri Fulan', reason: r.reason || 'RFID Request', urgency: r.urgency || 'Normal',
      status: finalStatus || r.status, maskan: r.maskan || '', kamar: r.kamar || '', note: r.note || '',
      requestedAt: r.requestedAt || 0, approvedAt: r.approvedAt || 0, outAt: r.outAt || 0, returnedAt: finalStatus==='returned' ? Date.now() : (r.returnedAt || 0),
    }
    await set(node, payload); await remove(dbRef($realtimeDb, `alberr/izin/current/${r.id}`)); await fetchIzin()
  }

  let unsubLive: null | (()=>void) = null
  async function pushLive(ev: Omit<LiveIzinEvent,'id'|'ts'>) {
    const { $realtimeDb } = useNuxtApp()
    const node = push(dbRef($realtimeDb, 'alberr/izin/live'))
    await set(node, {
      uid: ev.uid || '', santriId: String(ev.santriId || ''), name: String(ev.name || 'Santri Fulan'),
      maskan: String(ev.maskan || ''), kamar: String(ev.kamar || ''), action: ev.action || 'request', by: ev.by || 'manual', deviceId: String(ev.deviceId || ''), ts: serverTimestamp(),
    })
  }

  function subscribeLive(limit = 40) {
    const { $realtimeDb } = useNuxtApp()
    if (unsubLive) unsubLive()
    live.value = []
    const q = query(dbRef($realtimeDb, 'alberr/izin/live'), limitToLast(limit))
    const off = onChildAdded(q, async (snap) => {
      const v = snap.val() || {}
      const uid = String(v.uid || '')
      let e: LiveIzinEvent = {
        id: snap.key || '', uid,
        santriId: String(v.santriId || ''), name: String(v.name || 'Santri Fulan'),
        maskan: String(v.maskan || ''), kamar: String(v.kamar || ''),
        action: (v.action || 'request'), by: (v.by || 'rfid'),
        deviceId: String(v.deviceId || ''), ts: v.ts || Date.now(),
      }
      live.value = [...live.value, e].slice(-limit)
      playToneOnce()
      if ((!v.name || !v.santriId) && uid) {
        const r = await resolveByUID(uid)
        if (r) { e = { ...e, ...r }; live.value = live.value.map(x => x.id === e.id ? e : x) }
      }
    })
    unsubLive = () => off()
    return unsubLive
  }

  async function handleRFIDEvent(santriId: string, name: string, extra?: { maskan?: string; kamar?: string; deviceId?: string }) {
    await pushLive({ action:'request', by:'rfid', santriId, name, maskan: extra?.maskan, kamar: extra?.kamar, deviceId: extra?.deviceId })
    const existing = rows.value.find(r => r.santriId === santriId && r.status !== 'returned' && r.status !== 'rejected')
    if (!existing) {
      await createIzin({ santriId, name: name || 'Santri Fulan', reason: 'RFID Request', urgency: 'Normal', maskan: extra?.maskan || '', kamar: extra?.kamar || '', note: '', status: 'pending' })
      return
    }
    if (existing.status === 'approved' || existing.status === 'pending')      await markOut(existing.id)
    else if (existing.status === 'out')                                       await markReturned(existing.id)
  }

  return { loading, error, rows, live, fetchIzin, createIzin, updateIzin, deleteIzin, approveIzin, rejectIzin, markOut, markReturned, subscribeLive, handleRFIDEvent }
}
