<template>
  <section id="pricing" class="relative overflow-hidden py-20 sm:py-24 lg:py-28">
    <!-- Background -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-gradient-to-b from-green-50/90 via-white to-white dark:from-green-950/30 dark:via-neutral-950 dark:to-neutral-950" />
      <div class="absolute inset-0 [background-image:linear-gradient(to_right,rgba(34,197,94,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,197,94,0.07)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div class="absolute -left-24 top-24 size-80 rounded-full bg-green-300/25 blur-3xl dark:bg-green-500/10" />
      <div class="absolute -right-24 top-1/3 size-96 rounded-full bg-lime-300/20 blur-3xl dark:bg-lime-500/10" />
      <div class="absolute bottom-0 left-1/2 size-80 -translate-x-1/2 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10" />
    </div>

    <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mx-auto max-w-3xl text-center">
        <div class="inline-flex items-center gap-2 rounded-full border border-green-200/70 bg-white/80 px-4 py-2 text-xs font-bold text-green-700 shadow-sm shadow-green-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-green-300">
          <span class="relative flex size-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
            <span class="relative inline-flex size-2 rounded-full bg-green-600" />
          </span>
          Harga Proposal Obayan
        </div>

        <h2 class="mt-5 text-3xl font-black tracking-tight text-gray-950 dark:text-white sm:text-5xl">
          Paket fleksibel untuk
          <span class="bg-gradient-to-r from-green-600 via-emerald-500 to-lime-500 bg-clip-text text-transparent">
            transformasi digital lembaga
          </span>
        </h2>

        <p class="mx-auto mt-4 max-w-2xl text-base leading-8 text-gray-600 dark:text-neutral-300">
          Mulai dari website informasi, SIAKAD, aplikasi wali, sampai opsi full akses kepemilikan sistem.
        </p>
      </div>

      <!-- Promo banner -->
      <div
        class="mt-10 overflow-hidden rounded-[2rem] border border-green-200/70 bg-white/80 p-5 shadow-2xl shadow-green-900/10 backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.04] sm:p-6"
      >
        <div class="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div class="flex items-start gap-4">
            <div class="grid size-12 shrink-0 place-items-center rounded-2xl bg-green-600 text-white shadow-xl shadow-green-500/25">
              <Icon icon="ph:confetti-duotone" class="size-6" />
            </div>

            <div>
              <p class="text-lg font-black text-gray-950 dark:text-white">
                Promo Launching Grand Opening
              </p>
              <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-neutral-300">
                Promo otomatis aktif sampai <b>20 Maret 2027</b>.
                Saat promo aktif, biaya platform mendapatkan potongan {{ promoPercentText }}.
              </p>
            </div>
          </div>

          <div
            v-if="isPromoActive"
            class="grid grid-cols-3 gap-2 rounded-2xl border border-green-100 bg-green-50/70 p-3 text-center dark:border-green-400/20 dark:bg-green-500/10"
          >
            <div>
              <p class="text-2xl font-black text-green-700 dark:text-green-300">{{ promoRemaining.months }}</p>
              <p class="text-[11px] font-bold text-green-700/70 dark:text-green-300/70">bulan</p>
            </div>
            <div>
              <p class="text-2xl font-black text-green-700 dark:text-green-300">{{ promoRemaining.days }}</p>
              <p class="text-[11px] font-bold text-green-700/70 dark:text-green-300/70">hari</p>
            </div>
            <div>
              <p class="text-2xl font-black text-green-700 dark:text-green-300">{{ promoRemaining.hours }}</p>
              <p class="text-[11px] font-bold text-green-700/70 dark:text-green-300/70">jam</p>
            </div>
          </div>

          <div
            v-else
            class="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3 text-sm font-bold text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300"
          >
            Promo sudah berakhir
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="mt-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <!-- Student count -->
        <div class="rounded-[1.5rem] border border-gray-200/70 bg-white/75 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-sm font-black text-gray-950 dark:text-white">Estimasi jumlah santri</p>
              <p class="text-xs text-gray-500 dark:text-neutral-400">
                Dipakai untuk paket yang memiliki biaya per santri.
              </p>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="grid size-9 place-items-center rounded-xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                @click="studentCount = Math.max(1, studentCount - 25)"
              >
                <Icon icon="ph:minus-bold" class="size-4" />
              </button>

              <input
                v-model.number="studentCount"
                type="number"
                min="1"
                class="h-9 w-24 rounded-xl border border-gray-200 bg-white px-3 text-center text-sm font-black text-gray-950 outline-none transition focus:border-green-400 focus:ring-4 focus:ring-green-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
              >

              <button
                type="button"
                class="grid size-9 place-items-center rounded-xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                @click="studentCount += 25"
              >
                <Icon icon="ph:plus-bold" class="size-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Billing toggle -->
        <div class="rounded-[1.5rem] border border-gray-200/70 bg-white/75 p-2 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              class="rounded-2xl px-5 py-3 text-sm font-black transition"
              :class="billing === 'monthly'
                ? 'bg-green-600 text-white shadow-xl shadow-green-500/20'
                : 'text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-white/10'"
              @click="billing = 'monthly'"
            >
              Bulanan
            </button>

            <button
              type="button"
              class="rounded-2xl px-5 py-3 text-sm font-black transition"
              :class="billing === 'yearly'
                ? 'bg-green-600 text-white shadow-xl shadow-green-500/20'
                : 'text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-white/10'"
              @click="billing = 'yearly'"
            >
              Tahunan
            </button>
          </div>
        </div>
      </div>

      <!-- Pricing cards -->
      <div class="mt-8 grid gap-6 lg:grid-cols-3">
        <article
          v-for="(p, i) in plans"
          :key="p.id"
          class="pricing-card group relative overflow-hidden rounded-[2rem] border bg-white/80 p-6 shadow-sm shadow-gray-950/[0.03] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-2xl hover:shadow-green-900/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.07]"
          :class="[
            p.highlight
              ? 'border-green-300 ring-2 ring-green-400/40 dark:border-green-400/40'
              : 'border-gray-200/70 dark:border-white/10',
          ]"
          :style="{ '--delay': `${i * 90}ms` }"
        >
          <div class="absolute -right-20 -top-20 size-52 rounded-full bg-green-300/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
          <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div
            v-if="p.highlight"
            class="absolute right-5 top-5 rounded-full bg-green-600 px-3 py-1 text-[11px] font-black text-white shadow-xl shadow-green-500/20"
          >
            Rekomendasi
          </div>

          <div
            v-if="isPromoActive"
            class="mb-4 inline-flex items-center gap-1.5 rounded-full bg-green-600/10 px-3 py-1 text-[11px] font-black text-green-700 ring-1 ring-green-600/10 dark:text-green-300"
          >
            <Icon icon="ph:sparkle-bold" class="size-3.5" />
            Promo aktif
          </div>

          <div class="relative">
            <div class="grid size-12 place-items-center rounded-2xl text-white shadow-xl shadow-green-500/20" :class="p.iconBg">
              <Icon :icon="p.icon" class="size-6" />
            </div>

            <h3 class="mt-5 text-2xl font-black tracking-tight text-gray-950 dark:text-white">
              {{ p.name }}
            </h3>

            <p class="mt-2 min-h-[48px] text-sm leading-6 text-gray-600 dark:text-neutral-300">
              {{ p.description }}
            </p>

            <!-- Price -->
            <div class="mt-6">
              <template v-if="p.type === 'subscription'">
                <div v-if="isPromoActive" class="mb-1 text-sm font-bold text-gray-400 line-through">
                  {{ currency(planRegularTotal(p)) }}
                </div>

                <div class="flex flex-wrap items-end gap-x-2">
                  <span class="text-3xl font-black tracking-tight text-gray-950 dark:text-white sm:text-4xl">
                    {{ currency(planTotal(p)) }}
                  </span>
                  <span class="pb-1 text-sm font-semibold text-gray-500 dark:text-neutral-400">
                    / {{ billing === 'monthly' ? 'bulan' : 'tahun' }}
                  </span>
                </div>

                <p v-if="p.perStudent" class="mt-2 text-xs font-medium text-gray-500 dark:text-neutral-400">
                  Termasuk {{ currency(platformPrice(p)) }} platform
                  + {{ currency(p.perStudent) }}/santri × {{ safeStudentCount }} santri.
                </p>

                <p v-if="billing === 'yearly'" class="mt-2 text-xs font-bold text-green-700 dark:text-green-300">
                  Estimasi setara {{ currency(Math.round(planTotal(p) / 12)) }} / bulan.
                </p>
              </template>

              <template v-else>
                <div v-if="isPromoActive" class="mb-1 text-sm font-bold text-gray-400 line-through">
                  {{ currency(p.oneTimeFrom) }}
                </div>

                <div class="flex flex-wrap items-end gap-x-2">
                  <span class="text-3xl font-black tracking-tight text-gray-950 dark:text-white sm:text-4xl">
                    Mulai {{ currency(planTotal(p)) }}
                  </span>
                </div>

                <p class="mt-2 text-xs font-medium text-gray-500 dark:text-neutral-400">
                  One-time investment, sistem menjadi aset lembaga.
                </p>
              </template>
            </div>

            <div class="my-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-white/10" />

            <!-- Features -->
            <ul class="space-y-3">
              <li
                v-for="perk in shownPerks(p)"
                :key="perk"
                class="flex items-start gap-2 text-sm leading-6 text-gray-700 dark:text-neutral-200"
              >
                <Icon icon="ph:check-circle-duotone" class="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-300" />
                <span>{{ perk }}</span>
              </li>
            </ul>

            <div class="mt-5">
              <button
                v-if="canShowMore(p)"
                type="button"
                class="inline-flex items-center gap-1 text-sm font-black text-green-700 transition hover:text-green-800 hover:underline dark:text-green-300"
                @click="showMore(p)"
              >
                Selengkapnya
                <span class="text-xs font-bold opacity-70">({{ nextChunkCount(p) }} lagi)</span>
              </button>

              <button
                v-else-if="isExpanded(p)"
                type="button"
                class="text-sm font-bold text-gray-500 transition hover:underline dark:text-neutral-400"
                @click="showLess(p)"
              >
                Ringkas
              </button>
            </div>

            <!-- CTA -->
            <div class="mt-7 grid grid-cols-2 gap-3">
              <a
                href="#demo"
                class="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-3 text-sm font-black text-white shadow-xl shadow-green-500/20 transition hover:-translate-y-0.5 hover:bg-green-700"
              >
                Demo
              </a>

              <a
                href="#contact"
                class="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-black text-gray-800 transition hover:-translate-y-0.5 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                Hubungi
              </a>
            </div>
          </div>
        </article>
      </div>

      <!-- Notes -->
      <div class="mt-8 rounded-[1.5rem] border border-gray-200/70 bg-white/70 p-5 text-sm leading-7 text-gray-600 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300">
        <div class="flex items-start gap-3">
          <Icon icon="ph:info-duotone" class="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-300" />
          <p>
            Harga bersifat fleksibel dan dapat disesuaikan melalui diskusi lebih lanjut berdasarkan jumlah santri,
            kebutuhan fitur, skema implementasi bertahap, dan kemampuan anggaran lembaga. Harga belum termasuk PPN,
            perangkat tambahan, dan aktivasi kanal pembayaran pihak ketiga jika dibutuhkan.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'

