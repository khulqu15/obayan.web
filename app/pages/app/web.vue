<template>
  <div class="min-h-full bg-transparent text-gray-800 dark:text-neutral-200">
    <div class="mx-auto max-w-[1800px] space-y-8 px-5 py-5 md:px-8 md:py-8 xl:px-10 xl:py-10">
      <section class="relative overflow-hidden rounded-[34px] border border-green-100 bg-linear-to-br from-green-600 via-green-600 to-lime-500 p-5 text-white shadow-[0_26px_60px_-18px_rgba(22,163,74,0.36)] md:p-8">
        <div class="absolute inset-0 opacity-20">
          <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white blur-3xl"></div>
          <div class="absolute bottom-0 left-8 h-32 w-32 rounded-full bg-lime-100 blur-3xl"></div>
        </div>

        <div class="relative z-10 grid gap-5 xl:grid-cols-[1.18fr,0.82fr] xl:items-end">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
              <span class="inline-block h-2 w-2 rounded-full bg-lime-300"></span>
              Website CMS 
            </div>
            <h1 class="mt-4 text-2xl font-black tracking-tight md:text-4xl">Obayan Web Editor</h1>
          </div>

          <div class="grid gap-3 md:grid-cols-3 grid-cols-1">
            <div class="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
              <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-green-100">Total Halaman</div>
              <div class="mt-2 text-2xl font-black">{{ pages.length }}</div>
              <div class="mt-1 text-xs text-green-50/90">path aktif di CMS</div>
            </div>
            <div class="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
              <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-green-100">Total Section</div>
              <div class="mt-2 text-2xl font-black">{{ sortedSections.length }}</div>
              <div class="mt-1 text-xs text-green-50/90">blok editor di halaman aktif</div>
            </div>
            <div class="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
              <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-green-100">Status</div>
              <div class="mt-2 text-base font-black leading-6">{{ meta?.status === 'published' ? 'Published' : 'Draft' }}</div>
              <div class="mt-1 text-xs text-green-50/90">untuk path {{ currentPath }}</div>
            </div>
          </div>
        </div>
      </section>

      <main class="space-y-6" data-web-editor-main>
        <section v-show="false" class="sticky top-4 z-20 rounded-[30px] border border-gray-200/80 bg-white/92 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/92">
          <div class="flex flex-col gap-4 px-5 py-4 md:px-6">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <h2 class="text-lg font-bold text-gray-900 dark:text-white">Workspace Editor</h2>
                  <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-700 dark:bg-neutral-800 dark:text-neutral-200">
                    {{ currentPath }}
                  </span>
                </div>
              </div>

              <div class="hidden flex-wrap items-center gap-2 md:flex">
                <button class="inline-flex h-12 items-center justify-center rounded-2xl border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900/30 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10" @click="askDeletePage" :disabled="!meta">
                  <Icon icon="lucide:trash-2" class="mr-2 h-4 w-4" /> Hapus
                </button>
                <button class="inline-flex h-12 items-center justify-center rounded-2xl bg-green-600 px-4 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:opacity-60" @click="publish" :disabled="!meta || meta?.status === 'published'">
                  <Icon icon="lucide:rocket" class="mr-2 h-4 w-4" /> Publish
                </button>
              </div>

              <details class="relative md:hidden">
                <summary class="flex list-none cursor-pointer items-center justify-center rounded-2xl border border-gray-200 bg-white p-3 text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800">
                  <Icon icon="lucide:ellipsis" class="h-5 w-5" />
                </summary>
                <div class="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-[22px] border border-gray-200 bg-white p-2 shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                  <a :href="currentPath" target="_blank" class="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800">
                    <Icon icon="lucide:external-link" class="h-4 w-4" /> Lihat Halaman
                  </a>
                  <button class="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800" @click="ui.showMeta = !ui.showMeta">
                    <Icon :icon="ui.showMeta ? 'lucide:panel-right-close' : 'lucide:panel-right-open'" class="h-4 w-4" />
                    {{ ui.showMeta ? 'Hide Meta' : 'Show Meta' }}
                  </button>
                  <button class="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 dark:text-neutral-200 dark:hover:bg-neutral-800" @click="openRenamePage" :disabled="!meta">
                    <Icon icon="lucide:pencil-line" class="h-4 w-4" /> Rename
                  </button>
                  <button class="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 dark:text-neutral-200 dark:hover:bg-neutral-800" @click="openClonePage" :disabled="!meta">
                    <Icon icon="lucide:copy" class="h-4 w-4" /> Clone
                  </button>
                  <button class="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm text-rose-600 transition hover:bg-rose-50 disabled:opacity-60 dark:text-rose-300 dark:hover:bg-rose-900/10" @click="askDeletePage" :disabled="!meta">
                    <Icon icon="lucide:trash-2" class="h-4 w-4" /> Hapus
                  </button>
                  <button class="mt-1 flex w-full items-center gap-2 rounded-2xl bg-green-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60" @click="publish" :disabled="!meta || meta?.status === 'published'">
                    <Icon icon="lucide:rocket" class="h-4 w-4" /> Publish
                  </button>
                </div>
              </details>
            </div>
          </div>
        </section>

        <div class="grid gap-6" :class="ui.showMeta ? '2xl:grid-cols-[minmax(0,1fr),390px]' : 'grid-cols-1'">
          <section
            class="overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            data-web-section-builder
          >
            <!-- Header Builder -->
            <div class="border-b border-gray-200 bg-gradient-to-br from-white via-green-50/40 to-lime-50/60 px-5 py-5 dark:border-neutral-800 dark:from-neutral-900 dark:via-green-950/10 dark:to-neutral-900 md:px-6">
              <div class="gap-5 xl:items-start xl:justify-between">
                <div class="min-w-0">
                  <div class="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 ring-1 ring-green-100 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-900/40">
                    <Icon icon="lucide:blocks" class="h-4 w-4" />
                    Blok Konten
                  </div>

                  <h3 class="mt-3 text-xl font-black tracking-tight text-gray-950 dark:text-white">
                    Susunan Konten Halaman
                  </h3>

                  <p class="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                    Tambahkan, urutkan, aktif/nonaktifkan, dan ubah isi blok halaman. Nama blok dibuat sederhana agar mudah dipahami oleh admin non-teknis.
                  </p>
                </div>

                <div class="w-full gap-3 xl:w-auto xl:min-w-[520px]">
                  <div class="grid gap-2 grid-cols-3 mt-4">
                    <div class="relative">
                      <Icon
                        icon="lucide:layout-template"
                        class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                      />

                      <select
                        v-model="newSection.key"
                        class="block h-12 w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-gray-800 outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.12)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                      >
                        <option value="">Pilih jenis blok konten</option>
                        <option
                          v-for="item in availableSectionTypes"
                          :key="item.key"
                          :value="item.key"
                        >
                          {{ item.label }}
                        </option>
                      </select>
                    </div>

                    <button
                      type="button"
                      class="inline-flex h-12 items-center justify-center rounded-2xl bg-green-600 px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                      :disabled="!newSection.key"
                      @click="addNewSection"
                    >
                      <Icon icon="lucide:plus" class="mr-2 h-4 w-4" />
                      Tambah Blok
                    </button>

                    <button
                      type="button"
                      class="inline-flex h-12 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      @click="ui.sectionsCollapsed = !ui.sectionsCollapsed"
                    >
                      <Icon
                        :icon="ui.sectionsCollapsed ? 'lucide:chevron-down' : 'lucide:chevron-up'"
                        class="mr-2 h-4 w-4"
                      />
                      {{ ui.sectionsCollapsed ? 'Tampilkan' : 'Sembunyikan' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Content Builder -->
            <div class="space-y-5 p-5 md:p-6">
              <input ref="sectionMediaPicker" type="file" accept="image/*" class="hidden" @change="onPickSectionMedia" />

              <!-- Empty State -->
              <div
                v-if="!sortedSections.length"
                class="rounded-[30px] border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center dark:border-neutral-700 dark:bg-neutral-800/40"
              >
                <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-white text-green-700 ring-1 ring-black/5 dark:bg-neutral-900 dark:text-green-300 dark:ring-white/10">
                  <Icon icon="lucide:layout-template" class="h-7 w-7" />
                </div>

                <h4 class="mt-5 text-lg font-black text-gray-900 dark:text-white">
                  Belum ada blok konten
                </h4>

                <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-neutral-400">
                  Mulai dengan menambahkan blok seperti Banner Utama, Info Singkat, Berita, Galeri, atau Program.
                </p>
              </div>

              <template v-else>
                <!-- Mobile / Desktop block selector -->
                <div class="rounded-[28px] border border-gray-200 bg-gray-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50">
                  <div class="flex min-w-0 gap-2 overflow-x-auto pb-1">
                    <button
                      v-for="(tab, index) in sortedSections"
                      :key="tab.id"
                      v-show="tab.key != 'ProgramHero'"
                      type="button"
                      class="inline-flex shrink-0 items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-black transition"
                      :class="activeSectionId === tab.id
                        ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
                        : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800'"
                      @click="activeSectionId = tab.id"
                    >
                      <span
                        class="grid h-5 w-5 place-items-center rounded-full text-[10px]"
                        :class="activeSectionId === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 dark:bg-neutral-800 dark:text-neutral-300'"
                      >
                        {{ index + 1 }}
                      </span>
                      {{ sectionLabel(tab.key) }}
                    </button>
                  </div>
                </div>

                <div v-show="!ui.sectionsCollapsed" class="space-y-4">
                  <article
                    v-for="(s, i) in sortedSections"
                    :key="s.id"
                    v-show="s.id === activeSectionId"
                    class="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <!-- Active block header -->
                    <div class="border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white px-5 py-4 dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-900">
                      <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div class="min-w-0">
                          <div class="flex flex-wrap items-center gap-2">
                            <span class="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-green-600 text-sm font-black text-white shadow-lg shadow-green-500/20">
                              {{ i + 1 }}
                            </span>

                            <div>
                              <h4 class="text-base font-black text-gray-950 dark:text-white">
                                {{ sectionLabel(s.key) }}
                              </h4>
                              <p class="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                                {{ sectionDescription(s.key) }}
                              </p>
                            </div>

                            <span
                              class="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold"
                              :class="localEdits[s.id]?.enabled
                                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                                : 'bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-300'"
                            >
                              {{ localEdits[s.id]?.enabled ? 'Aktif' : 'Nonaktif' }}
                            </span>
                          </div>
                        </div>

                        <div class="relative shrink-0">
                          <details class="group relative">
                            <summary
                              class="flex h-10 w-10 list-none cursor-pointer items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 hover:text-gray-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                              aria-label="Menu aksi blok"
                            >
                              <Icon icon="lucide:ellipsis-vertical" class="h-4 w-4" />
                            </summary>

                            <div class="absolute right-0 top-[calc(100%+8px)] z-50 w-64 overflow-hidden rounded-[22px] border border-gray-200 bg-white p-1.5 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
                              <div class="px-3 py-2">
                                <p class="text-xs font-black text-gray-900 dark:text-white">
                                  Aksi Blok
                                </p>
                                <p class="mt-0.5 truncate text-[11px] text-gray-500 dark:text-neutral-400">
                                  {{ sectionLabel(s.key) }}
                                </p>
                              </div>

                              <div class="my-1 border-t border-gray-100 dark:border-neutral-800"></div>

                              <button
                                type="button"
                                class="flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-45 dark:text-neutral-200 dark:hover:bg-neutral-800"
                                :disabled="i === 0"
                                @click="moveUp(s.id)"
                              >
                                <Icon icon="lucide:arrow-up" class="h-4 w-4 text-gray-400" />
                                Pindah ke Atas
                              </button>

                              <button
                                type="button"
                                class="flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-45 dark:text-neutral-200 dark:hover:bg-neutral-800"
                                :disabled="i === sortedSections.length - 1"
                                @click="moveDown(s.id)"
                              >
                                <Icon icon="lucide:arrow-down" class="h-4 w-4 text-gray-400" />
                                Pindah ke Bawah
                              </button>

                              <button
                                type="button"
                                class="flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                                @click="duplicateSec(s.id)"
                              >
                                <Icon icon="lucide:copy" class="h-4 w-4 text-gray-400" />
                                Duplikat Blok
                              </button>

                              <button
                                type="button"
                                class="flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                                @click="
                                  localEdits[s.id].enabled = !localEdits[s.id].enabled;
                                  saveSection(s.id, { enabled: localEdits[s.id].enabled })
                                "
                              >
                                <span class="inline-flex items-center gap-2">
                                  <Icon
                                    :icon="localEdits[s.id]?.enabled ? 'lucide:eye-off' : 'lucide:eye'"
                                    class="h-4 w-4 text-gray-400"
                                  />
                                  {{ localEdits[s.id]?.enabled ? 'Sembunyikan Blok' : 'Tampilkan Blok' }}
                                </span>

                                <span
                                  class="rounded-full px-2 py-0.5 text-[10px] font-black"
                                  :class="localEdits[s.id]?.enabled
                                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                                    : 'bg-gray-100 text-gray-500 dark:bg-neutral-800 dark:text-neutral-300'"
                                >
                                  {{ localEdits[s.id]?.enabled ? 'Aktif' : 'Off' }}
                                </span>
                              </button>

                              <div class="my-1 border-t border-gray-100 dark:border-neutral-800"></div>

                              <button
                                type="button"
                                class="flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-left text-sm font-bold text-rose-700 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-900/10"
                                @click="deleteSec(s.id)"
                              >
                                <Icon icon="lucide:trash-2" class="h-4 w-4" />
                                Hapus Blok
                              </button>
                            </div>
                          </details>
                        </div>
                      </div>
                    </div>

                    <!-- Block body -->
                    <div class="space-y-5 p-5 md:p-6">
                      <component
                        v-if="resolveSectionComponent(s.key)"
                        :is="resolveSectionComponent(s.key)"
                        :section="s"
                        :pagePath="needsPagePath(s.key) ? currentPath : undefined"
                        :web="needsPagePath(s.key) ? web : undefined"
                      />

                      <template v-else>
                        <div class="rounded-[24px] border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-900/10">
                          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                              <h4 class="text-sm font-black text-amber-900 dark:text-amber-200">
                                Editor Lanjutan
                              </h4>
                              <p class="mt-1 text-sm leading-6 text-amber-800/80 dark:text-amber-200/80">
                                Blok ini belum punya form khusus. Gunakan editor data lanjutan di bawah ini hanya jika memahami struktur kontennya.
                              </p>
                            </div>

                            <div class="flex items-center gap-2">
                              <button
                                type="button"
                                class="inline-flex h-10 items-center justify-center rounded-2xl border border-amber-200 bg-white px-3 text-xs font-bold text-amber-800 transition hover:bg-amber-50 dark:border-amber-900/40 dark:bg-neutral-900 dark:text-amber-200 dark:hover:bg-amber-900/10"
                                @click="resetPropsFromServer(s.id)"
                              >
                                Reset
                              </button>

                              <button
                                type="button"
                                class="inline-flex h-10 items-center justify-center rounded-2xl bg-green-600 px-3 text-xs font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
                                :disabled="!!jsonErrors[s.id]"
                                @click="saveProps(s.id)"
                              >
                                Simpan Data
                              </button>
                            </div>
                          </div>
                        </div>

                        <textarea
                          v-model="localEdits[s.id].propsText"
                          class="min-h-[320px] w-full rounded-[24px] border border-gray-200 bg-white px-4 py-4 font-mono text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                          @input="validateJson(s.id)"
                        ></textarea>

                        <p
                          class="text-sm font-medium"
                          :class="jsonErrors[s.id] ? 'text-rose-600 dark:text-rose-300' : 'text-green-600 dark:text-green-300'"
                        >
                          {{ jsonErrors[s.id] ? jsonErrors[s.id] : 'Data valid dan siap disimpan.' }}
                        </p>
                      </template>
                    </div>
                  </article>
                </div>
              </template>
            </div>
          </section>
          <aside v-if="ui.showMeta" class="order-1 min-w-0 2xl:order-2 2xl:self-start" data-web-meta-panel>
            <section class="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 2xl:sticky 2xl:top-24">
              <div class="border-b border-gray-200 px-5 py-4 dark:border-neutral-800 md:px-6">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Pengaturan SEO</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                      Atur judul Google, deskripsi, status terbit, dan gambar saat link dibagikan.
                    </p>
                  </div>
                  <button
                    type="button"
                    class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="ui.metaCollapsed = !ui.metaCollapsed"
                  >
                    <Icon :icon="ui.metaCollapsed ? 'lucide:chevron-down' : 'lucide:chevron-up'" class="h-4 w-4" />
                  </button>
                </div>
              </div>
  
              <div v-show="!ui.metaCollapsed" class="space-y-6 p-5 md:p-6">
                            
                <div class="rounded-3xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <div class="text-sm font-semibold text-gray-900 dark:text-white">Publish State</div>
                      <div class="mt-1 text-xs text-gray-500 dark:text-neutral-400">Status saat ini: {{ meta?.status || 'draft' }}</div>
                    </div>
                    <label class="inline-flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-200">
                      <input type="checkbox" :checked="meta?.status === 'published'" @change="toggleStatus" class="rounded border-gray-300 text-green-600 focus:ring-green-500" /> Published
                    </label>
                  </div>
                </div>

                <div class="grid lg:grid-cols-2 grid-cols-1 gap-4">
                  <div class="space-y-5 rounded-[26px] border border-gray-200 bg-linear-to-b from-white to-gray-50 p-4 dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-900">
                    <div class="space-y-2">
                      <label class="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Path</label>
                      <div class="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">{{ currentPath }}</div>
                    </div>
  
                    <div class="space-y-2">
                      <label class="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Judul</label>
                      <input type="text" v-model.trim="formMeta.title" @input="debouncedSaveMeta()" class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.12)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" placeholder="Judul SEO halaman" />
                    </div>
  
                    <div class="space-y-2">
                      <label class="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Deskripsi</label>
                      <textarea rows="4" v-model.trim="formMeta.description" @input="debouncedSaveMeta()" class="block w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.12)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" placeholder="Deskripsi singkat untuk SEO dan preview halaman"></textarea>
                    </div>
                  </div>
                  <div class="space-y-4 rounded-[26px] border border-gray-200 bg-linear-to-b from-white to-gray-50 p-4 dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-900">
                    <div>
                      <div class="flex items-center justify-between gap-3">
                        <div>
                          <div class="text-sm font-bold text-gray-900 dark:text-white">OG Image</div>
                        </div>
                        <div class="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                          <button type="button" class="rounded-2xl px-3 py-2 text-xs font-semibold transition" :class="ogMode === 'link' ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200' : 'text-gray-500 hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white'" @click="ogMode = 'link'">Link</button>
                          <button type="button" class="rounded-2xl px-3 py-2 text-xs font-semibold transition" :class="ogMode === 'upload' ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200' : 'text-gray-500 hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white'" @click="ogMode = 'upload'">Upload</button>
                        </div>
                      </div>
                    </div>
  
                    <div v-if="ogMode === 'link'" class="space-y-3">
                      <div class="relative">
                        <Icon icon="lucide:link-2" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input v-model.trim="ogLinkInput" type="url" placeholder="https://..." class="block h-12 w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.12)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
                      </div>
                      <div class="flex flex-wrap items-center gap-2">
                        <button class="inline-flex h-11 items-center justify-center rounded-2xl bg-green-600 px-4 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:opacity-60" :disabled="!ogLinkInput" @click="applyOgLink">
                          <Icon icon="lucide:check" class="mr-2 h-4 w-4" /> Gunakan Link
                        </button>
                        <button v-if="meta?.ogImage" class="inline-flex h-11 items-center justify-center rounded-2xl border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/30 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10" @click="removeOg">
                          <Icon icon="lucide:trash-2" class="mr-2 h-4 w-4" /> Hapus Gambar
                        </button>
                      </div>
                    </div>
  
                    <div v-else class="space-y-3">
                      <div class="rounded-[24px] border border-dashed border-green-200 bg-green-50/70 p-4 dark:border-green-900/30 dark:bg-green-900/10">
                        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div class="text-sm font-semibold text-gray-900 dark:text-white">Upload File Gambar</div>
                            <div class="mt-1 text-xs text-gray-500 dark:text-neutral-400">Pilih gambar, upload, lalu URL akan langsung dipakai sebagai OG image.</div>
                          </div>
                          <div class="flex items-center gap-2">
                            <input ref="ogPicker" type="file" accept="image/*" class="hidden" @change="onPickOg" />
                            <button class="inline-flex h-11 items-center justify-center rounded-2xl bg-green-600 px-4 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:opacity-60" @click="ogPicker?.click()" :disabled="uploading">
                              <Icon :icon="uploading ? 'lucide:loader-circle' : 'lucide:upload-cloud'" class="mr-2 h-4 w-4" :class="uploading ? 'animate-spin' : ''" />
                              {{ uploading ? 'Uploading...' : 'Upload' }}
                            </button>
                            <button v-if="meta?.ogImage" class="inline-flex h-11 items-center justify-center rounded-2xl border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/30 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10" @click="removeOg">
                              <Icon icon="lucide:trash-2" class="mr-2 h-4 w-4" /> Hapus
                            </button>
                          </div>
                        </div>
                        <p v-if="uploadError" class="mt-3 text-sm text-rose-600 dark:text-rose-300">{{ uploadError }}</p>
                      </div>
                    </div>
  
                    <div class="overflow-hidden rounded-[24px] border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                      <img v-if="meta?.ogImage" :src="meta.ogImage" alt="OG" class="h-56 w-full object-cover" />
                      <div v-else class="grid h-56 place-items-center p-6 text-center">
                        <div>
                          <div class="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
                            <Icon icon="lucide:image" class="h-5 w-5" />
                          </div>
                          <div class="mt-3 text-sm font-semibold text-gray-900 dark:text-white">Belum ada OG image</div>
                          <div class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Pakai link langsung atau upload ke Cloudinary.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>

    <teleport to="body">
      <div v-if="modal.newPage || modal.rename || modal.clone" class="fixed inset-0 z-[100]">
        <div class="absolute inset-0 bg-black/45 backdrop-blur-sm" @click="closeAllModals"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4 md:p-8">
          <div class="w-full max-w-xl overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
            <div class="border-b border-gray-200 px-5 py-4 dark:border-neutral-800 md:px-6">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h3 class="text-base font-bold text-gray-900 dark:text-white">
                    {{ modal.newPage ? 'Halaman Baru' : modal.rename ? 'Rename Path' : 'Clone Halaman' }}
                  </h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                    {{ modal.newPage
                      ? 'Buat halaman baru beserta metadata awal.'
                      : modal.rename
                        ? 'Ubah path halaman yang dipilih dengan aman.'
                        : 'Duplikat halaman ke path baru.' }}
                  </p>
                </div>
                <button class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800" @click="closeAllModals">
                  <Icon icon="lucide:x" class="h-4 w-4" />
                </button>
              </div>
            </div>

            <div class="space-y-4 p-5 md:p-6">
              <template v-if="modal.newPage">
                <div>
                  <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Path</label>
                  <input v-model.trim="formNew.path" placeholder="/, /profile, /program" class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.12)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Judul</label>
                  <input v-model.trim="formNew.title" class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.12)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Deskripsi</label>
                  <textarea v-model.trim="formNew.description" rows="3" class="block w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.12)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"></textarea>
                </div>
              </template>

              <template v-else-if="modal.rename">
                <div>
                  <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Path Lama</label>
                  <input :value="actionPath" readonly class="block h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200" />
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Path Baru</label>
                  <input v-model.trim="formRename.newPath" placeholder="/profile, /program" class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.12)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
                </div>
              </template>

              <template v-else>
                <div>
                  <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Sumber</label>
                  <input :value="actionPath" readonly class="block h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200" />
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Path Baru</label>
                  <input v-model.trim="formClone.dstPath" placeholder="/new-page" class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.12)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
                </div>
              </template>
            </div>

            <div class="flex items-center justify-end gap-2 border-t border-gray-200 px-5 py-4 dark:border-neutral-800 md:px-6">
              <button class="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800" @click="closeAllModals">Batal</button>
              <button class="inline-flex h-11 items-center justify-center rounded-2xl bg-green-600 px-4 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700" @click="modal.newPage ? createPageNow() : modal.rename ? renameNow() : cloneNow()">
                {{ modal.newPage ? 'Buat' : modal.rename ? 'Rename' : 'Clone' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWeb } from '~/composables/data/useWeb'
import { useCloudinaryUpload } from '~/composables/useCloudinaryUpload'
import { useAsyncData, useHead, useRuntimeConfig, useSeoMeta } from 'nuxt/app'

import EditorHeaderHero from '~/components/editor/HeaderHero.vue'
import EditorInfoHero from '~/components/editor/InfoHero.vue'
import EditorInvitationHero from '~/components/editor/InvitationHero.vue'
import EditorFacilityHero from '~/components/editor/FacilityHero.vue'
import EditorBlogHero from '~/components/editor/BlogHero.vue'
import EditorNewsPage from '~/components/editor/NewsPage.vue'
import EditorGirlHero from '~/components/editor/GirlHero.vue'
import EditorGalleryPage from '~/components/editor/GalleryPage.vue'
import EditorProfilePage from '~/components/editor/ProfilePage.vue'
import EditorProgramPage from '~/components/editor/ProgramPage.vue'

definePageMeta({
  layout: 'app-web',
  layoutProps: { title: 'Website' }
})

const activeSectionId = ref<string>('')
const { uploadImage, uploading, uploadError } = useCloudinaryUpload()

const {
  pages, subscribePages,
  meta, sections, sortedSections,
  subscribePage,
  upsertMeta, deleteOgImage,
  addSection, updateSection, duplicateSection, deleteSection,
  moveSection,
  createPage, deletePage, renamePage, clonePage, publishPage,
  normalizePath, currentPath
} = useWeb()

const web = useWeb()
const ensureActivePath = (p = currentPath.value) => {
  ;(web as any)?.setActivePath?.(p)
}

const ui = reactive({
  showMeta: true,
  pagesCollapsed: false,
  metaCollapsed: false,
  sectionsCollapsed: false,
})

const route = useRoute()
const router = useRouter()
const runtime = useRuntimeConfig()

const actionPath = ref('/')
const ogMode = ref<'link' | 'upload'>('link')
const ogLinkInput = ref('')

function cleanText(value?: string) {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function limitText(value?: string, max = 160) {
  const clean = cleanText(value)

  if (!clean) return ''

  return clean.length > max
    ? `${clean.slice(0, max).trim()}...`
    : clean
}

function humanReadablePath(path?: string) {
  const p = normalizePath(String(path || '/'))

  if (p === '/') return 'Beranda'

  return p
    .replace(/^\//, '')
    .split('/')
    .filter(Boolean)
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, ' '))
    .join(' / ')
}

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

  return 'https://alinayah.sencra.io'
})

