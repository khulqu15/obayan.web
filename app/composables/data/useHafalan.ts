// composables/data/useHafalan.ts
import { ref as vRef } from 'vue'
import { useNuxtApp } from '#app'
import {
  ref as dbRef, push, set, update, remove, get, child,
  onValue, off, query, orderByChild, startAt, endAt, limitToLast, serverTimestamp
} from 'firebase/database'
import {
  ref as sref, uploadBytes, getDownloadURL, deleteObject
} from 'firebase/storage'

/** ===== Types ===== */
export type HafalanType = 'alquran' | 'kitab' | 'pelajaran'
export type HafalanStatus = 'pending'|'accepted'|'rejected'|'revisi'

export type HafalanMetaQuran = { surah: string; ayatFrom: number; ayatTo: number; juz?: number; halaman?: number }
export type HafalanMetaKitab = { kitab: string; bab?: string; halamanFrom?: number; halamanTo?: number }
export type HafalanMetaPelajaran = { mapel: string; materi: string; submateri?: string; halaman?: string }

export type HafalanEntry = {
  id: string
  santriId: string
  name: string
  type: HafalanType
  meta: HafalanMetaQuran | HafalanMetaKitab | HafalanMetaPelajaran
  score?: number
  predikat?: 'A'|'B'|'C'|'D'|'E'
  note?: string
  status: HafalanStatus
  evaluator?: string
  audioUrl?: string | null
  audioPath?: string | null
  submittedAt: number | { '.sv': 'timestamp' }
  checkedAt?: number
}

export type CreateHafalanPayload = Omit<HafalanEntry,'id'|'submittedAt'|'audioUrl'|'audioPath'|'predikat'> & { audioFile?: File|null }
export type UpdateHafalanPayload = Partial<Omit<CreateHafalanPayload,'santriId'|'name'|'type'|'meta'>> & {
  meta?: Partial<HafalanEntry['meta']>
}

function predFromScore(score?: number): HafalanEntry['predikat'] {
  const n = Number(score ?? 0)
  if (n >= 92) return 'A'
  if (n >= 83) return 'B'
  if (n >= 75) return 'C'
  if (n >= 65) return 'D'
  return 'E'
}

/** ===== Storage helpers ===== */
async function uploadAudio(id: string, file: File) {
  const nuxt = useNuxtApp() as any
  const { $storage } = nuxt
  if (!$storage || !file) return { url: null as string|null, path: null as string|null }
  const ext = file.name?.split('.').pop() || 'mp3'
  const path = `alberr/hafalan/${id}/audio_${Date.now()}.${ext}`
  const s = sref($storage, path)
  const snap = await uploadBytes(s, file, { contentType: file.type || 'audio/mpeg' })
  const url = await getDownloadURL(sref($storage, snap.metadata.fullPath))
  return { url, path: snap.metadata.fullPath }
}
async function deleteAudio(path?: string|null) {
  const nuxt = useNuxtApp() as any
  const { $storage } = nuxt
  if (!$storage || !path) return
  try { await deleteObject(sref($storage, path)) } catch {}
}

