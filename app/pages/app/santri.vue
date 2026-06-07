<!-- /pages/app/santri.vue -->

<template>
  <section class="space-y-6 p-4 md:p-6">
    <!-- Hero -->
    <div
      class="relative overflow-hidden rounded-[28px] border border-green-100 bg-gradient-to-br from-green-600 via-green-600 to-lime-500 p-6 text-white shadow-[0_20px_60px_-20px_rgba(22,163,74,0.45)] dark:border-neutral-800 md:p-8"
    >
      <div class="absolute inset-0 opacity-20">
        <div class="absolute -right-10 -top-14 h-44 w-44 rounded-full bg-white blur-3xl"></div>
        <div class="absolute -bottom-16 left-8 h-40 w-40 rounded-full bg-lime-200 blur-3xl"></div>
      </div>

      <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20 backdrop-blur">
            <span class="h-2 w-2 rounded-full bg-lime-300"></span>
            Santri Management
          </div>

          <h1 class="mt-4 text-2xl font-extrabold tracking-tight md:text-4xl">
            Kelola data santri lebih rapi
          </h1>

          <p class="mt-3 max-w-xl text-sm text-green-50/90 md:text-base">
            Data santri lama dapat dicari, difilter, diurutkan, diimport, diexport, dan dikelola dari satu tampilan yang lebih nyaman.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-2xl bg-white/12 px-4 py-3 ring-1 ring-white/15 backdrop-blur">
            <div class="text-xs text-green-100">Total Santri</div>
            <div class="mt-1 text-2xl font-bold">{{ rowsLama.length }}</div>
          </div>

          <div class="rounded-2xl bg-white/12 px-4 py-3 ring-1 ring-white/15 backdrop-blur">
            <div class="text-xs text-green-100">Aktif</div>
            <div class="mt-1 text-2xl font-bold">{{ activeCount }}</div>
          </div>

          <div class="rounded-2xl bg-white/12 px-4 py-3 ring-1 ring-white/15 backdrop-blur">
            <div class="text-xs text-green-100">Jenjang</div>
            <div class="mt-1 text-2xl font-bold">{{ jenjangOptionsLama.length }}</div>
          </div>

          <div class="rounded-2xl bg-white/12 px-4 py-3 ring-1 ring-white/15 backdrop-blur">
            <div class="text-xs text-green-100">Duplikat</div>
            <div class="mt-1 text-2xl font-bold">{{ groupsWali.length }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="rounded-3xl border border-gray-200/80 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90">
      <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div class="grid flex-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <div class="relative">
            <input
              v-model="filtersLama.q"
              type="text"
              placeholder="Cari nama, wali, nomor, kamar, alamat..."
              class="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
            <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </span>
          </div>

          <select
            v-model="filtersLama.status"
            class="h-11 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          >
            <option value="semua">Semua Status</option>
            <option v-for="s in statusOptionsLama" :key="s" :value="s">{{ s }}</option>
          </select>

          <select
            v-model="filtersLama.jenjang"
            class="h-11 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          >
            <option value="semua">Semua Jenjang</option>
            <option v-for="j in jenjangOptionsLama" :key="j" :value="j">{{ j }}</option>
          </select>

          <select
            v-model="sortKey"
            class="h-11 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          >
            <option value="santri">Urutkan: Nama</option>
            <option value="noInduk">Urutkan: No Induk</option>
            <option value="gen">Urutkan: Gen</option>
            <option value="kamar">Urutkan: Kamar</option>
            <option value="status">Urutkan: Status</option>
            <option value="jenjang">Urutkan: Jenjang</option>
          </select>

          <button
            type="button"
            @click="toggleSortDir"
            class="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            {{ sortDir === 'asc' ? 'A → Z' : 'Z → A' }}
          </button>
          <div>
              <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            @click="openCreate"
            class="inline-flex h-11 items-center justify-center rounded-2xl bg-green-600 px-5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
          >
            + Tambah Santri
          </button>

          <button
            type="button"
            @click="reload"
            class="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Muat Ulang
          </button>

          <div ref="menuRoot" class="relative" @keydown.escape="menuOpen = false">
            <button
              type="button"
              @click="menuOpen = !menuOpen"
              class="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Menu
              <span class="ml-2">▾</span>
            </button>

            <div
              v-if="menuOpen"
              class="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white p-1 shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
            >
              <button
                type="button"
                @click="triggerImport"
                class="w-full rounded-xl px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                Import CSV/Excel
              </button>

              <button
                type="button"
                @click="downloadTemplate('lama'); menuOpen = false"
                class="w-full rounded-xl px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                Download Template
              </button>

              <button
                type="button"
                @click="exportCSV(filteredLamaRows, 'santri_lama.csv'); menuOpen = false"
                class="w-full rounded-xl px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                Export CSV
              </button>

              <button
                type="button"
                @click="exportExcel(filteredLamaRows, 'santri_lama.xlsx'); menuOpen = false"
                class="w-full rounded-xl px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                Export Excel
              </button>

              <button
                type="button"
                @click="showFieldSettings = true; menuOpen = false"
                class="w-full rounded-xl px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                Tampilan Kolom
              </button>
            </div>
          </div>

          <input
            ref="fileInputLama"
            type="file"
            accept=".xlsx,.xls,.csv"
            class="hidden"
            @change="handleImportLama"
          />
        </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div
      v-if="error"
      class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300"
    >
      {{ error }}
    </div>

    <!-- Main Table -->
    <section class="space-y-4">
      <div class="rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div class="flex flex-col gap-3 border-b border-gray-100 p-4 dark:border-neutral-800 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 class="text-base font-bold text-gray-900 dark:text-white">Daftar Santri</h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Menampilkan {{ paginatedRows.length }} dari {{ filteredLamaRows.length }} data.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <select
              v-model.number="pageSize"
              class="h-10 rounded-2xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option :value="10">10 / halaman</option>
              <option :value="25">25 / halaman</option>
              <option :value="50">50 / halaman</option>
              <option :value="100">100 / halaman</option>
            </select>

            <button
              type="button"
              @click="resetFilters"
              class="inline-flex h-10 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Reset Filter
            </button>
          </div>
        </div>

        <div v-if="loading" class="grid gap-3 p-4">
          <div v-for="i in 6" :key="i" class="h-14 animate-pulse rounded-2xl bg-gray-100 dark:bg-neutral-800"></div>
        </div>

        <div
          v-else-if="filteredLamaRows.length === 0"
          class="p-10 text-center"
        >
          <div class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-green-50 text-3xl text-green-600 dark:bg-green-900/20 dark:text-green-300">
            👤
          </div>
          <h3 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">Data tidak ditemukan</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-neutral-400">
            Coba ubah kata kunci, status, jenjang, atau reset filter.
          </p>
        </div>

        <div v-else class="overflow-auto">
          <table class="min-w-[1100px] w-full text-sm">
            <thead class="bg-gray-50 text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
              <tr>
                <th class="w-14 px-4 py-3 text-left">No</th>

                <th
                  v-for="c in visibleColumns"
                  :key="c.key"
                  class="px-4 py-3 text-left"
                >
                  <button
                    v-if="c.sortable"
                    type="button"
                    @click="setSort(c.key)"
                    class="inline-flex items-center gap-1 font-semibold hover:text-green-600"
                  >
                    {{ c.label }}
                    <span v-if="sortKey === c.key">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
                  </button>
                  <span v-else>{{ c.label }}</span>
                </th>

                <th class="sticky right-0 z-10 bg-gray-50 px-4 py-3 text-left dark:bg-neutral-800">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-neutral-800">
              <tr
                v-for="(row, index) in paginatedRows"
                :key="row.id"
                class="transition hover:bg-green-50/40 dark:hover:bg-green-900/10"
              >
                <td class="px-4 py-3 text-gray-500 dark:text-neutral-400">
                  {{ startItem + index }}
                </td>

                <td
                  v-for="c in visibleColumns"
                  :key="c.key"
                  class="px-4 py-3 align-top"
                >
                  <template v-if="c.key === 'santri'">
                    <div class="font-semibold text-gray-900 dark:text-white">{{ row.santri || '—' }}</div>
                    <div class="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                      {{ row.noInduk || 'Tanpa No. Induk' }}
                    </div>
                  </template>

                  <template v-else-if="c.key === 'nohp'">
                    <a
                      v-if="row.nohp"
                      :href="`tel:${row.nohp}`"
                      class="font-medium text-green-700 hover:underline dark:text-green-300"
                    >
                      {{ row.nohp }}
                    </a>
                    <span v-else class="text-gray-400">—</span>
                  </template>

                  <template v-else-if="c.key === 'status'">
                    <span
                      :class="[
                        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize',
                        statusClass(row.status)
                      ]"
                    >
                      {{ row.status || '—' }}
                    </span>
                  </template>

                  <template v-else-if="c.key === 'kamar'">
                    <span>{{ row.kamar || '—' }}</span>
                    <span v-if="row.maskan" class="text-gray-400"> - {{ row.maskan }}</span>
                  </template>

                  <template v-else-if="c.key === 'alamat'">
                    <span class="line-clamp-2 max-w-xs text-gray-600 dark:text-neutral-300">
                      {{ row.alamat || '—' }}
                    </span>
                  </template>

                  <template v-else>
                    {{ getCellValue(row, c.key) || '—' }}
                  </template>
                </td>

                <td class="sticky right-0 z-10 bg-white px-4 py-3 dark:bg-neutral-900">
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      @click="openDetail(row)"
                      class="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      Detail
                    </button>

                    <button
                      type="button"
                      @click="openEdit(row)"
                      class="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      @click="openConfirm(row)"
                      class="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="!loading && filteredLamaRows.length"
          class="flex flex-col gap-3 border-t border-gray-100 p-4 dark:border-neutral-800 md:flex-row md:items-center md:justify-between"
        >
          <div class="text-sm text-gray-500 dark:text-neutral-400">
            Halaman {{ currentPage }} dari {{ totalPages }} • {{ filteredLamaRows.length }} data
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              :disabled="currentPage <= 1"
              @click="currentPage = 1"
              class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Awal
            </button>

            <button
              type="button"
              :disabled="currentPage <= 1"
              @click="currentPage--"
              class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Prev
            </button>

            <button
              v-for="p in pageButtons"
              :key="p"
              type="button"
              @click="currentPage = p"
              :class="[
                'rounded-xl px-3 py-2 text-sm font-semibold transition',
                currentPage === p
                  ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800'
              ]"
            >
              {{ p }}
            </button>

            <button
              type="button"
              :disabled="currentPage >= totalPages"
              @click="currentPage++"
              class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Next
            </button>

            <button
              type="button"
              :disabled="currentPage >= totalPages"
              @click="currentPage = totalPages"
              class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Akhir
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Duplicate Family Groups -->
    <section class="space-y-4">
      <div class="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 class="text-base font-bold text-gray-900 dark:text-white">
              Potensi Duplikat Keluarga
            </h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Grup berdasarkan nama wali/ayah dan nomor HP yang sama.
            </p>
          </div>

          <div class="grid gap-2 sm:grid-cols-3">
            <select
              v-model="selectedMapelId"
              class="h-10 rounded-2xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="">Pilih Mapel Nilai</option>
              <option v-for="m in subjects" :key="m.id" :value="m.id">
                {{ m.name }}
              </option>
            </select>

            <input
              v-model.number="tahunAwalNilai"
              type="number"
              class="h-10 rounded-2xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              :title="'Tahun Awal - term aktif: ' + termKeyNilai"
            />

            <select
              v-model="semesterNilai"
              class="h-10 rounded-2xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option>Ganjil</option>
              <option>Genap</option>
            </select>
          </div>
        </div>
      </div>

      <div
        v-if="!groupsWali.length"
        class="rounded-[24px] border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
      >
        Tidak ditemukan grup dengan nama wali/ayah dan nomor HP yang sama.
      </div>

      <div
        v-for="g in groupsWali"
        :key="g.key"
        class="overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div class="flex flex-col gap-3 border-b border-gray-100 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div class="font-bold text-gray-900 dark:text-white">
              {{ g.waliName || '(tanpa nama wali)' }}
              <span class="mx-1 text-gray-300">•</span>
              <a :href="`tel:+${g.phone}`" class="text-green-700 hover:underline dark:text-green-300">
                +{{ g.phone }}
              </a>
            </div>

            <div class="mt-1 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-neutral-400">
              <span>{{ statsForGroup(g).total }} santri</span>
              <span>•</span>
              <span>Term: {{ termKeyNilai }}</span>
              <span>•</span>
              <span>
                Status:
                <template v-for="(s, i) in statsForGroup(g).byStatus" :key="s.k">
                  <b>{{ s.k }}</b> {{ s.v }}<span v-if="i < statsForGroup(g).byStatus.length - 1">, </span>
                </template>
              </span>
            </div>
          </div>
        </div>

        <div class="overflow-auto">
          <table class="min-w-[1000px] w-full text-sm">
            <thead class="bg-white text-gray-600 dark:bg-neutral-900 dark:text-neutral-300">
              <tr>
                <th class="px-4 py-3 text-left">No. Induk</th>
                <th class="px-4 py-3 text-left">Santri</th>
                <th class="px-4 py-3 text-left">Kamar</th>
                <th class="px-4 py-3 text-left">Jenjang</th>
                <th class="px-4 py-3 text-left">Status</th>
                <th class="px-4 py-3 text-left">Nilai</th>
                <th class="px-4 py-3 text-left">Alamat</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-neutral-800">
              <tr v-for="s in g.items" :key="s.id" class="hover:bg-green-50/40 dark:hover:bg-green-900/10">
                <td class="px-4 py-3">{{ s.noInduk || '—' }}</td>

                <td class="px-4 py-3">
                  <div class="font-semibold text-gray-900 dark:text-white">{{ s.santri || '—' }}</div>
                  <div class="text-xs text-gray-500 dark:text-neutral-400">
                    Wali: {{ s.walisantri || s.ayahNama || '—' }}
                  </div>
                  <a
                    v-if="s.nohp"
                    :href="`tel:${s.nohp}`"
                    class="text-xs text-green-700 hover:underline dark:text-green-300"
                  >
                    {{ s.nohp }}
                  </a>
                </td>

                <td class="px-4 py-3">{{ s.kamar || '—' }}</td>
                <td class="px-4 py-3">{{ s.jenjang || '—' }}</td>

                <td class="px-4 py-3">
                  <span
                    :class="[
                      'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize',
                      statusClass(s.status)
                    ]"
                  >
                    {{ s.status || '—' }}
                  </span>
                </td>

                <td class="px-4 py-3">
                  <div v-if="selectedMapelId">
                    <template v-if="nilaiRingkas(s.id).akhir != null || nilaiRingkas(s.id).predikat">
                      <div class="font-semibold text-gray-900 dark:text-white">
                        Akhir: {{ nilaiRingkas(s.id).akhir ?? '—' }}
                        <span v-if="nilaiRingkas(s.id).predikat">
                          ({{ nilaiRingkas(s.id).predikat }})
                        </span>
                      </div>

                      <div class="text-xs text-gray-500 dark:text-neutral-400">
                        T{{ nilaiRingkas(s.id).tugas ?? '–' }} /
                        H{{ nilaiRingkas(s.id).harian ?? '–' }} /
                        PTS {{ nilaiRingkas(s.id).pts ?? '–' }} /
                        PAS {{ nilaiRingkas(s.id).pas ?? '–' }}
                      </div>

                      <div
                        v-if="nilaiRingkas(s.id).catatan"
                        class="text-xs italic text-gray-500 dark:text-neutral-400"
                      >
                        {{ nilaiRingkas(s.id).catatan }}
                      </div>
                    </template>

                    <template v-else>
                      <span class="text-gray-400">Belum ada nilai.</span>
                    </template>
                  </div>

                  <div v-else class="text-gray-400">
                    Pilih mapel.
                  </div>
                </td>

                <td class="px-4 py-3">
                  <span class="line-clamp-2 max-w-sm text-gray-600 dark:text-neutral-300">
                    {{ s.alamat || '—' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Detail Modal -->
    <ModalShell v-model="showDetail" title="Detail Santri" size="5xl">
      <div v-if="detailRow" class="grid gap-4 md:grid-cols-3">
        <div class="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
          <div class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">Identitas</div>

          <div class="mt-4 space-y-3">
            <InfoRow label="No. Induk" :value="detailRow.noInduk" />
            <InfoRow label="Gen" :value="detailRow.gen" />
            <InfoRow label="Nama" :value="detailRow.santri" />
            <InfoRow label="Kamar" :value="detailRow.kamar" />
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
          <div class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">Wali</div>

          <div class="mt-4 space-y-3">
            <InfoRow label="Ayah" :value="detailRow.ayahNama" />
            <InfoRow label="Ibu" :value="detailRow.ibuNama" />
            <InfoRow label="Wali Santri" :value="detailRow.walisantri" />

            <div>
              <div class="text-xs text-gray-500 dark:text-neutral-400">Nomor HP</div>
              <a
                v-if="detailRow.nohp"
                :href="`tel:${detailRow.nohp}`"
                class="font-semibold text-green-700 hover:underline dark:text-green-300"
              >
                {{ detailRow.nohp }}
              </a>
              <div v-else class="font-semibold text-gray-900 dark:text-white">—</div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
          <div class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">Akademik</div>

          <div class="mt-4 space-y-3">
            <InfoRow label="Status" :value="detailRow.status" />
            <InfoRow label="Jenjang" :value="detailRow.jenjang" />
            <InfoRow label="Kelas Formal" :value="detailRow.kelasFormal" />
            <InfoRow label="Alamat" :value="detailRow.alamat" />
          </div>
        </div>
      </div>

      <template #footer>
        <button
          type="button"
          @click="showDetail = false"
          class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          Tutup
        </button>
      </template>
    </ModalShell>

    <!-- Form Modal -->
    <ModalShell
      v-model="showForm"
      :title="formMode === 'create' ? 'Tambah Santri' : 'Ubah Santri'"
      size="4xl"
    >
      <form class="space-y-4" @submit.prevent="submitForm">
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
              Gen
            </label>
            <input
              v-model.trim="form.gen"
              required
              placeholder="mis. 2024"
              class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
              Nama Santri
            </label>
            <input
              v-model.trim="form.santri"
              required
              class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
              Wali Santri
            </label>
            <input
              v-model.trim="form.walisantri"
              class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
              No HP Wali
            </label>
            <input
              v-model.trim="form.nohp"
              class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
              Kuota Kunjungan
            </label>
            <input
              v-model.number="form.kuotaKunjunganBulanIni"
              type="number"
              min="0"
              class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
              Kamar
            </label>
            <input
              v-model.trim="form.kamar"
              class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
              Jenjang
            </label>
            <input
              v-model.trim="form.jenjang"
              placeholder="KMI / MTs / MA"
              class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
              Status
            </label>
            <select
              v-model="form.status"
              class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
              <option value="lulus">Lulus</option>
              <option value="cuti">Cuti</option>
            </select>
          </div>

          <div class="sm:col-span-2">
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
              Alamat
            </label>
            <textarea
              v-model.trim="form.alamat"
              rows="3"
              placeholder="Alamat lengkap wali/santri"
              class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            ></textarea>
          </div>
        </div>

        <p
          v-if="formError"
          class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-300"
        >
          {{ formError }}
        </p>
      </form>

      <template #footer>
        <button
          type="button"
          @click="showForm = false"
          class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          Batal
        </button>

        <button
          type="button"
          :disabled="saving"
          @click="submitForm"
          class="inline-flex min-w-[120px] items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ saving ? 'Menyimpan...' : formMode === 'create' ? 'Simpan' : 'Update' }}
        </button>
      </template>
    </ModalShell>

    <!-- Delete Modal -->
    <ModalShell v-model="showConfirm" title="Hapus Data">
      <p class="text-sm text-gray-700 dark:text-neutral-200">
        Apakah Anda yakin ingin menghapus data santri
        <strong>{{ current?.santri }}</strong>?
        Tindakan ini tidak dapat dibatalkan.
      </p>

      <template #footer>
        <button
          type="button"
          @click="showConfirm = false"
          class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          Batal
        </button>

        <button
          type="button"
          :disabled="deleting"
          @click="confirmDelete"
          class="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ deleting ? 'Menghapus...' : 'Hapus' }}
        </button>
      </template>
    </ModalShell>

    <!-- Column Settings Modal -->
    <ModalShell v-model="showFieldSettings" title="Pilih Kolom yang Ditampilkan" size="xl">
      <div class="grid gap-2 sm:grid-cols-2">
        <label
          v-for="c in allColumnDefs"
          :key="c.key"
          class="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        >
          <input
            v-model="selectedFieldKeys"
            type="checkbox"
            :value="c.key"
            class="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span class="font-medium text-gray-800 dark:text-neutral-100">
            {{ c.label }}
          </span>
        </label>
      </div>

      <template #footer>
        <button
          type="button"
          @click="showFieldSettings = false"
          class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
        >
          Selesai
        </button>
      </template>
    </ModalShell>

    <!-- Import Progress Modal -->
    <ModalShell v-model="showProgress" title="Import Data Santri Lama" size="4xl">
      <div class="space-y-4">
        <div class="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-800">
          <div
            class="h-3 rounded-full bg-green-600 transition-all duration-300"
            :style="{ width: progress + '%' }"
          ></div>
        </div>

        <div class="flex items-center justify-between text-sm">
          <p class="text-gray-700 dark:text-neutral-200">
            {{ progressStatus }}
          </p>
          <p class="font-semibold text-green-700 dark:text-green-300">
            {{ progress }}%
          </p>
        </div>
      </div>

      <template #footer>
        <button
          type="button"
          :disabled="progress < 100"
          @click="showProgress = false"
          class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          Tutup
        </button>
      </template>
    </ModalShell>
  </section>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'
import { computed, defineComponent, h, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import ModalShell from '~/components/widget/ModalShell.vue'
import { useSantri, type SantriRow } from '~/composables/data/useSantri'
import { usePelajaran, makeTermKey } from '~/composables/data/usePelajaran'

definePageMeta({
  layout: 'app',
  layoutProps: { title: 'Santri Lama' }
})

type SortDir = 'asc' | 'desc'
type Filters = {
  q: string
  status: string
  jenjang: string
}
type ColumnKey =
  | 'noInduk'
  | 'gen'
  | 'santri'
  | 'kamar'
  | 'ayahNama'
  | 'ibuNama'
  | 'nohp'
  | 'alamat'
  | 'status'
  | 'kelasFormal'
  | 'jenjang'

type ColumnDef = {
  key: ColumnKey
  label: string
  sortable: boolean
}

type RowDict = Record<string, unknown>

type GrupWali = {
  key: string
  waliName: string
  phone: string
  items: SantriRow[]
}

const InfoRow = defineComponent({
  name: 'InfoRow',
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },
  setup(props) {
    return () =>
      h('div', [
        h('div', { class: 'text-xs text-gray-500 dark:text-neutral-400' }, props.label),
        h('div', { class: 'font-semibold text-gray-900 dark:text-white break-words' }, props.value ? String(props.value) : '—')
      ])
  }
})

const {
  rows,
  loading,
  error,
  fetchSantri,
  createSantri,
  updateSantri,
  deleteSantri,
  importFromExcelWithProgress
} = useSantri()

const {
  subjects,
  subscribeSubjects,
  unbindSubjects,
  nilaiMap,
  subscribeNilai,
  unsubscribeNilai
} = usePelajaran()

onMounted(() => {
  fetchSantri()
  subscribeSubjects()
  document.addEventListener('click', onDocClick)
})

onBeforeUnmount(() => {
  unbindSubjects()
  unsubscribeNilai()
  document.removeEventListener('click', onDocClick)
})

const reload = () => fetchSantri()

const menuOpen = ref(false)
const menuRoot = ref<HTMLElement | null>(null)

function onDocClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!menuRoot.value?.contains(target)) {
    menuOpen.value = false
  }
}

