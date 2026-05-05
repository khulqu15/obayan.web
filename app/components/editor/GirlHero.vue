<template>
  <section class="relative overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
    <!-- Header -->
    <div class="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-green-50 via-white to-lime-50 px-5 py-5 dark:border-neutral-800 dark:from-green-950/20 dark:via-neutral-900 dark:to-neutral-900 md:px-6">
      <div class="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-green-300/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-20 left-8 h-40 w-40 rounded-full bg-lime-300/20 blur-3xl"></div>

      <div class="relative z-10">
        <div class="inline-flex items-center gap-2 rounded-full border border-green-100 bg-white/80 px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm backdrop-blur dark:border-green-900/40 dark:bg-neutral-900/70 dark:text-green-300">
          <span class="h-2 w-2 rounded-full bg-green-500"></span>
          Akses Yayasan Editor
        </div>

        <h2 class="mt-4 text-xl font-black tracking-tight text-gray-950 dark:text-white">
          Kelola Konten Pondok Yayasan
        </h2>

        <p class="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
          Atur informasi utama, tombol aksi, kartu informasi, dan gambar section pondok dengan editor yang lebih rapi dan mudah digunakan.
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
      <!-- Konten -->
      <div v-show="activeTab === 'Konten'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Konten Utama
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Bagian ini mengatur teks utama yang tampil pada section pondok yayasan.
              </p>
            </div>

            <div class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm ring-1 ring-green-100 dark:bg-neutral-900 dark:text-green-300 dark:ring-green-900/40">
              <span class="h-2 w-2 rounded-full bg-green-500"></span>
              Basic Content
            </div>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Eyebrow
            </label>
            <input
              v-model.trim="form.eyebrow"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Informasi Pondok Yayasan"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Judul
            </label>
            <input
              v-model.trim="form.title"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Pondok Pesantren Al-Inayah Putri"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50 md:col-span-2">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Deskripsi
            </label>
            <textarea
              v-model.trim="form.description"
              rows="6"
              class="block w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Deskripsi pondok putri..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div v-show="activeTab === 'CTA'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white">
              Tombol Aksi
            </h3>
            <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
              Atur tombol lokasi dan kontak yang tampil pada section pondok putri.
            </p>
          </div>
        </div>

        <div class="grid gap-5 lg:grid-cols-2">
          <article class="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
              <h4 class="text-sm font-black text-gray-900 dark:text-white">
                Button Lokasi
              </h4>
            </div>

            <div class="space-y-4 p-4">
              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Label
                </label>
                <input
                  v-model.trim="form.ctaLocation.label"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="Lihat Lokasi"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Href Maps
                </label>
                <input
                  v-model.trim="form.ctaLocation.href"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="https://maps.app.goo.gl/..."
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Icon
                </label>
                <button
                  type="button"
                  class="flex h-12 w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="openIconPicker('loc')"
                >
                  <span class="inline-flex min-w-0 items-center gap-2">
                    <Icon :icon="form.ctaLocation.icon || 'ph:map-pin-area'" class="h-5 w-5 shrink-0" />
                    <span class="truncate">{{ form.ctaLocation.icon || 'Pilih Icon' }}</span>
                  </span>
                  <Icon icon="lucide:chevron-down" class="h-4 w-4 shrink-0 text-gray-400" />
                </button>
              </div>
            </div>
          </article>

          <article class="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
              <h4 class="text-sm font-black text-gray-900 dark:text-white">
                Button Kontak
              </h4>
            </div>

            <div class="space-y-4 p-4">
              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Label
                </label>
                <input
                  v-model.trim="form.ctaContact.label"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="Kontak Pengurus"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Href Kontak
                </label>
                <input
                  v-model.trim="form.ctaContact.href"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="tel:+62812..."
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Icon
                </label>
                <button
                  type="button"
                  class="flex h-12 w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="openIconPicker('contact')"
                >
                  <span class="inline-flex min-w-0 items-center gap-2">
                    <Icon :icon="form.ctaContact.icon || 'ph:phone-call'" class="h-5 w-5 shrink-0" />
                    <span class="truncate">{{ form.ctaContact.icon || 'Pilih Icon' }}</span>
                  </span>
                  <Icon icon="lucide:chevron-down" class="h-4 w-4 shrink-0 text-gray-400" />
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Floating -->
      <div v-show="activeTab === 'Floating'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white">
              Kartu Informasi Mengambang
            </h3>
            <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
              Atur teks kecil yang tampil sebagai kartu dekoratif di sekitar gambar.
            </p>
          </div>
        </div>

        <div class="grid gap-5 lg:grid-cols-2">
          <article class="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
              <h4 class="text-sm font-black text-gray-900 dark:text-white">
                Kartu Atas
              </h4>
            </div>

            <div class="space-y-4 p-4">
              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Judul
                </label>
                <input
                  v-model.trim="form.floatingTopTitle"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="Ustadzah"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Subjudul
                </label>
                <input
                  v-model.trim="form.floatingTopSubtitle"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="Kompeten"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Icon
                </label>
                <button
                  type="button"
                  class="flex h-12 w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="openIconPicker('top')"
                >
                  <span class="inline-flex min-w-0 items-center gap-2">
                    <Icon :icon="form.floatingTopIcon || 'ph:chalkboard-teacher'" class="h-5 w-5 shrink-0" />
                    <span class="truncate">{{ form.floatingTopIcon || 'Pilih Icon' }}</span>
                  </span>
                  <Icon icon="lucide:chevron-down" class="h-4 w-4 shrink-0 text-gray-400" />
                </button>
              </div>
            </div>
          </article>

          <article class="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
              <h4 class="text-sm font-black text-gray-900 dark:text-white">
                Kartu Bawah
              </h4>
            </div>

            <div class="space-y-4 p-4">
              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Judul
                </label>
                <input
                  v-model.trim="form.floatingBottomTitle"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="Santri awal"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Subjudul
                </label>
                <input
                  v-model.trim="form.floatingBottomSubtitle"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="70+"
                />
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Media -->
      <div v-show="activeTab === 'Media'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Gambar Section
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Upload gambar atau gunakan link gambar langsung. Detail penyimpanan tidak ditampilkan ke admin.
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
                v-if="form.image"
                :src="form.image"
                alt="Pondok Putri"
                class="h-72 w-full object-cover"
              />

              <div v-else class="grid h-72 place-items-center text-center">
                <div>
                  <Icon icon="lucide:image-plus" class="mx-auto h-10 w-10 text-gray-400" />
                  <p class="mt-2 text-sm font-semibold text-gray-500 dark:text-neutral-400">
                    Belum ada gambar
                  </p>
                </div>
              </div>

              <div
                v-if="progress.image != null"
                class="absolute inset-x-4 bottom-4 overflow-hidden rounded-full bg-white/70 p-1 backdrop-blur dark:bg-neutral-950/70"
              >
                <div
                  class="h-2 rounded-full bg-green-500 transition-all"
                  :style="{ width: `${progress.image}%` }"
                ></div>
              </div>
            </div>

            <div class="space-y-4">
              <div class="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                <button
                  type="button"
                  class="rounded-xl px-3 py-2 text-xs font-bold transition"
                  :class="mediaMode === 'upload'
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                    : 'text-gray-500 dark:text-neutral-300'"
                  @click="mediaMode = 'upload'"
                >
                  Upload
                </button>

                <button
                  type="button"
                  class="rounded-xl px-3 py-2 text-xs font-bold transition"
                  :class="mediaMode === 'url'
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                    : 'text-gray-500 dark:text-neutral-300'"
                  @click="mediaMode = 'url'"
                >
                  URL
                </button>
              </div>

              <div v-if="mediaMode === 'upload'" class="rounded-[24px] border border-dashed border-green-200 bg-green-50/60 p-5 dark:border-green-900/40 dark:bg-green-900/10">
                <input
                  id="pondok-putri-image-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  class="hidden"
                  @change="uploadMainImage"
                />

                <label
                  for="pondok-putri-image-upload"
                  class="flex cursor-pointer flex-col items-center justify-center rounded-[22px] bg-white px-5 py-8 text-center ring-1 ring-green-100 transition hover:bg-green-50 dark:bg-neutral-900 dark:ring-green-900/40 dark:hover:bg-neutral-800"
                >
                  <Icon icon="lucide:upload-cloud" class="h-9 w-9 text-green-600 dark:text-green-300" />
                  <span class="mt-3 text-sm font-black text-gray-900 dark:text-white">
                    Upload Gambar
                  </span>
                  <span class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                    Gambar otomatis dioptimalkan sebelum disimpan.
                  </span>
                </label>
              </div>

              <div v-else class="space-y-3">
                <input
                  v-model.trim="imageUrlDraft"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                />

                <button
                  type="button"
                  class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
                  :disabled="mediaBusy || !imageUrlDraft"
                  @click="applyImageUrl"
                >
                  <Icon icon="lucide:shield-check" class="h-4 w-4" />
                  Gunakan Link
                </button>
              </div>

              <button
                v-if="form.image"
                type="button"
                class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white px-4 text-sm font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
                :disabled="mediaBusy"
                @click="removeMainImage"
              >
                <Icon icon="lucide:trash-2" class="h-4 w-4" />
                Hapus Gambar
              </button>
            </div>
          </div>
        </section>
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
                Select Icon
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                Pilih icon untuk tombol atau kartu informasi.
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
                  placeholder="Search icon, mis. map, phone, teacher"
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
                  {{ iconModal.loading ? 'Searching…' : 'Search' }}
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
                No icons found.
              </p>
            </div>

            <div
              v-if="iconModal.allowOnline && iconModal.total > iconModal.limit"
              class="flex items-center justify-between text-xs text-gray-600 dark:text-neutral-300"
            >
              <span>
                Showing {{ Math.min(iconModal.total, iconModal.start + 1) }}–{{ Math.min(iconModal.total, iconModal.start + iconModal.limit) }}
                of {{ iconModal.total }}
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

