<template>
  <section ref="wrapEl" class="relative overflow-hidden dark:bg-neutral-900 bg-gray-100" id="contact">
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div ref="bg1" class="absolute top-10 -left-24 w-2xl h-168 rounded-full opacity-40 blur-3xl
                           bg-linear-to-br from-green-200 to-green-200 dark:from-green-900/40 dark:to-green-900/30
                           will-change-transform" />
      <div ref="bg2" class="absolute bottom-10 -right-24 w-xl h-144 rounded-full opacity-30 blur-3xl
                           bg-linear-to-tr from-green-100 to-green-100 dark:from-green-900/30 dark:to-green-900/30
                           will-change-transform" />
      <div class="absolute inset-0 mask-[radial-linear(70%_60%_at_50%_40%,#000,transparent_80%)]">
        <div class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,0,0,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,.06)_1px,transparent_1px)] bg-size-[32px_32px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.06)_1px,transparent_1px)]" />
      </div>
    </div>

    <div class="relative max-w-340 mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14">
      <div class="grid lg:grid-cols-12 gap-8 items-stretch">
        <div class="lg:col-span-6 space-y-7">
          <div class="space-y-3">
            <p class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-green-700 dark:text-green-400">
              <span class="inline-block size-2 rounded-full bg-green-600" />
              Hubungi Kami
            </p>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
              Ada pertanyaan? <span class="text-green-600 dark:text-green-400">Mari terhubung</span>
            </h1>
            <p class="text-gray-600 dark:text-neutral-300 max-w-xl">
              Kami siap membantu menjawab pertanyaan Anda seputar informasi pendaftaran, kunjungan hingga kolaborasi program.
            </p>
          </div>

          <div class="grid sm:grid-cols-2 gap-3">
            <div class="group rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 backdrop-blur p-4 flex items-start gap-3 hover:shadow transition">
              <ClientOnly><Icon icon="ph:map-pin" class="size-6 text-green-600 dark:text-green-400 mt-0.5" /></ClientOnly>
              <div class="min-w-0">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Alamat</h3>
                <p class="text-xs text-gray-600 dark:text-neutral-300 line-clamp-3">
                  {{ address }}
                </p>
                <button @click="copy(address)" class="mt-2 text-[12px] text-green-600 hover:text-green-700 inline-flex items-center gap-1">
                  <ClientOnly><Icon icon="ph:copy" class="size-3.5" /></ClientOnly> Salin
                </button>
              </div>
            </div>

            <div class="group rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 backdrop-blur p-4 flex items-start gap-3 hover:shadow transition">
              <ClientOnly><Icon icon="ph:paper-plane-tilt" class="size-6 text-green-600 dark:text-green-400 mt-0.5" /></ClientOnly>
              <div class="min-w-0">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Email</h3>
                <p class="text-xs text-gray-600 dark:text-neutral-300 truncate">{{ email }}</p>
                <div class="mt-2 flex flex-wrap gap-2">
                  <a :href="`mailto:${email}`" class="text-[12px] inline-flex items-center gap-1 rounded-md px-2 py-1 border dark:text-gray-100 text-gray-800 border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700">
                    <ClientOnly><Icon icon="ph:envelope" class="size-3.5" /></ClientOnly> Kirim Email
                  </a>
                  <button @click="copy(email)" class="text-[12px] inline-flex items-center gap-1 rounded-md px-2 py-1 border dark:text-gray-100 text-gray-800 border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700">
                    <ClientOnly><Icon icon="ph:copy" class="size-3.5" /></ClientOnly> Salin
                  </button>
                </div>
              </div>
            </div>

            <div class="group rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 backdrop-blur p-4 flex items-start gap-3 hover:shadow transition">
              <ClientOnly><Icon icon="ph:phone-call" class="size-6 text-green-600 dark:text-green-400 mt-0.5" /></ClientOnly>
              <div class="min-w-0">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Telepon</h3>
                <p class="text-xs text-gray-600 dark:text-neutral-300">{{ phone }}</p>
                <div class="mt-2 flex flex-wrap gap-2">
                  <a :href="`https://wa.me/${waIntl}`" target="_blank" rel="noopener" class="text-[12px] inline-flex items-center gap-1 rounded-md px-2 py-1 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:text-gray-100 text-gray-800 dark:hover:bg-neutral-700">
                    <ClientOnly><Icon icon="ph:whatsapp-logo" class="size-3.5" /></ClientOnly> WhatsApp
                  </a>
                  <a :href="`tel:${phone}`" class="text-[12px] inline-flex items-center gap-1 rounded-md px-2 py-1 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:text-gray-100 text-gray-800 dark:hover:bg-neutral-700">
                    <ClientOnly><Icon icon="ph:phone" class="size-3.5" /></ClientOnly> Panggil
                  </a>
                </div>
              </div>
            </div>

            <div class="group rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 backdrop-blur p-4 flex items-start gap-3 hover:shadow transition">
              <ClientOnly><Icon icon="ph:clock" class="size-6 text-green-600 dark:text-green-400 mt-0.5" /></ClientOnly>
              <div class="min-w-0">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Jam Layanan</h3>
                <p v-for="(h, i) in hours" :key="i" class="text-xs text-gray-600 dark:text-neutral-300">
                  {{ h }}
                </p>
              </div>
            </div>
          </div>

          <!-- form (tetap hidden) -->
          <form @submit.prevent="submit" class="rounded-2xl hidden border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-5 space-y-3">
            <div class="grid sm:grid-cols-2 gap-3">
              <label class="block">
                <span class="text-xs text-gray-600 dark:text-neutral-300">Nama</span>
                <input v-model="form.name" required type="text" class="mt-1 w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-green-600" />
              </label>
              <label class="block">
                <span class="text-xs text-gray-600 dark:text-neutral-300">Email</span>
                <input v-model="form.email" required type="email" class="mt-1 w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-green-600" />
              </label>
            </div>
            <label class="block">
              <span class="text-xs text-gray-600 dark:text-neutral-300">Subjek</span>
              <input v-model="form.subject" required type="text" class="mt-1 w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-green-600" />
            </label>
            <label class="block">
              <span class="text-xs text-gray-600 dark:text-neutral-300">Pesan</span>
              <textarea v-model="form.message" required rows="4" class="mt-1 w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-green-600"></textarea>
            </label>

            <div class="flex items-center justify-between pt-2">
              <p class="text-[12px] text-gray-500 dark:text-neutral-400">Dengan mengirim pesan, Anda setuju dengan ketentuan & privasi.</p>
              <button :disabled="sending" class="inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-green-700 disabled:opacity-60">
                <ClientOnly><Icon :icon="sending ? 'ph:loader' : 'ph:paper-plane-tilt'" class="size-4 animate-spin" :class="sending ? 'inline' : 'hidden'" /></ClientOnly>
                <ClientOnly><Icon v-if="!sending" icon="ph:paper-plane-tilt" class="size-4" /></ClientOnly>
                <span>{{ sending ? 'Mengirim…' : 'Kirim Pesan' }}</span>
              </button>
            </div>

            <p v-if="feedback" class="text-[12px] mt-1" :class="ok ? 'text-green-600' : 'text-red-600'">
              {{ feedback }}
            </p>
          </form>
        </div>

        <!-- MAPS: disesuaikan dengan data app/contact.vue -->
        <div class="lg:col-span-6">
          <div ref="mapCard" class="relative h-112 rounded-3xl overflow-hidden border border-gray-200 dark:border-neutral-700 bg-white/60 dark:bg-neutral-800/50 shadow-lg will-change-transform">
            <div class="absolute z-10 top-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/40 text-white backdrop-blur px-3 py-1.5 text-xs">
              <ClientOnly><Icon icon="ph:map-trifold" class="size-4" /></ClientOnly>
              Peta Lokasi Pondok
            </div>

            <ClientOnly>
              <iframe
                v-if="safeMapSrc"
                class="absolute inset-0 w-full h-full"
                style="border:0;"
                loading="lazy"
                allowfullscreen
                referrerpolicy="no-referrer-when-downgrade"
                :src="safeMapSrc"
              />

              <div
                v-else
                class="absolute inset-0 grid place-items-center bg-white/80 p-6 text-center dark:bg-neutral-900/80"
              >
                <div>
                  <div class="mx-auto grid size-14 place-items-center rounded-2xl bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300">
                    <Icon icon="ph:map-pin" class="size-7" />
                  </div>
                  <p class="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
                    Peta belum tersedia
                  </p>
                  <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                    Silakan isi lokasi melalui admin kontak.
                  </p>
                </div>
              </div>
            </ClientOnly>

            <div class="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
          </div>

          <div class="mt-4 flex flex-wrap gap-3">
            <a :href="directionsHref" target="_blank" rel="noopener"
               class="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:text-gray-100 text-gray-800 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 px-4 py-2.5 text-sm font-medium hover:bg-white dark:hover:bg-neutral-800">
              <ClientOnly><Icon icon="ph:navigation-arrow" class="size-4" /></ClientOnly>
              Petunjuk Arah
            </a>
            <a :href="`mailto:${email}`"
               class="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:text-gray-100 text-gray-800 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 px-4 py-2.5 text-sm font-medium hover:bg-white dark:hover:bg-neutral-800">
              <ClientOnly><Icon icon="ph:envelope-simple" class="size-4" /></ClientOnly>
              Email Kami
            </a>
            <a :href="`https://wa.me/${waIntl}?text=${encodeURIComponent('Assalamu’alaikum, saya ingin bertanya tentang...')}`" target="_blank" rel="noopener"
               class="inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-green-700">
              <ClientOnly><Icon icon="ph:whatsapp-logo" class="size-4" /></ClientOnly>
              Chat WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useNuxtApp, useRuntimeConfig } from 'nuxt/app'
