<template>
  <main class="min-h-screen bg-neutral-50 text-neutral-950">
    <!-- Background -->
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -left-32 top-0 h-[460px] w-[460px] rounded-full bg-blue-100 blur-3xl"></div>
      <div class="absolute -right-32 top-40 h-[460px] w-[460px] rounded-full bg-cyan-100 blur-3xl"></div>
      <div class="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-emerald-100/70 blur-3xl"></div>
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
            Fasilitas
          </span>
        </nav>

        <div class="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-end">
          <div>
            <div class="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
              <Icon icon="solar:map-point-wave-bold-duotone" class="h-4 w-4" />
              Fasilitas Desa
            </div>

            <h1 class="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              Fasilitas Publik
              <span class="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
                {{ appName }}
              </span>
            </h1>

            <p class="mt-5 max-w-3xl text-base font-medium leading-8 text-neutral-600 sm:text-lg">
              Jelajahi fasilitas kesehatan, pendidikan, pasar, layanan darurat, sarana olahraga, air bersih, dan fasilitas publik lain yang mendukung aktivitas warga.
            </p>

            <div class="mt-7 flex flex-wrap gap-2">
              <button
                v-for="type in featuredTypeOptions"
                :key="type.value"
                type="button"
                class="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-black transition"
                :class="selectedType === type.value
                  ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'border-neutral-200 bg-white/80 text-neutral-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'"
                @click="selectedType = selectedType === type.value ? 'all' : type.value"
              >
                <Icon :icon="type.icon" class="h-4 w-4" />
                {{ type.label }}
              </button>
            </div>
          </div>

          <aside class="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm">
            <div class="flex items-start gap-4">
              <div class="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-3xl bg-blue-50 text-blue-700">
                <img
                  v-if="appLogo"
                  :src="appLogo"
                  :alt="appName"
                  class="h-11 w-11 object-contain"
                  @error="hideImage"
                >
                <Icon v-else icon="solar:map-point-wave-bold-duotone" class="h-8 w-8" />
              </div>

              <div class="min-w-0">
                <p class="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">
                  Total Fasilitas
                </p>
                <p class="mt-1 text-3xl font-black text-neutral-950">
                  {{ facilities.length }}
                </p>
                <p class="mt-1 text-xs font-bold text-neutral-500">
                  Data aktif tenant {{ tenantSlug }}
                </p>
              </div>
            </div>

            <div class="mt-5 grid grid-cols-3 gap-2">
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
                  Kategori
                </p>
                <p class="mt-1 text-lg font-black text-neutral-950">
                  {{ categoryCount }}
                </p>
              </div>

              <div class="rounded-2xl bg-neutral-50 p-3">
                <p class="text-[10px] font-black uppercase tracking-[0.12em] text-neutral-400">
                  Gambar
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

    <!-- Content -->
    <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Toolbar -->
      <div class="mb-5 rounded-[2rem] border border-neutral-200 bg-white p-4 shadow-sm">
        <div class="grid gap-3 lg:grid-cols-[1fr_210px_180px_180px]">
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
              <Icon icon="solar:magnifer-linear" class="h-5 w-5" />
            </div>

            <input
              v-model.trim="q"
              type="text"
              placeholder="Cari fasilitas, alamat, layanan, atau deskripsi..."
              class="block w-full rounded-2xl border border-neutral-200 bg-neutral-50 py-3 pl-12 pr-4 text-sm font-semibold text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
          </div>

          <select
            v-model="selectedType"
            class="block w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-bold text-neutral-700 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
          >
            <option value="all">Semua Tipe</option>
            <option
              v-for="type in facilityTypeOptions"
              :key="type.value"
              :value="type.value"
            >
              {{ type.label }}
            </option>
          </select>

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

        <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p class="text-xs font-bold text-neutral-500">
            Menampilkan {{ filteredFacilities.length }} dari {{ facilities.length }} fasilitas.
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
          class="h-[26rem] animate-pulse overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm"
        >
          <div class="h-44 bg-neutral-100"></div>
          <div class="p-5">
            <div class="h-5 w-2/3 rounded-full bg-neutral-100"></div>
            <div class="mt-3 h-3 w-full rounded-full bg-neutral-100"></div>
            <div class="mt-2 h-3 w-4/5 rounded-full bg-neutral-100"></div>
            <div class="mt-8 h-10 w-full rounded-2xl bg-neutral-100"></div>
          </div>
        </div>
      </section>

      <!-- Empty -->
      <section
        v-else-if="filteredFacilities.length === 0"
        class="rounded-[2rem] border border-dashed border-neutral-300 bg-white p-10 text-center shadow-sm"
      >
        <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-neutral-100 text-neutral-500">
          <Icon icon="solar:map-point-wave-bold-duotone" class="h-8 w-8" />
        </div>

        <h2 class="mt-5 text-xl font-black text-neutral-950">
          Belum ada data fasilitas
        </h2>

        <p class="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-neutral-500">
          Data fasilitas akan tampil otomatis setelah ditambahkan dari dashboard fasilitas.
        </p>
      </section>

      <!-- Grid -->
      <section
        v-else
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <NuxtLink
          v-for="item in pagedFacilities"
          :key="item.id"
          :to="`/facilities/${item.slug}`"
          class="group overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
        >
          <div class="relative h-48 overflow-hidden bg-neutral-100">
            <img
              v-if="getFacilityImage(item) && !failedImages[item.id]"
              :src="getFacilityImage(item)"
              :alt="item.title"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              @error="markImageFailed(item.id)"
            >

            <div
              v-else
              class="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-blue-600"
            >
              <Icon :icon="item.icon || getFacilityTypeIcon(item.facilityType)" class="h-14 w-14" />
            </div>

            <div class="absolute inset-0 bg-gradient-to-t from-neutral-950/55 via-neutral-950/10 to-transparent"></div>

            <div class="absolute left-3 top-3 flex flex-wrap gap-2">
              <span class="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-neutral-800 backdrop-blur">
                <Icon :icon="getFacilityTypeIcon(item.facilityType)" class="h-3.5 w-3.5 text-blue-600" />
                {{ facilityTypeLabel(item.facilityType) }}
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
              {{ item.title }}
            </h2>

            <p class="mt-2 line-clamp-3 text-sm font-medium leading-6 text-neutral-500">
              {{ item.subtitle || contentPreview(item) || 'Informasi fasilitas desa.' }}
            </p>

            <div
              v-if="item.address"
              class="mt-4 flex items-start gap-2 rounded-2xl bg-neutral-50 p-3 text-xs font-bold leading-5 text-neutral-500"
            >
              <Icon icon="solar:map-point-bold-duotone" class="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
              <span class="line-clamp-2">{{ item.address }}</span>
            </div>

            <div class="mt-5 flex items-center justify-between gap-3 border-t border-neutral-100 pt-4">
              <span class="inline-flex min-w-0 items-center gap-2 truncate text-xs font-black text-neutral-500">
                <Icon
                  :icon="item.icon || getFacilityTypeIcon(item.facilityType)"
                  class="h-4 w-4 shrink-0 text-blue-600"
                />
                <span class="truncate">{{ item.slug }}</span>
              </span>

              <span class="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-neutral-50 text-neutral-500 transition group-hover:bg-blue-600 group-hover:text-white">
                <Icon icon="solar:arrow-right-up-linear" class="h-4 w-4" />
              </span>
            </div>
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
import type {
  FacilityItem,
  FacilityListResponse,
  FacilityStatus,
  FacilityType
} from '~/types/facility'
import { useAppApi } from '../../composables/useAppApi'

