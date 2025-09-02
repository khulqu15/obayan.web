<template>
  <section class="py-20 relative overflow-hidden" id="pricing">
    <!-- background lembut -->
    <div class="absolute inset-0 -z-10">
      <div class="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(16,185,129,0.08)_1px,transparent_1px)] [background-size:18px_18px]" />
    </div>

    <div class="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex items-end justify-between gap-3">
        <div>
          <h2 class="text-3xl sm:text-5xl font-extrabold tracking-tight">
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">
              Harga yang transparan
            </span>
          </h2>
          <p class="text-gray-600 dark:text-neutral-300">
            Bayar bulanan atau hemat 2 bulan dengan paket tahunan.
          </p>
        </div>

        <!-- Billing toggle -->
        <div class="flex items-center gap-3 text-sm">
          <span :class="billing==='monthly' ? 'font-semibold' : 'text-gray-500'">Bulanan</span>
          <button
            @click="toggleBilling"
            class="relative inline-flex h-8 w-16 items-center rounded-full bg-gray-200 dark:bg-neutral-700 transition focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
            aria-label="Toggle periode penagihan"
          >
            <span
              class="absolute inset-y-0 my-auto h-6 w-6 rounded-full bg-white dark:bg-neutral-900 shadow transition-all"
              :class="billing==='monthly' ? 'left-1' : 'left-[calc(100%-1.75rem)]'"
            />
          </button>
          <span :class="billing==='yearly' ? 'font-semibold' : 'text-gray-500'">Tahunan</span>

          <!-- badge hemat ketika yearly -->
          <span
            v-if="billing==='yearly'"
            class="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 px-3 py-1 text-[11px] font-medium"
          >
            <Icon icon="ph:percent-bold" class="size-4" /> Hemat 2 bulan
          </span>
        </div>
      </div>

      <!-- Cards -->
      <div class="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="p in plans"
          :key="p.id"
          class="group relative rounded-3xl border bg-white/70 dark:bg-white/5 border-white/60 dark:border-white/10 backdrop-blur-xl shadow-xl p-6 transition-all hover:-translate-y-0.5 hover:shadow-2xl"
          :class="p.highlight ? 'ring-2 ring-emerald-400/60' : ''"
        >
          <!-- ribbon populer -->
          <div
            v-if="p.highlight"
            class="absolute -top-2 right-4 text-[11px] px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow"
          >
            Terpopuler
          </div>

          <!-- head -->
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="text-xl font-extrabold tracking-tight">{{ p.name }}</h3>
              <p class="mt-1 text-gray-600 dark:text-neutral-300 text-sm">
                {{ p.id==='enterprise' ? 'Hubungi kami untuk paket skala besar' : 'Cocok untuk pondok bertumbuh' }}
              </p>
            </div>

            <!-- badge hemat (mobile di card) -->
            <span
              v-if="billing==='yearly'"
              class="sm:hidden inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 px-2 py-0.5 text-[10px] font-medium"
            >
              Hemat 2 bulan
            </span>
          </div>

          <!-- harga -->
          <div class="mt-5">
            <div v-if="p.id!=='enterprise'" class="flex items-baseline gap-1">
              <span class="text-3xl font-extrabold tabular-nums">{{ priceText(p) }}</span>
              <span class="text-gray-500 text-sm">/ {{ billing==='monthly' ? 'bulan' : 'tahun' }}</span>
            </div>
            <div v-else class="text-3xl font-extrabold">Custom</div>

            <!-- approx per-bulan jika yearly -->
            <div v-if="p.id!=='enterprise' && billing==='yearly'" class="mt-1 text-xs text-gray-600 dark:text-neutral-300">
              ≈ {{ approxMonthly(p) }} / bulan
            </div>
          </div>

          <!-- divider halus -->
          <div class="my-5 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-neutral-800 to-transparent" />

          <!-- FITUR -->
          <ul class="space-y-2 text-sm max-h-[360px] overflow-auto" :id="`perks-${p.id}`">
            <li v-for="perk in shownPerks(p)" :key="perk" class="flex items-start gap-2">
              <Icon
                icon="mdi:check-circle"
                class="mt-0.5 w-4 h-4 text-emerald-600"
                aria-hidden="true"
              />
              <span>{{ perk }}</span>
            </li>
          </ul>

          <!-- Selengkapnya / Ringkas -->
          <div class="mt-3">
            <button
              v-if="canShowMore(p)"
              @click="showMore(p)"
              class="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
              :aria-controls="`perks-${p.id}`"
            >
              Selengkapnya ({{ nextChunkCount(p) }} lagi)
            </button>
            <button
              v-else-if="isExpanded(p)"
              @click="showLess(p)"
              class="text-sm text-gray-600 dark:text-neutral-300 hover:underline"
              :aria-controls="`perks-${p.id}`"
            >
              Ringkas
            </button>
          </div>

          <!-- CTA -->
          <div class="mt-6 flex gap-2">
            <a
              v-if="p.id!=='enterprise'"
              href="#demo"
              class="flex-1 inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-sm font-semibold transition focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
            >
              Coba
            </a>
            <a
              href="#contact"
              class="flex-1 inline-flex items-center justify-center rounded-xl border border-gray-300 dark:border-neutral-700 px-4 py-2.5 text-sm font-semibold text-gray-800 dark:text-neutral-100 hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
            >
              Hubungi
            </a>
          </div>

          <!-- glow dekoratif -->
          <div class="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
            <div class="absolute -right-10 -bottom-10 size-32 rounded-full bg-emerald-400/10 blur-2xl" />
          </div>
        </article>
      </div>

      <p class="mt-6 text-xs text-gray-500">
        Harga belum termasuk PPN. Fitur pembayaran online memerlukan aktivasi kanal mitra.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useObayan } from '~/composables/useObayan'

const { plans } = useObayan()

const billing = ref<'monthly' | 'yearly'>('monthly')
const toggleBilling = () => (billing.value = billing.value === 'monthly' ? 'yearly' : 'monthly')

function currency(n: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(n)
}
function priceText(p: any) {
  return billing.value === 'monthly' ? currency(p.price.monthly) : currency(p.price.yearly)
}
function approxMonthly(p: any) {
  // tampilkan estimasi per-bulan ketika yearly aktif
  const val = Math.round((p.price.yearly || 0) / 12)
  return currency(val)
}

/**
 * Show-More by 10 items per click per-plan
 */
const BASE_COUNT = 10
const step = 10
const showCounts = ref<Record<string, number>>({})

function getShownCount(p: any) {
  const current = showCounts.value[p.id]
  if (typeof current === 'number') return current
  const init = Math.min(BASE_COUNT, (p?.perks?.length ?? 0))
  showCounts.value[p.id] = init
  return init
}
function shownPerks(p: any) {
  const n = getShownCount(p)
  return (p?.perks ?? []).slice(0, n)
}
function canShowMore(p: any) {
  return getShownCount(p) < (p?.perks?.length ?? 0)
}
function nextChunkCount(p: any) {
  const remaining = (p?.perks?.length ?? 0) - getShownCount(p)
  return Math.min(step, Math.max(remaining, 0))
}
function showMore(p: any) {
  const n = getShownCount(p)
  const total = p?.perks?.length ?? 0
  showCounts.value[p.id] = Math.min(n + step, total)
}
function isExpanded(p: any) {
  return (p?.perks?.length ?? 0) > BASE_COUNT && getShownCount(p) > BASE_COUNT
}
function showLess(p: any) {
  showCounts.value[p.id] = Math.min(BASE_COUNT, p?.perks?.length ?? BASE_COUNT)
}
</script>
