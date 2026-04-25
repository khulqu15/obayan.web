import { ref as vRef } from 'vue'
import {
  child,
  get,
  ref as dbRef,
  push,
  set,
  update,
  remove,
  onValue,
  onChildAdded,
  serverTimestamp,
  query,
  limitToLast
} from 'firebase/database'

export type Urgency = 'Rendah' | 'Normal' | 'Tinggi' | 'Darurat'
export type IzinStatus = 'pending' | 'approved' | 'rejected' | 'out' | 'returned' | 'done'

let unsubRows: null | (() => void) = null

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
  alamat?: string
  penjemputNama?: string
  penjemputHubungan?: string
  penjemputTelp?: string
  plannedOutAt?: number
  plannedReturnAt?: number
}

export type LiveIzinEvent = {
  id: string
  uid?: string
  santriId?: string
  name: string
  maskan?: string
  kamar?: string
  action: 'request' | 'out' | 'return'
  by: 'rfid' | 'manual'
  deviceId?: string
  ts?: number
}

let _toneEl: HTMLAudioElement | null = null

function getClientName() {
  const config = useRuntimeConfig()
  return String(config.public.clientName || 'alinayah')
}

function getPaths() {
  const clientName = getClientName()

  return {
    clientName,
    current: `${clientName}/perizinan`,
    live: `${clientName}/perizinanLive`,
    history: `${clientName}/perizinanHistory`,
    rfidBindings: `${clientName}/rfid/bindings`
  }
}

function playToneOnce() {
  if (typeof Audio === 'undefined') return

  try {
    if (!_toneEl) {
      _toneEl = new Audio('/tone.mp3')
      _toneEl.preload = 'auto'
    }

    _toneEl.currentTime = 0
    void _toneEl.play().catch(() => {})
  } catch {}
}

function toNumberTs(value: any) {
  if (!value) return 0

  if (typeof value === 'number') {
    return value < 10_000_000_000 ? value * 1000 : value
  }

  if (typeof value === 'string') {
    const parsed = new Date(value).getTime()
    return Number.isNaN(parsed) ? 0 : parsed
  }

  if (typeof value === 'object') {
    if (value._seconds) return Number(value._seconds) * 1000
    if (typeof value.toMillis === 'function') return value.toMillis()
  }

  return 0
}

function normalizeStatus(value: any): IzinStatus {
  const status = String(value || 'pending').toLowerCase()

  if (status === 'approved') return 'approved'
  if (status === 'rejected') return 'rejected'
  if (status === 'out') return 'out'
  if (status === 'returned') return 'returned'
  if (status === 'done') return 'done'

  return 'pending'
}

function normalizeUrgency(value: any): Urgency {
  const urgency = String(value || 'Normal')

  if (urgency === 'Rendah') return 'Rendah'
  if (urgency === 'Tinggi') return 'Tinggi'
  if (urgency === 'Darurat') return 'Darurat'

  return 'Normal'
}

function normalizeIzinRow(id: string, v: any): IzinRow {
  return {
    id,
    santriId: String(v?.santriId || v?.idSantri || ''),
    name: String(v?.name || v?.santri || v?.namaSantri || 'Santri Fulan'),
    reason: String(v?.reason || v?.alasan || 'RFID Request'),
    urgency: normalizeUrgency(v?.urgency),
    status: normalizeStatus(v?.status),
    maskan: String(v?.maskan || ''),
    kamar: String(v?.kamar || ''),
    note: String(v?.note || v?.catatan || ''),
    alamat: String(v?.alamat || v?.address || ''),
    penjemputNama: String(v?.penjemputNama || ''),
    penjemputHubungan: String(v?.penjemputHubungan || ''),
    penjemputTelp: String(v?.penjemputTelp || ''),
    plannedOutAt: toNumberTs(v?.plannedOutAt || v?.waktuKeluar) || undefined,
    plannedReturnAt: toNumberTs(v?.plannedReturnAt || v?.waktuKembali) || undefined,
    requestedAt: toNumberTs(v?.requestedAt || v?.createdAt || v?.tanggal) || Date.now(),
    approvedAt: toNumberTs(v?.approvedAt) || undefined,
    outAt: toNumberTs(v?.outAt) || undefined,
    returnedAt: toNumberTs(v?.returnedAt) || undefined
  }
}

