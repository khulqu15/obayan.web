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
            Academic Grade Center
          </div>

          <h1 class="mt-4 text-2xl font-black tracking-tight md:text-4xl">
            Nilai Mata Pelajaran
          </h1>

          <p class="mt-2 max-w-2xl text-sm leading-6 text-green-50/90 md:text-base">
            Input, edit, import, export, dan monitoring nilai santri berdasarkan mapel, tahun ajaran, semester, bobot, serta predikat.
          </p>
        </div>

        <div class="grid gap-2 rounded-[28px] bg-white/13 p-4 ring-1 ring-white/15 backdrop-blur sm:grid-cols-3 xl:w-[430px]">
          <div class="rounded-2xl bg-white/12 p-3 text-center">
            <div class="text-lg font-black">{{ totalFiltered }}</div>
            <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Santri</div>
          </div>

          <div class="rounded-2xl bg-white/12 p-3 text-center">
            <div class="text-lg font-black">{{ stats.avg }}</div>
            <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Rata-rata</div>
          </div>

          <div class="rounded-2xl bg-white/12 p-3 text-center">
            <div class="text-lg font-black">{{ stats.passed }}</div>
            <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Tuntas</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="rounded-[32px] border border-white/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr,0.65fr,0.65fr,0.65fr,0.8fr,0.55fr,0.55fr]">
        <div class="relative">
          <input
            v-model="q"
            type="search"
            placeholder="Cari santri, maskan, kamar..."
            class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:ring-green-500/10"
          />
          <Icon icon="lucide:search" class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>

        <select
          v-model="selectedJenjang"
          class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        >
          <option value="all">Semua Jenjang</option>
          <option>SD</option>
          <option>SMP</option>
          <option>SMA</option>
          <option>SMK</option>
        </select>

        <select
          v-model="selectedMaskan"
          class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        >
          <option value="all">Semua Maskan</option>
          <option v-for="m in maskanOptions" :key="m" :value="m">{{ m }}</option>
        </select>

        <select
          v-model="predikatFilter"
          class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        >
          <option value="all">Semua Predikat</option>
          <option>A</option>
          <option>B</option>
          <option>C</option>
          <option>D</option>
          <option>E</option>
        </select>

        <select
          v-model="selectedMapelId"
          class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        >
          <option disabled value="">Pilih Mapel</option>
          <option v-for="m in subjectOptions" :key="m.id" :value="m.id">
            {{ m.name }} {{ m.jenjang ? `(${m.jenjang})` : '' }}
          </option>
        </select>

        <input
          v-model.number="tahunAwal"
          type="number"
          class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        />

        <select
          v-model="semester"
          class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        >
          <option>Ganjil</option>
          <option>Genap</option>
        </select>
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          @click="openSubjects"
          class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          <Icon icon="ph:book-open-text-duotone" class="h-5 w-5" />
          Kelola Mapel
        </button>

        <button
          type="button"
          :disabled="!selectedMapelId"
          @click="openWeights"
          class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          <Icon icon="ph:scales-duotone" class="h-5 w-5" />
          Bobot
        </button>

        <button
          type="button"
          :disabled="!selectedMapelId || !pageRows.length"
          @click="savePage"
          class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon icon="ph:floppy-disk-duotone" class="h-5 w-5" />
          Simpan Halaman
        </button>

        <button
          type="button"
          :disabled="!selectedMapelId || !filteredSantri.length"
          @click="saveFiltered"
          class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950"
        >
          <Icon icon="ph:database-duotone" class="h-5 w-5" />
          Simpan Terfilter
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
          :disabled="!selectedMapelId"
          @click="triggerImport"
          class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          <Icon icon="ph:upload-simple-duotone" class="h-5 w-5" />
          Import CSV
        </button>

        <button
          v-if="selectedCount"
          type="button"
          :disabled="!selectedMapelId"
          @click="openBulkEdit"
          class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon icon="ph:selection-plus-duotone" class="h-5 w-5" />
          Edit {{ selectedCount }} Terpilih
        </button>

        <button
          v-if="selectedCount"
          type="button"
          :disabled="!selectedMapelId"
          @click="openDeleteModal"
          class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 text-sm font-black text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon icon="ph:trash-duotone" class="h-5 w-5" />
          Hapus Terpilih
        </button>

        <input ref="importInput" type="file" accept=".csv,.txt" class="hidden" @change="importCSV" />
      </div>
    </div>

    <!-- Info -->
    <div class="grid gap-4 xl:grid-cols-[0.8fr,1.2fr]">
      <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-black text-slate-900 dark:text-white">
              Info Mapel & Term
            </h2>
            <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
              Data nilai disimpan pada path client.
            </p>
          </div>

          <span class="rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
            {{ clientName }}
          </span>
        </div>

        <div class="space-y-3">
          <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
            <div class="text-xs font-bold text-slate-500 dark:text-neutral-400">Path Simpan Nilai</div>
            <div class="mt-1 break-all font-mono text-xs font-black text-slate-900 dark:text-white">
              {{ selectedMapelId ? nilaiPathPreview : `${clientName}/nilai/{term}/{mapelId}` }}
            </div>
          </div>

          <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
            <div class="text-xs font-bold text-slate-500 dark:text-neutral-400">Tahun Ajaran / Semester</div>
            <div class="mt-1 font-black text-slate-900 dark:text-white">{{ termKey }}</div>
          </div>

          <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
            <div class="text-xs font-bold text-slate-500 dark:text-neutral-400">Mapel</div>
            <div class="mt-1 font-black text-slate-900 dark:text-white">
              {{ currentMapelName || 'Pilih mapel terlebih dahulu' }}
            </div>
            <div class="mt-1 text-xs font-bold text-slate-500">
              KKM: {{ currentSubject?.kkm ?? '—' }}
            </div>
          </div>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Rata-rata</div>
          <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">{{ stats.avg }}</div>
          <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800">
            <div class="h-full rounded-full bg-green-500" :style="{ width: stats.avg + '%' }"></div>
          </div>
        </div>

        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Tuntas</div>
          <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">{{ stats.passed }}</div>
          <p class="mt-2 text-xs font-bold text-slate-500">Dari {{ stats.count }} santri</p>
        </div>

        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Tertinggi</div>
          <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">{{ stats.max }}</div>
          <p class="mt-2 line-clamp-1 text-xs font-bold text-slate-500">{{ stats.maxName || '—' }}</p>
        </div>

        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Terendah</div>
          <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">{{ stats.min }}</div>
          <p class="mt-2 line-clamp-1 text-xs font-bold text-slate-500">{{ stats.minName || '—' }}</p>
        </div>
      </div>
    </div>

    <!-- Predikat Distribution -->
    <div class="grid gap-3 md:grid-cols-5">
      <div
        v-for="g in predikats"
        :key="g"
        class="rounded-[24px] border border-white/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div class="flex items-center justify-between gap-3">
          <div>
            <div class="text-xs font-black text-slate-400">Predikat {{ g }}</div>
            <div class="mt-1 text-2xl font-black text-slate-900 dark:text-white">{{ stats.dist[g] }}</div>
          </div>

          <span :class="['grid h-10 w-10 place-items-center rounded-2xl text-sm font-black', predikatBadgeClass(g)]">
            {{ g }}
          </span>
        </div>
      </div>
    </div>

    <!-- Desktop Table -->
    <div class="hidden overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:block">
      <div class="flex flex-col gap-3 border-b border-slate-100 p-5 dark:border-neutral-800 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 class="text-base font-black text-slate-900 dark:text-white">
            Daftar Nilai Santri
          </h2>
          <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
            Menampilkan {{ pageRows.length }} dari {{ totalFiltered }} santri.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <select
            v-model.number="pageSize"
            class="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
          >
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

      <div v-if="selectedCount" class="border-b border-green-100 bg-green-50 px-5 py-3 text-sm font-bold text-green-700 dark:border-green-900/30 dark:bg-green-900/10 dark:text-green-300">
        {{ selectedCount }} baris dipilih. Gunakan tombol “Edit Terpilih” atau “Hapus Terpilih”.
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[1120px] text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-400 dark:bg-neutral-950/40">
            <tr>
              <th class="px-5 py-4">
                <input type="checkbox" :checked="isAllPageSelected" @change="toggleSelectAllPage" />
              </th>
              <th class="px-5 py-4 font-black">Santri</th>
              <th class="px-5 py-4 font-black">Maskan/Kamar</th>
              <th class="px-3 py-4 text-center font-black">Tugas</th>
              <th class="px-3 py-4 text-center font-black">Harian</th>
              <th class="px-3 py-4 text-center font-black">PTS</th>
              <th class="px-3 py-4 text-center font-black">PAS</th>
              <th class="px-3 py-4 text-center font-black">Akhir</th>
              <th class="px-3 py-4 text-center font-black">Pred</th>
              <th class="px-5 py-4 font-black">Catatan</th>
              <th class="px-5 py-4 text-right font-black">Aksi</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100 dark:divide-neutral-800">
            <tr v-if="!selectedMapelId">
              <td colspan="11" class="px-5 py-12 text-center text-slate-500">
                Pilih mapel terlebih dahulu.
              </td>
            </tr>

            <tr v-else-if="!pageRows.length">
              <td colspan="11" class="px-5 py-12 text-center text-slate-500">
                Tidak ada data santri pada filter ini.
              </td>
            </tr>

            <tr
              v-for="s in pageRows"
              :key="s.id"
              class="transition hover:bg-slate-50 dark:hover:bg-neutral-800/50"
            >
              <td class="px-5 py-4">
                <input type="checkbox" :checked="isSelected(s.id)" @change="toggleSelect(s.id)" />
              </td>

              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <button
                    type="button"
                    @click="toggleRow(s.id)"
                    class="grid h-9 w-9 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
                  >
                    <Icon :icon="rowExpandedId === s.id ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="h-4 w-4" />
                  </button>

                  <div class="min-w-0">
                    <div class="truncate font-black text-slate-900 dark:text-white">{{ s.santri || '-' }}</div>
                    <div class="mt-0.5 text-xs font-bold text-slate-500">Jenjang: {{ s.jenjang || s.kelasFormal || '-' }}</div>
                  </div>
                </div>
              </td>

              <td class="px-5 py-4 text-xs font-bold text-slate-500">
                {{ s.maskan || '-' }} · {{ s.kamar || '-' }}
              </td>

              <td class="px-2 py-4">
                <ScoreInput v-model="draft[s.id].tugas" />
              </td>

              <td class="px-2 py-4">
                <ScoreInput v-model="draft[s.id].harian" />
              </td>

              <td class="px-2 py-4">
                <ScoreInput v-model="draft[s.id].pts" />
              </td>

              <td class="px-2 py-4">
                <ScoreInput v-model="draft[s.id].pas" />
              </td>

              <td class="px-3 py-4 text-center">
                <span :class="['inline-flex min-w-12 justify-center rounded-2xl px-3 py-1.5 text-sm font-black', scoreBadgeClass(previewAkhir(s.id))]">
                  {{ previewAkhir(s.id) }}
                </span>
              </td>

              <td class="px-3 py-4 text-center">
                <span :class="['inline-flex min-w-10 justify-center rounded-2xl px-3 py-1.5 text-xs font-black', predikatBadgeClass(previewPredikat(s.id))]">
                  {{ previewPredikat(s.id) }}
                </span>
              </td>

              <td class="px-5 py-4">
                <input
                  v-model.trim="draft[s.id].catatan"
                  type="text"
                  placeholder="Catatan"
                  class="h-10 w-60 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </td>

              <td class="px-5 py-4 text-right">
                <button
                  type="button"
                  :disabled="!selectedMapelId || isSaving(s.id)"
                  @click="saveOne(s.id)"
                  class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-xs font-black text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon v-if="isSaving(s.id)" icon="ph:spinner-gap-duotone" class="h-4 w-4 animate-spin" />
                  <Icon v-else icon="ph:floppy-disk-duotone" class="h-4 w-4" />
                  Simpan
                </button>
              </td>
            </tr>

            <tr
              v-for="s in expandedRows"
              :key="`detail-${s.id}`"
              v-show="rowExpandedId === s.id"
              class="bg-slate-50 dark:bg-neutral-950/40"
            >
              <td></td>
              <td colspan="10" class="px-5 py-4">
                <div class="grid gap-3 md:grid-cols-4">
                  <div class="rounded-[24px] border border-slate-100 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                    <div class="text-xs font-black text-slate-400">Komponen</div>
                    <div class="mt-2 text-sm leading-7 text-slate-600 dark:text-neutral-300">
                      Tugas: <b>{{ draft[s.id].tugas ?? 0 }}</b><br />
                      Harian: <b>{{ draft[s.id].harian ?? 0 }}</b><br />
                      PTS: <b>{{ draft[s.id].pts ?? 0 }}</b><br />
                      PAS: <b>{{ draft[s.id].pas ?? 0 }}</b>
                    </div>
                  </div>

                  <div class="rounded-[24px] border border-slate-100 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                    <div class="text-xs font-black text-slate-400">Hasil</div>
                    <div class="mt-2 text-sm leading-7 text-slate-600 dark:text-neutral-300">
                      Nilai akhir: <b>{{ previewAkhir(s.id) }}</b><br />
                      Predikat: <b>{{ previewPredikat(s.id) }}</b><br />
                      KKM: <b>{{ currentSubject?.kkm ?? '-' }}</b>
                    </div>
                  </div>

                  <div class="rounded-[24px] border border-slate-100 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 md:col-span-2">
                    <div class="text-xs font-black text-slate-400">Catatan</div>
                    <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                      {{ draft[s.id].catatan || 'Belum ada catatan.' }}
                    </p>
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
      <div
        v-for="s in pageRows"
        :key="s.id"
        class="rounded-[28px] border border-white/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-3">
            <input class="mt-1" type="checkbox" :checked="isSelected(s.id)" @change="toggleSelect(s.id)" />

            <div>
              <div class="font-black text-slate-900 dark:text-white">{{ s.santri || '-' }}</div>
              <div class="mt-0.5 text-xs font-bold text-slate-500">{{ s.maskan || '-' }} • {{ s.kamar || '-' }}</div>
            </div>
          </div>

          <div class="text-right">
            <span :class="['inline-flex rounded-2xl px-3 py-1.5 text-sm font-black', scoreBadgeClass(previewAkhir(s.id))]">
              {{ previewAkhir(s.id) }}
            </span>
            <div class="mt-1 text-xs font-black text-slate-500">{{ previewPredikat(s.id) }}</div>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label class="mb-1 block text-xs font-black text-slate-500">Tugas</label>
            <ScoreInput v-model="draft[s.id].tugas" fluid />
          </div>

          <div>
            <label class="mb-1 block text-xs font-black text-slate-500">Harian</label>
            <ScoreInput v-model="draft[s.id].harian" fluid />
          </div>

          <div>
            <label class="mb-1 block text-xs font-black text-slate-500">PTS</label>
            <ScoreInput v-model="draft[s.id].pts" fluid />
          </div>

          <div>
            <label class="mb-1 block text-xs font-black text-slate-500">PAS</label>
            <ScoreInput v-model="draft[s.id].pas" fluid />
          </div>
        </div>

        <input
          v-model.trim="draft[s.id].catatan"
          type="text"
          placeholder="Catatan"
          class="mt-3 h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        />

        <button
          type="button"
          :disabled="!selectedMapelId || isSaving(s.id)"
          @click="saveOne(s.id)"
          class="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-black text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon v-if="isSaving(s.id)" icon="ph:spinner-gap-duotone" class="h-5 w-5 animate-spin" />
          <Icon v-else icon="ph:floppy-disk-duotone" class="h-5 w-5" />
          Simpan Nilai
        </button>
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

    <!-- Subject Modal -->
    <Teleport to="body">
      <div v-if="showSubjects" class="fixed inset-0 z-[9999] overflow-y-auto p-4">
        <button class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showSubjects = false"></button>

        <div class="relative z-10 flex min-h-full items-center justify-center">
          <div class="w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3 border-b border-slate-100 p-5 dark:border-neutral-800">
              <div>
                <h3 class="text-xl font-black text-slate-900 dark:text-white">Kelola Mata Pelajaran</h3>
                <p class="mt-1 text-sm text-slate-500 dark:text-neutral-400">Tambah, edit, atau hapus data mapel.</p>
              </div>

              <button class="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 dark:bg-neutral-800" @click="showSubjects = false">
                <Icon icon="lucide:x" class="h-4 w-4" />
              </button>
            </div>

            <div class="space-y-4 p-5">
              <div class="grid gap-3 md:grid-cols-[1fr,0.4fr,auto]">
                <input
                  v-model="subjectSearch"
                  type="search"
                  placeholder="Cari mapel..."
                  class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />

                <select
                  v-model="subjectJenjangFilter"
                  class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                >
                  <option value="all">Semua</option>
                  <option>SD</option>
                  <option>SMP</option>
                  <option>SMA</option>
                  <option>SMK</option>
                </select>

                <button
                  type="button"
                  @click="openSubjectForm()"
                  class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-black text-white"
                >
                  <Icon icon="ph:plus-bold" class="h-4 w-4" />
                  Tambah
                </button>
              </div>

              <div class="overflow-x-auto rounded-[24px] border border-slate-100 dark:border-neutral-800">
                <table class="w-full min-w-[640px] text-sm">
                  <thead class="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-400 dark:bg-neutral-950/40">
                    <tr>
                      <th class="px-4 py-3 text-left font-black">Mapel</th>
                      <th class="px-4 py-3 text-center font-black">Kode</th>
                      <th class="px-4 py-3 text-center font-black">Jenjang</th>
                      <th class="px-4 py-3 text-center font-black">KKM</th>
                      <th class="px-4 py-3 text-right font-black">Aksi</th>
                    </tr>
                  </thead>

                  <tbody class="divide-y divide-slate-100 dark:divide-neutral-800">
                    <tr v-for="m in subjectModalRows" :key="m.id">
                      <td class="px-4 py-3 font-black text-slate-900 dark:text-white">{{ m.name }}</td>
                      <td class="px-4 py-3 text-center text-slate-500">{{ m.code || '-' }}</td>
                      <td class="px-4 py-3 text-center text-slate-500">{{ m.jenjang || '-' }}</td>
                      <td class="px-4 py-3 text-center text-slate-500">{{ m.kkm ?? '-' }}</td>
                      <td class="px-4 py-3 text-right">
                        <button class="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black dark:border-neutral-700" @click="openSubjectForm(m)">Edit</button>
                        <button class="ml-2 rounded-xl border border-rose-200 px-3 py-2 text-xs font-black text-rose-600 dark:border-rose-900/30" @click="removeSubject(m.id)">Hapus</button>
                      </td>
                    </tr>

                    <tr v-if="!subjectModalRows.length">
                      <td colspan="5" class="px-4 py-8 text-center text-slate-500">Tidak ada mapel.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Subject Form Modal -->
    <Teleport to="body">
      <div v-if="showSubjectForm" class="fixed inset-0 z-[10000] overflow-y-auto p-4">
        <button class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="closeSubjectForm"></button>

        <div class="relative z-10 flex min-h-full items-center justify-center">
          <form class="w-full max-w-md overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900" @submit.prevent="submitSubjectForm">
            <div class="flex items-start justify-between gap-3 border-b border-slate-100 p-5 dark:border-neutral-800">
              <div>
                <h3 class="text-xl font-black text-slate-900 dark:text-white">
                  {{ subjectFormMode === 'create' ? 'Tambah Mapel' : 'Edit Mapel' }}
                </h3>
                <p class="mt-1 text-sm text-slate-500 dark:text-neutral-400">Data mapel akademik.</p>
              </div>

              <button type="button" class="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 dark:bg-neutral-800" @click="closeSubjectForm">
                <Icon icon="lucide:x" class="h-4 w-4" />
              </button>
            </div>

            <div class="grid gap-3 p-5">
              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Nama Mapel</label>
                <input v-model.trim="subjectForm.name" required class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Kode</label>
                  <input v-model.trim="subjectForm.code" class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">Jenjang</label>
                  <select v-model="subjectForm.jenjang" class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                    <option value="">-</option>
                    <option>SD</option>
                    <option>SMP</option>
                    <option>SMA</option>
                    <option>SMK</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">KKM</label>
                <input v-model.number="subjectForm.kkm" type="number" min="0" max="100" class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
              </div>
            </div>

            <div class="flex justify-end border-t border-slate-100 p-5 dark:border-neutral-800">
              <button type="submit" class="rounded-2xl bg-green-600 px-5 py-2.5 text-sm font-black text-white">
                {{ subjectFormMode === 'create' ? 'Simpan' : 'Update' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Weight Modal -->
    <Teleport to="body">
      <div v-if="showWeights" class="fixed inset-0 z-[9999] overflow-y-auto p-4">
        <button class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showWeights = false"></button>

        <div class="relative z-10 flex min-h-full items-center justify-center">
          <form class="w-full max-w-lg overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900" @submit.prevent="saveWeightForm">
            <div class="flex items-start justify-between gap-3 border-b border-slate-100 p-5 dark:border-neutral-800">
              <div>
                <h3 class="text-xl font-black text-slate-900 dark:text-white">Bobot Komponen</h3>
                <p class="mt-1 text-sm text-slate-500 dark:text-neutral-400">{{ currentMapelName }} • {{ termKey }}</p>
              </div>

              <button type="button" class="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 dark:bg-neutral-800" @click="showWeights = false">
                <Icon icon="lucide:x" class="h-4 w-4" />
              </button>
            </div>

            <div class="grid grid-cols-2 gap-3 p-5">
              <div v-for="field in weightFields" :key="field.key">
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">{{ field.label }}</label>
                <input v-model.number="weightForm[field.key]" type="number" min="0" max="100" class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
              </div>
            </div>

            <div class="flex justify-end border-t border-slate-100 p-5 dark:border-neutral-800">
              <button type="submit" class="rounded-2xl bg-green-600 px-5 py-2.5 text-sm font-black text-white">
                Simpan Bobot
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Bulk Edit Modal -->
    <Teleport to="body">
      <div v-if="showBulkEdit" class="fixed inset-0 z-[9999] overflow-y-auto p-4">
        <button class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showBulkEdit = false"></button>

        <div class="relative z-10 flex min-h-full items-center justify-center">
          <form class="w-full max-w-lg overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900" @submit.prevent="applyBulkEdit(true)">
            <div class="flex items-start justify-between gap-3 border-b border-slate-100 p-5 dark:border-neutral-800">
              <div>
                <h3 class="text-xl font-black text-slate-900 dark:text-white">Edit Massal</h3>
                <p class="mt-1 text-sm text-slate-500 dark:text-neutral-400">{{ selectedCount }} santri terpilih.</p>
              </div>

              <button type="button" class="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 dark:bg-neutral-800" @click="showBulkEdit = false">
                <Icon icon="lucide:x" class="h-4 w-4" />
              </button>
            </div>

            <div class="grid grid-cols-2 gap-3 p-5">
              <div v-for="field in bulkFields" :key="field.key">
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">{{ field.label }}</label>
                <input v-model="bulkForm[field.key]" :type="field.type" min="0" max="100" class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
              </div>

              <label class="col-span-2 flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-neutral-300">
                <input v-model="bulkOverwrite" type="checkbox" />
                Timpa nilai yang sudah terisi
              </label>
            </div>

            <div class="flex justify-between gap-2 border-t border-slate-100 p-5 dark:border-neutral-800">
              <button type="button" class="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-black dark:border-neutral-700" @click="applyBulkEdit(false)">
                Terapkan
              </button>

              <button type="submit" class="rounded-2xl bg-green-600 px-5 py-2.5 text-sm font-black text-white">
                Terapkan & Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Delete Modal -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-[9999] overflow-y-auto p-4">
        <button class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="closeDeleteModal"></button>

        <div class="relative z-10 flex min-h-full items-center justify-center">
          <div class="w-full max-w-lg overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start gap-3 border-b border-slate-100 p-5 dark:border-neutral-800">
              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">
                <Icon icon="ph:trash-duotone" class="h-6 w-6" />
              </div>

              <div>
                <h3 class="text-xl font-black text-slate-900 dark:text-white">Hapus Nilai Terpilih</h3>
                <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                  Nilai akan dihapus dari path: <b>{{ nilaiPathPreview }}</b>
                </p>
              </div>
            </div>

            <div class="space-y-4 p-5">
              <div class="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-300">
                {{ selectedCount }} nilai santri akan dihapus.
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
                  Ketik HAPUS untuk konfirmasi
                </label>
                <input v-model.trim="deleteConfirmText" placeholder="HAPUS" class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-rose-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
              </div>
            </div>

            <div class="flex justify-between gap-2 border-t border-slate-100 p-5 dark:border-neutral-800">
              <button class="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-black dark:border-neutral-700" :disabled="deleting" @click="closeDeleteModal">
                Batal
              </button>

              <button class="rounded-2xl bg-rose-600 px-5 py-2.5 text-sm font-black text-white disabled:opacity-50" :disabled="!canDelete || deleting" @click="performDeleteSelected">
                {{ deleting ? 'Menghapus...' : 'Hapus Nilai' }}
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
import { computed, defineComponent, h, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useNuxtApp, useRuntimeConfig } from '#app'
import { onValue, push, ref as dbRef, remove, set, update } from 'firebase/database'
import { useSantri } from '~/composables/data/useSantri'
import { makeTermKey, usePelajaran } from '~/composables/data/usePelajaran'

definePageMeta({
  layout: 'app',
  layoutProps: { title: 'Nilai' }
})

type Predikat = 'A' | 'B' | 'C' | 'D' | 'E'
type Semester = 'Ganjil' | 'Genap'
type AnyRow = Record<string, any>

type GradeRecord = {
  tugas?: number
  harian?: number
  pts?: number
  pas?: number
  proyek?: number
  lainnya?: number
  akhir?: number
  predikat?: Predikat
  catatan?: string
  createdAt?: number
  updatedAt?: number
  santriId?: string
  santriName?: string
  mapelId?: string
  mapelName?: string
  termKey?: string
  semester?: Semester
  tahunAwal?: number
}

type SubjectRow = {
  id: string
  name: string
  code?: string
  jenjang?: string
  kkm?: number
}

type WeightRecord = {
  tugas: number
  harian: number
  pts: number
  pas: number
  proyek: number
  lainnya: number
}

const ScoreInput = defineComponent({
  name: 'ScoreInput',
  props: {
    modelValue: { type: Number, default: 0 },
    fluid: { type: Boolean, default: false }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        value: props.modelValue,
        type: 'number',
        min: 0,
        max: 100,
        class: props.fluid
          ? 'h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-center text-sm font-black outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white'
          : 'h-10 w-20 rounded-2xl border border-slate-200 bg-slate-50 px-2 text-center text-sm font-black outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white',
        onInput: (event: Event) => {
          const value = Number((event.target as HTMLInputElement).value)
          emit('update:modelValue', Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0)
        }
      })
  }
})

