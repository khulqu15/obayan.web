import mysql, {
    type Pool,
    type PoolConnection,
    type ResultSetHeader,
    type RowDataPacket
} from 'mysql2/promise'

declare global {
  // eslint-disable-next-line no-var
  var __mysqlPool: Pool | undefined
}

export type DbValue =
    | string
    | number
    | boolean
    | Date
    | Buffer
    | null

export type DbParams = DbValue[]

function required(value: unknown, key: string) {
    if (!value || String(value).trim() === '') {
        throw createError({
        statusCode: 500,
        statusMessage: `Missing database config: ${key}`
        })
    }

    return String(value)
}

export function getMysqlPool() {
    if (globalThis.__mysqlPool) return globalThis.__mysqlPool
    
    const config = useRuntimeConfig()

    globalThis.__mysqlPool = mysql.createPool({
        host: required(config.databaseHost, 'localhost'),
        port: Number(config.databasePort || 3306),
        user: required(config.databaseUser, 'root'),
        password: String(config.databasePassword || ''),
        database: required(config.databaseName, 'arsades_db'),

        waitForConnections: true,
        connectionLimit: Number(config.databaseConnectionLimit || 10),
        charset: 'utf8mb4',
        timezone: 'Z'
    })

    return globalThis.__mysqlPool
}

export async function dbQuery<T extends RowDataPacket[]>(sql: string, params: DbParams = [], connection?: PoolConnection) {
    const executor = connection || getMysqlPool()
    const [rows] = await executor.execute<T>(sql, params)
    return rows
}

export async function dbExecute(sql: string, params: DbParams = [], connection?: PoolConnection) {
    const executor = connection || getMysqlPool()
    const [result] = await executor.execute<ResultSetHeader>(sql, params)
    return result
}

export async function withTransaction<T>(callback: (connection: PoolConnection) => Promise<T>) {
    const connection = await getMysqlPool().getConnection()
    try {
        await connection.beginTransaction()
        const result = await callback(connection)
        await connection.commit()
        return result
    } catch (error) {
        await connection.rollback()
        throw error
    } finally {
        connection.release()
    }
}