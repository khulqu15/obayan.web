// composables/data/useTeacher.ts
import { ref, computed, onUnmounted } from 'vue'
import { useNuxtApp } from '#app'
import {
  ref as dref,
  query as dquery,
  orderByChild,
  onValue,
  off,
  push,
  set,
  update,
  remove,
  serverTimestamp,
  get,
  equalTo
} from 'firebase/database'
import {
  ref as sref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'

/** ===== Referensi enum & daftar ===== */
export type Jenjang = 'SD' | 'SMP' | 'SMA' | 'SMK'
export type Gender = 'L' | 'P'
export type Agama = 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu' | 'Lainnya'
export type StatusKepegawaian = 'PNS' | 'PPPK' | 'Honorer' | 'GTY/PTY' | 'Karyawan'
export type Jabatan =
  | 'Guru'
  | 'Kepala Sekolah'
  | 'Wakil Kepala Sekolah'
  | 'Wali Kelas'
  | 'Guru BK'
  | 'Kurikulum'
  | 'Kesiswaan'
  | 'Sarpras'
  | 'Humas'
  | 'TU/Operator'

export const SUBJECTS_ID = [
  // SD
  'Tematik', 'Matematika', 'Bahasa Indonesia', 'PPKn', 'PJOK', 'SBdP', 'IPA', 'IPS', 'PAI',
  // SMP/SMA umum
  'Bahasa Inggris', 'Bahasa Jawa', 'Fisika', 'Kimia', 'Biologi', 'Sejarah', 'Geografi', 'Ekonomi', 'Sosiologi',
  'Informatika/TIK', 'Seni Budaya', 'Prakarya', 'BK',
  // SMK keahlian (contoh populer)
  'RPL/Software', 'TKJ/Network', 'Multimedia/DKV', 'TPM/Mesin', 'TSM/Otomotif', 'TKR/Otomotif',
  'Akuntansi', 'Bisnis Daring', 'Perbankan', 'Farmasi', 'Keperawatan'
]

export const JENJANGS: Jenjang[] = ['SD', 'SMP', 'SMA', 'SMK']
export const STATUSES: StatusKepegawaian[] = ['PNS', 'PPPK', 'Honorer', 'GTY/PTY', 'Karyawan']
export const JABATANS: Jabatan[] = [
  'Guru', 'Kepala Sekolah', 'Wakil Kepala Sekolah', 'Wali Kelas', 'Guru BK',
  'Kurikulum', 'Kesiswaan', 'Sarpras', 'Humas', 'TU/Operator'
]

/** ===== Types ===== */
export type TeacherItem = {
  id: string
  nama: string
  nip?: string
  nuptk?: string
  nik?: string
  gender?: Gender
  agama?: Agama
  tempatLahir?: string
  tanggalLahir?: number | null // timestamp (ms)
  alamat?: string
  phone?: string
  email?: string

  jenjang: Jenjang
  mapelUtama?: string
  mapelLain?: string[]        // multi-mapel
  jabatan?: Jabatan[]         // multi
  golongan?: string           // contoh: III/a
  pangkat?: string            // contoh: Penata Muda
  sertifikatPendidik?: string // nomor
  ppgTahun?: string
  pendidikanTerakhir?: 'D3' | 'S1' | 'S2' | 'S3'
  jurusan?: string
  institusi?: string
  tahunLulus?: string

  statusKepegawaian: StatusKepegawaian
  tglMulai?: number | null
  tglSelesai?: number | null
  aktif?: boolean

  homeroomClassId?: string | null // wali kelas (opsional)
  photoUrl?: string | null
  photoPath?: string | null

  createdAt?: number | { '.sv': 'timestamp' }
  updatedAt?: number | { '.sv': 'timestamp' }
}

export type CreateTeacherPayload =
  Omit<TeacherItem, 'id' | 'photoUrl' | 'photoPath' | 'createdAt' | 'updatedAt'> & {
    photoFile?: File | null
  }

export type UpdateTeacherPayload = Partial<CreateTeacherPayload> & {
  removePhoto?: boolean
}

/** ===== Helpers ===== */
function normalizeString(s?: string) {
  return (s || '').trim()
}

export function useTeacher() {
  const nuxtApp = useNuxtApp() as any
  const { $realtimeDb, $storage } = nuxtApp
  const isClient = typeof window !== 'undefined'

  /** ===== State ===== */
  const rows = ref<TeacherItem[]>([])
  const loading = ref(false)
  const error = ref<unknown>(null)

  // Filter & search
  const q = ref('')
  const fJenjang = ref<Jenjang | 'all'>('all')
  const fStatus = ref<StatusKepegawaian | 'all'>('all')
  const fMapel = ref<string | 'all'>('all')
  const fAktif = ref<'all' | 'aktif' | 'nonaktif'>('all')

  /** ===== Subscriptions ===== */
  const unsubList = ref<null | (() => void)>(null)
  function unbindList() {
    if (unsubList.value) { unsubList.value(); unsubList.value = null }
  }
  function bindOnValue(qRef: any) {
    const h = onValue(qRef, (snap) => {
      const list: TeacherItem[] = []
      snap.forEach((ch: any) => {
        const id = ch.key as string
        const d = ch.val() || {}
        list.push({
          id,
          nama: d.nama,
          nip: d.nip, nuptk: d.nuptk, nik: d.nik,
          gender: d.gender, agama: d.agama,
          tempatLahir: d.tempatLahir, tanggalLahir: d.tanggalLahir ?? null,
          alamat: d.alamat, phone: d.phone, email: d.email,
          jenjang: d.jenjang,
          mapelUtama: d.mapelUtama,
          mapelLain: Array.isArray(d.mapelLain) ? d.mapelLain : [],
          jabatan: Array.isArray(d.jabatan) ? d.jabatan : [],
          golongan: d.golongan, pangkat: d.pangkat,
          sertifikatPendidik: d.sertifikatPendidik, ppgTahun: d.ppgTahun,
          pendidikanTerakhir: d.pendidikanTerakhir, jurusan: d.jurusan, institusi: d.institusi, tahunLulus: d.tahunLulus,
          statusKepegawaian: d.statusKepegawaian,
          tglMulai: d.tglMulai ?? null, tglSelesai: d.tglSelesai ?? null,
          aktif: d.aktif !== false,
          homeroomClassId: d.homeroomClassId ?? null,
          photoUrl: d.photoUrl ?? null,
          photoPath: d.photoPath ?? null,
          createdAt: d.createdAt, updatedAt: d.updatedAt
        })
      })
      list.sort(
        (a, b) =>
          (Number(!a.aktif) - Number(!b.aktif)) || (a.nama || '').localeCompare(b.nama || '')
      )
      rows.value = list
    }, (e) => (error.value = e))
    return () => off(qRef, 'value', h as any)
  }

  function subscribeAll() {
    if (!isClient || !$realtimeDb) return
    unbindList()
    const baseRef = dref($realtimeDb, 'alberr/teachers')
    const qRef = dquery(baseRef, orderByChild('nama'))
    unsubList.value = bindOnValue(qRef)
  }

  /** ===== Storage (Foto) ===== */
  async function uploadPhoto(id: string, file: File) {
    if (!isClient || !$storage || !file) return { url: '', path: '' }
    const ext = file.name?.split('.').pop() || 'jpg'
    const path = `alberr/teachers/${id}/photo_${Date.now()}.${ext}`
    const s = sref($storage, path)
    const snap = await uploadBytes(s, file, { contentType: file.type || 'image/jpeg' })
    const url = await getDownloadURL(sref($storage, snap.metadata.fullPath))
    return { url, path: snap.metadata.fullPath }
  }
  async function deletePhoto(path?: string) {
    if (!isClient || !$storage || !path) return
    try { await deleteObject(sref($storage, path)) } catch {}
  }

  /** ===== CRUD ===== */
  async function createTeacher(payload: CreateTeacherPayload) {
    loading.value = true
    try {
      const baseRef = dref($realtimeDb, 'alberr/teachers')
      const node = push(baseRef)
      const id = node.key as string

      const data: any = {
        nama: normalizeString(payload.nama),
        nip: normalizeString(payload.nip),
        nuptk: normalizeString(payload.nuptk),
        nik: normalizeString(payload.nik),
        gender: payload.gender || null,
        agama: payload.agama || null,
        tempatLahir: normalizeString(payload.tempatLahir),
        tanggalLahir: payload.tanggalLahir ?? null,
        alamat: normalizeString(payload.alamat),
        phone: normalizeString(payload.phone),
        email: normalizeString(payload.email),
        jenjang: payload.jenjang,
        mapelUtama: normalizeString(payload.mapelUtama),
        mapelLain: Array.isArray(payload.mapelLain) ? payload.mapelLain : [],
        jabatan: Array.isArray(payload.jabatan) ? payload.jabatan : ['Guru'],
        golongan: normalizeString(payload.golongan),
        pangkat: normalizeString(payload.pangkat),
        sertifikatPendidik: normalizeString(payload.sertifikatPendidik),
        ppgTahun: normalizeString(payload.ppgTahun),
        pendidikanTerakhir: payload.pendidikanTerakhir || 'S1',
        jurusan: normalizeString(payload.jurusan),
        institusi: normalizeString(payload.institusi),
        tahunLulus: normalizeString(payload.tahunLulus),
        statusKepegawaian: payload.statusKepegawaian || 'Honorer',
        tglMulai: payload.tglMulai ?? null,
        tglSelesai: payload.tglSelesai ?? null,
        aktif: payload.aktif !== false,
        homeroomClassId: payload.homeroomClassId ?? null,
        photoUrl: null,
        photoPath: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      await set(node, data)

      if (payload.photoFile) {
        const up = await uploadPhoto(id, payload.photoFile)
        if (up.url) {
          await update(node, { photoUrl: up.url, photoPath: up.path, updatedAt: serverTimestamp() })
        }
      }
      return id
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateTeacher(id: string, patch: UpdateTeacherPayload) {
    loading.value = true
    try {
      const nodeRef = dref($realtimeDb, `alberr/teachers/${id}`)
      let curr: any
      try { curr = (await get(nodeRef)).val() } catch {}

      const data: any = { updatedAt: serverTimestamp() }

      if (patch.nama               !== undefined) data.nama = normalizeString(patch.nama)
      if (patch.nip                !== undefined) data.nip = normalizeString(patch.nip)
      if (patch.nuptk              !== undefined) data.nuptk = normalizeString(patch.nuptk)
      if (patch.nik                !== undefined) data.nik = normalizeString(patch.nik)
      if (patch.gender             !== undefined) data.gender = patch.gender || null
      if (patch.agama              !== undefined) data.agama = patch.agama || null
      if (patch.tempatLahir        !== undefined) data.tempatLahir = normalizeString(patch.tempatLahir)
      if (patch.tanggalLahir       !== undefined) data.tanggalLahir = patch.tanggalLahir ?? null
      if (patch.alamat             !== undefined) data.alamat = normalizeString(patch.alamat)
      if (patch.phone              !== undefined) data.phone = normalizeString(patch.phone)
      if (patch.email              !== undefined) data.email = normalizeString(patch.email)

      if (patch.jenjang            !== undefined) data.jenjang = patch.jenjang
      if (patch.mapelUtama         !== undefined) data.mapelUtama = normalizeString(patch.mapelUtama)
      if (patch.mapelLain          !== undefined) data.mapelLain = Array.isArray(patch.mapelLain) ? patch.mapelLain : []
      if (patch.jabatan            !== undefined) data.jabatan = Array.isArray(patch.jabatan) ? patch.jabatan : []

      if (patch.golongan           !== undefined) data.golongan = normalizeString(patch.golongan)
      if (patch.pangkat            !== undefined) data.pangkat = normalizeString(patch.pangkat)
      if (patch.sertifikatPendidik !== undefined) data.sertifikatPendidik = normalizeString(patch.sertifikatPendidik)
      if (patch.ppgTahun           !== undefined) data.ppgTahun = normalizeString(patch.ppgTahun)
      if (patch.pendidikanTerakhir !== undefined) data.pendidikanTerakhir = patch.pendidikanTerakhir
      if (patch.jurusan            !== undefined) data.jurusan = normalizeString(patch.jurusan)
      if (patch.institusi          !== undefined) data.institusi = normalizeString(patch.institusi)
      if (patch.tahunLulus         !== undefined) data.tahunLulus = normalizeString(patch.tahunLulus)

      if (patch.statusKepegawaian  !== undefined) data.statusKepegawaian = patch.statusKepegawaian
      if (patch.tglMulai           !== undefined) data.tglMulai = patch.tglMulai ?? null
      if (patch.tglSelesai         !== undefined) data.tglSelesai = patch.tglSelesai ?? null
      if (patch.aktif              !== undefined) data.aktif = !!patch.aktif
      if (patch.homeroomClassId    !== undefined) data.homeroomClassId = patch.homeroomClassId ?? null

      // Hapus foto lama bila diminta (dan tidak upload baru)
      if (patch.removePhoto && !patch.photoFile) {
        if (curr?.photoPath) await deletePhoto(curr.photoPath)
        data.photoUrl = null
        data.photoPath = null
      }

      // Upload foto baru
      if (patch.photoFile) {
        if (curr?.photoPath) await deletePhoto(curr.photoPath)
        const up = await uploadPhoto(id, patch.photoFile)
        if (up.url) {
          data.photoUrl = up.url
          data.photoPath = up.path
        }
      }

      await update(nodeRef, data)
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteTeacher(id: string) {
    loading.value = true
    try {
      const nodeRef = dref($realtimeDb, `alberr/teachers/${id}`)
      let curr: any
      try { curr = (await get(nodeRef)).val() } catch {}
      if (curr?.photoPath) await deletePhoto(curr.photoPath)
      await remove(nodeRef)
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  /** ===== Filtering ===== */
  const filtered = computed(() => {
    let list = rows.value.slice()
    if (fJenjang.value !== 'all') list = list.filter(x => x.jenjang === fJenjang.value)
    if (fStatus.value !== 'all') list = list.filter(x => x.statusKepegawaian === fStatus.value)
    if (fMapel.value !== 'all')  list = list.filter(x => x.mapelUtama === fMapel.value || x.mapelLain?.includes(fMapel.value))
    if (fAktif.value === 'aktif') list = list.filter(x => x.aktif !== false)
    if (fAktif.value === 'nonaktif') list = list.filter(x => x.aktif === false)

    const s = q.value.trim().toLowerCase()
    if (s) {
      list = list.filter(x =>
        [
          x.nama, x.nip, x.nuptk, x.phone, x.email, x.mapelUtama, x.golongan, x.pangkat,
          ...(x.mapelLain || []), ...(x.jabatan || [])
        ]
          .join(' ')
          .toLowerCase()
          .includes(s)
      )
    }
    return list
  })

  onUnmounted(() => unbindList())

  return {
    // state
    rows, filtered, loading, error,
    q, fJenjang, fStatus, fMapel, fAktif,

    // refs list
    subscribeAll, unbindList,

    // enums/refs for UI
    SUBJECTS_ID, JENJANGS, STATUSES, JABATANS,

    // CRUD
    createTeacher, updateTeacher, deleteTeacher
  }
}
