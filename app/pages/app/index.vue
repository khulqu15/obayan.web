<template>
  <div class="space-y-6 p-4 md:p-6">
    <div v-if="dashboardLoading" class="grid gap-4 lg:grid-cols-[1.4fr,0.6fr]">
      <div class="h-56 animate-pulse rounded-[30px] border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"></div>
      <div class="h-56 animate-pulse rounded-[30px] border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"></div>
    </div>

    <template v-else>
      <section class="relative overflow-hidden rounded-[32px] border border-green-100 bg-gradient-to-br from-green-600 via-emerald-600 to-lime-500 p-6 text-white shadow-[0_24px_60px_-18px_rgba(22,163,74,0.38)] md:p-7 dark:border-white/10">
        <div class="absolute inset-0 opacity-25">
          <div class="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white blur-3xl"></div>
          <div class="absolute bottom-0 left-10 h-36 w-36 rounded-full bg-lime-200 blur-3xl"></div>
        </div>

        <div class="relative z-10 grid gap-5 xl:grid-cols-[1.35fr,0.65fr]">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20 backdrop-blur">
              <span class="inline-block h-2 w-2 rounded-full bg-lime-300"></span>
              Dashboard
            </div>
            <h1 class="mt-4 text-2xl font-extrabold tracking-tight md:text-4xl">
              {{ greetingTitle }}
            </h1>
          </div>

          <div class="grid gap-3 lg:grid-cols-2 grid-cols-1">
            <div class="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
              <div class="text-xs uppercase tracking-[0.16em] text-green-100">Akses Aktif</div>
              <div class="mt-2 text-3xl font-black">{{ allowedRoutes.length }}</div>
              <p class="mt-1 text-sm text-green-50/90">route yang diizinkan untuk akun ini</p>
            </div>
            <div class="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
              <div class="text-xs uppercase tracking-[0.16em] text-green-100">Widget Aktif</div>
              <div class="mt-2 text-3xl font-black">{{ visibleModuleCount }}</div>
              <p class="mt-1 text-sm text-green-50/90">blok insight yang tampil sesuai akses</p>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="card in metricCards"
          :key="card.key"
          class="group overflow-hidden rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">{{ card.label }}</p>
              <p class="mt-2 text-2xl font-black tracking-tight text-gray-900 dark:text-white">{{ card.value }}</p>
            </div>
            <div :class="card.iconWrapClass" class="inline-flex h-12 w-12 items-center justify-center rounded-[18px] ring-1 ring-black/5 dark:ring-white/10">
              <Icon :icon="card.icon" class="h-5 w-5" />
            </div>
          </div>

          <div class="mt-4 flex items-end justify-between gap-3">
            <p class="text-sm leading-5 text-gray-500 dark:text-neutral-400">{{ card.sub }}</p>
            <span
              v-if="card.trend !== null && card.trend !== undefined"
              :class="[
                'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold',
                card.trend > 0
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                  : card.trend < 0
                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-300'
              ]"
            >
              {{ card.trend > 0 ? '+' : '' }}{{ card.trend }}
            </span>
          </div>
        </article>
      </section>

      <section class="grid gap-4 xl:grid-cols-[1.35fr,0.65fr]">
        <div class="space-y-4">
          <div
            v-if="can('/app/absen')"
            class="overflow-hidden rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Tren Kehadiran 30 Hari</h3>
                <p class="text-sm text-gray-500 dark:text-neutral-400">Pantau pola kehadiran untuk respons cepat bila kualitas disiplin menurun.</p>
              </div>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                @click="reloadAbsensiHistory"
              >
                Reload
              </button>
            </div>
            <AreaLineChart :data="attendanceChart" :options="chartOpts" />
          </div>

          <div
            v-if="canFinance"
            class="overflow-hidden rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="mb-4">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Arus Penerimaan 30 Hari</h3>
              <p class="text-sm text-gray-500 dark:text-neutral-400">Lihat ritme penerimaan harian dan titik lonjakan agar keputusan keuangan lebih presisi.</p>
            </div>
            <BarChart :data="receiptsChart" :options="chartOpts" />
          </div>

          <div
            v-if="can('/app/faults')"
            class="overflow-hidden rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="mb-4">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Pelanggaran per Kategori</h3>
              <p class="text-sm text-gray-500 dark:text-neutral-400">Membantu melihat pola kasus yang paling dominan dalam 30 hari terakhir.</p>
            </div>
            <BarChart :data="faultChart" :options="chartOpts" />
          </div>
        </div>

        <div class="space-y-4">
          <div class="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Insight Prioritas</h3>
                <p class="text-sm text-gray-500 dark:text-neutral-400">Sorotan cepat berdasarkan data modul yang bisa Anda akses.</p>
              </div>
            </div>

            <div class="space-y-3">
              <article
                v-for="insight in smartInsights"
                :key="insight.title"
                class="rounded-[22px] border p-3.5"
                :class="insight.wrapClass"
              >
                <div class="flex items-start gap-3">
                  <div :class="insight.iconClass" class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl">
                    <Icon :icon="insight.icon" class="h-5 w-5" />
                  </div>
                  <div class="min-w-0">
                    <h4 class="text-sm font-bold text-gray-900 dark:text-white">{{ insight.title }}</h4>
                    <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-neutral-300">{{ insight.text }}</p>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <div
            v-if="can('/app/agenda')"
            class="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Agenda 7 Hari</h3>
                <p class="text-sm text-gray-500 dark:text-neutral-400">Jadwal yang paling dekat dengan operasional harian.</p>
              </div>
              <button type="button" class="text-xs font-semibold text-green-600 hover:underline" @click="go('/app/agenda')">
                Lihat semua
              </button>
            </div>

            <div v-if="agendaTerdekat.length" class="space-y-3">
              <button
                v-for="a in agendaTerdekat"
                :key="a.id"
                type="button"
                class="flex w-full items-start gap-3 rounded-[22px] border border-gray-200 bg-gray-50 p-3 text-left transition hover:bg-white dark:border-neutral-800 dark:bg-neutral-800/60 dark:hover:bg-neutral-800"
                @click="openAgendaDetail(a.id)"
              >
                <span class="mt-1 inline-block h-2.5 w-2.5 rounded-full" :style="{ background: a.color }"></span>
                <div class="min-w-0 flex-1">
                  <div class="truncate text-sm font-semibold text-gray-900 dark:text-white">{{ a.title }}</div>
                  <div class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                    {{ a.when }}<span v-if="a.time"> · {{ a.time }}</span><span v-if="a.where"> · {{ a.where }}</span>
                  </div>
                </div>
              </button>
            </div>
            <p v-else class="text-sm text-gray-500 dark:text-neutral-400">Tidak ada agenda dalam 7 hari ke depan.</p>
          </div>

          <div
            v-if="can('/app/santri')"
            class="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="mb-4">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Komposisi Jenjang</h3>
              <p class="text-sm text-gray-500 dark:text-neutral-400">Distribusi populasi santri untuk melihat beban pembinaan per level.</p>
            </div>
            <DonutChart :data="jenjangChart" :options="{ cutout: '64%' }" />
          </div>

          <div
            class="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="mb-4">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Hak Akses Saat Ini</h3>
              <p class="text-sm text-gray-500 dark:text-neutral-400">Daftar route yang benar-benar aktif untuk akun ini.</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="routeItem in allowedRoutes"
                :key="routeItem"
                class="rounded-full bg-green-50 px-3 py-1.5 text-[11px] font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-300"
              >
                {{ routeItem }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-4 xl:grid-cols-3">
        <div
          v-if="can('/app/izin')"
          class="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 xl:col-span-2"
        >
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Perizinan Terbaru</h3>
              <p class="text-sm text-gray-500 dark:text-neutral-400">Agar proses approval dan monitoring keluar-masuk lebih cepat.</p>
            </div>
            <button type="button" class="text-xs font-semibold text-green-600 hover:underline" @click="go('/app/izin')">Buka modul</button>
          </div>

          <div class="space-y-3">
            <article
              v-for="row in izinRows.slice(0, 6)"
              :key="row.id"
              class="flex flex-col gap-3 rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60 lg:flex-row lg:items-center lg:justify-between"
            >
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <h4 class="truncate text-sm font-bold text-gray-900 dark:text-white">{{ row.name }}</h4>
                  <span :class="badgeClass(row.status)">{{ row.statusLabel }}</span>
                  <span :class="urgencyClass(row.urgency)">{{ row.urgency }}</span>
                </div>
                <p class="mt-1 text-sm text-gray-600 dark:text-neutral-300">{{ row.reason }}</p>
                <div class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-neutral-400">
                  <span>{{ row.maskan || '—' }}<span v-if="row.kamar"> · Kamar {{ row.kamar }}</span></span>
                  <span>{{ row.planned }}</span>
                  <span>{{ row.requestedAtLabel }}</span>
                </div>
              </div>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                @click="go('/app/izin?focus=' + row.id)"
              >
                Lihat
              </button>
            </article>
          </div>
        </div>

        <div
          v-if="can('/app/faults')"
          class="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Pelanggaran Terbaru</h3>
              <p class="text-sm text-gray-500 dark:text-neutral-400">Kasus yang perlu dipantau dan ditindaklanjuti.</p>
            </div>
          </div>

          <div class="space-y-3">
            <article
              v-for="row in faultRows.slice(0, 6)"
              :key="row.id"
              class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="truncate text-sm font-bold text-gray-900 dark:text-white">{{ row.santri }}</div>
                  <div class="mt-1 text-sm text-gray-600 dark:text-neutral-300">{{ row.kategori }}</div>
                </div>
                <span :class="badgeClass(row.status)">{{ row.status }}</span>
              </div>
              <div class="mt-2 flex items-center justify-between gap-3 text-xs text-gray-500 dark:text-neutral-400">
                <span>{{ row.poin }} poin</span>
                <span>{{ row.waktu }}</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="grid gap-4 xl:grid-cols-[1fr,1fr,0.9fr]">
        <div
          v-if="can('/app/announcement')"
          class="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Pengumuman Aktif</h3>
              <p class="text-sm text-gray-500 dark:text-neutral-400">Broadcast yang sedang atau siap ditayangkan.</p>
            </div>
            <button type="button" class="text-xs font-semibold text-green-600 hover:underline" @click="go('/app/announcement')">Kelola</button>
          </div>

          <div class="space-y-3">
            <article
              v-for="row in announcementRows.slice(0, 5)"
              :key="row.id"
              class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="truncate text-sm font-bold text-gray-900 dark:text-white">{{ row.title || 'Pengumuman' }}</div>
                  <div class="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-neutral-300">{{ row.message || '—' }}</div>
                </div>
                <span :class="row.active ? 'rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300' : 'rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600 dark:bg-neutral-800 dark:text-neutral-300'">
                  {{ row.active ? 'Aktif' : 'Draft' }}
                </span>
              </div>
            </article>
          </div>
        </div>

        <div class="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="mb-4">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Kesehatan Operasional</h3>
            <p class="text-sm text-gray-500 dark:text-neutral-400">Skor singkat untuk membaca kondisi umum hari ini.</p>
          </div>

          <div class="space-y-3">
            <div v-if="can('/app/absen')" class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm font-semibold text-gray-700 dark:text-neutral-200">Kehadiran</span>
                <span class="text-sm font-black text-gray-900 dark:text-white">{{ presentTodayPct !== null ? presentTodayPct.toFixed(0) + '%' : '—' }}</span>
              </div>
              <div class="mt-3 h-2 rounded-full bg-gray-200 dark:bg-neutral-700">
                <div class="h-2 rounded-full bg-green-600" :style="{ width: (presentTodayPct ?? 0) + '%' }"></div>
              </div>
            </div>

            <div v-if="can('/app/faults')" class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm font-semibold text-gray-700 dark:text-neutral-200">Disiplin</span>
                <span class="text-sm font-black text-gray-900 dark:text-white">{{ faultUnresolved }}</span>
              </div>
              <p class="mt-2 text-xs text-gray-500 dark:text-neutral-400">Jumlah kasus yang masih aktif / belum selesai.</p>
            </div>

            <div v-if="can('/app/agenda')" class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm font-semibold text-gray-700 dark:text-neutral-200">Agenda</span>
                <span class="text-sm font-black text-gray-900 dark:text-white">{{ agendaTerdekat.length }}</span>
              </div>
              <p class="mt-2 text-xs text-gray-500 dark:text-neutral-400">Jumlah agenda dalam tujuh hari ke depan.</p>
            </div>
          </div>
        </div>

        <div class="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="mb-4">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Rekomendasi Aksi</h3>
            <p class="text-sm text-gray-500 dark:text-neutral-400">Daftar singkat hal yang layak diprioritaskan.</p>
          </div>

          <div class="space-y-3">
            <div
              v-for="todo in dashboardTodos"
              :key="todo.title"
              class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
            >
              <div class="flex items-start gap-3">
                <div class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <Icon :icon="todo.icon" class="h-5 w-5" />
                </div>
                <div>
                  <div class="text-sm font-bold text-gray-900 dark:text-white">{{ todo.title }}</div>
                  <div class="mt-1 text-sm text-gray-600 dark:text-neutral-300">{{ todo.text }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>

    <teleport to="body">
      <div v-if="agendaDetailId && selectedAgenda" class="fixed inset-0 z-[100]">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeAgendaDetail"></div>

        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-lg rounded-[28px] border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
            <div class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-neutral-700">
              <h3 class="truncate text-base font-bold text-gray-900 dark:text-white">{{ selectedAgenda.title || 'Agenda' }}</h3>
              <button class="rounded-2xl p-2 transition hover:bg-gray-100 dark:hover:bg-neutral-800" @click="closeAgendaDetail">
                <Icon icon="lucide:x" class="h-4 w-4" />
              </button>
            </div>

            <div class="max-h-[75vh] space-y-3 overflow-y-auto p-4">
              <div v-if="selectedAgenda.thumbUrl" class="overflow-hidden rounded-[22px] border border-gray-200 dark:border-neutral-700">
                <img :src="selectedAgenda.thumbUrl" alt="thumb" class="h-52 w-full object-cover" />
              </div>

              <div class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="flex items-start gap-3">
                  <Icon icon="lucide:calendar" class="mt-0.5 h-4 w-4 text-gray-500 dark:text-neutral-400" />
                  <div>
                    <div class="font-semibold text-gray-900 dark:text-white">{{ fmtDateTimeRange(selectedAgenda.startAt, selectedAgenda.endAt, selectedAgenda.allDay) }}</div>
                    <div v-if="selectedAgenda.location" class="mt-1 text-gray-500 dark:text-neutral-400">{{ selectedAgenda.location }}</div>
                  </div>
                </div>
              </div>

              <div v-if="selectedAgenda.desc" class="whitespace-pre-wrap rounded-[22px] border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-200">
                {{ selectedAgenda.desc }}
              </div>
            </div>

            <div class="flex items-center justify-between border-t border-gray-200 p-4 dark:border-neutral-700">
              <div class="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-neutral-400">
                <span class="inline-block h-3 w-3 rounded-full" :style="{ background: selectedAgenda.color || '#16a34a' }"></span>
                Label warna
              </div>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="go('/app/agenda')"
                >
                  Buka Agenda
                </button>
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                  @click="closeAgendaDetail"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import AreaLineChart from '~/components/widget/AreaLineChart.vue'
import DonutChart from '~/components/widget/DonutChart.vue'
import BarChart from '~/components/widget/BarChart.vue'
import { useFinance } from '~/composables/data/useFinance'
import { usePengurus } from '~/composables/data/usePengurus'
import { useAbsensi } from '~/composables/data/useAbsensi'
import { useSantri } from '~/composables/data/useSantri'
import { useIzin } from '~/composables/data/useIzin'
import { useFaults } from '~/composables/data/useFaults'
import { useAnnouncements } from '~/composables/data/useAnnouncements'
import { useAgenda } from '~/composables/data/useAgenda'
import { get, off, onValue, ref as dbRef } from 'firebase/database'
import { useNuxtApp, useRuntimeConfig } from 'nuxt/app'

const config = useRuntimeConfig()
const clientName = config.public.clientName || 'alinayah'

definePageMeta({ layout: 'app', layoutProps: { title: 'Dashboard' } })

type PlainSession = {
  sub?: string
  uid?: string
  role?: string
  name?: string
  email?: string
  allowedRoutes?: string[]
  iat?: number
  exp?: number
}

const router = useRouter()
const { $realtimeDb } = useNuxtApp() as any
const dashboardLoading = ref(true)
const dashboardSession = ref<PlainSession | null>(null)
const firebaseProfile = ref<any>(null)
const allowedRoutesState = ref<string[]>([])
let profileRef: ReturnType<typeof dbRef> | null = null

const AUTH_KEY = `${clientName}:auth`
const PASSPHRASE = `${clientName}-admin-secret`
const SALT = `${clientName}-static-salt`
const ITER = 120_000

function normalize(path: string) {
  try {
    const u = new URL(path, 'http://x')
    return u.pathname.replace(/\/+$/, '') || '/'
  } catch {
    return (path || '').replace(/\/+$/, '') || '/'
  }
}

function isDashboardRoot(path: string) {
  const p = normalize(path)
  return p === '/app' || p === '/wali'
}

function isAllowed(path: string, allowed: string[]) {
  const a = normalize(path)
  const list = (allowed || []).map(normalize)
  return list.some((r) => {
    if (isDashboardRoot(r)) return a === r
    return a === r || (r !== '/' && a.startsWith(r + '/'))
  })
}

function coerceRoutes(v: any): string[] {
  if (Array.isArray(v)) return v.map(String)
  if (v && typeof v === 'object') return Object.values(v).filter((x) => typeof x === 'string').map(String)
  return []
}

function uniqRoutes(arr: string[]) {
  return Array.from(new Set(arr.map(normalize)))
}

async function deriveKey(pass: string, salt: string) {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(pass), { name: 'PBKDF2' }, false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: ITER, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  )
}

function fromB64(b64: string) {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)).buffer
}

