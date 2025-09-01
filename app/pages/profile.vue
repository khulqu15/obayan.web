<!-- pages/profile.vue -->
<template>
  <section ref="wrapEl" id="profile" class="relative overflow-hidden dark:bg-neutral-900 bg-gray-100">
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

    <div class="relative pt-42">
      <div class="absolute inset-0">
        <img src="/assets/images/profile.png" alt="Profil Pondok" class="w-full h-full object-cover opacity-80" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
      </div>
      <div class="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 h-[44vh] sm:h-[56vh] flex items-end">
        <div class="mb-10">
          <p class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-blue-200">
            <span class="inline-block size-2 rounded-full bg-blue-400" /> Profil Pondok Pesantren Alberr
          </p>
          <h1 class="mt-2 text-3xl sm:text-5xl font-bold leading-tight text-white">
            Mencetak <span class="text-blue-200">berilmu</span>, <span class="text-emerald-200">beradab</span>, dan <span class="text-blue-200">mandiri</span>
          </h1>
          <p class="mt-2 text-blue-100 max-w-3xl">
            Berlandaskan Al-Qur’ān dan Sunnah, mengintegrasikan diniyah, akademik, dan keterampilan abad 21.
          </p>
          <div class="mt-5 flex flex-wrap gap-2">
            <NuxtLink to="#sambutan" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700">
              Lihat Sambutan
            </NuxtLink>
            <NuxtLink to="#struktur" class="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 backdrop-blur px-4 py-2.5 text-sm font-medium text-white hover:bg-white/20">
              Struktur Organisasi
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div class="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
      <div class="grid lg:grid-cols-12 gap-8 items-start">

        <div class="lg:col-span-7 space-y-10">

          <section id="sambutan" class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-6">
            <div class="flex items-start gap-5">
              <img src="/assets/images/kyai.jpg" alt="Pengasuh" class="w-24 h-24 rounded-2xl object-cover border-4 border-blue-600/70 shadow" />
              <div class="min-w-0">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Sambutan Pengasuh</h2>
                <p class="mt-2 text-gray-600 dark:text-neutral-300 leading-relaxed">
                  Alhamdulillāh, Pondok Pesantren Alberr berkomitmen melahirkan santri yang mendalam ilmunya,
                  kokoh akhlaknya, dan tangguh menghadapi tantangan zaman. Melalui disiplin, adab, dan ikhtiar berkelanjutan,
                  kami berharap para santri menjadi pribadi yang bermanfaat bagi umat.
                </p>
                <p class="mt-3 text-sm text-gray-500 dark:text-neutral-400">— KH. Izud</p>
              </div>
            </div>
          </section>

          <section id="visi-misi" class="grid md:grid-cols-3 gap-4">
            <div class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Visi</h3>
              <p class="mt-2 text-gray-600 dark:text-neutral-300">{{ visi }}</p>
            </div>
            <div class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-6 md:col-span-2">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Misi</h3>
              <ul class="mt-2 space-y-2 list-disc list-inside text-gray-600 dark:text-neutral-300">
                <li v-for="(m,i) in misi" :key="i">{{ m }}</li>
              </ul>
            </div>
            <div class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-6 md:col-span-3">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Motto</h3>
              <p class="mt-1 italic text-blue-600 dark:text-blue-400 font-semibold">“{{ motto }}”</p>
            </div>
          </section>

          <section id="materi" class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-6">
            <div class="flex items-center justify-between gap-3 mb-3">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Materi yang Dipelajari</h3>
              <span class="text-xs text-gray-500 dark:text-neutral-400">{{ materi.length }} topik</span>
            </div>
            <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div v-for="m in materi" :key="m" class="group rounded-xl border border-gray-200 dark:border-neutral-700 p-4 bg-white/70 dark:bg-neutral-800/60 hover:shadow transition">
                <ClientOnly><Icon icon="ph:book-open" class="size-6 text-blue-600 dark:text-blue-400" /></ClientOnly>
                <p class="mt-2 text-sm text-gray-700 dark:text-neutral-300">{{ m }}</p>
              </div>
            </div>
          </section>

          <section id="kitab" class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-6">
            <div class="flex items-center justify-between gap-3 mb-3">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Kitab yang Dipelajari</h3>
              <span class="text-xs text-gray-500 dark:text-neutral-400">{{ kitab.length }} kitab</span>
            </div>
            <ul class="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              <li v-for="k in kitab" :key="k" class="rounded-xl border border-gray-200 dark:border-neutral-700 p-4 bg-white/70 dark:bg-neutral-800/60 hover:shadow transition">
                <ClientOnly><Icon icon="ph:scroll" class="mr-2 text-blue-600 dark:text-blue-400 inline-block" /></ClientOnly>
                <span class="text-sm text-gray-700 dark:text-neutral-300">{{ k }}</span>
              </li>
            </ul>
          </section>

        </div>

        <div class="lg:col-span-5 space-y-10">
          <section id="struktur" class="rounded-3xl overflow-hidden border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 shadow-lg will-change-transform" ref="cardTilt">
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Struktur Organisasi</h3>
              <p class="text-xs text-gray-500 dark:text-neutral-400">Pengasuh, pembina, dan pengelola kependidikan</p>
              <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div v-for="s in struktur" :key="s.jabatan" class="group p-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 hover:shadow transition">
                  <img :src="s.img" alt="" class="w-16 h-16 rounded-xl object-cover border-2 border-blue-600/70 mx-auto" />
                  <p class="mt-3 text-sm font-semibold text-gray-900 dark:text-white text-center truncate">{{ s.nama }}</p>
                  <p class="text-[11px] text-blue-600 dark:text-blue-400 text-center">{{ s.jabatan }}</p>
                </div>
              </div>
            </div>
          </section>

          <section id="tingkatan" class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Tingkatan Pendidikan</h3>
            <div class="grid sm:grid-cols-2 gap-3">
              <div v-for="t in tingkatan" :key="t.title" class="rounded-xl border border-gray-200 dark:border-neutral-700 p-4 bg-white/70 dark:bg-neutral-800/60 hover:shadow transition">
                <ClientOnly><Icon :icon="t.icon" class="size-6 text-blue-600 dark:text-blue-400" /></ClientOnly>
                <h4 class="mt-2 font-semibold text-gray-900 dark:text-white">{{ t.title }}</h4>
                <p class="text-sm text-gray-600 dark:text-neutral-400 mt-1">{{ t.desc }}</p>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'

