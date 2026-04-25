<template>
  <main class="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-white to-lime-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div class="absolute -left-24 -top-24 h-120 w-120 rounded-full bg-green-200/40 blur-3xl dark:bg-green-900/20"></div>
      <div class="absolute -bottom-24 -right-24 h-112 w-md rounded-full bg-lime-200/30 blur-3xl dark:bg-green-800/10"></div>
      <div class="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-green-500/10 to-transparent"></div>
    </div>

    <div class="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:grid lg:grid-cols-2 lg:gap-10 lg:px-8">
      <!-- Left Content -->
      <section class="mb-10 hidden lg:block">
        <div class="max-w-xl">
          <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-4 py-2 text-sm font-semibold text-green-700 shadow-sm backdrop-blur dark:border-green-900/40 dark:bg-neutral-900/70 dark:text-green-300">
            <span class="inline-block h-2.5 w-2.5 rounded-full bg-green-500"></span>
            Wali Portal Access
          </div>

          <h1 class="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white xl:text-5xl">
            Pantau santri dengan
            <span class="text-green-600 dark:text-green-400">lebih mudah</span>,
            cepat, dan aman.
          </h1>

          <p class="mt-5 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300 xl:text-lg">
            Wali dapat masuk menggunakan akun yang sudah terdaftar, atau membuat akun baru setelah data wali, santri, dan nomor HP berhasil diverifikasi.
          </p>

        </div>
      </section>

      <!-- Auth Card -->
      <section class="w-full">
        <div class="mx-auto w-full max-w-md">
          <div class="mb-5 text-center lg:hidden">
            <div class="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-lg ring-1 ring-green-100 dark:bg-neutral-900 dark:ring-neutral-800">
              <img src="/assets/logo.png" alt="Logo" class="h-10 w-10 object-contain" />
            </div>
            <h1 class="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Portal Wali
            </h1>
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Masuk atau daftar akun wali
            </p>
          </div>

          <div class="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-[0_20px_80px_-20px_rgba(34,197,94,0.28)] backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/85 dark:shadow-none sm:p-8">
            <div class="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-green-400 via-green-500 to-lime-400"></div>

            <div class="hidden lg:block">
              <div class="mb-6 flex items-center gap-4">
                <div class="flex h-16 w-16 items-center justify-center rounded-3xl bg-green-500 text-white shadow-lg shadow-green-500/30">
                  <img src="/assets/logo.png" alt="Logo" class="h-10 w-10 object-contain" />
                </div>
                <div>
                  <h2 class="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Portal Wali
                  </h2>
                  <p class="text-sm text-slate-600 dark:text-slate-400">
                    Masuk atau aktivasi akun baru
                  </p>
                </div>
              </div>
            </div>

            <!-- Tabs -->
            <div class="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
              <button
                type="button"
                @click="activeTab = 'login'"
                :class="[
                  'rounded-xl px-4 py-2.5 text-sm font-bold transition',
                  activeTab === 'login'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-neutral-200'
                    : 'text-slate-500 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white'
                ]"
              >
                Masuk
              </button>

              <button
                type="button"
                @click="activeTab = 'register'"
                :class="[
                  'rounded-xl px-4 py-2.5 text-sm font-bold transition',
                  activeTab === 'register'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-neutral-200'
                    : 'text-slate-500 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white'
                ]"
              >
                Daftar Wali
              </button>
            </div>

            <!-- Login Form -->
            <form v-if="activeTab === 'login'" class="space-y-5" @submit.prevent="login">
              <div>
                <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email atau Nomor HP
                </label>

                <div class="relative">
                  <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                    <Icon icon="ph:identification-card-duotone" class="h-5 w-5" />
                  </span>

                  <input
                    v-model="loginForm.identity"
                    type="text"
                    required
                    placeholder="email wali atau 08xxxxxxxxxx"
                    class="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-3.5 pl-12 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-green-500 dark:focus:bg-neutral-800 dark:focus:ring-green-500/10"
                  />
                </div>
              </div>

              <div>
                <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>

                <div class="relative">
                  <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                    <Icon icon="ph:lock-key-duotone" class="h-5 w-5" />
                  </span>

                  <input
                    v-model="loginForm.password"
                    :type="showLoginPassword ? 'text' : 'password'"
                    required
                    placeholder="Masukkan password"
                    class="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-3.5 pl-12 pr-12 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-green-500 dark:focus:bg-neutral-800 dark:focus:ring-green-500/10"
                  />

                  <button
                    type="button"
                    @click="showLoginPassword = !showLoginPassword"
                    class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition hover:text-green-600 dark:text-neutral-500 dark:hover:text-green-400"
                  >
                    <Icon :icon="showLoginPassword ? 'ph:eye-slash-duotone' : 'ph:eye-duotone'" class="h-5 w-5" />
                  </button>
                </div>
              </div>

              <label class="inline-flex cursor-pointer items-center gap-3">
                <input
                  v-model="loginForm.remember"
                  type="checkbox"
                  class="checkbox checkbox-success checkbox-sm"
                />
                <span class="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Ingat saya
                </span>
              </label>

              <button
                type="submit"
                :disabled="loginLoading"
                class="btn min-h-0 w-full flex items-center justify-center gap-3 rounded-2xl border-0 bg-green-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-500/30 transition hover:-translate-y-0.5 hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Icon v-if="loginLoading" icon="ph:spinner-gap-duotone" class="h-5 w-5 animate-spin text-white" />
                <Icon v-else icon="ph:sign-in-duotone" class="h-5 w-5 text-white" />
                {{ loginLoading ? 'Memproses...' : 'Masuk ke Portal Wali' }}
              </button>
            </form>

            <!-- Register Form -->
            <form v-else class="space-y-5" @submit.prevent="handleRegisterSubmit">
              <!-- Stepper -->
              <div class="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-3 dark:border-neutral-700 dark:bg-neutral-800/70">
                <div class="grid grid-cols-2 gap-2">
                  <div
                    :class="[
                      'rounded-2xl px-3 py-3 transition',
                      registerStep >= 1
                        ? 'bg-white shadow-sm dark:bg-neutral-900'
                        : 'bg-transparent'
                    ]"
                  >
                    <div class="flex items-center gap-2">
                      <div
                        :class="[
                          'grid h-8 w-8 place-items-center rounded-full text-xs font-black',
                          registerStep >= 1 ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'
                        ]"
                      >
                        1
                      </div>
                      <div>
                        <div class="text-xs font-black text-slate-900 dark:text-white">
                          Verifikasi
                        </div>
                        <div class="text-[11px] text-slate-500 dark:text-slate-400">
                          Cek data wali
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    :class="[
                      'rounded-2xl px-3 py-3 transition',
                      registerStep >= 2
                        ? 'bg-white shadow-sm dark:bg-neutral-900'
                        : 'bg-transparent'
                    ]"
                  >
                    <div class="flex items-center gap-2">
                      <div
                        :class="[
                          'grid h-8 w-8 place-items-center rounded-full text-xs font-black',
                          registerStep >= 2 ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'
                        ]"
                      >
                        2
                      </div>
                      <div>
                        <div class="text-xs font-black text-slate-900 dark:text-white">
                          Password
                        </div>
                        <div class="text-[11px] text-slate-500 dark:text-slate-400">
                          Buat akun
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 1 -->
              <div v-if="registerStep === 1" class="space-y-5">
                <div>
                  <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Nama Wali
                  </label>

                  <div class="relative">
                    <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                      <Icon icon="ph:user-circle-duotone" class="h-5 w-5" />
                    </span>

                    <input
                      v-model.trim="registerForm.waliName"
                      type="text"
                      required
                      placeholder="Contoh: Ahmad Budi"
                      class="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-3.5 pl-12 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-green-500 dark:focus:bg-neutral-800 dark:focus:ring-green-500/10"
                    />
                  </div>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Nama Santri
                  </label>

                  <div class="relative">
                    <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                      <Icon icon="ph:student-duotone" class="h-5 w-5" />
                    </span>

                    <input
                      v-model.trim="registerForm.santriName"
                      type="text"
                      required
                      placeholder="Masukkan nama santri"
                      class="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-3.5 pl-12 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-green-500 dark:focus:bg-neutral-800 dark:focus:ring-green-500/10"
                    />
                  </div>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Nomor HP
                  </label>

                  <div class="relative">
                    <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                      <Icon icon="ph:whatsapp-logo-duotone" class="h-5 w-5" />
                    </span>

                    <input
                      v-model.trim="registerForm.phone"
                      type="tel"
                      required
                      placeholder="08xxxxxxxxxx"
                      class="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-3.5 pl-12 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-green-500 dark:focus:bg-neutral-800 dark:focus:ring-green-500/10"
                    />
                  </div>

                  <p class="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    Nama wali, nama santri, dan nomor HP harus sesuai dengan data yang tersimpan di sistem.
                  </p>
                </div>

                <button
                  type="button"
                  :disabled="verifyLoading"
                  @click="verifyRegisterData"
                  class="btn min-h-0 flex justify-center gap-4 w-full rounded-2xl border-0 bg-green-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-500/30 transition hover:-translate-y-0.5 hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Icon v-if="verifyLoading" icon="ph:spinner-gap-duotone" class="h-5 w-5 animate-spin text-white" />
                  <Icon v-else icon="ph:shield-check-duotone" class="h-5 w-5 text-white" />
                  {{ verifyLoading ? 'Mengecek Data...' : 'Cek Data & Lanjutkan' }}
                </button>
              </div>

              <!-- Step 2 -->
              <div v-else class="space-y-5">
                <div v-if="verifiedSantri" class="rounded-[1.5rem] border border-green-100 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900/40 dark:bg-green-500/10 dark:text-green-300">
                  <div class="flex items-start gap-3">
                    <div class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-green-500 text-white">
                      <Icon icon="ph:check-bold" class="h-5 w-5" />
                    </div>
                    <div>
                      <div class="font-black">Data ditemukan</div>
                      <div class="mt-1 leading-6">
                        Wali: <b>{{ verifiedSantri.waliName }}</b><br />
                        Santri: <b>{{ verifiedSantri.santriName }}</b><br />
                        Nomor: <b>{{ verifiedSantri.phone }}</b>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Buat Password
                  </label>

                  <div class="relative">
                    <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                      <Icon icon="ph:lock-key-duotone" class="h-5 w-5" />
                    </span>

                    <input
                      v-model="registerForm.password"
                      :type="showRegisterPassword ? 'text' : 'password'"
                      required
                      minlength="8"
                      placeholder="Minimal 8 karakter"
                      class="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-3.5 pl-12 pr-12 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-green-500 dark:focus:bg-neutral-800 dark:focus:ring-green-500/10"
                    />

                    <button
                      type="button"
                      @click="showRegisterPassword = !showRegisterPassword"
                      class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition hover:text-green-600 dark:text-neutral-500 dark:hover:text-green-400"
                    >
                      <Icon :icon="showRegisterPassword ? 'ph:eye-slash-duotone' : 'ph:eye-duotone'" class="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Konfirmasi Password
                  </label>

                  <div class="relative">
                    <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                      <Icon icon="ph:shield-check-duotone" class="h-5 w-5" />
                    </span>

                    <input
                      v-model="registerForm.confirmPassword"
                      :type="showRegisterPassword ? 'text' : 'password'"
                      required
                      minlength="8"
                      placeholder="Ulangi password"
                      class="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-3.5 pl-12 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-green-500 dark:focus:bg-neutral-800 dark:focus:ring-green-500/10"
                    />
                  </div>
                </div>

                <label class="inline-flex cursor-pointer items-center gap-3">
                  <input
                    v-model="registerForm.remember"
                    type="checkbox"
                    class="checkbox checkbox-success checkbox-sm"
                  />
                  <span class="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Ingat saya setelah daftar
                  </span>
                </label>

                <div class="grid grid-cols-1 gap-2 sm:grid-cols-[0.75fr,1fr]">
                  <button
                    type="button"
                    :disabled="registerLoading"
                    @click="backToVerifyStep"
                    class="btn min-h-0 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  >
                    Kembali
                  </button>

                  <button
                    type="submit"
                    :disabled="registerLoading"
                    class="btn flex justify-center gap-3 min-h-0 rounded-2xl border-0 bg-green-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-500/30 transition hover:-translate-y-0.5 hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Icon v-if="registerLoading" icon="ph:spinner-gap-duotone" class="h-5 w-5 animate-spin text-white" />
                    <Icon v-else icon="ph:user-plus-duotone" class="h-5 w-5 text-white" />
                    {{ registerLoading ? 'Mendaftarkan...' : 'Daftar & Masuk' }}
                  </button>
                </div>

                <div class="rounded-2xl bg-lime-50 px-4 py-3 text-sm text-lime-800 dark:bg-lime-500/10 dark:text-lime-300">
                  Setelah berhasil daftar, file password akan otomatis terdownload:
                  <b>wali_{{ clientName }}_password.txt</b>
                </div>
              </div>
            </form>
          </div>

          <p class="mt-6 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
            © 2025 Obayan Sencra. All rights reserved.
          </p>
        </div>
      </section>
    </div>

    <!-- Wrong Data Modal -->
    <div
      v-if="showWrongModal"
      class="fixed inset-0 z-[9999] overflow-y-auto p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Tutup modal"
        @click="closeWrongModal"
      ></button>

      <div class="relative z-10 flex min-h-full items-center justify-center">
        <div class="w-full max-w-md rounded-[2rem] border border-rose-100 bg-white p-6 shadow-2xl dark:border-rose-900/40 dark:bg-neutral-900">
          <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-300">
            <Icon icon="ph:warning-circle-duotone" class="h-9 w-9" />
          </div>

          <h3 class="mt-5 text-center text-xl font-black text-slate-900 dark:text-white">
            {{ wrongModalTitle }}
          </h3>

          <p class="mt-2 text-center text-sm leading-6 text-slate-600 dark:text-neutral-300">
            {{ wrongModalMessage }}
          </p>

          <div class="mt-5 rounded-2xl bg-slate-50 p-4 text-xs leading-6 text-slate-500 dark:bg-neutral-800 dark:text-neutral-400">
            Pastikan nama wali, nama santri, dan nomor HP sama persis dengan data yang tersimpan di sistem sekolah/pesantren.
          </div>

          <button
            type="button"
            @click="closeWrongModal"
            class="btn mt-5 min-h-0 w-full rounded-2xl border-0 bg-rose-600 px-4 py-3 text-sm font-bold text-white hover:bg-rose-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  type User
} from 'firebase/auth'
import {
  child,
  get,
  getDatabase,
  ref as dbRef,
  set,
  update
} from 'firebase/database'
import { useRuntimeConfig } from 'nuxt/app'

