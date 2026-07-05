import Redis from 'ioredis'
import { getRedisConfig } from './serverConfig'

let redis: Redis | null = null
let redisAvailable: boolean | null = null

export function getRedis() {
  const config = getRedisConfig()

  if (!config.enabled) return null

  if (!redis) {
    redis = config.url
      ? new Redis(config.url, {
          keyPrefix: `${config.keyPrefix}:`,
          lazyConnect: true,
          maxRetriesPerRequest: 1
        })
      : new Redis({
          host: config.host,
          port: config.port,
          password: config.password || undefined,
          db: config.db,
          keyPrefix: `${config.keyPrefix}:`,
          lazyConnect: true,
          maxRetriesPerRequest: 1
        })

    redis.on('error', () => {
      redisAvailable = false
    })
  }

  return redis
}

export async function canUseRedis() {
  const client = getRedis()
  if (!client) return false
  if (redisAvailable === true) return true

  try {
    if (client.status === 'wait') await client.connect()
    await client.ping()
    redisAvailable = true
    return true
  } catch {
    redisAvailable = false
    return false
  }
}
