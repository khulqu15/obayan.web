<template>
  <div
    class="min-h-full bg-neutral-50"
    :style="themeVars"
  >
    <div class="space-y-5 p-4 sm:p-6">
      <!-- Header -->
      <section class="relative overflow-hidden rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
        <div class="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--brand-soft)] blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-24 left-20 h-64 w-64 rounded-full bg-neutral-100 blur-3xl"></div>

        <div class="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-start gap-4">
            <div class="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-3xl text-white shadow-sm">
              <img
                v-if="profile.logo && !logoError"
                :src="profile.logo"
                :alt="profile.name"
                class="h-10 w-10 rounded-2xl object-contain"
                @error="logoError = true"
              >
              <Icon
                v-else
                :icon="profile.icon"
                class="h-7 w-7"
              />
            </div>

            <div class="min-w-0">
              <div class="mb-2 flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[var(--brand)]">
                  {{ profile.badge }}
                </span>

                <span class="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-bold text-neutral-500">
                  {{ todayLabel }}
                </span>
              </div>

              <h1 class="text-2xl font-black tracking-tight text-neutral-950 sm:text-3xl">
                {{ profile.title }}
              </h1>

              <p class="mt-2 max-w-3xl text-sm font-medium leading-7 text-neutral-500 sm:text-base">
                {{ profile.description }}
              </p>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <NuxtLink
              v-for="action in profile.actions"
              :key="action.href"
              :to="action.href"
              class="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-black text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-950"
            >
              <Icon :icon="action.icon" class="h-5 w-5 text-[var(--brand)]" />
              {{ action.label }}
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- KPI Cards -->
      <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="stat in dashboardStats"
          :key="stat.label"
          class="rounded-[1.75rem] border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-bold text-neutral-500">
                {{ stat.label }}
              </p>

              <h2 class="mt-3 text-3xl font-black tracking-tight text-neutral-950">
                {{ stat.value }}
              </h2>
            </div>

            <div class="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
              <Icon :icon="stat.icon" class="h-6 w-6" />
            </div>
          </div>

          <div class="mt-5 flex items-center justify-between gap-3">
            <p class="text-xs font-semibold leading-5 text-neutral-500">
              {{ stat.sub }}
            </p>

            <span
              class="rounded-full px-2.5 py-1 text-xs font-black"
              :class="stat.tone === 'pro'
                ? 'bg-neutral-900 text-white'
                : stat.tone === 'good'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'"
            >
              {{ stat.badge }}
            </span>
          </div>
        </article>
      </section>

      <!-- Main Grid -->
      <section class="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <!-- Feature Shortcuts -->
        <div class="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-xs font-black uppercase tracking-[0.16em] text-[var(--brand)]">
                Quick Access
              </p>
              <h2 class="mt-1 text-xl font-black text-neutral-950">
                {{ profile.quickAccessTitle }}
              </h2>
            </div>

            <NuxtLink
              :to="profile.manageHref"
              class="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-4 py-2.5 text-sm font-black text-white transition hover:bg-neutral-800"
            >
              <Icon icon="solar:settings-bold-duotone" class="h-5 w-5" />
              Kelola
            </NuxtLink>
          </div>

          <div class="mt-5 grid gap-3 sm:grid-cols-2">
            <NuxtLink
              v-for="item in featureCards"
              :key="item.href"
              :to="item.href"
              class="group relative overflow-hidden rounded-[1.75rem] border p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              :class="item.pro
                ? 'border-neutral-200 bg-neutral-50'
                : 'border-neutral-200 bg-white hover:border-[var(--brand)]'"
            >
              <div class="flex items-start justify-between gap-4">
                <div
                  class="grid h-12 w-12 place-items-center rounded-2xl"
                  :class="item.pro
                    ? 'bg-neutral-900 text-white'
                    : 'bg-[var(--brand-soft)] text-[var(--brand)]'"
                >
                  <Icon :icon="item.icon" class="h-6 w-6" />
                </div>

                <span
                  v-if="item.pro"
                  class="rounded-full bg-neutral-900 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white"
                >
                  Pro
                </span>
              </div>

              <h3 class="mt-4 text-base font-black text-neutral-950">
                {{ item.title }}
              </h3>

              <p class="mt-2 text-sm font-medium leading-6 text-neutral-500">
                {{ item.description }}
              </p>

              <div class="mt-4 inline-flex items-center gap-2 text-sm font-black text-[var(--brand)]">
                Buka menu
                <Icon icon="solar:arrow-right-linear" class="h-4 w-4 transition group-hover:translate-x-0.5" />
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Status / Package Card -->
        <aside class="space-y-5">
          <div class="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs font-black uppercase tracking-[0.16em] text-[var(--brand)]">
                  Paket Aktif
                </p>
                <h2 class="mt-1 text-xl font-black text-neutral-950">
                  {{ profile.packageName }}
                </h2>
              </div>

              <div class="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
                <Icon icon="solar:star-fall-bold-duotone" class="h-6 w-6" />
              </div>
            </div>

            <p class="mt-4 text-sm font-medium leading-7 text-neutral-500">
              {{ profile.packageDescription }}
            </p>

            <div class="mt-5 space-y-3">
              <div
                v-for="item in packageItems"
                :key="item.label"
                class="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3"
              >
                <Icon
                  :icon="item.active ? 'solar:check-circle-bold-duotone' : 'solar:lock-keyhole-bold-duotone'"
                  class="h-5 w-5"
                  :class="item.active ? 'text-emerald-600' : 'text-neutral-400'"
                />

                <span class="flex-1 text-sm font-bold text-neutral-700">
                  {{ item.label }}
                </span>

                <span
                  v-if="item.pro"
                  class="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-black text-white"
                >
                  PRO
                </span>
              </div>
            </div>
          </div>

          <div class="rounded-[2rem] border border-neutral-200 bg-neutral-950 p-5 text-white shadow-sm sm:p-6">
            <div class="flex items-start gap-4">
              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10">
                <Icon :icon="profile.ctaIcon" class="h-6 w-6" />
              </div>

              <div>
                <h2 class="text-lg font-black">
                  {{ profile.ctaTitle }}
                </h2>
                <p class="mt-2 text-sm font-medium leading-6 text-white/65">
                  {{ profile.ctaDescription }}
                </p>
              </div>
            </div>

            <NuxtLink
              :to="profile.ctaHref"
              class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-neutral-950 transition hover:bg-neutral-100"
            >
              {{ profile.ctaLabel }}
              <Icon icon="solar:arrow-right-linear" class="h-5 w-5" />
            </NuxtLink>
          </div>
        </aside>
      </section>

      <!-- Bottom Grid -->
      <section class="grid gap-5 xl:grid-cols-3 grid-cols-1">
        <!-- Activity -->
        <div class="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-xs font-black uppercase tracking-[0.16em] text-[var(--brand)]">
                Aktivitas
              </p>
              <h2 class="mt-1 text-xl font-black text-neutral-950">
                Aktivitas Terbaru
              </h2>
            </div>

            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-black text-neutral-600 transition hover:bg-neutral-50"
            >
              <Icon icon="solar:refresh-bold-duotone" class="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div class="mt-5 space-y-3">
            <div
              v-for="item in recentActivities"
              :key="item.title"
              class="flex flex-wrap items-start gap-4 rounded-[1.5rem] border border-neutral-200 bg-neutral-50 p-4"
            >
              <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[var(--brand)]">
                <Icon :icon="item.icon" class="h-5 w-5" />
              </div>

              <div class="min-w-0 flex-1">
                <p class="text-sm font-black text-neutral-950">
                  {{ item.title }}
                </p>
                <p class="mt-1 text-sm font-medium leading-6 text-neutral-500">
                  {{ item.description }}
                </p>
              </div>

              <span class="shrink-0 text-xs font-bold text-neutral-400">
                {{ item.time }}
              </span>
            </div>
          </div>
        </div>

        <!-- Recommended Next Steps -->
        <div class="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
          <p class="text-xs font-black uppercase tracking-[0.16em] text-[var(--brand)]">
            Next Step
          </p>
          <h2 class="mt-1 text-xl font-black text-neutral-950">
            Rekomendasi
          </h2>

          <div class="mt-5 space-y-3">
            <NuxtLink
              v-for="item in recommendations"
              :key="item.href"
              :to="item.href"
              class="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-300 hover:bg-neutral-50"
            >
              <div class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-neutral-100 text-neutral-600">
                <Icon :icon="item.icon" class="h-5 w-5" />
              </div>

              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-black text-neutral-950">
                  {{ item.title }}
                </p>
                <p class="truncate text-xs font-semibold text-neutral-500">
                  {{ item.description }}
                </p>
              </div>

              <Icon icon="solar:alt-arrow-right-linear" class="h-5 w-5 text-neutral-400" />
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'
import {
  useHead,
  useRuntimeConfig,
  useSeoMeta
} from 'nuxt/app'
import { useTenantContext } from '~/composables/useTenantContext'

