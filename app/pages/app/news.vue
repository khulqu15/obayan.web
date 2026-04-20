<template>
  <section class="p-4 md:p-6 space-y-6">
    <!-- Hero -->
    <div class="relative overflow-hidden rounded-[28px] border border-green-100 dark:border-neutral-800 bg-gradient-to-br from-green-600 via-emerald-600 to-lime-500 p-6 md:p-8 text-white shadow-[0_20px_60px_-20px_rgba(22,163,74,0.45)]">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute -top-14 -right-10 h-44 w-44 rounded-full bg-white blur-3xl"></div>
        <div class="absolute -bottom-16 left-8 h-40 w-40 rounded-full bg-lime-200 blur-3xl"></div>
      </div>

      <div class="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20 backdrop-blur">
            <span class="inline-block h-2 w-2 rounded-full bg-lime-300"></span>
            News Management
          </div>
          <h1 class="mt-4 text-2xl md:text-4xl font-extrabold tracking-tight">
            Kelola berita lebih rapi dan modern
          </h1>
          <p class="mt-3 max-w-xl text-sm md:text-base text-green-50/90">
            Flow create dan edit dibuat step-by-step agar lebih ringan, minim salah input, dan tetap nyaman dipakai.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div class="rounded-2xl bg-white/12 px-4 py-3 backdrop-blur ring-1 ring-white/15">
            <div class="text-xs text-green-100">Total Artikel</div>
            <div class="mt-1 text-2xl font-bold">{{ items.length }}</div>
          </div>
          <div class="rounded-2xl bg-white/12 px-4 py-3 backdrop-blur ring-1 ring-white/15">
            <div class="text-xs text-green-100">Bulan Ini</div>
            <div class="mt-1 text-2xl font-bold">{{ publishedThisMonth }}</div>
          </div>
          <div class="rounded-2xl bg-white/12 px-4 py-3 backdrop-blur ring-1 ring-white/15 col-span-2 sm:col-span-1">
            <div class="text-xs text-green-100">Kategori</div>
            <div class="mt-1 text-2xl font-bold">{{ categoriesCount }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="rounded-[24px] border border-gray-200/80 bg-white/85 p-4 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/85">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div class="relative w-full sm:max-w-md">
            <input
              v-model="search"
              type="text"
              placeholder="Cari judul, excerpt, atau tag..."
              class="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
            <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </span>
          </div>

          <div class="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
            <button
              type="button"
              @click="activeTab = 'articles'"
              :class="[
                'rounded-2xl px-4 py-2 text-sm font-semibold transition',
                activeTab === 'articles'
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                  : 'text-gray-500 hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white'
              ]"
            >
              Artikel
            </button>
            <button
              type="button"
              @click="activeTab = 'history'"
              :class="[
                'rounded-2xl px-4 py-2 text-sm font-semibold transition',
                activeTab === 'history'
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                  : 'text-gray-500 hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white'
              ]"
            >
              History
            </button>
          </div>
        </div>

        <button
          @click="openCreate"
          class="inline-flex h-11 items-center justify-center rounded-2xl bg-green-600 px-5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
        >
          + Tulis Artikel
        </button>
      </div>
    </div>

    <div
      v-if="error && activeTab === 'articles'"
      class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300"
    >
      {{ error }}
    </div>

    <!-- Articles -->
    <div v-if="activeTab === 'articles'" class="space-y-4">
      <div v-if="pending" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="i in 4"
          :key="i"
          class="h-80 animate-pulse rounded-[24px] border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
        ></div>
      </div>

      <div
        v-else-if="filtered.length === 0"
        class="rounded-[28px] border border-dashed border-gray-300 bg-white p-10 text-center dark:border-neutral-700 dark:bg-neutral-900"
      >
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300">
          📰
        </div>
        <h3 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">Belum ada berita yang cocok</h3>
        <p class="mt-2 text-sm text-gray-500 dark:text-neutral-400">Coba kata kunci lain atau buat artikel baru.</p>
        <button
          @click="openCreate"
          class="mt-5 inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
        >
          + Tulis Artikel
        </button>
      </div>

      <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <article
          v-for="n in paged"
          :key="n.id"
          class="group overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div class="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-neutral-800">
            <img
              v-if="n.cover"
              :src="n.cover"
              :alt="n.title"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            />
            <div v-else class="grid h-full place-items-center text-4xl">🖼️</div>

            <div class="absolute left-3 top-3">
              <span class="rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                {{ n.category || 'Umum' }}
              </span>
            </div>
          </div>

          <div class="space-y-3 p-4">
            <div class="flex items-center justify-between gap-3 text-[12px] text-gray-500 dark:text-neutral-400">
              <span>{{ formatDate(n.publishedAt) }}</span>
              <span>{{ n.readTime || 1 }} min baca</span>
            </div>

            <div>
              <h3 class="line-clamp-2 text-base font-bold text-gray-900 dark:text-white">
                {{ n.title }}
              </h3>
              <p class="mt-2 line-clamp-3 text-sm text-gray-600 dark:text-neutral-300">
                {{ n.excerpt || 'Tanpa ringkasan.' }}
              </p>
            </div>

            <div class="flex flex-wrap gap-1.5" v-if="n.tags?.length">
              <span
                v-for="t in n.tags.slice(0, 4)"
                :key="t"
                class="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700 dark:bg-green-900/20 dark:text-green-300"
              >
                #{{ t }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <img
                v-if="getAuthor(n)?.avatar"
                :src="getAuthor(n)?.avatar"
                alt="author"
                class="h-8 w-8 rounded-full border border-gray-200 object-cover dark:border-neutral-700"
              />
              <div
                v-else
                class="grid h-8 w-8 place-items-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                {{ initials(getAuthor(n)?.name || 'Admin') }}
              </div>

              <div class="min-w-0">
                <div class="truncate text-xs font-semibold text-gray-900 dark:text-white">
                  {{ getAuthor(n)?.name || 'Cak Admin' }}
                </div>
                <div class="truncate text-[11px] text-gray-500 dark:text-neutral-400">
                  {{ getAuthor(n)?.role || 'admin' }}
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <button
                @click="openEdit(n)"
                class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                Edit
              </button>

              <button
                @click="openDelete(n)"
                class="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
              >
                Hapus
              </button>

              <NuxtLink
                :to="`/news?slug=${encodeURIComponent(n.slug)}`"
                class="ml-auto inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                Lihat
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>

      <div v-if="hasMore && !pending" class="text-center">
        <button
          @click="page++"
          class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          Muat Lainnya
        </button>
      </div>
    </div>

    <!-- History -->
    <div v-show="activeTab === 'history'" class="space-y-4">
      <div class="rounded-[24px] border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <input
          v-model="searchHist"
          type="text"
          placeholder="Cari author, judul, kategori, slug..."
          class="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        />
      </div>

      <div class="overflow-auto rounded-[24px] border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <table class="min-w-[960px] w-full text-sm">
          <thead class="bg-gray-50 text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
            <tr>
              <th class="p-3 text-left">Waktu</th>
              <th class="p-3 text-left">Aksi</th>
              <th class="p-3 text-left">Judul</th>
              <th class="p-3 text-left">Kategori</th>
              <th class="p-3 text-left">Author</th>
              <th class="p-3 text-left">News ID / Slug</th>
              <th class="p-3 text-left">Tags</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="e in pagedHist"
              :key="e.id"
              class="border-t border-gray-100 dark:border-neutral-800"
            >
              <td class="p-3 whitespace-nowrap">{{ formatDateTime(e.at) }}</td>
              <td class="p-3">
                <span
                  :class="[
                    'rounded-full px-2.5 py-1 text-[12px] font-medium',
                    e.action === 'create'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                      : e.action === 'update'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
                  ]"
                >
                  {{ e.action }}
                </span>
              </td>
              <td class="p-3">{{ e.meta.title || '—' }}</td>
              <td class="p-3">{{ e.meta.category || '—' }}</td>
              <td class="p-3">
                <div class="leading-tight">
                  <div class="font-medium truncate">{{ e.author.name || '—' }}</div>
                  <div class="text-[12px] text-gray-500 dark:text-neutral-400 truncate">
                    {{ e.author.email || '—' }} • {{ e.author.role || '—' }}
                  </div>
                </div>
              </td>
              <td class="p-3">
                <div class="leading-tight">
                  <div class="truncate">{{ e.newsId || '—' }}</div>
                  <div class="text-[12px] text-gray-500 dark:text-neutral-400 truncate">{{ e.meta.slug || '—' }}</div>
                </div>
              </td>
              <td class="p-3">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="t in (e.meta.tags || [])"
                    :key="t"
                    class="rounded-full bg-gray-100 px-2 py-0.5 text-[12px] dark:bg-neutral-800"
                  >
                    #{{ t }}
                  </span>
                </div>
              </td>
            </tr>

            <tr v-if="pagedHist.length === 0">
              <td colspan="7" class="p-8 text-center text-gray-500 dark:text-neutral-400">
                Belum ada riwayat.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="hasMoreHist" class="text-center">
        <button
          @click="pageHist++"
          class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          Muat Riwayat Lainnya
        </button>
      </div>
    </div>

    <!-- Form Modal -->
    <ModalShell
      v-model="showForm"
      :title="formMode === 'create' ? 'Tulis Artikel Baru' : 'Edit Artikel'"
      size="fullscreen"
    >
      <div class="space-y-6">
        <!-- Step Header -->
        <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/60">
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">Wizard Publish</h3>
              <p class="text-sm text-gray-500 dark:text-neutral-400">Isi bertahap agar lebih ringan dan minim salah input.</p>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <div
                v-for="s in steps"
                :key="s.id"
                class="flex items-center gap-3"
              >
                <div
                  :class="[
                    'grid h-9 w-9 place-items-center rounded-full text-sm font-bold transition',
                    wizardStep >= s.id
                      ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                      : 'bg-white text-gray-400 ring-1 ring-gray-200 dark:bg-neutral-800 dark:text-neutral-500 dark:ring-neutral-700'
                  ]"
                >
                  {{ s.id }}
                </div>
                <div class="hidden sm:block">
                  <div class="text-sm font-semibold text-gray-900 dark:text-white">{{ s.title }}</div>
                  <div class="text-xs text-gray-500 dark:text-neutral-400">{{ s.desc }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form class="space-y-6" @submit.prevent="submit">
          <!-- Step 1 -->
          <div v-show="wizardStep === 1" class="rounded-[24px] border border-gray-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <h4 class="text-sm font-bold text-gray-900 dark:text-white">Informasi Utama</h4>

            <div class="mt-4 grid gap-4">
              <div>
                <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                  Judul
                </label>
                <input
                  v-model.trim="form.title"
                  class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  placeholder="Contoh: Santri Alyasini Raih Juara..."
                />
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                    Kategori
                  </label>
                  <input
                    v-model.trim="form.category"
                    class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    placeholder="Kegiatan / Prestasi / Pengumuman"
                  />
                </div>

                <div>
                  <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                    Tanggal Terbit
                  </label>
                  <input
                    v-model="publishedAtLocal"
                    type="datetime-local"
                    class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                  Tags
                </label>
                <input
                  v-model.trim="form.tagsInput"
                  class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  placeholder="santri, tahfidz, lomba"
                />
                <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">Pisahkan dengan koma.</p>
              </div>

              <div>
                <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                  Ringkasan
                </label>
                <textarea
                  v-model.trim="form.excerpt"
                  rows="4"
                  class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  placeholder="Ringkasan singkat yang muncul di kartu berita..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Step 2 -->
          <div v-show="wizardStep === 2" class="grid gap-6 lg:grid-cols-[1fr,0.95fr]">
            <div class="rounded-[24px] border border-gray-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <h4 class="text-sm font-bold text-gray-900 dark:text-white">Cover Gambar</h4>

              <div class="mt-4 inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                <button
                  type="button"
                  @click="coverMode = 'upload'"
                  :class="[
                    'rounded-2xl px-4 py-2 text-sm font-semibold transition',
                    coverMode === 'upload'
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                      : 'text-gray-500 dark:text-neutral-300'
                  ]"
                >
                  Upload
                </button>
                <button
                  type="button"
                  @click="coverMode = 'link'"
                  :class="[
                    'rounded-2xl px-4 py-2 text-sm font-semibold transition',
                    coverMode === 'link'
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                      : 'text-gray-500 dark:text-neutral-300'
                  ]"
                >
                  Link URL
                </button>
              </div>

              <div v-if="coverMode === 'upload'" class="mt-5 space-y-4">
                <label
                  class="flex cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-green-200 bg-green-50/60 px-6 py-10 text-center transition hover:border-green-400 hover:bg-green-50 dark:border-green-900/40 dark:bg-green-900/10"
                >
                  <input
                    ref="coverInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="onPickCover"
                  />
                  <div class="text-4xl">☁️</div>
                  <div class="mt-3 text-sm font-bold text-gray-900 dark:text-white">Klik untuk pilih gambar</div>
                  <div class="mt-1 text-xs text-gray-500 dark:text-neutral-400">PNG/JPG/WebP, maksimal 5 MB</div>
                </label>

                <div
                  v-if="coverFile"
                  class="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-800/60"
                >
                  <div class="font-semibold text-gray-900 dark:text-white">{{ coverFile.name }}</div>
                  <div class="mt-1 text-xs text-gray-500 dark:text-neutral-400">{{ formatBytes(coverFile.size) }}</div>
                </div>
              </div>

              <div v-else class="mt-5">
                <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                  Link Gambar
                </label>
                <input
                  v-model.trim="form.coverLink"
                  type="url"
                  class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  placeholder="https://..."
                />
                <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                  Gunakan URL gambar langsung.
                </p>
              </div>

              <div class="mt-5 flex gap-2">
                <button
                  type="button"
                  @click="clearCover"
                  class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  Reset Cover
                </button>
              </div>
            </div>

            <div class="rounded-[24px] border border-gray-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <h4 class="text-sm font-bold text-gray-900 dark:text-white">Preview Gambar</h4>

              <div class="mt-4 overflow-hidden rounded-[22px] border border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-800">
                <div class="aspect-[16/10]">
                  <img
                    v-if="resolvedCoverPreview"
                    :src="resolvedCoverPreview"
                    alt="Cover preview"
                    class="h-full w-full object-cover"
                  />
                  <div
                    v-else
                    class="grid h-full place-items-center text-center text-sm text-gray-400"
                  >
                    Belum ada gambar dipilih
                  </div>
                </div>
              </div>

              <div
                v-if="uploadError"
                class="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-300"
              >
                {{ uploadError }}
              </div>
            </div>
          </div>

          <!-- Step 3 -->
          <div v-show="wizardStep === 3" class="rounded-[24px] border border-gray-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-center justify-between gap-4">
              <h4 class="text-sm font-bold text-gray-900 dark:text-white">Konten Artikel</h4>
              <div class="text-xs text-gray-500 dark:text-neutral-400">Gunakan editor untuk isi berita.</div>
            </div>

            <div v-if="editor" class="mt-4 flex flex-wrap gap-2">
              <button
                class="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-green-500 hover:text-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                :class="isActive('paragraph')"
                @click.prevent="runEditor(() => editor.chain().focus().setParagraph().run())"
              >
                P
              </button>
              <button
                class="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-green-500 hover:text-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                :class="isActive('heading', { level: 2 })"
                @click.prevent="runEditor(() => editor.chain().focus().toggleHeading({ level: 2 }).run())"
              >
                H2
              </button>
              <button
                class="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-green-500 hover:text-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                :class="isActive('heading', { level: 3 })"
                @click.prevent="runEditor(() => editor.chain().focus().toggleHeading({ level: 3 }).run())"
              >
                H3
              </button>
              <button
                class="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-green-500 hover:text-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                :class="isActive('bold')"
                @click.prevent="runEditor(() => editor.chain().focus().toggleBold().run())"
              >
                <b>B</b>
              </button>
              <button
                class="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-green-500 hover:text-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                :class="isActive('italic')"
                @click.prevent="runEditor(() => editor.chain().focus().toggleItalic().run())"
              >
                <i>I</i>
              </button>
              <button
                class="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-green-500 hover:text-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                :class="isActive('bulletList')"
                @click.prevent="runEditor(() => editor.chain().focus().toggleBulletList().run())"
              >
                • List
              </button>
              <button
                class="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-green-500 hover:text-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                :class="isActive('orderedList')"
                @click.prevent="runEditor(() => editor.chain().focus().toggleOrderedList().run())"
              >
                1. List
              </button>
              <button
                class="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-green-500 hover:text-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                :class="isActive('blockquote')"
                @click.prevent="runEditor(() => editor.chain().focus().toggleBlockquote().run())"
              >
                Quote
              </button>
              <button
                class="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-green-500 hover:text-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                @click.prevent="runEditor(() => editor.chain().focus().undo().run())"
              >
                Undo
              </button>
              <button
                class="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-green-500 hover:text-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                @click.prevent="runEditor(() => editor.chain().focus().redo().run())"
              >
                Redo
              </button>
            </div>

            <ClientOnly>
              <div class="mt-4 rounded-[22px] border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                <EditorContent :editor="editor" class="prose max-w-none min-h-[320px] p-4 dark:prose-invert" />
              </div>
            </ClientOnly>

            <div v-if="formError" class="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-300">
              {{ formError }}
            </div>
          </div>
        </form>
      </div>

      <template #footer>
        <div class="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="text-xs text-gray-500 dark:text-neutral-400">
            {{ formMode === 'create' ? 'Mode publish baru' : 'Mode edit artikel' }}
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="showForm = false"
              class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Batal
            </button>

            <button
              v-if="wizardStep > 1"
              @click="wizardStep--"
              :disabled="isBusy"
              class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Kembali
            </button>

            <button
              v-if="wizardStep < 3"
              @click="nextStep"
              :disabled="isBusy"
              class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Lanjut
            </button>

            <button
              v-else
              @click="submit"
              :disabled="isBusy || !canSubmit"
              class="inline-flex min-w-[148px] items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span v-if="isBusy">{{ uploadOrSaveLabel }}</span>
              <span v-else>{{ formMode === 'create' ? 'Terbitkan' : 'Simpan Perubahan' }}</span>
            </button>
          </div>
        </div>
      </template>
    </ModalShell>

    <!-- Delete Modal -->
    <ModalShell v-model="showDelete" title="Hapus Artikel">
      <p class="text-sm text-gray-700 dark:text-neutral-200">
        Hapus artikel <strong>{{ current?.title }}</strong>? Tindakan ini tidak dapat dibatalkan.
      </p>

      <template #footer>
        <button
          @click="showDelete = false"
          :disabled="deleting"
          class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          Batal
        </button>
        <button
          @click="confirmDelete"
          :disabled="deleting"
          class="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ deleting ? 'Menghapus...' : 'Hapus' }}
        </button>
      </template>
    </ModalShell>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick, shallowRef } from 'vue'
