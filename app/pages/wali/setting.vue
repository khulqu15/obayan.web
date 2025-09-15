<!-- /pages/wali/setting.vue -->
<template>
  <section class="p-6 space-y-6 text-gray-900 dark:text-neutral-100">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold">Pengaturan Akun Wali</h1>
        <p class="text-sm text-gray-500 dark:text-neutral-400">Kelola profil, preferensi notifikasi, dan keamanan.</p>
      </div>
      <NuxtLink to="/wali" class="inline-flex items-center gap-x-2 rounded-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm font-semibold py-3 px-4 hover:shadow-md transition">
        <Icon icon="lucide:arrow-left" class="size-5" />
        <span>Kembali</span>
      </NuxtLink>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Kiri: Profil -->
      <section class="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-md transition xl:col-span-2">
        <header class="px-6 py-4 border-b border-gray-200 dark:border-neutral-800">
          <h2 class="font-semibold flex items-center gap-2">
            <Icon icon="lucide:user-cog" class="size-5 text-[#58CC02]" /> Profil Akun
          </h2>
        </header>

        <div class="p-6 space-y-6">
          <!-- Avatar -->
          <div class="flex flex-wrap items-center gap-4">
            <img
              :src="avatarPreview || fallbackAvatar"
              alt="Avatar"
              class="size-20 rounded-2xl object-cover ring-4 ring-[#58CC02]/15"
            />
            <div class="flex flex-wrap gap-3">
              <label class="inline-flex items-center gap-x-2 rounded-full bg-[#E7F7D4] text-[#2D7A00] border border-[#CBEEA6] py-3 px-4 text-sm font-semibold hover:bg-[#DBF3BF] cursor-pointer transition">
                <Icon icon="lucide:image" class="size-5" />
                <span>Ganti Foto</span>
                <input type="file" accept="image/*" @change="onPickAvatar" class="hidden" />
              </label>
              <button type="button" class="inline-flex items-center gap-x-2 rounded-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-3 px-4 text-sm font-semibold hover:shadow-md transition" @click="resetAvatar">
                <Icon icon="lucide:rotate-ccw" class="size-5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
          <p class="text-xs text-gray-500 dark:text-neutral-400 -mt-2">Format JPG/PNG, maks ±2 MB. (Pratinjau lokal)</p>

          <!-- Form -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="block">
              <span class="text-sm text-gray-700 dark:text-neutral-300">Nama Wali</span>
              <input v-model.trim="form.displayName" type="text"
                     class="mt-1 py-3 px-4 block w-full border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm rounded-lg focus:border-emerald-500 focus:ring-emerald-500" placeholder="Nama lengkap" />
            </label>

            <label class="block">
              <span class="text-sm text-gray-700 dark:text-neutral-300">Email</span>
              <input :value="form.email" type="email"
                     class="mt-1 py-3 px-4 block w-full border-gray-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 text-sm rounded-lg focus:border-emerald-500 focus:ring-emerald-500 opacity-80" disabled />
              <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">Ubah email memerlukan verifikasi ulang. Hubungi admin bila diperlukan.</p>
            </label>

            <label class="block">
              <span class="text-sm text-gray-700 dark:text-neutral-300">No. HP / WhatsApp</span>
              <input v-model.trim="form.phone" type="tel"
                     class="mt-1 py-3 px-4 block w-full border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm rounded-lg focus:border-emerald-500 focus:ring-emerald-500" placeholder="Contoh: 08xxxxxxxxxx" />
            </label>

            <label class="block">
              <span class="text-sm text-gray-700 dark:text-neutral-300">Alamat (opsional)</span>
              <input v-model.trim="form.address" type="text"
                     class="mt-1 py-3 px-4 block w-full border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm rounded-lg focus:border-emerald-500 focus:ring-emerald-500" placeholder="Alamat domisili" />
            </label>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button :disabled="saving"
                    class="inline-flex items-center gap-x-2 rounded-full text-white py-3 px-5 text-sm font-semibold shadow-md disabled:opacity-70 transition"
                    :class="saving ? 'bg-[#58CC02]/70' : 'bg-[#58CC02] hover:bg-[#4CB302]'"
                    @click="saveProfile">
              <Icon v-if="!saving" icon="lucide:check-circle" class="size-5" />
              <Icon v-else icon="svg-spinners:3-dots-scale" class="size-5" />
              <span>Simpan Profil</span>
            </button>

            <button type="button" @click="openWhatsAppVerify"
                    class="inline-flex items-center gap-x-2 rounded-full border-2 border-[#58CC02] text-[#2D7A00] bg-white dark:bg-neutral-900 py-3 px-5 text-sm font-semibold hover:bg-[#E7F7D4] transition">
              <Icon icon="ri:whatsapp-line" class="size-5" />
              <span>Verifikasi WA</span>
            </button>

            <span v-if="lastSavedAt" class="text-xs text-gray-500 dark:text-neutral-400">Tersimpan {{ timeAgo(lastSavedAt) }}</span>
          </div>
        </div>
      </section>

      <!-- Kanan: Keamanan -->
      <section class="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-md transition">
        <header class="px-6 py-4 border-b border-gray-200 dark:border-neutral-800">
          <h2 class="font-semibold flex items-center gap-2">
            <Icon icon="lucide:shield-check" class="size-5 text-[#58CC02]" /> Keamanan
          </h2>
        </header>

        <div class="p-6 space-y-5">
          <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-4">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="font-medium">Reset Kata Sandi</p>
                <p class="text-xs text-gray-500 dark:text-neutral-400">Kirim tautan reset ke email terdaftar.</p>
              </div>
              <button :disabled="sendingReset"
                      class="inline-flex items-center gap-x-2 rounded-full bg-[#E7F7D4] text-[#2D7A00] border border-[#CBEEA6] py-3 px-4 text-sm font-semibold hover:bg-[#DBF3BF] transition"
                      @click="sendPasswordLink">
                <Icon v-if="!sendingReset" icon="lucide:mail" class="size-5" />
                <Icon v-else icon="svg-spinners:3-dots-fade" class="size-5" />
                <span>Kirim Tautan</span>
              </button>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-4">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="font-medium">Autentikasi 2 Langkah (2FA)</p>
                <p class="text-xs text-gray-500 dark:text-neutral-400">Tambah lapisan keamanan via OTP (rencana).</p>
              </div>

              <!-- Switch -->
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" :checked="twoFA" @change="toggle2FA" />
                <span class="w-14 h-7 bg-gray-200 dark:bg-neutral-700 rounded-full peer-checked:bg-[#58CC02] transition-colors border-2 border-transparent flex items-center">
                  <span class="size-6 bg-white rounded-full shadow -ml-[22px] translate-x-2 peer-checked:translate-x-8 transition-transform"></span>
                </span>
              </label>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-4">
            <p class="text-xs text-gray-500 dark:text-neutral-400 mb-1">User ID</p>
            <div class="flex items-center justify-between gap-3">
              <code class="text-sm break-all">{{ uid || '-' }}</code>
              <button class="inline-flex items-center gap-x-2 rounded-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-3 px-4 text-sm font-semibold hover:shadow-md transition" @click="copy(uid || '')">
                <Icon icon="lucide:copy" class="size-5" /> <span>Salin</span>
              </button>
            </div>
          </div>

          <div class="rounded-2xl border border-rose-200 dark:border-rose-900/40 p-4 bg-rose-50/40 dark:bg-rose-900/10">
            <p class="font-semibold text-rose-700 dark:text-rose-300">Zona Bahaya</p>
            <div class="mt-3 flex flex-wrap items-center gap-3">
              <button @click="confirmDelete = true" class="inline-flex items-center gap-x-2 rounded-full border-2 border-rose-500 text-rose-600 bg-white dark:bg-neutral-900 py-3 px-4 text-sm font-semibold hover:bg-rose-50 dark:hover:bg-rose-900/10 transition">
                <Icon icon="lucide:trash-2" class="size-5" /> <span>Hapus Akun</span>
              </button>
            </div>
            <p class="mt-2 text-xs text-rose-700/80 dark:text-rose-300/80">Penghapusan akun akan menghilangkan akses wali. Hubungi admin untuk pemulihan data.</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Preferensi Notifikasi -->
    <section class="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-md transition">
      <header class="px-6 py-4 border-b border-gray-200 dark:border-neutral-800">
        <h2 class="font-semibold flex items-center gap-2">
          <Icon icon="lucide:bell" class="size-5 text-[#58CC02]" /> Preferensi Notifikasi
        </h2>
      </header>

      <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-4 flex items-center justify-between gap-4">
          <div>
            <p class="font-medium">WhatsApp</p>
            <p class="text-xs text-gray-500 dark:text-neutral-400">Pengingat tagihan & pengumuman via WA.</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" v-model="prefs.whatsapp" />
            <span class="w-14 h-7 bg-gray-200 dark:bg-neutral-700 rounded-full peer-checked:bg-[#58CC02] transition-colors border-2 border-transparent flex items-center">
              <span class="size-6 bg-white rounded-full shadow -ml-[22px] translate-x-2 peer-checked:translate-x-8 transition-transform"></span>
            </span>
          </label>
        </div>

        <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-4 flex items-center justify-between gap-4">
          <div>
            <p class="font-medium">Email</p>
            <p class="text-xs text-gray-500 dark:text-neutral-400">Rekap bulanan ke email.</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" v-model="prefs.email" />
            <span class="w-14 h-7 bg-gray-200 dark:bg-neutral-700 rounded-full peer-checked:bg-[#58CC02] transition-colors border-2 border-transparent flex items-center">
              <span class="size-6 bg-white rounded-full shadow -ml-[22px] translate-x-2 peer-checked:translate-x-8 transition-transform"></span>
            </span>
          </label>
        </div>

        <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-4 flex items-center justify-between gap-4">
          <div>
            <p class="font-medium">Pengumuman</p>
            <p class="text-xs text-gray-500 dark:text-neutral-400">Notifikasi saat ada pengumuman baru.</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" v-model="prefs.announce" />
            <span class="w-14 h-7 bg-gray-200 dark:bg-neutral-700 rounded-full peer-checked:bg-[#58CC02] transition-colors border-2 border-transparent flex items-center">
              <span class="size-6 bg-white rounded-full shadow -ml-[22px] translate-x-2 peer-checked:translate-x-8 transition-transform"></span>
            </span>
          </label>
        </div>

        <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-4 flex items-center justify-between gap-4">
          <div>
            <p class="font-medium">Tagihan</p>
            <p class="text-xs text-gray-500 dark:text-neutral-400">Ingatkan sebelum jatuh tempo.</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" v-model="prefs.billing" />
            <span class="w-14 h-7 bg-gray-200 dark:bg-neutral-700 rounded-full peer-checked:bg-[#58CC02] transition-colors border-2 border-transparent flex items-center">
              <span class="size-6 bg-white rounded-full shadow -ml-[22px] translate-x-2 peer-checked:translate-x-8 transition-transform"></span>
            </span>
          </label>
        </div>

        <div class="rounded-xl border border-gray-200 dark:border-neutral-800 p-4 flex items-center justify-between gap-4">
          <div>
            <p class="font-medium">Jadwal</p>
            <p class="text-xs text-gray-500 dark:text-neutral-400">Agenda penting santri.</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" v-model="prefs.schedule" />
            <span class="w-14 h-7 bg-gray-200 dark:bg-neutral-700 rounded-full peer-checked:bg-[#58CC02] transition-colors border-2 border-transparent flex items-center">
              <span class="size-6 bg-white rounded-full shadow -ml-[22px] translate-x-2 peer-checked:translate-x-8 transition-transform"></span>
            </span>
          </label>
        </div>
      </div>

      <div class="px-6 pb-6">
        <button @click="savePrefs"
                class="inline-flex items-center gap-x-2 rounded-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-3 px-4 text-sm font-semibold hover:shadow-md transition">
          <Icon icon="lucide:save" class="size-5" /> <span>Simpan Preferensi</span>
        </button>
        <span v-if="prefsSavedAt" class="ml-3 text-xs text-gray-500 dark:text-neutral-400">Tersimpan {{ timeAgo(prefsSavedAt) }}</span>
      </div>
    </section>

    <!-- Relasi Santri -->
    <section class="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-md transition">
      <header class="px-6 py-4 border-b border-gray-200 dark:border-neutral-800">
        <h2 class="font-semibold flex items-center gap-2">
          <Icon icon="lucide:users" class="size-5 text-[#58CC02]" /> Relasi Santri
        </h2>
      </header>

      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="s in linkedSantri" :key="s.id" class="rounded-xl border border-gray-200 dark:border-neutral-800 p-4 flex items-start gap-3">
            <img :src="s.avatar" class="size-12 rounded-xl object-cover ring-1 ring-gray-200 dark:ring-neutral-800" alt="Santri" />
            <div class="min-w-0">
              <p class="font-medium">{{ s.name }}</p>
              <p class="text-xs text-gray-500 dark:text-neutral-400">{{ s.nis }} • {{ s.jenjang }}</p>
              <div class="mt-3 flex flex-wrap items-center gap-2">
                <button class="inline-flex items-center gap-x-2 rounded-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-2.5 px-3 text-sm font-semibold hover:shadow-md transition">
                  <Icon icon="lucide:external-link" class="size-5" /> <span>Detail</span>
                </button>
                <button class="inline-flex items-center gap-x-2 rounded-full border-2 border-rose-500 text-rose-600 bg-white dark:bg-neutral-900 py-2.5 px-3 text-sm font-semibold hover:bg-rose-50 dark:hover:bg-rose-900/10 transition" @click="askUnlink(s)">
                  <Icon icon="lucide:unlink" class="size-5" /> <span>Lepas</span>
                </button>
              </div>
            </div>
          </div>

          <!-- CTA tambah relasi -->
          <button class="h-full min-h-[7.5rem] rounded-2xl border-2 border-dashed border-[#58CC02]/60 flex flex-col items-center justify-center gap-2 text-sm hover:bg-[#E7F7D4] transition"
                  @click="openLinkModal = true">
            <Icon icon="lucide:link" class="size-7 text-[#58CC02]" />
            <span class="font-medium">Tautkan Santri</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Sticky Action Bar -->
    <div class="sticky bottom-3 inset-x-0 px-6">
      <div class="mx-auto max-w-5xl rounded-2xl shadow-lg border border-gray-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur p-3 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-300">
          <Icon icon="lucide:info" class="size-5" />
          <span>Pastikan semua perubahan sudah sesuai.</span>
        </div>
        <div class="flex items-center gap-2">
          <button class="inline-flex items-center gap-x-2 rounded-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-3 px-4 text-sm font-semibold hover:shadow-md transition" @click="goWali">
            <Icon icon="lucide:x" class="size-5" /> <span>Batalkan</span>
          </button>
          <button class="inline-flex items-center gap-x-2 rounded-full text-white py-3 px-5 text-sm font-semibold shadow-md bg-[#58CC02] hover:bg-[#4CB302] transition" @click="saveAll">
            <Icon icon="lucide:check-circle" class="size-5" /> <span>Simpan Semua Perubahan</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: Konfirmasi Hapus Akun -->
    <div v-if="confirmDelete" class="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" @click.self="confirmDelete=false">
      <div class="w-full max-w-lg rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xl">
        <h3 class="font-semibold mb-1">Hapus Akun</h3>
        <p class="text-sm text-gray-500 dark:text-neutral-400">Tindakan ini tidak dapat dibatalkan. Hubungi admin untuk memastikan konsekuensinya.</p>
        <div class="mt-4 flex items-center justify-end gap-2">
          <button class="inline-flex items-center gap-x-2 rounded-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-3 px-4 text-sm font-semibold hover:shadow-md transition" @click="confirmDelete=false">Batal</button>
          <button class="inline-flex items-center gap-x-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white py-3 px-4 text-sm font-semibold transition" @click="deleteAccount">
            <Icon icon="lucide:trash-2" class="size-5" /> <span>Hapus</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: Tautkan Santri -->
    <div v-if="openLinkModal" class="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" @click.self="openLinkModal=false">
      <div class="w-full max-w-lg rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xl">
        <h3 class="font-semibold mb-1">Tautkan Santri</h3>
        <p class="text-sm text-gray-500 dark:text-neutral-400 mb-3">Masukkan NIS atau Kartu RFID untuk menautkan santri ke akun wali.</p>
        <div class="flex items-end gap-3">
          <label class="flex-1">
            <span class="sr-only">NIS / RFID</span>
            <input v-model="linkKey" type="text"
                   class="py-3 px-4 block w-full border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
                   placeholder="NIS / RFID" />
          </label>
          <button class="inline-flex items-center gap-x-2 rounded-full text-white py-3 px-5 text-sm font-semibold shadow-md bg-[#58CC02] hover:bg-[#4CB302] transition">
            <Icon icon="lucide:link" class="size-5" /> <span>Tautkan</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: Konfirmasi Unlink -->
    <div v-if="unlinkTarget" class="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" @click.self="unlinkTarget=null">
      <div class="w-full max-w-lg rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xl">
        <h3 class="font-semibold mb-1">Lepas Relasi</h3>
        <p class="text-sm text-gray-500 dark:text-neutral-400">
          Lepas relasi dengan <strong>{{ unlinkTarget?.name }}</strong>? Wali akan kehilangan akses monitoring santri tsb.
        </p>
        <div class="mt-4 flex items-center justify-end gap-2">
          <button class="inline-flex items-center gap-x-2 rounded-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-3 px-4 text-sm font-semibold hover:shadow-md transition" @click="unlinkTarget=null">Batal</button>
          <button class="inline-flex items-center gap-x-2 rounded-full border-2 border-rose-500 text-rose-600 bg-white dark:bg-neutral-900 py-3 px-4 text-sm font-semibold hover:bg-rose-50 dark:hover:bg-rose-900/10 transition" @click="unlinkNow">
            <Icon icon="lucide:unlink" class="size-5" /> <span>Lepas</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { useNuxtApp } from '#app'
