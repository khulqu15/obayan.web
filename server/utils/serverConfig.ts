export type DatabaseConfig = {
  host: string
  port: number
  database: string
  user: string
  password: string
  connectionLimit: number
}

export type RedisConfig = {
  enabled: boolean
  url: string
  host: string
  port: number
  password: string
  db: number
  keyPrefix: string
}

export type FirebaseRealtimeConfig = {
  enabled: boolean
  databaseUrl: string
  authToken: string
  ttlHours: number
}

function intEnv(name: string, fallback: number) {
  const value = Number(process.env[name])
  return Number.isFinite(value) ? value : fallback
}

function boolEnv(name: string, fallback = false) {
  const raw = process.env[name]
  if (raw === undefined || raw === '') return fallback
  return ['1', 'true', 'yes', 'on'].includes(String(raw).toLowerCase())
}

export function getClientName() {
  return String(process.env.NUXT_PUBLIC_CLIENT_NAME || 'alinayah').trim() || 'alinayah'
}

export function getDatabaseConfig(): DatabaseConfig {
  return {
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: intEnv('DATABASE_PORT', 3306),
    database: process.env.DATABASE_NAME || process.env.MYSQL_DATABASE || '',
    user: process.env.DATABASE_USER || process.env.MYSQL_USER || 'root',
    password: process.env.DATABASE_PASSWORD || process.env.MYSQL_PASSWORD || '',
    connectionLimit: intEnv('DATABASE_CONNECTION_LIMIT', 10)
  }
}

export function getRedisConfig(): RedisConfig {
  const url = process.env.REDIS_URL || ''
  const host = process.env.REDIS_HOST || '127.0.0.1'

  return {
    enabled: boolEnv('REDIS_ENABLED', true),
    url,
    host,
    port: intEnv('REDIS_PORT', 6379),
    password: process.env.REDIS_PASSWORD || '',
    db: intEnv('REDIS_DB', 0),
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'obayan'
  }
}

export function getFirebaseRealtimeConfig(): FirebaseRealtimeConfig {
  const databaseUrl =
    process.env.FIREBASE_DATABASE_URL ||
    process.env.NUXT_PUBLIC_FIREBASE_DATABASE_URL ||
    'https://hayago-42fbf-default-rtdb.asia-southeast1.firebasedatabase.app'

  return {
    enabled: boolEnv('FIREBASE_REALTIME_ENABLED', true),
    databaseUrl: databaseUrl.replace(/\/+$/, ''),
    authToken: process.env.FIREBASE_DATABASE_AUTH_TOKEN || process.env.FIREBASE_AUTH_TOKEN || '',
    ttlHours: intEnv('FIREBASE_REALTIME_TTL_HOURS', 6)
  }
}

export function getBackupDir() {
  return process.env.BACKUP_DIR || 'storage/backups'
}
