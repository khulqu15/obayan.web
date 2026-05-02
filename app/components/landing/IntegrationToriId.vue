<template>
  <section id="integrations" class="relative overflow-hidden py-20 sm:py-24 lg:py-28">
    <!-- Background -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-gradient-to-b from-green-50/90 via-white to-white dark:from-green-950/25 dark:via-neutral-950 dark:to-neutral-950" />
      <div class="absolute -left-28 top-20 size-80 rounded-full bg-green-300/25 blur-3xl dark:bg-green-500/10" />
      <div class="absolute -right-28 top-1/3 size-96 rounded-full bg-lime-300/20 blur-3xl dark:bg-lime-500/10" />
      <div class="absolute bottom-0 left-1/2 size-80 -translate-x-1/2 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10" />
    </div>

    <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <!-- LEFT: content hierarchy -->
        <div class="lg:col-span-6">
          <div class="inline-flex items-center gap-2 rounded-full border border-green-200/70 bg-white/80 px-4 py-2 text-xs font-black text-green-700 shadow-sm shadow-green-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-green-300">
            <span class="relative flex size-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
              <span class="relative inline-flex size-2 rounded-full bg-green-600" />
            </span>
            ToriID Attendance Device
          </div>

          <h2 class="mt-5 text-3xl font-black leading-tight tracking-tight text-gray-950 dark:text-white sm:text-5xl">
            Absensi otomatis,
            <span class="bg-gradient-to-r from-green-600 via-emerald-500 to-lime-500 bg-clip-text text-transparent">
              branding lembaga tetap tampil
            </span>
          </h2>

          <p class="mt-5 max-w-2xl text-base leading-8 text-gray-600 dark:text-neutral-300">
            ToriID membantu lembaga melakukan absensi RFID dengan tampilan device yang bisa disesuaikan:
            logo di display, casing kustom, koneksi fleksibel, dan data tersinkron real-time ke ekosistem Obayan.
          </p>

          <!-- Primary value cards -->
          <div class="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div
              v-for="item in valueHighlights"
              :key="item.title"
              class="rounded-[1.35rem] border border-gray-200/70 bg-white/75 p-4 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-green-900/10 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <div class="grid size-10 place-items-center rounded-2xl bg-green-50 text-green-600 ring-1 ring-green-200/70 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-400/20">
                <Icon :icon="item.icon" class="size-5" />
              </div>
              <p class="mt-3 text-sm font-black text-gray-950 dark:text-white">
                {{ item.title }}
              </p>
              <p class="mt-1 text-xs leading-5 text-gray-500 dark:text-neutral-400">
                {{ item.desc }}
              </p>
            </div>
          </div>

          <!-- Feature groups -->
          <div class="mt-8 space-y-4">
            <div
              v-for="group in featureGroups"
              :key="group.title"
              class="rounded-[1.5rem] border border-gray-200/70 bg-white/70 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]"
            >
              <div class="mb-4 flex items-center gap-3">
                <div class="grid size-10 place-items-center rounded-2xl bg-green-600 text-white shadow-xl shadow-green-500/20">
                  <Icon :icon="group.icon" class="size-5" />
                </div>
                <div>
                  <p class="font-black text-gray-950 dark:text-white">{{ group.title }}</p>
                  <p class="text-xs text-gray-500 dark:text-neutral-400">{{ group.subtitle }}</p>
                </div>
              </div>

              <div class="grid gap-3 sm:grid-cols-2">
                <div
                  v-for="f in group.items"
                  :key="f.title"
                  class="flex gap-3 rounded-2xl bg-green-50/70 p-3 dark:bg-green-500/10"
                >
                  <Icon :icon="f.icon" class="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-300" />
                  <div>
                    <p class="text-sm font-bold text-gray-950 dark:text-white">{{ f.title }}</p>
                    <p class="mt-0.5 text-xs leading-5 text-gray-600 dark:text-neutral-300">{{ f.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Badges -->
          <div class="mt-6 flex flex-wrap gap-2">
            <span
              v-for="b in badges"
              :key="b.text"
              class="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-[11px] font-black text-green-800 ring-1 ring-green-200 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-400/20"
            >
              <Icon :icon="b.icon" class="size-4" />
              {{ b.text }}
            </span>
          </div>

          <!-- CTA -->
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#demo?module=attendance"
              class="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-black text-white shadow-xl shadow-green-500/20 transition hover:-translate-y-0.5 hover:bg-green-700"
            >
              <Icon icon="ph:play-circle-duotone" class="size-5" />
              Lihat Demo
            </a>

            <a
              href="#contact?module=attendance"
              class="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-gray-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              <Icon icon="ph:chat-circle-dots-duotone" class="size-5" />
              Diskusikan Kustomisasi
            </a>
          </div>

          <p class="mt-3 text-xs text-gray-500 dark:text-neutral-400">
            *Kecepatan sinkronisasi bergantung pada kualitas jaringan, server, dan konfigurasi implementasi.
          </p>
        </div>

        <!-- RIGHT: demo hierarchy -->
        <div class="lg:col-span-6">
          <div class="relative">
            <div class="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-lime-400/20 blur-2xl" />

            <div class="overflow-hidden rounded-[2rem] border border-gray-200/70 bg-white/75 p-4 shadow-2xl shadow-green-900/10 backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.04] sm:p-5">
              <!-- Top device preview -->
              <div
                class="relative"
                @mousemove="onMove"
                @mouseleave="onLeave"
              >
                <div
                  ref="deviceCardRef"
                  class="device-card group relative overflow-hidden rounded-[1.65rem] border border-white/80 bg-gradient-to-br from-slate-950 via-slate-900 to-green-950 p-3 shadow-2xl transition-transform will-change-transform dark:border-white/10"
                  :style="tiltStyle"
                >
                  <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.26),transparent_26%),radial-gradient(circle_at_80%_10%,rgba(132,204,22,0.16),transparent_24%)]" />

                  <div class="relative overflow-hidden rounded-[1.35rem] bg-white/5">
                    <img
                      src="/assets/images/hero-toriid.png"
                      alt="Perangkat ToriID dengan branding kustom"
                      class="h-[360px] w-full select-none rounded-[1.35rem] object-cover sm:h-[430px]"
                      draggable="false"
                    >

                    <!-- Shine -->
                    <div class="pointer-events-none absolute -left-1/3 -top-1/3 h-[140%] w-[140%] rotate-12 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                      <div class="h-full w-full bg-gradient-to-r from-white/0 via-white/25 to-white/0 blur-xl" />
                    </div>

                    <!-- Brand overlay -->
                    <div class="absolute left-4 right-4 top-4 rounded-2xl border border-white/20 bg-white/85 p-3 shadow-xl backdrop-blur-xl dark:bg-neutral-950/70">
                      <div class="flex items-center gap-3">
                        <div
                          class="grid size-10 shrink-0 place-items-center rounded-xl text-xs font-black text-white"
                          :style="{ background: brandColor }"
                        >
                          <img
                            v-if="logoUrl"
                            :src="logoUrl"
                            alt="Logo lembaga"
                            class="max-h-8 max-w-8 object-contain"
                          >
                          <span v-else>{{ brandInitials }}</span>
                        </div>

                        <div class="min-w-0">
                          <p class="truncate text-sm font-black text-gray-950 dark:text-white">
                            {{ brandName }}
                          </p>
                          <p class="truncate text-[11px] font-medium text-gray-500 dark:text-neutral-400">
                            Display & casing kustom
                          </p>
                        </div>

                        <div class="ml-auto inline-flex items-center gap-1 rounded-full bg-green-600/10 px-2.5 py-1 text-[11px] font-black text-green-700 dark:text-green-300">
                          <span class="relative flex size-2">
                            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                            <span class="relative inline-flex size-2 rounded-full bg-green-600" />
                          </span>
                          {{ liveLatency }} ms
                        </div>
                      </div>

                      <div class="mt-3 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                        <div
                          class="h-full rounded-full bg-gradient-to-r from-green-500 to-lime-400 transition-[width] duration-300"
                          :style="{ width: barWidth }"
                        />
                      </div>
                    </div>

                    <!-- Floating scan card -->
                    <div class="scan-card absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-slate-950/72 p-4 text-white shadow-2xl backdrop-blur-xl sm:left-auto sm:w-[320px]">
                      <div class="flex items-center gap-3">
                        <div class="grid size-11 place-items-center rounded-2xl bg-green-500 text-white shadow-xl shadow-green-500/20">
                          <Icon icon="ph:identification-card-duotone" class="size-6" />
                        </div>
                        <div>
                          <p class="text-sm font-black">Scan berhasil</p>
                          <p class="text-xs text-white/70">Data masuk ke Obayan secara real-time</p>
                        </div>
                      </div>

                      <div class="mt-4 grid grid-cols-3 gap-2 text-center">
                        <div class="rounded-xl bg-white/10 p-2">
                          <p class="text-xs text-white/55">Status</p>
                          <p class="text-xs font-black text-green-300">Hadir</p>
                        </div>
                        <div class="rounded-xl bg-white/10 p-2">
                          <p class="text-xs text-white/55">Mode</p>
                          <p class="text-xs font-black">RFID</p>
                        </div>
                        <div class="rounded-xl bg-white/10 p-2">
                          <p class="text-xs text-white/55">Sync</p>
                          <p class="text-xs font-black">{{ liveLatency }}ms</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bottom hierarchy: announcement + workflow -->
              <div class="mt-4 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                <!-- Speaker test -->
                <div class="rounded-[1.5rem] border border-gray-200/70 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-neutral-950/65">
                  <div class="mb-3 flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                      <div class="grid size-10 place-items-center rounded-2xl bg-green-50 text-green-600 ring-1 ring-green-200/70 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-400/20">
                        <Icon icon="ph:speaker-high-duotone" class="size-5" />
                      </div>
                      <div>
                        <p class="text-sm font-black text-gray-950 dark:text-white">Speaker Announcement</p>
                        <p class="text-xs text-gray-500 dark:text-neutral-400">Simulasi pengumuman otomatis</p>
                      </div>
                    </div>

                    <span
                      class="rounded-full px-2.5 py-1 text-[11px] font-black"
                      :class="voiceReady ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300' : 'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-neutral-400'"
                    >
                      {{ voiceReady ? 'Voice ready' : 'Default voice' }}
                    </span>
                  </div>

                  <textarea
                    v-model="announceText"
                    rows="3"
                    readonly
                    class="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-3 text-sm leading-6 text-gray-700 outline-none transition focus:border-green-400 focus:ring-4 focus:ring-green-500/10 dark:border-white/10 dark:bg-white/5 dark:text-neutral-200"
                  />

                  <div class="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      class="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-black text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                      @click="testAnnouncement"
                    >
                      <Icon icon="ph:play-fill" class="size-4" />
                      Putar
                    </button>

                    <button
                      type="button"
                      class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-black text-gray-800 transition hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                      @click="stopAnnouncement"
                    >
                      <Icon icon="ph:stop-fill" class="size-4" />
                      Stop
                    </button>
                  </div>
                </div>

                <!-- Workflow -->
                <ol class="grid gap-3">
                  <li
                    v-for="(s, i) in setupSteps"
                    :key="s.title"
                    class="rounded-[1.35rem] border border-gray-200/70 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-xl hover:shadow-green-900/10 dark:border-white/10 dark:bg-neutral-950/65"
                  >
                    <div class="flex items-start gap-3">
                      <span class="grid size-8 shrink-0 place-items-center rounded-xl bg-green-600 text-xs font-black text-white">
                        {{ i + 1 }}
                      </span>
                      <div>
                        <p class="text-sm font-black text-gray-950 dark:text-white">{{ s.title }}</p>
                        <p class="mt-1 text-xs leading-5 text-gray-600 dark:text-neutral-300">{{ s.desc }}</p>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'

