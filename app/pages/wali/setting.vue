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
            Preference Center
          </div>

          <h1 class="mt-4 text-2xl font-black tracking-tight md:text-4xl">
            Pengaturan Wali
          </h1>

          <p class="mt-2 max-w-xl text-sm leading-6 text-green-50/90 md:text-base">
            Atur preferensi akun, tampilan, notifikasi, privasi, keamanan, aksesibilitas, dan data portal wali santri.
          </p>
        </div>

        <div class="min-w-0 rounded-[28px] bg-white/13 p-4 ring-1 ring-white/15 backdrop-blur lg:w-[390px]">
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="text-xs font-bold text-green-50/80">Settings Health</div>
              <div class="mt-1 text-3xl font-black">{{ settingsHealth }}%</div>
            </div>

            <div class="grid h-14 w-14 place-items-center rounded-2xl bg-white/15">
              <Icon icon="ph:gear-six-duotone" class="h-8 w-8" />
            </div>
          </div>

          <div class="mt-4 h-2.5 overflow-hidden rounded-full bg-white/15">
            <div
              class="h-full rounded-full bg-white transition-all duration-500"
              :style="{ width: settingsHealth + '%' }"
            ></div>
          </div>

          <div class="mt-3 text-xs font-semibold text-green-50/80">
            {{ saveStatus }}
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Insight -->
    <div class="grid gap-4 xl:grid-cols-[1fr,0.84fr]">
      <div class="relative overflow-hidden rounded-[32px] border border-green-100 bg-gradient-to-br from-slate-950 via-green-950 to-green-900 p-5 text-white shadow-sm dark:border-neutral-800">
        <div class="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-green-300/20 blur-3xl"></div>

        <div class="relative z-10">
          <div class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black ring-1 ring-white/15">
            <Icon icon="ph:sparkle-duotone" class="h-4 w-4" />
            Smart Preference Insight
          </div>

          <h2 class="mt-4 text-xl font-black">
            {{ preferenceInsight.title }}
          </h2>

          <p class="mt-2 text-sm leading-6 text-white/75">
            {{ preferenceInsight.desc }}
          </p>

          <div class="mt-5 grid gap-3 sm:grid-cols-3">
            <div class="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
              <div class="text-lg font-black">{{ privacyScore }}</div>
              <div class="mt-0.5 text-[11px] font-bold text-white/65">Privacy</div>
            </div>

            <div class="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
              <div class="text-lg font-black">{{ notificationScore }}</div>
              <div class="mt-0.5 text-[11px] font-bold text-white/65">Notify</div>
            </div>

            <div class="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
              <div class="text-lg font-black">{{ accessibilityScore }}</div>
              <div class="mt-0.5 text-[11px] font-bold text-white/65">Access</div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-black text-slate-900 dark:text-white">
              Quick Actions
            </h2>
            <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
              Preset cepat seperti Discord/GitHub.
            </p>
          </div>

          <span class="rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
            Pro Mode
          </span>
        </div>

        <div class="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            @click="applyPreset('focus')"
            class="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:bg-green-50 dark:border-neutral-800 dark:bg-neutral-800/60 dark:hover:bg-green-900/10"
          >
            <div class="flex items-center gap-3">
              <div class="grid h-10 w-10 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <Icon icon="ph:bell-slash-duotone" class="h-5 w-5" />
              </div>
              <div>
                <div class="text-sm font-black text-slate-900 dark:text-white">Focus Mode</div>
                <div class="text-xs text-slate-500 dark:text-neutral-400">Minim notifikasi</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            @click="applyPreset('guardian')"
            class="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:bg-green-50 dark:border-neutral-800 dark:bg-neutral-800/60 dark:hover:bg-green-900/10"
          >
            <div class="flex items-center gap-3">
              <div class="grid h-10 w-10 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <Icon icon="ph:shield-check-duotone" class="h-5 w-5" />
              </div>
              <div>
                <div class="text-sm font-black text-slate-900 dark:text-white">Guardian Mode</div>
                <div class="text-xs text-slate-500 dark:text-neutral-400">Pantauan penuh</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            @click="applyPreset('privacy')"
            class="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:bg-green-50 dark:border-neutral-800 dark:bg-neutral-800/60 dark:hover:bg-green-900/10"
          >
            <div class="flex items-center gap-3">
              <div class="grid h-10 w-10 place-items-center rounded-2xl bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
                <Icon icon="ph:lock-key-duotone" class="h-5 w-5" />
              </div>
              <div>
                <div class="text-sm font-black text-slate-900 dark:text-white">Privacy Mode</div>
                <div class="text-xs text-slate-500 dark:text-neutral-400">Privasi ketat</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            @click="resetSettings"
            class="rounded-2xl border border-rose-100 bg-rose-50/70 p-4 text-left transition hover:bg-rose-50 dark:border-rose-900/30 dark:bg-rose-900/10"
          >
            <div class="flex items-center gap-3">
              <div class="grid h-10 w-10 place-items-center rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">
                <Icon icon="ph:arrow-counter-clockwise-duotone" class="h-5 w-5" />
              </div>
              <div>
                <div class="text-sm font-black text-slate-900 dark:text-white">Reset</div>
                <div class="text-xs text-slate-500 dark:text-neutral-400">Default settings</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Main -->
    <div class="grid gap-4 xl:grid-cols-[320px,1fr]">
      <!-- Sidebar -->
      <aside class="rounded-[32px] border border-white/80 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 xl:sticky xl:top-6 xl:self-start">
        <div class="p-2">
          <div class="relative">
            <input
              v-model="search"
              type="text"
              placeholder="Search settings..."
              class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:ring-green-500/10"
            />
            <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Icon icon="lucide:search" class="h-4 w-4" />
            </span>
          </div>
        </div>

        <div class="mt-2 flex flex-wrap gap-2 overflow-x-auto pb-2 xl:block xl:space-y-1 xl:overflow-visible xl:pb-0">
          <button
            v-for="section in filteredSections"
            :key="section.key"
            type="button"
            @click="activeSection = section.key"
            :class="[
              'flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-black transition xl:w-full',
              activeSection === section.key
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
                : 'text-slate-600 hover:bg-slate-50 dark:text-neutral-300 dark:hover:bg-neutral-800'
            ]"
          >
            <Icon :icon="section.icon" class="h-5 w-5 shrink-0" />
            <span class="whitespace-nowrap">{{ section.label }}</span>
          </button>
        </div>
      </aside>

      <!-- Content -->
      <div class="space-y-4">
        <!-- Header -->
        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div class="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <Icon :icon="currentSection.icon" class="h-4 w-4" />
                {{ currentSection.label }}
              </div>

              <h2 class="mt-3 text-xl font-black text-slate-900 dark:text-white">
                {{ currentSection.title }}
              </h2>

              <p class="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-neutral-400">
                {{ currentSection.desc }}
              </p>
            </div>

            <button
              type="button"
              @click="saveAllSettings"
              :disabled="saving"
              class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon
                v-if="saving"
                icon="ph:spinner-gap-duotone"
                class="h-5 w-5 animate-spin"
              />
              <Icon
                v-else
                icon="ph:floppy-disk-duotone"
                class="h-5 w-5"
              />
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>

        <!-- Appearance -->
        <div v-if="activeSection === 'appearance'" class="space-y-4">
          <div class="grid gap-4 md:grid-cols-3">
            <button
              v-for="theme in themeOptions"
              :key="theme.value"
              type="button"
              @click="setSetting('appearance.theme', theme.value)"
              :class="[
                'rounded-[28px] border p-4 text-left transition hover:-translate-y-1',
                getSetting('appearance.theme') === theme.value
                  ? 'border-green-200 bg-green-50 shadow-sm dark:border-green-900/30 dark:bg-green-900/10'
                  : 'border-slate-100 bg-white hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800'
              ]"
            >
              <div :class="['grid h-12 w-12 place-items-center rounded-2xl', theme.iconClass]">
                <Icon :icon="theme.icon" class="h-6 w-6" />
              </div>

              <div class="mt-4 font-black text-slate-900 dark:text-white">{{ theme.label }}</div>
              <div class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">{{ theme.desc }}</div>
            </button>
          </div>

          <SettingSelect
            title="Accent Color"
            desc="Warna utama untuk button, highlight, dan badge."
            icon="ph:palette-duotone"
            :value="getSetting('appearance.accentColor')"
            :options="accentOptions"
            @change="setSetting('appearance.accentColor', $event)"
          />

          <SettingRange
            title="Font Scale"
            desc="Perbesar atau perkecil ukuran font di portal wali."
            icon="ph:text-aa-duotone"
            :value="getSetting('appearance.fontScale')"
            :min="90"
            :max="120"
            suffix="%"
            @change="setSetting('appearance.fontScale', $event)"
          />

          <SettingToggle
            v-for="item in appearanceToggles"
            :key="item.path"
            :title="item.title"
            :desc="item.desc"
            :icon="item.icon"
            :checked="Boolean(getSetting(item.path))"
            @change="setSetting(item.path, $event)"
          />
        </div>

        <!-- Notifications -->
        <div v-else-if="activeSection === 'notifications'" class="space-y-4">
          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <SettingToggle
              v-for="item in notificationToggles"
              :key="item.path"
              :title="item.title"
              :desc="item.desc"
              :icon="item.icon"
              :checked="Boolean(getSetting(item.path))"
              card
              @change="setSetting(item.path, $event)"
            />
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div class="flex items-start gap-3">
                <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <Icon icon="ph:moon-stars-duotone" class="h-6 w-6" />
                </div>

                <div>
                  <h3 class="font-black text-slate-900 dark:text-white">Quiet Hours</h3>
                  <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                    Matikan notifikasi di jam istirahat.
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                class="toggle toggle-success"
                :checked="Boolean(getSetting('notifications.quietHours'))"
                @change="setCheckbox('notifications.quietHours', $event)"
              />
            </div>

            <div class="mt-5 grid gap-3 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-xs font-black text-slate-500 dark:text-neutral-400">Mulai</label>
                <input
                  type="time"
                  :value="getSetting('notifications.quietStart')"
                  class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  @change="setInput('notifications.quietStart', $event)"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-black text-slate-500 dark:text-neutral-400">Selesai</label>
                <input
                  type="time"
                  :value="getSetting('notifications.quietEnd')"
                  class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  @change="setInput('notifications.quietEnd', $event)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Privacy -->
        <div v-else-if="activeSection === 'privacy'" class="space-y-4">
          <SettingSelect
            title="Profile Visibility"
            desc="Atur siapa yang bisa melihat ringkasan profil wali."
            icon="ph:eye-duotone"
            :value="getSetting('privacy.profileVisibility')"
            :options="visibilityOptions"
            @change="setSetting('privacy.profileVisibility', $event)"
          />

          <div class="grid gap-4 md:grid-cols-2">
            <SettingToggle
              v-for="item in privacyToggles"
              :key="item.path"
              :title="item.title"
              :desc="item.desc"
              :icon="item.icon"
              :checked="Boolean(getSetting(item.path))"
              card
              @change="setSetting(item.path, $event)"
            />
          </div>
        </div>

        <!-- Dashboard -->
        <div v-else-if="activeSection === 'dashboard'" class="space-y-4">
          <SettingSelect
            title="Default Landing Page"
            desc="Halaman pertama yang dibuka setelah wali login."
            icon="ph:house-line-duotone"
            :value="getSetting('dashboard.defaultPage')"
            :options="defaultPageOptions"
            @change="setSetting('dashboard.defaultPage', $event)"
          />

          <SettingRange
            title="Items per Page"
            desc="Jumlah data default untuk tabel dan daftar."
            icon="ph:list-numbers-duotone"
            :value="getSetting('dashboard.itemsPerPage')"
            :min="5"
            :max="30"
            suffix=" item"
            @change="setSetting('dashboard.itemsPerPage', $event)"
          />

          <div class="grid gap-4 md:grid-cols-2">
            <SettingToggle
              v-for="item in dashboardToggles"
              :key="item.path"
              :title="item.title"
              :desc="item.desc"
              :icon="item.icon"
              :checked="Boolean(getSetting(item.path))"
              card
              @change="setSetting(item.path, $event)"
            />
          </div>
        </div>

        <!-- Security -->
        <div v-else-if="activeSection === 'security'" class="space-y-4">
          <SettingSelect
            title="Session Timeout"
            desc="Durasi sebelum sesi wali otomatis dianggap tidak aktif."
            icon="ph:timer-duotone"
            :value="getSetting('security.sessionTimeout')"
            :options="sessionTimeoutOptions"
            @change="setSetting('security.sessionTimeout', $event)"
          />

          <div class="grid gap-4 md:grid-cols-2">
            <SettingToggle
              v-for="item in securityToggles"
              :key="item.path"
              :title="item.title"
              :desc="item.desc"
              :icon="item.icon"
              :checked="Boolean(getSetting(item.path))"
              card
              @change="setSetting(item.path, $event)"
            />
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start gap-3">
              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                <Icon icon="ph:phone-call-duotone" class="h-6 w-6" />
              </div>

              <div class="min-w-0 flex-1">
                <h3 class="font-black text-slate-900 dark:text-white">Backup Contact</h3>
                <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                  Nomor cadangan untuk pemulihan akun atau kondisi darurat.
                </p>

                <input
                  type="tel"
                  :value="getSetting('security.backupContact')"
                  placeholder="08xxxxxxxxxx"
                  class="mt-4 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  @change="setInput('security.backupContact', $event)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Accessibility -->
        <div v-else-if="activeSection === 'accessibility'" class="space-y-4">
          <SettingRange
            title="Interface Scale"
            desc="Atur kenyamanan ukuran interface untuk layar kecil/besar."
            icon="ph:resize-duotone"
            :value="getSetting('accessibility.interfaceScale')"
            :min="90"
            :max="125"
            suffix="%"
            @change="setSetting('accessibility.interfaceScale', $event)"
          />

          <div class="grid gap-4 md:grid-cols-2">
            <SettingToggle
              v-for="item in accessibilityToggles"
              :key="item.path"
              :title="item.title"
              :desc="item.desc"
              :icon="item.icon"
              :checked="Boolean(getSetting(item.path))"
              card
              @change="setSetting(item.path, $event)"
            />
          </div>
        </div>

        <!-- Data -->
        <div v-else-if="activeSection === 'data'" class="space-y-4">
          <SettingSelect
            title="Default Export Format"
            desc="Format default saat wali mengunduh data."
            icon="ph:download-simple-duotone"
            :value="getSetting('data.exportFormat')"
            :options="exportOptions"
            @change="setSetting('data.exportFormat', $event)"
          />

          <div class="grid gap-4 md:grid-cols-2">
            <SettingToggle
              v-for="item in dataToggles"
              :key="item.path"
              :title="item.title"
              :desc="item.desc"
              :icon="item.icon"
              :checked="Boolean(getSetting(item.path))"
              card
              @change="setSetting(item.path, $event)"
            />
          </div>

          <div class="rounded-[32px] border border-rose-100 bg-rose-50/70 p-5 dark:border-rose-900/30 dark:bg-rose-900/10">
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div class="flex items-start gap-3">
                <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">
                  <Icon icon="ph:trash-duotone" class="h-6 w-6" />
                </div>

                <div>
                  <h3 class="font-black text-slate-900 dark:text-white">Clear Local Cache</h3>
                  <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                    Bersihkan cache preferensi lokal di browser ini.
                  </p>
                </div>
              </div>

              <button
                type="button"
                @click="clearLocalCache"
                class="inline-flex h-11 items-center justify-center rounded-2xl bg-rose-600 px-4 text-sm font-black text-white transition hover:bg-rose-700"
              >
                Clear Cache
              </button>
            </div>
          </div>
        </div>

        <!-- Developer -->
        <div v-else-if="activeSection === 'advanced'" class="space-y-4">
          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start gap-3">
              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300">
                <Icon icon="ph:code-duotone" class="h-6 w-6" />
              </div>

              <div class="min-w-0 flex-1">
                <h3 class="font-black text-slate-900 dark:text-white">Advanced Config Preview</h3>
                <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                  Preview konfigurasi untuk debugging internal.
                </p>

                <pre class="mt-4 max-h-[420px] overflow-auto rounded-[24px] bg-slate-950 p-4 text-xs leading-6 text-green-200">{{ formattedSettings }}</pre>
              </div>
            </div>
          </div>
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
import { onValue, ref as dbRef, set, update } from 'firebase/database'
import { useNuxtApp, useRuntimeConfig, useState } from 'nuxt/app'

