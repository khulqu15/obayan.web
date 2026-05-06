<template>
  <section class="p-4 md:p-6 space-y-6">
    <!-- Hero -->
    <div class="relative overflow-hidden rounded-[28px] border border-green-100 dark:border-neutral-800 bg-linear-to-br from-green-600 via-green-600 to-lime-500 p-6 md:p-8 text-white shadow-[0_20px_60px_-20px_rgba(22,163,74,0.45)]">
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
    <div class="rounded-3xl border border-gray-200/80 bg-white/85 p-4 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/85">
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
          class="h-80 animate-pulse rounded-3xl border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
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
          <div class="relative aspect-16/10 overflow-hidden bg-gray-100 dark:bg-neutral-800">
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
              <span
                v-if="n.publishedAt && n.publishedAt > Date.now()"
                class="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
              >
                Terjadwal
              </span>
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
      <div class="rounded-3xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <input
          v-model="searchHist"
          type="text"
          placeholder="Cari author, judul, kategori, slug..."
          class="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        />
      </div>

      <div class="overflow-auto rounded-3xl border max-h-[50vh] overflow-y-auto border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
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
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
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
      size="4xl"
    >
      <div class="space-y-6">
        <!-- Step Header -->
        <div class="rounded-lg border border-gray-200 overflow-hidden bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/60">
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
          <div v-if="wizardStep === 1" class="rounded-3xl border border-gray-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <h4 class="text-sm font-bold text-gray-900 dark:text-white">Informasi Utama</h4>
            <div
              v-if="formError"
              class="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300"
            >
              {{ formError }}
            </div>
            <div class="mt-4 grid gap-4">
              <div>
                <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                  Judul
                </label>
                <input
                  v-model.trim="form.title"
                  type="text"
                  :minlength="NEWS_LIMITS.title.min"
                  :maxlength="NEWS_LIMITS.title.max"
                  required
                  @keyup="onTitleKeyup"
                  @blur="runSmartRecommendation"
                  :class="[
                    'w-full rounded-2xl border bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:bg-white dark:bg-neutral-800 dark:text-white',
                    form.title && !titleValid
                      ? 'border-rose-300 focus:border-rose-500 dark:border-rose-800'
                      : 'border-gray-200 focus:border-green-500 dark:border-neutral-700'
                  ]"
                  placeholder="Contoh: Santri SMP Al-Inayah Raih Juara Tahfidz..."
                />

                <div class="mt-1 flex items-center justify-between gap-3 text-xs">
                  <p :class="form.title && !titleValid ? 'text-rose-600 dark:text-rose-300' : 'text-gray-500 dark:text-neutral-400'">
                    Judul minimal {{ NEWS_LIMITS.title.min }} dan maksimal {{ NEWS_LIMITS.title.max }} karakter.
                  </p>
                  <span class="shrink-0 text-gray-400">
                    {{ textLength(form.title) }}/{{ NEWS_LIMITS.title.max }}
                  </span>
                </div>
              </div>

              <!-- Rekomendasi setelah judul diisi -->
              <div
                v-if="form.title.trim()"
                class="rounded-[22px] border border-green-100 bg-white/90 shadow-sm backdrop-blur dark:border-green-900/40 dark:bg-neutral-900/90"
              >
                <!-- Header Collapse -->
                <button
                  type="button"
                  @click="showRecommendationPanel = !showRecommendationPanel"
                  class="flex w-full items-start justify-between gap-3 rounded-[22px] p-4 text-left transition hover:bg-green-50/70 dark:hover:bg-green-900/10"
                >
                  <div class="flex min-w-0 items-start gap-3">
                    <div class="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-600 shadow-sm ring-1 ring-green-100 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-900/40">
                      ✨
                    </div>

                    <div class="min-w-0">
                      <div class="flex flex-wrap items-center gap-2">
                        <h5 class="text-sm font-bold text-gray-900 dark:text-white">
                          Rekomendasi metadata AI lokal
                        </h5>

                        <span class="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700 ring-1 ring-green-100 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-900/40">
                          <span v-if="aiLoading">Menganalisis...</span>
                          <span v-else>{{ aiRecommendation?.confidence || 'Fallback' }}</span>
                        </span>
                      </div>

                      <p class="mt-1 line-clamp-1 text-xs text-gray-500 dark:text-neutral-400">
                        {{ recommendationSummary || 'Klik untuk melihat rekomendasi category, segment, dan tags.' }}
                      </p>
                    </div>
                  </div>

                  <div class="flex shrink-0 items-center gap-2">
                    <span class="hidden rounded-full bg-gray-50 px-3 py-1 text-[11px] font-semibold text-gray-600 ring-1 ring-gray-100 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700 sm:inline-flex">
                      {{ showRecommendationPanel ? 'Tutup' : 'Buka' }}
                    </span>

                    <svg
                      :class="[
                        'h-5 w-5 text-gray-400 transition-transform duration-300',
                        showRecommendationPanel ? 'rotate-180' : ''
                      ]"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </button>

                <!-- Body Collapse -->
                <Transition
                  enter-active-class="transition duration-300 ease-out"
                  enter-from-class="opacity-0 -translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition duration-200 ease-in"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 -translate-y-2"
                >
                  <div
                    v-show="showRecommendationPanel"
                    class="border-t border-green-100 p-4 dark:border-green-900/30"
                  >
                    <div class="rounded-2xl bg-green-50/70 px-3 py-2 text-xs font-medium text-gray-700 ring-1 ring-green-100 dark:bg-green-900/10 dark:text-neutral-200 dark:ring-green-900/40">
                      {{ recommendationSummary }}
                    </div>

                    <p
                      v-if="aiRecommendation?.summary"
                      class="mt-2 text-xs leading-5 text-gray-600 dark:text-neutral-300"
                    >
                      {{ aiRecommendation.summary }}
                    </p>

                    <p
                      v-if="aiError"
                      class="mt-2 rounded-2xl bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-700 ring-1 ring-amber-100 dark:bg-amber-900/10 dark:text-amber-300 dark:ring-amber-900/30"
                    >
                      {{ aiError }} Sistem tetap memakai fallback keyword lokal.
                    </p>

                    <div v-if="recommendedCategories.length" class="mt-4">
                      <div class="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                        Tema / Category
                      </div>

                      <div class="mt-2 flex flex-wrap gap-2">
                        <button
                          v-for="c in recommendedCategories"
                          :key="c"
                          type="button"
                          @click="selectRecommendedCategory(c)"
                          class="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-green-700 ring-1 ring-green-100 transition hover:bg-green-600 hover:text-white dark:bg-neutral-900 dark:text-green-300 dark:ring-green-900/50"
                        >
                          {{ c }}
                        </button>
                      </div>
                    </div>

                    <div v-if="recommendedSegments.length" class="mt-4">
                      <div class="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                        Segment / Jenjang
                      </div>

                      <div class="mt-2 flex flex-wrap gap-2">
                        <button
                          v-for="s in recommendedSegments"
                          :key="s"
                          type="button"
                          @click="selectRecommendedSegment(s)"
                          class="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-green-700 ring-1 ring-green-100 transition hover:bg-green-600 hover:text-white dark:bg-neutral-900 dark:text-green-300 dark:ring-green-900/50"
                        >
                          {{ s }}
                        </button>
                      </div>
                    </div>

                    <div v-if="recommendedTags.length" class="mt-4">
                      <div class="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                        Tags
                      </div>

                      <div class="mt-2 flex flex-wrap gap-2">
                        <button
                          v-for="t in recommendedTags"
                          :key="t"
                          type="button"
                          @click="addTag(t)"
                          class="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 ring-1 ring-gray-100 transition hover:bg-green-600 hover:text-white dark:bg-neutral-900 dark:text-neutral-200 dark:ring-neutral-700"
                        >
                          #{{ t }}
                        </button>
                      </div>
                    </div>

                    <!-- Footer Action -->
                    <div class="mt-5 flex flex-col gap-2 border-t border-green-100 pt-4 dark:border-green-900/30 sm:flex-row sm:items-center sm:justify-between">
                      <p class="text-xs text-gray-500 dark:text-neutral-400">
                        Terapkan otomatis akan memilih rekomendasi pertama untuk category dan segment, lalu menambahkan semua tags.
                      </p>

                      <button
                        type="button"
                        @click="applyRecommendation"
                        :disabled="aiLoading || !canApplyRecommendation"
                        class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span v-if="aiLoading">Menganalisis...</span>
                        <span v-else>Terapkan Rekomendasi</span>
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                    Kategori
                  </label>
                  <input
                    v-model.trim="form.category"
                    list="category-options"
                    type="text"
                    :minlength="NEWS_LIMITS.category.min"
                    :maxlength="NEWS_LIMITS.category.max"
                    required
                    @keyup="onCategoryKeyup"
                    @keydown.enter.prevent="upsertCategoryFromInput"
                    @blur="upsertCategoryFromInput"
                    :class="[
                      'w-full rounded-2xl border bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:bg-white dark:bg-neutral-800 dark:text-white',
                      form.category && !categoryValid
                        ? 'border-rose-300 focus:border-rose-500 dark:border-rose-800'
                        : 'border-gray-200 focus:border-green-500 dark:border-neutral-700'
                    ]"
                    placeholder="Kegiatan / Prestasi / Pengumuman"
                  />

                  <div class="mt-1 flex items-center justify-between gap-3 text-xs">
                    <p :class="form.category && !categoryValid ? 'text-rose-600 dark:text-rose-300' : 'text-gray-500 dark:text-neutral-400'">
                      Kategori minimal {{ NEWS_LIMITS.category.min }} dan maksimal {{ NEWS_LIMITS.category.max }} karakter.
                    </p>
                    <span class="shrink-0 text-gray-400">
                      {{ textLength(form.category) }}/{{ NEWS_LIMITS.category.max }}
                    </span>
                  </div>
                  <datalist id="category-options">
                    <option v-for="c in categories" :key="c.id" :value="c.name" />
                  </datalist>
                  <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                    Ketik kategori baru, lalu Enter.
                  </p>
                </div>

                <div>
                  <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                    Segment / Jenjang
                  </label>

                  <input
                    v-model.trim="form.segment"
                    list="segment-options"
                    type="text"
                    :minlength="NEWS_LIMITS.segment.min"
                    :maxlength="NEWS_LIMITS.segment.max"
                    required
                    :class="[
                      'w-full rounded-2xl border bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:bg-white dark:bg-neutral-800 dark:text-white',
                      form.segment && !segmentValid
                        ? 'border-rose-300 focus:border-rose-500 dark:border-rose-800'
                        : 'border-gray-200 focus:border-green-500 dark:border-neutral-700'
                    ]"
                    placeholder="Umum / TK / SD / SMP / Madin / Pondok / Alumni"
                  />

                  <datalist id="segment-options">
                    <option value="Umum" />
                    <option value="TK" />
                    <option value="SD" />
                    <option value="SMP" />
                    <option value="Madin" />
                    <option value="Pondok" />
                    <option value="Alumni" />
                    <option value="Wali Santri" />
                  </datalist>

                  <div class="mt-1 flex items-center justify-between gap-3 text-xs">
                    <p :class="form.segment && !segmentValid ? 'text-rose-600 dark:text-rose-300' : 'text-gray-500 dark:text-neutral-400'">
                      Segment bisa diketik manual, minimal {{ NEWS_LIMITS.segment.min }} dan maksimal {{ NEWS_LIMITS.segment.max }} karakter.
                    </p>
                    <span class="shrink-0 text-gray-400">
                      {{ textLength(String(form.segment || '')) }}/{{ NEWS_LIMITS.segment.max }}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                  Jadwal Posting
                </label>

                <input
                  v-model="publishedAtLocal"
                  type="datetime-local"
                  required
                  class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />

                <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                  Default hari ini. Jika tanggal/jam dibuat ke depan, artikel akan tersimpan sebagai jadwal posting.
                </p>
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                  Tags
                </label>

                <div class="rounded-2xl border border-gray-200 bg-gray-50 p-2 transition focus-within:border-green-500 focus-within:bg-white dark:border-neutral-700 dark:bg-neutral-800">
                  <div class="flex flex-wrap gap-2">
                    <span v-for="t in form.tags" :key="t" class="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300" >
                      #{{ t }}
                      <button type="button" @click="removeTag(t)" class="text-green-700/70 transition hover:text-rose-600 dark:text-green-300" >
                        x
                      </button>
                    </span>
                    <input
                      v-model.trim="tagDraft"
                      list="tag-options"
                      type="text"
                      :minlength="NEWS_LIMITS.tag.min"
                      :maxlength="NEWS_LIMITS.tag.max"
                      @keyup="onTagKeyup"
                      @keydown.enter.prevent="commitTag"
                      @keydown.,.prevent="commitTag"
                      @blur="commitTag"
                      class="min-w-40 flex-1 bg-transparent px-2 py-1.5 text-sm outline-none dark:text-white"
                      :placeholder="form.tags.length >= NEWS_LIMITS.tag.maxCount ? 'Maksimal tag tercapai' : 'Ketik tag lalu Enter...'"
                      :disabled="form.tags.length >= NEWS_LIMITS.tag.maxCount"
                    />
                    <div class="mt-1 flex items-center justify-between gap-3 text-xs">
                      <p :class="!tagsValid ? 'text-rose-600 dark:text-rose-300' : 'text-gray-500 dark:text-neutral-400'">
                        Tag minimal {{ NEWS_LIMITS.tag.min }}, maksimal {{ NEWS_LIMITS.tag.max }} karakter. Maksimal {{ NEWS_LIMITS.tag.maxCount }} tag.
                      </p>
                      <span class="shrink-0 text-gray-400">
                        {{ form.tags.length }}/{{ NEWS_LIMITS.tag.maxCount }}
                      </span>
                    </div>
                  </div>
                </div>

                <datalist id="tag-options">
                  <option v-for="t in tags" :key="t.id" :value="t.name" />
                </datalist>

                <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                  Tags otomatis dibuat saat menekan Enter atau koma.
                </p>
              </div>

              <div>
                <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                  Ringkasan
                </label>
                <textarea v-model.trim="form.excerpt" rows="4" class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" placeholder="Ringkasan singkat yang muncul di kartu berita..." ></textarea>
              </div>
            </div>
          </div>
          <!-- Step 2 -->
          <div v-if="wizardStep === 2" class="space-y-4">
            <div class="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <!-- Controls -->
              <div class="space-y-4 p-4">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <h4 class="text-sm font-bold text-gray-900 dark:text-white">
                      Cover Gambar
                    </h4>
                    <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                      PNG/JPG/WebP maksimal 5 MB.
                    </p>
                  </div>

                  <div class="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                    <button
                      type="button"
                      @click="coverMode = 'upload'"
                      :class="[
                        'rounded-xl px-3 py-1.5 text-xs font-bold transition',
                        coverMode === 'upload'
                          ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                          : 'text-gray-500 hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white'
                      ]"
                    >
                      Upload
                    </button>

                    <button
                      type="button"
                      @click="coverMode = 'link'"
                      :class="[
                        'rounded-xl px-3 py-1.5 text-xs font-bold transition',
                        coverMode === 'link'
                          ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                          : 'text-gray-500 hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white'
                      ]"
                    >
                      Link
                    </button>
                  </div>
                </div>

                <label
                  v-if="coverMode === 'upload'"
                  class="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-green-200 bg-green-50/60 p-4 transition hover:border-green-400 hover:bg-green-50 dark:border-green-900/40 dark:bg-green-900/10"
                >
                  <input
                    ref="coverInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="onPickCover"
                  />

                  <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-xl shadow-sm ring-1 ring-green-100 dark:bg-neutral-900 dark:ring-green-900/40">
                    ☁️
                  </div>

                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-bold text-gray-900 dark:text-white">
                      {{ coverFile?.name || 'Pilih gambar cover' }}
                    </p>
                    <p class="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                      {{ coverFile ? formatBytes(coverFile.size) : 'Klik area ini untuk upload gambar.' }}
                    </p>
                  </div>

                  <span class="shrink-0 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-green-700 ring-1 ring-green-100 dark:bg-neutral-900 dark:text-green-300 dark:ring-green-900/40">
                    Browse
                  </span>
                </label>

                <div v-else>
                  <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                    Link Gambar
                  </label>

                  <input
                    v-model.trim="form.coverLink"
                    type="url"
                    class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>

                <div
                  v-if="uploadError"
                  class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-300"
                >
                  {{ uploadError }}
                </div>
              </div>
              <!-- Preview -->
              <div class="relative aspect-[16/10] bg-gray-100 dark:bg-neutral-800">
                <img
                  v-if="resolvedCoverPreview"
                  :src="resolvedCoverPreview"
                  alt="Cover preview"
                  class="h-full w-full object-cover"
                />

                <div
                  v-else
                  class="flex h-full flex-col items-center justify-center px-6 text-center"
                >
                  <div class="grid h-14 w-14 place-items-center rounded-2xl bg-white text-2xl shadow-sm ring-1 ring-gray-100 dark:bg-neutral-900 dark:ring-neutral-700">
                    🖼️
                  </div>
                  <p class="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
                    Belum ada cover
                  </p>
                  <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                    Upload gambar atau gunakan link URL.
                  </p>
                </div>

                <button
                  v-if="resolvedCoverPreview"
                  type="button"
                  @click="clearCover"
                  class="absolute right-3 top-3 inline-flex items-center justify-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm backdrop-blur transition hover:bg-white dark:bg-neutral-900/90 dark:text-neutral-200"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          <!-- Step 3 -->
          <div v-if="wizardStep === 3" class="space-y-4">
            <div class="rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <!-- Top Toolbar -->
              <div
                v-if="editor"
                class="editor-toolbar-root sticky -top-4 z-40 rounded-t-3xl border-b border-gray-200 bg-white/95 p-3 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95"
              >
                <div class="flex flex-wrap items-center gap-2">
                  <!-- Group: Text -->
                  <div class="flex items-center gap-1 rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                    <button
                      type="button"
                      class="toolbar-btn group relative"
                      :class="toolbarActive('paragraph')"
                      @click.prevent="runEditor(() => editor.chain().focus().setParagraph().run())"
                    >
                      P
                      <span class="toolbar-tooltip">Paragraph</span>
                    </button>

                    <button
                      type="button"
                      class="toolbar-btn group relative"
                      :class="toolbarActive('heading', { level: 1 })"
                      @click.prevent="runEditor(() => editor.chain().focus().toggleHeading({ level: 1 }).run())"
                    >
                      H1
                      <span class="toolbar-tooltip">Heading 1</span>
                    </button>

                    <button
                      type="button"
                      class="toolbar-btn group relative"
                      :class="toolbarActive('heading', { level: 2 })"
                      @click.prevent="runEditor(() => editor.chain().focus().toggleHeading({ level: 2 }).run())"
                    >
                      H2
                      <span class="toolbar-tooltip">Heading 2</span>
                    </button>

                    <button
                      type="button"
                      class="toolbar-btn group relative"
                      :class="toolbarActive('heading', { level: 3 })"
                      @click.prevent="runEditor(() => editor.chain().focus().toggleHeading({ level: 3 }).run())"
                    >
                      H3
                      <span class="toolbar-tooltip">Heading 3</span>
                    </button>

                    <button
                      type="button"
                      class="toolbar-btn group relative"
                      :class="toolbarActive('bold')"
                      @click.prevent="runEditor(() => editor.chain().focus().toggleBold().run())"
                    >
                      <span class="font-extrabold">B</span>
                      <span class="toolbar-tooltip">Bold</span>
                    </button>

                    <button
                      type="button"
                      class="toolbar-btn group relative"
                      :class="toolbarActive('italic')"
                      @click.prevent="runEditor(() => editor.chain().focus().toggleItalic().run())"
                    >
                      <span class="italic">I</span>
                      <span class="toolbar-tooltip">Italic</span>
                    </button>

                    <button
                      type="button"
                      class="toolbar-btn group relative"
                      :class="toolbarActive('blockquote')"
                      @click.prevent="runEditor(() => editor.chain().focus().toggleBlockquote().run())"
                    >
                      ❝
                      <span class="toolbar-tooltip">Quote</span>
                    </button>
                  </div>

                  <!-- Group: List -->
                  <div class="flex items-center gap-1 rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                    <button
                      type="button"
                      class="toolbar-btn group relative"
                      :class="toolbarActive('bulletList')"
                      @click.prevent="runEditor(() => editor.chain().focus().toggleBulletList().run())"
                    >
                      • List
                      <span class="toolbar-tooltip">Bullet List</span>
                    </button>

                    <button
                      type="button"
                      class="toolbar-btn group relative"
                      :class="toolbarActive('orderedList')"
                      @click.prevent="runEditor(() => editor.chain().focus().toggleOrderedList().run())"
                    >
                      1. List
                      <span class="toolbar-tooltip">Ordered List</span>
                    </button>
                  </div>

                  <!-- Group: Table -->
                  <div class="relative">
                    <div class="flex items-center gap-1 rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                      <button
                        type="button"
                        class="toolbar-btn group relative"
                        @click="toggleToolbarPanel('table')"
                      >
                        Table
                        <span class="toolbar-tooltip">Table tools</span>
                      </button>
                    </div>

                    <div
                      v-if="toolbarPanel === 'table'"
                      class="absolute left-0 top-full z-20 mt-2 w-[320px] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
                    >
                      <div class="mb-3">
                        <div class="text-sm font-bold text-gray-900 dark:text-white">Table</div>
                        <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                          Tambah tabel baru atau atur row dan column pada tabel aktif.
                        </p>
                      </div>

                      <div class="grid grid-cols-2 gap-3">
                        <div>
                          <label class="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                            Rows
                          </label>
                          <input
                            v-model.number="tableForm.rows"
                            type="number"
                            min="1"
                            max="12"
                            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                          />
                        </div>

                        <div>
                          <label class="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                            Cols
                          </label>
                          <input
                            v-model.number="tableForm.cols"
                            type="number"
                            min="1"
                            max="8"
                            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                          />
                        </div>
                      </div>

                      <label class="mt-3 flex items-center gap-2 text-sm text-gray-700 dark:text-neutral-200">
                        <input
                          v-model="tableForm.withHeaderRow"
                          type="checkbox"
                          class="rounded border-gray-300 text-green-600 focus:ring-green-500 dark:border-neutral-700 dark:bg-neutral-800"
                        />
                        Header row
                      </label>

                      <div class="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          @click="insertCustomTable"
                          class="inline-flex items-center justify-center rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
                        >
                          Insert Table
                        </button>

                        <button
                          type="button"
                          @click="runEditor(() => editor.chain().focus().addRowAfter().run())"
                          class="toolbar-action-btn"
                        >
                          + Row
                        </button>

                        <button
                          type="button"
                          @click="runEditor(() => editor.chain().focus().deleteRow().run())"
                          class="toolbar-action-btn"
                        >
                          - Row
                        </button>

                        <button
                          type="button"
                          @click="runEditor(() => editor.chain().focus().addColumnAfter().run())"
                          class="toolbar-action-btn"
                        >
                          + Col
                        </button>

                        <button
                          type="button"
                          @click="runEditor(() => editor.chain().focus().deleteColumn().run())"
                          class="toolbar-action-btn"
                        >
                          - Col
                        </button>

                        <button
                          type="button"
                          @click="runEditor(() => editor.chain().focus().deleteTable().run())"
                          class="inline-flex items-center justify-center rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
                        >
                          Delete Table
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Group: Embed -->
                  <div class="relative">
                    <div class="flex items-center gap-1 rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                      <button
                        type="button"
                        class="toolbar-btn group relative"
                        @click="toggleToolbarPanel('embed')"
                      >
                        Insert
                        <span class="toolbar-tooltip">Insert PDF / YouTube</span>
                      </button>
                    </div>

                    <div
                      v-if="toolbarPanel === 'embed'"
                      class="absolute -left-16 top-full z-20 mt-2 w-[min(92vhm 420px)] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
                    >
                      <div class="mb-3">
                        <div class="text-sm font-bold text-gray-900 dark:text-white">Insert Embed</div>
                        <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                          Tambahkan video YouTube atau dokumen PDF langsung dari link.
                        </p>
                      </div>

                      <div class="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                        <button
                          type="button"
                          @click="embedForm.type = 'youtube'"
                          :class="[
                            'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                            embedForm.type === 'youtube'
                              ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                              : 'text-gray-500 dark:text-neutral-300'
                          ]"
                        >
                          YouTube
                        </button>
                        <button
                          type="button"
                          @click="embedForm.type = 'pdf'"
                          :class="[
                            'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                            embedForm.type === 'pdf'
                              ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                              : 'text-gray-500 dark:text-neutral-300'
                          ]"
                        >
                          PDF
                        </button>
                        <button
                          type="button"
                          @click="embedForm.type = 'image'"
                          :class="[
                            'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                            embedForm.type === 'image'
                              ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                              : 'text-gray-500 dark:text-neutral-300'
                          ]"
                        >
                          Image
                        </button>
                        <button
                          type="button"
                          @click="embedForm.type = 'map'"
                          :class="[
                            'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                            embedForm.type === 'map'
                              ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                              : 'text-gray-500 dark:text-neutral-300'
                          ]"
                        >
                          Maps
                        </button>

                        <button
                          type="button"
                          @click="embedForm.type = 'link'"
                          :class="[
                            'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                            embedForm.type === 'link'
                              ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                              : 'text-gray-500 dark:text-neutral-300'
                          ]"
                        >
                          Link
                        </button>
                      </div>

                      <div class="mt-3 space-y-3">
                        <div>
                          <label class="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                            Link
                          </label>
                          <input
                            v-model.trim="embedForm.url"
                            type="url"
                            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            :placeholder="
                              embedForm.type === 'youtube'
                                ? 'https://www.youtube.com/watch?v=...'
                                : embedForm.type === 'pdf'
                                  ? 'https://example.com/file.pdf'
                                  : embedForm.type === 'map'
                                    ? 'Tempel Google Maps embed URL atau link Maps'
                                    : embedForm.type === 'link'
                                      ? 'https://example.com'
                                      : 'https://example.com/image.jpg'"
                          />
                        </div>

                        <div v-if="['pdf', 'map', 'link'].includes(embedForm.type)">
                          <label class="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                            {{ embedForm.type === 'pdf' ? 'Judul PDF' : embedForm.type === 'map' ? 'Judul Lokasi' : 'Text Link' }}
                          </label>

                          <input
                            v-model.trim="embedForm.title"
                            type="text"
                            maxlength="80"
                            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            :placeholder="embedForm.type === 'pdf' ? 'Dokumen PDF' : embedForm.type === 'map' ? 'Lokasi Pondok Pesantren' : 'Baca selengkapnya'"
                          />
                        </div>
                      </div>

                      <div class="mt-4 flex justify-end gap-2">
                        <button
                          type="button"
                          @click="resetEmbedForm"
                          class="toolbar-action-btn"
                        >
                          Reset
                        </button>

                        <button
                          type="button"
                          @click="submitEmbed"
                          class="inline-flex items-center justify-center rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
                        >
                          Insert
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Group: History -->
                  <div class="ml-auto flex items-center gap-1 rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                    <button
                      type="button"
                      class="toolbar-btn group relative"
                      @click.prevent="runEditor(() => editor.chain().focus().undo().run())"
                    >
                      Undo
                      <span class="toolbar-tooltip">Undo</span>
                    </button>

                    <button
                      type="button"
                      class="toolbar-btn group relative"
                      @click.prevent="runEditor(() => editor.chain().focus().redo().run())"
                    >
                      Redo
                      <span class="toolbar-tooltip">Redo</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Editor -->
              <ClientOnly>
                <div class="bg-white dark:bg-neutral-950">
                  <EditorContent :editor="editor" class="editor-shell" />
                </div>
              </ClientOnly>

              <!-- Footer info -->
              <div class="flex flex-col gap-2 border-t border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-500 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  Gunakan toolbar untuk format seperti Microsoft Word: heading, list, tabel, PDF, dan YouTube.
                </div>
                <div>
                  Konten akan tersimpan dalam format TipTap JSON + HTML.
                </div>
              </div>
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
              <span v-else>
                {{
                  formMode === 'create'
                    ? form.publishedAt > Date.now()
                      ? 'Jadwalkan Artikel'
                      : 'Terbitkan'
                    : 'Simpan Perubahan'
                }}
              </span>
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
import { useNewsTfjsRecommendation, type ArticleSegment, type NewsAiRecommendation } from '~/composables/data/useNewsTfjsRecomendation'
import { useNuxtApp, useState, useRuntimeConfig } from 'nuxt/app'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { Node } from '@tiptap/core'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import { push, ref as dbRef, onValue, off, set, update } from 'firebase/database'

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