const allColumnDefs: ColumnDef[] = [
  { key: 'noInduk', label: 'No. Induk', sortable: true },
  { key: 'gen', label: 'Gen', sortable: true },
  { key: 'santri', label: 'Nama', sortable: true },
  { key: 'kamar', label: 'Kamar', sortable: true },
  { key: 'ayahNama', label: 'Ayah', sortable: true },
  { key: 'ibuNama', label: 'Ibu', sortable: true },
  { key: 'nohp', label: 'Nomor', sortable: true },
  { key: 'alamat', label: 'Alamat', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'kelasFormal', label: 'Kelas Formal', sortable: true },
  { key: 'jenjang', label: 'Jenjang', sortable: true }
]

const selectedFieldKeys = ref<ColumnKey[]>([
  'noInduk',
  'gen',
  'santri',
  'kamar',
  'ayahNama',
  'ibuNama',
  'nohp',
  'alamat',
  'status',
  'kelasFormal'
])

const visibleColumns = computed(() => {
  return allColumnDefs.filter((column) => selectedFieldKeys.value.includes(column.key))
})

const showFieldSettings = ref(false)

const currentYear = new Date().getFullYear()

function extractYear(row: SantriRow): number | null {
  const data = row as Record<string, unknown>

  if (typeof data.ppdbCode === 'string' && /^ALB-\d{8}-/i.test(data.ppdbCode)) {
    return Number.parseInt(data.ppdbCode.slice(4, 8), 10)
  }

  const createdAt = data.createdAt

  if (typeof createdAt === 'number') {
    return new Date(createdAt).getFullYear()
  }

  if (createdAt && typeof createdAt === 'object') {
    const candidate = createdAt as { _seconds?: number; toMillis?: () => number }
    const ms = candidate._seconds ? candidate._seconds * 1000 : candidate.toMillis?.()

    if (ms) {
      return new Date(ms).getFullYear()
    }
  }

  if (row.gen && /^\d{4}$/.test(String(row.gen))) {
    return Number.parseInt(String(row.gen), 10)
  }

  return null
}

