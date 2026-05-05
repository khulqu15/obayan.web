<!-- components/editor/GalleryPage.vue -->
<template>
  <section class="relative overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
    <!-- Header -->
    <div class="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-green-50 via-white to-lime-50 px-5 py-5 dark:border-neutral-800 dark:from-green-950/20 dark:via-neutral-900 dark:to-neutral-900 md:px-6">
      <div class="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-green-300/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-20 left-8 h-40 w-40 rounded-full bg-lime-300/20 blur-3xl"></div>

      <div class="relative z-10">
        <div class="inline-flex items-center gap-2 rounded-full border border-green-100 bg-white/80 px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm backdrop-blur dark:border-green-900/40 dark:bg-neutral-900/70 dark:text-green-300">
          <span class="h-2 w-2 rounded-full bg-green-500"></span>
          Gallery Page Editor
        </div>

        <h2 class="mt-4 text-xl font-black tracking-tight text-gray-950 dark:text-white">
          Kelola Halaman Galeri
        </h2>

        <p class="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
          Atur hero galeri, teks pencarian, dan daftar foto. Upload file gambar masuk Cloudinary, sedangkan link gambar langsung disimpan ke Firebase Realtime Database setelah divalidasi.
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
          @click="activeTab = tab.key"
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
        class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300"
      >
        {{ errNote || uploadError || deleteError }}
      </div>
    </div>

    <div class="p-5 pb-28 md:p-6 md:pb-28">
      <!-- Hero -->
      <div v-show="activeTab === 'Hero'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Hero Galeri
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Atur gambar cover, badge, judul, subjudul, dan tinggi hero halaman galeri.
              </p>
            </div>

            <div class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm ring-1 ring-green-100 dark:bg-neutral-900 dark:text-green-300 dark:ring-green-900/40">
              <span class="h-2 w-2 rounded-full bg-green-500"></span>
              JPG / PNG / WebP · Max 5 MB
            </div>
          </div>
        </div>

        <section class="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="grid gap-5 p-5 lg:grid-cols-[1fr,1.05fr]">
            <div class="relative overflow-hidden rounded-[26px] border border-gray-200 bg-gray-100 dark:border-neutral-800 dark:bg-neutral-800">
              <img
                v-if="form.hero.cover"
                :src="form.hero.cover"
                alt="Cover Galeri"
                class="h-72 w-full object-cover"
              />

              <div v-else class="grid h-72 place-items-center text-center">
                <div>
                  <Icon icon="lucide:image-plus" class="mx-auto h-10 w-10 text-gray-400" />
                  <p class="mt-2 text-sm font-semibold text-gray-500 dark:text-neutral-400">
                    Belum ada cover
                  </p>
                </div>
              </div>

              <div
                v-if="progress['hero.cover'] != null"
                class="absolute inset-x-4 bottom-4 overflow-hidden rounded-full bg-white/70 p-1 backdrop-blur dark:bg-neutral-950/70"
              >
                <div
                  class="h-2 rounded-full bg-green-500 transition-all"
                  :style="{ width: `${progress['hero.cover']}%` }"
                ></div>
              </div>
            </div>

            <div class="space-y-4">
              <div class="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                <button
                  type="button"
                  class="rounded-xl px-3 py-2 text-xs font-bold transition"
                  :class="mediaMode['hero.cover'] === 'upload'
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                    : 'text-gray-500 dark:text-neutral-300'"
                  @click="mediaMode['hero.cover'] = 'upload'"
                >
                  Upload
                </button>

                <button
                  type="button"
                  class="rounded-xl px-3 py-2 text-xs font-bold transition"
                  :class="mediaMode['hero.cover'] === 'url'
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                    : 'text-gray-500 dark:text-neutral-300'"
                  @click="mediaMode['hero.cover'] = 'url'"
                >
                  URL
                </button>
              </div>

              <div v-if="mediaMode['hero.cover'] === 'upload'" class="rounded-[24px] border border-dashed border-green-200 bg-green-50/60 p-5 dark:border-green-900/40 dark:bg-green-900/10">
                <input
                  id="gallery-hero-cover-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  class="hidden"
                  @change="(event) => uploadImageField(event, 'hero.cover')"
                />

                <label
                  for="gallery-hero-cover-upload"
                  class="flex cursor-pointer flex-col items-center justify-center rounded-[22px] bg-white px-5 py-8 text-center ring-1 ring-green-100 transition hover:bg-green-50 dark:bg-neutral-900 dark:ring-green-900/40 dark:hover:bg-neutral-800"
                >
                  <Icon icon="lucide:upload-cloud" class="h-9 w-9 text-green-600 dark:text-green-300" />
                  <span class="mt-3 text-sm font-black text-gray-900 dark:text-white">
                    Upload Cover
                  </span>
                  <span class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                    Gambar otomatis dioptimalkan sebelum disimpan.
                  </span>
                </label>
              </div>

              <div v-else class="space-y-3">
                <input
                  v-model.trim="mediaDraft['hero.cover']"
                  type="url"
                  placeholder="https://example.com/cover.jpg"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                />

                <button
                  type="button"
                  class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
                  :disabled="mediaBusy || !mediaDraft['hero.cover']"
                  @click="applyImageUrl('hero.cover')"
                >
                  <Icon icon="lucide:shield-check" class="h-4 w-4" />
                  Gunakan Link
                </button>
              </div>

              <button
                v-if="form.hero.cover"
                type="button"
                class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white px-4 text-sm font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
                :disabled="mediaBusy"
                @click="removeImageField('hero.cover')"
              >
                <Icon icon="lucide:trash-2" class="h-4 w-4" />
                Hapus Cover
              </button>
            </div>
          </div>
        </section>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Badge
            </label>
            <input
              v-model.trim="form.hero.badge"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Galeri Al-Inayah"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Judul Utama
            </label>
            <input
              v-model.trim="form.hero.title"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Galeri Al-Inayah"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50 md:col-span-2">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Subjudul
            </label>
            <textarea
              v-model.trim="form.hero.subtitle"
              rows="4"
              class="block w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Dokumentasi kegiatan..."
            ></textarea>
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Tinggi Mobile
            </label>
            <input
              v-model.trim="form.hero.heightSm"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="36vh"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Tinggi Desktop
            </label>
            <input
              v-model.trim="form.hero.heightLg"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="44vh"
            />
          </div>
        </div>
      </div>

      <!-- Teks -->
      <div v-show="activeTab === 'Teks'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white">
              Teks Interface Galeri
            </h3>
            <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
              Atur teks pencarian, label semua kategori, dan tombol tampilkan lebih banyak.
            </p>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50 md:col-span-2">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Placeholder Pencarian
            </label>
            <input
              v-model.trim="form.texts.searchPlaceholder"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Cari foto (judul/tag/kategori)…"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Label Kategori Semua
            </label>
            <input
              v-model.trim="form.texts.categoryAll"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="All"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Label Load More
            </label>
            <input
              v-model.trim="form.texts.loadMore"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Tampilkan Lebih Banyak"
            />
          </div>
        </div>
      </div>

      <!-- Galeri -->
      <div v-show="activeTab === 'Galeri'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Daftar Foto Galeri
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Tambahkan foto, kategori, dan tags. Gambar dapat diupload ke Cloudinary atau memakai link langsung.
              </p>
            </div>

            <button
              type="button"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
              @click="addGalleryItem"
            >
              <Icon icon="lucide:plus" class="h-4 w-4" />
              Tambah Foto
            </button>
          </div>
        </div>

        <div class="grid gap-5">
          <article
            v-for="(item, index) in form.gallery.items"
            :key="`gallery-item-${index}`"
            class="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
              <div class="flex items-center justify-between gap-3">
                <div class="flex min-w-0 items-center gap-3">
                  <img
                    v-if="item.src"
                    :src="item.src"
                    alt=""
                    class="h-12 w-16 shrink-0 rounded-2xl border border-gray-200 object-cover dark:border-neutral-800"
                  />

                  <div v-else class="grid h-12 w-16 shrink-0 place-items-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-neutral-800">
                    <Icon icon="lucide:image" class="h-5 w-5" />
                  </div>

                  <div class="min-w-0">
                    <h4 class="truncate text-sm font-black text-gray-900 dark:text-white">
                      Foto {{ index + 1 }}
                    </h4>
                    <p class="mt-0.5 truncate text-xs text-gray-500 dark:text-neutral-400">
                      {{ item.title || 'Belum ada judul' }}
                    </p>
                  </div>
                </div>

                <div class="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    :disabled="index === 0"
                    @click="moveGalleryItem(index, -1)"
                  >
                    <Icon icon="lucide:arrow-up" class="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    :disabled="index === form.gallery.items.length - 1"
                    @click="moveGalleryItem(index, 1)"
                  >
                    <Icon icon="lucide:arrow-down" class="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
                    @click="removeGalleryItem(index)"
                  >
                    <Icon icon="lucide:trash-2" class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div class="grid gap-5 p-4 lg:grid-cols-[0.95fr,1.05fr]">
              <div class="overflow-hidden rounded-[24px] border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                <div class="relative">
                  <img
                    v-if="item.src"
                    :src="item.src"
                    class="h-64 w-full object-cover"
                    :alt="item.title || `Foto ${index + 1}`"
                  />

                  <div v-else class="grid h-64 place-items-center bg-gray-50 text-center dark:bg-neutral-800/60">
                    <div>
                      <Icon icon="lucide:image-plus" class="mx-auto h-9 w-9 text-gray-400" />
                      <p class="mt-2 text-sm font-semibold text-gray-500 dark:text-neutral-400">
                        Belum ada gambar
                      </p>
                    </div>
                  </div>

                  <div
                    v-if="progress[`gallery.${index}.src`] != null"
                    class="absolute inset-x-3 bottom-3 overflow-hidden rounded-full bg-white/70 p-1 backdrop-blur dark:bg-neutral-950/70"
                  >
                    <div
                      class="h-2 rounded-full bg-green-500 transition-all"
                      :style="{ width: `${progress[`gallery.${index}.src`]}%` }"
                    ></div>
                  </div>
                </div>

                <div class="space-y-3 p-3">
                  <div class="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                    <button
                      type="button"
                      class="rounded-xl px-3 py-2 text-xs font-bold transition"
                      :class="mediaMode[`gallery.${index}.src`] === 'upload'
                        ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                        : 'text-gray-500 dark:text-neutral-300'"
                      @click="mediaMode[`gallery.${index}.src`] = 'upload'"
                    >
                      Upload
                    </button>

                    <button
                      type="button"
                      class="rounded-xl px-3 py-2 text-xs font-bold transition"
                      :class="mediaMode[`gallery.${index}.src`] === 'url'
                        ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                        : 'text-gray-500 dark:text-neutral-300'"
                      @click="mediaMode[`gallery.${index}.src`] = 'url'"
                    >
                      URL
                    </button>
                  </div>

                  <div v-if="mediaMode[`gallery.${index}.src`] === 'upload'">
                    <input
                      :id="`gallery-item-upload-${index}`"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      class="hidden"
                      @change="(event) => uploadImageField(event, `gallery.${index}.src`)"
                    />

                    <label
                      :for="`gallery-item-upload-${index}`"
                      class="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-green-200 bg-green-50/70 px-4 py-3 text-xs font-bold text-green-700 transition hover:bg-green-100 dark:border-green-900/40 dark:bg-green-900/10 dark:text-green-300 dark:hover:bg-green-900/20"
                    >
                      <Icon icon="lucide:upload-cloud" class="h-4 w-4" />
                      Upload Foto
                    </label>
                  </div>

                  <div v-else class="space-y-2">
                    <input
                      v-model.trim="mediaDraft[`gallery.${index}.src`]"
                      type="url"
                      placeholder="https://example.com/gallery.jpg"
                      class="h-11 w-full rounded-2xl border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                    />

                    <button
                      type="button"
                      class="inline-flex h-10 items-center justify-center rounded-2xl bg-green-600 px-3 text-xs font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
                      :disabled="mediaBusy || !mediaDraft[`gallery.${index}.src`]"
                      @click="applyImageUrl(`gallery.${index}.src`)"
                    >
                      Gunakan Link
                    </button>
                  </div>

                  <button
                    v-if="item.src"
                    type="button"
                    class="inline-flex items-center justify-center gap-1 rounded-xl border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-900/10"
                    :disabled="mediaBusy"
                    @click="removeImageField(`gallery.${index}.src`)"
                  >
                    <Icon icon="lucide:trash-2" class="h-3.5 w-3.5" />
                    Hapus Gambar
                  </button>
                </div>
              </div>

              <div class="grid gap-4">
                <div>
                  <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                    Judul
                  </label>
                  <input
                    v-model.trim="item.title"
                    class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                    placeholder="Dokumentasi Kegiatan"
                  />
                </div>

                <div>
                  <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                    Kategori
                  </label>
                  <input
                    v-model.trim="item.category"
                    class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                    placeholder="Kegiatan / Fasilitas / ..."
                  />
                </div>

                <div>
                  <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                    Tags
                  </label>
                  <input
                    v-model.trim="item.tagsText"
                    class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                    placeholder="santri, kajian"
                  />
                  <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                    Pisahkan tags dengan koma.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <div
            v-if="!form.gallery.items.length"
            class="rounded-[28px] border border-dashed border-gray-300 bg-gray-50 p-10 text-center dark:border-neutral-700 dark:bg-neutral-800/40"
          >
            <Icon icon="lucide:images" class="mx-auto h-10 w-10 text-gray-400" />
            <h4 class="mt-3 text-base font-black text-gray-900 dark:text-white">
              Belum ada foto galeri
            </h4>
            <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Klik tombol Tambah Foto untuk mulai membuat daftar galeri.
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
import { Icon } from '@iconify/vue'
import { computed, reactive, ref, watch } from 'vue'
import { useWeb } from '~/composables/data/useWeb'
import { useCloudinaryUpload } from '~/composables/useCloudinaryUpload'

