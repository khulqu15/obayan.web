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
            Wali Management
          </div>

          <h1 class="mt-4 text-2xl font-extrabold tracking-tight md:text-4xl">
            Data Wali & Orang Tua
          </h1>

          <p class="mt-3 max-w-xl text-sm text-green-50/90 md:text-base">
            Kelola data wali, nomor WhatsApp, alamat, dan daftar santri dalam tampilan tabel yang lebih rapi dan mudah dicari.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-2xl bg-white/12 px-4 py-3 ring-1 ring-white/15 backdrop-blur">
            <div class="text-xs text-green-100">Total Wali</div>
            <div class="mt-1 text-2xl font-bold">{{ waliRows.length }}</div>
          </div>

          <div class="rounded-2xl bg-white/12 px-4 py-3 ring-1 ring-white/15 backdrop-blur">
            <div class="text-xs text-green-100">Total Santri</div>
            <div class="mt-1 text-2xl font-bold">{{ totalSantriLinked }}</div>
          </div>

          <div class="rounded-2xl bg-white/12 px-4 py-3 ring-1 ring-white/15 backdrop-blur">
            <div class="text-xs text-green-100">Ada Nomor</div>
            <div class="mt-1 text-2xl font-bold">{{ waliWithPhone }}</div>
          </div>

          <div class="rounded-2xl bg-white/12 px-4 py-3 ring-1 ring-white/15 backdrop-blur">
            <div class="text-xs text-green-100">Multi Santri</div>
            <div class="mt-1 text-2xl font-bold">{{ multiSantriWali }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="rounded-[24px] border border-gray-200/80 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90">
      <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div class="grid flex-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <div class="relative">
            <input
              v-model="filters.q"
              type="text"
              placeholder="Cari wali, nomor, alamat, atau nama santri..."
              class="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />

            <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </span>
          </div>

          <select
            v-model="filters.jenjang"
            class="h-11 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          >
            <option value="semua">Semua Jenjang</option>
            <option v-for="j in jenjangOptions" :key="j" :value="j">{{ j }}</option>
          </select>

          <select
            v-model="filters.status"
            class="h-11 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          >
            <option value="semua">Semua Status</option>
            <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
          </select>

          <select
            v-model="sortKey"
            class="h-11 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          >
            <option value="waliname">Urutkan: Nama Wali</option>
            <option value="nohp">Urutkan: Nomor HP</option>
            <option value="alamat">Urutkan: Alamat</option>
            <option value="santriCount">Urutkan: Jumlah Santri</option>
          </select>

          <button
            type="button"
            @click="toggleSortDir"
            class="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            {{ sortDir === 'asc' ? 'A → Z' : 'Z → A' }}
          </button>
  
          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              @click="resetFilters"
              class="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Reset
            </button>
  
            <button
              type="button"
              @click="exportCSV"
              class="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Export CSV
            </button>
  
            <button
              type="button"
              @click="reloadWali"
              class="inline-flex h-11 items-center justify-center rounded-2xl bg-green-600 px-5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="waliLoading"
            >
              {{ waliLoading ? 'Memuat...' : 'Muat Ulang' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div
      v-if="waliError"
      class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300"
    >
      {{ waliError }}
    </div>

    <!-- Table -->
    <div class="rounded-[24px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div class="flex flex-col gap-3 border-b border-gray-100 p-4 dark:border-neutral-800 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 class="text-base font-bold text-gray-900 dark:text-white">
            Daftar Wali Santri
          </h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            Menampilkan {{ paginatedRows.length }} dari {{ filteredRows.length }} wali.
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
            @click="collapseAll"
            class="inline-flex h-10 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Tutup Semua
          </button>
        </div>
      </div>

      <div v-if="waliLoading" class="grid gap-3 p-4">
        <div v-for="i in 7" :key="i" class="h-16 animate-pulse rounded-2xl bg-gray-100 dark:bg-neutral-800"></div>
      </div>

      <div v-else-if="filteredRows.length === 0" class="p-10 text-center">
        <div class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-green-50 text-3xl text-green-600 dark:bg-green-900/20 dark:text-green-300">
          👪
        </div>
        <h3 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">
          Data wali tidak ditemukan
        </h3>
        <p class="mt-2 text-sm text-gray-500 dark:text-neutral-400">
          Coba ubah kata kunci, jenjang, status, atau reset filter.
        </p>
      </div>

      <div v-else class="overflow-auto">
        <table class="min-w-[1080px] w-full text-sm">
          <thead class="bg-gray-50 text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
            <tr>
              <th class="w-14 px-4 py-3 text-left">No</th>

              <th class="px-4 py-3 text-left">
                <button
                  type="button"
                  @click="setSort('waliname')"
                  class="inline-flex items-center gap-1 font-semibold hover:text-green-600"
                >
                  Nama Wali
                  <span v-if="sortKey === 'waliname'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
                </button>
              </th>

              <th class="px-4 py-3 text-left">
                <button
                  type="button"
                  @click="setSort('nohp')"
                  class="inline-flex items-center gap-1 font-semibold hover:text-green-600"
                >
                  No HP
                  <span v-if="sortKey === 'nohp'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
                </button>
              </th>

              <th class="px-4 py-3 text-left">
                <button
                  type="button"
                  @click="setSort('alamat')"
                  class="inline-flex items-center gap-1 font-semibold hover:text-green-600"
                >
                  Alamat
                  <span v-if="sortKey === 'alamat'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
                </button>
              </th>

              <th class="px-4 py-3 text-left">
                <button
                  type="button"
                  @click="setSort('santriCount')"
                  class="inline-flex items-center gap-1 font-semibold hover:text-green-600"
                >
                  Santri
                  <span v-if="sortKey === 'santriCount'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
                </button>
              </th>

              <th class="sticky right-0 z-10 bg-gray-50 px-4 py-3 text-left dark:bg-neutral-800">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 dark:divide-neutral-800">
            <template v-for="(w, index) in paginatedRows" :key="w.id">
              <tr class="transition hover:bg-green-50/40 dark:hover:bg-green-900/10">
                <td class="px-4 py-4 text-gray-500 dark:text-neutral-400">
                  {{ startItem + index }}
                </td>

                <td class="px-4 py-4 align-top">
                  <div class="flex items-center gap-3">
                    <div class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-green-50 text-sm font-bold text-green-700 dark:bg-green-900/20 dark:text-green-300">
                      {{ initials(w.waliname) }}
                    </div>

                    <div class="min-w-0">
                      <div class="font-bold text-gray-900 dark:text-white">
                        {{ w.waliname || 'Tidak diketahui' }}
                      </div>
                      <div class="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                        {{ w.santri.length }} santri terhubung
                      </div>
                    </div>
                  </div>
                </td>

                <td class="px-4 py-4 align-top">
                  <div v-if="w.nohp" class="space-y-1">
                    <a
                      :href="waUrl(w.nohp)"
                      target="_blank"
                      class="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 transition hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30"
                    >
                      <Icon icon="ri:whatsapp-fill" width="16" height="16" />
                      {{ displayPhone(w.nohp) }}
                    </a>
                  </div>

                  <span v-else class="text-gray-400">—</span>
                </td>

                <td class="px-4 py-4 align-top">
                  <span class="line-clamp-2 max-w-xs text-gray-600 dark:text-neutral-300">
                    {{ w.alamat || '—' }}
                  </span>
                </td>

                <td class="px-4 py-4 align-top">
                  <button
                    type="button"
                    @click="openSantriList(w)"
                    class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    {{ expanded.has(w.id) ? 'Sembunyikan' : 'Tampilkan' }}
                    <span class="ml-1 rounded-full bg-green-50 px-2 py-0.5 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                      {{ w.santri.length }}
                    </span>
                  </button>
                </td>

                <td class="sticky right-0 z-10 bg-white px-4 py-4 align-top dark:bg-neutral-900">
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      @click="openSantriList(w)"
                      class="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      Detail
                    </button>

                    <a
                      v-if="w.nohp"
                      :href="waUrl(w.nohp, `Assalamu'alaikum, Bapak/Ibu ${w.waliname}.`)"
                      target="_blank"
                      class="rounded-xl bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-green-700"
                    >
                      Chat
                    </a>
                  </div>
                </td>
              </tr>

              <tr v-if="expanded.has(w.id)" class="hidden sm:table-row">
                <td colspan="6" class="bg-gray-50/70 px-4 py-4 dark:bg-neutral-950/40">
                  <div class="overflow-hidden rounded-[20px] border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                    <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-neutral-800">
                      <div>
                        <div class="text-sm font-bold text-gray-900 dark:text-white">
                          Santri dari Bapak/Ibu {{ w.waliname }}
                        </div>
                        <div class="text-xs text-gray-500 dark:text-neutral-400">
                          Total {{ w.santri.length }} santri
                        </div>
                      </div>
                    </div>

                    <div class="overflow-auto">
                      <table class="min-w-[820px] w-full text-xs">
                        <thead class="bg-gray-50 text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
                          <tr>
                            <th class="px-4 py-3 text-left">Nama</th>
                            <th class="px-4 py-3 text-left">Gen</th>
                            <th class="px-4 py-3 text-left">Jenjang</th>
                            <th class="px-4 py-3 text-left">Status</th>
                            <th class="px-4 py-3 text-left">Kamar</th>
                            <th class="px-4 py-3 text-left">Maskan</th>
                            <th class="px-4 py-3 text-left">Aksi</th>
                          </tr>
                        </thead>

                        <tbody class="divide-y divide-gray-100 dark:divide-neutral-800">
                          <tr v-for="s in w.santri" :key="s.id" class="hover:bg-green-50/40 dark:hover:bg-green-900/10">
                            <td class="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                              {{ s.name || '—' }}
                            </td>

                            <td class="px-4 py-3">{{ s.gen || '—' }}</td>
                            <td class="px-4 py-3">{{ s.jenjang || '—' }}</td>

                            <td class="px-4 py-3">
                              <span
                                :class="[
                                  'inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize',
                                  statusClass(s.status)
                                ]"
                              >
                                {{ s.status || '—' }}
                              </span>
                            </td>

                            <td class="px-4 py-3">{{ s.kamar || '—' }}</td>
                            <td class="px-4 py-3">{{ s.maskan || '—' }}</td>

                            <td class="px-4 py-3">
                              <div class="flex items-center gap-2">
                                <button
                                  type="button"
                                  @click="openSantriEdit(s.id)"
                                  class="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  @click="openSantriDelete(s.id)"
                                  class="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700"
                                >
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>

                          <tr v-if="!w.santri.length">
                            <td colspan="7" class="px-4 py-5 text-center text-gray-500 dark:text-neutral-400">
                              Tidak ada santri.
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="!waliLoading && filteredRows.length"
        class="flex flex-col gap-3 border-t border-gray-100 p-4 dark:border-neutral-800 md:flex-row md:items-center md:justify-between"
      >
        <div class="text-sm text-gray-500 dark:text-neutral-400">
          Halaman {{ currentPage }} dari {{ totalPages }} • {{ filteredRows.length }} wali
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

    <!-- Mobile / Detail Santri Modal -->
    <ModalShell
      v-model="showSantriModal"
      :title="activeWali ? `Santri dari Bapak/Ibu ${activeWali.waliname}` : 'Daftar Santri'"
      size="5xl"
    >
      <div v-if="activeWali" class="space-y-4">
        <div class="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
          <div class="font-bold text-gray-900 dark:text-white">
            {{ activeWali.waliname || 'Tidak diketahui' }}
          </div>

          <div class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            {{ activeWali.santri.length }} santri • {{ activeWali.alamat || 'Alamat belum tersedia' }}
          </div>

          <a
            v-if="activeWali.nohp"
            :href="waUrl(activeWali.nohp)"
            target="_blank"
            class="mt-3 inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
          >
            <Icon icon="ri:whatsapp-fill" width="18" height="18" />
            Chat WhatsApp
          </a>
        </div>

        <div class="overflow-auto rounded-[20px] border border-gray-200 dark:border-neutral-800">
          <table class="min-w-[760px] w-full text-sm">
            <thead class="bg-gray-50 text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
              <tr>
                <th class="px-4 py-3 text-left">Nama</th>
                <th class="px-4 py-3 text-left">Gen</th>
                <th class="px-4 py-3 text-left">Jenjang</th>
                <th class="px-4 py-3 text-left">Status</th>
                <th class="px-4 py-3 text-left">Kamar</th>
                <th class="px-4 py-3 text-left">Maskan</th>
                <th class="px-4 py-3 text-left">Aksi</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-neutral-800">
              <tr v-for="s in activeWali.santri" :key="s.id">
                <td class="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                  {{ s.name || '—' }}
                </td>
                <td class="px-4 py-3">{{ s.gen || '—' }}</td>
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
                <td class="px-4 py-3">{{ s.kamar || '—' }}</td>
                <td class="px-4 py-3">{{ s.maskan || '—' }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      @click="openSantriEdit(s.id)"
                      class="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      @click="openSantriDelete(s.id)"
                      class="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="!activeWali.santri.length">
                <td colspan="7" class="px-4 py-6 text-center text-gray-500 dark:text-neutral-400">
                  Tidak ada santri.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <template #footer>
        <button
          type="button"
          @click="showSantriModal = false"
          class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          Tutup
        </button>
      </template>
    </ModalShell>

    <!-- Santri Edit Modal -->
    <ModalShell
      v-model="showSantriForm"
      :title="santriFormMode === 'edit' ? 'Ubah Data Santri' : 'Tambah Santri'"
      size="4xl"
    >
      <form class="space-y-4" @submit.prevent="submitSantriForm">
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
              Nama Santri
            </label>
            <input
              v-model.trim="santriForm.santri"
              required
              class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
              Gen
            </label>
            <input
              v-model.trim="santriForm.gen"
              class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
              Jenjang
            </label>
            <input
              v-model.trim="santriForm.jenjang"
              class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
              Status
            </label>
            <select
              v-model="santriForm.status"
              class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="">Pilih Status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
              <option value="lulus">Lulus</option>
              <option value="cuti">Cuti</option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
              Kamar
            </label>
            <input
              v-model.trim="santriForm.kamar"
              class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
              Maskan
            </label>
            <input
              v-model.trim="santriForm.maskan"
              class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>
        </div>

        <p
          v-if="santriFormError"
          class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-300"
        >
          {{ santriFormError }}
        </p>
      </form>

      <template #footer>
        <button
          type="button"
          @click="showSantriForm = false"
          class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          Batal
        </button>

        <button
          type="button"
          :disabled="santriSaving"
          @click="submitSantriForm"
          class="inline-flex min-w-[120px] items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ santriSaving ? 'Menyimpan...' : 'Simpan' }}
        </button>
      </template>
    </ModalShell>

    <!-- Delete Modal -->
    <ModalShell v-model="showSantriDelete" title="Hapus Data Santri">
      <p class="text-sm text-gray-700 dark:text-neutral-200">
        Apakah Anda yakin ingin menghapus santri
        <strong>{{ santriCurrent?.santri }}</strong>?
        Tindakan ini tidak dapat dibatalkan.
      </p>

      <template #footer>
        <button
          type="button"
          @click="showSantriDelete = false"
          class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          Batal
        </button>

        <button
          type="button"
          :disabled="santriDeleting"
          @click="confirmSantriDelete"
          class="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ santriDeleting ? 'Menghapus...' : 'Hapus' }}
        </button>
      </template>
    </ModalShell>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import ModalShell from '~/components/widget/ModalShell.vue'
import { useWali, type WaliRow } from '~/composables/data/useWali'
import { useSantri, type SantriRow } from '~/composables/data/useSantri'

definePageMeta({
  layout: 'app',
  layoutProps: { title: 'Wali Santri' }
})

type SortKey = 'waliname' | 'nohp' | 'alamat' | 'santriCount'
type SortDir = 'asc' | 'desc'

type Filters = {
  q: string
  jenjang: string
  status: string
}

const {
  rows: waliRowsRef,
  loading: waliLoading,
  error: waliError,
  fetchWali
} = useWali()

const {
  rows: santriRows,
  fetchSantri,
  updateSantri,
  deleteSantri
} = useSantri()

const waliRows = computed<WaliRow[]>(() => waliRowsRef.value || [])

onMounted(async () => {
  await Promise.all([fetchSantri(), fetchWali()])
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile)
})

async function reloadWali() {
  await Promise.all([fetchSantri(), fetchWali()])
}

const filters = ref<Filters>({
  q: '',
  jenjang: 'semua',
  status: 'semua'
})

const sortKey = ref<SortKey>('waliname')
const sortDir = ref<SortDir>('asc')
const currentPage = ref(1)
const pageSize = ref(25)

const expanded = ref<Set<string>>(new Set())
const isMobile = ref(false)
const showSantriModal = ref(false)
const activeWali = ref<WaliRow | null>(null)

function updateIsMobile() {
  isMobile.value = window.matchMedia('(max-width: 639px)').matches
}

function toggleSortDir() {
  sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
}

function setSort(key: SortKey) {
  if (sortKey.value === key) {
    toggleSortDir()
    return
  }

  sortKey.value = key
  sortDir.value = 'asc'
}

function resetFilters() {
  filters.value = {
    q: '',
    jenjang: 'semua',
    status: 'semua'
  }
  sortKey.value = 'waliname'
  sortDir.value = 'asc'
  currentPage.value = 1
}

function collapseAll() {
  expanded.value = new Set()
}

function openSantriList(wali: WaliRow) {
  if (isMobile.value) {
    activeWali.value = wali
    showSantriModal.value = true
    return
  }

  const next = new Set(expanded.value)

  if (next.has(wali.id)) {
    next.delete(wali.id)
  } else {
    next.add(wali.id)
  }

  expanded.value = next
}

const totalSantriLinked = computed(() => {
  return waliRows.value.reduce((total, wali) => total + wali.santri.length, 0)
})

const waliWithPhone = computed(() => {
  return waliRows.value.filter((wali) => Boolean(String(wali.nohp || '').trim())).length
})

const multiSantriWali = computed(() => {
  return waliRows.value.filter((wali) => wali.santri.length > 1).length
})

const jenjangOptions = computed(() => {
  return uniqueNonEmpty(
    waliRows.value.flatMap((wali) => wali.santri.map((santri) => santri.jenjang))
  )
})

const statusOptions = computed(() => {
  return uniqueNonEmpty(
    waliRows.value.flatMap((wali) => wali.santri.map((santri) => santri.status))
  )
})

function uniqueNonEmpty(values: Array<string | number | undefined | null>) {
  return Array.from(
    new Set(
      values
        .map((value) => String(value || '').trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b, 'id-ID', { sensitivity: 'base' }))
}

function matchSearch(wali: WaliRow, keyword: string) {
  if (!keyword.trim()) return true

  const q = keyword.toLowerCase()
  const santriText = wali.santri
    .map((santri) => {
      return [
        santri.name,
        santri.gen,
        santri.jenjang,
        santri.status,
        santri.kamar,
        santri.maskan
      ].join(' ')
    })
    .join(' ')

  const haystack = [
    wali.waliname,
    wali.nohp,
    wali.alamat,
    santriText
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(q)
}

function matchJenjang(wali: WaliRow, jenjang: string) {
  if (jenjang === 'semua') return true

  return wali.santri.some((santri) => {
    return String(santri.jenjang || '').toLowerCase() === jenjang.toLowerCase()
  })
}

function matchStatus(wali: WaliRow, status: string) {
  if (status === 'semua') return true

  return wali.santri.some((santri) => {
    return String(santri.status || '').toLowerCase() === status.toLowerCase()
  })
}

function normalizeSortValue(value: unknown) {
  if (value == null) return ''
  return String(value).toLowerCase().trim()
}

function getSortValue(wali: WaliRow, key: SortKey) {
  if (key === 'santriCount') return wali.santri.length
  return wali[key]
}

const filteredRows = computed(() => {
  const result = waliRows.value
    .filter((wali) => matchSearch(wali, filters.value.q))
    .filter((wali) => matchJenjang(wali, filters.value.jenjang))
    .filter((wali) => matchStatus(wali, filters.value.status))

  return [...result].sort((a, b) => {
    const av = getSortValue(a, sortKey.value)
    const bv = getSortValue(b, sortKey.value)

    if (typeof av === 'number' && typeof bv === 'number') {
      return sortDir.value === 'asc' ? av - bv : bv - av
    }

    const resultCompare = normalizeSortValue(av).localeCompare(
      normalizeSortValue(bv),
      'id-ID',
      { numeric: true, sensitivity: 'base' }
    )

    return sortDir.value === 'asc' ? resultCompare : -resultCompare
  })
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value))
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * pageSize.value
})

const startItem = computed(() => {
  return filteredRows.value.length ? startIndex.value + 1 : 0
})

const paginatedRows = computed(() => {
  return filteredRows.value.slice(startIndex.value, startIndex.value + pageSize.value)
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

watch([filters, sortKey, sortDir, pageSize], () => {
  currentPage.value = 1
}, { deep: true })

watch(totalPages, (total) => {
  if (currentPage.value > total) {
    currentPage.value = total
  }
})

function sanitizePhoneID(input: string) {
  let digits = String(input || '').trim().replace(/[^\d]/g, '')

  if (!digits) return ''
  if (digits.startsWith('0062')) digits = '62' + digits.slice(4)
  if (digits.startsWith('62')) return digits[2] === '0' ? '62' + digits.slice(3) : digits
  if (digits.startsWith('8')) {
    const idx = digits.indexOf('628')
    return idx > 0 ? digits.slice(idx) : '62' + digits
  }
  if (digits.startsWith('0')) return '62' + digits.slice(1)
  if (digits.startsWith('00')) return digits.slice(2)

  return digits
}

function waUrl(phone: string, text?: string) {
  const number = sanitizePhoneID(phone)

  if (!number) return '#'

  const query = text ? `?text=${encodeURIComponent(text)}` : ''
  return `https://wa.me/${number}${query}`
}

function displayPhone(phone: string) {
  return phone || '—'
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

const showSantriForm = ref(false)
const santriFormMode = ref<'create' | 'edit'>('edit')
const santriSaving = ref(false)
const santriFormError = ref<string | null>(null)
const santriCurrent = ref<SantriRow | null>(null)

const santriForm = reactive<Partial<SantriRow>>({
  santri: '',
  gen: '',
  jenjang: '',
  status: '',
  kamar: '',
  maskan: ''
})

function fillSantriFormFromRow(row: SantriRow) {
  santriForm.santri = row.santri || ''
  santriForm.gen = row.gen || ''
  santriForm.jenjang = row.jenjang || ''
  santriForm.status = row.status || ''
  santriForm.kamar = row.kamar || ''
  santriForm.maskan = row.maskan || ''
}

function openSantriEdit(id: string) {
  const row = santriRows.value.find((item) => item.id === id)

  if (!row) return

  santriFormMode.value = 'edit'
  santriCurrent.value = row
  santriFormError.value = null
  fillSantriFormFromRow(row)
  showSantriForm.value = true
}

async function submitSantriForm() {
  if (!santriCurrent.value?.id) return

  if (!String(santriForm.santri || '').trim()) {
    santriFormError.value = 'Nama santri wajib diisi.'
    return
  }

  santriSaving.value = true
  santriFormError.value = null

  try {
    await updateSantri(santriCurrent.value.id, {
      santri: santriForm.santri,
      gen: santriForm.gen,
      jenjang: santriForm.jenjang,
      status: santriForm.status,
      kamar: santriForm.kamar,
      maskan: santriForm.maskan
    })

    await Promise.all([fetchSantri(), fetchWali()])
    showSantriForm.value = false
  } catch (e: unknown) {
    const err = e as { message?: string }
    santriFormError.value = err?.message || 'Gagal menyimpan data.'
  } finally {
    santriSaving.value = false
  }
}

const showSantriDelete = ref(false)
const santriDeleting = ref(false)

function openSantriDelete(id: string) {
  const row = santriRows.value.find((item) => item.id === id)

  if (!row) return

  santriCurrent.value = row
  showSantriDelete.value = true
}

async function confirmSantriDelete() {
  if (!santriCurrent.value?.id) return

  santriDeleting.value = true

  try {
    await deleteSantri(santriCurrent.value.id)
    await Promise.all([fetchSantri(), fetchWali()])
    showSantriDelete.value = false
  } finally {
    santriDeleting.value = false
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

function toCsvCell(value: unknown) {
  const text = String(value ?? '')

  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }

  return text
}

function exportCSV() {
  const headers = [
    'Nama Wali',
    'No HP',
    'Alamat',
    'Jumlah Santri',
    'Daftar Santri'
  ]

  const lines = filteredRows.value.map((wali) => {
    const santriNames = wali.santri.map((santri) => santri.name).join('; ')

    return [
      wali.waliname,
      wali.nohp,
      wali.alamat,
      wali.santri.length,
      santriNames
    ]
      .map(toCsvCell)
      .join(',')
  })

  const csv = '\uFEFF' + [headers.join(','), ...lines].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })

  saveBlob(blob, 'data_wali_santri.csv')
}
</script>