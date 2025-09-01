import { ref as vRef, computed } from 'vue'
import { child, get, ref as dbRef, push, set, update, remove } from 'firebase/database'

export type DayKey = 'senin'|'selasa'|'rabu'|'kamis'|'jumat'|'sabtu'|'minggu'
export const DAY_KEYS: DayKey[] = ['senin','selasa','rabu','kamis','jumat','sabtu','minggu']
export const DAY_LABEL: Record<DayKey,string> = {
  senin:'Senin', selasa:'Selasa', rabu:'Rabu', kamis:'Kamis', jumat:'Jumat', sabtu:'Sabtu', minggu:'Minggu'
}

export type PiketMember = {
  id: string
  santriId?: string
  name: string
  note?: string
}

export type PiketDay = Record<string, PiketMember>
export type PiketMap = Record<string, Record<DayKey, PiketDay>>

function normalizeMember(m: Partial<PiketMember>): Omit<PiketMember,'id'> {
  return {
    santriId: m.santriId || '',
    name: (m.name ?? '').toString().trim(),
    note: m.note ?? '',
  }
}

export const usePiket = () => {
  const loading = vRef(false)
  const error = vRef<string|null>(null)
  const data = vRef<PiketMap>({})

  async function fetchPiket() {
    loading.value = true
    error.value = null
    try {
      const { $realtimeDb } = useNuxtApp()
      const snap = await get(child(dbRef($realtimeDb), 'alberr/piket'))
      const val: any = snap.val() || {}
      const map: PiketMap = {}
      for (const [maskanId, days] of Object.entries(val)) {
        map[maskanId] = {} as any
        for (const d of DAY_KEYS) {
          const membersObj = (days?.[d]?.members) || {}
          const day: PiketDay = {}
          for (const [mid, mv] of Object.entries<any>(membersObj)) {
            day[mid] = {
              id: mid,
              santriId: mv?.santriId || '',
              name: (mv?.name ?? '').toString(),
              note: mv?.note ?? '',
            }
          }
          map[maskanId]![d] = day
        }
      }
      data.value = map
    } catch (e:any) {
      console.error(e)
      error.value = e?.message ?? 'Gagal memuat piket'
    } finally {
      loading.value = false
    }
  }

  function norm(s: string) {
    return (s ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase()
  }

  function hasMember(maskanId: string, day: DayKey, cand: { santriId?: string; name?: string }, exceptId?: string) {
    const members = (data.value?.[maskanId]?.[day]) || {}
    const targetId = (cand.santriId ?? '').trim()
    const targetName = norm(cand.name ?? '')

    for (const [id, m] of Object.entries(members)) {
      if (id === exceptId) continue
      const mid = (m as any).santriId ? String((m as any).santriId).trim() : ''
      const mname = norm((m as any).name ?? '')

      if (targetId && mid && targetId === mid) return true
      if (!targetId && targetName && targetName === mname) return true
      if (targetId && !mid && targetName && targetName === mname) return true
    }
    return false
  }


  function getDayArray(maskanId: string, day: DayKey): PiketMember[] {
    const members = data.value?.[maskanId]?.[day] || {}
    return Object.values(members).sort((a,b)=>a.name.localeCompare(b.name,'id'))
  }


  async function addMember(maskanId: string, day: DayKey, member: Partial<PiketMember>) {
    const { $realtimeDb } = useNuxtApp()
    if (hasMember(maskanId, day, { santriId: member.santriId, name: member.name })) return null

    const node = dbRef($realtimeDb, `alberr/piket/${maskanId}/${day}/members`)
    const newRef = push(node)
    const m = normalizeMember(member)
    const payload:any = { name: m.name }
    if (m.santriId) payload.santriId = m.santriId
    if (m.note) payload.note = m.note
    await set(newRef, payload)
    await fetchPiket()
    return newRef.key
  }

  async function removeMember(maskanId: string, day: DayKey, memberId: string) {
    const { $realtimeDb } = useNuxtApp()
    await remove(dbRef($realtimeDb, `alberr/piket/${maskanId}/${day}/members/${memberId}`))
    await fetchPiket()
  }

  async function updateMember(maskanId: string, day: DayKey, memberId: string, patch: Partial<PiketMember>) : Promise<boolean> {
    const { $realtimeDb } = useNuxtApp()

    const current = data.value?.[maskanId]?.[day]?.[memberId] || {}
    const nextSantriId = (patch.santriId !== undefined) ? (patch.santriId ?? '') : (current as any).santriId
    const nextName     = (patch.name     !== undefined) ? (patch.name     ?? '') : (current as any).name

    if (hasMember(maskanId, day, { santriId: nextSantriId, name: nextName }, memberId)) return false

    const node = dbRef($realtimeDb, `alberr/piket/${maskanId}/${day}/members/${memberId}`)
    const m = normalizeMember(patch)
    const payload:any = {}
    if (patch.name !== undefined) payload.name = m.name
    if (patch.santriId !== undefined) payload.santriId = m.santriId || ''
    if (patch.note !== undefined) payload.note = m.note || ''
    await update(node, payload)
    await fetchPiket()
    return true
  }

  // ---- Day Ops ----
  async function clearDay(maskanId: string, day: DayKey) {
    const { $realtimeDb } = useNuxtApp()
    await remove(dbRef($realtimeDb, `alberr/piket/${maskanId}/${day}/members`))
    await fetchPiket()
  }

  async function copyDay(maskanId: string, from: DayKey, to: DayKey) {
    const arr = getDayArray(maskanId, from)
    await clearDay(maskanId, to)
    for (const m of arr) {
      await addMember(maskanId, to, { santriId: m.santriId, name: m.name, note: m.note })
    }
  }

  async function pasteToDays(maskanId: string, from: DayKey, targets: DayKey[]) {
    for (const t of targets) await copyDay(maskanId, from, t)
  }

  const totalByMaskan = computed(() => (maskanId: string) =>
    DAY_KEYS.reduce((acc,d)=> acc + getDayArray(maskanId,d).length, 0)
  )

  return {
    loading, error, data, fetchPiket,
    getDayArray, addMember, removeMember, updateMember,
    clearDay, copyDay, pasteToDays,
    DAY_KEYS, DAY_LABEL, totalByMaskan,
  }
}

export { usePiket as usePicket }
