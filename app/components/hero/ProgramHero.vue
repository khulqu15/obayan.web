<template>
  <section ref="root" class="relative overflow-hidden dark:bg-neutral-950 bg-gray-50">
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-[radial-gradient(60%_50%_at_10%_60%,rgba(37,99,235,0.09),transparent_70%),radial-gradient(45%_40%_at_90%_20%,rgba(16,185,129,0.12),transparent_60%)]"></div>
      <div class="absolute inset-0 [background-image:radial-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:18px_18px] dark:opacity-40"></div>
      <div class="absolute -top-24 -left-24 size-[420px] rounded-full blur-3xl opacity-25 bg-emerald-400/40"></div>
      <div class="absolute -bottom-28 -right-28 size-[520px] rounded-full blur-3xl opacity-20 bg-blue-500/40"></div>
    </div>
    <div class="relative max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-18 lg:pt-20 pb-12 sm:pb-16">
      <div class="mb-8 flex items-center justify-between">
        <a
          :href="cta.href" target="_blank" rel="noopener"
          class="inline-flex items-center gap-3 group"
          data-animate
        >
          <span class="relative">
            <img
              src="/logo.png"
              alt="Obayan"
              class="h-8 sm:h-9 w-auto drop-shadow-sm animate-float"
            />
            <span class="pointer-events-none absolute -inset-2 rounded-xl blur-md opacity-30 bg-gradient-to-r from-emerald-400/50 to-cyan-500/50"></span>
          </span>
          <span class="text-sm font-semibold text-gray-800 dark:text-neutral-100">
            Obayan <span class="text-gray-500 dark:text-neutral-400 font-normal">• Platform Edukasi Modern</span>
          </span>
        </a>

        <div class="hidden sm:flex items-center gap-3 text-[11px] text-gray-600 dark:text-neutral-300" data-animate>
          <div class="inline-flex items-center gap-1.5">
            <ClientOnly><Icon icon="ph:shield-check" class="size-3.5 text-emerald-600" /></ClientOnly>
            Enkripsi & Role-Based Access
          </div>
          <span>•</span>
          <div class="inline-flex items-center gap-1.5">
            <ClientOnly><Icon icon="ph:cloud-arrow-up" class="size-3.5 text-blue-600" /></ClientOnly>
            Cloud Production-Ready
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-12 gap-10 items-center">
        <div class="lg:col-span-6 space-y-7">
          <p data-animate class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
            <ClientOnly><Icon icon="ph:hand-heart" class="size-4" /></ClientOnly>
            Ekosistem Santri Inovatif
          </p>

          <h1 data-animate class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Operasikan <span class="text-emerald-600 dark:text-emerald-400">pondok & sekolah</span> modern
            <br class="hidden sm:block" />
            dengan <span class="animated-underline text-green-600">Obayan</span>
          </h1>

          <p data-animate class="text-xl sm:text-2xl font-semibold tracking-tight">
            <span class="text-gray-700 dark:text-neutral-200 me-3">Satu pintu untuk</span>
            <span class="typed-wrapper text-cyan-700">
              <span class="typed">{{ typedText }}</span><span class="caret" aria-hidden="true">|</span>
            </span>
          </p>

          <p data-animate class="text-gray-600 dark:text-neutral-300 max-w-xl">
            Transparan, aman, dan tumbuh bersama lembaga Anda. PPDB, SPP, absensi, tahfidz, hingga e-Learning —
            semua terintegrasi dan mudah digunakan.
          </p>

          <div data-animate class="flex flex-wrap items-center gap-3">
            <a
              :href="cta.href" target="_blank" rel="noopener"
              class="group inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white select-none magnetic
                     bg-gradient-to-r from-emerald-600 to-cyan-600 hover:opacity-95 active:scale-[.99] transition will-change-transform"
              @mousemove="onMagnetMove"
              @mouseleave="onMagnetLeave"
            >
              <ClientOnly><Icon icon="solar:rocket-bold" class="size-4" /></ClientOnly>
              {{ cta.label }}
              <ClientOnly><Icon icon="ph:arrow-right" class="size-4 translate-x-0 group-hover:translate-x-0.5 transition-transform" /></ClientOnly>
            </a>
          </div>

          <!-- trust chips -->
          <div data-animate class="flex flex-wrap gap-2">
            <span class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-medium border border-gray-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60">PPDB Online</span>
            <span class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-medium border border-gray-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60">SPP & Keuangan</span>
            <span class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-medium border border-gray-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60">Absensi Digital</span>
            <span class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-medium border border-gray-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60">Tahfidz & Akademik</span>
            <span class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-medium border border-gray-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60">CBT & e-Learning</span>
            <span class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-medium border border-gray-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60">Laporan Realtime</span>
          </div>
        </div>

        <!-- RIGHT: product card with animations -->
        <div class="lg:col-span-6">
          <div data-animate class="relative rounded-3xl border border-gray-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur p-5 shadow-2xl">
            <div class="absolute -top-4 -right-4">
              <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white text-[11px] px-3 py-1 shadow-lg animate-pulse">
                <ClientOnly><Icon icon="ph:sparkle" class="size-3.5" /></ClientOnly>
                Real-time
              </span>
            </div>

            <div class="relative perspective">
              <div class="tilt-card group will-change-transform rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-lg">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <ClientOnly><Icon icon="ph:books" class="size-5 text-blue-600 dark:text-blue-400" /></ClientOnly>
                    <h3 class="text-base font-semibold text-gray-900 dark:text-white">Ringkasan Lembaga</h3>
                  </div>
                  <span class="text-[11px] px-2 py-1 rounded bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300">Dashboard</span>
                </div>

                <!-- KPIs -->
                <div class="mt-4 grid grid-cols-3 gap-3">
                  <div class="kpi">
                    <p class="text-[11px] text-gray-500 dark:text-neutral-400">Siswa aktif</p>
                    <p class="kpi-num" data-count="1240">0</p>
                  </div>
                  <div class="kpi">
                    <p class="text-[11px] text-gray-500 dark:text-neutral-400">Pelunasan SPP</p>
                    <p class="kpi-num" data-count="96">0</p>
                  </div>
                  <div class="kpi">
                    <p class="text-[11px] text-gray-500 dark:text-neutral-400">Hafalan/bulan</p>
                    <p class="kpi-num" data-count="320">0</p>
                  </div>
                </div>

                <!-- progress bars -->
                <div class="mt-5 space-y-3">
                  <div>
                    <div class="flex justify-between text-[11px] text-gray-500 dark:text-neutral-400">
                      <span>Absensi hari ini</span><span>92%</span>
                    </div>
                    <div class="mt-1 h-2 rounded-full bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                      <div class="h-full w-[92%] bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-[progress_2s_ease-in-out]"></div>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between text-[11px] text-gray-500 dark:text-neutral-400">
                      <span>SPP terbayar</span><span>86%</span>
                    </div>
                    <div class="mt-1 h-2 rounded-full bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                      <div class="h-full w-[86%] bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-[progress_2.2s_ease-in-out]"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="absolute inset-0 -z-10 translate-y-4 blur-xl opacity-40 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl"></div>
            </div>

            <!-- feature pills -->
            <div id="fitur" class="mt-6">
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="f in features" :key="f.id"
                  class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-medium border border-gray-200 dark:border-neutral-800
                         bg-white/70 dark:bg-neutral-900/60 hover:-translate-y-[1px] transition will-change-transform"
                >
                  <ClientOnly><Icon :icon="f.icon" class="size-3.5 text-emerald-600" /></ClientOnly>
                  {{ f.title }}
                </button>
              </div>
              <p class="mt-3 text-sm text-gray-600 dark:text-neutral-300">
                Kelola data siswa, orang tua, guru, jadwal, keuangan, tahfidz, dan kelas digital — terintegrasi dalam satu platform.
              </p>
              <div class="mt-4">
                <a :href="cta.href" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline">
                  Pelajari Obayan di obayan.sencra.io
                  <ClientOnly><Icon icon="ph:arrow-up-right" class="size-4" /></ClientOnly>
                </a>
              </div>
            </div>
          </div>
        </div>
        <!-- /RIGHT -->
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'

