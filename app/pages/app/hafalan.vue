<template>
  <section class="p-4">
    <div class="flex items-center gap-2 mb-3">
        <h1 class="text-xl font-semibold">Hafalan Santri</h1>
        <span class="text-sm text-gray-500 dark:text-neutral-400">({{ totalFiltered }} entri)</span>
    </div>
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div class="flex flex-wrap items-center gap-2">
        <div class="relative">
          <Icon icon="lucide:search" class="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input v-model="q" placeholder="Cari nama / materi…" type="search"
                 class="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700 w-60"/>
        </div>
        <select v-model="fType" class="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700">
          <option value="all">Semua Tipe</option>
          <option value="alquran">Al-Qur'an</option><option value="kitab">Kitab</option><option value="pelajaran">Pelajaran</option>
        </select>
        <select v-model="fStatus" class="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700">
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option><option value="accepted">Diterima</option><option value="revisi">Revisi</option><option value="rejected">Ditolak</option>
        </select>
        <input v-model="dateFrom" type="date" class="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700"/>
        <input v-model="dateTo" type="date" class="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700"/>
        <button @click="reloadRange" class="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700">Terapkan</button>
        <button @click="openCreate" class="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">+ Tambah</button>
      </div>
    </div>

    <!-- Collapse: Ringkasan -->
    <details class="group mt-4 rounded-xl border border-gray-200 bg-white dark:bg-neutral-800">
      <summary class="flex items-center justify-between gap-2 p-4 cursor-pointer select-none">
        <div class="font-semibold">Ringkasan</div>
        <Icon icon="lucide:chevron-down" class="size-5 text-gray-500 transition group-open:rotate-180"/>
      </summary>
      <div class="border-t border-gray-200 dark:border-neutral-700 p-4 grid grid-cols-2 md:grid-cols-6 gap-3 text-sm">
        <div v-for="k in statKeys" :key="k" class="rounded-lg border border-gray-200 dark:border-neutral-700 p-4">
          <div class="text-gray-500 capitalize">{{ k }}</div>
          <div class="text-lg font-semibold">{{ stats[k] }}</div>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-neutral-700 p-4 md:col-span-2">
          <div class="text-gray-500">Rata skor</div>
          <div class="text-lg font-semibold">{{ avgScore }}</div>
        </div>
      </div>
    </details>

    <!-- Desktop Table -->
    <details class="group mt-4 hidden md:block rounded-2xl border border-gray-200 bg-white dark:bg-neutral-800 overflow-hidden">
      <summary class="flex items-center justify-between p-4 cursor-pointer select-none">
        <div class="font-semibold">Daftar Hafalan</div>
        <Icon icon="lucide:chevron-down" class="size-5 text-gray-500 transition group-open:rotate-180"/>
      </summary>
      <div class="border-t border-gray-200 dark:border-neutral-700 p-4 overflow-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-neutral-900/40">
            <tr>
              <th class="px-3 py-2 w-8"></th>
              <th class="px-3 py-2 text-left w-52">Santri</th>
              <th class="px-3 py-2 text-left">Materi</th>
              <th class="px-3 py-2 text-center w-28">Tipe</th>
              <th class="px-3 py-2 text-center w-20">Skor</th>
              <th class="px-3 py-2 text-center w-20">Pred</th>
              <th class="px-3 py-2 text-center w-28">Status</th>
              <th class="px-3 py-2 text-left w-40">Evaluator</th>
              <th class="px-3 py-2 text-center w-40">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-neutral-700">
            <template v-for="e in pagedRows" :key="e.id">
              <tr>
                <td class="px-3 py-2">
                  <button class="p-1 rounded border border-gray-200 dark:border-neutral-700" @click="toggleRow(e.id)">
                    <Icon :icon="expandedId===e.id?'lucide:chevron-up':'lucide:chevron-down'" class="size-4"/>
                  </button>
                </td>
                <td class="px-3 py-2">
                  <div class="font-medium truncate">{{ e.name }}</div>
                  <div class="text-[11px] text-gray-500 truncate">
                    {{ byId(e.santriId)?.maskan || '-' }} · {{ byId(e.santriId)?.kamar || '-' }}
                  </div>
                </td>
                <td class="px-3 py-2">{{ material(e) }}</td>
                <td class="px-3 py-2 text-center capitalize">{{ e.type }}</td>
                <td class="px-3 py-2 text-center">{{ e.score ?? '-' }}</td>
                <td class="px-3 py-2 text-center">{{ e.predikat || '-' }}</td>
                <td class="px-3 py-2 text-center">
                  <span :class="chipStatus(e.status)">{{ labelStatus(e.status) }}</span>
                </td>
                <td class="px-3 py-2">{{ e.evaluator || '-' }}</td>
                <td class="px-3 py-2">
                  <div class="flex items-center gap-1 justify-center">
                    <button v-if="e.status==='pending'||e.status==='revisi'" class="px-2 py-1 text-xs rounded bg-blue-600 text-white" @click="accept(e)">Terima</button>
                    <button v-if="e.status==='pending'" class="px-2 py-1 text-xs rounded border" @click="askRevisi(e)">Revisi</button>
                    <button class="px-2 py-1 text-xs rounded border text-rose-600" @click="reject(e)">Tolak</button>
                    <button class="px-2 py-1 text-xs rounded border" @click="openEdit(e)">Edit</button>
                    <button class="px-2 py-1 text-xs rounded border text-rose-600" @click="removeEntry(e)">Hapus</button>
                  </div>
                </td>
              </tr>
              <tr v-show="expandedId===e.id">
                <td></td>
                <td colspan="8" class="bg-gray-50 dark:bg-neutral-900/40">
                  <div class="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div class="rounded-lg border border-gray-200 dark:border-neutral-700 p-4">
                      <div class="text-gray-500 text-xs">Waktu</div>
                      <div class="text-sm">{{ fmt(e.submittedAt as number) }}</div>
                      <div class="text-xs text-gray-500" v-if="e.checkedAt">Dicek: {{ fmt(e.checkedAt) }}</div>
                    </div>
                    <div class="rounded-lg border border-gray-200 dark:border-neutral-700 p-4 md:col-span-2">
                      <div class="text-gray-500 text-xs">Catatan</div>
                      <div class="text-sm whitespace-pre-line">{{ e.note || '—' }}</div>
                    </div>
                    <div class="rounded-lg border border-gray-200 dark:border-neutral-700 p-4">
                      <div class="text-gray-500 text-xs">Lampiran Audio</div>
                      <div v-if="e.audioUrl" class="mt-1">
                        <audio :src="e.audioUrl" controls class="w-full"></audio>
                      </div>
                      <div v-else class="text-sm">—</div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-if="!pagedRows.length"><td colspan="9" class="px-3 py-6 text-center text-gray-500">Tidak ada data.</td></tr>
          </tbody>
        </table>
      </div>
      <div class="p-4 border-t border-gray-200 dark:border-neutral-700 flex items-center justify-end gap-2">
        <select v-model.number="pageSize" class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700">
          <option :value="10">10</option><option :value="20">20</option><option :value="50">50</option>
        </select>
        <div class="text-xs">Hal: {{ page }} / {{ totalPages || 1 }}</div>
        <button class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700" :disabled="page<=1" @click="page--">Prev</button>
        <button class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700" :disabled="page>=totalPages" @click="page++">Next</button>
      </div>
    </details>

    <!-- Mobile Cards -->
    <details class="group mt-4 md:hidden rounded-xl border border-gray-200 bg-white dark:bg-neutral-800">
      <summary class="flex items-center justify-between p-4 cursor-pointer select-none">
        <div class="font-semibold">Daftar Hafalan</div>
        <Icon icon="lucide:chevron-down" class="size-5 text-gray-500 transition group-open:rotate-180"/>
      </summary>
      <div class="border-t border-gray-200 dark:border-neutral-700 p-4 space-y-3">
        <div v-for="e in pagedRows" :key="e.id" class="rounded-xl border border-gray-200 dark:border-neutral-700">
          <details class="group">
            <summary class="flex items-start justify-between gap-2 p-4 cursor-pointer select-none">
              <div class="min-w-0">
                <div class="font-medium truncate">{{ e.name }}</div>
                <div class="text-[11px] text-gray-500 truncate">{{ byId(e.santriId)?.maskan || '-' }} • {{ byId(e.santriId)?.kamar || '-' }}</div>
                <div class="text-xs truncate">{{ material(e) }}</div>
              </div>
              <div class="text-right">
                <div class="text-xs capitalize">{{ e.type }}</div>
                <div class="text-lg font-semibold leading-none -mt-1">{{ e.score ?? '-' }}</div>
                <div class="text-xs">{{ e.predikat || '-' }}</div>
              </div>
            </summary>
            <div class="border-t border-gray-200 dark:border-neutral-700 p-4 space-y-2">
              <div><span :class="chipStatus(e.status)">{{ labelStatus(e.status) }}</span> • <span class="text-xs">{{ fmt(e.submittedAt as number) }}</span></div>
              <div class="text-sm whitespace-pre-line">{{ e.note || '—' }}</div>
              <div v-if="e.audioUrl"><audio :src="e.audioUrl" controls class="w-full"></audio></div>
              <div class="pt-2 flex flex-wrap items-center justify-end gap-2">
                <button v-if="e.status==='pending'||e.status==='revisi'" class="px-2 py-1 text-xs rounded bg-blue-600 text-white" @click="accept(e)">Terima</button>
                <button v-if="e.status==='pending'" class="px-2 py-1 text-xs rounded border" @click="askRevisi(e)">Revisi</button>
                <button class="px-2 py-1 text-xs rounded border text-rose-600" @click="reject(e)">Tolak</button>
                <button class="px-2 py-1 text-xs rounded border" @click="openEdit(e)">Edit</button>
                <button class="px-2 py-1 text-xs rounded border text-rose-600" @click="removeEntry(e)">Hapus</button>
              </div>
            </div>
          </details>
        </div>

        <div class="flex items-center justify-between">
          <button class="px-3 py-1.5 text-xs rounded border border-gray-200 dark:border-neutral-700" :disabled="page<=1" @click="page--">Prev</button>
          <div class="text-xs">Halaman {{ page }} / {{ totalPages || 1 }}</div>
          <button class="px-3 py-1.5 text-xs rounded border border-gray-200 dark:border-neutral-700" :disabled="page>=totalPages" @click="page++">Next</button>
        </div>
      </div>
    </details>

    <!-- Modal: Create / Edit -->
    <teleport to="body">
      <div v-if="showForm" class="fixed inset-0 z-[90]">
        <div class="absolute inset-0 bg-black/40" @click="closeForm"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-xl dark:bg-neutral-800 dark:border-neutral-700">
            <div class="p-4 border-b dark:border-neutral-700 flex items-center justify-between">
              <h3 class="font-semibold">{{ formMode==='create' ? 'Tambah Hafalan' : 'Ubah Hafalan' }}</h3>
              <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700" @click="closeForm"><Icon icon="lucide:x" class="size-4"/></button>
            </div>

            <form class="p-4 space-y-3 max-h-[80vh] overflow-y-auto" @submit.prevent="submitForm">
              <!-- Pilih santri (autocomplete) -->
              <div>
                <label class="text-xs text-gray-600 dark:text-neutral-300">Santri</label>
                <div class="relative">
                  <input v-model="form.name" @focus="sFocus=true" @blur="setTimeout(()=>sFocus=false,200)" @input="sQuery=form.name"
                         placeholder="Ketik nama santri…" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/>
                  <div v-if="(sFocus||sQuery) && sOptions.length" class="absolute z-20 mt-1 w-full rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg max-h-60 overflow-auto">
                    <button v-for="s in sOptions" :key="s.id" type="button" @mousedown.prevent="pickSantri(s)" class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800">
                      <div class="text-sm font-medium truncate">{{ s.santri }}</div>
                      <div class="text-[11px] text-gray-500 truncate">{{ s.maskan || '-' }} • {{ s.kamar || '-' }}</div>
                    </button>
                  </div>
                </div>
                <div v-if="form.santriId" class="mt-1 text-[11px] text-gray-500">SantriID: {{ form.santriId }}</div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label class="text-xs text-gray-600">Tipe</label>
                  <select v-model="form.type" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2">
                    <option value="alquran">Al-Qur'an</option><option value="kitab">Kitab</option><option value="pelajaran">Pelajaran</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs text-gray-600">Skor</label>
                  <input v-model.number="form.score" type="number" min="0" max="100" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/>
                </div>
                <div>
                  <label class="text-xs text-gray-600">Evaluator</label>
                  <input v-model.trim="form.evaluator" type="text" placeholder="Ustadz/Guru" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/>
                </div>
              </div>

              <!-- Meta by tipe -->
              <div v-if="form.type==='alquran'" class="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div class="sm:col-span-2"><label class="text-xs">Surah</label><input v-model.trim="form.metaQ.surah" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/></div>
                <div><label class="text-xs">Ayat Dari</label><input v-model.number="form.metaQ.ayatFrom" type="number" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/></div>
                <div><label class="text-xs">Ayat Sampai</label><input v-model.number="form.metaQ.ayatTo" type="number" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/></div>
                <div><label class="text-xs">Juz (opsional)</label><input v-model.number="form.metaQ.juz" type="number" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/></div>
                <div><label class="text-xs">Hal (opsional)</label><input v-model.number="form.metaQ.halaman" type="number" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/></div>
              </div>

              <div v-else-if="form.type==='kitab'" class="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div class="sm:col-span-2"><label class="text-xs">Kitab</label><input v-model.trim="form.metaK.kitab" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/></div>
                <div class="sm:col-span-2"><label class="text-xs">Bab</label><input v-model.trim="form.metaK.bab" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/></div>
                <div><label class="text-xs">Hal Dari</label><input v-model.number="form.metaK.halamanFrom" type="number" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/></div>
                <div><label class="text-xs">Hal Sampai</label><input v-model.number="form.metaK.halamanTo" type="number" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/></div>
              </div>

              <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div><label class="text-xs">Mapel</label><input v-model.trim="form.metaP.mapel" placeholder="Bahasa Arab" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/></div>
                <div class="sm:col-span-2"><label class="text-xs">Materi</label><input v-model.trim="form.metaP.materi" placeholder="Fi'il Madhi" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/></div>
                <div class="sm:col-span-3"><label class="text-xs">Submateri/Hal</label><input v-model.trim="form.metaP.submateri" placeholder="contoh & latihan hal.12-13" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/></div>
              </div>

              <div>
                <label class="text-xs">Catatan</label>
                <textarea v-model.trim="form.note" rows="3" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"></textarea>
              </div>

              <div>
                <label class="text-xs">Audio (opsional)</label>
                <input type="file" accept="audio/*" @change="onPickAudio" />
                <div v-if="audioFile" class="text-xs text-gray-500 mt-1">Terpilih: {{ audioFile.name }}</div>
              </div>
            </form>

            <div class="p-4 border-t dark:border-neutral-700 text-right">
              <button class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 mr-2" @click="closeForm">Batal</button>
              <button class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700" :disabled="saving" @click="submitForm">
                {{ saving ? 'Menyimpan…' : (formMode==='create' ? 'Simpan' : 'Update') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useSantri } from '~/composables/data/useSantri'
import { useHafalan, type HafalanEntry, type HafalanStatus } from '~/composables/data/useHafalan'

definePageMeta({ layout: 'app', layoutProps: { title: 'Hafalan' } })

/* Data sources */
const { rows: santri, fetchSantri, subscribeSantri, unsubscribeSantri } = useSantri()
const { rows, subscribeHafalan, unsubscribeHafalan, createHafalan, updateHafalan, deleteHafalan, setStatus, materialLabel } = useHafalan()

/* Filters */
const q = ref('')
const fType = ref<'all'|'alquran'|'kitab'|'pelajaran'>('all')
const fStatus = ref<'all'|'pending'|'accepted'|'rejected'|'revisi'>('all')
const dateFrom = ref<string>(''); const dateTo = ref<string>('')

function toEpoch(d?: string) { if (!d) return undefined; const t = new Date(d+'T00:00:00').getTime(); return isNaN(t)?undefined:t }
function endOf(d?: string) { if (!d) return undefined; const t = new Date(d+'T23:59:59').getTime(); return isNaN(t)?undefined:t }

function reloadRange() {
  const from = toEpoch(dateFrom.value); const to = endOf(dateTo.value)
  subscribeHafalan({ limit: 800, from, to })
}

/* Helpers */
const byId = (id?: string) => santri.value.find(s=>s.id===id)

/* Filtered + pagination */
const filtered = computed<HafalanEntry[]>(() => {
  let list = rows.value.slice()
  if (fType.value !== 'all') list = list.filter(x => x.type === fType.value)
  if (fStatus.value !== 'all') list = list.filter(x => x.status === fStatus.value)
  const s = q.value.trim().toLowerCase()
  if (s) {
    list = list.filter(e =>
      (e.name||'').toLowerCase().includes(s) ||
      material(e).toLowerCase().includes(s) ||
      (e.evaluator||'').toLowerCase().includes(s)
    )
  }
  return list
})
const totalFiltered = computed(()=> filtered.value.length)

const pageSize = ref(20)
const page = ref(1)
const totalPages = computed(()=> Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))
watch([filtered, pageSize], ()=>{ page.value = 1 })
const pagedRows = computed(()=> {
  const start = (page.value-1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

/* Stats */
const stats = computed(() => ({
  pending: filtered.value.filter(x=>x.status==='pending').length,
  accepted: filtered.value.filter(x=>x.status==='accepted').length,
  revisi: filtered.value.filter(x=>x.status==='revisi').length,
  rejected: filtered.value.filter(x=>x.status==='rejected').length
}))
const statKeys = ['pending','accepted','revisi','rejected']
const avgScore = computed(() => {
  const sc = filtered.value.map(x => Number(x.score||0))
  if (!sc.length) return 0
  return Math.round(sc.reduce((a,b)=>a+b,0)/sc.length)
})

/* Row expand */
const expandedId = ref<string|null>(null)
function toggleRow(id: string){ expandedId.value = expandedId.value === id ? null : id }

/* Pretty */
function fmt(ts?: number){ if (!ts) return '—'; const d = new Date(ts); return d.toLocaleString() }
function chipStatus(s: HafalanStatus) {
  const base = 'inline-flex items-center px-2 py-0.5 text-xs rounded'
  const map: Record<HafalanStatus,string> = {
    pending: `${base} bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300`,
    accepted:`${base} bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300`,
    revisi:  `${base} bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300`,
    rejected:`${base} bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300`,
  }
  return map[s]
}
function labelStatus(s: HafalanStatus){
  if (s==='accepted') return 'Diterima'
  if (s==='revisi') return 'Revisi'
  if (s==='rejected') return 'Ditolak'
  return 'Pending'
}
const material = (e:HafalanEntry)=> materialLabel(e)

/* Actions */
async function accept(e:HafalanEntry){ await setStatus(e.id, 'accepted') }
async function askRevisi(e:HafalanEntry){ await setStatus(e.id, 'revisi') }
async function reject(e:HafalanEntry){ await setStatus(e.id, 'rejected') }
async function removeEntry(e:HafalanEntry){ if (confirm(`Hapus hafalan ${e.name}?`)) await deleteHafalan(e.id) }

/* Modal form */
const showForm = ref(false)
const formMode = ref<'create'|'edit'>('create')
const saving = ref(false)
const audioFile = ref<File|null>(null)
const editing: any = ref<HafalanEntry|null>(null)

const form = reactive<{
  santriId?: string; name: string; type: 'alquran'|'kitab'|'pelajaran';
  score?: number; evaluator?: string; note?: string;
  metaQ: { surah: string; ayatFrom?: number; ayatTo?: number; juz?: number; halaman?: number }
  metaK: { kitab: string; bab?: string; halamanFrom?: number; halamanTo?: number }
  metaP: { mapel: string; materi: string; submateri?: string }
}>({
  name:'', santriId:'', type:'alquran', score:undefined, evaluator:'', note:'',
  metaQ:{ surah:'', ayatFrom:undefined, ayatTo:undefined, juz:undefined, halaman:undefined },
  metaK:{ kitab:'', bab:'', halamanFrom:undefined, halamanTo:undefined },
  metaP:{ mapel:'', materi:'', submateri:'' }
})

function resetForm(){
  Object.assign(form, {
    name:'', santriId:'', type:'alquran', score:undefined, evaluator:'', note:'',
    metaQ:{ surah:'', ayatFrom:undefined, ayatTo:undefined, juz:undefined, halaman:undefined },
    metaK:{ kitab:'', bab:'', halamanFrom:undefined, halamanTo:undefined },
    metaP:{ mapel:'', materi:'', submateri:'' }
  })
  audioFile.value = null
}

function openCreate(){ formMode.value='create'; resetForm(); showForm.value=true }
function openEdit(e:HafalanEntry){
  formMode.value='edit'; resetForm(); editing.value = e
  form.name = e.name; form.santriId = e.santriId; form.type = e.type; form.score = e.score; form.evaluator = e.evaluator || ''; form.note = e.note || ''
  if (e.type==='alquran') form.metaQ = { ...(e.meta as any) }
  else if (e.type==='kitab') form.metaK = { ...(e.meta as any) }
  else form.metaP = { ...(e.meta as any) }
  showForm.value = true
}
function closeForm(){ showForm.value=false }

function onPickAudio(ev: Event){ audioFile.value = (ev.target as HTMLInputElement).files?.[0] || null }

async function submitForm(){
  if (!form.name.trim()) { alert('Nama wajib diisi'); return }
  saving.value = true
  try {
    if (formMode.value==='create') {
      const meta = form.type==='alquran' ? form.metaQ : form.type==='kitab' ? form.metaK : form.metaP
      await createHafalan({
        santriId: String(form.santriId || ''),
        name: form.name.trim(),
        type: form.type,
        meta,
        score: form.score,
        evaluator: form.evaluator?.trim(),
        note: form.note?.trim(),
        status: 'pending',
        audioFile: audioFile.value || undefined
      })
    } else if (editing.value) {
      const patch:any = {
        score: form.score, evaluator: form.evaluator?.trim(), note: form.note?.trim(),
        meta: form.type==='alquran' ? form.metaQ : form.type==='kitab' ? form.metaK : form.metaP
      }
      if (audioFile.value) patch.audioFile = audioFile.value
      await updateHafalan(editing.value.id, patch)
    }
    showForm.value = false
  } finally { saving.value = false }
}

/* Autocomplete santri (form) */
const sFocus = ref(false); const sQuery = ref('')
const norm = (s?: any) => String(s ?? '').normalize('NFKC').trim().toLowerCase()
const sOptions = computed(() => {
  const q = norm(sQuery.value)
  if (!q) return []
  return santri.value.filter(s =>
    norm(s.santri).includes(q) || norm(s.maskan).includes(q) || norm(s.kamar).includes(q)
  ).slice(0, 20)
})
function pickSantri(s:any){ form.santriId = s.id; form.name = s.santri; sQuery.value=''; sFocus.value=false }

/* Lifecycle */
onMounted(async ()=>{ subscribeSantri(); await fetchSantri(); subscribeHafalan({ limit: 800 }) })
onUnmounted(()=>{ unsubscribeSantri(); unsubscribeHafalan() })
</script>

<style scoped>
.shadow-xs { box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05); }
</style>
