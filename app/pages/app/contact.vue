<template>
  <div class="min-h-full bg-transparent text-gray-800 dark:text-neutral-200">
    <div class="mx-auto max-w-[1680px] space-y-6 p-4 md:p-6">
      <section class="relative overflow-hidden rounded-[32px] border border-green-100 bg-gradient-to-br from-green-600 via-emerald-600 to-lime-500 p-5 text-white shadow-[0_24px_60px_-18px_rgba(22,163,74,0.36)] md:p-6">
        <div class="absolute inset-0 opacity-20">
          <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white blur-3xl"></div>
          <div class="absolute bottom-0 left-8 h-32 w-32 rounded-full bg-lime-100 blur-3xl"></div>
        </div>

        <div class="relative z-10 grid gap-5 xl:grid-cols-[1.2fr,0.8fr] xl:items-end">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
              <span class="inline-block h-2 w-2 rounded-full bg-lime-300"></span>
              Contact Center Management
            </div>
            <h1 class="mt-4 text-2xl font-black tracking-tight md:text-4xl">Kontak & Media Sosial</h1>
            <p class="mt-3 max-w-2xl text-sm leading-6 text-green-50/95 md:text-base">
              Kelola informasi kontak, jam layanan, tautan sosial, dan identitas footer dalam satu workspace yang lebih rapi, cepat, dan enak dipakai.
            </p>

          </div>

          <div class="grid gap-3 md:grid-cols-3 grid-cols-1">
            <div class="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
              <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-green-100">Informasi</div>
              <div class="mt-2 text-2xl font-black">{{ completeness.contact }}/6</div>
              <div class="mt-1 text-xs text-green-50/90">field kontak utama terisi</div>
            </div>
            <div class="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
              <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-green-100">Sosial Aktif</div>
              <div class="mt-2 text-2xl font-black">{{ activeSocials.length }}</div>
              <div class="mt-1 text-xs text-green-50/90">tautan sosial valid</div>
            </div>
            <div class="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
              <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-green-100">Jam Layanan</div>
              <div class="mt-2 text-2xl font-black">{{ cleanHours.length }}</div>
              <div class="mt-1 text-xs text-green-50/90">baris jadwal aktif</div>
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
                <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Simpan perubahan kapan saja tanpa harus scroll kembali ke atas.</p>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  :disabled="saving"
                  @click="resetToDefault"
                >
                  Isi Default
                </button>
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  :disabled="saving || !dirty"
                  @click="reloadFromDatabase"
                >
                  Muat Ulang
                </button>
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="saving || !dirty"
                  @click="save"
                >
                  {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
                </button>
              </div>
            </div>

            <div class="mt-3 text-white flex flex-wrap items-center gap-2 text-xs">
              <span
                class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold"
                :class="dirty ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300' : 'bg-emerald-50 dark:bg-emerald-900/20 dark:text-white'"
              >
                <Icon :icon="dirty ? 'lucide:triangle-alert' : 'lucide:badge-check'" class="h-3.5 w-3.5" />
                {{ dirty ? 'Ada perubahan belum disimpan' : 'Semua perubahan sudah tersimpan' }}
              </span>
              <span v-if="note" :class="ok ? 'text-white dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'" class="font-medium">
                {{ note }}
              </span>
            </div>
          </div>

          <div class="space-y-6">
            <section class="rounded-[30px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">Informasi Kontak</h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Informasi utama yang muncul di halaman kontak dan footer.</p>
                </div>
                <div class="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <Icon icon="lucide:phone-call" class="h-3.5 w-3.5" />
                  Core Contact
                </div>
              </div>

              <div class="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Email</label>
                  <input v-model.trim="form.contact.email" type="email" :class="inputBase" placeholder="info@domain.com" />
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Telepon</label>
                  <input v-model.trim="form.contact.phone" type="text" :class="inputBase" placeholder="08xxxxxxxxxx" />
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">WhatsApp (intl)</label>
                  <input v-model.trim="form.contact.waIntl" type="text" :class="inputBase" placeholder="62xxxxxxxxxx" />
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Map Query</label>
                  <input v-model.trim="form.contact.mapQuery" type="text" :class="inputBase" placeholder="Nama tempat / alamat pencarian" />
                </div>
                <div class="sm:col-span-2">
                  <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Alamat</label>
                  <textarea v-model.trim="form.contact.address" rows="3" :class="inputBase" placeholder="Alamat lengkap lembaga"></textarea>
                </div>
                <div class="sm:col-span-2">
                  <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Google Maps Embed SRC</label>
                  <input
                    v-model.trim="form.contact.mapEmbedSrc"
                    type="text"
                    :class="inputBase"
                    placeholder="https://www.google.com/maps/embed?pb=..."
                  />
                  <p class="mt-1 text-[11px] text-gray-500 dark:text-neutral-400">Tempel nilai atribut <code>src</code> dari embed Google Maps. Ini dipakai untuk preview peta.</p>
                </div>
              </div>
            </section>

            <section class="rounded-[30px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">Jam Layanan</h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Tampilkan jam pelayanan dalam format yang konsisten dan mudah dipahami.</p>
                </div>
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="addHour"
                >
                  Tambah Baris
                </button>
              </div>

              <div class="mt-5 space-y-3">
                <div
                  v-for="(h, i) in form.contact.hours"
                  :key="i"
                  class="flex flex-col gap-2 rounded-[22px] border border-gray-200 bg-gray-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/60 sm:flex-row sm:items-center"
                >
                  <div class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    <Icon icon="lucide:clock-3" class="h-4 w-4" />
                  </div>
                  <input
                    v-model.trim="form.contact.hours[i]"
                    :class="inputBase + ' flex-1 bg-white dark:bg-neutral-900'"
                    placeholder="Contoh: Senin–Jumat 08.00–15.30 WIB"
                  />
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="removeHour(i)"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </section>

            <section class="rounded-[30px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">Media Sosial</h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Atur tautan sosial aktif lengkap dengan icon yang konsisten.</p>
                </div>
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                  @click="addSocial"
                >
                  Tambah Sosial
                </button>
              </div>

              <div class="mt-5 grid gap-4 md:grid-cols-2">
                <article
                  v-for="(s, i) in form.socials"
                  :key="i"
                  class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-gray-700 ring-1 ring-black/5 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-white/10">
                      <ClientOnly>
                        <Icon v-if="s.icon" :icon="s.icon" class="h-5 w-5" />
                        <Icon v-else icon="lucide:globe" class="h-5 w-5" />
                      </ClientOnly>
                    </div>
                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      @click="removeSocial(i)"
                    >
                      Hapus
                    </button>
                  </div>

                  <div class="mt-4 space-y-3">
                    <div>
                      <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Label</label>
                      <input v-model.trim="form.socials[i].label" :class="inputBase" placeholder="Instagram / YouTube / Facebook" />
                    </div>
                    <div>
                      <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">URL</label>
                      <input v-model.trim="form.socials[i].href" :class="inputBase" placeholder="https://..." />
                    </div>
                    <div>
                      <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Icon</label>
                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                          @click="openIconPicker(i)"
                        >
                          Pilih Icon
                        </button>
                        <span class="truncate text-xs text-gray-500 dark:text-neutral-400">{{ form.socials[i].icon || 'Belum dipilih' }}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </section>

            <section class="rounded-[30px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Brand Footer</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Identitas singkat yang tampil di bagian footer website.</p>
              </div>

              <div class="mt-5 grid gap-4">
                <div>
                  <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Nama Brand</label>
                  <input v-model.trim="form.footer.brand.name" :class="inputBase" placeholder="Contoh: Alinayah" />
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Deskripsi Footer</label>
                  <textarea v-model.trim="form.footer.brand.desc" rows="3" :class="inputBase" placeholder="Deskripsi singkat footer brand"></textarea>
                </div>
              </div>
            </section>
          </div>
        </div>

        <aside class="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <section class="rounded-[30px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Live Preview</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Pratinjau tampilan kontak agar lebih mudah memvalidasi hasil sebelum disimpan.</p>
              </div>
              <div class="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <Icon icon="lucide:eye" class="h-3.5 w-3.5" />
                Preview
              </div>
            </div>

            <div class="mt-5 overflow-hidden rounded-[28px] border border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-800/60">
              <div class="bg-gradient-to-r from-green-600 via-emerald-600 to-lime-500 p-5 text-white">
                <h4 class="text-lg font-black tracking-tight">{{ form.footer.brand.name || 'Nama Brand' }}</h4>
                <p class="mt-2 max-w-sm text-sm text-green-50/95">{{ form.footer.brand.desc || 'Deskripsi footer akan tampil di sini.' }}</p>
              </div>

              <div class="space-y-4 p-5">
                <div class="space-y-3">
                  <div class="flex items-start gap-3 rounded-[22px] border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                    <div class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                      <Icon icon="lucide:map-pin" class="h-5 w-5" />
                    </div>
                    <div class="min-w-0">
                      <div class="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Alamat</div>
                      <div class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ form.contact.address || 'Belum diisi' }}</div>
                    </div>
                  </div>

                  <div class="grid gap-3 sm:grid-cols-2">
                    <div class="rounded-[22px] border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                      <div class="flex items-start gap-3">
                        <div class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300">
                          <Icon icon="lucide:mail" class="h-5 w-5" />
                        </div>
                        <div class="min-w-0">
                          <div class="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Email</div>
                          <div class="mt-1 truncate text-sm font-medium text-gray-900 dark:text-white">{{ form.contact.email || 'Belum diisi' }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="rounded-[22px] border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                      <div class="flex items-start gap-3">
                        <div class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                          <Icon icon="lucide:phone" class="h-5 w-5" />
                        </div>
                        <div class="min-w-0">
                          <div class="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Telepon</div>
                          <div class="mt-1 truncate text-sm font-medium text-gray-900 dark:text-white">{{ form.contact.phone || 'Belum diisi' }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div class="mb-2 flex items-center justify-between gap-3">
                    <h5 class="text-sm font-bold text-gray-900 dark:text-white">Jam Layanan</h5>
                    <span class="text-[11px] text-gray-500 dark:text-neutral-400">{{ cleanHours.length }} baris</span>
                  </div>
                  <div class="space-y-2">
                    <div
                      v-for="(hour, i) in cleanHours"
                      :key="hour + i"
                      class="flex items-center gap-3 rounded-[20px] border border-gray-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900"
                    >
                      <div class="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                        <Icon icon="lucide:clock-3" class="h-4 w-4" />
                      </div>
                      <span class="text-sm text-gray-700 dark:text-neutral-200">{{ hour }}</span>
                    </div>
                    <p v-if="!cleanHours.length" class="text-sm text-gray-500 dark:text-neutral-400">Belum ada jam layanan aktif.</p>
                  </div>
                </div>

                <div>
                  <div class="mb-2 flex items-center justify-between gap-3">
                    <h5 class="text-sm font-bold text-gray-900 dark:text-white">Sosial Aktif</h5>
                    <span class="text-[11px] text-gray-500 dark:text-neutral-400">{{ activeSocials.length }} link</span>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <a
                      v-for="social in activeSocials"
                      :key="social.label + social.href"
                      :href="social.href"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      <ClientOnly>
                        <Icon :icon="social.icon || 'lucide:globe'" class="h-4 w-4 text-green-600 dark:text-green-300" />
                      </ClientOnly>
                      {{ social.label }}
                    </a>
                    <p v-if="!activeSocials.length" class="text-sm text-gray-500 dark:text-neutral-400">Belum ada sosial aktif.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="rounded-[30px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Peta Lokasi</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Preview embed Google Maps jika src sudah valid.</p>
            </div>

            <div class="mt-5 overflow-hidden rounded-[24px] border border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-800/60">
              <iframe
                v-if="safeEmbedSrc"
                :src="safeEmbedSrc"
                class="h-72 w-full border-0"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                allowfullscreen
              ></iframe>
              <div v-else class="grid h-72 place-items-center p-6 text-center">
                <div>
                  <div class="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    <Icon icon="lucide:map" class="h-6 w-6" />
                  </div>
                  <div class="mt-3 text-sm font-bold text-gray-900 dark:text-white">Embed Google Maps belum valid</div>
                  <div class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Tempel <code>src</code> Google Maps Embed untuk mengaktifkan preview peta.</div>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </div>

    <div
      v-if="iconModal.show"
      class="fixed inset-0 z-[1002] flex items-start justify-center bg-black/45 px-4 py-10 backdrop-blur-sm"
      @click.self="closeIconPicker"
    >
      <div class="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
        <div class="sticky top-0 z-10 border-b border-gray-200 bg-white/95 p-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">Pilih Icon</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Cari icon populer atau telusuri online via Iconify API.</p>
            </div>
            <button
              type="button"
              class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              @click="closeIconPicker"
            >
              <Icon icon="lucide:x" class="h-4 w-4" />
            </button>
          </div>

          <div class="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div class="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
              <button
                v-for="t in iconModal.tabs"
                :key="t"
                type="button"
                @click="setTab(t)"
                :class="[
                  'rounded-2xl px-4 py-2 text-sm font-semibold transition',
                  iconModal.activeTab === t
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                    : 'text-gray-500 hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white'
                ]"
              >
                {{ t }}
              </button>
            </div>

            <div class="flex flex-1 gap-2">
              <input
                v-model.trim="iconModal.query"
                type="text"
                placeholder="Cari icon: instagram, youtube, phone..."
                class="block flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                @input="onSearchInput"
                @keydown.enter.prevent="searchOnline(true)"
              />
              <button
                v-if="iconModal.allowOnline"
                type="button"
                class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                :disabled="iconModal.loading"
                @click="searchOnline()"
              >
                {{ iconModal.loading ? 'Searching…' : 'Search Online' }}
              </button>
            </div>
          </div>
        </div>

        <div class="min-h-0 flex-1 overflow-auto p-4">
          <div class="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            <button
              v-for="name in iconModal.visible"
              :key="name"
              type="button"
              @click="chooseIcon(name)"
              class="group rounded-[22px] border border-gray-200 bg-gray-50 p-4 text-center transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-800/60 dark:hover:bg-neutral-800"
            >
              <ClientOnly>
                <div class="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gray-700 ring-1 ring-black/5 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-white/10">
                  <Icon :icon="name" class="h-5 w-5" />
                </div>
              </ClientOnly>
              <div class="mt-3 truncate text-[11px] font-medium text-gray-600 dark:text-neutral-300" :title="name">{{ name }}</div>
            </button>
          </div>

          <p v-if="!iconModal.visible.length" class="mt-6 text-center text-sm text-gray-500 dark:text-neutral-400">Tidak ada icon ditemukan.</p>
        </div>

        <div class="sticky bottom-0 z-10 border-t border-gray-200 bg-white/95 p-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div v-if="iconModal.allowOnline && iconModal.total > iconModal.limit" class="text-xs text-gray-500 dark:text-neutral-400">
              Showing {{ Math.min(iconModal.total, iconModal.start + 1) }}–{{ Math.min(iconModal.total, iconModal.start + iconModal.limit) }} of {{ iconModal.total }}
            </div>
            <div class="ml-auto flex items-center gap-2">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                :disabled="iconModal.start === 0 || iconModal.loading"
                @click="prevPage"
              >
                Prev
              </button>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useNuxtApp } from '#app'
