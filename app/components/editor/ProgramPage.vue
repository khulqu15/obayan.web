<template>
  <section class="relative overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
    <!-- Header -->
    <div class="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-green-50 via-white to-lime-50 px-5 py-5 dark:border-neutral-800 dark:from-green-950/20 dark:via-neutral-900 dark:to-neutral-900 md:px-6">
      <div class="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-green-300/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-20 left-8 h-40 w-40 rounded-full bg-lime-300/20 blur-3xl"></div>

      <div class="relative z-10">
        <div class="inline-flex items-center gap-2 rounded-full border border-green-100 bg-white/80 px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm backdrop-blur dark:border-green-900/40 dark:bg-neutral-900/70 dark:text-green-300">
          <span class="h-2 w-2 rounded-full bg-green-500"></span>
          Program Page Editor
        </div>

        <h2 class="mt-4 text-xl font-black tracking-tight text-gray-950 dark:text-white">
          Kelola Halaman Program
        </h2>

        <p class="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
          Atur hero, statistik, filter, daftar program, kurikulum, jadwal, FAQ, dan CTA. Upload file masuk Cloudinary, sedangkan link gambar langsung disimpan ke Firebase Realtime Database saat klik Simpan.
        </p>
      </div>

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
      <!-- HERO -->
      <div v-show="activeTab === 'Hero'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Hero Program
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Atur cover, badge, judul, subjudul, dan tinggi hero halaman program.
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
                alt="Cover Program"
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

              <div
                v-if="mediaMode['hero.cover'] === 'upload'"
                class="rounded-[24px] border border-dashed border-green-200 bg-green-50/60 p-5 dark:border-green-900/40 dark:bg-green-900/10"
              >
                <input
                  id="program-hero-cover-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  class="hidden"
                  @change="(event) => uploadImageField(event, 'hero.cover')"
                />

                <label
                  for="program-hero-cover-upload"
                  class="flex cursor-pointer flex-col items-center justify-center rounded-[22px] bg-white px-5 py-8 text-center ring-1 ring-green-100 transition hover:bg-green-50 dark:bg-neutral-900 dark:ring-green-900/40 dark:hover:bg-neutral-800"
                >
                  <Icon icon="lucide:upload-cloud" class="h-9 w-9 text-green-600 dark:text-green-300" />
                  <span class="mt-3 text-sm font-black text-gray-900 dark:text-white">
                    Upload Cover
                  </span>
                  <span class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                    File akan diupload ke Cloudinary.
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
              placeholder="Pondok Pesantren Al-Inayah"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Judul
            </label>
            <input
              v-model.trim="form.hero.title"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Pelajari Program"
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
              placeholder="Integrasi diniyah–akademik–karakter..."
            ></textarea>
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Tinggi Mobile
            </label>
            <input
              v-model.trim="form.hero.heightSm"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="40vh"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Tinggi Desktop
            </label>
            <input
              v-model.trim="form.hero.heightLg"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="52vh"
            />
          </div>
        </div>
      </div>

      <!-- STATS -->
      <div v-show="activeTab === 'Stats'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Statistik Ringkas
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Tambahkan statistik singkat. Rekomendasi maksimal 4 item agar tampilan tetap rapi.
              </p>
            </div>

            <button
              type="button"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
              @click="form.stats.push({ label: 'Baru', value: '—', icon: 'ph:star' })"
            >
              <Icon icon="lucide:plus" class="h-4 w-4" />
              Tambah Stat
            </button>
          </div>
        </div>

        <div class="grid gap-5 lg:grid-cols-2">
          <article
            v-for="(item, index) in form.stats"
            :key="`stat-${index}`"
            class="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
              <div class="flex min-w-0 items-center gap-3">
                <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <Icon :icon="item.icon || 'ph:star'" class="h-5 w-5" />
                </div>
                <div class="min-w-0">
                  <h4 class="truncate text-sm font-black text-gray-900 dark:text-white">
                    {{ item.label || `Stat ${index + 1}` }}
                  </h4>
                  <p class="mt-0.5 truncate text-xs text-gray-500 dark:text-neutral-400">
                    {{ item.value || '—' }}
                  </p>
                </div>
              </div>

              <div class="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  :disabled="index === 0"
                  @click="move(form.stats, index, -1)"
                >
                  <Icon icon="lucide:arrow-up" class="h-4 w-4" />
                </button>

                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  :disabled="index === form.stats.length - 1"
                  @click="move(form.stats, index, 1)"
                >
                  <Icon icon="lucide:arrow-down" class="h-4 w-4" />
                </button>

                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
                  @click="form.stats.splice(index, 1)"
                >
                  <Icon icon="lucide:trash-2" class="h-4 w-4" />
                </button>
              </div>
            </div>

            <div class="grid gap-4 p-4 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Label
                </label>
                <input
                  v-model.trim="item.label"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Nilai
                </label>
                <input
                  v-model.trim="item.value"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div class="md:col-span-2">
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Icon
                </label>

                <button
                  type="button"
                  class="flex h-12 w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="openIconPicker({ type: 'stat', index })"
                >
                  <span class="inline-flex min-w-0 items-center gap-2">
                    <Icon :icon="item.icon || 'ph:star'" class="h-5 w-5 shrink-0" />
                    <span class="truncate">{{ item.icon || 'Pilih Icon' }}</span>
                  </span>
                  <Icon icon="lucide:chevron-down" class="h-4 w-4 shrink-0 text-gray-400" />
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- FILTERS -->
      <div v-show="activeTab === 'Filters'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white">
              Filter Program
            </h3>
            <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
              Atur daftar jenjang dan kategori yang dipakai untuk filter program.
            </p>
          </div>
        </div>

        <div class="grid gap-5 lg:grid-cols-2">
          <section class="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
              <h4 class="text-sm font-black text-gray-900 dark:text-white">
                Daftar Jenjang
              </h4>

              <button
                type="button"
                class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-xs font-bold text-white transition hover:bg-green-700"
                @click="form.filters.levels.push('Baru')"
              >
                <Icon icon="lucide:plus" class="h-4 w-4" />
                Tambah
              </button>
            </div>

            <div class="space-y-3 p-4">
              <div
                v-for="(item, index) in form.filters.levels"
                :key="`level-${index}`"
                class="flex items-center gap-2"
              >
                <input
                  v-model.trim="form.filters.levels[index]"
                  class="h-12 min-w-0 flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:focus:bg-neutral-900"
                />

                <button
                  type="button"
                  class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                  :disabled="index === 0"
                  @click="move(form.filters.levels, index, -1)"
                >
                  <Icon icon="lucide:arrow-up" class="h-4 w-4" />
                </button>

                <button
                  type="button"
                  class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                  :disabled="index === form.filters.levels.length - 1"
                  @click="move(form.filters.levels, index, 1)"
                >
                  <Icon icon="lucide:arrow-down" class="h-4 w-4" />
                </button>

                <button
                  type="button"
                  class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-700 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300"
                  @click="form.filters.levels.splice(index, 1)"
                >
                  <Icon icon="lucide:trash-2" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          <section class="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
              <h4 class="text-sm font-black text-gray-900 dark:text-white">
                Daftar Kategori
              </h4>

              <button
                type="button"
                class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-xs font-bold text-white transition hover:bg-green-700"
                @click="form.filters.categories.push('Baru')"
              >
                <Icon icon="lucide:plus" class="h-4 w-4" />
                Tambah
              </button>
            </div>

            <div class="space-y-3 p-4">
              <div
                v-for="(item, index) in form.filters.categories"
                :key="`category-${index}`"
                class="flex items-center gap-2"
              >
                <input
                  v-model.trim="form.filters.categories[index]"
                  class="h-12 min-w-0 flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:focus:bg-neutral-900"
                />

                <button
                  type="button"
                  class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                  :disabled="index === 0"
                  @click="move(form.filters.categories, index, -1)"
                >
                  <Icon icon="lucide:arrow-up" class="h-4 w-4" />
                </button>

                <button
                  type="button"
                  class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                  :disabled="index === form.filters.categories.length - 1"
                  @click="move(form.filters.categories, index, 1)"
                >
                  <Icon icon="lucide:arrow-down" class="h-4 w-4" />
                </button>

                <button
                  type="button"
                  class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-700 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300"
                  @click="form.filters.categories.splice(index, 1)"
                >
                  <Icon icon="lucide:trash-2" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- PROGRAMS -->
      <div v-show="activeTab === 'Programs'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Daftar Program
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Tambahkan program, cover, jenjang, kategori, deskripsi, dan intensitas kegiatan.
              </p>
            </div>

            <button
              type="button"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
              @click="addProgram"
            >
              <Icon icon="lucide:plus" class="h-4 w-4" />
              Tambah Program
            </button>
          </div>
        </div>

        <div class="grid gap-5">
          <article
            v-for="(program, index) in form.programs"
            :key="program.id || `program-${index}`"
            class="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
              <div class="min-w-0">
                <h4 class="truncate text-sm font-black text-gray-900 dark:text-white">
                  {{ program.title || `Program ${index + 1}` }}
                </h4>
                <p class="mt-0.5 truncate text-xs text-gray-500 dark:text-neutral-400">
                  {{ program.level || 'Jenjang' }} · {{ program.category || 'Kategori' }}
                </p>
              </div>

              <div class="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  :disabled="index === 0"
                  @click="movePrograms(index, -1)"
                >
                  <Icon icon="lucide:arrow-up" class="h-4 w-4" />
                </button>

                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  :disabled="index === form.programs.length - 1"
                  @click="movePrograms(index, 1)"
                >
                  <Icon icon="lucide:arrow-down" class="h-4 w-4" />
                </button>

                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
                  @click="removeProgram(index)"
                >
                  <Icon icon="lucide:trash-2" class="h-4 w-4" />
                </button>
              </div>
            </div>

            <div class="grid gap-5 p-4 lg:grid-cols-[0.95fr,1.05fr]">
              <div class="overflow-hidden rounded-[24px] border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                <div class="relative">
                  <img
                    v-if="program.cover"
                    :src="program.cover"
                    class="h-64 w-full object-cover"
                    :alt="program.title || `Program ${index + 1}`"
                  />

                  <div v-else class="grid h-64 place-items-center bg-gray-50 text-center dark:bg-neutral-800/60">
                    <div>
                      <Icon icon="lucide:image-plus" class="mx-auto h-9 w-9 text-gray-400" />
                      <p class="mt-2 text-sm font-semibold text-gray-500 dark:text-neutral-400">
                        Belum ada cover
                      </p>
                    </div>
                  </div>

                  <div
                    v-if="progress[`programs.${index}.cover`] != null"
                    class="absolute inset-x-3 bottom-3 overflow-hidden rounded-full bg-white/70 p-1 backdrop-blur dark:bg-neutral-950/70"
                  >
                    <div
                      class="h-2 rounded-full bg-green-500 transition-all"
                      :style="{ width: `${progress[`programs.${index}.cover`]}%` }"
                    ></div>
                  </div>
                </div>

                <div class="space-y-3 p-3">
                  <div class="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                    <button
                      type="button"
                      class="rounded-xl px-3 py-2 text-xs font-bold transition"
                      :class="mediaMode[`programs.${index}.cover`] === 'upload'
                        ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                        : 'text-gray-500 dark:text-neutral-300'"
                      @click="mediaMode[`programs.${index}.cover`] = 'upload'"
                    >
                      Upload
                    </button>

                    <button
                      type="button"
                      class="rounded-xl px-3 py-2 text-xs font-bold transition"
                      :class="mediaMode[`programs.${index}.cover`] === 'url'
                        ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                        : 'text-gray-500 dark:text-neutral-300'"
                      @click="mediaMode[`programs.${index}.cover`] = 'url'"
                    >
                      URL
                    </button>
                  </div>

                  <div v-if="mediaMode[`programs.${index}.cover`] === 'upload'">
                    <input
                      :id="`program-cover-upload-${index}`"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      class="hidden"
                      @change="(event) => uploadImageField(event, `programs.${index}.cover`)"
                    />

                    <label
                      :for="`program-cover-upload-${index}`"
                      class="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-green-200 bg-green-50/70 px-4 py-3 text-xs font-bold text-green-700 transition hover:bg-green-100 dark:border-green-900/40 dark:bg-green-900/10 dark:text-green-300 dark:hover:bg-green-900/20"
                    >
                      <Icon icon="lucide:upload-cloud" class="h-4 w-4" />
                      Upload Cover
                    </label>
                  </div>

                  <div v-else class="space-y-2">
                    <input
                      v-model.trim="mediaDraft[`programs.${index}.cover`]"
                      type="url"
                      placeholder="https://example.com/program.jpg"
                      class="h-11 w-full rounded-2xl border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                    />

                    <button
                      type="button"
                      class="inline-flex h-10 items-center justify-center rounded-2xl bg-green-600 px-3 text-xs font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
                      :disabled="mediaBusy || !mediaDraft[`programs.${index}.cover`]"
                      @click="applyImageUrl(`programs.${index}.cover`)"
                    >
                      Gunakan Link
                    </button>
                  </div>

                  <button
                    v-if="program.cover"
                    type="button"
                    class="inline-flex items-center justify-center gap-1 rounded-xl border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-900/10"
                    :disabled="mediaBusy"
                    @click="removeImageField(`programs.${index}.cover`)"
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
                    v-model.trim="program.title"
                    class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  />
                </div>

                <div class="grid gap-4 md:grid-cols-2">
                  <div>
                    <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                      Jenjang
                    </label>
                    <input
                      v-model.trim="program.level"
                      list="program-levels"
                      class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                    />
                    <datalist id="program-levels">
                      <option v-for="level in form.filters.levels" :key="level" :value="level" />
                    </datalist>
                  </div>

                  <div>
                    <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                      Kategori
                    </label>
                    <input
                      v-model.trim="program.category"
                      list="program-categories"
                      class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                    />
                    <datalist id="program-categories">
                      <option v-for="category in form.filters.categories" :key="category" :value="category" />
                    </datalist>
                  </div>
                </div>

                <div>
                  <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                    Intensitas / Waktu
                  </label>
                  <input
                    v-model.trim="program.intensity"
                    class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                    Deskripsi
                  </label>
                  <textarea
                    v-model.trim="program.desc"
                    rows="4"
                    class="block w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  ></textarea>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- CURRICULUM -->
      <div v-show="activeTab === 'Curriculum'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Kurikulum per Jenjang
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Atur level, subjudul, deskripsi, icon, materi utama, dan kitab.
              </p>
            </div>

            <button
              type="button"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
              @click="addCurriculum"
            >
              <Icon icon="lucide:plus" class="h-4 w-4" />
              Tambah
            </button>
          </div>
        </div>

        <div class="grid gap-5">
          <article
            v-for="(item, index) in form.curriculum"
            :key="`curriculum-${index}`"
            class="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
              <div class="flex min-w-0 items-center gap-3">
                <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <Icon :icon="item.icon || 'ph:book'" class="h-5 w-5" />
                </div>
                <div class="min-w-0">
                  <h4 class="truncate text-sm font-black text-gray-900 dark:text-white">
                    {{ item.level || `Kurikulum ${index + 1}` }}
                  </h4>
                  <p class="mt-0.5 truncate text-xs text-gray-500 dark:text-neutral-400">
                    {{ item.subtitle || 'Subjudul belum diisi' }}
                  </p>
                </div>
              </div>

              <div class="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  :disabled="index === 0"
                  @click="move(form.curriculum, index, -1)"
                >
                  <Icon icon="lucide:arrow-up" class="h-4 w-4" />
                </button>

                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  :disabled="index === form.curriculum.length - 1"
                  @click="move(form.curriculum, index, 1)"
                >
                  <Icon icon="lucide:arrow-down" class="h-4 w-4" />
                </button>

                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
                  @click="form.curriculum.splice(index, 1)"
                >
                  <Icon icon="lucide:trash-2" class="h-4 w-4" />
                </button>
              </div>
            </div>

            <div class="grid gap-4 p-4 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Level / Jenjang
                </label>
                <input
                  v-model.trim="item.level"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Subjudul
                </label>
                <input
                  v-model.trim="item.subtitle"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Icon
                </label>
                <button
                  type="button"
                  class="flex h-12 w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="openIconPicker({ type: 'curriculum', index })"
                >
                  <span class="inline-flex min-w-0 items-center gap-2">
                    <Icon :icon="item.icon || 'ph:book'" class="h-5 w-5 shrink-0" />
                    <span class="truncate">{{ item.icon || 'Pilih Icon' }}</span>
                  </span>
                  <Icon icon="lucide:chevron-down" class="h-4 w-4 shrink-0 text-gray-400" />
                </button>
              </div>

              <div class="md:col-span-2">
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Deskripsi
                </label>
                <textarea
                  v-model.trim="item.description"
                  rows="3"
                  class="block w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                ></textarea>
              </div>

              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Materi Utama
                </label>
                <textarea
                  v-model.trim="item.subjectsText"
                  rows="6"
                  class="block w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="Satu baris per item"
                ></textarea>
              </div>

              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Kitab
                </label>
                <textarea
                  v-model.trim="item.booksText"
                  rows="6"
                  class="block w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="Satu baris per item"
                ></textarea>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- TIMETABLE -->
      <div v-show="activeTab === 'Timetable'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Jadwal Harian
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Atur contoh jadwal harian santri.
              </p>
            </div>

            <button
              type="button"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
              @click="form.schedule.push({ time: '05.00', title: 'Kegiatan', note: '' })"
            >
              <Icon icon="lucide:plus" class="h-4 w-4" />
              Tambah
            </button>
          </div>
        </div>

        <div class="grid gap-4 lg:grid-cols-2">
          <article
            v-for="(item, index) in form.schedule"
            :key="`schedule-${index}`"
            class="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="mb-3 flex items-center justify-between gap-3">
              <h4 class="text-sm font-black text-gray-900 dark:text-white">
                Jadwal {{ index + 1 }}
              </h4>

              <div class="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                  :disabled="index === 0"
                  @click="move(form.schedule, index, -1)"
                >
                  <Icon icon="lucide:arrow-up" class="h-4 w-4" />
                </button>

                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                  :disabled="index === form.schedule.length - 1"
                  @click="move(form.schedule, index, 1)"
                >
                  <Icon icon="lucide:arrow-down" class="h-4 w-4" />
                </button>

                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-700 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300"
                  @click="form.schedule.splice(index, 1)"
                >
                  <Icon icon="lucide:trash-2" class="h-4 w-4" />
                </button>
              </div>
            </div>

            <div class="grid gap-3">
              <input
                v-model.trim="item.time"
                class="block h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                placeholder="03.30"
              />
              <input
                v-model.trim="item.title"
                class="block h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                placeholder="Judul kegiatan"
              />
              <input
                v-model.trim="item.note"
                class="block h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                placeholder="Catatan"
              />
            </div>
          </article>
        </div>
      </div>

      <!-- FAQ -->
      <div v-show="activeTab === 'FAQ'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                FAQ
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Atur pertanyaan dan jawaban yang sering ditanyakan.
              </p>
            </div>

            <button
              type="button"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
              @click="form.faqs.push({ q: 'Pertanyaan?', a: 'Jawaban.' })"
            >
              <Icon icon="lucide:plus" class="h-4 w-4" />
              Tambah FAQ
            </button>
          </div>
        </div>

        <div class="grid gap-4">
          <article
            v-for="(item, index) in form.faqs"
            :key="`faq-${index}`"
            class="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="mb-3 flex items-center justify-between gap-3">
              <h4 class="text-sm font-black text-gray-900 dark:text-white">
                FAQ {{ index + 1 }}
              </h4>

              <div class="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                  :disabled="index === 0"
                  @click="move(form.faqs, index, -1)"
                >
                  <Icon icon="lucide:arrow-up" class="h-4 w-4" />
                </button>

                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                  :disabled="index === form.faqs.length - 1"
                  @click="move(form.faqs, index, 1)"
                >
                  <Icon icon="lucide:arrow-down" class="h-4 w-4" />
                </button>

                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-700 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300"
                  @click="form.faqs.splice(index, 1)"
                >
                  <Icon icon="lucide:trash-2" class="h-4 w-4" />
                </button>
              </div>
            </div>

            <div class="grid gap-3">
              <input
                v-model.trim="item.q"
                class="block h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                placeholder="Pertanyaan"
              />
              <textarea
                v-model.trim="item.a"
                rows="3"
                class="block w-full resize-y rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                placeholder="Jawaban"
              ></textarea>
            </div>
          </article>
        </div>
      </div>

      <!-- CTA -->
      <div v-show="activeTab === 'CTA'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white">
              CTA Program
            </h3>
            <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
              Atur bagian ajakan daftar atau tombol menuju PPDB.
            </p>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="md:col-span-2 rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="inline-flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-neutral-200">
              <input
                v-model="form.cta.enabled"
                type="checkbox"
                class="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              Tampilkan CTA
            </label>
          </div>

          <div>
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Judul
            </label>
            <input
              v-model.trim="form.cta.title"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Subjudul
            </label>
            <input
              v-model.trim="form.cta.subtitle"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Teks Tombol
            </label>
            <input
              v-model.trim="form.cta.buttonText"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Link Tombol
            </label>
            <input
              v-model.trim="form.cta.buttonHref"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="/ppdb"
            />
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

    <!-- Icon Picker Modal -->
    <Teleport to="body">
      <div
        v-if="iconModal.show"
        class="fixed inset-0 z-[1002] overflow-y-auto bg-black/45 px-4 py-20 backdrop-blur-sm"
        @click.self="closeIconPicker"
      >
        <div class="mx-auto w-full max-w-4xl overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
          <div class="flex items-start justify-between gap-3 border-b border-gray-200 px-5 py-4 dark:border-neutral-800">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Pilih Icon
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                Pilih icon untuk statistik atau kurikulum.
              </p>
            </div>

            <button
              type="button"
              class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              @click="closeIconPicker"
            >
              <Icon icon="lucide:x" class="h-4 w-4" />
            </button>
          </div>

          <div class="space-y-4 p-5">
            <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div class="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                <button
                  v-for="tab in iconModal.tabs"
                  :key="tab"
                  type="button"
                  class="rounded-xl px-4 py-2 text-xs font-bold transition"
                  :class="iconModal.activeTab === tab
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                    : 'text-gray-500 dark:text-neutral-300'"
                  @click="setIconTab(tab)"
                >
                  {{ tab }}
                </button>
              </div>

              <div class="flex flex-1 gap-2 md:max-w-xl">
                <input
                  v-model.trim="iconModal.query"
                  type="text"
                  placeholder="Cari icon..."
                  class="h-11 flex-1 rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  @input="onSearchInput"
                  @keydown.enter.prevent="searchOnline(true)"
                />

                <button
                  v-if="iconModal.allowOnline"
                  type="button"
                  class="inline-flex h-11 items-center justify-center rounded-2xl bg-green-600 px-4 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
                  :disabled="iconModal.loading"
                  @click="searchOnline()"
                >
                  {{ iconModal.loading ? 'Mencari…' : 'Cari Online' }}
                </button>
              </div>
            </div>

            <div class="max-h-[420px] overflow-auto rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-950/40">
              <div class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                <button
                  v-for="name in iconModal.visible"
                  :key="name"
                  type="button"
                  class="group flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-3 text-xs transition hover:-translate-y-0.5 hover:bg-green-50 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-green-900/10"
                  @click="chooseIcon(name)"
                >
                  <Icon :icon="name" width="26" height="26" />
                  <span class="w-full truncate text-center" :title="name">{{ name }}</span>
                </button>
              </div>

              <p v-if="!iconModal.visible.length" class="py-10 text-center text-sm text-gray-500 dark:text-neutral-400">
                Tidak ada icon.
              </p>
            </div>

            <div
              v-if="iconModal.allowOnline && iconModal.total > iconModal.limit"
              class="flex items-center justify-between text-xs text-gray-600 dark:text-neutral-300"
            >
              <span>
                Menampilkan {{ Math.min(iconModal.total, iconModal.start + 1) }}–{{ Math.min(iconModal.total, iconModal.start + iconModal.limit) }}
                dari {{ iconModal.total }}
              </span>

              <div class="inline-flex gap-2">
                <button
                  type="button"
                  class="rounded-xl border border-gray-200 px-3 py-2 font-bold disabled:opacity-50 dark:border-neutral-700"
                  :disabled="iconModal.start === 0 || iconModal.loading"
                  @click="prevPage"
                >
                  Prev
                </button>

                <button
                  type="button"
                  class="rounded-xl border border-gray-200 px-3 py-2 font-bold disabled:opacity-50 dark:border-neutral-700"
                  :disabled="iconModal.start + iconModal.limit >= iconModal.total || iconModal.loading"
                  @click="nextPage"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

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

