// composables/useFaults.ts
import { ref as vRef, computed } from 'vue'
import { child, get, ref as dbRef, push, set, update, remove, onValue, off } from 'firebase/database'
import Papa from 'papaparse'

export type FaultStatus = 'baru' | 'diproses' | 'selesai'

export type FaultRow = {
  id: string
  santriId: string
  santri: string
  tanggal: number            // epoch ms
  jenis: string              // tipe pelanggaran (mis. "Terlambat", "Ikhtilat", dst.)
  kategori?: string          // Ringan / Sedang / Berat (opsional)
  poin?: number              // skor poin pelanggaran
  deskripsi?: string
  pelapor?: string           // ustadz/petugas
  status?: FaultStatus       // baru|diproses|selesai
  tindakan?: string          // tindak lanjut
  lampiranUrl?: string       // bukti (foto/dokumen) opsional
  // denormalized untuk kemudahan laporan
  maskan?: string
  kamar?: string
  jenjang?: string
}

export const useFaults = () => {
  const loading = vRef(false)
  const error = vRef<string | null>(null)
  const rows = vRef<FaultRow[]>([])
  let _unsubscribe: (() => void) | null = null

  // --- UTIL ---
  const normalize = (id: string, v: any): FaultRow => ({
    id,
    santriId: String(v.santriId ?? v.sid ?? ''),
    santri: String(v.santri ?? v.nama ?? ''),
    tanggal: Number(v.tanggal ?? v.date ?? Date.now()),
    jenis: String(v.jenis ?? v.pelanggaran ?? 'Umum'),
    kategori: v.kategori ?? v.level ?? '',
    poin: Number(v.poin ?? v.point ?? 0),
    deskripsi: v.deskripsi ?? v.keterangan ?? '',
    pelapor: v.pelapor ?? v.petugas ?? '',
    status: (v.status ?? 'baru') as FaultStatus,
    tindakan: v.tindakan ?? '',
    lampiranUrl: v.lampiranUrl ?? v.lampiran ?? '',
    maskan: v.maskan ?? '',
    kamar: v.kamar ?? v.asrama ?? '',
    jenjang: v.jenjang ?? v.kelas ?? ''
  })

  async function fetchFaults() {
    loading.value = true
    error.value = null
    try {
      const { $realtimeDb } = useNuxtApp()
      const snapshot = await get(dbRef($realtimeDb, 'alberr/faults'))
      const val = snapshot.val() || {}
      const list = Object.entries(val).map(([key, v]: any) => normalize(key, v))
      // urut terbaru di atas
      rows.value = list.sort((a, b) => b.tanggal - a.tanggal)
    } catch (e: any) {
      console.error(e)
      error.value = e?.message ?? 'Gagal memuat data pelanggaran'
    } finally {
      loading.value = false
    }
  }

  // Coba ambil nama santri dari DB jika payload belum isi "santri"
  async function fillSantriIfNeeded(payload: Partial<FaultRow>) {
    if (!payload?.santri && payload?.santriId) {
      try {
        const { $realtimeDb } = useNuxtApp()
        const snap = await get(dbRef($realtimeDb, `alberr/santri/${payload.santriId}`))
        const s = snap.val()
        if (s) {
          payload.santri = s.santri || s.nama || ''
          payload.maskan = payload.maskan ?? (s.maskan || '')
          payload.kamar  = payload.kamar  ?? (s.kamar  || s.asrama || '')
          payload.jenjang = payload.jenjang ?? (s.jenjang || s.kelas || '')
        }
      } catch { /* ignore */ }
    }
  }

  async function createFault(payload: Omit<FaultRow, 'id'>, opts: { refresh?: boolean } = {}) {
    const { refresh = true } = opts
    const { $realtimeDb } = useNuxtApp()
    const listRef = dbRef($realtimeDb, 'alberr/faults')

    const data: Partial<FaultRow> = {
      santriId: payload.santriId ?? '',
      santri: payload.santri ?? '',
      tanggal: Number(payload.tanggal ?? Date.now()),
      jenis: payload.jenis ?? 'Umum',
      kategori: payload.kategori ?? '',
      poin: Number(payload.poin ?? 0),
      deskripsi: payload.deskripsi ?? '',
      pelapor: payload.pelapor ?? '',
      status: (payload.status ?? 'baru') as FaultStatus,
      tindakan: payload.tindakan ?? '',
      lampiranUrl: payload.lampiranUrl ?? '',
      maskan: payload.maskan ?? '',
      kamar: payload.kamar ?? '',
      jenjang: payload.jenjang ?? ''
    }

    await fillSantriIfNeeded(data)

    const newRef = push(listRef)
    await set(newRef, data)
    if (refresh) await fetchFaults()
    return newRef.key
  }

  async function updateFault(id: string, payload: Partial<Omit<FaultRow, 'id'>>, opts: { refresh?: boolean } = {}) {
    const { refresh = true } = opts
    const { $realtimeDb } = useNuxtApp()
    const nodeRef = dbRef($realtimeDb, `alberr/faults/${id}`)

    const data: any = {}
    if (payload.santriId !== undefined) data.santriId = payload.santriId
    if (payload.santri !== undefined) data.santri = payload.santri
    if (payload.tanggal !== undefined) data.tanggal = Number(payload.tanggal)
    if (payload.jenis !== undefined) data.jenis = payload.jenis
    if (payload.kategori !== undefined) data.kategori = payload.kategori
    if (payload.poin !== undefined) data.poin = Number(payload.poin)
    if (payload.deskripsi !== undefined) data.deskripsi = payload.deskripsi
    if (payload.pelapor !== undefined) data.pelapor = payload.pelapor
    if (payload.status !== undefined) data.status = payload.status
    if (payload.tindakan !== undefined) data.tindakan = payload.tindakan
    if (payload.lampiranUrl !== undefined) data.lampiranUrl = payload.lampiranUrl
    if (payload.maskan !== undefined) data.maskan = payload.maskan
    if (payload.kamar !== undefined) data.kamar = payload.kamar
    if (payload.jenjang !== undefined) data.jenjang = payload.jenjang

    // Jika update hanya isi santriId tanpa santri, coba isi otomatis
    if (!data.santri && (data.santriId || payload.santriId)) {
      const temp: Partial<FaultRow> = { santriId: data.santriId ?? payload.santriId }
      await fillSantriIfNeeded(temp)
      if (temp.santri) data.santri = temp.santri
      if (temp.maskan && data.maskan === undefined) data.maskan = temp.maskan
      if (temp.kamar && data.kamar === undefined) data.kamar = temp.kamar
      if (temp.jenjang && data.jenjang === undefined) data.jenjang = temp.jenjang
    }

    await update(nodeRef, data)
    if (refresh) await fetchFaults()
  }

  async function deleteFault(id: string) {
    const { $realtimeDb } = useNuxtApp()
    const nodeRef = dbRef($realtimeDb, `alberr/faults/${id}`)
    await remove(nodeRef)
    await fetchFaults()
  }

  // Impor CSV (kolom fleksibel), progress per-chunk
  async function importFromExcelWithProgress(
    file: File,
    onProgress: (percent: number, status: string) => void
  ) {
    const pick = (row: any, keys: string[], fallback = '') => {
      for (const k of keys) {
        if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') return row[k]
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
        encoding: 'utf-8',
        chunk: async (results: any) => {
          const data = results.data as any[]
          total += data.length

          for (const row of data) {
            const tglRaw = pick(row, ['Tanggal', 'tanggal', 'Date', 'date'], '')
            const tgl = tglRaw ? Number(new Date(tglRaw).getTime() || Date.now()) : Date.now()

            await createFault({
              santriId: String(pick(row, ['SantriID', 'santriId', 'ID Santri', 'ID'], '')),
              santri:   String(pick(row, ['Santri', 'Nama', 'nama'], '')),
              tanggal:  tgl,
              jenis:    String(pick(row, ['Jenis', 'Pelanggaran', 'jenis'], 'Umum')),
              kategori: String(pick(row, ['Kategori', 'Level'], '')),
              poin:     Number(pick(row, ['Poin', 'Point', 'Skor'], '0')) || 0,
              deskripsi:String(pick(row, ['Deskripsi', 'Keterangan'], '')),
              pelapor:  String(pick(row, ['Pelapor', 'Petugas'], '')),
              status:   (String(pick(row, ['Status'], 'baru')) as FaultStatus),
              tindakan: String(pick(row, ['Tindakan'], '')),
              lampiranUrl: String(pick(row, ['Lampiran', 'LampiranUrl', 'Bukti'], '')),
              maskan:   String(pick(row, ['Maskan'], '')),
              kamar:    String(pick(row, ['Kamar', 'Asrama'], '')),
              jenjang:  String(pick(row, ['Jenjang', 'Kelas'], ''))
            }, { refresh: false })

            done++
            onProgress(Math.min(99, Math.round((done / Math.max(1, total)) * 100)), `Upload ${done} dari ${total} pelanggaran…`)
          }
        },
        complete: async () => {
          await fetchFaults()
          onProgress(100, '✅ Selesai import data pelanggaran')
          resolve()
        },
        error: (err: any) => {
          console.error(err)
          onProgress(0, '❌ Gagal membaca CSV: ' + err.message)
          resolve()
        }
      })
    })
  }

  // Realtime subscription
  function subscribeFaults() {
    _unsubscribe?.()
    _unsubscribe = null

    const { $realtimeDb } = useNuxtApp()
    const ref = dbRef($realtimeDb, 'alberr/faults')
    const cb = (snap: any) => {
      const val = snap.val() || {}
      const list = Object.entries(val).map(([key, v]: any) => normalize(key, v))
      rows.value = list.sort((a, b) => b.tanggal - a.tanggal)
    }
    onValue(ref, cb)
    _unsubscribe = () => off(ref, 'value', cb)
  }

  function unsubscribeFaults() {
     _unsubscribe?.()
    _unsubscribe = null
  }

  const totalPoin = computed(() => rows.value.reduce((acc, r) => acc + (r.poin || 0), 0))
  const unresolvedCount = computed(() => rows.value.filter(r => r.status !== 'selesai').length)

  const summaryBySantri = computed(() => {
    const m = new Map<string, { santriId: string; santri: string; poin: number; count: number }>()
    for (const r of rows.value) {
      const x = m.get(r.santriId) ?? { santriId: r.santriId, santri: r.santri, poin: 0, count: 0 }
      x.poin += r.poin || 0
      x.count += 1
      x.santri = x.santri || r.santri
      m.set(r.santriId, x)
    }
    return Array.from(m.values()).sort((a, b) => b.poin - a.poin)
  })

  const summaryByKategori = computed(() => {
    const m = new Map<string, { kategori: string; poin: number; count: number }>()
    for (const r of rows.value) {
      const k = r.kategori || 'Tidak dikategorikan'
      const x = m.get(k) ?? { kategori: k, poin: 0, count: 0 }
      x.poin += r.poin || 0
      x.count += 1
      m.set(k, x)
    }
    return Array.from(m.values()).sort((a, b) => b.count - a.count)
  })

  function getFaultsBySantri(santriId: string) {
    return rows.value.filter(r => r.santriId === santriId).sort((a, b) => b.tanggal - a.tanggal)
  }

  function faultsOfMonth(year: number, month1to12: number) {
    const start = new Date(year, month1to12 - 1, 1).getTime()
    const end = new Date(year, month1to12, 1).getTime()
    return rows.value.filter(r => r.tanggal >= start && r.tanggal < end).sort((a, b) => b.tanggal - a.tanggal)
  }

  return {
    rows, loading, error,
    fetchFaults, createFault, updateFault, deleteFault,
    importFromExcelWithProgress,
    subscribeFaults, unsubscribeFaults,
    totalPoin, unresolvedCount, summaryBySantri, summaryByKategori,
    getFaultsBySantri, faultsOfMonth
  }
}
