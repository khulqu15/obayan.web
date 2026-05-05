<template>
  <section class="relative overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
    <!-- Header -->
    <div class="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-green-50 via-white to-lime-50 px-5 py-5 dark:border-neutral-800 dark:from-green-950/20 dark:via-neutral-900 dark:to-neutral-900 md:px-6">
      <div class="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-green-300/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-20 left-8 h-40 w-40 rounded-full bg-lime-300/20 blur-3xl"></div>

      <div class="relative z-10">
        <div class="inline-flex items-center gap-2 rounded-full border border-green-100 bg-white/80 px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm backdrop-blur dark:border-green-900/40 dark:bg-neutral-900/70 dark:text-green-300">
          <span class="h-2 w-2 rounded-full bg-green-500"></span>
          Profile Page Editor
        </div>

        <h2 class="mt-4 text-xl font-black tracking-tight text-gray-950 dark:text-white">
          Kelola Halaman Profil Pondok
        </h2>

        <p class="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
          Atur hero, sambutan, visi-misi, sejarah, materi, kitab, struktur, dan tingkatan. Upload gambar masuk Cloudinary, sedangkan link gambar langsung disimpan ke Firebase Realtime Database saat klik Simpan.
        </p>
      </div>

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
      <!-- HERO -->
      <div v-show="activeTab === 'Hero'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Hero Profil
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Atur cover, badge, judul, subjudul, dan tinggi hero halaman profil.
              </p>
            </div>

            <div class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm ring-1 ring-green-100 dark:bg-neutral-900 dark:text-green-300 dark:ring-green-900/40">
              <span class="h-2 w-2 rounded-full bg-green-500"></span>
              JPG / PNG / WebP · Max 5 MB
            </div>
          </div>
        </div>

        <ImageEditorCard
          title="Gambar Cover"
          subtitle="Saran rasio lebar untuk hero halaman."
          image-key="hero.cover"
          :src="form.hero.cover"
          :mode="mediaMode['hero.cover']"
          :draft="mediaDraft['hero.cover']"
          :progress="progress['hero.cover']"
          :busy="mediaBusy"
          input-id="profile-hero-cover-upload"
          @change-mode="(value) => (mediaMode['hero.cover'] = value)"
          @update-draft="(value) => (mediaDraft['hero.cover'] = value)"
          @upload="(event) => uploadImageField(event, 'hero.cover')"
          @apply-url="applyImageUrl('hero.cover')"
          @remove="removeImageField('hero.cover')"
        />

        <div class="grid gap-4 md:grid-cols-2">
          <BaseInput
            v-model="form.hero.badge"
            label="Badge"
            placeholder="Profil Pondok Pesantren Al-Inayah"
          />

          <BaseInput
            v-model="form.hero.title"
            label="Judul Utama"
            placeholder="Mencetak berilmu, beradab, dan mandiri"
          />

          <BaseTextarea
            v-model="form.hero.subtitle"
            class="md:col-span-2"
            label="Subjudul"
            placeholder="Berlandaskan Al-Qur’an dan Sunnah..."
            :rows="4"
          />

          <BaseInput
            v-model="form.hero.heightSm"
            label="Tinggi Mobile"
            placeholder="44vh"
          />

          <BaseInput
            v-model="form.hero.heightLg"
            label="Tinggi Desktop"
            placeholder="56vh"
          />
        </div>
      </div>

      <!-- SAMBUTAN -->
      <div v-show="activeTab === 'Sambutan'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white">
              Sambutan Pengasuh
            </h3>
            <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
              Atur foto, judul sambutan, isi sambutan, dan tanda tangan pengasuh.
            </p>
          </div>
        </div>

        <ImageEditorCard
          title="Foto Pengasuh"
          subtitle="Gunakan foto pengasuh/pimpinan pondok."
          image-key="sambutan.img"
          :src="form.sambutan.img"
          :mode="mediaMode['sambutan.img']"
          :draft="mediaDraft['sambutan.img']"
          :progress="progress['sambutan.img']"
          :busy="mediaBusy"
          input-id="profile-sambutan-img-upload"
          @change-mode="(value) => (mediaMode['sambutan.img'] = value)"
          @update-draft="(value) => (mediaDraft['sambutan.img'] = value)"
          @upload="(event) => uploadImageField(event, 'sambutan.img')"
          @apply-url="applyImageUrl('sambutan.img')"
          @remove="removeImageField('sambutan.img')"
        />

        <div class="grid gap-4 md:grid-cols-2">
          <BaseInput
            v-model="form.sambutan.title"
            label="Judul Sambutan"
            placeholder="Sambutan Pengasuh"
          />

          <BaseInput
            v-model="form.sambutan.signer"
            label="Penutup / Tanda Tangan"
            placeholder="— KH. Izud"
          />

          <BaseTextarea
            v-model="form.sambutan.content"
            class="md:col-span-2"
            label="Isi Sambutan"
            :rows="7"
            placeholder="Isi sambutan pengasuh..."
          />
        </div>
      </div>

      <!-- VISI MISI -->
      <div v-show="activeTab === 'Visi & Misi'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white">
              Visi, Misi, dan Motto
            </h3>
            <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
              Atur visi utama, daftar misi, dan motto pondok.
            </p>
          </div>
        </div>

        <BaseTextarea
          v-model="form.visi"
          label="Visi"
          :rows="4"
          placeholder="Tuliskan visi pondok..."
        />

        <ListEditor
          title="Daftar Misi"
          empty-text="Belum ada misi."
          add-label="Tambah Misi"
          :items="form.misi"
          placeholder="Misi baru"
          @add="form.misi.push('Misi baru')"
          @move="(index, direction) => move(form.misi, index, direction)"
          @remove="(index) => form.misi.splice(index, 1)"
        />

        <BaseInput
          v-model="form.motto"
          label="Motto"
          placeholder="Berilmu • Beradab • Mandiri"
        />
      </div>

      <!-- SEJARAH -->
      <div v-show="activeTab === 'Sejarah'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Sejarah Pondok
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Tambahkan paragraf sejarah dan susun urutannya.
              </p>
            </div>

            <button
              type="button"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
              @click="form.sejarah.push('Paragraf baru…')"
            >
              <Icon icon="lucide:plus" class="h-4 w-4" />
              Tambah Paragraf
            </button>
          </div>
        </div>

        <div class="space-y-4">
          <article
            v-for="(item, index) in form.sejarah"
            :key="`sejarah-${index}`"
            class="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="mb-3 flex items-center justify-between gap-3">
              <h4 class="text-sm font-black text-gray-900 dark:text-white">
                Paragraf {{ index + 1 }}
              </h4>

              <ActionButtons
                :index="index"
                :total="form.sejarah.length"
                @move="(direction) => move(form.sejarah, index, direction)"
                @remove="form.sejarah.splice(index, 1)"
              />
            </div>

            <textarea
              v-model.trim="form.sejarah[index]"
              rows="4"
              class="block w-full resize-y rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:focus:bg-neutral-900"
            ></textarea>
          </article>

          <EmptyState
            v-if="!form.sejarah.length"
            icon="lucide:file-text"
            title="Belum ada sejarah"
            description="Tambahkan paragraf sejarah pondok."
          />
        </div>
      </div>

      <!-- MATERI -->
      <div v-show="activeTab === 'Materi'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white">
              Daftar Materi
            </h3>
            <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
              Tambahkan materi pembelajaran yang ditampilkan di halaman profil.
            </p>
          </div>
        </div>

        <ListEditor
          title="Materi"
          empty-text="Belum ada materi."
          add-label="Tambah Materi"
          :items="form.materi"
          placeholder="Materi baru"
          @add="form.materi.push('Materi baru')"
          @move="(index, direction) => move(form.materi, index, direction)"
          @remove="(index) => form.materi.splice(index, 1)"
        />
      </div>

      <!-- KITAB -->
      <div v-show="activeTab === 'Kitab'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white">
              Daftar Kitab
            </h3>
            <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
              Tambahkan kitab yang menjadi bahan pembelajaran.
            </p>
          </div>
        </div>

        <ListEditor
          title="Kitab"
          empty-text="Belum ada kitab."
          add-label="Tambah Kitab"
          :items="form.kitab"
          placeholder="Nama kitab"
          @add="form.kitab.push('Nama kitab')"
          @move="(index, direction) => move(form.kitab, index, direction)"
          @remove="(index) => form.kitab.splice(index, 1)"
        />
      </div>

      <!-- STRUKTUR -->
      <div v-show="activeTab === 'Struktur'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Struktur Pengurus
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Tambahkan data pengasuh, pengurus, atau struktur organisasi pondok.
              </p>
            </div>

            <button
              type="button"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
              @click="addStruktur"
            >
              <Icon icon="lucide:user-plus" class="h-4 w-4" />
              Tambah Anggota
            </button>
          </div>
        </div>

        <div class="grid gap-5">
          <article
            v-for="(item, index) in form.struktur"
            :key="`struktur-${index}`"
            class="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
              <div class="min-w-0">
                <h4 class="truncate text-sm font-black text-gray-900 dark:text-white">
                  {{ item.nama || `Anggota ${index + 1}` }}
                </h4>
                <p class="mt-0.5 truncate text-xs text-gray-500 dark:text-neutral-400">
                  {{ item.jabatan || 'Jabatan belum diisi' }}
                </p>
              </div>

              <ActionButtons
                :index="index"
                :total="form.struktur.length"
                @move="(direction) => moveStruktur(index, direction)"
                @remove="removeStruktur(index)"
              />
            </div>

            <div class="grid gap-5 p-4 lg:grid-cols-[0.95fr,1.05fr]">
              <ImageEditorCard
                :title="`Foto Anggota ${index + 1}`"
                subtitle="Upload foto atau gunakan link gambar."
                :image-key="`struktur.${index}.img`"
                :src="item.img"
                :mode="mediaMode[`struktur.${index}.img`]"
                :draft="mediaDraft[`struktur.${index}.img`]"
                :progress="progress[`struktur.${index}.img`]"
                :busy="mediaBusy"
                :input-id="`struktur-img-upload-${index}`"
                @change-mode="(value) => (mediaMode[`struktur.${index}.img`] = value)"
                @update-draft="(value) => (mediaDraft[`struktur.${index}.img`] = value)"
                @upload="(event) => uploadImageField(event, `struktur.${index}.img`)"
                @apply-url="applyImageUrl(`struktur.${index}.img`)"
                @remove="removeImageField(`struktur.${index}.img`)"
              />

              <div class="grid content-start gap-4">
                <BaseInput
                  v-model="item.nama"
                  label="Nama"
                  placeholder="Nama pengurus"
                />

                <BaseInput
                  v-model="item.jabatan"
                  label="Jabatan"
                  placeholder="Pengasuh / Ketua / Sekretaris"
                />
              </div>
            </div>
          </article>

          <EmptyState
            v-if="!form.struktur.length"
            icon="lucide:users"
            title="Belum ada struktur"
            description="Tambahkan anggota struktur pengurus."
          />
        </div>
      </div>

      <!-- TINGKATAN -->
      <div v-show="activeTab === 'Tingkatan'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Tingkatan Pendidikan
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Atur jenjang atau kategori pendidikan yang tersedia.
              </p>
            </div>

            <button
              type="button"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
              @click="form.tingkatan.push({ title: 'Ibtidaiyah', desc: 'Deskripsi tingkatan...', icon: 'ph:book' })"
            >
              <Icon icon="lucide:plus" class="h-4 w-4" />
              Tambah Tingkatan
            </button>
          </div>
        </div>

        <div class="grid gap-5">
          <article
            v-for="(item, index) in form.tingkatan"
            :key="`tingkatan-${index}`"
            class="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
              <div class="flex min-w-0 items-center gap-3">
                <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <Icon :icon="item.icon || 'ph:book'" class="h-5 w-5" />
                </div>
                <div class="min-w-0">
                  <h4 class="truncate text-sm font-black text-gray-900 dark:text-white">
                    {{ item.title || `Tingkatan ${index + 1}` }}
                  </h4>
                  <p class="mt-0.5 truncate text-xs text-gray-500 dark:text-neutral-400">
                    {{ item.desc || 'Deskripsi belum diisi' }}
                  </p>
                </div>
              </div>

              <ActionButtons
                :index="index"
                :total="form.tingkatan.length"
                @move="(direction) => move(form.tingkatan, index, direction)"
                @remove="form.tingkatan.splice(index, 1)"
              />
            </div>

            <div class="grid gap-4 p-4 md:grid-cols-3">
              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Icon
                </label>
                <button
                  type="button"
                  class="flex h-12 w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="openIconPicker({ index })"
                >
                  <span class="inline-flex min-w-0 items-center gap-2">
                    <Icon :icon="item.icon || 'ph:book'" class="h-5 w-5 shrink-0" />
                    <span class="truncate">{{ item.icon || 'Pilih Icon' }}</span>
                  </span>
                  <Icon icon="lucide:chevron-down" class="h-4 w-4 shrink-0 text-gray-400" />
                </button>
              </div>

              <BaseInput
                v-model="item.title"
                label="Judul"
                placeholder="Ibtidaiyah"
              />

              <BaseInput
                v-model="item.desc"
                label="Deskripsi"
                placeholder="Fokus adab, tahsin, pondasi diniyah"
              />
            </div>
          </article>

          <EmptyState
            v-if="!form.tingkatan.length"
            icon="lucide:school"
            title="Belum ada tingkatan"
            description="Tambahkan tingkatan pendidikan."
          />
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
            @click="resetToDefault"
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

    <!-- Icon Picker Modal -->
    <Teleport to="body">
      <div
        v-if="iconModal.show"
        class="fixed inset-0 z-[1002] overflow-y-auto bg-black/45 px-4 py-20 backdrop-blur-sm"
        @click.self="closeIconPicker"
      >
        <div class="mx-auto w-full max-w-4xl overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
          <div class="flex items-start justify-between gap-3 border-b border-gray-200 px-5 py-4 dark:border-neutral-800">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Pilih Icon
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                Pilih icon untuk tingkatan pendidikan.
              </p>
            </div>

            <button
              type="button"
              class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              @click="closeIconPicker"
            >
              <Icon icon="lucide:x" class="h-4 w-4" />
            </button>
          </div>

          <div class="space-y-4 p-5">
            <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div class="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                <button
                  v-for="tab in iconModal.tabs"
                  :key="tab"
                  type="button"
                  class="rounded-xl px-4 py-2 text-xs font-bold transition"
                  :class="iconModal.activeTab === tab
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                    : 'text-gray-500 dark:text-neutral-300'"
                  @click="setIconTab(tab)"
                >
                  {{ tab }}
                </button>
              </div>

              <div class="flex flex-1 gap-2 md:max-w-xl">
                <input
                  v-model.trim="iconModal.query"
                  type="text"
                  placeholder="Cari icon, mis. book, school, leaf"
                  class="h-11 flex-1 rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  @input="onSearchInput"
                  @keydown.enter.prevent="searchOnline(true)"
                />

                <button
                  v-if="iconModal.allowOnline"
                  type="button"
                  class="inline-flex h-11 items-center justify-center rounded-2xl bg-green-600 px-4 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
                  :disabled="iconModal.loading"
                  @click="searchOnline()"
                >
                  {{ iconModal.loading ? 'Mencari…' : 'Cari Online' }}
                </button>
              </div>
            </div>

            <div class="max-h-[420px] overflow-auto rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-950/40">
              <div class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                <button
                  v-for="name in iconModal.visible"
                  :key="name"
                  type="button"
                  class="group flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-3 text-xs transition hover:-translate-y-0.5 hover:bg-green-50 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-green-900/10"
                  @click="chooseIcon(name)"
                >
                  <Icon :icon="name" width="26" height="26" />
                  <span class="w-full truncate text-center" :title="name">{{ name }}</span>
                </button>
              </div>

              <p v-if="!iconModal.visible.length" class="py-10 text-center text-sm text-gray-500 dark:text-neutral-400">
                Tidak ada icon.
              </p>
            </div>

            <div
              v-if="iconModal.allowOnline && iconModal.total > iconModal.limit"
              class="flex items-center justify-between text-xs text-gray-600 dark:text-neutral-300"
            >
              <span>
                Menampilkan {{ Math.min(iconModal.total, iconModal.start + 1) }}–{{ Math.min(iconModal.total, iconModal.start + iconModal.limit) }}
                dari {{ iconModal.total }}
              </span>

              <div class="inline-flex gap-2">
                <button
                  type="button"
                  class="rounded-xl border border-gray-200 px-3 py-2 font-bold disabled:opacity-50 dark:border-neutral-700"
                  :disabled="iconModal.start === 0 || iconModal.loading"
                  @click="prevPage"
                >
                  Prev
                </button>

                <button
                  type="button"
                  class="rounded-xl border border-gray-200 px-3 py-2 font-bold disabled:opacity-50 dark:border-neutral-700"
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
    </Teleport>

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
import { computed, defineComponent, h, reactive, ref, watch } from 'vue'
import { useWeb } from '~/composables/data/useWeb'
import { useCloudinaryUpload } from '~/composables/useCloudinaryUpload'

