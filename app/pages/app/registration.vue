<!-- pages/app/registration.vue -->
<template>
  <div class="min-h-full bg-transparent text-gray-800 dark:text-neutral-200">
    <div class="mx-auto max-w-[1720px] space-y-6 p-5 md:p-8 xl:p-10">
      <!-- HERO -->
      <section class="relative overflow-hidden rounded-[32px] border border-green-100 bg-gradient-to-br from-green-600 via-green-600 to-lime-500 p-5 text-white shadow-[0_24px_60px_-18px_rgba(22,163,74,0.35)] md:p-8">
        <div class="absolute inset-0 opacity-20">
          <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white blur-3xl"></div>
          <div class="absolute bottom-0 left-8 h-32 w-32 rounded-full bg-lime-100 blur-3xl"></div>
        </div>

        <div class="relative z-10 grid gap-5 xl:grid-cols-[1.2fr,0.8fr] xl:items-end">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
              <span class="inline-block h-2 w-2 rounded-full bg-lime-300"></span>
              PPDB Workspace • Semua Tahun
            </div>

            <h1 class="mt-4 text-2xl font-black tracking-tight md:text-4xl">
              Manajemen Pendaftaran Santri
            </h1>

            <p class="mt-3 max-w-2xl text-sm leading-6 text-green-50/95 md:text-base">
              Kelola calon santri putra dan putri, pantau status berkas, lihat detail formulir lengkap, terima pendaftar, dan ekspor data administrasi PPDB.
            </p>

            <div class="mt-5 flex flex-wrap gap-2">
              <span class="rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-semibold ring-1 ring-white/15">Detail form lengkap</span>
              <span class="rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-semibold ring-1 ring-white/15">Dokumen preview</span>
              <span class="rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-semibold ring-1 ring-white/15">Export CSV</span>
              <span class="rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-semibold ring-1 ring-white/15">Export Excel</span>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <div class="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
              <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-green-100">Total Data</div>
              <div class="mt-2 text-2xl font-black">{{ adminRows.length }}</div>
              <div class="mt-1 text-xs text-green-50/90">semua pendaftar</div>
            </div>

            <div class="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
              <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-green-100">Calon</div>
              <div class="mt-2 text-2xl font-black">{{ totalCalon }}</div>
              <div class="mt-1 text-xs text-green-50/90">menunggu verifikasi</div>
            </div>

            <div class="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
              <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-green-100">Diterima</div>
              <div class="mt-2 text-2xl font-black">{{ totalDiterima }}</div>
              <div class="mt-1 text-xs text-green-50/90">sudah menjadi santri baru</div>
            </div>
          </div>
        </div>
      </section>

      <!-- STATS -->
      <section class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <article class="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Calon Putra</p>
              <p class="mt-2 text-3xl font-black tracking-tight text-gray-900 dark:text-white">{{ calonPutraFiltered.length }}</p>
            </div>
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300">
              <ClientOnly><Icon icon="lucide:user-round" class="h-5 w-5" /></ClientOnly>
            </div>
          </div>
          <p class="mt-4 text-sm text-gray-500 dark:text-neutral-400">Pendaftar putra yang masih berstatus calon.</p>
        </article>

        <article class="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Santri Putra</p>
              <p class="mt-2 text-3xl font-black tracking-tight text-gray-900 dark:text-white">{{ baruPutraFiltered.length }}</p>
            </div>
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-green-600 text-white dark:bg-green-900/20">
              <ClientOnly><Icon icon="lucide:badge-check" class="h-5 w-5" /></ClientOnly>
            </div>
          </div>
          <p class="mt-4 text-sm text-gray-500 dark:text-neutral-400">Pendaftar putra yang sudah diterima.</p>
        </article>

        <article class="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Calon Putri</p>
              <p class="mt-2 text-3xl font-black tracking-tight text-gray-900 dark:text-white">{{ calonPutriFiltered.length }}</p>
            </div>
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300">
              <ClientOnly><Icon icon="lucide:user-round" class="h-5 w-5" /></ClientOnly>
            </div>
          </div>
          <p class="mt-4 text-sm text-gray-500 dark:text-neutral-400">Pendaftar putri yang masih berstatus calon.</p>
        </article>

        <article class="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Santri Putri</p>
              <p class="mt-2 text-3xl font-black tracking-tight text-gray-900 dark:text-white">{{ baruPutriFiltered.length }}</p>
            </div>
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
              <ClientOnly><Icon icon="lucide:badge-check" class="h-5 w-5" /></ClientOnly>
            </div>
          </div>
          <p class="mt-4 text-sm text-gray-500 dark:text-neutral-400">Pendaftar putri yang sudah diterima.</p>
        </article>
      </section>

      <!-- WORKSPACE ACTION - NOT STICKY -->
      <section class="rounded-[28px] border border-gray-200/80 bg-white/92 p-4 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/92">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 class="text-base font-bold text-gray-900 dark:text-white">Workspace Aksi</h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Kontrol status pendaftaran, filter, pencarian, serta export data.
            </p>
          </div>

          <div class="relative flex items-center justify-end">
            <button
              type="button"
              @click="workspaceMenuOpen = !workspaceMenuOpen"
              class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white transition hover:bg-white/25 lg:border-gray-200 lg:bg-white lg:text-gray-700 lg:hover:bg-gray-50 dark:lg:border-neutral-700 dark:lg:bg-neutral-900 dark:lg:text-neutral-200 dark:lg:hover:bg-neutral-800"
              aria-label="Menu workspace"
            >
              <ClientOnly>
                <Icon icon="lucide:ellipsis" class="h-5 w-5" />
              </ClientOnly>
            </button>

            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 scale-95 translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 translate-y-1"
            >
              <div
                v-if="workspaceMenuOpen"
                class="absolute right-0 top-13 z-30 w-72 overflow-hidden rounded-[24px] border border-gray-200 bg-white p-2 shadow-xl shadow-gray-900/10 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <NuxtLink
                  to="/registration"
                  target="_blank"
                  class="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="workspaceMenuOpen = false"
                >
                  <ClientOnly><Icon icon="lucide:external-link" class="h-4 w-4 text-green-600" /></ClientOnly>
                  Buka Form
                </NuxtLink>

                <button
                  type="button"
                  @click="copy(formUrl); workspaceMenuOpen = false"
                  class="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <ClientOnly><Icon icon="lucide:copy" class="h-4 w-4 text-green-600" /></ClientOnly>
                  Salin Link Form
                </button>

                <div class="my-1 h-px bg-gray-100 dark:bg-neutral-800"></div>

                <button
                  type="button"
                  :disabled="exportBusy"
                  @click="exportRows(activeModeRows, `ppdb_semua_data`, 'csv'); workspaceMenuOpen = false"
                  class="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <ClientOnly><Icon icon="lucide:file-down" class="h-4 w-4 text-green-600" /></ClientOnly>
                  Export CSV
                </button>

                <button
                  type="button"
                  :disabled="exportBusy"
                  @click="exportRows(activeModeRows, `ppdb_semua_data`, 'excel'); workspaceMenuOpen = false"
                  class="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <ClientOnly><Icon icon="lucide:sheet" class="h-4 w-4 text-green-600" /></ClientOnly>
                  Export Excel
                </button>

                <div class="my-1 h-px bg-gray-100 dark:bg-neutral-800"></div>

                <button
                  v-if="!isOpen"
                  type="button"
                  @click="saveSettings({ isClosed: false }); workspaceMenuOpen = false"
                  class="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-green-700 transition hover:bg-green-50 dark:text-green-300 dark:hover:bg-green-900/10"
                >
                  <ClientOnly><Icon icon="ph:door-open" class="h-4 w-4" /></ClientOnly>
                  Buka PPDB
                </button>

                <button
                  v-else
                  type="button"
                  @click="saveSettings({ isClosed: true }); workspaceMenuOpen = false"
                  class="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-rose-700 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-900/10"
                >
                  <ClientOnly><Icon icon="ph:door" class="h-4 w-4" /></ClientOnly>
                  Tutup PPDB
                </button>
              </div>
            </Transition>
          </div>
        </div>

        <div class="mt-4 grid gap-3 xl:grid-cols-[auto,1fr]">
          <div v-if="!usingCustomForm" class="grid gap-3 sm:grid-cols-2">
            <div class="grid grid-cols-2 gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
              <button
                type="button"
                @click="ppdbMode = 'putra'"
                class="rounded-xl px-3 py-2 text-sm font-black transition"
                :class="ppdbMode === 'putra'
                  ? 'bg-white text-gray-950 shadow-sm dark:bg-neutral-200'
                  : 'text-gray-500 dark:text-neutral-300'"
              >
                Putra
              </button>

              <button
                type="button"
                @click="ppdbMode = 'putri'"
                class="rounded-xl px-3 py-2 text-sm font-black transition"
                :class="ppdbMode === 'putri'
                  ? 'bg-white text-gray-950 shadow-sm dark:bg-neutral-200'
                  : 'text-gray-500 dark:text-neutral-300'"
              >
                Putri
              </button>
            </div>

            <select v-if="!usingCustomForm"
              v-model="filters.jenjang"
              class="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="semua">Semua Jenjang</option>
              <option v-for="j in jenjangOptions" :key="j" :value="j">{{ j }}</option>
            </select>
          </div>

          <div class="relative xl:col-span-2">
            <ClientOnly>
              <Icon icon="lucide:search" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </ClientOnly>

            <input
              v-model.trim="filters.q"
              type="text"
              :placeholder="usingCustomForm
                ? 'Cari data pendaftaran, kode, atau isi form custom...'
                : 'Cari nama, NIK, alamat, ayah, ibu, no HP, kode pendaftaran...'"
              class="block w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>
        </div>

        <div class="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span
            class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold"
            :class="isOpen
              ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'"
          >
            <ClientOnly><Icon :icon="isOpen ? 'ph:lock-open' : 'ph:lock'" class="h-3.5 w-3.5" /></ClientOnly>
            {{ isOpen ? 'Pendaftaran dibuka' : 'Pendaftaran ditutup' }}
          </span>

          <span
            v-if="autoBadge"
            class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
          >
            <ClientOnly><Icon icon="lucide:clock" class="h-3.5 w-3.5" /></ClientOnly>
            {{ autoBadge }}
          </span>

          <span class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 font-semibold text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
            <ClientOnly><Icon icon="lucide:filter" class="h-3.5 w-3.5" /></ClientOnly>
            {{ activeModeRows.length }} data tampil dari {{ adminRows.length }} total
          </span>

          <span v-if="exportBusy" class="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-300">
            <ClientOnly><Icon icon="mingcute:loading-fill" class="h-3.5 w-3.5 animate-spin" /></ClientOnly>
            Menyiapkan export...
          </span>
        </div>

        <div
          v-if="settings.autoCloseEnabled"
          class="mt-4 grid gap-3 rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60 lg:grid-cols-[1fr,auto]"
        >
          <div  class="grid gap-3 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                Jadwal Tutup Otomatis
              </label>

              <input
                type="datetime-local"
                :value="autoCloseLocal"
                @change="onAutoCloseChange(($event.target as HTMLInputElement).value)"
                class="block w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                Sisa Waktu
              </label>

              <div class="rounded-2xl bg-white px-4 py-3 text-sm font-black dark:bg-neutral-900" :class="countdownClass">
                {{ countdownText }}
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-end gap-2">
            <button @click="pickTonight" class="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800">23:59</button>
            <button @click="pickInDays(3)" class="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800">+3 hari</button>
            <button @click="pickInDays(7)" class="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800">+7 hari</button>
            <button @click="clearSchedule" class="rounded-2xl border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10">Hapus</button>
          </div>
        </div>

        <div class="mt-4">
          <div class="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
            <button
              type="button"
              @click="saveSettings({ autoCloseEnabled: false })"
              class="rounded-xl px-4 py-2 text-sm font-black transition"
              :class="!settings.autoCloseEnabled
                ? 'bg-white text-gray-950 shadow-sm dark:bg-neutral-200'
                : 'text-gray-500 dark:text-neutral-300'"
            >
              Manual
            </button>

            <button
              type="button"
              @click="saveSettings({ autoCloseEnabled: true })"
              class="rounded-xl px-4 py-2 text-sm font-black transition"
              :class="settings.autoCloseEnabled
                ? 'bg-white text-gray-950 shadow-sm dark:bg-neutral-200'
                : 'text-gray-500 dark:text-neutral-300'"
            >
              Otomatis
            </button>
          </div>
        </div>
      </section>

      <!-- TABLE GROUPS -->
      <section
        v-for="group in tableGroups"
        :key="group.key"
        class="rounded-[30px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div class="flex items-center gap-2">
              <div
                class="grid h-10 w-10 place-items-center rounded-2xl"
                :class="group.tone === 'candidate'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
                  : 'bg-green-600 text-white dark:bg-green-900/20'"
              >
                <ClientOnly>
                  <Icon :icon="group.tone === 'candidate' ? 'lucide:user-clock' : 'lucide:badge-check'" class="h-5 w-5" />
                </ClientOnly>
              </div>

              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ group.title }}</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">{{ group.subtitle }}</p>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <label
              class="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <input
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500 dark:border-neutral-700 dark:bg-neutral-900"
                :checked="isGroupFullySelected(group.rows)"
                :indeterminate.prop="isGroupPartiallySelected(group.rows)"
                :disabled="!group.rows.length"
                @change="toggleGroupDeleteSelection(group.rows)"
              />
              Pilih Semua
            </label>

            <button
              type="button"
              :disabled="!selectedCountInGroup(group.rows) || bulkDeleting"
              @click="openBulkDeleteSelected(group.rows)"
              class="inline-flex items-center justify-center rounded-2xl border border-rose-200 bg-white px-4 py-2.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
            >
              <ClientOnly><Icon icon="lucide:trash-2" class="mr-2 h-4 w-4" /></ClientOnly>
              Hapus Terpilih ({{ selectedCountInGroup(group.rows) }})
            </button>

            <button
              type="button"
              :disabled="!group.rows.length || bulkDeleting"
              @click="openBulkDeleteGroup(group)"
              class="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
            >
              <ClientOnly><Icon icon="lucide:trash" class="mr-2 h-4 w-4" /></ClientOnly>
              Hapus Semua
            </button>
            <button
              @click="group.bulkAction()"
              :disabled="!group.rows.length || group.bulkSaving"
              class="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-xs font-semibold text-white transition disabled:opacity-60"
              :class="group.tone === 'candidate' ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'"
            >
              <ClientOnly><Icon :icon="group.tone === 'candidate' ? 'lucide:check-check' : 'lucide:undo-2'" class="mr-2 h-4 w-4" /></ClientOnly>
              {{ group.bulkLabel }} ({{ group.rows.length }})
            </button>

            <button
              :disabled="exportBusy"
              @click="exportRows(group.rows, group.exportName.replace('.csv', ''), 'csv')"
              class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <ClientOnly><Icon icon="lucide:file-down" class="mr-2 h-4 w-4" /></ClientOnly>
              CSV
            </button>

            <button
              :disabled="exportBusy"
              @click="exportRows(group.rows, group.exportName.replace('.csv', ''), 'excel')"
              class="inline-flex items-center justify-center rounded-2xl border border-green-200 bg-green-50 px-4 py-2.5 text-xs font-semibold text-green-700 transition hover:bg-green-100 disabled:opacity-60 dark:border-green-900/40 dark:bg-green-900/10 dark:text-green-300"
            >
              <ClientOnly><Icon icon="lucide:sheet" class="mr-2 h-4 w-4" /></ClientOnly>
              Excel
            </button>
          </div>
        </div>

        <div class="mt-5 overflow-x-auto max-w-full rounded-[26px] border border-gray-200 dark:border-neutral-800">
          <DataTable
            :show-actions="true"
            :title="group.title"
            :rows="group.rows"
            :show-page-size="true"
            :columns="columnsAdmin"
            :rowKey="(r) => r.id"
            :selectable="false"
            :export-filename="group.exportName.replace('.csv', '')"
          >
            <template #cell-select="{ row }">
              <label class="inline-flex cursor-pointer items-center justify-center">
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500 dark:border-neutral-700 dark:bg-neutral-900"
                  :checked="isRowSelectedForDelete(row)"
                  @click.stop
                  @change="toggleDeleteSelection(row)"
                />
              </label>
            </template>
            <template #cell-dokumen="{ row }">
              <span
                class="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold"
                :class="getRowDocCount(row) >= 4
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'"
              >
                {{ getRowDocCount(row) }}/4
              </span>
            </template>

            <template #cell-action="{ row }">
              <div class="flex flex-wrap items-center justify-end gap-2">
                <button
                  @click="openDetail(row)"
                  class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700"
                >
                  Detail
                </button>

                <button
                  @click="openEdit(row)"
                  class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  Edit
                </button>

                <button
                  @click="openDocs(row.id, row)"
                  class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  Dokumen
                </button>

                <button
                  v-if="group.tone === 'candidate'"
                  @click="approve(row.id)"
                  class="inline-flex items-center justify-center rounded-2xl border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 transition hover:bg-green-100 dark:border-green-900/40 dark:bg-green-900/10 dark:text-green-300"
                >
                  Terima
                </button>

                <button
                  v-else
                  @click="revertToCalon(row.id)"
                  class="inline-flex items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-300"
                >
                  Jadikan Calon
                </button>

                <button
                  @click="openConfirm(row)"
                  class="inline-flex items-center justify-center rounded-2xl border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
                >
                  Hapus
                </button>
              </div>
            </template>
          </DataTable>
        </div>
      </section>

      <section
        v-if="usingCustomForm && !activeModeRows.length"
        class="rounded-[30px] border border-amber-200 bg-amber-50 p-6 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-200"
      >
        <div class="flex gap-3">
          <ClientOnly>
            <Icon icon="lucide:info" class="mt-0.5 h-5 w-5 shrink-0" />
          </ClientOnly>

          <div>
            <h3 class="font-black">Data custom belum tampil</h3>
            <p class="mt-1 text-sm leading-6">
              Data mungkin masih tersaring oleh tahun aktif atau belum memiliki snapshot custom field.
              Coba cek tahun pendaftaran, pastikan data tersimpan dengan <code>formMode: custom</code>,
              <code>customData</code>, atau <code>ppdb.custom.values</code>.
            </p>
          </div>
        </div>
      </section>

      <!-- INSIGHT -->
      <section class="grid gap-5 xl:grid-cols-2">
        <article class="rounded-[30px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Distribusi Status</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Pantau rasio calon dan santri baru.</p>
            </div>
            <div class="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-300">
              Insight
            </div>
          </div>

          <div class="mt-5 space-y-4">
            <div v-for="item in statusSummary" :key="item.key" class="space-y-2">
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm font-semibold text-gray-700 dark:text-neutral-200">{{ item.label }}</span>
                <span class="text-sm font-black text-gray-900 dark:text-white">{{ item.count }}</span>
              </div>
              <div class="h-2 rounded-full bg-gray-200 dark:bg-neutral-800">
                <div class="h-2 rounded-full" :class="item.barClass" :style="{ width: item.width }"></div>
              </div>
            </div>
          </div>
        </article>

        <article class="rounded-[30px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Catatan Operasional</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Checklist admin sebelum penerimaan final.</p>
            </div>
          </div>

          <div class="mt-5 space-y-3">
            <div class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
              <div class="flex items-start gap-3">
                <div class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <ClientOnly><Icon icon="lucide:file-check-2" class="h-5 w-5" /></ClientOnly>
                </div>
                <div>
                  <div class="text-sm font-bold text-gray-900 dark:text-white">Cek kelengkapan dokumen</div>
                  <div class="mt-1 text-sm text-gray-600 dark:text-neutral-300">Pastikan KK, Akta, KTP Ayah, dan KTP Ibu sudah tampil sebelum diterima.</div>
                </div>
              </div>
            </div>

            <div class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
              <div class="flex items-start gap-3">
                <div class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                  <ClientOnly><Icon icon="lucide:phone-call" class="h-5 w-5" /></ClientOnly>
                </div>
                <div>
                  <div class="text-sm font-bold text-gray-900 dark:text-white">Validasi nomor wali</div>
                  <div class="mt-1 text-sm text-gray-600 dark:text-neutral-300">Gunakan nomor WA aktif untuk follow-up pembayaran dan pengumuman.</div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      <!-- EDIT MODAL -->
      <ModalShell size="3xl" v-model="showForm" :title="formMode === 'edit' ? 'Ubah Data Ringkas' : 'Tambah Pendaftar'">
        <form class="space-y-4 max-h-[65vh] overflow-y-auto pr-1" @submit.prevent="saveRow">
          <div class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
            <div class="flex items-start gap-3">
              <div class="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <ClientOnly><Icon icon="lucide:user-cog" class="h-5 w-5" /></ClientOnly>
              </div>
              <div>
                <div class="text-sm font-bold text-gray-900 dark:text-white">Edit data ringkas</div>
                <div class="mt-1 text-sm text-gray-600 dark:text-neutral-300">Untuk data formulir lengkap, gunakan tombol Detail pada tabel.</div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Gen</label>
              <input v-model.trim="form.gen" required class="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Nama Santri</label>
              <input v-model.trim="form.santri" required class="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">No. HP</label>
              <input v-model.trim="form.nohp" class="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Jenjang</label>
              <input v-model.trim="form.jenjang" class="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
            </div>

            <div class="sm:col-span-2">
              <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Alamat</label>
              <textarea v-model.trim="form.alamat" rows="3" class="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"></textarea>
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Gender</label>
              <select v-model="form.gender" class="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-white">
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Status</label>
              <select v-model="form.status" class="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-white">
                <option value="nonaktif">nonaktif / Calon</option>
                <option value="">Diterima</option>
              </select>
            </div>
          </div>

          <p v-if="formError" class="text-sm text-rose-600">{{ formError }}</p>
        </form>

        <template #footer>
          <button @click="showForm=false" class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800">Batal</button>
          <button :disabled="saving" @click="saveRow" class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60">
            {{ saving ? 'Menyimpan…' : formMode === 'edit' ? 'Update' : 'Simpan' }}
          </button>
        </template>
      </ModalShell>

      <!-- DOCS MODAL -->
      <ModalShell size="7xl" v-model="showDocs" title="Dokumen Pendaftar">
        <div class="space-y-4 max-h-[78vh] overflow-y-auto">
          <div v-if="docState.loading" class="rounded-2xl bg-gray-50 p-6 text-sm text-gray-500 dark:bg-neutral-800 dark:text-neutral-400">
            Memuat dokumen…
          </div>

          <div v-else-if="docState.error" class="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300">
            {{ docState.error }}
          </div>

          <div v-else-if="!docTabs.length" class="rounded-2xl bg-gray-50 p-6 text-sm text-gray-500 dark:bg-neutral-800 dark:text-neutral-400">
            Tidak ada dokumen. Pastikan data pendaftar memiliki field <code>dokumen.kk.url</code>, <code>dokumen.akte.url</code>, <code>dokumen.ktpAyah.url</code>, atau format lama <code>kkUrl</code>.
          </div>

          <div v-else>
            <div class="overflow-x-auto">
              <nav class="flex min-w-max items-center gap-1 rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-800 dark:bg-neutral-800">
                <button
                  v-for="(t, i) in docTabs"
                  :key="t.key"
                  @click="activeDocTab = i"
                  class="rounded-xl px-3 py-2 text-sm font-semibold transition"
                  :class="activeDocTab === i
                    ? 'bg-white text-gray-950 shadow-sm dark:bg-neutral-200'
                    : 'text-gray-500 hover:text-gray-900 dark:text-neutral-300'"
                >
                  {{ t.label }}
                </button>
              </nav>
            </div>

            <div class="mt-4 overflow-hidden rounded-[26px] border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
              <div class="p-3">
                <div v-if="currentTab.isImage" class="grid min-h-[64vh] w-full place-items-center rounded-2xl bg-gray-50 dark:bg-neutral-950">
                  <img :src="currentTab.url" alt="" class="max-h-[64vh] max-w-full rounded-2xl object-contain" @error="() => {}" />
                </div>

                <div v-else-if="currentTab.isPdf" class="h-[70vh] w-full">
                  <iframe :src="currentTab.viewerUrl" class="h-full w-full rounded-2xl bg-white" allowfullscreen loading="lazy"></iframe>
                </div>

                <div v-else class="rounded-2xl bg-gray-50 p-6 text-sm text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
                  File tidak dapat dipratinjau.
                  <a :href="currentTab.url" target="_blank" class="font-semibold text-green-700 underline decoration-dotted">Buka di tab baru</a>.
                </div>
              </div>

              <div class="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 px-4 py-3 text-xs dark:border-neutral-800">
                <p class="font-semibold text-gray-500 dark:text-neutral-400">{{ currentTab.label }}</p>

                <div class="flex items-center gap-2">
                  <a :href="currentTab.url" target="_blank" class="rounded-2xl border border-gray-200 px-3 py-2 font-semibold hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800">Buka</a>
                  <a :href="currentTab.url" download class="rounded-2xl bg-green-600 px-3 py-2 font-semibold text-white hover:bg-green-700">Unduh</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <button @click="showDocs=false" class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800">Tutup</button>
        </template>
      </ModalShell>

      <!-- DETAIL MODAL -->
      <ModalShell size="7xl" v-model="showDetail" title="Detail Formulir Pendaftaran">
        <div v-if="detailState.loading" class="rounded-2xl bg-gray-50 p-6 text-sm text-gray-500 dark:bg-neutral-800 dark:text-neutral-400">
          Memuat detail pendaftaran…
        </div>

        <div v-else-if="detailState.error" class="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300">
          {{ detailState.error }}
        </div>

        <div v-else-if="!fullRecord" class="rounded-2xl bg-gray-50 p-6 text-sm text-gray-500 dark:bg-neutral-800 dark:text-neutral-400">
          Data tidak tersedia.
        </div>

        <div v-else class="max-h-[78vh] overflow-y-auto pr-1">
          <div class="space-y-5">
            <section class="overflow-hidden rounded-[28px] border border-green-100 bg-green-600 p-5 text-white shadow-sm dark:border-green-900/40">
              <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p class="text-xs font-black uppercase tracking-[0.18em] text-green-100">No. Pendaftaran</p>
                  <h3 class="mt-1 font-mono text-2xl font-black">{{ fullRecord.ppdbCode || '—' }}</h3>
                  <p class="mt-2 text-sm text-green-50">
                    {{ usingCustomForm ? getDisplayName(fullRecord) : fullRecord.santri || detailValue(detailSiswa.nama) }}
                  </p>
                </div>

                <div class="flex flex-wrap gap-2">
                  <span class="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold ring-1 ring-white/20">
                    {{ fullRecord.gender === 'P' ? 'Putri' : 'Putra' }}
                  </span>
                  <span class="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold ring-1 ring-white/20">
                    {{ isCalon(fullRecord) ? 'Calon' : 'Diterima' }}
                  </span>
                  <span class="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold ring-1 ring-white/20">
                    {{ detailCreatedAt }}
                  </span>
                </div>
              </div>
            </section>

            <section class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <article
                v-for="item in detailQuickSummary"
                :key="item.label"
                class="rounded-[22px] border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <p class="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">{{ item.label }}</p>
                <p class="mt-2 break-words text-sm font-bold text-gray-950 dark:text-white">{{ item.value }}</p>
              </article>
            </section>

            <section class="grid gap-4 xl:grid-cols-2">
              <article
                v-for="section in detailSections"
                :key="section.key"
                class="rounded-[28px] border border-gray-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div class="flex items-start gap-3">
                  <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    <ClientOnly><Icon :icon="section.icon" class="h-5 w-5" /></ClientOnly>
                  </div>

                  <div>
                    <h4 class="text-base font-black text-gray-950 dark:text-white">{{ section.title }}</h4>
                    <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">{{ section.subtitle }}</p>
                  </div>
                </div>

                <div class="mt-4 grid gap-3 sm:grid-cols-2">
                  <div
                    v-for="row in section.rows"
                    :key="`${section.key}-${row.label}`"
                    :class="row.wide ? 'sm:col-span-2' : ''"
                    class="rounded-2xl bg-gray-50 p-3 dark:bg-neutral-800/70"
                  >
                    <p class="text-[11px] font-black uppercase tracking-[0.14em] text-gray-400 dark:text-neutral-500">
                      {{ row.label }}
                    </p>
                    <p class="mt-1 whitespace-pre-line break-words text-sm font-semibold text-gray-900 dark:text-white">
                      {{ row.value }}
                    </p>
                  </div>
                </div>
              </article>
            </section>

            <section class="rounded-[28px] border border-gray-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div class="flex items-start gap-3">
                  <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    <ClientOnly><Icon icon="lucide:folder-check" class="h-5 w-5" /></ClientOnly>
                  </div>

                  <div>
                    <h4 class="text-base font-black text-gray-950 dark:text-white">Dokumen Pendaftar</h4>
                    <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">Berkas yang dikirim dari form pendaftaran.</p>
                  </div>
                </div>

                <button
                  type="button"
                  @click="fullRecord?.id && openDocs(fullRecord.id, fullRecord)"
                  class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  <ClientOnly><Icon icon="lucide:eye" class="mr-2 h-4 w-4" /></ClientOnly>
                  Lihat Dokumen
                </button>
              </div>

              <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div
                  v-for="item in detailDocSummary"
                  :key="item.label"
                  class="rounded-2xl bg-gray-50 p-3 dark:bg-neutral-800/70"
                >
                  <p class="text-[11px] font-black uppercase tracking-[0.14em] text-gray-400 dark:text-neutral-500">{{ item.label }}</p>
                  <p class="mt-1 text-sm font-bold" :class="item.ready ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300'">
                    {{ item.ready ? 'Tersedia' : 'Belum Ada' }}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <template #footer>
          <button
            @click="showDetail=false"
            class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Tutup
          </button>

          <button
            v-if="fullRecord?.id"
            @click="openDocs(fullRecord.id, fullRecord)"
            class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Lihat Dokumen
          </button>
        </template>
      </ModalShell>

      <!-- DELETE MODAL -->
      <ModalShell v-model="showBulkDeleteConfirm" title="Hapus Banyak Data">
        <div class="space-y-4 text-sm">
          <div class="rounded-[22px] border border-rose-200 bg-rose-50 p-4 text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300">
            Data yang dihapus tidak dapat dikembalikan. Pastikan data yang dipilih sudah benar.
          </div>

          <div class="rounded-[22px] bg-gray-50 p-4 dark:bg-neutral-800">
            <p class="font-bold text-gray-900 dark:text-white">
              {{ bulkDeleteTitle }}
            </p>
            <p class="mt-1 text-gray-600 dark:text-neutral-300">
              Total data yang akan dihapus:
              <strong>{{ bulkDeleteRows.length }}</strong>
            </p>
          </div>

          <div
            v-if="bulkDeleteRows.length"
            class="max-h-52 space-y-2 overflow-y-auto rounded-[22px] border border-gray-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div
              v-for="row in bulkDeleteRows"
              :key="row.id"
              class="flex items-center justify-between gap-3 rounded-2xl bg-gray-50 px-3 py-2 dark:bg-neutral-800"
            >
              <span class="truncate text-sm font-semibold text-gray-800 dark:text-neutral-200">
                {{ getDisplayName(row) }}
              </span>
              <span class="shrink-0 font-mono text-xs text-gray-400">
                {{ row.ppdbCode || row.id }}
              </span>
            </div>
          </div>
        </div>

        <template #footer>
          <button
            @click="showBulkDeleteConfirm = false"
            class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Batal
          </button>

          <button
            :disabled="bulkDeleting || !bulkDeleteRows.length"
            @click="confirmBulkDelete"
            class="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
          >
            {{ bulkDeleting ? 'Menghapus…' : `Hapus ${bulkDeleteRows.length} Data` }}
          </button>
        </template>
      </ModalShell>

      <ModalShell v-model="showConfirm" title="Hapus Data">
        <div class="space-y-4 text-sm">
          <div class="rounded-[22px] border border-rose-200 bg-rose-50 p-4 text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300">
            Data yang dihapus tidak dapat dikembalikan.
          </div>

          <p class="text-gray-700 dark:text-neutral-200">
            Hapus data <strong>{{ getDisplayName(current) }}</strong>?
          </p>
        </div>

        <template #footer>
          <button @click="showConfirm=false" class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800">Batal</button>
          <button :disabled="deleting" @click="confirmDelete" class="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60">
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
import {
  normalizeCustomRegistrationFields,
  type CustomRegistrationField
} from '~/composables/data/useRegistrationForm'

