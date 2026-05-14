<template>
  <main class="min-h-screen overflow-hidden bg-neutral-50 text-neutral-950" :style="themeVars">
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-[var(--brand-soft)] blur-3xl"></div>
      <div class="absolute -right-40 top-28 h-[520px] w-[520px] rounded-full bg-blue-100/80 blur-3xl"></div>
      <div class="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-emerald-100/60 blur-3xl"></div>
      <div class="absolute inset-0 bg-grid opacity-40"></div>
    </div>

    <!-- Loading -->
    <section v-if="pending" class="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div class="overflow-hidden rounded-[2.5rem] border border-neutral-200 bg-white p-6 shadow-sm">
        <div class="grid animate-pulse gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <div class="h-5 w-44 rounded-full bg-neutral-100"></div>
            <div class="mt-6 h-16 w-4/5 rounded-2xl bg-neutral-100"></div>
            <div class="mt-5 h-4 w-full rounded-full bg-neutral-100"></div>
            <div class="mt-3 h-4 w-3/4 rounded-full bg-neutral-100"></div>
            <div class="mt-8 flex gap-3">
              <div class="h-12 w-40 rounded-2xl bg-neutral-100"></div>
              <div class="h-12 w-36 rounded-2xl bg-neutral-100"></div>
            </div>
          </div>
          <div class="h-80 rounded-[2rem] bg-neutral-100"></div>
        </div>
      </div>
    </section>

    <!-- Error -->
    <section v-else-if="visibleError" class="mx-auto max-w-3xl px-4 pb-16 pt-28 text-center sm:px-6 lg:px-8">
      <div class="rounded-[2rem] border border-red-200 bg-white p-8 shadow-sm">
        <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-red-50 text-red-600">
          <Icon icon="solar:danger-circle-bold-duotone" class="h-8 w-8" />
        </div>
        <h1 class="mt-5 text-2xl font-black text-neutral-950">Profil tenant belum tersedia</h1>
        <p class="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-neutral-500">
          {{ visibleError }}
        </p>
        <button
          type="button"
          class="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-black text-white transition hover:bg-neutral-800"
          @click="refresh()"
        >
          <Icon icon="solar:refresh-bold-duotone" class="h-5 w-5" />
          Muat Ulang
        </button>
      </div>
    </section>

    <template v-else>
      <!-- Hero -->
      <section class="relative overflow-hidden border-b border-neutral-200 bg-white/80 pt-28 backdrop-blur-xl">
        <div class="absolute inset-0 opacity-70">
          <div class="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--brand-soft)] blur-3xl"></div>
          <div class="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-blue-50 blur-3xl"></div>
        </div>

        <div class="relative mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <nav class="mb-7 flex flex-wrap items-center gap-2 text-sm font-bold text-neutral-500">
            <NuxtLink to="/" class="transition hover:text-neutral-950">Beranda</NuxtLink>
            <Icon icon="solar:alt-arrow-right-linear" class="h-4 w-4" />
            <span class="text-neutral-950">Profil</span>
          </nav>

          <div class="grid gap-8 lg:grid-cols-[1fr_390px] lg:items-end">
            <div>
              <div class="mb-5 flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center gap-2 rounded-full bg-[var(--brand-soft)] px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[var(--brand)]">
                  <Icon :icon="profileBadgeIcon" class="h-4 w-4" />
                  {{ tenantTypeLabel }}
                </span>

                <span class="rounded-full border border-neutral-200 bg-white/80 px-3 py-1.5 text-xs font-black text-neutral-500 shadow-sm">
                  {{ tenant?.slug || tenantSlug }}
                </span>

                <span
                  class="rounded-full px-3 py-1.5 text-xs font-black"
                  :class="tenant?.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-600'"
                >
                  {{ tenant?.status || 'active' }}
                </span>
              </div>

              <h1 class="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
                {{ heroTitle }}
                <span class="block bg-gradient-to-r from-[var(--brand)] via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {{ tenant?.displayName || tenant?.name || appName }}
                </span>
              </h1>

              <p class="mt-5 max-w-3xl text-base font-semibold leading-8 text-neutral-600 sm:text-lg">
                {{ heroDescription }}
              </p>

              <div class="mt-8 flex flex-wrap gap-3">
                <NuxtLink
                  :to="primaryCta.href"
                  class="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-black text-white shadow-lg shadow-neutral-900/10 transition hover:-translate-y-0.5 hover:bg-neutral-800"
                >
                  {{ primaryCta.label }}
                  <Icon icon="solar:arrow-right-up-linear" class="h-5 w-5" />
                </NuxtLink>

                <a
                  v-if="mapsHref"
                  :href="mapsHref"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-black text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-neutral-50"
                >
                  <Icon icon="solar:map-point-bold-duotone" class="h-5 w-5 text-[var(--brand)]" />
                  Buka Lokasi
                </a>

                <a
                  v-if="contactWhatsappHref"
                  :href="contactWhatsappHref"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-black text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-neutral-50"
                >
                  <Icon icon="solar:chat-round-call-bold-duotone" class="h-5 w-5 text-[var(--brand)]" />
                  Hubungi Kami
                </a>
              </div>
            </div>

            <aside class="relative overflow-hidden rounded-[2.25rem] border border-neutral-200 bg-white p-5 shadow-xl shadow-neutral-900/5">
              <div class="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[var(--brand-soft)] blur-2xl"></div>

              <div class="relative flex items-start gap-4">
                <div class="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[1.75rem] bg-neutral-50 text-[var(--brand)] ring-1 ring-neutral-200">
                  <img
                    v-if="tenantLogo && !logoFailed"
                    :src="tenantLogo"
                    :alt="tenant?.displayName || tenant?.name || appName"
                    class="h-full w-full object-contain p-3"
                    @error="logoFailed = true"
                  >
                  <Icon v-else :icon="profileBadgeIcon" class="h-10 w-10" />
                </div>

                <div class="min-w-0 flex-1">
                  <p class="text-xs font-black uppercase tracking-[0.16em] text-neutral-400">Tenant Profile</p>
                  <h2 class="mt-1 truncate text-xl font-black text-neutral-950">
                    {{ tenant?.displayName || tenant?.name || appName }}
                  </h2>
                  <p class="mt-1 truncate text-sm font-bold text-neutral-500">
                    {{ tenant?.domain || hostname || tenant?.siteUrl || '-' }}
                  </p>
                </div>
              </div>

              <div class="relative mt-6 grid gap-3">
                <ProfileInfoRow icon="solar:buildings-bold-duotone" label="Tipe" :value="tenantTypeLabel" />
                <ProfileInfoRow icon="solar:global-bold-duotone" label="Website" :value="tenant?.siteUrl || siteUrl" />
                <ProfileInfoRow icon="solar:palette-bold-duotone" label="Warna Utama" :value="tenant?.primaryColor || brandColor" />
              </div>

              <div class="relative mt-5 rounded-[1.5rem] border border-neutral-200 bg-neutral-50 p-4">
                <p class="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">Deskripsi Singkat</p>
                <p class="mt-2 line-clamp-4 text-sm font-semibold leading-6 text-neutral-600">
                  {{ tenant?.description || fallbackDescription }}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <!-- Stats -->
      <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article
            v-for="item in statsCards"
            :key="item.label"
            class="rounded-[1.75rem] border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-neutral-900/5"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-sm font-bold text-neutral-500">{{ item.label }}</p>
                <h2 class="mt-3 text-3xl font-black text-neutral-950">{{ item.value }}</h2>
              </div>
              <div class="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
                <Icon :icon="item.icon" class="h-6 w-6" />
              </div>
            </div>
            <p class="mt-4 text-xs font-semibold leading-5 text-neutral-500">{{ item.description }}</p>
          </article>
        </div>
      </section>

      <!-- Main Content -->
      <section class="mx-auto grid max-w-7xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div class="space-y-6">
          <!-- About -->
          <article class="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm">
            <div class="border-b border-neutral-200 p-5 sm:p-6">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-black uppercase tracking-[0.16em] text-[var(--brand)]">Tentang Kami</p>
                  <h2 class="mt-2 text-2xl font-black tracking-tight text-neutral-950">Profil {{ tenant?.displayName || tenant?.name || appName }}</h2>
                </div>
                <div class="hidden h-12 w-12 place-items-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)] sm:grid">
                  <Icon icon="solar:document-text-bold-duotone" class="h-6 w-6" />
                </div>
              </div>
            </div>

            <div class="p-5 sm:p-6">
              <div class="prose-content" v-html="aboutHtml"></div>
            </div>
          </article>

          <!-- Vision Mission -->
          <article class="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <div class="mb-5 flex items-start justify-between gap-4">
              <div>
                <p class="text-xs font-black uppercase tracking-[0.16em] text-[var(--brand)]">Arah Pengembangan</p>
                <h2 class="mt-2 text-2xl font-black tracking-tight text-neutral-950">Visi, Misi, dan Nilai</h2>
              </div>
            </div>

            <div class="grid gap-4 lg:grid-cols-2">
              <div class="rounded-[1.5rem] border border-neutral-200 bg-neutral-50 p-5">
                <div class="mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-white text-[var(--brand)] shadow-sm">
                  <Icon icon="solar:target-bold-duotone" class="h-6 w-6" />
                </div>
                <p class="text-sm font-black uppercase tracking-[0.14em] text-neutral-400">Visi</p>
                <h3 class="mt-2 text-xl font-black leading-8 text-neutral-950">{{ visionTitle }}</h3>
                <p class="mt-3 text-sm font-semibold leading-7 text-neutral-600">{{ visionDescription }}</p>
              </div>

              <div class="rounded-[1.5rem] border border-neutral-200 bg-neutral-50 p-5">
                <div class="mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-white text-[var(--brand)] shadow-sm">
                  <Icon icon="solar:rocket-bold-duotone" class="h-6 w-6" />
                </div>
                <p class="text-sm font-black uppercase tracking-[0.14em] text-neutral-400">Misi</p>
                <div class="mt-3 space-y-3">
                  <div v-for="(mission, index) in missions" :key="index" class="flex items-start gap-3">
                    <span class="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-white text-xs font-black text-[var(--brand)] shadow-sm">
                      {{ index + 1 }}
                    </span>
                    <p class="text-sm font-semibold leading-7 text-neutral-600">{{ mission }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div
                v-for="value in cultureValues"
                :key="value.title"
                class="rounded-[1.35rem] border border-neutral-200 bg-white p-4 shadow-sm"
              >
                <div class="mb-3 grid h-10 w-10 place-items-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
                  <Icon :icon="value.icon" class="h-5 w-5" />
                </div>
                <h3 class="text-sm font-black text-neutral-950">{{ value.title }}</h3>
                <p class="mt-2 text-xs font-semibold leading-5 text-neutral-500">{{ value.description }}</p>
              </div>
            </div>
          </article>

          <!-- Services / Navigation -->
          <article class="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p class="text-xs font-black uppercase tracking-[0.16em] text-[var(--brand)]">Layanan</p>
                <h2 class="mt-2 text-2xl font-black tracking-tight text-neutral-950">Akses Cepat Platform</h2>
              </div>
              <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm font-black text-[var(--brand)]">
                Kembali Beranda
                <Icon icon="solar:arrow-right-up-linear" class="h-4 w-4" />
              </NuxtLink>
            </div>

            <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <NuxtLink
                v-for="nav in serviceLinks"
                :key="nav.href"
                :to="nav.href"
                class="group rounded-[1.5rem] border border-neutral-200 bg-neutral-50 p-4 transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:bg-white hover:shadow-lg hover:shadow-neutral-900/5"
              >
                <div class="flex items-start gap-3">
                  <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[var(--brand)] shadow-sm transition group-hover:bg-[var(--brand)] group-hover:text-white">
                    <Icon :icon="nav.icon" class="h-5 w-5" />
                  </div>
                  <div class="min-w-0">
                    <h3 class="text-sm font-black text-neutral-950">{{ nav.label }}</h3>
                    <p class="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-neutral-500">{{ nav.description }}</p>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </article>
        </div>

        <!-- Sidebar -->
        <aside class="space-y-6">
          <div class="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm">
            <p class="text-sm font-black text-neutral-950">Informasi Kontak</p>
            <p class="mt-1 text-xs font-semibold text-neutral-500">Data kontak resmi tenant.</p>

            <div class="mt-5 space-y-3">
              <ContactRow icon="solar:phone-bold-duotone" label="Telepon" :value="contactPhone || '-'" :href="contactPhoneHref" />
              <ContactRow icon="solar:chat-round-call-bold-duotone" label="WhatsApp" :value="contactWhatsapp || '-'" :href="contactWhatsappHref" />
              <ContactRow icon="solar:letter-bold-duotone" label="Email" :value="contactEmail || '-'" :href="contactEmailHref" />
              <ContactRow icon="solar:map-point-bold-duotone" label="Alamat" :value="contactAddress || '-'" :href="mapsHref" />
            </div>
          </div>

          <div class="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm">
            <p class="text-sm font-black text-neutral-950">Sosial Media</p>
            <p class="mt-1 text-xs font-semibold text-neutral-500">Ikuti kanal informasi resmi.</p>

            <div v-if="socialLinks.length" class="mt-5 grid gap-2">
              <a
                v-for="social in socialLinks"
                :key="social.href"
                :href="social.href"
                target="_blank"
                rel="noopener"
                class="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-black text-neutral-700 transition hover:bg-white hover:text-[var(--brand)]"
              >
                <span class="inline-flex min-w-0 items-center gap-3">
                  <Icon :icon="social.icon" class="h-5 w-5 shrink-0" />
                  <span class="truncate">{{ social.label }}</span>
                </span>
                <Icon icon="solar:arrow-right-up-linear" class="h-4 w-4 shrink-0" />
              </a>
            </div>

            <div v-else class="mt-5 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-4 text-center">
              <Icon icon="solar:share-circle-bold-duotone" class="mx-auto h-8 w-8 text-neutral-400" />
              <p class="mt-2 text-xs font-bold text-neutral-500">Belum ada sosial media.</p>
            </div>
          </div>

          <div class="overflow-hidden rounded-[2rem] border border-neutral-200 bg-neutral-950 text-white shadow-sm">
            <div class="relative p-5">
              <div class="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
              <div class="relative">
                <div class="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-white">
                  <Icon icon="solar:shield-check-bold-duotone" class="h-6 w-6" />
                </div>
                <h3 class="mt-4 text-lg font-black">Transparan & Terintegrasi</h3>
                <p class="mt-2 text-sm font-semibold leading-6 text-white/65">
                  Profil ini dirancang agar dapat mengambil konfigurasi tenant, konten, SEO, kontak, navigasi, dan branding secara dinamis dari database.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </template>
  </main>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, defineComponent, h, ref } from 'vue'
