<template>
  <main class="relative min-h-screen overflow-hidden flex items-center pt-28 pb-12 dark:bg-neutral-900 bg-gray-100">
    <!-- Gradients -->
    <div class="absolute w-full bg-gradient-to-b from-blue-700/40 to-blue-700/0 top-0 left-0 h-[22vh]"></div>
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
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Masuk Wali (Tanpa OTP)</h2>
              </div>

              <form @submit.prevent="submit" class="mt-5 space-y-4">
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Nama Santri</span>
                  <input v-model.trim="form.namaSantri" type="text" required
                         class="mt-1 w-full rounded-lg border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-100 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                         placeholder="contoh: Muhammad Rizky Alfarizi" />
                </label>

                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">No. HP Wali</span>
                  <div class="mt-1 flex gap-2">
                    <span class="inline-flex items-center px-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-sm text-gray-700 dark:text-neutral-200">+62</span>
                    <input v-model.trim="form.phone" type="tel" inputmode="numeric" pattern="[0-9]*"
                           class="w-full rounded-lg border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-100 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                           placeholder="812xxxxxxx" />
                  </div>
                  <p class="mt-2 text-[12px] text-gray-500 dark:text-neutral-400">
                    Masukkan nomor WhatsApp/HP yang terdaftar sebagai wali santri.
                  </p>
                </label>

                <div class="flex items-center justify-between">
                  <label class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-neutral-200">
                    <input type="checkbox" v-model="form.remember" class="rounded border-gray-300 dark:border-neutral-700">
                    Ingat saya (30 hari)
                  </label>
                  <button type="submit"
                          class="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
                          :disabled="loading">
                    <ClientOnly><Icon :icon="loading?'ph:loader':'ph:sign-in'" class="size-4" :class="loading ? 'animate-spin' : ''" /></ClientOnly>
                    Masuk
                  </button>
                </div>
              </form>

              <!-- Candidate chooser -->
              <div v-if="candidates.length" class="mt-6">
                <div class="text-xs mb-2 text-gray-600 dark:text-neutral-300">Pilih santri yang sesuai:</div>
                <ul class="space-y-2">
                  <li v-for="c in candidates" :key="c.id"
                      class="p-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/60 flex items-center justify-between">
                    <div class="min-w-0">
                      <p class="font-medium text-gray-900 dark:text-white truncate">{{ c.santri }} <span class="text-xs text-gray-500">({{ c.gen || '-' }})</span></p>
                      <p class="text-xs text-gray-600 dark:text-neutral-300 truncate">
                        Wali: {{ c.walisantri || '-' }} • HP: {{ c.nohp || '-' }} • Kelas: {{ c.kelasFormal || c.jenjang || '-' }}
                      </p>
                    </div>
                    <button class="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1.5"
                            @click="finalize(c)">
                      Pakai Ini
                    </button>
                  </li>
                </ul>
              </div>

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
            <div class="absolute inset-0">
              <div class="absolute inset-0 bg-center bg-cover" :style="{ backgroundImage: `url(${bg})` }"></div>
              <div class="absolute inset-0 bg-[rgba(14,165,233,0.78)] mix-blend-multiply" />
              <div class="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10" />
            </div>

            <div class="relative grid grid-cols-12 gap-6 items-center">
              <div class="col-span-12 md:col-span-7 px-8 sm:px-10 py-10 lg:py-14">
                <h1 class="mt-5 text-white text-3xl sm:text-4xl font-bold leading-tight">
                  Portal <span class="underline decoration-white/40">Wali Santri</span>
                </h1>
                <p class="mt-2 text-white/90 max-w-md">
                  Akses nilai, absensi, dan pembayaran dalam satu portal—tanpa ribet OTP.
                </p>

                <ul class="mt-6 space-y-3 text-white/95">
                  <li class="flex items-start gap-3">
                    <ClientOnly><Icon icon="ph:check-circle" class="size-5 mt-0.5" /></ClientOnly>
                    <span>Login pakai <b>Nama Santri</b> + <b>No. HP Wali</b></span>
                  </li>
                  <li class="flex items-start gap-3">
                    <ClientOnly><Icon icon="ph:check-circle" class="size-5 mt-0.5" /></ClientOnly>
                    <span>Data langsung ditarik dari <b>RTDB</b> sekolah</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <ClientOnly><Icon icon="ph:check-circle" class="size-5 mt-0.5" /></ClientOnly>
                    <span>Keamanan dasar: penyimpanan sesi di browser</span>
                  </li>
                </ul>
              </div>
              <img src="/assets/pattern.png" alt="Mosque Pattern" class="absolute bottom-0 w-full opacity-80 -right-[60%]">
            </div>
          </div>
        </aside>
      </div>
    </div>

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
import { ref, reactive, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute, useRuntimeConfig, useSeoMeta, useHead } from '#imports'
import { getDatabase, ref as dref, get } from 'firebase/database'

const AUTH_KEY  = 'alberr:auth'
const routerRedirect = '/wali'
const bg = '/assets/images/masjid.jpg'

const form = reactive({
  namaSantri: '',
  phone: '',
  remember: true
})

const loading = ref(false)
const candidates = ref<any[]>([])

