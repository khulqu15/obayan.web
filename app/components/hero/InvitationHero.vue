<template>
  <section class="relative bg-gray-100 dark:bg-neutral-900">
    <div class="mx-auto max-w-340 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div
        class="relative isolate overflow-hidden rounded-4xl border border-gray-200/70 shadow-xl transition-transform duration-500 hover:scale-[1.01] dark:border-neutral-800"
      >
        <div class="absolute inset-0">
          <div
            class="absolute inset-0 bg-cover bg-center"
            :style="{ backgroundImage: `url(${state.bg})` }"
          />
          <div class="absolute inset-0 bg-[rgba(var(--app-primary-rgb),0.8)] mix-blend-multiply" />
          <div class="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-white/10" />
        </div>

        <div class="relative grid grid-cols-12 items-center gap-6">
          <div class="col-span-12 px-8 py-12 sm:px-12 sm:py-16 md:col-span-7">
            <p class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-white/90">
              <span class="inline-block size-1.5 rounded-full bg-white/80" />
              {{ state.eyebrow }}
            </p>

            <h1 class="mt-2 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              {{ state.titlePrefix }}
              <span class="underline decoration-white/40">
                {{ state.titleUnderline }}
              </span>
              {{ state.titleSuffix }}
              <span class="text-white drop-shadow">
                {{ state.brand }}
              </span>
            </h1>

            <p class="mt-3 max-w-xl text-white/90">
              {{ state.subtitle }}
            </p>

            <div class="mt-6 flex flex-wrap gap-3">
              <a
                v-if="state.primaryCTA?.label"
                :href="state.primaryCTA.href || '#'"
                class="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-white/90"
              >
                <ClientOnly>
                  <Icon
                    v-if="state.primaryCTA?.icon"
                    :icon="state.primaryCTA.icon"
                    class="size-4"
                  />
                </ClientOnly>
                {{ state.primaryCTA.label }}
              </a>

              <a
                v-if="state.secondaryCTA?.label"
                :href="state.secondaryCTA.href || '#'"
                class="inline-flex items-center gap-1.5 text-sm font-medium text-white/90 underline-offset-4 transition hover:underline"
              >
                {{ state.secondaryCTA.label }}

                <ClientOnly>
                  <Icon
                    v-if="state.secondaryCTA?.icon"
                    :icon="state.secondaryCTA.icon"
                    class="size-4"
                  />
                </ClientOnly>
              </a>
            </div>
          </div>

          <img
            v-if="state.pattern"
            :src="state.pattern"
            alt="Background Pattern"
            class="absolute bottom-0 -right-[60%] w-full opacity-80"
          >
        </div>
      </div>

      <figure
        v-if="state.hadithArabic || state.hadithTranslation || state.hadithSource"
        class="mt-6 rounded-2xl border border-gray-200/70 bg-white/80 p-5 shadow backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/70 sm:mt-8 sm:p-6"
      >
        <blockquote class="text-center">
          <p class="text-lg font-medium leading-relaxed text-gray-900 dark:text-white sm:text-xl">
            <span
              v-if="state.hadithArabic"
              class="mb-2 block text-2xl font-semibold sm:text-3xl"
            >
              {{ state.hadithArabic }}
            </span>

            <span
              v-if="state.hadithTranslation"
              class="block text-base text-gray-700 dark:text-neutral-300"
            >
              {{ state.hadithTranslation }}
            </span>
          </p>
        </blockquote>

        <figcaption
          v-if="state.hadithSource"
          class="mt-3 text-center text-sm text-gray-500 dark:text-neutral-400"
        >
          <ClientOnly>
            <Icon
              icon="ph:book-open-text"
              class="me-1 inline size-4 align-[-2px]"
            />
          </ClientOnly>
          {{ state.hadithSource }}
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { reactive, onMounted, onUnmounted } from 'vue'
import { useNuxtApp, useRuntimeConfig } from '#imports'
import { ref as dbRef, query, orderByChild, equalTo, onValue } from 'firebase/database'
import type { Query } from 'firebase/database'