definePageMeta({ layout: 'app', layoutProps: { title: 'Pendaftaran' } })

const { rows, fetchSantri, updateSantri, deleteSantri, getSantriById } = useSantri()
const { settings, fetchSettings, saveSettings } = usePendaftaran()
const config = useRuntimeConfig()

const formUrl = computed(() => {
  const base = String(config.public.siteUrl || (import.meta.client ? window.location.origin : ''))
  return base ? new URL('/registration', base).toString() : '/registration'
})

const ppdbMode = ref<'putra' | 'putri'>('putra')
const workspaceMenuOpen = ref(false)
const exportBusy = ref(false)

async function copy(t: string) {
  try {
    await navigator.clipboard.writeText(t)
  } catch {}
}

/** ===== Filter ===== */
const filters = reactive<{ q: string; jenjang: string }>({ q: '', jenjang: 'semua' })

const yearOptions = computed(() => {
  const ys = Array.from(
    new Set((adminRows.value || []).map((r) => String(r.gen || '').trim()).filter(Boolean))
  )
  return ys.sort((a, b) => Number(b) - Number(a))
})

const selectedYear: any = ref<string>('')

function pickValue(...values: any[]) {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== '') return value
  }

  return ''
}

function isCustomRecord(record: any) {
  return (
    record?.formMode === 'custom' ||
    record?.registrationMode === 'custom' ||
    record?.ppdb?.custom?.mode === 'custom' ||
    !!record?.customData ||
    !!record?.ppdb?.custom?.values
  )
}

