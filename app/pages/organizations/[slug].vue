<template>
  <main class="min-h-screen overflow-hidden bg-neutral-50 text-neutral-950">
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-blue-100 blur-3xl"></div>
      <div class="absolute -right-40 top-32 h-[520px] w-[520px] rounded-full bg-cyan-100 blur-3xl"></div>
      <div class="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-emerald-100/60 blur-3xl"></div>
      <div class="absolute inset-0 bg-grid opacity-40"></div>
    </div>

    <section v-if="pending" class="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div class="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
        <div class="grid animate-pulse gap-6 lg:grid-cols-[1fr_330px]">
          <div>
            <div class="h-5 w-40 rounded-full bg-neutral-100"></div>
            <div class="mt-5 h-14 w-3/4 rounded-2xl bg-neutral-100"></div>
            <div class="mt-5 h-4 w-full rounded-full bg-neutral-100"></div>
            <div class="mt-2 h-4 w-4/5 rounded-full bg-neutral-100"></div>
          </div>
          <div class="h-64 rounded-[2rem] bg-neutral-100"></div>
        </div>
      </div>
    </section>

    <section v-else-if="error || !organization" class="mx-auto max-w-3xl px-4 pb-16 pt-28 text-center sm:px-6 lg:px-8">
      <div class="rounded-[2rem] border border-red-200 bg-white p-8 shadow-sm">
        <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-red-50 text-red-600">
          <Icon icon="solar:danger-circle-bold-duotone" class="h-8 w-8" />
        </div>

        <h1 class="mt-5 text-2xl font-black text-neutral-950">
          Organisasi tidak ditemukan
        </h1>

        <p class="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-neutral-500">
          Data organisasi yang kamu buka belum tersedia, sudah tidak aktif, atau slug-nya tidak sesuai.
        </p>

        <NuxtLink
          to="/organizations"
          class="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-black text-white transition hover:bg-neutral-800"
        >
          <Icon icon="solar:arrow-left-linear" class="h-5 w-5" />
          Kembali ke Organisasi
        </NuxtLink>
      </div>
    </section>

    <template v-else>
      <section class="relative overflow-hidden bg-neutral-950 pt-24 text-white">
        <div class="absolute inset-0">
          <img
            v-if="heroImage && !heroImageFailed"
            :src="heroImage"
            :alt="organization.title || organization.name || 'Organisasi'"
            class="h-full w-full object-cover opacity-60"
            @error="heroImageFailed = true"
          >

          <div
            v-else
            class="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-950 via-slate-950 to-cyan-950"
          >
            <Icon
              :icon="organization.icon || 'solar:users-group-rounded-bold-duotone'"
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
            <NuxtLink to="/organizations" class="transition hover:text-white">
              Organisasi
            </NuxtLink>
            <Icon icon="solar:alt-arrow-right-linear" class="h-4 w-4" />
            <span class="text-white">{{ organization.title || organization.name }}</span>
          </nav>

          <div class="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div class="mb-5 flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white backdrop-blur">
                  <Icon :icon="organization.icon || 'solar:users-group-rounded-bold-duotone'" class="h-4 w-4" />
                  Organisasi
                </span>

                <span
                  class="rounded-full px-3 py-1.5 text-xs font-black backdrop-blur"
                  :class="organization.status === 'active'
                    ? 'bg-emerald-400/15 text-emerald-200'
                    : 'bg-white/10 text-white/70'"
                >
                  {{ organization.status }}
                </span>

                <span
                  v-if="organization.isFeatured"
                  class="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-black text-white shadow-lg shadow-blue-900/20"
                >
                  Featured
                </span>
              </div>

              <h1 class="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {{ organization.title || organization.name }}
              </h1>

              <p v-if="organization.subtitle || organization.shortDescription" class="mt-5 max-w-3xl text-base font-medium leading-8 text-white/75 sm:text-lg">
                {{ organization.subtitle || organization.shortDescription }}
              </p>

              <div class="mt-7 flex flex-wrap gap-3">
                <a
                  v-if="whatsappUrl"
                  :href="whatsappUrl"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-neutral-950 transition hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  <Icon icon="solar:chat-round-call-bold-duotone" class="h-5 w-5 text-blue-600" />
                  Hubungi WhatsApp
                </a>

                <a
                  v-if="organization.websiteUrl"
                  :href="organization.websiteUrl"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  <Icon icon="solar:global-bold-duotone" class="h-5 w-5" />
                  Website
                </a>

                <NuxtLink
                  to="/organizations"
                  class="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  <Icon icon="solar:arrow-left-linear" class="h-5 w-5" />
                  Semua Organisasi
                </NuxtLink>
              </div>
            </div>

            <aside class="rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-2xl shadow-neutral-950/20 backdrop-blur-xl">
              <div class="flex items-start gap-4">
                <div class="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-3xl bg-white/10 text-white">
                  <img
                    v-if="organization.logoUrl && !logoFailed"
                    :src="organization.logoUrl"
                    :alt="organization.title || organization.name || 'Organisasi'"
                    class="h-full w-full object-cover"
                    @error="logoFailed = true"
                  >
                  <Icon
                    v-else
                    :icon="organization.icon || 'solar:users-group-rounded-bold-duotone'"
                    class="h-8 w-8"
                  />
                </div>

                <div class="min-w-0">
                  <p class="text-xs font-black uppercase tracking-[0.14em] text-white/50">
                    Profil Organisasi
                  </p>
                  <p class="mt-1 truncate text-lg font-black text-white">
                    {{ organization.title || organization.name }}
                  </p>
                  <p class="mt-1 truncate text-xs font-bold text-white/50">
                    {{ organization.slug }}
                  </p>
                </div>
              </div>

              <div class="mt-5 grid gap-2">
                <InfoRow label="Status" :value="organization.status" />
                <InfoRow label="Update" :value="formatDate(organization.updatedAt)" />
                <InfoRow label="Urutan" :value="String(organization.sortOrder || 0)" />
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section class="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <article class="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm">
          <div class="border-b border-neutral-200 px-5 py-4 sm:px-6">
            <div class="flex items-center gap-3">
              <div class="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                <Icon icon="solar:document-text-bold-duotone" class="h-5 w-5" />
              </div>

              <div>
                <p class="text-sm font-black text-neutral-950">
                  Detail Organisasi
                </p>
                <p class="text-xs font-semibold text-neutral-500">
                  Informasi lengkap organisasi
                </p>
              </div>
            </div>
          </div>

          <div class="px-5 py-6 sm:px-6">
            <div
              v-if="safeContentHtml"
              class="organization-content"
              v-html="safeContentHtml"
            ></div>

            <div v-else class="rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
              <Icon icon="solar:document-bold-duotone" class="mx-auto h-10 w-10 text-neutral-400" />
              <p class="mt-3 text-sm font-bold text-neutral-500">
                Belum ada konten detail untuk organisasi ini.
              </p>
            </div>
          </div>
        </article>

        <aside class="space-y-4">
          <div class="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm">
            <p class="text-sm font-black text-neutral-950">
              Informasi Kontak
            </p>

            <div class="mt-4 space-y-4">
              <ContactItem
                v-if="organization.phone"
                icon="solar:phone-bold-duotone"
                label="Telepon"
                :value="organization.phone"
                :href="`tel:${organization.phone}`"
              />

              <ContactItem
                v-if="organization.whatsapp"
                icon="solar:chat-round-call-bold-duotone"
                label="WhatsApp"
                :value="organization.whatsapp"
                :href="whatsappUrl"
              />

              <ContactItem
                v-if="organization.email"
                icon="solar:letter-bold-duotone"
                label="Email"
                :value="organization.email"
                :href="`mailto:${organization.email}`"
              />

              <ContactItem
                v-if="organization.websiteUrl"
                icon="solar:global-bold-duotone"
                label="Website"
                :value="organization.websiteUrl"
                :href="organization.websiteUrl"
              />

              <div v-if="organization.address" class="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <p class="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">
                  Alamat
                </p>
                <p class="mt-1 text-sm font-bold leading-6 text-neutral-700">
                  {{ organization.address }}
                </p>
              </div>

              <div
                v-if="!organization.phone && !organization.whatsapp && !organization.email && !organization.websiteUrl && !organization.address"
                class="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-5 text-center"
              >
                <Icon icon="solar:phone-bold-duotone" class="mx-auto h-8 w-8 text-neutral-400" />
                <p class="mt-2 text-sm font-bold text-neutral-500">
                  Kontak belum tersedia.
                </p>
              </div>
            </div>
          </div>

          <div v-if="galleryImages.length" class="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm">
            <p class="text-sm font-black text-neutral-950">
              Galeri
            </p>

            <div class="mt-4 grid grid-cols-2 gap-2">
              <img
                v-for="image in galleryImages.slice(0, 6)"
                :key="image"
                :src="image"
                :alt="organization.title || organization.name || 'Galeri organisasi'"
                class="h-28 w-full rounded-2xl object-cover"
              >
            </div>
          </div>

          <NuxtLink
            to="/organizations"
            class="flex items-center justify-between gap-3 rounded-[1.5rem] border border-neutral-200 bg-white p-4 text-sm font-black text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-neutral-50"
          >
            <span class="inline-flex items-center gap-2">
              <Icon icon="solar:arrow-left-linear" class="h-5 w-5" />
              Kembali ke Organisasi
            </span>
          </NuxtLink>
        </aside>
      </section>

      <section v-if="relatedOrganizations.length" class="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div class="mb-5 flex items-end justify-between gap-4">
          <div>
            <p class="text-xs font-black uppercase tracking-[0.14em] text-blue-600">
              Organisasi Terkait
            </p>
            <h2 class="mt-2 text-2xl font-black tracking-tight text-neutral-950">
              Organisasi lainnya
            </h2>
          </div>

          <NuxtLink
            to="/organizations"
            class="hidden rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-xs font-black text-neutral-600 shadow-sm transition hover:bg-neutral-50 sm:inline-flex"
          >
            Lihat Semua
          </NuxtLink>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="item in relatedOrganizations"
            :key="item.id"
            :to="`/organizations/${item.slug}`"
            class="group overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
          >
            <div class="relative h-40 bg-neutral-100">
              <img
                v-if="getOrganizationCover(item)"
                :src="getOrganizationCover(item)"
                :alt="item.title || item.name || 'Organisasi'"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              >

              <div v-else class="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-blue-600">
                <Icon :icon="item.icon || 'solar:users-group-rounded-bold-duotone'" class="h-12 w-12" />
              </div>
            </div>

            <div class="p-5">
              <h3 class="line-clamp-2 text-lg font-black leading-7 text-neutral-950 group-hover:text-blue-700">
                {{ item.title || item.name }}
              </h3>

              <p class="mt-2 line-clamp-2 text-sm font-medium leading-6 text-neutral-500">
                {{ item.subtitle || item.shortDescription || 'Informasi organisasi desa.' }}
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
import { computed, defineComponent, h } from 'vue'

