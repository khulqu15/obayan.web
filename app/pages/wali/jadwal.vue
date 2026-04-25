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
            Smart Calendar
          </div>

          <h1 class="mt-4 text-2xl font-black tracking-tight md:text-4xl">
            Jadwal Wali Santri
          </h1>

          <p class="mt-2 max-w-xl text-sm leading-6 text-green-50/90 md:text-base">
            Kalender terpusat untuk jadwal santri, kegiatan lembaga, perizinan, dan kunjungan yang sudah dibuat.
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
              <div class="text-lg font-black">{{ calendarEvents.length }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Total</div>
            </div>

            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ todayEvents.length }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Hari Ini</div>
            </div>

            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ upcomingEvents.length }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Akan Datang</div>
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
                  Jadwal Santri
                </div>
                <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {{ eventStats.santri }}
                </div>
                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Jadwal khusus santri terpilih.
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <Icon icon="ph:student-duotone" class="h-6 w-6" />
              </div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Kegiatan Lembaga
                </div>
                <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {{ eventStats.lembaga }}
                </div>
                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Agenda pondok/sekolah untuk wali.
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <Icon icon="ph:buildings-duotone" class="h-6 w-6" />
              </div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Perizinan
                </div>
                <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {{ eventStats.perizinan }}
                </div>
                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Jadwal izin keluar/pulang.
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                <Icon icon="solar:letter-linear" class="h-6 w-6" />
              </div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Kunjungan
                </div>
                <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {{ eventStats.kunjungan }}
                </div>
                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Jadwal kunjungan wali/keluarga.
                </p>
              </div>

              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
                <Icon icon="material-symbols:parent-child-dining-outline-rounded" class="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        <!-- Toolbar -->
        <div class="rounded-[32px] border border-white/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr,0.7fr,0.7fr,0.7fr,0.55fr]">
            <div class="relative">
              <input
                v-model="filters.q"
                type="text"
                placeholder="Cari jadwal, kegiatan, tujuan, pengunjung, izin..."
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
              <option value="semua">Semua Jadwal</option>
              <option value="santri">Jadwal Santri</option>
              <option value="lembaga">Kegiatan Lembaga</option>
              <option value="perizinan">Perizinan</option>
              <option value="kunjungan">Kunjungan</option>
            </select>

            <select
              v-model="filters.status"
              class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="semua">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="menunggu">Menunggu</option>
              <option value="disetujui">Disetujui</option>
              <option value="ditolak">Ditolak</option>
              <option value="selesai">Selesai</option>
            </select>

            <select
              v-model="calendarMode"
              class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option value="month">Bulan</option>
              <option value="week">Minggu</option>
              <option value="agenda">Agenda</option>
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

        <!-- Calendar -->
        <div class="grid gap-4 xl:grid-cols-[1fr,0.82fr]">
          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Kalender Jadwal
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Jadwal santri, lembaga, perizinan, dan kunjungan dalam satu kalender.
                </p>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  @click="goToday"
                  class="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  Hari ini
                </button>

                <button
                  type="button"
                  @click="moveCalendar(-1)"
                  class="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <Icon icon="lucide:chevron-left" class="h-4 w-4" />
                </button>

                <div class="min-w-[170px] rounded-2xl bg-slate-50 px-4 py-2 text-center text-sm font-black text-slate-900 dark:bg-neutral-800 dark:text-white">
                  {{ calendarTitle }}
                </div>

                <button
                  type="button"
                  @click="moveCalendar(1)"
                  class="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <Icon icon="lucide:chevron-right" class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- Legend -->
            <div class="mb-4 flex flex-wrap gap-2">
              <button
                v-for="legend in legends"
                :key="legend.key"
                type="button"
                @click="filters.type = legend.key"
                :class="[
                  'inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-black transition',
                  filters.type === legend.key
                    ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/30 dark:bg-green-900/20 dark:text-green-300'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'
                ]"
              >
                <span :class="['h-2.5 w-2.5 rounded-full', legend.dotClass]"></span>
                {{ legend.label }}
              </button>
            </div>

            <!-- Month View -->
            <div v-if="calendarMode === 'month'" class="grid grid-cols-7 gap-2">
              <div
                v-for="day in weekDays"
                :key="day"
                class="rounded-2xl bg-slate-50 px-2 py-2 text-center text-[11px] font-black text-slate-500 dark:bg-neutral-800 dark:text-neutral-400"
              >
                {{ day }}
              </div>

              <button
                v-for="date in calendarDays"
                :key="date.key"
                type="button"
                :disabled="!date.inMonth"
                :class="[
                  'relative min-h-[96px] rounded-[22px] border p-2 text-left transition',
                  date.inMonth
                    ? 'border-slate-100 bg-white hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-green-900/10'
                    : 'cursor-default border-transparent bg-transparent opacity-30',
                  isSameDate(date.date, selectedDate)
                    ? 'border-green-300 bg-green-50 ring-4 ring-green-100 dark:border-green-700 dark:bg-green-900/20 dark:ring-green-500/10'
                    : ''
                ]"
                @click="date.inMonth && selectDate(date.date)"
              >
                <div class="flex items-start justify-between gap-2">
                  <span
                    :class="[
                      'grid h-8 w-8 place-items-center rounded-2xl text-xs font-black',
                      isToday(date.date)
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-50 text-slate-700 dark:bg-neutral-800 dark:text-neutral-200'
                    ]"
                  >
                    {{ date.day }}
                  </span>

                  <span
                    v-if="eventsByDate(date.date).length > 0"
                    class="rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-black text-white"
                  >
                    {{ eventsByDate(date.date).length }}
                  </span>
                </div>

                <div class="mt-2 space-y-1">
                  <div
                    v-for="event in eventsByDate(date.date).slice(0, 3)"
                    :key="event.id"
                    :class="['truncate rounded-xl px-2 py-1 text-[10px] font-bold', eventChipClass(event.type)]"
                  >
                    {{ event.title }}
                  </div>
                </div>
              </button>
            </div>

            <!-- Week View -->
            <div v-else-if="calendarMode === 'week'" class="space-y-3">
              <div
                v-for="date in weekDates"
                :key="date.toISOString()"
                class="rounded-[26px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
              >
                <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div class="flex items-center gap-3">
                    <div
                      :class="[
                        'grid h-12 w-12 place-items-center rounded-2xl text-sm font-black',
                        isToday(date)
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-slate-900 dark:bg-neutral-900 dark:text-white'
                      ]"
                    >
                      {{ date.getDate() }}
                    </div>

                    <div>
                      <div class="font-black text-slate-900 dark:text-white">
                        {{ weekdayLong(date) }}
                      </div>
                      <div class="text-xs font-bold text-slate-500 dark:text-neutral-400">
                        {{ formatDate(date.getTime()) }}
                      </div>
                    </div>
                  </div>

                  <span class="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-600 dark:bg-neutral-900 dark:text-neutral-300">
                    {{ eventsByDate(date).length }} jadwal
                  </span>
                </div>

                <div class="mt-4 space-y-2">
                  <button
                    v-for="event in eventsByDate(date)"
                    :key="event.id"
                    type="button"
                    @click="openDetail(event)"
                    class="flex w-full items-start gap-3 rounded-2xl bg-white p-3 text-left transition hover:bg-green-50 dark:bg-neutral-900 dark:hover:bg-green-900/10"
                  >
                    <div :class="['mt-1 h-3 w-3 shrink-0 rounded-full', eventDotClass(event.type)]"></div>

                    <div class="min-w-0">
                      <div class="truncate text-sm font-black text-slate-900 dark:text-white">
                        {{ formatTime(event.startAt) }} · {{ event.title }}
                      </div>
                      <div class="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-neutral-400">
                        {{ event.subtitle }}
                      </div>
                    </div>
                  </button>

                  <div
                    v-if="eventsByDate(date).length === 0"
                    class="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-center text-sm text-slate-400 dark:border-neutral-700 dark:bg-neutral-900"
                  >
                    Tidak ada jadwal.
                  </div>
                </div>
              </div>
            </div>

            <!-- Agenda View -->
            <div v-else class="space-y-3">
              <div
                v-if="agendaEvents.length === 0"
                class="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-neutral-700 dark:bg-neutral-800/60"
              >
                <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <Icon icon="solar:calendar-line-duotone" class="h-8 w-8" />
                </div>
                <h3 class="mt-4 text-lg font-black text-slate-900 dark:text-white">
                  Tidak ada jadwal
                </h3>
                <p class="mt-1 text-sm text-slate-500 dark:text-neutral-400">
                  Coba ubah filter atau periode kalender.
                </p>
              </div>

              <button
                v-for="event in agendaEvents"
                :key="event.id"
                type="button"
                @click="openDetail(event)"
                class="flex w-full items-start gap-3 rounded-[24px] border border-slate-100 bg-slate-50 p-4 text-left transition hover:-translate-y-0.5 hover:bg-green-50 dark:border-neutral-800 dark:bg-neutral-800/60 dark:hover:bg-green-900/10"
              >
                <div :class="['grid h-12 w-12 shrink-0 place-items-center rounded-2xl', eventIconBoxClass(event.type)]">
                  <Icon :icon="eventIcon(event.type)" class="h-6 w-6" />
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="truncate text-base font-black text-slate-900 dark:text-white">
                      {{ event.title }}
                    </h3>

                    <span :class="['rounded-full px-2.5 py-1 text-[11px] font-black capitalize', eventBadgeClass(event.type)]">
                      {{ eventTypeLabel(event.type) }}
                    </span>
                  </div>

                  <p class="mt-1 text-xs font-bold text-slate-500 dark:text-neutral-400">
                    {{ formatDateTime(event.startAt) }}
                    <span v-if="event.endAt">- {{ formatTime(event.endAt) }}</span>
                  </p>

                  <p class="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                    {{ event.subtitle }}
                  </p>
                </div>
              </button>
            </div>
          </div>

          <!-- Right Panel -->
          <div class="space-y-4">
            <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 class="text-base font-black text-slate-900 dark:text-white">
                    Jadwal Tanggal Dipilih
                  </h2>
                  <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                    {{ formatDate(selectedDate.getTime()) }}
                  </p>
                </div>

                <span class="rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  {{ selectedDateEvents.length }} jadwal
                </span>
              </div>

              <div v-if="selectedDateEvents.length === 0" class="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400">
                Tidak ada jadwal pada tanggal ini.
              </div>

              <div v-else class="space-y-3">
                <button
                  v-for="event in selectedDateEvents"
                  :key="event.id"
                  type="button"
                  @click="openDetail(event)"
                  class="flex w-full items-start gap-3 rounded-[24px] border border-slate-100 bg-slate-50 p-4 text-left transition hover:bg-green-50 dark:border-neutral-800 dark:bg-neutral-800/60 dark:hover:bg-green-900/10"
                >
                  <div :class="['mt-1 h-3 w-3 shrink-0 rounded-full', eventDotClass(event.type)]"></div>

                  <div class="min-w-0">
                    <div class="truncate font-black text-slate-900 dark:text-white">
                      {{ formatTime(event.startAt) }} · {{ event.title }}
                    </div>

                    <div class="mt-1 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                      {{ event.subtitle }}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="mb-4">
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Jadwal Terdekat
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Agenda terdekat dari hari ini.
                </p>
              </div>

              <div v-if="upcomingEvents.length === 0" class="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400">
                Belum ada jadwal mendatang.
              </div>

              <div v-else class="space-y-3">
                <button
                  v-for="event in upcomingEvents.slice(0, 6)"
                  :key="event.id"
                  type="button"
                  @click="openDetail(event)"
                  class="flex w-full items-start gap-3 rounded-[24px] border border-slate-100 bg-slate-50 p-4 text-left transition hover:bg-green-50 dark:border-neutral-800 dark:bg-neutral-800/60 dark:hover:bg-green-900/10"
                >
                  <div :class="['grid h-10 w-10 shrink-0 place-items-center rounded-2xl', eventIconBoxClass(event.type)]">
                    <Icon :icon="eventIcon(event.type)" class="h-5 w-5" />
                  </div>

                  <div class="min-w-0">
                    <div class="truncate font-black text-slate-900 dark:text-white">
                      {{ event.title }}
                    </div>
                    <div class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                      {{ formatDateTime(event.startAt) }}
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
                  Export Jadwal
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>

    <!-- Detail Modal -->
    <div
      v-if="detailOpen && selectedEvent"
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
        <div class="w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
          <div class="border-b border-slate-100 p-5 dark:border-neutral-800">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div :class="['inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black', eventBadgeClass(selectedEvent.type)]">
                  <Icon :icon="eventIcon(selectedEvent.type)" class="h-4 w-4" />
                  {{ eventTypeLabel(selectedEvent.type) }}
                </div>

                <h3 class="mt-3 text-xl font-black text-slate-900 dark:text-white">
                  {{ selectedEvent.title }}
                </h3>

                <p class="mt-1 text-sm text-slate-500 dark:text-neutral-400">
                  {{ formatDateTime(selectedEvent.startAt) }}
                  <span v-if="selectedEvent.endAt">- {{ formatTime(selectedEvent.endAt) }}</span>
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
                Ringkasan Jadwal
              </div>

              <p class="mt-2 text-sm leading-7 text-slate-700 dark:text-neutral-200">
                {{ selectedEvent.subtitle || 'Tidak ada ringkasan tambahan.' }}
              </p>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-xs font-bold text-slate-400">Kategori</div>
                <div class="mt-1 font-black text-slate-900 dark:text-white">{{ eventTypeLabel(selectedEvent.type) }}</div>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-xs font-bold text-slate-400">Status</div>
                <div class="mt-1 font-black text-slate-900 dark:text-white">{{ selectedEvent.status || 'Aktif' }}</div>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-xs font-bold text-slate-400">Mulai</div>
                <div class="mt-1 font-black text-slate-900 dark:text-white">{{ formatDateTime(selectedEvent.startAt) }}</div>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-xs font-bold text-slate-400">Selesai</div>
                <div class="mt-1 font-black text-slate-900 dark:text-white">{{ formatDateTime(selectedEvent.endAt) }}</div>
              </div>
            </div>

            <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
              <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                Detail / Catatan
              </div>

              <p class="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-neutral-300">
                {{ selectedEvent.description || selectedEvent.raw?.note || selectedEvent.raw?.catatan || selectedEvent.raw?.keterangan || selectedEvent.raw?.description || 'Belum ada catatan detail.' }}
              </p>
            </div>

            <a
              v-if="selectedEvent.raw?.attachmentUrl || selectedEvent.raw?.lampiran || selectedEvent.raw?.fileUrl"
              :href="selectedEvent.raw?.attachmentUrl || selectedEvent.raw?.lampiran || selectedEvent.raw?.fileUrl"
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
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { onValue, ref as dbRef } from 'firebase/database'
import { useNuxtApp, useRuntimeConfig, useState } from 'nuxt/app'
import { useAgenda, type AgendaItem } from '~/composables/data/useAgenda'