function getRecordCustomValues(record: any) {
  return {
    ...(record?.customData || {}),
    ...(record?.ppdb?.custom?.values || {}),
    ...(record?.custom || {}),
    ...(record?.formData || {}),
    ...(record?.registrationData || {})
  }
}

function getRecordCustomFields(record: any) {
  const fields = pickValue(
    record?.customFieldsSnapshot,
    record?.ppdb?.custom?.fields,
    record?.customFields,
    []
  )

  return normalizeCustomRegistrationFields(Array.isArray(fields) ? fields : [])
    .filter((field: any) => field.enabled !== false)
    .sort((a: any, b: any) => Number(a.order || 0) - Number(b.order || 0))
}

const hasCustomRows = computed(() => {
  return (rows.value || []).some((row: any) => isCustomRecord(row))
})

const usingCustomForm = computed(() => {
  return (
    settings.value?.formMode === 'custom' ||
    hasCustomRows.value
  )
})

const activeCustomFields = computed<CustomRegistrationField[]>(() => {
  const settingFields = Array.isArray((settings.value as any)?.customFields)
    ? (settings.value as any).customFields
    : []

  if (settingFields.length) {
    return normalizeCustomRegistrationFields(settingFields)
      .filter((field: any) => field.enabled !== false)
      .sort((a: any, b: any) => Number(a.order || 0) - Number(b.order || 0))
  }

  const firstCustomRow = (rows.value || []).find((row: any) => {
    return getRecordCustomFields(row).length > 0
  })

  if (firstCustomRow) {
    return getRecordCustomFields(firstCustomRow)
  }

  return []
})

