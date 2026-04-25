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
            Permission Request
          </div>

          <h1 class="mt-4 text-2xl font-black tracking-tight md:text-4xl">
            Perizinan Santri
          </h1>

          <p class="mt-2 max-w-xl text-sm leading-6 text-green-50/90 md:text-base">
            Ajukan izin keluar, izin pulang, sakit, atau keperluan khusus santri dengan data yang jelas dan mudah diverifikasi.
          </p>

          <button
            type="button"
            @click="openRequestModal"
            class="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-green-700 shadow-lg shadow-green-900/10 transition hover:bg-green-50"
          >
            <Icon icon="ph:plus-circle-duotone" class="h-5 w-5" />
            Ajukan Izin
          </button>
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
              <div class="text-lg font-black">{{ permissionRows.length }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Total</div>
            </div>

            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ pendingRows.length }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Proses</div>
            </div>

            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ approvedRows.length }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Disetujui</div>
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
                  Total Perizinan
                </div>

                <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {{ permissionRows.length }}
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Semua pengajuan dan riwayat izin.
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
                  Menunggu
                </div>

                <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {{ pendingRows.length }}
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Menunggu validasi admin/pengurus.
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <Icon icon="ph:clock-duotone" class="h-6 w-6" />
              </div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Disetujui
                </div>

                <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {{ approvedRows.length }}
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Izin yang sudah disetujui.
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-lime-50 text-lime-700 dark:bg-lime-900/20 dark:text-lime-300">
                <Icon icon="ph:check-circle-duotone" class="h-6 w-6" />
              </div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Ditolak
                </div>

                <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {{ rejectedRows.length }}
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Perlu dicek alasan penolakan.
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">
                <Icon icon="ph:x-circle-duotone" class="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        <!-- Request Highlight -->
        <div class="grid gap-4 lg:grid-cols-[1fr,0.85fr]">
          <div class="relative overflow-hidden rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-green-100 blur-3xl dark:bg-green-900/20"></div>

            <div class="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div class="min-w-0">
                <div class="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <Icon icon="ph:shield-check-duotone" class="h-4 w-4" />
                  Pengajuan Terstruktur
                </div>

                <h2 class="mt-3 text-lg font-black text-slate-900 dark:text-white">
                  Ajukan izin dengan data yang lengkap
                </h2>

                <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-neutral-400">
                  Lengkapi jenis izin, tanggal, alasan, penjemput, nomor HP, dan lampiran agar proses verifikasi admin lebih cepat.
                </p>
              </div>

              <button
                type="button"
                @click="openRequestModal"
                class="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
              >
                <Icon icon="ph:plus-circle-duotone" class="h-5 w-5" />
                Ajukan Izin
              </button>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h2 class="text-base font-black text-slate-900 dark:text-white">
              Status Terbaru
            </h2>

            <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
              Riwayat perizinan terakhir.
            </p>

            <div class="mt-4 space-y-3">
              <div
                v-if="latestRows.length === 0"
                class="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400"
              >
                Belum ada pengajuan terbaru.
              </div>

              <div
                v-for="row in latestRows"
                v-else
                :key="row._uid"
                class="flex items-center justify-between gap-3 rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
              >
                <div class="min-w-0">
                  <div class="truncate font-black text-slate-900 dark:text-white">
                    {{ permissionTitle(row) }}
                  </div>

                  <div class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                    {{ formatDate(extractStartDate(row)) }}
                  </div>
                </div>

                <span :class="['shrink-0 rounded-full px-2.5 py-1 text-xs font-black capitalize', permissionStatusClass(row)]">
                  {{ permissionStatus(row) }}
                </span>
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
                placeholder="Cari izin pulang, sakit, penjemput, alasan..."
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
              <option value="pulang">Izin Pulang</option>
              <option value="keluar">Izin Keluar</option>
              <option value="sakit">Sakit</option>
              <option value="kegiatan">Kegiatan</option>
              <option value="lainnya">Lainnya</option>
            </select>

            <select
              v-model="filters.status"
              class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="semua">Semua Status</option>
              <option value="menunggu">Menunggu</option>
              <option value="disetujui">Disetujui</option>
              <option value="ditolak">Ditolak</option>
              <option value="selesai">Selesai</option>
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
                  Riwayat Perizinan
                </h2>

                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Menampilkan {{ visibleRows.length }} data perizinan.
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
                <Icon icon="solar:letter-linear" class="h-8 w-8" />
              </div>

              <h3 class="mt-4 text-lg font-black text-slate-900 dark:text-white">
                Perizinan tidak ditemukan
              </h3>

              <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                Coba ubah filter atau ajukan izin baru.
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
                    <div :class="['grid h-12 w-12 shrink-0 place-items-center rounded-2xl', permissionIconClass(row)]">
                      <Icon :icon="permissionIcon(row)" class="h-6 w-6" />
                    </div>

                    <div class="min-w-0">
                      <div class="flex flex-wrap items-center gap-2">
                        <h3 class="truncate text-base font-black text-slate-900 dark:text-white">
                          {{ permissionTitle(row) }}
                        </h3>

                        <span :class="['rounded-full px-2.5 py-1 text-[11px] font-black capitalize', permissionStatusClass(row)]">
                          {{ permissionStatus(row) }}
                        </span>
                      </div>

                      <div class="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-neutral-400">
                        <span>{{ permissionTypeLabel(row) }}</span>
                        <span>•</span>
                        <span>{{ formatDate(extractStartDate(row)) }}</span>
                        <span v-if="extractEndDate(row)">- {{ formatDate(extractEndDate(row)) }}</span>
                        <span v-if="row.penjemput || row.namaPenjemput">•</span>
                        <span v-if="row.penjemput || row.namaPenjemput">
                          Penjemput: {{ row.penjemput || row.namaPenjemput }}
                        </span>
                      </div>

                      <p class="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                        {{ row.alasan || row.keterangan || row.note || row.description || 'Tidak ada keterangan.' }}
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
                  Distribusi Status
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Komposisi status pengajuan izin.
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
                  Panduan Pengajuan
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Agar izin lebih cepat diverifikasi.
                </p>
              </div>

              <div class="space-y-3">
                <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                  <div class="font-black text-slate-900 dark:text-white">Isi tanggal dengan jelas</div>
                  <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                    Gunakan tanggal mulai dan tanggal kembali yang sesuai kebutuhan izin.
                  </p>
                </div>

                <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                  <div class="font-black text-slate-900 dark:text-white">Cantumkan penjemput</div>
                  <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                    Nama dan nomor HP penjemput membantu proses validasi di pondok/sekolah.
                  </p>
                </div>

                <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                  <div class="font-black text-slate-900 dark:text-white">Lampirkan dokumen bila perlu</div>
                  <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                    Untuk izin sakit atau keperluan resmi, tambahkan link surat/dokumen pendukung.
                  </p>
                </div>
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

                <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                  <div class="text-xs font-bold text-slate-500 dark:text-neutral-400">Wali</div>
                  <div class="mt-1 font-black text-slate-900 dark:text-white">
                    {{ currentSantri?.walisantri || currentSantri?.waliName || sessionUser?.name || '—' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>

    <!-- Request Modal -->
    <div
      v-if="requestOpen"
      class="fixed inset-0 z-[9999] overflow-y-auto p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Tutup modal"
        @click="closeRequestModal"
      ></button>

      <div class="relative z-10 flex min-h-full items-start justify-center">
        <div class="w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
          <div class="border-b border-slate-100 p-5 dark:border-neutral-800">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <Icon icon="ph:plus-circle-duotone" class="h-4 w-4" />
                  Form Pengajuan Izin
                </div>

                <h3 class="mt-3 text-xl font-black text-slate-900 dark:text-white">
                  Ajukan Perizinan Santri
                </h3>

                <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                  Pastikan data diisi lengkap agar admin atau pengurus dapat memverifikasi izin dengan cepat.
                </p>
              </div>

              <button
                type="button"
                @click="closeRequestModal"
                class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                <Icon icon="lucide:x" class="h-4 w-4" />
              </button>
            </div>
          </div>

          <form class="max-h-[75vh] space-y-5 overflow-y-auto p-5" @submit.prevent="submitPermissionRequest">
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
                  Santri
                </label>

                <select
                  v-model="form.santriId"
                  required
                  class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                >
                  <option
                    v-for="s in santriProfiles"
                    :key="s.id"
                    :value="s.id"
                  >
                    {{ santriNameOf(s) }}
                  </option>
                </select>
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
                  Jenis Izin
                </label>

                <select
                  v-model="form.type"
                  required
                  class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                >
                  <option value="pulang">Izin Pulang</option>
                  <option value="keluar">Izin Keluar</option>
                  <option value="sakit">Sakit</option>
                  <option value="kegiatan">Kegiatan Keluarga / Sekolah</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
                  Tanggal Mulai
                </label>

                <input
                  v-model="form.startDate"
                  type="datetime-local"
                  required
                  class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
                  Tanggal Kembali / Selesai
                </label>

                <input
                  v-model="form.endDate"
                  type="datetime-local"
                  class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
                  Nama Penjemput
                </label>

                <input
                  v-model.trim="form.pickupName"
                  type="text"
                  placeholder="Contoh: Ahmad Budi"
                  class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
                  Nomor HP Penjemput
                </label>

                <input
                  v-model.trim="form.pickupPhone"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
                  Tujuan / Lokasi
                </label>

                <input
                  v-model.trim="form.destination"
                  type="text"
                  placeholder="Contoh: Rumah keluarga / rumah sakit / acara keluarga"
                  class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
                  Link Lampiran
                </label>

                <input
                  v-model.trim="form.attachmentUrl"
                  type="url"
                  placeholder="https://..."
                  class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
                Alasan / Keperluan Izin
              </label>

              <textarea
                v-model.trim="form.reason"
                rows="4"
                required
                placeholder="Tulis alasan izin dengan jelas agar mudah diverifikasi pengurus."
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              ></textarea>
            </div>

            <div>
              <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
                Catatan Tambahan
              </label>

              <textarea
                v-model.trim="form.note"
                rows="3"
                placeholder="Contoh: akan dijemput setelah Dzuhur, membawa identitas, dan kembali sesuai jadwal."
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              ></textarea>
            </div>

            <div class="rounded-[24px] border border-green-100 bg-green-50 p-4 text-sm leading-6 text-green-800 dark:border-green-900/30 dark:bg-green-900/10 dark:text-green-300">
              <b>Catatan:</b> Pengajuan akan berstatus <b>menunggu</b> sampai diverifikasi oleh admin atau pengurus.
            </div>

            <div
              v-if="formError"
              class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300"
            >
              {{ formError }}
            </div>

            <div class="grid gap-2 sm:grid-cols-[0.75fr,1fr]">
              <button
                type="button"
                @click="closeRequestModal"
                class="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                Batal
              </button>

              <button
                type="submit"
                :disabled="formLoading"
                class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Icon
                  v-if="formLoading"
                  icon="ph:spinner-gap-duotone"
                  class="h-5 w-5 animate-spin"
                />
                <Icon
                  v-else
                  icon="ph:paper-plane-tilt-duotone"
                  class="h-5 w-5"
                />
                {{ formLoading ? 'Mengirim...' : 'Kirim Pengajuan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div
      v-if="detailOpen && selectedPermission"
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

      <div class="relative z-10 flex items-start justify-center">
        <div class="w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
          <div class="border-b border-slate-100 p-5 dark:border-neutral-800">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <Icon icon="solar:letter-linear" class="h-4 w-4" />
                  Detail Perizinan
                </div>

                <h3 class="mt-3 text-xl font-black text-slate-900 dark:text-white">
                  {{ permissionTitle(selectedPermission) }}
                </h3>

                <p class="mt-1 text-sm text-slate-500 dark:text-neutral-400">
                  {{ permissionTypeLabel(selectedPermission) }} • {{ formatDate(extractStartDate(selectedPermission)) }}
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
                Status Pengajuan
              </div>

              <div class="mt-2">
                <span :class="['inline-flex rounded-full px-3 py-1.5 text-sm font-black capitalize', permissionStatusClass(selectedPermission)]">
                  {{ permissionStatus(selectedPermission) }}
                </span>
              </div>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <InfoItem label="Nama Santri" :value="permissionSantriName(selectedPermission)" />
              <InfoItem label="Jenis Izin" :value="permissionTypeLabel(selectedPermission)" />
              <InfoItem label="Tanggal Mulai" :value="formatDateTime(extractStartDate(selectedPermission))" />
              <InfoItem label="Tanggal Kembali" :value="formatDateTime(extractEndDate(selectedPermission))" />
              <InfoItem label="Penjemput" :value="selectedPermission.penjemput || selectedPermission.namaPenjemput || '—'" />
              <InfoItem label="No. HP Penjemput" :value="selectedPermission.nohpPenjemput || selectedPermission.pickupPhone || selectedPermission.phonePenjemput || '—'" />
            </div>

            <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
              <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                Alasan / Keperluan
              </div>

              <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                {{ selectedPermission.alasan || selectedPermission.keperluan || selectedPermission.keterangan || selectedPermission.note || 'Tidak ada keterangan.' }}
              </p>
            </div>

            <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
              <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                Catatan Admin
              </div>

              <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                {{ selectedPermission.adminNote || selectedPermission.catatanAdmin || selectedPermission.rejectionReason || selectedPermission.reasonRejected || 'Belum ada catatan admin.' }}
              </p>
            </div>

            <a
              v-if="selectedPermission.attachmentUrl || selectedPermission.lampiran || selectedPermission.fileUrl"
              :href="selectedPermission.attachmentUrl || selectedPermission.lampiran || selectedPermission.fileUrl"
              target="_blank"
              class="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
            >
              <Icon icon="lucide:external-link" class="h-4 w-4" />
              Buka Lampiran
            </a>
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

    <!-- Success Modal -->
    <div
      v-if="successOpen"
      class="fixed inset-0 z-[9999] overflow-y-auto p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Tutup modal"
        @click="successOpen = false"
      ></button>

      <div class="relative z-10 flex min-h-full items-start justify-center">
        <div class="w-full max-w-md rounded-[32px] border border-green-100 bg-white p-6 text-center shadow-2xl dark:border-green-900/40 dark:bg-neutral-900">
          <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
            <Icon icon="ph:check-circle-duotone" class="h-9 w-9" />
          </div>

          <h3 class="mt-5 text-xl font-black text-slate-900 dark:text-white">
            Pengajuan Terkirim
          </h3>

          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-neutral-300">
            Pengajuan izin berhasil dikirim dan sedang menunggu verifikasi admin atau pengurus.
          </p>

          <button
            type="button"
            @click="successOpen = false"
            class="mt-5 w-full rounded-2xl bg-green-600 px-4 py-3 text-sm font-black text-white transition hover:bg-green-700"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { getDatabase, onValue, push, ref as dbRef, set } from 'firebase/database'
import { useNuxtApp, useRuntimeConfig, useState } from 'nuxt/app'
import { useIzin } from '~/composables/data/useIzin'

const {
  rows,
  error,
  subscribeIzin,
  unsubscribeIzin
} = useIzin()

definePageMeta({
  layout: 'wali'
})

type AnyRow = Record<string, any>

type SantriProfile = AnyRow & {
  id: string
  _uid: string
  _path?: string
}

const InfoItem = defineComponent({
  name: 'InfoItem',
  props: {
    label: { type: String, required: true },
    value: { type: [String, Number], default: '—' }
  },
  setup(props) {
    return () =>
      h('div', { class: 'rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60' }, [
        h('div', { class: 'text-xs font-bold text-slate-400' }, props.label),
        h('div', { class: 'mt-1 font-black text-slate-900 dark:text-white' }, String(props.value || '—'))
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
const permissionRawRows = ref<AnyRow[]>([])

const activeTab = ref<'semua' | 'menunggu' | 'disetujui' | 'ditolak' | 'selesai'>('semua')

const filters = ref({
  q: '',
  type: 'semua',
  status: 'semua',
  period: 'bulan-ini'
})

const requestOpen = ref(false)
const detailOpen = ref(false)
const successOpen = ref(false)
const formLoading = ref(false)
const formError = ref('')
const selectedPermission = ref<AnyRow | null>(null)

const form = ref({
  santriId: '',
  type: 'pulang',
  startDate: '',
  endDate: '',
  pickupName: '',
  pickupPhone: '',
  destination: '',
  attachmentUrl: '',
  reason: '',
  note: ''
})

let unsubscribers: Array<() => void> = []
let stopSessionWatch: (() => void) | null = null
const bucketMap = new Map<string, AnyRow[]>()

const currentSantri = computed(() => {
  return santriProfiles.value.find((item) => item.id === selectedSantriId.value) || santriProfiles.value[0] || null
})

const permissionRows = computed(() => {
  return sortRowsByDateDesc(filterRowsForCurrentSantri(permissionRawRows.value))
})

const pendingRows = computed(() => permissionRows.value.filter((row) => statusMatches(row, 'menunggu')))
const approvedRows = computed(() => permissionRows.value.filter((row) => statusMatches(row, 'disetujui')))
const rejectedRows = computed(() => permissionRows.value.filter((row) => statusMatches(row, 'ditolak')))
const doneRows = computed(() => permissionRows.value.filter((row) => statusMatches(row, 'selesai')))

const filteredRows = computed(() => {
  return permissionRows.value.filter((row) => {
    if (filters.value.type !== 'semua' && !typeMatches(row, filters.value.type)) return false
    if (filters.value.status !== 'semua' && !statusMatches(row, filters.value.status)) return false
    if (!periodMatches(row, filters.value.period)) return false

    if (filters.value.q.trim()) {
      const q = normalizeText(filters.value.q)
      const text = normalizeText([
        permissionTitle(row),
        permissionTypeLabel(row),
        permissionStatus(row),
        row.alasan,
        row.keperluan,
        row.keterangan,
        row.note,
        row.description,
        row.penjemput,
        row.namaPenjemput,
        row.tujuan,
        row.lokasi,
        row.destination
      ].join(' '))

      if (!text.includes(q)) return false
    }

    return true
  })
})

const visibleRows = computed(() => {
  if (activeTab.value === 'menunggu') return filteredRows.value.filter((row) => statusMatches(row, 'menunggu'))
  if (activeTab.value === 'disetujui') return filteredRows.value.filter((row) => statusMatches(row, 'disetujui'))
  if (activeTab.value === 'ditolak') return filteredRows.value.filter((row) => statusMatches(row, 'ditolak'))
  if (activeTab.value === 'selesai') return filteredRows.value.filter((row) => statusMatches(row, 'selesai'))

  return filteredRows.value
})

const latestRows = computed(() => {
  return [...permissionRows.value]
    .sort((a, b) => extractDate(b) - extractDate(a))
    .slice(0, 3)
})

const tabs = computed(() => [
  {
    key: 'semua' as const,
    label: 'Semua',
    count: filteredRows.value.length
  },
  {
    key: 'menunggu' as const,
    label: 'Menunggu',
    count: filteredRows.value.filter((row) => statusMatches(row, 'menunggu')).length
  },
  {
    key: 'disetujui' as const,
    label: 'Disetujui',
    count: filteredRows.value.filter((row) => statusMatches(row, 'disetujui')).length
  },
  {
    key: 'ditolak' as const,
    label: 'Ditolak',
    count: filteredRows.value.filter((row) => statusMatches(row, 'ditolak')).length
  },
  {
    key: 'selesai' as const,
    label: 'Selesai',
    count: filteredRows.value.filter((row) => statusMatches(row, 'selesai')).length
  }
])

const statusDistribution = computed(() => {
  const total = permissionRows.value.length || 1

  return [
    {
      label: 'Menunggu',
      count: pendingRows.value.length,
      percent: Math.round((pendingRows.value.length / total) * 100),
      barClass: 'bg-green-500'
    },
    {
      label: 'Disetujui',
      count: approvedRows.value.length,
      percent: Math.round((approvedRows.value.length / total) * 100),
      barClass: 'bg-green-500'
    },
    {
      label: 'Ditolak',
      count: rejectedRows.value.length,
      percent: Math.round((rejectedRows.value.length / total) * 100),
      barClass: 'bg-rose-500'
    },
    {
      label: 'Selesai',
      count: doneRows.value.length,
      percent: Math.round((doneRows.value.length / total) * 100),
      barClass: 'bg-slate-500'
    }
  ]
})

function resetFilters() {
  filters.value = {
    q: '',
    type: 'semua',
    status: 'semua',
    period: 'bulan-ini'
  }

  activeTab.value = 'semua'
}

function openRequestModal() {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())

  const later = new Date(now)
  later.setHours(later.getHours() + 6)

  form.value = {
    santriId: selectedSantriId.value || currentSantri.value?.id || '',
    type: 'pulang',
    startDate: now.toISOString().slice(0, 16),
    endDate: later.toISOString().slice(0, 16),
    pickupName: sessionUser.value?.name || currentSantri.value?.walisantri || '',
    pickupPhone: sessionUser.value?.waliPhone || sessionUser.value?.phone || currentSantri.value?.nohp || currentSantri.value?.wali_nohp || '',
    destination: '',
    attachmentUrl: '',
    reason: '',
    note: ''
  }

  formError.value = ''
  requestOpen.value = true
}

function closeRequestModal() {
  requestOpen.value = false
  formError.value = ''
  formLoading.value = false
}

function openDetail(row: AnyRow) {
  selectedPermission.value = row
  detailOpen.value = true
}

function closeDetail() {
  selectedPermission.value = null
  detailOpen.value = false
}

async function submitPermissionRequest() {
  formError.value = ''

  if (!form.value.santriId) {
    formError.value = 'Santri wajib dipilih.'
    return
  }

  if (!form.value.startDate) {
    formError.value = 'Tanggal mulai wajib diisi.'
    return
  }

  if (!form.value.reason.trim()) {
    formError.value = 'Alasan izin wajib diisi.'
    return
  }

  const selectedSantri = santriProfiles.value.find((item) => item.id === form.value.santriId)

  if (!selectedSantri) {
    formError.value = 'Data santri tidak ditemukan.'
    return
  }

  formLoading.value = true

  try {
    const db = getDatabase()
    const now = Date.now()
    const startAt = parseDateValue(form.value.startDate)
    const endAt = parseDateValue(form.value.endDate)

    const permissionRef = push(dbRef(db, `${clientName}/perizinan`))

    const payload = {
      id: permissionRef.key,

      santriId: form.value.santriId,
      idSantri: form.value.santriId,
      santri_id: form.value.santriId,
      studentId: form.value.santriId,

      santriName: santriNameOf(selectedSantri),
      namaSantri: santriNameOf(selectedSantri),
      santri: santriNameOf(selectedSantri),

      waliId: sessionUser.value?.uid || sessionUser.value?.sub || '',
      waliName: sessionUser.value?.name || selectedSantri.walisantri || selectedSantri.waliName || '',
      namaWali: sessionUser.value?.name || selectedSantri.walisantri || selectedSantri.waliName || '',
      waliPhone: sessionUser.value?.waliPhone || sessionUser.value?.phone || selectedSantri.nohp || selectedSantri.wali_nohp || '',

      type: form.value.type,
      jenis: permissionTypeText(form.value.type),
      kategori: form.value.type,
      title: permissionTypeText(form.value.type),

      startDate: startAt,
      tanggalMulai: startAt,
      tanggal: startAt,

      endDate: endAt || null,
      tanggalSelesai: endAt || null,
      tanggalKembali: endAt || null,

      destination: form.value.destination,
      tujuan: form.value.destination,
      lokasi: form.value.destination,

      pickupName: form.value.pickupName,
      penjemput: form.value.pickupName,
      namaPenjemput: form.value.pickupName,

      pickupPhone: form.value.pickupPhone,
      nohpPenjemput: form.value.pickupPhone,
      phonePenjemput: form.value.pickupPhone,

      reason: form.value.reason,
      alasan: form.value.reason,
      keperluan: form.value.reason,
      keterangan: form.value.reason,

      note: form.value.note,
      catatan: form.value.note,

      attachmentUrl: form.value.attachmentUrl,
      lampiran: form.value.attachmentUrl,
      fileUrl: form.value.attachmentUrl,

      status: 'menunggu',
      approvalStatus: 'menunggu',
      source: 'wali-request',

      createdBy: sessionUser.value?.uid || sessionUser.value?.sub || '',
      createdAt: now,
      updatedAt: now
    }

    await set(permissionRef, payload)

    closeRequestModal()
    successOpen.value = true
  } catch (e: any) {
    formError.value = e?.message || 'Gagal mengirim pengajuan izin.'
  } finally {
    formLoading.value = false
  }
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

  subscribeDeep(`${clientName}/izin`)
  subscribeDeep(`${clientName}/perizinan`)
  subscribeDeep(`${clientName}/permissions`)
  subscribeDeep(`${clientName}/permissionRequests`)
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

  permissionRawRows.value = rows
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

  if (looksLikePermissionRecord(objectValue)) {
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

function looksLikePermissionRecord(row: AnyRow) {
  const keys = Object.keys(row)

  return keys.some((key) => [
    'santriId',
    'idSantri',
    'santri_id',
    'studentId',
    'namaSantri',
    'santriName',
    'santri',
    'jenis',
    'type',
    'kategori',
    'alasan',
    'keperluan',
    'penjemput',
    'namaPenjemput',
    'tanggalMulai',
    'tanggalKembali',
    'tanggalSelesai',
    'startDate',
    'endDate',
    'status',
    'approvalStatus'
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

function permissionSantriName(row: AnyRow) {
  return row.santriName || row.namaSantri || row.santri || santriNameOf(currentSantri.value)
}

function permissionTitle(row: AnyRow) {
  return row.title || row.jenis || row.type || row.kategori || row.keperluan || 'Pengajuan Izin'
}

function permissionType(row: AnyRow) {
  const text = normalizeText([row.type, row.jenis, row.kategori, row.title, row._path].join(' '))

  if (text.includes('pulang')) return 'pulang'
  if (text.includes('keluar')) return 'keluar'
  if (text.includes('sakit')) return 'sakit'
  if (text.includes('kegiatan')) return 'kegiatan'

  return 'lainnya'
}

function permissionTypeText(type: string) {
  if (type === 'pulang') return 'Izin Pulang'
  if (type === 'keluar') return 'Izin Keluar'
  if (type === 'sakit') return 'Sakit'
  if (type === 'kegiatan') return 'Kegiatan'
  return 'Lainnya'
}

function permissionTypeLabel(row: AnyRow) {
  return permissionTypeText(permissionType(row))
}

function typeMatches(row: AnyRow, target: string) {
  return permissionType(row) === target
}

function permissionStatus(row: AnyRow) {
  const status = normalizeText(row.status || row.approvalStatus || row.state)

  if (status.includes('setuju') || status.includes('approved') || status.includes('diterima')) return 'disetujui'
  if (status.includes('tolak') || status.includes('reject')) return 'ditolak'
  if (status.includes('selesai') || status.includes('done') || status.includes('complete')) return 'selesai'
  if (status.includes('menunggu') || status.includes('pending') || status.includes('proses') || status.includes('review')) return 'menunggu'

  return 'menunggu'
}

function statusMatches(row: AnyRow, target: string) {
  return permissionStatus(row) === target
}

function permissionIcon(row: AnyRow) {
  const type = permissionType(row)

  if (type === 'pulang') return 'ph:house-line-duotone'
  if (type === 'keluar') return 'ph:map-pin-line-duotone'
  if (type === 'sakit') return 'ph:first-aid-kit-duotone'
  if (type === 'kegiatan') return 'ph:calendar-check-duotone'

  return 'solar:letter-linear'
}

function permissionIconClass(row: AnyRow) {
  const status = permissionStatus(row)

  if (status === 'disetujui') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (status === 'ditolak') return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
  if (status === 'selesai') return 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'

  return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
}

function permissionStatusClass(row: AnyRow) {
  const status = permissionStatus(row)

  if (status === 'disetujui') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (status === 'ditolak') return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
  if (status === 'selesai') return 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'

  return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
}

function extractStartDate(row: AnyRow) {
  const candidates = [
    row.startDate,
    row.tanggalMulai,
    row.tanggal,
    row.date,
    row.createdAt
  ]

  for (const value of candidates) {
    const parsed = parseDateValue(value)
    if (parsed) return parsed
  }

  return Date.now()
}

function extractEndDate(row: AnyRow) {
  const candidates = [
    row.endDate,
    row.tanggalKembali,
    row.tanggalSelesai,
    row.selesai,
    row.until
  ]

  for (const value of candidates) {
    const parsed = parseDateValue(value)
    if (parsed) return parsed
  }

  return 0
}

function extractDate(row: AnyRow) {
  return extractStartDate(row)
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

  const date = new Date(extractStartDate(row))
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
  return [...rows].sort((a, b) => extractStartDate(b) - extractStartDate(a))
}

function formatDate(value?: number) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium'
  }).format(new Date(value))
}

function formatDateTime(value?: number) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
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
    'Jenis',
    'Status',
    'Tanggal Mulai',
    'Tanggal Selesai',
    'Penjemput',
    'No HP Penjemput',
    'Alasan',
    'Catatan Admin'
  ]

  const lines = visibleRows.value.map((row) => [
    permissionSantriName(row),
    permissionTypeLabel(row),
    permissionStatus(row),
    formatDateTime(extractStartDate(row)),
    formatDateTime(extractEndDate(row)),
    row.penjemput || row.namaPenjemput || '',
    row.nohpPenjemput || row.pickupPhone || row.phonePenjemput || '',
    row.alasan || row.keperluan || row.keterangan || row.note || '',
    row.adminNote || row.catatanAdmin || row.rejectionReason || ''
  ].map(toCsvCell).join(','))

  const csv = '\uFEFF' + [headers.join(','), ...lines].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })

  saveBlob(blob, 'perizinan_wali.csv')
}

onMounted(() => {
  subscribeIzin()
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
  unsubscribeIzin()
  clearSubscriptions()

  if (stopSessionWatch) {
    stopSessionWatch()
    stopSessionWatch = null
  }
})
</script>