type TaxonomyItem = {
  id: string
  name: string
  key: string
  description?: string
  usageCount?: number
  createdAt?: number
  updatedAt?: number
}

const CloudImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      publicId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-public-id'),
        renderHTML: (attributes) => {
          if (!attributes.publicId) return {}
          return {
            'data-public-id': attributes.publicId
          }
        }
      }
    }
  }
})

const config = useRuntimeConfig()
const clientName = String(config.public.clientName || 'alinayah')
const deletedCoverPublicId = ref<string | null>(null)

const NEWS_LIMITS = {
  title: {
    min: 12,
    max: 110
  },
  category: {
    min: 3,
    max: 40
  },
  segment: {
    min: 2,
    max: 30
  },
  tag: {
    min: 2,
    max: 24,
    maxCount: 8
  }
} as const

function textLength(value: string) {
  return String(value || '').trim().length
}

function isLengthBetween(value: string, min: number, max: number) {
  const len = textLength(value)
  return len >= min && len <= max
}

const titleValid = computed(() => {
  return isLengthBetween(form.title, NEWS_LIMITS.title.min, NEWS_LIMITS.title.max)
})

const categoryValid = computed(() => {
  return isLengthBetween(form.category, NEWS_LIMITS.category.min, NEWS_LIMITS.category.max)
})

