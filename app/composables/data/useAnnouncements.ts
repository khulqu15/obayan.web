// composables/data/useAnnouncements.ts
import { ref as vRef, computed } from 'vue'
import { get, ref as dbRef, push, set, update, remove, onValue, off } from 'firebase/database'
import Papa from 'papaparse'

export type AnnouncementLevel = 'info' | 'warning' | 'urgent'

export type AnnouncementRow = {
  id: string
  title: string
  message: string

  // jadwal
  days: number[]         // 0=Min, 1=Sen, ..., 6=Sab (JS standard)
  times: string[]        // ["07:00","12:30", ...] 24 jam
  startDate?: number|null
  endDate?: number|null
  active?: boolean

  // metadata
  category?: string      // bebas (mis. "umum"/"event"/"darurat")
  level?: AnnouncementLevel

  // TTS
  ttsEnabled?: boolean
  ttsLang?: string       // default "id-ID"
  ttsVoice?: string      // bebas: "male"/"female"/"id-ID-Wavenet-A" (tergantung implementasi client)
  ttsRate?: number       // 0.5..2
  ttsPitch?: number      // 0..2
  speakerChannel?: string // "main" / "masjid" / "asrama" dll.

  // bookkeeping
  createdAt?: number
  updatedAt?: number
  lastAnnouncedAt?: number|null
}

const INDO_DOW: Record<string, number> = {
  'minggu': 0, 'ahad': 0, 'min': 0,
  'senin': 1, 'sen': 1,
  'selasa': 2, 'sel': 2,
  'rabu': 3,
  'kamis': 4,
  'jumat': 5, 'jum’at': 5, 'jum\'at': 5, 'jumat\'' : 5, 'jum': 5,
  'sabtu': 6, 'sab': 6
}

const DOW_LABEL_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

