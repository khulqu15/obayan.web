import { ref as vRef } from 'vue'
import { useNuxtApp } from '#app'
import { get, ref as dbRef, update } from 'firebase/database'

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
const TZ_JKT = 'Asia/Jakarta'
function tzYearFromMs(ms: number, tz = TZ_JKT) {
  return Number(new Intl.DateTimeFormat('en-CA', { timeZone: tz, year:'numeric' }).format(new Date(ms)))
}

export const usePendaftaran = () => {
  const loading = vRef(false)
  const error   = vRef<string | null>(null)
  const allRows = vRef<PendaftaranRow[]>([])
  const calonRows = vRef<PendaftaranRow[]>([])
  const baruRows  = vRef<PendaftaranRow[]>([])
  const settings  = vRef<PendaftaranSettings>({
    isClosed: false, autoCloseEnabled: false, autoCloseAt: null, year: tzYearFromMs(Date.now())
  })

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
      const y = settings.value.year || tzYearFromMs(Date.now())
      const isCalonThisYear = (r:PendaftaranRow) => String(r.gen) === String(y) && String(r.status).toLowerCase()==='nonaktif'
      const isBaruThisYear  = (r:PendaftaranRow) => String(r.gen) === String(y) && String(r.status).toLowerCase()!=='nonaktif'
      calonRows.value = rows.filter(isCalonThisYear)
      baruRows.value  = rows.filter(isBaruThisYear)
    } catch (e:any) {
      console.error(e); error.value = e?.message ?? 'Gagal memuat data'
    } finally { loading.value = false }
  }

  async function fetchSettings() {
    try {
      const { $realtimeDb } = useNuxtApp() as any
      const snap = await get(dbRef($realtimeDb, SETTINGS_PATH))
      const v = snap.val()
      if (v && typeof v === 'object') {
        settings.value = {
          isClosed: !!v.isClosed,
          autoCloseEnabled: !!v.autoCloseEnabled,
          autoCloseAt: v.autoCloseAt || null,
          year: Number(v.year || settings.value.year),
          updatedAt: Number(v.updatedAt || Date.now()),
        }
      }
    } catch (e) {
      console.error('[fetchSettings] failed', e)
    }
  }

  async function saveSettings(partial: Partial<PendaftaranSettings>) {
    const next: PendaftaranSettings = { ...settings.value, ...partial, updatedAt: Date.now() }
    if (next.autoCloseAt && typeof next.autoCloseAt === 'string') {
      const ms = Date.parse(next.autoCloseAt)
      if (Number.isNaN(ms)) next.autoCloseAt = null
    }
    try {
      const { $realtimeDb } = useNuxtApp() as any
      await update(dbRef($realtimeDb, SETTINGS_PATH), next as any)
      settings.value = next
    } catch (e) {
      console.error('[saveSettings] failed', e)
      throw e
    }
  }

  return { loading, error, allRows, calonRows, baruRows, settings, fetchAll, fetchSettings, saveSettings }
}