function isCalonThisYear(row: SantriRow): boolean {
  const data = row as Record<string, unknown>
  const year = extractYear(row)
  const yearMatch = year === currentYear

  const status = String(row.status || '').trim().toLowerCase()
  const ppdbStatus = String((data.ppdbStatus || data.registrationStatus || '') as string)
    .trim()
    .toLowerCase()

  const hasPpdb =
    'ppdbCode' in data ||
    'ppdb' in data ||
    ('username' in data && 'publicToken' in data)

  const isPendingStatus =
    status === 'nonaktif' ||
    status === 'calon' ||
    status === 'pending' ||
    status === 'menunggu' ||
    ppdbStatus === 'candidate' ||
    ppdbStatus === 'pending'

  const isAcceptedStatus =
    status === 'aktif' ||
    ppdbStatus === 'accepted' ||
    ppdbStatus === 'diterima'

  const looksNew = isPendingStatus && (!row.kamar || row.kamar === '-')

  if (isAcceptedStatus) return false

  return yearMatch && isPendingStatus && (hasPpdb || looksNew)
}

const rowsLama = computed(() => {
  return (rows.value || []).filter((row) => !isCalonThisYear(row))
})

const activeCount = computed(() => {
  return rowsLama.value.filter((row) => String(row.status || '').toLowerCase() === 'aktif').length
})