import { onAuthStateChanged, updateProfile, sendPasswordResetEmail, type User } from 'firebase/auth'
import { ref as sRef, uploadBytes, getDownloadURL, type Storage } from 'firebase/storage'
import { ref as dbRef, update, get } from 'firebase/database'

definePageMeta({ layout: 'app', layoutProps: { title: 'Pengaturan Wali' }, ssr: false })

/** ====== INJECT FIREBASE DARI PLUGIN ====== */
const { $auth, $storage, $realtimeDb } = useNuxtApp() // from plugins/firebase.client.ts

/** ====== ROUTER ====== */
const router = useRouter()
function goWali() { router.push('/wali') }

/** ====== STATE ====== */
const authUser = ref<User | null>(null)
const user = computed(() => authUser.value)
const uid = computed(() => user.value?.uid ?? '')
const fallbackAvatar = '/assets/pp.jpg'

const form = reactive({
  displayName: '',
  email: '',
  phone: '',
  address: '',
})

const avatarFile = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)

const saving = ref(false)
const sendingReset = ref(false)
const lastSavedAt = ref<number | null>(null)
const twoFA = ref(false)

const prefsKey = 'obayan_wali_prefs'
const prefs = reactive({
  whatsapp: true,
  email: true,
  announce: true,
  billing: true,
  schedule: true,
})
const prefsSavedAt = ref<number | null>(null)

