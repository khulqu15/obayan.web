<template>
  <section
    id="features"
    ref="sectionRef"
    class="relative overflow-hidden py-24 sm:py-28"
  >
    <!-- Background -->
    <div class="absolute inset-0 -z-10">
      <div class="h-full w-full bg-gradient-to-b from-green-50/80 via-white to-white dark:from-green-950/30 dark:via-neutral-950 dark:to-neutral-950" />
      <div class="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(34,197,94,0.075)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,197,94,0.075)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div class="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-green-300/20 blur-3xl dark:bg-green-500/10" />
      <div class="absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-lime-200/25 blur-3xl dark:bg-lime-400/10" />
      <div class="absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-green-200/25 blur-3xl dark:bg-green-400/10" />
    </div>

    <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <!-- Heading -->
      <div
        class="mx-auto max-w-3xl text-center transition-all duration-700"
        :class="isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'"
      >
        <div class="inline-flex items-center gap-2 rounded-full border border-green-200/70 bg-white/80 px-4 py-2 text-xs font-bold text-green-700 shadow-sm shadow-green-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-green-300">
          <span class="relative flex size-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
            <span class="relative inline-flex size-2 rounded-full bg-green-600" />
          </span>
          Fitur terintegrasi
        </div>

        <h2 class="mt-5 text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
          Semua yang dibutuhkan pendidikan dalam
          <span class="bg-gradient-to-r from-green-600 via-emerald-500 to-lime-500 bg-clip-text text-transparent">
            satu ekosistem
          </span>
        </h2>

        <p class="mx-auto mt-4 max-w-2xl text-base leading-8 text-gray-600 dark:text-neutral-300">
          Operasional harian, data akademik, komunikasi, dan pelaporan dibuat lebih rapi,
          cepat, dan mudah dipahami.
        </p>
      </div>

      <!-- Feature Cards -->
      <div class="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(f, i) in decoratedFeatures"
          :key="f.title"
          class="feature-card group relative overflow-hidden rounded-[1.65rem] border border-gray-200/70 bg-white/75 p-5 shadow-sm shadow-gray-950/[0.03] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:border-green-200 hover:bg-white hover:shadow-2xl hover:shadow-green-900/10 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-green-400/30 dark:hover:bg-white/[0.07]"
          :class="isVisible ? 'is-visible' : ''"
          :style="{ '--delay': `${Math.min(i * 120, 720)}ms` }"
        >
          <!-- Glow -->
          <div class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div class="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-green-300/25 blur-3xl dark:bg-green-400/10" />
            <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/70 to-transparent" />
          </div>

          <!-- Mini animated widget -->
          <div class="relative mb-5 h-36 overflow-hidden rounded-[1.35rem] border border-green-100/80 bg-gradient-to-br from-green-50 via-white to-lime-50 p-4 shadow-inner shadow-white/70 dark:border-white/10 dark:from-green-950/40 dark:via-neutral-950 dark:to-neutral-900">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.18),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(132,204,22,0.12),transparent_24%)]" />

            <!-- Widget 1: Orbit -->
            <div v-if="f.variant === 0" class="relative flex h-full items-center justify-center">
              <div class="widget-orbit absolute size-24 rounded-full border border-green-300/60 dark:border-green-400/20">
                <span class="absolute -top-1 left-1/2 size-3 -translate-x-1/2 rounded-full bg-green-500 shadow-lg shadow-green-500/40" />
              </div>
              <div class="widget-orbit-reverse absolute size-16 rounded-full border border-lime-300/70 dark:border-lime-400/20">
                <span class="absolute -right-1 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-lime-500 shadow-lg shadow-lime-500/40" />
              </div>
              <div class="relative grid size-14 place-items-center rounded-2xl bg-white text-green-600 shadow-xl shadow-green-900/10 ring-1 ring-green-100 dark:bg-neutral-900 dark:text-green-300 dark:ring-white/10">
                <Icon :icon="f.icon" class="size-6" />
              </div>
            </div>

            <!-- Widget 2: Progress -->
            <div v-else-if="f.variant === 1" class="relative flex h-full flex-col justify-center gap-3">
              <div class="flex items-center justify-between">
                <span class="h-2 w-24 rounded-full bg-green-200/80 dark:bg-green-500/20" />
                <span class="rounded-full bg-green-600 px-2 py-1 text-[10px] font-bold text-white">Live</span>
              </div>

              <div class="space-y-2.5">
                <div class="h-2 overflow-hidden rounded-full bg-green-100 dark:bg-white/10">
                  <span class="widget-bar block h-full w-[82%] rounded-full bg-green-500" />
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-green-100 dark:bg-white/10">
                  <span class="widget-bar widget-bar-delay block h-full w-[64%] rounded-full bg-lime-500" />
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-green-100 dark:bg-white/10">
                  <span class="widget-bar widget-bar-delay-2 block h-full w-[74%] rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>

            <!-- Widget 3: Sparkline -->
            <div v-else-if="f.variant === 2" class="relative h-full">
              <div class="absolute left-0 top-0 rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold text-green-700 shadow-sm dark:bg-white/10 dark:text-green-300">
                Insight
              </div>

              <svg
                viewBox="0 0 260 110"
                class="absolute inset-x-0 bottom-1 h-28 w-full"
                fill="none"
                aria-hidden="true"
              >
                <path
                  class="widget-line-soft"
                  d="M8 88 C42 72 52 40 82 58 C112 76 118 22 150 38 C184 56 194 24 226 18 C242 15 252 18 258 20"
                  stroke="rgba(34,197,94,0.16)"
                  stroke-width="14"
                  stroke-linecap="round"
                />
                <path
                  class="widget-line"
                  d="M8 88 C42 72 52 40 82 58 C112 76 118 22 150 38 C184 56 194 24 226 18 C242 15 252 18 258 20"
                  stroke="#16a34a"
                  stroke-width="5"
                  stroke-linecap="round"
                />
              </svg>
            </div>

            <!-- Widget 4: App Window -->
            <div v-else-if="f.variant === 3" class="relative flex h-full items-center justify-center">
              <div class="widget-window w-[82%] rounded-2xl border border-white/80 bg-white/85 p-3 shadow-xl shadow-green-900/10 dark:border-white/10 dark:bg-neutral-900/80">
                <div class="mb-3 flex items-center gap-1.5">
                  <span class="size-2 rounded-full bg-red-300" />
                  <span class="size-2 rounded-full bg-yellow-300" />
                  <span class="size-2 rounded-full bg-green-400" />
                </div>

                <div class="grid grid-cols-3 gap-2">
                  <span class="h-12 rounded-xl bg-green-100 dark:bg-green-500/15" />
                  <span class="h-12 rounded-xl bg-lime-100 dark:bg-lime-500/15" />
                  <span class="h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/15" />
                </div>

                <div class="mt-3 space-y-2">
                  <span class="block h-2 w-4/5 rounded-full bg-green-200 dark:bg-green-400/20" />
                  <span class="block h-2 w-3/5 rounded-full bg-green-100 dark:bg-white/10" />
                </div>
              </div>
            </div>

            <!-- Widget 5: Connected Nodes -->
            <div v-else-if="f.variant === 4" class="relative h-full">
              <div class="absolute left-[18%] top-[18%] size-10 rounded-2xl bg-white shadow-lg shadow-green-900/10 ring-1 ring-green-100 dark:bg-neutral-900 dark:ring-white/10" />
              <div class="absolute right-[21%] top-[24%] size-10 rounded-2xl bg-white shadow-lg shadow-green-900/10 ring-1 ring-green-100 dark:bg-neutral-900 dark:ring-white/10" />
              <div class="absolute bottom-[14%] left-1/2 size-12 -translate-x-1/2 rounded-2xl bg-green-600 shadow-xl shadow-green-500/25" />

              <span class="widget-connector absolute left-[29%] top-[38%] h-0.5 w-[44%] origin-left rotate-24 rounded-full bg-green-300 dark:bg-green-400/30" />
              <span class="widget-connector widget-connector-delay absolute bottom-[32%] left-[56.5%] h-0.5 w-[36%] origin-left -rotate-20 rounded-full bg-lime-300 dark:bg-lime-400/30" />

              <div class="absolute bottom-[21%] left-1/2 -translate-x-1/2 text-white">
                <Icon :icon="f.icon" class="size-5" />
              </div>
            </div>

            <!-- Widget 6: Checklist -->
            <div v-else class="relative flex h-full flex-col justify-center gap-3">
              <div
                v-for="n in 3"
                :key="n"
                class="widget-check flex items-center gap-3 rounded-2xl border border-green-100 bg-white/80 px-3 py-2 shadow-sm dark:border-white/10 dark:bg-neutral-900/70"
                :style="{ '--check-delay': `${n * 180}ms` }"
              >
                <span class="grid size-6 place-items-center rounded-full bg-green-600 text-white">
                  <Icon icon="ph:check-bold" class="size-3.5" />
                </span>
                <span class="h-2 rounded-full bg-green-200 dark:bg-green-500/20" :class="n === 1 ? 'w-24' : n === 2 ? 'w-32' : 'w-20'" />
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="relative flex items-start gap-4">
            <div class="relative shrink-0">
              <div class="grid size-12 place-items-center rounded-2xl bg-green-50 text-green-600 ring-1 ring-green-200/70 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white dark:bg-green-500/10 dark:text-green-300 dark:ring-green-400/20">
                <ClientOnly>
                  <Icon :icon="f.icon" class="size-5" aria-hidden="true" />
                </ClientOnly>
              </div>
              <span class="absolute -right-1 -top-1 size-3 rounded-full bg-green-500 ring-4 ring-white dark:ring-neutral-950" />
            </div>

            <div class="min-w-0">
              <h3 class="text-base font-bold tracking-tight text-gray-950 dark:text-white">
                {{ f.title }}
              </h3>
              <p class="mt-1.5 text-sm leading-6 text-gray-600 dark:text-neutral-300">
                {{ f.desc }}
              </p>
            </div>
          </div>

        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, onBeforeUnmount, onMounted, ref, unref } from 'vue'
