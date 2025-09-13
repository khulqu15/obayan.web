<!-- pages/app/teacher.vue -->
<template>
  <section class="p-4 text-gray-800 dark:text-neutral-200">
    <!-- HEADER -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div class="flex items-center gap-2">
        <h1 class="text-xl font-semibold">Guru & Tenaga Pendidik</h1>
        <span class="text-sm text-gray-500 dark:text-neutral-400">({{ filtered.length }})</span>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <div class="relative">
          <Icon icon="lucide:search" class="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            v-model="q"
            type="search"
            placeholder="Cari nama/NIP/NUPTK/mapel…"
            class="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-100 bg-white dark:bg-neutral-800 dark:border-neutral-700 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <select v-model="fJenjang" class="px-3 py-2 text-sm rounded-lg border border-gray-100 bg-white dark:bg-neutral-800 dark:border-neutral-700">
          <option value="all">Semua Jenjang</option>
          <option v-for="j in JENJANGS" :key="j" :value="j">{{ j }}</option>
        </select>

        <select v-model="fStatus" class="px-3 py-2 text-sm rounded-lg border border-gray-100 bg-white dark:bg-neutral-800 dark:border-neutral-700">
          <option value="all">Semua Status</option>
          <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
        </select>

        <select v-model="fMapel" class="px-3 py-2 text-sm rounded-lg border border-gray-100 bg-white dark:bg-neutral-800 dark:border-neutral-700">
          <option value="all">Semua Mapel</option>
          <option v-for="m in SUBJECTS_ID" :key="m" :value="m">{{ m }}</option>
        </select>

        <select v-model="fAktif" class="px-3 py-2 text-sm rounded-lg border border-gray-100 bg-white dark:bg-neutral-800 dark:border-neutral-700">
          <option value="all">Semua</option>
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>

        <button @click="openCreate" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">
          <Icon icon="lucide:plus" class="size-4" /> Tambah Guru
        </button>
      </div>
    </div>

    <!-- GRID LIST -->
    <div class="mt-4 grid grid-cols-1 gap-3">
      <div
        v-for="t in filtered"
        :key="t.id"
        class="rounded-2xl border border-gray-100 bg-white shadow-xs dark:bg-neutral-800 dark:border-neutral-700 overflow-hidden"
      >
        <div class="flex">
          <div class="relative w-28 shrink-0">
            <img v-if="t.photoUrl" :src="t.photoUrl" class="w-full h-full object-cover aspect-[3/4]" />
            <div v-else class="w-full h-full aspect-[3/4] flex items-center justify-center bg-gray-100 dark:bg-neutral-700">
              <Icon :icon="t.gender==='P' ? 'lucide:user-round' : 'lucide:user-round'" class="size-8 text-gray-400" />
            </div>
            <div class="absolute bottom-1 left-1">
              <span
                class="text-[10px] px-1.5 py-0.5 rounded-md"
                :class="t.aktif !== false ? 'bg-emerald-100 700 dark:bg-emerald-900/30 dark:300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'"
              >
                {{ t.aktif !== false ? 'Aktif' : 'Nonaktif' }}
              </span>
            </div>
          </div>

          <div class="p-3 w-full">
            <div class="flex items-start justify-between gap-2 w-full">
              <div class="min-w-0">
                <h3 class="font-semibold truncate">{{ t.nama }}</h3>
                <p class="text-xs text-gray-500 dark:text-neutral-400 truncate">
                  {{ t.jenjang }} · {{ t.mapelUtama || '—' }}
                  <span v-if="t.mapelLain?.length"> · Multi: {{ t.mapelLain.join(', ') }}</span>
                </p>
                <p class="text-[11px] text-gray-400 dark:text-neutral-500 truncate mt-0.5">
                  <span v-if="t.jabatan?.length">Jabatan: {{ t.jabatan.join(', ') }}</span>
                </p>
              </div>
              <div class="flex items-center gap-1.5">
                <button class="px-2 py-1.5 text-xs rounded-md border border-gray-200 dark:border-neutral-700" @click="openEdit(t)">
                  Edit
                </button>
                <button class="px-2 py-1.5 text-xs rounded-md border border-gray-200 dark:border-neutral-700 text-rose-600" @click="confirmDelete(t)">
                  Hapus
                </button>
              </div>
            </div>

            <!-- meta -->
            <div class="mt-2 grid grid-cols-2 gap-2 text-[11px] text-gray-600 dark:text-neutral-300">
              <div class="truncate"><span class="text-gray-400">NIP:</span> {{ t.nip || '—' }}</div>
              <div class="truncate"><span class="text-gray-400">NUPTK:</span> {{ t.nuptk || '—' }}</div>
              <div class="truncate"><span class="text-gray-400">Kepegawaian:</span> {{ t.statusKepegawaian }}</div>
              <div class="truncate"><span class="text-gray-400">Kontak:</span> {{ t.phone || t.email || '—' }}</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!filtered.length" class="col-span-full p-6 text-sm text-gray-500 border-gray-200 dark:text-neutral-400 border rounded-xl dark:border-neutral-700">
        Data guru belum ada / tidak ditemukan.
      </div>
    </div>

    <!-- MODAL CREATE/EDIT -->
    <teleport to="body">
      <div v-if="modal.open" class="fixed inset-0 z-[90]">
        <div class="absolute inset-0 bg-black/40" @click="closeModal"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-3xl rounded-2xl border border-gray-100 bg-white shadow-xl dark:bg-neutral-800 dark:border-neutral-700">
            <div class="p-4 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
              <h3 class="font-semibold">{{ modal.mode === 'create' ? 'Tambah Guru' : 'Edit Guru' }}</h3>
              <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700" @click="closeModal">
                <Icon icon="lucide:x" class="size-4" />
              </button>
            </div>

            <form class="p-4 space-y-4 max-h-[80vh] overflow-y-auto scrollbar-none" @submit.prevent="save">
              <!-- Foto & Identitas ringkas -->
              <div class="grid sm:grid-cols-[auto,1fr] gap-3">
                <!-- Foto -->
                <div class="sm:row-span-2">
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Foto (thumbnail)</label>
                  <div class="mt-2 flex items-start gap-3">
                    <div class="relative w-28 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900">
                      <div class="w-full aspect-[3/4]">
                        <img
                          v-if="form.photoPreview"
                          :src="form.photoPreview"
                          class="w-full h-full object-cover"
                          alt="Preview foto baru"
                        />
                        <img
                          v-else-if="modal.mode==='edit' && form.initialPhotoUrl && !form.removePhoto"
                          :src="form.initialPhotoUrl"
                          class="w-full h-full object-cover"
                          alt="Foto saat ini"
                        />
                        <div v-else class="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          Tidak ada foto
                        </div>
                      </div>
                      <span
                        v-if="modal.mode==='edit' && (form.photoPreview || form.initialPhotoUrl)"
                        class="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded"
                      >{{ form.photoPreview ? 'Baru' : 'Saat ini' }}</span>
                    </div>

                    <div class="flex-1 flex flex-col gap-2">
                      <label class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 cursor-pointer w-fit">
                        <Icon icon="lucide:upload" class="size-4" />
                        <span class="text-sm">Pilih Foto</span>
                        <input type="file" accept="image/*" class="hidden" @change="onPhotoInput" />
                      </label>

                      <div class="flex items-center gap-2">
                        <button
                          v-if="form.photoPreview"
                          type="button"
                          class="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-700 text-rose-600"
                          @click="clearNewPhoto"
                        >
                          <Icon icon="lucide:trash-2" class="inline size-4 mr-1 -mt-0.5" /> Batalkan Foto
                        </button>

                        <button
                          v-if="modal.mode==='edit' && !form.photoPreview && form.initialPhotoUrl"
                          type="button"
                          class="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-700"
                          :class="form.removePhoto ? 'text-rose-600 border-rose-200/40' : ''"
                          @click="toggleRemoveExistingPhoto"
                        >
                          <Icon :icon="form.removePhoto ? 'lucide:check-circle-2' : 'lucide:trash-2'" class="inline size-4 mr-1 -mt-0.5" />
                          {{ form.removePhoto ? 'Akan dihapus' : 'Hapus Foto' }}
                        </button>
                      </div>

                      <p class="text-[11px] text-gray-500 dark:text-neutral-400">
                        Rasio disarankan 3:4. Foto akan diunggah saat menyimpan.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Identitas ringkas -->
                <div>
                  <div class="grid sm:grid-cols-2 gap-2">
                    <div>
                      <label class="text-xs text-gray-500 dark:text-neutral-400">Nama Lengkap</label>
                      <input v-model.trim="form.nama" type="text" required class="mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                    </div>
                    <div>
                      <label class="text-xs text-gray-500 dark:text-neutral-400">Jenis Kelamin</label>
                      <select v-model="form.gender" class="mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm">
                        <option :value="null">-</option>
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <div class="grid sm:grid-cols-2 gap-2">
                    <div>
                      <label class="text-xs text-gray-500 dark:text-neutral-400">Jenjang</label>
                      <select v-model="form.jenjang" required class="mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm">
                        <option v-for="j in JENJANGS" :key="j" :value="j">{{ j }}</option>
                      </select>
                    </div>
                    <div>
                      <label class="text-xs text-gray-500 dark:text-neutral-400">Mapel Utama</label>
                      <select v-model="form.mapelUtama" class="mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm">
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
                  <label class="text-xs text-gray-500 dark:text-neutral-400">NIP</label>
                  <input v-model.trim="form.nip" type="text" class="mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">NUPTK</label>
                  <input v-model.trim="form.nuptk" type="text" class="mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">NIK</label>
                  <input v-model.trim="form.nik" type="text" class="mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm" />
                </div>

                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Tempat Lahir</label>
                  <input v-model.trim="form.tempatLahir" type="text" class="mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Tanggal Lahir</label>
                  <input v-model="form.tanggalLahirStr" type="date" class="mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Agama</label>
                  <select v-model="form.agama" class="mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm">
                    <option :value="null">-</option>
                    <option v-for="a in AGAMAS" :key="a" :value="a">{{ a }}</option>
                  </select>
                </div>

                <div class="md:col-span-3">
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Alamat</label>
                  <input v-model.trim="form.alamat" type="text" class="mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm" />
                </div>

                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">No. HP</label>
                  <input v-model.trim="form.phone" type="tel" class="mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Email</label>
                  <input v-model.trim="form.email" type="email" class="mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Status Kepegawaian</label>
                  <select v-model="form.statusKepegawaian" class="mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm">
                    <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
                  </select>
                </div>

                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Tanggal Mulai</label>
                  <input v-model="form.tglMulaiStr" type="date" class="mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Tanggal Selesai</label>
                  <input v-model="form.tglSelesaiStr" type="date" class="mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm" />
                </div>
                <div class="flex items-end">
                  <label class="inline-flex items-center gap-2">
                    <input type="checkbox" v-model="form.aktif" class="rounded border-gray-300 600 focus:ring-blue-500" />
                    Aktif
                  </label>
                </div>
              </div>

              <!-- Kompetensi & jabatan -->
              <div class="grid md:grid-cols-3 gap-3">
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Pendidikan Terakhir</label>
                  <select v-model="form.pendidikanTerakhir" class="mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm">
                    <option value="D3">D3</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Jurusan</label>
                  <input v-model.trim="form.jurusan" type="text" class="mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Institusi</label>
                  <input v-model.trim="form.institusi" type="text" class="mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Tahun Lulus</label>
                  <input v-model.trim="form.tahunLulus" type="text" class="mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Sertifikat Pendidik</label>
                  <input v-model.trim="form.sertifikatPendidik" type="text" placeholder="No. sertifikat (jika ada)" class="mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">PPG Tahun</label>
                  <input v-model.trim="form.ppgTahun" type="text" class="mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Golongan</label>
                  <input v-model.trim="form.golongan" type="text" placeholder="Contoh: III/a" class="mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Pangkat</label>
                  <input v-model.trim="form.pangkat" type="text" placeholder="Contoh: Penata Muda" class="mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm" />
                </div>
                <div class="md:col-span-3">
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Jabatan</label>
                  <div class="mt-2 grid sm:grid-cols-3 gap-2">
                    <label v-for="j in JABATANS" :key="j" class="inline-flex items-center gap-2 text-sm">
                      <input type="checkbox" :value="j" v-model="form.jabatan" class="rounded border-gray-300 600 focus:ring-blue-500" />
                      {{ j }}
                    </label>
                  </div>
                </div>
                <div class="md:col-span-3">
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Mapel Lain (opsional)</label>
                  <div class="mt-2 grid sm:grid-cols-3 gap-2">
                    <label v-for="m in SUBJECTS_ID" :key="m" class="inline-flex items-center gap-2 text-sm">
                      <input type="checkbox" :value="m" v-model="form.mapelLain" class="rounded border-gray-300 600 focus:ring-blue-500" />
                      {{ m }}
                    </label>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-end pt-1">
                <button type="submit" class="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                  <Icon v-if="saving" icon="ph:spinner" class="size-4 animate-spin" />
                  <span>{{ saving ? 'Menyimpan…' : (modal.mode==='create' ? 'Simpan' : 'Update') }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </teleport>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useTeacher, SUBJECTS_ID, JENJANGS, STATUSES, JABATANS, type TeacherItem, type Jenjang, type StatusKepegawaian } from '~/composables/data/useTeacher'