const visi = 'Mencetak generasi berilmu, berakhlak karimah, dan berdaya saing global berlandaskan Al-Qur’ān dan Sunnah.'
const motto = 'Berilmu • Beradab • Mandiri'

const misi = [
  'Penguatan ilmu diniyah & adab santri',
  'Integrasi akademik modern & evaluasi terstandar',
  'Pembinaan karakter & kepemimpinan',
  'Literasi digital, komunikasi, dan kolaborasi',
  'Khidmah sosial & kemitraan alumni'
]

const struktur = [
  { nama: 'KH. Izud', jabatan: 'Pengasuh', img: '/assets/images/kyai.jpg' },
//   { nama: 'Ust. Ali', jabatan: 'Kepala Madrasah', img: '/assets/images/ust-ali.jpg' },
//   { nama: 'Ustadzah Fatimah', jabatan: 'Kepala Asrama Putri', img: '/assets/images/ust-fatimah.jpg' },
//   { nama: 'Ust. Hasan', jabatan: 'Koordinator Tahfidz', img: '/assets/images/ust-hasan.jpg' },
//   { nama: 'Ust. Raka', jabatan: 'Pembina Pramuka', img: '/assets/images/ust-raka.jpg' },
//   { nama: 'Ust. Zain', jabatan: 'Kepala Kesiswaan', img: '/assets/images/ust-zain.jpg' }
]

