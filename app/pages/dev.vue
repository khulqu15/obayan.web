<template>
  <main class="relative overflow-hidden pt-32 pb-24 dark:bg-neutral-950 bg-gray-50">
    <!-- Top glow -->
    <div class="absolute w-full bg-gradient-to-b from-emerald-600/40 to-emerald-600/0 top-0 left-0 h-[22vh]"></div>
    <!-- Ornaments -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div class="absolute -top-32 -left-32 w-[46rem] h-[46rem] rounded-full opacity-25 blur-3xl bg-gradient-to-br from-emerald-200 to-blue-200 dark:from-emerald-900/40 dark:to-blue-900/40"></div>
      <div class="absolute -bottom-40 -right-24 w-[40rem] h-[40rem] rounded-full opacity-20 blur-3xl bg-gradient-to-tr from-blue-100 to-emerald-100 dark:from-blue-900/30 dark:to-emerald-900/30"></div>
    </div>

    <section class="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Header -->
      <header class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <p class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            <ClientOnly><Icon icon="ph:code" class="size-4" /></ClientOnly>
            Tim Pengembang
          </p>
          <h1 class="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight">
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">
              Pengembang & Owner Obayan
            </span>
          </h1>
          <p class="mt-3 max-w-2xl text-gray-700 dark:text-neutral-300">
            Dibangun dan dimiliki oleh
            <span class="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-600">{{ team.display }}</span>
            — fokus pada performa, aksesibilitas, dan pengalaman pengguna.
          </p>
          <div class="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-neutral-200">
            <ClientOnly><Icon icon="ph:rocket-launch" class="size-4 text-emerald-600" /></ClientOnly>
            {{ team.tagline }}
          </div>
        </div>

        <div class="flex items-center gap-2">
          <a :href="team.url" target="_blank" rel="noopener" class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-emerald-700 transition">
            <ClientOnly><Icon icon="ph:link-simple" class="size-4" /></ClientOnly>
            {{ team.display }}
          </a>
          <a href="/" class="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800 transition">
            <ClientOnly><Icon icon="ph:house-line" class="size-4" /></ClientOnly>
            Beranda
          </a>
        </div>
      </header>

      <!-- List Developers -->
      <div class="mt-10 grid gap-6 md:grid-cols-2">
        <article
          v-for="dev in developers"
          :key="dev.name"
          class="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 backdrop-blur shadow hover:shadow-lg transition"
        >
          <div
            class="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
            :class="dev.owner ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'"
          >
            <ClientOnly><Icon :icon="dev.owner ? 'ph:crown-simple' : 'ph:seal-check'" class="size-3.5" /></ClientOnly>
            {{ dev.owner ? 'Owner' : team.short }}
          </div>

          <div class="p-6 sm:p-7">
            <div class="flex flex-wrap items-start gap-5">
              <img :src="dev.avatar" :alt="`Foto ${dev.name}`" class="size-20 rounded-xl object-cover ring-2 ring-white/80 dark:ring-neutral-800 shadow-sm" />
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white truncate">{{ dev.name }}</h2>
                  <span class="inline-flex items-center gap-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 text-xs font-medium">
                    <ClientOnly><Icon icon="ph:user-focus" class="size-3.5" /></ClientOnly>
                    {{ dev.role }}
                  </span>
                </div>
                <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400 truncate">{{ dev.location }}</p>
                <p class="mt-3 text-gray-700 dark:text-neutral-300">{{ dev.bio }}</p>

                <div class="mt-4 flex flex-wrap items-center gap-2">
                  <a
                    v-for="s in dev.social"
                    :key="s.label"
                    :href="s.href"
                    target="_blank" rel="noopener"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/70 px-2.5 py-1.5 text-[12px] font-medium text-gray-800 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
                  >
                    <ClientOnly><Icon :icon="s.icon" class="size-4" /></ClientOnly>
                    {{ s.label }}
                  </a>
                  <a :href="`mailto:${dev.email}`" class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/70 px-2.5 py-1.5 text-[12px] font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 dark:text-neutral-100 transition">
                    <ClientOnly><Icon icon="ph:envelope-simple" class="size-4 text-emerald-600" /></ClientOnly>
                    Email
                  </a>
                  <a :href="`https://wa.me/${dev.whatsapp}`" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/70 px-2.5 py-1.5 text-[12px] font-medium hover:bg-gray-50 dark:text-neutral-100 dark:hover:bg-neutral-800 transition">
                    <ClientOnly><Icon icon="ph:whatsapp-logo" class="size-4 text-emerald-600" /></ClientOnly>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <!-- Skills -->
            <div class="mt-6">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Keahlian Utama</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in dev.skills"
                  :key="tag"
                  class="inline-flex items-center rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/80 px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-neutral-200"
                >
                  <ClientOnly><Icon icon="ph:sparkle" class="me-1 size-3.5 text-amber-500" /></ClientOnly>
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Tools -->
            <div class="mt-4">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Tools</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tool in dev.tools"
                  :key="tool"
                  class="inline-flex items-center rounded-lg bg-white dark:bg-neutral-900 px-2.5 py-1 text-xs border border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-neutral-200"
                >
                  <ClientOnly><Icon icon="ph:wrench" class="me-1 size-3.5 text-emerald-600" /></ClientOnly>
                  {{ tool }}
                </span>
              </div>
            </div>

            <!-- Projects -->
            <div class="mt-6 grid gap-3">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Kontribusi & Proyek</h3>
              <div class="grid sm:grid-cols-2 gap-3">
                <a
                  v-for="p in dev.projects"
                  :key="p.title"
                  :href="p.href || '#'"
                  target="_blank" rel="noopener"
                  class="group/card block rounded-xl border border-gray-200 dark:border-neutral-800 bg-gradient-to-br from-white to-gray-50 dark:from-neutral-900/60 dark:to-neutral-900/20 p-4 hover:shadow transition"
                >
                  <div class="flex items-start gap-3">
                    <div class="rounded-lg bg-emerald-50 dark:bg-emerald-900/30 p-2">
                      <ClientOnly><Icon :icon="p.icon" class="size-5 text-emerald-600 dark:text-emerald-400" /></ClientOnly>
                    </div>
                    <div class="min-w-0">
                      <p class="font-medium text-gray-900 dark:text-white truncate">{{ p.title }}</p>
                      <p class="text-[12px] text-gray-500 dark:text-neutral-400 line-clamp-2">{{ p.desc }}</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- CTA Footer -->
      <div class="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Ada ide atau masukan untuk Obayan?</h4>
          <p class="text-sm text-gray-700 dark:text-neutral-300">Kami ({{ team.display }}) terbuka untuk kolaborasi & perbaikan berkelanjutan.</p>
        </div>
        <a href="https://sencra.io" target="_blank" rel="noopener" class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-emerald-700 transition">
          <ClientOnly><Icon icon="ph:paper-plane-tilt" class="size-4" /></ClientOnly>
          Hubungi Kami
        </a>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute, useRuntimeConfig, useSeoMeta, useHead } from '#imports'

