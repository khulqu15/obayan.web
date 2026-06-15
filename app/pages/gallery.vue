<!-- /pages/gallery.vue -->
<template>
  <section id="gallery" class="relative min-h-screen overflow-hidden bg-gray-50 text-gray-800 dark:bg-neutral-950 dark:text-neutral-200">
    <!-- Background -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(22,163,74,0.14),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(132,204,22,0.14),transparent_28%),linear-gradient(to_bottom,#f9fafb,#f3f4f6)] dark:bg-[radial-gradient(circle_at_top_left,rgba(22,163,74,0.18),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(132,204,22,0.12),transparent_28%),linear-gradient(to_bottom,#0a0a0a,#111827)]"></div>
      <div class="absolute -left-28 top-16 h-[34rem] w-[34rem] rounded-full bg-green-200/40 blur-3xl dark:bg-green-900/20"></div>
      <div class="absolute -right-28 top-80 h-[30rem] w-[30rem] rounded-full bg-lime-200/35 blur-3xl dark:bg-lime-900/10"></div>
      <div class="absolute inset-0 opacity-[0.35] dark:opacity-[0.16]">
        <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(22,163,74,.13)_1px,transparent_1px),linear-gradient(to_bottom,rgba(22,163,74,.13)_1px,transparent_1px)] bg-[size:34px_34px]"></div>
      </div>
    </div>

    <!-- Hero -->
    <section class="relative pt-28 md:pt-32">
      <div class="absolute inset-0">
        <div
          v-if="isPageConfigLoading || !hero.cover"
          class="h-full w-full bg-gradient-to-br from-green-700 via-green-600 to-lime-500"
        >
          <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.12)_1px,transparent_1px)] bg-[size:34px_34px] opacity-40"></div>
          <div class="absolute -left-24 top-16 h-80 w-80 rounded-full bg-white/20 blur-3xl"></div>
          <div class="absolute -right-24 bottom-12 h-80 w-80 rounded-full bg-lime-200/25 blur-3xl"></div>
        </div>

        <img
          v-else-if="hero.cover && !isBrokenImage(hero.cover)"
          :src="hero.cover"
          alt="Cover Gallery"
          class="h-full w-full object-cover opacity-90"
          @error="markBroken(hero.cover)"
        >

        <div
          v-else
          class="grid h-full w-full place-items-center bg-gradient-to-br from-green-700 via-green-600 to-lime-500 text-white"
        >
          <div class="text-center">
            <Icon icon="lucide:image-off" class="mx-auto h-10 w-10 opacity-90" />
            <p class="mt-3 text-sm font-bold">Invalid image url</p>
          </div>
        </div>

        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20"></div>
      </div>

      <div
        class="relative mx-auto flex max-w-[85rem] items-end px-4 sm:px-6 lg:px-8"
        :style="{ height: heroHeight }"
      >
        <div v-if="isPageConfigLoading" class="mb-10 max-w-3xl">
          <div class="h-7 w-32 animate-pulse rounded-full bg-white/20"></div>
          <div class="mt-4 h-12 w-[min(36rem,82vw)] animate-pulse rounded-2xl bg-white/20 sm:h-14"></div>
          <div class="mt-3 h-5 w-[min(32rem,75vw)] animate-pulse rounded bg-white/20"></div>
          <div class="mt-2 h-5 w-[min(24rem,60vw)] animate-pulse rounded bg-white/15"></div>
        </div>

        <div v-else class="mb-10 max-w-3xl">
          <p class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-green-100 backdrop-blur">
            <span class="inline-block h-2 w-2 rounded-full bg-lime-300"></span>
            {{ hero.badge }}
          </p>

          <h1 class="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
            {{ hero.title }}
          </h1>

          <p class="mt-3 max-w-2xl text-sm leading-relaxed text-green-50/90 sm:text-base">
            {{ hero.subtitle }}
          </p>
        </div>
      </div>
    </section>

    <!-- Main -->
    <main class="relative mx-auto max-w-[85rem] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <!-- Floating Filter Panel -->
      <section class="-mt-16 rounded-[30px] border border-white/80 bg-white/90 p-4 shadow-2xl shadow-green-950/10 backdrop-blur-2xl dark:border-neutral-800 dark:bg-neutral-900/90 dark:shadow-black/30 md:p-5">
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p class="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <Icon icon="lucide:sparkles" class="h-3.5 w-3.5" />
                Gallery Collection
              </p>

              <h2 class="mt-3 text-xl font-black tracking-tight text-gray-950 dark:text-white md:text-2xl">
                Jelajahi Dokumentasi
              </h2>

              <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                Cari berdasarkan judul, kategori, atau tags dengan tampilan yang lebih ringan dan rapi.
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-3 py-2 text-xs font-bold text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
                <Icon icon="lucide:images" class="h-4 w-4 text-green-600" />
                {{ items.length }} foto
              </span>

              <span class="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-3 py-2 text-xs font-bold text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
                <Icon icon="lucide:folder" class="h-4 w-4 text-green-600" />
                {{ categories.length }} kategori
              </span>

              <span class="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-3 py-2 text-xs font-bold text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
                <Icon icon="lucide:hash" class="h-4 w-4 text-green-600" />
                {{ allTags.length }} tags
              </span>
            </div>
          </div>

          <!-- Dribbble Style Filter Flexbox -->
          <div class="flex flex-col gap-3 rounded-[26px] border border-gray-200 bg-gray-50/80 p-3 dark:border-neutral-800 dark:bg-neutral-950/60 lg:flex-row lg:items-center">
            <!-- Search -->
            <label class="relative min-w-0 flex-1">
              <Icon icon="lucide:search" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                v-model.trim="q"
                type="search"
                :placeholder="texts.searchPlaceholder"
                class="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-24 text-sm font-medium text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              >

              <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
                {{ filtered.length }} hasil
              </span>
            </label>

            <!-- Category -->
            <label class="relative w-full lg:w-56">
              <Icon icon="lucide:folder" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <select
                v-model="selectedCategory"
                class="h-12 w-full appearance-none rounded-2xl border border-gray-200 bg-white pl-11 pr-10 text-sm font-bold text-gray-700 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              >
                <option value="all">{{ texts.categoryAll || 'Semua Kategori' }}</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>

              <Icon icon="lucide:chevron-down" class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </label>

            <!-- Tags -->
            <label class="relative w-full lg:w-56">
              <Icon icon="lucide:hash" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <select
                v-model="selectedTag"
                class="h-12 w-full appearance-none rounded-2xl border border-gray-200 bg-white pl-11 pr-10 text-sm font-bold text-gray-700 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              >
                <option value="all">Semua Tags</option>
                <option v-for="tag in allTags" :key="tag" :value="tag">
                  #{{ tag }}
                </option>
              </select>

              <Icon icon="lucide:chevron-down" class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </label>

            <!-- Sort -->
            <label class="relative w-full lg:w-48">
              <Icon icon="lucide:arrow-up-down" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <select
                v-model="sortBy"
                class="h-12 w-full appearance-none rounded-2xl border border-gray-200 bg-white pl-11 pr-10 text-sm font-bold text-gray-700 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="title">Judul A-Z</option>
              </select>

              <Icon icon="lucide:chevron-down" class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </label>

            <!-- Reset -->
            <button
              type="button"
              class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-black text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-green-900/60 dark:hover:bg-green-900/10 dark:hover:text-green-300 lg:w-auto"
              @click="resetFilters"
            >
              <Icon icon="lucide:rotate-ccw" class="h-4 w-4" />
              Reset
            </button>
          </div>

          <!-- Active Filter Pills -->
          <div
            v-if="hasActiveFilter"
            class="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4 dark:border-neutral-800"
          >
            <span class="text-xs font-black uppercase tracking-wide text-gray-400">
              Aktif:
            </span>

            <span
              v-if="q"
              class="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 dark:bg-green-900/20 dark:text-green-300"
            >
              Search: {{ q }}
            </span>

            <span
              v-if="selectedCategory !== 'all'"
              class="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
            >
              {{ selectedCategory }}
            </span>

            <span
              v-if="selectedTag !== 'all'"
              class="inline-flex items-center gap-2 rounded-full bg-lime-50 px-3 py-1.5 text-xs font-bold text-lime-700 dark:bg-lime-900/20 dark:text-lime-300"
            >
              #{{ selectedTag }}
            </span>
          </div>
        </div>
      </section>

      <!-- Empty -->
      <section
        v-if="!isInitialLoading && filtered.length === 0"
        class="mt-6 rounded-[30px] border border-dashed border-gray-300 bg-white/90 p-10 text-center shadow-sm backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/80"
      >
        <div class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300">
          <Icon icon="lucide:image-off" class="h-7 w-7" />
        </div>

        <h3 class="mt-4 text-lg font-black text-gray-950 dark:text-white">
          Tidak ada foto yang cocok
        </h3>

        <p class="mt-2 text-sm text-gray-500 dark:text-neutral-400">
          Coba ubah kata kunci, kategori, atau tag yang dipilih.
        </p>
      </section>

      <!-- Loading -->
      <section v-else-if="isInitialLoading" class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="i in 8"
          :key="i"
          class="h-80 animate-pulse rounded-[26px] border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
        ></div>
      </section>

      <!-- Gallery Cards -->
      <section v-else class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <article
          v-for="(img, idx) in paged"
          :key="`${img.src}-${img.title}-${idx}`"
          class="group overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-green-950/10 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-green-900/50"
        >
          <button
            type="button"
            class="relative block aspect-[16/11] w-full overflow-hidden bg-gray-100 text-left dark:bg-neutral-800"
            @click="openLightbox(startIndex + idx)"
          >
            <img
              v-if="img.src && !isBrokenImage(img.src)"
              :src="img.src"
              :alt="img.title || 'Gallery image'"
              loading="lazy"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
              @error="markBroken(img.src)"
            >

            <div
              v-else
              class="grid h-full place-items-center bg-gradient-to-br from-green-50 to-lime-50 p-6 text-center dark:from-neutral-800 dark:to-neutral-900"
            >
              <div>
                <div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-green-600 shadow-sm dark:bg-neutral-950 dark:text-green-300">
                  <Icon icon="lucide:image-off" class="h-6 w-6" />
                </div>
                <p class="mt-3 text-sm font-black text-gray-950 dark:text-white">Invalid image url</p>
                <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">Gambar tidak dapat dimuat.</p>
              </div>
            </div>

            <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-85"></div>

            <div class="absolute left-3 top-3 flex flex-wrap gap-2">
              <span class="rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
                {{ img.category || 'Umum' }}
              </span>
            </div>

            <div class="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-2xl bg-white/90 text-gray-800 opacity-0 shadow-sm backdrop-blur transition duration-300 group-hover:opacity-100 dark:bg-neutral-950/90 dark:text-white">
              <Icon icon="lucide:expand" class="h-4 w-4" />
            </div>

            <div class="absolute inset-x-0 bottom-0 p-4">
              <h3 class="line-clamp-2 text-base font-black text-white">
                {{ img.title || 'Tanpa judul' }}
              </h3>

              <div v-if="img.tags.length" class="mt-2 flex flex-wrap gap-1.5">
                <span
                  v-for="tag in img.tags.slice(0, 3)"
                  :key="tag"
                  class="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold text-white ring-1 ring-white/20 backdrop-blur"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
          </button>

          <div class="space-y-3 p-4">
            <div class="flex items-center justify-between gap-3 text-[12px] text-gray-500 dark:text-neutral-400">
              <span class="inline-flex min-w-0 items-center gap-1">
                <Icon icon="lucide:folder" class="h-3.5 w-3.5 shrink-0" />
                <span class="truncate">{{ img.category || 'Umum' }}</span>
              </span>

              <span class="inline-flex items-center gap-1">
                <Icon icon="lucide:hash" class="h-3.5 w-3.5" />
                {{ img.tags.length }} tag
              </span>
            </div>

            <p class="line-clamp-2 text-sm text-gray-600 dark:text-neutral-300">
              {{ img.tags.length ? img.tags.join(', ') : 'Belum ada tag untuk foto ini.' }}
            </p>

            <button
              type="button"
              class="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-bold text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-green-900/60 dark:hover:bg-green-900/10 dark:hover:text-green-300"
              @click="openLightbox(startIndex + idx)"
            >
              <Icon icon="lucide:eye" class="h-4 w-4" />
              Lihat Preview
            </button>
          </div>
        </article>
      </section>

      <!-- Load More -->
      <div v-if="hasMore && !isInitialLoading" class="mt-8 text-center">
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
          @click="loadMore"
        >
          <Icon icon="lucide:arrow-down-circle" class="h-4 w-4" />
          {{ texts.loadMore }}
        </button>
      </div>
    </main>

    <!-- Lightbox Modal -->
    <teleport to="body">
      <div v-if="lightboxOpen" class="fixed inset-0 z-[90]">
        <div class="absolute inset-0 bg-neutral-950/80 backdrop-blur-md" @click="closeLightbox"></div>

        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="relative flex h-[70vh] max-h-[70vh] w-full max-w-6xl flex-col overflow-hidden rounded-[30px] border border-white/10 bg-neutral-950 shadow-2xl">
            <!-- Modal Header -->
            <header class="flex shrink-0 flex-col gap-3 border-b border-white/10 bg-neutral-950 px-4 py-4 text-white sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="rounded-full bg-green-500/15 px-2.5 py-1 text-[11px] font-bold text-green-200 ring-1 ring-green-400/20">
                    {{ current?.category || 'Umum' }}
                  </span>

                  <span
                    v-for="tag in current?.tags || []"
                    :key="tag"
                    class="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80 ring-1 ring-white/10"
                  >
                    #{{ tag }}
                  </span>
                </div>

                <h3 class="mt-2 truncate text-base font-black sm:text-lg">
                  {{ current?.title || 'Preview Galeri' }}
                </h3>
              </div>

              <div class="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  class="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-white transition hover:bg-white/20"
                  title="Sebelumnya"
                  @click="prev"
                >
                  <Icon icon="lucide:chevron-left" class="h-5 w-5" />
                </button>

                <button
                  type="button"
                  class="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-white transition hover:bg-white/20"
                  title="Berikutnya"
                  @click="next"
                >
                  <Icon icon="lucide:chevron-right" class="h-5 w-5" />
                </button>

                <button
                  type="button"
                  class="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-white transition hover:bg-white/20"
                  title="Reset zoom"
                  @click="resetZoom()"
                >
                  <Icon icon="lucide:scan" class="h-5 w-5" />
                </button>

                <button
                  type="button"
                  class="grid h-10 w-10 place-items-center rounded-2xl bg-white text-neutral-950 transition hover:bg-green-100"
                  aria-label="Close"
                  @click="closeLightbox"
                >
                  <Icon icon="lucide:x" class="h-5 w-5" />
                </button>
              </div>
            </header>

            <!-- Image Stage -->
            <div
              ref="stageRef"
              class="relative h-full min-h-0 flex-1 select-none overflow-hidden bg-black touch-none"
              :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
              @wheel="onWheel"
              @mousedown="onPointerDown"
              @mousemove="onPointerMove"
              @mouseup="onPointerUp"
              @mouseleave="onPointerUp"
              @touchstart.passive="onTouchStart"
              @touchmove.prevent="onTouchMove"
              @touchend="onTouchEnd"
              @dblclick="onDblClick"
            >
              <img
                v-if="current?.src && !isBrokenImage(current.src)"
                :src="current.src"
                :alt="current?.title || 'Gallery preview'"
                class="absolute left-1/2 top-1/2 will-change-transform"
                :style="imgStyle"
                draggable="false"
                @load="onImageLoaded"
                @error="markBroken(current.src)"
              >

              <div
                v-else
                class="grid h-full min-h-[360px] place-items-center bg-gradient-to-br from-neutral-900 to-black p-6 text-center"
              >
                <div>
                  <div class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-green-300 ring-1 ring-white/10">
                    <Icon icon="lucide:image-off" class="h-7 w-7" />
                  </div>
                  <p class="mt-4 text-base font-black text-white">Invalid image url</p>
                  <p class="mt-1 text-sm text-white/50">Gambar tidak dapat dimuat atau URL tidak valid.</p>
                </div>
              </div>

              <div class="pointer-events-none absolute bottom-4 left-4 hidden rounded-2xl bg-black/50 px-3 py-2 text-xs font-semibold text-white/80 backdrop-blur md:block">
                Scroll untuk zoom • Drag untuk geser • Double click untuk zoom cepat
              </div>
            </div>

            <!-- Modal Footer -->
            <footer class="flex shrink-0 flex-col gap-3 border-t border-white/10 bg-neutral-950 px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div class="flex items-center gap-2 text-xs font-semibold text-white/70">
                <span>{{ index + 1 }} / {{ filtered.length }}</span>
                <span class="h-1 w-1 rounded-full bg-white/30"></span>
                <span>{{ scalePercent }}%</span>
              </div>

              <div class="flex items-center gap-3">
                <button
                  type="button"
                  class="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
                  @click="zoomOut"
                >
                  <Icon icon="lucide:zoom-out" class="h-4 w-4" />
                </button>

                <input
                  v-model.number="scale"
                  type="range"
                  :min="minScale"
                  :max="maxScale"
                  step="0.05"
                  class="h-2 w-36 accent-green-500"
                  @input="clampPan"
                >

                <button
                  type="button"
                  class="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
                  @click="zoomIn"
                >
                  <Icon icon="lucide:zoom-in" class="h-4 w-4" />
                </button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </teleport>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useHead, useRuntimeConfig, useSeoMeta } from 'nuxt/app'
