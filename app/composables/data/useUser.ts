// composables/data/useUser.ts
import { ref as vRef, computed } from 'vue'
import { child, get, ref as dbRef, set, update, remove } from 'firebase/database'
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updatePassword,
  updateProfile,
  type Auth
} from 'firebase/auth'
import { initializeApp, getApps } from 'firebase/app'

export type AppRole = 'admin' | 'pengurus' | 'wali'

export type UserRow = {
  uid: string
  displayName: string
  email?: string
  phone?: string
  role: AppRole
  isActive: boolean
  allowedRoutes?: string[]
  createdAt: number
  updatedAt?: number
}

export type SidebarItem = { label: string; href: string; icon?: string }
export type SidebarGroup = { title: string; items: SidebarItem[] }

export const ALL_SIDEBAR_GROUPS: SidebarGroup[] = [
  { title: 'Beranda', items: [
    { label: 'Dashboard', href: '/app', icon: 'lucide:layout-dashboard' },
    { label: 'Berita Informasi', href: '/app/news', icon: 'hugeicons:news' },
    { label: 'Pengumuman', href: '/app/announcement', icon: 'lucide:info' },
    { label: 'Agenda', href: '/app/agenda', icon: 'solar:calendar-line-duotone' },
  ]},
    { title: 'Form', items: [
    { label: 'Registrasi Putra', href: '/app/registration', icon: 'fluent:form-24-regular' },
    { label: 'Registrasi Putri', href: '/app/registration-girl', icon: 'fluent:form-24-regular' },
  ]},
  { title: 'Kesantrian', items: [
    { label: 'Santri', href: '/app/santri', icon: 'lucide:users' },
    { label: 'Maskan Kamar', href: '/app/maskan', icon: 'lucide:bed' },
    { label: 'Kelas', href: '/app/class', icon: 'streamline:class-lesson' },
    { label: 'Wali Santri', href: '/app/wali', icon: 'lucide:user-round' },
  ]},
  { title: 'Rutinitas', items: [
    { label: 'Galeri', href: '/app/gallery', icon: 'streamline-flex:gallery' },
    { label: 'Absensi Harian', href: '/app/absen', icon: 'hugeicons:note-03' },
    { label: 'Kunjungan', href: '/app/kunjungan', icon: 'material-symbols:parent-child-dining-outline-rounded' },
    { label: 'Jadwal Piket', href: '/app/picket', icon: 'lucide:calendar-days' },
    { label: 'Registrasi RFID', href: '/app/setting-rfid', icon: 'ri:rfid-fill' },
  ]},
  { title: 'Keamanan', items: [
    { label: 'Pelanggaran', href: '/app/faults', icon: 'mingcute:fault-line' },
    { label: 'Perizinan', href: '/app/izin', icon: 'solar:letter-linear' },
  ]},
  { title: 'Akademik', items: [
    { label: 'Buku / Kitab', href: '/app/book', icon: 'ion:book-outline' },
    { label: 'Nilai', href: '/app/nilai', icon: 'solar:chart-linear' },
    { label: 'Hafalan', href: '/app/hafalan', icon: 'ooui:italic-arab-keheh-jeem' },
    { label: 'Guru', href: '/app/teacher', icon: 'tabler:chalkboard-teacher' },
  ]},
  { title: 'Ketertiban', items: [
    { label: 'Buku Sabar', href: '#', icon: 'dinkie-icons:translate-arabic-latin' },
  ]},
  { title: 'Keuangan', items: [
    { label: 'Pembayaran', href: '/app/payment', icon: 'akar-icons:money' },
    { label: 'Laporan Keuangan', href: '/app/report-money', icon: 'streamline-plump:file-report' },
  ]},
  { title: 'Pengaturan', items: [
    { label: 'Profil', href: '/app/profile', icon: 'iconamoon:profile' },
    { label: 'Kontak', href: '/app/contact', icon: 'hugeicons:contact-01' },
    { label: 'Navbar', href: '/app/navbar', icon: 'tabler:menu-3' },
    { label: 'Hak Akses', href: '/app/user', icon: 'solar:key-broken' },
    { label: 'Website', href: '/app/web', icon: 'icon-park-outline:web-page' },
  ]},
]

export const ALL_ROUTE_PATHS = ALL_SIDEBAR_GROUPS.flatMap(g => g.items.map(i => i.href))

export const ROLE_DEFAULT_ROUTES: Record<AppRole, string[]> = {
  admin: [...ALL_ROUTE_PATHS],
  pengurus: [
    '/app', '/app/news', '/app/announcement', '/app/agenda',
    '/app/santri', '/app/maskan', '/app/class', '/app/wali',
    '/app/absen', '/app/kunjungan', '/app/picket', '/app/setting-rfid',
    '/app/faults', '/app/izin', '/app/teacher',
    '/app/payment', '/app/report-money',
    '/app/profile', '/app/contact'
  ],
  wali: [
    '/app', '/app/news', '/app/announcement', '/app/agenda',
    '/app/kunjungan', '/app/payment', '/app/profile', '/app/contact'
  ],
}

