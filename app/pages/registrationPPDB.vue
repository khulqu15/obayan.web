<!-- /pages/registrationPPDB.vue -->
<template>
  <main class="relative min-h-screen overflow-hidden pt-24 pb-12">
    <!-- Soft gradient cap -->
    <div class="absolute w-full bg-gradient-to-b from-blue-700/40 to-blue-700/0 top-0 left-0 h-[18vh]"></div>

    <!-- Decorative blobs -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div class="absolute -top-28 -left-24 w-[48rem] h-[48rem] rounded-full opacity-30 blur-3xl bg-gradient-to-br from-blue-200 to-emerald-200 dark:from-emerald-900/40 dark:to-blue-900/30"></div>
      <div class="absolute -bottom-32 -right-24 w-[42rem] h-[42rem] rounded-full opacity-25 blur-3xl bg-gradient-to-tr from-blue-100 to-emerald-100 dark:from-blue-900/30 dark:to-emerald-900/30"></div>
    </div>

    <div class="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 text-gray-800 dark:text-neutral-100">
      <!-- HERO -->
      <header class="mb-7">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide 700 dark:400">
              <Icon icon="ph:student" class="size-4" />
              PPDB Online {{ PPDB_YEAR }}/{{ Number(PPDB_YEAR)+1 }}
            </p>
            <h1 class="mt-1 text-2xl sm:text-3xl font-bold">Formulir Pendaftaran Santri Baru</h1>
            <p class="text-gray-600 dark:text-neutral-300">Isi data secara benar. Draf tersimpan otomatis di perangkat Anda.</p>
          </div>

          <div class="shrink-0 flex items-center gap-2">
            <button @click="clearDraft" class="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 px-3 py-2 text-sm font-medium hover:bg-white dark:hover:bg-neutral-800">
              <Icon icon="ph:trash" class="size-4" />
              Reset Draf
            </button>
          </div>
        </div>
      </header>

      <div class="grid lg:grid-cols-12 gap-6 items-start">
        <!-- LEFT: FORM CARD -->
        <section class="lg:col-span-8">
          <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 backdrop-blur shadow-xl">
            <!-- Stepper -->
            <div class="border-b border-gray-200 dark:border-neutral-800 p-4">
              <div class="flex flex-wrap items-center gap-2">
                <button
                  v-for="(s,i) in steps" :key="s.key"
                  @click="go(i)"
                  class="group relative px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition"
                  :class="[
                    i === step ? 'bg-blue-600 text-white' :
                    i < step ? 'bg-emerald-50 800 border border-emerald-200 dark:bg-emerald-900/30 dark:300 dark:border-emerald-800/50' :
                    'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-200'
                  ]"
                >
                  <span class="inline-flex items-center gap-2">
                    <Icon :icon="s.icon" class="size-4" />
                    {{ s.label }}
                  </span>
                </button>
              </div>
              <div class="mt-3 h-2 rounded-full bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                <div class="h-full bg-blue-600 transition-all" :style="{ width: progress + '%' }"></div>
              </div>
            </div>

            <!-- BODY -->
            <div class="p-5 sm:p-7">
              <!-- STEP COVER: Himbauan + Brosur -->
              <section v-if="step===0" class="relative mt-4">
                <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
                  <div class="absolute -top-24 -left-24 w-[42rem] h-[42rem] rounded-full opacity-30 blur-3xl bg-gradient-to-br from-emerald-200 to-lime-200 dark:from-emerald-900/40 dark:to-lime-900/30" />
                  <div class="absolute -bottom-28 -right-20 w-[38rem] h-[38rem] rounded-full opacity-25 blur-3xl bg-gradient-to-tr from-lime-100 to-emerald-100 dark:from-lime-900/30 dark:to-emerald-900/30" />
                </div>

                <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div class="relative rounded-3xl border border-emerald-200/60 dark:border-emerald-900/40 bg-white/85 dark:bg-neutral-900/80 backdrop-blur-xl shadow-[0_14px_60px_rgba(16,185,129,.18)]">
                    <div class="absolute -top-3 left-5">
                      <span class="inline-flex items-center gap-2 rounded-full bg-emerald-600 text-white text-[11px] font-semibold tracking-wide px-3 py-1 shadow-sm">
                        <Icon icon="ph:check-circle" class="size-3.5" />
                        Himbauan PPDB
                      </span>
                    </div>

                    <div class="p-6 sm:p-8">
                      <div class="mb-4 inline-flex items-center gap-3">
                        <div class="size-10 rounded-2xl grid place-items-center bg-emerald-100 700 dark:bg-emerald-900/40 dark:300">
                          <span class="text-xl">🟢</span>
                        </div>
                        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                          Informasi Penting Sebelum Mengisi Formulir
                        </h2>
                      </div>

                      <div class="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
                        <p><strong>Assalamu’alaikum warahmatullahi wabarakatuh,</strong></p>
                        <p>Formulir ini digunakan untuk pendaftaran resmi santri baru. Mohon diisi dengan jujur, lengkap, dan sesuai dokumen asli (Akta Kelahiran, Kartu Keluarga, dan NISN).</p>
                        <p>Data yang tercantum akan dipakai sebagai arsip administrasi pondok pesantren dan tidak boleh dipalsukan. Apabila ditemukan ketidaksesuaian data, pihak pondok berhak melakukan klarifikasi dan penyesuaian ulang. Mohon membaca petunjuk dengan seksama sebelum mengisi.</p>
                        <p><strong>Wassalamu’alaikum warahmatullahi wabarakatuh.</strong></p>
                      </div>

                      <div class="mt-6 flex flex-wrap items-center gap-2">
                        <button @click="step += 1"
                          class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-emerald-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-600">
                          <Icon icon="ph:pencil-simple" class="size-4" />
                          Mulai Isi Form
                        </button>

                        <button
                          v-if="ppdbBrochureImages.length"
                          type="button"
                          aria-haspopup="dialog"
                          aria-expanded="false"
                          aria-controls="hs-ppdb-brochure"
                          data-hs-overlay="#hs-ppdb-brochure"
                          class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/80 backdrop-blur px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-2xs hover:bg-white focus:outline-hidden dark:bg-neutral-800/70 dark:border-neutral-700 dark:text-neutral-100">
                          <Icon icon="lucide:download" class="size-4" />
                          Lihat Brosur
                        </button>
                      </div>
                    </div>

                    <div aria-hidden="true" class="absolute -right-6 -bottom-6 opacity-30">
                      <div class="grid grid-cols-6 gap-2 p-6">
                        <span v-for="i in 24" :key="i" class="size-1.5 rounded-full bg-emerald-300/60 dark:bg-emerald-700/60"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <!-- STEP 1: CALON SANTRI -->
              <div v-if="step===1" class="grid sm:grid-cols-2 gap-4">
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Nama Lengkap (Sesuai Akta) <span class="text-red-600">*</span></span>
                  <input v-model="form.siswa.nama" type="text" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" required />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Jenis Kelamin <span class="text-red-600">*</span></span>
                  <select v-model="form.siswa.jk" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" required>
                    <option value="" disabled>Pilih</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Tempat Lahir <span class="text-red-600">*</span></span>
                  <input v-model="form.siswa.tmpLahir" type="text" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" required />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Tanggal Lahir <span class="text-red-600">*</span></span>
                  <input v-model="form.siswa.tglLahir" type="date" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" required />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Tinggi Badan (cm)</span>
                  <input v-model="form.siswa.tinggi" type="number" min="0" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Berat Badan (kg)</span>
                  <input v-model="form.siswa.berat" type="number" min="0" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Cita-cita</span>
                  <input v-model="form.siswa.cita" type="text" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" placeholder="Contoh: Dokter" />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Hobi</span>
                  <input v-model="form.siswa.hobi" type="text" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" placeholder="Contoh: Membaca" />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">No KK <span class="text-red-600">*</span></span>
                  <input v-model="form.siswa.kk" type="text" inputmode="numeric" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">No NIK <span class="text-red-600">*</span></span>
                  <input v-model="form.siswa.nik" type="text" inputmode="numeric" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>
                <label class="block sm:col-span-2">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">NISN <span class="text-red-600">*</span></span>
                  <input v-model="form.siswa.nisn" type="text" inputmode="numeric" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>
              </div>

              <!-- STEP 2: ALAMAT -->
              <div v-else-if="step===2" class="grid sm:grid-cols-2 gap-4">
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Jalan / Gang / No. Rumah <span class="text-red-600">*</span></span>
                  <input v-model="form.alamat.jalan" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" required />
                </label>
                <div class="grid grid-cols-2 gap-3">
                  <label class="block">
                    <span class="text-xs text-gray-600 dark:text-neutral-300">RT</span>
                    <input v-model="form.alamat.rt" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                  </label>
                  <label class="block">
                    <span class="text-xs text-gray-600 dark:text-neutral-300">RW</span>
                    <input v-model="form.alamat.rw" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                  </label>
                </div>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Dusun</span>
                  <input v-model="form.alamat.dusun" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Desa/Kelurahan <span class="text-red-600">*</span></span>
                  <input v-model="form.alamat.desa" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" required />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Kecamatan <span class="text-red-600">*</span></span>
                  <input v-model="form.alamat.kec" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" required />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Kabupaten/Kota <span class="text-red-600">*</span></span>
                  <input v-model="form.alamat.kab" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" required />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Provinsi <span class="text-red-600">*</span></span>
                  <input v-model="form.alamat.prov" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" required />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Kode Pos</span>
                  <input v-model="form.alamat.kodepos" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>

                <div class="sm:col-span-2">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Calon Santri Tinggal Dengan</span>
                  <div class="mt-2 grid sm:grid-cols-3 gap-3 text-sm">
                    <label class="flex items-center gap-2">
                      <input type="radio" value="orangtua" v-model="form.alamat.tinggal" class="rounded border-gray-300 dark:border-neutral-700" />
                      Orangtua Kandung
                    </label>
                    <label class="flex items-center gap-2">
                      <input type="radio" value="wali" v-model="form.alamat.tinggal" class="rounded border-gray-300 dark:border-neutral-700" />
                      Wali
                    </label>
                    <label class="flex items-center gap-2">
                      <input type="radio" value="lainnya" v-model="form.alamat.tinggal" class="rounded border-gray-300 dark:border-neutral-700" />
                      Lainnya
                    </label>
                  </div>
                </div>
              </div>

              <!-- STEP 3: RIWAYAT PENDIDIKAN -->
              <div v-else-if="step===3" class="grid sm:grid-cols-2 gap-4">
                <div class="sm:col-span-2">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Status Sekolah Asal</span>
                  <div class="mt-2 grid sm:grid-cols-4 gap-3 text-sm">
                    <label class="flex items-center gap-2">
                      <input type="radio" value="kelas6" v-model="form.pendidikan.status" class="rounded border-gray-300 dark:border-neutral-700" />
                      Kelas 6 SD/MI (lulus tahun ini)
                    </label>
                    <label class="flex items-center gap-2">
                      <input type="radio" value="kelas9" v-model="form.pendidikan.status" class="rounded border-gray-300 dark:border-neutral-700" />
                      Kelas 9 SMP/MTs (lulus tahun ini)
                    </label>
                    <label class="flex items-center gap-2">
                      <input type="radio" value="tidaksekolah" v-model="form.pendidikan.status" class="rounded border-gray-300 dark:border-neutral-700" />
                      Tidak Sekolah
                    </label>
                    <label class="flex items-center gap-2">
                      <input type="radio" value="lainnya" v-model="form.pendidikan.status" class="rounded border-gray-300 dark:border-neutral-700" />
                      Lainnya
                    </label>
                  </div>
                </div>

                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Nama Sekolah Asal</span>
                  <input v-model="form.pendidikan.sekolah" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" placeholder="SD/MI/SMP/MTs" />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Alamat Sekolah Asal</span>
                  <input v-model="form.pendidikan.alamatSekolah" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>

                <div class="sm:col-span-2">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Pendidikan Keagamaan Non-Formal</span>
                  <div class="mt-2 grid sm:grid-cols-3 gap-3 text-sm">
                    <label class="flex items-center gap-2">
                      <input type="checkbox" value="tpq" v-model="form.pendidikan.nonformal" class="rounded border-gray-300 dark:border-neutral-700" />
                      TPQ/Madin
                    </label>
                    <label class="flex items-center gap-2">
                      <input type="checkbox" value="ponpes" v-model="form.pendidikan.nonformal" class="rounded border-gray-300 dark:border-neutral-700" />
                      Pondok Pesantren
                    </label>
                    <label class="flex items-center gap-2">
                      <input type="checkbox" value="tidak" v-model="form.pendidikan.nonformal" class="rounded border-gray-300 dark:border-neutral-700" />
                      Tidak Pernah
                    </label>
                  </div>
                </div>

                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Nama Lembaga Non-Formal</span>
                  <input v-model="form.pendidikan.nfNama" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Alamat Lembaga Non-Formal</span>
                  <input v-model="form.pendidikan.nfAlamat" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>
              </div>

              <!-- STEP 4: ORANG TUA & WALI -->
              <div v-else-if="step===4" class="grid sm:grid-cols-2 gap-4">
                <!-- Ayah -->
                <div class="sm:col-span-2">
                  <h3 class="font-semibold">Data Ayah Kandung</h3>
                </div>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Nama Ayah <span class="text-red-600">*</span></span>
                  <input v-model="form.ortu.ayah.nama" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" required />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Status</span>
                  <select v-model="form.ortu.ayah.status" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition">
                    <option>Hidup</option>
                    <option>Meninggal</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Pendidikan Terakhir</span>
                  <select v-model="form.ortu.ayah.pendidikan" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition">
                    <option>Tidak Sekolah</option><option>SD</option><option>SMP</option><option>SMA</option><option>D1/D2</option><option>S1</option><option>S2</option><option>S3</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Pekerjaan</span>
                  <select v-model="form.ortu.ayah.pekerjaan" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition">
                    <option>Tidak Bekerja</option><option>Petani</option><option>PNS/ASN</option><option>TNI/POLRI</option><option>Guru</option><option>Swasta</option><option>Wiraswasta</option><option>Pengusaha</option><option>Peternak</option><option>Lainnya</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Penghasilan Per Bulan</span>
                  <select v-model="form.ortu.ayah.penghasilan" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition">
                    <option>&lt; Rp1.000.000</option>
                    <option>Rp1.000.000 - Rp2.000.000</option>
                    <option>Rp2.000.001 - Rp3.000.000</option>
                    <option>Rp3.000.000 - Rp4.000.000</option>
                    <option>&gt; Rp4.000.000</option>
                  </select>
                </label>

                <!-- Ibu -->
                <div class="sm:col-span-2 pt-2">
                  <h3 class="font-semibold">Data Ibu Kandung</h3>
                </div>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Nama Ibu <span class="text-red-600">*</span></span>
                  <input v-model="form.ortu.ibu.nama" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" required />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Status</span>
                  <select v-model="form.ortu.ibu.status" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition">
                    <option>Hidup</option>
                    <option>Meninggal</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Pendidikan Terakhir</span>
                  <select v-model="form.ortu.ibu.pendidikan" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition">
                    <option>Tidak Sekolah</option><option>SD</option><option>SMP</option><option>SMA</option><option>D1/D2</option><option>S1</option><option>S2</option><option>S3</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Pekerjaan</span>
                  <select v-model="form.ortu.ibu.pekerjaan" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition">
                    <option>Tidak Bekerja</option><option>Petani</option><option>PNS/ASN</option><option>TNI/POLRI</option><option>Guru</option><option>Swasta</option><option>Wiraswasta</option><option>Pengusaha</option><option>Peternak</option><option>Lainnya</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Penghasilan Per Bulan</span>
                  <select v-model="form.ortu.ibu.penghasilan" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition">
                    <option>&lt; Rp1.000.000</option>
                    <option>Rp1.000.000–Rp2.000.000</option>
                    <option>Rp2.000.001–Rp3.000.000</option>
                    <option>Rp3.000.001–Rp4.000.000</option>
                    <option>&gt; Rp4.000.000</option>
                  </select>
                </label>

                <!-- Kontak & Wali -->
                <label class="block sm:col-span-2">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Nomor HP 1 (WA aktif, masuk grup) <span class="text-red-600">*</span></span>
                  <input v-model="form.ortu.hp1" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" required placeholder="*08xxxxxxxxxx" />
                </label>
                <label class="block sm:col-span-2">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Nomor HP 2 (Opsional)</span>
                  <input v-model="form.ortu.hp2" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>

                <div class="sm:col-span-2 pt-2">
                  <h3 class="font-semibold">Data Wali (opsional)</h3>
                </div>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Nama Wali</span>
                  <input v-model="form.wali.nama" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Status</span>
                  <select v-model="form.wali.status" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition">
                    <option>Hidup</option>
                    <option>Meninggal</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Pendidikan Terakhir</span>
                  <select v-model="form.wali.pendidikan" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition">
                    <option>Tidak Sekolah</option><option>SD</option><option>SMP</option><option>SMA</option><option>D1/D2</option><option>S1</option><option>S2</option><option>S3</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Pekerjaan</span>
                  <select v-model="form.wali.pekerjaan" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition">
                    <option>Tidak Bekerja</option><option>Petani</option><option>PNS/ASN</option><option>TNI/POLRI</option><option>Guru</option><option>Swasta</option><option>Wiraswasta</option><option>Pengusaha</option><option>Peternak</option><option>Lainnya</option>
                  </select>
                </label>
                <label class="block sm:col-span-2">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Nomor HP Wali (Opsional)</span>
                  <input v-model="form.wali.hp" class="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>
              </div>

              <!-- STEP 5: DOKUMEN -->
              <div v-else-if="step===5" class="grid sm:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <span class=text-xs text-gray-600 dark:text-neutral-300>Kartu Keluarga (PDF/JPG) <span class="text-red-600">*</span></span>
                  <div class="relative rounded-xl border border-dashed border-gray-300 dark:border-neutral-700 p-4 bg-white/70 dark:bg-neutral-900/60 text-sm flex items-center justify-between gap-3" @dragover.prevent @drop="onDrop($event,'kk')">
                    <div class="flex items-center gap-3">
                      <div class="shrink-0 rounded-md bg-gray-100 dark:bg-neutral-800 p-2 text-gray-600 dark:text-neutral-300">📎</div>
                      <div>
                        <p class="font-medium">{{ files.kk?.file?.name || 'Tarik & lepas file ke sini' }}</p>
                        <p class="sub">{{ fileSizeText(files.kk?.file?.size) || 'Maks 2MB' }}</p>
                      </div>
                    </div>
                    <label class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 px-3 py-2 text-sm font-medium hover:bg-white dark:hover:bg-neutral-800">
                      <input type="file" class="hidden" accept=".pdf,image/*" @change="onPick($event,'kk')" />
                      Pilih File
                    </label>
                  </div>
                  <img v-if="files.kk?.url && isImage(files.kk?.file)" :src="files.kk.url" class="text-xs text-gray-600 dark:text-neutral-300" @error="hideImg($event)" />
                </div>

                <div class="space-y-1.5">
                  <span class=text-xs text-gray-600 dark:text-neutral-300>Akte Kelahiran (PDF/JPG) <span class="text-red-600">*</span></span>
                  <div class="relative rounded-xl border border-dashed border-gray-300 dark:border-neutral-700 p-4 bg-white/70 dark:bg-neutral-900/60 text-sm flex items-center justify-between gap-3" @dragover.prevent @drop="onDrop($event,'akte')">
                    <div class="flex items-center gap-3">
                      <div class="shrink-0 rounded-md bg-gray-100 dark:bg-neutral-800 p-2 text-gray-600 dark:text-neutral-300">📎</div>
                      <div>
                        <p class="font-medium">{{ files.akte?.file?.name || 'Tarik & lepas file ke sini' }}</p>
                        <p class="sub">{{ fileSizeText(files.akte?.file?.size) || 'Maks 2MB' }}</p>
                      </div>
                    </div>
                    <label class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 px-3 py-2 text-sm font-medium hover:bg-white dark:hover:bg-neutral-800">
                      <input type="file" class="hidden" accept=".pdf,image/*" @change="onPick($event,'akte')" />
                      Pilih File
                    </label>
                  </div>
                  <img v-if="files.akte?.url && isImage(files.akte?.file)" :src="files.akte.url" class="text-xs text-gray-600 dark:text-neutral-300" @error="hideImg($event)" />
                </div>

                <div class="space-y-1.5">
                  <span class=text-xs text-gray-600 dark:text-neutral-300>Raport Terakhir (PDF) <span class="text-red-600">*</span></span>
                  <div class="relative rounded-xl border border-dashed border-gray-300 dark:border-neutral-700 p-4 bg-white/70 dark:bg-neutral-900/60 text-sm flex items-center justify-between gap-3" @dragover.prevent @drop="onDrop($event,'raport')">
                    <div class="flex items-center gap-3">
                      <div class="shrink-0 rounded-md bg-gray-100 dark:bg-neutral-800 p-2 text-gray-600 dark:text-neutral-300">📎</div>
                      <div>
                        <p class="font-medium">{{ files.raport?.file?.name || 'Tarik & lepas file ke sini' }}</p>
                        <p class="sub">{{ fileSizeText(files.raport?.file?.size) || 'Maks 5MB' }}</p>
                      </div>
                    </div>
                    <label class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 px-3 py-2 text-sm font-medium hover:bg-white dark:hover:bg-neutral-800">
                      <input type="file" class="hidden" accept=".pdf" @change="onPick($event,'raport')" />
                      Pilih File
                    </label>
                  </div>
                </div>

                <div class="space-y-1.5">
                  <span class=text-xs text-gray-600 dark:text-neutral-300>Pas Foto 3x4 (JPG/PNG) <span class="text-red-600">*</span></span>
                  <div class="relative rounded-xl border border-dashed border-gray-300 dark:border-neutral-700 p-4 bg-white/70 dark:bg-neutral-900/60 text-sm flex items-center justify-between gap-3" @dragover.prevent @drop="onDrop($event,'foto')">
                    <div class="flex items-center gap-3">
                      <div class="shrink-0 rounded-md bg-gray-100 dark:bg-neutral-800 p-2 text-gray-600 dark:text-neutral-300">📎</div>
                      <div>
                        <p class="font-medium">{{ files.foto?.file?.name || 'Tarik & lepas file ke sini' }}</p>
                        <p class="sub">{{ fileSizeText(files.foto?.file?.size) || 'Maks 1MB' }}</p>
                      </div>
                    </div>
                    <label class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 px-3 py-2 text-sm font-medium hover:bg-white dark:hover:bg-neutral-800">
                      <input type="file" class="hidden" accept="image/*" @change="onPick($event,'foto')" />
                      Pilih File
                    </label>
                  </div>
                  <img v-if="files.foto?.url && isImage(files.foto?.file)" :src="files.foto.url" class="text-xs text-gray-600 dark:text-neutral-300" @error="hideImg($event)" />
                </div>

                <div class="sm:col-span-2">
                  <label class="flex items-start gap-3">
                    <input type="checkbox" v-model="form.pernyataan.keaslian" class="rounded border-gray-300 dark:border-neutral-700" />
                    <span class="text-sm">Saya menyatakan semua dokumen yang diunggah adalah <b>asli/scan dokumen resmi</b>.</span>
                  </label>
                </div>
              </div>

              <!-- STEP 6: KONFIRMASI -->
              <div v-else-if="step===6" class="space-y-4">
                <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-4">
                  <div class="flex items-center gap-2 text-sm font-semibold">
                    <Icon icon="ph:check-circle" class="size-5 600 dark:400" />
                    Ringkasan Pendaftaran
                  </div>
                  <div class="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
                    <div class="flex justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-1"><dt>Nama</dt><dd>{{ form.siswa.nama || '—' }}</dd></div>
                    <div class="flex justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-1"><dt>Gender</dt><dd>{{ form.siswa.jk || '—' }}</dd></div>
                    <div class="flex justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-1"><dt>TTL</dt><dd>{{ (form.siswa.tmpLahir || '-') + ', ' + (form.siswa.tglLahir || '-') }}</dd></div>
                    <div class="flex justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-1"><dt>Tinggi/Berat</dt><dd>{{ (form.siswa.tinggi||'—') + ' / ' + (form.siswa.berat||'—') }}</dd></div>
                    <div class="flex justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-1"><dt>NIK</dt><dd>{{ form.siswa.nik || '—' }}</dd></div>
                    <div class="flex justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-1"><dt>NISN</dt><dd>{{ form.siswa.nisn || '—' }}</dd></div>
                    <div class="flex justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-1"><dt>Alamat</dt><dd>{{ alamatSingkat }}</dd></div>
                    <div class="flex justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-1"><dt>Jenjang</dt><dd>{{ jenjangFromStatus(form.pendidikan.status) }}</dd></div>
                    <div class="flex justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-1"><dt>HP Ortu</dt><dd>{{ form.ortu.hp1 || '—' }}</dd></div>
                    <div class="flex justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-1"><dt>Dokumen</dt><dd>{{ dokumenCheck }}</dd></div>
                  </div>
                  <p class="mt-3 text-[12px] text-gray-500 dark:text-neutral-400">Periksa kembali data Anda sebelum mengirim.</p>
                </div>

                <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-4 bg-emerald-50/60 dark:bg-neutral-800/40">
                  <p class="text-sm 800 dark:300">
                    Setelah terkirim, Anda akan mendapatkan <b>Nomor Pendaftaran</b> dan kredensial sementara (<i>username</i> & <i>publicToken</i>).
                  </p>
                </div>
              </div>

              <!-- ACTIONS -->
              <div class="mt-6 flex items-center justify-between flex-wrap">
                <button :disabled="step===6 || loading" @click="prev"
                        class="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 px-4 py-2.5 text-sm font-medium hover:bg-white dark:hover:bg-neutral-800 disabled:opacity-60">
                  <Icon icon="ph:arrow-left" class="size-4" />
                  Kembali
                </button>

                <div class="flex items-center flex-wrap gap-2">
                  <button v-if="step<steps.length-1" :disabled="!canNext || loading" @click="next"
                          class="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60">
                    Lanjut
                    <Icon icon="ph:arrow-right" class="size-4" />
                  </button>
                  <button v-else :disabled="!canSubmit || loading" @click="submit"
                          class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60">
                    <Icon v-if="loading" icon="mingcute:loading-fill" class="size-4 animate-spin" />
                    <Icon v-else icon="ph:paper-plane-tilt" class="size-4" />
                    Kirim Pendaftaran
                  </button>
                </div>
              </div>

              <p v-if="feedback" class="mt-3 text-[12px]" :class="ok ? '700 dark:300' : 'text-red-600'">{{ feedback }}</p>

              <!-- Receipt -->
              <div v-if="ok && regInfo" class="mt-4 space-y-3">
                <div class="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-900/20 p-4">
                  <p class="text-sm">
                    Pendaftaran berhasil. Nomor Pendaftaran: <b>{{ regInfo.code }}</b><br>
                    Simpan nomor ini untuk pengecekan status selanjutnya.
                  </p>
                </div>

                <div v-if="receipt" class="rounded-xl border border-gray-200 dark:border-neutral-800 p-4">
                  <h4 class="font-semibold mb-2 text-sm">Akun Sementara</h4>
                  <div class="grid sm:grid-cols-2 gap-3 text-sm">
                    <div class="flex items-center justify-between gap-3">
                      <span class="text-gray-500 dark:text-neutral-400">Username</span>
                      <div class="flex items-center gap-2">
                        <code class="px-2 py-1 rounded bg-gray-100 dark:bg-neutral-800">{{ receipt.username }}</code>
                        <button @click="copy(receipt.username)" class=".code { @apply px-2 py-1 rounded bg-gray-100 dark:bg-neutral-800; }">Copy</button>
                      </div>
                    </div>
                    <div class="flex items-center justify-between gap-3">
                      <span class="text-gray-500 dark:text-neutral-400">Public Token</span>
                      <div class="flex items-center gap-2">
                        <code class="px-2 py-1 rounded bg-gray-100 dark:bg-neutral-800">{{ receipt.publicToken }}</code>
                        <button @click="copy(receipt.publicToken)" class=".code { @apply px-2 py-1 rounded bg-gray-100 dark:bg-neutral-800; }">Copy</button>
                      </div>
                    </div>
                  </div>
                  <p class="mt-2 text-[12px] text-gray-500 dark:text-neutral-400">
                    Secret token disimpan aman (hash) dan <b>tidak</b> ditampilkan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Overlay: PPDB Brochure Viewer -->
        <div
          id="hs-ppdb-brochure"
          class="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto"
          role="dialog" tabindex="-1" aria-labelledby="hs-ppdb-brochure-label"
        >
          <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all md:max-w-5xl md:w-full m-3 md:mx-auto">
            <div class="relative flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl overflow-hidden dark:bg-neutral-900 dark:border-neutral-800">
              <!-- Close -->
              <div class="absolute top-2 end-2">
                <button type="button" class="size-8 inline-flex justify-center items-center rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-300" aria-label="Close" data-hs-overlay="#hs-ppdb-brochure">
                  <span class="sr-only">Close</span>
                  <svg class="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <!-- Header -->
              <div class="px-5 sm:px-8 pt-6 pb-3 border-b border-gray-200 dark:border-neutral-800">
                <h3 id="hs-ppdb-brochure-label" class="text-lg font-semibold text-gray-800 dark:text-neutral-200">Brosur PPDB</h3>
                <p class="text-xs text-gray-500 dark:text-neutral-400">Gunakan <code>CTRL</code> untuk zoom. Seret untuk geser.</p>
              </div>

              <!-- Stage -->
              <div
                v-if="ppdbBrochureImages.length"
                class="relative w-full aspect-video rounded-xl border border-gray-200 overflow-hidden bg-gray-100 dark:border-neutral-800 dark:bg-neutral-800 select-none"
              >
                <div
                  ref="ppdbStageRef"
                  :class="ppdbDragging ? 'cursor-grabbing' : 'cursor-grab'"
                  class="absolute inset-0 touch-pan-y touch-pan-x"
                  @wheel="ppdbOnWheel"
                  @mousedown="ppdbOnPointerDown"
                  @mousemove="ppdbOnPointerMove"
                  @mouseup="ppdbOnPointerUp"
                  @mouseleave="ppdbOnPointerUp"
                  @touchstart.passive="ppdbOnTouchStart"
                  @touchmove.prevent="ppdbOnTouchMove"
                  @touchend="ppdbOnTouchEnd"
                  @dblclick="ppdbOnDblClick"
                >
                  <img
                    :src="ppdbBrochureImages[ppdbIdx]"
                    :alt="`Brosur ${ppdbIdx + 1}`"
                    class="absolute top-1/2 left-1/2 will-change-transform"
                    :style="ppdbImgStyle"
                    draggable="false"
                    loading="eager"
                  />
                </div>

                <!-- HUD -->
                <div class="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/50 text-white text-xs">
                  {{ ppdbIdx + 1 }} / {{ ppdbBrochureImages.length }} • {{ Math.round(ppdbScale * 100) }}%
                </div>

                <!-- Nav -->
                <button @click="ppdbPrev" class="absolute top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full size-9 bg-white/80 hover:bg-white shadow border border-gray-200 dark:bg-neutral-700/80 dark:hover:bg-neutral-700 dark:border-neutral-600 left-2">
                  <svg class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L8.414 10l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"/></svg>
                </button>
                <button @click="ppdbNext" class="absolute top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full size-9 bg-white/80 hover:bg-white shadow border border-gray-200 dark:bg-neutral-700/80 dark:hover:bg-neutral-700 dark:border-neutral-600 right-2">
                  <svg class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 4.293a1 1 0 011.414 0L13.707 9.293a1 1 0 010 1.414L8.707 15.707a1 1 0 01-1.414-1.414L10.586 10 7.293 6.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                </button>

                <!-- Tools -->
                <div class="absolute top-2 left-2 flex gap-2">
                  <button @click="ppdbZoomOut" class="inline-flex items-center justify-center rounded-md px-2 py-1 text-xs bg-white/80 hover:bg-white border border-gray-200 shadow dark:bg-neutral-700/80 dark:hover:bg-neutral-700 dark:border-neutral-600">-</button>
                  <button @click="ppdbReset"   class="inline-flex items-center justify-center rounded-md px-2 py-1 text-xs bg-white/80 hover:bg-white border border-gray-200 shadow dark:bg-neutral-700/80 dark:hover:bg-neutral-700 dark:border-neutral-600">Reset</button>
                  <button @click="ppdbZoomIn"  class="inline-flex items-center justify-center rounded-md px-2 py-1 text-xs bg-white/80 hover:bg-white border border-gray-200 shadow dark:bg-neutral-700/80 dark:hover:bg-neutral-700 dark:border-neutral-600">+</button>
                </div>
              </div>

              <!-- Footer -->
              <div class="flex flex-wrap justify-between items-center gap-2 py-3 px-4 bg-gray-50 border-t border-gray-200 dark:bg-neutral-950 dark:border-neutral-800">
                <div class="text-xs text-gray-500 dark:text-neutral-400">
                  Total: {{ ppdbBrochureImages.length }} file
                </div>
                <div class="flex gap-2">
                  <a
                    :href="ppdbBrochureImages[ppdbIdx]"
                    download
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  >
                    <Icon icon="lucide:download" class="size-4" />
                    Unduh
                  </a>
                  <button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-700" data-hs-overlay="#hs-ppdb-brochure">
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: HELP CARDS -->
        <aside class="lg:col-span-4">
          <div class="space-y-4">
            <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 backdrop-blur p-5 shadow">
              <div class="flex items-center gap-2">
                <Icon icon="ph:list-checks" class="size-5 600 dark:400" />
                <h3 class="font-semibold">Syarat Umum & Petunjuk</h3>
              </div>
              <ul class="mt-3 text-sm space-y-2">
                <li class="flex items-start gap-2">Siapkan: Akta Kelahiran, KK, NISN.</li>
                <li class="flex items-start gap-2">Masukkan nomor (NIK/KK/NISN/HP) sesuai format instansi asal.</li>
                <li class="flex items-start gap-2">Gunakan huruf kapital seperlunya (nama, alamat).</li>
              </ul>
            </div>

            <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 backdrop-blur p-5 shadow">
              <div class="flex items-center gap-2">
                <Icon icon="ph:calendar-check" class="size-5 600 dark:400" />
                <h3 class="font-semibold">Timeline</h3>
              </div>
              <ul class="mt-3 text-sm space-y-2">
                <li class="flex items-start gap-2">Pendaftaran: 1 Jan — 30 Mar {{ PPDB_YEAR }}</li>
                <li class="flex items-start gap-2">Tes Seleksi: 5—15 Apr {{ PPDB_YEAR }}</li>
                <li class="flex items-start gap-2">Pengumuman: 25 Apr {{ PPDB_YEAR }}</li>
              </ul>
            </div>

            <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 backdrop-blur p-5 shadow">
              <div class="flex items-center gap-2">
                <Icon icon="ph:headset" class="size-5 600 dark:400" />
                <h3 class="font-semibold">Kontak Panitia</h3>
              </div>
              <ul class="mt-3 text-sm space-y-2">
                <li class="flex items-center gap-2">
                  <Icon icon="ph:whatsapp-logo" class="size-4 text-green-600 dark:text-green-400" />
                  <a :href="waUrl" target="_blank" class="hover:underline">{{ waText }}</a>
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="ph:envelope-simple" class="size-4 600 dark:400" />
                  <a href="mailto:ppdb@alberr.sch.id" class="hover:underline">ppdb@alberr.sch.id</a>
                </li>
              </ul>
              <div class="mt-4 rounded-lg border border-dashed border-gray-300 dark:border-neutral-700 p-3 text-[12px] text-gray-500 dark:text-neutral-400">
                Data tersimpan <b>lokal</b> di perangkat hingga dikirim.
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute } from '#imports'
import { useSeoMeta, useHead, useRuntimeConfig, useNuxtApp } from '#app'