definePageMeta({ layout: 'app', layoutProps: { title: 'Guru' } })

const AGAMAS = ['Islam','Kristen','Katolik','Hindu','Buddha','Konghucu','Lainnya'] as const

/** ===== useTeacher (list & CRUD) ===== */
const {
  filtered, q, fJenjang, fStatus, fMapel, fAktif,
  subscribeAll, unbindList,
  createTeacher, updateTeacher, deleteTeacher
} = useTeacher()

/** ===== Modal & Form State ===== */
type FormState = {
  // identitas
  nama: string
  gender: 'L' | 'P' | null
  agama: typeof AGAMAS[number] | null
  tempatLahir: string
  tanggalLahirStr: string // bind input date, convert -> number
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

  // foto
  photoFile: File | null
  photoPreview: string | null
  initialPhotoUrl: string | null
  removePhoto: boolean
}

const modal = reactive<{ open:boolean; mode:'create'|'edit'; id?:string }>(
  { open:false, mode:'create', id: undefined }
)

const form = reactive<FormState>({
  nama:'', gender:null, agama:null, tempatLahir:'', tanggalLahirStr:'', alamat:'', phone:'', email:'',
  nip:'', nuptk:'', nik:'',
  jenjang:'SD', mapelUtama:'', mapelLain:[], jabatan:['Guru'],
  pendidikanTerakhir:'S1', jurusan:'', institusi:'', tahunLulus:'', sertifikatPendidik:'', ppgTahun:'', golongan:'', pangkat:'',
  statusKepegawaian:'Honorer', tglMulaiStr:'', tglSelesaiStr:'', aktif:true,
  photoFile:null, photoPreview:null, initialPhotoUrl:null, removePhoto:false
})

