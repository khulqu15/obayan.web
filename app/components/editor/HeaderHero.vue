<!-- /components/editor/HeaderHero.vue -->

<template>
  <section class="relative overflow-hidden rounded-4xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
    <!-- Header -->
    <div class="relative overflow-hidden border-b border-gray-200 bg-linear-to-br from-green-50 via-white to-lime-50 px-5 py-5 dark:border-neutral-800 dark:from-green-950/20 dark:via-neutral-900 dark:to-neutral-900 md:px-6">
      <div class="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-green-300/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-20 left-8 h-40 w-40 rounded-full bg-lime-300/20 blur-3xl"></div>

      <div class="relative z-10 flex flex-col gap-5">
        <div class="min-w-0">
          <div class="inline-flex items-center gap-2 rounded-full border border-green-100 bg-white/80 px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm backdrop-blur dark:border-green-900/40 dark:bg-neutral-900/70 dark:text-green-300">
            <span class="h-2 w-2 rounded-full bg-green-500"></span>
            Hero Section Editor
          </div>
        </div>
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
        <div class="grid gap-4 md:grid-cols-2">
          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Brand
            </label>
            <input
              v-model.trim="form.brand"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Al-Berr"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Tagline
            </label>
            <input
              v-model.trim="form.tagline"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Pondok Pesantren Inovatif"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50 md:col-span-2">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Judul Utama
            </label>
            <input
              v-model.trim="form.titleMain"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Pesantren Pencetak Insan"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Judul Highlight
            </label>
            <input
              v-model.trim="form.titleHighlight"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Berakhlaqul Karimah"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              WhatsApp Admin
            </label>
            <input
              v-model.trim="form.waIntl"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="62xxxxxxxxxxx"
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
              placeholder="Deskripsi singkat hero..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Media -->
      <div v-show="activeTab === 'Media'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-linear-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Media Hero
              </h3>
            </div>

            <div class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm ring-1 ring-green-100 dark:bg-neutral-900 dark:text-green-300 dark:ring-green-900/40">
              <span class="h-2 w-2 rounded-full bg-green-500"></span>
              JPG / PNG / WebP · Max 5 MB
            </div>
          </div>
        </div>

        <!-- Background -->
        <section class="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="border-b border-gray-200 px-5 py-4 dark:border-neutral-800">
            <div class="flex items-center justify-between gap-3">
              <div>
                <h4 class="text-sm font-black text-gray-900 dark:text-white">Background Image</h4>
                <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                  Disarankan landscape 16:9. Upload akan diresize maksimal 1920×1080.
                </p>
              </div>

              <button
                v-if="form.bgImage"
                type="button"
                class="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
                :disabled="mediaBusy"
                @click="removeImage('bgImage')"
              >
                <Icon icon="lucide:trash-2" class="h-4 w-4" />
                Hapus
              </button>
            </div>
          </div>

          <div class="grid gap-5 p-5 lg:grid-cols-[1fr,1.1fr]">
            <div class="relative overflow-hidden rounded-[24px] border border-gray-200 bg-gray-100 dark:border-neutral-800 dark:bg-neutral-800">
              <img
                v-if="form.bgImage"
                :src="form.bgImage"
                alt="Background preview"
                class="h-64 w-full object-cover"
              />
              <div v-else class="grid h-64 place-items-center text-center">
                <div>
                  <Icon icon="lucide:image-plus" class="mx-auto h-9 w-9 text-gray-400" />
                  <p class="mt-2 text-sm font-semibold text-gray-500 dark:text-neutral-400">
                    Belum ada background
                  </p>
                </div>
              </div>

              <div
                v-if="progress['bgImage'] != null"
                class="absolute inset-x-4 bottom-4 overflow-hidden rounded-full bg-white/70 p-1 backdrop-blur dark:bg-neutral-950/70"
              >
                <div
                  class="h-2 rounded-full bg-green-500 transition-all"
                  :style="{ width: `${progress['bgImage']}%` }"
                ></div>
              </div>
            </div>

            <div class="space-y-4">
              <div class="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                <button
                  type="button"
                  class="rounded-xl px-3 py-2 text-xs font-bold transition"
                  :class="mediaMode.bgImage === 'upload'
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                    : 'text-gray-500 dark:text-neutral-300'"
                  @click="mediaMode.bgImage = 'upload'"
                >
                  Upload
                </button>
                <button
                  type="button"
                  class="rounded-xl px-3 py-2 text-xs font-bold transition"
                  :class="mediaMode.bgImage === 'url'
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                    : 'text-gray-500 dark:text-neutral-300'"
                  @click="mediaMode.bgImage = 'url'"
                >
                  URL
                </button>
              </div>

              <div v-if="mediaMode.bgImage === 'upload'" class="rounded-[24px] border border-dashed border-green-200 bg-green-50/60 p-5 dark:border-green-900/40 dark:bg-green-900/10">
                <input
                  id="bg-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  class="hidden"
                  @change="(e) => uploadCloudinaryImage(e, 'bgImage')"
                />

                <label
                  for="bg-upload"
                  class="flex cursor-pointer flex-col items-center justify-center rounded-[22px] bg-white px-5 py-8 text-center ring-1 ring-green-100 transition hover:bg-green-50 dark:bg-neutral-900 dark:ring-green-900/40 dark:hover:bg-neutral-800"
                >
                  <Icon icon="lucide:upload-cloud" class="h-9 w-9 text-green-600 dark:text-green-300" />
                  <span class="mt-3 text-sm font-black text-gray-900 dark:text-white">
                    Upload Background
                  </span>
                  <span class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                    JPG, PNG, WebP · otomatis resize dan jadi WebP
                  </span>
                </label>
              </div>

              <div v-else class="space-y-3">
                <input
                  v-model.trim="mediaUrlDraft.bgImage"
                  type="url"
                  placeholder="https://example.com/background.jpg"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                />

                <button
                  type="button"
                  class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
                  :disabled="mediaBusy || !mediaUrlDraft.bgImage"
                  @click="applyImageUrl('bgImage')"
                >
                  <Icon icon="lucide:shield-check" class="h-4 w-4" />
                  Gunakan Link
                </button>
              </div>

              <p class="text-xs leading-5 text-gray-500 dark:text-neutral-400">
                Public ID:
                <code class="rounded bg-gray-100 px-1.5 py-0.5 dark:bg-neutral-800">
                  {{ form.bgImagePublicId || '—' }}
                </code>
              </p>
            </div>
          </div>
        </section>

        <!-- Photos -->
        <section class="grid gap-4 lg:grid-cols-3">
          <article
            v-for="idx in 3"
            :key="'photo-card-' + idx"
            class="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <h4 class="text-sm font-black text-gray-900 dark:text-white">
                    Photo {{ idx }}
                  </h4>
                  <p class="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                    Maks. 1200×1200 WebP
                  </p>
                </div>

                <button
                  v-if="form.photos[idx - 1]"
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-700 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
                  :disabled="mediaBusy"
                  @click="removeImage(`photos.${idx - 1}`)"
                >
                  <Icon icon="lucide:trash-2" class="h-4 w-4" />
                </button>
              </div>
            </div>

            <div class="p-4">
              <div class="relative overflow-hidden rounded-[22px] border border-gray-200 bg-gray-100 dark:border-neutral-800 dark:bg-neutral-800">
                <img
                  v-if="form.photos[idx - 1]"
                  :src="form.photos[idx - 1]"
                  :alt="'Photo ' + idx"
                  class="h-44 w-full object-cover"
                />
                <div v-else class="grid h-44 place-items-center text-center">
                  <div>
                    <Icon icon="lucide:image-plus" class="mx-auto h-8 w-8 text-gray-400" />
                    <p class="mt-2 text-xs font-semibold text-gray-500 dark:text-neutral-400">
                      Belum ada foto
                    </p>
                  </div>
                </div>

                <div
                  v-if="progress[`photos.${idx - 1}`] != null"
                  class="absolute inset-x-3 bottom-3 overflow-hidden rounded-full bg-white/70 p-1 backdrop-blur dark:bg-neutral-950/70"
                >
                  <div
                    class="h-2 rounded-full bg-green-500 transition-all"
                    :style="{ width: `${progress[`photos.${idx - 1}`]}%` }"
                  ></div>
                </div>
              </div>

              <div class="mt-4 inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                <button
                  type="button"
                  class="rounded-xl px-3 py-2 text-xs font-bold transition"
                  :class="mediaMode[`photos.${idx - 1}`] === 'upload'
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                    : 'text-gray-500 dark:text-neutral-300'"
                  @click="mediaMode[`photos.${idx - 1}`] = 'upload'"
                >
                  Upload
                </button>
                <button
                  type="button"
                  class="rounded-xl px-3 py-2 text-xs font-bold transition"
                  :class="mediaMode[`photos.${idx - 1}`] === 'url'
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                    : 'text-gray-500 dark:text-neutral-300'"
                  @click="mediaMode[`photos.${idx - 1}`] = 'url'"
                >
                  URL
                </button>
              </div>

              <div v-if="mediaMode[`photos.${idx - 1}`] === 'upload'" class="mt-3">
                <input
                  :id="`photo-upload-${idx}`"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  class="hidden"
                  @change="(e) => uploadCloudinaryImage(e, `photos.${idx - 1}`)"
                />

                <label
                  :for="`photo-upload-${idx}`"
                  class="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-green-200 bg-green-50/70 px-4 py-3 text-sm font-bold text-green-700 transition hover:bg-green-100 dark:border-green-900/40 dark:bg-green-900/10 dark:text-green-300 dark:hover:bg-green-900/20"
                >
                  <Icon icon="lucide:upload-cloud" class="h-4 w-4" />
                  Upload Photo
                </label>
              </div>

              <div v-else class="mt-3 space-y-2">
                <input
                  v-model.trim="mediaUrlDraft[`photos.${idx - 1}`]"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  class="block h-11 w-full rounded-2xl border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                />

                <button
                  type="button"
                  class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-green-600 px-3 text-xs font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
                  :disabled="mediaBusy || !mediaUrlDraft[`photos.${idx - 1}`]"
                  @click="applyImageUrl(`photos.${idx - 1}`)"
                >
                  <Icon icon="lucide:shield-check" class="h-4 w-4" />
                  Gunakan Link
                </button>
              </div>

              <p class="mt-3 text-[11px] leading-5 text-gray-500 dark:text-neutral-400">
                Public ID:
                <code class="rounded bg-gray-100 px-1.5 py-0.5 dark:bg-neutral-800">
                  {{ form.photoPublicIds?.[idx - 1] || '—' }}
                </code>
              </p>
            </div>
          </article>
        </section>
      </div>

      <!-- CTA -->
      <div v-show="activeTab === 'CTA'" class="grid gap-4 md:grid-cols-2">
        <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
          <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
            CTA Primary Label
          </label>
          <input v-model.trim="form.ctaPrimary.label" class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
        </div>

        <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
          <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
            CTA Primary Href
          </label>
          <input v-model.trim="form.ctaPrimary.href" class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
        </div>

        <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
          <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
            CTA Secondary Label
          </label>
          <input v-model.trim="form.ctaSecondary.label" class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
        </div>

        <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
          <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
            CTA Secondary Href
          </label>
          <input v-model.trim="form.ctaSecondary.href" class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
        </div>
      </div>

      <!-- Stats -->
      <div v-show="activeTab === 'Stats'" class="space-y-4 grid grid-cols-2 gap-4">
        <div
          v-for="(st, si) in form.stats"
          :key="'st' + si"
          class="grid gap-4 rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50 md:grid-cols-[1fr,1fr,auto]"
        >
          <div>
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Label</label>
            <input v-model.trim="st.label" class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
          </div>

          <div>
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Value</label>
            <input v-model.trim="st.value" class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
          </div>

          <div class="flex items-end">
            <button
              type="button"
              class="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-rose-200 bg-white px-4 text-sm font-bold text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10 md:w-12"
              @click="form.stats.splice(si, 1)"
            >
              <Icon icon="lucide:trash-2" class="h-4 w-4" />
            </button>
          </div>
        </div>

        <button
          type="button"
          class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          @click="form.stats.push({ label: 'Label', value: '0' })"
        >
          <Icon icon="lucide:plus" class="h-4 w-4" />
          Tambah Stat
        </button>
      </div>

      <!-- Quick Info -->
      <div v-show="activeTab === 'Quick Info'" class="space-y-4 grid grid-cols-2 gap-4">
        <div
          v-for="(q, qi) in form.quicks"
          :key="'q' + qi"
          class="grid gap-4 rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50 md:grid-cols-[1fr,1fr,1fr,auto]"
        >
          <div>
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Label</label>
            <input v-model.trim="q.label" class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
          </div>

          <div>
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Value</label>
            <input v-model.trim="q.value" class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
          </div>

          <div>
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Icon</label>
            <button
              type="button"
              class="flex h-12 w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              @click="openIconPickerQuick(qi)"
            >
              <span class="inline-flex min-w-0 items-center gap-2">
                <Icon v-if="q.icon" :icon="q.icon" class="h-5 w-5 shrink-0" />
                <span class="truncate">{{ q.icon || 'Pilih Icon' }}</span>
              </span>
              <Icon icon="lucide:chevron-down" class="h-4 w-4 shrink-0 text-gray-400" />
            </button>
          </div>

          <div class="flex items-end">
            <button
              type="button"
              class="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-rose-200 bg-white px-4 text-sm font-bold text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10 md:w-12"
              @click="form.quicks.splice(qi, 1)"
            >
              <Icon icon="lucide:trash-2" class="h-4 w-4" />
            </button>
          </div>
        </div>

        <button
          type="button"
          class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          @click="form.quicks.push({ label: 'Info', value: '-', icon: 'ph:info' })"
        >
          <Icon icon="lucide:plus" class="h-4 w-4" />
          Tambah Info
        </button>
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
              <h3 class="text-lg font-black text-gray-900 dark:text-white">Select Icon</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Pilih icon untuk quick info.</p>
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
                  v-for="t in iconModal.tabs"
                  :key="t"
                  type="button"
                  class="rounded-xl px-4 py-2 text-xs font-bold transition"
                  :class="iconModal.activeTab === t
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                    : 'text-gray-500 dark:text-neutral-300'"
                  @click="setTab(t)"
                >
                  {{ t }}
                </button>
              </div>

              <div class="flex flex-1 gap-2 md:max-w-xl">
                <input
                  v-model.trim="iconModal.query"
                  type="text"
                  placeholder="Search icon, mis. calendar, phone, info"
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
import { computed, reactive, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useWeb } from '~/composables/data/useWeb'
import { useCloudinaryUpload } from '~/composables/useCloudinaryUpload'