type ActiveTab = 'login' | 'register'
type RegisterStep = 1 | 2

type SantriMatch = {
  id: string
  santriName: string
  waliName: string
  phone: string
  alamat: string
  raw: Record<string, unknown>
}

type WaliProfile = {
  uid: string
  email: string
  displayName: string
  role: 'wali'
  isActive: boolean
  phone: string
  nohp: string
  waliName: string
  waliPhone: string
  santriId: string
  santriName: string
  santriIds: string[]
  allowedRoutes: string[]
  createdAt: number
  updatedAt: number
  source: string
}

const config = useRuntimeConfig()
const clientName = String(config.public.clientName || 'alinayah')

const activeTab = ref<ActiveTab>('login')
const registerStep = ref<RegisterStep>(1)

const loginForm = ref({
  identity: '',
  password: '',
  remember: true
})

const registerForm = ref({
  waliName: '',
  santriName: '',
  phone: '',
  password: '',
  confirmPassword: '',
  remember: true
})

const verifiedSantri = ref<SantriMatch | null>(null)

const showLoginPassword = ref(false)
const showRegisterPassword = ref(false)

const loginLoading = ref(false)
const verifyLoading = ref(false)
const registerLoading = ref(false)

const showWrongModal = ref(false)
const wrongModalTitle = ref('Data tidak cocok')
const wrongModalMessage = ref('Data yang Anda masukkan tidak ditemukan.')

