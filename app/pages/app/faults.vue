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
            Discipline Management
          </div>

          <h1 class="mt-4 text-2xl font-black tracking-tight md:text-4xl">
            Manajemen Pelanggaran Santri
          </h1>

          <p class="mt-2 max-w-2xl text-sm leading-6 text-green-50/90 md:text-base">
            Kelola catatan pelanggaran, poin kedisiplinan, status pembinaan, tindakan lanjutan, dan histori santri secara realtime.
          </p>
        </div>

        <div class="grid gap-2 rounded-[28px] bg-white/13 p-4 ring-1 ring-white/15 backdrop-blur sm:grid-cols-3 xl:w-[430px]">
          <div class="rounded-2xl bg-white/12 p-3 text-center">
            <div class="text-lg font-black">{{ filteredRows.length }}</div>
            <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Data</div>
          </div>

          <div class="rounded-2xl bg-white/12 p-3 text-center">
            <div class="text-lg font-black">{{ totalPoints }}</div>
            <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Poin</div>
          </div>

          <div class="rounded-2xl bg-white/12 p-3 text-center">
            <div class="text-lg font-black">{{ unresolvedCount }}</div>
            <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Proses</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="rounded-[32px] border border-white/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr,0.7fr,0.7fr,0.7fr,0.7fr,0.7fr]">
        <div class="relative">
          <input
            v-model="filters.q"
            type="search"
            placeholder="Cari santri, jenis, kategori, pelapor..."
            class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:ring-green-500/10"
          />
          <Icon icon="lucide:search" class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>

        <select v-model="filters.maskan" class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
          <option value="">Semua Maskan</option>
          <option v-for="m in maskanOptions" :key="m" :value="m">{{ m || '(Kosong)' }}</option>
        </select>

        <select v-model="filters.kamar" class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
          <option value="">Semua Kamar</option>
          <option v-for="k in kamarOptions" :key="k" :value="k">{{ k || '(Kosong)' }}</option>
        </select>

        <select v-model="filters.status" class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
          <option value="">Semua Status</option>
          <option value="baru">Baru</option>
          <option value="diproses">Diproses</option>
          <option value="selesai">Selesai</option>
        </select>

        <select v-model="filters.kategori" class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
          <option value="">Semua Kategori</option>
          <option value="ringan">Ringan</option>
          <option value="sedang">Sedang</option>
          <option value="berat">Berat</option>
          <option value="sangat berat">Sangat Berat</option>
        </select>

        <select v-model="sortPreset" class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
          <option value="tanggal_desc">Tanggal Terbaru</option>
          <option value="tanggal_asc">Tanggal Terlama</option>
          <option value="poin_desc">Poin Tertinggi</option>
          <option value="santri_asc">Nama A-Z</option>
          <option value="santri_desc">Nama Z-A</option>
          <option value="maskan_asc">Maskan A-Z</option>
        </select>
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          @click="openCreate"
          class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
        >
          <Icon icon="ph:plus-bold" class="h-4 w-4" />
          Tambah Pelanggaran
        </button>

        <button
          type="button"
          @click="reload"
          class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          <Icon icon="ph:arrows-clockwise-duotone" class="h-5 w-5" />
          Muat Ulang
        </button>

        <button
          type="button"
          @click="exportCSV"
          class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          <Icon icon="ph:download-simple-duotone" class="h-5 w-5" />
          Export CSV
        </button>

        <button
          type="button"
          @click="resetFilters"
          class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Info Path + Stats -->
    <div class="grid gap-4 xl:grid-cols-[0.86fr,1.14fr]">
      <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-black text-slate-900 dark:text-white">Database Path</h2>
            <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
              Data disimpan sesuai client aktif.
            </p>
          </div>

          <span class="rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
            {{ clientName }}
          </span>
        </div>

        <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
          <div class="text-xs font-bold text-slate-500 dark:text-neutral-400">Path Pelanggaran</div>
          <div class="mt-1 break-all font-mono text-xs font-black text-slate-900 dark:text-white">
            {{ basePath }}
          </div>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Total Data</div>
          <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">{{ filteredRows.length }}</div>
          <p class="mt-2 text-xs font-bold text-slate-500">Dari {{ faultRows.length }} catatan</p>
        </div>

        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Total Poin</div>
          <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">{{ totalPoints }}</div>
          <p class="mt-2 text-xs font-bold text-slate-500">Akumulasi filter aktif</p>
        </div>

        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Diproses</div>
          <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">{{ unresolvedCount }}</div>
          <p class="mt-2 text-xs font-bold text-slate-500">Belum selesai</p>
        </div>

        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Bulan Ini</div>
          <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">{{ monthlyCount }}</div>
          <p class="mt-2 text-xs font-bold text-slate-500">Catatan terbaru</p>
        </div>
      </div>
    </div>

    <div v-if="error" class="rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300">
      {{ error }}
    </div>

    <!-- Desktop Table -->
    <div class="hidden overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:block">
      <div class="flex flex-col gap-3 border-b border-slate-100 p-5 dark:border-neutral-800 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 class="text-base font-black text-slate-900 dark:text-white">
            Daftar Pelanggaran
          </h2>

          <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
            Menampilkan {{ pageRows.length }} dari {{ filteredRows.length }} data.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <select v-model.number="pageSize" class="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
            <option :value="10">10 / halaman</option>
            <option :value="20">20 / halaman</option>
            <option :value="50">50 / halaman</option>
            <option :value="100">100 / halaman</option>
          </select>

          <button
            type="button"
            :disabled="page <= 1"
            @click="page--"
            class="h-10 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
          >
            Prev
          </button>

          <div class="text-xs font-black text-slate-500 dark:text-neutral-400">
            {{ page }} / {{ totalPages }}
          </div>

          <button
            type="button"
            :disabled="page >= totalPages"
            @click="page++"
            class="h-10 rounded-2xl bg-green-600 px-4 text-xs font-black text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <div v-if="loading" class="p-10 text-center text-sm font-bold text-slate-500">
        Memuat data...
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[1050px] text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-400 dark:bg-neutral-950/40">
            <tr>
              <th class="px-5 py-4 font-black">Tanggal</th>
              <th class="px-5 py-4 font-black">Santri</th>
              <th class="px-5 py-4 font-black">Jenis</th>
              <th class="px-5 py-4 font-black">Kategori</th>
              <th class="px-5 py-4 text-center font-black">Poin</th>
              <th class="px-5 py-4 font-black">Lokasi</th>
              <th class="px-5 py-4 font-black">Status</th>
              <th class="px-5 py-4 text-right font-black">Aksi</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100 dark:divide-neutral-800">
            <tr v-if="!pageRows.length">
              <td colspan="8" class="px-5 py-12 text-center text-slate-500">
                Belum ada data pelanggaran.
              </td>
            </tr>

            <tr
              v-for="row in pageRows"
              :key="row.id"
              class="transition hover:bg-slate-50 dark:hover:bg-neutral-800/50"
            >
              <td class="px-5 py-4 text-xs font-bold text-slate-500">
                {{ fmtDate(row.tanggal) }}
              </td>

              <td class="px-5 py-4">
                <div class="font-black text-slate-900 dark:text-white">{{ row.santri || '-' }}</div>
                <div class="mt-0.5 text-xs font-bold text-slate-500">Jenjang: {{ row.jenjang || '-' }}</div>
              </td>

              <td class="px-5 py-4">
                <div class="font-black text-slate-900 dark:text-white">{{ row.jenis || '-' }}</div>
                <div class="mt-0.5 line-clamp-1 text-xs text-slate-500">{{ row.deskripsi || 'Belum ada deskripsi' }}</div>
              </td>

              <td class="px-5 py-4">
                <span :class="['rounded-full px-3 py-1.5 text-xs font-black capitalize', categoryBadgeClass(row.kategori, row.poin)]">
                  {{ row.kategori || categoryByPoint(row.poin) }}
                </span>
              </td>

              <td class="px-5 py-4 text-center">
                <span :class="['inline-flex min-w-10 justify-center rounded-2xl px-3 py-1.5 text-xs font-black', pointBadgeClass(row.poin)]">
                  {{ row.poin || 0 }}
                </span>
              </td>

              <td class="px-5 py-4 text-xs font-bold text-slate-500">
                {{ row.maskan || '-' }} · {{ row.kamar || '-' }}
              </td>

              <td class="px-5 py-4">
                <span :class="['rounded-full px-3 py-1.5 text-xs font-black capitalize', statusBadgeClass(row.status)]">
                  {{ row.status || 'baru' }}
                </span>
              </td>

              <td class="px-5 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <button
                    type="button"
                    @click="openEdit(row)"
                    class="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    @click="openConfirm(row)"
                    class="inline-flex h-10 items-center justify-center rounded-2xl border border-rose-200 bg-white px-4 text-xs font-black text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/30 dark:bg-neutral-900 dark:hover:bg-rose-900/10"
                  >
                    Hapus
                  </button>
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
            <div class="font-black text-slate-900 dark:text-white">{{ row.santri || '-' }}</div>
            <div class="mt-0.5 text-xs font-bold text-slate-500">{{ fmtDate(row.tanggal) }}</div>
          </div>

          <span :class="['rounded-full px-3 py-1.5 text-xs font-black capitalize', statusBadgeClass(row.status)]">
            {{ row.status || 'baru' }}
          </span>
        </div>

        <div class="mt-4 rounded-[22px] bg-slate-50 p-4 dark:bg-neutral-800/60">
          <div class="font-black text-slate-900 dark:text-white">{{ row.jenis || '-' }}</div>
          <p class="mt-1 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-neutral-400">
            {{ row.deskripsi || 'Belum ada deskripsi.' }}
          </p>

          <div class="mt-3 flex flex-wrap gap-2">
            <span :class="['rounded-full px-3 py-1.5 text-xs font-black capitalize', categoryBadgeClass(row.kategori, row.poin)]">
              {{ row.kategori || categoryByPoint(row.poin) }}
            </span>

            <span :class="['rounded-full px-3 py-1.5 text-xs font-black', pointBadgeClass(row.poin)]">
              {{ row.poin || 0 }} poin
            </span>

            <span class="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-500 dark:bg-neutral-900">
              {{ row.maskan || '-' }} · {{ row.kamar || '-' }}
            </span>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            @click="openEdit(row)"
            class="h-11 rounded-2xl border border-slate-200 text-sm font-black text-slate-700 dark:border-neutral-700 dark:text-neutral-200"
          >
            Edit
          </button>

          <button
            type="button"
            @click="openConfirm(row)"
            class="h-11 rounded-2xl bg-rose-600 text-sm font-black text-white"
          >
            Hapus
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between rounded-[24px] border border-white/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <button
          type="button"
          :disabled="page <= 1"
          @click="page--"
          class="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-black disabled:opacity-40 dark:border-neutral-700"
        >
          Prev
        </button>

        <div class="text-xs font-black text-slate-500">
          {{ page }} / {{ totalPages }}
        </div>

        <button
          type="button"
          :disabled="page >= totalPages"
          @click="page++"
          class="rounded-2xl bg-green-600 px-4 py-2 text-xs font-black text-white disabled:opacity-40"
        >
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
                  <Icon icon="ph:warning-circle-duotone" class="h-4 w-4" />
                  {{ formMode === 'create' ? 'Tambah Data' : 'Edit Data' }}
                </div>

                <h3 class="mt-3 text-xl font-black text-slate-900 dark:text-white">
                  {{ formMode === 'create' ? 'Tambah Pelanggaran' : 'Ubah Pelanggaran' }}
                </h3>

                <p class="mt-1 text-sm text-slate-500 dark:text-neutral-400">
                  Pilih santri agar maskan, kamar, dan jenjang terisi otomatis.
                </p>
              </div>

              <button type="button" class="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 dark:bg-neutral-800" @click="showForm = false">
                <Icon icon="lucide:x" class="h-4 w-4" />
              </button>
            </div>

            <form class="max-h-[75vh] space-y-5 overflow-y-auto p-5" @submit.prevent="submitForm">
              <div data-santri-autocomplete>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Santri</label>

                <div class="relative">
                  <input
                    v-model="santriQuery"
                    type="search"
                    placeholder="Ketik nama santri lalu pilih..."
                    class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    @focus="showSantriSuggest = true"
                    @input="showSantriSuggest = true"
                  />

                  <div
                    v-if="showSantriSuggest && santriQuery.trim()"
                    class="absolute z-30 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
                  >
                    <button
                      v-for="s in santriSuggest"
                      :key="s.id"
                      type="button"
                      class="w-full rounded-xl px-3 py-2 text-left transition hover:bg-slate-50 dark:hover:bg-neutral-800"
                      @click="pickSantri(s)"
                    >
                      <div class="font-black text-slate-900 dark:text-white">{{ s.santri || s.nama }}</div>
                      <div class="mt-0.5 text-xs font-bold text-slate-500">
                        {{ s.maskan || '-' }} • {{ s.kamar || '-' }} • {{ s.jenjang || '-' }}
                      </div>
                    </button>

                    <div v-if="!santriSuggest.length" class="px-3 py-4 text-center text-sm text-slate-500">
                      Santri tidak ditemukan.
                    </div>
                  </div>
                </div>
              </div>

              <div class="grid gap-3 md:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Tanggal & Waktu</label>
                  <input v-model="tanggalInput" type="datetime-local" class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Jenis Pelanggaran</label>
                  <input v-model.trim="form.jenis" placeholder="Contoh: Terlambat, tidak ikut kegiatan..." class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Kategori</label>
                  <select v-model="form.kategori" class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                    <option value="">Pilih kategori</option>
                    <option value="ringan">Ringan</option>
                    <option value="sedang">Sedang</option>
                    <option value="berat">Berat</option>
                    <option value="sangat berat">Sangat Berat</option>
                  </select>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Poin</label>
                  <input v-model.number="form.poin" type="number" min="0" class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                </div>
              </div>

              <div class="grid gap-3 md:grid-cols-3">
                <div>
                  <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Maskan</label>
                  <input v-model.trim="form.maskan" class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Kamar</label>
                  <input v-model.trim="form.kamar" class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Jenjang</label>
                  <input v-model.trim="form.jenjang" class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                </div>
              </div>

              <div class="grid gap-3 md:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Pelapor</label>
                  <input v-model.trim="form.pelapor" placeholder="Nama ustadz/pengurus" class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Status</label>
                  <select v-model="form.status" class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                    <option value="baru">Baru</option>
                    <option value="diproses">Diproses</option>
                    <option value="selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Deskripsi</label>
                <textarea v-model.trim="form.deskripsi" rows="4" placeholder="Detail kejadian pelanggaran..." class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"></textarea>
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Tindakan / Pembinaan</label>
                <textarea v-model.trim="form.tindakan" rows="3" placeholder="Tindakan yang diberikan atau rencana pembinaan..." class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"></textarea>
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Lampiran URL</label>
                <input v-model.trim="form.lampiranUrl" type="url" placeholder="https://..." class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
              </div>

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

    <!-- Delete Modal -->
    <Teleport to="body">
      <div v-if="showConfirm" class="fixed inset-0 z-[9999] overflow-y-auto p-4">
        <button class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showConfirm = false"></button>

        <div class="relative z-10 flex min-h-full items-center justify-center">
          <div class="w-full max-w-lg overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start gap-3 border-b border-slate-100 p-5 dark:border-neutral-800">
              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">
                <Icon icon="ph:trash-duotone" class="h-6 w-6" />
              </div>

              <div>
                <h3 class="text-xl font-black text-slate-900 dark:text-white">Hapus Pelanggaran</h3>
                <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                  Hapus pelanggaran milik <b>{{ current?.santri || '-' }}</b> pada {{ fmtDate(current?.tanggal) }}?
                </p>
              </div>
            </div>

            <div class="flex justify-between gap-2 p-5">
              <button class="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-black dark:border-neutral-700" :disabled="deleting" @click="showConfirm = false">
                Batal
              </button>

              <button class="rounded-2xl bg-rose-600 px-5 py-2.5 text-sm font-black text-white disabled:opacity-50" :disabled="deleting" @click="confirmDelete">
                {{ deleting ? 'Menghapus...' : 'Hapus' }}
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
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useNuxtApp, useRuntimeConfig } from '#app'
import { onValue, push, ref as dbRef, remove, set, update } from 'firebase/database'
import { useSantri } from '~/composables/data/useSantri'

