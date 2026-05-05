<!-- /components/editor/FacilityHero.vue -->

<template>
  <section class="relative overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
    <!-- Header -->
    <div class="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-green-50 via-white to-lime-50 px-5 py-5 dark:border-neutral-800 dark:from-green-950/20 dark:via-neutral-900 dark:to-neutral-900 md:px-6">
      <div class="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-green-300/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-20 left-8 h-40 w-40 rounded-full bg-lime-300/20 blur-3xl"></div>

      <div class="relative z-10">
        <div class="inline-flex items-center gap-2 rounded-full border border-green-100 bg-white/80 px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm backdrop-blur dark:border-green-900/40 dark:bg-neutral-900/70 dark:text-green-300">
          <span class="h-2 w-2 rounded-full bg-green-500"></span>
          Fasilitas Section Editor
        </div>

        <h2 class="mt-4 text-xl font-black tracking-tight text-gray-950 dark:text-white">
          Kelola Fasilitas, Galeri, dan Brosur
        </h2>

        <p class="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
          Atur konten fasilitas pondok, statistik, galeri foto, serta brosur PDF yang bisa ditampilkan langsung melalui embed.
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
                Konten Fasilitas
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Bagian ini mengatur teks utama yang tampil pada section fasilitas.
              </p>
            </div>

            <div class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm ring-1 ring-green-100 dark:bg-neutral-900 dark:text-green-300 dark:ring-green-900/40">
              <span class="h-2 w-2 rounded-full bg-green-500"></span>
              Basic Content
            </div>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50 md:col-span-2">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Badge
            </label>
            <input
              v-model.trim="form.badge"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Fasilitas Pondok Al-Inayah"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Heading Awal
            </label>
            <input
              v-model.trim="form.headingLead"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Nyaman, Tertib,"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Highlight 1
            </label>
            <input
              v-model.trim="form.highlight1"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Inklusif"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50 md:col-span-2">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Highlight 2 / Ekor
            </label>
            <input
              v-model.trim="form.highlight2"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="dirancang untuk bertumbuh"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50 md:col-span-2">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Deskripsi
            </label>
            <textarea
              v-model.trim="form.description"
              rows="5"
              class="block w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Deskripsi fasilitas..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div v-show="activeTab === 'Stats'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Statistik Fasilitas
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Tambahkan angka ringkas seperti jumlah asrama, ruang kelas, perpustakaan, dan lapangan.
              </p>
            </div>

            <button
              type="button"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
              @click="addStat"
            >
              <Icon icon="lucide:plus" class="h-4 w-4" />
              Tambah Stat
            </button>
          </div>
        </div>

        <div class="grid gap-4 xl:grid-cols-2">
          <article
            v-for="(item, index) in form.stats"
            :key="'stat-' + index"
            class="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
              <div class="flex items-center justify-between gap-3">
                <div class="flex min-w-0 items-center gap-3">
                  <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    <Icon :icon="item.icon || 'ph:info'" class="h-5 w-5" />
                  </div>

                  <div class="min-w-0">
                    <h4 class="truncate text-sm font-black text-gray-900 dark:text-white">
                      {{ item.label || `Stat ${index + 1}` }}
                    </h4>
                    <p class="mt-0.5 truncate text-xs text-gray-500 dark:text-neutral-400">
                      {{ item.value || '0' }}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
                  @click="removeStat(index)"
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
                  placeholder="Asrama"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Value
                </label>
                <input
                  v-model.trim="item.value"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="8"
                />
              </div>

              <div class="md:col-span-2">
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Icon
                </label>

                <button
                  type="button"
                  class="flex h-12 w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="openIconPicker({ kind: 'stat', index })"
                >
                  <span class="inline-flex min-w-0 items-center gap-2">
                    <Icon :icon="item.icon || 'ph:info'" class="h-5 w-5 shrink-0" />
                    <span class="truncate">{{ item.icon || 'Pilih Icon' }}</span>
                  </span>
                  <Icon icon="lucide:chevron-down" class="h-4 w-4 shrink-0 text-gray-400" />
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Galeri -->
      <div v-show="activeTab === 'Galeri'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Galeri Fasilitas
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Upload foto fasilitas atau gunakan link gambar langsung setelah divalidasi.
              </p>
            </div>
            <button type="button" class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700" @click="addGallery" >
              <Icon icon="lucide:plus" class="h-4 w-4" />
              Tambah Galeri
            </button>
          </div>
        </div>

        <div class="grid gap-5 xl:grid-cols-2">
          <article
            v-for="(item, index) in form.gallery"
            :key="'gallery-' + index"
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
                      {{ item.label || `Foto ${index + 1}` }}
                    </h4>
                    <p class="mt-0.5 truncate text-xs text-gray-500 dark:text-neutral-400">
                      Galeri {{ index + 1 }}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
                  @click="removeGallery(index)"
                >
                  <Icon icon="lucide:trash-2" class="h-4 w-4" />
                </button>
              </div>
            </div>

            <div class="space-y-4 p-4">
              <div class="overflow-hidden rounded-[24px] border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                <div class="relative">
                  <img
                    v-if="item.src"
                    :src="item.src"
                    class="h-56 w-full object-cover"
                    :alt="item.alt || item.label || `Foto ${index + 1}`"
                  />

                  <div v-else class="grid h-56 place-items-center bg-gray-50 text-center dark:bg-neutral-800/60">
                    <div>
                      <Icon icon="lucide:image-plus" class="mx-auto h-9 w-9 text-gray-400" />
                      <p class="mt-2 text-sm font-semibold text-gray-500 dark:text-neutral-400">
                        Belum ada gambar
                      </p>
                    </div>
                  </div>

                  <div
                    v-if="progress[`gallery.${index}`] != null"
                    class="absolute inset-x-3 bottom-3 overflow-hidden rounded-full bg-white/70 p-1 backdrop-blur dark:bg-neutral-950/70"
                  >
                    <div
                      class="h-2 rounded-full bg-green-500 transition-all"
                      :style="{ width: `${progress[`gallery.${index}`]}%` }"
                    ></div>
                  </div>
                </div>

                <div class="space-y-3 p-3">
                  <div class="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                    <button
                      type="button"
                      class="rounded-xl px-3 py-2 text-xs font-bold transition"
                      :class="mediaMode[`gallery.${index}`] === 'upload'
                        ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                        : 'text-gray-500 dark:text-neutral-300'"
                      @click="mediaMode[`gallery.${index}`] = 'upload'"
                    >
                      Upload
                    </button>

                    <button
                      type="button"
                      class="rounded-xl px-3 py-2 text-xs font-bold transition"
                      :class="mediaMode[`gallery.${index}`] === 'url'
                        ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                        : 'text-gray-500 dark:text-neutral-300'"
                      @click="mediaMode[`gallery.${index}`] = 'url'"
                    >
                      URL
                    </button>
                  </div>

                  <div v-if="mediaMode[`gallery.${index}`] === 'upload'">
                    <input
                      :id="`gallery-upload-${index}`"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      class="hidden"
                      @change="(event) => uploadGalleryImage(event, index)"
                    />

                    <label
                      :for="`gallery-upload-${index}`"
                      class="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-green-200 bg-green-50/70 px-4 py-3 text-xs font-bold text-green-700 transition hover:bg-green-100 dark:border-green-900/40 dark:bg-green-900/10 dark:text-green-300 dark:hover:bg-green-900/20"
                    >
                      <Icon icon="lucide:upload-cloud" class="h-4 w-4" />
                      Upload
                    </label>
                  </div>

                  <div v-else class="space-y-2">
                    <input
                      v-model.trim="mediaUrlDraft[`gallery.${index}`]"
                      type="url"
                      placeholder="https://example.com/fasilitas.jpg"
                      class="h-11 w-full rounded-2xl border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                    />

                    <button
                      type="button"
                      class="inline-flex h-10 items-center justify-center rounded-2xl bg-green-600 px-3 text-xs font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
                      :disabled="mediaBusy || !mediaUrlDraft[`gallery.${index}`]"
                      @click="applyGalleryUrl(index)"
                    >
                      Gunakan Link
                    </button>
                  </div>

                  <div class="flex flex-col gap-2">
                    <p class="truncate text-[11px] text-gray-500 dark:text-neutral-400">
                      Public ID:
                      <code class="rounded bg-gray-100 px-1 py-0.5 dark:bg-neutral-800">
                        {{ item.srcPublicId || '—' }}
                      </code>
                    </p>

                    <button
                      v-if="item.src"
                      type="button"
                      class="inline-flex items-center justify-center gap-1 rounded-xl border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-900/10"
                      :disabled="mediaBusy"
                      @click="removeGalleryImage(index)"
                    >
                      <Icon icon="lucide:trash-2" class="h-3.5 w-3.5" />
                      Hapus Gambar
                    </button>
                  </div>
                </div>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                    Label
                  </label>
                  <input
                    v-model.trim="item.label"
                    class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                    placeholder="Masjid & Aula"
                  />
                </div>

                <div>
                  <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                    Alt Text
                  </label>
                  <input
                    v-model.trim="item.alt"
                    class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                    placeholder="Foto fasilitas"
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                    Icon
                  </label>

                  <button
                    type="button"
                    class="flex h-12 w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="openIconPicker({ kind: 'gallery', index })"
                  >
                    <span class="inline-flex min-w-0 items-center gap-2">
                      <Icon :icon="item.icon || 'ph:info'" class="h-5 w-5 shrink-0" />
                      <span class="truncate">{{ item.icon || 'Pilih Icon' }}</span>
                    </span>
                    <Icon icon="lucide:chevron-down" class="h-4 w-4 shrink-0 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Brosur -->
      <div v-show="activeTab === 'Brosur'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Konten Brosur & Embed PDF
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Tulis keterangan brosur memakai editor teks, lalu tambahkan link PDF agar bisa tampil sebagai preview embed.
              </p>
            </div>

            <button
              type="button"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
              @click="addBrochure"
            >
              <Icon icon="lucide:file-plus-2" class="h-4 w-4" />
              Tambah PDF
            </button>
          </div>
        </div>

        <!-- PDF List -->
        <div class="grid gap-5 xl:grid-cols-2">
          <article
            v-for="(item, index) in form.brochures"
            :key="'brochure-' + index"
            class="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
              <div class="flex items-center justify-between gap-3">
                <div class="min-w-0">
                  <h4 class="truncate text-sm font-black text-gray-900 dark:text-white">
                    {{ item.title || `Brosur ${index + 1}` }}
                  </h4>
                  <p class="mt-0.5 truncate text-xs text-gray-500 dark:text-neutral-400">
                    PDF Embed {{ index + 1 }}
                  </p>
                </div>

                <div class="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    :disabled="index === 0"
                    @click="moveBrochure(index, -1)"
                  >
                    <Icon icon="lucide:arrow-up" class="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    :disabled="index === form.brochures.length - 1"
                    @click="moveBrochure(index, 1)"
                  >
                    <Icon icon="lucide:arrow-down" class="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
                    @click="removeBrochure(index)"
                  >
                    <Icon icon="lucide:trash-2" class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div class="space-y-4 p-4">
              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Judul PDF
                </label>
                <input
                  v-model.trim="item.title"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="Brosur PPDB"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Link PDF
                </label>
                <div class="flex flex-col gap-2 sm:flex-row">
                  <input
                    v-model.trim="item.pdfUrl"
                    type="url"
                    class="block h-12 flex-1 rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                    placeholder="https://example.com/brosur.pdf"
                  />

                  <button
                    type="button"
                    class="inline-flex h-12 items-center justify-center rounded-2xl bg-green-600 px-4 text-xs font-bold text-white transition hover:bg-green-700"
                    @click="validateBrochurePdf(index)"
                  >
                    Cek Link
                  </button>
                </div>
              </div>

              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Catatan
                </label>
                <textarea
                  v-model.trim="item.note"
                  rows="3"
                  class="block w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="Keterangan singkat brosur..."
                ></textarea>
              </div>

              <div class="overflow-hidden rounded-[24px] border border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-800/50">
                <div v-if="item.pdfUrl" class="h-[420px] bg-white dark:bg-neutral-950">
                  <iframe
                    :src="embedPdfUrl(item.pdfUrl)"
                    class="h-full w-full"
                    loading="lazy"
                  ></iframe>
                </div>

                <div v-else class="grid h-[260px] place-items-center text-center">
                  <div>
                    <Icon icon="lucide:file-text" class="mx-auto h-10 w-10 text-gray-400" />
                    <p class="mt-2 text-sm font-bold text-gray-600 dark:text-neutral-300">
                      Belum ada link PDF
                    </p>
                    <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                      Masukkan link PDF agar preview muncul.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>
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

    <!-- Icon Picker -->
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
                Pilih icon untuk statistik atau galeri.
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
                  placeholder="Search icon, mis. house, book, mosque"
                  class="h-11 flex-1 rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  @input="onIconSearchInput"
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
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { useWeb } from '~/composables/data/useWeb'
import { useCloudinaryUpload } from '~/composables/useCloudinaryUpload'