/** ===== Configurable ===== */
const PPDB_YEAR = 2025
const waText = '+62 812-3456-7890'
const waUrl  = 'https://wa.me/6281234567890'
const ppdbBrochureImages = ref<string[]>(['/assets/images/brochures/1.jpg','/assets/images/brochures/2.jpg'])

/** ===== SEO ===== */
const route = useRoute()
const config = useRuntimeConfig()
const url = computed(() => new URL(route.fullPath || '/registrationPPDB', config.public.siteUrl).toString())
const title = `PPDB Online ${PPDB_YEAR}/${PPDB_YEAR+1} — Ponpes Alberr`
const description = 'Daftar santri baru Ponpes Alberr secara online. Isi data, unggah dokumen, dan pantau status pendaftaran.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogUrl: url.value,
  ogImage: '/assets/logo.png',
  twitterCard: 'summary_large_image',
  themeColor: '#0ea5e9',
  robots: 'index, follow'
})
useHead({
  link: [{ rel: 'canonical', href: url.value }],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: `PPDB Ponpes Alberr ${PPDB_YEAR}/${PPDB_YEAR+1}`,
        description,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
        startDate: `${PPDB_YEAR}-01-01`,
        endDate: `${PPDB_YEAR}-03-30`,
        url: url.value,
        organizer: {
          '@type': 'EducationalOrganization',
          name: 'Pondok Pesantren Alberr',
          url: config.public.siteUrl
        },
        location: { '@type': 'VirtualLocation', url: url.value },
        image: [`${config.public.siteUrl}/assets/logo.png`]
      })
    }
  ]
})