const filtersLama = ref<Filters>({
  q: '',
  status: 'semua',
  jenjang: 'semua'
})

const sortKey = ref<ColumnKey>('santri')
const sortDir = ref<SortDir>('asc')
const currentPage = ref(1)
const pageSize = ref(25)

function resetFilters() {
  filtersLama.value = {
    q: '',
    status: 'semua',
    jenjang: 'semua'
  }
  sortKey.value = 'santri'
  sortDir.value = 'asc'
  currentPage.value = 1
}

function toggleSortDir() {
  sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
}

function setSort(key: ColumnKey) {
  if (sortKey.value === key) {
    toggleSortDir()
    return
  }

  sortKey.value = key
  sortDir.value = 'asc'
}

function matchSearch(row: SantriRow, q: string) {
  if (!q) return true

  const keyword = q.toLowerCase()
  const data = row as Record<string, unknown>

  const haystack = [
    row.santri,
    row.walisantri,
    row.nohp,
    row.kamar,
    data.maskan,
    row.alamat,
    row.jenjang,
    row.gen,
    row.status,
    data.ayahNama,
    data.ibuNama,
    data.noInduk,
    data.kelasFormal
  ]
    .map((value) => String(value || '').toLowerCase())
    .join(' | ')

  return haystack.includes(keyword)
}