const AUTH_KEY = `${clientName}:auth`
const PASSPHRASE = `${clientName}-wali-secret`
const SALT = `${clientName}-wali-static-salt`
const ITER = 120_000
const IV_BYTES = 12
const routerRedirect = '/wali'

const defaultWaliRoutes = [
  '/wali',
  '/wali/santri',
  '/wali/pembayaran',
  '/wali/pengumuman'
]

async function deriveKey(pass: string, salt: string) {
  const enc = new TextEncoder()

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(pass),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: ITER,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

function toB64(buf: ArrayBuffer | Uint8Array) {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  return btoa(String.fromCharCode(...bytes))
}

async function encryptJSON(data: unknown) {
  const key = await deriveKey(PASSPHRASE, SALT)
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES))
  const enc = new TextEncoder()

  const cipher = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(JSON.stringify(data))
  )

  return JSON.stringify({
    v: 1,
    iv: toB64(iv),
    ct: toB64(cipher)
  })
}

function normalizePath(path: string) {
  try {
    const url = new URL(path, 'http://x')
    return url.pathname.replace(/\/+$/, '') || '/'
  } catch {
    return (path || '/').replace(/\/+$/, '') || '/'
  }
}

function coerceRoutes(value: unknown) {
  if (Array.isArray(value)) return value.map(String)

  if (value && typeof value === 'object') {
    return Object.values(value)
      .filter((item) => typeof item === 'string')
      .map(String)
  }

  return []
}

