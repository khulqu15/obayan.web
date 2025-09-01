<template>
  <main class="relative min-h-screen overflow-hidden flex items-center pt-32 pb-12 dark:bg-neutral-900 bg-gray-100">
    <div class="absolute w-full bg-gradient-to-b from-blue-700/50 to-blue-700/0 top-0 left-0 h-[20vh]"></div>
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div class="absolute -top-24 -left-24 w-[46rem] h-[46rem] rounded-full opacity-30 blur-3xl
                  bg-gradient-to-br from-blue-200 to-emerald-200 dark:from-emerald-900/40 dark:to-blue-900/30"></div>
      <div class="absolute -bottom-28 -right-24 w-[40rem] h-[40rem] rounded-full opacity-25 blur-3xl
                  bg-gradient-to-tr from-blue-100 to-emerald-100 dark:from-blue-900/30 dark:to-emerald-900/30"></div>
    </div>

    <div class="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
      <div class="grid lg:grid-cols-12 gap-8 items-center">
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

                <div v-else-if="method === 'reg'" class="space-y-4">
                  <label class="block">
                    <span class="text-xs text-gray-600 dark:text-neutral-300">No. Pendaftaran / NIS</span>
                    <input v-model.trim="form.regno" type="text" required
                           class="mt-1 w-full rounded-lg border text-gray-800 dark:text-neutral-100 border-gray-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600" />
                  </label>
                  <label class="block relative">
                    <span class="text-xs text-gray-600 dark:text-neutral-300">Kata Sandi</span>
                    <input :type="showPass ? 'text' : 'password'" v-model="form.password" required
                           class="mt-1 w-full rounded-lg border text-gray-800 dark:text-neutral-100 border-gray-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-3 py-2 pr-10 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600" />
                    <button type="button" @click="showPass = !showPass"
                            class="absolute right-2 bottom-2.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-800">
                      <ClientOnly><Icon :icon="showPass ? 'ph:eye-slash' : 'ph:eye'" class="size-4 text-gray-500" /></ClientOnly>
                    </button>
                  </label>
                </div>

                <div v-else class="space-y-4">
                  <label class="block">
                    <span class="text-xs text-gray-600 dark:text-neutral-300">No. HP (WhatsApp)</span>
                    <div class="mt-1 flex gap-2">
                      <span class="inline-flex items-center px-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-sm text-gray-700 dark:text-neutral-200">+62</span>
                      <input v-model.trim="form.phone" type="tel" inputmode="numeric" pattern="[0-9]*" :disabled="otpSent"
                             class="w-full rounded-lg border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-100 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600" placeholder="812xxxxxxx" />
                    </div>
                  </label>

                  <div v-if="otpSent">
                    <span class="text-xs text-gray-600 dark:text-neutral-300">Kode OTP</span>
                    <div class="mt-1 flex gap-2">
                      <input v-for="(d,i) in form.otp" :key="i" ref="otpInputs" maxlength="1" inputmode="numeric" pattern="[0-9]*"
                             class="w-10 h-11 text-center rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                             :value="d" @input="onOtpInput($event,i)" @keydown.backspace.prevent="onOtpBackspace(i)"/>
                    </div>
                    <p class="mt-2 text-[12px] text-gray-500 dark:text-neutral-400">Kami mengirim kode ke WhatsApp Anda. <button type="button" @click="sendOtp" class="underline hover:text-gray-700">Kirim ulang</button></p>
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <label class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-neutral-200">
                    <input type="checkbox" v-model="form.remember" class="rounded border-gray-300 dark:border-neutral-700">
                    Ingat saya
                  </label>
                  <a href="#" class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Lupa password?</a>
                </div>

                <div class="pt-2 flex items-center gap-2">
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

                  <p v-if="feedback" class="text-[12px]" :class="ok ? 'text-blue-600' : 'text-red-600'">
                    {{ feedback }}
                  </p>
                </div>
              </form>

              <div class="mt-6 flex flex-wrap items-center justify-between gap-2 text-[12px] text-gray-500 dark:text-neutral-400">
                <p>Belum punya akses? <a href="#" @click="isActication = true" class="text-blue-600 hover:text-blue-700 dark:text-blue-400">Aktivasi Wali</a></p>
                <div class="space-x-3">
                  <a href="#" class="hover:underline">Syarat</a>
                  <a href="#" class="hover:underline">Privasi</a>
                </div>
              </div>
            </div>
          </div>
        </section>
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
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'
import { Icon } from '@iconify/vue'

const bg = '/assets/images/masjid.jpg'

type Method = 'email' | 'wa'
const methods = [
  { value: 'email', label: 'Email' },
  { value: 'wa',    label: 'No. HP (WA)' },
] as const

const method = ref<Method>('wa')
const showPass = ref(false)
const sending = ref(false)
const feedback = ref('')
const ok = ref(false)
const otpSent = ref(false)

const form = reactive({
  email: '',
  password: '',
  regno: '',
  phone: '',
  otp: Array<string>(6).fill(''),
  remember: true
})

const route = useRoute()
const config = useRuntimeConfig()
const url = computed(() => new URL(route.fullPath || '/login', config.public.siteUrl).toString())

const title = 'Login Wali | Ponpes Alberr'
const description = 'Masuk ke akun wali untuk memantau pendaftaran dan status santri di Ponpes Alberr.'
const isActication = ref(false)
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

useHead({
  link: [{ rel: 'canonical', href: url.value }]
})

const otpInputs = ref<HTMLInputElement[]>([])
const otpComplete = computed(() => form.otp.every(d => d && d.length === 1))

function switchMethod(m: Method) {
  method.value = m
  showPass.value = false
  feedback.value = ''
  ok.value = false
  otpSent.value = false
  form.password = ''
  form.otp = Array(6).fill('')
}

async function sendOtp() {
  if (!form.phone) return
  sending.value = true
  feedback.value = ''
  ok.value = false
  await new Promise(r => setTimeout(r, 900)) // TODO: panggil API kirim OTP
  sending.value = false
  otpSent.value = true
  ok.value = true
  feedback.value = 'Kode OTP dikirim ke WhatsApp Anda.'
  await nextTick()
  otpInputs.value[0]?.focus()
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

async function submit() {
  sending.value = true
  feedback.value = ''
  ok.value = false
  await new Promise(r => setTimeout(r, 1000))
  sending.value = false
  ok.value = true
  feedback.value = 'Berhasil masuk. Mengarahkan ke dashboard…'
}
</script>

<style scoped>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }
</style>
