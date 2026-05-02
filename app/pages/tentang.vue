<template>
  <main
    ref="pageRef"
    class="about-page relative overflow-hidden bg-white text-gray-800 antialiased dark:bg-neutral-950 dark:text-neutral-200"
  >
    <!-- SOFT BACKGROUND -->
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -left-32 top-24 h-96 w-96 rounded-full bg-green-200/45 blur-3xl dark:bg-green-500/10" />
      <div class="absolute -right-36 top-[34rem] h-[30rem] w-[30rem] rounded-full bg-lime-200/45 blur-3xl dark:bg-lime-500/10" />
      <div class="absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full bg-green-100/70 blur-3xl dark:bg-green-400/5" />
      <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(22,163,74,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(22,163,74,0.06)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(70%_55%_at_50%_18%,#000,transparent_75%)]" />
    </div>

    <!-- HERO -->
    <section class="relative isolate min-h-[92vh] overflow-hidden pt-24">
      <div class="absolute inset-0 -z-20">
        <img
          :src="heroImage"
          alt="Obayan education platform"
          draggable="false"
          class="h-full w-full select-none object-cover"
        >
        <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-white dark:to-neutral-950" />
      </div>

      <div class="pointer-events-none absolute inset-0 -z-10">
        <div class="absolute left-[-16%] top-[10%] size-[36rem] rounded-full bg-green-400/25 blur-3xl blob-soft" />
        <div class="absolute right-[-12%] top-[26%] size-[34rem] rounded-full bg-lime-300/20 blur-3xl blob-soft blob-soft-delay" />
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.22),transparent_34%)]" />
      </div>

      <div class="mx-auto grid max-w-[90rem] grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <div
          data-reveal
          data-parallax
          data-speed="0.045"
          class="max-w-3xl"
        >
          <div class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-white/90 shadow-2xl shadow-black/10 backdrop-blur-xl">
            <Icon icon="solar:stars-line-duotone" class="size-4" />
            Tentang Obayan
          </div>

          <h1 class="mt-6 text-balance text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Operasional pendidikan yang lebih rapi, cepat, dan terhubung.
          </h1>

          <p class="mt-6 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
            Obayan by <strong class="font-black text-white">sencra.io</strong> membantu sekolah dan pesantren
            mengelola akademik, presensi, keuangan, komunikasi wali, dan website profil dalam satu ekosistem
            yang sederhana namun powerful.
          </p>

          <div class="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#visi-misi"
              class="group inline-flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-green-600/25 transition duration-300 hover:-translate-y-1 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              <Icon icon="lucide:target" class="size-4 transition group-hover:rotate-12" />
              Visi & Misi
            </a>

            <a
              href="#ecosystem"
              class="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-black/5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/20"
            >
              <Icon icon="lucide:grid-2x2" class="size-4" />
              Lihat Ekosistem
            </a>
          </div>

          <div class="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            <div
              v-for="stat in heroStats"
              :key="stat.label"
              data-reveal
              data-parallax
              data-speed="0.025"
              class="rounded-[1.35rem] border border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/5 backdrop-blur-xl"
            >
              <p class="text-2xl font-black text-white">{{ stat.value }}</p>
              <p class="mt-1 text-xs font-semibold leading-5 text-white/70">{{ stat.label }}</p>
            </div>
          </div>
        </div>

        <!-- HERO MOCKUP -->
        <div
          data-reveal
          data-parallax
          data-speed="-0.04"
          data-rotate="0.025"
          class="relative hidden lg:block"
        >
          <div class="hero-device relative mx-auto w-full max-w-xl rounded-[2.25rem] border border-white/20 bg-white/15 p-4 shadow-2xl shadow-black/20 backdrop-blur-2xl">
            <div class="rounded-[1.75rem] bg-white/95 p-4 shadow-2xl dark:bg-neutral-950/92">
              <div class="mb-4 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="size-3 rounded-full bg-red-300" />
                  <span class="size-3 rounded-full bg-yellow-300" />
                  <span class="size-3 rounded-full bg-green-400" />
                </div>
                <span class="rounded-full bg-green-50 px-3 py-1 text-xs font-extrabold text-green-700 dark:bg-green-500/10 dark:text-green-300">
                  Live Ecosystem
                </span>
              </div>

              <div class="grid grid-cols-3 gap-3">
                <div class="col-span-2 rounded-[1.4rem] bg-green-600 p-5 text-white shadow-xl shadow-green-600/20">
                  <Icon icon="lucide:graduation-cap" class="size-8" />
                  <p class="mt-7 text-2xl font-black">SIAKAD</p>
                  <p class="mt-1 text-sm font-medium text-white/80">Data, nilai, kelas, rapor</p>
                </div>

                <div class="space-y-3">
                  <div class="widget-pulse rounded-[1.4rem] bg-green-50 p-4 dark:bg-green-500/10">
                    <Icon icon="lucide:shield-check" class="size-6 text-green-600 dark:text-green-300" />
                    <div class="mt-5 h-2 rounded-full bg-green-200 dark:bg-green-400/20" />
                    <div class="mt-2 h-2 w-2/3 rounded-full bg-green-100 dark:bg-green-400/10" />
                  </div>

                  <div class="widget-pulse-delay rounded-[1.4rem] bg-lime-50 p-4 dark:bg-lime-500/10">
                    <Icon icon="lucide:bell-ring" class="size-6 text-lime-600 dark:text-lime-300" />
                    <div class="mt-5 h-2 rounded-full bg-lime-200 dark:bg-lime-400/20" />
                    <div class="mt-2 h-2 w-3/4 rounded-full bg-lime-100 dark:bg-lime-400/10" />
                  </div>
                </div>
              </div>

              <div class="mt-4 grid grid-cols-3 gap-3">
                <div
                  v-for="item in miniWidgets"
                  :key="item.label"
                  class="rounded-[1.3rem] bg-gray-50 p-4 ring-1 ring-gray-100 dark:bg-white/5 dark:ring-white/10"
                >
                  <div :class="item.boxClass" class="grid h-12 place-items-center rounded-xl">
                    <Icon :icon="item.icon" class="size-5" />
                  </div>
                  <div class="mt-3 h-2 w-3/4 rounded-full bg-gray-200 dark:bg-white/10" />
                  <p class="mt-3 text-xs font-bold text-gray-500 dark:text-neutral-400">{{ item.label }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="float-card absolute -left-8 top-16 rounded-2xl border border-white/40 bg-white/90 px-4 py-3 shadow-2xl shadow-black/10 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/90">
            <p class="text-xs font-bold text-gray-500 dark:text-neutral-400">Presensi hari ini</p>
            <p class="text-2xl font-black text-green-600">98%</p>
          </div>

          <div class="float-card-delay absolute -bottom-6 right-4 rounded-2xl border border-white/40 bg-white/90 px-4 py-3 shadow-2xl shadow-black/10 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/90">
            <p class="text-xs font-bold text-gray-500 dark:text-neutral-400">Notifikasi wali</p>
            <p class="text-lg font-black text-gray-950 dark:text-white">Real-time</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ABOUT -->
    <section class="relative py-16 sm:py-24">
      <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <div class="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div data-reveal data-parallax data-speed="0.035">
            <span class="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-green-700 ring-1 ring-green-100 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-400/20">
              <Icon icon="lucide:building-2" class="size-4" />
              Tentang Perusahaan
            </span>

            <h2 class="mt-5 max-w-3xl text-3xl font-black tracking-tight text-gray-950 dark:text-white sm:text-5xl">
              Ekosistem digital untuk pendidikan yang lebih terhubung.
            </h2>

            <p class="mt-5 max-w-2xl text-base leading-8 text-gray-600 dark:text-neutral-300">
              Obayan adalah platform pendidikan modern yang dirancang untuk membantu sekolah, yayasan,
              dan pesantren mengelola operasional harian secara lebih cepat, transparan, dan mudah dipantau.
            </p>

            <div class="mt-8 grid gap-4 sm:grid-cols-2">
              <article
                v-for="item in aboutPoints"
                :key="item.title"
                data-reveal
                data-parallax
                data-speed="0.02"
                class="group rounded-[1.5rem] border border-gray-200/80 bg-white/85 p-5 shadow-sm shadow-gray-200/50 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-2xl hover:shadow-green-900/10 dark:border-white/10 dark:bg-white/[0.045] dark:shadow-none"
              >
                <div class="flex items-start gap-4">
                  <div class="grid size-11 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-600 ring-1 ring-green-100 transition duration-300 group-hover:rotate-6 group-hover:scale-110 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-400/20">
                    <Icon :icon="item.icon" class="size-5" />
                  </div>
                  <div>
                    <p class="font-black text-gray-950 dark:text-white">{{ item.title }}</p>
                    <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-neutral-400">{{ item.desc }}</p>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <div data-reveal data-parallax data-speed="-0.035" class="relative">
            <div class="absolute -left-6 -top-6 hidden size-28 rounded-[2rem] bg-green-100 sm:block dark:bg-green-500/10" />
            <div class="absolute -bottom-6 -right-6 hidden size-36 rounded-full bg-lime-100 sm:block dark:bg-lime-500/10" />

            <div class="relative overflow-hidden rounded-[2.25rem] border border-gray-200 bg-white p-3 shadow-2xl shadow-green-900/10 dark:border-white/10 dark:bg-white/[0.045]">
              <img
                :src="aboutImage"
                draggable="false"
                class="h-[24rem] w-full select-none rounded-[1.7rem] object-cover sm:h-[31rem]"
                alt="About Obayan"
              >

              <div class="pointer-events-none absolute inset-x-3 bottom-3 h-36 rounded-b-[1.7rem] bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            <div class="absolute -bottom-5 left-6 right-6 rounded-[1.5rem] border border-white/60 bg-white/92 p-4 shadow-2xl shadow-black/10 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/92">
              <div class="flex items-center gap-3">
                <div class="grid size-12 place-items-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-600/25">
                  <Icon icon="lucide:sparkles" class="size-5" />
                </div>
                <div>
                  <p class="font-black text-gray-950 dark:text-white">Sederhana untuk digunakan</p>
                  <p class="text-sm leading-6 text-gray-600 dark:text-neutral-400">
                    Namun tetap kuat untuk operasional harian lembaga.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- VISI MISI -->
    <section id="visi-misi" class="relative py-16 sm:py-24">
      <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <div
          data-reveal
          data-parallax
          data-speed="0.03"
          class="rounded-[2.25rem] border border-gray-200 bg-white/85 p-5 shadow-2xl shadow-green-900/8 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] sm:p-8 lg:p-10"
        >
          <div class="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <span class="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-green-700 ring-1 ring-green-100 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-400/20">
                <Icon icon="lucide:target" class="size-4" />
                Visi & Misi
              </span>

              <h2 class="mt-5 text-3xl font-black tracking-tight text-gray-950 dark:text-white sm:text-5xl">
                Membangun sekolah yang lebih adaptif dan siap bertumbuh.
              </h2>

              <p class="mt-5 text-base leading-8 text-gray-600 dark:text-neutral-300">
                Kami percaya teknologi pendidikan harus terasa mudah bagi pengguna, tetapi tetap memiliki fondasi
                sistem yang kuat untuk mendukung kebutuhan lembaga dalam jangka panjang.
              </p>
            </div>

            <div class="grid gap-4">
              <article
                v-for="(item, index) in missionItems"
                :key="item.title"
                data-reveal
                data-parallax
                :data-speed="index % 2 === 0 ? '0.025' : '-0.02'"
                class="group rounded-[1.5rem] border border-gray-200 bg-gray-50/70 p-5 transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:bg-white hover:shadow-xl hover:shadow-green-900/10 dark:border-white/10 dark:bg-white/[0.035] dark:hover:bg-white/[0.065]"
              >
                <div class="flex gap-4">
                  <div class="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-green-600 ring-1 ring-gray-200 transition group-hover:bg-green-600 group-hover:text-white group-hover:ring-green-600 dark:bg-white/5 dark:ring-white/10">
                    <Icon :icon="item.icon" class="size-5" />
                  </div>
                  <div>
                    <p class="font-black text-gray-950 dark:text-white">{{ item.title }}</p>
                    <p class="mt-1 text-sm leading-7 text-gray-600 dark:text-neutral-400">{{ item.desc }}</p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ECOSYSTEM -->
    <section id="ecosystem" class="relative py-16 sm:py-24">
      <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-3xl text-center" data-reveal data-parallax data-speed="0.025">
          <span class="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-green-700 ring-1 ring-green-100 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-400/20">
            <Icon icon="lucide:layout-dashboard" class="size-4" />
            Ekosistem Produk
          </span>

          <h2 class="mt-5 text-3xl font-black tracking-tight text-gray-950 dark:text-white sm:text-5xl">
            Semua kebutuhan lembaga dalam satu alur yang rapi.
          </h2>

          <p class="mt-5 text-base leading-8 text-gray-600 dark:text-neutral-300">
            Mulai dari website profil, data akademik, pembayaran, sampai komunikasi wali bisa disusun dalam
            satu sistem yang saling terhubung.
          </p>
        </div>

        <div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(item, index) in ecosystemItems"
            :key="item.title"
            data-reveal
            data-parallax
            :data-speed="index % 2 === 0 ? '0.025' : '-0.018'"
            class="group relative overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white/85 p-6 shadow-sm shadow-gray-200/50 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-2xl hover:shadow-green-900/10 dark:border-white/10 dark:bg-white/[0.045] dark:shadow-none"
          >
            <div class="absolute -right-10 -top-10 size-28 rounded-full bg-green-100 opacity-0 blur-xl transition duration-300 group-hover:opacity-100 dark:bg-green-500/10" />

            <div class="relative">
              <div class="grid size-13 place-items-center rounded-2xl bg-green-50 text-green-600 ring-1 ring-green-100 transition duration-300 group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white dark:bg-green-500/10 dark:text-green-300 dark:ring-green-400/20">
                <Icon :icon="item.icon" class="size-6" />
              </div>

              <h3 class="mt-6 text-xl font-black text-gray-950 dark:text-white">{{ item.title }}</h3>
              <p class="mt-3 text-sm leading-7 text-gray-600 dark:text-neutral-400">{{ item.desc }}</p>

              <div class="mt-6 flex flex-wrap gap-2">
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 dark:bg-white/5 dark:text-neutral-300"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- CULTURE / WHY -->
    <section class="relative py-16 sm:py-24">
      <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <div class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div data-reveal data-parallax data-speed="0.035">
            <span class="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-green-700 ring-1 ring-green-100 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-400/20">
              <Icon icon="lucide:heart-handshake" class="size-4" />
              Cara Kami Bekerja
            </span>

            <h2 class="mt-5 text-3xl font-black tracking-tight text-gray-950 dark:text-white sm:text-5xl">
              Dibangun dengan pendekatan yang manusiawi dan terukur.
            </h2>

            <p class="mt-5 text-base leading-8 text-gray-600 dark:text-neutral-300">
              Fokus kami bukan hanya membuat fitur, tetapi membuat sistem yang benar-benar dapat dipakai oleh
              admin, guru, wali, dan pengelola lembaga tanpa terasa rumit.
            </p>

            <div class="mt-8">
              <NuxtLink
                to="/fitur"
                class="inline-flex items-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-gray-950/15 transition duration-300 hover:-translate-y-1 hover:bg-green-700 dark:bg-white dark:text-gray-950 dark:hover:bg-green-300"
              >
                Jelajahi Fitur
                <Icon icon="lucide:arrow-right" class="size-4" />
              </NuxtLink>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <article
              v-for="(item, index) in cultureItems"
              :key="item.title"
              data-reveal
              data-parallax
              :data-speed="index % 2 === 0 ? '-0.02' : '0.025'"
              class="rounded-[1.5rem] border border-gray-200 bg-white/85 p-5 shadow-sm shadow-gray-200/50 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-2xl hover:shadow-green-900/10 dark:border-white/10 dark:bg-white/[0.045] dark:shadow-none"
            >
              <div class="grid size-11 place-items-center rounded-2xl bg-green-50 text-green-600 ring-1 ring-green-100 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-400/20">
                <Icon :icon="item.icon" class="size-5" />
              </div>

              <h3 class="mt-5 font-black text-gray-950 dark:text-white">{{ item.title }}</h3>
              <p class="mt-2 text-sm leading-7 text-gray-600 dark:text-neutral-400">{{ item.desc }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- CAREERS / CTA -->
    <section id="careers" class="relative py-16 sm:py-24">
      <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <div
          data-reveal
          data-parallax
          data-speed="0.035"
          class="relative overflow-hidden rounded-[2.5rem] bg-gray-950 p-6 text-white shadow-2xl shadow-green-900/20 sm:p-10 lg:p-14"
        >
          <div class="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-green-500/30 blur-3xl" />
          <div class="pointer-events-none absolute -bottom-28 left-1/4 size-96 rounded-full bg-lime-500/20 blur-3xl" />
          <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(70%_70%_at_50%_50%,#000,transparent_78%)]" />

          <div class="relative grid gap-10 lg:grid-cols-[1fr_0.75fr] lg:items-center">
            <div>
              <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-white/80 backdrop-blur-xl">
                <Icon icon="lucide:briefcase-business" class="size-4" />
                Karier & Kolaborasi
              </span>

              <h2 class="mt-5 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
                Tumbuh bersama ekosistem pendidikan digital yang berdampak.
              </h2>

              <p class="mt-5 max-w-2xl text-base leading-8 text-white/70">
                Kami terbuka untuk kolaborasi dengan sekolah, pesantren, yayasan, dan partner teknologi
                yang ingin membangun operasional pendidikan lebih modern.
              </p>

              <div class="mt-8 flex flex-wrap gap-3">
                <NuxtLink
                  to="/#contact"
                  class="inline-flex items-center gap-2 rounded-2xl bg-green-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-green-500/25 transition duration-300 hover:-translate-y-1 hover:bg-green-600"
                >
                  Hubungi Kami
                  <Icon icon="lucide:send" class="size-4" />
                </NuxtLink>

                <NuxtLink
                  to="/fitur"
                  class="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-extrabold text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/15"
                >
                  Lihat Solusi
                  <Icon icon="lucide:arrow-up-right" class="size-4" />
                </NuxtLink>
              </div>
            </div>

            <div class="grid gap-3">
              <div
                v-for="item in ctaPoints"
                :key="item"
                class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl"
              >
                <div class="grid size-9 shrink-0 place-items-center rounded-xl bg-green-400/20 text-green-200">
                  <Icon icon="lucide:check" class="size-4" />
                </div>
                <p class="text-sm font-bold text-white/82">{{ item }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const pageRef = ref<HTMLElement | null>(null)

const heroImage = '/assets/images/masjid.jpg'
const aboutImage = '/assets/images/cases/0.png'

const heroStats = [
  {
    value: '1',
    label: 'Portal terpadu'
  },
  {
    value: '24/7',
    label: 'Akses monitoring'
  },
  {
    value: 'Real-time',
    label: 'Komunikasi data'
  }
]

const miniWidgets = [
  {
    label: 'Akademik',
    icon: 'lucide:book-open-check',
    boxClass: 'bg-green-100 text-green-700 dark:bg-green-400/10 dark:text-green-300'
  },
  {
    label: 'Keuangan',
    icon: 'lucide:wallet-cards',
    boxClass: 'bg-lime-100 text-lime-700 dark:bg-lime-400/10 dark:text-lime-300'
  },
  {
    label: 'Wali',
    icon: 'lucide:users-round',
    boxClass: 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-neutral-200'
  }
]

const aboutPoints = [
  {
    title: 'Terpusat',
    desc: 'Data akademik, presensi, pembayaran, dan informasi sekolah tersusun dalam satu sistem.',
    icon: 'lucide:database-zap'
  },
  {
    title: 'Mudah digunakan',
    desc: 'Tampilan dibuat ringan, jelas, dan nyaman untuk admin, guru, wali, maupun pengelola.',
    icon: 'lucide:mouse-pointer-click'
  },
  {
    title: 'Real-time',
    desc: 'Informasi penting dapat dipantau lebih cepat sehingga keputusan operasional lebih responsif.',
    icon: 'lucide:radio-tower'
  },
  {
    title: 'Fleksibel',
    desc: 'Modul dapat disesuaikan dengan kebutuhan sekolah, yayasan, pesantren, atau lembaga pendidikan.',
    icon: 'lucide:sliders-horizontal'
  }
]

const missionItems = [
  {
    title: 'Visi',
    desc: 'Menjadi ekosistem digital pendidikan yang membantu lembaga bergerak lebih efisien, transparan, dan siap menghadapi kebutuhan modern.',
    icon: 'lucide:telescope'
  },
  {
    title: 'Misi Produk',
    desc: 'Menyediakan platform yang menyatukan website, akademik, keuangan, presensi, dan komunikasi wali dalam pengalaman yang mudah digunakan.',
    icon: 'lucide:boxes'
  },
  {
    title: 'Misi Implementasi',
    desc: 'Mendampingi lembaga secara bertahap agar proses digitalisasi tidak terasa berat dan dapat berjalan sesuai kesiapan tim internal.',
    icon: 'lucide:route'
  }
]

const ecosystemItems = [
  {
    title: 'Website CMS',
    desc: 'Kelola profil lembaga, berita, halaman, galeri, dan informasi publik dengan tampilan profesional.',
    icon: 'lucide:globe-2',
    tags: ['Profil', 'Berita', 'PPDB']
  },
  {
    title: 'SIAKAD',
    desc: 'Mengelola data santri/siswa, kelas, guru, nilai, jadwal, dan laporan akademik secara terstruktur.',
    icon: 'lucide:graduation-cap',
    tags: ['Kelas', 'Nilai', 'Rapor']
  },
  {
    title: 'Keuangan',
    desc: 'Membantu pencatatan pembayaran, tagihan, status lunas, dan ringkasan transaksi lembaga.',
    icon: 'lucide:wallet',
    tags: ['Tagihan', 'SPP', 'Laporan']
  },
  {
    title: 'Presensi',
    desc: 'Mendukung monitoring kehadiran dengan opsi QR, RFID, maupun integrasi perangkat sesuai kebutuhan.',
    icon: 'lucide:scan-face',
    tags: ['QR', 'RFID', 'Realtime']
  },
  {
    title: 'Aplikasi Wali',
    desc: 'Wali dapat memantau informasi akademik, presensi, pengumuman, tagihan, dan perkembangan anak.',
    icon: 'lucide:users-round',
    tags: ['Wali', 'Santri', 'Insight']
  },
  {
    title: 'Insight Data',
    desc: 'Menampilkan ringkasan informasi penting agar pengelola lebih mudah membaca kondisi lembaga.',
    icon: 'lucide:chart-no-axes-combined',
    tags: ['Dashboard', 'Analitik', 'Monitoring']
  }
]

const cultureItems = [
  {
    title: 'User-first',
    desc: 'Setiap alur dibuat agar orang awam tetap bisa memahami sistem tanpa banyak penjelasan teknis.',
    icon: 'lucide:user-round-check'
  },
  {
    title: 'Clean system',
    desc: 'Struktur data dan menu dibuat rapi supaya pengembangan fitur berikutnya tetap mudah dilakukan.',
    icon: 'lucide:layers-3'
  },
  {
    title: 'Scalable',
    desc: 'Didesain agar dapat digunakan oleh satu lembaga kecil sampai yayasan dengan banyak unit pendidikan.',
    icon: 'lucide:trending-up'
  },
  {
    title: 'Collaborative',
    desc: 'Implementasi dapat disesuaikan bersama tim lembaga agar fitur yang dibuat benar-benar tepat guna.',
    icon: 'lucide:handshake'
  }
]

const ctaPoints = [
  'Cocok untuk sekolah, pesantren, yayasan, dan lembaga pendidikan.',
  'Modul dapat diaktifkan bertahap sesuai kebutuhan.',
  'Desain sistem fleksibel untuk branding masing-masing lembaga.'
]

let rafId = 0
let observer: IntersectionObserver | null = null

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const updateParallax = () => {
  if (!pageRef.value || typeof window === 'undefined') return

  const viewportHeight = window.innerHeight
  const items = pageRef.value.querySelectorAll<HTMLElement>('[data-parallax]')

  items.forEach((item) => {
    const rect = item.getBoundingClientRect()
    const speed = Number(item.dataset.speed || 0.02)
    const rotateSpeed = Number(item.dataset.rotate || 0)
    const centerDistance = rect.top + rect.height / 2 - viewportHeight / 2

    const y = clamp(centerDistance * speed, -34, 34)
    const rotate = clamp(centerDistance * rotateSpeed, -3, 3)

    item.style.setProperty('--parallax-y', `${y.toFixed(2)}px`)
    item.style.setProperty('--parallax-rotate', `${rotate.toFixed(2)}deg`)
  })
}

const onScroll = () => {
  cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(updateParallax)
}

onMounted(() => {
  if (!pageRef.value || typeof window === 'undefined') return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer?.unobserve(entry.target)
      })
    },
    {
      threshold: 0.16,
      rootMargin: '0px 0px -8% 0px'
    }
  )

  pageRef.value.querySelectorAll<HTMLElement>('[data-reveal]').forEach((item, index) => {
    item.style.setProperty('--reveal-delay', `${Math.min(index * 45, 260)}ms`)
    observer?.observe(item)
  })

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  updateParallax()
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  }

  cancelAnimationFrame(rafId)
  observer?.disconnect()
})
</script>

