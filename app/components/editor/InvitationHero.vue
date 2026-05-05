<template>
  <section class="relative overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
    <!-- Header -->
    <div class="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-green-50 via-white to-lime-50 px-5 py-5 dark:border-neutral-800 dark:from-green-950/20 dark:via-neutral-900 dark:to-neutral-900 md:px-6">
      <div class="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-green-300/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-20 left-8 h-40 w-40 rounded-full bg-lime-300/20 blur-3xl"></div>

      <div class="relative z-10">
        <div class="inline-flex items-center gap-2 rounded-full border border-green-100 bg-white/80 px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm backdrop-blur dark:border-green-900/40 dark:bg-neutral-900/70 dark:text-green-300">
          <span class="h-2 w-2 rounded-full bg-green-500"></span>
          Ajakan Mondok Editor
        </div>

        <h2 class="mt-4 text-xl font-black tracking-tight text-gray-950 dark:text-white">
          Kelola Section Ajakan Mondok
        </h2>

        <p class="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
          Atur konten ajakan, tombol aksi, hadist, background, dan pattern. Upload file masuk Cloudinary, sedangkan link gambar langsung disimpan ke database setelah divalidasi.
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
          <div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white">
              Konten Utama
            </h3>
            <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
              Atur badge kecil, susunan judul, brand, dan subjudul section.
            </p>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Eyebrow / Badge Kecil
            </label>
            <input
              v-model.trim="form.eyebrow"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Ajakan Kebaikan"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Brand / Akhir Judul
            </label>
            <input
              v-model.trim="form.brand"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Ponpes Al-Inayah"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Judul Prefix
            </label>
            <input
              v-model.trim="form.titlePrefix"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Ayo"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Kata Highlight / Underline
            </label>
            <input
              v-model.trim="form.titleUnderline"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Mondok"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50 md:col-span-2">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Judul Sufiks
            </label>
            <input
              v-model.trim="form.titleSuffix"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="di"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50 md:col-span-2">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Subjudul
            </label>
            <textarea
              v-model.trim="form.subtitle"
              rows="5"
              class="block w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Subjudul section..."
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
              Atur tombol utama dan tombol sekunder.
            </p>
          </div>
        </div>

        <div class="grid gap-5 lg:grid-cols-2">
          <article class="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
              <h4 class="text-sm font-black text-gray-900 dark:text-white">
                CTA Utama
              </h4>
            </div>

            <div class="space-y-4 p-4">
              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Label
                </label>
                <input
                  v-model.trim="form.primaryCTA.label"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="Al-Inayah"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Href
                </label>
                <input
                  v-model.trim="form.primaryCTA.href"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="/profile"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Icon
                </label>
                <div class="flex gap-2">
                  <button
                    type="button"
                    class="flex h-12 min-w-0 flex-1 items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="openIconPicker('primary')"
                  >
                    <span class="inline-flex min-w-0 items-center gap-2">
                      <Icon :icon="form.primaryCTA.icon || 'ph:student'" class="h-5 w-5 shrink-0" />
                      <span class="truncate">{{ form.primaryCTA.icon || 'Pilih Icon' }}</span>
                    </span>
                    <Icon icon="lucide:chevron-down" class="h-4 w-4 shrink-0 text-gray-400" />
                  </button>

                  <button
                    type="button"
                    class="inline-flex h-12 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-xs font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="form.primaryCTA.icon = ''"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </article>

          <article class="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
              <h4 class="text-sm font-black text-gray-900 dark:text-white">
                CTA Sekunder
              </h4>
            </div>

            <div class="space-y-4 p-4">
              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Label
                </label>
                <input
                  v-model.trim="form.secondaryCTA.label"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="Pelajari lebih lanjut"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Href
                </label>
                <input
                  v-model.trim="form.secondaryCTA.href"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="/program"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Icon
                </label>
                <div class="flex gap-2">
                  <button
                    type="button"
                    class="flex h-12 min-w-0 flex-1 items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="openIconPicker('secondary')"
                  >
                    <span class="inline-flex min-w-0 items-center gap-2">
                      <Icon :icon="form.secondaryCTA.icon || 'ph:arrow-right'" class="h-5 w-5 shrink-0" />
                      <span class="truncate">{{ form.secondaryCTA.icon || 'Pilih Icon' }}</span>
                    </span>
                    <Icon icon="lucide:chevron-down" class="h-4 w-4 shrink-0 text-gray-400" />
                  </button>

                  <button
                    type="button"
                    class="inline-flex h-12 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-xs font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="form.secondaryCTA.icon = ''"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Hadist -->
      <div v-show="activeTab === 'Hadist'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white">
              Hadist / Quote Ilmu
            </h3>
            <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
              Atur teks Arab, terjemah, dan sumber hadist.
            </p>
          </div>
        </div>

        <div class="grid gap-4">
          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Teks Arab
            </label>
            <textarea
              v-model.trim="form.hadithArabic"
              rows="3"
              dir="rtl"
              class="block w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-right text-lg leading-9 outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            ></textarea>
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Terjemah
            </label>
            <textarea
              v-model.trim="form.hadithTranslation"
              rows="4"
              class="block w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            ></textarea>
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Sumber
            </label>
            <input
              v-model.trim="form.hadithSource"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="HR. Muslim"
            />
          </div>
        </div>
      </div>

      <!-- Media -->
      <div v-show="activeTab === 'Media'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Media Section
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Upload background atau pattern ke Cloudinary. Jika memakai URL, link langsung disimpan ke Firebase Realtime Database tanpa upload ulang.
              </p>
            </div>

            <div class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm ring-1 ring-green-100 dark:bg-neutral-900 dark:text-green-300 dark:ring-green-900/40">
              <span class="h-2 w-2 rounded-full bg-green-500"></span>
              JPG / PNG / WebP · Max 5 MB
            </div>
          </div>
        </div>

        <div class="grid gap-5 lg:grid-cols-2">
          <!-- Background -->
          <section class="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
              <h4 class="text-sm font-black text-gray-900 dark:text-white">
                Background
              </h4>
              <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                Gambar utama untuk latar section.
              </p>
            </div>

            <div class="p-4">
              <div class="relative overflow-hidden rounded-[24px] border border-gray-200 bg-gray-100 dark:border-neutral-800 dark:bg-neutral-800">
                <img
                  v-if="form.bg"
                  :src="form.bg"
                  class="h-56 w-full object-cover"
                  alt="Background"
                />

                <div v-else class="grid h-56 place-items-center text-center">
                  <div>
                    <Icon icon="lucide:image-plus" class="mx-auto h-8 w-8 text-gray-400" />
                    <p class="mt-2 text-xs font-semibold text-gray-500 dark:text-neutral-400">
                      Belum ada gambar
                    </p>
                  </div>
                </div>

                <div
                  v-if="progress.bg != null"
                  class="absolute inset-x-3 bottom-3 overflow-hidden rounded-full bg-white/70 p-1 backdrop-blur dark:bg-neutral-950/70"
                >
                  <div
                    class="h-2 rounded-full bg-green-500 transition-all"
                    :style="{ width: `${progress.bg}%` }"
                  ></div>
                </div>
              </div>

              <div class="mt-4 space-y-3">
                <div class="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                  <button
                    type="button"
                    class="rounded-xl px-3 py-2 text-xs font-bold transition"
                    :class="mediaMode.bg === 'upload'
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                      : 'text-gray-500 dark:text-neutral-300'"
                    @click="mediaMode.bg = 'upload'"
                  >
                    Upload
                  </button>

                  <button
                    type="button"
                    class="rounded-xl px-3 py-2 text-xs font-bold transition"
                    :class="mediaMode.bg === 'url'
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                      : 'text-gray-500 dark:text-neutral-300'"
                    @click="mediaMode.bg = 'url'"
                  >
                    URL
                  </button>
                </div>

                <div v-if="mediaMode.bg === 'upload'">
                  <input
                    id="invitation-bg-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    class="hidden"
                    @change="(event) => uploadImageField(event, 'bg')"
                  />

                  <label
                    for="invitation-bg-upload"
                    class="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-green-200 bg-green-50/70 px-4 py-3 text-xs font-bold text-green-700 transition hover:bg-green-100 dark:border-green-900/40 dark:bg-green-900/10 dark:text-green-300 dark:hover:bg-green-900/20"
                  >
                    <Icon icon="lucide:upload-cloud" class="h-4 w-4" />
                    Upload Background
                  </label>
                </div>

                <div v-else class="space-y-2">
                  <input
                    v-model.trim="mediaDraft.bg"
                    type="url"
                    placeholder="https://example.com/background.jpg"
                    class="h-11 w-full rounded-2xl border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  />

                  <button
                    type="button"
                    class="inline-flex h-10 items-center justify-center rounded-2xl bg-green-600 px-3 text-xs font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
                    :disabled="mediaBusy || !mediaDraft.bg"
                    @click="applyImageUrl('bg')"
                  >
                    Gunakan Link
                  </button>
                </div>

                <button
                  v-if="form.bg"
                  type="button"
                  class="inline-flex items-center justify-center gap-1 rounded-xl border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-900/10"
                  :disabled="mediaBusy"
                  @click="removeImageField('bg')"
                >
                  <Icon icon="lucide:trash-2" class="h-3.5 w-3.5" />
                  Hapus Background
                </button>
              </div>
            </div>
          </section>

          <!-- Pattern -->
          <section class="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
              <h4 class="text-sm font-black text-gray-900 dark:text-white">
                Pattern
              </h4>
              <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                Dekorasi pattern opsional.
              </p>
            </div>

            <div class="p-4">
              <div class="relative overflow-hidden rounded-[24px] border border-gray-200 bg-gray-100 dark:border-neutral-800 dark:bg-neutral-800">
                <img
                  v-if="form.pattern"
                  :src="form.pattern"
                  class="h-56 w-full object-cover"
                  alt="Pattern"
                />

                <div v-else class="grid h-56 place-items-center text-center">
                  <div>
                    <Icon icon="lucide:image-plus" class="mx-auto h-8 w-8 text-gray-400" />
                    <p class="mt-2 text-xs font-semibold text-gray-500 dark:text-neutral-400">
                      Belum ada pattern
                    </p>
                  </div>
                </div>

                <div
                  v-if="progress.pattern != null"
                  class="absolute inset-x-3 bottom-3 overflow-hidden rounded-full bg-white/70 p-1 backdrop-blur dark:bg-neutral-950/70"
                >
                  <div
                    class="h-2 rounded-full bg-green-500 transition-all"
                    :style="{ width: `${progress.pattern}%` }"
                  ></div>
                </div>
              </div>

              <div class="mt-4 space-y-3">
                <div class="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                  <button
                    type="button"
                    class="rounded-xl px-3 py-2 text-xs font-bold transition"
                    :class="mediaMode.pattern === 'upload'
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                      : 'text-gray-500 dark:text-neutral-300'"
                    @click="mediaMode.pattern = 'upload'"
                  >
                    Upload
                  </button>

                  <button
                    type="button"
                    class="rounded-xl px-3 py-2 text-xs font-bold transition"
                    :class="mediaMode.pattern === 'url'
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                      : 'text-gray-500 dark:text-neutral-300'"
                    @click="mediaMode.pattern = 'url'"
                  >
                    URL
                  </button>
                </div>

                <div v-if="mediaMode.pattern === 'upload'">
                  <input
                    id="invitation-pattern-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    class="hidden"
                    @change="(event) => uploadImageField(event, 'pattern')"
                  />

                  <label
                    for="invitation-pattern-upload"
                    class="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-green-200 bg-green-50/70 px-4 py-3 text-xs font-bold text-green-700 transition hover:bg-green-100 dark:border-green-900/40 dark:bg-green-900/10 dark:text-green-300 dark:hover:bg-green-900/20"
                  >
                    <Icon icon="lucide:upload-cloud" class="h-4 w-4" />
                    Upload Pattern
                  </label>
                </div>

                <div v-else class="space-y-2">
                  <input
                    v-model.trim="mediaDraft.pattern"
                    type="url"
                    placeholder="https://example.com/pattern.png"
                    class="h-11 w-full rounded-2xl border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  />

                  <button
                    type="button"
                    class="inline-flex h-10 items-center justify-center rounded-2xl bg-green-600 px-3 text-xs font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
                    :disabled="mediaBusy || !mediaDraft.pattern"
                    @click="applyImageUrl('pattern')"
                  >
                    Gunakan Link
                  </button>
                </div>

                <button
                  v-if="form.pattern"
                  type="button"
                  class="inline-flex items-center justify-center gap-1 rounded-xl border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-900/10"
                  :disabled="mediaBusy"
                  @click="removeImageField('pattern')"
                >
                  <Icon icon="lucide:trash-2" class="h-3.5 w-3.5" />
                  Hapus Pattern
                </button>
              </div>
            </div>
          </section>
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
                Select Icon
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                Pilih icon untuk tombol CTA.
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
                  placeholder="Search icon, mis. student, book, arrow"
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