import { useAsyncData, useHead, useRequestURL, useRuntimeConfig, useSeoMeta } from 'nuxt/app'

type TenantType = 'village' | 'school' | 'pesantren' | 'company' | 'custom'
type TenantStatus = 'active' | 'inactive'

type TenantSiteConfig = {
  id: string
  name: string
  displayName: string
  slug: string
  tenantType: TenantType
  domain: string | null
  siteUrl: string | null
  logoUrl: string | null
  faviconUrl: string | null
  ogImageUrl: string | null
  primaryColor: string | null
  description: string | null
  status: TenantStatus
  theme: Record<string, any>
  seo: Record<string, any>
  hero: Record<string, any>
  contact: Record<string, any>
  statistic: Record<string, any>
  culture: Record<string, any>
  warta: Record<string, any>
  footer: Record<string, any>
  navigation: any[]
  social: Record<string, any>
  metadata: Record<string, any>
}

type TenantResponse = {
  data: TenantSiteConfig
}

type StatCard = {
  label: string
  value: string
  description: string
  icon: string
}

type ServiceLink = {
  label: string
  description: string
  href: string
  icon: string
}

type SocialLink = {
  label: string
  href: string
  icon: string
}

const runtime = useRuntimeConfig()
const requestUrl = useRequestURL()
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

