<template>
  <section class="space-y-6 p-4 md:p-6">
    <!-- Hero -->
    <div class="relative overflow-hidden rounded-[32px] border border-green-100 bg-gradient-to-br from-green-600 via-green-600 to-lime-500 p-5 text-white shadow-[0_24px_70px_-28px_rgba(22,163,74,0.55)] dark:border-neutral-800 md:p-7">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-white blur-3xl"></div>
        <div class="absolute -bottom-14 left-8 h-40 w-40 rounded-full bg-lime-200 blur-3xl"></div>
      </div>

      <div class="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div class="min-w-0">
          <div class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold ring-1 ring-white/20 backdrop-blur">
            <span class="h-2 w-2 rounded-full bg-lime-300"></span>
            Informasi Resmi
          </div>

          <h1 class="mt-4 text-2xl font-black tracking-tight md:text-4xl">
            Pengumuman Wali Santri
          </h1>

          <p class="mt-2 max-w-xl text-sm leading-6 text-green-50/90 md:text-base">
            Pantau informasi penting, agenda, administrasi, akademik, dan pemberitahuan resmi secara realtime.
          </p>
        </div>

        <div class="grid grid-cols-3 gap-2 lg:min-w-[360px]">
          <div class="rounded-2xl bg-white/12 p-3 text-center ring-1 ring-white/15 backdrop-blur">
            <div class="text-xl font-black">{{ announcements.length }}</div>
            <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Total</div>
          </div>

          <div class="rounded-2xl bg-white/12 p-3 text-center ring-1 ring-white/15 backdrop-blur">
            <div class="text-xl font-black">{{ importantCount }}</div>
            <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Penting</div>
          </div>

          <div class="rounded-2xl bg-white/12 p-3 text-center ring-1 ring-white/15 backdrop-blur">
            <div class="text-xl font-black">{{ upcomingCount }}</div>
            <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Agenda</div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Insight -->
    <div class="grid gap-4 xl:grid-cols-[1fr,0.85fr]">
      <div class="relative overflow-hidden rounded-[32px] border border-green-100 bg-gradient-to-br from-slate-950 via-green-950 to-green-900 p-5 text-white shadow-sm dark:border-neutral-800">
        <div class="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-green-300/20 blur-3xl"></div>

        <div class="relative z-10">
          <div class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black ring-1 ring-white/15">
            <Icon icon="ph:sparkle-duotone" class="h-4 w-4" />
            AI Announcement Insight
          </div>

          <h2 class="mt-4 text-xl font-black">
            {{ aiInsight.title }}
          </h2>

          <p class="mt-2 text-sm leading-6 text-white/75">
            {{ aiInsight.desc }}
          </p>

          <div class="mt-5 grid gap-3 sm:grid-cols-3">
            <div class="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
              <div class="text-lg font-black">{{ aiInsight.daysLabel }}</div>
              <div class="mt-0.5 text-[11px] font-bold text-white/65">Sisa Waktu</div>
            </div>

            <div class="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
              <div class="truncate text-lg font-black">{{ aiInsight.category }}</div>
              <div class="mt-0.5 text-[11px] font-bold text-white/65">Kategori</div>
            </div>

            <div class="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
              <div class="text-lg font-black">{{ preparationItems.length }}</div>
              <div class="mt-0.5 text-[11px] font-bold text-white/65">Persiapan</div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-black text-slate-900 dark:text-white">
              Yang Perlu Disiapkan
            </h2>
            <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
              Rekomendasi otomatis dari pengumuman terdekat.
            </p>
          </div>

          <span class="rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
            Smart Reminder
          </span>
        </div>

        <div class="space-y-3">
          <div
            v-for="item in preparationItems"
            :key="item.title"
            :class="['rounded-[24px] border p-4', item.cardClass]"
          >
            <div class="flex items-start gap-3">
              <div :class="['grid h-10 w-10 shrink-0 place-items-center rounded-2xl', item.iconClass]">
                <Icon :icon="item.icon" class="h-5 w-5" />
              </div>

              <div class="min-w-0">
                <div class="font-black text-slate-900 dark:text-white">
                  {{ item.title }}
                </div>

                <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                  {{ item.desc }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Highlight -->
    <div class="grid gap-4 lg:grid-cols-[1fr,0.8fr]">
      <div class="relative overflow-hidden rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-green-100 blur-3xl dark:bg-green-900/20"></div>

        <div class="relative z-10">
          <div class="flex items-start gap-4">
            <div class="grid h-14 w-14 shrink-0 place-items-center rounded-[22px] bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
              <Icon icon="ph:megaphone-duotone" class="h-7 w-7" />
            </div>

            <div class="min-w-0">
              <h2 class="text-lg font-black text-slate-900 dark:text-white">
                Pusat Komunikasi Wali
              </h2>

              <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                Semua informasi penting dibuat agar wali lebih mudah memahami prioritas, jadwal, dan tindak lanjut yang perlu dilakukan.
              </p>
            </div>
          </div>

          <div class="mt-5 grid gap-3 sm:grid-cols-3">
            <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
              <div class="text-xs font-bold text-slate-500 dark:text-neutral-400">Agenda Terdekat</div>
              <div class="mt-1 line-clamp-1 text-sm font-black text-slate-900 dark:text-white">{{ nearestAnnouncementTitle }}</div>
            </div>

            <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
              <div class="text-xs font-bold text-slate-500 dark:text-neutral-400">Kategori Aktif</div>
              <div class="mt-1 text-sm font-black text-slate-900 dark:text-white">{{ categoryOptions.length }} kategori</div>
            </div>

            <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
              <div class="text-xs font-bold text-slate-500 dark:text-neutral-400">Update</div>
              <div class="mt-1 text-sm font-black text-slate-900 dark:text-white">{{ lastUpdateLabel }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h2 class="text-base font-black text-slate-900 dark:text-white">
              Prioritas Hari Ini
            </h2>
            <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
              Pengumuman yang perlu diperhatikan.
            </p>
          </div>

          <span class="rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
            Smart View
          </span>
        </div>

        <div class="space-y-3">
          <div
            v-for="item in priorityItems"
            :key="item.id"
            class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
          >
            <div class="flex items-start gap-3">
              <div :class="['grid h-10 w-10 shrink-0 place-items-center rounded-2xl', priorityIconClass(item)]">
                <Icon :icon="item.icon" class="h-5 w-5" />
              </div>

              <div class="min-w-0">
                <div class="line-clamp-1 font-black text-slate-900 dark:text-white">
                  {{ item.title }}
                </div>
                <p class="mt-1 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                  {{ item.summary }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="rounded-[32px] border border-white/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.3fr,0.7fr,0.7fr,0.55fr]">
        <div class="relative">
          <input
            v-model="filters.q"
            type="text"
            placeholder="Cari judul, kategori, agenda, administrasi..."
            class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:ring-green-500/10"
          />
          <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <Icon icon="lucide:search" class="h-4 w-4" />
          </span>
        </div>

        <select
          v-model="filters.category"
          class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        >
          <option value="semua">Semua Kategori</option>
          <option
            v-for="category in categoryOptions"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>

        <select
          v-model="filters.priority"
          class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        >
          <option value="semua">Semua Prioritas</option>
          <option value="penting">Penting</option>
          <option value="normal">Normal</option>
          <option value="informasi">Informasi</option>
        </select>

        <button
          type="button"
          @click="resetFilters"
          class="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Category Pills -->
    <div class="flex gap-2 overflow-x-auto pb-1">
      <button
        v-for="tab in categoryTabs"
        :key="tab.key"
        type="button"
        @click="filters.category = tab.key"
        :class="[
          'shrink-0 rounded-2xl px-4 py-2.5 text-sm font-black transition',
          filters.category === tab.key
            ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
            : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800'
        ]"
      >
        {{ tab.label }}
        <span
          :class="[
            'ml-1 rounded-full px-2 py-0.5 text-[11px]',
            filters.category === tab.key
              ? 'bg-white/18 text-white'
              : 'bg-slate-100 text-slate-500 dark:bg-neutral-800 dark:text-neutral-400'
          ]"
        >
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Announcements -->
    <div v-if="loading" class="grid gap-4 lg:grid-cols-2">
      <div
        v-for="i in 2"
        :key="i"
        class="h-80 animate-pulse rounded-[32px] bg-slate-100 dark:bg-neutral-800"
      ></div>
    </div>

    <div
      v-else-if="filteredAnnouncements.length === 0"
      class="rounded-[32px] border border-dashed border-slate-300 bg-white p-10 text-center dark:border-neutral-700 dark:bg-neutral-900"
    >
      <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
        <Icon icon="ph:megaphone-duotone" class="h-9 w-9" />
      </div>

      <h3 class="mt-4 text-lg font-black text-slate-900 dark:text-white">
        Pengumuman tidak ditemukan
      </h3>

      <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
        Coba ubah kata kunci, kategori, atau prioritas.
      </p>
    </div>

    <div v-else class="grid gap-4 lg:grid-cols-2">
      <article
        v-for="item in filteredAnnouncements"
        :key="item.id"
        class="group overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div class="relative p-5">
          <div class="absolute right-5 top-5">
            <span :class="['rounded-full px-3 py-1.5 text-xs font-black capitalize', priorityBadgeClass(item.priority)]">
              {{ item.priority }}
            </span>
          </div>

          <div class="pr-24">
            <div :class="['grid h-14 w-14 place-items-center rounded-[22px]', announcementIconClass(item.category)]">
              <Icon :icon="item.icon" class="h-7 w-7" />
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-400 dark:text-neutral-500">
              <span>{{ item.category }}</span>
              <span>•</span>
              <span>{{ formatDate(item.publishedAt) }}</span>
            </div>

            <h2 class="mt-2 line-clamp-2 text-xl font-black text-slate-900 dark:text-white">
              {{ item.title }}
            </h2>

            <p class="mt-2 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-neutral-400">
              {{ item.summary }}
            </p>
          </div>

          <div class="mt-5 rounded-[26px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
            <div class="grid gap-3 sm:grid-cols-3">
              <div>
                <div class="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Tanggal
                </div>
                <div class="mt-1 text-sm font-black text-slate-900 dark:text-white">
                  {{ formatDate(item.eventDate || item.publishedAt) }}
                </div>
              </div>

              <div>
                <div class="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Target
                </div>
                <div class="mt-1 text-sm font-black text-slate-900 dark:text-white">
                  {{ item.target }}
                </div>
              </div>

              <div>
                <div class="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Status
                </div>
                <div class="mt-1 text-sm font-black text-slate-900 dark:text-white">
                  {{ item.status }}
                </div>
              </div>
            </div>
          </div>

          <div class="mt-5 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              @click="openDetail(item)"
              class="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
            >
              Baca Detail
              <Icon icon="lucide:arrow-right" class="h-4 w-4" />
            </button>

            <button
              type="button"
              @click="copyAnnouncement(item)"
              class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <Icon icon="ph:copy-duotone" class="h-4 w-4" />
              Salin
            </button>
          </div>
        </div>
      </article>
    </div>

    <!-- Detail Modal -->
    <div
      v-if="detailOpen && selectedAnnouncement"
      class="fixed inset-0 z-[9999] overflow-y-auto p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Tutup modal"
        @click="closeDetail"
      ></button>

      <div class="relative z-10 flex min-h-full items-center justify-center">
        <div class="w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
          <div class="border-b border-slate-100 p-5 dark:border-neutral-800">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <span :class="['rounded-full px-3 py-1.5 text-xs font-black capitalize', priorityBadgeClass(selectedAnnouncement.priority)]">
                    {{ selectedAnnouncement.priority }}
                  </span>

                  <span class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700 dark:bg-neutral-800 dark:text-neutral-300">
                    {{ selectedAnnouncement.category }}
                  </span>
                </div>

                <h3 class="mt-3 text-xl font-black text-slate-900 dark:text-white md:text-2xl">
                  {{ selectedAnnouncement.title }}
                </h3>

                <p class="mt-1 text-sm text-slate-500 dark:text-neutral-400">
                  Dipublikasikan {{ formatDate(selectedAnnouncement.publishedAt) }}
                </p>
              </div>

              <button
                type="button"
                @click="closeDetail"
                class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                <Icon icon="lucide:x" class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div class="max-h-[75vh] space-y-5 overflow-y-auto p-5">
            <div class="rounded-[28px] border border-slate-100 bg-slate-50 p-5 dark:border-neutral-800 dark:bg-neutral-800/60">
              <p class="whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-neutral-300">
                {{ selectedAnnouncement.content }}
              </p>
            </div>

            <div class="grid gap-3 sm:grid-cols-3">
              <div class="rounded-[24px] border border-slate-100 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">Agenda</div>
                <div class="mt-1 text-sm font-black text-slate-900 dark:text-white">
                  {{ formatDate(selectedAnnouncement.eventDate || selectedAnnouncement.publishedAt) }}
                </div>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">Target</div>
                <div class="mt-1 text-sm font-black text-slate-900 dark:text-white">
                  {{ selectedAnnouncement.target }}
                </div>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">Status</div>
                <div class="mt-1 text-sm font-black text-slate-900 dark:text-white">
                  {{ selectedAnnouncement.status }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap justify-end gap-2 border-t border-slate-100 p-5 dark:border-neutral-800">
            <button
              type="button"
              @click="copyAnnouncement(selectedAnnouncement)"
              class="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Salin Pengumuman
            </button>

            <button
              type="button"
              @click="closeDetail"
              class="rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
            >
              Mengerti
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div
      v-if="toastMessage"
      class="fixed bottom-24 left-1/2 z-[9999] w-[92%] max-w-sm -translate-x-1/2 rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white shadow-2xl"
    >
      {{ toastMessage }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { onValue, ref as dbRef } from 'firebase/database'
import { useNuxtApp, useRuntimeConfig } from 'nuxt/app'

definePageMeta({
  layout: 'wali'
})

type AnnouncementPriority = 'penting' | 'normal' | 'informasi'

type Announcement = {
  id: string
  title: string
  summary: string
  content: string
  category: string
  priority: AnnouncementPriority
  target: string
  status: string
  icon: string
  publishedAt: number
  eventDate?: number
  deadlineDate?: number
  isRead?: boolean
}

type PreparationItem = {
  title: string
  desc: string
  icon: string
  cardClass: string
  iconClass: string
}

const config = useRuntimeConfig()
const { $realtimeDb } = useNuxtApp() as any

const clientName = String(config.public.clientName || 'alinayah')

const loading = ref(true)
const remoteAnnouncements = ref<Announcement[]>([])
const detailOpen = ref(false)
const selectedAnnouncement = ref<Announcement | null>(null)
const toastMessage = ref('')

const filters = ref({
  q: '',
  category: 'semua',
  priority: 'semua'
})

let unsubscribers: Array<() => void> = []
let toastTimer: ReturnType<typeof setTimeout> | null = null

const defaultAnnouncements: Announcement[] = [
  {
    id: 'default-spp',
    title: 'Pengingat Pembayaran SPP dan Administrasi Bulanan',
    summary: 'Wali santri diimbau mengecek tagihan SPP, invoice, dan status pembayaran melalui menu Pembayaran.',
    content:
      'Assalamu’alaikum warahmatullahi wabarakatuh.\n\nKami informasikan bahwa pembayaran SPP dan administrasi bulanan dapat dipantau melalui Portal Wali. Wali santri dapat melihat daftar tagihan, invoice, status pembayaran, serta mengirimkan konfirmasi pembayaran.\n\nMohon memastikan pembayaran dilakukan sesuai jadwal. Jika sudah melakukan transfer, pastikan bukti pembayaran jelas dan sesuai nominal.\n\nWassalamu’alaikum warahmatullahi wabarakatuh.',
    category: 'Administrasi',
    priority: 'penting',
    target: 'Seluruh Wali',
    status: 'Aktif',
    icon: 'akar-icons:money',
    publishedAt: Date.now() - 1000 * 60 * 60 * 24,
    eventDate: Date.now() + 1000 * 60 * 60 * 24 * 2,
    deadlineDate: Date.now() + 1000 * 60 * 60 * 24 * 5,
    isRead: false
  },
  {
    id: 'default-akademik',
    title: 'Pemantauan Akademik, Absensi, dan Hafalan Santri',
    summary: 'Wali santri dapat memantau nilai, absensi, hafalan, pelanggaran, perizinan, dan perkembangan santri secara realtime.',
    content:
      'Assalamu’alaikum warahmatullahi wabarakatuh.\n\nKami informasikan bahwa fitur pemantauan perkembangan santri dapat diakses melalui Portal Wali. Informasi yang tersedia meliputi akademik, absensi, hafalan, perizinan, pelanggaran, dan pembayaran.\n\nWali santri diharapkan melakukan pengecekan berkala agar pendampingan santri dapat dilakukan dengan lebih baik.\n\nWassalamu’alaikum warahmatullahi wabarakatuh.',
    category: 'Akademik',
    priority: 'informasi',
    target: 'Wali Santri Aktif',
    status: 'Aktif',
    icon: 'solar:chart-linear',
    publishedAt: Date.now() - 1000 * 60 * 60 * 8,
    eventDate: Date.now() + 1000 * 60 * 60 * 24 * 6,
    isRead: false
  }
]

const announcements = computed(() => {
  return remoteAnnouncements.value.length ? remoteAnnouncements.value : defaultAnnouncements
})

const filteredAnnouncements = computed(() => {
  return announcements.value
    .filter((item) => {
      if (filters.value.category !== 'semua' && item.category !== filters.value.category) return false
      if (filters.value.priority !== 'semua' && item.priority !== filters.value.priority) return false

      if (filters.value.q.trim()) {
        const q = normalizeText(filters.value.q)
        const text = normalizeText([
          item.title,
          item.summary,
          item.content,
          item.category,
          item.target,
          item.status
        ].join(' '))

        if (!text.includes(q)) return false
      }

      return true
    })
    .sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority) || nextDateOf(a) - nextDateOf(b))
})

