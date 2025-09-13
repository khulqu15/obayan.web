// composables/data/usePatience.ts
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
export type PatienceType = 'pelanggaran' | 'keteladanan'
export type PatienceCategory = 'adab' | 'kedisiplinan' | 'kebersihan' | 'ibadah' | 'akademik' | 'lainnya'
export type PatienceSeverity = 'Ringan' | 'Sedang' | 'Berat'
export type PatienceStatus = 'open' | 'review' | 'closed' | 'void'

export type PatienceEntry = {
  id: string
  santriId: string
  name: string
  type: PatienceType
  category: PatienceCategory
  severity: PatienceSeverity
  title: string
  desc?: string
  points: number                 // negatif = pengurangan, positif = apresiasi
  reportedBy?: string            // pelapor
  handledBy?: string             // penindak/pembimbing
  location?: string
  term?: string                  // misal: "2025-2026_Ganjil"
  evidenceUrl?: string | null
  evidencePath?: string | null
  status: PatienceStatus
  createdAt: number | { '.sv': 'timestamp' }
  updatedAt?: number
}

/** ===== Helpers ===== */
export function makeTermKey(yearStart?: number, semester: 'Ganjil'|'Genap' = 'Ganjil') {
  const now = new Date()
  const y = yearStart ?? (now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1)
  const ys = `${y}-${y+1}`
  return `${ys}_${semester}`
}

async function uploadEvidence(id: string, file: File) {
  const { $storage } = useNuxtApp() as any
  if (!$storage || !file) return { url: null as string | null, path: null as string | null }
  const ext = String(file.name?.split('.').pop() || 'jpg').toLowerCase()
  const path = `alberr/patience/${id}/evidence_${Date.now()}.${ext}`
  const s = sref($storage, path)
  const snap = await uploadBytes(s, file, { contentType: file.type || 'image/jpeg' })
  const url = await getDownloadURL(sref($storage, snap.metadata.fullPath))
  return { url, path: snap.metadata.fullPath }
}
async function deleteEvidence(path?: string | null) {
  const { $storage } = useNuxtApp() as any
  if (!$storage || !path) return
  try { await deleteObject(sref($storage, path)) } catch {}
}

