<template>
  <main class="min-h-screen bg-neutral-50 text-neutral-950">
    <!-- Background -->
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-blue-100 blur-3xl"></div>
      <div class="absolute -right-32 top-40 h-[420px] w-[420px] rounded-full bg-emerald-100 blur-3xl"></div>
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-size-[44px_44px] opacity-40"></div>
    </div>

    <!-- Hero -->
    <section class="relative overflow-hidden border-b border-neutral-200 bg-white/80 pt-28 backdrop-blur-xl">
      <div class="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <nav class="mb-6 flex flex-wrap items-center gap-2 text-sm font-bold text-neutral-500">
          <NuxtLink to="/" class="transition hover:text-neutral-950">
            Beranda
          </NuxtLink>
          <Icon icon="solar:alt-arrow-right-linear" class="h-4 w-4" />
          <span class="text-neutral-950">
            Kelembagaan
          </span>
        </nav>

        <div class="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <div class="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
              <Icon icon="solar:buildings-2-bold-duotone" class="h-4 w-4" />
              Kelembagaan Desa
            </div>

            <h1 class="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              Daftar Lembaga
              <span class="text-blue-600">{{ appName }}</span>
            </h1>

            <p class="mt-5 max-w-3xl text-base font-medium leading-8 text-neutral-600 sm:text-lg">
              Informasi kelembagaan desa, organisasi pendukung, unit pelayanan, dan lembaga masyarakat yang berperan dalam pelayanan, pemberdayaan, keamanan, kesehatan, pendidikan, dan pembangunan desa.
            </p>
          </div>

          <aside class="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm">
            <div class="flex items-start gap-4">
              <div class="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-3xl bg-blue-50 text-blue-700">
                <img
                  :src="appLogo"
                  :alt="appName"
                  class="h-11 w-11 object-contain"
                  @error="hideImage"
                >
              </div>

              <div class="min-w-0">
                <p class="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">
                  Total Lembaga
                </p>
                <p class="mt-1 text-3xl font-black text-neutral-950">
                  {{ institutions.length }}
                </p>
                <p class="mt-1 text-xs font-bold text-neutral-500">
                  Data aktif dari tenant {{ tenantSlug }}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Toolbar -->
      <div class="mb-5 rounded-[2rem] border border-neutral-200 bg-white p-4 shadow-sm">
        <div class="grid gap-3 lg:grid-cols-[1fr_190px_190px]">
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
              <Icon icon="solar:magnifer-linear" class="h-5 w-5" />
            </div>

            <input
              v-model.trim="q"
              type="text"
              placeholder="Cari lembaga, subtitle, atau deskripsi..."
              class="block w-full rounded-2xl border border-neutral-200 bg-neutral-50 py-3 pl-12 pr-4 text-sm font-semibold text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
          </div>

          <select
            v-model="selectedStatus"
            class="block w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-bold text-neutral-700 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
          >
            <option value="active">Active</option>
            <option value="all">Semua Status</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            v-model="sortBy"
            class="block w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-bold text-neutral-700 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
          >
            <option value="sort_order">Urutan</option>
            <option value="title">Title A-Z</option>
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </select>
        </div>
      </div>

      <!-- Error -->
      <div
        v-if="visibleError"
        class="mb-5 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-700"
      >
        {{ visibleError }}
      </div>

      <!-- Loading -->
      <section
        v-if="pending"
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <div
          v-for="item in 12"
          :key="item"
          class="h-72 animate-pulse rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm"
        >
          <div class="h-14 w-14 rounded-3xl bg-neutral-100"></div>
          <div class="mt-5 h-5 w-2/3 rounded-full bg-neutral-100"></div>
          <div class="mt-3 h-3 w-full rounded-full bg-neutral-100"></div>
          <div class="mt-2 h-3 w-4/5 rounded-full bg-neutral-100"></div>
          <div class="mt-8 h-10 w-full rounded-2xl bg-neutral-100"></div>
        </div>
      </section>

      <!-- Empty -->
      <section
        v-else-if="filteredInstitutions.length === 0"
        class="rounded-[2rem] border border-dashed border-neutral-300 bg-white p-10 text-center shadow-sm"
      >
        <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-neutral-100 text-neutral-500">
          <Icon icon="solar:buildings-2-bold-duotone" class="h-8 w-8" />
        </div>

        <h2 class="mt-5 text-xl font-black text-neutral-950">
          Belum ada data lembaga
        </h2>

        <p class="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-neutral-500">
          Data kelembagaan akan tampil otomatis setelah ditambahkan dari dashboard institution.
        </p>
      </section>

      <!-- Grid -->
      <section
        v-else
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <NuxtLink
          v-for="item in pagedInstitutions"
          :key="item.id"
          :to="`/institutions/${item.slug}`"
          class="group overflow-hidden rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-3xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
              <img
                v-if="item.logoUrl && !failedImages[item.id]"
                :src="item.logoUrl"
                :alt="item.title"
                class="h-full w-full object-cover"
                @error="markImageFailed(item.id)"
              >
              <Icon
                v-else
                :icon="item.icon || defaultInstitutionIcon"
                class="h-7 w-7"
              />
            </div>

            <span
              v-if="item.isFeatured"
              class="rounded-full bg-neutral-950 px-2.5 py-1 text-[10px] font-black text-white"
            >
              Featured
            </span>
          </div>

          <div class="mt-5">
            <h2 class="line-clamp-2 text-lg font-black leading-7 text-neutral-950 group-hover:text-blue-700">
              {{ item.title }}
            </h2>

            <p class="mt-2 line-clamp-3 text-sm font-medium leading-6 text-neutral-500">
              {{ item.subtitle || contentPreview(item) || 'Informasi lembaga desa.' }}
            </p>
          </div>

          <div class="mt-5 flex items-center justify-between gap-3 border-t border-neutral-100 pt-4">
            <span class="inline-flex min-w-0 items-center gap-2 truncate text-xs font-black text-neutral-500">
              <Icon
                :icon="item.icon || defaultInstitutionIcon"
                class="h-4 w-4 shrink-0 text-blue-600"
              />
              <span class="truncate">{{ item.slug }}</span>
            </span>

            <span class="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-neutral-50 text-neutral-500 transition group-hover:bg-blue-600 group-hover:text-white">
              <Icon icon="solar:arrow-right-up-linear" class="h-4 w-4" />
            </span>
          </div>
        </NuxtLink>
      </section>

      <!-- Load More -->
      <div
        v-if="hasMore && !pending"
        class="mt-8 flex justify-center"
      >
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
import { computed } from 'vue'
import type { InstitutionItem, InstitutionListResponse, InstitutionStatus } from '~/types/institution'
import { useAppApi } from '../../composables/useAppApi'