const props = withDefaults(defineProps<{
  logoUrl?: string
  brandName?: string
  brandColor?: string
}>(), {
  logoUrl: '',
  brandName: 'Nama Lembaga',
  brandColor: '#10B981',
})

const brandName = computed(() => props.brandName)
const brandInitials = computed(() => {
  return (props.brandName || 'NA')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
})
const brandColor = computed(() => props.brandColor)
const logoUrl = computed(() => props.logoUrl)

const valueHighlights = [
  {
    icon: 'ph:timer-duotone',
    title: 'Cepat',
    desc: 'Scan dan sinkronisasi data dalam hitungan detik.',
  },
  {
    icon: 'ph:paint-brush-duotone',
    title: 'Custom',
    desc: 'Display dan casing mengikuti identitas lembaga.',
  },
  {
    icon: 'ph:shield-check-duotone',
    title: 'Tertib',
    desc: 'Aktivitas tercatat dengan audit log dan auto-sync.',
  },
]

const featureGroups = [
  {
    title: 'Branding Device',
    subtitle: 'Tampilan perangkat mengikuti identitas lembaga.',
    icon: 'ph:sparkle-duotone',
    items: [
      {
        icon: 'ph:monitor-duotone',
        title: 'Logo di Display',
        desc: 'Splash screen dan header layar dapat memakai logo lembaga.',
      },
      {
        icon: 'ph:printer-duotone',
        title: 'Casing Kustom',
        desc: 'Stiker/cetak UV casing dapat disesuaikan dengan brand guide.',
      },
    ],
  },
  {
    title: 'Konektivitas & Sinkronisasi',
    subtitle: 'Fleksibel untuk berbagai kondisi jaringan.',
    icon: 'ph:wifi-high-duotone',
    items: [
      {
        icon: 'ph:wifi-high-duotone',
        title: 'Wi-Fi / LAN / USB',
        desc: 'Mendukung beberapa opsi koneksi untuk titik presensi.',
      },
      {
        icon: 'ph:cloud-arrow-up-duotone',
        title: 'Buffer & Auto-Sync',
        desc: 'Data tetap aman saat jaringan terganggu dan disinkronkan ulang.',
      },
    ],
  },
  {
    title: 'Operasional Harian',
    subtitle: 'Mendukung absensi, monitoring, dan pengumuman.',
    icon: 'ph:arrows-clockwise-duotone',
    items: [
      {
        icon: 'ph:identification-badge-duotone',
        title: 'Multi-Device',
        desc: 'Gerbang, kelas, asrama, dan titik lain dapat terhubung.',
      },
      {
        icon: 'ph:speaker-high-duotone',
        title: 'Pengumuman Otomatis',
        desc: 'Bisa mengumumkan kedatangan/izin melalui speaker.',
      },
    ],
  },
]

