<template>
  <main class="relative flex items-center py-24 min-h-screen overflow-hidden">
    <div class="absolute w-full bg-gradient-to-b from-blue-700/50 to-blue-700/0 top-0 left-0 h-[20vh]"></div>
    <!-- Dekorasi background -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div class="absolute -top-28 -left-24 w-[48rem] h-[48rem] rounded-full opacity-30 blur-3xl
                  bg-gradient-to-br from-blue-200 to-emerald-200 dark:from-emerald-900/40 dark:to-blue-900/30"></div>
      <div class="absolute -bottom-32 -right-24 w-[42rem] h-[42rem] rounded-full opacity-25 blur-3xl
                  bg-gradient-to-tr from-blue-100 to-emerald-100 dark:from-blue-900/30 dark:to-emerald-900/30"></div>
    </div>

    <div class="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <!-- HERO -->
      <header class="mb-6">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">
              <ClientOnly><Icon icon="ph:student" class="size-4" /></ClientOnly>
              PPDB Online 2025/2026
            </p>
            <h1 class="mt-1 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Form Pendaftaran Santri Baru</h1>
            <p class="text-gray-600 dark:text-neutral-300">Isi data berikut dengan benar. Draf tersimpan otomatis di perangkat Anda.</p>
          </div>

          <div class="shrink-0 flex items-center gap-2">
            <button @click="clearDraft" class="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 px-3 py-2 text-sm font-medium hover:bg-white dark:hover:bg-neutral-800">
              <ClientOnly><Icon icon="ph:trash" class="size-4" /></ClientOnly>
              Reset Form
            </button>
            <a href="/waliLogin" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-3 py-2 text-sm font-semibold hover:bg-blue-700">
              <ClientOnly><Icon icon="ph:sign-in" class="size-4" /></ClientOnly>
              Login Wali
            </a>
          </div>
        </div>
      </header>

      <div class="grid lg:grid-cols-12 gap-6 items-start">
        <!-- ================= LEFT: FORM ================= -->
        <section class="lg:col-span-8">
          <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 backdrop-blur shadow-xl">
            <!-- Stepper -->
            <div class="border-b border-gray-200 dark:border-neutral-800 p-4">
              <div class="flex flex-wrap items-center gap-2">
                <button
                  v-for="(s,i) in steps" :key="s.key"
                  class="group relative px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition"
                  :class="i === step ? 'bg-blue-600 text-white' : (i < step ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-200')"
                  @click="go(i)"
                >
                  <span class="inline-flex items-center gap-2">
                    <ClientOnly><Icon :icon="s.icon" class="size-4" /></ClientOnly>
                    {{ s.label }}
                  </span>
                </button>
              </div>
              <div class="mt-3 h-2 rounded-full bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                <div class="h-full bg-blue-600 transition-all" :style="{ width: progress + '%' }"></div>
              </div>
            </div>

            <!-- Body -->
            <div class="p-5 sm:p-7">
              <!-- STEP 0: SISWA -->
              <div v-if="step===0" class="grid sm:grid-cols-2 gap-4">
                <TextField v-model="form.siswa.nama" label="Nama Lengkap" required />
                <TextField v-model="form.siswa.nisn" label="NISN" placeholder="10 digit" />
                <TextField v-model="form.siswa.nik" label="NIK" placeholder="16 digit" />
                <TextField v-model="form.siswa.tmpLahir" label="Tempat Lahir" required />
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Tanggal Lahir <span class="text-red-600">*</span></span>
                  <input type="date" v-model="form.siswa.tglLahir" class="mt-1 py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 border" required />
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Jenis Kelamin <span class="text-red-600">*</span></span>
                  <select v-model="form.siswa.jk" class="mt-1 py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 border" required>
                    <option value="" disabled>Pilih</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Agama <span class="text-red-600">*</span></span>
                  <select v-model="form.siswa.agama" class="mt-1 py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 border" required>
                    <option>Islam</option>
                  </select>
                </label>
                <TextField v-model="form.sekolah.asal" label="Asal Sekolah" />
                <TextField v-model="form.sekolah.npsn" label="NPSN" />
              </div>

              <!-- STEP 1: ORANG TUA -->
              <div v-else-if="step===1" class="grid sm:grid-cols-2 gap-4">
                <TextField v-model="form.ortu.ayahNama" label="Nama Ayah" required />
                <TextField v-model="form.ortu.ayahHP" label="HP Ayah (WA)" required />
                <TextField v-model="form.ortu.ibuNama" label="Nama Ibu" required />
                <TextField v-model="form.ortu.ibuHP" label="HP Ibu (WA)" required />
                <TextField v-model="form.ortu.waliNama" label="Nama Wali (Opsional)" />
                <TextField v-model="form.ortu.waliHP" label="HP Wali (Opsional)" />
                <label class="block sm:col-span-2">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Pekerjaan Orang Tua</span>
                  <input v-model="form.ortu.pekerjaan" type="text" class="mt-1 py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 border" placeholder="Contoh: Wiraswasta" />
                </label>
              </div>

              <!-- STEP 2: ALAMAT -->
              <div v-else-if="step===2" class="grid sm:grid-cols-2 gap-4">
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Provinsi <span class="text-red-600">*</span></span>
                  <select v-model="form.alamat.prov" class="mt-1 py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 border" required>
                    <option value="" disabled>Pilih</option>
                    <option v-for="p in provinsi" :key="p" :value="p">{{ p }}</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Kabupaten/Kota <span class="text-red-600">*</span></span>
                  <select v-model="form.alamat.kab" class="mt-1 py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 border" required>
                    <option value="" disabled>Pilih</option>
                    <option v-for="k in kabupaten" :key="k" :value="k">{{ k }}</option>
                  </select>
                </label>
                <TextField v-model="form.alamat.kec" label="Kecamatan" required />
                <TextField v-model="form.alamat.kel" label="Kelurahan/Desa" required />
                <TextField v-model="form.alamat.kodepos" label="Kode Pos" />
                <label class="block sm:col-span-2">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Alamat Lengkap <span class="text-red-600">*</span></span>
                  <textarea v-model="form.alamat.detail" rows="3" class="mt-1 py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 border" required placeholder="Nama jalan, RT/RW, patokan"></textarea>
                </label>
              </div>

              <!-- STEP 3: PROGRAM -->
              <div v-else-if="step===3" class="grid sm:grid-cols-2 gap-4">
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Jenjang <span class="text-red-600">*</span></span>
                  <select v-model="form.program.jenjang" class="mt-1 py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 border" required>
                    <option value="" disabled>Pilih</option>
                    <option>MTs</option>
                    <option>MA</option>
                    <option>KMI/Diniyah</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Peminatan</span>
                  <select v-model="form.program.minat" class="mt-1 py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 border">
                    <option value="">—</option>
                    <option>IPA</option>
                    <option>IPS</option>
                    <option>Bahasa</option>
                    <option>Tahfidz</option>
                  </select>
                </label>

                <div class="sm:col-span-2">
                  <label class="flex items-center gap-3">
                    <input type="checkbox" v-model="form.program.tahfidz" class="chk"> <span>Ikut Program Tahfidz</span>
                  </label>
                  <label class="flex items-center gap-3 mt-2">
                    <input type="checkbox" v-model="form.program.asrama" class="chk"> <span>Tinggal Asrama</span>
                  </label>
                </div>

                <div class="sm:col-span-2">
                  <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-4 bg-gray-50/60 dark:bg-neutral-800/50">
                    <div class="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                      <ClientOnly><Icon icon="ph:receipt" class="size-4 text-emerald-600" /></ClientOnly>
                      Estimasi Biaya
                    </div>
                    <dl class="mt-2 grid sm:grid-cols-2 gap-y-1 text-sm">
                      <div class="flex justify-between"><dt>Formulir</dt><dd class="font-medium">Rp 150.000</dd></div>
                      <div class="flex justify-between"><dt>Daftar Ulang (estimasi)</dt><dd class="font-medium">Rp 2.500.000</dd></div>
                    </dl>
                    <p class="mt-2 text-[12px] text-gray-500 dark:text-neutral-400">*Rincian resmi diberikan saat pengumuman kelulusan.</p>
                  </div>
                </div>
              </div>

              <!-- STEP 4: DOKUMEN -->
              <div v-else-if="step===4" class="grid sm:grid-cols-2 gap-4">
                <UploadField label="Kartu Keluarga (PDF/JPG)" hint="Maks 2MB" :accept="['application/pdf','image/*']" v-model="files.kk" />
                <UploadField label="Akte Kelahiran (PDF/JPG)" hint="Maks 2MB" :accept="['application/pdf','image/*']" v-model="files.akte" />
                <UploadField label="Raport Terakhir (PDF)" hint="Maks 5MB" :accept="['application/pdf']" v-model="files.raport" />
                <UploadField label="Pas Foto 3x4 (JPG/PNG)" hint="Maks 1MB" :accept="['image/*']" v-model="files.foto" />

                <div class="sm:col-span-2">
                  <label class="flex items-start gap-3">
                    <input type="checkbox" v-model="form.pernyataan.keaslian" class="chk" />
                    <span class="text-sm">Saya menyatakan semua dokumen yang diunggah adalah <b>asli/scan dokumen resmi</b>.</span>
                  </label>
                </div>
              </div>

              <!-- STEP 5: AKUN -->
              <div v-else-if="step===5" class="grid sm:grid-cols-2 gap-4">
                <TextField v-model="form.akun.email"  label="Email Wali" required />
                <TextField v-model="form.akun.phone"  label="No. HP Wali (WA)" required />

                <div class="relative">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Kata Sandi <span class="text-red-600">*</span></span>
                  <input :type="showPass ? 'text' : 'password'" v-model="form.akun.password" class="mt-1 inp pr-10" required />
                  <button type="button" @click="showPass=!showPass" class="icbtn">
                    <ClientOnly><Icon :icon="showPass?'ph:eye-slash':'ph:eye'" class="size-4 text-gray-500" /></ClientOnly>
                  </button>
                </div>
                <label class="block">
                  <span class="text-xs text-gray-600 dark:text-neutral-300">Konfirmasi Kata Sandi <span class="text-red-600">*</span></span>
                  <input :type="showPass ? 'text' : 'password'" v-model="form.akun.confirm" class="mt-1 py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 border" required />
                  <p v-if="passMismatch" class="mt-1 text-[12px] text-red-600">Konfirmasi tidak sama.</p>
                </label>

                <div class="sm:col-span-2">
                  <label class="flex items-start gap-3">
                    <input type="checkbox" v-model="form.pernyataan.kebenaran" class="chk" />
                    <span class="text-sm">Saya menyatakan data yang diisikan adalah <b>benar</b> dan <b>dapat dipertanggungjawabkan</b>.</span>
                  </label>
                </div>
              </div>

              <!-- STEP 6: KONFIRMASI -->
              <div v-else class="space-y-4">
                <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-4">
                  <div class="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                    <ClientOnly><Icon icon="ph:check-circle" class="size-5 text-emerald-600" /></ClientOnly>
                    Ringkasan Pendaftaran
                  </div>
                  <div class="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
                    <SummaryItem k="Nama" :v="form.siswa.nama"/>
                    <SummaryItem k="NISN" :v="form.siswa.nisn"/>
                    <SummaryItem k="TTL" :v="`${form.siswa.tmpLahir}, ${form.siswa.tglLahir || '-'}`"/>
                    <SummaryItem k="JK"  :v="form.siswa.jk"/>
                    <SummaryItem k="Jenjang" :v="form.program.jenjang"/>
                    <SummaryItem k="Minat" :v="form.program.minat || '—'"/>
                    <SummaryItem k="Tahfidz" :v="form.program.tahfidz ? 'Ya' : 'Tidak'"/>
                    <SummaryItem k="Asrama" :v="form.program.asrama ? 'Ya' : 'Tidak'"/>
                    <SummaryItem k="Wali (HP)" :v="`${form.ortu.ayahNama || form.ortu.waliNama || '-'} (${form.akun.phone})`"/>
                    <SummaryItem k="Email Wali" :v="form.akun.email"/>
                  </div>
                  <p class="mt-3 text-[12px] text-gray-500 dark:text-neutral-400">Periksa kembali data Anda sebelum mengirim.</p>
                </div>

                <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-4 bg-emerald-50/60 dark:bg-neutral-800/40">
                  <p class="text-sm text-emerald-800 dark:text-emerald-300">
                    Setelah terkirim, Anda akan mendapatkan <b>Nomor Pendaftaran</b> dan dapat mencetak <b>Bukti Pendaftaran</b>.
                  </p>
                </div>
              </div>

              <!-- ACTIONS -->
              <div class="mt-6 flex items-center justify-between">
                <button :disabled="step===0 || loading" @click="prev"
                        class="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 px-4 py-2.5 text-sm font-medium hover:bg-white dark:hover:bg-neutral-800 disabled:opacity-60">
                  <ClientOnly><Icon icon="ph:arrow-left" class="size-4" /></ClientOnly>
                  Kembali
                </button>

                <div class="flex items-center gap-2">
                  <p class="text-[12px] text-gray-500 dark:text-neutral-400">Draf tersimpan otomatis.</p>
                  <button v-if="step<steps.length-1" :disabled="!canNext || loading" @click="next"
                          class="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60">
                    Lanjut
                    <ClientOnly><Icon icon="ph:arrow-right" class="size-4" /></ClientOnly>
                  </button>
                  <button v-else :disabled="!canSubmit || loading" @click="submit"
                          class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60">
                    <ClientOnly><Icon :icon="loading?'ph:loader':'ph:paper-plane-tilt'" class="size-4" :class="loading?'animate-spin':''" /></ClientOnly>
                    Kirim Pendaftaran
                  </button>
                </div>
              </div>

              <p v-if="feedback" class="mt-3 text-[12px]" :class="ok ? 'text-emerald-600' : 'text-red-600'">{{ feedback }}</p>
            </div>
          </div>
        </section>

        <aside class="lg:col-span-4">
          <div class="space-y-4">
            <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 backdrop-blur p-5 shadow">
              <div class="flex items-center gap-2">
                <ClientOnly><Icon icon="ph:list-checks" class="size-5 text-blue-600" /></ClientOnly>
                <h3 class="font-semibold text-gray-900 dark:text-white">Syarat Umum</h3>
              </div>
              <ul class="mt-3 text-sm space-y-2">
                <li class="flex items-start gap-2"><span class="dot" /> Muslim/Muslimah & lulusan SD/MI/SMP/MTs.</li>
                <li class="flex items-start gap-2"><span class="dot" /> Mengisi formulir & unggah dokumen (KK, Akte, Raport, Foto).</li>
                <li class="flex items-start gap-2"><span class="dot" /> Mengikuti tes seleksi (wawancara/akademik).</li>
              </ul>
            </div>

            <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 backdrop-blur p-5 shadow">
              <div class="flex items-center gap-2">
                <ClientOnly><Icon icon="ph:calendar-check" class="size-5 text-emerald-600" /></ClientOnly>
                <h3 class="font-semibold text-gray-900 dark:text-white">Timeline</h3>
              </div>
              <ul class="mt-3 text-sm space-y-2">
                <li class="flex items-start gap-2"><span class="dot" /> Pendaftaran: 1 Jan — 30 Mar 2025</li>
                <li class="flex items-start gap-2"><span class="dot" /> Tes Seleksi: 5—15 Apr 2025</li>
                <li class="flex items-start gap-2"><span class="dot" /> Pengumuman: 25 Apr 2025</li>
              </ul>
            </div>

            <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 backdrop-blur p-5 shadow">
              <div class="flex items-center gap-2">
                <ClientOnly><Icon icon="ph:headset" class="size-5 text-blue-600" /></ClientOnly>
                <h3 class="font-semibold text-gray-900 dark:text-white">Kontak Panitia</h3>
              </div>
              <ul class="mt-3 text-sm space-y-2">
                <li class="flex items-center gap-2">
                  <ClientOnly><Icon icon="ph:whatsapp-logo" class="size-4 text-emerald-600" /></ClientOnly>
                  <a href="https://wa.me/6281234567890" target="_blank" class="hover:underline">+62 812-3456-7890</a>
                </li>
                <li class="flex items-center gap-2">
                  <ClientOnly><Icon icon="ph:envelope-simple" class="size-4 text-blue-600" /></ClientOnly>
                  <a href="mailto:ppdb@alberr.sch.id" class="hover:underline">ppdb@alberr.sch.id</a>
                </li>
              </ul>
              <div class="mt-4 rounded-lg border border-dashed border-gray-300 dark:border-neutral-700 p-3 text-[12px] text-gray-500 dark:text-neutral-400">
                Data tersimpan <b>lokal</b> di perangkat Anda hingga dikirim.
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, defineComponent, h } from 'vue'
import { Icon } from '@iconify/vue'

