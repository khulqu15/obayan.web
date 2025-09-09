<template>
  <div class="space-y-4 p-6">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Data Santri</h1>
      <div class="flex items-center gap-2">
        <button @click="openCreate()" class="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">
          + Tambah Santri
        </button>
        <input type="file" ref="fileInput" class="hidden" accept=".xlsx,.xls,.csv" @change="handleImport" />
        <button @click="triggerImport" class="text-xs px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700">
            Import Excel
        </button>
        <button @click="reload" class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
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
      title="Santri & Wali"
      :rows="rows"
      :columns="columns"
      :rowKey="(r) => r.id"
    >
      <template #cell-nohp="{ row }">
        <a v-if="row.nohp" :href="`tel:${row.nohp}`" class="text-blue-600 hover:underline">{{ row.nohp }}</a>
        <span v-else class="text-gray-400">-</span>
      </template>

      <template #cell-kuotaKunjunganBulanIni="{ row }">
        <span
          :class="[
            'text-xs px-2 py-0.5 rounded',
            (row.kuotaKunjunganBulanIni ?? 0) > 0
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
          ]"
        >
          {{ row.kuotaKunjunganBulanIni ?? 0 }}x / bulan ini
        </span>
      </template>

      <template #cell-kamar="{row}">
        {{ row.kamar }} - {{ row.maskan }}
      </template>

      <template #cell-action="{ row }">
        <div class="flex items-center gap-2">
          <button @click="openEdit(row)" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Edit</button>
          <button @click="openConfirm(row)" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">Hapus</button>
        </div>
      </template>
    </DataTable>

    <ModalShell v-model="showForm" :title="formMode === 'create' ? 'Tambah Santri' : 'Ubah Santri'">
      <form class="space-y-3" @submit.prevent="submitForm">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Gen</label>
            <input v-model.trim="form.gen" required class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" placeholder="mis. 2024"/>
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Nama Santri</label>
            <input v-model.trim="form.santri" required class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Wali Santri</label>
            <input v-model.trim="form.walisantri" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">No HP Wali</label>
            <input v-model.trim="form.nohp" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Kuota Kunjungan</label>
            <input v-model.number="form.kuotaKunjunganBulanIni" type="number" min="0" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Kamar</label>
            <input v-model.trim="form.kamar" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Jenjang</label>
            <input v-model.trim="form.jenjang" placeholder="KMI / MTs / MA / ..." class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Status</label>
            <select
              v-model="form.status"
              class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"
            >
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
              <option value="lulus">Lulus</option>
              <option value="cuti">Cuti</option>
            </select>
          </div>
          <div class="sm:col-span-2">
            <label class="text-xs text-gray-600 dark:text-neutral-300">Alamat</label>
            <textarea
              v-model.trim="form.alamat"
              rows="2"
              class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"
              placeholder="Alamat lengkap wali/santri"
            />
          </div>
        </div>

        <p v-if="formError" class="text-sm text-rose-600">{{ formError }}</p>
      </form>

      <template #footer>
        <button @click="showForm=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="saving" @click="submitForm" class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
          {{ saving ? 'Menyimpan…' : (formMode==='create' ? 'Simpan' : 'Update') }}
        </button>
      </template>
    </ModalShell>

    <ModalShell v-model="showConfirm" title="Hapus Data">
      <p class="text-sm text-gray-700 dark:text-neutral-200">
        Apakah Anda yakin ingin menghapus data santri
        <strong>{{ current?.santri }}</strong>? Tindakan ini tidak dapat dibatalkan.
      </p>
      <template #footer>
        <button @click="showConfirm=false" class="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="deleting" @click="confirmDelete" class="px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60">
          {{ deleting ? 'Menghapus…' : 'Hapus' }}
        </button>
      </template>
    </ModalShell>

    <ModalShell v-model="showProgress" title="Import Data Santri">
        <div class="space-y-3">
            <div class="w-full bg-gray-200 dark:bg-neutral-800 rounded h-3 overflow-hidden">
                <div class="bg-blue-600 h-3 transition-all duration-300" :style="{ width: progress+'%' }"></div>
            </div>
            <p class="text-sm text-gray-700 dark:text-neutral-200">{{ progressStatus }}</p>
        </div>

        <template #footer>
            <button
            @click="showProgress=false"
            class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-800"
            :disabled="progress < 100"
            >
            Tutup
            </button>
        </template>
    </ModalShell>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import DataTable from '~/components/widget/DataTable.vue'