const config = useRuntimeConfig()
const clientName = String(config.public.clientName || 'martopuro')

type CTA = {
  label: string
  href: string
  icon?: string
}

type Shape = {
  bg: string
  pattern?: string
  eyebrow: string
  titlePrefix: string
  titleUnderline: string
  titleSuffix: string
  brand: string
  subtitle: string
  hadithArabic?: string
  hadithTranslation?: string
  hadithSource?: string
  primaryCTA: CTA
  secondaryCTA: CTA
}

type LegacyShape = Partial<Shape> & {
  preText?: string
  highlightText?: string
  suffixText?: string
  ctaPrimary?: CTA
  ctaSecondary?: CTA
}

const props = defineProps<{
  override?: LegacyShape
}>()

const defaults: Shape = {
  bg: '/assets/images/profile.png',
  pattern: '/assets/pattern.png',
  eyebrow: 'Ajakan Kebaikan',
  titlePrefix: 'Ayo',
  titleUnderline: 'Mondok',
  titleSuffix: 'di',
  brand: 'Desa Martopuro',
  subtitle:
    'Website resmi Desa Martopuro sebagai pusat informasi, layanan masyarakat, berita desa, dan potensi lokal secara digital.',
  hadithArabic:
    'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
  hadithTranslation:
    '“Barangsiapa menempuh jalan untuk mencari ilmu, Allah akan mudahkan baginya jalan menuju Surga.”',
  hadithSource: 'HR. Muslim',
  primaryCTA: {
    label: 'Profil Desa',
    href: '/profile',
    icon: 'lucide:home'
  },
  secondaryCTA: {
    label: 'Layanan Desa',
    href: '/services',
    icon: 'lucide:arrow-right'
  }
}

const state = reactive<Shape>({ ...defaults })

function merge(base: Shape, patch: LegacyShape = {}): Shape {
  return {
    bg: patch.bg ?? base.bg,
    pattern: patch.pattern ?? base.pattern,
    eyebrow: patch.eyebrow ?? base.eyebrow,

    // Field baru dari editor
    titlePrefix: patch.titlePrefix ?? patch.preText ?? base.titlePrefix,
    titleUnderline: patch.titleUnderline ?? patch.highlightText ?? base.titleUnderline,
    titleSuffix: patch.titleSuffix ?? patch.suffixText ?? base.titleSuffix,

    brand: patch.brand ?? base.brand,
    subtitle: patch.subtitle ?? base.subtitle,

    hadithArabic: patch.hadithArabic ?? base.hadithArabic,
    hadithTranslation: patch.hadithTranslation ?? base.hadithTranslation,
    hadithSource: patch.hadithSource ?? base.hadithSource,

    // Field baru dari editor + fallback field lama
    primaryCTA: {
      ...base.primaryCTA,
      ...(patch.primaryCTA || patch.ctaPrimary || {})
    },
    secondaryCTA: {
      ...base.secondaryCTA,
      ...(patch.secondaryCTA || patch.ctaSecondary || {})
    }
  }
}

const KEY = 'InvitationHero'
let unsub: (() => void) | null = null

function subscribeFromRTDBByKey() {
  if (typeof window === 'undefined') return

  const { $realtimeDb }: any = useNuxtApp()

  const sectionsPath = `${clientName}/web/pages/home/sections`
  const q: Query = query(
    dbRef($realtimeDb, sectionsPath),
    orderByChild('key'),
    equalTo(KEY)
  )

  unsub = onValue(q, (snap) => {
    if (!snap.exists()) return

    const obj = snap.val() as Record<string, any>
    const first = Object.values(obj)[0] as any

    if (first && (first.enabled ?? true)) {
      const props = first.props || {}
      Object.assign(state, merge(defaults, props))
    }
  })
}

onMounted(() => {
  if (props.override) {
    Object.assign(state, merge(defaults, props.override))
    return
  }

  subscribeFromRTDBByKey()
})

onUnmounted(() => {
  if (unsub) unsub()
})
</script>