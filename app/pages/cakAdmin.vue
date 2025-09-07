<template>
  <div class="min-h-screen pt-32 pb-12 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 relative overflow-hidden">
    <div class="absolute w-full bg-gradient-to-b from-blue-700/50 to-blue-700/0 top-0 left-0 h-[20vh]"></div>
    <div class="absolute top-10 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl opacity-30 animate-pulse"></div>
    <div class="absolute bottom-10 right-10 w-72 h-72 bg-indigo-300 dark:bg-indigo-800 rounded-full blur-3xl opacity-20 animate-pulse"></div>

    <div class="relative z-10 w-full max-w-md">
      <div class="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-gray-200 dark:border-neutral-700 shadow-2xl rounded-2xl p-8">
        <div class="flex flex-col items-center gap-2 mb-6">
          <img src="/assets/logo.png" alt="Logo" class="w-16 h-16 rounded-xl shadow" />
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">Masuk untuk mengelola sistem</p>
        </div>

        <form @submit.prevent="login" class="space-y-5">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <div class="relative mt-1">
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="admin@example.com"
                class="w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
              <Icon icon="ph:envelope" class="absolute right-3 top-3.5 size-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <div class="relative mt-1">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                <Icon :icon="showPassword ? 'ph:eye-slash' : 'ph:eye'" class="size-5" />
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="form.remember" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span class="text-gray-600 dark:text-gray-400">Ingat saya</span>
            </label>
            <a href="#" class="text-blue-600 hover:text-blue-700">Lupa Password?</a>
          </div>

          <!-- Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-60 transition"
          >
            <Icon :icon="loading ? 'ph:spinner' : 'ph:sign-in'" class="size-5 animate-spin" v-if="loading" />
            <Icon v-else icon="ph:sign-in" class="size-5" />
            {{ loading ? 'Memproses...' : 'Masuk' }}
          </button>
        </form>
      </div>

      <!-- Footer -->
      <p class="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        © 2025 Pondok Pesantren Alberr. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getDatabase, ref as dref, get } from 'firebase/database'
import { ROLE_DEFAULT_ROUTES, type AppRole } from '~/composables/data/useUser'

const form = ref({ email: '', password: '', remember: false })
const showPassword = ref(false)
const loading = ref(false)
const AUTH_KEY = 'alberr:auth'

const PASSPHRASE = 'alberr-admin-secret'
const SALT       = 'alberr-static-salt'
const ITER       = 120_000
const IV_BYTES   = 12

async function deriveKey(pass: string, salt: string) {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(pass), { name: 'PBKDF2' }, false, ['deriveKey'])
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: enc.encode(salt), iterations: ITER, hash: 'SHA-256' },
    keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
}
function toB64(buf: ArrayBuffer) { return btoa(String.fromCharCode(...new Uint8Array(buf))) }

onMounted(() => {
  const hasToken = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY)
  if (hasToken) {
    window.location.replace('/app')
  }
})

async function encryptJSON(data: any) {
  const key = await deriveKey(PASSPHRASE, SALT)
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES))
  const enc = new TextEncoder()
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(data)))
  return JSON.stringify({ v: 1, iv: toB64(iv), ct: toB64(cipher) })
}

/* ---------- Helpers ACL ---------- */
const normalize = (p: string) => {
  try { const u = new URL(p, 'http://x'); return u.pathname.replace(/\/+$/,'') || '/' }
  catch { return (p || '/').replace(/\/+$/,'') || '/' }
}
function coerceRoutes(v: any): string[] {
  if (Array.isArray(v)) return v.map(String)
  if (v && typeof v === 'object') return Object.values(v).filter(x => typeof x === 'string').map(String)
  return []
}
function pickFirstAllowedPath(routes: string[]): string {
  const arr = routes.map(normalize).filter(Boolean)
  if (arr.includes('/app')) return '/app'
  const firstApp = arr.find(p => p.startsWith('/app'))
  return firstApp || '/app'
}

/* ---------- Login ---------- */
const login = async () => {
  loading.value = true
  try {
    const email = form.value.email.trim().toLowerCase()
    const pass  = form.value.password

    // 1) Firebase Auth
    const auth = getAuth()
    const cred = await signInWithEmailAndPassword(auth, email, pass)
    const user = cred.user

    // 2) Profil dari RTDB (/alberr/user/<uid> prefer, fallback /alberr/users/<uid>)
    const db = getDatabase()
    let snap = await get(dref(db, `alberr/user/${user.uid}`))
    if (!snap.exists()) snap = await get(dref(db, `alberr/users/${user.uid}`))

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

    // allowedRoutes bisa array atau object → normalisasi
    let allowedRoutes = coerceRoutes(profile.allowedRoutes)
    if (!allowedRoutes.length) {
      allowedRoutes = ROLE_DEFAULT_ROUTES[role] || ['/app']
    }

    // 3) Simpan sesi terenkripsi (untuk layout/app.vue)
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
