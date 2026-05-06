import { ref as vRef } from 'vue'
import { get, ref as dbRef, push, set, update, remove, onValue, off } from 'firebase/database'

export type SantriGender = 'L' | 'P' | string

export type SantriDocItem = {
  mode?: 'image' | 'pdf' | string
  url?: string
  secure_url?: string
  secureUrl?: string
  downloadURL?: string
  downloadUrl?: string
  href?: string
  link?: string
  src?: string
  publicId?: string
  public_id?: string
  fileName?: string
  filename?: string
  mimeType?: string
  type?: string
  [key: string]: any
}

export type SantriDokumen = {
  kk?: SantriDocItem | string
  akte?: SantriDocItem | string
  ktpAyah?: SantriDocItem | string
  ktpIbu?: SantriDocItem | string
  kkUrl?: string
  akteUrl?: string
  ktpAyahUrl?: string
  ktpIbuUrl?: string
  [key: string]: any
}

export type SantriPpdbPayload = {
  siswa?: Record<string, any>
  alamat?: Record<string, any>
  pendidikan?: Record<string, any>
  ortu?: Record<string, any>
  wali?: Record<string, any>
  pernyataan?: Record<string, any>
  dokumen?: SantriDokumen
  [key: string]: any
}

export type SantriRow = {
  id: string

  // field ringkas / legacy
  gen: string
  santri: string
  walisantri?: string
  nohp?: string
  kuotaKunjunganBulanIni?: number
  kamar?: string
  alamat?: string
  status?: string | null
  jenjang?: string
  maskan?: string
  rfid?: any
  fingerprint?: any

  // field tambahan untuk pages/app/registration.vue
  gender?: SantriGender
  jk?: SantriGender
  tipe?: 'Putra' | 'Putri' | string

  ppdbCode?: string
  kodePendaftaran?: string
  registrationCode?: string
  username?: string
  publicToken?: string

  nik?: string
  kk?: string
  nisn?: string

  ayahNama?: string
  ibuNama?: string
  waliNama?: string

  hpOrtu1?: string
  hpOrtu2?: string

  dokumen?: SantriDokumen
  documents?: SantriDokumen
  berkas?: SantriDokumen
  dokumenCount?: number

  ppdb?: SantriPpdbPayload

  createdAt?: any
  updatedAt?: any
  acceptedAt?: any
  deletedAt?: any

  [key: string]: any
}

type SantriCreatePayload = Omit<SantriRow, 'id'>
type SantriUpdatePayload = Partial<Omit<SantriRow, 'id'>>