import ModalShell from '~/components/widget/ModalShell.vue'
import { useNews, type NewsItem } from '~/composables/data/useNews'
import { useCloudinaryUpload } from '~/composables/useCloudinaryUpload'
import { useNuxtApp } from '#app'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { push, ref as dbRef, onValue, off } from 'firebase/database'

definePageMeta({
  layout: 'app',
  layoutProps: { title: 'Berita Informasi' }
})

const {
  pending,
  error,
  items,
  loadNews,
  createNews,
  updateNews,
  deleteNews
} = useNews()

onMounted(loadNews)

const activeTab = ref<'articles' | 'history'>('articles')
const search = ref('')
const page = ref(1)
const pageSize = 12

const sessionUser = useState<any>('sessionUser', () => null)
const { $realtimeDb } = useNuxtApp() as any

const currentAuthor = computed(() => ({
  uid: sessionUser.value?.uid || '-',
  name: sessionUser.value?.name || sessionUser.value?.displayName || 'Unknown',
  email: sessionUser.value?.email || '-',
  role: sessionUser.value?.role || '-',
  avatar: sessionUser.value?.avatar || sessionUser.value?.photoURL || ''
}))

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return items.value
  return items.value.filter((n) => {
    const hay = [n.title, n.excerpt, ...(n.tags || [])].join(' ').toLowerCase()
    return hay.includes(q)
  })
})