function pickFirstAllowedPath(routes: string[]) {
  const list = routes.map(normalizePath).filter(Boolean)
  const firstWali = list.find((path) => path === '/wali' || path.startsWith('/wali'))

  return firstWali || routerRedirect
}

function normalizeName(value?: string) {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\p{L}\p{N}\s'.-]/gu, '')
    .trim()
}

function strictNameSame(a?: string, b?: string) {
  return normalizeName(a) === normalizeName(b)
}

function sanitizePhoneID(input?: string) {
  let digits = String(input || '').trim().replace(/[^\d]/g, '')

  if (!digits) return ''
  if (digits.startsWith('0062')) digits = '62' + digits.slice(4)
  if (digits.startsWith('62')) return digits[2] === '0' ? '62' + digits.slice(3) : digits
  if (digits.startsWith('8')) return '62' + digits
  if (digits.startsWith('0')) return '62' + digits.slice(1)
  if (digits.startsWith('00')) return digits.slice(2)

  return digits
}

function strictPhoneSame(a?: string, b?: string) {
  const pa = sanitizePhoneID(a)
  const pb = sanitizePhoneID(b)

  return Boolean(pa && pb && pa === pb)
}

function safeClientNameForEmail() {
  return clientName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^-+|-+$/g, '') || 'client'
}

