<template>
  <section class="relative overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
    <!-- Header -->
    <div class="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-green-50 via-white to-lime-50 px-5 py-5 dark:border-neutral-800 dark:from-green-950/20 dark:via-neutral-900 dark:to-neutral-900 md:px-6">
      <div class="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-green-300/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-20 left-8 h-40 w-40 rounded-full bg-lime-300/20 blur-3xl"></div>

      <div class="relative z-10">
        <div class="inline-flex items-center gap-2 rounded-full border border-green-100 bg-white/80 px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm backdrop-blur dark:border-green-900/40 dark:bg-neutral-900/70 dark:text-green-300">
          <span class="h-2 w-2 rounded-full bg-green-500"></span>
          Blog / Berita Editor
        </div>

        <h2 class="mt-4 text-xl font-black tracking-tight text-gray-950 dark:text-white">
          Kelola Tampilan Berita di Halaman
        </h2>

        <p class="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
          Atur judul, featured article, daftar post, dan sumber berita. Gambar bisa upload ke Cloudinary atau memakai link langsung setelah divalidasi.
        </p>
      </div>

      <!-- Tabs -->
      <div class="relative z-10 mt-5 flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-black transition"
          :class="active === tab.key
            ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
            : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white'"
          @click="active = tab.key"
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
      <!-- Heading -->
      <div v-show="active === 'Heading'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Heading Section
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Teks pembuka untuk blok berita atau kegiatan di halaman website.
              </p>
            </div>

            <div class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm ring-1 ring-green-100 dark:bg-neutral-900 dark:text-green-300 dark:ring-green-900/40">
              <span class="h-2 w-2 rounded-full bg-green-500"></span>
              Basic Content
            </div>
          </div>
        </div>

        <div class="grid gap-4">
          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Judul
            </label>
            <input
              v-model.trim="form.headingTitle"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Kegiatan Harian & Mingguan Santri"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Deskripsi
            </label>
            <textarea
              v-model.trim="form.headingDesc"
              rows="5"
              class="block w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Deskripsi singkat section berita..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Featured -->
      <div v-show="active === 'Featured'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Pilih Berita Utama
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Berita yang dipilih akan otomatis mengisi judul, kategori, tanggal, cover, tags, dan link featured.
              </p>
            </div>

            <div class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm ring-1 ring-green-100 dark:bg-neutral-900 dark:text-green-300 dark:ring-green-900/40">
              <span class="h-2 w-2 rounded-full bg-green-500"></span>
              Dari Data Berita
            </div>
          </div>
        </div>

        <div class="grid gap-5 lg:grid-cols-[0.95fr,1.05fr]">
          <!-- News Picker -->
          <div class="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex flex-col gap-3">
              <div>
                <h4 class="text-sm font-black text-gray-900 dark:text-white">
                  Daftar Berita
                </h4>
                <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                  Cari dan pilih satu berita sebagai featured.
                </p>
              </div>

              <div class="relative">
                <Icon icon="lucide:search" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  v-model="news.q.value"
                  type="search"
                  placeholder="Cari berita..."
                  class="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-900"
                />
              </div>
            </div>

            <div class="mt-4 max-h-[520px] space-y-3 overflow-y-auto pr-1">
              <button
                v-for="item in (news.filtered.value as any[])"
                :key="item.id"
                type="button"
                class="flex w-full gap-3 rounded-[22px] border p-3 text-left transition"
                :class="form.featured.newsId === item.id
                  ? 'border-green-300 bg-green-50 ring-2 ring-green-500/10 dark:border-green-900/50 dark:bg-green-900/10'
                  : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800'"
                @click="chooseFeaturedNews(item)"
              >
                <img
                  :src="item.cover || '/assets/logo.png'"
                  alt=""
                  class="h-20 w-24 shrink-0 rounded-2xl object-cover"
                />

                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <span class="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
                      {{ item.category || 'Umum' }}
                    </span>

                    <span
                      v-if="form.featured.newsId === item.id"
                      class="rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold text-white"
                    >
                      Dipilih
                    </span>
                  </div>

                  <p class="mt-2 line-clamp-2 text-sm font-black text-gray-900 dark:text-white">
                    {{ item.title }}
                  </p>

                  <p class="mt-1 text-[11px] text-gray-500 dark:text-neutral-400">
                    {{ new Date(item.publishedAt || 0).toLocaleDateString('id-ID') }} • {{ item.readTime || 3 }} menit
                  </p>
                </div>
              </button>

              <div
                v-if="!(news.filtered.value as any[]).length"
                class="rounded-[22px] border border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-neutral-700 dark:bg-neutral-800/40"
              >
                <Icon icon="lucide:file-search" class="mx-auto h-8 w-8 text-gray-400" />
                <p class="mt-2 text-sm font-bold text-gray-600 dark:text-neutral-300">
                  Belum ada berita
                </p>
                <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                  Buat berita terlebih dahulu di menu berita.
                </p>
              </div>
            </div>
          </div>

          <!-- Featured Preview -->
          <div class="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-center justify-between gap-3">
              <div>
                <h4 class="text-sm font-black text-gray-900 dark:text-white">
                  Preview Featured
                </h4>
                <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                  Data yang akan disimpan ke section.
                </p>
              </div>

              <span
                class="rounded-full px-3 py-1 text-xs font-bold"
                :class="form.featured.newsId
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-300'"
              >
                {{ form.featured.newsId ? 'Terhubung Berita' : 'Belum Dipilih' }}
              </span>
            </div>

            <div class="mt-4 overflow-hidden rounded-[24px] border border-gray-200 dark:border-neutral-800">
              <img
                v-if="form.featured.cover"
                :src="form.featured.cover"
                class="h-72 w-full object-cover"
                alt="featured"
              />

              <div v-else class="grid h-72 place-items-center bg-gray-50 text-center dark:bg-neutral-800/60">
                <div>
                  <Icon icon="lucide:image-plus" class="mx-auto h-10 w-10 text-gray-400" />
                  <p class="mt-2 text-sm font-semibold text-gray-500 dark:text-neutral-400">
                    Belum ada cover
                  </p>
                </div>
              </div>

              <div class="space-y-3 p-4">
                <div class="flex flex-wrap gap-2">
                  <span class="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    {{ form.featured.category || 'Umum' }}
                  </span>
                  <span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
                    {{ form.featured.dateText || '-' }}
                  </span>
                </div>

                <h3 class="text-lg font-black leading-snug text-gray-900 dark:text-white">
                  {{ form.featured.title || 'Pilih berita untuk featured' }}
                </h3>

                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in form.featured.tags"
                    :key="tag"
                    class="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    #{{ tag }}
                  </span>
                </div>

                <p class="truncate text-xs text-gray-500 dark:text-neutral-400">
                  Link: {{ form.featured.href || '-' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Posts -->
      <div v-show="active === 'Posts'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Pilih Berita untuk Daftar Post
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Centang beberapa berita yang ingin ditampilkan sebagai post. Berita yang sudah menjadi featured tidak akan dimasukkan sebagai post.
              </p>
            </div>

            <div class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm ring-1 ring-green-100 dark:bg-neutral-900 dark:text-green-300 dark:ring-green-900/40">
              {{ form.posts.length }} Post Dipilih
            </div>
          </div>
        </div>

        <div class="grid gap-5 lg:grid-cols-[0.95fr,1.05fr]">
          <!-- Picker -->
          <div class="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex flex-col gap-3">
              <div>
                <h4 class="text-sm font-black text-gray-900 dark:text-white">
                  Daftar Berita
                </h4>
                <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                  Pilih beberapa berita untuk dimasukkan ke daftar post.
                </p>
              </div>

              <div class="relative">
                <Icon icon="lucide:search" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  v-model="news.q.value"
                  type="search"
                  placeholder="Cari berita..."
                  class="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-900"
                />
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  class="inline-flex h-10 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="pickLatestManual"
                >
                  Pilih Terbaru
                </button>

                <button
                  type="button"
                  class="inline-flex h-10 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="clearManual"
                >
                  Kosongkan
                </button>
              </div>
            </div>

            <div class="mt-4 max-h-[560px] space-y-3 overflow-y-auto pr-1">
              <button
                v-for="item in (availableNewsForPosts as any[])"
                :key="item.id"
                type="button"
                class="flex w-full gap-3 rounded-[22px] border p-3 text-left transition"
                :class="selectedPostNewsIds.has(item.id)
                  ? 'border-green-300 bg-green-50 ring-2 ring-green-500/10 dark:border-green-900/50 dark:bg-green-900/10'
                  : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800'"
                @click="togglePostNews(item)"
              >
                <img
                  :src="item.cover || '/assets/logo.png'"
                  alt=""
                  class="h-20 w-24 shrink-0 rounded-2xl object-cover"
                />

                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <span class="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
                      {{ item.category || 'Umum' }}
                    </span>

                    <span
                      v-if="selectedPostNewsIds.has(item.id)"
                      class="rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold text-white"
                    >
                      Dipilih
                    </span>
                  </div>

                  <p class="mt-2 line-clamp-2 text-sm font-black text-gray-900 dark:text-white">
                    {{ item.title }}
                  </p>

                  <p class="mt-1 text-[11px] text-gray-500 dark:text-neutral-400">
                    {{ new Date(item.publishedAt || 0).toLocaleDateString('id-ID') }} • {{ item.readTime || 3 }} menit
                  </p>
                </div>

                <div class="grid h-7 w-7 shrink-0 place-items-center rounded-full border"
                  :class="selectedPostNewsIds.has(item.id)
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-gray-200 bg-white text-transparent dark:border-neutral-700 dark:bg-neutral-900'"
                >
                  <Icon icon="lucide:check" class="h-4 w-4" />
                </div>
              </button>
            </div>
          </div>

          <!-- Selected Posts -->
          <div class="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-center justify-between gap-3">
              <div>
                <h4 class="text-sm font-black text-gray-900 dark:text-white">
                  Post Terpilih
                </h4>
                <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                  Urutan akan mengikuti urutan pemilihan.
                </p>
              </div>

              <span class="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-900/20 dark:text-green-300">
                {{ form.posts.length }} item
              </span>
            </div>

            <div class="mt-4 space-y-3">
              <article
                v-for="(post, index) in form.posts"
                :key="post.id"
                class="flex gap-3 rounded-[22px] border border-gray-200 bg-gray-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50"
              >
                <img
                  :src="post.cover || '/assets/logo.png'"
                  alt=""
                  class="h-20 w-24 shrink-0 rounded-2xl object-cover"
                />

                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <span class="grid h-6 w-6 place-items-center rounded-full bg-green-600 text-[11px] font-black text-white">
                      {{ index + 1 }}
                    </span>

                    <span class="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-gray-600 dark:bg-neutral-900 dark:text-neutral-300">
                      {{ post.category || 'Umum' }}
                    </span>
                  </div>

                  <p class="mt-2 line-clamp-2 text-sm font-black text-gray-900 dark:text-white">
                    {{ post.title }}
                  </p>

                  <p class="mt-1 text-[11px] text-gray-500 dark:text-neutral-400">
                    {{ post.dateText }} • {{ post.readTime || 3 }} menit
                  </p>
                </div>

                <button
                  type="button"
                  class="grid h-9 w-9 shrink-0 place-items-center rounded-2xl border border-rose-200 bg-white text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
                  @click="removeSelectedPostNews(post.newsId)"
                >
                  <Icon icon="lucide:x" class="h-4 w-4" />
                </button>
              </article>

              <div
                v-if="!form.posts.length"
                class="rounded-[22px] border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-800/40"
              >
                <Icon icon="lucide:newspaper" class="mx-auto h-8 w-8 text-gray-400" />
                <p class="mt-2 text-sm font-bold text-gray-600 dark:text-neutral-300">
                  Belum ada post dipilih
                </p>
                <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                  Pilih beberapa berita dari daftar sebelah kiri.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Berita Source -->
      <div v-show="active === 'Berita'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white">
              Sumber Berita
            </h3>
            <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
              Pilih apakah section memakai konten custom, berita terbaru otomatis, atau memilih manual dari daftar berita.
            </p>
          </div>
        </div>

        <div class="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="grid gap-3 lg:grid-cols-3">
            <label
              class="flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition"
              :class="form.newsSource.mode === 'custom'
                ? 'border-green-300 bg-green-50 dark:border-green-900/40 dark:bg-green-900/10'
                : 'border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-neutral-800 dark:bg-neutral-800/50 dark:hover:bg-neutral-800'"
            >
              <input v-model="form.newsSource.mode" type="radio" value="custom" class="mt-1 size-4 text-green-600 focus:ring-green-500" />
              <span>
                <span class="block text-sm font-black text-gray-900 dark:text-white">Custom</span>
                <span class="mt-1 block text-xs leading-5 text-gray-500 dark:text-neutral-400">Pakai data dari tab Featured & Posts.</span>
              </span>
            </label>

            <label
              class="flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition"
              :class="form.newsSource.mode === 'auto'
                ? 'border-green-300 bg-green-50 dark:border-green-900/40 dark:bg-green-900/10'
                : 'border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-neutral-800 dark:bg-neutral-800/50 dark:hover:bg-neutral-800'"
            >
              <input v-model="form.newsSource.mode" type="radio" value="auto" class="mt-1 size-4 text-green-600 focus:ring-green-500" />
              <span>
                <span class="block text-sm font-black text-gray-900 dark:text-white">Otomatis</span>
                <span class="mt-1 block text-xs leading-5 text-gray-500 dark:text-neutral-400">Ambil berita terbaru secara otomatis.</span>
              </span>
            </label>

            <label
              class="flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition"
              :class="form.newsSource.mode === 'manual'
                ? 'border-green-300 bg-green-50 dark:border-green-900/40 dark:bg-green-900/10'
                : 'border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-neutral-800 dark:bg-neutral-800/50 dark:hover:bg-neutral-800'"
            >
              <input v-model="form.newsSource.mode" type="radio" value="manual" class="mt-1 size-4 text-green-600 focus:ring-green-500" />
              <span>
                <span class="block text-sm font-black text-gray-900 dark:text-white">Manual</span>
                <span class="mt-1 block text-xs leading-5 text-gray-500 dark:text-neutral-400">Pilih featured dan post dari daftar berita.</span>
              </span>
            </label>
          </div>

          <div v-if="form.newsSource.mode === 'auto'" class="mt-5 grid gap-4 md:grid-cols-[260px,1fr]">
            <div>
              <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                Jumlah Total Item
              </label>
              <input
                v-model.number="form.newsSource.autoTotal"
                type="number"
                min="2"
                max="12"
                class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
              <p class="mt-1 text-[11px] text-gray-500 dark:text-neutral-400">
                Contoh: 5 = 1 featured + 4 posts.
              </p>
            </div>

            <div class="rounded-[24px] border border-dashed border-gray-300 bg-gray-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/40">
              <p class="text-sm leading-6 text-gray-600 dark:text-neutral-300">
                Akan otomatis mengambil berita terbaru berdasarkan tanggal publish. Item pertama menjadi featured, sisanya menjadi posts.
              </p>
            </div>
          </div>

          <div v-else-if="form.newsSource.mode === 'manual'" class="mt-5 space-y-4">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
              <input
                v-model="news.q.value"
                placeholder="Cari judul, kategori, atau tag..."
                class="h-11 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] lg:w-80 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />

              <div class="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  class="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-xs font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="pickLatestManual"
                >
                  Pilih Terbaru
                </button>

                <button
                  type="button"
                  class="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-xs font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="clearManual"
                >
                  Kosongkan
                </button>
              </div>

              <span class="text-xs text-gray-600 lg:ml-auto dark:text-neutral-300">
                Featured: <b>{{ shortId(form.newsSource.featuredId) || '-' }}</b> • Posts: <b>{{ form.newsSource.postIds.length }}</b>
              </span>
            </div>

            <div class="max-h-96 overflow-auto rounded-[24px] border border-gray-200 dark:border-neutral-800">
              <div
                v-for="item in (news.filtered.value as any[])"
                :key="item.id"
                class="flex flex-col gap-3 border-b border-gray-200 p-3 last:border-b-0 dark:border-neutral-800 lg:flex-row lg:items-center"
              >
                <img
                  :src="item.cover"
                  alt=""
                  class="h-20 w-full rounded-2xl border border-gray-200 object-cover lg:h-14 lg:w-24 dark:border-neutral-800"
                />

                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-black text-gray-900 dark:text-white">
                    {{ item.title }}
                  </p>
                  <p class="mt-1 truncate text-[11px] text-gray-500 dark:text-neutral-400">
                    {{ new Date(item.publishedAt || 0).toLocaleString('id-ID') }} • {{ item.category || 'Umum' }} • {{ (item.tags || []).join(', ') }}
                  </p>
                </div>

                <div class="flex items-center gap-3">
                  <label class="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-neutral-300">
                    <input
                      type="radio"
                      name="featured-radio"
                      :value="item.id"
                      :checked="form.newsSource.featuredId === item.id"
                      class="text-green-600 focus:ring-green-500"
                      @change="setFeatured(item.id)"
                    />
                    Featured
                  </label>

                  <label class="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-neutral-300">
                    <input
                      type="checkbox"
                      :value="item.id"
                      :checked="form.newsSource.postIds.includes(item.id)"
                      class="rounded text-green-600 focus:ring-green-500"
                      @change="togglePost(item.id)"
                    />
                    Post
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="mt-5 rounded-[24px] border border-dashed border-gray-300 bg-gray-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/40">
            <p class="text-sm leading-6 text-gray-600 dark:text-neutral-300">
              Mode custom akan memakai data dari tab <b>Featured</b> dan <b>Posts</b>.
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
            @click="resetDefault"
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
import { useNews } from '~/composables/data/useNews'
import { useCloudinaryUpload } from '~/composables/useCloudinaryUpload'

type Post = {
  id: string
  newsId?: string
  title: string
  href: string
  excerpt: string
  cover: string
  coverPublicId?: string | null
  dateText: string
  readTime: number
  category: string
  tags: string[]
}

type Featured = {
  newsId?: string
  title: string
  cover: string
  coverPublicId?: string | null
  dateText: string
  category: string
  tags: string[]
  href?: string
}

type NewsSource = {
  mode: 'custom' | 'auto' | 'manual'
  autoTotal: number
  featuredId?: string
  postIds: string[]
}

type Shape = {
  headingTitle: string
  headingDesc: string
  featured: Featured
  posts: Post[]
  newsSource: NewsSource
}

const props = defineProps<{
  section: {
    id: string
    key: string
    props?: Partial<Shape>
  }
}>()

const tabs = [
  { key: 'Heading', label: 'Heading', icon: 'lucide:type' },
  { key: 'Featured', label: 'Featured', icon: 'lucide:star' },
  { key: 'Posts', label: 'Posts', icon: 'lucide:newspaper' },
  { key: 'Berita', label: 'Sumber Berita', icon: 'lucide:rss' }
] as const

type TabKey = typeof tabs[number]['key']

const active = ref<TabKey>('Heading')

const defaults: Shape = {
  headingTitle: 'Kegiatan Harian & Mingguan Santri',
  headingDesc: 'Pantau jadwal kajian, ibadah, dan aktivitas santri Pondok Pesantren Al-Inayah secara teratur. Temukan kegiatan yang sesuai dengan minat dan kebutuhan Anda.',
  featured: {
    newsId: '',
    title: 'Tahfidz Berbasis Target & Analitik: Metrik Hafalan yang Membumi',
    cover: '/assets/images/activity.jpg',
    coverPublicId: null,
    dateText: '12 Agustus 2025 15:30',
    category: 'Tahfidz',
    tags: ['tahfidz', 'murajaah', 'edtech'],
    href: '#'
  },
  posts: [
    {
      id: 'p-01',
      newsId: '',
      title: 'Integrasi Diniyah & Literasi Digital: Model Kelas Hybrid',
      href: '#',
      excerpt: 'Kurikulum diniyah diperkaya literasi digital...',
      cover: 'https://obayan.id/logo.png',
      coverPublicId: null,
      dateText: '10 Agustus 2025',
      readTime: 7,
      category: 'Pendidikan',
      tags: ['kurikulum', 'digital', 'inovasi']
    }
  ],
  newsSource: {
    mode: 'custom',
    autoTotal: 5,
    featuredId: '',
    postIds: []
  }
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

function normalizePosts(posts: Post[]) {
  return posts.map((post) => ({
    ...post,
    newsId: post.newsId || '',
    coverPublicId: post.coverPublicId || null,
    tags: Array.isArray(post.tags) ? post.tags : []
  }))
}

function merge(base: Shape, patch: Partial<Shape> = {}): Shape {
  return {
    headingTitle: patch.headingTitle ?? base.headingTitle,
    headingDesc: patch.headingDesc ?? base.headingDesc,
    featured: {
      newsId: patch.featured?.newsId ?? base.featured.newsId ?? '',
      title: patch.featured?.title ?? base.featured.title,
      cover: patch.featured?.cover ?? base.featured.cover,
      coverPublicId: patch.featured?.coverPublicId ?? base.featured.coverPublicId ?? null,
      dateText: patch.featured?.dateText ?? base.featured.dateText,
      category: patch.featured?.category ?? base.featured.category,
      tags: Array.isArray(patch.featured?.tags) ? clone(patch.featured!.tags) : clone(base.featured.tags),
      href: patch.featured?.href ?? base.featured.href
    },
    posts: normalizePosts(Array.isArray(patch.posts) && patch.posts.length ? clone(patch.posts) : clone(base.posts)),
    newsSource: {
      mode: patch.newsSource?.mode ?? base.newsSource.mode,
      autoTotal: Number(patch.newsSource?.autoTotal ?? base.newsSource.autoTotal) || 5,
      featuredId: patch.newsSource?.featuredId ?? base.newsSource.featuredId,
      postIds: Array.isArray(patch.newsSource?.postIds) ? clone(patch.newsSource!.postIds) : clone(base.newsSource.postIds)
    }
  }
}

const form = reactive<Shape>(merge(defaults, props.section?.props || {}))
const progress = reactive<Record<string, number>>({})
const savedNote = ref('')
const errNote = ref('')
const saving = ref(false)

watch(
  () => props.section?.props,
  (nextProps) => {
    Object.assign(form, merge(defaults, nextProps || {}))
  }
)

const news = useNews()
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

const mediaMode = reactive<Record<string, 'upload' | 'url'>>({
  'featured.cover': 'upload'
})

const mediaUrlDraft = reactive<Record<string, string>>({
  'featured.cover': form.featured.cover || ''
})

const errorModal = reactive({
  show: false,
  title: '',
  message: ''
})

const featuredTagsText = computed({
  get: () => (form.featured.tags || []).join(', '),
  set: (value: string) => {
    form.featured.tags = splitTags(value)
  }
})

watch(
  () => [form.featured.cover, ...form.posts.map((post) => post.cover)],
  () => syncMediaDrafts(),
  { immediate: true }
)

function syncMediaDrafts() {
  mediaUrlDraft['featured.cover'] = form.featured.cover || ''

  form.posts.forEach((post, index) => {
    ensurePostMediaState(index)
    mediaUrlDraft[`posts.${index}.cover`] = post.cover || ''
  })
}

function ensurePostMediaState(index: number) {
  const key = `posts.${index}.cover`

  if (!(key in mediaMode)) {
    mediaMode[key] = 'upload'
  }

  if (!(key in mediaUrlDraft)) {
    mediaUrlDraft[key] = form.posts[index]?.cover || ''
  }
}

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

function splitTags(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function getTagsText(index: number) {
  return (form.posts[index]?.tags || []).join(', ')
}

function setTagsText(index: number, value: string) {
  if (!form.posts[index]) return
  form.posts[index].tags = splitTags(value)
}

function addPost() {
  const index = form.posts.length

  form.posts.push({
    id: `p-${Date.now()}`,
    title: 'Judul',
    href: '#',
    excerpt: '',
    cover: '',
    coverPublicId: null,
    dateText: new Date().toLocaleDateString('id-ID'),
    readTime: 5,
    category: 'Umum',
    tags: []
  })

  ensurePostMediaState(index)
}

async function delPost(index: number) {
  const post = form.posts[index]
  if (!post) return

  if (post.coverPublicId) {
    try {
      await deleteImage(post.coverPublicId)
    } catch {}
  }

  form.posts.splice(index, 1)
  syncMediaDrafts()
}

function dupPost(index: number) {
  const source = form.posts[index]
  if (!source) return

  form.posts.splice(index + 1, 0, {
    ...clone(source),
    id: `p-${Date.now()}`,
    coverPublicId: null
  })

  syncMediaDrafts()
}

function setFeatured(id: string) {
  form.newsSource.featuredId = id

  const index = form.newsSource.postIds.indexOf(id)
  if (index >= 0) form.newsSource.postIds.splice(index, 1)
}

function togglePost(id: string) {
  const index = form.newsSource.postIds.indexOf(id)

  if (index >= 0) {
    form.newsSource.postIds.splice(index, 1)
    return
  }

  if (id === form.newsSource.featuredId) return

  form.newsSource.postIds.push(id)
}

function pickLatestManual() {
  const items = [...(news.items.value || [])].sort((a: any, b: any) => {
    return (b.publishedAt || 0) - (a.publishedAt || 0)
  })

  if (!items.length) return

  const total = clamp(form.newsSource.autoTotal || 5, 2, 12)
  const featured = items[0]
  const posts = items.slice(1, total)

  if (featured) {
    form.featured = mapNewsToFeatured(featured)
    form.newsSource.featuredId = featured.id
  }

  form.posts = posts.map((item: any) => mapNewsToPost(item))
  form.newsSource.postIds = form.posts.map((post) => post.newsId).filter(Boolean) as string[]

  form.newsSource.mode = 'manual'
}

function clearManual() {
  form.newsSource.featuredId = ''
  form.newsSource.postIds = []
  form.featured.newsId = ''
  form.posts = []
}

function shortId(value?: string) {
  if (!value) return ''
  return value.length > 8 ? `${value.slice(0, 8)}…` : value
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function formatNewsDate(value?: number) {
  if (!value) return new Date().toLocaleDateString('id-ID')

  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

function newsHref(item: any) {
  return item?.slug ? `/news?slug=${item.slug}` : '#'
}

function mapNewsToFeatured(item: any): Featured {
  return {
    newsId: item.id || '',
    title: item.title || '',
    cover: item.cover || '',
    coverPublicId: item.coverPublicId || null,
    dateText: formatNewsDate(item.publishedAt),
    category: item.category || 'Umum',
    tags: Array.isArray(item.tags) ? item.tags : [],
    href: newsHref(item)
  }
}

function mapNewsToPost(item: any): Post {
  return {
    id: `news-${item.id}`,
    newsId: item.id || '',
    title: item.title || '',
    href: newsHref(item),
    excerpt: item.excerpt || '',
    cover: item.cover || '',
    coverPublicId: item.coverPublicId || null,
    dateText: formatNewsDate(item.publishedAt),
    readTime: Number(item.readTime || 3),
    category: item.category || 'Umum',
    tags: Array.isArray(item.tags) ? item.tags : []
  }
}

const selectedFeaturedNews = computed(() => {
  return news.items.value.find((item: any) => item.id === form.featured.newsId) || null
})

const selectedPostNewsIds = computed(() => {
  return new Set(form.posts.map((post) => post.newsId).filter(Boolean))
})

const availableNewsForPosts = computed(() => {
  return news.filtered.value.filter((item: any) => item.id !== form.featured.newsId)
})

function chooseFeaturedNews(item: any) {
  if (!item?.id) return

  form.featured = mapNewsToFeatured(item)

  // Hindari berita yang sama muncul sebagai featured dan post.
  form.posts = form.posts.filter((post) => post.newsId !== item.id)

  form.newsSource.mode = 'manual'
  form.newsSource.featuredId = item.id
  form.newsSource.postIds = form.posts.map((post) => post.newsId).filter(Boolean) as string[]

  savedNote.value = 'Berita featured berhasil dipilih.'
  setTimeout(() => {
    savedNote.value = ''
  }, 1500)
}

function togglePostNews(item: any) {
  if (!item?.id) return

  const index = form.posts.findIndex((post) => post.newsId === item.id)

  if (index >= 0) {
    form.posts.splice(index, 1)
  } else {
    form.posts.push(mapNewsToPost(item))
  }

  form.newsSource.mode = 'manual'
  form.newsSource.postIds = form.posts.map((post) => post.newsId).filter(Boolean) as string[]
}

function removeSelectedPostNews(newsId?: string) {
  if (!newsId) return

  const index = form.posts.findIndex((post) => post.newsId === newsId)
  if (index >= 0) {
    form.posts.splice(index, 1)
  }

  form.newsSource.postIds = form.posts.map((post) => post.newsId).filter(Boolean) as string[]
}

function syncFromNewsSource() {
  const featured = news.items.value.find((item: any) => item.id === form.newsSource.featuredId)

  if (featured) {
    form.featured = mapNewsToFeatured(featured)
  }

  const selectedPosts = form.newsSource.postIds
    .map((id) => news.items.value.find((item: any) => item.id === id))
    .filter(Boolean)

  if (selectedPosts.length) {
    form.posts = selectedPosts.map((item: any) => mapNewsToPost(item))
  }
}

watch(() => news.items.value.length, () => {
    if (form.newsSource.mode === 'manual') syncFromNewsSource()
  },
  { immediate: true }
)

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

function getCoverPublicId(key: string) {
  if (key === 'featured.cover') return form.featured.coverPublicId || null

  const match = key.match(/^posts\.(\d+)\.cover$/)
  if (match) return form.posts[Number(match[1])]?.coverPublicId || null

  return null
}

function setCoverValue(key: string, url: string, publicId?: string | null) {
  if (key === 'featured.cover') {
    form.featured.cover = url
    form.featured.coverPublicId = publicId || null
    mediaUrlDraft[key] = url
    return
  }

  const match = key.match(/^posts\.(\d+)\.cover$/)

  if (match) {
    const index = Number(match[1])
    if (!form.posts[index]) return

    form.posts[index].cover = url
    form.posts[index].coverPublicId = publicId || null
    mediaUrlDraft[key] = url
  }
}

async function uploadCoverImage(event: Event, key: string) {
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
    const oldPublicId = getCoverPublicId(key)

    timer = window.setInterval(() => {
      if (progress[key] != null && progress[key] < 92) {
        progress[key] += 7
      }
    }, 180)

    const result = await uploadImage(file, {
      folder: 'obayan-web/blog',
      maxWidth: 1400,
      maxHeight: 900,
      quality: 0.84
    })

    setCoverValue(key, result.secure_url, result.public_id)

    if (oldPublicId && oldPublicId !== result.public_id) {
      await deleteImage(oldPublicId)
    }

    progress[key] = 100
    savedNote.value = 'Gambar berhasil diupload ke Cloudinary.'
    setTimeout(() => (savedNote.value = ''), 1500)
  } catch (error: any) {
    showErrorModal(
      'Upload gagal',
      uploadError.value || error?.message || 'Gagal upload gambar ke Cloudinary.'
    )
  } finally {
    if (timer) window.clearInterval(timer)

    setTimeout(() => {
      delete progress[key]
    }, 1000)

    input.value = ''
  }
}

async function applyCoverUrl(key: string) {
  const url = String(mediaUrlDraft[key] || '').trim()

  if (!url) {
    showErrorModal('URL kosong', 'Masukkan link gambar terlebih dahulu.')
    return
  }

  if (isLocalAssetUrl(url)) {
    const oldPublicId = getCoverPublicId(key)

    if (oldPublicId) {
      try {
        await deleteImage(oldPublicId)
      } catch {}
    }

    setCoverValue(key, url, null)

    savedNote.value = 'Path lokal digunakan.'
    setTimeout(() => (savedNote.value = ''), 1500)
    return
  }

  if (!isHttpUrl(url)) {
    showErrorModal('URL tidak valid', 'Link gambar harus diawali http:// atau https://.')
    return
  }

  try {
    await validateRemoteImageUrl(url)

    const oldPublicId = getCoverPublicId(key)

    if (oldPublicId) {
      try {
        await deleteImage(oldPublicId)
      } catch {}
    }

    setCoverValue(key, url, null)

    savedNote.value = 'Link gambar berhasil digunakan. Klik Simpan untuk menyimpan.'
    setTimeout(() => (savedNote.value = ''), 1500)
  } catch (error: any) {
    showErrorModal(
      'Gambar tidak bisa digunakan',
      error?.message || 'Link gambar invalid, tidak ditemukan, atau tidak bisa diakses.'
    )
  }
}

async function removeCoverImage(key: string) {
  const publicId = getCoverPublicId(key)

  try {
    if (publicId) {
      await deleteImage(publicId)
    }

    setCoverValue(key, '', null)

    savedNote.value = publicId ? 'Gambar dihapus dari Cloudinary.' : 'Gambar dihapus dari form.'
    setTimeout(() => (savedNote.value = ''), 1500)
  } catch (error: any) {
    showErrorModal(
      'Gagal menghapus gambar',
      deleteError.value || error?.message || 'Gagal menghapus gambar.'
    )
  }
}

async function validateAllCoverLinks() {
  const entries = [
    {
      url: form.featured.cover,
      publicId: form.featured.coverPublicId,
      newsId: form.featured.newsId
    },
    ...form.posts.map((post) => ({
      url: post.cover,
      publicId: post.coverPublicId,
      newsId: post.newsId
    }))
  ].filter((item) => item.url)

  for (const item of entries) {
    if (item.newsId) continue
    if (isLocalAssetUrl(item.url)) continue
    if (item.publicId) continue
    if (!isHttpUrl(item.url)) {
      throw new Error(`URL gambar tidak valid: ${item.url}`)
    }
  }
}

/* ===== Save / Reset ===== */
async function save() {
  try {
    saving.value = true
    errNote.value = ''

    form.featured.tags = form.featured.tags.map((tag) => tag.trim()).filter(Boolean)
    form.posts = form.posts.map((post) => ({
      ...post,
      tags: (post.tags || []).map((tag) => tag.trim()).filter(Boolean)
    }))

    form.newsSource.autoTotal = clamp(Number(form.newsSource.autoTotal || 5), 2, 12)
    form.newsSource.mode = form.newsSource.mode === 'auto' ? 'auto' : 'manual'
    form.newsSource.featuredId = form.featured.newsId || form.newsSource.featuredId || ''
    form.newsSource.postIds = form.posts.map((post) => post.newsId).filter(Boolean) as string[]

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

async function resetDefault() {
  const publicIds = [
    form.featured.coverPublicId,
    ...form.posts.map((post) => post.coverPublicId)
  ].filter(Boolean) as string[]

  try {
    await Promise.all(publicIds.map((id) => deleteImage(id)))
  } catch {}

  Object.assign(form, merge(defaults))
  active.value = 'Heading'
  syncMediaDrafts()

  savedNote.value = 'Form dikembalikan ke default.'
  setTimeout(() => {
    savedNote.value = ''
  }, 1500)
}
</script>