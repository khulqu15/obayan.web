<template>
  <div class="space-y-6 p-4 sm:p-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Pembayaran</h1>
        <p class="text-sm text-gray-600 dark:text-neutral-400">Kelola tagihan SPP & Syahriyahasi santri.</p>
      </div>
      <div class="flex gap-2">
        <NuxtLink to="#" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700">
          <Icon icon="lucide:credit-card" class="size-4" /> Bayar Sekarang
        </NuxtLink>
        <NuxtLink to="#" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
          <Icon icon="lucide:download" class="size-4" /> Unduh Laporan
        </NuxtLink>
      </div>
    </div>

    <div class="grid md:grid-cols-4 gap-3">
      <div v-for="s in stats" :key="s.label" class="rounded-xl border border-gray-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500 dark:text-neutral-400">{{ s.label }}</p>
          <Icon :icon="s.icon" class="size-4 text-gray-400" />
        </div>
        <p class="mt-2 text-xl font-semibold text-gray-900 dark:text-white">{{ s.value }}</p>
        <p class="mt-1 text-xs" :class="s.trend > 0 ? '600' : s.trend < 0 ? 'text-rose-600' : 'text-gray-500'">
          <span v-if="s.trend > 0">▲</span>
          <span v-else-if="s.trend < 0">▼</span>
          <span v-else>•</span>
          {{ Math.abs(s.trend) }}% vs bln lalu
        </p>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-800">
          <h2 class="font-semibold text-gray-900 dark:text-white">Tagihan Aktif</h2>
          <NuxtLink to="#" class="text-sm 600 hover:underline">Lihat semua</NuxtLink>
        </div>
        <div class="divide-y divide-gray-200 dark:divide-neutral-800">
          <div v-for="b in bills" :key="b.id" class="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center justify-center size-8 rounded-lg bg-blue-50 600 dark:bg-blue-900/20 dark:300">
                  <Icon :icon="b.icon" class="size-4" />
                </span>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ b.title }}</p>
                  <p class="text-xs text-gray-500 dark:text-neutral-400">{{ b.subtitle }}</p>
                </div>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-gray-900 dark:text-white">{{ formatIDR(b.amount) }}</p>
              <p class="text-xs" :class="b.dueStatus === 'due' ? 'text-rose-600' : 'text-gray-500'">
                Jatuh tempo: {{ b.due }}
              </p>
            </div>
            <div class="flex gap-2 sm:ms-2">
              <NuxtLink to="#" class="px-3 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800">Rincian</NuxtLink>
              <NuxtLink to="#" class="px-3 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700">Bayar</NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Preferensi Pembayaran / VA -->
      <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div class="p-4 border-b border-gray-200 dark:border-neutral-800">
          <h2 class="font-semibold text-gray-900 dark:text-white">Virtual Account</h2>
          <p class="text-xs text-gray-500 dark:text-neutral-400">Gunakan salah satu bank berikut.</p>
        </div>
        <div class="p-4 space-y-3">
          <div v-for="va in vaList" :key="va.bank" class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-neutral-800/60 border border-gray-200 dark:border-neutral-700">
            <div>
              <p class="text-sm font-medium">{{ va.bank }}</p>
              <p class="text-xs text-gray-500">{{ va.name }}</p>
            </div>
            <div class="text-right">
              <p class="font-mono text-sm">{{ va.number }}</p>
              <NuxtLink to="#" class="text-xs 600 hover:underline">Salin</NuxtLink>
            </div>
          </div>
          <NuxtLink to="#" class="inline-flex items-center gap-2 text-sm 600 hover:underline">
            <Icon icon="lucide:plus" class="size-4" /> Tambah metode lain
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Riwayat Pembayaran + Pengumuman -->
    <div class="grid lg:grid-cols-3 gap-4">
      <!-- Table History -->
      <div class="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900">
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-800">
          <h2 class="font-semibold text-gray-900 dark:text-white">Riwayat Pembayaran</h2>
          <NuxtLink to="#" class="text-sm 600 hover:underline">Lihat semua</NuxtLink>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50 dark:bg-neutral-800/60 text-gray-600 dark:text-neutral-300">
              <tr>
                <th class="px-4 py-3 text-left font-medium">Invoice</th>
                <th class="px-4 py-3 text-left font-medium">Jenis</th>
                <th class="px-4 py-3 text-left font-medium">Bulan</th>
                <th class="px-4 py-3 text-left font-medium">Metode</th>
                <th class="px-4 py-3 text-left font-medium">Tanggal</th>
                <th class="px-4 py-3 text-left font-medium">Jumlah</th>
                <th class="px-4 py-3 text-left font-medium">Status</th>
                <th class="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-neutral-800">
              <tr v-for="h in history" :key="h.id" class="hover:bg-gray-50/60 dark:hover:bg-neutral-800/50">
                <td class="px-4 py-3 font-medium">{{ h.id }}</td>
                <td class="px-4 py-3">{{ h.type }}</td>
                <td class="px-4 py-3">{{ h.month }}</td>
                <td class="px-4 py-3">{{ h.method }}</td>
                <td class="px-4 py-3">{{ h.date }}</td>
                <td class="px-4 py-3 font-medium">{{ formatIDR(h.amount) }}</td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium"
                    :class="h.status === 'Lunas'
                      ? 'bg-emerald-50 600 dark:bg-emerald-900/20 dark:300'
                      : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300'"
                  >
                    <span class="size-1.5 rounded-full" :class="h.status === 'Lunas' ? 'bg-white' : 'bg-amber-500'"></span>
                    {{ h.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <NuxtLink to="#" class="600 hover:underline">Lihat struk</NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pengumuman -->
      <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div class="p-4 border-b border-gray-200 dark:border-neutral-800">
          <h2 class="font-semibold text-gray-900 dark:text-white">Pengumuman</h2>
        </div>
        <div class="p-4 space-y-3">
          <article v-for="(n, i) in notices" :key="i" class="p-3 rounded-xl bg-gray-50 dark:bg-neutral-800/60 border border-gray-200 dark:border-neutral-700">
            <div class="flex items-start gap-2">
              <span class="mt-1 inline-flex items-center justify-center size-6 rounded-lg bg-blue-100 700 dark:bg-blue-900/30 dark:300">
                <Icon :icon="n.icon" class="size-3.5" />
              </span>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ n.title }}</p>
                <p class="text-xs text-gray-500 dark:text-neutral-400">{{ n.date }}</p>
                <p class="mt-1 text-sm text-gray-700 dark:text-neutral-300">{{ n.body }}</p>
                <div class="mt-2">
                  <NuxtLink to="#" class="text-xs 600 hover:underline">Baca selengkapnya</NuxtLink>
                </div>
              </div>
            </div>
          </article>
          <NuxtLink to="#" class="inline-flex items-center gap-2 text-sm 600 hover:underline">
            <Icon icon="lucide:megaphone" class="size-4" /> Semua pengumuman
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'app', layoutProps: { title: 'Pembayaran' } })