type CTA = {
  label: string
  href: string
  icon?: string
}

type Shape = {
  eyebrow: string
  title: string
  description: string
  image: string
  imagePublicId?: string | null
  ctaLocation: CTA
  ctaContact: CTA
  floatingTopTitle: string
  floatingTopSubtitle: string
  floatingTopIcon?: string
  floatingBottomTitle: string
  floatingBottomSubtitle: string
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

watch(
  () => props.pagePath,
  (pagePath) => {
    if (pagePath && (web as any)?.setActivePath) {
      ;(web as any).setActivePath(pagePath)
    }
  },
  { immediate: true }
)

const tabs = [
  { key: 'Konten', label: 'Konten', icon: 'lucide:type' },
  { key: 'CTA', label: 'CTA', icon: 'lucide:mouse-pointer-click' },
  { key: 'Floating', label: 'Kartu Info', icon: 'lucide:badge-info' },
  { key: 'Media', label: 'Media', icon: 'lucide:image' }
] as const

type TabKey = typeof tabs[number]['key']

const activeTab = ref<TabKey>('Konten')

const defaults: Shape = {
  eyebrow: 'Informasi Pondok Putri',
  title: 'Pondok Pesantren Al-Inayah Putri',
  description:
    'Pondok Pesantren Al-Inayah membuka unit pendidikan putri dengan pembinaan yang berfokus pada kemandirian, disiplin, akhlak, dan program pendidikan yang setara. Unit ini dirancang untuk mendukung santri putri agar tumbuh dalam lingkungan yang aman, terarah, dan nyaman.',
  image: '/assets/images/gallery/5.jpg',
  imagePublicId: null,
  ctaLocation: {
    label: 'Lihat Lokasi',
    href: 'https://maps.app.goo.gl/BTtkMt27swwav4TA8',
    icon: 'ph:map-pin-area'
  },
  ctaContact: {
    label: 'Kontak Pengurus',
    href: 'tel:+6281234567890',
    icon: 'ph:phone-call'
  },
  floatingTopTitle: 'Ustadzah',
  floatingTopSubtitle: 'Kompeten',
  floatingTopIcon: 'ph:chalkboard-teacher',
  floatingBottomTitle: 'Santri awal',
  floatingBottomSubtitle: '70+'
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

function merge(base: Shape, patch: Partial<Shape> = {}): Shape {
  return {
    eyebrow: patch.eyebrow ?? base.eyebrow,
    title: patch.title ?? base.title,
    description: patch.description ?? base.description,
    image: patch.image ?? base.image,
    imagePublicId: patch.imagePublicId ?? base.imagePublicId ?? null,
    ctaLocation: {
      ...base.ctaLocation,
      ...(patch.ctaLocation || {})
    },
    ctaContact: {
      ...base.ctaContact,
      ...(patch.ctaContact || {})
    },
    floatingTopTitle: patch.floatingTopTitle ?? base.floatingTopTitle,
    floatingTopSubtitle: patch.floatingTopSubtitle ?? base.floatingTopSubtitle,
    floatingTopIcon: patch.floatingTopIcon ?? base.floatingTopIcon,
    floatingBottomTitle: patch.floatingBottomTitle ?? base.floatingBottomTitle,
    floatingBottomSubtitle: patch.floatingBottomSubtitle ?? base.floatingBottomSubtitle
  }
}

const form = reactive<Shape>(merge(defaults, props.section?.props || {}))

watch(
  () => props.section?.props,
  (nextProps) => {
    Object.assign(form, merge(defaults, nextProps || {}))
    imageUrlDraft.value = form.image || ''
  }
)

const savedNote = ref('')
const errNote = ref('')
const saving = ref(false)
const progress = reactive<Record<string, number | undefined>>({})

const {
  uploadImage,
  deleteImage,
  uploading,
  deleting,
  uploadError,
  deleteError
} = useCloudinaryUpload()

const mediaBusy = computed(() => uploading.value || deleting.value)
const mediaMode = ref<'upload' | 'url'>('upload')
const imageUrlDraft = ref(form.image || '')

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
  if (form.imagePublicId) {
    try {
      await deleteImage(form.imagePublicId)
    } catch {}
  }

  Object.assign(form, clone(defaults))
  imageUrlDraft.value = form.image || ''
  activeTab.value = 'Konten'

  savedNote.value = 'Form dikembalikan ke default.'
  setTimeout(() => {
    savedNote.value = ''
  }, 1500)
}

/* ===== Image Upload ===== */
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

async function uploadMainImage(event: Event) {
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

  progress.image = 5

  let timer: ReturnType<typeof window.setInterval> | null = null

  try {
    const oldPublicId = form.imagePublicId || null

    timer = window.setInterval(() => {
      if (progress.image != null && progress.image < 92) {
        progress.image += 7
      }
    }, 180)

    const result = await uploadImage(file, {
      folder: 'obayan-web/pondok-putri',
      maxWidth: 1400,
      maxHeight: 1200,
      quality: 0.84
    })

    form.image = result.secure_url
    form.imagePublicId = result.public_id
    imageUrlDraft.value = result.secure_url

    if (oldPublicId && oldPublicId !== result.public_id) {
      await deleteImage(oldPublicId)
    }

    progress.image = 100
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
      progress.image = undefined
    }, 1000)

    input.value = ''
  }
}

