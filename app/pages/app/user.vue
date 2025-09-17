<template>
  <div class="space-y-4 p-6">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Manajemen User</h1>
      <div class="flex items-center gap-2">
        <button @click="openCreate" class="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">
          + Tambah User
        </button>
        <button @click="fetchUsers" class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
          Muat Ulang
        </button>
      </div>
    </div>

    <div v-if="error" class="p-3 rounded border border-rose-200 bg-rose-50 text-rose-700 text-sm dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300">
      {{ error }}
    </div>
    <div v-if="loading" class="text-sm text-gray-500">Memuat data...</div>

    <DataTable
      v-else
      title="Semua User"
      :rows="rows"
      :show-actions="true"
      :columns="columns"
      :rowKey="(r) => r.uid"
    >
      <template #cell-role="{ row }">
        <select
          class="text-sm rounded border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-1"
          :value="row.role"
          @change="onChangeRole(row, ($event.target as HTMLSelectElement).value as any)"
        >
          <option value="admin">Admin</option>
          <option value="pengurus">Pengurus</option>
          <option value="wali">Wali</option>
        </select>
      </template>

      <template #cell-isActive="{ row }">
        <button
          @click="toggleActive(row)"
          class="text-xs px-2 py-1 rounded"
          :class="row.isActive ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'"
        >
          {{ row.isActive ? 'Aktif' : 'Non-aktif' }}
        </button>
      </template>

      <template #cell-allowedRoutes="{ row }">
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-600 dark:text-neutral-300">{{ (row.allowedRoutes?.length ?? defaultRoleCount(row.role)) }} Akses</span>
          <button
            @click="openAccess(row)"
            class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800"
          >
            Kelola
          </button>
        </div>
      </template>

      <template #cell-action="{ row }">
        <div class="flex items-center gap-2">
          <button @click="openEdit(row)" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Edit</button>
          <button @click="openReset(row)" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20">Reset Password</button>
          <button @click="openDelete(row)" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">Hapus</button>
          <button @click="openDeletePermanent(row)" class="text-xs px-2 py-1 rounded border border-rose-200 text-white bg-rose-600 hover:bg-rose-700">Hapus Permanen</button>
        </div>
      </template>
    </DataTable>

    <!-- Modal Create/Edit -->
    <ModalShell v-model="showForm" :title="formMode==='create'?'Tambah User':'Ubah User'">
      <form class="space-y-3" @submit.prevent="submitForm">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Nama</label>
            <input v-model.trim="form.displayName" required class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Email (login)</label>
            <input v-model.trim="form.email" type="email" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">No HP</label>
            <input v-model.trim="form.phone" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Role</label>
            <select v-model="form.role" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
              <option value="admin">Admin</option>
              <option value="pengurus">Pengurus</option>
              <option value="wali">Wali</option>
            </select>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-1" v-if="formMode==='create'">
          <input id="create-auth" type="checkbox" v-model="form.createAuth" class="rounded border-gray-300" />
          <label for="create-auth" class="text-sm text-gray-700 dark:text-neutral-200">Buat akun Auth sekarang (disarankan)</label>
        </div>

        <!-- Password (opsional) saat create + createAuth -->
        <div v-if="formMode==='create' && form.createAuth">
          <label class="text-xs text-gray-600 dark:text-neutral-300">Password (opsional)</label>
          <div class="relative mt-1">
            <input
              v-model.trim="form.password"
              :type="showPass ? 'text' : 'password'"
              placeholder="Kosongkan untuk auto-generate (12 karakter)"
              class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700 pr-10"
            />
            <button type="button" @click="showPass = !showPass" class="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600">
              <Icon :icon="showPass ? 'ph:eye-slash' : 'ph:eye'" class="size-5" />
            </button>
          </div>
          <p class="text-[11px] text-gray-500 mt-1">Jika dikosongkan, sistem akan membuat password acak 12 karakter.</p>
        </div>

        <p v-if="formError" class="text-sm text-rose-600">{{ formError }}</p>

        <div v-if="createdTempPassword" class="p-3 rounded border border-emerald-200 bg-emerald-50 text-sm dark:border-emerald-900/40 dark:bg-emerald-900/10">
          <div><strong>Password sementara:</strong> <code>{{ createdTempPassword }}</code></div>
          <div class="mt-2">
            <button type="button" @click="downloadCred()" class="text-xs px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700">Download credential</button>
          </div>
        </div>
      </form>

      <template #footer>
        <button @click="showForm=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="saving" @click="submitForm" class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
          {{ saving ? 'Menyimpan…' : (formMode==='create' ? 'Simpan' : 'Update') }}
        </button>
      </template>
    </ModalShell>

    <!-- Modal Akses -->
    <ModalShell v-model="showAccess" title="Kelola Hak Akses">
      <div class="space-y-3">
        <div class="flex items-center gap-2 flex-wrap">
          <button @click="applyRoleDefault()" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Gunakan Default Role</button>
          <button @click="selectAll()" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Pilih Semua</button>
          <button @click="clearAll()" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Kosongkan</button>
        </div>

        <div class="max-h-[50vh] overflow-auto rounded border border-gray-200 dark:border-neutral-800">
          <div v-for="g in groups" :key="g.title" class="border-b last:border-b-0 border-gray-200 dark:border-neutral-800">
            <div class="px-3 py-2 font-semibold text-sm bg-gray-50 dark:bg-neutral-900/50">{{ g.title }}</div>
            <div class="grid sm:grid-cols-2 gap-2 p-3">
              <label v-for="it in g.items" :key="it.href" class="flex items-center gap-2 text-sm">
                <input type="checkbox" class="rounded border-gray-300"
                       :value="it.href"
                       v-model="accessBuffer"/>
                <span>{{ it.label }} <span class="text-xs text-gray-500">({{ it.href }})</span></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <button @click="showAccess=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="savingAccess" @click="saveAccess" class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
          {{ savingAccess ? 'Menyimpan…' : 'Simpan Akses' }}
        </button>
      </template>
    </ModalShell>

    <!-- Modal Reset -->
    <ModalShell v-model="showReset" title="Reset Password">
      <div class="space-y-2 text-sm">
        <p>Kirim tautan reset password ke email:</p>
        <p class="font-semibold">{{ current?.email || '—' }}</p>
        <p v-if="!current?.email" class="text-amber-600">User ini tidak punya email login.</p>
      </div>
      <template #footer>
        <button @click="showReset=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="resetting || !current?.email" @click="doReset" class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
          {{ resetting ? 'Mengirim…' : 'Kirim Email Reset' }}
        </button>
      </template>
    </ModalShell>

    <!-- Modal Hapus (soft) -->
    <ModalShell v-model="showDelete" title="Hapus User (Soft)">
      <p class="text-sm text-gray-700 dark:text-neutral-200">
        Non-aktifkan akses untuk <strong>{{ current?.displayName }}</strong>?
      </p>
      <template #footer>
        <button @click="showDelete=false" class="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="deleting" @click="confirmDeleteSoft" class="px-3 py-1.5 rounded bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-60">
          {{ deleting ? 'Menghapus…' : 'Non-aktifkan' }}
        </button>
      </template>
    </ModalShell>

    <!-- Modal Hapus Permanen -->
    <ModalShell v-model="showDeletePermanent" title="Hapus Permanen User">
      <div class="space-y-3 text-sm">
        <p class="text-rose-600 dark:text-rose-400"><strong>Peringatan:</strong> Tindakan ini akan menghapus data user dari database secara permanen dan tidak bisa dibatalkan.</p>
        <p>Nama: <strong>{{ current?.displayName }}</strong></p>
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="confirmPermanent" class="rounded border-gray-300" />
          <span>Saya paham, hapus permanen user ini.</span>
        </label>
      </div>
      <template #footer>
        <button @click="showDeletePermanent=false" class="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="deleting || !confirmPermanent" @click="confirmDeleteHard" class="px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60">
          {{ deleting ? 'Menghapus…' : 'Hapus Permanen' }}
        </button>
      </template>
    </ModalShell>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Icon } from '@iconify/vue'
