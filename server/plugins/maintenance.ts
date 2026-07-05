import { createMonthlyBackup } from '../services/backupService'
import { createFirebaseRealtimeService } from '../services/firebaseRealtimeService'
import { getClientName } from '../utils/serverConfig'

let started = false

function enabled(name: string) {
  return ['1', 'true', 'yes', 'on'].includes(String(process.env[name] || '').toLowerCase())
}

export default defineNitroPlugin(() => {
  if (started || !enabled('AUTO_MAINTENANCE_ENABLED')) return
  started = true

  const client = getClientName()
  const cleanupMinutes = Number(process.env.FIREBASE_CLEANUP_INTERVAL_MINUTES || 30)
  const cleanupIntervalMs = Math.max(cleanupMinutes, 5) * 60 * 1000

  setInterval(() => {
    createFirebaseRealtimeService(client).cleanupExpired().catch((error) => {
      console.error('[maintenance] firebase cleanup failed', error)
    })
  }, cleanupIntervalMs).unref()

  setInterval(() => {
    const now = new Date()
    const day = Number(process.env.MONTHLY_BACKUP_DAY || 1)
    const hour = Number(process.env.MONTHLY_BACKUP_HOUR || 2)

    if (now.getDate() !== day || now.getHours() !== hour) return

    createMonthlyBackup({ client, date: now }).catch((error) => {
      console.error('[maintenance] monthly backup failed', error)
    })
  }, 60 * 60 * 1000).unref()
})