type OrganizationStatus = 'active' | 'inactive'

type OrganizationItem = {
  id: string
  tenantId?: string
  title?: string | null
  name?: string | null
  subtitle?: string | null
  slug: string
  icon?: string | null
  logoUrl?: string | null
  imageUrl?: string | null
  shortDescription?: string | null
  contentHtml?: string | null
  contentJson?: any | null
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
  websiteUrl?: string | null
  address?: string | null
  status: OrganizationStatus
  isFeatured: boolean
  sortOrder: number
  metadata?: Record<string, any>
  createdAt?: number
  updatedAt?: number
}

type OrganizationDetailResponse = {
  data: OrganizationItem | null
}

type OrganizationListResponse = {
  data: OrganizationItem[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const route = useRoute()
const runtime = useRuntimeConfig()
const requestUrl = useRequestURL()
const { tenantApiUrl } = useAppApi()

const heroImageFailed = ref(false)
const logoFailed = ref(false)

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
  return tenantApiUrl(tenantSlug, `/organizations/by-slug/${encodeURIComponent(slug.value)}`)
})

const {
  data,
  pending,
  error
} = await useAsyncData<OrganizationDetailResponse>(
  () => `organization-detail-${tenantSlug.value}-${slug.value}`,
  async () => {
    try {
      return await $fetch<OrganizationDetailResponse>(apiUrl.value)
    } catch {
      const list = await $fetch<OrganizationListResponse>(tenantApiUrl(tenantSlug, `/organizations`), {
        query: {
          status: 'active',
          limit: 100,
          sort: 'sort_order'
        }
      })

      const found = (list.data || []).find((item) => item.slug === slug.value) || null

      return {
        data: found
      }
    }
  },
  {
    watch: [tenantSlug, slug],
    default: () => ({
      data: null
    })
  }
)