const paged = computed(() => filtered.value.slice(0, page.value * pageSize))
const hasMore = computed(() => paged.value.length < filtered.value.length)

const publishedThisMonth = computed(() => {
  const now = new Date()
  return items.value.filter((n) => {
    const d = new Date(n.publishedAt)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
})

const categoriesCount = computed(() => {
  return new Set(items.value.map((n) => n.category).filter(Boolean)).size
})

function getAuthor(n: any) {
  return n?.author || n?.updatedBy || null
}

function formatDate(ts: number) {
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(ts)
}

function formatDateTime(ts: number) {
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(ts)
}

function initials(name: string) {
  if (!name) return '?'
  return name.trim().split(/\s+/).map((s) => s[0] || '').slice(0, 2).join('').toUpperCase()
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

type NewsAction = 'create' | 'update' | 'delete'
type NewsLog = {
  id: string
  newsId: string | null
  action: NewsAction
  at: number
  author: { uid: string; name: string; email: string; role: string }
  meta: { title: string; category: string; slug?: string; tags?: string[] }
}

async function logNews(action: NewsAction, newsId: string | null, payload: Partial<NewsItem>) {
  try {
    const author = {
      uid: currentAuthor.value.uid || '-',
      name: currentAuthor.value.name || 'Unknown',
      email: currentAuthor.value.email || '-',
      role: currentAuthor.value.role || '-'
    }

    const entry = {
      action,
      newsId,
      author,
      at: Date.now(),
      meta: {
        title: payload.title || '',
        category: payload.category || '',
        slug: payload.slug || '',
        tags: payload.tags || []
      }
    }

    const path = newsId ? `alinayah/news_history/${newsId}` : `alinayah/news_history/_general`
    await push(dbRef($realtimeDb, path), entry)
  } catch (e) {
    console.error('logNews failed', e)
  }
}

const history = ref<NewsLog[]>([])
const searchHist = ref('')
const pageHist = ref(1)
const pageSizeHist = 25
let histRef: any = null

onMounted(() => {
  histRef = dbRef($realtimeDb, 'alinayah/news_history')
  onValue(histRef, (snap: any) => {
    const val = snap.val() || {}
    const arr: NewsLog[] = []

    for (const k of Object.keys(val)) {
      const node = val[k] || {}
      for (const logId of Object.keys(node)) {
        const e = node[logId]
        arr.push({
          id: logId,
          newsId: k === '_general' ? null : k,
          action: e.action,
          at: e.at,
          author: e.author || { uid: '-', name: 'Unknown', email: '-', role: '-' },
          meta: e.meta || { title: '', category: '', slug: '', tags: [] }
        })
      }
    }

    history.value = arr.sort((a, b) => b.at - a.at)
  })
})

onBeforeUnmount(() => {
  try {
    if (histRef) off(histRef)
  } catch {}
})

const historyFiltered = computed(() => {
  const q = searchHist.value.trim().toLowerCase()
  if (!q) return history.value

  return history.value.filter((e) => {
    const hay = [
      e.action,
      e.newsId || '',
      e.author.name,
      e.author.email,
      e.author.role,
      e.meta.title,
      e.meta.category,
      e.meta.slug || '',
      ...(e.meta.tags || [])
    ].join(' ').toLowerCase()

    return hay.includes(q)
  })
})

const pagedHist = computed(() => historyFiltered.value.slice(0, pageHist.value * pageSizeHist))
const hasMoreHist = computed(() => pagedHist.value.length < historyFiltered.value.length)

const showForm = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const wizardStep = ref<1 | 2 | 3>(1)
const formError = ref<string | null>(null)
const current = ref<NewsItem | null>(null)

const steps = [
  { id: 1, title: 'Informasi', desc: 'Judul, kategori, ringkasan' },
  { id: 2, title: 'Cover', desc: 'Upload atau link gambar' },
  { id: 3, title: 'Konten', desc: 'Isi artikel' }
] as const

const editor = shallowRef<Editor | null>(null)
function ensureEditor() {
  if (editor.value) return
  editor.value = new Editor({
    content: '<p></p>',
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] } })],
    editorProps: { attributes: { class: 'outline-none' } }
  })
}
onBeforeUnmount(() => editor.value?.destroy())