definePageMeta({
  layout: 'wali'
})

type AnyRow = Record<string, any>

type OptionItem = {
  label: string
  value: string | number
}

type SettingToggleItem = {
  title: string
  desc: string
  icon: string
  path: string
}

type SectionItem = {
  key: string
  label: string
  title: string
  desc: string
  icon: string
}

const SettingToggle = defineComponent({
  name: 'SettingToggle',
  props: {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    icon: { type: String, required: true },
    checked: { type: Boolean, default: false },
    card: { type: Boolean, default: false }
  },
  emits: ['change'],
  setup(props, { emit }) {
    return () =>
      h('div', {
        class: props.card
          ? 'rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'
          : 'rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'
      }, [
        h('div', { class: 'flex items-center justify-between gap-4' }, [
          h('div', { class: 'flex min-w-0 items-start gap-3' }, [
            h('div', { class: 'grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' }, [
              h(Icon, { icon: props.icon, class: 'h-6 w-6' })
            ]),
            h('div', { class: 'min-w-0' }, [
              h('h3', { class: 'font-black text-slate-900 dark:text-white' }, props.title),
              h('p', { class: 'mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400' }, props.desc)
            ])
          ]),
          h('input', {
            type: 'checkbox',
            class: 'toggle toggle-success shrink-0',
            checked: props.checked,
            onChange: (event: Event) => emit('change', (event.target as HTMLInputElement).checked)
          })
        ])
      ])
  }
})

