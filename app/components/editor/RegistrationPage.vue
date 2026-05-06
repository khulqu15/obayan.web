<template>
  <section class="relative overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
    <!-- Header -->
    <div class="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-green-50 via-white to-lime-50 px-5 py-5 dark:border-neutral-800 dark:from-green-950/20 dark:via-neutral-900 dark:to-neutral-900 md:px-6">
      <div class="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-green-300/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-20 left-8 h-40 w-40 rounded-full bg-lime-300/20 blur-3xl"></div>

      <div class="relative z-10">
        <div class="inline-flex items-center gap-2 rounded-full border border-green-100 bg-white/80 px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm backdrop-blur dark:border-green-900/40 dark:bg-neutral-900/70 dark:text-green-300">
          <span class="h-2 w-2 rounded-full bg-green-500"></span>
          Registration Page Editor
        </div>

        <h2 class="mt-4 text-xl font-black tracking-tight text-gray-950 dark:text-white">
          Kelola Halaman Pendaftaran
        </h2>

        <p class="mt-2 max-w-3xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
          Atur judul, informasi lembaga, status pendaftaran, timeline, kontak panitia, dan multiple brosur dengan preview embed PDF / Google Drive / gambar.
        </p>

        <div class="mt-4 inline-flex max-w-full items-center gap-2 rounded-2xl border border-gray-200 bg-white/80 px-3 py-2 text-xs font-bold text-gray-600 shadow-sm backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-300">
          <Icon icon="lucide:database" class="h-4 w-4 text-green-600 dark:text-green-300" />
          <span class="truncate">{{ firebasePath }}</span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="relative z-10 mt-5 flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-black transition"
          :class="activeTab === tab.key
            ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
            : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white'"
          @click="activeTab = tab.key"
        >
          <Icon :icon="tab.icon" class="h-4 w-4" />
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Notices -->
    <div v-if="savedNote || errNote" class="px-5 pt-5 md:px-6">
      <div
        v-if="savedNote"
        class="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 dark:border-green-900/40 dark:bg-green-900/10 dark:text-green-300"
      >
        {{ savedNote }}
      </div>

      <div
        v-if="errNote"
        class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300"
      >
        {{ errNote }}
      </div>
    </div>

    <div class="p-5 pb-28 md:p-6 md:pb-28">
      <div
        v-if="loading"
        class="grid min-h-[280px] place-items-center rounded-[28px] border border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-800/60"
      >
        <div class="text-center">
          <Icon icon="lucide:loader-circle" class="mx-auto h-9 w-9 animate-spin text-green-600 dark:text-green-300" />
          <p class="mt-3 text-sm font-black text-gray-900 dark:text-white">Memuat konfigurasi pendaftaran...</p>
          <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">Mengambil data dari Firebase Realtime Database.</p>
        </div>
      </div>

      <template v-else>
        <!-- Umum -->
        <div v-show="activeTab === 'Umum'" class="space-y-5">
          <InfoCard
            title="Informasi Utama"
            subtitle="Data ini tampil di hero halaman pendaftaran dan SEO dasar."
            icon="lucide:layout-template"
          />

          <div class="grid gap-4 md:grid-cols-2">
            <FieldCard label="Tahun PPDB" help="Contoh: 2026 akan tampil sebagai 2026/2027.">
              <input
                v-model.number="form.year"
                type="number"
                min="2020"
                max="2100"
                :class="inputClass"
                placeholder="2026"
              />
            </FieldCard>

            <FieldCard label="Nama Pendek Lembaga" help="Dipakai pada nomor pendaftaran dan meta title.">
              <input
                v-model.trim="form.institutionShortName"
                type="text"
                :class="inputClass"
                placeholder="Al-Inayah"
              />
            </FieldCard>

            <FieldCard label="Nama Lengkap Lembaga" class="md:col-span-2">
              <input
                v-model.trim="form.institutionName"
                type="text"
                :class="inputClass"
                placeholder="Pondok Pesantren Al-Inayah"
              />
            </FieldCard>

            <FieldCard label="Judul Halaman" class="md:col-span-2">
              <input
                v-model.trim="form.title"
                type="text"
                :class="inputClass"
                placeholder="Formulir Pendaftaran Santri Baru"
              />
            </FieldCard>

            <FieldCard label="Subjudul Halaman" class="md:col-span-2">
              <textarea
                v-model.trim="form.subtitle"
                rows="4"
                :class="textareaClass"
                placeholder="Isi data secara benar. Draf tersimpan otomatis di perangkat Anda."
              ></textarea>
            </FieldCard>

            <FieldCard label="Deskripsi SEO" help="Dipakai untuk meta description halaman." class="md:col-span-2">
              <textarea
                v-model.trim="form.description"
                rows="4"
                :class="textareaClass"
                placeholder="Daftar peserta didik baru secara online."
              ></textarea>
            </FieldCard>
          </div>
        </div>

        <!-- Status -->
        <div v-show="activeTab === 'Status'" class="space-y-5">
          <InfoCard
            title="Status Pendaftaran"
            subtitle="Kontrol apakah formulir dibuka, ditutup manual, atau ditutup otomatis pada tanggal tertentu."
            icon="lucide:lock-keyhole"
          />

          <div class="grid gap-4 lg:grid-cols-2">
            <section class="rounded-[28px] border border-gray-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="text-base font-black text-gray-950 dark:text-white">
                    Tutup Manual
                  </h3>
                  <p class="mt-1 text-sm leading-6 text-gray-500 dark:text-neutral-400">
                    Jika aktif, halaman pendaftaran langsung menampilkan status ditutup.
                  </p>
                </div>

                <button
                  type="button"
                  class="relative h-8 w-14 rounded-full transition"
                  :class="form.isClosed ? 'bg-rose-600' : 'bg-gray-200 dark:bg-neutral-700'"
                  @click="form.isClosed = !form.isClosed"
                >
                  <span
                    class="absolute top-1 h-6 w-6 rounded-full bg-white shadow transition"
                    :class="form.isClosed ? 'left-7' : 'left-1'"
                  ></span>
                </button>
              </div>

              <div class="mt-4 rounded-2xl px-4 py-3 text-sm font-bold" :class="form.isClosed ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300' : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'">
                {{ form.isClosed ? 'Formulir sedang ditutup manual.' : 'Formulir sedang dibuka secara manual.' }}
              </div>
            </section>

            <section class="rounded-[28px] border border-gray-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="text-base font-black text-gray-950 dark:text-white">
                    Tutup Otomatis
                  </h3>
                  <p class="mt-1 text-sm leading-6 text-gray-500 dark:text-neutral-400">
                    Aktifkan jika pendaftaran harus otomatis berhenti pada jadwal tertentu.
                  </p>
                </div>

                <button
                  type="button"
                  class="relative h-8 w-14 rounded-full transition"
                  :class="form.autoCloseEnabled ? 'bg-green-600' : 'bg-gray-200 dark:bg-neutral-700'"
                  @click="form.autoCloseEnabled = !form.autoCloseEnabled"
                >
                  <span
                    class="absolute top-1 h-6 w-6 rounded-full bg-white shadow transition"
                    :class="form.autoCloseEnabled ? 'left-7' : 'left-1'"
                  ></span>
                </button>
              </div>

              <div class="mt-4">
                <label :class="labelClass">Tanggal & Jam Tutup Otomatis</label>
                <input
                  v-model="form.autoCloseAt"
                  type="datetime-local"
                  :disabled="!form.autoCloseEnabled"
                  :class="inputClass"
                />
                <p class="mt-1.5 text-xs leading-5 text-gray-500 dark:text-neutral-400">
                  Gunakan waktu lokal admin. Contoh: 31 Desember 2026, 23:59.
                </p>
              </div>
            </section>

            <FieldCard label="Pesan Saat Pendaftaran Ditutup" class="lg:col-span-2">
              <textarea
                v-model.trim="form.notice"
                rows="4"
                :class="textareaClass"
                placeholder="Pendaftaran ditutup. Silakan hubungi panitia untuk informasi lebih lanjut."
              ></textarea>
            </FieldCard>
          </div>
        </div>

        <!-- Timeline -->
        <div v-show="activeTab === 'Timeline'" class="space-y-5">
          <InfoCard
            title="Timeline PSB"
            subtitle="Jadwal ini tampil di sidebar halaman pendaftaran."
            icon="lucide:calendar-check"
          />

          <div class="grid gap-4 md:grid-cols-2">
  <FieldCard label="Mulai Pendaftaran" help="Tanggal dan jam mulai pendaftaran dibuka.">
    <input
      v-model="form.timeline.registrationStart"
      type="datetime-local"
      :class="inputClass"
    />
  </FieldCard>

  <FieldCard label="Akhir Pendaftaran" help="Tanggal dan jam terakhir pendaftaran diterima.">
    <input
      v-model="form.timeline.registrationEnd"
      type="datetime-local"
      :class="inputClass"
    />
  </FieldCard>

  <FieldCard label="Jadwal Seleksi">
    <input
      v-model="form.timeline.selectionAt"
      type="datetime-local"
      :class="inputClass"
    />
  </FieldCard>

  <FieldCard label="Jadwal Pengumuman">
    <input
      v-model="form.timeline.announcementAt"
      type="datetime-local"
      :class="inputClass"
    />
  </FieldCard>
