<!-- pages/app/teacher.vue -->
<template>
  <section class="relative p-4 md:p-6 text-gray-800 dark:text-neutral-200">
    <!-- Decorative BG -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-white dark:bg-neutral-950 [background-image:radial-gradient(theme(colors.emerald.100)_1px,transparent_1px)] [background-size:18px_18px] [background-position:0_0] dark:[background-image:radial-gradient(theme(colors.emerald.900/.25)_1px,transparent_1px)]"></div>
      <div class="absolute -top-24 -left-28 w-[38rem] h-[38rem] rounded-full opacity-30 blur-3xl bg-[radial-gradient(closest-side,theme(colors.emerald.300/.35),transparent)] dark:bg-[radial-gradient(closest-side,theme(colors.emerald.700/.25),transparent)]" />
      <div class="absolute top-28 -right-24 w-[34rem] h-[34rem] rounded-full opacity-25 blur-3xl bg-[radial-gradient(closest-side,theme(colors.lime.300/.35),transparent)] dark:bg-[radial-gradient(closest-side,theme(colors.lime.700/.25),transparent)]" />
    </div>

    <!-- HEADER -->
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center gap-2">
        <h1 class="text-xl font-semibold">Guru & Tenaga Pendidik</h1>
        <span class="text-sm text-gray-500 dark:text-neutral-400">({{ filtered.length }})</span>
      </div>

      <!-- Filter bar -->
      <div class="flex w-full flex-col sm:flex-row sm:flex-wrap md:w-auto gap-2">
        <div class="relative sm:w-64 w-full">
          <Icon icon="lucide:search" class="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            v-model="q"
            type="search"
            placeholder="Cari nama/NIP/NUPTK/mapel…"
            class="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-emerald-100 bg-white/90 backdrop-blur focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:bg-neutral-800 dark:border-neutral-700"
          />
        </div>

        <select v-model="fJenjang" class="w-full sm:w-auto px-3 py-2 text-sm rounded-xl border border-emerald-100 bg-white/90 backdrop-blur dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
          <option value="all">Semua Jenjang</option>
          <option v-for="j in JENJANGS" :key="j" :value="j">{{ j }}</option>
        </select>

        <select v-model="fStatus" class="w-full sm:w-auto px-3 py-2 text-sm rounded-xl border border-emerald-100 bg-white/90 backdrop-blur dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
          <option value="all">Semua Status</option>
          <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
        </select>

        <select v-model="fMapel" class="w-full sm:w-auto px-3 py-2 text-sm rounded-xl border border-emerald-100 bg-white/90 backdrop-blur dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
          <option value="all">Semua Mapel</option>
          <option v-for="m in SUBJECTS_ID" :key="m" :value="m">{{ m }}</option>
        </select>

        <select v-model="fAktif" class="w-full sm:w-auto px-3 py-2 text-sm rounded-xl border border-emerald-100 bg-white/90 backdrop-blur dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
          <option value="all">Semua</option>
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>

        <button @click="openCreate" class="inline-flex items-center justify-center gap-x-2 rounded-xl bg-emerald-600 text-white px-3 py-2 text-sm font-medium hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 active:scale-[.98] transition-all">
          <Icon icon="lucide:plus" class="size-4" />
          Tambah Guru
        </button>
      </div>
    </div>

    <!-- GRID LIST -->
    <div class="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
      <div
        v-for="t in filtered"
        :key="t.id"
        class="group rounded-3xl border border-emerald-100/70 bg-white/90 dark:bg-neutral-800/90 dark:border-emerald-900/30 shadow-xs hover:shadow-lg transition-all hover:-translate-y-0.5 overflow-hidden backdrop-blur supports-[backdrop-filter]:bg-white/70"
      >
        <div class="flex">
          <!-- Photo / avatar -->
          <div class="relative w-28 shrink-0">
            <img v-if="t.photoUrl" :src="t.photoUrl" class="w-full h-full object-cover aspect-[3/4]" alt="Foto guru" />
            <div v-else class="w-full h-full aspect-[3/4] flex items-center justify-center bg-emerald-50 dark:bg-neutral-700">
              <Icon :icon="t.gender==='P' ? 'lucide:user-round' : 'lucide:user-round'" class="size-8 400 dark:300" />
            </div>
            <div class="absolute bottom-1 left-1">
              <span
                class="text-[10px] px-1.5 py-0.5 rounded-md ring-1"
                :class="t.aktif !== false
                  ? 'bg-emerald-100 700 ring-emerald-200 dark:bg-emerald-900/30 dark:300 dark:ring-emerald-900/40'
                  : 'bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:ring-rose-900/40'"
              >
                {{ t.aktif !== false ? 'Aktif' : 'Nonaktif' }}
              </span>
            </div>
          </div>

          <!-- Card body -->
          <div class="p-3 w-full">
            <div class="flex flex-wrap items-start justify-between gap-2 w-full">
              <div class="min-w-0">
                <h3 class="font-semibold truncate leading-tight">{{ t.nama }}</h3>
                <p class="text-xs text-gray-500 dark:text-neutral-400 truncate">
                  {{ t.jenjang }} · {{ t.mapelUtama || '—' }}
                  <span v-if="t.mapelLain?.length"> · Multi: {{ t.mapelLain.join(', ') }}</span>
                </p>
                <p v-if="t.jabatan?.length" class="text-[11px] text-gray-400 dark:text-neutral-500 truncate mt-0.5">
                  Jabatan: {{ t.jabatan.join(', ') }}
                </p>
                <p v-if="t.rfidUid" class="text-[11px] 600 dark:300 mt-0.5">
                  RFID: <span class="font-mono">{{ maskUid(t.rfidUid) }}</span>
                </p>
              </div>
              <div class="flex items-center gap-1.5">
                <button class="px-2 py-1.5 text-xs rounded-md border border-emerald-100/70 hover:bg-emerald-50 dark:border-neutral-700 dark:hover:bg-neutral-700" @click="openEdit(t)" aria-label="Edit">
                  Edit
                </button>
                <button class="px-2 py-1.5 text-xs rounded-md border border-blue-200/60 600 hover:bg-blue-50 dark:border-blue-900/30 dark:hover:bg-blue-900/20" @click="openBindFromCard(t)" aria-label="Bind RFID">
                  RFID
                </button>
                <button class="px-2 py-1.5 text-xs rounded-md border border-rose-200/60 text-rose-600 hover:bg-rose-50 dark:border-rose-900/30 dark:hover:bg-rose-900/20" @click="openDeleteData(t)" aria-label="Hapus">
                  Hapus
                </button>
              </div>
            </div>

            <!-- meta -->
            <div class="mt-2 grid grid-cols-1 gap-2 text-[11px] text-gray-600 dark:text-neutral-300">
              <div class="truncate"><span class="text-gray-400">NIP:</span> {{ t.nip || '—' }}</div>
              <div class="truncate"><span class="text-gray-400">NUPTK:</span> {{ t.nuptk || '—' }}</div>
              <div class="truncate"><span class="text-gray-400">Kepegawaian:</span> {{ t.statusKepegawaian }}</div>
              <div class="truncate"><span class="text-gray-400">Kontak:</span> {{ t.phone || t.email || '—' }}</div>
            </div>

            <!-- Tags (mapel lain) -->
            <div v-if="t.mapelLain?.length" class="mt-2 flex flex-wrap gap-1">
              <span
                v-for="m in t.mapelLain"
                :key="m"
                class="hs-tooltip inline-flex items-center rounded-full bg-emerald-50 700 ring-1 ring-emerald-100 dark:bg-emerald-900/20 dark:300 dark:ring-emerald-900/30 px-2 py-0.5 text-[10px]"
              >
                <span class="hs-tooltip-toggle">{{ m }}</span>
                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 invisible transition px-2 py-1 text-[10px] rounded-lg bg-neutral-900 text-white ml-1">Mapel tambahan</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!filtered.length" class="col-span-full p-6 text-sm text-gray-600 border border-dashed border-emerald-200 rounded-2xl bg-emerald-50/40 dark:bg-neutral-800 dark:text-neutral-400 dark:border-emerald-900/30">
        Data guru belum ada / tidak ditemukan.
      </div>
    </div>

    <!-- MODAL CREATE/EDIT -->
    <teleport to="body">
      <div v-if="modal.open" class="fixed inset-0 z-[90]">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-4xl rounded-3xl border border-emerald-100/70 bg-white/95 shadow-2xl ring-1 ring-black/5 dark:bg-neutral-800 dark:border-neutral-700">
            <div class="sticky top-0 z-10 p-4 border-b border-emerald-100/70 bg-white/90 backdrop-blur dark:bg-neutral-800/90 dark:border-neutral-700 flex items-center justify-between rounded-t-3xl">
              <h3 class="font-semibold">
                {{ modal.mode === 'create' ? 'Tambah Guru' : 'Edit Guru' }}
              </h3>
              <button class="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40" @click="closeModal" aria-label="Tutup">
                <Icon icon="lucide:x" class="size-4" />
              </button>
            </div>

            <form class="p-4 space-y-5 max-h-[80vh] overflow-y-auto scrollbar-thin" @submit.prevent="save">
              <!-- Foto & Identitas ringkas -->
              <div class="grid gap-4 sm:grid-cols-[auto,1fr]">
                <!-- Foto -->
                <div class="sm:row-span-2">
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Foto (thumbnail)</label>
                  <div class="mt-2 flex items-start gap-3">
                    <div class="relative w-28 rounded-xl overflow-hidden border border-emerald-100/70 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900">
                      <div class="w-full aspect-[3/4]">
                        <img v-if="form.photoPreview" :src="form.photoPreview" class="w-full h-full object-cover" alt="Preview foto baru" />
                        <img v-else-if="modal.mode==='edit' && form.initialPhotoUrl && !form.removePhoto" :src="form.initialPhotoUrl" class="w-full h-full object-cover" alt="Foto saat ini" />
                        <div v-else class="w-full h-full flex items-center justify-center text-xs text-gray-400">Tidak ada foto</div>
                      </div>
                      <span
                        v-if="modal.mode==='edit' && (form.photoPreview || form.initialPhotoUrl)"
                        class="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded"
                      >{{ form.photoPreview ? 'Baru' : (form.removePhoto ? 'Akan dihapus' : 'Saat ini') }}</span>
                    </div>

                    <div class="flex-1 flex flex-col gap-2">
                      <label class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-100/70 hover:bg-emerald-50 dark:border-neutral-700 dark:hover:bg-neutral-700 cursor-pointer w-fit">
                        <Icon icon="lucide:upload" class="size-4" />
                        <span class="text-sm">Pilih Foto</span>
                        <input type="file" accept="image/*" class="hidden" @change="onPhotoInput" />
                      </label>

                      <div class="flex flex-wrap items-center gap-2">
                        <button v-if="form.photoPreview" type="button" class="px-3 py-1.5 rounded-xl border border-rose-200/60 text-rose-600 hover:bg-rose-50 dark:border-rose-900/30 dark:hover:bg-rose-900/20" @click="clearNewPhoto">
                          <Icon icon="lucide:trash-2" class="inline size-4 mr-1 -mt-0.5" /> Batalkan Foto
                        </button>

                        <button
                          v-if="modal.mode==='edit' && !form.photoPreview && form.initialPhotoUrl && !form.removePhoto"
                          type="button"
                          class="px-3 py-1.5 rounded-xl border border-rose-200/60 text-rose-600 hover:bg-rose-50 dark:border-rose-900/30 dark:hover:bg-rose-900/20"
                          @click="openDeleteAvatar()"
                        >
                          <Icon icon="lucide:trash-2" class="inline size-4 mr-1 -mt-0.5" />
                          Hapus Foto
                        </button>
                        <span v-if="form.removePhoto" class="text-xs text-rose-600">Foto akan dihapus saat disimpan</span>
                      </div>

                      <p class="text-[11px] text-gray-500 dark:text-neutral-400">Rasio disarankan 3:4. Foto akan diunggah saat menyimpan.</p>
                    </div>
                  </div>
                </div>

                <!-- Identitas ringkas -->
                <div>
                  <div class="grid gap-2 sm:grid-cols-2">
                    <div>
                      <label class="text-xs text-gray-500 dark:text-neutral-400">Nama Lengkap</label>
                      <input v-model.trim="form.nama" type="text" required class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                    </div>
                    <div>
                      <label class="text-xs text-gray-500 dark:text-neutral-400">Jenis Kelamin</label>
                      <select v-model="form.gender" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
                        <option :value="null">-</option>
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <div class="grid gap-2 sm:grid-cols-2">
                    <div>
                      <label class="text-xs text-gray-500 dark:text-neutral-400">Jenjang</label>
                      <select v-model="form.jenjang" required class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
                        <option v-for="j in JENJANGS" :key="j" :value="j">{{ j }}</option>
                      </select>
                    </div>
                    <div>
                      <label class="text-xs text-gray-500 dark:text-neutral-400">Mapel Utama</label>
                      <select v-model="form.mapelUtama" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
                        <option :value="''">-</option>
                        <option v-for="m in SUBJECTS_ID" :key="m" :value="m">{{ m }}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Data resmi & kontak -->
              <div class="grid md:grid-cols-3 gap-3">
                <div>
                  <label>NIP</label>
                  <input v-model.trim="form.nip" type="text" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
                <div>
                  <label>NUPTK</label>
                  <input v-model.trim="form.nuptk" type="text" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
                <div>
                  <label>NIK</label>
                  <input v-model.trim="form.nik" type="text" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
                <div>
                  <label>Tempat Lahir</label>
                  <input v-model.trim="form.tempatLahir" type="text" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
                <div>
                  <label>Tanggal Lahir</label>
                  <input v-model="form.tanggalLahirStr" type="date" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
                <div>
                  <label>Agama</label>
                  <select v-model="form.agama" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
                    <option :value="null">-</option>
                    <option v-for="a in AGAMAS" :key="a" :value="a">{{ a }}</option>
                  </select>
                </div>
                <div class="md:col-span-3">
                  <label>Alamat</label>
                  <input v-model.trim="form.alamat" type="text" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
                <div>
                  <label>No Hp</label>
                  <input v-model.trim="form.phone" type="tel" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
                <div>
                  <label>Email</label>
                  <input v-model.trim="form.email" type="email" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
                <div>
                  <label>Status Kepegawaian</label>
                  <select v-model="form.statusKepegawaian" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
                    <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
                  </select>
                </div>
                <div>
                  <label>Tanggal Mulai</label>
                  <input v-model="form.tglMulaiStr" type="date" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
                <div>
                  <label>Tanggal Selesai</label>
                  <input v-model="form.tglSelesaiStr" type="date" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
                <div class="flex items-end gap-3">
                  <label class="inline-flex items-center gap-2">
                    <input type="checkbox" v-model="form.aktif" class="rounded border-emerald-200 600 focus:ring-emerald-500" />
                    Aktif
                  </label>
                </div>
              </div>

              <!-- RFID (di form) -->
              <div class="grid md:grid-cols-3 gap-3">
                <div class="md:col-span-2">
                  <label class="text-xs text-gray-500 dark:text-neutral-400">RFID (UID)</label>
                  <div class="mt-1 flex items-center gap-2">
                    <input
                      v-model="form.rfidUid"
                      type="text"
                      readonly
                      placeholder="Belum terpasang"
                      class="mt-1 w-full rounded-xl border bg-gray-50 dark:bg-neutral-900/70 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                    <button
                      type="button"
                      @click="openBindFromForm()"
                      class="px-3 py-2 rounded-xl border border-blue-200/60 600 hover:bg-blue-50 dark:border-blue-900/30 dark:hover:bg-blue-900/20 text-sm inline-flex items-center gap-1"
                    >
                      <Icon icon="mdi:nfc-variant" class="size-4" /> Bind
                    </button>
                    <button
                      v-if="form.rfidUid"
                      type="button"
                      @click="openClearRfid()"
                      class="px-3 py-2 rounded-xl border border-rose-200/60 text-rose-600 hover:bg-rose-50 dark:border-rose-900/30 dark:hover:bg-rose-900/20 text-sm inline-flex items-center gap-1"
                    >
                      <Icon icon="lucide:unlink" class="size-4" /> Hapus RFID
                    </button>
                  </div>
                </div>
              </div>

              <!-- Kompetensi & jabatan -->
              <div class="grid md:grid-cols-3 gap-3">
                <div>
                  <label>Pendidikan Terakhir</label>
                  <select v-model="form.pendidikanTerakhir" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
                    <option value="D3">D3</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                  </select>
                </div>
                <div>
                  <label>Jurusan</label>
                  <input v-model.trim="form.jurusan" type="text" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
                <div>
                  <label>Institusi</label>
                  <input v-model.trim="form.institusi" type="text" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
                <div>
                  <label>Tahun Lulus</label>
                  <input v-model.trim="form.tahunLulus" type="text" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
                <div>
                  <label>Sertifikat Pendidik</label>
                  <input v-model.trim="form.sertifikatPendidik" type="text" placeholder="No. sertifikat (jika ada)" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
                <div>
                  <label>PPG Tahun</label>
                  <input v-model.trim="form.ppgTahun" type="text" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
                <div>
                  <label>Golongan</label>
                  <input v-model.trim="form.golongan" type="text" placeholder="Contoh: III/a" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
                <div>
                  <label>Pangkat</label>
                  <input v-model.trim="form.pangkat" type="text" placeholder="Contoh: Penata Muda" class="mt-1 w-full rounded-xl border bg-white/90 dark:bg-neutral-900 border-emerald-100/70 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>

                <div class="md:col-span-3">
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Jabatan</label>
                  <div class="mt-2 grid sm:grid-cols-3 gap-2">
                    <label v-for="j in JABATANS" :key="j" class="inline-flex items-center gap-2 text-sm rounded-xl px-2 py-1 ring-1 ring-emerald-100/70 dark:ring-neutral-700">
                      <input type="checkbox" :value="j" v-model="form.jabatan" class="rounded border-emerald-200 600 focus:ring-emerald-500" />
                      {{ j }}
                    </label>
                  </div>
                </div>

                <div class="md:col-span-3">
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Mapel Lain (opsional)</label>
                  <div class="mt-2 grid sm:grid-cols-3 gap-2">
                    <label v-for="m in SUBJECTS_ID" :key="m" class="inline-flex items-center gap-2 text-sm rounded-xl px-2 py-1 ring-1 ring-emerald-100/70 dark:ring-neutral-700">
                      <input type="checkbox" :value="m" v-model="form.mapelLain" class="rounded border-emerald-200 600 focus:ring-emerald-500" />
                      {{ m }}
                    </label>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-end pt-1">
                <button type="submit" class="px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 active:scale-[.98] transition-all">
                  <Icon v-if="saving" icon="ph:spinner" class="size-4 animate-spin" />
                  <span>{{ saving ? 'Menyimpan…' : (modal.mode==='create' ? 'Simpan' : 'Update') }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </teleport>

    <!-- MODAL: Konfirmasi Hapus Data -->
    <teleport to="body">
      <div v-if="modalDeleteData.open" class="fixed inset-0 z-[95]">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeDeleteData()"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-md rounded-2xl border border-rose-200/60 bg-white/95 dark:bg-neutral-800 dark:border-rose-900/30 shadow-xl">
            <div class="p-4 border-b border-rose-200/60 dark:border-rose-900/30 flex items-center gap-2">
              <Icon icon="lucide:alert-triangle" class="size-5 text-rose-600" />
              <h3 class="font-semibold">Hapus Data Guru</h3>
            </div>
            <div class="p-4 text-sm">
              <p>Anda yakin ingin menghapus data guru <span class="font-semibold">{{ modalDeleteData.name }}</span>? Tindakan ini tidak dapat dibatalkan.</p>
            </div>
            <div class="p-4 flex items-center justify-end gap-2">
              <button @click="closeDeleteData()" class="px-3 py-2 rounded-xl border dark:border-neutral-700">Batal</button>
              <button @click="confirmDeleteData()" class="px-3 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700">Hapus</button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- MODAL: Konfirmasi Hapus Avatar -->
    <teleport to="body">
      <div v-if="modalDeleteAvatar.open" class="fixed inset-0 z-[95]">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeDeleteAvatar()"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-md rounded-2xl border border-rose-200/60 bg-white/95 dark:bg-neutral-800 dark:border-rose-900/30 shadow-xl">
            <div class="p-4 border-b border-rose-200/60 dark:border-rose-900/30 flex items-center gap-2">
              <Icon icon="lucide:image-off" class="size-5 text-rose-600" />
              <h3 class="font-semibold">Hapus Foto Guru</h3>
            </div>
            <div class="p-4 text-sm space-y-2">
              <p>Hapus foto profil guru ini? Perubahan akan tersimpan saat Anda menekan <b>{{ modal.mode==='create' ? 'Simpan' : 'Update' }}</b>.</p>
            </div>
            <div class="p-4 flex items-center justify-end gap-2">
              <button @click="closeDeleteAvatar()" class="px-3 py-2 rounded-xl border dark:border-neutral-700">Batal</button>
              <button @click="confirmDeleteAvatar()" class="px-3 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700">Hapus Foto</button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- MODAL: Binding RFID -->
    <teleport to="body">
      <div v-if="rfidModal.open" class="fixed inset-0 z-[96]">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeRfidModal()"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-md rounded-2xl border border-emerald-200/70 bg-white/95 dark:bg-neutral-800 dark:border-emerald-900/30 shadow-xl overflow-hidden">
            <div class="p-4 border-b border-emerald-200/70 dark:border-emerald-900/30 flex items-center gap-2">
              <Icon icon="mdi:nfc-variant" class="size-5 600" />
              <h3 class="font-semibold">Binding RFID</h3>
            </div>

            <div class="p-6 text-center">
              <div class="relative mx-auto mb-4 size-24">
                <span class="absolute inset-0 rounded-full animate-ping bg-emerald-400/30"></span>
                <span class="absolute inset-2 rounded-full animate-ping bg-emerald-400/30"></span>
                <span class="absolute inset-4 rounded-full animate-ping bg-emerald-400/30"></span>
                <div class="relative size-24 rounded-full flex items-center justify-center bg-emerald-50 dark:bg-neutral-700 ring-1 ring-emerald-200/70 dark:ring-emerald-900/40 animate-pulse">
                  <Icon :icon="rfidModal.status==='done' ? 'lucide:check-circle-2' : (rfidModal.status==='timeout' ? 'lucide:timer' : 'mdi:nfc-variant')" class="size-10 600" />
                </div>
              </div>

              <p class="text-sm">
                <template v-if="rfidModal.status==='listening'">
                  Tempelkan kartu RFID ke reader… <br />
                  <span class="text-xs text-gray-500">Guru: {{ rfidModal.teacherName || form.nama || '-' }}</span>
                </template>
                <template v-else-if="rfidModal.status==='done'">
                  UID terdeteksi: <span class="font-mono font-semibold">{{ rfidModal.detectedUid }}</span>
                </template>
                <template v-else-if="rfidModal.status==='timeout'">
                  Waktu habis. Coba lagi?
                </template>
                <template v-else-if="rfidModal.status==='error'">
                  Gagal membaca RFID. Periksa koneksi reader.
                </template>
              </p>
            </div>

            <div class="px-4 pb-4 flex items-center justify-end gap-2">
              <button v-if="rfidModal.status!=='listening'" @click="startRfidListening()" class="px-3 py-2 rounded-xl border dark:border-neutral-700">Coba Lagi</button>
              <button v-if="rfidModal.status==='listening'" @click="closeRfidModal()" class="px-3 py-2 rounded-xl border dark:border-neutral-700">Batal</button>
              <button v-if="rfidModal.status==='done'" @click="applyRfid()" class="px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">Gunakan UID</button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useTeacher, SUBJECTS_ID, JENJANGS, STATUSES, JABATANS, type TeacherItem, type Jenjang, type StatusKepegawaian } from '~/composables/data/useTeacher'
