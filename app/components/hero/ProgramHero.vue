<template>
  <section class="relative overflow-hidden dark:bg-neutral-900 bg-gray-100">
    <!-- Latar gradient halus -->
    <div aria-hidden="true" class="absolute inset-0 bg-[radial-gradient(60%_50%_at_10%_60%,rgba(37,99,235,0.08),transparent_70%),radial-gradient(50%_40%_at_90%_20%,rgba(16,185,129,0.1),transparent_60%)]"></div>

    <div class="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14">
      <div class="grid lg:grid-cols-12 gap-10 items-center">

        <div class="lg:col-span-6 space-y-6" id="donate">
          <p class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">
            <ClientOnly><Icon icon="ph:hand-heart" class="size-4" /></ClientOnly>
            Ekosistem Santri Inovatif
          </p>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            Wujudkan <span class="text-emerald-600 dark:text-emerald-400">inovasi</span>,
            <span class="text-blue-600 dark:text-blue-400">nyalakan manfaat di setiap program santri</span>
          </h1>

          <p class="text-gray-600 dark:text-neutral-300 max-w-xl">
            Ekosistem pendidikan, kemandirian, dan pengabdian santri melalui platform digital yang transparan, amanah, dan berkelanjutan. Setiap kontribusi Anda adalah bagian dari perubahan nyata.
          </p>

          <div class="flex flex-wrap gap-3">
            <a href="#"
               class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-5 py-3 text-sm font-medium hover:bg-emerald-700">
              <ClientOnly><Icon icon="mynaui:hand" class="size-4" /></ClientOnly>
              Dukung Sekarang
            </a>
            <a href="/news"
               class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white/80 backdrop-blur px-5 py-3 text-sm font-medium text-gray-800 shadow dark:bg-neutral-800/70 dark:border-neutral-700 dark:text-neutral-100">
              <ClientOnly><Icon icon="icon-park-outline:right" class="size-4" /></ClientOnly>
              Lebih Lanjut
            </a>
          </div>
        </div>

        <div class="lg:col-span-6">
          <div class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 backdrop-blur-sm p-6 shadow-lg">
            <div class="flex items-center justify-between gap-2 mb-4">
              <div class="flex items-center gap-2">
                <ClientOnly><Icon icon="ph:books" class="size-5 text-blue-600 dark:text-blue-400" /></ClientOnly>
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Program Unggulan Pondok</h2>
              </div>
            </div>
            <div class="flex flex-wrap gap-1.5 mb-3">
              <button
                v-for="c in progCategories" :key="c"
                @click="progCat = c"
                class="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
                :class="progCat === c
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700'"
              >
                {{ c }}
              </button>
            </div>

            <div
              v-if="programsFiltered.length"
              class="w-full"
              :data-hs-carousel="JSON.stringify(hsOptions)"
            >
              <div class="relative">
                <div class="hs-carousel relative overflow-hidden w-full min-h-64 rounded-xl">
                  <div class="hs-carousel-body mb-6 absolute top-0 bottom-0 start-0 flex flex-nowrap transition-transform duration-700 opacity-0">
                    <div v-for="p in programsFiltered" :key="p.id" class="hs-carousel-slide">
                      <article class="relative h-full w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-neutral-900 dark:border-neutral-800">
                        <img :src="p.cover" :alt="p.title" class="absolute inset-0 h-full w-full object-cover">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                        <div class="relative h-full p-4 flex flex-col justify-end">
                          <div class="flex items-center gap-2 text-[11px]">
                            <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/10 ring-1 ring-white/20 text-white">
                              <ClientOnly><Icon :icon="p.icon" class="size-3.5" /></ClientOnly>
                              {{ p.category }}
                            </span>
                            <span class="text-white/90">•</span>
                            <span class="text-white/90">{{ p.level }}</span>
                          </div>

                          <h3 class="mt-2 text-white text-lg font-semibold leading-snug line-clamp-2">
                            <a :href="p.href" class="hover:underline">{{ p.title }}</a>
                          </h3>
                          <p class="mt-1 text-white/90 line-clamp-2">{{ p.desc }}</p>

                          <div class="mt-3 flex items-center justify-between">
                            <div class="flex items-center gap-2 text-[11px] text-white/85">
                              <span>{{ p.duration }}</span>
                              <span>•</span>
                              <span>{{ p.schedule }}</span>
                            </div>
                            <a :href="p.href" class="inline-flex items-center gap-1.5 text-[12px] font-medium text-blue-300 hover:text-blue-200">
                              Detail
                              <ClientOnly><Icon icon="ph:arrow-right" class="size-3.5" /></ClientOnly>
                            </a>
                          </div>
                        </div>
                      </article>
                    </div>
                  </div>
                </div>

                <button type="button"
                        class="hs-carousel-prev hs-carousel-disabled:opacity-50 disabled:pointer-events-none absolute inset-y-0 start-0 inline-flex justify-center items-center w-11.5 h-full text-gray-800 hover:bg-gray-800/10 focus:outline-hidden rounded-s-xl dark:text-white dark:hover:bg-white/10">
                  <span class="text-2xl" aria-hidden="true">
                    <svg class="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6"/>
                    </svg>
                  </span>
                  <span class="sr-only">Previous</span>
                </button>
                <button type="button"
                        class="hs-carousel-next hs-carousel-disabled:opacity-50 disabled:pointer-events-none absolute inset-y-0 end-0 inline-flex justify-center items-center w-11.5 h-full text-gray-800 hover:bg-gray-800/10 focus:outline-hidden rounded-e-xl dark:text-white dark:hover:bg-white/10">
                  <span class="sr-only">Next</span>
                  <span class="text-2xl" aria-hidden="true">
                    <svg class="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6"/>
                    </svg>
                  </span>
                </button>

                <div class="hs-carousel-pagination flex justify-center absolute -bottom-3 start-0 end-0 space-x-2"></div>
              </div>
            </div>

            <div v-else class="rounded-lg border border-dashed border-gray-300 dark:border-neutral-700 p-8 text-center">
              <p class="text-sm text-gray-600 dark:text-neutral-300">Belum ada program pada kategori ini.</p>
            </div>

            <div class="mt-6 text-right">
              <a href="#"
                 class="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                Lihat semua program
                <ClientOnly><Icon icon="ph:arrow-right" class="size-4" /></ClientOnly>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