async function applyImageUrl() {
  const url = String(imageUrlDraft.value || '').trim()

  if (!url) {
    showErrorModal('URL kosong', 'Masukkan link gambar terlebih dahulu.')
    return
  }

  if (isLocalAssetUrl(url)) {
    await clearCloudinaryImage()
    form.image = url
    form.imagePublicId = null

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

    await clearCloudinaryImage()

    form.image = url
    form.imagePublicId = null

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

async function clearCloudinaryImage() {
  if (!form.imagePublicId) return

  try {
    await deleteImage(form.imagePublicId)
  } catch {}

  form.imagePublicId = null
}

async function removeMainImage() {
  try {
    await clearCloudinaryImage()

    form.image = ''
    form.imagePublicId = null
    imageUrlDraft.value = ''

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

/* ===== Icon Picker ===== */
type IconTarget = 'loc' | 'contact' | 'top'
type IconTab = 'Local' | 'Online'

const iconModal = reactive({
  show: false,
  target: 'loc' as IconTarget,
  tabs: ['Local', 'Online'] as IconTab[],
  activeTab: 'Local' as IconTab,
  query: '',
  loading: false,
  allowOnline: true,
  visible: [] as string[],
  total: 0,
  start: 0,
  limit: 72,
  controller: null as AbortController | null,
  localAll: [
    'ph:map-pin-area',
    'ph:map-trifold',
    'ph:map-pin',
    'ph:phone-call',
    'ph:phone',
    'ph:whatsapp-logo',
    'ph:chalkboard-teacher',
    'ph:users-three',
    'ph:book-open-text',
    'lucide:map-pin',
    'lucide:phone',
    'lucide:navigation-2',
    'lucide:users',
    'lucide:school',
    'mdi:map-marker',
    'mdi:phone',
    'mdi:whatsapp',
    'mdi:school-outline'
  ]
})

function openIconPicker(target: IconTarget) {
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
}

function chooseIcon(name: string) {
  if (iconModal.target === 'loc') {
    form.ctaLocation.icon = name
  } else if (iconModal.target === 'contact') {
    form.ctaContact.icon = name
  } else if (iconModal.target === 'top') {
    form.floatingTopIcon = name
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