function phoneToEmail(phone: string) {
  const digits = sanitizePhoneID(phone)

  if (!digits) {
    throw new Error('Nomor HP tidak valid.')
  }

  return `${digits}-wali@${safeClientNameForEmail()}.sch.id`
}

function getLoginEmail(identity: string) {
  const value = identity.trim().toLowerCase()

  if (!value) {
    throw new Error('Email atau nomor HP wajib diisi.')
  }

  if (value.includes('@')) return value

  return phoneToEmail(value)
}

function getRawString(raw: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = raw[key]

    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim()
    }
  }

  return ''
}

function getRawStringList(raw: Record<string, unknown>, keys: string[]) {
  return keys
    .map((key) => raw[key])
    .filter((value) => value !== undefined && value !== null && String(value).trim())
    .map((value) => String(value).trim())
}

function getWaliNameCandidates(raw: Record<string, unknown>) {
  return getRawStringList(raw, [
    'walisantri',
    'wali',
    'waliName',
    'namaWali',
    'ortu',
    'orangtua',
    'orangTua',
    'ayahNama',
    'ayah',
    'namaAyah',
    'ibuNama',
    'ibu',
    'namaIbu'
  ])
}

function getPhoneCandidates(raw: Record<string, unknown>) {
  return getRawStringList(raw, [
    'nohp',
    'noHp',
    'no_hp',
    'no_wa',
    'whatsapp',
    'wa',
    'wali_nohp',
    'waliNoHp',
    'wali_whatsapp',
    'phone',
    'telp',
    'telepon',
    'nomorHp',
    'nomor_hp'
  ])
}

