import { ref as vRef, computed } from 'vue'
import { child, get, ref as dbRef, push, set, update, remove, onValue, off } from 'firebase/database'
import Papa from "papaparse"

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
  rfid?: any,
  fingerprint?: any,
}

export const useSantri = () => {
  const loading = vRef(false)
  const error = vRef<string | null>(null)
  const rows = vRef<SantriRow[]>([])
  let _unsubscribe: (() => void) | null = null

  async function fetchSantri() {
    loading.value = true
    error.value = null
    try {
      const { $realtimeDb } = useNuxtApp()
      const snapshot = await get(dbRef($realtimeDb, 'alberr/santri'))
      const val = snapshot.val() || {}
      rows.value = Object.entries(val).map(([key, v]: any) => ({
        id: key,
        gen: v.gen || '',
        santri: v.santri || v.nama || '',
        walisantri: v.walisantri || v.wali || v.ortu || '',
        nohp: v.nohp || v.no_wa || v.whatsapp || '',
        kuotaKunjunganBulanIni: Number(v.kuotaKunjunganBulanIni ?? v.kuota_bulan_ini ?? 0),
        kamar: v.kamar || v.asrama || '',
        maskan: v.maskan || '',
        status: v.status || '',
        alamat: v.alamat || '',
        jenjang: v.jenjang || v.jenjang_pendidikan || v.kelas || '',
        rfid: v.rfid || '',
        fingerprint: v.fingerprint || '',
      }))
    } catch (e: any) {
      console.error(e)
      error.value = e?.message ?? 'Gagal memuat data'
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
    if (payload.gen !== undefined) data.gen = payload.gen
    if (payload.santri !== undefined) data.santri = payload.santri
    if (payload.walisantri !== undefined) data.walisantri = payload.walisantri
    if (payload.nohp !== undefined) data.nohp = payload.nohp
    if (payload.kuotaKunjunganBulanIni !== undefined) data.kuotaKunjunganBulanIni = Number(payload.kuotaKunjunganBulanIni)
    if (payload.kamar !== undefined) data.kamar = payload.kamar
    if (payload.maskan !== undefined) data.maskan = payload.maskan
    if (payload.status !== undefined) data.status = payload.status
    if (payload.alamat !== undefined) data.alamat = payload.alamat
    if (payload.jenjang !== undefined) data.jenjang = payload.jenjang
    if (payload.rfid !== undefined) data.rfid = payload.rfid
    if (payload.fingerprint !== undefined) data.fingerprint = payload.fingerprint
    await update(nodeRef, data)
    if (refresh) await fetchSantri()
  }

  async function importFromExcelWithProgress(
    file: File,
    onProgress: (percent: number, status: string) => void
  ) {
    const pick = (row: any, keys: string[], fallback = "") => {
      for (const k of keys) {
        if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== "") return row[k]
      }
      return fallback
    }

    return new Promise<void>((resolve) => {
      let total = 0
      let done = 0

      Papa.parse(file, {
        header: true,
        skipEmptyLines: 'greedy',
        dynamicTyping: true,
        encoding: "utf-8",
        chunk: async (results: any) => {
          const data = results.data as any[]
          total += data.length

          for (const row of data) {
            await createSantri({
              gen:      String(pick(row, ["Gen", "gen"], "")),
              santri:   String(pick(row, ["Nama","santri","nama"], "")),
              walisantri: String(pick(row, ["Wali","Wali Santri"," Nama Ayah","wali","ortu"], "")),
              nohp:     String(pick(row, ["No HP","No. HP","Nomor Telp","nohp","whatsapp"], "")),
              kuotaKunjunganBulanIni: Number(pick(row, ["Kuota","Kuota Kunjungan","Kuota Kunjungan (bulan ini)","kuota"], '2')) || 2,
              kamar:    String(pick(row, ["Kamar","Asrama","kamar"], "")),
              maskan:   String(pick(row, ["Maskan"], "")),
              alamat:   String(pick(row, ["Alamat ", "Alamat", " Alamat"], "")),
              status:   String(pick(row, ["Status"], "")),
              jenjang:  String(pick(row, ["Jenjang","Kelas","Kelas Formal","jenjang"], "")),
              rfid:  String(pick(row, ["RFID","Rfid","rfid"], "")),
              fingerprint:  String(pick(row, ["Fingerprint","fingerprint","FINGERPRINT"], "")),
            }, { refresh: false })
            done++
            onProgress(Math.min(99, Math.round((done / Math.max(1, total)) * 100)), `Upload ${done} dari ${total} santri…`)
          }
        },
        complete: async () => {
          await fetchSantri()
          onProgress(100, "✅ Selesai import data santri")
          resolve()
        },
        error: (err: any) => {
          console.error(err)
          onProgress(0, "Gagal membaca CSV: " + err.message)
          resolve()
        }
      })
    })
  }

  async function deleteSantri(id: string) {
    const { $realtimeDb } = useNuxtApp()
    const nodeRef = dbRef($realtimeDb, `alberr/santri/${id}`)
    await remove(nodeRef)
    await fetchSantri()
  }

  function subscribeSantri() {
    const { $realtimeDb } = useNuxtApp()
    const ref = dbRef($realtimeDb, 'alberr/santri')
    const cb = (snap: any) => {
      const val = snap.val() || {}
      rows.value = Object.entries(val).map(([key, v]: any) => ({
        id: key,
        gen: v.gen || '',
        santri: v.santri || v.nama || '',
        walisantri: v.walisantri || v.wali || v.ortu || '',
        nohp: v.nohp || v.no_wa || v.whatsapp || '',
        kuotaKunjunganBulanIni: Number(v.kuotaKunjunganBulanIni ?? v.kuota_bulan_ini ?? 0),
        kamar: v.kamar || v.asrama || '',
        maskan: v.maskan || '',
        status: v.status || '',
        alamat: v.alamat || '',
        jenjang: v.jenjang || v.jenjang_pendidikan || v.kelas || '',
        rfid: v.rfid || '',
        fingerprint: v.fingerprint || '',
      }))
    }
    onValue(ref, cb)
    _unsubscribe = () => off(ref, 'value', cb)
  }

  function unsubscribeSantri() {
    _unsubscribe?.()
    _unsubscribe = null
  }

  return {
    rows, loading, error,
    fetchSantri, createSantri, updateSantri, deleteSantri,
    importFromExcelWithProgress,
    subscribeSantri, unsubscribeSantri
  }
}