import { Icon } from '@iconify/vue'
import { useWeb } from '~/composables/data/useWeb'

definePageMeta({
  ssr: false
})

type GallerySourceItem = {
  src?: string
  title?: string
  category?: string
  tagsText?: string
  tags?: string[]
  createdAt?: number
  cloudinaryPublicId?: string
}

type GalleryItem = {
  src: string
  title: string
  category: string
  tags: string[]
  createdAt: number
  cloudinaryPublicId?: string
}

type Shape = {
  hero: {
    cover: string
    badge: string
    title: string
    subtitle: string
    heightSm: string
    heightLg: string
  }
  texts: {
    searchPlaceholder: string
    categoryAll: string
    loadMore: string
  }
  gallery: {
    items: GallerySourceItem[]
  }
}

type WebPageSnapshot = {
  meta?: {
    title?: string
    description?: string
    ogImage?: string
    themeColor?: string
    robots?: string
    organizationName?: string
    siteName?: string
    logo?: string
  }
  sections?: Array<{
    key?: string
    props?: any
  }>
}

const PATH = '/gallery'

const defaults: Shape = {
  hero: {
    cover: '',
    badge: 'Galeri',
    title: 'Galeri Lembaga',
    subtitle: 'Dokumentasi kegiatan, fasilitas, dan momen terbaik lembaga.',
    heightSm: '36vh',
    heightLg: '44vh'
  },
  texts: {
    searchPlaceholder: 'Cari foto, kategori, atau tag…',
    categoryAll: 'Semua Kategori',
    loadMore: 'Tampilkan Lebih Banyak'
  },
  gallery: {
    items: []
  }
}

