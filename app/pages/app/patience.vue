<template>
  <section class="p-4">
    <div class="flex items-center gap-2 mb-3">
        <h1 class="text-xl font-semibold">Buku Sabar (Ketertiban)</h1>
        <span class="text-sm text-gray-500 dark:text-neutral-400">({{ totalFiltered }} entri)</span>
    </div>
      <!-- ===== Header & Toolbar ===== -->
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

      <div class="flex flex-wrap items-center gap-2">
        <div class="relative">
          <Icon icon="lucide:search" class="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input v-model="q" type="search" placeholder="Cari nama/judul/lokasi…"
                 class="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700 w-56" />
        </div>

        <select v-model="fType" class="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700">
          <option value="all">Semua Tipe</option>
          <option value="pelanggaran">Pelanggaran</option>
          <option value="keteladanan">Keteladanan</option>
        </select>
        <select v-model="fCategory" class="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700">
          <option value="all">Semua Kategori</option>
          <option v-for="c in categories" :key="c" :value="c">{{ labelCategory(c) }}</option>
        </select>
        <select v-model="fSeverity" class="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700">
          <option value="all">Semua Level</option>
          <option>Ringan</option><option>Sedang</option><option>Berat</option>
        </select>
        <select v-model="fStatus" class="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700">
          <option value="all">Semua Status</option>
          <option value="open">Terbuka</option><option value="review">Review</option><option value="closed">Selesai</option><option value="void">Void</option>
        </select>

        <select v-model="selectedJenjang" class="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700">
          <option value="all">Semua Jenjang</option><option>SD</option><option>SMP</option><option>SMA</option><option>SMK</option>
        </select>
        <select v-model="selectedMaskan" class="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700">
          <option value="all">Semua Maskan</option>
          <option v-for="m in maskanOptions" :key="m" :value="m">{{ m }}</option>
        </select>

        <input v-model="dateFrom" type="date" class="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700" />
        <input v-model="dateTo" type="date" class="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700" />
        <button @click="reloadRange" class="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700">Terapkan</button>

        <div class="h-6 w-px bg-gray-200 dark:bg-neutral-700 mx-1"></div>

        <button @click="openCreate" class="py-2 px-3 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">+ Tambah</button>
        <button @click="exportCSV" class="py-2 px-3 text-sm rounded-lg border border-gray-200 dark:border-neutral-700">Export</button>
      </div>
    </div>

    <!-- ===== Collapse: Ringkasan & Distribusi ===== -->
    <details class="group mt-4 rounded-xl border border-gray-200 bg-white dark:bg-neutral-800">
      <summary class="flex items-center justify-between gap-2 p-4 cursor-pointer select-none">
        <div class="font-semibold">Ringkasan Per-Term — {{ termKey }}</div>
        <Icon icon="lucide:chevron-down" class="size-5 text-gray-500 transition group-open:rotate-180"/>
      </summary>
      <div class="border-t border-gray-200 dark:border-neutral-700 p-4 grid grid-cols-2 md:grid-cols-6 gap-3 text-sm">
        <div class="rounded-lg border border-gray-200 dark:border-neutral-700 p-4">
          <div class="text-gray-500">Total Entri</div>
          <div class="text-lg font-semibold">{{ totalFiltered }}</div>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-neutral-700 p-4">
          <div class="text-gray-500">Total Poin (-)</div>
          <div class="text-lg font-semibold text-rose-600">{{ totalMinus }}</div>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-neutral-700 p-4">
          <div class="text-gray-500">Total Poin (+)</div>
          <div class="text-lg font-semibold text-emerald-600">{{ totalPlus }}</div>
        </div>
        <div v-for="c in categories" :key="c" class="rounded-lg border border-gray-200 dark:border-neutral-700 p-4">
          <div class="text-gray-500">{{ labelCategory(c) }}</div>
          <div class="text-lg font-semibold">{{ distCategory[c] || 0 }}</div>
        </div>
      </div>

      <div class="px-4 pb-4">
        <div class="rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden">
          <div class="bg-gray-50 dark:bg-neutral-900/40 px-4 py-2 text-sm font-medium">Top 5 Saldo Sabar Terendah</div>
          <div class="divide-y divide-gray-200 dark:divide-neutral-800">
            <div v-for="r in saldoWorst" :key="r.id" class="px-4 py-2 text-sm flex items-center gap-2">
              <div class="min-w-0">
                <div class="font-medium truncate">{{ r.name }}</div>
                <div class="text-[11px] text-gray-500 truncate">{{ byId(r.id)?.maskan || '-' }} • {{ byId(r.id)?.kamar || '-' }}</div>
              </div>
              <div class="ml-auto font-semibold text-rose-600"> {{ r.saldo }} </div>
            </div>
            <div v-if="!saldoWorst.length" class="px-4 py-3 text-sm text-gray-500">Tidak ada data.</div>
          </div>
        </div>
      </div>
    </details>

    <!-- ===== Desktop Table (collapse) ===== -->
    <details class="group mt-4 hidden md:block rounded-2xl border border-gray-200 bg-white dark:bg-neutral-800 overflow-hidden">
      <summary class="flex items-center justify-between p-4 cursor-pointer select-none">
        <div class="font-semibold">Daftar Entri</div>
        <Icon icon="lucide:chevron-down" class="size-5 text-gray-500 transition group-open:rotate-180" />
      </summary>

      <div class="border-t border-gray-200 dark:border-neutral-700 p-4 overflow-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-neutral-900/40">
            <tr>
              <th class="px-3 py-2 w-8"></th>
              <th class="px-3 py-2 text-left w-48">Santri</th>
              <th class="px-3 py-2 text-left">Judul</th>
              <th class="px-3 py-2 text-center w-28">Tipe</th>
              <th class="px-3 py-2 text-center w-32">Kategori</th>
              <th class="px-3 py-2 text-center w-24">Level</th>
              <th class="px-3 py-2 text-center w-20">Poin</th>
              <th class="px-3 py-2 text-center w-28">Status</th>
              <th class="px-3 py-2 text-left w-40">Petugas</th>
              <th class="px-3 py-2 text-center w-40">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-neutral-700">
            <template v-for="e in pagedRows" :key="e.id">
              <tr>
                <td class="px-3 py-2">
                  <button class="p-1 rounded border border-gray-200 dark:border-neutral-700" @click="toggleRow(e.id)">
                    <Icon :icon="expandedId===e.id ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="size-4"/>
                  </button>
                </td>
                <td class="px-3 py-2">
                  <div class="font-medium truncate">{{ e.name }}</div>
                  <div class="text-[11px] text-gray-500 truncate">{{ byId(e.santriId)?.maskan || '-' }} • {{ byId(e.santriId)?.kamar || '-' }}</div>
                </td>
                <td class="px-3 py-2">{{ e.title }}</td>
                <td class="px-3 py-2 text-center capitalize">{{ e.type }}</td>
                <td class="px-3 py-2 text-center">{{ labelCategory(e.category) }}</td>
                <td class="px-3 py-2 text-center">{{ e.severity }}</td>
                <td class="px-3 py-2 text-center">
                  <span :class="e.points>=0 ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'">{{ e.points }}</span>
                </td>
                <td class="px-3 py-2 text-center"><span :class="chipStatus(e.status)">{{ labelStatus(e.status) }}</span></td>
                <td class="px-3 py-2">{{ e.handledBy || e.reportedBy || '-' }}</td>
                <td class="px-3 py-2">
                  <div class="flex items-center gap-1 justify-center">
                    <button class="px-2 py-1 text-xs rounded border" @click="toReview(e)" v-if="e.status==='open'">Review</button>
                    <button class="px-2 py-1 text-xs rounded bg-blue-600 text-white" @click="closeCase(e)" v-if="e.status==='review'">Selesai</button>
                    <button class="px-2 py-1 text-xs rounded border text-rose-600" @click="voidCase(e)" v-if="e.status!=='void'">Void</button>
                    <button class="px-2 py-1 text-xs rounded border" @click="openEdit(e)">Edit</button>
                    <button class="px-2 py-1 text-xs rounded border text-rose-600" @click="removeEntry(e)">Hapus</button>
                  </div>
                </td>
              </tr>

              <tr v-show="expandedId===e.id">
                <td></td>
                <td colspan="9" class="bg-gray-50 dark:bg-neutral-900/40">
                  <div class="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div class="rounded-lg border border-gray-200 dark:border-neutral-700 p-4">
                      <div class="text-gray-500 text-xs">Waktu</div>
                      <div class="text-sm">{{ fmt(e.createdAt as number) }}</div>
                      <div v-if="e.location" class="text-xs text-gray-500 mt-1">Lokasi: {{ e.location }}</div>
                    </div>
                    <div class="rounded-lg border border-gray-200 dark:border-neutral-700 p-4 md:col-span-2">
                      <div class="text-gray-500 text-xs">Deskripsi</div>
                      <div class="text-sm whitespace-pre-line">{{ e.desc || '—' }}</div>
                    </div>
                    <div class="rounded-lg border border-gray-200 dark:border-neutral-700 p-4">
                      <div class="text-gray-500 text-xs">Bukti</div>
                      <div v-if="e.evidenceUrl" class="mt-1">
                        <img :src="e.evidenceUrl" class="max-h-40 rounded-lg border border-gray-200 dark:border-neutral-700 object-contain"/>
                      </div>
                      <div v-else class="text-sm">—</div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-if="!pagedRows.length"><td colspan="10" class="px-3 py-6 text-center text-gray-500">Tidak ada data.</td></tr>
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

    <!-- ===== Mobile Cards (collapse) ===== -->
    <details class="group mt-4 md:hidden rounded-xl border border-gray-200 bg-white dark:bg-neutral-800">
      <summary class="flex items-center justify-between p-4 cursor-pointer select-none">
        <div class="font-semibold">Daftar Entri</div>
        <Icon icon="lucide:chevron-down" class="size-5 text-gray-500 transition group-open:rotate-180"/>
      </summary>

      <div class="border-t border-gray-200 dark:border-neutral-700 p-4 space-y-3">
        <div v-for="e in pagedRows" :key="e.id" class="rounded-xl border border-gray-200 dark:border-neutral-700">
          <details class="group">
            <summary class="flex items-start justify-between gap-2 p-4 cursor-pointer select-none">
              <div class="min-w-0">
                <div class="font-medium truncate">{{ e.name }}</div>
                <div class="text-[11px] text-gray-500 truncate">{{ byId(e.santriId)?.maskan || '-' }} • {{ byId(e.santriId)?.kamar || '-' }}</div>
                <div class="text-xs truncate">{{ e.title }}</div>
              </div>
              <div class="text-right">
                <div class="text-xs capitalize">{{ e.type }}</div>
                <div :class="['text-lg font-semibold leading-none -mt-1', e.points>=0 ? 'text-emerald-600' : 'text-rose-600']">{{ e.points }}</div>
                <div class="text-xs"><span :class="chipStatus(e.status)">{{ labelStatus(e.status) }}</span></div>
              </div>
            </summary>
            <div class="border-t border-gray-200 dark:border-neutral-700 p-4 space-y-2">
              <div class="text-sm whitespace-pre-line">{{ e.desc || '—' }}</div>
              <div v-if="e.evidenceUrl"><img :src="e.evidenceUrl" class="max-h-56 rounded-lg border border-gray-200 dark:border-neutral-700 object-contain"/></div>
              <div class="pt-2 flex flex-wrap items-center justify-end gap-2">
                <button class="px-2 py-1 text-xs rounded border" @click="toReview(e)" v-if="e.status==='open'">Review</button>
                <button class="px-2 py-1 text-xs rounded bg-blue-600 text-white" @click="closeCase(e)" v-if="e.status==='review'">Selesai</button>
                <button class="px-2 py-1 text-xs rounded border text-rose-600" @click="voidCase(e)" v-if="e.status!=='void'">Void</button>
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

    <!-- ===== Modal: Create/Edit ===== -->
    <teleport to="body">
      <div v-if="showForm" class="fixed inset-0 z-[90]">
        <div class="absolute inset-0 bg-black/40" @click="closeForm"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-xl dark:bg-neutral-800 dark:border-neutral-700">
            <div class="p-4 border-b dark:border-neutral-700 flex items-center justify-between">
              <h3 class="font-semibold">{{ formMode==='create' ? 'Tambah Entri' : 'Ubah Entri' }}</h3>
              <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700" @click="closeForm"><Icon icon="lucide:x" class="size-4"/></button>
            </div>

            <form class="p-4 space-y-3 max-h-[80vh] overflow-y-auto" @submit.prevent="submitForm">
              <!-- Santri (autocomplete) -->
              <div>
                <label class="text-xs text-gray-600 dark:text-neutral-300">Santri</label>
                <div class="relative">
                  <input v-model="form.name" @focus="sFocus=true" @blur="setTimeout(()=>sFocus=false,150)" @input="sQuery=form.name"
                         placeholder="Ketik nama santri…" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/>
                  <div v-if="(sFocus||sQuery) && sOptions.length" class="absolute z-20 mt-1 w-full rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg max-h-60 overflow-auto">
                    <button v-for="s in sOptions" :key="s.id" type="button" @mousedown.prevent="pickSantri(s)"
                            class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800">
                      <div class="text-sm font-medium truncate">{{ s.santri }}</div>
                      <div class="text-[11px] text-gray-500 truncate">{{ s.maskan || '-' }} • {{ s.kamar || '-' }}</div>
                    </button>
                  </div>
                </div>
                <div v-if="form.santriId" class="mt-1 text-[11px] text-gray-500">SantriID: {{ form.santriId }}</div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label class="text-xs">Tipe</label>
                  <select v-model="form.type" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2">
                    <option value="pelanggaran">Pelanggaran</option>
                    <option value="keteladanan">Keteladanan</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs">Kategori</label>
                  <select v-model="form.category" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2">
                    <option v-for="c in categories" :key="c" :value="c">{{ labelCategory(c) }}</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs">Level</label>
                  <select v-model="form.severity" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2">
                    <option>Ringan</option><option>Sedang</option><option>Berat</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div class="sm:col-span-2">
                  <label class="text-xs">Judul</label>
                  <input v-model.trim="form.title" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/>
                </div>
                <div>
                  <label class="text-xs">Poin (negatif untuk pelanggaran)</label>
                  <input v-model.number="form.points" type="number" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label class="text-xs">Pelapor</label>
                  <input v-model.trim="form.reportedBy" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/>
                </div>
                <div>
                  <label class="text-xs">Petugas</label>
                  <input v-model.trim="form.handledBy" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/>
                </div>
                <div>
                  <label class="text-xs">Lokasi</label>
                  <input v-model.trim="form.location" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label class="text-xs">Tahun Awal</label>
                  <input v-model.number="tahunAwal" type="number" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/>
                </div>
                <div>
                  <label class="text-xs">Semester</label>
                  <select v-model="semester" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2">
                    <option>Ganjil</option><option>Genap</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs">Term</label>
                  <input :value="termKey" disabled class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2 bg-gray-50 dark:bg-neutral-900/40"/>
                </div>
              </div>

              <div>
                <label class="text-xs">Deskripsi</label>
                <textarea v-model.trim="form.desc" rows="3" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"></textarea>
              </div>

              <div>
                <label class="text-xs">Bukti Foto (opsional)</label>
                <input type="file" accept="image/*" @change="onPickEvidence" />
                <div v-if="evidenceFile" class="text-xs text-gray-500 mt-1">Terpilih: {{ evidenceFile.name }}</div>
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
import { usePatience, type PatienceEntry, type PatienceCategory } from '~/composables/data/usePatience'

