<template>
  <main class="min-h-screen bg-slate-100 text-slate-950">
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <header class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
              Tenant Pricing
            </p>
            <h1 class="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
              {{ tenantName }}
            </h1>
            <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Kelola harga paket, biaya per santri, promo, dan skema tagihan tahunan untuk tenant ini.
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="copying"
              @click="copyPaymentLink"
            >
              {{ copying ? 'Menyalin...' : 'Copy Payment Link' }}
            </button>

            <a
              :href="paymentHref"
              class="rounded-lg border border-slate-200 bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Buka Payment
            </a>

            <button
              type="button"
              class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="saving"
              @click="savePricing"
            >
              {{ saving ? 'Menyimpan...' : 'Simpan Pricing' }}
            </button>
          </div>
        </div>
      </header>

      <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            Tenant
          </p>
          <p class="mt-2 truncate text-lg font-black">
            /{{ tenantSlug }}
          </p>
        </div>

        <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            Paket Aktif
          </p>
          <p class="mt-2 text-lg font-black">
            {{ enabledCount }} / {{ packageRows.length }}
          </p>
        </div>

        <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            Tahunan
          </p>
          <p class="mt-2 text-lg font-black">
            Bayar {{ yearlyChargedMonths }} bulan
          </p>
        </div>

        <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            Preview Santri
          </p>
          <div class="mt-2 flex items-center gap-2">
            <input
              v-model.number="form.santriPreview"
              type="number"
              min="0"
              class="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
            <span class="text-sm font-bold text-slate-500">santri</span>
          </div>
        </div>
      </section>

      <section
        v-if="error"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
      >
        {{ error }}
      </section>

      <section
        v-if="successMessage"
        class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
      >
        {{ successMessage }}
      </section>

      <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px] md:items-end">
          <div>
            <label class="text-sm font-black text-slate-800" for="yearly-months">
              Jumlah bulan yang ditagihkan untuk paket tahunan
            </label>
            <p class="mt-1 text-sm leading-6 text-slate-500">
              Nilai 10 berarti tenant membayar 10 bulan dan mendapat masa aktif 12 bulan.
            </p>
          </div>

          <input
            id="yearly-months"
            v-model.number="form.yearlyChargedMonths"
            type="number"
            min="1"
            max="12"
            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          >
        </div>
      </section>

      <section class="grid gap-4 xl:grid-cols-2">
        <article
          v-for="row in packageRows"
          :key="row.id"
          class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          :class="row.enabled ? '' : 'bg-slate-50 opacity-75'"
        >
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div class="flex items-center gap-2">
                <span class="rounded-md bg-slate-100 px-2 py-1 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  {{ row.id }}
                </span>
                <span
                  class="rounded-md px-2 py-1 text-xs font-black"
                  :class="row.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-500'"
                >
                  {{ row.enabled ? 'Aktif' : 'Nonaktif' }}
                </span>
              </div>

              <h2 class="mt-3 text-xl font-black">
                {{ row.name || defaultPackageName(row.id) }}
              </h2>
              <p class="mt-1 text-sm leading-6 text-slate-500">
                {{ row.subtitle || defaultPackageSubtitle(row.id) }}
              </p>
            </div>

            <label class="inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-700">
              <input
                v-model="row.enabled"
                type="checkbox"
                class="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              >
              Tampilkan
            </label>
          </div>

          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <label class="space-y-1.5">
              <span class="text-xs font-bold text-slate-500">Nama Paket</span>
              <input
                v-model.trim="row.name"
                type="text"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
            </label>

            <label class="space-y-1.5">
              <span class="text-xs font-bold text-slate-500">Badge</span>
              <input
                v-model.trim="row.badge"
                type="text"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
            </label>

            <label class="space-y-1.5 sm:col-span-2">
              <span class="text-xs font-bold text-slate-500">Subtitle</span>
              <input
                v-model.trim="row.subtitle"
                type="text"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
            </label>

            <label class="space-y-1.5 sm:col-span-2">
              <span class="text-xs font-bold text-slate-500">Promo Label</span>
              <input
                v-model.trim="row.promoLabel"
                type="text"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
            </label>
          </div>

          <div class="mt-5 grid gap-3 sm:grid-cols-2">
            <label class="space-y-1.5">
              <span class="text-xs font-bold text-slate-500">Harga Normal / Bulan</span>
              <input
                v-model.number="row.regularMonthlyPrice"
                type="number"
                min="0"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
            </label>

            <label class="space-y-1.5">
              <span class="text-xs font-bold text-slate-500">Harga Promo / Bulan</span>
              <input
                v-model.number="row.baseMonthlyPrice"
                type="number"
                min="0"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
            </label>

            <label class="space-y-1.5">
              <span class="text-xs font-bold text-slate-500">Normal / Santri</span>
              <input
                v-model.number="row.regularPerSantriPrice"
                type="number"
                min="0"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
            </label>

            <label class="space-y-1.5">
              <span class="text-xs font-bold text-slate-500">Promo / Santri</span>
              <input
                v-model.number="row.perSantriPrice"
                type="number"
                min="0"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
            </label>
          </div>

          <div class="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
            <div class="rounded-lg bg-slate-50 p-4">
              <p class="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                Bulanan
              </p>
              <p class="mt-2 text-lg font-black">
                {{ formatIDR(previewMap[row.id]?.monthly.total || 0) }}
              </p>
            </div>

            <div class="rounded-lg bg-emerald-50 p-4">
              <p class="text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
                Tahunan
              </p>
              <p class="mt-2 text-lg font-black text-emerald-800">
                {{ formatIDR(previewMap[row.id]?.yearly.total || 0) }}
              </p>
            </div>
          </div>
        </article>
      </section>

      <footer class="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm font-semibold text-slate-500">
          Updated: {{ updatedLabel }}
        </p>

        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50"
            @click="resetDefaults"
          >
            Reset Default
          </button>

          <button
            type="button"
            class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="saving"
            @click="savePricing"
          >
            {{ saving ? 'Menyimpan...' : 'Simpan Pricing' }}
          </button>
        </div>
      </footer>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { get, ref as dbRef, serverTimestamp, set } from 'firebase/database'
