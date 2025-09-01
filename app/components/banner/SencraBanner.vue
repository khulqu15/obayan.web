<!-- components/FooterSencraBanner.vue -->
<template>
  <section class="relative w-full min-h-12 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-r from-[#121EA1] via-[#2D3FFF] to-[#FF7F00]" />

    <div class="absolute inset-0 opacity-15"
         style="background-image:linear-gradient(to right,rgba(255,255,255,.22) 1px,transparent 1px),
                                  linear-gradient(to bottom,rgba(255,255,255,.22) 1px,transparent 1px);
                background-size:22px 22px;" />

    <!-- Glow -->
    <div class="absolute -inset-x-16 -top-24 h-40 bg-white/25 blur-2xl rounded-full" />
    <div class="absolute -inset-x-24 -bottom-28 h-44 bg-[#FF7F00]/20 blur-3xl rounded-full" />

    <div class="relative h-full max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="h-full flex items-center flex-wrap justify-between gap-6 pt-1">
        <!-- Left -->
        <a class="min-w-0" href="/dev">
          <div class="mt-1 flex items-center gap-2">
            <ClientOnly><Icon icon="mdi:hexagon-slice-6" class="size-7 text-[#FF7F00]" /></ClientOnly>
            <h2 class="text-white text-2xl font-extrabold tracking-tight">
              <span class="text-[#2D3FFF] bg-white/95 px-1 rounded">SENCRA</span><span class="text-white">.io</span>
            </h2>
          </div>

        </a>
        <div class="mt-3 md:flex hidden flex-wrap gap-2">
          <span
            v-for="s in services"
            :key="s"
            class="inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/95 backdrop-blur"
          >
            <ClientOnly><Icon icon="ph:sparkle" class="size-3.5 text-[#FFBF85]" /></ClientOnly>
            {{ s }}
          </span>
        </div>

        <!-- Right CTAs -->
        <div class="shrink-0 md:flex hidden items-center gap-2">
          <!-- Primary biru -->
          <a
            :href="team.url" target="_blank" rel="noopener"
            class="inline-flex items-center gap-2 rounded-lg text-[#2D3FFF] hover:text-[#1826C7] bg-white px-3.5 py-2 text-sm font-semibold shadow-[0_10px_30px_-10px_rgba(45,63,255,.35)] transition"
          >
            <ClientOnly><Icon icon="ph:link-simple-bold" class="size-4" /></ClientOnly>
            Kunjungi
          </a>

          <!-- Outline oranye -->
          <a
            :href="`https://wa.me/${team.whatsapp}`" target="_blank" rel="noopener"
            class="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 text-white px-3.5 py-2 text-sm font-semibold hover:bg-white/15"
          >
            <ClientOnly><Icon icon="ph:whatsapp-logo" class="size-4 text-[#FFBF85]" /></ClientOnly>
            WhatsApp
          </a>

          <a
            :href="`mailto:${team.email}`"
            class="hidden sm:inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 text-white px-3.5 py-2 text-sm font-semibold hover:bg-white/15"
          >
            <ClientOnly><Icon icon="ph:envelope-simple" class="size-4 text-[#FFBF85]" /></ClientOnly>
            Email
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const team = {
  name: 'sencra.io',
  url: 'https://sencra.io',      // ganti bila belum live
  whatsapp: '6281234567890',     // ganti nomor WA
  email: 'hello@sencra.io'       // ganti email
}

const services = ref<string[]>([
  'Web App',
  'IoT',
  'AI',
  'Robotic',
  '3D Print'
])
</script>
