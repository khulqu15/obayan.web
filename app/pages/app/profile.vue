<!-- pages/app/profile.vue -->
<template>
  <div class="p-6 space-y-6 text-gray-800 dark:text-neutral-300">
    <section class="relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-xs dark:bg-neutral-800 dark:border-neutral-700">
      <div class="h-36 mb-4 sm:h-44 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500"></div>

      <div class="px-4 sm:px-6 -mt-10 sm:-mt-12 pb-5 bg-white dark:bg-neutral-700 pt-3">
        <div class="flex flex-col sm:flex-row sm:items-end gap-4">
          <div class="relative">
            <img :src="avatarPreview || user.avatar" alt="Avatar"
                 class="size-24 sm:size-28 rounded-2xl ring-4 ring-white dark:ring-neutral-800 object-cover">
            <button
              type="button"
              class="absolute -right-2 -bottom-2 p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700"
              @click="showAvatarModal = true">
              <Icon icon="lucide:camera" class="size-4" />
            </button>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-lg sm:text-xl font-semibold truncate">{{ profileForm.name || '—' }}</h1>
              <span class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-50 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800">
                <Icon icon="lucide:badge-check" class="size-3.5" /> {{ sessionUser?.role || '—' }}
              </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-neutral-400 truncate">{{ profileForm.email || '—' }}</p>
            <div class="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-neutral-400">
              <span class="inline-flex items-center gap-1"><Icon icon="lucide:building" class="size-3.5" /> {{ profileForm.org || '—' }}</span>
              <span class="inline-flex items-center gap-1"><Icon icon="lucide:map-pin" class="size-3.5" /> {{ profileForm.location || '—' }}</span>
              <span class="inline-flex items-center gap-1"><Icon icon="lucide:clock" class="size-3.5" /> Bergabung {{ joinedAt }}</span>
            </div>
          </div>

          <div class="grid lg:grid-cols-3 gap-2">
            <div class="p-3 rounded-xl border border-gray-300 bg-white shadow-2xs dark:bg-neutral-800 dark:border-neutral-700">
              <p class="text-[11px] text-gray-500 dark:text-neutral-400">Peran</p>
              <p class="font-medium">{{ roleLabel }}</p>
            </div>
            <div class="p-3 rounded-xl border border-gray-300 bg-white shadow-2xs dark:bg-neutral-800 dark:border-neutral-700">
              <p class="text-[11px] text-gray-500 dark:text-neutral-400">Akses</p>
              <p class="font-medium">{{ accessLabel }}</p>
            </div>
            <div class="p-3 rounded-xl border border-gray-300 bg-white shadow-2xs dark:bg-neutral-800 dark:border-neutral-700">
              <p class="text-[11px] text-gray-500 dark:text-neutral-400">Terakhir aktif</p>
              <p class="font-medium">{{ lastActive }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="rounded-2xl border border-gray-200 bg-white shadow-xs dark:bg-neutral-800 dark:border-neutral-700">
      <div class="px-4 sm:px-6 pt-4">
        <nav class="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50 text-sm dark:bg-neutral-900 dark:border-neutral-700"
             role="tablist">
          <button type="button" :class="tabBtn('overview')"  @click="activeTab='overview'"
                  role="tab" :aria-selected="activeTab==='overview'" aria-controls="tab-overview">Overview</button>
          <button type="button" :class="tabBtn('security')"  @click="activeTab='security'"
                  role="tab" :aria-selected="activeTab==='security'" aria-controls="tab-security">Security</button>
          <button type="button" :class="tabBtn('activity')"  @click="activeTab='activity'"
                  role="tab" :aria-selected="activeTab==='activity'" aria-controls="tab-activity">Aktivitas</button>
        </nav>
      </div>

      <div class="px-4 sm:px-6 pb-6">
        <!-- OVERVIEW -->
        <div id="tab-overview" role="tabpanel" class="pt-4" v-show="activeTab==='overview'">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <form @submit.prevent="saveProfile" class="lg:col-span-2 p-4 rounded-xl border border-gray-200 bg-white shadow-2xs dark:bg-neutral-800 dark:border-neutral-700 space-y-4">
              <h3 class="font-semibold">Informasi Profil</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Nama</label>
                  <input v-model.trim="profileForm.name" type="text" :class="inputBase" required />
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Email</label>
                  <input v-model.trim="profileForm.email" type="email" :class="inputBase" required />
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Organisasi</label>
                  <input v-model.trim="profileForm.org" type="text" :class="inputBase" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Lokasi</label>
                  <input v-model.trim="profileForm.location" type="text" :class="inputBase" />
                </div>
                <div class="sm:col-span-2">
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Bio</label>
                  <textarea v-model.trim="profileForm.bio" rows="3" :class="inputBase"></textarea>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button type="submit" class="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700" :disabled="savingProfile">
                  {{ savingProfile ? 'Menyimpan…' : 'Simpan' }}
                </button>
                <button type="button" class="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700" @click="resetProfile" :disabled="savingProfile">Reset</button>
                <span v-if="noteProfile" class="text-xs text-emerald-600">{{ noteProfile }}</span>
              </div>
            </form>

            <div class="p-4 rounded-xl border border-gray-200 bg-white shadow-2xs dark:bg-neutral-800 dark:border-neutral-700 space-y-4">
              <h3 class="font-semibold">Preferensi</h3>
              <div class="flex items-center justify-between">
                <span class="text-sm">Email notifikasi</span>
                <label class="hs-tooltip inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" v-model="prefs.emailNotif">
                  <span class="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-blue-600 relative after:absolute after:top-0.5 after:left-0.5 after:size-4 after:bg-white after:rounded-full peer-checked:after:translate-x-5 after:transition"></span>
                </label>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm">Push notifikasi</span>
                <label class="inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" v-model="prefs.pushNotif">
                  <span class="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-blue-600 relative after:absolute after:top-0.5 after:left-0.5 after:size-4 after:bg-white after:rounded-full peer-checked:after:translate-x-5 after:transition"></span>
                </label>
              </div>
              <div>
                <label class="text-xs text-gray-500 dark:text-neutral-400">Bahasa</label>
                <select v-model="prefs.lang" :class="inputBase">
                  <option value="id">Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>
              <button class="w-full px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700" @click="savePrefs" :disabled="savingPrefs">
                {{ savingPrefs ? 'Menyimpan…' : 'Simpan Preferensi' }}
              </button>
              <p v-if="notePrefs" class="text-xs text-emerald-600">{{ notePrefs }}</p>
            </div>
          </div>
        </div>

        <!-- SECURITY -->
        <div id="tab-security" role="tabpanel" class="pt-4" v-show="activeTab==='security'">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <form @submit.prevent="changePassword" class="lg:col-span-2 p-4 rounded-xl border border-gray-200 bg-white shadow-2xs dark:bg-neutral-800 dark:border-neutral-700 space-y-4">
              <h3 class="font-semibold">Ubah Password</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="sm:col-span-2">
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Password saat ini</label>
                  <input v-model="pwd.current" type="password" :class="inputBase" required />
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Password baru</label>
                  <input v-model="pwd.next" type="password" minlength="8" :class="inputBase" required />
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Konfirmasi password baru</label>
                  <input v-model="pwd.confirm" type="password" minlength="8" :class="inputBase" required />
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button type="submit" class="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700" :disabled="changingPwd">
                  {{ changingPwd ? 'Memproses…' : 'Perbarui' }}
                </button>
                <p class="text-xs text-gray-500" v-if="pwdStrength">Kekuatan: <span class="font-medium">{{ pwdStrength }}</span></p>
                <span v-if="notePwd" class="text-xs" :class="pwdOk ? 'text-emerald-600' : 'text-rose-600'">{{ notePwd }}</span>
              </div>
            </form>

            <div class="p-4 rounded-xl border border-gray-300 bg-white shadow-2xs dark:bg-neutral-800 dark:border-neutral-700 space-y-4">
              <h3 class="font-semibold">Keamanan Tambahan</h3>
              <div class="flex items-center justify-between">
                <span class="text-sm">Aktifkan 2FA (TOTP)</span>
                <button class="px-2.5 py-1 text-xs rounded-md border border-gray-300 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700" @click="toggle2FA" :disabled="saving2FA">
                  {{ twoFAEnabled ? 'Nonaktifkan' : 'Aktifkan' }}
                </button>
              </div>
              <div class="pt-2 border-t border-gray-200 dark:border-neutral-700">
                <div class="flex items-center justify-between gap-2">
                  <div class="min-w-0">
                    <p class="text-sm">API Key</p>
                    <p class="text-[12px] text-gray-500 truncate">{{ apiKeyMasked }}</p>
                  </div>
                  <div class="flex items-center gap-1">
                    <button type="button"
                      class="px-2.5 py-1 text-xs border-gray-300 rounded-md border hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
                      @click="copyApiKey">
                      Salin
                    </button>
                    <button type="button"
                      class="px-2.5 py-1 text-xs border-gray-300 rounded-md border hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
                      @click="regenerateApiKey" :disabled="regenLoading">Regenerate</button>
                  </div>
                </div>
              </div>

              <!-- Sesi perangkat -->
              <div class="pt-2 border-t border-gray-200 dark:border-neutral-700">
                <div class="flex items-center justify-between">
                  <h4 class="font-medium">Sesi Aktif</h4>
                  <button class="text-xs text-rose-600 hover:underline" @click="signOutAll">Keluar semua</button>
                </div>
                <ul v-if="sessions.length" class="mt-2 space-y-2">
                  <li v-for="s in sessions" :key="s.id" class="p-2 rounded-lg border bg-white dark:bg-neutral-800 dark:border-neutral-700 flex items-center gap-2">
                    <Icon :icon="s.icon" class="size-4 text-gray-500" />
                    <div class="min-w-0">
                      <p class="text-sm truncate">{{ s.device }} · {{ s.browser }}</p>
                      <p class="text-[12px] text-gray-500 truncate">{{ s.ip }} · {{ s.location }} · {{ s.time }}</p>
                    </div>
                    <button class="ml-auto text-xs px-2 py-1 rounded-md border hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
                            @click="revokeSession(s.id)">Keluar</button>
                  </li>
                </ul>
                <p v-else class="text-sm text-gray-500">Tidak ada sesi lain.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ACTIVITY -->
        <div id="tab-activity" role="tabpanel" class="pt-4" v-show="activeTab==='activity'">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div class="lg:col-span-2 p-4 rounded-xl border border-gray-200 bg-white shadow-2xs dark:bg-neutral-800 dark:border-neutral-700">
              <h3 class="font-semibold mb-3">Log Aktivitas</h3>
              <ul v-if="audits.length" class="space-y-3">
                <li v-for="a in audits" :key="a.id" class="flex items-start gap-3">
                  <span class="mt-0.5 size-2 rounded-full" :class="a.color"></span>
                  <div class="min-w-0">
                    <p class="text-sm truncate">{{ a.title }}</p>
                    <p class="text-[12px] text-gray-500 truncate">{{ a.desc }}</p>
                  </div>
                  <span class="ml-auto text-[11px] text-gray-500">{{ a.time }}</span>
                </li>
              </ul>
              <p v-else class="text-sm text-gray-500">Belum ada aktivitas.</p>
            </div>

            <div class="p-4 rounded-xl border border-gray-200 bg-white shadow-2xs dark:bg-neutral-800 dark:border-neutral-700">
              <h3 class="font-semibold mb-3">Link Cepat</h3>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <NuxtLink to="/app" class="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700">
                  <Icon icon="lucide:layout-dashboard" class="size-4 mb-2" /> Dashboard
                </NuxtLink>
                <NuxtLink to="/app/announcement" class="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700">
                  <Icon icon="lucide:info" class="size-4 mb-2" /> Pengumuman
                </NuxtLink>
                <NuxtLink to="/app/absen" class="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700">
                  <Icon icon="hugeicons:note-03" class="size-4 mb-2" /> Absensi
                </NuxtLink>
                <NuxtLink to="/app/faults" class="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700">
                  <Icon icon="mingcute:fault-line" class="size-4 mb-2" /> Pelanggaran
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <Transition name="fade">
      <div v-show="showAvatarModal" class="fixed inset-0 z-60">
        <!-- backdrop -->
        <div class="absolute inset-0 bg-black/50"></div>

        <!-- dialog (centered & max-h) -->
        <div class="absolute inset-0 p-4 sm:p-8 flex items-center justify-center">
          <div class="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border bg-white shadow-xl dark:bg-neutral-800 dark:border-neutral-700 flex flex-col">
             <div class="p-4 border-b dark:border-neutral-700 flex items-center justify-between">
               <h4 class="font-semibold">Ubah Foto Profil</h4>
               <button type="button" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700"
                       @click="showAvatarModal = false">
                 <Icon icon="lucide:x" class="size-4" />
               </button>
             </div>
 
            <div class="p-4 space-y-4 overflow-y-auto">
               <!-- Picker -->
               <div class="flex flex-col sm:flex-row gap-3">
                 <input
                   ref="fileInput"
                   type="file"
                   accept="image/*"
                   @change="onPickAvatar"
                   class="block w-full text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-neutral-700 dark:file:text-neutral-200" />
 
                 <div class="flex items-center gap-2">
                   <label class="text-xs text-gray-500 dark:text-neutral-400">Ukuran</label>
                   <select v-model.number="crop.size"
                           class="py-2 px-3 rounded-lg border border-gray-200 dark:border-neutral-700 dark:bg-neutral-900 text-sm">
                     <option v-for="s in [256,384,512,768,1024]" :key="s" :value="s">{{ s }}×{{ s }}</option>
                   </select>
                 </div>
 
                 <div class="flex-1 flex items-center gap-3">
                    <label class="text-xs text-gray-500 dark:text-neutral-400">Zoom</label>
                    <input :min="minScale" :max="maxScale" type="range" step="0.01" v-model.number="crop.scale"
                        @input="clampOffsets()" class="w-full accent-gray-700">
                    <button type="button" class="px-2 py-1 text-xs rounded-md border hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
                        @click="resetCrop" :disabled="!crop.src">Reset</button>
                    <button type="button" class="px-2 py-1 text-xs rounded-md border hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
                        @click="fitCrop" :disabled="!crop.src">Fit</button>
                    <button type="button" class="px-2 py-1 text-xs rounded-md border hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
                        @click="centerCrop" :disabled="!crop.src">Center</button>
                 </div>
               </div>
 
               <!-- Cropper (drag / pinch / wheel) -->
               <div
                  ref="cropBoxEl"
                  class="relative mx-auto w-full max-w-[560px] aspect-square rounded-xl border border-gray-200 bg-gray-50 overflow-hidden select-none touch-none dark:bg-neutral-900 dark:border-neutral-700"
                  @pointerdown="onDragStart"
                  @pointermove="onDragMove"
                  @pointerup="onDragEnd"
                  @pointercancel="onDragEnd"
                  @pointerleave="onDragEnd"
                  @wheel.prevent="onWheel">
 
                 <img
                   v-if="crop.src"
                   :src="crop.src"
                   :style="imageStyle"
                   class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform pointer-events-none rounded" />
 
                 <div v-else class="absolute inset-0 grid place-items-center text-sm text-gray-500 dark:text-neutral-400">
                   Pilih gambar untuk mulai crop
                 </div>
 
                <!-- overlay grid: rule-of-thirds -->
                <div class="absolute inset-0 pointer-events-none">
                  <div class="absolute inset-3 rounded-xl border-2 border-dashed border-gray-400/70"></div>
                  <div class="absolute inset-3 grid grid-cols-3 grid-rows-3 rounded-xl overflow-hidden">
                    <div class="border-r border-gray-300/50"></div><div class="border-r border-gray-300/50"></div><div></div>
                    <div class="border-t border-gray-300/50"></div><div class="border-t border-gray-300/50"></div><div class="border-t border-gray-300/50"></div>
                  </div>
                </div>
               </div>
 
               <p class="text-xs text-gray-500 dark:text-neutral-400">
                 Tips: seret gambar untuk mengatur posisi. Gunakan slider untuk zoom. Hasil akan dipotong <strong>persegi (1:1)</strong>.
               </p>
             </div>
 
             <div class="p-4 border-t dark:border-neutral-700 flex items-center justify-end gap-2">
               <button class="px-3 py-1.5 rounded-lg border hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
                       @click="cancelAvatar(); showAvatarModal = false">
                 Batal
               </button>
               <button class="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                       @click="handleUploadAvatar"
                       :disabled="uploadingAvatar || !crop.src">
                 {{ uploadingAvatar ? 'Mengunggah…' : 'Simpan' }}
               </button>
             </div>
           </div>
         </div>
       </div>
     </Transition>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { child, get, set, update, remove, ref as dbRef } from 'firebase/database'
import { getAuth, signInWithEmailAndPassword, updatePassword } from 'firebase/auth'

// Akses RTDB dari plugin firebase
const { $realtimeDb } = useNuxtApp() as any

definePageMeta({ layout: 'app', layoutProps: { title: 'Profil' } })

// ===== Session user dari middleware =====
const sessionUser = useState<any>('sessionUser', () => null)

// ===== State UI dasar =====
const inputBase =
  'py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600'

// ===== Data profil =====
const user = reactive({
  id: '',
  name: '',
  email: '',
  avatar: '/assets/pp.jpg',
  org: '',
  location: '',
  bio: '',
  createdAt: 0,
  updatedAt: 0,
})

const profileForm = reactive({
  name: '', email: '', org: '', location: '', bio: ''
})
const prefs = reactive({ emailNotif: true, pushNotif: true, lang: 'id' })
const twoFAEnabled = ref(false)
const apiKey = ref<string>('')
const activeTab = ref<'overview'|'security'|'activity'>('overview')

// ===== Sessions & audits =====
type SessionRow = { id: string; device: string; browser: string; ip: string; location: string; time: string; icon: string }
type AuditRow   = { id: string; title: string; desc: string; time: string; color: string }
const sessions = ref<SessionRow[]>([])
const audits   = ref<AuditRow[]>([])

// ===== Avatar upload =====
const fileInput = ref<HTMLInputElement | null>(null)
async function onPickAvatar(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (!f) return
  // buat object URL & baca dimensi natural
  const url = URL.createObjectURL(f)
  crop.src = url
  avatarPreview.value = url // preview sementara di header
  const img = new Image()
  img.onload = async () => {
    crop.naturalW = img.naturalWidth
    crop.naturalH = img.naturalHeight
    await nextTick()
    computeBaseFit()
    centerCrop()
  }
  img.src = url
}

const tabBtn = (key: 'overview'|'security'|'activity') =>
  `px-3 py-1.5 rounded-md transition ${
    activeTab.value===key
      ? 'bg-white text-gray-900 dark:bg-neutral-200'
      : 'text-gray-600 hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white'
  }`

function getCropSourceRect() {
  const cw = cropBoxEl.value?.clientWidth  || crop.size
  const ch = cropBoxEl.value?.clientHeight || crop.size
  const c  = Math.min(cw, ch)
  const displayW = crop.naturalW * crop.baseFit * crop.scale
  const displayH = crop.naturalH * crop.baseFit * crop.scale
  const imgLeft = (c - displayW) / 2 + crop.offsetX
  const imgTop  = (c - displayH) / 2 + crop.offsetY

  const sx = (-imgLeft) / displayW * crop.naturalW
  const sy = (-imgTop)  / displayH * crop.naturalH
  const sWidth  = c / displayW * crop.naturalW
  const sHeight = c / displayH * crop.naturalH

  return { sx, sy, sWidth, sHeight }
}

const cropBoxEl = ref<HTMLDivElement | null>(null)
const avatarPreview = ref<string | null>(null)         // tetap dipakai di header (preview sementara)
const uploadingAvatar = ref(false)

const crop = reactive({
  src: '' as string,              // objectURL dari file terpilih
  naturalW: 0,
  naturalH: 0,
  baseFit: 1,                     // scale agar image cover aspek square container
  scale: 1,                       // multiplier tambahan (zoom)
  offsetX: 0,                     // geser dari pusat (px, pada container)
  offsetY: 0,
  dragging: false,
  lastX: 0,
  lastY: 0,
  size: 512                       // output size (px)
})

const minScale = computed(() => 1)
const maxScale = 5

async function uploadAvatarCropped() {
  if (!crop.src || !sessionUser.value?.uid) return
  uploadingAvatar.value = true
  try {
    // draw ke canvas square (size x size)
    const canvas = document.createElement('canvas')
    canvas.width = crop.size
    canvas.height = crop.size
    const ctx = canvas.getContext('2d')!
    const img = await new Promise<HTMLImageElement>((res) => {
      const i = new Image()
      i.onload = () => res(i)
      i.src = crop.src
    })
    const { sx, sy, sWidth, sHeight } = getCropSourceRect()
    ctx.imageSmoothingQuality = 'high'
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height)

    // konversi → Blob WebP (lebih kecil), fallback PNG bila tak didukung
    const blob: Blob = await new Promise((res) => {
      if (canvas.toBlob) {
        canvas.toBlob((b) => res(b as Blob), 'image/webp', 0.92)
      } else {
        // @ts-ignore
        res(canvas.msToBlob?.() || new Blob())
      }
    })

    // Upload ke Firebase Storage
    const { getStorage, ref: sRef, uploadBytesResumable, getDownloadURL } = await import('firebase/storage')
    const storage = getStorage()
    const filename = `avatar_${Date.now()}_${crop.size}.webp`
    const path = `alberr/users/${sessionUser.value.uid}/${filename}`
    const task = uploadBytesResumable(sRef(storage, path), blob, { contentType: 'image/webp' })

    await new Promise<void>((resolve, reject) => {
      task.on('state_changed', () => {}, reject, async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        user.avatar = url
        profileFormUpdateFromUser()
        await update(dbRef($realtimeDb, `alberr/users/${sessionUser.value.uid}`), {
          avatar: url, updatedAt: Date.now()
        })
        resolve()
      })
    })

    // bersihkan preview & input
    avatarPreview.value = null
    if (fileInput.value) fileInput.value.value = ''
    // reset crop (supaya buka modal lagi mulai fresh)
    crop.src = ''
  } catch (e) {
    console.error(e)
  } finally {
    uploadingAvatar.value = false
  }
}

