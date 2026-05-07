<template>
  <div class="relative min-h-screen overflow-hidden bg-slate-50 pb-10 text-slate-900 dark:bg-neutral-950 dark:text-white">
    <!-- Background decoration -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -left-32 top-10 h-[34rem] w-[34rem] rounded-full bg-emerald-200/50 blur-3xl dark:bg-emerald-900/20"></div>
      <div class="absolute -right-32 top-48 h-[32rem] w-[32rem] rounded-full bg-sky-200/50 blur-3xl dark:bg-sky-900/20"></div>
      <div class="absolute bottom-0 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-violet-100/60 blur-3xl dark:bg-violet-900/10"></div>
      <div class="absolute inset-0 opacity-[0.045] dark:opacity-[0.08]">
        <div class="h-full w-full bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:34px_34px] dark:bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]"></div>
      </div>
    </div>

    <main class="relative mx-auto w-full max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
      <!-- Header -->
      <section class="mb-6 overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/80 sm:p-6">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-2xl">
            <div class="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
              <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
              Realtime RFID Attendance
            </div>

            <h1 class="text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              Absensi Santri Realtime
            </h1>

            <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-neutral-400">
              Pantau scan RFID, catat kehadiran manual, kelola reset sesi, dan export data absensi dalam satu dashboard yang ringan.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              :disabled="loading"
              class="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              @click="refresh"
            >
              <Icon icon="mdi:refresh" width="18" height="18" />
              Refresh
            </button>

            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(16,185,129,0.25)] transition hover:-translate-y-0.5 hover:bg-emerald-700"
              @click="openSettings = true"
            >
              <Icon icon="mdi:cog-outline" width="18" height="18" />
              Settings
            </button>

            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-neutral-100"
              @click="exportCSV"
            >
              <Icon icon="mdi:download-outline" width="18" height="18" />
              Export CSV
            </button>

            <label
              class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <Icon icon="mdi:upload-outline" width="18" height="18" />
              Import CSV
              <input
                ref="fileInput"
                type="file"
                class="hidden"
                accept=".csv"
                @change="onImportFile"
              />
            </label>

            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(225,29,72,0.22)] transition hover:-translate-y-0.5 hover:bg-rose-700"
              @click="confirmReset"
            >
              <Icon icon="mdi:restart" width="18" height="18" />
              Reset Sesi
            </button>
          </div>
        </div>
      </section>

      <!-- Error -->
      <section
        v-if="error"
        class="mb-6 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"
      >
        <div class="flex items-start gap-3">
          <Icon icon="mdi:alert-circle-outline" width="20" height="20" class="mt-0.5 shrink-0" />
          <div>
            <p class="font-semibold">Gagal memuat data absensi</p>
            <p class="mt-1">{{ error }}</p>
          </div>
        </div>
      </section>

      <!-- Stats -->
      <section class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-[1.7rem] border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/80">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-neutral-400">Sudah Hadir</p>
              <p class="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                {{ presentCount }}
              </p>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
              <Icon icon="mdi:account-check-outline" width="25" height="25" />
            </div>
          </div>
        </div>

        <div class="rounded-[1.7rem] border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/80">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-neutral-400">Live Event</p>
              <p class="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                {{ live.length }}
              </p>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300">
              <Icon icon="ri:rfid-fill" width="25" height="25" />
            </div>
          </div>
        </div>

        <div class="rounded-[1.7rem] border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/80">
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-sm font-medium text-slate-500 dark:text-neutral-400">Reset Terakhir</p>
              <p class="mt-2 truncate text-base font-semibold text-slate-950 dark:text-white" :title="lastResetFull">
                {{ lastResetLabel }}
              </p>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
              <Icon icon="mdi:clock-refresh-outline" width="25" height="25" />
            </div>
          </div>
        </div>

        <div class="rounded-[1.7rem] border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/80">
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-sm font-medium text-slate-500 dark:text-neutral-400">Auto Reset</p>
              <p class="mt-2 truncate text-base font-semibold text-slate-950 dark:text-white" :title="resetTimesLabel">
                {{ resetTimesLabel }}
              </p>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
              <Icon icon="mdi:calendar-clock-outline" width="25" height="25" />
            </div>
          </div>
        </div>
      </section>

      <!-- Main content -->
      <section class="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <!-- Live Feed -->
        <aside class="lg:col-span-4">
          <div class="overflow-hidden rounded-[1.8rem] border border-white/70 bg-white/90 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/80">
            <div class="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-white/10">
              <div>
                <h2 class="font-bold tracking-tight text-slate-950 dark:text-white">Live Feed</h2>
                <p class="mt-1 text-xs text-slate-500 dark:text-neutral-400">Aktivitas terbaru dari perangkat.</p>
              </div>

              <button
                type="button"
                class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                @click="refresh"
              >
                <Icon icon="mdi:refresh" width="18" height="18" />
              </button>
            </div>

            <div class="max-h-[31rem] overflow-y-auto p-3">
              <div v-if="liveReversed.length" class="space-y-2">
                <div
                  v-for="e in liveReversed"
                  :key="e.id"
                  class="group flex items-center gap-3 rounded-2xl border border-transparent p-3 transition hover:border-emerald-100 hover:bg-emerald-50/50 dark:hover:border-emerald-500/20 dark:hover:bg-emerald-500/10"
                >
                  <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 dark:from-emerald-500/20 dark:to-sky-500/20 dark:text-emerald-300">
                    <Icon icon="ri:rfid-fill" width="22" height="22" />
                  </div>

                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-semibold text-slate-950 dark:text-white">
                      {{ e.name || 'Santri Fulan' }}
                    </p>
                    <p class="mt-0.5 truncate text-xs text-slate-500 dark:text-neutral-400">
                      {{ e.maskan || 'Maskan -' }} • {{ e.kamar || 'Kamar -' }} • {{ formatTime(e.ts) }}
                    </p>
                  </div>

                  <span class="rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white dark:bg-white dark:text-slate-950">
                    {{ e.by || 'manual' }}
                  </span>
                </div>
              </div>

              <div v-else class="grid min-h-72 place-items-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center dark:border-white/10 dark:bg-neutral-900/60">
                <div>
                  <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-slate-400 shadow-sm dark:bg-neutral-800">
                    <Icon icon="mdi:access-point-network-off" width="28" height="28" />
                  </div>
                  <p class="mt-4 text-sm font-semibold text-slate-700 dark:text-neutral-200">Belum ada event</p>
                  <p class="mt-1 text-xs text-slate-500 dark:text-neutral-400">Data akan muncul ketika kartu RFID discan.</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Attendance Table -->
        <section class="lg:col-span-8">
          <div class="overflow-hidden rounded-[1.8rem] border border-white/70 bg-white/90 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/80">
            <div class="border-b border-slate-100 px-5 py-4 dark:border-white/10">
              <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 class="font-bold tracking-tight text-slate-950 dark:text-white">Attendance Log</h2>
                  <p class="mt-1 text-xs text-slate-500 dark:text-neutral-400">Daftar kehadiran pada sesi saat ini.</p>
                </div>

                <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div class="relative">
                    <Icon
                      icon="mdi:magnify"
                      class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      width="18"
                      height="18"
                    />
                    <input
                      v-model="search"
                      type="search"
                      placeholder="Cari nama, maskan, kamar..."
                      class="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100 dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:focus:border-emerald-500/50 dark:focus:ring-emerald-500/10 sm:w-72"
                    />
                  </div>

                  <select
                    v-model="sortKey"
                    class="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100 dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:focus:border-emerald-500/50 dark:focus:ring-emerald-500/10"
                  >
                    <option value="time_desc">Waktu terbaru</option>
                    <option value="time_asc">Waktu terlama</option>
                    <option value="name_asc">Nama A-Z</option>
                    <option value="name_desc">Nama Z-A</option>
                  </select>

                  <select
                    v-model.number="pageSize"
                    class="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100 dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:focus:border-emerald-500/50 dark:focus:ring-emerald-500/10"
                  >
                    <option :value="10">10 / page</option>
                    <option :value="25">25 / page</option>
                    <option :value="50">50 / page</option>
                    <option :value="100">100 / page</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead>
                  <tr class="border-b border-slate-100 bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-neutral-950/60 dark:text-neutral-400">
                    <th class="px-5 py-3">Nama</th>
                    <th class="px-5 py-3">Santri ID</th>
                    <th class="px-5 py-3">Maskan / Kamar</th>
                    <th class="px-5 py-3">Waktu</th>
                    <th class="px-5 py-3">Metode</th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-slate-100 dark:divide-white/10">
                  <tr
                    v-for="row in pagedRows"
                    :key="row.key"
                    class="transition hover:bg-slate-50/80 dark:hover:bg-white/[0.03]"
                  >
                    <td class="px-5 py-4">
                      <div class="flex items-center gap-3">
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-300">
                          <Icon icon="mdi:account-outline" width="20" height="20" />
                        </div>
                        <div>
                          <p class="font-semibold text-slate-950 dark:text-white">{{ row.name }}</p>
                          <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">{{ row.key }}</p>
                        </div>
                      </div>
                    </td>

                    <td class="px-5 py-4 text-slate-600 dark:text-neutral-300">
                      {{ row.santriId || '—' }}
                    </td>

                    <td class="px-5 py-4 text-slate-600 dark:text-neutral-300">
                      {{ row.maskan || '—' }}
                      <span v-if="row.kamar"> / {{ row.kamar }}</span>
                    </td>

                    <td class="px-5 py-4 text-slate-600 dark:text-neutral-300">
                      {{ formatTime(row.ts) }}
                    </td>

                    <td class="px-5 py-4">
                      <span
                        class="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
                        :class="row.by?.startsWith('manual') || row.by === 'manual'
                          ? 'bg-amber-500'
                          : 'bg-sky-600'"
                      >
                        {{ (row.by || 'manual').toUpperCase() }}
                      </span>
                    </td>
                  </tr>

                  <tr v-if="!pagedRows.length">
                    <td colspan="5" class="px-5 py-14 text-center">
                      <div class="mx-auto max-w-sm">
                        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-400 dark:bg-neutral-800">
                          <Icon icon="mdi:database-search-outline" width="28" height="28" />
                        </div>
                        <p class="mt-4 text-sm font-semibold text-slate-700 dark:text-neutral-200">Tidak ada data</p>
                        <p class="mt-1 text-xs text-slate-500 dark:text-neutral-400">
                          Coba ubah kata kunci pencarian atau lakukan scan RFID.
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
              <p class="text-xs text-slate-500 dark:text-neutral-400">
                Menampilkan
                <span class="font-semibold text-slate-700 dark:text-neutral-200">{{ filteredRows.length ? startIndex + 1 : 0 }}</span>
                –
                <span class="font-semibold text-slate-700 dark:text-neutral-200">{{ Math.min(startIndex + pageSize, filteredRows.length) }}</span>
                dari
                <span class="font-semibold text-slate-700 dark:text-neutral-200">{{ filteredRows.length }}</span>
                data
              </p>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  :disabled="page === 1"
                  class="inline-flex h-9 min-w-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="page = 1"
                >
                  ⟪
                </button>

                <button
                  type="button"
                  :disabled="page === 1"
                  class="inline-flex h-9 min-w-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="page--"
                >
                  ‹
                </button>

                <span class="px-2 text-xs font-semibold text-slate-600 dark:text-neutral-300">
                  {{ page }} / {{ totalPages }}
                </span>

                <button
                  type="button"
                  :disabled="page === totalPages"
                  class="inline-flex h-9 min-w-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="page++"
                >
                  ›
                </button>

                <button
                  type="button"
                  :disabled="page === totalPages"
                  class="inline-flex h-9 min-w-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="page = totalPages"
                >
                  ⟫
                </button>
              </div>
            </div>
          </div>
        </section>
      </section>

      <!-- Settings Modal -->
      <Teleport to="body">
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="openSettings"
            class="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm"
            @keydown.esc="openSettings = false"
          >
            <div class="flex min-h-full items-center justify-center">
              <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="scale-95 opacity-0 translate-y-3"
                enter-to-class="scale-100 opacity-100 translate-y-0"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="scale-100 opacity-100 translate-y-0"
                leave-to-class="scale-95 opacity-0 translate-y-3"
              >
                <div
                  v-if="openSettings"
                  class="w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.25)] dark:border-white/10 dark:bg-neutral-900"
                  @click.stop
                >
                  <div class="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 dark:border-white/10">
                    <div>
                      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
                        Attendance Settings
                      </p>
                      <h3 class="mt-1 text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                        Pengaturan Reset Sesi
                      </h3>
                      <p class="mt-1 text-sm text-slate-500 dark:text-neutral-400">
                        Atur jadwal reset otomatis dalam format 24 jam.
                      </p>
                    </div>

                    <button
                      type="button"
                      class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800"
                      @click="openSettings = false"
                    >
                      <Icon icon="mdi:close" width="20" height="20" />
                    </button>
                  </div>

                  <div class="space-y-5 px-6 py-5">
                    <div>
                      <label class="text-sm font-semibold text-slate-700 dark:text-neutral-200">
                        Auto Reset Times
                      </label>

                      <div class="mt-2 flex flex-col gap-2 sm:flex-row">
                        <input
                          v-model="timesInput"
                          type="text"
                          placeholder="Contoh: 06:30, 12:00, 20:45"
                          class="h-11 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100 dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:focus:border-emerald-500/50 dark:focus:ring-emerald-500/10"
                        />

                        <button
                          type="button"
                          class="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(16,185,129,0.22)] transition hover:bg-emerald-700"
                          @click="saveTimes"
                        >
                          Simpan
                        </button>
                      </div>

                      <p class="mt-2 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                        Pisahkan dengan koma. Nilai tidak valid akan diabaikan otomatis oleh sistem.
                      </p>
                    </div>

                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div class="rounded-3xl border border-slate-100 bg-slate-50 p-4 dark:border-white/10 dark:bg-neutral-950">
                        <p class="text-xs font-medium text-slate-500 dark:text-neutral-400">Last Reset At</p>
                        <p class="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{{ lastResetFull }}</p>
                      </div>

                      <div class="rounded-3xl border border-slate-100 bg-slate-50 p-4 dark:border-white/10 dark:bg-neutral-950">
                        <p class="text-xs font-medium text-slate-500 dark:text-neutral-400">Last Reset Key</p>
                        <p class="mt-2 break-all font-mono text-sm font-semibold text-slate-900 dark:text-white">
                          {{ settings.lastResetKey || '—' }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-col-reverse gap-2 border-t border-slate-100 px-6 py-5 dark:border-white/10 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(225,29,72,0.18)] transition hover:bg-rose-700"
                      @click="confirmReset"
                    >
                      Reset Sekarang
                    </button>

                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      @click="openSettings = false"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </Transition>
      </Teleport>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useAbsensi } from '~/composables/data/useAbsensi'