function toAbsoluteUrl(url?: string | null) {
  const fallback = runtime.public?.appLogo || '/assets/logo.png'
  const raw = String(url || fallback).trim()

  if (!raw) return `${siteOrigin.value}/assets/logo.png`

  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw
  }

  return `${siteOrigin.value}${raw.startsWith('/') ? raw : `/${raw}`}`
}

const appDisplayName = computed(() => {
  return (
    runtime.public?.appName ||
    runtime.public?.siteName ||
    runtime.public?.clientDisplayName ||
    'Obayan'
  )
})

const selectedPathTitle = computed(() => {
  return meta.value?.title || humanReadablePath(currentPath.value)
})

const selectedPathDescription = computed(() => {
  return limitText(
    meta.value?.description ||
      `Kelola konten, section, SEO, dan media untuk halaman ${humanReadablePath(currentPath.value)}.`,
    160
  )
})

const selectedPathOgImage = computed(() => {
  return toAbsoluteUrl(meta.value?.ogImage || runtime.public?.appLogo || '/assets/logo.png')
})

const selectedPathCanonical = computed(() => {
  return new URL(route.fullPath || '/app/web', siteOrigin.value).toString()
})

const selectedPublicPreviewUrl = computed(() => {
  const path = normalizePath(currentPath.value || '/')
  return `${siteOrigin.value}${path === '/' ? '/' : path}`
})

