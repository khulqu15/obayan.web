<!-- ~/components/CaseStudyHeroSiakad.vue -->
<template>
  <section
    class="relative w-full min-h-[620px] overflow-hidden sm:min-h-[680px] lg:min-h-[760px]"
    :style="heroStyle(active)"
    aria-label="Studi Kasus SIAKAD Obayan"
  >
    <!-- Background overlay -->
    <div class="absolute inset-0 bg-slate-950/40" />
    <div class="absolute inset-0 bg-gradient-to-br from-slate-950/20 via-slate-950/20 to-green-950/20" />

    <!-- Decoration -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div class="absolute -left-28 -top-28 h-[34rem] w-[34rem] rounded-full bg-green-400/25 blur-3xl" />
      <div class="absolute -right-32 top-28 h-[34rem] w-[34rem] rounded-full bg-lime-300/20 blur-3xl" />
      <div class="absolute bottom-0 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-emerald-400/15 blur-3xl" />

      <div class="absolute inset-0 [mask-image:radial-gradient(70%_65%_at_50%_42%,#000,transparent_76%)]">
        <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.075)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.075)_1px,transparent_1px)] [background-size:34px_34px]" />
      </div>
    </div>

    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Switcher -->
      <div class="flex flex-wrap items-center gap-2 pt-6 sm:pt-8">
        <button
          v-for="(c, i) in cases"
          :key="c.slug"
          type="button"
          @click="go(i)"
          class="group inline-flex items-center gap-2 rounded-2xl border px-3.5 py-2 text-sm font-bold backdrop-blur-xl transition-all duration-300"
          :class="i === index
            ? 'border-white/80 bg-white text-gray-950 shadow-xl shadow-black/10'
            : 'border-white/15 bg-white/10 text-white/80 hover:-translate-y-0.5 hover:bg-white/18 hover:text-white'"
        >
          <span
            class="grid size-7 place-items-center rounded-xl transition"
            :class="i === index ? 'bg-green-600 text-white' : 'bg-white/10 text-white'"
          >
            <Icon :icon="c.icon" class="size-4" />
          </span>
          {{ c.pill }}
        </button>
      </div>

      <!-- Hero -->
      <Transition name="hero-swap" mode="out-in">
        <div
          :key="active.slug"
          class="grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:py-24"
        >
          <!-- Left content -->
          <div class="lg:col-span-7">
            <span class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white/90 backdrop-blur-xl">
              <Icon icon="solar:stars-line-duotone" class="size-4 text-green-300" />
              Studi Kasus • {{ active.code }}
            </span>

            <h1 class="mt-5 max-w-3xl text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
              {{ active.title }}
            </h1>

            <p class="mt-5 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
              {{ active.subtitle }}
            </p>

            <!-- Tags -->
            <div class="mt-6 flex flex-wrap gap-2">
              <span
                v-for="t in active.tags"
                :key="t"
                class="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/90 backdrop-blur"
              >
                {{ t }}
              </span>
            </div>

            <!-- KPIs -->
            <div class="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
              <div
                v-for="(k, i) in active.kpis"
                :key="i"
                class="rounded-3xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/14"
              >
                <p class="text-xl font-black">{{ k.value }}</p>
                <p class="mt-1 text-xs font-medium text-white/70">{{ k.label }}</p>
              </div>
            </div>

            <!-- CTA -->
            <div class="mt-8 flex flex-wrap items-center gap-3">
              <a
                :href="active.projectUrl"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-extrabold text-white shadow-2xl shadow-green-500/25 transition duration-300 hover:-translate-y-0.5 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-white/60"
              >
                <Icon icon="lucide:external-link" class="size-4" />
                Buka Portal
              </a>

              <a
                :href="active.more"
                class="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-extrabold text-white backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-white/18"
              >
                <Icon icon="lucide:book-open" class="size-4" />
                Pelajari Implementasi
              </a>
            </div>

            <p class="mt-4 text-xs font-medium text-white/60">
              Dibangun di ekosistem Obayan Sencra
            </p>
          </div>

          <!-- Right preview card -->
          <div class="lg:col-span-5">
            <div class="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/12 p-5 text-white shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-6">
              <div class="absolute -right-16 -top-16 size-44 rounded-full bg-green-300/20 blur-3xl" />
              <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

              <!-- Browser mockup -->
              <div class="relative overflow-hidden rounded-[1.5rem] border border-white/15 bg-slate-950/55 shadow-2xl">
                <div class="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div class="flex items-center gap-2">
                    <span class="size-3 rounded-full bg-red-300" />
                    <span class="size-3 rounded-full bg-yellow-300" />
                    <span class="size-3 rounded-full bg-green-400" />
                  </div>

                  <div class="hidden max-w-[220px] truncate rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white/70 sm:block">
                    {{ active.domain }}
                  </div>
                </div>

                <div class="relative p-4 sm:p-5">
                  <div class="mb-5 flex items-start gap-3">
                    <div class="flex items-center justify-center w-12 h-12 rounded-2xl bg-green-600 text-white shadow-xl shadow-green-500/25">
                      <Icon :icon="active.icon" class="size-6" />
                    </div>

                    <div>
                      <p class="text-lg font-black">{{ active.card.title }}</p>
                      <p class="mt-1 text-sm leading-6 text-white/70">
                        {{ active.card.desc }}
                      </p>
                    </div>
                  </div>

                  <ul class="mt-5 space-y-3">
                    <li
                      v-for="(h, i) in active.card.points"
                      :key="i"
                      class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/8 px-3 py-2.5"
                    >
                      <Icon icon="lucide:check-circle-2" class="mt-[2px] size-5 shrink-0 text-green-300" />
                      <span class="text-sm leading-6 text-white/84">{{ h }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Project URL -->
              <div class="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p class="text-xs font-bold uppercase tracking-wide text-white/45">Portal</p>
                  <p class="mt-1 text-sm font-extrabold text-white">{{ active.domain }}</p>
                </div>

                <a
                  :href="active.projectUrl"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-extrabold text-gray-950 transition hover:-translate-y-0.5 hover:bg-green-50"
                >
                  Visit
                  <Icon icon="lucide:arrow-up-right" class="size-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Bottom control -->
      <div class="flex items-center justify-between gap-4 pb-7 sm:pb-9">
        <div class="flex items-center gap-2">
          <button
            v-for="(c, i) in cases"
            :key="c.slug + '-dot'"
            type="button"
            @click="go(i)"
            class="h-2 rounded-full transition-all duration-300"
            :class="i === index ? 'w-10 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'"
            :aria-label="`Buka studi kasus ${c.code}`"
          />
        </div>

        <div class="hidden h-1 w-44 overflow-hidden rounded-full bg-white/15 sm:block">
          <div
            :key="active.slug"
            class="h-full rounded-full bg-green-400"
            :style="{ animationDuration: `${autoplayMs}ms` }"
            :class="autoplayMs > 0 ? 'autoplay-progress' : ''"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'

type KPI = {
  label: string
  value: string
}

type Case = {
  slug: string
  code: string
  pill: string
  title: string
  subtitle: string
  icon: string
  image: string
  projectUrl: string
  domain: string
  tags: string[]
  kpis: KPI[]
  more: string
  card: {
    title: string
    desc: string
    points: string[]
  }
}

const props = withDefaults(defineProps<{
  autoplayMs?: number
  images?: Partial<Record<'siberr' | 'sinayah' | 'siladunni', string>>
}>(), {
  autoplayMs: 8000,
})

const cases = ref<Case[]>([
  {
    slug: 'siberr-siakad-alberr',
    code: 'SIBERR',
    pill: 'SIBERR',
    title: 'SIBERR - SIAKAD Alberr yang rapi, cepat, dan terpusat',
    subtitle: 'SIBERR membantu Alberr mengelola data akademik, santri, kelas, nilai, dan informasi sekolah dalam satu portal digital yang mudah diakses.',
    icon: 'lucide:school',
    image: props.images?.siberr || '/assets/images/cases/0.png',
    projectUrl: 'https://alberr-obayan.sencra.io',
    domain: 'alberr-obayan.sencra.io',
    tags: ['SIAKAD Alberr', 'Portal Akademik', 'Data Terpusat'],
    kpis: [
      { label: 'Produk', value: 'SIAKAD' },
      { label: 'Portal', value: 'SIBERR' },
      { label: 'Akses', value: 'Web App' },
    ],
    more: '/produk?slug=obayan-siakad',
    card: {
      title: 'Siakad Alberr',
      desc: 'Portal akademik untuk manajemen data dan layanan digital Alberr.',
      points: [
        'Dashboard admin untuk melihat ringkasan data akademik',
        'Manajemen data santri, kelas, dan informasi lembaga',
        'Portal siap dikembangkan ke modul wali, nilai, dan presensi',
      ],
    },
  },
  {
    slug: 'sinayah-siakad-alinayah',
    code: 'SINAYAH',
    pill: 'SINAYAH',
    title: 'SINAYAH - Sistem Akademik Al-Inayah dalam satu portal',
    subtitle: 'SINAYAH menjadi ruang digital Pondok Pesantren Al-Inayah untuk mengelola administrasi akademik, informasi santri, dan kebutuhan layanan sekolah.',
    icon: 'ph:student',
    image: props.images?.sinayah || '/assets/images/cases/1.png',
    projectUrl: 'https://alinayah.obayan.id',
    domain: 'alinayah.obayan.id',
    tags: ['SIAKAD Al-Inayah', 'Pondok Pesantren', 'Portal Wali'],
    kpis: [
      { label: 'Produk', value: 'SIAKAD' },
      { label: 'Portal', value: 'SINAYAH' },
      { label: 'Akses', value: 'Online' },
    ],
    more: '/produk?slug=obayan-siakad',
    card: {
      title: 'Siakad Al-Inayah',
      desc: 'Sistem akademik untuk mendukung operasional pondok dan komunikasi data.',
      points: [
        'Identitas portal disesuaikan dengan branding Al-Inayah',
        'Struktur data siap untuk santri, kelas, absensi, dan informasi akademik',
        'Dapat diintegrasikan dengan website, wali, dan modul administrasi',
      ],
    },
  },
  {
    slug: 'siladunni-siakad-alladunni',
    code: 'SILADUNNI',
    pill: 'SILADUNNI',
    title: 'SILADUNNI - Portal SIAKAD Alladunni yang modern dan fleksibel',
    subtitle: 'SILADUNNI dirancang untuk membantu Yayasan Al-Ladunni mengelola data akademik, aktivitas lembaga, dan layanan digital secara lebih tertata.',
    icon: 'ph:chalkboard-teacher',
    image: props.images?.siladunni || '/assets/images/cases/2.png',
    projectUrl: 'https://alladunni.obayan.id',
    domain: 'alladunni.obayan.id',
    tags: ['SIAKAD Alladunni', 'Multi Unit', 'Manajemen Data'],
    kpis: [
      { label: 'Produk', value: 'SIAKAD' },
      { label: 'Portal', value: 'SILADUNNI' },
      { label: 'Akses', value: 'Web App' },
    ],
    more: '/produk?slug=obayan-siakad',
    card: {
      title: 'Siakad Alladunni',
      desc: 'Portal digital untuk pengelolaan akademik dan data lembaga Al-Ladunni.',
      points: [
        'Tampilan portal menyesuaikan identitas Yayasan Al-Ladunni',
        'Siap untuk pengelolaan data santri, kelas, informasi, dan laporan',
        'Dapat diperluas ke modul perizinan, absensi, pembayaran, dan wali',
      ],
    },
  },
])

const index = ref(0)
const active = computed(() => cases.value[index.value] || cases.value[0])
const autoplayMs = computed(() => props.autoplayMs)

function go(i: number) {
  index.value = i % cases.value.length
}

function heroStyle(item: Case) {
  return {
    backgroundImage: `url('${item.image}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } as Record<string, string>
}

let timer: number | undefined

onMounted(() => {
  if (props.autoplayMs > 0) {
    timer = window.setInterval(() => {
      index.value = (index.value + 1) % cases.value.length
    }, props.autoplayMs)
  }
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<style scoped>
.hero-swap-enter-active,
.hero-swap-leave-active {
  transition:
    opacity 520ms ease,
    filter 520ms ease,
    transform 720ms cubic-bezier(0.22, 1, 0.36, 1);
}

.hero-swap-enter-from {
  opacity: 0;
  filter: blur(14px);
  transform: translate3d(0, 22px, 0) scale(0.985);
}

.hero-swap-leave-to {
  opacity: 0;
  filter: blur(10px);
  transform: translate3d(0, -16px, 0) scale(0.985);
}

.widget-bar {
  transform-origin: bottom;
  animation: barWave 2.8s ease-in-out infinite;
}

.widget-bar-delay {
  animation-delay: 180ms;
}

.widget-bar-delay-2 {
  animation-delay: 360ms;
}

.widget-bar-delay-3 {
  animation-delay: 540ms;
}

.autoplay-progress {
  animation-name: autoplayFill;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes barWave {
  0%,
  100% {
    transform: scaleY(0.55);
    opacity: 0.65;
  }

  50% {
    transform: scaleY(1);
    opacity: 1;
  }
}

@keyframes autoplayFill {
  from {
    width: 0%;
  }

  to {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-swap-enter-active,
  .hero-swap-leave-active {
    transition-duration: 0.01ms !important;
  }

  .widget-bar,
  .autoplay-progress {
    animation: none !important;
  }
}
</style>