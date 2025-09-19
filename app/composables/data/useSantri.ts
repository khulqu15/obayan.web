// useSantri.ts
import { ref as vRef } from 'vue'
import { useNuxtApp } from '#app'
import { get, ref as dbRef, push, set, update, remove, onValue, off } from 'firebase/database'
import Papa from 'papaparse'

export type DokumenBox = {
  kkUrl?: string
  akteUrl?: string
  ktpAyahUrl?: string
  ktpIbuUrl?: string
}

export type SantriRow = {
  id: string
  gen: string
  santri: string
  walisantri?: string
  nohp?: string
  kuotaKunjunganBulanIni?: number
  kamar?: string
  alamat?: string
  status?: string
  jenjang?: string
  maskan?: string
  rfid?: any
  fingerprint?: any

  gender?: 'L' | 'P' | ''
  tipe?: 'Putra' | 'Putri' | ''
  ppdbCode?: string
  dokumen?: DokumenBox | null

  // derived for admin table
  nik?: string
  ayahNama?: string
  ibuNama?: string
  dokumenCount?: number
}

function deriveGenderAndTipe(v: any): { gender: 'L'|'P'|''; tipe: 'Putra'|'Putri'|'' } {
  const raw = (v?.gender ?? v?.tipe ?? v?.ppdb?.siswa?.jk ?? '').toString().trim().toUpperCase()
  const gender: 'L' | 'P' | '' = raw === 'L' ? 'L' : raw === 'P' ? 'P' : ''
  const tipe: 'Putra' | 'Putri' | '' = gender === 'L' ? 'Putra' : gender === 'P' ? 'Putri' : ''
  return { gender, tipe }
}