const badges = [
  { icon: 'ph:wifi-high-bold', text: 'Wi-Fi' },
  { icon: 'ph:network-bold', text: 'LAN Ethernet' },
  { icon: 'ph:usb-bold', text: 'USB' },
  { icon: 'ph:shield-check-bold', text: 'Audit log' },
  { icon: 'ph:database-bold', text: 'Auto-sync' },
]

const setupSteps = [
  {
    title: 'Branding',
    desc: 'Kirim logo, pilih warna, dan tentukan kebutuhan casing.',
  },
  {
    title: 'Pasang',
    desc: 'Tempatkan device di gerbang, kelas, asrama, atau titik presensi.',
  },
  {
    title: 'Pakai',
    desc: 'Scan kartu/tag RFID dan pantau hasilnya langsung di Obayan.',
  },
]

const liveLatency = ref(72)
const barWidth = ref('86%')
let timer: number | undefined

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  timer = window.setInterval(() => {
    const ms = Math.max(35, Math.min(180, Math.round(liveLatency.value + (Math.random() * 36 - 18))))
    liveLatency.value = ms

    const pct = Math.max(12, Math.min(100, Math.round(100 - (ms / 200) * 90)))
    barWidth.value = `${pct}%`
  }, reduced ? 2000 : 1200)

  loadVoices()
  window.speechSynthesis.onvoiceschanged = loadVoices
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
})

