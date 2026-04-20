<template>
  <div class="min-h-full bg-transparent text-gray-800 dark:text-neutral-200">
    <div class="mx-auto max-w-[1700px] space-y-6 p-4 md:p-6">
      <section class="relative overflow-hidden rounded-[32px] border border-green-100 bg-gradient-to-br from-green-600 via-emerald-600 to-lime-500 p-5 text-white shadow-[0_24px_60px_-18px_rgba(22,163,74,0.38)] md:p-6">
        <div class="absolute inset-0 opacity-20">
          <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white blur-3xl"></div>
          <div class="absolute bottom-0 left-8 h-32 w-32 rounded-full bg-lime-100 blur-3xl"></div>
        </div>

        <div class="relative z-10 grid gap-5 xl:grid-cols-[1.2fr,0.8fr] xl:items-end">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
              <span class="inline-block h-2 w-2 rounded-full bg-lime-300"></span>
              Navbar Editor Workspace
            </div>
            <h1 class="mt-4 text-2xl font-black tracking-tight md:text-4xl">Navbar Editor</h1>
            <p class="mt-3 max-w-2xl text-sm leading-6 text-green-50/95 md:text-base">
              Kelola brand, cover, tautan utama, mega menu, dan blok CTA dalam satu editor yang lebih cepat, lebih rapi, dan lebih nyaman dipakai di desktop maupun mobile.
            </p>

          </div>

          <div class="grid gap-3 md:grid-cols-3 grid-cols-1">
            <div class="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
              <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-green-100">Nav Links</div>
              <div class="mt-2 text-2xl font-black">{{ form.navLinks.length }}</div>
              <div class="mt-1 text-xs text-green-50/90">tautan utama aktif</div>
            </div>
            <div class="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
              <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-green-100">Mega Menu</div>
              <div class="mt-2 text-2xl font-black">{{ totalMegaItems }}</div>
              <div class="mt-1 text-xs text-green-50/90">item terkelola</div>
            </div>
            <div class="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
              <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-green-100">Status</div>
              <div class="mt-2 text-base font-black leading-6">{{ isDirty ? 'Belum disimpan' : 'Sinkron' }}</div>
              <div class="mt-1 text-xs text-green-50/90">{{ externalChanged ? 'Ada update eksternal' : 'Tidak ada konflik' }}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <div class="space-y-6">
          <div class="sticky top-4 z-20 rounded-[28px] border border-gray-200/80 bg-white/92 p-4 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/92">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 class="text-base font-bold text-gray-900 dark:text-white">Workspace Aksi</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Simpan perubahan kapan saja tanpa kehilangan posisi scroll.</p>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  :disabled="saving || uploading"
                  @click="resetToDefault"
                >
                  Default
                </button>
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  :disabled="saving || uploading"
                  @click="reloadFromDatabase"
                >
                  Muat Ulang
                </button>
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="saving || uploading || !isDirty"
                  @click="saveAll"
                >
                  {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
                </button>
              </div>
            </div>

            <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-white">
              <span
                class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold"
                :class="isDirty ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300' : 'bg-emerald-50 dark:bg-emerald-900/20'"
              >
                <ClientOnly>
                  <Icon :icon="isDirty ? 'lucide:triangle-alert' : 'lucide:badge-check'" class="h-3.5 w-3.5" />
                </ClientOnly>
                {{ isDirty ? 'Perubahan belum disimpan' : 'Perubahan tersimpan' }}
              </span>

              <span
                v-if="externalChanged"
                class="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 font-semibold text-sky-700 dark:bg-sky-900/20 dark:text-sky-300"
              >
                <ClientOnly><Icon icon="lucide:refresh-cw" class="h-3.5 w-3.5" /></ClientOnly>
                Ada update eksternal di database
              </span>

              <span v-if="note" :class="ok ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'" class="font-medium">
                {{ note }}
              </span>
              <span v-if="uploadError" class="font-medium text-rose-600 dark:text-rose-300">{{ uploadError }}</span>
            </div>
          </div>

          <section class="rounded-[30px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="grid gap-4 lg:grid-cols-[0.95fr,1.05fr]">
              <div>
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Brand</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Nama utama dan versi singkat untuk tampilan navbar.</p>
                  </div>
                  <div class="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    <ClientOnly><Icon icon="lucide:type" class="h-3.5 w-3.5" /></ClientOnly>
                    Identity
                  </div>
                </div>

                <div class="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Nama Brand</label>
                    <input v-model.trim="form.brand" :class="inputBase" placeholder="Pondok Pesantren ALINAYAH" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Brand Short</label>
                    <input v-model.trim="form.brandShorten" :class="inputBase" placeholder="ALINAYAH" />
                  </div>
                </div>
              </div>

              <div>
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Cover Ponpes</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Visual utama untuk blok showcase / hero navbar.</p>
                  </div>
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    :disabled="uploading"
                    @click="coverInput?.click()"
                  >
                    <ClientOnly><Icon icon="lucide:image-up" class="h-4 w-4 mr-1" /></ClientOnly>
                    Upload Cover
                  </button>
                  <input ref="coverInput" type="file" accept="image/*" class="hidden" @change="onUploadCoverPonpes" />
                </div>

                <div class="mt-5 grid gap-4 md:grid-cols-[1fr,0.9fr]">
                  <div class="aspect-[16/10] overflow-hidden rounded-[24px] border border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-800/60">
                    <img v-if="form.coverPonpes" :src="form.coverPonpes" alt="Cover Ponpes" class="h-full w-full object-cover" />
                    <div v-else class="grid h-full place-items-center text-sm text-gray-500 dark:text-neutral-400">Belum ada gambar</div>
                  </div>
                  <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                    <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">URL</div>
                    <div class="mt-2 break-all text-xs text-gray-600 dark:text-neutral-300">{{ form.coverPonpes || '-' }}</div>
                    <div v-if="uploading && uploadTarget === 'coverPonpes'" class="mt-4 rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-green-700 dark:bg-neutral-900 dark:text-green-300">
                      Mengunggah cover ke Cloudinary...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="rounded-[30px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Nav Links</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Tautan utama yang tampil pada navbar desktop dan mobile.</p>
              </div>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                @click="addLink"
              >
                <ClientOnly><Icon icon="lucide:plus" class="h-4 w-4 mr-1" /></ClientOnly>
                Tambah Link
              </button>
            </div>

            <div class="mt-5 space-y-3 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
              <article
                v-for="(link, i) in form.navLinks"
                :key="i"
                class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
              >
                <div class="flex flex-col gap-4 lg:flex-row lg:items-start">
                  <div class="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-gray-700 ring-1 ring-black/5 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-white/10">
                    <ClientOnly><Icon :icon="link.icon || 'ph:dot-outline'" class="h-5 w-5" /></ClientOnly>
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <input v-model.trim="link.label" :class="inputBase" placeholder="Label" />
                    <input v-model.trim="link.href" :class="inputBase" placeholder="/path#anchor" />
                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      @click="openIconPicker((icon) => (link.icon = icon))"
                    >
                      Icon
                    </button>
                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
                      @click="removeLink(i)"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section class="rounded-[30px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Mega Menu</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Kelompokkan item agar struktur navigasi besar tetap rapi dan mudah dikelola.</p>
              </div>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                @click="addGroup"
              >
                <ClientOnly><Icon icon="lucide:plus" class="h-4 w-4 mr-1" /></ClientOnly>
                Tambah Grup
              </button>
            </div>

            <div class="mt-5 space-y-5">
              <article
                v-for="(group, gidx) in form.megaMenu"
                :key="gidx"
                class="rounded-[26px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
              >
                <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <div class="flex-1">
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Judul Grup</label>
                    <input v-model.trim="group.title" :class="inputBase" />
                  </div>
                  <div class="flex items-center gap-2 lg:pt-6">
                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      @click="addItem(gidx)"
                    >
                      Tambah Item
                    </button>
                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
                      @click="removeGroup(gidx)"
                    >
                      Hapus Grup
                    </button>
                  </div>
                </div>

                <div class="mt-4 grid gap-3">
                  <article
                    v-for="(item, idx) in group.items"
                    :key="idx"
                    class="rounded-[22px] border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
                      <div class="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                        <ClientOnly><Icon :icon="item.icon || 'ph:square'" class="h-5 w-5" /></ClientOnly>
                      </div>
                      <div class="min-w-0 flex-1">
                        <div class="truncate text-sm font-bold text-gray-900 dark:text-white">{{ item.label || 'Item tanpa judul' }}</div>
                        <div class="mt-1 truncate text-xs text-gray-500 dark:text-neutral-400">{{ item.desc || 'Belum ada deskripsi' }} · {{ item.href || '#' }}</div>
                      </div>
                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                          @click="openItemModal(gidx, idx)"
                        >
                          Edit Item
                        </button>
                        <button
                          type="button"
                          class="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
                          @click="removeItem(gidx, idx)"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              </article>
            </div>
          </section>

          <section class="rounded-[30px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="grid gap-5 xl:grid-cols-[1fr,0.92fr]">
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">PPDB CTA</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Call-to-action utama untuk pendaftaran santri baru.</p>

                <div class="mt-5 space-y-4">
                  <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">PPDB Title</label>
                    <input v-model.trim="form.ppdbCta.title" :class="inputBase" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">PPDB Description</label>
                    <textarea v-model.trim="form.ppdbCta.desc" rows="3" :class="inputBase"></textarea>
                  </div>
                  <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">PPDB Link</label>
                    <input v-model.trim="form.ppdbCta.href" :class="inputBase" />
                  </div>

                  <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div class="text-sm font-semibold text-gray-900 dark:text-white">Gambar PPDB</div>
                        <div class="mt-1 text-xs text-gray-500 dark:text-neutral-400 break-all">{{ form.ppdbCta.image || 'Belum ada gambar' }}</div>
                      </div>
                      <button
                        type="button"
                        class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        :disabled="uploading"
                        @click="ppdbInput?.click()"
                      >
                        Upload Gambar
                      </button>
                      <input ref="ppdbInput" type="file" accept="image/*" class="hidden" @change="onUploadPPDB" />
                    </div>
                    <div v-if="uploading && uploadTarget === 'ppdbCta'" class="mt-3 rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-green-700 dark:bg-neutral-900 dark:text-green-300">
                      Mengunggah gambar PPDB ke Cloudinary...
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div class="aspect-[16/10] overflow-hidden rounded-[24px] border border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-800/60">
                  <img v-if="form.ppdbCta.image" :src="form.ppdbCta.image" alt="PPDB" class="h-full w-full object-cover" />
                  <div v-else class="grid h-full place-items-center text-sm text-gray-500 dark:text-neutral-400">Belum ada gambar</div>
                </div>

                <div class="mt-5">
                  <div class="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <h4 class="text-base font-bold text-gray-900 dark:text-white">CTA Buttons</h4>
                      <p class="text-sm text-gray-500 dark:text-neutral-400">Tombol tambahan di area kanan navbar.</p>
                    </div>
                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      @click="addCTA"
                    >
                      Tambah CTA
                    </button>
                  </div>

                  <div class="space-y-3">
                    <article
                      v-for="(button, i) in form.ctaButtons"
                      :key="i"
                      class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
                    >
                      <div class="grid gap-3 md:grid-cols-[140px,1fr,1fr,auto]">
                        <select v-model="button.style" :class="inputBase">
                          <option value="primary">primary</option>
                          <option value="outline">outline</option>
                        </select>
                        <input v-model.trim="button.label" :class="inputBase" placeholder="Label" />
                        <input v-model.trim="button.href" :class="inputBase" placeholder="/route" />
                        <button
                          type="button"
                          class="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
                          @click="removeCTA(i)"
                        >
                          Hapus
                        </button>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside class="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <section class="rounded-[30px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Live Preview</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Pratinjau ringkas struktur navbar agar perubahan lebih cepat divalidasi.</p>
              </div>
              <div class="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <ClientOnly><Icon icon="lucide:eye" class="h-3.5 w-3.5" /></ClientOnly>
                Preview
              </div>
            </div>

            <div class="mt-5 overflow-hidden rounded-[28px] border border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-800/60">
              <div class="border-b border-gray-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900">
                <div class="flex flex-wrap items-center gap-3">
                  <div class="truncate text-lg font-black tracking-tight text-gray-900 dark:text-white">{{ form.brandShorten || 'BRAND' }}</div>
                  <div class="ml-auto flex flex-wrap items-center gap-2">
                    <span
                      v-for="(link, i) in previewLinks"
                      :key="link.label + i"
                      class="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] font-semibold text-gray-700 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                    >
                      {{ link.label || 'Label' }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="p-4">
                <div class="aspect-[16/8] overflow-hidden rounded-[22px] bg-gray-100 dark:bg-neutral-800">
                  <img v-if="form.coverPonpes" :src="form.coverPonpes" alt="Preview cover" class="h-full w-full object-cover" />
                  <div v-else class="grid h-full place-items-center text-sm text-gray-500 dark:text-neutral-400">Belum ada cover utama</div>
                </div>

                <div class="mt-4 grid gap-3 sm:grid-cols-2">
                  <article
                    v-for="group in previewGroups"
                    :key="group.title"
                    class="rounded-[22px] border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <div class="text-sm font-bold text-gray-900 dark:text-white">{{ group.title || 'Group' }}</div>
                    <div class="mt-3 space-y-2">
                      <div
                        v-for="item in group.items.slice(0, 3)"
                        :key="item.label + item.href"
                        class="flex items-start gap-3"
                      >
                        <div class="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                          <ClientOnly><Icon :icon="item.icon || 'ph:square'" class="h-4 w-4" /></ClientOnly>
                        </div>
                        <div class="min-w-0">
                          <div class="truncate text-sm font-semibold text-gray-900 dark:text-white">{{ item.label || 'Item' }}</div>
                          <div class="truncate text-xs text-gray-500 dark:text-neutral-400">{{ item.desc || 'Tanpa deskripsi' }}</div>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>

                <div class="mt-4 rounded-[24px] border border-green-100 bg-green-50/70 p-4 dark:border-green-900/30 dark:bg-green-900/10">
                  <div class="text-sm font-bold text-green-800 dark:text-green-200">{{ form.ppdbCta.title || 'PPDB CTA' }}</div>
                  <div class="mt-1 text-sm text-green-700 dark:text-green-300">{{ form.ppdbCta.desc || 'Deskripsi CTA akan tampil di sini.' }}</div>
                  <div class="mt-3 flex flex-wrap gap-2">
                    <span
                      v-for="(button, i) in form.ctaButtons"
                      :key="button.label + i"
                      class="rounded-full px-3 py-1.5 text-[11px] font-semibold"
                      :class="button.style === 'primary' ? 'bg-green-600 text-white' : 'border border-green-300 text-green-800 dark:border-green-700 dark:text-green-200'"
                    >
                      {{ button.label || 'CTA' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="rounded-[30px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Ringkasan Struktur</h3>
            <div class="mt-4 space-y-3">
              <div class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Brand</div>
                <div class="mt-2 text-sm font-bold text-gray-900 dark:text-white">{{ form.brand || 'Belum diisi' }}</div>
              </div>
              <div class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Grup Mega Menu</div>
                <div class="mt-2 text-sm font-bold text-gray-900 dark:text-white">{{ form.megaMenu.length }} grup · {{ totalMegaItems }} item</div>
              </div>
              <div class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Cloudinary Upload</div>
                <div class="mt-2 text-sm font-bold text-gray-900 dark:text-white">{{ uploading ? 'Sedang upload...' : 'Siap digunakan' }}</div>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="modal.open" class="fixed inset-0 z-[80]">
          <div class="absolute inset-0 bg-black/55 backdrop-blur-sm" @click="closeItemModal" />
          <div class="absolute inset-0 overflow-y-auto p-4 md:p-8">
            <div class="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
              <div class="sticky top-0 z-10 border-b border-gray-200 bg-white/95 p-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3 class="text-base font-bold text-gray-900 dark:text-white">Edit Mega Menu Item</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Atur detail item tanpa membuat editor utama terasa penuh.</p>
                  </div>
                  <button
                    type="button"
                    class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="closeItemModal"
                  >
                    <ClientOnly><Icon icon="lucide:x" class="h-4 w-4" /></ClientOnly>
                  </button>
                </div>
              </div>

              <div class="grid gap-0 lg:grid-cols-[1fr,0.8fr]">
                <div class="p-5">
                  <div class="grid gap-4">
                    <div>
                      <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Label</label>
                      <input v-model.trim="itemDraft.label" :class="inputBase" />
                    </div>
                    <div>
                      <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Deskripsi</label>
                      <textarea v-model.trim="itemDraft.desc" rows="4" :class="inputBase"></textarea>
                    </div>
                    <div>
                      <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Link</label>
                      <input v-model.trim="itemDraft.href" :class="inputBase" placeholder="#" />
                    </div>

                    <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                      <div class="flex items-center justify-between gap-3">
                        <div>
                          <div class="text-sm font-semibold text-gray-900 dark:text-white">Icon Item</div>
                          <div class="mt-1 text-xs text-gray-500 dark:text-neutral-400">Pilih icon yang paling relevan untuk item ini.</div>
                        </div>
                        <button
                          type="button"
                          class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                          @click="openIconPicker((icon) => (itemDraft.icon = icon))"
                        >
                          Pilih Icon
                        </button>
                      </div>
                      <div class="mt-4 flex items-center gap-3">
                        <div class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gray-700 ring-1 ring-black/5 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-white/10">
                          <ClientOnly><Icon :icon="itemDraft.icon || 'ph:square'" class="h-5 w-5" /></ClientOnly>
                        </div>
                        <div class="text-sm text-gray-500 dark:text-neutral-400">{{ itemDraft.icon || 'Belum dipilih' }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="border-t border-gray-200 p-5 dark:border-neutral-800 lg:border-l lg:border-t-0">
                  <div class="space-y-4">
                    <div>
                      <div class="mb-2 flex items-center justify-between gap-3">
                        <h4 class="text-sm font-bold text-gray-900 dark:text-white">Cover Item</h4>
                        <button
                          type="button"
                          class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                          :disabled="uploading"
                          @click="itemCoverInput?.click()"
                        >
                          Upload Cover
                        </button>
                        <input ref="itemCoverInput" type="file" accept="image/*" class="hidden" @change="onUploadItemCover" />
                      </div>

                      <div class="aspect-[16/10] overflow-hidden rounded-[24px] border border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-800/60">
                        <img v-if="itemDraft.cover" :src="itemDraft.cover" alt="Item cover" class="h-full w-full object-cover" />
                        <div v-else class="grid h-full place-items-center text-sm text-gray-500 dark:text-neutral-400">Belum ada cover</div>
                      </div>
                      <div v-if="uploading && uploadTarget === 'itemCover'" class="mt-3 rounded-2xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-300">
                        Mengunggah cover item ke Cloudinary...
                      </div>
                    </div>

                    <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                      <div class="text-sm font-bold text-gray-900 dark:text-white">Preview Item</div>
                      <div class="mt-4 flex items-start gap-3">
                        <div class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                          <ClientOnly><Icon :icon="itemDraft.icon || 'ph:square'" class="h-5 w-5" /></ClientOnly>
                        </div>
                        <div class="min-w-0">
                          <div class="truncate text-sm font-bold text-gray-900 dark:text-white">{{ itemDraft.label || 'Item' }}</div>
                          <div class="mt-1 text-sm text-gray-600 dark:text-neutral-300">{{ itemDraft.desc || 'Deskripsi item akan tampil di sini.' }}</div>
                          <div class="mt-2 truncate text-xs text-gray-500 dark:text-neutral-400">{{ itemDraft.href || '#' }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="sticky bottom-0 z-10 border-t border-gray-200 bg-white/95 p-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95">
                <div class="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="closeItemModal"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                    @click="applyItemModal"
                  >
                    Simpan Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="iconPicker.open" class="fixed inset-0 z-[90]">
          <div class="absolute inset-0 bg-black/55 backdrop-blur-sm" @click="closeIconPicker" />
          <div class="absolute inset-0 overflow-y-auto p-4 md:p-8">
            <div class="mx-auto flex max-w-4xl flex-col overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
              <div class="sticky top-0 z-10 border-b border-gray-200 bg-white/95 p-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95">
                <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 class="text-base font-bold text-gray-900 dark:text-white">Pilih Icon</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Cari icon populer dari Iconify API dan pilih yang paling cocok.</p>
                  </div>
                  <button
                    type="button"
                    class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="closeIconPicker"
                  >
                    <ClientOnly><Icon icon="lucide:x" class="h-4 w-4" /></ClientOnly>
                  </button>
                </div>

                <div class="mt-4 flex gap-2">
                  <input
                    v-model.trim="iconPicker.query"
                    @keydown.enter.prevent="searchIcons"
                    class="block flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    placeholder="Cari mis. ph:book, lucide:home, heroicons:academic-cap"
                  />
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="iconPicker.loading"
                    @click="searchIcons"
                  >
                    {{ iconPicker.loading ? 'Mencari...' : 'Cari' }}
                  </button>
                </div>
                <p class="mt-2 text-xs text-gray-500 dark:text-neutral-400">Contoh koleksi: ph, lucide, mdi, heroicons, tabler, solar, hugeicons, material-symbols.</p>
              </div>

              <div class="min-h-0 flex-1 overflow-y-auto p-4">
                <div v-if="iconPicker.loading" class="text-sm text-gray-500 dark:text-neutral-400">Memuat ikon...</div>
                <div v-else class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                  <button
                    v-for="icon in iconPicker.results"
                    :key="icon"
                    type="button"
                    class="group rounded-[22px] border border-gray-200 bg-gray-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-800/60 dark:hover:bg-neutral-800"
                    @click="selectIcon(icon)"
                  >
                    <ClientOnly>
                      <div class="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gray-700 ring-1 ring-black/5 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-white/10">
                        <Icon :icon="icon" class="h-5 w-5" />
                      </div>
                    </ClientOnly>
                    <div class="mt-3 truncate text-[11px] font-medium text-gray-600 dark:text-neutral-300">{{ icon }}</div>
                  </button>
                </div>
                <p v-if="!iconPicker.loading && !iconPicker.results.length" class="mt-6 text-center text-sm text-gray-500 dark:text-neutral-400">Belum ada hasil pencarian.</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { ref as dbRef, onValue, off, set } from 'firebase/database'
import { useCloudinaryUpload } from '~/composables/useCloudinaryUpload'

useHead({ title: 'Navbar Editor | Ponpes ALINAYAH', link: [{ rel: 'icon', href: '/assets/logo.png' }] })
definePageMeta({ layout: 'app', layoutProps: { title: 'Navbar' } })

export type NavLink = { label: string; href: string; icon: string }
export type MegaItem = { label: string; icon: string; desc?: string; href?: string; cover?: string }
export type MegaGroup = { title: string; items: MegaItem[] }

const NAVBAR_PATH = 'alinayah/site/navbar'
const { $realtimeDb } = useNuxtApp() as any
const { uploadImage, uploading, uploadError } = useCloudinaryUpload()

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

const defaultLinks = (): NavLink[] => [
  { label: 'Beranda', href: '/#home', icon: 'ph:house' },
  { label: 'Tentang', href: '/#information', icon: 'ph:info' },
  { label: 'Fasilitas', href: '/#facility', icon: 'ph:buildings' },
  { label: 'Berita', href: '/#news', icon: 'ph:newspaper' },
  { label: 'Kontak', href: '/#contact', icon: 'ph:phone' },
]

const defaultItem = (): MegaItem => ({
  label: 'Item',
  icon: 'ph:square',
  desc: '',
  href: '#',
  cover: '',
})

const defaultGroups = (): MegaGroup[] => ([
  {
    title: 'Pendidikan',
    items: [
      { label: 'SMA ALINAYAH', icon: 'ph:book-open-text', desc: 'Sekolah Menengah Atas ALINAYAH', href: '#', cover: '' },
      { label: 'SMP ALINAYAH', icon: 'ph:student', desc: 'Sekolah Menengah Pertama ALINAYAH', href: '#', cover: '' },
    ],
  },
  {
    title: 'Kegiatan Santri',
    items: [
      { label: 'Kajian Kitab', icon: 'ph:scroll', desc: 'Pendalaman kitab kuning', href: '#', cover: '' },
      { label: 'Muhadhoroh', icon: 'ph:megaphone-simple', desc: 'Latihan pidato & public speaking', href: '#', cover: '' },
      { label: 'Khidmah Sosial', icon: 'ph:handshake', desc: 'Pengabdian & kemasyarakatan', href: '#', cover: '' },
      { label: 'Rihlah / Daurah', icon: 'ph:globe-hemisphere-west', desc: 'Kegiatan luar asrama edukatif', href: '#', cover: '' },
    ],
  },
  {
    title: 'Program Khusus',
    items: [
      { label: 'Tahfidzul Quran', icon: 'mdi:religion-muslim', desc: 'Program penghafalan Al-Quran', href: '#', cover: '' },
      { label: 'Metode Amtsilati', icon: 'hugeicons:muslim', desc: 'Pendalaman nahwu-shorof', href: '#', cover: '' },
      { label: 'Bahasa Arab', icon: 'hugeicons:alphabet-arabic', desc: 'Kelas intensif bahasa Arab', href: '#', cover: '' },
      { label: 'BLK Komunitas TIK', icon: 'fluent:people-community-16-regular', desc: 'Pelatihan digital', href: '#', cover: '' },
    ],
  },
])

const makeDefaultForm = () => ({
  brand: 'Pondok Pesantren ALINAYAH',
  brandShorten: 'ALINAYAH',
  coverPonpes: '',
  navLinks: defaultLinks(),
  megaMenu: defaultGroups(),
  ppdbCta: {
    title: 'PPDB Online 2025/2026',
    desc: 'Penerimaan Peserta Didik Baru. Daftar mudah & cepat secara online.',
    href: '/registrationPPDB',
    image: '/assets/images/activity.jpg',
  },
  ctaButtons: [
    { label: 'Login Wali', href: '/waliLogin', style: 'primary' as const },
  ],
})

const form = reactive(makeDefaultForm())
const original = ref('')
const saving = ref(false)
const ok = ref(false)
const note = ref('')
const externalChanged = ref(false)
const uploadTarget = ref<'coverPonpes' | 'ppdbCta' | 'itemCover' | ''>('')
let mutedRemoteSync = false
let unsubscribeNavbar: null | (() => void) = null

const isDirty = computed(() => JSON.stringify(form) !== original.value)
const totalMegaItems = computed(() => form.megaMenu.reduce((sum, group) => sum + group.items.length, 0))
const previewLinks = computed(() => form.navLinks.slice(0, 4))
const previewGroups = computed(() => form.megaMenu.slice(0, 2))

function applyForm(next: ReturnType<typeof makeDefaultForm>) {
  form.brand = next.brand
  form.brandShorten = next.brandShorten
  form.coverPonpes = next.coverPonpes
  form.navLinks = clone(next.navLinks)
  form.megaMenu = clone(next.megaMenu)
  form.ppdbCta = clone(next.ppdbCta)
  form.ctaButtons = clone(next.ctaButtons)
}

function sanitizeForm(source = form) {
  return {
    brand: String(source.brand || '').trim(),
    brandShorten: String(source.brandShorten || '').trim(),
    coverPonpes: String(source.coverPonpes || '').trim(),
    navLinks: source.navLinks
      .map((link) => ({
        label: String(link.label || '').trim(),
        href: String(link.href || '').trim(),
        icon: String(link.icon || '').trim(),
      }))
      .filter((link) => link.label || link.href || link.icon),
    megaMenu: source.megaMenu
      .map((group) => ({
        title: String(group.title || '').trim(),
        items: group.items
          .map((item) => ({
            label: String(item.label || '').trim(),
            icon: String(item.icon || '').trim(),
            desc: String(item.desc || '').trim(),
            href: String(item.href || '').trim(),
            cover: String(item.cover || '').trim(),
          }))
          .filter((item) => item.label || item.desc || item.href || item.icon || item.cover),
      }))
      .filter((group) => group.title || group.items.length),
    ppdbCta: {
      title: String(source.ppdbCta.title || '').trim(),
      desc: String(source.ppdbCta.desc || '').trim(),
      href: String(source.ppdbCta.href || '').trim(),
      image: String(source.ppdbCta.image || '').trim(),
    },
    ctaButtons: source.ctaButtons
      .map((button) => ({
        label: String(button.label || '').trim(),
        href: String(button.href || '').trim(),
        style: button.style === 'primary' ? 'primary' : 'outline',
      }))
      .filter((button) => button.label || button.href),
  }
}

async function syncFromDatabase() {
  if (!$realtimeDb) return

  if (unsubscribeNavbar) unsubscribeNavbar()
  const ref = dbRef($realtimeDb, NAVBAR_PATH)

  unsubscribeNavbar = onValue(ref, (snapshot) => {
    const raw = snapshot.val()
    const merged = raw ? { ...makeDefaultForm(), ...raw, ppdbCta: { ...makeDefaultForm().ppdbCta, ...(raw.ppdbCta || {}) } } : makeDefaultForm()
    const normalized = sanitizeForm(merged as ReturnType<typeof makeDefaultForm>)

    if (mutedRemoteSync) {
      original.value = JSON.stringify(normalized)
      mutedRemoteSync = false
      return
    }

    if (isDirty.value) {
      externalChanged.value = true
      return
    }

    applyForm(normalized as ReturnType<typeof makeDefaultForm>)
    original.value = JSON.stringify(normalized)
    externalChanged.value = false
  })
}

async function reloadFromDatabase() {
  note.value = ''
  ok.value = false
  externalChanged.value = false
  mutedRemoteSync = false
  await syncFromDatabase()
}

async function saveAll() {
  if (!$realtimeDb) return

  saving.value = true
  note.value = ''
  ok.value = false
  try {
    const payload = sanitizeForm()
    mutedRemoteSync = true
    await set(dbRef($realtimeDb, NAVBAR_PATH), clone(payload))
    applyForm(payload as ReturnType<typeof makeDefaultForm>)
    original.value = JSON.stringify(payload)
    externalChanged.value = false
    ok.value = true
    note.value = 'Perubahan navbar berhasil disimpan.'
    window.setTimeout(() => (note.value = ''), 1800)
  } catch (error: any) {
    mutedRemoteSync = false
    ok.value = false
    note.value = error?.message || 'Gagal menyimpan perubahan.'
  } finally {
    saving.value = false
  }
}

function resetToDefault() {
  applyForm(makeDefaultForm())
}

function addLink() {
  form.navLinks.push({ label: 'Baru', href: '#', icon: 'ph:square' })
}
function removeLink(index: number) {
  form.navLinks.splice(index, 1)
}
function addGroup() {
  form.megaMenu.push({ title: 'Grup Baru', items: [defaultItem()] })
}
function removeGroup(index: number) {
  form.megaMenu.splice(index, 1)
}
function addItem(groupIndex: number) {
  form.megaMenu[groupIndex]?.items.push(defaultItem())
}
function removeItem(groupIndex: number, itemIndex: number) {
  form.megaMenu[groupIndex]?.items.splice(itemIndex, 1)
}
function addCTA() {
  form.ctaButtons.push({ label: 'Baru', href: '#', style: 'outline' })
}
function removeCTA(index: number) {
  form.ctaButtons.splice(index, 1)
}

const coverInput = ref<HTMLInputElement | null>(null)
const ppdbInput = ref<HTMLInputElement | null>(null)
const itemCoverInput = ref<HTMLInputElement | null>(null)

async function uploadToCloudinary(file: File, folder: string) {
  const result = await uploadImage(file, { folder })
  return result.secure_url
}

async function onUploadCoverPonpes(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files?.length) return
  uploadTarget.value = 'coverPonpes'
  try {
    form.coverPonpes = await uploadToCloudinary(files[0], 'alinayah/navbar/cover-ponpes')
  } finally {
    uploadTarget.value = ''
    if (coverInput.value) coverInput.value.value = ''
  }
}

async function onUploadPPDB(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files?.length) return
  uploadTarget.value = 'ppdbCta'
  try {
    form.ppdbCta.image = await uploadToCloudinary(files[0], 'alinayah/navbar/ppdb')
  } finally {
    uploadTarget.value = ''
    if (ppdbInput.value) ppdbInput.value.value = ''
  }
}

async function onUploadItemCover(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files?.length || !modal.open) return
  uploadTarget.value = 'itemCover'
  try {
    itemDraft.cover = await uploadToCloudinary(files[0], 'alinayah/navbar/mega-items')
  } finally {
    uploadTarget.value = ''
    if (itemCoverInput.value) itemCoverInput.value.value = ''
  }
}

const modal = reactive({ open: false, gidx: -1, idx: -1 })
const itemDraft = reactive<MegaItem>(defaultItem())

function openItemModal(groupIndex: number, itemIndex: number) {
  modal.open = true
  modal.gidx = groupIndex
  modal.idx = itemIndex
  Object.assign(itemDraft, clone(form.megaMenu[groupIndex]?.items[itemIndex] || defaultItem()))
}
function closeItemModal() {
  modal.open = false
  modal.gidx = -1
  modal.idx = -1
  Object.assign(itemDraft, defaultItem())
}
function applyItemModal() {
  if (modal.gidx < 0 || modal.idx < 0) return
  form.megaMenu[modal.gidx].items[modal.idx] = clone(itemDraft)
  closeItemModal()
}

const iconPicker = reactive({
  open: false,
  query: '',
  results: [] as string[],
  loading: false,
  cb: null as null | ((icon: string) => void),
})

function openIconPicker(cb: (icon: string) => void) {
  iconPicker.open = true
  iconPicker.cb = cb
  iconPicker.query = ''
  iconPicker.results = []
}
function closeIconPicker() {
  iconPicker.open = false
  iconPicker.cb = null
}
function selectIcon(icon: string) {
  iconPicker.cb?.(icon)
  closeIconPicker()
}

async function searchIcons() {
  if (!iconPicker.query.trim()) return
  iconPicker.loading = true
  try {
    const url = `https://api.iconify.design/search?query=${encodeURIComponent(iconPicker.query.trim())}&limit=96`
    const res = await fetch(url)
    const data = await res.json()
    iconPicker.results = Array.isArray(data?.icons) ? data.icons : []
  } catch {
    iconPicker.results = []
  } finally {
    iconPicker.loading = false
  }
}

const inputBase = 'block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-white'

onMounted(async () => {
  await syncFromDatabase()
})

onBeforeUnmount(() => {
  if (unsubscribeNavbar) unsubscribeNavbar()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>