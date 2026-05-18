import { ref } from 'vue'
import { useNuxtApp } from '#app'
import {
  ref as dbRef,
  set,
  update,
  serverTimestamp
} from 'firebase/database'
import {
  sanitizeTenantSlug
} from '../../../utils/obayanPayment'

export type InvoiceStatus =
  | 'waiting_payment'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'expired'
  | 'cancelled'

export type PaymentInvoice = {
  tenant: string
  tenantName: string
  orderId: string
  invoiceNo: string
  status: InvoiceStatus
  issueDate: string
  dueDate: string
  contractStart: string
  contractEnd: string

  customer: {
    name: string
    position: string
    whatsapp: string
  }

  package: {
    id: string
    name: string
    subtitle: string
    duration: string
    santriCount: number
  }

  pricing: {
    monthlyUnitPrice: number
    subtotal: number
    discount: number
    total: number
    currency: 'IDR'
  }

  requestNote?: string

  seller: {
    name: string
    email: string
    phone: string
    address: string
  }

  terms: {
    accepted: boolean
    acceptedAt: string
    version: string
  }

  midtrans?: {
    token?: string
    redirectUrl?: string
    rawResponse?: unknown
  }

  paymentResult?: unknown
  createdAt?: unknown
  updatedAt?: unknown
}

function safeFirebaseKey(value: string) {
  return String(value || '')
    .replace(/[.#$/[\]]/g, '-')
}

export function usePayment(tenantSlug: string) {
  const { $realtimeDb } = useNuxtApp() as any

  const loading = ref(false)
  const error = ref<string | null>(null)

  const tenant = sanitizeTenantSlug(tenantSlug)

  const createInvoice = async (invoice: PaymentInvoice) => {
    loading.value = true
    error.value = null

    try {
      const invoiceKey = safeFirebaseKey(invoice.invoiceNo)

      const payload = {
        ...invoice,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      await set(
        dbRef($realtimeDb, `${tenant}/payments/${invoice.orderId}`),
        payload
      )

      await set(
        dbRef($realtimeDb, `${tenant}/invoices/${invoiceKey}`),
        {
          orderId: invoice.orderId,
          invoiceNo: invoice.invoiceNo,
          tenant: invoice.tenant,
          tenantName: invoice.tenantName,
          customer: invoice.customer,
          package: invoice.package,
          pricing: invoice.pricing,
          status: invoice.status,
          issueDate: invoice.issueDate,
          dueDate: invoice.dueDate,
          contractStart: invoice.contractStart,
          contractEnd: invoice.contractEnd,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }
      )

      return payload
    } catch (e: any) {
      error.value = e?.message || 'Gagal membuat invoice'
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateInvoiceStatus = async (
    orderId: string,
    status: InvoiceStatus,
    paymentResult?: unknown
  ) => {
    loading.value = true
    error.value = null

    try {
      await update(
        dbRef($realtimeDb, `${tenant}/payments/${orderId}`),
        {
          status,
          paymentResult: paymentResult || null,
          updatedAt: serverTimestamp()
        }
      )
    } catch (e: any) {
      error.value = e?.message || 'Gagal update status invoice'
      throw e
    } finally {
      loading.value = false
    }
  }

  const activateTenantSubscription = async (
  invoice: PaymentInvoice,
  paymentResult?: unknown
) => {
  loading.value = true
  error.value = null

  try {
    await update(
      dbRef($realtimeDb, `${tenant}/settings/subscription`),
      {
        isActive: true,
        status: 'active',

        packageId: invoice.package.id,
        packageName: invoice.package.name,
        packageSubtitle: invoice.package.subtitle,
        duration: invoice.package.duration,
        santriCount: invoice.package.santriCount,

        orderId: invoice.orderId,
        invoiceNo: invoice.invoiceNo,

        contractStart: invoice.contractStart,
        contractEnd: invoice.contractEnd,

        totalPaid: invoice.pricing.total,
        currency: invoice.pricing.currency,

        activatedAt: serverTimestamp(),
        paidAt: serverTimestamp(),
        updatedAt: serverTimestamp(),

        source: 'midtrans',
        paymentResult: paymentResult || null
      }
    )

    await update(
      dbRef($realtimeDb, `${tenant}/settings`),
      {
        subscriptionStatus: 'active',
        currentPackage: invoice.package.id,
        subscriptionEndDate: invoice.contractEnd,
        subscriptionUpdatedAt: serverTimestamp()
      }
    )
  } catch (e: any) {
    error.value = e?.message || 'Gagal mengaktifkan subscription tenant'
    throw e
  } finally {
    loading.value = false
  }
}

  return {
    loading,
    error,
    createInvoice,
    updateInvoiceStatus,
    activateTenantSubscription
  }
}