const tableCustomFields = computed<CustomRegistrationField[]>(() => {
  return activeCustomFields.value
    .filter((field: any) => field.type !== 'file')
    .slice(0, 5)
})

const detailCustomFields = computed<CustomRegistrationField[]>(() => {
  return activeCustomFields.value
})

function safeColumnKey(value: any) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'field'
}

function customColumnKey(field: CustomRegistrationField) {
  return `custom_${safeColumnKey(field.key || field.id || field.label)}`
}

function normalizeGenderValue(value: any) {
  const raw = String(value || '').trim().toLowerCase()

  if (!raw) return ''
  if (['p', 'putri', 'perempuan', 'wanita'].includes(raw)) return 'P'
  if (['l', 'putra', 'laki-laki', 'laki laki', 'pria'].includes(raw)) return 'L'

  return raw.includes('perempuan') || raw.includes('putri') ? 'P' : 'L'
}

function getCustomStorage(record: any) {
  return getRecordCustomValues(record)
}

function getFieldsForRecord(record: any) {
  const rowFields = getRecordCustomFields(record)

  if (rowFields.length) return rowFields

  return activeCustomFields.value
}

function getTableFieldsForRecord(record: any) {
  return getFieldsForRecord(record)
    .filter((field: any) => field.type !== 'file')
    .slice(0, 5)
}

function getMappedValue(record: any, mapTo?: string) {
  const s = record?.ppdb?.siswa || {}
  const a = record?.ppdb?.alamat || {}
  const p = record?.ppdb?.pendidikan || {}
  const o = record?.ppdb?.ortu || {}
  const ayah = o?.ayah || {}
  const ibu = o?.ibu || {}
  const wali = record?.ppdb?.wali || {}

  const alamatLengkap = [
    a?.jalan,
    a?.rt ? `RT ${a.rt}` : '',
    a?.rw ? `RW ${a.rw}` : '',
    a?.dusun,
    a?.desa,
    a?.kec,
    a?.kab,
    a?.prov,
    a?.kodepos
  ].filter(Boolean).join(', ')

  switch (mapTo) {
    case 'nama':
      return pickValue(record?.santri, s?.nama)

    case 'nohp':
      return pickValue(record?.nohp, record?.hpOrtu1, o?.hp1, wali?.hp)

    case 'tmpLahir':
      return pickValue(s?.tmpLahir, record?.tmpLahir, record?.tempatLahir)

    case 'tglLahir':
      return pickValue(s?.tglLahir, record?.tglLahir, record?.tanggalLahir)

    case 'tanggal':
      return pickValue(record?.tanggal, record?.createdAt)

    case 'jk':
      return pickValue(record?.gender, record?.jk, s?.jk)

    case 'alamat':
      return pickValue(record?.alamat, alamatLengkap)

    case 'asalSekolah':
      return pickValue(record?.asalSekolah, p?.sekolah)

    case 'tujuan':
      return pickValue(record?.tujuan, record?.jenjang, p?.tujuan)

    case 'pendidikan':
      return pickValue(record?.jenjang, p?.status, p?.pendidikan)

    case 'namaOrtu':
      return pickValue(record?.walisantri, record?.waliNama, wali?.nama, ayah?.nama, ibu?.nama)

    default:
      return ''
  }
}

function getCustomFieldValue(record: any, field: CustomRegistrationField) {
  const storage = getCustomStorage(record)
  const key = String(field.key || '').trim()

  return pickValue(
    key ? storage[key] : '',
    key ? record?.[key] : ''
  )
}

function firstReadableCustomValue(record: any) {
  for (const field of activeCustomFields.value) {
    if (field.type === 'file') continue

    const value = formatCustomValue(getCustomFieldValue(record, field), field.type)

    if (value && value !== '—') return value
  }

  return ''
}

function getDisplayName(record: any) {
  return pickValue(
    record?.santri,
    record?.nama,
    firstReadableCustomValue(record),
    record?.ppdbCode,
    'Pendaftar'
  )
}

function findCustomValue(record: any, mapTo: string, keywords: string[] = []) {
  const fields = activeCustomFields.value

  const byMap = fields.find((field: any) => field.mapTo === mapTo)
  if (byMap) return getCustomFieldValue(record, byMap)

  const byLabel = fields.find((field: any) => {
    const label = String(field.label || '').toLowerCase()
    return keywords.some((keyword) => label.includes(keyword))
  })

  return byLabel ? getCustomFieldValue(record, byLabel) : ''
}

function formatCustomValue(value: any, type?: string) {
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—'

  if (value && typeof value === 'object') {
    const url = extractUrl(value)
    if (url) return url

    return JSON.stringify(value)
  }

  if (value === null || value === undefined || value === '') return '—'

  if (type === 'date') {
    return formatDetailDate(value)
  }

  return String(value)
}

function buildCustomFieldColumns() {
  return tableCustomFields.value.map((field: any) => ({
    key: customColumnKey(field),
    label: field.label || field.key || 'Input Custom',
    sortable: true
  }))
}

function countDocsFromAnyRecord(record: any) {
  const docs = collectDokumen(record)
  const fromRow = Number(record?.dokumenCount || 0)

  return Math.max(fromRow, Object.values(docs).filter(Boolean).length)
}

function jenjangFromStatus(status: any) {
  const raw = String(status || '').trim()
  const key = raw.toLowerCase()

  const map: Record<string, string> = {
    tk: 'TK',
    ra: 'RA',
    sd: 'SD',
    mi: 'MI',
    smp: 'SMP',
    mts: 'MTs',
    sma: 'SMA',
    smk: 'SMK',
    ma: 'MA',
    madin: 'Madin',
    pondok: 'Pondok',
    umum: 'Umum'
  }

  return map[key] || raw
}