export const useSantri = () => {
  const loading = vRef(false)
  const error = vRef<string | null>(null)
  const rows = vRef<SantriRow[]>([])
  let _unsubscribe: (() => void) | null = null

  function mapOne(key: string, v: any): SantriRow {
    const { gender, tipe } = deriveGenderAndTipe(v)
    const dok = v?.dokumen || {}
    const dokCount = [dok.kkUrl, dok.akteUrl, dok.ktpAyahUrl, dok.ktpIbuUrl].filter(Boolean).length
    return {
      id: key,
      gen: v.gen || '',
      santri: v.santri || v.nama || '',
      walisantri: v.walisantri || v.wali || v.ortu || '',
      nohp: v.nohp || v.no_wa || v.whatsapp || v?.ppdb?.ortu?.hp1 || '',
      kuotaKunjunganBulanIni: Number(v.kuotaKunjunganBulanIni ?? v.kuota_bulan_ini ?? 0),
      kamar: v.kamar || v.asrama || '',
      maskan: v.maskan || '',
      status: v.status || '',
      alamat: v.alamat || '',
      jenjang: v.jenjang || v.jenjang_pendidikan || v.kelas || '',
      rfid: v.rfid || '',
      fingerprint: v.fingerprint || '',
      gender, tipe,
      ppdbCode: v.ppdbCode || '',
      dokumen: dok ? {
        kkUrl: dok.kkUrl, akteUrl: dok.akteUrl, ktpAyahUrl: dok.ktpAyahUrl, ktpIbuUrl: dok.ktpIbuUrl
      } : null,
      nik: v?.ppdb?.siswa?.nik || '',
      ayahNama: v?.ppdb?.ortu?.ayah?.nama || '',
      ibuNama: v?.ppdb?.ortu?.ibu?.nama || '',
      dokumenCount: dokCount
    }
  }

  async function fetchSantri() {
    loading.value = true; error.value = null
    try {
      const { $realtimeDb } = useNuxtApp()
      const snapshot = await get(dbRef($realtimeDb, 'alberr/santri'))
      const val = snapshot.val() || {}
      rows.value = Object.entries(val).map(([key, v]: any) => mapOne(key, v))
    } catch (e: any) {
      console.error(e); error.value = e?.message ?? 'Gagal memuat data'
    } finally {
      loading.value = false
    }
  }

  async function createSantri(payload: Omit<SantriRow, 'id'>, opts: { refresh?: boolean } = {}) {
    const { refresh = true } = opts
    const { $realtimeDb } = useNuxtApp()
    const listRef = dbRef($realtimeDb, 'alberr/santri')
    const newRef = push(listRef)
    const data = {
      gen: payload.gen ?? '', santri: payload.santri ?? '', walisantri: payload.walisantri ?? '', nohp: payload.nohp ?? '',
      kuotaKunjunganBulanIni: Number(payload.kuotaKunjunganBulanIni ?? 0),
      kamar: payload.kamar ?? '', maskan: payload.maskan ?? '', alamat: payload.alamat ?? '',
      status: payload.status ?? '', jenjang: payload.jenjang ?? '',
      rfid: payload.rfid || '', fingerprint: payload.fingerprint || '',
      gender: payload.gender ?? '', tipe: payload.tipe ?? '',
      ppdbCode: payload.ppdbCode ?? '',
      dokumen: payload.dokumen ?? null
    }
    await set(newRef, data)
    if (refresh) await fetchSantri()
    return newRef.key
  }

  async function updateSantri(id: string, payload: Partial<Omit<SantriRow, 'id'>>, opts: { refresh?: boolean } = {}) {
    const { refresh = true } = opts
    const { $realtimeDb } = useNuxtApp()
    const nodeRef = dbRef($realtimeDb, `alberr/santri/${id}`)
    const data: any = {}
    const keys = ['gen','santri','walisantri','nohp','kuotaKunjunganBulanIni','kamar','maskan','status','alamat','jenjang','rfid','fingerprint','gender','tipe','ppdbCode','dokumen','nik','ayahNama','ibuNama'] as const
    for (const k of keys) {
      if ((payload as any)[k] !== undefined) data[k] = (payload as any)[k]
    }
    await update(nodeRef, data)
    if (refresh) await fetchSantri()
  }

  async function importFromCsvFull(file: File, onProgress: (percent: number, status: string) => void) {
    // Tetap sediakan jika butuh import; fokus projek ini export full.
    return new Promise<void>((resolve) => {
      let total = 0, done = 0
      Papa.parse(file, {
        header: true, skipEmptyLines: 'greedy', dynamicTyping: true, encoding: 'utf-8',
        chunk: async (results: any) => {
          const data = results.data as any[]; total += data.length
          for (const row of data) {
            await createSantri({
              gen: String(row.gen || ''), santri: String(row.nama || row.santri || ''), walisantri: String(row.wali_nama || row.walisantri || ''),
              nohp: String(row.hp1 || row.nohp || ''), kamar: '-', maskan: '-', alamat: row.alamat_singkat || '',
              status: 'nonaktif', jenjang: 'KMI • MTs 1',
              gender: (String(row.jk || '')).toUpperCase()==='P'?'P':'L', tipe: (String(row.jk || '')).toUpperCase()==='P'?'Putri':'Putra',
              ppdbCode: String(row.ppdbCode || ''),
            }, { refresh: false })
            done++; onProgress(Math.min(99, Math.round((done / Math.max(1, total)) * 100)), `Upload ${done} dari ${total} santri…`)
          }
        },
        complete: async () => { await fetchSantri(); onProgress(100, '✅ Selesai import'); resolve() },
        error: (err:any) => { console.error(err); onProgress(0, 'Gagal membaca CSV: ' + err.message); resolve() }
      })
    })
  }

  async function deleteSantri(id: string) {
    const { $realtimeDb } = useNuxtApp()
    await remove(dbRef($realtimeDb, `alberr/santri/${id}`))
    await fetchSantri()
  }

  function subscribeSantri() {
    const { $realtimeDb } = useNuxtApp()
    const ref = dbRef($realtimeDb, 'alberr/santri')
    const cb = (snap:any) => {
      const val = snap.val() || {}
      rows.value = Object.entries(val).map(([key, v]: any) => mapOne(key, v))
    }
    onValue(ref, cb); _unsubscribe = () => off(ref, 'value', cb)
  }
  function unsubscribeSantri() { _unsubscribe?.(); _unsubscribe = null }

  // Ambil record lengkap untuk modal detail & export full
  async function getSantriById(id: string): Promise<any | null> {
    try {
      const { $realtimeDb } = useNuxtApp()
      const snap = await get(dbRef($realtimeDb, `alberr/santri/${id}`))
      return snap.exists() ? snap.val() : null
    } catch { return null }
  }

  return { rows, loading, error, fetchSantri, createSantri, updateSantri, deleteSantri, importFromCsvFull, subscribeSantri, unsubscribeSantri, getSantriById }
}
