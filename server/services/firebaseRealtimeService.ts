import { getFirebaseRealtimeConfig, getClientName } from '../utils/serverConfig'

type RealtimePayload = Record<string, any> & {
  id?: string
  expiresAt?: number
}

function encodePath(path: string) {
  return path
    .split('/')
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join('/')
}

function buildUrl(path: string) {
  const config = getFirebaseRealtimeConfig()
  const token = config.authToken ? `?auth=${encodeURIComponent(config.authToken)}` : ''
  return `${config.databaseUrl}/${encodePath(path)}.json${token}`
}

async function firebaseRequest<T>(path: string, init: RequestInit = {}) {
  const config = getFirebaseRealtimeConfig()
  if (!config.enabled || !config.databaseUrl) return null

  const response = await fetch(buildUrl(path), {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init.headers || {})
    }
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`Firebase realtime request gagal (${response.status}): ${text || response.statusText}`)
  }

  return response.json().catch(() => null) as Promise<T>
}

export function createFirebaseRealtimeService(client = getClientName()) {
  const config = getFirebaseRealtimeConfig()

  return {
    ttlMs: config.ttlHours * 60 * 60 * 1000,

    async publish(collection: string, id: string, payload: RealtimePayload, ttlMs = this.ttlMs) {
      const expiresAt = Date.now() + ttlMs
      const data = {
        ...payload,
        id,
        expiresAt,
        realtimeOnly: true,
        mirroredAt: Date.now()
      }

      await firebaseRequest(`${client}/realtime/${collection}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })

      await firebaseRequest(`${client}/_realtimeTtl/${collection}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          collection,
          id,
          expiresAt
        })
      })
    },

    async remove(collection: string, id: string) {
      await firebaseRequest(`${client}/realtime/${collection}/${id}`, { method: 'DELETE' })
      await firebaseRequest(`${client}/_realtimeTtl/${collection}/${id}`, { method: 'DELETE' })
    },

    async cleanupExpired(now = Date.now()) {
      const index = await firebaseRequest<Record<string, Record<string, { expiresAt?: number }>>>(
        `${client}/_realtimeTtl`,
        { method: 'GET' }
      )

      const removed: Array<{ collection: string; id: string }> = []

      for (const [collection, rows] of Object.entries(index || {})) {
        for (const [id, meta] of Object.entries(rows || {})) {
          if (Number(meta?.expiresAt || 0) > now) continue
          await this.remove(collection, id)
          removed.push({ collection, id })
        }
      }

      return {
        ok: true,
        removed,
        count: removed.length
      }
    }
  }
}