const segmentValid = computed(() => {
  return isLengthBetween(String(form.segment || ''), NEWS_LIMITS.segment.min, NEWS_LIMITS.segment.max)
})

const tagsValid = computed(() => {
  return (
    form.tags.length <= NEWS_LIMITS.tag.maxCount &&
    form.tags.every((tag) =>
      isLengthBetween(tag, NEWS_LIMITS.tag.min, NEWS_LIMITS.tag.max)
    )
  )
})

const stepOneValid = computed(() => {
  return titleValid.value && categoryValid.value && segmentValid.value && tagsValid.value
})
const categories = ref<TaxonomyItem[]>([])
const tags = ref<TaxonomyItem[]>([])
const tagDraft = ref('')
const {
  recommend,
  loading: aiLoading,
  ready: aiReady,
  error: aiError
} = useNewsTfjsRecommendation()

const aiRecommendation = ref<NewsAiRecommendation | null>(null)
let recommendationTimer: ReturnType<typeof setTimeout> | null = null

let categoryMetaRef: any = null
let tagMetaRef: any = null
let categoryDebounce: ReturnType<typeof setTimeout> | null = null

function normalizeKey(v: string) {
  return String(v || '')
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function taxonomyPath(type: 'categories' | 'tags') {
  return `${clientName}/news_meta/${type}`
}

function listenTaxonomy() {
  categoryMetaRef = dbRef($realtimeDb, taxonomyPath('categories'))
  tagMetaRef = dbRef($realtimeDb, taxonomyPath('tags'))

  onValue(categoryMetaRef, (snap: any) => {
    const val = snap.val() || {}
    categories.value = Object.entries(val)
      .map(([id, v]: any) => ({ id, ...v }))
      .sort((a, b) => a.name.localeCompare(b.name))
  })

  onValue(tagMetaRef, (snap: any) => {
    const val = snap.val() || {}
    tags.value = Object.entries(val)
      .map(([id, v]: any) => ({ id, ...v }))
      .sort((a, b) => a.name.localeCompare(b.name))
  })
}

async function runSmartRecommendation() {
  const title = form.title.trim()

  if (title.length < 4) {
    aiRecommendation.value = null
    return
  }

  const result = await recommend(title)
  aiRecommendation.value = result

  if (!form.category.trim() && result.category) {
    form.category = result.category
    upsertTaxonomy('categories', result.category)
  }

  if ((!form.segment || form.segment === 'Umum') && result.segment) {
    form.segment = result.segment
  }
}

function onTitleKeyup() {
  if (recommendationTimer) clearTimeout(recommendationTimer)

  recommendationTimer = setTimeout(() => {
    runSmartRecommendation()
  }, 700)
}

const recommendedCategories = computed(() => {
  if (!form.title.trim()) return []

  const result = new Set<string>()

  if (aiRecommendation.value?.category) result.add(aiRecommendation.value.category)
  if (aiRecommendation.value?.mainTheme) result.add(aiRecommendation.value.mainTheme)

  for (const c of categories.value) {
    const titleKey = normalizeKey(form.title)
    const categoryKey = normalizeKey(c.name)

    if (categoryKey && titleKey.includes(categoryKey)) {
      result.add(c.name)
    }
  }

  if (!result.size) result.add('Umum')

  return Array.from(result).slice(0, 5)
})

const recommendedSegments = computed<ArticleSegment[]>(() => {
  if (!form.title.trim()) return []

  const result = new Set<ArticleSegment>()

  if (aiRecommendation.value?.segment) {
    result.add(aiRecommendation.value.segment)
  }

  if (!result.size) result.add('Umum')

  return Array.from(result)
})

const recommendedTags = computed(() => {
  if (!form.title.trim()) return []

  const result = new Set<string>()

  if (aiRecommendation.value?.tags?.length) {
    for (const tag of aiRecommendation.value.tags) {
      const key = normalizeKey(tag)
      if (key) result.add(key)
    }
  }

  return Array.from(result)
    .filter((tag) => !form.tags.includes(tag))
    .slice(0, 10)
})

const recommendationSummary = computed(() => {
  if (!form.title.trim()) return ''

  if (aiLoading.value) {
    return 'Model AI lokal sedang menganalisis judul...'
  }

  if (aiRecommendation.value) {
    return `Tema: ${aiRecommendation.value.mainTheme} • Segment: ${aiRecommendation.value.segment} • Bahasa: ${aiRecommendation.value.language} • Keyakinan: ${aiRecommendation.value.confidence}`
  }

  return 'Tulis judul artikel untuk memunculkan rekomendasi.'
})

const showRecommendationPanel = ref(false)

const canApplyRecommendation = computed(() => {
  return (
    recommendedCategories.value.length > 0 ||
    recommendedSegments.value.length > 0 ||
    recommendedTags.value.length > 0
  )
})

function applyRecommendation() {
  const category = recommendedCategories.value[0]
  const segment = recommendedSegments.value[0]

  if (category) {
    selectRecommendedCategory(category)
  }

  if (segment) {
    selectRecommendedSegment(segment)
  }

  for (const tag of recommendedTags.value) {
    addTag(tag)
  }

  showRecommendationPanel.value = false
}

function selectRecommendedCategory(category: string) {
  form.category = category
  upsertTaxonomy('categories', category)
}

function selectRecommendedSegment(segment: ArticleSegment) {
  form.segment = segment
}

onMounted(() => {
  listenTaxonomy()
})

onBeforeUnmount(() => {
  try {
    if (categoryMetaRef) off(categoryMetaRef)
    if (tagMetaRef) off(tagMetaRef)
  } catch {}
})

async function upsertTaxonomy(type: 'categories' | 'tags', rawName: string) {
  const name = rawName.trim()
  const key = normalizeKey(name)
  if (!name || !key) return

  const now = Date.now()
  const targetRef = dbRef($realtimeDb, `${taxonomyPath(type)}/${key}`)

  const existing =
    type === 'categories'
      ? categories.value.find((x) => x.id === key || x.key === key)
      : tags.value.find((x) => x.id === key || x.key === key)

  await set(targetRef, {
    name,
    key,
    usageCount: existing?.usageCount || 0,
    createdAt: existing?.createdAt || now,
    updatedAt: now
  })
}

function onCategoryKeyup(e: KeyboardEvent) {
  if (e.key === 'Enter') return

  if (categoryDebounce) clearTimeout(categoryDebounce)

  categoryDebounce = setTimeout(() => {
    upsertCategoryFromInput()
  }, 650)
}

async function upsertCategoryFromInput() {
  if (!form.category.trim()) return
  await upsertTaxonomy('categories', form.category)
}

function addTag(tag: string) {
  const clean = normalizeKey(tag)
  if (!clean) return
  if (!isLengthBetween(clean, NEWS_LIMITS.tag.min, NEWS_LIMITS.tag.max)) {
    formError.value = `Tag harus ${NEWS_LIMITS.tag.min}-${NEWS_LIMITS.tag.max} karakter.`
    return
  }
  if (form.tags.length >= NEWS_LIMITS.tag.maxCount && !form.tags.includes(clean)) {
    formError.value = `Maksimal ${NEWS_LIMITS.tag.maxCount} tag dalam satu artikel.`
    return
  }
  if (!form.tags.includes(clean)) form.tags.push(clean)
  formError.value = null
  upsertTaxonomy('tags', clean)
}

function removeTag(tag: string) {
  form.tags = form.tags.filter((t) => t !== tag)
}

function commitTag() {
  if (!tagDraft.value.trim()) return
  addTag(tagDraft.value)
  tagDraft.value = ''
}

function onTagKeyup(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ',') return

  const value = tagDraft.value.trim()
  if (!value) return

  // Kalau user memilih dari datalist dan mengetik nama tag yang sudah valid,
  // sistem tetap bisa simpan/update metadata-nya.
  const exists = tags.value.some((t) => normalizeKey(t.name) === normalizeKey(value))
  if (exists) {
    upsertTaxonomy('tags', value)
  }
}

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

