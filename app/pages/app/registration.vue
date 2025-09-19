<template>
  <div class="relative">
    <!-- Background pattern -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-white dark:bg-neutral-950
                  [background-image:radial-gradient(theme(colors.slate.200)_1px,transparent_1px)]
                  [background-size:18px_18px] [background-position:0_0]
                  dark:[background-image:radial-gradient(theme(colors.zinc.800/.35)_1px,transparent_1px)]"></div>
      <div class="absolute -top-32 -left-40 h-[520px] w-[520px] rounded-full blur-3xl
                  bg-[radial-gradient(closest-side,theme(colors.emerald.300/.30),transparent)]"></div>
      <div class="absolute -bottom-24 -right-40 h-[520px] w-[520px] rounded-full blur-3xl
                  bg-[radial-gradient(closest-side,theme(colors.violet.300/.30),transparent)]"></div>
    </div>

    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-start flex-wrap justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-400">
            <Icon icon="ph:student" class="size-4" />
            PPDB • {{ selectedYear }}/{{ Number(selectedYear) + 1 }}
          </div>
          <h1 class="text-xl sm:text-2xl font-bold mt-1">Pendaftaran Santri — Admin</h1>
          <p class="text-sm text-slate-600 dark:text-neutral-300">Kelola pendaftar (Putra/Putri), lihat dokumen, detail lengkap, dan ekspor CSV.</p>
        </div>

        <div class="shrink-0 flex items-center gap-2">
          <NuxtLink
            to="/registration"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700">
            <Icon icon="ph:link-simple" class="size-4" /> Buka Form
          </NuxtLink>
          <button @click="copy(formUrl)"
                  class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-neutral-700 bg-white text-xs font-medium hover:bg-slate-50 dark:bg-neutral-900 dark:hover:bg-neutral-800">
            <Icon icon="ph:copy" class="size-4" /> Salin Link
          </button>
        </div>
      </div>

      <!-- Status & Autoclose -->
      <section class="rounded-2xl border border-slate-200/70 dark:border-neutral-800 bg-white/85 dark:bg-neutral-900/80 backdrop-blur p-4 sm:p-5">
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span
                  class="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-full ring-1"
                  :class="isOpen
                    ? 'bg-emerald-50 ring-emerald-200 dark:bg-emerald-900/20 dark:ring-emerald-800/60'
                    : 'bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:ring-rose-800/60'">
                  <Icon :icon="isOpen ? 'ph:lock-open' : 'ph:lock'" class="size-3.5" />
                  {{ isOpen ? 'PENDAFTARAN DIBUKA' : 'PENDAFTARAN DITUTUP' }}
                </span>
                <span v-if="autoBadge"
                      :title="settings.autoCloseAt || ''"
                      class="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-full ring-1
                             bg-indigo-50 text-indigo-800 ring-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:ring-indigo-800/60">
                  <Icon icon="ph:clock" class="size-3.5" /> {{ autoBadge }}
                </span>
              </div>
              <p class="text-sm text-slate-600 dark:text-neutral-300 mt-1">
                Atur status pendaftaran secara manual atau aktifkan penutupan otomatis pada jadwal tertentu.
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer select-none">
              <input type="checkbox" class="peer sr-only" :checked="isOpen" @change="toggleOpen" />
              <span
                class="w-[3.25rem] h-7 bg-slate-200 dark:bg-neutral-700 rounded-full transition peer-checked:bg-emerald-600
                       after:content-[''] after:absolute after:w-6 after:h-6 after:bg-white dark:after:bg-neutral-100
                       after:rounded-full after:shadow after:transition after:translate-x-1
                       peer-checked:after:translate-x-[1.25rem]"></span>
              <span class="ml-3 text-sm font-medium text-slate-700 dark:text-neutral-200">
                {{ isOpen ? 'Buka' : 'Tutup' }}
              </span>
            </label>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="inline-flex rounded-xl p-1 ring-1 ring-slate-200 dark:ring-neutral-700 bg-slate-50 dark:bg-neutral-800">
              <button type="button"
                      @click="saveSettings({ autoCloseEnabled: false })"
                      class="px-3 py-1.5 rounded-lg text-sm font-medium transition"
                      :class="!settings.autoCloseEnabled
                        ? 'bg-white dark:bg-neutral-900 shadow text-slate-900 dark:text-neutral-100'
                        : 'text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-neutral-100'">
                Manual
              </button>
              <button type="button"
                      @click="saveSettings({ autoCloseEnabled: true })"
                      class="px-3 py-1.5 rounded-lg text-sm font-medium transition"
                      :class="settings.autoCloseEnabled
                        ? 'bg-white dark:bg-neutral-900 shadow text-slate-900 dark:text-neutral-100'
                        : 'text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-neutral-100'">
                Otomatis
              </button>
            </div>

            <div class="flex items-center gap-2">
              <label class="text-xs text-slate-500 dark:text-neutral-400">Tahun</label>
              <select v-model="selectedYear"
                      class="px-3 py-2 rounded-lg border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm">
                <option v-for="y in mergedYearOptions" :key="y" :value="y">{{ y }}</option>
              </select>
            </div>
          </div>

          <div v-if="settings.autoCloseEnabled" class="grid md:grid-cols-[1fr,auto] gap-3">
            <div class="grid sm:grid-cols-2 gap-3">
              <div>
                <label class="text-xs text-slate-500 dark:text-neutral-400">Tanggal & Waktu Tutup (otomatis)</label>
                <input
                  type="datetime-local"
                  :value="autoCloseLocal"
                  @change="onAutoCloseChange(($event.target as HTMLInputElement).value)"
                  class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"/>
                <p class="text-[11px] text-slate-500 dark:text-neutral-400 mt-1">
                  Disimpan sebagai ISO. Mengikuti zona waktu perangkat admin.
                </p>
              </div>
              <div class="space-y-1">
                <label class="text-xs text-slate-500 dark:text-neutral-400">Sisa Waktu</label>
                <div class="text-sm font-medium" :class="countdownClass">
                  {{ countdownText }}
                </div>
                <div v-if="willAutoClose" class="text-[11px] 700 dark:300">
                  Pendaftaran akan ditutup otomatis pada jadwal di atas.
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <div class="text-xs text-slate-500 dark:text-neutral-400">Quick Picks</div>
              <div class="flex flex-wrap gap-2">
                <button @click="pickTonight"
                        class="px-2.5 py-1.5 rounded-lg text-xs font-medium ring-1 ring-slate-200 hover:bg-slate-50 dark:ring-neutral-700 dark:hover:bg-neutral-800">
                  Malam ini 23:59
                </button>
                <button @click="pickInDays(3)"
                        class="px-2.5 py-1.5 rounded-lg text-xs font-medium ring-1 ring-slate-200 hover:bg-slate-50 dark:ring-neutral-700 dark:hover:bg-neutral-800">
                  +3 hari
                </button>
                <button @click="pickInDays(7)"
                        class="px-2.5 py-1.5 rounded-lg text-xs font-medium ring-1 ring-slate-200 hover:bg-slate-50 dark:ring-neutral-700 dark:hover:bg-neutral-800">
                  +7 hari
                </button>
                <button @click="clearSchedule"
                        class="px-2.5 py-1.5 rounded-lg text-xs font-medium ring-1 ring-rose-200 text-rose-700 hover:bg-rose-50 dark:ring-rose-800/60 dark:text-rose-300 dark:hover:bg-rose-900/20">
                  Hapus Jadwal
                </button>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2 pt-1">
            <button v-if="!isOpen" @click="saveSettings({ isClosed: false })"
                    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700">
              <Icon icon="ph:door-open" class="size-4" /> Buka Sekarang
            </button>
            <button v-else @click="saveSettings({ isClosed: true })"
                    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-medium hover:bg-rose-700">
              <Icon icon="ph:door" class="size-4" /> Tutup Sekarang
            </button>
            <button v-if="settings.autoCloseEnabled && settings.autoCloseAt"
                    @click="testScheduleNow"
                    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-neutral-700 text-xs font-medium hover:bg-slate-50 dark:hover:bg-neutral-800">
              <Icon icon="ph:flask" class="size-4" /> Uji Jadwal (1 menit)
            </button>
          </div>
        </div>
      </section>

      <!-- Filter -->
      <section class="rounded-2xl border border-slate-200/70 dark:border-neutral-800 bg-white/85 dark:bg-neutral-900/80 backdrop-blur">
        <div class="p-4 sm:p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="flex items-center gap-2">
            <label class="text-xs text-slate-500 dark:text-neutral-400">Tahun</label>
            <select v-model="selectedYear"
                    class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm">
              <option v-for="y in mergedYearOptions" :key="y" :value="y">{{ y }}</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <label class="text-xs text-slate-500 dark:text-neutral-400">Jenjang</label>
            <select v-model="filters.jenjang"
                    class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm">
              <option value="semua">Semua</option>
              <option v-for="j in jenjangOptions" :key="j" :value="j">{{ j }}</option>
            </select>
          </div>
          <div class="sm:col-span-2">
            <input v-model="filters.q" placeholder="Cari nama / NIK / alamat / ayah / ibu / no HP…"
                   class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm" />
          </div>
        </div>
      </section>

      <!-- Tables -->
      <div class="grid grid-cols-1 gap-6 items-start">
        <!-- PUTRA -->
        <section v-if="ppdbMode === 'putra'" class="space-y-4 overflow-x-auto w-full">
          <header class="flex items-center gap-2">
            <div class="size-8 grid place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300">♂</div>
            <h2 class="text-base sm:text-lg font-semibold">Putra ({{ selectedYear }})</h2>
          </header>

          <!-- Calon Putra -->
          <div class="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white/85 dark:bg-neutral-900/80 backdrop-blur">
            <div class="p-4 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-neutral-800">
              <h3 class="font-semibold text-sm sm:text-base">Calon Putra</h3>
              <div class="flex items-center gap-2">
                <button @click="approveBulk(calonPutraFiltered.map(r=>r.id))"
                        :disabled="!calonPutraFiltered.length || savingBulk"
                        class="text-xs px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60">
                  Terima Semua ({{ calonPutraFiltered.length }})
                </button>
                <button @click="exportFullCSV(calonPutraFiltered, `calon_putra_${selectedYear}.csv`)"
                        class="text-xs px-3 py-1.5 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">
                  Export CSV (Full)
                </button>
              </div>
            </div>
            <div class="p-3">
              <DataTable
                :show-actions="true"
                title="Calon Putra"
                :rows="calonPutraFiltered"
                :columns="columnsAdmin"
                :rowKey="(r) => r.id"
              >
                <template #cell-dokumen="{ row }">
                  <span class="text-xs px-2 py-0.5 rounded"
                        :class="row.dokumenCount===4
                          ? 'bg-emerald-100 700 dark:bg-emerald-900/30 dark:300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'">
                    {{ row.dokumenCount }}/4
                  </span>
                </template>
                <template #cell-action="{ row }">
                  <div class="flex items-center flex-wrap gap-2">
                    <button @click="openDetail(row)" class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Detail</button>
                    <button @click="openEdit(row)" class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Edit</button>
                    <button @click="openDocs(row.id)" class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Dokumen</button>
                    <button @click="approve(row.id)" class="text-xs px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700">Terima</button>
                    <button @click="openConfirm(row)" class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">Hapus</button>
                  </div>
                </template>
              </DataTable>
            </div>
          </div>

          <!-- Diterima Putra -->
          <div class="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white/85 dark:bg-neutral-900/80 backdrop-blur">
            <div class="p-4 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-neutral-800">
              <h3 class="font-semibold text-sm sm:text-base">Santri Baru Putra</h3>
              <div class="flex items-center gap-2">
                <button @click="revertBulk(baruPutraFiltered.map(r=>r.id))"
                        :disabled="!baruPutraFiltered.length || savingBulkRevert"
                        class="text-xs px-3 py-1.5 rounded bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-60">
                  Jadikan Calon Semua ({{ baruPutraFiltered.length }})
                </button>
                <button @click="exportFullCSV(baruPutraFiltered, `santri_putra_${selectedYear}.csv`)"
                        class="text-xs px-3 py-1.5 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">
                  Export CSV (Full)
                </button>
              </div>
            </div>
            <div class="p-3">
              <DataTable
                :show-actions="true"
                title="Santri Baru Putra"
                :rows="baruPutraFiltered"
                :columns="columnsAdmin"
                :rowKey="(r) => r.id"
              >
                <template #cell-dokumen="{ row }">
                  <span class="text-xs px-2 py-0.5 rounded"
                        :class="row.dokumenCount===4
                          ? 'bg-emerald-100 700 dark:bg-emerald-900/30 dark:300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'">
                    {{ row.dokumenCount }}/4
                  </span>
                </template>
                <template #cell-action="{ row }">
                  <div class="flex items-center flex-wrap gap-2">
                    <button @click="openDetail(row)" class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Detail</button>
                    <button @click="openEdit(row)" class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Edit</button>
                    <button @click="openDocs(row.id)" class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Dokumen</button>
                    <button @click="revertToCalon(row.id)" class="text-xs px-2 py-1 rounded bg-amber-600 text-white hover:bg-amber-700">Jadikan Calon</button>
                    <button @click="openConfirm(row)" class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">Hapus</button>
                  </div>
                </template>
              </DataTable>
            </div>
          </div>
        </section>

        <!-- PUTRI -->
        <section v-if="ppdbMode === 'putri'" class="space-y-4">
          <header class="flex items-center gap-2">
            <div class="size-8 grid place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300">♀</div>
            <h2 class="text-base sm:text-lg font-semibold">Putri ({{ selectedYear }})</h2>
          </header>

          <!-- Calon Putri -->
          <div class="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white/85 dark:bg-neutral-900/80 backdrop-blur">
            <div class="p-4 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-neutral-800">
              <h3 class="font-semibold text-sm sm:text-base">Calon Putri</h3>
              <div class="flex items-center gap-2">
                <button @click="approveBulk(calonPutriFiltered.map(r=>r.id))"
                        :disabled="!calonPutriFiltered.length || savingBulk"
                        class="text-xs px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60">
                  Terima Semua ({{ calonPutriFiltered.length }})
                </button>
                <button @click="exportFullCSV(calonPutriFiltered, `calon_putri_${selectedYear}.csv`)"
                        class="text-xs px-3 py-1.5 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">
                  Export CSV (Full)
                </button>
              </div>
            </div>
            <div class="p-3">
              <DataTable
                :show-actions="true"
                title="Calon Putri"
                :rows="calonPutriFiltered"
                :columns="columnsAdmin"
                :rowKey="(r) => r.id"
              >
                <template #cell-dokumen="{ row }">
                  <span class="text-xs px-2 py-0.5 rounded"
                        :class="row.dokumenCount===4
                          ? 'bg-emerald-100 700 dark:bg-emerald-900/30 dark:300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'">
                    {{ row.dokumenCount }}/4
                  </span>
                </template>
                <template #cell-action="{ row }">
                  <div class="flex items-center flex-wrap gap-2">
                    <button @click="openDetail(row)" class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Detail</button>
                    <button @click="openEdit(row)" class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Edit</button>
                    <button @click="openDocs(row.id)" class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Dokumen</button>
                    <button @click="approve(row.id)" class="text-xs px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700">Terima</button>
                    <button @click="openConfirm(row)" class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">Hapus</button>
                  </div>
                </template>
              </DataTable>
            </div>
          </div>

          <!-- Diterima Putri -->
          <div class="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white/85 dark:bg-neutral-900/80 backdrop-blur">
            <div class="p-4 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-neutral-800">
              <h3 class="font-semibold text-sm sm:text-base">Santri Baru Putri</h3>
              <div class="flex items-center gap-2">
                <button @click="revertBulk(baruPutriFiltered.map(r=>r.id))"
                        :disabled="!baruPutriFiltered.length || savingBulkRevert"
                        class="text-xs px-3 py-1.5 rounded bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-60">
                  Jadikan Calon Semua ({{ baruPutriFiltered.length }})
                </button>
                <button @click="exportFullCSV(baruPutriFiltered, `santri_putri_${selectedYear}.csv`)"
                        class="text-xs px-3 py-1.5 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">
                  Export CSV (Full)
                </button>
              </div>
            </div>
            <div class="p-3">
              <DataTable
                :show-actions="true"
                title="Santri Baru Putri"
                :rows="baruPutriFiltered"
                :columns="columnsAdmin"
                :rowKey="(r) => r.id"
              >
                <template #cell-dokumen="{ row }">
                  <span class="text-xs px-2 py-0.5 rounded"
                        :class="row.dokumenCount===4
                          ? 'bg-emerald-100 700 dark:bg-emerald-900/30 dark:300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'">
                    {{ row.dokumenCount }}/4
                  </span>
                </template>
                <template #cell-action="{ row }">
                  <div class="flex items-center flex-wrap gap-2">
                    <button @click="openDetail(row)" class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Detail</button>
                    <button @click="openEdit(row)" class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Edit</button>
                    <button @click="openDocs(row.id)" class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Dokumen</button>
                    <button @click="revertToCalon(row.id)" class="text-xs px-2 py-1 rounded bg-amber-600 text-white hover:bg-amber-700">Jadikan Calon</button>
                    <button @click="openConfirm(row)" class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">Hapus</button>
                  </div>
                </template>
              </DataTable>
            </div>
          </div>
        </section>
      </div>

      <!-- Modal: Edit ringkas (tetap) -->
      <ModalShell v-model="showForm" :title="formMode === 'edit' ? 'Ubah Data (Ringkas)' : 'Tambah Pendaftar'">
        <form class="space-y-3 max-h-[60vh] overflow-y-auto scrollbar-none" @submit.prevent="saveRow">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-slate-600 dark:text-neutral-300">Gen</label>
              <input v-model.trim="form.gen" required class="w-full px-3 py-2 rounded border border-slate-200 dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
            <div>
              <label class="text-xs text-slate-600 dark:text-neutral-300">Nama Santri</label>
              <input v-model.trim="form.santri" required class="w-full px-3 py-2 rounded border border-slate-200 dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
            <div>
              <label class="text-xs text-slate-600 dark:text-neutral-300">No. HP</label>
              <input v-model.trim="form.nohp" class="w-full px-3 py-2 rounded border border-slate-200 dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
            <div>
              <label class="text-xs text-slate-600 dark:text-neutral-300">Jenjang</label>
              <input v-model.trim="form.jenjang" class="w-full px-3 py-2 rounded border border-slate-200 dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
            <div class="sm:col-span-2">
              <label class="text-xs text-slate-600 dark:text-neutral-300">Alamat</label>
              <textarea v-model.trim="form.alamat" rows="2"
                        class="w-full px-3 py-2 rounded border border-slate-200 dark:bg-neutral-900 dark:border-neutral-700"></textarea>
            </div>
            <div>
              <label class="text-xs text-slate-600 dark:text-neutral-300">Gender (L/P)</label>
              <input v-model.trim="form.gender" maxlength="1"
                     class="w-full px-3 py-2 rounded border border-slate-200 dark:bg-neutral-900 dark:border-neutral-700"
                     placeholder="L atau P" />
            </div>
            <div>
              <label class="text-xs text-slate-600 dark:text-neutral-300">Status</label>
              <select v-model="form.status"
                      class="w-full px-3 py-2 rounded border border-slate-200 dark:bg-neutral-900 dark:border-neutral-700">
                <option value="nonaktif">nonaktif (Calon)</option>
                <option value="">(Kosong) = Diterima</option>
              </select>
            </div>
          </div>
          <p v-if="formError" class="text-sm text-rose-600">{{ formError }}</p>
        </form>
        <template #footer>
          <button @click="showForm=false" class="px-3 py-1.5 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Batal</button>
          <button :disabled="saving" @click="saveRow" class="px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60">
            {{ saving ? 'Menyimpan…' : (formMode === 'edit' ? 'Update' : 'Simpan') }}
          </button>
        </template>
      </ModalShell>

      <!-- Modal: Dokumen -->
      <ModalShell v-model="showDocs" title="Dokumen Pendaftar">
        <div class="space-y-3">
          <div v-if="docState.loading" class="text-sm text-slate-500">Memuat dokumen…</div>
          <div v-else-if="!docTabs.length" class="text-sm text-slate-500">Tidak ada dokumen.</div>
          <div v-else>
            <div class="overflow-x-auto">
              <nav class="flex items-center gap-1 border-b border-slate-200 dark:border-neutral-800">
                <button
                  v-for="(t, i) in docTabs"
                  :key="t.key"
                  @click="activeDocTab = i"
                  class="px-3 py-2 text-sm -mb-px rounded-t-lg"
                  :class="activeDocTab === i
                    ? 'border-b-2 border-slate-800 dark:border-neutral-200 text-slate-900 dark:text-neutral-100 font-medium'
                    : 'text-slate-500 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-neutral-200'">
                  {{ t.label }}
                </button>
              </nav>
            </div>
            <div class="mt-3 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <div class="p-2">
                <div v-if="currentTab.isImage" class="w-full h-[60vh] grid place-items-center">
                  <img :src="currentTab.url" alt="" class="max-h-full max-w-full object-contain rounded-md" @error="() => {}" />
                </div>
                <div v-else-if="currentTab.isPdf" class="w-full h-[60vh]">
                  <iframe :src="currentTab.viewerUrl" class="w-full h-full rounded-md" allowfullscreen loading="lazy"></iframe>
                </div>
                <div v-else class="p-4 text-sm text-slate-600 dark:text-neutral-300">
                  File tidak dapat dipratinjau.
                  <a :href="currentTab.url" target="_blank" class="underline decoration-dotted">Buka di tab baru</a>.
                </div>
              </div>
              <div class="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 dark:border-neutral-800 px-3 py-2 text-xs">
                <div class="flex items-center gap-2">
                  <a :href="currentTab.url" target="_blank" class="px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Buka</a>
                  <a :href="currentTab.url" download class="px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Unduh</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <button @click="showDocs=false" class="px-3 py-1.5 rounded border border-slate-200 hover:bg-slate-50 dark:hover:bg-neutral-800">Tutup</button>
        </template>
      </ModalShell>

      <!-- Modal: Detail Lengkap -->
      <ModalShell v-model="showDetail" title="Detail Pendaftaran">
        <div v-if="detailState.loading" class="text-sm text-slate-500">Memuat detail…</div>
        <div v-else-if="!fullRecord" class="text-sm text-slate-500">Data tidak tersedia.</div>
        <div v-else class="max-h-[65vh] overflow-y-auto space-y-4 pr-1">
          <div class="rounded-lg border border-slate-200 dark:border-neutral-800 p-3">
            <div class="grid sm:grid-cols-2 gap-2 text-sm">
              <div><span class="text-slate-500 dark:text-neutral-400">No. Pendaftaran:</span> <b>{{ fullRecord.ppdbCode }}</b></div>
              <div><span class="text-slate-500 dark:text-neutral-400">NIK:</span> <b>{{ fullRecord.ppdb?.siswa?.nik || '—' }}</b></div>
              <div><span class="text-slate-500 dark:text-neutral-400">Nama:</span> {{ fullRecord.santri }}</div>
              <div><span class="text-slate-500 dark:text-neutral-400">Gender:</span> {{ fullRecord.gender || '—' }}</div>
              <div class="sm:col-span-2"><span class="text-slate-500 dark:text-neutral-400">Alamat:</span> {{ fullRecord.alamat }}</div>
            </div>
          </div>

          <div class="rounded-lg border border-slate-200 dark:border-neutral-800 p-3">
            <h4 class="font-semibold mb-2">Orang Tua</h4>
            <div class="grid sm:grid-cols-2 gap-2 text-sm">
              <div><span class="text-slate-500 dark:text-neutral-400">Ayah:</span> {{ fullRecord.ppdb?.ortu?.ayah?.nama || '—' }}</div>
              <div><span class="text-slate-500 dark:text-neutral-400">Ibu:</span> {{ fullRecord.ppdb?.ortu?.ibu?.nama || '—' }}</div>
              <div class="sm:col-span-2"><span class="text-slate-500 dark:text-neutral-400">HP Ortu:</span> {{ fullRecord.ppdb?.ortu?.hp1 || '—' }}</div>
            </div>
          </div>

          <div class="rounded-lg border border-slate-200 dark:border-neutral-800 p-3">
            <h4 class="font-semibold mb-2">Pendidikan</h4>
            <div class="grid sm:grid-cols-2 gap-2 text-sm">
              <div><span class="text-slate-500 dark:text-neutral-400">Status:</span> {{ fullRecord.ppdb?.pendidikan?.status || '—' }}</div>
              <div><span class="text-slate-500 dark:text-neutral-400">Sekolah:</span> {{ fullRecord.ppdb?.pendidikan?.sekolah || '—' }}</div>
            </div>
          </div>
        </div>
        <template #footer>
          <button @click="showDetail=false" class="px-3 py-1.5 rounded border border-slate-200 hover:bg-slate-50 dark:hover:bg-neutral-800">Tutup</button>
        </template>
      </ModalShell>

      <!-- Modal: Konfirmasi Hapus -->
      <ModalShell v-model="showConfirm" title="Hapus Data">
        <p class="text-sm text-slate-700 dark:text-neutral-200">
          Hapus data <strong>{{ current?.santri }}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <template #footer>
          <button @click="showConfirm=false" class="px-3 py-1.5 rounded border border-slate-200 hover:bg-slate-50 dark:hover:bg-neutral-800">Batal</button>
          <button :disabled="deleting" @click="confirmDelete" class="px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60">
            {{ deleting ? 'Menghapus…' : 'Hapus' }}
          </button>
        </template>
      </ModalShell>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRuntimeConfig } from '#imports'