import { ref as dbRef, onValue, off } from 'firebase/database'
import { Icon } from '@iconify/vue'

type ContactData = {
  address?: string
  email?: string
  phone?: string
  waIntl?: string
  mapEmbedSrc?: string
  mapQuery?: string
  mapLat?: number | string | null
  mapLng?: number | string | null
  hours?: string[]
}

const config = useRuntimeConfig()
const clientName = String(config.public.clientName || 'alinayah')
const clientDisplayName = String(config.public.clientDisplayName || 'Al-Inayah')

const address = ref('Jl. Pesantren No. 1, Pandaan, Pasuruan, Jawa Timur 67156')
const email = ref(`info@${clientName}.sch.id`)
const phone = ref('085856376399')
const waIntl = ref('6285856376399')

const mapSrc = ref('')
const mapQuery = ref(`Pondok Pesantren ${clientDisplayName}, Pandaan, Pasuruan`)
const mapLat = ref<number | null>(null)
const mapLng = ref<number | null>(null)

const hours = ref<string[]>(['Senin–Jumat 08.00–15.30 WIB', 'Sabtu 08.00–12.00 WIB'])

const safeMapSrc = computed(() => {
  const embed = String(mapSrc.value || '').trim()

  if (/^https:\/\/www\.google\.com\/maps\/embed/i.test(embed)) {
    return embed
  }

  const lat = Number(mapLat.value)
  const lng = Number(mapLng.value)

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`
  }

  const query = String(mapQuery.value || address.value || '').trim()

  if (query) {
    return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`
  }

  return ''
})