import { ref as dbRef, get, update } from 'firebase/database'
import { Icon } from '@iconify/vue'

type Social = { label: string; href: string; icon: string }
type Shape = {
  contact: {
    address: string
    email: string
    phone: string
    waIntl: string
    mapEmbedSrc: string
    mapQuery: string
    hours: string[]
  }
  socials: Social[]
  footer: { brand: { name: string; desc: string } }
}

definePageMeta({ layout: 'app', layoutProps: { title: 'Kontak' } })

const year = new Date().getFullYear()
const CONTACT_PATH = 'alinayah/contact'

const defaults: Shape = {
  contact: {
    address: 'Jl. Pesantren No. 1, Pandaan, Pasuruan, Jawa Timur 67156',
    email: 'info@alinayah.sch.id',
    phone: '085856376399',
    waIntl: '6285856376399',
    mapQuery: 'Pondok Pesantren Alinayah, Pandaan, Pasuruan',
    mapEmbedSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.154822990777!2d112.68858257934568!3d-7.666498699999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7d9e72d847345%3A0xb58b63681aec9b37!2sPondok%20Pesantren%20ALBERR%20(Putra)%20-%20Karangjati%20Pandaan!5e0!3m2!1sid!2sid!4v1755450928977!5m2!1sid!2sid',
    hours: ['Senin–Jumat 08.00–15.30 WIB', 'Sabtu 08.00–12.00 WIB']
  },
  socials: [
    { label: 'Instagram', href: '#', icon: 'mdi:instagram' },
    { label: 'YouTube', href: '#', icon: 'mdi:youtube' },
    { label: 'Facebook', href: '#', icon: 'mdi:facebook' },
  ],
  footer: { brand: { name: 'ALINAYAH', desc: `© ${year} Ponpes Alinayah.` } }
}

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v))
}

