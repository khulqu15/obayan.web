<template>
  <section id="demo" class="relative py-24 overflow-hidden">
    <!-- Background kotak kotak gradient -->
    <div class="absolute inset-0 -z-10">
      <!-- lapisan gradient -->
      <div class="h-full w-full bg-gradient-to-b from-emerald-50 via-white to-white dark:from-emerald-900/10 dark:via-neutral-900 dark:to-neutral-950" />
      <!-- pola kotak kotak -->
      <div
        class="absolute inset-0 [background-image:linear-gradient(to_right,rgba(16,185,129,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.07)_1px,transparent_1px)] [background-size:40px_40px]"
      />
    </div>

    <div class="max-w-[70rem] mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="relative rounded-3xl border border-gray-200/70 dark:border-neutral-800 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl p-10 text-center"
      >
        <!-- glow dekoratif -->
        <div class="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20 blur-2xl -z-10"></div>

        <h2 class="text-3xl sm:text-5xl font-extrabold tracking-tight">
          <span
            class="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500"
          >
            Siap membuat operasional pondok lebih ringan?
          </span>
        </h2>
        <p
          class="mt-4 text-gray-700 dark:text-neutral-300 text-base max-w-2xl mx-auto leading-relaxed"
        >
          Jadwalkan <span class="font-semibold">demo 30 menit</span>, kami
          tunjukkan langsung alur nyata di <span class="font-semibold">Obayan</span>.
        </p>

        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="https://wa.me/62895396004952?text=Assalamu’alaikum,%20ingin%20demo%20Obayan"
            target="_blank"
            class="inline-flex items-center justify-center rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-sm sm:text-base font-semibold shadow-lg transition focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
          >
            <Icon icon="ph:whatsapp-logo-bold" class="mr-2 size-5" /> Chat WhatsApp
          </a>
          <a
            href="#contact"
            class="inline-flex items-center justify-center rounded-2xl border border-gray-300 dark:border-neutral-700 px-6 py-3 text-sm sm:text-base font-semibold text-gray-800 dark:text-neutral-100 hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
          >
            <Icon icon="ph:envelope-simple-bold" class="mr-2 size-5" /> Email Kami
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>
