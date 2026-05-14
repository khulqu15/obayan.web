<template>
  <main class="min-h-screen overflow-hidden bg-neutral-50 text-neutral-950">
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-blue-100 blur-3xl"></div>
      <div class="absolute -right-40 top-32 h-[520px] w-[520px] rounded-full bg-cyan-100 blur-3xl"></div>
      <div class="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-emerald-100/60 blur-3xl"></div>
      <div class="absolute inset-0 bg-grid opacity-40"></div>
    </div>

    <section class="relative border-b border-neutral-200 bg-white/80 pt-28 backdrop-blur-xl">
      <div class="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <nav class="mb-7 flex flex-wrap items-center gap-2 text-sm font-bold text-neutral-500">
          <NuxtLink to="/" class="transition hover:text-neutral-950">
            Beranda
          </NuxtLink>
          <Icon icon="solar:alt-arrow-right-linear" class="h-4 w-4" />
          <span class="text-neutral-950">Organisasi</span>
        </nav>

        <div class="grid gap-8 lg:grid-cols-[1fr_390px] lg:items-end">
          <div>
            <div class="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
              <Icon icon="solar:users-group-rounded-bold-duotone" class="h-4 w-4" />
              Organisasi Desa
            </div>

            <h1 class="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              Organisasi &
              <span class="block bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                Kelembagaan Aktif
              </span>
            </h1>

            <p class="mt-5 max-w-3xl text-base font-semibold leading-8 text-neutral-600 sm:text-lg">
              Jelajahi organisasi, kelompok masyarakat, unit kerja, komunitas, dan kelembagaan yang aktif mendukung pelayanan serta pembangunan {{ appName }}.
            </p>

            <div class="mt-8 flex flex-wrap gap-3">
              <NuxtLink
                to="/profile"
                class="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-black text-white shadow-lg shadow-neutral-900/10 transition hover:-translate-y-0.5 hover:bg-neutral-800"
              >
                Profil Desa
                <Icon icon="solar:arrow-right-up-linear" class="h-5 w-5" />
              </NuxtLink>

              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-black text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-neutral-50"
                @click="refresh()"
              >
                <Icon icon="solar:refresh-bold-duotone" class="h-5 w-5" :class="pending ? 'animate-spin' : ''" />
                Refresh
              </button>
            </div>
          </div>

          <aside class="rounded-[2.25rem] border border-neutral-200 bg-white p-5 shadow-xl shadow-neutral-900/5">
            <div class="flex items-start gap-4">
              <div class="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-blue-50 text-blue-700">
                <Icon icon="solar:buildings-3-bold-duotone" class="h-8 w-8" />
              </div>

              <div class="min-w-0">
                <p class="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">
                  Total Organisasi
                </p>
                <h2 class="mt-1 text-3xl font-black text-neutral-950">
                  {{ organizations.length }}
                </h2>
                <p class="mt-1 text-sm font-bold text-neutral-500">
                  Tenant {{ tenantSlug }}
                </p>
              </div>
            </div>

            <div class="mt-5 grid grid-cols-3 gap-2">
              <div class="rounded-2xl bg-neutral-50 p-3">
                <p class="text-[10px] font-black uppercase tracking-[0.12em] text-neutral-400">
                  Active
                </p>
                <p class="mt-1 text-lg font-black text-neutral-950">
                  {{ activeCount }}
                </p>
              </div>

              <div class="rounded-2xl bg-neutral-50 p-3">
                <p class="text-[10px] font-black uppercase tracking-[0.12em] text-neutral-400">
                  Featured
                </p>
                <p class="mt-1 text-lg font-black text-neutral-950">
                  {{ featuredCount }}
                </p>
              </div>

              <div class="rounded-2xl bg-neutral-50 p-3">
                <p class="text-[10px] font-black uppercase tracking-[0.12em] text-neutral-400">
                  Foto
                </p>
                <p class="mt-1 text-lg font-black text-neutral-950">
                  {{ withImageCount }}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="mb-5 rounded-[2rem] border border-neutral-200 bg-white p-4 shadow-sm">
        <div class="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
              <Icon icon="solar:magnifer-linear" class="h-5 w-5" />
            </div>

            <input
              v-model.trim="q"
              type="text"
              placeholder="Cari organisasi, deskripsi, pengurus, atau kata kunci..."
              class="input-field py-3 pl-12"
            >
          </div>

          <select v-model="selectedStatus" class="input-field">
            <option value="active">Active</option>
            <option value="all">Semua Status</option>
            <option value="inactive">Inactive</option>
          </select>

          <select v-model="sortBy" class="input-field">
            <option value="sort_order">Urutan</option>
            <option value="title">Title A-Z</option>
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </select>
        </div>

        <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p class="text-xs font-bold text-neutral-500">
            Menampilkan {{ filteredOrganizations.length }} dari {{ organizations.length }} organisasi.
          </p>

          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-xs font-black text-neutral-600 transition hover:bg-neutral-50"
            @click="resetFilters"
          >
            <Icon icon="solar:restart-bold-duotone" class="h-4 w-4" />
            Reset Filter
          </button>
        </div>
      </div>

      <div v-if="visibleError" class="mb-5 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-700">
        {{ visibleError }}
      </div>

      <section v-if="pending" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="item in 8"
          :key="item"
          class="h-[25rem] animate-pulse overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm"
        >
          <div class="h-44 bg-neutral-100"></div>
          <div class="p-5">
            <div class="h-5 w-2/3 rounded-full bg-neutral-100"></div>
            <div class="mt-3 h-3 w-full rounded-full bg-neutral-100"></div>
            <div class="mt-2 h-3 w-4/5 rounded-full bg-neutral-100"></div>
          </div>
        </div>
      </section>

      <section
        v-else-if="filteredOrganizations.length === 0"
        class="rounded-[2rem] border border-dashed border-neutral-300 bg-white p-10 text-center shadow-sm"
      >
        <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-neutral-100 text-neutral-500">
          <Icon icon="solar:users-group-rounded-bold-duotone" class="h-8 w-8" />
        </div>

        <h2 class="mt-5 text-xl font-black text-neutral-950">
          Belum ada data organisasi
        </h2>

        <p class="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-neutral-500">
          Data organisasi akan tampil otomatis setelah ditambahkan dari dashboard organisasi.
        </p>
      </section>

      <section v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <NuxtLink
          v-for="item in pagedOrganizations"
          :key="item.id"
          :to="`/organizations/${item.slug}`"
          class="group overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
        >
          <div class="relative h-48 overflow-hidden bg-neutral-100">
            <img
              v-if="getOrganizationCover(item) && !failedImages[item.id]"
              :src="getOrganizationCover(item)"
              :alt="item.title || item.name || 'Organisasi'"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              @error="markImageFailed(item.id)"
            >

            <div
              v-else
              class="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-blue-600"
            >
              <Icon :icon="item.icon || 'solar:users-group-rounded-bold-duotone'" class="h-14 w-14" />
            </div>

            <div class="absolute inset-0 bg-gradient-to-t from-neutral-950/55 via-neutral-950/10 to-transparent"></div>

            <div class="absolute left-3 top-3 flex flex-wrap gap-2">
              <span class="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-neutral-800 backdrop-blur">
                <Icon :icon="item.icon || 'solar:users-group-rounded-bold-duotone'" class="h-3.5 w-3.5 text-blue-600" />
                Organisasi
              </span>

              <span
                v-if="item.isFeatured"
                class="rounded-full bg-blue-600 px-3 py-1 text-xs font-black text-white shadow-lg shadow-blue-900/20"
              >
                Featured
              </span>
            </div>
          </div>

          <div class="p-5">
            <h2 class="line-clamp-2 text-lg font-black leading-7 text-neutral-950 group-hover:text-blue-700">
              {{ item.title || item.name }}
            </h2>

            <p class="mt-2 line-clamp-3 text-sm font-medium leading-6 text-neutral-500">
              {{ item.subtitle || item.shortDescription || plainText(item.contentHtml || '').slice(0, 140) || 'Informasi organisasi desa.' }}
            </p>

            <div class="mt-5 flex items-center justify-between gap-3 border-t border-neutral-100 pt-4">
              <span class="inline-flex min-w-0 items-center gap-2 truncate text-xs font-black text-neutral-500">
                <Icon icon="solar:link-circle-bold-duotone" class="h-4 w-4 shrink-0 text-blue-600" />
                <span class="truncate">{{ item.slug }}</span>
              </span>

              <span class="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-neutral-50 text-neutral-500 transition group-hover:bg-blue-600 group-hover:text-white">
                <Icon icon="solar:arrow-right-up-linear" class="h-4 w-4" />
              </span>
            </div>
          </div>
        </NuxtLink>
      </section>

      <div v-if="hasMore && !pending" class="mt-8 flex justify-center">
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-black text-neutral-700 shadow-sm transition hover:bg-neutral-50"
          @click="page += 1"
        >
          <Icon icon="solar:alt-arrow-down-bold-duotone" class="h-5 w-5" />
          Muat Lainnya
        </button>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { ComputedRef } from 'vue'

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

