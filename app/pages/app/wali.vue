<template>
  <section class="p-6 space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-semibold">Data Wali / Orang Tua</h1>
      <button @click="reloadWali" class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
        Muat Ulang
      </button>
    </div>

    <!-- Pakai DataTable -->
    <DataTable
      title="Wali & Santri (Grouped)"
      :rows="waliRows"
      :columns="columns"
      :rowKey="(w) => w.id"
      :show-actions="true"
    >
      <!-- Waliname -->
      <template #cell-waliname="{ row: w }">
        <div class="font-medium">{{ w.waliname || 'Tidak diketahui' }}</div>
      </template>

      <!-- No HP (WA link) -->
      <template #cell-nohp="{ row: w }">
        <a
          v-if="w.nohp"
          :href="waUrl(w.nohp)"
          target="_blank"
          class="inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-900/40 dark:bg-gray-900/20 dark:text-gray-200"
        >
          <Icon icon="ri:whatsapp-fill" width="16" height="16" />
            {{ isMobile ? 'Lihat' : (expanded.has(w.id) ? 'Sembunyikan' : 'Tampilkan') }} ({{ w.santri.length }})
        </a>
        <span v-else class="text-gray-400">-</span>
      </template>

      <!-- Alamat -->
      <template #cell-alamat="{ row: w }">
        <span class="line-clamp-2">{{ w.alamat || '-' }}</span>
      </template>

      <!-- Santri (toggle + nested table di dalam cell) -->
      <template #cell-santri="{ row: w }">
        <button
          @click="openSantriList(w)"
          class="text-xs px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          {{ expanded.has(w.id) ? 'Sembunyikan' : 'Tampilkan' }} ({{ w.santri.length }})
        </button>

        <div v-show="expanded.has(w.id)" class="mt-2 rounded-lg border border-gray-200 dark:border-neutral-700 overflow-hidden hidden sm:block">
          <div class="bg-gray-50 dark:bg-neutral-900/40 px-3 py-2 font-medium">
            Santri dari Bapak/Ibu {{ w.waliname }}
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full text-xs">
              <thead>
                <tr class="text-left">
                  <th class="px-3 py-2">Nama</th>
                  <th class="px-3 py-2">Gen</th>
                  <th class="px-3 py-2">Jenjang</th>
                  <th class="px-3 py-2">Status</th>
                  <th class="px-3 py-2">Kamar</th>
                  <th class="px-3 py-2">Maskan</th>
                  <th class="px-3 py-2 w-32">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-neutral-800">
                <tr v-for="s in w.santri" :key="s.id">
                  <td class="px-3 py-2">{{ s.name }}</td>
                  <td class="px-3 py-2">{{ s.gen || '-' }}</td>
                  <td class="px-3 py-2">{{ s.jenjang || '-' }}</td>
                  <td class="px-3 py-2">{{ s.status || '-' }}</td>
                  <td class="px-3 py-2">{{ s.kamar || '-' }}</td>
                  <td class="px-3 py-2">{{ s.maskan || '-' }}</td>
                  <td class="px-3 py-2">
                    <div class="flex items-center gap-1">
                      <button @click="openSantriEdit(s.id)" class="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800"> 
                        Edit
                      </button>
                      <button @click="openSantriDelete(s.id)" class="px-2 py-1 rounded border border-gray-200 text-rose-600 hover:bg-rose-50 dark:border-neutral-700 dark:hover:bg-rose-900/20">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!w.santri.length">
                  <td colspan="7" class="px-3 py-3 text-gray-500">Tidak ada santri.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <template #cell-action="{ row: w }">
        <a
          v-if="w.nohp"
          :href="waUrl(w.nohp, `Assalamu'alaikum, Bapak/Ibu ${w.waliname} ...`)"
          target="_blank"
          class="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Chat
        </a>
      </template>
    </DataTable>

    <ModalShell v-model="showSantriModal" :title="activeWali ? `Santri dari Bapak/Ibu ${activeWali.waliname}` : 'Santri'">
        <div v-if="activeWali" class="overflow-x-auto -mx-1">
            <table class="min-w-full text-xs">
                <thead>
                    <tr class="text-left">
                    <th class="px-3 py-2">Nama</th>
                    <th class="px-3 py-2">Gen</th>
                    <th class="px-3 py-2">Jenjang</th>
                    <th class="px-3 py-2">Status</th>
                    <th class="px-3 py-2">Kamar</th>
                    <th class="px-3 py-2">Maskan</th>
                    <th class="px-3 py-2 w-32">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-neutral-800">
                    <tr v-for="s in activeWali.santri" :key="s.id">
                    <td class="px-3 py-2">{{ s.name }}</td>
                    <td class="px-3 py-2">{{ s.gen || '-' }}</td>
                    <td class="px-3 py-2">{{ s.jenjang || '-' }}</td>
                    <td class="px-3 py-2">{{ s.status || '-' }}</td>
                    <td class="px-3 py-2">{{ s.kamar || '-' }}</td>
                    <td class="px-3 py-2">{{ s.maskan || '-' }}</td>
                    <td class="px-3 py-2">
                        <div class="flex items-center gap-1">
                        <button
                            @click="openSantriEdit(s.id)"
                            class="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                        >
                            Edit
                        </button>
                        <button
                            @click="openSantriDelete(s.id)"
                            class="px-2 py-1 rounded border border-gray-200 text-rose-600 hover:bg-rose-50 dark:border-neutral-700 dark:hover:bg-rose-900/20"
                        >
                            Hapus
                        </button>
                        </div>
                    </td>
                    </tr>
                    <tr v-if="!activeWali.santri.length">
                        <td colspan="7" class="px-3 py-3 text-gray-500">Tidak ada santri.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <template #footer>
            <button @click="showSantriModal=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
            Tutup
            </button>
        </template>
    </ModalShell>

    <ModalShell v-model="showSantriForm" :title="santriFormMode === 'edit' ? 'Ubah Santri' : 'Tambah Santri'">
      <form class="space-y-3" @submit.prevent="submitSantriForm">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Nama Santri</label>
            <input v-model.trim="santriForm.santri" required class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Gen</label>
            <input v-model.trim="santriForm.gen" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Jenjang</label>
            <input v-model.trim="santriForm.jenjang" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Status</label>
            <input v-model.trim="santriForm.status" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Kamar</label>
            <input v-model.trim="santriForm.kamar" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Maskan</label>
            <input v-model.trim="santriForm.maskan" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
        </div>
        <p v-if="santriFormError" class="text-sm text-rose-600">{{ santriFormError }}</p>
      </form>
      <template #footer>
        <button @click="showSantriForm=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="santriSaving" @click="submitSantriForm" class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
          {{ santriSaving ? 'Menyimpan…' : 'Simpan' }}
        </button>
      </template>
    </ModalShell>

    <ModalShell v-model="showSantriDelete" title="Hapus Data Santri">
      <p class="text-sm text-gray-700 dark:text-neutral-200">
        Apakah Anda yakin ingin menghapus santri <strong>{{ santriCurrent?.santri }}</strong>? Tindakan ini tidak dapat dibatalkan.
      </p>
      <template #footer>
        <button @click="showSantriDelete=false" class="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="santriDeleting" @click="confirmSantriDelete" class="px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60">
          {{ santriDeleting ? 'Menghapus…' : 'Hapus' }}
        </button>
      </template>
    </ModalShell>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'