type HeroShape = {
  cover: string
  coverPublicId?: string | null
  badge: string
  title: string
  subtitle: string
  heightSm: string
  heightLg: string
}

type GalleryItem = {
  src: string
  srcPublicId?: string | null
  title: string
  category: string
  tagsText?: string
}

type Shape = {
  hero: HeroShape
  texts: {
    searchPlaceholder: string
    categoryAll: string
    loadMore: string
  }
  gallery: {
    items: GalleryItem[]
  }
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

const webApi = props.web || useWeb()

watch(
  () => props.pagePath,
  (pagePath) => {
    if (pagePath && (webApi as any)?.setActivePath) {
      ;(webApi as any).setActivePath(pagePath)
    }
  },
  { immediate: true }
)

const { updateSection } = webApi

const tabs = [
  { key: 'Hero', label: 'Hero', icon: 'lucide:layout-template' },
  { key: 'Teks', label: 'Teks', icon: 'lucide:type' },
  { key: 'Galeri', label: 'Galeri', icon: 'lucide:images' }
] as const

type TabKey = typeof tabs[number]['key']

const activeTab = ref<TabKey>('Hero')

const defaults: Shape = {
  hero: {
    cover: '/assets/images/activity1.jpg',
    coverPublicId: null,
    badge: 'Galeri Al-Inayah',
    title: 'Galeri Al-Inayah',
    subtitle: 'Dokumentasi kegiatan, fasilitas, dan momen terbaik di pesantren.',
    heightSm: '36vh',
    heightLg: '44vh'
  },
  texts: {
    searchPlaceholder: 'Cari foto (judul/tag/kategori)…',
    categoryAll: 'All',
    loadMore: 'Tampilkan Lebih Banyak'
  },
  gallery: {
    items: [
      {
        src: '/assets/images/gallery/1.jpg',
        srcPublicId: null,
        title: 'Dokumentasi #1',
        category: 'Kegiatan',
        tagsText: 'santri, kajian'
      },
      {
        src: '/assets/images/gallery/2.jpg',
        srcPublicId: null,
        title: 'Dokumentasi #2',
        category: 'Fasilitas',
        tagsText: 'kelas, perpustakaan'
      }
    ]
  }
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

function normalizeGalleryItems(items?: GalleryItem[]) {
  if (!Array.isArray(items) || !items.length) {
    return clone(defaults.gallery.items)
  }

  return items.map((item) => ({
    src: item.src || '',
    srcPublicId: item.srcPublicId || null,
    title: item.title || '',
    category: item.category || '',
    tagsText: item.tagsText || ''
  }))
}

function merge(base: Shape, patch: Partial<Shape> = {}): Shape {
  return {
    hero: {
      cover: patch.hero?.cover ?? base.hero.cover,
      coverPublicId: patch.hero?.coverPublicId ?? base.hero.coverPublicId ?? null,
      badge: patch.hero?.badge ?? base.hero.badge,
      title: patch.hero?.title ?? base.hero.title,
      subtitle: patch.hero?.subtitle ?? base.hero.subtitle,
      heightSm: patch.hero?.heightSm ?? base.hero.heightSm,
      heightLg: patch.hero?.heightLg ?? base.hero.heightLg
    },
    texts: {
      searchPlaceholder: patch.texts?.searchPlaceholder ?? base.texts.searchPlaceholder,
      categoryAll: patch.texts?.categoryAll ?? base.texts.categoryAll,
      loadMore: patch.texts?.loadMore ?? base.texts.loadMore
    },
    gallery: {
      items: normalizeGalleryItems(patch.gallery?.items as GalleryItem[] | undefined)
    }
  }
}

const form = reactive<Shape>(merge(defaults, props.section?.props || {}))

watch(
  () => props.section?.props,
  (nextProps) => {
    Object.assign(form, merge(defaults, nextProps || {}))
    syncMediaDrafts()
  }
)

const savedNote = ref('')
const errNote = ref('')
const saving = ref(false)

const {
  uploadImage,
  deleteImage,
  uploading,
  deleting,
  uploadError,
  deleteError
} = useCloudinaryUpload()

const mediaBusy = computed(() => uploading.value || deleting.value)
const progress = reactive<Record<string, number | undefined>>({})
const mediaMode = reactive<Record<string, 'upload' | 'url'>>({})
const mediaDraft = reactive<Record<string, string>>({})

watch(
  () => [
    form.hero.cover,
    ...form.gallery.items.map((item) => item.src)
  ],
  () => syncMediaDrafts(),
  { immediate: true }
)

function syncMediaDrafts() {
  mediaMode['hero.cover'] = mediaMode['hero.cover'] || 'upload'
  mediaDraft['hero.cover'] = form.hero.cover || ''

  form.gallery.items.forEach((item, index) => {
    const key = `gallery.${index}.src`

    mediaMode[key] = mediaMode[key] || 'upload'
    mediaDraft[key] = item.src || ''
  })
}

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

/* ===== Save / Reset ===== */
async function save() {
  try {
    saving.value = true
    errNote.value = ''

    await updateSection(props.section.id, {
      props: clone(form)
    })

    savedNote.value = 'Tersimpan.'
    setTimeout(() => {
      savedNote.value = ''
    }, 1500)
  } catch (error: any) {
    errNote.value = error?.message || 'Gagal menyimpan.'
    showErrorModal('Gagal menyimpan', errNote.value)
  } finally {
    saving.value = false
  }
}

async function resetToDefault() {
  const publicIds = [
    form.hero.coverPublicId,
    ...form.gallery.items.map((item) => item.srcPublicId)
  ].filter(Boolean) as string[]

  try {
    await Promise.all(publicIds.map((id) => deleteImage(id)))
  } catch {}

  Object.assign(form, clone(defaults))
  syncMediaDrafts()
  activeTab.value = 'Hero'

  savedNote.value = 'Form dikembalikan ke default.'
  setTimeout(() => {
    savedNote.value = ''
  }, 1500)
}

/* ===== Gallery item actions ===== */
function addGalleryItem() {
  const index = form.gallery.items.length

  form.gallery.items.push({
    src: '',
    srcPublicId: null,
    title: '',
    category: '',
    tagsText: ''
  })

  const key = `gallery.${index}.src`
  mediaMode[key] = 'upload'
  mediaDraft[key] = ''
}

async function removeGalleryItem(index: number) {
  const item = form.gallery.items[index]

  if (!item) return

  if (item.srcPublicId) {
    try {
      await deleteImage(item.srcPublicId)
    } catch {}
  }

  form.gallery.items.splice(index, 1)
  syncMediaDrafts()
}

function moveGalleryItem(index: number, direction: number) {
  const targetIndex = index + direction

  if (targetIndex < 0 || targetIndex >= form.gallery.items.length) return

  ;[form.gallery.items[index], form.gallery.items[targetIndex]] = [
    form.gallery.items[targetIndex],
    form.gallery.items[index]
  ]

  syncMediaDrafts()
}

/* ===== Image Upload / URL ===== */
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

function getPublicId(key: string) {
  if (key === 'hero.cover') {
    return form.hero.coverPublicId || null
  }

  const match = key.match(/^gallery\.(\d+)\.src$/)

  if (match) {
    return form.gallery.items[Number(match[1])]?.srcPublicId || null
  }

  return null
}

function setImageValue(key: string, url: string, publicId?: string | null) {
  if (key === 'hero.cover') {
    form.hero.cover = url
    form.hero.coverPublicId = publicId || null
    mediaDraft[key] = url
    return
  }

  const match = key.match(/^gallery\.(\d+)\.src$/)

  if (!match) return

  const index = Number(match[1])
  const item = form.gallery.items[index]

  if (!item) return

  item.src = url
  item.srcPublicId = publicId || null
  mediaDraft[key] = url
}

async function clearCloudinaryImage(key: string) {
  const publicId = getPublicId(key)

  if (!publicId) return

  try {
    await deleteImage(publicId)
  } catch {}

  setImageValue(key, getImageValue(key), null)
}

function getImageValue(key: string) {
  if (key === 'hero.cover') {
    return form.hero.cover || ''
  }

  const match = key.match(/^gallery\.(\d+)\.src$/)

  if (!match) return ''

  return form.gallery.items[Number(match[1])]?.src || ''
}

async function uploadImageField(event: Event, key: string) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  errNote.value = ''
  savedNote.value = ''

  const validation = isAllowedImage(file)

  if (validation) {
    showErrorModal('Gambar tidak valid', validation)
    input.value = ''
    return
  }

  progress[key] = 5

  let timer: ReturnType<typeof window.setInterval> | null = null

  try {
    const oldPublicId = getPublicId(key)

    timer = window.setInterval(() => {
      if (progress[key] != null && progress[key]! < 92) {
        progress[key]! += 7
      }
    }, 180)

    const result = await uploadImage(file, {
      folder: 'obayan-web/gallery',
      maxWidth: key === 'hero.cover' ? 1920 : 1400,
      maxHeight: key === 'hero.cover' ? 1080 : 900,
      quality: 0.84
    })

    setImageValue(key, result.secure_url, result.public_id)

    if (oldPublicId && oldPublicId !== result.public_id) {
      await deleteImage(oldPublicId)
    }

    progress[key] = 100
    savedNote.value = 'Gambar berhasil diupload.'
    setTimeout(() => {
      savedNote.value = ''
    }, 1500)
  } catch (error: any) {
    showErrorModal(
      'Upload gagal',
      uploadError.value || error?.message || 'Gagal upload gambar.'
    )
  } finally {
    if (timer) window.clearInterval(timer)

    setTimeout(() => {
      progress[key] = undefined
    }, 1000)

    input.value = ''
  }
}

async function applyImageUrl(key: string) {
  const url = String(mediaDraft[key] || '').trim()

  if (!url) {
    showErrorModal('URL kosong', 'Masukkan link gambar terlebih dahulu.')
    return
  }

  if (isLocalAssetUrl(url)) {
    await clearCloudinaryImage(key)
    setImageValue(key, url, null)

    savedNote.value = 'Path lokal digunakan.'
    setTimeout(() => {
      savedNote.value = ''
    }, 1500)
    return
  }

  if (!isHttpUrl(url)) {
    showErrorModal('URL tidak valid', 'Link gambar harus diawali http:// atau https://.')
    return
  }

  try {
    await validateRemoteImageUrl(url)

    await clearCloudinaryImage(key)
    setImageValue(key, url, null)

    savedNote.value = 'Link gambar berhasil digunakan. Klik Simpan untuk menyimpan.'
    setTimeout(() => {
      savedNote.value = ''
    }, 1500)
  } catch (error: any) {
    showErrorModal(
      'Gambar tidak bisa digunakan',
      error?.message || 'Link gambar invalid, tidak ditemukan, atau tidak bisa diakses.'
    )
  }
}

async function removeImageField(key: string) {
  try {
    await clearCloudinaryImage(key)
    setImageValue(key, '', null)

    savedNote.value = 'Gambar dihapus.'
    setTimeout(() => {
      savedNote.value = ''
    }, 1500)
  } catch (error: any) {
    showErrorModal(
      'Gagal menghapus gambar',
      deleteError.value || error?.message || 'Gagal menghapus gambar.'
    )
  }
}
</script>