function cancelAvatar() {
  // tidak menyimpan; biarkan avatar lama, bersihkan preview sementara
  avatarPreview.value = null
  if (fileInput.value) fileInput.value.value = ''
  crop.src = ''
}

const imageStyle = computed(() => {
  // ukuran tampil (setelah baseFit * scale), dipakai hanya untuk transform
  const c = cropBoxEl.value?.clientWidth || 0
  const displayW = crop.naturalW * crop.baseFit * crop.scale
  const displayH = crop.naturalH * crop.baseFit * crop.scale
  return {
    width: `${displayW}px`,
    height: `${displayH}px`,
    transform: `translate(calc(-0% + ${crop.offsetX}px), calc(-0% + ${crop.offsetY}px))`
  }
})

function resetCrop() {
  crop.scale = 1
  crop.offsetX = 0
  crop.offsetY = 0
  clampOffsets()
}
function fitCrop() {
  computeBaseFit()
  clampOffsets()
}
function centerCrop() { 
  crop.offsetX = 0
  crop.offsetY = 0
  clampOffsets()
}
function onDragStart(e: PointerEvent) {
  if (!crop.src) return;
  (e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
  if (activePointers.size === 1) {
    crop.dragging = true
    crop.lastX = e.clientX
    crop.lastY = e.clientY
  } else if (activePointers.size === 2) {
    // mulai pinch
    const pts = [...activePointers.values()]
    pinchStartDist = Math.hypot(pts[0]!.x - pts[1]!.x, pts[0]!.y - pts[1]!.y)
    pinchStartScale = crop.scale
    const box = cropBoxEl.value!
    const rect = box.getBoundingClientRect()
    pinchCenter = { x: (pts[0]!.x + pts[1]!.x)/2 - rect.left, y: (pts[0]!.y + pts[1]!.y)/2 - rect.top }
    crop.dragging = false
  }
}

function onDragMove(e: PointerEvent) {
  if (!crop.src) return
  if (activePointers.has(e.pointerId)) {
    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
  }
  if (activePointers.size === 2) {
    const pts = [...activePointers.values()]
    const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
    if (pinchStartDist > 0) {
      const scale = pinchStartScale * (dist / pinchStartDist)
      zoomAtContainerPoint(pinchCenter.x, pinchCenter.y, scale)
    }
    return
  }
  if (!crop.dragging) return
  const dx = e.clientX - crop.lastX
  const dy = e.clientY - crop.lastY
  crop.offsetX += dx
  crop.offsetY += dy
  crop.lastX = e.clientX
  crop.lastY = e.clientY
  clampOffsets()
}

function onDragEnd(e?: PointerEvent) {
  crop.dragging = false
  if (e?.pointerId != null) activePointers.delete(e.pointerId)
  if (activePointers.size < 2) {
    pinchStartDist = 0
  }
}
function clampOffsets() {
  const cw = cropBoxEl.value?.clientWidth  || 0
  const ch = cropBoxEl.value?.clientHeight || 0
  const c  = Math.min(cw, ch)
  const displayW = crop.naturalW * crop.baseFit * crop.scale
  const displayH = crop.naturalH * crop.baseFit * crop.scale
  const maxX = Math.max(0, (displayW - c) / 2)
  const maxY = Math.max(0, (displayH - c) / 2)
  crop.offsetX = Math.max(-maxX, Math.min(maxX, crop.offsetX))
  crop.offsetY = Math.max(-maxY, Math.min(maxY, crop.offsetY))
}

function clampScale() {
  crop.scale = Math.min(maxScale, Math.max(minScale.value, crop.scale))
}

function zoomAtContainerPoint(px: number, py: number, nextScale: number) {
  const box = cropBoxEl.value
  if (!box || !crop.src) return
  nextScale = Math.min(maxScale, Math.max(minScale.value, nextScale))

  const cw = box.clientWidth
  const ch = box.clientHeight
  const displayW = crop.naturalW * crop.baseFit * crop.scale
  const displayH = crop.naturalH * crop.baseFit * crop.scale
  const left = (cw - displayW) / 2 + crop.offsetX
  const top  = (ch - displayH) / 2 + crop.offsetY
  const u = (px - left) / displayW
  const v = (py - top)  / displayH

  const newDisplayW = crop.naturalW * crop.baseFit * nextScale
  const newDisplayH = crop.naturalH * crop.baseFit * nextScale
  // offset baru agar titik (px,py) tetap ke posisi gambar yang sama
  crop.offsetX = (px - cw/2) + (0.5 - u) * newDisplayW
  crop.offsetY = (py - ch/2) + (0.5 - v) * newDisplayH
  crop.scale = nextScale
  clampOffsets()
}


function computeBaseFit() {
  const box = cropBoxEl.value
  if (!box || !crop.naturalW || !crop.naturalH) return
  const c = Math.min(box.clientWidth, box.clientHeight) // safety
  const prevDisplayW = crop.naturalW * crop.baseFit * crop.scale
  const prevDisplayH = crop.naturalH * crop.baseFit * crop.scale
  const prev = { c, prevDisplayW, prevDisplayH, offsetX: crop.offsetX, offsetY: crop.offsetY }

  // cover square container
  crop.baseFit = Math.max(c / crop.naturalW, c / crop.naturalH)
  // pertahankan center relatif ketika container berubah
  const newDisplayW = crop.naturalW * crop.baseFit * crop.scale
  const newDisplayH = crop.naturalH * crop.baseFit * crop.scale
  const kx = newDisplayW && prev.prevDisplayW ? newDisplayW / prev.prevDisplayW : 1
  const ky = newDisplayH && prev.prevDisplayH ? newDisplayH / prev.prevDisplayH : 1
  crop.offsetX = prev.offsetX * kx
  crop.offsetY = prev.offsetY * ky
  clampScale()
  clampOffsets()
}

let ro: ResizeObserver | null = null
onMounted(() => {
  if (cropBoxEl.value) {
    ro = new ResizeObserver(() => computeBaseFit())
    ro.observe(cropBoxEl.value)
  }
})
onUnmounted(() => { ro?.disconnect(); ro = null })

const uploadAvatar = async () => {
  if (!avatarPreview.value || !sessionUser.value?.uid) return
  const inputEl = fileInput.value
  const file = inputEl?.files?.[0]
  if (!file) return
  uploadingAvatar.value = true
  try {
    const { getStorage, ref: sRef, uploadBytesResumable, getDownloadURL } = await import('firebase/storage')
    const storage = getStorage()
    const path = `alberr/users/${sessionUser.value.uid}/avatar_${Date.now()}_${file.name.replace(/\s+/g, '_')}`
    const task = uploadBytesResumable(sRef(storage, path), file, { contentType: file.type })
    await new Promise<void>((res, rej) => {
      task.on('state_changed', () => {}, rej, async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        user.avatar = url
        profileFormUpdateFromUser()
        await update(dbRef($realtimeDb, `alberr/users/${sessionUser.value.uid}`), { avatar: url, updatedAt: Date.now() })
        res()
      })
    })
  } catch (e) {
    console.error(e)
  } finally {
    uploadingAvatar.value = false
    avatarPreview.value = null
    if (inputEl) inputEl.value = ''
  }
}