type Billing = 'monthly' | 'yearly'
type PlanType = 'subscription' | 'one_time'

type Plan = {
  id: string
  name: string
  description: string
  type: PlanType
  icon: string
  iconBg: string
  highlight?: boolean
  monthly?: number
  yearly?: number
  perStudent?: number
  oneTimeFrom?: number
  perks: string[]
}

const billing = ref<Billing>('monthly')
const studentCount = ref(150)
const now = ref(new Date())

const PROMO_RATE = 0.50
const PROMO_END = new Date('2027-03-21T23:59:59+07:00')

let clockTimer: number | undefined

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Website informasi resmi berbasis CMS untuk branding dan publikasi lembaga.',
    type: 'subscription',
    icon: 'ph:globe-duotone',
    iconBg: 'bg-green-600',
    monthly: 439000,
    yearly: 4390000,
    perks: [
      'Website profil lembaga',
      'Manajemen berita dan pengumuman',
      'Galeri dokumentasi kegiatan',
      'Informasi pendaftaran PPDB/PSB',
      'CMS untuk update konten mandiri',
      'Halaman profil, visi misi, fasilitas, dan program',
      'Tampilan responsive untuk desktop dan mobile',
      'Optimasi dasar SEO dan informasi publik',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Website + sistem manajemen inti untuk operasional lembaga pendidikan.',
    type: 'subscription',
    icon: 'ph:student-duotone',
    iconBg: 'bg-emerald-600',
    highlight: true,
    monthly: 725000,
    perStudent: 3000,
    perks: [
      'Semua fitur Paket Basic',
      'Manajemen data peserta didik/santri',
      'Manajemen kelas dan data akademik',
      'Absensi dan akademik dasar',
      'Keuangan dasar',
      'Dashboard admin',
      'Data lebih terpusat dan terdokumentasi',
      'Cocok sebagai fondasi implementasi awal',
    ],
  },
  {
    id: 'advanced',
    name: 'Advanced',
    description: 'Standard + dukungan aplikasi dan opsi integrasi RFID untuk otomatisasi.',
    type: 'subscription',
    icon: 'ph:identification-badge-duotone',
    iconBg: 'bg-teal-600',
    monthly: 920000,
    perStudent: 4000,
    perks: [
      'Semua fitur Paket Standard',
      'Manajemen data peserta didik',
      'Absensi dan akademik',
      'Keuangan dasar',
      'Dashboard admin',
      'Opsi integrasi RFID Device',
      'Monitoring kehadiran lebih real-time',
      'Mengurangi kesalahan pencatatan manual',
      'Mendukung operasional yang lebih tertib',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Advanced + platform monitoring wali untuk transparansi perkembangan santri.',
    type: 'subscription',
    icon: 'ph:users-three-duotone',
    iconBg: 'bg-lime-600',
    monthly: 1100000,
    perStudent: 5000,
    perks: [
      'Semua fitur Paket Advanced',
      'Aplikasi/platform monitoring wali santri',
      'Akses absensi peserta didik',
      'Nilai dan perkembangan akademik',
      'Informasi pembayaran',
      'Notifikasi dan pengumuman',
      'Komunikasi data lebih transparan',
      'Cocok untuk layanan wali/orang tua yang lebih modern',
    ],
  },
  {
    id: 'full-access',
    name: 'Full Akses',
    description: 'Skema kepemilikan sistem dengan pembelian putus untuk aset lembaga.',
    type: 'one_time',
    icon: 'ph:crown-duotone',
    iconBg: 'bg-slate-900',
    oneTimeFrom: 86000000,
    perks: [
      'Seluruh modul sistem',
      'Skema one-time payment',
      'Sistem menjadi aset lembaga',
      'Tanpa biaya langganan bulanan',
      'Lebih efisien untuk jangka panjang',
      'Maintenance dapat disesuaikan terpisah',
      'Pengembangan fitur besar dapat dibahas sesuai kebutuhan',
    ],
  },
]