type Program = {
  id: string
  title: string
  desc: string
  href: string
  cover: string
  icon: string
  category: 'Pendidikan' | 'Tahfidz' | 'Ekstrakurikuler' | 'Sosial' | 'Teknologi' | 'Kemandirian'
  level: string
  duration: string
  schedule: string
}

/* ====== DATA PROGRAM + GAMBAR ====== */
const programsAll = ref<Program[]>([
  { id:'pr-01', title:'Tahfidz Target Juz', desc:'Hafalan bertahap dengan pembimbing, target realistis & monitoring harian.',
    href:'#', cover:'/assets/images/activity.jpg',
    icon:'ph:book-open-text', category:'Tahfidz', level:'Semua jenjang', duration:'1–3 th', schedule:'Senin–Jumat' },
  { id:'pr-02', title:'Kelas Diniyah Kitab Kuning', desc:'Fiqih, aqidah, akhlak, nahwu-sharaf berbasis kitab turats.',
    href:'#', cover:'/assets/images/activity2.jpg',
    icon:'ph:scroll', category:'Pendidikan', level:'Menengah', duration:'3 th', schedule:'Harian' },
  { id:'pr-03', title:'Ekstrakurikuler Pramuka & Kepemimpinan', desc:'Melatih kemandirian, kepemimpinan, dan kerja tim santri.',
    href:'#', cover:'/assets/images/activity1.jpg',
    icon:'ph:compass', category:'Ekstrakurikuler', level:'Semua', duration:'Aktif', schedule:'Mingguan' },
  { id:'pr-04', title:'Riset Sains Santri (KIR)', desc:'Eksperimen sains sederhana dan presentasi ilmiah santri.',
    href:'#', cover:'/assets/images/kelas.jpg',
    icon:'ph:flask', category:'Teknologi', level:'Menengah–Atas', duration:'1 th', schedule:'Mingguan' },
  { id:'pr-05', title:'Pengabdian Masyarakat (Dakwah Sosial)', desc:'Safari dakwah, literasi Qur’an, layanan sosial kemasyarakatan.',
    href:'#', cover:'/assets/images/asrama.jpg',
    icon:'ph:users-three', category:'Sosial', level:'Atas', duration:'Musiman', schedule:'Per agenda' },
  { id:'pr-06', title:'Kelas Bahasa Arab & Inggris', desc:'Praktik percakapan, muhadhoroh, debat, dan karya tulis.',
    href:'#', cover:'/assets/images/masjid.jpg',
    icon:'ph:student', category:'Pendidikan', level:'Semua', duration:'2 th', schedule:'Harian' },
  { id:'pr-07', title:'Kemandirian & Kewirausahaan Santri', desc:'Workshop kewirausahaan, koperasi santri, dan proyek nyata.',
    href:'#', cover:'/assets/images/lapangan.jpg',
    icon:'ph:handshake', category:'Kemandirian', level:'Atas', duration:'1 th', schedule:'Mingguan' },
  { id:'pr-08', title:'E-Learning & Perpustakaan Digital', desc:'SIAKAD, E-Library, dan LMS untuk mendukung belajar mandiri.',
    href:'#', cover:'/assets/images/card.jpg',
    icon:'ph:device-mobile-camera', category:'Teknologi', level:'Semua', duration:'Aktif', schedule:'Fleksibel' },
])

/* ====== FILTER & SLIDER ====== */
const progCategories = ['Semua', 'Pendidikan', 'Tahfidz', 'Ekstrakurikuler', 'Sosial', 'Teknologi', 'Kemandirian'] as const
const progCat = ref<(typeof progCategories)[number]>('Semua')

const programsFiltered = computed(() => {
  if (progCat.value === 'Semua') return programsAll.value
  return programsAll.value.filter(p => p.category === progCat.value)
})

/* Preline carousel options (sesuai struktur HS Carousel) */
const hsOptions = {
  loadingClasses: 'opacity-0',
  dotsItemClasses:
    'hs-carousel-active:bg-blue-700 hs-carousel-active:border-blue-700 size-3 border border-gray-400 rounded-full cursor-pointer dark:border-neutral-600 dark:hs-carousel-active:bg-blue-500 dark:hs-carousel-active:border-blue-500',
  isAutoPlay: true,
  interval: 4000,
  isInfinite: true,
  slidesView: 1,
  gap: 16,
  breakpoints: {
    640:  { slidesView: 2, gap: 16 },
    1024: { slidesView: 2, gap: 16 },
    1280: { slidesView: 3, gap: 16 }
  }
}

/* Init / re-init Preline (SSR-safe) */
async function initCarousel() {
  try {
    const mod = await import('@preline/carousel')
    // @ts-ignore
    mod.autoInit?.()
    // @ts-ignore
    window.HSStaticMethods?.autoInit?.()
  } catch {
    const { HSStaticMethods } = await import('preline')
    HSStaticMethods?.autoInit?.()
    // @ts-ignore
    window.HSStaticMethods?.autoInit?.()
  }
}
onMounted(() => { initCarousel() })
watch(programsFiltered, async () => { await nextTick(); initCarousel() })
</script>
