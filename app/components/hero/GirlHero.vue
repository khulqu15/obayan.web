<template>
  <section class="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-blue-50 to-white dark:from-emerald-900/20 dark:via-blue-900/10 dark:to-neutral-900">
    <!-- Playful BG -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
     </div>

    <div class="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
      <div class="relative grid grid-cols-12 gap-8 items-center rounded-[2rem]
                  bg-white/75 dark:bg-neutral-900/60 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(16,185,129,0.25)]
                  p-6 sm:p-10">

        <!-- Left: content -->
        <div class="col-span-12 md:col-span-6 lg:col-span-7">
          <!-- Eyebrow -->
          <p class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider 700 dark:300">
            <span class="inline-block size-1.5 rounded-full bg-emerald-500/90 animate-pulse" />
            {{ state.eyebrow }}
          </p>

          <!-- Title -->
          <h1 class="mt-2 text-xl sm:text-2xl lg:text-3xl font-bold leading-tight text-neutral-900 dark:text-white">
            {{ state.title }}
          </h1>

          <!-- Description -->
          <p class="mt-2 text-neutral-700/90 dark:text-neutral-300 max-w-2xl leading-relaxed">
            {{ state.description }}
          </p>

          <!-- Feature pills (duolingo-ish) -->
          <div class="mt-5 flex flex-wrap gap-2.5">
            <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold
                         bg-emerald-100 800 dark:bg-emerald-900/40 dark:200">
              <ClientOnly><Icon icon="ph:sparkle" class="size-3.5" /></ClientOnly> Kemandirian
            </span>
            <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold
                         bg-blue-100 blue800 dark:bg-blue-900/40 dark:blue200">
              <ClientOnly><Icon icon="ph:check-circle" class="size-3.5" /></ClientOnly> Disiplin
            </span>
            <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold
                         bg-emerald-100 800 dark:bg-emerald-900/40 dark:200">
              <ClientOnly><Icon icon="ph:book-open-text" class="size-3.5" /></ClientOnly> Tahfidz
            </span>
            <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold
                         bg-blue-100 blue800 dark:bg-blue-900/40 dark:blue200">
              <ClientOnly><Icon icon="ph:users-three" class="size-3.5" /></ClientOnly> Kepemimpinan
            </span>
          </div>

          <div class="mt-7 flex flex-wrap gap-3">
            <a :href="state.ctaLocation.href" target="_blank" rel="noopener"
               class="hs-btn inline-flex items-center gap-2 rounded-2xl bg-emerald-600 text-white px-5 py-3 text-sm font-bold
                      hover:bg-emerald-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-400/60 active:scale-[0.98] transition">
              <ClientOnly><Icon v-if="state.ctaLocation.icon" :icon="state.ctaLocation.icon" class="size-4" /></ClientOnly>
              {{ state.ctaLocation.label }}
            </a>
            <a :href="state.ctaContact.href"
               class="inline-flex items-center gap-2 rounded-2xl border border-neutral-300 dark:border-neutral-700
                      px-5 py-3 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800
                      text-neutral-800 dark:text-neutral-200 active:scale-[0.98] transition">
              <ClientOnly><Icon v-if="state.ctaContact.icon" :icon="state.ctaContact.icon" class="size-4" /></ClientOnly>
              {{ state.ctaContact.label }}
            </a>
          </div>

          <!-- Trust mini -->
          <div class="mt-5 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
            <div class="flex items-center gap-1">
              <ClientOnly>
                <Icon icon="ph:star-fill" class="size-4 text-amber-400" />
                <Icon icon="ph:star-fill" class="size-4 text-amber-400" />
                <Icon icon="ph:star-fill" class="size-4 text-amber-400" />
                <Icon icon="ph:star-fill" class="size-4 text-amber-400" />
                <Icon icon="ph:star-fill" class="size-4 text-amber-400" />
              </ClientOnly>
            </div>
            <span>Direkomendasikan wali santri</span>
          </div>
        </div>

        <div class="col-span-12 md:col-span-6 lg:col-span-5">
          <div class="relative aspect-[4/3] rounded-[1.75rem] ring-1 ring-emerald-200/70 dark:ring-neutral-800 bg-white/60 dark:bg-neutral-800/40">
            <img v-if="state.image" :src="state.image" alt="Pondok Putri" class="size-full rounded-[1.75rem] object-cover">

            <div class="absolute left-4 top-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold
                        bg-white/85 dark:bg-neutral-900/70 backdrop-blur border border-neutral-200 dark:border-neutral-700
                        text-neutral-700 dark:text-neutral-300 shadow-sm">
              <span class="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
              Putri Area
            </div>

            <!-- Floating stat cards -->
            <div class="absolute -left-3 bottom-6">
              <div class="rounded-2xl bg-white/95 dark:bg-neutral-900/80 backdrop-blur border border-neutral-200 dark:border-neutral-700 shadow-md px-3.5 py-2.5 translate-y-2 animate-[float_6s_ease-in-out_infinite]">
                <div class="text-xs text-neutral-500">Santri awal</div>
                <div class="text-lg font-extrabold text-neutral-900 dark:text-white">70+</div>
              </div>
            </div>
            <div class="absolute -right-3 top-10">
              <div class="rounded-2xl bg-white/95 dark:bg-neutral-900/80 backdrop-blur border border-neutral-200 dark:border-neutral-700 shadow-md px-3.5 py-2.5 animate-[float_7s_ease-in-out_infinite]">
                <div class="flex items-center gap-1.5 text-xs text-neutral-500">
                  <ClientOnly><Icon icon="ph:chalkboard-teacher" class="size-3.5 500" /></ClientOnly> Ustadzah
                </div>
                <div class="text-sm font-bold text-neutral-900 dark:text-white">Kompeten</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useNuxtApp } from '#app'