import { Icon } from '@iconify/vue'
import DataTable from '~/components/widget/DataTable.vue'
import ModalShell from '~/components/widget/ModalShell.vue'
import { useSantri, type SantriRow } from '~/composables/data/useSantri'
import { usePendaftaran } from '~/composables/data/usePendaftaran'

definePageMeta({ layout: 'app', layoutProps: { title: 'Pendaftaran' } })

const { rows, fetchSantri, updateSantri, deleteSantri, getSantriById } = useSantri()
const { settings, fetchSettings, saveSettings } = usePendaftaran()
const config = useRuntimeConfig()

const formUrl = computed(() => {
  const base = config.public.siteUrl || (process.client ? window.location.origin : '')
  return base ? new URL('/registration', base).toString() : '/registration'
})

const ppdbMode = ref<'putra' | 'putri'>('putra')
async function copy(t: string){ try { await navigator.clipboard.writeText(t) } catch {} }

const filters = reactive<{ q: string; jenjang: string }>({ q: '', jenjang: 'semua' })
const yearOptions = computed(() => {
  const ys = Array.from(new Set((rows.value || []).map(r => String(r.gen || '').trim()).filter(Boolean)))
  return ys.sort((a,b) => Number(b) - Number(a))
})
const selectedYear = ref<string>('')

