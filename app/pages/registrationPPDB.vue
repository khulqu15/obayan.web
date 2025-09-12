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
              PPDB Online 2025/2026
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
                  class="group relative px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition"
                  :class="[
                    i === step ? 'bg-blue-600 text-white' : 
                    i < step ? 'bg-emerald-50 700 border border-emerald-200' :
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
                          <!-- Himbauan + Brosur -->
            <section v-if="step===0" class="relative mt-4">
              <!-- Soft blobs -->
              <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
                <div class="absolute -top-24 -left-24 w-[42rem] h-[42rem] rounded-full opacity-30 blur-3xl bg-gradient-to-br from-emerald-200 to-lime-200 dark:from-emerald-900/40 dark:to-lime-900/30" />
                <div class="absolute -bottom-28 -right-20 w-[38rem] h-[38rem] rounded-full opacity-25 blur-3xl bg-gradient-to-tr from-lime-100 to-emerald-100 dark:from-lime-900/30 dark:to-emerald-900/30" />
              </div>

              <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                  class="relative rounded-3xl border border-emerald-200/60 dark:border-emerald-900/40 bg-white/85 dark:bg-neutral-900/80 backdrop-blur-xl shadow-[0_14px_60px_rgba(16,185,129,.18)]">
                  <!-- Header pill -->
                  <div class="absolute -top-3 left-5">
                    <span
                      class="inline-flex items-center gap-2 rounded-full bg-emerald-600 text-white text-[11px] font-semibold tracking-wide px-3 py-1 shadow-sm">
                      <Icon icon="ph:check-circle" class="size-3.5" />
                      Himbauan PPDB
                    </span>
                  </div>

                  <!-- Content -->
                  <div class="p-6 sm:p-8">
                    <!-- Mini mascot -->
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

                      <p>
                        Formulir ini digunakan untuk pendaftaran resmi santri baru. Mohon diisi dengan jujur, lengkap,
                        dan sesuai dokumen asli (Akta Kelahiran, Kartu Keluarga, dan NISN).
                      </p>

                      <p>
                        Data yang tercantum akan dipakai sebagai arsip administrasi pondok pesantren dan tidak boleh dipalsukan.
                        Apabila ditemukan ketidaksesuaian data, pihak pondok berhak melakukan klarifikasi dan penyesuaian ulang.
                        Mohon membaca petunjuk dengan seksama sebelum mengisi.
                      </p>

                      <p><strong>Wassalamu’alaikum warahmatullahi wabarakatuh.</strong></p>
                    </div>

                    <!-- Quick facts: Duolingo-style badges -->
                    <div class="mt-5 grid sm:grid-cols-3 gap-3">
                      <div class="flex items-center gap-2 rounded-2xl border border-emerald-200/70 dark:border-emerald-800/50 bg-emerald-50/60 dark:bg-emerald-900/20 px-3 py-2">
                        <Icon icon="ph:shield-check" class="size-5 600" />
                        <span class="text-sm font-medium 800 dark:300">Data diverifikasi</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-2xl border border-lime-200/70 dark:border-lime-800/50 bg-lime-50/60 dark:bg-lime-900/10 px-3 py-2">
                        <Icon icon="ph:archive-box" class="size-5 text-lime-600" />
                        <span class="text-sm font-medium text-lime-800 dark:text-lime-300">Arsip administrasi</span>
                      </div>
                      <div class="flex items-center gap-2 rounded-2xl border border-blue-200/70 dark:border-blue-800/50 bg-blue-50/60 dark:bg-blue-900/10 px-3 py-2">
                        <Icon icon="ph:book-open-text" class="size-5 600" />
                        <span class="text-sm font-medium 800 dark:300">Baca petunjuk dulu</span>
                      </div>
                    </div>

                    <!-- Action row -->
                    <div class="mt-6 flex flex-wrap items-center gap-2">
                      <button @click="step += 1"
                        class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-emerald-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-600">
                        <Icon icon="ph:pencil-simple" class="size-4" />
                        Mulai Isi Form
                      </button>
                    </div>
                  </div>

                  <!-- dot grid accent -->
                  <div aria-hidden="true" class="absolute -right-6 -bottom-6 opacity-30">
                    <div class="grid grid-cols-6 gap-2 p-6">
                      <span v-for="i in 24" :key="i" class="size-1.5 rounded-full bg-emerald-300/60 dark:bg-emerald-700/60"></span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
              <!-- STEP 0: CALON SANTRI -->
              <div v-if="step===1" class="grid sm:grid-cols-2 gap-4">
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Nama Lengkap (Sesuai Akta) <span class="text-red-600">*</span></span>
                  <input v-model="form.siswa.nama" type="text" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" required />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Jenis Kelamin <span class="text-red-600">*</span></span>
                  <select v-model="form.siswa.jk" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" required>
                    <option value="" disabled>Pilih</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Tempat Lahir <span class="text-red-600">*</span></span>
                  <input v-model="form.siswa.tmpLahir" type="text" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" required />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Tanggal Lahir <span class="text-red-600">*</span></span>
                  <input v-model="form.siswa.tglLahir" type="date" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" required />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Tinggi Badan (cm)</span>
                  <input v-model="form.siswa.tinggi" type="number" min="0" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Berat Badan (kg)</span>
                  <input v-model="form.siswa.berat" type="number" min="0" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Cita-cita</span>
                  <input v-model="form.siswa.cita" type="text" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" placeholder="Contoh: Dokter" />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Hobi</span>
                  <input v-model="form.siswa.hobi" type="text" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" placeholder="Contoh: Membaca" />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">No KK</span>
                  <input v-model="form.siswa.kk" type="text" inputmode="numeric" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">No NIK</span>
                  <input v-model="form.siswa.nik" type="text" inputmode="numeric" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>
                <label class="block sm:col-span-2">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">NISN</span>
                  <input v-model="form.siswa.nisn" type="text" inputmode="numeric" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>
              </div>

              <!-- STEP 1: ALAMAT -->
              <div v-else-if="step===2" class="grid sm:grid-cols-2 gap-4">
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Jalan / Gang / No. Rumah <span class="text-red-600">*</span></span>
                  <input v-model="form.alamat.jalan" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" required />
                </label>
                <div class="grid grid-cols-2 gap-3">
                  <label class="block">
                    <span class="text-xs text-gray-600 dark:text-neutral-300">RT</span>
                    <input v-model="form.alamat.rt" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                  </label>
                  <label class="block">
                    <span class="text-xs text-gray-600 dark:text-neutral-300">RW</span>
                    <input v-model="form.alamat.rw" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                  </label>
                </div>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Dusun</span>
                  <input v-model="form.alamat.dusun" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Desa/Kelurahan <span class="text-red-600">*</span></span>
                  <input v-model="form.alamat.desa" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" required />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Kecamatan <span class="text-red-600">*</span></span>
                  <input v-model="form.alamat.kec" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" required />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Kabupaten/Kota <span class="text-red-600">*</span></span>
                  <input v-model="form.alamat.kab" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" required />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Provinsi <span class="text-red-600">*</span></span>
                  <input v-model="form.alamat.prov" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" required />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Kode Pos</span>
                  <input v-model="form.alamat.kodepos" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>

                <div class="sm:col-span-2">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Calon Santri Tinggal Dengan</span>
                  <div class="mt-2 grid grid-cols-3 gap-3 text-sm">
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

              <!-- STEP 2: RIWAYAT PENDIDIKAN -->
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
                  <input v-model="form.pendidikan.sekolah" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" placeholder="SD/MI/SMP/MTs" />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Alamat Sekolah Asal</span>
                  <input v-model="form.pendidikan.alamatSekolah" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
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
                  <input v-model="form.pendidikan.nfNama" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Alamat Lembaga Non-Formal</span>
                  <input v-model="form.pendidikan.nfAlamat" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>
              </div>

              <!-- STEP 3: ORANG TUA & WALI -->
              <div v-else-if="step===4" class="grid sm:grid-cols-2 gap-4">
                <!-- Ayah -->
                <div class="sm:col-span-2">
                  <h3 class="font-semibold">Data Ayah Kandung</h3>
                </div>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Nama Ayah <span class="text-red-600">*</span></span>
                  <input v-model="form.ortu.ayah.nama" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" required />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Status</span>
                  <select v-model="form.ortu.ayah.status" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition">
                    <option>Hidup</option>
                    <option>Meninggal</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Pendidikan Terakhir</span>
                  <select v-model="form.ortu.ayah.pendidikan" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition">
                    <option>Tidak Sekolah</option><option>SD</option><option>SMP</option><option>SMA</option><option>D1/D2</option><option>S1</option><option>S2</option><option>S3</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Pekerjaan</span>
                  <select v-model="form.ortu.ayah.pekerjaan" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition">
                    <option>Tidak Bekerja</option><option>Petani</option><option>PNS/ASN</option><option>TNI/POLRI</option><option>Guru</option><option>Swasta</option><option>Wiraswasta</option><option>Pengusaha</option><option>Peternak</option><option>Lainnya</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Penghasilan Per Bulan</span>
                  <select v-model="form.ortu.ayah.penghasilan" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition">
                    <option>&lt; Rp1.000.000</option>
                    <option>Rp1.000.000–Rp2.000.000</option>
                    <option>Rp2.000.001–Rp3.000.000</option>
                    <option>Rp3.000.001–Rp4.000.000</option>
                    <option>&gt; Rp4.000.000</option>
                  </select>
                </label>

                <!-- Ibu -->
                <div class="sm:col-span-2 pt-2">
                  <h3 class="font-semibold">Data Ibu Kandung</h3>
                </div>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Nama Ibu <span class="text-red-600">*</span></span>
                  <input v-model="form.ortu.ibu.nama" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" required />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Status</span>
                  <select v-model="form.ortu.ibu.status" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition">
                    <option>Hidup</option>
                    <option>Meninggal</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Pendidikan Terakhir</span>
                  <select v-model="form.ortu.ibu.pendidikan" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition">
                    <option>Tidak Sekolah</option><option>SD</option><option>SMP</option><option>SMA</option><option>D1/D2</option><option>S1</option><option>S2</option><option>S3</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Pekerjaan</span>
                  <select v-model="form.ortu.ibu.pekerjaan" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition">
                    <option>Tidak Bekerja</option><option>Petani</option><option>PNS/ASN</option><option>TNI/POLRI</option><option>Guru</option><option>Swasta</option><option>Wiraswasta</option><option>Pengusaha</option><option>Peternak</option><option>Lainnya</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Penghasilan Per Bulan</span>
                  <select v-model="form.ortu.ibu.penghasilan" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition">
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
                  <input v-model="form.ortu.hp1" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" required placeholder="*08xxxxxxxxxx (sesuai petunjuk jika diperlukan)" />
                </label>
                <label class="block sm:col-span-2">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Nomor HP 2 (Opsional)</span>
                  <input v-model="form.ortu.hp2" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>

                <div class="sm:col-span-2 pt-2">
                  <h3 class="font-semibold">Data Wali (opsional)</h3>
                </div>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Nama Wali</span>
                  <input v-model="form.wali.nama" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Status</span>
                  <select v-model="form.wali.status" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition">
                    <option>Hidup</option>
                    <option>Meninggal</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Pendidikan Terakhir</span>
                  <select v-model="form.wali.pendidikan" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition">
                    <option>Tidak Sekolah</option><option>SD</option><option>SMP</option><option>SMA</option><option>D1/D2</option><option>S1</option><option>S2</option><option>S3</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Pekerjaan</span>
                  <select v-model="form.wali.pekerjaan" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition">
                    <option>Tidak Bekerja</option><option>Petani</option><option>PNS/ASN</option><option>TNI/POLRI</option><option>Guru</option><option>Swasta</option><option>Wiraswasta</option><option>Pengusaha</option><option>Peternak</option><option>Lainnya</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Penghasilan Per Bulan</span>
                  <select v-model="form.wali.penghasilan" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition">
                    <option>&lt; Rp1.000.000</option>
                    <option>Rp1.000.000–Rp2.000.000</option>
                    <option>Rp2.000.001–Rp3.000.000</option>
                    <option>Rp3.000.001–Rp4.000.000</option>
                    <option>&gt; Rp4.000.000</option>
                  </select>
                </label>
                <label class="block sm:col-span-2">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Nomor HP Wali (Opsional)</span>
                  <input v-model="form.wali.hp" class="@apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition" />
                </label>
              </div>

              <!-- STEP 4: DOKUMEN -->
              <div v-else-if="step===5" class="grid sm:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Kartu Keluarga (PDF/JPG) <span class="text-red-600">*</span></span>
                  <div class="upload" @dragover.prevent @drop="onDrop($event,'kk')">
                    <div class="upload-info">
                      <div class="file-ico">📎</div>
                      <div>
                        <p class="font-medium">{{ files.kk?.file?.name || 'Tarik & lepas file ke sini' }}</p>
                        <p class="sub">{{ fileSizeText(files.kk?.file?.size) || 'Maks 2MB' }}</p>
                      </div>
                    </div>
                    <label class="pick">
                      <input type="file" class="hidden" accept=".pdf,image/*" @change="onPick($event,'kk')" />
                      Pilih File
                    </label>
                  </div>
                  <img v-if="files.kk?.url && isImage(files.kk?.file)" :src="files.kk.url" class="mt-2 max-h-28 rounded-lg border border-gray-200 dark:border-neutral-700" @error="hideImg($event)" />
                </div>

                <div class="space-y-1.5">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Akte Kelahiran (PDF/JPG) <span class="text-red-600">*</span></span>
                  <div class="upload" @dragover.prevent @drop="onDrop($event,'akte')">
                    <div class="upload-info">
                      <div class="file-ico">📎</div>
                      <div>
                        <p class="font-medium">{{ files.akte?.file?.name || 'Tarik & lepas file ke sini' }}</p>
                        <p class="sub">{{ fileSizeText(files.akte?.file?.size) || 'Maks 2MB' }}</p>
                      </div>
                    </div>
                    <label class="pick">
                      <input type="file" class="hidden" accept=".pdf,image/*" @change="onPick($event,'akte')" />
                      Pilih File
                    </label>
                  </div>
                  <img v-if="files.akte?.url && isImage(files.akte?.file)" :src="files.akte.url" class="mt-2 max-h-28 rounded-lg border border-gray-200 dark:border-neutral-700" @error="hideImg($event)" />
                </div>

                <div class="space-y-1.5">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Raport Terakhir (PDF) <span class="text-red-600">*</span></span>
                  <div class="upload" @dragover.prevent @drop="onDrop($event,'raport')">
                    <div class="upload-info">
                      <div class="file-ico">📎</div>
                      <div>
                        <p class="font-medium">{{ files.raport?.file?.name || 'Tarik & lepas file ke sini' }}</p>
                        <p class="sub">{{ fileSizeText(files.raport?.file?.size) || 'Maks 5MB' }}</p>
                      </div>
                    </div>
                    <label class="pick">
                      <input type="file" class="hidden" accept=".pdf" @change="onPick($event,'raport')" />
                      Pilih File
                    </label>
                  </div>
                </div>

                <div class="space-y-1.5">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Pas Foto 3x4 (JPG/PNG) <span class="text-red-600">*</span></span>
                  <div class="upload" @dragover.prevent @drop="onDrop($event,'foto')">
                    <div class="upload-info">
                      <div class="file-ico">📎</div>
                      <div>
                        <p class="font-medium">{{ files.foto?.file?.name || 'Tarik & lepas file ke sini' }}</p>
                        <p class="sub">{{ fileSizeText(files.foto?.file?.size) || 'Maks 1MB' }}</p>
                      </div>
                    </div>
                    <label class="pick">
                      <input type="file" class="hidden" accept="image/*" @change="onPick($event,'foto')" />
                      Pilih File
                    </label>
                  </div>
                  <img v-if="files.foto?.url && isImage(files.foto?.file)" :src="files.foto.url" class="mt-2 max-h-28 rounded-lg border border-gray-200 dark:border-neutral-700" @error="hideImg($event)" />
                </div>

                <div class="sm:col-span-2">
                  <label class="flex items-start gap-3">
                    <input type="checkbox" v-model="form.pernyataan.keaslian" class="rounded border-gray-300 dark:border-neutral-700" />
                    <span class="text-sm">Saya menyatakan semua dokumen yang diunggah adalah <b>asli/scan dokumen resmi</b>.</span>
                  </label>
                </div>
              </div>

              <!-- STEP 5: KONFIRMASI -->
              <div v-else-if="step===6" class="space-y-4">
                <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-4">
                  <div class="flex items-center gap-2 text-sm font-semibold">
                    <Icon icon="ph:check-circle" class="size-5 600" />
                    Ringkasan Pendaftaran
                  </div>
                  <div class="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
                    <div class="flex justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-1"><dt>Nama</dt><dd>{{ form.siswa.nama || '—' }}</dd></div>
                    <div class="flex justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-1"><dt>JK</dt><dd>{{ form.siswa.jk || '—' }}</dd></div>
                    <div class="flex justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-1"><dt>TTL</dt><dd>{{ (form.siswa.tmpLahir || '-') + ', ' + (form.siswa.tglLahir || '-') }}</dd></div>
                    <div class="flex justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-1"><dt>Tinggi/Berat</dt><dd>{{ (form.siswa.tinggi||'—') + ' / ' + (form.siswa.berat||'—') }}</dd></div>
                    <div class="flex justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-1"><dt>NIK</dt><dd>{{ form.siswa.nik || '—' }}</dd></div>
                    <div class="flex justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-1"><dt>NISN</dt><dd>{{ form.siswa.nisn || '—' }}</dd></div>
                    <div class="flex justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-1"><dt>Alamat</dt><dd>{{ alamatSingkat }}</dd></div>
                    <div class="flex justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-1"><dt>Sekolah Asal</dt><dd>{{ form.pendidikan.sekolah || '—' }}</dd></div>
                    <div class="flex justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-1"><dt>HP Ortu</dt><dd>{{ form.ortu.hp1 || '—' }}</dd></div>
                    <div class="flex justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-1"><dt>Dokumen</dt><dd>{{ dokumenCheck }}</dd></div>
                  </div>
                  <p class="mt-3 text-[12px] text-gray-500 dark:text-neutral-400">Periksa kembali data Anda sebelum mengirim.</p>
                </div>

                <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-4 bg-emerald-50/60 dark:bg-neutral-800/40">
                  <p class="text-sm 800 dark:300">
                    Setelah terkirim, Anda akan mendapatkan <b>Nomor Pendaftaran</b>.
                  </p>
                </div>
              </div>

              <!-- ACTIONS -->
              <div class="mt-6 flex items-center justify-between">
                <button :disabled="step===6 || loading" @click="prev"
                        class="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 px-4 py-2.5 text-sm font-medium hover:bg-white dark:hover:bg-neutral-800 disabled:opacity-60">
                  <Icon icon="ph:arrow-left" class="size-4" />
                  Kembali
                </button>

                <div class="flex items-center gap-2">
                  <p class="text-[12px] text-gray-500 dark:text-neutral-400">Draf tersimpan otomatis.</p>
                  <button v-if="step<steps.length-1" :disabled="!canNext || loading" @click="next"
                          class="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60">
                    Lanjut
                    <Icon icon="ph:arrow-right" class="size-4" />
                  </button>
                  <button v-else :disabled="!canSubmit || loading" @click="submit"
                          class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60">
                    <Icon :icon="loading?'ph:loader':'ph:paper-plane-tilt'" class="size-4" :class="loading?'animate-spin':''" />
                    Kirim Pendaftaran
                  </button>
                </div>
              </div>

              <p v-if="feedback" class="mt-3 text-[12px]" :class="ok ? '600' : 'text-red-600'">{{ feedback }}</p>

              <div v-if="ok && regInfo" class="mt-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-900/20 p-4">
                <p class="text-sm">
                  Pendaftaran berhasil. Nomor Pendaftaran: <b>{{ regInfo.code }}</b><br>
                  Simpan nomor ini untuk pengecekan status selanjutnya.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- RIGHT: HELP CARDS -->
        <aside class="lg:col-span-4">
          <div class="space-y-4">
            <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 backdrop-blur p-5 shadow">
              <div class="flex items-center gap-2">
                <Icon icon="ph:list-checks" class="size-5 600" />
                <h3 class="font-semibold">Syarat Umum & Petunjuk</h3>
              </div>
              <ul class="mt-3 text-sm space-y-2">
                <li class="flex items-start gap-2"><span class="inline-block size-1.5 rounded-full bg-gray-400 mt-2" /> Siapkan: Akta Kelahiran, KK, NISN.</li>
                <li class="flex items-start gap-2"><span class="inline-block size-1.5 rounded-full bg-gray-400 mt-2" /> Masukkan nomor (NIK/KK/NISN/HP) sesuai format instansi asal.</li>
                <li class="flex items-start gap-2"><span class="inline-block size-1.5 rounded-full bg-gray-400 mt-2" /> Gunakan huruf kapital seperlunya (nama, alamat).</li>
              </ul>
            </div>

            <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 backdrop-blur p-5 shadow">
              <div class="flex items-center gap-2">
                <Icon icon="ph:calendar-check" class="size-5 600" />
                <h3 class="font-semibold">Timeline</h3>
              </div>
              <ul class="mt-3 text-sm space-y-2">
                <li class="flex items-start gap-2"><span class="inline-block size-1.5 rounded-full bg-gray-400 mt-2" /> Pendaftaran: 1 Jan — 30 Mar 2025</li>
                <li class="flex items-start gap-2"><span class="inline-block size-1.5 rounded-full bg-gray-400 mt-2" /> Tes Seleksi: 5—15 Apr 2025</li>
                <li class="flex items-start gap-2"><span class="inline-block size-1.5 rounded-full bg-gray-400 mt-2" /> Pengumuman: 25 Apr 2025</li>
              </ul>
            </div>

            <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 backdrop-blur p-5 shadow">
              <div class="flex items-center gap-2">
                <Icon icon="ph:headset" class="size-5 600" />
                <h3 class="font-semibold">Kontak Panitia</h3>
              </div>
              <ul class="mt-3 text-sm space-y-2">
                <li class="flex items-center gap-2">
                  <Icon icon="ph:whatsapp-logo" class="size-4 600" />
                  <a :href="waUrl" target="_blank" class="hover:underline">{{ waText }}</a>
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="ph:envelope-simple" class="size-4 600" />
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

