// composables/data/useSettings.ts
import { ref, watch } from 'vue'
import { useNuxtApp } from '#app'
import {
  ref as dbRef,
  onValue,
  update,
  set,
  get,
  serverTimestamp,
  off
} from 'firebase/database'

export type AppSettings = {
  primaryColor: string
  secondaryColor: string
  theme: 'light' | 'dark' | 'system'
  fontScale: number
  density: 'comfortable' | 'compact'
  emailNotifications: boolean
  emailPrimary: string
  emailDailyTime: string
  notifyOn: 'always' | 'only-critical' | 'digest'
  criticalThreshold: number
  locale: string
  dateFormat: string
  timezone: string
  pageSize: number
  smoothAnimations: boolean
  updatedAt?: number
}

const DEFAULTS: AppSettings = {
  primaryColor: '#2563eb',
  secondaryColor: '#eaeaea',
  theme: 'system',
  fontScale: 1,
  density: 'comfortable',
  emailNotifications: false,
  emailPrimary: '',
  emailDailyTime: '07:30',
  notifyOn: 'only-critical',
  criticalThreshold: 80,
  locale: 'id-ID',
  dateFormat: 'dd/MM/yyyy',
  timezone: 'Asia/Jakarta',
  pageSize: 20,
  smoothAnimations: true
}

type UseSettingsOpts = {
  path?: string
  debounceMs?: number
}

export function useSettings(pathOrOpts?: string | UseSettingsOpts) {
  const opts = typeof pathOrOpts === 'string'
    ? { path: pathOrOpts }
    : (pathOrOpts || {})
  const path = opts.path ?? '/alberr/settings'
  const debounceMs = opts.debounceMs ?? 600

  const { $realtimeDb } = useNuxtApp() as any
  const settings = ref<AppSettings>({ ...DEFAULTS })
  const loading = ref(true)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const lastUpdatedAt = ref<number | null>(null)

  const lastLocalWriteAt = ref<number>(0)    // kapan terakhir kita tulis ke DB
  const LOCAL_WRITE_GRACE = 1200             // ms; selama periode ini, abaikan snapshot
  const initialSynced = ref(false)

  let r: any = null
  const attachListener = () => {
    r = dbRef($realtimeDb, path)
    onValue(
      r,
      (snap) => {
        const raw = snap.val()
        const now = Date.now()

        if (!raw) {
          set(r, { ...DEFAULTS, updatedAt: serverTimestamp() }).catch(() => {})
          settings.value = { ...DEFAULTS }
          loading.value = false
          initialSynced.value = true
          return
        }

        // 🔒 kalau kita baru saja nulis (optimistic), jangan timpa UI
        if (now - lastLocalWriteAt.value < LOCAL_WRITE_GRACE) {
          // hanya update timestamp untuk label
          lastUpdatedAt.value = (raw.updatedAt as number) || null
          loading.value = false
          initialSynced.value = true
          return
        }

        // normal apply
        const merged = { ...DEFAULTS, ...raw } as AppSettings
        merged.fontScale = Number(merged.fontScale || 1)
        merged.pageSize = Number(merged.pageSize || 20)
        settings.value = merged
        lastUpdatedAt.value = (raw.updatedAt as number) || null
        loading.value = false
        initialSynced.value = true
      },
      (err) => {
        error.value = err?.message || 'Gagal memuat settings'
        loading.value = false
      }
    )
  }

  const detachListener = () => {
    if (r) { off(r) ; r = null }
  }

  const load = async () => {
    detachListener()
    attachListener()
  }

  const save = async (partial?: Partial<AppSettings>) => {
    saving.value = true
    error.value = null
    try {
      lastLocalWriteAt.value = Date.now()
      await update(dbRef($realtimeDb, path), {
        ...(partial ?? settings.value),
        updatedAt: serverTimestamp()
      })
    } catch (e: any) {
      error.value = e?.message || 'Gagal menyimpan settings (cek Rules/Path)'
    } finally {
      saving.value = false
    }
  }

  // autosave debounced
  let t: any
  watch(
    settings,
    (val) => {
      if (!initialSynced.value) return
      clearTimeout(t)
      const { updatedAt, ...rest } = (val as any)
      t = setTimeout(() => save(rest), debounceMs)
    },
    { deep: true }
  )

  const resetToDefault = async () => {
    saving.value = true
    error.value = null
    try {
      lastLocalWriteAt.value = Date.now()
      await set(dbRef($realtimeDb, path), { ...DEFAULTS, updatedAt: serverTimestamp() })
    } catch (e: any) {
      error.value = e?.message || 'Gagal reset settings'
    } finally {
      saving.value = false
    }
  }

  const exportJson = () => {
    const data = { ...settings.value }
    delete (data as any).updatedAt
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'alberr-settings.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importFromFile = async (file: File) => {
    const text = await file.text()
    const parsed = JSON.parse(text)
    const merged = { ...DEFAULTS, ...(parsed || {}) } as AppSettings
    merged.fontScale = Number(merged.fontScale || 1)
    merged.pageSize = Number(merged.pageSize || 20)
    await save(merged)
  }

  return {
    settings,
    loading,
    saving,
    error,
    lastUpdatedAt,
    load,
    saveNow: () => save(),
    resetToDefault,
    exportJson,
    importFromFile
  }
}