const appName = computed(() => {
  return String(
    runtime.public.appName ||
    runtime.public.clientDisplayName ||
    runtime.public.siteName ||
    'Obayan'
  )
})

const siteUrl = computed(() => {
  return String(runtime.public.siteUrl || requestUrl.origin || '')
})

const { data, pending, error, refresh } = await useAsyncData<TenantResponse>(
  () => `tenant-profile-${tenantSlug.value}`,
  async () => {
    const endpoints = [
      `/api/tenants/${tenantSlug.value}/site`,
      `/api/tenants/${tenantSlug.value}/profile`,
      `/api/tenants/${tenantSlug.value}`
    ]

    let lastError: unknown = null

    for (const endpoint of endpoints) {
      try {
        return await $fetch<TenantResponse>(endpoint)
      } catch (err) {
        lastError = err
      }
    }

    throw lastError
  },
  {
    watch: [tenantSlug]
  }
)

const tenant = computed(() => data.value?.data || null)

const visibleError = computed(() => {
  if (!error.value) return ''
  return error.value?.message || 'Data tenant tidak dapat dimuat. Pastikan endpoint tenant profile sudah tersedia.'
})

const brandColor = computed(() => {
  return (
    tenant.value?.primaryColor ||
    tenant.value?.theme?.primaryColor ||
    tenant.value?.theme?.brandColor ||
    '#2563eb'
  )
})

