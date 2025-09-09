<template>
  <main class="relative min-h-screen overflow-hidden flex items-center pt-32 pb-12 dark:bg-neutral-900 bg-gray-100">
    <!-- Gradients -->
    <div class="absolute w-full bg-gradient-to-b from-blue-700/50 to-blue-700/0 top-0 left-0 h-[20vh]"></div>
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div class="absolute -top-24 -left-24 w-[46rem] h-[46rem] rounded-full opacity-30 blur-3xl
                  bg-gradient-to-br from-blue-200 to-emerald-200 dark:from-emerald-900/40 dark:to-blue-900/30"></div>
      <div class="absolute -bottom-28 -right-24 w-[40rem] h-[40rem] rounded-full opacity-25 blur-3xl
                  bg-gradient-to-tr from-blue-100 to-emerald-100 dark:from-blue-900/30 dark:to-emerald-900/30"></div>
    </div>

    <div class="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14 w-full">
      <div class="grid lg:grid-cols-12 gap-8 items-center">
        <!-- Form -->
        <section class="lg:col-span-6">
          <div class="mx-auto max-w-lg">
            <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 backdrop-blur p-6 sm:p-7 shadow-xl">
              <div class="flex items-center gap-2">
                <ClientOnly><Icon icon="ph:users-three" class="size-5 text-blue-600 dark:text-blue-400" /></ClientOnly>
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Masuk Wali</h2>
              </div>

              <!-- Tabs metode -->
              <div class="mt-4 grid grid-cols-2 gap-2">
                <button v-for="m in methods" :key="m.value" @click="switchMethod(m.value)"
                        class="px-3 py-2 rounded-lg text-sm font-medium transition"
                        :class="method === m.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700'">
                  {{ m.label }}
                </button>
              </div>

              <form @submit.prevent="submit" class="mt-5 space-y-4">
                <!-- Email (opsional, tetap dipertahankan) -->
                <div v-if="method === 'email'" class="space-y-4">
                  <label class="block">
                    <span class="text-xs text-gray-600 dark:text-neutral-300">Email</span>
                    <input v-model.trim="form.email" type="email" required
                           class="mt-1 w-full rounded-lg border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-100 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600" />
                  </label>
                  <label class="block relative">
                    <span class="text-xs text-gray-600 dark:text-neutral-300">Kata Sandi</span>
                    <input :type="showPass ? 'text' : 'password'" v-model="form.password" required
                           class="mt-1 w-full rounded-lg border border-gray-200 text-gray-800 dark:text-neutral-100 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-3 py-2 pr-10 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600" />
                    <button type="button" @click="showPass = !showPass"
                            class="absolute right-2 bottom-2.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-800">
                      <ClientOnly>
                        <Icon :icon="showPass ? 'ph:eye-slash' : 'ph:eye'" class="size-4 text-gray-500" />
                      </ClientOnly>
                    </button>
                  </label>
                </div>

                <!-- WA/SMS (Firebase Phone Auth atau Dummy OTP) -->
                <div v-else class="space-y-4">
                  <label class="block">
                    <span class="text-xs text-gray-600 dark:text-neutral-300">No. HP (WhatsApp / SMS)</span>
                    <div class="mt-1 flex gap-2">
                      <span class="inline-flex items-center px-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-sm text-gray-700 dark:text-neutral-200">+62</span>
                      <input v-model.trim="form.phone" type="tel" inputmode="numeric" pattern="[0-9]*" :disabled="otpSent"
                             class="w-full rounded-lg border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-100 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600" placeholder="812xxxxxxx" />
                    </div>
                    <p class="mt-2 text-[12px] text-gray-500 dark:text-neutral-400">
                      * OTP akan dikirim via <b>SMS / Whatsapp</b>
                    </p>
                  </label>

                  <div v-if="otpSent">
                    <span class="text-xs text-gray-600 dark:text-neutral-300">Kode OTP</span>
                    <div class="mt-1 flex gap-2">
                      <input v-for="(d,i) in form.otp" :key="i" ref="otpInputs" maxlength="1" inputmode="numeric" pattern="[0-9]*"
                             class="w-10 h-11 text-center rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                             :value="d" @input="onOtpInput($event,i)" @keydown.backspace.prevent="onOtpBackspace(i)"/>
                    </div>
                    <p class="mt-2 hidden text-[12px] text-gray-500 dark:text-neutral-400">
                      <template v-if="useDummy">Mode demo aktif. Gunakan OTP <b>{{ DUMMY_OTP }}</b>.</template>
                      <template v-else>Kami mengirim kode via SMS. <button type="button" @click="sendOtp" class="underline hover:text-gray-700">Kirim ulang</button></template>
                    </p>
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <label class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-neutral-200">
                    <input type="checkbox" v-model="form.remember" class="rounded border-gray-300 dark:border-neutral-700">
                    Ingat saya
                  </label>
                  <a href="#" class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Lupa password?</a>
                </div>

                <div class="pt-2 flex-col items-center gap-2">
                  <button v-if="method==='wa' && !otpSent" type="button" @click="sendOtp"
                          class="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
                          :disabled="!form.phone || sending">
                    <ClientOnly><Icon :icon="sending?'ph:loader':'ph:paper-plane-tilt'" class="size-4" :class="sending ? 'animate-spin' : ''" /></ClientOnly>
                    Kirim Kode
                  </button>

                  <button v-else type="submit"
                          class="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
                          :disabled="sending || (method==='wa' && (!otpSent || !otpComplete))">
                    <ClientOnly><Icon :icon="sending?'ph:loader':'ph:sign-in'" class="size-4" :class="sending ? 'animate-spin' : ''" /></ClientOnly>
                    {{ (method==='wa' && otpSent) ? 'Verifikasi & Masuk' : 'Masuk' }}
                  </button>
                </div>
              </form>

              <div class="mt-6 flex flex-wrap items-center justify-between gap-2 text-[12px] text-gray-500 dark:text-neutral-400">
                <div></div>
                <div class="space-x-3">
                  <a href="#" class="hover:underline">Syarat</a>
                  <a href="#" class="hover:underline">Privasi</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Hero panel -->
        <aside class="lg:col-span-6">
          <div class="relative overflow-hidden rounded-[2rem] border border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 backdrop-blur shadow-lg h-full">
            <!-- BG image -->
            <div class="absolute inset-0">
              <div class="absolute inset-0 bg-center bg-cover" :style="{ backgroundImage: `url(${bg})` }"></div>
              <div class="absolute inset-0 bg-[rgba(var(--app-primary-rgb),0.8)] mix-blend-multiply" />
              <div class="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10" />
            </div>

            <!-- Content -->
            <div class="relative grid grid-cols-12 gap-6 items-center">
              <div class="col-span-12 md:col-span-7 px-8 sm:px-10 py-10 lg:py-14">
                <h1 class="mt-5 text-white text-3xl sm:text-4xl font-bold leading-tight">
                  Portal <span class="underline decoration-white/40">Wali Santri</span>
                </h1>
                <p class="mt-2 text-white/90 max-w-md">
                  Akses progress nilai, absensi, pembayaran dan pengumuman penting dalam satu portal yang lebih efisien dan fleksibel.
                </p>

                <ul class="mt-6 space-y-3 text-white/95">
                  <li class="flex items-start gap-3">
                    <ClientOnly><Icon icon="ph:check-circle" class="size-5 mt-0.5" /></ClientOnly>
                    <span>Monitoring <b>absensi harian</b> santri</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <ClientOnly><Icon icon="ph:check-circle" class="size-5 mt-0.5" /></ClientOnly>
                    <span>Informasi <b>data akademik</b> santri</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <ClientOnly><Icon icon="ph:check-circle" class="size-5 mt-0.5" /></ClientOnly>
                    <span>Informasi & <b>Riwayat pembayaran</b></span>
                  </li>
                </ul>

                <div class="mt-7 flex flex-wrap gap-3 w-full md:pb-0 pb-24">
                  <a href="#" class="inline-flex items-center gap-2 rounded-xl border border-white/30 text-white px-4 py-2.5 text-sm font-medium hover:bg-white/10">
                    <ClientOnly><Icon icon="ph:book-open-text" class="size-4" /></ClientOnly>
                    Panduan Wali
                  </a>
                  <a href="#" class="inline-flex items-center gap-2 rounded-xl bg-white text-blue-700 px-4 py-2.5 text-sm font-semibold hover:bg-white/90">
                    <ClientOnly><Icon icon="ph:headset" class="size-4" /></ClientOnly>
                    Bantuan Admin
                  </a>
                </div>
              </div>
              <img src="/assets/pattern.png" alt="Mosque Pattern" class="absolute bottom-0 w-full opacity-80 -right-[60%]">
            </div>
          </div>
        </aside>
      </div>
    </div>

    <div id="recaptcha-container" class="hidden"></div>

    <transition name="fade">
      <div v-if="toast.show" class="fixed top-4 right-4 z-[100] max-w-sm rounded-xl shadow-lg border
                                   bg-white/95 dark:bg-neutral-900/95 border-gray-200 dark:border-neutral-700 p-4">
        <div class="flex items-start gap-3">
          <div class="mt-0.5">
            <span v-if="toast.type==='success'">✅</span>
            <span v-else-if="toast.type==='error'">❌</span>
            <span v-else>ℹ️</span>
          </div>
          <div>
            <p class="font-medium text-gray-900 dark:text-white">{{ toast.title }}</p>
            <p class="text-sm text-gray-600 dark:text-neutral-300" v-html="toast.message"></p>
          </div>
        </div>
      </div>
    </transition>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter, useRoute, useRuntimeConfig, useSeoMeta, useHead } from '#imports'
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  type ConfirmationResult
} from 'firebase/auth'

