<template>
  <main class="min-h-screen bg-neutral-50 text-neutral-950">
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-blue-100 blur-3xl"></div>
      <div class="absolute -right-32 top-40 h-[420px] w-[420px] rounded-full bg-emerald-100 blur-3xl"></div>
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-size-[44px_44px] opacity-40"></div>
    </div>

    <!-- Loading -->
    <section
      v-if="pending"
      class="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 lg:px-8"
    >
      <div class="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
        <div class="flex animate-pulse items-start gap-5">
          <div class="h-20 w-20 rounded-3xl bg-neutral-100"></div>

          <div class="flex-1">
            <div class="h-4 w-40 rounded-full bg-neutral-100"></div>
            <div class="mt-4 h-9 w-2/3 rounded-full bg-neutral-100"></div>
            <div class="mt-4 h-4 w-full rounded-full bg-neutral-100"></div>
            <div class="mt-2 h-4 w-4/5 rounded-full bg-neutral-100"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Error -->
    <section
      v-else-if="error || !institution"
      class="mx-auto max-w-3xl px-4 pb-20 pt-28 text-center sm:px-6 lg:px-8"
    >
      <div class="rounded-[2rem] border border-red-200 bg-white p-8 shadow-sm">
        <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-red-50 text-red-600">
          <Icon icon="solar:danger-circle-bold-duotone" class="h-8 w-8" />
        </div>

        <h1 class="mt-5 text-2xl font-black text-neutral-950">
          Institution tidak ditemukan
        </h1>

        <p class="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-neutral-500">
          Data kelembagaan yang kamu buka belum tersedia, sudah tidak aktif, atau slug-nya tidak sesuai.
        </p>

        <NuxtLink
          to="/institutions"
          class="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-black text-white transition hover:bg-neutral-800"
        >
          <Icon icon="solar:arrow-left-linear" class="h-5 w-5" />
          Kembali ke Kelembagaan
        </NuxtLink>
      </div>
    </section>

    <!-- Detail -->
    <template v-else>
      <section class="relative overflow-hidden border-b pb-12 border-neutral-200 bg-white/80 pt-28 backdrop-blur-xl">
        <div class="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
          <nav class="mb-6 flex flex-wrap items-center gap-2 text-sm font-bold text-neutral-500">
            <NuxtLink to="/" class="transition hover:text-neutral-950">
              Beranda
            </NuxtLink>
            <Icon icon="solar:alt-arrow-right-linear" class="h-4 w-4" />
            <NuxtLink to="/institutions" class="transition hover:text-neutral-950">
              Kelembagaan
            </NuxtLink>
            <Icon icon="solar:alt-arrow-right-linear" class="h-4 w-4" />
            <span class="text-neutral-950">
              {{ institution.title }}
            </span>
          </nav>

          <div class="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <div class="mb-5 flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
                  <Icon icon="solar:buildings-2-bold-duotone" class="h-4 w-4" />
                  Kelembagaan Desa
                </span>

                <span
                  class="rounded-full px-3 py-1.5 text-xs font-black"
                  :class="institution.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-neutral-100 text-neutral-600'"
                >
                  {{ institution.status }}
                </span>

                <span
                  v-if="institution.isFeatured"
                  class="rounded-full bg-neutral-950 px-3 py-1.5 text-xs font-black text-white"
                >
                  Featured
                </span>
              </div>

              <h1 class="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
                {{ institution.title }}
              </h1>

              <p
                v-if="institution.subtitle"
                class="mt-5 max-w-3xl text-base font-medium leading-8 text-neutral-600 sm:text-lg"
              >
                {{ institution.subtitle }}
              </p>
            </div>

            <aside class="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm">
              <div class="flex items-start gap-4">
                <div class="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-3xl bg-blue-50 text-blue-700">
                  <img
                    v-if="institution.logoUrl"
                    :src="institution.logoUrl"
                    :alt="institution.title"
                    class="h-full w-full object-cover"
                    @error="hideBrokenImage"
                  >
                  <Icon
                    v-else
                    :icon="institution.icon || defaultInstitutionIcon"
                    class="h-8 w-8"
                  />
                </div>

                <div class="min-w-0">
                  <p class="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">
                    Institution
                  </p>
                  <p class="mt-1 truncate text-lg font-black text-neutral-950">
                    {{ institution.title }}
                  </p>
                  <p class="mt-1 truncate text-xs font-bold text-neutral-500">
                    {{ institution.slug }}
                  </p>
                </div>
              </div>

              <div class="mt-5 grid gap-2">
                <div class="flex items-center justify-between gap-3 rounded-2xl bg-neutral-50 px-4 py-3">
                  <span class="text-xs font-black uppercase tracking-[0.12em] text-neutral-400">
                    Urutan
                  </span>
                  <span class="text-sm font-black text-neutral-950">
                    {{ institution.sortOrder || 0 }}
                  </span>
                </div>

                <div class="flex items-center justify-between gap-3 rounded-2xl bg-neutral-50 px-4 py-3">
                  <span class="text-xs font-black uppercase tracking-[0.12em] text-neutral-400">
                    Update
                  </span>
                  <span class="text-sm font-black text-neutral-950">
                    {{ formatDate(institution.updatedAt) }}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section class="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_300px] lg:px-8">
        <article class="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm">
          <div class="border-b border-neutral-200 px-5 py-4 sm:px-6">
            <div class="flex items-center gap-3">
              <div class="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                <Icon icon="solar:document-text-bold-duotone" class="h-5 w-5" />
              </div>

              <div>
                <p class="text-sm font-black text-neutral-950">
                  Profil {{ institution.title }}
                </p>
                <p class="text-xs font-semibold text-neutral-500">
                  Informasi detail lembaga desa
                </p>
              </div>
            </div>
          </div>

          <div class="px-5 py-6 sm:px-6">
            <div
              v-if="safeContentHtml"
              class="institution-content"
              v-html="safeContentHtml"
            ></div>

            <div
              v-else
              class="rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center"
            >
              <Icon icon="solar:document-bold-duotone" class="mx-auto h-10 w-10 text-neutral-400" />
              <p class="mt-3 text-sm font-bold text-neutral-500">
                Belum ada content detail untuk institution ini.
              </p>
            </div>
          </div>
        </article>

        <aside class="space-y-4">
          <div class="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm">
            <p class="text-sm font-black text-neutral-950">
              Ringkasan
            </p>

            <div class="mt-4 space-y-3">
              <div>
                <p class="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">
                  Title
                </p>
                <p class="mt-1 text-sm font-bold text-neutral-700">
                  {{ institution.title }}
                </p>
              </div>

              <div v-if="institution.subtitle">
                <p class="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">
                  Subtitle
                </p>
                <p class="mt-1 text-sm font-bold leading-6 text-neutral-700">
                  {{ institution.subtitle }}
                </p>
              </div>

            </div>
          </div>

          <NuxtLink
            to="/institutions"
            class="flex items-center justify-between gap-3 rounded-[1.5rem] border border-neutral-200 bg-white p-4 text-sm font-black text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-neutral-50"
          >
            <span class="inline-flex items-center gap-2">
              <Icon icon="solar:arrow-left-linear" class="h-5 w-5" />
              Kembali ke Kelembagaan
            </span>
          </NuxtLink>
        </aside>
      </section>
    </template>
  </main>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import type { InstitutionDetailResponse, InstitutionItem } from '~/types/institution'