/** ===== Steps ===== */
const steps = [
  { key:'cover',   label:'Form Cover',      icon:'lets-icons:form' },
  { key:'siswa',   label:'Calon Santri',    icon:'ph:user' },
  { key:'alamat',  label:'Alamat',          icon:'ph:map-pin' },
  { key:'pend',    label:'Pendidikan',      icon:'ph:books' },
  { key:'ortu',    label:'Orang Tua & Wali',icon:'ph:users-three' },
  { key:'dok',     label:'Dokumen',         icon:'ph:cloud-arrow-up' },
  { key:'ok',      label:'Konfirmasi',      icon:'ph:check-circle' }
] as const

const step = ref(0)
const progress = computed(() => Math.round(((step.value+1) / steps.length) * 100))
function next(){ if (canNext.value && step.value < steps.length-1) step.value++ }
function prev(){ if (step.value > 0) step.value-- }
function go(i:number){ if (i<=step.value || validStep(step.value)) step.value = i }

/** ===== Brosur Viewer (pan/zoom) ===== */
const ppdbIdx = ref(0)
function ppdbPrev(){ const n=ppdbBrochureImages.value.length; if(!n) return; ppdbIdx.value=(ppdbIdx.value-1+n)%n }
function ppdbNext(){ const n=ppdbBrochureImages.value.length; if(!n) return; ppdbIdx.value=(ppdbIdx.value+1)%n }
const ppdbScale = ref(1), ppdbTx = ref(0), ppdbTy = ref(0), ppdbDragging = ref(false)
const ppdbMin = 0.1, ppdbMax = 4
let _sx=0,_sy=0,_stx=0,_sty=0, _pinchDist=0, _pinchScale=1, _pinchCenter={x:0,y:0}
const ppdbStageRef = ref<HTMLElement | null>(null)
const ppdbImgStyle = computed(() => ({ transform:`translate(${ppdbTx.value}px, ${ppdbTy.value}px) scale(${ppdbScale.value}) translate(-50%, -50%)`, transformOrigin:'0 0', maxWidth:'none', maxHeight:'none' }))
function ppdbReset(){ ppdbScale.value=1; ppdbTx.value=0; ppdbTy.value=0 }
function ppdbZoomIn(){ ppdbScale.value=Math.min(ppdbMax, ppdbScale.value*1.2) }
function ppdbZoomOut(){ ppdbScale.value=Math.max(ppdbMin, ppdbScale.value/1.2) }
function _clampPan(){
  const el=ppdbStageRef.value; if(!el) return
  const rect=el.getBoundingClientRect()
  const bx=(rect.width*(ppdbScale.value-1))/2
  const by=(rect.height*(ppdbScale.value-1))/2
  ppdbTx.value=Math.max(Math.min(ppdbTx.value,bx),-bx)
  ppdbTy.value=Math.max(Math.min(ppdbTy.value,by),-by)
}
function ppdbOnWheel(e:WheelEvent){
  const rect=(e.currentTarget as HTMLElement).getBoundingClientRect()
  const cx=e.clientX-rect.left-rect.width/2
  const cy=e.clientY-rect.top-rect.height/2
  if(e.ctrlKey){
    e.preventDefault()
    const prev=ppdbScale.value
    let next=prev*(1-e.deltaY*0.0005)
    next=Math.min(Math.max(next,ppdbMin),ppdbMax)
    if(next===prev) return
    const k=next/prev
    ppdbTx.value=cx-k*(cx-ppdbTx.value)
    ppdbTy.value=cy-k*(cy-ppdbTy.value)
    ppdbScale.value=next
    _clampPan()
  } else if (ppdbScale.value>1){
    e.preventDefault()
    ppdbTx.value-=e.deltaX
    ppdbTy.value-=e.deltaY
    _clampPan()
  }
}
function ppdbOnPointerDown(e:MouseEvent){ if(e.button!==0) return; ppdbDragging.value=true; _sx=e.clientX; _sy=e.clientY; _stx=ppdbTx.value; _sty=ppdbTy.value }
function ppdbOnPointerMove(e:MouseEvent){ if(!ppdbDragging.value) return; ppdbTx.value=_stx+(e.clientX-_sx); ppdbTy.value=_sty+(e.clientY-_sy); _clampPan() }
function ppdbOnPointerUp(){ ppdbDragging.value=false }
function ppdbOnDblClick(e:MouseEvent){
  const rect=(e.currentTarget as HTMLElement).getBoundingClientRect()
  const cx=e.clientX-rect.left-rect.width/2
  const cy=e.clientY-rect.top-rect.height/2
  const prev=ppdbScale.value
  const next=prev<2?2:1
  const k=next/prev
  ppdbTx.value=cx-k*(cx-ppdbTx.value)
  ppdbTy.value=cy-k*(cy-ppdbTy.value)
  ppdbScale.value=next
  if(next===1){ ppdbTx.value=0; ppdbTy.value=0 }
  _clampPan()
}
function _dist(t1:Touch,t2:Touch){ const dx=t2.clientX-t1.clientX, dy=t2.clientY-t1.clientY; return Math.hypot(dx,dy) }
function _mid(t1:Touch,t2:Touch,rect:DOMRect){ return { x:((t1.clientX+t2.clientX)/2)-rect.left-rect.width/2, y:((t1.clientY+t2.clientY)/2)-rect.top-rect.height/2 } }
function ppdbOnTouchStart(e:TouchEvent){
  if(e.touches.length===1){ ppdbDragging.value=true; _sx=e.touches[0]!.clientX; _sy=e.touches[0]!.clientY; _stx=ppdbTx.value; _sty=ppdbTy.value }
  else if(e.touches.length===2){ const rect=(e.currentTarget as HTMLElement).getBoundingClientRect(); _pinchDist=_dist(e.touches[0]!,e.touches[1]!); _pinchScale=ppdbScale.value; _pinchCenter=_mid(e.touches[0]!,e.touches[1]!,rect) }
}
function ppdbOnTouchMove(e:TouchEvent){
  if(e.touches.length===1 && ppdbDragging.value){ ppdbTx.value=_stx+(e.touches[0]!.clientX-_sx); ppdbTy.value=_sty+(e.touches[0]!.clientY-_sy); _clampPan() }
  else if (e.touches.length===2 && _pinchDist>0){
    const curr=_dist(e.touches[0]!,e.touches[1]!)
    let next=_pinchScale*(curr/_pinchDist)
    next=Math.min(Math.max(next,ppdbMin),ppdbMax)
    const prev=ppdbScale.value
    const k=next/prev
    ppdbTx.value=_pinchCenter.x-k*(_pinchCenter.x-ppdbTx.value)
    ppdbTy.value=_pinchCenter.y-k*(_pinchCenter.y-ppdbTy.value)
    ppdbScale.value=next
    _clampPan()
  }
}
function ppdbOnTouchEnd(){ ppdbDragging.value=false; if(_pinchDist>0 && ppdbScale.value<1.02) ppdbReset(); _pinchDist=0 }