import {
  getDatabase,
  ref as dref,
  get,
  query as dquery,
  orderByChild,
  equalTo
} from 'firebase/database'

const AUTH_KEY  = 'alberr:auth'
const PASSPHRASE = 'alberr-admin-secret'
const SALT       = 'alberr-static-salt'
const ITER       = 120_000
const IV_BYTES   = 12

const router = useRouter()
const bg = '/assets/images/masjid.jpg'

type Method = 'email' | 'wa'
const methods = [
  { value: 'wa',    label: 'No. HP (WA / SMS)' },
  { value: 'email', label: 'Email' },
] as const

const method = ref<Method>('wa')
const showPass = ref(false)
const sending = ref(false)
const otpSent = ref(false)
const useDummy = ref(false)
const DUMMY_OTP = '123456' as const

const form = reactive({
  email: '',
  password: '',
  phone: '',
  otp: Array<string>(6).fill(''),
  remember: true
})

const otpInputs = ref<HTMLInputElement[]>([])
const otpComplete = computed(() => form.otp.every(d => d && d.length === 1))

/* ---------- SEO ---------- */
const route = useRoute()
const config = useRuntimeConfig()
const url = computed(() => new URL(route.fullPath || '/waliLogin', config.public.siteUrl).toString())
const title = 'Login Wali | Ponpes Alberr'
const description = 'Masuk ke akun wali untuk memantau pendaftaran dan status santri di Ponpes Alberr.'
useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogUrl: url.value,
  ogImage: '/assets/logo.png',
  twitterCard: 'summary_large_image',
  themeColor: '#0ea5e9',
  robots: 'noindex, nofollow, noarchive'
})
useHead({ link: [{ rel: 'canonical', href: url.value }] })