const config = useRuntimeConfig()
const { $realtimeDb } = useNuxtApp() as any
const clientName = String(config.public.clientName || 'alinayah')

const { rows: santriRows, fetchSantri, subscribeSantri, unsubscribeSantri } = useSantri()

const {
  subjects,
  subscribeSubjects,
  unbindSubjects,
  createSubject,
  updateSubject,
  deleteSubject
} = usePelajaran()

const defaultWeights: WeightRecord = {
  tugas: 30,
  harian: 20,
  pts: 20,
  pas: 30,
  proyek: 0,
  lainnya: 0
}

const predikats: Predikat[] = ['A', 'B', 'C', 'D', 'E']

const q = ref('')
const selectedJenjang = ref<'all' | string>('all')
const selectedMaskan = ref<'all' | string>('all')
const predikatFilter = ref<'all' | Predikat>('all')

const selectedMapelId = ref('')
const tahunAwal = ref<number>(new Date().getMonth() >= 6 ? new Date().getFullYear() : new Date().getFullYear() - 1)
const semester = ref<Semester>(new Date().getMonth() >= 6 ? 'Ganjil' : 'Genap')
const termKey = computed(() => makeTermKey(tahunAwal.value, semester.value))

const nilaiMap = ref<Record<string, GradeRecord>>({})
const draft = reactive<Record<string, GradeRecord>>({})
const weights = reactive<WeightRecord>({ ...defaultWeights })
const weightForm = reactive<WeightRecord>({ ...defaultWeights })