definePageMeta({ layout: 'app', layoutProps: { title: 'Buku Sabar' } })

/* ===== Sources ===== */
const { rows: santriRows, fetchSantri, subscribeSantri, unsubscribeSantri } = useSantri()
const {
  rows, subscribePatience, unsubscribePatience,
  createPatience, updatePatience, deletePatience,
  chipStatus, labelStatus, labelCategory, makeTermKey
} = usePatience()

/* ===== Filters ===== */
const q = ref('')
const fType = ref<'all'|'pelanggaran'|'keteladanan'>('all')
const fCategory = ref<'all'|PatienceCategory>('all')
const fSeverity = ref<'all'|'Ringan'|'Sedang'|'Berat'>('all')
const fStatus = ref<'all'|'open'|'review'|'closed'|'void'>('all')

const selectedJenjang = ref<'all'|'SD'|'SMP'|'SMA'|'SMK'>('all')
const selectedMaskan = ref<'all'|string>('all')

const categories: PatienceCategory[] = ['adab','kedisiplinan','kebersihan','ibadah','akademik','lainnya']

/* ===== Term & Range ===== */
const tahunAwal = ref<number>(new Date().getMonth() >= 6 ? new Date().getFullYear() : new Date().getFullYear()-1)
const semester = ref<'Ganjil'|'Genap'>(new Date().getMonth() >= 6 ? 'Ganjil' : 'Genap')
const termKey = computed(()=> makeTermKey(tahunAwal.value, semester.value))

