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
            Academic Performance
          </div>

          <h1 class="mt-4 text-2xl font-black tracking-tight md:text-4xl">
            Akademik Santri
          </h1>

          <p class="mt-2 max-w-xl text-sm leading-6 text-green-50/90 md:text-base">
            Pantau nilai, absensi akademik, hafalan, perkembangan belajar, dan insight performa santri secara realtime.
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
              <div class="text-lg font-black">{{ academicAverageDisplay }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Rata-rata</div>
            </div>

            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ gradeItems.length }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Nilai</div>
            </div>

            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ attendanceRate }}%</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Hadir</div>
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
              <div class="min-w-0">
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Rata-rata Nilai
                </div>

                <div class="mt-2 flex items-end gap-1">
                  <span class="text-3xl font-black text-slate-900 dark:text-white">
                    {{ academicAverageDisplay }}
                  </span>
                  <span class="pb-1 text-xs font-bold text-slate-400 dark:text-neutral-500">/ 100</span>
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  {{ academicDescription }}
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <Icon icon="solar:chart-linear" class="h-6 w-6" />
              </div>
            </div>

            <div class="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800">
              <div
                class="h-full rounded-full bg-green-500 transition-all duration-500"
                :style="{ width: percent(academicAverage) + '%' }"
              ></div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Mapel Terbaik
                </div>

                <div class="mt-2 truncate text-2xl font-black text-slate-900 dark:text-white">
                  {{ bestSubject?.subject || '—' }}
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Nilai tertinggi: {{ bestSubject?.scoreDisplay || '—' }}
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-lime-50 text-lime-700 dark:bg-lime-900/20 dark:text-lime-300">
                <Icon icon="ph:trend-up-duotone" class="h-6 w-6" />
              </div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Perlu Perhatian
                </div>

                <div class="mt-2 truncate text-2xl font-black text-slate-900 dark:text-white">
                  {{ weakSubject?.subject || '—' }}
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Nilai terendah: {{ weakSubject?.scoreDisplay || '—' }}
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                <Icon icon="ph:warning-circle-duotone" class="h-6 w-6" />
              </div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Kehadiran
                </div>

                <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {{ attendanceRate }}%
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  {{ attendanceStats.hadir }} hadir dari {{ attendanceRows.length }} data.
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300">
                <Icon icon="hugeicons:note-03" class="h-6 w-6" />
              </div>
            </div>

            <div class="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800">
              <div
                class="h-full rounded-full bg-cyan-500 transition-all duration-500"
                :style="{ width: attendanceRate + '%' }"
              ></div>
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
                AI Academic Insight
              </div>

              <h2 class="mt-4 text-xl font-black">
                {{ aiSummary.title }}
              </h2>

              <p class="mt-2 text-sm leading-6 text-white/75">
                {{ aiSummary.desc }}
              </p>

              <div class="mt-5">
                <div class="flex items-center justify-between text-xs font-bold text-white/70">
                  <span>Academic Score</span>
                  <span>{{ academicHealthScore }}/100</span>
                </div>

                <div class="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-lime-300 to-green-400 transition-all duration-500"
                    :style="{ width: academicHealthScore + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Rekomendasi Belajar
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Saran otomatis berdasarkan data akademik.
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
          <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.3fr,0.75fr,0.75fr,0.75fr,0.55fr]">
            <div class="relative">
              <input
                v-model="filters.q"
                type="text"
                placeholder="Cari mapel, guru, semester, keterangan..."
                class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:ring-green-500/10"
              />
              <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Icon icon="lucide:search" class="h-4 w-4" />
              </span>
            </div>

            <select
              v-model="filters.term"
              class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="semua">Semua Tahun Ajaran</option>
              <option
                v-for="term in termOptions"
                :key="term"
                :value="term"
              >
                {{ term }}
              </option>
            </select>

            <select
              v-model="filters.semester"
              class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="semua">Semua Semester</option>
              <option
                v-for="semester in semesterOptions"
                :key="semester"
                :value="semester"
              >
                {{ semester }}
              </option>
            </select>

            <select
              v-model="filters.score"
              class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="semua">Semua Nilai</option>
              <option value="sangat-baik">Sangat Baik ≥ 90</option>
              <option value="baik">Baik 80 - 89</option>
              <option value="cukup">Cukup 70 - 79</option>
              <option value="perlu">Perlu Bimbingan &lt; 70</option>
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

        <!-- Main Academic Content -->
        <div class="grid gap-4 xl:grid-cols-[1fr,0.82fr]">
          <!-- Nilai -->
          <div
            v-if="activeTab === 'nilai' || activeTab === 'semua'"
            class="rounded-[32px] border border-white/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="flex flex-col gap-3 border-b border-slate-100 p-5 dark:border-neutral-800 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Daftar Nilai
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Menampilkan {{ filteredGradeItems.length }} nilai dari data akademik.
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

            <div v-if="filteredGradeItems.length === 0" class="p-10 text-center">
              <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <Icon icon="solar:chart-linear" class="h-8 w-8" />
              </div>

              <h3 class="mt-4 text-lg font-black text-slate-900 dark:text-white">
                Nilai tidak ditemukan
              </h3>

              <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                Coba ubah filter atau tunggu data akademik diinput oleh admin/guru.
              </p>
            </div>

            <div v-else class="divide-y divide-slate-100 dark:divide-neutral-800">
              <div
                v-for="grade in filteredGradeItems"
                :key="grade.id"
                class="p-5 transition hover:bg-slate-50/70 dark:hover:bg-neutral-800/40"
              >
                <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div class="flex min-w-0 gap-3">
                    <div :class="['grid h-12 w-12 shrink-0 place-items-center rounded-2xl', gradeIconClass(grade.score)]">
                      <Icon icon="solar:book-bookmark-linear" class="h-6 w-6" />
                    </div>

                    <div class="min-w-0">
                      <div class="flex flex-wrap items-center gap-2">
                        <h3 class="truncate text-base font-black text-slate-900 dark:text-white">
                          {{ grade.subject }}
                        </h3>

                        <span :class="['rounded-full px-2.5 py-1 text-[11px] font-black', scoreBadgeClass(grade.score)]">
                          {{ gradeLevelText(grade.score) }}
                        </span>
                      </div>

                      <div class="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-neutral-400">
                        <span>{{ grade.term || 'Tahun ajaran belum tersedia' }}</span>
                        <span>•</span>
                        <span>{{ grade.semester || 'Semester belum tersedia' }}</span>
                        <span v-if="grade.teacher">•</span>
                        <span v-if="grade.teacher">Guru: {{ grade.teacher }}</span>
                      </div>

                      <div class="mt-3 grid gap-2 sm:grid-cols-4">
                        <div class="rounded-2xl bg-slate-50 p-3 dark:bg-neutral-800">
                          <div class="text-[11px] font-bold text-slate-400">Tugas</div>
                          <div class="mt-1 font-black text-slate-900 dark:text-white">{{ grade.tugas ?? '—' }}</div>
                        </div>

                        <div class="rounded-2xl bg-slate-50 p-3 dark:bg-neutral-800">
                          <div class="text-[11px] font-bold text-slate-400">Harian</div>
                          <div class="mt-1 font-black text-slate-900 dark:text-white">{{ grade.harian ?? '—' }}</div>
                        </div>

                        <div class="rounded-2xl bg-slate-50 p-3 dark:bg-neutral-800">
                          <div class="text-[11px] font-bold text-slate-400">PTS</div>
                          <div class="mt-1 font-black text-slate-900 dark:text-white">{{ grade.pts ?? '—' }}</div>
                        </div>

                        <div class="rounded-2xl bg-slate-50 p-3 dark:bg-neutral-800">
                          <div class="text-[11px] font-bold text-slate-400">PAS</div>
                          <div class="mt-1 font-black text-slate-900 dark:text-white">{{ grade.pas ?? '—' }}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="shrink-0 text-left md:text-right">
                    <div class="text-3xl font-black text-slate-900 dark:text-white">
                      {{ grade.scoreDisplay }}
                    </div>

                    <div class="mt-1 text-xs font-bold text-slate-400 dark:text-neutral-500">
                      {{ grade.predicate || gradeLevelText(grade.score) }}
                    </div>

                    <button
                      type="button"
                      @click="openGradeDetail(grade)"
                      class="mt-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      Detail
                    </button>
                  </div>
                </div>

                <div class="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800">
                  <div
                    class="h-full rounded-full bg-green-500 transition-all duration-500"
                    :style="{ width: percent(grade.score) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Charts -->
          <div class="space-y-4">
            <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="mb-4">
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Distribusi Nilai
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Komposisi kategori nilai akademik.
                </p>
              </div>

              <div class="space-y-4">
                <div
                  v-for="item in scoreDistribution"
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
                  Top Mapel
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Mata pelajaran dengan nilai tertinggi.
                </p>
              </div>

              <div v-if="topSubjects.length === 0" class="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400">
                Belum ada data.
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="grade in topSubjects"
                  :key="grade.id"
                  class="flex items-center justify-between gap-3 rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
                >
                  <div class="min-w-0">
                    <div class="truncate font-black text-slate-900 dark:text-white">
                      {{ grade.subject }}
                    </div>
                    <div class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                      {{ grade.term || '—' }}
                    </div>
                  </div>

                  <div class="text-xl font-black text-green-700 dark:text-green-300">
                    {{ grade.scoreDisplay }}
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="mb-4">
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Kehadiran Akademik
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Ringkasan absensi belajar.
                </p>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="rounded-[24px] bg-green-50 p-4 text-center text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <div class="text-2xl font-black">{{ attendanceStats.hadir }}</div>
                  <div class="mt-1 text-xs font-bold">Hadir</div>
                </div>

                <div class="rounded-[24px] bg-green-50 p-4 text-center text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <div class="text-2xl font-black">{{ attendanceStats.izin }}</div>
                  <div class="mt-1 text-xs font-bold">Izin</div>
                </div>

                <div class="rounded-[24px] bg-amber-50 p-4 text-center text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                  <div class="text-2xl font-black">{{ attendanceStats.sakit }}</div>
                  <div class="mt-1 text-xs font-bold">Sakit</div>
                </div>

                <div class="rounded-[24px] bg-rose-50 p-4 text-center text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">
                  <div class="text-2xl font-black">{{ attendanceStats.alpa }}</div>
                  <div class="mt-1 text-xs font-bold">Alpa</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hafalan & Absensi -->
        <div
          v-if="activeTab === 'hafalan' || activeTab === 'absensi' || activeTab === 'semua'"
          class="grid gap-4 xl:grid-cols-2"
        >
          <div
            v-if="activeTab === 'hafalan' || activeTab === 'semua'"
            class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Hafalan & Tahfidz
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Perkembangan hafalan santri.
                </p>
              </div>

              <span class="rounded-full bg-lime-50 px-3 py-1.5 text-xs font-black text-lime-700 dark:bg-lime-900/20 dark:text-lime-300">
                {{ hafalanRows.length }}
              </span>
            </div>

            <div v-if="hafalanRows.length === 0" class="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400">
              Belum ada data hafalan.
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="row in hafalanRows.slice(0, 8)"
                :key="row._uid"
                class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <div class="truncate font-black text-slate-900 dark:text-white">
                      {{ row.surah || row.kitab || row.materi || row.title || 'Hafalan' }}
                    </div>

                    <p class="mt-1 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                      {{ row.ayat || row.bab || row.keterangan || row.note || 'Perkembangan hafalan tercatat.' }}
                    </p>
                  </div>

                  <span class="shrink-0 rounded-full bg-lime-50 px-2.5 py-1 text-xs font-black text-lime-700 dark:bg-lime-900/20 dark:text-lime-300">
                    {{ row.predikat || row.status || '—' }}
                  </span>
                </div>

                <div class="mt-2 text-xs font-bold text-slate-400 dark:text-neutral-500">
                  {{ formatDate(extractDate(row)) }}
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="activeTab === 'absensi' || activeTab === 'semua'"
            class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Riwayat Absensi
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Riwayat kehadiran akademik terbaru.
                </p>
              </div>

              <span class="rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300">
                {{ attendanceRows.length }}
              </span>
            </div>

            <div v-if="attendanceRows.length === 0" class="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400">
              Belum ada data absensi.
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="row in attendanceRows.slice(0, 8)"
                :key="row._uid"
                class="flex items-center justify-between gap-3 rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
              >
                <div class="min-w-0">
                  <div class="truncate font-black text-slate-900 dark:text-white">
                    {{ row.mapel || row.subject || row.kegiatan || row.keterangan || 'Absensi' }}
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
        </div>
      </template>
    </template>

    <!-- Grade Detail Modal -->
    <div
      v-if="detailOpen && selectedGrade"
      class="fixed inset-0 z-[9999] overflow-y-auto p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Tutup modal"
        @click="closeGradeDetail"
      ></button>

      <div class="relative z-10 flex min-h-full items-center justify-center">
        <div class="w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
          <div class="border-b border-slate-100 p-5 dark:border-neutral-800">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <Icon icon="solar:book-bookmark-linear" class="h-4 w-4" />
                  Detail Nilai
                </div>

                <h3 class="mt-3 text-xl font-black text-slate-900 dark:text-white">
                  {{ selectedGrade.subject }}
                </h3>

                <p class="mt-1 text-sm text-slate-500 dark:text-neutral-400">
                  {{ selectedGrade.term || 'Tahun ajaran belum tersedia' }} • {{ selectedGrade.semester || 'Semester belum tersedia' }}
                </p>
              </div>

              <button
                type="button"
                @click="closeGradeDetail"
                class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                <Icon icon="lucide:x" class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div class="space-y-4 p-5">
            <div class="rounded-[28px] border border-green-100 bg-green-50 p-5 dark:border-green-900/30 dark:bg-green-900/10">
              <div class="text-xs font-black uppercase tracking-[0.14em] text-green-700 dark:text-green-300">
                Nilai Akhir
              </div>

              <div class="mt-2 flex items-end gap-2">
                <span class="text-4xl font-black text-slate-900 dark:text-white">
                  {{ selectedGrade.scoreDisplay }}
                </span>
                <span class="pb-1 text-sm font-bold text-slate-500 dark:text-neutral-400">
                  {{ selectedGrade.predicate || gradeLevelText(selectedGrade.score) }}
                </span>
              </div>

              <div class="mt-4 h-3 overflow-hidden rounded-full bg-white dark:bg-neutral-900">
                <div
                  class="h-full rounded-full bg-green-500"
                  :style="{ width: percent(selectedGrade.score) + '%' }"
                ></div>
              </div>
            </div>

            <div class="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-xs font-bold text-slate-400">Tugas</div>
                <div class="mt-1 text-xl font-black text-slate-900 dark:text-white">{{ selectedGrade.tugas ?? '—' }}</div>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-xs font-bold text-slate-400">Harian</div>
                <div class="mt-1 text-xl font-black text-slate-900 dark:text-white">{{ selectedGrade.harian ?? '—' }}</div>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-xs font-bold text-slate-400">PTS</div>
                <div class="mt-1 text-xl font-black text-slate-900 dark:text-white">{{ selectedGrade.pts ?? '—' }}</div>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-xs font-bold text-slate-400">PAS</div>
                <div class="mt-1 text-xl font-black text-slate-900 dark:text-white">{{ selectedGrade.pas ?? '—' }}</div>
              </div>
            </div>

            <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
              <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                Catatan Guru
              </div>

              <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                {{ selectedGrade.note || selectedGrade.catatan || selectedGrade.keterangan || 'Belum ada catatan khusus untuk mata pelajaran ini.' }}
              </p>
            </div>
          </div>

          <div class="flex justify-end border-t border-slate-100 p-5 dark:border-neutral-800">
            <button
              type="button"
              @click="closeGradeDetail"
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

