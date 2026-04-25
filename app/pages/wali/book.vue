<template>
  <section class="space-y-6 p-4 md:p-6">
    <!-- Hero -->
    <div class="relative overflow-hidden rounded-[32px] border border-green-100 bg-gradient-to-br from-green-600 via-emerald-600 to-lime-500 p-5 text-white shadow-[0_24px_70px_-28px_rgba(22,163,74,0.55)] dark:border-neutral-800 md:p-7">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-white blur-3xl"></div>
        <div class="absolute -bottom-14 left-8 h-40 w-40 rounded-full bg-lime-200 blur-3xl"></div>
      </div>

      <div class="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div class="min-w-0">
          <div class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold ring-1 ring-white/20 backdrop-blur">
            <span class="h-2 w-2 rounded-full bg-lime-300"></span>
            Learning Books
          </div>

          <h1 class="mt-4 text-2xl font-black tracking-tight md:text-4xl">
            Kitab & Buku Santri
          </h1>

          <p class="mt-2 max-w-xl text-sm leading-6 text-green-50/90 md:text-base">
            Pantau kitab, buku pelajaran, materi diniyah, target halaman, progress belajar, dan catatan pembimbing santri.
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
              <div class="text-lg font-black">{{ bookItems.length }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Total</div>
            </div>

            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ studyingItems.length }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Aktif</div>
            </div>

            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ averageProgress }}%</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Progress</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty Santri -->
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
        <!-- Summary Cards -->
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Total Kitab/Buku
                </div>

                <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {{ bookItems.length }}
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Semua kitab dan buku yang tercatat.
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <Icon icon="ph:books-duotone" class="h-6 w-6" />
              </div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Sedang Dipelajari
                </div>

                <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {{ studyingItems.length }}
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Materi aktif berjalan.
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                <Icon icon="ph:book-open-text-duotone" class="h-6 w-6" />
              </div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Selesai
                </div>

                <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {{ completedItems.length }}
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Kitab/buku yang sudah tuntas.
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
                  Rata-rata Progress
                </div>

                <div class="mt-2 flex items-end gap-1">
                  <span class="text-3xl font-black text-slate-900 dark:text-white">{{ averageProgress }}</span>
                  <span class="pb-1 text-xs font-bold text-slate-400 dark:text-neutral-500">%</span>
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Berdasarkan seluruh materi.
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                <Icon icon="solar:chart-linear" class="h-6 w-6" />
              </div>
            </div>

            <div class="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800">
              <div
                class="h-full rounded-full bg-green-500 transition-all duration-500"
                :style="{ width: averageProgress + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Insight -->
        <div class="grid gap-4 xl:grid-cols-[1fr,0.82fr]">
          <div class="relative overflow-hidden rounded-[32px] border border-green-100 bg-gradient-to-br from-slate-950 via-green-950 to-emerald-900 p-5 text-white shadow-sm dark:border-neutral-800">
            <div class="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-green-300/20 blur-3xl"></div>

            <div class="relative z-10">
              <div class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black ring-1 ring-white/15">
                <Icon icon="ph:sparkle-duotone" class="h-4 w-4" />
                Learning Insight
              </div>

              <h2 class="mt-4 text-xl font-black">
                {{ learningInsight.title }}
              </h2>

              <p class="mt-2 text-sm leading-6 text-white/75">
                {{ learningInsight.desc }}
              </p>

              <div class="mt-5">
                <div class="flex items-center justify-between text-xs font-bold text-white/70">
                  <span>Learning Progress Score</span>
                  <span>{{ learningScore }}/100</span>
                </div>

                <div class="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-lime-300 to-green-400 transition-all duration-500"
                    :style="{ width: learningScore + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Fokus Belajar
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Rekomendasi berdasarkan progress kitab/buku.
                </p>
              </div>

              <span class="rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
                {{ focusItems.length }} item
              </span>
            </div>

            <div class="space-y-3">
              <div
                v-for="item in focusItems"
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
          <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr,0.65fr,0.65fr,0.65fr,0.55fr,0.5fr]">
            <div class="relative">
              <input
                v-model="filters.q"
                type="text"
                placeholder="Cari kitab, buku, mapel, guru, bab, catatan..."
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
              <option value="kitab">Kitab</option>
              <option value="buku">Buku</option>
              <option value="modul">Modul</option>
              <option value="materi">Materi</option>
            </select>

            <select
              v-model="filters.category"
              class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="semua">Semua Kategori</option>
              <option
                v-for="category in categoryOptions"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>

            <select
              v-model="filters.status"
              class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="semua">Semua Status</option>
              <option value="dipelajari">Dipelajari</option>
              <option value="selesai">Selesai</option>
              <option value="belum mulai">Belum Mulai</option>
              <option value="tertunda">Tertunda</option>
            </select>

            <select
              v-model="filters.sort"
              class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="progress-tertinggi">Progress</option>
              <option value="terbaru">Terbaru</option>
              <option value="judul">Judul</option>
              <option value="status">Status</option>
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
                  Daftar Kitab & Buku
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
                  <option :value="6">6 / halaman</option>
                  <option :value="12">12 / halaman</option>
                  <option :value="24">24 / halaman</option>
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
                <Icon icon="ph:books-duotone" class="h-8 w-8" />
              </div>

              <h3 class="mt-4 text-lg font-black text-slate-900 dark:text-white">
                Kitab/buku tidak ditemukan
              </h3>

              <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                Coba ubah filter atau tunggu data diinput admin/guru.
              </p>
            </div>

            <div v-else class="grid gap-4 p-5 md:grid-cols-2">
              <article
                v-for="row in paginatedRows"
                :key="row.id"
                class="group rounded-[28px] border border-slate-100 bg-slate-50 p-4 transition hover:-translate-y-1 hover:border-green-200 hover:bg-green-50 dark:border-neutral-800 dark:bg-neutral-800/60 dark:hover:bg-green-900/10"
              >
                <div class="flex items-start gap-3">
                  <div :class="['grid h-12 w-12 shrink-0 place-items-center rounded-2xl', typeIconClass(row.type)]">
                    <Icon :icon="typeIcon(row.type)" class="h-6 w-6" />
                  </div>

                  <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <h3 class="line-clamp-2 font-black text-slate-900 dark:text-white">
                        {{ row.title }}
                      </h3>

                      <span :class="['rounded-full px-2.5 py-1 text-[11px] font-black capitalize', statusBadgeClass(row.status)]">
                        {{ row.status }}
                      </span>
                    </div>

                    <p class="mt-1 line-clamp-1 text-xs font-bold text-slate-500 dark:text-neutral-400">
                      {{ row.category }} • {{ row.teacher || 'Guru belum diatur' }}
                    </p>
                  </div>
                </div>

                <div class="mt-4 rounded-[22px] bg-white p-4 dark:bg-neutral-900">
                  <div class="mb-2 flex items-center justify-between text-xs font-bold">
                    <span class="text-slate-500 dark:text-neutral-400">Progress Belajar</span>
                    <span class="text-slate-900 dark:text-white">{{ row.progress }}%</span>
                  </div>

                  <div class="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800">
                    <div
                      class="h-full rounded-full bg-green-500 transition-all duration-500"
                      :style="{ width: row.progress + '%' }"
                    ></div>
                  </div>

                  <div class="mt-3 grid grid-cols-2 gap-2">
                    <div class="rounded-2xl bg-slate-50 p-3 dark:bg-neutral-800">
                      <div class="text-[11px] font-bold text-slate-400">Materi</div>
                      <div class="mt-1 line-clamp-1 text-sm font-black text-slate-900 dark:text-white">
                        {{ row.currentChapter || '—' }}
                      </div>
                    </div>

                    <div class="rounded-2xl bg-slate-50 p-3 dark:bg-neutral-800">
                      <div class="text-[11px] font-bold text-slate-400">Target</div>
                      <div class="mt-1 line-clamp-1 text-sm font-black text-slate-900 dark:text-white">
                        {{ row.targetChapter || '—' }}
                      </div>
                    </div>
                  </div>
                </div>

                <p class="mt-3 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                  {{ row.note || row.description || 'Belum ada catatan pembelajaran.' }}
                </p>

                <div class="mt-4 flex items-center justify-between gap-2">
                  <span :class="['rounded-full px-3 py-1.5 text-xs font-black capitalize', typeBadgeClass(row.type)]">
                    {{ row.type }}
                  </span>

                  <button
                    type="button"
                    @click="openDetail(row)"
                    class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    Detail
                  </button>
                </div>
              </article>
            </div>

            <!-- Pagination -->
            <div
              v-if="visibleRows.length > 0"
              class="flex flex-col gap-3 border-t border-slate-100 p-5 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between"
            >
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

          <!-- Right Panel -->
          <div class="space-y-4">
            <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="mb-4">
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Progress per Kategori
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Ringkasan kitab/buku berdasarkan kategori.
                </p>
              </div>

              <div v-if="categoryProgress.length === 0" class="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400">
                Belum ada kategori.
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="item in categoryProgress"
                  :key="item.category"
                >
                  <div class="mb-1 flex items-center justify-between text-xs font-bold">
                    <span class="text-slate-600 dark:text-neutral-300">{{ item.category }}</span>
                    <span class="text-slate-400 dark:text-neutral-500">{{ item.avg }}%</span>
                  </div>

                  <div class="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800">
                    <div
                      class="h-full rounded-full bg-green-500 transition-all duration-500"
                      :style="{ width: item.avg + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="mb-4">
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Materi Aktif
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Kitab/buku yang sedang berjalan.
                </p>
              </div>

              <div v-if="studyingItems.length === 0" class="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400">
                Belum ada materi aktif.
              </div>

              <div v-else class="space-y-3">
                <button
                  v-for="row in studyingItems.slice(0, 5)"
                  :key="row.id"
                  type="button"
                  @click="openDetail(row)"
                  class="flex w-full items-start gap-3 rounded-[24px] border border-slate-100 bg-slate-50 p-4 text-left transition hover:bg-green-50 dark:border-neutral-800 dark:bg-neutral-800/60 dark:hover:bg-green-900/10"
                >
                  <div :class="['grid h-10 w-10 shrink-0 place-items-center rounded-2xl', typeIconClass(row.type)]">
                    <Icon :icon="typeIcon(row.type)" class="h-5 w-5" />
                  </div>

                  <div class="min-w-0 flex-1">
                    <div class="line-clamp-1 font-black text-slate-900 dark:text-white">
                      {{ row.title }}
                    </div>

                    <div class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                      {{ row.progress }}% • {{ row.currentChapter || 'Materi berjalan' }}
                    </div>
                  </div>
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
                  Export Data Buku
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>

    <!-- Detail Modal -->
    <div
      v-if="detailOpen && selectedBook"
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
                  <span :class="['rounded-full px-3 py-1.5 text-xs font-black capitalize', typeBadgeClass(selectedBook.type)]">
                    {{ selectedBook.type }}
                  </span>

                  <span :class="['rounded-full px-3 py-1.5 text-xs font-black capitalize', statusBadgeClass(selectedBook.status)]">
                    {{ selectedBook.status }}
                  </span>
                </div>

                <h3 class="mt-3 text-xl font-black text-slate-900 dark:text-white md:text-2xl">
                  {{ selectedBook.title }}
                </h3>

                <p class="mt-1 text-sm text-slate-500 dark:text-neutral-400">
                  {{ selectedBook.category }} • {{ selectedBook.teacher || 'Guru belum diatur' }}
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
            <div class="rounded-[28px] border border-green-100 bg-green-50 p-5 dark:border-green-900/30 dark:bg-green-900/10">
              <div class="mb-2 flex items-center justify-between text-xs font-bold text-green-700 dark:text-green-300">
                <span>Progress Belajar</span>
                <span>{{ selectedBook.progress }}%</span>
              </div>

              <div class="h-3 overflow-hidden rounded-full bg-white/70 dark:bg-neutral-900">
                <div
                  class="h-full rounded-full bg-green-500 transition-all duration-500"
                  :style="{ width: selectedBook.progress + '%' }"
                ></div>
              </div>
            </div>

            <div class="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">Jenis</div>
                <div class="mt-1 font-black capitalize text-slate-900 dark:text-white">{{ selectedBook.type }}</div>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">Kategori</div>
                <div class="mt-1 font-black text-slate-900 dark:text-white">{{ selectedBook.category }}</div>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">Status</div>
                <div class="mt-1 font-black capitalize text-slate-900 dark:text-white">{{ selectedBook.status }}</div>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">Guru</div>
                <div class="mt-1 font-black text-slate-900 dark:text-white">{{ selectedBook.teacher || '—' }}</div>
              </div>
            </div>

            <div class="grid gap-3 md:grid-cols-2">
              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Materi Saat Ini
                </div>

                <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                  {{ selectedBook.currentChapter || 'Belum ada materi saat ini.' }}
                </p>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Target Berikutnya
                </div>

                <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                  {{ selectedBook.targetChapter || 'Belum ada target berikutnya.' }}
                </p>
              </div>
            </div>

            <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
              <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                Catatan Pembimbing
              </div>

              <p class="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-neutral-300">
                {{ selectedBook.note || selectedBook.description || 'Belum ada catatan pembimbing.' }}
              </p>
            </div>

            <a
              v-if="selectedBook.attachmentUrl"
              :href="selectedBook.attachmentUrl"
              target="_blank"
              class="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
            >
              <Icon icon="lucide:external-link" class="h-4 w-4" />
              Buka Materi / Lampiran
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
type BookType = 'kitab' | 'buku' | 'modul' | 'materi'
type BookStatus = 'dipelajari' | 'selesai' | 'belum mulai' | 'tertunda'