/** ===== Team/Owner: Obayan ===== */
const team = {
  name: 'Obayan',
  display: 'Obayan',
  short: 'Obayan',
  url: '#contact',
  tagline: 'Pemilik & Pengembang Obayan'
}

/** ===== SEO ===== */
const route = useRoute()
const config = useRuntimeConfig()
const canonical = computed(() =>
  new URL(route.fullPath || '/developers', (config.public.siteUrl || 'https://alberr.sch.id')).toString()
)
const pageTitle = `Tim Pengembang & Owner: ${team.display}`
const pageDesc  = `Profil developer & pemilik Obayan: Mohammad Khusnul Khuluq (Founder) & Muhammad Fadli Robby (Co-founder).`

useSeoMeta({
  title: pageTitle,
  description: pageDesc,
  ogTitle: pageTitle,
  ogDescription: pageDesc,
  ogType: 'website',
  ogUrl: canonical.value,
  ogImage: '/og/developers.jpg',
  twitterCard: 'summary_large_image',
  themeColor: '#10b981', // emerald
  robots: 'index, follow'
})

useHead({
  link: [{ rel: 'canonical', href: canonical.value }],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify([
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: team.display,
          url: team.url
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Mohammad Khusnul Khuluq',
          jobTitle: 'Founder & Fullstack Engineer (Owner Obayan)',
          memberOf: { '@type': 'Organization', name: team.display, url: team.url }
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Muhammad Fadli Robby',
          jobTitle: 'Co-founder, 3D Designer & Marketing',
          memberOf: { '@type': 'Organization', name: team.display, url: team.url }
        }
      ])
    }
  ]
})

