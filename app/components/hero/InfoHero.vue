<template>
    <div class="relative overflow-hidden dark:bg-neutral-900 bg-gray-100" id="information">
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center max-w-3xl mx-auto">
        <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Kenapa Memilih <span class="text-blue-600 dark:text-blue-400">Pondok Alberr</span>?
        </h2>
        <p class="mt-3 text-gray-600 dark:text-neutral-300">
          Perpaduan <span class="font-medium">diniyah</span> dan <span class="font-medium">umum</span>, pembinaan akhlak, serta layanan digital yang memudahkan wali santri.
        </p>
      </div>

      <div class="mt-10 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="item in reasons"
          :key="item.title"
          class="group rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 backdrop-blur-sm p-5 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start gap-3">
            <div
              class="shrink-0 rounded-xl p-2.5 ring-1 ring-gray-200 dark:ring-neutral-700 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-neutral-700 dark:to-neutral-700/50"
            >
              <ClientOnly>
                <Icon :icon="item.icon" class="size-5 text-blue-600 dark:text-blue-400" />
                <template #fallback><span class="block size-5 rounded bg-gray-200 dark:bg-neutral-600" /></template>
              </ClientOnly>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">
                {{ item.title }}
              </h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-neutral-300">
                {{ item.desc }}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div class="relative bg-gradient-to-b from-white to-blue-50/60 dark:from-neutral-900 dark:to-neutral-900/60">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-1">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Visi</h2>
            <p class="mt-3 text-gray-700 dark:text-neutral-200 leading-relaxed">
              {{ visi }}
            </p>

            <div class="mt-6">
              <a
                :href="profilHref"
                class="inline-flex items-center gap-x-2 text-sm font-medium text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Lihat Profil Pesantren
                <ClientOnly>
                  <Icon icon="lucide:arrow-right" class="size-4" />
                </ClientOnly>
              </a>
            </div>
          </div>

          <div class="lg:col-span-2">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Misi</h3>
            <ul class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <li
                v-for="m in misi"
                :key="m.title"
                class="flex items-start gap-3 rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 backdrop-blur-sm p-4"
              >
                <div
                  class="shrink-0 mt-0.5 rounded-full p-1 ring-1 ring-blue-200 dark:ring-blue-900/40 bg-blue-50 dark:bg-blue-900/20"
                >
                  <ClientOnly>
                    <Icon :icon="m.icon" class="size-4 text-blue-600 dark:text-blue-400" />
                    <template #fallback><span class="block size-4 rounded-full bg-gray-200 dark:bg-neutral-600" /></template>
                  </ClientOnly>
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ m.title }}</p>
                  <p class="text-sm text-gray-600 dark:text-neutral-300">{{ m.desc }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </div>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue"
import { ref } from "vue"

const reasons = ref([
  {
    title: 'Pusat Pendidikan Akhlaq dan Ilmu Pengetahuan',
    desc: 'Membentuk generasi berilmu dan berakhlak mulia sebagai bekal kehidupan.',
    icon: 'ph:student',
  },
  {
    title: 'Integrasi Ilmu Agama dan Umum',
    desc: 'Menggabungkan kurikulum agama dan umum secara harmonis dan seimbang.',
    icon: 'ph:book-open-text',
  },
  {
    title: 'Pendidikan Salaf dan Modern yang Terpadu',
    desc: 'Memadukan metode tradisional pesantren dan pendekatan modern berbasis teknologi.',
    icon: 'ph:chalkboard-teacher',
  },
  {
    title: 'Pembelajaran Siswa Aktif dengan Presentasi',
    desc: 'Mendorong siswa berperan aktif melalui diskusi, presentasi, dan praktik langsung.',
    icon: 'ph:megaphone',
  },
  {
    title: 'Program Cepat Belajar Kitab Kuning Metode Amtsilati',
    desc: 'Pendekatan sistematis untuk memahami kitab kuning dengan lebih cepat dan mudah.',
    icon: 'ph:book-bookmark',
  },
  {
    title: 'Pesantren yang Asri dan Bersih',
    desc: 'Lingkungan hijau, fasilitas terawat, serta budaya menjaga kebersihan dan kenyamanan.',
    icon: 'ph:leaf',
  },
])

const visi = ref(
  'Mencetak generasi berilmu, berakhlak karimah, dan berdaya saing global berlandaskan Al-Qur’an dan Sunnah.'
)
const misi = ref([
  {
    title: 'Manajemen Terpadu',
    desc: 'Menerapkan sistem manajemen terpadu untuk mewujudkan tata kelola pesantren yang efektif dan efisien.',
    icon: 'ph:gear-six',
  },
  {
    title: 'Pendidikan Islam Terpadu',
    desc: 'Menerapkan pendidikan Islam terpadu yang berorientasi pada pembentukan akhlaq mulia.',
    icon: 'ph:book-open-text',
  },
  {
    title: 'Jaringan Kerja Sama',
    desc: 'Mengembangkan dan meningkatkan jaringan kerja sama dengan berbagai pihak secara berkelanjutan.',
    icon: 'ph:handshake',
  },
  {
    title: 'Hubungan Kekeluargaan',
    desc: 'Meningkatkan hubungan kekeluargaan yang harmonis antar santri, pengasuh, dan masyarakat.',
    icon: 'ph:users-three',
  },
  {
    title: 'Kreatifitas & Kemandirian',
    desc: 'Mendorong kreatifitas dan kemandirian santri melalui program inovatif dan kewirausahaan.',
    icon: 'ph:lightbulb',
  },
  {
    title: 'Pengembangan Potensi',
    desc: 'Mengembangkan potensi yang dimiliki untuk dimanfaatkan sebagai sumber daya yang bermanfaat.',
    icon: 'ph:plant',
  },
])

const profilHref = ref('/profile')
</script>