/* ========= Steps & master data ========= */
const steps = [
  { key:'siswa',   label:'Siswa',       icon:'ph:user' },
  { key:'ortu',    label:'Orang Tua',   icon:'ph:users-three' },
  { key:'alamat',  label:'Alamat',      icon:'ph:map-pin' },
  { key:'program', label:'Program',     icon:'ph:books' },
  { key:'dok',     label:'Dokumen',     icon:'ph:cloud-arrow-up' },
  { key:'akun',    label:'Akun',        icon:'ph:lock' },
  { key:'ok',      label:'Konfirmasi',  icon:'ph:check-circle' }
] as const

const provinsi  = ['Jawa Timur','Jawa Tengah','Jawa Barat','DKI Jakarta','DIY']
const kabupaten = ['Pasuruan','Sidoarjo','Malang','Surabaya','Mojokerto']

/* ========= State ========= */
const step = ref(0)
const progress = computed(() => Math.round(((step.value+1) / steps.length) * 100))

const form = reactive({
  siswa:   { nama:'', nisn:'', nik:'', tmpLahir:'', tglLahir:'', jk:'', agama:'Islam' },
  sekolah: { asal:'', npsn:'' },
  ortu:    { ayahNama:'', ayahHP:'', ibuNama:'', ibuHP:'', waliNama:'', waliHP:'', pekerjaan:'' },
  alamat:  { prov:'', kab:'', kec:'', kel:'', kodepos:'', detail:'' },
  program: { jenjang:'', minat:'', tahfidz:false, asrama:true },
  pernyataan: { keaslian:false, kebenaran:false },
  akun:    { email:'', phone:'', password:'', confirm:'' }
})

