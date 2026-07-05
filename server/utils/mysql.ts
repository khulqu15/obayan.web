import mysql, { type Pool, type PoolConnection, type ResultSetHeader, type RowDataPacket } from 'mysql2/promise'
import { getDatabaseConfig } from './serverConfig'

let pool: Pool | null = null
let schemaReady: Promise<void> | null = null

export type SqlValue = string | number | boolean | Date | null

export function getMysqlPool() {
  if (!pool) {
    const config = getDatabaseConfig()

    if (!config.database) {
      throw new Error('DATABASE_NAME belum diatur.')
    }

    pool = mysql.createPool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      connectionLimit: config.connectionLimit,
      waitForConnections: true,
      namedPlaceholders: true,
      timezone: 'Z',
      dateStrings: true,
      charset: 'utf8mb4'
    })
  }

  return pool
}

export async function ensureCoreSchema() {
  if (!schemaReady) {
    schemaReady = getMysqlPool().execute(`
      CREATE TABLE IF NOT EXISTS app_records (
        id VARCHAR(128) NOT NULL,
        client VARCHAR(80) NOT NULL,
        collection VARCHAR(128) NOT NULL,
        data JSON NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        expires_at DATETIME NULL,
        deleted_at DATETIME NULL,
        PRIMARY KEY (client, collection, id),
        INDEX idx_app_records_collection (client, collection, updated_at),
        INDEX idx_app_records_expires (expires_at),
        INDEX idx_app_records_deleted (deleted_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `).then(() => undefined)
  }

  return schemaReady
}

export async function mysqlRows<T extends RowDataPacket = RowDataPacket>(
  sql: string,
  params: Record<string, SqlValue> = {}
) {
  await ensureCoreSchema()
  const [rows] = await getMysqlPool().execute<T[]>(sql, params)
  return rows
}

export async function mysqlExec(sql: string, params: Record<string, SqlValue> = {}) {
  await ensureCoreSchema()
  const [result] = await getMysqlPool().execute<ResultSetHeader>(sql, params)
  return result
}

export async function withMysqlTransaction<T>(handler: (connection: PoolConnection) => Promise<T>) {
  await ensureCoreSchema()

  const connection = await getMysqlPool().getConnection()

  try {
    await connection.beginTransaction()
    const result = await handler(connection)
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}
