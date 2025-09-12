<template>
  <section class="relative dark:bg-neutral-900 bg-gray-100">
    <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

      <div
        class="relative overflow-hidden rounded-[2rem] shadow-xl border border-gray-200/70 dark:border-neutral-800 isolate transition-transform duration-500 hover:scale-[1.01]">
        <div class="absolute inset-0">
          <div class="absolute inset-0 bg-center bg-cover" :style="{ backgroundImage: `url(${state.bg})` }" />
          <div class="absolute inset-0 bg-[rgba(var(--app-primary-rgb),0.8)] mix-blend-multiply" />
          <div class="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10" />
        </div>

        <div class="relative grid grid-cols-12 gap-6 items-center">
          <div class="col-span-12 md:col-span-7 px-8 sm:px-12 py-12 sm:py-16">
            <p class="inline-flex items-center gap-2 text-white/90 text-[11px] font-semibold uppercase tracking-wider">
              <span class="inline-block size-1.5 rounded-full bg-white/80" />
              {{ state.eyebrow }}
            </p>

            <h1 class="mt-2 text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              {{ state.preText }}
              <span class="underline decoration-white/40">{{ state.highlightText }}</span>
              {{ state.suffixText }}
              <span class="text-white drop-shadow">{{ state.brandText }}</span>
            </h1>

            <p class="mt-3 text-white/90 max-w-xl">
              {{ state.subtitle }}
            </p>

            <div class="mt-6 flex flex-wrap gap-3">
              <a :href="state.ctaPrimary.href"
                 class="inline-flex items-center gap-2 rounded-xl bg-white text-blue-700 px-5 py-3 text-sm font-semibold hover:bg-white/90">
                <ClientOnly>
                  <Icon v-if="state.ctaPrimary?.icon" :icon="state.ctaPrimary.icon" class="size-4" />
                </ClientOnly>
                {{ state.ctaPrimary.label }}
              </a>
              <a :href="state.ctaSecondary.href"
                 class="inline-flex items-center gap-1.5 text-white/90 text-sm font-medium underline-offset-4 hover:underline">
                {{ state.ctaSecondary.label }}
                <ClientOnly>
                  <Icon v-if="state.ctaSecondary?.icon" :icon="state.ctaSecondary.icon" class="size-4" />
                </ClientOnly>
              </a>
            </div>
          </div>

          <img v-if="state.pattern"
               :src="state.pattern"
               alt="Background Pattern"
               class="absolute bottom-0 w-full opacity-80 -right-[60%]">
        </div>
      </div>

      <!-- Hadist -->
      <figure v-if="state.hadithArabic || state.hadithTranslation || state.hadithSource"
        class="mt-6 sm:mt-8 rounded-2xl border border-gray-200/70 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70 backdrop-blur p-5 sm:p-6 shadow">
        <blockquote class="text-center">
          <p class="text-lg sm:text-xl font-medium text-gray-900 dark:text-white leading-relaxed">
            <span v-if="state.hadithArabic" class="block text-2xl sm:text-3xl mb-2 font-semibold">{{ state.hadithArabic }}</span>
            <span v-if="state.hadithTranslation" class="block text-gray-700 dark:text-neutral-300 text-base">
              {{ state.hadithTranslation }}
            </span>
          </p>
        </blockquote>
        <figcaption v-if="state.hadithSource" class="mt-3 text-center text-sm text-gray-500 dark:text-neutral-400">
          <ClientOnly><Icon icon="ph:book-open-text" class="inline size-4 me-1 align-[-2px]" /></ClientOnly>
          {{ state.hadithSource }}
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useNuxtApp } from '#app'
import {
  ref as dbRef,
  query, orderByChild, equalTo, onValue, off, Query
} from 'firebase/database'

type CTA = { label: string; href: string; icon?: string }
type Shape = {
  bg: string; pattern?: string; eyebrow: string;
  preText: string; highlightText: string; suffixText: string; brandText: string;
  subtitle: string;
  hadithArabic?: string; hadithTranslation?: string; hadithSource?: string;
  ctaPrimary: CTA; ctaSecondary: CTA
}

const props = defineProps<{ override?: Partial<Shape> }>()

const defaults: Shape = {
  bg: '/assets/images/profile.png',
  pattern: '/assets/pattern.png',
  eyebrow: 'Ajakan Kebaikan',
  preText: 'Ayo',
  highlightText: 'Mondok',
  suffixText: 'di',
  brandText: 'Ponpes Alberr',
  subtitle: 'Lingkungan yang menumbuhkan adab, ilmu, dan kemandirian. Kurikulum diniyah & formal terpadu, pembinaan tahfidz, serta program kepemimpinan dan pengabdian.',
  hadithArabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
  hadithTranslation: '“Barangsiapa menempuh jalan untuk mencari ilmu, Allah akan mudahkan baginya jalan menuju Surga.”',
  hadithSource: 'HR. Muslim',
  ctaPrimary: { label: 'Al Berr', href: '/profile', icon: 'ph:student' },
  ctaSecondary: { label: 'Pelajari lebih lanjut', href: '/program', icon: 'ph:arrow-right' }
}

const state = reactive<Shape>({ ...defaults })
function merge(b: Shape, p: Partial<Shape> = {}): Shape {
  return {
    bg: p.bg ?? b.bg,
    pattern: p.pattern ?? b.pattern,
    eyebrow: p.eyebrow ?? b.eyebrow,
    preText: p.preText ?? b.preText,
    highlightText: p.highlightText ?? b.highlightText,
    suffixText: p.suffixText ?? b.suffixText,
    brandText: p.brandText ?? b.brandText,
    subtitle: p.subtitle ?? b.subtitle,
    hadithArabic: p.hadithArabic ?? b.hadithArabic,
    hadithTranslation: p.hadithTranslation ?? b.hadithTranslation,
    hadithSource: p.hadithSource ?? b.hadithSource,
    ctaPrimary: { ...b.ctaPrimary, ...(p.ctaPrimary || {}) },
    ctaSecondary: { ...b.ctaSecondary, ...(p.ctaSecondary || {}) }
  }
}

const KEY = 'InvitationHero'
let unsub: (() => void) | null = null

function subscribeFromRTDBByKey() {
  if (typeof window === 'undefined') return
  const { $realtimeDb } = useNuxtApp()

  // /alberr/web/pages/home/sections where each child has { key, enabled, props, ... }
  const sectionsPath = 'alberr/web/pages/home/sections'
  const q: Query = query(dbRef($realtimeDb, sectionsPath), orderByChild('key'), equalTo(KEY))

  unsub = onValue(q, (snap) => {
    if (!snap.exists()) return
    const obj = snap.val() as Record<string, any>
    const first = Object.values(obj)[0] as any
    // optional: cek enabled
    if (first && (first.enabled ?? true)) {
      const props = first.props || {}
      Object.assign(state, merge(defaults, props))
    }
  })
}

onMounted(() => {
  if (props.override) {
    Object.assign(state, merge(defaults, props.override))
  } else {
    subscribeFromRTDBByKey()
  }
})

onUnmounted(() => { if (unsub) unsub(); })
</script>