function resetForm() {
  form.nama=''; form.gender=null; form.agama=null; form.tempatLahir=''; form.tanggalLahirStr=''; form.alamat=''; form.phone=''; form.email=''
  form.nip=''; form.nuptk=''; form.nik=''
  form.jenjang='SD'; form.mapelUtama=''; form.mapelLain=[]; form.jabatan=['Guru']
  form.pendidikanTerakhir='S1'; form.jurusan=''; form.institusi=''; form.tahunLulus=''; form.sertifikatPendidik=''; form.ppgTahun=''; form.golongan=''; form.pangkat=''
  form.statusKepegawaian='Honorer'; form.tglMulaiStr=''; form.tglSelesaiStr=''; form.aktif=true
  if (form.photoPreview) URL.revokeObjectURL(form.photoPreview)
  form.photoFile=null; form.photoPreview=null; form.initialPhotoUrl=null; form.removePhoto=false
}

function openCreate() {
  resetForm()
  modal.mode='create'; modal.open=true; modal.id=undefined
}

function openEdit(t: TeacherItem) {
  resetForm()
  modal.mode='edit'; modal.open=true; modal.id=t.id
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
  form.initialPhotoUrl=t.photoUrl || null; form.removePhoto=false
}

function closeModal(){
  if (form.photoPreview) URL.revokeObjectURL(form.photoPreview)
  modal.open=false
}

// Foto handlers
function onPhotoInput(ev: Event) {
  const file = (ev.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (form.photoPreview) URL.revokeObjectURL(form.photoPreview)
  form.photoFile = file
  form.photoPreview = URL.createObjectURL(file)
  form.removePhoto = false
}
function clearNewPhoto() {
  if (form.photoPreview) URL.revokeObjectURL(form.photoPreview)
  form.photoFile = null
  form.photoPreview = null
}
function toggleRemoveExistingPhoto() {
  form.removePhoto = !form.removePhoto
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

        photoFile: form.photoFile || undefined
      })
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

        photoFile: form.photoFile || undefined,
        removePhoto: form.removePhoto
      })
    }
    closeModal()
  } finally {
    saving.value = false
  }
}

function confirmDelete(t: TeacherItem) {
  if (confirm(`Hapus data guru "${t.nama}"?`)) {
    deleteTeacher(t.id)
  }
}

/** ===== Lifecycle ===== */
onMounted(() => { subscribeAll() })
onUnmounted(() => { unbindList() })
</script>

<style scoped>
.shadow-xs { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
</style>