const page = ref(1)
const pageSize = ref(20)
const rowExpandedId = ref<string | null>(null)

const selected = ref<string[]>([])
const selectedSet = computed(() => new Set(selected.value))
const selectedCount = computed(() => selected.value.length)

const savingSet = ref<Set<string>>(new Set())

const showSubjects = ref(false)
const showSubjectForm = ref(false)
const subjectFormMode = ref<'create' | 'edit'>('create')
const subjectSearch = ref('')
const subjectJenjangFilter = ref<'all' | string>('all')
const subjectForm = reactive<{ id?: string; name: string; code: string; jenjang: string; kkm: number }>({
  id: undefined,
  name: '',
  code: '',
  jenjang: '',
  kkm: 70
})

const showWeights = ref(false)
const showBulkEdit = ref(false)
const bulkOverwrite = ref(false)
const bulkForm = reactive<Record<string, any>>({
  tugas: '',
  harian: '',
  pts: '',
  pas: '',
  proyek: '',
  lainnya: '',
  catatan: ''
})

const showDeleteModal = ref(false)
const deleteConfirmText = ref('')
const deleting = ref(false)

const importInput = ref<HTMLInputElement | null>(null)
const toastMessage = ref('')

let unsubscribeGrades: (() => void) | null = null
let unsubscribeWeights: (() => void) | null = null
let toastTimer: ReturnType<typeof setTimeout> | null = null