const config = useRuntimeConfig()
const web = useWeb()

const q = ref('')
const selectedCategory = ref('all')
const selectedTag = ref('all')
const sortBy = ref<'newest' | 'oldest' | 'title'>('newest')
const page = ref(1)
const pageSize = 12

const brokenImages = ref<Record<string, boolean>>({})

const isLg = ref(false)

const lightboxOpen = ref(false)
const index = ref(0)
const stageRef = ref<HTMLElement | null>(null)
const naturalW = ref(0)
const naturalH = ref(0)
const fitScale = ref(1)
const scale = ref(1)
const maxScale = 4
const tx = ref(0)
const ty = ref(0)
const isDragging = ref(false)

const FALLBACK_CREATED_AT = Date.now()

const pageSnap = ref<WebPageSnapshot | null>(null)
const pageSnapError = ref('')
const loading = ref(true)

function getCurrentHost() {
  if (typeof window !== 'undefined') {
    return window.location.host
  }

  return String(config.public?.siteUrl || config.public?.siteURL || 'default')
}

function snapshotStorageKey() {
  return `obayan-page-snapshot:${getCurrentHost()}:${PATH}`
}

function normalizeSnapshot(snapshot: any): WebPageSnapshot | null {
  if (!snapshot || typeof snapshot !== 'object') return null

  return {
    meta: snapshot.meta && typeof snapshot.meta === 'object' ? snapshot.meta : {},
    sections: Array.isArray(snapshot.sections) ? snapshot.sections : []
  }
}