import { getDatabase, ref as dbRef, onValue, off } from 'firebase/database'

// SPA only, jangan SSR
definePageMeta({ layout: 'app', layoutProps: { title: 'Guru' }, ssr: false })

const AGAMAS = ['Islam','Kristen','Katolik','Hindu','Buddha','Konghucu','Lainnya'] as const

/** ===== useTeacher (list & CRUD) ===== */
const { filtered, q, fJenjang, fStatus, fMapel, fAktif, subscribeAll, unbindList, createTeacher, updateTeacher, deleteTeacher } = useTeacher()

/** ===== Modal & Form State ===== */
type FormState = {
  // identitas
  nama: string
  gender: 'L' | 'P' | null
  agama: typeof AGAMAS[number] | null
  tempatLahir: string
  tanggalLahirStr: string
  alamat: string
  phone: string
  email: string
  nip: string
  nuptk: string
  nik: string
  // akademik/kompetensi
  jenjang: Jenjang
  mapelUtama: string
  mapelLain: string[]
  jabatan: string[]
  pendidikanTerakhir: 'D3' | 'S1' | 'S2' | 'S3'
  jurusan: string
  institusi: string
  tahunLulus: string
  sertifikatPendidik: string
  ppgTahun: string
  golongan: string
  pangkat: string
  // kerja
  statusKepegawaian: StatusKepegawaian
  tglMulaiStr: string
  tglSelesaiStr: string
  aktif: boolean
  // RFID
  rfidUid: string
  // foto
  photoFile: File | null
  photoPreview: string | null
  initialPhotoUrl: string | null
  removePhoto: boolean
}

