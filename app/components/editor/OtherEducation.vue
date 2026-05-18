<template>
  <section class="relative overflow-hidden rounded-4xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
    <!-- Header -->
    <div class="relative overflow-hidden border-b border-gray-200 bg-linear-to-br from-green-50 via-white to-lime-50 px-5 py-5 dark:border-neutral-800 dark:from-green-950/20 dark:via-neutral-900 dark:to-neutral-900 md:px-6">
      <div class="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-green-300/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-20 left-8 h-40 w-40 rounded-full bg-lime-300/20 blur-3xl"></div>

      <div class="relative z-10">
        <div class="inline-flex items-center gap-2 rounded-full border border-green-100 bg-white/80 px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm backdrop-blur dark:border-green-900/40 dark:bg-neutral-900/70 dark:text-green-300">
          <span class="h-2 w-2 rounded-full bg-green-500"></span>
          Other Education Slider Editor
        </div>

        <h2 class="mt-4 text-xl font-black tracking-tight text-gray-950 dark:text-white">
          Kelola Hero Slider Other Education
        </h2>

        <p class="mt-2 max-w-3xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
          Atur daftar kegiatan, pendidikan tambahan, agenda, lokasi, jadwal, interval, kategori, tags, gambar, dan deskripsi rich text untuk slider.
        </p>
      </div>

      <!-- Tabs -->
      <div class="relative z-10 mt-5 flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-black transition"
          :class="activeTab === tab.key
            ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
            : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white'"
          @click="onChangeTab(tab.key)"
        >
          <Icon :icon="tab.icon" class="h-4 w-4" />
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Notices -->
    <div v-if="savedNote || errNote || uploadError || deleteError" class="px-5 pt-5 md:px-6">
      <div
        v-if="savedNote"
        class="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 dark:border-green-900/40 dark:bg-green-900/10 dark:text-green-300"
      >
        {{ savedNote }}
      </div>

      <div
        v-if="errNote || uploadError || deleteError"
        class="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300"
      >
        {{ errNote || uploadError || deleteError }}
      </div>
    </div>

    <div class="p-5 pb-28 md:p-6 md:pb-28">
      <!-- Section Setting -->
      <div v-show="activeTab === 'Section'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-linear-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <h3 class="text-lg font-black text-gray-900 dark:text-white">
            Pengaturan Section
          </h3>
          <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
            Bagian ini untuk judul utama section slider dan konfigurasi autoplay.
          </p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Eyebrow
            </label>
            <input
              v-model.trim="form.eyebrow"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Pendidikan Lainnya"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Slider Delay / ms
            </label>
            <input
              v-model.number="form.sliderDelay"
              type="number"
              min="1000"
              step="500"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="4500"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50 md:col-span-2">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Title
            </label>
            <input
              v-model.trim="form.title"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Program Pendidikan & Kegiatan Pengembangan"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50 md:col-span-2">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Subtitle
            </label>
            <textarea
              v-model.trim="form.subtitle"
              rows="4"
              class="block w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Deskripsi singkat section..."
            ></textarea>
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="flex items-center gap-3">
              <input
                v-model="form.autoplay"
                type="checkbox"
                class="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span class="text-sm font-bold text-gray-700 dark:text-neutral-200">
                Aktifkan autoplay slider
              </span>
            </label>
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="flex items-center gap-3">
              <input
                v-model="form.showControls"
                type="checkbox"
                class="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span class="text-sm font-bold text-gray-700 dark:text-neutral-200">
                Tampilkan tombol navigasi
              </span>
            </label>
          </div>
        </div>
      </div>

      <!-- Slides -->
      <div v-show="activeTab === 'Slides'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-linear-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Data Slide
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Pilih slide aktif, lalu ubah detail kontennya.
              </p>
            </div>

            <button
              type="button"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
              @click="addSlide"
            >
              <Icon icon="lucide:plus" class="h-4 w-4" />
              Tambah Slide
            </button>
          </div>
        </div>

        <!-- Slide selector -->
        <div class="rounded-[28px] border border-gray-200 bg-gray-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50">
          <div class="flex min-w-0 gap-2 overflow-x-auto pb-1">
            <button
              v-for="(slide, index) in form.slides"
              :key="slide.id"
              type="button"
              class="inline-flex shrink-0 items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-black transition"
              :class="activeSlideId === slide.id
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
                : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800'"
              @click="setActiveSlide(slide.id)"
            >
              <span
                class="grid h-5 w-5 place-items-center rounded-full text-[10px]"
                :class="activeSlideId === slide.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 dark:bg-neutral-800 dark:text-neutral-300'"
              >
                {{ index + 1 }}
              </span>
              <span class="max-w-40 truncate">
                {{ slide.title || 'Slide Baru' }}
              </span>
            </button>
          </div>
        </div>

        <div v-if="activeSlide" class="grid gap-5 xl:grid-cols-[360px,minmax(0,1fr)]">
          <!-- Preview card -->
          <aside class="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="relative h-56 overflow-hidden bg-gray-100 dark:bg-neutral-800">
              <img
                v-if="activeSlide.image"
                :src="activeSlide.image"
                class="h-full w-full object-cover"
                alt="Slide preview"
              />
              <div v-else class="grid h-full place-items-center text-center">
                <div>
                  <Icon icon="lucide:image-plus" class="mx-auto h-9 w-9 text-gray-400" />
                  <p class="mt-2 text-sm font-semibold text-gray-500 dark:text-neutral-400">
                    Belum ada gambar
                  </p>
                </div>
              </div>

              <div class="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
                <span
                  v-if="activeSlide.category"
                  class="rounded-full bg-white/90 px-3 py-1 text-xs font-black text-green-700 shadow-sm backdrop-blur"
                >
                  {{ activeSlide.category }}
                </span>
              </div>
            </div>

            <div class="p-5">
              <h4 class="line-clamp-2 text-lg font-black text-gray-950 dark:text-white">
                {{ activeSlide.title || 'Judul slide belum diisi' }}
              </h4>

              <p class="mt-2 line-clamp-3 text-sm leading-6 text-gray-500 dark:text-neutral-400">
                {{ activeSlide.short_description || 'Short description belum diisi.' }}
              </p>

              <div class="mt-4 space-y-2 text-xs font-semibold text-gray-500 dark:text-neutral-400">
                <div class="flex items-center gap-2">
                  <Icon icon="lucide:map-pin" class="h-4 w-4 text-green-600" />
                  <span>{{ activeSlide.location || 'Lokasi belum diisi' }}</span>
                </div>

                <div class="flex items-center gap-2">
                  <Icon icon="lucide:calendar-days" class="h-4 w-4 text-green-600" />
                  <span>{{ activeSlide.start_date || 'Start' }} — {{ activeSlide.end_date || 'End' }}</span>
                </div>

                <div class="flex items-center gap-2">
                  <Icon icon="lucide:repeat" class="h-4 w-4 text-green-600" />
                  <span>{{ activeSlide.interval || 'Interval belum diisi' }}</span>
                </div>
              </div>

              <div v-if="activeSlide.tags.length" class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="tag in activeSlide.tags"
                  :key="tag"
                  class="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-600 dark:bg-neutral-800 dark:text-neutral-300"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
          </aside>

          <!-- Form -->
          <div class="space-y-5">
            <div class="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                @click="duplicateSlide(activeSlide.id)"
              >
                <Icon icon="lucide:copy" class="h-4 w-4" />
                Duplikat
              </button>

              <button
                type="button"
                class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white px-3 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
                :disabled="form.slides.length <= 1"
                @click="removeSlide(activeSlide.id)"
              >
                <Icon icon="lucide:trash-2" class="h-4 w-4" />
                Hapus
              </button>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50 md:col-span-2">
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Title
                </label>
                <input
                  v-model.trim="activeSlide.title"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="Madrasah Diniyah, Tahfidz, Kajian Kitab, dll"
                />
              </div>

              <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Lokasi
                </label>
                <input
                  v-model.trim="activeSlide.location"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="Aula Pesantren / Desa Martopuro / Masjid"
                />
              </div>

              <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Category
                </label>
                <input
                  v-model.trim="activeSlide.category"
                  list="other-education-category-options"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="Tahfidz / Diniyah / Workshop"
                />

                <datalist id="other-education-category-options">
                  <option v-for="category in categoryOptions" :key="category" :value="category" />
                </datalist>
              </div>

              <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Start Date
                </label>
                <input
                  v-model="activeSlide.start_date"
                  type="date"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  End Date
                </label>
                <input
                  v-model="activeSlide.end_date"
                  type="date"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50 md:col-span-2">
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Interval / Setiap Kapan
                </label>
                <input
                  v-model.trim="activeSlide.interval"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="Setiap Ahad, Setiap Jumat, Mingguan, Bulanan, 2 minggu sekali"
                />
              </div>

              <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50 md:col-span-2">
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Short Description
                </label>
                <textarea
                  v-model.trim="activeSlide.short_description"
                  rows="4"
                  class="block w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="Deskripsi singkat untuk card slider..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Media -->
      <div v-show="activeTab === 'Media'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-linear-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Media Slide Aktif
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Upload ke Cloudinary atau gunakan URL gambar publik untuk slide aktif.
              </p>
            </div>

            <div class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm ring-1 ring-green-100 dark:bg-neutral-900 dark:text-green-300 dark:ring-green-900/40">
              <span class="h-2 w-2 rounded-full bg-green-500"></span>
              JPG / PNG / WebP · Max 5 MB
            </div>
          </div>
        </div>

        <section v-if="activeSlide" class="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="border-b border-gray-200 px-5 py-4 dark:border-neutral-800">
            <div class="flex items-center justify-between gap-3">
              <div>
                <h4 class="text-sm font-black text-gray-900 dark:text-white">
                  Image: {{ activeSlide.title || 'Slide Aktif' }}
                </h4>
                <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                  Disarankan landscape 16:9. Upload akan diresize maksimal 1600×1000.
                </p>
              </div>

              <button
                v-if="activeSlide.image"
                type="button"
                class="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
                :disabled="mediaBusy"
                @click="removeImage"
              >
                <Icon icon="lucide:trash-2" class="h-4 w-4" />
                Hapus
              </button>
            </div>
          </div>

          <div class="grid gap-5 p-5 lg:grid-cols-[1fr,1.1fr]">
            <div class="relative overflow-hidden rounded-[24px] border border-gray-200 bg-gray-100 dark:border-neutral-800 dark:bg-neutral-800">
              <img
                v-if="activeSlide.image"
                :src="activeSlide.image"
                alt="Other education preview"
                class="h-72 w-full object-cover"
              />

              <div v-else class="grid h-72 place-items-center text-center">
                <div>
                  <Icon icon="lucide:image-plus" class="mx-auto h-9 w-9 text-gray-400" />
                  <p class="mt-2 text-sm font-semibold text-gray-500 dark:text-neutral-400">
                    Belum ada gambar
                  </p>
                </div>
              </div>

              <div
                v-if="progress[activeSlide.id] != null"
                class="absolute inset-x-4 bottom-4 overflow-hidden rounded-full bg-white/70 p-1 backdrop-blur dark:bg-neutral-950/70"
              >
                <div
                  class="h-2 rounded-full bg-green-500 transition-all"
                  :style="{ width: `${progress[activeSlide.id]}%` }"
                ></div>
              </div>
            </div>

            <div class="space-y-4">
              <div class="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                <button
                  type="button"
                  class="rounded-xl px-3 py-2 text-xs font-bold transition"
                  :class="mediaMode[activeSlide.id] === 'upload'
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                    : 'text-gray-500 dark:text-neutral-300'"
                  @click="mediaMode[activeSlide.id] = 'upload'"
                >
                  Upload
                </button>

                <button
                  type="button"
                  class="rounded-xl px-3 py-2 text-xs font-bold transition"
                  :class="mediaMode[activeSlide.id] === 'url'
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                    : 'text-gray-500 dark:text-neutral-300'"
                  @click="mediaMode[activeSlide.id] = 'url'"
                >
                  URL
                </button>
              </div>

              <div v-if="mediaMode[activeSlide.id] === 'upload'" class="rounded-[24px] border border-dashed border-green-200 bg-green-50/60 p-5 dark:border-green-900/40 dark:bg-green-900/10">
                <input
                  id="other-education-image-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  class="hidden"
                  @change="uploadCloudinaryImage"
                />

                <label
                  for="other-education-image-upload"
                  class="flex cursor-pointer flex-col items-center justify-center rounded-[22px] bg-white px-5 py-8 text-center ring-1 ring-green-100 transition hover:bg-green-50 dark:bg-neutral-900 dark:ring-green-900/40 dark:hover:bg-neutral-800"
                >
                  <Icon icon="lucide:upload-cloud" class="h-9 w-9 text-green-600 dark:text-green-300" />
                  <span class="mt-3 text-sm font-black text-gray-900 dark:text-white">
                    Upload Image
                  </span>
                  <span class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                    JPG, PNG, WebP · otomatis resize dan kompres
                  </span>
                </label>
              </div>

              <div v-else class="space-y-3">
                <input
                  v-model.trim="mediaUrlDraft[activeSlide.id]"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                />

                <button
                  type="button"
                  class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
                  :disabled="mediaBusy || !mediaUrlDraft[activeSlide.id]"
                  @click="applyImageUrl"
                >
                  <Icon icon="lucide:shield-check" class="h-4 w-4" />
                  Gunakan Link
                </button>
              </div>

              <p class="text-xs leading-5 text-gray-500 dark:text-neutral-400">
                Public ID:
                <code class="rounded bg-gray-100 px-1.5 py-0.5 dark:bg-neutral-800">
                  {{ activeSlide.imagePublicId || '—' }}
                </code>
              </p>
            </div>
          </div>
        </section>
      </div>

      <!-- Rich Text -->
      <div v-show="activeTab === 'Rich Text'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-linear-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Description Rich Tiptap
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Editor ini mengikuti style app/news.vue. Konten disimpan ke field
                <code>description_rich_tiptap</code> pada slide aktif.
              </p>
            </div>

            <div
              v-if="activeSlide"
              class="rounded-2xl bg-white px-3 py-2 text-xs font-bold text-green-700 ring-1 ring-green-100 dark:bg-neutral-900 dark:text-green-300 dark:ring-green-900/40"
            >
              {{ activeSlide.title || 'Slide aktif' }}
            </div>
          </div>
        </div>

        <div v-if="activeSlide" class="rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <!-- Top Toolbar -->
          <div
            v-if="editor"
            class="editor-toolbar-root sticky -top-4 z-40 rounded-t-3xl border-b border-gray-200 bg-white/95 p-3 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95"
          >
            <div class="flex flex-wrap items-center gap-2">
              <!-- Group: Text -->
              <div class="flex items-center gap-1 rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                <button
                  type="button"
                  class="toolbar-btn group relative"
                  :class="toolbarActive('paragraph')"
                  @click.prevent="runEditor(() => editor?.chain().focus().setParagraph().run())"
                >
                  P
                  <span class="toolbar-tooltip">Paragraph</span>
                </button>

                <button
                  type="button"
                  class="toolbar-btn group relative"
                  :class="toolbarActive('heading', { level: 1 })"
                  @click.prevent="runEditor(() => editor?.chain().focus().toggleHeading({ level: 1 }).run())"
                >
                  H1
                  <span class="toolbar-tooltip">Heading 1</span>
                </button>

                <button
                  type="button"
                  class="toolbar-btn group relative"
                  :class="toolbarActive('heading', { level: 2 })"
                  @click.prevent="runEditor(() => editor?.chain().focus().toggleHeading({ level: 2 }).run())"
                >
                  H2
                  <span class="toolbar-tooltip">Heading 2</span>
                </button>

                <button
                  type="button"
                  class="toolbar-btn group relative"
                  :class="toolbarActive('heading', { level: 3 })"
                  @click.prevent="runEditor(() => editor?.chain().focus().toggleHeading({ level: 3 }).run())"
                >
                  H3
                  <span class="toolbar-tooltip">Heading 3</span>
                </button>

                <button
                  type="button"
                  class="toolbar-btn group relative"
                  :class="toolbarActive('bold')"
                  @click.prevent="runEditor(() => editor?.chain().focus().toggleBold().run())"
                >
                  <span class="font-extrabold">B</span>
                  <span class="toolbar-tooltip">Bold</span>
                </button>

                <button
                  type="button"
                  class="toolbar-btn group relative"
                  :class="toolbarActive('italic')"
                  @click.prevent="runEditor(() => editor?.chain().focus().toggleItalic().run())"
                >
                  <span class="italic">I</span>
                  <span class="toolbar-tooltip">Italic</span>
                </button>

                <button
                  type="button"
                  class="toolbar-btn group relative"
                  :class="toolbarActive('blockquote')"
                  @click.prevent="runEditor(() => editor?.chain().focus().toggleBlockquote().run())"
                >
                  ❝
                  <span class="toolbar-tooltip">Quote</span>
                </button>
              </div>

              <!-- Group: List -->
              <div class="flex items-center gap-1 rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                <button
                  type="button"
                  class="toolbar-btn group relative"
                  :class="toolbarActive('bulletList')"
                  @click.prevent="runEditor(() => editor?.chain().focus().toggleBulletList().run())"
                >
                  • List
                  <span class="toolbar-tooltip">Bullet List</span>
                </button>

                <button
                  type="button"
                  class="toolbar-btn group relative"
                  :class="toolbarActive('orderedList')"
                  @click.prevent="runEditor(() => editor?.chain().focus().toggleOrderedList().run())"
                >
                  1. List
                  <span class="toolbar-tooltip">Ordered List</span>
                </button>
              </div>

              <!-- Group: Table -->
              <div class="relative">
                <div class="flex items-center gap-1 rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                  <button
                    type="button"
                    class="toolbar-btn group relative"
                    @click="toggleToolbarPanel('table')"
                  >
                    Table
                    <span class="toolbar-tooltip">Table tools</span>
                  </button>
                </div>

                <div
                  v-if="toolbarPanel === 'table'"
                  class="absolute left-0 top-full z-20 mt-2 w-[320px] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
                >
                  <div class="mb-3">
                    <div class="text-sm font-bold text-gray-900 dark:text-white">Table</div>
                    <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                      Tambah tabel baru atau atur row dan column pada tabel aktif.
                    </p>
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                        Rows
                      </label>
                      <input
                        v-model.number="tableForm.rows"
                        type="number"
                        min="1"
                        max="12"
                        class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label class="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                        Cols
                      </label>
                      <input
                        v-model.number="tableForm.cols"
                        type="number"
                        min="1"
                        max="8"
                        class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <label class="mt-3 flex items-center gap-2 text-sm text-gray-700 dark:text-neutral-200">
                    <input
                      v-model="tableForm.withHeaderRow"
                      type="checkbox"
                      class="rounded border-gray-300 text-green-600 focus:ring-green-500 dark:border-neutral-700 dark:bg-neutral-800"
                    />
                    Header row
                  </label>

                  <div class="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
                      @click="insertCustomTable"
                    >
                      Insert Table
                    </button>

                    <button
                      type="button"
                      class="toolbar-action-btn"
                      @click="runEditor(() => editor?.chain().focus().addRowAfter().run())"
                    >
                      + Row
                    </button>

                    <button
                      type="button"
                      class="toolbar-action-btn"
                      @click="runEditor(() => editor?.chain().focus().deleteRow().run())"
                    >
                      - Row
                    </button>

                    <button
                      type="button"
                      class="toolbar-action-btn"
                      @click="runEditor(() => editor?.chain().focus().addColumnAfter().run())"
                    >
                      + Col
                    </button>

                    <button
                      type="button"
                      class="toolbar-action-btn"
                      @click="runEditor(() => editor?.chain().focus().deleteColumn().run())"
                    >
                      - Col
                    </button>

                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
                      @click="runEditor(() => editor?.chain().focus().deleteTable().run())"
                    >
                      Delete Table
                    </button>
                  </div>
                </div>
              </div>

              <!-- Group: Embed -->
              <div class="relative">
                <div class="flex items-center gap-1 rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                  <button
                    type="button"
                    class="toolbar-btn group relative"
                    @click="toggleToolbarPanel('embed')"
                  >
                    Insert
                    <span class="toolbar-tooltip">Insert PDF / YouTube / Image / Maps</span>
                  </button>
                </div>

                <div
                  v-if="toolbarPanel === 'embed'"
                  class="absolute -left-16 top-full z-20 mt-2 w-[min(92vw,420px)] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
                >
                  <div class="mb-3">
                    <div class="text-sm font-bold text-gray-900 dark:text-white">Insert Embed</div>
                    <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                      Tambahkan video YouTube, PDF, gambar, Maps, atau link.
                    </p>
                  </div>

                  <div class="flex flex-wrap gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                    <button
                      v-for="type in embedTypes"
                      :key="type.value"
                      type="button"
                      class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
                      :class="embedForm.type === type.value
                        ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                        : 'text-gray-500 dark:text-neutral-300'"
                      @click="embedForm.type = type.value"
                    >
                      {{ type.label }}
                    </button>
                  </div>

                  <div class="mt-3 space-y-3">
                    <div v-if="embedForm.type === 'image'">
                      <div class="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                        <button
                          type="button"
                          class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
                          :class="embedForm.imageSource === 'upload'
                            ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                            : 'text-gray-500 dark:text-neutral-300'"
                          @click="embedForm.imageSource = 'upload'"
                        >
                          Upload
                        </button>

                        <button
                          type="button"
                          class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
                          :class="embedForm.imageSource === 'link'
                            ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                            : 'text-gray-500 dark:text-neutral-300'"
                          @click="embedForm.imageSource = 'link'"
                        >
                          Link
                        </button>
                      </div>
                    </div>

                    <div v-if="embedForm.type !== 'image' || embedForm.imageSource === 'link'">
                      <label class="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                        Link
                      </label>
                      <input
                        v-model.trim="embedForm.url"
                        type="url"
                        class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                        :placeholder="embedPlaceholder"
                      />
                    </div>

                    <div v-if="embedForm.type === 'image' && embedForm.imageSource === 'upload'">
                      <input
                        ref="editorImageInput"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="onPickEditorImage"
                      />

                      <button
                        type="button"
                        class="flex w-full items-center gap-3 rounded-2xl border border-dashed border-green-200 bg-green-50/60 p-4 text-left transition hover:border-green-400 hover:bg-green-50 dark:border-green-900/40 dark:bg-green-900/10"
                        @click="editorImageInput?.click()"
                      >
                        <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-green-600 shadow-sm ring-1 ring-green-100 dark:bg-neutral-900 dark:ring-green-900/40">
                          <Icon icon="lucide:upload-cloud" class="h-5 w-5" />
                        </div>

                        <div class="min-w-0 flex-1">
                          <p class="truncate text-sm font-bold text-gray-900 dark:text-white">
                            {{ editorImageFile?.name || 'Pilih gambar konten' }}
                          </p>
                          <p class="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                            PNG/JPG/WebP maksimal 5 MB.
                          </p>
                        </div>
                      </button>
                    </div>

                    <div v-if="['pdf', 'map', 'link', 'image'].includes(embedForm.type)">
                      <label class="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                        {{ embedForm.type === 'pdf' ? 'Judul PDF' : embedForm.type === 'map' ? 'Judul Lokasi' : embedForm.type === 'link' ? 'Text Link' : 'Alt / Caption Gambar' }}
                      </label>

                      <input
                        v-model.trim="embedForm.title"
                        type="text"
                        maxlength="80"
                        class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                        :placeholder="embedForm.type === 'pdf' ? 'Dokumen PDF' : embedForm.type === 'map' ? 'Lokasi Kegiatan' : embedForm.type === 'link' ? 'Baca selengkapnya' : 'Deskripsi gambar'"
                      />
                    </div>

                    <p
                      v-if="editorImageError"
                      class="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300"
                    >
                      {{ editorImageError }}
                    </p>
                  </div>

                  <div class="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      class="toolbar-action-btn"
                      @click="resetEmbedForm"
                    >
                      Reset
                    </button>

                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                      :disabled="editorImageUploading"
                      @click="submitEmbed"
                    >
                      {{ editorImageUploading ? 'Uploading...' : 'Insert' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Group: History -->
              <div class="ml-auto flex items-center gap-1 rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                <button
                  type="button"
                  class="toolbar-btn group relative"
                  @click.prevent="runEditor(() => editor?.chain().focus().undo().run())"
                >
                  Undo
                  <span class="toolbar-tooltip">Undo</span>
                </button>

                <button
                  type="button"
                  class="toolbar-btn group relative"
                  @click.prevent="runEditor(() => editor?.chain().focus().redo().run())"
                >
                  Redo
                  <span class="toolbar-tooltip">Redo</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Editor -->
          <ClientOnly>
            <div class="bg-white dark:bg-neutral-950">
              <EditorContent :editor="editor" class="editor-shell" />
            </div>
          </ClientOnly>

          <!-- Footer info -->
          <div class="flex flex-col gap-2 border-t border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-500 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
            <div>
              Gunakan toolbar untuk format seperti Microsoft Word: heading, list, tabel, PDF, Maps, gambar, dan YouTube.
            </div>
            <div>
              Konten disimpan sebagai HTML ke <code>description_rich_tiptap</code>.
            </div>
          </div>
        </div>
      </div>

      <!-- Tags -->
      <div v-show="activeTab === 'Tags'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-linear-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <h3 class="text-lg font-black text-gray-900 dark:text-white">
            Tags Slide Aktif
          </h3>
          <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
            Tambahkan tag untuk membantu filter atau pengelompokan konten.
          </p>
        </div>

        <div v-if="activeSlide" class="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
            Tambah Tags
          </label>

          <div class="flex flex-col gap-2 sm:flex-row">
            <input
              v-model.trim="tagDraft"
              class="block h-12 flex-1 rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Enter untuk tambah tag"
              @keydown.enter.prevent="addTag"
            />

            <button
              type="button"
              class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
              @click="addTag"
            >
              <Icon icon="lucide:plus" class="h-4 w-4" />
              Tambah
            </button>
          </div>

          <div class="mt-5 flex flex-wrap gap-2">
            <button
              v-for="tag in activeSlide.tags"
              :key="tag"
              type="button"
              class="group inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 ring-1 ring-green-100 transition hover:bg-rose-50 hover:text-rose-700 hover:ring-rose-100 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-900/40 dark:hover:bg-rose-900/10 dark:hover:text-rose-300 dark:hover:ring-rose-900/40"
              @click="removeTag(tag)"
            >
              #{{ tag }}
              <Icon icon="lucide:x" class="h-3.5 w-3.5" />
            </button>

            <p v-if="!activeSlide.tags.length" class="text-sm text-gray-500 dark:text-neutral-400">
              Belum ada tag.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Save Bar -->
    <div class="fixed inset-x-3 bottom-3 z-[90] xl:left-[370px] xl:right-8">
      <div class="flex flex-col gap-3 rounded-[24px] border border-gray-200 bg-white p-3 shadow-[0_-18px_50px_-28px_rgba(15,23,42,0.35)] dark:border-neutral-800 dark:bg-neutral-950 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <div
            class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl"
            :class="saving || mediaBusy
              ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300'
              : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'"
          >
            <Icon
              :icon="saving || mediaBusy ? 'lucide:loader-circle' : 'lucide:badge-check'"
              class="h-5 w-5"
              :class="saving || mediaBusy ? 'animate-spin' : ''"
            />
          </div>

          <div class="min-w-0">
            <p class="text-sm font-black text-gray-900 dark:text-white">
              {{ saving ? 'Menyimpan perubahan...' : mediaBusy ? 'Memproses media...' : 'Perubahan siap disimpan' }}
            </p>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
              Total slide: {{ form.slides.length }}
            </p>
          </div>
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <button
            type="button"
            class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            :disabled="mediaBusy || saving"
            @click="resetToDefault"
          >
            <Icon icon="lucide:rotate-ccw" class="h-4 w-4" />
            <span class="hidden sm:inline">Isi Default</span>
            <span class="sm:hidden">Default</span>
          </button>

          <button
            type="button"
            class="inline-flex h-11 min-w-[120px] items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="mediaBusy || saving"
            @click="save"
          >
            <Icon
              :icon="saving ? 'lucide:loader-circle' : 'lucide:save'"
              class="h-4 w-4"
              :class="saving ? 'animate-spin' : ''"
            />
            {{ saving ? 'Saving...' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Error Modal -->
    <Teleport to="body">
      <div
        v-if="errorModal.show"
        class="fixed inset-0 z-[1200] flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm"
        @click.self="closeErrorModal"
      >
        <div class="w-full max-w-md overflow-hidden rounded-[30px] border border-rose-200 bg-white shadow-2xl dark:border-rose-900/40 dark:bg-neutral-900">
          <div class="p-6">
            <div class="flex items-start gap-4">
              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-300">
                <Icon icon="lucide:triangle-alert" class="h-6 w-6" />
              </div>

              <div class="min-w-0">
                <h3 class="text-base font-black text-gray-900 dark:text-white">
                  {{ errorModal.title }}
                </h3>
                <p class="mt-2 text-sm leading-6 text-gray-500 dark:text-neutral-400">
                  {{ errorModal.message }}
                </p>
              </div>
            </div>

            <div class="mt-6 flex justify-end">
              <button
                type="button"
                class="inline-flex h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 text-sm font-bold text-white transition hover:bg-rose-700"
                @click="closeErrorModal"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, reactive, ref, shallowRef, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { Node } from '@tiptap/core'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import { useRuntimeConfig } from '#imports'
import { useWeb } from '~/composables/data/useWeb'
import { useCloudinaryUpload } from '~/composables/useCloudinaryUpload'

type EducationSlide = {
  id: string
  image: string
  imagePublicId?: string | null
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

type Shape = {
  eyebrow: string
  title: string
  subtitle: string
  autoplay: boolean
  showControls: boolean
  sliderDelay: number
  slides: EducationSlide[]
}

const props = defineProps<{
  section: {
    id: string
    key: string
    props?: Partial<Shape>
  }
  pagePath?: string
  web?: ReturnType<typeof useWeb> | any
}>()

const web = props.web || useWeb()
const { updateSection } = web

const runtime = useRuntimeConfig()
const clientName = String(runtime.public?.clientName || 'obayan')

const tabs = [
  { key: 'Section', label: 'Section', icon: 'lucide:settings-2' },
  { key: 'Slides', label: 'Slides', icon: 'lucide:panel-top' },
  { key: 'Media', label: 'Media', icon: 'lucide:image' },
  { key: 'Rich Text', label: 'Rich Text', icon: 'lucide:file-text' },
  { key: 'Tags', label: 'Tags', icon: 'lucide:tags' }
] as const

type TabKey = typeof tabs[number]['key']

const activeTab = ref<TabKey>('Section')

const categoryOptions = [
  'Pendidikan Formal',
  'Madrasah Diniyah',
  'Tahfidz',
  'Kajian Kitab',
  'Ekstrakurikuler',
  'Workshop',
  'Pelatihan',
  'Seminar',
  'Kegiatan Santri',
  'Kegiatan Desa',
  'Layanan Masyarakat'
]

function makeId(prefix = 'edu') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function createSlide(partial: Partial<EducationSlide> = {}): EducationSlide {
  return {
    id: partial.id || makeId(),
    image: partial.image || '',
    imagePublicId: partial.imagePublicId || null,
    title: partial.title || 'Madrasah Diniyah',
    location: partial.location || 'Aula Utama',
    start_date: partial.start_date || '',
    end_date: partial.end_date || '',
    interval: partial.interval || 'Setiap Ahad',
    short_description:
      partial.short_description ||
      'Program pembelajaran tambahan untuk meningkatkan pemahaman, adab, dan keterampilan peserta.',
    description_rich_tiptap:
      partial.description_rich_tiptap ||
      '<h2>Tentang Program</h2><p>Program ini dirancang untuk membantu peserta belajar secara lebih terarah, menyenangkan, dan konsisten.</p>',
    category: partial.category || 'Madrasah Diniyah',
    tags: Array.isArray(partial.tags) ? partial.tags.map(String).filter(Boolean) : ['pendidikan']
  }
}

const defaults: Shape = {
  eyebrow: 'Pendidikan Lainnya',
  title: 'Program Pendidikan & Kegiatan Pengembangan',
  subtitle:
    'Temukan berbagai kegiatan pendidikan, pembinaan, pelatihan, dan pengembangan karakter yang tersedia.',
  autoplay: true,
  showControls: true,
  sliderDelay: 4500,
  slides: [
    createSlide({
      image: '/assets/images/activity.jpg',
      title: 'Madrasah Diniyah',
      location: 'Aula Pesantren',
      interval: 'Setiap Senin - Kamis',
      category: 'Madrasah Diniyah',
      tags: ['diniyah', 'agama', 'santri']
    }),
    createSlide({
      image: '/assets/images/activity1.jpg',
      title: 'Program Tahfidz',
      location: 'Masjid Pesantren',
      interval: 'Setiap Hari',
      category: 'Tahfidz',
      tags: ['tahfidz', 'quran', 'hafalan']
    }),
    createSlide({
      image: '/assets/images/activity2.jpg',
      title: 'Workshop Keterampilan',
      location: 'Ruang Serbaguna',
      interval: 'Bulanan',
      category: 'Workshop',
      tags: ['skill', 'workshop', 'pengembangan']
    })
  ]
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

function normalizeSlides(value: unknown): EducationSlide[] {
  const raw = Array.isArray(value) ? value : []
  const slides = raw.map((item) => createSlide(item || {}))

  return slides.length ? slides : clone(defaults.slides)
}

function merge(base: Shape, patch: Partial<Shape> = {}): Shape {
  return {
    eyebrow: patch.eyebrow ?? base.eyebrow,
    title: patch.title ?? base.title,
    subtitle: patch.subtitle ?? base.subtitle,
    autoplay: typeof patch.autoplay === 'boolean' ? patch.autoplay : base.autoplay,
    showControls: typeof patch.showControls === 'boolean' ? patch.showControls : base.showControls,
    sliderDelay: Number(patch.sliderDelay || base.sliderDelay || 4500),
    slides: normalizeSlides(patch.slides ?? base.slides)
  }
}

const form = reactive<Shape>(merge(defaults, props.section?.props || {}))
const activeSlideId = ref(form.slides[0]?.id || '')

const mediaUrlDraft = reactive<Record<string, string>>({})
const mediaMode = reactive<Record<string, 'upload' | 'url'>>({})
const progress = reactive<Record<string, number>>({})

function syncSlideMediaState() {
  form.slides.forEach((slide) => {
    if (!mediaMode[slide.id]) {
      mediaMode[slide.id] = 'upload'
    }

    if (typeof mediaUrlDraft[slide.id] === 'undefined') {
      mediaUrlDraft[slide.id] = slide.image || ''
    }
  })
}

syncSlideMediaState()

watch(
  () => props.section?.props,
  (nextProps) => {
    Object.assign(form, merge(defaults, nextProps || {}))

    if (!form.slides.find((slide) => slide.id === activeSlideId.value)) {
      activeSlideId.value = form.slides[0]?.id || ''
    }

    syncSlideMediaState()

    if (activeTab.value === 'Rich Text') {
      nextTick(() => setEditorFromActiveSlide())
    }
  }
)

watch(
  () => form.slides.map((slide) => `${slide.id}:${slide.image}`).join('|'),
  () => {
    form.slides.forEach((slide) => {
      mediaUrlDraft[slide.id] = slide.image || ''
    })
  }
)

const activeSlide = computed<EducationSlide>(() => {
  return form.slides.find((slide) => slide.id === activeSlideId.value) || form.slides[0] || createSlide()
})

const tagDraft = ref('')

function onChangeTab(tab: TabKey) {
  if (activeTab.value === 'Rich Text') {
    syncEditorToActiveSlide()
  }

  activeTab.value = tab

  if (tab === 'Rich Text') {
    nextTick(() => setEditorFromActiveSlide())
  }
}

function setActiveSlide(id: string) {
  if (activeTab.value === 'Rich Text') {
    syncEditorToActiveSlide()
  }

  activeSlideId.value = id
  tagDraft.value = ''
  syncSlideMediaState()

  if (activeTab.value === 'Rich Text') {
    nextTick(() => setEditorFromActiveSlide())
  }
}

function addSlide() {
  if (activeTab.value === 'Rich Text') {
    syncEditorToActiveSlide()
  }

  const slide = createSlide({
    title: 'Program Baru',
    category: 'Pendidikan Formal',
    tags: ['baru']
  })

  form.slides.push(slide)
  activeSlideId.value = slide.id
  syncSlideMediaState()
  activeTab.value = 'Slides'
}

function duplicateSlide(id: string) {
  if (activeTab.value === 'Rich Text') {
    syncEditorToActiveSlide()
  }

  const source = form.slides.find((slide) => slide.id === id)
  if (!source) return

  const duplicated = createSlide({
    ...clone(source),
    id: makeId(),
    title: `${source.title || 'Slide'} Copy`,
    imagePublicId: null
  })

  form.slides.push(duplicated)
  activeSlideId.value = duplicated.id
  syncSlideMediaState()
}

async function removeSlide(id: string) {
  if (form.slides.length <= 1) {
    showErrorModal('Tidak bisa menghapus', 'Minimal harus ada satu slide.')
    return
  }

  if (activeTab.value === 'Rich Text') {
    syncEditorToActiveSlide()
  }

  const index = form.slides.findIndex((slide) => slide.id === id)
  if (index < 0) return

  const slide = form.slides[index]

  try {
    if (slide.imagePublicId) {
      await deleteImage(slide.imagePublicId)
    }
  } catch {}

  form.slides.splice(index, 1)

  delete mediaUrlDraft[id]
  delete mediaMode[id]
  delete progress[id]

  activeSlideId.value = form.slides[Math.max(0, index - 1)]?.id || form.slides[0]?.id || ''
}

function addTag() {
  const value = tagDraft.value.trim().replace(/^#/, '')

  if (!value) return

  const normalized = value.toLowerCase().replace(/\s+/g, '-')

  if (!activeSlide.value.tags.includes(normalized)) {
    activeSlide.value.tags.push(normalized)
  }

  tagDraft.value = ''
}

function removeTag(tag: string) {
  activeSlide.value.tags = activeSlide.value.tags.filter((item) => item !== tag)
}

const {
  uploadImage,
  uploadImageFromUrl,
  deleteImage,
  uploading,
  deleting,
  uploadError,
  deleteError
} = useCloudinaryUpload() as any

const mediaBusy = computed(() => uploading.value || deleting.value)
const saving = ref(false)
const savedNote = ref('')
const errNote = ref('')

const errorModal = reactive({
  show: false,
  title: '',
  message: ''
})

function showErrorModal(title: string, message: string) {
  errorModal.title = title
  errorModal.message = message
  errorModal.show = true
}

function closeErrorModal() {
  errorModal.show = false
  errorModal.title = ''
  errorModal.message = ''
}

function clearNoteSoon() {
  setTimeout(() => {
    savedNote.value = ''
  }, 1800)
}

const allowedImageTypes = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
])

const MAX_IMAGE_SIZE = 5 * 1024 * 1024

function isAllowedImage(file: File) {
  if (!allowedImageTypes.has(file.type)) {
    return 'Format gambar harus JPG, PNG, atau WebP. SVG/GIF tidak diperbolehkan.'
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return 'Ukuran gambar maksimal 5 MB.'
  }

  return ''
}

function isHttpUrl(url: string) {
  return /^https?:\/\//i.test(String(url || ''))
}

function isLocalAssetUrl(url: string) {
  return String(url || '').startsWith('/')
}

function validateRemoteImageUrl(url: string) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image()

    const timer = window.setTimeout(() => {
      img.src = ''
      reject(new Error('Gambar terlalu lama dimuat. Pastikan link gambar bisa diakses publik.'))
    }, 8000)

    img.onload = () => {
      window.clearTimeout(timer)

      if (!img.naturalWidth || !img.naturalHeight) {
        reject(new Error('Link tidak terbaca sebagai gambar yang valid.'))
        return
      }

      resolve()
    }

    img.onerror = () => {
      window.clearTimeout(timer)
      reject(new Error('Gambar tidak ditemukan atau link menolak akses gambar.'))
    }

    img.referrerPolicy = 'no-referrer'
    img.src = url
  })
}

async function uploadCloudinaryImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  const slide = activeSlide.value

  if (!file || !slide) return

  errNote.value = ''
  savedNote.value = ''

  const validationError = isAllowedImage(file)

  if (validationError) {
    showErrorModal('Gambar tidak valid', validationError)
    input.value = ''
    return
  }

  progress[slide.id] = 5

  let timer: ReturnType<typeof window.setInterval> | null = null

  try {
    const oldPublicId = slide.imagePublicId || null

    timer = window.setInterval(() => {
      if (progress[slide.id] != null && progress[slide.id] < 92) {
        progress[slide.id] += 7
      }
    }, 180)

    const result = await uploadImage(file, {
      folder: 'obayan-web/other-educations',
      maxWidth: 1600,
      maxHeight: 1000,
      quality: 0.84
    })

    slide.image = result.secure_url
    slide.imagePublicId = result.public_id
    mediaUrlDraft[slide.id] = result.secure_url

    if (oldPublicId && oldPublicId !== result.public_id) {
      await deleteImage(oldPublicId)
    }

    progress[slide.id] = 100
    savedNote.value = 'Gambar berhasil diupload.'
    clearNoteSoon()
  } catch (error: any) {
    showErrorModal(
      'Upload gagal',
      uploadError.value || error?.message || 'Gagal upload gambar.'
    )
  } finally {
    if (timer) window.clearInterval(timer)

    setTimeout(() => {
      delete progress[slide.id]
    }, 900)

    input.value = ''
  }
}

async function applyImageUrl() {
  const slide = activeSlide.value
  const url = String(mediaUrlDraft[slide.id] || '').trim()

  if (!url) {
    showErrorModal('URL kosong', 'Masukkan link gambar terlebih dahulu.')
    return
  }

  if (isLocalAssetUrl(url)) {
    if (slide.imagePublicId) {
      try {
        await deleteImage(slide.imagePublicId)
      } catch {}
    }

    slide.image = url
    slide.imagePublicId = null

    savedNote.value = 'Path lokal digunakan.'
    clearNoteSoon()
    return
  }

  if (!isHttpUrl(url)) {
    showErrorModal('URL tidak valid', 'Link gambar harus diawali dengan http:// atau https://.')
    return
  }

  try {
    await validateRemoteImageUrl(url)

    if (slide.imagePublicId) {
      try {
        await deleteImage(slide.imagePublicId)
      } catch {}
    }

    slide.image = url
    slide.imagePublicId = null

    savedNote.value = 'Link gambar berhasil digunakan. Klik Simpan untuk menyimpan.'
    clearNoteSoon()
  } catch (error: any) {
    showErrorModal(
      'Gambar tidak bisa digunakan',
      error?.message || 'Link gambar invalid, tidak ditemukan, atau tidak bisa diakses.'
    )
  }
}

async function removeImage() {
  const slide = activeSlide.value

  errNote.value = ''
  savedNote.value = ''

  try {
    if (slide.imagePublicId) {
      await deleteImage(slide.imagePublicId)
    }

    slide.image = ''
    slide.imagePublicId = null
    mediaUrlDraft[slide.id] = ''

    savedNote.value = 'Gambar dihapus.'
    clearNoteSoon()
  } catch (error: any) {
    showErrorModal(
      'Gagal menghapus gambar',
      deleteError.value || error?.message || 'Gagal menghapus gambar.'
    )
  }
}

async function validateImagesBeforeSave() {
  for (const slide of form.slides) {
    if (!slide.image) continue
    if (isLocalAssetUrl(slide.image)) continue
    if (slide.imagePublicId) continue

    try {
      await validateRemoteImageUrl(slide.image)
    } catch (error) {
      activeSlideId.value = slide.id
      activeTab.value = 'Media'

      showErrorModal(
        'Gambar tidak valid',
        `Gambar pada slide "${slide.title || 'Tanpa judul'}" tidak bisa diakses.`
      )

      throw error
    }
  }
}

/* =========================
   Tiptap Editor
========================= */

const editor = shallowRef<Editor | null>(null)
const toolbarPanel = ref<'table' | 'embed' | null>(null)

const tableForm = reactive({
  rows: 3,
  cols: 3,
  withHeaderRow: true
})

const editorImageInput = ref<HTMLInputElement | null>(null)
const editorImageFile = ref<File | null>(null)
const editorImageUploading = ref(false)
const editorImageError = ref<string | null>(null)

const embedTypes = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'pdf', label: 'PDF' },
  { value: 'image', label: 'Image' },
  { value: 'map', label: 'Maps' },
  { value: 'link', label: 'Link' }
] as const