const categoryOptions = computed(() => {
  return Array.from(new Set(announcements.value.map((item) => item.category).filter(Boolean)))
})

const categoryTabs = computed(() => {
  return [
    {
      key: 'semua',
      label: 'Semua',
      count: announcements.value.length
    },
    ...categoryOptions.value.map((category) => ({
      key: category,
      label: category,
      count: announcements.value.filter((item) => item.category === category).length
    }))
  ]
})

const importantCount = computed(() => {
  return announcements.value.filter((item) => item.priority === 'penting').length
})

const upcomingAnnouncements = computed(() => {
  const today = startOfDay(Date.now())

  return announcements.value
    .filter((item) => {
      const date = nextDateOf(item)
      return date >= today
    })
    .sort((a, b) => nextDateOf(a) - nextDateOf(b))
})

const upcomingCount = computed(() => upcomingAnnouncements.value.length)

const nearestAnnouncement = computed(() => {
  return upcomingAnnouncements.value[0] || [...announcements.value].sort((a, b) => b.publishedAt - a.publishedAt)[0] || null
})

const nearestAnnouncementTitle = computed(() => {
  return nearestAnnouncement.value?.title || 'Belum ada agenda'
})

const lastUpdateLabel = computed(() => {
  const latest = [...announcements.value].sort((a, b) => b.publishedAt - a.publishedAt)[0]
  return latest ? formatDate(latest.publishedAt) : '—'
})