type FileBox = { file: File|null, url: string|null }
const files = reactive<Record<'kk'|'akte'|'raport'|'foto', FileBox>>({
  kk:{file:null,url:null}, akte:{file:null,url:null}, raport:{file:null,url:null}, foto:{file:null,url:null}
})

/* ========= Validation ========= */
const passMismatch = computed(() => form.akun.password && form.akun.confirm && form.akun.password !== form.akun.confirm)

function validStep(i: number) {
  switch (i) {
    case 0: return !!(form.siswa.nama && form.siswa.tmpLahir && form.siswa.tglLahir && form.siswa.jk)
    case 1: return !!(form.ortu.ayahNama && form.ortu.ayahHP && form.ortu.ibuNama && form.ortu.ibuHP)
    case 2: return !!(form.alamat.prov && form.alamat.kab && form.alamat.kec && form.alamat.kel && form.alamat.detail)
    case 3: return !!(form.program.jenjang)
    case 4: return !!(files.kk.file && files.akte.file && files.raport.file && files.foto.file && form.pernyataan.keaslian)
    case 5: return !!(form.akun.email && form.akun.phone && form.akun.password && !passMismatch.value && form.pernyataan.kebenaran)
    case 6: return true
    default: return false
  }
}
const canNext   = computed(() => validStep(step.value))
const canSubmit = computed(() => validStep(5))