// ===== Profile helpers =====
function profileFormUpdateFromUser() {
  profileForm.name = user.name
  profileForm.email = user.email
  profileForm.org = user.org
  profileForm.location = user.location
  profileForm.bio = user.bio
}
function applyFormToUser() {
  user.name = profileForm.name
  user.email = profileForm.email
  user.org = profileForm.org
  user.location = profileForm.location
  user.bio = profileForm.bio
}

function onWheel(e: WheelEvent) {
  if (!crop.src) return
  const box = cropBoxEl.value
  if (!box) return
  const rect = box.getBoundingClientRect()
  const px = e.clientX - rect.left
  const py = e.clientY - rect.top
  const delta = -e.deltaY
  const factor = delta > 0 ? 1.07 : 0.93
  zoomAtContainerPoint(px, py, crop.scale * factor)
}

// Pinch zoom dengan 2 pointer
const activePointers = new Map<number, {x:number,y:number}>()
let pinchStartDist = 0
let pinchStartScale = 1
let pinchCenter = { x: 0, y: 0 }

// ===== Load data awal =====
const savingProfile = ref(false)
const savingPrefs = ref(false)
const noteProfile = ref('')
const notePrefs = ref('')
const saving2FA = ref(false)
const regenLoading = ref(false)

onMounted(async () => {
  if (!sessionUser.value?.uid) return

  // Profil
  try {
    const snap = await get(child(dbRef($realtimeDb), `alberr/users/${sessionUser.value.uid}`))
    const val = snap.val() || {}
    user.id = sessionUser.value.uid
    user.name = String(val.displayName ?? sessionUser.value.name ?? '')
    user.email = String(val.email ?? sessionUser.value.email ?? '')
    user.avatar = String(val.avatar ?? user.avatar)
    user.org = String(val.org ?? '')
    user.location = String(val.location ?? '')
    user.bio = String(val.bio ?? '')
    user.createdAt = Number(val.createdAt ?? Date.now())
    user.updatedAt = Number(val.updatedAt ?? val.createdAt ?? Date.now())
    profileFormUpdateFromUser()

    // Preferensi
    const p = val.prefs || {}
    prefs.emailNotif = !!p.emailNotif
    prefs.pushNotif  = !!p.pushNotif
    prefs.lang       = p.lang === 'en' ? 'en' : 'id'

    // 2FA & API Key
    twoFAEnabled.value = !!(val.security?.twoFA)
    apiKey.value = String(val.apiKey ?? '')

  } catch (e) {
    console.error('Load profile failed', e)
  }

  // Sessions
  try {
    const ss = await get(child(dbRef($realtimeDb), `alberr/sessions/${sessionUser.value.uid}`))
    const raw = ss.val() || {}
    sessions.value = Object.entries<any>(raw).map(([id, s]) => ({
      id, device: s.device || 'Perangkat', browser: s.browser || 'Browser', ip: s.ip || '-', location: s.location || '-',
      time: s.time || new Date().toLocaleString('id-ID'), icon: s.icon || 'lucide:smartphone'
    }))
  } catch (e) { console.error('Load sessions failed', e) }

  // Audits
  try {
    const as = await get(child(dbRef($realtimeDb), `alberr/audits/${sessionUser.value.uid}`))
    const raw = as.val() || {}
    audits.value = Object.entries<any>(raw).map(([id, a]) => ({
      id, title: a.title || '-', desc: a.desc || '-', time: a.time || new Date().toLocaleString('id-ID'),
      color: a.color || 'bg-emerald-400'
    }))
  } catch (e) { console.error('Load audits failed', e) }
})

