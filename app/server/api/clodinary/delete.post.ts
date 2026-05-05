import crypto from 'node:crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ publicId?: string }>(event)
  const publicId = String(body.publicId || '').trim()

  if (!publicId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'publicId wajib diisi.'
    })
  }

  const config = useRuntimeConfig()

  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    String(config.public.cloudinaryCloudName || '')

  const apiKey =
    process.env.CLOUDINARY_API_KEY ||
    String(config.cloudinaryApiKey || '')

  const apiSecret =
    process.env.CLOUDINARY_API_SECRET ||
    String(config.cloudinaryApiSecret || '')

  if (!cloudName || !apiKey || !apiSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Konfigurasi Cloudinary server belum lengkap.'
    })
  }

  const timestamp = Math.round(Date.now() / 1000)

  const paramsToSign = `invalidate=true&public_id=${publicId}&timestamp=${timestamp}`

  const signature = crypto
    .createHash('sha1')
    .update(paramsToSign + apiSecret)
    .digest('hex')

  const form = new FormData()
  form.append('public_id', publicId)
  form.append('api_key', apiKey)
  form.append('timestamp', String(timestamp))
  form.append('signature', signature)
  form.append('invalidate', 'true')

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: 'POST',
    body: form
  })

  const json = await res.json()

  if (!res.ok) {
    throw createError({
      statusCode: res.status,
      statusMessage: json?.error?.message || 'Gagal menghapus gambar dari Cloudinary.'
    })
  }

  return {
    ok: true,
    result: json?.result || 'unknown',
    publicId
  }
})