definePageMeta({
  layout: 'app',
  layoutProps: { title: 'Pelanggaran' }
})

type Status = 'baru' | 'diproses' | 'selesai'

type FaultRow = {
  id: string
  santriId?: string
  santri?: string
  tanggal?: number
  jenis?: string
  pelanggaran?: string
  kategori?: string
  poin?: number
  deskripsi?: string
  pelapor?: string
  status?: Status
  tindakan?: string
  lampiranUrl?: string
  maskan?: string
  kamar?: string
  jenjang?: string
  createdAt?: number
  updatedAt?: number
}

type SantriRow = Record<string, any> & {
  id: string
  santri?: string
  nama?: string
  maskan?: string
  kamar?: string
  jenjang?: string
}

const config = useRuntimeConfig()
const { $realtimeDb } = useNuxtApp() as any
const clientName = String(config.public.clientName || 'alinayah')
const basePath = `${clientName}/pelanggaran`

const santriComposable = useSantri() as any
const santriRows = santriComposable.rows

const faultRows = ref<FaultRow[]>([])
const loading = ref(true)
const error = ref('')
const saving = ref(false)
const deleting = ref(false)

const filters = reactive({
  q: '',
  maskan: '',
  kamar: '',
  status: '',
  kategori: ''
})

const sortPreset = ref<'tanggal_desc' | 'tanggal_asc' | 'poin_desc' | 'santri_asc' | 'santri_desc' | 'maskan_asc'>('tanggal_desc')
const page = ref(1)
const pageSize = ref(20)