async function resolveByUID(uid?: string) {
  if (!uid) return null

  const { $realtimeDb } = useNuxtApp()
  const { rfidBindings } = getPaths()

  try {
    const snap = await get(child(dbRef($realtimeDb), `${rfidBindings}/${uid}`))
    const value = snap.val()

    if (!value) return null

    return {
      santriId: String(value.santriId || ''),
      name: String(value.name || 'Santri Fulan'),
      maskan: String(value.maskan || ''),
      kamar: String(value.kamar || '')
    }
  } catch {
    return null
  }
}

export const useIzin = () => {
  const loading = vRef(false)
  const error = vRef<string | null>(null)
  const rows = vRef<IzinRow[]>([])
  const live = vRef<LiveIzinEvent[]>([])

  let unsubLive: null | (() => void) = null

  async function fetchIzin() {
    loading.value = true
    error.value = null

    try {
      const { $realtimeDb } = useNuxtApp()
      const { current } = getPaths()

      const snap = await get(child(dbRef($realtimeDb), current))
      const val = snap.val() || {}

      const arr: IzinRow[] = Object.entries<any>(val)
        .filter(([key, value]) => {
          if (!value || typeof value !== 'object') return false
          if (key === 'live' || key === 'history' || key === 'current') return false
          return true
        })
        .map(([id, value]) => normalizeIzinRow(id, value))

      rows.value = arr.sort((a, b) => (b.requestedAt || 0) - (a.requestedAt || 0))
    } catch (e: any) {
      console.error(e)
      error.value = e?.message ?? 'Gagal memuat perizinan'
    } finally {
      loading.value = false
    }
  }

  async function createIzin(
    payload: Omit<IzinRow, 'id' | 'requestedAt' | 'status'> & {
      status?: IzinStatus
    }
  ) {
    const { $realtimeDb } = useNuxtApp()
    const { current } = getPaths()

    const node = push(dbRef($realtimeDb, current))

    const p: any = {
      id: node.key,
      santriId: String(payload.santriId || ''),
      name: String(payload.name || 'Santri Fulan'),
      santri: String(payload.name || 'Santri Fulan'),
      namaSantri: String(payload.name || 'Santri Fulan'),
      reason: String(payload.reason || 'RFID Request'),
      alasan: String(payload.reason || 'RFID Request'),
      urgency: payload.urgency || 'Normal',
      status: payload.status || 'pending',
      maskan: String(payload.maskan || ''),
      kamar: String(payload.kamar || ''),
      note: String(payload.note || ''),
      catatan: String(payload.note || ''),
      requestedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    if (payload.alamat !== undefined) p.alamat = String(payload.alamat || '')
    if (payload.penjemputNama !== undefined) p.penjemputNama = String(payload.penjemputNama || '')
    if (payload.penjemputHubungan !== undefined) p.penjemputHubungan = String(payload.penjemputHubungan || '')
    if (payload.penjemputTelp !== undefined) p.penjemputTelp = String(payload.penjemputTelp || '')
    if (payload.plannedOutAt !== undefined) p.plannedOutAt = Number(payload.plannedOutAt) || 0
    if (payload.plannedReturnAt !== undefined) p.plannedReturnAt = Number(payload.plannedReturnAt) || 0

    await set(node, p)

    await pushLive({
      action: 'request',
      by: 'manual',
      name: p.name,
      santriId: p.santriId,
      maskan: p.maskan,
      kamar: p.kamar
    })

    await fetchIzin()

    return node.key
  }

  async function updateIzin(id: string, patch: Partial<Omit<IzinRow, 'id'>>) {
    if (!id) return

    const { $realtimeDb } = useNuxtApp()
    const { current } = getPaths()

    const node = dbRef($realtimeDb, `${current}/${id}`)
    const u: any = {
      updatedAt: serverTimestamp()
    }

    if (patch.santriId !== undefined) u.santriId = String(patch.santriId || '')
    if (patch.name !== undefined) {
      u.name = String(patch.name || 'Santri Fulan')
      u.santri = String(patch.name || 'Santri Fulan')
      u.namaSantri = String(patch.name || 'Santri Fulan')
    }
    if (patch.reason !== undefined) {
      u.reason = String(patch.reason || 'RFID Request')
      u.alasan = String(patch.reason || 'RFID Request')
    }
    if (patch.urgency !== undefined) u.urgency = patch.urgency
    if (patch.status !== undefined) u.status = patch.status
    if (patch.maskan !== undefined) u.maskan = String(patch.maskan || '')
    if (patch.kamar !== undefined) u.kamar = String(patch.kamar || '')
    if (patch.note !== undefined) {
      u.note = String(patch.note || '')
      u.catatan = String(patch.note || '')
    }
    if (patch.alamat !== undefined) u.alamat = String(patch.alamat || '')
    if (patch.penjemputNama !== undefined) u.penjemputNama = String(patch.penjemputNama || '')
    if (patch.penjemputHubungan !== undefined) u.penjemputHubungan = String(patch.penjemputHubungan || '')
    if (patch.penjemputTelp !== undefined) u.penjemputTelp = String(patch.penjemputTelp || '')
    if (patch.plannedOutAt !== undefined) u.plannedOutAt = Number(patch.plannedOutAt) || 0
    if (patch.plannedReturnAt !== undefined) u.plannedReturnAt = Number(patch.plannedReturnAt) || 0
    if (patch.requestedAt !== undefined) u.requestedAt = Number(patch.requestedAt) || 0
    if (patch.approvedAt !== undefined) u.approvedAt = Number(patch.approvedAt) || 0
    if (patch.outAt !== undefined) u.outAt = Number(patch.outAt) || 0
    if (patch.returnedAt !== undefined) u.returnedAt = Number(patch.returnedAt) || 0

    await update(node, u)
    await fetchIzin()
  }

  async function deleteIzin(id: string) {
    if (!id) return

    const { $realtimeDb } = useNuxtApp()
    const { current } = getPaths()

    await remove(dbRef($realtimeDb, `${current}/${id}`))
    await fetchIzin()
  }

  async function approveIzin(id: string) {
    await updateIzin(id, {
      status: 'approved',
      approvedAt: Date.now()
    })
  }

  async function rejectIzin(id: string) {
    await updateIzin(id, {
      status: 'rejected',
      returnedAt: Date.now()
    })
  }

  async function markOut(id: string) {
    const row = rows.value.find((x) => x.id === id)

    await updateIzin(id, {
      status: 'out',
      outAt: Date.now()
    })

    if (row) {
      await pushLive({
        action: 'out',
        by: 'manual',
        santriId: row.santriId,
        name: row.name,
        maskan: row.maskan,
        kamar: row.kamar
      })
    }
  }

  async function markReturned(id: string) {
    const row = rows.value.find((x) => x.id === id)

    await updateIzin(id, {
      status: 'returned',
      returnedAt: Date.now()
    })

    if (row) {
      await pushLive({
        action: 'return',
        by: 'manual',
        santriId: row.santriId,
        name: row.name,
        maskan: row.maskan,
        kamar: row.kamar
      })
    }
  }

  async function archiveSnapshot(r: IzinRow, finalStatus?: IzinStatus) {
    const { $realtimeDb } = useNuxtApp()
    const { history } = getPaths()

    const pad = (n: number) => String(n).padStart(2, '0')
    const d = new Date()

    const sess = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}`

    const payload: any = {
      santriId: r.santriId || '',
      name: r.name || 'Santri Fulan',
      santri: r.name || 'Santri Fulan',
      namaSantri: r.name || 'Santri Fulan',
      reason: r.reason || 'RFID Request',
      alasan: r.reason || 'RFID Request',
      urgency: r.urgency || 'Normal',
      status: finalStatus || r.status,
      maskan: r.maskan || '',
      kamar: r.kamar || '',
      note: r.note || '',
      catatan: r.note || '',
      alamat: r.alamat || '',
      penjemputNama: r.penjemputNama || '',
      penjemputHubungan: r.penjemputHubungan || '',
      penjemputTelp: r.penjemputTelp || '',
      plannedOutAt: r.plannedOutAt || 0,
      plannedReturnAt: r.plannedReturnAt || 0,
      requestedAt: r.requestedAt || 0,
      approvedAt: r.approvedAt || 0,
      outAt: r.outAt || 0,
      returnedAt: finalStatus === 'returned' ? Date.now() : r.returnedAt || 0,
      archivedAt: serverTimestamp()
    }

    await set(dbRef($realtimeDb, `${history}/${sess}/${r.id}`), payload)
  }

  async function pushLive(ev: Omit<LiveIzinEvent, 'id' | 'ts'>) {
    const { $realtimeDb } = useNuxtApp()
    const { live: livePath } = getPaths()

    const node = push(dbRef($realtimeDb, livePath))

    await set(node, {
      uid: ev.uid || '',
      santriId: String(ev.santriId || ''),
      name: String(ev.name || 'Santri Fulan'),
      maskan: String(ev.maskan || ''),
      kamar: String(ev.kamar || ''),
      action: ev.action || 'request',
      by: ev.by || 'manual',
      deviceId: String(ev.deviceId || ''),
      ts: serverTimestamp()
    })
  }

  function subscribeIzin() {
    const { $realtimeDb } = useNuxtApp()
    const { current } = getPaths()

    loading.value = true
    error.value = null

    if (unsubRows) {
      try { unsubRows() } catch {}
      unsubRows = null
    }

    unsubRows = onValue(
      dbRef($realtimeDb, current),
      (snap) => {
        const val = snap.val() || {}

        const arr: IzinRow[] = Object.entries<any>(val)
          .filter(([key, value]) => {
            if (!value || typeof value !== 'object') return false
            if (key === 'live' || key === 'history' || key === 'current') return false
            return true
          })
          .map(([id, value]) => normalizeIzinRow(id, value))

        rows.value = arr.sort((a, b) => (b.requestedAt || 0) - (a.requestedAt || 0))
        loading.value = false
      },
      (e) => {
        error.value = e?.message || 'Gagal memuat perizinan'
        loading.value = false
      }
    )

    return unsubRows
  }

  function unsubscribeIzin() {
    if (unsubRows) {
      try { unsubRows() } catch {}
      unsubRows = null
    }
  }

  function subscribeLive(limit = 40) {
    const { $realtimeDb } = useNuxtApp()
    const { live: livePath } = getPaths()

    if (unsubLive) unsubLive()

    live.value = []

    const q = query(dbRef($realtimeDb, livePath), limitToLast(limit))

    const off = onChildAdded(q, async (snap) => {
      const v = snap.val() || {}
      const uid = String(v.uid || '')

      let e: LiveIzinEvent = {
        id: snap.key || '',
        uid,
        santriId: String(v.santriId || ''),
        name: String(v.name || 'Santri Fulan'),
        maskan: String(v.maskan || ''),
        kamar: String(v.kamar || ''),
        action: v.action || 'request',
        by: v.by || 'rfid',
        deviceId: String(v.deviceId || ''),
        ts: toNumberTs(v.ts) || Date.now()
      }

      live.value = [...live.value, e].slice(-limit)
      playToneOnce()

      if ((!v.name || !v.santriId) && uid) {
        const resolved = await resolveByUID(uid)

        if (resolved) {
          e = { ...e, ...resolved }
          live.value = live.value.map((x) => (x.id === e.id ? e : x))
        }
      }
    })

    unsubLive = () => off()

    return unsubLive
  }

  async function handleRFIDEvent(
    santriId: string,
    name: string,
    extra?: {
      maskan?: string
      kamar?: string
      deviceId?: string
    }
  ) {
    await fetchIzin()

    await pushLive({
      action: 'request',
      by: 'rfid',
      santriId,
      name,
      maskan: extra?.maskan,
      kamar: extra?.kamar,
      deviceId: extra?.deviceId
    })

    const existing = rows.value.find((r) => {
      return r.santriId === santriId &&
        r.status !== 'returned' &&
        r.status !== 'rejected' &&
        r.status !== 'done'
    })

    if (!existing) {
      await createIzin({
        santriId,
        name: name || 'Santri Fulan',
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
      return
    }

    if (existing.status === 'out') {
      await markReturned(existing.id)
    }
  }

  return {
    loading,
    error,
    rows,
    live,
    fetchIzin,
    subscribeIzin,
    unsubscribeIzin,
    createIzin,
    updateIzin,
    deleteIzin,
    approveIzin,
    rejectIzin,
    markOut,
    markReturned,
    archiveSnapshot,
    pushLive,
    subscribeLive,
    handleRFIDEvent
  }
}