type Stat = {
  label: string
  value: string
}

type Quick = {
  label: string
  value: string
  icon: string
}

type CTA = {
  label: string
  href: string
}

type Shape = {
  brand: string
  bgImage: string
  bgImagePublicId?: string | null
  titleMain: string
  titleHighlight: string
  tagline: string
  subtitle: string
  photos: string[]
  photoPublicIds?: Array<string | null>
  waIntl: string
  ctaPrimary: CTA
  ctaSecondary: CTA
  stats: Stat[]
  quicks: Quick[]
}

const props = defineProps<{
  section: {
    id: string
    key: string
    props?: Partial<Shape>
  }
}>()

const tabs = [
  { key: 'Konten', label: 'Konten', icon: 'lucide:type' },
  { key: 'Media', label: 'Media', icon: 'lucide:image' },
  { key: 'CTA', label: 'CTA', icon: 'lucide:mouse-pointer-click' },
  { key: 'Stats', label: 'Stats', icon: 'lucide:bar-chart-3' },
  { key: 'Quick Info', label: 'Quick Info', icon: 'lucide:info' }
] as const

type TabKey = typeof tabs[number]['key']

const activeTab = ref<TabKey>('Konten')

const defaults: Shape = {
  brand: 'Al-Berr',
  bgImage: '/assets/images/masjid.jpg',
  bgImagePublicId: null,
  titleMain: 'Pesantren Pencetak Insan ',
  titleHighlight: 'Berakhlaqul Karimah',
  tagline: 'Pondok Pesantren Inovatif',
  subtitle:
    'Pondok Pesantren Al-Berr hadir sebagai pusat pendidikan akhlaq mulia dan ilmu pengetahuan, mengintegrasikan agama-umum, salaf-modern, metode Amtsilati, pembelajaran aktif, fasilitas memadai, serta lingkungan bersih, indah, dan nyaman.',
  photos: ['/assets/images/activity.jpg', '/assets/images/activity1.jpg', '/assets/images/activity2.jpg'],
  photoPublicIds: [null, null, null],
  waIntl: '6285856376399',
  ctaPrimary: { label: 'Login Wali', href: '/waliLogin' },
  ctaSecondary: { label: 'Pelajari Program', href: '/program' },
  stats: [
    { label: 'Santri Putra', value: '1000+' },
    { label: 'Santri Putri', value: '50+' },
    { label: 'Pengajar', value: '50+' },
    { label: 'Prestasi', value: '50+' }
  ],
  quicks: [
    { label: 'PPDB Berakhir', value: '1 Oktober - Kuota Terpenuhi', icon: 'ph:calendar-check' },
    { label: 'Jenjang', value: 'SMP - SMA Al Berr', icon: 'ph:student' },
    { label: 'Admin', value: 'WA: 085856376399', icon: 'ph:phone' }
  ]
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

function ensure3(arr: unknown): string[] {
  const a = Array.isArray(arr) ? [...arr] : []

  while (a.length < 3) a.push('')

  return a.slice(0, 3).map((item) => String(item || ''))
}

function ensurePublicIds(arr: unknown): Array<string | null> {
  const a = Array.isArray(arr) ? [...arr] : []

  while (a.length < 3) a.push(null)

  return a.slice(0, 3).map((item) => {
    return item ? String(item) : null
  })
}

function merge(base: Shape, patch: Partial<Shape>): Shape {
  return {
    brand: patch.brand ?? base.brand,
    bgImage: patch.bgImage ?? base.bgImage,
    bgImagePublicId: patch.bgImagePublicId ?? base.bgImagePublicId ?? null,
    titleMain: patch.titleMain ?? base.titleMain,
    titleHighlight: patch.titleHighlight ?? base.titleHighlight,
    tagline: patch.tagline ?? base.tagline,
    subtitle: patch.subtitle ?? base.subtitle,
    photos: ensure3(patch.photos ?? base.photos),
    photoPublicIds: ensurePublicIds(patch.photoPublicIds ?? base.photoPublicIds),
    waIntl: patch.waIntl ?? base.waIntl,
    ctaPrimary: { ...base.ctaPrimary, ...(patch.ctaPrimary || {}) },
    ctaSecondary: { ...base.ctaSecondary, ...(patch.ctaSecondary || {}) },
    stats: Array.isArray(patch.stats) && patch.stats.length ? clone(patch.stats) : clone(base.stats),
    quicks: Array.isArray(patch.quicks) && patch.quicks.length ? clone(patch.quicks) : clone(base.quicks)
  }
}

const form = reactive<Shape>(merge(defaults, props.section?.props || {}))

const mediaUrlDraft = reactive<Record<string, string>>({
  bgImage: form.bgImage || '',
  'photos.0': form.photos[0] || '',
  'photos.1': form.photos[1] || '',
  'photos.2': form.photos[2] || ''
})

function syncMediaDrafts() {
  mediaUrlDraft.bgImage = form.bgImage || ''
  mediaUrlDraft['photos.0'] = form.photos[0] || ''
  mediaUrlDraft['photos.1'] = form.photos[1] || ''
  mediaUrlDraft['photos.2'] = form.photos[2] || ''
}

watch(
  () => [form.bgImage, ...form.photos],
  () => syncMediaDrafts()
)

watch(
  () => props.section?.props,
  (nextProps) => {
    Object.assign(form, merge(defaults, nextProps || {}))
  }
)

const { updateSection } = useWeb()

const {
  uploadImage,
  deleteImage,
  uploading,
  deleting,
  uploadError,
  deleteError
} = useCloudinaryUpload()

const mediaBusy = computed(() => uploading.value || deleting.value)
const saving = ref(false)
const savedNote = ref('')
const errNote = ref('')
const progress = reactive<Record<string, number>>({})

const mediaMode = reactive<Record<string, 'url' | 'upload'>>({
  bgImage: 'upload',
  'photos.0': 'upload',
  'photos.1': 'upload',
  'photos.2': 'upload'
})

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

const allowedImageTypes = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
])