/** Dummy relasi santri — sambungkan ke DB Anda */
const linkedSantri = ref([
  { id: 's1', name: 'Muhammad Rizky Alfarizi', nis: '2023.045', jenjang: 'KMI • MTs Kelas 2', avatar: '/assets/pp.jpg' },
])
const openLinkModal = ref(false)
const linkKey = ref('')
const unlinkTarget = ref<null | { id: string; name: string }>(null)

/** ====== INIT ====== */
onMounted(() => {
  // Listen perubahan user
  onAuthStateChanged($auth, async (u) => {
    authUser.value = u
    if (u) {
      form.displayName = u.displayName ?? ''
      form.email = u.email ?? ''

      // Prefill dari localStorage (safe-parse)
      try {
        const cached = localStorage.getItem('wali_profile_extra')
        if (cached) {
          const extra = JSON.parse(cached)
          form.phone = extra.phone ?? ''
          form.address = extra.address ?? ''
          avatarPreview.value = extra.avatarPreview ?? null
        }
      } catch (e) {
        console.warn('[init] gagal parse wali_profile_extra', e)
      }

      // (Opsional) Prefill dari RTDB jika ada data
      try {
        const snap = await get(dbRef($realtimeDb, `obayan/users/${u.uid}`))
        if (snap.exists()) {
          const v = snap.val() || {}
          form.phone = v.phone ?? form.phone
          form.address = v.address ?? form.address
          if (v.avatarUrl) avatarPreview.value = v.avatarUrl
        }
      } catch (e) {
        console.warn('[init] skip fetch RTDB:', e)
      }
    }
  })

  // Load prefs
  try {
    const p = localStorage.getItem(prefsKey)
    if (p) Object.assign(prefs, JSON.parse(p))
  } catch (e) {
    console.warn('[init] gagal parse prefs', e)
  }
})

