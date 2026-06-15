<template>
  <section id="news" class="relative min-h-screen overflow-hidden bg-gray-50 text-gray-800 dark:bg-neutral-950 dark:text-neutral-200">
    <!-- Background -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(22,163,74,0.14),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(132,204,22,0.14),transparent_28%),linear-gradient(to_bottom,#f9fafb,#f3f4f6)] dark:bg-[radial-gradient(circle_at_top_left,rgba(22,163,74,0.18),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(132,204,22,0.12),transparent_28%),linear-gradient(to_bottom,#0a0a0a,#111827)]"></div>
      <div class="absolute -left-28 top-16 h-[34rem] w-[34rem] rounded-full bg-green-200/40 blur-3xl dark:bg-green-900/20"></div>
      <div class="absolute -right-28 top-80 h-[30rem] w-[30rem] rounded-full bg-lime-200/35 blur-3xl dark:bg-lime-900/10"></div>
      <div class="absolute inset-0 opacity-[0.35] dark:opacity-[0.16]">
        <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(22,163,74,.13)_1px,transparent_1px),linear-gradient(to_bottom,rgba(22,163,74,.13)_1px,transparent_1px)] bg-[size:34px_34px]"></div>
      </div>
    </div>

    <!-- Hero -->
    <section class="relative pt-28 md:pt-32">
      <div class="absolute inset-0">
        <div
          v-if="isPageConfigLoading || !cfg.hero.cover"
          class="h-full w-full bg-gradient-to-br from-green-700 via-green-600 to-lime-500"
        >
          <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.12)_1px,transparent_1px)] bg-[size:34px_34px] opacity-40"></div>
          <div class="absolute -left-24 top-16 h-80 w-80 rounded-full bg-white/20 blur-3xl"></div>
          <div class="absolute -right-24 bottom-12 h-80 w-80 rounded-full bg-lime-200/25 blur-3xl"></div>
        </div>

        <img
          v-else-if="cfg.hero.cover && !isBrokenNewsImage(cfg.hero.cover)"
          :src="cfg.hero.cover"
          alt="Cover News"
          class="h-full w-full object-cover opacity-90"
          @error="markBrokenNewsImage(cfg.hero.cover)"
        >

        <div
          v-else
          class="grid h-full w-full place-items-center bg-gradient-to-br from-green-700 via-green-600 to-lime-500 text-white"
        >
          <div class="text-center">
            <Icon icon="lucide:image-off" class="mx-auto h-10 w-10 opacity-90" />
            <p class="mt-3 text-sm font-bold">Invalid image url</p>
          </div>
        </div>

        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20"></div>
      </div>

      <div
        class="relative mx-auto flex max-w-[85rem] items-end px-4 sm:px-6 lg:px-8 heroH"
        :style="{ '--hero-sm': cfg.hero.heightSm, '--hero-lg': cfg.hero.heightLg }"
      >
        <div v-if="isPageConfigLoading" class="mb-10 max-w-3xl">
          <div class="h-7 w-36 animate-pulse rounded-full bg-white/20"></div>
          <div class="mt-4 h-12 w-[min(42rem,82vw)] animate-pulse rounded-2xl bg-white/20 sm:h-14"></div>
          <div class="mt-3 h-5 w-[min(32rem,75vw)] animate-pulse rounded bg-white/20"></div>
          <div class="mt-2 h-5 w-[min(24rem,60vw)] animate-pulse rounded bg-white/15"></div>
        </div>

        <div v-else class="mb-10 max-w-3xl">
          <p class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-green-100 backdrop-blur">
            <span class="inline-block h-2 w-2 rounded-full bg-lime-300"></span>
            {{ cfg.hero.badge }}
          </p>

          <h1 class="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
            {{ cfg.hero.title }}
          </h1>

          <p class="mt-3 max-w-2xl text-sm leading-relaxed text-green-50/90 sm:text-base">
            {{ cfg.hero.subtitle }}
          </p>
        </div>
      </div>
    </section>

    <!-- Body -->
    <main class="relative mx-auto max-w-[85rem] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <!-- Detail -->
      <div v-if="isDetail" class="mx-auto max-w-5xl">
        <div class="-mt-16 rounded-[30px] border border-white/80 bg-white/90 p-4 shadow-2xl shadow-green-950/10 backdrop-blur-2xl dark:border-neutral-800 dark:bg-neutral-900/90 dark:shadow-black/30 md:p-5">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
              @click="backToList"
            >
              <Icon icon="lucide:arrow-left" class="h-4 w-4" />
              Kembali
            </button>

            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-green-900/60 dark:hover:bg-green-900/10 dark:hover:text-green-300"
                @click="copyLink"
              >
                <Icon icon="lucide:link" class="h-4 w-4" />
                {{ copied ? 'Tersalin' : 'Salin URL' }}
              </button>

              <button
                type="button"
                data-hs-overlay="#hs-share-modal"
                class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-green-900/60 dark:hover:bg-green-900/10 dark:hover:text-green-300"
              >
                <Icon icon="lucide:share-2" class="h-4 w-4" />
                Bagikan
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="!current && !isInitialLoading"
          class="mt-6 rounded-[30px] border border-dashed border-gray-300 bg-white/90 p-10 text-center shadow-sm backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/80"
        >
          <div class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300">
            <Icon icon="lucide:newspaper" class="h-7 w-7" />
          </div>

          <p class="mt-4 text-sm text-gray-600 dark:text-neutral-300">
            {{ cfg.texts.notFound }}
          </p>

          <button
            type="button"
            class="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
            @click="backToList"
          >
            <Icon icon="lucide:arrow-left" class="h-4 w-4" />
            Kembali ke Daftar
          </button>
        </div>

        <div v-if="isInitialLoading" class="mt-6 overflow-hidden rounded-[30px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
          <div class="h-8 w-3/4 animate-pulse rounded bg-gray-200/80 dark:bg-neutral-800"></div>
          <div class="mt-4 h-4 w-1/2 animate-pulse rounded bg-gray-200/80 dark:bg-neutral-800"></div>
          <div class="mt-6 h-72 animate-pulse rounded-[24px] bg-gray-200/80 dark:bg-neutral-800"></div>
          <div class="mt-6 h-40 animate-pulse rounded bg-gray-200/80 dark:bg-neutral-800"></div>
        </div>

        <article
          v-else-if="current"
          class="mt-6 overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
        >
          <header class="p-5 sm:p-8">
            <div class="flex flex-wrap items-center gap-2">
              <span
                v-if="current.category"
                class="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 ring-1 ring-green-100 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-900/40"
              >
                <Icon icon="lucide:bookmark" class="h-3.5 w-3.5" />
                {{ current.category }}
              </span>

              <span
                v-if="(current as any).segment"
                class="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-xs font-bold text-gray-700 ring-1 ring-gray-100 dark:bg-neutral-800 dark:text-neutral-200 dark:ring-neutral-700"
              >
                <Icon icon="lucide:graduation-cap" class="h-3.5 w-3.5" />
                {{ (current as any).segment }}
              </span>
            </div>

            <h1 class="mt-4 text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              {{ current.title }}
            </h1>

            <p
              v-if="current.excerpt"
              class="mt-4 max-w-3xl text-base leading-8 text-gray-600 dark:text-neutral-300"
            >
              {{ current.excerpt }}
            </p>

            <div class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-neutral-400">
              <span class="inline-flex items-center gap-1.5">
                <Icon icon="lucide:calendar-days" class="h-4 w-4" />
                {{ formatDate(current.publishedAt) }}
              </span>

              <span class="inline-flex items-center gap-1.5">
                <Icon icon="lucide:clock-3" class="h-4 w-4" />
                {{ current.readTime || 1 }} min read
              </span>

              <span v-if="current.tags?.length" class="inline-flex flex-wrap items-center gap-1.5">
                <Icon icon="lucide:hash" class="h-4 w-4" />
                <span
                  v-for="tag in current.tags"
                  :key="tag"
                  class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-neutral-800 dark:text-neutral-300"
                >
                  {{ tag }}
                </span>
              </span>
            </div>
          </header>

          <div v-if="current.cover" class="px-5 sm:px-8">
            <img
              v-if="!isBrokenNewsImage(current.cover)"
              :src="current.cover"
              :alt="current.title"
              class="w-full rounded-[24px] border border-gray-200 object-cover shadow-sm dark:border-neutral-800"
              @error="markBrokenNewsImage(current.cover)"
            >

            <div
              v-else
              class="grid min-h-72 w-full place-items-center rounded-[24px] border border-gray-200 bg-gradient-to-br from-green-50 to-lime-50 p-6 text-center dark:border-neutral-800 dark:from-neutral-800 dark:to-neutral-900"
            >
              <div>
                <div class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white text-green-600 shadow-sm dark:bg-neutral-950 dark:text-green-300">
                  <Icon icon="lucide:image-off" class="h-7 w-7" />
                </div>
                <p class="mt-4 text-base font-black text-gray-950 dark:text-white">Invalid image url</p>
                <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Cover berita tidak dapat dimuat.</p>
              </div>
            </div>
          </div>

          <div class="p-5 sm:p-8">
            <div
              class="news-tiptap-content"
              v-html="renderedDetailHtml"
            />

            <div
              v-if="relatedArticles.length"
              class="mt-12 border-t border-gray-200 pt-8 dark:border-neutral-800"
            >
              <div class="flex items-end justify-between gap-4">
                <div>
                  <p class="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 ring-1 ring-green-100 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-900/40">
                    <Icon icon="lucide:sparkles" class="h-3.5 w-3.5" />
                    Rekomendasi
                  </p>

                  <h3 class="mt-3 text-xl font-black tracking-tight text-gray-900 dark:text-white">
                    Yang Mungkin Menarik
                  </h3>

                  <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                    Dipilih berdasarkan kategori, tags, segment, dan kemiripan judul.
                  </p>
                </div>
              </div>

              <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <article
                  v-for="article in relatedArticles"
                  :key="article.id"
                  class="group cursor-pointer overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-green-950/10 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-green-900/50"
                  @click="openDetail(article.slug)"
                >
                  <div class="relative aspect-[16/11] overflow-hidden bg-gray-100 dark:bg-neutral-800">
                    <img
                      v-if="article.cover && !isBrokenNewsImage(article.cover)"
                      :src="article.cover"
                      :alt="article.title"
                      class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                      @error="markBrokenNewsImage(article.cover)"
                    >

                    <div
                      v-else
                      class="grid h-full place-items-center bg-gradient-to-br from-green-50 to-lime-50 p-6 text-center dark:from-neutral-800 dark:to-neutral-900"
                    >
                      <div>
                        <div class="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-green-600 shadow-sm dark:bg-neutral-950 dark:text-green-300">
                          <Icon icon="lucide:image-off" class="h-5 w-5" />
                        </div>
                        <p class="mt-3 text-xs font-black text-gray-950 dark:text-white">Invalid image url</p>
                      </div>
                    </div>

                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80"></div>

                    <span
                      v-if="article.category"
                      class="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur"
                    >
                      {{ article.category }}
                    </span>

                    <div class="absolute inset-x-0 bottom-0 p-4">
                      <h4 class="line-clamp-2 text-sm font-black leading-6 text-white">
                        {{ article.title }}
                      </h4>
                    </div>
                  </div>

                  <div class="p-4">
                    <div class="flex flex-wrap items-center gap-2 text-[12px] text-gray-500 dark:text-neutral-400">
                      <span>{{ formatDate(article.publishedAt) }}</span>
                      <span>•</span>
                      <span>{{ article.readTime || 1 }} min read</span>
                    </div>

                    <p class="mt-2 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-neutral-300">
                      {{ article.excerpt || 'Baca artikel selengkapnya.' }}
                    </p>

                    <div v-if="article.tags?.length" class="mt-3 flex flex-wrap gap-1.5">
                      <span
                        v-for="tag in article.tags.slice(0, 3)"
                        :key="tag"
                        class="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-300"
                      >
                        #{{ tag }}
                      </span>
                    </div>
                  </div>
                </article>
              </div>
            </div>

            <div class="mt-10 border-t border-gray-200 pt-6 dark:border-neutral-800">
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                @click="backToList"
              >
                <Icon icon="lucide:arrow-left" class="h-4 w-4" />
                Kembali ke Daftar
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- List -->
      <div v-else>
        <!-- Floating Filter Panel -->
        <section class="-mt-16 rounded-[30px] border border-white/80 bg-white/90 p-4 shadow-2xl shadow-green-950/10 backdrop-blur-2xl dark:border-neutral-800 dark:bg-neutral-900/90 dark:shadow-black/30 md:p-5">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p class="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <Icon icon="lucide:newspaper" class="h-3.5 w-3.5" />
                  {{ cfg.hero.badge }}
                </p>

                <h2 class="mt-3 text-xl font-black tracking-tight text-gray-950 dark:text-white md:text-2xl">
                  {{ cfg.hero.title }}
                </h2>

                <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                  {{ cfg.hero.subtitle }}
                </p>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-3 py-2 text-xs font-bold text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
                  <Icon icon="lucide:newspaper" class="h-4 w-4 text-green-600" />
                  {{ items.length }} berita
                </span>

                <span class="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-3 py-2 text-xs font-bold text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
                  <Icon icon="lucide:folder" class="h-4 w-4 text-green-600" />
                  {{ categories.length }} kategori
                </span>

                <span class="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-3 py-2 text-xs font-bold text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
                  <Icon icon="lucide:hash" class="h-4 w-4 text-green-600" />
                  {{ allTags.length }} tags
                </span>
              </div>
            </div>

            <!-- Filter -->
            <div class="flex flex-col gap-3 rounded-[26px] border border-gray-200 bg-gray-50/80 p-3 dark:border-neutral-800 dark:bg-neutral-950/60 lg:flex-row lg:items-center">
              <label class="relative min-w-0 flex-1">
                <Icon icon="lucide:search" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  v-model="q"
                  type="search"
                  :placeholder="cfg.texts.searchPlaceholder"
                  class="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-24 text-sm font-medium text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                >

                <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  {{ filtered.length }} hasil
                </span>
              </label>

              <label class="relative w-full lg:w-56">
                <Icon icon="lucide:folder" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <select
                  v-model="selectedCategory"
                  class="h-12 w-full appearance-none rounded-2xl border border-gray-200 bg-white pl-11 pr-10 text-sm font-bold text-gray-700 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                >
                  <option value="">Semua Kategori</option>
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>

                <Icon icon="lucide:chevron-down" class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </label>

              <label class="relative w-full lg:w-56">
                <Icon icon="lucide:hash" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <select
                  :value="firstSelectedTag"
                  class="h-12 w-full appearance-none rounded-2xl border border-gray-200 bg-white pl-11 pr-10 text-sm font-bold text-gray-700 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                  @change="onTagSelect"
                >
                  <option value="">Semua Tags</option>
                  <option v-for="tag in allTags" :key="tag" :value="tag">
                    #{{ tag }}
                  </option>
                </select>

                <Icon icon="lucide:chevron-down" class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </label>

              <label class="relative w-full lg:w-48">
                <Icon icon="lucide:arrow-up-down" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <select
                  v-model="sortBy"
                  class="h-12 w-full appearance-none rounded-2xl border border-gray-200 bg-white pl-11 pr-10 text-sm font-bold text-gray-700 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                >
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="title">Judul A-Z</option>
                </select>

                <Icon icon="lucide:chevron-down" class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </label>

              <button
                type="button"
                class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-black text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-green-900/60 dark:hover:bg-green-900/10 dark:hover:text-green-300 lg:w-auto"
                @click="resetNewsFilters"
              >
                <Icon icon="lucide:rotate-ccw" class="h-4 w-4" />
                Reset
              </button>
            </div>

            <!-- Active Filters -->
            <div
              v-if="q || selectedCategory || firstSelectedTag"
              class="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4 dark:border-neutral-800"
            >
              <span class="text-xs font-black uppercase tracking-wide text-gray-400">
                Aktif:
              </span>

              <span
                v-if="q"
                class="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 dark:bg-green-900/20 dark:text-green-300"
              >
                Search: {{ q }}
              </span>

              <span
                v-if="selectedCategory"
                class="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
              >
                {{ selectedCategory }}
              </span>

              <span
                v-if="firstSelectedTag"
                class="inline-flex items-center gap-2 rounded-full bg-lime-50 px-3 py-1.5 text-xs font-bold text-lime-700 dark:bg-lime-900/20 dark:text-lime-300"
              >
                #{{ firstSelectedTag }}
              </span>
            </div>
          </div>
        </section>

        <!-- Loading -->
        <section v-if="isInitialLoading" class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <article
            v-for="i in 8"
            :key="i"
            class="overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="h-48 animate-pulse bg-gray-200/80 dark:bg-neutral-800"></div>
            <div class="space-y-3 p-4">
              <div class="h-4 w-24 animate-pulse rounded bg-gray-200/80 dark:bg-neutral-800"></div>
              <div class="h-5 w-4/5 animate-pulse rounded bg-gray-200/80 dark:bg-neutral-800"></div>
              <div class="h-4 w-full animate-pulse rounded bg-gray-200/80 dark:bg-neutral-800"></div>
              <div class="h-4 w-3/4 animate-pulse rounded bg-gray-200/80 dark:bg-neutral-800"></div>
            </div>
          </article>
        </section>

        <!-- Empty -->
        <section
          v-else-if="filtered.length === 0"
          class="mt-6 rounded-[30px] border border-dashed border-gray-300 bg-white/90 p-10 text-center shadow-sm backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/80"
        >
          <div class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300">
            <Icon icon="lucide:newspaper" class="h-7 w-7" />
          </div>

          <h3 class="mt-4 text-lg font-black text-gray-950 dark:text-white">
            Berita tidak ditemukan
          </h3>

          <p class="mt-2 text-sm text-gray-500 dark:text-neutral-400">
            {{ cfg.texts.emptyList }}
          </p>
        </section>

        <!-- News Cards -->
        <section v-else class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <article
            v-for="article in paged"
            :key="article.slug"
            class="group overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-green-950/10 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-green-900/50"
          >
            <button
              type="button"
              class="relative block aspect-[16/11] w-full overflow-hidden bg-gray-100 text-left dark:bg-neutral-800"
              @click="openDetail(article.slug)"
            >
              <img
                v-if="article.cover && !isBrokenNewsImage(article.cover)"
                :src="article.cover"
                :alt="article.title || 'News cover'"
                loading="lazy"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                @error="markBrokenNewsImage(article.cover)"
              >

              <div
                v-else
                class="grid h-full place-items-center bg-gradient-to-br from-green-50 to-lime-50 p-6 text-center dark:from-neutral-800 dark:to-neutral-900"
              >
                <div>
                  <div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-green-600 shadow-sm dark:bg-neutral-950 dark:text-green-300">
                    <Icon icon="lucide:image-off" class="h-6 w-6" />
                  </div>
                  <p class="mt-3 text-sm font-black text-gray-950 dark:text-white">Invalid image url</p>
                  <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">Cover berita tidak dapat dimuat.</p>
                </div>
              </div>

              <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-85"></div>

              <div class="absolute left-3 top-3 flex flex-wrap gap-2">
                <span
                  v-if="article.category"
                  class="rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur"
                >
                  {{ article.category }}
                </span>

                <span
                  v-if="(article as any).segment"
                  class="rounded-full bg-green-600/85 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur"
                >
                  {{ (article as any).segment }}
                </span>
              </div>

              <div class="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-2xl bg-white/90 text-gray-800 opacity-0 shadow-sm backdrop-blur transition duration-300 group-hover:opacity-100 dark:bg-neutral-950/90 dark:text-white">
                <Icon icon="lucide:arrow-up-right" class="h-4 w-4" />
              </div>

              <div class="absolute inset-x-0 bottom-0 p-4">
                <h3 class="line-clamp-2 text-base font-black text-white">
                  {{ article.title || 'Tanpa judul' }}
                </h3>

                <div v-if="article.tags?.length" class="mt-2 flex flex-wrap gap-1.5">
                  <span
                    v-for="tag in article.tags.slice(0, 3)"
                    :key="tag"
                    class="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold text-white ring-1 ring-white/20 backdrop-blur"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>
            </button>

            <div class="space-y-3 p-4">
              <div class="flex items-center justify-between gap-3 text-[12px] text-gray-500 dark:text-neutral-400">
                <span class="inline-flex min-w-0 items-center gap-1">
                  <Icon icon="lucide:calendar-days" class="h-3.5 w-3.5 shrink-0" />
                  <span class="truncate">{{ formatDate(article.publishedAt) }}</span>
                </span>

                <span class="inline-flex items-center gap-1">
                  <Icon icon="lucide:clock-3" class="h-3.5 w-3.5" />
                  {{ article.readTime || 1 }} min
                </span>
              </div>

              <p class="line-clamp-2 text-sm text-gray-600 dark:text-neutral-300">
                {{ article.excerpt || 'Baca artikel selengkapnya.' }}
              </p>

              <button
                type="button"
                class="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-bold text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-green-900/60 dark:hover:bg-green-900/10 dark:hover:text-green-300"
                @click="openDetail(article.slug)"
              >
                <Icon icon="lucide:book-open" class="h-4 w-4" />
                Baca Berita
              </button>
            </div>
          </article>
        </section>

        <!-- Load More -->
        <div v-if="hasMore && !isInitialLoading" class="mt-8 text-center">
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
            @click="loadMore"
          >
            <Icon icon="lucide:arrow-down-circle" class="h-4 w-4" />
            {{ cfg.texts.loadMore }}
          </button>
        </div>
      </div>

      <!-- Share Modal -->
      <div
        id="hs-share-modal"
        class="hs-overlay pointer-events-none fixed inset-0 z-[80] hidden overflow-y-auto [--overlay-backdrop:rgba(15,23,42,.65)]"
        role="dialog"
        aria-labelledby="hs-share-modal-label"
        aria-modal="true"
      >
        <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-300 mx-auto mt-0 flex min-h-[calc(100%-3.5rem)] w-full items-center p-4 opacity-0 transition-all sm:max-w-lg">
          <div class="pointer-events-auto w-full overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div class="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-green-600 via-green-600 to-lime-500 p-5 text-white dark:border-neutral-800">
              <div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-3xl"></div>
              <div class="absolute -bottom-12 left-6 h-28 w-28 rounded-full bg-lime-200/30 blur-3xl"></div>

              <div class="relative flex items-start justify-between gap-4">
                <div>
                  <div class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold ring-1 ring-white/20 backdrop-blur">
                    <Icon icon="lucide:share-2" class="h-3.5 w-3.5" />
                    Bagikan Artikel
                  </div>

                  <h3 id="hs-share-modal-label" class="mt-3 text-xl font-black tracking-tight">
                    Sebarkan kabar baik ini
                  </h3>

                  <p class="mt-1 line-clamp-2 text-sm text-green-50">
                    {{ shareText }}
                  </p>
                </div>

                <button
                  type="button"
                  class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20 transition hover:bg-white/25"
                  data-hs-overlay="#hs-share-modal"
                  aria-label="Tutup"
                >
                  <Icon icon="lucide:x" class="h-5 w-5" />
                </button>
              </div>
            </div>

            <div class="space-y-5 p-5">
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  class="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-green-900/50 dark:hover:bg-green-900/10"
                  @click="nativeShare"
                >
                  <span class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                    <Icon icon="lucide:smartphone" class="h-5 w-5" />
                  </span>
                  <span class="min-w-0">
                    <span class="block text-sm font-bold text-gray-900 dark:text-white">Sistem</span>
                    <span class="block text-xs text-gray-500 dark:text-neutral-400">Native share</span>
                  </span>
                </button>

                <a
                  :href="whatsappHref"
                  target="_blank"
                  rel="noopener"
                  class="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-green-900/50 dark:hover:bg-green-900/10"
                >
                  <span class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-green-600 text-white">
                    <Icon icon="mdi:whatsapp" class="h-5 w-5" />
                  </span>
                  <span class="min-w-0">
                    <span class="block text-sm font-bold text-gray-900 dark:text-white">WhatsApp</span>
                    <span class="block text-xs text-gray-500 dark:text-neutral-400">Kirim chat</span>
                  </span>
                </a>

                <a
                  :href="facebookHref"
                  target="_blank"
                  rel="noopener"
                  class="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-green-900/50 dark:hover:bg-green-900/10"
                >
                  <span class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-green-600 text-white">
                    <Icon icon="mdi:facebook" class="h-5 w-5" />
                  </span>
                  <span class="min-w-0">
                    <span class="block text-sm font-bold text-gray-900 dark:text-white">Facebook</span>
                    <span class="block text-xs text-gray-500 dark:text-neutral-400">Bagikan post</span>
                  </span>
                </a>

                <a
                  :href="twitterHref"
                  target="_blank"
                  rel="noopener"
                  class="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-green-900/50 dark:hover:bg-green-900/10"
                >
                  <span class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-black text-white">
                    <Icon icon="ri:twitter-x-fill" class="h-5 w-5" />
                  </span>
                  <span class="min-w-0">
                    <span class="block text-sm font-bold text-gray-900 dark:text-white">X</span>
                    <span class="block text-xs text-gray-500 dark:text-neutral-400">Tweet link</span>
                  </span>
                </a>
              </div>

              <div class="rounded-3xl border border-gray-200 bg-gray-50 p-3 dark:border-neutral-800 dark:bg-neutral-950">
                <label class="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                  Link Artikel
                </label>

                <div class="flex gap-2">
                  <input
                    :value="canonical"
                    readonly
                    class="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
                  >

                  <button
                    type="button"
                    class="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                    @click="copyShare"
                  >
                    <Icon icon="lucide:copy" class="h-4 w-4" />
                    {{ copied ? 'Tersalin' : 'Salin' }}
                  </button>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 text-xs text-gray-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
              <span class="inline-flex items-center gap-1.5">
                <Icon icon="lucide:lock" class="h-4 w-4" />
                Link aman untuk dibagikan
              </span>

              <button
                type="button"
                class="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 transition hover:bg-gray-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                data-hs-overlay="#hs-share-modal"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Copy Toast -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-3 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-3 opacity-0"
      >
        <div
          v-if="showCopiedToast"
          class="fixed bottom-5 right-5 z-[90] max-w-sm rounded-2xl border border-green-200 bg-white p-4 shadow-2xl shadow-green-900/10 dark:border-green-900/40 dark:bg-neutral-900"
        >
          <div class="flex items-start gap-3">
            <div class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-green-600 text-white">
              <Icon icon="lucide:check" class="h-5 w-5" />
            </div>

            <div class="min-w-0">
              <p class="text-sm font-bold text-gray-900 dark:text-white">
                Link telah tersalin
              </p>
              <p class="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                Sekarang kamu bisa membagikannya ke WhatsApp, Facebook, atau media lain.
              </p>
            </div>
          </div>
        </div>
      </Transition>

      <div
        v-if="error"
        class="mt-8 rounded-2xl border border-rose-300/60 bg-rose-50/60 p-4 text-sm text-rose-700 dark:border-rose-700 dark:bg-rose-900/30 dark:text-rose-200"
      >
        {{ error }}
      </div>
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
import { useAsyncData, useHead, useRuntimeConfig, useSeoMeta } from 'nuxt/app'
import { useNews } from '~/composables/data/useNews'
import { useWeb } from '~/composables/data/useWeb'

