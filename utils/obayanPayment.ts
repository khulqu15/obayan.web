export type PaymentPackageId = 'basic' | 'standard' | 'pro' | 'advance' | 'fullaccess'
export type BillingDuration = 'monthly' | 'yearly'

export const PAYMENT_PACKAGE_IDS: PaymentPackageId[] = ['basic', 'standard', 'pro', 'advance', 'fullaccess']
export const DEFAULT_YEARLY_CHARGED_MONTHS = 10

export type PaymentPackage = {
  id: PaymentPackageId
  name: string
  subtitle: string
  description: string

  regularMonthlyPrice: number
  baseMonthlyPrice: number // harga promo launching yang dipakai untuk invoice

  regularPerSantriPrice?: number
  perSantriPrice: number

  isOneTime?: boolean
  enabled?: boolean
  badge?: string
  promoLabel?: string
  tone?: 'soft' | 'popular' | 'premium'
  features: string[]
}

export type PaymentPackageMap = Record<PaymentPackageId, PaymentPackage>

export type TenantPackagePricing = Partial<Pick<
  PaymentPackage,
  | 'name'
  | 'subtitle'
  | 'description'
  | 'regularMonthlyPrice'
  | 'baseMonthlyPrice'
  | 'regularPerSantriPrice'
  | 'perSantriPrice'
  | 'badge'
  | 'promoLabel'
  | 'enabled'
  | 'features'
>>

export type TenantPricingConfig = {
  yearlyChargedMonths?: number
  packages?: Partial<Record<PaymentPackageId, TenantPackagePricing>>
  updatedAt?: unknown
}

export const PAYMENT_PACKAGES: PaymentPackageMap = {
  basic: {
    id: 'basic',
    name: 'Basic',
    subtitle: 'Website Informasi',
    description: 'Cocok untuk lembaga yang ingin punya website resmi, profil, berita, galeri, dan informasi PPDB.',
    regularMonthlyPrice: 300_000,
    baseMonthlyPrice: 300_000,
    perSantriPrice: 0,
    badge: 'Launching Deal',
    promoLabel: 'Hemat Rp100rb/bln',
    tone: 'soft',
    features: [
      'Website profil lembaga',
      'CMS berita & pengumuman',
      'Galeri dokumentasi',
      'Informasi PPDB/PSB'
    ]
  },

  standard: {
    id: 'standard',
    name: 'Standard',
    subtitle: 'Website + SIAKAD Dasar',
    description: 'Paket awal terbaik untuk mulai digitalisasi data peserta didik, absensi, akademik, dan keuangan dasar.',
    regularMonthlyPrice: 400_000,
    baseMonthlyPrice: 400_000,
    regularPerSantriPrice: 3_000,
    perSantriPrice: 3_000,
    badge: 'Recommended',
    promoLabel: 'Hemat Rp100rb/bln',
    tone: 'popular',
    features: [
      'Semua fitur Basic',
      'Manajemen data peserta didik',
      'Absensi & akademik',
      'Keuangan dasar',
      'Dashboard admin'
    ]
  },

  pro: {
    id: 'pro',
    name: 'Pro',
    subtitle: 'Monitoring & Laporan Lanjutan',
    description: 'Untuk lembaga yang butuh dashboard lebih lengkap, laporan operasional, dan persiapan fitur lanjutan.',
    regularMonthlyPrice: 600_000,
    baseMonthlyPrice: 450_000,
    regularPerSantriPrice: 4_000,
    perSantriPrice: 4_000,
    badge: 'Best Value',
    promoLabel: 'Hemat Rp150rb/bln',
    tone: 'popular',
    features: [
      'Semua fitur Standard',
      'Monitoring data lebih lengkap',
      'Laporan operasional',
      'Manajemen aktivitas lembaga',
      'Persiapan integrasi lanjutan'
    ]
  },

  advance: {
    id: 'advance',
    name: 'Advance',
    subtitle: 'Pro + Aplikasi Wali',
    description: 'Paket paling lengkap untuk transparansi wali/orang tua, notifikasi, pembayaran, dan integrasi lanjutan.',
    regularMonthlyPrice: 800_000,
    baseMonthlyPrice: 600_000,
    regularPerSantriPrice: 5_000,
    perSantriPrice: 5_000,
    badge: 'Most Complete',
    promoLabel: 'Hemat Rp200rb/bln',
    tone: 'premium',
    features: [
      'Semua fitur Pro',
      'Akses monitoring wali/orang tua',
      'Informasi absensi, nilai, pembayaran',
      'Notifikasi & pengumuman',
      'Siap integrasi RFID opsional'
    ]
  },

  fullaccess: {
    id: 'fullaccess',
    name: 'Full Access',
    subtitle: 'Kepemilikan Sistem',
    description: 'Skema pembelian putus untuk lembaga yang ingin sistem menjadi aset internal sesuai kesepakatan.',
    regularMonthlyPrice: 350_000_000,
    baseMonthlyPrice: 300_000_000,
    perSantriPrice: 0,
    isOneTime: true,
    badge: 'One-time',
    promoLabel: 'Promo hemat Rp4jt',
    tone: 'premium',
    features: [
      'Pembelian putus',
      'Sistem menjadi aset lembaga sesuai kesepakatan',
      'Tanpa biaya langganan bulanan',
      'Maintenance lanjutan terpisah',
      'Pengembangan custom sesuai quotation'
    ]
  }
}

