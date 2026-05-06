<template>
  <main class="relative min-h-screen bg-gray-50 pt-24 pb-14 text-gray-800 dark:bg-neutral-950 dark:text-neutral-100">
    <!-- Soft top accent -->
    <div class="pointer-events-none absolute inset-x-0 top-0 h-52 bg-green-600/10"></div>

    <div class="relative mx-auto max-w-[90rem] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <!-- HERO -->
      <header class="mb-6 rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-7">
        <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr),auto] lg:items-end">
          <div class="min-w-0">
            <div class="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-green-700 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-300">
              <Icon icon="ph:student" class="h-4 w-4" />
              PSB Online {{ ppdbYear }}/{{ Number(ppdbYear) + 1 }}
            </div>

            <h1 class="mt-4 text-2xl font-black tracking-tight text-gray-950 dark:text-white sm:text-3xl lg:text-4xl">
              {{ registrationConfig.title }}
            </h1>

            <p class="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-neutral-300 sm:text-base">
              {{ registrationConfig.subtitle }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2 lg:justify-end">
            <button
              type="button"
              @click="clearDraft"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <Icon icon="ph:trash" class="h-4 w-4" />
              Reset Draf
            </button>

            <span
              class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-bold"
              :class="isFormClosed
                ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:ring-rose-900/40'
                : 'bg-green-50 text-green-700 ring-1 ring-green-200 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-900/40'"
            >
              <Icon :icon="isFormClosed ? 'ph:lock' : 'ph:lock-open'" class="h-4 w-4" />
              {{ isFormClosed ? 'Ditutup' : 'Dibuka' }}
            </span>
          </div>
        </div>
      </header>

      <div class="grid gap-6 lg:grid-cols-12 lg:items-start">
        <!-- LEFT: FORM -->
        <section v-if="!isFormClosed" class="lg:col-span-8">
          <div class="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <!-- Stepper -->
            <div class="border-b border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 sm:p-5">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="text-xs font-black uppercase tracking-[0.16em] text-green-700 dark:text-green-300">
                    Langkah {{ step + 1 }} dari {{ steps.length }}
                  </p>
                  <h2 class="mt-1 text-lg font-black text-gray-950 dark:text-white">
                    {{ activeStep.label }}
                  </h2>
                </div>

                <div class="hidden min-w-[120px] text-right sm:block">
                  <p class="text-xs font-semibold text-gray-500 dark:text-neutral-400">Progress</p>
                  <p class="text-xl font-black text-green-700 dark:text-green-300">{{ progress }}%</p>
                </div>
              </div>

              <div class="mt-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800">
                <div class="h-full rounded-full bg-green-600 transition-all duration-500" :style="{ width: progress + '%' }"></div>
              </div>

              <div class="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-7">
                <button
                  v-for="(s, i) in steps"
                  :key="s.key"
                  type="button"
                  class="group rounded-2xl border p-3 text-left transition"
                  :class="[
                    i === step
                      ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-200'
                      : i < step
                        ? 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'
                        : 'border-gray-200 bg-gray-50 text-gray-500 dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-400'
                  ]"
                  @click="goToStep(i)"
                >
                  <div class="flex items-center gap-2">
                    <span
                      class="grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xs font-black"
                      :class="i === step
                        ? 'bg-green-600 text-white'
                        : i < step
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-white text-gray-400 dark:bg-neutral-900 dark:text-neutral-500'"
                    >
                      <Icon v-if="i < step" icon="lucide:check" class="h-4 w-4" />
                      <Icon v-else :icon="s.icon" class="h-4 w-4" />
                    </span>

                    <span class="min-w-0">
                      <span class="block truncate text-xs font-black">{{ s.label }}</span>
                      <span class="mt-0.5 hidden truncate text-[11px] opacity-70 sm:block xl:hidden">{{ s.desc }}</span>
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="p-5 sm:p-7">
              <!-- STEP 0 -->
              <section v-if="step === 0" class="space-y-6">
                <div class="rounded-[1.75rem] border border-green-200 bg-green-50 p-5 dark:border-green-900/40 dark:bg-green-900/10 sm:p-7">
                  <div class="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-600 text-white">
                      <Icon icon="ph:check-circle" class="h-6 w-6" />
                    </div>

                    <div class="min-w-0">
                      <p class="text-xs font-black uppercase tracking-[0.16em] text-green-700 dark:text-green-300">
                        Himbauan PSB
                      </p>

                      <h2 class="mt-2 text-2xl font-black tracking-tight text-gray-950 dark:text-white">
                        Informasi Penting Sebelum Mengisi Formulir
                      </h2>

                      <div class="mt-4 max-w-none space-y-3 text-sm leading-7 text-gray-700 dark:text-neutral-300">
                        <p><strong>Assalamu’alaikum warahmatullahi wabarakatuh,</strong></p>
                        <p>
                          Formulir ini digunakan untuk pendaftaran resmi santri baru lulusan SD/MI. Mohon diisi dengan jujur, lengkap,
                          dan sesuai dokumen resmi seperti Akta Kelahiran, Kartu Keluarga, serta KTP Ayah dan Ibu.
                        </p>
                        <p>
                          Data yang dicantumkan akan digunakan sebagai arsip administrasi pondok pesantren. Mohon membaca petunjuk
                          sebelum mengisi dan menyiapkan dokumen pendukung terlebih dahulu.
                        </p>
                        <p><strong>Wassalamu’alaikum warahmatullahi wabarakatuh.</strong></p>
                      </div>

                      <div class="mt-6 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          @click="step += 1"
                          class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white transition hover:bg-green-700"
                        >
                          <Icon icon="ph:pencil-simple" class="h-4 w-4" />
                          Mulai Isi Form
                        </button>

                        <button
                          v-if="brochureItems.length"
                          type="button"
                          @click="openBrochure"
                          class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        >
                          <Icon icon="lucide:file-text" class="h-4 w-4" />
                          Lihat Brosur
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <!-- STEP 1 -->
              <section v-else-if="step === 1" class="space-y-6">
                <SectionTitle
                  icon="ph:user"
                  title="Data Calon Santri"
                  subtitle="Isi sesuai dokumen resmi seperti Akta Kelahiran, KK, dan NISN."
                />

                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label :class="labelBase">Nama Lengkap <span class="text-rose-600">*</span></label>
                    <input v-model.trim="form.siswa.nama" type="text" :class="inputBase" placeholder="Sesuai Akta Kelahiran" />
                  </div>

                  <div>
                    <label :class="labelBase">Jenis Kelamin <span class="text-rose-600">*</span></label>
                    <select v-model="form.siswa.jk" :class="inputBase">
                      <option value="" disabled>Pilih jenis kelamin</option>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label :class="labelBase">Tempat Lahir <span class="text-rose-600">*</span></label>
                    <input v-model.trim="form.siswa.tmpLahir" type="text" :class="inputBase" placeholder="Contoh: Pasuruan" />
                  </div>

                  <div>
                    <label :class="labelBase">Tanggal Lahir <span class="text-rose-600">*</span></label>
                    <input v-model="form.siswa.tglLahir" type="date" :class="inputBase" />
                  </div>

                  <div>
                    <label :class="labelBase">Tinggi Badan</label>
                    <input v-model="form.siswa.tinggi" type="number" min="0" :class="inputBase" placeholder="cm" />
                  </div>

                  <div>
                    <label :class="labelBase">Berat Badan</label>
                    <input v-model="form.siswa.berat" type="number" min="0" :class="inputBase" placeholder="kg" />
                  </div>

                  <div>
                    <label :class="labelBase">Cita-cita</label>
                    <input v-model.trim="form.siswa.cita" type="text" :class="inputBase" placeholder="Contoh: Dokter" />
                  </div>

                  <div>
                    <label :class="labelBase">Hobi</label>
                    <input v-model.trim="form.siswa.hobi" type="text" :class="inputBase" placeholder="Contoh: Membaca" />
                  </div>

                  <div>
                    <label :class="labelBase">No KK <span class="text-rose-600">*</span></label>
                    <input v-model.trim="form.siswa.kk" type="text" inputmode="numeric" :class="inputBase" />
                  </div>

                  <div>
                    <label :class="labelBase">No NIK <span class="text-rose-600">*</span></label>
                    <input v-model.trim="form.siswa.nik" type="text" inputmode="numeric" :class="inputBase" />
                  </div>

                  <div class="sm:col-span-2">
                    <label :class="labelBase">NISN <span class="text-rose-600">*</span></label>
                    <input v-model.trim="form.siswa.nisn" type="text" inputmode="numeric" :class="inputBase" />
                  </div>
                </div>
              </section>

              <!-- STEP 2 -->
              <section v-else-if="step === 2" class="space-y-6">
                <SectionTitle
                  icon="ph:map-pin"
                  title="Alamat Domisili"
                  subtitle="Masukkan alamat lengkap tempat tinggal calon santri saat ini."
                />

                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label :class="labelBase">Jalan / Gang / No. Rumah <span class="text-rose-600">*</span></label>
                    <input v-model.trim="form.alamat.jalan" :class="inputBase" />
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label :class="labelBase">RT</label>
                      <input v-model.trim="form.alamat.rt" :class="inputBase" />
                    </div>

                    <div>
                      <label :class="labelBase">RW</label>
                      <input v-model.trim="form.alamat.rw" :class="inputBase" />
                    </div>
                  </div>

                  <div>
                    <label :class="labelBase">Dusun</label>
                    <input v-model.trim="form.alamat.dusun" :class="inputBase" />
                  </div>

                  <div>
                    <label :class="labelBase">Desa/Kelurahan <span class="text-rose-600">*</span></label>
                    <input v-model.trim="form.alamat.desa" :class="inputBase" />
                  </div>

                  <div>
                    <label :class="labelBase">Kecamatan <span class="text-rose-600">*</span></label>
                    <input v-model.trim="form.alamat.kec" :class="inputBase" />
                  </div>

                  <div>
                    <label :class="labelBase">Kabupaten/Kota <span class="text-rose-600">*</span></label>
                    <input v-model.trim="form.alamat.kab" :class="inputBase" />
                  </div>

                  <div>
                    <label :class="labelBase">Provinsi <span class="text-rose-600">*</span></label>
                    <input v-model.trim="form.alamat.prov" :class="inputBase" />
                  </div>

                  <div>
                    <label :class="labelBase">Kode Pos</label>
                    <input v-model.trim="form.alamat.kodepos" :class="inputBase" />
                  </div>

                  <div class="sm:col-span-2">
                    <label :class="labelBase">Calon Santri Tinggal Dengan</label>
                    <div class="grid gap-3 sm:grid-cols-3">
                      <label
                        v-for="item in tinggalOptions"
                        :key="item.value"
                        class="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm font-semibold text-gray-700 transition hover:bg-white dark:border-neutral-800 dark:bg-neutral-800/70 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      >
                        <input type="radio" :value="item.value" v-model="form.alamat.tinggal" class="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        {{ item.label }}
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              <!-- STEP 3 -->
              <section v-else-if="step === 3" class="space-y-6">
                <SectionTitle
                  icon="ph:books"
                  title="Riwayat Pendidikan"
                  subtitle="Isi sekolah asal dan pengalaman pendidikan keagamaan non-formal jika ada."
                />

                <div class="space-y-5">
                  <div>
                    <label :class="labelBase">Status Sekolah Asal</label>
                    <div class="grid gap-3 sm:grid-cols-3">
                      <label
                        v-for="item in pendidikanStatusOptions"
                        :key="item.value"
                        class="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm font-semibold text-gray-700 transition hover:bg-white dark:border-neutral-800 dark:bg-neutral-800/70 dark:text-neutral-200"
                      >
                        <input type="radio" :value="item.value" v-model="form.pendidikan.status" class="mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span>{{ item.label }}</span>
                      </label>
                    </div>
                  </div>

                  <div class="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label :class="labelBase">Nama Sekolah Asal</label>
                      <input v-model.trim="form.pendidikan.sekolah" :class="inputBase" placeholder="SD/MI" />
                    </div>

                    <div>
                      <label :class="labelBase">Alamat Sekolah Asal</label>
                      <input v-model.trim="form.pendidikan.alamatSekolah" :class="inputBase" />
                    </div>
                  </div>

                  <div>
                    <label :class="labelBase">Pendidikan Keagamaan Non-Formal</label>
                    <div class="grid gap-3 sm:grid-cols-3">
                      <label
                        v-for="item in nonformalOptions"
                        :key="item.value"
                        class="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm font-semibold text-gray-700 transition hover:bg-white dark:border-neutral-800 dark:bg-neutral-800/70 dark:text-neutral-200"
                      >
                        <input type="checkbox" :value="item.value" v-model="form.pendidikan.nonformal" class="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        {{ item.label }}
                      </label>
                    </div>
                  </div>

                  <div class="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label :class="labelBase">Nama Lembaga Non-Formal</label>
                      <input v-model.trim="form.pendidikan.nfNama" :class="inputBase" />
                    </div>

                    <div>
                      <label :class="labelBase">Alamat Lembaga Non-Formal</label>
                      <input v-model.trim="form.pendidikan.nfAlamat" :class="inputBase" />
                    </div>
                  </div>
                </div>
              </section>

              <!-- STEP 4 -->
              <section v-else-if="step === 4" class="space-y-7">
                <SectionTitle
                  icon="ph:users-three"
                  title="Data Orang Tua & Wali"
                  subtitle="Lengkapi data ayah, ibu, kontak aktif, dan wali jika calon santri tinggal bersama wali."
                />

                <!-- Ayah -->
                <div class="rounded-[1.75rem] border border-gray-200 p-4 dark:border-neutral-800 sm:p-5">
                  <h3 class="text-base font-black text-gray-950 dark:text-white">Data Ayah Kandung</h3>

                  <div class="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label :class="labelBase">Nama Ayah <span class="text-rose-600">*</span></label>
                      <input v-model.trim="form.ortu.ayah.nama" :class="inputBase" />
                    </div>

                    <div>
                      <label :class="labelBase">Status</label>
                      <select v-model="form.ortu.ayah.status" :class="inputBase">
                        <option>Hidup</option>
                        <option>Meninggal</option>
                      </select>
                    </div>

                    <div>
                      <label :class="labelBase">Pendidikan Terakhir</label>
                      <select v-model="form.ortu.ayah.pendidikan" :class="inputBase">
                        <option v-for="item in pendidikanOptions" :key="`ayah-${item}`">{{ item }}</option>
                      </select>
                    </div>

                    <div>
                      <label :class="labelBase">Pekerjaan</label>
                      <select v-model="form.ortu.ayah.pekerjaan" :class="inputBase">
                        <option v-for="item in pekerjaanOptions" :key="`ayah-job-${item}`">{{ item }}</option>
                      </select>
                    </div>

                    <div class="sm:col-span-2">
                      <label :class="labelBase">Penghasilan Per Bulan</label>
                      <select v-model="form.ortu.ayah.penghasilan" :class="inputBase">
                        <option v-for="item in penghasilanOptions" :key="`ayah-income-${item}`">{{ item }}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Ibu -->
                <div class="rounded-[1.75rem] border border-gray-200 p-4 dark:border-neutral-800 sm:p-5">
                  <h3 class="text-base font-black text-gray-950 dark:text-white">Data Ibu Kandung</h3>

                  <div class="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label :class="labelBase">Nama Ibu <span class="text-rose-600">*</span></label>
                      <input v-model.trim="form.ortu.ibu.nama" :class="inputBase" />
                    </div>

                    <div>
                      <label :class="labelBase">Status</label>
                      <select v-model="form.ortu.ibu.status" :class="inputBase">
                        <option>Hidup</option>
                        <option>Meninggal</option>
                      </select>
                    </div>

                    <div class="sm:col-span-2">
                      <label :class="labelBase">Pendidikan Terakhir</label>
                      <select v-model="form.ortu.ibu.pendidikan" :class="inputBase">
                        <option v-for="item in pendidikanOptions" :key="`ibu-${item}`">{{ item }}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Kontak -->
                <div class="rounded-[1.75rem] border border-gray-200 p-4 dark:border-neutral-800 sm:p-5">
                  <h3 class="text-base font-black text-gray-950 dark:text-white">Kontak Orang Tua</h3>

                  <div class="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label :class="labelBase">Nomor HP 1 / WA Aktif <span class="text-rose-600">*</span></label>
                      <input v-model.trim="form.ortu.hp1" :class="inputBase" placeholder="08xxxxxxxxxx" />
                    </div>

                    <div>
                      <label :class="labelBase">Nomor HP 2</label>
                      <input v-model.trim="form.ortu.hp2" :class="inputBase" />
                    </div>
                  </div>
                </div>

                <!-- Wali -->
                <div class="rounded-[1.75rem] border border-gray-200 p-4 dark:border-neutral-800 sm:p-5">
                  <h3 class="text-base font-black text-gray-950 dark:text-white">Data Wali</h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Opsional, isi jika calon santri tinggal bersama wali.</p>

                  <div class="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label :class="labelBase">Nama Wali</label>
                      <input v-model.trim="form.wali.nama" :class="inputBase" />
                    </div>

                    <div>
                      <label :class="labelBase">Status</label>
                      <select v-model="form.wali.status" :class="inputBase">
                        <option>Hidup</option>
                        <option>Meninggal</option>
                      </select>
                    </div>

                    <div>
                      <label :class="labelBase">Pendidikan Terakhir</label>
                      <select v-model="form.wali.pendidikan" :class="inputBase">
                        <option v-for="item in pendidikanOptions" :key="`wali-${item}`">{{ item }}</option>
                      </select>
                    </div>

                    <div>
                      <label :class="labelBase">Pekerjaan</label>
                      <select v-model="form.wali.pekerjaan" :class="inputBase">
                        <option v-for="item in pekerjaanOptions" :key="`wali-job-${item}`">{{ item }}</option>
                      </select>
                    </div>

                    <div>
                      <label :class="labelBase">Penghasilan</label>
                      <select v-model="form.wali.penghasilan" :class="inputBase">
                        <option v-for="item in penghasilanOptions" :key="`wali-income-${item}`">{{ item }}</option>
                      </select>
                    </div>

                    <div>
                      <label :class="labelBase">Nomor HP Wali</label>
                      <input v-model.trim="form.wali.hp" :class="inputBase" />
                    </div>
                  </div>
                </div>
              </section>

              <!-- STEP 5 -->
              <section v-else-if="step === 5" class="space-y-6">
                <SectionTitle
                  icon="ph:cloud-arrow-up"
                  title="Upload Dokumen"
                  subtitle="Upload gambar langsung ke Cloudinary. Untuk PDF, simpan di Google Drive lalu tempel link publik di sini."
                />

                <div class="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-900/10">
                  <div class="flex gap-3">
                    <Icon icon="lucide:info" class="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" />
                    <div class="text-sm leading-6 text-amber-800 dark:text-amber-200">
                      <p class="font-bold">Instruksi PDF:</p>
                      <p>
                        Jika dokumen berbentuk PDF, upload PDF ke Google Drive → klik Share → ubah akses menjadi
                        <b>Anyone with the link</b> → copy link → pilih mode <b>PDF Link</b> pada dokumen terkait → tempel linknya.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                  <article
                    v-for="doc in docConfigs"
                    :key="doc.key"
                    class="rounded-[1.75rem] border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <p class="text-sm font-black text-gray-950 dark:text-white">{{ doc.label }}</p>
                        <p class="mt-1 text-xs leading-5 text-gray-500 dark:text-neutral-400">
                          Wajib diisi. Pilih gambar atau tempel link PDF publik.
                        </p>
                      </div>

                      <span
                        class="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold"
                        :class="isDocReady(doc.key)
                          ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                          : 'bg-gray-100 text-gray-500 dark:bg-neutral-800 dark:text-neutral-400'"
                      >
                        {{ isDocReady(doc.key) ? 'Siap' : 'Belum' }}
                      </span>
                    </div>

                    <div class="mt-4 inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                      <button
                        type="button"
                        class="rounded-xl px-3 py-2 text-xs font-black transition"
                        :class="docs[doc.key].mode === 'image'
                          ? 'bg-white text-gray-950 shadow-sm dark:bg-neutral-200'
                          : 'text-gray-500 dark:text-neutral-300'"
                        @click="setDocMode(doc.key, 'image')"
                      >
                        Upload Gambar
                      </button>

                      <button
                        type="button"
                        class="rounded-xl px-3 py-2 text-xs font-black transition"
                        :class="docs[doc.key].mode === 'pdf'
                          ? 'bg-white text-gray-950 shadow-sm dark:bg-neutral-200'
                          : 'text-gray-500 dark:text-neutral-300'"
                        @click="setDocMode(doc.key, 'pdf')"
                      >
                        PDF Link
                      </button>
                    </div>

                    <!-- Image upload -->
                    <div v-if="docs[doc.key].mode === 'image'" class="mt-4">
                      <div
                        class="flex min-h-[128px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-gray-300 bg-gray-50 p-4 text-center transition hover:bg-white dark:border-neutral-700 dark:bg-neutral-800/70 dark:hover:bg-neutral-800"
                        @dragover.prevent
                        @drop.prevent="handleImageDrop(doc.key, $event)"
                      >
                        <Icon icon="lucide:image-plus" class="h-8 w-8 text-green-600" />
                        <p class="mt-2 text-sm font-bold text-gray-950 dark:text-white">
                          {{ docs[doc.key].file?.name || 'Tarik gambar ke sini' }}
                        </p>
                        <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                          JPG, PNG, WebP. Maksimal 5 MB.
                        </p>

                        <label class="mt-3 inline-flex h-10 cursor-pointer items-center justify-center rounded-2xl bg-green-600 px-4 text-xs font-bold text-white transition hover:bg-green-700">
                          <input type="file" class="hidden" accept="image/jpeg,image/png,image/webp" @change="onImageFileChange(doc.key, $event)" />
                          Pilih Gambar
                        </label>
                      </div>

                      <div v-if="docs[doc.key].url" class="mt-3 overflow-hidden rounded-2xl border border-gray-200 dark:border-neutral-800">
                        <img :src="docs[doc.key].url || ''" :alt="doc.label" class="h-44 w-full object-cover" @error="hideImg($event)" />
                      </div>
                    </div>

                    <!-- PDF link -->
                    <div v-else class="mt-4 space-y-3">
                      <div>
                        <label :class="labelBase">Link PDF / Google Drive</label>
                        <input
                          v-model.trim="docs[doc.key].pdfLink"
                          type="url"
                          :class="inputBase"
                          placeholder="https://drive.google.com/file/d/.../view atau https://domain.com/file.pdf"
                        />
                      </div>

                      <div v-if="docs[doc.key].pdfLink && pdfEmbedUrl(docs[doc.key].pdfLink)" class="overflow-hidden rounded-2xl border border-gray-200 dark:border-neutral-800">
                        <iframe
                          :src="pdfEmbedUrl(docs[doc.key].pdfLink)"
                          class="h-56 w-full bg-white"
                          loading="lazy"
                          referrerpolicy="no-referrer"
                        ></iframe>
                      </div>

                      <p v-else class="rounded-2xl bg-gray-50 p-3 text-xs leading-5 text-gray-500 dark:bg-neutral-800 dark:text-neutral-400">
                        Preview PDF akan tampil setelah link valid ditempel.
                      </p>
                    </div>
                  </article>
                </div>

                <label class="flex items-start gap-3 rounded-[1.5rem] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/70">
                  <input type="checkbox" v-model="form.pernyataan.keaslian" class="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  <span class="text-sm leading-6 text-gray-700 dark:text-neutral-200">
                    Saya menyatakan semua dokumen yang diunggah atau ditautkan adalah <b>asli/scan dokumen resmi</b>.
                  </span>
                </label>
              </section>

              <!-- STEP 6 -->
              <section v-else-if="step === 6" class="space-y-5">
                <SectionTitle
                  icon="ph:check-circle"
                  title="Konfirmasi Pendaftaran"
                  subtitle="Periksa kembali data utama sebelum mengirim formulir."
                />

                <div class="rounded-[1.75rem] border border-gray-200 p-4 dark:border-neutral-800 sm:p-5">
                  <div class="grid gap-3 text-sm sm:grid-cols-2">
                    <SummaryItem label="Nama" :value="form.siswa.nama || '—'" />
                    <SummaryItem label="Gender" :value="form.siswa.jk || '—'" />
                    <SummaryItem label="TTL" :value="`${form.siswa.tmpLahir || '-'}, ${form.siswa.tglLahir || '-'}`" />
                    <SummaryItem label="NIK" :value="form.siswa.nik || '—'" />
                    <SummaryItem label="Alamat" :value="alamatSingkat" />
                    <SummaryItem label="Jenjang" :value="jenjangFromStatus(form.pendidikan.status)" />
                    <SummaryItem label="HP Ortu" :value="form.ortu.hp1 || '—'" />
                    <SummaryItem label="Dokumen" :value="dokumenCheck" />
                  </div>
                </div>

                <div class="rounded-[1.5rem] border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-800 dark:border-green-900/40 dark:bg-green-900/10 dark:text-green-200">
                  Setelah terkirim, Anda akan mendapatkan <b>Nomor Pendaftaran</b> dan kredensial sementara berupa
                  <i>username</i> dan <i>publicToken</i>.
                </div>
              </section>

              <!-- ACTIONS -->
              <div class="mt-8 flex flex-col gap-3 border-t border-gray-200 pt-5 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  :disabled="step === 0 || loading"
                  @click="prev"
                  class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <Icon icon="ph:arrow-left" class="h-4 w-4" />
                  Kembali
                </button>

                <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <button
                    v-if="step < steps.length - 1"
                    type="button"
                    :disabled="!canNext || loading"
                    @click="next"
                    class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-black text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Lanjut
                    <Icon icon="ph:arrow-right" class="h-4 w-4" />
                  </button>

                  <button
                    v-else
                    type="button"
                    :disabled="!canSubmit || loading || cloudUploading"
                    @click="openSubmitConfirm"
                    class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-black text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Icon v-if="loading || cloudUploading" icon="mingcute:loading-fill" class="h-4 w-4 animate-spin" />
                    <Icon v-else icon="ph:paper-plane-tilt" class="h-4 w-4" />
                    {{ loading || cloudUploading ? 'Mengirim...' : 'Kirim Pendaftaran' }}
                  </button>
                </div>
              </div>

              <p v-if="feedback" class="mt-3 rounded-2xl px-4 py-3 text-sm font-semibold" :class="ok ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'">
                {{ feedback }}
              </p>

              <!-- Receipt -->
              <!-- Receipt compact fallback -->
              <div v-if="ok && regInfo" class="mt-5 rounded-[1.5rem] border border-green-200 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-900/10">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p class="text-sm font-black text-green-800 dark:text-green-200">
                      Pendaftaran berhasil.
                    </p>
                    <p class="mt-1 text-sm leading-6 text-green-800 dark:text-green-200">
                      Nomor Pendaftaran: <b>{{ regInfo.code }}</b>
                    </p>
                  </div>

                  <button
                    type="button"
                    @click="openRegistrationCardModal"
                    class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-black text-white transition hover:bg-green-700"
                  >
                    <Icon icon="lucide:id-card" class="h-4 w-4" />
                    Lihat Kartu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- CLOSED -->
        <section v-else class="lg:col-span-8">
          <div class="rounded-[2rem] border border-rose-200 bg-white p-6 shadow-sm dark:border-rose-900/40 dark:bg-neutral-900 sm:p-8">
            <div class="flex items-start gap-4">
              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">
                <Icon icon="ph:lock" class="h-6 w-6" />
              </div>

              <div class="min-w-0 flex-1">
                <h2 class="text-2xl font-black text-gray-950 dark:text-white sm:text-3xl">Pendaftaran Ditutup</h2>
                <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-neutral-400">{{ closedReason }}</p>

                <div v-if="autoEnabled && autoAtMs && !isAutoDue" class="mt-4 inline-flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                  <Icon icon="ph:timer" class="h-4 w-4" />
                  Hitung Mundur: {{ countdownText }}
                </div>

                <div class="mt-6 flex flex-wrap gap-2">
                  <a
                    :href="waUrl"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white transition hover:bg-green-700"
                  >
                    <Icon icon="ph:whatsapp-logo" class="h-4 w-4" />
                    Hubungi Panitia
                  </a>

                  <button
                    v-if="brochureItems.length"
                    type="button"
                    @click="openBrochure"
                    class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    <Icon icon="lucide:file-text" class="h-4 w-4" />
                    Lihat Brosur
                  </button>
                </div>

                <p class="mt-4 text-xs text-gray-500 dark:text-neutral-400">
                  Status ini diperbarui real-time. Silakan cek kembali secara berkala.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- RIGHT SIDEBAR -->
        <aside class="lg:col-span-4">
          <div class="space-y-4 lg:sticky lg:top-24">
            <section class="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="flex items-center gap-3">
                <div class="grid h-11 w-11 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <Icon icon="ph:list-checks" class="h-5 w-5" />
                </div>
                <div>
                  <h3 class="font-black text-gray-950 dark:text-white">Syarat Umum</h3>
                  <p class="text-xs text-gray-500 dark:text-neutral-400">Checklist sebelum submit</p>
                </div>
              </div>

              <ul class="mt-4 space-y-3 text-sm leading-6 text-gray-600 dark:text-neutral-300">
                <li class="flex gap-2"><Icon icon="lucide:check" class="mt-1 h-4 w-4 shrink-0 text-green-600" /> Siapkan Akta Kelahiran, KK, KTP Ayah, dan KTP Ibu.</li>
                <li class="flex gap-2"><Icon icon="lucide:check" class="mt-1 h-4 w-4 shrink-0 text-green-600" /> Masukkan NIK, KK, NISN, dan HP sesuai dokumen.</li>
                <li class="flex gap-2"><Icon icon="lucide:check" class="mt-1 h-4 w-4 shrink-0 text-green-600" /> PDF harus berupa link Google Drive publik.</li>
              </ul>
            </section>

            <section class="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="flex items-center gap-3">
                <div class="grid h-11 w-11 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <Icon icon="ph:calendar-check" class="h-5 w-5" />
                </div>
                <div>
                  <h3 class="font-black text-gray-950 dark:text-white">Timeline</h3>
                  <p class="text-xs text-gray-500 dark:text-neutral-400">Jadwal kegiatan PSB</p>
                </div>
              </div>

              <div class="mt-4 space-y-3">
                <TimelineItem label="Pendaftaran" :value="registrationConfig.timeline.registration" />
                <TimelineItem label="Seleksi" :value="registrationConfig.timeline.selection" />
                <TimelineItem label="Pengumuman" :value="registrationConfig.timeline.announcement" />
              </div>
            </section>

            <section class="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="flex items-center gap-3">
                <div class="grid h-11 w-11 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <Icon icon="ph:headset" class="h-5 w-5" />
                </div>
                <div>
                  <h3 class="font-black text-gray-950 dark:text-white">Kontak Panitia</h3>
                  <p class="text-xs text-gray-500 dark:text-neutral-400">Bantuan pendaftaran</p>
                </div>
              </div>

              <div class="mt-4 space-y-2 text-sm">
                <a
                  :href="waUrl"
                  target="_blank"
                  rel="noopener"
                  class="flex items-center gap-2 rounded-2xl bg-gray-50 px-3 py-2 text-gray-700 transition hover:bg-green-50 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-green-900/20"
                >
                  <Icon icon="ph:whatsapp-logo" class="h-4 w-4 text-green-600" />
                  {{ waText }}
                </a>

                <a
                  v-if="registrationConfig.email"
                  :href="`mailto:${registrationConfig.email}`"
                  class="flex items-center gap-2 rounded-2xl bg-gray-50 px-3 py-2 text-gray-700 transition hover:bg-green-50 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-green-900/20"
                >
                  <Icon icon="ph:envelope-simple" class="h-4 w-4 text-green-600" />
                  {{ registrationConfig.email }}
                </a>
              </div>

              <div class="mt-4 rounded-2xl border border-dashed border-gray-300 p-3 text-xs leading-5 text-gray-500 dark:border-neutral-700 dark:text-neutral-400">
                Draf tersimpan lokal di perangkat sampai formulir berhasil dikirim.
              </div>
            </section>
          </div>
        </aside>
      </div>

      <!-- Submit Confirmation Modal -->
      <Teleport to="body">
        <Transition name="fade">
          <div
            v-if="submitConfirmOpen"
            class="fixed inset-0 z-[1000] overflow-y-auto px-4 py-6"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              class="fixed inset-0 bg-black/55 backdrop-blur-sm"
              aria-label="Tutup modal"
              @click="submitConfirmOpen = false"
            ></button>

            <div class="relative z-10 mx-auto flex min-h-full max-w-xl items-center justify-center">
              <div class="w-full overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
                <div class="border-b border-gray-200 p-5 dark:border-neutral-800">
                  <div class="flex items-start gap-4">
                    <div class="grid h-14 w-14 shrink-0 place-items-center rounded-3xl bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                      <Icon icon="lucide:circle-alert" class="h-7 w-7" />
                    </div>

                    <div class="min-w-0">
                      <p class="text-xs font-black uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
                        Konfirmasi Submit
                      </p>
                      <h3 class="mt-1 text-xl font-black text-gray-950 dark:text-white">
                        Yakin Submit?
                      </h3>
                      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-neutral-400">
                        Tidak dicheck terlebih dahulu? Pastikan data, nomor HP, dan dokumen sudah benar sebelum dikirim.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="space-y-4 p-5">
                  <div class="grid gap-3 sm:grid-cols-2">
                    <div class="rounded-2xl bg-gray-50 p-4 dark:bg-neutral-800">
                      <p class="text-[11px] font-black uppercase tracking-[0.14em] text-gray-500 dark:text-neutral-400">Nama Santri</p>
                      <p class="mt-1 truncate text-sm font-bold text-gray-950 dark:text-white">{{ form.siswa.nama || '—' }}</p>
                    </div>

                    <div class="rounded-2xl bg-gray-50 p-4 dark:bg-neutral-800">
                      <p class="text-[11px] font-black uppercase tracking-[0.14em] text-gray-500 dark:text-neutral-400">HP Ortu/Wali</p>
                      <p class="mt-1 truncate text-sm font-bold text-gray-950 dark:text-white">{{ form.ortu.hp1 || '—' }}</p>
                    </div>

                    <div class="rounded-2xl bg-gray-50 p-4 dark:bg-neutral-800">
                      <p class="text-[11px] font-black uppercase tracking-[0.14em] text-gray-500 dark:text-neutral-400">Jenjang</p>
                      <p class="mt-1 truncate text-sm font-bold text-gray-950 dark:text-white">{{ jenjangFromStatus(form.pendidikan.status) }}</p>
                    </div>

                    <div class="rounded-2xl bg-gray-50 p-4 dark:bg-neutral-800">
                      <p class="text-[11px] font-black uppercase tracking-[0.14em] text-gray-500 dark:text-neutral-400">Dokumen</p>
                      <p class="mt-1 truncate text-sm font-bold text-gray-950 dark:text-white">{{ dokumenCheck }}</p>
                    </div>
                  </div>

                  <div class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-200">
                    Setelah menekan <b>Ya, Submit</b>, data akan dikirim ke database dan dokumen gambar akan diupload ke Cloudinary.
                  </div>
                </div>

                <div class="flex flex-col gap-2 border-t border-gray-200 p-5 dark:border-neutral-800 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    :disabled="loading || cloudUploading"
                    @click="submitConfirmOpen = false"
                    class="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-sm font-black text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    Cek Lagi
                  </button>

                  <button
                    type="button"
                    :disabled="loading || cloudUploading"
                    @click="confirmSubmitFromModal"
                    class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-black text-white transition hover:bg-green-700 disabled:opacity-60"
                  >
                    <Icon v-if="loading || cloudUploading" icon="mingcute:loading-fill" class="h-4 w-4 animate-spin" />
                    <Icon v-else icon="lucide:send" class="h-4 w-4" />
                    {{ loading || cloudUploading ? 'Mengirim...' : 'Ya, Submit' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Success Modal -->
      <Teleport to="body">
        <Transition name="fade">
          <div
            v-if="submitSuccessOpen && regInfo && receipt"
            class="fixed inset-0 z-[1001] overflow-y-auto px-4 py-6"
            role="dialog"
            aria-modal="true"
          >
            <div class="fixed inset-0 bg-black/55 backdrop-blur-sm"></div>

            <div class="relative z-10 mx-auto flex min-h-full max-w-lg items-center justify-center">
              <div class="w-full overflow-hidden rounded-[2rem] border border-green-200 bg-white shadow-2xl dark:border-green-900/40 dark:bg-neutral-900">
                <div class="p-6 text-center">
                  <div class="mx-auto grid h-20 w-20 place-items-center rounded-[2rem] bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    <Icon icon="lucide:check-check" class="h-10 w-10" />
                  </div>

                  <p class="mt-5 text-xs font-black uppercase tracking-[0.16em] text-green-700 dark:text-green-300">
                    Pendaftaran Berhasil
                  </p>

                  <h3 class="mt-2 text-2xl font-black text-gray-950 dark:text-white">
                    Data berhasil dikirim
                  </h3>

                  <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-neutral-400">
                    Nomor pendaftaran Anda sudah dibuat. Silakan lanjut untuk melihat kartu pendaftaran sebagai bukti.
                  </p>

                  <div class="mt-5 rounded-[1.5rem] border border-green-200 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-900/10">
                    <p class="text-xs font-bold uppercase tracking-[0.14em] text-green-700 dark:text-green-300">
                      Nomor Pendaftaran
                    </p>
                    <p class="mt-1 font-mono text-xl font-black text-green-900 dark:text-green-100">
                      {{ regInfo.code }}
                    </p>
                  </div>

                  <button
                    type="button"
                    @click="openRegistrationCardModal"
                    class="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-black text-white transition hover:bg-green-700"
                  >
                    <Icon icon="lucide:id-card" class="h-4 w-4" />
                    Lanjut ke Kartu Pendaftaran
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Registration Card Modal -->
      <Teleport to="body">
        <Transition name="fade">
          <div
            v-if="registrationCardOpen && regInfo && receipt"
            class="fixed inset-0 z-[1002] overflow-y-auto px-4 py-6"
            role="dialog"
            aria-modal="true"
          >
            <div class="fixed inset-0 bg-black/55 backdrop-blur-sm"></div>

            <div class="relative z-10 mx-auto flex min-h-full max-w-4xl items-center justify-center">
              <div class="w-full overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
                <div class="flex flex-col gap-3 border-b border-gray-200 p-5 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p class="text-xs font-black uppercase tracking-[0.16em] text-green-700 dark:text-green-300">
                      Bukti Pendaftaran
                    </p>
                    <h3 class="mt-1 text-xl font-black text-gray-950 dark:text-white">
                      Kartu Pendaftaran Santri Baru
                    </h3>
                  </div>

                  <span
                    class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
                    :class="receiptDownloaded
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'"
                  >
                    <Icon :icon="receiptDownloaded ? 'lucide:download-check' : 'lucide:download'" class="h-4 w-4" />
                    {{ receiptDownloaded ? 'Sudah Download' : 'Belum Download' }}
                  </span>
                </div>

                <div class="bg-gray-100 p-4 dark:bg-neutral-950 sm:p-6">
                  <div
                    ref="registrationCardRef"
                    class="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-green-200 bg-white shadow-sm dark:border-green-900/40 dark:bg-neutral-900"
                  >
                    <div class="bg-green-700 p-6 text-white">
                      <div class="flex items-start justify-between gap-4">
                        <div class="flex min-w-0 items-center gap-4">
                          <div class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white p-2">
                            <img :src="appLogo" alt="Logo" class="h-full w-full object-contain" />
                          </div>

                          <div class="min-w-0">
                            <p class="text-xs font-bold uppercase tracking-[0.18em] text-green-100">
                              {{ registrationConfig.institutionName }}
                            </p>
                            <h4 class="mt-1 text-xl font-black leading-tight">
                              Kartu Pendaftaran PSB
                            </h4>
                            <p class="mt-1 text-sm text-green-100">
                              Tahun Ajaran {{ ppdbYear }}/{{ Number(ppdbYear) + 1 }}
                            </p>
                          </div>
                        </div>

                        <div class="hidden rounded-2xl bg-white/10 px-4 py-3 text-right sm:block">
                          <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-green-100">No. Pendaftaran</p>
                          <p class="mt-1 font-mono text-lg font-black">{{ regInfo.code }}</p>
                        </div>
                      </div>
                    </div>

                    <div class="p-6">
                      <div class="mb-5 rounded-2xl border border-green-200 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-900/10">
                        <p class="text-xs font-bold uppercase tracking-[0.16em] text-green-700 dark:text-green-300">
                          No. Pendaftaran
                        </p>
                        <p class="mt-1 font-mono text-2xl font-black text-green-900 dark:text-green-100">
                          {{ regInfo.code }}
                        </p>
                      </div>

                      <div class="grid gap-3 sm:grid-cols-2">
                        <div
                          v-for="row in registrationCardRows"
                          :key="row.label"
                          class="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/70"
                        >
                          <p class="text-[11px] font-black uppercase tracking-[0.14em] text-gray-500 dark:text-neutral-400">
                            {{ row.label }}
                          </p>
                          <p class="mt-1 break-words text-sm font-bold text-gray-950 dark:text-white">
                            {{ row.value || '—' }}
                          </p>
                        </div>
                      </div>

                      <div class="mt-5 rounded-2xl border border-dashed border-gray-300 p-4 text-xs leading-6 text-gray-500 dark:border-neutral-700 dark:text-neutral-400">
                        Simpan kartu ini sebagai bukti pendaftaran. Username dan public token bersifat sementara untuk pengecekan data awal.
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2 border-t border-gray-200 p-5 dark:border-neutral-800 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    :disabled="downloadCardLoading"
                    @click="downloadRegistrationCard"
                    class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-black text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    <Icon v-if="downloadCardLoading" icon="mingcute:loading-fill" class="h-4 w-4 animate-spin" />
                    <Icon v-else icon="lucide:download" class="h-4 w-4" />
                    Download Kartu
                  </button>

                  <button
                    type="button"
                    :disabled="downloadCardLoading"
                    @click="backFromRegistrationCard"
                    class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-black text-white transition hover:bg-green-700 disabled:opacity-60"
                  >
                    <Icon icon="lucide:arrow-left" class="h-4 w-4" />
                    Kembali
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Brochure modal -->
      <div
        v-if="brochureOpen"
        class="fixed inset-0 z-[999] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        @keydown.esc="closeBrochure"
      >
        <div class="fixed inset-0 bg-black/55 backdrop-blur-sm" @click="closeBrochure"></div>

        <div class="relative mx-auto my-6 w-[94vw] max-w-6xl">
          <div class="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-neutral-800">
              <div>
                <h3 class="text-lg font-black text-gray-950 dark:text-white">Brosur PPDB</h3>
                <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                  Preview brosur. Gambar bisa di-zoom, PDF ditampilkan embed.
                </p>
              </div>

              <button
                type="button"
                class="grid h-10 w-10 place-items-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                @click="closeBrochure"
              >
                <Icon icon="lucide:x" class="h-4 w-4" />
              </button>
            </div>

            <div v-if="activeBrochure" class="bg-gray-100 p-4 dark:bg-neutral-950">
              <!-- PDF -->
              <iframe
                v-if="activeBrochure.type === 'pdf'"
                :src="activeBrochure.embedUrl"
                class="h-[70vh] w-full rounded-2xl border border-gray-200 bg-white dark:border-neutral-800"
                loading="lazy"
                referrerpolicy="no-referrer"
              ></iframe>

              <!-- Image -->
              <div
                v-else
                class="relative h-[70vh] overflow-hidden rounded-2xl border border-gray-200 bg-white select-none dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div
                  ref="ppdbStageRef"
                  :class="ppdbDragging ? 'cursor-grabbing' : 'cursor-grab'"
                  class="absolute inset-0 touch-pan-x touch-pan-y"
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
                    :src="activeBrochure.url"
                    :alt="activeBrochure.title"
                    class="absolute left-1/2 top-1/2 max-h-none max-w-none will-change-transform"
                    :style="ppdbImgStyle"
                    draggable="false"
                    loading="eager"
                  />
                </div>

                <div class="absolute bottom-3 left-3 rounded-xl bg-black/60 px-3 py-1.5 text-xs font-bold text-white">
                  {{ ppdbIdx + 1 }} / {{ brochureItems.length }} · {{ Math.round(ppdbScale * 100) }}%
                </div>

                <div class="absolute left-3 top-3 flex gap-2">
                  <button type="button" @click="ppdbZoomOut" class="rounded-xl bg-white/90 px-3 py-2 text-xs font-bold text-gray-800 shadow-sm hover:bg-white dark:bg-neutral-800/90 dark:text-neutral-100">-</button>
                  <button type="button" @click="ppdbReset" class="rounded-xl bg-white/90 px-3 py-2 text-xs font-bold text-gray-800 shadow-sm hover:bg-white dark:bg-neutral-800/90 dark:text-neutral-100">Reset</button>
                  <button type="button" @click="ppdbZoomIn" class="rounded-xl bg-white/90 px-3 py-2 text-xs font-bold text-gray-800 shadow-sm hover:bg-white dark:bg-neutral-800/90 dark:text-neutral-100">+</button>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-3 border-t border-gray-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center sm:justify-between">
              <div class="text-xs text-gray-500 dark:text-neutral-400">
                Total: {{ brochureItems.length }} file
              </div>

              <div class="flex flex-wrap gap-2">
                <button
                  type="button"
                  :disabled="ppdbIdx <= 0"
                  @click="ppdbPrev"
                  class="inline-flex h-10 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  Sebelumnya
                </button>

                <button
                  type="button"
                  :disabled="ppdbIdx >= brochureItems.length - 1"
                  @click="ppdbNext"
                  class="inline-flex h-10 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  Berikutnya
                </button>

                <a
                  v-if="activeBrochure"
                  :href="activeBrochure.url"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white transition hover:bg-green-700"
                >
                  <Icon icon="lucide:external-link" class="h-4 w-4" />
                  Buka File
                </a>

                <button
                  type="button"
                  class="inline-flex h-10 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="closeBrochure"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /modal -->
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead, useNuxtApp, useRuntimeConfig, useSeoMeta } from '#imports'
import { onValue, push, ref as dbRef, serverTimestamp, set } from 'firebase/database'
import { useCloudinaryUpload } from '~/composables/useCloudinaryUpload'

type DocKey = 'kk' | 'akte' | 'ktpAyah' | 'ktpIbu'
type DocMode = 'image' | 'pdf'

type RegistrationPageConfig = {
  year: number
  title: string
  subtitle: string
  institutionName: string
  institutionShortName: string
  description: string
  email: string
  whatsapp: string
  brochures: string[]
  timeline: {
    registration: string
    selection: string
    announcement: string
  }
}

type DocBox = {
  mode: DocMode
  file: File | null
  url: string | null
  pdfLink: string
  uploadedUrl?: string
  publicId?: string
}

type UploadedDoc = {
  mode: DocMode
  url: string
  publicId?: string
  fileName?: string
  mimeType?: string
}

const { $realtimeDb } = useNuxtApp() as any
const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

const clientName = String(config.public.clientName || 'alinayah')
const siteUrl = String(config.public.siteUrl || config.public.siteURL || 'https://alinayah.sencra.io').replace(/\/$/, '')
const appLogo = String(config.public.appLogo || '/assets/logo.png')
const themeColor = String(config.public.appThemeColor || '#16a34a')

const { uploadImage, uploading: cloudUploading } = useCloudinaryUpload()

const inputBase =
  'block h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:bg-neutral-900'

const labelBase =
  'mb-1.5 block text-xs font-black uppercase tracking-[0.14em] text-gray-500 dark:text-neutral-400'

const defaultRegistrationConfig: RegistrationPageConfig = {
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
    announcement: '-'
  }
}