import DataTable from '~/components/widget/DataTable.vue'
import ModalShell from '~/components/widget/ModalShell.vue'
import { useUser, type UserRow, ROLE_DEFAULT_ROUTES, ALL_SIDEBAR_GROUPS } from '~/composables/data/useUser'

definePageMeta({ layout: 'app', layoutProps: { title: 'Hak Akses' } })

const {
  rows, loading, error, fetchUsers,
  createUserProfile, updateUser, deleteUserSoft, deleteUserPermanent,
  setRole, setAllowedRoutes, setActive,
  sendReset, downloadPasswordFile, createdTempPassword
} = useUser()

onMounted(fetchUsers)

const columns = [
  { key: 'displayName', label: 'Nama', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'phone', label: 'No HP', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'isActive', label: 'Status', sortable: true },
  { key: 'allowedRoutes', label: 'Akses Sidebar' },
]

// ---------- Create/Edit ----------
const showForm = ref(false)
const formMode = ref<'create'|'edit'>('create')
const saving = ref(false)
const formError = ref<string | null>(null)
const current = ref<UserRow | null>(null)
const showPass = ref(false)

const form = reactive<{
  displayName: string
  email?: string
  phone?: string
  role: 'admin'|'pengurus'|'wali'
  createAuth: boolean
  password?: string
}>({
  displayName: '',
  email: '',
  phone: '',
  role: 'wali',
  createAuth: true,
  password: ''
})