const form = reactive({
  title: '',
  category: '',
  tagsInput: '',
  excerpt: '',
  cover: '',
  coverLink: '',
  publishedAt: Date.now()
})

const parsedTags = computed(() =>
  form.tagsInput.split(',').map((s) => s.trim()).filter(Boolean)
)

const publishedAtLocal = computed({
  get() {
    const d = new Date(form.publishedAt || Date.now())
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  },
  set(v: string) {
    const t = v ? new Date(v).getTime() : Date.now()
    if (!Number.isNaN(t)) form.publishedAt = t
  }
})

const coverMode = ref<'upload' | 'link'>('upload')
const coverInput = ref<HTMLInputElement | null>(null)
const coverFile = shallowRef<File | null>(null)
const objectPreview = ref('')

const { uploading, uploadError, uploadImage } = useCloudinaryUpload()
const saving = ref(false)
const deleting = ref(false)
const submitLocked = ref(false)

const isBusy = computed(() => saving.value || uploading.value || submitLocked.value)
const uploadOrSaveLabel = computed(() => {
  if (uploading.value) return 'Mengunggah cover...'
  if (saving.value) return 'Menyimpan artikel...'
  return 'Memproses...'
})

const resolvedCoverPreview = computed(() => {
  if (coverMode.value === 'upload' && objectPreview.value) return objectPreview.value
  if (coverMode.value === 'link' && isValidUrl(form.coverLink)) return form.coverLink
  if (form.cover) return form.cover
  return ''
})