const embedForm = reactive({
  type: 'youtube' as 'youtube' | 'pdf' | 'image' | 'map' | 'link',
  imageSource: 'upload' as 'upload' | 'link',
  url: '',
  title: '',
  alt: ''
})

const embedPlaceholder = computed(() => {
  if (embedForm.type === 'youtube') return 'https://www.youtube.com/watch?v=...'
  if (embedForm.type === 'pdf') return 'https://example.com/file.pdf'
  if (embedForm.type === 'map') return 'Tempel Google Maps embed URL atau link Maps'
  if (embedForm.type === 'link') return 'https://example.com'
  return 'https://example.com/image.jpg'
})

const CloudImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      publicId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-public-id'),
        renderHTML: (attributes) => {
          if (!attributes.publicId) return {}

          return {
            'data-public-id': attributes.publicId
          }
        }
      }
    }
  }
})

const PdfEmbed = Node.create({
  name: 'pdfEmbed',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: {
        default: ''
      },
      title: {
        default: 'Dokumen PDF'
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="pdf-embed"]'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      {
        'data-type': 'pdf-embed',
        'data-src': HTMLAttributes.src || '',
        'data-title': HTMLAttributes.title || 'Dokumen PDF',
        class: 'pdf-embed'
      },
      [
        'div',
        {
          class: 'pdf-embed-title'
        },
        HTMLAttributes.title || 'Dokumen PDF'
      ],
      [
        'iframe',
        {
          src: HTMLAttributes.src || '',
          loading: 'lazy',
          class: 'pdf-embed-frame'
        }
      ]
    ]
  }
})