const safeStudentCount = computed(() => {
  const value = Number(studentCount.value || 1)
  return Math.max(1, Math.round(value))
})

const isPromoActive = computed(() => now.value.getTime() <= PROMO_END.getTime())
const promoPercentText = computed(() => `${Math.round(PROMO_RATE * 100)}%`)

const promoRemaining = computed(() => {
  const diff = Math.max(PROMO_END.getTime() - now.value.getTime(), 0)
  const totalHours = Math.floor(diff / (1000 * 60 * 60))
  const months = Math.floor(totalHours / (24 * 30))
  const days = Math.floor((totalHours - months * 24 * 30) / 24)
  const hours = totalHours % 24

  return { months, days, hours }
})

function currency(n?: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(n || 0)))
}

function roundThousand(n: number) {
  return Math.round(n / 1000) * 1000
}

function discount(n: number) {
  if (!isPromoActive.value) return n
  return roundThousand(n * (1 - PROMO_RATE))
}

function monthlyPlatformPrice(p: Plan) {
  return p.monthly || 0
}

function yearlyPlatformPrice(p: Plan) {
  if (p.yearly) return p.yearly

  // Untuk paket yang proposalnya hanya bulanan, yearly dihitung 10 bulan
  // agar tetap mendukung toggle tahunan dengan konsep hemat 2 bulan.
  return monthlyPlatformPrice(p) * 10
}

