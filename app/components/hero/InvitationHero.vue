<template>
  <section class="relative dark:bg-neutral-900 bg-gray-100">
    <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

      <div class="relative overflow-hidden rounded-[2rem] shadow-xl border border-gray-200/70 dark:border-neutral-800 isolate transition-transform duration-500 hover:scale-[1.01]">
        <div class="absolute inset-0">
          <div class="absolute inset-0 bg-center bg-cover" :style="{ backgroundImage: `url(${bg})` }" />
          <div class="absolute inset-0 bg-[rgba(var(--app-primary-rgb),0.8)] mix-blend-multiply" />
          <div class="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10" />
        </div>

        <div class="relative grid grid-cols-12 gap-6 items-center">
          <div class="col-span-12 md:col-span-7 px-8 sm:px-12 py-12 sm:py-16">
            <p class="inline-flex items-center gap-2 text-white/90 text-[11px] font-semibold uppercase tracking-wider">
              <span class="inline-block size-1.5 rounded-full bg-white/80" />
              Ajakan Kebaikan
            </p>
            <h1 class="mt-2 text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Ayo <span class="underline decoration-white/40">Mondok</span> di
              <span class="text-white drop-shadow">Ponpes Alberr</span>
            </h1>
            <p class="mt-3 text-white/90 max-w-xl">
              Lingkungan yang menumbuhkan adab, ilmu, dan kemandirian.
              Kurikulum diniyah & formal terpadu, pembinaan tahfidz, serta program
              kepemimpinan dan pengabdian.
            </p>
            <div class="mt-6 flex flex-wrap gap-3">
              <a href="/profile"
                 class="inline-flex items-center gap-2 rounded-xl bg-white text-blue-700 px-5 py-3 text-sm font-semibold hover:bg-white/90">
                <ClientOnly><Icon icon="ph:student" class="size-4" /></ClientOnly>
                Al Berr
              </a>
              <a href="/program"
                 class="inline-flex items-center gap-1.5 text-white/90 text-sm font-medium underline-offset-4 hover:underline">
                Pelajari lebih lanjut
                <ClientOnly><Icon icon="ph:arrow-right" class="size-4" /></ClientOnly>
              </a>
            </div>
          </div>
          <img src="/assets/pattern.png" alt="Mosque Pattern" class="absolute bottom-0 w-full opacity-80 -right-[60%]">
        </div>
      </div>
      <figure class="mt-6 sm:mt-8 rounded-2xl border border-gray-200/70 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70 backdrop-blur p-5 sm:p-6 shadow">
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
import { Icon } from '@iconify/vue'

const bg = '/assets/images/profile.png'
</script>
