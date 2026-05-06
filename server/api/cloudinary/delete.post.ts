import crypto from 'node:crypto'

type DeleteBody = {
  publicId?: string
  deleteToken?: string
}

function signCloudinaryParams(params: Record<string, string>, apiSecret: string) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&')

  return crypto
    .createHash('sha1')
    .update(payload + apiSecret)
    .digest('hex')
}

export default defineEventHandler(async (event) => {
  const body = await readBody<DeleteBody>(event)

  const publicId = String(body.publicId || '').trim()
  const deleteToken = String(body.deleteToken || '').trim()

  const config = useRuntimeConfig()

  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    String(config.public.cloudinaryCloudName || '')

  const apiKey =
    process.env.CLOUDINARY_API_KEY ||
    String(config.cloudinaryApiKey || '')

  const apiSecret =
    process.env.CLOUDINARY_API_SECRET ||
    String(config.cloudinaryApiSecret || '')

  if (!cloudName) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Cloudinary cloud name belum diatur.'
    })
  }

  /**
   * Opsi 1:
   * Delete memakai delete_token.
   * Ini hanya bisa jika upload response Cloudinary punya delete_token,
   * dan tokennya masih valid.
   */
  if (deleteToken) {
    const form = new FormData()
    form.append('token', deleteToken)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/delete_by_token`, {
      method: 'POST',
      body: form
    })

    const json = await res.json().catch(() => null)

    if (!res.ok) {
      throw createError({
        statusCode: res.status,
        statusMessage: json?.error?.message || 'Gagal menghapus gambar memakai delete token.'
      })
    }

    return {
      ok: true,
      mode: 'delete_token',
      result: json?.result || 'ok'
    }
  }

  /**
   * Opsi 2:
   * Delete permanen memakai public_id.
   * Ini wajib butuh API key dan API secret.
   */
  if (publicId && apiKey && apiSecret) {
    const timestamp = Math.round(Date.now() / 1000).toString()

    const paramsToSign: Record<string, string> = {
      invalidate: 'true',
      public_id: publicId,
      timestamp
    }

    const signature = signCloudinaryParams(paramsToSign, apiSecret)

    const form = new FormData()
    form.append('public_id', publicId)
    form.append('api_key', apiKey)
    form.append('timestamp', timestamp)
    form.append('signature', signature)
    form.append('invalidate', 'true')

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: 'POST',
      body: form
    })

    const json = await res.json().catch(() => null)

    if (!res.ok) {
      throw createError({
        statusCode: res.status,
        statusMessage: json?.error?.message || 'Gagal menghapus gambar dari Cloudinary.'
      })
    }

    return {
      ok: true,
      mode: 'signed_destroy',
      result: json?.result || 'unknown',
      publicId
    }
  }

  /**
   * Opsi 3:
   * Kalau hanya pakai unsigned preset tanpa secret,
   * jangan error. Anggap Cloudinary delete dilewati.
   * App tetap bisa menghapus URL/publicId dari Firebase.
   */
  return {
    ok: true,
    skipped: true,
    mode: 'unsigned_without_secret',
    publicId,
    message:
      'Cloudinary file tidak dihapus permanen karena API secret tidak tersedia. Data gambar boleh dihapus dari Firebase saja.'
  }
})