const MapEmbed = Node.create({
  name: 'mapEmbed',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: {
        default: ''
      },
      title: {
        default: 'Lokasi Google Maps'
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="map-embed"]'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      {
        'data-type': 'map-embed',
        'data-src': HTMLAttributes.src || '',
        'data-title': HTMLAttributes.title || 'Lokasi Google Maps',
        class: 'map-embed'
      },
      ['div', { class: 'map-embed-title' }, HTMLAttributes.title || 'Lokasi Google Maps'],
      [
        'iframe',
        {
          src: HTMLAttributes.src || '',
          loading: 'lazy',
          class: 'map-embed-frame',
          allowfullscreen: 'true',
          referrerpolicy: 'no-referrer-when-downgrade'
        }
      ]
    ]
  }
})

function ensureEditor() {
  if (editor.value) return

  editor.value = new Editor({
    content: '<p></p>',
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false
        }
      }),

      CloudImage.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: 'editor-image'
        }
      }),

      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') return 'Judul section...'
          return 'Tulis deskripsi seperti Notion atau Medium...'
        }
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: 'text-green-600 underline underline-offset-4'
        }
      }),

      Youtube.configure({
        controls: true,
        nocookie: true,
        allowFullscreen: true,
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'youtube-embed'
        }
      }),

      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'editor-table'
        }
      }),

      TableRow,
      TableHeader,
      TableCell,
      PdfEmbed,
      MapEmbed
    ],

    editorProps: {
      attributes: {
        class: 'notion-editor'
      }
    },

    onUpdate: ({ editor }) => {
      if (!activeSlide.value) return
      activeSlide.value.description_rich_tiptap = editor.getHTML()
    }
  })
}

