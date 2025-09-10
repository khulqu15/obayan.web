<template>
  <section id="features" class="relative py-24 overflow-hidden">
    <!-- Background gradient + subtle grid -->
    <div class="absolute inset-0 -z-10">
      <div class="h-full w-full bg-gradient-to-b from-emerald-50/70 via-white to-white dark:from-emerald-900/10 dark:via-neutral-900 dark:to-neutral-950" />
      <div class="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(16,185,129,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.07)_1px,transparent_1px)] [background-size:38px_38px]" />
    </div>

    <div class="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Heading -->
      <div class="text-center max-w-3xl mx-auto">
        <h2 class="text-3xl sm:text-5xl font-extrabold tracking-tight">
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">
            Semua yang dibutuhkan pondok
          </span>
        </h2>
        <p class="mt-3 text-gray-700 dark:text-neutral-300 text-base leading-relaxed">
          Satu platform untuk operasional harian hingga pelaporan.
        </p>
      </div>

      <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <article
          v-for="(f, i) in features"
          :key="f.title"
          class="group relative rounded-2xl border border-gray-200/70 dark:border-neutral-800 bg-white/70 dark:bg-white/5 backdrop-blur-xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-emerald-400"
          :style="cardDelayStyle(i)"
        >
          <div class="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"
               aria-hidden="true"
               style="background: radial-gradient(80% 60% at 50% 0%, rgba(16,185,129,0.12), transparent 60%);">
          </div>

          <div class="flex items-start gap-4">
            <div class="relative">
              <div class="size-11 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300 flex items-center justify-center ring-1 ring-emerald-200/60 dark:ring-emerald-800/40 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                <ClientOnly>
                  <Icon :icon="f.icon" class="size-5" aria-hidden="true" />
                </ClientOnly>
              </div>
              <span class="absolute -top-1 -right-1 inline-flex size-3 rounded-full bg-emerald-500/90 ring-4 ring-white dark:ring-neutral-900"></span>
            </div>

            <div class="min-w-0">
              <h3 class="font-semibold text-gray-900 dark:text-white tracking-tight">
                {{ f.title }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-neutral-300 mt-1">
                {{ f.desc }}
              </p>
            </div>
          </div>

          <!-- bottom divider -->
          <div class="mt-5 h-px bg-gradient-to-r from-transparent via-gray-200/80 to-transparent dark:via-neutral-800/80"></div>

          <div class="mt-4 flex items-center justify-between text-sm">
            <span class="text-gray-500 dark:text-neutral-400">Bagian dari ekosistem Obayan</span>
            <a v-if="f.href" :href="f.href" class="font-medium text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1">
              Pelajari
              <span class="i-lucide-arrow-right size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useObayan } from '~/composables/useObayan'
import { computed } from 'vue'

const { features } = useObayan()

const reduced = typeof window !== 'undefined'
  ? window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  : true

const cardDelayStyle = (i: number) => {
  if (reduced) return {}
  const d = Math.min(i * 60, 360) // max 360ms
  return {
    animation: `fadeUp .6s ease ${d}ms both`
  } as Record<string, string>
}
</script>

<style scoped>
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
