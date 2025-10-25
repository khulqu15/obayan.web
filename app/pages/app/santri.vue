<template>
  <div class="space-y-6 p-6">
    <!-- Header -->
    <div class="flex items-center flex-wrap gap-3 justify-between">
      <h1 class="text-xl font-semibold">Santri Lama</h1>

      <div class="flex items-center flex-wrap gap-3">
        <button @click="openCreate()" class="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">
          + Tambah Santri
        </button>
        <button @click="reload" class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
          Muat Ulang
        </button>

        <!-- Dropdown Menu (actions ringkas) -->
        <div class="relative" ref="menuRoot" @keydown.escape="menuOpen=false">
          <button
            @click="menuOpen = !menuOpen"
            class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800"
          >
            Menu ▾
          </button>
          <div
            v-if="menuOpen"
            class="absolute right-0 mt-2 w-44 rounded-md border border-gray-200 bg-white shadow-lg z-20
                   dark:bg-neutral-900 dark:border-neutral-700"
          >
            <button
              @click="fileInputLama?.click(); menuOpen=false"
              class="w-full text-left text-xs px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800"
            >
              Import CSV/Excel
            </button>
            <button
              @click="downloadTemplate('lama'); menuOpen=false"
              class="w-full text-left text-xs px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800"
            >
              Template CSV
            </button>
            <button
              @click="exportCSV(filteredLamaRows, 'santri_lama.csv'); menuOpen=false"
              class="w-full text-left text-xs px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800"
            >
              Export CSV
            </button>
            <button
              @click="exportExcel(filteredLamaRows, 'santri_lama.xlsx'); menuOpen=false"
              class="w-full text-left text-xs px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800"
            >
              Export Excel
            </button>
            <button
              @click="showFieldSettings = true; menuOpen=false"
              class="w-full text-left text-xs px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800"
            >
              Tampilan Kolom
            </button>
          </div>
        </div>

        <!-- hidden input untuk import -->
        <input
          type="file"
          ref="fileInputLama"
          class="hidden"
          accept=".xlsx,.xls,.csv"
          @change="handleImportLama"
        />
      </div>
    </div>

    <div v-if="error" class="p-3 rounded border border-rose-200 bg-rose-50 text-rose-700 text-sm dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300">
      {{ error }}
    </div>
    <div v-if="loading" class="text-sm text-gray-500">Memuat data...</div>

    <!-- ===================== TABEL: SANTRI LAMA ===================== -->
    <section v-if="!loading" class="space-y-3">
      <!-- Bar Filter -->
      <div class="flex items-center flex-wrap gap-2 justify-between">
        <h2 class="text-base font-semibold">Daftar</h2>
        <div class="flex flex-wrap items-center gap-2">
          <input
            v-model="filtersLama.q"
            placeholder="Cari nama / wali / alamat…"
            class="w-52 text-xs px-3 py-1.5 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"
          />
          <select v-model="filtersLama.status" class="text-xs px-2 py-1.5 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
            <option value="semua">Semua Status</option>
            <option v-for="s in statusOptionsLama" :key="s" :value="s">{{ s }}</option>
          </select>
          <select v-model="filtersLama.jenjang" class="text-xs px-2 py-1.5 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
            <option value="semua">Semua Jenjang</option>
            <option v-for="j in jenjangOptionsLama" :key="j" :value="j">{{ j }}</option>
          </select>
        </div>
      </div>

      <DataTable
        title="Santri Lama"
        :rows="filteredLamaRows"
        :show-actions="true"
        :columns="columns"
        :show-page-size="true"
        :rowKey="(r) => r.id"
      >
        <template #cell-nohp="{ row }">
          <a v-if="row.nohp" :href="`tel:${row.nohp}`" class="text-blue-600 hover:underline">{{ row.nohp }}</a>
          <span v-else class="text-gray-400">-</span>
        </template>

        <template #cell-noInduk="{ row }">
          <span class="font-medium">{{ row.noInduk || '—' }}</span>
        </template>

        <template #cell-santri="{ row }">
          <div class="font-medium">{{ row.santri }}</div>
          <div class="text-xs text-gray-500">{{ row.noInduk || '' }}</div>
        </template>

        <template #cell-kamar="{ row }">
          {{ row.kamar }} <span v-if="(row as any).maskan">- {{ (row as any).maskan }}</span>
        </template>

        <template #cell-action="{ row }">
          <div class="flex items-center flex-wrap gap-2">
            <button @click="openDetail(row)" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Detail</button>
            <button @click="openEdit(row)" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Edit</button>
            <button @click="openConfirm(row)" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">Hapus</button>
          </div>
        </template>
      </DataTable>
    </section>

    <!-- Modal Detail (besar) -->
    <ModalShell v-model="showDetail" title="Detail Santri" size="5xl">
      <div v-if="detailRow" class="grid md:grid-cols-3 gap-3">
        <div class="md:col-span-1 space-y-2">
          <div class="text-sm">
            <div class="text-xs text-gray-500">No. Induk</div>
            <div class="font-medium">{{ detailRow.noInduk || '—' }}</div>
          </div>
          <div class="text-sm">
            <div class="text-xs text-gray-500">Gen</div>
            <div class="font-medium">{{ detailRow.gen || '—' }}</div>
          </div>
          <div class="text-sm">
            <div class="text-xs text-gray-500">Nama</div>
            <div class="font-medium">{{ detailRow.santri || '—' }}</div>
          </div>
          <div class="text-sm">
            <div class="text-xs text-gray-500">Kamar</div>
            <div class="font-medium">{{ detailRow.kamar || '—' }}</div>
          </div>
        </div>

        <div class="md:col-span-1 space-y-2">
          <div class="text-sm">
            <div class="text-xs text-gray-500">Ayah</div>
            <div class="font-medium">{{ (detailRow as any).ayahNama || '—' }}</div>
          </div>
          <div class="text-sm">
            <div class="text-xs text-gray-500">Ibu</div>
            <div class="font-medium">{{ (detailRow as any).ibuNama || '—' }}</div>
          </div>
          <div class="text-sm">
            <div class="text-xs text-gray-500">Nomor</div>
            <div class="font-medium">
              <a v-if="detailRow.nohp" :href="`tel:${detailRow.nohp}`" class="text-blue-600 hover:underline">{{ detailRow.nohp }}</a>
              <span v-else>—</span>
            </div>
          </div>
          <div class="text-sm">
            <div class="text-xs text-gray-500">Status</div>
            <div class="font-medium">{{ detailRow.status || '—' }}</div>
          </div>
        </div>

        <div class="md:col-span-1 space-y-2">
          <div class="text-sm">
            <div class="text-xs text-gray-500">Kelas Formal</div>
            <div class="font-medium">{{ (detailRow as any).kelasFormal || detailRow.jenjang || '—' }}</div>
          </div>
          <div class="text-sm">
            <div class="text-xs text-gray-500">Alamat</div>
            <div class="font-medium break-words">{{ detailRow.alamat || '—' }}</div>
          </div>
        </div>
      </div>

      <template #footer>
        <button @click="showDetail=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
          Tutup
        </button>
      </template>
    </ModalShell>

    <!-- ========== MODALS ========== -->
    <ModalShell size="4xl" v-model="showForm" :title="formMode === 'create' ? 'Tambah Santri' : 'Ubah Santri'">
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
            <select v-model="form.status" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
              <option value="lulus">Lulus</option>
              <option value="cuti">Cuti</option>
            </select>
          </div>
          <div class="sm:col-span-2">
            <label class="text-xs text-gray-600 dark:text-neutral-300">Alamat</label>
            <textarea v-model.trim="form.alamat" rows="2" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" placeholder="Alamat lengkap wali/santri" />
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

    <ModalShell v-model="showFieldSettings" title="Pilih Kolom yang Ditampilkan" size="xl">
      <div class="grid sm:grid-cols-2 gap-2">
        <label
          v-for="c in allColumnDefs"
          :key="c.key"
          class="flex items-center gap-2 p-2 rounded border border-gray-200 dark:border-neutral-700"
        >
          <input
            type="checkbox"
            :value="c.key"
            v-model="selectedFieldKeys"
          />
          <span class="text-sm">{{ c.label }}</span>
        </label>
      </div>

      <template #footer>
        <button @click="showFieldSettings=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
          Tutup
        </button>
      </template>
    </ModalShell>

    <!-- Modal Progress Import -->
    <ModalShell size="4xl" v-model="showProgress" title="Import Data (Santri Lama)">
      <div class="space-y-3">
        <div class="w-full bg-gray-200 dark:bg-neutral-800 rounded h-3 overflow-hidden">
          <div class="bg-blue-600 h-3 transition-all duration-300" :style="{ width: progress+'%' }"></div>
        </div>
        <p class="text-sm text-gray-700 dark:text-neutral-200">{{ progressStatus }}</p>
      </div>
      <template #footer>
        <button @click="showProgress=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-800" :disabled="progress < 100">Tutup</button>
      </template>
    </ModalShell>

    <!-- ===================== GRUP: Wali/Ayah + No HP Sama ===================== -->
    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold">Potensi Duplikat Keluarga (Nama Wali/Ayah & No HP Sama)</h2>

        <!-- Kontrol Nilai -->
        <div class="flex items-center gap-2 text-xs">
          <select v-model="selectedMapelId" class="px-2 py-1.5 rounded border border-gray-200 dark:border-neutral-700">
            <option value="">(Pilih Mapel untuk tampilkan nilai)</option>
            <option v-for="m in subjects" :key="m.id" :value="m.id">{{ m.name }}</option>
          </select>
          <input v-model.number="tahunAwalNilai" type="number" class="w-20 px-2 py-1.5 rounded border border-gray-200 dark:border-neutral-700" :title="'Tahun Awal – term aktif: ' + termKeyNilai"/>
          <select v-model="semesterNilai" class="px-2 py-1.5 rounded border border-gray-200 dark:border-neutral-700">
            <option>Ganjil</option><option>Genap</option>
          </select>
        </div>
      </div>

      <div v-if="!groupsWali.length" class="text-sm text-gray-500">
        Tidak ditemukan grup dengan nama wali/ayah dan nomor HP yang sama.
      </div>

      <div v-for="g in groupsWali" :key="g.key" class="rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden">
        <!-- Header grup -->
        <div class="p-3 bg-gray-50 dark:bg-neutral-900/40 flex items-center justify-between">
          <div>
            <div class="font-medium">
              {{ g.waliName || '(tanpa nama wali)' }}
              <span class="text-gray-400">•</span>
              <a :href="`tel:${g.phone}`" class="text-blue-600 hover:underline">+{{ g.phone }}</a>
            </div>
            <div class="text-xs text-gray-500">
              {{ statsForGroup(g).total }} santri
              <span class="mx-2 text-gray-300">|</span>
              Status:
              <span v-for="(s,i) in statsForGroup(g).byStatus" :key="s.k">
                <b>{{ s.k }}</b> {{ s.v }}<span v-if="i < statsForGroup(g).byStatus.length-1">, </span>
              </span>
              <span class="mx-2 text-gray-300">|</span>
              Jenjang:
              <span v-for="(j,i) in statsForGroup(g).byJenjang" :key="j.k">
                <b>{{ j.k }}</b> {{ j.v }}<span v-if="i < statsForGroup(g).byJenjang.length-1">, </span>
              </span>
            </div>
          </div>
          <div class="text-xs text-gray-500">
            Term nilai aktif: <b>{{ termKeyNilai }}</b>
          </div>
        </div>

        <!-- Body daftar santri -->
        <div class="p-3 overflow-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-white dark:bg-neutral-800 sticky top-0">
              <tr>
                <th class="px-3 py-2 text-left w-40">No. Induk</th>
                <th class="px-3 py-2 text-left w-56">Santri</th>
                <th class="px-3 py-2 text-left w-40">Kamar</th>
                <th class="px-3 py-2 text-left w-32">Jenjang</th>
                <th class="px-3 py-2 text-left w-28">Status</th>
                <th class="px-3 py-2 text-left min-w-60">
                  Nilai <span v-if="selectedMapelId">({{ subjects.find(m=>m.id===selectedMapelId)?.name || '' }})</span>
                </th>
                <th class="px-3 py-2 text-left">Alamat</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-neutral-700">
              <tr v-for="s in g.items" :key="s.id">
                <td class="px-3 py-2">{{ s.noInduk || '—' }}</td>
                <td class="px-3 py-2">
                  <div class="font-medium">{{ s.santri }}</div>
                  <div class="text-[11px] text-gray-500">Wali: {{ (s as any).walisantri || (s as any).ayahNama || '—' }}</div>
                  <div class="text-[11px] text-gray-500" v-if="s.nohp">
                    <a :href="`tel:${s.nohp}`" class="text-blue-600 hover:underline">{{ s.nohp }}</a>
                  </div>
                </td>
                <td class="px-3 py-2">{{ s.kamar || '—' }}</td>
                <td class="px-3 py-2">{{ s.jenjang || '—' }}</td>
                <td class="px-3 py-2">{{ s.status || '—' }}</td>

                <!-- Nilai -->
                <td class="px-3 py-2">
                  <div v-if="selectedMapelId">
                    <template v-if="nilaiRingkas(s.id).akhir != null || nilaiRingkas(s.id).predikat">
                      <div class="font-semibold">
                        Akhir: {{ nilaiRingkas(s.id).akhir ?? '—' }}
                        <span v-if="nilaiRingkas(s.id).predikat">({{ nilaiRingkas(s.id).predikat }})</span>
                      </div>
                      <div class="text-[11px] text-gray-500">
                        T{{ nilaiRingkas(s.id).tugas ?? '–' }} / H{{ nilaiRingkas(s.id).harian ?? '–' }} / PTS {{ nilaiRingkas(s.id).pts ?? '–' }} / PAS {{ nilaiRingkas(s.id).pas ?? '–' }}
                        <span v-if="nilaiRingkas(s.id).proyek != null"> / Proyek {{ nilaiRingkas(s.id).proyek }}</span>
                        <span v-if="nilaiRingkas(s.id).lainnya != null"> / Lainnya {{ nilaiRingkas(s.id).lainnya }}</span>
                      </div>
                      <div v-if="nilaiRingkas(s.id).catatan" class="text-[11px] italic text-gray-500">“{{ nilaiRingkas(s.id).catatan }}”</div>
                    </template>
                    <template v-else>
                      <span class="text-gray-400">Belum ada nilai pada term/mapel ini.</span>
                    </template>
                  </div>
                  <div v-else class="text-gray-400">Pilih mapel untuk melihat nilai.</div>
                </td>

                <td class="px-3 py-2">{{ s.alamat || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'
import { onMounted, onBeforeUnmount, reactive, ref, computed, watch } from 'vue'
import DataTable from '~/components/widget/DataTable.vue'
import ModalShell from '~/components/widget/ModalShell.vue'
import { useSantri, type SantriRow } from '~/composables/data/useSantri'

/* ==== Tambahan untuk nilai & term ==== */
import { usePelajaran, makeTermKey } from '~/composables/data/usePelajaran'

definePageMeta({ layout: 'app', layoutProps: { title: 'Santri Lama' } })

/* ===================== DATA SANTRI ===================== */
const { rows, loading, error, fetchSantri, createSantri, updateSantri, deleteSantri, importFromExcelWithProgress } = useSantri()
onMounted(fetchSantri)
const reload = () => fetchSantri()

/** Dropdown menu (SSR-safe click outside) */
const menuOpen = ref(false)
const menuRoot = ref<HTMLElement | null>(null)
function onDocClick(e: MouseEvent) {
  const t = e.target as HTMLElement
  if (!menuRoot.value?.contains(t)) menuOpen.value = false
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))

/** Modal Detail */
const showDetail = ref(false)
const detailRow = ref<SantriRow | null>(null)
function openDetail(row: SantriRow) { detailRow.value = row; showDetail.value = true }

/** Kolom Master + Setting Kolom */
const allColumnDefs = [
  { key: 'noInduk',     label: 'No. Induk', sortable: true },
  { key: 'gen',         label: 'Gen', sortable: true },
  { key: 'santri',      label: 'Nama', sortable: true },
  { key: 'kamar',       label: 'Kamar', sortable: true },
  { key: 'ayahNama',    label: 'Ayah', sortable: true },
  { key: 'ibuNama',     label: 'Ibu', sortable: true },
  { key: 'nohp',        label: 'Nomor', sortable: true },
  { key: 'alamat',      label: 'Alamat', sortable: true },
  { key: 'status',      label: 'Status', sortable: true },
  { key: 'kelasFormal', label: 'Kelas Formal', sortable: true },
] as const

const selectedFieldKeys = ref<string[]>([
  'noInduk', 'gen', 'santri', 'kamar', 'ayahNama', 'ibuNama', 'nohp', 'alamat', 'status', 'kelasFormal'
])
const columns = computed(() => allColumnDefs.filter(c => selectedFieldKeys.value.includes(c.key)))
const showFieldSettings = ref(false)

/** Filter Santri Lama (exclude calon tahun ini) */
const currentYear = new Date().getFullYear()
function extractYear(r: any): number | null {
  if (typeof r?.ppdbCode === 'string' && /^ALB-\d{8}-/i.test(r.ppdbCode)) return parseInt(r.ppdbCode.slice(4, 8))
  const ca = (r as any)?.createdAt
  if (typeof ca === 'number') return new Date(ca).getFullYear()
  if (ca && typeof ca === 'object') {
    const ms = ca._seconds ? ca._seconds * 1000 : ca?.toMillis?.()
    if (ms) return new Date(ms).getFullYear()
  }
  const g = (r as any)?.gen
  if (g && /^\d{4}$/.test(String(g))) return parseInt(g)
  return null
}
function isCalonThisYear(r: any): boolean {
  const y = extractYear(r)
  const yearMatch = (y === currentYear)
  const hasPpdb = 'ppdbCode' in r || 'ppdb' in r || ('username' in r && 'publicToken' in r)
  const looksNew = (r.status === 'nonaktif') && (!r.kamar || r.kamar === '-' )
  return (yearMatch && (hasPpdb || looksNew))
}
const rowsLama  = computed(() => (rows.value || []).filter(r => !isCalonThisYear(r)))

/** Filters */
type Filters = { q: string; status: string; jenjang: string }
const filtersLama = ref<Filters>({ q: '', status: 'semua', jenjang: 'semua' })
function matchSearch(r: SantriRow, q: string) {
  if (!q) return true
  const s = q.toLowerCase()
  const hay = [r.santri, r.walisantri, r.nohp, r.kamar, (r as any).maskan, r.alamat, r.jenjang, r.gen, r.status]
    .map(v => String(v || '').toLowerCase()).join(' | ')
  return hay.includes(s)
}
function matchStatus(r: SantriRow, st: string) {
  return st === 'semua' ? true : String(r.status || '').toLowerCase() === st.toLowerCase()
}
function matchJenjang(r: SantriRow, jj: string) {
  return jj === 'semua' ? true : String(r.jenjang || '').toLowerCase() === jj.toLowerCase()
}
const filteredLamaRows = computed(() =>
  rowsLama.value
    .filter(r => matchSearch(r, filtersLama.value.q))
    .filter(r => matchStatus(r, filtersLama.value.status))
    .filter(r => matchJenjang(r, filtersLama.value.jenjang))
)
const statusOptionsLama  = computed(() => uniqueNonEmpty(rowsLama.value.map(r => r.status)))
const jenjangOptionsLama = computed(() => uniqueNonEmpty(rowsLama.value.map(r => r.jenjang)))
function uniqueNonEmpty(arr: (string|number|undefined|null)[]) {
  return [...new Set(arr.map(v => String(v || '').trim()).filter(Boolean))]
}

/** Import (Lama) + Progress */
const fileInputLama = ref<HTMLInputElement | null>(null)
const showProgress = ref(false)
const progress = ref(0)
const progressStatus = ref("")
async function handleImportLama(e: Event) {
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

/** CRUD form */
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
function openCreate() { formMode.value = 'create'; resetForm(); showForm.value = true }
function openEdit(row: SantriRow) {
  formMode.value = 'edit'; current.value = row
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
  if (!form.santri?.trim()) { formError.value = 'Nama santri wajib diisi.'; return }
  if (!form.gen?.trim())     { formError.value = 'Gen wajib diisi.'; return }
  saving.value = true
  try {
    if (formMode.value === 'create') await createSantri({ ...form })
    else if (current.value?.id) await updateSantri(current.value.id, { ...form })
    showForm.value = false
    await fetchSantri()
  } catch (e: any) { formError.value = e?.message ?? 'Gagal menyimpan data' }
  finally { saving.value = false }
}

/** Delete */
const showConfirm = ref(false)
const deleting = ref(false)
function openConfirm(row: SantriRow) { current.value = row; showConfirm.value = true }
async function confirmDelete() {
  if (!current.value?.id) return
  deleting.value = true
  try {
    await deleteSantri(current.value.id)
    showConfirm.value = false
    await fetchSantri()
  } finally { deleting.value = false }
}

/* ================== OPSIONAL NILAI (untuk tampilkan nilai per grup) ================== */
const {
  subjects, subscribeSubjects, unbindSubjects,
  nilaiMap, subscribeNilai, unsubscribeNilai,
} = usePelajaran()

const selectedMapelId = ref('')                                          // mapel terpilih
const tahunAwalNilai = ref<number>(new Date().getMonth() >= 6 ? new Date().getFullYear() : new Date().getFullYear()-1)
const semesterNilai = ref<'Ganjil'|'Genap'>(new Date().getMonth() >= 6 ? 'Ganjil' : 'Genap')
const termKeyNilai = computed(() => makeTermKey(tahunAwalNilai.value, semesterNilai.value))

onMounted(() => { subscribeSubjects() })
onBeforeUnmount(() => { unbindSubjects(); unsubscribeNilai() })
watch([selectedMapelId, termKeyNilai], ([mid]) => { unsubscribeNilai(); if (mid) subscribeNilai(termKeyNilai.value, mid) })

/* ================== GROUPING: (wali OR ayah) + nohp (AND sama) ================== */
function normPhone(raw?: string) {
  const d = String(raw || '').replace(/\D+/g, '')
  if (!d) return ''
  if (d.startsWith('0')) return '62' + d.slice(1)
  if (d.startsWith('620')) return '62' + d.slice(3)
  return d
}
function normName(raw?: string) {
  return String(raw || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
function primaryGuardianName(r: SantriRow) {
  return String((r as any).walisantri || (r as any).ayahNama || '')
}

type GrupWali = { key: string; waliName: string; phone: string; items: SantriRow[] }
const groupsWali = computed<GrupWali[]>(() => {
  const byKey = new Map<string, GrupWali>()
  for (const r of rowsLama.value) {
    const nmRaw = primaryGuardianName(r)
    const ph = normPhone(r.nohp)
    const nm = normName(nmRaw)
    if (!nm || !ph) continue
    const key = nm + '|' + ph
    if (!byKey.has(key)) byKey.set(key, { key, waliName: nmRaw || '-', phone: ph, items: [] })
    byKey.get(key)!.items.push(r)
  }
  return Array.from(byKey.values()).filter(g => g.items.length >= 2)
})

/* ================== STATS per grup ================== */
function statsForGroup(g: GrupWali) {
  const total = g.items.length
  const byStatus = new Map<string, number>()
  const byJenjang = new Map<string, number>()
  for (const s of g.items) {
    const st = String(s.status || '-')
    const jj = String(s.jenjang || '-')
    byStatus.set(st, (byStatus.get(st) || 0) + 1)
    byJenjang.set(jj, (byJenjang.get(jj) || 0) + 1)
  }
  return {
    total,
    byStatus: Array.from(byStatus.entries()).map(([k,v]) => ({ k, v })),
    byJenjang: Array.from(byJenjang.entries()).map(([k,v]) => ({ k, v })),
  }
}

/* ================== NILAI ringkas per santri (term/mapel aktif) ================== */
function nilaiRingkas(santriId: string) {
  const n: any = nilaiMap.value?.[santriId] || {}
  const tugas = Number(n.tugas ?? '')
  const harian= Number(n.harian ?? '')
  const pts   = Number(n.pts ?? '')
  const pas   = Number(n.pas ?? '')
  const proyek= n.proyek != null ? Number(n.proyek) : undefined
  const lainnya= n.lainnya != null ? Number(n.lainnya) : undefined
  const comps = [tugas, harian, pts, pas, proyek, lainnya].filter(x => typeof x === 'number' && !Number.isNaN(x)) as number[]
  const akhir = comps.length ? Math.round(comps.reduce((a,b)=>a+b,0)/comps.length) : (Number(n.akhir) || undefined)
  return {
    tugas: Number.isFinite(tugas) ? tugas : undefined,
    harian: Number.isFinite(harian) ? harian : undefined,
    pts: Number.isFinite(pts) ? pts : undefined,
    pas: Number.isFinite(pas) ? pas : undefined,
    proyek: typeof proyek === 'number' ? proyek : undefined,
    lainnya: typeof lainnya === 'number' ? lainnya : undefined,
    akhir,
    predikat: n.predikat || undefined,
    catatan: n.catatan || ''
  }
}

/* ================== UTIL: Export/Template ================== */
function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
function withExt(name: string, ext: string) { return name?.toLowerCase().endsWith(`.${ext}`) ? name : `${name}.${ext}` }
function buildTemplateCsv(): string {
  const headers = ['No Induk','Gen','Nama','Kamar','Ayah','Ibu','No HP','Alamat','Status','Kelas Formal']
  const rows = [
    ['2024-001','2024','Muhammad Alif','B2','Budi','Siti','081234567890','Ds. Sukamaju RT 01 RW 02','aktif','7 MTs A'],
    ['2023-015','2023','Aisyah Zahra','A1','Andi','Rina','081298765432','Jl. Melati No. 5','aktif','8 MTs B'],
  ]
  const bom = '\uFEFF'
  const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))].join('\r\n')
  return bom + csv
}
function downloadTemplate(kind: 'lama'|'master' = 'lama') {
  const csv = buildTemplateCsv()
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const fname = kind === 'master' ? 'template_master_santri.csv' : 'template_santri_lama.csv'
  saveBlob(blob, fname)
}
type RowDict = Record<string, any>
function pickExportRows(input: SantriRow[], fieldKeys: string[]): RowDict[] {
  const labelMap: Record<string,string> = {
    noInduk: 'No Induk', gen: 'Gen', santri: 'Nama', kamar: 'Kamar',
    ayahNama: 'Ayah', ibuNama: 'Ibu', nohp: 'No HP', alamat: 'Alamat',
    status: 'Status', kelasFormal: 'Kelas Formal',
  }
  return input.map(r => {
    const out: RowDict = {}
    for (const key of fieldKeys) {
      const label = labelMap[key] ?? key
      const val = (r as any)[key]
      out[label] = (val ?? '') as any
    }
    return out
  })
}
function toCsv(rowsDict: RowDict[]): string {
  if (!rowsDict.length) return '\uFEFF'
  const headers = Object.keys(rowsDict[0]!)
  const lines = rowsDict.map(obj =>
    headers.map(h => {
      const cell = obj[h] ?? ''
      const txt = String(cell)
      if (/[",\r\n]/.test(txt)) return `"${txt.replace(/"/g, '""')}"`
      return txt
    }).join(',')
  )
  const bom = '\uFEFF'
  return bom + [headers.join(','), ...lines].join('\r\n')
}
function exportCSV(data: SantriRow[], filename = 'export.csv') {
  const rowsDict = pickExportRows(data, selectedFieldKeys.value)
  const csv = toCsv(rowsDict)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  saveBlob(blob, withExt(filename, 'csv'))
}
async function exportExcel(data: SantriRow[], filename = 'export.xlsx') {
  const rowsDict = pickExportRows(data, selectedFieldKeys.value)
  // @ts-ignore
  const XLSX = (await import('xlsx')).default || (await import('xlsx'))
  const ws = XLSX.utils.json_to_sheet(rowsDict, { skipHeader: false })
  const headers = Object.keys(rowsDict[0] || {})
  const colWidths = headers.map((h) => {
    let maxLen = String(h).length
    rowsDict.forEach(r => {
      const len = String(r[h] ?? '').length
      if (len > maxLen) maxLen = len
    })
    return { wch: Math.min(Math.max(maxLen + 2, 10), 60) }
  })
  // @ts-ignore
  ws['!cols'] = colWidths
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Santri')
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  saveBlob(blob, withExt(filename, 'xlsx'))
}
</script>