import {
  DEFAULT_YEARLY_CHARGED_MONTHS,
  PAYMENT_PACKAGE_IDS,
  PAYMENT_PACKAGES,
  type PaymentPackageId,
  type TenantPricingConfig,
  calculateInvoice,
  formatIDR,
  normalizeTenantPricingConfig,
  normalizeYearlyChargedMonths,
  resolvePaymentPackages,
  sanitizeTenantSlug,
  titleCaseTenant
} from '../../../utils/obayanPayment'

definePageMeta({ layout: false })

type EditablePackage = {
  id: PaymentPackageId
  enabled: boolean
  name: string
  subtitle: string
  regularMonthlyPrice: number
  baseMonthlyPrice: number
  regularPerSantriPrice: number
  perSantriPrice: number
  badge: string
  promoLabel: string
}

const route = useRoute()
const nuxtApp = useNuxtApp() as any

const rawTenant = computed(() => String(route.params.tenant || 'obayan'))
const tenantSlug = computed(() => sanitizeTenantSlug(rawTenant.value))
const tenantName = computed(() => titleCaseTenant(tenantSlug.value))
const pricingPath = computed(() => `${tenantSlug.value}/settings/pricing`)

const loading = ref(true)
const saving = ref(false)
const copying = ref(false)
const error = ref('')
const successMessage = ref('')
const lastUpdatedAt = ref<number | null>(null)

const form = reactive({
  yearlyChargedMonths: DEFAULT_YEARLY_CHARGED_MONTHS,
  santriPreview: 150
})

const packageRows = ref<EditablePackage[]>(createRows())

const yearlyChargedMonths = computed(() => normalizeYearlyChargedMonths(form.yearlyChargedMonths))
const enabledCount = computed(() => packageRows.value.filter((row) => row.enabled).length)
const paymentHref = computed(() => `/${tenantSlug.value}/payment`)
const updatedLabel = computed(() => {
  if (!lastUpdatedAt.value) return '-'

  return new Date(lastUpdatedAt.value).toLocaleString('id-ID', { hour12: false })
})

const previewMap = computed(() => {
  const packages = resolvePaymentPackages(toPricingConfig())

  return PAYMENT_PACKAGE_IDS.reduce<Record<PaymentPackageId, any>>((acc, id) => {
    acc[id] = {
      monthly: calculateInvoice({
        packageId: id,
        duration: 'monthly',
        santriCount: form.santriPreview,
        packages,
        yearlyChargedMonths: yearlyChargedMonths.value
      }),
      yearly: calculateInvoice({
        packageId: id,
        duration: 'yearly',
        santriCount: form.santriPreview,
        packages,
        yearlyChargedMonths: yearlyChargedMonths.value
      })
    }

    return acc
  }, {} as Record<PaymentPackageId, any>)
})