definePageMeta({
  layout: 'app',
  layoutProps: {
    title: 'Dashboard'
  }
})

type ActionItem = {
  label: string
  href: string
  icon: string
}

type StatItem = {
  label: string
  value: string
  sub: string
  badge: string
  icon: string
  tone: 'good' | 'warning' | 'pro'
}

type FeatureCard = {
  title: string
  description: string
  href: string
  icon: string
  pro?: boolean
}

type PackageItem = {
  label: string
  active: boolean
  pro?: boolean
}

type ActivityItem = {
  title: string
  description: string
  icon: string
  time: string
}

type RecommendationItem = {
  title: string
  description: string
  href: string
  icon: string
}

const config = useRuntimeConfig()

const logoError = ref(false)

const {
  tenantKey,
  tenantHost,
  isMartopuro,
  isObayan,
  isSencra,
  isRailway
} = useTenantContext()

const todayLabel = computed(() => {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date())
})

const profile = computed(() => {
  if (isMartopuro.value) {
    const logo = String(
      config.public.appLogo ||
      config.public.logo ||
      '/assets/images/logo-martopuro.png'
    )

    return {
      name: String(config.public.clientDisplayName || 'Desa Martopuro'),
      title: 'Dashboard Platform Desa Martopuro',
      badge: 'Village Platform',
      icon: 'solar:buildings-3-bold-duotone',
      logo,
      description:
        'Kelola website desa, berita informasi, transparansi keuangan, dokumen Letter C, dan pengajuan surat online dalam satu dashboard yang rapi dan mudah digunakan.',
      quickAccessTitle: 'Layanan Digital Desa',
      manageHref: '/app/web',
      packageName: 'Paket Website Desa Basic',
      packageDescription:
        'Paket aktif saat ini fokus pada website informasi desa. Fitur keuangan, dokumen Letter C, dan pengajuan surat online tersedia sebagai modul Pro.',
      ctaIcon: 'solar:rocket-bold-duotone',
      ctaTitle: 'Upgrade ke Platform Desa Pro',
      ctaDescription:
        'Aktifkan fitur administrasi desa seperti transparansi keuangan, arsip Letter C, dan pengajuan surat online untuk pelayanan warga yang lebih cepat.',
      ctaLabel: 'Lihat Modul Pro',
      ctaHref: '/app/#finance',
      brand: '#2563eb',
      brandDark: '#1d4ed8',
      brandSoft: '#eff6ff',
      actions: [
        {
          label: 'Kelola Website',
          href: '/app/web',
          icon: 'solar:window-frame-bold-duotone'
        },
        {
          label: 'Tambah Berita',
          href: '/app/news',
          icon: 'solar:add-circle-bold-duotone'
        }
      ] as ActionItem[]
    }
  }

  if (isSencra.value) {
    const logo = String(
      config.public.appLogo ||
      config.public.logo ||
      '/logo.png'
    )

    return {
      name: String(config.public.clientDisplayName || 'Sencra'),
      title: 'Dashboard Sencra Platform',
      badge: 'Creative Platform',
      icon: 'solar:case-round-bold-duotone',
      logo,
      description:
        'Kelola website, produk digital, tenant, konten, dan layanan kreatif Sencra dalam satu dashboard yang modular dan scalable.',
      quickAccessTitle: 'Ekosistem Produk Sencra',
      manageHref: '/app/web',
      packageName: 'Sencra Core Platform',
      packageDescription:
        'Dashboard ini membantu mengelola modul website, konten, tenant, dan layanan digital Sencra secara bertahap.',
      ctaIcon: 'solar:stars-bold-duotone',
      ctaTitle: 'Bangun Sistem Lebih Modular',
      ctaDescription:
        'Kembangkan fitur berdasarkan kebutuhan tenant, produk, layanan, konten, dan operasional bisnis.',
      ctaLabel: 'Kelola Website',
      ctaHref: '/app/web',
      brand: '#0f172a',
      brandDark: '#020617',
      brandSoft: '#f1f5f9',
      actions: [
        {
          label: 'Kelola Website',
          href: '/app/web',
          icon: 'solar:window-frame-bold-duotone'
        },
        {
          label: 'Tenant Settings',
          href: '/app/setting',
          icon: 'solar:settings-bold-duotone'
        }
      ] as ActionItem[]
    }
  }

  const logo = String(
    config.public.appLogo ||
    config.public.logo ||
    '/logo.png'
  )

  return {
    name: String(config.public.clientDisplayName || 'Obayan'),
    title: 'Dashboard Obayan Platform',
    badge: 'Education Platform',
    icon: 'solar:widget-5-bold-duotone',
    logo,
    description:
      'Pantau tenant, produk, modul website, SIAKAD, CBT, dan kebutuhan operasional platform Obayan dari satu dashboard yang clean dan scalable.',
    quickAccessTitle: 'Ekosistem Produk Obayan',
    manageHref: '/app/web',
    packageName: 'Obayan Core Platform',
    packageDescription:
      'Dashboard ini membantu mengelola modul website, tenant, konten, dan produk digital Obayan agar lebih mudah dikembangkan secara bertahap.',
    ctaIcon: 'solar:stars-bold-duotone',
    ctaTitle: 'Bangun Produk Lebih Modular',
    ctaDescription:
      'Pisahkan fitur berdasarkan modul tenant, website, SIAKAD, CBT, dan pembayaran agar pengembangan lebih scalable.',
    ctaLabel: 'Kelola Website',
    ctaHref: '/app/web',
    brand: '#58cc02',
    brandDark: '#46a302',
    brandSoft: '#f0fdf4',
    actions: [
      {
        label: 'Kelola Website',
        href: '/app/web',
        icon: 'solar:window-frame-bold-duotone'
      },
      {
        label: 'Tambah Tenant',
        href: '/app/setting',
        icon: 'solar:add-circle-bold-duotone'
      }
    ] as ActionItem[]
  }
})