async function findSantriByVerifiedData(params: {
  waliName: string
  santriName: string
  phone: string
}): Promise<SantriMatch> {
  const db = getDatabase()
  const snap = await get(child(dbRef(db), `${clientName}/santri`))

  if (!snap.exists()) {
    throw new Error('Data santri belum tersedia.')
  }

  const data = snap.val() || {}
  const matches: SantriMatch[] = []

  for (const [id, rawValue] of Object.entries(data as Record<string, Record<string, unknown>>)) {
    const raw = rawValue || {}

    const candidateSantriName = getRawString(raw, [
      'santri',
      'nama',
      'namaSantri',
      'name'
    ])

    const waliCandidates = getWaliNameCandidates(raw)
    const phoneCandidates = getPhoneCandidates(raw)

    const santriMatched = strictNameSame(candidateSantriName, params.santriName)
    const waliMatched = waliCandidates.some((candidate) => strictNameSame(candidate, params.waliName))
    const phoneMatched = phoneCandidates.some((candidate) => strictPhoneSame(candidate, params.phone))

    if (santriMatched && waliMatched && phoneMatched) {
      const selectedWaliName = waliCandidates.find((candidate) => strictNameSame(candidate, params.waliName)) || params.waliName
      const selectedPhone = phoneCandidates.find((candidate) => strictPhoneSame(candidate, params.phone)) || params.phone

      matches.push({
        id: String(id),
        santriName: candidateSantriName,
        waliName: selectedWaliName,
        phone: sanitizePhoneID(selectedPhone),
        alamat: getRawString(raw, ['alamat', 'address']),
        raw
      })
    }
  }

  if (!matches.length) {
    throw new Error('Nama wali, nama santri, atau nomor HP tidak cocok dengan data di sistem.')
  }

  return matches[0]!
}

function openWrongModal(title: string, message: string) {
  wrongModalTitle.value = title
  wrongModalMessage.value = message
  showWrongModal.value = true
}

function closeWrongModal() {
  showWrongModal.value = false
}

function backToVerifyStep() {
  registerStep.value = 1
  verifiedSantri.value = null
  registerForm.value.password = ''
  registerForm.value.confirmPassword = ''
}

