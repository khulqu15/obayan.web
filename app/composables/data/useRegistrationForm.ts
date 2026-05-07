// composables/useRegistrationCustomFields.ts

export type RegistrationFormMode = 'default' | 'custom'

export type CustomInputType =
  | 'text'
  | 'number'
  | 'tel'
  | 'date'
  | 'select'
  | 'textarea'
  | 'file'
  | 'range'

export type CustomRegistrationField = {
  id: string
  key: string
  label: string
  type: CustomInputType
  enabled: boolean
  required: boolean
  placeholder?: string
  help?: string
  options?: string[]
  min?: number | null
  max?: number | null
  step?: number | null
  order?: number
  mapTo?:
    | 'nama'
    | 'nohp'
    | 'tmpLahir'
    | 'tglLahir'
    | 'tanggal'
    | 'jk'
    | 'alamat'
    | 'asalSekolah'
    | 'tujuan'
    | 'pendidikan'
    | 'namaOrtu'
    | ''
}

export type CustomRegistrationFileValue = {
  url: string
  secure_url?: string
  public_id?: string
  fileName: string
  mimeType: string
  size: number
}

export type CustomRegistrationValues = Record<
  string,
  string | number | CustomRegistrationFileValue | null
>

export const CLIENT_SIMPLE_REGISTRATION_FIELDS: CustomRegistrationField[] = [
  {
    id: 'field-nama',
    key: 'nama',
    label: 'Nama Lengkap',
    type: 'text',
    enabled: true,
    required: true,
    placeholder: 'Contoh: Ahmad Fulan',
    order: 1,
    mapTo: 'nama'
  },
  {
    id: 'field-nohp',
    key: 'nohp',
    label: 'Nomor Handphone / WhatsApp',
    type: 'tel',
    enabled: true,
    required: true,
    placeholder: 'Contoh: 081234567890',
    help: 'Gunakan nomor WhatsApp aktif.',
    order: 2,
    mapTo: 'nohp'
  },
  {
    id: 'field-tempat-lahir',
    key: 'tmpLahir',
    label: 'Tempat Lahir',
    type: 'text',
    enabled: true,
    required: true,
    placeholder: 'Contoh: Pasuruan',
    order: 3,
    mapTo: 'tmpLahir'
  },
  {
    id: 'field-tanggal-lahir',
    key: 'tglLahir',
    label: 'Tanggal Lahir',
    type: 'date',
    enabled: true,
    required: true,
    order: 4,
    mapTo: 'tglLahir'
  },
  {
    id: 'field-tanggal-daftar',
    key: 'tanggal',
    label: 'Tanggal',
    type: 'date',
    enabled: true,
    required: false,
    order: 5,
    mapTo: 'tanggal'
  },
  {
    id: 'field-jk',
    key: 'jk',
    label: 'Jenis Kelamin',
    type: 'select',
    enabled: true,
    required: true,
    options: ['Laki-laki', 'Perempuan'],
    placeholder: 'Pilih jenis kelamin',
    order: 6,
    mapTo: 'jk'
  },
  {
    id: 'field-alamat',
    key: 'alamat',
    label: 'Alamat',
    type: 'textarea',
    enabled: true,
    required: true,
    placeholder: 'Contoh: Dusun Krajan, RT/RW, Desa, Kecamatan, Kabupaten',
    order: 7,
    mapTo: 'alamat'
  },
  {
    id: 'field-asal-sekolah',
    key: 'asalSekolah',
    label: 'Asal Sekolah',
    type: 'text',
    enabled: true,
    required: false,
    placeholder: 'Contoh: MI Al-Inayah',
    order: 8,
    mapTo: 'asalSekolah'
  },
  {
    id: 'field-tujuan',
    key: 'tujuan',
    label: 'Tujuan',
    type: 'text',
    enabled: true,
    required: false,
    placeholder: 'Contoh: Mondok dan melanjutkan pendidikan',
    order: 9,
    mapTo: 'tujuan'
  },
  {
    id: 'field-pendidikan',
    key: 'pendidikan',
    label: 'Pendidikan',
    type: 'select',
    enabled: true,
    required: false,
    options: ['SD/MI', 'SMP/MTs', 'SMA/MA/SMK', 'Lainnya'],
    placeholder: 'Pilih pendidikan terakhir',
    order: 10,
    mapTo: 'pendidikan'
  },
  {
    id: 'field-nama-ortu',
    key: 'namaOrtu',
    label: 'Nama Orang Tua',
    type: 'text',
    enabled: true,
    required: true,
    placeholder: 'Contoh: Bapak/Ibu Fulan',
    order: 11,
    mapTo: 'namaOrtu'
  }
]

