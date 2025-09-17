<template>
  <section class="p-6 space-y-4">
    <div class="flex items-center justify-between">
        <h1 class="text-lg font-semibold">Jadwal Piket Maskan</h1>
        <div class="flex items-center gap-2">
            <button @click="openAddPiket()" class="text-xs px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700">
            + Tambah Piket
            </button>
            <button @click="reloadAll" class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
            Muat Ulang
            </button>
        </div>
    </div>


    <div class="flex items-center gap-2 text-xs">
      <span class="text-gray-600 dark:text-neutral-300">Tipe:</span>
      <button v-for="t in tipeTabs" :key="t.value"
        @click="activeTipe = t.value"
        :class="['px-3 py-1.5 rounded border', activeTipe===t.value ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800']">
        {{ t.label }}
      </button>
    </div>

    <DataTable
      title="Daftar Maskan (Piket)"
      :rows="maskanRows"
      :columns="columns"
      :show-actions="true"
      :rowKey="(r)=>r.id"
    >
      <template #cell-name="{ row: m }">
        <div class="font-semibold">Maskan {{ m.name }}</div>
        <div class="text-xs text-gray-500">{{ m.deskripsi || '—' }}</div>
      </template>

      <template #cell-tipe="{ row: m }">
        <span class="inline-flex items-center px-2 py-0.5 text-xs rounded border border-gray-200 dark:border-neutral-700">{{ m.tipe }}</span>
      </template>

      <template #cell-piket="{ row: m }">
        <div class="flex flex-wrap gap-1">
          <span v-for="d in DAY_KEYS" :key="d"
            :class="['px-2 py-0.5 text-[11px] rounded border', dayCount(m.id,d)>0 ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-900/20' : 'border-gray-200 dark:border-neutral-700']">
            {{ dayShort(d) }}: {{ dayCount(m.id,d) }}
          </span>
        </div>
        <div class="mt-2 flex items-center gap-2">
            <button @click="openManage(m)" class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
                Kelola
            </button>
            <button @click="openAddPiket(m)" class="text-xs px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700">
                + Tambah
            </button>
            <button @click="openGenerate(m)" class="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">
                Generate Otomatis
            </button>
        </div>

        <div v-show="!isMobile && expanded.has(m.id)" class="mt-3 rounded-lg border border-gray-200 dark:border-neutral-700 overflow-hidden">
          <div class="bg-gray-50 dark:bg-neutral-900/40 px-3 py-2 text-xs font-medium">
            Board Piket - Maskan {{ m.name }} ({{ m.tipe }})
          </div>
          <div class="p-3">
            <div class="flex flex-wrap items-end gap-2 mb-3">
              <div class="flex items-center gap-2">
                <label class="text-xs">Salin dari</label>
                <select v-model="copyFrom" class="px-2 py-1 text-xs rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
                  <option v-for="d in DAY_KEYS" :key="d" :value="d">{{ DAY_LABEL[d] }}</option>
                </select>
                <label class="text-xs">Tempel ke</label>
                <div class="flex flex-wrap gap-2">
                  <label v-for="d in DAY_KEYS" :key="m.id+'cb'+d" class="inline-flex items-center gap-1 text-xs">
                    <input type="checkbox" v-model="pasteTargets" :value="d" />
                    {{ dayShort(d) }}
                  </label>
                </div>
                <button @click="applyPaste(m)" class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
                  Terapkan
                </button>
              </div>
            </div>

            <!-- 7 kolom hari -->
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-2 gap-3">
              <div v-for="d in DAY_KEYS" :key="m.id+'-'+d" class="rounded border border-gray-200 dark:border-neutral-700">
                <div class="px-3 py-2 text-xs font-semibold bg-gray-50 dark:bg-neutral-900/40 flex items-center justify-between">
                  <span>{{ DAY_LABEL[d] }}</span>
                  <button @click="clearDayConfirm(m,d)" class="text-[11px] px-2 py-0.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
                    Kosongkan
                  </button>
                </div>

                <div class="p-2 space-y-2">
                  <!-- List member -->
                  <div v-for="mem in getDay(m.id,d)" :key="mem.id" class="flex items-center justify-between text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700">
                    <div class="min-w-0">
                      <div class="truncate font-medium">{{ displayMember(mem) }}</div>
                      <div v-if="mem.note" class="text-[11px] text-gray-500 truncate">{{ mem.note }}</div>
                    </div>
                    <div class="flex items-center gap-1">
                      <button @click="editMember(m,d,mem)" class="px-1.5 py-0.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Edit</button>
                      <button @click="removeMemberConfirm(m,d,mem)" class="px-1.5 py-0.5 rounded border border-gray-200 text-rose-600 hover:bg-rose-50 dark:border-neutral-700 dark:hover:bg-rose-900/20">Hapus</button>
                    </div>
                  </div>

                  <!-- Add member (search santri / manual) -->
                  <div class="space-y-1">
                    <input v-model.trim="qMap[m.id][d]" placeholder="Cari santri..." class="w-full px-2 py-1 text-xs rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
                    <div v-if="qMap[m.id][d] && candidates(m.id,d).length" class="max-h-36 overflow-auto rounded border border-gray-200 dark:border-neutral-700 divide-y dark:divide-neutral-800">
                      <button v-for="s in candidates(m.id,d)" :key="s.id"
                        @click="addFromSantri(m,d,s)"
                        class="w-full text-left px-2 py-1 hover:bg-gray-50 dark:hover:bg-neutral-800">
                        <div class="text-xs font-medium truncate">{{ s.santri }}</div>
                        <div class="text-[11px] text-gray-500 truncate">Gen {{ s.gen || '-' }} • {{ s.kamar || '-' }} {{ s.maskan || '' }}</div>
                      </button>
                    </div>
                    <div class="flex items-center gap-2">
                      <input v-model.trim="manualMap[m.id][d]" placeholder="atau ketik nama manual" class="flex-1 px-2 py-1 text-xs rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
                      <button @click="addManual(m,d)" class="text-xs px-2 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700">Tambah</button>
                    </div>
                  </div>
                </div>
              </div>
            </div> <!-- /grid -->
          </div>
        </div>
      </template>

      <!-- Action -->
      <template #cell-action="{ row: m }">
        <button @click="openManage(m)" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
          Kelola
        </button>
      </template>
    </DataTable>

    <ModalShell v-model="showAddModal" :title="addCtx.mId ? `Tambah Piket — Maskan ${maskanName(addCtx.mId)}` : 'Tambah Piket'">
        <form class="space-y-3" @submit.prevent="doAddPiket">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div v-if="!addCtx.mId">
                <label class="text-xs">Pilih Maskan</label>
                <select v-model="addForm.mId" required class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
                <option v-for="m in maskanRows" :key="m.id" :value="m.id">Maskan {{ m.name }} ({{ m.tipe }})</option>
                </select>
            </div>
            <div class="sm:col-span-2">
                <label class="text-xs">Hari</label>
                <select v-model="addForm.day" required class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
                <option v-for="d in DAY_KEYS" :key="'add-'+d" :value="d">{{ DAY_LABEL[d] }}</option>
                </select>
            </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <!-- Cari & pilih santri -->
            <div>
                <label class="text-xs">Cari Santri</label>
                <input v-model.trim="addForm.q" placeholder="ketik nama/kamar/maskan…" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
                <div v-if="addCandidates.length" class="mt-2 max-h-56 overflow-auto rounded border border-gray-200 dark:border-neutral-700 divide-y dark:divide-neutral-800">
                <label v-for="s in addCandidates" :key="s.id" class="flex items-center gap-2 px-3 py-2">
                    <input type="checkbox" v-model="addForm.checked" :value="s.id" />
                    <div class="min-w-0">
                    <div class="text-sm font-medium truncate">{{ s.santri }}</div>
                    <div class="text-[11px] text-gray-500 truncate">Gen {{ s.gen || '-' }} • {{ s.kamar || '-' }} {{ s.maskan || '' }}</div>
                    </div>
                </label>
                </div>
                <div v-else-if="addForm.q" class="mt-2 text-xs text-gray-500">Tidak ditemukan.</div>
            </div>

            <!-- Input manual (multi-baris) -->
            <div>
                <label class="text-xs">Atau isi manual (satu nama per baris)</label>
                <textarea v-model="addForm.manual" rows="8" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" placeholder="Contoh: Ahmad Budi…"></textarea>
            </div>
            </div>
        </form>

        <template #footer>
            <button @click="showAddModal=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
            <button :disabled="adding" @click="doAddPiket" class="px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60">
            {{ adding ? 'Menambahkan…' : 'Tambah' }}
            </button>
        </template>
    </ModalShell>

    <ModalShell v-model="showGenModal" :title="genCtx.m ? `Generate Roster — Maskan ${genCtx.m.name} (${genCtx.m.tipe})` : 'Generate Roster'">
        <div v-if="genCtx.m" class="space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
                <label class="text-xs">Sumber Kandidat</label>
                <select v-model="genForm.source" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
                <option value="maskan">Santri bermaskan ini (disarankan)</option>
                <option value="tipe">Semua santri dengan tipe maskan ini</option>
                <option value="all">Semua santri</option>
                </select>
            </div>
            <div>
                <label class="text-xs">Filter (opsional)</label>
                <input v-model.trim="genForm.query" placeholder="nama/jenjang/kamar…" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label class="inline-flex items-center gap-2 text-xs">
                <input type="checkbox" v-model="genForm.replace" />
                Kosongkan jadwal dulu (replace)
            </label>
            <div>
                <label class="text-xs">Target per hari (opsional)</label>
                <input v-model.number="genForm.perDay" type="number" min="0" placeholder="mis. 4" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
            <div class="text-xs text-gray-500 self-end">
                Jika kosong, sistem akan membagi rata semua kandidat (round-robin).
            </div>
            </div>

            <div class="text-xs text-gray-600 dark:text-neutral-300">
            Kandidat terpilih: <strong>{{ genCandidates.length }}</strong>
            </div>
        </div>

        <template #footer>
            <button @click="showGenModal=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
            <button :disabled="generating || !genCtx.m" @click="doGenerate" class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
            {{ generating ? 'Menghasilkan…' : 'Generate' }}
            </button>
        </template>
    </ModalShell>



    <!-- Mobile: Board Modal -->
    <ModalShell v-model="showBoardModal" :title="activeMaskan ? `Board Piket — Maskan ${activeMaskan.name} (${activeMaskan.tipe})` : 'Board Piket'">
      <div v-if="activeMaskan">
        <!-- Toolbar copy/paste sama -->
        <div class="flex flex-wrap items-end gap-2 mb-3">
          <label class="text-xs">Salin dari</label>
          <select v-model="copyFrom" class="px-2 py-1 text-xs rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
            <option v-for="d in DAY_KEYS" :key="d" :value="d">{{ DAY_LABEL[d] }}</option>
          </select>
          <label class="text-xs">Tempel ke</label>
          <div class="flex flex-wrap gap-2">
            <label v-for="d in DAY_KEYS" :key="'mcb'+d" class="inline-flex items-center gap-1 text-xs">
              <input type="checkbox" v-model="pasteTargets" :value="d" />
              {{ dayShort(d) }}
            </label>
          </div>
          <button @click="applyPaste(activeMaskan)" class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Terapkan</button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div v-for="d in DAY_KEYS" :key="'m-'+d" class="rounded border border-gray-200 dark:border-neutral-700">
            <div class="px-3 py-2 text-xs font-semibold bg-gray-50 dark:bg-neutral-900/40 flex items-center justify-between">
              <span>{{ DAY_LABEL[d] }}</span>
              <button @click="clearDayConfirm(activeMaskan,d)" class="text-[11px] px-2 py-0.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Kosongkan</button>
            </div>
            <div class="p-2 space-y-2">
              <div v-for="mem in getDay(activeMaskan.id,d)" :key="mem.id" class="flex items-center justify-between text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700">
                <div class="min-w-0">
                  <div class="truncate font-medium">{{ displayMember(mem) }}</div>
                  <div v-if="mem.note" class="text-[11px] text-gray-500 truncate">{{ mem.note }}</div>
                </div>
                <div class="flex items-center gap-1">
                  <button @click="editMember(activeMaskan,d,mem)" class="px-1.5 py-0.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Edit</button>
                  <button @click="removeMemberConfirm(activeMaskan,d,mem)" class="px-1.5 py-0.5 rounded border border-gray-200 text-rose-600 hover:bg-rose-50 dark:border-neutral-700 dark:hover:bg-rose-900/20">Hapus</button>
                </div>
              </div>
              <div class="space-y-1">
                <input v-model.trim="qMobile[d]" placeholder="Cari santri..." class="w-full px-2 py-1 text-xs rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
                <div v-if="qMobile[d] && candidatesMobile(d).length" class="max-h-36 overflow-auto rounded border border-gray-200 dark:border-neutral-700 divide-y dark:divide-neutral-800">
                  <button v-for="s in candidatesMobile(d)" :key="s.id" @click="addFromSantri(activeMaskan,d,s)" class="w-full text-left px-2 py-1 hover:bg-gray-50 dark:hover:bg-neutral-800">
                    <div class="text-xs font-medium truncate">{{ s.santri }}</div>
                    <div class="text-[11px] text-gray-500 truncate">Gen {{ s.gen || '-' }} • {{ s.kamar || '-' }} {{ s.maskan || '' }}</div>
                  </button>
                </div>
                <div class="flex items-center gap-2">
                  <input v-model.trim="manualMobile[d]" placeholder="atau ketik nama manual" class="flex-1 px-2 py-1 text-xs rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
                  <button @click="addManual(activeMaskan,d,true)" class="text-xs px-2 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700">Tambah</button>
                </div>
              </div>
            </div>
          </div>
        </div>        
      </div>
      <template #footer>
        <button @click="showBoardModal=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Tutup</button>
      </template>
    </ModalShell>

    <!-- Modal Edit Member -->
    <ModalShell v-model="showEditMember" title="Ubah Anggota Piket">
      <form class="space-y-3" @submit.prevent="saveEditMember">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs">Nama (manual)</label>
            <input v-model.trim="editMemberForm.name" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs">Catatan</label>
            <input v-model.trim="editMemberForm.note" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div class="sm:col-span-2">
            <label class="text-xs">Atau pilih santri</label>
            <input v-model.trim="editQuery" placeholder="cari santri..." class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
            <div v-if="editQuery && editCandidates.length" class="mt-2 max-h-48 overflow-auto rounded border border-gray-200 dark:border-neutral-700 divide-y dark:divide-neutral-800">
              <button v-for="s in editCandidates" :key="s.id" type="button" @click="pickEditSantri(s)" class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800">
                <div class="text-sm font-medium">{{ s.santri }}</div>
                <div class="text-[11px] text-gray-500">Gen {{ s.gen || '-' }} • {{ s.kamar || '-' }} {{ s.maskan || '' }}</div>
              </button>
            </div>
          </div>
        </div>
      </form>
      <template #footer>
        <button @click="showEditMember=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
        <button @click="saveEditMember" class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">Simpan</button>
      </template>
    </ModalShell>

    <!-- Modal Konfirmasi Hapus & Kosongkan -->
    <ModalShell v-model="showConfirm" :title="confirmTitle">
      <p class="text-sm">{{ confirmMessage }}</p>
      <template #footer>
        <button @click="showConfirm=false" class="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
        <button @click="confirmDo" class="px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700">Ya</button>
      </template>
    </ModalShell>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import DataTable from '~/components/widget/DataTable.vue'