/* ---------- SEO ---------- */
const route = useRoute()
const config = useRuntimeConfig()
const url = new URL(route.fullPath || '/waliLogin', config.public.siteUrl).toString()
const title = 'Login Wali | Ponpes Alberr'
const description = 'Masuk ke akun wali untuk memantau nilai, absensi, dan pembayaran santri.'
useSeoMeta({
  title, description,
  ogTitle: title, ogDescription: description, ogType: 'website',
  ogUrl: url, ogImage: '/assets/logo.png', twitterCard: 'summary_large_image',
  themeColor: '#0ea5e9', robots: 'noindex, nofollow, noarchive'
})
useHead({ link: [{ rel: 'canonical', href: url }] })

/* ---------- Toast ---------- */
const toast = reactive<{show:boolean; type:'success'|'error'|'info'; title:string; message:string}>({
  show: false, type: 'info', title: '', message: ''
})
function showToast(type: 'success'|'error'|'info', title: string, message: string, ms=3500) {
  toast.show = true; toast.type = type; toast.title = title; toast.message = message
  setTimeout(() => (toast.show = false), ms)
}

/* ---------- Helpers ---------- */
function normName(s: string){ return (s||'').toLowerCase().replace(/\s+/g,' ').trim() }
function normalizeDigits(s: string){ return (s||'').replace(/[^\d]/g,'') }
function toE164IDNLoose(v: any): string | null {
  let d = normalizeDigits(v)
  if (!d) return null
  if (d.startsWith('6262')) d = d.slice(2)       // 6262XXXXXXXX -> 62XXXXXXXX
  if (d.startsWith('620'))  d = '62' + d.slice(3)// 6208XXXXXXXX -> 62XXXXXXXX
  if (d.startsWith('0')) d = '62' + d.slice(1)
  else if (d.startsWith('8')) d = '62' + d
  return '+' + d
}
function phoneVariantsFromE164(e164: string): string[] {
  const digits = e164.replace(/\D/g, '')      // 6289xxxx
  const local0 = digits.replace(/^62/, '0')   // 089xxxx
  return [e164, digits, local0]
}

/* ---------- Submit ---------- */
async function submit() {
  if (!form.namaSantri || !form.phone) {
    showToast('error','Data belum lengkap','Isi Nama Santri dan No. HP Wali.')
    return
  }
  loading.value = true
  candidates.value = []
  try {
    const db = getDatabase()
    const snap = await get(dref(db, 'alberr/santri'))
    const data = snap.exists() ? (snap.val() || {}) : {}
    const targetName = normName(form.namaSantri)
    const e164 = toE164IDNLoose(form.phone)
    const variants = e164 ? phoneVariantsFromE164(e164) : []

    const found:any[] = []
    for (const [id, row] of Object.entries<any>(data)) {
      const nameOk = normName(row?.santri || row?.nama || '') === targetName
      const phoneRaw = String(row?.nohp || row?.whatsapp || row?.hp || '')
      const pE164 = toE164IDNLoose(phoneRaw)
      const phoneOk = e164 ? (pE164 ? phoneVariantsFromE164(pE164).some(v => variants.includes(v)) : false) : false
      if (nameOk && phoneOk) {
        found.push({ id, ...row })
      }
    }

    if (!found.length) {
      showToast('error','Tidak ditemukan','Nama santri atau nomor HP tidak cocok. Hubungi admin bila perlu.')
      return
    }
    if (found.length === 1) {
      await finalize(found[0])
      return
    }
    // show chooser
    candidates.value = found
    showToast('info','Ditemukan beberapa data','Silakan pilih santri yang sesuai.')
  } catch (e:any) {
    console.error(e)
    showToast('error','Gagal memproses','Terjadi kesalahan saat membaca data.')
  } finally {
    loading.value = false
  }
}

/* ---------- Finalize Session ---------- */
async function finalize(santri:any){
  try{
    const now = Math.floor(Date.now()/1000)
    const ttl = form.remember ? 30*24*3600 : 24*3600
    const session = {
      sub: santri.id, role: 'wali',
      santriId: santri.id,
      santriName: santri.santri || santri.nama || 'Santri',
      waliName: santri.walisantri || '',
      waliPhone: santri.nohp || '',
      kelasFormal: santri.kelasFormal || santri.jenjang || '',
      maskan: santri.maskan || '',
      kamar: santri.kamar || '',
      iat: now, exp: now + ttl,
      allowedRoutes: ['/wali','/wali/santri','/wali/pembayaran','/wali/pengumuman']
    }
    const token = JSON.stringify(session) // sederhana: plain JSON
    if (form.remember) {
      sessionStorage.removeItem(AUTH_KEY)
      localStorage.setItem(AUTH_KEY, token)
    } else {
      localStorage.removeItem(AUTH_KEY)
      sessionStorage.setItem(AUTH_KEY, token)
    }
    showToast('success','Berhasil Masuk','Mengalihkan ke dashboard wali…')
    window.location.href = routerRedirect
  } catch (e:any){
    console.error(e)
    showToast('error','Gagal menyimpan sesi','Coba ulang beberapa saat lagi.')
  }
}

onMounted(()=>{
  const hasToken = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY)
  if (hasToken) window.location.replace(routerRedirect)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s }
.fade-enter-from, .fade-leave-to { opacity: 0 }
</style>