</div>

<div class="rounded-[24px] border border-green-100 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/10">
  <div class="flex items-start gap-3">
    <Icon icon="lucide:calendar-clock" class="mt-0.5 h-5 w-5 shrink-0 text-green-700 dark:text-green-300" />
    <div class="text-sm leading-6 text-green-800 dark:text-green-200">
      <p class="font-black">Preview Timeline</p>
      <div class="mt-2 grid gap-2 md:grid-cols-3">
        <div class="rounded-2xl bg-white/70 p-3 dark:bg-neutral-900/60">
          <p class="text-xs font-bold uppercase tracking-[0.14em] opacity-70">Pendaftaran</p>
          <p class="mt-1 font-semibold">{{ timelineDisplay.registration }}</p>
        </div>

        <div class="rounded-2xl bg-white/70 p-3 dark:bg-neutral-900/60">
          <p class="text-xs font-bold uppercase tracking-[0.14em] opacity-70">Seleksi</p>
          <p class="mt-1 font-semibold">{{ timelineDisplay.selection }}</p>
        </div>

        <div class="rounded-2xl bg-white/70 p-3 dark:bg-neutral-900/60">
          <p class="text-xs font-bold uppercase tracking-[0.14em] opacity-70">Pengumuman</p>
          <p class="mt-1 font-semibold">{{ timelineDisplay.announcement }}</p>
        </div>
      </div>
    </div>
  </div>