function matchStatus(row: SantriRow, status: string) {
  if (status === 'semua') return true
  return String(row.status || '').toLowerCase() === status.toLowerCase()
}

function matchJenjang(row: SantriRow, jenjang: string) {
  if (jenjang === 'semua') return true
  return String(row.jenjang || '').toLowerCase() === jenjang.toLowerCase()
}

function uniqueNonEmpty(values: Array<string | number | undefined | null>) {
  return Array.from(
    new Set(
      values
        .map((value) => String(value || '').trim())
        .filter(Boolean)
    )
  )
}

const statusOptionsLama = computed(() => {
  return uniqueNonEmpty(rowsLama.value.map((row) => row.status))
})

const jenjangOptionsLama = computed(() => {
  return uniqueNonEmpty(rowsLama.value.map((row) => row.jenjang))
})

function normalizeSortValue(value: unknown) {
  if (value == null) return ''
  return String(value).toLowerCase().trim()
}

function getCellValue(row: SantriRow, key: ColumnKey) {
  return (row as Record<string, unknown>)[key]
}

const filteredLamaRows = computed(() => {
  const filtered = rowsLama.value
    .filter((row) => matchSearch(row, filtersLama.value.q))
    .filter((row) => matchStatus(row, filtersLama.value.status))
    .filter((row) => matchJenjang(row, filtersLama.value.jenjang))

  return [...filtered].sort((a, b) => {
    const av = normalizeSortValue(getCellValue(a, sortKey.value))
    const bv = normalizeSortValue(getCellValue(b, sortKey.value))
    const result = av.localeCompare(bv, 'id-ID', { numeric: true, sensitivity: 'base' })

    return sortDir.value === 'asc' ? result : -result
  })
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredLamaRows.value.length / pageSize.value))
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * pageSize.value
})