const registrationConfig = ref<RegistrationPageConfig>({ ...defaultRegistrationConfig })
const ppdbYear = computed(() => Number(registrationConfig.value.year) || new Date().getFullYear())

function subscribeRegistrationConfig() {
  if (!$realtimeDb) return

  const path = `${clientName}/form/pendaftaran`
  const unsub = onValue(dbRef($realtimeDb, path), (snap) => {
    const val = snap.val() || {}

    registrationConfig.value = {
      year: Number(val.year) || defaultRegistrationConfig.year,
      title: val.title || defaultRegistrationConfig.title,
      subtitle: val.subtitle || defaultRegistrationConfig.subtitle,
      institutionName: val.institutionName || defaultRegistrationConfig.institutionName,
      institutionShortName: val.institutionShortName || defaultRegistrationConfig.institutionShortName,
      description: val.description || defaultRegistrationConfig.description,
      email: val.email || defaultRegistrationConfig.email,
      whatsapp: normalizeWhatsappValue(val.whatsapp || defaultRegistrationConfig.whatsapp),
      brochures: Array.isArray(val.brochures) ? val.brochures.filter(Boolean).map(String) : defaultRegistrationConfig.brochures,
      timeline: {
        registration: val.timeline?.registration || defaultRegistrationConfig.timeline.registration,
        selection: val.timeline?.selection || defaultRegistrationConfig.timeline.selection,
        announcement: val.timeline?.announcement || defaultRegistrationConfig.timeline.announcement
      }
    }
  })

  _unsubs.push(unsub)
}

