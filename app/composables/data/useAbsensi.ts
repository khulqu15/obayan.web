import { ref as vRef, computed } from 'vue'
import {
  child, get, ref as dbRef, push, set, update, remove,
  onChildAdded, onValue, query, limitToLast, serverTimestamp
} from 'firebase/database'

export type AbsensiSettings = { resetTimes?: string[]; resetTime?: string; lastResetAt?: number; lastResetKey?: string }
export type CurrentEntry = { name: string; santriId?: string; maskan?: string; kamar?: string; by?: string; ts?: number }
export type LiveEvent = {
  id: string; uid?: string; name: string; santriId?: string; maskan?: string; kamar?: string; deviceId?: string; by?: string; ts?: number
}

let _toneEl: HTMLAudioElement | null = null
function playToneOnce() {
  if (typeof Audio === 'undefined') return
  try { if (!_toneEl) { _toneEl = new Audio('/tone.mp3'); _toneEl.preload = 'auto' }
    _toneEl.currentTime = 0; void _toneEl.play().catch(() => {}) } catch {}
}

export const useAbsensi = () => {
  const loading = vRef(false)
  const error = vRef<string|null>(null)
  const history = vRef<{ id:string; meta:any }[]>([])

  const current = vRef<Record<string, CurrentEntry>>({})
  const live = vRef<LiveEvent[]>([])
  const settings = vRef<AbsensiSettings>({})
  const currentCount = computed(() => Object.keys(current.value || {}).length)

  function objToArrayMaybe(o: any): string[] {
    if (!o) return []; if (Array.isArray(o)) return o as string[]
    if (typeof o === 'object') { return Object.keys(o).filter(k => /^\d+$/.test(k)).sort((a,b)=>+a-+b).map(k=>String(o[k])) }
    return []
  }
  function normalizeTimes(list: string[]): string[] {
    const seen = new Set<string>(), out: string[] = []
    for (const t of list) {
      const m = String(t ?? '').trim(); if (!/^\d{2}:\d{2}$/.test(m)) continue
      const [h, mm] = m.split(':').map(Number); if (h! > 23 || mm! > 59) continue
      const key = `${String(h).padStart(2,'0')}:${String(mm).padStart(2,'0')}`; if (!seen.has(key)) { seen.add(key); out.push(key) }
    }
    return out.sort()
  }

  async function fetchSettings() {
    const { $realtimeDb } = useNuxtApp()
    const snap = await get(child(dbRef($realtimeDb), 'alberr/absensi/settings'))
    const val = snap.val() || {}
    const times = normalizeTimes([...objToArrayMaybe(val.resetTimes), ...(val.resetTime ? [String(val.resetTime)] : [])])
    settings.value = { resetTimes: times, resetTime: val.resetTime ? String(val.resetTime) : '', lastResetAt: +val.lastResetAt || 0, lastResetKey: String(val.lastResetKey || '') }
  }
  async function saveSettings(patch: Partial<AbsensiSettings>) {
    const { $realtimeDb } = useNuxtApp()
    const node = dbRef($realtimeDb, 'alberr/absensi/settings'); const p:any = {}
    if (patch.resetTimes !== undefined) p.resetTimes = normalizeTimes(patch.resetTimes || [])
    if (patch.resetTime !== undefined) p.resetTime = String(patch.resetTime || '')
    if (patch.lastResetAt !== undefined) p.lastResetAt = Number(patch.lastResetAt) || 0
    if (patch.lastResetKey !== undefined) p.lastResetKey = String(patch.lastResetKey || '')
    await update(node, p); await fetchSettings()
  }

  async function fetchCurrent() {
    loading.value = true; error.value = null
    try {
      const { $realtimeDb } = useNuxtApp()
      const snap = await get(child(dbRef($realtimeDb), 'alberr/absensi/current'))
      current.value = snap.val() || {}
    } catch (e:any) { console.error(e); error.value = e?.message ?? 'Gagal memuat absensi' }
    finally { loading.value = false }
  }

  // resolve UID -> binding
  async function resolveByUID(uid?: string) {
    if (!uid) return null
    const { $realtimeDb } = useNuxtApp()
    try {
      const s = await get(child(dbRef($realtimeDb), `alberr/rfid/bindings/${uid}`))
      const v = s.val(); if (!v) return null
      return { santriId: String(v.santriId || ''), name: String(v.name || 'Santri Fulan'), maskan: String(v.maskan || ''), kamar: String(v.kamar || '') }
    } catch { return null }
  }

  // LIVE
  let unsubLive: (()=>void)|null = null
  function subscribeLive(limit = 30) {
    const { $realtimeDb } = useNuxtApp()
    const q = query(dbRef($realtimeDb, 'alberr/absensi/live'), limitToLast(limit))
    live.value = []
    if (unsubLive) unsubLive()
    const offs: Array<() => void> = []

    offs.push(onChildAdded(q, async (snap) => {
      const v = snap.val() || {}
      const uid = String(v.uid || '')
      let e: LiveEvent = {
        id: snap.key || '',
        uid,
        name: String(v.name || 'Santri Fulan'),
        santriId: String(v.santriId || ''),
        maskan: String(v.maskan || ''),
        kamar: String(v.kamar || ''),
        deviceId: String(v.deviceId || ''),
        by: String(v.by || 'rfid'),
        ts: typeof v.ts === 'number' ? v.ts : Date.now(),
      }
      live.value = [...live.value, e].slice(-limit)
      playToneOnce()
      if ((!v.name || !v.santriId) && uid) {
        const r = await resolveByUID(uid)
        if (r) { e = { ...e, ...r }; live.value = live.value.map(x => x.id === e.id ? e : x) }
      }
    }))

    offs.push(onValue(dbRef($realtimeDb, 'alberr/absensi/current'), (snap) => {
      current.value = snap.val() || {}
    }))

    unsubLive = () => offs.forEach(fn => fn && fn()); return unsubLive
  }

  async function markPresentBySantriId(santriId: string, name: string, extra?: { maskan?: string; kamar?: string; deviceId?: string }) {
    const { $realtimeDb } = useNuxtApp()
    await set(dbRef($realtimeDb, `alberr/absensi/current/${santriId}`), {
      name, santriId, maskan: extra?.maskan || '', kamar: extra?.kamar || '', by: extra?.deviceId ? `rfid:${extra.deviceId}` : 'manual', ts: serverTimestamp(),
    })
    const liveNode = push(dbRef($realtimeDb, 'alberr/absensi/live'))
    await set(liveNode, { name, santriId, maskan: extra?.maskan || '', kamar: extra?.kamar || '', deviceId: extra?.deviceId || '', by: extra?.deviceId ? 'rfid' : 'manual', ts: serverTimestamp() })
  }
  async function markPresentManual(name: string, extra?: { maskan?: string; kamar?: string; deviceId?: string }) {
    const { $realtimeDb } = useNuxtApp()
    const tmpRef = push(dbRef($realtimeDb, 'alberr/absensi/_keys')); const key = tmpRef.key!; await remove(tmpRef)
    const curKey = `manual:${key}`
    await set(dbRef($realtimeDb, `alberr/absensi/current/${curKey}`), {
      name: name || 'Santri Fulan', maskan: extra?.maskan || '', kamar: extra?.kamar || '', by: extra?.deviceId ? `rfid:${extra.deviceId}` : 'manual', ts: serverTimestamp(),
    })
    const liveNode = push(dbRef($realtimeDb, 'alberr/absensi/live'))
    await set(liveNode, { name: name || 'Santri Fulan', maskan: extra?.maskan || '', kamar: extra?.kamar || '', deviceId: extra?.deviceId || '', by: extra?.deviceId ? 'rfid' : 'manual', ts: serverTimestamp() })
  }

  async function resetSession(options?: { resetBy?: string }) {
    const { $realtimeDb } = useNuxtApp()
    const snap = await get(child(dbRef($realtimeDb), 'alberr/absensi/current'))
    const cur = snap.val() || {}; const now = new Date(); const pad = (n:number)=> String(n).padStart(2,'0')
    const sessionId = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`
    await set(dbRef($realtimeDb, `alberr/absensi/history/${sessionId}`), { meta: { startedAt: settings.value.lastResetAt || 0, endedAt: Date.now(), resetBy: options?.resetBy || 'manual', total: Object.keys(cur).length }, members: cur })
    await remove(dbRef($realtimeDb, 'alberr/absensi/current'))
    const key = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}|${pad(now.getHours())}:${pad(now.getMinutes())}`
    await saveSettings({ lastResetAt: Date.now(), lastResetKey: key })
  }

  function shouldResetNow() {
    const list = normalizeTimes(settings.value.resetTimes || (settings.value.resetTime ? [settings.value.resetTime] : []))
    if (!list.length) return false
    const now = new Date()
    const hhmm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
    if (!list.includes(hhmm)) return false
    const key = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}|${hhmm}`
    return settings.value.lastResetKey !== key
  }

  async function fetchHistory(options?: { limit?: number; date?: string }) {
    const { $realtimeDb } = useNuxtApp()
    const base = dbRef($realtimeDb, 'alberr/absensi/history'); const lim = options?.limit ?? 30
    const q = query(base, limitToLast(lim)); const snap = await get(q); const val = snap.val() || {}
    let arr = Object.entries<any>(val).map(([id, v]) => ({ id, meta: { startedAt:+(v?.meta?.startedAt||0), endedAt:+(v?.meta?.endedAt||0), resetBy:String(v?.meta?.resetBy||''), total:+(v?.meta?.total||0) }}))
    arr.sort((a,b)=> (a.id > b.id ? -1 : 1))
    if (options?.date) {
      const s = `${options.date}_00-00`, e = `${options.date}_23-59`
      arr = arr.filter(x => x.id >= s && x.id <= e)
    }
    history.value = arr
  }
  async function readHistorySession(sessionId: string) {
    const { $realtimeDb } = useNuxtApp()
    const snap = await get(child(dbRef($realtimeDb), `alberr/absensi/history/${sessionId}/members`))
    return snap.val() || {}
  }

  return {
    loading, error, current, live, settings, currentCount,
    fetchCurrent, fetchSettings, saveSettings, subscribeLive,
    markPresentBySantriId, markPresentManual, resetSession,
    shouldResetNow, history, fetchHistory, readHistorySession,
  }
}