const showForm = ref(false)
const showConfirm = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const formError = ref('')
const current = ref<FaultRow | null>(null)

const santriQuery = ref('')
const showSantriSuggest = ref(false)

const toastMessage = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null
let unsubscribeFaults: (() => void) | null = null

const form = reactive<Omit<FaultRow, 'id'>>({
  santriId: '',
  santri: '',
  tanggal: Date.now(),
  jenis: '',
  pelanggaran: '',
  kategori: '',
  poin: 0,
  deskripsi: '',
  pelapor: '',
  status: 'baru',
  tindakan: '',
  lampiranUrl: '',
  maskan: '',
  kamar: '',
  jenjang: ''
})

const tanggalInput = computed({
  get: () => toLocalInputValue(form.tanggal),
  set: (value: string) => {
    const parsed = value ? new Date(value).getTime() : Date.now()
    form.tanggal = Number.isNaN(parsed) ? Date.now() : parsed
  }
})

const maskanOptions = computed(() => {
  const set = new Set<string>()

  for (const s of santriRows.value as SantriRow[]) {
    set.add(s.maskan || '')
  }

  return Array.from(set).sort((a, b) => a.localeCompare(b, 'id'))
})

const kamarOptions = computed(() => {
  const set = new Set<string>()
  const rows = filters.maskan
    ? (santriRows.value as SantriRow[]).filter((s) => (s.maskan || '') === filters.maskan)
    : (santriRows.value as SantriRow[])

  for (const s of rows) {
    set.add(s.kamar || '')
  }

  return Array.from(set).sort((a, b) => a.localeCompare(b, 'id'))
})