type SantriProfile = AnyRow & {
  id: string
  _uid: string
  _path?: string
}

type BookItem = {
  id: string
  title: string
  type: BookType
  category: string
  status: BookStatus
  teacher: string
  progress: number
  currentChapter: string
  targetChapter: string
  description: string
  note: string
  attachmentUrl: string
  updatedAt: number
  raw: AnyRow
}

type FocusItem = {
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
const bookRawRows = ref<AnyRow[]>([])

const activeTab = ref<'semua' | 'kitab' | 'buku' | 'dipelajari' | 'selesai'>('semua')

const filters = ref({
  q: '',
  type: 'semua',
  category: 'semua',
  status: 'semua',
  sort: 'progress-tertinggi'
})

const currentPage = ref(1)
const pageSize = ref(6)

const detailOpen = ref(false)
const selectedBook = ref<BookItem | null>(null)

let unsubscribers: Array<() => void> = []
let stopSessionWatch: (() => void) | null = null
const bucketMap = new Map<string, AnyRow[]>()

const currentSantri = computed(() => {
  return santriProfiles.value.find((item) => item.id === selectedSantriId.value) || santriProfiles.value[0] || null
})

const bookRows = computed(() => {
  return filterRowsForCurrentSantri(bookRawRows.value)
})

const bookItems = computed<BookItem[]>(() => {
  return bookRows.value.map((row, index) => normalizeBook(row, index))
})

const studyingItems = computed(() => {
  return bookItems.value.filter((item) => item.status === 'dipelajari')
})

const completedItems = computed(() => {
  return bookItems.value.filter((item) => item.status === 'selesai')
})

const averageProgress = computed(() => {
  if (!bookItems.value.length) return 0

  const total = bookItems.value.reduce((sum, item) => sum + item.progress, 0)
  return Math.round(total / bookItems.value.length)
})

const learningScore = computed(() => {
  if (!bookItems.value.length) return 70

  let score = averageProgress.value

  score += Math.min(10, completedItems.value.length * 3)
  score -= Math.min(12, delayedItems.value.length * 4)

  return Math.max(10, Math.min(100, Math.round(score)))
})

const delayedItems = computed(() => {
  return bookItems.value.filter((item) => item.status === 'tertunda' || (item.status === 'dipelajari' && item.progress < 35))
})

const learningInsight = computed(() => {
  if (!bookItems.value.length) {
    return {
      title: 'Belum ada data kitab atau buku',
      desc: 'Data kitab dan buku akan tampil setelah admin, guru, atau pengurus menambahkan materi pembelajaran santri.'
    }
  }

  if (learningScore.value >= 85) {
    return {
      title: 'Progress belajar santri sangat baik',
      desc: `Rata-rata progress berada di ${averageProgress.value}%. Santri menunjukkan perkembangan pembelajaran yang kuat pada kitab dan buku yang tercatat.`
    }
  }

  if (learningScore.value >= 65) {
    return {
      title: 'Progress belajar cukup stabil',
      desc: `Rata-rata progress ${averageProgress.value}%. Beberapa materi masih perlu dipantau agar target belajar tetap tercapai.`
    }
  }

  return {
    title: 'Progress belajar perlu pendampingan',
    desc: `Rata-rata progress masih ${averageProgress.value}%. Wali disarankan mengecek materi yang tertunda dan berkomunikasi dengan pembimbing.`
  }
})

const focusItems = computed<FocusItem[]>(() => {
  const items: FocusItem[] = []

  if (!bookItems.value.length) {
    return [
      {
        title: 'Belum ada materi tercatat',
        desc: 'Tunggu data kitab/buku ditambahkan oleh admin atau guru.',
        icon: 'ph:books-duotone',
        priority: 'Sedang',
        cardClass: 'border-slate-100 bg-slate-50 dark:border-neutral-800 dark:bg-neutral-800/60',
        iconClass: 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
      }
    ]
  }

  if (delayedItems.value.length) {
    items.push({
      title: 'Perhatikan materi dengan progress rendah',
      desc: `${delayedItems.value.length} kitab/buku memiliki progress rendah atau tertunda. Prioritaskan pendampingan pada materi tersebut.`,
      icon: 'ph:warning-circle-duotone',
      priority: 'Tinggi',
      cardClass: 'border-amber-100 bg-amber-50/70 dark:border-amber-900/30 dark:bg-amber-900/10',
      iconClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
    })
  }

  if (studyingItems.value.length) {
    items.push({
      title: 'Pantau materi aktif',
      desc: `${studyingItems.value.length} kitab/buku sedang dipelajari. Cek target bab/halaman agar wali tahu perkembangan terbaru.`,
      icon: 'ph:book-open-text-duotone',
      priority: 'Sedang',
      cardClass: 'border-blue-100 bg-blue-50/70 dark:border-blue-900/30 dark:bg-blue-900/10',
      iconClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
    })
  }

  if (completedItems.value.length) {
    items.push({
      title: 'Apresiasi materi yang selesai',
      desc: `${completedItems.value.length} kitab/buku sudah selesai. Berikan apresiasi agar motivasi belajar santri tetap tinggi.`,
      icon: 'ph:check-circle-duotone',
      priority: 'Rendah',
      cardClass: 'border-green-100 bg-green-50/70 dark:border-green-900/30 dark:bg-green-900/10',
      iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })
  }

  if (!items.length) {
    items.push({
      title: 'Jaga konsistensi belajar',
      desc: 'Progress terlihat aman. Tetap pantau catatan pembimbing dan target materi berikutnya.',
      icon: 'ph:sparkle-duotone',
      priority: 'Rendah',
      cardClass: 'border-green-100 bg-green-50/70 dark:border-green-900/30 dark:bg-green-900/10',
      iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })
  }

  return items.slice(0, 4)
})

const categoryOptions = computed(() => {
  return Array.from(new Set(bookItems.value.map((item) => item.category).filter(Boolean))).sort()
})

const categoryProgress = computed(() => {
  const map = new Map<string, { category: string; count: number; total: number }>()

  for (const item of bookItems.value) {
    const key = item.category || 'Lainnya'
    const current = map.get(key) || { category: key, count: 0, total: 0 }

    current.count += 1
    current.total += item.progress

    map.set(key, current)
  }

  return Array.from(map.values())
    .map((item) => ({
      category: item.category,
      avg: Math.round(item.total / item.count)
    }))
    .sort((a, b) => b.avg - a.avg)
})

const filteredRows = computed(() => {
  return bookItems.value.filter((item) => {
    if (filters.value.type !== 'semua' && item.type !== filters.value.type) return false
    if (filters.value.category !== 'semua' && item.category !== filters.value.category) return false
    if (filters.value.status !== 'semua' && item.status !== filters.value.status) return false

    if (filters.value.q.trim()) {
      const q = normalizeText(filters.value.q)
      const text = normalizeText([
        item.title,
        item.type,
        item.category,
        item.status,
        item.teacher,
        item.currentChapter,
        item.targetChapter,
        item.description,
        item.note
      ].join(' '))

      if (!text.includes(q)) return false
    }

    return true
  })
})

const visibleRows = computed(() => {
  let rows = [...filteredRows.value]

  if (activeTab.value === 'kitab') rows = rows.filter((item) => item.type === 'kitab')
  if (activeTab.value === 'buku') rows = rows.filter((item) => item.type === 'buku')
  if (activeTab.value === 'dipelajari') rows = rows.filter((item) => item.status === 'dipelajari')
  if (activeTab.value === 'selesai') rows = rows.filter((item) => item.status === 'selesai')

  if (filters.value.sort === 'terbaru') {
    rows.sort((a, b) => b.updatedAt - a.updatedAt)
  } else if (filters.value.sort === 'judul') {
    rows.sort((a, b) => a.title.localeCompare(b.title, 'id-ID'))
  } else if (filters.value.sort === 'status') {
    rows.sort((a, b) => a.status.localeCompare(b.status, 'id-ID'))
  } else {
    rows.sort((a, b) => b.progress - a.progress || a.title.localeCompare(b.title, 'id-ID'))
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

const tabs = computed(() => [
  {
    key: 'semua' as const,
    label: 'Semua',
    count: filteredRows.value.length
  },
  {
    key: 'kitab' as const,
    label: 'Kitab',
    count: filteredRows.value.filter((item) => item.type === 'kitab').length
  },
  {
    key: 'buku' as const,
    label: 'Buku',
    count: filteredRows.value.filter((item) => item.type === 'buku').length
  },
  {
    key: 'dipelajari' as const,
    label: 'Dipelajari',
    count: filteredRows.value.filter((item) => item.status === 'dipelajari').length
  },
  {
    key: 'selesai' as const,
    label: 'Selesai',
    count: filteredRows.value.filter((item) => item.status === 'selesai').length
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

function normalizeBook(row: AnyRow, index: number): BookItem {
  const progress = extractProgress(row)
  const status = extractStatus(row, progress)
  const type = extractType(row)

  return {
    id: String(row.id || row._uid || row.key || index),
    title: String(row.title || row.judul || row.namaKitab || row.kitab || row.namaBuku || row.buku || row.name || row.nama || 'Kitab/Buku'),
    type,
    category: String(row.category || row.kategori || row.mapel || row.subject || row.mataPelajaran || row.jenisPembelajaran || 'Umum'),
    status,
    teacher: String(row.teacher || row.guru || row.ustadz || row.pembimbing || ''),
    progress,
    currentChapter: String(row.currentChapter || row.babSaatIni || row.materiSaatIni || row.halamanSaatIni || row.currentPage || row.progressText || ''),
    targetChapter: String(row.targetChapter || row.targetBab || row.targetMateri || row.targetHalaman || row.targetPage || ''),
    description: String(row.description || row.deskripsi || row.keterangan || ''),
    note: String(row.note || row.catatan || row.evaluasi || row.catatanGuru || ''),
    attachmentUrl: String(row.attachmentUrl || row.fileUrl || row.link || row.url || row.lampiran || ''),
    updatedAt: extractDate(row),
    raw: row
  }
}

function extractType(row: AnyRow): BookType {
  const text = normalizeText([
    row.type,
    row.jenis,
    row.category,
    row.kategori,
    row.title,
    row.judul,
    row._path
  ].join(' '))

  if (text.includes('kitab')) return 'kitab'
  if (text.includes('modul')) return 'modul'
  if (text.includes('materi')) return 'materi'

  return 'buku'
}

function extractProgress(row: AnyRow) {
  const value = row.progress ?? row.progressPercent ?? row.persentase ?? row.percent ?? row.percentage

  if (value !== undefined && value !== null && value !== '') {
    const parsed = Number(String(value).replace(/[^\d.-]/g, ''))
    if (Number.isFinite(parsed)) return Math.max(0, Math.min(100, Math.round(parsed)))
  }

  const current = Number(row.currentPage || row.halamanSaatIni || row.page || row.sampaiHalaman || 0)
  const total = Number(row.totalPage || row.totalPages || row.jumlahHalaman || row.targetPage || 0)

  if (Number.isFinite(current) && Number.isFinite(total) && total > 0) {
    return Math.max(0, Math.min(100, Math.round((current / total) * 100)))
  }

  return 0
}

function extractStatus(row: AnyRow, progress: number): BookStatus {
  const text = normalizeText(row.status || row.state || row.progressStatus || row.kondisi)

  if (text.includes('selesai') || text.includes('tuntas') || text.includes('complete')) return 'selesai'
  if (text.includes('tertunda') || text.includes('pause') || text.includes('pending')) return 'tertunda'
  if (text.includes('belum')) return 'belum mulai'
  if (text.includes('dipelajari') || text.includes('aktif') || text.includes('berjalan')) return 'dipelajari'

  if (progress >= 100) return 'selesai'
  if (progress > 0) return 'dipelajari'

  return 'belum mulai'
}

function extractDate(row: AnyRow) {
  const candidates = [
    row.updatedAt,
    row.createdAt,
    row.date,
    row.tanggal,
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

function resetFilters() {
  filters.value = {
    q: '',
    type: 'semua',
    category: 'semua',
    status: 'semua',
    sort: 'progress-tertinggi'
  }

  activeTab.value = 'semua'
  currentPage.value = 1
}

function openDetail(row: BookItem) {
  selectedBook.value = row
  detailOpen.value = true
}

function closeDetail() {
  selectedBook.value = null
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

  subscribeDeep(`${clientName}/book`)
  subscribeDeep(`${clientName}/books`)
  subscribeDeep(`${clientName}/buku`)
  subscribeDeep(`${clientName}/kitab`)
  subscribeDeep(`${clientName}/materi`)
  subscribeDeep(`${clientName}/materiPembelajaran`)
  subscribeDeep(`${clientName}/studentBooks`)
  subscribeDeep(`${clientName}/pembelajaran`)
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

  bookRawRows.value = rows
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

  if (looksLikeBookRecord(objectValue)) {
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

function looksLikeBookRecord(row: AnyRow) {
  const keys = Object.keys(row)

  return keys.some((key) => [
    'santriId',
    'idSantri',
    'santri_id',
    'studentId',
    'namaSantri',
    'santriName',
    'santri',
    'title',
    'judul',
    'name',
    'nama',
    'kitab',
    'namaKitab',
    'buku',
    'namaBuku',
    'mapel',
    'subject',
    'mataPelajaran',
    'guru',
    'ustadz',
    'teacher',
    'pembimbing',
    'progress',
    'persentase',
    'progressPercent',
    'currentChapter',
    'babSaatIni',
    'targetChapter',
    'targetBab',
    'halamanSaatIni',
    'targetHalaman',
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

function typeIcon(type: BookType) {
  if (type === 'kitab') return 'ooui:italic-arab-keheh-jeem'
  if (type === 'modul') return 'ph:files-duotone'
  if (type === 'materi') return 'ph:note-pencil-duotone'
  return 'ph:book-duotone'
}

function typeIconClass(type: BookType) {
  if (type === 'kitab') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (type === 'modul') return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
  if (type === 'materi') return 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
  return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
}

function typeBadgeClass(type: BookType) {
  return typeIconClass(type)
}

function statusBadgeClass(status: BookStatus) {
  if (status === 'selesai') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (status === 'dipelajari') return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
  if (status === 'tertunda') return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  return 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
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
    'Judul',
    'Jenis',
    'Kategori',
    'Status',
    'Guru',
    'Progress',
    'Materi Saat Ini',
    'Target',
    'Catatan'
  ]

  const lines = visibleRows.value.map((row) => [
    santriNameOf(currentSantri.value),
    row.title,
    row.type,
    row.category,
    row.status,
    row.teacher,
    `${row.progress}%`,
    row.currentChapter,
    row.targetChapter,
    row.note || row.description
  ].map(toCsvCell).join(','))

  const csv = '\uFEFF' + [headers.join(','), ...lines].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })

  saveBlob(blob, 'kitab_buku_wali.csv')
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