const selectedPathSeoTitle = computed(() => {
  return `Editor ${humanReadablePath(currentPath.value)} | ${appDisplayName.value}`
})

const selectedPathRobots = computed(() => {
  // Halaman /app/web adalah halaman admin, jadi lebih aman noindex.
  return 'noindex, nofollow'
})

useSeoMeta({
  title: () => selectedPathSeoTitle.value,
  description: () => selectedPathDescription.value,

  ogTitle: () => selectedPathSeoTitle.value,
  ogDescription: () => selectedPathDescription.value,
  ogType: 'website',
  ogUrl: () => selectedPathCanonical.value,
  ogImage: () => selectedPathOgImage.value,
  ogImageAlt: () => selectedPathTitle.value,
  ogSiteName: () => appDisplayName.value,
  ogLocale: 'id_ID',

  twitterCard: 'summary_large_image',
  twitterTitle: () => selectedPathSeoTitle.value,
  twitterDescription: () => selectedPathDescription.value,
  twitterImage: () => selectedPathOgImage.value,
  twitterImageAlt: () => selectedPathTitle.value,

  robots: () => selectedPathRobots.value,
  themeColor: () => String(runtime.public?.appThemeColor || runtime.public?.themeColor || '#16a34a')
})

useHead(() => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${appDisplayName.value} Website CMS`,
    description: selectedPathDescription.value,
    url: selectedPathCanonical.value,
    applicationCategory: 'ContentManagementSystem',
    operatingSystem: 'Web',
    about: {
      '@type': 'WebPage',
      name: selectedPathTitle.value,
      url: selectedPublicPreviewUrl.value
    }
  }

  return {
    link: [
      {
        rel: 'canonical',
        href: selectedPathCanonical.value
      }
    ],

    meta: [
      {
        name: 'thumbnail',
        content: selectedPathOgImage.value
      },
      {
        name: 'x-selected-path',
        content: normalizePath(currentPath.value || '/')
      },
      {
        name: 'x-public-preview-url',
        content: selectedPublicPreviewUrl.value
      }
    ],

    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(jsonLd)
      }
    ]
  }
})

type SectionMediaState = {
  mode: 'link' | 'upload'
  link: string
  url: string
}
const sectionMediaStates = reactive<Record<string, SectionMediaState>>({})
const sectionMediaPicker = ref<HTMLInputElement | null>(null)
const currentMediaSectionId = ref('')

function sectionMedia(id: string): SectionMediaState {
  if (!sectionMediaStates[id]) {
    sectionMediaStates[id] = { mode: 'link', link: '', url: '' }
  }
  return sectionMediaStates[id]
}

const localEdits = reactive<Record<string, { key: string; enabled: boolean; propsText: string }>>({})
const jsonErrors = reactive<Record<string, string | ''>>({})

watch(() => route.query.path, (p) => {
  const np = normalizePath(String(p || '/'))
  if (np !== currentPath.value) currentPath.value = np
}, { immediate: true })

watch(currentPath, async (p) => {
  Object.keys(localEdits).forEach((key) => delete localEdits[key])
  Object.keys(jsonErrors).forEach((key) => delete jsonErrors[key])
  await subscribePage(p)
  hydrateMetaForm()
  ensureActivePath(p)
  actionPath.value = p
  await nextTick()
}, { immediate: true })

watch(meta, (val) => {
  ogLinkInput.value = val?.ogImage || ''
}, { immediate: true, deep: true })

function selectPath(p: string) {
  const np = normalizePath(p)
  actionPath.value = np
  router.replace({ query: { ...route.query, path: np } })
}
function isCurrent(p: any) {
  return normalizePath(p.path) === currentPath.value
}

const qPage = ref('')
const filteredPages = computed(() => {
  const q = qPage.value.trim().toLowerCase()
  if (!q) return pages.value
  return pages.value.filter((p) =>
    (p.path || '').toLowerCase().includes(q) ||
    (p.title || '').toLowerCase().includes(q)
  )
})

const formMeta = reactive<{ title: string; description: string }>({ title: '', description: '' })
function hydrateMetaForm() {
  formMeta.title = meta.value?.title || ''
  formMeta.description = meta.value?.description || ''
}

let metaSaveTimer: ReturnType<typeof setTimeout> | null = null
function debouncedSaveMeta() {
  if (metaSaveTimer) clearTimeout(metaSaveTimer)
  metaSaveTimer = setTimeout(() => {
    upsertMeta({ title: formMeta.title, description: formMeta.description })
  }, 450)
}

function toggleStatus(e: Event) {
  const checked = (e.target as HTMLInputElement).checked
  upsertMeta({ status: checked ? 'published' : 'draft' })
}

const ogPicker = ref<HTMLInputElement | null>(null)
async function onPickOg(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0] || null
  if (!f) return
  const upload = await uploadImage(f, { folder: `alinayah/web/og/${(currentPath.value || '/').replace(/\//g, '_')}` })
  if (upload?.secure_url) {
    await upsertMeta({ ogImage: upload.secure_url, ogImagePath: null })
    ogLinkInput.value = upload.secure_url
    ogMode.value = 'link'
  }
  if (ogPicker.value) ogPicker.value.value = ''
}

async function applyOgLink() {
  if (!ogLinkInput.value.trim()) return
  await upsertMeta({ ogImage: ogLinkInput.value.trim(), ogImagePath: null })
}

async function removeOg() {
  if (!meta.value?.ogImagePath) {
    await upsertMeta({ ogImage: null, ogImagePath: null })
    ogLinkInput.value = ''
    return
  }
  try {
    await deleteOgImage(meta.value.ogImagePath)
  } catch {}
  await upsertMeta({ ogImage: null, ogImagePath: null })
  ogLinkInput.value = ''
}

watch(sortedSections, (list) => {
  const ids = list.map((section) => section.id)

  if (!ids.length) {
    activeSectionId.value = ''
    return
  }

  if (!ids.includes(activeSectionId.value)) activeSectionId.value = ids[0] || ''
  const idSet = new Set(ids)

  for (const section of list) {
    sectionMedia(section.id)
  }

  for (const id of Object.keys(sectionMediaStates)) {
    if (!idSet.has(id)) delete sectionMediaStates[id]
  }
}, { immediate: true })

const newSection = reactive<{ key: string }>({ key: '' })

const availableSectionTypes = [
  {
    key: 'HeaderHero',
    label: 'Banner Utama',
    description: 'Area pembuka halaman berisi judul, deskripsi, CTA, dan gambar utama.'
  },
  {
    key: 'InfoHero',
    label: 'Info Singkat',
    description: 'Blok ringkas untuk menampilkan informasi penting atau highlight.'
  },
  {
    key: 'InvitationHero',
    label: 'Ajakan / Pendaftaran',
    description: 'Blok ajakan untuk pendaftaran, kunjungan, atau promosi program.'
  },
  {
    key: 'HeroFacilityHero',
    label: 'Fasilitas',
    description: 'Menampilkan fasilitas atau keunggulan layanan.'
  },
  {
    key: 'BlogHero',
    label: 'Berita / Artikel',
    description: 'Menampilkan konten berita, artikel, atau publikasi.'
  },
  {
    key: 'GirlHero',
    label: 'Akses Yayasan',
    description: 'Banner visual khusus untuk konten putri atau segment tertentu.'
  },
  {
    key: 'NewsPage',
    label: 'Halaman Berita',
    description: 'Daftar berita dan informasi terbaru.'
  },
  {
    key: 'GalleryPage',
    label: 'Galeri',
    description: 'Menampilkan foto kegiatan atau dokumentasi.'
  },
  {
    key: 'ProfilePage',
    label: 'Profil Lembaga',
    description: 'Konten profil, sejarah, visi, dan misi.'
  },
] as const

function sectionLabel(key?: string) {
  return availableSectionTypes.find((item) => item.key === key)?.label || key || 'Blok Konten'
}

function sectionDescription(key?: string) {
  return availableSectionTypes.find((item) => item.key === key)?.description || 'Blok konten khusus untuk halaman ini.'
}

async function addNewSection() {
  const key = newSection.key.trim()
  if (!key) return

  ensureActivePath()

  const newId = await addSection({
    key,
    enabled: true
  })

  if (newId) {
    activeSectionId.value = newId
  }

  newSection.key = ''
  await nextTick()
}

watch(sections, (list) => {
  for (const s of list) {
    if (!localEdits[s.id]) {
      localEdits[s.id] = {
        key: s.key,
        enabled: s.enabled,
        propsText: s.props ? JSON.stringify(s.props, null, 2) : ''
      }
      jsonErrors[s.id] = ''
    }
  }
  const ids = new Set(list.map((s) => s.id))
  for (const k of Object.keys(localEdits)) if (!ids.has(k)) delete localEdits[k]
  for (const k of Object.keys(jsonErrors)) if (!ids.has(k)) delete jsonErrors[k]
}, { immediate: true })

function validateJson(id: string) {
  const t = localEdits[id]?.propsText || ''
  if (!t.trim()) {
    jsonErrors[id] = ''
    return
  }
  try {
    JSON.parse(t)
    jsonErrors[id] = ''
  } catch (e: any) {
    jsonErrors[id] = e?.message || 'JSON invalid'
  }
}

async function saveSection(id: string, patch: { key?: string; enabled?: boolean }) {
  ensureActivePath()
  await updateSection(id, patch)
}

async function saveProps(id: string) {
  if (jsonErrors[id]) return
  ensureActivePath()
  const t = localEdits[id]?.propsText || ''
  const props = t.trim() ? JSON.parse(t) : null
  await updateSection(id, { props })
}

function resetPropsFromServer(id: string) {
  const s = sections.value.find((x) => x.id === id)
  if (!s) return
  localEdits[id]!.propsText = s.props ? JSON.stringify(s.props, null, 2) : ''
  jsonErrors[id] = ''
}

async function duplicateSec(id: string) {
  ensureActivePath()
  const newId = await duplicateSection(id)
  if (newId) activeSectionId.value = newId
}

async function deleteSec(id: string) {
  if (!confirm('Hapus section ini?')) return
  ensureActivePath()
  await deleteSection(id)
}

async function moveUp(id: string) {
  ensureActivePath()
  await moveSection(id, 'up')
}

async function moveDown(id: string) {
  ensureActivePath()
  await moveSection(id, 'down')
}

function triggerSectionMediaPick(id: string) {
  currentMediaSectionId.value = id
  sectionMediaPicker.value?.click()
}

async function onPickSectionMedia(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] || null
  const id = currentMediaSectionId.value
  if (!file || !id) return
  const upload = await uploadImage(file, { folder: `alinayah/web/sections/${(currentPath.value || '/').replace(/\//g, '_')}/${id}` })
  if (upload?.secure_url) {
    sectionMedia(id).url = upload.secure_url
    sectionMedia(id).link = upload.secure_url
    sectionMedia(id).mode = 'link'
  }
  if (sectionMediaPicker.value) sectionMediaPicker.value.value = ''
}

function applySectionMediaLink(id: string) {
  const value = sectionMedia(id).link.trim()
  if (!value) return
  sectionMedia(id).url = value
}

async function copySectionMediaUrl(id: string) {
  const value = sectionMedia(id).url
  if (!value) return
  try {
    await navigator.clipboard.writeText(value)
  } catch {}
}

function insertMediaIntoJson(id: string) {
  const value = sectionMedia(id).url
  if (!value || !localEdits[id]) return
  try {
    const raw = localEdits[id].propsText?.trim()
    if (!raw) {
      localEdits[id].propsText = JSON.stringify({ image: value }, null, 2)
      validateJson(id)
      return
    }
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      if (!('image' in parsed)) parsed.image = value
      else if (!('media' in parsed)) parsed.media = value
      else if (Array.isArray(parsed.media)) parsed.media.push(value)
      else parsed.media = [parsed.media, value]
      localEdits[id].propsText = JSON.stringify(parsed, null, 2)
      validateJson(id)
    }
  } catch {}
}