/* ---------- Toast ---------- */
const toast = reactive<{show:boolean; type:'success'|'error'|'info'; title:string; message:string}>({
  show: false, type: 'info', title: '', message: ''
})
function showToast(type: 'success'|'error'|'info', title: string, message: string, ms=3500) {
  toast.show = true; toast.type = type; toast.title = title; toast.message = message
  setTimeout(() => (toast.show = false), ms)
}

function switchMethod(m: Method) {
  method.value = m
  showPass.value = false
  otpSent.value = false
  useDummy.value = false
  form.password = ''
  form.otp = Array(6).fill('')
}

async function deriveKey(pass: string, salt: string) {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(pass), { name: 'PBKDF2' }, false, ['deriveKey'])
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: enc.encode(salt), iterations: ITER, hash: 'SHA-256' },
    keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
}
function toB64(buf: ArrayBuffer) { return btoa(String.fromCharCode(...new Uint8Array(buf))) }

async function encryptJSON(data: any) {
  const key = await deriveKey(PASSPHRASE, SALT)
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES))
  const enc = new TextEncoder()
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(data)))
  return JSON.stringify({ v: 1, iv: toB64(iv), ct: toB64(cipher) })
}

const lastPhoneE164 = ref<string | null>(null)

function normalizeToE164ID(phone: string): string | null {
  let p = (phone || '').replace(/[^\d]/g, '')
  if (!p) return null
  if (p.startsWith('0')) p = '62' + p.slice(1)
  if (p.startsWith('62')) p = '+' + p
  if (!p.startsWith('+')) p = '+' + p
  return /^\+\d{10,15}$/.test(p) ? p : null
}