import { useObayan } from '~/composables/useObayan'

const { features } = useObayan()

const sectionRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

const decoratedFeatures = computed(() => {
  return unref(features).map((feature, index) => ({
    ...feature,
    variant: index % 6,
  }))
})

let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        isVisible.value = true
        observer?.disconnect()
      }
    },
    {
      threshold: 0.18,
    }
  )

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<style scoped>
.feature-card {
  opacity: 0;
  transform: translateY(22px) scale(0.985);
}

.feature-card.is-visible {
  animation: featureReveal 780ms cubic-bezier(0.22, 1, 0.36, 1) var(--delay) both;
}

.widget-orbit {
  animation: orbitSpin 7.5s linear infinite;
}

.widget-orbit-reverse {
  animation: orbitSpinReverse 5.8s linear infinite;
}

.widget-bar {
  transform-origin: left;
  animation: barPulse 2.9s ease-in-out infinite;
}

.widget-bar-delay {
  animation-delay: 260ms;
}

.widget-bar-delay-2 {
  animation-delay: 520ms;
}

.widget-line {
  stroke-dasharray: 420;
  stroke-dashoffset: 420;
  animation: drawLine 3.4s ease-in-out infinite;
}

.widget-line-soft {
  stroke-dasharray: 420;
  stroke-dashoffset: 420;
  animation: drawLine 3.4s ease-in-out infinite;
}

