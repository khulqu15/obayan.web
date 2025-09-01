// composables/data/useIzin.ts
import { ref as vRef, computed } from 'vue'
import {
  child, get, ref as dbRef, push, set, update, remove,
  onChildAdded, serverTimestamp, query, limitToLast
} from 'firebase/database'

export type Urgency = 'Rendah'|'Normal'|'Tinggi'|'Darurat'
export type IzinStatus = 'pending'|'approved'|'rejected'|'out'|'returned'

export type IzinRow = {
  id: string
  santriId?: string
  name: string
  reason: string
  urgency: Urgency
  status: IzinStatus
  maskan?: string
  kamar?: string
  note?: string
  requestedAt: number
  approvedAt?: number
  outAt?: number
  returnedAt?: number
}

export type LiveIzinEvent = {
  id: string
  santriId?: string
  name: string
  maskan?: string
  kamar?: string
  action: 'request'|'out'|'return'
  by: 'rfid'|'manual'
  deviceId?: string
  ts?: number
}

function cleanStr(s?: any) { return String(s ?? '').trim() }
function nowMs() { return Date.now() }

export const useIzin = () => {
  const loading = vRef(false)
  const error = vRef<string|null>(null)
  const rows = vRef<IzinRow[]>([])
  const live = vRef<LiveIzinEvent[]>([])

  async function fetchIzin() {
    loading.value = true
    error.value = null
    try {
      const { $realtimeDb } = useNuxtApp()
      const snap = await get(child(dbRef($realtimeDb), 'alberr/izin/current'))
      const val = snap.val() || {}
      const arr: IzinRow[] = Object.entries<any>(val).map(([id, v]) => ({
        id,
        santriId: v.santriId || '',
        name: cleanStr(v.name),
        reason: cleanStr(v.reason),
        urgency: (v.urgency || 'Normal') as Urgency,
        status: (v.status || 'pending') as IzinStatus,
        maskan: cleanStr(v.maskan),
        kamar: cleanStr(v.kamar),
        note: cleanStr(v.note),
        requestedAt: Number(v.requestedAt || 0),
        approvedAt: v.approvedAt ? Number(v.approvedAt) : undefined,
        outAt: v.outAt ? Number(v.outAt) : undefined,
        returnedAt: v.returnedAt ? Number(v.returnedAt) : undefined,
      }))
      rows.value = arr.sort((a,b) => (b.requestedAt||0) - (a.requestedAt||0))
    } catch (e:any) {
      console.error(e)
      error.value = e?.message ?? 'Gagal memuat perizinan'
    } finally {
      loading.value = false
    }
  }

  async function createIzin(payload: Omit<IzinRow,'id'|'requestedAt'|'status'> & { status?: IzinStatus }) {
    const { $realtimeDb } = useNuxtApp()
    const node = push(dbRef($realtimeDb, 'alberr/izin/current'))
    const p = {
      santriId: cleanStr(payload.santriId),
      name: cleanStr(payload.name),
      reason: cleanStr(payload.reason),
      urgency: (payload.urgency || 'Normal') as Urgency,
      status: (payload.status || 'pending') as IzinStatus,
      maskan: cleanStr(payload.maskan),
      kamar: cleanStr(payload.kamar),
      note: cleanStr(payload.note),
      requestedAt: serverTimestamp(),
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
    if (patch.santriId !== undefined) u.santriId = cleanStr(patch.santriId)
    if (patch.name !== undefined) u.name = cleanStr(patch.name)
    if (patch.reason !== undefined) u.reason = cleanStr(patch.reason)
    if (patch.urgency !== undefined) u.urgency = patch.urgency
    if (patch.status !== undefined) u.status = patch.status
    if (patch.maskan !== undefined) u.maskan = cleanStr(patch.maskan)
    if (patch.kamar !== undefined) u.kamar = cleanStr(patch.kamar)
    if (patch.note !== undefined) u.note = cleanStr(patch.note)
    if (patch.requestedAt !== undefined) u.requestedAt = Number(patch.requestedAt) || 0
    if (patch.approvedAt !== undefined) u.approvedAt = Number(patch.approvedAt) || 0
    if (patch.outAt !== undefined) u.outAt = Number(patch.outAt) || 0
    if (patch.returnedAt !== undefined) u.returnedAt = Number(patch.returnedAt) || 0
    await update(node, u)
    await fetchIzin()
  }

  async function deleteIzin(id: string) {
    const { $realtimeDb } = useNuxtApp()
    await remove(dbRef($realtimeDb, `alberr/izin/current/${id}`))
    await fetchIzin()
  }

  async function approveIzin(id: string) {
    await updateIzin(id, { status:'approved', approvedAt: nowMs() })
  }
  async function rejectIzin(id: string) {
    const r = rows.value.find(x => x.id === id); if (!r) return
    await archiveAndRemove(r, 'rejected')
  }
  async function markOut(id: string) {
    await updateIzin(id, { status:'out', outAt: nowMs() })
  }
  async function markReturned(id: string) {
    const r = rows.value.find(x => x.id === id); if (!r) return
    await archiveAndRemove({ ...r, status:'returned', returnedAt: nowMs() })
  }

  async function archiveAndRemove(r: IzinRow, finalStatus?: IzinStatus) {
    const { $realtimeDb } = useNuxtApp()
    const pad = (n:number)=> String(n).padStart(2,'0')
    const d = new Date()
    const sess = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}`
    const node = dbRef($realtimeDb, `alberr/izin/history/${sess}/${r.id}`)
    const payload:any = {
      santriId: r.santriId || '',
      name: r.name,
      reason: r.reason,
      urgency: r.urgency,
      status: finalStatus || r.status,
      maskan: r.maskan || '',
      kamar: r.kamar || '',
      note: r.note || '',
      requestedAt: r.requestedAt || 0,
      approvedAt: r.approvedAt || 0,
      outAt: r.outAt || 0,
      returnedAt: finalStatus==='returned' ? nowMs() : (r.returnedAt || 0),
    }
    await set(node, payload)
    await remove(dbRef($realtimeDb, `alberr/izin/current/${r.id}`))
    await fetchIzin()
  }

  let unsubLive: null | (()=>void) = null

  async function pushLive(ev: Omit<LiveIzinEvent,'id'|'ts'>) {
    const { $realtimeDb } = useNuxtApp()
    const node = push(dbRef($realtimeDb, 'alberr/izin/live'))
    await set(node, {
      santriId: cleanStr(ev.santriId),
      name: cleanStr(ev.name),
      maskan: cleanStr(ev.maskan),
      kamar: cleanStr(ev.kamar),
      action: ev.action,
      by: ev.by,
      deviceId: cleanStr(ev.deviceId),
      ts: serverTimestamp(),
    })
  }

  function subscribeLive(limit = 40) {
    const { $realtimeDb } = useNuxtApp()
    if (unsubLive) unsubLive()
    live.value = []
    const q = query(dbRef($realtimeDb, 'alberr/izin/live'), limitToLast(limit))
    const off = onChildAdded(q, (snap) => {
      const v = snap.val() || {}
      const e: LiveIzinEvent = {
        id: snap.key || '',
        santriId: v.santriId || '',
        name: cleanStr(v.name),
        maskan: cleanStr(v.maskan),
        kamar: cleanStr(v.kamar),
        action: (v.action || 'request'),
        by: (v.by || 'rfid'),
        deviceId: cleanStr(v.deviceId),
        ts: v.ts || Date.now(),
      }
      live.value = [...live.value, e].slice(-limit)
    })
    unsubLive = () => off()
    return unsubLive
  }

  async function handleRFIDEvent(santriId: string, name: string, extra?: { maskan?: string; kamar?: string; deviceId?: string }) {
    await pushLive({ action:'request', by:'rfid', santriId, name, maskan: extra?.maskan, kamar: extra?.kamar, deviceId: extra?.deviceId })
    const existing = rows.value.find(r => r.santriId === santriId && r.status !== 'returned' && r.status !== 'rejected')
    if (!existing) {
      await createIzin({
        santriId, name,
        reason: 'RFID Request',
        urgency: 'Normal',
        maskan: extra?.maskan || '',
        kamar: extra?.kamar || '',
        note: '',
        status: 'pending'
      })
      return
    }
    if (existing.status === 'approved' || existing.status === 'pending') {
      await markOut(existing.id)
    } else if (existing.status === 'out') {
      await markReturned(existing.id)
    }
  }

  return {
    loading, error, rows, live,
    fetchIzin, createIzin, updateIzin, deleteIzin,
    approveIzin, rejectIzin, markOut, markReturned,
    subscribeLive, handleRFIDEvent,
  }
}
