<template>
    <div id="home">
        <section aria-label="Hero Ponpes" class="relative isolate overflow-hidden min-h-screen py-12">
    <div class="absolute inset-0 -z-10">
      <img
        :src="bgImage"
        alt="Lingkungan pesantren"
        class="h-full w-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
      <div class="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] bg-black/10" />
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 md:pb-24">
      <div class="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div class="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-white/10 ring-1 ring-white/20 backdrop-blur">
            <ClientOnly>
              <Icon icon="ph:sparkle" class="size-4 text-white" />
            </ClientOnly>
            <span class="text-xs font-medium tracking-wide text-white/90">Pondok Pesantren Inovatif</span>
          </div>

          <h1 class="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
            Pesantren Pencetak Insan 
            <span class="text-blue-200">Berakhlaqul Karimah</span>
          </h1>

          <p class="mt-4 text-base sm:text-lg text-white/80 max-w-xl">
            Pondok Pesantren {{ brand }} hadir sebagai pusat pendidikan akhlaq mulia dan ilmu pengetahuan, mengintegrasikan agama-umum, sala-modern, metode Amtsilati, disertai pembelajaran aktif, fasilitas memadai, serta lingkungan bersih, indah, dan nyaman..
          </p>

          <div class="mt-8 flex flex-col sm:flex-row gap-3">
            <a :href="ctaPrimary.href" class="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-transparent">
              {{ ctaPrimary.label }}
              <ClientOnly>
                <Icon icon="lucide:arrow-right" class="size-4" />
              </ClientOnly>
            </a>
            <a :href="ctaSecondary.href" class="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white/90 ring-1 ring-white/30 hover:bg-white/10 focus:outline-hidden">
              <ClientOnly>
                <Icon icon="ph:book-open" class="size-4" />
              </ClientOnly>
              {{ ctaSecondary.label }}
            </a>
          </div>
        </div>

        <div class="relative">
           <dl class="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div v-for="s in stats" :key="s.label" class="rounded-xl bg-white/10 ring-1 ring-white/20 p-3 text-white/90">
              <dt class="text-[11px] uppercase tracking-wide text-white/70">{{ s.label }}</dt>
              <dd class="mt-1 text-xl font-semibold">{{ s.value }}</dd>
            </div>
          </dl>

          <div class="mt-5 grid grid-cols-3 gap-2">
            <img v-for="(p, i) in photos" :key="i" :src="p" class="h-28 sm:h-32 w-full rounded-xl object-cover" :alt="'Kegiatan santri ' + (i+1)" />
          </div>
        </div>
      </div>
    </div>

    <div class="relative">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6 md:-mt-10">
        <div class="rounded-2xl bg-white/90 dark:bg-neutral-900 shadow-lg ring-1 ring-black/5 backdrop-blur">
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 lg:divide-x divide-gray-200/70 dark:divide-neutral-800">
            <div v-for="q in quicks" :key="q.label" class="flex items-center gap-3 p-4">
              <ClientOnly>
                <Icon :icon="q.icon" class="size-5 text-blue-600 dark:text-blue-500" />
              </ClientOnly>
              <div v-if="q.label != 'Admin'">
                <p class="text-xs text-gray-500 dark:text-neutral-400">{{ q.label }}</p>
                <p class="text-sm font-medium text-gray-900 dark:text-neutral-100">{{ q.value }}</p>
              </div>
              <div v-else>
                <a :href="`https://wa.me/${waIntl}`" target="_blank">
                  <p class="text-xs text-gray-500 dark:text-neutral-400">{{ q.label }}</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-neutral-100">{{ q.value }}</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const brand = 'Al-Berr'
const bgImage = '/assets/images/masjid.jpg'

const features = ref([
  { label: 'E‑Learning', icon: 'ph:graduation-cap' },
  { label: 'E‑Library', icon: 'mdi:library-outline' },
  { label: 'SIAKAD', icon: 'ph:desktop' },
  { label: 'Pembayaran QRIS', icon: 'ph:qr-code' },
])

const ctaPrimary = ref({ label: 'Login Wali', href: '/waliLogin' })
const ctaSecondary = ref({ label: 'Pelajari Program', href: '/program' })

const stats = ref([
  { label: 'Santri Putra', value: '1000+' },
  { label: 'Santri Putri', value: '50+' },
  { label: 'Pengajar', value: '50+' },
  { label: 'Prestasi', value: '50+' },
])

const infoCard = ref({
  title: 'PPDB 2025/2026 Dibuka',
  desc: 'Pendaftaran santri baru jalur reguler & beasiswa.',
  image: '/assets/images/card.jpg',
  badges: ['Beasiswa', 'Asrama Terpadu', 'Akreditasi A'],
})

const photos = ref([
  '/assets/images/activity.jpg',
  '/assets/images/activity1.jpg',
  '/assets/images/activity2.jpg',
])

const waIntl = '6285856376399'

const quicks = ref([
  { label: 'PPDB Berakhir', value: '1 Oktober - Kuota Terpenuhi', icon: 'ph:calendar-check' },
  { label: 'Jenjang', value: 'SMP - SMA Al Berr', icon: 'ph:student' },
  { label: 'Admin', value: 'WA: 085856376399', icon: 'ph:phone' },
])

</script>