onMounted(async () => {
  await Promise.all([fetchSantri(), fetchSettings()])
  const prefer = settings.value.year ? String(settings.value.year) : ''
  selectedYear.value = prefer || yearOptions.value[0] || new Date().getFullYear().toString()
  checkAutoClose()
})

let yearDebounce: any = null
watch(selectedYear, (y) => {
  if (!y) return
  if (yearDebounce) clearTimeout(yearDebounce)
  yearDebounce = setTimeout(() => saveSettings({ year: Number(y) }), 350)
})

function matchSearch(r: SantriRow, q: string) {
  if (!q) return true
  const s = q.toLowerCase()
  const hay = [
    r.santri, r.alamat, r.nohp, r.nik, r.ayahNama, r.ibuNama, r.ppdbCode
  ].map(v => String(v || '').toLowerCase()).join(' | ')
  return hay.includes(s)
}
function matchJenjang(r: SantriRow, jj: string) {
  if (jj === 'semua') return true
  return String(r.jenjang || '').toLowerCase() === jj.toLowerCase()
}

const isPutri = (r: SantriRow) => r.tipe === 'Putri' || String((r as any).gender).toUpperCase() === 'P'
const isPutra = (r: SantriRow) => r.tipe === 'Putra' || String((r as any).gender).toUpperCase() !== 'P'
const isCalon = (r: SantriRow) => String(r.status).toLowerCase() === 'nonaktif'
const isBaru  = (r: SantriRow) => !isCalon(r)