import { ref as dbRef, query, orderByChild, equalTo, onValue, off, Query } from 'firebase/database'

type CTA = { label: string; href: string; icon?: string }
type Shape = {
  eyebrow: string
  title: string
  description: string
  image: string
  ctaLocation: CTA
  ctaContact: CTA
}

const props = defineProps<{ override?: Partial<Shape> }>()

const defaults: Shape = {
  eyebrow: 'Informasi Pondok Putri',
  title: 'Pondok Pesantren ALBERR Putri',
  description:
    'Pondok Pesantren Al-Berr membuka unit pendidikan putri dengan sekitar 70 santri awal dan dibina ustadzah berkompeten. Mengusung kemandirian, disiplin, serta program pendidikan setara santri putra, unit ini menegaskan Al-Berr sebagai pesantren komprehensif bagi putra-putri. Kehadiran pondok putri menegaskan Al-Berr sebagai pesantren komprehensif yang melayani santri putra dan putri serta siap menghadapi tantangan zaman.',
  image: '/assets/images/gallery/12.jpg',
  ctaLocation: { label: 'Lihat Lokasi', href: 'https://maps.app.goo.gl/BTtkMt27swwav4TA8', icon: 'ph:map-pin-area' },
  ctaContact:  { label: 'Kontak Pengurus', href: 'tel:+6281234567890', icon: 'ph:phone-call' }
}

const state = reactive<Shape>({ ...defaults })
const KEY = 'PondokPutriHero'
let stop: (() => void) | null = null

function merge(b: Shape, p: Partial<Shape> = {}): Shape {
  return {
    eyebrow: p.eyebrow ?? b.eyebrow,
    title: p.title ?? b.title,
    description: p.description ?? b.description,
    image: p.image ?? b.image,
    ctaLocation: { ...b.ctaLocation, ...(p.ctaLocation || {}) },
    ctaContact: { ...b.ctaContact, ...(p.ctaContact || {}) }
  }
}

function subscribeByKey() {
  const { $realtimeDb } = useNuxtApp()
  const path = 'alberr/web/pages/home/sections'
  const q: Query = query(dbRef($realtimeDb, path), orderByChild('key'), equalTo(KEY))
  stop = onValue(q, (snap) => {
    if (!snap.exists()) return
    const first = Object.values(snap.val() as Record<string, any>)[0] as any
    if (!first) return
    if (first.enabled === false) return
    const props = first.props || {}
    Object.assign(state, merge(defaults, props))
  })
}

onMounted(() => {
  if (props.override) {
    Object.assign(state, merge(defaults, props.override))
  } else {
    subscribeByKey()
  }
})

onUnmounted(() => { if (stop) stop() })
</script>
