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
            Tahfidz Progress
          </div>

          <h1 class="mt-4 text-2xl font-black tracking-tight md:text-4xl">
            Hafalan Santri
          </h1>

          <p class="mt-2 max-w-xl text-sm leading-6 text-green-50/90 md:text-base">
            Pantau setoran hafalan, murojaah, tasmi’, kualitas bacaan, dan perkembangan tahfidz santri secara realtime.
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
              <div class="text-lg font-black">{{ hafalanRows.length }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Setoran</div>
            </div>

            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ uniqueJuzCount }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Juz</div>
            </div>

            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ qualityRate }}%</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Mutqin</div>
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
        <!-- Summary -->
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Total Setoran
                </div>

                <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {{ hafalanRows.length }}
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Semua data hafalan dan murojaah.
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <Icon icon="ooui:italic-arab-keheh-jeem" class="h-6 w-6" />
              </div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Cakupan Juz
                </div>

                <div class="mt-2 flex items-end gap-1">
                  <span class="text-3xl font-black text-slate-900 dark:text-white">
                    {{ uniqueJuzCount }}
                  </span>
                  <span class="pb-1 text-xs font-bold text-slate-400 dark:text-neutral-500">/ 30</span>
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Juz yang pernah tercatat.
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-lime-50 text-lime-700 dark:bg-lime-900/20 dark:text-lime-300">
                <Icon icon="ph:book-open-text-duotone" class="h-6 w-6" />
              </div>
            </div>

            <div class="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800">
              <div
                class="h-full rounded-full bg-lime-500 transition-all duration-500"
                :style="{ width: juzProgress + '%' }"
              ></div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Kualitas Mutqin
                </div>

                <div class="mt-2 flex items-end gap-1">
                  <span class="text-3xl font-black text-slate-900 dark:text-white">
                    {{ qualityRate }}
                  </span>
                  <span class="pb-1 text-xs font-bold text-slate-400 dark:text-neutral-500">%</span>
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Rasio hafalan yang baik/mutqin.
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <Icon icon="ph:shield-check-duotone" class="h-6 w-6" />
              </div>
            </div>

            <div class="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800">
              <div
                class="h-full rounded-full bg-green-500 transition-all duration-500"
                :style="{ width: qualityRate + '%' }"
              ></div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Terakhir Setor
                </div>

                <div class="mt-2 text-xl font-black text-slate-900 dark:text-white">
                  {{ latestSetoranLabel }}
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Update hafalan terbaru.
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                <Icon icon="ph:clock-duotone" class="h-6 w-6" />
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
                AI Tahfidz Insight
              </div>

              <h2 class="mt-4 text-xl font-black">
                {{ aiSummary.title }}
              </h2>

              <p class="mt-2 text-sm leading-6 text-white/75">
                {{ aiSummary.desc }}
              </p>

              <div class="mt-5">
                <div class="flex items-center justify-between text-xs font-bold text-white/70">
                  <span>Tahfidz Health Score</span>
                  <span>{{ tahfidzHealthScore }}/100</span>
                </div>

                <div class="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-lime-300 to-green-400 transition-all duration-500"
                    :style="{ width: tahfidzHealthScore + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Rekomendasi Tahfidz
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Analisis otomatis dari pola hafalan.
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
                placeholder="Cari surah, juz, ayat, pembimbing, catatan..."
                class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:ring-green-500/10"
              />
              <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Icon icon="lucide:search" class="h-4 w-4" />
              </span>
            </div>

            <select
              v-model="filters.type"
              class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="semua">Semua Jenis</option>
              <option value="setoran">Setoran</option>
              <option value="murojaah">Murojaah</option>
              <option value="tasmi">Tasmi’</option>
            </select>

            <select
              v-model="filters.status"
              class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="semua">Semua Status</option>
              <option value="mutqin">Mutqin</option>
              <option value="lancar">Lancar</option>
              <option value="mengulang">Mengulang</option>
              <option value="perlu bimbingan">Perlu Bimbingan</option>
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
                  Riwayat Hafalan
                </h2>

                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Menampilkan {{ visibleRows.length }} data hafalan.
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
                <Icon icon="ooui:italic-arab-keheh-jeem" class="h-8 w-8" />
              </div>

              <h3 class="mt-4 text-lg font-black text-slate-900 dark:text-white">
                Data hafalan tidak ditemukan
              </h3>

              <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                Coba ubah filter atau tunggu data diinput pembimbing.
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
                    <div :class="['grid h-12 w-12 shrink-0 place-items-center rounded-2xl', hafalanIconClass(row)]">
                      <Icon :icon="hafalanIcon(row)" class="h-6 w-6" />
                    </div>

                    <div class="min-w-0">
                      <div class="flex flex-wrap items-center gap-2">
                        <h3 class="truncate text-base font-black text-slate-900 dark:text-white">
                          {{ hafalanTitle(row) }}
                        </h3>

                        <span :class="['rounded-full px-2.5 py-1 text-[11px] font-black capitalize', hafalanStatusClass(row)]">
                          {{ hafalanStatus(row) || '—' }}
                        </span>
                      </div>

                      <div class="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-neutral-400">
                        <span>{{ hafalanTypeLabel(row) }}</span>
                        <span>•</span>
                        <span>{{ formatDate(extractDate(row)) }}</span>
                        <span v-if="extractJuz(row)">•</span>
                        <span v-if="extractJuz(row)">Juz {{ extractJuz(row) }}</span>
                        <span v-if="row.pembimbing || row.guru || row.ustadz">•</span>
                        <span v-if="row.pembimbing || row.guru || row.ustadz">
                          {{ row.pembimbing || row.guru || row.ustadz }}
                        </span>
                      </div>

                      <p class="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                        {{ hafalanDescription(row) }}
                      </p>
                    </div>
                  </div>

                  <div class="shrink-0 text-left md:text-right">
                    <div class="text-2xl font-black text-slate-900 dark:text-white">
                      {{ extractScore(row) ?? '—' }}
                    </div>

                    <div class="mt-0.5 text-xs font-bold text-slate-400 dark:text-neutral-500">
                      Nilai
                    </div>

                    <button
                      type="button"
                      @click="openDetail(row)"
                      class="mt-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
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
                  Distribusi Hafalan
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Komposisi status kualitas hafalan.
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
                  Progress Juz
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Juz yang sudah pernah tercatat.
                </p>
              </div>

              <div v-if="uniqueJuzList.length === 0" class="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400">
                Belum ada data juz.
              </div>

              <div v-else class="flex flex-wrap gap-2">
                <span
                  v-for="juz in uniqueJuzList"
                  :key="juz"
                  class="rounded-2xl bg-green-50 px-3 py-2 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300"
                >
                  Juz {{ juz }}
                </span>
              </div>
            </div>

            <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="mb-4">
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Setoran Terbaru
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  5 catatan hafalan terakhir.
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
                      {{ hafalanTitle(row) }}
                    </div>

                    <div class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                      {{ formatDate(extractDate(row)) }}
                    </div>
                  </div>

                  <span :class="['shrink-0 rounded-full px-2.5 py-1 text-xs font-black capitalize', hafalanStatusClass(row)]">
                    {{ hafalanStatus(row) || '—' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>

    <!-- Detail Modal -->
    <div
      v-if="detailOpen && selectedHafalan"
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
                  <Icon icon="ooui:italic-arab-keheh-jeem" class="h-4 w-4" />
                  Detail Hafalan
                </div>

                <h3 class="mt-3 text-xl font-black text-slate-900 dark:text-white">
                  {{ hafalanTitle(selectedHafalan) }}
                </h3>

                <p class="mt-1 text-sm text-slate-500 dark:text-neutral-400">
                  {{ hafalanTypeLabel(selectedHafalan) }} • {{ formatDate(extractDate(selectedHafalan)) }}
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
            <div class="rounded-[28px] border border-green-100 bg-green-50 p-5 dark:border-green-900/30 dark:bg-green-900/10">
              <div class="text-xs font-black uppercase tracking-[0.14em] text-green-700 dark:text-green-300">
                Status Hafalan
              </div>

              <div class="mt-2 flex flex-wrap items-center gap-3">
                <span :class="['rounded-full px-3 py-1.5 text-sm font-black capitalize', hafalanStatusClass(selectedHafalan)]">
                  {{ hafalanStatus(selectedHafalan) || '—' }}
                </span>

                <span class="text-3xl font-black text-slate-900 dark:text-white">
                  {{ extractScore(selectedHafalan) ?? '—' }}
                </span>
              </div>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-xs font-bold text-slate-400">Surah / Materi</div>
                <div class="mt-1 font-black text-slate-900 dark:text-white">{{ hafalanTitle(selectedHafalan) }}</div>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-xs font-bold text-slate-400">Juz</div>
                <div class="mt-1 font-black text-slate-900 dark:text-white">{{ extractJuz(selectedHafalan) || '—' }}</div>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-xs font-bold text-slate-400">Ayat / Halaman</div>
                <div class="mt-1 font-black text-slate-900 dark:text-white">{{ ayatLabel(selectedHafalan) }}</div>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-xs font-bold text-slate-400">Pembimbing</div>
                <div class="mt-1 font-black text-slate-900 dark:text-white">
                  {{ selectedHafalan.pembimbing || selectedHafalan.guru || selectedHafalan.ustadz || '—' }}
                </div>
              </div>
            </div>

            <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
              <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                Catatan Pembimbing
              </div>

              <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                {{ selectedHafalan.catatan || selectedHafalan.keterangan || selectedHafalan.note || selectedHafalan.evaluasi || 'Belum ada catatan khusus.' }}
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
const hafalanRawRows = ref<AnyRow[]>([])

const activeTab = ref<'semua' | 'setoran' | 'murojaah' | 'tasmi' | 'mengulang'>('semua')

const filters = ref({
  q: '',
  type: 'semua',
  status: 'semua',
  period: 'bulan-ini'
})

const detailOpen = ref(false)
const selectedHafalan = ref<AnyRow | null>(null)

let unsubscribers: Array<() => void> = []
let stopSessionWatch: (() => void) | null = null
const bucketMap = new Map<string, AnyRow[]>()

const currentSantri = computed(() => {
  return santriProfiles.value.find((item) => item.id === selectedSantriId.value) || santriProfiles.value[0] || null
})

const hafalanRows = computed(() => {
  return sortRowsByDateDesc(filterRowsForCurrentSantri(hafalanRawRows.value))
})

const filteredRows = computed(() => {
  return hafalanRows.value.filter((row) => {
    if (filters.value.type !== 'semua') {
      if (!typeMatches(row, filters.value.type)) return false
    }

    if (filters.value.status !== 'semua') {
      if (!statusMatches(row, filters.value.status)) return false
    }

    if (!periodMatches(row, filters.value.period)) return false

    if (filters.value.q.trim()) {
      const q = normalizeText(filters.value.q)
      const text = normalizeText([
        hafalanTitle(row),
        row.surah,
        row.kitab,
        row.materi,
        row.juz,
        row.ayat,
        row.dariAyat,
        row.sampaiAyat,
        row.halaman,
        row.pembimbing,
        row.guru,
        row.ustadz,
        row.catatan,
        row.keterangan,
        row.note,
        row.evaluasi,
        hafalanStatus(row),
        hafalanTypeLabel(row)
      ].join(' '))

      if (!text.includes(q)) return false
    }

    return true
  })
})

const visibleRows = computed(() => {
  if (activeTab.value === 'setoran') return filteredRows.value.filter((row) => typeMatches(row, 'setoran'))
  if (activeTab.value === 'murojaah') return filteredRows.value.filter((row) => typeMatches(row, 'murojaah'))
  if (activeTab.value === 'tasmi') return filteredRows.value.filter((row) => typeMatches(row, 'tasmi'))
  if (activeTab.value === 'mengulang') return filteredRows.value.filter((row) => statusMatches(row, 'mengulang'))

  return filteredRows.value
})

const mutqinRows = computed(() => {
  return hafalanRows.value.filter((row) => {
    const status = normalizeText(hafalanStatus(row))
    return status.includes('mutqin') || status.includes('lancar') || status.includes('baik')
  })
})

const repeatingRows = computed(() => {
  return hafalanRows.value.filter((row) => statusMatches(row, 'mengulang') || statusMatches(row, 'perlu bimbingan'))
})

const uniqueJuzList = computed(() => {
  const list = new Set<number>()

  for (const row of hafalanRows.value) {
    const juz = extractJuz(row)
    if (juz) list.add(juz)
  }

  return Array.from(list).sort((a, b) => a - b)
})

const uniqueJuzCount = computed(() => uniqueJuzList.value.length)

const juzProgress = computed(() => {
  return Math.round((uniqueJuzCount.value / 30) * 100)
})

const qualityRate = computed(() => {
  if (!hafalanRows.value.length) return 0
  return Math.round((mutqinRows.value.length / hafalanRows.value.length) * 100)
})

const latestRows = computed(() => {
  return [...hafalanRows.value]
    .sort((a, b) => extractDate(b) - extractDate(a))
    .slice(0, 5)
})

const latestSetoranLabel = computed(() => {
  const latest = latestRows.value[0]

  if (!latest) return '—'

  return formatDate(extractDate(latest))
})

const tahfidzHealthScore = computed(() => {
  if (!hafalanRows.value.length) return 70

  let score = 50

  score += Math.min(25, qualityRate.value * 0.25)
  score += Math.min(15, uniqueJuzCount.value * 2)
  score += Math.min(10, hafalanRows.value.length)

  score -= Math.min(20, repeatingRows.value.length * 4)

  return Math.max(10, Math.min(100, Math.round(score)))
})

const aiSummary = computed(() => {
  if (!hafalanRows.value.length) {
    return {
      title: 'Data hafalan belum cukup',
      desc: 'Sistem belum menemukan catatan hafalan yang cukup. Data akan muncul otomatis setelah pembimbing menginput setoran atau murojaah.'
    }
  }

  if (tahfidzHealthScore.value >= 85) {
    return {
      title: 'Perkembangan hafalan sangat positif',
      desc: 'Santri menunjukkan kualitas hafalan yang baik. Pertahankan konsistensi setoran dan murojaah agar hafalan tetap kuat.'
    }
  }

  if (tahfidzHealthScore.value >= 70) {
    return {
      title: 'Perkembangan hafalan cukup stabil',
      desc: 'Hafalan santri berada pada kondisi cukup baik. Fokus berikutnya adalah menjaga murojaah dan memperbaiki bagian yang perlu pengulangan.'
    }
  }

  if (tahfidzHealthScore.value >= 55) {
    return {
      title: 'Hafalan perlu penguatan',
      desc: 'Ada beberapa catatan yang perlu diperhatikan, terutama pada kualitas lancar/mutqin dan frekuensi pengulangan.'
    }
  }

  return {
    title: 'Perlu pendampingan hafalan lebih rutin',
    desc: 'Santri membutuhkan pendampingan lebih intensif. Wali disarankan berkomunikasi dengan pembimbing tahfidz terkait strategi murojaah.'
  }
})

const aiInsights = computed<InsightItem[]>(() => {
  const insights: InsightItem[] = []

  if (!hafalanRows.value.length) {
    insights.push({
      title: 'Belum ada data hafalan',
      desc: 'Data hafalan akan tampil setelah pembimbing menginput setoran, murojaah, atau tasmi’.',
      icon: 'ooui:italic-arab-keheh-jeem',
      priority: 'Sedang',
      cardClass: 'border-slate-100 bg-slate-50 dark:border-neutral-800 dark:bg-neutral-800/60',
      iconClass: 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
    })

    return insights
  }

  if (qualityRate.value >= 80) {
    insights.push({
      title: 'Kualitas hafalan baik',
      desc: `Rasio hafalan mutqin/lancar berada di ${qualityRate.value}%. Pertahankan ritme murojaah harian.`,
      icon: 'ph:shield-check-duotone',
      priority: 'Rendah',
      cardClass: 'border-green-100 bg-green-50/70 dark:border-green-900/30 dark:bg-green-900/10',
      iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })
  }

  if (repeatingRows.value.length > 0) {
    insights.push({
      title: 'Ada hafalan yang perlu diulang',
      desc: `${repeatingRows.value.length} catatan membutuhkan pengulangan atau bimbingan. Prioritaskan murojaah sebelum menambah hafalan baru.`,
      icon: 'ph:warning-circle-duotone',
      priority: repeatingRows.value.length >= 3 ? 'Tinggi' : 'Sedang',
      cardClass: 'border-amber-100 bg-amber-50/70 dark:border-amber-900/30 dark:bg-amber-900/10',
      iconClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
    })
  }

  if (uniqueJuzCount.value >= 5) {
    insights.push({
      title: 'Cakupan juz berkembang',
      desc: `Santri sudah memiliki catatan pada ${uniqueJuzCount.value} juz. Pastikan setiap juz tetap dimurojaah agar tidak melemah.`,
      icon: 'ph:book-open-text-duotone',
      priority: 'Rendah',
      cardClass: 'border-green-100 bg-green-50/70 dark:border-green-900/30 dark:bg-green-900/10',
      iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })
  }

  const latest = latestRows.value[0]
  if (latest) {
    const days = daysSince(extractDate(latest))

    if (days >= 7) {
      insights.push({
        title: 'Setoran terakhir sudah cukup lama',
        desc: `Setoran terakhir sekitar ${days} hari lalu. Disarankan mengecek jadwal hafalan atau kondisi santri.`,
        icon: 'ph:clock-duotone',
        priority: 'Sedang',
        cardClass: 'border-rose-100 bg-rose-50/70 dark:border-rose-900/30 dark:bg-rose-900/10',
        iconClass: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
      })
    }
  }

  if (!insights.length) {
    insights.push({
      title: 'Perkembangan cukup aman',
      desc: 'Belum ada indikator yang sangat mengkhawatirkan. Tetap pantau setoran dan kualitas hafalan terbaru.',
      icon: 'ph:sparkle-duotone',
      priority: 'Rendah',
      cardClass: 'border-green-100 bg-green-50/70 dark:border-green-900/30 dark:bg-green-900/10',
      iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })
  }

  return insights
})

const statusDistribution = computed(() => {
  const total = hafalanRows.value.length || 1

  const mutqin = hafalanRows.value.filter((row) => statusMatches(row, 'mutqin')).length
  const lancar = hafalanRows.value.filter((row) => statusMatches(row, 'lancar')).length
  const mengulang = hafalanRows.value.filter((row) => statusMatches(row, 'mengulang')).length
  const bimbingan = hafalanRows.value.filter((row) => statusMatches(row, 'perlu bimbingan')).length

  return [
    {
      label: 'Mutqin',
      count: mutqin,
      percent: Math.round((mutqin / total) * 100),
      barClass: 'bg-green-500'
    },
    {
      label: 'Lancar',
      count: lancar,
      percent: Math.round((lancar / total) * 100),
      barClass: 'bg-green-500'
    },
    {
      label: 'Mengulang',
      count: mengulang,
      percent: Math.round((mengulang / total) * 100),
      barClass: 'bg-amber-500'
    },
    {
      label: 'Perlu Bimbingan',
      count: bimbingan,
      percent: Math.round((bimbingan / total) * 100),
      barClass: 'bg-rose-500'
    }
  ]
})

const tabs = computed(() => [
  {
    key: 'semua' as const,
    label: 'Semua',
    count: filteredRows.value.length
  },
  {
    key: 'setoran' as const,
    label: 'Setoran',
    count: filteredRows.value.filter((row) => typeMatches(row, 'setoran')).length
  },
  {
    key: 'murojaah' as const,
    label: 'Murojaah',
    count: filteredRows.value.filter((row) => typeMatches(row, 'murojaah')).length
  },
  {
    key: 'tasmi' as const,
    label: 'Tasmi’',
    count: filteredRows.value.filter((row) => typeMatches(row, 'tasmi')).length
  },
  {
    key: 'mengulang' as const,
    label: 'Mengulang',
    count: filteredRows.value.filter((row) => statusMatches(row, 'mengulang')).length
  }
])

function resetFilters() {
  filters.value = {
    q: '',
    type: 'semua',
    status: 'semua',
    period: 'bulan-ini'
  }

  activeTab.value = 'semua'
}

function openDetail(row: AnyRow) {
  selectedHafalan.value = row
  detailOpen.value = true
}

function closeDetail() {
  selectedHafalan.value = null
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

  subscribeDeep(`${clientName}/hafalan`)
  subscribeDeep(`${clientName}/tahfidz`)
  subscribeDeep(`${clientName}/setoran`)
  subscribeDeep(`${clientName}/murojaah`)
  subscribeDeep(`${clientName}/tasmi`)
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

  hafalanRawRows.value = rows
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

  if (looksLikeHafalanRecord(objectValue)) {
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

function looksLikeHafalanRecord(row: AnyRow) {
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
    'surah',
    'juz',
    'ayat',
    'dariAyat',
    'sampaiAyat',
    'halaman',
    'hafalan',
    'materi',
    'kitab',
    'setoran',
    'murojaah',
    'tasmi',
    'predikat',
    'nilai',
    'score',
    'status',
    'tanggal',
    'date',
    'createdAt'
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

function hafalanTitle(row: AnyRow) {
  return row.surah || row.kitab || row.materi || row.hafalan || row.title || row.namaSurah || 'Hafalan'
}

function hafalanDescription(row: AnyRow) {
  const ayat = ayatLabel(row)
  const note = row.catatan || row.keterangan || row.note || row.evaluasi || ''

  if (note) return `${ayat} • ${note}`

  return ayat
}

function ayatLabel(row: AnyRow) {
  if (row.ayat) return `Ayat ${row.ayat}`

  if (row.dariAyat && row.sampaiAyat) {
    return `Ayat ${row.dariAyat} - ${row.sampaiAyat}`
  }

  if (row.halaman) return `Halaman ${row.halaman}`
  if (row.page) return `Halaman ${row.page}`

  return 'Ayat/halaman belum tersedia'
}

function hafalanType(row: AnyRow) {
  const text = normalizeText([
    row.type,
    row.jenis,
    row.kategori,
    row.category,
    row._path
  ].join(' '))

  if (text.includes('murojaah') || text.includes('murajaah')) return 'murojaah'
  if (text.includes('tasmi')) return 'tasmi'
  if (text.includes('setor') || text.includes('setoran')) return 'setoran'

  return 'setoran'
}

function hafalanTypeLabel(row: AnyRow) {
  const type = hafalanType(row)

  if (type === 'murojaah') return 'Murojaah'
  if (type === 'tasmi') return 'Tasmi’'

  return 'Setoran'
}

function typeMatches(row: AnyRow, target: string) {
  return hafalanType(row) === target
}

function hafalanStatus(row: AnyRow) {
  return String(row.status || row.predikat || row.grade || row.kualitas || row.hasil || '').trim()
}

function statusMatches(row: AnyRow, target: string) {
  const status = normalizeText(hafalanStatus(row))

  if (target === 'mutqin') return status.includes('mutqin')
  if (target === 'lancar') return status.includes('lancar') || status.includes('baik')
  if (target === 'mengulang') return status.includes('ulang') || status.includes('murajaah ulang') || status.includes('remedial')
  if (target === 'perlu bimbingan') return status.includes('bimbing') || status.includes('kurang') || status.includes('belum lancar')

  return false
}

function extractJuz(row: AnyRow) {
  const value = row.juz || row.juzNumber || row.nomorJuz

  if (!value) return 0

  const numberValue = Number(String(value).replace(/[^\d]/g, ''))

  return Number.isFinite(numberValue) && numberValue >= 1 && numberValue <= 30 ? numberValue : 0
}

function extractScore(row: AnyRow) {
  const value = row.nilai ?? row.score ?? row.value ?? row.point

  if (value === undefined || value === null || value === '') return undefined

  const numberValue = Number(String(value).replace(/[^\d.-]/g, ''))

  return Number.isFinite(numberValue) ? Math.round(numberValue) : undefined
}

function extractDate(row: AnyRow) {
  const candidates = [
    row.date,
    row.tanggal,
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

function sortRowsByDateDesc(rows: AnyRow[]) {
  return [...rows].sort((a, b) => extractDate(b) - extractDate(a))
}

function daysSince(timestamp: number) {
  const diff = Date.now() - timestamp
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
}

function hafalanIcon(row: AnyRow) {
  const type = hafalanType(row)

  if (type === 'murojaah') return 'ph:repeat-duotone'
  if (type === 'tasmi') return 'ph:microphone-stage-duotone'

  return 'ooui:italic-arab-keheh-jeem'
}

function hafalanIconClass(row: AnyRow) {
  if (statusMatches(row, 'mutqin')) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (statusMatches(row, 'lancar')) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (statusMatches(row, 'mengulang')) return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  if (statusMatches(row, 'perlu bimbingan')) return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'

  return 'bg-lime-50 text-lime-700 dark:bg-lime-900/20 dark:text-lime-300'
}

function hafalanStatusClass(row: AnyRow) {
  if (statusMatches(row, 'mutqin')) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (statusMatches(row, 'lancar')) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (statusMatches(row, 'mengulang')) return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  if (statusMatches(row, 'perlu bimbingan')) return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'

  return 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
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
    'Jenis',
    'Surah/Materi',
    'Juz',
    'Ayat/Halaman',
    'Status',
    'Nilai',
    'Pembimbing',
    'Catatan'
  ]

  const lines = visibleRows.value.map((row) => [
    santriNameOf(currentSantri.value),
    formatDate(extractDate(row)),
    hafalanTypeLabel(row),
    hafalanTitle(row),
    extractJuz(row) || '',
    ayatLabel(row),
    hafalanStatus(row),
    extractScore(row) ?? '',
    row.pembimbing || row.guru || row.ustadz || '',
    row.catatan || row.keterangan || row.note || row.evaluasi || ''
  ].map(toCsvCell).join(','))

  const csv = '\uFEFF' + [headers.join(','), ...lines].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })

  saveBlob(blob, 'hafalan_wali.csv')
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