const startItem = computed(() => {
  return filteredLamaRows.value.length ? startIndex.value + 1 : 0
})

const paginatedRows = computed(() => {
  return filteredLamaRows.value.slice(startIndex.value, startIndex.value + pageSize.value)
})

const pageButtons = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const delta = 2
  const start = Math.max(1, current - delta)
  const end = Math.min(total, current + delta)
  const pages: number[] = []

  for (let page = start; page <= end; page++) {
    pages.push(page)
  }

  return pages
})

watch([filtersLama, sortKey, sortDir, pageSize], () => {
  currentPage.value = 1
}, { deep: true })

watch(totalPages, (total) => {
  if (currentPage.value > total) {
    currentPage.value = total
  }
})

function statusClass(status?: string) {
  const value = String(status || '').toLowerCase()

  if (value === 'aktif') {
    return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  }

  if (value === 'nonaktif') {
    return 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300'
  }

  if (value === 'lulus') {
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
  }

  if (value === 'cuti') {
    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  }

  return 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300'
}

const fileInputLama = ref<HTMLInputElement | null>(null)
const showProgress = ref(false)
const progress = ref(0)
const progressStatus = ref('')

function triggerImport() {
  fileInputLama.value?.click()
  menuOpen.value = false
}

async function handleImportLama(e: Event) {
  const input = e.target as HTMLInputElement

  if (!input.files?.length) return

  showProgress.value = true
  progress.value = 0
  progressStatus.value = 'Menyiapkan import...'

  await importFromExcelWithProgress(input.files[0], (percent, status) => {
    progress.value = percent
    progressStatus.value = status
  })

  input.value = ''
  await fetchSantri()
}