const {
  loading,
  error,
  current,
  live,
  settings,
  currentCount,
  fetchCurrent,
  fetchSettings,
  saveSettings,
  subscribeLive,
  resetSession,
  shouldResetNow,
  markPresentBySantriId,
  markPresentManual
} = useAbsensi()

const search = ref('')
const sortKey = ref<'time_desc' | 'time_asc' | 'name_asc' | 'name_desc'>('time_desc')
const page = ref(1)
const pageSize = ref(25)
const fileInput = ref<HTMLInputElement | null>(null)
const openSettings = ref(false)
const timesInput = ref('')

let timer: number | null = null
let unsub: null | (() => void) = null

const presentCount = computed(() => currentCount.value)

const resetTimesLabel = computed(() => {
  const times = settings.value.resetTimes || []
  return times.length ? times.join(', ') : '—'
})

const liveReversed = computed(() => {
  return [...live.value].sort((a, b) => (b.ts || 0) - (a.ts || 0))
})

const rows = computed(() => {
  const out: Array<{
    key: string
    name: string
    santriId?: string
    maskan?: string
    kamar?: string
    ts: number
    by?: string
  }> = []

  const currentMap = current.value || {}

  for (const key of Object.keys(currentMap)) {
    const value = currentMap[key] || {}

    out.push({
      key,
      name: String(value.name || 'Santri Fulan'),
      santriId: value.santriId ? String(value.santriId) : undefined,
      maskan: value.maskan ? String(value.maskan) : undefined,
      kamar: value.kamar ? String(value.kamar) : undefined,
      ts: typeof value.ts === 'number' ? value.ts : Date.now(),
      by: String(value.by || 'manual')
    })
  }

  return out
})

