<template>
  <section class="space-y-6 p-4 md:p-6">
    <!-- Hero -->
    <div class="relative overflow-hidden rounded-[32px] border border-green-100 bg-gradient-to-br from-green-600 via-green-600 to-lime-500 p-5 text-white shadow-[0_24px_70px_-28px_rgba(22,163,74,0.55)] dark:border-neutral-800 md:p-7">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-white blur-3xl"></div>
        <div class="absolute -bottom-14 left-8 h-40 w-40 rounded-full bg-lime-200 blur-3xl"></div>
      </div>

      <div class="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div class="min-w-0">
          <div class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold ring-1 ring-white/20 backdrop-blur">
            <span class="h-2 w-2 rounded-full bg-lime-300"></span>
            Permission Management
          </div>

          <h1 class="mt-4 text-2xl font-black tracking-tight md:text-4xl">
            Perizinan Pulang Santri
          </h1>

          <p class="mt-2 max-w-2xl text-sm leading-6 text-green-50/90 md:text-base">
            Kelola izin pulang, waktu keluar-kembali, penjemput, status RFID, histori perizinan, dan cetak surat izin santri.
          </p>
        </div>

        <div class="grid gap-2 rounded-[28px] bg-white/13 p-4 ring-1 ring-white/15 backdrop-blur sm:grid-cols-3 xl:w-[430px]">
          <div class="rounded-2xl bg-white/12 p-3 text-center">
            <div class="text-lg font-black">{{ activeRows.length }}</div>
            <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Aktif</div>
          </div>

          <div class="rounded-2xl bg-white/12 p-3 text-center">
            <div class="text-lg font-black">{{ historyRows.length }}</div>
            <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">History</div>
          </div>

          <div class="rounded-2xl bg-white/12 p-3 text-center">
            <div class="text-lg font-black">{{ outCount }}</div>
            <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Keluar</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="rounded-[32px] border border-white/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            @click="activeTab = 'list'"
            :class="[
              'inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black transition',
              activeTab === 'list'
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200'
            ]"
          >
            <Icon icon="ph:list-checks-duotone" class="h-5 w-5" />
            Daftar Aktif
          </button>

          <button
            type="button"
            @click="activeTab = 'history'"
            :class="[
              'inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black transition',
              activeTab === 'history'
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200'
            ]"
          >
            <Icon icon="ph:clock-counter-clockwise-duotone" class="h-5 w-5" />
            History
          </button>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            @click="openCreate"
            class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
          >
            <Icon icon="ph:plus-bold" class="h-4 w-4" />
            Tambah Izin
          </button>

          <button
            type="button"
            @click="reloadAll"
            class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <Icon icon="ph:arrows-clockwise-duotone" class="h-5 w-5" />
            Muat Ulang
          </button>

          <button
            v-if="activeTab === 'history'"
            type="button"
            @click="exportHistoryCSV"
            class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <Icon icon="ph:download-simple-duotone" class="h-5 w-5" />
            Export CSV
          </button>

          <button
            v-if="activeTab === 'history'"
            type="button"
            :disabled="!historyRows.length || deletingAll"
            @click="openDeleteAllModal"
            class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 text-sm font-black text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon icon="ph:trash-duotone" class="h-5 w-5" />
            Delete All
          </button>
        </div>
      </div>

      <div class="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr,0.65fr,0.65fr,0.65fr,0.65fr]">
        <div class="relative">
          <input
            v-model="filters.q"
            type="search"
            placeholder="Cari santri, maskan, kamar, penjemput, catatan..."
            class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:ring-green-500/10"
          />
          <Icon icon="lucide:search" class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>

        <select v-model="activeTipe" class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
          <option value="ALL">Semua Tipe</option>
          <option value="Putra">Putra</option>
          <option value="Putri">Putri</option>
        </select>

        <select v-model="filters.status" class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
          <option value="">Semua Status</option>
          <option value="approved">Disetujui</option>
          <option value="out">Keluar</option>
          <option value="returned">Sudah Kembali</option>
          <option value="done">Selesai</option>
          <option value="pending">Menunggu</option>
          <option value="rejected">Ditolak</option>
        </select>

        <select v-model="filters.maskan" class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
          <option value="">Semua Maskan</option>
          <option v-for="m in maskanOptions" :key="m" :value="m">{{ m || '(Kosong)' }}</option>
        </select>

        <select v-model="sortPreset" class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
          <option value="requested_desc">Terbaru</option>
          <option value="requested_asc">Terlama</option>
          <option value="name_asc">Nama A-Z</option>
          <option value="name_desc">Nama Z-A</option>
          <option value="return_desc">Kembali Terbaru</option>
        </select>
      </div>
    </div>

    <!-- Path + Stats -->
    <div class="grid gap-4 xl:grid-cols-[0.86fr,1.14fr]">
      <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-black text-slate-900 dark:text-white">Database Path</h2>
            <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
              Data perizinan disimpan sesuai client aktif.
            </p>
          </div>

          <span class="rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
            {{ clientName }}
          </span>
        </div>

        <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
          <div class="text-xs font-bold text-slate-500 dark:text-neutral-400">Path Perizinan</div>
          <div class="mt-1 break-all font-mono text-xs font-black text-slate-900 dark:text-white">
            {{ basePath }}
          </div>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Aktif</div>
          <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">{{ activeRows.length }}</div>
          <p class="mt-2 text-xs font-bold text-slate-500">Belum selesai</p>
        </div>

        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Keluar</div>
          <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">{{ outCount }}</div>
          <p class="mt-2 text-xs font-bold text-slate-500">Status out</p>
        </div>

        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400">History</div>
          <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">{{ historyRows.length }}</div>
          <p class="mt-2 text-xs font-bold text-slate-500">Returned/done</p>
        </div>

        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Hari Ini</div>
          <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">{{ todayCount }}</div>
          <p class="mt-2 text-xs font-bold text-slate-500">Izin baru</p>
        </div>
      </div>
    </div>

    <div v-if="error" class="rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300">
      {{ error }}
    </div>

    <!-- Active Table -->
    <div v-if="activeTab === 'list'" class="hidden rounded-[32px] border border-white/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:block">
      <div class="flex flex-col gap-3 border-b border-slate-100 p-5 dark:border-neutral-800 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 class="text-base font-black text-slate-900 dark:text-white">Perizinan Aktif</h2>
          <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
            Menampilkan {{ pageRows.length }} dari {{ visibleRows.length }} data.
          </p>
        </div>

        <PaginationToolbar
          v-model:page="page"
          v-model:pageSize="pageSize"
          :totalPages="totalPages"
        />
      </div>

      <div v-if="loading" class="p-10 text-center text-sm font-bold text-slate-500">Memuat data...</div>

      <div v-else class="overflow-x-auto pb-[10rem]">
        <table class="w-full min-w-[1120px] text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-400 dark:bg-neutral-950/40">
            <tr>
              <th class="px-5 py-4 font-black">Waktu</th>
              <th class="px-5 py-4 font-black">Santri</th>
              <th class="px-5 py-4 font-black">Status</th>
              <th class="px-5 py-4 font-black">RFID</th>
              <th class="px-5 py-4 font-black">Keluar</th>
              <th class="px-5 py-4 font-black">Kembali</th>
              <th class="px-5 py-4 font-black">Penjemput</th>
              <th class="px-5 py-4 text-right font-black">Aksi</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100 dark:divide-neutral-800">
            <tr v-if="!pageRows.length">
              <td colspan="8" class="px-5 py-12 text-center text-slate-500">Belum ada data perizinan aktif.</td>
            </tr>

            <tr v-for="row in pageRows" :key="row.id" class="transition hover:bg-slate-50 dark:hover:bg-neutral-800/50">
              <td class="px-5 py-4 text-xs font-bold text-slate-500">
                {{ formatDate(row.requestedAt) }}
              </td>

              <td class="px-5 py-4">
                <div class="font-black text-slate-900 dark:text-white">{{ row.name || '-' }}</div>
                <div class="mt-0.5 text-xs font-bold text-slate-500">
                  Maskan {{ row.maskan || '-' }} • Kamar {{ row.kamar || '-' }}
                </div>
              </td>

              <td class="px-5 py-4">
                <span :class="['rounded-full px-3 py-1.5 text-xs font-black', statusBadgeClass(row.status)]">
                  {{ labelStatus(row.status) }}
                </span>
              </td>

              <td class="px-5 py-4">
                <div class="flex items-center gap-2">
                  <span :class="['rounded-full px-3 py-1.5 text-xs font-black', rfidPill(row).cls]">
                    {{ rfidPill(row).label }}
                  </span>
                  <span v-if="rfidPill(row).when" class="text-xs font-bold text-slate-400">
                    {{ rfidPill(row).when }}
                  </span>
                </div>
              </td>

              <td class="px-5 py-4 text-xs font-bold text-slate-500">
                {{ formatDT(outTs(row)) }}
              </td>

              <td class="px-5 py-4 text-xs font-bold text-slate-500">
                {{ formatDT(backTs(row)) }}
              </td>

              <td class="px-5 py-4">
                <div class="font-bold text-slate-900 dark:text-white">{{ row.penjemputNama || '-' }}</div>
                <div class="mt-0.5 text-xs text-slate-500">{{ row.penjemputHubungan || '-' }} • {{ row.penjemputTelp || '-' }}</div>
              </td>

              <td class="px-5 py-4 text-right">
                <div class="relative flex items-center justify-end gap-2" data-action-menu>
                  <button
                    v-if="canApprove(row)"
                    type="button"
                    :disabled="processingId === row.id"
                    @click="approveRequest(row)"
                    class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-xs font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Icon
                      v-if="processingId === row.id"
                      icon="ph:spinner-gap-duotone"
                      class="h-4 w-4 animate-spin"
                    />
                    <Icon
                      v-else
                      icon="ph:check-circle-duotone"
                      class="h-4 w-4"
                    />
                    Izinkan
                  </button>

                  <button
                    v-if="canReject(row)"
                    type="button"
                    :disabled="processingId === row.id"
                    @click="rejectRequest(row)"
                    class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 text-xs font-black text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Icon
                      v-if="processingId === row.id"
                      icon="ph:spinner-gap-duotone"
                      class="h-4 w-4 animate-spin"
                    />
                    <Icon
                      v-else
                      icon="ph:x-circle-duotone"
                      class="h-4 w-4"
                    />
                    Tolak
                  </button>

                  <button
                    type="button"
                    @click.stop="toggleActionMenu(row.id)"
                    class="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    <Icon icon="lucide:more-horizontal" class="h-4 w-4" />
                  </button>

                  <div
                    v-if="openActionMenuId === row.id"
                    class="absolute right-0 top-12 z-40 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 text-left shadow-2xl shadow-slate-900/10 dark:border-neutral-700 dark:bg-neutral-900"
                  >
                    <button
                      type="button"
                      @click="openInfo(row)"
                      class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      <Icon icon="ph:info-duotone" class="h-4 w-4 text-blue-600" />
                      Info
                    </button>

                    <button
                      type="button"
                      @click="printFromMenu(row)"
                      class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      <Icon icon="ph:printer-duotone" class="h-4 w-4 text-green-600" />
                      Print
                    </button>

                    <div class="my-1 h-px bg-slate-100 dark:bg-neutral-800"></div>

                    <button
                      type="button"
                      @click="deleteFromMenu(row)"
                      class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-black text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-900/10"
                    >
                      <Icon icon="ph:trash-duotone" class="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- History Table -->
    <div v-if="activeTab === 'history'" class="hidden overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:block">
      <div class="flex flex-col gap-3 border-b border-slate-100 p-5 dark:border-neutral-800 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 class="text-base font-black text-slate-900 dark:text-white">History Perizinan</h2>
          <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
            Menampilkan {{ pageRows.length }} dari {{ visibleRows.length }} data selesai.
          </p>
        </div>

        <PaginationToolbar
          v-model:page="page"
          v-model:pageSize="pageSize"
          :totalPages="totalPages"
        />
      </div>

      <div v-if="loading" class="p-10 text-center text-sm font-bold text-slate-500">Memuat data...</div>

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[960px] text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-400 dark:bg-neutral-950/40">
            <tr>
              <th class="px-5 py-4 font-black">Nama</th>
              <th class="px-5 py-4 font-black">Lokasi</th>
              <th class="px-5 py-4 font-black">Status</th>
              <th class="px-5 py-4 font-black">Keluar</th>
              <th class="px-5 py-4 font-black">Kembali</th>
              <th class="px-5 py-4 font-black">Catatan</th>
              <th class="px-5 py-4 text-right font-black">Aksi</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100 dark:divide-neutral-800">
            <tr v-if="!pageRows.length">
              <td colspan="7" class="px-5 py-12 text-center text-slate-500">Belum ada history perizinan.</td>
            </tr>

            <tr v-for="row in pageRows" :key="row.id" class="transition hover:bg-slate-50 dark:hover:bg-neutral-800/50">
              <td class="px-5 py-4 font-black text-slate-900 dark:text-white">{{ row.name || '-' }}</td>
              <td class="px-5 py-4 text-xs font-bold text-slate-500">{{ row.maskan || '-' }} • {{ row.kamar || '-' }}</td>
              <td class="px-5 py-4">
                <span :class="['rounded-full px-3 py-1.5 text-xs font-black', statusBadgeClass(row.status)]">
                  {{ labelStatus(row.status) }}
                </span>
              </td>
              <td class="px-5 py-4 text-xs font-bold text-slate-500">{{ formatDT(outTs(row)) }}</td>
              <td class="px-5 py-4 text-xs font-bold text-slate-500">{{ formatDT(backTs(row)) }}</td>
              <td class="px-5 py-4 text-xs text-slate-500">{{ row.note || '-' }}</td>
              <td class="px-5 py-4 text-right">
                <div class="relative flex justify-end" data-action-menu>
                  <button
                    type="button"
                    @click.stop="toggleActionMenu(row.id)"
                    class="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    <Icon icon="lucide:more-horizontal" class="h-4 w-4" />
                  </button>

                  <div
                    v-if="openActionMenuId === row.id"
                    class="absolute right-0 top-12 z-40 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 text-left shadow-2xl shadow-slate-900/10 dark:border-neutral-700 dark:bg-neutral-900"
                  >
                    <button
                      type="button"
                      @click="openInfo(row)"
                      class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      <Icon icon="ph:info-duotone" class="h-4 w-4 text-blue-600" />
                      Info
                    </button>

                    <button
                      type="button"
                      @click="printFromMenu(row)"
                      class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      <Icon icon="ph:printer-duotone" class="h-4 w-4 text-green-600" />
                      Print
                    </button>

                    <div class="my-1 h-px bg-slate-100 dark:bg-neutral-800"></div>

                    <button
                      type="button"
                      @click="deleteFromMenu(row)"
                      class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-black text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-900/10"
                    >
                      <Icon icon="ph:trash-duotone" class="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mobile Cards -->
    <div class="space-y-3 md:hidden">
      <div v-if="loading" class="rounded-[28px] border border-white/80 bg-white p-6 text-center text-sm font-bold text-slate-500 dark:border-neutral-800 dark:bg-neutral-900">
        Memuat data...
      </div>

      <div
        v-for="row in pageRows"
        :key="row.id"
        class="rounded-[28px] border border-white/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="font-black text-slate-900 dark:text-white">{{ row.name || '-' }}</div>
            <div class="mt-0.5 text-xs font-bold text-slate-500">{{ row.maskan || '-' }} • {{ row.kamar || '-' }}</div>
          </div>

          <span :class="['rounded-full px-3 py-1.5 text-xs font-black', statusBadgeClass(row.status)]">
            {{ labelStatus(row.status) }}
          </span>
        </div>

        <div class="mt-4 rounded-[22px] bg-slate-50 p-4 dark:bg-neutral-800/60">
          <div class="grid gap-2 text-xs font-bold text-slate-500">
            <div>Keluar: <span class="text-slate-900 dark:text-white">{{ formatDT(outTs(row)) }}</span></div>
            <div>Kembali: <span class="text-slate-900 dark:text-white">{{ formatDT(backTs(row)) }}</span></div>
            <div>Penjemput: <span class="text-slate-900 dark:text-white">{{ row.penjemputNama || '-' }}</span></div>
          </div>

          <p class="mt-3 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-neutral-400">
            {{ row.note || 'Tidak ada catatan.' }}
          </p>
        </div>

        <div class="mt-4 grid grid-cols-[1fr,1fr,44px] gap-2" data-action-menu>
          <button
            v-if="canApprove(row)"
            type="button"
            :disabled="processingId === row.id"
            @click="approveRequest(row)"
            class="h-11 rounded-2xl bg-green-600 text-sm font-black text-white disabled:opacity-50"
          >
            Izinkan
          </button>

          <button
            v-else
            type="button"
            disabled
            class="h-11 rounded-2xl bg-slate-100 text-sm font-black text-slate-400 dark:bg-neutral-800"
          >
            {{ labelStatus(row.status) }}
          </button>

          <button
            v-if="canReject(row)"
            type="button"
            :disabled="processingId === row.id"
            @click="rejectRequest(row)"
            class="h-11 rounded-2xl bg-rose-600 text-sm font-black text-white disabled:opacity-50"
          >
            Tolak
          </button>

          <button
            v-else
            type="button"
            disabled
            class="h-11 rounded-2xl bg-slate-100 text-sm font-black text-slate-400 dark:bg-neutral-800"
          >
            -
          </button>

          <div class="relative">
            <button
              type="button"
              @click.stop="toggleActionMenu(row.id)"
              class="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            >
              <Icon icon="lucide:more-horizontal" class="h-4 w-4" />
            </button>

            <div
              v-if="openActionMenuId === row.id"
              class="absolute bottom-12 right-0 z-40 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 text-left shadow-2xl dark:border-neutral-700 dark:bg-neutral-900"
            >
              <button
                type="button"
                @click="openInfo(row)"
                class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                <Icon icon="ph:info-duotone" class="h-4 w-4 text-blue-600" />
                Info
              </button>

              <button
                type="button"
                @click="printFromMenu(row)"
                class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                <Icon icon="ph:printer-duotone" class="h-4 w-4 text-green-600" />
                Print
              </button>

              <div class="my-1 h-px bg-slate-100 dark:bg-neutral-800"></div>

              <button
                type="button"
                @click="deleteFromMenu(row)"
                class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-black text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10"
              >
                <Icon icon="ph:trash-duotone" class="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between rounded-[24px] border border-white/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <button type="button" :disabled="page <= 1" @click="page--" class="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-black disabled:opacity-40 dark:border-neutral-700">
          Prev
        </button>

        <div class="text-xs font-black text-slate-500">{{ page }} / {{ totalPages }}</div>

        <button type="button" :disabled="page >= totalPages" @click="page++" class="rounded-2xl bg-green-600 px-4 py-2 text-xs font-black text-white disabled:opacity-40">
          Next
        </button>
      </div>
    </div>

    <!-- Form Modal -->
    <Teleport to="body">
      <div v-if="showForm" class="fixed inset-0 z-[9999] overflow-y-auto p-4">
        <button class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showForm = false"></button>

        <div class="relative z-10 flex min-h-full items-center justify-center">
          <div class="w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3 border-b border-slate-100 p-5 dark:border-neutral-800">
              <div>
                <div class="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <Icon icon="solar:letter-linear" class="h-4 w-4" />
                  {{ formMode === 'create' ? 'Tambah Izin' : 'Edit Izin' }}
                </div>

                <h3 class="mt-3 text-xl font-black text-slate-900 dark:text-white">
                  {{ formMode === 'create' ? 'Tambah Perizinan Pulang' : 'Ubah Perizinan Pulang' }}
                </h3>

                <p class="mt-1 text-sm text-slate-500 dark:text-neutral-400">
                  Pilih santri agar maskan, kamar, alamat, dan data wali terisi otomatis.
                </p>
              </div>

              <button type="button" class="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 dark:bg-neutral-800" @click="showForm = false">
                <Icon icon="lucide:x" class="h-4 w-4" />
              </button>
            </div>

            <form class="max-h-[75vh] space-y-5 overflow-y-auto p-5" @submit.prevent="submitForm">
              <div data-santri-autocomplete>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Nama Santri</label>

                <div class="relative">
                  <input
                    v-model="form.name"
                    type="search"
                    placeholder="Ketik nama santri..."
                    class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    @focus="santriFocused = true"
                    @input="santriSearch = form.name"
                  />

                  <div
                    v-if="(santriFocused || santriSearch) && santriOptions.length"
                    class="absolute z-30 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
                  >
                    <button
                      v-for="s in santriOptions"
                      :key="s.id"
                      type="button"
                      class="w-full rounded-xl px-3 py-2 text-left transition hover:bg-slate-50 dark:hover:bg-neutral-800"
                      @mousedown.prevent="pickFormSantri(s)"
                    >
                      <div class="font-black text-slate-900 dark:text-white">{{ s.santri || s.nama }}</div>
                      <div class="mt-0.5 text-xs font-bold text-slate-500">
                        Maskan {{ s.maskan || '-' }} • Kamar {{ s.kamar || '-' }}
                      </div>
                    </button>
                  </div>
                </div>

                <div v-if="form.santriId" class="mt-1 text-xs font-bold text-slate-500">
                  Santri ID: {{ form.santriId }}
                </div>
              </div>

              <div class="grid gap-3 md:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Maskan</label>
                  <input v-model.trim="form.maskan" disabled class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 text-sm font-medium text-slate-500 outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400" />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Kamar</label>
                  <input v-model.trim="form.kamar" disabled class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 text-sm font-medium text-slate-500 outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400" />
                </div>
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Alamat</label>
                <input v-model.trim="form.alamat" disabled class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 text-sm font-medium text-slate-500 outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400" />
              </div>

              <div class="grid gap-3 md:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Waktu Keluar</label>
                  <input v-model="plannedOutAtInput" type="datetime-local" class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Waktu Kembali</label>
                  <input v-model="plannedReturnAtInput" type="datetime-local" class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                </div>
              </div>

              <div class="grid gap-3 md:grid-cols-3">
                <div>
                  <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Penjemput</label>
                  <input v-model.trim="form.penjemputNama" placeholder="Nama penjemput" class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Hubungan</label>
                  <input v-model.trim="form.penjemputHubungan" placeholder="Wali / Orang tua" class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">No. Telp</label>
                  <input v-model.trim="form.penjemputTelp" placeholder="08xxxxxxxxxx" class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                </div>
              </div>

              <div class="grid gap-3 md:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Status</label>
                  <select v-model="form.status" class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                    <option value="approved">Disetujui</option>
                    <option value="pending">Menunggu</option>
                    <option value="out">Keluar</option>
                    <option value="returned">Sudah Kembali</option>
                    <option value="done">Selesai</option>
                    <option value="rejected">Ditolak</option>
                  </select>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Alasan / Reason</label>
                  <input v-model.trim="form.reason" placeholder="Izin pulang" class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                </div>
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Catatan</label>
                <textarea v-model.trim="form.note" rows="3" placeholder="Catatan tambahan..." class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"></textarea>
              </div>

              <label class="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-200">
                <input v-model="form.cetakOtomatis" type="checkbox" class="checkbox checkbox-success checkbox-sm" />
                Cetak surat otomatis setelah simpan
              </label>

              <div v-if="formError" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300">
                {{ formError }}
              </div>
            </form>

            <div class="flex justify-between gap-2 border-t border-slate-100 p-5 dark:border-neutral-800">
              <button type="button" class="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-black dark:border-neutral-700" @click="showForm = false">
                Batal
              </button>

              <button type="button" :disabled="saving" class="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-2.5 text-sm font-black text-white disabled:opacity-50" @click="submitForm">
                <Icon v-if="saving" icon="ph:spinner-gap-duotone" class="h-5 w-5 animate-spin" />
                <Icon v-else icon="ph:floppy-disk-duotone" class="h-5 w-5" />
                {{ saving ? 'Menyimpan...' : formMode === 'create' ? 'Simpan' : 'Update' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete One Modal -->
    <Teleport to="body">
      <div v-if="showDeleteOneModal" class="fixed inset-0 z-[9999] overflow-y-auto p-4">
        <button class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="cancelDeleteOne"></button>

        <div class="relative z-10 flex min-h-full items-center justify-center">
          <div class="w-full max-w-lg overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start gap-3 border-b border-slate-100 p-5 dark:border-neutral-800">
              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">
                <Icon icon="ph:trash-duotone" class="h-6 w-6" />
              </div>

              <div>
                <h3 class="text-xl font-black text-slate-900 dark:text-white">Hapus Data</h3>
                <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                  Hapus data perizinan <b>{{ deleteTarget?.name || '-' }}</b>?
                </p>
              </div>
            </div>

            <div class="flex justify-between gap-2 p-5">
              <button class="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-black dark:border-neutral-700" :disabled="deletingOne" @click="cancelDeleteOne">
                Batal
              </button>

              <button class="rounded-2xl bg-rose-600 px-5 py-2.5 text-sm font-black text-white disabled:opacity-50" :disabled="deletingOne" @click="confirmDeleteOne">
                {{ deletingOne ? 'Menghapus...' : 'Hapus' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete All Modal -->
    <Teleport to="body">
      <div v-if="showDeleteAllModal" class="fixed inset-0 z-[9999] overflow-y-auto p-4">
        <button class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showDeleteAllModal = false"></button>

        <div class="relative z-10 flex min-h-full items-center justify-center">
          <div class="w-full max-w-lg overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start gap-3 border-b border-slate-100 p-5 dark:border-neutral-800">
              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">
                <Icon icon="ph:trash-duotone" class="h-6 w-6" />
              </div>

              <div>
                <h3 class="text-xl font-black text-slate-900 dark:text-white">Hapus Semua History</h3>
                <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                  Akan menghapus <b>{{ historyRows.length }}</b> data returned/done. Data aktif tidak ikut terhapus.
                </p>
              </div>
            </div>

            <div class="flex justify-between gap-2 p-5">
              <button class="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-black dark:border-neutral-700" :disabled="deletingAll" @click="showDeleteAllModal = false">
                Batal
              </button>

              <button class="rounded-2xl bg-rose-600 px-5 py-2.5 text-sm font-black text-white disabled:opacity-50" :disabled="deletingAll" @click="confirmDeleteAll">
                {{ deletingAll ? 'Menghapus...' : 'Hapus Semua' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showInfoModal && infoTarget" class="fixed inset-0 z-[9999] overflow-y-auto p-4">
        <button class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="closeInfo"></button>

        <div class="relative z-10 flex min-h-full items-center justify-center">
          <div class="w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3 border-b border-slate-100 p-5 dark:border-neutral-800">
              <div>
                <div class="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                  <Icon icon="ph:info-duotone" class="h-4 w-4" />
                  Detail Perizinan
                </div>

                <h3 class="mt-3 text-xl font-black text-slate-900 dark:text-white">
                  {{ infoTarget.name || '-' }}
                </h3>

                <p class="mt-1 text-sm text-slate-500 dark:text-neutral-400">
                  {{ infoTarget.reason || 'Izin pulang' }}
                </p>
              </div>

              <button
                type="button"
                class="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 dark:bg-neutral-800"
                @click="closeInfo"
              >
                <Icon icon="lucide:x" class="h-4 w-4" />
              </button>
            </div>

            <div class="grid gap-3 p-5 md:grid-cols-2">
              <InfoBox label="Status" :value="labelStatus(infoTarget.status)" />
              <InfoBox label="Tanggal Pengajuan" :value="formatDate(infoTarget.requestedAt)" />
              <InfoBox label="Maskan" :value="infoTarget.maskan || '-'" />
              <InfoBox label="Kamar" :value="infoTarget.kamar || '-'" />
              <InfoBox label="Waktu Keluar" :value="formatDT(outTs(infoTarget))" />
              <InfoBox label="Waktu Kembali" :value="formatDT(backTs(infoTarget))" />
              <InfoBox label="Penjemput" :value="infoTarget.penjemputNama || '-'" />
              <InfoBox label="Hubungan" :value="infoTarget.penjemputHubungan || '-'" />
              <InfoBox label="No. Telp" :value="infoTarget.penjemputTelp || '-'" />
              <InfoBox label="Alamat" :value="infoTarget.alamat || '-'" class="md:col-span-2" />
              <InfoBox label="Catatan" :value="infoTarget.note || '-'" class="md:col-span-2" />
            </div>

            <div class="flex justify-end gap-2 border-t border-slate-100 p-5 dark:border-neutral-800">
              <button
                type="button"
                class="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-black text-slate-700 dark:border-neutral-700 dark:text-neutral-200"
                @click="closeInfo"
              >
                Tutup
              </button>

              <button
                type="button"
                class="rounded-2xl bg-green-600 px-5 py-2.5 text-sm font-black text-white"
                @click="printFromMenu(infoTarget)"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast -->
    <div
      v-if="toastMessage"
      class="fixed bottom-24 left-1/2 z-[10001] w-[92%] max-w-sm -translate-x-1/2 rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white shadow-2xl"
    >
      {{ toastMessage }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, defineComponent, h, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useNuxtApp, useRuntimeConfig } from '#app'
import { onValue, push, ref as dbRef, remove, set, update } from 'firebase/database'
import { useSantri } from '~/composables/data/useSantri'
import { useMaskan } from '~/composables/data/useMaskan'
import { useAbsensi } from '~/composables/data/useAbsensi'

definePageMeta({
  layout: 'app',
  layoutProps: { title: 'Perizinan' }
})

type IzinStatus = 'pending' | 'approved' | 'out' | 'returned' | 'done' | 'rejected'
const processingId = ref('')
const openActionMenuId = ref<string | null>(null)
const showInfoModal = ref(false)
const infoTarget = ref<IzinRow | null>(null)
type IzinRow = {
  id: string
  santriId?: string
  name: string
  status: IzinStatus
  requestedAt?: number
  outAt?: number
  returnedAt?: number
  plannedOutAt?: number
  plannedReturnAt?: number
  maskan?: string
  kamar?: string
  alamat?: string
  note?: string
  reason?: string
  penjemputNama?: string
  penjemputHubungan?: string
  penjemputTelp?: string
  createdAt?: number
  updatedAt?: number
}

type SantriRow = Record<string, any> & {
  id: string
  santri?: string
  nama?: string
  maskan?: string
  kamar?: string
  alamat?: string
  walisantri?: string
  nohp?: string
  phone?: string
}

type ExtendedIzinForm = {
  santriId?: string
  name: string
  status: IzinStatus
  maskan?: string
  kamar?: string
  alamat?: string
  note?: string
  reason?: string
  penjemputNama?: string
  penjemputHubungan?: string
  penjemputTelp?: string
  plannedOutAt?: number
  plannedReturnAt?: number
  cetakOtomatis?: boolean
}

const InfoBox = defineComponent({
  name: 'InfoBox',
  props: {
    label: { type: String, required: true },
    value: { type: String, default: '-' }
  },
  setup(props) {
    return () =>
      h('div', {
        class: 'rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60'
      }, [
        h('div', {
          class: 'text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500'
        }, props.label),
        h('div', {
          class: 'mt-2 break-words text-sm font-bold leading-6 text-slate-800 dark:text-neutral-100'
        }, props.value || '-')
      ])
  }
})

const PaginationToolbar = defineComponent({
  name: 'PaginationToolbar',
  props: {
    page: { type: Number, required: true },
    pageSize: { type: Number, required: true },
    totalPages: { type: Number, required: true }
  },
  emits: ['update:page', 'update:pageSize'],
  setup(props, { emit }) {
    return () =>
      h('div', { class: 'flex flex-wrap items-center gap-2' }, [
        h('select', {
          value: props.pageSize,
          class: 'h-10 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200',
          onChange: (event: Event) => emit('update:pageSize', Number((event.target as HTMLSelectElement).value))
        }, [
          h('option', { value: 10 }, '10 / halaman'),
          h('option', { value: 20 }, '20 / halaman'),
          h('option', { value: 50 }, '50 / halaman'),
          h('option', { value: 100 }, '100 / halaman')
        ]),
        h('button', {
          type: 'button',
          disabled: props.page <= 1,
          class: 'h-10 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200',
          onClick: () => emit('update:page', props.page - 1)
        }, 'Prev'),
        h('div', { class: 'text-xs font-black text-slate-500 dark:text-neutral-400' }, `${props.page} / ${props.totalPages}`),
        h('button', {
          type: 'button',
          disabled: props.page >= props.totalPages,
          class: 'h-10 rounded-2xl bg-green-600 px-4 text-xs font-black text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40',
          onClick: () => emit('update:page', props.page + 1)
        }, 'Next')
      ])
  }
})

const config = useRuntimeConfig()
const { $realtimeDb } = useNuxtApp() as any

const clientName = String(config.public.clientName || 'alinayah')
const clientDisplayName = String(config.public.clientDisplayName || config.public.siteName || 'Pondok Pesantren')
const basePath = `${clientName}/perizinan`
const legacyPath = `${clientName}/izin`
const livePath = `${clientName}/rfidLive`

const izinRows = ref<IzinRow[]>([])
const loading = ref(true)
const error = ref('')

const { rows: santri, fetchSantri, subscribeSantri, unsubscribeSantri } = useSantri() as any
const { rows: maskan, fetchMaskan } = useMaskan() as any
const { live, subscribeLive } = useAbsensi() as any

const activeTab = ref<'list' | 'history'>('list')
const activeTipe = ref<'ALL' | 'Putra' | 'Putri'>('ALL')
const sortPreset = ref<'requested_desc' | 'requested_asc' | 'name_asc' | 'name_desc' | 'return_desc'>('requested_desc')

const filters = reactive({
  q: '',
  status: '',
  maskan: ''
})

const page = ref(1)
const pageSize = ref(20)

const showForm = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const saving = ref(false)
const formError = ref('')
const current = ref<IzinRow | null>(null)

const form = ref<ExtendedIzinForm>({
  name: '',
  status: 'approved',
  santriId: '',
  maskan: '',
  kamar: '',
  alamat: '',
  note: '',
  reason: 'Izin pulang',
  penjemputNama: '',
  penjemputHubungan: '',
  penjemputTelp: '',
  plannedOutAt: undefined,
  plannedReturnAt: undefined,
  cetakOtomatis: true
})

const plannedOutAtInput = ref('')
const plannedReturnAtInput = ref('')
const santriSearch = ref('')
const santriFocused = ref(false)

const showDeleteOneModal = ref(false)
const deletingOne = ref(false)
const deleteTarget = ref<IzinRow | null>(null)

const showDeleteAllModal = ref(false)
const deletingAll = ref(false)

const toastMessage = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null
let unsubscribeIzin: (() => void) | null = null
let unsubscribeLiveFallback: (() => void) | null = null
let unsubscribeAbsensiLive: (() => void) | null = null

const SURAT_HEADER = computed(() => ({
  title: 'Surat Perizinan',
  pondok: clientDisplayName,
  alamat: String(config.public.siteDescription || 'Lembaga Pendidikan'),
  telp: String(config.public.contactPhone || config.public.phone || '-'),
  logo: '/logo.png'
}))

const maskanOptions = computed(() => {
  const set = new Set<string>()

  for (const row of izinRows.value) {
    if (row.maskan) set.add(row.maskan)
  }

  for (const row of santri.value as SantriRow[]) {
    if (row.maskan) set.add(row.maskan)
  }

  return Array.from(set).sort((a, b) => a.localeCompare(b, 'id'))
})

const visibleRows = computed(() => {
  const q = normalizeText(filters.q)

  let rows = activeTab.value === 'history' ? historyRows.value : activeRows.value

  rows = rows.filter((row) => {
    const tipe = tipeForMaskan(row.maskan)

    if (activeTipe.value !== 'ALL' && tipe !== activeTipe.value) return false
    if (filters.status && row.status !== filters.status) return false
    if (filters.maskan && row.maskan !== filters.maskan) return false

    if (q) {
      const text = normalizeText([
        row.name,
        row.maskan,
        row.kamar,
        row.alamat,
        row.note,
        row.reason,
        row.penjemputNama,
        row.penjemputHubungan,
        row.penjemputTelp
      ].join(' '))

      if (!text.includes(q)) return false
    }

    return true
  })

  rows = [...rows]

  if (sortPreset.value === 'requested_asc') {
    rows.sort((a, b) => Number(a.requestedAt || 0) - Number(b.requestedAt || 0))
  } else if (sortPreset.value === 'name_asc') {
    rows.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'id'))
  } else if (sortPreset.value === 'name_desc') {
    rows.sort((a, b) => String(b.name || '').localeCompare(String(a.name || ''), 'id'))
  } else if (sortPreset.value === 'return_desc') {
    rows.sort((a, b) => Number(backTs(b) || 0) - Number(backTs(a) || 0))
  } else {
    rows.sort((a, b) => Number(b.requestedAt || 0) - Number(a.requestedAt || 0))
  }

  return rows
})

const activeRows = computed(() => {
  return izinRows.value.filter((row) => {
    const status = String(row.status || '').toLowerCase()
    return status !== 'returned' && status !== 'done'
  })
})

const historyRows = computed(() => {
  return izinRows.value
    .filter((row) => ['returned', 'done'].includes(String(row.status || '').toLowerCase()))
    .sort((a, b) => Number(backTs(b) || outTs(b) || b.requestedAt || 0) - Number(backTs(a) || outTs(a) || a.requestedAt || 0))
})

const outCount = computed(() => izinRows.value.filter((row) => row.status === 'out').length)

const todayCount = computed(() => {
  const now = new Date()

  return izinRows.value.filter((row) => {
    const date = new Date(row.requestedAt || 0)

    return date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
  }).length
})

const totalPages = computed(() => Math.max(1, Math.ceil(visibleRows.value.length / pageSize.value)))

const pageRows = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return visibleRows.value.slice(start, start + pageSize.value)
})

const santriOptions = computed(() => {
  const q = normalizeText(santriSearch.value || form.value.name)
  if (!q) return []

  return (santri.value as SantriRow[])
    .filter((s) => normalizeText(`${s.santri || ''} ${s.nama || ''} ${s.maskan || ''} ${s.kamar || ''}`).includes(q))
    .slice(0, 20)
})

const liveSorted = computed(() => {
  const rows = Array.isArray(live.value) ? live.value : []
  return [...rows].sort((a: any, b: any) => Number(b.ts || 0) - Number(a.ts || 0))
})

watch([visibleRows, pageSize, activeTab], () => {
  page.value = 1
})

function subscribeIzin() {
  if (!$realtimeDb) {
    error.value = 'Realtime database belum tersedia.'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''

  if (unsubscribeIzin) {
    try { unsubscribeIzin() } catch {}
    unsubscribeIzin = null
  }

  unsubscribeIzin = onValue(
    dbRef($realtimeDb, basePath),
    (snap) => {
      const value = snap.val() || {}
      const rows: IzinRow[] = []

      for (const [id, raw] of Object.entries(value as Record<string, any>)) {
        rows.push(normalizeIzinRow(id, raw))
      }

      izinRows.value = rows.sort((a, b) => Number(b.requestedAt || 0) - Number(a.requestedAt || 0))
      loading.value = false
    },
    (err) => {
      error.value = err?.message || 'Gagal memuat data perizinan.'
      loading.value = false
    }
  )
}

function normalizeIzinRow(id: string, raw: Record<string, any>): IzinRow {
  return {
    id,
    santriId: raw.santriId || raw.idSantri || '',
    name: raw.name || raw.santri || raw.namaSantri || '',
    status: raw.status || 'approved',
    requestedAt: parseDateValue(raw.requestedAt || raw.createdAt || raw.tanggal),
    outAt: parseDateValue(raw.outAt),
    returnedAt: parseDateValue(raw.returnedAt),
    plannedOutAt: parseDateValue(raw.plannedOutAt || raw.waktuKeluar),
    plannedReturnAt: parseDateValue(raw.plannedReturnAt || raw.waktuKembali),
    maskan: raw.maskan || '',
    kamar: raw.kamar || '',
    alamat: raw.alamat || raw.address || '',
    note: raw.note || raw.catatan || '',
    reason: raw.reason || raw.alasan || 'Izin pulang',
    penjemputNama: raw.penjemputNama || '',
    penjemputHubungan: raw.penjemputHubungan || '',
    penjemputTelp: raw.penjemputTelp || '',
    createdAt: parseDateValue(raw.createdAt),
    updatedAt: parseDateValue(raw.updatedAt)
  }
}

async function reloadAll() {
  subscribeIzin()

  try { await fetchSantri?.() } catch {}
  try { await fetchMaskan?.() } catch {}
}

function openCreate() {
  formMode.value = 'create'
  current.value = null

  form.value = {
    name: '',
    status: 'approved',
    santriId: '',
    maskan: '',
    kamar: '',
    alamat: '',
    note: '',
    reason: 'Izin pulang',
    penjemputNama: '',
    penjemputHubungan: '',
    penjemputTelp: '',
    plannedOutAt: undefined,
    plannedReturnAt: undefined,
    cetakOtomatis: true
  }

  plannedOutAtInput.value = ''
  plannedReturnAtInput.value = ''
  santriSearch.value = ''
  santriFocused.value = false
  formError.value = ''
  showForm.value = true
}

function openEdit(row: IzinRow) {
  current.value = row
  formMode.value = 'edit'

  form.value = {
    santriId: row.santriId || '',
    name: row.name || '',
    status: row.status || 'approved',
    maskan: row.maskan || '',
    kamar: row.kamar || '',
    alamat: row.alamat || resolveSantriFor(row)?.alamat || '',
    note: row.note || '',
    reason: row.reason || 'Izin pulang',
    penjemputNama: row.penjemputNama || '',
    penjemputHubungan: row.penjemputHubungan || '',
    penjemputTelp: row.penjemputTelp || '',
    plannedOutAt: row.plannedOutAt,
    plannedReturnAt: row.plannedReturnAt,
    cetakOtomatis: false
  }

  plannedOutAtInput.value = toLocalInputValue(form.value.plannedOutAt)
  plannedReturnAtInput.value = toLocalInputValue(form.value.plannedReturnAt)
  santriSearch.value = ''
  santriFocused.value = false
  formError.value = ''
  showForm.value = true
}

function pickFormSantri(s: SantriRow) {
  form.value.santriId = s.id
  form.value.name = s.santri || s.nama || ''
  form.value.maskan = s.maskan || ''
  form.value.kamar = s.kamar || ''
  form.value.alamat = s.alamat || ''

  if (!form.value.penjemputNama && s.walisantri) form.value.penjemputNama = s.walisantri
  if (!form.value.penjemputHubungan) form.value.penjemputHubungan = 'Wali'
  if (!form.value.penjemputTelp && (s.nohp || s.phone)) form.value.penjemputTelp = s.nohp || s.phone

  santriSearch.value = ''
  santriFocused.value = false
}

async function submitForm() {
  form.value.plannedOutAt = fromLocalInputValue(plannedOutAtInput.value)
  form.value.plannedReturnAt = fromLocalInputValue(plannedReturnAtInput.value)

  if (!form.value.name?.trim()) {
    formError.value = 'Nama wajib diisi.'
    return
  }

  if (!form.value.maskan?.trim()) {
    formError.value = 'Maskan wajib diisi. Pilih santri dari daftar.'
    return
  }

  if (!form.value.kamar?.trim()) {
    formError.value = 'Kamar wajib diisi. Pilih santri dari daftar.'
    return
  }

  if (form.value.plannedOutAt && form.value.plannedReturnAt && form.value.plannedOutAt > form.value.plannedReturnAt) {
    formError.value = 'Waktu kembali harus setelah waktu keluar.'
    return
  }

  if (!$realtimeDb) {
    formError.value = 'Realtime database belum tersedia.'
    return
  }

  saving.value = true

  try {
    const now = Date.now()

    const payload = cleanObject({
      santriId: form.value.santriId || '',
      name: form.value.name || '',
      santri: form.value.name || '',
      namaSantri: form.value.name || '',
      status: form.value.status || 'approved',
      requestedAt: formMode.value === 'create' ? now : current.value?.requestedAt || now,
      plannedOutAt: form.value.plannedOutAt,
      plannedReturnAt: form.value.plannedReturnAt,
      maskan: form.value.maskan || '',
      kamar: form.value.kamar || '',
      alamat: form.value.alamat || '',
      note: form.value.note || '',
      catatan: form.value.note || '',
      reason: form.value.reason || form.value.note || 'Izin pulang',
      alasan: form.value.reason || form.value.note || 'Izin pulang',
      penjemputNama: form.value.penjemputNama || '',
      penjemputHubungan: form.value.penjemputHubungan || '',
      penjemputTelp: form.value.penjemputTelp || '',
      createdAt: formMode.value === 'create' ? now : current.value?.createdAt || now,
      updatedAt: now
    })

    let savedRow: IzinRow | null = null

    if (formMode.value === 'create') {
      const newRef = push(dbRef($realtimeDb, basePath))

      await set(newRef, {
        ...payload,
        id: newRef.key
      })

      savedRow = normalizeIzinRow(newRef.key || '', { ...payload, id: newRef.key })
      showToast('Perizinan berhasil ditambahkan.')
    } else if (current.value?.id) {
      await update(dbRef($realtimeDb, `${basePath}/${current.value.id}`), payload)
      savedRow = normalizeIzinRow(current.value.id, { ...current.value, ...payload })
      showToast('Perizinan berhasil diperbarui.')
    }

    showForm.value = false

    if (form.value.cetakOtomatis && savedRow) {
      printIzin(savedRow)
    }
  } catch (e: any) {
    formError.value = e?.message || 'Gagal menyimpan data.'
  } finally {
    saving.value = false
  }
}

async function markReturned(id: string) {
  if (!$realtimeDb || !id) return

  try {
    await update(dbRef($realtimeDb, `${basePath}/${id}`), {
      status: 'returned',
      returnedAt: Date.now(),
      updatedAt: Date.now()
    })

    showToast('Status diubah menjadi sudah kembali.')
  } catch (e: any) {
    alert(e?.message || 'Gagal mengubah status.')
  }
}

function canApprove(row: IzinRow) {
  return ['pending', 'rejected', 'menunggu'].includes(String(row.status || '').toLowerCase())
}

function canReject(row: IzinRow) {
  return ['pending', 'approved', 'menunggu'].includes(String(row.status || '').toLowerCase())
}

function toggleActionMenu(id: string) {
  openActionMenuId.value = openActionMenuId.value === id ? null : id
}

function closeActionMenu() {
  openActionMenuId.value = null
}

function openInfo(row: IzinRow) {
  infoTarget.value = row
  showInfoModal.value = true
  closeActionMenu()
}

function closeInfo() {
  showInfoModal.value = false
  infoTarget.value = null
}

function printFromMenu(row: IzinRow) {
  closeActionMenu()
  printIzin(row)
}

function deleteFromMenu(row: IzinRow) {
  closeActionMenu()
  openDelete(row)
}

async function approveRequest(row: IzinRow) {
  if (!$realtimeDb || !row.id) return

  processingId.value = row.id

  try {
    const now = Date.now()

    await update(dbRef($realtimeDb, `${basePath}/${row.id}`), {
      status: 'approved',
      approvedAt: now,
      rejectedAt: null,
      updatedAt: now,
      updatedBy: 'admin'
    })

    showToast('Perizinan berhasil diizinkan.')
  } catch (e: any) {
    alert(e?.message || 'Gagal mengizinkan perizinan.')
  } finally {
    processingId.value = ''
  }
}

async function rejectRequest(row: IzinRow) {
  if (!$realtimeDb || !row.id) return

  processingId.value = row.id

  try {
    const now = Date.now()

    await update(dbRef($realtimeDb, `${basePath}/${row.id}`), {
      status: 'rejected',
      rejectedAt: now,
      updatedAt: now,
      updatedBy: 'admin'
    })

    showToast('Perizinan berhasil ditolak.')
  } catch (e: any) {
    alert(e?.message || 'Gagal menolak perizinan.')
  } finally {
    processingId.value = ''
  }
}

function openDelete(row: IzinRow) {
  deleteTarget.value = row
  showDeleteOneModal.value = true
}

function cancelDeleteOne() {
  if (deletingOne.value) return
  showDeleteOneModal.value = false
  deleteTarget.value = null
}

async function confirmDeleteOne() {
  if (!$realtimeDb || !deleteTarget.value?.id) return

  deletingOne.value = true

  try {
    await remove(dbRef($realtimeDb, `${basePath}/${deleteTarget.value.id}`))
    showDeleteOneModal.value = false
    deleteTarget.value = null
    showToast('Data perizinan berhasil dihapus.')
  } catch (e: any) {
    alert(e?.message || 'Gagal menghapus data.')
  } finally {
    deletingOne.value = false
  }
}

function openDeleteAllModal() {
  if (!historyRows.value.length) return
  showDeleteAllModal.value = true
}

async function confirmDeleteAll() {
  if (!$realtimeDb || !historyRows.value.length) {
    showDeleteAllModal.value = false
    return
  }

  deletingAll.value = true

  try {
    const updates: Record<string, null> = {}

    for (const row of historyRows.value) {
      updates[row.id] = null
    }

    await update(dbRef($realtimeDb, basePath), updates)

    showDeleteAllModal.value = false
    showToast('Semua history berhasil dihapus.')
  } catch (e: any) {
    alert(e?.message || 'Gagal menghapus semua history.')
  } finally {
    deletingAll.value = false
  }
}

function resolveSantriFor(row: IzinRow | ExtendedIzinForm) {
  if ((row as any).santriId) {
    const byId = (santri.value as SantriRow[]).find((s) => s.id === (row as any).santriId)
    if (byId) return byId
  }

  const q = normalizeText((row as any).name)

  if (!q) return null

  return (santri.value as SantriRow[]).find((s) => normalizeText(s.santri || s.nama) === q) || null
}

function tipeForMaskan(name?: string): 'Putra' | 'Putri' | 'Unknown' {
  if (!name) return 'Unknown'

  const found = (maskan.value || []).find((x: any) => normalizeText(x.name || x.nama) === normalizeText(name))

  return found?.tipe || found?.type || 'Unknown'
}

function latestRFIDEvent(row: IzinRow) {
  const sid = row.santriId
  const nm = normalizeText(row.name)

  return liveSorted.value.find((e: any) => {
    return (sid && e.santriId && e.santriId === sid) || normalizeText(e.name || e.santri) === nm
  }) || null
}

function rfidPill(row: IzinRow) {
  const event: any = latestRFIDEvent(row)

  if (!event) {
    return {
      label: '—',
      when: '',
      cls: 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
    }
  }

  const isReturn = String(event.action || '').toLowerCase() === 'return'

  return {
    label: isReturn ? 'Kembali' : 'Keluar',
    when: timeAgo(event.ts),
    cls: isReturn
      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
      : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  }
}

function printIzin(row: IzinRow) {
  const html = buildSuratHTML(row)
  const popup = window.open('', '_blank', 'width=1100,height=520')

  if (!popup) {
    alert('Pop-up diblokir. Izinkan pop-up untuk mencetak.')
    return
  }

  popup.document.open()
  popup.document.write(html)
  popup.document.close()
}

function buildSuratHTML(row: IzinRow) {
  const s = resolveSantriFor(row)
  const alamat = row.alamat?.trim() || s?.alamat?.trim() || '-'
  const telp = row.penjemputTelp?.trim() || s?.nohp?.trim() || s?.phone?.trim() || '-'
  const noSurat = genNomorSurat(row)

  const waktuIzin = row.plannedOutAt || row.outAt || row.requestedAt
  const waktuKembali = row.plannedReturnAt || row.returnedAt

  const header = SURAT_HEADER.value

  const css = `
  <style>
    @page { size: 270mm 120mm; margin: 10mm; }
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    html, body { width: 270mm; height: 120mm; }
    body { font-family: "Courier New", Courier, monospace; font-size: 12pt; color:#000; }
    .wrap { width: 100%; }
    .hdr { display:flex; align-items:flex-start; gap:16px; }
    .hdr .txt { flex:1; }
    .hdr h1 { font-size: 18pt; margin:0; line-height:1.2; font-weight:700; }
    .hdr h2 { font-size: 14pt; margin:2px 0 4px; font-weight:700; }
    .hdr .meta { font-size: 10pt; }
    .logo { width:72px; height:72px; object-fit:contain; }
    .mt12{ margin-top:12px }
    .hr { border-top:1px dashed #000; margin:8px 0; }
    .row { display:flex; gap:8px; margin:2px 0; }
    .lab { width: 200px; }
    .val { flex:1; }
    .sign { display:flex; justify-content:space-between; margin-top:28px; }
    .sign .col { width: 32%; text-align:center; }
    .ttd { margin-top:48px; }
  </style>`

  return `
  <html>
    <head><meta charset="utf-8">${css}</head>
    <body onload="window.focus(); setTimeout(()=>window.print(), 200)">
      <div class="wrap">
        <div class="hdr">
          <div class="txt">
            <h1>${escapeHTML(header.title)}</h1>
            <h2>${escapeHTML(header.pondok)}</h2>
            <div class="meta">${escapeHTML(header.alamat)}<br/>No. Telp ${escapeHTML(header.telp)}</div>
          </div>
          <img src="${header.logo}" class="logo" />
        </div>

        <div class="mt12">
          <div class="row"><div class="lab">No</div><div class="val">: ${escapeHTML(noSurat)}</div></div>
          <div class="row"><div class="lab">Nama</div><div class="val">: ${escapeHTML(row.name || '-')}</div></div>
          <div class="row"><div class="lab">Kamar - Maskan</div><div class="val">: ${escapeHTML(row.kamar || '-')} - ${escapeHTML(row.maskan || '-')}</div></div>
          <div class="row"><div class="lab">Alamat</div><div class="val">: ${escapeHTML(alamat)}</div></div>
          <div class="row"><div class="lab">Penjemput</div><div class="val">: ${escapeHTML(row.penjemputNama || '-')} (${escapeHTML(row.penjemputHubungan || '-')})</div></div>
          <div class="row"><div class="lab">No. Telp</div><div class="val">: ${escapeHTML(telp)}</div></div>
          <div class="row"><div class="lab">Waktu Keluar - Kembali</div><div class="val">: ${escapeHTML(formatDT(waktuIzin))} - ${escapeHTML(formatDT(waktuKembali))}</div></div>
          <div class="row"><div class="lab">Catatan</div><div class="val">: ${escapeHTML(row.note || '-')}</div></div>
        </div>

        <div class="hr"></div>

        <div class="sign">
          <div class="col">
            Pengurus Perizinan
            <div class="ttd">Ttd</div>
          </div>
          <div class="col">
            Wali Santri
            <div class="ttd">Ttd</div>
          </div>
        </div>
      </div>
    </body>
  </html>`
}

function genNomorSurat(row: IzinRow) {
  const date = row.requestedAt ? new Date(row.requestedAt) : new Date()
  const seg = `${String(date.getFullYear()).slice(-2)}${two(date.getMonth() + 1)}${two(date.getDate())}`
  const suffix = (row.id || '').slice(-4).toUpperCase()

  return `SP/${clientName.toUpperCase()}/${seg}/${suffix}`
}

function exportHistoryCSV() {
  const header = ['Nama', 'Maskan', 'Kamar', 'Status', 'Keluar', 'Kembali', 'Catatan']
  const lines = [header.join(',')]

  for (const row of historyRows.value) {
    const cols = [
      row.name,
      row.maskan || '',
      row.kamar || '',
      labelStatus(row.status),
      formatDT(outTs(row)),
      formatDT(backTs(row)),
      row.note || ''
    ].map(csvCell)

    lines.push(cols.join(','))
  }

  const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = `izin_history_${clientName}.csv`
  anchor.click()

  URL.revokeObjectURL(url)
}

function outTs(row: IzinRow) {
  return row.outAt || row.plannedOutAt
}

function backTs(row: IzinRow) {
  return row.returnedAt || row.plannedReturnAt
}

function labelStatus(status?: string) {
  const value = String(status || '').toLowerCase()

  if (value === 'pending') return 'Menunggu'
  if (value === 'approved') return 'Diizinkan'
  if (value === 'rejected') return 'Ditolak'
  if (value === 'out') return 'Keluar'
  if (value === 'returned' || value === 'done') return 'Sudah Kembali'

  return 'Menunggu'
}

function statusBadgeClass(status?: string) {
  const value = String(status || '').toLowerCase()

  if (value === 'returned' || value === 'done') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (value === 'approved') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (value === 'out') return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  if (value === 'rejected') return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'

  return 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
}

function formatDT(timestamp?: number) {
  if (!timestamp) return '—'

  const date = new Date(timestamp)

  return `${two(date.getDate())}/${two(date.getMonth() + 1)}/${date.getFullYear()} ${two(date.getHours())}:${two(date.getMinutes())}`
}

function formatDate(timestamp?: number) {
  if (!timestamp) return '—'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(timestamp))
}

function toLocalInputValue(timestamp?: number) {
  if (!timestamp) return ''

  const date = new Date(timestamp)

  return `${date.getFullYear()}-${two(date.getMonth() + 1)}-${two(date.getDate())}T${two(date.getHours())}:${two(date.getMinutes())}`
}

function fromLocalInputValue(value?: string) {
  if (!value) return undefined

  const parsed = Date.parse(value)

  return Number.isNaN(parsed) ? undefined : parsed
}

function parseDateValue(value: any) {
  if (!value) return undefined

  if (typeof value === 'number') {
    return value < 10_000_000_000 ? value * 1000 : value
  }

  if (typeof value === 'string') {
    const parsed = new Date(value).getTime()
    return Number.isNaN(parsed) ? undefined : parsed
  }

  if (typeof value === 'object') {
    if (value._seconds) return Number(value._seconds) * 1000
    if (typeof value.toMillis === 'function') return value.toMillis()
  }

  return undefined
}

function timeAgo(timestamp?: number) {
  if (!timestamp) return ''

  const diff = Date.now() - timestamp
  const minute = Math.floor(diff / 60000)

  if (minute < 1) return 'baru saja'
  if (minute < 60) return `${minute}m`

  const hour = Math.floor(minute / 60)
  const remaining = minute % 60

  return `${hour}j ${remaining}m`
}

function two(value: number) {
  return String(value).padStart(2, '0')
}

function csvCell(value: unknown) {
  const text = String(value ?? '')

  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }

  return text
}

function cleanObject<T extends Record<string, any>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== undefined)
  ) as T
}