function setEditorFromActiveSlide() {
  ensureEditor()

  const html = activeSlide.value?.description_rich_tiptap || '<p></p>'

  editor.value?.commands.setContent(html)
}

function syncEditorToActiveSlide() {
  if (!editor.value || !activeSlide.value) return
  activeSlide.value.description_rich_tiptap = editor.value.getHTML()
}

function toggleToolbarPanel(panel: 'table' | 'embed') {
  toolbarPanel.value = toolbarPanel.value === panel ? null : panel
}

function toolbarActive(name: string, attrs?: any) {
  return editor.value?.isActive(name, attrs)
    ? 'toolbar-btn-active'
    : ''
}

function runEditor(run: () => boolean | undefined) {
  run()
}

function insertCustomTable() {
  editor.value
    ?.chain()
    .focus()
    .insertTable({
      rows: Math.max(1, Number(tableForm.rows || 3)),
      cols: Math.max(1, Number(tableForm.cols || 3)),
      withHeaderRow: !!tableForm.withHeaderRow
    })
    .run()

  toolbarPanel.value = null
}

function resetEmbedForm() {
  embedForm.type = 'youtube'
  embedForm.imageSource = 'upload'
  embedForm.url = ''
  embedForm.title = ''
  embedForm.alt = ''
  editorImageFile.value = null
  editorImageError.value = null

  if (editorImageInput.value) {
    editorImageInput.value.value = ''
  }
}