const currentSubject = computed<SubjectRow | null>(() => {
  return (subjects.value as SubjectRow[]).find((m) => m.id === selectedMapelId.value) || null
})

const currentMapelName = computed(() => currentSubject.value?.name || '')

const nilaiPathPreview = computed(() => {
  return `${clientName}/nilai/${termKey.value}/${selectedMapelId.value || '{mapelId}'}`
})

const weightPathPreview = computed(() => {
  return `${clientName}/nilaiWeights/${termKey.value}/${selectedMapelId.value || '{mapelId}'}`
})

const subjectOptions = computed<SubjectRow[]>(() => {
  let list = (subjects.value as SubjectRow[]).slice()

  if (selectedJenjang.value !== 'all') {
    list = list.filter((m) => String(m.jenjang || '').toUpperCase().includes(String(selectedJenjang.value).toUpperCase()))
  }

  return list.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'id-ID'))
})

const subjectModalRows = computed<SubjectRow[]>(() => {
  let list = (subjects.value as SubjectRow[]).slice()

  if (subjectJenjangFilter.value !== 'all') {
    list = list.filter((m) => String(m.jenjang || '').toUpperCase().includes(String(subjectJenjangFilter.value).toUpperCase()))
  }

  const s = normalizeText(subjectSearch.value)

  if (s) {
    list = list.filter((m) => normalizeText(`${m.name} ${m.code} ${m.jenjang}`).includes(s))
  }

  return list.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'id-ID'))
})

