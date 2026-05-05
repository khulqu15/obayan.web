<template>
  <section id="news" class="relative overflow-hidden dark:bg-neutral-900 bg-gray-100">
    <!-- Subtle BG grid + blobs -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div class="absolute top-10 -left-24 w-[42rem] h-[42rem] rounded-full opacity-40 blur-3xl
                  bg-gradient-to-br from-green-200 to-green-200 dark:from-green-900/40 dark:to-green-900/30" />
      <div class="absolute bottom-10 -right-24 w-[36rem] h-[36rem] rounded-full opacity-30 blur-3xl
                  bg-gradient-to-tr from-green-100 to-green-100 dark:from-green-900/30 dark:to-green-900/30" />
      <div class="absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent_80%)]">
        <div class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,0,0,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,.06)_1px,transparent_1px)] bg-[size:32px_32px]
                    dark:bg-[linear-gradient(to_right,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.06)_1px,transparent_1px)]" />
      </div>
    </div>

    <!-- HERO -->
    <div class="relative">
      <div class="absolute inset-0">
        <img :src="cfg.hero.cover" class="w-full heroH object-cover opacity-80"
             :style="{'--hero-sm': cfg.hero.heightSm, '--hero-lg': cfg.hero.heightLg}" alt="Cover News">
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
      </div>
      <div class="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 heroH flex items-end"
           :style="{'--hero-sm': cfg.hero.heightSm, '--hero-lg': cfg.hero.heightLg}">
        <div class="mb-10">
          <p class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-green-200">
            <span class="inline-block size-2 rounded-full bg-green-400" /> {{ cfg.hero.badge }}
          </p>
          <h1 class="mt-1 text-3xl sm:text-5xl font-bold text-white">{{ cfg.hero.title }}</h1>
          <p class="mt-2 text-green-100">{{ cfg.hero.subtitle }}</p>
        </div>
      </div>
    </div>

    <!-- BODY -->
    <div class="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
      <!-- DETAIL -->
      <div v-if="isDetail" class="max-w-5xl mx-auto">
        <div class="flex items-center justify-between">
          <button @click="backToList" class="inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-3 py-1.5 text-sm hover:bg-green-700">
            <Icon icon="ph:arrow-left" class="size-4" /> Kembali
          </button>

          <div class="flex items-center gap-2">
            <button @click="copyLink" class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 px-3 py-1.5 text-sm text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-700">
              <Icon icon="ph:link" class="size-4" /> {{ copied ? 'Tersalin' : 'Salin URL' }}
            </button>
            <button type="button"
                data-hs-overlay="#hs-share-modal"
                class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 px-3 py-1.5 text-sm text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-700">
              <Icon icon="ph:share-network" class="size-4" /> Bagikan
            </button>
          </div>
        </div>

        <div v-if="!current && !pending" class="mt-8 rounded-2xl border border-dashed border-gray-300 dark:border-neutral-700 p-10 text-center">
          <p class="text-gray-600 dark:text-neutral-300">{{ cfg.texts.notFound }}</p>
          <button @click="backToList" class="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-4 py-2 text-sm hover:bg-green-700">
            <Icon icon="ph:arrow-left" class="size-4" /> Kembali ke Daftar
          </button>
        </div>

        <div v-if="pending" class="mt-6 space-y-3">
          <div class="h-8 w-3/4 bg-gray-200/70 dark:bg-neutral-700 rounded animate-pulse" />
          <div class="h-4 w-1/2 bg-gray-200/70 dark:bg-neutral-700 rounded animate-pulse" />
          <div class="h-72 bg-gray-200/70 dark:bg-neutral-700 rounded-xl animate-pulse" />
          <div class="h-40 bg-gray-200/70 dark:bg-neutral-700 rounded animate-pulse" />
        </div>

        <article
          v-else-if="current"
          class="mt-6 overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
        >
          <!-- Article Header -->
          <header class="p-5 sm:p-8">
            <div class="flex flex-wrap items-center gap-2">
              <span
                v-if="current.category"
                class="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 ring-1 ring-green-100 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-900/40"
              >
                <Icon icon="ph:bookmark-simple" class="size-3.5" />
                {{ current.category }}
              </span>

              <span
                v-if="(current).segment"
                class="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-xs font-bold text-gray-700 ring-1 ring-gray-100 dark:bg-neutral-800 dark:text-neutral-200 dark:ring-neutral-700"
              >
                <Icon icon="ph:student" class="size-3.5" />
                {{ current.segment }}
              </span>
            </div>

            <h1 class="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              {{ current.title }}
            </h1>

            <p
              v-if="current.excerpt"
              class="mt-4 max-w-2xl text-base leading-8 text-gray-600 dark:text-neutral-300"
            >
              {{ current.excerpt }}
            </p>

            <div class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-neutral-400">
              <span class="inline-flex items-center gap-1.5">
                <Icon icon="ph:calendar" class="size-4" />
                {{ formatDate(current.publishedAt) }}
              </span>

              <span class="inline-flex items-center gap-1.5">
                <Icon icon="ph:clock" class="size-4" />
                {{ current.readTime }} min read
              </span>

              <span v-if="current.tags?.length" class="inline-flex flex-wrap items-center gap-1.5">
                <Icon icon="ph:hash" class="size-4" />
                <span
                  v-for="t in current.tags"
                  :key="t"
                  class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-neutral-800 dark:text-neutral-300"
              >
                  {{ t }}
                </span>
              </span>
            </div>
          </header>

          <!-- Cover -->
          <div v-if="current.cover" class="px-5 sm:px-8">
            <img
              :src="current.cover"
              :alt="current.title"
              class="w-full rounded-[24px] border border-gray-200 object-cover shadow-sm dark:border-neutral-800"
            />
          </div>

          <!-- Tiptap Rendered Content -->
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
                    <Icon icon="ph:sparkle" class="size-3.5" />
                    Rekomendasi
                  </p>

                  <h3 class="mt-3 text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
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
                  @click="openDetail(article.slug)"
                  class="group cursor-pointer overflow-hidden rounded-[22px] border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-green-900/50"
                >
                  <div class="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-neutral-800">
                    <img
                      v-if="article.cover"
                      :src="article.cover"
                      :alt="article.title"
                      class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    />

                    <div
                      v-else
                      class="grid h-full place-items-center text-3xl"
                    >
                      📰
                    </div>

                    <span
                      v-if="article.category"
                      class="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur"
                    >
                      {{ article.category }}
                    </span>
                  </div>

                  <div class="p-4">
                    <div class="flex flex-wrap items-center gap-2 text-[12px] text-gray-500 dark:text-neutral-400">
                      <span>{{ formatDate(article.publishedAt) }}</span>
                      <span>•</span>
                      <span>{{ article.readTime || 1 }} min read</span>
                    </div>

                    <h4 class="mt-2 line-clamp-2 text-sm font-extrabold leading-6 text-gray-900 transition group-hover:text-green-700 dark:text-white dark:group-hover:text-green-300">
                      {{ article.title }}
                    </h4>

                    <p class="mt-2 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-neutral-300">
                      {{ article.excerpt || 'Baca artikel selengkapnya.' }}
                    </p>

                    <div
                      v-if="article.tags?.length"
                      class="mt-3 flex flex-wrap gap-1.5"
                    >
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
                @click="backToList"
                class="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
              >
                <Icon icon="ph:arrow-left" class="size-4" />
                Kembali ke Daftar
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- LIST -->
      <div v-else>
        <div class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-4">
          <div class="flex flex-wrap flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div class="flex-1 flex items-center gap-2">
              <label class="relative flex-1">
                <input v-model="q" type="text" :placeholder="cfg.texts.searchPlaceholder"
                       class="w-full rounded-lg border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-100 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-green-600">
                <span class="absolute right-3 top-2.5 text-gray-400 text-xs">{{ filtered.length }} hasil</span>
              </label>

              <div>
                <select v-model="selectedCategory" class="block w-52 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-3 py-2 text-sm text-gray-700 dark:text-neutral-200 focus:ring-green-500">
                  <option value="">Semua Kategori</option>
                  <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>

              <div class="hidden sm:block">
                <select v-model="sortBy"
                        class="rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/90 text-gray-800 dark:text-neutral-100 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-hidden">
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="title">Judul (A–Z)</option>
                </select>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <button v-for="t in allTags.splice(0, 5)" :key="t" @click="toggleTag(t)"
                      class="text-[12px] px-2.5 py-1.5 rounded-full border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-100"
                      :class="selectedTags.toString().includes(t) ? 'bg-green-600 text-white border-green-600' : 'bg-white/80 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300'">
                #{{ t }}
              </button>
              <button @click="resetFilters" class="text-[12px] px-2.5 py-1.5 rounded-full border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-100 hover:bg-gray-50 dark:hover:bg-neutral-800">
                Reset
              </button>
            </div>
          </div>
        </div>

        <div class="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <template v-if="pending">
            <div v-for="i in 6" :key="i" class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 p-3">
              <div class="h-40 bg-gray-200/70 dark:bg-neutral-700 rounded-xl animate-pulse" />
              <div class="mt-3 h-4 w-32 bg-gray-200/70 dark:bg-neutral-700 rounded animate-pulse" />
              <div class="mt-2 h-6 w-3/4 bg-gray-200/70 dark:bg-neutral-700 rounded animate-pulse" />
              <div class="mt-2 h-4 w-5/6 bg-gray-200/70 dark:bg-neutral-700 rounded animate-pulse" />
            </div>
          </template>

          <template v-else>
            <article v-for="a in paged" :key="a.slug"
                     @click="openDetail(a.slug)"
                     class="group relative cursor-pointer rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 hover:shadow transition">
              <div class="relative h-44 overflow-hidden">
                <img :src="a.cover" :alt="a.title" class="w-full h-full object-cover group-hover:scale-[1.02] transition" />
                <span v-if="a.category" class="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/55 text-white px-2 py-0.5 text-[11px]">
                  {{ a.category }}
                </span>
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-gray-900 dark:text-white line-clamp-2">{{ a.title }}</h3>
                <p class="mt-2 text-sm text-gray-600 dark:text-neutral-300 line-clamp-3">{{ a.excerpt }}</p>
                <div class="mt-3 flex flex-wrap gap-3 items-center justify-between text-[12px] text-gray-500 dark:text-neutral-400">
                  <div class="flex items-center gap-2">
                    <span>{{ formatDate(a.publishedAt) }}</span>
                    <span aria-hidden="true">•</span>
                    <span>{{ a.readTime }} min read</span>
                  </div>
                  <div class="hidden sm:flex flex-wrap gap-1">
                    <span v-for="t in a.tags" :key="t" class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-neutral-700">#{{ t }}</span>
                  </div>
                </div>
              </div>
            </article>
          </template>
        </div>

        <div v-if="!pending && filtered.length === 0" class="mt-10 rounded-2xl border border-dashed border-gray-300 dark:border-neutral-700 p-10 text-center">
          <p class="text-gray-600 dark:text-neutral-300">{{ cfg.texts.emptyList }}</p>
        </div>

        <div v-if="hasMore && !pending" class="mt-8 text-center">
          <button @click="loadMore" class="inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-green-700">
            <Icon icon="ph:arrow-circle-down" class="size-4" />
            {{ cfg.texts.loadMore }}
          </button>
        </div>
      </div>

      <!-- Share Modal -->
      <div
        id="hs-share-modal"
        class="hs-overlay hidden fixed inset-0 z-[80] overflow-y-auto pointer-events-none [--overlay-backdrop:rgba(15,23,42,.65)]"
        role="dialog"
        aria-labelledby="hs-share-modal-label"
        aria-modal="true"
      >
        <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-300 mt-0 opacity-0 transition-all mx-auto flex min-h-[calc(100%-3.5rem)] w-full items-center p-4 sm:max-w-lg">
          <div class="pointer-events-auto w-full overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <!-- Header -->
            <div class="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-green-600 via-green-600 to-lime-500 p-5 text-white dark:border-neutral-800">
              <div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-3xl"></div>
              <div class="absolute -bottom-12 left-6 h-28 w-28 rounded-full bg-lime-200/30 blur-3xl"></div>

              <div class="relative flex items-start justify-between gap-4">
                <div>
                  <div class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold ring-1 ring-white/20 backdrop-blur">
                    <Icon icon="ph:share-network" class="size-3.5" />
                    Bagikan Artikel
                  </div>

                  <h3 id="hs-share-modal-label" class="mt-3 text-xl font-extrabold tracking-tight">
                    Sebarkan kabar baik ini
                  </h3>

                  <p class="mt-1 line-clamp-2 text-sm text-green-50">
                    {{ shareText }}
                  </p>
                </div>

                <button
                  type="button"
                  class="inline-flex size-9 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20 transition hover:bg-white/25"
                  data-hs-overlay="#hs-share-modal"
                  aria-label="Tutup"
                >
                  <Icon icon="ph:x" class="size-5" />
                </button>
              </div>
            </div>

            <!-- Body -->
            <div class="space-y-5 p-5">
              <!-- Share options -->
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  @click="nativeShare"
                  class="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-green-900/50 dark:hover:bg-green-900/10"
                >
                  <span class="grid size-10 shrink-0 place-items-center rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                    <Icon icon="ph:device-mobile" class="size-5" />
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
                  <span class="grid size-10 shrink-0 place-items-center rounded-2xl bg-green-600 text-white">
                    <Icon icon="mdi:whatsapp" class="size-5" />
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
                  <span class="grid size-10 shrink-0 place-items-center rounded-2xl bg-green-600 text-white">
                    <Icon icon="mdi:facebook" class="size-5" />
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
                  <span class="grid size-10 shrink-0 place-items-center rounded-2xl bg-black text-white">
                    <Icon icon="ri:twitter-x-fill" class="size-5" />
                  </span>
                  <span class="min-w-0">
                    <span class="block text-sm font-bold text-gray-900 dark:text-white">X</span>
                    <span class="block text-xs text-gray-500 dark:text-neutral-400">Tweet link</span>
                  </span>
                </a>
              </div>

              <!-- Copy link -->
              <div class="rounded-3xl border border-gray-200 bg-gray-50 p-3 dark:border-neutral-800 dark:bg-neutral-950">
                <label class="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                  Link Artikel
                </label>

                <div class="flex gap-2">
                  <input
                    :value="canonical"
                    readonly
                    class="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
                  />

                  <button
                    type="button"
                    @click="copyShare"
                    class="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                  >
                    <Icon icon="ph:copy" class="size-4" />
                    {{ copied ? 'Tersalin' : 'Salin' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 text-xs text-gray-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
              <span class="inline-flex items-center gap-1.5">
                <Icon icon="ph:lock-simple" class="size-4" />
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
            <div class="grid size-10 shrink-0 place-items-center rounded-2xl bg-green-600 text-white">
              <Icon icon="ph:check-bold" class="size-5" />
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

      <div v-if="error" class="mt-8 rounded-2xl border border-rose-300/60 dark:border-rose-700 bg-rose-50/60 dark:bg-rose-900/30 p-4 text-sm text-rose-700 dark:text-rose-200">
        {{ error }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useNews } from '~/composables/data/useNews'
import { useWeb } from '~/composables/data/useWeb'
import { useAsyncData, useHead, useRuntimeConfig, useSeoMeta } from 'nuxt/app'
import { useRoute } from 'vue-router'

defineOptions({ name: 'NewsPage' })

const {
  pending, error, items,
  q, selectedCategory, selectedTags, sortBy, toggleTag, resetFilters,
  filtered, paged, hasMore, page, pageSize,
  isDetail, current, openDetail, backToList,
  renderedDetailHtml, categories, allTags
} = useNews()

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

function loadMore() { page.value++ }
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
    cover: '/assets/images/profile.png',
    badge: 'Kabar Terbaru',
    title: 'Berita Pondok Pesantren Alberr',
    subtitle: 'Informasi kegiatan, pengumuman, dan liputan santri.',
    heightSm: '36vh',
    heightLg: '44vh'
  },
  texts: {
    searchPlaceholder: 'Cari berita (judul/isi/tag)…',
    emptyList: 'Berita masih kosong.',
    notFound: 'Berita tidak ditemukan.',
    loadMore: 'Tampilkan Lebih Banyak'
  }
} as const

