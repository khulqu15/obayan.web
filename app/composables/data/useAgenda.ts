import { ref, computed, onUnmounted } from 'vue'
import { useNuxtApp } from '#app'

// RTDB
import {
  ref as dref,
  query as dquery,
  orderByChild,
  startAt as dStartAt,
  endAt as dEndAt,
  onValue,
  off,
  push,
  set,
  update,
  remove,
  serverTimestamp,
  get
} from 'firebase/database'

import {
  ref as sref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'

export type AgendaItem = {
  id: string
  title: string
  desc?: string
  allDay?: boolean
  start: string
  end?: string
  startAt: number
  endAt?: number
  color?: string
  location?: string
  thumbUrl?: string
  thumbPath?: string
  createdAt?: number | { '.sv': 'timestamp' }
  updatedAt?: number | { '.sv': 'timestamp' }
}

export type CreatePayload = Omit<AgendaItem, 'id'|'startAt'|'endAt'|'createdAt'|'updatedAt'> & {
  thumbnailFile?: File | null
}
export type UpdatePayload = Partial<CreatePayload>

function toEpoch(iso?: string) {
  if (!iso) return undefined
  const d = new Date(iso)
  return isNaN(d.getTime()) ? undefined : d.getTime()
}

function monthRange(year: number, month0: number) {
  const start = new Date(year, month0, 1, 0, 0, 0, 0).getTime()
  const end   = new Date(year, month0 + 1, 1, 0, 0, 0, 0).getTime() - 1
  return { start, end }
}

export function useAgenda() {
  const nuxtApp = useNuxtApp() as any
  const { $realtimeDb, $storage } = useNuxtApp() as any
  const isClient = typeof window !== 'undefined'
  const rtdb = isClient ? nuxtApp.$realtimeDb : null
  const storage = isClient ? nuxtApp.$storage : null
  const rows   = ref<AgendaItem[]>([])
  const loading = ref(false)
  const error    = ref<unknown>(null)
  const subState = ref<{ unbound: (() => void) | null, year: number, month: number }>({ unbound: null, year: 0, month: 0 })

  function subscribeMonth(year: number, month0: number) {
    if (!isClient || !rtdb) return
    if (subState.value.unbound) { subState.value.unbound!(); subState.value.unbound = null }
    subState.value = { unbound: null, year, month: month0 }

    const { start, end } = monthRange(year, month0)

    const baseRef = dref($realtimeDb, 'alberr/agendas')
    const q = dquery(baseRef, orderByChild('startAt'), dStartAt(start), dEndAt(end))

    const handler = onValue(q, (snap) => {
      const list: AgendaItem[] = []
      snap.forEach(child => {
        const id = child.key as string
        const data = child.val() || {}
        list.push({
          id,
          title: data.title,
          desc: data.desc,
          allDay: !!data.allDay,
          start: data.start,
          end: data.end || undefined,
          startAt: Number(data.startAt) || toEpoch(data.start) || 0,
          endAt: data.endAt ? Number(data.endAt) : toEpoch(data.end),
          color: data.color,
          location: data.location,
          thumbUrl: data.thumbUrl,
          thumbPath: data.thumbPath,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        })
      })
      list.sort((a,b) => (a.startAt - b.startAt) || (a.title||'').localeCompare(b.title||''))
      rows.value = list
    }, (e) => { error.value = e })

    subState.value.unbound = () => off(q, 'value', handler as any)
  }

  onUnmounted(() => {
    if (subState.value.unbound) subState.value.unbound!()
  })

  async function uploadThumb(id: string, file: File) {
    if (!isClient || !storage || !file) return { url: '', path: '' }
    const ext = file.name?.split('.').pop() || 'jpg'
    const path = `alberr/agenda/${id}/thumb_${Date.now()}.${ext}`
    const storageRef = sref(storage, path)
    const snap = await uploadBytes(storageRef, file, { contentType: file.type || 'image/jpeg' })
    const url = await getDownloadURL(sref(storage, snap.metadata.fullPath))
    return { url, path: snap.metadata.fullPath }
  }

  async function deleteThumb(path?: string) {
    if (!isClient || !storage || !path) return
    try { await deleteObject(sref(storage, path)) } catch {}
  }

  async function createAgenda(payload: CreatePayload) {
    loading.value = true
    try {
      const startAt = toEpoch(payload.start)!
      const endAt   = toEpoch(payload.end)
      const baseRef = dref($realtimeDb, 'alberr/agendas')
      const draftRef = push(baseRef)
      const id = draftRef.key as string
      await set(draftRef, {
        title: payload.title?.trim() || 'Untitled',
        desc: payload.desc?.trim() || '',
        allDay: !!payload.allDay,
        start: payload.start,
        end: payload.end || null,
        startAt,
        endAt: endAt ?? null,
        color: payload.color || '#3b82f6',
        location: payload.location || '',
        thumbUrl: null,
        thumbPath: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      if (payload.thumbnailFile) {
        const up = await uploadThumb(id, payload.thumbnailFile)
        if (up.url) await update(draftRef, { thumbUrl: up.url, thumbPath: up.path, updatedAt: serverTimestamp() })
      }
      return id
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateAgenda(id: string, patch: UpdatePayload) {
    loading.value = true
    try {
      const nodeRef = dref($realtimeDb, `alberr/agendas/${id}`)

      let curr: any
      try { curr = (await get(nodeRef)).val() } catch {}

      const data: any = { updatedAt: serverTimestamp() }

      if (patch.title  !== undefined) data.title   = patch.title?.trim()
      if (patch.desc   !== undefined) data.desc    = patch.desc?.trim()
      if (patch.allDay !== undefined) data.allDay  = !!patch.allDay
      if (patch.start  !== undefined) {
        data.start   = patch.start
        data.startAt = toEpoch(patch.start)
      }
      if (patch.end !== undefined) {
        data.end   = patch.end || null
        data.endAt = toEpoch(patch.end) ?? null
      }
      if (patch.color    !== undefined) data.color    = patch.color
      if (patch.location !== undefined) data.location = patch.location

      if (patch.thumbnailFile) {
        if (curr?.thumbPath) await deleteThumb(curr.thumbPath)
        const up = await uploadThumb(id, patch.thumbnailFile)
        if (up.url) {
          data.thumbUrl  = up.url
          data.thumbPath = up.path
        }
      }

      await update(nodeRef, data)
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteAgenda(id: string) {
    loading.value = true
    try {
      const nodeRef = dref($realtimeDb, `alberr/agendas/${id}`)
      let curr: any
      try { curr = (await get(nodeRef)).val() } catch {}
      if (curr?.thumbPath) await deleteThumb(curr.thumbPath)
      await remove(nodeRef)
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  async function moveAgenda(id: string, toDateISO: string) {
    const curr = rows.value.find(r => r.id === id)
    if (!curr) return
    const keepTime = curr.start.includes('T') ? curr.start.slice(11, 16) : '08:00'
    const nextStart = `${toDateISO}T${keepTime}`
    await updateAgenda(id, { start: nextStart })
  }

  const byDate = computed(() => {
    const map = new Map<string, AgendaItem[]>()
    for (const a of rows.value) {
      const d = (a.start || '').slice(0, 10)
      if (!map.has(d)) map.set(d, [])
      map.get(d)!.push(a)
    }
    for (const [k, list] of map) {
      list.sort((x, y) => (x.startAt || 0) - (y.startAt || 0) || (x.title || '').localeCompare(y.title || ''))
    }
    return map
  })

  return {
    rows, byDate, loading, error,
    subscribeMonth,
    createAgenda, updateAgenda, deleteAgenda, moveAgenda
  }
}