type Program = {
  id: string
  title: string
  level: string
  category: string
  desc: string
  intensity: string
  cover: string
  coverPublicId?: string | null
}

type Curriculum = {
  level: string
  subtitle: string
  icon: string
  description: string
  subjectsText?: string
  booksText?: string
  subjects?: string[]
  books?: string[]
}

type Stat = {
  label: string
  value: string
  icon: string
}

type Shape = {
  hero: {
    cover: string
    coverPublicId?: string | null
    badge: string
    title: string
    subtitle: string
    heightSm: string
    heightLg: string
  }
  stats: Stat[]
  filters: {
    levels: string[]
    categories: string[]
  }
  programs: Program[]
  curriculum: Curriculum[]
  schedule: {
    time: string
    title: string
    note: string
  }[]
  faqs: {
    q: string
    a: string
  }[]
  cta: {
    enabled: boolean
    title: string
    subtitle: string
    buttonText: string
    buttonHref: string
  }
}

type MediaMode = 'upload' | 'url'
type PickerTarget = {
  type: 'stat' | 'curriculum'
  index: number
}
type IconTab = 'Local' | 'Online'

defineOptions({
  name: 'EditorProgramPage'
})

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

function normalizePath(path?: string) {
  const raw = path || '/program'
  return web?.normalizePath ? web.normalizePath(String(raw)) : String(raw)
}