const form = reactive<Shape>(clone(defaults))
const lastSaved = ref<string>(JSON.stringify(defaults))
const inputBase = 'block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-white'
const saving = ref(false)
const note = ref('')
const ok = ref(false)

const completeness = computed(() => {
  const c = form.contact
  const filled = [c.email, c.phone, c.waIntl, c.mapQuery, c.address, c.mapEmbedSrc].filter((x) => String(x || '').trim()).length
  return { contact: filled }
})

const cleanHours = computed(() => form.contact.hours.map((x) => x.trim()).filter(Boolean))
const activeSocials = computed(() =>
  form.socials
    .map((s) => ({ ...s, label: s.label.trim(), href: s.href.trim(), icon: s.icon.trim() }))
    .filter((s) => s.label && s.href && isValidUrl(s.href))
)

const safeEmbedSrc = computed(() => {
  const src = String(form.contact.mapEmbedSrc || '').trim()
  if (!src) return ''
  return /^https:\/\/www\.google\.com\/maps\/embed/i.test(src) ? src : ''
})

const dirty = computed(() => JSON.stringify(form) !== lastSaved.value)

function isValidUrl(value: string) {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

function normalizePayload(payload: Shape): Shape {
  return {
    contact: {
      address: payload.contact.address.trim(),
      email: payload.contact.email.trim(),
      phone: payload.contact.phone.trim(),
      waIntl: payload.contact.waIntl.trim().replace(/\D/g, ''),
      mapQuery: payload.contact.mapQuery.trim(),
      mapEmbedSrc: payload.contact.mapEmbedSrc.trim(),
      hours: payload.contact.hours.map((x) => x.trim()).filter(Boolean),
    },
    socials: payload.socials
      .map((s) => ({
        label: s.label.trim(),
        href: s.href.trim(),
        icon: s.icon.trim(),
      }))
      .filter((s) => s.label || s.href || s.icon),
    footer: {
      brand: {
        name: payload.footer.brand.name.trim(),
        desc: payload.footer.brand.desc.trim(),
      }
    }
  }
}

function replaceForm(payload: Shape) {
  const next = clone(payload)
  form.contact.address = next.contact.address
  form.contact.email = next.contact.email
  form.contact.phone = next.contact.phone
  form.contact.waIntl = next.contact.waIntl
  form.contact.mapQuery = next.contact.mapQuery
  form.contact.mapEmbedSrc = next.contact.mapEmbedSrc
  form.contact.hours = next.contact.hours
  form.socials = next.socials
  form.footer.brand.name = next.footer.brand.name
  form.footer.brand.desc = next.footer.brand.desc
}

function addHour() {
  form.contact.hours.push('')
}

function removeHour(index: number) {
  form.contact.hours.splice(index, 1)
}

function addSocial() {
  form.socials.push({ label: 'Instagram', href: '#', icon: 'mdi:instagram' })
}

function removeSocial(index: number) {
  form.socials.splice(index, 1)
}

function resetToDefault() {
  replaceForm(defaults)
}

async function load() {
  const { $realtimeDb } = useNuxtApp() as any
  const snap = await get(dbRef($realtimeDb, CONTACT_PATH))
  if (!snap.exists()) {
    const normalizedDefault = normalizePayload(defaults)
    replaceForm(normalizedDefault)
    lastSaved.value = JSON.stringify(normalizedDefault)
    return
  }

  const data = snap.val() as Partial<Shape>
  const merged: Shape = {
    ...clone(defaults),
    ...data,
    contact: { ...clone(defaults.contact), ...(data.contact || {}) },
    socials: Array.isArray(data.socials) ? data.socials : clone(defaults.socials),
    footer: { brand: { ...clone(defaults.footer.brand), ...(data.footer?.brand || {}) } },
  }

  const normalized = normalizePayload(merged)
  replaceForm(normalized)
  lastSaved.value = JSON.stringify(normalized)
}

async function reloadFromDatabase() {
  note.value = ''
  ok.value = false
  await load()
}

async function save() {
  const { $realtimeDb } = useNuxtApp() as any
  try {
    saving.value = true
    note.value = ''
    ok.value = false

    const payload = normalizePayload(clone(form))
    await update(dbRef($realtimeDb), { [CONTACT_PATH]: payload })
    lastSaved.value = JSON.stringify(payload)
    ok.value = true
    note.value = 'Perubahan berhasil disimpan.'
    window.setTimeout(() => (note.value = ''), 1800)
  } catch (error: any) {
    ok.value = false
    note.value = error?.message || 'Gagal menyimpan data.'
  } finally {
    saving.value = false
  }
}

/* Icon Picker */
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
    'mdi:instagram','mdi:youtube','mdi:facebook','mdi:twitter','mdi:tiktok',
    'mdi:whatsapp','mdi:telegram','mdi:linkedin','mdi:web','mdi:email',
    'mdi:phone','mdi:map-marker','ph:instagram-logo','ph:youtube-logo',
    'ph:facebook-logo','ph:whatsapp-logo','ph:telegram-logo','ph:globe',
    'ph:phone','ph:envelope-simple','ph:map-pin','mdi:school','mdi:google',
  ] as string[],
  targetIndex: -1,
})