/** SEO */
const pageTitle = computed(() => `PSB Online ${ppdbYear.value}/${ppdbYear.value + 1} | ${registrationConfig.value.institutionShortName}`)
const pageDescription = computed(() => registrationConfig.value.description || defaultRegistrationConfig.description)
const canonicalUrl = computed(() => new URL(route.fullPath || '/registrationPPDB', siteUrl).toString())
const seoImage = computed(() => absoluteUrl(appLogo))

useSeoMeta({
  title: () => pageTitle.value,
  description: () => pageDescription.value,
  ogTitle: () => pageTitle.value,
  ogDescription: () => pageDescription.value,
  ogType: 'website',
  ogUrl: () => canonicalUrl.value,
  ogImage: () => seoImage.value,
  ogSiteName: () => registrationConfig.value.institutionName,
  ogLocale: 'id_ID',
  twitterCard: 'summary_large_image',
  twitterTitle: () => pageTitle.value,
  twitterDescription: () => pageDescription.value,
  twitterImage: () => seoImage.value,
  themeColor,
  robots: 'index, follow'
})

const jsonLd = computed(() =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `PSB ${registrationConfig.value.institutionShortName} ${ppdbYear.value}/${ppdbYear.value + 1}`,
    description: pageDescription.value,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    startDate: `${ppdbYear.value}-01-01`,
    endDate: `${ppdbYear.value}-12-31`,
    url: canonicalUrl.value,
    organizer: {
      '@type': 'EducationalOrganization',
      name: registrationConfig.value.institutionName,
      url: siteUrl
    },
    location: {
      '@type': 'VirtualLocation',
      url: canonicalUrl.value
    },
    image: [seoImage.value]
  })
)

