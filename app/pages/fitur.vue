<template>
  <div class="text-gray-800 dark:text-neutral-200 overflow-hidden pt-24">
    <section :key="isDetail ? `detail-${slug}` : 'list-hero'" class="relative">
      <div aria-hidden="true" class="pointer-events-none absolute inset-0">
        <div class="absolute -top-16 -left-24 w-[42rem] h-[42rem] rounded-full opacity-40 blur-3xl
                    bg-gradient-to-br from-emerald-200 to-teal-200 dark:from-emerald-900/40 dark:to-teal-900/30" />
        <div class="absolute top-28 -right-24 w-[36rem] h-[36rem] rounded-full opacity-30 blur-3xl
                    bg-gradient-to-tr from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30" />
        <div class="absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent_80%)]">
          <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div v-if="!activeFeature" class="text-center">
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
            <Icon icon="solar:stars-line-duotone" class="size-4" />
            Obayan • Fitur Lengkap & Modular
          </span>
          <h1 class="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Jelajahi Fitur<span class="text-emerald-600"> Obayan</span>
          </h1>
          <p class="mt-3 text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Semua yang Anda perlukan untuk kelola pendidikan & pesantren: akademik, operasional, keuangan, add-on presensi & automations.
          </p>

          <div class="mt-6 flex flex-col items-stretch sm:items-center gap-2 sm:gap-3 max-w-3xl mx-auto">
            <div class="relative w-full">
              <input
                v-model="ui.query"
                type="text"
                placeholder="Cari fitur… (misal: perizinan, nilai, keuangan)"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/70 backdrop-blur placeholder:text-gray-400
                       focus:outline-hidden focus:ring-2 focus:ring-emerald-500 dark:bg-neutral-900/70 dark:border-neutral-700" />
              <div class="absolute right-2 top-1/2 -translate-y-1/2">
                <button class="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
                  <Icon icon="lucide:search" class="size-4" />
                </button>
              </div>
            </div>
            <div class="flex items-center gap-1.5">
              <button
                v-for="c in categories"
                :key="c"
                @click="toggleCategory(c)"
                class="px-3 py-2 rounded-xl border text-sm transition-colors whitespace-nowrap"
                :class="ui.selectedCategories.includes(c)
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-800'
                  : 'border-gray-200 bg-white/70 hover:bg-gray-50 dark:bg-neutral-900/70 dark:border-neutral-700'">
                {{ c }}
              </button>
            </div>
          </div>
        </div>

        <div v-else class="flex items-center gap-2 text-sm">
          <NuxtLink href="/fitur" class="inline-flex items-center gap-1 text-gray-600 dark:text-neutral-400 hover:text-emerald-600">
            <Icon icon="lucide:home" class="size-4" /> Fitur
          </NuxtLink>
          <Icon icon="lucide:chevron-right" class="size-4 text-gray-400" />
          <span class="font-semibold">{{ activeFeature.title }}</span>
        </div>
      </div>
    </section>

    <!-- LIST -->
    <section  v-if="!isDetail" :key="'list-section'" class="relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <article
            v-for="f in filteredFeatures"
            :key="f.slug"
            class="group rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-4 sm:p-5 transition hover:shadow-md dark:bg-neutral-900/70 dark:border-neutral-700">
            <div class="flex-col items-start gap-3">
              <div class="size-10 mb-2 rounded-xl flex items-center justify-center" :class="badgeTone(f.tone)">
                <Icon :icon="f.icon" class="size-5" />
              </div>
              <div class="grow">
                <div class="flex items-center gap-2">
                  <h3 class="font-bold text-lg">{{ f.title }}</h3>
                  <span class="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide" :class="chipTone(f.tone)">
                    {{ f.category }}
                  </span>
                </div>
                <p class="mt-1 text-sm text-gray-600 dark:text-neutral-400 line-clamp-2">{{ f.short }}</p>
                <div class="mt-2 flex flex-wrap gap-1.5">
                  <span v-for="t in f.tags" :key="t" class="px-2 py-1 rounded-full text-[11px] bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-400">
                    {{ t }}
                  </span>
                </div>
                <div class="mt-4 flex items-center justify-between">
                  <NuxtLink
                    :href="`/fitur?slug=${f.slug}`"
                    class="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700">
                    Lihat detail
                    <Icon icon="lucide:arrow-right" class="size-4" />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- Why (ringkas) -->
        <div class="mt-12">
          <h2 class="text-2xl font-extrabold">Kenapa memilih Obayan?</h2>
          <p class="text-gray-600 dark:text-neutral-400">Fokus pada yang penting, <b>kami urus sisanya</b>.</p>
          <div class="mt-6 grid md:grid-cols-3 gap-4 sm:gap-6">
            <div
              v-for="w in whyObayan"
              :key="w.title"
              class="rounded-2xl p-5 border bg-white/80 backdrop-blur border-gray-200 dark:border-gray-900 hover:shadow-md transition dark:bg-neutral-900/70 dark:border-neutral-700">
              <div class="size-10 rounded-xl flex items-center justify-center mb-3" :class="badgeTone(w.tone)">
                <Icon :icon="w.icon" class="size-5" />
              </div>
              <h3 class="font-semibold">{{ w.title }}</h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-neutral-400">{{ w.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-else :key="`detail-section-${slug}`"> 
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div class="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-5 sm:p-7 dark:bg-neutral-900/70 dark:border-neutral-700">
          <div class="flex flex-col lg:flex-row items-start gap-6">
            <div class="flex-1 flex items-start gap-4">
              <div class="size-12 rounded-2xl flex items-center justify-center" :class="badgeTone(activeFeature.tone)">
                <Icon :icon="activeFeature.icon" class="size-6" />
              </div>
              <div class="grow">
                <div class="flex flex-wrap items-center gap-2">
                  <h1 class="text-2xl sm:text-3xl font-extrabold">{{ activeFeature.title }}</h1>
                  <span class="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide" :class="chipTone(activeFeature.tone)">
                    {{ activeFeature.category }}
                  </span>
                </div>
                <p class="mt-1 text-gray-600 dark:text-neutral-400 max-w-2xl">{{ activeFeature.short }}</p>
                <div class="mt-3 flex flex-wrap gap-1.5">
                  <span
                    v-for="t in activeFeature.tags"
                    :key="t"
                    class="px-2 py-1 rounded-full text-[11px] bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-400">
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Nav anchors -->
            <div class="w-full lg:w-72 shrink-0">
              <div class="rounded-2xl border border-gray-200 p-3 text-sm bg-white/60 backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/60">
                <p class="font-semibold mb-2">Navigasi</p>
                <ul class="space-y-1">
                  <li v-for="(sec, i) in sections(activeFeature)" :key="i">
                    <a :href="`#sec-${i}`" class="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 dark:text-neutral-400 dark:hover:text-emerald-400">
                      <Icon :icon="sec.icon" class="size-4" /> {{ sec.title }}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Sections -->
        <div class="mt-8 space-y-8">
          <!-- 0. Overview + KPI -->
          <section :id="`sec-0`" class="grid lg:grid-cols-2 gap-6">
            <div class="rounded-2xl border border-gray-200 p-6 bg-white/80 backdrop-blur dark:bg-neutral-900/70 dark:border-neutral-700">
              <h2 class="text-xl font-extrabold flex items-center gap-2">
                <Icon :icon="sections(activeFeature)[0].icon" class="size-5" /> {{ sections(activeFeature)[0].title }}
              </h2>
              <p class="mt-2 text-gray-600 dark:text-neutral-400">{{ activeFeature.detail.overview }}</p>
              <ul class="mt-4 space-y-2">
                <li v-for="(b, i) in activeFeature.detail.topHighlights" :key="i" class="flex items-start gap-2">
                  <Icon icon="lucide:check-circle2" class="size-5 text-emerald-600" />
                  <span class="text-sm text-gray-700 dark:text-neutral-300">{{ b }}</span>
                </li>
              </ul>
            </div>
            <div class="rounded-2xl overflow-hidden border border-emerald-200 dark:border-emerald-900/60">
              <img
                v-if="activeFeature.images?.cover"
                :src="activeFeature.images.cover"
                class="w-full h-96 object-cover"
                alt="cover" />
              <div class="grid sm:grid-cols-2 gap-3 p-4 bg-white dark:bg-neutral-900">
                <div v-for="(k, i) in activeFeature.detail.kpis" :key="i" class="rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-800 p-4">
                  <p class="text-2xl font-extrabold">{{ k.value }}</p>
                  <p class="text-xs text-gray-500">{{ k.label }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- 1. Problems -->
          <section :id="`sec-1`" class="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 dark:bg-neutral-900/70 dark:border-neutral-700">
            <h2 class="text-xl font-extrabold flex items-center gap-2">
              <Icon :icon="sections(activeFeature)[1].icon" class="size-5" /> {{ sections(activeFeature)[1].title }}
            </h2>
            <div class="mt-4 grid md:grid-cols-2 gap-4">
              <div
                v-for="(p, i) in activeFeature.detail.problems"
                :key="i"
                class="rounded-xl border p-4 bg-white/70 dark:bg-neutral-900/70 border-gray-200 dark:border-neutral-800">
                <div class="flex items-start gap-2">
                  <Icon icon="lucide:shield-alert" class="size-5 text-rose-600" />
                  <div>
                    <p class="font-semibold">{{ p.title }}</p>
                    <p class="text-sm text-gray-600 dark:text-neutral-400">{{ p.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 2. Capabilities -->
          <section :id="`sec-2`" class="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 dark:bg-neutral-900/70 dark:border-neutral-700">
            <h2 class="text-xl font-extrabold flex items-center gap-2">
              <Icon :icon="sections(activeFeature)[2].icon" class="size-5" /> {{ sections(activeFeature)[2].title }}
            </h2>
            <div class="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(c, i) in activeFeature.detail.capabilities" :key="i" class="rounded-xl border p-4 bg-white/70 dark:bg-neutral-900/70 border-gray-200 dark:border-neutral-800">
                <div class="flex items-start gap-3">
                  <div class="size-9 rounded-lg flex items-center justify-center bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                    <Icon :icon="c.icon" class="size-5" />
                  </div>
                  <div>
                    <p class="font-semibold">{{ c.title }}</p>
                    <p class="text-sm text-gray-600 dark:text-neutral-400">{{ c.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 3. Workflow (lebih lengkap) -->
          <section :id="`sec-3`" class="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 dark:bg-neutral-900/70 dark:border-neutral-700">
            <h2 class="text-xl font-extrabold flex items-center gap-2">
              <Icon :icon="sections(activeFeature)[3].icon" class="size-5" /> {{ sections(activeFeature)[3].title }}
            </h2>
            <ol class="mt-4 space-y-4 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
              <li v-for="(s, i) in activeFeature.detail.workflow" :key="i" class="flex gap-3">
                <div class="shrink-0">
                  <div class="size-8 rounded-full flex items-center justify-center bg-emerald-600 text-white font-bold">{{ i+1 }}</div>
                </div>
                <div>
                  <p class="font-semibold">{{ s.title }}</p>
                  <p class="text-sm text-gray-600 dark:text-neutral-400">{{ s.desc }}</p>
                </div>
              </li>
            </ol>
          </section>

          <!-- 4. Integrations -->
          <section :id="`sec-4`" class="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 dark:bg-neutral-900/70 dark:border-neutral-700">
            <h2 class="text-xl font-extrabold flex items-center gap-2">
              <Icon :icon="sections(activeFeature)[4].icon" class="size-5" /> {{ sections(activeFeature)[4].title }}
            </h2>
            <p class="mt-2 text-sm text-gray-600 dark:text-neutral-400">Semua modul bisa tersambung mulus.</p>
            <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div
                v-for="(iitem, i) in activeFeature.detail.integrations"
                :key="i"
                class="rounded-xl border border-gray-200 dark:border-neutral-800 p-3 text-center bg-white/70 dark:bg-neutral-900/70">
                <div class="mx-auto size-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-neutral-800">
                  <Icon :icon="iitem.icon" class="size-5" />
                </div>
                <p class="mt-2 text-xs text-gray-600 dark:text-neutral-400">{{ iitem.name }}</p>
              </div>
            </div>
          </section>

          <!-- 5. Potensi Penerapan (NEW) -->
          <section :id="`sec-5`" class="grid lg:grid-cols-2 gap-6">
            <div class="rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-700">
              <img
                v-if="activeFeature.images?.useCases"
                :src="activeFeature.images.useCases"
                alt="use-cases"
                class="w-full h-full object-cover">
            </div>
            <div class="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 dark:bg-neutral-900/70 dark:border-neutral-700">
              <h2 class="text-xl font-extrabold flex items-center gap-2">
                <Icon :icon="sections(activeFeature)[5].icon" class="size-5" /> {{ sections(activeFeature)[5].title }}
              </h2>
              <div class="mt-4 space-y-3">
                <div v-for="(u, i) in activeFeature.detail.useCases" :key="i" class="rounded-xl border p-4 bg-white/70 dark:bg-neutral-900/70 border-gray-200 dark:border-neutral-800">
                  <p class="font-semibold">{{ u.title }}</p>
                  <p class="text-sm text-gray-600 dark:text-neutral-400">{{ u.desc }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- 6. Manfaat & Dampak (NEW) -->
          <section :id="`sec-6`" class="grid lg:grid-cols-2 gap-6">
            <div class="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 dark:bg-neutral-900/70 dark:border-neutral-700">
              <h2 class="text-xl font-extrabold flex items-center gap-2">
                <Icon :icon="sections(activeFeature)[6].icon" class="size-5" /> {{ sections(activeFeature)[6].title }}
              </h2>
              <ul class="mt-4 space-y-3">
                <li v-for="(b, i) in activeFeature.detail.benefits" :key="i" class="flex items-start gap-3">
                  <div class="size-8 rounded-lg flex items-center justify-center bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                    <Icon icon="lucide:sparkles" class="size-4" />
                  </div>
                  <div>
                    <p class="font-semibold">
                      {{ b.title }}
                      <span v-if="b.metric" class="ms-2 text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                        {{ b.metric }}
                      </span>
                    </p>
                    <p class="text-sm text-gray-600 dark:text-neutral-400">{{ b.desc }}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div class="rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-700">
              <img
                v-if="activeFeature.images?.benefits"
                :src="activeFeature.images.benefits"
                alt="benefits"
                class="w-full h-full object-cover">
            </div>
          </section>

          <!-- 7. FAQ -->
          <section :id="`sec-7`" class="grid lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 dark:bg-neutral-900/70 dark:border-neutral-700">
              <h2 class="text-xl font-extrabold flex items-center gap-2">
                <Icon :icon="sections(activeFeature)[7].icon" class="size-5" /> {{ sections(activeFeature)[7].title }}
              </h2>
              <div class="mt-4 hs-accordion-group divide-y divide-gray-200 dark:divide-neutral-800">
                <div v-for="(f, i) in activeFeature.detail.faqs" :key="i" class="hs-accordion">
                  <button class="hs-accordion-toggle w-full py-3 text-start flex items-center justify-between">
                    <span class="font-medium">{{ f.q }}</span>
                    <Icon icon="lucide:chevron-down" class="size-4 hs-accordion-active:rotate-180 transition-transform" />
                  </button>
                  <div class="hs-accordion-content hidden pb-3 text-sm text-gray-600 dark:text-neutral-400">
                    {{ f.a }}
                  </div>
                </div>
              </div>
            </div>
            <div class="rounded-2xl border border-gray-200 bg-gradient-to-b from-emerald-50 to-cyan-50 p-6 dark:border-neutral-700 dark:from-emerald-900/10 dark:to-cyan-900/10">
              <h3 class="font-extrabold text-lg">Siap mencoba {{ activeFeature.title }}?</h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-neutral-400">Dapatkan sesi demo 20 menit + panduan implementasi.</p>
              <div class="mt-4 flex flex-col gap-2">
                <NuxtLink href="#demo" class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 text-center">
                  Coba Demo
                </NuxtLink>
                <NuxtLink href="#pricing" class="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-sm font-medium text-center dark:border-neutral-700 dark:hover:bg-neutral-800">
                  Lihat Harga
                </NuxtLink>
              </div>
            </div>
          </section>

          <!-- 8. Related -->
          <section :id="`sec-8`" class="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 dark:bg-neutral-900/70 dark:border-neutral-700">
            <h2 class="text-xl font-extrabold flex items-center gap-2">
              <Icon icon="lucide:app-window" class="size-5" /> Fitur terkait
            </h2>
            <div class="mt-4 flex gap-4 overflow-x-auto pb-2">
              <NuxtLink
                v-for="rel in relatedFeatures"
                :key="rel.slug"
                :href="`/fitur?slug=${rel.slug}`"
                class="min-w-[240px] rounded-2xl border bg-white/70 dark:bg-neutral-900/70 border-gray-200 dark:border-neutral-800 p-4 hover:shadow">
                <div class="items-start flex-col gap-3">
                  <div class="size-9 rounded-lg flex mb-2 items-center justify-center" :class="badgeTone(rel.tone)">
                    <Icon :icon="rel.icon" class="size-5" />
                  </div>
                  <div>
                    <p class="font-semibold">{{ rel.title }}</p>
                    <p class="text-xs text-gray-600 dark:text-neutral-400 line-clamp-2">{{ rel.short }}</p>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </section>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watchEffect, onMounted, onBeforeMount } from 'vue'
import { useRoute, useRouter, useHead } from '#imports'
import { Icon } from '@iconify/vue'
import type { Tone, Category, Feature } from '~/data/fitur'
import { fitur } from '~/data/fitur'

/* ========= Filters ========= */
const ui = reactive({ query: '', selectedCategories: [] as Category[] })
const categories: Category[] = ['Akademik', 'Operasional', 'Keuangan', 'Add-on']

function toggleCategory(c: Category) {
  const i = ui.selectedCategories.indexOf(c)
  if (i >= 0) ui.selectedCategories.splice(i, 1)
  else ui.selectedCategories.push(c)
}

const filteredFeatures = computed(() => {
  const q = ui.query.trim().toLowerCase()
  return fitur.filter(f => {
    const byCat = ui.selectedCategories.length ? ui.selectedCategories.includes(f.category) : true
    const inText = q
      ? (f.title + ' ' + f.short + ' ' + f.tags.join(' ') + ' ' + f.category).toLowerCase().includes(q)
      : true
    return byCat && inText
  })
})

const route = useRoute()
const router = useRouter()
const slug = computed(() => {
  const s = route.query.slug
  return typeof s === 'string' ? s : Array.isArray(s) ? s[0] : ''
})
const activeFeature = computed<Feature | null>(() => fitur.find(c => c.slug === slug.value) || null)
const isDetail = computed(() => !!slug.value && !!activeFeature.value)
const relatedFeatures = computed(() => {
  if (!activeFeature.value) return []
  const relSlugs = activeFeature.value.detail.related || []
  return fitur.filter(c => relSlugs.includes(c.slug))
})

const sections = (f: Feature) => ([
  { title: 'Ringkasan', icon: 'lucide:badge-check' },
  { title: 'Masalah yang Diselesaikan', icon: 'lucide:bug' },
  { title: 'Kemampuan Utama', icon: 'lucide:sparkles' },
  { title: 'Alur Kerja', icon: 'lucide:list-ordered' },
  { title: 'Integrasi', icon: 'lucide:git-merge' },
  { title: 'Potensi Penerapan', icon: 'lucide:rocket' },
  { title: 'Manfaat & Dampak', icon: 'lucide:heart-handshake' },
  { title: 'FAQ & Langkah Berikutnya', icon: 'lucide:help-circle' }
])

useHead(() => {
  const baseTitle = 'Fitur Obayan'
  if (!activeFeature.value) {
    return {
      title: baseTitle,
      meta: [
        { name: 'description', content: 'Jelajahi fitur Obayan: akademik, operasional, keuangan, dan add-on presensi/otomasi.' }
      ]
    }
  }
  return {
    title: `${activeFeature.value.title} • ${baseTitle}`,
    meta: [{ name: 'description', content: activeFeature.value.short }]
  }
})

const badgeTone = (tone: Tone) => ({
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  violet: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300'
}[tone])

const chipTone = (tone: Tone) => ({
  emerald: 'bg-emerald-100/70 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
  blue: 'bg-blue-100/70 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300',
  amber: 'bg-amber-100/70 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  violet: 'bg-violet-100/70 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300'
}[tone])

onBeforeMount(() => {
  const s = slug.value?.trim()
  if (!s) router.replace('/fitur')
  else if (!activeFeature.value) router.replace('/fitur')
})

watchEffect(() => {
  const s = slug.value?.trim()
  if (s && !activeFeature.value) router.replace('/fitur')
})

const whyObayan = [
  { title: 'Modular & Scalable', desc: 'Aktifkan modul sesuai fase; tumbuh tanpa migrasi ulang.', icon: 'lucide:layout-grid', tone: 'emerald' as Tone },
  { title: 'Keamanan Serius', desc: 'RBAC, audit log, backup & enkripsi by default.', icon: 'lucide:shield-check', tone: 'blue' as Tone },
  { title: 'Cepat Diimplementasi', desc: 'Template data & wizard setup mempercepat go-live.', icon: 'lucide:rocket', tone: 'amber' as Tone }
]
</script>