import ModalShell from '~/components/widget/ModalShell.vue'
import { useMaskan, type MaskanRow } from '~/composables/data/useMaskan'
import { useSantri } from '~/composables/data/useSantri'
import { usePiket, DAY_KEYS, DAY_LABEL, type DayKey, type PiketMember } from '~/composables/data/usePiket'

definePageMeta({ layout: 'app', layoutProps: { title: 'Jadwal Piket' } })

const { rows: maskan, fetchMaskan } = useMaskan()
const { rows: santri, fetchSantri } = useSantri()
const {
  loading: pkLoading, fetchPiket, getDayArray, addMember, removeMember, updateMember,
  clearDay, pasteToDays, DAY_KEYS: DK, DAY_LABEL: DL
} = usePiket()

onMounted(async () => {
  await Promise.all([fetchMaskan(), fetchSantri(), fetchPiket()])
})

const tipeTabs = [{label:'Semua', value:'ALL'}, {label:'Putra', value:'Putra'}, {label:'Putri', value:'Putri'}] as const
const activeTipe = ref<typeof tipeTabs[number]['value']>('ALL')
const maskanRows = computed(() =>
  maskan.value.filter(m => activeTipe.value==='ALL' ? true : m.tipe===activeTipe.value)
)

const blankDayState = (): Record<DayKey, string> => ({
  senin:  '', selasa: '', rabu:   '',
  kamis:  '', jumat:  '', sabtu:  '',
  minggu: '',
})

