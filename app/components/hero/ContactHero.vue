<template>
  <section ref="wrapEl" class="relative overflow-hidden dark:bg-neutral-900 bg-gray-100" id="contact">
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div ref="bg1" class="absolute top-10 -left-24 w-[42rem] h-[42rem] rounded-full opacity-40 blur-3xl
                           bg-gradient-to-br from-blue-200 to-blue-200 dark:from-blue-900/40 dark:to-blue-900/30
                           will-change-transform" />
      <div ref="bg2" class="absolute bottom-10 -right-24 w-[36rem] h-[36rem] rounded-full opacity-30 blur-3xl
                           bg-gradient-to-tr from-blue-100 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/30
                           will-change-transform" />
      <div class="absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent_80%)]">
        <div class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,0,0,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,.06)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.06)_1px,transparent_1px)]" />
      </div>
    </div>

    <div class="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14">
      <div class="grid lg:grid-cols-12 gap-8 items-stretch">
        <div class="lg:col-span-6 space-y-7">
          <div class="space-y-3">
            <p class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">
              <span class="inline-block size-2 rounded-full bg-blue-600" />
              Hubungi Kami
            </p>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
              Ada pertanyaan? <span class="text-blue-600 dark:text-blue-400">Mari terhubung</span>
            </h1>
            <p class="text-gray-600 dark:text-neutral-300 max-w-xl">
              Kami siap membantu menjawab pertanyaan Anda seputar informasi pendaftaran, kunjungan hingga kolaborasi program.
            </p>
          </div>

          <div class="grid sm:grid-cols-2 gap-3">
            <div class="group rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 backdrop-blur p-4 flex items-start gap-3 hover:shadow transition">
              <ClientOnly><Icon icon="ph:map-pin" class="size-6 text-blue-600 dark:text-blue-400 mt-0.5" /></ClientOnly>
              <div class="min-w-0">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Alamat</h3>
                <p class="text-xs text-gray-600 dark:text-neutral-300 line-clamp-3">
                  Kantor Pondok Pesantren AlBerr
                </p>
                <button @click="copy(address)" class="mt-2 text-[12px] text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
                  <ClientOnly><Icon icon="ph:copy" class="size-3.5" /></ClientOnly> Salin
                </button>
              </div>
            </div>

            <div class="group rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 backdrop-blur p-4 flex items-start gap-3 hover:shadow transition">
              <ClientOnly><Icon icon="ph:paper-plane-tilt" class="size-6 text-blue-600 dark:text-blue-400 mt-0.5" /></ClientOnly>
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
              <ClientOnly><Icon icon="ph:phone-call" class="size-6 text-blue-600 dark:text-blue-400 mt-0.5" /></ClientOnly>
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
              <ClientOnly><Icon icon="ph:clock" class="size-6 text-blue-600 dark:text-blue-400 mt-0.5" /></ClientOnly>
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
                <input v-model="form.name" required type="text" class="mt-1 w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600" />
              </label>
              <label class="block">
                <span class="text-xs text-gray-600 dark:text-neutral-300">Email</span>
                <input v-model="form.email" required type="email" class="mt-1 w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600" />
              </label>
            </div>
            <label class="block">
              <span class="text-xs text-gray-600 dark:text-neutral-300">Subjek</span>
              <input v-model="form.subject" required type="text" class="mt-1 w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600" />
            </label>
            <label class="block">
              <span class="text-xs text-gray-600 dark:text-neutral-300">Pesan</span>
              <textarea v-model="form.message" required rows="4" class="mt-1 w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"></textarea>
            </label>

            <div class="flex items-center justify-between pt-2">
              <p class="text-[12px] text-gray-500 dark:text-neutral-400">Dengan mengirim pesan, Anda setuju dengan ketentuan & privasi.</p>
              <button :disabled="sending" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
                <ClientOnly><Icon :icon="sending ? 'ph:loader' : 'ph:paper-plane-tilt'" class="size-4 animate-spin" :class="sending ? 'inline' : 'hidden'" /></ClientOnly>
                <ClientOnly><Icon v-if="!sending" icon="ph:paper-plane-tilt" class="size-4" /></ClientOnly>
                <span>{{ sending ? 'Mengirim…' : 'Kirim Pesan' }}</span>
              </button>
            </div>

            <p v-if="feedback" class="text-[12px] mt-1" :class="ok ? 'text-blue-600' : 'text-red-600'">
              {{ feedback }}
            </p>
          </form>
        </div>

        <div class="lg:col-span-6">
          <div ref="mapCard" class="relative h-[28rem] rounded-3xl overflow-hidden border border-gray-200 dark:border-neutral-700 bg-white/60 dark:bg-neutral-800/50 shadow-lg will-change-transform">
            <div class="absolute z-10 top-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/40 text-white backdrop-blur px-3 py-1.5 text-xs">
              <ClientOnly><Icon icon="ph:map-trifold" class="size-4" /></ClientOnly>
              Peta Lokasi Pondok
            </div>

            <ClientOnly>
              <iframe
                class="absolute inset-0 w-full h-full"
                style="border:0;"
                loading="lazy"
                allowfullscreen
                referrerpolicy="no-referrer-when-downgrade"
                :src="mapSrc"
              />
            </ClientOnly>

            <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
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
               class="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700">
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useNuxtApp } from '#app'
import { ref as dbRef, onValue, off } from 'firebase/database'
import { Icon } from '@iconify/vue'