const themeVars = computed<Record<string, string>>(() => ({
  '--brand': brandColor.value,
  '--brand-soft': toSoftColor(brandColor.value),
  '--brand-ring': toRingColor(brandColor.value)
}))

const tenantLogo = computed(() => {
  return String(runtime.public.appLogo || '')
})

const tenantTypeLabel = computed(() => {
  const type = tenant.value?.tenantType || 'custom'

  const map: Record<TenantType, string> = {
    village: 'Profil Desa',
    school: 'Profil Sekolah',
    pesantren: 'Profil Pesantren',
    company: 'Profil Perusahaan',
    custom: 'Profil Tenant'
  }

  return map[type] || 'Profil Tenant'
})

const profileBadgeIcon = computed(() => {
  const type = tenant.value?.tenantType || 'custom'

  const map: Record<TenantType, string> = {
    village: 'solar:buildings-3-bold-duotone',
    school: 'solar:square-academic-cap-bold-duotone',
    pesantren: 'solar:home-smile-angle-bold-duotone',
    company: 'solar:case-round-bold-duotone',
    custom: 'solar:widget-5-bold-duotone'
  }

  return map[type] || 'solar:widget-5-bold-duotone'
})

const heroTitle = computed(() => {
  return String(
    tenant.value?.hero?.profileTitle ||
    tenant.value?.seo?.profileTitle ||
    tenant.value?.metadata?.profileTitle ||
    'Mengenal Lebih Dekat'
  )
})