useHead(() => ({
  title: `Pricing ${tenantName.value} | Obayan`,
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
}))

onMounted(() => {
  loadPricing()
})

function createRows(config?: TenantPricingConfig): EditablePackage[] {
  const packages = resolvePaymentPackages(config)

  return PAYMENT_PACKAGE_IDS.map((id) => {
    const pkg = packages[id]

    return {
      id,
      enabled: pkg.enabled !== false,
      name: pkg.name,
      subtitle: pkg.subtitle,
      regularMonthlyPrice: pkg.regularMonthlyPrice,
      baseMonthlyPrice: pkg.baseMonthlyPrice,
      regularPerSantriPrice: pkg.regularPerSantriPrice ?? pkg.perSantriPrice,
      perSantriPrice: pkg.perSantriPrice,
      badge: pkg.badge || '',
      promoLabel: pkg.promoLabel || ''
    }
  })
}

function defaultPackageName(id: PaymentPackageId) {
  return PAYMENT_PACKAGES[id].name
}

function defaultPackageSubtitle(id: PaymentPackageId) {
  return PAYMENT_PACKAGES[id].subtitle
}

function cleanPrice(value: unknown) {
  const numberValue = Number(value)

  return Number.isFinite(numberValue) && numberValue >= 0
    ? Math.round(numberValue)
    : 0
}

function toPricingConfig(): TenantPricingConfig {
  return {
    yearlyChargedMonths: yearlyChargedMonths.value,
    packages: packageRows.value.reduce<TenantPricingConfig['packages']>((acc, row) => {
      acc![row.id] = {
        enabled: row.enabled,
        name: row.name.trim() || defaultPackageName(row.id),
        subtitle: row.subtitle.trim() || defaultPackageSubtitle(row.id),
        regularMonthlyPrice: cleanPrice(row.regularMonthlyPrice),
        baseMonthlyPrice: cleanPrice(row.baseMonthlyPrice),
        regularPerSantriPrice: cleanPrice(row.regularPerSantriPrice),
        perSantriPrice: cleanPrice(row.perSantriPrice),
        badge: row.badge.trim(),
        promoLabel: row.promoLabel.trim()
      }

      return acc
    }, {})
  }
}

async function loadPricing() {
  loading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    if (!nuxtApp.$realtimeDb) {
      throw new Error('Firebase belum siap. Refresh halaman lalu coba lagi.')
    }

    const snap = await get(dbRef(nuxtApp.$realtimeDb, pricingPath.value))
    const config = normalizeTenantPricingConfig(snap.val())

    form.yearlyChargedMonths = normalizeYearlyChargedMonths(config.yearlyChargedMonths)
    packageRows.value = createRows(config)
    lastUpdatedAt.value = Number((config.updatedAt as any) || 0) || null
  } catch (err: any) {
    error.value = err?.message || 'Gagal memuat pricing tenant.'
  } finally {
    loading.value = false
  }
}

async function savePricing() {
  saving.value = true
  error.value = ''
  successMessage.value = ''

  try {
    if (!nuxtApp.$realtimeDb) {
      throw new Error('Firebase belum siap. Refresh halaman lalu coba lagi.')
    }

    await set(dbRef(nuxtApp.$realtimeDb, pricingPath.value), {
      ...toPricingConfig(),
      updatedAt: serverTimestamp()
    })

    lastUpdatedAt.value = Date.now()
    successMessage.value = 'Pricing tenant berhasil disimpan.'
  } catch (err: any) {
    error.value = err?.message || 'Gagal menyimpan pricing tenant.'
  } finally {
    saving.value = false
  }
}

function resetDefaults() {
  form.yearlyChargedMonths = DEFAULT_YEARLY_CHARGED_MONTHS
  packageRows.value = createRows()
  successMessage.value = 'Pricing dikembalikan ke default. Klik Simpan Pricing untuk menerapkan.'
}

async function copyPaymentLink() {
  copying.value = true
  error.value = ''
  successMessage.value = ''

  try {
    const origin = typeof window !== 'undefined'
      ? window.location.origin
      : 'https://obayan.id'

    await navigator.clipboard.writeText(`${origin}${paymentHref.value}`)
    successMessage.value = 'Payment link berhasil disalin.'
  } catch (err: any) {
    error.value = err?.message || 'Payment link belum bisa disalin.'
  } finally {
    copying.value = false
  }
}
</script>