type GradeItem = AnyRow & {
  id: string
  subject: string
  term: string
  semester: string
  teacher: string
  score?: number
  scoreDisplay: string
  predicate: string
  tugas?: number
  harian?: number
  pts?: number
  pas?: number
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
const nilaiRawRows = ref<AnyRow[]>([])
const hafalanRawRows = ref<AnyRow[]>([])
const absensiRawRows = ref<AnyRow[]>([])
const pelajaranRawRows = ref<AnyRow[]>([])

const activeTab = ref<'semua' | 'nilai' | 'hafalan' | 'absensi'>('semua')

const filters = ref({
  q: '',
  term: 'semua',
  semester: 'semua',
  score: 'semua'
})

const detailOpen = ref(false)
const selectedGrade = ref<GradeItem | null>(null)

let unsubscribers: Array<() => void> = []
let stopSessionWatch: (() => void) | null = null
const bucketMap = new Map<string, { target: any; rows: AnyRow[] }>()

const currentSantri = computed(() => {
  return santriProfiles.value.find((item) => item.id === selectedSantriId.value) || santriProfiles.value[0] || null
})

const subjectMap = computed(() => {
  const map = new Map<string, string>()

  for (const row of pelajaranRawRows.value) {
    const id = String(row.id || row._uid || row.key || row.mapelId || '').trim()
    const name = String(row.name || row.nama || row.mapel || row.subject || row.title || '').trim()

    if (id && name) map.set(id, name)
  }

  return map
})

const gradeRows = computed(() => filterRowsForCurrentSantri(nilaiRawRows.value))

const hafalanRows = computed(() => {
  return sortRowsByDateDesc(filterRowsForCurrentSantri(hafalanRawRows.value))
})

const attendanceRows = computed(() => {
  return sortRowsByDateDesc(filterRowsForCurrentSantri(absensiRawRows.value))
})

const gradeItems = computed<GradeItem[]>(() => {
  return gradeRows.value
    .map((row, index) => {
      const score = extractGradeScore(row)

      return {
        ...row,
        id: row._uid || row.id || String(index),
        subject: subjectNameOf(row, index),
        term: extractTerm(row),
        semester: extractSemester(row),
        teacher: row.guru || row.teacher || row.ustadz || row.pengajar || '',
        score,
        scoreDisplay: score == null ? '—' : String(score),
        predicate: row.predikat || row.grade || row.predikatAkhir || '',
        tugas: safeNumber(row.tugas),
        harian: safeNumber(row.harian ?? row.ulanganHarian),
        pts: safeNumber(row.pts ?? row.uts),
        pas: safeNumber(row.pas ?? row.uas)
      }
    })
    .filter((item) => item.score != null)
    .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
})

const filteredGradeItems = computed(() => {
  return gradeItems.value.filter((item) => {
    if (filters.value.term !== 'semua' && item.term !== filters.value.term) return false
    if (filters.value.semester !== 'semua' && item.semester !== filters.value.semester) return false

    if (filters.value.score !== 'semua') {
      const score = Number(item.score || 0)

      if (filters.value.score === 'sangat-baik' && score < 90) return false
      if (filters.value.score === 'baik' && (score < 80 || score >= 90)) return false
      if (filters.value.score === 'cukup' && (score < 70 || score >= 80)) return false
      if (filters.value.score === 'perlu' && score >= 70) return false
    }

    if (filters.value.q.trim()) {
      const q = normalizeText(filters.value.q)
      const text = normalizeText([
        item.subject,
        item.term,
        item.semester,
        item.teacher,
        item.predicate,
        item.keterangan,
        item.catatan,
        item.note
      ].join(' '))

      if (!text.includes(q)) return false
    }

    return true
  })
})

const termOptions = computed(() => {
  return uniqueNonEmpty(gradeItems.value.map((item) => item.term))
})

const semesterOptions = computed(() => {
  return uniqueNonEmpty(gradeItems.value.map((item) => item.semester))
})

const academicAverage = computed(() => {
  const values = filteredGradeItems.value
    .map((item) => item.score)
    .filter((value) => typeof value === 'number') as number[]

  if (!values.length) return 0

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
})

const academicAverageDisplay = computed(() => {
  return academicAverage.value > 0 ? academicAverage.value : '—'
})

const bestSubject = computed(() => {
  return [...filteredGradeItems.value].sort((a, b) => Number(b.score || 0) - Number(a.score || 0))[0] || null
})

const weakSubject = computed(() => {
  return [...filteredGradeItems.value].sort((a, b) => Number(a.score || 0) - Number(b.score || 0))[0] || null
})

const topSubjects = computed(() => {
  return [...filteredGradeItems.value]
    .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
    .slice(0, 5)
})

const academicDescription = computed(() => {
  if (!filteredGradeItems.value.length) return 'Belum ada nilai yang bisa dianalisis.'
  if (academicAverage.value >= 90) return 'Performa akademik sangat unggul.'
  if (academicAverage.value >= 80) return 'Performa akademik baik dan stabil.'
  if (academicAverage.value >= 70) return 'Performa cukup, tetap perlu dijaga.'
  return 'Perlu pendampingan belajar lebih rutin.'
})

const attendanceStats = computed(() => {
  const result = {
    hadir: 0,
    izin: 0,
    sakit: 0,
    alpa: 0
  }

  for (const row of attendanceRows.value) {
    const status = normalizeText(extractStatus(row))

    if (status.includes('hadir')) result.hadir++
    else if (status.includes('izin')) result.izin++
    else if (status.includes('sakit')) result.sakit++
    else if (status.includes('alpa') || status.includes('alpha') || status.includes('tidak hadir')) result.alpa++
  }

  return result
})

const attendanceRate = computed(() => {
  if (!attendanceRows.value.length) return 0
  return Math.round((attendanceStats.value.hadir / attendanceRows.value.length) * 100)
})

const academicHealthScore = computed(() => {
  const avg = academicAverage.value || 70
  const presence = attendanceRows.value.length ? attendanceRate.value : 75
  const weakPenalty = filteredGradeItems.value.filter((item) => Number(item.score || 0) < 70).length * 4

  return Math.max(10, Math.min(100, Math.round(avg * 0.72 + presence * 0.28 - weakPenalty)))
})

const aiSummary = computed(() => {
  if (!filteredGradeItems.value.length) {
    return {
      title: 'Data akademik belum cukup',
      desc: 'Sistem belum menemukan nilai yang cukup untuk membaca performa akademik santri. Data akan tampil otomatis setelah diinput.'
    }
  }

  if (academicHealthScore.value >= 88) {
    return {
      title: 'Performa akademik sangat positif',
      desc: 'Nilai dan indikator akademik menunjukkan perkembangan yang kuat. Fokus berikutnya adalah menjaga konsistensi dan tantangan belajar yang lebih tinggi.'
    }
  }

  if (academicHealthScore.value >= 75) {
    return {
      title: 'Performa akademik cukup stabil',
      desc: 'Santri berada pada kondisi belajar yang baik. Tetap pantau mata pelajaran dengan nilai paling rendah agar tidak tertinggal.'
    }
  }

  if (academicHealthScore.value >= 60) {
    return {
      title: 'Ada area belajar yang perlu dikuatkan',
      desc: 'Beberapa indikator menunjukkan perlunya pendampingan belajar lebih rutin, terutama pada mapel dengan nilai rendah.'
    }
  }

  return {
    title: 'Perlu pendampingan akademik intensif',
    desc: 'Santri membutuhkan perhatian lebih pada aspek akademik. Wali disarankan berkomunikasi dengan wali kelas atau pengajar terkait.'
  }
})

const aiInsights = computed<InsightItem[]>(() => {
  const insights: InsightItem[] = []

  if (!filteredGradeItems.value.length) {
    insights.push({
      title: 'Nilai belum tersedia',
      desc: 'Belum ada data nilai yang bisa dianalisis. Pastikan guru/admin sudah menginput data akademik.',
      icon: 'solar:chart-linear',
      priority: 'Sedang',
      cardClass: 'border-slate-100 bg-slate-50 dark:border-neutral-800 dark:bg-neutral-800/60',
      iconClass: 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
    })

    return insights
  }

  const weakItems = filteredGradeItems.value.filter((item) => Number(item.score || 0) < 70)
  const excellentItems = filteredGradeItems.value.filter((item) => Number(item.score || 0) >= 90)

  if (excellentItems.length) {
    insights.push({
      title: 'Ada potensi akademik kuat',
      desc: `${excellentItems.length} mata pelajaran berada pada kategori sangat baik. Pertahankan pola belajar yang sudah efektif.`,
      icon: 'ph:trend-up-duotone',
      priority: 'Rendah',
      cardClass: 'border-green-100 bg-green-50/70 dark:border-green-900/30 dark:bg-green-900/10',
      iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })
  }

  if (weakItems.length) {
    insights.push({
      title: 'Ada mapel yang perlu pendampingan',
      desc: `${weakItems.length} mata pelajaran berada di bawah 70. Prioritaskan latihan ringan namun konsisten setiap hari.`,
      icon: 'ph:warning-circle-duotone',
      priority: 'Tinggi',
      cardClass: 'border-amber-100 bg-amber-50/70 dark:border-amber-900/30 dark:bg-amber-900/10',
      iconClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
    })
  }

  if (attendanceRows.value.length && attendanceRate.value < 80) {
    insights.push({
      title: 'Kehadiran memengaruhi akademik',
      desc: `Rasio kehadiran ${attendanceRate.value}%. Perlu dicek apakah izin, sakit, atau alpa berdampak pada nilai.`,
      icon: 'hugeicons:note-03',
      priority: 'Tinggi',
      cardClass: 'border-rose-100 bg-rose-50/70 dark:border-rose-900/30 dark:bg-rose-900/10',
      iconClass: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
    })
  }

  if (academicAverage.value >= 80 && attendanceRate.value >= 85) {
    insights.push({
      title: 'Konsistensi belajar baik',
      desc: 'Kombinasi nilai dan kehadiran terlihat baik. Pertahankan ritme belajar dan evaluasi berkala.',
      icon: 'ph:shield-check-duotone',
      priority: 'Rendah',
      cardClass: 'border-cyan-100 bg-cyan-50/70 dark:border-cyan-900/30 dark:bg-cyan-900/10',
      iconClass: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300'
    })
  }

  if (!insights.length) {
    insights.push({
      title: 'Performa akademik cukup aman',
      desc: 'Belum ada indikator yang sangat mengkhawatirkan. Tetap pantau nilai terbaru dan komunikasi dengan pengajar.',
      icon: 'ph:sparkle-duotone',
      priority: 'Sedang',
      cardClass: 'border-green-100 bg-green-50/70 dark:border-green-900/30 dark:bg-green-900/10',
      iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })
  }

  return insights
})

const scoreDistribution = computed(() => {
  const total = filteredGradeItems.value.length || 1

  const veryGood = filteredGradeItems.value.filter((item) => Number(item.score || 0) >= 90).length
  const good = filteredGradeItems.value.filter((item) => Number(item.score || 0) >= 80 && Number(item.score || 0) < 90).length
  const enough = filteredGradeItems.value.filter((item) => Number(item.score || 0) >= 70 && Number(item.score || 0) < 80).length
  const need = filteredGradeItems.value.filter((item) => Number(item.score || 0) < 70).length

  return [
    {
      label: 'Sangat Baik',
      count: veryGood,
      percent: Math.round((veryGood / total) * 100),
      barClass: 'bg-green-500'
    },
    {
      label: 'Baik',
      count: good,
      percent: Math.round((good / total) * 100),
      barClass: 'bg-green-500'
    },
    {
      label: 'Cukup',
      count: enough,
      percent: Math.round((enough / total) * 100),
      barClass: 'bg-amber-500'
    },
    {
      label: 'Perlu Bimbingan',
      count: need,
      percent: Math.round((need / total) * 100),
      barClass: 'bg-rose-500'
    }
  ]
})

const tabs = computed(() => [
  {
    key: 'semua' as const,
    label: 'Semua',
    count: gradeItems.value.length + hafalanRows.value.length + attendanceRows.value.length
  },
  {
    key: 'nilai' as const,
    label: 'Nilai',
    count: gradeItems.value.length
  },
  {
    key: 'hafalan' as const,
    label: 'Hafalan',
    count: hafalanRows.value.length
  },
  {
    key: 'absensi' as const,
    label: 'Absensi',
    count: attendanceRows.value.length
  }
])

function resetFilters() {
  filters.value = {
    q: '',
    term: 'semua',
    semester: 'semua',
    score: 'semua'
  }
}

function openGradeDetail(grade: GradeItem) {
  selectedGrade.value = grade
  detailOpen.value = true
}

function closeGradeDetail() {
  detailOpen.value = false
  selectedGrade.value = null
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

  subscribeDeep(`${clientName}/nilai`, nilaiRawRows)
  subscribeDeep(`${clientName}/grades`, nilaiRawRows)
  subscribeDeep(`${clientName}/akademik`, nilaiRawRows)
  subscribeDeep(`${clientName}/academic`, nilaiRawRows)
  subscribeDeep(`${clientName}/rapor`, nilaiRawRows)

  subscribeDeep(`${clientName}/hafalan`, hafalanRawRows)
  subscribeDeep(`${clientName}/tahfidz`, hafalanRawRows)

  subscribeDeep(`${clientName}/absen`, absensiRawRows)
  subscribeDeep(`${clientName}/absensi`, absensiRawRows)
  subscribeDeep(`${clientName}/attendance`, absensiRawRows)

  subscribeDeep(`${clientName}/pelajaran`, pelajaranRawRows)
  subscribeDeep(`${clientName}/subjects`, pelajaranRawRows)
  subscribeDeep(`${clientName}/mapel`, pelajaranRawRows)
}

function subscribeDeep(path: string, target: typeof nilaiRawRows) {
  if (!$realtimeDb) return

  const unsubscribe = onValue(dbRef($realtimeDb, path), (snap) => {
    bucketMap.set(path, {
      target,
      rows: flattenRecords(snap.val(), [path], 0)
    })

    rebuildTarget(target)
    loading.value = false
  })

  unsubscribers.push(unsubscribe)
}

function rebuildTarget(target: typeof nilaiRawRows) {
  const rows: AnyRow[] = []

  for (const bucket of bucketMap.values()) {
    if (bucket.target === target) {
      rows.push(...bucket.rows)
    }
  }

  target.value = rows
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

  if (looksLikeDataRecord(objectValue)) {
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

function looksLikeDataRecord(row: AnyRow) {
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
    'nilai',
    'akhir',
    'nilaiAkhir',
    'score',
    'tugas',
    'harian',
    'pts',
    'pas',
    'mapel',
    'subject',
    'pelajaran',
    'semester',
    'tahunAjaran',
    'surah',
    'hafalan',
    'kehadiran',
    'absen',
    'presensi',
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

function subjectNameOf(row: AnyRow, index: number) {
  const subjectId = String(row.subjectId || row.mapelId || row.pelajaranId || row.idMapel || '').trim()

  if (subjectId && subjectMap.value.has(subjectId)) {
    return subjectMap.value.get(subjectId) || `Mapel ${index + 1}`
  }

  return row.mapel || row.subject || row.pelajaran || row.namaMapel || row.materi || row.title || `Mapel ${index + 1}`
}

function extractTerm(row: AnyRow) {
  return String(row.term || row.tahunAjaran || row.tahun_ajaran || row.periode || row.year || 'Tidak diketahui')
}

function extractSemester(row: AnyRow) {
  const value = String(row.semester || row.sem || row.termSemester || '').trim()

  if (!value) return 'Tidak diketahui'

  const lowered = value.toLowerCase()

  if (lowered.includes('ganjil') || lowered === '1') return 'Ganjil'
  if (lowered.includes('genap') || lowered === '2') return 'Genap'

  return value
}

function extractGradeScore(row: AnyRow) {
  const direct = safeNumber(row.akhir ?? row.nilaiAkhir ?? row.final ?? row.score ?? row.nilai)

  if (direct != null) return Math.round(direct)

  const components = [
    row.tugas,
    row.harian,
    row.ulanganHarian,
    row.pts,
    row.uts,
    row.pas,
    row.uas,
    row.proyek,
    row.praktik,
    row.lainnya
  ]
    .map(safeNumber)
    .filter((value) => typeof value === 'number') as number[]

  if (!components.length) return undefined

  return Math.round(components.reduce((sum, value) => sum + value, 0) / components.length)
}

function extractStatus(row: AnyRow) {
  return row.status || row.kehadiran || row.absen || row.presensi || row.type || ''
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

function sortRowsByDateDesc(rows: AnyRow[]) {
  return [...rows].sort((a, b) => extractDate(b) - extractDate(a))
}

function safeNumber(value: any) {
  if (value === undefined || value === null || value === '') return undefined

  const numberValue = Number(String(value).replace(/[^\d.-]/g, ''))

  return Number.isFinite(numberValue) ? numberValue : undefined
}

function percent(value?: number) {
  return Math.max(0, Math.min(100, Math.round(Number(value || 0))))
}

function gradeLevelText(score?: number) {
  if (score == null) return '—'
  if (score >= 90) return 'Sangat Baik'
  if (score >= 80) return 'Baik'
  if (score >= 70) return 'Cukup'
  if (score >= 60) return 'Perlu Latihan'
  return 'Perlu Bimbingan'
}

function gradeIconClass(score?: number) {
  if (score == null) return 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
  if (score >= 90) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (score >= 80) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (score >= 70) return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
}

function scoreBadgeClass(score?: number) {
  if (score == null) return 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
  if (score >= 90) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (score >= 80) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (score >= 70) return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
}

function attendanceStatusClass(row: AnyRow) {
  const status = normalizeText(extractStatus(row))

  if (status.includes('hadir')) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (status.includes('izin')) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (status.includes('sakit')) return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  if (status.includes('alpa') || status.includes('alpha') || status.includes('tidak hadir')) return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'

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

function uniqueNonEmpty(values: Array<string | number | undefined | null>) {
  return Array.from(
    new Set(
      values
        .map((value) => String(value || '').trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b, 'id-ID', { numeric: true, sensitivity: 'base' }))
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
    'Mapel',
    'Tahun Ajaran',
    'Semester',
    'Guru',
    'Tugas',
    'Harian',
    'PTS',
    'PAS',
    'Nilai Akhir',
    'Predikat'
  ]

  const lines = filteredGradeItems.value.map((item) => [
    santriNameOf(currentSantri.value),
    item.subject,
    item.term,
    item.semester,
    item.teacher,
    item.tugas ?? '',
    item.harian ?? '',
    item.pts ?? '',
    item.pas ?? '',
    item.scoreDisplay,
    item.predicate || gradeLevelText(item.score)
  ].map(toCsvCell).join(','))

  const csv = '\uFEFF' + [headers.join(','), ...lines].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })

  saveBlob(blob, 'akademik_wali.csv')
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