definePageMeta({
  layout: 'wali'
})

type AnyRow = Record<string, any>

type SantriProfile = AnyRow & {
  id: string
  _uid: string
  _path?: string
}

type EventType = 'santri' | 'lembaga' | 'perizinan' | 'kunjungan'

type CalendarEvent = {
  id: string
  type: EventType
  title: string
  subtitle: string
  description: string
  status: string
  startAt: number
  endAt: number
  raw: AnyRow
}

const config = useRuntimeConfig()
const { $realtimeDb } = useNuxtApp() as any
const sessionUser = useState<any>('sessionUser', () => ({}))

const clientName = String(config.public.clientName || 'alinayah')
const agenda = useAgenda()
const agendaRows = computed<AgendaItem[]>(() => {
  return Array.isArray(agenda.rows.value) ? agenda.rows.value : []
})

const loading = ref(true)
const selectedSantriId = ref('')
const santriProfiles = ref<SantriProfile[]>([])

const scheduleRawRows = ref<AnyRow[]>([])
const institutionRawRows = ref<AnyRow[]>([])
const permissionRawRows = ref<AnyRow[]>([])
const visitRawRows = ref<AnyRow[]>([])

const calendarMode = ref<'month' | 'week' | 'agenda'>('month')
const calendarCursor = ref(startOfMonth(new Date()))
const selectedDate = ref(startOfDayDate(new Date()))

