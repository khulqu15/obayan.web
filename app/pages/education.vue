<template>
  <section id="education" class="relative pt-24 min-h-screen overflow-hidden bg-[#f7fbf7] text-slate-950 dark:bg-neutral-950 dark:text-white">
    <!-- Soft green ambience -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -left-40 top-10 h-[38rem] w-[38rem] rounded-full bg-green-200/55 blur-3xl dark:bg-green-900/20"></div>
      <div class="absolute -right-44 top-[34rem] h-[34rem] w-[34rem] rounded-full bg-green-200/45 blur-3xl dark:bg-green-900/10"></div>
      <div class="absolute inset-0 opacity-[0.38] [mask-image:radial-gradient(70%_58%_at_50%_18%,#000,transparent_80%)]">
        <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(22,163,74,.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(22,163,74,.10)_1px,transparent_1px)] bg-[size:38px_38px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.055)_1px,transparent_1px)]"></div>
      </div>
    </div>

    <div class="relative pt-24 mx-auto max-w-[92rem] px-4 pb-6 sm:px-6 lg:px-8 lg:py-8">
      <!-- DETAIL VIEW -->
      <div v-if="isDetail" class="mx-auto max-w-[86rem]">
        <div class="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button
            type="button"
            class="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-2xl border border-green-200 bg-white/90 px-4 text-sm font-black text-green-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-green-50 dark:border-green-900/40 dark:bg-neutral-900/85 dark:text-green-300 dark:hover:bg-green-900/10"
            @click="goToAllEducation"
          >
            <Icon icon="lucide:grid-3x3" class="size-4" />
            Semua Edukasi
          </button>

          <div class="flex flex-wrap items-center gap-2">
            <button
              v-if="currentItem"
              type="button"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-green-200 bg-white/90 px-4 text-sm font-black text-green-700 shadow-sm backdrop-blur transition hover:bg-green-50 dark:border-green-900/40 dark:bg-neutral-900/85 dark:text-green-300 dark:hover:bg-green-900/10"
              @click="openLearnModal(currentItem)"
            >
              <Icon icon="lucide:sparkles" class="size-4" />
              Pelajari
            </button>

            <button
              type="button"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm font-bold text-slate-700 shadow-sm backdrop-blur transition hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900/85 dark:text-neutral-200 dark:hover:bg-neutral-800"
              @click="copyLink"
            >
              <Icon :icon="copied ? 'lucide:check' : 'lucide:link'" class="size-4" />
              {{ copied ? 'Tersalin' : 'Salin URL' }}
            </button>

            <button
              type="button"
              data-hs-overlay="#hs-education-share-modal"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:-translate-y-0.5 hover:bg-green-700"
            >
              <Icon icon="lucide:share-2" class="size-4" />
              Bagikan
            </button>
          </div>
        </div>

        <div v-if="pending" class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div class="overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="h-10 w-2/3 animate-pulse rounded-2xl bg-slate-200 dark:bg-neutral-800"></div>
            <div class="mt-4 h-5 w-1/2 animate-pulse rounded-xl bg-slate-200 dark:bg-neutral-800"></div>
            <div class="mt-6 h-[28rem] animate-pulse rounded-[1.75rem] bg-slate-200 dark:bg-neutral-800"></div>
            <div class="mt-6 space-y-3">
              <div class="h-4 animate-pulse rounded bg-slate-200 dark:bg-neutral-800"></div>
              <div class="h-4 w-11/12 animate-pulse rounded bg-slate-200 dark:bg-neutral-800"></div>
              <div class="h-4 w-10/12 animate-pulse rounded bg-slate-200 dark:bg-neutral-800"></div>
            </div>
          </div>
          <div class="h-96 animate-pulse rounded-[2.25rem] bg-white shadow-sm dark:bg-neutral-900"></div>
        </div>

        <div
          v-else-if="!currentItem"
          class="overflow-hidden rounded-[2.5rem] border border-dashed border-green-200 bg-white/88 p-8 text-center shadow-sm backdrop-blur dark:border-green-900/40 dark:bg-neutral-900/82 sm:p-12"
        >
          <div class="mx-auto grid size-16 place-items-center rounded-[1.5rem] bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300">
            <Icon icon="lucide:book-open-check" class="size-8" />
          </div>
          <h1 class="mt-5 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            {{ cfg.texts.notFound }}
          </h1>
          <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-neutral-400">
            Program yang dibuka belum tersedia atau slug-nya berubah. Data halaman ini disinkronkan dari section OtherEducation.
          </p>
          <button
            type="button"
            class="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
            @click="goToAllEducation"
          >
            <Icon icon="lucide:grid-3x3" class="size-4" />
            Lihat semua edukasi
          </button>
        </div>

        <article v-else class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
          <!-- Detail main content -->
          <div class="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <header class="relative overflow-hidden p-5 sm:p-8 lg:p-10">
              <div aria-hidden="true" class="absolute -right-20 -top-24 size-72 rounded-full bg-green-100 blur-3xl dark:bg-green-900/20"></div>
              <div aria-hidden="true" class="absolute -bottom-28 left-8 size-72 rounded-full bg-green-100 blur-3xl dark:bg-green-900/10"></div>

              <div class="relative">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700 ring-1 ring-green-100 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-900/40">
                    <Icon :icon="categoryIcon(currentItem.category)" class="size-3.5" />
                    {{ currentItem.category || 'Pendidikan' }}
                  </span>
                  <span v-if="currentItem.interval" class="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-100 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700">
                    <Icon icon="lucide:repeat" class="size-3.5" />
                    {{ currentItem.interval }}
                  </span>
                </div>

                <h1 class="mt-5 max-w-5xl text-3xl font-black tracking-[-0.045em] text-slate-950 dark:text-white sm:text-5xl sm:leading-[1.04]">
                  {{ currentItem.title }}
                </h1>

                <p v-if="currentItem.short_description" class="mt-4 max-w-3xl text-base leading-8 text-slate-600 dark:text-neutral-300">
                  {{ currentItem.short_description }}
                </p>

                <div class="mt-7 grid gap-3 sm:grid-cols-3">
                  <div class="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-950/60">
                    <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-400 dark:text-neutral-500">
                      <Icon icon="lucide:map-pin" class="size-4 text-green-600 dark:text-green-300" />
                      Lokasi
                    </div>
                    <p class="mt-2 line-clamp-2 text-sm font-black text-slate-900 dark:text-white">
                      {{ currentItem.location || 'Belum diatur' }}
                    </p>
                  </div>

                  <div class="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-950/60">
                    <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-400 dark:text-neutral-500">
                      <Icon icon="lucide:calendar-days" class="size-4 text-green-600 dark:text-green-300" />
                      Jadwal
                    </div>
                    <p class="mt-2 line-clamp-2 text-sm font-black text-slate-900 dark:text-white">
                      {{ dateRangeLabel(currentItem.start_date, currentItem.end_date) || currentItem.interval || 'Fleksibel' }}
                    </p>
                  </div>

                  <div class="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-950/60">
                    <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-400 dark:text-neutral-500">
                      <Icon icon="lucide:timer" class="size-4 text-green-600 dark:text-green-300" />
                      Baca
                    </div>
                    <p class="mt-2 line-clamp-2 text-sm font-black text-slate-900 dark:text-white">
                      {{ currentItem.readTime }} menit
                    </p>
                  </div>
                </div>
              </div>
            </header>

            <div v-if="currentItem.image" class="px-5 sm:px-8 lg:px-10">
              <button
                type="button"
                class="group relative block w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-sm dark:border-neutral-800 dark:bg-neutral-800"
                @click="openImageModal(currentItem)"
              >
                <img :src="currentItem.image" :alt="currentItem.title" class="max-h-[600px] w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/55 to-transparent"></div>
                <div class="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-2xl bg-white/18 px-4 py-2 text-xs font-black text-white ring-1 ring-white/20 backdrop-blur">
                  <Icon icon="lucide:maximize-2" class="size-4" />
                  Preview
                </div>
              </button>
            </div>

            <div class="p-5 sm:p-8 lg:p-10">
              <div class="education-rich-content" v-html="detailHtml"></div>

              <div v-if="currentItem.tags.length" class="mt-8 flex flex-wrap gap-2 border-t border-slate-200 pt-6 dark:border-neutral-800">
                <button
                  v-for="tag in currentItem.tags"
                  :key="tag"
                  type="button"
                  class="rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 ring-1 ring-green-100 transition hover:bg-green-600 hover:text-white dark:bg-green-900/20 dark:text-green-300 dark:ring-green-900/40"
                  @click="openTagFromDetail(tag)"
                >
                  #{{ tag }}
                </button>
              </div>

              <div class="mt-8 flex flex-col gap-3 rounded-[2rem] border border-green-100 bg-linear-to-br from-green-50 via-white to-green-50 p-4 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-950 dark:to-neutral-950 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm font-black text-slate-950 dark:text-white">Ingin melihat program lainnya?</p>
                  <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">Kembali ke katalog untuk membandingkan semua edukasi yang tersedia.</p>
                </div>
                <button
                  type="button"
                  class="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                  @click="goToAllEducation"
                >
                  Semua Edukasi
                  <Icon icon="lucide:grid-3x3" class="size-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Detail side panel -->
          <aside class="space-y-5 xl:sticky xl:top-6 xl:self-start">
            <div class="overflow-hidden rounded-[2.25rem] border border-green-100 bg-linear-to-br from-green-600 via-green-600 to-green-500 p-5 text-white shadow-[0_24px_80px_-36px_rgba(22,163,74,.75)] dark:border-green-900/40">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-xs font-bold uppercase tracking-[0.16em] text-green-100">Sinkron Hero</p>
                  <h2 class="mt-2 text-xl font-black tracking-tight">Ringkasan Cepat</h2>
                </div>
                <div class="grid size-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                  <Icon icon="lucide:sparkles" class="size-6" />
                </div>
              </div>

              <div class="mt-5 space-y-3">
                <div class="rounded-2xl bg-white/14 p-4 ring-1 ring-white/15 backdrop-blur">
                  <p class="text-xs font-bold text-green-100">Kategori</p>
                  <p class="mt-1 text-sm font-black">{{ currentItem.category || 'Pendidikan' }}</p>
                </div>
                <div class="rounded-2xl bg-white/14 p-4 ring-1 ring-white/15 backdrop-blur">
                  <p class="text-xs font-bold text-green-100">Jadwal</p>
                  <p class="mt-1 text-sm font-black">{{ currentItem.interval || dateRangeLabel(currentItem.start_date, currentItem.end_date) || 'Fleksibel' }}</p>
                </div>
                <div class="rounded-2xl bg-white/14 p-4 ring-1 ring-white/15 backdrop-blur">
                  <p class="text-xs font-bold text-green-100">Lokasi</p>
                  <p class="mt-1 text-sm font-black">{{ currentItem.location || 'Belum diatur' }}</p>
                </div>
              </div>

              <div class="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  class="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-black text-green-700 transition hover:bg-green-50"
                  @click="openLearnModal(currentItem)"
                >
                  Pelajari
                </button>
                <button
                  type="button"
                  class="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-white/15 px-4 text-sm font-black text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-white/25"
                  @click="copyLink"
                >
                  Share
                </button>
              </div>
            </div>

            <div v-if="relatedItems.length" class="rounded-[2.25rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div>
                <p class="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-[11px] font-black text-green-700 ring-1 ring-green-100 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-900/40">
                  <Icon icon="lucide:compass" class="size-3.5" />
                  Rekomendasi
                </p>
                <h3 class="mt-3 text-lg font-black text-slate-950 dark:text-white">Program terkait</h3>
              </div>

              <div class="mt-4 space-y-3">
                <button
                  v-for="item in relatedItems"
                  :key="item.slug"
                  type="button"
                  class="group flex w-full gap-3 rounded-[1.35rem] border border-slate-200 bg-slate-50 p-2 text-left transition hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50 dark:border-neutral-800 dark:bg-neutral-950/60 dark:hover:border-green-900/50 dark:hover:bg-green-900/10"
                  @click="openDetail(item.slug)"
                >
                  <img v-if="item.image" :src="item.image" :alt="item.title" class="size-16 shrink-0 rounded-2xl object-cover" />
                  <div v-else class="grid size-16 shrink-0 place-items-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    <Icon icon="lucide:book-open" class="size-6" />
                  </div>
                  <div class="min-w-0 flex-1 py-1">
                    <p class="line-clamp-2 text-sm font-black text-slate-900 group-hover:text-green-700 dark:text-white dark:group-hover:text-green-300">
                      {{ item.title }}
                    </p>
                    <p class="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-neutral-400">
                      {{ item.category || 'Pendidikan' }} · {{ item.readTime }} menit
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </aside>
        </article>
      </div>

      <!-- LIST VIEW -->
      <div v-else>
        <!-- Hero catalogue, intentionally different from news.vue and synced with OtherEducation -->
        <section class="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,.9fr)] xl:items-stretch">
          <div class="relative overflow-hidden rounded-[2.75rem] border border-green-100 bg-white/88 p-6 shadow-sm backdrop-blur dark:border-green-900/30 dark:bg-neutral-900/82 sm:p-8 lg:p-10">
            <div aria-hidden="true" class="absolute -right-24 -top-24 size-80 rounded-full bg-green-100 blur-3xl dark:bg-green-900/25"></div>
            <div aria-hidden="true" class="absolute -bottom-24 left-10 size-72 rounded-full bg-green-100 blur-3xl dark:bg-green-900/10"></div>

            <div class="relative z-10">
              <div class="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 shadow-sm dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-300">
                <span class="size-2 rounded-full bg-green-500"></span>
                {{ cfg.eyebrow }}
              </div>

              <h1 class="mt-5 max-w-4xl text-4xl font-black tracking-[-0.06em] text-slate-950 dark:text-white sm:text-6xl sm:leading-[1.02]">
                {{ cfg.title }}
              </h1>

              <p class="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-neutral-300 sm:text-lg">
                {{ cfg.subtitle }}
              </p>

              <div class="mt-7 grid gap-3 sm:grid-cols-3">
                <div class="rounded-[1.5rem] border border-slate-200 bg-white/75 p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/50">
                  <p class="text-xs font-bold text-slate-400 dark:text-neutral-500">Total Program</p>
                  <p class="mt-1 text-3xl font-black text-slate-950 dark:text-white">{{ items.length }}</p>
                </div>
                <div class="rounded-[1.5rem] border border-slate-200 bg-white/75 p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/50">
                  <p class="text-xs font-bold text-slate-400 dark:text-neutral-500">Kategori</p>
                  <p class="mt-1 text-3xl font-black text-slate-950 dark:text-white">{{ categories.length }}</p>
                </div>
                <div class="rounded-[1.5rem] border border-slate-200 bg-white/75 p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/50">
                  <p class="text-xs font-bold text-slate-400 dark:text-neutral-500">Tags</p>
                  <p class="mt-1 text-3xl font-black text-slate-950 dark:text-white">{{ allTags.length }}</p>
                </div>
              </div>

              <div class="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <label class="relative min-w-0 flex-1">
                  <Icon icon="lucide:search" class="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                  <input
                    v-model="q"
                    type="text"
                    :placeholder="cfg.texts.searchPlaceholder"
                    class="h-14 w-full rounded-[1.35rem] border border-slate-200 bg-white pl-12 pr-24 text-sm font-semibold text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-green-400 focus:shadow-[0_0_0_4px_rgba(34,197,94,.12)] dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
                  />
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    {{ filtered.length }} hasil
                  </span>
                </label>

                <button
                  type="button"
                  class="inline-flex h-14 items-center justify-center gap-2 rounded-[1.35rem] bg-green-600 px-5 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:-translate-y-0.5 hover:bg-green-700"
                  @click="scrollToPrograms"
                >
                  <Icon icon="lucide:arrow-down" class="size-4" />
                  Jelajahi
                </button>
              </div>
            </div>
          </div>

          <div class="grid gap-5">
            <div
              v-if="highlightItem"
              class="group relative min-h-[390px] overflow-hidden rounded-[2.75rem] border border-slate-200 bg-slate-950 shadow-sm transition hover:-translate-y-1 hover:shadow-2xl dark:border-neutral-800"
            >
              <button
                type="button"
                class="absolute inset-0 text-left"
                @click="openDetail(highlightItem.slug)"
                aria-label="Buka detail program pilihan"
              >
                <img v-if="highlightItem.image" :src="highlightItem.image" :alt="highlightItem.title" class="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-[1.04]" />
                <div v-else class="absolute inset-0 bg-linear-to-br from-green-700 via-green-600 to-green-500"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/42 to-black/10"></div>
              </button>

              <div class="pointer-events-none relative z-10 flex min-h-[390px] flex-col justify-between p-6 text-white sm:p-7">
                <div class="flex items-center justify-between gap-3">
                  <span class="rounded-full bg-white/15 px-3 py-1.5 text-xs font-black ring-1 ring-white/20 backdrop-blur">
                    Sinkron dari OtherEducation
                  </span>
                  <span class="grid size-11 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur transition group-hover:bg-white group-hover:text-green-700">
                    <Icon icon="lucide:arrow-up-right" class="size-5" />
                  </span>
                </div>

                <div>
                  <p class="text-sm font-bold text-green-100">{{ highlightItem.category || 'Pendidikan' }}</p>
                  <h2 class="mt-2 line-clamp-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                    {{ highlightItem.title }}
                  </h2>
                  <p class="mt-3 line-clamp-2 text-sm leading-6 text-white/82">
                    {{ highlightItem.short_description || textPreview(highlightItem.description_rich_tiptap) || 'Detail program tersedia pada halaman edukasi.' }}
                  </p>

                  <div class="pointer-events-auto mt-5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-black text-slate-950 transition hover:bg-white/90"
                      @click="openLearnModal(highlightItem)"
                    >
                      Pelajari
                      <Icon icon="lucide:sparkles" class="size-4" />
                    </button>
                    <button
                      type="button"
                      class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-black text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700"
                      @click="openDetail(highlightItem.slug)"
                    >
                      Detail
                      <Icon icon="lucide:arrow-up-right" class="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="rounded-[1.8rem] border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/86">
                <div class="grid size-11 place-items-center rounded-2xl bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300">
                  <Icon icon="lucide:calendar-check" class="size-5" />
                </div>
                <p class="mt-4 text-sm font-bold text-slate-500 dark:text-neutral-400">Terjadwal</p>
                <p class="mt-1 text-2xl font-black text-slate-950 dark:text-white">{{ activeScheduleCount }}</p>
              </div>
              <div class="rounded-[1.8rem] border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/86">
                <div class="grid size-11 place-items-center rounded-2xl bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300">
                  <Icon icon="lucide:map-pinned" class="size-5" />
                </div>
                <p class="mt-4 text-sm font-bold text-slate-500 dark:text-neutral-400">Lokasi</p>
                <p class="mt-1 text-2xl font-black text-slate-950 dark:text-white">{{ locationsCount }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Filter dock -->
        <section id="education-programs" class="mt-6 rounded-[2.25rem] border border-slate-200 bg-white/82 p-4 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/82">
          <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div class="flex gap-2 overflow-x-auto pb-1 xl:flex-wrap xl:overflow-visible xl:pb-0">
              <button
                type="button"
                class="shrink-0 rounded-full px-4 py-2 text-xs font-black transition"
                :class="selectedCategory === '' ? 'bg-green-600 text-white shadow-lg shadow-green-500/20' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800'"
                @click="selectedCategory = ''"
              >
                Semua
              </button>

              <button
                v-for="category in categories.slice(0, 10)"
                :key="category"
                type="button"
                class="shrink-0 rounded-full px-4 py-2 text-xs font-black transition"
                :class="selectedCategory === category ? 'bg-green-600 text-white shadow-lg shadow-green-500/20' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800'"
                @click="selectedCategory = category"
              >
                {{ category }}
              </button>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
              <select
                v-model="sortBy"
                class="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none transition focus:border-green-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200"
              >
                <option value="recommended">Rekomendasi</option>
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="title">Judul A-Z</option>
              </select>

              <button
                type="button"
                class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-800"
                @click="resetFilters"
              >
                <Icon icon="lucide:rotate-ccw" class="size-4" />
                Reset
              </button>
            </div>
          </div>

          <div v-if="allTags.length" class="mt-4 flex gap-2 overflow-x-auto pb-1">
            <button
              v-for="tag in allTags.slice(0, 16)"
              :key="tag"
              type="button"
              class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black transition"
              :class="selectedTags.includes(tag) ? 'bg-green-600 text-white shadow-lg shadow-green-500/20' : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800'"
              @click="toggleTag(tag)"
            >
              #{{ tag }}
            </button>
          </div>
        </section>

        <!-- Content layout -->
        <section class="mt-6 grid gap-6 xl:grid-cols-1">
          <main>
            <div v-if="pending" class="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              <div v-for="i in 6" :key="i" class="rounded-[2.25rem] border border-slate-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div class="h-52 animate-pulse rounded-[1.5rem] bg-slate-200 dark:bg-neutral-800"></div>
                <div class="p-3">
                  <div class="h-4 w-28 animate-pulse rounded bg-slate-200 dark:bg-neutral-800"></div>
                  <div class="mt-3 h-6 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-neutral-800"></div>
                  <div class="mt-3 h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-neutral-800"></div>
                  <div class="mt-2 h-4 w-10/12 animate-pulse rounded bg-slate-200 dark:bg-neutral-800"></div>
                </div>
              </div>
            </div>

            <div v-else-if="filtered.length === 0" class="rounded-[2.25rem] border border-dashed border-green-200 bg-white/82 p-10 text-center shadow-sm dark:border-green-900/40 dark:bg-neutral-900/82">
              <div class="mx-auto grid size-16 place-items-center rounded-[1.5rem] bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300">
                <Icon icon="lucide:search-x" class="size-8" />
              </div>
              <h3 class="mt-5 text-xl font-black text-slate-950 dark:text-white">{{ cfg.texts.emptyList }}</h3>
              <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-neutral-400">
                Coba reset filter atau gunakan kata kunci lain untuk menemukan program pendidikan.
              </p>
              <button
                type="button"
                class="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                @click="resetFilters"
              >
                <Icon icon="lucide:rotate-ccw" class="size-4" />
                Reset Filter
              </button>
            </div>

            <div v-else class="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              <article
                v-for="(item, index) in paged"
                :key="item.slug"
                class="rounded-[2.25rem] group overflow-hidden border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-green-900/50"
              >
                <div>
                  <button
                    type="button"
                    class="relative overflow-hidden bg-slate-100 text-left dark:bg-neutral-800"
                    :class="index === 0 ? 'min-h-[300px] md:min-h-full' : 'aspect-[16/10] w-full'"
                    @click="openDetail(item.slug)"
                  >
                    <img v-if="item.image" :src="item.image" :alt="item.title" class="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
                    <div v-else class="grid h-full place-items-center bg-linear-to-br from-green-100 to-green-50 text-green-700 dark:from-green-900/20 dark:to-neutral-800 dark:text-green-300">
                      <Icon icon="lucide:book-open-check" class="size-12" />
                    </div>

                    <div class="absolute left-3 top-3 flex flex-wrap gap-2">
                      <span class="rounded-full bg-black/60 px-3 py-1 text-[11px] font-black text-white backdrop-blur">
                        {{ item.category || 'Pendidikan' }}
                      </span>
                    </div>
                  </button>

                  <div class="flex flex-col p-5">
                    <div>
                      <div class="flex items-center justify-between gap-3 text-xs font-bold text-slate-500 dark:text-neutral-400">
                        <span class="inline-flex items-center gap-1.5">
                          <Icon icon="lucide:calendar-days" class="size-4 text-green-600 dark:text-green-300" />
                          {{ periodLabel(item) }}
                        </span>
                        <span>{{ item.readTime }} min</span>
                      </div>

                      <button type="button" class="mt-3 block text-left" @click="openDetail(item.slug)">
                        <h3 class="font-black tracking-[-0.035em] text-slate-950 transition group-hover:text-green-700 dark:text-white dark:group-hover:text-green-300" :class="index === 0 ? 'text-2xl sm:text-3xl' : 'line-clamp-2 text-lg'">
                          {{ item.title }}
                        </h3>
                      </button>

                      <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-neutral-300 line-clamp-3">
                        {{ item.short_description || textPreview(item.description_rich_tiptap) || 'Detail program pendidikan tersedia pada halaman ini.' }}
                      </p>
                    </div>

                    <div class="mt-5 flex flex-wrap items-center gap-2">
                      <span v-if="item.location" class="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600 ring-1 ring-slate-100 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700">
                        <Icon icon="lucide:map-pin" class="size-3.5" />
                        {{ item.location }}
                      </span>
                      <span v-for="tag in item.tags.slice(0, 3)" :key="tag" class="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
                        #{{ tag }}
                      </span>
                    </div>

                    <div class="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 dark:border-neutral-800">
                      <button
                        type="button"
                        class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-xs font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                        @click="openLearnModal(item)"
                      >
                        Pelajari
                        <Icon icon="lucide:sparkles" class="size-4" />
                      </button>

                      <button
                        type="button"
                        class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        @click="openDetail(item.slug)"
                      >
                        Detail
                        <Icon icon="lucide:arrow-up-right" class="size-4" />
                      </button>

                      <button
                        type="button"
                        class="ml-auto grid size-10 place-items-center rounded-2xl bg-green-50 text-green-700 transition hover:bg-green-600 hover:text-white dark:bg-green-900/20 dark:text-green-300"
                        @click="openImageModal(item)"
                      >
                        <Icon icon="lucide:image" class="size-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <div v-if="hasMore && !pending" class="mt-8 text-center">
              <button
                type="button"
                class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                @click="loadMore"
              >
                <Icon icon="lucide:arrow-down-circle" class="size-5 text-green-600 dark:text-green-300" />
                {{ cfg.texts.loadMore }}
              </button>
            </div>
          </main>
        </section>
      </div>

      <!-- SHARE MODAL -->
      <div
        id="hs-education-share-modal"
        class="hs-overlay hidden fixed inset-0 z-[80] overflow-y-auto pointer-events-none [--overlay-backdrop:rgba(15,23,42,.65)]"
        role="dialog"
        aria-labelledby="hs-education-share-modal-label"
        aria-modal="true"
      >
        <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-300 mx-auto mt-0 flex min-h-[calc(100%-3.5rem)] w-full items-center p-4 opacity-0 transition-all sm:max-w-lg">
          <div class="pointer-events-auto w-full overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div class="relative overflow-hidden bg-linear-to-br from-green-600 via-green-600 to-green-500 p-5 text-white">
              <div class="absolute -right-12 -top-12 size-36 rounded-full bg-white/20 blur-3xl"></div>
              <div class="relative flex items-start justify-between gap-4">
                <div>
                  <p class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-black ring-1 ring-white/20 backdrop-blur">
                    <Icon icon="lucide:share-2" class="size-3.5" />
                    Bagikan Program
                  </p>
                  <h3 id="hs-education-share-modal-label" class="mt-3 text-xl font-black tracking-tight">
                    Sebarkan informasi edukasi
                  </h3>
                  <p class="mt-1 line-clamp-2 text-sm text-green-50">{{ shareText }}</p>
                </div>
                <button type="button" class="grid size-9 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20 transition hover:bg-white/25" data-hs-overlay="#hs-education-share-modal" aria-label="Tutup">
                  <Icon icon="lucide:x" class="size-5" />
                </button>
              </div>
            </div>

            <div class="space-y-5 p-5">
              <div class="grid grid-cols-2 gap-3">
                <button type="button" class="share-option" @click="nativeShare">
                  <span class="share-icon bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                    <Icon icon="lucide:smartphone" class="size-5" />
                  </span>
                  <span>
                    <span class="block text-sm font-black text-slate-950 dark:text-white">Sistem</span>
                    <span class="block text-xs text-slate-500 dark:text-neutral-400">Native share</span>
                  </span>
                </button>

                <a :href="whatsappHref" target="_blank" rel="noopener" class="share-option">
                  <span class="share-icon bg-green-600 text-white">
                    <Icon icon="mdi:whatsapp" class="size-5" />
                  </span>
                  <span>
                    <span class="block text-sm font-black text-slate-950 dark:text-white">WhatsApp</span>
                    <span class="block text-xs text-slate-500 dark:text-neutral-400">Kirim chat</span>
                  </span>
                </a>

                <a :href="facebookHref" target="_blank" rel="noopener" class="share-option">
                  <span class="share-icon bg-green-600 text-white">
                    <Icon icon="mdi:facebook" class="size-5" />
                  </span>
                  <span>
                    <span class="block text-sm font-black text-slate-950 dark:text-white">Facebook</span>
                    <span class="block text-xs text-slate-500 dark:text-neutral-400">Bagikan post</span>
                  </span>
                </a>

                <a :href="twitterHref" target="_blank" rel="noopener" class="share-option">
                  <span class="share-icon bg-black text-white">
                    <Icon icon="ri:twitter-x-fill" class="size-5" />
                  </span>
                  <span>
                    <span class="block text-sm font-black text-slate-950 dark:text-white">X</span>
                    <span class="block text-xs text-slate-500 dark:text-neutral-400">Tweet link</span>
                  </span>
                </a>
              </div>

              <div class="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-3 dark:border-neutral-800 dark:bg-neutral-950">
                <label class="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500 dark:text-neutral-400">Link Program</label>
                <div class="flex gap-2">
                  <input :value="canonical" readonly class="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200" />
                  <button type="button" class="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-green-700" @click="copyLink">
                    <Icon icon="lucide:copy" class="size-4" />
                    {{ copied ? 'Tersalin' : 'Salin' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- LEARN MODAL -->
      <Teleport to="body">
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="translate-y-4 opacity-0 scale-[0.98]"
          enter-to-class="translate-y-0 opacity-100 scale-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="translate-y-0 opacity-100 scale-100"
          leave-to-class="translate-y-4 opacity-0 scale-[0.98]"
        >
          <div
            v-if="learnModal.show && learnModal.item"
            class="fixed inset-0 z-[10000] bg-slate-950/70 px-4 py-6 backdrop-blur-md sm:py-8"
            @click.self="closeLearnModal"
          >
            <div class="flex min-h-full items-center justify-center">
              <div class="flex max-h-[calc(100vh-3rem)] w-full max-w-5xl flex-col overflow-hidden rounded-[2.35rem] border border-slate-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950 sm:max-h-[calc(100vh-4rem)]">
                <div class="relative shrink-0 overflow-hidden border-b border-slate-200 bg-linear-to-br from-green-600 via-green-600 to-green-500 p-5 text-white dark:border-neutral-800 md:p-7">
                  <div class="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/20 blur-3xl"></div>
                  <div class="absolute -bottom-16 left-8 h-36 w-36 rounded-full bg-green-200/30 blur-3xl"></div>

                  <div class="relative z-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div class="min-w-0">
                      <div class="flex flex-wrap items-center gap-2">
                        <span v-if="learnModal.item.category" class="rounded-full bg-white/15 px-3 py-1.5 text-xs font-black text-white ring-1 ring-white/15 backdrop-blur">
                          {{ learnModal.item.category }}
                        </span>
                        <span v-if="learnModal.item.interval" class="rounded-full bg-white/15 px-3 py-1.5 text-xs font-black text-white ring-1 ring-white/15 backdrop-blur">
                          {{ learnModal.item.interval }}
                        </span>
                      </div>

                      <h3 class="mt-4 text-2xl font-black leading-tight tracking-[-0.035em] md:text-4xl">
                        {{ learnModal.item.title }}
                      </h3>

                      <p class="mt-3 max-w-3xl text-sm leading-7 text-green-50/90 md:text-base">
                        {{ learnModal.item.short_description || 'Pelajari ringkasan program sebelum membuka halaman detail lengkap.' }}
                      </p>
                    </div>

                    <button
                      type="button"
                      class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/25"
                      @click="closeLearnModal"
                    >
                      <Icon icon="lucide:x" class="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                  <div class="grid gap-0 lg:grid-cols-[330px_minmax(0,1fr)]">
                    <aside class="border-b border-slate-200 bg-slate-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/60 lg:border-b-0 lg:border-r">
                      <img
                        :src="learnModal.item.image || fallbackImage"
                        :alt="learnModal.item.title"
                        class="h-48 w-full rounded-[1.5rem] object-cover shadow-sm"
                      />

                      <div class="mt-5 grid grid-cols-1 gap-3">
                        <div class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                          <div class="flex items-center gap-3">
                            <Icon icon="lucide:map-pin" class="h-5 w-5 shrink-0 text-green-600" />
                            <div class="min-w-0">
                              <p class="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Lokasi</p>
                              <p class="mt-0.5 text-sm font-bold text-slate-950 dark:text-white">{{ learnModal.item.location || '-' }}</p>
                            </div>
                          </div>
                        </div>

                        <div class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                          <div class="flex items-center gap-3">
                            <Icon icon="lucide:calendar-days" class="h-5 w-5 shrink-0 text-green-600" />
                            <div class="min-w-0">
                              <p class="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Jadwal</p>
                              <p class="mt-0.5 text-sm font-bold text-slate-950 dark:text-white">
                                {{ dateRangeLabel(learnModal.item.start_date, learnModal.item.end_date) || '-' }}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                          <div class="flex items-center gap-3">
                            <Icon icon="lucide:repeat" class="h-5 w-5 shrink-0 text-green-600" />
                            <div class="min-w-0">
                              <p class="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Interval</p>
                              <p class="mt-0.5 text-sm font-bold text-slate-950 dark:text-white">{{ learnModal.item.interval || '-' }}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div v-if="learnModal.item.tags.length" class="mt-5 flex flex-wrap gap-2">
                        <span v-for="tag in learnModal.item.tags" :key="tag" class="rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 ring-1 ring-green-100 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-900/40">
                          #{{ tag }}
                        </span>
                      </div>
                    </aside>

                    <main class="min-w-0 p-5 md:p-6">
                      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p class="text-xs font-black uppercase tracking-[0.16em] text-green-600 dark:text-green-300">Preview Pembelajaran</p>
                          <h4 class="mt-1 text-xl font-black tracking-[-0.03em] text-slate-950 dark:text-white">Ringkasan Program</h4>
                        </div>

                        <button
                          type="button"
                          class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                          @click="openDetail(learnModal.item.slug)"
                        >
                          Detail
                          <Icon icon="lucide:arrow-up-right" class="h-4 w-4" />
                        </button>
                      </div>

                      <div class="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                        <article class="education-rich-content max-w-none p-5 md:p-7" v-html="learnHtml"></article>
                      </div>
                    </main>
                  </div>
                </div>

                <div class="shrink-0 border-t border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p class="text-xs leading-5 text-slate-500 dark:text-neutral-400">
                      Modal ini hanya preview singkat. Gunakan tombol Detail untuk membuka halaman lengkap.
                    </p>

                    <div class="flex flex-wrap gap-2">
                      <button
                        type="button"
                        class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        @click="goToAllEducation"
                      >
                        <Icon icon="lucide:grid-3x3" class="h-4 w-4" />
                        Semua Edukasi
                      </button>

                      <button
                        type="button"
                        class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                        @click="openDetail(learnModal.item.slug)"
                      >
                        Detail
                        <Icon icon="lucide:arrow-up-right" class="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        @click="closeLearnModal"
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- IMAGE MODAL -->
      <Teleport to="body">
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="imageModal.show && imageModal.item"
            class="fixed inset-0 z-[1200] overflow-y-auto bg-slate-950/85 px-4 py-8 backdrop-blur-md"
            @click.self="closeImageModal"
          >
            <div class="mx-auto flex min-h-full max-w-6xl items-center justify-center">
              <div class="w-full max-h-[75vh] overflow-hidden rounded-[2.25rem] border border-white/10 bg-white shadow-2xl dark:bg-neutral-950">
                <div class="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-neutral-800">
                  <div class="min-w-0">
                    <p class="text-xs font-black uppercase tracking-[0.16em] text-green-600 dark:text-green-300">Preview Gambar</p>
                    <h3 class="truncate text-base font-black text-slate-950 dark:text-white">{{ imageModal.item.title }}</h3>
                  </div>

                  <button
                    type="button"
                    class="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="closeImageModal"
                  >
                    <Icon icon="lucide:x" class="h-5 w-5" />
                  </button>
                </div>

                <div class="bg-slate-100 p-4 dark:bg-neutral-900">
                  <img :src="imageModal.item.image || fallbackImage" :alt="imageModal.item.title" class="max-h-[78vh] w-full rounded-[1.5rem] object-contain" />
                </div>

                <div class="flex flex-col gap-2 border-t border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950 sm:flex-row sm:items-center sm:justify-between">
                  <p class="line-clamp-1 text-sm font-bold text-slate-700 dark:text-neutral-200">
                    {{ imageModal.item.short_description || 'Preview gambar program edukasi.' }}
                  </p>

                  <div class="flex gap-2">
                    <button
                      type="button"
                      class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      @click="openLearnFromImage"
                    >
                      Pelajari
                    </button>

                    <button
                      type="button"
                      class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-xs font-black text-white transition hover:bg-green-700"
                      @click="openDetail(imageModal.item.slug)"
                    >
                      Detail
                      <Icon icon="lucide:arrow-up-right" class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- COPY TOAST -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-3 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-3 opacity-0"
      >
        <div v-if="showCopiedToast" class="fixed bottom-5 right-5 z-[90] max-w-sm rounded-[1.5rem] border border-green-200 bg-white p-4 shadow-2xl shadow-green-900/10 dark:border-green-900/40 dark:bg-neutral-900">
          <div class="flex items-start gap-3">
            <div class="grid size-10 shrink-0 place-items-center rounded-2xl bg-green-600 text-white">
              <Icon icon="lucide:check" class="size-5" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-black text-slate-950 dark:text-white">Link telah tersalin</p>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">Sekarang kamu bisa membagikannya ke WhatsApp atau media lain.</p>
            </div>
          </div>
        </div>
      </Transition>

      <div v-if="error" class="mt-8 rounded-[1.5rem] border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300">
        {{ error }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useAsyncData, useHead, useRuntimeConfig, useSeoMeta } from 'nuxt/app'
import { useRoute, useRouter } from 'vue-router'
import { useWeb } from '~/composables/data/useWeb'

defineOptions({ name: 'EducationPage' })

type EducationSlide = {
  id?: string
  slug?: string
  image?: string
  imagePublicId?: string | null
  title?: string
  location?: string
  start_date?: string
  end_date?: string
  interval?: string
  short_description?: string
  description_rich_tiptap?: string
  category?: string
  tags?: string[]
  createdAt?: number
  updatedAt?: number
}

type EducationItem = {
  id: string
  slug: string
  image: string
  imagePublicId: string | null
  title: string
  location: string
  start_date: string
  end_date: string
  interval: string
  short_description: string
  description_rich_tiptap: string
  category: string
  tags: string[]
  readTime: number
  createdAt: number
  updatedAt: number
  raw: EducationSlide
}

type WebPageSnapshot = {
  meta?: Record<string, any> | null
  sections?: Array<{
    id?: string
    key?: string
    enabled?: boolean
    order?: number
    props?: any
  }>
  sectionsOrder?: string[]
}

type SourcePayload = {
  current: WebPageSnapshot | null
  home: WebPageSnapshot | null
  education: WebPageSnapshot | null
}

const route = useRoute()
const router = useRouter()
const runtime = useRuntimeConfig()
const web = useWeb()

const { data: pageSources, pending, error } = useAsyncData<SourcePayload>(
  `education-synced-${route.path}`,
  async () => {
    const currentPath = route.path || '/education'

    const [current, home, education] = await Promise.all([
      web.getPageSnapshot(currentPath).catch(() => null),
      currentPath !== '/' ? web.getPageSnapshot('/').catch(() => null) : Promise.resolve(null),
      currentPath !== '/education' ? web.getPageSnapshot('/education').catch(() => null) : Promise.resolve(null)
    ])

    return {
      current: (current || null) as WebPageSnapshot | null,
      home: (home || null) as WebPageSnapshot | null,
      education: (education || null) as WebPageSnapshot | null
    }
  },
  {
    watch: [() => route.path]
  }
)

const PAGE_DEFAULTS = {
  eyebrow: 'Education Hub',
  title: 'Program Pendidikan & Kegiatan Pengembangan',
  subtitle:
    'Jelajahi program pendidikan, pembinaan, tahfidz, pelatihan, dan agenda pengembangan yang tersusun rapi dalam satu halaman.',
  texts: {
    searchPlaceholder: 'Cari program, kategori, lokasi, atau tag...',
    emptyList: 'Belum ada program yang cocok.',
    notFound: 'Program pendidikan tidak ditemukan.',
    loadMore: 'Tampilkan Lebih Banyak'
  },
  slides: [
    {
      id: 'default-madrasah-diniyah',
      image: '/assets/images/activity.jpg',
      title: 'Madrasah Diniyah',
      location: 'Aula Pesantren',
      start_date: '',
      end_date: '',
      interval: 'Setiap Senin - Kamis',
      short_description:
        'Program pembelajaran agama yang membantu peserta memahami dasar keilmuan, adab, dan praktik ibadah secara bertahap.',
      description_rich_tiptap:
        '<h2>Tentang Program</h2><p>Madrasah Diniyah dirancang sebagai ruang belajar yang ramah, terarah, dan konsisten untuk menguatkan pemahaman agama peserta.</p><ul><li>Pembelajaran bertahap sesuai kemampuan.</li><li>Pendampingan oleh pengajar.</li><li>Evaluasi berkala dan suasana belajar yang nyaman.</li></ul>',
      category: 'Madrasah Diniyah',
      tags: ['diniyah', 'agama', 'santri']
    },
    {
      id: 'default-program-tahfidz',
      image: '/assets/images/activity1.jpg',
      title: 'Program Tahfidz',
      location: 'Masjid Pesantren',
      start_date: '',
      end_date: '',
      interval: 'Setiap Hari',
      short_description:
        'Pembinaan hafalan Al-Qur’an dengan target, murajaah, dan pendampingan agar proses menghafal terasa lebih ringan.',
      description_rich_tiptap:
        '<h2>Fokus Tahfidz</h2><p>Program tahfidz membantu peserta membangun kebiasaan membaca, menghafal, dan mengulang hafalan secara disiplin.</p>',
      category: 'Tahfidz',
      tags: ['tahfidz', 'quran', 'hafalan']
    },
    {
      id: 'default-workshop-keterampilan',
      image: '/assets/images/activity2.jpg',
      title: 'Workshop Keterampilan',
      location: 'Ruang Serbaguna',
      start_date: '',
      end_date: '',
      interval: 'Bulanan',
      short_description:
        'Kegiatan pelatihan tematik untuk mengasah kreativitas, komunikasi, dan keterampilan praktis peserta.',
      description_rich_tiptap:
        '<h2>Pengembangan Skill</h2><p>Workshop ini menjadi ruang eksplorasi agar peserta memiliki wawasan dan keterampilan tambahan di luar pembelajaran reguler.</p>',
      category: 'Workshop',
      tags: ['skill', 'workshop', 'pengembangan']
    }
  ] satisfies EducationSlide[]
}

const fallbackImage = '/assets/images/activity.jpg'
const q = ref('')
const selectedCategory = ref('')
const selectedTags = ref<string[]>([])
const sortBy = ref<'recommended' | 'newest' | 'oldest' | 'title'>('recommended')
const page = ref(1)
const pageSize = 9

const learnModal = reactive<{
  show: boolean
  item: EducationItem | null
}>({
  show: false,
  item: null
})

const imageModal = reactive<{
  show: boolean
  item: EducationItem | null
}>({
  show: false,
  item: null
})

function normalizeSectionKey(key?: string) {
  return String(key || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

function sectionScore(section: any) {
  const key = normalizeSectionKey(section?.key)

  if (key === 'othereducation') return 100
  if (key === 'heroothereducation') return 95
  if (key === 'othereducationslider') return 90
  if (key === 'educationpage') return 80
  if (Array.isArray(section?.props?.slides)) return 30

  return 0
}

function getOrderedSections(snapshot?: WebPageSnapshot | null) {
  const sections = Array.isArray(snapshot?.sections) ? [...(snapshot?.sections || [])] : []
  const order = Array.isArray(snapshot?.sectionsOrder) ? snapshot?.sectionsOrder || [] : []

  return sections
    .filter((section) => section?.enabled !== false)
    .sort((a, b) => {
      const aOrder = order.indexOf(String(a?.id || ''))
      const bOrder = order.indexOf(String(b?.id || ''))

      if (aOrder !== -1 || bOrder !== -1) {
        return (aOrder === -1 ? 9999 : aOrder) - (bOrder === -1 ? 9999 : bOrder)
      }

      return Number(a?.order || 0) - Number(b?.order || 0)
    })
}

function extractEducationProps(snapshot?: WebPageSnapshot | null) {
  const candidates = getOrderedSections(snapshot)
    .map((section) => ({
      section,
      score: sectionScore(section)
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)

  return candidates[0]?.section?.props || null
}

const sourceProps = computed<any>(() => {
  const currentProps = extractEducationProps(pageSources.value?.current)
  const educationProps = extractEducationProps(pageSources.value?.education)
  const homeProps = extractEducationProps(pageSources.value?.home)

  if (Array.isArray(currentProps?.slides) && currentProps.slides.length) return currentProps
  if (Array.isArray(educationProps?.slides) && educationProps.slides.length) return educationProps
  if (Array.isArray(homeProps?.slides) && homeProps.slides.length) return homeProps

  return currentProps || educationProps || homeProps || {}
})

const pageMeta = computed<any>(() => {
  return pageSources.value?.current?.meta || pageSources.value?.education?.meta || pageSources.value?.home?.meta || {}
})

const cfg = computed(() => ({
  eyebrow: sourceProps.value?.eyebrow || PAGE_DEFAULTS.eyebrow,
  title: sourceProps.value?.title || PAGE_DEFAULTS.title,
  subtitle: sourceProps.value?.subtitle || PAGE_DEFAULTS.subtitle,
  texts: {
    searchPlaceholder: sourceProps.value?.texts?.searchPlaceholder || PAGE_DEFAULTS.texts.searchPlaceholder,
    emptyList: sourceProps.value?.texts?.emptyList || PAGE_DEFAULTS.texts.emptyList,
    notFound: sourceProps.value?.texts?.notFound || PAGE_DEFAULTS.texts.notFound,
    loadMore: sourceProps.value?.texts?.loadMore || PAGE_DEFAULTS.texts.loadMore
  }
}))

const rawSlides = computed<EducationSlide[]>(() => {
  const slides = sourceProps.value?.slides
  return Array.isArray(slides) && slides.length ? slides : PAGE_DEFAULTS.slides
})

function slugify(value: string) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'program'
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

function sanitizeRichHtml(value?: string) {
  return String(value || '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/\son[a-z]+=["'][^"']*["']/gi, '')
    .replace(/\son[a-z]+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
}

function textPreview(value?: string, max = 150) {
  const clean = stripHtml(value)
  return clean.length > max ? `${clean.slice(0, max).trim()}...` : clean
}

function estimateReadTime(...values: string[]) {
  const words = values
    .map((value) => stripHtml(value))
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(1, Math.ceil(words / 180))
}

function cleanTag(tag: string) {
  return String(tag || '').replace(/^#/, '').trim()
}

function normalizeItem(slide: EducationSlide, index: number): EducationItem {
  const title = String(slide.title || `Program ${index + 1}`)
  const id = String(slide.id || `other-education-${index}`)
  const slug = String(slide.slug || slugify(title || id))
  const html = String(slide.description_rich_tiptap || '')

  return {
    id,
    slug,
    image: String(slide.image || ''),
    imagePublicId: slide.imagePublicId || null,
    title,
    location: String(slide.location || ''),
    start_date: String(slide.start_date || ''),
    end_date: String(slide.end_date || ''),
    interval: String(slide.interval || ''),
    short_description: String(slide.short_description || textPreview(html) || ''),
    description_rich_tiptap: html,
    category: String(slide.category || 'Pendidikan'),
    tags: Array.isArray(slide.tags) ? slide.tags.map((tag) => cleanTag(String(tag))).filter(Boolean) : [],
    readTime: estimateReadTime(slide.short_description || '', html),
    createdAt: Number(slide.createdAt || 0),
    updatedAt: Number(slide.updatedAt || 0),
    raw: slide
  }
}

const items = computed<EducationItem[]>(() => rawSlides.value.map(normalizeItem))

const categories = computed(() => {
  return Array.from(new Set(items.value.map((item) => item.category).filter(Boolean))).sort((a, b) => a.localeCompare(b))
})

const allTags = computed(() => {
  return Array.from(new Set(items.value.flatMap((item) => item.tags || []))).sort((a, b) => a.localeCompare(b))
})

const locationsCount = computed(() => {
  return new Set(items.value.map((item) => item.location).filter(Boolean)).size
})

const activeScheduleCount = computed(() => {
  return items.value.filter((item) => item.interval || item.start_date || item.end_date).length
})

function normalizeSearch(value: string) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const filtered = computed(() => {
  const query = normalizeSearch(q.value)

  let result = items.value.filter((item) => {
    const categoryOk = selectedCategory.value ? item.category === selectedCategory.value : true
    const tagsOk = selectedTags.value.length
      ? selectedTags.value.every((tag) => item.tags.includes(tag))
      : true

    const haystack = normalizeSearch([
      item.title,
      item.short_description,
      item.description_rich_tiptap,
      item.category,
      item.location,
      item.interval,
      ...item.tags
    ].join(' '))

    const queryOk = query ? haystack.includes(query) : true

    return categoryOk && tagsOk && queryOk
  })

  result = [...result]

  if (sortBy.value === 'title') {
    result.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortBy.value === 'newest') {
    result.sort((a, b) => getSortDate(b) - getSortDate(a))
  } else if (sortBy.value === 'oldest') {
    result.sort((a, b) => getSortDate(a) - getSortDate(b))
  }

  return result
})

const paged = computed(() => filtered.value.slice(0, page.value * pageSize))
const hasMore = computed(() => paged.value.length < filtered.value.length)
const highlightItem = computed(() => filtered.value[0] || items.value[0] || null)

const detailSlug = computed(() => {
  const value = route.query.detail
  return Array.isArray(value) ? value[0] || '' : String(value || '')
})

const isDetail = computed(() => Boolean(detailSlug.value))
const currentItem = computed(() => items.value.find((item) => item.slug === detailSlug.value) || null)

const detailHtml = computed(() => {
  const item = currentItem.value
  if (!item) return ''

  const html = item.description_rich_tiptap?.trim()
  if (html) return sanitizeRichHtml(html)

  return `<p>${item.short_description || 'Detail program pendidikan belum tersedia.'}</p>`
})

const learnHtml = computed(() => {
  const item = learnModal.item
  if (!item) return ''

  const html = item.description_rich_tiptap?.trim()
  if (html) return sanitizeRichHtml(html)

  return `<p>${item.short_description || 'Belum ada deskripsi lengkap untuk program ini.'}</p>`
})

const relatedItems = computed(() => {
  const active = currentItem.value
  if (!active) return []

  const activeTags = new Set(active.tags)

  return items.value
    .filter((item) => item.slug !== active.slug)
    .map((item) => {
      let score = 0
      if (item.category && item.category === active.category) score += 30
      if (item.location && item.location === active.location) score += 12
      for (const tag of item.tags) if (activeTags.has(tag)) score += 10
      if (item.interval && item.interval === active.interval) score += 6
      return { item, score }
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((entry) => entry.item)
})

watch([q, selectedCategory, selectedTags, sortBy], () => {
  page.value = 1
})

watch(
  () => route.fullPath,
  async () => {
    await nextTick()
    initPreline()
  }
)

function getSortDate(item: EducationItem) {
  const fromStart = item.start_date ? new Date(item.start_date).getTime() : 0
  const fromUpdated = item.updatedAt || item.createdAt || 0
  return Number.isFinite(fromStart) && fromStart > 0 ? fromStart : fromUpdated
}

function categoryIcon(category?: string) {
  const value = String(category || '').toLowerCase()

  if (value.includes('tahfidz') || value.includes('quran')) return 'lucide:book-open'
  if (value.includes('diniyah') || value.includes('agama')) return 'lucide:book-marked'
  if (value.includes('workshop') || value.includes('pelatihan')) return 'lucide:hammer'
  if (value.includes('formal') || value.includes('sekolah')) return 'lucide:school'
  if (value.includes('seminar')) return 'lucide:presentation'
  if (value.includes('desa')) return 'lucide:building-2'
  if (value.includes('santri')) return 'lucide:users'

  return 'lucide:graduation-cap'
}

function dateRangeLabel(start?: string, end?: string) {
  const startLabel = formatDate(start || '')
  const endLabel = formatDate(end || '')

  if (startLabel && endLabel) return `${startLabel} — ${endLabel}`
  if (startLabel) return startLabel
  if (endLabel) return endLabel

  return ''
}

function periodLabel(item: EducationItem) {
  return dateRangeLabel(item.start_date, item.end_date) || item.interval || 'Jadwal fleksibel'
}

function formatDate(value: string | number) {
  if (!value) return ''

  const date = typeof value === 'number' ? new Date(value) : new Date(String(value))
  if (Number.isNaN(date.getTime())) return String(value)

  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(date)
}

function loadMore() {
  page.value += 1
}

function countByCategory(category: string) {
  return items.value.filter((item) => item.category === category).length
}

function toggleTag(tag: string) {
  selectedTags.value = selectedTags.value.includes(tag)
    ? selectedTags.value.filter((item) => item !== tag)
    : [...selectedTags.value, tag]
}

function resetFilters() {
  q.value = ''
  selectedCategory.value = ''
  selectedTags.value = []
  sortBy.value = 'recommended'
  page.value = 1
}

function openDetail(slug: string) {
  closeLearnModal()
  closeImageModal()

  router.push({
    path: route.path,
    query: {
      ...route.query,
      detail: slug
    }
  })
}

function goToAllEducation() {
  closeLearnModal()
  closeImageModal()

  resetFilters()

  const nextQuery = { ...route.query }
  delete nextQuery.detail

  router.push({ path: route.path, query: nextQuery })

  nextTick(() => {
    scrollToPrograms()
  })
}

function openTagFromDetail(tag: string) {
  selectedTags.value = [tag]

  const nextQuery = { ...route.query }
  delete nextQuery.detail

  router.push({ path: route.path, query: nextQuery })

  nextTick(() => {
    scrollToPrograms()
  })
}

function scrollToPrograms() {
  if (typeof document === 'undefined') return
  document.getElementById('education-programs')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function openLearnModal(item: EducationItem) {
  learnModal.item = item
  learnModal.show = true
}

function closeLearnModal() {
  learnModal.show = false
  learnModal.item = null
}

function openImageModal(item: EducationItem) {
  imageModal.item = item
  imageModal.show = true
}

function closeImageModal() {
  imageModal.show = false
  imageModal.item = null
}

function openLearnFromImage() {
  if (!imageModal.item) return

  const item = imageModal.item
  closeImageModal()
  openLearnModal(item)
}

const siteOrigin = computed(() => {
  const fromRuntime =
    runtime.public?.siteUrl ||
    runtime.public?.siteURL ||
    runtime.public?.site_url ||
    ''

  if (fromRuntime) return String(fromRuntime).replace(/\/$/, '')
  if (typeof window !== 'undefined') return window.location.origin
  return 'https://example.com'
})

function toIsoDate(value?: string | number) {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

function toAbsoluteUrl(url?: string) {
  const fallback = '/assets/logo.png'
  const raw = String(url || fallback).trim()

  if (!raw) return `${siteOrigin.value}/assets/logo.png`
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  return `${siteOrigin.value}${raw.startsWith('/') ? raw : `/${raw}`}`
}

const organizationName = computed(() => {
  return (
    pageMeta.value?.organizationName ||
    pageMeta.value?.siteName ||
    runtime.public?.siteName ||
    runtime.public?.clientDisplayName ||
    'Obayan Education'
  )
})

const organizationLogo = computed(() => {
  return toAbsoluteUrl(pageMeta.value?.logo || runtime.public?.appLogo || '/assets/logo.png')
})

const canonical = computed(() => {
  return new URL(route.fullPath || '/education', siteOrigin.value).toString()
})

const pageTitle = computed(() => {
  if (isDetail.value && currentItem.value?.title) {
    return `${currentItem.value.title} | ${currentItem.value.category || 'Pendidikan'} - ${organizationName.value}`
  }

  return pageMeta.value?.title || `${cfg.value.title} | ${organizationName.value}`
})

const pageDescription = computed(() => {
  if (isDetail.value && currentItem.value) {
    return textPreview(
      currentItem.value.short_description || currentItem.value.description_rich_tiptap || currentItem.value.title,
      160
    )
  }

  return textPreview(pageMeta.value?.description || cfg.value.subtitle, 160)
})

const pageImage = computed(() => {
  if (isDetail.value && currentItem.value?.image) return toAbsoluteUrl(currentItem.value.image)
  if (pageMeta.value?.ogImage) return toAbsoluteUrl(pageMeta.value.ogImage)
  if (highlightItem.value?.image) return toAbsoluteUrl(highlightItem.value.image)
  return organizationLogo.value
})

const seoKeywords = computed(() => {
  const values = [
    currentItem.value?.category,
    ...(currentItem.value?.tags || []),
    ...categories.value,
    organizationName.value,
    'program pendidikan',
    'kegiatan pendidikan',
    'tahfidz',
    'madrasah diniyah',
    'workshop santri'
  ]

  return Array.from(new Set(values.filter(Boolean).map((value) => String(value).trim()))).join(', ')
})

const robotsMeta = computed(() => {
  if (isDetail.value && !currentItem.value && !pending.value) return 'noindex, follow'
  return pageMeta.value?.robots || 'index, follow'
})

const twitterSite = computed(() => pageMeta.value?.twitterSite || runtime.public?.twitterSite || undefined)
const themeColor = computed(() => pageMeta.value?.themeColor || runtime.public?.appThemeColor || runtime.public?.themeColor || '#16a34a')

useSeoMeta({
  title: () => pageTitle.value,
  description: () => pageDescription.value,
  ogTitle: () => pageTitle.value,
  ogDescription: () => pageDescription.value,
  ogType: () => (isDetail.value && currentItem.value ? 'article' : 'website'),
  ogUrl: () => canonical.value,
  ogImage: () => pageImage.value,
  ogImageAlt: () => currentItem.value?.title || organizationName.value,
  ogSiteName: () => organizationName.value,
  ogLocale: 'id_ID',
  twitterCard: 'summary_large_image',
  twitterSite: () => twitterSite.value,
  twitterTitle: () => pageTitle.value,
  twitterDescription: () => pageDescription.value,
  twitterImage: () => pageImage.value,
  twitterImageAlt: () => currentItem.value?.title || organizationName.value,
  robots: () => robotsMeta.value,
  keywords: () => seoKeywords.value,
  themeColor: () => themeColor.value
})

useHead(() => {
  const isProgram = Boolean(isDetail.value && currentItem.value)
  const published = toIsoDate(currentItem.value?.start_date)
  const modified = toIsoDate(currentItem.value?.updatedAt) || published

  const jsonLd = isProgram
    ? {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: currentItem.value?.title,
        description: pageDescription.value,
        image: pageImage.value,
        provider: {
          '@type': 'Organization',
          name: organizationName.value,
          logo: organizationLogo.value
        },
        url: canonical.value,
        keywords: seoKeywords.value,
        courseMode: currentItem.value?.interval || undefined
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: pageTitle.value,
        description: pageDescription.value,
        url: canonical.value,
        image: pageImage.value,
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
    link: [{ rel: 'canonical', href: canonical.value }],
    meta: [
      { name: 'thumbnail', content: pageImage.value },
      { name: 'author', content: organizationName.value },
      ...(isProgram && currentItem.value?.category ? [{ property: 'article:section', content: currentItem.value.category }] : []),
      ...(published ? [{ property: 'article:published_time', content: published }] : []),
      ...(modified ? [{ property: 'article:modified_time', content: modified }] : [])
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(jsonLd)
      }
    ]
  }
})

const copied = ref(false)
const showCopiedToast = ref(false)
let copiedToastTimer: ReturnType<typeof setTimeout> | null = null

const shareText = computed(() => {
  return currentItem.value?.title || learnModal.item?.title || cfg.value.title || 'Program Pendidikan'
})

const encodedUrl = computed(() => encodeURIComponent(canonical.value))
const encodedText = computed(() => encodeURIComponent(`${shareText.value} - ${canonical.value}`))
const facebookHref = computed(() => `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl.value}`)
const twitterHref = computed(() => `https://twitter.com/intent/tweet?url=${encodedUrl.value}&text=${encodeURIComponent(shareText.value)}`)
const whatsappHref = computed(() => `https://wa.me/?text=${encodedText.value}`)

function triggerCopiedToast() {
  showCopiedToast.value = true
  if (copiedToastTimer) clearTimeout(copiedToastTimer)
  copiedToastTimer = setTimeout(() => {
    showCopiedToast.value = false
  }, 1800)
}

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

async function nativeShare() {
  try {
    if (navigator.share) {
      await navigator.share({
        title: shareText.value,
        text: pageDescription.value,
        url: canonical.value
      })
      return
    }
  } catch {}

  const opened = window.open(twitterHref.value, '_blank', 'noopener,noreferrer')
  if (!opened) await copyLink()
}

async function initPreline() {
  if (typeof window === 'undefined') return

  try {
    const { HSStaticMethods } = await import('preline')
    HSStaticMethods?.autoInit?.()
  } catch {}
}

onMounted(initPreline)
</script>

<style scoped>
.share-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 1.25rem;
  border: 1px solid rgb(226 232 240);
  background: white;
  padding: 0.75rem;
  text-align: left;
  transition: 0.2s ease;
}

.share-option:hover {
  transform: translateY(-2px);
  border-color: rgb(187 247 208);
  background: rgb(240 253 244);
}

.dark .share-option {
  border-color: rgb(38 38 38);
  background: rgb(23 23 23);
}

.dark .share-option:hover {
  border-color: rgba(20, 83, 45, 0.75);
  background: rgba(20, 83, 45, 0.18);
}

.share-icon {
  display: grid;
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  place-items: center;
  border-radius: 1rem;
}

.education-rich-content {
  color: rgb(51 65 85);
  font-size: 1rem;
  line-height: 1.85;
}

.education-rich-content :deep(p) {
  margin: 0.85rem 0;
}

.education-rich-content :deep(h1) {
  margin: 2rem 0 1rem;
  font-size: 2rem;
  line-height: 1.2;
  font-weight: 900;
  letter-spacing: -0.035em;
  color: rgb(15 23 42);
}

.education-rich-content :deep(h2) {
  margin: 1.75rem 0 0.875rem;
  font-size: 1.5rem;
  line-height: 1.3;
  font-weight: 900;
  letter-spacing: -0.025em;
  color: rgb(15 23 42);
}

.education-rich-content :deep(h3) {
  margin: 1.5rem 0 0.75rem;
  font-size: 1.25rem;
  line-height: 1.35;
  font-weight: 800;
  color: rgb(15 23 42);
}

.education-rich-content :deep(strong) {
  font-weight: 900;
}

.education-rich-content :deep(em) {
  font-style: italic;
}

.education-rich-content :deep(ul) {
  margin: 0.85rem 0;
  padding-left: 1.5rem;
  list-style-type: disc;
}

.education-rich-content :deep(ol) {
  margin: 0.85rem 0;
  padding-left: 1.5rem;
  list-style-type: decimal;
}

.education-rich-content :deep(li) {
  margin: 0.35rem 0;
  padding-left: 0.25rem;
}

.education-rich-content :deep(blockquote) {
  margin: 1.25rem 0;
  border-left: 4px solid rgb(34 197 94);
  border-radius: 1rem;
  background: rgb(240 253 244);
  padding: 0.875rem 1rem;
  color: rgb(55 65 81);
}

.education-rich-content :deep(table),
.education-rich-content :deep(.editor-table) {
  width: 100%;
  margin: 1.25rem 0;
  border-collapse: collapse;
  table-layout: fixed;
  overflow: hidden;
  border-radius: 1rem;
}

.education-rich-content :deep(th),
.education-rich-content :deep(td) {
  border: 1px solid rgb(226 232 240);
  padding: 0.75rem;
  vertical-align: top;
}

.education-rich-content :deep(th) {
  background: rgb(248 250 252);
  font-weight: 900;
}

.education-rich-content :deep(a),
.education-rich-content :deep(.news-content-link) {
  color: rgb(22 163 74);
  font-weight: 800;
  text-decoration-line: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.education-rich-content :deep(a:hover),
.education-rich-content :deep(.news-content-link:hover) {
  color: rgb(21 128 61);
  background: rgb(240 253 244);
  border-radius: 0.375rem;
}

.education-rich-content :deep(.editor-image),
.education-rich-content :deep(img) {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 1.5rem auto;
  border-radius: 1.25rem;
  border: 1px solid rgb(226 232 240);
  object-fit: cover;
  box-shadow: 0 18px 50px -24px rgba(15, 23, 42, 0.35);
}

.education-rich-content :deep(.youtube-embed),
.education-rich-content :deep(iframe[src*='youtube']),
.education-rich-content :deep(iframe[src*='youtu.be']) {
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

.education-rich-content :deep(.pdf-embed),
.education-rich-content :deep(.map-embed) {
  margin: 1.5rem 0;
  overflow: hidden;
  border: 1px solid rgb(226 232 240);
  border-radius: 1.25rem;
  background: rgb(248 250 252);
  box-shadow: 0 18px 50px -28px rgba(15, 23, 42, 0.28);
}

.education-rich-content :deep(.pdf-embed-title),
.education-rich-content :deep(.map-embed-title) {
  border-bottom: 1px solid rgb(226 232 240);
  background: linear-gradient(135deg, rgb(240 253 244), rgb(255 255 255));
  padding: 0.85rem 1rem;
  font-size: 0.875rem;
  font-weight: 900;
  color: rgb(30 41 59);
}

.education-rich-content :deep(.pdf-embed-frame),
.education-rich-content :deep(.map-embed-frame) {
  width: 100%;
  height: 420px;
  border: 0;
  background: white;
}

.education-rich-content :deep(.map-embed-frame) {
  min-height: 360px;
}

.dark .education-rich-content {
  color: rgb(229 229 229);
}

.dark .education-rich-content :deep(h1),
.dark .education-rich-content :deep(h2),
.dark .education-rich-content :deep(h3) {
  color: white;
}

.dark .education-rich-content :deep(blockquote) {
  background: rgba(22, 163, 74, 0.12);
  color: rgb(229 229 229);
}

.dark .education-rich-content :deep(th) {
  background: rgb(38 38 38);
}

.dark .education-rich-content :deep(th),
.dark .education-rich-content :deep(td) {
  border-color: rgb(64 64 64);
}

.dark .education-rich-content :deep(a),
.dark .education-rich-content :deep(.news-content-link) {
  color: rgb(134 239 172);
}

.dark .education-rich-content :deep(a:hover),
.dark .education-rich-content :deep(.news-content-link:hover) {
  color: rgb(187 247 208);
  background: rgba(22, 163, 74, 0.16);
}

.dark .education-rich-content :deep(.editor-image),
.dark .education-rich-content :deep(img) {
  border-color: rgb(64 64 64);
  box-shadow: 0 18px 50px -28px rgba(0, 0, 0, 0.6);
}

.dark .education-rich-content :deep(.pdf-embed),
.dark .education-rich-content :deep(.map-embed) {
  border-color: rgb(64 64 64);
  background: rgb(23 23 23);
  box-shadow: 0 18px 50px -28px rgba(0, 0, 0, 0.65);
}

.dark .education-rich-content :deep(.pdf-embed-title),
.dark .education-rich-content :deep(.map-embed-title) {
  border-color: rgb(64 64 64);
  background: linear-gradient(135deg, rgba(22, 163, 74, 0.16), rgb(23 23 23));
  color: rgb(245 245 245);
}

.dark .education-rich-content :deep(.pdf-embed-frame),
.dark .education-rich-content :deep(.map-embed-frame) {
  background: rgb(10 10 10);
}

@media (max-width: 640px) {
  .education-rich-content :deep(.pdf-embed-frame),
  .education-rich-content :deep(.map-embed-frame) {
    height: 320px;
  }

  .education-rich-content :deep(.editor-image),
  .education-rich-content :deep(img) {
    border-radius: 1rem;
  }
}
</style>
