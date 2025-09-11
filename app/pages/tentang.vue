<template>
  <div class="text-gray-800 dark:text-neutral-200">
    <!-- HERO: Full-width background -->
    <section
      class="relative w-full overflow-hidden pt-24"
      :style="{
        backgroundImage: `url('${heroImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }"
    >
      <div class="absolute inset-0 bg-black/50"></div>

      <!-- Deco grid & blobs -->
      <div aria-hidden="true" class="pointer-events-none absolute inset-0">
        <div class="absolute -top-28 -left-28 w-[42rem] h-[42rem] rounded-full opacity-30 blur-3xl bg-gradient-to-br from-emerald-400/40 to-cyan-400/30"></div>
        <div class="absolute top-32 -right-24 w-[34rem] h-[34rem] rounded-full opacity-25 blur-3xl bg-gradient-to-tr from-amber-300/40 to-fuchsia-300/30"></div>
        <div class="absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_40%,#000,transparent_70%)]">
          <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        </div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div class="max-w-3xl">
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-white/15 text-white/90 ring-1 ring-white/25">
            <Icon icon="solar:stars-line-duotone" class="size-4" />
            Tentang Kami
          </span>
          <h1 class="mt-4 text-3xl sm:text-5xl font-extrabold leading-tight text-white">
            Obayan by <span class="text-emerald-300">sencra.io</span>
          </h1>
          <p class="mt-3 sm:mt-4 text-white/90">
            Platform terpadu untuk sekolah & pesantren di Indonesia—mengelola akademik, operasional,
            dan keuangan dengan antarmuka yang ramah dan terintegrasi.
          </p>

          <div class="mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
            <a href="#visi-misi" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold bg-emerald-500 text-white hover:bg-emerald-600">
              <Icon icon="lucide:target" class="size-4" /> Visi & Misi
            </a>
            <a href="#careers" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold bg-white/15 text-white hover:bg-white/25 ring-1 ring-white/25">
              <Icon icon="lucide:briefcase" class="size-4" /> Karier di Obayan
            </a>
          </div>

          <p class="mt-3 text-xs text-white/70">
            Dibangun dengan oleh Sencra.io • Terintegrasi penuh antar modul.
          </p>
        </div>
      </div>
    </section>

    <!-- Tentang Perusahaan -->
    <section class="relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div class="grid lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          <div class="lg:col-span-7">
            <h2 class="text-2xl sm:text-3xl font-extrabold">Tentang Obayan</h2>
            <p class="mt-3 text-gray-600 dark:text-neutral-400">
              Obayan adalah ekosistem perangkat lunak pendidikan dari <strong>sencra.io</strong> yang
              menghadirkan SIAKAD, kelas akademik, pembayaran, laporan keuangan, presensi RFID/QR/Face,
              hingga automasi notifikasi. Tujuan kami sederhana: <em>membebaskan pendidik dari pekerjaan
              administratif berulang agar fokus pada pembelajaran</em>.
            </p>
            <ul class="mt-4 grid sm:grid-cols-2 gap-3">
              <li class="flex items-start gap-2">
                <Icon icon="lucide:link" class="size-5 text-emerald-600" />
                <span>Modul saling terhubung—data mengalir tanpa hambatan</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon icon="lucide:sparkles" class="size-5 text-emerald-600" />
                <span>Antarmuka ramah ala aplikasi favorit siswa</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon icon="lucide:shield-check" class="size-5 text-emerald-600" />
                <span>Keamanan & audit bawaan, kontrol akses granular</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon icon="lucide:rocket" class="size-5 text-emerald-600" />
                <span>Implementasi cepat, dukungan onboarding menyeluruh</span>
              </li>
            </ul>
          </div>
          <div class="lg:col-span-5">
            <div class="rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-700">
              <img :src="aboutImage" class="w-full h-64 object-cover" alt="About Obayan" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Visi & Misi -->
    <section id="visi-misi" class="relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14">
        <div class="grid lg:grid-cols-2 gap-6">
          <div class="rounded-2xl border border-gray-200 dark:border-neutral-700 p-6 bg-white/80 dark:bg-neutral-900/70">
            <h3 class="text-xl font-extrabold flex items-center gap-2">
              <Icon icon="lucide:eye" class="size-5" /> Visi
            </h3>
            <p class="mt-2 text-gray-600 dark:text-neutral-400">
              Menjadi platform pendidikan paling dipercaya yang mendorong efisiensi operasional
              dan meningkatkan kualitas pembelajaran di seluruh Indonesia.
            </p>
            <ul class="mt-4 space-y-2">
              <li class="flex items-start gap-2">
                <Icon icon="lucide:check-circle-2" class="size-5 text-emerald-600 mt-[2px]" />
                <span>Terukur, transparan, dan mudah digunakan semua pihak</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon icon="lucide:check-circle-2" class="size-5 text-emerald-600 mt-[2px]" />
                <span>Memberdayakan guru & pengurus dengan otomasi cerdas</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon icon="lucide:check-circle-2" class="size-5 text-emerald-600 mt-[2px]" />
                <span>Terjangkau dan relevan untuk konteks sekolah & pesantren</span>
              </li>
            </ul>
          </div>
          <div class="rounded-2xl border border-gray-200 dark:border-neutral-700 p-6 bg-white/80 dark:bg-neutral-900/70">
            <h3 class="text-xl font-extrabold flex items-center gap-2">
              <Icon icon="lucide:flag" class="size-5" /> Misi
            </h3>
            <ul class="mt-2 space-y-2">
              <li class="flex items-start gap-2">
                <Icon icon="lucide:target" class="size-5 text-emerald-600 mt-[2px]" />
                <span>Menyatukan data akademik, keuangan, dan operasional dalam satu alur</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon icon="lucide:target" class="size-5 text-emerald-600 mt-[2px]" />
                <span>Mengutamakan keamanan, privasi, dan kepatuhan</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon icon="lucide:target" class="size-5 text-emerald-600 mt-[2px]" />
                <span>Mempercepat implementasi melalui template & onboarding</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon icon="lucide:target" class="size-5 text-emerald-600 mt-[2px]" />
                <span>Menghadirkan pengalaman yang menyenangkan bagi pengguna</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Sejarah (Timeline) -->
    <section id="sejarah" class="relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14">
        <div class="rounded-2xl border border-gray-200 dark:border-neutral-700 p-6 bg-white/80 dark:bg-neutral-900/70">
          <h3 class="text-xl font-extrabold flex items-center gap-2">
            <Icon icon="lucide:calendar-range" class="size-5" /> Sejarah Singkat
          </h3>
          <ol class="mt-4 relative border-s-2 border-dashed border-emerald-300 ps-4">
            <li v-for="(t, i) in timeline" :key="i" class="mb-4 ms-2">
              <div class="absolute -left-[9px] mt-1 size-4 rounded-full bg-emerald-600"></div>
              <p class="font-semibold">{{ t.year }} — {{ t.title }}</p>
              <p class="text-sm text-gray-600 dark:text-neutral-400">{{ t.desc }}</p>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <!-- Founders -->
    <section id="founders" class="relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14">
        <h3 class="text-2xl font-extrabold">Founder & Co-Founder</h3>
        <p class="text-gray-600 dark:text-neutral-400">Tim kecil, misi besar—mendorong transformasi digital pendidikan.</p>
        <div class="mt-6 grid md:grid-cols-2 gap-5">
          <div v-for="p in founders" :key="p.name" class="rounded-2xl border border-gray-200 dark:border-neutral-700 overflow-hidden">
            <div class="h-96 w-full bg-gray-100 dark:bg-neutral-800">
              <img :src="p.photo" alt="" class="w-full h-full object-cover" />
            </div>
            <div class="p-5">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-extrabold text-lg">{{ p.name }}</p>
                  <p class="text-sm text-gray-500">{{ p.role }}</p>
                </div>
                <div class="size-10 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  <Icon :icon="p.icon" class="size-5" />
                </div>
              </div>
              <p class="mt-2 text-sm text-gray-600 dark:text-neutral-400">{{ p.bio }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Nilai Perusahaan -->
    <section id="values" class="relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14">
        <h3 class="text-2xl font-extrabold">Nilai yang Kami Pegang</h3>
        <div class="mt-6 grid md:grid-cols-3 gap-4">
          <div v-for="v in values" :key="v.title" class="rounded-2xl p-5 border border-gray-200 bg-white/80 backdrop-blur hover:shadow-md transition dark:bg-neutral-900/70 dark:border-neutral-700">
            <div class="size-10 rounded-xl flex items-center justify-center mb-3" :class="badgeTone(v.tone)">
              <Icon :icon="v.icon" class="size-5" />
            </div>
            <h4 class="font-semibold">{{ v.title }}</h4>
            <p class="mt-1 text-sm text-gray-600 dark:text-neutral-400">{{ v.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Careers -->
    <section id="careers" class="relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div class="rounded-2xl p-6 border border-gray-200 dark:border-neutral-700 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/10 dark:to-cyan-900/10">
          <div class="flex flex-col gap-6">
            <div class="lg:w-full">
              <h3 class="text-2xl font-extrabold">Bergabung dengan Obayan</h3>
              <p class="mt-2 text-gray-600 dark:text-neutral-400">
                Kami mencari orang yang peduli pada pendidikan, teliti pada detail, dan senang
                membuat hal rumit menjadi sederhana. Remote-friendly, jam kerja sehat.
              </p>
              <ul class="mt-4 grid sm:grid-cols-2 gap-3">
                <li class="flex items-start gap-2"><Icon icon="lucide:home" class="size-5 text-emerald-600" /><span>Remote / Hybrid</span></li>
                <li class="flex items-start gap-2"><Icon icon="lucide:rocket" class="size-5 text-emerald-600" /><span>Impact nyata ke ribuan siswa</span></li>
                <li class="flex items-start gap-2"><Icon icon="lucide:heart-handshake" class="size-5 text-emerald-600" /><span>Tim kecil, kolaborasi tinggi</span></li>
                <li class="flex items-start gap-2"><Icon icon="lucide:graduation-cap" class="size-5 text-emerald-600" /><span>Budget belajar & sertifikasi</span></li>
              </ul>
            </div>

            <div class="lg:w-full">
              <div class="grid sm:grid-cols-2 gap-4">
                <article
                  v-for="j in jobs"
                  :key="j.slug"
                  class="rounded-2xl border bg-white/80 dark:bg-neutral-900/70 border-gray-200 dark:border-neutral-700 p-4"
                >
                  <div class="flex items-start gap-3">
                    <div class="size-10 rounded-xl flex items-center justify-center" :class="badgeTone(j.tone)">
                      <Icon :icon="j.icon" class="size-5" />
                    </div>
                    <div class="grow">
                      <p class="font-semibold">{{ j.title }}</p>
                      <p class="text-xs text-gray-500">{{ j.type }} • {{ j.location }}</p>
                      <ul class="mt-2 space-y-1 text-sm text-gray-600 dark:text-neutral-400">
                        <li v-for="(r, i) in j.resp.slice(0,3)" :key="i" class="flex items-start gap-2">
                          <Icon icon="lucide:check" class="size-4 mt-0.5 text-emerald-600" />
                          <span>{{ r }}</span>
                        </li>
                      </ul>
                      <div class="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          class="px-3 py-2 rounded-2xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
                          data-hs-overlay="#apply-modal"
                          @click="prefill(j.title)"
                        >
                          Lamar via WhatsApp
                        </button>
                        <button
                          type="button"
                          class="px-3 py-2 rounded-2xl text-sm font-semibold border border-gray-300 hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                          @click="quickApply(j.title)"
                        >
                          Kirim Cepat
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              <p class="mt-4 text-xs text-gray-500">
                Tidak menemukan posisi yang cocok? Kirimkan profil singkat & portfolio via tombol
                <em>Kirim Cepat</em>—kami senang mengenalmu!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div
      id="apply-modal"
      class="hs-overlay hidden fixed inset-0 z-[80] overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 mt-0 opacity-0 transition-all max-w-xl m-3 sm:mx-auto">
        <div class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-700 shadow-xl">
          <div class="p-5 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
            <h4 class="font-extrabold">Lamar via WhatsApp</h4>
            <button type="button" class="size-9 inline-flex justify-center items-center rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800" data-hs-overlay="#apply-modal" aria-label="Close">
              <Icon icon="lucide:x" class="size-5" />
            </button>
          </div>

          <div class="p-5 space-y-4">
            <div class="grid sm:grid-cols-2 gap-3">
              <div>
                <label class="text-sm font-medium">Nama Lengkap</label>
                <input v-model="form.name" type="text" class="mt-1 w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900" placeholder="Nama Anda" />
              </div>
              <div>
                <label class="text-sm font-medium">Email</label>
                <input v-model="form.email" type="email" class="mt-1 w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900" placeholder="anda@email.com" />
              </div>
            </div>

            <div class="grid sm:grid-cols-2 gap-3">
              <div>
                <label class="text-sm font-medium">Nomor HP</label>
                <input v-model="form.phone" type="tel" class="mt-1 w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900" placeholder="08xxxxxxxxxx" />
              </div>
              <div>
                <label class="text-sm font-medium">Posisi Dilamar</label>
                <select v-model="form.role" class="mt-1 w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900">
                  <option disabled value="">Pilih posisi</option>
                  <option v-for="j in jobs" :key="j.slug" :value="j.title">{{ j.title }}</option>
                  <option value="Posisi Lain">Posisi Lain</option>
                </select>
              </div>
            </div>

            <div>
              <label class="text-sm font-medium">Link CV / Portfolio (opsional)</label>
              <input v-model="form.cv" type="url" class="mt-1 w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900" placeholder="https://drive.google.com/..." />
            </div>

            <div>
              <label class="text-sm font-medium">Pesan</label>
              <textarea v-model="form.message" rows="4" class="mt-1 w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900" placeholder="Perkenalkan diri Anda, pengalaman, dan alasan tertarik."></textarea>
            </div>

            <div class="flex items-center justify-between">
              <p class="text-xs text-gray-500">
                Lamaran akan dibuka di WhatsApp: <strong>+{{ WA_NUMBER }}</strong>
              </p>
              <div class="flex items-center gap-2">
                <button type="button" class="px-4 py-2 rounded-xl font-semibold border border-gray-300 hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800" data-hs-overlay="#apply-modal">
                  Batal
                </button>
                <button type="button" class="px-4 py-2 rounded-xl font-semibold bg-emerald-600 text-white hover:bg-emerald-700" @click="submitApplication">
                  Kirim via WhatsApp
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- CTA Footer -->
    <section class="relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div class="rounded-2xl p-6 border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/70">
          <div class="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-5">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-2xl flex items-center justify-center bg-emerald-600 text-white">
                <Icon icon="lucide:wand-2" class="size-5" />
              </div>
              <div>
                <h3 class="font-extrabold text-lg">Siap mengenal Obayan lebih dekat?</h3>
                <p class="text-sm text-gray-600 dark:text-neutral-400">Hubungkan demo singkat—kami tunjukkan alurnya end-to-end.</p>
              </div>
            </div>
            <div class="ms-auto flex items-center gap-2">
              <NuxtLink href="#demo" class="px-4 py-2 rounded-2xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">
                Coba Demo
              </NuxtLink>
              <NuxtLink href="#pricing" class="px-4 py-2 rounded-2xl border border-gray-300 hover:bg-gray-100 text-sm font-semibold dark:border-neutral-700 dark:hover:bg-neutral-800">
                Lihat Harga
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useHead } from '#imports'
import { Icon } from '@iconify/vue'

/** === CONFIG === */
const WA_NUMBER = '62895396004952' // Ganti ke nomor WA tim rekrutmen (tanpa tanda +)

const heroImage = 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
const aboutImage = '/assets/images/cases/0.png'

/** === TIMELINE === */
const timeline = [
  { year: '2022', title: 'Riset & Validasi', desc: 'Eksplorasi kebutuhan sekolah & pesantren terhadap SIAKAD dan alur operasional.' },
  { year: '2023', title: 'Produk Pertama', desc: 'Rilis modul SIAKAD, Kelas Akademik, dan Rapor; pilot di beberapa satuan pendidikan.' },
  { year: '2024', title: 'Integrasi Presensi & Keuangan', desc: 'ToriID (RFID/QR) dan Pembayaran + Laporan Keuangan tersambung mulus.' },
  { year: '2025', title: 'Ekosistem Obayan', desc: 'Ekspansi add-on Autobot, App Wali, dan CMS profil sekolah; fokus reliability & UX.' }
]

/** === FOUNDERS === */
const founders = [
  {
    name: 'Mohammad Khusnul Khuluq',
    role: 'Founder & CEO',
    icon: 'lucide:crown',
    photo: '/assets/images/devs/khuluq.png',
    bio: 'Memimpin arah produk & kolaborasi dengan mitra pendidikan. Fokus pada dampak dan keberlanjutan implementasi.'
  },
  {
    name: 'Muhammad Fadly Robby',
    role: 'Co-Founder & CMO',
    icon: 'lucide:cpu',
    photo: '/assets/images/devs/robby.png',
    bio: 'Memimpin strategi pemasaran & kemitraan. Fokus pada brand, pertumbuhan pengguna, dan go-to-market lintas produk Obayan.'
  }
]

/** === VALUES === */
const values = [
  { title: 'Customer-First', desc: 'Keputusan berangkat dari kebutuhan sekolah & pesantren.', icon: 'lucide:heart', tone: 'emerald' as const },
  { title: 'Reliability', desc: 'Stabil, terukur, dan siap audit.', icon: 'lucide:shield-check', tone: 'blue' as const },
  { title: 'Open Integration', desc: 'Modul & API yang bisa tumbuh bersama.', icon: 'lucide:git-merge', tone: 'amber' as const },
  { title: 'Security by Default', desc: 'RBAC, audit, enkripsi in-transit.', icon: 'lucide:lock', tone: 'violet' as const },
  { title: 'Playful UX', desc: 'Antarmuka yang ringan & menyenangkan.', icon: 'lucide:sparkles', tone: 'emerald' as const },
  { title: 'Impact-Oriented', desc: 'Menghemat waktu staf & meningkatkan pembelajaran.', icon: 'lucide:rocket', tone: 'blue' as const }
]

/** === JOBS === */
type Job = {
  slug: string
  title: string
  type: 'Full-time' | 'Contract' | 'Intern'
  location: string
  icon: string
  tone: 'emerald' | 'blue' | 'amber' | 'violet'
  resp: string[]
}
const jobs: Job[] = [
  {
    slug: 'frontend-nuxt',
    title: 'Frontend Engineer (Nuxt)',
    type: 'Full-time',
    location: 'Remote (ID)',
    icon: 'lucide:layout',
    tone: 'emerald',
    resp: [
      'Membangun UI/UX produktif berbasis Nuxt 3/4 + Tailwind',
      'Integrasi Preline Pro, aksesibilitas & performa',
      'Kolaborasi dengan desain & backend'
    ]
  },
  {
    slug: 'backend-node',
    title: 'Backend Engineer (Node)',
    type: 'Full-time',
    location: 'Remote (ID)',
    icon: 'lucide:server',
    tone: 'blue',
    resp: [
      'Merancang API modular & aman',
      'Optimasi query & observability',
      'Integrasi pembayaran & notifikasi'
    ]
  },
  {
    slug: 'customer-success',
    title: 'Customer Success',
    type: 'Full-time',
    location: 'Remote/Hybrid',
    icon: 'lucide:smile',
    tone: 'amber',
    resp: [
      'Onboarding & pelatihan pengguna',
      'Membuat panduan & SOP implementasi',
      'Menjembatani feedback ke tim produk'
    ]
  },
  {
    slug: 'impl-trainer',
    title: 'Implementasi & Trainer',
    type: 'Contract',
    location: 'On-site / Hybrid',
    icon: 'lucide:graduation-cap',
    tone: 'violet',
    resp: [
      'Setup data awal & migrasi',
      'Menjalankan sesi training modul',
      'Pendampingan go-live di lapangan'
    ]
  },
  {
    slug: 'uiux',
    title: 'UI/UX Designer',
    type: 'Full-time',
    location: 'Remote (ID)',
    icon: 'lucide:pencil-ruler',
    tone: 'emerald',
    resp: [
      'Mendesain flow & komponen sistem',
      'Prototyping & usability testing',
      'Design system konsisten'
    ]
  },
  {
    slug: 'sales-bd',
    title: 'Sales / Business Development',
    type: 'Full-time',
    location: 'Remote/Hybrid',
    icon: 'lucide:megaphone',
    tone: 'amber',
    resp: [
      'Mengelola pipeline & presentasi produk',
      'Kemitraan institusi & yayasan',
      'Negosiasi & closing deal'
    ]
  }
]

/** === FORM STATE (Modal) === */
const form = reactive({
  name: '',
  email: '',
  phone: '',
  role: '',
  cv: '',
  message: ''
})

function prefill(role: string) {
  form.role = role
}

function quickApply(role: string) {
  const text =
    `Halo Obayan,\n\nSaya ingin melamar untuk posisi *${role}*.\n` +
    `Nama: (isi nama)\nEmail: (isi email)\nHP: (isi nomor)\nCV/Portfolio: (tautan)\n\n` +
    `Perkenalan singkat:\n- Pengalaman relevan\n- Alasan tertarik\n\nTerima kasih.`
  openWhatsApp(text)
}

function submitApplication() {
  if (!form.name || !form.role) {
    alert('Nama dan posisi wajib diisi.')
    return
  }
  const text =
    `Halo Obayan,\n\n` +
    `Saya *${form.name}* ingin melamar posisi *${form.role}*.\n\n` +
    `Email: ${form.email || '-'}\n` +
    `HP: ${form.phone || '-'}\n` +
    `CV/Portfolio: ${form.cv || '-'}\n\n` +
    `Pesan:\n${form.message || '-'}\n\n` +
    `Dikirim dari halaman About.`
  openWhatsApp(text)
}

function openWhatsApp(text: string) {
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
}

/** === SEO === */
useHead({
  title: 'Tentang Obayan • Visi, Misi, Sejarah, Tim & Karier',
  meta: [
    {
      name: 'description',
      content: 'Kenali Obayan by sencra.io: visi-misi, sejarah, tim founder, nilai perusahaan, dan peluang karier. Lamar langsung via WhatsApp.'
    }
  ]
})

/** === STYLES HELPERS === */
const badgeTone = (tone: 'emerald' | 'blue' | 'amber' | 'violet') => ({
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  violet: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300'
}[tone])
</script>