async function verifyRegisterData() {
  verifyLoading.value = true

  try {
    const waliName = registerForm.value.waliName.trim()
    const santriName = registerForm.value.santriName.trim()
    const phone = registerForm.value.phone.trim()

    if (!waliName || !santriName || !phone) {
      openWrongModal(
        'Data belum lengkap',
        'Nama wali, nama santri, dan nomor HP wajib diisi terlebih dahulu.'
      )
      return
    }

    const found = await findSantriByVerifiedData({
      waliName,
      santriName,
      phone
    })

    verifiedSantri.value = found
    registerStep.value = 2
  } catch (e: unknown) {
    const err = e as { message?: string }

    openWrongModal(
      'Data tidak cocok',
      err?.message || 'Data yang Anda masukkan tidak ditemukan di sistem.'
    )
  } finally {
    verifyLoading.value = false
  }
}

async function readWaliProfile(uid: string) {
  const db = getDatabase()

  const paths = [
    `${clientName}/users/${uid}`,
    `${clientName}/user/${uid}`,
    `${clientName}/waliUsers/${uid}`
  ]

  for (const path of paths) {
    const snap = await get(dbRef(db, path))

    if (snap.exists()) {
      return snap.val() || {}
    }
  }

  return null
}

async function storeSession(user: User, profile: Record<string, unknown>, remember: boolean) {
  let allowedRoutes = coerceRoutes(profile.allowedRoutes)

  if (!allowedRoutes.length) {
    allowedRoutes = defaultWaliRoutes
  }

  const now = Math.floor(Date.now() / 1000)
  const ttl = remember ? 30 * 24 * 3600 : 24 * 3600

  const session = {
    sub: user.uid,
    uid: user.uid,
    email: profile.email || user.email || '',
    name: profile.displayName || user.displayName || profile.waliName || '(tanpa nama)',
    role: 'wali',
    santriId: profile.santriId || null,
    santriName: profile.santriName || profile.namaSantri || null,
    waliName: profile.waliName || profile.displayName || user.displayName || null,
    waliPhone: profile.phone || profile.nohp || profile.waliPhone || null,
    allowedRoutes,
    iat: now,
    exp: now + ttl
  }

  const token = await encryptJSON(session)

  if (remember) {
    sessionStorage.removeItem(AUTH_KEY)
    localStorage.setItem(AUTH_KEY, token)
  } else {
    localStorage.removeItem(AUTH_KEY)
    sessionStorage.setItem(AUTH_KEY, token)
  }

  return pickFirstAllowedPath(allowedRoutes)
}

function downloadPasswordFile(payload: {
  username: string
  password: string
  santriName: string
  waliName: string
  phone: string
}) {
  const content = [
    `Akun Wali ${clientName}`,
    '==============================',
    `Username : ${payload.username}`,
    `Password : ${payload.password}`,
    `Nama Wali : ${payload.waliName}`,
    `Nama Santri : ${payload.santriName}`,
    `Nomor HP : ${payload.phone}`,
    `Tanggal : ${new Date().toLocaleString('id-ID')}`,
    '',
    'Simpan file ini baik-baik dan jangan bagikan kepada orang lain.'
  ].join('\n')

  const blob = new Blob([content], {
    type: 'text/plain;charset=utf-8'
  })

  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = `wali_${clientName}_password.txt`

  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()

  URL.revokeObjectURL(url)
}

async function login() {
  loginLoading.value = true

  try {
    const email = getLoginEmail(loginForm.value.identity)
    const password = loginForm.value.password

    const auth = getAuth()
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const user = cred.user

    const profile = await readWaliProfile(user.uid)

    if (!profile) {
      openWrongModal('Profil belum dibuat', 'Profil wali belum tersedia. Silakan hubungi admin.')
      return
    }

    if (profile.isActive === false) {
      openWrongModal('Akun nonaktif', 'Akun Anda sedang nonaktif. Silakan hubungi admin.')
      return
    }

    const role = String(profile.role || 'wali')

    if (role !== 'wali') {
      openWrongModal('Akses ditolak', 'Akun ini bukan akun wali.')
      return
    }

    const dest = await storeSession(user, profile, loginForm.value.remember)
    window.location.replace(dest)
  } catch (e: unknown) {
    const err = e as { message?: string }

    openWrongModal(
      'Login gagal',
      err?.message || 'Email, nomor HP, atau password salah.'
    )
  } finally {
    loginLoading.value = false
  }
}