const themeVars = computed<Record<string, string>>(() => ({
  '--brand': profile.value.brand,
  '--brand-dark': profile.value.brandDark,
  '--brand-soft': profile.value.brandSoft
}))

const dashboardStats = computed<StatItem[]>(() => {
  if (isMartopuro.value) {
    return [
      {
        label: 'Halaman Website',
        value: '8',
        sub: 'Profil, berita, layanan, dan informasi desa',
        badge: 'Aktif',
        icon: 'solar:window-frame-bold-duotone',
        tone: 'good'
      },
      {
        label: 'Berita Informasi',
        value: '24',
        sub: 'Konten publikasi dan update desa',
        badge: 'CMS',
        icon: 'solar:document-text-bold-duotone',
        tone: 'good'
      },
      {
        label: 'Keuangan Desa',
        value: 'PRO',
        sub: 'APBDes, pemasukan, pengeluaran, laporan',
        badge: 'Locked',
        icon: 'solar:wallet-money-bold-duotone',
        tone: 'pro'
      },
      {
        label: 'Layanan Surat',
        value: 'PRO',
        sub: 'Pengajuan surat online untuk warga',
        badge: 'Locked',
        icon: 'solar:letter-unread-bold-duotone',
        tone: 'pro'
      }
    ]
  }

  return [
    {
      label: 'Tenant Aktif',
      value: '3',
      sub: 'Client aktif dalam ekosistem Obayan',
      badge: 'Live',
      icon: 'solar:buildings-3-bold-duotone',
      tone: 'good'
    },
    {
      label: 'Modul Produk',
      value: '5',
      sub: 'Website, SIAKAD, CBT, payment, RFID',
      badge: 'Core',
      icon: 'solar:widget-5-bold-duotone',
      tone: 'good'
    },
    {
      label: 'CMS Website',
      value: 'Ready',
      sub: 'Hero, berita, halaman, dan SEO',
      badge: 'CMS',
      icon: 'solar:window-frame-bold-duotone',
      tone: 'good'
    },
    {
      label: 'Billing',
      value: 'Soon',
      sub: 'Langganan, invoice, dan pembayaran tenant',
      badge: 'Roadmap',
      icon: 'solar:card-2-bold-duotone',
      tone: 'warning'
    }
  ]
})

