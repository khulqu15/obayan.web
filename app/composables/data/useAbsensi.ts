// composables/data/useAbsensi.ts
import { ref as vRef, computed } from 'vue'
import {
  child, get, ref as dbRef, push, set, update, remove,
  onChildAdded, onValue, query, limitToLast, serverTimestamp
} from 'firebase/database'

export type AbsensiSettings = {
  resetTimes?: string[]
  resetTime?: string
  lastResetAt?: number
  lastResetKey?: string
}

export type CurrentEntry = {
  name: string
  santriId?: string
  maskan?: string
  kamar?: string
  by?: string
  ts?: number
}

export type LiveEvent = {
  id: string
  name: string
  santriId?: string
  maskan?: string
  kamar?: string
  deviceId?: string
  by?: string
  ts?: number
}

export type HistorySessionMeta = {
  startedAt?: number
  endedAt?: number
  resetBy?: string
  total?: number
}
export type HistorySession = {
  id: string
  meta: HistorySessionMeta
}

export const useAbsensi = () => {
  const loading = vRef(false)
  const error = vRef<string|null>(null)
  const history = vRef<HistorySession[]>([])

  const current = vRef<Record<string, CurrentEntry>>({})
  const live = vRef<LiveEvent[]>([])
  const settings = vRef<AbsensiSettings>({})
  const currentCount = computed(() => Object.keys(current.value || {}).length)

  function dayKey(dateStr: string) {
    const s = `${dateStr}_00-00`
    const e = `${dateStr}_23-59`
    return { start: s, end: e }
  }

  async function fetchHistory(options?: { limit?: number; date?: string }) {
    const { $realtimeDb } = useNuxtApp()
    const base = dbRef($realtimeDb, 'alberr/absensi/history')
    const lim = options?.limit ?? 30
    const q = query(base, limitToLast(lim))
    const snap = await get(q)
    const val = snap.val() || {}

    let arr: HistorySession[] = Object.entries<any>(val).map(([id, v]) => ({
      id,
      meta: {
        startedAt: Number(v?.meta?.startedAt || 0),
        endedAt: Number(v?.meta?.endedAt || 0),
        resetBy: String(v?.meta?.resetBy || ''),
        total: Number(v?.meta?.total || 0),
      }
    }))
    arr.sort((a,b) => (a.id > b.id ? -1 : 1))
    if (options?.date) {
      const { start, end } = dayKey(options.date)
      arr = arr.filter(s => s.id >= start && s.id <= end)
    }

    history.value = arr
  }

  async function readHistorySession(sessionId: string) {
    const { $realtimeDb } = useNuxtApp()
    const snap = await get(child(dbRef($realtimeDb), `alberr/absensi/history/${sessionId}/members`))
    return snap.val() || {}
  }

  async function fetchCurrent() {
    loading.value = true
    error.value = null
    try {
      const { $realtimeDb } = useNuxtApp()
      const snap = await get(child(dbRef($realtimeDb), 'alberr/absensi/current'))
      current.value = snap.val() || {}
    } catch (e:any) {
      console.error(e)
      error.value = e?.message ?? 'Gagal memuat absensi'
    } finally {
      loading.value = false
    }
  }

  
  async function fetchSettings() {
    const { $realtimeDb } = useNuxtApp()
    const snap = await get(child(dbRef($realtimeDb), 'alberr/absensi/settings'))
    const val = snap.val() || {}

    const timesFromDb = objToArrayMaybe(val.resetTimes)
    const single      = val.resetTime ? [String(val.resetTime)] : []
    const times       = normalizeTimes([...timesFromDb, ...single])

    settings.value = {
        resetTimes: times,
        resetTime: val.resetTime ? String(val.resetTime) : '',
        lastResetAt: Number(val.lastResetAt || 0),
        lastResetKey: String(val.lastResetKey || ''),
    }
    }

  function objToArrayMaybe(o: any): string[] {
    if (!o) return []
    if (Array.isArray(o)) return o as string[]
    if (typeof o === 'object') {
        return Object.keys(o)
        .filter(k => /^\d+$/.test(k))
        .sort((a,b) => Number(a) - Number(b))
        .map(k => String(o[k]))
    }
    return []
    }
    function normalizeTimes(list: string[]): string[] {
    const seen = new Set<string>()
    const out: string[] = []
    for (const t of list) {
        const m = String(t ?? '').trim()
        if (!/^\d{2}:\d{2}$/.test(m)) continue
        const [h, mm] = m.split(':').map(Number)
        if (h! > 23 || mm! > 59) continue
        const key = `${String(h).padStart(2,'0')}:${String(mm).padStart(2,'0')}`
        if (!seen.has(key)) { seen.add(key); out.push(key) }
    }
    return out.sort()
    }

  async function saveSettings(patch: Partial<AbsensiSettings>) {
    const { $realtimeDb } = useNuxtApp()
    const node = dbRef($realtimeDb, 'alberr/absensi/settings')
    const payload:any = {}

    if (patch.resetTimes !== undefined) {
      payload.resetTimes = normalizeTimes(patch.resetTimes || [])
    }
    if (patch.resetTime !== undefined) {
      payload.resetTime = String(patch.resetTime || '')
    }
    if (patch.lastResetAt !== undefined) payload.lastResetAt = Number(patch.lastResetAt) || 0
    if (patch.lastResetKey !== undefined) payload.lastResetKey = String(patch.lastResetKey || '')

    await update(node, payload)
    await fetchSettings()
  }

  let unsubLive: (()=>void)|null = null
  function subscribeLive(limit = 30) {
    const { $realtimeDb } = useNuxtApp()
    const q = query(dbRef($realtimeDb, 'alberr/absensi/live'), limitToLast(limit))
    live.value = []
    if (unsubLive) unsubLive()
    const offs: Array<() => void> = []
    offs.push(onChildAdded(q, (snap) => {
      const v = snap.val() || {}
      const e: LiveEvent = {
        id: snap.key || '',
        name: String(v.name ?? ''),
        santriId: v.santriId || '',
        maskan: v.maskan || '',
        kamar: v.kamar || '',
        deviceId: v.deviceId || '',
        by: v.by || '',
        ts: typeof v.ts === 'number' ? v.ts : Date.now(),
      }
      live.value = [...live.value, e].slice(-limit)
    }))
    offs.push(onValue(dbRef($realtimeDb, 'alberr/absensi/current'), (snap) => {
      current.value = snap.val() || {}
    }))
    unsubLive = () => offs.forEach(fn => fn && fn())
    return unsubLive
  }

  async function markPresentBySantriId(santriId: string, name: string, extra?: { maskan?: string; kamar?: string; deviceId?: string }) {
    const { $realtimeDb } = useNuxtApp()
    const curNode = dbRef($realtimeDb, `alberr/absensi/current/${santriId}`)
    await set(curNode, {
      name, santriId,
      maskan: extra?.maskan || '',
      kamar: extra?.kamar || '',
      by: extra?.deviceId ? `rfid:${extra.deviceId}` : 'manual',
      ts: serverTimestamp(),
    })
    const liveNode = push(dbRef($realtimeDb, 'alberr/absensi/live'))
    await set(liveNode, {
      name, santriId,
      maskan: extra?.maskan || '',
      kamar: extra?.kamar || '',
      deviceId: extra?.deviceId || '',
      by: extra?.deviceId ? 'rfid' : 'manual',
      ts: serverTimestamp(),
    })
  }

  async function markPresentManual(name: string, extra?: { maskan?: string; kamar?: string; deviceId?: string }) {
    const { $realtimeDb } = useNuxtApp()
    const tmpRef = push(dbRef($realtimeDb, 'alberr/absensi/_keys'))
    const key = tmpRef.key!
    await remove(tmpRef)
    const curKey = `manual:${key}`
    await set(dbRef($realtimeDb, `alberr/absensi/current/${curKey}`), {
      name,
      maskan: extra?.maskan || '',
      kamar: extra?.kamar || '',
      by: extra?.deviceId ? `rfid:${extra.deviceId}` : 'manual',
      ts: serverTimestamp(),
    })
    const liveNode = push(dbRef($realtimeDb, 'alberr/absensi/live'))
    await set(liveNode, {
      name,
      maskan: extra?.maskan || '',
      kamar: extra?.kamar || '',
      deviceId: extra?.deviceId || '',
      by: extra?.deviceId ? 'rfid' : 'manual',
      ts: serverTimestamp(),
    })
  }

  async function resetSession(options?: { resetBy?: string }) {
    const { $realtimeDb } = useNuxtApp()
    const snap = await get(child(dbRef($realtimeDb), 'alberr/absensi/current'))
    const cur = snap.val() || {}
    const now = new Date()
    const pad = (n:number)=> String(n).padStart(2,'0')
    const sessionId = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`
    await set(dbRef($realtimeDb, `alberr/absensi/history/${sessionId}`), {
      meta: {
        startedAt: settings.value.lastResetAt || 0,
        endedAt: Date.now(),
        resetBy: options?.resetBy || 'manual',
        total: Object.keys(cur).length,
      },
      members: cur,
    })
    await remove(dbRef($realtimeDb, 'alberr/absensi/current'))

    const key = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}|${pad(now.getHours())}:${pad(now.getMinutes())}`
    await saveSettings({ lastResetAt: Date.now(), lastResetKey: key })
  }

  function shouldResetNow() {
    const list = normalizeTimes(settings.value.resetTimes || (settings.value.resetTime ? [settings.value.resetTime] : []))
    if (!list.length) return false
    const now = new Date()
    const HH = String(now.getHours()).padStart(2,'0')
    const MM = String(now.getMinutes()).padStart(2,'0')
    const hhmm = `${HH}:${MM}`
    if (!list.includes(hhmm)) return false

    const key = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}|${hhmm}`
    if (settings.value.lastResetKey === key) return false
    return true
  }

  return {
    loading, error, current, live, settings, currentCount,
    fetchCurrent, fetchSettings, saveSettings, subscribeLive,
    markPresentBySantriId, markPresentManual, resetSession,
    shouldResetNow, history, fetchHistory, readHistorySession,
  }
}