const priorityItems = computed(() => {
  return [...announcements.value]
    .sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority) || nextDateOf(a) - nextDateOf(b))
    .slice(0, 2)
})

const aiInsight = computed(() => {
  const nearest = nearestAnnouncement.value

  if (!nearest) {
    return {
      title: 'Belum ada pengumuman aktif',
      desc: 'Saat ini belum ada pengumuman yang perlu ditindaklanjuti. Sistem akan menampilkan pengingat otomatis ketika ada agenda baru.',
      daysLabel: '—',
      category: '—'
    }
  }

  const date = nextDateOf(nearest)
  const days = daysUntil(date)
  const dayText = days === 0 ? 'hari ini' : days === 1 ? 'besok' : `${days} hari lagi`

  return {
    title: `Pengumuman terdekat: ${nearest.title}`,
    desc: `Agenda terdekat berada pada ${formatDate(date)} atau ${dayText}. Mohon baca detail pengumuman dan siapkan kebutuhan yang relevan sebelum jadwal tersebut.`,
    daysLabel: days === 0 ? 'Hari ini' : days === 1 ? 'Besok' : `${days} hari`,
    category: nearest.category
  }
})

const preparationItems = computed<PreparationItem[]>(() => {
  const nearest = nearestAnnouncement.value

  if (!nearest) {
    return [
      {
        title: 'Pantau informasi terbaru',
        desc: 'Cek halaman pengumuman secara berkala agar tidak melewatkan agenda penting.',
        icon: 'ph:megaphone-duotone',
        cardClass: 'border-slate-100 bg-slate-50 dark:border-neutral-800 dark:bg-neutral-800/60',
        iconClass: 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
      }
    ]
  }

  const text = normalizeText([
    nearest.title,
    nearest.summary,
    nearest.content,
    nearest.category
  ].join(' '))

  const items: PreparationItem[] = [
    {
      title: 'Baca detail pengumuman',
      desc: 'Pastikan wali memahami tanggal, target, dan instruksi utama dari pengumuman.',
      icon: 'ph:book-open-text-duotone',
      cardClass: 'border-green-100 bg-green-50/70 dark:border-green-900/30 dark:bg-green-900/10',
      iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    }
  ]

  if (text.includes('spp') || text.includes('pembayaran') || text.includes('administrasi') || text.includes('tagihan')) {
    items.push({
      title: 'Siapkan bukti pembayaran',
      desc: 'Cek nominal tagihan, invoice, rekening/VA/QRIS, lalu simpan bukti transfer dengan jelas.',
      icon: 'akar-icons:money',
      cardClass: 'border-amber-100 bg-amber-50/70 dark:border-amber-900/30 dark:bg-amber-900/10',
      iconClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
    })
  }

  if (text.includes('akademik') || text.includes('nilai') || text.includes('rapor') || text.includes('absensi') || text.includes('hafalan')) {
    items.push({
      title: 'Cek perkembangan santri',
      desc: 'Buka menu akademik, absensi, dan hafalan untuk melihat kondisi terbaru sebelum menindaklanjuti.',
      icon: 'solar:chart-linear',
      cardClass: 'border-green-100 bg-green-50/70 dark:border-green-900/30 dark:bg-green-900/10',
      iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })
  }

  if (text.includes('rapat') || text.includes('pertemuan') || text.includes('wali') || text.includes('sosialisasi')) {
    items.push({
      title: 'Siapkan waktu hadir',
      desc: 'Catat jadwal pertemuan dan siapkan pertanyaan atau catatan terkait perkembangan santri.',
      icon: 'ph:users-three-duotone',
      cardClass: 'border-purple-100 bg-purple-50/70 dark:border-purple-900/30 dark:bg-purple-900/10',
      iconClass: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
    })
  }

  if (text.includes('libur') || text.includes('pulang') || text.includes('izin') || text.includes('kunjungan')) {
    items.push({
      title: 'Siapkan jadwal dan identitas',
      desc: 'Pastikan jadwal penjemputan/kunjungan jelas, nomor HP aktif, dan identitas wali/pengunjung siap.',
      icon: 'ph:identification-card-duotone',
      cardClass: 'border-cyan-100 bg-cyan-50/70 dark:border-cyan-900/30 dark:bg-cyan-900/10',
      iconClass: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300'
    })
  }

  if (text.includes('kegiatan') || text.includes('acara') || text.includes('lomba') || text.includes('ujian')) {
    items.push({
      title: 'Siapkan perlengkapan santri',
      desc: 'Cek kebutuhan acara, seragam, alat tulis, dokumen, atau barang pendukung sesuai pengumuman.',
      icon: 'ph:backpack-duotone',
      cardClass: 'border-lime-100 bg-lime-50/70 dark:border-lime-900/30 dark:bg-lime-900/10',
      iconClass: 'bg-lime-100 text-lime-700 dark:bg-lime-900/20 dark:text-lime-300'
    })
  }

  if (items.length === 1) {
    items.push({
      title: 'Hubungi admin bila belum jelas',
      desc: 'Jika ada informasi yang kurang dipahami, segera konfirmasi ke admin atau pengurus.',
      icon: 'ph:chat-circle-text-duotone',
      cardClass: 'border-slate-100 bg-slate-50 dark:border-neutral-800 dark:bg-neutral-800/60',
      iconClass: 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
    })
  }

  return items.slice(0, 4)
})