function isLikelyEncryptedToken(raw: string) {
  try {
    const o = JSON.parse(raw)
    return !!(o && typeof o === 'object' && o.iv && o.ct)
  } catch {
    return false
  }
}

async function decryptJSON(serialized: string) {
  const obj = JSON.parse(serialized)
  const key = await deriveKey(PASSPHRASE, SALT)
  const iv = new Uint8Array(fromB64(obj.iv))
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, fromB64(obj.ct))
  return JSON.parse(new TextDecoder().decode(plain))
}

async function readAuthToken(): Promise<PlainSession | null> {
  const raw = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY)
  if (!raw) return null
  try {
    if (isLikelyEncryptedToken(raw)) return (await decryptJSON(raw)) as PlainSession
    return JSON.parse(raw) as PlainSession
  } catch {
    return null
  }
}

const role = computed(() => firebaseProfile.value?.role || dashboardSession.value?.role || 'admin')
const roleLabel = computed(() => {
  if (role.value === 'wali') return 'Wali Santri'
  if (role.value === 'pengurus') return 'Pengurus'
  if (role.value === 'admin') return 'Admin'
  return role.value || 'User'
})

const allowedRoutes = computed(() => {
  const fromFirebase = uniqRoutes(coerceRoutes(firebaseProfile.value?.allowedRoutes))
  if (fromFirebase.length) return fromFirebase

  const fromToken = uniqRoutes(Array.isArray(dashboardSession.value?.allowedRoutes) ? dashboardSession.value!.allowedRoutes!.map(String) : [])
  if (fromToken.length) return fromToken

  const raw = uniqRoutes(allowedRoutesState.value)
  if (raw.length) return raw

  return role.value === 'wali' ? ['/wali'] : ['/app']
})