export function cloneRegistrationFields(fields = CLIENT_SIMPLE_REGISTRATION_FIELDS) {
  return JSON.parse(JSON.stringify(fields)) as CustomRegistrationField[]
}

export function createCustomFieldId() {
  return `field-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function normalizeCustomFieldKey(value: string) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

export function normalizeCustomRegistrationFields(value: any): CustomRegistrationField[] {
  const source = Array.isArray(value) ? value : CLIENT_SIMPLE_REGISTRATION_FIELDS

  return source
    .map((item: any, index: number) => {
      const label = String(item?.label || `Input ${index + 1}`).trim()
      const key = normalizeCustomFieldKey(item?.key || label || `input_${index + 1}`)

      return {
        id: String(item?.id || createCustomFieldId()),
        key: key || `input_${index + 1}`,
        label,
        type: normalizeInputType(item?.type),
        enabled: item?.enabled !== false,
        required: !!item?.required,
        placeholder: String(item?.placeholder || '').trim(),
        help: String(item?.help || '').trim(),
        options: Array.isArray(item?.options)
          ? item.options.map((v: any) => String(v || '').trim()).filter(Boolean)
          : [],
        min: item?.min === '' || item?.min === null ? null : Number(item.min),
        max: item?.max === '' || item?.max === null ? null : Number(item.max),
        step: item?.step === '' || item?.step === null ? null : Number(item.step),
        order: Number(item?.order ?? index + 1),
        mapTo: item?.mapTo || ''
      } as CustomRegistrationField
    })
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
}

export function normalizeInputType(value: any): CustomInputType {
  const allowed: CustomInputType[] = [
    'text',
    'number',
    'tel',
    'date',
    'select',
    'textarea',
    'file',
    'range'
  ]

  return allowed.includes(value) ? value : 'text'
}

export function enabledCustomRegistrationFields(fields: CustomRegistrationField[]) {
  return normalizeCustomRegistrationFields(fields).filter((item) => item.enabled)
}

export function emptyCustomRegistrationValues(fields: CustomRegistrationField[]) {
  const values: CustomRegistrationValues = {}

  for (const field of enabledCustomRegistrationFields(fields)) {
    values[field.key] = field.type === 'range' ? Number(field.min ?? 0) : ''
  }

  return values
}

export function getCustomValueByMap(
  fields: CustomRegistrationField[],
  values: CustomRegistrationValues,
  mapTo: CustomRegistrationField['mapTo']
) {
  const field = enabledCustomRegistrationFields(fields).find((item) => item.mapTo === mapTo)
  if (!field) return ''

  const value = values[field.key]

  if (value && typeof value === 'object' && 'url' in value) {
    return value.url || ''
  }

  return String(value ?? '').trim()
}

export function customRegistrationDisplayRows(
  fields: CustomRegistrationField[],
  values: CustomRegistrationValues
) {
  return enabledCustomRegistrationFields(fields).map((field) => {
    const raw = values[field.key]

    let value = ''
    let fileUrl = ''

    if (raw && typeof raw === 'object' && 'url' in raw) {
      value = raw.fileName || raw.url || '-'
      fileUrl = raw.url || ''
    } else {
      value = String(raw ?? '').trim() || '-'
    }

    return {
      key: field.key,
      label: field.label,
      type: field.type,
      value,
      fileUrl
    }
  })
}