const featureCards = computed<FeatureCard[]>(() => {
  if (isMartopuro.value) {
    return [
      {
        title: 'Home',
        href: '/app',
        icon: 'solar:home-2-bold-duotone',
        description: 'Ringkasan dashboard, status website desa, dan aktivitas terbaru.'
      },
      {
        title: 'Berita Informasi',
        href: '/app/news',
        icon: 'solar:document-text-bold-duotone',
        description: 'Kelola berita, agenda, pengumuman, dan informasi publik Desa Martopuro.'
      },
      {
        title: 'Keuangan',
        href: '/app/#finance',
        icon: 'solar:wallet-money-bold-duotone',
        description: 'Modul Pro untuk transparansi APBDes, pemasukan, pengeluaran, dan laporan keuangan.',
        pro: true
      },
      {
        title: 'Dokumen Letter C',
        href: '/app/#letter-c',
        icon: 'solar:folder-with-files-bold-duotone',
        description: 'Modul Pro untuk arsip Letter C, data tanah, riwayat kepemilikan, dan dokumen pertanahan.',
        pro: true
      },
      {
        title: 'Pengajuan Surat Online',
        href: '/app/#letters',
        icon: 'solar:letter-unread-bold-duotone',
        description: 'Modul Pro untuk pengajuan surat warga, verifikasi admin, dan riwayat pelayanan.',
        pro: true
      },
      {
        title: 'Website Desa',
        href: '/app/web',
        icon: 'solar:window-frame-bold-duotone',
        description: 'Atur tampilan landing page, profil desa, hero section, SEO, dan konten website.'
      }
    ]
  }

  return [
    {
      title: 'Website CMS',
      href: '/app/web',
      icon: 'solar:window-frame-bold-duotone',
      description: 'Kelola landing page, hero, berita, halaman, SEO, dan konten tenant.'
    },
    {
      title: 'Tenant Settings',
      href: '/app/setting',
      icon: 'solar:settings-bold-duotone',
      description: 'Atur tenant, branding, logo, domain, dan preferensi platform.'
    },
    {
      title: 'Berita Informasi',
      href: '/app/news',
      icon: 'solar:document-text-bold-duotone',
      description: 'Kelola konten publikasi untuk website tenant.'
    },
    {
      title: 'Subscription',
      href: '/app/billing',
      icon: 'solar:card-2-bold-duotone',
      description: 'Roadmap untuk pengelolaan invoice, subscription, dan pembayaran tenant.',
      pro: true
    }
  ]
})