const columns = [
  { key: 'name', label: 'Maskan', sortable: true },
  { key: 'tipe', label: 'Tipe', sortable: true },
  { key: 'piket', label: 'Piket' },
]

// helpers
function getDay(mId:string, d:DayKey) { return getDayArray(mId, d) }
function dayCount(mId:string, d:DayKey) { return getDay(mId,d).length }
function dayShort(d:DayKey) { return DL[d].slice(0,2) }
function displayMember(m:PiketMember) {
  if (m.santriId) {
    const s = santri.value.find(x => x.id===m.santriId)
    return s?.santri || m.name || ''
  }
  return m.name || ''
}

// expand / mobile
const expanded = ref<Set<string>>(new Set())
const isMobile = ref(false)
const showBoardModal = ref(false)
const activeMaskan = ref<MaskanRow|null>(null)
function updateIsMobile(){ isMobile.value = window.matchMedia('(max-width: 639px)').matches }
onMounted(()=>{ updateIsMobile(); window.addEventListener('resize', updateIsMobile) })
onBeforeUnmount(()=> window.removeEventListener('resize', updateIsMobile))

function openManage(m: MaskanRow) {
  ensureMapsFor(m.id)
  if (isMobile.value) {
    activeMaskan.value = m
    showBoardModal.value = true
  } else {
    const s = new Set(expanded.value)
    s.has(m.id) ? s.delete(m.id) : s.add(m.id)
    expanded.value = s
  }
}