const dateFrom = ref<string>(''); const dateTo = ref<string>('')
function toEpoch(d?: string){ if(!d) return undefined; const t = new Date(d+'T00:00:00').getTime(); return isNaN(t) ? undefined : t }
function endOf(d?: string){ if(!d) return undefined; const t = new Date(d+'T23:59:59').getTime(); return isNaN(t) ? undefined : t }
function reloadRange(){
  subscribePatience({ limit: 1200, from: toEpoch(dateFrom.value), to: endOf(dateTo.value), term: termKey.value })
}

/* ===== Maskan options ===== */
const maskanOptions = computed(() => {
  const s = new Set<string>()
  santriRows.value.forEach(x => (x.maskan||'').trim() && s.add((x.maskan||'').trim()))
  return Array.from(s).sort((a,b)=>a.localeCompare(b))
})

/* ===== Filtered & Paginate ===== */
const byId = (id?: string) => santriRows.value.find(s => s.id === id)

const filtered = computed<PatienceEntry[]>(() => {
  let list = rows.value.filter(x => (x.term||'') === termKey.value)
  if (fType.value !== 'all') list = list.filter(x => x.type === fType.value)
  if (fCategory.value !== 'all') list = list.filter(x => x.category === fCategory.value)
  if (fSeverity.value !== 'all') list = list.filter(x => x.severity === fSeverity.value)
  if (fStatus.value !== 'all') list = list.filter(x => x.status === fStatus.value)

  if (selectedJenjang.value !== 'all') list = list.filter(x =>
    (byId(x.santriId)?.jenjang || '').toUpperCase().includes(selectedJenjang.value)
  )
  if (selectedMaskan.value !== 'all') list = list.filter(x => (byId(x.santriId)?.maskan || '') === selectedMaskan.value)

  const s = q.value.trim().toLowerCase()
  if (s) list = list.filter(e =>
    [e.name, e.title, e.location, e.reportedBy, e.handledBy].some(v => (v||'').toLowerCase().includes(s))
  )

  return list.sort((a,b) => (b.createdAt as number) - (a.createdAt as number))
})
const totalFiltered = computed(()=> filtered.value.length)

