<template>
  <section
    id="statistik-desa"
    aria-label="Statistik Desa dan APBDes"
    class="relative isolate overflow-hidden bg-slate-50 py-20 text-slate-950 sm:py-24"
  >
    <!-- Background -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-[linear-linear(to_right,#e2e8f0_1px,transparent_1px),linear-linear(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[44px_44px] opacity-40"></div>
      <div class="absolute -right-36 bottom-0 h-[520px] w-[520px] rounded-full bg-blue-200/50 blur-3xl"></div>
    </div>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
            <ClientOnly>
              <Icon icon="lucide:bar-chart-3" class="h-4 w-4" />
            </ClientOnly>
            {{ c.eyebrow }}
          </div>

          <h2 class="mt-4 max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            {{ c.title }}
          </h2>

          <p class="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            {{ c.subtitle }}
          </p>
        </div>

        <a
          :href="c.ctaHref"
          class="group inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          {{ c.ctaLabel }}
          <ClientOnly>
            <Icon icon="lucide:arrow-up-right" class="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </ClientOnly>
        </a>
      </div>

      <div class="grid gap-5 lg:grid-cols-[370px_minmax(0,1fr)]">
        <!-- Left Column -->
        <div class="space-y-5">
          <!-- Visitor Card -->
          <article class="overflow-hidden rounded-4xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur-xl">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-3">
                <div class="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                  <ClientOnly>
                    <Icon icon="lucide:activity" class="h-5 w-5" />
                  </ClientOnly>
                </div>

                <div>
                  <h3 class="text-base font-black text-slate-950">
                    Statistik Pengunjung
                  </h3>
                  <p class="mt-1 text-xs font-semibold text-slate-400">
                    Dipantau secara realtime
                  </p>
                </div>
              </div>

              <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                realtime
              </span>
            </div>

            <div class="mt-5 space-y-3">
              <div
                v-for="item in c.visitors"
                :key="item.label"
                class="flex items-center justify-between gap-3"
              >
                <span class="text-sm font-semibold text-slate-500">
                  {{ item.label }}
                </span>

                <div class="flex items-center gap-2">
                  <span class="text-sm font-black text-slate-950">
                    {{ item.value }}
                  </span>

                  <span
                    v-if="item.badge"
                    class="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700"
                  >
                    {{ item.badge }}
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-5">
              <div class="mb-2 flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Perbandingan hari ini</span>
                <span>{{ c.visitorGrowth }}</span>
              </div>

              <div class="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  class="h-full rounded-full bg-linear-to-r from-blue-600 to-cyan-400"
                  :style="{ width: c.visitorProgress }"
                ></div>
              </div>
            </div>
          </article>

          <!-- Aparatur Card -->
          <article class="overflow-hidden rounded-4xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur-xl">
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <div class="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                  <ClientOnly>
                    <Icon icon="lucide:users-round" class="h-5 w-5" />
                  </ClientOnly>
                </div>

                <div>
                  <h3 class="text-base font-black text-slate-950">
                    Aparatur Desa
                  </h3>
                  <p class="mt-1 text-xs font-semibold text-slate-400">
                    Profil perangkat aktif
                  </p>
                </div>
              </div>

              <a
                :href="c.officialsHref"
                class="text-xs font-black text-slate-400 transition hover:text-blue-600"
              >
                Lihat semua
              </a>
            </div>

            <div v-if="activeOfficial" class="mt-5 grid gap-4 sm:grid-cols-[130px_minmax(0,1fr)] lg:grid-cols-1 xl:grid-cols-[130px_minmax(0,1fr)]">
              <div class="relative overflow-hidden rounded-3xl bg-slate-100">
                <img
                  :src="activeOfficial.image"
                  :alt="activeOfficial.name"
                  class="h-48 w-full object-cover sm:h-44 lg:h-52 xl:h-44"
                />

                <div class="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950/70 to-transparent p-3">
                  <span class="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black text-blue-700">
                    {{ activeOfficial.status }}
                  </span>
                </div>
              </div>

              <div class="min-w-0">
                <p class="text-lg font-black text-slate-950">
                  {{ activeOfficial.name }}
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-500">
                  {{ activeOfficial.role }}
                </p>

                <p class="mt-4 line-clamp-3 text-sm leading-7 text-slate-500">
                  {{ activeOfficial.description }}
                </p>

                <div class="mt-5 flex items-center gap-2">
                  <button
                    type="button"
                    class="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    @click="prevOfficial"
                  >
                    <ClientOnly>
                      <Icon icon="lucide:chevron-left" class="h-4 w-4" />
                    </ClientOnly>
                  </button>

                  <button
                    type="button"
                    class="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    @click="nextOfficial"
                  >
                    <ClientOnly>
                      <Icon icon="lucide:chevron-right" class="h-4 w-4" />
                    </ClientOnly>
                  </button>

                  <div class="ml-2 flex items-center gap-1">
                    <button
                      v-for="(_, index) in officials"
                      :key="index"
                      type="button"
                      class="h-2 rounded-full transition"
                      :class="officialIndex === index ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300 hover:bg-blue-300'"
                      @click="officialIndex = index"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- Right APBDes -->
        <article class="overflow-hidden rounded-4xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur-xl sm:p-6">
          <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div class="flex items-center gap-3">
              <div class="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                <ClientOnly>
                  <Icon icon="lucide:landmark" class="h-5 w-5" />
                </ClientOnly>
              </div>

              <div>
                <h3 class="text-base font-black text-slate-950">
                  {{ c.budgetTitle }}
                </h3>
                <p class="mt-1 text-xs font-semibold text-slate-400">
                  Realisasi dibandingkan anggaran
                </p>
              </div>
            </div>

            <div class="inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
              <button
                v-for="tab in tabs"
                :key="tab.key"
                type="button"
                class="rounded-xl px-3 py-2 text-xs font-black transition"
                :class="activeTab === tab.key
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-blue-700'"
                @click="activeTab = tab.key"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>

          <!-- Budget Summary -->
          <div class="mt-7 grid gap-4 md:grid-cols-3">
            <div
              v-for="item in c.budgetSummary"
              :key="item.label"
              class="rounded-3xl border border-slate-200 bg-slate-50 p-4"
            >
              <div class="flex items-center gap-4">
                <div class="relative grid h-24 w-24 shrink-0 place-items-center">
                  <svg class="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="10"
                      class="text-slate-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="10"
                      stroke-linecap="round"
                      class="text-blue-600"
                      :stroke-dasharray="circleDash"
                      :stroke-dashoffset="circleOffset(item.percent)"
                    />
                  </svg>

                  <div class="absolute text-center">
                    <p class="text-lg font-black text-slate-950">
                      {{ item.percent }}%
                    </p>
                    <p class="text-[10px] font-bold uppercase text-slate-400">
                      realisasi
                    </p>
                  </div>
                </div>

                <div class="min-w-0">
                  <p class="text-sm font-black text-slate-950">
                    {{ item.label }}
                  </p>
                  <p class="mt-1 text-xs leading-5 text-slate-500">
                    {{ item.realization }}
                  </p>
                  <p class="text-xs leading-5 text-slate-400">
                    dari {{ item.budget }}
                  </p>

                  <div class="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      class="h-full rounded-full bg-blue-600"
                      :style="{ width: `${Math.min(item.percent, 100)}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Budget Lists -->
          <div class="mt-7 grid gap-5 xl:grid-cols-2">
            <div v-if="activeTab === 'overview' || activeTab === 'income'">
              <div class="mb-3 flex items-center justify-between">
                <h4 class="text-sm font-black text-slate-950">
                  Pendapatan per Sumber
                </h4>
                <span class="text-xs font-bold text-blue-600">
                  {{ c.incomeItems.length }} sumber
                </span>
              </div>

              <div class="space-y-3">
                <BudgetItemCard
                  v-for="item in c.incomeItems"
                  :key="item.label"
                  :item="item"
                />
              </div>
            </div>

            <div v-if="activeTab === 'overview' || activeTab === 'expense'">
              <div class="mb-3 flex items-center justify-between">
                <h4 class="text-sm font-black text-slate-950">
                  Belanja per Bidang
                </h4>
                <span class="text-xs font-bold text-blue-600">
                  {{ c.expenseItems.length }} bidang
                </span>
              </div>

              <div class="space-y-3">
                <BudgetItemCard
                  v-for="item in c.expenseItems"
                  :key="item.label"
                  :item="item"
                />
              </div>
            </div>
          </div>

          <div class="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-xs leading-6 text-blue-700">
            <strong>Catatan:</strong>
            {{ c.note }}
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, ref } from 'vue'
import { Icon } from '@iconify/vue'

type VisitorItem = {
  label: string
  value: string
  badge?: string
}

type OfficialItem = {
  name: string
  role: string
  status: string
  image: string
  description: string
}

type BudgetSummaryItem = {
  label: string
  percent: number
  realization: string
  budget: string
}

type BudgetListItem = {
  label: string
  realization: string
  budget: string
  percent: number
}

type InfoHeroProps = {
  eyebrow?: string
  title?: string
  subtitle?: string
  ctaLabel?: string
  ctaHref?: string
  visitorGrowth?: string
  visitorProgress?: string
  visitors?: VisitorItem[]
  officialsHref?: string
  officials?: OfficialItem[]
  budgetTitle?: string
  budgetSummary?: BudgetSummaryItem[]
  incomeItems?: BudgetListItem[]
  expenseItems?: BudgetListItem[]
  note?: string
}

const props = defineProps<InfoHeroProps>()

const officialIndex = ref(0)
const activeTab = ref<'overview' | 'income' | 'expense'>('overview')

const tabs = [
  {
    key: 'overview',
    label: 'Ringkas'
  },
  {
    key: 'income',
    label: 'Pendapatan'
  },
  {
    key: 'expense',
    label: 'Belanja'
  }
] as const

const defaults = {
  eyebrow: 'Statistik Desa',
  title: 'Ringkasan Kinerja & APBDes 2026',
  subtitle:
    'Pantau statistik layanan, data aparatur, dan ringkasan APBDes secara ringkas, transparan, dan mudah dipahami masyarakat.',
  ctaLabel: 'Lihat APBDes Lengkap',
  ctaHref: '/apbdes',
  visitorGrowth: '+12.1%',
  visitorProgress: '72%',
  visitors: [
    {
      label: 'Hari ini',
      value: '37',
      badge: '+4'
    },
    {
      label: 'Kemarin',
      value: '33'
    },
    {
      label: 'Jumlah pengunjung',
      value: '6.141'
    }
  ],
  officialsHref: '/profile',
  officials: [
    {
      name: 'Rianto',
      role: 'Kepala Desa',
      status: 'Hadir',
      image: '/assets/images/kepala-desa.jpg',
      description:
        'Memimpin penyelenggaraan pemerintahan desa, pembangunan, pembinaan kemasyarakatan, dan pemberdayaan masyarakat.'
    },
    {
      name: 'Sekretariat Desa',
      role: 'Pelayanan Administrasi',
      status: 'Aktif',
      image: '/assets/images/aparatur-1.jpg',
      description:
        'Mendukung pengelolaan administrasi, pelayanan surat, arsip desa, dan koordinasi kegiatan pemerintahan.'
    },
    {
      name: 'Bendahara Desa',
      role: 'Keuangan Desa',
      status: 'Aktif',
      image: '/assets/images/aparatur-2.jpg',
      description:
        'Mengelola pencatatan keuangan desa, pelaporan, serta mendukung transparansi APBDes.'
    }
  ],
  budgetTitle: 'APBDes 2026',
  budgetSummary: [
    {
      label: 'Pendapatan',
      percent: 0,
      realization: 'Rp 0',
      budget: 'Rp 2.784.452.000'
    },
    {
      label: 'Belanja',
      percent: 0,
      realization: 'Rp 0',
      budget: 'Rp 2.822.918.070'
    },
    {
      label: 'Pembiayaan',
      percent: 0,
      realization: 'Rp 0',
      budget: 'Rp 38.466.070'
    }
  ],
  incomeItems: [
    {
      label: 'Lain-Lain PADesa',
      realization: 'Rp 0',
      budget: 'Rp 65.000.000',
      percent: 0
    },
    {
      label: 'Dana Desa',
      realization: 'Rp 0',
      budget: 'Rp 1.656.078.000',
      percent: 0
    },
    {
      label: 'Bagi Hasil Pajak & Retribusi',
      realization: 'Rp 0',
      budget: 'Rp 254.416.000',
      percent: 0
    },
    {
      label: 'Alokasi Dana Desa (ADD)',
      realization: 'Rp 0',
      budget: 'Rp 442.958.000',
      percent: 0
    },
    {
      label: 'Bantuan Keuangan Kab/Kota',
      realization: 'Rp 0',
      budget: 'Rp 366.000.000',
      percent: 0
    }
  ],
  expenseItems: [
    {
      label: 'Penyelenggaraan Pemerintahan Desa',
      realization: 'Rp 0',
      budget: 'Rp 1.159.164.470',
      percent: 0
    },
    {
      label: 'Pelaksanaan Pembangunan Desa',
      realization: 'Rp 0',
      budget: 'Rp 1.286.368.100',
      percent: 0
    },
    {
      label: 'Pembinaan Kemasyarakatan Desa',
      realization: 'Rp 0',
      budget: 'Rp 136.430.000',
      percent: 0
    },
    {
      label: 'Pemberdayaan Masyarakat Desa',
      realization: 'Rp 0',
      budget: 'Rp 90.055.500',
      percent: 0
    },
    {
      label: 'Penanggulangan Bencana/Darurat',
      realization: 'Rp 0',
      budget: 'Rp 150.900.000',
      percent: 0
    }
  ],
  note:
    'Data dapat disesuaikan dengan sumber resmi desa atau API APBDes agar masyarakat mendapat informasi terbaru.'
}

const c = computed(() => {
  return {
    eyebrow: props.eyebrow || defaults.eyebrow,
    title: props.title || defaults.title,
    subtitle: props.subtitle || defaults.subtitle,
    ctaLabel: props.ctaLabel || defaults.ctaLabel,
    ctaHref: props.ctaHref || defaults.ctaHref,
    visitorGrowth: props.visitorGrowth || defaults.visitorGrowth,
    visitorProgress: props.visitorProgress || defaults.visitorProgress,
    visitors: props.visitors?.length ? props.visitors : defaults.visitors,
    officialsHref: props.officialsHref || defaults.officialsHref,
    officials: props.officials?.length ? props.officials : defaults.officials,
    budgetTitle: props.budgetTitle || defaults.budgetTitle,
    budgetSummary: props.budgetSummary?.length ? props.budgetSummary : defaults.budgetSummary,
    incomeItems: props.incomeItems?.length ? props.incomeItems : defaults.incomeItems,
    expenseItems: props.expenseItems?.length ? props.expenseItems : defaults.expenseItems,
    note: props.note || defaults.note
  }
})

const officials = computed(() => c.value.officials)

const activeOfficial = computed(() => {
  return officials.value[officialIndex.value] || officials.value[0]
})

const circleDash = 251.2

function circleOffset(percent: number) {
  const value = Math.max(0, Math.min(Number(percent || 0), 100))
  return circleDash - (circleDash * value) / 100
}

function nextOfficial() {
  officialIndex.value = (officialIndex.value + 1) % officials.value.length
}

function prevOfficial() {
  officialIndex.value =
    officialIndex.value === 0
      ? officials.value.length - 1
      : officialIndex.value - 1
}

const BudgetItemCard = defineComponent({
  name: 'BudgetItemCard',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(componentProps) {
    return () => {
      const item = componentProps.item as BudgetListItem
      const percent = Math.max(0, Math.min(Number(item.percent || 0), 100))

      return h(
        'div',
        {
          class:
            'rounded-[1.35rem] border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5'
        },
        [
          h('div', { class: 'flex items-start justify-between gap-3' }, [
            h('div', { class: 'min-w-0' }, [
              h('p', { class: 'truncate text-sm font-black text-slate-700' }, item.label),
              h('p', { class: 'mt-2 text-xs font-semibold text-slate-400' }, `Anggaran: ${item.budget}`)
            ]),
            h('p', { class: 'shrink-0 text-sm font-black text-slate-950' }, item.realization)
          ]),
          h('div', { class: 'mt-3 h-2 overflow-hidden rounded-full bg-slate-200' }, [
            h('div', {
              class: 'h-full rounded-full bg-blue-600',
              style: {
                width: `${percent}%`
              }
            })
          ])
        ]
      )
    }
  }
})
</script>

<style scoped>
.bg-size-\[44px_44px\] {
  background-size: 44px 44px;
}
</style>