const baseFiltered = computed(() =>
  (rows.value || [])
    .filter(r => String(r.gen || '') === String(selectedYear.value || ''))
    .filter(r => matchSearch(r, filters.q))
    .filter(r => matchJenjang(r, filters.jenjang))
)

const jenjangOptions = computed(() => {
  const arr = (rows.value || [])
    .filter(r => String(r.gen || '') === String(selectedYear.value || ''))
    .map(r => String(r.jenjang || '').trim())
    .filter(Boolean)
  return Array.from(new Set(arr))
})

const putraFiltered = computed(() => baseFiltered.value.filter(isPutra))
const putriFiltered = computed(() => baseFiltered.value.filter(isPutri))
const calonPutraFiltered = computed(() => putraFiltered.value.filter(isCalon))
const baruPutraFiltered  = computed(() => putraFiltered.value.filter(isBaru))
const calonPutriFiltered = computed(() => putriFiltered.value.filter(isCalon))
const baruPutriFiltered  = computed(() => putriFiltered.value.filter(isBaru))

/** ===== Columns (Admin) ===== */
const columnsAdmin = [
  { key: 'ppdbCode',   label: 'No. Pendaftaran', sortable: true },
  { key: 'nik',        label: 'NIK', sortable: true },
  { key: 'santri',     label: 'Nama', sortable: true },
  { key: 'alamat',     label: 'Alamat', sortable: true },
  { key: 'ayahNama',   label: 'Nama Ayah', sortable: true },
  { key: 'ibuNama',    label: 'Nama Ibu', sortable: true },
  { key: 'nohp',       label: 'Nomor WA', sortable: true },
  { key: 'dokumen',    label: 'Dokumen', sortable: false, slot: 'dokumen' },
]

