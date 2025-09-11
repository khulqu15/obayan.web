<!-- ~/pages/produk.vue -->
<template>
  <div class="text-gray-800 dark:text-neutral-200 overflow-hidden pt-24">
    <!-- HERO -->
    <section :key="isDetail ? `detail-hero-${slug}` : 'list-hero'" class="relative">
      <div aria-hidden="true" class="pointer-events-none absolute inset-0">
        <div class="absolute -top-24 -right-24 w-[42rem] h-[42rem] rounded-full opacity-30 blur-3xl
                    bg-gradient-to-br from-green-200 to-emerald-200 dark:from-amber-900/40 dark:to-emerald-900/30" />
        <div class="absolute top-28 -left-24 w-[36rem] h-[36rem] rounded-full opacity-30 blur-3xl
                    bg-gradient-to-tr from-fuchsia-100 to-blue-100 dark:from-fuchsia-900/30 dark:to-blue-900/30" />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div v-if="!activeProduct" class="text-center">
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
            <Icon icon="lucide:sparkles" class="size-4" />
            Obayan • Produk & Add-On
          </span>
          <h1 class="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Pilih Produk<span class="text-emerald-600"> Obayan</span>
          </h1>
          <p class="mt-3 text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Website, Mobile App, dan Add-On yang saling terhubung. Rasakan pengalaman luwes ala Duolingo—ringan, playful, informatif.
          </p>

          <!-- search + pills -->
          <div class="mt-6 flex flex-col sm:flex-col items-stretch sm:items-center gap-2 sm:gap-3 max-w-3xl mx-auto">
            <div class="relative w-full">
              <input
                v-model="ui.query"
                type="text"
                placeholder="Cari produk… (misal: CMS, CBT, presensi)"
                class="w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur placeholder:text-gray-400
                       focus:outline-hidden focus:ring-2 focus:ring-emerald-500 dark:bg-neutral-900/70 dark:border-neutral-700" />
              <div class="absolute right-2 top-1/2 -translate-y-1/2">
                <button class="px-3 py-1.5 rounded-xl text-sm border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
                  <Icon icon="lucide:search" class="size-4" />
                </button>
              </div>
            </div>
            <div class="flex items-center gap-1.5 overflow-x-auto">
              <button
                v-for="c in categories"
                :key="c"
                @click="toggleCategory(c)"
                class="px-3 py-2 rounded-2xl border text-sm transition-colors whitespace-nowrap"
                :class="ui.selectedCategories.includes(c)
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-800'
                  : 'border-gray-200 bg-white/80 hover:bg-gray-50 dark:bg-neutral-900/70 dark:border-neutral-700'">
                {{ c }}
              </button>
            </div>
          </div>
        </div>

        <div v-else class="flex items-center gap-2 text-sm">
          <NuxtLink href="/produk" class="inline-flex items-center gap-1 text-gray-600 dark:text-neutral-400 hover:text-emerald-600">
            <Icon icon="lucide:home" class="size-4" /> Produk
          </NuxtLink>
          <Icon icon="lucide:chevron-right" class="size-4 text-gray-400" />
          <span class="font-semibold">{{ activeProduct.title }}</span>
        </div>
      </div>
    </section>

    <!-- LIST -->
    <section v-if="!isDetail" :key="'list-section'" class="relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <article
            v-for="p in filteredProducts"
            :key="p.slug"
            class="group rounded-3xl bg-white/90 dark:bg-neutral-900/80 border border-gray-200 dark:border-neutral-700 p-0 overflow-hidden shadow-[0_2px_0_rgba(0,0,0,0.05)] hover:shadow-xl transition">
            <!-- ribbon -->
            <div :class="['h-2 w-full',
              p.tone==='emerald' ? 'bg-emerald-400' :
              p.tone==='blue' ? 'bg-blue-400' :
              p.tone==='amber' ? 'bg-amber-400' : 'bg-violet-400']" />
            <div class="p-5">
              <div class="flex items-start flex-col gap-3">
                <div class="size-12 rounded-2xl ml-1 flex items-center justify-center shadow ring-2 ring-white/70 dark:ring-neutral-900/70"
                     :class="badgeTone(p.tone)">
                  <Icon :icon="p.icon" class="size-6" />
                </div>
                <div class="grow">
                  <div class="flex items-center gap-2">
                    <h3 class="font-extrabold text-lg">{{ p.title }}</h3>
                    <span class="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide" :class="chipTone(p.tone)">
                      {{ p.category }}
                    </span>
                  </div>
                  <p class="mt-1 text-sm text-gray-600 dark:text-neutral-400 line-clamp-2">{{ p.short }}</p>
                  <div class="mt-2 flex flex-wrap gap-1.5">
                    <span v-for="t in p.tags" :key="t" class="px-2 py-1 rounded-full text-[11px] bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-400">
                      {{ t }}
                    </span>
                  </div>
                </div>
              </div>

              <img v-if="p.images?.cover" :src="p.images.cover" class="mt-4 w-full h-40 object-cover rounded-2xl" alt="cover" />

              <div class="mt-4 flex items-center justify-between">
                <NuxtLink
                  :href="`/produk?slug=${p.slug}`"
                  class="inline-flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700">
                  Jelajahi
                  <Icon icon="lucide:arrow-right" class="size-4" />
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>

        <!-- mini blurb -->
        <div class="mt-12 rounded-3xl p-6 border border-gray-200 dark:border-neutral-700 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/10 dark:to-cyan-900/10">
          <div class="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-5">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-2xl flex items-center justify-center bg-emerald-600 text-white">
                <Icon icon="lucide:wand-2" class="size-5" />
              </div>
              <div>
                <h3 class="font-extrabold text-lg">Semua saling terhubung</h3>
                <p class="text-sm text-gray-600 dark:text-neutral-400">Website ⇄ App ⇄ Add-On—data mengalir mulus.</p>
              </div>
            </div>
            <div class="ms-auto flex items-center gap-2">
              <NuxtLink href="#pricing" class="px-4 py-2 rounded-2xl border border-gray-300 hover:bg-gray-100 text-sm font-semibold dark:border-neutral-700 dark:hover:bg-neutral-800">
                Lihat Harga
              </NuxtLink>
              <NuxtLink href="#demo" class="px-4 py-2 rounded-2xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">
                Coba Demo
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- DETAIL -->
    <section v-else :key="`detail-section-${slug}`">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <!-- hero detail -->
        <div class="rounded-3xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/70 p-5 sm:p-7">
          <div class="flex flex-col">
            <div class="flex flex-col mb-3 items-start gap-4">
              <div class="size-12 rounded-2xl flex items-center justify-center" :class="badgeTone(activeProduct.tone)">
                <Icon :icon="activeProduct.icon" class="size-6" />
              </div>
              <div class="grow">
                <div class="flex items-center gap-2">
                  <h1 class="text-2xl sm:text-3xl font-extrabold">{{ activeProduct.title }}</h1>
                  <span class="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide" :class="chipTone(activeProduct.tone)">
                    {{ activeProduct.category }}
                  </span>
                </div>
                <p class="text-sm text-gray-500 dark:text-neutral-400">{{ activeProduct.subtitle }}</p>
                <p class="mt-2 text-gray-700 dark:text-neutral-300 max-w-2xl">{{ activeProduct.short }}</p>
              </div>
            </div>

            <!-- scroller tabs (beda dari halaman fitur) -->
            <nav class="flex gap-2 flex-wrap overflow-x-auto no-scrollbar">
              <a
                v-for="(sec, i) in sections(activeProduct)"
                :key="i"
                :href="`#sec-${i}`"
                class="inline-flex items-center gap-2 px-3 py-2 rounded-2xl text-sm font-semibold border
                       hover:shadow transition border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/70">
                <Icon :icon="sec.icon" class="size-4" />
                {{ sec.title }}
              </a>
            </nav>
          </div>
        </div>

        <!-- content sections -->
        <div class="mt-8 space-y-8">
          <!-- 0 Overview + Highlights + KPI -->
          <section :id="`sec-0`" class="grid lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 rounded-3xl border border-gray-200 dark:border-neutral-700 p-6 bg-white/80 dark:bg-neutral-900/70">
              <h2 class="text-xl font-extrabold flex items-center gap-2">
                <Icon :icon="sections(activeProduct)[0].icon" class="size-5" /> {{ sections(activeProduct)[0].title }}
              </h2>
              <p class="mt-2 text-gray-700 dark:text-neutral-300">{{ activeProduct.detail.overview }}</p>
              <ul class="mt-4 grid sm:grid-cols-2 gap-3">
                <li v-for="(h, i) in activeProduct.detail.highlights" :key="i" class="flex items-start gap-2">
                  <Icon icon="lucide:check-circle-2" class="size-5 text-emerald-600" />
                  <span class="text-sm text-gray-700 dark:text-neutral-300">{{ h }}</span>
                </li>
              </ul>
            </div>
            <div class="rounded-3xl overflow-hidden border border-emerald-200 dark:border-emerald-900/60">
              <img v-if="activeProduct.images?.cover" :src="activeProduct.images.cover" class="w-full h-48 object-cover" alt="cover" />
              <div class="grid grid-cols-2 gap-3 p-4 bg-white dark:bg-neutral-900">
                <div v-for="(k, i) in activeProduct.detail.kpis" :key="i" class="rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-800 p-4">
                  <p class="text-2xl font-extrabold">{{ k.value }}</p>
                  <p class="text-xs text-gray-500">{{ k.label }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- 1 Personas -->
          <section :id="`sec-1`" class="rounded-3xl border border-gray-200 dark:border-neutral-700 p-6 bg-white/80 dark:bg-neutral-900/70">
            <h2 class="text-xl font-extrabold flex items-center gap-2">
              <Icon :icon="sections(activeProduct)[1].icon" class="size-5" /> {{ sections(activeProduct)[1].title }}
            </h2>
            <div class="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(p, i) in activeProduct.detail.personas" :key="i" class="rounded-2xl border p-4 bg-white/80 dark:bg-neutral-900/70 border-gray-200 dark:border-neutral-800">
                <p class="font-semibold">{{ p.role }}</p>
                <p class="text-sm mt-1"><span class="text-gray-500">Butuh:</span> {{ p.needs }}</p>
                <p class="text-sm"><span class="text-gray-500">Hasil:</span> {{ p.outcomes }}</p>
              </div>
            </div>
          </section>

          <!-- 2 Features -->
          <section :id="`sec-2`" class="rounded-3xl border border-gray-200 dark:border-neutral-700 p-6 bg-white/80 dark:bg-neutral-900/70">
            <h2 class="text-xl font-extrabold flex items-center gap-2">
              <Icon :icon="sections(activeProduct)[2].icon" class="size-5" /> {{ sections(activeProduct)[2].title }}
            </h2>
            <div class="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(f, i) in activeProduct.detail.features" :key="i" class="rounded-2xl border p-4 bg-white/70 dark:bg-neutral-900/70 border-gray-200 dark:border-neutral-800">
                <div class="flex items-start gap-3">
                  <div class="size-9 rounded-xl flex items-center justify-center bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                    <Icon :icon="f.icon" class="size-5" />
                  </div>
                  <div>
                    <p class="font-semibold">{{ f.title }}</p>
                    <p class="text-sm text-gray-600 dark:text-neutral-400">{{ f.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 3 Modules -->
          <section :id="`sec-3`" class="grid lg:grid-cols-2 gap-6">
            <div class="rounded-3xl overflow-hidden border border-gray-200 dark:border-neutral-700">
              <img v-if="activeProduct.images?.alt1" :src="activeProduct.images.alt1" class="w-full h-full object-cover" alt="modules" />
            </div>
            <div class="rounded-3xl border border-gray-200 dark:border-neutral-700 p-6 bg-white/80 dark:bg-neutral-900/70">
              <h2 class="text-xl font-extrabold flex items-center gap-2">
                <Icon :icon="sections(activeProduct)[3].icon" class="size-5" /> {{ sections(activeProduct)[3].title }}
              </h2>
              <ul class="mt-4 space-y-3">
                <li v-for="(m, i) in activeProduct.detail.modules" :key="i" class="flex items-start gap-3">
                  <Icon icon="lucide:component" class="size-5 text-emerald-600" />
                  <div>
                    <p class="font-semibold">{{ m.title }}</p>
                    <p class="text-sm text-gray-600 dark:text-neutral-400">{{ m.desc }}</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <!-- 4 Workflow (timeline) -->
          <section :id="`sec-4`" class="rounded-3xl border border-gray-200 dark:border-neutral-700 p-6 bg-white/80 dark:bg-neutral-900/70">
            <h2 class="text-xl font-extrabold flex items-center gap-2">
              <Icon :icon="sections(activeProduct)[4].icon" class="size-5" /> {{ sections(activeProduct)[4].title }}
            </h2>
            <ol class="mt-4 relative border-s-2 border-dashed border-emerald-300 ps-4">
              <li v-for="(s, i) in activeProduct.detail.workflow" :key="i" class="mb-4 ms-2">
                <div class="absolute -left-[9px] mt-1 size-4 rounded-full bg-emerald-600"></div>
                <p class="font-semibold">{{ i+1 }}. {{ s.title }}</p>
                <p class="text-sm text-gray-600 dark:text-neutral-400">{{ s.desc }}</p>
              </li>
            </ol>
          </section>

          <!-- 5 Architecture -->
          <section :id="`sec-5`" class="grid lg:grid-cols-2 gap-6">
            <div class="rounded-3xl border border-gray-200 dark:border-neutral-700 p-6 bg-white/80 dark:bg-neutral-900/70">
              <h2 class="text-xl font-extrabold flex items-center gap-2">
                <Icon :icon="sections(activeProduct)[5].icon" class="size-5" /> {{ sections(activeProduct)[5].title }}
              </h2>
              <ul class="mt-4 space-y-3">
                <li v-for="(a, i) in activeProduct.detail.architecture" :key="i" class="flex items-start gap-3">
                  <Icon icon="lucide:server" class="size-5 text-blue-600" />
                  <div>
                    <p class="font-semibold">{{ a.title }}</p>
                    <p class="text-sm text-gray-600 dark:text-neutral-400">{{ a.desc }}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div class="rounded-3xl overflow-hidden border border-gray-200 dark:border-neutral-700">
              <img v-if="activeProduct.images?.alt2" :src="activeProduct.images.alt2" class="w-full h-full object-cover" alt="architecture" />
            </div>
          </section>

          <!-- 6 Security -->
          <section :id="`sec-6`" class="rounded-3xl border border-gray-200 dark:border-neutral-700 p-6 bg-white/80 dark:bg-neutral-900/70">
            <h2 class="text-xl font-extrabold flex items-center gap-2">
              <Icon :icon="sections(activeProduct)[6].icon" class="size-5" /> {{ sections(activeProduct)[6].title }}
            </h2>
            <div class="mt-4 grid md:grid-cols-2 gap-4">
              <div v-for="(s, i) in activeProduct.detail.security" :key="i" class="rounded-2xl border p-4 bg-white/80 dark:bg-neutral-900/70 border-gray-200 dark:border-neutral-800">
                <p class="font-semibold">{{ s.title }}</p>
                <p class="text-sm text-gray-600 dark:text-neutral-400">{{ s.desc }}</p>
              </div>
            </div>
          </section>

          <!-- 7 Integrations -->
          <section :id="`sec-7`" class="rounded-3xl border border-gray-200 dark:border-neutral-700 p-6 bg-white/80 dark:bg-neutral-900/70">
            <h2 class="text-xl font-extrabold flex items-center gap-2">
              <Icon :icon="sections(activeProduct)[7].icon" class="size-5" /> {{ sections(activeProduct)[7].title }}
            </h2>
            <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div v-for="(iitem, i) in activeProduct.detail.integrations" :key="i" class="rounded-2xl border p-3 text-center bg-white/70 dark:bg-neutral-900/70 border-gray-200 dark:border-neutral-800">
                <div class="mx-auto size-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-neutral-800">
                  <Icon :icon="iitem.icon" class="size-5" />
                </div>
                <p class="mt-2 text-xs text-gray-600 dark:text-neutral-400">{{ iitem.name }}</p>
              </div>
            </div>
          </section>

          <!-- 8 Pricing -->
          <section :id="`sec-8`" class="rounded-3xl border border-gray-200 dark:border-neutral-700 p-6 bg-white/80 dark:bg-neutral-900/70">
            <h2 class="text-xl font-extrabold flex items-center gap-2">
              <Icon :icon="sections(activeProduct)[8].icon" class="size-5" /> {{ sections(activeProduct)[8].title }}
            </h2>
            <div class="mt-4 grid md:grid-cols-3 gap-4">
              <div
                v-for="(pl, i) in activeProduct.detail.pricing"
                :key="i"
                class="rounded-3xl border p-5 bg-white/80 dark:bg-neutral-900/70 border-gray-200 dark:border-neutral-800 relative"
                :class="pl.best ? 'ring-2 ring-emerald-500' : ''">
                <span v-if="pl.best" class="absolute -top-3 right-4 px-2 py-0.5 text-xs rounded-full bg-emerald-600 text-white">Rekomendasi</span>
                <p class="font-extrabold text-lg">{{ pl.name }}</p>
                <p class="text-2xl mt-1"><span class="font-extrabold">{{ pl.price }}</span><span class="text-sm text-gray-500" v-if="pl.unit">{{ pl.unit }}</span></p>
                <ul class="mt-3 space-y-2 text-sm">
                  <li v-for="(ft, j) in pl.features" :key="j" class="flex items-start gap-2">
                    <Icon icon="lucide:check" class="size-4 text-emerald-600 mt-0.5" />
                    <span>{{ ft }}</span>
                  </li>
                </ul>
                <a href="#demo" class="mt-4 inline-flex items-center justify-center w-full rounded-2xl px-3 py-2 bg-emerald-600 text-white font-semibold hover:bg-emerald-700">
                  Minta Demo
                </a>
              </div>
            </div>
          </section>

          <!-- 9 Timeline Implementasi -->
          <section :id="`sec-9`" class="rounded-3xl border border-gray-200 dark:border-neutral-700 p-6 bg-white/80 dark:bg-neutral-900/70">
            <h2 class="text-xl font-extrabold flex items-center gap-2">
              <Icon :icon="sections(activeProduct)[9].icon" class="size-5" /> {{ sections(activeProduct)[9].title }}
            </h2>
            <div class="mt-4 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div v-for="(t, i) in activeProduct.detail.timeline" :key="i" class="rounded-2xl border p-4 bg-white/80 dark:bg-neutral-900/70 border-gray-200 dark:border-neutral-800">
                <p class="font-semibold">{{ t.title }}</p>
                <p class="text-sm text-gray-600 dark:text-neutral-400">{{ t.desc }}</p>
              </div>
            </div>
          </section>

          <!-- 10 Case Studies -->
          <section :id="`sec-10`" class="rounded-3xl border border-gray-200 dark:border-neutral-700 p-6 bg-white/80 dark:bg-neutral-900/70">
            <h2 class="text-xl font-extrabold flex items-center gap-2">
              <Icon :icon="sections(activeProduct)[10].icon" class="size-5" /> {{ sections(activeProduct)[10].title }}
            </h2>
            <div class="mt-4 grid md:grid-cols-2 gap-4">
              <div v-for="(c, i) in activeProduct.detail.caseStudies" :key="i" class="rounded-2xl border p-4 bg-white/80 dark:bg-neutral-900/70 border-gray-200 dark:border-neutral-800">
                <p class="font-semibold">{{ c.title }}</p>
                <p class="text-sm text-gray-600 dark:text-neutral-400">{{ c.summary }}</p>
                <p class="text-sm mt-1"><span class="text-gray-500">Dampak:</span> {{ c.impact }} <span v-if="c.metric">• {{ c.metric }}</span></p>
              </div>
            </div>
          </section>

          <!-- 11 FAQ -->
          <section :id="`sec-11`" class="rounded-3xl border border-gray-200 dark:border-neutral-700 p-6 bg-white/80 dark:bg-neutral-900/70">
            <h2 class="text-xl font-extrabold flex items-center gap-2">
              <Icon :icon="sections(activeProduct)[11].icon" class="size-5" /> {{ sections(activeProduct)[11].title }}
            </h2>
            <div class="mt-4 hs-accordion-group divide-y divide-gray-200 dark:divide-neutral-800">
              <div v-for="(f, i) in activeProduct.detail.faqs" :key="i" class="hs-accordion">
                <button class="hs-accordion-toggle w-full py-3 text-start flex items-center justify-between">
                  <span class="font-medium">{{ f.q }}</span>
                  <Icon icon="lucide:chevron-down" class="size-4 hs-accordion-active:rotate-180 transition-transform" />
                </button>
                <div class="hs-accordion-content hidden pb-3 text-sm text-gray-600 dark:text-neutral-400">
                  {{ f.a }}
                </div>
              </div>
            </div>
          </section>

          <!-- Related -->
          <section class="rounded-3xl border border-gray-200 dark:border-neutral-700 p-6 bg-white/80 dark:bg-neutral-900/70">
            <h2 class="text-xl font-extrabold flex items-center gap-2">
              <Icon icon="lucide:app-window" class="size-5" /> Produk terkait
            </h2>
            <div class="mt-4 flex gap-4 overflow-x-auto pb-2">
              <NuxtLink
                v-for="rel in relatedProducts"
                :key="rel.slug"
                :href="`/produk?slug=${rel.slug}`"
                class="min-w-[240px] rounded-2xl border bg-white/70 dark:bg-neutral-900/70 border-gray-200 dark:border-neutral-800 p-4 hover:shadow">
                <div class="flex items-start gap-3">
                  <div class="size-9 rounded-xl flex items-center justify-center" :class="badgeTone(rel.tone)">
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
import { computed, reactive, watch, onMounted, onBeforeMount, watchEffect } from 'vue'
import { useRoute, useRouter, useHead } from '#imports'
import { Icon } from '@iconify/vue'
import type { Tone, Category, Product } from '~/data/produk'
import { produk } from '~/data/produk'

/* ====== Filters ====== */
const ui = reactive({ query: '', selectedCategories: [] as Category[] })
const categories: Category[] = ['Website', 'Mobile App', 'Add-On']

function toggleCategory(c: Category) {
  const i = ui.selectedCategories.indexOf(c)
  if (i >= 0) ui.selectedCategories.splice(i, 1)
  else ui.selectedCategories.push(c)
}

const filteredProducts = computed(() => {
  const q = ui.query.trim().toLowerCase()
  return produk.filter(p => {
    const byCat = ui.selectedCategories.length ? ui.selectedCategories.includes(p.category) : true
    const inText = q
      ? (p.title + ' ' + (p.subtitle || '') + ' ' + p.short + ' ' + p.tags.join(' ') + ' ' + p.category).toLowerCase().includes(q)
      : true
    return byCat && inText
  })
})

/* ====== Detail selection ====== */
const route = useRoute()
const router = useRouter()
const rawSlug = computed(() => route.query.slug)
const slug = computed<string>(() => {
  const s = rawSlug.value
  return typeof s === 'string' ? s : Array.isArray(s) ? s[0] : ''
})
const activeProduct = computed<Product | null>(
  () => produk.find(c => c.slug === slug.value) || null
)
const isDetail = computed(() => !!slug.value && !!activeProduct.value)

const relatedProducts = computed(() => {
  if (!activeProduct.value) return []
  const relSlugs = activeProduct.value.detail.related || []
  return produk.filter(c => relSlugs.includes(c.slug))
})

/* ====== Sections (12 total) ====== */
const sections = (p: Product) => ([
  { title: 'Ikhtisar', icon: 'lucide:badge-check' },
  { title: 'Untuk Siapa', icon: 'lucide:users' },
  { title: 'Fitur Inti', icon: 'lucide:sparkles' },
  { title: 'Modul', icon: 'lucide:component' },
  { title: 'Cara Kerja', icon: 'lucide:list-ordered' },
  { title: 'Arsitektur', icon: 'lucide:server' },
  { title: 'Keamanan', icon: 'lucide:shield-check' },
  { title: 'Integrasi', icon: 'lucide:git-merge' },
  { title: 'Harga & Paket', icon: 'lucide:wallet' },
  { title: 'Timeline Implementasi', icon: 'lucide:calendar' },
  { title: 'Studi Kasus', icon: 'lucide:briefcase' },
  { title: 'FAQ', icon: 'lucide:help-circle' }
])

/* ====== SEO ====== */
useHead(() => {
  const baseTitle = 'Produk Obayan'
  if (!activeProduct.value) {
    return {
      title: baseTitle,
      meta: [{ name: 'description', content: 'Website, Mobile App, dan Add-On Obayan yang saling terintegrasi.' }]
    }
  }
  return {
    title: `${activeProduct.value.title} • ${baseTitle}`,
    meta: [{ name: 'description', content: activeProduct.value.short }]
  }
})

/* ====== Styles ====== */
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
  if (s && !activeProduct.value) router.replace('/produk')
})

watchEffect(() => {
  const s = slug.value?.trim()
  if (s && !activeProduct.value) router.replace('/produk')
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