function extractIframeSrc(value: string) {
  const input = String(value || '').trim()
  const match = input.match(/src=["']([^"']+)["']/i)

  return match?.[1] || input
}

function toGoogleMapsEmbedUrl(value: string) {
  const raw = extractIframeSrc(value)

  if (!raw) return ''

  if (raw.includes('google.com/maps/embed')) {
    return raw
  }

  return raw
}

function insertTextLink(url: string, text?: string) {
  const label = text?.trim() || url

  editor.value
    ?.chain()
    .focus()
    .insertContent([
      {
        type: 'text',
        text: label,
        marks: [
          {
            type: 'link',
            attrs: {
              href: url,
              target: '_blank',
              rel: 'noopener noreferrer nofollow'
            }
          }
        ]
      },
      {
        type: 'text',
        text: ' '
      }
    ])
    .run()
}

function insertEditorImage(payload: {
  src: string
  publicId?: string
  alt?: string
  title?: string
}) {
  editor.value
    ?.chain()
    .focus()
    .insertContent({
      type: 'image',
      attrs: {
        src: payload.src,
        alt: payload.alt || '',
        title: payload.title || payload.alt || '',
        publicId: payload.publicId || null
      }
    })
    .run()
}

async function uploadAndInsertEditorImage(file: File) {
  editorImageError.value = null
  editorImageUploading.value = true

  try {
    const uploaded = await uploadImage(file, {
      folder: `${clientName}/other-educations/content`,
      maxWidth: 1600,
      maxHeight: 1600,
      quality: 0.82
    })

    insertEditorImage({
      src: uploaded.secure_url,
      publicId: uploaded.public_id,
      alt: embedForm.title || file.name.replace(/\.[^.]+$/, ''),
      title: embedForm.title || file.name.replace(/\.[^.]+$/, '')
    })

    resetEmbedForm()
    toolbarPanel.value = null
  } catch (error: any) {
    editorImageError.value = error?.message || 'Gagal insert gambar.'
  } finally {
    editorImageUploading.value = false
  }
}