watch(
  () => props.pagePath,
  (pagePath) => {
    if ((web as any)?.setActivePath) {
      ;(web as any).setActivePath(normalizePath(pagePath))
    }
  },
  { immediate: true }
)

const tabs = [
  { key: 'Hero', label: 'Hero', icon: 'lucide:layout-template' },
  { key: 'Stats', label: 'Stats', icon: 'lucide:bar-chart-3' },
  { key: 'Filters', label: 'Filters', icon: 'lucide:filter' },
  { key: 'Programs', label: 'Programs', icon: 'lucide:panels-top-left' },
  { key: 'Curriculum', label: 'Curriculum', icon: 'lucide:book-open' },
  { key: 'Timetable', label: 'Timetable', icon: 'lucide:clock-3' },
  { key: 'FAQ', label: 'FAQ', icon: 'lucide:circle-help' },
  { key: 'CTA', label: 'CTA', icon: 'lucide:mouse-pointer-click' }
] as const

type TabKey = typeof tabs[number]['key']

const activeTab = ref<TabKey>('Hero')

const defaults: Shape = {
  hero: {
    cover: '/assets/images/activity2.jpg',
    coverPublicId: null,
    badge: 'Pondok Pesantren Al-Inayah',
    title: 'Pelajari Program',
    subtitle: 'Integrasi diniyah–akademik–karakter: kurikulum terpadu, tahfidz, bahasa, kepemimpinan, kewirausahaan.',
    heightSm: '40vh',
    heightLg: '52vh'
  },
  stats: [
    { label: 'Target Hafalan', value: '5–15 Juz', icon: 'ph:book-open-text' },
    { label: 'Bahasa Asing', value: 'Arab & Inggris', icon: 'ph:translate' },
    { label: 'Ekstrakurikuler', value: '10+ Klub', icon: 'ph:medal-military' },
    { label: 'Jenjang', value: 'SMP–SMA', icon: 'ph:student' }
  ],
  filters: {
    levels: ['SMP', 'SMA'],
    categories: ['Tahfidz', 'Bahasa', 'Kepemimpinan', 'Akademik', 'Keterampilan']
  },
  programs: [],
  curriculum: [
    {
      level: 'SMP Al-Inayah',
      subtitle: 'Fokus pembentukan dasar diniyah & akademik',
      icon: 'ph:student',
      description: 'Pondok Pesantren Modern Terpadu untuk SMP',
      subjectsText: 'Aqidah Akhlak\nFiqih\nHadits\nBahasa Arab Dasar\nMatematika & IPA',
      booksText: 'Safinatun Najah\nTaqrib\nAmtsilati Dasar'
    }
  ],
  schedule: [
    { time: '03.30', title: 'Qiyamul Lail & Tahajjud', note: 'Shalat malam & doa' },
    { time: '04.30', title: 'Shalat Subuh & Kultum', note: 'Kajian singkat' },
    { time: '07.00', title: 'KBM Akademik', note: 'Mapel umum + diniyah' },
    { time: '17.00', title: 'Halaqah Tahfidz', note: 'Setoran & murajaah' },
    { time: '20.00', title: 'Pengajian Kitab', note: 'Kajian kitab bersama Kyai' },
    { time: '22.00', title: 'Istirahat Malam', note: 'Tidur' }
  ],
  faqs: [
    { q: 'Apakah ada target hafalan?', a: 'SMP min 5 juz, SMA min 10 juz.' }
  ],
  cta: {
    enabled: true,
    title: 'Siap bergabung dengan program Al-Inayah?',
    subtitle: 'Daftar PPDB Online tahun ajaran berjalan.',
    buttonText: 'Daftar Sekarang',
    buttonHref: '#'
  }
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

function normalizeCurriculumForEditor(item: Curriculum): Curriculum {
  const subjects = Array.isArray(item.subjects) ? item.subjects : []
  const books = Array.isArray(item.books) ? item.books : []

  return {
    ...item,
    subjectsText: item.subjectsText ?? subjects.join('\n'),
    booksText: item.booksText ?? books.join('\n')
  }
}

function normalizeCurriculumForSave(item: Curriculum): Curriculum {
  return {
    ...item,
    subjects: String(item.subjectsText || '')
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean),
    books: String(item.booksText || '')
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean)
  }
}