const requestUrl = useRequestURL()
const runtime = useRuntimeConfig()

const defaultInstitutionIcon = 'solar:buildings-2-bold-duotone'

const q = ref('')
const selectedStatus = ref<InstitutionStatus | 'all'>('active')
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
    'Desa Martopuro'
  )
})

const appLogo = computed(() => {
  return String(
    runtime.public.appLogo ||
    'https://martopuro.sencra.io/martopuro-logo.png'
  )
})

const { tenantApiUrl } = useAppApi()

const apiUrl = computed(() => {
  return tenantApiUrl(tenantSlug.value, '/institutions')
})

const {
  data,
  pending,
  error
} = await useFetch<InstitutionListResponse>(apiUrl, {
  key: computed(() => `institutions-index-${tenantSlug.value}-${selectedStatus.value}-${sortBy.value}`),
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

const institutions = computed<InstitutionItem[]>(() => {
  return data.value?.data || []
})

const visibleError = computed(() => {
  if (!error.value) return ''

  return error.value?.message || 'Terjadi kesalahan saat memuat data kelembagaan.'
})

const filteredInstitutions = computed(() => {
  const keyword = q.value.trim().toLowerCase()

  return institutions.value
    .filter((item) => {
      if (!keyword) return true

      return [
        item.title,
        item.subtitle,
        item.slug,
        plainText(item.contentHtml || '')
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(keyword)
    })
    .sort((a, b) => {
      if (sortBy.value === 'title') {
        return String(a.title || '').localeCompare(String(b.title || ''))
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

      return String(a.title || '').localeCompare(String(b.title || ''))
    })
})

const pagedInstitutions = computed(() => {
  return filteredInstitutions.value.slice(0, page.value * pageSize)
})

const hasMore = computed(() => {
  return pagedInstitutions.value.length < filteredInstitutions.value.length
})

watch([q, selectedStatus, sortBy], () => {
  page.value = 1
})

const pageTitle = computed(() => {
  return `Kelembagaan · ${appName.value}`
})

const pageDescription = computed(() => {
  return `Daftar lembaga dan organisasi pendukung di ${appName.value}.`
})

useSeoMeta({
  title: () => pageTitle.value,
  description: () => pageDescription.value,
  ogTitle: () => pageTitle.value,
  ogDescription: () => pageDescription.value,
  robots: 'index, follow'
})

useHead(() => ({
  htmlAttrs: {
    lang: 'id'
  },
  link: [
    {
      rel: 'canonical',
      href: `${requestUrl.origin}/institutions`
    }
  ]
}))

function contentPreview(item: InstitutionItem) {
  return plainText(item.contentHtml || '').slice(0, 140)
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

function markImageFailed(id: string) {
  failedImages.value = {
    ...failedImages.value,
    [id]: true
  }
}

function hideImage(event: Event) {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}
</script>

<style scoped>
.bg-size-\[44px_44px\] {
  background-size: 44px 44px;
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