const fallbackDescription = computed(() => {
  const type = tenant.value?.tenantType || 'custom'

  if (type === 'village') {
    return 'Profil desa digital yang menyajikan informasi pemerintahan, layanan publik, potensi desa, fasilitas, berita, dan agenda masyarakat secara transparan.'
  }

  if (type === 'school') {
    return 'Profil institusi pendidikan yang menyajikan informasi akademik, kegiatan, fasilitas, program, dan layanan digital secara modern.'
  }

  if (type === 'pesantren') {
    return 'Profil lembaga pendidikan pesantren yang menyajikan informasi program, kegiatan, fasilitas, dan layanan publik secara terintegrasi.'
  }

  if (type === 'company') {
    return 'Profil organisasi yang menyajikan informasi layanan, produk, portofolio, dan identitas perusahaan secara profesional.'
  }

  return 'Profil tenant digital yang menyajikan informasi utama, layanan, konten, dan identitas brand secara modern dan terintegrasi.'
})

const heroDescription = computed(() => {
  return String(
    tenant.value?.hero?.profileDescription ||
    tenant.value?.seo?.description ||
    tenant.value?.description ||
    fallbackDescription.value
  )
})

const aboutHtml = computed(() => {
  const html =
    tenant.value?.metadata?.aboutHtml ||
    tenant.value?.culture?.aboutHtml ||
    tenant.value?.hero?.aboutHtml

  if (html) return sanitizeHtml(String(html))

  return `
    <p>${escapeHtml(heroDescription.value)}</p>
    <p>${escapeHtml(tenant.value?.displayName || tenant.value?.name || appName.value)} dikembangkan dengan pendekatan digital-first agar informasi dapat diakses lebih cepat, rapi, dan transparan. Halaman profil ini dapat diperluas untuk memuat sejarah, struktur organisasi, visi misi, layanan, kontak, dan informasi pendukung lainnya.</p>
  `
})

const visionTitle = computed(() => {
  return String(
    tenant.value?.culture?.visionTitle ||
    tenant.value?.metadata?.visionTitle ||
    `Menjadi ${tenantTypeLabel.value.toLowerCase()} yang modern, transparan, dan berdampak.`
  )
})

const visionDescription = computed(() => {
  return String(
    tenant.value?.culture?.visionDescription ||
    tenant.value?.metadata?.visionDescription ||
    'Membangun layanan informasi dan tata kelola yang mudah diakses, terpercaya, serta mampu mendukung kebutuhan masyarakat dan pemangku kepentingan secara berkelanjutan.'
  )
})

