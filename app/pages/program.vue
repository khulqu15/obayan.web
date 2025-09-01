<template>
  <section id="program" class="relative overflow-hidden dark:bg-neutral-900 bg-gray-100">
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div class="absolute top-10 -left-24 w-[42rem] h-[42rem] rounded-full opacity-40 blur-3xl
                  bg-gradient-to-br from-blue-200 to-blue-200 dark:from-blue-900/40 dark:to-blue-900/30" />
      <div class="absolute bottom-10 -right-24 w-[36rem] h-[36rem] rounded-full opacity-30 blur-3xl
                  bg-gradient-to-tr from-blue-100 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/30" />
      <div class="absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent_80%)]">
        <div class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,0,0,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,.06)_1px,transparent_1px)] bg-[size:32px_32px]
                    dark:bg-[linear-gradient(to_right,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.06)_1px,transparent_1px)]" />
      </div>
    </div>

    <div class="relative">
      <div class="absolute inset-0">
        <img src="/assets/images/activity2.jpg" class="w-full h-[40vh] sm:h-[52vh] object-cover opacity-80" alt="Pelajari Program">
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
      </div>
      <div class="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 h-[40vh] sm:h-[52vh] flex items-end">
        <div class="mb-10">
          <p class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-blue-200">
            <span class="inline-block size-2 rounded-full bg-blue-400" /> Pondok Pesantren Alberr
          </p>
          <h1 class="mt-1 text-3xl sm:text-5xl font-bold text-white">Pelajari Program</h1>
          <p class="mt-2 text-blue-100 max-w-3xl">
            Integrasi diniyah–akademik–karakter: kurikulum terpadu, tahfidz bertarget, bahasa asing, kepemimpinan, hingga kewirausahaan.
          </p>
          <div class="mt-5 flex flex-wrap gap-2">
            <NuxtLink to="#ringkas" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700">Ringkasan</NuxtLink>
            <NuxtLink to="#kurikulum" class="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 backdrop-blur px-4 py-2.5 text-sm font-medium text-white hover:bg-white/20">Kurikulum</NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div class="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">

      <section id="ringkas" class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="s in stats" :key="s.label" class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-5">
          <div class="flex items-center gap-3">
            <ClientOnly><Icon :icon="s.icon" class="size-7 text-blue-600" /></ClientOnly>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white leading-none">{{ s.value }}</p>
              <p class="text-[12px] text-gray-500 dark:text-neutral-400">{{ s.label }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FILTER -->
      <section class="mt-8 rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-4">
        <div class="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div class="flex items-center gap-2">
            <label class="text-xs text-gray-600 dark:text-neutral-300">Jenjang</label>
            <select v-model="level"
                    class="rounded-lg border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-100 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500">
              <option v-for="l in levels" :key="l" :value="l">{{ l }}</option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <label class="text-xs text-gray-600 dark:text-neutral-300">Kategori</label>
            <select v-model="category"
                    class="rounded-lg border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-100 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">Semua</option>
              <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <div class="flex-1">
            <input v-model="q" type="text" placeholder="Cari program (judul/keyword)…"
                   class="w-full rounded-lg border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-100 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600">
          </div>
        </div>
      </section>

      <!-- GRID PROGRAM -->
      <section class="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        <article v-for="p in filteredPrograms" :key="p.id"
                 class="group relative rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 hover:shadow transition">
          <div class="relative h-44 overflow-hidden">
            <img :src="p.cover" :alt="p.title" class="w-full h-full object-cover group-hover:scale-[1.02] transition" />
            <div class="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/50 text-white px-2 py-0.5 text-[11px]">
              {{ p.level }} • {{ p.category }}
            </div>
          </div>
          <div class="p-5">
            <h3 class="font-semibold text-gray-900 dark:text-white">{{ p.title }}</h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-neutral-300 line-clamp-3">{{ p.desc }}</p>
            <div class="mt-3 flex items-center justify-between text-[12px] text-gray-500 dark:text-neutral-400">
              <div class="flex items-center gap-2">
                <ClientOnly><Icon icon="ph:clock" class="size-4" /></ClientOnly>
                <span>{{ p.intensity }}</span>
              </div>
              <NuxtLink :to="`#kurikulum`" class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700">
                Lihat Kurikulum
                <ClientOnly><Icon icon="ph:arrow-right" class="size-4" /></ClientOnly>
              </NuxtLink>
            </div>
          </div>
        </article>
      </section>

      <!-- KURIKULUM PER JENJANG (Accordion Preline-style) -->
      <section id="kurikulum" class="mt-10">
        <div class="text-center mb-6">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Kurikulum Inti per Jenjang</h2>
            <p class="mt-2 text-gray-600 dark:text-neutral-300">Ringkasan materi utama & kitab yang dipelajari.</p>
        </div>

        <div class="space-y-3">
            <div v-for="(k, i) in curriculum" :key="k.level" 
                class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60">
            <button type="button"
                    class="w-full text-left px-5 py-4 flex items-center justify-between"
                    @click="toggleCurriculum(i)">
                <div class="flex items-center gap-3">
                <ClientOnly><Icon :icon="k.icon" class="size-6 text-blue-600" /></ClientOnly>
                <div>
                    <p class="font-semibold text-gray-900 dark:text-white">{{ k.level }}</p>
                    <p class="text-[12px] text-gray-500 dark:text-neutral-400">{{ k.subtitle }}</p>
                </div>
                </div>
                <ClientOnly>
                <Icon icon="ph:caret-down" class="size-4 text-gray-500 transition-transform" :class="curriculumClass(i)" />
                </ClientOnly>
            </button>

            <div v-show="openCurriculum === i" class="px-5 pb-5">
                <div class="grid md:grid-cols-2 gap-4">
                <div class="rounded-xl border border-gray-200 dark:border-neutral-700 p-4">
                    <h4 class="font-semibold text-gray-900 dark:text-white">Materi Utama</h4>
                    <ul class="mt-2 text-sm text-gray-700 dark:text-neutral-300 list-disc list-inside space-y-1">
                    <li v-for="m in k.subjects" :key="m">{{ m }}</li>
                    </ul>
                </div>
                <div class="rounded-xl border border-gray-200 dark:border-neutral-700 p-4">
                    <h4 class="font-semibold text-gray-900 dark:text-white">Kitab</h4>
                    <ul class="mt-2 text-sm text-gray-700 dark:text-neutral-300 list-disc list-inside space-y-1">
                    <li v-for="b in k.books" :key="b">{{ b }}</li>
                    </ul>
                </div>
                </div>
            </div>
            </div>
        </div>
    </section>

      <!-- TIMETABLE HARIAN -->
      <section class="mt-10 rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-6">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Contoh Jadwal Harian</h3>
        <div class="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div v-for="s in schedule" :key="s.time" class="rounded-xl border border-gray-200 dark:border-neutral-700 p-4">
            <p class="text-xs text-gray-500 dark:text-neutral-400">{{ s.time }}</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ s.title }}</p>
            <p class="text-sm text-gray-600 dark:text-neutral-300">{{ s.note }}</p>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="mt-10">
        <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Pertanyaan Umum</h2>
        </div>
        <div class="space-y-3">
            <div v-for="(f,i) in faqs" :key="i" 
                class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60">
            <button type="button" 
                    class="w-full text-left px-5 py-4 flex items-center justify-between"
                    @click="toggleFaq(i)">
                <span class="font-medium text-gray-900 dark:text-white">{{ f.q }}</span>
                <ClientOnly>
                <Icon icon="ph:caret-down" class="size-4 text-gray-500 transition-transform" :class="openFAQClass(i)" />
                </ClientOnly>
            </button>
            <div v-show="openFaq === i" class="px-5 pb-4">
                <p class="text-sm text-gray-600 dark:text-neutral-300">{{ f.a }}</p>
            </div>
            </div>
        </div>
    </section>

      <section class="mt-10 text-center">
        <div class="rounded-3xl bg-blue-600 text-white px-6 py-10">
          <h3 class="text-2xl font-bold">Siap bergabung dengan program AlBerr?</h3>
          <p class="mt-1 text-blue-100">Daftar PPDB Online tahun ajaran berjalan.</p>
          <NuxtLink to="#" class="inline-flex mt-5 items-center gap-2 bg-white text-blue-600 font-medium px-5 py-3 rounded-lg shadow hover:bg-gray-100">
            Daftar Sekarang
          </NuxtLink>
        </div>
      </section>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

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