function can(path: string) {
  return isAllowed(path, allowedRoutes.value)
}

const greetingTitle = computed(() => {
  const hour = new Date().getHours()
  const base = hour < 11 ? 'Selamat pagi' : hour < 15 ? 'Selamat siang' : hour < 18 ? 'Selamat sore' : 'Selamat malam'
  const name = firebaseProfile.value?.displayName || firebaseProfile.value?.name || dashboardSession.value?.name || 'Pengguna'
  return `${base}, ${name}`
})

const quickLinks = computed(() => {
  const items = [
    { label: 'Dashboard', href: '/app', icon: 'lucide:layout-dashboard' },
    { label: 'Berita', href: '/app/news', icon: 'hugeicons:news' },
    { label: 'Agenda', href: '/app/agenda', icon: 'solar:calendar-line-duotone' },
    { label: 'Santri', href: '/app/santri', icon: 'lucide:users' },
    { label: 'Absensi', href: '/app/absen', icon: 'hugeicons:note-03' },
    { label: 'Perizinan', href: '/app/izin', icon: 'solar:letter-linear' },
    { label: 'Pelanggaran', href: '/app/faults', icon: 'mingcute:fault-line' },
    { label: 'Keuangan', href: '/app/payment', icon: 'akar-icons:money' },
    { label: 'Hak Akses', href: '/app/user', icon: 'solar:key-broken' }
  ]
  return items.filter((item) => can(item.href)).slice(0, 6)
})

