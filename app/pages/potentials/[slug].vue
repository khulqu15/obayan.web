<template>
  <main class="min-h-screen bg-neutral-50 text-neutral-950">
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-emerald-100 blur-3xl"></div>
      <div class="absolute -right-32 top-40 h-[420px] w-[420px] rounded-full bg-lime-100 blur-3xl"></div>
      <div class="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-yellow-100/70 blur-3xl"></div>
      <div class="absolute inset-0 bg-grid opacity-40"></div>
    </div>

    <section
      v-if="pending"
      class="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 lg:px-8"
    >
      <div class="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
        <div class="grid animate-pulse gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <div class="h-5 w-40 rounded-full bg-neutral-100"></div>
            <div class="mt-5 h-12 w-2/3 rounded-full bg-neutral-100"></div>
            <div class="mt-5 h-4 w-full rounded-full bg-neutral-100"></div>
            <div class="mt-2 h-4 w-4/5 rounded-full bg-neutral-100"></div>
          </div>

          <div class="h-64 rounded-[2rem] bg-neutral-100"></div>
        </div>
      </div>
    </section>

    <section
      v-else-if="error || !potential"
      class="mx-auto max-w-3xl px-4 pb-20 pt-28 text-center sm:px-6 lg:px-8"
    >
      <div class="rounded-[2rem] border border-red-200 bg-white p-8 shadow-sm">
        <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-red-50 text-red-600">
          <Icon icon="solar:danger-circle-bold-duotone" class="h-8 w-8" />
        </div>

        <h1 class="mt-5 text-2xl font-black text-neutral-950">
          Potensi tidak ditemukan
        </h1>

        <p class="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-neutral-500">
          Data potensi yang kamu buka belum tersedia, sudah tidak aktif, atau slug-nya tidak sesuai.
        </p>

        <NuxtLink
          to="/potentials"
          class="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-black text-white transition hover:bg-neutral-800"
        >
          <Icon icon="solar:arrow-left-linear" class="h-5 w-5" />
          Kembali ke Potensi
        </NuxtLink>
      </div>
    </section>

    <template v-else>
      <section class="relative overflow-hidden bg-neutral-950 pt-24 text-white">
        <div class="absolute inset-0">
          <img
            v-if="heroImage && !heroImageFailed"
            :src="heroImage"
            :alt="potential.title"
            class="h-full w-full object-cover opacity-60"
            @error="heroImageFailed = true"
          >

          <div
            v-else
            class="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-950 via-slate-950 to-lime-950"
          >
            <Icon
              :icon="potential.icon || getPotentialTypeIcon(potential.potentialType)"
              class="h-32 w-32 text-white/15"
            />
          </div>

          <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/25"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/55 to-transparent"></div>
        </div>

        <div class="relative mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 lg:px-8">
          <nav class="mb-8 flex flex-wrap items-center gap-2 text-sm font-bold text-white/60">
            <NuxtLink to="/" class="transition hover:text-white">
              Beranda
            </NuxtLink>
            <Icon icon="solar:alt-arrow-right-linear" class="h-4 w-4" />
            <NuxtLink to="/potentials" class="transition hover:text-white">
              Potensi
            </NuxtLink>
            <Icon icon="solar:alt-arrow-right-linear" class="h-4 w-4" />
            <span class="text-white">{{ potential.title }}</span>
          </nav>

          <div class="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div class="mb-5 flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white backdrop-blur">
                  <Icon :icon="getPotentialTypeIcon(potential.potentialType)" class="h-4 w-4" />
                  {{ potentialTypeLabel(potential.potentialType) }}
                </span>

                <span
                  class="rounded-full px-3 py-1.5 text-xs font-black backdrop-blur"
                  :class="potential.status === 'active'
                    ? 'bg-emerald-400/15 text-emerald-200'
                    : 'bg-white/10 text-white/70'"
                >
                  {{ potential.status }}
                </span>

                <span
                  v-if="potential.isFeatured"
                  class="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-black text-white shadow-lg shadow-emerald-900/20"
                >
                  Featured
                </span>
              </div>

              <h1 class="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {{ potential.title }}
              </h1>

              <p
                v-if="potential.subtitle"
                class="mt-5 max-w-3xl text-base font-medium leading-8 text-white/75 sm:text-lg"
              >
                {{ potential.subtitle }}
              </p>

              <div class="mt-7 flex flex-wrap gap-3">
                <a
                  v-if="whatsappUrl"
                  :href="whatsappUrl"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-neutral-950 transition hover:-translate-y-0.5 hover:bg-emerald-50"
                >
                  <Icon icon="solar:chat-round-call-bold-duotone" class="h-5 w-5 text-emerald-600" />
                  Hubungi WhatsApp
                </a>

                <a
                  v-if="mapsUrl"
                  :href="mapsUrl"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  <Icon icon="solar:map-point-bold-duotone" class="h-5 w-5" />
                  Buka Maps
                </a>

                <NuxtLink
                  to="/potentials"
                  class="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  <Icon icon="solar:arrow-left-linear" class="h-5 w-5" />
                  Semua Potensi
                </NuxtLink>
              </div>
            </div>

            <aside class="rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-2xl shadow-neutral-950/20 backdrop-blur-xl">
              <div class="flex items-start gap-4">
                <div class="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-3xl bg-white/10 text-white">
                  <img
                    v-if="potential.logoUrl && !logoFailed"
                    :src="potential.logoUrl"
                    :alt="potential.title"
                    class="h-full w-full object-cover"
                    @error="logoFailed = true"
                  >
                  <Icon
                    v-else
                    :icon="potential.icon || getPotentialTypeIcon(potential.potentialType)"
                    class="h-8 w-8"
                  />
                </div>

                <div class="min-w-0">
                  <p class="text-xs font-black uppercase tracking-[0.14em] text-white/50">
                    Potensi
                  </p>
                  <p class="mt-1 truncate text-lg font-black text-white">
                    {{ potential.title }}
                  </p>
                  <p class="mt-1 truncate text-xs font-bold text-white/50">
                    {{ potential.slug }}
                  </p>
                </div>
              </div>

              <div class="mt-5 grid gap-2">
                <InfoRow label="Kategori" :value="potentialTypeLabel(potential.potentialType)" />
                <InfoRow label="Pasar" :value="potential.marketReach || '-'" />
                <InfoRow label="Update" :value="formatDate(potential.updatedAt)" />
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section class="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <article class="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm">
          <div class="border-b border-neutral-200 px-5 py-4 sm:px-6">
            <div class="flex items-center gap-3">
              <div class="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Icon icon="solar:document-text-bold-duotone" class="h-5 w-5" />
              </div>

              <div>
                <p class="text-sm font-black text-neutral-950">
                  Detail {{ potential.title }}
                </p>
                <p class="text-xs font-semibold text-neutral-500">
                  Informasi lengkap potensi desa
                </p>
              </div>
            </div>
          </div>

          <div class="px-5 py-6 sm:px-6">
            <div
              v-if="safeContentHtml"
              class="potential-content"
              v-html="safeContentHtml"
            ></div>

            <div
              v-else
              class="rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center"
            >
              <Icon icon="solar:document-bold-duotone" class="mx-auto h-10 w-10 text-neutral-400" />
              <p class="mt-3 text-sm font-bold text-neutral-500">
                Belum ada content detail untuk potensi ini.
              </p>
            </div>
          </div>
        </article>

        <aside class="space-y-4">
          <div class="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm">
            <p class="text-sm font-black text-neutral-950">
              Informasi Potensi
            </p>

            <div class="mt-4 space-y-4">
              <div v-if="potential.ownerName">
                <p class="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">
                  Pemilik
                </p>
                <p class="mt-1 text-sm font-bold leading-6 text-neutral-700">
                  {{ potential.ownerName }}
                </p>
              </div>

              <div v-if="potential.managerName">
                <p class="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">
                  Pengelola
                </p>
                <p class="mt-1 text-sm font-bold leading-6 text-neutral-700">
                  {{ potential.managerName }}
                </p>
              </div>

              <div v-if="potential.productionCapacity || potential.productionUnit">
                <p class="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">
                  Kapasitas Produksi
                </p>
                <p class="mt-1 text-sm font-bold leading-6 text-neutral-700">
                  {{ potential.productionCapacity || '-' }} {{ potential.productionUnit || '' }}
                </p>
              </div>

              <div v-if="potential.marketReach">
                <p class="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">
                  Jangkauan Pasar
                </p>
                <p class="mt-1 text-sm font-bold leading-6 text-neutral-700">
                  {{ potential.marketReach }}
                </p>
              </div>

              <div v-if="potential.estimatedValue !== null">
                <p class="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">
                  Estimasi Nilai
                </p>
                <p class="mt-1 text-sm font-bold leading-6 text-neutral-700">
                  {{ formatCurrency(potential.estimatedValue) }}
                </p>
              </div>

              <div v-if="potential.address">
                <p class="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">
                  Alamat
                </p>
                <p class="mt-1 text-sm font-bold leading-6 text-neutral-700">
                  {{ potential.address }}
                </p>
              </div>

              <div v-if="potential.phone || potential.whatsapp">
                <p class="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">
                  Kontak
                </p>
                <p class="mt-1 text-sm font-bold text-neutral-700">
                  {{ potential.whatsapp || potential.phone }}
                </p>
              </div>

              <div v-if="potential.email">
                <p class="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">
                  Email
                </p>
                <a
                  :href="`mailto:${potential.email}`"
                  class="mt-1 block truncate text-sm font-bold text-emerald-600 hover:underline"
                >
                  {{ potential.email }}
                </a>
              </div>

              <div v-if="potential.websiteUrl">
                <p class="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">
                  Website
                </p>
                <a
                  :href="potential.websiteUrl"
                  target="_blank"
                  rel="noopener"
                  class="mt-1 block truncate text-sm font-bold text-emerald-600 hover:underline"
                >
                  {{ potential.websiteUrl }}
                </a>
              </div>
            </div>
          </div>

          <div
            v-if="potential.latitude && potential.longitude"
            class="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm"
          >
            <div class="border-b border-neutral-200 p-5">
              <p class="text-sm font-black text-neutral-950">
                Lokasi
              </p>
              <p class="mt-1 text-xs font-semibold text-neutral-500">
                Koordinat potensi
              </p>
            </div>

            <div class="p-5">
              <div class="rounded-3xl bg-neutral-50 p-4">
                <p class="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">
                  Latitude
                </p>
                <p class="mt-1 text-sm font-bold text-neutral-800">
                  {{ potential.latitude }}
                </p>

                <p class="mt-4 text-xs font-black uppercase tracking-[0.14em] text-neutral-400">
                  Longitude
                </p>
                <p class="mt-1 text-sm font-bold text-neutral-800">
                  {{ potential.longitude }}
                </p>
              </div>

              <a
                :href="mapsUrl"
                target="_blank"
                rel="noopener"
                class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-black text-white transition hover:bg-neutral-800"
              >
                <Icon icon="solar:map-point-bold-duotone" class="h-5 w-5" />
                Buka Google Maps
              </a>
            </div>
          </div>

          <NuxtLink
            to="/potentials"
            class="flex items-center justify-between gap-3 rounded-[1.5rem] border border-neutral-200 bg-white p-4 text-sm font-black text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-neutral-50"
          >
            <span class="inline-flex items-center gap-2">
              <Icon icon="solar:arrow-left-linear" class="h-5 w-5" />
              Kembali ke Potensi
            </span>
          </NuxtLink>
        </aside>
      </section>

      <section
        v-if="relatedPotentials.length"
        class="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8"
      >
        <div class="mb-5 flex items-end justify-between gap-4">
          <div>
            <p class="text-xs font-black uppercase tracking-[0.14em] text-emerald-600">
              Potensi Terkait
            </p>
            <h2 class="mt-2 text-2xl font-black tracking-tight text-neutral-950">
              Potensi lain yang mungkin relevan
            </h2>
          </div>

          <NuxtLink
            to="/potentials"
            class="hidden rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-xs font-black text-neutral-600 shadow-sm transition hover:bg-neutral-50 sm:inline-flex"
          >
            Lihat Semua
          </NuxtLink>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="item in relatedPotentials"
            :key="item.id"
            :to="`/potentials/${item.slug}`"
            class="group overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5"
          >
            <div class="relative h-40 bg-neutral-100">
              <img
                v-if="getPotentialImage(item) && !relatedFailedImages[item.id]"
                :src="getPotentialImage(item)"
                :alt="item.title"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                @error="markRelatedImageFailed(item.id)"
              >

              <div
                v-else
                class="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-lime-50 text-emerald-600"
              >
                <Icon :icon="item.icon || getPotentialTypeIcon(item.potentialType)" class="h-12 w-12" />
              </div>
            </div>

            <div class="p-5">
              <p class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                <Icon :icon="getPotentialTypeIcon(item.potentialType)" class="h-3.5 w-3.5" />
                {{ potentialTypeLabel(item.potentialType) }}
              </p>

              <h3 class="mt-3 line-clamp-2 text-lg font-black leading-7 text-neutral-950 group-hover:text-emerald-700">
                {{ item.title }}
              </h3>

              <p class="mt-2 line-clamp-2 text-sm font-medium leading-6 text-neutral-500">
                {{ item.subtitle || 'Informasi potensi desa.' }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </section>
    </template>
  </main>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref } from 'process'