const MAX_IMAGE_SIZE = 5 * 1024 * 1024

function isAllowedImage(file: File) {
  if (!allowedImageTypes.has(file.type)) {
    return 'Format gambar harus JPG, PNG, atau WebP. SVG/GIF tidak diperbolehkan untuk keamanan.'
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return 'Ukuran gambar maksimal 5 MB.'
  }

  return ''
}

function isHttpUrl(url: string) {
  return /^https?:\/\//i.test(url)
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

function getImageValue(fieldKey: string) {
  if (fieldKey === 'bgImage') return form.bgImage || ''

  const match = fieldKey.match(/^photos\.(\d)$/)
  if (match) return form.photos[Number(match[1])] || ''

  return ''
}

function getPublicId(fieldKey: string) {
  if (fieldKey === 'bgImage') return form.bgImagePublicId || null

  const match = fieldKey.match(/^photos\.(\d)$/)
  if (match) return form.photoPublicIds?.[Number(match[1])] || null

  return null
}

function setImageValue(fieldKey: string, url: string, publicId?: string | null) {
  if (fieldKey === 'bgImage') {
    form.bgImage = url
    form.bgImagePublicId = publicId || null
    return
  }

  const match = fieldKey.match(/^photos\.(\d)$/)
  if (match) {
    const index = Number(match[1])
    form.photos[index] = url

    if (!form.photoPublicIds) {
      form.photoPublicIds = [null, null, null]
    }

    form.photoPublicIds[index] = publicId || null
  }
}

function clearNoteSoon() {
  setTimeout(() => {
    savedNote.value = ''
  }, 1800)
}

async function uploadCloudinaryImage(event: Event, fieldKey: string) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  errNote.value = ''
  savedNote.value = ''

  const validationError = isAllowedImage(file)

  if (validationError) {
    errNote.value = validationError
    input.value = ''
    return
  }

  progress[fieldKey] = 5

  let timer: ReturnType<typeof window.setInterval> | null = null

  try {
    const oldPublicId = getPublicId(fieldKey)

    timer = window.setInterval(() => {
      if (progress[fieldKey] != null && progress[fieldKey] < 92) {
        progress[fieldKey] += 7
      }
    }, 180)

    const res = await uploadImage(file, {
      folder: 'obayan-web/hero',
      maxWidth: fieldKey === 'bgImage' ? 1920 : 1200,
      maxHeight: fieldKey === 'bgImage' ? 1080 : 1200,
      quality: 0.84
    })

    setImageValue(fieldKey, res.secure_url, res.public_id)

    if (oldPublicId && oldPublicId !== res.public_id) {
      await deleteImage(oldPublicId)
    }

    progress[fieldKey] = 100
    savedNote.value = 'Gambar berhasil diupload, diresize, dan dikonversi ke WebP.'
    clearNoteSoon()
  } catch (error: any) {
    errNote.value = uploadError.value || error?.message || 'Upload gambar gagal.'
  } finally {
    if (timer) window.clearInterval(timer)

    setTimeout(() => {
      delete progress[fieldKey]
    }, 900)

    input.value = ''
  }
}