function normalizeAnnouncement(raw: any, id: string): Announcement {
  const category = String(raw?.category || raw?.kategori || 'Informasi')

  return {
    id,
    title: String(raw?.title || raw?.judul || 'Pengumuman'),
    summary: String(raw?.summary || raw?.ringkasan || raw?.excerpt || raw?.description || 'Baca informasi selengkapnya.'),
    content: String(raw?.content || raw?.isi || raw?.body || raw?.description || raw?.summary || 'Belum ada detail pengumuman.'),
    category,
    priority: normalizePriority(raw?.priority || raw?.prioritas),
    target: String(raw?.target || raw?.audience || 'Wali Santri'),
    status: String(raw?.status || 'Aktif'),
    icon: String(raw?.icon || iconByCategory(category)),
    publishedAt: parseDate(raw?.publishedAt || raw?.createdAt || raw?.tanggal || raw?.date) || Date.now(),
    eventDate: parseDate(raw?.eventDate || raw?.tanggalAgenda || raw?.agendaDate || raw?.deadline || raw?.dueDate),
    deadlineDate: parseDate(raw?.deadlineDate || raw?.deadline || raw?.dueDate || raw?.batasAkhir),
    isRead: Boolean(raw?.isRead)
  }
}

function normalizePriority(value: unknown): AnnouncementPriority {
  const text = normalizeText(value)

  if (text.includes('penting') || text.includes('urgent')) return 'penting'
  if (text.includes('normal')) return 'normal'

  return 'informasi'
}

