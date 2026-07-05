export function getCollectionParam(event: any) {
  const collection = String(getRouterParam(event, 'collection') || '').trim()

  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(collection)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Collection tidak valid.'
    })
  }

  return collection
}

export function getIdParam(event: any) {
  const id = String(getRouterParam(event, 'id') || '').trim()

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID tidak valid.'
    })
  }

  return id
}

export function readBooleanQuery(value: any, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase())
}