function platformPrice(p: Plan) {
  if (p.type === 'one_time') {
    return discount(p.oneTimeFrom || 0)
  }

  const base = billing.value === 'monthly'
    ? monthlyPlatformPrice(p)
    : yearlyPlatformPrice(p)

  return discount(base)
}

function perStudentTotal(p: Plan) {
  if (!p.perStudent) return 0

  const monthly = p.perStudent * safeStudentCount.value

  if (billing.value === 'monthly') return monthly

  // Yearly mengikuti konsep hemat 2 bulan untuk biaya operasional tahunan.
  return monthly * 10
}

function planRegularTotal(p: Plan) {
  if (p.type === 'one_time') return p.oneTimeFrom || 0

  const base = billing.value === 'monthly'
    ? monthlyPlatformPrice(p)
    : yearlyPlatformPrice(p)

  return base + perStudentTotal(p)
}

function planTotal(p: Plan) {
  if (p.type === 'one_time') return platformPrice(p)

  return platformPrice(p) + perStudentTotal(p)
}

const BASE_COUNT = 6
const STEP = 6
const showCounts = ref<Record<string, number>>({})

function getShownCount(p: Plan) {
  const current = showCounts.value[p.id]

  if (typeof current === 'number') return current

  const init = Math.min(BASE_COUNT, p.perks.length)
  showCounts.value[p.id] = init

  return init
}