const modal = reactive<{ open:boolean; mode:'create'|'edit'; id?:string }>({ open:false, mode:'create', id: undefined })

const form = reactive<FormState>({
  nama:'', gender:null, agama:null, tempatLahir:'', tanggalLahirStr:'', alamat:'', phone:'', email:'',
  nip:'', nuptk:'', nik:'',
  jenjang:'SD', mapelUtama:'', mapelLain:[], jabatan:['Guru'],
  pendidikanTerakhir:'S1', jurusan:'', institusi:'', tahunLulus:'', sertifikatPendidik:'', ppgTahun:'', golongan:'', pangkat:'',
  statusKepegawaian:'Honorer', tglMulaiStr:'', tglSelesaiStr:'', aktif:true,
  rfidUid:'',
  photoFile:null, photoPreview:null, initialPhotoUrl:null, removePhoto:false
})

function resetForm() {
  form.nama=''; form.gender=null; form.agama=null; form.tempatLahir=''; form.tanggalLahirStr=''; form.alamat=''; form.phone=''; form.email=''
  form.nip=''; form.nuptk=''; form.nik=''
  form.jenjang='SD'; form.mapelUtama=''; form.mapelLain=[]; form.jabatan=['Guru']
  form.pendidikanTerakhir='S1'; form.jurusan=''; form.institusi=''; form.tahunLulus=''; form.sertifikatPendidik=''; form.ppgTahun=''; form.golongan=''; form.pangkat=''
  form.statusKepegawaian='Honorer'; form.tglMulaiStr=''; form.tglSelesaiStr=''; form.aktif=true
  form.rfidUid=''
  if (form.photoPreview) URL.revokeObjectURL(form.photoPreview)
  form.photoFile=null; form.photoPreview=null; form.initialPhotoUrl=null; form.removePhoto=false
}