/** ===== Bulk actions ===== */
const savingBulk = ref(false)
async function approveBulk(ids: string[]) {
  if (!ids.length) return
  savingBulk.value = true
  try {
    for (const id of ids) {
      await updateSantri(id, { status: null as any }, { refresh: false })
    }
  } finally {
    savingBulk.value = false
    await fetchSantri()
  }
}

const savingBulkRevert = ref(false)
async function revertBulk(ids: string[]) {
  if (!ids.length) return
  savingBulkRevert.value = true
  try {
    for (const id of ids) {
      await updateSantri(id, { status: 'nonaktif', kamar: '-', maskan: '' }, { refresh: false })
    }
  } finally {
    savingBulkRevert.value = false
    await fetchSantri()
  }
}

async function approve(id: string) { await updateSantri(id, { status: null as any }) }
async function revertToCalon(id: string) { await updateSantri(id, { status: 'nonaktif', kamar: '-', maskan: '' }) }

/** ===== Edit Ringkas ===== */
const showForm = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const formError = ref<string | null>(null)
const saving = ref(false)
const current = ref<SantriRow | null>(null)
const form = reactive<Omit<SantriRow, 'id'>>({
  gen: new Date().getFullYear().toString(), santri: '', walisantri: '', nohp: '',
  kamar: '', alamat: '', status: 'nonaktif', jenjang: '', maskan: '', gender: 'L', tipe: 'Putra',
  ppdbCode: '', nik: '', ayahNama: '', ibuNama: '', dokumenCount: 0
} as any)