defineOptions({ name: 'NewsPage' })

type WebPageSnapshot = {
  meta?: {
    title?: string
    description?: string
    ogImage?: string
    twitterSite?: string
    themeColor?: string
    robots?: string
    organizationName?: string
    siteName?: string
    logo?: string
  }
  sections?: Array<{
    key?: string
    props?: any
  }>
}

const {
  pending,
  error,
  items,
  q,
  selectedCategory,
  selectedTags,
  sortBy,
  resetFilters,
  filtered,
  paged,
  hasMore,
  page,
  isDetail,
  current,
  openDetail,
  backToList,
  renderedDetailHtml,
  categories,
  allTags
} = useNews()

const brokenNewsImages = ref<Record<string, boolean>>({})

const firstSelectedTag = computed(() => {
  const value = selectedTags.value as unknown

  if (value instanceof Set) {
    return Array.from(value)[0] || ''
  }

  if (Array.isArray(value)) {
    return value[0] || ''
  }

  return ''
})

function onTagSelect(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  const selected = selectedTags.value as unknown

  if (selected instanceof Set) {
    selectedTags.value = value ? new Set([value]) : new Set()
    return
  }

  if (Array.isArray(selected)) {
    ;(selectedTags as any).value = value ? [value] : []
  }
}

function resetNewsFilters() {
  resetFilters()
  selectedCategory.value = ''
}