const canSubmit = computed(() => {
  return !!form.title.trim() && !!form.category.trim()
})

function revokePreview() {
  if (objectPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(objectPreview.value)
  }
  objectPreview.value = ''
}

function resetForm() {
  form.title = ''
  form.category = ''
  form.tagsInput = ''
  form.excerpt = ''
  form.cover = ''
  form.coverLink = ''
  form.publishedAt = Date.now()

  coverMode.value = 'upload'
  coverFile.value = null
  revokePreview()
  formError.value = null
  wizardStep.value = 1
  current.value = null

  ensureEditor()
  editor.value!.commands.setContent('<p></p>')
}

function setEditorFromNews(n?: NewsItem) {
  ensureEditor()
  const c: any = n?.content
  if (c?.kind === 'tiptap' && c.json) editor.value!.commands.setContent(c.json)
  else if (c?.kind === 'tiptap' && c.html) editor.value!.commands.setContent(c.html)
  else if (typeof c === 'string' && c.trim().startsWith('<')) editor.value!.commands.setContent(c)
  else editor.value!.commands.setContent('<p></p>')
}

function openCreate() {
  formMode.value = 'create'
  resetForm()
  showForm.value = true
  nextTick(() => setEditorFromNews())
}

function openEdit(n: NewsItem) {
  formMode.value = 'edit'
  current.value = n
  form.title = n.title || ''
  form.category = n.category || ''
  form.tagsInput = (n.tags || []).join(', ')
  form.excerpt = n.excerpt || ''
  form.cover = n.cover || ''
  form.coverLink = ''
  form.publishedAt = n.publishedAt || Date.now()
  coverMode.value = 'link'
  coverFile.value = null
  revokePreview()
  formError.value = null
  wizardStep.value = 1
  showForm.value = true
  nextTick(() => setEditorFromNews(n))
}