/** ====== ACTIONS ====== */
async function saveProfile() {
  try {
    saving.value = true
    if (!user.value) return toast('Belum login.')

    // Update displayName jika berubah
    if ((user.value.displayName ?? '') !== form.displayName) {
      await updateProfile(user.value, { displayName: form.displayName })
    }

    // Upload avatar bila ada
    let avatarUrl: string | undefined
    if (avatarFile.value) {
      avatarUrl = await uploadAvatar($storage, uid.value, avatarFile.value)
    }

    // Simpan extra profile (lokal)
    const extra = { phone: form.phone, address: form.address, avatarPreview: avatarUrl ?? avatarPreview.value }
    localStorage.setItem('wali_profile_extra', JSON.stringify(extra))

    // Simpan ke RTDB (opsional)
    try {
      await update(dbRef($realtimeDb, `obayan/users/${uid.value}`), {
        phone: form.phone || null,
        address: form.address || null,
        avatarUrl: avatarUrl ?? null,
        updatedAt: Date.now()
      })
    } catch (e) {
      console.warn('[saveProfile] skip DB update:', e)
    }

    if (avatarUrl) avatarPreview.value = avatarUrl
    toast('Profil berhasil disimpan.')
    lastSavedAt.value = Date.now()
  } catch (err) {
    console.error(err)
    toast('Gagal menyimpan profil.')
  } finally {
    saving.value = false
  }
}