const filteredRows = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  if (!keyword) return rows.value

  return rows.value.filter((row) => {
    return [row.name, row.maskan, row.kamar, row.santriId]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword))
  })
})

const sortedRows = computed(() => {
  const list = [...filteredRows.value]

  switch (sortKey.value) {
    case 'time_asc':
      return list.sort((a, b) => a.ts - b.ts)

    case 'name_asc':
      return list.sort((a, b) => a.name.localeCompare(b.name, 'id'))

    case 'name_desc':
      return list.sort((a, b) => b.name.localeCompare(a.name, 'id'))

    case 'time_desc':
    default:
      return list.sort((a, b) => b.ts - a.ts)
  }
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(sortedRows.value.length / pageSize.value))
})

const startIndex = computed(() => {
  return (page.value - 1) * pageSize.value
})

const pagedRows = computed(() => {
  return sortedRows.value.slice(startIndex.value, startIndex.value + pageSize.value)
})

const lastResetLabel = computed(() => {
  if (!settings.value.lastResetAt) return '—'

  return new Date(settings.value.lastResetAt).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
})

const lastResetFull = computed(() => {
  if (!settings.value.lastResetAt) return '—'

  const date = new Date(settings.value.lastResetAt)

  return `${date.toISOString()} (${date.toLocaleString('id-ID')})`
})