/** ===== State ===== */
const form = reactive({
  siswa: { nama:'', jk:'', tmpLahir:'', tglLahir:'', tinggi:'', berat:'', cita:'', hobi:'', kk:'', nik:'', nisn:'' },
  alamat: { jalan:'', rt:'', rw:'', dusun:'', desa:'', kec:'', kab:'', prov:'', kodepos:'', tinggal:'orangtua' },
  pendidikan: { status:'', sekolah:'', alamatSekolah:'', nonformal:[] as string[], nfNama:'', nfAlamat:'' },
  ortu: { ayah:{nama:'',status:'Hidup',pendidikan:'',pekerjaan:'',penghasilan:''}, ibu:{nama:'',status:'Hidup',pendidikan:'',pekerjaan:'',penghasilan:''}, hp1:'', hp2:'' },
  wali: { nama:'', status:'Hidup', pendidikan:'', pekerjaan:'', penghasilan:'', hp:'' },
  pernyataan: { keaslian:false }
})

type FileBox = { file: File|null, url: string|null }
const files = reactive<Record<'kk'|'akte'|'raport'|'foto', FileBox>>({
  kk:{file:null,url:null}, akte:{file:null,url:null}, raport:{file:null,url:null}, foto:{file:null,url:null}
})

/** ===== Validation ===== */
function validStep(i: number) {
  switch (i) {
    case 0: return true
    case 1: return !!(form.siswa.nama && form.siswa.jk && form.siswa.tmpLahir && form.siswa.tglLahir)
    case 2: return !!(form.alamat.jalan && form.alamat.desa && form.alamat.kec && form.alamat.kab && form.alamat.prov)
    case 3: return true
    case 4: return !!(form.ortu.ayah.nama && form.ortu.ibu.nama && form.ortu.hp1)
    case 5: return !!(files.kk.file && files.akte.file && files.raport.file && files.foto.file && form.pernyataan.keaslian)
    case 6: return true
    default: return false
  }
}
const canNext   = computed(() => validStep(step.value))
const canSubmit = computed(() => validStep(5))