const toolbarPanel = ref<'table' | 'embed' | null>(null)

const tableForm = reactive({
  rows: 3,
  cols: 3,
  withHeaderRow: true
})

const editorImageInput = ref<HTMLInputElement | null>(null)
const editorImageFile = ref<File | null>(null)
const editorImageUploading = ref(false)
const editorImageError = ref<string | null>(null)

const embedForm = reactive({
  type: 'youtube' as 'youtube' | 'pdf' | 'image' | 'map' | 'link',
  imageSource: 'upload' as 'upload' | 'link',
  url: '',
  title: 'Dokumen PDF',
  alt: ''
})

function toggleToolbarPanel(panel: 'table' | 'embed') {
  toolbarPanel.value = toolbarPanel.value === panel ? null : panel
}

function toolbarActive(name: string, attrs?: any) {
  return editor.value?.isActive(name, attrs)
    ? 'toolbar-btn-active'
    : ''
}

function insertCustomTable() {
  editor.value
    ?.chain()
    .focus()
    .insertTable({
      rows: Math.max(1, Number(tableForm.rows || 3)),
      cols: Math.max(1, Number(tableForm.cols || 3)),
      withHeaderRow: !!tableForm.withHeaderRow
    })
    .run()

  toolbarPanel.value = null
}

function resetEmbedForm() {
  embedForm.type = 'youtube'
  embedForm.imageSource = 'upload'
  embedForm.url = ''
  embedForm.title = ''
  embedForm.alt = ''
  editorImageFile.value = null
  editorImageError.value = null

  if (editorImageInput.value) {
    editorImageInput.value.value = ''
  }
}

