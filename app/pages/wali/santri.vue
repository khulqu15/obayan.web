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
            Realtime Student Performance
          </div>

          <h1 class="mt-4 text-2xl font-black tracking-tight md:text-4xl">
            Perkembangan Santri
          </h1>

          <p class="mt-2 max-w-xl text-sm leading-6 text-green-50/90 md:text-base">
            Pantau akademik, kehadiran, pelanggaran, pembayaran, perizinan, dan aktivitas penting santri secara realtime.
          </p>
        </div>

        <div class="min-w-0 rounded-[28px] bg-white/13 p-4 ring-1 ring-white/15 backdrop-blur lg:w-[360px]">
          <label class="text-xs font-bold text-green-50/80">Santri Terhubung</label>

          <div class="mt-2 grid gap-2 sm:grid-cols-[1fr,auto]">
          <select
            v-model="selectedSantriId"
            class="h-12 w-full rounded-2xl border border-white/20 bg-white/15 px-4 text-sm font-bold text-white outline-none backdrop-blur placeholder:text-white/70 focus:border-white/60"
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

          <button
            type="button"
            @click="openAddSantriModal"
            class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-black text-green-700 shadow-lg shadow-green-900/10 transition hover:bg-green-50"
          >
            <Icon icon="ph:plus-circle-duotone" class="h-5 w-5" />
            Tambah
          </button>
        </div>

          <div class="mt-3 grid grid-cols-3 gap-2">
            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ academicAverageDisplay }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Rata-rata</div>
            </div>

            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ attendanceRate }}%</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Hadir</div>
            </div>

            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ violationRows.length }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Pelanggaran</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && santriProfiles.length === 0"
      class="rounded-[32px] border border-dashed border-slate-300 bg-white p-10 text-center dark:border-neutral-700 dark:bg-neutral-900"
    >
      <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-amber-50 text-3xl text-amber-600 dark:bg-amber-900/20 dark:text-amber-300">
        <Icon icon="ph:user-circle-duotone" class="h-9 w-9" />
      </div>

      <h2 class="mt-4 text-lg font-black text-slate-900 dark:text-white">
        Data santri belum terhubung
      </h2>

      <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-neutral-400">
        Akun wali ini belum memiliki santri yang terhubung. Silakan hubungi admin untuk menghubungkan data santri.
      </p>
      <button
        type="button"
        @click="openAddSantriModal"
        class="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
      >
        <Icon icon="ph:plus-circle-duotone" class="h-5 w-5" />
        Hubungkan Santri
      </button>
    </div>

    <template v-else>
      <!-- Loading Skeleton -->
      <div v-if="loading" class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="i in 4"
          :key="i"
          class="h-36 animate-pulse rounded-[28px] bg-slate-100 dark:bg-neutral-800"
        ></div>
      </div>

      <!-- Current Santri Identity -->
      <div v-else class="grid gap-4 lg:grid-cols-[1fr,0.8fr]">
        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div class="flex min-w-0 items-center gap-4">
              <div class="grid h-16 w-16 shrink-0 place-items-center rounded-[24px] bg-green-50 text-xl font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
                {{ initials(santriDisplayName) }}
              </div>

              <div class="min-w-0">
                <h2 class="truncate text-xl font-black text-slate-900 dark:text-white">
                  {{ santriDisplayName }}
                </h2>

                <div class="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-neutral-400">
                  <span>Gen: {{ currentSantri?.gen || '—' }}</span>
                  <span>•</span>
                  <span>Jenjang: {{ currentSantri?.jenjang || currentSantri?.kelasFormal || '—' }}</span>
                  <span>•</span>
                  <span>Kamar: {{ currentSantri?.kamar || '—' }}</span>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <span :class="['rounded-full px-3 py-1.5 text-xs font-black capitalize', statusClass(currentSantri?.status)]">
                {{ currentSantri?.status || 'aktif' }}
              </span>

              <span class="rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
                Realtime Aktif
              </span>
            </div>
          </div>

          <div class="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <InfoMiniCard
              label="Nama Wali"
              :value="currentSantri?.walisantri || currentSantri?.ayahNama || sessionUser?.name || '—'"
              icon="ph:user-circle-duotone"
              color="green"
            />

            <InfoMiniCard
              label="Nomor HP"
              :value="currentSantri?.nohp || currentSantri?.wali_nohp || sessionUser?.waliPhone || '—'"
              icon="ph:whatsapp-logo-duotone"
              color="green"
            />

            <InfoMiniCard
              label="Alamat"
              :value="currentSantri?.alamat || '—'"
              icon="ph:map-pin-duotone"
              color="amber"
            />

            <InfoMiniCard
              label="Data Update"
              :value="lastRealtimeLabel"
              icon="ph:clock-duotone"
              color="purple"
            />
          </div>
        </div>

        <!-- AI Main Insight -->
        <div class="relative overflow-hidden rounded-[32px] border border-green-100 bg-gradient-to-br from-slate-950 via-green-950 to-green-900 p-5 text-white shadow-sm dark:border-neutral-800">
          <div class="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-green-300/20 blur-3xl"></div>

          <div class="relative z-10">
            <div class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black ring-1 ring-white/15">
              <Icon icon="ph:sparkle-duotone" class="h-4 w-4" />
              AI Insight
            </div>

            <h2 class="mt-4 text-xl font-black">
              {{ aiSummary.title }}
            </h2>

            <p class="mt-2 text-sm leading-6 text-white/75">
              {{ aiSummary.description }}
            </p>

            <div class="mt-5">
              <div class="flex items-center justify-between text-xs font-bold text-white/70">
                <span>Performance Score</span>
                <span>{{ performanceScore }}/100</span>
              </div>

              <div class="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-lime-300 to-green-400 transition-all duration-500"
                  :style="{ width: performanceScore + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Akademik"
          :value="academicAverageDisplay"
          suffix="/ 100"
          :desc="academicDescription"
          icon="solar:chart-linear"
          color="green"
          :progress="academicAverage"
        />

        <MetricCard
          label="Kehadiran"
          :value="attendanceRate"
          suffix="%"
          :desc="`${attendanceStats.hadir} hadir dari ${attendanceRows.length} data absensi`"
          icon="hugeicons:note-03"
          color="green"
          :progress="attendanceRate"
        />

        <MetricCard
          label="Pelanggaran"
          :value="violationRows.length"
          suffix="catatan"
          :desc="violationRows.length ? 'Perlu monitoring pembinaan' : 'Tidak ada catatan berat'"
          icon="mingcute:fault-line"
          color="rose"
          :progress="violationHealthScore"
        />

        <MetricCard
          label="Pembayaran"
          :value="formatMoney(unpaidTotal)"
          suffix=""
          :desc="unpaidTotal > 0 ? 'Masih ada tagihan belum lunas' : 'Tidak ada tagihan aktif'"
          icon="akar-icons:money"
          color="amber"
          :progress="paymentHealthScore"
        />
      </div>

      <!-- AI Insight Cards -->
      <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-black text-slate-900 dark:text-white">
              AI Insight Perkembangan
            </h2>
            <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
              Analisis otomatis berdasarkan nilai, absensi, pelanggaran, dan tagihan.
            </p>
          </div>

          <span class="rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
            {{ aiInsights.length }} insight
          </span>
        </div>

        <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <div
            v-for="insight in aiInsights"
            :key="insight.title"
            :class="['rounded-[26px] border p-4', insight.cardClass]"
          >
            <div class="flex items-start gap-3">
              <div :class="['grid h-11 w-11 shrink-0 place-items-center rounded-2xl', insight.iconClass]">
                <Icon :icon="insight.icon" class="h-5 w-5" />
              </div>

              <div class="min-w-0">
                <h3 class="font-black text-slate-900 dark:text-white">
                  {{ insight.title }}
                </h3>

                <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                  {{ insight.desc }}
                </p>

                <div class="mt-2 text-xs font-bold text-slate-400 dark:text-neutral-500">
                  Prioritas: {{ insight.priority }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Data -->
      <div class="grid gap-4 xl:grid-cols-[1fr,0.9fr]">
        <!-- Academic -->
        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 class="text-base font-black text-slate-900 dark:text-white">
                Akademik & Nilai
              </h2>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                Ringkasan nilai mata pelajaran realtime.
              </p>
            </div>

            <span class="rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
              {{ gradeSubjects.length }} data
            </span>
          </div>

          <div v-if="gradeSubjects.length === 0" class="rounded-[26px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-800/60">
            <div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300">
              <Icon icon="solar:chart-linear" class="h-7 w-7" />
            </div>
            <h3 class="mt-3 font-black text-slate-900 dark:text-white">Belum ada data nilai</h3>
            <p class="mt-1 text-sm text-slate-500 dark:text-neutral-400">Nilai akan tampil otomatis ketika tersedia.</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="grade in gradeSubjects.slice(0, 8)"
              :key="grade.id"
              class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="min-w-0">
                  <div class="truncate font-black text-slate-900 dark:text-white">
                    {{ grade.subject }}
                  </div>
                  <div class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                    {{ grade.term || 'Term belum tersedia' }}
                  </div>
                </div>

                <div class="text-right">
                  <div class="text-lg font-black text-slate-900 dark:text-white">
                    {{ grade.scoreDisplay }}
                  </div>
                  <div class="text-xs font-bold text-slate-400 dark:text-neutral-500">
                    {{ grade.predicate || gradeLevelText(grade.score) }}
                  </div>
                </div>
              </div>

              <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-white dark:bg-neutral-900">
                <div
                  class="h-full rounded-full bg-green-500 transition-all duration-500"
                  :style="{ width: percent(grade.score) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Attendance -->
        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 class="text-base font-black text-slate-900 dark:text-white">
                Absensi & Kehadiran
              </h2>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                Statistik kehadiran terbaru.
              </p>
            </div>

            <span class="rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300">
              {{ attendanceRows.length }} data
            </span>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <AttendanceBox label="Hadir" :value="attendanceStats.hadir" color="green" />
            <AttendanceBox label="Izin" :value="attendanceStats.izin" color="green" />
            <AttendanceBox label="Sakit" :value="attendanceStats.sakit" color="amber" />
            <AttendanceBox label="Alpa" :value="attendanceStats.alpa" color="rose" />
          </div>

          <div class="mt-4 rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
            <div class="flex items-center justify-between text-sm">
              <span class="font-black text-slate-900 dark:text-white">Rasio Kehadiran</span>
              <span class="font-black text-green-700 dark:text-green-300">{{ attendanceRate }}%</span>
            </div>

            <div class="mt-3 h-3 overflow-hidden rounded-full bg-white dark:bg-neutral-900">
              <div
                class="h-full rounded-full bg-green-500 transition-all duration-500"
                :style="{ width: attendanceRate + '%' }"
              ></div>
            </div>
          </div>

          <div class="mt-4 space-y-3">
            <div
              v-for="row in attendanceRows.slice(0, 4)"
              :key="row._uid"
              class="flex items-center justify-between gap-3 rounded-[22px] border border-slate-100 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div class="min-w-0">
                <div class="truncate text-sm font-bold text-slate-900 dark:text-white">
                  {{ row.keterangan || row.note || row.mapel || 'Absensi' }}
                </div>
                <div class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  {{ formatDate(extractDate(row)) }}
                </div>
              </div>

              <span :class="['rounded-full px-2.5 py-1 text-xs font-black capitalize', attendanceStatusClass(row)]">
                {{ extractStatus(row) || '—' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Violations, Payments, Permissions -->
      <div class="grid gap-4 xl:grid-cols-3">
        <DataPanel
          title="Pelanggaran"
          subtitle="Catatan pembinaan santri"
          icon="mingcute:fault-line"
          color="rose"
          :count="violationRows.length"
        >
          <div v-if="violationRows.length === 0" class="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400">
            Tidak ada catatan pelanggaran.
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="row in violationRows.slice(0, 5)"
              :key="row._uid"
              class="rounded-[24px] border border-rose-100 bg-rose-50/60 p-4 dark:border-rose-900/30 dark:bg-rose-900/10"
            >
              <div class="font-black text-slate-900 dark:text-white">
                {{ row.title || row.namaPelanggaran || row.pelanggaran || row.jenis || 'Catatan Pelanggaran' }}
              </div>
              <p class="mt-1 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                {{ row.deskripsi || row.keterangan || row.note || 'Tidak ada keterangan.' }}
              </p>
              <div class="mt-2 text-xs font-bold text-slate-400 dark:text-neutral-500">
                {{ formatDate(extractDate(row)) }}
              </div>
            </div>
          </div>
        </DataPanel>

        <DataPanel
          title="Pembayaran"
          subtitle="Tagihan dan riwayat keuangan"
          icon="akar-icons:money"
          color="amber"
          :count="paymentRows.length"
        >
          <div class="mb-3 rounded-[24px] border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-900/10">
            <div class="text-xs font-bold text-amber-700 dark:text-amber-300">Total Belum Lunas</div>
            <div class="mt-1 text-xl font-black text-slate-900 dark:text-white">
              {{ formatMoney(unpaidTotal) }}
            </div>
          </div>

          <div v-if="paymentRows.length === 0" class="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400">
            Belum ada data pembayaran.
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="row in paymentRows.slice(0, 5)"
              :key="row._uid"
              class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="truncate font-black text-slate-900 dark:text-white">
                    {{ row.title || row.namaTagihan || row.jenis || row.name || 'Pembayaran' }}
                  </div>
                  <div class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                    {{ formatDate(extractDate(row)) }}
                  </div>
                </div>

                <span :class="['rounded-full px-2.5 py-1 text-xs font-black capitalize', paymentStatusClass(row)]">
                  {{ row.status || paymentStatus(row) }}
                </span>
              </div>

              <div class="mt-2 text-sm font-black text-slate-900 dark:text-white">
                {{ formatMoney(extractAmount(row)) }}
              </div>
            </div>
          </div>
        </DataPanel>

        <DataPanel
          title="Perizinan"
          subtitle="Riwayat izin keluar/sakit"
          icon="solar:letter-linear"
          color="green"
          :count="permissionRows.length"
        >
          <div v-if="permissionRows.length === 0" class="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400">
            Belum ada data perizinan.
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="row in permissionRows.slice(0, 5)"
              :key="row._uid"
              class="rounded-[24px] border border-green-100 bg-green-50/60 p-4 dark:border-green-900/30 dark:bg-green-900/10"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="truncate font-black text-slate-900 dark:text-white">
                    {{ row.title || row.jenis || row.keperluan || 'Perizinan' }}
                  </div>
                  <p class="mt-1 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                    {{ row.alasan || row.keterangan || row.note || 'Tidak ada keterangan.' }}
                  </p>
                </div>

                <span :class="['rounded-full px-2.5 py-1 text-xs font-black capitalize', approvalStatusClass(row)]">
                  {{ row.status || 'diproses' }}
                </span>
              </div>

              <div class="mt-2 text-xs font-bold text-slate-400 dark:text-neutral-500">
                {{ formatDate(extractDate(row)) }}
              </div>
            </div>
          </div>
        </DataPanel>
      </div>

      <!-- Hafalan & Timeline -->
      <div class="grid gap-4 xl:grid-cols-[0.8fr,1fr]">
        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 class="text-base font-black text-slate-900 dark:text-white">
                Hafalan
              </h2>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                Perkembangan hafalan santri.
              </p>
            </div>

            <span class="rounded-full bg-lime-50 px-3 py-1.5 text-xs font-black text-lime-700 dark:bg-lime-900/20 dark:text-lime-300">
              {{ hafalanRows.length }} data
            </span>
          </div>

          <div v-if="hafalanRows.length === 0" class="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400">
            Belum ada data hafalan.
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="row in hafalanRows.slice(0, 6)"
              :key="row._uid"
              class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
            >
              <div class="font-black text-slate-900 dark:text-white">
                {{ row.surah || row.kitab || row.materi || row.title || 'Hafalan' }}
              </div>
              <div class="mt-1 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                {{ row.ayat || row.bab || row.keterangan || row.note || 'Perkembangan hafalan tercatat.' }}
              </div>
              <div class="mt-2 flex items-center justify-between text-xs font-bold text-slate-400 dark:text-neutral-500">
                <span>{{ formatDate(extractDate(row)) }}</span>
                <span>{{ row.predikat || row.status || '—' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 class="text-base font-black text-slate-900 dark:text-white">
                Timeline Perkembangan
              </h2>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                Aktivitas terbaru dari seluruh data santri.
              </p>
            </div>

            <span class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700 dark:bg-neutral-800 dark:text-neutral-300">
              {{ timelineEvents.length }} event
            </span>
          </div>

          <div v-if="timelineEvents.length === 0" class="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400">
            Belum ada aktivitas terbaru.
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="event in timelineEvents.slice(0, 9)"
              :key="event.id"
              class="flex items-start gap-3 rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
            >
              <div :class="['grid h-10 w-10 shrink-0 place-items-center rounded-2xl', event.iconClass]">
                <Icon :icon="event.icon" class="h-5 w-5" />
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <div class="truncate font-black text-slate-900 dark:text-white">
                      {{ event.title }}
                    </div>
                    <p class="mt-1 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                      {{ event.desc }}
                    </p>
                  </div>

                  <div class="shrink-0 text-xs font-bold text-slate-400 dark:text-neutral-500">
                    {{ formatDate(event.date) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div
  v-if="addSantriOpen"
  class="fixed inset-0 z-9999 overflow-y-auto p-4"
  role="dialog"
  aria-modal="true"
>
  <button
    type="button"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm"
    aria-label="Tutup modal"
    @click="closeAddSantriModal"
  ></button>

  <div class="relative z-10 flex min-h-full items-start justify-center">
    <div class="w-full max-w-lg overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
      <div class="border-b border-slate-100 p-5 dark:border-neutral-800">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
              <Icon icon="ph:user-plus-duotone" class="h-4 w-4" />
              Tambah Santri
            </div>

            <h3 class="mt-3 text-xl font-black text-slate-900 dark:text-white">
              Hubungkan Data Santri
            </h3>

            <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
              Masukkan nama santri yang benar. Sistem akan mengecek apakah santri tersebut benar-benar terdaftar dan sesuai dengan data wali.
            </p>
          </div>

          <button
            type="button"
            @click="closeAddSantriModal"
            class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
          >
            <Icon icon="lucide:x" class="h-4 w-4" />
          </button>
        </div>
      </div>

      <form class="space-y-4 p-5" @submit.prevent="submitAddSantri">
        <div>
          <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
            Nama Santri
          </label>

          <div class="relative">
            <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Icon icon="ph:student-duotone" class="h-5 w-5" />
            </span>

            <input
              v-model.trim="addSantriForm.namaSantri"
              type="text"
              required
              placeholder="Contoh: Ahmad Zainuddin"
              class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:ring-green-500/10"
            />
          </div>

          <p class="mt-2 text-xs leading-5 text-slate-500 dark:text-neutral-400">
            Nama harus sesuai dengan data santri yang tersimpan di sistem.
          </p>
        </div>

        <div
          v-if="addSantriError"
          class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300"
        >
          {{ addSantriError }}
        </div>

        <div
          v-if="addSantriSuccess"
          class="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700 dark:border-green-900/40 dark:bg-green-900/10 dark:text-green-300"
        >
          {{ addSantriSuccess }}
        </div>

        <div class="grid gap-2 sm:grid-cols-[0.75fr,1fr]">
          <button
            type="button"
            @click="closeAddSantriModal"
            class="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Batal
          </button>

          <button
            type="submit"
            :disabled="addSantriLoading"
            class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon
              v-if="addSantriLoading"
              icon="ph:spinner-gap-duotone"
              class="h-5 w-5 animate-spin"
            />
            <Icon
              v-else
              icon="ph:check-circle-duotone"
              class="h-5 w-5"
            />
            {{ addSantriLoading ? 'Mengecek...' : 'Cek & Tambahkan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
  </section>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { get, onValue, ref as dbRef, update } from 'firebase/database'
import { useNuxtApp, useRuntimeConfig, useState } from 'nuxt/app'

definePageMeta({
  layout: 'wali'
})

const addSantriOpen = ref(false)
const addSantriLoading = ref(false)
const addSantriError = ref('')
const addSantriSuccess = ref('')

const addSantriForm = ref({
  namaSantri: ''
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

type TimelineEvent = {
  id: string
  title: string
  desc: string
  date: number
  icon: string
  iconClass: string
}

const InfoMiniCard = defineComponent({
  name: 'InfoMiniCard',
  props: {
    label: { type: String, required: true },
    value: { type: [String, Number], default: '—' },
    icon: { type: String, required: true },
    color: { type: String, default: 'green' }
  },
  setup(props) {
    const colorClass = computed(() => {
      if (props.color === 'green') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
      if (props.color === 'amber') return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
      if (props.color === 'purple') return 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
      return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })

    return () =>
      h('div', { class: 'rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60' }, [
        h('div', { class: 'flex items-center gap-3' }, [
          h('div', { class: ['grid h-11 w-11 shrink-0 place-items-center rounded-2xl', colorClass.value] }, [
            h(Icon, { icon: props.icon, class: 'h-5 w-5' })
          ]),
          h('div', { class: 'min-w-0' }, [
            h('div', { class: 'text-xs font-bold text-slate-500 dark:text-neutral-400' }, props.label),
            h('div', { class: 'mt-0.5 truncate text-sm font-black text-slate-900 dark:text-white' }, String(props.value || '—'))
          ])
        ])
      ])
  }
})

const MetricCard = defineComponent({
  name: 'MetricCard',
  props: {
    label: { type: String, required: true },
    value: { type: [String, Number], required: true },
    suffix: { type: String, default: '' },
    desc: { type: String, default: '' },
    icon: { type: String, required: true },
    color: { type: String, default: 'green' },
    progress: { type: Number, default: 0 }
  },
  setup(props) {
    const iconClass = computed(() => {
      if (props.color === 'green') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
      if (props.color === 'rose') return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
      if (props.color === 'amber') return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
      return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })

    const barClass = computed(() => {
      if (props.color === 'green') return 'bg-green-500'
      if (props.color === 'rose') return 'bg-rose-500'
      if (props.color === 'amber') return 'bg-amber-500'
      return 'bg-green-500'
    })

    return () =>
      h('div', { class: 'rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900' }, [
        h('div', { class: 'flex items-start justify-between gap-3' }, [
          h('div', { class: 'min-w-0' }, [
            h('div', { class: 'text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500' }, props.label),
            h('div', { class: 'mt-2 flex items-end gap-1' }, [
              h('span', { class: 'text-2xl font-black text-slate-900 dark:text-white' }, String(props.value)),
              props.suffix ? h('span', { class: 'pb-1 text-xs font-bold text-slate-400 dark:text-neutral-500' }, props.suffix) : null
            ]),
            h('p', { class: 'mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-neutral-400' }, props.desc)
          ]),
          h('div', { class: ['grid h-12 w-12 shrink-0 place-items-center rounded-2xl', iconClass.value] }, [
            h(Icon, { icon: props.icon, class: 'h-6 w-6' })
          ])
        ]),
        h('div', { class: 'mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800' }, [
          h('div', {
            class: ['h-full rounded-full transition-all duration-500', barClass.value],
            style: { width: Math.max(0, Math.min(100, Number(props.progress || 0))) + '%' }
          })
        ])
      ])
  }
})

const AttendanceBox = defineComponent({
  name: 'AttendanceBox',
  props: {
    label: { type: String, required: true },
    value: { type: Number, default: 0 },
    color: { type: String, default: 'green' }
  },
  setup(props) {
    const boxClass = computed(() => {
      if (props.color === 'green') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
      if (props.color === 'amber') return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
      if (props.color === 'rose') return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
      return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })

    return () =>
      h('div', { class: ['rounded-[24px] p-4 text-center', boxClass.value] }, [
        h('div', { class: 'text-2xl font-black' }, String(props.value)),
        h('div', { class: 'mt-1 text-xs font-bold opacity-80' }, props.label)
      ])
  }
})

function openAddSantriModal() {
  addSantriOpen.value = true
  addSantriError.value = ''
  addSantriSuccess.value = ''
  addSantriForm.value.namaSantri = ''
}

function closeAddSantriModal() {
  addSantriOpen.value = false
  addSantriError.value = ''
  addSantriSuccess.value = ''
  addSantriLoading.value = false
}

function getCurrentWaliUid() {
  return String(
    sessionUser.value?.uid ||
    sessionUser.value?.sub ||
    sessionUser.value?.id ||
    ''
  )
}

function normalizePhoneID(input?: string) {
  let digits = String(input || '').trim().replace(/[^\d]/g, '')

  if (!digits) return ''
  if (digits.startsWith('0062')) digits = '62' + digits.slice(4)
  if (digits.startsWith('62')) return digits[2] === '0' ? '62' + digits.slice(3) : digits
  if (digits.startsWith('8')) return '62' + digits
  if (digits.startsWith('0')) return '62' + digits.slice(1)
  if (digits.startsWith('00')) return digits.slice(2)

  return digits
}

function strictNameSame(a?: string, b?: string) {
  return normalizeText(a) === normalizeText(b)
}

function phoneSame(a?: string, b?: string) {
  const pa = normalizePhoneID(a)
  const pb = normalizePhoneID(b)

  return Boolean(pa && pb && pa === pb)
}

function getRawString(raw: AnyRow, keys: string[]) {
  for (const key of keys) {
    const value = raw?.[key]

    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim()
    }
  }

  return ''
}

function getRawStringList(raw: AnyRow, keys: string[]) {
  return keys
    .map((key) => raw?.[key])
    .filter((value) => value !== undefined && value !== null && String(value).trim())
    .map((value) => String(value).trim())
}

function getSantriNameFromRaw(raw: AnyRow) {
  return getRawString(raw, [
    'santri',
    'nama',
    'namaSantri',
    'name',
    'studentName'
  ])
}

function getWaliNameCandidates(raw: AnyRow) {
  return getRawStringList(raw, [
    'walisantri',
    'wali',
    'waliName',
    'namaWali',
    'ortu',
    'orangtua',
    'orangTua',
    'ayahNama',
    'ayah',
    'namaAyah',
    'ibuNama',
    'ibu',
    'namaIbu'
  ])
}

function getPhoneCandidates(raw: AnyRow) {
  return getRawStringList(raw, [
    'nohp',
    'noHp',
    'no_hp',
    'no_wa',
    'whatsapp',
    'wa',
    'wali_nohp',
    'waliNoHp',
    'wali_whatsapp',
    'phone',
    'telp',
    'telepon',
    'nomorHp',
    'nomor_hp'
  ])
}

function getSessionWaliNames() {
  return [
    sessionUser.value?.name,
    sessionUser.value?.waliName,
    sessionUser.value?.displayName,
    currentSantri.value?.walisantri,
    currentSantri.value?.ayahNama,
    currentSantri.value?.ibuNama
  ]
    .map((value) => String(value || '').trim())
    .filter(Boolean)
}

function getSessionPhones() {
  return [
    sessionUser.value?.phone,
    sessionUser.value?.waliPhone,
    sessionUser.value?.nohp,
    currentSantri.value?.nohp,
    currentSantri.value?.wali_nohp,
    currentSantri.value?.waliPhone
  ]
    .map((value) => String(value || '').trim())
    .filter(Boolean)
}

function santriBelongsToLoggedWali(raw: AnyRow) {
  const sessionPhones = getSessionPhones()
  const sessionNames = getSessionWaliNames()

  const rowPhones = getPhoneCandidates(raw)
  const rowWaliNames = getWaliNameCandidates(raw)

  const phoneMatched =
    sessionPhones.length > 0 &&
    rowPhones.some((rowPhone) => sessionPhones.some((sessionPhone) => phoneSame(rowPhone, sessionPhone)))

  if (phoneMatched) return true

  const nameMatched =
    sessionNames.length > 0 &&
    rowWaliNames.some((rowName) => sessionNames.some((sessionName) => strictNameSame(rowName, sessionName)))

  if (nameMatched) return true

  return false
}

async function findSantriByNameForCurrentWali(namaSantri: string) {
  if (!$realtimeDb) {
    throw new Error('Koneksi database belum tersedia.')
  }

  const snap = await get(dbRef($realtimeDb, `${clientName}/santri`))

  if (!snap.exists()) {
    throw new Error('Data santri belum tersedia.')
  }

  const allSantri = snap.val() || {}
  const matches: SantriProfile[] = []

  for (const [id, rawValue] of Object.entries(allSantri as Record<string, AnyRow>)) {
    const raw = rawValue || {}
    const candidateName = getSantriNameFromRaw(raw)

    if (!strictNameSame(candidateName, namaSantri)) continue
    if (!santriBelongsToLoggedWali(raw)) continue

    matches.push({
      id: String(id),
      _uid: String(id),
      _path: `${clientName}/santri/${id}`,
      ...raw
    })
  }

  if (!matches.length) {
    throw new Error('Nama santri tidak ditemukan atau tidak sesuai dengan data wali yang sedang login.')
  }

  return matches[0]
}

async function submitAddSantri() {
  addSantriError.value = ''
  addSantriSuccess.value = ''

  const namaSantri = addSantriForm.value.namaSantri.trim()

  if (!namaSantri) {
    addSantriError.value = 'Nama santri wajib diisi.'
    return
  }

  const uid = getCurrentWaliUid()

  if (!uid) {
    addSantriError.value = 'UID akun wali tidak ditemukan. Silakan login ulang.'
    return
  }

  addSantriLoading.value = true

  try {
    const foundSantri = await findSantriByNameForCurrentWali(namaSantri)
    const oldIds = resolveSantriIdsFromSession()

    if (oldIds.includes(foundSantri!.id)) {
      selectedSantriId.value = foundSantri!.id
      addSantriSuccess.value = 'Santri ini sudah terhubung. Tampilan dialihkan ke santri tersebut.'

      setTimeout(() => {
        closeAddSantriModal()
      }, 900)

      return
    }

    const newIds = Array.from(new Set([...oldIds, foundSantri!.id]))
    const now = Date.now()

    const updates: Record<string, any> = {
      [`${clientName}/users/${uid}/santriIds`]: newIds,
      [`${clientName}/users/${uid}/santriId`]: newIds[0],
      [`${clientName}/users/${uid}/updatedAt`]: now,

      [`${clientName}/user/${uid}/santriIds`]: newIds,
      [`${clientName}/user/${uid}/santriId`]: newIds[0],
      [`${clientName}/user/${uid}/updatedAt`]: now,

      [`${clientName}/waliUsers/${uid}/santriIds`]: newIds,
      [`${clientName}/waliUsers/${uid}/santriId`]: newIds[0],
      [`${clientName}/waliUsers/${uid}/updatedAt`]: now,

      [`${clientName}/santri/${foundSantri!.id}/wali_uid`]: uid,
      [`${clientName}/santri/${foundSantri!.id}/updatedAt`]: now
    }

    await update(dbRef($realtimeDb), updates)

    sessionUser.value = {
      ...(sessionUser.value || {}),
      santriId: sessionUser.value?.santriId || newIds[0],
      santriIds: newIds
    }

    selectedSantriId.value = foundSantri!.id
    upsertSantriProfile(foundSantri!)
    setupRealtime()

    addSantriSuccess.value = 'Santri berhasil ditambahkan ke akun wali.'

    setTimeout(() => {
      closeAddSantriModal()
    }, 900)
  } catch (e: unknown) {
    const err = e as { message?: string }
    addSantriError.value = err?.message || 'Gagal menambahkan santri.'
  } finally {
    addSantriLoading.value = false
  }
}

const DataPanel = defineComponent({
  name: 'DataPanel',
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    icon: { type: String, required: true },
    color: { type: String, default: 'green' },
    count: { type: Number, default: 0 }
  },
  setup(props, { slots }) {
    const iconClass = computed(() => {
      if (props.color === 'green') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
      if (props.color === 'rose') return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
      if (props.color === 'amber') return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
      return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })

    return () =>
      h('div', { class: 'rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900' }, [
        h('div', { class: 'mb-4 flex items-center justify-between gap-3' }, [
          h('div', { class: 'flex min-w-0 items-center gap-3' }, [
            h('div', { class: ['grid h-11 w-11 shrink-0 place-items-center rounded-2xl', iconClass.value] }, [
              h(Icon, { icon: props.icon, class: 'h-5 w-5' })
            ]),
            h('div', { class: 'min-w-0' }, [
              h('h2', { class: 'truncate text-base font-black text-slate-900 dark:text-white' }, props.title),
              h('p', { class: 'mt-0.5 truncate text-xs text-slate-500 dark:text-neutral-400' }, props.subtitle)
            ])
          ]),
          h('span', { class: 'rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700 dark:bg-neutral-800 dark:text-neutral-300' }, String(props.count))
        ]),
        h('div', {}, slots.default?.())
      ])
  }
})

const config = useRuntimeConfig()
const { $realtimeDb } = useNuxtApp() as any
const sessionUser = useState<any>('sessionUser', () => ({}))

const clientName = String(config.public.clientName || 'alinayah')

const loading = ref(true)
const selectedSantriId = ref('')
const santriProfiles = ref<SantriProfile[]>([])
const lastRealtimeAt = ref<number>(Date.now())

const nilaiRawRows = ref<AnyRow[]>([])
const hafalanRawRows = ref<AnyRow[]>([])
const absensiRawRows = ref<AnyRow[]>([])
const faultRawRows = ref<AnyRow[]>([])
const pelanggaranRawRows = ref<AnyRow[]>([])
const izinRawRows = ref<AnyRow[]>([])
const paymentRawRows = ref<AnyRow[]>([])
const kunjunganRawRows = ref<AnyRow[]>([])

let unsubscribers: Array<() => void> = []
let stopSessionWatch: (() => void) | null = null

const currentSantri = computed(() => {
  return santriProfiles.value.find((item) => item.id === selectedSantriId.value) || santriProfiles.value[0] || null
})

const santriDisplayName = computed(() => santriNameOf(currentSantri.value))

const lastRealtimeLabel = computed(() => {
  return new Intl.DateTimeFormat('id-ID', {
    timeStyle: 'short'
  }).format(new Date(lastRealtimeAt.value))
})

const gradeRows = computed(() => filterRowsForCurrentSantri(nilaiRawRows.value))
const hafalanRows = computed(() => sortRowsByDateDesc(filterRowsForCurrentSantri(hafalanRawRows.value)))
const attendanceRows = computed(() => sortRowsByDateDesc(filterRowsForCurrentSantri(absensiRawRows.value)))
const violationRows = computed(() => sortRowsByDateDesc(filterRowsForCurrentSantri([...faultRawRows.value, ...pelanggaranRawRows.value])))
const permissionRows = computed(() => sortRowsByDateDesc(filterRowsForCurrentSantri(izinRawRows.value)))
const paymentRows = computed(() => sortRowsByDateDesc(filterRowsForCurrentSantri(paymentRawRows.value)))
const kunjunganRows = computed(() => sortRowsByDateDesc(filterRowsForCurrentSantri(kunjunganRawRows.value)))

const gradeSubjects = computed(() => {
  return gradeRows.value
    .map((row, index) => {
      const score = extractGradeScore(row)
      return {
        id: row._uid || String(index),
        subject: row.mapel || row.subject || row.pelajaran || row.namaMapel || row.materi || row.title || `Nilai ${index + 1}`,
        term: row.term || row.semester || row.tahunAjaran || row._term || row._path || '',
        score,
        scoreDisplay: score == null ? '—' : String(score),
        predicate: row.predikat || row.grade || row.keterangan || ''
      }
    })
    .filter((row) => row.score != null)
    .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
})

const academicAverage = computed(() => {
  const values = gradeSubjects.value
    .map((row) => row.score)
    .filter((value) => typeof value === 'number') as number[]

  if (!values.length) return 0

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
})

const academicAverageDisplay = computed(() => {
  return academicAverage.value > 0 ? academicAverage.value : '—'
})

const academicDescription = computed(() => {
  if (!gradeSubjects.value.length) return 'Belum ada nilai yang bisa dianalisis.'
  if (academicAverage.value >= 85) return 'Performa akademik sangat baik.'
  if (academicAverage.value >= 75) return 'Performa akademik cukup stabil.'
  if (academicAverage.value >= 65) return 'Perlu peningkatan belajar rutin.'
  return 'Butuh perhatian khusus pada akademik.'
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

const unpaidTotal = computed(() => {
  return paymentRows.value
    .filter((row) => paymentStatus(row) !== 'lunas')
    .reduce((sum, row) => sum + extractAmount(row), 0)
})

const violationHealthScore = computed(() => {
  if (violationRows.value.length === 0) return 100
  if (violationRows.value.length <= 2) return 75
  if (violationRows.value.length <= 5) return 45
  return 20
})

const paymentHealthScore = computed(() => {
  if (unpaidTotal.value <= 0) return 100
  if (unpaidTotal.value <= 500000) return 70
  if (unpaidTotal.value <= 1500000) return 45
  return 25
})

const performanceScore = computed(() => {
  const academic = academicAverage.value || 70
  const attendance = attendanceRows.value.length ? attendanceRate.value : 75
  const violation = violationHealthScore.value
  const payment = paymentHealthScore.value

  return Math.round((academic * 0.38) + (attendance * 0.28) + (violation * 0.22) + (payment * 0.12))
})

const aiSummary = computed(() => {
  if (performanceScore.value >= 85) {
    return {
      title: 'Perkembangan santri sangat positif',
      description: 'Secara umum, performa santri terlihat stabil. Pertahankan pola belajar, kedisiplinan, dan komunikasi rutin dengan pihak pondok.'
    }
  }

  if (performanceScore.value >= 70) {
    return {
      title: 'Performa cukup baik dan perlu dijaga',
      description: 'Santri berada pada kondisi cukup stabil, namun masih ada beberapa area yang dapat ditingkatkan agar performa lebih konsisten.'
    }
  }

  if (performanceScore.value >= 55) {
    return {
      title: 'Ada beberapa area yang perlu perhatian',
      description: 'Data menunjukkan perlunya monitoring lebih rutin, terutama pada aspek yang nilainya rendah seperti akademik, absensi, atau kedisiplinan.'
    }
  }

  return {
    title: 'Perlu pendampingan lebih intensif',
    description: 'Santri membutuhkan perhatian lebih dekat. Wali disarankan aktif berkomunikasi dengan pengurus atau wali kelas.'
  }
})

const aiInsights = computed<InsightItem[]>(() => {
  const insights: InsightItem[] = []

  if (!gradeSubjects.value.length) {
    insights.push({
      title: 'Data akademik belum lengkap',
      desc: 'Belum ada nilai yang cukup untuk membaca tren akademik santri.',
      icon: 'solar:chart-linear',
      priority: 'Sedang',
      cardClass: 'border-green-100 bg-green-50/70 dark:border-green-900/30 dark:bg-green-900/10',
      iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })
  } else if (academicAverage.value >= 85) {
    insights.push({
      title: 'Akademik sangat baik',
      desc: 'Rata-rata nilai berada pada level tinggi. Fokus berikutnya adalah menjaga konsistensi dan target peningkatan bertahap.',
      icon: 'ph:trend-up-duotone',
      priority: 'Rendah',
      cardClass: 'border-green-100 bg-green-50/70 dark:border-green-900/30 dark:bg-green-900/10',
      iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })
  } else if (academicAverage.value < 70) {
    insights.push({
      title: 'Akademik perlu perhatian',
      desc: 'Rata-rata nilai masih rendah. Disarankan mengecek mata pelajaran dengan nilai terendah dan membuat jadwal belajar rutin.',
      icon: 'ph:warning-circle-duotone',
      priority: 'Tinggi',
      cardClass: 'border-amber-100 bg-amber-50/70 dark:border-amber-900/30 dark:bg-amber-900/10',
      iconClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
    })
  }

  if (attendanceRows.value.length && attendanceRate.value < 80) {
    insights.push({
      title: 'Kehadiran kurang stabil',
      desc: `Rasio kehadiran berada di ${attendanceRate.value}%. Perlu dicek penyebab izin, sakit, atau alpa yang berulang.`,
      icon: 'hugeicons:note-03',
      priority: 'Tinggi',
      cardClass: 'border-rose-100 bg-rose-50/70 dark:border-rose-900/30 dark:bg-rose-900/10',
      iconClass: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
    })
  } else if (attendanceRows.value.length) {
    insights.push({
      title: 'Kehadiran cukup baik',
      desc: `Rasio kehadiran ${attendanceRate.value}%. Tetap pantau agar konsisten dalam kegiatan harian.`,
      icon: 'ph:check-circle-duotone',
      priority: 'Rendah',
      cardClass: 'border-cyan-100 bg-cyan-50/70 dark:border-cyan-900/30 dark:bg-cyan-900/10',
      iconClass: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300'
    })
  }

  if (violationRows.value.length > 0) {
    insights.push({
      title: 'Ada catatan kedisiplinan',
      desc: `Terdapat ${violationRows.value.length} catatan pelanggaran. Wali disarankan memantau perkembangan pembinaan santri.`,
      icon: 'mingcute:fault-line',
      priority: violationRows.value.length >= 3 ? 'Tinggi' : 'Sedang',
      cardClass: 'border-rose-100 bg-rose-50/70 dark:border-rose-900/30 dark:bg-rose-900/10',
      iconClass: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
    })
  } else {
    insights.push({
      title: 'Kedisiplinan baik',
      desc: 'Tidak ada catatan pelanggaran yang terdeteksi pada data saat ini.',
      icon: 'ph:shield-check-duotone',
      priority: 'Rendah',
      cardClass: 'border-green-100 bg-green-50/70 dark:border-green-900/30 dark:bg-green-900/10',
      iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })
  }

  if (unpaidTotal.value > 0) {
    insights.push({
      title: 'Ada tagihan belum lunas',
      desc: `Total tagihan belum lunas sekitar ${formatMoney(unpaidTotal.value)}. Silakan cek menu pembayaran untuk detail.`,
      icon: 'akar-icons:money',
      priority: 'Sedang',
      cardClass: 'border-amber-100 bg-amber-50/70 dark:border-amber-900/30 dark:bg-amber-900/10',
      iconClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
    })
  }

  if (!insights.length) {
    insights.push({
      title: 'Data belum cukup',
      desc: 'Insight akan semakin akurat ketika data akademik, absensi, pembayaran, dan kedisiplinan sudah tersedia.',
      icon: 'ph:sparkle-duotone',
      priority: 'Sedang',
      cardClass: 'border-slate-100 bg-slate-50 dark:border-neutral-800 dark:bg-neutral-800/60',
      iconClass: 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
    })
  }

  return insights
})

const timelineEvents = computed<TimelineEvent[]>(() => {
  const events: TimelineEvent[] = []

  for (const grade of gradeSubjects.value.slice(0, 6)) {
    events.push({
      id: `grade-${grade.id}`,
      title: `Nilai ${grade.subject}`,
      desc: `Nilai tercatat ${grade.scoreDisplay}${grade.predicate ? ` dengan predikat ${grade.predicate}` : ''}.`,
      date: Date.now(),
      icon: 'solar:chart-linear',
      iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })
  }

  for (const row of violationRows.value.slice(0, 5)) {
    events.push({
      id: `violation-${row._uid}`,
      title: row.title || row.namaPelanggaran || row.pelanggaran || 'Catatan Pelanggaran',
      desc: row.deskripsi || row.keterangan || row.note || 'Catatan pembinaan santri.',
      date: extractDate(row),
      icon: 'mingcute:fault-line',
      iconClass: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
    })
  }

  for (const row of permissionRows.value.slice(0, 5)) {
    events.push({
      id: `izin-${row._uid}`,
      title: row.title || row.jenis || 'Perizinan',
      desc: row.alasan || row.keterangan || row.note || 'Riwayat perizinan santri.',
      date: extractDate(row),
      icon: 'solar:letter-linear',
      iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })
  }

  for (const row of paymentRows.value.slice(0, 5)) {
    events.push({
      id: `payment-${row._uid}`,
      title: row.title || row.namaTagihan || row.jenis || 'Pembayaran',
      desc: `${paymentStatus(row)} • ${formatMoney(extractAmount(row))}`,
      date: extractDate(row),
      icon: 'akar-icons:money',
      iconClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
    })
  }

  for (const row of hafalanRows.value.slice(0, 5)) {
    events.push({
      id: `hafalan-${row._uid}`,
      title: row.surah || row.kitab || row.materi || 'Hafalan',
      desc: row.ayat || row.bab || row.keterangan || row.note || 'Perkembangan hafalan santri.',
      date: extractDate(row),
      icon: 'ooui:italic-arab-keheh-jeem',
      iconClass: 'bg-lime-100 text-lime-700 dark:bg-lime-900/20 dark:text-lime-300'
    })
  }

  return events.sort((a, b) => b.date - a.date)
})

function clearSubscriptions() {
  for (const unsubscribe of unsubscribers) {
    try {
      unsubscribe()
    } catch {}
  }

  unsubscribers = []
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

      lastRealtimeAt.value = Date.now()
      loading.value = false
    })

    unsubscribers.push(unsubscribe)
  }

  subscribeDeep(`${clientName}/nilai`, nilaiRawRows)
  subscribeDeep(`${clientName}/grades`, nilaiRawRows)
  subscribeDeep(`${clientName}/hafalan`, hafalanRawRows)
  subscribeDeep(`${clientName}/absen`, absensiRawRows)
  subscribeDeep(`${clientName}/absensi`, absensiRawRows)
  subscribeDeep(`${clientName}/faults`, faultRawRows)
  subscribeDeep(`${clientName}/pelanggaran`, pelanggaranRawRows)
  subscribeDeep(`${clientName}/izin`, izinRawRows)
  subscribeDeep(`${clientName}/perizinan`, izinRawRows)
  subscribeDeep(`${clientName}/payment`, paymentRawRows)
  subscribeDeep(`${clientName}/payments`, paymentRawRows)
  subscribeDeep(`${clientName}/pembayaran`, paymentRawRows)
  subscribeDeep(`${clientName}/kunjungan`, kunjunganRawRows)
}

function subscribeDeep(path: string, target: typeof nilaiRawRows) {
  if (!$realtimeDb) return

  const unsubscribe = onValue(dbRef($realtimeDb, path), (snap) => {
    target.value = flattenRecords(snap.val(), [path], 0)
    lastRealtimeAt.value = Date.now()
  })

  unsubscribers.push(unsubscribe)
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
    'status',
    'tanggal',
    'createdAt',
    'amount',
    'jumlah',
    'pelanggaran',
    'hafalan',
    'surah',
    'mapel',
    'subject'
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

function normalizeText(value?: any) {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function initials(name?: string) {
  const clean = String(name || '').trim()

  if (!clean) return '?'

  return clean
    .split(/\s+/)
    .map((word) => word[0] || '')
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function extractNumber(value: any) {
  const numberValue = Number(String(value ?? '').replace(/[^\d.-]/g, ''))
  return Number.isFinite(numberValue) ? numberValue : undefined
}

function extractGradeScore(row: AnyRow) {
  const direct = extractNumber(row.akhir ?? row.nilaiAkhir ?? row.final ?? row.score ?? row.nilai)

  if (direct != null) return Math.round(direct)

  const components = [
    row.tugas,
    row.harian,
    row.pts,
    row.pas,
    row.uas,
    row.proyek,
    row.praktik,
    row.lainnya
  ]
    .map(extractNumber)
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

function extractAmount(row: AnyRow) {
  return extractNumber(row.amount ?? row.jumlah ?? row.total ?? row.nominal ?? row.tagihan ?? row.sisa) || 0
}

function paymentStatus(row: AnyRow) {
  const status = normalizeText(row.status || row.paymentStatus || row.state)

  if (status.includes('lunas') || status.includes('paid') || status.includes('success')) return 'lunas'
  if (status.includes('pending') || status.includes('menunggu')) return 'pending'
  if (status.includes('belum') || status.includes('unpaid')) return 'belum lunas'

  const amount = extractAmount(row)
  const paid = extractNumber(row.paid ?? row.dibayar ?? row.terbayar) || 0

  if (amount > 0 && paid >= amount) return 'lunas'

  return amount > 0 ? 'belum lunas' : 'lunas'
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value || 0)
}

function formatDate(value?: number) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium'
  }).format(new Date(value))
}

function statusClass(status?: string) {
  const value = normalizeText(status)

  if (value.includes('aktif')) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (value.includes('non')) return 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
  if (value.includes('lulus')) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (value.includes('cuti')) return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'

  return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
}

function attendanceStatusClass(row: AnyRow) {
  const status = normalizeText(extractStatus(row))

  if (status.includes('hadir')) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (status.includes('izin')) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (status.includes('sakit')) return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  if (status.includes('alpa') || status.includes('alpha') || status.includes('tidak hadir')) return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'

  return 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
}

function paymentStatusClass(row: AnyRow) {
  const status = paymentStatus(row)

  if (status === 'lunas') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (status === 'pending') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
}

function approvalStatusClass(row: AnyRow) {
  const status = normalizeText(row.status)

  if (status.includes('setuju') || status.includes('approved') || status.includes('diterima')) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (status.includes('tolak') || status.includes('rejected')) return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
  return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
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