<style scoped>
.about-page {
  scroll-behavior: smooth;
}

[data-reveal] {
  --reveal-y: 26px;
  --parallax-y: 0px;
  --parallax-rotate: 0deg;
  opacity: 0;
  filter: blur(12px);
  transform: translate3d(0, calc(var(--reveal-y) + var(--parallax-y)), 0)
    rotate(var(--parallax-rotate))
    scale(0.985);
  transition:
    opacity 720ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 720ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 720ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 300ms ease,
    box-shadow 300ms ease,
    background-color 300ms ease;
  transition-delay: var(--reveal-delay, 0ms);
  will-change: opacity, filter, transform;
}

[data-reveal].is-visible {
  --reveal-y: 0px;
  opacity: 1;
  filter: blur(0);
}

[data-parallax] {
  transform: translate3d(0, calc(var(--reveal-y, 0px) + var(--parallax-y, 0px)), 0)
    rotate(var(--parallax-rotate, 0deg));
  will-change: transform;
}

.blob-soft {
  animation: blobSoft 11s ease-in-out infinite alternate;
}

.blob-soft-delay {
  animation-delay: -4s;
}

.hero-device {
  animation: deviceFloat 6s ease-in-out infinite;
}

.float-card {
  animation: floatCard 5.5s ease-in-out infinite;
}

.float-card-delay {
  animation: floatCard 5.5s ease-in-out infinite;
  animation-delay: -2s;
}

.widget-pulse {
  animation: widgetPulse 2.8s ease-in-out infinite;
}

.widget-pulse-delay {
  animation: widgetPulse 2.8s ease-in-out infinite;
  animation-delay: -1.25s;
}

@keyframes blobSoft {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  100% {
    transform: translate3d(28px, -22px, 0) scale(1.08);
  }
}

@keyframes deviceFloat {
  0%,
  100% {
    transform: translate3d(0, 0, 0) rotate(-1deg);
  }

  50% {
    transform: translate3d(0, -14px, 0) rotate(1deg);
  }
}

@keyframes floatCard {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  50% {
    transform: translate3d(0, -12px, 0);
  }
}

@keyframes widgetPulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.035);
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-reveal],
  [data-parallax],
  .blob-soft,
  .hero-device,
  .float-card,
  .float-card-delay,
  .widget-pulse,
  .widget-pulse-delay {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }

  [data-reveal] {
    opacity: 1;
    filter: none;
  }
}
</style>