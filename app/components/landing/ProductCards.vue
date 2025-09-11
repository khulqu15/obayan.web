<template>
  <section id="products" class="py-16 relative">
    <!-- dekorasi halus -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute -top-10 -left-10 size-40 rounded-full blur-3xl opacity-30 bg-[rgb(var(--obayan-green))]" />
      <div class="absolute bottom-0 right-0 size-52 rounded-full blur-3xl opacity-20 bg-emerald-400 dark:bg-emerald-600" />
    </div>

    <div class="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-end justify-between gap-3">
        <div>
          <h2 class="text-2xl sm:text-4xl font-extrabold tracking-tight">Modul Fitur</h2>
          <p class="text-gray-600 dark:text-neutral-300">Pilih sesuai kebutuhan; hidupkan & padukan kapan saja.</p>
        </div>
        <NuxtLink to="/fitur" class="btn-ghost">Semua Fitur</NuxtLink>
      </div>

      <!-- grid kartu -->
      <div class="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <NuxtLink :to="{path: '/fitur', query: {slug: p.demoHref}}"
          v-for="p in localProducts"
          :key="p.key"
          class="group relative overflow-hidden rounded-2xl border border-gray-200/70 dark:border-neutral-800
                 bg-white dark:bg-neutral-900 p-5 shadow-sm hover:shadow-xl transition-all duration-300
                 hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-emerald-400"
        >
          <div
            v-if="p.featured"
            class="absolute right-3 top-3 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300
                   px-2 py-0.5 text-[11px] font-semibold">
            Populer
          </div>

          <div class="flex items-start gap-3">
            <ClientOnly>
              <Icon
                :icon="p.icon"
                class="size-10 shrink-0 text-emerald-500 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
                aria-hidden="true"
              />
            </ClientOnly>

            <div>
              <h3 class="font-bold tracking-tight">{{ p.title }}</h3>
              <p class="text-sm text-gray-600 dark:text-neutral-300 mt-1">{{ p.desc }}</p>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-1.5">
            <span
              v-for="t in p.tags"
              :key="t"
              class="rounded-full bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-200 text-[11px] px-2 py-1">
              {{ t }}
            </span>
          </div>

          <div class="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
            <div class="absolute -right-10 -bottom-10 size-32 rounded-full bg-emerald-400/10 blur-2xl" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

type ProductKey =
  | 'webprofile'
  | 'siakad'
  | 'payment'
  | 'academic'
  | 'attendance'
  | 'visitor'
  | 'violation'
  | 'permission'

const localProducts: Array<{
  key: ProductKey
  title: string
  desc: string
  icon: string
  tags: string[]
  featured?: boolean
  demoHref: string
  salesHref: string
}> = [
  {
    key:'webprofile',
    title:'Web Profile',
    desc:'Profil pondok yang hangat, ringan, dan SEO-ready.',
    icon:'ph:globe',
    tags:['SEO','Blog','Profil'],
    featured:false,
    demoHref:'profile-web-editor',
    salesHref:'#contact?module=webprofile'
  },
  {
    key:'siakad',
    title:'SIAKAD',
    desc:'Manajemen data santri, kelas, nilai, dan rapor.',
    icon:'ph:student',
    tags:['Rapor','Kelas','Data'],
    featured:true,
    demoHref:'siakad',
    salesHref:'#contact?module=siakad'
  },
  {
    key:'payment',
    title:'Pembayaran',
    desc:'Tagihan, cicilan, beasiswa; QRIS/VA & rekonsiliasi.',
    icon:'ph:bank',
    tags:['QRIS','VA','SPP'],
    featured:true,
    demoHref:'pembayaran',
    salesHref:'#contact?module=payment'
  },
  {
    key:'academic',
    title:'Akademik',
    desc:'Jadwal, materi, tugas, ujian/CBT dasar.',
    icon:'ph:chalkboard-teacher',
    tags:['Jadwal','Materi','CBT'],
    featured:false,
    demoHref:'nilai-rapor',
    salesHref:'#contact?module=academic'
  },
  {
    key:'attendance',
    title:'Absensi',
    desc:'RFID & Fingerprint (ToriID), shift, keterlambatan.',
    icon:'ph:identification-badge',
    tags:['RFID','Fingerprint','Shift'],
    featured:true,
    demoHref:'absensi',
    salesHref:'#contact?module=attendance'
  },
  {
    key:'visitor',
    title:'Kunjungan',
    desc:'Pengajuan wali, jadwal, pass, & log keamanan.',
    icon:'ph:map-pin',
    tags:['Security','Pass','Wali'],
    featured:false,
    demoHref:'pengumuman',
    salesHref:'#contact?module=visitor'
  },
  {
    key:'violation',
    title:'Pelanggaran',
    desc:'Poin pelanggaran, pembinaan, & notifikasi.',
    icon:'ph:warning',
    tags:['Poin','Pembinaan','Notifikasi'],
    featured:false,
    demoHref:'pelanggaran',
    salesHref:'#contact?module=violation'
  },
  {
    key:'permission',
    title:'Perizinan',
    desc:'Izin keluar, sakit, tugas; alur persetujuan.',
    icon:'ph:note-pencil',
    tags:['Approval','Surat','Arsip'],
    featured:false,
    demoHref:'perizinan-printout',
    salesHref:'#contact?module=permission'
  }
]
</script>