const stats = [
  { label: 'Target Hafalan', value: '5–15 Juz', icon: 'ph:book-open-text' },
  { label: 'Bahasa Asing', value: 'Arab & Inggris', icon: 'ph:translate' },
  { label: 'Ekstrakurikuler', value: '10+ Klub', icon: 'ph:medal-military' },
  { label: 'Jenjang', value: 'SMP–SMA', icon: 'ph:student' }
]

const levels = ['SMP', 'SMA']
const categories = ['Tahfidz', 'Bahasa', 'Kepemimpinan', 'Akademik', 'Keterampilan']

const level = ref('SMP')
const category = ref('')
const q = ref('')




const programs = ref([
  {
    id: 1,
    title: 'Program Tahfidz Intensif',
    level: 'SMP',
    category: 'Tahfidz',
    desc: 'Target 5–10 juz selama 3 tahun dengan metode murajaah dan talaqqi.',
    intensity: '2 jam/hari',
    cover: '/assets/images/gallery/1.jpg'
  },
  {
    id: 2,
    title: 'Bahasa Arab & Inggris',
    level: 'SMA',
    category: 'Bahasa',
    desc: 'Pembiasaan harian, percakapan, debat, dan karya tulis berbahasa asing.',
    intensity: '90 menit/hari',
    cover: '/assets/images/gallery/2.jpg'
  },
  {
    id: 3,
    title: 'Kepemimpinan & Organisasi',
    level: 'SMA',
    category: 'Kepemimpinan',
    desc: 'Pelatihan organisasi santri, manajemen acara, dan public speaking.',
    intensity: 'Ekstra mingguan',
    cover: '/assets/images/gallery/3.jpg'
  },
  {
    id: 4,
    title: 'Akademik Terpadu',
    level: 'SMP',
    category: 'Akademik',
    desc: 'Mengintegrasikan kurikulum nasional dengan diniyah salaf–modern.',
    intensity: 'Full day',
    cover: '/assets/images/gallery/4.jpg'
  },
  {
    id: 5,
    title: 'Kewirausahaan & Keterampilan',
    level: 'SMA',
    category: 'Keterampilan',
    desc: 'Program keterampilan praktis: pertanian, IT, multimedia, kewirausahaan.',
    intensity: 'Ekstra mingguan',
    cover: '/assets/images/gallery/6.jpg'
  }
])