async function uploadUrlAndInsertEditorImage(url: string) {
  editorImageError.value = null
  editorImageUploading.value = true

  try {
    if (typeof uploadImageFromUrl === 'function') {
      const uploaded = await uploadImageFromUrl(url, {
        folder: `${clientName}/other-educations/content`,
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.82
      })

      insertEditorImage({
        src: uploaded.secure_url,
        publicId: uploaded.public_id,
        alt: embedForm.title || 'Gambar deskripsi',
        title: embedForm.title || 'Gambar deskripsi'
      })
    } else {
      insertEditorImage({
        src: url,
        alt: embedForm.title || 'Gambar deskripsi',
        title: embedForm.title || 'Gambar deskripsi'
      })
    }

    resetEmbedForm()
    toolbarPanel.value = null
  } catch (error: any) {
    editorImageError.value = error?.message || 'Gagal insert gambar dari link.'
  } finally {
    editorImageUploading.value = false
  }
}

function onPickEditorImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  if (!file.type.startsWith('image/')) {
    editorImageError.value = 'File harus berupa gambar.'
    return
  }

  const maxBytes = 5 * 1024 * 1024

  if (file.size > maxBytes) {
    editorImageError.value = 'Ukuran gambar maksimal 5 MB.'
    return
  }

  editorImageFile.value = file

  if (!embedForm.title.trim()) {
    embedForm.title = file.name.replace(/\.[^.]+$/, '')
  }
}