export const useSantri = () => {
  const config = useRuntimeConfig()
  const clientName = String(config.public.clientName || 'alinayah')

  const loading = vRef(false)
  const error = vRef<string | null>(null)
  const rows = vRef<SantriRow[]>([])

  let _unsubscribe: (() => void) | null = null

  function pickValue(...values: any[]) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== '') return value
    }

    return ''
  }

  function extractUrl(value: any) {
    if (!value) return ''
    if (typeof value === 'string') return value

    return String(
      value.url ||
        value.secure_url ||
        value.secureUrl ||
        value.downloadURL ||
        value.downloadUrl ||
        value.href ||
        value.link ||
        value.src ||
        ''
    )
  }

  function compactObject<T extends Record<string, any>>(obj: T): T {
    const output: Record<string, any> = {}

    for (const [key, value] of Object.entries(obj || {})) {
      if (value !== undefined) output[key] = value
    }

    return output as T
  }

  function buildAlamatLengkap(row: any) {
    const a = row?.ppdb?.alamat || row?.alamatDetail || row?.alamat_domisili || {}

    if (typeof row?.alamat === 'string' && row.alamat.trim()) {
      return row.alamat
    }

    return [
      a?.jalan,
      a?.rt ? `RT ${a.rt}` : '',
      a?.rw ? `RW ${a.rw}` : '',
      a?.dusun,
      a?.desa,
      a?.kec,
      a?.kab,
      a?.prov,
      a?.kodepos
    ]
      .filter(Boolean)
      .join(', ')
  }

  function jenjangFromStatus(status: any) {
    const raw = String(status || '').trim()
    const key = raw.toLowerCase()

    const map: Record<string, string> = {
      tk: 'TK',
      ra: 'RA',
      sd: 'SD',
      mi: 'MI',
      smp: 'SMP',
      mts: 'MTs',
      sma: 'SMA',
      smk: 'SMK',
      ma: 'MA',
      madin: 'Madin',
      pondok: 'Pondok',
      umum: 'Umum'
    }

    return map[key] || raw
  }

  function collectDokumen(row: any): SantriDokumen {
    const source =
      row?.dokumen ||
      row?.documents ||
      row?.berkas ||
      row?.ppdb?.dokumen ||
      {}

    return {
      ...source,

      kk:
        source?.kk ||
        source?.kkUrl ||
        row?.kkUrl ||
        row?.dokumen_kk ||
        row?.dokumenkk ||
        '',

      akte:
        source?.akte ||
        source?.akteUrl ||
        row?.akteUrl ||
        row?.dokumen_akte ||
        row?.dokumenakte ||
        '',

      ktpAyah:
        source?.ktpAyah ||
        source?.ktpAyahUrl ||
        row?.ktpAyahUrl ||
        row?.dokumen_ktpAyah ||
        row?.dokumenktpAyah ||
        '',

      ktpIbu:
        source?.ktpIbu ||
        source?.ktpIbuUrl ||
        row?.ktpIbuUrl ||
        row?.dokumen_ktpIbu ||
        row?.dokumenktpIbu ||
        ''
    }
  }

  function countDokumen(row: any) {
    const docs = collectDokumen(row)

    const totalFromDocs = ['kk', 'akte', 'ktpAyah', 'ktpIbu'].filter((key) => {
      return Boolean(extractUrl((docs as any)[key]))
    }).length

    const totalFromRow = Number(row?.dokumenCount || row?.documentCount || 0)

    return Math.max(totalFromDocs, totalFromRow)
  }

  function normalizeSantriRow(key: string, raw: any): SantriRow {
    const v = raw || {}

    const siswa = v?.ppdb?.siswa || {}
    const alamat = v?.ppdb?.alamat || {}
    const pendidikan = v?.ppdb?.pendidikan || {}
    const ortu = v?.ppdb?.ortu || {}
    const ayah = ortu?.ayah || {}
    const ibu = ortu?.ibu || {}
    const wali = v?.ppdb?.wali || {}

    const gender = String(
      pickValue(v.gender, v.jk, siswa.jk, siswa.gender, 'L')
    ).toUpperCase()

    const tipe = pickValue(
      v.tipe,
      gender === 'P' ? 'Putri' : 'Putra'
    )

    const dokumen = collectDokumen(v)
    const alamatLengkap = buildAlamatLengkap(v)

    const normalized: SantriRow = {
      // penting: raw data tetap dibawa supaya detail modal bisa baca semua field
      ...v,

      id: key,

      gen: String(
        pickValue(
          v.gen,
          v.year,
          v.ppdbYear,
          v.tahun,
          new Date().getFullYear()
        )
      ),

      santri: String(
        pickValue(
          v.santri,
          v.nama,
          v.namaSantri,
          siswa.nama,
          siswa.name
        )
      ),

      walisantri: String(
        pickValue(
          v.walisantri,
          v.waliNama,
          v.wali,
          wali.nama,
          ayah.nama,
          ibu.nama,
          v.ortu
        )
      ),

      nohp: String(
        pickValue(
          v.nohp,
          v.no_wa,
          v.whatsapp,
          v.hpOrtu1,
          ortu.hp1,
          wali.hp
        )
      ),

      hpOrtu1: String(
        pickValue(
          v.hpOrtu1,
          ortu.hp1,
          v.nohp,
          v.no_wa,
          v.whatsapp
        )
      ),

      hpOrtu2: String(
        pickValue(
          v.hpOrtu2,
          ortu.hp2
        )
      ),

      kuotaKunjunganBulanIni: Number(
        pickValue(
          v.kuotaKunjunganBulanIni,
          v.kuota_bulan_ini,
          0
        )
      ),

      kamar: String(pickValue(v.kamar, v.asrama)),
      maskan: String(pickValue(v.maskan)),
      status: v.status ?? '',
      alamat: String(pickValue(v.alamat, alamatLengkap)),

      jenjang: String(
        pickValue(
          v.jenjang,
          v.jenjang_pendidikan,
          v.kelas,
          jenjangFromStatus(pendidikan.status),
          pendidikan.status
        )
      ),

      rfid: pickValue(v.rfid),
      fingerprint: pickValue(v.fingerprint),

      gender,
      jk: gender,
      tipe,

      ppdbCode: String(
        pickValue(
          v.ppdbCode,
          v.kodePendaftaran,
          v.registrationCode,
          v.kode,
          v.code
        )
      ),

      kodePendaftaran: String(
        pickValue(
          v.kodePendaftaran,
          v.ppdbCode,
          v.registrationCode,
          v.kode,
          v.code
        )
      ),

      registrationCode: String(
        pickValue(
          v.registrationCode,
          v.ppdbCode,
          v.kodePendaftaran,
          v.kode,
          v.code
        )
      ),

      username: String(pickValue(v.username, v.userName)),
      publicToken: String(pickValue(v.publicToken, v.token)),

      nik: String(pickValue(v.nik, siswa.nik)),
      kk: String(pickValue(v.kk, siswa.kk)),
      nisn: String(pickValue(v.nisn, siswa.nisn)),

      ayahNama: String(pickValue(v.ayahNama, ayah.nama)),
      ibuNama: String(pickValue(v.ibuNama, ibu.nama)),
      waliNama: String(pickValue(v.waliNama, wali.nama)),

      dokumen,
      dokumenCount: countDokumen(v),

      ppdb: {
        ...(v.ppdb || {}),
        siswa: {
          ...(siswa || {})
        },
        alamat: {
          ...(alamat || {})
        },
        pendidikan: {
          ...(pendidikan || {})
        },
        ortu: {
          ...(ortu || {})
        },
        wali: {
          ...(wali || {})
        },
        dokumen: {
          ...(v?.ppdb?.dokumen || {}),
          ...dokumen
        }
      }
    }

    return normalized
  }

  function mapRows(val: any) {
    return Object.entries(val || {}).map(([key, value]: any) => {
      return normalizeSantriRow(key, value)
    })
  }

  async function fetchSantri() {
    loading.value = true
    error.value = null

    try {
      const { $realtimeDb } = useNuxtApp()
      const snapshot = await get(dbRef($realtimeDb, `${clientName}/santri`))
      const val = snapshot.val() || {}

      rows.value = mapRows(val)
    } catch (e: any) {
      console.error(e)
      error.value = e?.message ?? 'Gagal memuat data santri.'
    } finally {
      loading.value = false
    }
  }

  async function getSantriById(id: string) {
    if (!id) return null

    loading.value = true
    error.value = null

    try {
      const { $realtimeDb } = useNuxtApp()
      const snapshot = await get(dbRef($realtimeDb, `${clientName}/santri/${id}`))

      if (!snapshot.exists()) return null

      return normalizeSantriRow(id, snapshot.val())
    } catch (e: any) {
      console.error(e)
      error.value = e?.message ?? 'Gagal memuat detail santri.'
      return null
    } finally {
      loading.value = false
    }
  }

  async function createSantri(payload: SantriCreatePayload, opts: { refresh?: boolean } = {}) {
    const { refresh = true } = opts
    const { $realtimeDb } = useNuxtApp()

    const listRef = dbRef($realtimeDb, `${clientName}/santri`)
    const newRef = push(listRef)

    const data = compactObject({
      ...payload,

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
      rfid: payload.rfid ?? '',
      fingerprint: payload.fingerprint ?? '',
      dokumenCount: Number(payload.dokumenCount ?? countDokumen(payload)),
      createdAt: payload.createdAt ?? Date.now(),
      updatedAt: Date.now()
    })

    await set(newRef, data)

    if (refresh) await fetchSantri()

    return newRef.key
  }

  async function updateSantri(
    id: string,
    payload: SantriUpdatePayload,
    opts: { refresh?: boolean } = {}
  ) {
    const { refresh = true } = opts

    if (!id) throw new Error('ID santri tidak valid.')

    const { $realtimeDb } = useNuxtApp()
    const nodeRef = dbRef($realtimeDb, `${clientName}/santri/${id}`)

    const data = compactObject({
      ...payload,
      updatedAt: Date.now()
    })

    /**
     * Catatan:
     * update() Firebase hanya menimpa key yang dikirim.
     * Jadi kalau pages/app/registration.vue edit data ringkas,
     * field nested seperti ppdb.siswa, ppdb.alamat, ppdb.ortu, dan dokumen tidak akan hilang
     * selama tidak dikirim sebagai undefined/null secara eksplisit.
     */
    await update(nodeRef, data)

    if (refresh) await fetchSantri()
  }

  async function deleteSantri(id: string) {
    if (!id) return

    const { $realtimeDb } = useNuxtApp()
    const nodeRef = dbRef($realtimeDb, `${clientName}/santri/${id}`)

    await remove(nodeRef)
    await fetchSantri()
  }

  function subscribeSantri() {
    const { $realtimeDb } = useNuxtApp()
    const santriRef = dbRef($realtimeDb, `${clientName}/santri`)

    const cb = (snap: any) => {
      const val = snap.val() || {}
      rows.value = mapRows(val)
    }

    if (_unsubscribe) _unsubscribe()

    onValue(santriRef, cb, (e: any) => {
      console.error(e)
      error.value = e?.message ?? 'Gagal subscribe data santri.'
    })

    _unsubscribe = () => off(santriRef, 'value', cb)
  }

  function unsubscribeSantri() {
    _unsubscribe?.()
    _unsubscribe = null
  }

  async function importFromExcelWithProgress(
    file: File,
    onProgress: (percent: number, status: string) => void
  ) {
    if (import.meta.server) {
      throw new Error('Import data hanya bisa dijalankan di browser.')
    }

    const XLSXModule = await import('xlsx')
    const XLSX = XLSXModule.default || XLSXModule

    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    let rowsRaw: any[] = []

    if (ext === 'csv') {
      const text = await file.text()
      const wb = XLSX.read(text, { type: 'string' })
      const sheet = wb.Sheets[wb.SheetNames[0]!]
      rowsRaw = XLSX.utils.sheet_to_json(sheet!, { defval: '' })
    } else {
      const buf = await file.arrayBuffer()
      const wb = XLSX.read(buf, { type: 'array' })
      const sheet = wb.Sheets[wb.SheetNames[0]!]
      rowsRaw = XLSX.utils.sheet_to_json(sheet!, { defval: '' })
    }

    const pick = (row: any, keys: string[], fallback = '') => {
      for (const k of keys) {
        if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') {
          return row[k]
        }
      }

      return fallback
    }

    const total = rowsRaw.length
    const BATCH = 200
    let done = 0

    for (let i = 0; i < total; i += BATCH) {
      const batch = rowsRaw.slice(i, i + BATCH)

      for (const row of batch) {
        const gender = String(pick(row, ['Gender', 'Jenis Kelamin', 'JK', 'jk'], 'L')).toUpperCase()
        const tipe = gender === 'P' || gender === 'PUTRI' || gender === 'PEREMPUAN'
          ? 'Putri'
          : 'Putra'

        await createSantri(
          {
            gen: String(pick(row, ['Gen', 'gen', 'Tahun', 'Year'], '')),
            santri: String(pick(row, ['Nama', 'Nama Santri', 'santri', 'nama'], '')),
            walisantri: String(pick(row, ['Wali', 'Wali Santri', 'Nama Ayah', 'wali', 'ortu'], '')),
            nohp: String(pick(row, ['No HP', 'No. HP', 'Nomor Telp', 'Nomor WA', 'nohp', 'whatsapp'], '')),
            kuotaKunjunganBulanIni: Number(pick(row, ['Kuota', 'Kuota Kunjungan', 'Kuota Kunjungan (bulan ini)', 'kuota'], '2')) || 2,
            kamar: String(pick(row, ['Kamar', 'Asrama', 'kamar'], '')),
            maskan: String(pick(row, ['Maskan', 'maskan'], '')),
            alamat: String(pick(row, ['Alamat ', 'Alamat', ' Alamat', 'alamat'], '')),
            status: String(pick(row, ['Status', 'status'], '')),
            jenjang: String(pick(row, ['Jenjang', 'Kelas', 'Kelas Formal', 'jenjang'], '')),
            rfid: String(pick(row, ['RFID', 'Rfid', 'rfid'], '')),
            fingerprint: String(pick(row, ['Fingerprint', 'fingerprint', 'FINGERPRINT'], '')),

            gender: gender === 'PEREMPUAN' ? 'P' : gender === 'LAKI-LAKI' ? 'L' : gender,
            jk: gender === 'PEREMPUAN' ? 'P' : gender === 'LAKI-LAKI' ? 'L' : gender,
            tipe,

            ppdbCode: String(pick(row, ['No Pendaftaran', 'Nomor Pendaftaran', 'Kode Pendaftaran', 'ppdbCode'], '')),
            nik: String(pick(row, ['NIK', 'nik'], '')),
            kk: String(pick(row, ['KK', 'No KK', 'No. KK', 'kk'], '')),
            nisn: String(pick(row, ['NISN', 'nisn'], '')),
            ayahNama: String(pick(row, ['Nama Ayah', 'Ayah', 'ayahNama'], '')),
            ibuNama: String(pick(row, ['Nama Ibu', 'Ibu', 'ibuNama'], '')),

            ppdb: {
              siswa: {
                nama: String(pick(row, ['Nama', 'Nama Santri', 'santri', 'nama'], '')),
                jk: gender === 'PEREMPUAN' ? 'P' : gender === 'LAKI-LAKI' ? 'L' : gender,
                nik: String(pick(row, ['NIK', 'nik'], '')),
                kk: String(pick(row, ['KK', 'No KK', 'No. KK', 'kk'], '')),
                nisn: String(pick(row, ['NISN', 'nisn'], ''))
              },
              alamat: {
                jalan: String(pick(row, ['Alamat ', 'Alamat', ' Alamat', 'alamat'], ''))
              },
              pendidikan: {
                status: String(pick(row, ['Jenjang', 'Kelas', 'Kelas Formal', 'jenjang'], ''))
              },
              ortu: {
                hp1: String(pick(row, ['No HP', 'No. HP', 'Nomor Telp', 'Nomor WA', 'nohp', 'whatsapp'], '')),
                ayah: {
                  nama: String(pick(row, ['Nama Ayah', 'Ayah', 'ayahNama'], ''))
                },
                ibu: {
                  nama: String(pick(row, ['Nama Ibu', 'Ibu', 'ibuNama'], ''))
                }
              }
            }
          },
          { refresh: false }
        )

        done++
      }

      onProgress(
        Math.min(99, Math.round((done / Math.max(1, total)) * 100)),
        `Upload ${done} dari ${total} santri…`
      )

      await Promise.resolve()
    }

    await fetchSantri()
    onProgress(100, '✅ Selesai import data santri')
  }

  return {
    rows,
    loading,
    error,

    fetchSantri,
    getSantriById,
    createSantri,
    updateSantri,
    deleteSantri,

    importFromExcelWithProgress,

    subscribeSantri,
    unsubscribeSantri
  }
}