type Stat = {
  label: string
  value: string
  icon: string
}

type GalleryItem = {
  src: string
  srcPublicId?: string | null
  alt?: string
  label: string
  icon: string
}

type BrochureItem = {
  title: string
  pdfUrl: string
  note?: string
}

type Shape = {
  badge: string
  headingLead: string
  highlight1: string
  highlight2: string
  description: string
  stats: Stat[]
  gallery: GalleryItem[]
  brochureHtml: string
  brochures: BrochureItem[]
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
  { key: 'Stats', label: 'Stats', icon: 'lucide:bar-chart-3' },
  { key: 'Galeri', label: 'Galeri', icon: 'lucide:images' },
  { key: 'Brosur', label: 'Brosur PDF', icon: 'lucide:file-text' }
] as const

type TabKey = typeof tabs[number]['key']

const activeTab = ref<TabKey>('Konten')

const defaults: Shape = {
  badge: 'Fasilitas Pondok Al-Inayah',
  headingLead: 'Nyaman, Tertib,',
  highlight1: 'Inklusif',
  highlight2: 'dirancang untuk bertumbuh',
  description:
    'Dari asrama yang rapi, masjid yang lapang, ruang kelas interaktif, hingga perpustakaan. Semua disiapkan untuk mendukung adab, akademik, dan kemandirian santri.',
  stats: [
    { label: 'Asrama', value: '8', icon: 'ph:house' },
    { label: 'Ruang Kelas', value: '24', icon: 'ph:chalkboard-teacher' },
    { label: 'Perpustakaan', value: '1', icon: 'ph:books' },
    { label: 'Lapangan', value: '3', icon: 'ph:soccer-ball' }
  ],
  gallery: [
    { src: '/assets/images/masjid.jpg', srcPublicId: null, alt: 'Masjid pondok', label: 'Masjid & Aula', icon: 'ph:mosque' },
    { src: '/assets/images/kelas.jpg', srcPublicId: null, alt: 'Ruang kelas', label: 'Kelas Interaktif', icon: 'ph:chalkboard-teacher' },
    { src: '/assets/images/activity.jpg', srcPublicId: null, alt: 'Perpustakaan', label: 'Perpustakaan', icon: 'ph:books' }
  ],
  brochureHtml:
    '<p>Unduh dan lihat brosur resmi pondok untuk informasi pendaftaran, program pendidikan, fasilitas, dan kontak administrasi.</p>',
  brochures: [
    {
      title: 'Brosur PPDB',
      pdfUrl: '',
      note: 'Masukkan link PDF brosur PPDB.'
    }
  ]
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

function normalizeGallery(items?: GalleryItem[]) {
  if (!Array.isArray(items) || !items.length) return clone(defaults.gallery)

  return items.map((item) => ({
    src: item.src || '',
    srcPublicId: item.srcPublicId || null,
    alt: item.alt || '',
    label: item.label || 'Galeri',
    icon: item.icon || 'ph:info'
  }))
}

function normalizeBrochures(items?: any[]) {
  if (!Array.isArray(items) || !items.length) return clone(defaults.brochures)

  return items.map((item, index) => {
    if (typeof item === 'string') {
      return {
        title: `Brosur ${index + 1}`,
        pdfUrl: item,
        note: ''
      }
    }

    return {
      title: item?.title || `Brosur ${index + 1}`,
      pdfUrl: item?.pdfUrl || item?.url || '',
      note: item?.note || ''
    }
  })
}

function merge(base: Shape, patch: Partial<Shape> = {}): Shape {
  return {
    badge: patch.badge ?? base.badge,
    headingLead: patch.headingLead ?? base.headingLead,
    highlight1: patch.highlight1 ?? base.highlight1,
    highlight2: patch.highlight2 ?? base.highlight2,
    description: patch.description ?? base.description,
    stats: Array.isArray(patch.stats) && patch.stats.length ? clone(patch.stats) : clone(base.stats),
    gallery: normalizeGallery(patch.gallery as GalleryItem[]),
    brochureHtml: patch.brochureHtml ?? base.brochureHtml,
    brochures: normalizeBrochures(patch.brochures as any[])
  }
}

const form = reactive<Shape>(merge(defaults, props.section?.props || {}))

watch(
  () => props.section?.props,
  (nextProps) => {
    Object.assign(form, merge(defaults, nextProps || {}))

    if (editor.value && editor.value.getHTML() !== form.brochureHtml) {
      editor.value.commands.setContent(form.brochureHtml || '', false)
    }
  },
  { deep: false }
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

const mediaMode = reactive<Record<string, 'upload' | 'url'>>({})
const mediaUrlDraft = reactive<Record<string, string>>({})

watch(
  () => form.gallery.map((item) => item.src),
  () => syncGalleryMediaState(),
  { immediate: true, deep: true }
)

function syncGalleryMediaState() {
  form.gallery.forEach((item, index) => {
    const key = `gallery.${index}`

    if (!(key in mediaMode)) {
      mediaMode[key] = 'upload'
    }

    mediaUrlDraft[key] = item.src || ''
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

/* ===== Tiptap ===== */
const editor = useEditor({
  extensions: [
    StarterKit,
    Link.configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      HTMLAttributes: {
        class: 'text-green-700 underline underline-offset-4 dark:text-green-300'
      }
    })
  ],
  content: form.brochureHtml || '',
  editorProps: {
    attributes: {
      class: 'prose prose-sm max-w-none focus:outline-none dark:prose-invert'
    }
  },
  onUpdate: ({ editor }) => {
    form.brochureHtml = editor.getHTML()
  }
})

function setEditorLink() {
  const previousUrl = editor.value?.getAttributes('link')?.href || ''
  const url = window.prompt('Masukkan URL link:', previousUrl)

  if (url === null) return

  if (!url) {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  if (!isHttpUrl(url) && !isLocalAssetUrl(url)) {
    showErrorModal('Link tidak valid', 'Link harus diawali http://, https://, atau path lokal /...')
    return
  }

  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})

/* ===== Form Actions ===== */
async function save() {
  try {
    saving.value = true
    errNote.value = ''

    validateAllBrochureLinks()

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
  const publicIds = form.gallery
    .map((item) => item.srcPublicId)
    .filter(Boolean) as string[]

  try {
    await Promise.all(publicIds.map((id) => deleteImage(id)))
  } catch {}

  Object.assign(form, clone(defaults))
  editor.value?.commands.setContent(form.brochureHtml || '', false)
  activeTab.value = 'Konten'
  syncGalleryMediaState()

  savedNote.value = 'Form dikembalikan ke default.'
  setTimeout(() => {
    savedNote.value = ''
  }, 1500)
}

function addStat() {
  form.stats.push({
    label: 'Label',
    value: '0',
    icon: 'ph:info'
  })
}

function removeStat(index: number) {
  form.stats.splice(index, 1)
}

function addGallery() {
  const index = form.gallery.length

  form.gallery.push({
    src: '',
    srcPublicId: null,
    alt: '',
    label: 'Label Galeri',
    icon: 'ph:info'
  })

  const key = `gallery.${index}`
  mediaMode[key] = 'upload'
  mediaUrlDraft[key] = ''
}

async function removeGallery(index: number) {
  const item = form.gallery[index]
  if (!item) return

  if (item.srcPublicId) {
    try {
      await deleteImage(item.srcPublicId)
    } catch {}
  }

  form.gallery.splice(index, 1)
  syncGalleryMediaState()
}

function addBrochure() {
  form.brochures.push({
    title: `Brosur ${form.brochures.length + 1}`,
    pdfUrl: '',
    note: ''
  })
}

function removeBrochure(index: number) {
  form.brochures.splice(index, 1)
}

function moveBrochure(index: number, direction: number) {
  const targetIndex = index + direction

  if (targetIndex < 0 || targetIndex >= form.brochures.length) return

  ;[form.brochures[index], form.brochures[targetIndex]] = [
    form.brochures[targetIndex],
    form.brochures[index]
  ]
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

async function uploadGalleryImage(event: Event, index: number) {
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

  const key = `gallery.${index}`
  progress[key] = 5

  let timer: ReturnType<typeof window.setInterval> | null = null

  try {
    const oldPublicId = form.gallery[index]?.srcPublicId || null

    timer = window.setInterval(() => {
      if (progress[key] != null && progress[key]! < 92) {
        progress[key]! += 7
      }
    }, 180)

    const result = await uploadImage(file, {
      folder: 'obayan-web/facility',
      maxWidth: 1400,
      maxHeight: 900,
      quality: 0.84
    })

    if (!form.gallery[index]) return

    form.gallery[index].src = result.secure_url
    form.gallery[index].srcPublicId = result.public_id
    mediaUrlDraft[key] = result.secure_url

    if (oldPublicId && oldPublicId !== result.public_id) {
      await deleteImage(oldPublicId)
    }

    progress[key] = 100
    savedNote.value = 'Gambar berhasil diupload'
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

async function applyGalleryUrl(index: number) {
  const key = `gallery.${index}`
  const url = String(mediaUrlDraft[key] || '').trim()

  if (!url) {
    showErrorModal('URL kosong', 'Masukkan link gambar terlebih dahulu.')
    return
  }

  if (isLocalAssetUrl(url)) {
    await clearGalleryCloudinary(index)
    form.gallery[index].src = url
    form.gallery[index].srcPublicId = null
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

    await clearGalleryCloudinary(index)

    form.gallery[index].src = url
    form.gallery[index].srcPublicId = null

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

async function clearGalleryCloudinary(index: number) {
  const publicId = form.gallery[index]?.srcPublicId

  if (!publicId) return

  try {
    await deleteImage(publicId)
  } catch {}

  form.gallery[index].srcPublicId = null
}

async function removeGalleryImage(index: number) {
  try {
    await clearGalleryCloudinary(index)

    if (form.gallery[index]) {
      form.gallery[index].src = ''
      form.gallery[index].srcPublicId = null
      mediaUrlDraft[`gallery.${index}`] = ''
    }

    savedNote.value = 'Gambar dihapus dari form.'
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

/* ===== PDF Helpers ===== */
function embedPdfUrl(url: string) {
  const raw = String(url || '').trim()

  if (!raw) return ''

  const driveMatch = raw.match(/drive\.google\.com\/file\/d\/([^/]+)/)
  if (driveMatch?.[1]) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`
  }

  return raw
}

function validateBrochurePdf(index: number) {
  const item = form.brochures[index]

  if (!item) return

  const url = String(item.pdfUrl || '').trim()

  if (!url) {
    showErrorModal('Link PDF kosong', 'Masukkan link PDF terlebih dahulu.')
    return
  }

  if (!isHttpUrl(url) && !isLocalAssetUrl(url)) {
    showErrorModal('Link PDF tidak valid', 'Link PDF harus diawali http://, https://, atau path lokal /...')
    return
  }

  savedNote.value = 'Link PDF terlihat valid.'
  setTimeout(() => {
    savedNote.value = ''
  }, 1500)
}

function validateAllBrochureLinks() {
  for (const item of form.brochures) {
    const url = String(item.pdfUrl || '').trim()

    if (!url) continue

    if (!isHttpUrl(url) && !isLocalAssetUrl(url)) {
      throw new Error(`Link PDF tidak valid: ${url}`)
    }
  }
}

/* ===== Icon Picker ===== */
type Target = {
  kind: 'stat' | 'gallery'
  index: number
}

const iconModal = reactive({
  show: false,
  tabs: ['Local', 'Online'] as const,
  activeTab: 'Local' as 'Local' | 'Online',
  query: '',
  visible: [] as string[],
  allowOnline: true,
  loading: false,
  total: 0,
  limit: 72,
  start: 0,
  controller: null as AbortController | null,
  target: null as Target | null,
  localAll: [
    'ph:house',
    'ph:chalkboard-teacher',
    'ph:books',
    'ph:soccer-ball',
    'ph:mosque',
    'ph:users-three',
    'ph:handshake',
    'ph:gear-six',
    'ph:leaf',
    'ph:lightbulb',
    'lucide:home',
    'lucide:image',
    'lucide:book',
    'mdi:school-outline',
    'mdi:book-open-variant',
    'tabler:book-2',
    'tabler:leaf',
    'material-symbols:school-outline',
    'ic:baseline-emoji-people'
  ] as string[]
})

function openIconPicker(target: Target) {
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

  if (iconModal.target.kind === 'stat' && form.stats[iconModal.target.index]) {
    form.stats[iconModal.target.index].icon = name
  }

  if (iconModal.target.kind === 'gallery' && form.gallery[iconModal.target.index]) {
    form.gallery[iconModal.target.index].icon = name
  }

  closeIconPicker()
}

function setIconTab(tab: 'Local' | 'Online') {
  iconModal.activeTab = tab

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

function onIconSearchInput() {
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

<style scoped>
.facility-tiptap :deep(.ProseMirror) {
  min-height: 180px;
  outline: none;
}

.facility-tiptap :deep(.ProseMirror p) {
  margin: 0.35rem 0;
}

.facility-tiptap :deep(.ProseMirror ul),
.facility-tiptap :deep(.ProseMirror ol) {
  padding-left: 1.25rem;
}
</style>