const maskanOptions = computed(() => {
  const set = new Set<string>()

  for (const row of santriRows.value as AnyRow[]) {
    const maskan = String(row.maskan || '').trim()
    if (maskan) set.add(maskan)
  }

  return Array.from(set).sort((a, b) => a.localeCompare(b, 'id-ID'))
})

const filteredSantri = computed<AnyRow[]>(() => {
  let list = (santriRows.value as AnyRow[]).slice()

  if (selectedJenjang.value !== 'all') {
    list = list.filter((s) => normalizeText(`${s.jenjang || ''} ${s.kelasFormal || ''}`).includes(normalizeText(selectedJenjang.value)))
  }

  if (selectedMaskan.value !== 'all') {
    list = list.filter((s) => String(s.maskan || '') === selectedMaskan.value)
  }

  const search = normalizeText(q.value)

  if (search) {
    list = list.filter((s) => normalizeText(`${s.santri || ''} ${s.nama || ''} ${s.maskan || ''} ${s.kamar || ''}`).includes(search))
  }

  if (selectedMapelId.value && predikatFilter.value !== 'all') {
    list = list.filter((s) => previewPredikat(s.id) === predikatFilter.value)
  }

  return list.sort((a, b) => String(a.santri || a.nama || '').localeCompare(String(b.santri || b.nama || ''), 'id-ID'))
})