async function applyImageUrl(fieldKey: string, opts?: { silent?: boolean }) {
  const url = String(mediaUrlDraft[fieldKey] || '').trim()

  if (!url) {
    showErrorModal('URL kosong', 'Masukkan link gambar terlebih dahulu.')
    return
  }

  if (isLocalAssetUrl(url)) {
    const oldPublicId = getPublicId(fieldKey)

    if (oldPublicId) {
      try {
        await deleteImage(oldPublicId)
      } catch {}
    }

    setImageValue(fieldKey, url, null)

    if (!opts?.silent) {
      savedNote.value = 'Path lokal digunakan.'
      clearNoteSoon()
    }

    return
  }

  if (!isHttpUrl(url)) {
    showErrorModal(
      'URL tidak valid',
      'Link gambar harus diawali dengan http:// atau https://.'
    )
    return
  }

  try {
    await validateRemoteImageUrl(url)

    const oldPublicId = getPublicId(fieldKey)

    if (oldPublicId) {
      try {
        await deleteImage(oldPublicId)
      } catch {}
    }

    setImageValue(fieldKey, url, null)

    if (!opts?.silent) {
      savedNote.value = 'Link gambar berhasil digunakan. Klik Simpan untuk menyimpan ke Firebase.'
      clearNoteSoon()
    }
  } catch (error: any) {
    showErrorModal(
      'Gambar tidak bisa digunakan',
      error?.message || 'Link gambar invalid, tidak ditemukan, atau tidak bisa diakses.'
    )
  }
}