function dayField(map: Record<string, Record<DayKey,string>>, mId: string, d: DayKey) {
  if (!map[mId]) map[mId] = blankDayState()
  return computed({
    get: () => map[mId]![d],
    set: (val: string) => { map[mId]![d] = val },
  })
}

// search + manual per hari (desktop)
const qMap = reactive<Record<string, Record<DayKey,string>>>( {})
const manualMap = reactive<Record<string, Record<DayKey,string>>>( {})
function ensureMaps(mId:string) {
  if (!qMap[mId]) qMap[mId] = {} as any
  if (!manualMap[mId]) manualMap[mId] = {} as any
  for (const d of DK) {
    if (qMap[mId]![d]===undefined) qMap[mId]![d]=''
    if (manualMap[mId]![d]===undefined) manualMap[mId]![d]=''
  }
}
function ensureMapsFor(mId: string) {
  if (!qMap[mId]) qMap[mId] = blankDayState()
  if (!manualMap[mId]) manualMap[mId] = blankDayState()
}
watch(maskanRows, (list) => {
  list.forEach(m => ensureMapsFor(m.id))
}, { immediate: true })
function candidates(mId:string, d:DayKey) {
  ensureMaps(mId)
  const q = qMap[mId]![d]!.trim().toLowerCase()
  if (!q) return []
  return santri.value
    .filter(s => (s.santri||'').toLowerCase().includes(q) || (s.kamar||'').toLowerCase().includes(q) || (s.maskan||'').toLowerCase().includes(q))
    .slice(0,10)
}
async function addFromSantri(m:MaskanRow, d:DayKey, s:any) {
  await addMember(m.id, d, { santriId: s.id, name: s.santri })
  qMap[m.id]![d] = ''
}
async function addManual(m:MaskanRow, d:DayKey, mobile=false) {
  ensureMaps(m.id)
  const name = mobile ? manualMobile[d] : manualMap[m.id]![d]
  const nm = (name||'').trim()
  if (!nm) return
  await addMember(m.id, d, { name: nm })
  if (mobile) manualMobile[d]=''; else manualMap[m.id]![d]=''
}