const detailOpen = ref(false)
const selectedEvent = ref<CalendarEvent | null>(null)

const filters = ref({
  q: '',
  type: 'semua',
  status: 'semua'
})

let unsubscribers: Array<() => void> = []
let stopSessionWatch: (() => void) | null = null

const bucketMap = new Map<string, { target: typeof scheduleRawRows; rows: AnyRow[] }>()

const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

const legends = [
  {
    key: 'santri',
    label: 'Jadwal Santri',
    dotClass: 'bg-green-500'
  },
  {
    key: 'lembaga',
    label: 'Kegiatan Lembaga',
    dotClass: 'bg-green-500'
  },
  {
    key: 'perizinan',
    label: 'Perizinan',
    dotClass: 'bg-amber-500'
  },
  {
    key: 'kunjungan',
    label: 'Kunjungan',
    dotClass: 'bg-purple-500'
  }
]

const currentSantri = computed(() => {
  return santriProfiles.value.find((item) => item.id === selectedSantriId.value) || santriProfiles.value[0] || null
})

function normalizeAgendaSchedule(row: AgendaItem): CalendarEvent {
  const startAt = Number(row.startAt) || parseDateValue(row.start) || Date.now()
  const endAt = Number(row.endAt) || parseDateValue(row.end) || startAt + 60 * 60 * 1000

  return {
    id: `agenda-${row.id}`,
    type: 'lembaga',
    title: row.title || 'Agenda Lembaga',
    subtitle: row.desc || row.location || 'Agenda kegiatan lembaga pendidikan',
    description: row.desc || '',
    status: 'aktif',
    startAt,
    endAt,
    raw: {
      ...row,
      source: 'useAgenda',
      attachmentUrl: row.thumbUrl,
      location: row.location
    }
  }
}

