<template>
  <div class="p-6 space-y-6 text-gray-800 dark:text-neutral-300">
    <section class="relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-xs dark:bg-neutral-800 dark:border-neutral-700">
      <div class="h-36 mb-4 sm:h-44 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500"></div>

      <div class="px-4 sm:px-6 -mt-10 sm:-mt-12 pb-5 bg-white dark:bg-neutral-700 pt-3">
        <div class="flex flex-col sm:flex-row sm:items-end gap-4">
          <div class="relative">
            <img :src="avatarPreview || user.avatar" alt="Avatar"
                 class="size-24 sm:size-28 rounded-2xl ring-4 ring-white dark:ring-neutral-800 object-cover">
            <button type="button"
              class="absolute -right-2 -bottom-2 p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700"
              aria-haspopup="dialog" aria-controls="modal-avatar" data-hs-overlay="#modal-avatar">
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
        <nav class="hs-tab inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50 text-sm dark:bg-neutral-900 dark:border-neutral-700" role="tablist">
          <button type="button" class="px-3 py-1.5 rounded-md text-gray-600 hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white hs-tab-active:bg-white hs-tab-active:text-gray-900 dark:hs-tab-active:bg-neutral-200" data-hs-tab="#tab-overview" aria-controls="tab-overview" aria-selected="true" role="tab">Overview</button>
          <button type="button" class="px-3 py-1.5 rounded-md text-gray-600 hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white hs-tab-active:bg-white hs-tab-active:text-gray-900 dark:hs-tab-active:bg-neutral-200" data-hs-tab="#tab-security" aria-controls="tab-security" role="tab">Security</button>
          <button type="button" class="px-3 py-1.5 rounded-md text-gray-600 hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white hs-tab-active:bg-white hs-tab-active:text-gray-900 dark:hs-tab-active:bg-neutral-200" data-hs-tab="#tab-activity" aria-controls="tab-activity" role="tab">Aktivitas</button>
        </nav>
      </div>

      <div class="px-4 sm:px-6 pb-6">
        <!-- OVERVIEW -->
        <div id="tab-overview" role="tabpanel" class="pt-4">
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
        <div id="tab-security" role="tabpanel" class="hidden pt-4">
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
        <div id="tab-activity" role="tabpanel" class="hidden pt-4">
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
                <NuxtLink to="#" class="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700">
                  <Icon icon="lucide:layout-dashboard" class="size-4 mb-2" /> Dashboard
                </NuxtLink>
                <NuxtLink to="#" class="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700">
                  <Icon icon="lucide:info" class="size-4 mb-2" /> Pengumuman
                </NuxtLink>
                <NuxtLink to="#" class="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700">
                  <Icon icon="hugeicons:note-03" class="size-4 mb-2" /> Absensi
                </NuxtLink>
                <NuxtLink to="#" class="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700">
                  <Icon icon="mingcute:fault-line" class="size-4 mb-2" /> Pelanggaran
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Avatar -->
    <div id="modal-avatar" class="hs-overlay hidden fixed inset-0 z-60 overflow-y-auto pointer-events-none">
      <div class="m-4 sm:m-8 pointer-events-auto">
        <div class="mx-auto max-w-lg rounded-2xl border bg-white shadow-xl dark:bg-neutral-800 dark:border-neutral-700">
          <div class="p-4 border-b dark:border-neutral-700 flex items-center justify-between">
            <h4 class="font-semibold">Ubah Foto Profil</h4>
            <button type="button" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700" data-hs-overlay="#modal-avatar">
              <Icon icon="lucide:x" class="size-4" />
            </button>
          </div>
          <div class="p-4 space-y-3">
            <input ref="fileInput" type="file" accept="image/*" @change="onPickAvatar" class="block w-full text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-neutral-700 dark:file:text-neutral-200" />
            <div v-if="avatarPreview" class="rounded-xl overflow-hidden border dark:border-neutral-700">
              <img :src="avatarPreview" class="w-full h-56 object-cover" alt="Preview">
            </div>
          </div>
          <div class="p-4 border-t dark:border-neutral-700 flex items-center justify-end gap-2">
            <button class="px-3 py-1.5 rounded-lg border hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700" data-hs-overlay="#modal-avatar">Batal</button>
            <button class="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700" @click="uploadAvatar" data-hs-overlay="#modal-avatar" :disabled="uploadingAvatar">
              {{ uploadingAvatar ? 'Mengunggah…' : 'Simpan' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
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

// ===== Sessions & audits =====
type SessionRow = { id: string; device: string; browser: string; ip: string; location: string; time: string; icon: string }
type AuditRow   = { id: string; title: string; desc: string; time: string; color: string }
const sessions = ref<SessionRow[]>([])
const audits   = ref<AuditRow[]>([])

// ===== Avatar upload =====
const fileInput = ref<HTMLInputElement | null>(null)
const avatarPreview = ref<string | null>(null)
const uploadingAvatar = ref(false)
const onPickAvatar = (e: Event) => {
  const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return
  avatarPreview.value = URL.createObjectURL(f)
}
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