type MediaKey = 'bg' | 'pattern'

type EditorShape = {
  eyebrow: string
  titlePrefix: string
  titleUnderline: string
  titleSuffix: string
  brand: string
  subtitle: string
  primaryCTA: CTA
  secondaryCTA: CTA
  bg: string
  bgPublicId?: string | null
  pattern: string
  patternPublicId?: string | null
  hadithArabic: string
  hadithTranslation: string
  hadithSource: string
}

const props = defineProps<{
  section: {
    id: string
    key: string
    props?: Partial<EditorShape>
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
  { key: 'Hadist', label: 'Hadist', icon: 'lucide:quote' },
  { key: 'Media', label: 'Media', icon: 'lucide:image' }
] as const

type TabKey = typeof tabs[number]['key']

const activeTab = ref<TabKey>('Konten')

const defaults: EditorShape = {
  eyebrow: 'Ajakan Kebaikan',
  titlePrefix: 'Ayo',
  titleUnderline: 'Mondok',
  titleSuffix: 'di',
  brand: 'Ponpes Al-Inayah',
  subtitle:
    'Lingkungan yang menumbuhkan adab, ilmu, dan kemandirian. Kurikulum diniyah & formal terpadu, pembinaan tahfidz, serta program kepemimpinan dan pengabdian.',
  primaryCTA: {
    label: 'Al-Inayah',
    href: '/profile',
    icon: 'ph:student'
  },
  secondaryCTA: {
    label: 'Pelajari lebih lanjut',
    href: '/program',
    icon: 'ph:arrow-right'
  },
  bg: '/assets/images/profile.png',
  bgPublicId: null,
  pattern: '/assets/pattern.png',
  patternPublicId: null,
  hadithArabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
  hadithTranslation: '“Barangsiapa menempuh jalan untuk mencari ilmu, Allah akan mudahkan baginya jalan menuju Surga.”',
  hadithSource: 'HR. Muslim'
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

function merge(base: EditorShape, patch: Partial<EditorShape> = {}): EditorShape {
  return {
    eyebrow: patch.eyebrow ?? base.eyebrow,
    titlePrefix: patch.titlePrefix ?? base.titlePrefix,
    titleUnderline: patch.titleUnderline ?? base.titleUnderline,
    titleSuffix: patch.titleSuffix ?? base.titleSuffix,
    brand: patch.brand ?? base.brand,
    subtitle: patch.subtitle ?? base.subtitle,
    primaryCTA: {
      ...base.primaryCTA,
      ...(patch.primaryCTA || {})
    },
    secondaryCTA: {
      ...base.secondaryCTA,
      ...(patch.secondaryCTA || {})
    },
    bg: patch.bg ?? base.bg,
    bgPublicId: patch.bgPublicId ?? base.bgPublicId ?? null,
    pattern: patch.pattern ?? base.pattern,
    patternPublicId: patch.patternPublicId ?? base.patternPublicId ?? null,
    hadithArabic: patch.hadithArabic ?? base.hadithArabic,
    hadithTranslation: patch.hadithTranslation ?? base.hadithTranslation,
    hadithSource: patch.hadithSource ?? base.hadithSource
  }
}

const form = reactive<EditorShape>(merge(defaults, props.section?.props || {}))

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

const progress = reactive<Record<MediaKey, number | undefined>>({
  bg: undefined,
  pattern: undefined
})

const mediaMode = reactive<Record<MediaKey, 'upload' | 'url'>>({
  bg: 'upload',
  pattern: 'upload'
})

const mediaDraft = reactive<Record<MediaKey, string>>({
  bg: form.bg || '',
  pattern: form.pattern || ''
})

function syncMediaDrafts() {
  mediaDraft.bg = form.bg || ''
  mediaDraft.pattern = form.pattern || ''
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
  const publicIds = [form.bgPublicId, form.patternPublicId].filter(Boolean) as string[]

  try {
    await Promise.all(publicIds.map((id) => deleteImage(id)))
  } catch {}

  Object.assign(form, clone(defaults))
  syncMediaDrafts()
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

function getPublicId(key: MediaKey) {
  return key === 'bg'
    ? form.bgPublicId || null
    : form.patternPublicId || null
}

function setMediaValue(key: MediaKey, url: string, publicId?: string | null) {
  if (key === 'bg') {
    form.bg = url
    form.bgPublicId = publicId || null
    mediaDraft.bg = url
    return
  }

  form.pattern = url
  form.patternPublicId = publicId || null
  mediaDraft.pattern = url
}

async function clearCloudinaryMedia(key: MediaKey) {
  const publicId = getPublicId(key)

  if (!publicId) return

  try {
    await deleteImage(publicId)
  } catch {}

  if (key === 'bg') {
    form.bgPublicId = null
  } else {
    form.patternPublicId = null
  }
}

async function uploadImageField(event: Event, key: MediaKey) {
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
      folder: 'obayan-web/invitation',
      maxWidth: key === 'bg' ? 1920 : 1200,
      maxHeight: key === 'bg' ? 1080 : 1200,
      quality: 0.84
    })

    setMediaValue(key, result.secure_url, result.public_id)

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

async function applyImageUrl(key: MediaKey) {
  const url = String(mediaDraft[key] || '').trim()

  if (!url) {
    showErrorModal('URL kosong', 'Masukkan link gambar terlebih dahulu.')
    return
  }

  if (isLocalAssetUrl(url)) {
    await clearCloudinaryMedia(key)
    setMediaValue(key, url, null)

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

    await clearCloudinaryMedia(key)
    setMediaValue(key, url, null)

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

async function removeImageField(key: MediaKey) {
  try {
    await clearCloudinaryMedia(key)
    setMediaValue(key, '', null)

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
type IconTab = 'Local' | 'Online'
type IconTarget = 'primary' | 'secondary'

const iconModal = reactive({
  show: false,
  target: 'primary' as IconTarget,
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
    'ph:student',
    'ph:book-open-text',
    'ph:house',
    'ph:gear',
    'ph:arrow-right',
    'ph:printer',
    'ph:bell',
    'ph:calendar',
    'ph:check-circle',
    'lucide:home',
    'lucide:settings',
    'lucide:school',
    'lucide:bell',
    'lucide:calendar',
    'lucide:arrow-right',
    'lucide:printer',
    'mdi:home',
    'mdi:cog',
    'mdi:school',
    'mdi:bell',
    'mdi:calendar',
    'mdi:arrow-right',
    'mdi:printer'
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
  if (iconModal.target === 'primary') {
    form.primaryCTA.icon = name
  } else {
    form.secondaryCTA.icon = name
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