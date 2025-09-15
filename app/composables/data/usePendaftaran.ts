import { ref as vRef } from 'vue'
import { child, get, ref as dbRef, push, set, update, remove } from 'firebase/database'

export type PendaftaranRow = {
  id: string; gen: string; santri: string; walisantri?: string; nohp?: string;
  kamar?: string; alamat?: string; status?: string; jenjang?: string; maskan?: string;
  rfid?: any; fingerprint?: any; ppdbCode?: string; createdAt?: any;
}

export type PendaftaranSettings = {
  isClosed: boolean
  autoCloseEnabled: boolean
  autoCloseAt: string | null // ISO
  year: number
  updatedAt?: number
}

const SETTINGS_PATH = 'alberr/form/pendaftaran'

function extractYear(r: any): number | null {
  if (typeof r?.ppdbCode === 'string' && /^ALB-\d{8}-/i.test(r.ppdbCode)) {
    return parseInt(r.ppdbCode.slice(4, 8))
  }
  const ca = (r as any)?.createdAt
  if (typeof ca === 'number') return new Date(ca).getFullYear()
  if (ca && typeof ca === 'object') {
    const ms = ca._seconds ? ca._seconds * 1000 : ca?.toMillis?.()
    if (ms) return new Date(ms).getFullYear()
  }
  const g = (r as any)?.gen
  if (g && /^\d{4}$/.test(String(g))) return parseInt(g)
  return null
}

function isCalonThisYear(r: PendaftaranRow, year: number): boolean {
  const y = extractYear(r)
  const looksNew = (r.status === 'nonaktif') && (!r.kamar || r.kamar === '-')
  const hasPpdb = 'ppdbCode' in r || 'ppdb' in (r as any) || ('username' in (r as any) && 'publicToken' in (r as any))
  return (y === year) && (looksNew || hasPpdb)
}
function isBaruThisYear(r: PendaftaranRow, year: number): boolean {
  const y = extractYear(r)
  // Diterima/aktif untuk tahun berjalan
  return (y === year) && (r.status !== 'nonaktif')
}
const TZ_JKT = 'Asia/Jakarta'