function next(){ if (canNext.value && step.value < steps.length-1) step.value++ }
function prev(){ if (step.value > 0) step.value-- }
function go(i:number){ if (i<=step.value || validStep(step.value)) step.value = i }

// pages/ppdb.vue  (di dalam <script setup>)
const route = useRoute()
const config = useRuntimeConfig()
const url = computed(() => new URL(route.fullPath || '/ppdb', config.public.siteUrl).toString())

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
        location: {
          '@type': 'VirtualLocation',
          url: url.value
        },
        image: [`${config.public.siteUrl}/assets/logo.png`]
      })
    }
  ]
})


/* ========= Local draft ========= */
const DRAFT_KEY = 'ppdb_draft_v1'
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

/* ========= Submit (mock) ========= */
const loading = ref(false)
const feedback = ref('')
const ok = ref(false)
async function submit(){
  if (!canSubmit.value) return
  loading.value = true
  feedback.value = ''
  ok.value = false
  // TODO: panggil endpoint backend untuk menyimpan pendaftaran
  await new Promise(r => setTimeout(r, 1200))
  loading.value = false
  ok.value = true
  feedback.value = 'Pendaftaran terkirim. Nomor pendaftaran telah dikirim ke email/WA Anda.'
}

/* ========= Reusable components (render func) ========= */
const TextField = defineComponent({
  name:'TextField',
  props:{ modelValue:String, label:String, required:Boolean, placeholder:String },
  emits:['update:modelValue'],
  setup(props,{emit}){
    return () => h('label',{class:'block'},[
      h('span',{class:'text-xs text-gray-600 dark:text-neutral-300'},[
        props.label, props.required ? h('span',{class:'text-red-600'},'*') : null
      ]),
      h('input',{
        class:'py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 border',
        value:props.modelValue,
        placeholder:props.placeholder||'',
        onInput:(e:any)=>emit('update:modelValue', e.target.value),
        required:props.required
      })
    ])
  }
})