const missions = computed<string[]>(() => {
  const values = tenant.value?.culture?.missions || tenant.value?.metadata?.missions

  if (Array.isArray(values) && values.length) {
    return values.map((item) => String(item)).filter(Boolean)
  }

  return [
    'Menyediakan informasi yang rapi, jelas, dan mudah dipahami oleh publik.',
    'Meningkatkan akses layanan digital agar proses administrasi menjadi lebih cepat dan efisien.',
    'Mendorong transparansi, kolaborasi, dan partisipasi masyarakat melalui platform digital.'
  ]
})

const cultureValues = computed(() => {
  const values = tenant.value?.culture?.values || tenant.value?.metadata?.values

  if (Array.isArray(values) && values.length) {
    return values.map((item: any) => ({
      title: String(item.title || item.label || 'Nilai'),
      description: String(item.description || item.subtitle || 'Nilai utama organisasi.'),
      icon: String(item.icon || 'solar:star-fall-bold-duotone')
    }))
  }

  return [
    {
      title: 'Transparan',
      description: 'Informasi disajikan terbuka dan mudah dipahami oleh masyarakat.',
      icon: 'solar:eye-bold-duotone'
    },
    {
      title: 'Responsif',
      description: 'Layanan dirancang agar lebih cepat, adaptif, dan nyaman digunakan.',
      icon: 'solar:bolt-bold-duotone'
    },
    {
      title: 'Kolaboratif',
      description: 'Mendorong sinergi antara pengurus, warga, dan stakeholder.',
      icon: 'solar:users-group-rounded-bold-duotone'
    },
    {
      title: 'Berkelanjutan',
      description: 'Pengembangan dilakukan bertahap dan dapat mengikuti kebutuhan tenant.',
      icon: 'solar:refresh-circle-bold-duotone'
    }
  ]
})

const statsCards = computed<StatCard[]>(() => {
  const stat = tenant.value?.statistic || tenant.value?.metadata?.statistics || {}

  const items = Array.isArray(stat.items) ? stat.items : []

  if (items.length) {
    return items.slice(0, 4).map((item: any) => ({
      label: String(item.label || 'Statistik'),
      value: String(item.value || '0'),
      description: String(item.description || 'Data statistik tenant.'),
      icon: String(item.icon || 'solar:chart-2-bold-duotone')
    }))
  }

  return [
    {
      label: 'Status',
      value: tenant.value?.status === 'active' ? 'Aktif' : 'Nonaktif',
      description: 'Status tenant di dalam platform.',
      icon: 'solar:check-circle-bold-duotone'
    },
    {
      label: 'Tipe Tenant',
      value: tenantTypeShortLabel.value,
      description: 'Kategori utama tenant dalam sistem.',
      icon: profileBadgeIcon.value
    },
    {
      label: 'Konten',
      value: 'Dinamis',
      description: 'Konten dapat dikembangkan dari database dan CMS.',
      icon: 'solar:database-bold-duotone'
    },
    {
      label: 'Branding',
      value: 'Custom',
      description: 'Tema, logo, SEO, kontak, dan navigasi dapat disesuaikan.',
      icon: 'solar:palette-bold-duotone'
    }
  ]
})

const tenantTypeShortLabel = computed(() => {
  const type = tenant.value?.tenantType || 'custom'

  const map: Record<TenantType, string> = {
    village: 'Desa',
    school: 'Sekolah',
    pesantren: 'Pesantren',
    company: 'Company',
    custom: 'Custom'
  }

  return map[type] || 'Custom'
})