function extractIframeSrc(value: string) {
  const input = String(value || '').trim()
  const match = input.match(/src=["']([^"']+)["']/i)
  return match?.[1] || input
}

function toGoogleMapsEmbedUrl(value: string) {
  const raw = extractIframeSrc(value)

  if (!raw) return ''

  if (raw.includes('google.com/maps/embed')) {
    return raw
  }

  if (raw.includes('google.com/maps')) {
    return raw.replace('/maps/place/', '/maps/embed?pb=')
  }

  return raw
}

function insertTextLink(url: string, text?: string) {
  const label = text?.trim() || url

  editor.value
    ?.chain()
    .focus()
    .insertContent([
      {
        type: 'text',
        text: label,
        marks: [
          {
            type: 'link',
            attrs: {
              href: url,
              target: '_blank',
              rel: 'noopener noreferrer nofollow'
            }
          }
        ]
      },
      {
        type: 'text',
        text: ' '
      }
    ])
    .run()
}

async function submitEmbed() {
  const url = embedForm.url.trim()

  if (embedForm.type === 'youtube') {
    if (!url) return

    editor.value
      ?.chain()
      .focus()
      .setYoutubeVideo({
        src: url,
        width: 640,
        height: 360
      })
      .run()

    resetEmbedForm()
    toolbarPanel.value = null
    return
  }

  if (embedForm.type === 'pdf') {
    if (!url) return

    editor.value
      ?.chain()
      .focus()
      .insertContent({
        type: 'pdfEmbed',
        attrs: {
          src: url,
          title: embedForm.title.trim() || 'Dokumen PDF'
        }
      })
      .run()

    resetEmbedForm()
    toolbarPanel.value = null
    return
  }

  if (embedForm.type === 'map') {
    if (!url) return

    const mapUrl = toGoogleMapsEmbedUrl(url)

    editor.value
      ?.chain()
      .focus()
      .insertContent({
        type: 'mapEmbed',
        attrs: {
          src: mapUrl,
          title: embedForm.title.trim() || 'Lokasi Google Maps'
        }
      })
      .run()

    resetEmbedForm()
    toolbarPanel.value = null
    return
  }

  if (embedForm.type === 'link') {
    if (!url) return

    insertTextLink(url, embedForm.title.trim() || url)

    resetEmbedForm()
    toolbarPanel.value = null
    return
  }

  if (embedForm.type === 'image') {
    if (embedForm.imageSource === 'upload') {
      if (!editorImageFile.value) return
      await uploadAndInsertEditorImage(editorImageFile.value)
      return
    }

    if (embedForm.imageSource === 'link') {
      if (!url) return
      await uploadUrlAndInsertEditorImage(url)
    }
  }
}