/** ===== Main composable ===== */
export const useHafalan = () => {
  const nuxt = useNuxtApp() as any
  const { $realtimeDb } = nuxt

  const loading = vRef(false)
  const error   = vRef<string|null>(null)
  const rows    = vRef<HafalanEntry[]>([])

  // Live subscription (order by submittedAt with optional window)
  let _unsub: null | (()=>void) = null
  function unsubscribeHafalan(){ if (_unsub) { _unsub(); _unsub = null } }

  function subscribeHafalan(opts: { limit?: number; from?: number; to?: number } = {}) {
    const { limit = 800, from, to } = opts
    unsubscribeHafalan()
    const base = dbRef($realtimeDb, 'alberr/hafalan/entries')
    let qRef: any = query(base, orderByChild('submittedAt'), limitToLast(limit))
    if (from !== undefined && to !== undefined) {
      qRef = query(base, orderByChild('submittedAt'), startAt(from), endAt(to), limitToLast(limit))
    } else if (from !== undefined) {
      qRef = query(base, orderByChild('submittedAt'), startAt(from), limitToLast(limit))
    } else if (to !== undefined) {
      qRef = query(base, orderByChild('submittedAt'), endAt(to), limitToLast(limit))
    }
    const h = onValue(qRef, (snap) => {
      const arr: HafalanEntry[] = []
      snap.forEach((ch:any) => {
        const v = ch.val() || {}
        arr.push({
          id: ch.key,
          santriId: String(v.santriId || ''),
          name: String(v.name || 'Santri'),
          type: v.type as HafalanType,
          meta: v.meta || {},
          score: v.score ?? undefined,
          predikat: v.predikat ?? predFromScore(v.score),
          note: String(v.note || ''),
          status: (v.status || 'pending') as HafalanStatus,
          evaluator: String(v.evaluator || ''),
          audioUrl: v.audioUrl ?? null,
          audioPath: v.audioPath ?? null,
          submittedAt: v.submittedAt || 0,
          checkedAt: v.checkedAt || undefined
        })
      })
      rows.value = arr.sort((a,b) => (b.submittedAt as number) - (a.submittedAt as number))
    })
    _unsub = () => off(qRef, 'value', h)
    return _unsub
  }

  async function fetchOne(id: string): Promise<HafalanEntry|null> {
    try {
      const snap = await get(child(dbRef($realtimeDb), `alberr/hafalan/entries/${id}`))
      const v = snap.val()
      if (!v) return null
      return {
        id,
        santriId: String(v.santriId || ''),
        name: String(v.name || 'Santri'),
        type: v.type as HafalanType,
        meta: v.meta || {},
        score: v.score ?? undefined,
        predikat: v.predikat ?? predFromScore(v.score),
        note: String(v.note || ''),
        status: (v.status || 'pending') as HafalanStatus,
        evaluator: String(v.evaluator || ''),
        audioUrl: v.audioUrl ?? null,
        audioPath: v.audioPath ?? null,
        submittedAt: v.submittedAt || 0,
        checkedAt: v.checkedAt || undefined
      }
    } catch { return null }
  }

  async function createHafalan(payload: CreateHafalanPayload) {
    loading.value = true; error.value = null
    try {
      const listRef = dbRef($realtimeDb, 'alberr/hafalan/entries')
      const node = push(listRef)
      const id = node.key as string
      let audioUrl: string|null = null, audioPath: string|null = null
      if (payload.audioFile) {
        const up = await uploadAudio(id, payload.audioFile)
        audioUrl = up.url; audioPath = up.path
      }
      const p: any = {
        santriId: String(payload.santriId || ''),
        name: String(payload.name || 'Santri'),
        type: payload.type,
        meta: payload.meta || {},
        score: payload.score ?? null,
        predikat: predFromScore(payload.score),
        note: String(payload.note || ''),
        status: (payload.status || 'pending') as HafalanStatus,
        evaluator: String(payload.evaluator || ''),
        audioUrl, audioPath,
        submittedAt: serverTimestamp()
      }
      await set(node, p)
      return id
    } catch (e:any) { error.value = e?.message ?? 'Gagal menambah hafalan'; throw e }
    finally { loading.value = false }
  }

  async function updateHafalan(id: string, patch: UpdateHafalanPayload) {
    loading.value = true; error.value = null
    try {
      const node = dbRef($realtimeDb, `alberr/hafalan/entries/${id}`)
      let curr: any
      try { curr = (await get(node)).val() } catch {}
      const data:any = {}
      if (patch.meta !== undefined) data.meta = { ...(curr?.meta||{}), ...(patch.meta||{}) }
      if (patch.score !== undefined) { data.score = Number(patch.score); data.predikat = predFromScore(patch.score) }
      if (patch.note !== undefined) data.note = String(patch.note||'')
      if (patch.status !== undefined) { data.status = patch.status; if (patch.status !== 'pending') data.checkedAt = Date.now() }
      if (patch.evaluator !== undefined) data.evaluator = String(patch.evaluator || '')
      if (patch.audioFile) {
        if (curr?.audioPath) await deleteAudio(curr.audioPath)
        const up = await uploadAudio(id, patch.audioFile)
        data.audioUrl = up.url; data.audioPath = up.path
      }
      await update(node, data)
    } catch (e:any) { error.value = e?.message ?? 'Gagal mengubah hafalan'; throw e }
    finally { loading.value = false }
  }

  async function deleteHafalan(id: string) {
    loading.value = true; error.value = null
    try {
      const node = dbRef($realtimeDb, `alberr/hafalan/entries/${id}`)
      let curr:any; try { curr = (await get(node)).val() } catch {}
      if (curr?.audioPath) await deleteAudio(curr.audioPath)
      await remove(node)
    } catch (e:any) { error.value = e?.message ?? 'Gagal menghapus'; throw e }
    finally { loading.value = false }
  }

  async function setStatus(id: string, status: HafalanStatus, opts?: { evaluator?: string; score?: number; note?: string }) {
    const patch: UpdateHafalanPayload = { status, evaluator: opts?.evaluator, score: opts?.score, note: opts?.note }
    await updateHafalan(id, patch)
  }

  function materialLabel(e: HafalanEntry) {
    if (e.type === 'alquran') {
      const m = e.meta as HafalanMetaQuran
      const ay = (m.ayatFrom && m.ayatTo) ? `${m.ayatFrom}-${m.ayatTo}` : (m.ayatFrom||m.ayatTo||'')
      const extra = m.juz ? ` • Juz ${m.juz}` : (m.halaman ? ` • Hal ${m.halaman}` : '')
      return `${m.surah || 'Surah ?'} ${ay ? 'Ayat '+ay : ''}${extra}`
    }
    if (e.type === 'kitab') {
      const m = e.meta as HafalanMetaKitab
      const hal = (m.halamanFrom && m.halamanTo) ? `Hal ${m.halamanFrom}-${m.halamanTo}` : ''
      return `${m.kitab || 'Kitab ?'} ${m.bab ? ' • Bab '+m.bab : ''} ${hal}`
    }
    const m = e.meta as HafalanMetaPelajaran
    return `${m.mapel || 'Mapel ?'} • ${m.materi || '-'} ${m.submateri ? ' — '+m.submateri : ''}`
  }

  return {
    loading, error, rows,
    subscribeHafalan, unsubscribeHafalan, fetchOne,
    createHafalan, updateHafalan, deleteHafalan, setStatus,
    materialLabel
  }
}