/* ---------- Firebase Recaptcha & PhoneAuth ---------- */
let recaptchaVerifier: RecaptchaVerifier | null = null
const confirmation = ref<ConfirmationResult | null>(null)

function ensureRecaptcha() {
  const auth = getAuth()
  if (!recaptchaVerifier) {
    // Invisible, render otomatis saat signInWithPhoneNumber dipanggil
    recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' })
  }
  return recaptchaVerifier
}

async function sendOtp() {
  if (method.value !== 'wa') return
  const phoneE164 = normalizeToE164ID(form.phone)
  if (!phoneE164) {
    showToast('error', 'Nomor tidak valid', 'Contoh: 812xxxxxxx atau 0812xxxxxxx')
    return
  }
  lastPhoneE164.value = phoneE164
  sending.value = true
  try {
    const auth = getAuth()
    const appVerifier = ensureRecaptcha()
    // Render jika perlu (untuk men-generate widget)
    // @ts-ignore - render() tersedia di runtime
    if (appVerifier && typeof appVerifier.render === 'function') await appVerifier.render()

    confirmation.value = await signInWithPhoneNumber(auth, phoneE164, appVerifier!)
    otpSent.value = true
    useDummy.value = false
    showToast('success', 'Kode dikirim', `Kami kirim OTP via SMS ke <b>${phoneE164}</b>.`)
    await nextTick()
    otpInputs.value[0]?.focus()
  } catch (err: any) {
    // Gagal SMS: fallback ke Dummy OTP
    otpSent.value = true
    useDummy.value = true
    showToast('info', 'Mode Demo Aktif', `SMS OTP belum siap. Gunakan kode <b>${DUMMY_OTP}</b> untuk melanjutkan.`)
    await nextTick()
    otpInputs.value[0]?.focus()
  } finally {
    sending.value = false
  }
}

function onOtpInput(e: Event, i: number) {
  const v = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0,1)
  form.otp[i] = v
  if (v && i < form.otp.length - 1) otpInputs.value[i+1]?.focus()
}
function onOtpBackspace(i: number) {
  if (!form.otp[i] && i > 0) otpInputs.value[i-1]?.focus()
  form.otp[i] = ''
}

onMounted(() => {
  const hasToken = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY)
  if (hasToken) {
    window.location.replace('/wali')
  }
})

async function submit() {
  sending.value = true
  try {
    if (method.value === 'email') {
      showToast('error', 'Belum tersedia', 'Silakan gunakan metode No. HP untuk saat ini.')
      return
    }

    if (!otpSent.value) {
      showToast('error', 'Belum ada OTP', 'Kirimkan kode OTP terlebih dahulu.')
      return
    }
    const code = form.otp.join('')
    if (code.length !== 6) {
      showToast('error', 'Kode belum lengkap', 'Masukkan 6 digit kode OTP.')
      return
    }
    if (!lastPhoneE164.value) {
      showToast('error', 'Nomor tidak dikenali', 'Silakan kirim ulang OTP.')
      return
    }
    if (useDummy.value) {
      if (code !== '123456') {
        showToast('error', 'Kode salah', 'Periksa kembali kode OTP Anda.')
        return
      }
    } else {
      if (!confirmation.value) {
        showToast('error', 'Sesi OTP tidak ditemukan', 'Kirim ulang kode OTP.')
        return
      }
      await confirmation.value.confirm(code)
    }
    const match = await findWaliByPhone(lastPhoneE164.value)
    if (!match) {
      try { await signOut(getAuth()) } catch {}
      showToast('error', 'Nomor tidak terdaftar',
        'Nomor WhatsApp/HP Anda belum terdaftar sebagai wali. Silakan hubungi admin untuk pendaftaran.')
      return
    }
    if (match.row?.isActive === false) {
      try { await signOut(getAuth()) } catch {}
      showToast('error', 'Akun non-aktif', 'Akun wali Anda non-aktif. Silakan hubungi admin.')
      return
    }
    const auth = getAuth()
    const now = Math.floor(Date.now() / 1000)
    const ttl = form.remember ? 30 * 24 * 3600 : 24 * 3600
    const DEFAULT_WALI_ROUTES = ['/wali','/wali/santri','/wali/pembayaran','/wali/pengumuman']

    const session = {
      sub: auth.currentUser?.uid || match.id || 'wali',
      uid: auth.currentUser?.uid || match.id || 'wali',
      phone: lastPhoneE164.value,
      email: match.row?.email || '-',
      name: match.row?.name || match.row?.displayName || 'Wali',
      role: 'wali',
      allowedRoutes: Array.isArray(match.row?.allowedRoutes) && match.row.allowedRoutes.length
        ? match.row.allowedRoutes
        : DEFAULT_WALI_ROUTES,
      iat: now,
      exp: now + ttl
    }
    const token = await encryptJSON(session)
    if (form.remember) {
      sessionStorage.removeItem(AUTH_KEY)
      localStorage.setItem(AUTH_KEY, token)
    } else {
      localStorage.removeItem(AUTH_KEY)
      sessionStorage.setItem(AUTH_KEY, token)
    }
    showToast('success', 'Berhasil Masuk', 'Mengalihkan ke dashboard wali...')
    window.location.href = '/wali'
  } catch (err: any) {
    const msg = String(err?.message || '')
    if (msg.includes('invalid-verification-code')) {
      showToast('error', 'Kode salah', 'Periksa kembali kode OTP Anda.')
    } else if (msg.includes('expired')) {
      showToast('error', 'Kode kadaluarsa', 'Silakan kirim ulang kode OTP.')
      otpSent.value = false
      form.otp = Array(6).fill('')
    } else {
      showToast('error', 'Gagal Masuk', 'Terjadi kesalahan saat verifikasi OTP.')
    }
  } finally {
    sending.value = false
  }
}