const totalFiltered = computed(() => filteredSantri.value.length)

const totalPages = computed(() => Math.max(1, Math.ceil(filteredSantri.value.length / pageSize.value)))

const pageRows = computed<AnyRow[]>(() => {
  const start = (page.value - 1) * pageSize.value
  const rows = filteredSantri.value.slice(start, start + pageSize.value)

  for (const row of rows) {
    ensureDraftFor(row.id)
  }

  return rows
})

const expandedRows = computed(() => {
  return pageRows.value.filter((s) => s.id === rowExpandedId.value)
})

const stats = computed(() => {
  const dist: Record<Predikat, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 }
  const rows = filteredSantri.value

  let total = 0
  let passed = 0
  let max = 0
  let min = rows.length ? 100 : 0
  let maxName = ''
  let minName = ''

  for (const row of rows) {
    ensureDraftFor(row.id)

    const akhir = previewAkhir(row.id)
    const pred = previewPredikat(row.id)
    const kkm = Number(currentSubject.value?.kkm || 75)

    dist[pred] += 1
    total += akhir

    if (akhir >= kkm) passed += 1

    if (akhir >= max) {
      max = akhir
      maxName = row.santri || row.nama || ''
    }

    if (akhir <= min) {
      min = akhir
      minName = row.santri || row.nama || ''
    }
  }

  return {
    avg: Math.round(total / Math.max(1, rows.length)),
    count: rows.length,
    passed,
    max,
    min,
    maxName,
    minName,
    dist
  }
})

const isAllPageSelected = computed(() => {
  return pageRows.value.length > 0 && pageRows.value.every((s) => selectedSet.value.has(s.id))
})

const canDelete = computed(() => {
  return selectedCount.value > 0 &&
    Boolean(selectedMapelId.value) &&
    deleteConfirmText.value.trim().toUpperCase() === 'HAPUS'
})

const weightFields: Array<{ key: keyof WeightRecord; label: string }> = [
  { key: 'tugas', label: 'Tugas' },
  { key: 'harian', label: 'Harian' },
  { key: 'pts', label: 'PTS' },
  { key: 'pas', label: 'PAS' },
  { key: 'proyek', label: 'Proyek' },
  { key: 'lainnya', label: 'Lainnya' }
]

const bulkFields = [
  { key: 'tugas', label: 'Tugas', type: 'number' },
  { key: 'harian', label: 'Harian', type: 'number' },
  { key: 'pts', label: 'PTS', type: 'number' },
  { key: 'pas', label: 'PAS', type: 'number' },
  { key: 'proyek', label: 'Proyek', type: 'number' },
  { key: 'lainnya', label: 'Lainnya', type: 'number' },
  { key: 'catatan', label: 'Catatan', type: 'text' }
]

watch(subjectOptions, (list) => {
  if (!selectedMapelId.value && list.length) {
    selectedMapelId.value = list[0].id
  }
}, { immediate: true })

watch([selectedMapelId, termKey], () => {
  selected.value = []
  rowExpandedId.value = null
  resetDraft()
  subscribeGrades()
  subscribeWeights()
}, { immediate: true })

watch([filteredSantri, pageSize], () => {
  page.value = 1
})

watch(page, () => {
  for (const row of pageRows.value) {
    ensureDraftFor(row.id)
  }
})

function subscribeGrades() {
  if (unsubscribeGrades) {
    try { unsubscribeGrades() } catch {}
    unsubscribeGrades = null
  }

  nilaiMap.value = {}

  if (!$realtimeDb || !selectedMapelId.value) return

  unsubscribeGrades = onValue(dbRef($realtimeDb, nilaiPathPreview.value), (snap) => {
    nilaiMap.value = snap.val() || {}

    for (const row of pageRows.value) {
      ensureDraftFor(row.id)
    }
  })
}

function subscribeWeights() {
  if (unsubscribeWeights) {
    try { unsubscribeWeights() } catch {}
    unsubscribeWeights = null
  }

  Object.assign(weights, defaultWeights)

  if (!$realtimeDb || !selectedMapelId.value) return

  unsubscribeWeights = onValue(dbRef($realtimeDb, weightPathPreview.value), (snap) => {
    Object.assign(weights, defaultWeights, snap.val() || {})
  })
}

function resetDraft() {
  for (const key of Object.keys(draft)) {
    delete draft[key]
  }
}

function ensureDraftFor(id: string) {
  if (!id) return

  const saved = getGrade(id)

  if (!draft[id]) {
    draft[id] = {
      tugas: Number(saved.tugas ?? 0),
      harian: Number(saved.harian ?? 0),
      pts: Number(saved.pts ?? 0),
      pas: Number(saved.pas ?? 0),
      proyek: saved.proyek,
      lainnya: saved.lainnya,
      catatan: String(saved.catatan || '')
    }
  }
}

function getGrade(id: string) {
  return nilaiMap.value[id] || nilaiMap.value[safeKey(id)] || {}
}

function getSantri(id: string) {
  return (santriRows.value as AnyRow[]).find((s) => s.id === id) || {}
}

function previewAkhir(id: string) {
  ensureDraftFor(id)

  const d = draft[id] || {}
  const totalWeight = Math.max(
    1,
    Number(weights.tugas || 0) +
    Number(weights.harian || 0) +
    Number(weights.pts || 0) +
    Number(weights.pas || 0) +
    Number(weights.proyek || 0) +
    Number(weights.lainnya || 0)
  )

  const value =
    scoreValue(d.tugas) * Number(weights.tugas || 0) +
    scoreValue(d.harian) * Number(weights.harian || 0) +
    scoreValue(d.pts) * Number(weights.pts || 0) +
    scoreValue(d.pas) * Number(weights.pas || 0) +
    scoreValue(d.proyek) * Number(weights.proyek || 0) +
    scoreValue(d.lainnya) * Number(weights.lainnya || 0)

  return Math.round(Math.max(0, Math.min(100, value / totalWeight)))
}