useHead(() => ({
  htmlAttrs: { lang: 'id' },
  link: [
    { rel: 'canonical', href: canonicalUrl.value },
    { rel: 'icon', href: appLogo },
    { rel: 'apple-touch-icon', href: appLogo }
  ],
  script: [
    {
      key: 'ppdb-jsonld',
      type: 'application/ld+json',
      innerHTML: jsonLd.value
    }
  ]
}))

/** Steps */
const steps = [
  { key: 'cover', label: 'Pembuka', desc: 'Himbauan awal', icon: 'lets-icons:form' },
  { key: 'siswa', label: 'Santri', desc: 'Identitas calon santri', icon: 'ph:user' },
  { key: 'alamat', label: 'Alamat', desc: 'Domisili lengkap', icon: 'ph:map-pin' },
  { key: 'pend', label: 'Pendidikan', desc: 'Riwayat sekolah', icon: 'ph:books' },
  { key: 'ortu', label: 'Ortu & Wali', desc: 'Data keluarga', icon: 'ph:users-three' },
  { key: 'dok', label: 'Dokumen', desc: 'Upload berkas', icon: 'ph:cloud-arrow-up' },
  { key: 'ok', label: 'Konfirmasi', desc: 'Review & submit', icon: 'ph:check-circle' }
] as const

