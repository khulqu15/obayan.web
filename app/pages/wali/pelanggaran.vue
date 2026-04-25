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
            Discipline Monitoring
          </div>

          <h1 class="mt-4 text-2xl font-black tracking-tight md:text-4xl">
            Pelanggaran Santri
          </h1>

          <p class="mt-2 max-w-xl text-sm leading-6 text-green-50/90 md:text-base">
            Pantau catatan kedisiplinan, poin pelanggaran, status pembinaan, pola berulang, dan rekomendasi pendampingan santri.
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
              <div class="text-lg font-black">{{ violationItems.length }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Total</div>
            </div>

            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ totalPoints }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Poin</div>
            </div>

            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ riskScore }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Risk</div>
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
      <div v-if="loading" class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="i in 4"
          :key="i"
          class="h-36 animate-pulse rounded-[28px] bg-slate-100 dark:bg-neutral-800"
        ></div>
      </div>

      <template v-else>
        <!-- Summary -->
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Total Catatan
                </div>

                <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {{ violationItems.length }}
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Semua catatan pelanggaran santri.
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <Icon icon="ph:clipboard-text-duotone" class="h-6 w-6" />
              </div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Total Poin
                </div>

                <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {{ totalPoints }}
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Akumulasi poin kedisiplinan.
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                <Icon icon="ph:warning-circle-duotone" class="h-6 w-6" />
              </div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Bulan Ini
                </div>

                <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {{ monthlyItems.length }}
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Catatan dalam bulan berjalan.
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <Icon icon="solar:calendar-line-duotone" class="h-6 w-6" />
              </div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Level Risiko
                </div>

                <div class="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                  {{ riskLevel.label }}
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  {{ riskLevel.short }}
                </p>
              </div>

              <div :class="['grid h-12 w-12 shrink-0 place-items-center rounded-2xl', riskLevel.iconClass]">
                <Icon :icon="riskLevel.icon" class="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        <!-- Advanced AI Insight -->
        <div class="grid gap-4 xl:grid-cols-[1fr,0.86fr]">
          <div class="relative overflow-hidden rounded-[32px] border border-green-100 bg-gradient-to-br from-slate-950 via-green-950 to-green-900 p-5 text-white shadow-sm dark:border-neutral-800">
            <div class="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-green-300/20 blur-3xl"></div>

            <div class="relative z-10">
              <div class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black ring-1 ring-white/15">
                <Icon icon="ph:sparkle-duotone" class="h-4 w-4" />
                Advanced AI Discipline Insight
              </div>

              <h2 class="mt-4 text-xl font-black">
                {{ aiInsight.title }}
              </h2>

              <p class="mt-2 text-sm leading-6 text-white/75">
                {{ aiInsight.desc }}
              </p>

              <div class="mt-5">
                <div class="flex items-center justify-between text-xs font-bold text-white/70">
                  <span>Behavior Risk Score</span>
                  <span>{{ riskScore }}/100</span>
                </div>

                <div class="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    :class="['h-full rounded-full transition-all duration-500', riskScoreBarClass]"
                    :style="{ width: riskScore + '%' }"
                  ></div>
                </div>
              </div>

              <div class="mt-5 grid gap-3 sm:grid-cols-3">
                <div class="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                  <div class="text-lg font-black">{{ trendAnalysis.label }}</div>
                  <div class="mt-0.5 text-[11px] font-bold text-white/65">Tren 30 Hari</div>
                </div>

                <div class="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                  <div class="truncate text-lg font-black">{{ dominantCategory || '—' }}</div>
                  <div class="mt-0.5 text-[11px] font-bold text-white/65">Pola Dominan</div>
                </div>

                <div class="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                  <div class="text-lg font-black">{{ unresolvedItems.length }}</div>
                  <div class="mt-0.5 text-[11px] font-bold text-white/65">Belum Selesai</div>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Rekomendasi Pembinaan
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Saran otomatis berdasarkan pola pelanggaran.
                </p>
              </div>

              <span :class="['rounded-full px-3 py-1.5 text-xs font-black', riskLevel.badgeClass]">
                {{ riskLevel.label }}
              </span>
            </div>

            <div class="space-y-3">
              <div
                v-for="item in aiRecommendations"
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

        <!-- Pattern Analytics -->
        <div class="grid gap-4 xl:grid-cols-[0.9fr,1.1fr]">
          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="mb-4">
              <h2 class="text-base font-black text-slate-900 dark:text-white">
                Distribusi Level
              </h2>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                Komposisi pelanggaran berdasarkan tingkat.
              </p>
            </div>

            <div class="space-y-4">
              <div
                v-for="item in severityDistribution"
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
                Pola Pelanggaran Berulang
              </h2>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                Kategori yang paling sering muncul.
              </p>
            </div>

            <div v-if="categoryPatterns.length === 0" class="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400">
              Belum ada pola yang bisa dianalisis.
            </div>

            <div v-else class="grid gap-3 sm:grid-cols-2">
              <div
                v-for="item in categoryPatterns.slice(0, 4)"
                :key="item.category"
                class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <div class="truncate font-black text-slate-900 dark:text-white">
                      {{ item.category }}
                    </div>
                    <div class="mt-1 text-xs font-bold text-slate-500 dark:text-neutral-400">
                      {{ item.count }} catatan • {{ item.points }} poin
                    </div>
                  </div>

                  <span :class="['rounded-full px-2.5 py-1 text-xs font-black', item.count >= 3 ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300' : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300']">
                    {{ item.count >= 3 ? 'Berulang' : 'Normal' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Toolbar -->
        <div class="rounded-[32px] border border-white/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr,0.6fr,0.6fr,0.6fr,0.55fr,0.5fr]">
            <div class="relative">
              <input
                v-model="filters.q"
                type="text"
                placeholder="Cari pelanggaran, kategori, sanksi, pelapor, catatan..."
                class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:ring-green-500/10"
              />
              <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Icon icon="lucide:search" class="h-4 w-4" />
              </span>
            </div>

            <select
              v-model="filters.severity"
              class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="semua">Semua Level</option>
              <option value="ringan">Ringan</option>
              <option value="sedang">Sedang</option>
              <option value="berat">Berat</option>
              <option value="sangat berat">Sangat Berat</option>
            </select>

            <select
              v-model="filters.status"
              class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="semua">Semua Status</option>
              <option value="proses">Proses</option>
              <option value="selesai">Selesai</option>
              <option value="ditindaklanjuti">Ditindaklanjuti</option>
            </select>

            <select
              v-model="filters.period"
              class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="semua">Semua Periode</option>
              <option value="hari-ini">Hari Ini</option>
              <option value="minggu-ini">Minggu Ini</option>
              <option value="bulan-ini">Bulan Ini</option>
              <option value="30-hari">30 Hari</option>
              <option value="tahun-ini">Tahun Ini</option>
            </select>

            <select
              v-model="filters.sort"
              class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="terbaru">Terbaru</option>
              <option value="terlama">Terlama</option>
              <option value="poin-tertinggi">Poin Tertinggi</option>
              <option value="level">Level</option>
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
                  Riwayat Pelanggaran
                </h2>

                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Menampilkan {{ paginatedRows.length }} dari {{ visibleRows.length }} data.
                </p>
              </div>

              <div class="flex flex-wrap gap-2">
                <select
                  v-model.number="pageSize"
                  class="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                >
                  <option :value="5">5 / halaman</option>
                  <option :value="10">10 / halaman</option>
                  <option :value="20">20 / halaman</option>
                </select>

                <button
                  type="button"
                  @click="exportCSV"
                  class="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <Icon icon="ph:download-simple-duotone" class="h-4 w-4" />
                  Export CSV
                </button>
              </div>
            </div>

            <div
              v-if="visibleRows.length === 0"
              class="p-10 text-center"
            >
              <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <Icon icon="ph:shield-check-duotone" class="h-8 w-8" />
              </div>

              <h3 class="mt-4 text-lg font-black text-slate-900 dark:text-white">
                Data pelanggaran tidak ditemukan
              </h3>

              <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                Coba ubah filter atau tunggu data dari admin/pengurus.
              </p>
            </div>

            <div v-else>
              <!-- Desktop Table -->
              <div class="hidden overflow-x-auto lg:block">
                <table class="w-full min-w-[920px] text-left">
                  <thead>
                    <tr class="border-b border-slate-100 text-xs uppercase tracking-[0.12em] text-slate-400 dark:border-neutral-800">
                      <th class="px-5 py-4 font-black">Pelanggaran</th>
                      <th class="px-5 py-4 font-black">Kategori</th>
                      <th class="px-5 py-4 font-black">Tanggal</th>
                      <th class="px-5 py-4 font-black">Level</th>
                      <th class="px-5 py-4 font-black">Poin</th>
                      <th class="px-5 py-4 font-black">Status</th>
                      <th class="px-5 py-4 text-right font-black">Aksi</th>
                    </tr>
                  </thead>

                  <tbody class="divide-y divide-slate-100 dark:divide-neutral-800">
                    <tr
                      v-for="row in paginatedRows"
                      :key="row.id"
                      class="transition hover:bg-slate-50/70 dark:hover:bg-neutral-800/40"
                    >
                      <td class="px-5 py-4">
                        <div class="flex items-center gap-3">
                          <div :class="['grid h-11 w-11 shrink-0 place-items-center rounded-2xl', severityIconClass(row.severity)]">
                            <Icon :icon="severityIcon(row.severity)" class="h-5 w-5" />
                          </div>

                          <div class="min-w-0">
                            <div class="line-clamp-1 font-black text-slate-900 dark:text-white">
                              {{ row.title }}
                            </div>
                            <div class="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-neutral-400">
                              {{ row.action || row.sanction || 'Belum ada tindak lanjut.' }}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td class="px-5 py-4">
                        <span class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700 dark:bg-neutral-800 dark:text-neutral-300">
                          {{ row.category }}
                        </span>
                      </td>

                      <td class="px-5 py-4 text-sm font-bold text-slate-600 dark:text-neutral-300">
                        {{ formatDate(row.date) }}
                      </td>

                      <td class="px-5 py-4">
                        <span :class="['rounded-full px-3 py-1.5 text-xs font-black capitalize', severityBadgeClass(row.severity)]">
                          {{ row.severity }}
                        </span>
                      </td>

                      <td class="px-5 py-4">
                        <span class="text-lg font-black text-slate-900 dark:text-white">
                          {{ row.points }}
                        </span>
                      </td>

                      <td class="px-5 py-4">
                        <span :class="['rounded-full px-3 py-1.5 text-xs font-black capitalize', statusBadgeClass(row.status)]">
                          {{ row.status }}
                        </span>
                      </td>

                      <td class="px-5 py-4 text-right">
                        <button
                          type="button"
                          @click="openDetail(row)"
                          class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Mobile Cards -->
              <div class="divide-y divide-slate-100 dark:divide-neutral-800 lg:hidden">
                <div
                  v-for="row in paginatedRows"
                  :key="row.id"
                  class="p-5"
                >
                  <div class="flex items-start gap-3">
                    <div :class="['grid h-12 w-12 shrink-0 place-items-center rounded-2xl', severityIconClass(row.severity)]">
                      <Icon :icon="severityIcon(row.severity)" class="h-6 w-6" />
                    </div>

                    <div class="min-w-0 flex-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <h3 class="line-clamp-2 font-black text-slate-900 dark:text-white">
                          {{ row.title }}
                        </h3>

                        <span :class="['rounded-full px-2.5 py-1 text-[11px] font-black capitalize', severityBadgeClass(row.severity)]">
                          {{ row.severity }}
                        </span>
                      </div>

                      <div class="mt-1 text-xs font-bold text-slate-500 dark:text-neutral-400">
                        {{ formatDate(row.date) }} • {{ row.category }} • {{ row.points }} poin
                      </div>

                      <p class="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                        {{ row.action || row.sanction || row.note || 'Belum ada tindak lanjut.' }}
                      </p>

                      <div class="mt-4 flex items-center justify-between gap-2">
                        <span :class="['rounded-full px-3 py-1.5 text-xs font-black capitalize', statusBadgeClass(row.status)]">
                          {{ row.status }}
                        </span>

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

              <!-- Pagination -->
              <div class="flex flex-col gap-3 border-t border-slate-100 p-5 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
                <p class="text-xs font-bold text-slate-500 dark:text-neutral-400">
                  Halaman {{ currentPage }} dari {{ totalPages }}
                </p>

                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    :disabled="currentPage <= 1"
                    @click="currentPage--"
                    class="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    Prev
                  </button>

                  <button
                    type="button"
                    :disabled="currentPage >= totalPages"
                    @click="currentPage++"
                    class="inline-flex h-10 items-center justify-center rounded-2xl bg-green-600 px-4 text-xs font-black text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Panel -->
          <div class="space-y-4">
            <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="mb-4">
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Catatan Terbaru
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Pelanggaran terbaru yang perlu dipantau.
                </p>
              </div>

              <div v-if="latestItems.length === 0" class="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400">
                Belum ada catatan terbaru.
              </div>

              <div v-else class="space-y-3">
                <button
                  v-for="row in latestItems"
                  :key="row.id"
                  type="button"
                  @click="openDetail(row)"
                  class="flex w-full items-start gap-3 rounded-[24px] border border-slate-100 bg-slate-50 p-4 text-left transition hover:bg-green-50 dark:border-neutral-800 dark:bg-neutral-800/60 dark:hover:bg-green-900/10"
                >
                  <div :class="['grid h-10 w-10 shrink-0 place-items-center rounded-2xl', severityIconClass(row.severity)]">
                    <Icon :icon="severityIcon(row.severity)" class="h-5 w-5" />
                  </div>

                  <div class="min-w-0">
                    <div class="line-clamp-1 font-black text-slate-900 dark:text-white">
                      {{ row.title }}
                    </div>
                    <div class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                      {{ formatDate(row.date) }} • {{ row.points }} poin
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="mb-4">
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Tindak Lanjut
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Catatan yang belum selesai.
                </p>
              </div>

              <div v-if="unresolvedItems.length === 0" class="rounded-[24px] border border-dashed border-green-200 bg-green-50 p-6 text-center text-sm font-bold text-green-700 dark:border-green-900/30 dark:bg-green-900/10 dark:text-green-300">
                Semua catatan sudah selesai atau tidak membutuhkan tindak lanjut.
              </div>

              <div v-else class="space-y-3">
                <button
                  v-for="row in unresolvedItems.slice(0, 5)"
                  :key="row.id"
                  type="button"
                  @click="openDetail(row)"
                  class="w-full rounded-[24px] border border-amber-100 bg-amber-50/70 p-4 text-left transition hover:bg-amber-50 dark:border-amber-900/30 dark:bg-amber-900/10"
                >
                  <div class="font-black text-slate-900 dark:text-white">
                    {{ row.title }}
                  </div>
                  <p class="mt-1 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                    {{ row.action || row.sanction || 'Perlu tindak lanjut dari wali/pengurus.' }}
                  </p>
                </button>
              </div>
            </div>

            <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="mb-4">
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Data Santri
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Santri yang sedang dipantau.
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

                <button
                  type="button"
                  @click="exportCSV"
                  class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <Icon icon="ph:download-simple-duotone" class="h-5 w-5" />
                  Export Pelanggaran
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>

    <!-- Detail Modal -->
    <div
      v-if="detailOpen && selectedViolation"
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
                  <span :class="['rounded-full px-3 py-1.5 text-xs font-black capitalize', severityBadgeClass(selectedViolation.severity)]">
                    {{ selectedViolation.severity }}
                  </span>

                  <span :class="['rounded-full px-3 py-1.5 text-xs font-black capitalize', statusBadgeClass(selectedViolation.status)]">
                    {{ selectedViolation.status }}
                  </span>
                </div>

                <h3 class="mt-3 text-xl font-black text-slate-900 dark:text-white md:text-2xl">
                  {{ selectedViolation.title }}
                </h3>

                <p class="mt-1 text-sm text-slate-500 dark:text-neutral-400">
                  {{ formatDate(selectedViolation.date) }} • {{ selectedViolation.category }} • {{ selectedViolation.points }} poin
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
              <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                Keterangan Pelanggaran
              </div>

              <p class="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-neutral-300">
                {{ selectedViolation.description || selectedViolation.note || 'Belum ada keterangan detail.' }}
              </p>
            </div>

            <div class="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              <div class="rounded-[24px] border border-slate-100 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">Poin</div>
                <div class="mt-1 text-xl font-black text-slate-900 dark:text-white">
                  {{ selectedViolation.points }}
                </div>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">Level</div>
                <div class="mt-1 text-xl font-black capitalize text-slate-900 dark:text-white">
                  {{ selectedViolation.severity }}
                </div>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">Status</div>
                <div class="mt-1 text-xl font-black capitalize text-slate-900 dark:text-white">
                  {{ selectedViolation.status }}
                </div>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">Pelapor</div>
                <div class="mt-1 text-sm font-black text-slate-900 dark:text-white">
                  {{ selectedViolation.reporter || '—' }}
                </div>
              </div>
            </div>

            <div class="grid gap-3 md:grid-cols-2">
              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Sanksi / Konsekuensi
                </div>

                <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                  {{ selectedViolation.sanction || 'Belum ada sanksi tercatat.' }}
                </p>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Tindak Lanjut
                </div>

                <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                  {{ selectedViolation.action || 'Belum ada tindak lanjut tercatat.' }}
                </p>
              </div>
            </div>

            <div class="rounded-[24px] border border-green-100 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/10">
              <div class="text-xs font-black uppercase tracking-[0.14em] text-green-700 dark:text-green-300">
                Rekomendasi Wali
              </div>

              <p class="mt-2 text-sm leading-6 text-slate-700 dark:text-neutral-200">
                {{ recommendationForViolation(selectedViolation) }}
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
type Severity = 'ringan' | 'sedang' | 'berat' | 'sangat berat'
type ViolationStatus = 'proses' | 'selesai' | 'ditindaklanjuti'

type SantriProfile = AnyRow & {
  id: string
  _uid: string
  _path?: string
}

type ViolationItem = {
  id: string
  title: string
  category: string
  severity: Severity
  status: ViolationStatus
  points: number
  date: number
  reporter: string
  description: string
  sanction: string
  action: string
  note: string
  raw: AnyRow
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
const violationRawRows = ref<AnyRow[]>([])

const activeTab = ref<'semua' | 'ringan' | 'sedang' | 'berat' | 'sangat berat' | 'proses'>('semua')

const filters = ref({
  q: '',
  severity: 'semua',
  status: 'semua',
  period: 'bulan-ini',
  sort: 'terbaru'
})

const currentPage = ref(1)
const pageSize = ref(10)

const detailOpen = ref(false)
const selectedViolation = ref<ViolationItem | null>(null)

let unsubscribers: Array<() => void> = []
let stopSessionWatch: (() => void) | null = null
const bucketMap = new Map<string, AnyRow[]>()

const currentSantri = computed(() => {
  return santriProfiles.value.find((item) => item.id === selectedSantriId.value) || santriProfiles.value[0] || null
})

const violationRows = computed(() => {
  return filterRowsForCurrentSantri(violationRawRows.value)
})

const violationItems = computed<ViolationItem[]>(() => {
  return violationRows.value.map((row, index) => normalizeViolation(row, index))
})

const monthlyItems = computed(() => {
  const now = new Date()

  return violationItems.value.filter((item) => {
    const date = new Date(item.date)
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  })
})

const recent30Items = computed(() => {
  const start = Date.now() - 30 * 24 * 60 * 60 * 1000
  return violationItems.value.filter((item) => item.date >= start)
})

const previous30Items = computed(() => {
  const end = Date.now() - 30 * 24 * 60 * 60 * 1000
  const start = Date.now() - 60 * 24 * 60 * 60 * 1000
  return violationItems.value.filter((item) => item.date >= start && item.date < end)
})

const unresolvedItems = computed(() => {
  return violationItems.value.filter((item) => item.status !== 'selesai')
})

const totalPoints = computed(() => {
  return violationItems.value.reduce((sum, item) => sum + item.points, 0)
})

const recentPoints = computed(() => {
  return recent30Items.value.reduce((sum, item) => sum + item.points, 0)
})

const severeItems = computed(() => {
  return violationItems.value.filter((item) => item.severity === 'berat' || item.severity === 'sangat berat')
})

const riskScore = computed(() => {
  let score = 0

  score += Math.min(35, totalPoints.value * 1.4)
  score += Math.min(25, recentPoints.value * 2)
  score += Math.min(20, severeItems.value.length * 8)
  score += Math.min(10, unresolvedItems.value.length * 3)
  score += Math.min(10, repeatedCategoryPenalty.value)

  return Math.max(0, Math.min(100, Math.round(score)))
})

const repeatedCategoryPenalty = computed(() => {
  return categoryPatterns.value
    .filter((item) => item.count >= 3)
    .reduce((sum, item) => sum + item.count, 0)
})

const riskLevel = computed(() => {
  if (riskScore.value >= 80) {
    return {
      label: 'Kritis',
      short: 'Butuh perhatian serius.',
      icon: 'ph:warning-octagon-duotone',
      iconClass: 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300',
      badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
    }
  }

  if (riskScore.value >= 60) {
    return {
      label: 'Tinggi',
      short: 'Perlu pendampingan rutin.',
      icon: 'ph:warning-circle-duotone',
      iconClass: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
      badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
    }
  }

  if (riskScore.value >= 35) {
    return {
      label: 'Sedang',
      short: 'Perlu dipantau berkala.',
      icon: 'ph:shield-warning-duotone',
      iconClass: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
      badgeClass: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    }
  }

  return {
    label: 'Rendah',
    short: 'Kondisi relatif aman.',
    icon: 'ph:shield-check-duotone',
    iconClass: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
    badgeClass: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  }
})

const riskScoreBarClass = computed(() => {
  if (riskScore.value >= 80) return 'bg-gradient-to-r from-rose-400 to-red-500'
  if (riskScore.value >= 60) return 'bg-gradient-to-r from-amber-300 to-orange-500'
  if (riskScore.value >= 35) return 'bg-gradient-to-r from-green-300 to-cyan-400'
  return 'bg-gradient-to-r from-lime-300 to-green-400'
})

const trendAnalysis = computed(() => {
  const current = recent30Items.value.length
  const previous = previous30Items.value.length

  if (current === 0 && previous === 0) {
    return {
      label: 'Stabil',
      desc: 'Tidak ada catatan pelanggaran dalam 60 hari terakhir.'
    }
  }

  if (current > previous) {
    return {
      label: 'Naik',
      desc: `Pelanggaran 30 hari terakhir naik dari ${previous} menjadi ${current} catatan.`
    }
  }

  if (current < previous) {
    return {
      label: 'Turun',
      desc: `Pelanggaran 30 hari terakhir turun dari ${previous} menjadi ${current} catatan.`
    }
  }

  return {
    label: 'Stabil',
    desc: `Jumlah catatan 30 hari terakhir sama dengan periode sebelumnya, yaitu ${current} catatan.`
  }
})

const categoryPatterns = computed(() => {
  const map = new Map<string, { category: string; count: number; points: number }>()

  for (const item of violationItems.value) {
    const key = item.category || 'Lainnya'
    const current = map.get(key) || { category: key, count: 0, points: 0 }

    current.count += 1
    current.points += item.points

    map.set(key, current)
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count || b.points - a.points)
})

const dominantCategory = computed(() => {
  return categoryPatterns.value[0]?.category || ''
})

const aiInsight = computed(() => {
  if (!violationItems.value.length) {
    return {
      title: 'Belum ada catatan pelanggaran',
      desc: 'Santri belum memiliki catatan pelanggaran yang terdeteksi. Tetap lakukan pemantauan ringan agar kedisiplinan tetap terjaga.'
    }
  }

  if (riskScore.value >= 80) {
    return {
      title: 'Risiko kedisiplinan berada pada level kritis',
      desc: `Terdapat ${severeItems.value.length} catatan berat/sangat berat, ${unresolvedItems.value.length} belum selesai, dan pola dominan pada kategori ${dominantCategory.value || 'tertentu'}. Perlu komunikasi aktif antara wali, pengurus, dan santri.`
    }
  }

  if (riskScore.value >= 60) {
    return {
      title: 'Risiko kedisiplinan cukup tinggi',
      desc: `${trendAnalysis.value.desc} Fokus utama adalah menurunkan frekuensi pelanggaran dan menyelesaikan tindak lanjut yang masih terbuka.`
    }
  }

  if (riskScore.value >= 35) {
    return {
      title: 'Kedisiplinan perlu dipantau berkala',
      desc: `Ada beberapa catatan yang perlu diperhatikan, terutama pada kategori ${dominantCategory.value || 'tertentu'}. Pendampingan ringan dan evaluasi rutin disarankan.`
    }
  }

  return {
    title: 'Kondisi kedisiplinan relatif aman',
    desc: 'Catatan pelanggaran masih rendah. Tetap berikan apresiasi, penguatan kebiasaan baik, dan pemantauan berkala.'
  }
})

const aiRecommendations = computed<InsightItem[]>(() => {
  const items: InsightItem[] = []

  if (!violationItems.value.length) {
    return [
      {
        title: 'Pertahankan kebiasaan baik',
        desc: 'Belum ada catatan pelanggaran. Wali dapat tetap memberi apresiasi dan mengingatkan santri menjaga adab harian.',
        icon: 'ph:shield-check-duotone',
        priority: 'Rendah',
        cardClass: 'border-green-100 bg-green-50/70 dark:border-green-900/30 dark:bg-green-900/10',
        iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
      }
    ]
  }

  if (riskScore.value >= 60) {
    items.push({
      title: 'Lakukan komunikasi wali-pengurus',
      desc: 'Diskusikan penyebab utama pelanggaran, kondisi santri, dan strategi pembinaan yang konsisten di rumah maupun pondok.',
      icon: 'ph:chat-circle-text-duotone',
      priority: riskScore.value >= 80 ? 'Sangat Tinggi' : 'Tinggi',
      cardClass: 'border-rose-100 bg-rose-50/70 dark:border-rose-900/30 dark:bg-rose-900/10',
      iconClass: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
    })
  }

  if (unresolvedItems.value.length) {
    items.push({
      title: 'Selesaikan tindak lanjut terbuka',
      desc: `${unresolvedItems.value.length} catatan belum selesai. Prioritaskan penyelesaian sanksi, pembinaan, atau klarifikasi agar tidak menumpuk.`,
      icon: 'ph:list-checks-duotone',
      priority: 'Tinggi',
      cardClass: 'border-amber-100 bg-amber-50/70 dark:border-amber-900/30 dark:bg-amber-900/10',
      iconClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
    })
  }

  if (dominantCategory.value) {
    items.push({
      title: `Fokus pada kategori ${dominantCategory.value}`,
      desc: 'Kategori ini paling sering muncul. Buat target perubahan perilaku yang spesifik, kecil, dan mudah dievaluasi setiap pekan.',
      icon: 'ph:target-duotone',
      priority: categoryPatterns.value[0]?.count >= 3 ? 'Tinggi' : 'Sedang',
      cardClass: 'border-green-100 bg-green-50/70 dark:border-green-900/30 dark:bg-green-900/10',
      iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })
  }

  if (trendAnalysis.value.label === 'Naik') {
    items.push({
      title: 'Tren pelanggaran meningkat',
      desc: 'Catatan 30 hari terakhir meningkat. Perlu evaluasi kebiasaan harian, pergaulan, jadwal belajar, dan kedisiplinan ibadah.',
      icon: 'ph:trend-up-duotone',
      priority: 'Tinggi',
      cardClass: 'border-orange-100 bg-orange-50/70 dark:border-orange-900/30 dark:bg-orange-900/10',
      iconClass: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300'
    })
  }

  if (items.length < 3) {
    items.push({
      title: 'Buat evaluasi mingguan ringan',
      desc: 'Gunakan pendekatan tenang: tanyakan kendala, sepakati target kecil, dan beri apresiasi saat ada perbaikan.',
      icon: 'ph:calendar-check-duotone',
      priority: 'Sedang',
      cardClass: 'border-green-100 bg-green-50/70 dark:border-green-900/30 dark:bg-green-900/10',
      iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })
  }

  return items.slice(0, 5)
})

const severityDistribution = computed(() => {
  const total = violationItems.value.length || 1
  const ringan = violationItems.value.filter((item) => item.severity === 'ringan').length
  const sedang = violationItems.value.filter((item) => item.severity === 'sedang').length
  const berat = violationItems.value.filter((item) => item.severity === 'berat').length
  const sangatBerat = violationItems.value.filter((item) => item.severity === 'sangat berat').length

  return [
    {
      label: 'Ringan',
      count: ringan,
      percent: Math.round((ringan / total) * 100),
      barClass: 'bg-green-500'
    },
    {
      label: 'Sedang',
      count: sedang,
      percent: Math.round((sedang / total) * 100),
      barClass: 'bg-green-500'
    },
    {
      label: 'Berat',
      count: berat,
      percent: Math.round((berat / total) * 100),
      barClass: 'bg-amber-500'
    },
    {
      label: 'Sangat Berat',
      count: sangatBerat,
      percent: Math.round((sangatBerat / total) * 100),
      barClass: 'bg-rose-500'
    }
  ]
})

const filteredRows = computed(() => {
  return violationItems.value.filter((item) => {
    if (filters.value.severity !== 'semua' && item.severity !== filters.value.severity) return false
    if (filters.value.status !== 'semua' && item.status !== filters.value.status) return false
    if (!periodMatches(item, filters.value.period)) return false

    if (filters.value.q.trim()) {
      const q = normalizeText(filters.value.q)
      const text = normalizeText([
        item.title,
        item.category,
        item.severity,
        item.status,
        item.description,
        item.sanction,
        item.action,
        item.note,
        item.reporter
      ].join(' '))

      if (!text.includes(q)) return false
    }

    return true
  })
})

const visibleRows = computed(() => {
  let rows = [...filteredRows.value]

  if (activeTab.value !== 'semua') {
    if (activeTab.value === 'proses') {
      rows = rows.filter((item) => item.status !== 'selesai')
    } else {
      rows = rows.filter((item) => item.severity === activeTab.value)
    }
  }

  if (filters.value.sort === 'terlama') {
    rows.sort((a, b) => a.date - b.date)
  } else if (filters.value.sort === 'poin-tertinggi') {
    rows.sort((a, b) => b.points - a.points || b.date - a.date)
  } else if (filters.value.sort === 'level') {
    rows.sort((a, b) => severityWeight(b.severity) - severityWeight(a.severity) || b.date - a.date)
  } else {
    rows.sort((a, b) => b.date - a.date)
  }

  return rows
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(visibleRows.value.length / pageSize.value))
})

const paginatedRows = computed(() => {
  const safePage = Math.min(currentPage.value, totalPages.value)
  const start = (safePage - 1) * pageSize.value

  return visibleRows.value.slice(start, start + pageSize.value)
})

const latestItems = computed(() => {
  return [...violationItems.value].sort((a, b) => b.date - a.date).slice(0, 5)
})

const tabs = computed(() => [
  {
    key: 'semua' as const,
    label: 'Semua',
    count: filteredRows.value.length
  },
  {
    key: 'ringan' as const,
    label: 'Ringan',
    count: filteredRows.value.filter((item) => item.severity === 'ringan').length
  },
  {
    key: 'sedang' as const,
    label: 'Sedang',
    count: filteredRows.value.filter((item) => item.severity === 'sedang').length
  },
  {
    key: 'berat' as const,
    label: 'Berat',
    count: filteredRows.value.filter((item) => item.severity === 'berat').length
  },
  {
    key: 'sangat berat' as const,
    label: 'Sangat Berat',
    count: filteredRows.value.filter((item) => item.severity === 'sangat berat').length
  },
  {
    key: 'proses' as const,
    label: 'Proses',
    count: filteredRows.value.filter((item) => item.status !== 'selesai').length
  }
])

watch([visibleRows, pageSize], () => {
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  if (currentPage.value < 1) currentPage.value = 1
})

watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

watch(activeTab, () => {
  currentPage.value = 1
})

function normalizeViolation(row: AnyRow, index: number): ViolationItem {
  const points = extractPoints(row)
  const severity = extractSeverity(row, points)

  return {
    id: String(row.id || row._uid || row.key || index),
    title: String(row.title || row.judul || row.pelanggaran || row.violation || row.namaPelanggaran || row.kasus || 'Catatan Pelanggaran'),
    category: String(row.category || row.kategori || row.jenis || row.type || row.aspek || 'Lainnya'),
    severity,
    status: extractStatus(row),
    points,
    date: extractDate(row),
    reporter: String(row.reporter || row.pelapor || row.guru || row.ustadz || row.createdByName || ''),
    description: String(row.description || row.keterangan || row.detail || row.deskripsi || row.alasan || ''),
    sanction: String(row.sanction || row.sanksi || row.konsekuensi || row.punishment || ''),
    action: String(row.action || row.tindakLanjut || row.followUp || row.pembinaan || row.rekomendasi || ''),
    note: String(row.note || row.catatan || row.adminNote || ''),
    raw: row
  }
}

function extractPoints(row: AnyRow) {
  const value = row.points ?? row.poin ?? row.point ?? row.score ?? row.nilaiPelanggaran ?? row.bobot

  if (value === undefined || value === null || value === '') {
    const severityText = normalizeText(row.severity || row.level || row.tingkat || row.kategori)

    if (severityText.includes('sangat berat')) return 30
    if (severityText.includes('berat')) return 20
    if (severityText.includes('sedang')) return 10
    if (severityText.includes('ringan')) return 5

    return 5
  }

  const numberValue = Number(String(value).replace(/[^\d.-]/g, ''))

  return Number.isFinite(numberValue) ? Math.max(0, Math.round(numberValue)) : 5
}

function extractSeverity(row: AnyRow, points: number): Severity {
  const text = normalizeText(row.severity || row.level || row.tingkat || row.kategoriLevel)

  if (text.includes('sangat berat') || text.includes('kritis')) return 'sangat berat'
  if (text.includes('berat')) return 'berat'
  if (text.includes('sedang')) return 'sedang'
  if (text.includes('ringan')) return 'ringan'

  if (points >= 30) return 'sangat berat'
  if (points >= 20) return 'berat'
  if (points >= 10) return 'sedang'

  return 'ringan'
}

function extractStatus(row: AnyRow): ViolationStatus {
  const text = normalizeText(row.status || row.state || row.progress || row.tindakLanjutStatus)

  if (text.includes('selesai') || text.includes('done') || text.includes('complete')) return 'selesai'
  if (text.includes('tindak') || text.includes('follow')) return 'ditindaklanjuti'

  return 'proses'
}

function extractDate(row: AnyRow) {
  const candidates = [
    row.date,
    row.tanggal,
    row.tanggalPelanggaran,
    row.violationDate,
    row.createdAt,
    row.updatedAt,
    row.at,
    row.timestamp,
    row.time
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

function periodMatches(item: ViolationItem, period: string) {
  if (period === 'semua') return true

  const date = new Date(item.date)
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

  if (period === '30-hari') {
    return item.date >= Date.now() - 30 * 24 * 60 * 60 * 1000
  }

  if (period === 'tahun-ini') {
    return date.getFullYear() === now.getFullYear()
  }

  return true
}

function resetFilters() {
  filters.value = {
    q: '',
    severity: 'semua',
    status: 'semua',
    period: 'bulan-ini',
    sort: 'terbaru'
  }

  activeTab.value = 'semua'
  currentPage.value = 1
}

function openDetail(row: ViolationItem) {
  selectedViolation.value = row
  detailOpen.value = true
}

function closeDetail() {
  selectedViolation.value = null
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

  subscribeDeep(`${clientName}/pelanggaran`)
  subscribeDeep(`${clientName}/violations`)
  subscribeDeep(`${clientName}/discipline`)
  subscribeDeep(`${clientName}/kedisiplinan`)
  subscribeDeep(`${clientName}/catatanPelanggaran`)
}

function subscribeDeep(path: string) {
  if (!$realtimeDb) return

  const unsubscribe = onValue(dbRef($realtimeDb, path), (snap) => {
    bucketMap.set(path, flattenRecords(snap.val(), [path], 0))
    rebuildRows()
    loading.value = false
  })

  unsubscribers.push(unsubscribe)
}

function rebuildRows() {
  const rows: AnyRow[] = []

  for (const bucketRows of bucketMap.values()) {
    rows.push(...bucketRows)
  }

  violationRawRows.value = rows
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

  if (looksLikeViolationRecord(objectValue)) {
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

function looksLikeViolationRecord(row: AnyRow) {
  const keys = Object.keys(row)

  return keys.some((key) => [
    'santriId',
    'idSantri',
    'santri_id',
    'studentId',
    'namaSantri',
    'santriName',
    'santri',
    'pelanggaran',
    'violation',
    'namaPelanggaran',
    'kasus',
    'poin',
    'points',
    'point',
    'bobot',
    'severity',
    'level',
    'tingkat',
    'sanksi',
    'sanction',
    'tindakLanjut',
    'followUp',
    'pembinaan',
    'tanggalPelanggaran',
    'violationDate',
    'status'
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

function severityWeight(severity: Severity) {
  if (severity === 'sangat berat') return 4
  if (severity === 'berat') return 3
  if (severity === 'sedang') return 2
  return 1
}

function severityIcon(severity: Severity) {
  if (severity === 'sangat berat') return 'ph:warning-octagon-duotone'
  if (severity === 'berat') return 'ph:warning-circle-duotone'
  if (severity === 'sedang') return 'ph:shield-warning-duotone'
  return 'ph:info-duotone'
}

function severityIconClass(severity: Severity) {
  if (severity === 'sangat berat') return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
  if (severity === 'berat') return 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300'
  if (severity === 'sedang') return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
}

function severityBadgeClass(severity: Severity) {
  if (severity === 'sangat berat') return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
  if (severity === 'berat') return 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300'
  if (severity === 'sedang') return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
}

function statusBadgeClass(status: ViolationStatus) {
  if (status === 'selesai') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (status === 'ditindaklanjuti') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
}

function recommendationForViolation(item: ViolationItem) {
  if (item.severity === 'sangat berat' || item.severity === 'berat') {
    return 'Wali disarankan segera berkomunikasi dengan pengurus/wali kelas, memahami akar masalah, dan menyepakati langkah pembinaan yang jelas serta terukur.'
  }

  if (item.severity === 'sedang') {
    return 'Lakukan obrolan tenang dengan santri, tanyakan penyebab kejadian, lalu buat target perbaikan kecil yang dievaluasi dalam satu pekan.'
  }

  return 'Berikan pengingat ringan dan apresiasi jika santri menunjukkan perubahan positif. Fokus pada pembentukan kebiasaan baik.'
}

function formatDate(value?: number) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium'
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
    'Pelanggaran',
    'Kategori',
    'Level',
    'Poin',
    'Status',
    'Pelapor',
    'Sanksi',
    'Tindak Lanjut',
    'Catatan'
  ]

  const lines = visibleRows.value.map((row) => [
    santriNameOf(currentSantri.value),
    formatDate(row.date),
    row.title,
    row.category,
    row.severity,
    row.points,
    row.status,
    row.reporter,
    row.sanction,
    row.action,
    row.note || row.description
  ].map(toCsvCell).join(','))

  const csv = '\uFEFF' + [headers.join(','), ...lines].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })

  saveBlob(blob, 'pelanggaran_wali.csv')
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