function shownPerks(p: Plan) {
  return p.perks.slice(0, getShownCount(p))
}

function canShowMore(p: Plan) {
  return getShownCount(p) < p.perks.length
}

function nextChunkCount(p: Plan) {
  return Math.min(STEP, p.perks.length - getShownCount(p))
}

function showMore(p: Plan) {
  showCounts.value[p.id] = Math.min(getShownCount(p) + STEP, p.perks.length)
}

function isExpanded(p: Plan) {
  return p.perks.length > BASE_COUNT && getShownCount(p) > BASE_COUNT
}

function showLess(p: Plan) {
  showCounts.value[p.id] = Math.min(BASE_COUNT, p.perks.length)
}

onMounted(() => {
  clockTimer = window.setInterval(() => {
    now.value = new Date()
  }, 1000 * 60 * 30)
})

onBeforeUnmount(() => {
  if (clockTimer) window.clearInterval(clockTimer)
})
</script>

<style scoped>
.pricing-card {
  opacity: 0;
  transform: translate3d(0, 24px, 0) scale(0.985);
  filter: blur(10px);
  animation: pricingReveal 760ms cubic-bezier(0.22, 1, 0.36, 1) var(--delay) both;
}

@keyframes pricingReveal {
  0% {
    opacity: 0;
    transform: translate3d(0, 24px, 0) scale(0.985);
    filter: blur(10px);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
    filter: blur(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pricing-card {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }

  * {
    transition-duration: 0.01ms !important;
  }
}
</style>