function onPickCover(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] || null
  if (!file) return

  if (!file.type.startsWith('image/')) {
    formError.value = 'File cover harus berupa gambar.'
    return
  }

  const maxBytes = 5 * 1024 * 1024
  if (file.size > maxBytes) {
    formError.value = 'Ukuran cover maksimal 5 MB.'
    return
  }

  formError.value = null
  coverMode.value = 'upload'
  coverFile.value = file
  form.coverLink = ''
  revokePreview()
  objectPreview.value = URL.createObjectURL(file)
}

function clearCover() {
  form.cover = ''
  form.coverLink = ''
  coverFile.value = null
  revokePreview()
}

function isValidUrl(v: string) {
  if (!v) return false
  try {
    new URL(v)
    return true
  } catch {
    return false
  }
}

async function resolveCoverUrl() {
  if (coverMode.value === 'upload' && coverFile.value) {
    const uploaded = await uploadImage(coverFile.value, { folder: 'alinayah/news/covers' })
    return uploaded.secure_url
  }

  if (coverMode.value === 'link' && form.coverLink.trim()) {
    if (!isValidUrl(form.coverLink.trim())) {
      throw new Error('Link gambar tidak valid.')
    }
    return form.coverLink.trim()
  }

  return form.cover || ''
}

function validateStep(step: number) {
  formError.value = null

  if (step === 1) {
    if (!form.title.trim()) {
      formError.value = 'Judul wajib diisi.'
      return false
    }
    if (!form.category.trim()) {
      formError.value = 'Kategori wajib diisi.'
      return false
    }
  }

  if (step === 2) {
    if (coverMode.value === 'link' && form.coverLink.trim() && !isValidUrl(form.coverLink.trim())) {
      formError.value = 'Link gambar tidak valid.'
      return false
    }
  }

  return true
}