const route = useRoute()
const runtime = useRuntimeConfig()
const siteUrl = runtime.public?.siteUrl || ''

const web = useWeb()
const { data: pageSnap } = useAsyncData<WebPageSnapshot | null>(
  `webpage-${route.path}`,
  async () => {
    const snap = await web.getPageSnapshot(route.path)
    return (snap || null) as WebPageSnapshot | null
  }
)

const newsSectionProps = computed<any>(() => {
  const sections: any = pageSnap.value?.sections || []
  return sections.find((s: any) => s?.key === 'NewsPage')?.props || {}
})

const cfg = computed(() => ({
  hero: {
    cover: newsSectionProps.value?.hero?.cover || PAGE_DEFAULTS.hero.cover,
    badge: newsSectionProps.value?.hero?.badge || PAGE_DEFAULTS.hero.badge,
    title: newsSectionProps.value?.hero?.title || PAGE_DEFAULTS.hero.title,
    subtitle: newsSectionProps.value?.hero?.subtitle || PAGE_DEFAULTS.hero.subtitle,
    heightSm: newsSectionProps.value?.hero?.heightSm || PAGE_DEFAULTS.hero.heightSm,
    heightLg: newsSectionProps.value?.hero?.heightLg || PAGE_DEFAULTS.hero.heightLg
  },
  texts: {
    searchPlaceholder: newsSectionProps.value?.texts?.searchPlaceholder || PAGE_DEFAULTS.texts.searchPlaceholder,
    emptyList: newsSectionProps.value?.texts?.emptyList || PAGE_DEFAULTS.texts.emptyList,
    notFound: newsSectionProps.value?.texts?.notFound || PAGE_DEFAULTS.texts.notFound,
    loadMore: newsSectionProps.value?.texts?.loadMore || PAGE_DEFAULTS.texts.loadMore
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

  return 'https://alberr.sch.id'
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
  return (
    pageMeta.value?.organizationName ||
    pageMeta.value?.siteName ||
    runtime.public?.siteName ||
    'Pondok Pesantren Alberr'
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
  return (
    pageMeta.value?.title ||
    cfg.value.hero.title ||
    'Berita | Pondok Pesantren Alberr'
  )
})

const baseDescription = computed(() => {
  return limitSeoText(
    pageMeta.value?.description ||
      cfg.value.hero.subtitle ||
      'Kumpulan kabar terbaru: kegiatan, pengumuman, prestasi, kajian santri.',
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
    'berita pondok',
    'berita pesantren',
    'informasi pesantren',
    'kegiatan santri',
    'pengumuman pondok',
    'prestasi santri'
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
  if (isDetail.value && !current.value && !pending.value) {
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

onMounted(async() => {
  const { HSStaticMethods } = await import('preline')
  HSStaticMethods?.autoInit?.()
})

async function copyToClipboard(text: string) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text); return true
    }
  } catch {}
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly','')
    ta.style.position='fixed'; ta.style.opacity='0'
    document.body.appendChild(ta); ta.select()
    const ok = document.execCommand('copy'); document.body.removeChild(ta)
    return ok
  } catch { return false }
}

const shareText   = computed(() =>
  (current?.value?.title && isDetail.value) ? current.value.title : 'Berita Ponpes Alberr'
)
const encodedUrl  = computed(() => encodeURIComponent(canonical.value))
const encodedText = computed(() => encodeURIComponent(`${shareText.value} – ${canonical.value}`))

const facebookHref = computed(
  () => `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl.value}`
)
const twitterHref  = computed(
  () => `https://twitter.com/intent/tweet?url=${encodedUrl.value}&text=${encodeURIComponent(shareText.value)}`
)
const whatsappHref = computed(
  () => `https://wa.me/?text=${encodedText.value}`
)

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
    'yang', 'dan', 'di', 'ke', 'dari', 'untuk', 'dengan', 'pada', 'dalam',
    'the', 'and', 'for', 'with', 'from', 'about'
  ])

  return normalizeSearchText(value)
    .split(' ')
    .map((s) => s.trim())
    .filter((s) => s.length >= 4 && !stopWords.has(s))
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
    setTimeout(() => (copied.value = false), 1200)
  }
}
async function copyShare() {
  await copyLink()
}
async function nativeShare(){
  const url = canonical.value
  try {
    if (navigator.share) { await navigator.share({ title: shareText.value, text: shareText.value, url }); return }
  } catch {}
  const w = window.open(twitterHref.value, '_blank', 'noopener,noreferrer')
  if (!w) await copyLink()
}
</script>

<style scoped>
.heroH { height: var(--hero-sm); }
@media (min-width: 640px) {
  .heroH { height: var(--hero-lg); }
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

/* Dark mode */
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