const address = ref('Jl. Pesantren No. 1, Pandaan, Pasuruan, Jawa Timur 67156')
const email = ref('info@alberr.sch.id')
const phone = ref('085856376399')
const waIntl = ref('6285856376399')
const mapSrc = ref('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.154822990777!2d112.68858257934568!3d-7.666498699999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7d9e72d847345%3A0xb58b63681aec9b37!2sPondok%20Pesantren%20ALBERR%20(Putra)%20-%20Karangjati%20Pandaan!5e0!3m2!1sid!2sid!4v1755450928977!5m2!1sid!2sid')
const mapQuery = ref('Pondok Pesantren Alberr, Pandaan, Pasuruan')
const hours = ref<string[]>(['Senin–Jumat 08.00–15.30 WIB', 'Sabtu 08.00–12.00 WIB'])
const directionsHref = ref(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery.value)}`)

let unbind: null | (() => void) = null
function bindContact() {
  const { $realtimeDb } = useNuxtApp() as any
  const r = dbRef($realtimeDb, 'alberr/contact')
  const h = onValue(r, (s) => {
    const data = s.val() || {}
    const c = data.contact || {}
    address.value = c.address || address.value
    email.value   = c.email   || email.value
    phone.value   = c.phone   || phone.value
    waIntl.value  = c.waIntl  || waIntl.value
    mapSrc.value  = c.mapEmbedSrc || mapSrc.value
    mapQuery.value = c.mapQuery || mapQuery.value
    hours.value   = Array.isArray(c.hours) && c.hours.length ? c.hours : hours.value
    directionsHref.value = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery.value)}`
  })
  unbind = () => off(r, 'value', h as any)
}
onMounted(bindContact)
onBeforeUnmount(()=>{ unbind?.(); unbind = null })

/* efek UI */
const wrapEl = ref<HTMLElement | null>(null)
const bg1 = ref<HTMLElement | null>(null)
const bg2 = ref<HTMLElement | null>(null)
const mapCard = ref<HTMLElement | null>(null)

let raf = 0, mx = 0, my = 0, sy = 0
function loop() {
  const dx = (mx - 0.5), dy = (my - 0.5)
  if (bg1.value) bg1.value.style.transform = `translate3d(${dx * -20}px, ${dy * -20}px, 0) scale(1.06)`
  if (bg2.value) bg2.value.style.transform = `translate3d(${dx * 16}px, ${dy * 16}px, 0) scale(1.04)`
  if (mapCard.value) {
    const tiltX = dy * 3, tiltY = dx * -3
    mapCard.value.style.transform = `translateY(${sy * -0.06}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
  }
  raf = requestAnimationFrame(loop)
}
onMounted(()=>{ loop() })
onBeforeUnmount(()=> cancelAnimationFrame(raf))

/* form mini – dummy */
const form = ref({ name: '', email: '', subject: '', message: '' })
const sending = ref(false)
const feedback = ref('')
const ok = ref(false)
const submit = async () => {
  sending.value = true; feedback.value=''; ok.value=false
  await new Promise(r=>setTimeout(r,900))
  sending.value = false; ok.value=true
  feedback.value = 'Alhamdulillah, pesan Anda terkirim. Kami akan segera membalas.'
  form.value = { name:'', email:'', subject:'', message:'' }
}
function copy(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text)
    feedback.value = 'Tersalin ke papan klip.'; ok.value = true
    setTimeout(()=>feedback.value='', 1500)
  }
}
</script>
