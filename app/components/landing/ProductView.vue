<template>
  <section class="relative overflow-hidden">
    <!-- BG: Duolingo green + blobs + subtle grid -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <!-- Core gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-400 via-emerald-500 to-lime-600 dark:from-emerald-700 dark:via-emerald-800 dark:to-lime-700" />
      <!-- Soft grid -->
      <div class="absolute inset-0 mix-blend-multiply opacity-30 dark:opacity-20
                  bg-[linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <!-- Radial mask -->
      <div class="absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent_80%)]" />
      <!-- Blobs -->
      <div class="absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-50 bg-lime-500 dark:bg-lime-600/40" />
      <div class="absolute top-40 -right-24 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-40 bg-emerald-200 dark:bg-emerald-900/40" />
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div class="grid lg:grid-cols-12 gap-8 items-center">
        <!-- Copy -->
        <div class="lg:col-span-7 text-white">
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 ring-1 ring-white/30 backdrop-blur">
            <Icon icon="solar:stars-line-duotone" class="size-4" />
            Obayan • Produk & Add-On Terintegrasi
          </span>

          <h1 class="mt-4 font-extrabold tracking-tight text-3xl sm:text-4xl xl:text-5xl">
            Website, App, dan Add-On
            <span class="inline-block">yang saling terhubung.</span>
          </h1>

          <p class="mt-3 text-white/90 max-w-2xl">
            Bangun ekosistem digital sekolah/pesantren: SIAKAD, CMS, CBT, presensi, hingga notifikasi otomatis.
            Lincah, hemat waktu, dan siap tumbuh.
          </p>

          <!-- Badges: categories + counts -->
          <div class="mt-5 flex flex-wrap items-center gap-2">
            <span
              v-for="c in catStats"
              :key="c.name"
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/15 ring-1 ring-white/30 backdrop-blur">
              <Icon :icon="c.icon" class="size-4" />
              {{ c.name }} • {{ c.count }}
            </span>
          </div>

          <!-- CTA -->
          <div class="mt-6 flex flex-wrap gap-3">
            <NuxtLink
              :to="{ path: '/produk' }"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold bg-white text-emerald-700 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
              Jelajahi Produk
              <Icon icon="lucide:arrow-right" class="size-4" />
            </NuxtLink>

            <NuxtLink
              to="#demo"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold ring-1 ring-white/40 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/70">
              Minta Demo
              <Icon icon="lucide:sparkles" class="size-4" />
            </NuxtLink>
          </div>

          <!-- Mini highlights -->
          <ul class="mt-6 grid sm:grid-cols-3 gap-2 text-sm">
            <li class="inline-flex items-center gap-2">
              <Icon icon="lucide:git-merge" class="size-4" />
              Integrasi mulus
            </li>
            <li class="inline-flex items-center gap-2">
              <Icon icon="lucide:rocket" class="size-4" />
              Implementasi cepat
            </li>
            <li class="inline-flex items-center gap-2">
              <Icon icon="lucide:shield-check" class="size-4" />
              Keamanan & audit
            </li>
          </ul>
        </div>

        <!-- Visual card -->
        <div class="lg:col-span-5">
          <div class="rounded-3xl p-5 sm:p-6 bg-white/90 text-emerald-900 shadow-2xl ring-1 ring-white/60 backdrop-blur">
            <div class="flex items-start gap-3">
              <div class="size-12 rounded-2xl flex items-center justify-center bg-emerald-100 text-emerald-700">
                <Icon icon="lucide:app-window" class="size-6" />
              </div>
              <div class="grow">
                <h3 class="font-extrabold">Ekosistem Produk Obayan</h3>
                <p class="text-sm text-emerald-900/80">
                  Data mengalir dari Website ⇄ App ⇄ Add-On secara real-time.
                </p>
              </div>
            </div>

            <!-- Stats -->
            <div class="mt-4 grid grid-cols-3 gap-2">
              <div class="rounded-2xl p-3 bg-emerald-50 ring-1 ring-emerald-100 text-center">
                <p class="text-2xl font-extrabold leading-none">{{ totalProducts }}</p>
                <p class="text-[11px] mt-1">Produk</p>
              </div>
              <div class="rounded-2xl p-3 bg-emerald-50 ring-1 ring-emerald-100 text-center">
                <p class="text-2xl font-extrabold leading-none">{{ totalCategories }}</p>
                <p class="text-[11px] mt-1">Kategori</p>
              </div>
              <div class="rounded-2xl p-3 bg-emerald-50 ring-1 ring-emerald-100 text-center">
                <p class="text-2xl font-extrabold leading-none">Ready</p>
                <p class="text-[11px] mt-1">Integrasi</p>
              </div>
            </div>

            <!-- Quick links -->
            <div class="mt-4 flex flex-wrap gap-2">
              <NuxtLink
                v-for="c in catStats"
                :key="`link-${c.name}`"
                :to="{ path: '/produk', query: { slug: c.sampleSlug || undefined } }"
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border border-emerald-200 hover:bg-emerald-50">
                <Icon :icon="c.icon" class="size-4" />
                Lihat {{ c.name }}
              </NuxtLink>
            </div>

            <!-- Footer note -->
            <p class="mt-3 text-[11px] text-emerald-900/70">
              *Cocok untuk tahap awal maupun skala besar. Semua modul dapat diaktifkan bertahap.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { Category, Product } from '~/data/produk'
import { produk } from '~/data/produk'

// Basic stats
const totalProducts = computed(() => produk.length)

const categories = computed<Category[]>(() => {
  const set = new Set<Category>()
  for (const p of produk) set.add(p.category)
  return [...set]
})
const totalCategories = computed(() => categories.value.length)

// Category chips with counts & sample slug for quick link
const catStats = computed(() => {
  const iconMap: Record<Category, string> = {
    'Website': 'ph:globe',
    'Mobile App': 'ph:device-mobile',
    'Add-On': 'lucide:plug'
  }
  const groups: Record<Category, { count: number; sampleSlug?: string }> = {
    'Website': { count: 0, sampleSlug: undefined },
    'Mobile App': { count: 0, sampleSlug: undefined },
    'Add-On': { count: 0, sampleSlug: undefined }
  }
  ;(produk as Product[]).forEach(p => {
    groups[p.category].count++
    if (!groups[p.category].sampleSlug) groups[p.category].sampleSlug = p.slug
  })

  return (Object.keys(groups) as Category[]).map(name => ({
    name,
    count: groups[name].count,
    icon: iconMap[name],
    sampleSlug: groups[name].sampleSlug
  }))
})
</script>