function previewPredikat(id: string): Predikat {
  const akhir = previewAkhir(id)
  const kkm = Number(currentSubject.value?.kkm || 75)

  if (!kkm) {
    if (akhir >= 92) return 'A'
    if (akhir >= 83) return 'B'
    if (akhir >= 75) return 'C'
    if (akhir >= 65) return 'D'
    return 'E'
  }

  const span = 100 - kkm
  const a = kkm + span * 0.8
  const b = kkm + span * 0.6
  const c = kkm + span * 0.4
  const d = kkm

  if (akhir >= a) return 'A'
  if (akhir >= b) return 'B'
  if (akhir >= c) return 'C'
  if (akhir >= d) return 'D'
  return 'E'
}

function scoreValue(value: any) {
  const n = Number(value)
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0
}

function buildGradePayload(id: string): GradeRecord {
  ensureDraftFor(id)

  const s = getSantri(id)
  const old = getGrade(id)
  const d = draft[id] || {}
  const akhir = previewAkhir(id)
  const predikat = previewPredikat(id)

  return cleanObject({
    tugas: scoreValue(d.tugas),
    harian: scoreValue(d.harian),
    pts: scoreValue(d.pts),
    pas: scoreValue(d.pas),
    proyek: d.proyek === undefined || d.proyek === null || d.proyek === '' ? undefined : scoreValue(d.proyek),
    lainnya: d.lainnya === undefined || d.lainnya === null || d.lainnya === '' ? undefined : scoreValue(d.lainnya),
    akhir,
    predikat,
    catatan: String(d.catatan || ''),
    santriId: id,
    santriName: s.santri || s.nama || '',
    mapelId: selectedMapelId.value,
    mapelName: currentMapelName.value,
    termKey: termKey.value,
    semester: semester.value,
    tahunAwal: tahunAwal.value,
    createdAt: old.createdAt || Date.now(),
    updatedAt: Date.now()
  })
}

async function saveOne(id: string) {
  if (!$realtimeDb || !selectedMapelId.value) return

  setSaving(id, true)

  try {
    const payload = buildGradePayload(id)

    await set(dbRef($realtimeDb, `${nilaiPathPreview.value}/${safeKey(id)}`), payload)

    nilaiMap.value = {
      ...nilaiMap.value,
      [safeKey(id)]: payload
    }

    showToast('Nilai berhasil disimpan.')
  } catch (e: any) {
    alert(e?.message || 'Gagal menyimpan nilai.')
  } finally {
    setSaving(id, false)
  }
}

async function saveRows(rows: AnyRow[]) {
  if (!$realtimeDb || !selectedMapelId.value) return

  const updates: Record<string, GradeRecord> = {}

  for (const row of rows) {
    ensureDraftFor(row.id)
    updates[safeKey(row.id)] = buildGradePayload(row.id)
  }

  await update(dbRef($realtimeDb, nilaiPathPreview.value), updates)

  nilaiMap.value = {
    ...nilaiMap.value,
    ...updates
  }

  showToast(`${rows.length} nilai berhasil disimpan.`)
}

async function savePage() {
  await saveRows(pageRows.value)
}

async function saveFiltered() {
  await saveRows(filteredSantri.value)
}

async function saveSelected() {
  const rows = selected.value.map((id) => getSantri(id)).filter((row) => row.id)
  await saveRows(rows)
}

function isSaving(id: string) {
  return savingSet.value.has(id)
}

function setSaving(id: string, state: boolean) {
  const next = new Set(savingSet.value)

  if (state) next.add(id)
  else next.delete(id)

  savingSet.value = next
}

function toggleRow(id: string) {
  rowExpandedId.value = rowExpandedId.value === id ? null : id
}

function isSelected(id: string) {
  return selectedSet.value.has(id)
}

function toggleSelect(id: string) {
  if (isSelected(id)) {
    selected.value = selected.value.filter((x) => x !== id)
  } else {
    selected.value = [...selected.value, id]
  }
}

function toggleSelectAllPage() {
  const pageIds = pageRows.value.map((s) => s.id)

  if (isAllPageSelected.value) {
    selected.value = selected.value.filter((id) => !pageIds.includes(id))
  } else {
    selected.value = Array.from(new Set([...selected.value, ...pageIds]))
  }
}

function openSubjects() {
  showSubjects.value = true
}

function openSubjectForm(subject?: SubjectRow) {
  subjectFormMode.value = subject ? 'edit' : 'create'

  Object.assign(subjectForm, subject
    ? {
        id: subject.id,
        name: subject.name || '',
        code: subject.code || '',
        jenjang: subject.jenjang || '',
        kkm: Number(subject.kkm ?? 70)
      }
    : {
        id: undefined,
        name: '',
        code: '',
        jenjang: '',
        kkm: 70
      })

  showSubjectForm.value = true
}

function closeSubjectForm() {
  showSubjectForm.value = false
}

async function submitSubjectForm() {
  if (!subjectForm.name.trim()) return

  if (subjectFormMode.value === 'create') {
    await createSubject({
      name: subjectForm.name.trim(),
      code: subjectForm.code.trim(),
      jenjang: subjectForm.jenjang as any,
      kkm: Number(subjectForm.kkm || 70)
    })
  } else if (subjectForm.id) {
    await updateSubject(subjectForm.id, {
      name: subjectForm.name.trim(),
      code: subjectForm.code.trim(),
      jenjang: subjectForm.jenjang as any,
      kkm: Number(subjectForm.kkm || 70)
    })
  }

  showSubjectForm.value = false
  showToast('Mapel berhasil disimpan.')
}

async function removeSubject(id: string) {
  if (!confirm('Hapus mapel ini?')) return
  await deleteSubject(id)
  showToast('Mapel berhasil dihapus.')
}

function openWeights() {
  if (!selectedMapelId.value) return

  Object.assign(weightForm, weights)
  showWeights.value = true
}

async function saveWeightForm() {
  if (!$realtimeDb || !selectedMapelId.value) return

  const payload: WeightRecord = {
    tugas: Number(weightForm.tugas || 0),
    harian: Number(weightForm.harian || 0),
    pts: Number(weightForm.pts || 0),
    pas: Number(weightForm.pas || 0),
    proyek: Number(weightForm.proyek || 0),
    lainnya: Number(weightForm.lainnya || 0)
  }

  await set(dbRef($realtimeDb, weightPathPreview.value), {
    ...payload,
    updatedAt: Date.now()
  })

  Object.assign(weights, payload)

  showWeights.value = false
  showToast('Bobot berhasil disimpan.')
}