async function sendPasswordLink() {
  if (!form.email) return toast('Email tidak tersedia.')
  try {
    sendingReset.value = true
    await sendPasswordResetEmail($auth, form.email)
    toast('Tautan reset password telah dikirim ke email.')
  } catch (err: any) {
    console.error(err)
    toast('Gagal mengirim tautan reset password.')
  } finally {
    sendingReset.value = false
  }
}

async function uploadAvatar(storage: Storage, uid: string, file: File) {
  const safeName = file.name.replace(/[^\w.\-]+/g, '_')
  const path = `avatars/wali/${uid}/${Date.now()}_${safeName}`
  const bucketRef = sRef(storage, path)
  await uploadBytes(bucketRef, file)
  return await getDownloadURL(bucketRef)
}

function toggle2FA() {
  twoFA.value = !twoFA.value
  toast(twoFA.value ? '2FA diaktifkan (dummy).' : '2FA dinonaktifkan (dummy).')
}

function savePrefs() {
  localStorage.setItem(prefsKey, JSON.stringify(prefs))
  prefsSavedAt.value = Date.now()
  toast('Preferensi notifikasi disimpan.')
}

function onPickAvatar(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) return toast('Ukuran gambar maksimal 2 MB.')
  avatarFile.value = file
  const reader = new FileReader()
  reader.onload = () => (avatarPreview.value = String(reader.result))
  reader.readAsDataURL(file)
}
function resetAvatar() {
  avatarFile.value = null
  avatarPreview.value = null
}