import { computed, defineComponent, h } from 'vue'
import { useAppApi } from '~/composables/useAppApi'
import type {
  PotentialDetailResponse,
  PotentialItem,
  PotentialListResponse,
  PotentialType
} from '~/types/potential'

const route = useRoute()
const requestUrl = useRequestURL()
const runtime = useRuntimeConfig()

const { tenantApiUrl } = useAppApi()

const heroImageFailed = ref(false)
const logoFailed = ref(false)
const relatedFailedImages = ref<Record<string, boolean>>({})

const hostname = computed(() => {
  return String(requestUrl.hostname || '')
    .replace(/^www\./, '')
    .toLowerCase()
})

const tenantSlug = computed(() => {
  const envClient = String(runtime.public.clientName || 'martopuro')
    .trim()
    .toLowerCase()

  if (hostname.value.includes('martopuro')) return 'martopuro'
  if (hostname.value.includes('obayan')) return 'obayan'

  return envClient || 'martopuro'
})

const slug = computed(() => {
  return String(route.params.slug || '')
    .trim()
    .toLowerCase()
})

const apiUrl = computed(() => {
  return tenantApiUrl(tenantSlug.value, `/potentials/by-slug/${encodeURIComponent(slug.value)}`)
})

const {
  data,
  pending,
  error
} = await useFetch<PotentialDetailResponse>(apiUrl, {
  key: computed(() => `potential-detail-${tenantSlug.value}-${slug.value}`),
  watch: [tenantSlug, slug],
  default: () => ({
    data: null as any
  })
})

