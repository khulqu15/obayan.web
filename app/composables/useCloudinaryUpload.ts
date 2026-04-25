// composables/useCloudinaryUpload.ts
export type CloudinaryUploadResult = {
  secure_url: string
  public_id: string
  width?: number
  height?: number
  bytes?: number
  format?: string
}

export const useCloudinaryUpload = () => {
  const uploading = ref(false)
  const uploadError = ref<string | null>(null)

  async function uploadImage(file: File, opts?: { folder?: string }) {
    uploadError.value = null

    if (!file.type.startsWith('image/')) throw new Error('File harus berupa gambar.')

    const maxBytes = 5 * 1024 * 1024
    if (file.size > maxBytes) throw new Error('Ukuran gambar maksimal 5 MB.')

    const config = useRuntimeConfig()
    const cloudName = config.public.cloudinaryCloudName || "dwbaxqjzr"
    const uploadPreset: any = config.public.cloudinaryUploadPreset || "ml_default"

    if (!cloudName || !uploadPreset) throw new Error('Konfigurasi Cloudinary belum diatur.')

    uploading.value = true
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('upload_preset', uploadPreset)
      if (opts?.folder) form.append('folder', opts.folder)
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST',
        body: form,
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error?.message || 'Upload gambar gagal.')
      return json as CloudinaryUploadResult
    } catch (err: any) {
      uploadError.value = err?.message || 'Upload gambar gagal.'
      throw err
    } finally {
      uploading.value = false
    }
  }

  return {
    uploading,
    uploadError,
    uploadImage,
  }
}