<!-- /pages/app/patience.vue -->
<template>
  <section class="p-6">
    <!-- ====== HEADER ====== -->
    <div class="flex mb-3 items-center gap-2">
      <h1 class="text-xl font-semibold">Buku Sabar</h1>
      <span class="text-sm text-gray-500 dark:text-neutral-400">({{ totalFiltered }} santri)</span>
    </div>

    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <!-- Controls -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Search -->
        <div class="relative">
          <Icon icon="lucide:search" class="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input v-model="q" type="search" placeholder="Cari santri/maskan/kamar…"
                 class="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700 w-56"/>
        </div>

        <!-- Filters -->
        <select v-model="selectedJenjang" class="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700">
          <option value="all">Semua Jenjang</option><option>SD</option><option>SMP</option><option>SMA</option><option>SMK</option>
        </select>
        <select v-model="selectedMaskan" class="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700">
          <option value="all">Semua Maskan</option>
          <option v-for="m in maskanOptions" :key="m" :value="m">{{ m }}</option>
        </select>

        <!-- Term -->
        <input v-model.number="tahunAwal" type="number" class="w-24 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700" />
        <select v-model="semester" class="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700">
          <option>Ganjil</option><option>Genap</option>
        </select>

        <!-- Bulan -->
        <select v-model.number="bulan" class="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700">
          <option v-for="(m, i) in bulanLabel" :key="i" :value="i+1">{{ m }}</option>
        </select>
        <input v-model.number="tahun" type="number" class="w-24 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700" />
        <button class="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700" @click="reloadMonth">Terapkan</button>

        <!-- Ellipsis menu -->
        <div class="relative" @keydown.esc="showKebab=false">
          <button @click="showKebab=!showKebab"
                  class="py-2 px-3 text-sm rounded-lg border border-gray-200 dark:border-neutral-700">
            <Icon icon="lucide:more-horizontal" class="size-5"/>
          </button>

          <div v-if="showKebab"
               class="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 bg-white shadow-lg dark:bg-neutral-800 dark:border-neutral-700 z-10"
               @click.stop>
            <div class="p-1 text-sm">
              <button class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-700 rounded-lg"
                      @click="exportCSV(); showKebab=false">Export CSV</button>

              <div v-if="selectedCount" class="my-1 border-t dark:border-neutral-700"></div>

              <button v-if="selectedCount"
                      class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-700 rounded-lg"
                      @click="saveSelected(); showKebab=false">
                Simpan Entri (Terpilih)
              </button>
              <button v-if="selectedCount"
                      class="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-neutral-700 rounded-lg"
                      @click="openDeleteMonthSelected(); showKebab=false">
                Hapus Semua Entri Bulan Ini (Terpilih)
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ====== COLLAPSE: Info Periode ====== -->
    <details class="group mt-4 rounded-xl border border-gray-200 bg-white dark:bg-neutral-800" open>
      <summary class="flex items-center justify-between gap-2 p-4 cursor-pointer select-none">
        <div class="font-semibold">Periode</div>
        <Icon icon="lucide:chevron-down" class="size-5 text-gray-500 transition group-open:rotate-180"/>
      </summary>
      <div class="border-t border-gray-200 dark:border-neutral-700 p-4 text-sm grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <div class="text-gray-500">Tahun Ajaran / Semester</div>
          <div class="font-medium">{{ termKey }}</div>
        </div>
        <div>
          <div class="text-gray-500">Bulan</div>
          <div class="font-medium">{{ bulanLabel[bulan-1] }} {{ tahun }}</div>
        </div>
        <div>
          <div class="text-gray-500">Ringkasan</div>
          <div class="font-medium">
            Total Entri: {{ totalEntries }} • Distribusi:
            <span>S. Kurang: {{ dist.sangatKurang }}</span> ·
            <span>Kurang: {{ dist.kurang }}</span> ·
            <span>Cukup: {{ dist.cukup }}</span> ·
            <span>Baik: {{ dist.baik }}</span> ·
            <span>S. Baik: {{ dist.sangatBaik }}</span>
          </div>
        </div>
      </div>
    </details>

    <!-- ====== PER KAMAR (LIST KOLLAPS) ====== -->
    <details v-if="mode==='kamar'" class="group mt-4 rounded-2xl border border-gray-200 bg-white dark:bg-neutral-800 overflow-hidden" open>
      <summary class="flex items-center justify-between p-4 cursor-pointer select-none">
        <div class="font-semibold">Input Cepat Per Kamar</div>
        <Icon icon="lucide:chevron-down" class="size-5 text-gray-500 transition group-open:rotate-180"/>
      </summary>

      <div class="border-t border-gray-200 dark:border-neutral-700 p-4 space-y-4">
        <div class="text-xs text-gray-500">
          Term: <b>{{ termKey }}</b> • Periode: <b>{{ bulanLabel[bulan-1] }} {{ tahun }}</b>
        </div>

        <div class="rounded-xl border border-gray-200 dark:border-neutral-700 divide-y dark:divide-neutral-700">
          <div v-for="mg in maskanKamarTree" :key="mg.maskan" class="p-0">
            <details class="group" open>
              <summary class="flex items-center justify-between px-4 py-3 cursor-pointer">
                <div class="font-semibold">{{ mg.maskan || '(Tanpa Maskan)' }}</div>
                <div class="text-xs text-gray-500">{{ mg.total }} kamar</div>
              </summary>

              <div class="pb-2">
                <div v-for="kg in mg.kamars" :key="kg.key" class="px-4 py-2">
                  <details class="group">
                    <summary class="flex items-center justify-between cursor-pointer rounded-lg px-3 py-2 border border-gray-200 dark:border-neutral-700 bg-gray-50/60 dark:bg-neutral-900/40">
                      <div class="flex items-center gap-2">
                        <span class="font-medium">Kamar {{ kg.kamar || '(?)' }}</span>
                        <span class="text-xs text-gray-500">• {{ kg.count }} santri</span>
                      </div>
                      <Icon icon="lucide:chevron-down" class="size-4 text-gray-500 transition group-open:rotate-180"/>
                    </summary>

                    <div class="mt-2 rounded-lg border border-gray-200 dark:border-neutral-700 p-3 space-y-3">
                      <div class="rounded-lg border border-gray-200 dark:border-neutral-700 p-3 bg-white/50 dark:bg-neutral-900/40">
                        <div class="text-xs font-medium mb-2">Isi Massal (Kamar {{ kg.kamar }})</div>
                        <div class="flex flex-wrap items-center gap-2">
                          <select v-model="getFillFor(kg.key).adab"
                                  class="px-2 py-1 text-sm rounded border border-gray-200 dark:border-neutral-700">
                            <option :value="''">Adab: —</option>
                            <option v-for="opt in RATING_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                          </select>
                          <select v-model="getFillFor(kg.key).kedisiplinan"
                                  class="px-2 py-1 text-sm rounded border border-gray-200 dark:border-neutral-700">
                            <option :value="''">Kedisiplinan: —</option>
                            <option v-for="opt in RATING_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                          </select>
                          <input v-model.trim="getFillFor(kg.key).note" type="text"
                                placeholder="Catatan umum (opsional)"
                                class="min-w-[16rem] flex-1 px-2 py-1 text-sm rounded border border-gray-200 dark:border-neutral-700"/>

                          <button class="px-3 py-1.5 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700"
                                  @click="applyFillFor(kg.key)">Terapkan</button>
                          <button class="px-3 py-1.5 text-xs rounded border border-gray-200 dark:border-neutral-700"
                                  @click="clearFillFor(kg.key)">Reset</button>
                        </div>
                      </div>

                      <!-- Tabel anggota kamar -->
                      <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-neutral-700">
                        <table class="min-w-full text-sm">
                          <thead class="bg-gray-50 dark:bg-neutral-900/40">
                            <tr class="text-left">
                              <th class="px-3 py-2 w-64">Santri</th>
                              <th class="px-3 py-2 w-40 text-center">Adab</th>
                              <th class="px-3 py-2 w-44 text-center">Kedisiplinan</th>
                              <th class="px-3 py-2">Catatan</th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-gray-100 dark:divide-neutral-700">
                            <tr v-for="s in kg.members" :key="s.id">
                              <td class="px-3 py-2">
                                <div class="font-medium truncate">{{ s.santri }}</div>
                                <div class="text-[11px] text-gray-500 truncate">{{ s.maskan || '-' }} • {{ s.kamar || '-' }}</div>
                              </td>

                              <td class="px-3 py-2 text-center">
                                <select v-model="getRoomDraft(s.id).adab"
                                        @change="onDraftChange(s.id)"
                                        class="w-36 text-sm rounded border border-gray-200 dark:border-neutral-700 px-2 py-1">
                                  <option :value="''">—</option>
                                  <option v-for="opt in RATING_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                                </select>
                              </td>

                              <td class="px-3 py-2 text-center">
                                <select v-model="getRoomDraft(s.id).kedisiplinan"
                                        @change="onDraftChange(s.id)"
                                        class="w-40 text-sm rounded border border-gray-200 dark:border-neutral-700 px-2 py-1">
                                  <option :value="''">—</option>
                                  <option v-for="opt in RATING_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                                </select>
                              </td>

                              <td class="px-3 py-2">
                                <input v-model.trim="getRoomDraft(s.id).note"
                                      @input="onDraftChange(s.id)"
                                      type="text" placeholder="Catatan (opsional)"
                                      class="w-full rounded border border-gray-200 dark:border-neutral-700 px-2 py-1"/>
                              </td>
                            </tr>

                            <tr v-if="!kg.members.length">
                              <td colspan="4" class="px-3 py-6 text-center text-gray-500">Tidak ada anggota.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <!-- Aksi kamar -->
                      <div class="flex flex-wrap items-center justify-between gap-2">
                        <div class="text-xs text-gray-500">
                          Draft kamar ini: <b>{{ countRated(kg.key) }}</b> santri terisi
                        </div>
                        <div class="flex items-center gap-2">
                          <button class="px-3 py-1.5 text-xs rounded border border-gray-200 dark:border-neutral-700" @click="exportRoomCSVFor(kg.key)" :disabled="!kg.members.length">Export CSV</button>
                          <button class="px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700" @click="saveRoomFor(kg.key)" :disabled="!kg.members.length || savingRoom">
                            {{ savingRoom ? 'Menyimpan…' : 'Simpan Kamar Ini' }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </details>

    <!-- ===== Modal: Create/Edit (dipakai saat Edit entri) ===== -->
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
                  <label class="text-xs">Penilaian</label>
                  <select v-model="form.rating" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2">
                    <option v-for="opt in RATING_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                  </select>
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

    <!-- ===== Modal: Hapus entri bulan ini (Terpilih) ===== -->
    <teleport to="body">
      <div v-if="showDeleteMonth" class="fixed inset-0 z-[96]">
        <div class="absolute inset-0 bg-black/40" @click="closeDeleteMonth"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-xl dark:bg-neutral-800 dark:border-neutral-700">
            <div class="p-4 border-b dark:border-neutral-700 flex items-center gap-3">
              <div class="flex items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 w-9 h-9">
                <Icon icon="lucide:trash-2" class="size-5"/>
              </div>
              <div>
                <h3 class="font-semibold">Hapus Semua Entri Bulan Ini</h3>
                <p class="text-xs text-gray-500">Untuk {{ selectedCount }} santri pada {{ bulanLabel[bulan-1] }} {{ tahun }}.</p>
              </div>
            </div>

            <div class="p-4 text-sm space-y-2">
              <div class="rounded border border-rose-200 bg-rose-50 p-3 text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-200">
                Tindakan ini akan menghapus <b>seluruh entri</b> bulan ini milik santri yang dipilih.
              </div>
              <div>
                <label class="text-xs text-gray-500">Ketik <b>HAPUS</b> untuk konfirmasi</label>
                <input v-model.trim="deleteMonthConfirm" placeholder="HAPUS"
                       class="mt-1 w-full rounded border p-2 border-gray-200 dark:border-neutral-700"/>
              </div>
            </div>

            <div class="p-4 border-t dark:border-neutral-700 flex items-center justify-between">
              <button class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700" :disabled="deleting" @click="closeDeleteMonth">Batal</button>
              <button class="px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
                      :disabled="deleteMonthConfirm.toUpperCase()!=='HAPUS' || deleting"
                      @click="performDeleteMonthSelected">
                <span v-if="!deleting">Hapus</span>
                <span v-else>Menghapus…</span>
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
import { useNuxtApp } from '#app'
import { ref as dbRef, onValue, off, set } from 'firebase/database'

definePageMeta({ layout: 'app', layoutProps: { title: 'Buku Sabar' } })

/* ===== Sources ===== */
const { rows: santriRows, fetchSantri, subscribeSantri, unsubscribeSantri } = useSantri()
const {
  rows, subscribePatience, unsubscribePatience,
  createPatience, updatePatience, deletePatience,
  labelCategory, makeTermKey
} = usePatience()

/* ===== Mode ===== */
const mode = ref<'kamar'|'santri'>('kamar')

/* ===== Term & Bulan ===== */
const tahunAwal = ref<number>(new Date().getMonth() >= 6 ? new Date().getFullYear() : new Date().getFullYear()-1)
const semester = ref<'Ganjil'|'Genap'>(new Date().getMonth() >= 6 ? 'Ganjil' : 'Genap')
const termKey = computed(()=> makeTermKey(tahunAwal.value, semester.value))

const now = new Date()
const bulanLabel = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
const bulan = ref<number>(now.getMonth()+1)
const tahun = ref<number>(now.getFullYear())

const monthKey = computed(() => `${tahun.value}-${String(bulan.value).padStart(2,'0')}`)
const draftBasePath = computed(() => `alberr/patience/drafts/${termKey.value}/${monthKey.value}`)

const monthFrom = computed(()=> new Date(tahun.value, bulan.value-1, 1, 0,0,0,0).getTime())
const monthTo   = computed(()=> new Date(tahun.value, bulan.value,   0, 23,59,59,999).getTime())
function reloadMonth(){ subscribePatience({ limit: 5000, from: monthFrom.value, to: monthTo.value, term: termKey.value }) }
watch([bulan, tahun, termKey], () => reloadMonth())

const q = ref('')
const selectedJenjang = ref<'all'|'SD'|'SMP'|'SMA'|'SMK'>('all')
const selectedMaskan = ref<'all'|string>('all')

const maskanOptions = computed(()=> {
  const s = new Set<string>()
  santriRows.value.forEach(x => (x.maskan||'').trim() && s.add((x.maskan||'').trim()))
  return Array.from(s).sort((a,b)=>a.localeCompare(b))
})

const monthEntries = computed<PatienceEntry[]>(() => rows.value.slice())
const entriesBySantri = computed<Map<string, PatienceEntry[]>>(() => {
  const m = new Map<string, PatienceEntry[]>()
  for (const e of monthEntries.value) {
    const arr = m.get(e.santriId) || []
    arr.push(e)
    m.set(e.santriId, arr)
  }
  for (const [k, arr] of m) arr.sort((a,b)=>(b.createdAt as number)-(a.createdAt as number))
  return m
})
const saldoBySantri = computed<Record<string, number>>(() => {
  const o: Record<string, number> = {}
  for (const e of monthEntries.value) o[e.santriId] = (o[e.santriId]||0) + Number(e.points||0)
  return o
})
const totalEntries = computed(()=> monthEntries.value.length)

const filteredSantri = computed(()=> {
  let list = santriRows.value.slice()
  if (selectedJenjang.value !== 'all') list = list.filter(s => (s.jenjang||'').toUpperCase().includes(selectedJenjang.value))
  if (selectedMaskan.value !== 'all') list = list.filter(s => (s.maskan||'') === selectedMaskan.value)
  const s = q.value.trim().toLowerCase()
  if (s) list = list.filter(x => [x.santri, x.maskan, x.kamar].some(v => (v||'').toLowerCase().includes(s)))
  return list.sort((a,b)=> (a.santri||'').localeCompare(b.santri||''))
})
const totalFiltered = computed(()=> filteredSantri.value.length)

const pageSize = ref(20)
const page = ref(1)
watch([filteredSantri, pageSize], ()=> { page.value = 1 })

const categories: PatienceCategory[] = ['akademik','kebersihan','ibadah','lainnya']
function selectedMonthMidTs(){ return new Date(tahun.value, bulan.value-1, 15, 12, 0, 0, 0).getTime() }

const selected = ref<string[]>([])
const selectedCount = computed(()=> selected.value.length)
const showKebab = ref(false)
const showDeleteMonth = ref(false)
const deleteMonthConfirm = ref('')
const deleting = ref(false)
function openDeleteMonthSelected(){
  if (!selectedCount.value) { return }
  deleteMonthConfirm.value = ''
  showDeleteMonth.value = true
}
function closeDeleteMonth(){ if (!deleting.value) showDeleteMonth.value = false }
async function performDeleteMonthSelected(){
  if (deleteMonthConfirm.value.toUpperCase()!=='HAPUS' || deleting.value) return
  deleting.value = true
  try{
    for (const id of selected.value){
      const list = (entriesBySantri.value.get(id) || [])
      for (const e of list){ await deletePatience(e.id) }
    }
    showDeleteMonth.value = false
  } catch(e:any){
  } finally { deleting.value = false }
}

const RATING_OPTIONS = [
  { value: 'SANGAT_KURANG', label: 'Sangat Kurang', points: -2 },
  { value: 'KURANG',        label: 'Kurang',        points: -1 },
  { value: 'CUKUP',         label: 'Cukup',         points:  0 },
  { value: 'BAIK',          label: 'Baik',          points:  1 },
  { value: 'SANGAT_BAIK',   label: 'Sangat Baik',   points:  2 },
] as const
type RatingValue = typeof RATING_OPTIONS[number]['value']
const labelRating = (r?: RatingValue|null) =>
  RATING_OPTIONS.find(x=>x.value===r)?.label || '-'
const ratingToPoints = (r?: RatingValue|null) =>
  RATING_OPTIONS.find(x=>x.value===r)?.points ?? 0
const pointsToRating = (p: number): RatingValue =>
  p>=2 ? 'SANGAT_BAIK' : p===1 ? 'BAIK' : p===0 ? 'CUKUP' : p===-1 ? 'KURANG' : 'SANGAT_KURANG'

const showForm = ref(false)
const formMode = ref<'create'|'edit'>('create')
const saving = ref(false)
const editing = ref<PatienceEntry|null>(null)
const evidenceFile = ref<File|null>(null)
const form = reactive<any>({
  name:'', santriId:'', type:'pelanggaran',
  category:'lainnya', severity:'Ringan',
  title:'', desc:'', rating:'' as RatingValue|'',
  reportedBy:'', handledBy:'', location:''
})

const dist = computed(() => {
  let sangatKurang=0, kurang=0, cukup=0, baik=0, sangatBaik=0
  for (const e of monthEntries.value) {
    const r = pointsToRating(Number(e.points||0))
    if (r==='SANGAT_KURANG') sangatKurang++
    else if (r==='KURANG') kurang++
    else if (r==='CUKUP') cukup++
    else if (r==='BAIK') baik++
    else if (r==='SANGAT_BAIK') sangatBaik++
  }
  return { sangatKurang, kurang, cukup, baik, sangatBaik }
})
function onPickEvidence(ev: Event){ evidenceFile.value = (ev.target as HTMLInputElement).files?.[0] || null }

function closeForm(){ showForm.value = false }
async function submitForm(){
  if (!form.name?.trim() || !form.title?.trim()) { return }
  saving.value = true
  try {
    if (formMode.value==='edit' && editing.value) {
      await updatePatience(editing.value.id, {
        santriId: form.santriId, name: form.name.trim(), type: form.type,
        category: form.category, severity: form.severity,
        title: form.title.trim(), desc: form.desc?.trim(),  points: ratingToPoints(form.rating as RatingValue),
        reportedBy: form.reportedBy?.trim(), handledBy: form.handledBy?.trim(), location: form.location?.trim(),
        term: termKey.value,
        evidenceFile: evidenceFile.value || undefined
      } as any)
      showForm.value = false
    }
  } finally { saving.value = false }
}

function countRated(key:string){
  let n = 0
  for (const s of membersForKey(key)){
    const d = roomDraft[s.id]
    if (d?.rating) n++
  }
  return n
}

function exportCSV(){
  const header = ['term','bulan','tahun','santriId','nama','rating','tipe','kategori','level','judul','status','waktu']
  const lines = [header.join(',')]
  for (const s of filteredSantri.value){
    const saldo = saldoBySantri.value[s.id] ?? 0
    const list = entriesBySantri.value.get(s.id) || []
    if (!list.length){
      const cols = [termKey.value, bulanLabel[bulan.value-1], tahun.value, s.id, s.santri||'', saldo, '', '', '', '', '', '', '']
        .map(x => `"${String(x).replace(/"/g,'""')}"`)
      lines.push(cols.join(','))
    } else {
      for (const e of list){
        const cols = [
          termKey.value, bulanLabel[bulan.value-1], tahun.value, s.id, s.santri||'',
          labelRating(pointsToRating(Number(e.points||0))), // rating
          e.type, e.category, e.severity, e.title, e.status, new Date(e.createdAt as number).toISOString()
        ].map(x => `"${String(x).replace(/"/g,'""')}"`)
        lines.push(cols.join(','))
      }
    }
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob); const a = document.createElement('a')
  a.href = url; a.download = `patience_${termKey.value}_${tahun.value}-${String(bulan.value).padStart(2,'0')}.csv`; a.click(); URL.revokeObjectURL(url)
}

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

type MKRoom = { key:string; kamar:string; members:any[]; count:number }
type MKTree = { maskan:string; total:number; kamars:MKRoom[] }
const roomKey = (maskan?:string, kamar?:string) => `${(maskan||'').trim()}__${(kamar||'').trim()}`

const maskanKamarTree = computed<MKTree[]>(() => {
  const map = new Map<string, { maskan:string; kamars: Map<string, MKRoom> }>()
  for (const s of santriRows.value) {
    const m = (s.maskan||'').trim()
    const k = (s.kamar||'').trim()
    if (!map.has(m)) map.set(m, { maskan: m, kamars: new Map() })
    const mk = map.get(m)!
    const key = roomKey(m,k)
    if (!mk.kamars.has(key)) mk.kamars.set(key, { key, kamar:k, members:[], count:0 })
    const room = mk.kamars.get(key)!; room.members.push(s); room.count++
  }
  const out: MKTree[] = []
  for (const { maskan, kamars } of map.values()) {
    const arr = Array.from(kamars.values()).sort((a,b)=> a.kamar.localeCompare(b.kamar))
    out.push({ maskan, kamars: arr, total: arr.length })
  }
  return out.sort((a,b)=> a.maskan.localeCompare(b.maskan))
})

type RoomDraftItem = { adab: RatingValue | ''; kedisiplinan: RatingValue | ''; note: string }
const roomDraft = reactive<Record<string, RoomDraftItem>>({})
function ensureRoomDraftFor(id:string){
  if (!roomDraft[id]) roomDraft[id] = { adab:'', kedisiplinan:'', note:'' }
}
function getRoomDraft(id:string){ ensureRoomDraftFor(id); return roomDraft[id] }

let _unsubDraft: null | (() => void) = null
function unsubscribeDraft(){ if (_unsubDraft) { _unsubDraft(); _unsubDraft = null } }

function subscribeDraft(){
  const { $realtimeDb } = useNuxtApp() as any
  unsubscribeDraft()
  for (const k of Object.keys(roomDraft)) delete roomDraft[k]
  const ref = dbRef($realtimeDb, draftBasePath.value)
  const h = onValue(ref, (snap) => {
    const v = snap.val() || {}
    for (const k of Object.keys(roomDraft)) delete roomDraft[k]
    for (const id of Object.keys(v)) {
      const it = v[id] || {}
      roomDraft[id] = {
        adab: (it.adab || '') as RatingValue | '',
        kedisiplinan: (it.kedisiplinan || '') as RatingValue | '',
        note: String(it.note || '')
      }
    }
  })
  _unsubDraft = () => off(ref, 'value', h)
}
watch([monthKey, termKey], () => { subscribeDraft() })

const _saveTimers: Record<string, any> = {}
function onDraftChange(santriId: string){
  ensureRoomDraftFor(santriId)
  if (_saveTimers[santriId]) clearTimeout(_saveTimers[santriId])
  _saveTimers[santriId] = setTimeout(() => saveDraft(santriId), 400)
}
async function saveDraft(santriId: string){
  const { $realtimeDb } = useNuxtApp() as any
  ensureRoomDraftFor(santriId)
  await set(dbRef($realtimeDb, `${draftBasePath.value}/${santriId}`), {
    adab: roomDraft[santriId]!.adab || '',
    kedisiplinan: roomDraft[santriId]!.kedisiplinan || '',
    note: String(roomDraft[santriId]!.note || '')
  })
}

const fillAllRoom = reactive<Record<string, { adab: RatingValue|''; kedisiplinan: RatingValue|''; note: string }>>({})
function ensureFillKey(key:string){ if (!fillAllRoom[key]) fillAllRoom[key] = { adab:'', kedisiplinan:'', note:'' } }
function getFillFor(key:string){ ensureFillKey(key); return fillAllRoom[key] }

function membersForKey(key:string){
  const [m,k] = key.split('__'); const mg = maskanKamarTree.value.find(x=>x.maskan===m)
  const kg = mg?.kamars.find(x=>x.key===key); return kg?.members || []
}

function applyFillFor(key:string){
  ensureFillKey(key)
  const fill = fillAllRoom[key]!
  for (const s of membersForKey(key)){
    ensureRoomDraftFor(s.id)
    if (fill.adab) roomDraft[s.id]!.adab = fill.adab
    if (fill.kedisiplinan) roomDraft[s.id]!.kedisiplinan = fill.kedisiplinan
    if (fill.note?.trim()) roomDraft[s.id]!.note = fill.note.trim()
    onDraftChange(s.id)
  }
}
function clearFillFor(key:string){ fillAllRoom[key] = { adab:'', kedisiplinan:'', note:'' } }

const savingRoom = ref(false)
const typeForPoints = (p:number)=> p>0 ? 'keteladanan' : (p<0 ? 'pelanggaran' : 'keteladanan')

async function saveRoomFor(key:string){
  const members = membersForKey(key)
  if (!members.length) return
  savingRoom.value = true
  try{
    const [m,k] = key.split('__')
    for (const s of members){
      const d = roomDraft[s.id]
      if (!d) continue

      // Adab
      if (d.adab){
        const pts = ratingToPoints(d.adab as RatingValue)
        await createPatience({
          santriId: s.id,
          name: s.santri || 'Santri',
          type: typeForPoints(pts),
          category: 'adab',
          severity: 'Ringan',
          title: `Adab — ${labelRating(d.adab as RatingValue)}`,
          desc: d.note?.trim() || '',
          points: pts,
          reportedBy: '',
          handledBy: '',
          location: `${m} • ${k}`,
          status: 'open',
          term: termKey.value,
          createdAt: selectedMonthMidTs(),
          evidenceFile: undefined
        } as any)
      }

      // Kedisiplinan
      if (d.kedisiplinan){
        const pts = ratingToPoints(d.kedisiplinan as RatingValue)
        await createPatience({
          santriId: s.id,
          name: s.santri || 'Santri',
          type: typeForPoints(pts),
          category: 'kedisiplinan',
          severity: 'Ringan',
          title: `Kedisiplinan — ${labelRating(d.kedisiplinan as RatingValue)}`,
          desc: d.note?.trim() || '',
          points: pts,
          reportedBy: '',
          handledBy: '',
          location: `${m} • ${k}`,
          status: 'open',
          term: termKey.value,
          createdAt: selectedMonthMidTs(),
          evidenceFile: undefined
        } as any)
      }
    }
  } finally { savingRoom.value = false }
}

function exportRoomCSVFor(key:string){
  const members = membersForKey(key); if (!members.length) return
  const [m,k] = key.split('__')
  const header = ['term','bulan','tahun','maskan','kamar','santriId','nama','rating_adab','rating_kedisiplinan','catatan']
  const lines = [header.join(',')]
  for (const s of members){
    const d = roomDraft[s.id] || { adab:'', kedisiplinan:'', note:'' }
    const cols = [
      termKey.value, bulanLabel[bulan.value-1], tahun.value, m, k,
      s.id, s.santri || '',
      d.adab ? labelRating(d.adab as RatingValue) : '',
      d.kedisiplinan ? labelRating(d.kedisiplinan as RatingValue) : '',
      (d.note||'').replace(/"/g,'""')
    ].map(x => `"${String(x)}"`)
    lines.push(cols.join(','))
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob); const a = document.createElement('a')
  a.href = url; a.download = `patience_room_${m}_${k}_${tahun.value}-${String(bulan.value).padStart(2,'0')}.csv`
  a.click(); URL.revokeObjectURL(url)
}

/* ===== Lifecycle ===== */
onMounted(async () => {
  subscribeSantri(); await fetchSantri()
  reloadMonth()
  subscribeDraft()
})
onUnmounted(() => { unsubscribeSantri(); unsubscribePatience(); unsubscribeDraft() })
</script>

<style scoped>
.shadow-xs{ box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05); }
</style>
