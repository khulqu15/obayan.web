import {
  PAYMENT_PACKAGES,
  type PaymentPackageId,
  type BillingDuration,
  calculateInvoice,
  generateInvoiceNumber,
  normalizePhone,
  sanitizeTenantSlug,
  OBAYAN_SELLER
} from '../../../../utils/obayanPayment'

type CreatePaymentBody = {
  tenant: string
  tenantName: string
  picName: string
  picPosition: string
  picWhatsapp: string
  packageId: PaymentPackageId
  duration: BillingDuration
  santriCount?: number
  requestNote?: string
  contractStart: string
  contractEnd: string
}

function required(value: unknown, message: string) {
  if (value === undefined || value === null || String(value).trim() === '') {
    throw createError({
      statusCode: 422,
      statusMessage: message
    })
  }
}

function ymd(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<CreatePaymentBody>(event)

  required(body.tenant, 'Tenant wajib diisi')
  required(body.tenantName, 'Nama tenant wajib diisi')
  required(body.picName, 'Nama PIC wajib diisi')
  required(body.picPosition, 'Jabatan PIC wajib diisi')
  required(body.picWhatsapp, 'Nomor WhatsApp PIC wajib diisi')
  required(body.packageId, 'Paket wajib dipilih')
  required(body.duration, 'Durasi langganan wajib dipilih')
  required(body.contractStart, 'Tanggal mulai kontrak wajib diisi')
  required(body.contractEnd, 'Tanggal habis kontrak wajib diisi')

  const serverKey = String(config.midtransServerKey || '')
  const isProduction = Boolean(config.midtransIsProduction)

  if (!serverKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'MIDTRANS_SERVER_KEY belum diset di .env'
    })
  }

  const tenant = sanitizeTenantSlug(body.tenant)
  const pkg = PAYMENT_PACKAGES[body.packageId]

  if (!pkg) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Paket tidak valid'
    })
  }

  const pricing = calculateInvoice({
    packageId: body.packageId,
    duration: body.duration,
    santriCount: Number(body.santriCount || 0)
  })

  const now = new Date()
  const invoiceNo = generateInvoiceNumber(tenant)
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()

  // Midtrans order_id max 50 char dan harus unik.
  const orderId = `OBY-${tenant.slice(0, 10).toUpperCase()}-${Date.now()}-${random}`.slice(0, 50)

  const issueDate = ymd(now)
  const dueDate = ymd(addDays(now, 7))

  const snapEndpoint = isProduction
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions'

  const packageName = `${pkg.name} - ${pkg.subtitle}`

  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: pricing.total
    },

    item_details: [
      {
        id: `${pkg.id}-${body.duration}`,
        price: pricing.total,
        quantity: 1,
        name: packageName.slice(0, 50),
        category: 'Obayan Subscription'
      }
    ],

    customer_details: {
      first_name: String(body.picName || '').slice(0, 50),
      phone: normalizePhone(body.picWhatsapp),
      billing_address: {
        first_name: String(body.picName || '').slice(0, 50),
        phone: normalizePhone(body.picWhatsapp)
      }
    },

    custom_field1: tenant,
    custom_field2: invoiceNo,
    custom_field3: body.packageId
  }

  const auth = Buffer.from(`${serverKey}:`).toString('base64')

  const midtransResponse = await $fetch<{
    token: string
    redirect_url: string
  }>(snapEndpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`
    },
    body: parameter
  })

  return {
    ok: true,
    orderId,
    invoiceNo,

    invoice: {
      tenant,
      tenantName: body.tenantName,
      orderId,
      invoiceNo,
      status: 'waiting_payment',
      issueDate,
      dueDate,
      contractStart: body.contractStart,
      contractEnd: body.contractEnd,

      customer: {
        name: body.picName,
        position: body.picPosition,
        whatsapp: normalizePhone(body.picWhatsapp)
      },

      package: {
        id: pkg.id,
        name: pkg.name,
        subtitle: pkg.subtitle,
        duration: pkg.isOneTime
          ? 'one_time'
          : body.duration,
        santriCount: Number(body.santriCount || 0)
      },

      pricing: {
        monthlyUnitPrice: pricing.monthlyUnitPrice,
        regularSubtotal: pricing.regularSubtotal,
        subtotal: pricing.subtotal,
        launchingDiscount: pricing.launchingDiscount,
        yearlyDiscount: pricing.yearlyDiscount,
        discount: pricing.totalDiscount,
        total: pricing.total,
        currency: 'IDR'
      },

      requestNote: body.requestNote || '',

      seller: OBAYAN_SELLER,

      terms: {
        accepted: true,
        acceptedAt: new Date().toISOString(),
        version: 'obayan-tnc-v1'
      },

      midtrans: {
        token: midtransResponse.token,
        redirectUrl: midtransResponse.redirect_url,
        rawResponse: midtransResponse
      }
    },

    midtrans: midtransResponse
  }
})