.widget-window {
  animation: windowFloat 4.2s ease-in-out infinite;
}

.widget-connector {
  transform: scaleX(0);
  animation: connectorGrow 2.8s ease-in-out infinite;
}

.widget-connector-delay {
  animation-delay: 420ms;
}

.widget-check {
  animation: checkFloat 3.2s ease-in-out infinite;
  animation-delay: var(--check-delay);
}

@keyframes featureReveal {
  0% {
    opacity: 0;
    transform: translateY(22px) scale(0.985);
    filter: blur(8px);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

@keyframes orbitSpin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes orbitSpinReverse {
  to {
    transform: rotate(-360deg);
  }
}

@keyframes barPulse {
  0%,
  100% {
    transform: scaleX(0.72);
    opacity: 0.65;
  }

  50% {
    transform: scaleX(1);
    opacity: 1;
  }
}

@keyframes drawLine {
  0% {
    stroke-dashoffset: 420;
    opacity: 0.35;
  }

  45%,
  70% {
    stroke-dashoffset: 0;
    opacity: 1;
  }

  100% {
    stroke-dashoffset: -420;
    opacity: 0.25;
  }
}

@keyframes windowFloat {
  0%,
  100% {
    transform: translateY(0) rotate(-1deg);
  }

  50% {
    transform: translateY(-7px) rotate(1deg);
  }
}

@keyframes connectorGrow {
  0%,
  100% {
    transform: scaleX(0);
    opacity: 0.25;
  }

  45%,
  70% {
    transform: scaleX(0.35);
    opacity: 1;
  }
}

@keyframes checkFloat {
  0%,
  100% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .feature-card,
  .feature-card.is-visible {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }

  .widget-orbit,
  .widget-orbit-reverse,
  .widget-bar,
  .widget-line,
  .widget-line-soft,
  .widget-window,
  .widget-connector,
  .widget-check {
    animation: none !important;
  }
}
</style>