type Struktur = {
  nama: string
  jabatan: string
  img: string
  imgPublicId?: string | null
}

type Tingkatan = {
  title: string
  desc: string
  icon: string
}

type Shape = {
  hero: {
    cover: string
    coverPublicId?: string | null
    badge: string
    title: string
    subtitle: string
    heightSm: string
    heightLg: string
  }
  sambutan: {
    img: string
    imgPublicId?: string | null
    title: string
    content: string
    signer: string
  }
  visi: string
  misi: string[]
  motto: string
  sejarah: string[]
  materi: string[]
  kitab: string[]
  struktur: Struktur[]
  tingkatan: Tingkatan[]
}

type MediaMode = 'upload' | 'url'
type IconTab = 'Local' | 'Online'
type IconTarget = { index: number }

defineOptions({ name: 'EditorProfilePages' })

const props = defineProps<{
  section: {
    id: string
    key: string
    props?: Partial<Shape>
  }
  pagePath?: string
  web?: ReturnType<typeof useWeb> | any
}>()

const web = props.web || useWeb()

function normalizePath(path?: string) {
  const raw = path || '/profile'
  return web?.normalizePath ? web.normalizePath(String(raw)) : String(raw)
}

watch(
  () => props.pagePath,
  (pagePath) => {
    if ((web as any)?.setActivePath) {
      ;(web as any).setActivePath(normalizePath(pagePath))
    }
  },
  { immediate: true }
)