function hydrateSnapshotFromCache() {
  if (typeof window === 'undefined') return

  try {
    const raw = window.sessionStorage.getItem(snapshotStorageKey())
    if (!raw) return

    const parsed = JSON.parse(raw)
    const normalized = normalizeSnapshot(parsed)

    if (normalized) {
      pageSnap.value = normalized
    }
  } catch {
    // ignore cache error
  }
}

function cacheSnapshot(snapshot: WebPageSnapshot | null) {
  if (typeof window === 'undefined' || !snapshot) return

  try {
    window.sessionStorage.setItem(snapshotStorageKey(), JSON.stringify(snapshot))
  } catch {
    // ignore cache error
  }
}


async function loadPageSnapshot() {
  loading.value = !pageSnap.value
  pageSnapError.value = ''

  try {
    const api = web as any
    api?.setActivePath?.(PATH)

    let snapshot: WebPageSnapshot | null = null

    if (typeof api?.getPageSnapshot === 'function') {
      snapshot = normalizeSnapshot(await api.getPageSnapshot(PATH))
    } else if (typeof api?.subscribePage === 'function') {
      try {
        await api.subscribePage(PATH)

        snapshot = normalizeSnapshot({
          meta: api.meta?.value || api.meta || {},
          sections: api.sections?.value || api.sections || []
        })
      } catch (err: any) {
        pageSnapError.value = String(err?.message || err || 'Gagal memuat konfigurasi galeri.')
      }
    }

    if (snapshot) {
      pageSnap.value = snapshot
      cacheSnapshot(snapshot)
    }
  } catch (err: any) {
    pageSnapError.value = String(err?.message || err || 'Gagal memuat konfigurasi galeri.')
    hydrateSnapshotFromCache()
  } finally {
    loading.value = false
  }
}