function nextStep() {
  if (!validateStep(wizardStep.value)) return
  if (wizardStep.value < 3) wizardStep.value = (wizardStep.value + 1) as 1 | 2 | 3
}

function runEditor(run: () => boolean) {
  run()
}

function isActive(name: string, attrs?: any) {
  return editor.value?.isActive(name, attrs)
    ? 'bg-green-600 text-white border-green-600 hover:text-white'
    : ''
}

async function submit() {
  if (submitLocked.value || saving.value || uploading.value) return
  if (!validateStep(1) || !validateStep(2)) return

  submitLocked.value = true
  saving.value = true
  formError.value = null

  try {
    ensureEditor()

    const coverUrl = await resolveCoverUrl()
    const json = editor.value!.getJSON()
    const html = editor.value!.getHTML()
    const content = { kind: 'tiptap', json, html }

    if (formMode.value === 'create') {
      const createdId = await createNews({
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        cover: coverUrl,
        category: form.category.trim(),
        tags: parsedTags.value,
        publishedAt: form.publishedAt,
        author: currentAuthor.value,
        content
      })

      await logNews('create', createdId || null, {
        title: form.title.trim(),
        category: form.category.trim(),
        tags: parsedTags.value
      })
    } else if (current.value) {
      await updateNews(current.value.id, {
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        cover: coverUrl,
        category: form.category.trim(),
        tags: parsedTags.value,
        publishedAt: form.publishedAt,
        updatedBy: currentAuthor.value,
        content
      })

      await logNews('update', current.value.id, {
        title: form.title.trim(),
        category: form.category.trim(),
        tags: parsedTags.value,
        slug: current.value.slug
      })
    }

    showForm.value = false
    resetForm()
  } catch (err: any) {
    formError.value = err?.message || 'Gagal menyimpan artikel.'
  } finally {
    saving.value = false
    submitLocked.value = false
  }
}

const showDelete = ref(false)

function openDelete(n: NewsItem) {
  current.value = n
  showDelete.value = true
}

async function confirmDelete() {
  if (!current.value || deleting.value) return
  deleting.value = true
  try {
    const target = current.value
    await deleteNews(target.id)
    await logNews('delete', target.id, {
      title: target.title,
      category: target.category,
      tags: target.tags,
      slug: target.slug
    })
    showDelete.value = false
  } finally {
    deleting.value = false
  }
}
</script>