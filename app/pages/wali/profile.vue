<template>
  <section class="space-y-6 p-4 md:p-6">
    <!-- Hero -->
    <div class="relative overflow-hidden rounded-[32px] border border-green-100 bg-gradient-to-br from-green-600 via-green-600 to-lime-500 p-5 text-white shadow-[0_24px_70px_-28px_rgba(22,163,74,0.55)] dark:border-neutral-800 md:p-7">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-white blur-3xl"></div>
        <div class="absolute -bottom-14 left-8 h-40 w-40 rounded-full bg-lime-200 blur-3xl"></div>
      </div>

      <div class="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex min-w-0 items-start gap-4">
          <div class="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[28px] bg-white/15 text-3xl font-black ring-1 ring-white/20 backdrop-blur md:h-24 md:w-24">
            <img
              v-if="profile.photoUrl"
              :src="profile.photoUrl"
              :alt="profile.name"
              class="h-full w-full object-cover"
            />
            <span v-else>{{ initials(profile.name) }}</span>
          </div>

          <div class="min-w-0">
            <div class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold ring-1 ring-white/20 backdrop-blur">
              <span class="h-2 w-2 rounded-full bg-lime-300"></span>
              Wali Profile Center
            </div>

            <h1 class="mt-4 truncate text-2xl font-black tracking-tight md:text-4xl">
              {{ profile.name }}
            </h1>

            <p class="mt-2 max-w-xl text-sm leading-6 text-green-50/90 md:text-base">
              Kelola profil wali, data kontak, relasi santri, keamanan akun, dan ringkasan aktivitas pendampingan.
            </p>

            <button
              type="button"
              @click="openEditModal"
              class="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-green-700 shadow-lg shadow-green-900/10 transition hover:bg-green-50"
            >
              <Icon icon="ph:pencil-simple-duotone" class="h-5 w-5" />
              Edit Profil
            </button>
          </div>
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
              <div class="text-lg font-black">{{ santriProfiles.length }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Santri</div>
            </div>

            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ profileCompleteness }}%</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Profil</div>
            </div>

            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ parentEngagementScore }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Score</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="i in 4"
        :key="i"
        class="h-36 animate-pulse rounded-[28px] bg-slate-100 dark:bg-neutral-800"
      ></div>
    </div>

    <template v-else>
      <!-- Summary -->
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                Kelengkapan Profil
              </div>

              <div class="mt-2 flex items-end gap-1">
                <span class="text-3xl font-black text-slate-900 dark:text-white">{{ profileCompleteness }}</span>
                <span class="pb-1 text-xs font-bold text-slate-400 dark:text-neutral-500">%</span>
              </div>

              <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                Berdasarkan data identitas dan kontak.
              </p>
            </div>

            <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
              <Icon icon="ph:user-circle-check-duotone" class="h-6 w-6" />
            </div>
          </div>

          <div class="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800">
            <div
              class="h-full rounded-full bg-green-500 transition-all duration-500"
              :style="{ width: profileCompleteness + '%' }"
            ></div>
          </div>
        </div>

        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                Keamanan Akun
              </div>

              <div class="mt-2 flex items-end gap-1">
                <span class="text-3xl font-black text-slate-900 dark:text-white">{{ securityScore }}</span>
                <span class="pb-1 text-xs font-bold text-slate-400 dark:text-neutral-500">/100</span>
              </div>

              <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                Kontak aktif dan data pemulihan.
              </p>
            </div>

            <div :class="['grid h-12 w-12 shrink-0 place-items-center rounded-2xl', securityLevel.iconClass]">
              <Icon :icon="securityLevel.icon" class="h-6 w-6" />
            </div>
          </div>

          <div class="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800">
            <div
              :class="['h-full rounded-full transition-all duration-500', securityLevel.barClass]"
              :style="{ width: securityScore + '%' }"
            ></div>
          </div>
        </div>

        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                Aktivitas Wali
              </div>

              <div class="mt-2 flex items-end gap-1">
                <span class="text-3xl font-black text-slate-900 dark:text-white">{{ parentEngagementScore }}</span>
                <span class="pb-1 text-xs font-bold text-slate-400 dark:text-neutral-500">/100</span>
              </div>

              <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                Berdasarkan interaksi wali.
              </p>
            </div>

            <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
              <Icon icon="solar:chart-linear" class="h-6 w-6" />
            </div>
          </div>

          <div class="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800">
            <div
              class="h-full rounded-full bg-green-500 transition-all duration-500"
              :style="{ width: parentEngagementScore + '%' }"
            ></div>
          </div>
        </div>

        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                Relasi Santri
              </div>

              <div class="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                {{ santriProfiles.length }}
              </div>

              <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                Santri dalam pemantauan wali.
              </p>
            </div>

            <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
              <Icon icon="ph:student-duotone" class="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <!-- AI Insight -->
      <div class="grid gap-4 xl:grid-cols-[1fr,0.86fr]">
        <div class="relative overflow-hidden rounded-[32px] border border-green-100 bg-gradient-to-br from-slate-950 via-green-950 to-green-900 p-5 text-white shadow-sm dark:border-neutral-800">
          <div class="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-green-300/20 blur-3xl"></div>

          <div class="relative z-10">
            <div class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black ring-1 ring-white/15">
              <Icon icon="ph:sparkle-duotone" class="h-4 w-4" />
              Advanced AI Profile Insight
            </div>

            <h2 class="mt-4 text-xl font-black">
              {{ aiProfileInsight.title }}
            </h2>

            <p class="mt-2 text-sm leading-6 text-white/75">
              {{ aiProfileInsight.desc }}
            </p>

            <div class="mt-5 grid gap-3 sm:grid-cols-3">
              <div class="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                <div class="text-lg font-black">{{ profileHealthScore }}</div>
                <div class="mt-0.5 text-[11px] font-bold text-white/65">Profile Health</div>
              </div>

              <div class="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                <div class="text-lg font-black">{{ riskFlags.length }}</div>
                <div class="mt-0.5 text-[11px] font-bold text-white/65">Risk Flag</div>
              </div>

              <div class="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                <div class="truncate text-lg font-black">{{ profileSegment.label }}</div>
                <div class="mt-0.5 text-[11px] font-bold text-white/65">Segment</div>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 class="text-base font-black text-slate-900 dark:text-white">
                Rekomendasi Pro
              </h2>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                Analisis otomatis untuk profil wali.
              </p>
            </div>

            <span :class="['rounded-full px-3 py-1.5 text-xs font-black', profileSegment.badgeClass]">
              {{ profileSegment.label }}
            </span>
          </div>

          <div class="space-y-3">
            <div
              v-for="item in aiRecommendations"
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

      <!-- Main Profile -->
      <div class="grid gap-4 xl:grid-cols-[0.9fr,1.1fr]">
        <!-- Left -->
        <div class="space-y-4">
          <div class="overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="relative bg-gradient-to-br from-green-50 to-lime-50 p-5 dark:from-green-900/20 dark:to-lime-900/10">
              <div class="flex items-start gap-4">
                <div class="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[28px] bg-white text-2xl font-black text-green-700 shadow-sm dark:bg-neutral-900 dark:text-green-300">
                  <img
                    v-if="profile.photoUrl"
                    :src="profile.photoUrl"
                    :alt="profile.name"
                    class="h-full w-full object-cover"
                  />
                  <span v-else>{{ initials(profile.name) }}</span>
                </div>

                <div class="min-w-0">
                  <h2 class="truncate text-xl font-black text-slate-900 dark:text-white">
                    {{ profile.name }}
                  </h2>

                  <p class="mt-1 text-sm font-bold text-slate-500 dark:text-neutral-400">
                    {{ profile.relation || 'Wali Santri' }}
                  </p>

                  <div class="mt-3 flex flex-wrap gap-2">
                    <span :class="['rounded-full px-3 py-1.5 text-xs font-black', profileCompleteness >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300']">
                      Profil {{ profileCompleteness }}%
                    </span>

                    <span :class="['rounded-full px-3 py-1.5 text-xs font-black', securityLevel.badgeClass]">
                      {{ securityLevel.label }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-3 p-5">
              <InfoRow
                icon="ph:phone-call-duotone"
                label="Nomor HP"
                :value="profile.phone || 'Belum diisi'"
                :good="Boolean(profile.phone)"
              />

              <InfoRow
                icon="ph:envelope-simple-duotone"
                label="Email"
                :value="profile.email || 'Belum diisi'"
                :good="Boolean(profile.email)"
              />

              <InfoRow
                icon="ph:identification-card-duotone"
                label="NIK"
                :value="maskSensitive(profile.nik) || 'Belum diisi'"
                :good="Boolean(profile.nik)"
              />

              <InfoRow
                icon="ph:map-pin-duotone"
                label="Alamat"
                :value="profile.address || 'Belum diisi'"
                :good="Boolean(profile.address)"
              />

              <InfoRow
                icon="ph:briefcase-duotone"
                label="Pekerjaan"
                :value="profile.job || 'Belum diisi'"
                :good="Boolean(profile.job)"
              />
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="mb-4">
              <h2 class="text-base font-black text-slate-900 dark:text-white">
                Kelengkapan Data
              </h2>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                Field penting untuk validasi wali.
              </p>
            </div>

            <div class="space-y-3">
              <div
                v-for="item in completenessItems"
                :key="item.label"
                class="flex items-center justify-between gap-3 rounded-[22px] border border-slate-100 bg-slate-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/60"
              >
                <div class="flex items-center gap-3">
                  <div :class="['grid h-9 w-9 place-items-center rounded-2xl', item.done ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300']">
                    <Icon :icon="item.done ? 'ph:check-circle-duotone' : 'ph:warning-circle-duotone'" class="h-5 w-5" />
                  </div>

                  <div>
                    <div class="text-sm font-black text-slate-900 dark:text-white">{{ item.label }}</div>
                    <div class="text-xs text-slate-500 dark:text-neutral-400">{{ item.helper }}</div>
                  </div>
                </div>

                <span :class="['rounded-full px-2.5 py-1 text-[11px] font-black', item.done ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300']">
                  {{ item.done ? 'OK' : 'Isi' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right -->
        <div class="space-y-4">
          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Santri Terhubung
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Anak/santri yang berada dalam akun wali ini.
                </p>
              </div>

              <span class="rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
                {{ santriProfiles.length }} santri
              </span>
            </div>

            <div
              v-if="santriProfiles.length === 0"
              class="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-800/60"
            >
              <div class="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300">
                <Icon icon="ph:student-duotone" class="h-8 w-8" />
              </div>

              <h3 class="mt-4 text-base font-black text-slate-900 dark:text-white">
                Belum ada santri terhubung
              </h3>

              <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                Silakan hubungi admin untuk menghubungkan data santri.
              </p>
            </div>

            <div v-else class="grid gap-3 md:grid-cols-2">
              <button
                v-for="santri in santriProfiles"
                :key="santri.id"
                type="button"
                @click="selectedSantriId = santri.id"
                :class="[
                  'rounded-[26px] border p-4 text-left transition hover:-translate-y-0.5',
                  selectedSantriId === santri.id
                    ? 'border-green-200 bg-green-50 shadow-sm dark:border-green-900/30 dark:bg-green-900/10'
                    : 'border-slate-100 bg-slate-50 hover:bg-green-50 dark:border-neutral-800 dark:bg-neutral-800/60 dark:hover:bg-green-900/10'
                ]"
              >
                <div class="flex items-start gap-3">
                  <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-sm font-black text-green-700 shadow-sm dark:bg-neutral-900 dark:text-green-300">
                    {{ initials(santriNameOf(santri)) }}
                  </div>

                  <div class="min-w-0">
                    <div class="line-clamp-1 font-black text-slate-900 dark:text-white">
                      {{ santriNameOf(santri) }}
                    </div>

                    <p class="mt-0.5 text-xs font-bold text-slate-500 dark:text-neutral-400">
                      {{ santri.kelasFormal || santri.jenjang || santri.kelas || 'Kelas belum diatur' }}
                    </p>

                    <div class="mt-3 flex flex-wrap gap-1.5">
                      <span class="rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-slate-600 dark:bg-neutral-900 dark:text-neutral-300">
                        {{ santri.kamar || 'Kamar —' }}
                      </span>

                      <span class="rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-slate-600 dark:bg-neutral-900 dark:text-neutral-300">
                        {{ santri.status || 'Aktif' }}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="mb-4">
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Ringkasan Aktivitas
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Aktivitas wali dan santri.
                </p>
              </div>

              <div class="space-y-3">
                <ActivityRow icon="ph:chat-circle-text-duotone" label="Chat Admin" :value="activityStats.chat" />
                <ActivityRow icon="solar:letter-linear" label="Perizinan" :value="activityStats.permission" />
                <ActivityRow icon="material-symbols:parent-child-dining-outline-rounded" label="Kunjungan" :value="activityStats.visit" />
                <ActivityRow icon="akar-icons:money" label="Pembayaran" :value="activityStats.payment" />
              </div>
            </div>

            <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="mb-4">
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Status Santri
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Data ringkas santri terpilih.
                </p>
              </div>

              <div class="space-y-3">
                <ActivityRow icon="ph:book-open-text-duotone" label="Hafalan" :value="activityStats.hafalan" />
                <ActivityRow icon="ph:books-duotone" label="Kitab/Buku" :value="activityStats.book" />
                <ActivityRow icon="ph:warning-circle-duotone" label="Pelanggaran" :value="activityStats.violation" />
                <ActivityRow icon="ph:calendar-check-duotone" label="Absensi/Jadwal" :value="activityStats.schedule" />
              </div>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="mb-4">
              <h2 class="text-base font-black text-slate-900 dark:text-white">
                Audit Profil
              </h2>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                Deteksi otomatis hal yang perlu dilengkapi.
              </p>
            </div>

            <div v-if="riskFlags.length === 0" class="rounded-[24px] border border-green-100 bg-green-50 p-5 text-center text-sm font-bold text-green-700 dark:border-green-900/30 dark:bg-green-900/10 dark:text-green-300">
              Profil terlihat aman. Data utama wali sudah cukup lengkap.
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="flag in riskFlags"
                :key="flag.title"
                class="rounded-[24px] border border-amber-100 bg-amber-50/70 p-4 dark:border-amber-900/30 dark:bg-amber-900/10"
              >
                <div class="flex items-start gap-3">
                  <div class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                    <Icon icon="ph:warning-circle-duotone" class="h-5 w-5" />
                  </div>

                  <div>
                    <div class="font-black text-slate-900 dark:text-white">{{ flag.title }}</div>
                    <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-neutral-300">{{ flag.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Edit Modal -->
    <div
      v-if="editOpen"
      class="fixed inset-0 z-[9999] overflow-y-auto p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Tutup modal"
        @click="closeEditModal"
      ></button>

      <div class="relative z-10 flex min-h-full items-start justify-center">
        <div class="w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
          <div class="border-b border-slate-100 p-5 dark:border-neutral-800">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <Icon icon="ph:pencil-simple-duotone" class="h-4 w-4" />
                  Edit Profil Wali
                </div>

                <h3 class="mt-3 text-xl font-black text-slate-900 dark:text-white">
                  Lengkapi Data Profil
                </h3>

                <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                  Data ini membantu proses validasi wali, komunikasi lembaga, dan layanan santri.
                </p>
              </div>

              <button
                type="button"
                @click="closeEditModal"
                class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                <Icon icon="lucide:x" class="h-4 w-4" />
              </button>
            </div>
          </div>

          <form class="max-h-[75vh] space-y-5 overflow-y-auto p-5" @submit.prevent="saveProfile">
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
                  Nama Wali
                </label>

                <input
                  v-model.trim="form.name"
                  type="text"
                  required
                  placeholder="Nama lengkap wali"
                  class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
                  Hubungan
                </label>

                <select
                  v-model="form.relation"
                  class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                >
                  <option value="Ayah">Ayah</option>
                  <option value="Ibu">Ibu</option>
                  <option value="Wali">Wali</option>
                  <option value="Keluarga">Keluarga</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
                  Nomor HP
                </label>

                <input
                  v-model.trim="form.phone"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
                  Email
                </label>

                <input
                  v-model.trim="form.email"
                  type="email"
                  placeholder="email@domain.com"
                  class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
                  NIK
                </label>

                <input
                  v-model.trim="form.nik"
                  type="text"
                  inputmode="numeric"
                  placeholder="Nomor induk kependudukan"
                  class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
                  Pekerjaan
                </label>

                <input
                  v-model.trim="form.job"
                  type="text"
                  placeholder="Contoh: Wiraswasta"
                  class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
                  Link Foto Profil
                </label>

                <input
                  v-model.trim="form.photoUrl"
                  type="url"
                  placeholder="https://..."
                  class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
                  Kontak Darurat
                </label>

                <input
                  v-model.trim="form.emergencyPhone"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
                Alamat Lengkap
              </label>

              <textarea
                v-model.trim="form.address"
                rows="4"
                placeholder="Alamat domisili wali santri"
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              ></textarea>
            </div>

            <div
              v-if="formError"
              class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300"
            >
              {{ formError }}
            </div>

            <div
              v-if="formSuccess"
              class="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700 dark:border-green-900/40 dark:bg-green-900/10 dark:text-green-300"
            >
              {{ formSuccess }}
            </div>

            <div class="grid gap-2 sm:grid-cols-[0.75fr,1fr]">
              <button
                type="button"
                @click="closeEditModal"
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
                  icon="ph:floppy-disk-duotone"
                  class="h-5 w-5"
                />
                {{ formLoading ? 'Menyimpan...' : 'Simpan Profil' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div
      v-if="toastMessage"
      class="fixed bottom-24 left-1/2 z-[9999] w-[92%] max-w-sm -translate-x-1/2 rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white shadow-2xl"
    >
      {{ toastMessage }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { onValue, ref as dbRef, update } from 'firebase/database'
import { useNuxtApp, useRuntimeConfig, useState } from 'nuxt/app'

definePageMeta({
  layout: 'wali'
})

type AnyRow = Record<string, any>

type SantriProfile = AnyRow & {
  id: string
  _uid: string
  _path?: string
}

type WaliProfile = {
  uid: string
  name: string
  relation: string
  phone: string
  email: string
  nik: string
  address: string
  job: string
  photoUrl: string
  emergencyPhone: string
  createdAt?: number
  updatedAt?: number
}

type RecommendationItem = {
  title: string
  desc: string
  icon: string
  priority: string
  cardClass: string
  iconClass: string
}

type RiskFlag = {
  title: string
  desc: string
}

const InfoRow = defineComponent({
  name: 'InfoRow',
  props: {
    icon: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: String, required: true },
    good: { type: Boolean, default: false }
  },
  setup(props) {
    return () =>
      h('div', { class: 'flex items-start gap-3 rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60' }, [
        h('div', { class: props.good ? 'grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300' }, [
          h(Icon, { icon: props.icon, class: 'h-5 w-5' })
        ]),
        h('div', { class: 'min-w-0 flex-1' }, [
          h('div', { class: 'text-xs font-bold text-slate-500 dark:text-neutral-400' }, props.label),
          h('div', { class: 'mt-1 break-words text-sm font-black text-slate-900 dark:text-white' }, props.value)
        ])
      ])
  }
})

const ActivityRow = defineComponent({
  name: 'ActivityRow',
  props: {
    icon: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: Number, required: true }
  },
  setup(props) {
    return () =>
      h('div', { class: 'flex items-center justify-between gap-3 rounded-[22px] border border-slate-100 bg-slate-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/60' }, [
        h('div', { class: 'flex items-center gap-3' }, [
          h('div', { class: 'grid h-9 w-9 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' }, [
            h(Icon, { icon: props.icon, class: 'h-5 w-5' })
          ]),
          h('div', { class: 'text-sm font-black text-slate-900 dark:text-white' }, props.label)
        ]),
        h('div', { class: 'rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-700 dark:bg-neutral-900 dark:text-neutral-300' }, String(props.value))
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
const waliProfileRaw = ref<AnyRow>({})

const chatRawRows = ref<AnyRow[]>([])
const permissionRawRows = ref<AnyRow[]>([])
const visitRawRows = ref<AnyRow[]>([])
const paymentRawRows = ref<AnyRow[]>([])
const hafalanRawRows = ref<AnyRow[]>([])
const bookRawRows = ref<AnyRow[]>([])
const violationRawRows = ref<AnyRow[]>([])
const scheduleRawRows = ref<AnyRow[]>([])

const editOpen = ref(false)
const formLoading = ref(false)
const formError = ref('')
const formSuccess = ref('')
const toastMessage = ref('')

const form = ref<WaliProfile>({
  uid: '',
  name: '',
  relation: 'Wali',
  phone: '',
  email: '',
  nik: '',
  address: '',
  job: '',
  photoUrl: '',
  emergencyPhone: ''
})

let unsubscribers: Array<() => void> = []
let stopSessionWatch: (() => void) | null = null
let toastTimer: ReturnType<typeof setTimeout> | null = null
const bucketMap = new Map<string, { target: typeof chatRawRows; rows: AnyRow[] }>()

const currentSantri = computed(() => {
  return santriProfiles.value.find((item) => item.id === selectedSantriId.value) || santriProfiles.value[0] || null
})

const profile = computed<WaliProfile>(() => {
  const raw = waliProfileRaw.value || {}
  const session = sessionUser.value || {}

  return {
    uid: getCurrentUid(),
    name: String(raw.name || raw.nama || raw.displayName || session.name || session.displayName || session.waliName || 'Wali Santri'),
    relation: String(raw.relation || raw.hubungan || raw.statusWali || session.relation || 'Wali'),
    phone: String(raw.phone || raw.nohp || raw.noHp || raw.waliPhone || session.phone || session.waliPhone || ''),
    email: String(raw.email || session.email || ''),
    nik: String(raw.nik || raw.NIK || raw.noKtp || ''),
    address: String(raw.address || raw.alamat || session.address || ''),
    job: String(raw.job || raw.pekerjaan || ''),
    photoUrl: String(raw.photoUrl || raw.avatar || raw.image || session.photoUrl || ''),
    emergencyPhone: String(raw.emergencyPhone || raw.nohpDarurat || raw.kontakDarurat || ''),
    createdAt: parseDateValue(raw.createdAt),
    updatedAt: parseDateValue(raw.updatedAt)
  }
})

const completenessItems = computed(() => [
  {
    label: 'Nama wali',
    helper: 'Identitas utama wali santri.',
    done: Boolean(profile.value.name && profile.value.name !== 'Wali Santri')
  },
  {
    label: 'Nomor HP',
    helper: 'Digunakan untuk komunikasi cepat.',
    done: Boolean(profile.value.phone)
  },
  {
    label: 'Email',
    helper: 'Digunakan untuk akun dan notifikasi.',
    done: Boolean(profile.value.email)
  },
  {
    label: 'NIK',
    helper: 'Validasi identitas wali.',
    done: Boolean(profile.value.nik)
  },
  {
    label: 'Alamat',
    helper: 'Data domisili wali.',
    done: Boolean(profile.value.address)
  },
  {
    label: 'Kontak darurat',
    helper: 'Kontak cadangan jika diperlukan.',
    done: Boolean(profile.value.emergencyPhone)
  },
  {
    label: 'Pekerjaan',
    helper: 'Informasi pendukung data wali.',
    done: Boolean(profile.value.job)
  },
  {
    label: 'Foto profil',
    helper: 'Membantu identifikasi akun.',
    done: Boolean(profile.value.photoUrl)
  }
])

const profileCompleteness = computed(() => {
  const total = completenessItems.value.length
  const done = completenessItems.value.filter((item) => item.done).length

  return Math.round((done / total) * 100)
})

const securityScore = computed(() => {
  let score = 25

  if (profile.value.phone) score += 20
  if (profile.value.email) score += 20
  if (profile.value.emergencyPhone) score += 15
  if (profile.value.nik) score += 10
  if (profile.value.updatedAt) score += 10

  return Math.max(0, Math.min(100, score))
})

const securityLevel = computed(() => {
  if (securityScore.value >= 85) {
    return {
      label: 'Aman',
      icon: 'ph:shield-check-duotone',
      iconClass: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
      badgeClass: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
      barClass: 'bg-green-500'
    }
  }

  if (securityScore.value >= 60) {
    return {
      label: 'Cukup',
      icon: 'ph:shield-warning-duotone',
      iconClass: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
      badgeClass: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
      barClass: 'bg-green-500'
    }
  }

  return {
    label: 'Perlu Dilengkapi',
    icon: 'ph:warning-circle-duotone',
    iconClass: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
    barClass: 'bg-amber-500'
  }
})

const activityStats = computed(() => {
  return {
    chat: chatRawRows.value.length,
    permission: filterRowsForCurrentSantri(permissionRawRows.value).length,
    visit: filterRowsForCurrentSantri(visitRawRows.value).length,
    payment: filterRowsForCurrentSantri(paymentRawRows.value).length,
    hafalan: filterRowsForCurrentSantri(hafalanRawRows.value).length,
    book: filterRowsForCurrentSantri(bookRawRows.value).length,
    violation: filterRowsForCurrentSantri(violationRawRows.value).length,
    schedule: filterRowsForCurrentSantri(scheduleRawRows.value).length
  }
})

const parentEngagementScore = computed(() => {
  let score = 35

  score += Math.min(15, activityStats.value.chat * 3)
  score += Math.min(12, activityStats.value.permission * 3)
  score += Math.min(12, activityStats.value.visit * 3)
  score += Math.min(10, activityStats.value.payment * 2)
  score += Math.min(8, santriProfiles.value.length * 4)
  score += profileCompleteness.value >= 80 ? 8 : 0

  return Math.max(0, Math.min(100, Math.round(score)))
})

const profileHealthScore = computed(() => {
  const score = Math.round(
    profileCompleteness.value * 0.45 +
    securityScore.value * 0.25 +
    parentEngagementScore.value * 0.3
  )

  return Math.max(0, Math.min(100, score))
})

const profileSegment = computed(() => {
  if (profileHealthScore.value >= 85) {
    return {
      label: 'Excellent',
      badgeClass: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    }
  }

  if (profileHealthScore.value >= 70) {
    return {
      label: 'Healthy',
      badgeClass: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    }
  }

  if (profileHealthScore.value >= 50) {
    return {
      label: 'Needs Update',
      badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
    }
  }

  return {
    label: 'Incomplete',
    badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
  }
})

const riskFlags = computed<RiskFlag[]>(() => {
  const flags: RiskFlag[] = []

  if (!profile.value.phone) {
    flags.push({
      title: 'Nomor HP belum diisi',
      desc: 'Nomor HP penting untuk komunikasi cepat dari admin atau pengurus.'
    })
  }

  if (!profile.value.email) {
    flags.push({
      title: 'Email belum tersedia',
      desc: 'Email membantu proses pemulihan akun dan pengiriman informasi resmi.'
    })
  }

  if (!profile.value.nik) {
    flags.push({
      title: 'NIK belum lengkap',
      desc: 'NIK membantu validasi identitas wali saat pengajuan izin atau kebutuhan administrasi.'
    })
  }

  if (!profile.value.address) {
    flags.push({
      title: 'Alamat belum lengkap',
      desc: 'Alamat diperlukan untuk kelengkapan data wali santri.'
    })
  }

  if (!profile.value.emergencyPhone) {
    flags.push({
      title: 'Kontak darurat belum diisi',
      desc: 'Kontak darurat dibutuhkan jika nomor utama tidak dapat dihubungi.'
    })
  }

  if (santriProfiles.value.length === 0) {
    flags.push({
      title: 'Santri belum terhubung',
      desc: 'Hubungi admin agar data santri dapat ditautkan ke akun wali.'
    })
  }

  return flags
})

const aiProfileInsight = computed(() => {
  if (profileHealthScore.value >= 85) {
    return {
      title: 'Profil wali sudah sangat siap digunakan',
      desc: `Profile Health berada di ${profileHealthScore.value}/100. Data identitas, keamanan akun, dan aktivitas wali sudah kuat untuk mendukung komunikasi dengan lembaga.`
    }
  }

  if (profileHealthScore.value >= 70) {
    return {
      title: 'Profil wali cukup baik, tinggal penyempurnaan kecil',
      desc: `Profile Health berada di ${profileHealthScore.value}/100. Beberapa field minor masih bisa dilengkapi agar validasi dan komunikasi lebih lancar.`
    }
  }

  if (profileHealthScore.value >= 50) {
    return {
      title: 'Profil wali perlu diperbarui',
      desc: `Profile Health berada di ${profileHealthScore.value}/100. Lengkapi data kontak dan identitas agar akun wali lebih siap untuk layanan administrasi, perizinan, dan komunikasi santri.`
    }
  }

  return {
    title: 'Profil wali belum lengkap',
    desc: 'Data utama wali masih belum cukup. Lengkapi nomor HP, email, alamat, dan relasi santri agar layanan portal dapat berjalan optimal.'
  }
})

const aiRecommendations = computed<RecommendationItem[]>(() => {
  const items: RecommendationItem[] = []

  if (profileCompleteness.value < 80) {
    items.push({
      title: 'Lengkapi data profil inti',
      desc: `Kelengkapan profil masih ${profileCompleteness.value}%. Prioritaskan nomor HP, email, NIK, alamat, dan kontak darurat.`,
      icon: 'ph:user-circle-plus-duotone',
      priority: profileCompleteness.value < 50 ? 'Tinggi' : 'Sedang',
      cardClass: 'border-amber-100 bg-amber-50/70 dark:border-amber-900/30 dark:bg-amber-900/10',
      iconClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
    })
  }

  if (securityScore.value < 75) {
    items.push({
      title: 'Perkuat keamanan dan recovery akun',
      desc: 'Pastikan nomor HP, email, dan kontak darurat aktif agar akun mudah diverifikasi saat ada kebutuhan penting.',
      icon: 'ph:shield-warning-duotone',
      priority: 'Tinggi',
      cardClass: 'border-green-100 bg-green-50/70 dark:border-green-900/30 dark:bg-green-900/10',
      iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })
  }

  if (parentEngagementScore.value < 65) {
    items.push({
      title: 'Tingkatkan pemantauan wali',
      desc: 'Cek menu akademik, absensi, hafalan, pembayaran, pengumuman, dan chat admin secara berkala.',
      icon: 'ph:chart-line-up-duotone',
      priority: 'Sedang',
      cardClass: 'border-purple-100 bg-purple-50/70 dark:border-purple-900/30 dark:bg-purple-900/10',
      iconClass: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
    })
  }

  if (activityStats.value.violation > 0) {
    items.push({
      title: 'Pantau catatan kedisiplinan',
      desc: `Ada ${activityStats.value.violation} catatan pelanggaran yang perlu dipantau. Gunakan pendekatan dialog dan koordinasi dengan pengurus.`,
      icon: 'ph:warning-circle-duotone',
      priority: activityStats.value.violation >= 3 ? 'Tinggi' : 'Sedang',
      cardClass: 'border-rose-100 bg-rose-50/70 dark:border-rose-900/30 dark:bg-rose-900/10',
      iconClass: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
    })
  }

  if (santriProfiles.value.length === 0) {
    items.push({
      title: 'Hubungkan data santri',
      desc: 'Akun wali belum memiliki santri terhubung. Hubungi admin agar data akademik dan administrasi bisa tampil.',
      icon: 'ph:student-duotone',
      priority: 'Tinggi',
      cardClass: 'border-amber-100 bg-amber-50/70 dark:border-amber-900/30 dark:bg-amber-900/10',
      iconClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
    })
  }

  if (!items.length) {
    items.push({
      title: 'Profil sudah optimal',
      desc: 'Pertahankan data tetap terbaru dan gunakan portal wali secara berkala untuk memantau perkembangan santri.',
      icon: 'ph:sparkle-duotone',
      priority: 'Rendah',
      cardClass: 'border-green-100 bg-green-50/70 dark:border-green-900/30 dark:bg-green-900/10',
      iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })
  }

  return items.slice(0, 5)
})

function openEditModal() {
  form.value = { ...profile.value }
  formError.value = ''
  formSuccess.value = ''
  editOpen.value = true
}

function closeEditModal() {
  editOpen.value = false
  formError.value = ''
  formSuccess.value = ''
  formLoading.value = false
}

async function saveProfile() {
  formError.value = ''
  formSuccess.value = ''

  if (!form.value.name.trim()) {
    formError.value = 'Nama wali wajib diisi.'
    return
  }

  if (!$realtimeDb) {
    formError.value = 'Koneksi database belum tersedia.'
    return
  }

  const uid = getCurrentUid()

  if (!uid) {
    formError.value = 'Sesi wali tidak ditemukan. Silakan login ulang.'
    return
  }

  formLoading.value = true

  try {
    const now = Date.now()
    const payload = {
      uid,
      name: form.value.name,
      nama: form.value.name,
      relation: form.value.relation,
      hubungan: form.value.relation,
      phone: form.value.phone,
      nohp: form.value.phone,
      email: form.value.email,
      nik: form.value.nik,
      address: form.value.address,
      alamat: form.value.address,
      job: form.value.job,
      pekerjaan: form.value.job,
      photoUrl: form.value.photoUrl,
      emergencyPhone: form.value.emergencyPhone,
      kontakDarurat: form.value.emergencyPhone,
      updatedAt: now
    }

    await update(dbRef($realtimeDb, `${clientName}/waliProfiles/${uid}`), payload)

    waliProfileRaw.value = {
      ...waliProfileRaw.value,
      ...payload
    }

    sessionUser.value = {
      ...sessionUser.value,
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      photoUrl: payload.photoUrl
    }

    formSuccess.value = 'Profil berhasil diperbarui.'
    showToast('Profil berhasil disimpan.')
  } catch (e: any) {
    formError.value = e?.message || 'Gagal menyimpan profil.'
  } finally {
    formLoading.value = false
  }
}

function setupRealtime() {
  if (!$realtimeDb) {
    loading.value = false
    return
  }

  clearSubscriptions()

  const uid = getCurrentUid()
  const santriIds = resolveSantriIdsFromSession()

  loading.value = true
  santriProfiles.value = []

  if (uid) {
    const waliUnsub = onValue(dbRef($realtimeDb, `${clientName}/waliProfiles/${uid}`), (snap) => {
      waliProfileRaw.value = snap.val() || {}
      loading.value = false
    })

    unsubscribers.push(waliUnsub)
  }

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

  subscribeDeep(`${clientName}/waliChats`, chatRawRows)
  subscribeDeep(`${clientName}/perizinan`, permissionRawRows)
  subscribeDeep(`${clientName}/izin`, permissionRawRows)
  subscribeDeep(`${clientName}/kunjungan`, visitRawRows)
  subscribeDeep(`${clientName}/pembayaran`, paymentRawRows)
  subscribeDeep(`${clientName}/payments`, paymentRawRows)
  subscribeDeep(`${clientName}/hafalan`, hafalanRawRows)
  subscribeDeep(`${clientName}/tahfidz`, hafalanRawRows)
  subscribeDeep(`${clientName}/book`, bookRawRows)
  subscribeDeep(`${clientName}/books`, bookRawRows)
  subscribeDeep(`${clientName}/buku`, bookRawRows)
  subscribeDeep(`${clientName}/kitab`, bookRawRows)
  subscribeDeep(`${clientName}/pelanggaran`, violationRawRows)
  subscribeDeep(`${clientName}/violations`, violationRawRows)
  subscribeDeep(`${clientName}/schedule`, scheduleRawRows)
  subscribeDeep(`${clientName}/jadwal`, scheduleRawRows)

  setTimeout(() => {
    loading.value = false
  }, 1200)
}

function subscribeDeep(path: string, target: typeof chatRawRows) {
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

function rebuildTarget(target: typeof chatRawRows) {
  const rows: AnyRow[] = []

  for (const bucket of bucketMap.values()) {
    if (bucket.target === target) {
      rows.push(...bucket.rows)
    }
  }

  target.value = rows
}

function flattenRecords(value: any, path: string[] = [], depth = 0): AnyRow[] {
  if (!value || depth > 8) return []

  if (Array.isArray(value)) {
    return value.flatMap((item, index) => flattenRecords(item, [...path, String(index)], depth + 1))
  }

  if (typeof value !== 'object') return []

  const objectValue = value as AnyRow
  const lastPath = path[path.length - 1] || ''
  const pathText = path.join('/')

  if (looksLikeActivityRecord(objectValue)) {
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

function looksLikeActivityRecord(row: AnyRow) {
  const keys = Object.keys(row)

  return keys.some((key) => [
    'santriId',
    'idSantri',
    'santri_id',
    'studentId',
    'namaSantri',
    'santriName',
    'santri',
    'waliId',
    'senderId',
    'receiverId',
    'text',
    'message',
    'title',
    'judul',
    'status',
    'createdAt',
    'updatedAt',
    'tanggal',
    'date',
    'type',
    'jenis'
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

function upsertSantriProfile(profile: SantriProfile) {
  const index = santriProfiles.value.findIndex((item) => item.id === profile.id)

  if (index >= 0) {
    santriProfiles.value[index] = profile
  } else {
    santriProfiles.value.push(profile)
  }
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

function clearSubscriptions() {
  for (const unsubscribe of unsubscribers) {
    try {
      unsubscribe()
    } catch {}
  }

  unsubscribers = []
  bucketMap.clear()
}

function getCurrentUid() {
  return String(
    sessionUser.value?.uid ||
    sessionUser.value?.sub ||
    sessionUser.value?.id ||
    sessionUser.value?.email ||
    ''
  ).replace(/[.#$/\[\]]/g, '_')
}

function santriNameOf(santri?: AnyRow | null) {
  if (!santri) return sessionUser.value?.santriName || 'Santri'
  return santri.santri || santri.nama || santri.namaSantri || santri.name || sessionUser.value?.santriName || 'Santri'
}

function initials(name?: string) {
  const parts = String(name || 'Wali')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (!parts.length) return 'W'

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function maskSensitive(value?: string) {
  const text = String(value || '').trim()

  if (!text) return ''

  if (text.length <= 6) return '••••'

  return `${text.slice(0, 4)}${'•'.repeat(Math.max(4, text.length - 8))}${text.slice(-4)}`
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

onMounted(() => {
  stopSessionWatch = watch(
    () => JSON.stringify({
      uid: getCurrentUid(),
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

  if (toastTimer) {
    clearTimeout(toastTimer)
  }
})
</script>