const isPageConfigLoading = computed(() => {
  return loading.value && !pageSnap.value
})

const isInitialLoading = computed(() => {
  return loading.value && !pageSnap.value
})

let mediaQuery: MediaQueryList | null = null
let startX = 0
let startY = 0
let startTx = 0
let startTy = 0
let pinchStartDist = 0
let pinchStartScale = 1
let pinchCenter = { x: 0, y: 0 }

const pageMeta = computed(() => {
  return pageSnap.value?.meta && typeof pageSnap.value.meta === 'object'
    ? pageSnap.value.meta
    : {}
})

const galleryProps = computed<Partial<Shape>>(() => {
  const list = Array.isArray(pageSnap.value?.sections) ? pageSnap.value?.sections || [] : []
  const found = list.find((section: any) => section?.key === 'GalleryPage')?.props

  return found && typeof found === 'object' ? found as Partial<Shape> : {}
})

const shape = computed<Shape>(() => {
  return merge(defaults, galleryProps.value)
})

const hero = computed<Shape['hero']>(() => {
  return shape.value?.hero || defaults.hero
})

const texts = computed<Shape['texts']>(() => {
  return shape.value?.texts || defaults.texts
})

const siteOrigin = computed(() => {
  const fromRuntime =
    config.public?.siteUrl ||
    config.public?.siteURL ||
    config.public?.site_url ||
    ''

  if (fromRuntime) {
    return String(fromRuntime).replace(/\/$/, '')
  }

  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return ''
})

function toAbsoluteUrl(url?: string) {
  const raw = String(url || '/assets/logo.png').trim()

  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw
  }

  if (!siteOrigin.value) return raw

  return `${siteOrigin.value}${raw.startsWith('/') ? raw : `/${raw}`}`
}

