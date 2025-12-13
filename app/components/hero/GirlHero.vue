<template>
  <section class="relative overflow-hidden bg-linear-to-b from-gray-100 via-blue-50 to-gray-100 dark:from-emerald-900/20 dark:via-blue-900/10 dark:to-neutral-900">
    <div class="max-w-352 mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
      <div class="relative grid grid-cols-12 gap-8 items-center rounded-4xl
                  bg-white/75 dark:bg-neutral-900/60 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(16,185,129,0.25)]
                  p-6 sm:p-10">

        <div class="col-span-12 md:col-span-6 lg:col-span-7">
          <p class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider 700 dark:300">
            <span class="inline-block size-1.5 rounded-full bg-emerald-500/90 animate-pulse" />
            {{ eyebrow }}
          </p>
          <h1 class="mt-2 text-xl sm:text-2xl lg:text-3xl font-bold leading-tight text-neutral-900 dark:text-white">
            {{ title }}
          </h1>
          <p class="mt-2 text-sm text-neutral-700/90 dark:text-neutral-300 max-w-2xl leading-relaxed">
            {{ description }}
          </p>
          <div class="mt-5 flex flex-wrap gap-2.5">
            <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold bg-emerald-100 800 dark:bg-emerald-900/40 dark:200">
              <ClientOnly><Icon icon="ph:sparkle" class="size-3.5" /></ClientOnly> Kemandirian
            </span>
            <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold bg-blue-100 800 dark:bg-blue-900/40 dark:200">
              <ClientOnly><Icon icon="ph:check-circle" class="size-3.5" /></ClientOnly> Disiplin
            </span>
            <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold bg-emerald-100 800 dark:bg-emerald-900/40 dark:200">
              <ClientOnly><Icon icon="ph:book-open-text" class="size-3.5" /></ClientOnly> Tahfidz
            </span>
            <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold bg-blue-100 800 dark:bg-blue-900/40 dark:200">
              <ClientOnly><Icon icon="ph:users-three" class="size-3.5" /></ClientOnly> Kepemimpinan
            </span>
          </div>

          <div class="mt-7 flex flex-wrap gap-3">
            <a :href="ctaLocation.href" target="_blank" rel="noopener"
               class="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 text-white px-5 py-3 text-sm font-bold
                      hover:bg-emerald-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-400/60 active:scale-[0.98] transition">
              <ClientOnly><Icon v-if="ctaLocation.icon" :icon="ctaLocation.icon" class="size-4" /></ClientOnly>
              {{ ctaLocation.label }}
            </a>
            <a :href="ctaContact.href"
               class="inline-flex items-center gap-2 rounded-2xl border border-neutral-300 dark:border-neutral-700
                      px-5 py-3 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800
                      text-neutral-800 dark:text-neutral-200 active:scale-[0.98] transition">
              <ClientOnly><Icon v-if="ctaContact.icon" :icon="ctaContact.icon" class="size-4" /></ClientOnly>
              {{ ctaContact.label }}
            </a>
          </div>

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
          <div class="relative aspect-[4/3] rounded-[1.75rem] dark:ring-neutral-800 bg-white/60 dark:bg-neutral-800/40">
            <img v-if="image" :src="image" alt="Pondok Putri" class="size-full rounded-[1.75rem] object-cover">
            <div class="absolute left-4 top-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold
                        bg-white/85 dark:bg-neutral-900/70 backdrop-blur border border-neutral-200 dark:border-neutral-700
                        text-neutral-700 dark:text-neutral-300 shadow-sm">
              <span class="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
              Putri Area
            </div>

            <div class="absolute -left-3 bottom-6">
              <div class="rounded-2xl bg-white/95 dark:bg-neutral-900/80 backdrop-blur border border-neutral-200 dark:border-neutral-700 shadow-md px-3.5 py-2.5 translate-y-2 animate-[float_6s_ease-in-out_infinite]">
                <div class="text-xs text-neutral-500">{{ floatingBottomTitle }}</div>
                <div class="text-lg font-extrabold text-neutral-900 dark:text-white">{{ floatingBottomSubtitle }}</div>
              </div>
            </div>

            <div class="absolute -right-3 top-10">
              <div class="rounded-2xl bg-white/95 dark:bg-neutral-900/80 backdrop-blur border border-neutral-200 dark:border-neutral-700 shadow-md px-3.5 py-2.5 animate-[float_7s_ease-in-out_infinite]">
                <div class="flex items-center gap-1.5 text-xs text-neutral-500">
                  <ClientOnly><Icon v-if="floatingTopIcon" :icon="floatingTopIcon" class="size-3.5 text-neutral-500" /></ClientOnly>
                  {{ floatingTopTitle }}
                </div>
                <div class="text-sm font-bold text-neutral-900 dark:text-white">{{ floatingTopSubtitle }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

type CTA = { label: string; href: string; icon?: string }
type Shape = {
  eyebrow: string
  title: string
  description: string
  image: string
  ctaLocation: CTA
  ctaContact: CTA
  floatingTopTitle: string
  floatingTopSubtitle: string
  floatingTopIcon?: string
  floatingBottomTitle: string
  floatingBottomSubtitle: string
}

const defaults: Shape = {
  eyebrow: 'Informasi Pondok Putri',
  title: 'Pondok Pesantren ALBERR Putri',
  description:
    'Pondok Pesantren Al-Berr membuka unit pendidikan putri dengan sekitar 70 santri awal dan dibina ustadzah berkompeten. Mengusung kemandirian, disiplin, serta program pendidikan setara santri putra, unit ini menegaskan Al-Berr sebagai pesantren komprehensif bagi putra-putri.',
  image: '/assets/images/gallery/12.jpg',
  ctaLocation: { label: 'Lihat Lokasi', href: 'https://maps.app.goo.gl/BTtkMt27swwav4TA8', icon: 'ph:map-pin-area' },
  ctaContact:  { label: 'Kontak Pengurus', href: 'tel:+6281234567890', icon: 'ph:phone-call' },
  floatingTopTitle: 'Ustadzah',
  floatingTopSubtitle: 'Kompeten',
  floatingTopIcon: 'ph:chalkboard-teacher',
  floatingBottomTitle: 'Santri awal',
  floatingBottomSubtitle: '70+'
}

/**
 * Komponen ini menerima:
 * - flattened props dari CMS (s.props langsung)
 * - atau bentuk { props: {...} }
 * - atau { override: {...} } untuk preview editor
 */
const raw = defineProps<Partial<Shape> & { props?: Partial<Shape>; override?: Partial<Shape> }>()

function mergeCta(base: CTA, patch?: Partial<CTA>): CTA { return { ...base, ...(patch || {}) } }
function normalize(input: Partial<Shape> = {}): Shape {
  return {
    eyebrow: input.eyebrow ?? defaults.eyebrow,
    title: input.title ?? defaults.title,
    description: input.description ?? defaults.description,
    image: input.image ?? defaults.image,
    ctaLocation: mergeCta(defaults.ctaLocation, input.ctaLocation),
    ctaContact:  mergeCta(defaults.ctaContact,  input.ctaContact),
    floatingTopTitle: input.floatingTopTitle ?? defaults.floatingTopTitle,
    floatingTopSubtitle: input.floatingTopSubtitle ?? defaults.floatingTopSubtitle,
    floatingTopIcon: input.floatingTopIcon ?? defaults.floatingTopIcon,
    floatingBottomTitle: input.floatingBottomTitle ?? defaults.floatingBottomTitle,
    floatingBottomSubtitle: input.floatingBottomSubtitle ?? defaults.floatingBottomSubtitle,
  }
}

const merged = computed<Shape>(() => {
  const inner = raw.props || {}
  const flat  = { ...inner, ...raw } as Partial<Shape>
  delete (flat as any).props
  delete (flat as any).override
  const final = { ...flat, ...(raw.override || {}) }
  return normalize(final)
})

/* expose ke template */
const eyebrow = computed(()=>merged.value.eyebrow)
const title = computed(()=>merged.value.title)
const description = computed(()=>merged.value.description)
const image = computed(()=>merged.value.image)
const ctaLocation = computed(()=>merged.value.ctaLocation)
const ctaContact  = computed(()=>merged.value.ctaContact)
const floatingTopTitle = computed(()=>merged.value.floatingTopTitle)
const floatingTopSubtitle = computed(()=>merged.value.floatingTopSubtitle)
const floatingTopIcon = computed(()=>merged.value.floatingTopIcon)
const floatingBottomTitle = computed(()=>merged.value.floatingBottomTitle)
const floatingBottomSubtitle = computed(()=>merged.value.floatingBottomSubtitle)
</script>
