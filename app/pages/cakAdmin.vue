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
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const form = ref({ email: '', password: '', remember: false })
const showPassword = ref(false)
const loading = ref(false)
const AUTH_KEY = 'alberr:auth'

const PASSPHRASE = 'alberr-admin-secret'       // NOTE: untuk demo. taruh di env kalau serius
const SALT       = 'alberr-static-salt'        // NOTE: untuk demo
const ITER       = 120_000                     // PBKDF2 iterations
const IV_BYTES   = 12

async function deriveKey(pass: string, salt: string) {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(pass), { name: 'PBKDF2' }, false, ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: ITER, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

function toB64(buf: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}
function fromB64(b64: string) {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer
}

async function encryptJSON(data: any) {
  const key = await deriveKey(PASSPHRASE, SALT)
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES))
  const enc = new TextEncoder()
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(data)))
  return JSON.stringify({ v: 1, iv: toB64(iv), ct: toB64(cipher) })
}

async function decryptJSON(serialized: string) {
  const obj = JSON.parse(serialized)
  const key = await deriveKey(PASSPHRASE, SALT)
  const iv = new Uint8Array(fromB64(obj.iv))
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, fromB64(obj.ct))
  return JSON.parse(new TextDecoder().decode(plain))
}

const login = async () => {
  loading.value = true
  try {
    const email = form.value.email.trim().toLowerCase()
    const pass  = form.value.password
    await new Promise(r => setTimeout(r, 600))
    if (email !== 'admin@alberr.sch.id' || pass !== '12345678') {
      alert('Email atau password salah.')
      return
    }
    const now = Math.floor(Date.now() / 1000)
    const ttl = form.value.remember ? 30 * 24 * 3600 : 24 * 3600
    const session = {
      sub: 'admin',
      email,
      role: 'admin',
      iat: now,
      exp: now + ttl
    }
    const token = await encryptJSON(session)
    localStorage.setItem(AUTH_KEY, token)
    window.location.href = '/app'
  } catch (e) {
    console.error(e)
    alert('Terjadi kesalahan saat login.')
  } finally {
    loading.value = false
  }
}

</script>