const SettingSelect = defineComponent({
  name: 'SettingSelect',
  props: {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    icon: { type: String, required: true },
    value: { type: [String, Number], default: '' },
    options: { type: Array as () => OptionItem[], required: true }
  },
  emits: ['change'],
  setup(props, { emit }) {
    return () =>
      h('div', { class: 'rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900' }, [
        h('div', { class: 'flex flex-col gap-4 md:flex-row md:items-center md:justify-between' }, [
          h('div', { class: 'flex min-w-0 items-start gap-3' }, [
            h('div', { class: 'grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' }, [
              h(Icon, { icon: props.icon, class: 'h-6 w-6' })
            ]),
            h('div', { class: 'min-w-0' }, [
              h('h3', { class: 'font-black text-slate-900 dark:text-white' }, props.title),
              h('p', { class: 'mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400' }, props.desc)
            ])
          ]),
          h('select', {
            value: props.value,
            class: 'h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white md:w-72',
            onChange: (event: Event) => emit('change', (event.target as HTMLSelectElement).value)
          }, props.options.map((option) =>
            h('option', { value: option.value }, option.label)
          ))
        ])
      ])
  }
})

const SettingRange = defineComponent({
  name: 'SettingRange',
  props: {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    icon: { type: String, required: true },
    value: { type: Number, default: 100 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    suffix: { type: String, default: '' }
  },
  emits: ['change'],
  setup(props, { emit }) {
    return () =>
      h('div', { class: 'rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900' }, [
        h('div', { class: 'flex items-start gap-3' }, [
          h('div', { class: 'grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300' }, [
            h(Icon, { icon: props.icon, class: 'h-6 w-6' })
          ]),
          h('div', { class: 'min-w-0 flex-1' }, [
            h('div', { class: 'flex items-center justify-between gap-3' }, [
              h('h3', { class: 'font-black text-slate-900 dark:text-white' }, props.title),
              h('span', { class: 'rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700 dark:bg-neutral-800 dark:text-neutral-300' }, `${props.value}${props.suffix}`)
            ]),
            h('p', { class: 'mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400' }, props.desc),
            h('input', {
              type: 'range',
              min: props.min,
              max: props.max,
              value: props.value,
              class: 'range range-success mt-5',
              onInput: (event: Event) => emit('change', Number((event.target as HTMLInputElement).value))
            })
          ])
        ])
      ])
  }
})

const config = useRuntimeConfig()
const { $realtimeDb } = useNuxtApp() as any
const sessionUser = useState<any>('sessionUser', () => ({}))

const clientName = String(config.public.clientName || 'alinayah')

const saving = ref(false)
const loading = ref(true)
const search = ref('')
const activeSection = ref('appearance')
const toastMessage = ref('')
const saveStatus = ref('Preferences synced')
const settings = ref<AnyRow>(createDefaultSettings())

let unsubscribeSettings: (() => void) | null = null
let toastTimer: ReturnType<typeof setTimeout> | null = null
let saveTimer: ReturnType<typeof setTimeout> | null = null

const sections: SectionItem[] = [
  {
    key: 'appearance',
    label: 'Appearance',
    title: 'Appearance Settings',
    desc: 'Atur tema, warna, compact mode, efek visual, dan ukuran font.',
    icon: 'ph:paint-brush-duotone'
  },
  {
    key: 'notifications',
    label: 'Notifications',
    title: 'Notification Preferences',
    desc: 'Atur notifikasi untuk pembayaran, akademik, pengumuman, izin, kunjungan, dan chat admin.',
    icon: 'ph:bell-ringing-duotone'
  },
  {
    key: 'privacy',
    label: 'Privacy & Chat',
    title: 'Privacy and Chat Control',
    desc: 'Kontrol visibilitas profil, read receipt, status aktivitas, dan izin chat admin.',
    icon: 'ph:lock-key-duotone'
  },
  {
    key: 'dashboard',
    label: 'Dashboard',
    title: 'Dashboard Experience',
    desc: 'Atur halaman default, widget, AI Insight, jadwal, statistik, dan jumlah item.',
    icon: 'ph:squares-four-duotone'
  },
  {
    key: 'security',
    label: 'Security',
    title: 'Security Settings',
    desc: 'Atur timeout sesi, login alert, PIN pembayaran, dan kontak cadangan.',
    icon: 'ph:shield-check-duotone'
  },
  {
    key: 'accessibility',
    label: 'Accessibility',
    title: 'Accessibility Preferences',
    desc: 'Atur high contrast, teks besar, shortcut keyboard, screen reader label, dan motion.',
    icon: 'ph:accessibility-duotone'
  },
  {
    key: 'data',
    label: 'Data & Sync',
    title: 'Data and Sync Management',
    desc: 'Atur export format, offline cache, autosync, local cache, dan backup preferensi.',
    icon: 'ph:database-duotone'
  },
  {
    key: 'advanced',
    label: 'Advanced',
    title: 'Advanced Settings',
    desc: 'Preview konfigurasi dan mode debugging untuk kebutuhan teknis.',
    icon: 'ph:terminal-window-duotone'
  }
]

const themeOptions = [
  {
    label: 'System',
    value: 'system',
    desc: 'Ikuti tema perangkat.',
    icon: 'ph:desktop-duotone',
    iconClass: 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
  },
  {
    label: 'Light',
    value: 'light',
    desc: 'Tampilan terang.',
    icon: 'ph:sun-duotone',
    iconClass: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  },
  {
    label: 'Dark',
    value: 'dark',
    desc: 'Tampilan gelap.',
    icon: 'ph:moon-stars-duotone',
    iconClass: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  }
]

const accentOptions: OptionItem[] = [
  { label: 'Green', value: 'green' },
  { label: 'green', value: 'green' },
  { label: 'green', value: 'green' },
  { label: 'Purple', value: 'purple' },
  { label: 'Amber', value: 'amber' }
]

const visibilityOptions: OptionItem[] = [
  { label: 'Admin dan Pengurus', value: 'admin' },
  { label: 'Admin, Pengurus, dan Wali Kelas', value: 'staff' },
  { label: 'Hanya Admin Utama', value: 'private' }
]

const defaultPageOptions: OptionItem[] = [
  { label: 'Dashboard Wali', value: '/wali' },
  { label: 'Santri', value: '/wali/santri' },
  { label: 'Akademik', value: '/wali/akademik' },
  { label: 'Pembayaran', value: '/wali/pembayaran' },
  { label: 'Schedule', value: '/wali/schedule' },
  { label: 'Pengumuman', value: '/wali/pengumuman' }
]

const sessionTimeoutOptions: OptionItem[] = [
  { label: '15 menit', value: '15m' },
  { label: '30 menit', value: '30m' },
  { label: '1 jam', value: '1h' },
  { label: '6 jam', value: '6h' },
  { label: 'Tetap login', value: 'never' }
]

const exportOptions: OptionItem[] = [
  { label: 'CSV', value: 'csv' },
  { label: 'Excel', value: 'xlsx' },
  { label: 'PDF', value: 'pdf' },
  { label: 'JSON', value: 'json' }
]

const appearanceToggles: SettingToggleItem[] = [
  {
    title: 'Compact Mode',
    desc: 'Padatkan jarak antarelemen seperti Discord compact layout.',
    icon: 'ph:arrows-in-line-vertical-duotone',
    path: 'appearance.compactMode'
  },
  {
    title: 'Glass Effect',
    desc: 'Aktifkan efek blur dan transparent card pada beberapa panel.',
    icon: 'ph:sparkle-duotone',
    path: 'appearance.glassEffect'
  },
  {
    title: 'Reduce Motion',
    desc: 'Kurangi animasi transisi untuk kenyamanan mata.',
    icon: 'ph:waveform-duotone',
    path: 'appearance.reduceMotion'
  }
]

const notificationToggles: SettingToggleItem[] = [
  {
    title: 'Push Notification',
    desc: 'Terima notifikasi langsung di perangkat.',
    icon: 'ph:device-mobile-speaker-duotone',
    path: 'notifications.push'
  },
  {
    title: 'Email Notification',
    desc: 'Kirim informasi penting melalui email.',
    icon: 'ph:envelope-simple-duotone',
    path: 'notifications.email'
  },
  {
    title: 'WhatsApp Reminder',
    desc: 'Aktifkan pengingat WhatsApp jika tersedia.',
    icon: 'ic:baseline-whatsapp',
    path: 'notifications.whatsapp'
  },
  {
    title: 'Pembayaran',
    desc: 'Tagihan SPP, invoice, dan konfirmasi pembayaran.',
    icon: 'akar-icons:money',
    path: 'notifications.payment'
  },
  {
    title: 'Pengumuman',
    desc: 'Agenda lembaga dan informasi penting.',
    icon: 'ph:megaphone-duotone',
    path: 'notifications.announcement'
  },
  {
    title: 'Akademik',
    desc: 'Nilai, absensi, hafalan, dan perkembangan santri.',
    icon: 'solar:chart-linear',
    path: 'notifications.academic'
  },
  {
    title: 'Perizinan',
    desc: 'Status izin pulang, izin keluar, dan pengajuan wali.',
    icon: 'solar:letter-linear',
    path: 'notifications.permission'
  },
  {
    title: 'Kunjungan',
    desc: 'Jadwal kunjungan dan status verifikasi.',
    icon: 'material-symbols:parent-child-dining-outline-rounded',
    path: 'notifications.visit'
  },
  {
    title: 'Chat Admin',
    desc: 'Pesan masuk dari admin atau pengurus.',
    icon: 'ph:chat-circle-text-duotone',
    path: 'notifications.chat'
  }
]

const privacyToggles: SettingToggleItem[] = [
  {
    title: 'Show Phone to Admin',
    desc: 'Izinkan admin/pengurus melihat nomor HP wali.',
    icon: 'ph:phone-call-duotone',
    path: 'privacy.showPhoneToAdmin'
  },
  {
    title: 'Allow Admin Chat',
    desc: 'Izinkan admin mengirim pesan langsung ke wali.',
    icon: 'ph:chat-circle-text-duotone',
    path: 'privacy.allowAdminChat'
  },
  {
    title: 'Read Receipt',
    desc: 'Tampilkan status pesan sudah dibaca.',
    icon: 'ph:checks-duotone',
    path: 'privacy.readReceipt'
  },
  {
    title: 'Activity Status',
    desc: 'Tampilkan status aktif terakhir pada admin.',
    icon: 'ph:pulse-duotone',
    path: 'privacy.activityStatus'
  }
]

const dashboardToggles: SettingToggleItem[] = [
  {
    title: 'AI Insight',
    desc: 'Tampilkan insight otomatis pada dashboard dan fitur wali.',
    icon: 'ph:sparkle-duotone',
    path: 'dashboard.showAiInsight'
  },
  {
    title: 'Stats Cards',
    desc: 'Tampilkan ringkasan statistik di halaman utama wali.',
    icon: 'ph:chart-bar-duotone',
    path: 'dashboard.showStatsCards'
  },
  {
    title: 'Upcoming Schedule',
    desc: 'Tampilkan agenda terdekat pada halaman utama.',
    icon: 'solar:calendar-line-duotone',
    path: 'dashboard.showUpcomingSchedule'
  },
  {
    title: 'Pinned Announcement',
    desc: 'Tampilkan pengumuman penting di bagian atas.',
    icon: 'ph:push-pin-duotone',
    path: 'dashboard.pinnedAnnouncement'
  }
]

const securityToggles: SettingToggleItem[] = [
  {
    title: 'Login Alert',
    desc: 'Beritahu jika akun wali digunakan untuk login.',
    icon: 'ph:bell-ringing-duotone',
    path: 'security.loginAlert'
  },
  {
    title: 'PIN for Payment',
    desc: 'Minta PIN sebelum membuka detail pembayaran.',
    icon: 'ph:password-duotone',
    path: 'security.requirePinForPayment'
  },
  {
    title: 'Sensitive Data Masking',
    desc: 'Sembunyikan NIK, nomor HP, dan data sensitif secara default.',
    icon: 'ph:eye-slash-duotone',
    path: 'security.maskSensitiveData'
  },
  {
    title: 'Trusted Device Only',
    desc: 'Prioritaskan perangkat yang biasa digunakan.',
    icon: 'ph:device-mobile-camera-duotone',
    path: 'security.trustedDeviceOnly'
  }
]

const accessibilityToggles: SettingToggleItem[] = [
  {
    title: 'High Contrast',
    desc: 'Tingkatkan kontras warna untuk keterbacaan.',
    icon: 'ph:circle-half-tilt-duotone',
    path: 'accessibility.highContrast'
  },
  {
    title: 'Large Text',
    desc: 'Gunakan teks lebih besar untuk pengguna mobile.',
    icon: 'ph:text-aa-duotone',
    path: 'accessibility.largeText'
  },
  {
    title: 'Keyboard Shortcut',
    desc: 'Aktifkan shortcut keyboard untuk navigasi cepat.',
    icon: 'ph:keyboard-duotone',
    path: 'accessibility.keyboardShortcut'
  },
  {
    title: 'Screen Reader Label',
    desc: 'Optimalkan label untuk screen reader.',
    icon: 'ph:speaker-high-duotone',
    path: 'accessibility.screenReaderLabel'
  }
]

const dataToggles: SettingToggleItem[] = [
  {
    title: 'Auto Sync',
    desc: 'Sinkronkan preferensi otomatis ke database.',
    icon: 'ph:arrows-clockwise-duotone',
    path: 'data.autoSync'
  },
  {
    title: 'Offline Cache',
    desc: 'Simpan cache preferensi di browser.',
    icon: 'ph:hard-drives-duotone',
    path: 'data.offlineCache'
  },
  {
    title: 'Include Metadata on Export',
    desc: 'Tambahkan timestamp, user id, dan sumber data saat export.',
    icon: 'ph:file-code-duotone',
    path: 'data.includeMetadata'
  },
  {
    title: 'Auto Backup Preferences',
    desc: 'Simpan backup pengaturan saat ada perubahan besar.',
    icon: 'ph:cloud-arrow-up-duotone',
    path: 'data.autoBackup'
  }
]

const filteredSections = computed(() => {
  const q = normalizeText(search.value)

  if (!q) return sections

  return sections.filter((section) => {
    return normalizeText(`${section.label} ${section.title} ${section.desc}`).includes(q)
  })
})

const currentSection = computed(() => {
  return sections.find((section) => section.key === activeSection.value) || sections[0]
})

const formattedSettings = computed(() => {
  return JSON.stringify(settings.value, null, 2)
})

const settingsHealth = computed(() => {
  const core = [
    getSetting('notifications.payment'),
    getSetting('notifications.announcement'),
    getSetting('notifications.academic'),
    getSetting('privacy.allowAdminChat'),
    getSetting('security.loginAlert'),
    getSetting('data.autoSync'),
    getSetting('dashboard.showAiInsight'),
    getSetting('accessibility.screenReaderLabel')
  ]

  const enabled = core.filter(Boolean).length
  return Math.round((enabled / core.length) * 100)
})

const privacyScore = computed(() => {
  let score = 40

  if (getSetting('privacy.profileVisibility') === 'private') score += 20
  if (!getSetting('privacy.activityStatus')) score += 15
  if (getSetting('security.maskSensitiveData')) score += 15
  if (getSetting('privacy.readReceipt')) score += 5
  if (getSetting('security.loginAlert')) score += 5

  return Math.min(100, score)
})

const notificationScore = computed(() => {
  const keys = [
    'notifications.push',
    'notifications.payment',
    'notifications.announcement',
    'notifications.academic',
    'notifications.permission',
    'notifications.visit',
    'notifications.chat'
  ]

  const enabled = keys.filter((key) => getSetting(key)).length
  return Math.round((enabled / keys.length) * 100)
})

const accessibilityScore = computed(() => {
  let score = 50

  if (getSetting('accessibility.screenReaderLabel')) score += 15
  if (getSetting('accessibility.largeText')) score += 10
  if (getSetting('accessibility.highContrast')) score += 10
  if (getSetting('appearance.reduceMotion')) score += 10
  if (getSetting('accessibility.interfaceScale') >= 100) score += 5

  return Math.min(100, score)
})

const preferenceInsight = computed(() => {
  if (settingsHealth.value >= 85) {
    return {
      title: 'Preferensi wali sudah optimal',
      desc: 'Pengaturan notifikasi, privasi, keamanan, dan dashboard sudah seimbang untuk pemantauan santri secara aktif.'
    }
  }

  if (settingsHealth.value >= 60) {
    return {
      title: 'Preferensi sudah cukup baik',
      desc: 'Beberapa fitur penting belum aktif. Disarankan mengaktifkan AI Insight, notifikasi pembayaran, pengumuman, dan login alert.'
    }
  }

  return {
    title: 'Preferensi perlu disesuaikan',
    desc: 'Banyak pengaturan penting belum aktif. Gunakan Guardian Mode untuk mengaktifkan konfigurasi pemantauan wali yang lebih lengkap.'
  }
})

function createDefaultSettings() {
  return {
    appearance: {
      theme: 'system',
      accentColor: 'green',
      compactMode: false,
      glassEffect: true,
      reduceMotion: false,
      fontScale: 100
    },
    notifications: {
      push: true,
      email: true,
      whatsapp: false,
      payment: true,
      announcement: true,
      academic: true,
      permission: true,
      visit: true,
      chat: true,
      quietHours: false,
      quietStart: '21:00',
      quietEnd: '05:00'
    },
    privacy: {
      profileVisibility: 'admin',
      showPhoneToAdmin: true,
      allowAdminChat: true,
      readReceipt: true,
      activityStatus: true
    },
    dashboard: {
      defaultPage: '/wali',
      showAiInsight: true,
      showStatsCards: true,
      showUpcomingSchedule: true,
      pinnedAnnouncement: true,
      itemsPerPage: 10
    },
    security: {
      sessionTimeout: '1h',
      loginAlert: true,
      requirePinForPayment: false,
      maskSensitiveData: true,
      trustedDeviceOnly: false,
      backupContact: ''
    },
    accessibility: {
      interfaceScale: 100,
      highContrast: false,
      largeText: false,
      keyboardShortcut: true,
      screenReaderLabel: true
    },
    data: {
      exportFormat: 'csv',
      autoSync: true,
      offlineCache: true,
      includeMetadata: true,
      autoBackup: false
    }
  }
}

function getSetting(path: string) {
  return getByPath(settings.value, path)
}

function setSetting(path: string, value: any) {
  updateByPath(settings.value, path, value)
  saveStatus.value = 'Unsaved changes'

  if (getSetting('data.offlineCache')) {
    saveLocalSettings()
  }

  if (getSetting('data.autoSync')) {
    debouncedSave(path, value)
  }
}

function setCheckbox(path: string, event: Event) {
  setSetting(path, (event.target as HTMLInputElement).checked)
}

function setInput(path: string, event: Event) {
  setSetting(path, (event.target as HTMLInputElement).value)
}

function getByPath(source: AnyRow, path: string) {
  return path.split('.').reduce((acc: any, key) => acc?.[key], source)
}

function updateByPath(source: AnyRow, path: string, value: any) {
  const keys = path.split('.')
  let target = source

  for (let i = 0; i < keys.length - 1; i++) {
    if (!target[keys[i]] || typeof target[keys[i]] !== 'object') {
      target[keys[i]] = {}
    }

    target = target[keys[i]]
  }

  target[keys[keys.length - 1]] = value
}

function debouncedSave(path: string, value: any) {
  if (saveTimer) clearTimeout(saveTimer)

  saveTimer = setTimeout(() => {
    saveSettingPath(path, value)
  }, 500)
}

async function saveSettingPath(path: string, value: any) {
  if (!$realtimeDb || !getCurrentUid()) {
    saveLocalSettings()
    saveStatus.value = 'Saved locally'
    return
  }

  saving.value = true

  try {
    const firebasePath = path.replace(/\./g, '/')

    await update(dbRef($realtimeDb, `${clientName}/waliSettings/${getCurrentUid()}`), {
      [firebasePath]: value,
      updatedAt: Date.now()
    })

    saveStatus.value = 'Preferences synced'
  } catch (e: any) {
    saveStatus.value = 'Sync failed, saved locally'
    saveLocalSettings()
  } finally {
    saving.value = false
  }
}

async function saveAllSettings() {
  saveLocalSettings()

  if (!$realtimeDb || !getCurrentUid()) {
    showToast('Pengaturan disimpan di perangkat ini.')
    saveStatus.value = 'Saved locally'
    return
  }

  saving.value = true

  try {
    await set(dbRef($realtimeDb, `${clientName}/waliSettings/${getCurrentUid()}`), {
      ...settings.value,
      updatedAt: Date.now()
    })

    saveStatus.value = 'Preferences synced'
    showToast('Pengaturan berhasil disimpan.')
  } catch (e: any) {
    saveStatus.value = 'Sync failed, saved locally'
    showToast('Gagal sync database, pengaturan disimpan lokal.')
  } finally {
    saving.value = false
  }
}

function applyPreset(type: 'focus' | 'guardian' | 'privacy') {
  if (type === 'focus') {
    setSetting('notifications.push', true)
    setSetting('notifications.whatsapp', false)
    setSetting('notifications.chat', true)
    setSetting('notifications.quietHours', true)
    setSetting('dashboard.showStatsCards', false)
    setSetting('appearance.reduceMotion', true)
    showToast('Focus Mode aktif.')
    return
  }

  if (type === 'guardian') {
    setSetting('notifications.push', true)
    setSetting('notifications.email', true)
    setSetting('notifications.payment', true)
    setSetting('notifications.announcement', true)
    setSetting('notifications.academic', true)
    setSetting('notifications.permission', true)
    setSetting('notifications.visit', true)
    setSetting('notifications.chat', true)
    setSetting('dashboard.showAiInsight', true)
    setSetting('dashboard.showStatsCards', true)
    setSetting('privacy.allowAdminChat', true)
    setSetting('security.loginAlert', true)
    showToast('Guardian Mode aktif.')
    return
  }

  setSetting('privacy.profileVisibility', 'private')
  setSetting('privacy.activityStatus', false)
  setSetting('privacy.readReceipt', false)
  setSetting('security.maskSensitiveData', true)
  setSetting('security.loginAlert', true)
  setSetting('data.includeMetadata', false)
  showToast('Privacy Mode aktif.')
}

function resetSettings() {
  settings.value = createDefaultSettings()
  saveLocalSettings()
  saveAllSettings()
  showToast('Pengaturan dikembalikan ke default.')
}

function clearLocalCache() {
  if (import.meta.client) {
    localStorage.removeItem(localStorageKey())
  }

  showToast('Local cache berhasil dibersihkan.')
}

function saveLocalSettings() {
  if (!import.meta.client) return

  localStorage.setItem(localStorageKey(), JSON.stringify(settings.value))
}

function loadLocalSettings() {
  if (!import.meta.client) return null

  try {
    const raw = localStorage.getItem(localStorageKey())
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function localStorageKey() {
  return `${clientName}:wali-settings:${getCurrentUid() || 'guest'}`
}

function setupRealtime() {
  loading.value = true

  const local = loadLocalSettings()

  if (local) {
    settings.value = mergeDeep(createDefaultSettings(), local)
  }

  if (!$realtimeDb || !getCurrentUid()) {
    loading.value = false
    return
  }

  if (unsubscribeSettings) {
    try {
      unsubscribeSettings()
    } catch {}

    unsubscribeSettings = null
  }

  unsubscribeSettings = onValue(dbRef($realtimeDb, `${clientName}/waliSettings/${getCurrentUid()}`), (snap) => {
    const remote = snap.val()

    if (remote) {
      settings.value = mergeDeep(createDefaultSettings(), remote)
      saveLocalSettings()
    }

    loading.value = false
    saveStatus.value = remote ? 'Preferences synced' : 'Using default settings'
  })
}

function mergeDeep(target: AnyRow, source: AnyRow) {
  const output = { ...target }

  for (const key of Object.keys(source || {})) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = mergeDeep(output[key] || {}, source[key])
    } else {
      output[key] = source[key]
    }
  }

  return output
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

watch(
  () => getCurrentUid(),
  () => {
    setupRealtime()
  }
)

onMounted(() => {
  setupRealtime()
})

onBeforeUnmount(() => {
  if (unsubscribeSettings) {
    try {
      unsubscribeSettings()
    } catch {}

    unsubscribeSettings = null
  }

  if (toastTimer) {
    clearTimeout(toastTimer)
  }

  if (saveTimer) {
    clearTimeout(saveTimer)
  }
})
</script>