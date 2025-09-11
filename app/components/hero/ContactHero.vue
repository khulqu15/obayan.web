<template>
  <section ref="wrapEl" class="relative overflow-hidden dark:bg-neutral-900 bg-gray-100" id="contact">
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div ref="bg1" class="absolute top-10 -left-24 w-[42rem] h-[42rem] rounded-full opacity-40 blur-3xl
                           bg-gradient-to-br from-emerald-200 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-900/30
                           will-change-transform" />
      <div ref="bg2" class="absolute bottom-10 -right-24 w-[36rem] h-[36rem] rounded-full opacity-30 blur-3xl
                           bg-gradient-to-tr from-emerald-100 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-900/30
                           will-change-transform" />
      <div class="absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent_80%)]">
        <div class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,0,0,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,.06)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.06)_1px,transparent_1px)]" />
      </div>
    </div>

    <div class="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14">
      <div class="grid lg:grid-cols-12 gap-8 items-stretch">
        <div class="lg:col-span-6 space-y-7">
          <div class="space-y-3">
            <p class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              <span class="inline-block size-2 rounded-full bg-emerald-600" />
              Hubungi Kami
            </p>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
              Ada pertanyaan? <span class="text-emerald-600 dark:text-emerald-400">Mari terhubung</span>
            </h1>
          </div>

          <div class="grid sm:grid-cols-2 gap-3">
            <div class="group rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 backdrop-blur p-4 flex items-start gap-3 hover:shadow transition">
              <ClientOnly><Icon icon="ph:map-pin" class="size-6 text-emerald-600 dark:text-emerald-400 mt-0.5" /></ClientOnly>
              <div class="min-w-0">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Alamat</h3>
                <p class="text-xs text-gray-600 dark:text-neutral-300 line-clamp-3">
                  {{ address }}
                </p>
                <button @click="copy(address)" class="mt-2 text-[12px] text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1">
                  <ClientOnly><Icon icon="ph:copy" class="size-3.5" /></ClientOnly> Salin
                </button>
              </div>
            </div>

            <div class="group rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 backdrop-blur p-4 flex items-start gap-3 hover:shadow transition">
              <ClientOnly><Icon icon="ph:paper-plane-tilt" class="size-6 text-emerald-600 dark:text-emerald-400 mt-0.5" /></ClientOnly>
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
              <ClientOnly><Icon icon="ph:phone-call" class="size-6 text-emerald-600 dark:text-emerald-400 mt-0.5" /></ClientOnly>
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
              <ClientOnly><Icon icon="ph:clock" class="size-6 text-emerald-600 dark:text-emerald-400 mt-0.5" /></ClientOnly>
              <div class="min-w-0">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Jam Layanan</h3>
                <p class="text-xs text-gray-600 dark:text-neutral-300">Senin–Jumat 08.00–15.30 WIB</p>
                <p class="text-xs text-gray-600 dark:text-neutral-300">Sabtu 08.00–12.00 WIB</p>
              </div>
            </div>
          </div>

          <!-- form -->
          <form @submit.prevent="submit" class="rounded-2xl hidden border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-5 space-y-3">
            <div class="grid sm:grid-cols-2 gap-3">
              <label class="block">
                <span class="text-xs text-gray-600 dark:text-neutral-300">Nama</span>
                <input v-model="form.name" required type="text" class="mt-1 w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600" />
              </label>
              <label class="block">
                <span class="text-xs text-gray-600 dark:text-neutral-300">Email</span>
                <input v-model="form.email" required type="email" class="mt-1 w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600" />
              </label>
            </div>
            <label class="block">
              <span class="text-xs text-gray-600 dark:text-neutral-300">Subjek</span>
              <input v-model="form.subject" required type="text" class="mt-1 w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600" />
            </label>
            <label class="block">
              <span class="text-xs text-gray-600 dark:text-neutral-300">Pesan</span>
              <textarea v-model="form.message" required rows="4" class="mt-1 w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"></textarea>
            </label>

            <div class="flex items-center justify-between pt-2">
              <p class="text-[12px] text-gray-500 dark:text-neutral-400">Dengan mengirim pesan, Anda setuju dengan ketentuan & privasi.</p>
              <button :disabled="sending" class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-emerald-700 disabled:opacity-60">
                <ClientOnly><Icon :icon="sending ? 'ph:loader' : 'ph:paper-plane-tilt'" class="size-4 animate-spin" :class="sending ? 'inline' : 'hidden'" /></ClientOnly>
                <ClientOnly><Icon v-if="!sending" icon="ph:paper-plane-tilt" class="size-4" /></ClientOnly>
                <span>{{ sending ? 'Mengirim…' : 'Kirim Pesan' }}</span>
              </button>
            </div>

            <p v-if="feedback" class="text-[12px] mt-1" :class="ok ? 'text-emerald-600' : 'text-red-600'">
              {{ feedback }}
            </p>
          </form>
        </div>

        <div class="lg:col-span-6">
          <div ref="mapCard" class="relative h-[28rem] rounded-3xl overflow-hidden border border-gray-200 dark:border-neutral-700 bg-white/60 dark:bg-neutral-800/50 shadow-lg will-change-transform">
            <div class="absolute z-10 top-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/40 text-white backdrop-blur px-3 py-1.5 text-xs">
              <ClientOnly><Icon icon="ph:map-trifold" class="size-4" /></ClientOnly>
              Lokasi Kantor Obayan
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

            <!-- overlay gradient -->
            <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>

          <!-- quick actions -->
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
               class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-emerald-700">
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
import { Icon } from '@iconify/vue'

const address = 'Jl. Remaja RT 6 RW 6, Martopuro, Purwosari, Pasuruan'
const email = 'team.sencra@gmail.com'
const phone = '0895396004952'
const waIntl = '62895396004952'
const mapQuery = encodeURIComponent('Jl. Remaja RT 6 RW 6, Martopuro, Purwosari, Pasuruan')
const mapSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d988.2888441620331!2d112.74534226966536!3d-7.773343570734113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7d37a331c2ac9%3A0x4bf659be1fca851!2sSidescript%20Developer!5e0!3m2!1sen!2sid!4v1756724609264!5m2!1sen!2sid`
const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`

const form = ref({ name: '', email: '', subject: '', message: '' })
const sending = ref(false)
const feedback = ref('')
const ok = ref(false)
const submit = async () => {
  sending.value = true
  feedback.value = ''
  ok.value = false
  await new Promise(r => setTimeout(r, 900))
  sending.value = false
  ok.value = true
  feedback.value = 'Alhamdulillah, pesan Anda terkirim. Kami akan segera membalas.'
  form.value = { name: '', email: '', subject: '', message: '' }
}

function copy(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text)
    feedback.value = 'Tersalin ke papan klip.'
    ok.value = true
    setTimeout(() => (feedback.value = ''), 1500)
  }
}

const wrapEl = ref<HTMLElement | null>(null)
const bg1 = ref<HTMLElement | null>(null)
const bg2 = ref<HTMLElement | null>(null)
const mapCard = ref<HTMLElement | null>(null)

let raf = 0
let mx = 0, my = 0, sy = 0

function loop() {
  const dx = (mx - 0.5)
  const dy = (my - 0.5)

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
</script>