const potential = computed<PotentialItem | null>(() => {
  return data.value?.data || null
})

const relatedApiUrl = computed(() => {
  return tenantApiUrl(tenantSlug.value, `/potentials`)
})

const {
  data: relatedResponse
} = await useFetch<PotentialListResponse>(relatedApiUrl, {
  key: computed(() => `potential-related-${tenantSlug.value}-${potential.value?.potentialType || 'all'}`),
  query: computed(() => ({
    status: 'active',
    type: potential.value?.potentialType,
    limit: 6,
    sort: 'sort_order'
  })),
  watch: [tenantSlug, potential],
  default: () => ({
    data: [],
    meta: {
      page: 1,
      limit: 6,
      total: 0,
      totalPages: 1
    }
  })
})

const heroImage = computed(() => {
  if (!potential.value) return ''
  return getPotentialImage(potential.value)
})

const safeContentHtml = computed(() => {
  return sanitizeHtml(potential.value?.contentHtml || '')
})

const whatsappUrl = computed(() => {
  const value = potential.value?.whatsapp || potential.value?.phone || ''
  const number = String(value).replace(/\D/g, '')

  if (!number) return ''

  return `https://wa.me/${number.startsWith('0') ? `62${number.slice(1)}` : number}`
})

const mapsUrl = computed(() => {
  if (!potential.value) return ''

  if (potential.value.latitude && potential.value.longitude) {
    return `https://www.google.com/maps/search/?api=1&query=${potential.value.latitude},${potential.value.longitude}`
  }

  if (potential.value.address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(potential.value.address)}`
  }

  return ''
})

const relatedPotentials = computed(() => {
  const currentId = potential.value?.id

  return (relatedResponse.value?.data || [])
    .filter((item) => item.id !== currentId)
    .slice(0, 3)
})

const pageTitle = computed(() => {
  return potential.value
    ? `${potential.value.title} · Potensi Desa`
    : 'Potensi tidak ditemukan'
})

const pageDescription = computed(() => {
  return potential.value?.subtitle ||
    plainText(potential.value?.contentHtml || '').slice(0, 160) ||
    'Informasi potensi desa.'
})

useSeoMeta({
  title: () => pageTitle.value,
  description: () => pageDescription.value,
  ogTitle: () => pageTitle.value,
  ogDescription: () => pageDescription.value,
  ogImage: () => heroImage.value || undefined,
  robots: 'index, follow'
})

useHead(() => ({
  htmlAttrs: {
    lang: 'id'
  },
  link: [
    {
      rel: 'canonical',
      href: `${requestUrl.origin}/potentials/${slug.value}`
    }
  ]
}))

const potentialTypeOptions: {
  value: PotentialType
  label: string
  icon: string
}[] = [
  { value: 'agriculture', label: 'Pertanian', icon: 'lucide:wheat' },
  { value: 'livestock', label: 'Peternakan', icon: 'lucide:cow' },
  { value: 'fishery', label: 'Perikanan', icon: 'lucide:fish' },
  { value: 'umkm', label: 'UMKM', icon: 'lucide:store' },
  { value: 'tourism', label: 'Wisata', icon: 'lucide:map-pin' },
  { value: 'culture', label: 'Budaya', icon: 'lucide:landmark' },
  { value: 'natural_resource', label: 'SDA', icon: 'lucide:mountain' },
  { value: 'human_resource', label: 'SDM', icon: 'lucide:users' },
  { value: 'industry', label: 'Industri', icon: 'lucide:factory' },
  { value: 'creative_economy', label: 'Ekonomi Kreatif', icon: 'lucide:palette' },
  { value: 'food', label: 'Kuliner', icon: 'lucide:utensils' },
  { value: 'craft', label: 'Kerajinan', icon: 'lucide:gem' },
  { value: 'custom', label: 'Potensi', icon: 'lucide:layers' }
]

function getPotentialTypeIcon(type: PotentialType) {
  const match = potentialTypeOptions.find((item) => item.value === type)
  return match?.icon || 'lucide:layers'
}

function potentialTypeLabel(type: PotentialType) {
  const match = potentialTypeOptions.find((item) => item.value === type)
  return match?.label || 'Potensi'
}

function getPotentialImage(item: PotentialItem) {
  const metadataImages = Array.isArray(item.metadata?.images)
    ? item.metadata.images
    : []

  return item.imageUrl || metadataImages[0] || item.logoUrl || ''
}

function markRelatedImageFailed(id: string) {
  relatedFailedImages.value = {
    ...relatedFailedImages.value,
    [id]: true
  }
}

function sanitizeHtml(value: string) {
  const html = String(value || '').trim()

  if (!html) return ''

  if (typeof window !== 'undefined') {
    const doc = new DOMParser().parseFromString(html, 'text/html')

    doc.querySelectorAll('script, style, object, embed').forEach((element) => {
      element.remove()
    })

    doc.querySelectorAll('*').forEach((element) => {
      Array.from(element.attributes).forEach((attribute) => {
        const name = attribute.name.toLowerCase()
        const val = attribute.value || ''

        if (name.startsWith('on')) {
          element.removeAttribute(attribute.name)
        }

        if (['href', 'src'].includes(name) && /^javascript:/i.test(val)) {
          element.removeAttribute(attribute.name)
        }
      })
    })

    return doc.body.innerHTML
  }

  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
}

function plainText(value: string) {
  return String(value || '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function formatDate(value?: number | null) {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(value))
}

function formatCurrency(value: number | null) {
  if (value === null || typeof value === 'undefined') return '-'

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)
}

const InfoRow = defineComponent({
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },
  setup(props) {
    return () =>
      h(
        'div',
        {
          class:
            'flex items-center justify-between gap-3 rounded-2xl bg-white/10 px-4 py-3'
        },
        [
          h(
            'span',
            {
              class:
                'text-xs font-black uppercase tracking-[0.12em] text-white/50'
            },
            props.label
          ),
          h(
            'span',
            {
              class:
                'min-w-0 truncate text-right text-sm font-black text-white'
            },
            props.value
          )
        ]
      )
  }
})
</script>

<style scoped>
.bg-grid {
  background-size: 44px 44px;
  background-image:
    linear-gradient(to right, #e5e7eb 1px, transparent 1px),
    linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
}

.potential-content {
  color: #262626;
  font-size: 1rem;
  line-height: 1.8;
}

.potential-content :deep(h2) {
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  font-size: 1.75rem;
  line-height: 1.2;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #171717;
}

.potential-content :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 0.65rem;
  font-size: 1.35rem;
  line-height: 1.3;
  font-weight: 900;
  color: #171717;
}

.potential-content :deep(p) {
  margin: 0.9rem 0;
}

.potential-content :deep(a) {
  color: #059669;
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.potential-content :deep(ul),
.potential-content :deep(ol) {
  margin: 1rem 0;
  padding-left: 1.35rem;
}

.potential-content :deep(li) {
  margin: 0.35rem 0;
}

.potential-content :deep(blockquote) {
  margin: 1.25rem 0;
  border-left: 4px solid #171717;
  border-radius: 0.75rem;
  background: #fafafa;
  padding: 1rem 1.25rem;
  color: #525252;
}

.potential-content :deep(img) {
  margin: 1.25rem 0;
  max-width: 100%;
  height: auto;
  border-radius: 1.25rem;
  border: 1px solid #e5e5e5;
}

.potential-content :deep(iframe) {
  margin: 1.25rem 0;
  min-height: 420px;
  width: 100%;
  border: 0;
  border-radius: 1.25rem;
  background: #f5f5f5;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>