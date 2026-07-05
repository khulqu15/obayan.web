import { canUseRedis, getRedis } from '../utils/redis'
import { getClientName } from '../utils/serverConfig'

export function createCacheService(namespace: string, client = getClientName()) {
  const base = `${client}:${namespace}`

  function key(parts: string[]) {
    return [base, ...parts].join(':')
  }

  return {
    key,

    async get<T>(parts: string[]) {
      if (!(await canUseRedis())) return null
      const raw = await getRedis()!.get(key(parts))
      if (!raw) return null

      try {
        return JSON.parse(raw) as T
      } catch {
        return null
      }
    },

    async set(parts: string[], value: any, ttlSeconds = 300) {
      if (!(await canUseRedis())) return
      await getRedis()!.set(key(parts), JSON.stringify(value), 'EX', ttlSeconds)
    },

    async del(parts: string[]) {
      if (!(await canUseRedis())) return
      await getRedis()!.del(key(parts))
    },

    async forgetCollection(collection: string) {
      if (!(await canUseRedis())) return

      const redis = getRedis()!
      const pattern = key([collection, '*'])
      const keys = await redis.keys(pattern)
      const prefix = String(redis.options.keyPrefix || '')
      const normalizedKeys = prefix
        ? keys.map((item) => item.startsWith(prefix) ? item.slice(prefix.length) : item)
        : keys
      if (normalizedKeys.length) await redis.del(...normalizedKeys)
    }
  }
}