const step = ref(0)
const activeStep = computed(() => steps[step.value] || steps[0])
const progress = computed(() => Math.round(((step.value + 1) / steps.length) * 100))

function goToStep(target: number) {
  if (target <= step.value) {
    step.value = target
    return
  }

  for (let i = 0; i < target; i++) {
    if (!validStep(i)) {
      step.value = i
      return
    }
  }

  step.value = target
}

function next() {
  if (canNext.value && step.value < steps.length - 1) step.value++
}

function prev() {
  if (step.value > 0) step.value--
}

/** State */
const form = reactive({
  siswa: {
    nama: '',
    jk: '',
    tmpLahir: '',
    tglLahir: '',
    tinggi: '',
    berat: '',
    cita: '',
    hobi: '',
    kk: '',
    nik: '',
    nisn: ''
  },
  alamat: {
    jalan: '',
    rt: '',
    rw: '',
    dusun: '',
    desa: '',
    kec: '',
    kab: '',
    prov: '',
    kodepos: '',
    tinggal: 'orangtua'
  },
  pendidikan: {
    status: '',
    sekolah: '',
    alamatSekolah: '',
    nonformal: [] as string[],
    nfNama: '',
    nfAlamat: ''
  },
  ortu: {
    ayah: {
      nama: '',
      status: 'Hidup',
      pendidikan: '',
      pekerjaan: '',
      penghasilan: ''
    },
    ibu: {
      nama: '',
      status: 'Hidup',
      pendidikan: '',
      pekerjaan: '',
      penghasilan: ''
    },
    hp1: '',
    hp2: ''
  },
  wali: {
    nama: '',
    status: 'Hidup',
    pendidikan: '',
    pekerjaan: '',
    penghasilan: '',
    hp: ''
  },
  pernyataan: {
    keaslian: false
  }
})

