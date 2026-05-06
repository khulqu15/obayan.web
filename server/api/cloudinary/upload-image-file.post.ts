import crypto from 'node:crypto'
import sharp from 'sharp'

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
  const form = await readMultipartFormData(event)

  if (!form?.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'File gambar wajib diisi.'
    })
  }

  const filePart = form.find((item) => item.name === 'file')
  const folderPart = form.find((item) => item.name === 'folder')
  const maxWidthPart = form.find((item) => item.name === 'maxWidth')
  const maxHeightPart = form.find((item) => item.name === 'maxHeight')
  const qualityPart = form.find((item) => item.name === 'quality')

  if (!filePart?.data) {
    throw createError({
      statusCode: 400,
      statusMessage: 'File gambar tidak ditemukan.'
    })
  }

  const allowedTypes = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ])

  const mimeType = String(filePart.type || '').toLowerCase()

  if (!allowedTypes.has(mimeType)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Format gambar harus JPG, PNG, atau WebP.'
    })
  }

  const maxBytes = 5 * 1024 * 1024

  if (filePart.data.length > maxBytes) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ukuran gambar maksimal 5 MB.'
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

  const maxWidth = Number(maxWidthPart?.data?.toString() || 1600)
  const maxHeight = Number(maxHeightPart?.data?.toString() || 1600)
  const qualityInput = Number(qualityPart?.data?.toString() || 0.82)
  const quality = Math.max(50, Math.min(92, Math.round(qualityInput * 100)))

  const webpBuffer = await sharp(filePart.data, {
    failOn: 'error',
    limitInputPixels: 24_000_000
  })
    .rotate()
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: 'inside',
      withoutEnlargement: true
    })
    .webp({
      quality,
      effort: 4
    })
    .toBuffer()

  const timestamp = Math.round(Date.now() / 1000).toString()
  const folder = String(folderPart?.data?.toString() || '').trim()

  const paramsToSign: Record<string, string> = {
    timestamp
  }

  if (folder) paramsToSign.folder = folder

  const signature = signCloudinaryParams(paramsToSign, apiSecret)

  const uploadForm = new FormData()
  uploadForm.append('file', new Blob([webpBuffer], { type: 'image/webp' }), 'image.webp')
  uploadForm.append('api_key', apiKey)
  uploadForm.append('timestamp', timestamp)
  uploadForm.append('signature', signature)

  if (folder) uploadForm.append('folder', folder)

  const upload = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: uploadForm
  })

  const json = await upload.json()

  if (!upload.ok) {
    throw createError({
      statusCode: upload.status,
      statusMessage: json?.error?.message || 'Upload gambar ke Cloudinary gagal.'
    })
  }

  return json
})