/** ===== Types ===== */
type Social = { label: string; icon: string; href: string }
type Project = { title: string; desc: string; icon: string; href?: string }

/** ===== Data: Owner & Co-founder ===== */
const developers = [
  {
    owner: true,
    name: 'Mohammad Khusnul Khuluq',
    role: 'Founder & Fullstack Engineer',
    location: 'Purwosari, Pasuruan, Jawa Timur',
    email: 'ninno@hayago.id',
    whatsapp: '62895396004952',
    avatar: '/assets/images/devs/khuluq.png',
    bio: 'Mendesain arsitektur Obayan end-to-end: front-end Nuxt 3, API Node/Express, database PostgreSQL, integrasi ToriID, dan pipeline AI/IoT.',
    social: [
      { label: 'GitHub', icon: 'mdi:github',   href: 'https://github.com/khulqu15' },
      { label: 'LinkedIn', icon: 'mdi:linkedin', href: 'https://www.linkedin.com/in/mohammad-khusnul-khuluq-53b2051b5/' }
    ] as Social[],
    skills: ['Nuxt 3', 'Vue 3', 'TypeScript', 'Node.js/Express', 'PostgreSQL', 'Redis', 'MQTT/REST', 'ESP-IDF', 'Python (AI/ML)'],
    tools: ['Vite', 'Docker', 'Prisma', 'Pinia', 'Cloudflare', 'Vercel', 'GitHub Actions', 'ESP32'],
    projects: [
      { title: 'SIAKAD Obayan',         icon: 'ph:student',      desc: 'Manajemen santri, kelas, nilai & rapor adaptif.' },
      { title: 'Pembayaran (QRIS/VA)',  icon: 'ph:bank',         desc: 'Tagihan, cicilan, beasiswa & rekonsiliasi realtime.' },
      { title: 'Absensi ToriID',        icon: 'ri:rfid-fill',    desc: 'Integrasi RFID/Fingerprint, multi-device, audit log.' },
      { title: 'Website Profil Ponpes', icon: 'ph:globe',        desc: 'SEO-ready, blog/berita, formulir kontak terintegrasi.' }
    ] as Project[]
  },
  {
    owner: false,
    name: 'Muhammad Fadli Robby',
    role: 'Co-founder — 3D Designer & Marketing',
    location: 'Purwosari, Pasuruan, Jawa Timur',
    email: 'fadlirobb48@gmail.com',
    whatsapp: '6285606378992',
    avatar: '/assets/images/devs/robby.png',
    bio: 'Menggarap visual 3D, materi kampanye, serta aktivasi pemasaran untuk memperkuat brand Obayan.',
    social: [
      { label: 'Portfolio', icon: 'mdi:palette',  href: 'https://behance.net/fadlirob' },
      { label: 'LinkedIn',  icon: 'mdi:linkedin', href: 'https://www.linkedin.com/in/fadlirob' }
    ] as Social[],
    skills: ['3D Modeling', 'Rendering', 'Brand Campaign', 'Content Strategy', 'UI/Visual'],
    tools:  ['Blender', 'Three.js', 'Photoshop', 'Illustrator'],
    projects: [
      { title: 'Mockup 3D Perangkat',  icon: 'ph:cube',        desc: 'Ambient render perangkat & fasilitas untuk landing page.' },
      { title: 'Campaign PPDB',        icon: 'ph:megaphone',   desc: 'Promosi multi-channel & konten sosial terjadwal.' },
      { title: 'Branding Merchandise', icon: 'ph:t-shirt',     desc: 'Desain media promosi & merchandise.' },
      { title: 'Video Animasi',        icon: 'ph:film-strip',  desc: 'Motion graphic & 3D untuk promosi digital.' }
    ] as Project[]
  }
]
</script>