const packageItems = computed<PackageItem[]>(() => {
  if (isMartopuro.value) {
    return [
      {
        label: 'Website informasi desa',
        active: true
      },
      {
        label: 'Manajemen berita informasi',
        active: true
      },
      {
        label: 'Keuangan desa',
        active: false,
        pro: true
      },
      {
        label: 'Dokumen Letter C',
        active: false,
        pro: true
      },
      {
        label: 'Pengajuan surat online',
        active: false,
        pro: true
      }
    ]
  }

  return [
    {
      label: 'Website CMS',
      active: true
    },
    {
      label: 'Tenant branding',
      active: true
    },
    {
      label: 'SIAKAD',
      active: false,
      pro: true
    },
    {
      label: 'CBT Exam',
      active: false,
      pro: true
    },
    {
      label: 'Billing tenant',
      active: false,
      pro: true
    }
  ]
})

const recentActivities = computed<ActivityItem[]>(() => {
  if (isMartopuro.value) {
    return [
      {
        title: 'Website Desa Martopuro aktif',
        description: 'Dashboard siap digunakan untuk mengelola konten dan informasi desa.',
        icon: 'solar:check-circle-bold-duotone',
        time: 'Hari ini'
      },
      {
        title: 'Modul berita informasi tersedia',
        description: 'Admin dapat mulai menambahkan berita, agenda, dan pengumuman desa.',
        icon: 'solar:document-text-bold-duotone',
        time: 'Terbaru'
      },
      {
        title: 'Modul Pro siap dikembangkan',
        description: 'Keuangan, Letter C, dan pengajuan surat online dapat diaktifkan sebagai paket lanjutan.',
        icon: 'solar:lock-keyhole-bold-duotone',
        time: 'Roadmap'
      }
    ]
  }

  return [
    {
      title: 'Dashboard Obayan aktif',
      description: 'Workspace siap digunakan untuk mengelola konten dan tenant.',
      icon: 'solar:check-circle-bold-duotone',
      time: 'Hari ini'
    },
    {
      title: 'CMS website tersedia',
      description: 'Admin dapat mengelola halaman website dan konten tenant.',
      icon: 'solar:window-frame-bold-duotone',
      time: 'Terbaru'
    },
    {
      title: 'Modul produk bisa dibuat bertahap',
      description: 'SIAKAD, CBT, payment, dan RFID dapat dipisahkan sebagai modul lanjutan.',
      icon: 'solar:widget-5-bold-duotone',
      time: 'Roadmap'
    }
  ]
})