function normalizeCandidateToE164(x: any): string | null {
  const s = String(x ?? '').trim()
  return s ? normalizeToE164ID(s) : null
}

function toE164IDNLoose(v: any): string | null {
  let d = String(v ?? '').replace(/[^\d]/g, '')
  if (!d) return null

  // Perbaiki typo awalan umum: 6262..., 6208...
  if (d.startsWith('6262')) d = d.slice(2)       // 6262XXXXXXXX -> 62XXXXXXXX
  if (d.startsWith('620'))  d = '62' + d.slice(3) // 6208XXXXXXXX -> 62XXXXXXXX

  if (d.startsWith('0'))      d = '62' + d.slice(1) // 08xxxx -> 628xxxx
  else if (d.startsWith('8')) d = '62' + d          // 8xxxx  -> 628xxxx
  // kalau sudah 62... biarkan
  return '+' + d
}

// Dari +6289xxxx buat 3 varian: [+6289xxxx, 6289xxxx, 089xxxx]
function phoneVariantsFromE164(e164: string): string[] {
  const digits = e164.replace(/\D/g, '')      // 6289xxxx
  const local0 = digits.replace(/^62/, '0')   // 089xxxx
  return [e164, digits, local0]
}
// --- Cari wali by phone (kuat di berbagai format) ---
async function findWaliByPhone(phoneInput: string) {
  const db = getDatabase()
  const paths = ['alberr/wali', 'alberr/users'] // tambah jika perlu
  const keys  = ['phoneE164', 'phone', 'wa', 'nohp', 'whatsapp', 'hp']

  const e164 = toE164IDNLoose(phoneInput)
  if (!e164) return null
  const variants = phoneVariantsFromE164(e164) // +6289..., 6289..., 089...

  // 1) Query cepat dengan equalTo untuk SEMUA varian & key
  for (const path of paths) {
    for (const key of keys) {
      for (const value of variants) {
        try {
          const q = dquery(dref(db, path), orderByChild(key), equalTo(value))
          const snap = await get(q)
          if (snap.exists()) {
            const val = snap.val()
            for (const [id, row] of Object.entries<any>(val)) {
              return { path, id, row }
            }
          }
        } catch (_) { /* lanjut */ }
      }
    }
  }

  // 2) Fallback: fetch lalu scan SEMUA key per row (dinormalisasi)
  for (const path of paths) {
    try {
      const snap = await get(dref(db, path))
      if (!snap.exists()) continue
      const data = snap.val() || {}
      for (const [id, row] of Object.entries<any>(data)) {
        for (const key of keys) {
          const norm = toE164IDNLoose((row as any)[key])
          if (norm && norm === e164) {
            return { path, id, row }
          }
        }
      }
    } catch (_) {}
  }

  return null
}

</script>

<style scoped>
/* number input normalize (kalau nanti diubah ke type=number) */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }

/* simple fade for toast */
.fade-enter-active, .fade-leave-active { transition: opacity .2s }
.fade-enter-from, .fade-leave-to { opacity: 0 }
</style>