const root = ref<HTMLElement | null>(null)

const cta = { label: 'Coba Obayan Gratis', href: 'https://obayan.sencra.io' }

type Feature = { id: string; title: string; icon: string }
const features = ref<Feature[]>([
  { id: 'ppdb',   title: 'PPDB Online',    icon: 'ph:student' },
  { id: 'spp',    title: 'SPP & Keuangan', icon: 'ph:wallet' },
  { id: 'absen',  title: 'Absensi Digital',icon: 'ph:identification-badge' },
  { id: 'tahfidz',title: 'Tahfidz & Akademik', icon: 'ph:book-open-text' },
  { id: 'cbt',    title: 'CBT & e-Learning',   icon: 'ph:monitor' },
  { id: 'lap',    title: 'Laporan Realtime',   icon: 'ph:chart-bar' },
])

/* === TYPEWRITER (text animation) === */
const phrases = [
  'PPDB Online',
  'SPP & Keuangan',
  'Absensi Digital',
  'Tahfidz & Akademik',
  'CBT & e-Learning',
  'Laporan Realtime'
]
const typedText = ref('')
let phraseIdx = 0, charIdx = 0, typingTimer: number | null = null, deleting = false

function startTypewriter() {
  stopTypewriter()
  const tick = () => {
    const full = phrases[phraseIdx]!
    if (!deleting) {
      typedText.value = full.slice(0, charIdx++)
      if (charIdx > full.length) {
        deleting = true
        typingTimer = window.setTimeout(tick, 1200) // hold
        return
      }
    } else {
      typedText.value = full.slice(0, charIdx--)
      if (charIdx < 0) {
        deleting = false
        phraseIdx = (phraseIdx + 1) % phrases.length
        charIdx = 0
      }
    }
    typingTimer = window.setTimeout(tick, deleting ? 40 : 70)
  }
  tick()
}
function stopTypewriter() { if (typingTimer) { clearTimeout(typingTimer); typingTimer = null } }