const recommendations = computed<RecommendationItem[]>(() => {
  if (isMartopuro.value) {
    return [
      {
        title: 'Lengkapi profil desa',
        description: 'Identitas, kontak, dan informasi pemerintah desa',
        href: '/app/profile',
        icon: 'solar:buildings-3-bold-duotone'
      },
      {
        title: 'Update hero website',
        description: 'Perbaiki tampilan awal website desa',
        href: '/app/web',
        icon: 'solar:gallery-wide-bold-duotone'
      },
      {
        title: 'Tambah berita pertama',
        description: 'Publikasikan informasi terbaru desa',
        href: '/app/news',
        icon: 'solar:add-circle-bold-duotone'
      }
    ]
  }

  return [
    {
      title: 'Atur branding tenant',
      description: 'Logo, warna, domain, dan nama aplikasi',
      href: '/app/setting',
      icon: 'solar:palette-bold-duotone'
    },
    {
      title: 'Kelola halaman website',
      description: 'Hero, product section, CTA, dan SEO',
      href: '/app/web',
      icon: 'solar:window-frame-bold-duotone'
    },
    {
      title: 'Tambah konten berita',
      description: 'Publikasi untuk website tenant',
      href: '/app/news',
      icon: 'solar:document-add-bold-duotone'
    }
  ]
})

useSeoMeta({
  title: () => `${profile.value.title} · ${profile.value.name}`,
  description: () => profile.value.description,
  ogTitle: () => `${profile.value.title} · ${profile.value.name}`,
  ogDescription: () => profile.value.description,
  robots: 'noindex, nofollow',
  themeColor: () => profile.value.brand
})

useHead(() => ({
  htmlAttrs: {
    lang: 'id'
  },
  meta: [
    {
      name: 'theme-color',
      content: profile.value.brand
    }
  ]
}))
</script>