const showAddModal = ref(false)
const adding = ref(false)
const addCtx = reactive<{ mId?: string }>({})
const addForm = reactive<{ mId?: string; day: DayKey; q: string; checked: string[]; manual: string }>({
  mId: undefined, day: 'senin', q: '', checked: [], manual: ''
})

function maskanName(id:string){ return maskan.value.find(x=>x.id===id)?.name ?? '' }

function openAddPiket(m?: MaskanRow) {
  addCtx.mId = m?.id
  addForm.mId = m?.id
  addForm.day = 'senin'
  addForm.q = ''
  addForm.checked = []
  addForm.manual = ''
  showAddModal.value = true
}

const addCandidates = computed(() => {
  const q = addForm.q.trim().toLowerCase()
  if (!q) return []
  return santri.value
    .filter(s =>
      (s.santri||'').toLowerCase().includes(q) ||
      (s.kamar||'').toLowerCase().includes(q) ||
      (s.maskan||'').toLowerCase().includes(q)
    )
    .slice(0, 50)
})

async function doAddPiket() {
  const mId = addForm.mId || addCtx.mId
  if (!mId) return
  const day = addForm.day
  adding.value = true
  try {
    // dari pilihan santri
    for (const sid of addForm.checked) {
      const s = santri.value.find(x=>x.id===sid)
      if (!s) continue
      await addMember(mId, day, { santriId: s.id, name: s.santri })
    }
    // dari manual
    for (const line of (addForm.manual||'').split('\n')) {
      const nm = line.trim()
      if (nm) await addMember(mId, day, { name: nm })
    }
    showAddModal.value = false
  } finally {
    adding.value = false
  }
}
// mobile fields
const qMobile = reactive<Record<DayKey,string>>({senin:'',selasa:'',rabu:'',kamis:'',jumat:'',sabtu:'',minggu:''})
const manualMobile = reactive<Record<DayKey,string>>({senin:'',selasa:'',rabu:'',kamis:'',jumat:'',sabtu:'',minggu:''})
function candidatesMobile(d:DayKey) {
  const q = qMobile[d]!.trim().toLowerCase()
  if (!q) return []
  return santri.value
    .filter(s => (s.santri||'').toLowerCase().includes(q) || (s.kamar||'').toLowerCase().includes(q) || (s.maskan||'').toLowerCase().includes(q))
    .slice(0,10)
}