/** ===== SEO ===== */
const route = useRoute()
const config = useRuntimeConfig()
const url = computed(() => new URL(route.fullPath || '/registrationPPDB', config.public.siteUrl).toString())
const title = 'PPDB Online 2025/2026 — Ponpes Alberr'
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
        name: 'PPDB Ponpes Alberr 2025/2026',
        description,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
        startDate: '2025-01-01',
        endDate: '2025-03-30',
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

/** ===== Master / steps ===== */
const steps = [
  { key:'cover',   label:'Form Cover',  icon:'lets-icons:form' },
  { key:'siswa',   label:'Calon Santri',  icon:'ph:user' },
  { key:'alamat',  label:'Alamat',        icon:'ph:map-pin' },
  { key:'pend',    label:'Pendidikan',    icon:'ph:books' },
  { key:'ortu',    label:'Orang Tua & Wali', icon:'ph:users-three' },
  { key:'dok',     label:'Dokumen',       icon:'ph:cloud-arrow-up' },
  { key:'ok',      label:'Konfirmasi',    icon:'ph:check-circle' }
] as const

const step = ref(0)
const progress = computed(() => Math.round(((step.value+1) / steps.length) * 100))
function next(){ if (canNext.value && step.value < steps.length-1) step.value++ }
function prev(){ if (step.value > 0) step.value-- }
function go(i:number){ if (i<=step.value || validStep(step.value)) step.value = i }

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
const canSubmit = computed(() => validStep(4))

