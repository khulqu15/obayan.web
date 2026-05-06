import sharp from 'sharp'

type UploadResult = {
  secure_url: string
  public_id: string
  width?: number
  height?: number
  bytes?: number
  format?: string
}

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
])

function getTextField(parts: any[], name: string, fallback = '') {
  const part = parts.find((item) => item.name === name)

  if (!part?.data) return fallback

  return Buffer.from(part.data).toString('utf-8').trim() || fallback
}

function safeNumber(value: string, fallback: number) {
  const num = Number(value)
  return Number.isFinite(num) && num > 0 ? num : fallback
}

function normalizeQuality(value: string) {
  const raw = Number(value || 0.82)

  if (!Number.isFinite(raw)) return 82

  const quality = raw <= 1
    ? Math.round(raw * 100)
    : Math.round(raw)

  return Math.max(50, Math.min(92, quality))
}

function safeFilename(filename?: string) {
  const base = String(filename || 'image')
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${base || 'image'}.webp`
}

export default defineEventHandler(async (event): Promise<UploadResult> => {
  const form = await readMultipartFormData(event)

  if (!form?.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'File gambar wajib diisi.'
    })
  }

  const filePart = form.find((item) => item.name === 'file')

  if (!filePart?.data) {
    throw createError({
      statusCode: 400,
      statusMessage: 'File gambar tidak ditemukan.'
    })
  }

  const mimeType = String(filePart.type || '').toLowerCase()

  if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
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
    process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    String(config.public.cloudinaryCloudName || '')

  const uploadPreset =
    process.env.CLOUDINARY_UPLOAD_PRESET ||
    process.env.NUXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
    String(config.public.cloudinaryUploadPreset || '')

  if (!cloudName || !uploadPreset) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Cloudinary cloud name atau upload preset belum lengkap.'
    })
  }

  const folder = getTextField(form, 'folder', '')
  const maxWidth = safeNumber(getTextField(form, 'maxWidth', '1600'), 1600)
  const maxHeight = safeNumber(getTextField(form, 'maxHeight', '1600'), 1600)
  const quality = normalizeQuality(getTextField(form, 'quality', '0.82'))

  const webpBuffer = await sharp(Buffer.from(filePart.data), {
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

  const uploadForm = new FormData()

  uploadForm.append(
    'file',
    new Blob([webpBuffer], { type: 'image/webp' }),
    safeFilename(filePart.filename)
  )

  uploadForm.append('upload_preset', uploadPreset)

  // Jika Cloudinary unsigned preset menolak folder,
  // hapus blok ini dan atur folder langsung di Upload Preset Cloudinary.
  if (folder) {
    uploadForm.append('folder', folder)
  }

  const upload = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: uploadForm
  })

  const json = await upload.json().catch(() => null)

  if (!upload.ok) {
    throw createError({
      statusCode: upload.status,
      statusMessage: json?.error?.message || 'Upload gambar ke Cloudinary gagal.'
    })
  }

  return {
    secure_url: json.secure_url,
    public_id: json.public_id,
    width: json.width,
    height: json.height,
    bytes: json.bytes,
    format: json.format
  }
})