const PdfEmbed = Node.create({
  name: 'pdfEmbed',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: {
        default: ''
      },
      title: {
        default: 'Dokumen PDF'
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="pdf-embed"]'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      {
        'data-type': 'pdf-embed',
        'data-src': HTMLAttributes.src || '',
        'data-title': HTMLAttributes.title || 'Dokumen PDF',
        class: 'pdf-embed'
      },
      [
        'div',
        {
          class: 'pdf-embed-title'
        },
        HTMLAttributes.title || 'Dokumen PDF'
      ],
      [
        'iframe',
        {
          src: HTMLAttributes.src || '',
          loading: 'lazy',
          class: 'pdf-embed-frame'
        }
      ]
    ]
  },

  addCommands() {
    return {
      setPdfEmbed:
        (attrs: { src: string; title?: string }) =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              src: attrs.src,
              title: attrs.title || 'Dokumen PDF'
            }
          })
        }
    } as any
  }
})
const MapEmbed = Node.create({
  name: 'mapEmbed',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: {
        default: ''
      },
      title: {
        default: 'Lokasi Google Maps'
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="map-embed"]'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      {
        'data-type': 'map-embed',
        'data-src': HTMLAttributes.src || '',
        'data-title': HTMLAttributes.title || 'Lokasi Google Maps',
        class: 'map-embed'
      },
      ['div', { class: 'map-embed-title' }, HTMLAttributes.title || 'Lokasi Google Maps'],
      [
        'iframe',
        {
          src: HTMLAttributes.src || '',
          loading: 'lazy',
          class: 'map-embed-frame',
          allowfullscreen: 'true',
          referrerpolicy: 'no-referrer-when-downgrade'
        }
      ]
    ]
  }
})

function ensureEditor() {
  if (editor.value) return

  editor.value = new Editor({
    content: '<p></p>',
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false
        }
      }),

      CloudImage.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: 'editor-image'
        }
      }),

      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') return 'Judul section...'
          return 'Tulis artikel seperti Notion atau Medium...'
        }
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: 'text-green-600 underline underline-offset-4'
        }
      }),

      Youtube.configure({
        controls: true,
        nocookie: true,
        allowFullscreen: true,
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'youtube-embed'
        }
      }),

      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'editor-table'
        }
      }),
      TableRow,
      TableHeader,
      TableCell,
      PdfEmbed,
      MapEmbed
    ],

    editorProps: {
      attributes: {
        class: 'notion-editor'
      }
    }
  })
}

