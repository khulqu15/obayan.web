import type { RowDataPacket } from 'mysql2'
import { randomUUID } from 'node:crypto'
import { mysqlExec, mysqlRows } from '../utils/mysql'
import { getClientName } from '../utils/serverConfig'

export type AppRecord<T = Record<string, any>> = {
  id: string
  client: string
  collection: string
  data: T
  createdAt: string
  updatedAt: string
  expiresAt: string | null
}

type RecordRow = RowDataPacket & {
  id: string
  client: string
  collection: string
  data: string | Record<string, any>
  created_at: string
  updated_at: string
  expires_at: string | null
}

export type ListRecordsOptions = {
  client?: string
  limit?: number
  offset?: number
  includeExpired?: boolean
  q?: string
}

function normalizeCollection(collection: string) {
  const value = String(collection || '').trim()
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(value)) {
    throw new Error('Nama collection tidak valid.')
  }

  return value
}

function toMysqlDate(value?: Date | number | string | null) {
  if (!value) return null

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return date.toISOString().slice(0, 19).replace('T', ' ')
}

function parseData<T>(value: string | T): T {
  if (typeof value !== 'string') return value

  try {
    return JSON.parse(value)
  } catch {
    return {} as T
  }
}

function mapRecord<T>(row: RecordRow): AppRecord<T> {
  return {
    id: row.id,
    client: row.client,
    collection: row.collection,
    data: parseData<T>(row.data as any),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    expiresAt: row.expires_at
  }
}

export function createAppRecordRepository(collection: string, client = getClientName()) {
  const collectionName = normalizeCollection(collection)
  const clientName = String(client || getClientName())

  return {
    async list<T = Record<string, any>>(options: ListRecordsOptions = {}) {
      const limit = Math.min(Math.max(Number(options.limit || 100), 1), 1000)
      const offset = Math.max(Number(options.offset || 0), 0)
      const q = String(options.q || '').trim()
      const activeWhere = options.includeExpired
        ? ''
        : 'AND (expires_at IS NULL OR expires_at > UTC_TIMESTAMP())'
      const searchWhere = q ? 'AND JSON_SEARCH(data, "one", :q) IS NOT NULL' : ''

      const rows = await mysqlRows<RecordRow>(
        `
          SELECT id, client, collection, data, created_at, updated_at, expires_at
          FROM app_records
          WHERE client = :client
            AND collection = :collection
            AND deleted_at IS NULL
            ${activeWhere}
            ${searchWhere}
          ORDER BY updated_at DESC
          LIMIT :limit OFFSET :offset
        `,
        {
          client: options.client || clientName,
          collection: collectionName,
          limit,
          offset,
          q: `%${q}%`
        }
      )

      return rows.map((row) => mapRecord<T>(row))
    },

    async findById<T = Record<string, any>>(id: string, options: { includeExpired?: boolean } = {}) {
      const activeWhere = options.includeExpired
        ? ''
        : 'AND (expires_at IS NULL OR expires_at > UTC_TIMESTAMP())'

      const rows = await mysqlRows<RecordRow>(
        `
          SELECT id, client, collection, data, created_at, updated_at, expires_at
          FROM app_records
          WHERE client = :client
            AND collection = :collection
            AND id = :id
            AND deleted_at IS NULL
            ${activeWhere}
          LIMIT 1
        `,
        {
          client: clientName,
          collection: collectionName,
          id
        }
      )

      return rows[0] ? mapRecord<T>(rows[0]) : null
    },

    async upsert<T extends Record<string, any>>(payload: T, options: { id?: string; expiresAt?: Date | number | string | null } = {}) {
      const id = options.id || String((payload as any).id || randomUUID())
      const cleanPayload = {
        ...payload,
        id,
        updatedAt: Date.now(),
        createdAt: (payload as any).createdAt ?? Date.now()
      }

      await mysqlExec(
        `
          INSERT INTO app_records (id, client, collection, data, expires_at, deleted_at)
          VALUES (:id, :client, :collection, CAST(:data AS JSON), :expiresAt, NULL)
          ON DUPLICATE KEY UPDATE
            data = VALUES(data),
            expires_at = VALUES(expires_at),
            deleted_at = NULL,
            updated_at = CURRENT_TIMESTAMP
        `,
        {
          id,
          client: clientName,
          collection: collectionName,
          data: JSON.stringify(cleanPayload),
          expiresAt: toMysqlDate(options.expiresAt)
        }
      )

      return this.findById<T>(id, { includeExpired: true })
    },

    async patch<T extends Record<string, any>>(id: string, patch: Partial<T>) {
      const current = await this.findById<T>(id, { includeExpired: true })
      if (!current) return null

      return this.upsert<T>(
        {
          ...current.data,
          ...patch,
          id
        } as T,
        {
          id,
          expiresAt: current.expiresAt
        }
      )
    },

    async delete(id: string, mode: 'soft' | 'hard' = 'soft') {
      if (mode === 'hard') {
        await mysqlExec(
          `
            DELETE FROM app_records
            WHERE client = :client AND collection = :collection AND id = :id
          `,
          {
            client: clientName,
            collection: collectionName,
            id
          }
        )
        return
      }

      await mysqlExec(
        `
          UPDATE app_records
          SET deleted_at = UTC_TIMESTAMP()
          WHERE client = :client AND collection = :collection AND id = :id
        `,
        {
          client: clientName,
          collection: collectionName,
          id
        }
      )
    },

    async purgeExpired() {
      return mysqlExec(
        `
          UPDATE app_records
          SET deleted_at = UTC_TIMESTAMP()
          WHERE client = :client
            AND collection = :collection
            AND deleted_at IS NULL
            AND expires_at IS NOT NULL
            AND expires_at <= UTC_TIMESTAMP()
        `,
        {
          client: clientName,
          collection: collectionName
        }
      )
    }
  }
}