const docs = reactive<Record<DocKey, DocBox>>({
  kk: { mode: 'image', file: null, url: null, pdfLink: '' },
  akte: { mode: 'image', file: null, url: null, pdfLink: '' },
  ktpAyah: { mode: 'image', file: null, url: null, pdfLink: '' },
  ktpIbu: { mode: 'image', file: null, url: null, pdfLink: '' }
})

const docConfigs: Array<{ key: DocKey; label: string }> = [
  { key: 'kk', label: 'Kartu Keluarga' },
  { key: 'akte', label: 'Akta Kelahiran' },
  { key: 'ktpAyah', label: 'KTP Ayah' },
  { key: 'ktpIbu', label: 'KTP Ibu' }
]

const tinggalOptions = [
  { value: 'orangtua', label: 'Orangtua Kandung' },
  { value: 'wali', label: 'Wali' },
  { value: 'lainnya', label: 'Lainnya' }
]

const pendidikanStatusOptions = [
  { value: 'kelas6', label: 'Kelas 6 SD/MI' },
  { value: 'tidaksekolah', label: 'Tidak Sekolah' },
  { value: 'lainnya', label: 'Lainnya' }
]

const nonformalOptions = [
  { value: 'tpq', label: 'TPQ/Madin' },
  { value: 'ponpes', label: 'Pondok Pesantren' },
  { value: 'tidak', label: 'Tidak Pernah' }
]

const pendidikanOptions = ['Tidak Sekolah', 'SD', 'SMP', 'SMA', 'D1/D2', 'S1', 'S2', 'S3']
const pekerjaanOptions = ['Tidak Bekerja', 'Petani', 'PNS/ASN', 'TNI/POLRI', 'Guru', 'Swasta', 'Wiraswasta', 'Pengusaha', 'Peternak', 'Lainnya']
const penghasilanOptions = ['< Rp1.000.000', 'Rp1.000.000 - Rp2.000.000', 'Rp2.000.001 - Rp3.000.000', 'Rp3.000.001 - Rp4.000.000', '> Rp4.000.000']

/** Validation */
function validStep(i: number) {
  switch (i) {
    case 0:
      return true
    case 1:
      return !!(form.siswa.nama && form.siswa.jk && form.siswa.tmpLahir && form.siswa.tglLahir && form.siswa.nik)
    case 2:
      return !!(form.alamat.jalan && form.alamat.desa && form.alamat.kec && form.alamat.kab && form.alamat.prov)
    case 3:
      return true
    case 4:
      return !!(form.ortu.ayah.nama && form.ortu.ibu.nama && form.ortu.hp1)
    case 5:
      return docConfigs.every((doc) => isDocReady(doc.key)) && form.pernyataan.keaslian
    case 6:
      return true
    default:
      return false
  }
}

const canNext = computed(() => validStep(step.value))
const canSubmit = computed(() => validStep(5))

/** Local draft */
const DRAFT_KEY = computed(() => `${clientName}_ppdb_registration_v4`)

onMounted(() => {
  try {
    subscribePPDBSettings()
    subscribeRegistrationConfig()
    startTicker()

    const raw = localStorage.getItem(DRAFT_KEY.value)
    if (raw) {
      const parsed = JSON.parse(raw)
      deepAssign(form, parsed.form || {})
      step.value = parsed.step ?? 0

      if (parsed.docs) {
        for (const key of Object.keys(docs) as DocKey[]) {
          docs[key].mode = parsed.docs[key]?.mode || 'image'
          docs[key].pdfLink = parsed.docs[key]?.pdfLink || ''
          docs[key].file = null
          docs[key].url = null
        }
      }
    }
  } catch {}
})

watch(
  form,
  () => saveDraft(),
  { deep: true }
)

watch(
  docs,
  () => saveDraft(),
  { deep: true }
)

function saveDraft() {
  if (!process.client) return

  const docDraft = Object.fromEntries(
    (Object.keys(docs) as DocKey[]).map((key) => [
      key,
      {
        mode: docs[key].mode,
        pdfLink: docs[key].pdfLink
      }
    ])
  )

  localStorage.setItem(DRAFT_KEY.value, JSON.stringify({ form, step: step.value, docs: docDraft }))
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY.value)
  window.location.reload()
}

function deepAssign(target: any, source: any) {
  for (const key of Object.keys(source || {})) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) && target[key]) {
      deepAssign(target[key], source[key])
    } else {
      target[key] = source[key]
    }
  }
}

/** UI helpers */
const alamatSingkat = computed(() => {
  const a = form.alamat
  const parts = [a.jalan, a.desa, a.kec, a.kab, a.prov].filter(Boolean)
  return parts.length ? parts.join(', ') : '—'
})

const dokumenCheck = computed(() => {
  return docConfigs.every((doc) => isDocReady(doc.key)) ? 'Lengkap' : 'Belum Lengkap'
})

function jenjangFromStatus(status: string) {
  if (status === 'kelas6') return 'Lulusan SD/MI'
  if (status === 'tidaksekolah') return 'Tidak Sekolah'
  return status || '—'
}

/** Document handlers */
function setDocMode(key: DocKey, mode: DocMode) {
  docs[key].mode = mode
}

function onImageFileChange(key: DocKey, e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0] || null
  input.value = ''

  if (!file) return
  setImageFile(key, file)
}

function handleImageDrop(key: DocKey, e: DragEvent) {
  const file = e.dataTransfer?.files?.[0] || null
  if (!file) return
  setImageFile(key, file)
}

function setImageFile(key: DocKey, file: File) {
  const err = validateImageDoc(file)

  if (err) {
    feedback.value = err
    ok.value = false
    return
  }

  revokeDocUrl(key)
  docs[key].mode = 'image'
  docs[key].file = file
  docs[key].url = URL.createObjectURL(file)
  docs[key].pdfLink = ''
}

function validateImageDoc(file: File) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp']

  if (!allowed.includes(file.type)) return 'Dokumen gambar harus berformat JPG, PNG, atau WebP.'

  const max = 5 * 1024 * 1024
  if (file.size > max) return 'Ukuran gambar maksimal 5 MB.'

  return ''
}

function isDocReady(key: DocKey) {
  const doc = docs[key]

  if (doc.mode === 'image') return !!doc.file || !!doc.uploadedUrl
  return !!pdfEmbedUrl(doc.pdfLink)
}

function revokeDocUrl(key: DocKey) {
  if (docs[key].url) URL.revokeObjectURL(docs[key].url as string)
  docs[key].url = null
}

function hideImg(e: Event) {
  ;(e.target as HTMLImageElement).style.display = 'none'
}

function fileSizeText(size?: number) {
  if (!size) return ''
  const kb = Math.round(size / 1024)
  return `${kb} KB`
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

function pdfEmbedUrl(value: string) {
  const url = String(value || '').trim()
  if (!url || !isValidUrl(url)) return ''

  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/)
  if (driveFileMatch?.[1]) {
    return `https://drive.google.com/file/d/${driveFileMatch[1]}/preview`
  }

  const driveOpenMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/)
  if (driveOpenMatch?.[1]) {
    return `https://drive.google.com/file/d/${driveOpenMatch[1]}/preview`
  }

  const driveUcMatch = url.match(/drive\.google\.com\/uc\?id=([^&]+)/)
  if (driveUcMatch?.[1]) {
    return `https://drive.google.com/file/d/${driveUcMatch[1]}/preview`
  }

  if (/\.pdf(\?|#|$)/i.test(url)) return url

  return url
}

async function uploadDocumentImages(regId: string) {
  const out: Record<DocKey, UploadedDoc> = {} as Record<DocKey, UploadedDoc>

  for (const item of docConfigs) {
    const key = item.key
    const doc = docs[key]

    if (doc.mode === 'pdf') {
      const embed = pdfEmbedUrl(doc.pdfLink)
      if (!embed) throw new Error(`${item.label} belum memiliki link PDF yang valid.`)

      out[key] = {
        mode: 'pdf',
        url: doc.pdfLink
      }
      continue
    }

    if (!doc.file) {
      throw new Error(`${item.label} belum diunggah.`)
    }

    const uploaded = await uploadImage(doc.file, {
      folder: `${clientName}/ppdb/${regId}/dokumen`,
      maxWidth: 1800,
      maxHeight: 1800,
      quality: 0.84
    })

    out[key] = {
      mode: 'image',
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      fileName: doc.file.name,
      mimeType: doc.file.type
    }
  }

  return out
}

/** WhatsApp */
function normalizeWhatsappValue(raw: unknown) {
  if (raw == null) return ''
  if (typeof raw === 'string') return raw.trim()
  if (typeof raw === 'number') return String(raw)
  if (typeof raw === 'object') {
    return String((raw as any).number ?? (raw as any).phone ?? (raw as any).value ?? '').trim()
  }
  return String(raw).trim()
}

const normalizedWhatsapp = computed(() => normalizeWhatsappValue(registrationConfig.value?.whatsapp))
const waDigits = computed(() => normalizedWhatsapp.value.replace(/\D/g, ''))

const waText = computed(() => {
  const digits = waDigits.value
  if (!digits) return '-'
  if (digits.startsWith('62')) return `0${digits.slice(2)}`
  if (digits.startsWith('8')) return `0${digits}`
  return digits
})

const waUrl = computed(() => {
  const digits = waDigits.value
  if (!digits) return '#'
  if (digits.startsWith('62')) return `https://wa.me/${digits}`
  if (digits.startsWith('0')) return `https://wa.me/62${digits.slice(1)}`
  if (digits.startsWith('8')) return `https://wa.me/62${digits}`
  return `https://wa.me/${digits}`
})

/** Token helpers */
const BASE62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function randomBase62(len: number) {
  const arr = new Uint32Array(len)
  crypto.getRandomValues(arr)

  let out = ''
  for (let i = 0; i < len; i++) out += BASE62[arr[i]! % BASE62.length]
  return out
}

function slugName(name: string) {
  return (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 12) || 'user'
}

function genUsername(name: string, id: string) {
  return `${slugName(name)}.${id.slice(-5).toLowerCase()}`
}

async function sha256Hex(input: string) {
  const enc = new TextEncoder().encode(input)
  const hash = await crypto.subtle.digest('SHA-256', enc)
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

function niceCode(id: string) {
  const date = new Date()
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const prefix = (registrationConfig.value.institutionShortName || clientName || 'PPDB')
    .replace(/[^A-Za-z0-9]/g, '')
    .slice(0, 4)
    .toUpperCase() || 'PPDB'

  return `${prefix}-${y}${m}${d}-${id.slice(-5).toUpperCase()}`
}

function primaryWaliName() {
  return form.wali.nama?.trim() || form.ortu.ayah.nama?.trim() || form.ortu.ibu.nama?.trim() || ''
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {}
}

/** PPDB realtime settings */
type PpdbSettings = {
  isClosed?: boolean
  autoCloseEnabled?: boolean
  autoCloseAt?: string | number
  notice?: string
}

const TZ_JKT = 'Asia/Jakarta'
const ppdbSettings = ref<PpdbSettings>({})
const serverOffsetMs = ref(0)
const nowLocalMs = ref(Date.now())
const ticker = ref<ReturnType<typeof setInterval> | null>(null)
const _unsubs: Array<() => void> = []

const nowMs = computed(() => nowLocalMs.value + serverOffsetMs.value)
const isClosedManual = computed(() => !!ppdbSettings.value.isClosed)
const autoEnabled = computed(() => !!ppdbSettings.value.autoCloseEnabled)
const autoAtMs = computed(() => toMs(ppdbSettings.value.autoCloseAt))
const fallbackHardStopMs = computed(() => new Date(`${ppdbYear.value}-12-31T23:59:59+07:00`).getTime())
const isAutoDue = computed(() => !!autoAtMs.value && nowMs.value >= autoAtMs.value)
const isFallbackDue = computed(() => nowMs.value >= fallbackHardStopMs.value)
const isFormClosed = computed(() => isClosedManual.value || isAutoDue.value || isFallbackDue.value)

const closedReason = computed(() => {
  if (ppdbSettings.value.notice) return ppdbSettings.value.notice
  if (isClosedManual.value) return 'Pendaftaran ditutup oleh panitia.'
  if (isAutoDue.value && autoAtMs.value) return `Pendaftaran ditutup otomatis pada ${formatInJktMs(autoAtMs.value)}.`
  if (isFallbackDue.value) return `Pendaftaran ditutup otomatis sesuai timeline (${formatInJktMs(fallbackHardStopMs.value)}).`
  return ''
})

function toMs(value: any) {
  if (!value && value !== 0) return null
  if (typeof value === 'number') return value > 1e12 ? value : value * 1000

  if (typeof value === 'string') {
    const s = value.trim()
    if (/^\d{10,13}$/.test(s)) return s.length > 10 ? Number(s) : Number(s) * 1000

    const t = Date.parse(s)
    if (!Number.isNaN(t)) return t
  }

  return null
}

function formatInJktMs(ms: number) {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      timeZone: TZ_JKT,
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(ms))
  } catch {
    return new Date(ms).toLocaleString('id-ID')
  }
}

