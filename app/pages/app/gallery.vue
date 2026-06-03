<!-- /pages/app/gallery.vue -->
<template>
  <section class="relative space-y-6 p-4 text-gray-800 dark:text-neutral-200 md:p-6">
    <!-- Soft Background -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute inset-0 bg-gray-50 dark:bg-neutral-950"></div>
      <div class="absolute -left-24 -top-24 h-[34rem] w-[34rem] rounded-full bg-green-200/35 blur-3xl dark:bg-green-900/20"></div>
      <div class="absolute -right-20 top-40 h-[30rem] w-[30rem] rounded-full bg-lime-200/30 blur-3xl dark:bg-lime-900/10"></div>
      <div class="absolute inset-0 opacity-[0.35] dark:opacity-[0.18]">
        <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(22,163,74,.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(22,163,74,.16)_1px,transparent_1px)] bg-[size:34px_34px]"></div>
      </div>
    </div>

    <!-- Hero -->
    <div class="relative overflow-hidden rounded-[28px] border border-green-100 bg-gradient-to-br from-green-600 via-green-600 to-lime-500 p-6 text-white shadow-[0_20px_60px_-20px_rgba(22,163,74,0.45)] dark:border-neutral-800 md:p-8">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute -right-10 -top-14 h-44 w-44 rounded-full bg-white blur-3xl"></div>
        <div class="absolute -bottom-16 left-8 h-40 w-40 rounded-full bg-lime-200 blur-3xl"></div>
      </div>

      <div class="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20 backdrop-blur">
            <span class="inline-block h-2 w-2 rounded-full bg-lime-300"></span>
            Gallery Management
          </div>

          <h1 class="mt-4 text-2xl font-extrabold tracking-tight md:text-4xl">
            Kelola galeri lebih rapi dan visual
          </h1>

          <p class="mt-3 max-w-xl text-sm text-green-50/90 md:text-base">
            Upload gambar ke Cloudinary, atur kategori, dan hapus file lama otomatis saat gambar diperbarui.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
          <div class="rounded-2xl bg-white/12 px-4 py-3 ring-1 ring-white/15 backdrop-blur">
            <div class="text-xs text-green-100">Total Foto</div>
            <div class="mt-1 text-2xl font-bold">{{ items.length }}</div>
          </div>

          <div class="rounded-2xl bg-white/12 px-4 py-3 ring-1 ring-white/15 backdrop-blur">
            <div class="text-xs text-green-100">Kategori</div>
            <div class="mt-1 text-2xl font-bold">{{ categories.length }}</div>
          </div>

          <div class="rounded-2xl bg-white/12 px-4 py-3 ring-1 ring-white/15 backdrop-blur">
            <div class="text-xs text-green-100">Bertag</div>
            <div class="mt-1 text-2xl font-bold">{{ taggedCount }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="rounded-3xl border border-gray-200/80 bg-white/85 p-4 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/85">
      <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
          <div class="relative w-full lg:max-w-md">
            <input
              v-model.trim="q"
              type="search"
              :placeholder="form.texts.searchPlaceholder || 'Cari judul/kategori/tag…'"
              class="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
            <Icon icon="lucide:search" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          <div class="inline-flex overflow-x-auto rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              type="button"
              @click="activeTab = tab.key"
              :class="[
                'inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition',
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200 dark:text-gray-900'
                  : 'text-gray-500 hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white'
              ]"
            >
              <Icon :icon="tab.icon" class="h-4 w-4" />
              {{ tab.label }}
            </button>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <NuxtLink
            to="/app"
            class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <Icon icon="lucide:arrow-left" class="h-4 w-4" />
            Kembali
          </NuxtLink>

          <button
            type="button"
            class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            @click="resetDefaults"
          >
            <Icon icon="lucide:rotate-ccw" class="h-4 w-4" />
            Default
          </button>

          <button
            type="button"
            class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="savingConfig || itemSaving"
            @click="activeTab === 'settings' ? saveConfig() : openItemCreate()"
          >
            <Icon
              :icon="savingConfig || itemSaving ? 'svg-spinners:3-dots-fade' : activeTab === 'settings' ? 'lucide:save' : 'lucide:plus'"
              class="h-4 w-4"
            />
            {{ savingConfig ? 'Menyimpan…' : activeTab === 'settings' ? 'Simpan Konfigurasi' : 'Tambah Foto' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div
      v-if="errorMessage"
      class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300"
    >
      {{ errorMessage }}
    </div>

    <!-- Settings -->
    <div v-show="activeTab === 'settings'" class="grid gap-5 xl:grid-cols-[minmax(0,1.35fr),minmax(340px,0.65fr)]">
      <!-- Hero Config -->
      <section class="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div class="border-b border-gray-200 bg-gradient-to-br from-white via-green-50/60 to-lime-50/70 px-5 py-4 dark:border-neutral-800 dark:from-neutral-900 dark:via-green-950/10 dark:to-neutral-900">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 class="text-base font-bold text-gray-900 dark:text-white">Hero Galeri</h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                Cover hero diunggah ke Cloudinary. File lama akan dihapus setelah konfigurasi berhasil disimpan.
              </p>
            </div>
            <Icon icon="lucide:images" class="h-5 w-5 text-green-600" />
          </div>
        </div>

        <div class="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr),340px]">
          <div class="space-y-4">
            <div>
              <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                Link Cover
              </label>

              <div class="flex flex-col gap-2 sm:flex-row">
                <input
                  v-model.trim="form.hero.cover"
                  placeholder="/assets/images/activity1.jpg"
                  class="h-11 min-w-0 flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  @input="clearHeroPublicIdOnManualInput"
                />

                <label
                  class="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  :class="uploadingKey === 'hero' ? 'pointer-events-none opacity-70' : ''"
                >
                  <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" class="hidden" @change="onPickHero" />
                  <Icon :icon="uploadingKey === 'hero' ? 'svg-spinners:3-dots-fade' : 'lucide:cloud-upload'" class="h-4 w-4" />
                  {{ uploadingKey === 'hero' ? 'Upload…' : 'Cloudinary' }}
                </label>

                <button
                  v-if="form.hero.cover"
                  type="button"
                  class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
                  @click="removeHeroCover"
                >
                  <Icon icon="lucide:trash-2" class="h-4 w-4" />
                  Hapus
                </button>
              </div>

              <p v-if="form.hero.coverPublicId" class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                Image ID: <span class="font-semibold text-green-700 dark:text-green-300">{{ form.hero.coverPublicId }}</span>
              </p>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                  Badge
                </label>
                <input
                  v-model.trim="form.hero.badge"
                  class="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                  Judul Utama
                </label>
                <input
                  v-model.trim="form.hero.title"
                  class="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                Subjudul
              </label>
              <textarea
                v-model.trim="form.hero.subtitle"
                rows="4"
                class="w-full resize-y rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              ></textarea>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                  Tinggi Mobile
                </label>
                <input
                  v-model.trim="form.hero.heightSm"
                  placeholder="36vh"
                  class="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                  Tinggi Desktop
                </label>
                <input
                  v-model.trim="form.hero.heightLg"
                  placeholder="44vh"
                  class="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div class="overflow-hidden rounded-[26px] border border-gray-200 bg-gray-100 dark:border-neutral-800 dark:bg-neutral-800">
            <div class="relative aspect-[4/5]">
              <img
                v-if="form.hero.cover && !isBrokenImage(form.hero.cover)"
                :src="form.hero.cover"
                alt="Hero preview"
                class="h-full w-full object-cover"
                @error="markBroken(form.hero.cover)"
              />

              <InvalidImageState
                v-else
                :is-invalid="Boolean(form.hero.cover && isBrokenImage(form.hero.cover))"
                title-empty="Belum ada cover"
                note-empty="Upload file atau isi link gambar."
              />

              <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-5">
                <p class="text-xs font-bold uppercase tracking-wide text-green-200">
                  {{ form.hero.badge || 'Galeri' }}
                </p>
                <h3 class="mt-1 line-clamp-2 text-xl font-black text-white">
                  {{ form.hero.title || 'Judul Hero' }}
                </h3>
                <p class="mt-1 line-clamp-2 text-xs text-green-50/90">
                  {{ form.hero.subtitle || 'Subjudul hero galeri.' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Text Config -->
      <section class="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div class="border-b border-gray-200 px-5 py-4 dark:border-neutral-800">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 class="text-base font-bold text-gray-900 dark:text-white">Teks Interface</h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                Atur label yang tampil di halaman publik.
              </p>
            </div>
            <Icon icon="lucide:text-cursor-input" class="h-5 w-5 text-green-600" />
          </div>
        </div>

        <div class="space-y-4 p-5">
          <div>
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
              Placeholder Pencarian
            </label>
            <input
              v-model.trim="form.texts.searchPlaceholder"
              class="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
              Label Kategori Semua
            </label>
            <input
              v-model.trim="form.texts.categoryAll"
              class="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
              Label Load More
            </label>
            <input
              v-model.trim="form.texts.loadMore"
              class="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <button
            type="button"
            class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="savingConfig"
            @click="saveConfig"
          >
            <Icon :icon="savingConfig ? 'svg-spinners:3-dots-fade' : 'lucide:save'" class="h-4 w-4" />
            {{ savingConfig ? 'Menyimpan…' : 'Simpan Konfigurasi' }}
          </button>
        </div>
      </section>
    </div>

    <!-- Gallery -->
    <div v-show="activeTab === 'gallery'" class="space-y-5">
      <!-- Category Filter -->
      <div class="rounded-3xl border border-gray-200/80 bg-white/85 p-4 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/85">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              type="button"
              class="inline-flex shrink-0 items-center rounded-full border px-4 py-2 text-xs font-bold transition"
              :class="fCategory === 'all'
                ? 'border-green-600 bg-green-600 text-white shadow-lg shadow-green-500/20'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'"
              @click="fCategory = 'all'"
            >
              {{ form.texts.categoryAll || 'Semua' }}
            </button>

            <button
              v-for="category in categories"
              :key="category"
              type="button"
              class="inline-flex shrink-0 items-center rounded-full border px-4 py-2 text-xs font-bold transition"
              :class="fCategory === category
                ? 'border-green-600 bg-green-600 text-white shadow-lg shadow-green-500/20'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'"
              @click="fCategory = category"
            >
              {{ category }}
            </button>
          </div>

          <div class="flex shrink-0 items-center gap-2">
            <span class="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
              {{ filtered.length }} item
            </span>

            <button
              type="button"
              class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-xs font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
              @click="openItemCreate"
            >
              <Icon icon="lucide:plus" class="h-4 w-4" />
              Tambah Foto
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <div
          v-for="i in 8"
          :key="i"
          class="h-80 animate-pulse rounded-[26px] border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
        ></div>
      </div>

      <!-- Empty -->
      <div
        v-else-if="filtered.length === 0"
        class="rounded-[28px] border border-dashed border-gray-300 bg-white p-10 text-center dark:border-neutral-700 dark:bg-neutral-900"
      >
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300">
          <Icon icon="lucide:images" class="h-7 w-7" />
        </div>

        <h3 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">
          Belum ada foto yang cocok
        </h3>

        <p class="mt-2 text-sm text-gray-500 dark:text-neutral-400">
          Coba kata kunci lain atau tambahkan foto baru.
        </p>

        <button
          type="button"
          class="mt-5 inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
          @click="openItemCreate"
        >
          + Tambah Foto
        </button>
      </div>

      <!-- Cards -->
      <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <article
          v-for="g in paged"
          :key="`${g.__index}-${g.src}-${g.title}`"
          class="group overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-green-900/50"
        >
          <div class="relative aspect-[16/11] overflow-hidden bg-gray-100 dark:bg-neutral-800">
            <img
              v-if="g.src && !isBrokenImage(g.src)"
              :src="g.src"
              :alt="g.title || 'Gallery image'"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
              @error="markBroken(g.src)"
            />

            <InvalidImageState
              v-else
              compact
              :is-invalid="Boolean(g.src && isBrokenImage(g.src))"
              title-empty="Belum ada gambar"
              note-empty="Upload gambar ke Cloudinary."
            />

            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80"></div>

            <div class="absolute left-3 top-3 flex flex-wrap gap-2">
              <span class="rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                {{ g.category || 'Umum' }}
              </span>

              <span
                v-if="g.cloudinaryPublicId"
                class="rounded-full bg-green-600/85 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur"
              >
                Cloudinary
              </span>
            </div>

            <div class="absolute right-3 top-3 flex gap-2 opacity-0 transition duration-300 group-hover:opacity-100">
              <button
                type="button"
                class="grid h-9 w-9 place-items-center rounded-2xl bg-white/90 text-gray-700 shadow-sm backdrop-blur transition hover:bg-white dark:bg-neutral-900/90 dark:text-neutral-200"
                @click="openItemEdit(g.__index)"
              >
                <Icon icon="lucide:pencil-line" class="h-4 w-4" />
              </button>

              <button
                type="button"
                class="grid h-9 w-9 place-items-center rounded-2xl bg-rose-600 text-white shadow-sm backdrop-blur transition hover:bg-rose-700"
                @click="openDelete(g.__index)"
              >
                <Icon icon="lucide:trash-2" class="h-4 w-4" />
              </button>
            </div>

            <div class="absolute inset-x-0 bottom-0 p-4">
              <h3 class="line-clamp-2 text-base font-bold text-white">
                {{ g.title || 'Tanpa judul' }}
              </h3>

              <div v-if="tagsArray(g.tagsText).length" class="mt-2 flex flex-wrap gap-1.5">
                <span
                  v-for="tag in tagsArray(g.tagsText).slice(0, 3)"
                  :key="tag"
                  class="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold text-white ring-1 ring-white/20 backdrop-blur"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
          </div>

          <div class="space-y-3 p-4">
            <div class="flex items-center justify-between gap-3 text-[12px] text-gray-500 dark:text-neutral-400">
              <span class="inline-flex items-center gap-1">
                <Icon icon="lucide:folder" class="h-3.5 w-3.5" />
                {{ g.category || 'Umum' }}
              </span>

              <span class="inline-flex items-center gap-1">
                <Icon icon="lucide:hash" class="h-3.5 w-3.5" />
                {{ tagsArray(g.tagsText).length }} tag
              </span>
            </div>

            <p class="line-clamp-2 text-sm text-gray-600 dark:text-neutral-300">
              {{ tagsArray(g.tagsText).length ? tagsArray(g.tagsText).join(', ') : 'Belum ada tag untuk foto ini.' }}
            </p>

            <div class="flex items-center gap-2 pt-1">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                @click="openItemEdit(g.__index)"
              >
                Edit
              </button>

              <button
                type="button"
                class="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
                @click="openDelete(g.__index)"
              >
                Hapus
              </button>

              <a
                v-if="g.src"
                :href="g.src"
                target="_blank"
                rel="noopener"
                class="ml-auto inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                Lihat
              </a>
            </div>
          </div>
        </article>
      </div>

      <div v-if="hasMore && !loading" class="text-center">
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          @click="page++"
        >
          {{ form.texts.loadMore || 'Tampilkan Lebih Banyak' }}
        </button>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <teleport to="body">
      <div v-if="itemModal.open" class="fixed inset-0 z-[95]">
        <div class="absolute inset-0 bg-black/45 backdrop-blur-sm" @click="closeItemModal()"></div>

        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-5xl overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
            <div class="border-b border-gray-200 bg-gradient-to-br from-white via-green-50/50 to-lime-50/60 px-5 py-4 dark:border-neutral-800 dark:from-neutral-900 dark:via-green-950/10 dark:to-neutral-900">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h3 class="text-base font-bold text-gray-900 dark:text-white">
                    {{ itemModal.mode === 'create' ? 'Tambah Foto Galeri' : 'Edit Foto Galeri' }}
                  </h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                    Upload gambar ke Cloudinary, lalu isi judul, kategori, dan tags.
                  </p>
                </div>

                <button
                  type="button"
                  class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="closeItemModal()"
                >
                  <Icon icon="lucide:x" class="h-4 w-4" />
                </button>
              </div>
            </div>

            <form class="grid gap-5 p-5 lg:grid-cols-[150px,minmax(0,1fr)]" @submit.prevent="saveItem">
              <div class="overflow-hidden rounded-[26px] border border-gray-200 bg-gray-100 dark:border-neutral-800 dark:bg-neutral-800">
                <div class="relative h-40 overflow-hidden sm:h-44 lg:h-48">
                  <img
                    v-if="itemForm.src && !isBrokenImage(itemForm.src)"
                    :src="itemForm.src"
                    alt="Preview"
                    class="h-full w-full object-cover transition duration-500"
                    @error="markBroken(itemForm.src)"
                  />

                  <InvalidImageState
                    v-else
                    :is-invalid="Boolean(itemForm.src && isBrokenImage(itemForm.src))"
                    title-empty="Preview gambar"
                    note-empty="Upload gambar atau isi link gambar."
                  />

                  <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-4">
                    <span class="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold text-white ring-1 ring-white/20 backdrop-blur">
                      {{ itemForm.category || 'Kategori' }}
                    </span>

                    <h4 class="mt-2 line-clamp-2 text-base font-black text-white md:text-lg">
                      {{ itemForm.title || 'Judul Foto' }}
                    </h4>

                    <p class="mt-1 line-clamp-2 text-xs text-white/80">
                      {{ tagsArray(itemForm.tagsText).join(', ') || 'Tags akan tampil di sini.' }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="max-h-[65vh] space-y-4 overflow-y-auto pr-1">
                <div>
                  <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                    Link Gambar
                  </label>

                  <div class="flex flex-col gap-2 sm:flex-row">
                    <input
                      v-model.trim="itemForm.src"
                      placeholder="https://res.cloudinary.com/..."
                      class="h-11 min-w-0 flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                      @input="clearItemPublicIdOnManualInput"
                    />

                    <label
                      class="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      :class="uploadingKey === 'item' ? 'pointer-events-none opacity-70' : ''"
                    >
                      <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" class="hidden" @change="onPickItemImage" />
                      <Icon :icon="uploadingKey === 'item' ? 'svg-spinners:3-dots-fade' : 'lucide:cloud-upload'" class="h-4 w-4" />
                      {{ uploadingKey === 'item' ? 'Uploading' : 'Upload' }}
                    </label>
                  </div>

                  <p v-if="itemForm.cloudinaryPublicId" class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                    Image ID:
                    <span class="font-semibold text-green-700 dark:text-green-300">{{ itemForm.cloudinaryPublicId }}</span>
                  </p>
                </div>

                <div class="grid gap-4 md:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                      Judul
                    </label>
                    <input
                      v-model.trim="itemForm.title"
                      required
                      maxlength="90"
                      class="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                      placeholder="Dokumentasi Kegiatan Santri"
                    />
                  </div>

                  <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                      Kategori
                    </label>
                    <input
                      v-model.trim="itemForm.category"
                      list="gallery-category-options"
                      maxlength="40"
                      class="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                      placeholder="Kegiatan / Fasilitas / Prestasi"
                    />
                    <datalist id="gallery-category-options">
                      <option v-for="category in categories" :key="category" :value="category" />
                    </datalist>
                  </div>
                </div>

                <div>
                  <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                    Tags
                  </label>
                  <input
                    v-model.trim="itemForm.tagsText"
                    maxlength="140"
                    class="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    placeholder="santri, kajian, kelas"
                  />
                  <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                    Pisahkan tags dengan koma.
                  </p>
                </div>

                <div class="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    class="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="closeItemModal()"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                    :disabled="itemSaving || uploadingKey === 'item'"
                  >
                    <Icon :icon="itemSaving ? 'svg-spinners:3-dots-fade' : 'lucide:save'" class="h-4 w-4" />
                    {{ itemSaving ? 'Menyimpan…' : itemModal.mode === 'create' ? 'Simpan Foto' : 'Update Foto' }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Delete Modal -->
    <teleport to="body">
      <div v-if="delModal.open" class="fixed inset-0 z-[96]">
        <div class="absolute inset-0 bg-black/45 backdrop-blur-sm" @click="closeDelete"></div>

        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-md overflow-hidden rounded-[28px] border border-rose-200 bg-white shadow-2xl dark:border-rose-900/40 dark:bg-neutral-900">
            <div class="border-b border-rose-100 px-5 py-4 dark:border-rose-900/30">
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-start gap-3">
                  <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-300">
                    <Icon icon="lucide:alert-triangle" class="h-5 w-5" />
                  </div>
                  <div>
                    <h3 class="text-base font-bold text-gray-900 dark:text-white">Hapus Item</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                      Data foto akan dihapus. Jika file memiliki Image ID, file Image juga akan dihapus.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="closeDelete"
                >
                  <Icon icon="lucide:x" class="h-4 w-4" />
                </button>
              </div>
            </div>

            <div class="p-5 text-sm text-gray-600 dark:text-neutral-300">
              Yakin ingin menghapus <span class="font-bold text-gray-900 dark:text-white">{{ delModal.title }}</span>?
            </div>

            <div class="flex justify-end gap-2 border-t border-gray-100 p-5 dark:border-neutral-800">
              <button
                type="button"
                class="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                @click="closeDelete"
              >
                Batal
              </button>

              <button
                type="button"
                class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
                :disabled="deletingItem"
                @click="doDelete"
              >
                <Icon :icon="deletingItem ? 'svg-spinners:3-dots-fade' : 'lucide:trash-2'" class="h-4 w-4" />
                {{ deletingItem ? 'Menghapus…' : 'Hapus' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Toast -->
    <teleport to="body">
      <div class="fixed bottom-4 right-4 z-[100] space-y-2">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="rounded-2xl px-4 py-3 shadow-lg ring-1 backdrop-blur"
          :class="t.type === 'success'
            ? 'bg-green-600/95 text-white ring-green-800/50'
            : t.type === 'error'
              ? 'bg-rose-600/95 text-white ring-rose-800/50'
              : 'bg-neutral-900/95 text-white ring-black/20'"
        >
          <div class="flex items-center gap-2">
            <Icon
              :icon="t.type === 'success' ? 'lucide:check-circle' : t.type === 'error' ? 'lucide:alert-triangle' : 'lucide:info'"
              class="h-4 w-4"
            />
            <span class="text-sm">{{ t.message }}</span>
          </div>
        </div>
      </div>
    </teleport>
  </section>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, reactive, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useWeb } from '~/composables/data/useWeb'
import { useCloudinaryUpload } from '~/composables/useCloudinaryUpload'

definePageMeta({
  layout: 'app',
  layoutProps: { title: 'Galeri' },
  ssr: false
})

type GalleryItem = {
  src: string
  title: string
  category: string
  tagsText?: string
  cloudinaryPublicId?: string
}

type IndexedGalleryItem = GalleryItem & {
  __index: number
}

type Shape = {
  hero: {
    cover: string
    coverPublicId?: string
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
    items: GalleryItem[]
  }
}

type Toast = {
  id: number
  message: string
  type?: 'success' | 'error' | 'info'
}

const ACTIVE_PATH = '/gallery'
const CLOUDINARY_FOLDER = 'gallery'

const tabs = [
  { key: 'gallery', label: 'Galeri', icon: 'lucide:images' },
  { key: 'settings', label: 'Pengaturan', icon: 'lucide:settings-2' }
] as const

const activeTab = ref<typeof tabs[number]['key']>('gallery')

const defaults: Shape = {
  hero: {
    cover: '/assets/images/activity1.jpg',
    coverPublicId: '',
    badge: 'Galeri Al-Inayah',
    title: 'Galeri Al-Inayah',
    subtitle: 'Dokumentasi kegiatan, fasilitas, dan momen terbaik di pesantren.',
    heightSm: '36vh',
    heightLg: '44vh'
  },
  texts: {
    searchPlaceholder: 'Cari foto (judul/tag/kategori)…',
    categoryAll: 'Semua',
    loadMore: 'Tampilkan Lebih Banyak'
  },
  gallery: {
    items: [
      {
        src: '/assets/images/gallery/1.jpg',
        title: 'Dokumentasi #1',
        category: 'Kegiatan',
        tagsText: 'santri, kajian',
        cloudinaryPublicId: ''
      },
      {
        src: '/assets/images/gallery/2.jpg',
        title: 'Dokumentasi #2',
        category: 'Fasilitas',
        tagsText: 'kelas, perpustakaan',
        cloudinaryPublicId: ''
      }
    ]
  }
}

const web = useWeb()
const { subscribePage, sections, updateSection, addSection, normalizePath } = web

const {
  uploadImage,
  deleteImage
} = useCloudinaryUpload()

const form = reactive<Shape>(clone(defaults))

const loading = ref(true)
const savingConfig = ref(false)
const itemSaving = ref(false)
const deletingItem = ref(false)
const uploadingKey = ref<string | null>(null)
const errorMessage = ref('')

const q = ref('')
const fCategory = ref<'all' | string>('all')
const page = ref(1)
const pageSize = 12

const brokenImages = ref<Record<string, boolean>>({})

const lastSavedHeroPublicId = ref<string | null>(null)
const heroLastUploadedUrl = ref('')

const itemOriginalPublicId = ref<string | null>(null)
const itemLastUploadedUrl = ref('')

const itemModal = reactive<{
  open: boolean
  mode: 'create' | 'edit'
  idx: number | null
}>({
  open: false,
  mode: 'create',
  idx: null
})

const itemForm = reactive<GalleryItem>({
  src: '',
  title: '',
  category: '',
  tagsText: '',
  cloudinaryPublicId: ''
})

const delModal = reactive<{
  open: boolean
  idx: number | null
  title?: string
}>({
  open: false,
  idx: null,
  title: ''
})

const toasts = ref<Toast[]>([])

const sectionId = computed(() => {
  return sections.value.find((section: any) => section.key === 'GalleryPage')?.id || null
})

const items = computed<GalleryItem[]>(() => {
  return Array.isArray(form.gallery.items) ? form.gallery.items : []
})

const indexedItems = computed<IndexedGalleryItem[]>(() => {
  return items.value.map((item, index) => ({
    ...item,
    __index: index
  }))
})

const categories = computed(() => {
  const set = new Set<string>()

  for (const item of items.value) {
    const category = String(item.category || '').trim()
    if (category) set.add(category)
  }

  return Array.from(set).sort((a, b) => a.localeCompare(b))
})

const taggedCount = computed(() => {
  return items.value.filter((item) => tagsArray(item.tagsText).length > 0).length
})

const filtered = computed<IndexedGalleryItem[]>(() => {
  const query = q.value.trim().toLowerCase()

  return indexedItems.value.filter((item) => {
    if (fCategory.value !== 'all' && String(item.category || '') !== fCategory.value) return false

    if (!query) return true

    const haystack = [
      item.title,
      item.category,
      item.tagsText
    ].join(' ').toLowerCase()

    return haystack.includes(query)
  })
})

const paged = computed(() => {
  return filtered.value.slice(0, page.value * pageSize)
})

const hasMore = computed(() => {
  return paged.value.length < filtered.value.length
})

watch([q, fCategory], () => {
  page.value = 1
})

watch(
  () => form.hero.cover,
  (value, oldValue) => {
    if (oldValue) clearBroken(oldValue)
    if (value) clearBroken(value)
  }
)

watch(
  () => itemForm.src,
  (value, oldValue) => {
    if (oldValue) clearBroken(oldValue)
    if (value) clearBroken(value)
  }
)

onMounted(async () => {
  try {
    loading.value = true
    errorMessage.value = ''

    ;(web as any)?.setActivePath?.(ACTIVE_PATH)

    await subscribePage(ACTIVE_PATH)
    await ensureSectionExists()
    hydrateForm()
  } catch (error: any) {
    console.error(error)
    errorMessage.value = error?.message || 'Gagal memuat data galeri.'
    toast('Gagal memuat data galeri.', 'error')
  } finally {
    loading.value = false
  }
})

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

function merge(base: Shape, patch?: Partial<Shape>): Shape {
  return {
    hero: {
      cover: patch?.hero?.cover ?? base.hero.cover,
      coverPublicId: patch?.hero?.coverPublicId ?? '',
      badge: patch?.hero?.badge ?? base.hero.badge,
      title: patch?.hero?.title ?? base.hero.title,
      subtitle: patch?.hero?.subtitle ?? base.hero.subtitle,
      heightSm: patch?.hero?.heightSm ?? base.hero.heightSm,
      heightLg: patch?.hero?.heightLg ?? base.hero.heightLg
    },
    texts: {
      searchPlaceholder: patch?.texts?.searchPlaceholder ?? base.texts.searchPlaceholder,
      categoryAll: patch?.texts?.categoryAll ?? base.texts.categoryAll,
      loadMore: patch?.texts?.loadMore ?? base.texts.loadMore
    },
    gallery: {
      items: Array.isArray(patch?.gallery?.items)
        ? patch.gallery!.items.map(normalizeItem)
        : clone(base.gallery.items)
    }
  }
}

function normalizeItem(item: Partial<GalleryItem>): GalleryItem {
  return {
    src: String(item?.src || '').trim(),
    title: String(item?.title || '').trim() || 'Tanpa judul',
    category: String(item?.category || '').trim() || 'Umum',
    tagsText: tagsArray(item?.tagsText).join(', '),
    cloudinaryPublicId: String(item?.cloudinaryPublicId || '').trim()
  }
}

function hydrateForm() {
  const section = sections.value.find((item: any) => item.key === 'GalleryPage')
  const props = (section?.props || {}) as Partial<Shape>
  const next = merge(defaults, props)

  Object.assign(form, next)

  lastSavedHeroPublicId.value = next.hero.coverPublicId || null
  heroLastUploadedUrl.value = next.hero.coverPublicId ? next.hero.cover : ''
}

async function ensureSectionExists() {
  if (sectionId.value) return sectionId.value

  const path = normalizePath ? normalizePath(ACTIVE_PATH) : ACTIVE_PATH

  await addSection(
    {
      key: 'GalleryPage',
      enabled: true,
      props: clone(defaults)
    },
    path
  )

  await subscribePage(ACTIVE_PATH)

  return sectionId.value
}

async function saveConfig() {
  try {
    savingConfig.value = true
    errorMessage.value = ''

    const id = await ensureSectionExists()

    if (!id) {
      throw new Error('Section GalleryPage tidak ditemukan.')
    }

    const previousHeroPublicId = lastSavedHeroPublicId.value
    const nextHeroPublicId = form.hero.coverPublicId || null

    await updateSection(id, { props: clone(form) })

    if (previousHeroPublicId && previousHeroPublicId !== nextHeroPublicId) {
      await safeDeleteCloudinary(previousHeroPublicId, 'Cover lama berhasil dihapus.')
    }

    lastSavedHeroPublicId.value = nextHeroPublicId
    heroLastUploadedUrl.value = nextHeroPublicId ? form.hero.cover : ''

    toast('Konfigurasi galeri tersimpan.')
  } catch (error: any) {
    console.error(error)
    errorMessage.value = error?.message || 'Gagal menyimpan konfigurasi.'
    toast('Gagal menyimpan konfigurasi.', 'error')
  } finally {
    savingConfig.value = false
  }
}

function resetDefaults() {
  Object.assign(form, clone(defaults))
  page.value = 1
  fCategory.value = 'all'
  q.value = ''
  toast('Form dikembalikan ke default.', 'info')
}

function openItemCreate() {
  activeTab.value = 'gallery'
  itemModal.open = true
  itemModal.mode = 'create'
  itemModal.idx = null

  itemOriginalPublicId.value = null
  itemLastUploadedUrl.value = ''

  Object.assign(itemForm, {
    src: '',
    title: '',
    category: categories.value[0] || '',
    tagsText: '',
    cloudinaryPublicId: ''
  })
}

function openItemEdit(index: number) {
  const item = items.value[index]

  if (!item) return

  activeTab.value = 'gallery'
  itemModal.open = true
  itemModal.mode = 'edit'
  itemModal.idx = index

  const normalized = normalizeItem(item)

  itemOriginalPublicId.value = normalized.cloudinaryPublicId || null
  itemLastUploadedUrl.value = normalized.cloudinaryPublicId ? normalized.src : ''

  Object.assign(itemForm, normalized)
}

async function closeItemModal(cleanupPending = true) {
  if (cleanupPending) {
    await cleanupPendingItemUpload()
  }

  itemModal.open = false
  itemModal.idx = null
  itemOriginalPublicId.value = null
  itemLastUploadedUrl.value = ''

  Object.assign(itemForm, {
    src: '',
    title: '',
    category: '',
    tagsText: '',
    cloudinaryPublicId: ''
  })
}

async function cleanupPendingItemUpload() {
  const currentPublicId = itemForm.cloudinaryPublicId || ''
  const originalPublicId = itemOriginalPublicId.value || ''

  if (currentPublicId && currentPublicId !== originalPublicId) {
    await safeDeleteCloudinary(currentPublicId)
  }
}

async function saveItem() {
  try {
    itemSaving.value = true
    errorMessage.value = ''

    const id = await ensureSectionExists()

    if (!id) {
      throw new Error('Section GalleryPage tidak ditemukan.')
    }

    const arr = clone(items.value)
    const nextItem = sanitizeItem(itemForm)

    const oldItem = itemModal.idx !== null ? arr[itemModal.idx] : null
    const oldPublicId = oldItem?.cloudinaryPublicId || null
    const nextPublicId = nextItem.cloudinaryPublicId || null

    if (itemModal.mode === 'create') {
      arr.unshift(nextItem)
    } else if (itemModal.idx !== null) {
      arr[itemModal.idx] = nextItem
    }

    const nextProps = clone({
      ...form,
      gallery: {
        items: arr
      }
    })

    await updateSection(id, { props: nextProps })

    Object.assign(form.gallery, { items: arr })

    if (oldPublicId && oldPublicId !== nextPublicId) {
      await safeDeleteCloudinary(oldPublicId, 'File gambar lama berhasil dihapus.')
    }

    toast(itemModal.mode === 'create' ? 'Foto berhasil ditambahkan.' : 'Foto berhasil diperbarui.')
    await closeItemModal(false)
  } catch (error: any) {
    console.error(error)
    errorMessage.value = error?.message || 'Gagal menyimpan item.'
    toast('Gagal menyimpan item.', 'error')
  } finally {
    itemSaving.value = false
  }
}

function openDelete(index: number) {
  const item = items.value[index]

  if (!item) return

  delModal.open = true
  delModal.idx = index
  delModal.title = item.title || '(tanpa judul)'
}

function closeDelete() {
  delModal.open = false
  delModal.idx = null
  delModal.title = ''
}

async function doDelete() {
  if (delModal.idx === null) return

  try {
    deletingItem.value = true
    errorMessage.value = ''

    const id = await ensureSectionExists()

    if (!id) {
      throw new Error('Section GalleryPage tidak ditemukan.')
    }

    const arr = clone(items.value)
    const removed = arr[delModal.idx]

    arr.splice(delModal.idx, 1)

    await updateSection(id, {
      props: clone({
        ...form,
        gallery: {
          items: arr
        }
      })
    })

    Object.assign(form.gallery, { items: arr })

    if (removed?.cloudinaryPublicId) {
      await safeDeleteCloudinary(removed.cloudinaryPublicId, 'File gambar berhasil dihapus.')
    }

    toast('Item galeri dihapus.')
  } catch (error: any) {
    console.error(error)
    errorMessage.value = error?.message || 'Gagal menghapus item.'
    toast('Gagal menghapus item.', 'error')
  } finally {
    deletingItem.value = false
    closeDelete()
  }
}

async function onPickHero(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''

  if (!file) return

  const error = validateImageFile(file)

  if (error) {
    toast(error, 'error')
    return
  }

  try {
    uploadingKey.value = 'hero'
    errorMessage.value = ''

    const pendingPublicId = form.hero.coverPublicId || ''
    const savedPublicId = lastSavedHeroPublicId.value || ''

    if (pendingPublicId && pendingPublicId !== savedPublicId) {
      await safeDeleteCloudinary(pendingPublicId)
    }

    const result = await uploadImage(file, {
      folder: CLOUDINARY_FOLDER,
      maxWidth: 1800,
      maxHeight: 1800,
      quality: 0.82,
      maxBytes: 5 * 1024 * 1024
    })

    form.hero.cover = result.secure_url
    form.hero.coverPublicId = result.public_id
    heroLastUploadedUrl.value = result.secure_url

    clearBroken(result.secure_url)
    toast('Cover hero berhasil diunggah ke Cloudinary.')
  } catch (error: any) {
    console.error(error)
    toast(error?.message || 'Gagal unggah cover ke Cloudinary.', 'error')
  } finally {
    uploadingKey.value = null
  }
}

async function onPickItemImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''

  if (!file) return

  const error = validateImageFile(file)

  if (error) {
    toast(error, 'error')
    return
  }

  try {
    uploadingKey.value = 'item'
    errorMessage.value = ''

    const currentPublicId = itemForm.cloudinaryPublicId || ''
    const originalPublicId = itemOriginalPublicId.value || ''

    if (currentPublicId && currentPublicId !== originalPublicId) {
      await safeDeleteCloudinary(currentPublicId)
    }

    const result = await uploadImage(file, {
      folder: CLOUDINARY_FOLDER,
      maxWidth: 1800,
      maxHeight: 1800,
      quality: 0.82,
      maxBytes: 5 * 1024 * 1024
    })

    itemForm.src = result.secure_url
    itemForm.cloudinaryPublicId = result.public_id
    itemLastUploadedUrl.value = result.secure_url

    clearBroken(result.secure_url)
    toast('Gambar berhasil diunggah ke Cloudinary.')
  } catch (error: any) {
    console.error(error)
    toast(error?.message || 'Gagal unggah gambar ke Cloudinary.', 'error')
  } finally {
    uploadingKey.value = null
  }
}

function removeHeroCover() {
  form.hero.cover = ''
  form.hero.coverPublicId = ''
  heroLastUploadedUrl.value = ''
}

function clearHeroPublicIdOnManualInput() {
  if (form.hero.cover !== heroLastUploadedUrl.value) {
    form.hero.coverPublicId = ''
  }
}

function clearItemPublicIdOnManualInput() {
  if (itemForm.src !== itemLastUploadedUrl.value) {
    itemForm.cloudinaryPublicId = ''
  }
}

async function safeDeleteCloudinary(publicId?: string | null, successMessage?: string) {
  if (!publicId) return

  try {
    await deleteImage(publicId)

    if (successMessage) {
      toast(successMessage, 'info')
    }
  } catch (error: any) {
    console.error(error)
    toast(error?.message || 'Data tersimpan, tetapi file lama gagal dihapus.', 'error')
  }
}

function validateImageFile(file: File) {
  const maxBytes = 5 * 1024 * 1024
  const allowedTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])

  if (!allowedTypes.has(file.type)) {
    return 'Format gambar harus JPG, PNG, atau WebP.'
  }

  if (file.size > maxBytes) {
    return 'Ukuran gambar maksimal 5 MB.'
  }

  return ''
}

function sanitizeItem(item: GalleryItem): GalleryItem {
  return {
    src: String(item.src || '').trim(),
    title: String(item.title || '').trim() || 'Tanpa judul',
    category: String(item.category || '').trim() || 'Umum',
    tagsText: tagsArray(item.tagsText).join(', '),
    cloudinaryPublicId: String(item.cloudinaryPublicId || '').trim()
  }
}

function tagsArray(value?: string) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
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
  return !!brokenImages.value[src]
}

function toast(message: string, type: Toast['type'] = 'success') {
  const id = Date.now() + Math.random()

  toasts.value.push({
    id,
    message,
    type
  })

  setTimeout(() => {
    toasts.value = toasts.value.filter((item) => item.id !== id)
  }, 3000)
}

const InvalidImageState = defineComponent({
  name: 'InvalidImageState',
  props: {
    isInvalid: {
      type: Boolean,
      default: false
    },
    compact: {
      type: Boolean,
      default: false
    },
    titleEmpty: {
      type: String,
      default: 'Belum ada gambar'
    },
    noteEmpty: {
      type: String,
      default: 'Upload atau isi link gambar.'
    }
  },
  setup(props) {
    return () =>
      h(
        'div',
        {
          class:
            'grid h-full min-h-[64px] place-items-center bg-gradient-to-br from-green-50 to-lime-50 p-6 text-center text-green-700 dark:from-neutral-800 dark:to-neutral-900 dark:text-green-300'
        },
        [
          h('div', [
            h(
              'div',
              {
                class:
                  'mx-auto grid place-items-center rounded-2xl bg-white shadow-sm dark:bg-neutral-950 ' +
                  (props.compact ? 'h-12 w-12' : 'h-14 w-14')
              },
              [
                h(Icon, {
                  icon: props.isInvalid ? 'lucide:image-off' : 'lucide:image',
                  class: props.compact ? 'h-5 w-5' : 'h-6 w-6'
                })
              ]
            ),
            h(
              'p',
              {
                class:
                  'mt-3 font-bold text-gray-900 dark:text-white ' +
                  (props.compact ? 'text-xs' : 'text-sm')
              },
              props.isInvalid ? 'Image invalid' : props.titleEmpty
            ),
            h(
              'p',
              {
                class:
                  'mt-1 text-gray-500 dark:text-neutral-400 ' +
                  (props.compact ? 'text-[11px]' : 'text-xs')
              },
              props.isInvalid ? 'Gambar tidak dapat dimuat atau URL tidak valid.' : props.noteEmpty
            )
          ])
        ]
      )
  }
})
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