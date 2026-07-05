import { createAppDataService } from '../services/appDataService'
import { readBooleanQuery } from '../utils/apiCollection'
import { getClientName } from '../utils/serverConfig'

function readCollection(query: Record<string, any>) {
  const collection = String(query.collection || '').trim()

  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(collection)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Query collection tidak valid.'
    })
  }

  return collection
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const collection = readCollection(query)
  const id = String(query.id || '').trim()
  const client = String(query.client || getClientName())
  const method = String(query.method || (id ? 'update' : 'create')).toLowerCase()
  const body = await readBody<Record<string, any>>(event)
  const service = createAppDataService(collection, client)

  if (method === 'delete') {
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID wajib diisi untuk delete.'
      })
    }

    await service.delete(id, query.mode === 'hard' ? 'hard' : 'soft')

    return {
      ok: true,
      collection,
      id
    }
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Payload harus berupa object.'
    })
  }

  const options = {
    realtime: readBooleanQuery(query.realtime, true),
    realtimeTtlMs: query.realtimeTtlMs ? Number(query.realtimeTtlMs) : undefined,
    expiresAt: query.expiresAt ? String(query.expiresAt) : null
  }

  const row = id
    ? await service.update(id, body, options)
    : await service.create(body, options)

  if (!row) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Data tidak ditemukan.'
    })
  }

  return {
    ok: true,
    collection,
    row
  }
})