function stripHtml(value?: string) {
  return String(value || '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function limitSeoText(value?: string, max = 160) {
  const clean = stripHtml(value)
  if (!clean) return ''
  return clean.length > max ? `${clean.slice(0, max).trim()}...` : clean
}

const canonical = computed(() => {
  return siteOrigin.value ? `${siteOrigin.value}${PATH}` : PATH
})

const organizationName = computed(() => {
  return resolveSyncedText(
    pageMeta.value?.organizationName || pageMeta.value?.siteName,
    'Lembaga'
  )
})

const seoTitle = computed(() => {
  const fallbackTitle = hero.value?.title || defaults.hero.title || 'Galeri Lembaga'

  return resolveSyncedText(
    pageMeta.value?.title,
    fallbackTitle
  )
})

const seoDesc = computed(() => {
  return limitSeoText(
    pageMeta.value?.description ||
      hero.value?.subtitle ||
      defaults.hero.subtitle ||
      'Dokumentasi kegiatan, fasilitas, dan momen terbaik lembaga.',
    160
  )
})

const ogImage = computed(() => {
  return toAbsoluteUrl(
    pageMeta.value?.ogImage ||
      hero.value?.cover ||
      pageMeta.value?.logo ||
      '/assets/logo.png'
  )
})

const themeColor = computed(() => {
  return pageMeta.value?.themeColor || config.public?.themeColor || '#16a34a'
})

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDesc.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDesc.value,
  ogType: 'website',
  ogUrl: () => canonical.value,
  ogImage: () => ogImage.value,
  ogImageAlt: () => organizationName.value,
  ogSiteName: () => organizationName.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => seoTitle.value,
  twitterDescription: () => seoDesc.value,
  twitterImage: () => ogImage.value,
  themeColor: () => themeColor.value,
  robots: () => pageMeta.value?.robots || 'index, follow'
})

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: canonical.value
    }
  ]
}))

const items = computed<GalleryItem[]>(() => {
  return (shape.value?.gallery?.items || []).map((item, idx) => {
    const tags = Array.isArray(item.tags)
      ? item.tags.map((tag) => String(tag).trim()).filter(Boolean)
      : tagsArray(item.tagsText)

    return {
      src: String(item.src || '').trim(),
      title: String(item.title || '').trim() || `Dokumentasi #${idx + 1}`,
      category: String(item.category || '').trim() || 'Umum',
      tags,
      createdAt: Number.isFinite(Number(item.createdAt)) ? Number(item.createdAt) : FALLBACK_CREATED_AT - (idx + 1) * 86400000,
      cloudinaryPublicId: String(item.cloudinaryPublicId || '').trim()
    }
  })
})

const categories = computed(() => {
  return Array.from(new Set(items.value.map((item) => item.category).filter(Boolean))).sort((a, b) => a.localeCompare(b))
})

const allTags = computed(() => {
  return Array.from(new Set(items.value.flatMap((item) => item.tags).filter(Boolean))).sort((a, b) => a.localeCompare(b))
})

const filtered = computed(() => {
  const query = normalizeSearchText(q.value)

  const result = items.value.filter((item) => {
    const title = normalizeSearchText(item.title)
    const category = normalizeSearchText(item.category)
    const tags = item.tags.map((tag) => normalizeSearchText(tag))

    const matchQuery =
      !query ||
      title.includes(query) ||
      category.includes(query) ||
      tags.some((tag) => tag.includes(query))

    const matchCategory = selectedCategory.value === 'all' || item.category === selectedCategory.value
    const matchTag = selectedTag.value === 'all' || item.tags.includes(selectedTag.value)

    return matchQuery && matchCategory && matchTag
  })

  if (sortBy.value === 'newest') {
    result.sort((a, b) => b.createdAt - a.createdAt)
  }

  if (sortBy.value === 'oldest') {
    result.sort((a, b) => a.createdAt - b.createdAt)
  }

  if (sortBy.value === 'title') {
    result.sort((a, b) => a.title.localeCompare(b.title))
  }

  return result
})

const heroHeight = computed(() => {
  return isLg.value
    ? hero.value?.heightLg || defaults.hero.heightLg
    : hero.value?.heightSm || defaults.hero.heightSm
})

const startIndex = computed(() => 0)

const paged = computed(() => {
  return filtered.value.slice(0, page.value * pageSize)
})

const hasMore = computed(() => {
  return paged.value.length < filtered.value.length
})

const hasActiveFilter = computed(() => {
  return Boolean(q.value || selectedCategory.value !== 'all' || selectedTag.value !== 'all')
})

const current = computed(() => {
  return filtered.value[index.value]
})

const minScale = computed(() => {
  return Math.max(0.1, fitScale.value)
})

const scalePercent = computed(() => {
  return Math.round(scale.value * 100)
})

const imgStyle = computed(() => {
  return {
    transform: `translate(-50%, -50%) translate(${tx.value}px, ${ty.value}px) scale(${scale.value})`,
    transformOrigin: 'center center',
    maxWidth: 'none',
    maxHeight: 'none',
    userSelect: 'none',
    pointerEvents: 'none'
  }
})