function subscribePPDBSettings() {
  if (!$realtimeDb) return

  const p = `${clientName}/form/pendaftaran`

  const off = onValue(dbRef($realtimeDb, p), (snap) => {
    const v = snap.val()
    if (v && typeof v === 'object') {
      ppdbSettings.value = { ...ppdbSettings.value, ...v }
    }
  })

  _unsubs.push(off)

  const offOffset = onValue(dbRef($realtimeDb, '.info/serverTimeOffset'), (snap) => {
    serverOffsetMs.value = Number(snap.val() || 0)
  })

  _unsubs.push(offOffset)
}

function startTicker() {
  nowLocalMs.value = Date.now()

  ticker.value = setInterval(() => {
    nowLocalMs.value = Date.now()
  }, 1000)
}

const countdownText = computed(() => {
  if (!autoEnabled.value || !autoAtMs.value) return '—'

  const t = autoAtMs.value - nowMs.value
  if (t <= 0) return '00:00:00'

  const sec = Math.floor(t / 1000)
  const d = Math.floor(sec / 86400)
  const h = Math.floor((sec % 86400) / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  const pad = (n: number) => String(n).padStart(2, '0')

  return d > 0 ? `${d}h ${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(h)}:${pad(m)}:${pad(s)}`
})

/** Submit */
const loading = ref(false)
const feedback = ref('')
const ok = ref(false)
const receipt = ref<{ username: string; publicToken: string } | null>(null)
const regInfo = ref<{ id: string; code: string } | null>(null)
const submitConfirmOpen = ref(false)
const submitSuccessOpen = ref(false)
const registrationCardOpen = ref(false)
const receiptDownloaded = ref(false)
const downloadCardLoading = ref(false)
const registrationCardRef = ref<HTMLElement | null>(null)
const submittedAtText = ref('')

const registrationCardRows = computed(() => [
  {
    label: 'Nama Santri',
    value: form.siswa.nama || '—'
  },
  {
    label: 'Jenis Kelamin',
    value: form.siswa.jk === 'P' ? 'Perempuan' : form.siswa.jk === 'L' ? 'Laki-laki' : '—'
  },
  {
    label: 'Tempat, Tanggal Lahir',
    value: `${form.siswa.tmpLahir || '-'}, ${formatDateOnly(form.siswa.tglLahir)}`
  },
  {
    label: 'NIK',
    value: form.siswa.nik || '—'
  },
  {
    label: 'NISN',
    value: form.siswa.nisn || '—'
  },
  {
    label: 'Jenjang',
    value: jenjangFromStatus(form.pendidikan.status)
  },
  {
    label: 'Nama Wali/Orang Tua',
    value: primaryWaliName() || '—'
  },
  {
    label: 'Nomor HP',
    value: form.ortu.hp1 || '—'
  },
  {
    label: 'Alamat',
    value: alamatSingkat.value || '—'
  },
  {
    label: 'Username',
    value: receipt.value?.username || '—'
  },
  {
    label: 'Public Token',
    value: receipt.value?.publicToken || '—'
  },
  {
    label: 'Tanggal Submit',
    value: submittedAtText.value || '—'
  }
])

function validateDocuments() {
  for (const item of docConfigs) {
    const doc = docs[item.key]

    if (doc.mode === 'image') {
      if (!doc.file) return `${item.label} wajib diunggah sebagai gambar atau diisi link PDF.`
      const err = validateImageDoc(doc.file)
      if (err) return `${item.label}: ${err}`
    }

    if (doc.mode === 'pdf') {
      if (!pdfEmbedUrl(doc.pdfLink)) return `${item.label}: link PDF/Google Drive belum valid.`
    }
  }

  if (!form.pernyataan.keaslian) return 'Mohon centang pernyataan keaslian dokumen.'

  return ''
}

function findFirstInvalidStep() {
  for (let i = 1; i <= 5; i++) {
    if (!validStep(i)) return i
  }

  return -1
}

function openSubmitConfirm() {
  if (isFormClosed.value) {
    feedback.value = 'Maaf, pendaftaran sudah ditutup.'
    ok.value = false
    return
  }

  const invalidStep = findFirstInvalidStep()

  if (invalidStep !== -1) {
    step.value = invalidStep
    feedback.value = `Data pada langkah ${invalidStep + 1} belum lengkap. Mohon cek kembali.`
    ok.value = false
    return
  }

  const docErr = validateDocuments()

  if (docErr) {
    step.value = 5
    feedback.value = docErr
    ok.value = false
    return
  }

  feedback.value = ''
  ok.value = false
  submitConfirmOpen.value = true
}

async function confirmSubmitFromModal() {
  await submit()
}

function openRegistrationCardModal() {
  submitSuccessOpen.value = false
  registrationCardOpen.value = true
}

function formatDateOnly(value?: string) {
  if (!value) return '—'

  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date(value))
  } catch {
    return value
  }
}

function formatDateTimeID(value: Date = new Date()) {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Jakarta'
    }).format(value)
  } catch {
    return value.toLocaleString('id-ID')
  }
}

function safeFileName(value: string) {
  return String(value || 'kartu-pendaftaran')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2)

  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 2
) {
  const words = String(text || '—').split(/\s+/)
  const lines: string[] = []
  let line = ''

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word
    const metrics = ctx.measureText(testLine)

    if (metrics.width > maxWidth && line) {
      lines.push(line)
      line = word

      if (lines.length >= maxLines) break
    } else {
      line = testLine
    }
  }

  if (line && lines.length < maxLines) lines.push(line)

  lines.forEach((item, index) => {
    ctx.fillText(item, x, y + index * lineHeight)
  })

  return y + lines.length * lineHeight
}

async function downloadRegistrationCard() {
  if (!regInfo.value || !receipt.value) return

  downloadCardLoading.value = true

  try {
    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 820

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Browser tidak mendukung canvas.')

    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#ffffff'
    drawRoundedRect(ctx, 48, 48, 1104, 724, 34)
    ctx.fill()
    ctx.strokeStyle = '#bbf7d0'
    ctx.lineWidth = 3
    ctx.stroke()

    ctx.fillStyle = '#15803d'
    drawRoundedRect(ctx, 48, 48, 1104, 180, 34)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.font = '700 24px Arial'
    ctx.fillText(registrationConfig.value.institutionName || 'Lembaga Pendidikan', 88, 105)

    ctx.font = '900 42px Arial'
    ctx.fillText('Kartu Pendaftaran PSB', 88, 158)

    ctx.font = '600 22px Arial'
    ctx.fillText(`Tahun Ajaran ${ppdbYear.value}/${Number(ppdbYear.value) + 1}`, 88, 195)

    ctx.fillStyle = 'rgba(255,255,255,0.13)'
    drawRoundedRect(ctx, 832, 84, 270, 96, 22)
    ctx.fill()

    ctx.fillStyle = '#dcfce7'
    ctx.font = '700 16px Arial'
    ctx.fillText('NO. PENDAFTARAN', 860, 120)

    ctx.fillStyle = '#ffffff'
    ctx.font = '900 28px Arial'
    ctx.fillText(regInfo.value.code, 860, 158)

    const rows = registrationCardRows.value
    const leftX = 88
    const rightX = 610
    let leftY = 290
    let rightY = 290

    function drawRow(label: string, value: string, x: number, y: number) {
      ctx.fillStyle = '#64748b'
      ctx.font = '700 15px Arial'
      ctx.fillText(label.toUpperCase(), x, y)

      ctx.fillStyle = '#0f172a'
      ctx.font = '800 23px Arial'
      return wrapCanvasText(ctx, value || '—', x, y + 34, 430, 28, 2) + 18
    }

    rows.forEach((row, index) => {
      if (index % 2 === 0) {
        leftY = drawRow(row.label, row.value, leftX, leftY)
      } else {
        rightY = drawRow(row.label, row.value, rightX, rightY)
      }
    })

    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(88, 690)
    ctx.lineTo(1112, 690)
    ctx.stroke()

    ctx.fillStyle = '#475569'
    ctx.font = '600 18px Arial'
    ctx.fillText('Simpan kartu ini sebagai bukti pendaftaran. Bawa/siapkan saat proses verifikasi administrasi.', 88, 735)

    ctx.fillStyle = '#94a3b8'
    ctx.font = '500 15px Arial'
    ctx.fillText(`Dicetak otomatis pada ${formatDateTimeID(new Date())}`, 88, 762)

    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `${safeFileName(`kartu-${regInfo.value.code}`)}.png`
    document.body.appendChild(link)
    link.click()
    link.remove()

    receiptDownloaded.value = true
  } catch (error: any) {
    feedback.value = error?.message || 'Gagal membuat kartu pendaftaran.'
    ok.value = false
  } finally {
    downloadCardLoading.value = false
  }
}