type OrganizationListResponse = {
  data: OrganizationItem[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const runtime = useRuntimeConfig()
const requestUrl = useRequestURL()

const q = ref('')
const selectedStatus = ref<OrganizationStatus | 'all'>('active')
const sortBy = ref<'newest' | 'oldest' | 'title' | 'sort_order'>('sort_order')
const page = ref(1)
const pageSize = 12
const failedImages = ref<Record<string, boolean>>({})

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

const appName = computed(() => {
  return String(
    runtime.public.appName ||
    runtime.public.clientDisplayName ||
    runtime.public.siteName ||
    'Desa Martopuro'
  )
})

const apiUrl = computed(() => `/api/tenants/${tenantSlug.value}/organizationss`)

const {
  data,
  pending,
  error,
  refresh
} = await useFetch<OrganizationListResponse>(apiUrl, {
  key: computed(() => `organization-index-${tenantSlug.value}-${selectedStatus.value}-${sortBy.value}`),
  query: computed(() => ({
    status: selectedStatus.value === 'all' ? undefined : selectedStatus.value,
    limit: 100,
    sort: sortBy.value
  })),
  watch: [tenantSlug, selectedStatus, sortBy],
  default: () => ({
    data: [],
    meta: {
      page: 1,
      limit: 100,
      total: 0,
      totalPages: 1
    }
  })
})

const organizations = computed<OrganizationItem[]>(() => data.value?.data || [])

const visibleError = computed(() => {
  if (!error.value) return ''
  return error.value?.message || 'Terjadi kesalahan saat memuat data organisasi.'
})

const filteredOrganizations = computed(() => {
  const keyword = q.value.trim().toLowerCase()

  return organizations.value
    .filter((item) => {
      if (!keyword) return true

      return [
        item.title,
        item.name,  
        item.subtitle,
        item.shortDescription,
        item.slug,
        item.address,
        item.email,
        item.phone,
        item.whatsapp,
        plainText(item.contentHtml || '')
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(keyword)
    })
    .sort((a, b) => {
      if (sortBy.value === 'title') {
        return String(a.title || a.name || '').localeCompare(String(b.title || b.name || ''))
      }

      if (sortBy.value === 'newest') {
        return Number(b.createdAt || 0) - Number(a.createdAt || 0)
      }

      if (sortBy.value === 'oldest') {
        return Number(a.createdAt || 0) - Number(b.createdAt || 0)
      }

      const sortA = Number(a.sortOrder || 0)
      const sortB = Number(b.sortOrder || 0)

      if (sortA !== sortB) return sortA - sortB

      return String(a.title || a.name || '').localeCompare(String(b.title || b.name || ''))
    })
})

const pagedOrganizations = computed(() => {
  return filteredOrganizations.value.slice(0, page.value * pageSize)
})

const hasMore = computed(() => {
  return pagedOrganizations.value.length < filteredOrganizations.value.length
})

const activeCount = computed(() => organizations.value.filter((item) => item.status === 'active').length)
const featuredCount = computed(() => organizations.value.filter((item) => item.isFeatured).length)
const withImageCount = computed(() => organizations.value.filter((item) => getOrganizationCover(item)).length)

watch([q, selectedStatus, sortBy], () => {
  page.value = 1
})

useSeoMeta({
  title: () => `Organisasi · ${appName.value}`,
  description: () => `Daftar organisasi, kelembagaan, komunitas, dan unit kerja aktif di ${appName.value}.`,
  ogTitle: () => `Organisasi · ${appName.value}`,
  ogDescription: () => `Daftar organisasi, kelembagaan, komunitas, dan unit kerja aktif di ${appName.value}.`,
  robots: 'index, follow'
})

useHead(() => ({
  htmlAttrs: {
    lang: 'id'
  },
  link: [
    {
      rel: 'canonical',
      href: `${requestUrl.origin}/organizations`
    }
  ]
}))

function resetFilters() {
  q.value = ''
  selectedStatus.value = 'active'
  sortBy.value = 'sort_order'
  page.value = 1
}

function getOrganizationCover(item: OrganizationItem) {
  const metadataImages = Array.isArray(item.metadata?.images)
    ? item.metadata.images
    : []

  return item.imageUrl || metadataImages[0] || item.logoUrl || ''
}

function markImageFailed(id: string) {
  failedImages.value = {
    ...failedImages.value,
    [id]: true
  }
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
</script>

<style scoped>
.bg-grid {
  background-size: 44px 44px;
  background-image:
    linear-gradient(to right, #e5e7eb 1px, transparent 1px),
    linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
}

.input-field {
  display: block;
  width: 100%;
  border-radius: 1rem;
  border: 1px solid rgb(229 229 229);
  background: rgb(250 250 250);
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: rgb(38 38 38);
  outline: none;
  transition: 160ms ease;
}

.input-field:focus {
  border-color: rgb(37 99 235);
  background: white;
  box-shadow: 0 0 0 4px rgb(219 234 254);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>