import { createAppRecordRepository, type ListRecordsOptions } from '../repositories/appRecordRepository'
import { createCacheService } from './cacheService'
import { createFirebaseRealtimeService } from './firebaseRealtimeService'
import { getClientName } from '../utils/serverConfig'

export type SaveDataOptions = {
  realtime?: boolean
  realtimeTtlMs?: number
  expiresAt?: Date | number | string | null
}

export function createAppDataService(collection: string, client = getClientName()) {
  const repository = createAppRecordRepository(collection, client)
  const cache = createCacheService('data', client)
  const realtime = createFirebaseRealtimeService(client)

  return {
    repository,

    async list<T = Record<string, any>>(options: ListRecordsOptions = {}) {
      const cacheKey = [collection, 'list', JSON.stringify(options)]
      const cached = await cache.get<T[]>(cacheKey)
      if (cached) return cached

      const rows = await repository.list<T>(options)
      await cache.set(cacheKey, rows, 120)
      return rows
    },

    async get<T = Record<string, any>>(id: string) {
      const cacheKey = [collection, 'item', id]
      const cached = await cache.get<T>(cacheKey)
      if (cached) return cached

      const row = await repository.findById<T>(id)
      if (row) await cache.set(cacheKey, row, 300)
      return row
    },

    async create<T extends Record<string, any>>(payload: T, options: SaveDataOptions = {}) {
      const row = await repository.upsert<T>(payload, options)
      await cache.forgetCollection(collection)

      if (row && options.realtime !== false) {
        await realtime.publish(collection, row.id, row.data, options.realtimeTtlMs)
      }

      return row
    },

    async update<T extends Record<string, any>>(id: string, patch: Partial<T>, options: SaveDataOptions = {}) {
      const row = await repository.patch<T>(id, patch)
      await cache.forgetCollection(collection)

      if (row && options.realtime !== false) {
        await realtime.publish(collection, row.id, row.data, options.realtimeTtlMs)
      }

      return row
    },

    async delete(id: string, mode: 'soft' | 'hard' = 'soft') {
      await repository.delete(id, mode)
      await cache.forgetCollection(collection)
      await realtime.remove(collection, id)
    }
  }
}