/** ===== Local draft ===== */
const DRAFT_KEY = 'ppdb_registration_v2_santrirow'
onMounted(() => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      Object.assign(form, parsed.form || {})
      Object.keys(files).forEach(k => (files as any)[k] = {file:null,url:null})
      step.value = parsed.step ?? 0
    }
  } catch {}
})
watch(form, () => {
  localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, step: step.value }))
}, { deep:true })
function clearDraft(){
  localStorage.removeItem(DRAFT_KEY)
  window.location.reload()
}

/** ===== UI helpers ===== */
const alamatSingkat = computed(() => {
  const a = form.alamat
  const parts = [a.jalan, a.desa, a.kec, a.kab, a.prov].filter(Boolean)
  return parts.length ? parts.join(', ') : '—'
})
const dokumenCheck = computed(() => {
  const ok = ['kk','akte','raport','foto'].every(k => (files as any)[k]?.file)
  return ok ? 'Lengkap' : 'Belum Lengkap'
})
function fileSizeText(size?: number){ if(!size) return ''; const kb=Math.round(size/1024); return `${kb} KB` }
function isImage(f?: File|null){ return !!f && f.type.startsWith('image/') }
function hideImg(e:any){ e.target.style.display='none' }
function onPick(e:any, key:'kk'|'akte'|'raport'|'foto'){ const f=e.target.files?.[0]||null; (files as any)[key]={ file:f, url:f?URL.createObjectURL(f):null } }
function onDrop(e:DragEvent, key:'kk'|'akte'|'raport'|'foto'){ const f=e.dataTransfer?.files?.[0]||null; (files as any)[key]={ file:f, url:f?URL.createObjectURL(f):null } }