function openBulkEdit() {
  Object.assign(bulkForm, {
    tugas: '',
    harian: '',
    pts: '',
    pas: '',
    proyek: '',
    lainnya: '',
    catatan: ''
  })

  bulkOverwrite.value = false
  showBulkEdit.value = true
}

async function applyBulkEdit(saveNow: boolean) {
  const keys: Array<keyof GradeRecord> = ['tugas', 'harian', 'pts', 'pas', 'proyek', 'lainnya', 'catatan']

  for (const id of selected.value) {
    ensureDraftFor(id)

    for (const key of keys) {
      const value = bulkForm[key]

      if (value === undefined || value === null || value === '') continue

      const currentValue = (draft[id] as any)[key]

      if (bulkOverwrite.value || currentValue === undefined || currentValue === null || currentValue === '') {
        ;(draft[id] as any)[key] = key === 'catatan' ? String(value) : scoreValue(value)
      }
    }
  }

  showBulkEdit.value = false

  if (saveNow) {
    await saveSelected()
  } else {
    showToast('Nilai terpilih berhasil diterapkan ke draft.')
  }
}

function openDeleteModal() {
  if (!selectedCount.value || !selectedMapelId.value) return

  deleteConfirmText.value = ''
  showDeleteModal.value = true
}

function closeDeleteModal() {
  if (!deleting.value) showDeleteModal.value = false
}

async function performDeleteSelected() {
  if (!$realtimeDb || !canDelete.value || deleting.value) return

  deleting.value = true

  try {
    const updates: Record<string, null> = {}

    for (const id of selected.value) {
      updates[safeKey(id)] = null
    }

    await update(dbRef($realtimeDb, nilaiPathPreview.value), updates)

    const nextMap = { ...nilaiMap.value }

    for (const id of selected.value) {
      delete nextMap[id]
      delete nextMap[safeKey(id)]
      delete draft[id]
    }

    nilaiMap.value = nextMap
    selected.value = []
    showDeleteModal.value = false

    showToast('Nilai terpilih berhasil dihapus.')
  } catch (e: any) {
    alert(e?.message || 'Gagal menghapus nilai.')
  } finally {
    deleting.value = false
  }
}

function triggerImport() {
  importInput.value?.click()
}

async function importCSV(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || !selectedMapelId.value) return

  const text = await file.text()
  const lines = text.split(/\r?\n/).filter(Boolean)
  const header = lines.shift()

  if (!header) return

  const sep = header.includes('\t') ? '\t' : ','
  const headers = header.split(sep).map((h) => h.trim().replace(/^"|"$/g, '').toLowerCase())

  const idx = (name: string) => headers.findIndex((h) => h === name.toLowerCase())

  const iId = idx('santriid')
  const iNama = idx('nama')
  const iTugas = idx('tugas')
  const iHarian = idx('harian')
  const iPts = idx('pts')
  const iPas = idx('pas')
  const iProyek = idx('proyek')
  const iLainnya = idx('lainnya')
  const iCatatan = idx('catatan')

  const nameMap = new Map<string, string>()

  for (const s of santriRows.value as AnyRow[]) {
    const name = normalizeText(s.santri || s.nama || '')
    if (name) nameMap.set(name, s.id)
  }

  for (const line of lines) {
    const cols = line.split(sep).map((c) => c.replace(/^"|"$/g, '').replace(/""/g, '"'))

    let id = iId >= 0 ? String(cols[iId] || '').trim() : ''

    if (!id && iNama >= 0) {
      id = nameMap.get(normalizeText(cols[iNama])) || ''
    }

    if (!id) continue

    ensureDraftFor(id)

    if (iTugas >= 0) draft[id].tugas = scoreValue(cols[iTugas])
    if (iHarian >= 0) draft[id].harian = scoreValue(cols[iHarian])
    if (iPts >= 0) draft[id].pts = scoreValue(cols[iPts])
    if (iPas >= 0) draft[id].pas = scoreValue(cols[iPas])
    if (iProyek >= 0 && cols[iProyek] !== '') draft[id].proyek = scoreValue(cols[iProyek])
    if (iLainnya >= 0 && cols[iLainnya] !== '') draft[id].lainnya = scoreValue(cols[iLainnya])
    if (iCatatan >= 0) draft[id].catatan = String(cols[iCatatan] || '')
  }

  await saveFiltered()

  if (importInput.value) {
    importInput.value.value = ''
  }
}

function exportCSV() {
  const rows = filteredSantri.value
  const headers = ['santriId', 'nama', 'maskan', 'kamar', 'tugas', 'harian', 'pts', 'pas', 'proyek', 'lainnya', 'akhir', 'predikat', 'catatan']

  const lines = rows.map((s) => {
    ensureDraftFor(s.id)

    const d = draft[s.id] || {}

    return [
      s.id,
      s.santri || s.nama || '',
      s.maskan || '',
      s.kamar || '',
      d.tugas ?? 0,
      d.harian ?? 0,
      d.pts ?? 0,
      d.pas ?? 0,
      d.proyek ?? '',
      d.lainnya ?? '',
      previewAkhir(s.id),
      previewPredikat(s.id),
      d.catatan || ''
    ].map(csvCell).join(',')
  })

  const csv = '\uFEFF' + [headers.join(','), ...lines].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = `nilai_${termKey.value}_${currentMapelName.value || 'mapel'}.csv`
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

function safeKey(value: string) {
  return String(value || '').replace(/[.#$/\[\]]/g, '_')
}

function normalizeText(value?: any) {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function scoreBadgeClass(score: number) {
  if (score >= 90) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (score >= 80) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (score >= 70) return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
}

function predikatBadgeClass(predikat: Predikat) {
  if (predikat === 'A') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (predikat === 'B') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (predikat === 'C') return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  if (predikat === 'D') return 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300'
  return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
}

function showToast(message: string) {
  toastMessage.value = message

  if (toastTimer) clearTimeout(toastTimer)

  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 2200)
}

onMounted(async () => {
  subscribeSubjects()
  subscribeSantri()

  try {
    await fetchSantri()
  } catch {}
})

onUnmounted(() => {
  try { unbindSubjects() } catch {}
  try { unsubscribeSantri() } catch {}

  if (unsubscribeGrades) {
    try { unsubscribeGrades() } catch {}
    unsubscribeGrades = null
  }

  if (unsubscribeWeights) {
    try { unsubscribeWeights() } catch {}
    unsubscribeWeights = null
  }

  if (toastTimer) clearTimeout(toastTimer)
})
</script>