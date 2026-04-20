<!-- cakAdmin.vue -->
<template>
  <div
    class="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950"
  >


    <div class="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:grid lg:grid-cols-2 lg:gap-10 lg:px-8">
      <!-- Left side / branding -->
      <section class="mb-10 hidden lg:block">
        <div class="max-w-xl">
          <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-4 py-2 text-sm font-semibold text-green-700 shadow-sm backdrop-blur dark:border-green-900/40 dark:bg-neutral-900/70 dark:text-green-300">
            <span class="inline-block h-2.5 w-2.5 rounded-full bg-green-500"></span>
            Smart Admin Portal
          </div>

          <h1 class="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white xl:text-5xl">
            Kelola sistem dengan
            <span class="text-green-600 dark:text-green-400">lebih cepat</span>,
            rapi, dan nyaman.
          </h1>

          <p class="mt-5 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300 xl:text-lg">
            Masuk ke dashboard admin dengan tampilan yang modern, bersih, dan ramah digunakan di desktop maupun mobile.
          </p>

        </div>
      </section>

      <!-- Right side / login card -->
      <section class="w-full">
        <div class="mx-auto w-full max-w-md">
          <!-- Mobile mini branding -->
          <div class="mb-5 text-center lg:hidden">
            <div class="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-lg ring-1 ring-green-100 dark:bg-neutral-900 dark:ring-neutral-800">
              <img src="/assets/logo.png" alt="Logo" class="h-10 w-10 object-contain" />
            </div>
            <h1 class="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Admin Login
            </h1>
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Masuk untuk mengelola sistem
            </p>
          </div>

          <div
            class="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-[0_20px_80px_-20px_rgba(16,185,129,0.35)] backdrop-blur-xl sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/85 dark:shadow-none"
          >
            <!-- top accent -->
            <div class="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-green-400 via-green-500 to-lime-400"></div>

            <div class="hidden lg:block">
              <div class="mb-6 flex items-center gap-4">
                <div class="flex h-16 w-16 items-center justify-center rounded-3xl bg-green-500 text-white shadow-lg shadow-green-500/30">
                  <img src="/assets/logo.png" alt="Logo" class="h-10 w-10 object-contain" />
                </div>
                <div>
                  <h2 class="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Welcome back
                  </h2>
                  <p class="text-sm text-slate-600 dark:text-slate-400">
                    Login untuk melanjutkan ke dashboard admin
                  </p>
                </div>
              </div>
            </div>

            <form @submit.prevent="login" class="space-y-5">
              <!-- Email -->
              <div>
                <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <div class="relative">
                  <span
                    class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500"
                  >
                    <Icon icon="ph:envelope-simple-duotone" class="h-5 w-5" />
                  </span>
                  <input
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="admin@example.com"
                    class="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3.5 pl-12 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-green-500 dark:focus:bg-neutral-800 dark:focus:ring-green-500/10"
                  />
                </div>
              </div>

              <!-- Password -->
              <div>
                <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div class="relative">
                  <span
                    class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500"
                  >
                    <Icon icon="ph:lock-key-duotone" class="h-5 w-5" />
                  </span>
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    placeholder="Masukkan password"
                    class="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3.5 pl-12 pr-12 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-green-500 dark:focus:bg-neutral-800 dark:focus:ring-green-500/10"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition hover:text-green-600 dark:text-neutral-500 dark:hover:text-green-400"
                    :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
                  >
                    <Icon :icon="showPassword ? 'ph:eye-slash-duotone' : 'ph:eye-duotone'" class="h-5 w-5" />
                  </button>
                </div>
              </div>

              <!-- Options -->
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label class="inline-flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    v-model="form.remember"
                    class="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500 dark:border-neutral-600 dark:bg-neutral-800"
                  />
                  <span class="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Ingat saya
                  </span>
                </label>

                <a
                  href="#"
                  class="text-sm font-semibold text-green-600 transition hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                >
                  Lupa Password?
                </a>
              </div>

              <!-- Submit -->
              <button
                type="submit"
                :disabled="loading"
                class="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-500/30 transition hover:-translate-y-0.5 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:cursor-not-allowed disabled:opacity-70 dark:focus:ring-green-500/20"
              >
                <Icon
                  v-if="loading"
                  icon="ph:spinner-gap-duotone"
                  class="h-5 w-5 animate-spin text-white"
                />
                <Icon
                  v-else
                  icon="ph:sign-in-duotone"
                  class="h-5 w-5 text-white transition group-hover:translate-x-0.5"
                />
                {{ loading ? 'Memproses...' : 'Masuk ke Dashboard' }}
              </button>

              <!-- Bottom helper -->
              <div class="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-800 dark:bg-green-500/10 dark:text-green-300">
                Pastikan email dan password admin sudah benar sebelum masuk ke sistem.
              </div>
            </form>
          </div>

          <p class="mt-6 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
            © 2025 Obayan Sencra. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getDatabase, ref as dref, get } from 'firebase/database'