function markBrokenNewsImage(src?: string) {
  if (!src) return

  brokenNewsImages.value = {
    ...brokenNewsImages.value,
    [src]: true
  }
}

function isBrokenNewsImage(src?: string) {
  if (!src) return false
  return Boolean(brokenNewsImages.value[src])
}

function loadMore() {
  page.value += 1
}

function formatDate(ts: number) {
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(ts)
}

const showCopiedToast = ref(false)
let copiedToastTimer: ReturnType<typeof setTimeout> | null = null

function triggerCopiedToast() {
  showCopiedToast.value = true

  if (copiedToastTimer) clearTimeout(copiedToastTimer)

  copiedToastTimer = setTimeout(() => {
    showCopiedToast.value = false
  }, 1800)
}

const PAGE_DEFAULTS = {
  hero: {
    cover: '',
    badge: 'Kabar Terbaru',
    title: 'Berita Lembaga',
    subtitle: 'Informasi kegiatan, pengumuman, dan kabar terbaru lembaga.',
    heightSm: '36vh',
    heightLg: '44vh'
  },
  texts: {
    searchPlaceholder: 'Cari berita lembaga…',
    emptyList: 'Berita masih kosong.',
    notFound: 'Berita tidak ditemukan.',
    loadMore: 'Tampilkan Lebih Banyak'
  }
} as const