function normalizeSantriRow(row: any): SantriRow {
  const s = row?.ppdb?.siswa || {}
  const a = row?.ppdb?.alamat || {}
  const p = row?.ppdb?.pendidikan || {}
  const o = row?.ppdb?.ortu || {}
  const ayah = o?.ayah || {}
  const ibu = o?.ibu || {}
  const wali = row?.ppdb?.wali || {}
  const customJk = findCustomValue(row, 'jk', ['jenis kelamin', 'gender'])

  const gender = normalizeGenderValue(pickValue(row?.gender, row?.jk, s?.jk, customJk, 'L'))
  const tipe = pickValue(row?.tipe, gender === 'P' ? 'Putri' : 'Putra')

  const alamatLengkap = [
    a?.jalan,
    a?.rt ? `RT ${a.rt}` : '',
    a?.rw ? `RW ${a.rw}` : '',
    a?.dusun,
    a?.desa,
    a?.kec,
    a?.kab,
    a?.prov,
    a?.kodepos
  ].filter(Boolean).join(', ')

  const normalizedRow: any = {
    ...row,

    id: row?.id || '',
    gen: String(pickValue(row?.gen, row?.year, selectedYear.value, new Date().getFullYear())),

    santri: getDisplayName(row),
    walisantri: pickValue(row?.walisantri, row?.waliNama, wali?.nama, ayah?.nama, ibu?.nama),
    nohp: pickValue(row?.nohp, row?.hpOrtu1, o?.hp1, wali?.hp),

    nik: pickValue(row?.nik, s?.nik),
    kk: pickValue(row?.kk, s?.kk),
    nisn: pickValue(row?.nisn, s?.nisn),

    ayahNama: pickValue(row?.ayahNama, ayah?.nama),
    ibuNama: pickValue(row?.ibuNama, ibu?.nama),

    alamat: pickValue(row?.alamat, alamatLengkap),
    jenjang: pickValue(row?.jenjang, jenjangFromStatus?.(p?.status) || p?.status),

    gender,
    tipe,

    ppdbCode: pickValue(row?.ppdbCode, row?.kodePendaftaran, row?.registrationCode),
    dokumenCount: countDocsFromAnyRecord(row)
  }

  const rowTableFields = getTableFieldsForRecord(row)
  for (const field of rowTableFields) {
    normalizedRow[customColumnKey(field)] = formatCustomValue(
      getCustomFieldValue(row, field),
      field.type
    )
  }

  for (const field of tableCustomFields.value) {
    if (normalizedRow[customColumnKey(field)] !== undefined) continue

    normalizedRow[customColumnKey(field)] = formatCustomValue(
      getCustomFieldValue(row, field),
      field.type
    )
  }

  return normalizedRow as SantriRow
}

const adminRows = computed(() => {
  return (rows.value || []).map((row: any) => normalizeSantriRow(row))
})

const mergedYearOptions = computed(() => {
  const currentYear = String(new Date().getFullYear())
  const arr = Array.from(
    new Set([
      selectedYear.value,
      String(settings.value?.year || ''),
      currentYear,
      ...yearOptions.value
    ].filter(Boolean))
  )

  return arr.sort((a, b) => Number(b) - Number(a))
})

onMounted(async () => {
  await Promise.all([fetchSantri(), fetchSettings()])

  selectedYear.value = new Date().getFullYear().toString()

  startAutoCloseTicker()
  checkAutoClose()
})

function matchSearch(r: SantriRow, q: string) {
  if (!q) return true

  const s = q.toLowerCase()
  const row: any = r

  const customHay = activeCustomFields.value
    .map((field) => getCustomFieldValue(row, field))
    .map((v) => formatCustomValue(v))
    .join(' | ')

  const hay = [
    row.ppdbCode,
    row.santri,
    row.walisantri,
    row.alamat,
    row.nohp,
    row.nik,
    row.kk,
    row.nisn,
    row.ayahNama,
    row.ibuNama,
    row.waliNama,
    row.username,
    row.publicToken,
    row.jenjang,
    row.tipe,
    customHay,
  ]
    .map((v) => String(v || '').toLowerCase())
    .join(' | ')

  return hay.includes(s)
}

function matchJenjang(r: SantriRow, jj: string) {
  if (jj === 'semua') return true
  return String(r.jenjang || '').toLowerCase() === jj.toLowerCase()
}

const isPutri = (r: SantriRow) => r.tipe === 'Putri' || String((r as any).gender).toUpperCase() === 'P'
const isPutra = (r: SantriRow) => r.tipe === 'Putra' || String((r as any).gender).toUpperCase() !== 'P'
const isCalon = (r: SantriRow) => String(r.status).toLowerCase() === 'nonaktif'
const isBaru = (r: SantriRow) => !isCalon(r)

const baseFiltered = computed(() => {
  let data = (adminRows.value || [])
    .filter((r) => matchSearch(r, filters.q))

  if (!usingCustomForm.value) {
    data = data.filter((r) => matchJenjang(r, filters.jenjang))
  }

  return data
})

const jenjangOptions = computed(() => {
  const arr = (adminRows.value || [])
    .map((r) => String(r.jenjang || '').trim())
    .filter(Boolean)

  return Array.from(new Set(arr))
})

const putraFiltered = computed(() => baseFiltered.value.filter(isPutra))
const putriFiltered = computed(() => baseFiltered.value.filter(isPutri))
const calonPutraFiltered = computed(() => putraFiltered.value.filter(isCalon))
const baruPutraFiltered = computed(() => putraFiltered.value.filter(isBaru))
const calonPutriFiltered = computed(() => putriFiltered.value.filter(isCalon))
const baruPutriFiltered = computed(() => putriFiltered.value.filter(isBaru))

const selectedYearRows = computed(() => {
  return adminRows.value || []
})

const totalCalon = computed(() => calonPutraFiltered.value.length + calonPutriFiltered.value.length)
const totalDiterima = computed(() => baruPutraFiltered.value.length + baruPutriFiltered.value.length)

const activeModeRows = computed(() => {
  if (usingCustomForm.value) {
    return baseFiltered.value
  }

  return ppdbMode.value === 'putra'
    ? [...calonPutraFiltered.value, ...baruPutraFiltered.value]
    : [...calonPutriFiltered.value, ...baruPutriFiltered.value]
})

const tableGroups = computed(() => {
  if (usingCustomForm.value) {
    const calon = baseFiltered.value.filter(isCalon)
    const diterima = baseFiltered.value.filter(isBaru)

    return [
      {
        key: 'custom-calon',
        title: 'Calon Pendaftar',
        subtitle: 'Data pendaftar custom yang masih menunggu proses penerimaan.',
        tone: 'candidate' as const,
        rows: calon,
        bulkSaving: savingBulk.value,
        bulkLabel: 'Terima Semua',
        exportName: 'calon_pendaftar_semua.csv',
        bulkAction: () => approveBulk(calon.map((row) => row.id))
      },
      // {
      //   key: 'custom-diterima',
      //   title: `Pendaftar Diterima`,
      //   subtitle: 'Data pendaftar custom yang sudah diterima.',
      //   tone: 'accepted' as const,
      //   rows: diterima,
      //   bulkSaving: savingBulkRevert.value,
      //   bulkLabel: 'Jadikan Calon Semua',
      //   exportName: `pendaftar_diterima.csv`,
      //   bulkAction: () => revertBulk(diterima.map((row) => row.id))
      // }
    ]
  }

  if (ppdbMode.value === 'putra') {
    return [
      {
        key: 'calon-putra',
        title: `Calon Putra`,
        subtitle: 'Pendaftar putra yang masih menunggu proses penerimaan.',
        tone: 'candidate' as const,
        rows: calonPutraFiltered.value,
        bulkSaving: savingBulk.value,
        bulkLabel: 'Terima Semua',
        exportName: `calon_putra.csv`,
        bulkAction: () => approveBulk(calonPutraFiltered.value.map((row) => row.id))
      },
      {
        key: 'baru-putra',
        title: `Santri Baru Putra`,
        subtitle: 'Pendaftar putra yang sudah diterima sebagai santri baru.',
        tone: 'accepted' as const,
        rows: baruPutraFiltered.value,
        bulkSaving: savingBulkRevert.value,
        bulkLabel: 'Jadikan Calon Semua',
        exportName: `santri_putra.csv`,
        bulkAction: () => revertBulk(baruPutraFiltered.value.map((row) => row.id))
      }
    ]
  }

  return [
    {
      key: 'calon-putri',
      title: `Calon Putri`,
      subtitle: 'Pendaftar putri yang masih menunggu proses penerimaan.',
      tone: 'candidate' as const,
      rows: calonPutriFiltered.value,
      bulkSaving: savingBulk.value,
      bulkLabel: 'Terima Semua',
      exportName: `calon_putri_${selectedYear.value}.csv`,
      bulkAction: () => approveBulk(calonPutriFiltered.value.map((row) => row.id))
    },
    {
      key: 'baru-putri',
      title: `Santri Baru Putri`,
      subtitle: 'Pendaftar putri yang sudah diterima sebagai santri baru.',
      tone: 'accepted' as const,
      rows: baruPutriFiltered.value,
      bulkSaving: savingBulkRevert.value,
      bulkLabel: 'Jadikan Calon Semua',
      exportName: `santri_putri.csv`,
      bulkAction: () => revertBulk(baruPutriFiltered.value.map((row) => row.id))
    }
  ]
})

const statusSummary = computed(() => {
  const total = Math.max(activeModeRows.value.length, 1)
  const calon = ppdbMode.value === 'putra' ? calonPutraFiltered.value.length : calonPutriFiltered.value.length
  const diterima = ppdbMode.value === 'putra' ? baruPutraFiltered.value.length : baruPutriFiltered.value.length

  return [
    {
      key: 'calon',
      label: 'Calon',
      count: calon,
      width: `${(calon / total) * 100}%`,
      barClass: 'bg-amber-500'
    },
    {
      key: 'diterima',
      label: 'Diterima',
      count: diterima,
      width: `${(diterima / total) * 100}%`,
      barClass: 'bg-green-600'
    }
  ]
})

/** ===== Columns ===== */
const defaultColumnsAdmin = [
  { key: 'select', label: '', sortable: false, slot: 'select' },
  { key: 'ppdbCode', label: 'No. Pendaftaran', sortable: true },
  { key: 'nik', label: 'NIK', sortable: true },
  { key: 'santri', label: 'Nama', sortable: true },
  { key: 'alamat', label: 'Alamat', sortable: true },
  { key: 'ayahNama', label: 'Nama Ayah', sortable: true },
  { key: 'ibuNama', label: 'Nama Ibu', sortable: true },
  { key: 'nohp', label: 'Nomor WA', sortable: true },
  { key: 'dokumen', label: 'Dokumen', sortable: false, slot: 'dokumen' }
]

const columnsAdmin = computed(() => {
  if (!usingCustomForm.value) return defaultColumnsAdmin

  return [
    { key: 'select', label: '', sortable: false, slot: 'select' },
    { key: 'ppdbCode', label: 'No. Pendaftaran', sortable: true },
    ...buildCustomFieldColumns(),
    { key: 'dokumen', label: 'Dokumen', sortable: false, slot: 'dokumen' }
  ]
})

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

async function approve(id: string) {
  await updateSantri(id, { status: null as any })
}

async function revertToCalon(id: string) {
  await updateSantri(id, { status: 'nonaktif', kamar: '-', maskan: '' })
}