function defaultRoleCount(role: 'admin'|'pengurus'|'wali') {
  return ROLE_DEFAULT_ROUTES[role].length
}

function resetForm() {
  form.displayName = ''
  form.email = ''
  form.phone = ''
  form.role = 'wali'
  form.createAuth = true
  form.password = ''
  formError.value = null
}

function openCreate() {
  formMode.value = 'create'
  resetForm()
  showForm.value = true
}

function openEdit(row: UserRow) {
  formMode.value = 'edit'
  current.value = row
  form.displayName = row.displayName
  form.email = row.email
  form.phone = row.phone
  form.role = row.role
  form.createAuth = false
  form.password = ''
  formError.value = null
  showForm.value = true
}

async function submitForm() {
  if (!form.displayName?.trim()) {
    formError.value = 'Nama wajib diisi.'
    return
  }
  saving.value = true
  try {
    if (formMode.value === 'create') {
      await createUserProfile({
        displayName: form.displayName.trim(),
        email: form.email?.trim() || undefined,
        phone: form.phone?.trim() || undefined,
        role: form.role,
        createAuth: !!form.createAuth,
        password: form.password?.trim() || undefined
      })
      await fetchUsers()
    } else if (current.value?.uid) {
      await updateUser(current.value.uid, {
        displayName: form.displayName.trim(),
        email: form.email?.trim(),
        phone: form.phone?.trim(),
        role: form.role
      })
      await fetchUsers()
    }
    showForm.value = false
  } catch (e: any) {
    formError.value = e?.message ?? 'Gagal menyimpan'
  } finally {
    saving.value = false
  }
}

function downloadCred() {
  const username = form.email?.trim() || form.phone?.trim() || '(username)'
  if (!username || !createdTempPassword.value) return
  downloadPasswordFile(username, createdTempPassword.value)
}

// ---------- Role & Active ----------
async function onChangeRole(row: UserRow, role: 'admin'|'pengurus'|'wali') {
  await setRole(row.uid, role, true)
  await fetchUsers()
}
async function toggleActive(row: UserRow) {
  await setActive(row.uid, !row.isActive)
  await fetchUsers()
}

// ---------- Akses Sidebar ----------
const showAccess = ref(false)
const savingAccess = ref(false)
const groups = ALL_SIDEBAR_GROUPS
const accessBuffer = ref<string[]>([])

function openAccess(row: UserRow) {
  current.value = row
  const routes = row.allowedRoutes?.length ? row.allowedRoutes : ROLE_DEFAULT_ROUTES[row.role]
  accessBuffer.value = [...routes]
  showAccess.value = true
}
function selectAll() { accessBuffer.value = groups.flatMap(g => g.items.map(i => i.href)) }
function clearAll() { accessBuffer.value = [] }
function applyRoleDefault() {
  if (!current.value) return
  accessBuffer.value = [...ROLE_DEFAULT_ROUTES[current.value.role]]
}
async function saveAccess() {
  if (!current.value) return
  savingAccess.value = true
  try {
    await setAllowedRoutes(current.value.uid, [...new Set(accessBuffer.value)])
    await fetchUsers()
    showAccess.value = false
  } finally {
    savingAccess.value = false
  }
}

const showReset = ref(false)
const resetting = ref(false)
function openReset(row: UserRow) {
  current.value = row
  showReset.value = true
}
async function doReset() {
  if (!current.value?.email) return
  resetting.value = true
  try {
    await sendReset(current.value.email)
    showReset.value = false
  } finally {
    resetting.value = false
  }
}

const showDelete = ref(false)
const deleting = ref(false)
function openDelete(row: UserRow) {
  current.value = row
  showDelete.value = true
}
async function confirmDeleteSoft() {
  if (!current.value?.uid) return
  deleting.value = true
  try {
    await deleteUserSoft(current.value.uid)
    await fetchUsers()
    showDelete.value = false
  } finally {
    deleting.value = false
  }
}

const showDeletePermanent = ref(false)
const confirmPermanent = ref(false)
function openDeletePermanent(row: UserRow) {
  current.value = row
  confirmPermanent.value = false
  showDeletePermanent.value = true
}
async function confirmDeleteHard() {
  if (!current.value?.uid) return
  deleting.value = true
  try {
    await deleteUserPermanent(current.value.uid)
    await fetchUsers()
    showDeletePermanent.value = false
  } finally {
    deleting.value = false
  }
}
</script>