function setTab(tab: TabName) {
  iconModal.activeTab = tab
  iconModal.start = 0
  if (tab === 'Popular') {
    iconModal.visible = iconModal.popular.slice()
    iconModal.total = iconModal.visible.length
  } else {
    iconModal.visible = []
    iconModal.total = 0
  }
}

let iconSearchTimer: ReturnType<typeof setTimeout> | null = null
function onSearchInput() {
  iconModal.start = 0
  if (iconModal.activeTab !== 'Online') iconModal.activeTab = 'Online'
  if (iconSearchTimer) clearTimeout(iconSearchTimer)
  iconSearchTimer = setTimeout(() => searchOnline(), 400)
}

async function searchOnline(force = false) {
  if (!process.client || !iconModal.allowOnline) return
  const q = iconModal.query.trim()
  if (!q && !force) return

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
  iconModal.start += iconModal.limit
  searchOnline(true)
}

function openIconPicker(index: number) {
  iconModal.targetIndex = index
  iconModal.query = ''
  iconModal.start = 0
  iconModal.total = iconModal.popular.length
  iconModal.activeTab = 'Popular'
  iconModal.visible = iconModal.popular.slice()
  iconModal.show = true
}

function closeIconPicker() {
  iconModal.show = false
  iconModal.targetIndex = -1
}

function chooseIcon(name: string) {
  if (iconModal.targetIndex >= 0) {
    form.socials[iconModal.targetIndex].icon = name
  }
  closeIconPicker()
}

watch(
  () => iconModal.show,
  (open) => {
    if (!open && iconSearchTimer) {
      clearTimeout(iconSearchTimer)
      iconSearchTimer = null
    }
  }
)

onMounted(async () => {
  await load()
})
</script>