const organization = computed<OrganizationItem | null>(() => {
  return data.value?.data || null
})

const listApiUrl = computed(() => tenantApiUrl(tenantSlug.value, '/organizations'))

const {
  data: relatedResponse
} = await useFetch<OrganizationListResponse>(listApiUrl, {
  key: computed(() => `organization-related-${tenantSlug.value}`),
  query: computed(() => ({
    status: 'active',
    limit: 6,
    sort: 'sort_order'
  })),
  watch: [tenantSlug],
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
  if (!organization.value) return ''
  return getOrganizationCover(organization.value)
})

const galleryImages = computed(() => {
  if (!organization.value) return []
  return getOrganizationImages(organization.value)
})

const safeContentHtml = computed(() => {
  return sanitizeHtml(organization.value?.contentHtml || '')
})

const relatedOrganizations = computed(() => {
  const currentId = organization.value?.id

  return (relatedResponse.value?.data || [])
    .filter((item) => item.id !== currentId)
    .slice(0, 3)
})

const whatsappUrl = computed(() => {
  const value = organization.value?.whatsapp || organization.value?.phone || ''
  const number = String(value).replace(/\D/g, '')

  if (!number) return ''

  return `https://wa.me/${number.startsWith('0') ? `62${number.slice(1)}` : number}`
})