function openCreate() { resetForm(); modal.mode='create'; modal.open=true; modal.id=undefined }

function openEdit(t: TeacherItem) {
  resetForm(); modal.mode='edit'; modal.open=true; modal.id=t.id
  form.nama=t.nama || ''; form.gender=(t.gender as any) || null; form.agama=(t.agama as any) || null
  form.tempatLahir=t.tempatLahir || ''; form.tanggalLahirStr=t.tanggalLahir ? new Date(t.tanggalLahir).toISOString().slice(0,10) : ''
  form.alamat=t.alamat || ''; form.phone=t.phone || ''; form.email=t.email || ''
  form.nip=t.nip || ''; form.nuptk=t.nuptk || ''; form.nik=t.nik || ''
  form.jenjang=t.jenjang; form.mapelUtama=t.mapelUtama || ''; form.mapelLain=[...(t.mapelLain || [])]
  form.jabatan=[...(t.jabatan || ['Guru'])]
  form.pendidikanTerakhir=(t.pendidikanTerakhir as any) || 'S1'; form.jurusan=t.jurusan || ''; form.institusi=t.institusi || ''; form.tahunLulus=t.tahunLulus || ''
  form.sertifikatPendidik=t.sertifikatPendidik || ''; form.ppgTahun=t.ppgTahun || ''; form.golongan=t.golongan || ''; form.pangkat=t.pangkat || ''
  form.statusKepegawaian=t.statusKepegawaian || 'Honorer'
  form.tglMulaiStr=t.tglMulai ? new Date(t.tglMulai).toISOString().slice(0,10) : ''
  form.tglSelesaiStr=t.tglSelesai ? new Date(t.tglSelesai).toISOString().slice(0,10) : ''
  form.aktif=t.aktif !== false
  form.rfidUid=(t as any).rfidUid || ''
  form.initialPhotoUrl=t.photoUrl || null; form.removePhoto=false
}