import DataTable from '~/components/widget/DataTable.vue'
import ModalShell from '~/components/widget/ModalShell.vue'
import { useWali } from '~/composables/data/useWali'
import { useSantri, type SantriRow } from '~/composables/data/useSantri'

definePageMeta({ layout: 'app', layoutProps: { title: 'Wali Santri' } })

// Data
const { rows: waliRowsRef, fetchWali } = useWali()
const waliRows = computed(() => waliRowsRef.value)
const { rows: santriRows, fetchSantri, updateSantri, deleteSantri } = useSantri()

onMounted(async () => {
  await Promise.all([fetchSantri(), fetchWali()])
})

// DataTable columns
const columns = [
  { key: 'waliname', label: 'Waliname', sortable: true },
  { key: 'nohp', label: 'No HP', sortable: true },
  { key: 'alamat', label: 'Alamat', sortable: true },
  { key: 'santri', label: 'Santri' },  // berisi toggle + nested table
]

// Collapse state per wali
const expanded = ref<Set<string>>(new Set())
function toggleExpand(id: string) {
  const s = new Set(expanded.value)
  s.has(id) ? s.delete(id) : s.add(id)
  expanded.value = s
}
const isMobile = ref(false)
const showSantriModal = ref(false)
const activeWali = ref<any | null>(null)