async function handleRegisterSubmit() {
  if (registerStep.value === 1) {
    await verifyRegisterData()
    return
  }

  await registerWali()
}

async function registerWali() {
  registerLoading.value = true

  try {
    if (!verifiedSantri.value) {
      openWrongModal('Data belum diverifikasi', 'Silakan verifikasi data wali terlebih dahulu.')
      registerStep.value = 1
      return
    }

    const password = registerForm.value.password
    const confirmPassword = registerForm.value.confirmPassword

    if (password.length < 8) {
      openWrongModal('Password terlalu pendek', 'Password minimal harus 8 karakter.')
      return
    }

    if (password !== confirmPassword) {
      openWrongModal('Password tidak sama', 'Konfirmasi password harus sama dengan password yang dibuat.')
      return
    }

    const foundSantri = verifiedSantri.value
    const authEmail = phoneToEmail(foundSantri.phone)
    const auth = getAuth()
    const db = getDatabase()

    const methods = await fetchSignInMethodsForEmail(auth, authEmail)

    if (methods.length > 0) {
      openWrongModal(
        'Akun sudah terdaftar',
        'Nomor HP ini sudah memiliki akun wali. Silakan masuk menggunakan nomor HP dan password yang pernah dibuat.'
      )
      return
    }

    const cred = await createUserWithEmailAndPassword(auth, authEmail, password)
    const user = cred.user

    const displayName = foundSantri.waliName || registerForm.value.waliName.trim()
    const now = Date.now()
    const cleanPhone = sanitizePhoneID(foundSantri.phone)

    try {
      await updateProfile(user, { displayName })
    } catch {}

    const profile: WaliProfile = {
      uid: user.uid,
      email: authEmail,
      displayName,
      role: 'wali',
      isActive: true,
      phone: cleanPhone,
      nohp: cleanPhone,
      waliName: displayName,
      waliPhone: cleanPhone,
      santriId: foundSantri.id,
      santriName: foundSantri.santriName,
      santriIds: [foundSantri.id],
      allowedRoutes: defaultWaliRoutes,
      createdAt: now,
      updatedAt: now,
      source: 'wali-self-register'
    }

    await Promise.all([
      set(dbRef(db, `${clientName}/users/${user.uid}`), profile),
      set(dbRef(db, `${clientName}/user/${user.uid}`), profile),
      set(dbRef(db, `${clientName}/waliUsers/${user.uid}`), {
        uid: user.uid,
        phone: cleanPhone,
        email: authEmail,
        waliname: displayName,
        nohp: cleanPhone,
        alamat: foundSantri.alamat || '',
        santriIds: [foundSantri.id],
        createdAt: now,
        updatedAt: now
      }),
      update(dbRef(db, `${clientName}/santri/${foundSantri.id}`), {
        wali_uid: user.uid,
        wali_email: authEmail,
        wali_nohp: cleanPhone,
        walisantri: displayName,
        updatedAt: now
      })
    ])

    downloadPasswordFile({
      username: authEmail,
      password,
      santriName: foundSantri.santriName,
      waliName: displayName,
      phone: cleanPhone
    })

    const dest = await storeSession(user, profile, registerForm.value.remember)
    window.location.replace(dest)
  } catch (e: unknown) {
    const err = e as { message?: string }

    openWrongModal(
      'Pendaftaran gagal',
      err?.message || 'Pendaftaran wali gagal. Silakan coba lagi atau hubungi admin.'
    )
  } finally {
    registerLoading.value = false
  }
}

onMounted(() => {
  const hasToken = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY)

  if (hasToken) {
    window.location.replace(routerRedirect)
  }
})
</script>