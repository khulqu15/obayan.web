<!-- pages/maintenance.vue -->
<template>
  <main class="fixed z-[999] inset-0 overflow-hidden max-h-screen overflow-y-auto bg-gradient-to-br from-blue-50 via-emerald-50 to-white dark:from-blue-950 dark:via-emerald-950 dark:to-neutral-950">
    <!-- Decorative blobs -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div class="absolute -top-24 -left-24 size-[36rem] rounded-full blur-3xl opacity-30 bg-blue-200/50 dark:bg-blue-800/30"></div>
      <div class="absolute -bottom-24 -right-24 size-[42rem] rounded-full blur-3xl opacity-30 bg-emerald-200/50 dark:bg-emerald-800/30"></div>
    </div>

    <section class="relativep-4 flex lg:items-center min-h-screen">
      <div class="w-full grid gap-3 lg:grid-cols-2 items-center pb-12">
        <div class="p-6">
            <!-- Card -->
            <div class="rounded-3xl border border-blue-200/60 bg-white/80 backdrop-blur-md shadow-2xl dark:bg-neutral-900/70 dark:border-neutral-700">
            <!-- Header -->
            <header class="px-6 sm:px-10 pt-8 pb-6 text-center">
                <div class="mx-auto mb-4 flex items-center justify-center gap-3">
                <img src="/logo.png" alt="Logo" class="h-10 w-auto rounded-md" />
                <span class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold
                            bg-blue-100 700 dark:bg-blue-900/40 dark:200">
                    <Icon icon="ph:wrench-duotone" class="size-4" />
                    Scheduled Maintenance
                </span>
                </div>

                <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight 900 dark:100">
                Situs sedang dalam perawatan
                </h1>
                <p class="mt-2 text-sm sm:text-base 900/70 dark:text-neutral-300">
                Ambil jeda sejenak—mainkan mini-game di bawah ini sambil menunggu. 🎮
                </p>

                <!-- Progress (Preline style) -->
                <div class="mt-5">
                <div class="w-full h-2 rounded-full bg-blue-100 dark:bg-neutral-800 overflow-hidden">
                    <div
                    class="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full animate-[progress_3s_ease-in-out_infinite]"
                    style="width: 45%"
                    />
                </div>
                </div>
            </header>
            <!-- Actions -->
            <div class="px-6 sm:px-10 pb-8">
                <div class="grid sm:grid-cols-3 gap-3">
                <!-- WhatsApp -->
                <a
                    :href="whatsAppUrl"
                    target="_blank"
                    rel="noopener"
                    class="hs-tooltip inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold
                        bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 transition
                        shadow-lg shadow-emerald-500/20"
                >
                    <Icon icon="mdi:whatsapp" class="size-5" />
                    Hubungi WhatsApp
                </a>

                <!-- Sencra.io -->
                <a
                    href="https://sencra.io"
                    class="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold
                        bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition
                        shadow-lg shadow-blue-600/20"
                    target="_blank" rel="noopener"
                >
                    <Icon icon="ph:arrow-up-right-bold" class="size-5" />
                    Kunjungi Sencra.io
                </a>

                <!-- Obayan.id -->
                <a
                    href="https://obayan.id"
                    class="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold
                        bg-white 700 ring-1 ring-inset ring-blue-200 hover:bg-blue-50 transition
                        dark:bg-neutral-900 dark:200 dark:ring-neutral-700 dark:hover:bg-neutral-800"
                    target="_blank" rel="noopener"
                >
                    <Icon icon="ph:student-duotone" class="size-5" />
                    Kunjungi Obayan.id
                </a>
                </div>

                <p class="mt-4 text-center text-xs 900/60 dark:text-neutral-400">
                Butuh bantuan cepat? WA: {{ phoneDisplay }} • Email: team-sencra@gmail.com
                </p>
            </div>
            </div>
        </div>

        <div class="px-3 sm:px-6 pb-6">
            <MaintenanceGame :duration="30" class="rounded-2xl border border-emerald-200/60 bg-emerald-50/70 dark:bg-emerald-900/20 dark:border-emerald-800" />
        </div>


        <!-- Footer tiny -->
        <footer class="mt-4 text-center text-xs 900/50 dark:text-neutral-500">
          © {{ new Date().getFullYear() }} Team Sencra Obayan • All rights reserved
        </footer>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import MaintenanceGame from '~/components/MaintenanceGame.vue'
// Iconify (nuxt-icon or @iconify/vue). Assuming <Icon> is globally available.

const phone = '62895396004952' // ganti dengan nomor WA Anda
const phoneDisplay = computed(() => `+${phone}`)
const whatsAppUrl = computed(() => `https://wa.me/${phone}`)
</script>

<style>
@keyframes progress {
  0% { transform: translateX(-60%); }
  50% { transform: translateX(0%); }
  100% { transform: translateX(60%); }
}
</style>