function clampTimeStr(s: string): string | null {
  // Normalisasi "7:0" -> "07:00", validasi "HH:mm"
  const m = String(s || '').trim().match(/^(\d{1,2}):(\d{1,2})$/)
  if (!m) return null
  let hh = parseInt(m[1], 10)
  let mm = parseInt(m[2], 10)
  if (isNaN(hh) || isNaN(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) return null
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(hh)}:${pad(mm)}`
}

function parseTimes(input: any): string[] {
  if (Array.isArray(input)) return input.map(clampTimeStr).filter(Boolean) as string[]
  const str = String(input || '')
  if (!str) return []
  return str.split(/[;,|]/).map(t => clampTimeStr(t)).filter(Boolean) as string[]
}

function parseDays(input: any): number[] {
  if (Array.isArray(input)) {
    // angka langsung (0..6) atau nama
    const xs = input.map(x => {
      if (typeof x === 'number') return x
      const k = String(x || '').trim().toLowerCase()
      if (k in INDO_DOW) return INDO_DOW[k]
      return NaN
    }).filter(n => !isNaN(n) && n >= 0 && n <= 6)
    return Array.from(new Set(xs))
  }
  const raw = String(input || '').trim().toLowerCase()
  if (!raw) return []
  if (['harian', 'setiap hari', 'daily', 'semua', 'all'].includes(raw)) return [0,1,2,3,4,5,6]
  const parts = raw.split(/[;,|]/).map(s => s.trim()).filter(Boolean)
  const xs = parts.map(p => {
    // coba angka
    const num = Number(p)
    if (!isNaN(num) && num >= 0 && num <= 6) return num
    // coba nama indo
    if (p in INDO_DOW) return INDO_DOW[p]
    // coba singkatan "sen/rab/jum"
    const key = p.replace(/\.$/, '')
    if (key in INDO_DOW) return INDO_DOW[key]
    return NaN
  }).filter(n => !isNaN(n))
  return Array.from(new Set(xs))
}

function nowLocalHHmm(d = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function normalizeAnnouncement(id: string, v: any): AnnouncementRow {
  return {
    id,
    title: String(v.title ?? v.judul ?? ''),
    message: String(v.message ?? v.text ?? v.pesan ?? ''),
    days: Array.isArray(v.days) ? v.days : parseDays(v.days ?? v.hari ?? v.hariList),
    times: Array.isArray(v.times) ? v.times : parseTimes(v.times ?? v.jam ?? v.jamList),
    startDate: (v.startDate ?? null) ? Number(v.startDate) : null,
    endDate: (v.endDate ?? null) ? Number(v.endDate) : null,
    active: v.active !== false, // default true
    category: String(v.category ?? v.kategori ?? ''),
    level: (v.level ?? 'info') as AnnouncementLevel,

    ttsEnabled: v.ttsEnabled !== false,
    ttsLang: v.ttsLang ?? 'id-ID',
    ttsVoice: v.ttsVoice ?? '',
    ttsRate: Number(v.ttsRate ?? 1),
    ttsPitch: Number(v.ttsPitch ?? 1),
    speakerChannel: v.speakerChannel ?? 'main',

    createdAt: Number(v.createdAt ?? Date.now()),
    updatedAt: Number(v.updatedAt ?? Date.now()),
    lastAnnouncedAt: (v.lastAnnouncedAt ?? null) ? Number(v.lastAnnouncedAt) : null
  }
}

export const useAnnouncements = () => {
  const loading = vRef(false)
  const error = vRef<string | null>(null)
  const rows = vRef<AnnouncementRow[]>([])
  let _unsubscribe: (() => void) | null = null

  async function fetchAnnouncements() {
    loading.value = true
    error.value = null
    try {
      const { $realtimeDb } = useNuxtApp()
      const snap = await get(dbRef($realtimeDb, 'alberr/announcements'))
      const val = snap.val() || {}
      const list = Object.entries(val).map(([key, v]: any) => normalizeAnnouncement(key, v))
      // urut level urgent dulu, lalu warning, lalu info; di dalamnya by title
      const levelOrder: Record<AnnouncementLevel, number> = { urgent: 0, warning: 1, info: 2 }
      rows.value = list.sort((a, b) => {
        const la = levelOrder[a.level || 'info']
        const lb = levelOrder[b.level || 'info']
        if (la !== lb) return la - lb
        return (a.title || '').localeCompare(b.title || '', 'id')
      })
    } catch (e: any) {
      console.error(e)
      error.value = e?.message ?? 'Gagal memuat pengumuman'
    } finally {
      loading.value = false
    }
  }

  async function createAnnouncement(payload: Omit<AnnouncementRow, 'id' | 'createdAt' | 'updatedAt'>, opts: { refresh?: boolean } = {}) {
    const { refresh = true } = opts
    const { $realtimeDb } = useNuxtApp()
    const listRef = dbRef($realtimeDb, 'alberr/announcements')

    const data: Partial<AnnouncementRow> = {
      title: payload.title ?? '',
      message: payload.message ?? '',
      days: Array.isArray(payload.days) ? payload.days : [],
      times: Array.isArray(payload.times) ? payload.times : [],
      startDate: payload.startDate ?? null,
      endDate: payload.endDate ?? null,
      active: payload.active !== false,

      category: payload.category ?? '',
      level: (payload.level ?? 'info') as AnnouncementLevel,

      ttsEnabled: payload.ttsEnabled !== false,
      ttsLang: payload.ttsLang ?? 'id-ID',
      ttsVoice: payload.ttsVoice ?? '',
      ttsRate: payload.ttsRate ?? 1,
      ttsPitch: payload.ttsPitch ?? 1,
      speakerChannel: payload.speakerChannel ?? 'main',

      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastAnnouncedAt: payload.lastAnnouncedAt ?? null
    }

    // normalisasi jam/hari
    data.times = (data.times || []).map(t => clampTimeStr(String(t)!)).filter(Boolean) as string[]
    data.days = Array.from(new Set((data.days || []).filter(d => d >= 0 && d <= 6))) as number[]

    const newRef = push(listRef)
    await set(newRef, data)
    if (refresh) await fetchAnnouncements()
    return newRef.key
  }

  async function updateAnnouncement(id: string, payload: Partial<Omit<AnnouncementRow, 'id'>>, opts: { refresh?: boolean } = {}) {
    const { refresh = true } = opts
    const { $realtimeDb } = useNuxtApp()
    const nodeRef = dbRef($realtimeDb, `alberr/announcements/${id}`)

    const data: any = { updatedAt: Date.now() }
    const assign = (k: keyof AnnouncementRow) => { if ((payload as any)[k] !== undefined) data[k] = (payload as any)[k] }
    ;[
      'title','message','days','times','startDate','endDate','active',
      'category','level',
      'ttsEnabled','ttsLang','ttsVoice','ttsRate','ttsPitch','speakerChannel',
      'lastAnnouncedAt'
    ].forEach(k => assign(k as keyof AnnouncementRow))

    if (data.times) data.times = parseTimes(data.times)
    if (data.days) data.days = parseDays(data.days)

    await update(nodeRef, data)
    if (refresh) await fetchAnnouncements()
  }

  async function deleteAnnouncement(id: string) {
    const { $realtimeDb } = useNuxtApp()
    const nodeRef = dbRef($realtimeDb, `alberr/announcements/${id}`)
    await remove(nodeRef)
    await fetchAnnouncements()
  }

  // Tandai sudah diumumkan (untuk menghindari double-trigger pada window waktu yang sama)
  async function markAnnounced(id: string, ts: number = Date.now()) {
    await updateAnnouncement(id, { lastAnnouncedAt: ts }, { refresh: false })
  }

  // --- Import CSV (header fleksibel): Title, Message, Days, Times, Level, Category, Active, StartDate, EndDate, TTS* ---
  async function importFromExcelWithProgress(
    file: File,
    onProgress: (percent: number, status: string) => void
  ) {
    const pick = (row: any, keys: string[], fallback: any = '') => {
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
            const daysRaw = pick(row, ['Days', 'Hari', 'days', 'hari', 'HariList'], '')
            const timesRaw = pick(row, ['Times', 'Jam', 'times', 'jam', 'JamList'], '')
            const startRaw = pick(row, ['StartDate','Mulai'], '')
            const endRaw = pick(row, ['EndDate','Selesai'], '')

            const days = parseDays(daysRaw)
            const times = parseTimes(timesRaw)
            const startDate = startRaw ? Number(new Date(startRaw).getTime() || 0) : null
            const endDate   = endRaw   ? Number(new Date(endRaw).getTime() || 0)   : null

            await createAnnouncement({
              title:   String(pick(row, ['Title','Judul'], '')),
              message: String(pick(row, ['Message','Pesan','Text'], '')),
              days, times,
              startDate: startDate || null,
              endDate: endDate || null,
              active: String(pick(row, ['Active','Aktif'], 'true')).toLowerCase() !== 'false',
              category: String(pick(row, ['Category','Kategori'], '')),
              level: (String(pick(row, ['Level'], 'info')).toLowerCase() as AnnouncementLevel),
              ttsEnabled: String(pick(row, ['TTSEnabled','TTS'], 'true')).toLowerCase() !== 'false',
              ttsLang: String(pick(row, ['TTSLang'], 'id-ID')),
              ttsVoice: String(pick(row, ['TTSVoice'], '')),
              ttsRate: Number(pick(row, ['TTSRate'], 1)) || 1,
              ttsPitch: Number(pick(row, ['TTSPitch'], 1)) || 1,
              speakerChannel: String(pick(row, ['Channel','Speaker','SpeakerChannel'], 'main'))
            }, { refresh: false })

            done++
            onProgress(Math.min(99, Math.round((done / Math.max(1, total)) * 100)), `Upload ${done} dari ${total} pengumuman…`)
          }
        },
        complete: async () => {
          await fetchAnnouncements()
          onProgress(100, '✅ Selesai import pengumuman')
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

  // --- Realtime subscription ---
  function subscribeAnnouncements() {
    // hapus listener lama jika ada
    _unsubscribe?.()
    _unsubscribe = null

    const { $realtimeDb } = useNuxtApp()
    const ref = dbRef($realtimeDb, 'alberr/announcements')
    const cb = (snap: any) => {
      const val = snap.val() || {}
      const list = Object.entries(val).map(([key, v]: any) => normalizeAnnouncement(key, v))
      const levelOrder: Record<AnnouncementLevel, number> = { urgent: 0, warning: 1, info: 2 }
      rows.value = list.sort((a, b) => {
        const la = levelOrder[a.level || 'info']
        const lb = levelOrder[b.level || 'info']
        if (la !== lb) return la - lb
        return (a.title || '').localeCompare(b.title || '', 'id')
      })
    }
    onValue(ref, cb)
    _unsubscribe = () => off(ref, 'value', cb)
  }

  function unsubscribeAnnouncements() {
    _unsubscribe?.()
    _unsubscribe = null
  }

  // --- Helpers jadwal ---
  const summaryByLevel = computed(() => {
    const m = new Map<AnnouncementLevel, number>()
    for (const r of rows.value) {
      const lv = (r.level || 'info') as AnnouncementLevel
      m.set(lv, (m.get(lv) || 0) + 1)
    }
    return Array.from(m.entries()).map(([level, count]) => ({ level, count }))
  })

  function daysLabel(days: number[]) {
    if (!days?.length) return '-'
    if (days.length === 7) return 'Setiap hari'
    return days.slice().sort((a,b)=>a-b).map(d => DOW_LABEL_ID[d]).join(', ')
  }

  function scheduleLabel(r: AnnouncementRow) {
    const t = (r.times || []).join(', ')
    return `${daysLabel(r.days || [])} @ ${t || '-'}`
  }

  // Dapatkan pengumuman yang due pada "now" dalam window toleransi detik (mis. dipanggil tiap menit)
  function getDueAnnouncements(now: Date = new Date(), windowSec = 59): AnnouncementRow[] {
    const res: AnnouncementRow[] = []
    const dow = now.getDay() // 0..6
    const hhmm = nowLocalHHmm(now)
    const nowMs = now.getTime()

    for (const r of rows.value) {
      if (r.active === false) continue

      // periode aktif
      if (r.startDate && nowMs < r.startDate) continue
      if (r.endDate && nowMs > r.endDate) continue

      // hari cocok?
      const days = r.days || []
      if (days.length && !days.includes(dow)) continue

      // jam cocok dalam window?
      const times = r.times || []
      for (const t of times) {
        if (!t) continue
        const [H, M] = t.split(':').map(n => parseInt(n, 10))
        const scheduled = new Date(now)
        scheduled.setHours(H, M, 0, 0)
        const diff = Math.abs(nowMs - scheduled.getTime())
        if (diff <= windowSec * 1000) {
          // hindari double-trigger jika barusan diumumkan
          if (!r.lastAnnouncedAt || Math.abs(nowMs - r.lastAnnouncedAt) > windowSec * 1000) {
            res.push(r)
          }
        }
      }
    }
    return res
  }

  // Hitung beberapa jadwal berikutnya untuk 1 pengumuman (misal preview di UI)
  function nextOccurrencesOf(r: AnnouncementRow, count = 5, from: Date = new Date()): Date[] {
    const out: Date[] = []
    if (r.active === false || !r.times?.length || !r.days?.length) return out

    const start = new Date(from)
    const maxSpanDays = 60 // batasi pencarian
    for (let d = 0; d <= maxSpanDays && out.length < count; d++) {
      const cur = new Date(start)
      cur.setDate(start.getDate() + d)
      const dow = cur.getDay()
      if (!r.days.includes(dow)) continue
      for (const t of r.times) {
        const [H, M] = t.split(':').map(n => parseInt(n, 10))
        const dt = new Date(cur)
        dt.setHours(H, M, 0, 0)
        const ms = dt.getTime()
        if (r.startDate && ms < r.startDate) continue
        if (r.endDate && ms > r.endDate) continue
        if (ms >= from.getTime()) out.push(dt)
        if (out.length >= count) break
      }
    }
    return out.sort((a,b)=>a.getTime()-b.getTime())
  }

  const nextSchedulePreview = computed(() => {
    // gabungan preview 1x per item (tanggal terdekat)
    return rows.value.map(r => {
      const next = nextOccurrencesOf(r, 1)[0]
      return { id: r.id, title: r.title, when: next ? next.toLocaleString('id-ID') : '-' }
    })
  })

  return {
    rows, loading, error,
    fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement,
    importFromExcelWithProgress, subscribeAnnouncements, unsubscribeAnnouncements,
    markAnnounced,summaryByLevel, daysLabel, scheduleLabel,
    getDueAnnouncements, nextOccurrencesOf, nextSchedulePreview
  }
}

export { useAnnouncements as useAnnoucements }