function normalizePrograms(items?: Program[]) {
  if (!Array.isArray(items)) return clone(defaults.programs)

  return items.map((item) => ({
    id: item.id || String(Date.now() + Math.random()),
    title: item.title || '',
    level: item.level || '',
    category: item.category || '',
    desc: item.desc || '',
    intensity: item.intensity || '',
    cover: item.cover || '',
    coverPublicId: item.coverPublicId || null
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
    stats: Array.isArray(patch.stats) && patch.stats.length ? clone(patch.stats) : clone(base.stats),
    filters: {
      levels: Array.isArray(patch.filters?.levels) && patch.filters!.levels!.length
        ? clone(patch.filters!.levels!)
        : clone(base.filters.levels),
      categories: Array.isArray(patch.filters?.categories) && patch.filters!.categories!.length
        ? clone(patch.filters!.categories!)
        : clone(base.filters.categories)
    },
    programs: normalizePrograms(patch.programs),
    curriculum: (Array.isArray(patch.curriculum) && patch.curriculum.length ? patch.curriculum : base.curriculum)
      .map(normalizeCurriculumForEditor),
    schedule: Array.isArray(patch.schedule) && patch.schedule.length ? clone(patch.schedule) : clone(base.schedule),
    faqs: Array.isArray(patch.faqs) && patch.faqs.length ? clone(patch.faqs) : clone(base.faqs),
    cta: {
      ...base.cta,
      ...(patch.cta || {})
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
const mediaMode = reactive<Record<string, MediaMode>>({})
const mediaDraft = reactive<Record<string, string>>({})

watch(
  () => [
    form.hero.cover,
    ...form.programs.map((item) => item.cover)
  ],
  () => syncMediaDrafts(),
  { immediate: true }
)

function syncMediaDrafts() {
  ensureMediaState('hero.cover', form.hero.cover)

  form.programs.forEach((item, index) => {
    ensureMediaState(`programs.${index}.cover`, item.cover)
  })
}

function ensureMediaState(key: string, value: string) {
  if (!(key in mediaMode)) {
    mediaMode[key] = 'upload'
  }

  mediaDraft[key] = value || ''
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

    const path = normalizePath(props.pagePath || '/program')

    if ((web as any)?.setActivePath) {
      ;(web as any).setActivePath(path)
    }

    const payload: Shape = clone({
      ...form,
      curriculum: form.curriculum.map(normalizeCurriculumForSave)
    })

    await web.updateSection(
      props.section.id,
      { props: payload },
      path
    )

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
    ...form.programs.map((item) => item.coverPublicId)
  ].filter(Boolean) as string[]

  try {
    await Promise.all(publicIds.map((id) => deleteImage(id)))
  } catch {}

  Object.assign(form, merge(defaults))
  syncMediaDrafts()
  activeTab.value = 'Hero'

  savedNote.value = 'Form dikembalikan ke default.'
  setTimeout(() => {
    savedNote.value = ''
  }, 1500)
}

/* ===== Array Helpers ===== */
function move<T>(arr: T[], index: number, direction: number) {
  const targetIndex = index + direction

  if (targetIndex < 0 || targetIndex >= arr.length) return

  const [item] = arr.splice(index, 1)
  if (!item) return

  arr.splice(targetIndex, 0, item)
  syncMediaDrafts()
}

function addProgram() {
  const index = form.programs.length

  form.programs.push({
    id: String(Date.now()),
    title: 'Program Baru',
    level: form.filters.levels[0] || '',
    category: form.filters.categories[0] || '',
    desc: 'Deskripsi singkat…',
    intensity: '—',
    cover: '',
    coverPublicId: null
  })

  ensureMediaState(`programs.${index}.cover`, '')
}

function movePrograms(index: number, direction: number) {
  move(form.programs, index, direction)
}

async function removeProgram(index: number) {
  const item = form.programs[index]

  if (!item) return

  if (item.coverPublicId) {
    try {
      await deleteImage(item.coverPublicId)
    } catch {}
  }

  form.programs.splice(index, 1)
  syncMediaDrafts()
}

function addCurriculum() {
  form.curriculum.push({
    level: 'Level Baru',
    subtitle: '',
    icon: 'ph:book',
    description: '',
    subjectsText: '',
    booksText: ''
  })
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
  if (key === 'hero.cover') return form.hero.coverPublicId || null

  const match = key.match(/^programs\.(\d+)\.cover$/)
  if (match) return form.programs[Number(match[1])]?.coverPublicId || null

  return null
}

function getImageValue(key: string) {
  if (key === 'hero.cover') return form.hero.cover || ''

  const match = key.match(/^programs\.(\d+)\.cover$/)
  if (match) return form.programs[Number(match[1])]?.cover || ''

  return ''
}

function setImageValue(key: string, url: string, publicId?: string | null) {
  if (key === 'hero.cover') {
    form.hero.cover = url
    form.hero.coverPublicId = publicId || null
    mediaDraft[key] = url
    return
  }

  const match = key.match(/^programs\.(\d+)\.cover$/)
  if (!match) return

  const index = Number(match[1])
  const item = form.programs[index]

  if (!item) return

  item.cover = url
  item.coverPublicId = publicId || null
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
      folder: 'obayan-web/program',
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

    savedNote.value = 'Path lokal digunakan. Klik Simpan untuk menyimpan.'
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

    savedNote.value = 'Gambar dihapus. Klik Simpan untuk menyimpan.'
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

/* ===== Icon Picker ===== */
const iconModal = reactive({
  show: false,
  tabs: ['Local', 'Online'] as IconTab[],
  activeTab: 'Local' as IconTab,
  query: '',
  visible: [] as string[],
  allowOnline: true,
  loading: false,
  total: 0,
  limit: 72,
  start: 0,
  controller: null as AbortController | null,
  target: null as PickerTarget | null,
  localAll: [
    'ph:book',
    'ph:book-open-text',
    'ph:translate',
    'ph:medal-military',
    'ph:student',
    'ph:clock',
    'ph:star',
    'lucide:book',
    'lucide:school',
    'lucide:graduation-cap',
    'lucide:users',
    'lucide:clock',
    'mdi:school-outline',
    'mdi:book-open-variant',
    'mdi:medal-outline',
    'tabler:book-2',
    'tabler:certificate',
    'tabler:sparkles'
  ]
})

function openIconPicker(target: PickerTarget) {
  iconModal.target = target
  iconModal.show = true
  iconModal.activeTab = 'Local'
  iconModal.query = ''
  iconModal.start = 0
  iconModal.total = 0
  filterLocal()
}

function closeIconPicker() {
  try {
    iconModal.controller?.abort?.()
  } catch {}

  iconModal.controller = null
  iconModal.show = false
  iconModal.visible = []
  iconModal.query = ''
  iconModal.total = 0
  iconModal.start = 0
  iconModal.target = null
}

function chooseIcon(name: string) {
  if (!iconModal.target) return

  if (iconModal.target.type === 'stat') {
    const item = form.stats[iconModal.target.index]
    if (item) item.icon = name
  }

  if (iconModal.target.type === 'curriculum') {
    const item = form.curriculum[iconModal.target.index]
    if (item) item.icon = name
  }

  closeIconPicker()
}

function setIconTab(tab: IconTab) {
  iconModal.activeTab = tab
  iconModal.start = 0

  if (tab === 'Local') {
    filterLocal()
  } else {
    searchOnline(true)
  }
}

function filterLocal() {
  const query = iconModal.query.trim().toLowerCase()
  const base = iconModal.localAll

  iconModal.visible = query
    ? base.filter((name) => name.toLowerCase().includes(query))
    : base.slice(0, iconModal.limit)

  iconModal.total = iconModal.visible.length
}

function onSearchInput() {
  iconModal.start = 0

  if (iconModal.activeTab === 'Local') {
    filterLocal()
  } else {
    searchOnline(true)
  }
}

let searchDebounce: ReturnType<typeof setTimeout> | null = null

async function searchOnline(reset = true) {
  if (!iconModal.allowOnline || typeof window === 'undefined') return

  const query = iconModal.query.trim()

  if (!query) {
    iconModal.start = 0
    iconModal.total = 0
    filterLocal()
    return
  }

  if (reset) {
    iconModal.start = 0
    iconModal.total = 0
  }

  if (searchDebounce) {
    clearTimeout(searchDebounce)
  }

  searchDebounce = setTimeout(async () => {
    try {
      iconModal.controller?.abort?.()
    } catch {}

    iconModal.controller = new AbortController()
    iconModal.loading = true

    try {
      const prefixes = ['mdi', 'tabler', 'material-symbols', 'ic', 'ph', 'lucide']
      const url =
        `https://api.iconify.design/search` +
        `?query=${encodeURIComponent(query)}` +
        `&limit=${encodeURIComponent(iconModal.limit)}` +
        `&start=${encodeURIComponent(iconModal.start)}` +
        `&prefixes=${encodeURIComponent(prefixes.join(','))}`

      const response = await fetch(url, {
        headers: {
          Accept: 'application/json'
        },
        signal: iconModal.controller.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json() as {
        icons?: string[]
        total?: number
        limit?: number
        start?: number
      }

      const hits = Array.isArray(data.icons) ? data.icons : []

      iconModal.visible = hits
      iconModal.total = Number(data.total || hits.length || 0)

      if (typeof data.limit === 'number') {
        iconModal.limit = data.limit
      }

      if (typeof data.start === 'number') {
        iconModal.start = data.start
      }

      if (!hits.length) {
        filterLocal()
      }
    } catch (error: any) {
      if (error?.name !== 'AbortError') {
        console.error('Iconify /search error:', error)
        filterLocal()
      }
    } finally {
      iconModal.loading = false
    }
  }, 220)
}

function prevPage() {
  if (iconModal.start === 0) return

  iconModal.start = Math.max(0, iconModal.start - iconModal.limit)
  searchOnline(false)
}

function nextPage() {
  if (iconModal.start + iconModal.limit >= iconModal.total) return

  iconModal.start += iconModal.limit
  searchOnline(false)
}
</script>