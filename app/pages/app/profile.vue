<template>
  <div class="space-y-6 p-4 md:p-6 text-gray-800 dark:text-neutral-200">
    <div v-if="pageLoading" class="grid gap-4 xl:grid-cols-[1.15fr,0.85fr]">
      <div class="h-72 animate-pulse rounded-[32px] border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"></div>
      <div class="h-72 animate-pulse rounded-[32px] border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"></div>
    </div>

    <template v-else>
      <section class="relative overflow-hidden rounded-[34px] border border-green-100 bg-gradient-to-br from-green-600 via-emerald-600 to-lime-500 p-5 text-white shadow-[0_26px_60px_-18px_rgba(22,163,74,0.35)] md:p-6 dark:border-white/10">
        <div class="absolute inset-0 opacity-25">
          <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white blur-3xl"></div>
          <div class="absolute bottom-0 left-8 h-32 w-32 rounded-full bg-lime-100 blur-3xl"></div>
        </div>

        <div class="relative z-10 grid gap-5 xl:grid-cols-[1.25fr,0.75fr]">
          <div class="min-w-0">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div class="relative shrink-0">
                <div class="rounded-[28px] bg-white/95 p-2 shadow-xl ring-1 ring-black/5 backdrop-blur dark:bg-neutral-900/95 dark:ring-white/10">
                  <img
                    :src="avatarPreview || profile.avatar || '/assets/pp.jpg'"
                    alt="Avatar"
                    class="h-28 w-28 rounded-[22px] object-cover sm:h-32 sm:w-32"
                  />
                </div>
                <button
                  type="button"
                  class="absolute -bottom-2 -right-2 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-green-700 shadow-lg ring-1 ring-black/5 transition hover:bg-gray-50 dark:bg-neutral-900 dark:text-green-300 dark:ring-white/10 dark:hover:bg-neutral-800"
                  @click="showAvatarModal = true"
                  aria-label="Ubah avatar"
                >
                  <Icon icon="lucide:camera" class="h-5 w-5" />
                </button>
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h1 class="truncate text-2xl font-black tracking-tight text-white md:text-3xl">
                    {{ profile.displayName || 'Pengguna' }}
                  </h1>
                  <span class="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold ring-1 ring-white/20">
                    <Icon icon="lucide:badge-check" class="h-3.5 w-3.5" />
                    {{ roleLabel }}
                  </span>
                  <span class="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold ring-1 ring-white/20">
                    <Icon icon="lucide:key-round" class="h-3.5 w-3.5" />
                    {{ accessLabel }}
                  </span>
                </div>
                <p class="mt-2 truncate text-sm text-green-50/95">{{ profile.email || '—' }}</p>
                <div class="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-green-50/90">
                  <span class="inline-flex items-center gap-1.5"><Icon icon="lucide:building-2" class="h-3.5 w-3.5" /> {{ profile.org || 'Belum diisi' }}</span>
                  <span class="inline-flex items-center gap-1.5"><Icon icon="lucide:map-pin" class="h-3.5 w-3.5" /> {{ profile.location || 'Belum diisi' }}</span>
                  <span class="inline-flex items-center gap-1.5"><Icon icon="lucide:clock-3" class="h-3.5 w-3.5" /> Bergabung {{ joinedAt }}</span>
                </div>
              </div>
            </div>

            <div class="mt-5 flex flex-wrap gap-2">
              <button
                v-for="item in quickLinks"
                :key="item.href"
                type="button"
                class="inline-flex items-center gap-2 rounded-2xl bg-white/12 px-3.5 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/18"
                @click="go(item.href)"
              >
                <Icon :icon="item.icon" class="h-4 w-4" />
                {{ item.label }}
              </button>
            </div>
          </div>

          <div class="grid gap-3 xl:grid-cols-3 grid-cols-1">
            <div class="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
              <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-green-100">Peran</div>
              <div class="mt-2 text-base font-black">{{ roleLabel }}</div>
              <div class="mt-1 text-xs text-green-50/90">Role aktif dari Firebase</div>
            </div>
            <div class="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
              <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-green-100">Hak Akses</div>
              <div class="mt-2 text-base font-black">{{ allowedRoutes.length }} route</div>
              <div class="mt-1 text-xs text-green-50/90">Scope menu dan halaman aktif</div>
            </div>
            <div class="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
              <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-green-100">Terakhir Aktif</div>
              <div class="mt-2 text-base font-black leading-6">{{ lastActive }}</div>
              <div class="mt-1 text-xs text-green-50/90">Data sinkron dari profil terbaru</div>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-4 xl:grid-cols-[1.08fr,0.92fr]">
        <div class="rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="border-b border-gray-200 px-4 py-4 dark:border-neutral-800 sm:px-6">
            <nav class="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800" role="tablist">
              <button
                v-for="tab in tabs"
                :key="tab.key"
                type="button"
                :class="[
                  'rounded-2xl px-4 py-2 text-sm font-semibold transition',
                  activeTab === tab.key
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                    : 'text-gray-500 hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white'
                ]"
                @click="activeTab = tab.key"
              >
                {{ tab.label }}
              </button>
            </nav>
          </div>

          <div class="px-4 pb-6 pt-5 sm:px-6">
            <div v-show="activeTab === 'overview'" class="space-y-4">
              <form class="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900" @submit.prevent="saveProfile">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Informasi Profil</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Kelola identitas akun dan informasi yang tampil di dashboard.</p>
                  </div>
                  <div class="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    <Icon icon="lucide:database-zap" class="h-3.5 w-3.5" />
                    Firebase Live
                  </div>
                </div>

                <div class="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Nama</label>
                    <input v-model.trim="profileForm.displayName" type="text" :class="inputClass" required />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Email</label>
                    <input v-model.trim="profileForm.email" type="email" :class="inputClass" required />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Organisasi</label>
                    <input v-model.trim="profileForm.org" type="text" :class="inputClass" placeholder="Contoh: Ponpes Alinayah" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Lokasi</label>
                    <input v-model.trim="profileForm.location" type="text" :class="inputClass" placeholder="Kota / area" />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Bio</label>
                    <textarea v-model.trim="profileForm.bio" rows="4" :class="inputClass" placeholder="Tuliskan deskripsi singkat tentang akun atau tanggung jawab Anda..."></textarea>
                  </div>
                </div>

                <div class="mt-5 flex flex-wrap items-center gap-2">
                  <button type="submit" class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60" :disabled="savingProfile">
                    {{ savingProfile ? 'Menyimpan...' : 'Simpan Profil' }}
                  </button>
                  <button type="button" class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800" :disabled="savingProfile" @click="resetProfile">
                    Reset
                  </button>
                  <span v-if="noteProfile" class="text-xs font-medium text-emerald-600 dark:text-emerald-300">{{ noteProfile }}</span>
                </div>
              </form>

              <div class="grid gap-4 lg:grid-cols-2">
                <div class="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Preferensi</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Atur pengalaman penggunaan sesuai kebiasaan Anda.</p>
                  </div>

                  <div class="mt-4 space-y-4">
                    <div class="flex items-center justify-between rounded-[22px] border border-gray-200 bg-gray-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/60">
                      <div>
                        <div class="text-sm font-semibold text-gray-900 dark:text-white">Email notifikasi</div>
                        <div class="text-xs text-gray-500 dark:text-neutral-400">Terima update penting melalui email</div>
                      </div>
                      <label class="relative inline-flex cursor-pointer items-center">
                        <input v-model="prefs.emailNotif" type="checkbox" class="peer sr-only" />
                        <span class="h-6 w-11 rounded-full bg-gray-200 transition after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:bg-green-600 peer-checked:after:translate-x-5 dark:bg-neutral-700"></span>
                      </label>
                    </div>

                    <div class="flex items-center justify-between rounded-[22px] border border-gray-200 bg-gray-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/60">
                      <div>
                        <div class="text-sm font-semibold text-gray-900 dark:text-white">Push notifikasi</div>
                        <div class="text-xs text-gray-500 dark:text-neutral-400">Aktifkan notifikasi langsung di aplikasi</div>
                      </div>
                      <label class="relative inline-flex cursor-pointer items-center">
                        <input v-model="prefs.pushNotif" type="checkbox" class="peer sr-only" />
                        <span class="h-6 w-11 rounded-full bg-gray-200 transition after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:bg-green-600 peer-checked:after:translate-x-5 dark:bg-neutral-700"></span>
                      </label>
                    </div>

                    <div>
                      <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Bahasa</label>
                      <select v-model="prefs.lang" :class="inputClass">
                        <option value="id">Indonesia</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>

                  <div class="mt-4 flex flex-wrap items-center gap-2">
                    <button type="button" class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60" :disabled="savingPrefs" @click="savePrefs">
                      {{ savingPrefs ? 'Menyimpan...' : 'Simpan Preferensi' }}
                    </button>
                    <span v-if="notePrefs" class="text-xs font-medium text-emerald-600 dark:text-emerald-300">{{ notePrefs }}</span>
                  </div>
                </div>

                <div class="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Hak Akses</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Route aktif ini menentukan menu dan halaman yang bisa Anda buka.</p>
                  </div>

                  <div class="mt-4 flex flex-wrap gap-2">
                    <span
                      v-for="path in allowedRoutes"
                      :key="path"
                      class="rounded-full bg-green-50 px-3 py-1.5 text-[11px] font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-300"
                    >
                      {{ path }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-show="activeTab === 'security'" class="grid gap-4 xl:grid-cols-[1.05fr,0.95fr]">
              <form class="space-y-4 rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900" @submit.prevent="changePassword">
                <div>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">Ubah Password</h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Gunakan kombinasi huruf besar, kecil, angka, dan simbol agar lebih aman.</p>
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                  <div class="sm:col-span-2">
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Password saat ini</label>
                    <input v-model="passwordForm.current" type="password" :class="inputClass" required />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Password baru</label>
                    <input v-model="passwordForm.next" type="password" minlength="8" :class="inputClass" required />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Konfirmasi password</label>
                    <input v-model="passwordForm.confirm" type="password" minlength="8" :class="inputClass" required />
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <button type="submit" class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60" :disabled="changingPassword">
                    {{ changingPassword ? 'Memproses...' : 'Perbarui Password' }}
                  </button>
                  <p v-if="passwordStrength" class="text-xs text-gray-500 dark:text-neutral-400">Kekuatan: <span class="font-semibold text-gray-700 dark:text-neutral-200">{{ passwordStrength }}</span></p>
                </div>

                <p v-if="passwordNote" class="text-sm" :class="passwordNoteOk ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'">
                  {{ passwordNote }}
                </p>
              </form>

              <div class="space-y-4">
                <div class="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Keamanan Tambahan</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Kelola 2FA dan API key dari akun ini.</p>
                  </div>

                  <div class="mt-4 space-y-4">
                    <div class="flex items-center justify-between rounded-[22px] border border-gray-200 bg-gray-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/60">
                      <div>
                        <div class="text-sm font-semibold text-gray-900 dark:text-white">2FA (TOTP)</div>
                        <div class="text-xs text-gray-500 dark:text-neutral-400">Lapisan keamanan tambahan untuk login sensitif</div>
                      </div>
                      <button type="button" class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800" :disabled="saving2FA" @click="toggle2FA">
                        {{ twoFAEnabled ? 'Nonaktifkan' : 'Aktifkan' }}
                      </button>
                    </div>

                    <div class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                      <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                          <div class="text-sm font-semibold text-gray-900 dark:text-white">API Key</div>
                          <div class="mt-1 truncate text-xs text-gray-500 dark:text-neutral-400">{{ apiKeyMasked }}</div>
                        </div>
                        <div class="flex items-center gap-2">
                          <button type="button" class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800" @click="copyApiKey">
                            Salin
                          </button>
                          <button type="button" class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60" :disabled="regeneratingKey" @click="regenerateApiKey">
                            {{ regeneratingKey ? 'Membuat...' : 'Regenerate' }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <h3 class="text-lg font-bold text-gray-900 dark:text-white">Sesi Aktif</h3>
                      <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Pantau perangkat yang masih memiliki akses.</p>
                    </div>
                    <button type="button" class="text-xs font-semibold text-rose-600 hover:underline" @click="signOutAll">
                      Keluar semua
                    </button>
                  </div>

                  <div v-if="sessions.length" class="mt-4 space-y-3">
                    <article
                      v-for="session in sessions"
                      :key="session.id"
                      class="flex items-start gap-3 rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
                    >
                      <div class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                        <Icon :icon="session.icon" class="h-5 w-5" />
                      </div>
                      <div class="min-w-0 flex-1">
                        <div class="truncate text-sm font-bold text-gray-900 dark:text-white">{{ session.device }} · {{ session.browser }}</div>
                        <div class="mt-1 truncate text-xs text-gray-500 dark:text-neutral-400">{{ session.ip }} · {{ session.location }} · {{ session.time }}</div>
                      </div>
                      <button type="button" class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800" @click="revokeSession(session.id)">
                        Keluar
                      </button>
                    </article>
                  </div>
                  <p v-else class="mt-4 text-sm text-gray-500 dark:text-neutral-400">Tidak ada sesi aktif lain.</p>
                </div>
              </div>
            </div>

            <div v-show="activeTab === 'activity'" class="grid gap-4 xl:grid-cols-[1.12fr,0.88fr]">
              <div class="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">Log Aktivitas</h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Jejak aktivitas akun untuk audit ringan dan monitoring perubahan.</p>
                </div>

                <div v-if="audits.length" class="mt-4 space-y-4">
                  <article v-for="audit in audits" :key="audit.id" class="flex items-start gap-3">
                    <span class="mt-1 inline-block h-2.5 w-2.5 rounded-full" :class="audit.color"></span>
                    <div class="min-w-0 flex-1">
                      <div class="truncate text-sm font-bold text-gray-900 dark:text-white">{{ audit.title }}</div>
                      <div class="mt-1 text-sm text-gray-600 dark:text-neutral-300">{{ audit.desc }}</div>
                    </div>
                    <span class="text-[11px] text-gray-500 dark:text-neutral-400">{{ audit.time }}</span>
                  </article>
                </div>
                <p v-else class="mt-4 text-sm text-gray-500 dark:text-neutral-400">Belum ada aktivitas yang tercatat.</p>
              </div>

              <div class="space-y-4">
                <div class="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">Link Cepat</h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Arahkan ke modul yang paling sering dibutuhkan.</p>
                  <div class="mt-4 grid grid-cols-2 gap-3">
                    <button
                      v-for="item in quickLinks.slice(0, 6)"
                      :key="item.href"
                      type="button"
                      class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 text-left transition hover:bg-white dark:border-neutral-800 dark:bg-neutral-800/60 dark:hover:bg-neutral-800"
                      @click="go(item.href)"
                    >
                      <Icon :icon="item.icon" class="mb-3 h-5 w-5 text-green-600 dark:text-green-300" />
                      <div class="text-sm font-bold text-gray-900 dark:text-white">{{ item.label }}</div>
                      <div class="mt-1 text-[11px] text-gray-500 dark:text-neutral-400">{{ item.href }}</div>
                    </button>
                  </div>
                </div>

                <div class="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">Status Profil</h3>
                  <div class="mt-4 space-y-3">
                    <div class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                      <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Data Source</div>
                      <div class="mt-2 text-sm font-bold text-gray-900 dark:text-white">Firebase + Cloudinary</div>
                    </div>
                    <div class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                      <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Scope</div>
                      <div class="mt-2 text-sm font-bold text-gray-900 dark:text-white">{{ accessLabel }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>

    <Transition name="fade">
      <div v-if="showAvatarModal" class="fixed inset-0 z-[90]">
        <div class="absolute inset-0 bg-black/55 backdrop-blur-sm" @click="closeAvatarModal" />

        <div class="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
          <div class="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
            <div class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-neutral-700">
              <div>
                <h4 class="text-base font-bold text-gray-900 dark:text-white">Ubah Foto Profil</h4>
                <p class="text-sm text-gray-500 dark:text-neutral-400">Drop, klik, atur crop, lalu simpan ke Cloudinary.</p>
              </div>
              <button type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800" @click="closeAvatarModal">
                <Icon icon="lucide:x" class="h-4 w-4" />
              </button>
            </div>

            <div class="grid flex-1 gap-0 overflow-hidden lg:grid-cols-[1.15fr,0.85fr]">
              <div class="p-5">
                <div
                  ref="cropBoxEl"
                  class="relative mx-auto aspect-square w-full max-w-[620px] select-none overflow-hidden rounded-[30px] border-2 border-dashed border-green-200 bg-gradient-to-br from-green-50 to-lime-50 touch-none transition dark:border-green-900/30 dark:from-neutral-900 dark:to-neutral-950"
                  :class="draggingFile ? 'border-green-400 bg-green-50/90 dark:bg-green-900/10' : ''"
                  @click="openFilePicker"
                  @dragover.prevent="onDragOver"
                  @dragleave.prevent="onDragLeave"
                  @drop.prevent="onFileDrop"
                  @pointerdown="onDragStart"
                  @pointermove="onDragMove"
                  @pointerup="onDragEnd"
                  @pointercancel="onDragEnd"
                  @pointerleave="onDragEnd"
                  @wheel.prevent="onWheel"
                >
                  <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onPickAvatar" />

                  <img
                    v-if="crop.src"
                    :src="crop.src"
                    :style="imageStyle"
                    class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded will-change-transform"
                  />

                  <div v-if="!crop.src" class="absolute inset-0 grid place-items-center p-6 text-center">
                    <div>
                      <div class="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-green-700 shadow-lg ring-1 ring-black/5 dark:bg-neutral-900 dark:text-green-300 dark:ring-white/10">
                        <Icon icon="lucide:image-plus" class="h-7 w-7" />
                      </div>
                      <div class="mt-4 text-base font-bold text-gray-900 dark:text-white">Drop gambar di sini atau klik untuk upload</div>
                      <div class="mt-1 text-sm text-gray-500 dark:text-neutral-400">PNG, JPG, WebP. Area ini sekaligus menjadi preview dan crop box.</div>
                    </div>
                  </div>

                  <div v-if="crop.src" class="pointer-events-none absolute inset-0">
                    <div class="absolute inset-4 rounded-[24px] border-2 border-dashed border-white/85 shadow-[0_0_0_9999px_rgba(15,23,42,0.34)]"></div>
                    <div class="absolute inset-4 grid grid-cols-3 grid-rows-3 overflow-hidden rounded-[24px]">
                      <div class="border-r border-white/25"></div><div class="border-r border-white/25"></div><div></div>
                      <div class="border-t border-white/25"></div><div class="border-t border-white/25"></div><div class="border-t border-white/25"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="border-t border-gray-200 p-5 dark:border-neutral-800 lg:border-l lg:border-t-0">
                <div class="space-y-5">
                  <div>
                    <h5 class="text-sm font-bold text-gray-900 dark:text-white">Pengaturan Crop</h5>
                    <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">Geser gambar untuk posisi, gunakan scroll mouse atau slider untuk zoom.</p>
                  </div>

                  <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                    <div class="flex items-center justify-between gap-3">
                      <label class="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Ukuran Output</label>
                      <select v-model.number="crop.size" class="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-white">
                        <option v-for="size in [256, 384, 512, 768, 1024]" :key="size" :value="size">{{ size }} × {{ size }}</option>
                      </select>
                    </div>
                  </div>

                  <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                    <div class="mb-2 flex items-center justify-between gap-3">
                      <label class="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Zoom</label>
                      <span class="text-xs font-medium text-gray-500 dark:text-neutral-400">{{ crop.scale.toFixed(2) }}x</span>
                    </div>
                    <input v-model.number="crop.scale" :min="minScale" :max="maxScale" step="0.01" type="range" class="w-full accent-green-600" @input="clampOffsets" />
                  </div>

                  <div class="grid grid-cols-3 gap-2">
                    <button type="button" class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800" :disabled="!crop.src" @click="resetCrop">Reset</button>
                    <button type="button" class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800" :disabled="!crop.src" @click="fitCrop">Fit</button>
                    <button type="button" class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800" :disabled="!crop.src" @click="centerCrop">Center</button>
                  </div>

                  <div class="rounded-[24px] border border-green-100 bg-green-50/70 p-4 dark:border-green-900/30 dark:bg-green-900/10">
                    <div class="text-xs font-semibold uppercase tracking-[0.16em] text-green-700 dark:text-green-300">Tips</div>
                    <ul class="mt-2 space-y-2 text-xs leading-5 text-green-800 dark:text-green-200">
                      <li>• Klik box besar untuk memilih file baru.</li>
                      <li>• Drag gambar di area preview untuk mengatur komposisi.</li>
                      <li>• Saat simpan, file akan diunggah ke Cloudinary lalu URL-nya disimpan ke Firebase.</li>
                    </ul>
                  </div>
                </div>

                <div class="mt-6 flex flex-wrap items-center justify-end gap-2">
                  <button type="button" class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800" @click="closeAvatarModal">
                    Batal
                  </button>
                  <button type="button" class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60" :disabled="uploadingAvatar || !crop.src" @click="uploadAvatarCropped">
                    {{ uploadingAvatar ? 'Mengunggah...' : 'Simpan Avatar' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { getApps, initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, updatePassword } from 'firebase/auth'
import { get, onValue, off, update, remove, ref as dbRef } from 'firebase/database'
import { useCloudinaryUpload } from '~/composables/useCloudinaryUpload'

definePageMeta({ layout: 'app', layoutProps: { title: 'Profil' } })

type ProfileRecord = {
  displayName: string
  email: string
  avatar: string
  org: string
  location: string
  bio: string
  role: string
  allowedRoutes: string[]
  createdAt: number
  updatedAt: number
  prefs: {
    emailNotif: boolean
    pushNotif: boolean
    lang: 'id' | 'en'
  }
  security: {
    twoFA: boolean
  }
  apiKey: string
}

type SessionRow = {
  id: string
  device: string
  browser: string
  ip: string
  location: string
  time: string
  icon: string
}

type AuditRow = {
  id: string
  title: string
  desc: string
  time: string
  color: string
}

const { $realtimeDb } = useNuxtApp() as any
const sessionUser = useState<any>('sessionUser', () => null)
const { uploadImage, uploading: cloudinaryUploading } = useCloudinaryUpload()

const BASE_NS = 'alinayah'
const pageLoading = ref(true)
const draggingFile = ref(false)

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'security', label: 'Security' },
  { key: 'activity', label: 'Aktivitas' },
] as const

const activeTab = ref<'overview' | 'security' | 'activity'>('overview')
const inputClass = 'block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-white'

const profile = reactive<ProfileRecord>({
  displayName: '',
  email: '',
  avatar: '/assets/pp.jpg',
  org: '',
  location: '',
  bio: '',
  role: '',
  allowedRoutes: [],
  createdAt: 0,
  updatedAt: 0,
  prefs: {
    emailNotif: true,
    pushNotif: true,
    lang: 'id',
  },
  security: {
    twoFA: false,
  },
  apiKey: '',
})

const profileForm = reactive({
  displayName: '',
  email: '',
  org: '',
  location: '',
  bio: '',
})

const prefs = reactive({
  emailNotif: true,
  pushNotif: true,
  lang: 'id' as 'id' | 'en',
})

const twoFAEnabled = ref(false)
const apiKey = ref('')
const sessions = ref<SessionRow[]>([])
const audits = ref<AuditRow[]>([])

const savingProfile = ref(false)
const savingPrefs = ref(false)
const saving2FA = ref(false)
const regeneratingKey = ref(false)
const changingPassword = ref(false)
const uploadingAvatar = ref(false)

const noteProfile = ref('')
const notePrefs = ref('')
const passwordNote = ref('')
const passwordNoteOk = ref(false)

const showAvatarModal = ref(false)
const avatarPreview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const passwordForm = reactive({
  current: '',
  next: '',
  confirm: '',
})

const quickLinksMaster = [
  { label: 'Dashboard', href: '/app', icon: 'lucide:layout-dashboard' },
  { label: 'Berita', href: '/app/news', icon: 'hugeicons:news' },
  { label: 'Pengumuman', href: '/app/announcement', icon: 'lucide:info' },
  { label: 'Absensi', href: '/app/absen', icon: 'hugeicons:note-03' },
  { label: 'Pelanggaran', href: '/app/faults', icon: 'mingcute:fault-line' },
  { label: 'Perizinan', href: '/app/izin', icon: 'solar:letter-linear' },
  { label: 'Agenda', href: '/app/agenda', icon: 'solar:calendar-line-duotone' },
  { label: 'Profil', href: '/app/profile', icon: 'iconamoon:profile' },
] as const

function normalize(path: string) {
  try {
    const u = new URL(path, 'http://x')
    return u.pathname.replace(/\/+$/, '') || '/'
  } catch {
    return (path || '').replace(/\/+$/, '') || '/'
  }
}

function isAllowed(path: string, allowed: string[]) {
  const a = normalize(path)
  return allowed.map(normalize).some((r) => {
    if (r === '/app' || r === '/wali') return a === r
    return a === r || (r !== '/' && a.startsWith(r + '/'))
  })
}

function coerceRoutes(v: any): string[] {
  if (Array.isArray(v)) return v.map(String)
  if (v && typeof v === 'object') return Object.values(v).filter((x) => typeof x === 'string').map(String)
  return []
}

const uid = computed(() => sessionUser.value?.uid || '')
const allowedRoutes = computed(() => {
  const routes = coerceRoutes(profile.allowedRoutes)
  if (routes.length) return routes
  return sessionUser.value?.role === 'wali' ? ['/wali'] : ['/app']
})

const quickLinks = computed(() => quickLinksMaster.filter((item) => isAllowed(item.href, allowedRoutes.value)).slice(0, 6))

const roleLabel = computed(() => {
  const role = String(profile.role || sessionUser.value?.role || '').toLowerCase()
  if (role === 'admin') return 'Administrator'
  if (role === 'pengurus') return 'Pengurus'
  if (role === 'wali') return 'Wali Santri'
  return role || 'Pengguna'
})

const accessLabel = computed(() => {
  const routes = allowedRoutes.value
  if (routes.length === 1 && (routes[0] === '/app' || routes[0] === '/wali')) return 'Dashboard Only'
  return `Scoped Access (${routes.length})`
})

const joinedAt = computed(() => profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : '—')
const lastActive = computed(() => {
  const ts = profile.updatedAt || profile.createdAt
  return ts ? new Date(ts).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '—'
})

const apiKeyMasked = computed(() => apiKey.value ? `${apiKey.value.slice(0, 6)}••••${apiKey.value.slice(-4)}` : '—')
const passwordStrength = computed(() => {
  const value = passwordForm.next
  if (!value) return ''
  const score = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].reduce((sum, rule) => sum + (rule.test(value) ? 1 : 0), 0) + (value.length >= 12 ? 1 : 0)
  return ['Lemah', 'Cukup', 'Baik', 'Kuat', 'Sangat Kuat'][Math.min(score, 4)]
})

function syncFormsFromProfile() {
  profileForm.displayName = profile.displayName
  profileForm.email = profile.email
  profileForm.org = profile.org
  profileForm.location = profile.location
  profileForm.bio = profile.bio

  prefs.emailNotif = !!profile.prefs.emailNotif
  prefs.pushNotif = !!profile.prefs.pushNotif
  prefs.lang = profile.prefs.lang === 'en' ? 'en' : 'id'

  twoFAEnabled.value = !!profile.security.twoFA
  apiKey.value = profile.apiKey || ''
}

function applyProfileRecord(raw: any) {
  profile.displayName = String(raw?.displayName || raw?.name || sessionUser.value?.name || '')
  profile.email = String(raw?.email || sessionUser.value?.email || '')
  profile.avatar = String(raw?.avatar || '/assets/pp.jpg')
  profile.org = String(raw?.org || '')
  profile.location = String(raw?.location || '')
  profile.bio = String(raw?.bio || '')
  profile.role = String(raw?.role || sessionUser.value?.role || '')
  profile.allowedRoutes = coerceRoutes(raw?.allowedRoutes)
  profile.createdAt = Number(raw?.createdAt || 0)
  profile.updatedAt = Number(raw?.updatedAt || raw?.createdAt || 0)
  profile.prefs = {
    emailNotif: !!raw?.prefs?.emailNotif,
    pushNotif: !!raw?.prefs?.pushNotif,
    lang: raw?.prefs?.lang === 'en' ? 'en' : 'id',
  }
  profile.security = {
    twoFA: !!raw?.security?.twoFA,
  }
  profile.apiKey = String(raw?.apiKey || '')

  syncFormsFromProfile()
}

let profileRef: ReturnType<typeof dbRef> | null = null
let sessionsRef: ReturnType<typeof dbRef> | null = null
let auditsRef: ReturnType<typeof dbRef> | null = null

async function bindProfile() {
  if (!uid.value) return

  try { if (profileRef) off(profileRef) } catch {}
  try { if (sessionsRef) off(sessionsRef) } catch {}
  try { if (auditsRef) off(auditsRef) } catch {}

  profileRef = dbRef($realtimeDb, `${BASE_NS}/users/${uid.value}`)
  sessionsRef = dbRef($realtimeDb, `${BASE_NS}/sessions/${uid.value}`)
  auditsRef = dbRef($realtimeDb, `${BASE_NS}/audits/${uid.value}`)

  const snap = await get(profileRef)
  applyProfileRecord(snap.val() || {})

  onValue(profileRef, (snapshot) => {
    applyProfileRecord(snapshot.val() || {})
  })

  onValue(sessionsRef, (snapshot) => {
    const raw = snapshot.val() || {}
    sessions.value = Object.entries<any>(raw).map(([id, item]) => ({
      id,
      device: item.device || 'Perangkat',
      browser: item.browser || 'Browser',
      ip: item.ip || '-',
      location: item.location || '-',
      time: item.time || new Date().toLocaleString('id-ID'),
      icon: item.icon || 'lucide:smartphone',
    }))
  })

  onValue(auditsRef, (snapshot) => {
    const raw = snapshot.val() || {}
    audits.value = Object.entries<any>(raw)
      .map(([id, item]) => ({
        id,
        title: item.title || '-',
        desc: item.desc || '-',
        time: item.time || new Date().toLocaleString('id-ID'),
        color: item.color || 'bg-green-500',
      }))
      .sort((a, b) => String(b.time).localeCompare(String(a.time)))
  })
}

async function saveProfile() {
  if (!uid.value) return
  savingProfile.value = true
  noteProfile.value = ''
  try {
    await update(dbRef($realtimeDb, `${BASE_NS}/users/${uid.value}`), {
      displayName: profileForm.displayName.trim(),
      email: profileForm.email.trim(),
      org: profileForm.org.trim(),
      location: profileForm.location.trim(),
      bio: profileForm.bio.trim(),
      updatedAt: Date.now(),
    })
    noteProfile.value = 'Profil berhasil diperbarui.'
    setTimeout(() => (noteProfile.value = ''), 1800)
  } catch (error: any) {
    noteProfile.value = error?.message || 'Gagal menyimpan profil.'
  } finally {
    savingProfile.value = false
  }
}

function resetProfile() {
  syncFormsFromProfile()
}

async function savePrefs() {
  if (!uid.value) return
  savingPrefs.value = true
  notePrefs.value = ''
  try {
    await update(dbRef($realtimeDb, `${BASE_NS}/users/${uid.value}`), {
      prefs: {
        emailNotif: !!prefs.emailNotif,
        pushNotif: !!prefs.pushNotif,
        lang: prefs.lang,
      },
      updatedAt: Date.now(),
    })
    notePrefs.value = 'Preferensi berhasil diperbarui.'
    setTimeout(() => (notePrefs.value = ''), 1800)
  } catch (error: any) {
    notePrefs.value = error?.message || 'Gagal menyimpan preferensi.'
  } finally {
    savingPrefs.value = false
  }
}

async function toggle2FA() {
  if (!uid.value) return
  saving2FA.value = true
  try {
    const next = !twoFAEnabled.value
    await update(dbRef($realtimeDb, `${BASE_NS}/users/${uid.value}`), {
      security: { twoFA: next },
      updatedAt: Date.now(),
    })
  } finally {
    saving2FA.value = false
  }
}

function b64url(buf: Uint8Array) {
  return btoa(String.fromCharCode(...buf)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

async function regenerateApiKey() {
  if (!uid.value) return
  regeneratingKey.value = true
  try {
    const rnd = crypto.getRandomValues(new Uint8Array(32))
    const key = `sk_live_${b64url(rnd)}`
    await update(dbRef($realtimeDb, `${BASE_NS}/users/${uid.value}`), {
      apiKey: key,
      updatedAt: Date.now(),
    })
  } finally {
    regeneratingKey.value = false
  }
}

async function copyApiKey() {
  try {
    if (apiKey.value) await navigator.clipboard.writeText(apiKey.value)
  } catch {}
}

async function revokeSession(id: string) {
  if (!uid.value) return
  await remove(dbRef($realtimeDb, `${BASE_NS}/sessions/${uid.value}/${id}`))
}

async function signOutAll() {
  if (!uid.value) return
  await remove(dbRef($realtimeDb, `${BASE_NS}/sessions/${uid.value}`))
}

async function changePassword() {
  passwordNote.value = ''
  passwordNoteOk.value = false

  if (passwordForm.next !== passwordForm.confirm) {
    passwordNote.value = 'Konfirmasi password tidak sama.'
    return
  }

  if (!profile.email) {
    passwordNote.value = 'Akun ini tidak memiliki email login Firebase.'
    return
  }

  changingPassword.value = true
  try {
    const apps = getApps()
    const primary = apps[0]
    if (!primary) throw new Error('Firebase belum diinisialisasi.')

    const secondaryName = '__profile_secondary_auth__'
    const secondaryApp = apps.find((app) => app.name === secondaryName) || initializeApp(primary.options, secondaryName)
    const auth = getAuth(secondaryApp)
    const credential = await signInWithEmailAndPassword(auth, profile.email, passwordForm.current)
    await updatePassword(credential.user, passwordForm.next)
    await auth.signOut().catch(() => {})

    passwordForm.current = ''
    passwordForm.next = ''
    passwordForm.confirm = ''
    passwordNote.value = 'Password berhasil diperbarui.'
    passwordNoteOk.value = true
  } catch (error: any) {
    passwordNote.value = error?.message || 'Gagal memperbarui password.'
  } finally {
    changingPassword.value = false
  }
}

function go(path: string) {
  navigateTo(path)
}

const cropBoxEl = ref<HTMLDivElement | null>(null)
const crop = reactive({
  src: '',
  naturalW: 0,
  naturalH: 0,
  baseFit: 1,
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  dragging: false,
  lastX: 0,
  lastY: 0,
  size: 512,
})

const minScale = computed(() => 1)
const maxScale = 5
const activePointers = new Map<number, { x: number; y: number }>()
let pinchStartDist = 0
let pinchStartScale = 1
let pinchCenter = { x: 0, y: 0 }
let resizeObserver: ResizeObserver | null = null

const imageStyle = computed(() => {
  const displayW = crop.naturalW * crop.baseFit * crop.scale
  const displayH = crop.naturalH * crop.baseFit * crop.scale
  return {
    width: `${displayW}px`,
    height: `${displayH}px`,
    transform: `translate(calc(-50% + ${crop.offsetX}px), calc(-50% + ${crop.offsetY}px))`,
  }
})

function revokeObjectUrl() {
  if (crop.src?.startsWith('blob:')) URL.revokeObjectURL(crop.src)
}

function openFilePicker() {
  if (!crop.src) fileInput.value?.click()
}

async function loadSelectedFile(file: File) {
  if (!file.type.startsWith('image/')) return

  revokeObjectUrl()
  const objectUrl = URL.createObjectURL(file)
  crop.src = objectUrl
  avatarPreview.value = objectUrl

  const img = new Image()
  img.onload = async () => {
    crop.naturalW = img.naturalWidth
    crop.naturalH = img.naturalHeight
    crop.scale = 1
    crop.offsetX = 0
    crop.offsetY = 0
    await nextTick()
    computeBaseFit()
    centerCrop()
  }
  img.src = objectUrl
}

async function onPickAvatar(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  await loadSelectedFile(file)
}

function onDragOver() {
  draggingFile.value = true
}

function onDragLeave() {
  draggingFile.value = false
}

async function onFileDrop(event: DragEvent) {
  draggingFile.value = false
  const file = event.dataTransfer?.files?.[0]
  if (!file) return
  await loadSelectedFile(file)
}

function computeBaseFit() {
  const box = cropBoxEl.value
  if (!box || !crop.naturalW || !crop.naturalH) return
  const side = Math.min(box.clientWidth, box.clientHeight)
  crop.baseFit = Math.max(side / crop.naturalW, side / crop.naturalH)
  clampOffsets()
}

function clampOffsets() {
  const box = cropBoxEl.value
  if (!box) return
  const side = Math.min(box.clientWidth, box.clientHeight)
  const displayW = crop.naturalW * crop.baseFit * crop.scale
  const displayH = crop.naturalH * crop.baseFit * crop.scale
  const maxX = Math.max(0, (displayW - side) / 2)
  const maxY = Math.max(0, (displayH - side) / 2)
  crop.offsetX = Math.max(-maxX, Math.min(maxX, crop.offsetX))
  crop.offsetY = Math.max(-maxY, Math.min(maxY, crop.offsetY))
}

function resetCrop() {
  crop.scale = 1
  crop.offsetX = 0
  crop.offsetY = 0
  clampOffsets()
}

function fitCrop() {
  crop.scale = 1
  computeBaseFit()
  clampOffsets()
}

function centerCrop() {
  crop.offsetX = 0
  crop.offsetY = 0
  clampOffsets()
}

function zoomAt(px: number, py: number, nextScale: number) {
  const box = cropBoxEl.value
  if (!box || !crop.src) return

  nextScale = Math.min(maxScale, Math.max(minScale.value, nextScale))
  const rectW = box.clientWidth
  const rectH = box.clientHeight
  const displayW = crop.naturalW * crop.baseFit * crop.scale
  const displayH = crop.naturalH * crop.baseFit * crop.scale
  const left = rectW / 2 - displayW / 2 + crop.offsetX
  const top = rectH / 2 - displayH / 2 + crop.offsetY
  const u = (px - left) / displayW
  const v = (py - top) / displayH

  const newDisplayW = crop.naturalW * crop.baseFit * nextScale
  const newDisplayH = crop.naturalH * crop.baseFit * nextScale
  crop.offsetX = (px - rectW / 2) + (0.5 - u) * newDisplayW
  crop.offsetY = (py - rectH / 2) + (0.5 - v) * newDisplayH
  crop.scale = nextScale
  clampOffsets()
}

function onWheel(event: WheelEvent) {
  if (!crop.src) return
  const box = cropBoxEl.value
  if (!box) return
  const rect = box.getBoundingClientRect()
  const px = event.clientX - rect.left
  const py = event.clientY - rect.top
  const factor = event.deltaY < 0 ? 1.07 : 0.93
  zoomAt(px, py, crop.scale * factor)
}

function onDragStart(event: PointerEvent) {
  if (!crop.src) return
  ;(event.target as HTMLElement).setPointerCapture?.(event.pointerId)
  activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

  if (activePointers.size === 1) {
    crop.dragging = true
    crop.lastX = event.clientX
    crop.lastY = event.clientY
  } else if (activePointers.size === 2) {
    const points = [...activePointers.values()]
    pinchStartDist = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)
    pinchStartScale = crop.scale
    const rect = cropBoxEl.value!.getBoundingClientRect()
    pinchCenter = {
      x: (points[0].x + points[1].x) / 2 - rect.left,
      y: (points[0].y + points[1].y) / 2 - rect.top,
    }
    crop.dragging = false
  }
}

function onDragMove(event: PointerEvent) {
  if (!crop.src) return

  if (activePointers.has(event.pointerId)) {
    activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  }

  if (activePointers.size === 2) {
    const points = [...activePointers.values()]
    const dist = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)
    if (pinchStartDist > 0) {
      zoomAt(pinchCenter.x, pinchCenter.y, pinchStartScale * (dist / pinchStartDist))
    }
    return
  }

  if (!crop.dragging) return
  const dx = event.clientX - crop.lastX
  const dy = event.clientY - crop.lastY
  crop.offsetX += dx
  crop.offsetY += dy
  crop.lastX = event.clientX
  crop.lastY = event.clientY
  clampOffsets()
}

function onDragEnd(event?: PointerEvent) {
  crop.dragging = false
  if (event?.pointerId != null) activePointers.delete(event.pointerId)
  if (activePointers.size < 2) pinchStartDist = 0
}

function getCropSourceRect() {
  const cw = cropBoxEl.value?.clientWidth || crop.size
  const ch = cropBoxEl.value?.clientHeight || crop.size
  const side = Math.min(cw, ch)
  const displayW = crop.naturalW * crop.baseFit * crop.scale
  const displayH = crop.naturalH * crop.baseFit * crop.scale
  const imgLeft = (cw - displayW) / 2 + crop.offsetX
  const imgTop = (ch - displayH) / 2 + crop.offsetY

  const sx = (-imgLeft / displayW) * crop.naturalW
  const sy = (-imgTop / displayH) * crop.naturalH
  const sWidth = (side / displayW) * crop.naturalW
  const sHeight = (side / displayH) * crop.naturalH
  return { sx, sy, sWidth, sHeight }
}

async function uploadAvatarCropped() {
  if (!uid.value || !crop.src || uploadingAvatar.value || cloudinaryUploading.value) return
  uploadingAvatar.value = true
  try {
    const canvas = document.createElement('canvas')
    canvas.width = crop.size
    canvas.height = crop.size
    const ctx = canvas.getContext('2d')!

    const img = await new Promise<HTMLImageElement>((resolve) => {
      const i = new Image()
      i.onload = () => resolve(i)
      i.src = crop.src
    })

    const { sx, sy, sWidth, sHeight } = getCropSourceRect()
    ctx.imageSmoothingQuality = 'high'
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height)

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((file) => resolve(file as Blob), 'image/webp', 0.92)
    })

    const file = new File([blob], `avatar-${uid.value}-${Date.now()}.webp`, { type: 'image/webp' })
    const result = await uploadImage(file, { folder: `${BASE_NS}/users/${uid.value}/avatar` })

    await update(dbRef($realtimeDb, `${BASE_NS}/users/${uid.value}`), {
      avatar: result.secure_url,
      updatedAt: Date.now(),
    })

    closeAvatarModal()
  } finally {
    uploadingAvatar.value = false
  }
}

function closeAvatarModal() {
  showAvatarModal.value = false
  draggingFile.value = false
  avatarPreview.value = null
  if (fileInput.value) fileInput.value.value = ''
  revokeObjectUrl()
  crop.src = ''
  crop.naturalW = 0
  crop.naturalH = 0
  crop.scale = 1
  crop.offsetX = 0
  crop.offsetY = 0
}

onMounted(async () => {
  if (!uid.value) {
    pageLoading.value = false
    return
  }

  await bindProfile()

  if (cropBoxEl.value) {
    resizeObserver = new ResizeObserver(() => computeBaseFit())
    resizeObserver.observe(cropBoxEl.value)
  }

  pageLoading.value = false
})

onUnmounted(() => {
  try { if (profileRef) off(profileRef) } catch {}
  try { if (sessionsRef) off(sessionsRef) } catch {}
  try { if (auditsRef) off(auditsRef) } catch {}
  resizeObserver?.disconnect()
  resizeObserver = null
  revokeObjectUrl()
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