const LEGACY_NEWS_TITLES = new Set([
  'Berita Platform Pondok',
  'Berita Pondok Pesantren Alberr'
])

const LEGACY_ORGANIZATION_NAMES = new Set([
  'Pondok Pesantren Alberr'
])

function resolveSyncedText(value: unknown, fallback: string, legacySet?: Set<string>) {
  const text = String(value || '').trim()

  if (!text) return fallback
  if (legacySet?.has(text)) return fallback

  return text
}

const route = useRoute()
const runtime = useRuntimeConfig()
const NEWS_PAGE_PATH = '/news'

const web = useWeb()
function safeSnapshotKey() {
  const host =
    typeof window !== 'undefined'
      ? window.location.host
      : String(runtime.public?.siteUrl || runtime.public?.siteURL || 'default')

  return `webpage-${host.replace(/[^a-z0-9.-]/gi, '-')}-${NEWS_PAGE_PATH}`
}

const {
  data: pageSnap,
  pending: pageSnapPending,
  status: pageSnapStatus
} = useAsyncData<WebPageSnapshot | null>(
  safeSnapshotKey(),
  async () => {
    const snap = await web.getPageSnapshot(NEWS_PAGE_PATH)
    return (snap || null) as WebPageSnapshot | null
  },
  {
    server: false,
    default: () => null
  }
)