// ===== Save profile & prefs =====
async function saveProfile() {
  if (!sessionUser.value?.uid) return
  savingProfile.value = true
  noteProfile.value = ''
  try {
    applyFormToUser()
    const patch: any = {
      displayName: user.name,
      email: user.email,
      org: user.org,
      location: user.location,
      bio: user.bio,
      updatedAt: Date.now(),
    }
    await update(dbRef($realtimeDb, `alberr/users/${sessionUser.value.uid}`), patch)
    noteProfile.value = 'Profil tersimpan.'
    setTimeout(() => (noteProfile.value = ''), 1500)
  } catch (e:any) {
    noteProfile.value = e?.message || 'Gagal menyimpan profil'
  } finally {
    savingProfile.value = false
  }
}
function resetProfile() {
  profileFormUpdateFromUser()
}

async function savePrefs() {
  if (!sessionUser.value?.uid) return
  savingPrefs.value = true
  notePrefs.value = ''
  try {
    await update(dbRef($realtimeDb, `alberr/users/${sessionUser.value.uid}`), {
      prefs: { ...prefs }
    })
    notePrefs.value = 'Preferensi tersimpan.'
    setTimeout(() => (notePrefs.value = ''), 1500)
  } catch (e:any) {
    notePrefs.value = e?.message || 'Gagal menyimpan preferensi'
  } finally {
    savingPrefs.value = false
  }
}