const UploadField = defineComponent({
  name:'UploadField',
  props:{
    modelValue:{type:Object,required:true},
    label:{type:String,required:true},
    hint:{type:String,default:''},
    accept:{type:Array as ()=>string[], default:()=>['*/*']}
  },
  emits:['update:modelValue'],
  setup(props,{emit}){
    const onChange = (e:any)=>{
      const f = e.target.files?.[0] || null
      emit('update:modelValue', { file:f, url: f?URL.createObjectURL(f):null })
    }
    const onDrop = (e:DragEvent)=>{
      const f = e.dataTransfer?.files?.[0] || null
      emit('update:modelValue', { file:f, url: f?URL.createObjectURL(f):null })
    }
    return ()=> h('div',{class:'space-y-1.5'},[
      h('span',{class:'text-xs text-gray-600 dark:text-neutral-300'}, props.label),
      h('div',{
        class:'relative rounded-xl border border-dashed border-gray-300 dark:border-neutral-700 p-4 bg-white/70 dark:bg-neutral-900/60 text-sm flex items-center justify-between gap-3',
        onDragover:(e:DragEvent)=>e.preventDefault(),
        onDrop
      },[
        h('div',{class:'flex items-center gap-3'},[
          h('div',{class:'shrink-0 rounded-md bg-gray-100 dark:bg-neutral-800 p-2'},[
            h('span',{class:'inline-block size-5 text-gray-600 dark:text-neutral-300'}, '📎')
          ]),
          (props.modelValue as any)?.file
            ? h('div',[
                h('p',{class:'font-medium text-gray-900 dark:text-white'}, (props.modelValue as any).file.name),
                h('p',{class:'text-[12px] text-gray-500 dark:text-neutral-400'}, `${Math.round(((props.modelValue as any).file.size||0)/1024)} KB`)
              ])
            : h('div',[
                h('p',{class:'text-gray-700 dark:text-neutral-200'},'Tarik & lepas file ke sini'),
                h('p',{class:'text-[12px] text-gray-500 dark:text-neutral-400'}, props.hint)
              ])
        ]),
        h('div',[
          h('label',{class:'inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 px-3 py-2 text-sm font-medium hover:bg-white dark:hover:bg-neutral-800'},[
            h('input',{type:'file', class:'hidden', accept:props.accept.join(','), onChange}),
            'Pilih File'
          ])
        ])
      ]),
      (props.modelValue as any)?.url
        ? h('div',{class:'mt-2'},[
            h('img',{src:(props.modelValue as any).url, class:'max-h-28 rounded-lg border border-gray-200 dark:border-neutral-700', onError:(e:any)=> (e.target.style.display='none')})
          ])
        : null
    ])
  }
})

const SummaryItem = defineComponent({
  name:'SummaryItem',
  props:{ k:String, v:String },
  setup(props){
    return ()=> h('div',{class:'flex justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-1'},[
      h('dt',{class:'text-gray-600 dark:text-neutral-300'}, props.k),
      h('dd',{class:'font-medium text-gray-900 dark:text-white text-right truncate'}, props.v || '—')
    ])
  }
})
</script>

<style scoped lang="postcss">
.inp {
  @apply w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 
  px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 
  focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition;
}
.chk {
  @apply rounded border-gray-300 dark:border-neutral-700;
}
.icbtn {
  @apply absolute right-2 bottom-2.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-800;
}
.dot {
  @apply inline-block size-1.5 rounded-full bg-gray-400 mt-2;
}
</style>