const openCurriculum = ref<number|null>(null)
const openFaq = ref<number|null>(null)

function toggleCurriculum(i: number) {
  openCurriculum.value = openCurriculum.value === i ? null : i
}

function toggleFaq(i: number) {
  openFaq.value = openFaq.value === i ? null : i
}

/* Filtered programs */
const filteredPrograms = computed(() => {
  return programs.value.filter(p => {
    const matchLevel = !level.value || p.level === level.value
    const matchCat = !category.value || p.category === category.value
    const matchQ = !q.value || p.title.toLowerCase().includes(q.value.toLowerCase())
    return matchLevel && matchCat && matchQ
  })
})

function curriculumClass(index: number) {
  if(openCurriculum.value == index) return 'rotate-180'
  else return ''
}

function openFAQClass(index: number) {
  if(openFaq.value == index) return 'rotate-180' 
  else return ''
}

/* Kurikulum per jenjang */
const curriculum = [
  {
    level: 'SMP',
    subtitle: 'Fokus pembentukan dasar diniyah & akademik',
    icon: 'ph:student',
    subjects: ['Aqidah Akhlak', 'Fiqih', 'Hadits', 'Bahasa Arab Dasar', 'Matematika & IPA'],
    books: ['Safinatun Najah', 'Taqrib', 'Amtsilati Dasar']
  },
  {
    level: 'SMA',
    subtitle: 'Pendalaman ilmu & persiapan karir',
    icon: 'mingcute:mortarboard-line',
    subjects: ['Ushul Fiqh', 'Tafsir Jalalain', 'Nahwu Shorof', 'Bahasa Inggris & Arab Lanjutan'],
    books: ['Fathul Qarib', 'Alfiyah Ibnu Malik', 'Jalalain']
  }
]

/* Jadwal harian */
const schedule = [
  { time: '03.30', title: 'Qiyamul Lail & Tahajjud', note: 'Shalat malam & doa' },
  { time: '04.30', title: 'Shalat Subuh & Kultum', note: 'Kajian singkat setelah Subuh' },
  { time: '07.00', title: 'KBM Akademik', note: 'Mapel umum + diniyah' },
  { time: '17.00', title: 'Halaqah Tahfidz', note: 'Setoran hafalan & murajaah' },
  { time: '20.00', title: 'Pengajian Kitab Kuning', note: 'Kajian kitab bersama Kyai' },
  { time: '22.00', title: 'Istirahat Malam', note: 'Tidur & persiapan esok hari' }
]

/* FAQ */
const faqs = [
  { q: 'Apakah ada target hafalan?', a: 'Ya, untuk SMP target minimal 5 juz, SMA minimal 10 juz.' },
  { q: 'Bagaimana dengan kurikulum umum?', a: 'Kami mengintegrasikan kurikulum nasional SMP–SMA dengan diniyah.' },
  { q: 'Apakah ada kegiatan ekstrakurikuler?', a: 'Ada lebih dari 10 ekskul seperti pramuka, futsal, kaligrafi, IT, hingga entrepreneurship.' },
  { q: 'Bagaimana fasilitas santri?', a: 'Asrama nyaman, masjid luas, laboratorium komputer, perpustakaan, lapangan olahraga.' }
]
</script>