const serviceLinks = computed<ServiceLink[]>(() => {
  const customNavigation = tenant.value?.navigation

  if (Array.isArray(customNavigation) && customNavigation.length) {
    return customNavigation
      .filter((item: any) => item?.href || item?.to || item?.url)
      .slice(0, 6)
      .map((item: any) => ({
        label: String(item.label || item.title || 'Menu'),
        description: String(item.description || item.subtitle || 'Akses halaman terkait.'),
        href: String(item.href || item.to || item.url || '/'),
        icon: String(item.icon || 'solar:arrow-right-up-linear')
      }))
  }

  const type = tenant.value?.tenantType || 'custom'

  if (type === 'village') {
    return [
      { label: 'Berita Informasi', description: 'Informasi resmi, agenda, dan publikasi desa.', href: '/news', icon: 'solar:document-text-bold-duotone' },
      { label: 'Fasilitas Desa', description: 'Data fasilitas publik dan layanan warga.', href: '/facilities', icon: 'solar:map-point-wave-bold-duotone' },
      { label: 'Potensi Desa', description: 'Potensi ekonomi, UMKM, wisata, dan budaya lokal.', href: '/potentials', icon: 'solar:leaf-bold-duotone' },
      { label: 'Lembaga Desa', description: 'Struktur kelembagaan dan organisasi desa.', href: '/institutions', icon: 'solar:buildings-3-bold-duotone' },
      { label: 'Keuangan Desa', description: 'Ringkasan transparansi APBDes dan data keuangan.', href: '/finance', icon: 'solar:wallet-money-bold-duotone' },
      { label: 'Pengajuan Surat', description: 'Akses layanan administrasi surat online.', href: '/letters', icon: 'solar:file-send-bold-duotone' }
    ]
  }

  return [
    { label: 'Berita', description: 'Publikasi dan informasi terbaru.', href: '/news', icon: 'solar:document-text-bold-duotone' },
    { label: 'Organisasi', description: 'Profil organisasi atau unit yang terhubung.', href: '/organizations', icon: 'solar:users-group-rounded-bold-duotone' },
    { label: 'Fasilitas', description: 'Data fasilitas atau layanan utama tenant.', href: '/facilities', icon: 'solar:map-point-wave-bold-duotone' },
    { label: 'Kontak', description: 'Informasi kontak dan alamat resmi.', href: '/contact', icon: 'solar:phone-bold-duotone' }
  ]
})

const primaryCta = computed(() => {
  const value = tenant.value?.hero?.profileCta || tenant.value?.metadata?.profileCta

  if (value?.label && value?.href) {
    return {
      label: String(value.label),
      href: String(value.href)
    }
  }

  return {
    label: tenant.value?.tenantType === 'village' ? 'Lihat Layanan Desa' : 'Lihat Layanan',
    href: serviceLinks.value[0]?.href || '/'
  }
})

const contact = computed(() => tenant.value?.contact || {})

const contactPhone = computed(() => String(contact.value.phone || contact.value.telephone || '').trim())
const contactWhatsapp = computed(() => String(contact.value.whatsapp || contact.value.wa || '').trim())
const contactEmail = computed(() => String(contact.value.email || '').trim())
const contactAddress = computed(() => String(contact.value.address || contact.value.location || '').trim())

const contactPhoneHref = computed(() => contactPhone.value ? `tel:${contactPhone.value.replace(/\s+/g, '')}` : '')
const contactEmailHref = computed(() => contactEmail.value ? `mailto:${contactEmail.value}` : '')

const contactWhatsappHref = computed(() => {
  const value = contactWhatsapp.value || contactPhone.value
  const number = value.replace(/\D/g, '')

  if (!number) return ''

  return `https://wa.me/${number.startsWith('0') ? `62${number.slice(1)}` : number}`
})

const mapsHref = computed(() => {
  const lat = contact.value.latitude || contact.value.lat
  const lng = contact.value.longitude || contact.value.lng

  if (lat && lng) return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  if (contactAddress.value) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactAddress.value)}`

  return ''
})

const socialLinks = computed<SocialLink[]>(() => {
  const social = tenant.value?.social || {}
  const list: SocialLink[] = []

  const map: Record<string, { label: string; icon: string }> = {
    instagram: { label: 'Instagram', icon: 'mdi:instagram' },
    facebook: { label: 'Facebook', icon: 'mdi:facebook' },
    youtube: { label: 'YouTube', icon: 'mdi:youtube' },
    tiktok: { label: 'TikTok', icon: 'ic:baseline-tiktok' },
    twitter: { label: 'X / Twitter', icon: 'mdi:twitter' },
    linkedin: { label: 'LinkedIn', icon: 'mdi:linkedin' },
    website: { label: 'Website', icon: 'solar:global-bold-duotone' }
  }

  for (const [key, info] of Object.entries(map)) {
    const href = String(social[key] || '').trim()
    if (!href) continue
    list.push({ label: info.label, icon: info.icon, href })
  }

  if (Array.isArray(social.links)) {
    for (const item of social.links) {
      const href = String(item.href || item.url || '').trim()
      if (!href) continue
      list.push({
        label: String(item.label || item.name || 'Social'),
        icon: String(item.icon || 'solar:share-circle-bold-duotone'),
        href
      })
    }
  }

  return list
})

const pageTitle = computed(() => {
  return String(
    tenant.value?.seo?.profileMetaTitle ||
    tenant.value?.seo?.title ||
    `Profil ${tenant.value?.displayName || tenant.value?.name || appName.value}`
  )
})

const pageDescription = computed(() => {
  return String(
    tenant.value?.seo?.profileMetaDescription ||
    tenant.value?.seo?.description ||
    heroDescription.value
  ).slice(0, 180)
})

useSeoMeta({
  title: () => pageTitle.value,
  description: () => pageDescription.value,
  ogTitle: () => pageTitle.value,
  ogDescription: () => pageDescription.value,
  ogImage: () => tenant.value?.ogImageUrl || tenantLogo.value || undefined,
  robots: 'index, follow',
  themeColor: () => brandColor.value
})

useHead(() => ({
  htmlAttrs: {
    lang: 'id'
  },
  link: [
    {
      rel: 'canonical',
      href: `${requestUrl.origin}/profile`
    },
    ...(tenant.value?.faviconUrl
      ? [
          {
            rel: 'icon',
            type: 'image/png',
            href: tenant.value.faviconUrl
          }
        ]
      : [])
  ]
}))

function toSoftColor(value: string) {
  const rgb = hexToRgb(value)
  if (!rgb) return '#eff6ff'
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.10)`
}