async function removeImage(fieldKey: string) {
  errNote.value = ''
  savedNote.value = ''

  const publicId = getPublicId(fieldKey)

  try {
    if (publicId) {
      await deleteImage(publicId)
    }

    setImageValue(fieldKey, '', null)

    savedNote.value = publicId
      ? 'Gambar berhasil dihapus dari Cloudinary.'
      : 'Gambar dihapus dari form.'

    clearNoteSoon()
  } catch (error: any) {
    errNote.value = deleteError.value || error?.message || 'Gagal menghapus gambar.'
  }
}

async function normalizeExternalImagesBeforeSave() {
  const keys = ['bgImage', 'photos.0', 'photos.1', 'photos.2']

  for (const key of keys) {
    const url = getImageValue(key)

    if (!url) continue
    if (isLocalAssetUrl(url)) continue
    if (getPublicId(key)) continue

    try {
      await validateRemoteImageUrl(url)
    } catch (error: any) {
      activeTab.value = 'Media'

      showErrorModal(
        'Gambar tidak valid',
        `Ada link gambar yang tidak bisa diakses: ${url}`
      )

      throw error
    }
  }
}

async function resetToDefault() {
  const ids = [
    form.bgImagePublicId,
    ...(form.photoPublicIds || [])
  ].filter(Boolean) as string[]

  try {
    await Promise.all(ids.map((id) => deleteImage(id)))
  } catch {}

  Object.assign(form, clone(defaults))
  activeTab.value = 'Konten'

  savedNote.value = 'Form dikembalikan ke default.'
  clearNoteSoon()
}