import ModalShell from '~/components/widget/ModalShell.vue'
import { useSantri, type SantriRow } from '~/composables/data/useSantri'


definePageMeta({ layout: 'app', layoutProps: { title: 'Santri' } })

const { rows, loading, error, fetchSantri, createSantri, updateSantri, deleteSantri, importFromExcelWithProgress } = useSantri()
const fileInput = ref<HTMLInputElement | null>(null)

const columns = [
  { key: 'gen', label: 'Gen', sortable: true },
  { key: 'santri', label: 'Santri', sortable: true },
  { key: 'walisantri', label: 'Wali Santri', sortable: true },
  { key: 'nohp', label: 'No. HP Wali', sortable: true },
  { key: 'kuotaKunjunganBulanIni', label: 'Kuota Kunjungan (bln ini)', sortable: true },
  { key: 'kamar', label: 'Kamar', sortable: true },
  { key: 'alamat', label: 'Alamat', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'jenjang', label: 'Jenjang', sortable: true },
]

onMounted(fetchSantri)
const reload = () => fetchSantri()

function triggerImport() {
    fileInput.value?.click()
}
const showProgress = ref(false)
const progress = ref(0)
const progressStatus = ref("")

async function handleImport(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return

  showProgress.value = true
  progress.value = 0
  progressStatus.value = "Menyiapkan import..."

  await importFromExcelWithProgress(input.files[0]!, (percent, status) => {
    progress.value = percent
    progressStatus.value = status
  })

  input.value = ""
  await fetchSantri()
}

const showForm = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const saving = ref(false)
const formError = ref<string | null>(null)
const current = ref<SantriRow | null>(null)
const form = reactive<Omit<SantriRow, 'id'>>({
  gen: '',
  santri: '',
  walisantri: '',
  nohp: '',
  kuotaKunjunganBulanIni: 0,
  kamar: '',
  jenjang: '',
  alamat: '',
  status: 'aktif'
})

function resetForm() {
  form.gen = ''
  form.santri = ''
  form.walisantri = ''
  form.nohp = ''
  form.kuotaKunjunganBulanIni = 0
  form.kamar = ''
  form.jenjang = ''
  form.alamat = ''
  form.status = 'aktif'
  formError.value = null
}

function openCreate() {
  formMode.value = 'create'
  resetForm()
  showForm.value = true
}

function openEdit(row: SantriRow) {
  formMode.value = 'edit'
  current.value = row
  form.gen = row.gen || ''
  form.santri = row.santri
  form.walisantri = row.walisantri || ''
  form.nohp = row.nohp || ''
  form.kuotaKunjunganBulanIni = row.kuotaKunjunganBulanIni ?? 0
  form.kamar = row.kamar || ''
  form.jenjang = row.jenjang || ''
  form.alamat = row.alamat || ''
  form.status = (row.status as any) || 'aktif'
  formError.value = null
  showForm.value = true
}

async function submitForm() {
  if (!form.santri?.trim()) {
    formError.value = 'Nama santri wajib diisi.'
    return
  }
  if (!form.gen?.trim()) {
    formError.value = 'Gen wajib diisi.'
    return
  }
  saving.value = true
  try {
    if (formMode.value === 'create') {
      await createSantri({ ...form })
    } else if (current.value?.id) {
      await updateSantri(current.value.id, { ...form })
    }
    showForm.value = false
  } catch (e: any) {
    formError.value = e?.message ?? 'Gagal menyimpan data'
  } finally {
    saving.value = false
  }
}

const showConfirm = ref(false)
const deleting = ref(false)
function openConfirm(row: SantriRow) {
  current.value = row
  showConfirm.value = true
}
async function confirmDelete() {
  if (!current.value?.id) return
  deleting.value = true
  try {
    await deleteSantri(current.value.id)
    showConfirm.value = false
  } catch (e) {
  } finally {
    deleting.value = false
  }
}
</script>