const pageTitle = computed(() => {
  return organization.value
    ? `${organization.value.title || organization.value.name} · Organisasi`
    : 'Organisasi tidak ditemukan'
})

const pageDescription = computed(() => {
  return organization.value?.subtitle ||
    organization.value?.shortDescription ||
    plainText(organization.value?.contentHtml || '').slice(0, 160) ||
    'Informasi organisasi desa.'
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
      href: `${requestUrl.origin}/organizations/${slug.value}`
    }
  ]
}))

function getOrganizationImages(item: OrganizationItem) {
  const metadataImages = Array.isArray(item.metadata?.images)
    ? item.metadata.images
    : []

  const images = [
    item.imageUrl,
    ...metadataImages,
    item.logoUrl
  ]
    .map((value) => String(value || '').trim())
    .filter(Boolean)

  return Array.from(new Set(images))
}

function getOrganizationCover(item: OrganizationItem) {
  return getOrganizationImages(item)[0] || ''
}

function sanitizeHtml(value: string) {
  const html = String(value || '').trim()

  if (!html) return ''

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

const ContactItem = defineComponent({
  props: {
    icon: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    href: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    return () => {
      const children = [
        h(
          'div',
          {
            class:
              'grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700'
          },
          [h(Icon, { icon: props.icon, class: 'h-5 w-5' })]
        ),
        h('div', { class: 'min-w-0 flex-1' }, [
          h(
            'p',
            {
              class:
                'text-xs font-black uppercase tracking-[0.14em] text-neutral-400'
            },
            props.label
          ),
          h(
            'p',
            {
              class:
                'mt-1 truncate text-sm font-bold text-neutral-800'
            },
            props.value
          )
        ])
      ]

      const className =
        'flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 transition hover:bg-white'

      if (props.href) {
        return h(
          'a',
          {
            href: props.href,
            target: props.href.startsWith('http') ? '_blank' : undefined,
            rel: props.href.startsWith('http') ? 'noopener' : undefined,
            class: className
          },
          children
        )
      }

      return h('div', { class: className }, children)
    }
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

.organization-content {
  color: #262626;
  font-size: 1rem;
  line-height: 1.8;
}

.organization-content :deep(h2) {
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  font-size: 1.75rem;
  line-height: 1.2;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #171717;
}

.organization-content :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 0.65rem;
  font-size: 1.35rem;
  line-height: 1.3;
  font-weight: 900;
  color: #171717;
}

.organization-content :deep(p) {
  margin: 0.9rem 0;
}

.organization-content :deep(a) {
  color: #2563eb;
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.organization-content :deep(ul),
.organization-content :deep(ol) {
  margin: 1rem 0;
  padding-left: 1.35rem;
}

.organization-content :deep(li) {
  margin: 0.35rem 0;
}

.organization-content :deep(blockquote) {
  margin: 1.25rem 0;
  border-left: 4px solid #2563eb;
  border-radius: 0.75rem;
  background: #fafafa;
  padding: 1rem 1.25rem;
  color: #525252;
}

.organization-content :deep(img) {
  margin: 1.25rem 0;
  max-width: 100%;
  height: auto;
  border-radius: 1.25rem;
  border: 1px solid #e5e5e5;
}

.organization-content :deep(iframe) {
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