/** ===== Local draft ===== */
const DRAFT_KEY = 'ppdb_registration_v1'
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

function fileSizeText(size?: number) {
  if (!size) return ''
  const kb = Math.round(size / 1024)
  return `${kb} KB`
}
function isImage(f?: File|null){ return !!f && f.type.startsWith('image/') }
function hideImg(e:any){ e.target.style.display='none' }

/** Pick/Drop handlers */
function onPick(e:any, key:'kk'|'akte'|'raport'|'foto'){
  const f = e.target.files?.[0] || null
  ;(files as any)[key] = { file:f, url: f?URL.createObjectURL(f):null }
}
function onDrop(e:DragEvent, key:'kk'|'akte'|'raport'|'foto'){
  const f = e.dataTransfer?.files?.[0] || null
  ;(files as any)[key] = { file:f, url: f?URL.createObjectURL(f):null }
}

/** ===== Submit: Upload to Storage + Save to Realtime DB ===== */
import { getApps } from 'firebase/app'
import { get, set, push, ref as dbRef, serverTimestamp } from 'firebase/database'
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage'

const loading = ref(false)
const feedback = ref('')
const ok = ref(false)
const regInfo = ref<{ id:string, code:string } | null>(null)

function storageSafe() {
  const apps = getApps()
  if (!apps.length) throw new Error('Firebase belum diinisialisasi di Nuxt plugin.')
  return getStorage(apps[0])
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

function extOf(f: File) {
  const guess = f.name.split('.').pop() || ''
  return guess ? `.${guess}` : (f.type.includes('pdf')?'.pdf':f.type.includes('jpeg')?'.jpg':f.type.includes('png')?'.png':'')
}

function niceCode(id: string) {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth()+1).padStart(2,'0')
  const dd = String(d.getDate()).padStart(2,'0')
  return `ALB-${y}${m}${dd}-${id.slice(-5).toUpperCase()}`
}