import { ROLE_DEFAULT_ROUTES, type AppRole } from '~/composables/data/useUser'

const form = ref({
  email: '',
  password: '',
  remember: false
})

const showPassword = ref(false)
const loading = ref(false)

const AUTH_KEY = 'alinayah:auth'
const PASSPHRASE = 'alinayah-admin-secret'
const SALT = 'alinayah-static-salt'
const ITER = 120_000
const IV_BYTES = 12

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

onMounted(() => {
  const hasToken = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY)
  if (hasToken) {
    window.location.replace('/app')
  }
})

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

/* Helpers ACL */
const normalize = (p: string) => {
  try {
    const u = new URL(p, 'http://x')
    return u.pathname.replace(/\/+$/, '') || '/'
  } catch {
    return (p || '/').replace(/\/+$/, '') || '/'
  }
}

function coerceRoutes(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String)
  if (v && typeof v === 'object') {
    return Object.values(v).filter((x) => typeof x === 'string').map(String)
  }
  return []
}

function pickFirstAllowedPath(routes: string[]): string {
  const arr = routes.map(normalize).filter(Boolean)
  if (arr.includes('/app')) return '/app'
  const firstApp = arr.find((p) => p.startsWith('/app'))
  return firstApp || '/app'
}

/* Login */
const login = async () => {
  loading.value = true

  try {
    const email = form.value.email.trim().toLowerCase()
    const pass = form.value.password

    const auth = getAuth()
    const cred = await signInWithEmailAndPassword(auth, email, pass)
    const user = cred.user

    const db = getDatabase()

    let snap = await get(dref(db, `alinayah/user/${user.uid}`))
    if (!snap.exists()) {
      snap = await get(dref(db, `alinayah/users/${user.uid}`))
    }

    if (!snap.exists()) {
      alert('Profil belum dibuat. Hubungi admin.')
      return
    }

    const profile = snap.val() || {}

    if (profile.isActive === false) {
      alert('Akun Anda non-aktif. Hubungi admin.')
      return
    }

    const role: AppRole = (profile.role || 'wali') as AppRole

    let allowedRoutes = coerceRoutes(profile.allowedRoutes)
    if (!allowedRoutes.length) {
      allowedRoutes = ROLE_DEFAULT_ROUTES[role] || ['/app']
    }

    const now = Math.floor(Date.now() / 1000)
    const ttl = form.value.remember ? 30 * 24 * 3600 : 24 * 3600

    const session = {
      sub: user.uid,
      uid: user.uid,
      email: profile.email || user.email || email,
      name: profile.displayName || user.displayName || '(tanpa nama)',
      role,
      allowedRoutes,
      iat: now,
      exp: now + ttl
    }

    const token = await encryptJSON(session)

    if (form.value.remember) {
      sessionStorage.removeItem(AUTH_KEY)
      localStorage.setItem(AUTH_KEY, token)
    } else {
      localStorage.removeItem(AUTH_KEY)
      sessionStorage.setItem(AUTH_KEY, token)
    }

    const dest = pickFirstAllowedPath(allowedRoutes)
    window.location.replace(dest)
  } catch (e: any) {
    console.error(e)
    alert(e?.message || 'Email atau password salah.')
  } finally {
    loading.value = false
  }
}
</script>