watch([sortedRows, pageSize], () => {
  page.value = 1
})

watch(totalPages, (value) => {
  if (page.value > value) page.value = value
})

watch(openSettings, (value) => {
  if (value) {
    timesInput.value = (settings.value.resetTimes || []).join(', ')
  }
})

function formatTime(ts?: number) {
  const date = ts ? new Date(ts) : new Date()

  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

async function refresh() {
  await Promise.all([
    fetchSettings(),
    fetchCurrent()
  ])
}

async function confirmReset() {
  if (typeof window === 'undefined') return

  const ok = window.confirm('Yakin reset sesi sekarang? Data current akan dipindahkan ke history.')

  if (!ok) return

  await resetSession({ resetBy: 'manual' })
  await refresh()

  openSettings.value = false
}

function exportCSV() {
  const headers = ['key', 'name', 'santriId', 'maskan', 'kamar', 'time', 'by']
  const lines = [headers.join(',')]

  for (const row of sortedRows.value) {
    const line = [
      row.key,
      csvEsc(row.name),
      csvEsc(row.santriId || ''),
      csvEsc(row.maskan || ''),
      csvEsc(row.kamar || ''),
      new Date(row.ts).toISOString(),
      csvEsc(row.by || '')
    ].join(',')

    lines.push(line)
  }

  const blob = new Blob(['\ufeff' + lines.join('\n')], {
    type: 'text/csv;charset=utf-8;'
  })

  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = `attendance_current_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`
  anchor.click()

  URL.revokeObjectURL(url)
}

function csvEsc(value: string) {
  const needsEscape = /[",\n]/.test(value)

  return needsEscape
    ? `"${value.replace(/"/g, '""')}"`
    : value
}

async function onImportFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  try {
    const text = await file.text()
    const csvRows = parseCSV(text)
    const header = csvRows.shift() || []

    const indexMap = {
      name: header.findIndex((item) => /name|nama/i.test(item)),
      santriId: header.findIndex((item) => /santri.?id/i.test(item)),
      maskan: header.findIndex((item) => /maskan/i.test(item)),
      kamar: header.findIndex((item) => /kamar/i.test(item)),
      deviceId: header.findIndex((item) => /device.?id/i.test(item))
    }

    let count = 0

    for (const row of csvRows) {
      const name = valAt(row, indexMap.name) || 'Santri Fulan'
      const santriId = valAt(row, indexMap.santriId)
      const maskan = valAt(row, indexMap.maskan)
      const kamar = valAt(row, indexMap.kamar)
      const deviceId = valAt(row, indexMap.deviceId)

      if (santriId) {
        await markPresentBySantriId(santriId, name, {
          maskan,
          kamar,
          deviceId
        })

        count += 1
        continue
      }

      if (name) {
        await markPresentManual(name, {
          maskan,
          kamar,
          deviceId
        })

        count += 1
      }
    }

    await refresh()

    window.alert(`Import selesai: ${count} baris ditandai hadir.`)
  } catch (err) {
    console.error(err)
    window.alert('Gagal import CSV.')
  } finally {
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

function parseCSV(text: string): string[][] {
  const lines = text.split(/\r?\n/).filter(Boolean)
  const result: string[][] = []

  for (const line of lines) {
    const row: string[] = []
    let currentValue = ''
    let quoted = false

    for (let index = 0; index < line.length; index += 1) {
      const char = line[index]

      if (quoted) {
        if (char === '"') {
          if (line[index + 1] === '"') {
            currentValue += '"'
            index += 1
          } else {
            quoted = false
          }
        } else {
          currentValue += char
        }

        continue
      }

      if (char === '"') {
        quoted = true
        continue
      }

      if (char === ',') {
        row.push(currentValue)
        currentValue = ''
        continue
      }

      currentValue += char
    }

    row.push(currentValue)
    result.push(row.map((item) => item.trim()))
  }

  return result
}

function valAt(row: string[], index: number) {
  return index >= 0
    ? (row[index] || '').trim()
    : ''
}

async function saveTimes() {
  const times = timesInput.value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  await saveSettings({ resetTimes: times })

  timesInput.value = (settings.value.resetTimes || []).join(', ')

  window.alert('Reset times berhasil disimpan.')
}

onMounted(async () => {
  await refresh()

  unsub = subscribeLive(50)

  timesInput.value = (settings.value.resetTimes || []).join(', ')

  timer = window.setInterval(async () => {
    try {
      if (shouldResetNow()) {
        await resetSession({ resetBy: 'auto' })
        await refresh()
      }
    } catch (err) {
      console.error(err)
    }
  }, 30000)
})

onBeforeUnmount(() => {
  if (unsub) unsub()
  if (timer) window.clearInterval(timer)
})
</script>