const isPageConfigLoading = computed(() => {
  return pageSnapStatus.value === 'idle' || pageSnapStatus.value === 'pending' || pageSnapPending.value
})

const isInitialLoading = computed(() => {
  return Boolean(pending.value || isPageConfigLoading.value)
})

const newsSectionProps = computed<any>(() => {
  const sections: any = pageSnap.value?.sections || []
  return sections.find((section: any) => section?.key === 'NewsPage')?.props || {}
})

const cfg = computed(() => ({
  hero: {
    cover: resolveSyncedText(newsSectionProps.value?.hero?.cover, PAGE_DEFAULTS.hero.cover),
    badge: resolveSyncedText(newsSectionProps.value?.hero?.badge, PAGE_DEFAULTS.hero.badge),
    title: resolveSyncedText(
      newsSectionProps.value?.hero?.title,
      PAGE_DEFAULTS.hero.title,
      LEGACY_NEWS_TITLES
    ),
    subtitle: resolveSyncedText(newsSectionProps.value?.hero?.subtitle, PAGE_DEFAULTS.hero.subtitle),
    heightSm: resolveSyncedText(newsSectionProps.value?.hero?.heightSm, PAGE_DEFAULTS.hero.heightSm),
    heightLg: resolveSyncedText(newsSectionProps.value?.hero?.heightLg, PAGE_DEFAULTS.hero.heightLg)
  },
  texts: {
    searchPlaceholder: resolveSyncedText(
      newsSectionProps.value?.texts?.searchPlaceholder,
      PAGE_DEFAULTS.texts.searchPlaceholder
    ),
    emptyList: resolveSyncedText(
      newsSectionProps.value?.texts?.emptyList,
      PAGE_DEFAULTS.texts.emptyList
    ),
    notFound: resolveSyncedText(
      newsSectionProps.value?.texts?.notFound,
      PAGE_DEFAULTS.texts.notFound
    ),
    loadMore: resolveSyncedText(
      newsSectionProps.value?.texts?.loadMore,
      PAGE_DEFAULTS.texts.loadMore
    )
  }
}))