export const OBAYAN_SELLER = {
  name: 'Obayan Sencra',
  email: 'team.sencra@gmail.com',
  phone: '+62 895-3218-48133',
  address: 'Indonesia'
}

export function formatIDR(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(Number(value || 0))
}

export function sanitizeTenantSlug(value: unknown) {
  return String(value || 'obayan')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'obayan'
}

export function titleCaseTenant(value: string) {
  return sanitizeTenantSlug(value)
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function normalizePhone(value: string) {
  return String(value || '')
    .trim()
    .replace(/[^\d+]/g, '')
}

function cleanMoney(value: unknown, fallback: number) {
  const numberValue = Number(value)

  return Number.isFinite(numberValue) && numberValue >= 0
    ? Math.round(numberValue)
    : fallback
}

export function normalizeYearlyChargedMonths(value: unknown) {
  const numberValue = Math.round(Number(value))

  if (!Number.isFinite(numberValue)) return DEFAULT_YEARLY_CHARGED_MONTHS

  return Math.min(12, Math.max(1, numberValue))
}

export function normalizeTenantPricingConfig(value: unknown): TenantPricingConfig {
  const raw = value && typeof value === 'object'
    ? value as Record<string, any>
    : {}

  const packagesRaw = raw.packages && typeof raw.packages === 'object'
    ? raw.packages as Record<string, any>
    : {}

  const packages = PAYMENT_PACKAGE_IDS.reduce<TenantPricingConfig['packages']>((acc, id) => {
    const rawPackage = packagesRaw[id]

    if (rawPackage && typeof rawPackage === 'object') {
      acc![id] = { ...rawPackage }
    }

    return acc
  }, {})

  return {
    yearlyChargedMonths: normalizeYearlyChargedMonths(raw.yearlyChargedMonths),
    packages,
    updatedAt: raw.updatedAt
  }
}

export function resolvePaymentPackages(config?: TenantPricingConfig | null): PaymentPackageMap {
  const overrides = config?.packages || {}

  return PAYMENT_PACKAGE_IDS.reduce<PaymentPackageMap>((acc, id) => {
    const base = PAYMENT_PACKAGES[id]
    const override = overrides[id] || {}
    const regularPerSantriFallback = base.regularPerSantriPrice ?? base.perSantriPrice

    acc[id] = {
      ...base,
      name: String(override.name || base.name),
      subtitle: String(override.subtitle || base.subtitle),
      description: String(override.description || base.description),
      regularMonthlyPrice: cleanMoney(override.regularMonthlyPrice, base.regularMonthlyPrice),
      baseMonthlyPrice: cleanMoney(override.baseMonthlyPrice, base.baseMonthlyPrice),
      regularPerSantriPrice: cleanMoney(override.regularPerSantriPrice, regularPerSantriFallback),
      perSantriPrice: cleanMoney(override.perSantriPrice, base.perSantriPrice),
      badge: String(override.badge ?? base.badge ?? ''),
      promoLabel: String(override.promoLabel ?? base.promoLabel ?? ''),
      enabled: override.enabled !== false,
      features: Array.isArray(override.features) && override.features.length
        ? override.features.map((feature) => String(feature)).filter(Boolean)
        : base.features
    }

    return acc
  }, {} as PaymentPackageMap)
}

export function calculateInvoice(input: {
  packageId: PaymentPackageId
  duration: BillingDuration
  santriCount?: number
  packages?: PaymentPackageMap
  yearlyChargedMonths?: number
}) {
  const packages = input.packages || PAYMENT_PACKAGES
  const pkg = packages[input.packageId]
  const santriCount = Math.max(0, Number(input.santriCount || 0))
  const yearlyChargedMonths = normalizeYearlyChargedMonths(input.yearlyChargedMonths)

  if (!pkg) throw new Error('Paket tidak valid')

  if (pkg.isOneTime) {
    const regularSubtotal = pkg.regularMonthlyPrice
    const subtotal = pkg.baseMonthlyPrice
    const launchingDiscount = regularSubtotal - subtotal

    return {
      package: pkg,
      santriCount,
      regularMonthlyUnitPrice: pkg.regularMonthlyPrice,
      monthlyUnitPrice: pkg.baseMonthlyPrice,
      regularSubtotal,
      subtotal,
      launchingDiscount,
      yearlyDiscount: 0,
      totalDiscount: launchingDiscount,
      discount: launchingDiscount,
      total: subtotal,
      currency: 'IDR' as const,
      chargedMonths: 1,
      durationLabel: 'Pembelian Putus'
    }
  }

  const regularMonthlyUnitPrice = pkg.regularMonthlyPrice + ((pkg.regularPerSantriPrice || pkg.perSantriPrice) * santriCount)
  const monthlyUnitPrice = pkg.baseMonthlyPrice + (pkg.perSantriPrice * santriCount)

  const normalMonths = input.duration === 'yearly' ? 12 : 1
  const chargedMonths = input.duration === 'yearly' ? yearlyChargedMonths : 1

  const regularSubtotal = regularMonthlyUnitPrice * normalMonths
  const subtotal = monthlyUnitPrice * normalMonths
  const launchingDiscount = regularSubtotal - subtotal
  const yearlyDiscount = input.duration === 'yearly'
    ? monthlyUnitPrice * (normalMonths - chargedMonths)
    : 0
  const totalDiscount = launchingDiscount + yearlyDiscount
  const total = subtotal - yearlyDiscount

  return {
    package: pkg,
    santriCount,
    regularMonthlyUnitPrice,
    monthlyUnitPrice,
    regularSubtotal,
    subtotal,
    launchingDiscount,
    yearlyDiscount,
    totalDiscount,
    discount: totalDiscount,
    total,
    currency: 'IDR' as const,
    chargedMonths,
    durationLabel: input.duration === 'yearly'
      ? `Tahunan - bayar ${chargedMonths} bulan`
      : 'Bulanan'
  }
}

function parseInputDate(value: string) {
  const [year, month, day] = String(value).split('-').map(Number)
  return new Date(year!, (month || 1) - 1, day || 1)
}

function toInputDate(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function addMonths(date: Date, months: number) {
  const result = new Date(date)
  const day = result.getDate()
  result.setMonth(result.getMonth() + months)

  if (result.getDate() !== day) {
    result.setDate(0)
  }

  return result
}

export function todayInputDate() {
  return toInputDate(new Date())
}

export function calculateContractEndDate(input: {
  startDate: string
  duration: BillingDuration
  packageId: PaymentPackageId
}) {
  if (!input.startDate) return ''

  const start = parseInputDate(input.startDate)
  const months = input.packageId === 'fullaccess'
    ? 12
    : input.duration === 'yearly'
      ? 12
      : 1

  const end = addMonths(start, months)
  end.setDate(end.getDate() - 1)

  return toInputDate(end)
}

export function generateInvoiceNumber(tenant: string) {
  const cleanTenant = sanitizeTenantSlug(tenant).toUpperCase().slice(0, 8)
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()

  return `INV-${cleanTenant}-${y}${m}${d}-${random}`
}

export const OBAYAN_TERMS_SECTIONS = [
  {
    title: '1. Definisi',
    body: 'Obayan adalah penyedia layanan platform digital pendidikan. Klien adalah lembaga/yayasan/sekolah/pesantren yang menggunakan layanan. Layanan mencakup website, CMS, sistem informasi, monitoring wali, integrasi, dan fitur lain sesuai paket.'
  },
  {
    title: '2. Ruang Lingkup Layanan',
    body: 'Obayan menyediakan layanan sesuai paket, quotation, invoice, dan/atau dokumen kerja sama. Fitur yang tidak tertulis secara eksplisit tidak dianggap termasuk dalam ruang lingkup pekerjaan.'
  },
  {
    title: '3. Prinsip Batasan Layanan',
    body: 'Paket berlangganan bukan berarti permintaan fitur tanpa batas. Permintaan di luar paket akan dianalisis sebagai request tambahan dengan estimasi waktu dan biaya terpisah.'
  },
  {
    title: '4. Hak dan Kewajiban Obayan',
    body: 'Obayan berhak menerima pembayaran, menentukan pendekatan teknis, melakukan maintenance, dan menolak permintaan di luar ruang lingkup. Obayan berkewajiban menyediakan layanan sesuai paket dan menjaga kerahasiaan data.'
  },
  {
    title: '5. Hak dan Kewajiban Klien',
    body: 'Klien berhak menerima layanan sesuai paket dan mengajukan revisi wajar. Klien wajib membayar tepat waktu, menyediakan data yang benar, menunjuk PIC resmi, dan menjaga akses akun.'
  },
  {
    title: '6. Ketentuan Data, Konten, dan Materi',
    body: 'Klien bertanggung jawab atas legalitas, kebenaran, dan kelengkapan konten seperti logo, foto, profil, data peserta didik, data wali, data akademik, dan data pembayaran.'
  },
  {
    title: '7. Revisi dan Perubahan',
    body: 'Revisi minor mencakup perubahan kecil seperti typo, teks, gambar, kontak, dan warna ringan. Revisi mayor seperti perubahan alur, fitur, struktur, database, atau desain besar masuk change request.'
  },
  {
    title: '8. Permintaan Tambahan / Change Request',
    body: 'Setiap permintaan tambahan harus disampaikan tertulis, dianalisis, diberikan estimasi biaya dan waktu, lalu dikerjakan setelah disetujui kedua pihak.'
  },
  {
    title: '9. Batasan Permintaan yang Tidak Termasuk Layanan',
    body: 'Layanan tidak otomatis mencakup copywriting penuh, desain grafis, input data massal, migrasi data besar, integrasi payment gateway khusus, WhatsApp API, aplikasi mobile custom, AI custom, digital marketing, atau support 24 jam.'
  },
  {
    title: '10. Ketentuan Pembayaran',
    body: 'Biaya layanan mengikuti paket dan invoice. Keterlambatan pembayaran dapat menyebabkan penundaan support, pembatasan akses, atau penonaktifan sementara layanan.'
  },
  {
    title: '11. Invoice dan Payment Receipt',
    body: 'Obayan dapat menerbitkan quotation, invoice, payment receipt, dan berita acara aktivasi/serah terima akses sebagai dokumen pendukung kerja sama.'
  },
  {
    title: '12. Aktivasi, Go-Live, dan Serah Terima',
    body: 'Sistem dianggap siap go-live apabila fitur utama sesuai paket tersedia, akses admin dibuat, pembayaran awal diterima, dan proses review/revisi minor selesai atau dijadwalkan.'
  },
  {
    title: '13. Support dan Maintenance',
    body: 'Support mencakup bantuan teknis dasar, bug ringan, pemeriksaan error, dan bantuan penggunaan fitur. Support tidak mencakup fitur baru, input data rutin, perubahan desain besar, atau pelatihan berulang tanpa kesepakatan.'
  },
  {
    title: '14. Maintenance Terjadwal dan Gangguan Sistem',
    body: 'Obayan dapat melakukan maintenance untuk pembaruan, keamanan, backup, optimasi, dan perbaikan. Gangguan sementara dapat terjadi selama proses maintenance.'
  },
  {
    title: '15. Domain, Hosting, Server, dan Layanan Pihak Ketiga',
    body: 'Jika domain/server/API pihak ketiga memakai akun Klien, maka Klien bertanggung jawab atas pembayaran, perpanjangan, konfigurasi, akses, dan kebijakan provider tersebut.'
  },
  {
    title: '16. Keamanan Akun dan Akses',
    body: 'Klien wajib menjaga kerahasiaan username, password, email, dan akses admin. Obayan tidak bertanggung jawab atas penyalahgunaan akun akibat kelalaian pengguna Klien.'
  },
  {
    title: '17. Perlindungan Data dan Privasi',
    body: 'Obayan menjaga kerahasiaan data Klien dan tidak menjual data kepada pihak ketiga. Klien bertanggung jawab atas persetujuan dan legalitas data yang dimasukkan ke sistem.'
  },
  {
    title: '18. Kepemilikan Sistem dan Hak Kekayaan Intelektual',
    body: 'Source code, framework, template, desain sistem, struktur database, dan modul Obayan tetap milik Obayan kecuali ada perjanjian tertulis berbeda. Klien memiliki hak atas konten dan data miliknya.'
  },
  {
    title: '19. Larangan Penggunaan',
    body: 'Layanan tidak boleh digunakan untuk aktivitas ilegal, konten melanggar hukum, hacking, malware, spam, phishing, reverse engineering, atau penjualan ulang tanpa izin tertulis.'
  },
  {
    title: '20. Batasan Tanggung Jawab',
    body: 'Obayan tidak bertanggung jawab atas kesalahan data dari Klien, kelalaian pengguna, gangguan internet Klien, layanan pihak ketiga, force majeure, atau kerugian tidak langsung.'
  },
  {
    title: '21. Keterlambatan Data dan Dampaknya terhadap Timeline',
    body: 'Timeline dapat berubah apabila Klien terlambat memberikan data, konten, feedback, pembayaran, atau validasi. Obayan tidak bertanggung jawab atas mundurnya jadwal akibat keterlambatan dari Klien.'
  },
  {
    title: '22. Pembatalan dan Penghentian Layanan',
    body: 'Klien dapat menghentikan langganan dengan pemberitahuan tertulis. Obayan dapat menangguhkan layanan apabila terjadi pelanggaran, keterlambatan pembayaran, atau risiko keamanan.'
  },
  {
    title: '23. Refund',
    body: 'Biaya yang telah dibayarkan tidak dapat dikembalikan apabila pengerjaan telah dimulai, layanan aktif, Klien membatalkan sepihak, atau Klien tidak menyediakan data yang dibutuhkan.'
  },
  {
    title: '24. Force Majeure',
    body: 'Obayan tidak bertanggung jawab atas gangguan akibat kejadian di luar kendali wajar seperti bencana, gangguan provider, serangan siber besar, kebijakan pemerintah, atau keadaan darurat lain.'
  },
  {
    title: '25. Penyelesaian Perselisihan',
    body: 'Perselisihan diselesaikan terlebih dahulu melalui musyawarah. Jika tidak selesai, dapat dilanjutkan melalui mekanisme hukum yang berlaku di Indonesia.'
  },
  {
    title: '26. Perubahan Terms & Conditions',
    body: 'Obayan dapat memperbarui Terms & Conditions apabila terdapat perubahan layanan, teknologi, harga, hukum, atau kebutuhan operasional dengan pemberitahuan yang wajar.'
  },
  {
    title: '27. Persetujuan',
    body: 'Dengan melakukan pembayaran, menggunakan layanan, menerima akses admin, atau menyetujui proposal/quotation/invoice, Klien dianggap membaca, memahami, dan menyetujui Terms & Conditions.'
  }
]