async function submitEmbed() {
  const url = embedForm.url.trim()

  if (embedForm.type === 'youtube') {
    if (!url) return

    editor.value
      ?.chain()
      .focus()
      .setYoutubeVideo({
        src: url,
        width: 640,
        height: 360
      })
      .run()

    resetEmbedForm()
    toolbarPanel.value = null
    return
  }

  if (embedForm.type === 'pdf') {
    if (!url) return

    editor.value
      ?.chain()
      .focus()
      .insertContent({
        type: 'pdfEmbed',
        attrs: {
          src: url,
          title: embedForm.title.trim() || 'Dokumen PDF'
        }
      })
      .run()

    resetEmbedForm()
    toolbarPanel.value = null
    return
  }

  if (embedForm.type === 'map') {
    if (!url) return

    const mapUrl = toGoogleMapsEmbedUrl(url)

    editor.value
      ?.chain()
      .focus()
      .insertContent({
        type: 'mapEmbed',
        attrs: {
          src: mapUrl,
          title: embedForm.title.trim() || 'Lokasi Google Maps'
        }
      })
      .run()

    resetEmbedForm()
    toolbarPanel.value = null
    return
  }

  if (embedForm.type === 'link') {
    if (!url) return

    insertTextLink(url, embedForm.title.trim() || url)

    resetEmbedForm()
    toolbarPanel.value = null
    return
  }

  if (embedForm.type === 'image') {
    if (embedForm.imageSource === 'upload') {
      if (!editorImageFile.value) return
      await uploadAndInsertEditorImage(editorImageFile.value)
      return
    }

    if (embedForm.imageSource === 'link') {
      if (!url) return
      await uploadUrlAndInsertEditorImage(url)
    }
  }
}

/* =========================
   Save / Reset
========================= */

async function resetToDefault() {
  const ids = form.slides
    .map((slide) => slide.imagePublicId)
    .filter(Boolean) as string[]

  try {
    await Promise.all(ids.map((id) => deleteImage(id)))
  } catch {}

  Object.assign(form, clone(defaults))
  activeSlideId.value = form.slides[0]?.id || ''
  syncSlideMediaState()
  activeTab.value = 'Section'

  editor.value?.commands.setContent('<p></p>')

  savedNote.value = 'Form dikembalikan ke default.'
  clearNoteSoon()
}

async function save() {
  try {
    saving.value = true
    errNote.value = ''

    syncEditorToActiveSlide()

    await validateImagesBeforeSave()

    await updateSection(props.section.id, {
      props: clone(form)
    })

    savedNote.value = 'Tersimpan.'
    clearNoteSoon()
  } catch (error: any) {
    errNote.value = error?.message || 'Gagal menyimpan.'
  } finally {
    saving.value = false
  }
}

watch(activeTab, async (tab) => {
  if (tab !== 'Rich Text') return

  await nextTick()
  setEditorFromActiveSlide()
})