const directionsHref = computed(() => {
  const lat = Number(mapLat.value)
  const lng = Number(mapLng.value)

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
  }

  const query = String(mapQuery.value || address.value || '').trim()
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`
})

let unbind: null | (() => void) = null

function toNumberOrNull(value: unknown) {
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

function applyContactData(c: ContactData) {
  address.value = String(c.address || address.value)
  email.value = String(c.email || email.value)
  phone.value = String(c.phone || phone.value)
  waIntl.value = String(c.waIntl || waIntl.value).replace(/\D/g, '')
  mapSrc.value = String(c.mapEmbedSrc || '')
  mapQuery.value = String(c.mapQuery || mapQuery.value)
  mapLat.value = toNumberOrNull(c.mapLat)
  mapLng.value = toNumberOrNull(c.mapLng)

  if (Array.isArray(c.hours) && c.hours.length) {
    hours.value = c.hours.map((item) => String(item || '').trim()).filter(Boolean)
  }
}

function bindContact() {
  const { $realtimeDb } = useNuxtApp() as any
  const r = dbRef($realtimeDb, `${clientName}/contact`)

  const h = onValue(r, (s) => {
    const data = s.val() || {}
    applyContactData(data.contact || {})
  })

  unbind = () => off(r, 'value', h as any)
}

onMounted(bindContact)

onBeforeUnmount(() => {
  unbind?.()
  unbind = null
})

/* efek UI */
const wrapEl = ref<HTMLElement | null>(null)
const bg1 = ref<HTMLElement | null>(null)
const bg2 = ref<HTMLElement | null>(null)
const mapCard = ref<HTMLElement | null>(null)

let raf = 0
let mx = 0
let my = 0
let sy = 0

function loop() {
  const dx = mx - 0.5
  const dy = my - 0.5

  if (bg1.value) bg1.value.style.transform = `translate3d(${dx * -20}px, ${dy * -20}px, 0) scale(1.06)`
  if (bg2.value) bg2.value.style.transform = `translate3d(${dx * 16}px, ${dy * 16}px, 0) scale(1.04)`

  if (mapCard.value) {
    const tiltX = dy * 3
    const tiltY = dx * -3
    mapCard.value.style.transform = `translateY(${sy * -0.06}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
  }

  raf = requestAnimationFrame(loop)
}

onMounted(() => {
  loop()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
})

/* form mini – dummy */
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const sending = ref(false)
const feedback = ref('')
const ok = ref(false)

const submit = async () => {
  sending.value = true
  feedback.value = ''
  ok.value = false

  await new Promise((r) => setTimeout(r, 900))

  sending.value = false
  ok.value = true
  feedback.value = 'Alhamdulillah, pesan Anda terkirim. Kami akan segera membalas.'
  form.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  }
}

function copy(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text)
    feedback.value = 'Tersalin ke papan klip.'
    ok.value = true

    setTimeout(() => {
      feedback.value = ''
    }, 1500)
  }
}
</script>