const pageSize = ref(20)
const page = ref(1)
const totalPages = computed(()=> Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))
watch([filtered, pageSize], ()=> { page.value = 1 })
const pagedRows = computed(()=> {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

/* ===== Summary ===== */
const totalMinus = computed(()=> filtered.value.filter(x => x.points < 0).reduce((a,b)=>a + (b.points||0), 0))
const totalPlus  = computed(()=> filtered.value.filter(x => x.points > 0).reduce((a,b)=>a + (b.points||0), 0))
const distCategory = computed<Record<PatienceCategory, number>>(() => {
  const obj: any = {}
  for (const c of categories) obj[c] = 0
  for (const e of filtered.value) obj[e.category] = (obj[e.category] || 0) + 1
  return obj
})
// Saldo sabar per santri (jumlah poin)
const saldoWorst = computed(() => {
  const map = new Map<string, { id: string; name: string; saldo: number }>()
  for (const e of filtered.value) {
    const prev = map.get(e.santriId)?.saldo || 0
    map.set(e.santriId, { id: e.santriId, name: e.name, saldo: prev + Number(e.points||0) })
  }
  return Array.from(map.values()).sort((a,b)=> (a.saldo - b.saldo)).slice(0,5)
})

/* ===== Row expand ===== */
const expandedId = ref<string|null>(null)
function toggleRow(id: string){ expandedId.value = expandedId.value === id ? null : id }
function fmt(ts?: number){ if (!ts) return '—'; const d = new Date(ts); return d.toLocaleString() }

/* ===== CRUD Modal ===== */
const showForm = ref(false)
const formMode = ref<'create'|'edit'>('create')
const saving = ref(false)
const editing = ref<PatienceEntry|null>(null)
const evidenceFile = ref<File|null>(null)

const form = reactive<{
  santriId?: string; name: string; type: 'pelanggaran'|'keteladanan';
  category: PatienceCategory; severity: 'Ringan'|'Sedang'|'Berat';
  title: string; desc?: string; points: number;
  reportedBy?: string; handledBy?: string; location?: string;
}>({
  name:'', santriId:'', type:'pelanggaran',
  category:'kedisiplinan', severity:'Ringan',
  title:'', desc:'', points:-1,
  reportedBy:'', handledBy:'', location:''
})

function resetForm(){
  Object.assign(form, {
    name:'', santriId:'', type:'pelanggaran',
    category:'kedisiplinan', severity:'Ringan',
    title:'', desc:'', points:-1,
    reportedBy:'', handledBy:'', location:''
  })
  evidenceFile.value = null
}
function onPickEvidence(ev: Event){ evidenceFile.value = (ev.target as HTMLInputElement).files?.[0] || null }

function openCreate(){ formMode.value='create'; resetForm(); showForm.value = true }
function openEdit(e: PatienceEntry){
  formMode.value='edit'; resetForm(); editing.value = e
  Object.assign(form, {
    santriId: e.santriId, name: e.name, type: e.type,
    category: e.category, severity: e.severity,
    title: e.title, desc: e.desc || '', points: e.points,
    reportedBy: e.reportedBy || '', handledBy: e.handledBy || '', location: e.location || ''
  })
  showForm.value = true
}
function closeForm(){ showForm.value = false }

async function submitForm(){
  if (!form.name.trim()) { alert('Nama wajib diisi'); return }
  if (!form.title.trim()) { alert('Judul wajib diisi'); return }
  saving.value = true
  try {
    if (formMode.value==='create') {
      await createPatience({
        santriId: String(form.santriId || ''),
        name: form.name.trim(),
        type: form.type,
        category: form.category,
        severity: form.severity,
        title: form.title.trim(),
        desc: form.desc?.trim(),
        points: Number(form.points||0),
        reportedBy: form.reportedBy?.trim(),
        handledBy: form.handledBy?.trim(),
        location: form.location?.trim(),
        status: 'open',
        term: termKey.value,
        createdAt: 0, // ignored by serverTimestamp()
        evidenceUrl: null, evidencePath: null,
        evidenceFile: evidenceFile.value || undefined
      } as any)
    } else if (editing.value) {
      await updatePatience(editing.value.id, {
        santriId: form.santriId, name: form.name.trim(), type: form.type,
        category: form.category, severity: form.severity,
        title: form.title.trim(), desc: form.desc?.trim(), points: Number(form.points||0),
        reportedBy: form.reportedBy?.trim(), handledBy: form.handledBy?.trim(), location: form.location?.trim(),
        term: termKey.value,
        evidenceFile: evidenceFile.value || undefined
      } as any)
    }
    showForm.value = false
  } finally { saving.value = false }
}

/* ===== Row actions ===== */
async function toReview(e: PatienceEntry){ await updatePatience(e.id, { status: 'review' }) }
async function closeCase(e: PatienceEntry){ await updatePatience(e.id, { status: 'closed' }) }
async function voidCase(e: PatienceEntry){ if (confirm('Jadikan VOID entri ini?')) await updatePatience(e.id, { status: 'void' }) }
async function removeEntry(e: PatienceEntry){ if (confirm(`Hapus entri: ${e.title}?`)) await deletePatience(e.id) }

/* ===== Export CSV ===== */
function exportCSV(){
  const header = ['id','term','waktu','santriId','nama','tipe','kategori','level','judul','deskripsi','poin','pelapor','petugas','lokasi','status']
  const lines = [header.join(',')]
  for (const e of filtered.value) {
    const cols = [
      e.id, e.term || '', new Date(e.createdAt as number).toISOString(),
      e.santriId, e.name, e.type, e.category, e.severity,
      e.title, (e.desc||'').replace(/\n/g,' '), e.points,
      e.reportedBy||'', e.handledBy||'', e.location||'', e.status
    ].map(x => `"${String(x).replace(/"/g,'""')}"`)
    lines.push(cols.join(','))
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob); const a = document.createElement('a')
  a.href = url; a.download = `patience_${termKey.value}.csv`; a.click(); URL.revokeObjectURL(url)
}

/* ===== Autocomplete Santri ===== */
const sFocus = ref(false); const sQuery = ref('')
const norm = (s?: any) => String(s ?? '').normalize('NFKC').trim().toLowerCase()
const sOptions = computed(() => {
  const q = norm(sQuery.value)
  if (!q) return []
  return santriRows.value
    .filter(s => norm(s.santri).includes(q) || norm(s.maskan).includes(q) || norm(s.kamar).includes(q))
    .slice(0, 20)
})
function pickSantri(s:any){ form.santriId = s.id; form.name = s.santri; sQuery.value=''; sFocus.value=false }

/* ===== Lifecycle ===== */
onMounted(async () => {
  subscribeSantri(); await fetchSantri()
  subscribePatience({ limit: 1200, term: termKey.value })
})
onUnmounted(() => { unsubscribeSantri(); unsubscribePatience() })
</script>

<style scoped>
.shadow-xs{ box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05); }
</style>
