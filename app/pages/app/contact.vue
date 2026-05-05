<template>
  <div class="min-h-full bg-transparent pb-28 text-gray-800 dark:text-neutral-200">
    <div class="mx-auto max-w-[1760px] space-y-6 p-4 md:p-6">
      <!-- Hero -->
      <section class="relative overflow-hidden rounded-[36px] border border-green-100 bg-gradient-to-br from-green-600 via-emerald-600 to-lime-500 p-5 text-white shadow-[0_24px_60px_-18px_rgba(22,163,74,0.36)] md:p-7">
        <div class="pointer-events-none absolute inset-0 opacity-20">
          <div class="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white blur-3xl"></div>
          <div class="absolute bottom-0 left-8 h-36 w-36 rounded-full bg-lime-100 blur-3xl"></div>
        </div>

        <div class="relative z-10 grid gap-6 xl:grid-cols-[1.15fr,0.85fr] xl:items-end">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold ring-1 ring-white/20 backdrop-blur">
              <span class="inline-block h-2 w-2 rounded-full bg-lime-300"></span>
              Contact Center Management
            </div>

            <h1 class="mt-4 text-2xl font-black tracking-tight md:text-4xl">
              Kontak & Media Sosial
            </h1>

            <p class="mt-3 max-w-2xl text-sm leading-6 text-green-50/95 md:text-base">
              Kelola informasi kontak, jam layanan, tautan sosial, Google Maps, dan identitas footer dalam editor yang lebih rapi, responsif, dan nyaman dipakai.
            </p>
          </div>

          <div class="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4">
            <div class="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
              <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-green-100">Informasi</div>
              <div class="mt-2 text-2xl font-black">{{ completeness.contact }}/6</div>
              <div class="mt-1 truncate text-xs text-green-50/90">field utama terisi</div>
            </div>

            <div class="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
              <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-green-100">Sosial</div>
              <div class="mt-2 text-2xl font-black">{{ activeSocials.length }}</div>
              <div class="mt-1 truncate text-xs text-green-50/90">tautan aktif</div>
            </div>

            <div class="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
              <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-green-100">Jam</div>
              <div class="mt-2 text-2xl font-black">{{ cleanHours.length }}</div>
              <div class="mt-1 truncate text-xs text-green-50/90">baris jadwal</div>
            </div>

            <div class="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
              <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-green-100">Status</div>
              <div class="mt-2 text-base font-black leading-8">{{ dirty ? 'Draft' : 'Sinkron' }}</div>
              <div class="mt-1 truncate text-xs text-green-50/90">{{ safeEmbedSrc ? 'maps valid' : 'maps kosong' }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Notice -->
      <div
        v-if="note"
        class="rounded-[24px] border px-4 py-3 text-sm font-semibold"
        :class="ok
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/10 dark:text-emerald-300'
          : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300'"
      >
        {{ note }}
      </div>

      <!-- Main Layout -->
      <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr),420px]">
        <!-- Left Editor -->
        <div class="space-y-6">
          <!-- Contact Info -->
          <section class="rounded-[34px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div class="flex min-w-0 items-start gap-3">
                <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <Icon icon="lucide:phone-call" class="h-5 w-5" />
                </div>

                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="text-lg font-black text-gray-900 dark:text-white">Informasi Kontak</h3>
                    <span class="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700 dark:bg-green-900/20 dark:text-green-300">
                      Core Contact
                    </span>
                  </div>
                  <p class="mt-1 text-sm leading-6 text-gray-500 dark:text-neutral-400">
                    Informasi utama yang muncul di halaman kontak dan footer website.
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label :class="labelBase">Email</label>
                <input v-model.trim="form.contact.email" type="email" :class="inputBase" placeholder="info@domain.com" />
              </div>

              <div>
                <label :class="labelBase">Telepon</label>
                <input v-model.trim="form.contact.phone" type="text" :class="inputBase" placeholder="08xxxxxxxxxx" />
              </div>

              <div>
                <label :class="labelBase">WhatsApp Intl</label>
                <input v-model.trim="form.contact.waIntl" type="text" :class="inputBase" placeholder="62xxxxxxxxxx" />
              </div>

              <div>
                <label :class="labelBase">Map Query</label>
                <input v-model.trim="form.contact.mapQuery" type="text" :class="inputBase" placeholder="Nama tempat / alamat pencarian" />
              </div>

              <div class="md:col-span-2">
                <label :class="labelBase">Alamat</label>
                <textarea v-model.trim="form.contact.address" rows="3" :class="inputBase" placeholder="Alamat lengkap lembaga"></textarea>
              </div>
            </div>
          </section>

          <!-- Google Maps -->
          <section class="rounded-[34px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex min-w-0 items-start gap-3">
              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <Icon icon="lucide:map" class="h-5 w-5" />
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="text-lg font-black text-gray-900 dark:text-white">Google Maps & Lokasi</h3>
                  <span
                    class="rounded-full px-2.5 py-1 text-[11px] font-bold"
                    :class="safeEmbedSrc
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'"
                  >
                    {{ safeEmbedSrc ? 'Valid' : 'Belum valid' }}
                  </span>
                </div>

                <p class="mt-1 text-sm leading-6 text-gray-500 dark:text-neutral-400">
                  Pilih lokasi dari peta, cari nama tempat, atau tempel manual Google Maps embed src.
                </p>
              </div>
            </div>

            <div class="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr),320px]">
              <div class="space-y-4">
                <div class="grid gap-4 md:grid-cols-[minmax(0,1fr),auto] md:items-end">
                  <div>
                    <label :class="labelBase">Map Query / Nama Tempat</label>
                    <input
                      v-model.trim="form.contact.mapQuery"
                      type="text"
                      :class="inputBase"
                      placeholder="Contoh: Pondok Pesantren Al-Inayah Pandaan"
                    />
                  </div>

                  <button
                    type="button"
                    class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                    @click="openMapPicker"
                  >
                    <Icon icon="lucide:map-pin" class="h-4 w-4" />
                    Pilih dari Peta
                  </button>
                </div>

                <div class="grid gap-4 md:grid-cols-2">
                  <div>
                    <label :class="labelBase">Latitude</label>
                    <input
                      v-model.number="form.contact.mapLat"
                      type="number"
                      step="any"
                      :class="inputBase"
                      placeholder="-7.6664987"
                      @change="syncEmbedFromLatLng"
                    />
                  </div>

                  <div>
                    <label :class="labelBase">Longitude</label>
                    <input
                      v-model.number="form.contact.mapLng"
                      type="number"
                      step="any"
                      :class="inputBase"
                      placeholder="112.6885825"
                      @change="syncEmbedFromLatLng"
                    />
                  </div>
                </div>

                <div>
                  <label :class="labelBase">Google Maps Embed SRC</label>
                  <textarea
                    v-model.trim="form.contact.mapEmbedSrc"
                    rows="4"
                    :class="inputBase"
                    placeholder="https://www.google.com/maps/embed?pb=... atau https://www.google.com/maps?q=-7.66,112.68&z=16&output=embed"
                  ></textarea>

                  <div class="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-xs font-black text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      @click="syncEmbedFromLatLng"
                    >
                      <Icon icon="lucide:refresh-cw" class="h-3.5 w-3.5" />
                      Generate Embed
                    </button>

                    <a
                      v-if="mapExternalUrl"
                      :href="mapExternalUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-xs font-black text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      <Icon icon="lucide:external-link" class="h-3.5 w-3.5" />
                      Buka Google Maps
                    </a>
                  </div>
                </div>
              </div>

              <div class="overflow-hidden rounded-[26px] border border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="border-b border-gray-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
                  <div class="flex items-center justify-between gap-2">
                    <p class="text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                      Mini Preview
                    </p>
                    <Icon
                      :icon="safeEmbedSrc ? 'lucide:badge-check' : 'lucide:triangle-alert'"
                      class="h-4 w-4"
                      :class="safeEmbedSrc ? 'text-green-600' : 'text-amber-600'"
                    />
                  </div>
                </div>

                <iframe
                  v-if="safeEmbedSrc"
                  :src="safeEmbedSrc"
                  class="h-[190px] w-full border-0"
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  allowfullscreen
                ></iframe>

                <div v-else class="grid h-[190px] place-items-center p-5 text-center">
                  <div>
                    <div class="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-gray-500 shadow-sm dark:bg-neutral-900">
                      <Icon icon="lucide:map-pin-off" class="h-5 w-5" />
                    </div>
                    <p class="mt-3 text-xs font-bold text-gray-700 dark:text-neutral-200">Preview belum tersedia</p>
                    <p class="mt-1 text-[11px] leading-4 text-gray-500 dark:text-neutral-400">
                      Pilih lokasi atau isi embed src.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Hours -->
          <section class="rounded-[34px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div class="flex min-w-0 items-start gap-3">
                <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                  <Icon icon="lucide:clock-3" class="h-5 w-5" />
                </div>

                <div>
                  <h3 class="text-lg font-black text-gray-900 dark:text-white">Jam Layanan</h3>
                  <p class="mt-1 text-sm leading-6 text-gray-500 dark:text-neutral-400">
                    Tampilkan jam pelayanan dalam format yang konsisten dan mudah dipahami.
                  </p>
                </div>
              </div>

              <button
                type="button"
                class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                @click="addHour"
              >
                <Icon icon="lucide:plus" class="h-4 w-4" />
                Tambah Baris
              </button>
            </div>

            <div class="mt-5 grid gap-3">
              <div
                v-for="(h, i) in form.contact.hours"
                :key="`hour-${i}`"
                class="grid gap-3 rounded-[24px] border border-gray-200 bg-gray-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/60 sm:grid-cols-[44px,minmax(0,1fr),auto] sm:items-center"
              >
                <div class="grid h-11 w-11 place-items-center rounded-2xl bg-white text-green-700 ring-1 ring-black/5 dark:bg-neutral-900 dark:text-green-300 dark:ring-white/10">
                  <Icon icon="lucide:clock-3" class="h-4 w-4" />
                </div>

                <input
                  v-model.trim="form.contact.hours[i]"
                  :class="inputBase + ' bg-white dark:bg-neutral-900'"
                  placeholder="Contoh: Senin–Jumat 08.00–15.30 WIB"
                />

                <button
                  type="button"
                  class="inline-flex h-11 items-center justify-center rounded-2xl border border-rose-200 bg-white px-4 text-xs font-bold text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
                  @click="removeHour(i)"
                >
                  Hapus
                </button>
              </div>
            </div>
          </section>

          <!-- Socials -->
          <section class="rounded-[34px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div class="flex min-w-0 items-start gap-3">
                <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300">
                  <Icon icon="lucide:share-2" class="h-5 w-5" />
                </div>

                <div>
                  <h3 class="text-lg font-black text-gray-900 dark:text-white">Media Sosial</h3>
                  <p class="mt-1 text-sm leading-6 text-gray-500 dark:text-neutral-400">
                    Atur tautan sosial aktif lengkap dengan icon yang konsisten.
                  </p>
                </div>
              </div>

              <button
                type="button"
                class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                @click="addSocial"
              >
                <Icon icon="lucide:plus" class="h-4 w-4" />
                Tambah Sosial
              </button>
            </div>

            <div class="mt-5 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              <article
                v-for="(s, i) in form.socials"
                :key="`social-${i}`"
                class="rounded-[28px] border border-gray-200 bg-gray-50 p-4 transition hover:border-green-200 hover:bg-green-50/40 dark:border-neutral-800 dark:bg-neutral-800/60 dark:hover:border-green-900/50 dark:hover:bg-green-900/10"
              >
                <div class="mb-4 flex items-start justify-between gap-3">
                  <div class="flex min-w-0 items-center gap-3">
                    <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-gray-700 ring-1 ring-black/5 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-white/10">
                      <Icon :icon="s.icon || 'lucide:globe'" class="h-5 w-5" />
                    </div>

                    <div class="min-w-0">
                      <p class="truncate text-sm font-black text-gray-900 dark:text-white">
                        {{ s.label || `Sosial ${i + 1}` }}
                      </p>
                      <p class="mt-0.5 truncate text-xs text-gray-500 dark:text-neutral-400">
                        {{ s.href || '#' }}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    class="grid h-9 w-9 place-items-center rounded-2xl border border-rose-200 bg-white text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
                    @click="removeSocial(i)"
                  >
                    <Icon icon="lucide:trash-2" class="h-4 w-4" />
                  </button>
                </div>

                <div class="grid gap-3">
                  <input v-model.trim="form.socials[i].label" :class="inputBase" placeholder="Instagram / YouTube / Facebook" />
                  <input v-model.trim="form.socials[i].href" :class="inputBase" placeholder="https://..." />

                  <button
                    type="button"
                    class="inline-flex h-11 items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="openIconPicker(i)"
                  >
                    <span class="inline-flex min-w-0 items-center gap-2">
                      <Icon :icon="form.socials[i].icon || 'lucide:globe'" class="h-4 w-4 shrink-0" />
                      <span class="truncate">{{ form.socials[i].icon || 'Pilih Icon' }}</span>
                    </span>
                    <Icon icon="lucide:chevron-down" class="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </article>
            </div>
          </section>

          <!-- Footer -->
          <section class="rounded-[34px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex min-w-0 items-start gap-3">
              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <Icon icon="lucide:layout-template" class="h-5 w-5" />
              </div>

              <div>
                <h3 class="text-lg font-black text-gray-900 dark:text-white">Brand Footer</h3>
                <p class="mt-1 text-sm leading-6 text-gray-500 dark:text-neutral-400">
                  Identitas singkat yang tampil di bagian footer website.
                </p>
              </div>
            </div>

            <div class="mt-5 grid gap-4">
              <div>
                <label :class="labelBase">Nama Brand</label>
                <input v-model.trim="form.footer.brand.name" :class="inputBase" placeholder="Contoh: Obayan Edu" />
              </div>

              <div>
                <label :class="labelBase">Deskripsi Footer</label>
                <textarea v-model.trim="form.footer.brand.desc" rows="3" :class="inputBase" placeholder="Deskripsi singkat footer brand"></textarea>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Preview -->
        <aside class="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <section class="rounded-[34px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-black text-gray-900 dark:text-white">Live Preview</h3>
                <p class="mt-1 text-sm leading-6 text-gray-500 dark:text-neutral-400">
                  Pratinjau ringkas kontak dan footer.
                </p>
              </div>

              <div class="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <Icon icon="lucide:eye" class="h-3.5 w-3.5" />
                Preview
              </div>
            </div>

            <div class="mt-5 overflow-hidden rounded-[30px] border border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-800/60">
              <div class="bg-gradient-to-r from-green-600 via-emerald-600 to-lime-500 p-5 text-white">
                <h4 class="text-lg font-black tracking-tight">{{ form.footer.brand.name || 'Nama Brand' }}</h4>
                <p class="mt-2 max-w-sm text-sm leading-6 text-green-50/95">
                  {{ form.footer.brand.desc || 'Deskripsi footer akan tampil di sini.' }}
                </p>
              </div>

              <div class="space-y-4 p-5">
                <PreviewRow icon="lucide:map-pin" label="Alamat" :value="form.contact.address || 'Belum diisi'" color="green" />
                <PreviewRow icon="lucide:mail" label="Email" :value="form.contact.email || 'Belum diisi'" color="green" />
                <PreviewRow icon="lucide:phone" label="Telepon" :value="form.contact.phone || 'Belum diisi'" color="amber" />
                <PreviewRow icon="mdi:whatsapp" label="WhatsApp" :value="form.contact.waIntl || 'Belum diisi'" color="green" />

                <div>
                  <div class="mb-2 flex items-center justify-between gap-3">
                    <h5 class="text-sm font-black text-gray-900 dark:text-white">Jam Layanan</h5>
                    <span class="text-[11px] text-gray-500 dark:text-neutral-400">{{ cleanHours.length }} baris</span>
                  </div>

                  <div class="space-y-2">
                    <div
                      v-for="(hour, i) in cleanHours"
                      :key="`${hour}-${i}`"
                      class="flex items-center gap-3 rounded-[20px] border border-gray-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900"
                    >
                      <div class="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                        <Icon icon="lucide:clock-3" class="h-4 w-4" />
                      </div>
                      <span class="text-sm text-gray-700 dark:text-neutral-200">{{ hour }}</span>
                    </div>

                    <p v-if="!cleanHours.length" class="text-sm text-gray-500 dark:text-neutral-400">
                      Belum ada jam layanan aktif.
                    </p>
                  </div>
                </div>

                <div>
                  <div class="mb-2 flex items-center justify-between gap-3">
                    <h5 class="text-sm font-black text-gray-900 dark:text-white">Sosial Aktif</h5>
                    <span class="text-[11px] text-gray-500 dark:text-neutral-400">{{ activeSocials.length }} link</span>
                  </div>

                  <div class="flex flex-wrap gap-2">
                    <a
                      v-for="social in activeSocials"
                      :key="`${social.label}-${social.href}`"
                      :href="social.href"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      <Icon :icon="social.icon || 'lucide:globe'" class="h-4 w-4 text-green-600 dark:text-green-300" />
                      {{ social.label }}
                    </a>

                    <p v-if="!activeSocials.length" class="text-sm text-gray-500 dark:text-neutral-400">
                      Belum ada sosial aktif.
                    </p>
                  </div>
                </div>

                <div class="rounded-[24px] border border-gray-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
                  <div class="mb-2 flex items-center justify-between">
                    <p class="text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Mini Maps</p>
                    <span class="rounded-full px-2 py-0.5 text-[10px] font-bold" :class="safeEmbedSrc ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'">
                      {{ safeEmbedSrc ? 'Valid' : 'Kosong' }}
                    </span>
                  </div>

                  <iframe
                    v-if="safeEmbedSrc"
                    :src="safeEmbedSrc"
                    class="h-[150px] w-full rounded-2xl border-0"
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    allowfullscreen
                  ></iframe>

                  <div v-else class="grid h-[150px] place-items-center rounded-2xl bg-gray-50 text-center dark:bg-neutral-800">
                    <div>
                      <Icon icon="lucide:map" class="mx-auto h-6 w-6 text-gray-400" />
                      <p class="mt-2 text-xs font-bold text-gray-500 dark:text-neutral-400">Map preview belum aktif</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="rounded-[34px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">Ringkasan</h3>
              <p class="mt-1 text-sm leading-6 text-gray-500 dark:text-neutral-400">Status data kontak saat ini.</p>
            </div>

            <div class="mt-5 grid gap-3">
              <SummaryRow label="Field Kontak" :value="`${completeness.contact}/6 terisi`" />
              <SummaryRow label="Jam Layanan" :value="`${cleanHours.length} baris aktif`" />
              <SummaryRow label="Sosial Aktif" :value="`${activeSocials.length} tautan valid`" />
              <SummaryRow label="Status" :value="dirty ? 'Perubahan belum disimpan' : 'Tersimpan'" />
            </div>
          </section>
        </aside>
      </section>
    </div>

    <!-- Fixed Bottom Action Bar -->
    <div class="fixed inset-x-3 bottom-3 z-[90] xl:left-[370px] xl:right-8">
      <div class="flex flex-col gap-3 rounded-[28px] border border-gray-200 bg-white/95 p-3 shadow-[0_-18px_60px_-28px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/95 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex min-w-0 items-center gap-3">
          <div
            class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
            :class="saving
              ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300'
              : dirty
                ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300'
                : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'"
          >
            <Icon
              :icon="saving ? 'lucide:loader-circle' : dirty ? 'lucide:triangle-alert' : 'lucide:badge-check'"
              class="h-5 w-5"
              :class="saving ? 'animate-spin' : ''"
            />
          </div>

          <div class="min-w-0">
            <p class="truncate text-sm font-black text-gray-900 dark:text-white">
              {{ saving ? 'Menyimpan perubahan...' : 'Workspace Aksi' }}
            </p>
            <p class="truncate text-xs text-gray-500 dark:text-neutral-400">
              {{ dirty ? 'Ada perubahan belum disimpan' : 'Semua perubahan sudah tersimpan' }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:flex sm:shrink-0 sm:items-center">
          <button
            type="button"
            class="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 text-xs font-black text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 sm:px-4 sm:text-sm"
            :disabled="saving"
            @click="resetToDefault"
          >
            Default
          </button>

          <button
            type="button"
            class="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 text-xs font-black text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 sm:px-4 sm:text-sm"
            :disabled="saving || !dirty"
            @click="reloadFromDatabase"
          >
            Muat Ulang
          </button>

          <button
            type="button"
            class="inline-flex h-11 items-center justify-center rounded-2xl bg-green-600 px-3 text-xs font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[150px] sm:px-5 sm:text-sm"
            :disabled="saving || !dirty"
            @click="save"
          >
            {{ saving ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>
     
    <!-- Map Picker -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="mapPicker.open"
          class="fixed inset-0 z-[1001] flex items-center justify-center bg-black/45 px-3 py-4 backdrop-blur-sm sm:px-4"
          @click.self="closeMapPicker"
        >
          <div class="flex max-h-[80vh] w-full max-w-6xl flex-col overflow-hidden rounded-[34px] border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
            <!-- Header -->
            <div class="shrink-0 border-b border-gray-200 bg-white/95 p-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <div class="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    <Icon icon="lucide:map-pin" class="h-3.5 w-3.5" />
                    Map Picker
                  </div>

                  <h3 class="mt-3 text-base font-black text-gray-900 dark:text-white">
                    Pilih Lokasi Kontak
                  </h3>

                  <p class="mt-1 text-sm leading-6 text-gray-500 dark:text-neutral-400">
                    Cari lokasi, gunakan lokasi browser, atau klik langsung pada peta.
                  </p>
                </div>

                <button
                  type="button"
                  class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="closeMapPicker"
                >
                  <Icon icon="lucide:x" class="h-4 w-4" />
                </button>
              </div>

              <p
                v-if="mapPicker.error"
                class="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300"
              >
                {{ mapPicker.error }}
              </p>
            </div>

            <!-- Body -->
            <div class="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1.25fr)_380px] lg:overflow-hidden">
              <!-- Left: Search + Map -->
              <section class="flex min-h-0 flex-col border-b border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-950/40 lg:border-b-0 lg:border-r">
                <!-- Search controls -->
                <div class="shrink-0 rounded-[28px] border border-gray-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
                  <div class="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto_auto]">
                    <div class="relative min-w-0">
                      <Icon
                        icon="lucide:search"
                        class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        v-model.trim="mapPicker.query"
                        type="search"
                        class="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                        placeholder="Cari nama pondok, sekolah, desa, kota..."
                        @keydown.enter.prevent="searchLocation"
                      />
                    </div>

                    <button
                      type="button"
                      class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:opacity-60"
                      :disabled="mapPicker.loading"
                      @click="searchLocation"
                    >
                      <Icon
                        :icon="mapPicker.loading ? 'lucide:loader-circle' : 'lucide:search'"
                        class="h-4 w-4"
                        :class="mapPicker.loading ? 'animate-spin' : ''"
                      />
                      Cari
                    </button>

                    <button
                      type="button"
                      class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 text-sm font-black text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      @click="useBrowserLocation"
                    >
                      <Icon icon="lucide:locate-fixed" class="h-4 w-4" />
                      Lokasi Saya
                    </button>
                  </div>
                </div>

                <!-- Map -->
                <div class="mt-4 min-h-0 flex-1">
                  <div class="relative h-[46vh] min-h-[320px] overflow-hidden rounded-[30px] border border-gray-200 bg-gray-100 dark:border-neutral-800 dark:bg-neutral-800 lg:h-full lg:min-h-0">
                    <div ref="mapPickerEl" class="h-full w-full"></div>

                    <div class="pointer-events-none absolute left-4 top-4 rounded-2xl bg-white/90 px-3 py-2 text-xs font-bold text-gray-700 shadow-sm backdrop-blur dark:bg-neutral-900/90 dark:text-neutral-200">
                      Klik peta untuk memilih titik lokasi
                    </div>

                    <div
                      v-if="mapPicker.selected.lat !== null && mapPicker.selected.lng !== null"
                      class="pointer-events-none absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 px-4 py-3 shadow-sm backdrop-blur dark:bg-neutral-900/95"
                    >
                      <div class="flex items-center gap-3">
                        <div class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                          <Icon icon="lucide:map-pin" class="h-4 w-4" />
                        </div>

                        <div class="min-w-0">
                          <p class="truncate text-xs font-black text-gray-900 dark:text-white">
                            {{ mapPicker.selected.name || 'Titik lokasi dipilih' }}
                          </p>
                          <p class="mt-0.5 truncate text-[11px] text-gray-500 dark:text-neutral-400">
                            {{ mapPicker.selected.lat }}, {{ mapPicker.selected.lng }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Right: Selected Location + Results + Action -->
              <aside class="flex min-h-0 flex-col bg-white dark:bg-neutral-900">
                <div class="min-h-0 flex-1 overflow-y-auto p-4">
                  <!-- Selected Location -->
                  <div class="rounded-[28px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <p class="text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                          Lokasi Dipilih
                        </p>
                        <h4 class="mt-2 line-clamp-2 text-sm font-black text-gray-900 dark:text-white">
                          {{ mapPicker.selected.name || 'Belum memilih lokasi' }}
                        </h4>
                      </div>

                      <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                        <Icon icon="lucide:map-pin" class="h-5 w-5" />
                      </div>
                    </div>

                    <p class="mt-3 line-clamp-4 text-xs leading-5 text-gray-500 dark:text-neutral-400">
                      {{ mapPicker.selected.address || 'Cari lokasi, gunakan lokasi browser, atau klik area pada peta.' }}
                    </p>

                    <div class="mt-4 grid grid-cols-2 gap-2">
                      <div class="rounded-2xl bg-white p-3 dark:bg-neutral-900">
                        <p class="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">Lat</p>
                        <p class="mt-1 truncate text-xs font-bold text-gray-900 dark:text-white">
                          {{ mapPicker.selected.lat ?? '-' }}
                        </p>
                      </div>

                      <div class="rounded-2xl bg-white p-3 dark:bg-neutral-900">
                        <p class="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">Lng</p>
                        <p class="mt-1 truncate text-xs font-bold text-gray-900 dark:text-white">
                          {{ mapPicker.selected.lng ?? '-' }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Results -->
                  <div class="mt-4">
                    <div class="mb-3 flex items-center justify-between gap-3">
                      <p class="text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                        Hasil Pencarian
                      </p>

                      <span class="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-500 dark:bg-neutral-800 dark:text-neutral-400">
                        {{ mapPicker.results.length }} hasil
                      </span>
                    </div>

                    <div class="space-y-2">
                      <button
                        v-for="result in mapPicker.results"
                        :key="`${result.lat}-${result.lon}-${result.display_name}`"
                        type="button"
                        class="flex w-full items-start gap-3 rounded-[22px] border border-gray-200 bg-white p-3 text-left transition hover:border-green-200 hover:bg-green-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-green-900/50 dark:hover:bg-green-900/10"
                        @click="selectSearchResult(result)"
                      >
                        <div class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                          <Icon icon="lucide:map-pin" class="h-4 w-4" />
                        </div>

                        <div class="min-w-0">
                          <p class="line-clamp-1 text-sm font-black text-gray-900 dark:text-white">
                            {{ result.name || result.display_name }}
                          </p>

                          <p class="mt-1 line-clamp-2 text-xs leading-5 text-gray-500 dark:text-neutral-400">
                            {{ result.display_name }}
                          </p>
                        </div>
                      </button>

                      <p
                        v-if="!mapPicker.results.length"
                        class="rounded-[22px] border border-dashed border-gray-300 p-5 text-center text-sm text-gray-500 dark:border-neutral-800 dark:text-neutral-400"
                      >
                        Hasil pencarian akan tampil di sini.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Sticky Action: not covered by maps -->
                <div class="shrink-0 border-t border-gray-200 bg-white/95 p-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95">
                  <div class="grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-black text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      @click="closeMapPicker"
                    >
                      <Icon icon="lucide:x" class="h-4 w-4" />
                      Batal
                    </button>

                    <button
                      type="button"
                      class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:opacity-60"
                      :disabled="mapPicker.selected.lat === null || mapPicker.selected.lng === null"
                      @click="applySelectedLocation"
                    >
                      <Icon icon="lucide:check" class="h-4 w-4" />
                      Simpan
                    </button>
                  </div>

                  <p class="mt-2 text-center text-[11px] leading-4 text-gray-500 dark:text-neutral-400">
                    Lokasi akan mengisi latitude, longitude, alamat, query, dan embed Google Maps.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    <!-- Icon Picker -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="iconModal.show"
          class="fixed inset-0 z-[1002] flex items-start justify-center bg-black/45 px-4 py-10 backdrop-blur-sm"
          @click.self="closeIconPicker"
        >
          <div class="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[34px] border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
            <div class="sticky top-0 z-10 border-b border-gray-200 bg-white/95 p-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95">
              <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 class="text-base font-black text-gray-900 dark:text-white">Pilih Icon</h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Cari icon populer atau telusuri online via Iconify API.</p>
                </div>

                <button
                  type="button"
                  class="grid h-10 w-10 place-items-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
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
                      'rounded-2xl px-4 py-2 text-sm font-bold transition',
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
                    class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
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
                  <div class="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-gray-700 ring-1 ring-black/5 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-white/10">
                    <Icon :icon="name" class="h-5 w-5" />
                  </div>
                  <div class="mt-3 truncate text-[11px] font-medium text-gray-600 dark:text-neutral-300" :title="name">
                    {{ name }}
                  </div>
                </button>
              </div>

              <p v-if="!iconModal.visible.length" class="mt-6 text-center text-sm text-gray-500 dark:text-neutral-400">
                Tidak ada icon ditemukan.
              </p>
            </div>

            <div class="sticky bottom-0 z-10 border-t border-gray-200 bg-white/95 p-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div v-if="iconModal.allowOnline && iconModal.total > iconModal.limit" class="text-xs text-gray-500 dark:text-neutral-400">
                  Showing {{ Math.min(iconModal.total, iconModal.start + 1) }}–{{ Math.min(iconModal.total, iconModal.start + iconModal.limit) }} of {{ iconModal.total }}
                </div>

                <div class="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    class="inline-flex h-10 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    :disabled="iconModal.start === 0 || iconModal.loading"
                    @click="prevPage"
                  >
                    Prev
                  </button>

                  <button
                    type="button"
                    class="inline-flex h-10 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
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
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import 'leaflet/dist/leaflet.css'
import { useNuxtApp, useRuntimeConfig, useHead } from 'nuxt/app'
import { get, ref as dbRef, update } from 'firebase/database'

type Social = {
  label: string
  href: string
  icon: string
}

type Shape = {
  contact: {
    address: string
    email: string
    phone: string
    waIntl: string
    mapEmbedSrc: string
    mapQuery: string
    mapLat?: number | null
    mapLng?: number | null
    hours: string[]
  }
  socials: Social[]
  footer: {
    brand: {
      name: string
      desc: string
    }
  }
}

type TabName = 'Popular' | 'Online'

const config = useRuntimeConfig()
const clientName = String(config.public.clientName || 'alinayah')
const clientDisplayName = String(config.public.clientDisplayName || clientName)
const appLogo = String(config.public.appLogo || '/assets/logo.png')

definePageMeta({
  layout: 'app',
  layoutProps: { title: 'Kontak' },
  ssr: false
})

useHead({
  title: 'Kontak Editor | ' + clientDisplayName,
})

const year = new Date().getFullYear()
const CONTACT_PATH = `${clientName}/contact`

const defaults: Shape = {
  contact: {
    address: 'Jl. Pesantren No. 1, Pandaan, Pasuruan, Jawa Timur 67156',
    email: `info@${clientName}.sch.id`,
    phone: '085856376399',
    waIntl: '6285856376399',
    mapQuery: 'Pondok Pesantren ' + clientDisplayName + ', Pandaan, Pasuruan',
    mapLat: -7.6664987,
    mapLng: 112.6885825,
    mapEmbedSrc: 'https://www.google.com/maps/embed?pb=...',
    hours: ['Senin–Jumat 08.00–15.30 WIB', 'Sabtu 08.00–12.00 WIB']
  },
  socials: [
    { label: 'Instagram', href: '#', icon: 'mdi:instagram' },
    { label: 'YouTube', href: '#', icon: 'mdi:youtube' },
    { label: 'Facebook', href: '#', icon: 'mdi:facebook' }
  ],
  footer: {
    brand: {
      name: clientDisplayName,
      desc: `© ${year} ${clientName}.`
    }
  }
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

const form = reactive<Shape>(clone(defaults))
const lastSaved = ref<string>(JSON.stringify(normalizePayload(defaults)))
const saving = ref(false)
const note = ref('')
const ok = ref(false)

type MapSearchResult = {
  display_name: string
  lat: string
  lon: string
  name?: string
  type?: string
}

const mapPickerEl = ref<HTMLElement | null>(null)

const mapPicker = reactive({
  open: false,
  query: '',
  loading: false,
  error: '',
  results: [] as MapSearchResult[],
  selected: {
    name: '',
    address: '',
    lat: null as number | null,
    lng: null as number | null
  }
})

let Leaflet: any = null
let pickerMap: any = null
let pickerMarker: any = null

const mapExternalUrl = computed(() => {
  const lat = Number(form.contact.mapLat)
  const lng = Number(form.contact.mapLng)

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return ''

  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
})

const inputBase =
  'block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:bg-neutral-900'

const labelBase =
  'mb-1.5 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500'

const completeness = computed(() => {
  const c = form.contact
  const filled = [c.email, c.phone, c.waIntl, c.mapQuery, c.address, c.mapEmbedSrc].filter((item) => String(item || '').trim()).length

  return { contact: filled }
})

const cleanHours = computed(() => form.contact.hours.map((item) => item.trim()).filter(Boolean))

const activeSocials = computed(() =>
  form.socials
    .map((item) => ({
      ...item,
      label: item.label.trim(),
      href: item.href.trim(),
      icon: item.icon.trim()
    }))
    .filter((item) => item.label && item.href && isValidUrl(item.href))
)

const safeEmbedSrc = computed(() => {
  const src = String(form.contact.mapEmbedSrc || '').trim()

  if (/^https:\/\/www\.google\.com\/maps\/embed/i.test(src)) {
    return src
  }

  if (/^https:\/\/www\.google\.com\/maps\?q=/i.test(src)) {
    return src
  }

  const lat = Number(form.contact.mapLat)
  const lng = Number(form.contact.mapLng)

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return buildGoogleEmbedUrl(lat, lng)
  }

  const query = String(form.contact.mapQuery || form.contact.address || '').trim()

  if (query) {
    return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`
  }

  return ''
})

const dirty = computed(() => JSON.stringify(normalizePayload(clone(form))) !== lastSaved.value)

function isValidUrl(value: string) {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

function toNullableNumber(value: unknown) {
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

function normalizePayload(payload: Shape): Shape {
  return {
    contact: {
      address: String(payload.contact.address || '').trim(),
      email: String(payload.contact.email || '').trim(),
      phone: String(payload.contact.phone || '').trim(),
      waIntl: String(payload.contact.waIntl || '').trim().replace(/\D/g, ''),
      mapQuery: String(payload.contact.mapQuery || '').trim(),
      mapLat: toNullableNumber(payload.contact.mapLat),
      mapLng: toNullableNumber(payload.contact.mapLng),
      mapEmbedSrc: String(payload.contact.mapEmbedSrc || '').trim(),
      hours: Array.isArray(payload.contact.hours)
        ? payload.contact.hours.map((item) => String(item || '').trim()).filter(Boolean)
        : []
    },
    socials: Array.isArray(payload.socials)
      ? payload.socials
          .map((item) => ({
            label: String(item.label || '').trim(),
            href: String(item.href || '').trim(),
            icon: String(item.icon || '').trim()
          }))
          .filter((item) => item.label || item.href || item.icon)
      : [],
    footer: {
      brand: {
        name: String(payload.footer?.brand?.name || '').trim(),
        desc: String(payload.footer?.brand?.desc || '').trim()
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
  form.contact.mapLat = next.contact.mapLat ?? null
  form.contact.mapLng = next.contact.mapLng ?? null
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

  const data = snap.val() || {}

  const merged: Shape = {
    ...clone(defaults),
    ...data,
    contact: {
      ...clone(defaults.contact),
      ...(data.contact || data.ccontact || {})
    },
    socials: Array.isArray(data.socials) ? data.socials : clone(defaults.socials),
    footer: {
      brand: {
        ...clone(defaults.footer.brand),
        ...(data.footer?.brand || {})
      }
    }
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

    await update(dbRef($realtimeDb), {
      [CONTACT_PATH]: payload
    })

    replaceForm(payload)
    lastSaved.value = JSON.stringify(payload)

    ok.value = true
    note.value = 'Perubahan berhasil disimpan.'

    window.setTimeout(() => {
      note.value = ''
    }, 1800)
  } catch (error: any) {
    ok.value = false
    note.value = error?.message || 'Gagal menyimpan data.'
  } finally {
    saving.value = false
  }
}

function buildGoogleEmbedUrl(lat: number, lng: number, zoom = 16) {
  return `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`
}

function syncEmbedFromLatLng() {
  const lat = Number(form.contact.mapLat)
  const lng = Number(form.contact.mapLng)

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    ok.value = false
    note.value = 'Latitude dan longitude belum valid.'
    return
  }

  form.contact.mapEmbedSrc = buildGoogleEmbedUrl(lat, lng)

  ok.value = true
  note.value = 'Embed Google Maps berhasil dibuat dari koordinat.'

  window.setTimeout(() => {
    note.value = ''
  }, 1600)
}

async function ensureLeaflet() {
  if (Leaflet) return Leaflet

  Leaflet = await import('leaflet')
  return Leaflet
}

function makeMarkerIcon() {
  return Leaflet.divIcon({
    className: '',
    html: `
      <div style="
        width: 38px;
        height: 38px;
        border-radius: 18px 18px 18px 4px;
        transform: rotate(-45deg);
        background: #0284c7;
        box-shadow: 0 18px 35px rgba(2,132,199,.35);
        border: 3px solid white;
        display: grid;
        place-items: center;
      ">
        <div style="
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: white;
        "></div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 36],
    popupAnchor: [0, -34]
  })
}

async function openMapPicker() {
  mapPicker.open = true
  mapPicker.error = ''
  mapPicker.query = form.contact.mapQuery || clientDisplayName

  const lat = Number(form.contact.mapLat)
  const lng = Number(form.contact.mapLng)

  mapPicker.selected.lat = Number.isFinite(lat) ? lat : -7.6664987
  mapPicker.selected.lng = Number.isFinite(lng) ? lng : 112.6885825
  mapPicker.selected.name = form.contact.mapQuery || clientDisplayName
  mapPicker.selected.address = form.contact.address || ''

  await nextTick()
  await initPickerMap()
}

async function initPickerMap() {
  await ensureLeaflet()

  if (!mapPickerEl.value) return

  const lat = mapPicker.selected.lat ?? -7.6664987
  const lng = mapPicker.selected.lng ?? 112.6885825

  if (pickerMap) {
    pickerMap.remove()
    pickerMap = null
    pickerMarker = null
  }

  pickerMap = Leaflet.map(mapPickerEl.value, {
    zoomControl: true,
    scrollWheelZoom: true
  }).setView([lat, lng], 16)

  Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; OpenStreetMap'
  }).addTo(pickerMap)

  pickerMarker = Leaflet.marker([lat, lng], {
    icon: makeMarkerIcon(),
    draggable: true
  }).addTo(pickerMap)

  pickerMarker.on('dragend', async () => {
    const position = pickerMarker.getLatLng()
    await setSelectedMapPoint(position.lat, position.lng, mapPicker.selected.name, true)
  })

  pickerMap.on('click', async (event: any) => {
    await setSelectedMapPoint(event.latlng.lat, event.latlng.lng, 'Titik dipilih dari peta', true)
  })

  setTimeout(() => {
    pickerMap?.invalidateSize?.()
  }, 150)
}

async function setSelectedMapPoint(lat: number, lng: number, name = '', shouldReverse = false) {
  mapPicker.selected.lat = Number(lat.toFixed(7))
  mapPicker.selected.lng = Number(lng.toFixed(7))

  if (name) mapPicker.selected.name = name

  if (pickerMarker) {
    pickerMarker.setLatLng([lat, lng])
  }

  if (pickerMap) {
    pickerMap.flyTo([lat, lng], Math.max(pickerMap.getZoom(), 16), {
      duration: 0.6
    })
  }

  if (shouldReverse) {
    await reverseGeocode(lat, lng)
  }
}

async function searchLocation() {
  const q = mapPicker.query.trim()

  if (!q) {
    mapPicker.error = 'Masukkan nama lokasi terlebih dahulu.'
    return
  }

  mapPicker.loading = true
  mapPicker.error = ''

  try {
    const url =
      `https://nominatim.openstreetmap.org/search?` +
      `format=jsonv2&limit=8&addressdetails=1&accept-language=id&q=${encodeURIComponent(q)}`

    const res = await fetch(url, {
      headers: {
        Accept: 'application/json'
      }
    })

    if (!res.ok) throw new Error('Pencarian lokasi gagal.')

    const data = await res.json()
    mapPicker.results = Array.isArray(data) ? data : []

    if (mapPicker.results.length) {
      await selectSearchResult(mapPicker.results[0])
    } else {
      mapPicker.error = 'Lokasi tidak ditemukan. Coba kata kunci yang lebih spesifik.'
    }
  } catch (error: any) {
    mapPicker.error = error?.message || 'Gagal mencari lokasi.'
  } finally {
    mapPicker.loading = false
  }
}

async function selectSearchResult(result: MapSearchResult) {
  const lat = Number(result.lat)
  const lng = Number(result.lon)

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return

  mapPicker.selected.name = result.name || mapPicker.query || clientDisplayName
  mapPicker.selected.address = result.display_name || ''
  await setSelectedMapPoint(lat, lng, mapPicker.selected.name, false)
}

async function reverseGeocode(lat: number, lng: number) {
  try {
    const url =
      `https://nominatim.openstreetmap.org/reverse?` +
      `format=jsonv2&accept-language=id&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`

    const res = await fetch(url, {
      headers: {
        Accept: 'application/json'
      }
    })

    if (!res.ok) return

    const data = await res.json().catch(() => null)

    if (data?.display_name) {
      mapPicker.selected.address = data.display_name
    }

    if (data?.name) {
      mapPicker.selected.name = data.name
    }
  } catch {}
}

function useBrowserLocation() {
  if (!navigator.geolocation) {
    mapPicker.error = 'Browser tidak mendukung geolocation.'
    return
  }

  mapPicker.loading = true
  mapPicker.error = ''

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude

      await setSelectedMapPoint(lat, lng, 'Lokasi saya', true)
      mapPicker.loading = false
    },
    () => {
      mapPicker.error = 'Gagal mengambil lokasi. Pastikan izin lokasi aktif.'
      mapPicker.loading = false
    },
    {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 0
    }
  )
}

function applySelectedLocation() {
  const lat = mapPicker.selected.lat
  const lng = mapPicker.selected.lng

  if (lat === null || lng === null) {
    mapPicker.error = 'Pilih titik lokasi terlebih dahulu.'
    return
  }

  form.contact.mapLat = lat
  form.contact.mapLng = lng
  form.contact.mapQuery = mapPicker.selected.name || form.contact.mapQuery || clientDisplayName

  if (mapPicker.selected.address) {
    form.contact.address = mapPicker.selected.address
  }

  form.contact.mapEmbedSrc = buildGoogleEmbedUrl(lat, lng)

  closeMapPicker()

  ok.value = true
  note.value = 'Lokasi berhasil diterapkan. Klik Simpan Perubahan untuk menyimpan ke database.'

  window.setTimeout(() => {
    note.value = ''
  }, 2200)
}

function closeMapPicker() {
  mapPicker.open = false

  if (pickerMap) {
    pickerMap.remove()
    pickerMap = null
    pickerMarker = null
  }
}

/* Icon Picker */
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
    'ph:phone',
    'ph:envelope-simple',
    'ph:map-pin',
    'mdi:school',
    'mdi:google'
  ] as string[],
  targetIndex: -1
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

const PreviewRow = defineComponent({
  name: 'PreviewRow',
  props: {
    icon: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: String, required: true },
    color: { type: String, default: 'green' }
  },
  setup(props) {
    const colorClass = computed(() => {
      if (props.color === 'green') return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
      if (props.color === 'amber') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
      return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })

    return () =>
      h('div', { class: 'flex items-start gap-3 rounded-[22px] border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900' }, [
        h('div', { class: `grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${colorClass.value}` }, [
          h(Icon, { icon: props.icon, class: 'h-5 w-5' })
        ]),
        h('div', { class: 'min-w-0' }, [
          h('div', { class: 'text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500' }, props.label),
          h('div', { class: 'mt-1 break-words text-sm font-medium text-gray-900 dark:text-white' }, props.value)
        ])
      ])
  }
})

const SummaryRow = defineComponent({
  name: 'SummaryRow',
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true }
  },
  setup(props) {
    return () =>
      h('div', { class: 'rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60' }, [
        h('div', { class: 'text-[11px] font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500' }, props.label),
        h('div', { class: 'mt-2 truncate text-sm font-black text-gray-900 dark:text-white' }, props.value)
      ])
  }
})

onMounted(async () => {
  await load()
})

onBeforeUnmount(() => {
  if (pickerMap) {
    pickerMap.remove()
    pickerMap = null
    pickerMarker = null
  }

  if (iconSearchTimer) {
    clearTimeout(iconSearchTimer)
    iconSearchTimer = null
  }
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

:deep(.leaflet-container) {
  z-index: 0;
  font-family: inherit;
}

:deep(.leaflet-control-container) {
  font-family: inherit;
}
</style>