const pageMeta = computed<any>(() => pageSnap.value?.meta || {})

const siteOrigin = computed(() => {
  const fromRuntime =
    runtime.public?.siteUrl ||
    runtime.public?.siteURL ||
    runtime.public?.site_url ||
    ''

  if (fromRuntime) {
    return String(fromRuntime).replace(/\/$/, '')
  }

  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return 'https://obayan.id'
})

function toAbsoluteUrl(url?: string) {
  const fallback = '/assets/logo.png'
  const raw = String(url || fallback).trim()

  if (!raw) return `${siteOrigin.value}/assets/logo.png`

  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw
  }

  return `${siteOrigin.value}${raw.startsWith('/') ? raw : `/${raw}`}`
}

function stripHtml(value?: string) {
  return String(value || '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function limitSeoText(value?: string, max = 160) {
  const clean = stripHtml(value)

  if (!clean) return ''

  return clean.length > max
    ? `${clean.slice(0, max).trim()}...`
    : clean
}

const organizationName = computed(() => {
  return resolveSyncedText(
    pageMeta.value?.organizationName ||
      pageMeta.value?.siteName,
    'Lembaga',
    LEGACY_ORGANIZATION_NAMES
  )
})

const organizationLogo = computed(() => {
  return toAbsoluteUrl(
    pageMeta.value?.logo ||
      runtime.public?.appLogo ||
      '/assets/logo.png'
  )
})

const baseTitle = computed(() => {
  return resolveSyncedText(
    pageMeta.value?.title,
    cfg.value.hero.title || 'Berita | Lembaga',
    LEGACY_NEWS_TITLES
  )
})

const baseDescription = computed(() => {
  return limitSeoText(
    pageMeta.value?.description ||
      cfg.value.hero.subtitle ||
      'Kumpulan kabar terbaru lembaga: kegiatan, pengumuman, dan informasi penting.',
    160
  )
})

const canonical = computed(() => {
  return new URL(route.fullPath || '/news', siteOrigin.value).toString()
})

const articleCategory = computed(() => {
  return current.value?.category || 'Berita'
})

const articleTags = computed(() => {
  return Array.isArray(current.value?.tags)
    ? current.value.tags.filter(Boolean)
    : []
})

const articleSegment = computed(() => {
  return (current.value as any)?.segment || ''
})

const articleAuthor = computed(() => {
  const author =
    (current.value as any)?.author ||
    (current.value as any)?.updatedBy ||
    null

  return author?.name || organizationName.value
})

const articleImage = computed(() => {
  if (isDetail.value && current.value?.cover) {
    return toAbsoluteUrl(current.value.cover)
  }

  if (pageMeta.value?.ogImage) {
    return toAbsoluteUrl(pageMeta.value.ogImage)
  }

  if (cfg.value.hero.cover) {
    return toAbsoluteUrl(cfg.value.hero.cover)
  }

  return organizationLogo.value
})

const pageTitle = computed(() => {
  if (isDetail.value && current.value?.title) {
    return `${current.value.title} | ${articleCategory.value} - ${organizationName.value}`
  }

  return baseTitle.value
})

const pageDescription = computed(() => {
  if (isDetail.value && current.value) {
    return limitSeoText(
      current.value.excerpt ||
        renderedDetailHtml.value ||
        current.value.title,
      160
    )
  }

  return baseDescription.value
})

const seoKeywords = computed(() => {
  const values = [
    articleCategory.value,
    articleSegment.value,
    ...articleTags.value,
    organizationName.value,
    'berita lembaga',
    'informasi lembaga',
    'kegiatan lembaga',
    'pengumuman lembaga',
    'prestasi lembaga'
  ]

  return values
    .filter(Boolean)
    .map((item) => String(item).trim())
    .filter(Boolean)
    .join(', ')
})

const publishedIso = computed(() => {
  if (!current.value?.publishedAt) return undefined

  return new Date(current.value.publishedAt).toISOString()
})

const modifiedIso = computed(() => {
  const modified =
    (current.value as any)?.updatedAt ||
    current.value?.publishedAt ||
    undefined

  if (!modified) return undefined

  return new Date(modified).toISOString()
})

const robotsMeta = computed(() => {
  if (isDetail.value && !current.value && !isInitialLoading.value) {
    return 'noindex, follow'
  }

  return pageMeta.value?.robots || 'index, follow'
})

const twitterSite = computed(() => {
  return pageMeta.value?.twitterSite || runtime.public?.twitterSite || undefined
})

const themeColor = computed(() => {
  return (
    pageMeta.value?.themeColor ||
    runtime.public?.appThemeColor ||
    runtime.public?.themeColor ||
    '#16a34a'
  )
})

useSeoMeta({
  title: () => pageTitle.value,
  description: () => pageDescription.value,

  ogTitle: () => pageTitle.value,
  ogDescription: () => pageDescription.value,
  ogType: () => (isDetail.value && current.value ? 'article' : 'website'),
  ogUrl: () => canonical.value,
  ogImage: () => articleImage.value,
  ogImageAlt: () => current.value?.title || organizationName.value,
  ogSiteName: () => organizationName.value,
  ogLocale: 'id_ID',

  twitterCard: 'summary_large_image',
  twitterSite: () => twitterSite.value,
  twitterTitle: () => pageTitle.value,
  twitterDescription: () => pageDescription.value,
  twitterImage: () => articleImage.value,
  twitterImageAlt: () => current.value?.title || organizationName.value,

  robots: () => robotsMeta.value,
  keywords: () => seoKeywords.value,
  themeColor: () => themeColor.value
})

useHead(() => {
  const isArticle = Boolean(isDetail.value && current.value)

  const articleMeta = isArticle
    ? [
        {
          property: 'article:section',
          content: articleCategory.value
        },
        ...(publishedIso.value
          ? [
              {
                property: 'article:published_time',
                content: publishedIso.value
              }
            ]
          : []),
        ...(modifiedIso.value
          ? [
              {
                property: 'article:modified_time',
                content: modifiedIso.value
              }
            ]
          : []),
        {
          property: 'article:author',
          content: articleAuthor.value
        },
        ...articleTags.value.map((tag) => ({
          property: 'article:tag',
          content: tag
        }))
      ]
    : []

  const jsonLd = isArticle
    ? {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: current.value?.title,
        description: pageDescription.value,
        image: [articleImage.value],
        datePublished: publishedIso.value,
        dateModified: modifiedIso.value || publishedIso.value,
        author: {
          '@type': 'Person',
          name: articleAuthor.value
        },
        publisher: {
          '@type': 'Organization',
          name: organizationName.value,
          logo: {
            '@type': 'ImageObject',
            url: organizationLogo.value
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonical.value
        },
        articleSection: articleCategory.value,
        keywords: seoKeywords.value
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: pageTitle.value,
        description: pageDescription.value,
        url: canonical.value,
        image: articleImage.value,
        publisher: {
          '@type': 'Organization',
          name: organizationName.value,
          logo: {
            '@type': 'ImageObject',
            url: organizationLogo.value
          }
        }
      }

  return {
    link: [
      {
        rel: 'canonical',
        href: canonical.value
      }
    ],

    meta: [
      {
        name: 'thumbnail',
        content: articleImage.value
      },
      {
        name: 'author',
        content: articleAuthor.value
      },
      {
        name: 'news_keywords',
        content: seoKeywords.value
      },
      ...articleMeta
    ],

    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(jsonLd)
      }
    ]
  }
})