async function backFromRegistrationCard() {
  if (!receiptDownloaded.value) {
    await downloadRegistrationCard()
  }

  registrationCardOpen.value = false
  await router.push('/')
}

async function submit() {
  if (isFormClosed.value) {
    feedback.value = 'Maaf, pendaftaran sudah ditutup.'
    ok.value = false
    return
  }

  if (!canSubmit.value) return

  const docErr = validateDocuments()
  if (docErr) {
    feedback.value = docErr
    ok.value = false
    return
  }

  loading.value = true
  feedback.value = ''
  ok.value = false
  regInfo.value = null
  receipt.value = null

  try {
    if (!$realtimeDb) throw new Error('Realtime Database tidak tersedia.')

    const baseRef = dbRef($realtimeDb, `${clientName}/santri`)
    const newRef = push(baseRef)
    const regId = newRef.key as string
    const code = niceCode(regId)

    const dokumen = await uploadDocumentImages(regId)

    const gender = (form.siswa.jk || '').toUpperCase() === 'P' ? 'P' : 'L'
    const tipe = gender === 'P' ? 'Putri' : 'Putra'

    const username = genUsername(form.siswa.nama, regId)
    const publicToken = `pub_${randomBase62(24)}`
    const secretToken = `sec_${randomBase62(48)}`
    const secretHash = `sha256:${await sha256Hex(secretToken)}`

    const dokumenCount = Object.values(dokumen || {}).filter((item: any) => {
      if (!item) return false
      if (typeof item === 'string') return !!item
      return !!(item.url || item.secure_url || item.secureUrl)
    }).length

    const santriRow = {
      id: regId,

      // utama
      gen: String(ppdbYear.value),
      santri: (form.siswa.nama || '').trim(),
      walisantri: primaryWaliName(),
      nohp: (form.ortu.hp1 || '').trim(),

      // identitas santri
      nik: (form.siswa.nik || '').trim(),
      kk: (form.siswa.kk || '').trim(),
      nisn: (form.siswa.nisn || '').trim(),
      jk: gender,
      gender,
      tipe,
      tmpLahir: (form.siswa.tmpLahir || '').trim(),
      tglLahir: form.siswa.tglLahir || '',

      // orang tua
      ayahNama: (form.ortu.ayah.nama || '').trim(),
      ibuNama: (form.ortu.ibu.nama || '').trim(),
      waliNama: (form.wali.nama || primaryWaliName() || '').trim(),
      hpOrtu1: (form.ortu.hp1 || '').trim(),
      hpOrtu2: (form.ortu.hp2 || '').trim(),

      // akademik/alamat
      jenjang: jenjangFromStatus(form.pendidikan.status),
      alamat: alamatSingkat.value,

      // status admin
      kuotaKunjunganBulanIni: 0,
      kamar: '-',
      maskan: '-',
      status: 'nonaktif',

      // PPDB
      ppdbCode: code,
      dokumenCount
    }

    const record = {
      ...santriRow,
      username,
      publicToken,
      createdAt: serverTimestamp(),
      dokumen,
      ppdb: {
        siswa: JSON.parse(JSON.stringify(form.siswa)),
        alamat: JSON.parse(JSON.stringify(form.alamat)),
        pendidikan: JSON.parse(JSON.stringify(form.pendidikan)),
        ortu: JSON.parse(JSON.stringify(form.ortu)),
        wali: JSON.parse(JSON.stringify(form.wali))
      },
      meta: {
        ua: navigator.userAgent,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    }

    await set(dbRef($realtimeDb, `${clientName}/santri/${regId}`), record)
    await set(dbRef($realtimeDb, `${clientName}/credentials/${regId}`), {
      secretHash,
      createdAt: serverTimestamp(),
      issuer: 'ppdb-form'
    })

    ok.value = true
    feedback.value = 'Pendaftaran terkirim. Nomor pendaftaran dan kredensial sementara telah dibuat.'
    regInfo.value = { id: regId, code }
    receipt.value = { username, publicToken }
    submittedAtText.value = formatDateTimeID(new Date())

    receiptDownloaded.value = false
    submitConfirmOpen.value = false
    submitSuccessOpen.value = true
    registrationCardOpen.value = false

    localStorage.removeItem(DRAFT_KEY.value)
  } catch (e: any) {
    console.error(e)
    submitConfirmOpen.value = false
    ok.value = false
    feedback.value = e?.message || 'Gagal mengirim pendaftaran.'
  } finally {
    loading.value = false
  }
}

/** Brochure viewer */
type BrochureItem = {
  url: string
  embedUrl: string
  type: 'image' | 'pdf'
  title: string
}

const brochureOpen = ref(false)
const ppdbStageRef = ref<HTMLDivElement | null>(null)
const ppdbIdx = ref(0)
const ppdbScale = ref(1)
const ppdbDragging = ref(false)
const ppdbPos = reactive({ x: 0, y: 0 })

const brochureItems = computed<BrochureItem[]>(() => {
  return (registrationConfig.value.brochures || [])
    .map((url, index) => {
      const embed = pdfEmbedUrl(url)
      const isPdf = /\.pdf(\?|#|$)/i.test(url) || /drive\.google\.com/i.test(url)

      return {
        url,
        embedUrl: isPdf ? embed : url,
        type: isPdf ? 'pdf' : 'image',
        title: `Brosur ${index + 1}`
      } as BrochureItem
    })
    .filter((item) => item.url)
})

const activeBrochure = computed(() => brochureItems.value[ppdbIdx.value] || null)

const ppdbImgStyle = computed(() => ({
  transform: `translate(-50%, -50%) translate(${ppdbPos.x}px, ${ppdbPos.y}px) scale(${ppdbScale.value})`
}))

watch(brochureOpen, (v) => {
  if (process.client) document.body.style.overflow = v ? 'hidden' : ''
})

function openBrochure() {
  ppdbIdx.value = 0
  ppdbReset()
  brochureOpen.value = true
}

function closeBrochure() {
  brochureOpen.value = false
}

function ppdbReset() {
  ppdbScale.value = 1
  ppdbPos.x = 0
  ppdbPos.y = 0
}

function ppdbZoomIn() {
  ppdbScale.value = Math.min(5, ppdbScale.value + 0.1)
}

function ppdbZoomOut() {
  ppdbScale.value = Math.max(0.2, ppdbScale.value - 0.1)
}

function ppdbPrev() {
  if (ppdbIdx.value > 0) {
    ppdbIdx.value--
    ppdbReset()
  }
}

function ppdbNext() {
  if (ppdbIdx.value < brochureItems.value.length - 1) {
    ppdbIdx.value++
    ppdbReset()
  }
}

function ppdbOnWheel(e: WheelEvent) {
  if (activeBrochure.value?.type === 'pdf') return

  const delta = -Math.sign(e.deltaY) * 0.05
  const next = ppdbScale.value + delta
  ppdbScale.value = Math.min(5, Math.max(0.2, next))
}

function ppdbOnPointerDown(e: MouseEvent) {
  if (activeBrochure.value?.type === 'pdf') return
  if (!ppdbStageRef.value) return

  ppdbDragging.value = true
  ppdbStageRef.value.dataset.dx = String(e.clientX - ppdbPos.x)
  ppdbStageRef.value.dataset.dy = String(e.clientY - ppdbPos.y)
}

function ppdbOnPointerMove(e: MouseEvent) {
  if (!ppdbDragging.value || !ppdbStageRef.value) return

  const dx = Number(ppdbStageRef.value.dataset.dx || 0)
  const dy = Number(ppdbStageRef.value.dataset.dy || 0)

  ppdbPos.x = e.clientX - dx
  ppdbPos.y = e.clientY - dy
}

function ppdbOnPointerUp() {
  ppdbDragging.value = false
}

function ppdbOnTouchStart(e: TouchEvent) {
  if (activeBrochure.value?.type === 'pdf') return
  if (!ppdbStageRef.value) return

  if (e.touches.length === 1) {
    ppdbStageRef.value.dataset.txx = String(e.touches[0]!.clientX - ppdbPos.x)
    ppdbStageRef.value.dataset.tyy = String(e.touches[0]!.clientY - ppdbPos.y)
  }
}

function ppdbOnTouchMove(e: TouchEvent) {
  if (!ppdbStageRef.value) return

  if (e.touches.length === 1) {
    const touch = e.touches[0]!
    const dx = Number(ppdbStageRef.value.dataset.txx || 0)
    const dy = Number(ppdbStageRef.value.dataset.tyy || 0)

    ppdbPos.x = touch.clientX - dx
    ppdbPos.y = touch.clientY - dy
  }
}

function ppdbOnTouchEnd() {}

function ppdbOnDblClick() {
  ppdbReset()
}

/** Helpers */
function absoluteUrl(path: string) {
  if (!path) return `${siteUrl}/assets/logo.png`
  if (/^https?:\/\//i.test(path)) return path
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

onBeforeUnmount(() => {
  for (const key of Object.keys(docs) as DocKey[]) revokeDocUrl(key)

  if (ticker.value) clearInterval(ticker.value)

  while (_unsubs.length) {
    try {
      _unsubs.pop()?.()
    } catch {}
  }

  if (process.client) document.body.style.overflow = ''
})

/** Local small display components */
const SectionTitle = defineComponent({
  name: 'SectionTitle',
  props: {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' }
  },
  setup(props) {
    return () =>
      h('div', { class: 'flex items-start gap-3' }, [
        h('div', { class: 'grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' }, [
          h(Icon, { icon: props.icon, class: 'h-5 w-5' })
        ]),
        h('div', { class: 'min-w-0' }, [
          h('h2', { class: 'text-xl font-black tracking-tight text-gray-950 dark:text-white' }, props.title),
          h('p', { class: 'mt-1 text-sm leading-6 text-gray-500 dark:text-neutral-400' }, props.subtitle)
        ])
      ])
  }
})

const SummaryItem = defineComponent({
  name: 'SummaryItem',
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true }
  },
  setup(props) {
    return () =>
      h('div', { class: 'flex items-start justify-between gap-3 border-b border-gray-100 pb-2 dark:border-neutral-800' }, [
        h('dt', { class: 'text-gray-500 dark:text-neutral-400' }, props.label),
        h('dd', { class: 'text-right font-semibold text-gray-950 dark:text-white' }, props.value)
      ])
  }
})

const TimelineItem = defineComponent({
  name: 'TimelineItem',
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true }
  },
  setup(props) {
    return () =>
      h('div', { class: 'rounded-2xl bg-gray-50 p-3 dark:bg-neutral-800' }, [
        h('p', { class: 'text-xs font-black uppercase tracking-[0.14em] text-gray-500 dark:text-neutral-400' }, props.label),
        h('p', { class: 'mt-1 text-sm font-semibold text-gray-950 dark:text-white' }, props.value || '-')
      ])
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>