<template>
  <section
    id="arsades-hero"
    aria-label="ARSADES Platform Desa Digital"
    class="relative isolate min-h-screen overflow-hidden bg-slate-50 text-slate-950"
  >
    <!-- Background -->

    <div class="mx-auto grid min-h-screen max-w-7xl items-center gap-14 px-4 py-28 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
      <!-- LEFT -->
      <div class="relative z-10">
        <div class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-xs font-black text-blue-700 shadow-sm backdrop-blur">
          <ClientOnly>
            <Icon icon="lucide:landmark" class="h-4 w-4" />
          </ClientOnly>
          {{ c.eyebrow }}
        </div>

        <h1 class="mt-6 max-w-4xl text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
          {{ c.titleStart }}
          <span class="bg-linear-to-r from-blue-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
            {{ c.titleHighlight }}
          </span>
          {{ c.titleEnd }}
        </h1>

        <p class="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
          {{ c.subtitle }}
        </p>

        <!-- CTA -->
        <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            :href="c.primaryCta.href"
            class="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-black text-white shadow-xl shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            {{ c.primaryCta.label }}
            <ClientOnly>
              <Icon icon="lucide:play" class="h-4 w-4 transition group-hover:translate-x-0.5" />
            </ClientOnly>
          </a>

          <a
            :href="c.secondaryCta.href"
            class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-5 text-sm font-black text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            {{ c.secondaryCta.label }}
            <ClientOnly>
              <Icon icon="lucide:send" class="h-4 w-4" />
            </ClientOnly>
          </a>
        </div>
      </div>

      <!-- RIGHT MOCKUP -->
      <div class="relative z-10">
        <div class="absolute -right-4 top-10 z-30 hidden rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-black text-blue-700 shadow-xl shadow-slate-900/10 backdrop-blur sm:inline-flex">
          {{ c.floatingBadge }}
        </div>

        <div class="relative mx-auto max-w-2xl">
          <div class="absolute inset-8 rounded-full bg-blue-200/50 blur-3xl"></div>

          <!-- Main dashboard card -->
          <div class="relative overflow-hidden rounded-4xl border border-white bg-white/90 p-3 shadow-[0_35px_100px_-50px_rgba(15,23,42,0.75)] backdrop-blur-xl sm:p-4 lg:-rotate-1">
            <!-- Browser top -->
            <div class="flex items-center justify-between rounded-3xl border border-slate-100 bg-slate-50 px-4 py-3">
              <div class="flex items-center gap-2">
                <span class="h-3 w-3 rounded-full bg-red-400"></span>
                <span class="h-3 w-3 rounded-full bg-amber-400"></span>
                <span class="h-3 w-3 rounded-full bg-emerald-400"></span>
              </div>

              <p class="text-xs font-black text-slate-400">
                Dashboard ARSADES
              </p>
            </div>

            <!-- Dashboard content -->
            <div class="mt-4 grid gap-4">
              <div class="grid gap-4 sm:grid-cols-2">
                <article
                  v-for="metric in c.dashboardMetrics"
                  :key="metric.label"
                  class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <p class="text-xs font-bold text-slate-400">
                        {{ metric.label }}
                      </p>
                      <p class="mt-2 text-2xl font-black text-slate-950">
                        {{ metric.value }}
                      </p>
                    </div>

                    <div class="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                      <ClientOnly>
                        <Icon :icon="metric.icon" class="h-5 w-5" />
                      </ClientOnly>
                    </div>
                  </div>

                  <div class="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      class="h-full rounded-full bg-linear-to-r from-blue-600 to-cyan-400"
                      :style="{ width: metric.progress }"
                    ></div>
                  </div>
                </article>
              </div>

              <article class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-black text-slate-950">
                      APBDes Transparan
                    </p>
                    <p class="mt-1 text-xs font-semibold text-slate-400">
                      Ringkasan realisasi tahun berjalan
                    </p>
                  </div>

                  <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                    {{ c.year }}
                  </span>
                </div>

                <div class="mt-5 grid gap-4 sm:grid-cols-3">
                  <div
                    v-for="budget in c.budgetCards"
                    :key="budget.label"
                    class="rounded-[1.35rem] bg-slate-50 p-4"
                  >
                    <div class="mx-auto grid h-20 w-20 place-items-center rounded-full border-10 border-blue-100 bg-white">
                      <span class="text-sm font-black text-blue-700">
                        {{ budget.percent }}
                      </span>
                    </div>
                    <p class="mt-3 text-center text-xs font-black text-slate-700">
                      {{ budget.label }}
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <!-- Floating application status -->
          <div class="absolute -bottom-10 right-2 z-30 w-[280px] rounded-3xl border border-white bg-white/95 p-4 shadow-2xl shadow-slate-900/12 backdrop-blur-xl sm:right-0 sm:w-[310px] lg:-right-8">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm font-black text-slate-950">
                  Status Pengajuan
                </p>
                <p class="mt-1 text-xs font-semibold text-slate-400">
                  Surat warga hari ini
                </p>
              </div>

              <div class="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                <ClientOnly>
                  <Icon icon="lucide:clipboard-check" class="h-5 w-5" />
                </ClientOnly>
              </div>
            </div>

            <div class="mt-4 space-y-2">
              <div
                v-for="item in c.statusItems"
                :key="item.label"
                class="flex items-center justify-between gap-3"
              >
                <span class="text-sm font-semibold text-slate-600">
                  {{ item.label }}
                </span>

                <span
                  class="rounded-full px-2.5 py-1 text-[10px] font-black"
                  :class="statusClass(item.status)"
                >
                  {{ item.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Floating verified card -->
          <div class="absolute -left-4 top-16 z-30 hidden w-[230px] rounded-3xl border border-white bg-white/95 p-4 shadow-2xl shadow-slate-900/12 backdrop-blur-xl xl:block">
            <div class="flex items-center gap-3">
              <div class="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                <ClientOnly>
                  <Icon icon="lucide:shield-check" class="h-5 w-5" />
                </ClientOnly>
              </div>

              <div>
                <p class="text-sm font-black text-slate-950">
                  Aman & Terintegrasi
                </p>
                <p class="mt-1 text-xs leading-5 text-slate-500">
                  Data layanan desa tersimpan rapi.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile spacing for floating card -->
        <div class="h-12 lg:h-0"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'

type FeatureKey = 'surat' | 'aduan' | 'apbdes' | 'umkm' | 'agenda'

type FeatureItem = {
  key: FeatureKey
  label: string
  icon: string
  title: string
  description: string
}

type StatItem = {
  label: string
  value: string
}

type CtaItem = {
  label: string
  href: string
}

type DashboardMetric = {
  label: string
  value: string
  icon: string
  progress: string
}

type BudgetCard = {
  label: string
  percent: string
}

type StatusItem = {
  label: string
  status: 'Selesai' | 'Proses' | 'Verifikasi'
}

type HeroArsadesProps = {
  eyebrow?: string
  titleStart?: string
  titleHighlight?: string
  titleEnd?: string
  subtitle?: string
  floatingBadge?: string
  searchPlaceholder?: string
  year?: string
  primaryCta?: CtaItem
  secondaryCta?: CtaItem
  features?: FeatureItem[]
  stats?: StatItem[]
  dashboardMetrics?: DashboardMetric[]
  budgetCards?: BudgetCard[]
  statusItems?: StatusItem[]
}

const props = defineProps<HeroArsadesProps>()

const activeFeature = ref<any>('surat')

const defaults = {
  eyebrow: 'ARSADES · Layanan Platform Desa Modern',
  titleStart: 'Digitalisasi ',
  titleHighlight: 'layanan desa',
  titleEnd: ', sederhana, cepat, dan transparan.',
  subtitle:
    'Satu portal untuk surat online, aduan warga, APBDes terbuka, UMKM dan pasar desa, agenda, serta statistik kunjungan — terintegrasi, aman, dan mudah dipakai semua perangkat.',
  floatingBadge: 'Platform Desa Siap Pakai',
  searchPlaceholder: 'Cari layanan, misalnya: surat domisili...',
  year: '2026',
  primaryCta: {
    label: 'Coba Demo',
    href: '#demo'
  },
  secondaryCta: {
    label: 'Hubungi Kami',
    href: '#contact'
  },
  features: [
    {
      key: 'surat',
      label: 'Surat Online',
      icon: 'lucide:file-check-2',
      title: 'Pengajuan Surat Online',
      description:
        'Warga dapat mengajukan surat domisili, surat usaha, pengantar, dan kebutuhan administrasi lainnya tanpa antre panjang.'
    },
    {
      key: 'aduan',
      label: 'Aduan Warga',
      icon: 'lucide:message-square-warning',
      title: 'Aduan Warga Terpantau',
      description:
        'Aduan warga dapat masuk ke dashboard desa, diberi status, dan ditindaklanjuti dengan alur yang lebih transparan.'
    },
    {
      key: 'apbdes',
      label: 'APBDes Terbuka',
      icon: 'lucide:landmark',
      title: 'Transparansi APBDes',
      description:
        'Ringkasan anggaran dan realisasi dapat ditampilkan secara informatif agar masyarakat lebih mudah memahami penggunaan dana desa.'
    },
    {
      key: 'umkm',
      label: 'UMKM & Pasar',
      icon: 'lucide:store',
      title: 'Direktori UMKM Desa',
      description:
        'Produk lokal, pelaku usaha, katalog UMKM, dan pasar desa dapat dipromosikan dalam satu halaman digital yang rapi.'
    },
    {
      key: 'agenda',
      label: 'Agenda',
      icon: 'lucide:calendar-days',
      title: 'Agenda Desa Terjadwal',
      description:
        'Kegiatan desa, pengumuman, pelatihan, dan event warga dapat diinformasikan secara cepat melalui portal resmi desa.'
    }
  ],
  stats: [
    {
      label: 'Desa Aktif',
      value: '128'
    },
    {
      label: 'Uptime',
      value: '99.98%'
    },
    {
      label: 'Permintaan / Menit',
      value: '320'
    }
  ],
  dashboardMetrics: [
    {
      label: 'Antrean Surat',
      value: '12',
      icon: 'lucide:file-clock',
      progress: '68%'
    },
    {
      label: 'Aduan Masuk',
      value: '5',
      icon: 'lucide:message-circle-warning',
      progress: '52%'
    }
  ],
  budgetCards: [
    {
      label: 'Pendapatan',
      percent: '72%'
    },
    {
      label: 'Belanja',
      percent: '48%'
    },
    {
      label: 'Pembiayaan',
      percent: '30%'
    }
  ],
  statusItems: [
    {
      label: 'Surat Domisili',
      status: 'Selesai'
    },
    {
      label: 'Surat Usaha',
      status: 'Proses'
    },
    {
      label: 'Pengantar SKCK',
      status: 'Verifikasi'
    }
  ]
}

const c = computed(() => {
  return {
    eyebrow: props.eyebrow || defaults.eyebrow,
    titleStart: props.titleStart || defaults.titleStart,
    titleHighlight: props.titleHighlight || defaults.titleHighlight,
    titleEnd: props.titleEnd || defaults.titleEnd,
    subtitle: props.subtitle || defaults.subtitle,
    floatingBadge: props.floatingBadge || defaults.floatingBadge,
    searchPlaceholder: props.searchPlaceholder || defaults.searchPlaceholder,
    year: props.year || defaults.year,
    primaryCta: {
      ...defaults.primaryCta,
      ...(props.primaryCta || {})
    },
    secondaryCta: {
      ...defaults.secondaryCta,
      ...(props.secondaryCta || {})
    },
    features: props.features?.length ? props.features : defaults.features,
    stats: props.stats?.length ? props.stats : defaults.stats,
    dashboardMetrics: props.dashboardMetrics?.length
      ? props.dashboardMetrics
      : defaults.dashboardMetrics,
    budgetCards: props.budgetCards?.length ? props.budgetCards : defaults.budgetCards,
    statusItems: props.statusItems?.length ? props.statusItems : defaults.statusItems
  }
})

const activeFeatureData = computed(() => {
  return c.value.features.find((item) => item.key === activeFeature.value) || c.value.features[0]
})

function statusClass(status: any) {
  if (status === 'Selesai') {
    return 'bg-emerald-50 text-emerald-700'
  }

  if (status === 'Proses') {
    return 'bg-amber-50 text-amber-700'
  }

  return 'bg-cyan-50 text-cyan-700'
}
</script>

<style scoped>
.bg-size-\[44px_44px\] {
  background-size: 44px 44px;
}
</style>