onMounted(async () => {
  const { HSStaticMethods } = await import('preline')
  HSStaticMethods?.autoInit?.()
})

async function copyToClipboard(text: string) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {}

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'

    document.body.appendChild(textarea)
    textarea.select()

    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)

    return ok
  } catch {
    return false
  }
}

const shareText = computed(() => {
  return current.value?.title && isDetail.value
    ? current.value.title
    : `Berita ${organizationName.value}`
})

const encodedUrl = computed(() => encodeURIComponent(canonical.value))
const encodedText = computed(() => encodeURIComponent(`${shareText.value} – ${canonical.value}`))

const facebookHref = computed(() => {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl.value}`
})

const twitterHref = computed(() => {
  return `https://twitter.com/intent/tweet?url=${encodedUrl.value}&text=${encodeURIComponent(shareText.value)}`
})

const whatsappHref = computed(() => {
  return `https://wa.me/?text=${encodedText.value}`
})

function normalizeSearchText(value: string) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getTitleTokens(value: string) {
  const stopWords = new Set([
    'yang',
    'dan',
    'di',
    'ke',
    'dari',
    'untuk',
    'dengan',
    'pada',
    'dalam',
    'the',
    'and',
    'for',
    'with',
    'from',
    'about'
  ])

  return normalizeSearchText(value)
    .split(' ')
    .map((item) => item.trim())
    .filter((item) => item.length >= 4 && !stopWords.has(item))
}

const relatedArticles = computed(() => {
  const active = current.value
  if (!active) return []

  const activeTags = new Set(active.tags || [])
  const activeTitleTokens = new Set(getTitleTokens(active.title))
  const activeSegment = (active as any).segment || 'Umum'

  return items.value
    .filter((item) => item.id !== active.id)
    .map((item) => {
      let score = 0

      const itemTags = item.tags || []
      const itemSegment = (item as any).segment || 'Umum'
      const itemTitleTokens = getTitleTokens(item.title)

      if (item.category && active.category && item.category === active.category) {
        score += 40
      }

      if (itemSegment && activeSegment && itemSegment === activeSegment) {
        score += 25
      }

      for (const tag of itemTags) {
        if (activeTags.has(tag)) score += 12
      }

      for (const token of itemTitleTokens) {
        if (activeTitleTokens.has(token)) score += 8
      }

      if (item.publishedAt) {
        const daysDiff = Math.abs(Date.now() - item.publishedAt) / (1000 * 60 * 60 * 24)

        if (daysDiff <= 30) score += 8
        else if (daysDiff <= 90) score += 4
      }

      return {
        item,
        score
      }
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return (b.item.publishedAt || 0) - (a.item.publishedAt || 0)
    })
    .slice(0, 3)
    .map((entry) => entry.item)
})

const copied = ref(false)

async function copyLink() {
  const ok = await copyToClipboard(canonical.value)
  copied.value = ok

  if (ok) {
    triggerCopiedToast()
    setTimeout(() => {
      copied.value = false
    }, 1200)
  }
}

async function copyShare() {
  await copyLink()
}

async function nativeShare() {
  const url = canonical.value

  try {
    if (navigator.share) {
      await navigator.share({
        title: shareText.value,
        text: shareText.value,
        url
      })
      return
    }
  } catch {}

  const windowRef = window.open(twitterHref.value, '_blank', 'noopener,noreferrer')

  if (!windowRef) {
    await copyLink()
  }
}
</script>

<style scoped>
.heroH {
  height: var(--hero-sm);
}

@media (min-width: 640px) {
  .heroH {
    height: var(--hero-lg);
  }
}

.news-tiptap-content {
  color: rgb(31 41 55);
  font-size: 1rem;
  line-height: 1.85;
}

.news-tiptap-content :deep(p) {
  margin: 0.85rem 0;
}

.news-tiptap-content :deep(h1) {
  margin: 2rem 0 1rem;
  font-size: 2rem;
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -0.035em;
  color: rgb(17 24 39);
}

.news-tiptap-content :deep(h2) {
  margin: 1.75rem 0 0.875rem;
  font-size: 1.5rem;
  line-height: 1.3;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: rgb(17 24 39);
}

.news-tiptap-content :deep(h3) {
  margin: 1.5rem 0 0.75rem;
  font-size: 1.25rem;
  line-height: 1.35;
  font-weight: 700;
  color: rgb(17 24 39);
}

.news-tiptap-content :deep(strong) {
  font-weight: 800;
}

.news-tiptap-content :deep(em) {
  font-style: italic;
}

.news-tiptap-content :deep(ul) {
  margin: 0.85rem 0;
  padding-left: 1.5rem;
  list-style-type: disc;
}

.news-tiptap-content :deep(ol) {
  margin: 0.85rem 0;
  padding-left: 1.5rem;
  list-style-type: decimal;
}

.news-tiptap-content :deep(li) {
  margin: 0.35rem 0;
  padding-left: 0.25rem;
}