const showDetail = ref(false)
const detailRow = ref<SantriRow | null>(null)

function openDetail(row: SantriRow) {
  detailRow.value = row
  showDetail.value = true
}

const showForm = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const saving = ref(false)
const formError = ref<string | null>(null)
const current = ref<SantriRow | null>(null)

const form = reactive<Omit<SantriRow, 'id'>>({
  gen: '',
  santri: '',
  walisantri: '',
  nohp: '',
  kuotaKunjunganBulanIni: 0,
  kamar: '',
  jenjang: '',
  alamat: '',
  status: 'aktif'
})

function resetForm() {
  form.gen = ''
  form.santri = ''
  form.walisantri = ''
  form.nohp = ''
  form.kuotaKunjunganBulanIni = 0
  form.kamar = ''
  form.jenjang = ''
  form.alamat = ''
  form.status = 'aktif'
  formError.value = null
  current.value = null
}

function openCreate() {
  formMode.value = 'create'
  resetForm()
  showForm.value = true
}

function openEdit(row: SantriRow) {
  formMode.value = 'edit'
  current.value = row

  form.gen = row.gen || ''
  form.santri = row.santri || ''
  form.walisantri = row.walisantri || ''
  form.nohp = row.nohp || ''
  form.kuotaKunjunganBulanIni = row.kuotaKunjunganBulanIni ?? 0
  form.kamar = row.kamar || ''
  form.jenjang = row.jenjang || ''
  form.alamat = row.alamat || ''
  form.status = row.status || 'aktif'

  formError.value = null
  showForm.value = true
}

async function submitForm() {
  if (!form.santri?.trim()) {
    formError.value = 'Nama santri wajib diisi.'
    return
  }

  if (!form.gen?.trim()) {
    formError.value = 'Gen wajib diisi.'
    return
  }

  saving.value = true
  formError.value = null

  try {
    if (formMode.value === 'create') {
      await createSantri({ ...form })
    } else if (current.value?.id) {
      await updateSantri(current.value.id, { ...form })
    }

    showForm.value = false
    await fetchSantri()
  } catch (e: unknown) {
    const err = e as { message?: string }
    formError.value = err?.message || 'Gagal menyimpan data.'
  } finally {
    saving.value = false
  }
}

const showConfirm = ref(false)
const deleting = ref(false)

function openConfirm(row: SantriRow) {
  current.value = row
  showConfirm.value = true
}

async function confirmDelete() {
  if (!current.value?.id) return

  deleting.value = true

  try {
    await deleteSantri(current.value.id)
    showConfirm.value = false
    await fetchSantri()
  } finally {
    deleting.value = false
  }
}

const selectedMapelId = ref('')
const tahunAwalNilai = ref<number>(
  new Date().getMonth() >= 6
    ? new Date().getFullYear()
    : new Date().getFullYear() - 1
)
const semesterNilai = ref<'Ganjil' | 'Genap'>(
  new Date().getMonth() >= 6 ? 'Ganjil' : 'Genap'
)

const termKeyNilai = computed(() => {
  return makeTermKey(tahunAwalNilai.value, semesterNilai.value)
})

watch([selectedMapelId, termKeyNilai], ([mapelId]) => {
  unsubscribeNilai()

  if (mapelId) {
    subscribeNilai(termKeyNilai.value, mapelId)
  }
})

function normPhone(raw?: string) {
  const digits = String(raw || '').replace(/\D+/g, '')

  if (!digits) return ''
  if (digits.startsWith('0')) return '62' + digits.slice(1)
  if (digits.startsWith('620')) return '62' + digits.slice(3)

  return digits
}