watch([q, selectedCategory, selectedTag, sortBy], () => {
  page.value = 1
})

onMounted(async () => {
  hydrateSnapshotFromCache()

  setupMediaQuery()
  setupResizeListener()

  await loadPageSnapshot()
})

function resolveSyncedText(value: unknown, fallback: string, legacySet?: Set<string>) {
  const text = String(value || '').trim()

  if (!text) return fallback
  if (legacySet?.has(text)) return fallback

  return text
}

function normalizeSearchText(value: string) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function merge(base: Shape, patch?: Partial<Shape>): Shape {
  return {
    hero: {
      cover: resolveSyncedText(patch?.hero?.cover, base.hero.cover),
      badge: resolveSyncedText(patch?.hero?.badge, base.hero.badge),
      title: resolveSyncedText(patch?.hero?.title, base.hero.title),
      subtitle: resolveSyncedText(patch?.hero?.subtitle, base.hero.subtitle),
      heightSm: resolveSyncedText(patch?.hero?.heightSm, base.hero.heightSm),
      heightLg: resolveSyncedText(patch?.hero?.heightLg, base.hero.heightLg)
    },
    texts: {
      searchPlaceholder: resolveSyncedText(patch?.texts?.searchPlaceholder, base.texts.searchPlaceholder),
      categoryAll: resolveSyncedText(patch?.texts?.categoryAll, base.texts.categoryAll),
      loadMore: resolveSyncedText(patch?.texts?.loadMore, base.texts.loadMore)
    },
    gallery: {
      items: Array.isArray(patch?.gallery?.items) ? patch.gallery.items : base.gallery.items
    }
  }
}