export const usePendaftaran = () => {
  const loading = vRef(false)
  const error   = vRef<string | null>(null)
  const allRows = vRef<PendaftaranRow[]>([])
  const calonRows = vRef<PendaftaranRow[]>([])
  const baruRows  = vRef<PendaftaranRow[]>([])
    const settings  = vRef<PendaftaranSettings>({
        isClosed: false, autoCloseEnabled: false, autoCloseAt: null, year: tzYearFromMs(Date.now())
    })

  
    function tzYearFromMs(ms: number, tz = TZ_JKT) {
        return Number(new Intl.DateTimeFormat('en-CA', { timeZone: tz, year:'numeric' }).format(new Date(ms)))
    }

    function extractYear(r: any): number | null {
        if (typeof r?.ppdbCode === 'string' && /^ALB-\d{8}-/i.test(r.ppdbCode)) {
            return parseInt(r.ppdbCode.slice(4, 8))
        }
        const ca = (r as any)?.createdAt
        if (typeof ca === 'number') return tzYearFromMs(ca)
        if (ca && typeof ca === 'object') {
            const ms = ca._seconds ? ca._seconds * 1000 : ca?.toMillis?.()
            if (ms) return tzYearFromMs(ms)
        }
        const g = (r as any)?.gen
        if (g && /^\d{4}$/.test(String(g))) return parseInt(g)
        return null
    }

  async function fetchAll() {
    loading.value = true; error.value = null
    try {
      const { $realtimeDb } = useNuxtApp()
      const snap = await get(dbRef($realtimeDb, 'alberr/santri'))
      const val = snap.val() || {}
      const rows: PendaftaranRow[] = Object.entries(val).map(([id, v]: any) => ({
        id, gen: v.gen || '', santri: v.santri || v.nama || '', walisantri: v.walisantri || v.wali || v.ortu || '',
        nohp: v.nohp || v.no_wa || v.whatsapp || '', kamar: v.kamar || v.asrama || '', maskan: v.maskan || '',
        status: v.status || '', alamat: v.alamat || '', jenjang: v.jenjang || v.jenjang_pendidikan || v.kelas || '',
        rfid: v.rfid || '', fingerprint: v.fingerprint || '', ppdbCode: v.ppdbCode, createdAt: v.createdAt
      }))
      allRows.value = rows
      const y = settings.value.year || new Date().getFullYear()
      calonRows.value = rows.filter(r => isCalonThisYear(r, y))
      baruRows.value  = rows.filter(r => isBaruThisYear(r, y))
    } catch (e:any) {
      console.error(e); error.value = e?.message ?? 'Gagal memuat data'
    } finally { loading.value = false }
  }

  async function approveCalon(id: string) {
    const { $realtimeDb } = useNuxtApp()
    const nodeRef = dbRef($realtimeDb, `alberr/santri/${id}`)
    await remove(child(nodeRef, 'status'))
    await fetchAll()
  }

  async function revertToCalon(id: string) {
    await updateRow(id, { status: 'nonaktif', kamar: '-', maskan: '' })
    await fetchAll()
  }

  async function createRow(payload: Omit<PendaftaranRow, 'id'>, opts: { refresh?: boolean } = {}) {
    const { refresh = true } = opts
    const { $realtimeDb } = useNuxtApp()
    const listRef = dbRef($realtimeDb, 'alberr/santri'); const newRef = push(listRef)
    const data = {
      gen: payload.gen ?? '', santri: payload.santri ?? '', walisantri: payload.walisantri ?? '', nohp: payload.nohp ?? '',
      kamar: payload.kamar ?? '', maskan: payload.maskan ?? '', alamat: payload.alamat ?? '',
      status: payload.status ?? 'nonaktif', jenjang: payload.jenjang ?? '', rfid: payload.rfid || '', fingerprint: payload.fingerprint || '',
    }
    await set(newRef, data)
    if (refresh) await fetchAll()
    return newRef.key
  }

  async function updateRow(id: string, payload: Partial<Omit<PendaftaranRow, 'id'>>, opts: { refresh?: boolean } = {}) {
    const { refresh = true } = opts; const { $realtimeDb } = useNuxtApp()
    const nodeRef = dbRef($realtimeDb, `alberr/santri/${id}`)
    const data:any = {}
    if (payload.gen !== undefined) data.gen = payload.gen
    if (payload.santri !== undefined) data.santri = payload.santri
    if (payload.walisantri !== undefined) data.walisantri = payload.walisantri
    if (payload.nohp !== undefined) data.nohp = payload.nohp
    if (payload.kamar !== undefined) data.kamar = payload.kamar
    if (payload.maskan !== undefined) data.maskan = payload.maskan
    if (payload.status !== undefined) data.status = payload.status
    if (payload.alamat !== undefined) data.alamat = payload.alamat
    if (payload.jenjang !== undefined) data.jenjang = payload.jenjang
    if (payload.rfid !== undefined) data.rfid = payload.rfid
    if (payload.fingerprint !== undefined) data.fingerprint = payload.fingerprint
    await update(nodeRef, data)
    if (refresh) await fetchAll()
  }

  async function deleteRow(id: string) {
    const { $realtimeDb } = useNuxtApp()
    await remove(dbRef($realtimeDb, `alberr/santri/${id}`))
    await fetchAll()
  }

  /** ===== Settings (alberr/form/pendaftaran) ===== */
  async function fetchSettings() {
    try {
      const { $realtimeDb } = useNuxtApp()
      const snap = await get(dbRef($realtimeDb, SETTINGS_PATH))
      const val = snap.val() || {}
        settings.value = {
            isClosed: !!val.isClosed,
            autoCloseEnabled: !!val.autoCloseEnabled,
            autoCloseAt: val.autoCloseAt ?? null,
            year: Number(val.year ?? tzYearFromMs(Date.now())),
            updatedAt: val.updatedAt ?? Date.now()
        }
    } catch (e:any) { console.warn('settings error', e) }
  }

  async function saveSettings(patch: Partial<PendaftaranSettings>) {
    const { $realtimeDb } = useNuxtApp()
    const merged: PendaftaranSettings = { ...settings.value, ...patch, updatedAt: Date.now() }
    await update(dbRef($realtimeDb, SETTINGS_PATH), merged as any)
    settings.value = merged
    // refresh filter berdasarkan tahun jika berubah
    if (patch.year !== undefined) await fetchAll()
  }

  return {
    // state
    loading, error, allRows, calonRows, baruRows, settings,
    // data ops
    fetchAll, createRow, updateRow, deleteRow, approveCalon, revertToCalon,
    // settings ops
    fetchSettings, saveSettings
  }
}