function normName(raw?: string) {
  return String(raw || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function primaryGuardianName(row: SantriRow) {
  return String(row.walisantri || row.ayahNama || '')
}

const groupsWali = computed<GrupWali[]>(() => {
  const byKey = new Map<string, GrupWali>()

  for (const row of rowsLama.value) {
    const waliNameRaw = primaryGuardianName(row)
    const phone = normPhone(row.nohp)
    const waliName = normName(waliNameRaw)

    if (!waliName || !phone) continue

    const key = waliName + '|' + phone

    if (!byKey.has(key)) {
      byKey.set(key, {
        key,
        waliName: waliNameRaw || '-',
        phone,
        items: []
      })
    }

    byKey.get(key)?.items.push(row)
  }

  return Array.from(byKey.values()).filter((group) => group.items.length >= 2)
})

function statsForGroup(group: GrupWali) {
  const byStatus = new Map<string, number>()
  const byJenjang = new Map<string, number>()

  for (const row of group.items) {
    const status = String(row.status || '-')
    const jenjang = String(row.jenjang || '-')

    byStatus.set(status, (byStatus.get(status) || 0) + 1)
    byJenjang.set(jenjang, (byJenjang.get(jenjang) || 0) + 1)
  }

  return {
    total: group.items.length,
    byStatus: Array.from(byStatus.entries()).map(([k, v]) => ({ k, v })),
    byJenjang: Array.from(byJenjang.entries()).map(([k, v]) => ({ k, v }))
  }
}

function safeNumber(value: unknown) {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : undefined
}

function nilaiRingkas(santriId: string) {
  const nilai = (nilaiMap.value?.[santriId] || {}) as Record<string, unknown>

  const tugas = safeNumber(nilai.tugas)
  const harian = safeNumber(nilai.harian)
  const pts = safeNumber(nilai.pts)
  const pas = safeNumber(nilai.pas)
  const proyek = nilai.proyek != null ? safeNumber(nilai.proyek) : undefined
  const lainnya = nilai.lainnya != null ? safeNumber(nilai.lainnya) : undefined

  const components = [tugas, harian, pts, pas, proyek, lainnya].filter((value) => {
    return typeof value === 'number'
  }) as number[]

  const akhir = components.length
    ? Math.round(components.reduce((sum, value) => sum + value, 0) / components.length)
    : safeNumber(nilai.akhir)

  return {
    tugas,
    harian,
    pts,
    pas,
    proyek,
    lainnya,
    akhir,
    predikat: nilai.predikat ? String(nilai.predikat) : undefined,
    catatan: nilai.catatan ? String(nilai.catatan) : ''
  }
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

function withExt(name: string, ext: string) {
  return name.toLowerCase().endsWith(`.${ext}`) ? name : `${name}.${ext}`
}

function buildTemplateCsv() {
  const headers = [
    'No Induk',
    'Gen',
    'Nama',
    'Kamar',
    'Ayah',
    'Ibu',
    'No HP',
    'Alamat',
    'Status',
    'Kelas Formal'
  ]

  const sampleRows = [
    [
      '2024-001',
      '2024',
      'Muhammad Alif',
      'B2',
      'Budi',
      'Siti',
      '081234567890',
      'Ds. Sukamaju RT 01 RW 02',
      'aktif',
      '7 MTs A'
    ],
    [
      '2023-015',
      '2023',
      'Aisyah Zahra',
      'A1',
      'Andi',
      'Rina',
      '081298765432',
      'Jl. Melati No. 5',
      'aktif',
      '8 MTs B'
    ]
  ]

  const rowsCsv = sampleRows.map((row) => {
    return row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')
  })

  return '\uFEFF' + [headers.join(','), ...rowsCsv].join('\r\n')
}

function downloadTemplate(kind: 'lama' | 'master' = 'lama') {
  const csv = buildTemplateCsv()
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const filename = kind === 'master' ? 'template_master_santri.csv' : 'template_santri_lama.csv'

  saveBlob(blob, filename)
}

function pickExportRows(input: SantriRow[], fieldKeys: ColumnKey[]): RowDict[] {
  const labelMap: Record<ColumnKey, string> = {
    noInduk: 'No Induk',
    gen: 'Gen',
    santri: 'Nama',
    kamar: 'Kamar',
    ayahNama: 'Ayah',
    ibuNama: 'Ibu',
    nohp: 'No HP',
    alamat: 'Alamat',
    status: 'Status',
    kelasFormal: 'Kelas Formal',
    jenjang: 'Jenjang'
  }

  return input.map((row) => {
    const output: RowDict = {}

    for (const key of fieldKeys) {
      const label = labelMap[key] ?? key
      output[label] = (row as Record<string, unknown>)[key] ?? ''
    }

    return output
  })
}

function toCsv(rowsDict: RowDict[]) {
  if (!rowsDict.length) return '\uFEFF'

  const headers = Object.keys(rowsDict[0])

  const lines = rowsDict.map((row) => {
    return headers
      .map((header) => {
        const cell = row[header] ?? ''
        const text = String(cell)

        if (/[",\r\n]/.test(text)) {
          return `"${text.replace(/"/g, '""')}"`
        }

        return text
      })
      .join(',')
  })

  return '\uFEFF' + [headers.join(','), ...lines].join('\r\n')
}

function exportCSV(data: SantriRow[], filename = 'export.csv') {
  const rowsDict = pickExportRows(data, selectedFieldKeys.value)
  const csv = toCsv(rowsDict)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })

  saveBlob(blob, withExt(filename, 'csv'))
}

async function exportExcel(data: SantriRow[], filename = 'export.xlsx') {
  const rowsDict = pickExportRows(data, selectedFieldKeys.value)
  const XLSXModule = await import('xlsx')
  const XLSX = XLSXModule.default || XLSXModule

  const ws = XLSX.utils.json_to_sheet(rowsDict, { skipHeader: false })
  const headers = Object.keys(rowsDict[0] || {})

  ws['!cols'] = headers.map((header) => {
    let maxLen = String(header).length

    rowsDict.forEach((row) => {
      const len = String(row[header] ?? '').length

      if (len > maxLen) {
        maxLen = len
      }
    })

    return {
      wch: Math.min(Math.max(maxLen + 2, 10), 60)
    }
  })

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Santri')

  const wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    type: 'array'
  })

  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })

  saveBlob(blob, withExt(filename, 'xlsx'))
}
</script>