const tiltStyle = ref<Record<string, string>>({})

function onMove(e: MouseEvent) {
  const current = e.currentTarget as HTMLElement
  const rect = current.getBoundingClientRect()

  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const rotateY = ((x / rect.width) - 0.5) * 7
  const rotateX = -((y / rect.height) - 0.5) * 7

  tiltStyle.value = {
    transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    transition: 'transform 80ms ease-out',
  }
}

function onLeave() {
  tiltStyle.value = {
    transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg)',
    transition: 'transform 360ms cubic-bezier(0.22, 1, 0.36, 1)',
  }
}

const announceText = ref('انتباه: هناك زيارة لطلابكم. الرجاء التوجه إلى مكتب الاستقبال. شكراً لكم.')
const announceVolume = ref(0.9)
const voiceReady = ref(false)

let voices: SpeechSynthesisVoice[] = []
let utter: SpeechSynthesisUtterance | null = null

function loadVoices() {
  if (!('speechSynthesis' in window)) return

  voices = window.speechSynthesis.getVoices()
  voiceReady.value = voices.length > 0
}

function pickArabicVoice(): SpeechSynthesisVoice | null {
  if (!voices.length) return null

  return voices.find((voice) => /(^ar\b|ar-SA|Arabic)/i.test(`${voice.lang} ${voice.name}`)) || null
}

function testAnnouncement() {
  if (!('speechSynthesis' in window)) {
    alert('Browser Anda belum mendukung Speech Synthesis.')
    return
  }

  stopAnnouncement()

  const text = announceText.value.trim() || 'Pengumuman kedatangan santri, silakan menuju ruang tamu.'

  utter = new SpeechSynthesisUtterance(text)
  utter.volume = announceVolume.value
  utter.rate = 1
  utter.pitch = 1

  const arVoice = pickArabicVoice()

  if (arVoice) {
    utter.lang = arVoice.lang || 'ar-SA'
    utter.voice = arVoice
  } else {
    utter.lang = 'ar-SA'
  }

  window.speechSynthesis.speak(utter)
}

function stopAnnouncement() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}
</script>

<style scoped>
.device-card {
  transform-style: preserve-3d;
}

.scan-card {
  animation: scanFloat 4.8s ease-in-out infinite;
}

@keyframes scanFloat {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  50% {
    transform: translate3d(0, -8px, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .device-card,
  .scan-card {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
}
</style>