/** ===== Main composable ===== */
export const usePatience = () => {
  const { $realtimeDb } = useNuxtApp() as any

  const loading = vRef(false)
  const error   = vRef<string|null>(null)
  const rows    = vRef<PatienceEntry[]>([])

  let _unsub: null | (() => void) = null
  function unsubscribePatience(){ if (_unsub) { _unsub(); _unsub = null } }

  function subscribePatience(opts: { limit?: number; from?: number; to?: number; term?: string } = {}) {
    const { limit = 800, from, to, term } = opts
    unsubscribePatience()
    const base = dbRef($realtimeDb, 'alberr/patience/entries')
    // Default: order by createdAt. Jika filter term, tetap pakai createdAt lalu disaring client-side.
    let qRef: any = query(base, orderByChild('createdAt'), limitToLast(limit))
    if (from !== undefined && to !== undefined) {
      qRef = query(base, orderByChild('createdAt'), startAt(from), endAt(to), limitToLast(limit))
    } else if (from !== undefined) {
      qRef = query(base, orderByChild('createdAt'), startAt(from), limitToLast(limit))
    } else if (to !== undefined) {
      qRef = query(base, orderByChild('createdAt'), endAt(to), limitToLast(limit))
    }
    const h = onValue(qRef, (snap) => {
      const arr: PatienceEntry[] = []
      snap.forEach((ch:any) => {
        const v = ch.val() || {}
        arr.push({
          id: ch.key,
          santriId: String(v.santriId || ''),
          name: String(v.name || 'Santri'),
          type: (v.type || 'pelanggaran') as PatienceType,
          category: (v.category || 'lainnya') as PatienceCategory,
          severity: (v.severity || 'Ringan') as PatienceSeverity,
          title: String(v.title || ''),
          desc: String(v.desc || ''),
          points: Number(v.points || 0),
          reportedBy: String(v.reportedBy || ''),
          handledBy: String(v.handledBy || ''),
          location: String(v.location || ''),
          term: String(v.term || ''),
          evidenceUrl: v.evidenceUrl ?? null,
          evidencePath: v.evidencePath ?? null,
          status: (v.status || 'open') as PatienceStatus,
          createdAt: v.createdAt || 0,
          updatedAt: v.updatedAt || undefined
        })
      })
      rows.value = (term ? arr.filter(x => (x.term||'') === term) : arr)
        .sort((a,b) => (b.createdAt as number) - (a.createdAt as number))
    })
    _unsub = () => off(qRef, 'value', h)
    return _unsub
  }

  async function fetchOne(id: string): Promise<PatienceEntry|null> {
    try {
      const s = await get(child(dbRef($realtimeDb), `alberr/patience/entries/${id}`))
      const v = s.val(); if (!v) return null
      return {
        id,
        santriId: String(v.santriId || ''),
        name: String(v.name || 'Santri'),
        type: (v.type || 'pelanggaran'),
        category: (v.category || 'lainnya'),
        severity: (v.severity || 'Ringan'),
        title: String(v.title || ''),
        desc: String(v.desc || ''),
        points: Number(v.points || 0),
        reportedBy: String(v.reportedBy || ''),
        handledBy: String(v.handledBy || ''),
        location: String(v.location || ''),
        term: String(v.term || ''),
        evidenceUrl: v.evidenceUrl ?? null,
        evidencePath: v.evidencePath ?? null,
        status: (v.status || 'open'),
        createdAt: v.createdAt || 0,
        updatedAt: v.updatedAt || undefined
      } as PatienceEntry
    } catch { return null }
  }

  async function createPatience(payload: Omit<PatienceEntry, 'id'|'createdAt'|'updatedAt'|'evidenceUrl'|'evidencePath'> & { evidenceFile?: File | null }) {
    loading.value = true; error.value = null
    try {
      const listRef = dbRef($realtimeDb, 'alberr/patience/entries')
      const node = push(listRef); const id = node.key as string
      let evidenceUrl: string | null = null, evidencePath: string | null = null
      if (payload.evidenceFile) {
        const up = await uploadEvidence(id, payload.evidenceFile)
        evidenceUrl = up.url; evidencePath = up.path
      }
      const p: any = {
        santriId: String(payload.santriId || ''),
        name: String(payload.name || 'Santri'),
        type: payload.type,
        category: payload.category,
        severity: payload.severity,
        title: String(payload.title || ''),
        desc: String(payload.desc || ''),
        points: Number(payload.points || 0),
        reportedBy: String(payload.reportedBy || ''),
        handledBy: String(payload.handledBy || ''),
        location: String(payload.location || ''),
        term: String(payload.term || ''),
        evidenceUrl, evidencePath,
        status: payload.status || 'open',
        createdAt: serverTimestamp()
      }
      await set(node, p)
      return id
    } catch(e:any){ error.value = e?.message ?? 'Gagal menambah entri'; throw e }
    finally { loading.value = false }
  }

  async function updatePatience(id: string, patch: Partial<Omit<PatienceEntry,'id'|'createdAt'>> & { evidenceFile?: File | null }) {
    loading.value = true; error.value = null
    try {
      const node = dbRef($realtimeDb, `alberr/patience/entries/${id}`)
      let curr:any; try { curr = (await get(node)).val() } catch {}
      const data:any = { updatedAt: Date.now() }
      if (patch.santriId !== undefined) data.santriId = String(patch.santriId || '')
      if (patch.name !== undefined) data.name = String(patch.name || 'Santri')
      if (patch.type !== undefined) data.type = patch.type
      if (patch.category !== undefined) data.category = patch.category
      if (patch.severity !== undefined) data.severity = patch.severity
      if (patch.title !== undefined) data.title = String(patch.title || '')
      if (patch.desc !== undefined) data.desc = String(patch.desc || '')
      if (patch.points !== undefined) data.points = Number(patch.points || 0)
      if (patch.reportedBy !== undefined) data.reportedBy = String(patch.reportedBy || '')
      if (patch.handledBy !== undefined) data.handledBy = String(patch.handledBy || '')
      if (patch.location !== undefined) data.location = String(patch.location || '')
      if (patch.term !== undefined) data.term = String(patch.term || '')
      if (patch.status !== undefined) data.status = patch.status
      if (patch.evidenceFile) {
        if (curr?.evidencePath) await deleteEvidence(curr.evidencePath)
        const up = await uploadEvidence(id, patch.evidenceFile)
        data.evidenceUrl = up.url; data.evidencePath = up.path
      }
      await update(node, data)
    } catch(e:any){ error.value = e?.message ?? 'Gagal mengubah entri'; throw e }
    finally { loading.value = false }
  }

  async function deletePatience(id: string) {
    loading.value = true; error.value = null
    try {
      const node = dbRef($realtimeDb, `alberr/patience/entries/${id}`)
      let curr:any; try { curr = (await get(node)).val() } catch {}
      if (curr?.evidencePath) await deleteEvidence(curr.evidencePath)
      await remove(node)
    } catch(e:any){ error.value = e?.message ?? 'Gagal menghapus entri'; throw e }
    finally { loading.value = false }
  }

  function chipStatus(s: PatienceStatus) {
    const base = 'inline-flex items-center px-2 py-0.5 text-xs rounded'
    const map: Record<PatienceStatus,string> = {
      open:   `${base} bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300`,
      review: `${base} bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300`,
      closed: `${base} bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300`,
      void:   `${base} bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300`
    }
    return map[s]
  }
  function labelStatus(s: PatienceStatus) {
    if (s==='open') return 'Terbuka'
    if (s==='review') return 'Review'
    if (s==='closed') return 'Selesai'
    return 'Void'
  }

  function labelCategory(c: PatienceCategory) {
    const map: Record<PatienceCategory,string> = {
      adab:'Adab', kedisiplinan:'Kedisiplinan', kebersihan:'Kebersihan', ibadah:'Ibadah', akademik:'Akademik', lainnya:'Lainnya'
    }
    return map[c]
  }

  return {
    // state
    loading, error, rows,
    // subs
    subscribePatience, unsubscribePatience,
    // crud
    createPatience, updatePatience, deletePatience, fetchOne,
    // labels
    chipStatus, labelStatus, labelCategory,
    // misc
    makeTermKey
  }
}