onBeforeUnmount(() => editor.value?.destroy())

const form = reactive({
  title: '',
  category: '',
  segment: 'Umum',
  tags: [] as string[],
  excerpt: '',
  cover: '',
  coverPublicId: '',
  coverLink: '',
  publishedAt: Date.now()
})

const parsedTags = computed(() => form.tags)

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
const coverFile = shallowRef<File | null>(null)
const objectPreview = ref('')

const { uploading, uploadError, uploadImage, deleteImage, uploadImageFromUrl } = useCloudinaryUpload()
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
  return stepOneValid.value
})

function revokePreview() {
  if (objectPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(objectPreview.value)
  }
  objectPreview.value = ''
}

function resetForm() {
  form.title = ''
  form.segment = 'Umum'
  aiRecommendation.value = null
  form.category = ''
  form.tags = []
  form.excerpt = ''
  form.coverPublicId = ''
  form.cover = ''
  form.coverLink = ''
  form.publishedAt = Date.now()
  deletedCoverPublicId.value = null
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

function insertEditorImage(payload: {
  src: string
  publicId?: string
  alt?: string
  title?: string
}) {
  editor.value
    ?.chain()
    .focus()
    .insertContent({
      type: 'image',
      attrs: {
        src: payload.src,
        alt: payload.alt || '',
        title: payload.title || payload.alt || '',
        publicId: payload.publicId || null
      }
    })
    .run()
}

async function uploadAndInsertEditorImage(file: File) {
  editorImageError.value = null
  editorImageUploading.value = true

  try {
    const uploaded = await uploadImage(file, {
      folder: `${clientName}/news/content`,
      maxWidth: 1600,
      maxHeight: 1600,
      quality: 0.82
    })

    insertEditorImage({
      src: uploaded.secure_url,
      publicId: uploaded.public_id,
      alt: embedForm.alt || file.name.replace(/\.[^.]+$/, ''),
      title: embedForm.alt || file.name.replace(/\.[^.]+$/, '')
    })

    resetEmbedForm()
    toolbarPanel.value = null
  } catch (err: any) {
    editorImageError.value = err?.message || 'Gagal insert gambar.'
  } finally {
    editorImageUploading.value = false
  }
}

async function uploadUrlAndInsertEditorImage(url: string) {
  editorImageError.value = null
  editorImageUploading.value = true

  try {
    const uploaded = await uploadImageFromUrl(url, {
      folder: `${clientName}/news/content`,
      maxWidth: 1600,
      maxHeight: 1600,
      quality: 0.82
    })

    insertEditorImage({
      src: uploaded.secure_url,
      publicId: uploaded.public_id,
      alt: embedForm.alt || 'Gambar artikel',
      title: embedForm.alt || 'Gambar artikel'
    })

    resetEmbedForm()
    toolbarPanel.value = null
  } catch (err: any) {
    editorImageError.value = err?.message || 'Gagal insert gambar dari link.'
  } finally {
    editorImageUploading.value = false
  }
}

function onPickEditorImage(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  editorImageFile.value = file

  if (!embedForm.alt.trim()) {
    embedForm.alt = file.name.replace(/\.[^.]+$/, '')
  }
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
  form.tags = n.tags || []
  form.excerpt = n.excerpt || ''
  form.cover = n.cover || ''
  form.segment = (n as any).segment || 'Umum'
  aiRecommendation.value = null
  form.coverLink = ''
  deletedCoverPublicId.value = null
  form.publishedAt = n.publishedAt || Date.now()
  form.coverPublicId = (n as any).coverPublicId || ''
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
  if (form.coverPublicId) {
    deletedCoverPublicId.value = form.coverPublicId
  }

  form.cover = ''
  form.coverPublicId = ''
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

async function resolveCoverUpload() {
  if (coverMode.value === 'upload' && coverFile.value) {
    const uploaded = await uploadImage(coverFile.value, {
      folder: `${clientName}/news/covers`,
      maxWidth: 1600,
      maxHeight: 1600,
      quality: 0.82
    })

    return {
      cover: uploaded.secure_url,
      coverPublicId: uploaded.public_id
    }
  }

  if (coverMode.value === 'link' && form.coverLink.trim()) {
    if (!isValidUrl(form.coverLink.trim())) {
      throw new Error('Link gambar tidak valid.')
    }

    return {
      cover: form.coverLink.trim(),
      coverPublicId: ''
    }
  }

  return {
    cover: form.cover || '',
    coverPublicId: form.coverPublicId || ''
  }
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
  formError.value = null

  if (wizardStep.value === 1) {
    if (!titleValid.value) {
      formError.value = `Judul harus ${NEWS_LIMITS.title.min}-${NEWS_LIMITS.title.max} karakter.`
      return
    }

    if (!categoryValid.value) {
      formError.value = `Kategori harus ${NEWS_LIMITS.category.min}-${NEWS_LIMITS.category.max} karakter.`
      return
    }

    if (!segmentValid.value) {
      formError.value = `Segment harus ${NEWS_LIMITS.segment.min}-${NEWS_LIMITS.segment.max} karakter.`
      return
    }

    if (!tagsValid.value) {
      formError.value = `Setiap tag harus ${NEWS_LIMITS.tag.min}-${NEWS_LIMITS.tag.max} karakter dan maksimal ${NEWS_LIMITS.tag.maxCount} tag.`
      return
    }
  }

  if (wizardStep.value < 3) {
    wizardStep.value = (wizardStep.value + 1) as 1 | 2 | 3
  }
}

function runEditor(run: () => boolean) {
  run()
}

function cleanForFirebase<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_key, val) => {
      if (val === undefined) return null
      return val
    })
  )
}