import { useAppApi } from '../../composables/useAppApi'

const route = useRoute()
const requestUrl = useRequestURL()
const runtime = useRuntimeConfig()

const defaultInstitutionIcon = 'solar:buildings-2-bold-duotone'

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

const { tenantApiUrl } = useAppApi()
const apiUrl = computed(() => {
  return tenantApiUrl(tenantSlug.value, `/institutions/by-slug/${encodeURIComponent(slug.value)}`)
})

const {
  data,
  pending,
  error
} = await useFetch<InstitutionDetailResponse>(apiUrl, {
  key: computed(() => `institution-detail-${tenantSlug.value}-${slug.value}`),
  watch: [tenantSlug, slug],
  default: () => ({
    data: null as any
  })
})

const institution = computed<InstitutionItem | null>(() => {
  return data.value?.data || null
})

const safeContentHtml = computed(() => {
  return sanitizeInstitutionHtml(institution.value?.contentHtml || '')
})

const pageTitle = computed(() => {
  return institution.value
    ? `${institution.value.title} · Kelembagaan Desa`
    : 'Institution tidak ditemukan'
})

const pageDescription = computed(() => {
  return institution.value?.subtitle ||
    plainText(institution.value?.contentHtml || '').slice(0, 160) ||
    'Informasi kelembagaan desa.'
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
      href: `${requestUrl.origin}/institutions/${slug.value}`
    }
  ]
}))

function sanitizeInstitutionHtml(value: string) {
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

function hideBrokenImage(event: Event) {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}
</script>

<style scoped>
.bg-size-\[44px_44px\] {
  background-size: 44px 44px;
}

.institution-content {
  color: #262626;
  font-size: 1rem;
  line-height: 1.8;
}

.institution-content :deep(h2) {
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  font-size: 1.75rem;
  line-height: 1.2;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #171717;
}

.institution-content :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 0.65rem;
  font-size: 1.35rem;
  line-height: 1.3;
  font-weight: 900;
  color: #171717;
}

.institution-content :deep(p) {
  margin: 0.9rem 0;
}

.institution-content :deep(a) {
  color: #2563eb;
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.institution-content :deep(ul),
.institution-content :deep(ol) {
  margin: 1rem 0;
  padding-left: 1.35rem;
}

.institution-content :deep(li) {
  margin: 0.35rem 0;
}

.institution-content :deep(blockquote) {
  margin: 1.25rem 0;
  border-left: 4px solid #171717;
  border-radius: 0.75rem;
  background: #fafafa;
  padding: 1rem 1.25rem;
  color: #525252;
}

.institution-content :deep(img) {
  margin: 1.25rem 0;
  max-width: 100%;
  height: auto;
  border-radius: 1.25rem;
  border: 1px solid #e5e5e5;
}

.institution-content :deep(iframe) {
  margin: 1.25rem 0;
  min-height: 420px;
  width: 100%;
  border: 0;
  border-radius: 1.25rem;
  background: #f5f5f5;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>