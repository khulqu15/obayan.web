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
  const service = createAppDataService(collection, client)

  if (id) {
    const row = await service.get(id)

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
  }

  return {
    ok: true,
    collection,
    rows: await service.list({
      client,
      limit: Number(query.limit || 100),
      offset: Number(query.offset || 0),
      includeExpired: readBooleanQuery(query.includeExpired),
      q: String(query.q || '')
    })
  }
})