// copy/paste toolbar
const copyFrom = ref<DayKey>('senin')
const pasteTargets = ref<DayKey[]>([])
async function applyPaste(m:MaskanRow) {
  if (!pasteTargets.value.length) return
  await pasteToDays(m.id, copyFrom.value, pasteTargets.value)
}

// edit member modal
const showEditMember = ref(false)
const editCtx = reactive<{ mId:string, day:DayKey, memberId:string }>({ mId:'', day:'senin', memberId:'' })
const editMemberForm = reactive<{ name:string; note:string; santriId?:string }>({ name:'', note:'', santriId:undefined })
const editQuery = ref('')
const editCandidates = computed(()=> {
  const q = editQuery.value.trim().toLowerCase()
  if (!q) return []
  return santri.value.filter(s => (s.santri||'').toLowerCase().includes(q) || (s.kamar||'').toLowerCase().includes(q) || (s.maskan||'').toLowerCase().includes(q)).slice(0,10)
})
function editMember(m:MaskanRow, d:DayKey, mem:PiketMember) {
  editCtx.mId = m.id
  editCtx.day = d
  editCtx.memberId = mem.id
  editMemberForm.name = mem.name || ''
  editMemberForm.note = mem.note || ''
  editMemberForm.santriId = mem.santriId || undefined
  editQuery.value = ''
  showEditMember.value = true
}
function pickEditSantri(s:any) {
  editMemberForm.santriId = s.id
  editMemberForm.name = s.santri // simpan juga nama saat ini
  editQuery.value = ''
}
async function saveEditMember() {
  const payload:any = {}
  // kalau user memilih santri → pakai santriId & name
  if (editMemberForm.santriId !== undefined) {
    payload.santriId = editMemberForm.santriId
    payload.name = editMemberForm.name ?? '' // simpan name sebagai fallback
  } else {
    payload.santriId = '' // kosongkan relasi
    payload.name = editMemberForm.name ?? ''
  }
  payload.note = editMemberForm.note ?? ''
  await updateMember(editCtx.mId, editCtx.day, editCtx.memberId, payload)
  showEditMember.value = false
}

// confirm helpers (hapus member / kosongkan hari)
const showConfirm = ref(false)
const confirmTitle = ref('Konfirmasi')
const confirmMessage = ref('')
let confirmDo: () => Promise<void> = async () => {}
function removeMemberConfirm(m:MaskanRow, d:DayKey, mem:PiketMember) {
  confirmTitle.value = 'Hapus Anggota'
  confirmMessage.value = `Hapus ${displayMember(mem)} dari piket hari ${DL[d]} di Maskan ${m.name}?`
  confirmDo = async () => { await removeMember(m.id, d, mem.id); showConfirm.value=false }
  showConfirm.value = true
}
function clearDayConfirm(m:MaskanRow, d:DayKey) {
  confirmTitle.value = 'Kosongkan Hari'
  confirmMessage.value = `Kosongkan seluruh piket hari ${DL[d]} di Maskan ${m.name}?`
  confirmDo = async () => { await clearDay(m.id, d); showConfirm.value=false }
  showConfirm.value = true
}

