import { ref as vRef } from 'vue'
import { child, get, ref as dbRef, update } from 'firebase/database'

export const useSettings = (customPath?: string) => {
  const config = useRuntimeConfig()

  const clientName = String(config.public.clientName || 'obayan')

  const basePath = customPath || `${clientName}/settings`

  const loading = vRef(false)
  const error = vRef<string | null>(null)
  const settings = vRef<Record<string, any>>({})

  async function fetchSettings() {
    loading.value = true
    error.value = null

    try {
      const { $realtimeDb } = useNuxtApp()

      const snap = await get(
        child(dbRef($realtimeDb), basePath)
      )

      settings.value = snap.val() || {}
    } catch (e: any) {
      console.error(e)
      error.value = e?.message ?? 'Gagal memuat settings'
    } finally {
      loading.value = false
    }
  }

  async function updateSettings(payload: Record<string, any>) {
    loading.value = true
    error.value = null

    try {
      const { $realtimeDb } = useNuxtApp()

      await update(dbRef($realtimeDb, basePath), payload)

      await fetchSettings()
    } catch (e: any) {
      console.error(e)
      error.value = e?.message ?? 'Gagal menyimpan settings'
    } finally {
      loading.value = false
    }
  }

  return {
    settings,
    loading,
    error,

    fetchSettings,
    load: fetchSettings,

    updateSettings,
  }
}