/** ===== Edit Ringkas ===== */
const showForm = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const formError = ref<string | null>(null)
const saving = ref(false)
const current = ref<SantriRow | null>(null)

const form = reactive<Omit<SantriRow, 'id'>>({
  gen: new Date().getFullYear().toString(),
  santri: '',
  walisantri: '',
  nohp: '',
  kamar: '',
  alamat: '',
  status: 'nonaktif',
  jenjang: '',
  maskan: '',
  gender: 'L',
  tipe: 'Putra',
  ppdbCode: '',
  nik: '',
  ayahNama: '',
  ibuNama: '',
  dokumenCount: 0
} as any)

function openEdit(r: SantriRow) {
  formMode.value = 'edit'
  current.value = r

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
  form.tipe = (r as any).tipe || (form.gender === 'P' ? 'Putri' : 'Putra')
  form.ppdbCode = r.ppdbCode || ''
  form.nik = r.nik || ''
  form.ayahNama = r.ayahNama || ''
  form.ibuNama = r.ibuNama || ''
  form.dokumenCount = r.dokumenCount || 0

  formError.value = null
  showForm.value = true
}

async function saveRow() {
  if (!form.santri?.trim()) {
    formError.value = 'Nama santri wajib diisi.'
    return
  }

  if (!form.gen?.trim()) {
    formError.value = 'Gen wajib diisi.'
    return
  }

  saving.value = true

  try {
    if (formMode.value === 'edit' && current.value?.id) {
      await updateSantri(current.value.id, { ...form })
      showForm.value = false
    } else {
      formError.value = 'Mode tambah belum diaktifkan.'
    }
  } catch (e: any) {
    formError.value = e?.message ?? 'Gagal menyimpan data'
  } finally {
    saving.value = false
  }
}

/** ===== Hapus ===== */
const selectedDeleteIds = ref<string[]>([])

function getRowId(row: any) {
  return String(row?.id || '')
}

function isRowSelectedForDelete(row: any) {
  const id = getRowId(row)
  return !!id && selectedDeleteIds.value.includes(id)
}

function toggleDeleteSelection(row: any) {
  const id = getRowId(row)
  if (!id) return

  if (selectedDeleteIds.value.includes(id)) {
    selectedDeleteIds.value = selectedDeleteIds.value.filter((item) => item !== id)
    return
  }

  selectedDeleteIds.value = [...selectedDeleteIds.value, id]
}

function selectedCountInGroup(groupRows: any[]) {
  const ids = new Set((groupRows || []).map((row) => getRowId(row)).filter(Boolean))
  return selectedDeleteIds.value.filter((id) => ids.has(id)).length
}

function isGroupFullySelected(groupRows: any[]) {
  const ids = (groupRows || []).map((row) => getRowId(row)).filter(Boolean)
  if (!ids.length) return false

  return ids.every((id) => selectedDeleteIds.value.includes(id))
}

function isGroupPartiallySelected(groupRows: any[]) {
  const ids = (groupRows || []).map((row) => getRowId(row)).filter(Boolean)
  if (!ids.length) return false

  const selectedCount = ids.filter((id) => selectedDeleteIds.value.includes(id)).length

  return selectedCount > 0 && selectedCount < ids.length
}

function toggleGroupDeleteSelection(groupRows: any[]) {
  const ids = (groupRows || []).map((row) => getRowId(row)).filter(Boolean)
  if (!ids.length) return

  const allSelected = ids.every((id) => selectedDeleteIds.value.includes(id))

  if (allSelected) {
    selectedDeleteIds.value = selectedDeleteIds.value.filter((id) => !ids.includes(id))
    return
  }

  selectedDeleteIds.value = Array.from(new Set([...selectedDeleteIds.value, ...ids]))
}

function clearDeletedSelection(ids: string[]) {
  selectedDeleteIds.value = selectedDeleteIds.value.filter((id) => !ids.includes(id))
}

const showConfirm = ref(false)
const deleting = ref(false)

function openConfirm(r: SantriRow) {
  current.value = r
  showConfirm.value = true
}

async function confirmDelete() {
  if (!current.value?.id) return

  const id = current.value.id

  deleting.value = true

  try {
    await deleteSantri(id)
    clearDeletedSelection([id])
    showConfirm.value = false
    current.value = null

    await fetchSantri()
  } finally {
    deleting.value = false
  }
}

/** ===== Shared Record Loader ===== */
function getLocalRow(id: string) {
  return (adminRows.value || []).find((row) => row.id === id) || null
}

function withTimeout<T>(promise: Promise<T>, ms = 10000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error('Timeout memuat data dari database. Data lokal akan digunakan jika tersedia.'))
    }, ms)

    promise
      .then(resolve)
      .catch(reject)
      .finally(() => window.clearTimeout(timer))
  })
}

async function resolveFullRecord(id: string, fallbackRow?: any) {
  const local = fallbackRow || getLocalRow(id)

  try {
    const full = await withTimeout(Promise.resolve(getSantriById(id)), 10000)

    if (full) {
      return {
        ...(local || {}),
        ...full,
        id: full.id || id
      }
    }

    return local ? { ...local, id } : null
  } catch {
    return local ? { ...local, id } : null
  }
}

/** ===== Dokumen Helpers ===== */
type DocKey = 'kk' | 'akte' | 'ktpAyah' | 'ktpIbu'

const DOC_META: Array<{ key: DocKey; legacy: string; label: string }> = [
  { key: 'kk', legacy: 'kkUrl', label: 'Kartu Keluarga' },
  { key: 'akte', legacy: 'akteUrl', label: 'Akta Kelahiran' },
  { key: 'ktpAyah', legacy: 'ktpAyahUrl', label: 'KTP Ayah' },
  { key: 'ktpIbu', legacy: 'ktpIbuUrl', label: 'KTP Ibu' }
]

function extractUrl(value: any) {
  if (!value) return ''
  if (typeof value === 'string') return value

  return String(
    value.url ||
      value.secure_url ||
      value.secureUrl ||
      value.downloadURL ||
      value.downloadUrl ||
      value.href ||
      value.link ||
      value.src ||
      ''
  )
}

function collectDokumen(record: any) {
  const source =
    record?.dokumen ||
    record?.documents ||
    record?.berkas ||
    record?.ppdb?.dokumen ||
    {}

  const output: Record<DocKey, string> = {
    kk: '',
    akte: '',
    ktpAyah: '',
    ktpIbu: ''
  }

  for (const item of DOC_META) {
    output[item.key] =
      extractUrl(source?.[item.key]) ||
      extractUrl(source?.[item.legacy]) ||
      extractUrl(record?.[item.legacy]) ||
      extractUrl(record?.[`dokumen_${item.key}`]) ||
      extractUrl(record?.[`dokumen${item.key}`])
  }

  return output
}

function getDocUrl(d: any, key: DocKey, legacyKey: string) {
  const docs = collectDokumen({
    dokumen: d,
    [legacyKey]: d?.[legacyKey]
  })

  return docs[key] || ''
}

function getRowDocCount(row: any) {
  const fromRow = Number(row?.dokumenCount || 0)
  const docs = collectDokumen(row)
  const count = Object.values(docs).filter(Boolean).length

  return Math.max(fromRow, count)
}

function buildViewerUrl(url: string) {
  const s = String(url || '')
  if (!s) return ''

  if (s.includes('drive.google.com')) {
    const m = s.match(/\/file\/d\/([^/]+)\//)
    if (m?.[1]) return `https://drive.google.com/file/d/${m[1]}/preview`

    const id = s.match(/[?&]id=([^&]+)/)?.[1]
    if (id) return `https://drive.google.com/file/d/${id}/preview`
  }

  if (/\.pdf(\?|#|$)/i.test(s)) return s

  return s
}

function isPdfUrl(url: string) {
  return /\.pdf(\?|#|$)/i.test(url) || url.includes('drive.google.com')
}

function isImageUrl(url: string) {
  if (!url) return false
  if (isPdfUrl(url)) return false

  return /\.(png|jpe?g|webp|gif|bmp|svg)(\?|#|$)/i.test(url) || url.includes('res.cloudinary.com')
}

/** ===== Dokumen Modal ===== */
const showDocs = ref(false)
const docState = reactive<{ loading: boolean; dok: any | null; error: string }>({
  loading: false,
  dok: null,
  error: ''
})

const activeDocTab = ref(0)

const showBulkDeleteConfirm = ref(false)
const bulkDeleting = ref(false)
const bulkDeleteRows = ref<SantriRow[]>([])
const bulkDeleteTitle = ref('Hapus data terpilih')

function openBulkDeleteSelected(groupRows: SantriRow[]) {
  const groupIds = new Set((groupRows || []).map((row) => getRowId(row)).filter(Boolean))

  const selectedRows = (groupRows || []).filter((row) => {
    const id = getRowId(row)
    return id && groupIds.has(id) && selectedDeleteIds.value.includes(id)
  })

  if (!selectedRows.length) return

  bulkDeleteRows.value = selectedRows
  bulkDeleteTitle.value = 'Hapus data terpilih'
  showBulkDeleteConfirm.value = true
}

function openBulkDeleteGroup(group: any) {
  const groupRows = Array.isArray(group?.rows) ? group.rows : []
  if (!groupRows.length) return

  bulkDeleteRows.value = groupRows
  bulkDeleteTitle.value = `Hapus semua data pada ${group.title}`
  showBulkDeleteConfirm.value = true
}

async function confirmBulkDelete() {
  const ids = bulkDeleteRows.value
    .map((row: any) => getRowId(row))
    .filter(Boolean)

  if (!ids.length) return

  bulkDeleting.value = true

  try {
    for (const id of ids) {
      await deleteSantri(id)
    }

    clearDeletedSelection(ids)
    showBulkDeleteConfirm.value = false
    bulkDeleteRows.value = []

    await fetchSantri()
  } finally {
    bulkDeleting.value = false
  }
}

const docTabs = computed(() => {
  const docs = collectDokumen({ dokumen: docState.dok || {} })

  const raw = DOC_META
    .map((item) => ({
      key: item.key,
      label: item.label,
      url: docs[item.key]
    }))
    .filter((item) => !!item.url)

  return raw.map((item) => {
    const url = String(item.url)

    return {
      ...item,
      isImage: isImageUrl(url),
      isPdf: isPdfUrl(url),
      viewerUrl: isPdfUrl(url) ? buildViewerUrl(url) : url
    }
  })
})

const currentTab = computed(() => {
  return docTabs.value[activeDocTab.value] || {
    url: '',
    isImage: false,
    isPdf: false,
    viewerUrl: '',
    label: '-'
  }
})

async function openDocs(id: string, row?: any) {
  showDocs.value = true
  activeDocTab.value = 0
  docState.loading = true
  docState.error = ''
  docState.dok = null

  try {
    const full = await resolveFullRecord(id, row)

    if (!full) {
      docState.error = 'Data pendaftar tidak ditemukan.'
      return
    }

    const docs = collectDokumen(full)
    docState.dok = docs

    if (activeDocTab.value >= docTabs.value.length) {
      activeDocTab.value = 0
    }
  } catch (e: any) {
    docState.error = e?.message || 'Gagal memuat dokumen.'
  } finally {
    docState.loading = false
  }
}

/** ===== Detail Lengkap ===== */
const showDetail = ref(false)
const detailState = reactive({ loading: false, error: '' })
const fullRecord = ref<any | null>(null)

async function openDetail(r: SantriRow) {
  showDetail.value = true
  detailState.loading = true
  detailState.error = ''
  fullRecord.value = null

  try {
    const full = await resolveFullRecord(r.id, r)

    if (!full) {
      detailState.error = 'Data detail tidak ditemukan.'
      return
    }

    fullRecord.value = full
  } catch (e: any) {
    detailState.error = e?.message || 'Gagal memuat detail pendaftaran.'
  } finally {
    detailState.loading = false
  }
}

const detailSiswa = computed(() => fullRecord.value?.ppdb?.siswa || {})
const detailAlamat = computed(() => fullRecord.value?.ppdb?.alamat || {})
const detailPendidikan = computed(() => fullRecord.value?.ppdb?.pendidikan || {})
const detailOrtu = computed(() => fullRecord.value?.ppdb?.ortu || {})
const detailWali = computed(() => fullRecord.value?.ppdb?.wali || {})
const detailDokumen = computed(() => collectDokumen(fullRecord.value || {}))

function detailValue(value: any, fallback = '—') {
  if (Array.isArray(value)) return value.length ? value.join(', ') : fallback
  if (value === null || value === undefined || value === '') return fallback
  return String(value)
}

function detailGender(value: any) {
  const gender = String(value || '').toUpperCase()
  if (gender === 'L') return 'Laki-laki'
  if (gender === 'P') return 'Perempuan'
  return '—'
}

function formatDetailDate(value: any) {
  const raw = String(value || '').trim()
  if (!raw) return '—'

  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date(raw))
  } catch {
    return raw
  }
}

function formatCreatedAt(value: any) {
  if (!value) return '—'

  try {
    if (value?._seconds) {
      return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date(value._seconds * 1000))
    }

    if (typeof value === 'number') {
      return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date(value))
    }

    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(value))
  } catch {
    return String(value)
  }
}