/* === In-view reveal + count-up === */
function initInView(el: HTMLElement) {
  const items = Array.from(el.querySelectorAll<HTMLElement>('[data-animate]'))
  const kpis = Array.from(el.querySelectorAll<HTMLElement>('.kpi-num'))
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('inview')
        obs.unobserve(entry.target as Element)
      }
    })
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 })
  items.forEach((n) => { n.classList.add('pre-inview'); obs.observe(n) })

  const obs2 = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue
      animateCount(e.target as HTMLElement, Number((e.target as HTMLElement).dataset.count || '0'), 900)
      obs2.unobserve(e.target as Element)
    }
  }, { threshold: 0.5 })
  kpis.forEach((n) => obs2.observe(n))
}

function animateCount(el: HTMLElement, to: number, dur = 800) {
  const start = performance.now(), from = 0
  const ease = (t: number) => 1 - Math.pow(1 - t, 3)
  const step = (now: number) => {
    const p = Math.min(1, (now - start) / dur)
    const v = Math.floor(from + (to - from) * ease(p))
    el.textContent = v.toLocaleString()
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

/* === Tilt + Magnetic === */
function attachTilt() {
  const cards = document.querySelectorAll<HTMLElement>('.tilt-card')
  cards.forEach((card) => {
    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
      card.style.setProperty('--rx', `${-dy * 6}deg`)
      card.style.setProperty('--ry', `${dx * 8}deg`)
    }
    const onLeave = () => {
      card.style.setProperty('--rx', `0deg`)
      card.style.setProperty('--ry', `0deg`)
    }
    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
  })
}
function onMagnetMove(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  const r = el.getBoundingClientRect()
  el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) / 6}px, ${(e.clientY - (r.top + r.height / 2)) / 6}px)`
}
function onMagnetLeave(e: MouseEvent) {
  (e.currentTarget as HTMLElement).style.transform = `translate(0,0)`
}

onMounted(() => {
  if (root.value) initInView(root.value)
  attachTilt()
  startTypewriter()

  // Init Preline (SSR-safe)
  Promise.resolve()
    .then(() => import('preline'))
    .catch(() => import('preline'))
    .finally(() => {
      // @ts-ignore
      window?.HSStaticMethods?.autoInit?.()
    })
})

onBeforeUnmount(() => stopTypewriter())
</script>

<style scoped>
@keyframes float { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-4px) } }
.animate-float { animation: float 4s ease-in-out infinite }

.pre-inview { opacity: 0; transform: translateY(16px) scale(.98); transition: opacity .6s ease, transform .6s cubic-bezier(.22,1,.36,1); }
.inview { opacity: 1 !important; transform: translateY(0) scale(1) !important; }

.perspective { perspective: 1200px; }
.tilt-card { transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)); transition: transform 200ms ease, box-shadow 200ms ease; }
.tilt-card:hover { box-shadow: 0 20px 60px -20px rgba(16, 185, 129, 0.35); }

.kpi { padding: .5rem; border-radius: .75rem; background: linear-gradient(to bottom right, rgba(16,185,129,.08), rgba(37,99,235,.06)); }
.kpi-num { font-weight: 800; font-size: clamp(1.25rem, 1.1rem + .8vw, 1.75rem); color: var(--tw-prose-bold, rgb(17,24,39)); }
:global(.dark) .kpi-num { color: white; }

@keyframes progress { from { width: 0% } }

.typed-wrapper { display: inline-flex; align-items: center; min-width: 12ch; }
.typed { display: inline-block; white-space: nowrap; }
.caret { display: inline-block; width: 1ch; margin-left: 2px; color: currentColor; animation: blink 1s step-end infinite; }
@keyframes blink { 50% { opacity: 0 } }
</style>