function openWhatsAppVerify() {
  if (!form.phone) return toast('Isi nomor HP/WA terlebih dahulu.')
  const normalized = normalizePhone(form.phone)
  const msg = encodeURIComponent('Halo Admin, saya ingin verifikasi nomor WA untuk akun Wali.')
  window.open(`https://wa.me/${normalized}?text=${msg}`, '_blank')
}

function askUnlink(s: { id: string; name: string }) { unlinkTarget.value = { id: s.id, name: s.name } }
function unlinkNow() {
  if (!unlinkTarget.value) return
  linkedSantri.value = linkedSantri.value.filter((x) => x.id !== unlinkTarget.value!.id)
  toast(`Relasi dengan ${unlinkTarget.value.name} dilepas.`)
  unlinkTarget.value = null
}

async function deleteAccount() {
  confirmDelete.value = false
  toast('Silakan hubungi admin untuk penghapusan akun.')
}
async function saveAll() {
  await saveProfile()
  savePrefs()
  toast('Semua perubahan tersimpan ✅')
}

/** ====== UTILS ====== */
const confirmDelete = ref(false)

function normalizePhone(input: string) {
  let s = input.replace(/[^\d]/g, '')
  if (s.startsWith('0')) s = '62' + s.slice(1)
  return s
}

function copy(text: string) {
  if (!text) return
  navigator.clipboard.writeText(text)
  toast('Disalin ke clipboard.')
}

function timeAgo(ts: number) {
  const diff = Math.max(1, Math.round((Date.now() - ts) / 1000))
  if (diff < 60) return `${diff}s lalu`
  const m = Math.round(diff / 60)
  if (m < 60) return `${m}m lalu`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}j lalu`
  const d = Math.round(h / 24)
  return `${d}h lalu`
}

function toast(message: string) {
  console.log('[toast]', message)
}
</script>
