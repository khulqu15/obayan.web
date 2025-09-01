import { ref as vRef } from 'vue'
import {
  child, get, ref as dbRef, push, set, update, remove,
  onChildAdded, serverTimestamp, query, limitToLast,
  onValue
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

export type RfidInboxEvent = {
  uid: string
  deviceId?: string
  ts?: number
}

export type RfidLive = {
  rfid: string
  timestamp: string
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
    return { santriId: String(v.santriId || ''), name: String(v.name || '') }
  }

  async function unbindSantri(santriId: string) {
    const { $realtimeDb } = useNuxtApp()
    const cur = bySantri.value?.[santriId]?.uid
    const updates: any = {}
    if (cur) updates[`alberr/rfid/bindings/${cur}`] = null
    updates[`alberr/rfid/bySantri/${santriId}`] = null
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
    const name = clean(payload.name)
    if (!uid || !santriId || !name) throw new Error('UID, santriId, dan nama wajib diisi')

    const bound = await isCardBound(uid)
    if (bound && bound.santriId !== santriId) {
      throw new Error(`Kartu sudah terdaftar untuk santri lain: ${bound.name}`)
    }

    const cur = bySantri.value?.[santriId]?.uid
    const updates: any = {}
    if (cur && cur !== uid) {
      updates[`alberr/rfid/bindings/${cur}`] = null
    }

    updates[`alberr/rfid/bindings/${uid}`] = {
      santriId, name, maskan: clean(payload.maskan), kamar: clean(payload.kamar),
      createdAt: serverTimestamp(),
      replacedFrom: payload.replacedFrom ? clean(payload.replacedFrom) : undefined,
    }
    updates[`alberr/rfid/bySantri/${santriId}`] = { uid, createdAt: serverTimestamp() }

    const audit = push(dbRef($realtimeDb, 'alberr/rfid/audit'))
    updates[`alberr/rfid/audit/${audit.key}`] = {
      action: cur && cur !== uid ? 'replace' : 'bind',
      santriId, uid, prevUid: cur || '',
      ts: serverTimestamp(),
    }

    await update(dbRef($realtimeDb), updates)
    await fetchBindings()
  }

  function startWaitingTap() {
    const { $realtimeDb } = useNuxtApp()
    if (unsubInbox) unsubInbox()
    waiting.value = true
    lastTap.value = null
    startedAt = Date.now() - 2000
    const q = query(dbRef($realtimeDb, 'alberr/rfid/inbox'), limitToLast(30))
    const off = onChildAdded(q, async (snap) => {
      if (!waiting.value) return
      const v = snap.val() || {}
      const ts = Number(v.ts || Date.now())
      const uid = clean(v.uid)
      if (!uid) return
      if (ts < startedAt) return

      lastTap.value = { uid, deviceId: clean(v.deviceId), ts }
    })
    unsubInbox = () => off()
    return unsubInbox
  }

  function stopWaitingTap() {
    waiting.value = false
    lastTap.value = null
    if (unsubInbox) { unsubInbox(); unsubInbox = null }
  }

  const live = vRef<RfidLive | null>(null)
  let unsubLive: null | (() => void) = null

  function subscribeLive() {
    const { $realtimeDb } = useNuxtApp()
    if (unsubLive) unsubLive()
    const liveRef = dbRef($realtimeDb, 'alberr/rfid/live')
    const off = onValue(liveRef, (snap) => {
      const v = snap.val()
      if (v && v.rfid) {
        live.value = {
          rfid: String(v.rfid),
          timestamp: v.timestamp
        }
      } else {
        live.value = null
      }
    })
    unsubLive = () => off()
    return unsubLive
  }

  async function clearLive() {
    const { $realtimeDb } = useNuxtApp()
    const liveRef = dbRef($realtimeDb, 'alberr/rfid/live')
    await set(liveRef, null)
    live.value = null
  }

  function unsubscribeLive() {
    if (unsubLive) { unsubLive(); unsubLive = null }
  }

  return {
    loading, error, bySantri, byCard,
    fetchBindings, isCardBound, unbindSantri, bindCardToSantri,
    waiting, lastTap, startWaitingTap, stopWaitingTap, subscribeLive, unsubscribeLive, live, clearLive
  }
}