function openEdit(r: SantriRow) {
  formMode.value = 'edit'; current.value = r
  form.gen = String(r.gen || '')
  form.santri = r.santri || ''
  form.walisantri = r.walisantri || ''
  form.nohp = r.nohp || ''
  form.kamar = r.kamar || ''
  form.alamat = r.alamat || ''
  form.status = String(r.status ?? 'nonaktif')
  form.jenjang = r.jenjang || ''
  form.maskan = r.maskan || ''
  form.gender = (r as any).gender || ''
  form.tipe = (r as any).tipe || (form.gender==='P'?'Putri':'Putra')
  form.ppdbCode = r.ppdbCode || ''
  form.nik = r.nik || ''
  form.ayahNama = r.ayahNama || ''
  form.ibuNama = r.ibuNama || ''
  form.dokumenCount = r.dokumenCount || 0
  formError.value = null; showForm.value = true
}
async function saveRow(){
  if (!form.santri?.trim()) { formError.value = 'Nama santri wajib diisi.'; return }
  if (!form.gen?.trim())     { formError.value = 'Gen wajib diisi.'; return }
  saving.value = true
  try {
    if (formMode.value === 'edit' && current.value?.id) {
      await updateSantri(current.value.id, { ...form })
      showForm.value = false
    } else {
      formError.value = 'Mode tambah belum diaktifkan.'
    }
  } catch (e:any) {
    formError.value = e?.message ?? 'Gagal menyimpan data'
  } finally { saving.value = false }
}