const detailCreatedAt = computed(() => formatCreatedAt(fullRecord.value?.createdAt))

const detailQuickSummary = computed(() => {
  const record = fullRecord.value || {}

  if (usingCustomForm.value) {
    return getFieldsForRecord(record)
      .filter((field: any) => field.type !== 'file')
      .slice(0, 4)
      .map((field: any) => ({
        label: field.label || field.key || 'Input Custom',
        value: detailValue(formatCustomValue(getCustomFieldValue(record, field), field.type))
      }))
  }

  return [
    {
      label: 'Nama Santri',
      value: detailValue(fullRecord.value?.santri || detailSiswa.value.nama)
    },
    {
      label: 'NIK',
      value: detailValue(fullRecord.value?.nik || detailSiswa.value.nik)
    },
    {
      label: 'No. HP / WA',
      value: detailValue(fullRecord.value?.nohp || detailOrtu.value?.hp1)
    },
    {
      label: 'Jenjang',
      value: detailValue(fullRecord.value?.jenjang || detailPendidikan.value?.status)
    }
  ]
})

const defaultDetailSections = computed(() => {
  const s = detailSiswa.value
  const a = detailAlamat.value
  const p = detailPendidikan.value
  const o = detailOrtu.value
  const ayah = o?.ayah || {}
  const ibu = o?.ibu || {}
  const w = detailWali.value

  return [
    {
      key: 'siswa',
      title: 'Data Calon Santri',
      subtitle: 'Sesuai isian identitas pada formulir publik.',
      icon: 'ph:user',
      rows: [
        { label: 'Nama Lengkap', value: detailValue(s.nama || fullRecord.value?.santri), wide: true },
        { label: 'Jenis Kelamin', value: detailGender(s.jk || fullRecord.value?.gender) },
        { label: 'Tempat Lahir', value: detailValue(s.tmpLahir) },
        { label: 'Tanggal Lahir', value: formatDetailDate(s.tglLahir) },
        { label: 'Tinggi Badan', value: s.tinggi ? `${s.tinggi} cm` : '—' },
        { label: 'Berat Badan', value: s.berat ? `${s.berat} kg` : '—' },
        { label: 'Cita-cita', value: detailValue(s.cita) },
        { label: 'Hobi', value: detailValue(s.hobi) },
        { label: 'No. KK', value: detailValue(s.kk) },
        { label: 'NIK', value: detailValue(s.nik || fullRecord.value?.nik) },
        { label: 'NISN', value: detailValue(s.nisn), wide: true }
      ]
    },
    {
      key: 'alamat',
      title: 'Alamat Domisili',
      subtitle: 'Alamat lengkap sesuai isian pendaftar.',
      icon: 'ph:map-pin',
      rows: [
        { label: 'Jalan / Gang / No. Rumah', value: detailValue(a.jalan), wide: true },
        { label: 'RT', value: detailValue(a.rt) },
        { label: 'RW', value: detailValue(a.rw) },
        { label: 'Dusun', value: detailValue(a.dusun) },
        { label: 'Desa/Kelurahan', value: detailValue(a.desa) },
        { label: 'Kecamatan', value: detailValue(a.kec) },
        { label: 'Kabupaten/Kota', value: detailValue(a.kab) },
        { label: 'Provinsi', value: detailValue(a.prov) },
        { label: 'Kode Pos', value: detailValue(a.kodepos) },
        { label: 'Tinggal Dengan', value: detailValue(a.tinggal), wide: true },
        { label: 'Alamat Ringkas', value: detailValue(fullRecord.value?.alamat), wide: true }
      ]
    },
    {
      key: 'pendidikan',
      title: 'Riwayat Pendidikan',
      subtitle: 'Sekolah asal dan pendidikan keagamaan non-formal.',
      icon: 'ph:books',
      rows: [
        { label: 'Status Sekolah Asal', value: detailValue(p.status) },
        { label: 'Nama Sekolah Asal', value: detailValue(p.sekolah) },
        { label: 'Alamat Sekolah Asal', value: detailValue(p.alamatSekolah), wide: true },
        { label: 'Pendidikan Non-formal', value: detailValue(p.nonformal), wide: true },
        { label: 'Nama Lembaga Non-formal', value: detailValue(p.nfNama) },
        { label: 'Alamat Lembaga Non-formal', value: detailValue(p.nfAlamat) }
      ]
    },
    {
      key: 'ortu',
      title: 'Data Orang Tua',
      subtitle: 'Data ayah, ibu, dan kontak aktif.',
      icon: 'ph:users-three',
      rows: [
        { label: 'Nama Ayah', value: detailValue(ayah.nama || fullRecord.value?.ayahNama) },
        { label: 'Status Ayah', value: detailValue(ayah.status) },
        { label: 'Pendidikan Ayah', value: detailValue(ayah.pendidikan) },
        { label: 'Pekerjaan Ayah', value: detailValue(ayah.pekerjaan) },
        { label: 'Penghasilan Ayah', value: detailValue(ayah.penghasilan), wide: true },
        { label: 'Nama Ibu', value: detailValue(ibu.nama || fullRecord.value?.ibuNama) },
        { label: 'Status Ibu', value: detailValue(ibu.status) },
        { label: 'Pendidikan Ibu', value: detailValue(ibu.pendidikan) },
        { label: 'No. HP 1 / WA', value: detailValue(o.hp1 || fullRecord.value?.nohp) },
        { label: 'No. HP 2', value: detailValue(o.hp2) }
      ]
    },
    {
      key: 'wali',
      title: 'Data Wali',
      subtitle: 'Opsional, jika calon santri tinggal bersama wali.',
      icon: 'ph:hand-heart',
      rows: [
        { label: 'Nama Wali', value: detailValue(w.nama || fullRecord.value?.walisantri) },
        { label: 'Status Wali', value: detailValue(w.status) },
        { label: 'Pendidikan Wali', value: detailValue(w.pendidikan) },
        { label: 'Pekerjaan Wali', value: detailValue(w.pekerjaan) },
        { label: 'Penghasilan Wali', value: detailValue(w.penghasilan) },
        { label: 'No. HP Wali', value: detailValue(w.hp) }
      ]
    },
    {
      key: 'akun',
      title: 'Akun & Metadata',
      subtitle: 'Informasi sistem yang dibuat setelah submit.',
      icon: 'lucide:shield-check',
      rows: [
        { label: 'Username', value: detailValue(fullRecord.value?.username) },
        { label: 'Public Token', value: detailValue(fullRecord.value?.publicToken) },
        { label: 'Tahun / Gen', value: detailValue(fullRecord.value?.gen) },
        { label: 'Tipe', value: detailValue(fullRecord.value?.tipe) },
        { label: 'Waktu Submit', value: detailCreatedAt.value, wide: true }
      ]
    }
  ]
})

const customDetailSections = computed(() => {
  const record = fullRecord.value || {}

  const customRows = getFieldsForRecord(record).map((field: any) => {
    const rawValue = getCustomFieldValue(record, field)

    return {
      label: field.label || field.key || 'Input Custom',
      value: detailValue(formatCustomValue(rawValue, field.type)),
      wide: ['textarea', 'file'].includes(field.type)
    }
  })

  return [
    {
      key: 'custom-form',
      title: 'Data Formulir',
      subtitle: 'Seluruh data mengikuti input yang dikirim dari form pendaftaran.',
      icon: 'lucide:list-checks',
      rows: customRows.length
        ? customRows
        : [
            {
              label: 'Data',
              value: 'Belum ada data custom yang tersimpan.',
              wide: true
            }
          ]
    },
    {
      key: 'akun',
      title: 'Akun & Metadata',
      subtitle: 'Informasi sistem yang dibuat setelah submit.',
      icon: 'lucide:shield-check',
      rows: [
        { label: 'No. Pendaftaran', value: detailValue(record?.ppdbCode) },
        { label: 'Username', value: detailValue(record?.username) },
        { label: 'Public Token', value: detailValue(record?.publicToken) },
        { label: 'Tahun / Gen', value: detailValue(record?.gen) },
        { label: 'Status', value: isCalon(record) ? 'Calon' : 'Diterima' },
        { label: 'Waktu Submit', value: detailCreatedAt.value, wide: true }
      ]
    }
  ]
})