function dedupeEvents(events: CalendarEvent[]) {
  const map = new Map<string, CalendarEvent>()

  for (const event of events) {
    const key = `${event.id}-${event.startAt}-${normalizeText(event.title)}`
    if (!map.has(key)) map.set(key, event)
  }

  return Array.from(map.values())
}

const calendarEvents = computed<CalendarEvent[]>(() => {
  const events: CalendarEvent[] = []

  for (const row of scheduleRawRows.value) {
    const type = scheduleEventType(row)

    if (type === 'santri' && !belongsToCurrentSantri(row)) continue

    events.push(normalizeGeneralSchedule(row, type))
  }

  for (const row of agendaRows.value) {
    events.push(normalizeAgendaSchedule(row))
  }

  for (const row of institutionRawRows.value) {
    events.push(normalizeGeneralSchedule(row, 'lembaga'))
  }

  for (const row of permissionRawRows.value) {
    if (!belongsToCurrentSantri(row)) continue
    events.push(normalizePermissionSchedule(row))
  }

  for (const row of visitRawRows.value) {
    if (!belongsToCurrentSantri(row)) continue
    events.push(normalizeVisitSchedule(row))
  }

  return dedupeEvents(events)
    .filter((event) => event.startAt > 0)
    .filter((event) => filterEvent(event))
    .sort((a, b) => a.startAt - b.startAt)
})