/** ===== Token & jenjang helpers ===== */
const BASE62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
function randomBase62(len: number){ const arr=new Uint32Array(len); crypto.getRandomValues(arr); let out=''; for(let i=0;i<len;i++) out+=BASE62[arr[i]%BASE62.length]; return out }
function slugName(n: string){ return (n||'').toLowerCase().replace(/[^a-z0-9]+/g,'').slice(0,12)||'user' }
function genUsername(name: string, regId: string){ return `${slugName(name)}_${(regId||'').slice(-4).toLowerCase()}` }
function jenjangFromStatus(s: string){
  switch(s){
    case 'kelas6': return 'KMI • MTs 1'
    case 'kelas9': return 'KMI • MA 1'
    case 'tidaksekolah': return 'KMI • —'
    default: return 'KMI • —'
  }
}
async function sha256Hex(input: string){ const enc=new TextEncoder().encode(input); const hash=await crypto.subtle.digest('SHA-256',enc); return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('') }

/** ===== Firebase ===== */
import { getApps } from 'firebase/app'
import { set, push, ref as dbRef, serverTimestamp } from 'firebase/database'
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage'

function storageSafe() {
  try {
    const { $firebaseStorage } = useNuxtApp() as any
    if ($firebaseStorage) return $firebaseStorage
  } catch {}
  const apps = getApps()
  if (!apps.length) throw new Error('Firebase belum diinisialisasi di Nuxt plugin.')
  return getStorage(apps[0])
}