async function submit() {
  if (submitLocked.value || saving.value || uploading.value) return
  if (!validateStep(1) || !validateStep(2)) return

  submitLocked.value = true
  saving.value = true
  formError.value = null

  try {
    ensureEditor()

    const oldPublicId = current.value ? ((current.value as any).coverPublicId || '') : ''
    const resolvedCover = await resolveCoverUpload()
    const shouldDeleteOldCover = !!oldPublicId && oldPublicId !== resolvedCover.coverPublicId &&
  (coverFile.value || coverMode.value === 'link' || deletedCoverPublicId.value === oldPublicId)
    const json = cleanForFirebase(editor.value!.getJSON())
    const html = editor.value!.getHTML()

    const content = cleanForFirebase({
      kind: 'tiptap' as const,
      json,
      html
    })

    if (formMode.value === 'create') {
      const createdId = await createNews({
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        cover: resolvedCover.cover,
        coverPublicId: resolvedCover.coverPublicId,
        category: form.category.trim(),
        segment: String(form.segment || 'Umum'),
        tags: parsedTags.value,
        publishedAt: form.publishedAt,
        author: currentAuthor.value,
        content
      } as any)

      await logNews('create', createdId || null, {
        title: form.title.trim(),
        category: form.category.trim(),
        tags: parsedTags.value
      })
    } else if (current.value) {
      await updateNews(current.value.id, {
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        cover: resolvedCover.cover,
        coverPublicId: resolvedCover.coverPublicId,
        category: form.category.trim(),
        segment: String(form.segment || 'Umum'),
        tags: parsedTags.value,
        publishedAt: form.publishedAt,
        updatedBy: currentAuthor.value,
        content
      } as any)

      await logNews('update', current.value.id, {
        title: form.title.trim(),
        category: form.category.trim(),
        tags: parsedTags.value,
        slug: current.value.slug
      })
    }
    if (shouldDeleteOldCover) await deleteImage(oldPublicId)
    if (deletedCoverPublicId.value && deletedCoverPublicId.value !== oldPublicId) await deleteImage(deletedCoverPublicId.value)
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

<style scoped>
.toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.25rem;
  border-radius: 0.875rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: rgb(55 65 81);
  transition: 0.2s ease;
  white-space: nowrap;
}

.toolbar-btn:hover {
  background: white;
  color: rgb(22 163 74);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.toolbar-btn-active {
  background: rgb(22 163 74);
  color: white !important;
  box-shadow: 0 10px 20px -10px rgba(22, 163, 74, 0.45);
}

.toolbar-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  border: 1px solid rgb(229 231 235);
  background: white;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: rgb(55 65 81);
  transition: 0.2s ease;
}

.toolbar-action-btn:hover {
  background: rgb(249 250 251);
  color: rgb(22 163 74);
}

.toolbar-tooltip {
  pointer-events: none;
  position: absolute;
  left: 50%;
  top: calc(100% + 8px);
  z-index: 30;
  transform: translateX(-50%) translateY(-4px);
  white-space: nowrap;
  border-radius: 0.625rem;
  background: rgb(17 24 39);
  padding: 0.375rem 0.5rem;
  font-size: 11px;
  font-weight: 600;
  color: white;
  opacity: 0;
  transition: 0.18s ease;
}

.group:hover .toolbar-tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* Editor shell */
.editor-shell :deep(.ProseMirror),
:deep(.notion-editor) {
  min-height: 460px;
  outline: none;
  padding: 1.5rem;
  font-size: 1rem;
  line-height: 1.8;
  color: rgb(17 24 39);
}

/* Paragraph */
.editor-shell :deep(.ProseMirror p),
:deep(.notion-editor p) {
  margin: 0.75rem 0;
  line-height: 1.8;
}

/* Heading */
.editor-shell :deep(.ProseMirror h1),
:deep(.notion-editor h1) {
  margin: 1.75rem 0 1rem;
  font-size: 2rem;
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -0.035em;
  color: rgb(17 24 39);
}

.editor-shell :deep(.ProseMirror h2),
:deep(.notion-editor h2) {
  margin: 1.5rem 0 0.875rem;
  font-size: 1.5rem;
  line-height: 1.3;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: rgb(17 24 39);
}

.editor-shell :deep(.ProseMirror h3),
:deep(.notion-editor h3) {
  margin: 1.25rem 0 0.75rem;
  font-size: 1.25rem;
  line-height: 1.35;
  font-weight: 700;
  color: rgb(17 24 39);
}

/* Bold & Italic */
.editor-shell :deep(.ProseMirror strong),
:deep(.notion-editor strong) {
  font-weight: 800;
}

.editor-shell :deep(.ProseMirror em),
:deep(.notion-editor em) {
  font-style: italic;
}

/* List fix */
.editor-shell :deep(.ProseMirror ul),
:deep(.notion-editor ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 0.75rem 0;
}

.editor-shell :deep(.ProseMirror ol),
:deep(.notion-editor ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin: 0.75rem 0;
}

.editor-shell :deep(.ProseMirror li),
:deep(.notion-editor li) {
  margin: 0.35rem 0;
  padding-left: 0.25rem;
}

/* Quote */
.editor-shell :deep(.ProseMirror blockquote),
:deep(.notion-editor blockquote) {
  margin: 1rem 0;
  border-left: 4px solid rgb(34 197 94);
  border-radius: 0.75rem;
  background: rgb(240 253 244);
  padding: 0.75rem 1rem;
  color: rgb(55 65 81);
}

/* Table */
.editor-shell :deep(.ProseMirror table),
:deep(.notion-editor table),
:deep(.editor-table) {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin: 1rem 0;
  overflow: hidden;
  border-radius: 1rem;
}

.editor-shell :deep(.ProseMirror th),
.editor-shell :deep(.ProseMirror td),
:deep(.notion-editor th),
:deep(.notion-editor td) {
  border: 1px solid rgb(229 231 235);
  padding: 0.75rem;
  vertical-align: top;
  min-width: 1em;
}

.editor-shell :deep(.ProseMirror th),
:deep(.notion-editor th) {
  background: rgb(249 250 251);
  font-weight: 800;
}

/* Selected table cell */
.editor-shell :deep(.ProseMirror .selectedCell::after) {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(34, 197, 94, 0.12);
  pointer-events: none;
}

/* YouTube */
.editor-shell :deep(.youtube-embed),
.editor-shell :deep(iframe[src*='youtube']),
.editor-shell :deep(iframe[src*='youtu.be']),
:deep(.notion-editor iframe[src*='youtube']),
:deep(.notion-editor iframe[src*='youtu.be']) {
  width: 100%;
  aspect-ratio: 16 / 9;
  height: auto;
  border: 0;
  border-radius: 1rem;
  margin: 1rem 0;
}

/* PDF */
.editor-shell :deep(.pdf-embed),
:deep(.notion-editor .pdf-embed) {
  margin: 1rem 0;
  overflow: hidden;
  border: 1px solid rgb(229 231 235);
  border-radius: 1rem;
  background: rgb(249 250 251);
}

.editor-shell :deep(.pdf-embed-title),
:deep(.notion-editor .pdf-embed-title) {
  border-bottom: 1px solid rgb(229 231 235);
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 800;
  color: rgb(55 65 81);
}

.editor-shell :deep(.pdf-embed-frame),
:deep(.notion-editor .pdf-embed-frame) {
  height: 420px;
  width: 100%;
  border: 0;
  background: white;
}

/* Placeholder */
:deep(.notion-editor .is-empty::before),
.editor-shell :deep(.ProseMirror .is-empty::before) {
  content: attr(data-placeholder);
  float: left;
  height: 0;
  color: rgb(156 163 175);
  pointer-events: none;
}

/* Dark mode */
.dark .editor-shell :deep(.ProseMirror),
.dark :deep(.notion-editor) {
  color: rgb(245 245 245);
}

.dark .editor-shell :deep(.ProseMirror h1),
.dark .editor-shell :deep(.ProseMirror h2),
.dark .editor-shell :deep(.ProseMirror h3),
.dark :deep(.notion-editor h1),
.dark :deep(.notion-editor h2),
.dark :deep(.notion-editor h3) {
  color: white;
}

.dark .editor-shell :deep(.ProseMirror blockquote),
.dark :deep(.notion-editor blockquote) {
  background: rgba(22, 163, 74, 0.12);
  color: rgb(229 229 229);
}

.dark .editor-shell :deep(.ProseMirror th),
.dark :deep(.notion-editor th) {
  background: rgb(38 38 38);
}

.dark .editor-shell :deep(.ProseMirror th),
.dark .editor-shell :deep(.ProseMirror td),
.dark :deep(.notion-editor th),
.dark :deep(.notion-editor td) {
  border-color: rgb(64 64 64);
}

:deep(.map-embed) {
  margin: 1.25rem 0;
  overflow: hidden;
  border: 1px solid rgb(229 231 235);
  border-radius: 1rem;
  background: rgb(249 250 251);
}

:deep(.map-embed-title) {
  border-bottom: 1px solid rgb(229 231 235);
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 800;
  color: rgb(55 65 81);
}

:deep(.map-embed-frame) {
  width: 100%;
  height: 420px;
  border: 0;
  background: white;
}

.dark :deep(.map-embed) {
  border-color: rgb(64 64 64);
  background: rgb(23 23 23);
}

.dark :deep(.map-embed-title) {
  border-color: rgb(64 64 64);
  color: rgb(229 229 229);
}
</style>