function normalizeText(value?: any) {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeHTML(value?: any) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function showToast(message: string) {
  toastMessage.value = message

  if (toastTimer) clearTimeout(toastTimer)

  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 2200)
}

function onClickOutsideAutocomplete(event: MouseEvent) {
  const target = event.target as HTMLElement

  if (!target.closest('[data-santri-autocomplete]')) {
    santriFocused.value = false
  }
}

onMounted(async () => {
  subscribeIzin()

  try {
    if (subscribeSantri) subscribeSantri()
    else await fetchSantri?.()
  } catch {}

  try { await fetchMaskan?.() } catch {}

  try {
    unsubscribeAbsensiLive = subscribeLive?.(60) || null
  } catch {}

  if (!$realtimeDb && !unsubscribeAbsensiLive) {
    return
  }

  if ($realtimeDb && !unsubscribeAbsensiLive) {
    unsubscribeLiveFallback = onValue(dbRef($realtimeDb, livePath), () => {})
  }

  window.addEventListener('click', onClickOutsideAutocomplete)
})

onBeforeUnmount(() => {
  if (unsubscribeIzin) {
    try { unsubscribeIzin() } catch {}
    unsubscribeIzin = null
  }

  if (unsubscribeLiveFallback) {
    try { unsubscribeLiveFallback() } catch {}
    unsubscribeLiveFallback = null
  }

  if (unsubscribeAbsensiLive) {
    try { unsubscribeAbsensiLive() } catch {}
    unsubscribeAbsensiLive = null
  }

  try { unsubscribeSantri?.() } catch {}

  if (toastTimer) clearTimeout(toastTimer)

  window.removeEventListener('click', onClickOutsideAutocomplete)
})
</script>