.news-tiptap-content :deep(blockquote) {
  margin: 1.25rem 0;
  border-left: 4px solid rgb(34 197 94);
  border-radius: 0.875rem;
  background: rgb(240 253 244);
  padding: 0.875rem 1rem;
  color: rgb(55 65 81);
}

.news-tiptap-content :deep(table),
.news-tiptap-content :deep(.editor-table) {
  width: 100%;
  margin: 1.25rem 0;
  border-collapse: collapse;
  table-layout: fixed;
  overflow: hidden;
  border-radius: 1rem;
}

.news-tiptap-content :deep(th),
.news-tiptap-content :deep(td) {
  border: 1px solid rgb(229 231 235);
  padding: 0.75rem;
  vertical-align: top;
}

.news-tiptap-content :deep(th) {
  background: rgb(249 250 251);
  font-weight: 800;
}

.news-tiptap-content :deep(iframe[src*='youtube']),
.news-tiptap-content :deep(iframe[src*='youtu.be']) {
  width: 100%;
  aspect-ratio: 16 / 9;
  height: auto;
  margin: 1.25rem 0;
  border: 0;
  border-radius: 1rem;
}

.news-tiptap-content :deep(.pdf-embed) {
  margin: 1.25rem 0;
  overflow: hidden;
  border: 1px solid rgb(229 231 235);
  border-radius: 1rem;
  background: rgb(249 250 251);
}

.news-tiptap-content :deep(.pdf-embed-title) {
  border-bottom: 1px solid rgb(229 231 235);
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 800;
  color: rgb(55 65 81);
}

.news-tiptap-content :deep(.pdf-embed-frame) {
  width: 100%;
  height: 420px;
  border: 0;
  background: white;
}

.dark .news-tiptap-content {
  color: rgb(245 245 245);
}

.dark .news-tiptap-content :deep(h1),
.dark .news-tiptap-content :deep(h2),
.dark .news-tiptap-content :deep(h3) {
  color: white;
}

.dark .news-tiptap-content :deep(blockquote) {
  background: rgba(22, 163, 74, 0.12);
  color: rgb(229 229 229);
}

.dark .news-tiptap-content :deep(th) {
  background: rgb(38 38 38);
}

.dark .news-tiptap-content :deep(th),
.dark .news-tiptap-content :deep(td) {
  border-color: rgb(64 64 64);
}

.dark .news-tiptap-content :deep(.pdf-embed) {
  border-color: rgb(64 64 64);
  background: rgb(23 23 23);
}

.dark .news-tiptap-content :deep(.pdf-embed-title) {
  border-color: rgb(64 64 64);
  color: rgb(229 229 229);
}

.news-tiptap-content :deep(a),
.news-tiptap-content :deep(.news-content-link) {
  color: rgb(22 163 74);
  font-weight: 700;
  text-decoration-line: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.news-tiptap-content :deep(a:hover),
.news-tiptap-content :deep(.news-content-link:hover) {
  color: rgb(21 128 61);
  background: rgb(240 253 244);
  border-radius: 0.375rem;
}

.news-tiptap-content :deep(.editor-image),
.news-tiptap-content :deep(img) {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 1.5rem auto;
  border-radius: 1.25rem;
  border: 1px solid rgb(229 231 235);
  object-fit: cover;
  box-shadow: 0 18px 50px -24px rgba(15, 23, 42, 0.35);
}

.news-tiptap-content :deep(.youtube-embed),
.news-tiptap-content :deep(iframe[src*='youtube']),
.news-tiptap-content :deep(iframe[src*='youtu.be']) {
  width: 100%;
  aspect-ratio: 16 / 9;
  height: auto;
  margin: 1.5rem 0;
  border: 0;
  border-radius: 1.25rem;
  overflow: hidden;
  background: rgb(15 23 42);
  box-shadow: 0 18px 50px -24px rgba(15, 23, 42, 0.45);
}

.news-tiptap-content :deep(.pdf-embed),
.news-tiptap-content :deep(.map-embed) {
  margin: 1.5rem 0;
  overflow: hidden;
  border: 1px solid rgb(229 231 235);
  border-radius: 1.25rem;
  background: rgb(249 250 251);
  box-shadow: 0 18px 50px -28px rgba(15, 23, 42, 0.28);
}

.news-tiptap-content :deep(.pdf-embed-title),
.news-tiptap-content :deep(.map-embed-title) {
  border-bottom: 1px solid rgb(229 231 235);
  background: linear-gradient(135deg, rgb(240 253 244), rgb(255 255 255));
  padding: 0.85rem 1rem;
  font-size: 0.875rem;
  font-weight: 800;
  color: rgb(31 41 55);
}

.news-tiptap-content :deep(.pdf-embed-frame),
.news-tiptap-content :deep(.map-embed-frame) {
  width: 100%;
  height: 420px;
  border: 0;
  background: white;
}

.news-tiptap-content :deep(.map-embed-frame) {
  min-height: 360px;
}

@media (max-width: 640px) {
  .news-tiptap-content :deep(.pdf-embed-frame),
  .news-tiptap-content :deep(.map-embed-frame) {
    height: 320px;
  }

  .news-tiptap-content :deep(.editor-image),
  .news-tiptap-content :deep(img) {
    border-radius: 1rem;
  }
}

.dark .news-tiptap-content :deep(a),
.dark .news-tiptap-content :deep(.news-content-link) {
  color: rgb(134 239 172);
}

.dark .news-tiptap-content :deep(a:hover),
.dark .news-tiptap-content :deep(.news-content-link:hover) {
  color: rgb(187 247 208);
  background: rgba(22, 163, 74, 0.16);
}

.dark .news-tiptap-content :deep(.editor-image),
.dark .news-tiptap-content :deep(img) {
  border-color: rgb(64 64 64);
  box-shadow: 0 18px 50px -28px rgba(0, 0, 0, 0.6);
}

.dark .news-tiptap-content :deep(.pdf-embed),
.dark .news-tiptap-content :deep(.map-embed) {
  border-color: rgb(64 64 64);
  background: rgb(23 23 23);
  box-shadow: 0 18px 50px -28px rgba(0, 0, 0, 0.65);
}

.dark .news-tiptap-content :deep(.pdf-embed-title),
.dark .news-tiptap-content :deep(.map-embed-title) {
  border-color: rgb(64 64 64);
  background: linear-gradient(135deg, rgba(22, 163, 74, 0.16), rgb(23 23 23));
  color: rgb(245 245 245);
}

.dark .news-tiptap-content :deep(.pdf-embed-frame),
.dark .news-tiptap-content :deep(.map-embed-frame) {
  background: rgb(10 10 10);
}
</style>