/** ===== Submit ===== */
const loading = ref(false)
const feedback = ref('')
const ok = ref(false)
const regInfo = ref<{ id:string, code:string } | null>(null)
const receipt = ref<{ username:string, publicToken:string } | null>(null)

function extOf(f: File) {
  const guess = f.name.split('.').pop() || ''
  return guess ? `.${guess}` : (f.type.includes('pdf')?'.pdf':f.type.includes('jpeg')?'.jpg':f.type.includes('png')?'.png':'')
}
function validateFileSizes(): string | null {
  const lim = { kk: 2*1024*1024, akte: 2*1024*1024, raport: 5*1024*1024, foto: 1*1024*1024 }
  for (const k of Object.keys(lim) as Array<keyof typeof lim>) {
    const f = files[k]?.file
    if (!f) return 'Mohon lengkapi semua dokumen.'
    if (f.size > lim[k]) return `Ukuran ${k.toUpperCase()} melebihi batas.`
  }
  return null
}
function niceCode(id: string) {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth()+1).padStart(2,'0')
  const dd = String(d.getDate()).padStart(2,'0')
  return `ALB-${y}${m}${dd}-${id.slice(-5).toUpperCase()}`
}

function primaryWaliName(): string {
  // Prioritas nama wali santri (untuk kolom 'walisantri' di SantriRow):
  // 1) form.wali.nama jika diisi
  // 2) form.ortu.ayah.nama jika ada, else ibu
  return (form.wali.nama?.trim())
    || (form.ortu.ayah.nama?.trim())
    || (form.ortu.ibu.nama?.trim())
    || ''
}

