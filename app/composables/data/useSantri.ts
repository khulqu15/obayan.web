// composables/data/useSantri.ts
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

  // master-friendly fields
  noInduk?: string        // NIS/NISN/No. Induk
  kelasFormal?: string    // contoh: "7 MTs A"
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

    // NEW: derive noInduk & kelasFormal dari berbagai kemungkinan key
    const noInduk =
      v.noInduk ||
      v.nis ||
      v.nis_santri ||
      v.nisn ||
      v?.ppdb?.siswa?.nis ||
      v?.ppdb?.siswa?.nisn ||
      ''

    const kelasFormal =
      v.kelasFormal ||
      v.level ||
      v.kelas ||
      v.jenjang ||
      v.jenjang_pendidikan ||
      ''

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
      ayahNama: v?.ppdb?.ortu?.ayah?.nama || v?.ayahNama || '',
      ibuNama: v?.ppdb?.ortu?.ibu?.nama || v?.ibuNama || '',
      dokumenCount: dokCount,

      // NEW
      noInduk: String(noInduk || '').trim(),
      kelasFormal: String(kelasFormal || '').trim(),
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
      gen: payload.gen ?? '',
      santri: payload.santri ?? '',
      walisantri: payload.walisantri ?? '',
      nohp: payload.nohp ?? '',
      kuotaKunjunganBulanIni: Number(payload.kuotaKunjunganBulanIni ?? 0),
      kamar: payload.kamar ?? '',
      maskan: payload.maskan ?? '',
      alamat: payload.alamat ?? '',
      status: payload.status ?? '',
      jenjang: payload.jenjang ?? '',
      rfid: payload.rfid || '',
      fingerprint: payload.fingerprint || '',
      gender: payload.gender ?? '',
      tipe: payload.tipe ?? '',
      ppdbCode: payload.ppdbCode ?? '',
      dokumen: payload.dokumen ?? null,

      // NEW
      noInduk: payload.noInduk ?? '',
      kelasFormal: payload.kelasFormal ?? '',
      ayahNama: payload.ayahNama ?? '',
      ibuNama: payload.ibuNama ?? '',
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
    const keys = [
      'gen','santri','walisantri','nohp','kuotaKunjunganBulanIni','kamar','maskan','status','alamat','jenjang',
      'rfid','fingerprint','gender','tipe','ppdbCode','dokumen',
      'nik','ayahNama','ibuNama',
      // NEW:
      'noInduk','kelasFormal'
    ] as const
    for (const k of keys) {
      if ((payload as any)[k] !== undefined) data[k] = (payload as any)[k]
    }
    await update(nodeRef, data)
    if (refresh) await fetchSantri()
  }

  // --- Import CSV Full (tetap disediakan)
  async function importFromCsvFull(file: File, onProgress: (percent: number, status: string) => void) {
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

  /** =========================
   *  Import Excel/CSV (Data Master)
   *  ========================= */
  function norm(s: any) {
    return String(s || '')
      .toLowerCase()
      .replace(/[._\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
  function mapMasterRowToSantri(row: Record<string, any>) {
    const R: Record<string, any> = {}
    for (const [k, v] of Object.entries(row || {})) R[norm(k)] = v
    const pick = (...keys: string[]) => {
      for (const k of keys) {
        if (R[k] !== undefined && R[k] !== null && String(R[k]).trim() !== '') return R[k]
      }
      return ''
    }

    const noInduk = pick('no induk','noinduk','nis','nisn','no santri','no siswa','nomor induk')
    const gen = String(pick('gen','angkatan','tahun masuk','tahun')).trim()
    const santri = pick('nama','nama santri','nama lengkap','siswa','santri')
    const kamar = pick('kamar','asrama','maskan')
    const ayahNama = pick('ayah','nama ayah','wali ayah','nama ayah kandung')
    const ibuNama  = pick('ibu','nama ibu','wali ibu','nama ibu kandung')
    const nohp = String(pick('nomor','no hp','hp','no wa','whatsapp','telepon','telp','no telepon')).replace(/[^\d+]/g,'')
    const alamat = pick('alamat','alamat domisili','alamat wali','alamat lengkap')
    const statusRaw = String(pick('status','keterangan','aktif')).toLowerCase()
    const kelasFormal = pick('kelas formal','kelas','level','jenjang','jenjang pendidikan')

    const status =
      /lulus/.test(statusRaw) ? 'lulus' :
      /cuti/.test(statusRaw) ? 'cuti' :
      /non/.test(statusRaw)  ? 'nonaktif' :
      'aktif'

    const jenjang = String(kelasFormal || '').trim()

    return {
      gen: gen || '',
      santri: santri || '',
      walisantri: ayahNama || ibuNama || '',
      nohp: nohp || '',
      kuotaKunjunganBulanIni: 0,
      kamar: kamar || '',
      alamat: alamat || '',
      status,
      jenjang,

      // tambahan
      ayahNama: ayahNama || '',
      ibuNama: ibuNama || '',
      noInduk: String(noInduk || '').trim(),
      kelasFormal: String(kelasFormal || '').trim(),
    }
  }

  async function importFromExcelWithProgress(
    file: File,
    onProgress: (percent: number, status: string) => void
  ) {
    const name = (file?.name || '').toLowerCase()
    const isExcel = /\.(xlsx|xls)$/.test(name)
    const isCsv   = /\.csv$/.test(name)

    if (!isExcel && !isCsv && !/sheet|excel|csv|text/.test(file.type)) {
      onProgress(0, 'Format file tidak dikenali. Gunakan CSV/XLSX.')
      return
    }

    const batchCreate = async (rowsArr: any[]) => {
      const total = rowsArr.length || 1
      let done = 0
      for (const raw of rowsArr) {
        const payload = mapMasterRowToSantri(raw)
        if (String(payload.santri).trim() && String(payload.gen).trim()) {
          await createSantri(payload as any, { refresh: false })
        }
        done++
        if (done % 5 === 0 || done === total) {
          onProgress(Math.min(99, Math.round((done / total) * 100)), `Import ${done}/${total} baris…`)
        }
      }
      await fetchSantri()
      onProgress(100, '✅ Selesai import')
    }

    try {
      onProgress(5, 'Membaca file…')
      if (isExcel || /sheet|excel/.test(file.type)) {
        // @ts-ignore
        const XLSX = (await import('xlsx')).default || (await import('xlsx'))
        const ab = await file.arrayBuffer()
        const wb = XLSX.read(ab, { type: 'array' })
        const sheetName = wb.SheetNames[0]
        const ws = wb.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(ws, { defval: '' })
        onProgress(10, `Memproses sheet "${sheetName}"…`)
        await batchCreate(json as any[])
        return
      }

      // CSV
      await new Promise<void>((resolve) => {
        let cache: any[] = []
        Papa.parse(file, {
          header: true,
          skipEmptyLines: 'greedy',
          dynamicTyping: false,
          encoding: 'utf-8',
          chunk: (res: any) => {
            const data = res.data as any[]
            cache = cache.concat(data)
            onProgress(10, `Membaca ${cache.length} baris…`)
          },
          complete: async () => {
            await batchCreate(cache)
            resolve()
          },
          error: (err: any) => {
            console.error(err)
            onProgress(0, 'Gagal membaca CSV: ' + err.message)
            resolve()
          }
        })
      })
    } catch (e: any) {
      console.error(e)
      onProgress(0, 'Gagal import: ' + (e?.message || e))
    }
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

  async function getSantriById(id: string): Promise<any | null> {
    try {
      const { $realtimeDb } = useNuxtApp()
      const snap = await get(dbRef($realtimeDb, `alberr/santri/${id}`))
      return snap.exists() ? snap.val() : null
    } catch { return null }
  }

  return {
    rows, loading, error, fetchSantri,
    createSantri, updateSantri, deleteSantri,
    importFromCsvFull,            // opsional
    importFromExcelWithProgress,  // NEW
    subscribeSantri, unsubscribeSantri, getSantriById
  }
}