function tagsArray(value?: string) {
  return String(value || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function markBroken(src?: string) {
  if (!src) return

  brokenImages.value = {
    ...brokenImages.value,
    [src]: true
  }
}

function clearBroken(src?: string) {
  if (!src || !brokenImages.value[src]) return

  const next = { ...brokenImages.value }
  delete next[src]
  brokenImages.value = next
}

function isBrokenImage(src?: string) {
  if (!src) return false
  return Boolean(brokenImages.value[src])
}

function resetFilters() {
  q.value = ''
  selectedCategory.value = 'all'
  selectedTag.value = 'all'
  sortBy.value = 'newest'
  page.value = 1
}

function loadMore() {
  page.value += 1
}

function setupMediaQuery() {
  mediaQuery = window.matchMedia('(min-width: 1024px)')
  updateIsLg()
  mediaQuery.addEventListener('change', updateIsLg)
}

function updateIsLg() {
  isLg.value = Boolean(mediaQuery?.matches)
}

function setupResizeListener() {
  window.addEventListener('resize', onWindowResize)
}

function onWindowResize() {
  if (!lightboxOpen.value) return

  computeFitScale()
  resetZoom(false)
}

function openLightbox(targetIndex: number) {
  if (!filtered.value.length) return

  index.value = Math.min(Math.max(targetIndex, 0), filtered.value.length - 1)
  lightboxOpen.value = true

  naturalW.value = 0
  naturalH.value = 0
  fitScale.value = 1
  scale.value = 1
  tx.value = 0
  ty.value = 0

  nextTick(() => {
    document.addEventListener('keydown', onKey)
    lockScroll(true)
  })
}

function closeLightbox() {
  lightboxOpen.value = false
  document.removeEventListener('keydown', onKey)
  lockScroll(false)
}

function prev() {
  if (!filtered.value.length) return

  index.value = (index.value - 1 + filtered.value.length) % filtered.value.length
  resetZoom(false)
  clearBroken(current.value?.src)
}

function next() {
  if (!filtered.value.length) return

  index.value = (index.value + 1) % filtered.value.length
  resetZoom(false)
  clearBroken(current.value?.src)
}

function onImageLoaded(event: Event) {
  const image = event.target as HTMLImageElement
  naturalW.value = image.naturalWidth || image.width
  naturalH.value = image.naturalHeight || image.height

  computeFitScale()
  resetZoom()
}

function computeFitScale() {
  const stage = stageRef.value

  if (!stage || !naturalW.value || !naturalH.value) {
    fitScale.value = 1
    return
  }

  const rect = stage.getBoundingClientRect()
  const scaleX = rect.width / naturalW.value
  const scaleY = rect.height / naturalH.value
  const nextScale = Math.min(scaleX, scaleY)

  fitScale.value = Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1
}

function resetZoom(center = true) {
  scale.value = minScale.value
  tx.value = 0
  ty.value = 0

  if (center) {
    clampPan()
  }
}

function zoomIn() {
  scale.value = Math.min(maxScale, scale.value + 0.15)
  clampPan()
}

function zoomOut() {
  scale.value = Math.max(minScale.value, scale.value - 0.15)
  clampPan()
}

function clampPan() {
  const stage = stageRef.value

  if (!stage) return

  const rect = stage.getBoundingClientRect()
  const imageWidth = naturalW.value * scale.value
  const imageHeight = naturalH.value * scale.value

  const boundX = Math.max(0, (imageWidth - rect.width) / 2)
  const boundY = Math.max(0, (imageHeight - rect.height) / 2)

  tx.value = Math.max(Math.min(tx.value, boundX), -boundX)
  ty.value = Math.max(Math.min(ty.value, boundY), -boundY)
}

function lockScroll(active: boolean) {
  document.documentElement.style.overflow = active ? 'hidden' : ''
}

function onKey(event: KeyboardEvent) {
  if (!lightboxOpen.value) return

  if (event.key === 'Escape') closeLightbox()
  if (event.key === 'ArrowLeft') prev()
  if (event.key === 'ArrowRight') next()
}

function onWheel(event: WheelEvent) {
  const stage = stageRef.value

  if (!stage) return

  event.preventDefault()

  const rect = stage.getBoundingClientRect()
  const centerX = event.clientX - rect.left - rect.width / 2
  const centerY = event.clientY - rect.top - rect.height / 2
  const previousScale = scale.value

  let nextScale = previousScale * (1 - event.deltaY * 0.001)
  nextScale = Math.min(Math.max(nextScale, minScale.value), maxScale)

  if (nextScale === previousScale) return

  const ratio = nextScale / previousScale

  tx.value = centerX - ratio * (centerX - tx.value)
  ty.value = centerY - ratio * (centerY - ty.value)
  scale.value = nextScale

  clampPan()
}

function onPointerDown(event: MouseEvent) {
  if (event.button !== 0) return

  isDragging.value = true
  startX = event.clientX
  startY = event.clientY
  startTx = tx.value
  startTy = ty.value
}

function onPointerMove(event: MouseEvent) {
  if (!isDragging.value) return

  tx.value = startTx + event.clientX - startX
  ty.value = startTy + event.clientY - startY

  clampPan()
}

function onPointerUp() {
  isDragging.value = false
}

function onDblClick(event: MouseEvent) {
  const stage = stageRef.value

  if (!stage) return

  const rect = stage.getBoundingClientRect()
  const centerX = event.clientX - rect.left - rect.width / 2
  const centerY = event.clientY - rect.top - rect.height / 2
  const previousScale = scale.value
  const targetScale = previousScale < minScale.value * 2 ? previousScale * 2 : minScale.value
  const nextScale = Math.min(Math.max(targetScale, minScale.value), maxScale)
  const ratio = nextScale / previousScale

  tx.value = centerX - ratio * (centerX - tx.value)
  ty.value = centerY - ratio * (centerY - ty.value)
  scale.value = nextScale

  if (nextScale === minScale.value) {
    tx.value = 0
    ty.value = 0
  }

  clampPan()
}

function onTouchStart(event: TouchEvent) {
  if (event.touches.length === 1) {
    isDragging.value = true
    startX = event.touches[0]!.clientX
    startY = event.touches[0]!.clientY
    startTx = tx.value
    startTy = ty.value
  }

  if (event.touches.length === 2) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()

    pinchStartDist = distance(event.touches[0]!, event.touches[1]!)
    pinchStartScale = scale.value
    pinchCenter = midpoint(event.touches[0]!, event.touches[1]!, rect)
  }
}

function onTouchMove(event: TouchEvent) {
  if (event.touches.length === 1 && isDragging.value) {
    tx.value = startTx + event.touches[0]!.clientX - startX
    ty.value = startTy + event.touches[0]!.clientY - startY

    clampPan()
  }

  if (event.touches.length === 2 && pinchStartDist > 0) {
    const currentDistance = distance(event.touches[0]!, event.touches[1]!)
    const previousScale = scale.value

    let nextScale = pinchStartScale * (currentDistance / pinchStartDist)
    nextScale = Math.min(Math.max(nextScale, minScale.value), maxScale)

    const ratio = nextScale / previousScale

    tx.value = pinchCenter.x - ratio * (pinchCenter.x - tx.value)
    ty.value = pinchCenter.y - ratio * (pinchCenter.y - ty.value)
    scale.value = nextScale

    clampPan()
  }
}

function onTouchEnd() {
  isDragging.value = false

  if (pinchStartDist > 0 && scale.value < minScale.value * 1.02) {
    resetZoom()
  }

  pinchStartDist = 0
}

function distance(touchA: Touch, touchB: Touch) {
  const deltaX = touchB.clientX - touchA.clientX
  const deltaY = touchB.clientY - touchA.clientY

  return Math.hypot(deltaX, deltaY)
}

function midpoint(touchA: Touch, touchB: Touch, rect: DOMRect) {
  return {
    x: (touchA.clientX + touchB.clientX) / 2 - rect.left - rect.width / 2,
    y: (touchA.clientY + touchB.clientY) / 2 - rect.top - rect.height / 2
  }
}
</script>

<style scoped>
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>