// ----- Generate Roster -----
const showGenModal = ref(false)
const generating = ref(false)
const genCtx = reactive<{ m: MaskanRow | null }>({ m: null })
const genForm = reactive<{ source: 'maskan'|'tipe'|'all'; query: string; replace: boolean; perDay?: number|null }>({
  source: 'maskan', query: '', replace: false, perDay: null
})

function openGenerate(m: MaskanRow) {
  genCtx.m = m
  genForm.source = 'maskan'
  genForm.query = ''
  genForm.replace = false
  genForm.perDay = null
  showGenModal.value = true
}

// bangun daftar kandidat sesuai pilihan
const genCandidates = computed(() => {
  const m = genCtx.m
  if (!m) return []
  let pool = santri.value.slice()

  // source
  if (genForm.source === 'maskan') {
    const key = (m.name || '').toString().trim().toLowerCase()
    pool = pool.filter(s => (s.maskan||'').toString().trim().toLowerCase() === key)
  } else if (genForm.source === 'tipe') {
    // ambil semua santri yang tinggal di maskan bertipe sama
    const sameTipeNames = new Set(
      maskan.value.filter(x => x.tipe === m.tipe).map(x => (x.name||'').toString().trim().toLowerCase())
    )
    pool = pool.filter(s => sameTipeNames.has((s.maskan||'').toString().trim().toLowerCase()))
  } else {
    // 'all' → tidak filter
  }

  // filter query
  const q = genForm.query.trim().toLowerCase()
  if (q) {
    pool = pool.filter(s =>
      (s.santri||'').toLowerCase().includes(q) ||
      (s.jenjang||'').toLowerCase().includes(q) ||
      (s.kamar||'').toLowerCase().includes(q) ||
      (s.maskan||'').toLowerCase().includes(q) ||
      (s.status||'').toLowerCase().includes(q)
    )
  }

  // uniq by id
  const seen = new Set<string>()
  const out:any[] = []
  for (const s of pool) {
    if (!seen.has(s.id)) { seen.add(s.id); out.push(s) }
  }
  return out
})

async function doGenerate() {
  const m = genCtx.m
  if (!m) return
  generating.value = true
  try {
    const candidates = genCandidates.value.map(s => ({ id: s.id, name: s.santri }))
    const assigned = new Set<string>() // cegah satu santri terpasang >1 hari
    // jika append, isi dengan existing assignments dulu
    if (!genForm.replace) {
      for (const d of DAY_KEYS) {
        for (const mem of getDay(m.id, d)) {
          if (mem.santriId) assigned.add(mem.santriId)
          else if (mem.name) assigned.add(`name:${mem.name.toLowerCase()}`)
        }
      }
    }

    // REPLACE: kosongkan dulu
    if (genForm.replace) {
      for (const d of DAY_KEYS) await clearDay(m.id, d)
    }

    // helper pop next candidate yg belum assigned
    function* iterateCandidates() {
      let idx = 0
      while (idx < candidates.length) {
        const c = candidates[idx++]
        const key = c!.id || `name:${(c!.name||'').toLowerCase()}`
        if (assigned.has(key)) continue
        assigned.add(key)
        yield c
      }
    }
    const iter = iterateCandidates()

    if (genForm.perDay && genForm.perDay > 0) {
      // target per-hari: isi sampai mencapai target (append aware)
      for (const d of DAY_KEYS) {
        const already = getDay(m.id, d).length
        const need = Math.max(0, genForm.perDay - already)
        for (let i=0; i<need; i++) {
          const next: any = iter.next()
          if (next.done) break
          await addMember(m.id, d, { santriId: next.value.id, name: next.value.name })
        }
      }
    } else {
      // round-robin: distribusikan semua kandidat yang tersisa
      let di = 0
      for (let next: any = iter.next(); !next.done; next = iter.next()) {
        const d = DAY_KEYS[di % DAY_KEYS.length]
        await addMember(m.id, d, { santriId: next.value.id, name: next.value.name })
        di++
      }
    }

    showGenModal.value = false
  } finally {
    generating.value = false
  }
}

async function reloadAll() {
  await Promise.all([fetchMaskan(), fetchSantri(), fetchPiket()])
}
</script>
