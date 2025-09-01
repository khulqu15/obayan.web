// composables/data/useMaskan.ts
import { ref as vRef } from 'vue'
import { child, get, ref as dbRef, push, set, update, remove } from 'firebase/database'

export type Pj = {
  santriId?: string
  name?: string
  note?: string
}

export type KamarRow = {
  id: string
  number: string
  tipe?: 'Putra' | 'Putri'
  capacity?: number
  active?: boolean
  pj?: Pj                      // <<--- NEW
}

export type MaskanRow = {
  id: string
  name: string
  tipe: 'Putra' | 'Putri'
  deskripsi?: string
  pj?: Pj                      // <<--- NEW
  rooms: KamarRow[]
}

export const useMaskan = () => {
  const loading = vRef(false)
  const error = vRef<string | null>(null)
  const rows = vRef<MaskanRow[]>([])

  async function fetchMaskan() {
    loading.value = true
    error.value = null
    try {
      const { $realtimeDb } = useNuxtApp()
      const snapshot = await get(child(dbRef($realtimeDb), 'alberr/maskan'))
      const val = snapshot.val() || {}

      const arr: MaskanRow[] = Object.entries(val).map(([id, v]: any) => {
        const roomsObj = v.rooms || {}
        const rooms: KamarRow[] = Object.entries(roomsObj).map(([rid, r]: any) => ({
          id: rid,
          number: String(r.number ?? ''),
          tipe: (r.tipe ?? v.tipe) as any,
          capacity: Number(r.capacity ?? 0),
          active: r.active !== false,
          pj: r.pj
            ? { santriId: r.pj.santriId || '', name: r.pj.name || '', note: r.pj.note || '' }
            : { santriId: r.pjId || '', name: r.pjName || '', note: r.pjNote || '' } // backward compat
        })).sort((a, b) => {
          const na = Number(a.number), nb = Number(b.number)
          if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
          return a.number.localeCompare(b.number, 'id')
        })

        return {
          id,
          name: String(v.name ?? ''),
          tipe: (v.tipe ?? 'Putra') as any,
          deskripsi: String(v.deskripsi ?? ''),
          pj: v.pj
            ? { santriId: v.pj.santriId || '', name: v.pj.name || '', note: v.pj.note || '' }
            : { santriId: v.pjId || '', name: v.pjName || '', note: v.pjNote || '' },
          rooms,
        }
      }).sort((a, b) => a.name.localeCompare(b.name, 'id'))

      rows.value = arr
    } catch (e: any) {
      console.error(e)
      error.value = e?.message ?? 'Gagal memuat maskan'
    } finally {
      loading.value = false
    }
  }

  async function createMaskan(payload: Omit<MaskanRow, 'id' | 'rooms'>) {
    const { $realtimeDb } = useNuxtApp()
    const listRef = dbRef($realtimeDb, 'alberr/maskan')
    const newRef = push(listRef)
    const data: any = {
      name: payload.name.trim(),
      tipe: payload.tipe,
      deskripsi: payload.deskripsi ?? '',
    }
    if (payload.pj) data.pj = normalizePj(payload.pj)
    await set(newRef, data)
    await fetchMaskan()
    return newRef.key
  }

  async function updateMaskan(id: string, payload: Partial<Omit<MaskanRow, 'id' | 'rooms'>>) {
    const { $realtimeDb } = useNuxtApp()
    const node = dbRef($realtimeDb, `alberr/maskan/${id}`)
    const data: any = {}
    if (payload.name !== undefined) data.name = payload.name
    if (payload.tipe !== undefined) data.tipe = payload.tipe
    if (payload.deskripsi !== undefined) data.deskripsi = payload.deskripsi
    if ('pj' in payload) data.pj = normalizePj(payload.pj ?? null)
    await update(node, data)
    await fetchMaskan()
  }

  async function deleteMaskan(id: string) {
    const { $realtimeDb } = useNuxtApp()
    await remove(dbRef($realtimeDb, `alberr/maskan/${id}`))
    await fetchMaskan()
  }

  function normalizePj(pj?: Pj | null): Pj | null {
    if (pj == null) return null
    return {
        santriId: pj.santriId ?? '',
        name: pj.name ?? '',
        note: pj.note ?? '',
    }
  }

  async function createRoom(maskanId: string, payload: Omit<KamarRow, 'id'>) {
    const { $realtimeDb } = useNuxtApp()
    const listRef = dbRef($realtimeDb, `alberr/maskan/${maskanId}/rooms`)
    const newRef = push(listRef)
    const data: any = {
      number: String(payload.number ?? '').trim(),
      tipe: payload.tipe ?? undefined,
      capacity: Number(payload.capacity ?? 0),
      active: payload.active !== false,
    }
    if (payload.pj) data.pj = normalizePj(payload.pj)
    await set(newRef, data)
    await fetchMaskan()
    return newRef.key
  }

  async function updateRoom(maskanId: string, roomId: string, payload: Partial<Omit<KamarRow, 'id'>>) {
    const { $realtimeDb } = useNuxtApp()
    const node = dbRef($realtimeDb, `alberr/maskan/${maskanId}/rooms/${roomId}`)
    const data: any = {}
    if (payload.number !== undefined) data.number = String(payload.number).trim()
    if (payload.tipe !== undefined) data.tipe = payload.tipe
    if (payload.capacity !== undefined) data.capacity = Number(payload.capacity)
    if (payload.active !== undefined) data.active = !!payload.active
    if ('pj' in payload) data.pj = normalizePj(payload.pj ?? null)
    await update(node, data)
    await fetchMaskan()
  }

  async function deleteRoom(maskanId: string, roomId: string) {
    const { $realtimeDb } = useNuxtApp()
    await remove(dbRef($realtimeDb, `alberr/maskan/${maskanId}/rooms/${roomId}`))
    await fetchMaskan()
  }

  async function batchGenerateRooms(maskanId: string, start: number, end: number, opts?: { prefix?: string; capacity?: number; active?: boolean; tipeInherit?: boolean }) {
    const m = rows.value.find(x => x.id === maskanId)
    if (!m) return
    const existSet = new Set(m.rooms.map(r => (r.number ?? '').toString().trim()))
    const { prefix = '', capacity = 0, active = true } = opts || {}

    for (let i = start; i <= end; i++) {
      const numStr = `${prefix}${i}`
      if (existSet.has(numStr)) continue
      await createRoom(maskanId, { number: numStr, capacity, active, tipe: m.tipe })
    }
  }

  return {
    rows, loading, error,
    fetchMaskan, createMaskan, updateMaskan, deleteMaskan,
    createRoom, updateRoom, deleteRoom, batchGenerateRooms,
  }
}