watch(activeSlideId, async () => {
  if (activeTab.value !== 'Rich Text') return

  await nextTick()
  setEditorFromActiveSlide()
})

onBeforeUnmount(() => {
  syncEditorToActiveSlide()
  editor.value?.destroy()
})
</script>

<style scoped>
.toolbar-btn {
  display: inline-flex;
  min-height: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  padding: 0.375rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 800;
  color: rgb(75 85 99);
  transition: 0.2s ease;
}

.toolbar-btn:hover {
  background: white;
  color: rgb(17 24 39);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
}

.toolbar-btn-active {
  background: white;
  color: rgb(22 163 74);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
}

.dark .toolbar-btn {
  color: rgb(212 212 212);
}

.dark .toolbar-btn:hover,
.dark .toolbar-btn-active {
  background: rgb(229 229 229);
  color: rgb(17 24 39);
}

.toolbar-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  border: 1px solid rgb(229 231 235);
  background: white;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: rgb(55 65 81);
  transition: 0.2s ease;
}

.toolbar-action-btn:hover {
  background: rgb(249 250 251);
}

.dark .toolbar-action-btn {
  border-color: rgb(64 64 64);
  background: rgb(23 23 23);
  color: rgb(229 229 229);
}

.dark .toolbar-action-btn:hover {
  background: rgb(38 38 38);
}

.toolbar-tooltip {
  pointer-events: none;
  position: absolute;
  left: 50%;
  top: calc(100% + 0.5rem);
  z-index: 50;
  white-space: nowrap;
  border-radius: 0.75rem;
  background: rgb(15 23 42);
  padding: 0.35rem 0.6rem;
  font-size: 0.68rem;
  font-weight: 700;
  color: white;
  opacity: 0;
  transform: translateX(-50%) translateY(-4px);
  transition: 0.18s ease;
}

.group:hover .toolbar-tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.editor-shell :deep(.ProseMirror),
:deep(.notion-editor) {
  min-height: 460px;
  outline: none;
  padding: 1.5rem;
  font-size: 1rem;
  line-height: 1.8;
  color: rgb(17 24 39);
}

.editor-shell :deep(.ProseMirror p),
:deep(.notion-editor p) {
  margin: 0.75rem 0;
  line-height: 1.8;
}

.editor-shell :deep(.ProseMirror h1),
:deep(.notion-editor h1) {
  margin: 1.75rem 0 1rem;
  font-size: 2rem;
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -0.035em;
  color: rgb(17 24 39);
}

.editor-shell :deep(.ProseMirror h2),
:deep(.notion-editor h2) {
  margin: 1.5rem 0 0.875rem;
  font-size: 1.5rem;
  line-height: 1.3;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: rgb(17 24 39);
}

.editor-shell :deep(.ProseMirror h3),
:deep(.notion-editor h3) {
  margin: 1.25rem 0 0.75rem;
  font-size: 1.25rem;
  line-height: 1.35;
  font-weight: 700;
  color: rgb(17 24 39);
}

.editor-shell :deep(.ProseMirror strong),
:deep(.notion-editor strong) {
  font-weight: 800;
}

.editor-shell :deep(.ProseMirror em),
:deep(.notion-editor em) {
  font-style: italic;
}

.editor-shell :deep(.ProseMirror ul),
:deep(.notion-editor ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 0.75rem 0;
}

.editor-shell :deep(.ProseMirror ol),
:deep(.notion-editor ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin: 0.75rem 0;
}

.editor-shell :deep(.ProseMirror li),
:deep(.notion-editor li) {
  margin: 0.35rem 0;
  padding-left: 0.25rem;
}

.editor-shell :deep(.ProseMirror blockquote),
:deep(.notion-editor blockquote) {
  margin: 1rem 0;
  border-left: 4px solid rgb(34 197 94);
  border-radius: 0.75rem;
  background: rgb(240 253 244);
  padding: 0.75rem 1rem;
  color: rgb(55 65 81);
}

.editor-shell :deep(.ProseMirror table),
:deep(.notion-editor table),
:deep(.editor-table) {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin: 1rem 0;
  overflow: hidden;
  border-radius: 1rem;
}

.editor-shell :deep(.ProseMirror th),
.editor-shell :deep(.ProseMirror td),
:deep(.notion-editor th),
:deep(.notion-editor td) {
  border: 1px solid rgb(229 231 235);
  padding: 0.75rem;
  vertical-align: top;
}

.editor-shell :deep(.ProseMirror th),
:deep(.notion-editor th) {
  background: rgb(249 250 251);
  font-weight: 800;
}

.editor-shell :deep(.editor-image),
.editor-shell :deep(.ProseMirror img),
:deep(.notion-editor img) {
  max-width: 100%;
  border-radius: 1.25rem;
  margin: 1rem 0;
  box-shadow: 0 16px 35px -25px rgba(15, 23, 42, 0.45);
}

.editor-shell :deep(.youtube-embed),
:deep(.notion-editor iframe.youtube-embed) {
  width: 100%;
  max-width: 100%;
  aspect-ratio: 16 / 9;
  height: auto;
  border-radius: 1.25rem;
  overflow: hidden;
  margin: 1rem 0;
}

.editor-shell :deep(.pdf-embed),
:deep(.notion-editor .pdf-embed) {
  margin: 1rem 0;
  overflow: hidden;
  border-radius: 1.25rem;
  border: 1px solid rgb(229 231 235);
  background: white;
}

.editor-shell :deep(.pdf-embed-title),
:deep(.notion-editor .pdf-embed-title) {
  border-bottom: 1px solid rgb(229 231 235);
  background: rgb(249 250 251);
  padding: 0.75rem 1rem;
  font-weight: 800;
  color: rgb(17 24 39);
}

.editor-shell :deep(.pdf-embed-frame),
:deep(.notion-editor .pdf-embed-frame) {
  height: 520px;
  width: 100%;
}

.editor-shell :deep(.map-embed),
:deep(.notion-editor .map-embed) {
  margin: 1rem 0;
  overflow: hidden;
  border-radius: 1.25rem;
  border: 1px solid rgb(229 231 235);
  background: white;
}

.editor-shell :deep(.map-embed-title),
:deep(.notion-editor .map-embed-title) {
  border-bottom: 1px solid rgb(229 231 235);
  background: rgb(249 250 251);
  padding: 0.75rem 1rem;
  font-weight: 800;
  color: rgb(17 24 39);
}

.editor-shell :deep(.map-embed-frame),
:deep(.notion-editor .map-embed-frame) {
  height: 360px;
  width: 100%;
}

.dark .editor-shell :deep(.ProseMirror),
.dark :deep(.notion-editor) {
  color: rgb(245 245 245);
}

.dark .editor-shell :deep(.ProseMirror h1),
.dark .editor-shell :deep(.ProseMirror h2),
.dark .editor-shell :deep(.ProseMirror h3),
.dark :deep(.notion-editor h1),
.dark :deep(.notion-editor h2),
.dark :deep(.notion-editor h3) {
  color: white;
}

.dark .editor-shell :deep(.ProseMirror blockquote),
.dark :deep(.notion-editor blockquote) {
  background: rgba(20, 83, 45, 0.25);
  color: rgb(220 252 231);
}

.dark .editor-shell :deep(.ProseMirror th),
.dark .editor-shell :deep(.ProseMirror td),
.dark :deep(.notion-editor th),
.dark :deep(.notion-editor td) {
  border-color: rgb(64 64 64);
}

.dark .editor-shell :deep(.ProseMirror th),
.dark :deep(.notion-editor th),
.dark .editor-shell :deep(.pdf-embed-title),
.dark :deep(.notion-editor .pdf-embed-title),
.dark .editor-shell :deep(.map-embed-title),
.dark :deep(.notion-editor .map-embed-title) {
  background: rgb(23 23 23);
  color: white;
}

.dark .editor-shell :deep(.pdf-embed),
.dark :deep(.notion-editor .pdf-embed),
.dark .editor-shell :deep(.map-embed),
.dark :deep(.notion-editor .map-embed) {
  border-color: rgb(64 64 64);
  background: rgb(10 10 10);
}
</style>