const visibleModuleCount = computed(() => {
  const modules = [
    can('/app'),
    can('/app/santri'),
    can('/app/absen'),
    can('/app/izin'),
    can('/app/faults'),
    can('/app/agenda'),
    can('/app/announcement'),
    can('/app/payment') || can('/app/report-money')
  ]
  return modules.filter(Boolean).length
})

const absensi = useAbsensi()
const santri = useSantri()
const izin = useIzin()
const faults = useFaults()
const ann = useAnnouncements()
const finance = useFinance()
const pengurus = usePengurus?.()
const agendaApi = useAgenda()

const canFinance = computed(() => can('/app/payment') || can('/app/report-money'))

const fmtNumber = (n?: number | null) => (n ?? 0).toLocaleString('id-ID')
const fmtMoney = (n?: number | null) => Number(n ?? 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
const pct = (a: number, b: number) => (b > 0 ? (a / b) * 100 : null)

const badgeClass = (status?: string) => {
  const s = String(status || '').toLowerCase()
  if (['approved', 'disetujui', 'selesai', 'lunas'].some((k) => s.includes(k))) {
    return 'rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
  }
  if (['pending', 'menunggu', 'sebagian'].some((k) => s.includes(k))) {
    return 'rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  }
  return 'rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
}

const urgencyClass = (u?: string) => {
  const x = String(u || 'Normal').toLowerCase()
  if (x === 'darurat') return 'rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
  if (x === 'tinggi') return 'rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-700 dark:bg-orange-900/20 dark:text-orange-300'
  if (x === 'rendah') return 'rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600 dark:bg-neutral-800 dark:text-neutral-300'
  return 'rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-300'
}

const toDate = (v: any) => {
  if (v instanceof Date) return v
  const t = Number(v)
  if (!Number.isNaN(t) && t > 0) return new Date(t)
  const d = new Date(String(v || ''))
  return Number.isNaN(d.getTime()) ? new Date() : d
}

const sameMonth = (d: Date, ref: Date) => d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth()
const sameYear = (d: Date, ref: Date) => d.getFullYear() === ref.getFullYear()
const amount = (t: any) => Number(t?.amount ?? t?.nominal ?? t?.nilai ?? 0)
const isIncome = (t: any) => {
  const s = String(t?.type ?? t?.jenis ?? t?.direction ?? '').toLowerCase()
  return /income|masuk|penerimaan/.test(s) || (!!t?.isIncome && t.isIncome === true)
}
const isExpense = (t: any) => {
  const s = String(t?.type ?? t?.jenis ?? t?.direction ?? '').toLowerCase()
  return /expense|keluar|pengeluaran/.test(s) || (!!t?.isExpense && t.isExpense === true)
}

const now = new Date()

const totalSantri = computed(() => Number(santri.rows?.value?.length || 0))
const presentTodayPct = computed(() => {
  const curr = absensi.current?.value
  const present = Number(curr?.present || curr?.hadir || 0)
  const total = Number(curr?.total || curr?.jumlah || 0)
  return pct(present, total)
})

const trendAbsensi = computed(() => {
  const hist = absensi.history?.value || []
  if (hist.length < 2) return 0
  const last = hist[hist.length - 1]
  const prev = hist[hist.length - 2]
  const p1 = pct(Number(last?.present || 0), Number(last?.total || 0)) ?? 0
  const p0 = pct(Number(prev?.present || 0), Number(prev?.total || 0)) ?? 0
  return Number((p1 - p0).toFixed(1))
})

const uangMasukBulan = computed(() => {
  const s = finance.summary?.value
  if (s?.incomeMonth != null) return Number(s.incomeMonth)
  const tx = finance.transactions?.value || []
  return tx.filter((t: any) => isIncome(t) && sameMonth(toDate(t?.date ?? t?.tanggal ?? t?.ts), now)).reduce((a: number, t: any) => a + amount(t), 0)
})

const saldoKas = computed(() => {
  const s = finance.summary?.value
  if (s?.balance != null) return Number(s.balance)
  const tx = finance.transactions?.value || []
  const inc = tx.filter(isIncome).reduce((a: number, t: any) => a + amount(t), 0)
  const exp = tx.filter(isExpense).reduce((a: number, t: any) => a + amount(t), 0)
  return inc - exp
})

const totalTunggakan = computed(() => {
  const s = finance.summary?.value
  if (s?.arrears != null) return Number(s.arrears)
  return 0
})

const trendIncomeMonth = computed(() => {
  const s = finance.summary?.value
  const cur = Number(s?.incomeMonth ?? uangMasukBulan.value)
  const prev = Number(s?.incomePrevMonth ?? 0)
  if (prev <= 0) return 0
  return Number((((cur - prev) / prev) * 100).toFixed(1))
})

const izinPending = computed(() => {
  const rows = izin.rows?.value || []
  return rows.filter((r: any) => String(r?.status || '').toLowerCase().includes('pending')).length
})

const faultUnresolved = computed(() => Number(faults.unresolvedCount?.value || (faults.rows?.value || []).filter((x: any) => !x?.resolved).length || 0))

const metricCards = computed(() => {
  const cards = [
    {
      key: 'access',
      label: 'Route Aktif',
      value: String(allowedRoutes.value.length),
      sub: 'Jumlah route yang benar-benar diizinkan',
      icon: 'lucide:key-round',
      iconWrapClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300',
      trend: null,
    },
    {
      key: 'widgets',
      label: 'Widget Dashboard',
      value: String(visibleModuleCount.value),
      sub: 'Jumlah blok informasi yang tampil',
      icon: 'lucide:blocks',
      iconWrapClass: 'bg-lime-100 text-lime-700 dark:bg-lime-900/20 dark:text-lime-300',
      trend: null,
    }
  ] as any[]

  if (can('/app/santri')) {
    cards.push({
      key: 'santri',
      label: 'Total Santri',
      value: fmtNumber(totalSantri.value),
      sub: 'Total santri terdaftar saat ini',
      icon: 'lucide:users',
      iconWrapClass: 'bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300',
      trend: null,
    })
  }

  if (can('/app/absen')) {
    cards.push({
      key: 'attendance',
      label: 'Kehadiran Hari Ini',
      value: presentTodayPct.value !== null ? `${presentTodayPct.value.toFixed(0)}%` : '—',
      sub: 'Persentase kehadiran santri hari ini',
      icon: 'lucide:clipboard-check',
      iconWrapClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300',
      trend: trendAbsensi.value,
    })
  }

  if (can('/app/izin')) {
    cards.push({
      key: 'izin',
      label: 'Izin Pending',
      value: fmtNumber(izinPending.value),
      sub: 'Pengajuan yang menunggu persetujuan',
      icon: 'lucide:clock-3',
      iconWrapClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
      trend: null,
    })
  }

  if (can('/app/faults')) {
    cards.push({
      key: 'faults',
      label: 'Pelanggaran Aktif',
      value: fmtNumber(faultUnresolved.value),
      sub: 'Kasus yang belum ditutup atau diselesaikan',
      icon: 'lucide:shield-alert',
      iconWrapClass: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300',
      trend: null,
    })
  }

  if (canFinance.value) {
    cards.push(
      {
        key: 'income-month',
        label: 'Uang Masuk Bulan Ini',
        value: fmtMoney(uangMasukBulan.value),
        sub: 'Penerimaan bulan berjalan',
        icon: 'lucide:wallet',
        iconWrapClass: 'bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300',
        trend: trendIncomeMonth.value,
      },
      {
        key: 'arrears',
        label: 'Syahriyah Menunggak',
        value: fmtMoney(totalTunggakan.value),
        sub: 'Akumulasi tunggakan aktif',
        icon: 'lucide:badge-alert',
        iconWrapClass: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
        trend: null,
      },
      {
        key: 'balance',
        label: 'Saldo Kas',
        value: fmtMoney(saldoKas.value),
        sub: 'Posisi kas bersih per hari ini',
        icon: 'lucide:piggy-bank',
        iconWrapClass: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300',
        trend: null,
      }
    )
  }

  return cards.slice(0, 8)
})

const smartInsights = computed(() => {
  const insights = [] as any[]

  if (can('/app/absen')) {
    const score = presentTodayPct.value ?? 0
    insights.push(
      score >= 90
        ? {
            title: 'Kehadiran stabil',
            text: `Kehadiran hari ini berada di ${score.toFixed(0)}%. Ritme belajar terlihat sehat dan bisa dipertahankan.`,
            icon: 'lucide:badge-check',
            wrapClass: 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/30 dark:bg-emerald-900/10',
            iconClass: 'bg-white text-emerald-700 dark:bg-neutral-900 dark:text-emerald-300'
          }
        : {
            title: 'Kehadiran perlu perhatian',
            text: `Kehadiran baru ${score.toFixed(0)}%. Cek absensi live, izin berjalan, dan faktor kegiatan hari ini.`,
            icon: 'lucide:triangle-alert',
            wrapClass: 'border-amber-200 bg-amber-50/60 dark:border-amber-900/30 dark:bg-amber-900/10',
            iconClass: 'bg-white text-amber-700 dark:bg-neutral-900 dark:text-amber-300'
          }
    )
  }

  if (can('/app/izin') && izinPending.value > 0) {
    insights.push({
      title: 'Approval izin menunggu',
      text: `Ada ${izinPending.value} perizinan yang belum diproses. Semakin cepat diputuskan, semakin rapi monitoring keluar-masuk santri.`,
      icon: 'lucide:clock-3',
      wrapClass: 'border-green-200 bg-green-50/60 dark:border-green-900/30 dark:bg-green-900/10',
      iconClass: 'bg-white text-green-700 dark:bg-neutral-900 dark:text-green-300'
    })
  }

  if (can('/app/faults') && faultUnresolved.value > 0) {
    insights.push({
      title: 'Disiplin butuh follow-up',
      text: `Masih ada ${faultUnresolved.value} kasus aktif. Fokuskan penanganan pada kategori yang paling dominan minggu ini.`,
      icon: 'lucide:siren',
      wrapClass: 'border-rose-200 bg-rose-50/60 dark:border-rose-900/30 dark:bg-rose-900/10',
      iconClass: 'bg-white text-rose-700 dark:bg-neutral-900 dark:text-rose-300'
    })
  }

  if (canFinance.value) {
    insights.push({
      title: 'Posisi keuangan bulan ini',
      text: `Penerimaan bulan berjalan ${fmtMoney(uangMasukBulan.value)} dengan saldo kas ${fmtMoney(saldoKas.value)}.`,
      icon: 'lucide:wallet-cards',
      wrapClass: 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/30 dark:bg-emerald-900/10',
      iconClass: 'bg-white text-emerald-700 dark:bg-neutral-900 dark:text-emerald-300'
    })
  }

  if (can('/app/agenda')) {
    insights.push({
      title: agendaTerdekat.value.length ? 'Agenda sudah terisi' : 'Agenda masih longgar',
      text: agendaTerdekat.value.length
        ? `Ada ${agendaTerdekat.value.length} agenda dalam 7 hari ke depan. Pastikan kesiapan tempat, PIC, dan publikasi.`
        : 'Belum ada agenda dekat waktu ini. Anda bisa menyiapkan agenda atau pengumuman berikutnya lebih awal.',
      icon: 'lucide:calendar-clock',
      wrapClass: 'border-lime-200 bg-lime-50/60 dark:border-lime-900/30 dark:bg-lime-900/10',
      iconClass: 'bg-white text-lime-700 dark:bg-neutral-900 dark:text-lime-300'
    })
  }

  if (!insights.length) {
    insights.push({
      title: 'Dashboard minimal aktif',
      text: 'Akun ini memiliki akses yang terbatas, jadi dashboard hanya menampilkan ringkasan yang relevan.',
      icon: 'lucide:layout-dashboard',
      wrapClass: 'border-gray-200 bg-gray-50/60 dark:border-neutral-800 dark:bg-neutral-800/40',
      iconClass: 'bg-white text-gray-700 dark:bg-neutral-900 dark:text-neutral-300'
    })
  }

  return insights.slice(0, 4)
})

const dashboardTodos = computed(() => {
  const todos = [] as any[]
  if (can('/app/izin') && izinPending.value > 0) {
    todos.push({ title: 'Proses izin yang tertunda', text: 'Prioritaskan approval agar data absensi dan monitoring aktivitas tetap sinkron.', icon: 'solar:letter-linear' })
  }
  if (can('/app/faults') && faultUnresolved.value > 0) {
    todos.push({ title: 'Tindak lanjuti kasus disiplin', text: 'Lihat kategori dominan dan lakukan pembinaan pada kasus aktif.', icon: 'mingcute:fault-line' })
  }
  if (can('/app/agenda') && !agendaTerdekat.value.length) {
    todos.push({ title: 'Siapkan agenda baru', text: 'Belum ada agenda 7 hari ke depan. Anda bisa merencanakan kegiatan operasional dari sekarang.', icon: 'solar:calendar-line-duotone' })
  }
  if (can('/app/announcement') && !announcementRows.value.filter((x: any) => x.active).length) {
    todos.push({ title: 'Cek broadcast pengumuman', text: 'Tidak ada pengumuman aktif. Pastikan kanal informasi tetap berjalan.', icon: 'lucide:megaphone' })
  }
  if (!todos.length) {
    todos.push({ title: 'Operasional cukup stabil', text: 'Tidak ada sinyal prioritas tinggi dari modul yang sedang aktif pada akun ini.', icon: 'lucide:badge-check' })
  }
  return todos.slice(0, 4)
})

const attendanceChart = computed(() => {
  const hist = (absensi.history?.value || []).slice(-30)
  const labels = hist.map((s: any) => {
    const d = new Date(s?.date || s?.tanggal || s?.ts || Date.now())
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${dd}/${mm}`
  })
  const data = hist.map((s: any) => pct(Number(s?.present || 0), Number(s?.total || 0)) ?? 0)
  return {
    labels,
    datasets: [{
      label: 'Hadir (%)',
      data,
      fill: true,
      tension: 0.35,
      backgroundColor: 'rgba(34,197,94,0.12)',
      borderColor: 'rgba(22,163,74,1)',
      pointRadius: 0,
    }]
  }
})

const jenjangChart = computed(() => {
  const rows = santri.rows?.value || []
  const countBy: Record<string, number> = {}
  for (const s of rows) {
    const raw = String(s?.jenjang || s?.kelas || 'Lainnya')
    let key = 'Lainnya'
    if (/^(vii|viii|ix)/i.test(raw)) key = 'MTs'
    else if (/^(x|xi|xii)/i.test(raw)) key = 'MA'
    else if (/kmi|diniyah/i.test(raw)) key = 'KMI/Diniyah'
    else key = raw
    countBy[key] = (countBy[key] || 0) + 1
  }
  const labels = Object.keys(countBy)
  const data = labels.map((k) => countBy[k])
  return {
    labels,
    datasets: [{ data, backgroundColor: ['#16a34a', '#22c55e', '#84cc16', '#0ea5e9', '#f59e0b', '#ef4444'] }]
  }
})

const faultChart = computed(() => {
  const sum = faults.summaryByKategori?.value
  let labels: string[] = []
  let data: number[] = []
  if (sum && Array.isArray(sum)) {
    labels = sum.map((x: any) => x.kategori || x.title || '—')
    data = sum.map((x: any) => Number(x.count || x.total || 0))
  } else {
    const rows = faults.rows?.value || []
    const since = Date.now() - 30 * 86400000
    const map: Record<string, number> = {}
    for (const f of rows) {
      const t = Number(f?.timestamp || f?.createdAt || Date.parse(f?.date || '')) || 0
      if (!t || t < since) continue
      const k = String(f?.kategori || 'Lainnya')
      map[k] = (map[k] || 0) + 1
    }
    labels = Object.keys(map)
    data = labels.map((k) => map[k])
  }
  return {
    labels,
    datasets: [{ label: 'Kasus', data, backgroundColor: 'rgba(22,163,74,0.72)' }]
  }
})

const receiptsChart = computed(() => {
  const hist = finance.receiptsHistory?.value
  const labels: string[] = []
  const data: number[] = []
  const days = 30

  if (Array.isArray(hist) && hist.length) {
    const sliced = hist.slice(-days)
    for (const it of sliced) {
      const d = toDate(it?.date ?? it?.tanggal ?? it?.ts ?? Date.now())
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      labels.push(`${dd}/${mm}`)
      data.push(Number(it?.total ?? it?.amount ?? it?.nominal ?? 0))
    }
  } else {
    const tx = (finance.transactions?.value || []).filter(isIncome)
    const since = Date.now() - days * 86400000
    const map: Record<string, number> = {}
    for (const t of tx) {
      const d = toDate(t?.date ?? t?.tanggal ?? t?.ts)
      if (+d < since) continue
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      map[key] = (map[key] || 0) + amount(t)
    }
    const keys = Object.keys(map).sort()
    for (const k of keys) {
      const [Y, M, D] = k.split('-')
      labels.push(`${D}/${M}`)
      data.push(map[k]!)
    }
  }

  return {
    labels,
    datasets: [{ label: 'Penerimaan', data, backgroundColor: 'rgba(34,197,94,0.68)' }]
  }
})

const fmtDateTime = (ms?: number) => ms ? new Date(ms).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '—'
const fmtRange = (a?: number, b?: number) => {
  const A = a ? new Date(a) : null
  const B = b ? new Date(b) : null
  if (!A && !B) return '—'
  if (A && !B) return `${A.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}`
  if (!A && B) return `s.d. ${B.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}`
  return `${A!.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })} – ${B!.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}`
}
const humanStatus = (s?: string) => {
  const x = String(s || '').toLowerCase()
  if (x === 'pending') return 'Menunggu'
  if (x === 'approved') return 'Disetujui'
  if (x === 'rejected') return 'Ditolak'
  if (x === 'out') return 'Keluar'
  if (x === 'returned') return 'Kembali'
  return s || '-'
}

const izinRows = computed(() => {
  const list = izin.rows?.value || []
  return list
    .slice()
    .sort((a: any, b: any) => Number(b?.requestedAt || 0) - Number(a?.requestedAt || 0))
    .map((x: any) => ({
      id: x.id,
      name: x.name || 'Santri Fulan',
      maskan: x.maskan || '',
      kamar: x.kamar || '',
      reason: x.reason || '-',
      urgency: x.urgency || 'Normal',
      planned: fmtRange(x.plannedOutAt, x.plannedReturnAt),
      requestedAtLabel: fmtDateTime(x.requestedAt),
      status: x.status || 'pending',
      statusLabel: humanStatus(x.status),
    }))
})

const faultRows = computed(() => {
  const rows = faults.rows?.value || []
  return rows
    .slice()
    .sort((a: any, b: any) => Number(b?.timestamp || 0) - Number(a?.timestamp || 0))
    .map((x: any) => ({
      id: x?.id || x?._id,
      santri: x?.santri || x?.nama || '-',
      kategori: x?.kategori || '-',
      poin: Number(x?.poin || x?.point || 0),
      status: x?.resolved ? 'Selesai' : 'Aktif',
      waktu: new Date(Number(x?.timestamp || Date.parse(x?.tanggal || Date.now()))).toLocaleString('id-ID')
    }))
})

const announcementRows = computed(() => {
  const rows = ann.rows?.value || ann.items?.value || ann.list?.value || []
  return rows.map((x: any, idx: number) => ({
    id: x.id || x._id || `ann-${idx}`,
    title: x.title || 'Pengumuman',
    message: x.message || x.desc || '',
    active: x.active ?? true,
  }))
})

const nowMs = () => Date.now()
const in7DaysMs = () => nowMs() + 7 * 86400000
const fmtTimeRange = (a?: number, b?: number, allDay?: boolean) => {
  if (!a && !b) return ''
  if (allDay) return 'Seharian'
  const A = a ? new Date(a) : null
  const B = b ? new Date(b) : null
  const time = (d: Date) => d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  if (A && B) return `${time(A)}–${time(B)}`
  if (A) return time(A)
  return time(B!)
}

const agendaTerdekat = computed(() => {
  const list = agendaApi.rows.value || []
  const start = nowMs()
  const end = in7DaysMs()
  return list
    .filter((a: any) => {
      const s = Number(a.startAt || 0)
      const e = Number(a.endAt || a.startAt || 0)
      return (s >= start && s <= end) || (e >= start && e <= end) || (s <= start && e >= start)
    })
    .sort((a: any, b: any) => (a.startAt - b.startAt) || (a.title || '').localeCompare(b.title || ''))
    .slice(0, 8)
    .map((a: any, i: number) => ({
      id: a.id || 'a' + i,
      title: a.title || 'Agenda',
      when: new Date(a.startAt).toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short' }),
      time: fmtTimeRange(a.startAt, a.endAt, a.allDay),
      where: a.location || '',
      color: a.color || '#16a34a',
      thumbUrl: a.thumbUrl || null,
      startAt: a.startAt,
      endAt: a.endAt,
      allDay: a.allDay,
      location: a.location,
      desc: a.desc,
    }))
})

const agendaDetailId = ref<string | null>(null)
const selectedAgenda = computed(() => agendaTerdekat.value.find((a) => a.id === agendaDetailId.value) || null)
function openAgendaDetail(id: string) { agendaDetailId.value = id }
function closeAgendaDetail() { agendaDetailId.value = null }

function fmtDateTimeRange(a?: number, b?: number, allDay?: boolean) {
  if (!a && !b) return ''
  if (allDay) {
    const d = a ? new Date(a) : b ? new Date(b) : new Date()
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) + ' · Seharian'
  }
  const A = a ? new Date(a) : null
  const B = b ? new Date(b) : null
  const fmtD = (d: Date) => d.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
  const fmtT = (d: Date) => d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  if (A && B) {
    const sameDay = A.toDateString() === B.toDateString()
    return sameDay ? `${fmtD(A)} · ${fmtT(A)}–${fmtT(B)}` : `${fmtD(A)} ${fmtT(A)} — ${fmtD(B)} ${fmtT(B)}`
  }
  if (A) return `${fmtD(A)} · ${fmtT(A)}`
  return `${fmtD(B!)} · ${fmtT(B!)}`
}

const chartOpts = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { mode: 'index', intersect: false }
  },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: 'rgba(0,0,0,0.06)' } }
  }
}

function reloadAbsensiHistory() {
  absensi.fetchHistory?.()
}

function go(path: string) {
  router.push(path)
}

async function bindFirebaseProfile(uid?: string | null) {
  if (!uid) return

  try {
    if (profileRef) off(profileRef)
  } catch {}

  profileRef = dbRef($realtimeDb, `/${clientName}/users/${uid}`)

  try {
    const snap = await get(profileRef)
    if (snap.exists()) {
      firebaseProfile.value = snap.val()
      allowedRoutesState.value = uniqRoutes(coerceRoutes(snap.val()?.allowedRoutes))
    }
  } catch {}

  onValue(profileRef, (snap) => {
    const val = snap.val() || null
    firebaseProfile.value = val
    allowedRoutesState.value = uniqRoutes(coerceRoutes(val?.allowedRoutes))
  })
}

onMounted(async () => {
  try {
    const sess = await readAuthToken()
    dashboardSession.value = sess
    allowedRoutesState.value = uniqRoutes(Array.isArray(sess?.allowedRoutes) ? sess!.allowedRoutes!.map(String) : [])

    const uid = sess?.uid || sess?.sub || null
    if (uid) {
      await bindFirebaseProfile(uid)
    }
  } catch {
    allowedRoutesState.value = []
  }

  const d = new Date()

  if (can('/app/agenda')) {
    agendaApi.subscribeMonth(d.getFullYear(), d.getMonth())
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
    const day = d.getDate()
    if (lastDay - day <= 7) {
      const y = d.getFullYear(), m1 = d.getMonth() + 1
      setTimeout(() => agendaApi.subscribeMonth(y + (m1 > 11 ? 1 : 0), (m1 % 12)), 100)
    }
  }

  if (can('/app/santri')) {
    try { santri.subscribeSantri?.() } catch {}
    try { await santri.fetchSantri?.() } catch {}
  }

  if (can('/app/absen')) {
    try { await absensi.fetchCurrent?.() } catch {}
    try { await absensi.fetchHistory?.() } catch {}
    try { absensi.subscribeLive?.() } catch {}
  }

  if (can('/app/izin')) {
    try { await izin.fetchIzin?.() } catch {}
    try { izin.subscribeLive?.() } catch {}
  }

  if (can('/app/faults')) {
    try { await faults.fetchFaults?.() } catch {}
    try { faults.subscribeFaults?.() } catch {}
  }

  if (can('/app/announcement')) {
    try { await ann.fetchAnnouncements?.() } catch {}
    try { ann.subscribeAnnouncements?.() } catch {}
  }

  if (canFinance.value) {
    try { await finance.fetchSummary?.() } catch {}
    try { await finance.fetchTransactions?.() } catch {}
    try { await finance.fetchReceiptsHistory?.({ days: 30 }) } catch {}
    try { finance.subscribeFinance?.() } catch {}
  }

  if (can('/app/picket') || can('/app/teacher') || can('/app/user')) {
    try { await pengurus?.fetchAbsensiToday?.() } catch {}
    try { pengurus?.subscribeAbsensiLive?.() } catch {}
  }

  dashboardLoading.value = false
})

onUnmounted(() => {
  try {
    if (profileRef) off(profileRef)
  } catch {}
})
</script>
