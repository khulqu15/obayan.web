import { ref as vRef } from 'vue'
import {
  child, get, ref as dbRef, push, set, update, remove,
  onChildAdded, serverTimestamp, query, limitToLast, onValue
} from 'firebase/database'

export type RfidBinding = {
  uid: string
  santriId: string
  name: string
  maskan?: string
  kamar?: string
  createdAt?: number
  replacedFrom?: string
}
export type RfidInboxEvent = { uid: string; deviceId?: string; ts?: number }
export type RfidLive = { rfid: string; timestamp: string | number }

let _toneEl: HTMLAudioElement | null = null
function playToneOnce() {
  if (typeof Audio === 'undefined') return
  try {
    if (!_toneEl) { _toneEl = new Audio('/tone.mp3'); _toneEl.preload = 'auto' }
    _toneEl.currentTime = 0
    void _toneEl.play().catch(() => {})
  } catch {}
}
function clean(s?: any) { return String(s ?? '').trim() }

export const useRFID = () => {
  const loading = vRef(false)
  const error = vRef<string|null>(null)

  const bySantri = vRef<Record<string, { uid: string; createdAt?: number }>>({})
  const byCard   = vRef<Record<string, { santriId: string; name: string; maskan?: string; kamar?: string; createdAt?: number }>>({})

  const waiting = vRef(false)
  const lastTap = vRef<RfidInboxEvent|null>(null)
  let unsubInbox: null | (()=>void) = null
  let startedAt = 0

  async function fetchBindings() {
    loading.value = true; error.value = null
    try {
      const { $realtimeDb } = useNuxtApp()
      const [s1, s2] = await Promise.all([
        get(child(dbRef($realtimeDb), 'alberr/rfid/bySantri')),
        get(child(dbRef($realtimeDb), 'alberr/rfid/bindings')),
      ])
      bySantri.value = s1.val() || {}
      byCard.value   = s2.val() || {}
    } catch (e:any) {
      console.error(e); error.value = e?.message ?? 'Gagal memuat data RFID'
    } finally {
      loading.value = false
    }
  }

  async function isCardBound(uid: string) {
    const { $realtimeDb } = useNuxtApp()
    const snap = await get(child(dbRef($realtimeDb), `alberr/rfid/bindings/${uid}`))
    const v = snap.val()
    if (!v) return null
    return { santriId: String(v.santriId || ''), name: String(v.name || 'Santri Fulan') }
  }

  async function unbindSantri(santriId: string) {
    const { $realtimeDb } = useNuxtApp()
    const cur = bySantri.value?.[santriId]?.uid
    const updates: any = {}
    if (cur) {
      updates[`alberr/rfid/bindings/${cur}`] = null
    }
    updates[`alberr/rfid/bySantri/${santriId}`] = null
    // sinkron ke data santri
    updates[`alberr/santri/${santriId}/rfid`] = ''

    const audit = push(dbRef($realtimeDb, 'alberr/rfid/audit'))
    updates[`alberr/rfid/audit/${audit.key}`] = {
      action: 'unbind',
      santriId, uid: cur || '',
      ts: serverTimestamp(),
    }

    await update(dbRef($realtimeDb), updates)
    await fetchBindings()
  }

async function bindCardToSantri(payload: {
  uid: string, santriId: string, name: string, maskan?: string, kamar?: string, replacedFrom?: string
}) {
  const { $realtimeDb } = useNuxtApp()
  const uid = clean(payload.uid)
  const santriId = clean(payload.santriId)
  const name = clean(payload.name || 'Santri Fulan')
  if (!uid || !santriId || !name) throw new Error('UID, santriId, dan nama wajib diisi')

  const bound = await isCardBound(uid)
  if (bound && bound.santriId !== santriId) {
    throw new Error(`Kartu sudah terdaftar untuk santri lain: ${bound.name}`)
  }

  const cur = bySantri.value?.[santriId]?.uid
  const updates: any = {}

  // hapus binding lama jika replace
  if (cur && cur !== uid) {
    updates[`alberr/rfid/bindings/${cur}`] = null
  }

  // rakit payload binding TANPA undefined
  const binding: any = {
    santriId,
    name,
    maskan: clean(payload.maskan),
    kamar:  clean(payload.kamar),
    createdAt: serverTimestamp(),
  }
  if (payload.replacedFrom && clean(payload.replacedFrom)) {
    binding.replacedFrom = clean(payload.replacedFrom)   // hanya saat ada
    // jika ingin kosong eksplisit, alternatif: binding.replacedFrom = null
  }

  updates[`alberr/rfid/bindings/${uid}`] = binding
  updates[`alberr/rfid/bySantri/${santriId}`] = { uid, createdAt: serverTimestamp() }

  // sinkron juga ke data santri
  updates[`alberr/santri/${santriId}/rfid`] = uid

  // audit
  const audit = push(dbRef($realtimeDb, 'alberr/rfid/audit'))
  updates[`alberr/rfid/audit/${audit.key}`] = {
    action: cur && cur !== uid ? 'replace' : 'bind',
    santriId, uid, prevUid: cur || '',
    ts: serverTimestamp(),
  }

  await update(dbRef($realtimeDb), updates)
  await fetchBindings()
}

  // Mode REGISTRASI via raw scans
  function startWaitingTap() {
    const { $realtimeDb } = useNuxtApp()
    if (unsubInbox) unsubInbox()
    waiting.value = true
    lastTap.value = null
    startedAt = Date.now() - 2000

    const q = query(dbRef($realtimeDb, 'alberr/rfid/scans'), limitToLast(50))
    const off = onChildAdded(q, (snap) => {
      if (!waiting.value) return
      const v = snap.val() || {}
      const ts = Number(v.ts || Date.now())
      const uid = clean(v.uid)
      const mode = String(v.mode || '')
      if (!uid) return
      if (ts < startedAt) return
      if (mode && mode !== 'Registrasi') return
      lastTap.value = { uid, deviceId: clean(v.deviceId), ts }
      playToneOnce()
    })
    unsubInbox = () => off()
    return unsubInbox
  }
  function stopWaitingTap() {
    waiting.value = false
    lastTap.value = null
    if (unsubInbox) { unsubInbox(); unsubInbox = null }
  }

  // Live singleton dari MODE_REG_RFID → /alberr/rfid/live { rfid, timestamp }
  const live = vRef<RfidLive | null>(null)
  let unsubLive: null | (() => void) = null
  function subscribeLive() {
    const { $realtimeDb } = useNuxtApp()
    if (unsubLive) unsubLive()
    const liveRef = dbRef($realtimeDb, 'alberr/rfid/live')
    const off = onValue(liveRef, (snap) => {
      const v = snap.val()
      if (v && v.rfid) {
        live.value = { rfid: String(v.rfid), timestamp: v.timestamp }
        playToneOnce()
      } else {
        live.value = null
      }
    })
    unsubLive = () => off()
    return unsubLive
  }
  async function clearLive() {
    const { $realtimeDb } = useNuxtApp()
    await set(dbRef($realtimeDb, 'alberr/rfid/live'), null)
    live.value = null
  }
  function unsubscribeLive() {
    if (unsubLive) { unsubLive(); unsubLive = null }
  }

  return {
    loading, error, bySantri, byCard,
    fetchBindings, isCardBound, unbindSantri, bindCardToSantri,
    waiting, lastTap, startWaitingTap, stopWaitingTap,
    subscribeLive, unsubscribeLive, live, clearLive
  }
}