const santriSuggest = computed(() => {
  const q = normalizeText(santriQuery.value)
  if (!q) return []

  return (santriRows.value as SantriRow[])
    .filter((s) => normalizeText(`${s.santri || ''} ${s.nama || ''} ${s.maskan || ''} ${s.kamar || ''}`).includes(q))
    .slice(0, 10)
})

const filteredRows = computed(() => {
  const q = normalizeText(filters.q)

  let rows = faultRows.value.filter((row) => {
    const okQ = !q || normalizeText([
      row.santri,
      row.jenis,
      row.pelanggaran,
      row.kategori,
      row.pelapor,
      row.deskripsi,
      row.tindakan
    ].join(' ')).includes(q)

    const okMaskan = !filters.maskan || (row.maskan || '') === filters.maskan
    const okKamar = !filters.kamar || (row.kamar || '') === filters.kamar
    const okStatus = !filters.status || (row.status || 'baru') === filters.status
    const okKategori = !filters.kategori || normalizeText(row.kategori || categoryByPoint(row.poin)) === normalizeText(filters.kategori)

    return okQ && okMaskan && okKamar && okStatus && okKategori
  })

  rows = [...rows]

  if (sortPreset.value === 'tanggal_asc') {
    rows.sort((a, b) => Number(a.tanggal || 0) - Number(b.tanggal || 0))
  } else if (sortPreset.value === 'poin_desc') {
    rows.sort((a, b) => Number(b.poin || 0) - Number(a.poin || 0))
  } else if (sortPreset.value === 'santri_asc') {
    rows.sort((a, b) => String(a.santri || '').localeCompare(String(b.santri || ''), 'id'))
  } else if (sortPreset.value === 'santri_desc') {
    rows.sort((a, b) => String(b.santri || '').localeCompare(String(a.santri || ''), 'id'))
  } else if (sortPreset.value === 'maskan_asc') {
    rows.sort((a, b) => String(a.maskan || '').localeCompare(String(b.maskan || ''), 'id'))
  } else {
    rows.sort((a, b) => Number(b.tanggal || 0) - Number(a.tanggal || 0))
  }

  return rows
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value)))

