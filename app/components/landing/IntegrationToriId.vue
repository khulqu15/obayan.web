<template>
  <section id="integrations" class="py-24 relative overflow-hidden">
    <!-- background gradient + dots -->
    <div class="absolute inset-0 -z-10">
      <div class="h-full w-full bg-gradient-to-b from-emerald-50/70 via-white to-white dark:from-emerald-900/10 dark:via-neutral-900 dark:to-neutral-950" />
      <div class="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(16,185,129,0.08)_1px,transparent_1px)] [background-size:18px_18px]" />
    </div>

    <div class="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-12 lg:grid-cols-12">
        <!-- LEFT: copy -->
        <div class="lg:col-span-6">
          <h2 class="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">
              ToriID: Absensi Super Cepat, Branding Super Nempel
            </span>
          </h2>

          <p class="mt-4 text-gray-700 dark:text-neutral-300 text-base leading-relaxed">
            Tampilkan <span class="font-semibold">logo lembaga di layar</span> dan <span class="font-semibold">branding pada casing</span>.
            Konektivitas fleksibel (Wi-Fi, LAN, USB). Hasil scan tampil <span class="font-semibold">real-time anti lelet</span> dan
            tersinkron mulus ke Obayan.
          </p>

          <!-- features -->
          <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="f in features" :key="f.title" class="flex gap-3">
              <Icon :icon="f.icon" class="mt-0.5 size-5 text-emerald-600" aria-hidden="true" />
              <div>
                <p class="font-semibold">{{ f.title }}</p>
                <p class="text-sm text-gray-600 dark:text-neutral-400">{{ f.desc }}</p>
              </div>
            </div>
          </div>

          <!-- badges connectivity + audit -->
          <div class="mt-6 flex flex-wrap gap-2">
            <span v-for="b in badges" :key="b.text"
              class="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 px-3 py-1.5 text-[11px] font-medium">
              <Icon :icon="b.icon" class="size-4" aria-hidden="true" /> {{ b.text }}
            </span>
            <span class="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-neutral-200 px-3 py-1.5 text-[11px] font-medium">
              <Icon icon="ph:shield-check-bold" class="size-4" aria-hidden="true" /> Audit log
            </span>
          </div>

          <!-- CTAs -->
          <div class="mt-8 flex flex-wrap gap-3">
            <a href="#demo?module=attendance"
               class="inline-flex items-center justify-center rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 text-sm font-semibold transition focus:outline-hidden focus:ring-2 focus:ring-emerald-400">
              Lihat Demo
            </a>
            <a href="#contact?module=attendance"
               class="inline-flex items-center justify-center rounded-2xl border border-gray-300 dark:border-neutral-700 px-5 py-3 text-sm font-semibold text-gray-800 dark:text-neutral-100 hover:bg-gray-50 dark:hover:bg-neutral-800 transition">
              Diskusikan Kustomisasi
            </a>
          </div>

          <p class="mt-3 text-xs text-gray-500">*Kecepatan bergantung kualitas jaringan & server.</p>
        </div>
        
        <div class="lg:col-span-6">
            <div class="mt-6 rounded-2xl border border-gray-200 mb-4 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
              <div class="flex items-center gap-2 mb-3">
                <Icon icon="ph:speaker-high-bold" class="size-5 text-emerald-600" aria-hidden="true" />
                <p class="font-semibold">Tes Pengumuman via Speaker</p>
              </div>
    
              <label class="block text-xs text-gray-600 dark:text-neutral-400 mb-1">Teks Pengumuman</label>
              <textarea
                v-model="announceText"
                rows="2" disabled readonly
                class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm p-2 outline-none focus:ring-2 focus:ring-emerald-400"
              />
    
              <div class="mt-3 flex flex-wrap gap-2">
                <button
                  @click="testAnnouncement()"
                  class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-semibold transition focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
                >
                  <Icon icon="ph:play-fill" class="size-4" /> Putar Pengumuman
                </button>
                <button
                  @click="stopAnnouncement()"
                  class="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-neutral-700 px-4 py-2 text-sm font-semibold text-gray-800 dark:text-neutral-100 hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
                >
                  <Icon icon="ph:stop-fill" class="size-4" /> Stop
                </button>
                <span class="text-[11px] text-gray-500">Browser akan memilih voice Arabic jika tersedia, jika tidak maka default.</span>
              </div>
            </div>
          <div
            class="relative"
            @mousemove="onMove" @mouseleave="onLeave"
          >
            <!-- glow ring -->
            <div class="absolute -inset-6 rounded-[2rem] bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20 blur-2xl -z-10"></div>

            <!-- device card -->
            <div
              class="group rounded-3xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-2xl p-4 transition-transform will-change-transform"
              :style="tiltStyle"
            >
              <div class="relative overflow-hidden rounded-2xl">
                <!-- device image -->
                <img
                  src="/assets/images/hero-toriid.png"
                  alt="Perangkat ToriID dengan branding kustom"
                  class="w-full object-cover rounded-2xl select-none"
                  draggable="false"
                />

                <!-- shine effect -->
                <div class="pointer-events-none absolute -top-1/3 -left-1/3 w-[140%] h-[140%] rotate-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                     aria-hidden="true">
                  <div class="w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 blur-xl"></div>
                </div>

                <!-- screen overlay + logo -->
                <div class="absolute top-4 left-4 right-4 rounded-xl border border-gray-200/70 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/70 backdrop-blur p-3 shadow-sm">
                  <div class="flex items-center gap-3">
                    <div
                      class="size-8 rounded-md flex items-center justify-center text-white text-xs font-bold"
                      :style="{ background: brandColor }"
                      aria-label="Aksen merek"
                    >
                      <Icon v-if="logoUrl" :icon="fallbackLogoIcon" class="opacity-0 size-0" />
                      <img v-if="logoUrl" :src="logoUrl" alt="Logo lembaga" class="max-h-8 max-w-8 object-contain" />
                      <span v-else>{{ brandInitials }}</span>
                    </div>
                    <div class="min-w-0">
                      <p class="truncate text-sm font-semibold text-gray-900 dark:text-neutral-100">{{ brandName }}</p>
                      <p class="truncate text-[11px] text-gray-600 dark:text-neutral-400">Display & casing kustom</p>
                    </div>

                    <!-- realtime pill -->
                    <div class="ml-auto inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px]
                                bg-emerald-600/10 text-emerald-700 dark:text-emerald-300">
                      <span class="relative flex size-2">
                        <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 animate-ping"></span>
                        <span class="relative inline-flex rounded-full bg-emerald-600 size-2"></span>
                      </span>
                      <span class="tabular-nums">{{ liveLatency }} ms</span>
                    </div>
                  </div>

                  <!-- latency bar -->
                  <div class="mt-3 h-2 rounded bg-gray-200 dark:bg-neutral-800 overflow-hidden">
                    <div class="h-2 rounded bg-gradient-to-r from-emerald-500 to-teal-400 transition-[width] duration-300" :style="{ width: barWidth }" />
                  </div>
                </div>
              </div>
            </div>

            <!-- steps -->
            <ol class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <li class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
                <div class="flex items-center gap-2 font-semibold">
                  <span class="inline-flex size-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">1</span>
                  Branding
                </div>
                <p class="mt-1 text-gray-600 dark:text-neutral-300">Kirim logo & pilih opsi casing.</p>
              </li>
              <li class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
                <div class="flex items-center gap-2 font-semibold">
                  <span class="inline-flex size-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">2</span>
                  Pasang
                </div>
                <p class="mt-1 text-gray-600 dark:text-neutral-300">Sambungkan via Wi-Fi/LAN/USB.</p>
              </li>
              <li class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
                <div class="flex items-center gap-2 font-semibold">
                  <span class="inline-flex size-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">3</span>
                  Pakai
                </div>
                <p class="mt-1 text-gray-600 dark:text-neutral-300">Scan & lihat hasil real-time.</p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'