function iconByCategory(category: unknown) {
  const text = normalizeText(category)

  if (text.includes('admin') || text.includes('spp') || text.includes('bayar')) return 'akar-icons:money'
  if (text.includes('akademik') || text.includes('nilai')) return 'solar:chart-linear'
  if (text.includes('agenda') || text.includes('jadwal')) return 'solar:calendar-line-duotone'
  if (text.includes('izin')) return 'solar:letter-linear'
  if (text.includes('kunjungan')) return 'material-symbols:parent-child-dining-outline-rounded'

  return 'ph:megaphone-duotone'
}

function priorityWeight(priority: AnnouncementPriority) {
  if (priority === 'penting') return 3
  if (priority === 'normal') return 2
  return 1
}

function nextDateOf(item: Announcement) {
  return item.eventDate || item.deadlineDate || item.publishedAt || Date.now()
}

function startOfDay(value: number) {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

function daysUntil(value: number) {
  const today = startOfDay(Date.now())
  const target = startOfDay(value)
  return Math.max(0, Math.ceil((target - today) / (1000 * 60 * 60 * 24)))
}

function resetFilters() {
  filters.value = {
    q: '',
    category: 'semua',
    priority: 'semua'
  }
}

function openDetail(item: Announcement) {
  selectedAnnouncement.value = item
  detailOpen.value = true
}

function closeDetail() {
  detailOpen.value = false
  selectedAnnouncement.value = null
}

async function copyAnnouncement(item: Announcement) {
  const text = [
    item.title,
    '',
    item.summary,
    '',
    item.content,
    '',
    `Kategori: ${item.category}`,
    `Prioritas: ${item.priority}`,
    `Tanggal: ${formatDate(item.eventDate || item.publishedAt)}`
  ].join('\n')

  try {
    await navigator.clipboard.writeText(text)
    showToast('Pengumuman berhasil disalin.')
  } catch {
    showToast('Gagal menyalin pengumuman.')
  }
}

function showToast(message: string) {
  toastMessage.value = message

  if (toastTimer) clearTimeout(toastTimer)

  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 2200)
}