const todayEvents = computed(() => {
  return calendarEvents.value.filter((event) => isSameDate(new Date(event.startAt), new Date()))
})

const upcomingEvents = computed(() => {
  const now = Date.now()

  return calendarEvents.value
    .filter((event) => event.startAt >= now)
    .sort((a, b) => a.startAt - b.startAt)
})

const selectedDateEvents = computed(() => {
  return eventsByDate(selectedDate.value)
})

const agendaEvents = computed(() => {
  return calendarEvents.value
    .filter((event) => event.startAt >= startOfDayTime(calendarCursor.value.getTime()))
    .slice(0, 60)
})

const eventStats = computed(() => {
  return {
    santri: calendarEvents.value.filter((event) => event.type === 'santri').length,
    lembaga: calendarEvents.value.filter((event) => event.type === 'lembaga').length,
    perizinan: calendarEvents.value.filter((event) => event.type === 'perizinan').length,
    kunjungan: calendarEvents.value.filter((event) => event.type === 'kunjungan').length
  }
})

const calendarTitle = computed(() => {
  if (calendarMode.value === 'week') {
    const dates = weekDates.value
    return `${formatDateShort(dates[0].getTime())} - ${formatDateShort(dates[6].getTime())}`
  }

  return new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric'
  }).format(calendarCursor.value)
})