/** ======== Props: kontrol branding yang nyata ======== */
const props = withDefaults(defineProps<{
  logoUrl?: string
  brandName?: string
  brandColor?: string
}>(), {
  logoUrl: '',
  brandName: 'Nama Lembaga',
  brandColor: '#10B981' // emerald-500
})

const brandName = computed(() => props.brandName)
const brandInitials = computed(() => (props.brandName || 'NA').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase())
const brandColor = computed(() => props.brandColor)
const logoUrl = computed(() => props.logoUrl)
const fallbackLogoIcon = 'ph:seal-check-fill'

/** ======== Feature + Badges ======== */
const features = [
  { icon: 'solar:check-circle-bold-duotone', title: 'Logo di Display', desc: 'Splash & header layar sesuai identitas.' },
  { icon: 'solar:check-circle-bold-duotone', title: 'Casing Kustom', desc: 'Stiker/cetak UV sesuai brand guide.' },
  { icon: 'solar:check-circle-bold-duotone', title: 'Konektivitas Fleksibel', desc: 'Wi-Fi, LAN, atau USB.' },
  { icon: 'solar:check-circle-bold-duotone', title: 'Realtime Anti Lelet', desc: 'Tampil & kirim < 1 detik*.' },
  { icon: 'solar:check-circle-bold-duotone', title: 'Tahan Gangguan Jaringan', desc: 'Buffer lokal & auto-sync.' },
  { icon: 'solar:check-circle-bold-duotone', title: 'Multi-Device', desc: 'Gerbang, kelas, asrama—semua terkoneksi.' },
  // NEW: highlight speaker announcement
  { icon: 'ph:speaker-high-bold', title: 'Pengumuman Otomatis', desc: 'Otomatis umumkan kedatangan/izin lewat speaker.' }
]