async function submit(){
  if (!canSubmit.value) return
  const fileErr = validateFileSizes()
  if (fileErr){ feedback.value = fileErr; ok.value = false; return }

  loading.value = true
  feedback.value = ''
  ok.value = false
  regInfo.value = null

  try {
    const { $realtimeDb } = useNuxtApp() as any
    if (!$realtimeDb) throw new Error('Realtime Database tidak tersedia.')

    // Generate new ID (push key) under /alberr/santri
    const baseRef = dbRef($realtimeDb, 'alberr/santri')
    const newRef = push(baseRef)
    const regId = newRef.key as string
    const code = niceCode(regId)

    // Upload documents
    const store = storageSafe()
    const pathBase = `alberr/santri/berkas/${regId}`
    const up = async (key:'kk'|'akte'|'raport'|'foto') => {
      const f = files[key].file as File
      const storagePath = `${pathBase}/${key}${extOf(f)}`
      const r = sRef(store, storagePath)
      await uploadBytes(r, f)
      return await getDownloadURL(r)
    }

    const [kkUrl, akteUrl, raportUrl, fotoUrl] = await Promise.all([
      up('kk'), up('akte'), up('raport'), up('foto')
    ])

    // Compose record
    const record = {
      id: regId,
      code,
      status: 'calon',
      createdAt: serverTimestamp(),
      siswa: form.siswa,
      alamat: form.alamat,
      pendidikan: form.pendidikan,
      ortu: form.ortu,
      wali: form.wali,
      dokumen: { kkUrl, akteUrl, raportUrl, fotoUrl },
      meta: {
        ua: navigator.userAgent,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    }

    // Save under /alberr/santri/{id}
    await set(dbRef($realtimeDb, `alberr/santri/${regId}`), record)

    ok.value = true
    feedback.value = 'Pendaftaran terkirim. Nomor pendaftaran telah dibuat.'
    regInfo.value = { id: regId, code }

    // Clear draft but keep minimal receipt in memory
    localStorage.removeItem(DRAFT_KEY)
  } catch (e:any) {
    console.error(e)
    ok.value = false
    feedback.value = e?.message || 'Gagal mengirim pendaftaran.'
  } finally {
    loading.value = false
  }
}

/** ===== Static UI links ===== */
const brochureViewUrl = '/brosur-ppdb.pdf'
const brochureDownloadUrl = '/brosur-ppdb.pdf'
const waText = '+62 812-3456-7890'
const waUrl = 'https://wa.me/6281234567890'
</script>

<style scoped lang="postcss">
.preview { @apply mt-2 max-h-28 rounded-lg border border-gray-200 dark:border-neutral-700; }
.upload {
  @apply relative rounded-xl border border-dashed border-gray-300 dark:border-neutral-700 p-4 bg-white/70 dark:bg-neutral-900/60 text-sm flex items-center justify-between gap-3;
}
.upload-info { @apply flex items-center gap-3; }
.file-ico { @apply shrink-0 rounded-md bg-gray-100 dark:bg-neutral-800 p-2 text-gray-600 dark:text-neutral-300; }
.pick { @apply inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 px-3 py-2 text-sm font-medium hover:bg-white dark:hover:bg-neutral-800; }
</style>