function priorityBadgeClass(priority: AnnouncementPriority) {
  if (priority === 'penting') return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
  if (priority === 'normal') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'

  return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
}

function announcementIconClass(category: string) {
  const text = normalizeText(category)

  if (text.includes('admin') || text.includes('spp') || text.includes('bayar')) {
    return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  }

  if (text.includes('akademik') || text.includes('nilai')) {
    return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  }

  if (text.includes('agenda') || text.includes('jadwal')) {
    return 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
  }

  if (text.includes('kunjungan')) {
    return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300'
  }

  return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
}

function priorityIconClass(item: Announcement) {
  if (item.priority === 'penting') return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
  if (item.priority === 'normal') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'

  return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
}

function normalizeText(value: unknown) {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function parseDate(value: any) {
  if (!value) return 0

  if (typeof value === 'number') {
    return value < 10_000_000_000 ? value * 1000 : value
  }

  if (typeof value === 'string') {
    const parsed = new Date(value).getTime()
    return Number.isNaN(parsed) ? 0 : parsed
  }

  if (typeof value === 'object') {
    if (value._seconds) return Number(value._seconds) * 1000
    if (typeof value.toMillis === 'function') return value.toMillis()
  }

  return 0
}

function formatDate(value?: number) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium'
  }).format(new Date(value))
}

onMounted(() => {
  if (!$realtimeDb) {
    loading.value = false
    return
  }

  const paths = [
    `${clientName}/announcement`,
    `${clientName}/announcements`,
    `${clientName}/pengumuman`
  ]

  const bucket = new Map<string, Announcement[]>()

  for (const path of paths) {
    const unsub = onValue(dbRef($realtimeDb, path), (snap) => {
      const value = snap.val()
      const rows: Announcement[] = []

      if (value && typeof value === 'object') {
        for (const [id, raw] of Object.entries(value as Record<string, any>)) {
          rows.push(normalizeAnnouncement(raw, String(id)))
        }
      }

      bucket.set(path, rows)
      remoteAnnouncements.value = Array.from(bucket.values()).flat()
      loading.value = false
    })

    unsubscribers.push(unsub)
  }

  setTimeout(() => {
    loading.value = false
  }, 1200)
})

onBeforeUnmount(() => {
  for (const unsubscribe of unsubscribers) {
    try {
      unsubscribe()
    } catch {}
  }

  unsubscribers = []

  if (toastTimer) {
    clearTimeout(toastTimer)
  }
})
</script>