const pageRows = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredRows.value.slice(start, start + pageSize.value)
})

const totalPoints = computed(() => filteredRows.value.reduce((sum, row) => sum + Number(row.poin || 0), 0))
const unresolvedCount = computed(() => filteredRows.value.filter((row) => row.status !== 'selesai').length)

const monthlyCount = computed(() => {
  const now = new Date()

  return filteredRows.value.filter((row) => {
    const date = new Date(row.tanggal || 0)
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }).length
})

watch([filteredRows, pageSize], () => {
  page.value = 1
})

function subscribeFaults() {
  if (!$realtimeDb) {
    error.value = 'Realtime database belum tersedia.'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''

  if (unsubscribeFaults) {
    try {
      unsubscribeFaults()
    } catch {}
    unsubscribeFaults = null
  }

  unsubscribeFaults = onValue(
    dbRef($realtimeDb, basePath),
    (snap) => {
      const value = snap.val() || {}
      const rows: FaultRow[] = []

      for (const [id, raw] of Object.entries(value as Record<string, any>)) {
        rows.push(normalizeFaultRow(id, raw))
      }

      faultRows.value = rows.sort((a, b) => Number(b.tanggal || 0) - Number(a.tanggal || 0))
      loading.value = false
    },
    (err) => {
      error.value = err?.message || 'Gagal memuat data pelanggaran.'
      loading.value = false
    }
  )
}

function normalizeFaultRow(id: string, raw: Record<string, any>): FaultRow {
  return {
    id,
    santriId: raw.santriId || raw.idSantri || '',
    santri: raw.santri || raw.namaSantri || raw.studentName || '',
    tanggal: parseDateValue(raw.tanggal || raw.date || raw.createdAt),
    jenis: raw.jenis || raw.pelanggaran || raw.title || 'Umum',
    pelanggaran: raw.pelanggaran || raw.jenis || raw.title || 'Umum',
    kategori: raw.kategori || raw.category || '',
    poin: Number(raw.poin ?? raw.points ?? raw.point ?? 0),
    deskripsi: raw.deskripsi || raw.description || raw.keterangan || '',
    pelapor: raw.pelapor || raw.reporter || '',
    status: raw.status || 'baru',
    tindakan: raw.tindakan || raw.action || raw.tindakLanjut || '',
    lampiranUrl: raw.lampiranUrl || raw.attachmentUrl || '',
    maskan: raw.maskan || '',
    kamar: raw.kamar || '',
    jenjang: raw.jenjang || '',
    createdAt: parseDateValue(raw.createdAt),
    updatedAt: parseDateValue(raw.updatedAt)
  }
}

async function reload() {
  subscribeFaults()

  try {
    await santriComposable.fetchSantri?.()
  } catch {}
}

function resetFilters() {
  filters.q = ''
  filters.maskan = ''
  filters.kamar = ''
  filters.status = ''
  filters.kategori = ''
  sortPreset.value = 'tanggal_desc'
}

function resetForm() {
  form.santriId = ''
  form.santri = ''
  form.tanggal = Date.now()
  form.jenis = ''
  form.pelanggaran = ''
  form.kategori = ''
  form.poin = 0
  form.deskripsi = ''
  form.pelapor = ''
  form.status = 'baru'
  form.tindakan = ''
  form.lampiranUrl = ''
  form.maskan = ''
  form.kamar = ''
  form.jenjang = ''
  santriQuery.value = ''
  formError.value = ''
}

function openCreate() {
  formMode.value = 'create'
  current.value = null
  resetForm()
  showForm.value = true
}

function openEdit(row: FaultRow) {
  formMode.value = 'edit'
  current.value = row

  form.santriId = row.santriId || ''
  form.santri = row.santri || ''
  form.tanggal = row.tanggal || Date.now()
  form.jenis = row.jenis || row.pelanggaran || ''
  form.pelanggaran = row.pelanggaran || row.jenis || ''
  form.kategori = row.kategori || ''
  form.poin = Number(row.poin || 0)
  form.deskripsi = row.deskripsi || ''
  form.pelapor = row.pelapor || ''
  form.status = row.status || 'baru'
  form.tindakan = row.tindakan || ''
  form.lampiranUrl = row.lampiranUrl || ''
  form.maskan = row.maskan || ''
  form.kamar = row.kamar || ''
  form.jenjang = row.jenjang || ''
  santriQuery.value = row.santri || ''
  formError.value = ''
  showForm.value = true
}

function pickSantri(s: SantriRow) {
  form.santriId = s.id
  form.santri = s.santri || s.nama || ''
  form.maskan = s.maskan || ''
  form.kamar = s.kamar || ''
  form.jenjang = s.jenjang || ''
  santriQuery.value = form.santri || ''
  showSantriSuggest.value = false
}

async function submitForm() {
  formError.value = ''

  if (!(form.santriId || form.santri?.trim())) {
    formError.value = 'Santri wajib dipilih atau diisi.'
    return
  }

  if (!form.jenis?.trim()) {
    formError.value = 'Jenis pelanggaran wajib diisi.'
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
      santriId: form.santriId || '',
      santri: form.santri || '',
      namaSantri: form.santri || '',
      tanggal: form.tanggal || now,
      jenis: form.jenis || 'Umum',
      pelanggaran: form.jenis || 'Umum',
      title: form.jenis || 'Pelanggaran',
      kategori: form.kategori || categoryByPoint(form.poin),
      category: form.kategori || categoryByPoint(form.poin),
      poin: Number(form.poin || 0),
      points: Number(form.poin || 0),
      deskripsi: form.deskripsi || '',
      description: form.deskripsi || '',
      pelapor: form.pelapor || '',
      reporter: form.pelapor || '',
      status: form.status || 'baru',
      tindakan: form.tindakan || '',
      action: form.tindakan || '',
      tindakLanjut: form.tindakan || '',
      lampiranUrl: form.lampiranUrl || '',
      attachmentUrl: form.lampiranUrl || '',
      maskan: form.maskan || '',
      kamar: form.kamar || '',
      jenjang: form.jenjang || '',
      updatedAt: now,
      createdAt: formMode.value === 'create' ? now : current.value?.createdAt || now
    })

    if (formMode.value === 'create') {
      const newRef = push(dbRef($realtimeDb, basePath))
      await set(newRef, {
        ...payload,
        id: newRef.key
      })

      showToast('Pelanggaran berhasil ditambahkan.')
    } else if (current.value?.id) {
      await update(dbRef($realtimeDb, `${basePath}/${current.value.id}`), payload)
      showToast('Pelanggaran berhasil diperbarui.')
    }

    showForm.value = false
  } catch (e: any) {
    formError.value = e?.message || 'Gagal menyimpan data pelanggaran.'
  } finally {
    saving.value = false
  }
}