/** ===== Hapus ===== */
const showConfirm = ref(false)
const deleting = ref(false)
function openConfirm(r: SantriRow){ current.value = r; showConfirm.value = true }
async function confirmDelete(){
  if (!current.value?.id) return
  deleting.value = true
  try { await deleteSantri(current.value.id); showConfirm.value = false } finally { deleting.value = false }
}

/** ===== Dokumen Modal ===== */
const showDocs = ref(false)
const docState = reactive<{ loading: boolean; dok: any | null }>({ loading: false, dok: null })
const activeDocTab = ref(0)
function buildViewerUrl(url: string) {
  const s = String(url || ''); if (!s) return ''
  if (s.includes('drive.google.com')) {
    const m = s.match(/\/file\/d\/([^/]+)\//); if (m?.[1]) return `https://drive.google.com/file/d/${m[1]}/preview`
    const id = s.match(/[?&]id=([^&]+)/)?.[1]; if (id) return `https://drive.google.com/file/d/${id}/preview`
  }
  if (/\.pdf(\?|$)/i.test(s)) return s
  return s
}
const docTabs = computed(() => {
  const d = docState.dok || {}
  const raw = [
    { key: 'kkUrl',     label: 'Kartu Keluarga',  url: d.kkUrl || '' },
    { key: 'akteUrl',   label: 'Akte Kelahiran',  url: d.akteUrl || '' },
    { key: 'ktpAyahUrl',label: 'KTP Ayah',        url: d.ktpAyahUrl || '' },
    { key: 'ktpIbuUrl', label: 'KTP Ibu',         url: d.ktpIbuUrl || '' },
  ].filter(it => !!it.url)

  return raw.map(it => {
    const url = String(it.url)
    const isImage = /\.(png|jpe?g|webp|gif|bmp|svg)(\?|$)/i.test(url)
    const isPdf   = /\.pdf(\?|$)/i.test(url) || url.includes('drive.google.com')
    return { ...it, isImage, isPdf, viewerUrl: isImage ? url : buildViewerUrl(url) }
  })
})
const currentTab = computed(() => docTabs.value[activeDocTab.value] || { url:'', isImage:false, isPdf:false, viewerUrl:'', label:'-' })
async function openDocs(id: string){
  showDocs.value = true
  activeDocTab.value = 0
  docState.loading = true
  docState.dok = null
  try {
    const full = await getSantriById(id)
    docState.dok = full?.dokumen || null
    if (activeDocTab.value >= docTabs.value.length) activeDocTab.value = 0
  } finally {
    docState.loading = false
  }
}

/** ===== Detail Lengkap ===== */
const showDetail = ref(false)
const detailState = reactive({ loading: false })
const fullRecord = ref<any | null>(null)
function openDetail(r: SantriRow) {
  showDetail.value = true
  detailState.loading = true
  fullRecord.value = null
  getSantriById(r.id).then(v => fullRecord.value = v).finally(() => detailState.loading = false)
}

/** ===== Export CSV (FULL FORM) ===== */
function flattenForCsv(rec: any){
  const s = rec?.ppdb?.siswa || {}
  const a = rec?.ppdb?.alamat || {}
  const p = rec?.ppdb?.pendidikan || {}
  const o = rec?.ppdb?.ortu || {}
  const w = rec?.ppdb?.wali || {}
  const d = rec?.dokumen || {}
  return {
    // meta
    id: rec?.id || '',
    ppdbCode: rec?.ppdbCode || '',
    gen: rec?.gen || '',
    createdAt: rec?.createdAt?._seconds ? new Date(rec.createdAt._seconds*1000).toISOString() : (typeof rec?.createdAt==='number'? new Date(rec.createdAt).toISOString() : ''),
    username: rec?.username || '',
    publicToken: rec?.publicToken || '',
    // siswa
    nama: rec?.santri || s?.nama || '',
    jk: rec?.gender || s?.jk || '',
    tmpLahir: s?.tmpLahir || '',
    tglLahir: s?.tglLahir || '',
    tinggi: s?.tinggi || '',
    berat: s?.berat || '',
    cita: s?.cita || '',
    hobi: s?.hobi || '',
    kk: s?.kk || '',
    nik: s?.nik || '',
    nisn: s?.nisn || '',
    // alamat
    alamat_jalan: a?.jalan || '',
    alamat_rt: a?.rt || '',
    alamat_rw: a?.rw || '',
    alamat_dusun: a?.dusun || '',
    alamat_desa: a?.desa || '',
    alamat_kec: a?.kec || '',
    alamat_kab: a?.kab || '',
    alamat_prov: a?.prov || '',
    alamat_kodepos: a?.kodepos || '',
    alamat_tinggal: a?.tinggal || '',
    alamat_singkat: rec?.alamat || '',
    // pendidikan
    pend_status: p?.status || '',
    pend_sekolah: p?.sekolah || '',
    pend_alamatSekolah: p?.alamatSekolah || '',
    pend_nonformal: Array.isArray(p?.nonformal)? p.nonformal.join('|') : '',
    pend_nfNama: p?.nfNama || '',
    pend_nfAlamat: p?.nfAlamat || '',
    // ortu
    ayah_nama: o?.ayah?.nama || '',
    ayah_status: o?.ayah?.status || '',
    ayah_pendidikan: o?.ayah?.pendidikan || '',
    ayah_pekerjaan: o?.ayah?.pekerjaan || '',
    ayah_penghasilan: o?.ayah?.penghasilan || '',
    ibu_nama: o?.ibu?.nama || '',
    ibu_status: o?.ibu?.status || '',
    ibu_pendidikan: o?.ibu?.pendidikan || '',
    ibu_pekerjaan: o?.ibu?.pekerjaan || '',
    ibu_penghasilan: o?.ibu?.penghasilan || '',
    // kontak
    hp1: o?.hp1 || rec?.nohp || '',
    hp2: o?.hp2 || '',
    // wali
    wali_nama: w?.nama || '',
    wali_status: w?.status || '',
    wali_pendidikan: w?.pendidikan || '',
    wali_pekerjaan: w?.pekerjaan || '',
    wali_penghasilan: w?.penghasilan || '',
    wali_hp: w?.hp || '',
    // dokumen URL
    dok_kk: d?.kkUrl || '',
    dok_akte: d?.akteUrl || '',
    dok_ktpAyah: d?.ktpAyahUrl || '',
    dok_ktpIbu: d?.ktpIbuUrl || '',
    dok_count: [d?.kkUrl,d?.akteUrl,d?.ktpAyahUrl,d?.ktpIbuUrl].filter(Boolean).length
  }
}
function toCSVFull(records: any[]){
  if (!records.length) return 'id\n'
  const flat = records.map(flattenForCsv)
  const headers = Object.keys(flat[0]!)
  const esc = (v:any) => { const s=String(v??''); const needs=/[",\n]/.test(s); const x=s.replace(/"/g,'""'); return needs?`"${x}"`:s }
  const head = headers.join(',')
  const body = flat.map(row => headers.map(h => esc((row as any)[h])).join(',')).join('\n')
  return head+'\n'+body
}
async function exportFullCSV(source: SantriRow[], filename: string) {
  // Ambil node lengkap supaya CSV benar-benar “full form”
  const store: any[] = []
  for (const r of source) {
    const full = await getSantriById(r.id)
    if (full) {
      full.id = r.id
      store.push(full)
    }
  }
  const csv = toCSVFull(store)
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
}

/** ===== Auto close ===== */
const isOpen = computed(() => !settings.value.isClosed)
const autoBadge = computed(() => {
  if (!settings.value.autoCloseEnabled || !settings.value.autoCloseAt) return ''
  const d = new Date(settings.value.autoCloseAt)
  const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), day = String(d.getDate()).padStart(2,'0')
  const hh = String(d.getHours()).padStart(2,'0'), mm = String(d.getMinutes()).padStart(2,'0')
  return `Auto • ${y}-${m}-${day} ${hh}:${mm}`
})
function toggleOpen(){ saveSettings({ isClosed: isOpen.value ? true : false }) }
const mergedYearOptions = computed(() => {
  const set = new Set<string>(yearOptions.value)
  if (settings.value.year) set.add(String(settings.value.year))
  return Array.from(set).sort((a,b) => Number(b)-Number(a))
})
const autoCloseLocal = computed(() => {
  const iso = settings.value.autoCloseAt; if (!iso) return ''
  const d = new Date(iso)
  const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), day = String(d.getDate()).padStart(2,'0')
  const hh = String(d.getHours()).padStart(2,'0'), mm = String(d.getMinutes()).padStart(2,'0')
  return `${y}-${m}-${day}T${hh}:${mm}`
})
function onAutoCloseChange(v: string) {
  if (!v) { saveSettings({ autoCloseAt: null }); return }
  const d = new Date(v); if (isNaN(d.getTime())) return
  saveSettings({ autoCloseAt: d.toISOString() })
}
const tick = ref(Date.now())
let timer: any = null
onMounted(() => { timer = setInterval(() => { tick.value = Date.now(); checkAutoClose() }, 30000) })
onUnmounted(() => { if (timer) clearInterval(timer) })
const msRemaining = computed(() => {
  if (!settings.value.autoCloseEnabled || !settings.value.autoCloseAt) return null
  return new Date(settings.value.autoCloseAt).getTime() - tick.value
})
const willAutoClose = computed(() => typeof msRemaining.value === 'number' && msRemaining.value > 0)
const countdownText = computed(() => {
  const ms = msRemaining.value; if (ms === null) return '-'
  if (ms <= 0) return 'Jadwal tercapai — akan ditutup'
  const sec = Math.floor(ms/1000)
  const d = Math.floor(sec/86400), h = Math.floor((sec%86400)/3600), m = Math.floor((sec%3600)/60)
  return `${d ? d+'h ' : ''}${String(h).padStart(2,'0')}j ${String(m).padStart(2,'0')}m`
})
const countdownClass = computed(() => {
  const ms = msRemaining.value
  if (ms === null) return 'text-slate-500 dark:text-neutral-400'
  if (ms <= 0) return 'text-rose-600 dark:text-rose-300'
  if (ms < 3*24*3600*1000) return 'text-amber-600 dark:text-amber-300'
  return ''
})
async function checkAutoClose() {
  if (!settings.value.autoCloseEnabled || !settings.value.autoCloseAt) return
  const due = new Date(settings.value.autoCloseAt).getTime()
  if (Date.now() >= due && !settings.value.isClosed) await saveSettings({ isClosed: true, autoCloseEnabled: false })
}
function atEndOfToday(): Date { const d = new Date(); d.setHours(23,59,0,0); return d }
function addDays(n: number): Date { const d = new Date(); d.setDate(d.getDate() + n); return d }
function pickTonight(){ saveSettings({ autoCloseAt: atEndOfToday().toISOString(), autoCloseEnabled: true }) }
function pickInDays(n:number){ const d = addDays(n); d.setHours(23,59,0,0); saveSettings({ autoCloseAt: d.toISOString(), autoCloseEnabled: true }) }
function clearSchedule(){ saveSettings({ autoCloseAt: null, autoCloseEnabled: false }) }
function testScheduleNow(){ const d = new Date(Date.now()+60_000); saveSettings({ autoCloseAt: d.toISOString(), autoCloseEnabled: true }) }
</script>
