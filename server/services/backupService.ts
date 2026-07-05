import fs from 'node:fs/promises'
import path from 'node:path'
import { createWriteStream } from 'node:fs'
import archiver from 'archiver'
import type { RowDataPacket } from 'mysql2'
import { mysqlRows } from '../utils/mysql'
import { getBackupDir, getClientName } from '../utils/serverConfig'

let xlsxModule: Promise<typeof import('xlsx')> | null = null
const runtimeImport = new Function('specifier', 'return import(specifier)') as <T>(specifier: string) => Promise<T>

function getXlsx() {
  xlsxModule ||= runtimeImport<typeof import('xlsx')>('xlsx')
  return xlsxModule
}

type BackupRow = RowDataPacket & {
  id: string
  client: string
  collection: string
  data: string | Record<string, any>
  created_at: string
  updated_at: string
  expires_at: string | null
  deleted_at: string | null
}

function timestampKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

function parseJson(value: any) {
  if (typeof value !== 'string') return value || {}

  try {
    return JSON.parse(value)
  } catch {
    return {}
  }
}

function csvCell(value: any) {
  const text = typeof value === 'string' ? value : JSON.stringify(value ?? '')
  return `"${text.replace(/"/g, '""')}"`
}

function toCsv(rows: BackupRow[]) {
  const header = ['client', 'collection', 'id', 'data', 'created_at', 'updated_at', 'expires_at', 'deleted_at']
  const lines = rows.map((row) => {
    return [
      row.client,
      row.collection,
      row.id,
      parseJson(row.data),
      row.created_at,
      row.updated_at,
      row.expires_at,
      row.deleted_at
    ].map(csvCell).join(',')
  })

  return [header.join(','), ...lines].join('\n')
}

function sqlString(value: any) {
  if (value === null || value === undefined || value === '') return 'NULL'
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}

function toSql(rows: BackupRow[]) {
  const statements = [
    'CREATE TABLE IF NOT EXISTS app_records (',
    '  id VARCHAR(128) NOT NULL,',
    '  client VARCHAR(80) NOT NULL,',
    '  collection VARCHAR(128) NOT NULL,',
    '  data JSON NOT NULL,',
    '  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,',
    '  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,',
    '  expires_at DATETIME NULL,',
    '  deleted_at DATETIME NULL,',
    '  PRIMARY KEY (client, collection, id)',
    ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;',
    ''
  ]

  for (const row of rows) {
    const data = JSON.stringify(parseJson(row.data))
    statements.push(
      [
        'INSERT INTO app_records (id, client, collection, data, created_at, updated_at, expires_at, deleted_at) VALUES (',
        [
          sqlString(row.id),
          sqlString(row.client),
          sqlString(row.collection),
          `CAST(${sqlString(data)} AS JSON)`,
          sqlString(row.created_at),
          sqlString(row.updated_at),
          sqlString(row.expires_at),
          sqlString(row.deleted_at)
        ].join(', '),
        ') ON DUPLICATE KEY UPDATE data = VALUES(data), updated_at = VALUES(updated_at), expires_at = VALUES(expires_at), deleted_at = VALUES(deleted_at);'
      ].join('')
    )
  }

  return statements.join('\n')
}

async function writeXlsx(filePath: string, rows: BackupRow[]) {
  const XLSX = await getXlsx()
  const flatRows = rows.map((row) => ({
    client: row.client,
    collection: row.collection,
    id: row.id,
    data: JSON.stringify(parseJson(row.data)),
    created_at: row.created_at,
    updated_at: row.updated_at,
    expires_at: row.expires_at,
    deleted_at: row.deleted_at
  }))

  const workbook = XLSX.utils.book_new()
  const collections = Array.from(new Set(flatRows.map((row) => row.collection))).sort()

  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(flatRows), 'all_records')

  for (const collection of collections) {
    const sheetRows = flatRows.filter((row) => row.collection === collection)
    const sheetName = collection.slice(0, 31) || 'data'
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(sheetRows), sheetName)
  }

  XLSX.writeFile(workbook, filePath)
}

async function zipFiles(zipPath: string, files: string[]) {
  await new Promise<void>((resolve, reject) => {
    const output = createWriteStream(zipPath)
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', () => resolve())
    archive.on('error', reject)
    archive.pipe(output)

    for (const file of files) {
      archive.file(file, { name: path.basename(file) })
    }

    archive.finalize().catch(reject)
  })
}

export async function createMonthlyBackup(options: { client?: string; date?: Date } = {}) {
  const client = options.client || getClientName()
  const date = options.date || new Date()
  const key = timestampKey(date)
  const baseDir = path.resolve(process.cwd(), getBackupDir(), client, key)
  const baseName = `${client}-backup-${key}`

  await fs.mkdir(baseDir, { recursive: true })

  const rows = await mysqlRows<BackupRow>(
    `
      SELECT id, client, collection, data, created_at, updated_at, expires_at, deleted_at
      FROM app_records
      WHERE client = :client
      ORDER BY collection ASC, updated_at DESC
    `,
    { client }
  )

  const jsonPath = path.join(baseDir, `${baseName}.json`)
  const csvPath = path.join(baseDir, `${baseName}.csv`)
  const sqlPath = path.join(baseDir, `${baseName}.sql`)
  const xlsxPath = path.join(baseDir, `${baseName}.xlsx`)
  const zipPath = path.join(baseDir, `${baseName}.zip`)

  await fs.writeFile(jsonPath, JSON.stringify(rows.map((row) => ({ ...row, data: parseJson(row.data) })), null, 2), 'utf8')
  await fs.writeFile(csvPath, toCsv(rows), 'utf8')
  await fs.writeFile(sqlPath, toSql(rows), 'utf8')
  await writeXlsx(xlsxPath, rows)
  await zipFiles(zipPath, [jsonPath, csvPath, sqlPath, xlsxPath])

  return {
    ok: true,
    client,
    count: rows.length,
    directory: baseDir,
    files: {
      json: jsonPath,
      csv: csvPath,
      sql: sqlPath,
      xlsx: xlsxPath,
      zip: zipPath
    }
  }
}