/** ===== Clipboard helper ===== */
async function copy(text: string){
  try { await navigator.clipboard.writeText(text) } catch {}
}

async function submit(){
  if (!canSubmit.value) return
  const fileErr = validateFileSizes()
  if (fileErr){ feedback.value = fileErr; ok.value = false; return }

  loading.value = true
  feedback.value = ''
  ok.value = false
  regInfo.value = null
  receipt.value = null

  try {
    const { $realtimeDb } = useNuxtApp() as any
    if (!$realtimeDb) throw new Error('Realtime Database tidak tersedia.')

    // Generate new ID
    const baseRef = dbRef($realtimeDb, 'alberr/santri')
    const newRef  = push(baseRef)
    const regId   = newRef.key as string
    const code    = niceCode(regId)

    // Upload dokumen
    const store = storageSafe()
    const pathBase = `alberr/santri/berkas/${regId}`
    const up = async (key:'kk'|'akte'|'raport'|'foto') => {
      const f = files[key].file as File
      const storagePath = `${pathBase}/${key}${extOf(f)}`
      const r = sRef(store, storagePath)
      await uploadBytes(r, f)
      return await getDownloadURL(r)
    }
    const [kkUrl, akteUrl, raportUrl, fotoUrl] = await Promise.all([ up('kk'), up('akte'), up('raport'), up('foto') ])

    // Credentials
    const username    = genUsername(form.siswa.nama, regId)
    const publicToken = 'pub_' + randomBase62(24)
    const secretToken = 'sec_' + randomBase62(48)
    const secretHash  = 'sha256:' + await sha256Hex(secretToken)

    // ====== Bentuk data sesuai SantriRow (untuk santri.vue) ======
    const santriRow = {
      id: regId,
      gen: String(PPDB_YEAR),
      santri: (form.siswa.nama || '').trim(),
      walisantri: primaryWaliName(),
      nohp: (form.ortu.hp1 || '').trim(),
      kuotaKunjunganBulanIni: 0,
      kamar: '-',
      maskan: '-', // dipakai oleh cell-kamar di santri.vue
      jenjang: jenjangFromStatus(form.pendidikan.status),
      alamat: alamatSingkat.value,
      status: 'nonaktif' // default: belum aktif hingga diverifikasi admin
    }

    // Rekam lengkap (node utama) — aman untuk dilihat admin
    const record = {
      ...santriRow,
      username,
      publicToken,
      ppdbCode: code,
      createdAt: serverTimestamp(),
      ppdb: {
        siswa: form.siswa,
        alamat: form.alamat,
        pendidikan: form.pendidikan,
        ortu: form.ortu,
        wali: form.wali,
      },
      dokumen: { kkUrl, akteUrl, raportUrl, fotoUrl },
      meta: { ua: navigator.userAgent, tz: Intl.DateTimeFormat().resolvedOptions().timeZone }
    }

    // Tulis utama (dibaca oleh useSantri() → santri.vue)
    await set(dbRef($realtimeDb, `alberr/santri/${regId}`), record)

    // Index ringan (opsional)
    await set(dbRef($realtimeDb, `alberr/santriIndex/${regId}`), {
      id: regId,
      gen: santriRow.gen,
      santri: santriRow.santri,
      walisantri: santriRow.walisantri,
      nohp: santriRow.nohp,
      kamar: santriRow.kamar,
      jenjang: santriRow.jenjang,
      status: santriRow.status,
      username, publicToken
    })

    // Secret hash — disimpan terpisah
    await set(dbRef($realtimeDb, `alberr/credentials/${regId}`), {
      secretHash,
      createdAt: serverTimestamp(),
      issuer: 'ppdb-form'
    })

    ok.value = true
    feedback.value = 'Pendaftaran terkirim. Nomor pendaftaran & kredensial sementara telah dibuat.'
    regInfo.value = { id: regId, code }
    receipt.value = { username, publicToken }

    // Admin only (DevTools)
    console.info('[PPDB] SECRET TOKEN (simpan aman, hanya admin!):', { regId, secretToken })

    // Hapus draf
    localStorage.removeItem(DRAFT_KEY)
  } catch (e:any) {
    console.error(e)
    ok.value = false
    feedback.value = e?.message || 'Gagal mengirim pendaftaran.'
  } finally {
    loading.value = false
  }
}

/** ===== Static UI links (optional) ===== */
const brochureViewUrl = '/brosur-ppdb.pdf'
const brochureDownloadUrl = '/brosur-ppdb.pdf'
</script>

<style scoped lang="postcss">
.tool-btn { @apply inline-flex items-center justify-center rounded-md px-2 py-1 text-xs bg-white/80 hover:bg-white border border-gray-200 shadow dark:bg-neutral-700/80 dark:hover:bg-neutral-700 dark:border-neutral-600; }
</style>
