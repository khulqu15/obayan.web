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
            Realtime Attendance
          </div>

          <h1 class="mt-4 text-2xl font-black tracking-tight md:text-4xl">
            Absensi Santri
          </h1>

          <p class="mt-2 max-w-xl text-sm leading-6 text-green-50/90 md:text-base">
            Pantau kehadiran, izin, sakit, alpa, dan riwayat absensi santri secara realtime.
          </p>
        </div>

        <div class="min-w-0 rounded-[28px] bg-white/13 p-4 ring-1 ring-white/15 backdrop-blur lg:w-[390px]">
          <label class="text-xs font-bold text-green-50/80">Santri Terhubung</label>

          <select
            v-model="selectedSantriId"
            class="mt-2 h-12 w-full rounded-2xl border border-white/20 bg-white/15 px-4 text-sm font-bold text-white outline-none backdrop-blur focus:border-white/60"
          >
            <option
              v-for="s in santriProfiles"
              :key="s.id"
              :value="s.id"
              class="text-slate-900"
            >
              {{ santriNameOf(s) }}
            </option>
          </select>

          <div class="mt-3 grid grid-cols-3 gap-2">
            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ attendanceRate }}%</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Hadir</div>
            </div>

            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ attendanceRows.length }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Data</div>
            </div>

            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ attendanceStats.alpa }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Alpa</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div
      v-if="!loading && santriProfiles.length === 0"
      class="rounded-[32px] border border-dashed border-slate-300 bg-white p-10 text-center dark:border-neutral-700 dark:bg-neutral-900"
    >
      <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300">
        <Icon icon="ph:user-circle-duotone" class="h-9 w-9" />
      </div>

      <h2 class="mt-4 text-lg font-black text-slate-900 dark:text-white">
        Data santri belum terhubung
      </h2>

      <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-neutral-400">
        Akun wali ini belum memiliki santri yang terhubung.
      </p>
    </div>

    <template v-else>
      <!-- Loading -->
      <div v-if="loading" class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="i in 4"
          :key="i"
          class="h-36 animate-pulse rounded-[28px] bg-slate-100 dark:bg-neutral-800"
        ></div>
      </div>

      <template v-else>
        <!-- Summary Cards -->
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Rasio Kehadiran
                </div>

                <div class="mt-2 flex items-end gap-1">
                  <span class="text-3xl font-black text-slate-900 dark:text-white">
                    {{ attendanceRate }}
                  </span>
                  <span class="pb-1 text-xs font-bold text-slate-400 dark:text-neutral-500">%</span>
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  {{ attendanceDescription }}
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <Icon icon="ph:check-circle-duotone" class="h-6 w-6" />
              </div>
            </div>

            <div class="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800">
              <div
                class="h-full rounded-full bg-green-500 transition-all duration-500"
                :style="{ width: attendanceRate + '%' }"
              ></div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Hadir
                </div>

                <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {{ attendanceStats.hadir }}
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Total kehadiran tercatat.
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <Icon icon="solar:calendar-mark-linear" class="h-6 w-6" />
              </div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Izin / Sakit
                </div>

                <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {{ attendanceStats.izin + attendanceStats.sakit }}
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Izin {{ attendanceStats.izin }} • Sakit {{ attendanceStats.sakit }}
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <Icon icon="solar:letter-linear" class="h-6 w-6" />
              </div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Alpa
                </div>

                <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {{ attendanceStats.alpa }}
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Perlu perhatian jika berulang.
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">
                <Icon icon="ph:warning-circle-duotone" class="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        <!-- AI Insight -->
        <div class="grid gap-4 xl:grid-cols-[1fr,0.82fr]">
          <div class="relative overflow-hidden rounded-[32px] border border-green-100 bg-gradient-to-br from-slate-950 via-green-950 to-green-900 p-5 text-white shadow-sm dark:border-neutral-800">
            <div class="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-green-300/20 blur-3xl"></div>

            <div class="relative z-10">
              <div class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black ring-1 ring-white/15">
                <Icon icon="ph:sparkle-duotone" class="h-4 w-4" />
                AI Attendance Insight
              </div>

              <h2 class="mt-4 text-xl font-black">
                {{ aiSummary.title }}
              </h2>

              <p class="mt-2 text-sm leading-6 text-white/75">
                {{ aiSummary.desc }}
              </p>

              <div class="mt-5">
                <div class="flex items-center justify-between text-xs font-bold text-white/70">
                  <span>Attendance Health Score</span>
                  <span>{{ attendanceHealthScore }}/100</span>
                </div>

                <div class="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-lime-300 to-green-400 transition-all duration-500"
                    :style="{ width: attendanceHealthScore + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Rekomendasi Kehadiran
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Analisis otomatis dari pola absensi.
                </p>
              </div>

              <span class="rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
                {{ aiInsights.length }} insight
              </span>
            </div>

            <div class="space-y-3">
              <div
                v-for="item in aiInsights"
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

                    <div class="mt-2 text-xs font-bold text-slate-400 dark:text-neutral-500">
                      Prioritas: {{ item.priority }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Toolbar -->
        <div class="rounded-[32px] border border-white/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.3fr,0.7fr,0.7fr,0.7fr,0.55fr]">
            <div class="relative">
              <input
                v-model="filters.q"
                type="text"
                placeholder="Cari kegiatan, mapel, keterangan, status..."
                class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:ring-green-500/10"
              />
              <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Icon icon="lucide:search" class="h-4 w-4" />
              </span>
            </div>

            <select
              v-model="filters.status"
              class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="semua">Semua Status</option>
              <option value="hadir">Hadir</option>
              <option value="izin">Izin</option>
              <option value="sakit">Sakit</option>
              <option value="alpa">Alpa</option>
            </select>

            <select
              v-model="filters.period"
              class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="semua">Semua Periode</option>
              <option value="hari-ini">Hari Ini</option>
              <option value="minggu-ini">Minggu Ini</option>
              <option value="bulan-ini">Bulan Ini</option>
              <option value="tahun-ini">Tahun Ini</option>
            </select>

            <select
              v-model="filters.sort"
              class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="terbaru">Terbaru</option>
              <option value="terlama">Terlama</option>
              <option value="status">Status</option>
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

        <!-- Tabs -->
        <div class="flex gap-2 overflow-x-auto pb-1">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            @click="activeTab = tab.key"
            :class="[
              'shrink-0 rounded-2xl px-4 py-2.5 text-sm font-black transition',
              activeTab === tab.key
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800'
            ]"
          >
            {{ tab.label }}
            <span
              :class="[
                'ml-1 rounded-full px-2 py-0.5 text-[11px]',
                activeTab === tab.key
                  ? 'bg-white/18 text-white'
                  : 'bg-slate-100 text-slate-500 dark:bg-neutral-800 dark:text-neutral-400'
              ]"
            >
              {{ tab.count }}
            </span>
          </button>
        </div>

        <!-- Main Content -->
        <div class="grid gap-4 xl:grid-cols-[1fr,0.82fr]">
          <!-- List -->
          <div class="rounded-[32px] border border-white/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex flex-col gap-3 border-b border-slate-100 p-5 dark:border-neutral-800 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Riwayat Absensi
                </h2>

                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Menampilkan {{ visibleRows.length }} data absensi.
                </p>
              </div>

              <button
                type="button"
                @click="exportCSV"
                class="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                <Icon icon="ph:download-simple-duotone" class="h-4 w-4" />
                Export CSV
              </button>
            </div>

            <div
              v-if="visibleRows.length === 0"
              class="p-10 text-center"
            >
              <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <Icon icon="hugeicons:note-03" class="h-8 w-8" />
              </div>

              <h3 class="mt-4 text-lg font-black text-slate-900 dark:text-white">
                Absensi tidak ditemukan
              </h3>

              <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                Coba ubah filter atau tunggu data absensi diinput admin/guru.
              </p>
            </div>

            <div v-else class="divide-y divide-slate-100 dark:divide-neutral-800">
              <div
                v-for="row in visibleRows"
                :key="row._uid"
                class="p-5 transition hover:bg-slate-50/70 dark:hover:bg-neutral-800/40"
              >
                <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div class="flex min-w-0 gap-3">
                    <div :class="['grid h-12 w-12 shrink-0 place-items-center rounded-2xl', attendanceIconClass(row)]">
                      <Icon :icon="attendanceIcon(row)" class="h-6 w-6" />
                    </div>

                    <div class="min-w-0">
                      <div class="flex flex-wrap items-center gap-2">
                        <h3 class="truncate text-base font-black text-slate-900 dark:text-white">
                          {{ attendanceTitle(row) }}
                        </h3>

                        <span :class="['rounded-full px-2.5 py-1 text-[11px] font-black capitalize', attendanceStatusClass(row)]">
                          {{ extractStatus(row) || '—' }}
                        </span>
                      </div>

                      <div class="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-neutral-400">
                        <span>{{ formatDate(extractDate(row)) }}</span>
                        <span>•</span>
                        <span>{{ formatTime(extractDate(row)) }}</span>
                        <span v-if="row.mapel || row.subject">•</span>
                        <span v-if="row.mapel || row.subject">{{ row.mapel || row.subject }}</span>
                      </div>

                      <p
                        v-if="row.keterangan || row.note || row.alasan || row.description"
                        class="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-neutral-400"
                      >
                        {{ row.keterangan || row.note || row.alasan || row.description }}
                      </p>
                    </div>
                  </div>

                  <div class="shrink-0 text-left md:text-right">
                    <button
                      type="button"
                      @click="openDetail(row)"
                      class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      Detail
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Panels -->
          <div class="space-y-4">
            <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="mb-4">
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Distribusi Absensi
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Komposisi status kehadiran.
                </p>
              </div>

              <div class="space-y-4">
                <div
                  v-for="item in statusDistribution"
                  :key="item.label"
                >
                  <div class="mb-1 flex items-center justify-between text-xs font-bold">
                    <span class="text-slate-600 dark:text-neutral-300">{{ item.label }}</span>
                    <span class="text-slate-400 dark:text-neutral-500">{{ item.count }}</span>
                  </div>

                  <div class="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800">
                    <div
                      :class="['h-full rounded-full transition-all duration-500', item.barClass]"
                      :style="{ width: item.percent + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="mb-4">
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Pola Terbaru
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  5 absensi terakhir santri.
                </p>
              </div>

              <div v-if="latestRows.length === 0" class="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400">
                Belum ada data terbaru.
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="row in latestRows"
                  :key="row._uid"
                  class="flex items-center justify-between gap-3 rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
                >
                  <div class="min-w-0">
                    <div class="truncate font-black text-slate-900 dark:text-white">
                      {{ attendanceTitle(row) }}
                    </div>

                    <div class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                      {{ formatDate(extractDate(row)) }}
                    </div>
                  </div>

                  <span :class="['shrink-0 rounded-full px-2.5 py-1 text-xs font-black capitalize', attendanceStatusClass(row)]">
                    {{ extractStatus(row) || '—' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="mb-4">
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Informasi Santri
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Data singkat santri yang dipantau.
                </p>
              </div>

              <div class="space-y-3">
                <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                  <div class="text-xs font-bold text-slate-500 dark:text-neutral-400">Nama Santri</div>
                  <div class="mt-1 font-black text-slate-900 dark:text-white">{{ santriNameOf(currentSantri) }}</div>
                </div>

                <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                  <div class="text-xs font-bold text-slate-500 dark:text-neutral-400">Kelas / Jenjang</div>
                  <div class="mt-1 font-black text-slate-900 dark:text-white">
                    {{ currentSantri?.kelasFormal || currentSantri?.jenjang || '—' }}
                  </div>
                </div>

                <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                  <div class="text-xs font-bold text-slate-500 dark:text-neutral-400">Kamar</div>
                  <div class="mt-1 font-black text-slate-900 dark:text-white">
                    {{ currentSantri?.kamar || '—' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>

    <!-- Detail Modal -->
    <div
      v-if="detailOpen && selectedAttendance"
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
        <div class="w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
          <div class="border-b border-slate-100 p-5 dark:border-neutral-800">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <Icon icon="hugeicons:note-03" class="h-4 w-4" />
                  Detail Absensi
                </div>

                <h3 class="mt-3 text-xl font-black text-slate-900 dark:text-white">
                  {{ attendanceTitle(selectedAttendance) }}
                </h3>

                <p class="mt-1 text-sm text-slate-500 dark:text-neutral-400">
                  {{ formatDate(extractDate(selectedAttendance)) }} • {{ formatTime(extractDate(selectedAttendance)) }}
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

          <div class="space-y-4 p-5">
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-xs font-bold text-slate-400">Nama Santri</div>
                <div class="mt-1 font-black text-slate-900 dark:text-white">{{ santriNameOf(currentSantri) }}</div>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-xs font-bold text-slate-400">Status</div>
                <div class="mt-1">
                  <span :class="['inline-flex rounded-full px-3 py-1.5 text-xs font-black capitalize', attendanceStatusClass(selectedAttendance)]">
                    {{ extractStatus(selectedAttendance) || '—' }}
                  </span>
                </div>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-xs font-bold text-slate-400">Tanggal</div>
                <div class="mt-1 font-black text-slate-900 dark:text-white">{{ formatDate(extractDate(selectedAttendance)) }}</div>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-xs font-bold text-slate-400">Jam</div>
                <div class="mt-1 font-black text-slate-900 dark:text-white">{{ formatTime(extractDate(selectedAttendance)) }}</div>
              </div>
            </div>

            <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
              <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                Keterangan
              </div>

              <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                {{ selectedAttendance.keterangan || selectedAttendance.note || selectedAttendance.alasan || selectedAttendance.description || 'Tidak ada keterangan tambahan.' }}
              </p>
            </div>
          </div>

          <div class="flex justify-end border-t border-slate-100 p-5 dark:border-neutral-800">
            <button
              type="button"
              @click="closeDetail"
              class="rounded-2xl bg-green-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
            >
              Mengerti
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { onValue, ref as dbRef } from 'firebase/database'
import { useNuxtApp, useRuntimeConfig, useState } from 'nuxt/app'

definePageMeta({
  layout: 'wali'
})

type AnyRow = Record<string, any>

type SantriProfile = AnyRow & {
  id: string
  _uid: string
  _path?: string
}

type InsightItem = {
  title: string
  desc: string
  icon: string
  priority: string
  cardClass: string
  iconClass: string
}

const config = useRuntimeConfig()
const { $realtimeDb } = useNuxtApp() as any
const sessionUser = useState<any>('sessionUser', () => ({}))

const clientName = String(config.public.clientName || 'alinayah')

const loading = ref(true)
const selectedSantriId = ref('')
const santriProfiles = ref<SantriProfile[]>([])
const absensiRawRows = ref<AnyRow[]>([])

const activeTab = ref<'semua' | 'hadir' | 'izin' | 'sakit' | 'alpa'>('semua')

const filters = ref({
  q: '',
  status: 'semua',
  period: 'bulan-ini',
  sort: 'terbaru'
})

const detailOpen = ref(false)
const selectedAttendance = ref<AnyRow | null>(null)

let unsubscribers: Array<() => void> = []
let stopSessionWatch: (() => void) | null = null
const bucketMap = new Map<string, AnyRow[]>()

const currentSantri = computed(() => {
  return santriProfiles.value.find((item) => item.id === selectedSantriId.value) || santriProfiles.value[0] || null
})

const attendanceRows = computed(() => {
  return sortRows(filterRowsForCurrentSantri(absensiRawRows.value))
})

const filteredRows = computed(() => {
  return attendanceRows.value.filter((row) => {
    if (filters.value.status !== 'semua') {
      if (!statusMatches(row, filters.value.status)) return false
    }

    if (!periodMatches(row, filters.value.period)) return false

    if (filters.value.q.trim()) {
      const q = normalizeText(filters.value.q)
      const text = normalizeText([
        attendanceTitle(row),
        row.mapel,
        row.subject,
        row.kegiatan,
        row.keterangan,
        row.note,
        row.alasan,
        row.description,
        extractStatus(row)
      ].join(' '))

      if (!text.includes(q)) return false
    }

    return true
  })
})

const visibleRows = computed(() => {
  if (activeTab.value === 'hadir') return filteredRows.value.filter((row) => statusMatches(row, 'hadir'))
  if (activeTab.value === 'izin') return filteredRows.value.filter((row) => statusMatches(row, 'izin'))
  if (activeTab.value === 'sakit') return filteredRows.value.filter((row) => statusMatches(row, 'sakit'))
  if (activeTab.value === 'alpa') return filteredRows.value.filter((row) => statusMatches(row, 'alpa'))

  return filteredRows.value
})

const attendanceStats = computed(() => {
  const result = {
    hadir: 0,
    izin: 0,
    sakit: 0,
    alpa: 0
  }

  for (const row of attendanceRows.value) {
    if (statusMatches(row, 'hadir')) result.hadir++
    else if (statusMatches(row, 'izin')) result.izin++
    else if (statusMatches(row, 'sakit')) result.sakit++
    else if (statusMatches(row, 'alpa')) result.alpa++
  }

  return result
})

const attendanceRate = computed(() => {
  if (!attendanceRows.value.length) return 0
  return Math.round((attendanceStats.value.hadir / attendanceRows.value.length) * 100)
})

const attendanceHealthScore = computed(() => {
  if (!attendanceRows.value.length) return 75

  let score = attendanceRate.value

  score -= Math.min(20, attendanceStats.value.alpa * 5)
  score -= Math.min(10, attendanceStats.value.izin * 2)

  return Math.max(10, Math.min(100, score))
})

const attendanceDescription = computed(() => {
  if (!attendanceRows.value.length) return 'Belum ada data absensi.'
  if (attendanceRate.value >= 90) return 'Kehadiran sangat baik.'
  if (attendanceRate.value >= 80) return 'Kehadiran cukup stabil.'
  if (attendanceRate.value >= 70) return 'Kehadiran perlu dijaga.'
  return 'Kehadiran perlu perhatian.'
})

const aiSummary = computed(() => {
  if (!attendanceRows.value.length) {
    return {
      title: 'Data absensi belum cukup',
      desc: 'Sistem belum menemukan data absensi yang cukup untuk membaca pola kehadiran santri.'
    }
  }

  if (attendanceHealthScore.value >= 90) {
    return {
      title: 'Kehadiran santri sangat baik',
      desc: 'Santri menunjukkan kedisiplinan kehadiran yang kuat. Pertahankan pola ini agar performa akademik tetap stabil.'
    }
  }

  if (attendanceHealthScore.value >= 75) {
    return {
      title: 'Kehadiran cukup stabil',
      desc: 'Secara umum kehadiran masih baik, namun tetap perlu dipantau agar izin, sakit, atau alpa tidak meningkat.'
    }
  }

  if (attendanceHealthScore.value >= 60) {
    return {
      title: 'Kehadiran perlu perhatian',
      desc: 'Terdapat pola absensi yang perlu dievaluasi. Wali disarankan memantau alasan ketidakhadiran secara rutin.'
    }
  }

  return {
    title: 'Kehadiran membutuhkan pendampingan',
    desc: 'Data menunjukkan santri perlu perhatian lebih pada kedisiplinan hadir. Komunikasi dengan pengurus/wali kelas sangat disarankan.'
  }
})

const aiInsights = computed<InsightItem[]>(() => {
  const insights: InsightItem[] = []

  if (!attendanceRows.value.length) {
    insights.push({
      title: 'Belum ada data absensi',
      desc: 'Absensi akan tampil otomatis setelah admin atau pengurus menginput data kehadiran.',
      icon: 'hugeicons:note-03',
      priority: 'Sedang',
      cardClass: 'border-slate-100 bg-slate-50 dark:border-neutral-800 dark:bg-neutral-800/60',
      iconClass: 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
    })

    return insights
  }

  if (attendanceStats.alpa > 0) {
    insights.push({
      title: 'Ada catatan alpa',
      desc: `Terdapat ${attendanceStats.alpa} catatan alpa. Perlu dicek penyebabnya agar tidak berulang.`,
      icon: 'ph:warning-circle-duotone',
      priority: attendanceStats.alpa >= 3 ? 'Tinggi' : 'Sedang',
      cardClass: 'border-rose-100 bg-rose-50/70 dark:border-rose-900/30 dark:bg-rose-900/10',
      iconClass: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
    })
  }

  if (attendanceStats.izin + attendanceStats.sakit > 3) {
    insights.push({
      title: 'Izin dan sakit cukup sering',
      desc: `Ada ${attendanceStats.izin + attendanceStats.sakit} data izin/sakit. Pantau apakah berdampak pada akademik atau kegiatan pondok.`,
      icon: 'solar:letter-linear',
      priority: 'Sedang',
      cardClass: 'border-green-100 bg-green-50/70 dark:border-green-900/30 dark:bg-green-900/10',
      iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })
  }

  if (attendanceRate.value >= 90) {
    insights.push({
      title: 'Kehadiran sangat konsisten',
      desc: `Rasio kehadiran ${attendanceRate.value}%. Ini indikator kedisiplinan yang baik.`,
      icon: 'ph:shield-check-duotone',
      priority: 'Rendah',
      cardClass: 'border-green-100 bg-green-50/70 dark:border-green-900/30 dark:bg-green-900/10',
      iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })
  }

  if (!insights.length) {
    insights.push({
      title: 'Kehadiran cukup aman',
      desc: 'Belum ada pola absensi yang sangat mengkhawatirkan. Tetap pantau data terbaru secara berkala.',
      icon: 'ph:sparkle-duotone',
      priority: 'Rendah',
      cardClass: 'border-green-100 bg-green-50/70 dark:border-green-900/30 dark:bg-green-900/10',
      iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })
  }

  return insights
})

const statusDistribution = computed(() => {
  const total = attendanceRows.value.length || 1

  return [
    {
      label: 'Hadir',
      count: attendanceStats.value.hadir,
      percent: Math.round((attendanceStats.value.hadir / total) * 100),
      barClass: 'bg-green-500'
    },
    {
      label: 'Izin',
      count: attendanceStats.value.izin,
      percent: Math.round((attendanceStats.value.izin / total) * 100),
      barClass: 'bg-green-500'
    },
    {
      label: 'Sakit',
      count: attendanceStats.value.sakit,
      percent: Math.round((attendanceStats.value.sakit / total) * 100),
      barClass: 'bg-amber-500'
    },
    {
      label: 'Alpa',
      count: attendanceStats.value.alpa,
      percent: Math.round((attendanceStats.value.alpa / total) * 100),
      barClass: 'bg-rose-500'
    }
  ]
})

const latestRows = computed(() => {
  return [...attendanceRows.value]
    .sort((a, b) => extractDate(b) - extractDate(a))
    .slice(0, 5)
})

const tabs = computed(() => [
  {
    key: 'semua' as const,
    label: 'Semua',
    count: filteredRows.value.length
  },
  {
    key: 'hadir' as const,
    label: 'Hadir',
    count: filteredRows.value.filter((row) => statusMatches(row, 'hadir')).length
  },
  {
    key: 'izin' as const,
    label: 'Izin',
    count: filteredRows.value.filter((row) => statusMatches(row, 'izin')).length
  },
  {
    key: 'sakit' as const,
    label: 'Sakit',
    count: filteredRows.value.filter((row) => statusMatches(row, 'sakit')).length
  },
  {
    key: 'alpa' as const,
    label: 'Alpa',
    count: filteredRows.value.filter((row) => statusMatches(row, 'alpa')).length
  }
])

function resetFilters() {
  filters.value = {
    q: '',
    status: 'semua',
    period: 'bulan-ini',
    sort: 'terbaru'
  }

  activeTab.value = 'semua'
}

function openDetail(row: AnyRow) {
  selectedAttendance.value = row
  detailOpen.value = true
}

function closeDetail() {
  selectedAttendance.value = null
  detailOpen.value = false
}

function clearSubscriptions() {
  for (const unsubscribe of unsubscribers) {
    try {
      unsubscribe()
    } catch {}
  }

  unsubscribers = []
  bucketMap.clear()
}

function resolveSantriIdsFromSession() {
  const ids = new Set<string>()
  const session = sessionUser.value || {}

  if (Array.isArray(session.santriIds)) {
    for (const id of session.santriIds) {
      if (id) ids.add(String(id))
    }
  }

  if (session.santriId) ids.add(String(session.santriId))

  return Array.from(ids)
}

function setupRealtime() {
  if (!$realtimeDb) {
    loading.value = false
    return
  }

  clearSubscriptions()

  const santriIds = resolveSantriIdsFromSession()

  if (!santriIds.length) {
    santriProfiles.value = []
    selectedSantriId.value = ''
    loading.value = false
    return
  }

  loading.value = true
  santriProfiles.value = []

  for (const id of santriIds) {
    const unsubscribe = onValue(dbRef($realtimeDb, `${clientName}/santri/${id}`), (snap) => {
      const raw = snap.val()

      if (raw) {
        upsertSantriProfile({
          id,
          _uid: id,
          _path: `${clientName}/santri/${id}`,
          ...raw
        })

        if (!selectedSantriId.value) selectedSantriId.value = id
      }

      loading.value = false
    })

    unsubscribers.push(unsubscribe)
  }

  subscribeDeep(`${clientName}/absen`)
  subscribeDeep(`${clientName}/absensi`)
  subscribeDeep(`${clientName}/attendance`)
  subscribeDeep(`${clientName}/presensi`)
}

function subscribeDeep(path: string) {
  if (!$realtimeDb) return

  const unsubscribe = onValue(dbRef($realtimeDb, path), (snap) => {
    bucketMap.set(path, flattenRecords(snap.val(), [path], 0))
    rebuildAbsensiRows()
    loading.value = false
  })

  unsubscribers.push(unsubscribe)
}

function rebuildAbsensiRows() {
  const rows: AnyRow[] = []

  for (const bucketRows of bucketMap.values()) {
    rows.push(...bucketRows)
  }

  absensiRawRows.value = rows
}

function upsertSantriProfile(profile: SantriProfile) {
  const index = santriProfiles.value.findIndex((item) => item.id === profile.id)

  if (index >= 0) {
    santriProfiles.value[index] = profile
  } else {
    santriProfiles.value.push(profile)
  }
}

function flattenRecords(value: any, path: string[] = [], depth = 0): AnyRow[] {
  if (!value || depth > 7) return []

  if (Array.isArray(value)) {
    return value.flatMap((item, index) => flattenRecords(item, [...path, String(index)], depth + 1))
  }

  if (typeof value !== 'object') return []

  const objectValue = value as AnyRow
  const lastPath = path[path.length - 1] || ''
  const pathText = path.join('/')

  if (looksLikeAttendanceRecord(objectValue)) {
    return [
      {
        _uid: objectValue.id || objectValue.key || lastPath || pathText,
        _path: pathText,
        _pathParts: path,
        ...objectValue
      }
    ]
  }

  const nested: AnyRow[] = []

  for (const [key, childValue] of Object.entries(objectValue)) {
    if (childValue && typeof childValue === 'object') {
      nested.push(...flattenRecords(childValue, [...path, key], depth + 1))
    }
  }

  if (!nested.length && Object.keys(objectValue).length) {
    return [
      {
        _uid: objectValue.id || objectValue.key || lastPath || pathText,
        _path: pathText,
        _pathParts: path,
        ...objectValue
      }
    ]
  }

  return nested
}

function looksLikeAttendanceRecord(row: AnyRow) {
  const keys = Object.keys(row)

  return keys.some((key) => [
    'santriId',
    'idSantri',
    'santri_id',
    'studentId',
    'siswaId',
    'namaSantri',
    'santriName',
    'santri',
    'status',
    'kehadiran',
    'absen',
    'presensi',
    'tanggal',
    'date',
    'createdAt',
    'mapel',
    'subject',
    'kegiatan'
  ].includes(key))
}

function filterRowsForCurrentSantri(rows: AnyRow[]) {
  return rows.filter((row) => belongsToCurrentSantri(row))
}

function belongsToCurrentSantri(row: AnyRow) {
  const santri = currentSantri.value
  const selectedId = selectedSantriId.value

  if (!santri || !selectedId) return false

  const idCandidates = [
    row.santriId,
    row.idSantri,
    row.santri_id,
    row.studentId,
    row.siswaId,
    row.uid,
    row.userId,
    row.id
  ]
    .map((value) => String(value || '').trim())
    .filter(Boolean)

  if (idCandidates.includes(selectedId)) return true

  const path = String(row._path || '')
  if (path.split('/').includes(selectedId)) return true

  const santriName = santriNameOf(santri)

  const nameCandidates = [
    row.santri,
    row.nama,
    row.namaSantri,
    row.santriName,
    row.studentName,
    row.name
  ]

  return nameCandidates.some((name) => normalizeText(name) && normalizeText(name) === normalizeText(santriName))
}

function santriNameOf(santri?: AnyRow | null) {
  if (!santri) return sessionUser.value?.santriName || 'Santri'
  return santri.santri || santri.nama || santri.namaSantri || santri.name || sessionUser.value?.santriName || 'Santri'
}

function attendanceTitle(row: AnyRow) {
  return row.title || row.kegiatan || row.mapel || row.subject || row.namaKegiatan || row.keterangan || 'Absensi Santri'
}

function extractStatus(row: AnyRow) {
  return row.status || row.kehadiran || row.absen || row.presensi || row.type || ''
}

function statusMatches(row: AnyRow, target: string) {
  const status = normalizeText(extractStatus(row))

  if (target === 'hadir') return status.includes('hadir') || status.includes('masuk')
  if (target === 'izin') return status.includes('izin')
  if (target === 'sakit') return status.includes('sakit')
  if (target === 'alpa') return status.includes('alpa') || status.includes('alpha') || status.includes('tidak hadir') || status.includes('bolos')

  return false
}

function extractDate(row: AnyRow) {
  const candidates = [
    row.date,
    row.tanggal,
    row.createdAt,
    row.updatedAt,
    row.at,
    row.timestamp,
    row.time,
    row.jam
  ]

  for (const value of candidates) {
    const parsed = parseDateValue(value)
    if (parsed) return parsed
  }

  return Date.now()
}

function parseDateValue(value: any) {
  if (!value) return 0

  if (typeof value === 'number') {
    if (value < 10_000_000_000) return value * 1000
    return value
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

function periodMatches(row: AnyRow, period: string) {
  if (period === 'semua') return true

  const date = new Date(extractDate(row))
  const now = new Date()

  const start = new Date(now)

  if (period === 'hari-ini') {
    return date.toDateString() === now.toDateString()
  }

  if (period === 'minggu-ini') {
    const day = now.getDay() || 7
    start.setDate(now.getDate() - day + 1)
    start.setHours(0, 0, 0, 0)

    const end = new Date(start)
    end.setDate(start.getDate() + 7)

    return date >= start && date < end
  }

  if (period === 'bulan-ini') {
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }

  if (period === 'tahun-ini') {
    return date.getFullYear() === now.getFullYear()
  }

  return true
}

function sortRows(rows: AnyRow[]) {
  const output = [...rows]

  if (filters.value.sort === 'terlama') {
    return output.sort((a, b) => extractDate(a) - extractDate(b))
  }

  if (filters.value.sort === 'status') {
    return output.sort((a, b) => normalizeText(extractStatus(a)).localeCompare(normalizeText(extractStatus(b)), 'id-ID'))
  }

  return output.sort((a, b) => extractDate(b) - extractDate(a))
}

function attendanceIcon(row: AnyRow) {
  if (statusMatches(row, 'hadir')) return 'ph:check-circle-duotone'
  if (statusMatches(row, 'izin')) return 'solar:letter-linear'
  if (statusMatches(row, 'sakit')) return 'ph:first-aid-kit-duotone'
  if (statusMatches(row, 'alpa')) return 'ph:warning-circle-duotone'

  return 'hugeicons:note-03'
}

function attendanceIconClass(row: AnyRow) {
  if (statusMatches(row, 'hadir')) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (statusMatches(row, 'izin')) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (statusMatches(row, 'sakit')) return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  if (statusMatches(row, 'alpa')) return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'

  return 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
}

function attendanceStatusClass(row: AnyRow) {
  if (statusMatches(row, 'hadir')) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (statusMatches(row, 'izin')) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (statusMatches(row, 'sakit')) return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  if (statusMatches(row, 'alpa')) return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'

  return 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
}

function formatDate(value?: number) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium'
  }).format(new Date(value))
}

function formatTime(value?: number) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

function normalizeText(value?: any) {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = filename

  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()

  URL.revokeObjectURL(url)
}

function toCsvCell(value: unknown) {
  const text = String(value ?? '')

  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }

  return text
}

function exportCSV() {
  const headers = [
    'Santri',
    'Tanggal',
    'Jam',
    'Status',
    'Kegiatan',
    'Keterangan'
  ]

  const lines = visibleRows.value.map((row) => [
    santriNameOf(currentSantri.value),
    formatDate(extractDate(row)),
    formatTime(extractDate(row)),
    extractStatus(row),
    attendanceTitle(row),
    row.keterangan || row.note || row.alasan || row.description || ''
  ].map(toCsvCell).join(','))

  const csv = '\uFEFF' + [headers.join(','), ...lines].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })

  saveBlob(blob, 'absensi_wali.csv')
}

onMounted(() => {
  stopSessionWatch = watch(
    () => JSON.stringify({
      santriId: sessionUser.value?.santriId || '',
      santriIds: sessionUser.value?.santriIds || []
    }),
    () => {
      setupRealtime()
    },
    { immediate: true }
  )
})

onBeforeUnmount(() => {
  clearSubscriptions()

  if (stopSessionWatch) {
    stopSessionWatch()
    stopSessionWatch = null
  }
})
</script>