const componentMap: Record<string, any> = {
  HeaderHero: EditorHeaderHero,
  InfoHero: EditorInfoHero,
  InvitationHero: EditorInvitationHero,
  HeroFacilityHero: EditorFacilityHero,
  BlogHero: EditorBlogHero,
  GirlHero: EditorGirlHero,
  NewsPage: EditorNewsPage,
  GalleryPage: EditorGalleryPage,
  ProfilePage: EditorProfilePage,
  ProgramPage: EditorProgramPage,
}

function resolveSectionComponent(key: string) {
  return componentMap[key] || null
}
function needsPagePath(key: string) {
  return ['NewsPage', 'GalleryPage', 'ProfilePage', 'ProgramPage'].includes(key)
}

const modal = reactive<{ newPage: boolean; rename: boolean; clone: boolean }>({ newPage: false, rename: false, clone: false })
const formNew = reactive<{ path: string; title: string; description: string }>({ path: '/', title: '', description: '' })
const formRename = reactive<{ newPath: string }>({ newPath: '/' })
const formClone = reactive<{ dstPath: string }>({ dstPath: '/' })

function closeAllModals() {
  modal.newPage = false
  modal.rename = false
  modal.clone = false
}

function openNewPage() {
  formNew.path = '/'
  formNew.title = ''
  formNew.description = ''
  modal.newPage = true
}