function toRingColor(value: string) {
  const rgb = hexToRgb(value)
  if (!rgb) return 'rgba(37, 99, 235, 0.14)'
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.16)`
}

function hexToRgb(hex: string) {
  const normalized = String(hex || '').replace('#', '').trim()
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null

  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16)
  }
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

function escapeHtml(value: string) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const ProfileInfoRow = defineComponent({
  props: {
    icon: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: String, required: true }
  },
  setup(props) {
    return () => h('div', {
      class: 'flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3'
    }, [
      h('div', { class: 'grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-[var(--brand)] shadow-sm' }, [
        h(Icon, { icon: props.icon, class: 'h-5 w-5' })
      ]),
      h('div', { class: 'min-w-0 flex-1' }, [
        h('p', { class: 'text-xs font-black uppercase tracking-[0.12em] text-neutral-400' }, props.label),
        h('p', { class: 'mt-0.5 truncate text-sm font-black text-neutral-800' }, props.value)
      ])
    ])
  }
})

const ContactRow = defineComponent({
  props: {
    icon: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: String, required: true },
    href: { type: String, default: '' }
  },
  setup(props) {
    return () => {
      const content = [
        h('span', { class: 'grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]' }, [
          h(Icon, { icon: props.icon, class: 'h-5 w-5' })
        ]),
        h('span', { class: 'min-w-0 flex-1' }, [
          h('span', { class: 'block text-xs font-black uppercase tracking-[0.12em] text-neutral-400' }, props.label),
          h('span', { class: 'mt-0.5 block truncate text-sm font-black text-neutral-800' }, props.value)
        ]),
        props.href ? h(Icon, { icon: 'solar:arrow-right-up-linear', class: 'h-4 w-4 shrink-0 text-neutral-400' }) : null
      ]

      if (props.href) {
        return h('a', {
          href: props.href,
          target: props.href.startsWith('http') ? '_blank' : undefined,
          rel: props.href.startsWith('http') ? 'noopener' : undefined,
          class: 'flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 transition hover:bg-white'
        }, content)
      }

      return h('div', {
        class: 'flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3'
      }, content)
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

.prose-content {
  color: #262626;
  font-size: 1rem;
  line-height: 1.85;
}

.prose-content :deep(h2) {
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  font-size: 1.75rem;
  line-height: 1.2;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #171717;
}

.prose-content :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 0.65rem;
  font-size: 1.35rem;
  line-height: 1.3;
  font-weight: 900;
  color: #171717;
}

.prose-content :deep(p) {
  margin: 0.9rem 0;
}

.prose-content :deep(a) {
  color: var(--brand);
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.prose-content :deep(ul),
.prose-content :deep(ol) {
  margin: 1rem 0;
  padding-left: 1.35rem;
}

.prose-content :deep(li) {
  margin: 0.35rem 0;
}

.prose-content :deep(blockquote) {
  margin: 1.25rem 0;
  border-left: 4px solid var(--brand);
  border-radius: 0.75rem;
  background: #fafafa;
  padding: 1rem 1.25rem;
  color: #525252;
}

.prose-content :deep(img) {
  margin: 1.25rem 0;
  max-width: 100%;
  height: auto;
  border-radius: 1.25rem;
  border: 1px solid #e5e5e5;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