const tabs = [
  { key: 'Hero', label: 'Hero', icon: 'lucide:layout-template' },
  { key: 'Sambutan', label: 'Sambutan', icon: 'lucide:message-circle' },
  { key: 'Visi & Misi', label: 'Visi & Misi', icon: 'lucide:target' },
  { key: 'Sejarah', label: 'Sejarah', icon: 'lucide:file-text' },
  { key: 'Materi', label: 'Materi', icon: 'lucide:list-checks' },
  { key: 'Kitab', label: 'Kitab', icon: 'lucide:book-open' },
  { key: 'Struktur', label: 'Struktur', icon: 'lucide:users' },
  { key: 'Tingkatan', label: 'Tingkatan', icon: 'lucide:school' }
] as const

type TabKey = typeof tabs[number]['key']

const activeTab = ref<TabKey>('Hero')

const defaults: Shape = {
  hero: {
    cover: '/assets/images/profile.png',
    coverPublicId: null,
    badge: 'Profil Pondok Pesantren Al-Inayah',
    title: 'Mencetak berilmu, beradab, dan mandiri',
    subtitle: 'Berlandaskan Al-Qur’ān dan Sunnah, mengintegrasikan diniyah, akademik, dan keterampilan abad 21.',
    heightSm: '44vh',
    heightLg: '56vh'
  },
  sambutan: {
    img: '/assets/images/kyai.jpg',
    imgPublicId: null,
    title: 'Sambutan Pengasuh',
    content:
      'Alhamdulillāh, Pondok Pesantren Al-Inayah berkomitmen melahirkan santri yang mendalam ilmunya, kokoh akhlaknya, dan tangguh menghadapi tantangan zaman. Melalui disiplin, adab, dan ikhtiar berkelanjutan, kami berharap para santri menjadi pribadi yang bermanfaat bagi umat.',
    signer: '— KH. Izud'
  },
  visi: 'Mencetak generasi berilmu, berakhlak karimah, dan berdaya saing global berlandaskan Al-Qur’ān dan Sunnah.',
  misi: [
    'Penguatan ilmu diniyah & adab santri',
    'Integrasi akademik modern & evaluasi terstandar',
    'Pembinaan karakter & kepemimpinan',
    'Literasi digital, komunikasi, dan kolaborasi',
    'Khidmah sosial & kemitraan alumni'
  ],
  motto: 'Berilmu • Beradab • Mandiri',
  sejarah: [
    'Pondok Pesantren Al-Inayah berdiri dengan tekad menghadirkan pendidikan Islam yang menanamkan akhlak mulia, disiplin, dan kemandirian.',
    'Perjalanan pondok dimulai dari kegiatan belajar sederhana yang terus berkembang melalui dukungan masyarakat, wali santri, dan para pengasuh.',
    'Dengan visi mencetak generasi yang berakhlak, berilmu, dan bermanfaat, pondok terus meningkatkan kualitas pembinaan, kurikulum, dan fasilitas.'
  ],
  materi: [
    'Tahfidz & Tahsin Al-Qur’ān',
    'Fiqih, Aqidah, Akhlak',
    'Nahwu & Sharaf',
    'Tafsir & Hadits',
    'Bahasa Arab & Inggris',
    'Sains & Matematika'
  ],
  kitab: [
    'Al-Jurumiyah',
    'Imrithi',
    'Alfiyah Ibnu Malik',
    'Fathul Qarib',
    'Bulughul Maram',
    'Tafsir Jalalain',
    'Riyadhus Shalihin',
    'Ushul Tsalatsah'
  ],
  struktur: [
    {
      nama: 'KH. Izud',
      jabatan: 'Pengasuh',
      img: '/assets/images/kyai.jpg',
      imgPublicId: null
    }
  ],
  tingkatan: [
    { title: 'Ibtidaiyah', desc: 'Fokus adab, tahsin, pondasi diniyah', icon: 'ph:book' },
    { title: 'Tsanawiyah', desc: 'Integrasi diniyah-akademik & bahasa', icon: 'ph:chalkboard' },
    { title: 'Aliyah', desc: 'Pendalaman kitab, sains & leadership', icon: 'ph:graduation-cap' }
  ]
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

function normalizeStruktur(items?: Struktur[]) {
  if (!Array.isArray(items) || !items.length) return clone(defaults.struktur)

  return items.map((item) => ({
    nama: item.nama || '',
    jabatan: item.jabatan || '',
    img: item.img || '',
    imgPublicId: item.imgPublicId || null
  }))
}

function normalizeTingkatan(items?: Tingkatan[]) {
  if (!Array.isArray(items) || !items.length) return clone(defaults.tingkatan)

  return items.map((item) => ({
    title: item.title || '',
    desc: item.desc || '',
    icon: item.icon || 'ph:book'
  }))
}

function merge(base: Shape, patch: Partial<Shape> = {}): Shape {
  return {
    hero: {
      cover: patch.hero?.cover ?? base.hero.cover,
      coverPublicId: patch.hero?.coverPublicId ?? base.hero.coverPublicId ?? null,
      badge: patch.hero?.badge ?? base.hero.badge,
      title: patch.hero?.title ?? base.hero.title,
      subtitle: patch.hero?.subtitle ?? base.hero.subtitle,
      heightSm: patch.hero?.heightSm ?? base.hero.heightSm,
      heightLg: patch.hero?.heightLg ?? base.hero.heightLg
    },
    sambutan: {
      img: patch.sambutan?.img ?? base.sambutan.img,
      imgPublicId: patch.sambutan?.imgPublicId ?? base.sambutan.imgPublicId ?? null,
      title: patch.sambutan?.title ?? base.sambutan.title,
      content: patch.sambutan?.content ?? base.sambutan.content,
      signer: patch.sambutan?.signer ?? base.sambutan.signer
    },
    visi: patch.visi ?? base.visi,
    misi: Array.isArray(patch.misi) && patch.misi.length ? clone(patch.misi) : clone(base.misi),
    motto: patch.motto ?? base.motto,
    sejarah: Array.isArray(patch.sejarah) && patch.sejarah.length ? clone(patch.sejarah) : clone(base.sejarah),
    materi: Array.isArray(patch.materi) && patch.materi.length ? clone(patch.materi) : clone(base.materi),
    kitab: Array.isArray(patch.kitab) && patch.kitab.length ? clone(patch.kitab) : clone(base.kitab),
    struktur: normalizeStruktur(patch.struktur),
    tingkatan: normalizeTingkatan(patch.tingkatan)
  }
}

const form = reactive<Shape>(merge(defaults, props.section?.props || {}))

watch(
  () => props.section?.props,
  (nextProps) => {
    Object.assign(form, merge(defaults, nextProps || {}))
    syncMediaDrafts()
  }
)

const savedNote = ref('')
const errNote = ref('')
const saving = ref(false)

const {
  uploadImage,
  deleteImage,
  uploading,
  deleting,
  uploadError,
  deleteError
} = useCloudinaryUpload()

const mediaBusy = computed(() => uploading.value || deleting.value)
const progress = reactive<Record<string, number | undefined>>({})
const mediaMode = reactive<Record<string, MediaMode>>({})
const mediaDraft = reactive<Record<string, string>>({})

watch(
  () => [
    form.hero.cover,
    form.sambutan.img,
    ...form.struktur.map((item) => item.img)
  ],
  () => syncMediaDrafts(),
  { immediate: true }
)

function syncMediaDrafts() {
  ensureMediaState('hero.cover', form.hero.cover)
  ensureMediaState('sambutan.img', form.sambutan.img)

  form.struktur.forEach((item, index) => {
    ensureMediaState(`struktur.${index}.img`, item.img)
  })
}

function ensureMediaState(key: string, value: string) {
  if (!(key in mediaMode)) {
    mediaMode[key] = 'upload'
  }

  mediaDraft[key] = value || ''
}

const errorModal = reactive({
  show: false,
  title: '',
  message: ''
})

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

/* ===== Save / Reset ===== */
async function save() {
  try {
    saving.value = true
    errNote.value = ''

    const path = normalizePath(props.pagePath || '/profile')

    if ((web as any)?.setActivePath) {
      ;(web as any).setActivePath(path)
    }

    await web.updateSection(
      props.section.id,
      { props: clone(form) },
      path
    )

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

async function resetToDefault() {
  const publicIds = [
    form.hero.coverPublicId,
    form.sambutan.imgPublicId,
    ...form.struktur.map((item) => item.imgPublicId)
  ].filter(Boolean) as string[]

  try {
    await Promise.all(publicIds.map((id) => deleteImage(id)))
  } catch {}

  Object.assign(form, clone(defaults))
  syncMediaDrafts()
  activeTab.value = 'Hero'

  savedNote.value = 'Form dikembalikan ke default.'
  setTimeout(() => {
    savedNote.value = ''
  }, 1500)
}

/* ===== Array Helpers ===== */
function move<T>(arr: T[], index: number, direction: number) {
  const targetIndex = index + direction

  if (targetIndex < 0 || targetIndex >= arr.length) return

  const [item] = arr.splice(index, 1)
  if (!item) return

  arr.splice(targetIndex, 0, item)
  syncMediaDrafts()
}

function addStruktur() {
  const index = form.struktur.length

  form.struktur.push({
    nama: 'Nama',
    jabatan: 'Jabatan',
    img: '',
    imgPublicId: null
  })

  ensureMediaState(`struktur.${index}.img`, '')
}

function moveStruktur(index: number, direction: number) {
  move(form.struktur, index, direction)
}

async function removeStruktur(index: number) {
  const item = form.struktur[index]

  if (!item) return

  if (item.imgPublicId) {
    try {
      await deleteImage(item.imgPublicId)
    } catch {}
  }

  form.struktur.splice(index, 1)
  syncMediaDrafts()
}

/* ===== Image Upload / URL ===== */
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
  return /^https?:\/\//i.test(String(url || ''))
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

function getPublicId(key: string) {
  if (key === 'hero.cover') return form.hero.coverPublicId || null
  if (key === 'sambutan.img') return form.sambutan.imgPublicId || null

  const match = key.match(/^struktur\.(\d+)\.img$/)
  if (match) return form.struktur[Number(match[1])]?.imgPublicId || null

  return null
}

function getImageValue(key: string) {
  if (key === 'hero.cover') return form.hero.cover || ''
  if (key === 'sambutan.img') return form.sambutan.img || ''

  const match = key.match(/^struktur\.(\d+)\.img$/)
  if (match) return form.struktur[Number(match[1])]?.img || ''

  return ''
}

function setImageValue(key: string, url: string, publicId?: string | null) {
  if (key === 'hero.cover') {
    form.hero.cover = url
    form.hero.coverPublicId = publicId || null
    mediaDraft[key] = url
    return
  }

  if (key === 'sambutan.img') {
    form.sambutan.img = url
    form.sambutan.imgPublicId = publicId || null
    mediaDraft[key] = url
    return
  }

  const match = key.match(/^struktur\.(\d+)\.img$/)
  if (!match) return

  const index = Number(match[1])
  const item = form.struktur[index]

  if (!item) return

  item.img = url
  item.imgPublicId = publicId || null
  mediaDraft[key] = url
}

async function clearCloudinaryImage(key: string) {
  const publicId = getPublicId(key)

  if (!publicId) return

  try {
    await deleteImage(publicId)
  } catch {}

  setImageValue(key, getImageValue(key), null)
}

async function uploadImageField(event: Event, key: string) {
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
    const oldPublicId = getPublicId(key)

    timer = window.setInterval(() => {
      if (progress[key] != null && progress[key]! < 92) {
        progress[key]! += 7
      }
    }, 180)

    const result = await uploadImage(file, {
      folder: 'obayan-web/profile',
      maxWidth: key === 'hero.cover' ? 1920 : 1200,
      maxHeight: key === 'hero.cover' ? 1080 : 1200,
      quality: 0.84
    })

    setImageValue(key, result.secure_url, result.public_id)

    if (oldPublicId && oldPublicId !== result.public_id) {
      await deleteImage(oldPublicId)
    }

    progress[key] = 100
    savedNote.value = 'Gambar berhasil diupload.'
    setTimeout(() => {
      savedNote.value = ''
    }, 1500)
  } catch (error: any) {
    showErrorModal(
      'Upload gagal',
      uploadError.value || error?.message || 'Gagal upload gambar.'
    )
  } finally {
    if (timer) window.clearInterval(timer)

    setTimeout(() => {
      progress[key] = undefined
    }, 1000)

    input.value = ''
  }
}

async function applyImageUrl(key: string) {
  const url = String(mediaDraft[key] || '').trim()

  if (!url) {
    showErrorModal('URL kosong', 'Masukkan link gambar terlebih dahulu.')
    return
  }

  if (isLocalAssetUrl(url)) {
    await clearCloudinaryImage(key)
    setImageValue(key, url, null)

    savedNote.value = 'Path lokal digunakan. Klik Simpan untuk menyimpan.'
    setTimeout(() => {
      savedNote.value = ''
    }, 1500)
    return
  }

  if (!isHttpUrl(url)) {
    showErrorModal('URL tidak valid', 'Link gambar harus diawali http:// atau https://.')
    return
  }

  try {
    await validateRemoteImageUrl(url)

    await clearCloudinaryImage(key)
    setImageValue(key, url, null)

    savedNote.value = 'Link gambar berhasil digunakan. Klik Simpan untuk menyimpan.'
    setTimeout(() => {
      savedNote.value = ''
    }, 1500)
  } catch (error: any) {
    showErrorModal(
      'Gambar tidak bisa digunakan',
      error?.message || 'Link gambar invalid, tidak ditemukan, atau tidak bisa diakses.'
    )
  }
}

async function removeImageField(key: string) {
  try {
    await clearCloudinaryImage(key)
    setImageValue(key, '', null)

    savedNote.value = 'Gambar dihapus. Klik Simpan untuk menyimpan.'
    setTimeout(() => {
      savedNote.value = ''
    }, 1500)
  } catch (error: any) {
    showErrorModal(
      'Gagal menghapus gambar',
      deleteError.value || error?.message || 'Gagal menghapus gambar.'
    )
  }
}

/* ===== Icon Picker ===== */
const iconModal = reactive({
  show: false,
  tabs: ['Local', 'Online'] as IconTab[],
  activeTab: 'Local' as IconTab,
  query: '',
  visible: [] as string[],
  allowOnline: true,
  loading: false,
  total: 0,
  limit: 72,
  start: 0,
  controller: null as AbortController | null,
  target: null as IconTarget | null,
  localAll: [
    'ph:book',
    'ph:chalkboard',
    'ph:graduation-cap',
    'ph:student',
    'ph:medal',
    'ph:handshake',
    'ph:scroll',
    'ph:book-open',
    'lucide:book',
    'lucide:school',
    'lucide:graduation-cap',
    'lucide:users',
    'lucide:feather',
    'mdi:school-outline',
    'mdi:book-open-variant',
    'mdi:account-group-outline',
    'mdi:medal-outline',
    'mdi:leaf',
    'tabler:book-2',
    'tabler:certificate',
    'tabler:sparkles',
    'tabler:users',
    'material-symbols:school-outline',
    'material-symbols:menu-book-outline',
    'ic:baseline-emoji-people'
  ]
})

function openIconPicker(target: IconTarget) {
  iconModal.target = target
  iconModal.show = true
  iconModal.activeTab = 'Local'
  iconModal.query = ''
  iconModal.start = 0
  iconModal.total = 0
  filterLocal()
}

function closeIconPicker() {
  try {
    iconModal.controller?.abort?.()
  } catch {}

  iconModal.controller = null
  iconModal.show = false
  iconModal.visible = []
  iconModal.query = ''
  iconModal.total = 0
  iconModal.start = 0
  iconModal.target = null
}

function chooseIcon(name: string) {
  if (!iconModal.target) return

  const index = iconModal.target.index

  if (form.tingkatan[index]) {
    form.tingkatan[index].icon = name
  }

  closeIconPicker()
}

function setIconTab(tab: IconTab) {
  iconModal.activeTab = tab
  iconModal.start = 0

  if (tab === 'Local') {
    filterLocal()
  } else {
    searchOnline(true)
  }
}

function filterLocal() {
  const query = iconModal.query.trim().toLowerCase()
  const base = iconModal.localAll

  iconModal.visible = query
    ? base.filter((name) => name.toLowerCase().includes(query))
    : base.slice(0, iconModal.limit)

  iconModal.total = iconModal.visible.length
}

function onSearchInput() {
  iconModal.start = 0

  if (iconModal.activeTab === 'Local') {
    filterLocal()
  } else {
    searchOnline(true)
  }
}

let searchDebounce: ReturnType<typeof setTimeout> | null = null

async function searchOnline(reset = true) {
  if (!iconModal.allowOnline || typeof window === 'undefined') return

  const query = iconModal.query.trim()

  if (!query) {
    iconModal.start = 0
    iconModal.total = 0
    filterLocal()
    return
  }

  if (reset) {
    iconModal.start = 0
    iconModal.total = 0
  }

  if (searchDebounce) {
    clearTimeout(searchDebounce)
  }

  searchDebounce = setTimeout(async () => {
    try {
      iconModal.controller?.abort?.()
    } catch {}

    iconModal.controller = new AbortController()
    iconModal.loading = true

    try {
      const prefixes = ['mdi', 'tabler', 'material-symbols', 'ic', 'ph', 'lucide']
      const url =
        `https://api.iconify.design/search` +
        `?query=${encodeURIComponent(query)}` +
        `&limit=${encodeURIComponent(iconModal.limit)}` +
        `&start=${encodeURIComponent(iconModal.start)}` +
        `&prefixes=${encodeURIComponent(prefixes.join(','))}`

      const response = await fetch(url, {
        headers: {
          Accept: 'application/json'
        },
        signal: iconModal.controller.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json() as {
        icons?: string[]
        total?: number
        limit?: number
        start?: number
      }

      const hits = Array.isArray(data.icons) ? data.icons : []

      iconModal.visible = hits
      iconModal.total = Number(data.total || hits.length || 0)

      if (typeof data.limit === 'number') {
        iconModal.limit = data.limit
      }

      if (typeof data.start === 'number') {
        iconModal.start = data.start
      }

      if (!hits.length) {
        filterLocal()
      }
    } catch (error: any) {
      if (error?.name !== 'AbortError') {
        console.error('Iconify /search error:', error)
        filterLocal()
      }
    } finally {
      iconModal.loading = false
    }
  }, 220)
}

function prevPage() {
  if (iconModal.start === 0) return

  iconModal.start = Math.max(0, iconModal.start - iconModal.limit)
  searchOnline(false)
}

function nextPage() {
  if (iconModal.start + iconModal.limit >= iconModal.total) return

  iconModal.start += iconModal.limit
  searchOnline(false)
}

/* ===== Local helper components, no HTML template inside script ===== */
const BaseInput = defineComponent({
  name: 'BaseInput',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    return () =>
      h('div', attrs, [
        h('label', { class: 'mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500' }, props.label),
        h('input', {
          value: props.modelValue,
          placeholder: props.placeholder,
          class:
            'block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white',
          onInput: (event: Event) => emit('update:modelValue', (event.target as HTMLInputElement).value)
        })
      ])
  }
})

const BaseTextarea = defineComponent({
  name: 'BaseTextarea',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    rows: {
      type: Number,
      default: 4
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    return () =>
      h('div', attrs, [
        h('label', { class: 'mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500' }, props.label),
        h('textarea', {
          value: props.modelValue,
          rows: props.rows,
          placeholder: props.placeholder,
          class:
            'block w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white',
          onInput: (event: Event) => emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
        })
      ])
  }
})

const EmptyState = defineComponent({
  name: 'EmptyState',
  props: {
    icon: {
      type: String,
      default: 'lucide:inbox'
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    return () =>
      h('div', { class: 'rounded-[28px] border border-dashed border-gray-300 bg-gray-50 p-10 text-center dark:border-neutral-700 dark:bg-neutral-800/40' }, [
        h(Icon, { icon: props.icon, class: 'mx-auto h-10 w-10 text-gray-400' }),
        h('h4', { class: 'mt-3 text-base font-black text-gray-900 dark:text-white' }, props.title),
        h('p', { class: 'mt-1 text-sm text-gray-500 dark:text-neutral-400' }, props.description)
      ])
  }
})

const ActionButtons = defineComponent({
  name: 'ActionButtons',
  props: {
    index: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  emits: ['move', 'remove'],
  setup(props, { emit }) {
    return () =>
      h('div', { class: 'flex shrink-0 items-center gap-2' }, [
        h('button', {
          type: 'button',
          disabled: props.index === 0,
          class:
            'inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800',
          onClick: () => emit('move', -1)
        }, [h(Icon, { icon: 'lucide:arrow-up', class: 'h-4 w-4' })]),
        h('button', {
          type: 'button',
          disabled: props.index === props.total - 1,
          class:
            'inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800',
          onClick: () => emit('move', 1)
        }, [h(Icon, { icon: 'lucide:arrow-down', class: 'h-4 w-4' })]),
        h('button', {
          type: 'button',
          class:
            'inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10',
          onClick: () => emit('remove')
        }, [h(Icon, { icon: 'lucide:trash-2', class: 'h-4 w-4' })])
      ])
  }
})

const ListEditor = defineComponent({
  name: 'ListEditor',
  props: {
    title: {
      type: String,
      required: true
    },
    emptyText: {
      type: String,
      default: 'Belum ada data.'
    },
    addLabel: {
      type: String,
      default: 'Tambah'
    },
    items: {
      type: Array as () => string[],
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  emits: ['add', 'move', 'remove'],
  setup(props, { emit }) {
    return () =>
      h('section', { class: 'overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900' }, [
        h('div', { class: 'flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-neutral-800' }, [
          h('h4', { class: 'text-sm font-black text-gray-900 dark:text-white' }, props.title),
          h('button', {
            type: 'button',
            class: 'inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-xs font-bold text-white transition hover:bg-green-700',
            onClick: () => emit('add')
          }, [
            h(Icon, { icon: 'lucide:plus', class: 'h-4 w-4' }),
            props.addLabel
          ])
        ]),
        h('div', { class: 'space-y-3 p-4' }, [
          props.items.length
            ? props.items.map((item, index) =>
              h('div', { key: `${props.title}-${index}`, class: 'flex items-center gap-2' }, [
                h('input', {
                  value: item,
                  placeholder: props.placeholder,
                  class:
                    'h-12 min-w-0 flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:focus:bg-neutral-900',
                  onInput: (event: Event) => {
                    props.items[index] = (event.target as HTMLInputElement).value
                  }
                }),
                h(ActionButtons, {
                  index,
                  total: props.items.length,
                  onMove: (direction: number) => emit('move', index, direction),
                  onRemove: () => emit('remove', index)
                })
              ])
            )
            : h('p', { class: 'rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500 dark:border-neutral-700 dark:bg-neutral-800/40 dark:text-neutral-400' }, props.emptyText)
        ])
      ])
  }
})

const ImageEditorCard = defineComponent({
  name: 'ImageEditorCard',
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    imageKey: {
      type: String,
      required: true
    },
    src: {
      type: String,
      default: ''
    },
    mode: {
      type: String as () => MediaMode,
      default: 'upload'
    },
    draft: {
      type: String,
      default: ''
    },
    progress: {
      type: Number,
      default: undefined
    },
    busy: {
      type: Boolean,
      default: false
    },
    inputId: {
      type: String,
      required: true
    }
  },
  emits: ['change-mode', 'update-draft', 'upload', 'apply-url', 'remove'],
  setup(props, { emit }) {
    return () =>
      h('section', { class: 'overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900' }, [
        h('div', { class: 'border-b border-gray-200 px-4 py-3 dark:border-neutral-800' }, [
          h('h4', { class: 'text-sm font-black text-gray-900 dark:text-white' }, props.title),
          h('p', { class: 'mt-1 text-xs text-gray-500 dark:text-neutral-400' }, props.subtitle)
        ]),
        h('div', { class: 'grid gap-5 p-4 lg:grid-cols-[0.95fr,1.05fr]' }, [
          h('div', { class: 'relative overflow-hidden rounded-[24px] border border-gray-200 bg-gray-100 dark:border-neutral-800 dark:bg-neutral-800' }, [
            props.src
              ? h('img', { src: props.src, class: 'h-64 w-full object-cover', alt: props.title })
              : h('div', { class: 'grid h-64 place-items-center text-center' }, [
                h('div', [
                  h(Icon, { icon: 'lucide:image-plus', class: 'mx-auto h-9 w-9 text-gray-400' }),
                  h('p', { class: 'mt-2 text-sm font-semibold text-gray-500 dark:text-neutral-400' }, 'Belum ada gambar')
                ])
              ]),
            props.progress !== undefined
              ? h('div', { class: 'absolute inset-x-3 bottom-3 overflow-hidden rounded-full bg-white/70 p-1 backdrop-blur dark:bg-neutral-950/70' }, [
                h('div', {
                  class: 'h-2 rounded-full bg-green-500 transition-all',
                  style: { width: `${props.progress}%` }
                })
              ])
              : null
          ]),
          h('div', { class: 'space-y-4' }, [
            h('div', { class: 'inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800' }, [
              h('button', {
                type: 'button',
                class: props.mode === 'upload'
                  ? 'rounded-xl bg-white px-3 py-2 text-xs font-bold text-gray-900 shadow-sm transition dark:bg-neutral-200'
                  : 'rounded-xl px-3 py-2 text-xs font-bold text-gray-500 transition dark:text-neutral-300',
                onClick: () => emit('change-mode', 'upload')
              }, 'Upload'),
              h('button', {
                type: 'button',
                class: props.mode === 'url'
                  ? 'rounded-xl bg-white px-3 py-2 text-xs font-bold text-gray-900 shadow-sm transition dark:bg-neutral-200'
                  : 'rounded-xl px-3 py-2 text-xs font-bold text-gray-500 transition dark:text-neutral-300',
                onClick: () => emit('change-mode', 'url')
              }, 'URL')
            ]),
            props.mode === 'upload'
              ? h('div', { class: 'rounded-[24px] border border-dashed border-green-200 bg-green-50/60 p-5 dark:border-green-900/40 dark:bg-green-900/10' }, [
                h('input', {
                  id: props.inputId,
                  type: 'file',
                  accept: 'image/jpeg,image/png,image/webp',
                  class: 'hidden',
                  onChange: (event: Event) => emit('upload', event)
                }),
                h('label', {
                  for: props.inputId,
                  class: 'flex cursor-pointer flex-col items-center justify-center rounded-[22px] bg-white px-5 py-8 text-center ring-1 ring-green-100 transition hover:bg-green-50 dark:bg-neutral-900 dark:ring-green-900/40 dark:hover:bg-neutral-800'
                }, [
                  h(Icon, { icon: 'lucide:upload-cloud', class: 'h-9 w-9 text-green-600 dark:text-green-300' }),
                  h('span', { class: 'mt-3 text-sm font-black text-gray-900 dark:text-white' }, 'Upload Gambar'),
                  h('span', { class: 'mt-1 text-xs text-gray-500 dark:text-neutral-400' }, 'File akan diupload ke Cloudinary.')
                ])
              ])
              : h('div', { class: 'space-y-3' }, [
                h('input', {
                  value: props.draft,
                  type: 'url',
                  placeholder: 'https://example.com/image.jpg',
                  class:
                    'block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white',
                  onInput: (event: Event) => emit('update-draft', (event.target as HTMLInputElement).value)
                }),
                h('button', {
                  type: 'button',
                  disabled: props.busy || !props.draft,
                  class: 'inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-60',
                  onClick: () => emit('apply-url')
                }, [
                  h(Icon, { icon: 'lucide:shield-check', class: 'h-4 w-4' }),
                  'Gunakan Link'
                ])
              ]),
            props.src
              ? h('button', {
                type: 'button',
                disabled: props.busy,
                class: 'inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white px-4 text-sm font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10',
                onClick: () => emit('remove')
              }, [
                h(Icon, { icon: 'lucide:trash-2', class: 'h-4 w-4' }),
                'Hapus Gambar'
              ])
              : null
          ])
        ])
      ])
  }
})
</script>