function closeModal(){ if (form.photoPreview) URL.revokeObjectURL(form.photoPreview); modal.open=false }

/** ===== Foto handlers ===== */
function onPhotoInput(ev: Event) {
  const file = (ev.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (form.photoPreview) URL.revokeObjectURL(form.photoPreview)
  form.photoFile = file
  form.photoPreview = URL.createObjectURL(file)
  form.removePhoto = false
}
function clearNewPhoto() { if (form.photoPreview) URL.revokeObjectURL(form.photoPreview); form.photoFile = null; form.photoPreview = null }

/** ===== Delete Avatar Modal ===== */
const modalDeleteAvatar = reactive({ open:false })
function openDeleteAvatar(){ modalDeleteAvatar.open = true }
function closeDeleteAvatar(){ modalDeleteAvatar.open = false }
function confirmDeleteAvatar(){
  form.removePhoto = true
  form.photoPreview = null
  modalDeleteAvatar.open = false
}

/** ===== Delete Data Modal ===== */
const modalDeleteData = reactive<{open:boolean; id?:string; name?:string}>({ open:false, id:undefined, name:undefined })
function openDeleteData(t: TeacherItem){ modalDeleteData.open = true; modalDeleteData.id = t.id; modalDeleteData.name = t.nama }
function closeDeleteData(){ modalDeleteData.open = false; modalDeleteData.id = undefined; modalDeleteData.name = undefined }
function confirmDeleteData(){ if(modalDeleteData.id){ deleteTeacher(modalDeleteData.id); } closeDeleteData() }

/** ===== RFID Binding (client-only) ===== */
const RFID_SCAN_NODE = 'rfid/scans/latest'

const rfidModal = reactive<{
  open:boolean
  source:'card'|'form'
  teacherId?:string
  teacherName?:string
  detectedUid?:string|null
  status:'idle'|'listening'|'done'|'timeout'|'error'
  unSub?: (() => void) | null
  timer?: number | null
}>({
  open:false, source:'card', teacherId:undefined, teacherName:undefined, detectedUid:null, status:'idle', unSub:null, timer:null
})

function openBindFromCard(t: TeacherItem){
  rfidModal.source='card'
  rfidModal.teacherId = t.id
  rfidModal.teacherName = t.nama
  rfidModal.open = true
  startRfidListening()
}
function openBindFromForm(){
  rfidModal.source='form'
  rfidModal.teacherId = modal.id
  rfidModal.teacherName = form.nama
  rfidModal.open = true
  startRfidListening()
}
function closeRfidModal(){
  stopRfidListening()
  rfidModal.open = false
  rfidModal.detectedUid = null
  rfidModal.status = 'idle'
}
function startRfidListening(){
  if (import.meta.server) return
  stopRfidListening()
  rfidModal.status='listening'
  rfidModal.detectedUid = null

  // Ambil DB hanya di client
  const db = getDatabase()
  const node = dbRef(db, RFID_SCAN_NODE)

  const handler = onValue(node, (snap) => {
    const val = snap.val()
    const uid = val?.uid || val?.UID || val?.id || null
    if(uid){
      rfidModal.detectedUid = String(uid)
      rfidModal.status='done'
      stopRfidListening(false)
    }
  }, (err) => {
    console.error('[RFID] onValue error', err)
    rfidModal.status='error'
    stopRfidListening(false)
  })
  rfidModal.unSub = () => off(node, 'value', handler as any)

  // timeout 30s
  rfidModal.timer = window.setTimeout(() => {
    if(rfidModal.status==='listening'){
      rfidModal.status='timeout'
      stopRfidListening(false)
    }
  }, 30000) as unknown as number
}
function stopRfidListening(clear=true){
  if(rfidModal.unSub){ try{ (rfidModal.unSub as any)() }catch{}; rfidModal.unSub=null }
  if(rfidModal.timer){ clearTimeout(rfidModal.timer as number); rfidModal.timer=null }
  if(clear){ rfidModal.status='idle'; rfidModal.detectedUid=null }
}
async function applyRfid(){
  if(!rfidModal.detectedUid) return
  const uid = rfidModal.detectedUid
  if(rfidModal.source==='card' && rfidModal.teacherId){
    await updateTeacher(rfidModal.teacherId, { rfidUid: uid } as any)
  } else {
    form.rfidUid = uid
    if(modal.mode==='edit' && modal.id){
      await updateTeacher(modal.id, { rfidUid: uid } as any)
    }
  }
  closeRfidModal()
}
async function openClearRfid(){
  if(confirm('Hapus RFID dari guru ini?')){
    form.rfidUid = ''
    if(modal.mode==='edit' && modal.id){
      await updateTeacher(modal.id, { rfidUid: null } as any)
    }
  }
}

function maskUid(uid:string){
  if(!uid) return ''
  return uid.length <= 4 ? uid : `${uid.slice(0,2)}••••${uid.slice(-2)}`
}

const saving = ref(false)
async function save() {
  if (saving.value) return
  saving.value = true
  try {
    const tanggalLahir = form.tanggalLahirStr ? new Date(form.tanggalLahirStr).getTime() : null
    const tglMulai = form.tglMulaiStr ? new Date(form.tglMulaiStr).getTime() : null
    const tglSelesai = form.tglSelesaiStr ? new Date(form.tglSelesaiStr).getTime() : null

    if (modal.mode === 'create') {
      await createTeacher({
        nama: form.nama,
        gender: form.gender || undefined,
        agama: form.agama || undefined,
        tempatLahir: form.tempatLahir,
        tanggalLahir,
        alamat: form.alamat,
        phone: form.phone,
        email: form.email,
        nip: form.nip,
        nuptk: form.nuptk,
        nik: form.nik,
        jenjang: form.jenjang,
        mapelUtama: form.mapelUtama,
        mapelLain: form.mapelLain,
        jabatan: form.jabatan as any,
        pendidikanTerakhir: form.pendidikanTerakhir,
        jurusan: form.jurusan,
        institusi: form.institusi,
        tahunLulus: form.tahunLulus,
        sertifikatPendidik: form.sertifikatPendidik,
        ppgTahun: form.ppgTahun,
        golongan: form.golongan,
        pangkat: form.pangkat,
        statusKepegawaian: form.statusKepegawaian,
        tglMulai,
        tglSelesai,
        aktif: form.aktif,
        rfidUid: form.rfidUid || undefined,
        photoFile: form.photoFile || undefined
      } as any)
    } else if (modal.mode === 'edit' && modal.id) {
      await updateTeacher(modal.id, {
        nama: form.nama,
        gender: form.gender || undefined,
        agama: form.agama || undefined,
        tempatLahir: form.tempatLahir,
        tanggalLahir,
        alamat: form.alamat,
        phone: form.phone,
        email: form.email,
        nip: form.nip,
        nuptk: form.nuptk,
        nik: form.nik,
        jenjang: form.jenjang,
        mapelUtama: form.mapelUtama,
        mapelLain: form.mapelLain,
        jabatan: form.jabatan as any,
        pendidikanTerakhir: form.pendidikanTerakhir,
        jurusan: form.jurusan,
        institusi: form.institusi,
        tahunLulus: form.tahunLulus,
        sertifikatPendidik: form.sertifikatPendidik,
        ppgTahun: form.ppgTahun,
        golongan: form.golongan,
        pangkat: form.pangkat,
        statusKepegawaian: form.statusKepegawaian,
        tglMulai,
        tglSelesai,
        aktif: form.aktif,
        rfidUid: form.rfidUid || null,
        photoFile: form.photoFile || undefined,
        removePhoto: form.removePhoto
      } as any)
    }
    closeModal()
  } finally {
    saving.value = false
  }
}

onMounted(() => { subscribeAll() })
onUnmounted(() => { unbindList(); stopRfidListening() })
</script>

<style scoped>
.shadow-xs { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
</style>