function openRenameFor(path: string) {
  actionPath.value = normalizePath(path)
  formRename.newPath = actionPath.value
  modal.rename = true
}

function openCloneFor(path: string) {
  actionPath.value = normalizePath(path)
  formClone.dstPath = '/'
  modal.clone = true
}

async function askDeleteFor(path: string) {
  const target = normalizePath(path)
  if (!confirm(`Hapus halaman \"${target}\" beserta seluruh section?`)) return
  await deletePage(target)
  if (target === currentPath.value) selectPath('/')
}

async function createPageNow() {
  const p = normalizePath(formNew.path || '/')
  await createPage({ path: p, title: formNew.title, description: formNew.description, status: 'draft' })
  modal.newPage = false
  selectPath(p)
}

function openRenamePage() {
  openRenameFor(currentPath.value)
}

async function renameNow() {
  const np = normalizePath(formRename.newPath || '/')
  const old = actionPath.value || currentPath.value
  if (np === old) {
    modal.rename = false
    return
  }
  await renamePage(old, np)
  modal.rename = false
  if (old === currentPath.value) selectPath(np)
}

function openClonePage() {
  openCloneFor(currentPath.value)
}

async function cloneNow() {
  const src = actionPath.value || currentPath.value
  const dst = normalizePath(formClone.dstPath || '/')
  await clonePage(src, dst)
  modal.clone = false
  selectPath(dst)
}

async function askDeletePage() {
  await askDeleteFor(currentPath.value)
}

async function publish() {
  ensureActivePath()
  await publishPage(currentPath.value)
}

async function reloadPages() {
  subscribePages()
}

watch(currentPath, (p) => {
  ensureActivePath(p)
})

onMounted(async () => {
  subscribePages()
  const initial = normalizePath(String(route.query.path || '/'))
  currentPath.value = initial
  actionPath.value = initial
  ensureActivePath(initial)
  await subscribePage(initial)
  hydrateMetaForm()
  ogLinkInput.value = meta.value?.ogImage || ''
})
</script>