</div>
        </div>

        <!-- Kontak -->
        <div v-show="activeTab === 'Kontak'" class="space-y-5">
          <InfoCard
            title="Kontak Panitia"
            subtitle="Kontak ini membantu calon wali santri saat mengalami kendala."
            icon="lucide:headphones"
          />

          <div class="grid gap-4 md:grid-cols-2">
            <FieldCard label="Email Panitia">
              <input
                v-model.trim="form.email"
                type="email"
                :class="inputClass"
                placeholder="admin@pondok.sch.id"
              />
            </FieldCard>

            <FieldCard label="WhatsApp Panitia" help="Boleh isi 08..., 628..., atau link wa.me. Saat disimpan akan dirapikan.">
              <input
                v-model.trim="form.whatsapp"
                type="tel"
                :class="inputClass"
                placeholder="6281234567890"
              />
            </FieldCard>
          </div>

          <div class="rounded-[28px] border border-green-100 bg-green-50 p-5 dark:border-green-900/30 dark:bg-green-900/10">
            <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p class="text-sm font-black text-green-900 dark:text-green-100">
                  Preview Link WhatsApp
                </p>
                <p class="mt-1 break-all text-sm leading-6 text-green-700 dark:text-green-300">
                  {{ whatsappPreview || 'Belum ada nomor WhatsApp.' }}
                </p>
              </div>

              <a
                v-if="whatsappPreview"
                :href="whatsappPreview"
                target="_blank"
                rel="noopener"
                class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white transition hover:bg-green-700"
              >
                <Icon icon="lucide:external-link" class="h-4 w-4" />
                Test Link
              </a>
            </div>
          </div>
        </div>

        <!-- Brosur -->
        <div v-show="activeTab === 'Brosur'" class="space-y-5">
          <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
            <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 class="text-lg font-black text-gray-900 dark:text-white">
                  Multiple Brosur
                </h3>
                <p class="mt-1 max-w-3xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                  Tempel link PDF, Google Drive, atau gambar. Editor akan menampilkan preview embed. Data disimpan sebagai array link agar kompatibel dengan halaman pendaftaran sekarang.
                </p>
              </div>

              <button
                type="button"
                class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                @click="addBrochure"
              >
                <Icon icon="lucide:plus" class="h-4 w-4" />
                Tambah Brosur
              </button>
            </div>
          </div>

          <div v-if="!brochureDrafts.length" class="rounded-[28px] border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-800/60">
            <Icon icon="lucide:file-plus-2" class="mx-auto h-10 w-10 text-gray-400" />
            <p class="mt-3 text-sm font-black text-gray-900 dark:text-white">Belum ada brosur</p>
            <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">Klik “Tambah Brosur” untuk menambahkan link brosur pertama.</p>
          </div>

          <div class="grid gap-5">
            <article
              v-for="(item, index) in brochureDrafts"
              :key="item.id"
              class="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div class="border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
                <div class="flex items-center justify-between gap-3">
                  <div class="min-w-0">
                    <p class="text-xs font-black uppercase tracking-[0.16em] text-green-700 dark:text-green-300">
                      Brosur {{ index + 1 }}
                    </p>
                    <h4 class="mt-0.5 truncate text-sm font-black text-gray-900 dark:text-white">
                      {{ item.title || previewTitle(item.url, index) }}
                    </h4>
                  </div>

                  <div class="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      :disabled="index === 0"
                      @click="moveBrochure(index, -1)"
                    >
                      <Icon icon="lucide:arrow-up" class="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      :disabled="index === brochureDrafts.length - 1"
                      @click="moveBrochure(index, 1)"
                    >
                      <Icon icon="lucide:arrow-down" class="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
                      @click="removeBrochure(index)"
                    >
                      <Icon icon="lucide:trash-2" class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div class="grid gap-5 p-4 lg:grid-cols-[0.95fr,1.05fr]">
                <div class="space-y-4">
                  <FieldCard label="Nama Tampilan Editor" help="Opsional. Hanya untuk memudahkan admin mengenali brosur.">
                    <input
                      v-model.trim="item.title"
                      type="text"
                      :class="inputClass"
                      :placeholder="`Brosur ${index + 1}`"
                    />
                  </FieldCard>

                  <FieldCard label="Link Embed / Link Brosur">
                    <input
                      v-model.trim="item.url"
                      type="url"
                      :class="inputClass"
                      placeholder="https://drive.google.com/file/d/.../view atau https://example.com/brosur.pdf"
                    />
                    <template #help>
                      <p class="mt-1.5 text-xs leading-5 text-gray-500 dark:text-neutral-400">
                        Google Drive: pastikan akses file sudah <b>Anyone with the link</b>. PDF direct dan gambar JPG/PNG/WebP juga bisa.
                      </p>
                    </template>
                  </FieldCard>

                  <div class="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                    <p class="text-xs font-black uppercase tracking-[0.16em] text-gray-500 dark:text-neutral-400">Tipe Preview</p>
                    <div class="mt-2 flex flex-wrap gap-2">
                      <span
                        class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
                        :class="brochureType(item.url) === 'pdf'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
                          : brochureType(item.url) === 'image'
                            ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-neutral-700 dark:text-neutral-300'"
                      >
                        <Icon :icon="brochureTypeIcon(item.url)" class="h-4 w-4" />
                        {{ brochureTypeLabel(item.url) }}
                      </span>

                      <a
                        v-if="isHttpUrl(item.url)"
                        :href="item.url"
                        target="_blank"
                        rel="noopener"
                        class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-600 ring-1 ring-gray-200 transition hover:bg-gray-50 dark:bg-neutral-900 dark:text-neutral-300 dark:ring-neutral-700 dark:hover:bg-neutral-800"
                      >
                        <Icon icon="lucide:external-link" class="h-4 w-4" />
                        Buka Link
                      </a>
                    </div>
                  </div>
                </div>

                <div class="overflow-hidden rounded-[24px] border border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-800/60">
                  <div class="border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
                    <p class="text-sm font-black text-gray-900 dark:text-white">Preview Brosur</p>
                  </div>

                  <div class="p-3">
                    <div
                      v-if="brochureType(item.url) === 'pdf' && brochureEmbedUrl(item.url)"
                      class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-neutral-800"
                    >
                      <iframe
                        :src="brochureEmbedUrl(item.url)"
                        class="h-[420px] w-full bg-white"
                        loading="lazy"
                        referrerpolicy="no-referrer"
                      ></iframe>
                    </div>

                    <div
                      v-else-if="brochureType(item.url) === 'image'"
                      class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-neutral-800"
                    >
                      <img
                        :src="item.url"
                        :alt="item.title || `Brosur ${index + 1}`"
                        class="max-h-[420px] w-full object-contain"
                        loading="lazy"
                      />
                    </div>

                    <div v-else class="grid min-h-[280px] place-items-center rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center dark:border-neutral-700 dark:bg-neutral-900">
                      <div>
                        <Icon icon="lucide:file-question" class="mx-auto h-10 w-10 text-gray-400" />
                        <p class="mt-3 text-sm font-black text-gray-900 dark:text-white">
                          Preview belum tersedia
                        </p>
                        <p class="mt-1 max-w-sm text-xs leading-5 text-gray-500 dark:text-neutral-400">
                          Tempel link Google Drive, PDF direct, atau gambar publik agar preview embed muncul.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- Preview Payload -->
        <!-- Syarat Umum -->