async function save() {
  try {
    saving.value = true
    errNote.value = ''

    await normalizeExternalImagesBeforeSave()

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

/* ===== Icon Picker ===== */
type TabName = 'Popular' | 'Online'

const iconModal = reactive({
  show: false,
  tabs: ['Popular', 'Online'] as TabName[],
  activeTab: 'Popular' as TabName,
  allowOnline: true,
  query: '',
  loading: false,
  limit: 72,
  start: 0,
  total: 0,
  visible: [] as string[],
  popular: [
    'ph:calendar-check',
    'ph:student',
    'ph:phone',
    'ph:info',
    'mdi:instagram',
    'mdi:youtube',
    'mdi:facebook',
    'mdi:twitter',
    'mdi:tiktok',
    'mdi:whatsapp',
    'mdi:telegram',
    'mdi:linkedin',
    'mdi:web',
    'mdi:email',
    'mdi:phone',
    'mdi:map-marker',
    'ph:instagram-logo',
    'ph:youtube-logo',
    'ph:facebook-logo',
    'ph:whatsapp-logo',
    'ph:telegram-logo',
    'ph:globe',
    'ph:envelope-simple',
    'ph:map-pin',
    'mdi:school',
    'mdi:google'
  ] as string[],
  target: {
    kind: 'quick' as 'quick',
    index: -1
  }
})

function setTab(tab: TabName) {
  iconModal.activeTab = tab

  if (tab === 'Popular') {
    iconModal.visible = iconModal.popular.slice()
  } else {
    iconModal.visible = []
  }
}

let iconSearchTimer: ReturnType<typeof setTimeout> | null = null

function onSearchInput() {
  iconModal.start = 0

  if (iconModal.activeTab !== 'Online') {
    iconModal.activeTab = 'Online'
  }

  if (iconSearchTimer) clearTimeout(iconSearchTimer)

  iconSearchTimer = setTimeout(() => searchOnline(), 400)
}

async function searchOnline(forced = false) {
  if (typeof window === 'undefined') return
  if (!iconModal.allowOnline) return

  const q = iconModal.query.trim()

  if (!q && !forced) return

  try {
    iconModal.loading = true

    const url = `https://api.iconify.design/search?query=${encodeURIComponent(q || 'logo')}&limit=${iconModal.limit}&start=${iconModal.start}`
    const res = await fetch(url)
    const json = await res.json().catch(() => ({}))
    const icons: string[] = Array.isArray(json?.icons) ? json.icons : []

    iconModal.visible = icons
    iconModal.total = Number(json?.total || icons.length || 0)
  } catch {
    iconModal.visible = []
    iconModal.total = 0
  } finally {
    iconModal.loading = false
  }
}

function prevPage() {
  if (iconModal.start === 0) return

  iconModal.start = Math.max(0, iconModal.start - iconModal.limit)
  searchOnline(true)
}

function nextPage() {
  if (iconModal.start + iconModal.limit >= iconModal.total) return

  iconModal.start = iconModal.start + iconModal.limit
  searchOnline(true)
}

function openIconPickerQuick(index: number) {
  iconModal.target = {
    kind: 'quick',
    index
  }

  iconModal.query = ''
  iconModal.start = 0
  iconModal.total = 0
  iconModal.activeTab = 'Popular'
  iconModal.visible = iconModal.popular.slice()
  iconModal.show = true
}

function closeIconPicker() {
  iconModal.show = false
  iconModal.target.index = -1
}

function chooseIcon(name: string) {
  if (iconModal.target.kind === 'quick' && iconModal.target.index >= 0) {
    form.quicks[iconModal.target.index].icon = name
  }

  closeIconPicker()
}
</script>