const detailSections = computed(() => {
  return usingCustomForm.value
    ? customDetailSections.value
    : defaultDetailSections.value
})

const detailDocSummary = computed(() => {
  return DOC_META.map((item) => ({
    label: item.label,
    ready: !!detailDokumen.value[item.key]
  }))
})

/** ===== Export Full Form ===== */
function flattenDefaultForExport(rec: any) {
  const s = rec?.ppdb?.siswa || {}
  const a = rec?.ppdb?.alamat || {}
  const p = rec?.ppdb?.pendidikan || {}
  const o = rec?.ppdb?.ortu || {}
  const w = rec?.ppdb?.wali || {}
  const ayah = o?.ayah || {}
  const ibu = o?.ibu || {}
  const docs = collectDokumen(rec)

  return {
    id: rec?.id || '',
    no_pendaftaran: rec?.ppdbCode || '',
    gen: rec?.gen || '',
    status: isCalon(rec) ? 'Calon' : 'Diterima',
    tipe: rec?.tipe || '',
    gender: rec?.gender || s?.jk || '',
    created_at: formatCreatedAt(rec?.createdAt),
    username: rec?.username || '',
    public_token: rec?.publicToken || '',

    nama: rec?.santri || s?.nama || '',
    tempat_lahir: s?.tmpLahir || '',
    tanggal_lahir: s?.tglLahir || '',
    tinggi: s?.tinggi || '',
    berat: s?.berat || '',
    cita_cita: s?.cita || '',
    hobi: s?.hobi || '',
    no_kk: s?.kk || '',
    nik: rec?.nik || s?.nik || '',
    nisn: s?.nisn || '',

    alamat_jalan: a?.jalan || '',
    rt: a?.rt || '',
    rw: a?.rw || '',
    dusun: a?.dusun || '',
    desa: a?.desa || '',
    kecamatan: a?.kec || '',
    kabupaten: a?.kab || '',
    provinsi: a?.prov || '',
    kode_pos: a?.kodepos || '',
    tinggal_dengan: a?.tinggal || '',
    alamat_ringkas: rec?.alamat || '',

    pendidikan_status: p?.status || '',
    sekolah_asal: p?.sekolah || '',
    alamat_sekolah: p?.alamatSekolah || '',
    pendidikan_nonformal: Array.isArray(p?.nonformal) ? p.nonformal.join(', ') : p?.nonformal || '',
    lembaga_nonformal: p?.nfNama || '',
    alamat_nonformal: p?.nfAlamat || '',

    ayah_nama: ayah?.nama || rec?.ayahNama || '',
    ayah_status: ayah?.status || '',
    ayah_pendidikan: ayah?.pendidikan || '',
    ayah_pekerjaan: ayah?.pekerjaan || '',
    ayah_penghasilan: ayah?.penghasilan || '',

    ibu_nama: ibu?.nama || rec?.ibuNama || '',
    ibu_status: ibu?.status || '',
    ibu_pendidikan: ibu?.pendidikan || '',
    ibu_pekerjaan: ibu?.pekerjaan || '',
    ibu_penghasilan: ibu?.penghasilan || '',

    hp_1: o?.hp1 || rec?.nohp || '',
    hp_2: o?.hp2 || '',

    wali_nama: w?.nama || rec?.walisantri || '',
    wali_status: w?.status || '',
    wali_pendidikan: w?.pendidikan || '',
    wali_pekerjaan: w?.pekerjaan || '',
    wali_penghasilan: w?.penghasilan || '',
    wali_hp: w?.hp || '',

    dokumen_kk: docs.kk,
    dokumen_akte: docs.akte,
    dokumen_ktp_ayah: docs.ktpAyah,
    dokumen_ktp_ibu: docs.ktpIbu,
    dokumen_count: Object.values(docs).filter(Boolean).length
  }
}

function flattenCustomForExport(rec: any) {
  const output: Record<string, any> = {
    id: rec?.id || '',
    no_pendaftaran: rec?.ppdbCode || '',
    gen: rec?.gen || '',
    status: isCalon(rec) ? 'Calon' : 'Diterima',
    created_at: formatCreatedAt(rec?.createdAt),
    username: rec?.username || '',
    public_token: rec?.publicToken || ''
  }

  for (const field of activeCustomFields.value) {
    const key = safeColumnKey(field.label || field.key || field.id)
    output[key] = formatCustomValue(getCustomFieldValue(rec, field), field.type)
  }

  return output
}

function flattenForExport(rec: any) {
  return usingCustomForm.value
    ? flattenCustomForExport(rec)
    : flattenDefaultForExport(rec)
}

function csvEscape(value: any) {
  const s = String(value ?? '')
  const escaped = s.replace(/"/g, '""')
  return /[",\n\r]/.test(escaped) ? `"${escaped}"` : escaped
}

function toCSV(records: any[]) {
  if (!records.length) return 'id\n'

  const flat = records.map(flattenForExport)
  const headers = Object.keys(flat[0] || {})

  const head = headers.join(',')
  const body = flat
    .map((row) => headers.map((h) => csvEscape((row as any)[h])).join(','))
    .join('\n')

  return `${head}\n${body}`
}

function excelEscape(value: any) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function toExcelHtml(records: any[]) {
  const flat = records.map(flattenForExport)
  const headers = flat.length ? Object.keys(flat[0] || {}) : ['id']

  const headerHtml = headers.map((h) => `<th>${excelEscape(h)}</th>`).join('')
  const rowsHtml = flat
    .map((row) => {
      return `<tr>${headers.map((h) => `<td>${excelEscape((row as any)[h])}</td>`).join('')}</tr>`
    })
    .join('')

  return `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          table { border-collapse: collapse; font-family: Arial, sans-serif; font-size: 12px; }
          th { background: #16a34a; color: #ffffff; font-weight: 700; }
          th, td { border: 1px solid #d1d5db; padding: 8px; vertical-align: top; }
        </style>
      </head>
      <body>
        <table>
          <thead><tr>${headerHtml}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </body>
    </html>
  `
}

function downloadBlob(content: BlobPart, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')

  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()

  URL.revokeObjectURL(url)
}

async function buildFullRecords(source: SantriRow[]) {
  const records: any[] = []

  for (const row of source) {
    const full = await resolveFullRecord(row.id, row)
    if (full) records.push(full)
  }

  return records
}

async function exportRows(source: SantriRow[], filename: string, type: 'csv' | 'excel') {
  if (!source.length) return

  exportBusy.value = true

  try {
    const records = await buildFullRecords(source)

    if (type === 'csv') {
      const csv = toCSV(records)
      downloadBlob('\uFEFF' + csv, `${filename}.csv`, 'text/csv;charset=utf-8;')
      return
    }

    const html = toExcelHtml(records)
    downloadBlob('\uFEFF' + html, `${filename}.xls`, 'application/vnd.ms-excel;charset=utf-8;')
  } finally {
    exportBusy.value = false
  }
}

async function exportFullCSV(source: SantriRow[], filename: string) {
  await exportRows(source, filename.replace(/\.csv$/i, ''), 'csv')
}

/** ===== Auto close ===== */
const isOpen = computed(() => !settings.value.isClosed)

const autoBadge = computed(() => {
  if (!settings.value.autoCloseEnabled || !settings.value.autoCloseAt) return ''

  const d = new Date(settings.value.autoCloseAt)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')

  return `Auto • ${y}-${m}-${day} ${hh}:${mm}`
})

function toggleOpen() {
  saveSettings({ isClosed: isOpen.value ? true : false })
}

function toLocalDatetimeInput(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const autoCloseLocal = computed(() => {
  if (!settings.value.autoCloseAt) return ''
  return toLocalDatetimeInput(new Date(settings.value.autoCloseAt))
})

function onAutoCloseChange(v: string) {
  if (!v) {
    saveSettings({ autoCloseAt: '' })
    return
  }

  saveSettings({
    autoCloseEnabled: true,
    autoCloseAt: new Date(v).toISOString()
  })
}

function pickTonight() {
  const d = new Date()
  d.setHours(23, 59, 0, 0)

  saveSettings({
    autoCloseEnabled: true,
    autoCloseAt: d.toISOString()
  })
}

function pickInDays(n: number) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  d.setHours(23, 59, 0, 0)

  saveSettings({
    autoCloseEnabled: true,
    autoCloseAt: d.toISOString()
  })
}

function clearSchedule() {
  saveSettings({
    autoCloseEnabled: false,
    autoCloseAt: ''
  })
}

function testScheduleNow() {
  const d = new Date(Date.now() + 60 * 1000)

  saveSettings({
    autoCloseEnabled: true,
    autoCloseAt: d.toISOString()
  })
}

const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | null = null

function startAutoCloseTicker() {
  if (timer) clearInterval(timer)

  timer = setInterval(() => {
    now.value = Date.now()
    checkAutoClose()
  }, 1000)
}

function checkAutoClose() {
  if (!settings.value.autoCloseEnabled || !settings.value.autoCloseAt) return

  const due = new Date(settings.value.autoCloseAt).getTime()

  if (Number.isFinite(due) && Date.now() >= due && !settings.value.isClosed) {
    saveSettings({ isClosed: true })
  }
}

const countdownText = computed(() => {
  if (!settings.value.autoCloseEnabled || !settings.value.autoCloseAt) return 'Tidak aktif'

  const due = new Date(settings.value.autoCloseAt).getTime()
  const diff = due - now.value

  if (!Number.isFinite(due)) return 'Jadwal tidak valid'
  if (diff <= 0) return 'Sudah waktunya ditutup'

  const sec = Math.floor(diff / 1000)
  const d = Math.floor(sec / 86400)
  const h = Math.floor((sec % 86400) / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  const pad = (n: number) => String(n).padStart(2, '0')

  return d > 0 ? `${d} hari ${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(h)}:${pad(m)}:${pad(s)}`
})

const countdownClass = computed(() => {
  if (!settings.value.autoCloseEnabled || !settings.value.autoCloseAt) return 'text-gray-600 dark:text-neutral-300'

  const due = new Date(settings.value.autoCloseAt).getTime()
  const diff = due - now.value

  if (diff <= 0) return 'text-rose-600 dark:text-rose-300'
  if (diff < 24 * 60 * 60 * 1000) return 'text-amber-600 dark:text-amber-300'
  return 'text-green-700 dark:text-green-300'
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (yearDebounce) clearTimeout(yearDebounce)
})
</script>