function openConfirm(row: FaultRow) {
  current.value = row
  showConfirm.value = true
}

async function confirmDelete() {
  if (!$realtimeDb || !current.value?.id) return

  deleting.value = true

  try {
    await remove(dbRef($realtimeDb, `${basePath}/${current.value.id}`))
    showConfirm.value = false
    showToast('Pelanggaran berhasil dihapus.')
  } catch (e: any) {
    alert(e?.message || 'Gagal menghapus data.')
  } finally {
    deleting.value = false
  }
}

function exportCSV() {
  const headers = [
    'Tanggal',
    'Santri',
    'Jenis',
    'Kategori',
    'Poin',
    'Maskan',
    'Kamar',
    'Jenjang',
    'Pelapor',
    'Status',
    'Deskripsi',
    'Tindakan'
  ]

  const lines = filteredRows.value.map((row) => [
    fmtDate(row.tanggal),
    row.santri || '',
    row.jenis || '',
    row.kategori || '',
    row.poin || 0,
    row.maskan || '',
    row.kamar || '',
    row.jenjang || '',
    row.pelapor || '',
    row.status || '',
    row.deskripsi || '',
    row.tindakan || ''
  ].map(csvCell).join(','))

  const csv = '\uFEFF' + [headers.join(','), ...lines].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = `pelanggaran_${clientName}.csv`
  anchor.click()

  URL.revokeObjectURL(url)
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

function categoryByPoint(point?: number) {
  const p = Number(point || 0)

  if (p >= 30) return 'sangat berat'
  if (p >= 20) return 'berat'
  if (p >= 10) return 'sedang'
  return 'ringan'
}

function pointBadgeClass(point?: number) {
  const p = Number(point || 0)

  if (p >= 20) return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
  if (p >= 10) return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
}

function categoryBadgeClass(category?: string, point?: number) {
  const c = normalizeText(category || categoryByPoint(point))

  if (c.includes('sangat') || c.includes('berat')) return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
  if (c.includes('sedang')) return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
}

function statusBadgeClass(status?: string) {
  if (status === 'selesai') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (status === 'diproses') return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
}

function fmtDate(value?: number) {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))
}