const calendarDays = computed(() => {
  const first = startOfMonth(calendarCursor.value)
  const firstDay = first.getDay() || 7
  const start = new Date(first)
  start.setDate(first.getDate() - firstDay + 1)

  const days: Array<{
    key: string
    date: Date
    day: number
    inMonth: boolean
  }> = []

  for (let i = 0; i < 42; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)

    days.push({
      key: date.toISOString(),
      date,
      day: date.getDate(),
      inMonth: date.getMonth() === calendarCursor.value.getMonth()
    })
  }

  return days
})

const weekDates = computed(() => {
  const base = new Date(selectedDate.value)
  const day = base.getDay() || 7
  const start = new Date(base)
  start.setDate(base.getDate() - day + 1)
  start.setHours(0, 0, 0, 0)

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return date
  })
})

function resetFilters() {
  filters.value = {
    q: '',
    type: 'semua',
    status: 'semua'
  }
}

function goToday() {
  const today = new Date()
  selectedDate.value = startOfDayDate(today)
  calendarCursor.value = startOfMonth(today)
}

function moveCalendar(step: number) {
  if (calendarMode.value === 'week') {
    const next = new Date(selectedDate.value)
    next.setDate(next.getDate() + step * 7)
    selectedDate.value = startOfDayDate(next)
    calendarCursor.value = startOfMonth(next)
    return
  }

  const next = new Date(calendarCursor.value)
  next.setMonth(next.getMonth() + step)
  calendarCursor.value = startOfMonth(next)
}

function selectDate(date: Date) {
  selectedDate.value = startOfDayDate(date)
}

function openDetail(event: CalendarEvent) {
  selectedEvent.value = event
  detailOpen.value = true
}

function closeDetail() {
  selectedEvent.value = null
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

  subscribeDeep(`${clientName}/jadwal`, scheduleRawRows)
  subscribeDeep(`${clientName}/schedule`, scheduleRawRows)
  subscribeDeep(`${clientName}/schedules`, scheduleRawRows)
  subscribeDeep(`${clientName}/jadwalSantri`, scheduleRawRows)
  subscribeDeep(`${clientName}/studentSchedules`, scheduleRawRows)

  subscribeDeep(`${clientName}/kegiatan`, institutionRawRows)
  subscribeDeep(`${clientName}/agendas`, institutionRawRows)
  subscribeDeep(`${clientName}/announcements`, institutionRawRows)
  subscribeDeep(`${clientName}/events`, institutionRawRows)
  subscribeDeep(`${clientName}/jadwalLembaga`, institutionRawRows)

  subscribeDeep(`${clientName}/izin`, permissionRawRows)
  subscribeDeep(`${clientName}/perizinan`, permissionRawRows)
  subscribeDeep(`${clientName}/permissions`, permissionRawRows)
  subscribeDeep(`${clientName}/permissionRequests`, permissionRawRows)

  subscribeDeep(`${clientName}/kunjungan`, visitRawRows)
  subscribeDeep(`${clientName}/visits`, visitRawRows)
  subscribeDeep(`${clientName}/visitRequests`, visitRawRows)
  subscribeDeep(`${clientName}/jadwalKunjungan`, visitRawRows)
}

function subscribeDeep(path: string, target: typeof scheduleRawRows) {
  if (!$realtimeDb) return

  const unsubscribe = onValue(dbRef($realtimeDb, path), (snap) => {
    bucketMap.set(path, {
      target,
      rows: flattenRecords(snap.val(), [path], 0)
    })

    rebuildTarget(target)
    loading.value = false
  })

  unsubscribers.push(unsubscribe)
}