const requestUrl = useRequestURL()
const runtime = useRuntimeConfig()

const q = ref('')
const selectedStatus = ref<FacilityStatus | 'all'>('active')
const selectedType = ref<FacilityType | 'all'>('all')
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
  return String(runtime.public.appLogo || '')
})

const { tenantApiUrl } = useAppApi()
const apiUrl = computed(() => {
  return tenantApiUrl(tenantSlug.value, `/facilities`)
})

const {
  data,
  pending,
  error
} = await useFetch<FacilityListResponse>(apiUrl, {
  key: computed(() => `facilities-index-${tenantSlug.value}-${selectedStatus.value}-${selectedType.value}-${sortBy.value}`),
  query: computed(() => ({
    status: selectedStatus.value === 'all' ? undefined : selectedStatus.value,
    type: selectedType.value === 'all' ? undefined : selectedType.value,
    limit: 100,
    sort: sortBy.value
  })),
  watch: [tenantSlug, selectedStatus, selectedType, sortBy],
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

const facilities = computed<FacilityItem[]>(() => {
  return data.value?.data || []
})

const visibleError = computed(() => {
  if (!error.value) return ''
  return error.value?.message || 'Terjadi kesalahan saat memuat data fasilitas.'
})

const facilityTypeOptions: {
  value: FacilityType
  label: string
  icon: string
}[] = [
  { value: 'health', label: 'Kesehatan', icon: 'lucide:hospital' },
  { value: 'market', label: 'Pasar', icon: 'lucide:store' },
  { value: 'education', label: 'Pendidikan', icon: 'lucide:school' },
  { value: 'sport', label: 'Olahraga', icon: 'lucide:trophy' },
  { value: 'emergency', label: 'Darurat', icon: 'lucide:ambulance' },
  { value: 'transport', label: 'Transportasi', icon: 'lucide:car' },
  { value: 'water', label: 'Air Bersih', icon: 'lucide:droplets' },
  { value: 'public_service', label: 'Pelayanan', icon: 'lucide:clipboard-list' },
  { value: 'office', label: 'Kantor', icon: 'lucide:building-2' },
  { value: 'worship', label: 'Ibadah', icon: 'lucide:landmark' },
  { value: 'tourism', label: 'Wisata', icon: 'lucide:map-pin' },
  { value: 'security', label: 'Keamanan', icon: 'lucide:shield-check' },
  { value: 'custom', label: 'Custom', icon: 'lucide:layers' }
]

const featuredTypeOptions = computed(() => {
  return facilityTypeOptions.slice(0, 7)
})

const filteredFacilities = computed(() => {
  const keyword = q.value.trim().toLowerCase()

  return facilities.value
    .filter((item) => {
      if (!keyword) return true

      return [
        item.title,
        item.subtitle,
        item.slug,
        item.facilityType,
        item.address,
        item.phone,
        item.whatsapp,
        item.email,
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

const pagedFacilities = computed(() => {
  return filteredFacilities.value.slice(0, page.value * pageSize)
})

const hasMore = computed(() => {
  return pagedFacilities.value.length < filteredFacilities.value.length
})

const featuredCount = computed(() => {
  return facilities.value.filter((item) => item.isFeatured).length
})

const categoryCount = computed(() => {
  return new Set(facilities.value.map((item) => item.facilityType)).size
})

const withImageCount = computed(() => {
  return facilities.value.filter((item) => item.imageUrl || item.logoUrl).length
})

watch([q, selectedStatus, selectedType, sortBy], () => {
  page.value = 1
})

const pageTitle = computed(() => {
  return `Fasilitas · ${appName.value}`
})

const pageDescription = computed(() => {
  return `Daftar fasilitas publik dan layanan warga di ${appName.value}.`
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
      href: `${requestUrl.origin}/facilities`
    }
  ]
}))

function resetFilters() {
  q.value = ''
  selectedStatus.value = 'active'
  selectedType.value = 'all'
  sortBy.value = 'sort_order'
  page.value = 1
}

function getFacilityImage(item: FacilityItem) {
  return item.imageUrl || item.logoUrl || ''
}

function getFacilityTypeIcon(type: FacilityType) {
  const match = facilityTypeOptions.find((item) => item.value === type)
  return match?.icon || 'lucide:layers'
}

function facilityTypeLabel(type: FacilityType) {
  const match = facilityTypeOptions.find((item) => item.value === type)
  return match?.label || 'Fasilitas'
}

function contentPreview(item: FacilityItem) {
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