function toLocalInputValue(ms?: number) {
  if (!ms) return ''

  const date = new Date(ms)
  const pad = (n: number) => String(n).padStart(2, '0')

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate())
  ].join('-') + `T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function parseDateValue(value: any) {
  if (!value) return Date.now()

  if (typeof value === 'number') {
    return value < 10_000_000_000 ? value * 1000 : value
  }

  if (typeof value === 'string') {
    const parsed = new Date(value).getTime()
    return Number.isNaN(parsed) ? Date.now() : parsed
  }

  if (typeof value === 'object') {
    if (value._seconds) return Number(value._seconds) * 1000
    if (typeof value.toMillis === 'function') return value.toMillis()
  }

  return Date.now()
}

function normalizeText(value?: any) {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
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
    showSantriSuggest.value = false
  }
}

onMounted(async () => {
  subscribeFaults()

  try {
    if (santriComposable.subscribeSantri) {
      santriComposable.subscribeSantri()
    } else {
      await santriComposable.fetchSantri?.()
    }
  } catch {}

  window.addEventListener('click', onClickOutsideAutocomplete)
})

onUnmounted(() => {
  if (unsubscribeFaults) {
    try {
      unsubscribeFaults()
    } catch {}
    unsubscribeFaults = null
  }

  try {
    santriComposable.unsubscribeSantri?.()
  } catch {}

  if (toastTimer) clearTimeout(toastTimer)

  window.removeEventListener('click', onClickOutsideAutocomplete)
})
</script>