// ---------------- Utils ----------------
function generatePassword(len = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*'
  let out = ''
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}
function phoneToEmail(phone: string) {
  const config = useRuntimeConfig()
  const clientName = config.public.clientName || 'alinayah'
  
  const digits = phone.replace(/[^0-9]/g, '').replace(/^0/, '62')
  return `${digits}-user@${clientName}.sch.id`
}
function now() { return Date.now() }

function ensureSecondaryAuth(primaryAuth?: Auth) {
  const apps = getApps()
  const baseApp = primaryAuth?.app ?? apps[0]
  if (!baseApp) throw new Error('Firebase app belum diinisialisasi.')
  const name = '__secondary__'
  const existing = apps.find(a => a.name === name)
  const secondaryApp = existing ?? initializeApp(baseApp.options, name)
  return getAuth(secondaryApp)
}

export const useUser = () => {
  const config = useRuntimeConfig()
  const clientName = config.public.clientName || 'alinayah'
  
  const loading = vRef(false)
  const error = vRef<string | null>(null)
  const rows = vRef<UserRow[]>([])
  const createdTempPassword = vRef<string>('')

  const { $realtimeDb, $auth, $secondaryAuth } = useNuxtApp() as any

  // READ
  async function fetchUsers() {
    loading.value = true
    error.value = null
    try {
      const snap = await get(child(dbRef($realtimeDb), `${clientName}/users`))
      const val = snap.val() || {}
      const list: UserRow[] = Object.entries<any>(val).map(([uid, u]) => ({
        uid,
        displayName: String(u.displayName ?? '').trim() || '(tanpa nama)',
        email: u.email || undefined,
        phone: u.phone || undefined,
        role: (u.role as AppRole) ?? 'wali',
        isActive: u.isActive !== false,
        allowedRoutes: Array.isArray(u.allowedRoutes) ? u.allowedRoutes.filter((p: string) => typeof p === 'string') : undefined,
        createdAt: Number(u.createdAt ?? now()),
        updatedAt: Number(u.updatedAt ?? u.createdAt ?? now()),
      }))
      const roleRank: Record<AppRole, number> = { admin: 0, pengurus: 1, wali: 2 }
      rows.value = list.sort((a, b) =>
        roleRank[a.role] - roleRank[b.role] || a.displayName.localeCompare(b.displayName, 'id'))
    } catch (e: any) {
      console.error(e)
      error.value = e?.message ?? 'Gagal memuat data user'
    } finally {
      loading.value = false
    }
  }

  // CREATE
  async function createUserProfile(opts: {
    displayName: string
    email?: string
    phone?: string
    role: AppRole
    createAuth?: boolean
    password?: string
    allowedRoutes?: string[]
  }) {
    loading.value = true
    error.value = null
    createdTempPassword.value = ''

    try {
      const {
        displayName,
        email,
        phone,
        role,
        createAuth,
        password: inputPassword,
        allowedRoutes
      } = opts

      let uid = ''
      let loginEmail = String(email || '').trim().toLowerCase()

      if (!loginEmail && phone) {
        loginEmail = phoneToEmail(phone).toLowerCase()
      }

      const authForCreate = $secondaryAuth || ensureSecondaryAuth($auth)
      const password = inputPassword?.trim()?.length
        ? inputPassword.trim()
        : generatePassword(12)

      let authMode: 'created' | 'synced-existing' | 'profile-only' = 'profile-only'

      if (createAuth && loginEmail) {
        try {
          const cred = await createUserWithEmailAndPassword(authForCreate, loginEmail, password)

          await updateProfile(cred.user, { displayName })

          uid = cred.user.uid
          createdTempPassword.value = password
          authMode = 'created'

          await authForCreate.signOut().catch(() => {})
        } catch (e: any) {
          const code = String(e?.code || '')
          const message = String(e?.message || '')

          const isEmailAlreadyUsed =
            code === 'auth/email-already-in-use' ||
            message.includes('email-already-in-use')

          if (!isEmailAlreadyUsed) {
            throw e
          }

          if (!inputPassword?.trim()) {
            throw new Error(
              `Email ${loginEmail} sudah ada di Firebase Auth, tetapi belum ada di database users. Karena tidak memakai server/Admin SDK, masukkan password lama akun tersebut untuk sinkron UID ke RTDB, atau kirim reset password dulu.`
            )
          }

          try {
            const existingCred = await signInWithEmailAndPassword(
              authForCreate,
              loginEmail,
              inputPassword.trim()
            )

            uid = existingCred.user.uid
            authMode = 'synced-existing'

            await updateProfile(existingCred.user, { displayName }).catch(() => {})
            await authForCreate.signOut().catch(() => {})
          } catch (signInError: any) {
            const signInCode = String(signInError?.code || '')

            if (
              signInCode === 'auth/wrong-password' ||
              signInCode === 'auth/invalid-credential' ||
              signInCode === 'auth/invalid-login-credentials'
            ) {
              throw new Error(
                `Email ${loginEmail} memang sudah ada di Firebase Auth, tetapi password yang dimasukkan tidak cocok. Gunakan password lama yang benar atau reset password terlebih dahulu.`
              )
            }

            throw signInError
          }
        }
      } else {
        uid = crypto.randomUUID()
        authMode = 'profile-only'
      }

      if (!uid) {
        throw new Error('UID gagal dibuat atau disinkronkan.')
      }

      const profile: UserRow = {
        uid,
        displayName: String(displayName || '').trim(),
        email: loginEmail,
        phone,
        role,
        isActive: true,
        allowedRoutes: Array.isArray(allowedRoutes) && allowedRoutes.length
          ? allowedRoutes
          : ROLE_DEFAULT_ROUTES[role],
        createdAt: now(),
        updatedAt: now()
      }

      await set(dbRef($realtimeDb, `${clientName}/users/${uid}`), profile)

      if (authMode === 'synced-existing') {
        createdTempPassword.value = ''
      }

      return profile
    } catch (e: any) {
      const message = String(e?.message || 'Gagal membuat user')
      error.value = message
      throw e
    } finally {
      loading.value = false
    }
  }

  // UPDATE
  async function updateUser(uid: string, patch: Partial<Omit<UserRow, 'uid' | 'createdAt'>>) {
    loading.value = true
    error.value = null
    try {
      const payload = { ...patch, updatedAt: now() }
      await update(dbRef($realtimeDb, `${clientName}/users/${uid}`), payload as any)
    } catch (e: any) {
      console.error(e)
      error.value = e?.message ?? 'Gagal memperbarui user'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function setRole(uid: string, role: AppRole, resetToRoleDefaults = true) {
    const patch: any = { role, updatedAt: now() }
    if (resetToRoleDefaults) patch.allowedRoutes = ROLE_DEFAULT_ROUTES[role]
    await update(dbRef($realtimeDb, `${clientName}/users/${uid}`), patch)
  }
  async function setAllowedRoutes(uid: string, routes: string[]) {
    await update(dbRef($realtimeDb, `${clientName}/users/${uid}`), { allowedRoutes: routes, updatedAt: now() })
  }
  async function setActive(uid: string, isActive: boolean) {
    await update(dbRef($realtimeDb, `${clientName}/users/${uid}`), { isActive, updatedAt: now() })
  }

  // DELETE (soft)
  async function deleteUserSoft(uid: string) {
    await update(dbRef($realtimeDb, `${clientName}/users/${uid}`), {
      isActive: false,
      allowedRoutes: [],
      updatedAt: now(),
      deletedAt: now(),
    })
  }

  // DELETE (permanent) — menghapus catatan profil di Realtime DB
  async function deleteUserPermanent(uid: string) {
    // Jika ada data turunan yang perlu dibersihkan, hapus juga di sini:
    // await remove(dbRef($realtimeDb, `${clientName}/userSessions/${uid}`))
    // await remove(dbRef($realtimeDb, `${clientName}/userLogs/${uid}`))
    await remove(dbRef($realtimeDb, `${clientName}/users/${uid}`))
    // Catatan: ini TIDAK menghapus akun Firebase Auth user tsb.
    // Untuk juga menghapus akun Auth, gunakan Cloud Function (Admin SDK) yang dipicu dengan request admin.
  }

  // Password reset (Auth)
  async function sendReset(email: string) {
    const a = getAuth()
    await sendPasswordResetEmail(a, email)
  }

  // Akses sidebar
  function hasAccess(path: string, user?: UserRow | null) {
    if (!user || user.isActive === false) return false
    const allow = user.allowedRoutes?.length ? user.allowedRoutes : ROLE_DEFAULT_ROUTES[user.role]
    return !!allow.find(p => p === path)
  }

  function filterSidebarByAccess(groups: SidebarGroup[], user?: UserRow | null): SidebarGroup[] {
    const out: SidebarGroup[] = []
    for (const g of groups) {
      const items = g.items.filter(it => hasAccess(it.href, user))
      if (items.length) out.push({ ...g, items })
    }
    return out
  }

  // Download credential
  function downloadPasswordFile(username: string, password: string) {
    const blob = new Blob(
      [
        `Akun Akses Sistem\n`,
        `=================\n`,
        `Username : ${username}\n`,
        `Password : ${password}\n`,
        `Tanggal  : ${new Date().toLocaleString('id-ID')}\n`,
      ],
      { type: 'text/plain;charset=utf-8' }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'akun-user.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const total = computed(() => rows.value.length)

  return {
    rows, loading, error, total, createdTempPassword,
    fetchUsers, createUserProfile, updateUser,
    deleteUserSoft, deleteUserPermanent,   // <— NEW export
    setRole, setAllowedRoutes, setActive, sendReset,
    ALL_SIDEBAR_GROUPS, ALL_ROUTE_PATHS, ROLE_DEFAULT_ROUTES,
    hasAccess, filterSidebarByAccess,
    downloadPasswordFile,
  }
}
