<template>
  <section class="relative overflow-hidden bg-[#f8fbff] py-10 text-slate-950 dark:bg-neutral-950 dark:text-white sm:py-14">
    <!-- Grid Background -->
    <div class="pointer-events-none absolute inset-0 opacity-70 dark:opacity-20">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] bg-[size:44px_44px]"></div>
      <div class="absolute inset-0 bg-linear-to-r from-white via-white/30 to-green-100/40 dark:from-neutral-950 dark:via-neutral-950/80 dark:to-green-950/20"></div>
      <div class="absolute -left-24 top-20 h-80 w-80 rounded-full bg-green-200/45 blur-3xl dark:bg-green-900/20"></div>
      <div class="absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-lime-200/35 blur-3xl dark:bg-lime-900/10"></div>
    </div>

    <div class="relative mx-auto max-w-340 px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-10 xl:grid-cols-2">
        <!-- LEFT CONTENT -->
        <div class="relative z-10">
          <div class="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-xs font-black text-green-600 shadow-sm shadow-green-500/10 dark:border-green-900/40 dark:bg-neutral-900 dark:text-green-300">
            <Icon icon="lucide:graduation-cap" class="h-4 w-4" />
            {{ safeEyebrow }}
          </div>

          <h2 class="mt-6 max-w-3xl text-xl font-black leading-[0.98] tracking-[-0.055em] text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
            {{ firstTitleWord }}
            <span class="block">
              {{ secondTitleWord }}
              <span class="bg-linear-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                {{ highlightTitleWord }}
              </span>
            </span>
          </h2>

          <p class="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-neutral-300">
            {{ safeSubtitle }}
          </p>

          <!-- Global CTA -->
          <div class="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-black text-white shadow-xl shadow-green-500/25 transition hover:-translate-y-0.5 hover:bg-green-700"
              @click="goToAllEducation"
            >
              <Icon icon="lucide:grid-3x3" class="h-4 w-4" />
              Semua Edukasi
            </button>

            <button
              v-if="activeSlide"
              type="button"
              class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-green-200 bg-white px-5 text-sm font-black text-green-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-green-50 dark:border-green-900/40 dark:bg-neutral-900 dark:text-green-300 dark:hover:bg-green-950/20"
              @click="goToDetail(activeSlide)"
            >
              Detail
              <Icon icon="lucide:arrow-up-right" class="h-4 w-4" />
            </button>

            <button
              v-if="activeSlide"
              type="button"
              class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              @click="openLearnModal(activeSlide)"
            >
              <Icon icon="lucide:sparkles" class="h-4 w-4" />
              Pelajari
            </button>
          </div>

          <!-- Category Pills -->
          <div v-if="categoryItems.length" class="mt-7 flex flex-wrap gap-2.5">
            <button
              v-for="category in categoryItems"
              :key="category"
              type="button"
              class="inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-black transition"
              :class="selectedCategory === category
                ? 'border-green-600 bg-green-600 text-white shadow-lg shadow-green-500/20'
                : 'border-slate-200 bg-white text-slate-700 hover:border-green-200 hover:bg-green-50 hover:text-green-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-green-900/60 dark:hover:bg-green-950/20'"
              @click="selectCategory(category)"
            >
              <Icon :icon="categoryIcon(category)" class="h-4 w-4" />
              {{ category }}
            </button>
          </div>

          <!-- Active Summary Card -->
          <div
            v-if="activeSlide"
            class="mt-7 overflow-hidden rounded-[28px] border border-slate-200 bg-white/90 p-4 shadow-lg shadow-slate-950/5 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90 dark:shadow-black/20"
          >
            <div class="flex gap-4">
              <div class="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-green-50 text-green-600 ring-1 ring-green-100 dark:bg-green-950/30 dark:text-green-300 dark:ring-green-900/40">
                <Icon :icon="categoryIcon(activeSlide.category)" class="h-7 w-7" />
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="line-clamp-1 text-base font-black text-slate-950 dark:text-white">
                    {{ activeSlide.title }}
                  </h3>

                  <span
                    v-if="activeSlide.category"
                    class="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-green-700 dark:bg-green-950/30 dark:text-green-300"
                  >
                    {{ activeSlide.category }}
                  </span>
                </div>

                <p class="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                  {{ activeSlide.short_description || 'Lihat ringkasan program dan informasi kegiatan pendidikan lainnya.' }}
                </p>

                <div class="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-xs font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                    @click="openLearnModal(activeSlide)"
                  >
                    Pelajari
                    <Icon icon="lucide:book-open" class="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="goToDetail(activeSlide)"
                  >
                    Detail
                    <Icon icon="lucide:arrow-up-right" class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT SLIDER -->
        <div class="relative z-10">
          <div class="absolute -right-3 -top-10 z-20 hidden rounded-full border border-green-200 bg-white px-4 py-2 text-xs font-black text-green-600 shadow-sm shadow-green-500/10 dark:border-green-900/40 dark:bg-neutral-900 dark:text-green-300 sm:inline-flex">
            {{ normalizedSlides.length }} Program Aktif
          </div>

          <div
            v-if="activeSlide"
            class="relative overflow-hidden rounded-[36px] border-[10px] border-white bg-slate-950 shadow-2xl shadow-slate-950/15 dark:border-neutral-900 dark:shadow-black/40"
          >
            <button
              type="button"
              class="group relative block h-[470px] w-full overflow-hidden text-left sm:h-[560px]"
              @click="openImageModal(activeSlide)"
            >
              <Transition
                mode="out-in"
                enter-active-class="transition duration-500 ease-out"
                enter-from-class="scale-[1.04] opacity-0"
                enter-to-class="scale-100 opacity-100"
                leave-active-class="transition duration-300 ease-in"
                leave-from-class="scale-100 opacity-100"
                leave-to-class="scale-[0.98] opacity-0"
              >
                <img
                  :key="activeSlide.id + activeSlide.image"
                  :src="activeSlide.image || fallbackImage"
                  :alt="activeSlide.title"
                  class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </Transition>

              <div class="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/35 to-slate-950/5"></div>
              <div class="absolute inset-0 bg-linear-to-r from-green-950/20 via-transparent to-transparent"></div>

              <!-- Top Badges -->
              <div class="absolute left-5 right-5 top-5 flex flex-wrap items-center gap-2">
                <span
                  v-if="activeSlide.category"
                  class="rounded-full bg-white/25 px-3.5 py-2 text-xs font-black text-white shadow-sm ring-1 ring-white/15 backdrop-blur"
                >
                  {{ activeSlide.category }}
                </span>

                <span class="rounded-full bg-green-600 px-3.5 py-2 text-xs font-black text-white shadow-lg shadow-green-600/20">
                  Featured
                </span>

                <span
                  v-if="activeSlide.tags.length"
                  class="rounded-full bg-white/25 px-3.5 py-2 text-xs font-black text-white shadow-sm ring-1 ring-white/15 backdrop-blur"
                >
                  {{ activeSlide.tags.length }} Tags
                </span>
              </div>

              <!-- Side Icon -->
              <div class="absolute left-8 top-[55%] hidden -translate-y-1/2 sm:block">
                <div class="grid h-16 w-16 place-items-center rounded-[22px] bg-white/15 text-white ring-1 ring-white/20 backdrop-blur">
                  <Icon :icon="categoryIcon(activeSlide.category)" class="h-8 w-8" />
                </div>
              </div>

              <!-- Content -->
              <div class="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <div class="max-w-2xl">
                  <h3 class="text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-4xl">
                    {{ activeSlide.title }}
                  </h3>

                  <p class="mt-3 line-clamp-2 max-w-xl text-sm leading-6 text-white/80">
                    {{ activeSlide.short_description || 'Pelajari informasi program, jadwal, lokasi, dan deskripsi kegiatan.' }}
                  </p>

                  <div class="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-black text-slate-950 transition hover:bg-white/90"
                      @click.stop="openLearnModal(activeSlide)"
                    >
                      Pelajari
                      <Icon icon="lucide:sparkles" class="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-black text-white shadow-lg shadow-green-600/25 transition hover:bg-green-700"
                      @click.stop="goToDetail(activeSlide)"
                    >
                      Detail
                      <Icon icon="lucide:arrow-up-right" class="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white/15 px-4 text-sm font-black text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-white/25"
                      @click.stop="goToAllEducation"
                    >
                      <Icon icon="lucide:grid-3x3" class="h-4 w-4" />
                      Semua Edukasi
                    </button>
                  </div>
                </div>

                <!-- Progress Box -->
                <div
                  v-if="normalizedSlides.length > 1"
                  class="absolute bottom-6 right-6 hidden w-[280px] rounded-[24px] bg-white/18 p-3 text-white shadow-sm ring-1 ring-white/15 backdrop-blur md:block"
                >
                  <div class="mb-2 flex items-center justify-between gap-3">
                    <span class="text-xs font-black">
                      Slide {{ activeIndex + 1 }}/{{ activeList.length }}
                    </span>

                    <button
                      type="button"
                      class="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                      @click.stop="toggleAutoplay"
                    >
                      <Icon :icon="isPlaying ? 'lucide:pause' : 'lucide:play'" class="h-4 w-4" />
                    </button>
                  </div>

                  <div class="flex items-center gap-2">
                    <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-white/25">
                      <div
                        class="h-full rounded-full bg-white transition-all duration-300"
                        :style="{ width: `${progressWidth}%` }"
                      ></div>
                    </div>

                    <div class="h-1.5 w-24 overflow-hidden rounded-full bg-white/25">
                      <div class="h-full rounded-full bg-white/35"></div>
                    </div>
                  </div>
                </div>
              </div>
            </button>

            <!-- Prev/Next -->
            <button
              v-if="showControls && activeList.length > 1"
              type="button"
              class="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/25"
              aria-label="Previous slide"
              @click="prevSlide"
            >
              <Icon icon="lucide:chevron-left" class="h-6 w-6" />
            </button>

            <button
              v-if="showControls && activeList.length > 1"
              type="button"
              class="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/25"
              aria-label="Next slide"
              @click="nextSlide"
            >
              <Icon icon="lucide:chevron-right" class="h-6 w-6" />
            </button>
          </div>

          <div
            v-else
            class="grid min-h-[520px] place-items-center rounded-[36px] border-[10px] border-white bg-white shadow-2xl shadow-slate-950/10 dark:border-neutral-900 dark:bg-neutral-900"
          >
            <div class="text-center">
              <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-slate-100 text-slate-500 dark:bg-neutral-800 dark:text-neutral-300">
                <Icon icon="lucide:images" class="h-7 w-7" />
              </div>
              <h3 class="mt-5 text-lg font-black text-slate-950 dark:text-white">
                Belum ada slide
              </h3>
              <p class="mt-2 text-sm text-slate-500 dark:text-neutral-400">
                Tambahkan slide melalui CMS editor terlebih dahulu.
              </p>
            </div>
          </div>

          <!-- Dots -->
          <div
            v-if="activeList.length > 1"
            class="mt-5 flex items-center justify-center gap-2"
          >
            <button
              v-for="(_, index) in activeList"
              :key="'dot-' + index"
              type="button"
              class="h-2.5 rounded-full transition-all"
              :class="index === activeIndex
                ? 'w-10 bg-green-600'
                : 'w-2.5 bg-green-200 hover:bg-green-300 dark:bg-neutral-700 dark:hover:bg-neutral-600'"
              :aria-label="`Go to slide ${index + 1}`"
              @click="goToSlide(index)"
            ></button>
          </div>

          <!-- Thumbnails -->
          <div
            v-if="activeList.length > 1"
            class="mt-5 grid gap-3 sm:grid-cols-3"
          >
            <button
              v-for="slide in thumbnailSlides"
              :key="slide.id"
              type="button"
              class="group flex min-w-0 items-center gap-3 rounded-[20px] border bg-white p-2.5 text-left shadow-md shadow-slate-950/5 transition hover:-translate-y-0.5 dark:bg-neutral-900"
              :class="indexOfSlide(slide.id) === activeIndex
                ? 'border-green-300 ring-2 ring-green-100 dark:border-green-700 dark:ring-green-950/50'
                : 'border-slate-200 hover:border-green-200 dark:border-neutral-800 dark:hover:border-green-900/60'"
              @click="goToSlide(indexOfSlide(slide.id))"
            >
              <img
                :src="slide.image || fallbackImage"
                :alt="slide.title"
                class="h-14 w-16 shrink-0 rounded-2xl object-cover"
                loading="lazy"
              />

              <div class="min-w-0 flex-1">
                <p class="truncate text-xs font-black text-slate-950 dark:text-white">
                  {{ slide.title }}
                </p>
                <p class="mt-0.5 truncate text-[11px] font-semibold text-slate-500 dark:text-neutral-400">
                  {{ slide.category || slide.location || '-' }}
                </p>
              </div>

              <Icon icon="lucide:chevron-right" class="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-green-600" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- IMAGE MODAL -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="imageModal.show && imageModal.slide"
          class="fixed inset-0 z-[1200] overflow-y-auto bg-slate-950/85 px-4 py-8 backdrop-blur-md"
          @click.self="closeImageModal"
        >
          <div class="mx-auto flex min-h-full max-w-6xl items-center justify-center">
            <div class="w-full max-h-[75vh] overflow-hidden rounded-[32px] border border-white/10 bg-white shadow-2xl dark:bg-neutral-950">
              <div class="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-neutral-800">
                <div class="min-w-0">
                  <p class="text-xs font-black uppercase tracking-[0.16em] text-green-600 dark:text-green-300">
                    Preview Gambar
                  </p>
                  <h3 class="truncate text-base font-black text-slate-950 dark:text-white">
                    {{ imageModal.slide.title }}
                  </h3>
                </div>

                <button
                  type="button"
                  class="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="closeImageModal"
                >
                  <Icon icon="lucide:x" class="h-5 w-5" />
                </button>
              </div>

              <div class="bg-slate-100 p-4 dark:bg-neutral-900">
                <img
                  :src="imageModal.slide.image || fallbackImage"
                  :alt="imageModal.slide.title"
                  class="max-h-[78vh] w-full rounded-[24px] object-contain"
                />
              </div>

              <div class="flex flex-col gap-2 border-t border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950 sm:flex-row sm:items-center sm:justify-between">
                <p class="line-clamp-1 text-sm font-bold text-slate-700 dark:text-neutral-200">
                  {{ imageModal.slide.short_description || 'Preview gambar program edukasi.' }}
                </p>

                <div class="flex gap-2">
                  <button
                    type="button"
                    class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="openLearnFromImage"
                  >
                    Pelajari
                  </button>

                  <button
                    type="button"
                    class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-xs font-black text-white transition hover:bg-green-700"
                    @click="goToDetail(imageModal.slide)"
                  >
                    Detail
                    <Icon icon="lucide:arrow-up-right" class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- LEARN MODAL -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-4 opacity-0 scale-[0.98]"
        enter-to-class="translate-y-0 opacity-100 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100 scale-100"
        leave-to-class="translate-y-4 opacity-0 scale-[0.98]"
      >
        <div
          v-if="learnModal.show && learnModal.slide"
          class="fixed inset-0 z-[10000] bg-slate-950/70 px-4 py-6 backdrop-blur-md sm:py-8"
          @click.self="closeLearnModal"
        >
          <div class="flex min-h-full items-center justify-center">
            <div
              class="flex max-h-[calc(100vh-3rem)] w-full max-w-5xl flex-col overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950 sm:max-h-[calc(100vh-4rem)]"
            >
              <!-- Modal Header -->
              <div class="relative shrink-0 overflow-hidden border-b border-slate-200 bg-linear-to-br from-green-600 via-green-600 to-lime-500 p-5 text-white dark:border-neutral-800 md:p-7">
                <div class="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/20 blur-3xl"></div>
                <div class="absolute -bottom-16 left-8 h-36 w-36 rounded-full bg-lime-200/30 blur-3xl"></div>

                <div class="relative z-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                      <span
                        v-if="learnModal.slide.category"
                        class="rounded-full bg-white/15 px-3 py-1.5 text-xs font-black text-white ring-1 ring-white/15 backdrop-blur"
                      >
                        {{ learnModal.slide.category }}
                      </span>

                      <span
                        v-if="learnModal.slide.interval"
                        class="rounded-full bg-white/15 px-3 py-1.5 text-xs font-black text-white ring-1 ring-white/15 backdrop-blur"
                      >
                        {{ learnModal.slide.interval }}
                      </span>
                    </div>

                    <h3 class="mt-4 text-2xl font-black leading-tight tracking-[-0.035em] md:text-4xl">
                      {{ learnModal.slide.title }}
                    </h3>

                    <p class="mt-3 max-w-3xl text-sm leading-7 text-green-50/90 md:text-base">
                      {{ learnModal.slide.short_description || 'Pelajari ringkasan program sebelum membuka halaman detail lengkap.' }}
                    </p>
                  </div>

                  <button
                    type="button"
                    class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/25"
                    @click="closeLearnModal"
                  >
                    <Icon icon="lucide:x" class="h-5 w-5" />
                  </button>
                </div>
              </div>

              <!-- Scrollable Modal Body -->
              <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <div class="grid gap-0 lg:grid-cols-[320px,minmax(0,1fr)]">
                  <!-- Sidebar Info -->
                  <aside class="border-b border-slate-200 bg-slate-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/60 lg:border-b-0 lg:border-r">
                    <img
                      :src="learnModal.slide.image || fallbackImage"
                      :alt="learnModal.slide.title"
                      class="h-44 w-full rounded-[24px] object-cover shadow-sm"
                    />

                    <div class="mt-5 grid grid-cols-1 gap-3">
                      <div class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                        <div class="flex items-center gap-3">
                          <Icon icon="lucide:map-pin" class="h-5 w-5 shrink-0 text-green-600" />
                          <div class="min-w-0">
                            <p class="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                              Lokasi
                            </p>
                            <p class="mt-0.5 text-sm font-bold text-slate-950 dark:text-white">
                              {{ learnModal.slide.location || '-' }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                        <div class="flex items-center gap-3">
                          <Icon icon="lucide:calendar-days" class="h-5 w-5 shrink-0 text-green-600" />
                          <div class="min-w-0">
                            <p class="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                              Jadwal
                            </p>
                            <p class="mt-0.5 text-sm font-bold text-slate-950 dark:text-white">
                              {{ dateRangeLabel(learnModal.slide.start_date, learnModal.slide.end_date) }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                        <div class="flex items-center gap-3">
                          <Icon icon="lucide:repeat" class="h-5 w-5 shrink-0 text-green-600" />
                          <div class="min-w-0">
                            <p class="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                              Interval
                            </p>
                            <p class="mt-0.5 text-sm font-bold text-slate-950 dark:text-white">
                              {{ learnModal.slide.interval || '-' }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div v-if="learnModal.slide.tags.length" class="mt-5 flex flex-wrap gap-2">
                      <span
                        v-for="tag in learnModal.slide.tags"
                        :key="tag"
                        class="rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 ring-1 ring-green-100 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-900/40"
                      >
                        #{{ tag }}
                      </span>
                    </div>
                  </aside>

                  <!-- Tiptap HTML Viewer -->
                  <main class="min-w-0 p-5 md:p-6">
                    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p class="text-xs font-black uppercase tracking-[0.16em] text-green-600 dark:text-green-300">
                          Preview Pembelajaran
                        </p>
                        <h4 class="mt-1 text-xl font-black tracking-[-0.03em] text-slate-950 dark:text-white">
                          Ringkasan Program
                        </h4>
                      </div>

                      <button
                        type="button"
                        class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                        @click="goToDetail(learnModal.slide)"
                      >
                        Detail
                        <Icon icon="lucide:arrow-up-right" class="h-4 w-4" />
                      </button>
                    </div>

                    <div class="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                      <article
                        class="tiptap-viewer prose prose-slate max-w-none p-5 text-slate-700 dark:prose-invert dark:text-neutral-200 md:p-7"
                        v-html="learnHtml"
                      ></article>
                    </div>
                  </main>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="shrink-0 border-t border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p class="text-xs leading-5 text-slate-500 dark:text-neutral-400">
                    Modal ini hanya preview singkat. Gunakan tombol Detail untuk membuka halaman lengkap.
                  </p>

                  <div class="flex flex-wrap gap-2">
                    <button
                      type="button"
                      class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      @click="goToAllEducation"
                    >
                      <Icon icon="lucide:grid-3x3" class="h-4 w-4" />
                      Semua Edukasi
                    </button>

                    <button
                      type="button"
                      class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                      @click="goToDetail(learnModal.slide)"
                    >
                      Detail
                      <Icon icon="lucide:arrow-up-right" class="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      @click="closeLearnModal"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

type EducationSlide = {
  id?: string
  slug?: string
  image?: string
  imagePublicId?: string | null
  title?: string
  location?: string
  start_date?: string
  end_date?: string
  interval?: string
  short_description?: string
  description_rich_tiptap?: string
  category?: string
  tags?: string[]
}

type NormalizedSlide = {
  id: string
  slug: string
  image: string
  imagePublicId: string | null
  title: string
  location: string
  start_date: string
  end_date: string
  interval: string
  short_description: string
  description_rich_tiptap: string
  category: string
  tags: string[]
}

const props = withDefaults(
  defineProps<{
    eyebrow?: string
    title?: string
    subtitle?: string
    autoplay?: boolean
    showControls?: boolean
    sliderDelay?: number
    slides?: EducationSlide[]
    allEducationUrl?: string
    detailPagePath?: string
  }>(),
  {
    eyebrow: 'Pendidikan Lainnya',
    title: 'Program Pendidikan & Kegiatan Pengembangan',
    subtitle:
      'Temukan berbagai kegiatan pendidikan, pembinaan, pelatihan, dan pengembangan karakter yang tersedia.',
    autoplay: true,
    showControls: true,
    sliderDelay: 4500,
    slides: () => [],
    allEducationUrl: '/education',
    detailPagePath: '/education'
  }
)

const router = useRouter()
const route = useRoute()

const fallbackImage = '/assets/images/activity.jpg'
const activeIndex = ref(0)
const selectedCategory = ref('')
const isPlaying = ref(true)
const progressWidth = ref(0)

let timer: ReturnType<typeof window.setInterval> | null = null
let progressTimer: ReturnType<typeof window.setInterval> | null = null

const imageModal = reactive<{
  show: boolean
  slide: NormalizedSlide | null
}>({
  show: false,
  slide: null
})

const learnModal = reactive<{
  show: boolean
  slide: NormalizedSlide | null
}>({
  show: false,
  slide: null
})

const safeEyebrow = computed(() => props.eyebrow || 'Pendidikan Lainnya')
const safeTitle = computed(() => props.title || 'Program Pendidikan & Kegiatan Pengembangan')
const safeSubtitle = computed(() => props.subtitle || '')

const titleParts = computed(() => {
  const parts = safeTitle.value.split(' ').filter(Boolean)

  if (parts.length <= 2) {
    return {
      first: parts[0] || 'Pendidikan',
      second: parts[1] || '& Program',
      highlight: 'Lainnya'
    }
  }

  const highlight = parts.pop() || 'Lainnya'
  const mid = parts.splice(Math.ceil(parts.length / 2)).join(' ')
  const first = parts.join(' ')

  return {
    first: first || 'Pendidikan',
    second: mid || 'Program',
    highlight
  }
})

const firstTitleWord = computed(() => titleParts.value.first)
const secondTitleWord = computed(() => titleParts.value.second)
const highlightTitleWord = computed(() => titleParts.value.highlight)

const normalizedSlides = computed<NormalizedSlide[]>(() => {
  const raw = Array.isArray(props.slides) ? props.slides : []

  return raw
    .filter((slide) => slide && typeof slide === 'object')
    .map((slide, index) => {
      const title = String(slide.title || `Program ${index + 1}`)
      const id = String(slide.id || `other-education-${index}`)

      return {
        id,
        slug: String(slide.slug || slugify(title || id)),
        image: String(slide.image || ''),
        imagePublicId: slide.imagePublicId || null,
        title,
        location: String(slide.location || ''),
        start_date: String(slide.start_date || ''),
        end_date: String(slide.end_date || ''),
        interval: String(slide.interval || ''),
        short_description: String(slide.short_description || ''),
        description_rich_tiptap: String(slide.description_rich_tiptap || ''),
        category: String(slide.category || ''),
        tags: Array.isArray(slide.tags)
          ? slide.tags.map((tag) => String(tag).replace(/^#/, '').trim()).filter(Boolean)
          : []
      }
    })
})

const categoryItems = computed(() => {
  const categories = normalizedSlides.value
    .map((slide) => slide.category)
    .filter(Boolean)

  return Array.from(new Set(categories))
})

const uniqueTags = computed(() => {
  return Array.from(
    new Set(
      normalizedSlides.value
        .flatMap((slide) => slide.tags || [])
        .map((tag) => String(tag).replace(/^#/, '').trim())
        .filter(Boolean)
    )
  )
})

const filteredSlides = computed(() => {
  if (!selectedCategory.value) return normalizedSlides.value

  return normalizedSlides.value.filter((slide) => slide.category === selectedCategory.value)
})

const activeList = computed(() => {
  return filteredSlides.value.length ? filteredSlides.value : normalizedSlides.value
})

const activeSlide = computed(() => {
  return activeList.value[activeIndex.value] || activeList.value[0] || null
})

const thumbnailSlides = computed(() => {
  const list = activeList.value

  if (list.length <= 3) return list

  const result: NormalizedSlide[] = []
  const total = list.length

  for (let offset = 0; offset < 3; offset += 1) {
    const index = (activeIndex.value + offset) % total
    result.push(list[index])
  }

  return result
})

const learnHtml = computed(() => {
  const html = learnModal.slide?.description_rich_tiptap || ''

  if (html.trim()) {
    return sanitizeHtml(html)
  }

  const fallback = learnModal.slide?.short_description || 'Belum ada deskripsi lengkap untuk program ini.'

  return sanitizeHtml(`<p>${escapeHtml(fallback)}</p>`)
})

watch(
  () => normalizedSlides.value.length,
  (total) => {
    if (!total) {
      activeIndex.value = 0
      stopAutoplay()
      return
    }

    if (activeIndex.value > total - 1) {
      activeIndex.value = 0
    }

    restartAutoplay()
  }
)

watch(
  () => [props.autoplay, props.sliderDelay, activeList.value.length, isPlaying.value],
  () => {
    if (activeIndex.value > activeList.value.length - 1) {
      activeIndex.value = 0
    }

    restartAutoplay()
  }
)

function slugify(value: string) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'program'
}

function selectCategory(category: string) {
  selectedCategory.value = selectedCategory.value === category ? '' : category
  activeIndex.value = 0
  restartAutoplay()
}

function categoryIcon(category?: string) {
  const value = String(category || '').toLowerCase()

  if (value.includes('tahfidz') || value.includes('quran')) return 'lucide:book-open'
  if (value.includes('diniyah') || value.includes('agama')) return 'lucide:book-marked'
  if (value.includes('workshop') || value.includes('pelatihan')) return 'lucide:hammer'
  if (value.includes('formal') || value.includes('sekolah')) return 'lucide:school'
  if (value.includes('seminar')) return 'lucide:presentation'
  if (value.includes('desa')) return 'lucide:building-2'
  if (value.includes('santri')) return 'lucide:users'

  return 'lucide:graduation-cap'
}

function indexOfSlide(id: string) {
  return activeList.value.findIndex((slide) => slide.id === id)
}

function goToSlide(index: number) {
  const list = activeList.value
  if (!list.length) return

  const total = list.length
  activeIndex.value = ((index % total) + total) % total

  restartAutoplay()
}

function nextSlide() {
  goToSlide(activeIndex.value + 1)
}

function prevSlide() {
  goToSlide(activeIndex.value - 1)
}

function startAutoplay() {
  stopAutoplay()

  if (!props.autoplay) return
  if (!isPlaying.value) return
  if (activeList.value.length <= 1) return

  const delay = Math.max(Number(props.sliderDelay || 4500), 1000)
  const tick = 60
  const step = 100 / (delay / tick)

  progressWidth.value = 0

  progressTimer = window.setInterval(() => {
    progressWidth.value = Math.min(progressWidth.value + step, 100)
  }, tick)

  timer = window.setInterval(() => {
    nextSlide()
  }, delay)
}

function stopAutoplay() {
  if (timer) {
    window.clearInterval(timer)
    timer = null
  }

  if (progressTimer) {
    window.clearInterval(progressTimer)
    progressTimer = null
  }
}

function restartAutoplay() {
  if (typeof window === 'undefined') return
  startAutoplay()
}

function toggleAutoplay() {
  isPlaying.value = !isPlaying.value
  restartAutoplay()
}

function formatDate(value?: string) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

function dateRangeLabel(start?: string, end?: string) {
  const startLabel = formatDate(start)
  const endLabel = formatDate(end)

  if (startLabel && endLabel) return `${startLabel} — ${endLabel}`
  if (startLabel) return startLabel
  if (endLabel) return endLabel

  return '-'
}

function openImageModal(slide: NormalizedSlide) {
  imageModal.slide = slide
  imageModal.show = true
}

function closeImageModal() {
  imageModal.show = false
  imageModal.slide = null
}

function openLearnModal(slide: NormalizedSlide) {
  learnModal.slide = slide
  learnModal.show = true
}

function closeLearnModal() {
  learnModal.show = false
  learnModal.slide = null
}

function openLearnFromImage() {
  if (!imageModal.slide) return

  const slide = imageModal.slide
  closeImageModal()
  openLearnModal(slide)
}

function normalizePath(path?: string) {
  const value = String(path || '').trim()

  if (!value) return '/education'

  return value.startsWith('/') ? value : `/${value}`
}

async function goToAllEducation() {
  closeLearnModal()
  closeImageModal()

  await router.push({
    path: normalizePath(props.allEducationUrl || props.detailPagePath || '/education'),
    query: {}
  })
}

async function goToDetail(slide?: NormalizedSlide | null) {
  if (!slide?.slug) return

  closeLearnModal()
  closeImageModal()

  const targetPath = normalizePath(props.detailPagePath || props.allEducationUrl || '/education')

  await router.push({
    path: targetPath,
    query: {
      detail: slide.slug
    }
  })
}

async function shareSlide(slide: NormalizedSlide) {
  const detailUrl = getDetailAbsoluteUrl(slide)
  const text = `${slide.title}\n${slide.short_description || detailUrl}`.trim()

  try {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({
        title: slide.title,
        text,
        url: detailUrl
      })
      return
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${text}\n${detailUrl}`.trim())
    }
  } catch {}
}

function getDetailAbsoluteUrl(slide: NormalizedSlide) {
  const path = props.detailPagePath || '/education'
  const query = `detail=${encodeURIComponent(slide.slug)}`
  const relative = `${path}${path.includes('?') ? '&' : '?'}${query}`

  if (typeof window === 'undefined') return relative

  return new URL(relative, window.location.origin).toString()
}

function escapeHtml(value: string) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function sanitizeHtml(html: string) {
  return String(html || '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/\sjavascript:/gi, '')
}

onMounted(() => {
  startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
})
</script>

<style scoped>
.toolbar-pill {
  display: inline-flex;
  min-height: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  padding: 0.375rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 800;
  color: rgb(71 85 105);
}

.dark .toolbar-pill {
  color: rgb(229 229 229);
}

.tiptap-viewer {
  color: rgb(51 65 85);
  font-size: 1rem;
  line-height: 1.85;
}

.dark .tiptap-viewer {
  color: rgb(229 229 229);
}

.tiptap-viewer :deep(h1) {
  margin-top: 1.4rem;
  margin-bottom: 0.75rem;
  font-size: 2rem;
  line-height: 1.15;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: rgb(15 23 42);
}

.tiptap-viewer :deep(h2) {
  margin-top: 1.25rem;
  margin-bottom: 0.65rem;
  font-size: 1.5rem;
  line-height: 1.25;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: rgb(15 23 42);
}

.tiptap-viewer :deep(h3) {
  margin-top: 1.1rem;
  margin-bottom: 0.55rem;
  font-size: 1.2rem;
  line-height: 1.3;
  font-weight: 850;
  color: rgb(15 23 42);
}

.dark .tiptap-viewer :deep(h1),
.dark .tiptap-viewer :deep(h2),
.dark .tiptap-viewer :deep(h3) {
  color: white;
}

.tiptap-viewer :deep(p) {
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
  line-height: 1.9;
}

.tiptap-viewer :deep(blockquote) {
  margin: 1.25rem 0;
  border-left: 4px solid rgb(22 163 74);
  border-radius: 1rem;
  background: rgb(240 253 244);
  padding: 1rem 1.25rem;
  font-weight: 600;
  color: rgb(22 101 52);
}

.dark .tiptap-viewer :deep(blockquote) {
  background: rgba(20, 83, 45, 0.2);
  color: rgb(187 247 208);
}

.tiptap-viewer :deep(ul),
.tiptap-viewer :deep(ol) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.tiptap-viewer :deep(ul) {
  list-style-type: disc;
}

.tiptap-viewer :deep(ol) {
  list-style-type: decimal;
}

.tiptap-viewer :deep(li) {
  margin: 0.35rem 0;
  line-height: 1.8;
}

.tiptap-viewer :deep(table) {
  margin: 1.25rem 0;
  width: 100%;
  overflow: hidden;
  border-collapse: collapse;
  border-radius: 1rem;
  font-size: 0.9rem;
}

.tiptap-viewer :deep(th),
.tiptap-viewer :deep(td) {
  border: 1px solid rgb(226 232 240);
  padding: 0.75rem;
  text-align: left;
}

.dark .tiptap-viewer :deep(th),
.dark .tiptap-viewer :deep(td) {
  border-color: rgb(38 38 38);
}

.tiptap-viewer :deep(th) {
  background: rgb(248 250 252);
  font-weight: 900;
}

.dark .tiptap-viewer :deep(th) {
  background: rgb(23 23 23);
}

.tiptap-viewer :deep(img),
.tiptap-viewer :deep(.editor-image) {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: 1.25rem;
  margin: 1.25rem auto;
  border: 1px solid rgb(226 232 240);
  box-shadow: 0 18px 50px -26px rgba(15, 23, 42, 0.35);
}

.dark .tiptap-viewer :deep(img),
.dark .tiptap-viewer :deep(.editor-image) {
  border-color: rgb(64 64 64);
}

.tiptap-viewer :deep(a) {
  color: rgb(22 163 74);
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.tiptap-viewer :deep(iframe[src*='youtube']),
.tiptap-viewer :deep(iframe[src*='youtu.be']),
.tiptap-viewer :deep(.youtube-embed) {
  width: 100%;
  aspect-ratio: 16 / 9;
  height: auto;
  margin: 1.25rem 0;
  border: 0;
  border-radius: 1.25rem;
  overflow: hidden;
  background: rgb(15 23 42);
}

.tiptap-viewer :deep(.pdf-embed),
.tiptap-viewer :deep(.map-embed) {
  margin: 1.25rem 0;
  overflow: hidden;
  border: 1px solid rgb(226 232 240);
  border-radius: 1.25rem;
  background: rgb(248 250 252);
}

.dark .tiptap-viewer :deep(.pdf-embed),
.dark .tiptap-viewer :deep(.map-embed) {
  border-color: rgb(64 64 64);
  background: rgb(23 23 23);
}

.tiptap-viewer :deep(.pdf-embed-title),
.tiptap-viewer :deep(.map-embed-title) {
  border-bottom: 1px solid rgb(226 232 240);
  background: linear-gradient(135deg, rgb(240 253 244), rgb(255 255 255));
  padding: 0.85rem 1rem;
  font-size: 0.875rem;
  font-weight: 900;
  color: rgb(30 41 59);
}

.dark .tiptap-viewer :deep(.pdf-embed-title),
.dark .tiptap-viewer :deep(.map-embed-title) {
  border-color: rgb(64 64 64);
  background: linear-gradient(135deg, rgba(22, 163, 74, 0.16), rgb(23 23 23));
  color: white;
}

.tiptap-viewer :deep(.pdf-embed-frame),
.tiptap-viewer :deep(.map-embed-frame) {
  width: 100%;
  height: 420px;
  border: 0;
  background: white;
}

.dark .tiptap-viewer :deep(.pdf-embed-frame),
.dark .tiptap-viewer :deep(.map-embed-frame) {
  background: rgb(10 10 10);
}

@media (max-width: 640px) {
  .tiptap-viewer :deep(.pdf-embed-frame),
  .tiptap-viewer :deep(.map-embed-frame) {
    height: 320px;
  }
}
</style>
  