// ===== Security: 2FA toggle & API Key =====
async function toggle2FA() {
  if (!sessionUser.value?.uid) return
  saving2FA.value = true
  try {
    const next = !twoFAEnabled.value
    await update(dbRef($realtimeDb, `alberr/users/${sessionUser.value.uid}`), { security: { twoFA: next } })
    twoFAEnabled.value = next
  } catch (e) {
    console.error(e)
  } finally {
    saving2FA.value = false
  }
}
function b64url(buf: Uint8Array) {
  return btoa(String.fromCharCode(...buf)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')
}
async function regenerateApiKey() {
  if (!sessionUser.value?.uid) return
  regenLoading.value = true
  try {
    const rnd = crypto.getRandomValues(new Uint8Array(32))
    const key = 'sk_live_' + b64url(rnd)
    await update(dbRef($realtimeDb, `alberr/users/${sessionUser.value.uid}`), { apiKey: key, updatedAt: Date.now() })
    apiKey.value = key
  } catch (e) {
    console.error(e)
  } finally {
    regenLoading.value = false
  }
}
const apiKeyMasked = computed(() => apiKey.value ? apiKey.value.slice(0,4) + '••••' + apiKey.value.slice(-4) : '—')
async function copyApiKey() {
  try { if (apiKey.value) await navigator.clipboard.writeText(apiKey.value) } catch {}
}

const showAvatarModal = ref(false)

async function handleUploadAvatar() {
  await uploadAvatarCropped()
  showAvatarModal.value = false
}

// ===== Sessions ops =====
async function revokeSession(id: string) {
  if (!sessionUser.value?.uid) return
  try {
    await remove(dbRef($realtimeDb, `alberr/sessions/${sessionUser.value.uid}/${id}`))
    sessions.value = sessions.value.filter(s => s.id !== id)
  } catch (e) { console.error(e) }
}
async function signOutAll() {
  if (!sessionUser.value?.uid) return
  try {
    await remove(dbRef($realtimeDb, `alberr/sessions/${sessionUser.value.uid}`))
    sessions.value = []
  } catch (e) { console.error(e) }
}

// ===== Password change via Firebase Auth secondary =====
const pwd = reactive({ current: '', next: '', confirm: '' })
const changingPwd = ref(false)
const notePwd = ref('')
const pwdOk = ref(false)
const pwdStrength = computed(() => {
  const n = pwd.next
  if (!n) return ''
  const score = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].reduce((s,r)=>s+(r.test(n)?1:0), 0) + (n.length>=12?1:0)
  return ['Lemah','Cukup','Baik','Kuat','Sangat Kuat'][Math.min(score,4)]
})
async function changePassword() {
  notePwd.value = ''
  pwdOk.value = false
  if (pwd.next !== pwd.confirm) {
    notePwd.value = 'Konfirmasi password tidak sama.'
    return
  }
  if (!sessionUser.value?.email) {
    notePwd.value = 'Akun ini tidak memiliki email login Firebase.'
    return
  }
  changingPwd.value = true
  try {
    // Pakai auth secondary agar tidak mengganggu sesi utama (yang bukan Firebase Auth)
    const { getApps, initializeApp } = await import('firebase/app')
    const apps = getApps()
    const primary = apps[0]
    if (!primary) throw new Error('Firebase belum diinisialisasi.')
    const name = '__secondary_profile__'
    const existing = apps.find(a => a.name === name)
    const secondary = existing ?? initializeApp(primary.options, name)

    const a = getAuth(secondary)
    const cred = await signInWithEmailAndPassword(a, sessionUser.value.email, pwd.current)
    await updatePassword(cred.user, pwd.next)

    await a.signOut().catch(()=>{})
    pwd.current = pwd.next = pwd.confirm = ''
    notePwd.value = 'Password berhasil diperbarui.'
    pwdOk.value = true
  } catch (e:any) {
    console.error(e)
    notePwd.value = e?.message || 'Gagal memperbarui password'
  } finally {
    changingPwd.value = false
  }
}

// ===== Computed display =====
const joinedAt = computed(() =>
  user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', { month:'long', year:'numeric' }) : '—'
)
const lastActive = computed(() =>
  (user.updatedAt || user.createdAt) ? new Date(user.updatedAt || user.createdAt).toLocaleString('id-ID') : '—'
)
const roleLabel = computed(() => {
  const r = (sessionUser.value?.role || '').toLowerCase()
  return r === 'admin' ? 'Administrator' : r === 'pengurus' ? 'Pengurus' : r === 'wali' ? 'Wali' : '—'
})
const accessLabel = computed(() => (sessionUser.value?.allowedRoutes?.length ? 'Scoped' : 'Full'))
</script>

<style>
.fade-enter-active,.fade-leave-active{transition:opacity .15s ease}
.fade-enter-from,.fade-leave-to{opacity:0}
</style>