const route = useRoute()
const config = useRuntimeConfig()

const url = computed(() => new URL(route.fullPath || '/', config.public.siteUrl).toString())
const title = 'Ponpes Alberr | Pesantren Inovatif & Informatif'
const description = 'Selamat datang di Ponpes Alberr Pandaan: KMI/Diniyah, Tahfidz, MTs/MA, kegiatan santri, dan PPDB online.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogUrl: url.value,
  ogImage: '/assets/logo.png',           // siapkan file OG image
  twitterCard: 'summary_large_image',
  twitterSite: config.public.twitterSite || undefined,
  themeColor: '#0ea5e9',
  robots: 'index, follow'
})

useHead({
  link: [{ rel: 'canonical', href: url.value }],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: config.public.siteName,
        url: config.public.siteUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${config.public.siteUrl}/search?q={query}`,
          'query-input': 'required name=query'
        }
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Pondok Pesantren Alberr',
        url: config.public.siteUrl,
        logo: `${config.public.siteUrl}/assets/logo.png`,
        sameAs: [
          'https://facebook.com/alberr',
          'https://instagram.com/alberr'
        ]
      })
    }
  ]
})


const materi = [
  'Tahfidz & Tahsin Al-Qur’ān',
  'Fiqih, Aqidah, Akhlak',
  'Nahwu & Sharaf',
  'Tafsir & Hadits',
  'Bahasa Arab & Inggris',
  'Sains & Matematika',
  'Kepemimpinan & Organisasi',
  'Kewirausahaan & Keterampilan'
]

const kitab = [
  'Al-Jurumiyah', 'Imrithi', 'Alfiyah Ibnu Malik',
  'Fathul Qarib', 'Bulughul Maram', 'Tafsir Jalalain',
  'Riyadhus Shalihin', 'Ushul Tsalatsah'
]

const tingkatan = [
  { title: 'Ibtidaiyah', desc: 'Dasar (setara SD/MI): fokus adab, tahsin, pondasi diniyah', icon: 'ph:book' },
  { title: 'Tsanawiyah', desc: 'Menengah (SMP/MTs): integrasi diniyah-akademik & bahasa', icon: 'ph:chalkboard' },
  { title: 'Aliyah', desc: 'Lanjutan (SMA/MA): pendalaman kitab, sains & leadership', icon: 'ph:graduation-cap' },
  { title: 'Ma’had Aly', desc: 'Tingkat lanjut: kajian kitab mendalam & riset', icon: 'ph:university' }
]

const wrapEl = ref<HTMLElement | null>(null)
const bg1 = ref<HTMLElement | null>(null)
const bg2 = ref<HTMLElement | null>(null)
const cardTilt = ref<HTMLElement | null>(null)

let raf = 0
let mx = 0, my = 0, sy = 0

function loop() {
  const dx = (mx - 0.5)
  const dy = (my - 0.5)
  if (bg1.value) bg1.value.style.transform = `translate3d(${dx * -20}px, ${dy * -20}px, 0) scale(1.06)`
  if (bg2.value) bg2.value.style.transform = `translate3d(${dx * 16}px, ${dy * 16}px, 0) scale(1.04)`
  if (cardTilt.value) {
    const tiltX = dy * 2.5
    const tiltY = dx * -2.5
    cardTilt.value.style.transform = `translateY(${sy * -0.04}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
  }
  raf = requestAnimationFrame(loop)
}

function onMouse(e: MouseEvent) {
  const rect = (wrapEl.value as HTMLElement).getBoundingClientRect()
  mx = (e.clientX - rect.left) / rect.width
  my = (e.clientY - rect.top) / rect.height
}
function onScroll() { sy = window.scrollY || 0 }

onMounted(() => {
  window.addEventListener('mousemove', onMouse, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  loop()
})
onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouse)
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(raf)
})
</script>

<style scoped>
#profile [ref="cardTilt"] { transform-style: preserve-3d; transition: transform 120ms ease-out; }
</style>