function rebuildTarget(target: typeof scheduleRawRows) {
  const rows: AnyRow[] = []

  for (const bucket of bucketMap.values()) {
    if (bucket.target === target) {
      rows.push(...bucket.rows)
    }
  }

  target.value = rows
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

  if (looksLikeScheduleRecord(objectValue)) {
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

function looksLikeScheduleRecord(row: AnyRow) {
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
    'kegiatan',
    'agenda',
    'purpose',
    'tujuan',
    'keperluan',
    'jenis',
    'type',
    'kategori',
    'category',
    'date',
    'tanggal',
    'startDate',
    'endDate',
    'tanggalMulai',
    'tanggalSelesai',
    'visitDate',
    'tanggalKunjungan',
    'createdAt',
    'status'
  ].includes(key))
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

function scheduleEventType(row: AnyRow): EventType {
  const text = normalizeText([
    row.type,
    row.jenis,
    row.kategori,
    row.category,
    row.scope,
    row.audience,
    row.target,
    row._path
  ].join(' '))

  if (text.includes('lembaga') || text.includes('pondok') || text.includes('sekolah') || text.includes('kegiatan')) return 'lembaga'
  if (text.includes('santri') || text.includes('student')) return 'santri'

  const hasSantriIdentity = [
    row.santriId,
    row.idSantri,
    row.santri_id,
    row.studentId,
    row.namaSantri,
    row.santriName,
    row.santri
  ].some(Boolean)

  return hasSantriIdentity ? 'santri' : 'lembaga'
}

function normalizeGeneralSchedule(row: AnyRow, type: EventType): CalendarEvent {
  const startAt = extractStartDate(row)
  const endAt = extractEndDate(row) || startAt + 60 * 60 * 1000

  return {
    id: `${type}-${row._uid || row.id || row._path}`,
    type,
    title: row.title || row.judul || row.name || row.nama || row.kegiatan || row.agenda || row.subject || 'Jadwal',
    subtitle: row.subtitle || row.ringkasan || row.description || row.keterangan || row.note || eventTypeLabel(type),
    description: row.description || row.keterangan || row.note || row.catatan || '',
    status: normalizeStatus(row.status || row.state || row.approvalStatus || 'aktif'),
    startAt,
    endAt,
    raw: row
  }
}

function normalizePermissionSchedule(row: AnyRow): CalendarEvent {
  const startAt = extractStartDate(row)
  const endAt = extractEndDate(row) || startAt + 3 * 60 * 60 * 1000

  return {
    id: `perizinan-${row._uid || row.id || row._path}`,
    type: 'perizinan',
    title: row.title || row.jenis || row.type || row.kategori || row.keperluan || 'Perizinan Santri',
    subtitle: row.alasan || row.keperluan || row.keterangan || row.note || 'Jadwal perizinan santri',
    description: row.alasan || row.keperluan || row.keterangan || row.note || '',
    status: normalizeStatus(row.status || row.approvalStatus || 'menunggu'),
    startAt,
    endAt,
    raw: row
  }
}

function normalizeVisitSchedule(row: AnyRow): CalendarEvent {
  const startAt = extractVisitDate(row)
  const endAt = extractEndDate(row) || startAt + Number(row.durationMinutes || row.durasi || 60) * 60 * 1000

  return {
    id: `kunjungan-${row._uid || row.id || row._path}`,
    type: 'kunjungan',
    title: row.purpose || row.tujuan || row.keperluan || row.title || 'Kunjungan Santri',
    subtitle: [
      row.visitorName || row.namaPengunjung || row.pengunjung,
      row.relationship || row.hubungan,
      row.note || row.catatan || row.keterangan
    ].filter(Boolean).join(' • ') || 'Jadwal kunjungan wali/keluarga',
    description: row.note || row.catatan || row.description || row.keterangan || '',
    status: normalizeStatus(row.status || row.approvalStatus || 'menunggu'),
    startAt,
    endAt,
    raw: row
  }
}

function filterEvent(event: CalendarEvent) {
  if (filters.value.type !== 'semua' && event.type !== filters.value.type) return false
  if (filters.value.status !== 'semua' && event.status !== filters.value.status) return false

  if (filters.value.q.trim()) {
    const q = normalizeText(filters.value.q)
    const text = normalizeText([
      event.title,
      event.subtitle,
      event.description,
      event.status,
      eventTypeLabel(event.type),
      event.raw?.visitorName,
      event.raw?.namaPengunjung,
      event.raw?.pengunjung,
      event.raw?.alasan,
      event.raw?.keperluan,
      event.raw?.tujuan,
      event.raw?.kegiatan,
      event.raw?.agenda
    ].join(' '))

    if (!text.includes(q)) return false
  }

  return true
}

function normalizeStatus(value: any) {
  const status = normalizeText(value)

  if (status.includes('setuju') || status.includes('approved') || status.includes('diterima')) return 'disetujui'
  if (status.includes('tolak') || status.includes('reject')) return 'ditolak'
  if (status.includes('selesai') || status.includes('done') || status.includes('complete')) return 'selesai'
  if (status.includes('menunggu') || status.includes('pending') || status.includes('proses') || status.includes('review')) return 'menunggu'

  return 'aktif'
}

function extractStartDate(row: AnyRow) {
  const candidates = [
    row.startDate,
    row.tanggalMulai,
    row.tanggalKunjungan,
    row.visitDate,
    row.date,
    row.tanggal,
    row.scheduleDate,
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
    row.tanggalSelesai,
    row.tanggalKembali,
    row.end,
    row.until
  ]

  for (const value of candidates) {
    const parsed = parseDateValue(value)
    if (parsed) return parsed
  }

  return 0
}

function extractVisitDate(row: AnyRow) {
  const candidates = [
    row.visitDate,
    row.tanggalKunjungan,
    row.startDate,
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

function eventsByDate(date: Date) {
  return calendarEvents.value.filter((event) => isSameDate(new Date(event.startAt), date))
}

function startOfDayDate(date: Date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function startOfDayTime(value: number) {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

function startOfMonth(date: Date) {
  const next = new Date(date)
  next.setDate(1)
  next.setHours(0, 0, 0, 0)
  return next
}

function isSameDate(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function isToday(date: Date) {
  return isSameDate(date, new Date())
}

function weekdayLong(date: Date) {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long'
  }).format(date)
}

function eventTypeLabel(type: EventType) {
  if (type === 'santri') return 'Jadwal Santri'
  if (type === 'lembaga') return 'Kegiatan Lembaga'
  if (type === 'perizinan') return 'Perizinan'
  return 'Kunjungan'
}

function eventIcon(type: EventType) {
  if (type === 'santri') return 'ph:student-duotone'
  if (type === 'lembaga') return 'ph:buildings-duotone'
  if (type === 'perizinan') return 'solar:letter-linear'
  return 'material-symbols:parent-child-dining-outline-rounded'
}

function eventDotClass(type: EventType) {
  if (type === 'santri') return 'bg-green-500'
  if (type === 'lembaga') return 'bg-green-500'
  if (type === 'perizinan') return 'bg-amber-500'
  return 'bg-purple-500'
}

function eventChipClass(type: EventType) {
  if (type === 'santri') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (type === 'lembaga') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (type === 'perizinan') return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  return 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
}

function eventBadgeClass(type: EventType) {
  return eventChipClass(type)
}

function eventIconBoxClass(type: EventType) {
  if (type === 'santri') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (type === 'lembaga') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (type === 'perizinan') return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  return 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
}

function formatDate(value?: number) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium'
  }).format(new Date(value))
}

function formatDateShort(value?: number) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short'
  }).format(new Date(value))
}

function formatDateTime(value?: number) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))
}

function formatTime(value?: number) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
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
    'Kategori',
    'Judul',
    'Status',
    'Mulai',
    'Selesai',
    'Keterangan'
  ]

  const lines = calendarEvents.value.map((event) => [
    santriNameOf(currentSantri.value),
    eventTypeLabel(event.type),
    event.title,
    event.status,
    formatDateTime(event.startAt),
    formatDateTime(event.endAt),
    event.subtitle || event.description || ''
  ].map(toCsvCell).join(','))

  const csv = '\uFEFF' + [headers.join(','), ...lines].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })

  saveBlob(blob, 'schedule_wali.csv')
}

watch(
  calendarCursor,
  (date) => {
    agenda.subscribeMonth(date.getFullYear(), date.getMonth())
  },
  { immediate: true }
)

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