const badges = [
  { icon: 'ph:wifi-high-bold', text: 'Wi-Fi' },
  { icon: 'ph:network-bold', text: 'LAN' },
  { icon: 'ph:usb-bold', text: 'USB' }
]

/** ======== Live indicator (simulasi; bisa diganti WS nyata) ======== */
const liveLatency = ref(72) // ms
const barWidth = ref('86%')
let timer: number | null = null

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  timer = window.setInterval(() => {
    const ms = Math.max(35, Math.min(180, Math.round(liveLatency.value + (Math.random() * 36 - 18))))
    liveLatency.value = ms
    const pct = Math.max(12, Math.min(100, Math.round(100 - (ms / 200) * 90)))
    barWidth.value = pct + '%'
  }, reduced ? 2000 : 1200)
})
onBeforeUnmount(() => { if (timer) window.clearInterval(timer) })

/** ======== Tilt effect (tanpa lib tambahan) ======== */
const tiltStyle = ref<Record<string, string>>({})
function onMove(e: MouseEvent) {
  const card = (e.currentTarget as HTMLElement).querySelector('.group') as HTMLElement
  if (!card) return
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const rotateY = ((x / rect.width) - 0.5) * 8
  const rotateX = -((y / rect.height) - 0.5) * 8
  tiltStyle.value = { transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` }
}
function onLeave() {
  tiltStyle.value = { transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg)', transition: 'transform .35s ease' }
}

/** ======== Speaker Announcement (Arabic preferred, fallback default) ======== */
// default kalimat (Arab). Bisa diedit user pada textarea.
const announceText = ref('انتباه: هناك زيارة لطلابكم. الرجاء التوجه إلى مكتب الاستقبال. شكراً لكم.')
const announceVolume = ref(0.9)
let voices: SpeechSynthesisVoice[] = []
const voiceReady = ref(false)

function loadVoices() {
  voices = window.speechSynthesis.getVoices()
  voiceReady.value = voices.length > 0
}
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices()
  window.speechSynthesis.onvoiceschanged = loadVoices
}

function pickArabicVoice(): SpeechSynthesisVoice | null {
  if (!voices?.length) return null
  // prioritas ar / ar-SA
  const ar = voices.find(v => /(^ar\b|ar-SA|Arabic)/i.test(`${v.lang} ${v.name}`))
  if (ar) return ar
  return null
}

let utter: SpeechSynthesisUtterance | null = null

function testAnnouncement() {
  if (!('speechSynthesis' in window)) {
    alert('Browser Anda belum mendukung Speech Synthesis.')
    return
  }
  stopAnnouncement()

  const text = announceText.value?.trim() || 'Pengumuman kedatangan santri, silakan menuju ruang tamu.'
  utter = new SpeechSynthesisUtterance(text)
  utter.volume = announceVolume.value
  utter.rate = 1
  utter.pitch = 1

  const arVoice = pickArabicVoice()
  if (arVoice) {
    utter.lang = arVoice.lang || 'ar-SA'
    utter.voice = arVoice
  } else {
    utter.lang = 'ar-SA' // biarkan mencoba arabic; jika tidak ada, browser pakai default
  }

  window.speechSynthesis.speak(utter)
}

function stopAnnouncement() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}
</script>