const stats = [
  { label: 'Tagihan Aktif', value: 'Rp 490.000', trend: 5, icon: 'lucide:receipt' },
  { label: 'Tunggakan', value: 'Rp 100.000', trend: -12, icon: 'lucide:alarm-clock' },
  { label: 'Sudah Dibayar (bln ini)', value: 'Rp 390.000', trend: 8, icon: 'lucide:check-circle' },
  { label: 'Jatuh Tempo Terdekat', value: '10 Sep 2025', trend: 0, icon: 'lucide:calendar-days' },
]

const bills = [
  {
    id: 'BILL-SPP-0925',
    title: 'SPP September 2025',
    subtitle: 'Nama: Ahmad Zidan — Kelas 8B',
    amount: 100_000,
    due: '10 Sep 2025',
    dueStatus: 'due',
    icon: 'lucide:school'
  },
  {
    id: 'BILL-TRP-0925',
    title: 'Syahriyah September 2025',
    subtitle: 'Rute: Pandaan — PP',
    amount: 390_000,
    due: '10 Sep 2025',
    dueStatus: 'due',
    icon: 'lucide:bus'
  },
]

const history = [
  { id: 'INV-2025-0810-001', type: 'SPP', month: 'Agustus 2025', method: 'VA BSI', date: '10 Agu 2025', amount: 100_000, status: 'Lunas' },
  { id: 'INV-2025-0810-002', type: 'Syahriyah', month: 'Agustus 2025', method: 'QRIS', date: '10 Agu 2025', amount: 390_000, status: 'Lunas' },
  { id: 'INV-2025-0710-003', type: 'SPP', month: 'Juli 2025', method: 'VA BSI', date: '10 Jul 2025', amount: 100_000, status: 'Lunas' },
  { id: 'INV-2025-0710-004', type: 'Syahriyah', month: 'Juli 2025', method: 'QRIS', date: '10 Jul 2025', amount: 390_000, status: 'Lunas' },
]

const vaList = [
  { bank: 'BSI',   name: 'Yayasan Ponpes ALBERR', number: '70084123xxxx' },
  { bank: 'BRI',   name: 'Yayasan Ponpes ALBERR', number: '0024477xxxx' },
  { bank: 'BCA',   name: 'Yayasan Ponpes ALBERR', number: '8371122xxxx' },
]

const formatter = Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
const formatIDR = (n: number) => formatter.format(n)
</script>