<div v-show="activeTab === 'Syarat Umum'" class="space-y-5">
  <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
    <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div class="flex items-start gap-4">
        <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-500/20">
          <Icon :icon="form.requirements.icon || 'lucide:list-checks'" class="h-5 w-5" />
        </div>

        <div>
          <h3 class="text-lg font-black text-gray-900 dark:text-white">
            Syarat Umum
          </h3>
          <p class="mt-1 max-w-3xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
            Atur icon, judul, dan daftar poin syarat umum yang akan ditampilkan pada halaman pendaftaran.
          </p>
        </div>
      </div>

      <button
        type="button"
        class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
        @click="addRequirementItem"
      >
        <Icon icon="lucide:plus" class="h-4 w-4" />
        Tambah Poin
      </button>
    </div>
  </div>

  <div class="grid gap-4 lg:grid-cols-[0.8fr,1.2fr]">
    <section class="space-y-4 rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <FieldCard label="Icon Section" help="Pilih icon yang paling sesuai untuk bagian syarat umum.">
        <div class="grid gap-3 sm:grid-cols-[72px,minmax(0,1fr)]">
          <div class="grid h-[72px] place-items-center rounded-3xl bg-green-50 text-green-700 ring-1 ring-green-100 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-900/40">
            <Icon :icon="form.requirements.icon || 'lucide:list-checks'" class="h-8 w-8" />
          </div>

          <select
            v-model="form.requirements.icon"
            :class="inputClass"
          >
            <option
              v-for="item in requirementIconOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </option>
          </select>
        </div>
      </FieldCard>

      <FieldCard label="Judul Section">
        <input
          v-model.trim="form.requirements.title"
          type="text"
          :class="inputClass"
          placeholder="Syarat Umum Pendaftaran"
        />
      </FieldCard>

      <div class="rounded-[24px] border border-green-100 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/10">
        <div class="flex items-start gap-3">
          <Icon icon="lucide:info" class="mt-0.5 h-5 w-5 shrink-0 text-green-700 dark:text-green-300" />
          <p class="text-sm leading-6 text-green-800 dark:text-green-200">
            Poin kosong tidak akan disimpan ke Firebase. Gunakan kalimat singkat agar mudah dibaca oleh wali santri.
          </p>
        </div>
      </div>
    </section>

    <section class="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div class="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 dark:border-neutral-800 md:flex-row md:items-center md:justify-between">
        <div>
          <h4 class="text-base font-black text-gray-950 dark:text-white">
            Daftar Poin Syarat
          </h4>
          <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            Total {{ form.requirements.items.length }} poin. Bisa diedit, diurutkan, atau dihapus.
          </p>
        </div>

        <button
          type="button"
          class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-green-200 bg-white px-3 text-xs font-bold text-green-700 transition hover:bg-green-50 dark:border-green-900/40 dark:bg-neutral-900 dark:text-green-300 dark:hover:bg-green-900/10"
          @click="addRequirementItem"
        >
          <Icon icon="lucide:plus" class="h-4 w-4" />
          Tambah
        </button>
      </div>

      <div class="space-y-3 p-4">
        <article
          v-for="(item, index) in form.requirements.items"
          :key="item.id"
          class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50"
        >
          <div class="flex gap-3">
            <div class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-sm font-black text-green-700 ring-1 ring-gray-200 dark:bg-neutral-900 dark:text-green-300 dark:ring-neutral-700">
              {{ index + 1 }}
            </div>

            <div class="min-w-0 flex-1">
              <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                Poin {{ index + 1 }}
              </label>

              <textarea
                v-model.trim="item.text"
                rows="3"
                :class="textareaClass"
                placeholder="Contoh: Calon santri merupakan lulusan SD/MI atau sederajat."
              ></textarea>
            </div>

            <div class="flex shrink-0 flex-col gap-2">
              <button
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                :disabled="index === 0"
                @click="moveRequirementItem(index, -1)"
              >
                <Icon icon="lucide:arrow-up" class="h-4 w-4" />
              </button>

              <button
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                :disabled="index === form.requirements.items.length - 1"
                @click="moveRequirementItem(index, 1)"
              >
                <Icon icon="lucide:arrow-down" class="h-4 w-4" />
              </button>

              <button
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
                @click="removeRequirementItem(index)"
              >
                <Icon icon="lucide:trash-2" class="h-4 w-4" />
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</div>
      </template>
    </div>

    <!-- Bottom save bar -->
        <div class="fixed inset-x-3 bottom-3 z-[90] xl:left-[370px] xl:right-8">
      <div class="flex flex-col gap-3 rounded-[24px] border border-gray-200 bg-white p-3 shadow-[0_-18px_50px_-28px_rgba(15,23,42,0.35)] dark:border-neutral-800 dark:bg-neutral-950 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <div
            class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl"
            :class="saving 
              ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300'
              : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'"
          >
            <Icon
              :icon="saving  ? 'lucide:loader-circle' : 'lucide:badge-check'"
              class="h-5 w-5"
              :class="saving  ? 'animate-spin' : ''"
            />
          </div>

          <div class="min-w-0">
            <p class="text-sm font-black text-gray-900 dark:text-white">
              {{ saving ? 'Menyimpan perubahan...' : 'Perubahan siap disimpan' }}
            </p>
          </div>
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <button
            type="button"
            class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            :disabled="saving"
            @click="resetToDefault"
          >
            <Icon icon="lucide:rotate-ccw" class="h-4 w-4" />
            <span class="hidden sm:inline">Isi Default</span>
            <span class="sm:hidden">Default</span>
          </button>

          <button
            type="button"
            class="inline-flex h-11 min-w-[120px] items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="saving"
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
import { computed, defineComponent, h, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { onValue, ref as dbRef, serverTimestamp, update } from 'firebase/database'
import { useNuxtApp, useRuntimeConfig } from 'nuxt/app'

type TimelineConfig = {
  registration: string
  selection: string
  announcement: string

  registrationStart: string
  registrationEnd: string
  selectionAt: string
  announcementAt: string
}

type RequirementItem = {
  id: string
  text: string
}

type RequirementsConfig = {
  icon: string
  title: string
  items: RequirementItem[]
}

type RegistrationEditorConfig = {
  year: number
  title: string
  subtitle: string
  institutionName: string
  institutionShortName: string
  description: string
  email: string
  whatsapp: string
  brochures: string[]
  timeline: TimelineConfig
  requirements: RequirementsConfig
  isClosed?: boolean
  autoCloseEnabled?: boolean
  autoCloseAt?: string | number
  notice?: string
}

type BrochureDraft = {
  id: string
  title: string
  url: string
}

const tabs = [
  { key: 'Umum', label: 'Umum', icon: 'lucide:layout-template' },
  { key: 'Status', label: 'Status', icon: 'lucide:lock-keyhole' },
  { key: 'Timeline', label: 'Timeline', icon: 'lucide:calendar-check' },
  { key: 'Kontak', label: 'Kontak', icon: 'lucide:headphones' },
  { key: 'Brosur', label: 'Brosur', icon: 'lucide:files' },
  { key: 'Syarat Umum', label: 'Syarat Umum', icon: 'lucide:list-checks' }
] as const

type TabKey = typeof tabs[number]['key']

const activeTab = ref<TabKey>('Umum')
const loading = ref(true)
const saving = ref(false)
const savedNote = ref('')
const errNote = ref('')

const errorModal = reactive({
  show: false,
  title: '',
  message: ''
})

const config = useRuntimeConfig()
const { $realtimeDb } = useNuxtApp() as any

const clientName = computed(() => String(config.public.clientName || 'alinayah'))
const firebasePath = computed(() => `${clientName.value}/form/pendaftaran`)

const defaults: RegistrationEditorConfig = {
  year: new Date().getFullYear(),
  title: 'Formulir Pendaftaran Santri Baru',
  subtitle: 'Isi data secara benar. Draf tersimpan otomatis di perangkat Anda.',
  institutionName: 'Lembaga Pendidikan',
  institutionShortName: 'Lembaga',
  description: 'Daftar peserta didik baru secara online.',
  email: '',
  whatsapp: '',
  brochures: [],
  timeline: {
    registration: '-',
    selection: '-',
    announcement: '-',
    registrationStart: '',
    registrationEnd: '',
    selectionAt: '',
    announcementAt: ''
    },
  requirements: {
    icon: 'lucide:list-checks',
    title: 'Syarat Umum Pendaftaran',
    items: [
        { id: 'req-default-1', text: 'Calon santri merupakan lulusan SD/MI atau sederajat.' },
        { id: 'req-default-2', text: 'Mengisi formulir pendaftaran dengan data yang benar dan lengkap.' },
        { id: 'req-default-3', text: 'Menyiapkan dokumen pendukung seperti KK, Akta Kelahiran, dan NISN.' }
    ]
  },
  isClosed: false,
  autoCloseEnabled: false,
  autoCloseAt: '',
  notice: ''
}

const form = reactive<RegistrationEditorConfig>(clone(defaults))
const brochureDrafts = reactive<BrochureDraft[]>([])

let unsub: null | (() => void) = null

const labelClass =
  'mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500'

const inputClass =
  'block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-70 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500 dark:disabled:bg-neutral-800'

const textareaClass =
  'block w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500'

const requirementIconOptions = [
  { label: 'Checklist', value: 'lucide:list-checks' },
  { label: 'Badge Check', value: 'lucide:badge-check' },
  { label: 'Clipboard Check', value: 'lucide:clipboard-check' },
  { label: 'File Check', value: 'lucide:file-check-2' },
  { label: 'Shield Check', value: 'lucide:shield-check' },
  { label: 'Book Open', value: 'lucide:book-open-check' },
  { label: 'User Check', value: 'lucide:user-check' },
  { label: 'Graduation Cap', value: 'lucide:graduation-cap' },
  { label: 'Info', value: 'lucide:info' },
  { label: 'Sparkles', value: 'lucide:sparkles' }
]

const cleanBrochures = computed(() => {
  return brochureDrafts
    .map((item) => String(item.url || '').trim())
    .filter(Boolean)
})

const cleanRequirementItems = computed(() => {
  return form.requirements.items
    .map((item) => ({
      id: item.id || createId(),
      text: String(item.text || '').trim()
    }))
    .filter((item) => item.text)
})

const normalizedWhatsapp = computed(() => normalizeWhatsappValue(form.whatsapp))
const whatsappPreview = computed(() => {
  const value = normalizedWhatsapp.value
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value
  return `https://wa.me/${value}`
})

const timelineDisplay = computed(() => {
  return {
    registration: formatDateTimeRangeDisplay(
      form.timeline.registrationStart,
      form.timeline.registrationEnd
    ),
    selection: formatDateTimeDisplay(form.timeline.selectionAt),
    announcement: formatDateTimeDisplay(form.timeline.announcementAt)
  }
})

onMounted(() => {
  subscribe()
})

onBeforeUnmount(() => {
  if (unsub) unsub()
})

function subscribe() {
  if (!$realtimeDb) {
    loading.value = false
    showErrorModal('Firebase belum aktif', 'Instance $realtimeDb tidak ditemukan. Pastikan plugin Firebase sudah terpasang.')
    return
  }

  loading.value = true
  errNote.value = ''

  unsub = onValue(
    dbRef($realtimeDb, firebasePath.value),
    (snap) => {
      const val = snap.val()

      if (val && typeof val === 'object') {
        assignForm(normalizeFirebaseConfig(val))
      } else {
        assignForm(defaults)
      }

      loading.value = false
    },
    (error) => {
      loading.value = false
      errNote.value = error?.message || 'Gagal membaca konfigurasi pendaftaran.'
      showErrorModal('Gagal membaca data', errNote.value)
    }
  )
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

function normalizeFirebaseConfig(value: any): RegistrationEditorConfig {
  return {
    year: Number(value.year) || defaults.year,
    title: value.title || defaults.title,
    subtitle: value.subtitle || defaults.subtitle,
    institutionName: value.institutionName || defaults.institutionName,
    institutionShortName: value.institutionShortName || defaults.institutionShortName,
    description: value.description || defaults.description,
    email: value.email || defaults.email,
    whatsapp: normalizeWhatsappValue(value.whatsapp || defaults.whatsapp),
    brochures: normalizeBrochures(value.brochures),
    timeline: {
  registration: value.timeline?.registration || defaults.timeline.registration,
  selection: value.timeline?.selection || defaults.timeline.selection,
  announcement: value.timeline?.announcement || defaults.timeline.announcement,

  registrationStart: normalizeDateTimeLocal(value.timeline?.registrationStart),
  registrationEnd: normalizeDateTimeLocal(value.timeline?.registrationEnd),
  selectionAt: normalizeDateTimeLocal(value.timeline?.selectionAt),
  announcementAt: normalizeDateTimeLocal(value.timeline?.announcementAt)
},
    requirements: normalizeRequirements(value.requirements),
    isClosed: !!value.isClosed,
    autoCloseEnabled: !!value.autoCloseEnabled,
    autoCloseAt: value.autoCloseAt || '',
    notice: value.notice || ''
  }
}

function normalizeRequirements(value: any): RequirementsConfig {
  const rawItems = Array.isArray(value?.items)
    ? value.items
    : Array.isArray(value)
      ? value
      : defaults.requirements.items

  const items = rawItems
    .map((item: any) => {
      if (typeof item === 'string') {
        return {
          id: createId(),
          text: item.trim()
        }
      }

      return {
        id: String(item?.id || createId()),
        text: String(item?.text || '').trim()
      }
    })
    .filter((item: RequirementItem) => item.text)

  return {
    icon: String(value?.icon || defaults.requirements.icon),
    title: String(value?.title || defaults.requirements.title),
    items: items.length ? items : clone(defaults.requirements.items)
  }
}

function normalizeBrochures(value: any): string[] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (typeof item === 'string') return item
      if (item && typeof item === 'object') return item.url || item.embedUrl || ''
      return ''
    })
    .map((url) => String(url || '').trim())
    .filter(Boolean)
}