// WA utils (robust sanitizer)
function sanitizePhoneID(input: string): string {
  const raw = (input ?? '').trim()
  let digits = raw.replace(/[^\d]/g, '')
  if (!digits) return ''
  if (digits.startsWith('0062')) digits = '62' + digits.slice(4)
  if (digits.startsWith('62')) return digits[2] === '0' ? '62' + digits.slice(3) : digits
  if (digits.startsWith('8')) {
    const idx = digits.indexOf('628')
    return idx > 0 ? digits.slice(idx) : '62' + digits
  }
  if (digits.startsWith('0')) return '62' + digits.slice(1)
  if (digits.startsWith('00')) return digits.slice(2)
  return digits
}
function waUrl(p: string, text?: string) {
  const num = sanitizePhoneID(p)
  if (!num) return '#'
  const q = text ? `?text=${encodeURIComponent(text)}` : ''
  return `https://wa.me/${num}${q}`
}
function displayPhone(p: string) { return p }

// ---------- Modal Edit/Hapus Santri (khusus dari view ini) ----------
const showSantriForm = ref(false)
const santriFormMode = ref<'create' | 'edit'>('edit')
const santriSaving = ref(false)
const santriFormError = ref<string | null>(null)
const santriCurrent = ref<SantriRow | null>(null)
const santriForm = reactive<Partial<SantriRow>>({
  santri: '', gen: '', jenjang: '', status: '', kamar: '', maskan: '',
})

function updateIsMobile() {
  isMobile.value = window.matchMedia('(max-width: 639px)').matches
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})
onBeforeUnmount?.(() => {
  window.removeEventListener('resize', updateIsMobile)
})

function fillSantriFormFromRow(r: SantriRow) {
  santriForm.santri = r.santri
  santriForm.gen = r.gen
  santriForm.jenjang = r.jenjang
  santriForm.status = r.status
  santriForm.kamar = r.kamar
  santriForm.maskan = r.maskan
}

function openSantriEdit(id: string) {
  const r = santriRows.value.find(x => x.id === id)
  if (!r) return
  santriFormMode.value = 'edit'
  santriCurrent.value = r
  santriFormError.value = null
  fillSantriFormFromRow(r)
  showSantriForm.value = true
}

function openSantriList(w: any) {
  if (isMobile.value) {
    activeWali.value = w
    showSantriModal.value = true
  } else {
    // desktop: toggle collapse
    const s = new Set(expanded.value)
    s.has(w.id) ? s.delete(w.id) : s.add(w.id)
    expanded.value = s
  }
}

async function submitSantriForm() {
  if (!santriCurrent.value?.id) return
  if (!String(santriForm.santri ?? '').trim()) {
    santriFormError.value = 'Nama santri wajib diisi.'
    return
  }
  santriSaving.value = true
  try {
    await updateSantri(santriCurrent.value.id, {
      santri: santriForm.santri,
      gen: santriForm.gen,
      jenjang: santriForm.jenjang,
      status: santriForm.status,
      kamar: santriForm.kamar,
      maskan: santriForm.maskan,
    })
    await Promise.all([fetchSantri(), fetchWali()])
    showSantriForm.value = false
  } catch (e: any) {
    santriFormError.value = e?.message ?? 'Gagal menyimpan data'
  } finally {
    santriSaving.value = false
  }
}

const showSantriDelete = ref(false)
const santriDeleting = ref(false)
function openSantriDelete(id: string) {
  const r = santriRows.value.find(x => x.id === id)
  if (!r) return
  santriCurrent.value = r
  showSantriDelete.value = true
}
async function confirmSantriDelete() {
  if (!santriCurrent.value?.id) return
  santriDeleting.value = true
  try {
    await deleteSantri(santriCurrent.value.id)
    await Promise.all([fetchSantri(), fetchWali()])
    showSantriDelete.value = false
  } finally {
    santriDeleting.value = false
  }
}

async function reloadWali() {
  await fetchWali()
}
</script>
