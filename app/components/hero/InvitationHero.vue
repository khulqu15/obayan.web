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
                <ClientOnly><Icon icon="ph:student" class="size-4" /></ClientOnly>
                {{ state.ctaPrimary.label }}
              </a>
              <a :href="state.ctaSecondary.href"
                 class="inline-flex items-center gap-1.5 text-white/90 text-sm font-medium underline-offset-4 hover:underline">
                {{ state.ctaSecondary.label }}
                <ClientOnly><Icon icon="ph:arrow-right" class="size-4" /></ClientOnly>
              </a>
            </div>
          </div>

          <img src="/assets/pattern.png" alt="Mosque Pattern" class="absolute bottom-0 w-full opacity-80 -right-[60%]">
        </div>
      </div>

      <figure
        class="mt-6 sm:mt-8 rounded-2xl border border-gray-200/70 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70 backdrop-blur p-5 sm:p-6 shadow">
        <blockquote class="text-center">
          <p class="text-lg sm:text-xl font-medium text-gray-900 dark:text-white leading-relaxed">
            <span class="block text-2xl sm:text-3xl mb-2 font-semibold">مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا
            سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ</span>
            <span class="block text-gray-700 dark:text-neutral-300 text-base">
              “Barangsiapa menempuh jalan untuk mencari ilmu, Allah akan mudahkan baginya jalan menuju Surga.”
            </span>
          </p>
        </blockquote>
        <figcaption class="mt-3 text-center text-sm text-gray-500 dark:text-neutral-400">
          <ClientOnly><Icon icon="ph:book-open-text" class="inline size-4 me-1 align-[-2px]" /></ClientOnly>
          HR. Muslim
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

type CTA = { label: string; href: string }
type Shape = {
  bg: string
  eyebrow: string
  preText: string
  highlightText: string
  suffixText: string
  brandText: string
  subtitle: string
  ctaPrimary: CTA
  ctaSecondary: CTA
}

const defaults: Shape = {
  bg: '/assets/images/profile.png',
  eyebrow: 'Ajakan Kebaikan',
  preText: 'Ayo',
  highlightText: 'Mondok',
  suffixText: 'di',
  brandText: 'Ponpes Alberr',
  subtitle:
    'Lingkungan yang menumbuhkan adab, ilmu, dan kemandirian. Kurikulum diniyah & formal terpadu, pembinaan tahfidz, serta program kepemimpinan dan pengabdian.',
  ctaPrimary: { label: 'Al Berr', href: '/profile' },
  ctaSecondary: { label: 'Pelajari lebih lanjut', href: '/program' }
}

const state = reactive<Shape>({ ...defaults })

/** Merge util agar nested object (CTA) ikut tergabung */
function merge(base: Shape, patch: Partial<Shape> = {}): Shape {
  return {
    bg: patch.bg ?? base.bg,
    eyebrow: patch.eyebrow ?? base.eyebrow,
    preText: patch.preText ?? base.preText,
    highlightText: patch.highlightText ?? base.highlightText,
    suffixText: patch.suffixText ?? base.suffixText,
    brandText: patch.brandText ?? base.brandText,
    subtitle: patch.subtitle ?? base.subtitle,
    ctaPrimary: { ...base.ctaPrimary, ...(patch.ctaPrimary || {}) },
    ctaSecondary: { ...base.ctaSecondary, ...(patch.ctaSecondary || {}) }
  }
}

/**
 * Ambil konten dari Firestore:
 *   doc: alberr/pages/home
 *   struktur diharapkan: { sections: [{ key: 'InvitationHero'|'InfoHero', props: Shape }, ...] }
 *   fallback: field langsung: invitationHero / infoHero
 */
async function fetchFromFirebase() {
  if (typeof window === 'undefined') return
  try {
    const { getFirestore, doc, getDoc } = await import('firebase/firestore')
    const db = getFirestore()
    const snap = await getDoc(doc(db, 'alberr/pages', 'home'))
    if (!snap.exists()) return

    const data = snap.data() as any
    let props: Partial<Shape> | undefined

    // cari di sections[]
    if (Array.isArray(data.sections)) {
      const sec = data.sections.find(
        (s: any) => s?.key === 'InvitationHero' || s?.key === 'InfoHero'
      )
      props = sec?.props
    }

    // fallback langsung di root dokumen
    if (!props && data.invitationHero) props = data.invitationHero
    if (!props && data.infoHero) props = data.infoHero

    if (props && typeof props === 'object') {
      const merged = merge(defaults, props)
      Object.assign(state, merged)
    }
  } catch (e) {
    // diamkan dan biarkan default (atau log jika perlu)
    // console.error('[InfoHero] Firebase fetch failed:', e)
  }
}

onMounted(fetchFromFirebase)
</script>