function assignForm(next: RegistrationEditorConfig) {
  Object.assign(form, clone(next))

  brochureDrafts.splice(
    0,
    brochureDrafts.length,
    ...normalizeBrochures(next.brochures).map((url, index) => ({
      id: createId(),
      title: `Brosur ${index + 1}`,
      url
    }))
  )
}

function normalizeDateTimeLocal(value: any) {
  const raw = String(value || '').trim()
  if (!raw) return ''

  // Sudah format input datetime-local: 2026-05-06T10:30
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(raw)) {
    return raw.slice(0, 16)
  }

  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) return ''

  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const date = String(parsed.getDate()).padStart(2, '0')
  const hour = String(parsed.getHours()).padStart(2, '0')
  const minute = String(parsed.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${date}T${hour}:${minute}`
}

function formatDateTimeDisplay(value: string) {
  const raw = String(value || '').trim()
  if (!raw) return '-'

  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(parsed)
}

function formatDateTimeRangeDisplay(start: string, end: string) {
  const startText = formatDateTimeDisplay(start)
  const endText = formatDateTimeDisplay(end)

  if (startText === '-' && endText === '-') return '-'
  if (startText !== '-' && endText === '-') return `Mulai ${startText}`
  if (startText === '-' && endText !== '-') return `Sampai ${endText}`

  return `${startText} - ${endText}`
}

function buildPayload() {
  return {
    year: Number(form.year) || defaults.year,
    title: String(form.title || '').trim(),
    subtitle: String(form.subtitle || '').trim(),
    institutionName: String(form.institutionName || '').trim(),
    institutionShortName: String(form.institutionShortName || '').trim(),
    description: String(form.description || '').trim(),
    email: String(form.email || '').trim(),
    whatsapp: normalizedWhatsapp.value,
    brochures: cleanBrochures.value,
    timeline: {
    registration: timelineDisplay.value.registration,
    selection: timelineDisplay.value.selection,
    announcement: timelineDisplay.value.announcement,

    registrationStart: String(form.timeline.registrationStart || '').trim(),
    registrationEnd: String(form.timeline.registrationEnd || '').trim(),
    selectionAt: String(form.timeline.selectionAt || '').trim(),
    announcementAt: String(form.timeline.announcementAt || '').trim()
    },
    requirements: {
        icon: String(form.requirements.icon || 'lucide:list-checks').trim(),
        title: String(form.requirements.title || '').trim() || 'Syarat Umum Pendaftaran',
        items: cleanRequirementItems.value
    },
    isClosed: !!form.isClosed,
    autoCloseEnabled: !!form.autoCloseEnabled,
    autoCloseAt: form.autoCloseEnabled ? String(form.autoCloseAt || '').trim() : '',
    notice: String(form.notice || '').trim()
  }
}

async function save() {
  const message = validateBeforeSave()

  if (message) {
    showErrorModal('Data belum valid', message)
    return
  }

  try {
    saving.value = true
    errNote.value = ''

    await update(dbRef($realtimeDb, firebasePath.value), {
      ...buildPayload(),
      updatedAt: serverTimestamp()
    })

    savedNote.value = 'Konfigurasi pendaftaran berhasil disimpan.'
    setTimeout(() => {
      savedNote.value = ''
    }, 1800)
  } catch (error: any) {
    errNote.value = error?.message || 'Gagal menyimpan konfigurasi pendaftaran.'
    showErrorModal('Gagal menyimpan', errNote.value)
  } finally {
    saving.value = false
  }
}

function validateBeforeSave() {
  if (!$realtimeDb) return 'Firebase Realtime Database belum tersedia.'

  if (!Number(form.year) || Number(form.year) < 2020 || Number(form.year) > 2100) {
    activeTab.value = 'Umum'
    return 'Tahun PPDB harus diisi antara 2020 sampai 2100.'
  }

  if (!String(form.institutionName || '').trim()) {
    activeTab.value = 'Umum'
    return 'Nama lengkap lembaga wajib diisi.'
  }

  if (!String(form.institutionShortName || '').trim()) {
    activeTab.value = 'Umum'
    return 'Nama pendek lembaga wajib diisi.'
  }

  if (!String(form.title || '').trim()) {
    activeTab.value = 'Umum'
    return 'Judul halaman wajib diisi.'
  }

  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(form.email))) {
    activeTab.value = 'Kontak'
    return 'Format email panitia belum valid.'
  }

  if (form.whatsapp && !normalizedWhatsapp.value) {
    activeTab.value = 'Kontak'
    return 'Nomor WhatsApp belum valid. Gunakan format 08..., 628..., atau link wa.me.'
  }

  if (form.autoCloseEnabled && !String(form.autoCloseAt || '').trim()) {
    activeTab.value = 'Status'
    return 'Tanggal tutup otomatis wajib diisi jika fitur tutup otomatis aktif.'
  }

  if (form.timeline.registrationStart && form.timeline.registrationEnd) {
  const start = new Date(form.timeline.registrationStart).getTime()
  const end = new Date(form.timeline.registrationEnd).getTime()

  if (!Number.isNaN(start) && !Number.isNaN(end) && end < start) {
    activeTab.value = 'Timeline'
    return 'Akhir pendaftaran tidak boleh lebih awal dari mulai pendaftaran.'
  }
}

const timelineDates = [
  form.timeline.registrationStart,
  form.timeline.registrationEnd,
  form.timeline.selectionAt,
  form.timeline.announcementAt
]

const invalidTimeline = timelineDates.some((item) => {
  if (!item) return false
  return Number.isNaN(Date.parse(String(item)))
})

if (invalidTimeline) {
  activeTab.value = 'Timeline'
  return 'Ada input jadwal yang belum valid.'
}

  if (form.autoCloseEnabled && Number.isNaN(Date.parse(String(form.autoCloseAt)))) {
    activeTab.value = 'Status'
    return 'Tanggal tutup otomatis belum valid.'
  }

  const invalidBrochure = brochureDrafts.find((item) => {
    const url = String(item.url || '').trim()
    return url && !isAcceptableBrochureUrl(url)
  })

  if (invalidBrochure) {
    activeTab.value = 'Brosur'
    return 'Ada link brosur yang belum valid. Gunakan link http/https atau path lokal yang diawali /.'
  }

  return ''
}

function resetToDefault() {
  assignForm(defaults)
  activeTab.value = 'Umum'

  savedNote.value = 'Form editor dikembalikan ke default. Klik Simpan jika ingin menyimpan default ke Firebase.'
  setTimeout(() => {
    savedNote.value = ''
  }, 2200)
}

function addBrochure() {
  brochureDrafts.push({
    id: createId(),
    title: `Brosur ${brochureDrafts.length + 1}`,
    url: ''
  })
}

function removeBrochure(index: number) {
  brochureDrafts.splice(index, 1)
}

function moveBrochure(index: number, direction: number) {
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= brochureDrafts.length) return

  const current = brochureDrafts[index]
  const target = brochureDrafts[targetIndex]

  if (!current || !target) return

  brochureDrafts[index] = target
  brochureDrafts[targetIndex] = current
}

function addRequirementItem() {
  form.requirements.items.push({
    id: createId(),
    text: ''
  })
}

function removeRequirementItem(index: number) {
  form.requirements.items.splice(index, 1)

  if (!form.requirements.items.length) {
    addRequirementItem()
  }
}

function moveRequirementItem(index: number, direction: number) {
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= form.requirements.items.length) return

  const current = form.requirements.items[index]
  const target = form.requirements.items[targetIndex]

  if (!current || !target) return

  form.requirements.items[index] = target
  form.requirements.items[targetIndex] = current
}

function previewTitle(url: string, index: number) {
  if (!url) return `Brosur ${index + 1}`

  const driveId = getGoogleDriveId(url)
  if (driveId) return `Google Drive Brosur ${index + 1}`

  try {
    const u = new URL(url)
    const last = u.pathname.split('/').filter(Boolean).pop()
    return last ? decodeURIComponent(last) : `Brosur ${index + 1}`
  } catch {
    return `Brosur ${index + 1}`
  }
}

function brochureType(url: string): 'pdf' | 'image' | 'link' | 'empty' {
  const value = String(url || '').trim()
  if (!value) return 'empty'

  if (getGoogleDriveId(value)) return 'pdf'
  if (/\.pdf(\?|#|$)/i.test(value)) return 'pdf'
  if (isImageUrl(value)) return 'image'

  return 'link'
}

function brochureTypeLabel(url: string) {
  const type = brochureType(url)

  if (type === 'pdf') return 'PDF / Embed'
  if (type === 'image') return 'Gambar'
  if (type === 'link') return 'Link'
  return 'Belum diisi'
}

function brochureTypeIcon(url: string) {
  const type = brochureType(url)

  if (type === 'pdf') return 'lucide:file-text'
  if (type === 'image') return 'lucide:image'
  if (type === 'link') return 'lucide:link'
  return 'lucide:file-question'
}

function brochureEmbedUrl(url: string) {
  const value = String(url || '').trim()
  if (!value) return ''

  const driveId = getGoogleDriveId(value)
  if (driveId) return `https://drive.google.com/file/d/${driveId}/preview`

  if (/\.pdf(\?|#|$)/i.test(value)) return value

  return ''
}

function getGoogleDriveId(url: string) {
  const value = String(url || '').trim()

  const patterns = [
    /drive\.google\.com\/file\/d\/([^/]+)/i,
    /drive\.google\.com\/open\?id=([^&]+)/i,
    /drive\.google\.com\/uc\?[^#]*id=([^&]+)/i,
    /docs\.google\.com\/(?:document|presentation|spreadsheets)\/d\/([^/]+)/i
  ]

  for (const pattern of patterns) {
    const match = value.match(pattern)
    if (match?.[1]) return match[1]
  }

  return ''
}

function isImageUrl(url: string) {
  const value = String(url || '').trim()
  if (!value) return false

  if (value.startsWith('/') && !/\.pdf$/i.test(value)) return true
  return /\.(jpg|jpeg|png|webp)(\?|#|$)/i.test(value)
}

function isHttpUrl(url: string) {
  return /^https?:\/\//i.test(String(url || '').trim())
}

function isAcceptableBrochureUrl(url: string) {
  const value = String(url || '').trim()
  if (!value) return true
  return value.startsWith('/') || isHttpUrl(value)
}

function normalizeWhatsappValue(value: string) {
  const raw = String(value || '').trim()
  if (!raw) return ''

  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)/i.test(raw)) {
    return raw
  }

  let digits = raw.replace(/[^\d]/g, '')

  if (!digits) return ''
  if (digits.startsWith('0')) digits = `62${digits.slice(1)}`
  if (digits.startsWith('8')) digits = `62${digits}`

  if (!digits.startsWith('62')) return digits
  if (digits.length < 9) return ''

  return digits
}

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
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

/**
 * Local helper components.
 * Tetap di file ini agar tinggal copy-paste tanpa membuat file tambahan.
 */
const InfoCard = defineComponent({
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    icon: { type: String, default: 'lucide:info' }
  },
  setup(props) {
    return () =>
      h(
        'div',
        {
          class:
            'rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900'
        },
        [
          h('div', { class: 'flex items-start gap-4' }, [
            h(
              'div',
              {
                class:
                  'grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-500/20'
              },
              [h(Icon, { icon: props.icon, class: 'h-5 w-5' })]
            ),
            h('div', { class: 'min-w-0' }, [
              h('h3', { class: 'text-lg font-black text-gray-900 dark:text-white' }, props.title),
              props.subtitle
                ? h('p', { class: 'mt-1 max-w-3xl text-sm leading-6 text-gray-500 dark:text-neutral-400' }, props.subtitle)
                : null
            ])
          ])
        ]
      )
  }
})

const FieldCard = defineComponent({
  props: {
    label: { type: String, required: true },
    help: { type: String, default: '' }
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          class: [
            'rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50',
            attrs.class
          ]
        },
        [
          h('label', { class: labelClass }, props.label),
          slots.default?.(),
          slots.help
            ? slots.help()
            : props.help
              ? h('p', { class: 'mt-1.5 text-xs leading-5 text-gray-500 dark:text-neutral-400' }, props.help)
              : null
        ]
      )
  }
})
</script>