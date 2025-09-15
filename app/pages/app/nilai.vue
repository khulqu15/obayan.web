<!-- /pages/app/nilai.vue -->
<template>
  <section class="p-6">
    <!-- ====== HEADER ====== -->
    <div class="flex mb-3 items-center gap-2">
      <h1 class="text-xl font-semibold">Nilai Mata Pelajaran</h1>
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

        <select v-model="predikatFilter" class="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700">
          <option value="all">Semua Predikat</option>
          <option>A</option><option>B</option><option>C</option><option>D</option><option>E</option>
        </select>

        <select v-model="selectedMapelId" class="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700">
          <option disabled value="">Pilih Mapel…</option>
          <option v-for="m in subjectsFiltered" :key="m.id" :value="m.id">
            {{ m.name }} <span v-if="m.jenjang">({{ m.jenjang }})</span>
          </option>
        </select>

        <input v-model.number="tahunAwal" type="number" class="w-24 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700" />
        <select v-model="semester" class="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700">
          <option>Ganjil</option><option>Genap</option>
        </select>

        <!-- Ellipsis menu -->
        <div class="relative" @keydown.esc="showKebab=false">
          <button @click="showKebab=!showKebab"
                  class="py-2 px-3 text-sm rounded-lg border border-gray-200 dark:border-neutral-700">
            <Icon icon="lucide:more-horizontal" class="size-5"/>
          </button>

          <div v-if="showKebab"
               class="absolute right-0 mt-2 w-60 rounded-xl border border-gray-200 bg-white shadow-lg dark:bg-neutral-800 dark:border-neutral-700 z-10">
            <div class="p-1 text-sm">
              <button class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-700 rounded-lg"
                      @click="openSubjects(); showKebab=false">Kelola Mapel</button>
              <button class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-700 rounded-lg"
                      :disabled="!selectedMapelId"
                      :title="!selectedMapelId ? 'Pilih Mapel dulu' : ''"
                      @click="openWeights(); showKebab=false">Bobot</button>
              <button class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-700 rounded-lg"
                      :disabled="!selectedMapelId"
                      :title="!selectedMapelId ? 'Pilih Mapel dulu' : ''"
                      @click="openQuickInput(); showKebab=false">Input Nilai (Quick)</button>
              <button class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-700 rounded-lg"
                      @click="exportCSV(); showKebab=false">Export CSV</button>
              <button class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-700 rounded-lg"
                      @click="triggerImport(); showKebab=false">Import CSV</button>

              <div v-if="selectedCount" class="my-1 border-t dark:border-neutral-700"></div>

              <button v-if="selectedCount"
                      class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-700 rounded-lg"
                      :disabled="!selectedMapelId"
                      :title="!selectedMapelId ? 'Pilih Mapel dulu' : ''"
                      @click="openQuickInputSelected(); showKebab=false">Input Nilai (Terpilih)</button>

              <button v-if="selectedCount"
                      class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-700 rounded-lg"
                      :disabled="!selectedMapelId"
                      :title="!selectedMapelId ? 'Pilih Mapel dulu' : ''"
                      @click="openBulkEdit(); showKebab=false">Edit Mass (Terpilih)</button>

              <button v-if="selectedCount"
                      class="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-neutral-700 rounded-lg"
                      :disabled="!selectedMapelId"
                      :title="!selectedMapelId ? 'Pilih Mapel dulu' : ''"
                      @click="openDeleteModal(); showKebab=false">
                Hapus Nilai (Terpilih)
              </button>
            </div>
          </div>
        </div>

        <!-- hidden file input untuk Import -->
        <input ref="importInput" type="file" accept=".csv" class="hidden" @change="importCSV">
      </div>
    </div>

    <!-- ====== COLLAPSE: Info Mapel & Bobot ====== -->
    <details class="group mt-4 rounded-xl border border-gray-200 bg-white dark:bg-neutral-800" open>
      <summary class="flex items-center justify-between gap-2 p-4 cursor-pointer select-none">
        <div class="font-semibold">Info Mapel & Bobot</div>
        <Icon icon="lucide:chevron-down" class="size-5 text-gray-500 transition group-open:rotate-180"/>
      </summary>
      <div class="border-t border-gray-200 dark:border-neutral-700 p-4 text-sm grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <div class="text-gray-500">Tahun Ajaran / Semester</div>
          <div class="font-medium">{{ termKey }}</div>
        </div>
        <div>
          <div class="text-gray-500">Mapel</div>
          <div class="font-medium">{{ currentMapelName || '—' }}</div>
          <div class="text-xs text-gray-500">KKM: {{ (getSubject(selectedMapelId)?.kkm) ?? '—' }}</div>
        </div>
        <div>
          <div class="text-gray-500">Bobot</div>
          <div class="font-medium">
            T{{ weights.tugas }} / H{{ weights.harian }} / PTS {{ weights.pts }} / PAS {{ weights.pas }}
            <span v-if="weights.proyek"> / Proyek {{ weights.proyek }}</span>
            <span v-if="weights.lainnya"> / Lainnya {{ weights.lainnya }}</span>
          </div>
        </div>
      </div>
    </details>

    <!-- ====== COLLAPSE: Ringkasan Statistik Nilai ====== -->
    <details class="group mt-3 rounded-xl border border-gray-200 bg-white dark:bg-neutral-800" open>
      <summary class="flex items-center justify-between gap-2 p-4 cursor-pointer select-none">
        <div class="font-semibold">Ringkasan Statistik</div>
        <Icon icon="lucide:chevron-down" class="size-5 text-gray-500 transition group-open:rotate-180"/>
      </summary>
      <div class="border-t border-gray-200 dark:border-neutral-700 p-4 text-sm grid grid-cols-2 md:grid-cols-6 gap-3">
        <div class="rounded-lg border border-gray-200 dark:border-neutral-700 p-4">
          <div class="text-gray-500">Rata-rata</div><div class="text-lg font-semibold">{{ stats.avg }}</div>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-neutral-700 p-4">
          <div class="text-gray-500">Total Santri</div><div class="text-lg font-semibold">{{ stats.count }}</div>
        </div>
        <div v-for="g in ['A','B','C','D','E']" :key="g" class="rounded-lg border border-gray-200 dark:border-neutral-700 p-4">
          <div class="text-gray-500">Pred {{ g }}</div>
          <div class="text-lg font-semibold">{{ stats.dist[g as 'A'|'B'|'C'|'D'|'E'] }}</div>
        </div>
      </div>
    </details>

    <!-- ====== TABLE (desktop) – default OPEN ====== -->
    <details class="group mt-4 hidden md:block rounded-2xl border border-gray-200 bg-white dark:bg-neutral-800 overflow-hidden" open>
      <summary class="flex items-center justify-between p-4 cursor-pointer select-none">
        <div class="font-semibold">Daftar Nilai</div>
        <Icon icon="lucide:chevron-down" class="size-5 text-gray-500 transition group-open:rotate-180"/>
      </summary>

      <div class="border-t border-gray-200 dark:border-neutral-700 p-4 overflow-auto">
        <!-- Bar aksi saat ada pilihan -->
        <div v-if="selectedCount" class="mb-3 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs dark:border-blue-900/50 dark:bg-blue-900/20">
          <div><b>{{ selectedCount }}</b> baris dipilih</div>
          <div class="relative">
            <button @click="showBulkMenu=!showBulkMenu" class="px-2 py-1 rounded border border-blue-200 dark:border-blue-800">
              <Icon icon="lucide:more-horizontal" class="size-4"/>
            </button>
            <div v-if="showBulkMenu"
                 class="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg dark:bg-neutral-800 dark:border-neutral-700 z-10">
              <button class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-700 rounded-lg"
                      :disabled="!selectedMapelId"
                      @click="openQuickInputSelected(); showBulkMenu=false">Input Nilai (Terpilih)</button>
              <button class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-700 rounded-lg"
                      :disabled="!selectedMapelId"
                      @click="openBulkEdit(); showBulkMenu=false">Edit Mass (Terpilih)</button>
              <button class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-700 rounded-lg"
                      :disabled="!selectedMapelId"
                      @click="saveSelected(); showBulkMenu=false">Simpan Nilai (Terpilih)</button>
              <div class="my-1 border-t dark:border-neutral-700"></div>
              <button class="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-neutral-700 rounded-lg"
                      :disabled="!selectedMapelId"
                      @click="openDeleteModal(); showBulkMenu=false">
                Hapus Nilai (Terpilih)
              </button>
            </div>
          </div>
        </div>

        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-neutral-900/40">
            <tr>
              <th class="px-3 py-2 w-10">
                <input type="checkbox" :checked="isAllPageSelected" @change="toggleSelectAllPage">
              </th>
              <th class="px-3 py-2 text-left w-56">Santri</th>
              <th class="px-3 py-2 text-left w-40">Maskan/Kamar</th>
              <th class="px-3 py-2 text-center w-20">Tugas</th>
              <th class="px-3 py-2 text-center w-20">Harian</th>
              <th class="px-3 py-2 text-center w-20">PTS</th>
              <th class="px-3 py-2 text-center w-20">PAS</th>
              <th class="px-3 py-2 text-center w-20">Akhir</th>
              <th class="px-3 py-2 text-center w-16">Pred</th>
              <th class="px-3 py-2 text-left">Catatan</th>
              <th class="px-3 py-2 text-center w-28">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-neutral-700">
            <template v-for="s in pagedSantri" :key="s.id">
              <tr>
                <td class="px-3 py-2">
                  <input type="checkbox" :checked="isSelected(s.id)" @change="toggleSelect(s.id)">
                </td>
                <td class="px-3 py-2">
                  <div class="flex items-center gap-2">
                    <button class="p-1 rounded border border-gray-200 dark:border-neutral-700" @click="toggleRow(s.id)">
                      <Icon :icon="rowExpandedId===s.id?'lucide:chevron-up':'lucide:chevron-down'" class="size-4"/>
                    </button>
                    <div>
                      <div class="font-medium truncate">{{ s.santri }}</div>
                      <div class="text-[11px] text-gray-500 truncate">Jenjang: {{ s.jenjang || '-' }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-2 text-[12px]">{{ s.maskan || '-' }} · {{ s.kamar || '-' }}</td>

                <td class="px-1 py-1 text-center"><input v-model.number="draft[s.id].tugas" type="number" min="0" max="100" class="w-16 text-center border-gray-200 rounded border dark:border-neutral-700"/></td>
                <td class="px-1 py-1 text-center"><input v-model.number="draft[s.id].harian" type="number" min="0" max="100" class="w-16 text-center border-gray-200 rounded border dark:border-neutral-700"/></td>
                <td class="px-1 py-1 text-center"><input v-model.number="draft[s.id].pts" type="number" min="0" max="100" class="w-16 text-center border-gray-200 rounded border dark:border-neutral-700"/></td>
                <td class="px-1 py-1 text-center"><input v-model.number="draft[s.id].pas" type="number" min="0" max="100" class="w-16 text-center border-gray-200 rounded border dark:border-neutral-700"/></td>

                <td class="px-3 py-2 text-center font-semibold">{{ previewAkhir(s.id) }}</td>
                <td class="px-3 py-2 text-center">{{ previewPredikat(s.id) }}</td>

                <td class="px-3 py-2"><input v-model.trim="draft[s.id].catatan" type="text" class="w-64 rounded border-gray-200 border dark:border-neutral-700"/></td>

                <td class="px-3 py-2 text-center">
                  <div class="flex items-center gap-1 justify-center">
                    <button :disabled="!selectedMapelId" @click="saveOne(s.id)" class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700">Simpan</button>
                    <button class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700" @click="openEditNilai(s.id)">Edit</button>
                  </div>
                </td>
              </tr>

              <!-- ROW DETAIL -->
              <tr v-show="rowExpandedId===s.id">
                <td></td>
                <td colspan="10" class="bg-gray-50 dark:bg-neutral-900/40">
                  <div class="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div class="rounded-lg border border-gray-200 dark:border-neutral-700 p-4">
                      <div class="text-gray-500 text-xs">Komponen</div>
                      <div class="text-sm">Tugas: {{ draft[s.id].tugas ?? 0 }}</div>
                      <div class="text-sm">Harian: {{ draft[s.id].harian ?? 0 }}</div>
                      <div class="text-sm">PTS: {{ draft[s.id].pts ?? 0 }}</div>
                      <div class="text-sm">PAS: {{ draft[s.id].pas ?? 0 }}</div>
                    </div>
                    <div class="rounded-lg border border-gray-200 dark:border-neutral-700 p-4">
                      <div class="text-gray-500 text-xs">Hasil</div>
                      <div class="text-sm">Akhir: <b>{{ previewAkhir(s.id) }}</b></div>
                      <div class="text-sm">Predikat: <b>{{ previewPredikat(s.id) }}</b></div>
                    </div>
                    <div class="rounded-lg border border-gray-200 dark:border-neutral-700 p-4 md:col-span-2">
                      <div class="text-gray-500 text-xs">Catatan</div>
                      <div class="text-sm">{{ draft[s.id].catatan || '—' }}</div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>

            <tr v-if="!selectedMapelId"><td colspan="11" class="px-3 py-6 text-center text-gray-500">Pilih mapel terlebih dahulu.</td></tr>
            <tr v-else-if="!pagedSantri.length"><td colspan="11" class="px-3 py-6 text-center text-gray-500">Tidak ada data pada halaman ini.</td></tr>
          </tbody>
        </table>
      </div>

      <!-- footer controls -->
      <div class="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-t border-gray-200 dark:border-neutral-700">
        <div class="text-xs text-gray-500">
          Term: <b>{{ termKey }}</b>
        </div>
        <div class="flex items-center gap-2">
          <select v-model.number="pageSize" class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700">
            <option :value="10">10</option><option :value="20">20</option><option :value="50">50</option><option :value="100">100</option>
          </select>
          <div class="text-xs">Hal: {{ page }} / {{ totalPages || 1 }}</div>
          <button class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700" :disabled="page<=1" @click="page--">Prev</button>
          <button class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700" :disabled="page>=totalPages" @click="page++">Next</button>
          <button :disabled="!selectedMapelId" @click="saveAll" class="px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">Simpan Semua</button>
        </div>
      </div>
    </details>

    <!-- ====== CARDS (mobile) – default OPEN ====== -->
    <details class="group mt-4 md:hidden rounded-xl border border-gray-200 bg-white dark:bg-neutral-800" open>
      <summary class="flex items-center justify-between p-4 cursor-pointer select-none">
        <div class="font-semibold">Daftar Nilai</div>
        <Icon icon="lucide:chevron-down" class="size-5 text-gray-500 transition group-open:rotate-180"/>
      </summary>

      <div class="border-t border-gray-200 dark:border-neutral-700 p-4 space-y-3">
        <div v-for="s in pagedSantri" :key="s.id" class="rounded-xl border border-gray-200 dark:border-neutral-700">
          <details class="group" open>
            <summary class="flex items-start justify-between gap-2 p-4 cursor-pointer select-none">
              <div class="flex items-start gap-2">
                <input type="checkbox" class="mt-1" :checked="isSelected(s.id)" @change="toggleSelect(s.id)">
                <div>
                  <div class="font-medium">{{ s.santri }}</div>
                  <div class="text-[11px] text-gray-500">{{ s.maskan || '-' }} • {{ s.kamar || '-' }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-xs">Akhir</div>
                <div class="text-lg font-semibold leading-none -mt-1">{{ previewAkhir(s.id) }}</div>
                <div class="text-xs">{{ previewPredikat(s.id) }}</div>
              </div>
            </summary>
            <div class="border-t border-gray-200 dark:border-neutral-700 p-4">
              <div class="grid grid-cols-2 gap-2 text-center">
                <div class="text-left">
                    <p>Tugas</p>
                    <input v-model.number="draft[s.id].tugas" type="number" min="0" max="100" placeholder="Tugas" class="px-2 py-1 w-full rounded border border-gray-200 dark:border-neutral-700">
                </div>
                <div class="text-left">
                    <p>Harian</p>
                    <input v-model.number="draft[s.id].harian" type="number" min="0" max="100" placeholder="Harian" class="px-2 py-1 w-full rounded border border-gray-200 dark:border-neutral-700">
                </div>
                <div class="text-left">
                    <p>PTS</p>
                    <input v-model.number="draft[s.id].pts" type="number" min="0" max="100" placeholder="PTS" class="px-2 py-1 w-full rounded border border-gray-200 dark:border-neutral-700">
                </div>
                <div class="text-left">
                    <p>PAS</p>
                    <input v-model.number="draft[s.id].pas" type="number" min="0" max="100" placeholder="PAS" class="px-2 py-1 w-full rounded border border-gray-200 dark:border-neutral-700">
                </div>
              </div>
              <input v-model.trim="draft[s.id].catatan" type="text" placeholder="Catatan" class="mt-2 w-full rounded p-2 border border-gray-200 dark:border-neutral-700">
              <div class="mt-3 flex items-center justify-end gap-2">
                <button class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700" @click="openEditNilai(s.id)">Modal</button>
                <button class="px-2 py-1 text-xs rounded bg-blue-600 text-white" :disabled="!selectedMapelId" @click="saveOne(s.id)">Simpan</button>
              </div>
            </div>
          </details>
        </div>

        <div class="flex items-center justify-between mt-2">
          <button class="px-3 py-1.5 text-xs rounded border border-gray-200 dark:border-neutral-700" :disabled="page<=1" @click="page--">Prev</button>
          <div class="text-xs">Halaman {{ page }} / {{ totalPages || 1 }}</div>
          <button class="px-3 py-1.5 text-xs rounded border border-gray-200 dark:border-neutral-700" :disabled="page>=totalPages" @click="page++">Next</button>
        </div>
      </div>
    </details>

    <!-- ====== MODAL: Hapus Nilai (Terpilih) ====== -->
    <teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-[96]">
        <div class="absolute inset-0 bg-black/40" @click="closeDeleteModal"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-xl dark:bg-neutral-800 dark:border-neutral-700">
            <!-- Header -->
            <div class="p-4 border-b dark:border-neutral-700 flex items-center gap-3">
              <div class="flex items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 w-9 h-9">
                <Icon icon="lucide:trash-2" class="size-5"/>
              </div>
              <div>
                <h3 class="font-semibold">Hapus Nilai (Terpilih)</h3>
                <p class="text-xs text-gray-500">Tindakan ini akan menghapus nilai untuk mapel & term yang dipilih.</p>
              </div>
            </div>

            <!-- Body -->
            <div class="p-4 space-y-3 text-sm">
              <div class="rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-200">
                <b>{{ selectedCount }}</b> baris nilai akan dihapus.
              </div>

              <div class="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div class="text-gray-500">Mapel</div>
                  <div class="font-medium">{{ currentMapelName || '—' }}</div>
                </div>
                <div>
                  <div class="text-gray-500">Term</div>
                  <div class="font-medium">{{ termKey }}</div>
                </div>
              </div>

              <div v-if="selectedPreviewNames.length" class="text-xs">
                <div class="text-gray-500 mb-1">Contoh data yang terhapus:</div>
                <ul class="list-disc ml-5">
                  <li v-for="(nm, i) in selectedPreviewNames" :key="i">{{ nm }}</li>
                </ul>
                <div v-if="selectedCount > selectedPreviewNames.length" class="mt-1 text-gray-500">
                  dan {{ selectedCount - selectedPreviewNames.length }} lainnya…
                </div>
              </div>

              <div class="pt-2">
                <label class="text-xs text-gray-500">Ketik <b>HAPUS</b> untuk konfirmasi</label>
                <input v-model.trim="deleteConfirmText" placeholder="HAPUS"
                      class="mt-1 w-full rounded border p-2 border-gray-200 dark:border-neutral-700"/>
              </div>
            </div>

            <!-- Footer -->
            <div class="p-4 border-t dark:border-neutral-700 flex items-center justify-between">
              <button class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700"
                      @click="closeDeleteModal" :disabled="deleting">
                Batal
              </button>
              <button class="px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
                      :disabled="!canDelete || deleting"
                      @click="performDeleteSelected">
                <span v-if="!deleting">Hapus Nilai</span>
                <span v-else>Menghapus…</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>


    <!-- ====== MODAL: Kelola Mapel (CRUD + filter + paginate) ====== -->
    <teleport to="body">
      <div v-if="showSubjects" class="fixed inset-0 z-[90]">
        <div class="absolute inset-0 bg-black/40" @click="showSubjects=false"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white shadow-xl dark:bg-neutral-800 dark:border-neutral-700">
            <div class="p-4 border-b dark:border-neutral-700 flex items-center justify-between">
              <h3 class="font-semibold">Mata Pelajaran</h3>
              <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700" @click="showSubjects=false"><Icon icon="lucide:x" class="size-4"/></button>
            </div>

            <div class="p-4 space-y-3">
              <div class="flex flex-wrap items-center gap-2">
                <input v-model="subQ" placeholder="Cari mapel…" class="px-3 py-2 rounded border border-gray-200 dark:border-neutral-700 w-56">
                <select v-model="subJenjang" class="px-3 py-2 rounded border border-gray-200 dark:border-neutral-700">
                  <option value="all">Semua Jenjang</option><option>SD</option><option>SMP</option><option>SMA</option><option>SMK</option>
                </select>
                <button class="px-3 py-2 rounded bg-blue-600 text-white" @click="openSubForm()">Tambah</button>
              </div>

              <div class="rounded-xl border border-gray-200 dark:border-neutral-700 overflow-auto">
                <table class="min-w-full text-sm">
                  <thead class="bg-gray-50 dark:bg-neutral-900/40">
                    <tr><th class="px-3 py-2 text-left">Mapel</th><th class="px-3 py-2">Kode</th><th class="px-3 py-2">Jenjang</th><th class="px-3 py-2">KKM</th><th class="px-3 py-2 w-40">Aksi</th></tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-neutral-700">
                    <tr v-for="m in pagedSubjects" :key="m.id">
                      <td class="px-3 py-2">{{ m.name }}</td>
                      <td class="px-3 py-2 text-center">{{ m.code || '-' }}</td>
                      <td class="px-3 py-2 text-center">{{ m.jenjang || '-' }}</td>
                      <td class="px-3 py-2 text-center">{{ m.kkm ?? '-' }}</td>
                      <td class="px-3 py-2 text-center">
                        <div class="flex items-center gap-2 justify-center">
                          <button class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700" @click="openSubForm(m)">Edit</button>
                          <button class="px-2 py-1 text-xs rounded border border-gray-200 text-rose-600 dark:border-neutral-700" @click="removeSubject(m.id)">Hapus</button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="!pagedSubjects.length"><td colspan="5" class="px-3 py-6 text-center text-gray-500">Tidak ada data.</td></tr>
                  </tbody>
                </table>
              </div>

              <div class="flex items-center justify-end gap-2">
                <select v-model.number="subPageSize" class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700">
                  <option :value="10">10</option><option :value="20">20</option><option :value="50">50</option>
                </select>
                <div class="text-xs">Hal: {{ subPage }} / {{ subTotalPages || 1 }}</div>
                <button class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700" :disabled="subPage<=1" @click="subPage--">Prev</button>
                <button class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700" :disabled="subPage>=subTotalPages" @click="subPage++">Next</button>
              </div>
            </div>

            <div class="p-4 border-t dark:border-neutral-700 text-right">
              <button class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700" @click="showSubjects=false">Tutup</button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- ====== SUB-MODAL: Form Mapel ====== -->
    <teleport to="body">
      <div v-if="showSubForm" class="fixed inset-0 z-[95]">
        <div class="absolute inset-0 bg-black/40" @click="closeSubForm"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-xl dark:bg-neutral-800 dark:border-neutral-700">
            <div class="p-4 border-b dark:border-neutral-700 flex items-center justify-between">
              <h3 class="font-semibold">{{ subFormMode==='create' ? 'Tambah Mapel' : 'Edit Mapel' }}</h3>
              <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700" @click="closeSubForm"><Icon icon="lucide:x" class="size-4"/></button>
            </div>
            <form class="p-4 grid grid-cols-2 gap-2" @submit.prevent="submitSubForm">
              <div class="col-span-2"><label class="text-xs">Nama Mapel</label><input v-model.trim="subForm.name" required class="mt-1 w-full rounded border p-3 border-gray-200 dark:border-neutral-700"/></div>
              <div><label class="text-xs">Kode</label><input v-model.trim="subForm.code" class="mt-1 w-full rounded border p-3 border-gray-200 dark:border-neutral-700"/></div>
              <div><label class="text-xs">Jenjang</label>
                <select v-model="subForm.jenjang" class="mt-1 w-full rounded border p-3 border-gray-200 dark:border-neutral-700">
                  <option value="">-</option><option>SD</option><option>SMP</option><option>SMA</option><option>SMK</option>
                </select>
              </div>
              <div><label class="text-xs">KKM</label><input v-model.number="subForm.kkm" type="number" min="0" max="100" class="mt-1 w-full rounded border p-3 border-gray-200 dark:border-neutral-700"/></div>
              <div class="col-span-2 text-right">
                <button class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">{{ subFormMode==='create' ? 'Simpan' : 'Update' }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </teleport>

    <!-- ====== MODAL: Edit Nilai ====== -->
    <teleport to="body">
      <div v-if="showEditNilai" class="fixed inset-0 z-[95]">
        <div class="absolute inset-0 bg-black/40" @click="showEditNilai=false"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-xl dark:bg-neutral-800 dark:border-neutral-700">
            <div class="p-4 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
              <h3 class="font-semibold">Edit Nilai — {{ editSantri?.santri || '-' }}</h3>
              <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700" @click="showEditNilai=false"><Icon icon="lucide:x" class="size-4"/></button>
            </div>
            <form class="p-4 grid grid-cols-2 gap-2" @submit.prevent="saveOne(editSantri!.id)">
              <div><label class="text-xs">Tugas</label><input v-model.number="draft[editSantri!.id].tugas" type="number" min="0" max="100" class="mt-1 p-2 w-full rounded border border-gray-200 dark:border-neutral-700"/></div>
              <div><label class="text-xs">Harian</label><input v-model.number="draft[editSantri!.id].harian" type="number" min="0" max="100" class="mt-1 p-2 w-full rounded border border-gray-200 dark:border-neutral-700"/></div>
              <div><label class="text-xs">PTS</label><input v-model.number="draft[editSantri!.id].pts" type="number" min="0" max="100" class="mt-1 p-2 w-full rounded border border-gray-200 dark:border-neutral-700"/></div>
              <div><label class="text-xs">PAS</label><input v-model.number="draft[editSantri!.id].pas" type="number" min="0" max="100" class="mt-1 p-2 w-full rounded border border-gray-200 dark:border-neutral-700"/></div>
              <div class="col-span-2"><label class="text-xs">Catatan</label><input v-model.trim="draft[editSantri!.id].catatan" class="mt-1 p-2 w-full rounded border border-gray-200 dark:border-neutral-700"/></div>
              <div class="col-span-2 text-right">
                <button class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700" :disabled="!selectedMapelId">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </teleport>

    <!-- ====== MODAL: Bobot ====== -->
    <teleport to="body">
      <div v-if="showWeights" class="fixed inset-0 z-[90]">
        <div class="absolute inset-0 bg-black/40" @click="showWeights=false"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-xl dark:bg-neutral-800 dark:border-neutral-700">
            <div class="p-4 border-b dark:border-neutral-700 flex items-center justify-between">
              <h3 class="font-semibold">Bobot Komponen — {{ currentMapelName }}</h3>
              <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700" @click="showWeights=false"><Icon icon="lucide:x" class="size-4"/></button>
            </div>
            <form class="p-4 grid grid-cols-2 gap-2" @submit.prevent="saveWeightForm">
              <label class="text-xs col-span-2 text-gray-500">Term: {{ termKey }}</label>
              <div><span class="text-xs">Tugas</span><input v-model.number="weightForm.tugas" type="number" class="mt-1 w-full rounded border p-3 border-gray-200 dark:border-neutral-700"/></div>
              <div><span class="text-xs">Harian</span><input v-model.number="weightForm.harian" type="number" class="mt-1 w-full rounded border p-3 border-gray-200 dark:border-neutral-700"/></div>
              <div><span class="text-xs">PTS</span><input v-model.number="weightForm.pts" type="number" class="mt-1 w-full rounded border p-3 border-gray-200 dark:border-neutral-700"/></div>
              <div><span class="text-xs">PAS</span><input v-model.number="weightForm.pas" type="number" class="mt-1 w-full rounded border p-3 border-gray-200 dark:border-neutral-700"/></div>
              <div><span class="text-xs">Proyek</span><input v-model.number="weightForm.proyek" type="number" class="mt-1 w-full rounded border p-3 border-gray-200 dark:border-neutral-700"/></div>
              <div><span class="text-xs">Lainnya</span><input v-model.number="weightForm.lainnya" type="number" class="mt-1 w-full rounded border p-3 border-gray-200 dark:border-neutral-700"/></div>
              <div class="col-span-2 text-right mt-2">
                <button class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">Simpan Bobot</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </teleport>

    <!-- ====== MODAL: Quick Entry Nilai per Mapel ====== -->
    <teleport to="body">
      <div v-if="showQuickInput" class="fixed inset-0 z-[92]">
        <div class="absolute inset-0 bg-black/40" @click="closeQuickInput"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-5xl rounded-2xl border max-h-[90vh] overflow-y-auto scrollbar-none border-gray-200 bg-white shadow-xl dark:bg-neutral-800 dark:border-neutral-700">
            <!-- Header -->
            <div class="p-4 border-b dark:border-neutral-700 flex items-center justify-between gap-3">
              <div>
                <h3 class="font-semibold">Input Nilai — {{ currentMapelName || '—' }}</h3>
                <p class="text-xs text-gray-500">Term: {{ termKey }}</p>
              </div>
              <div class="flex items-center gap-2">
                <div class="relative">
                  <Icon icon="lucide:search" class="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input v-model="qiQ" type="search" placeholder="Cari santri/maskan/kamar…"
                         class="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700 w-64"/>
                </div>
                <select v-model.number="qiPageSize" class="px-2 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700">
                  <option :value="10">10</option><option :value="20">20</option><option :value="50">50</option><option :value="100">100</option>
                </select>
                <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700" @click="closeQuickInput"><Icon icon="lucide:x" class="size-4"/></button>
              </div>
            </div>

            <!-- Mass fill & Paste helper -->
            <div class="p-4 border-b dark:border-neutral-700 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="rounded-xl border border-gray-200 dark:border-neutral-700 p-3">
                <div class="text-xs font-semibold mb-2">Isi Sama (hanya mengisi yang masih kosong)</div>
                <div class="grid grid-cols-2 gap-2">
                  <input v-model.number="qiMass.tugas" type="number" min="0" max="100" placeholder="Tugas" class="px-2 py-1 rounded border border-gray-200 dark:border-neutral-700">
                  <input v-model.number="qiMass.harian" type="number" min="0" max="100" placeholder="Harian" class="px-2 py-1 rounded border border-gray-200 dark:border-neutral-700">
                  <input v-model.number="qiMass.pts" type="number" min="0" max="100" placeholder="PTS" class="px-2 py-1 rounded border border-gray-200 dark:border-neutral-700">
                  <input v-model.number="qiMass.pas" type="number" min="0" max="100" placeholder="PAS" class="px-2 py-1 rounded border border-gray-200 dark:border-neutral-700">
                  <input v-model.number="qiMass.proyek" type="number" min="0" max="100" placeholder="Proyek" class="px-2 py-1 rounded border border-gray-200 dark:border-neutral-700">
                  <input v-model.number="qiMass.lainnya" type="number" min="0" max="100" placeholder="Lainnya" class="px-2 py-1 rounded border border-gray-200 dark:border-neutral-700">
                </div>
                <div class="mt-2 text-right">
                  <button class="px-3 py-1.5 text-xs rounded border border-gray-200 dark:border-neutral-700" @click="applyMassFill">Terapkan</button>
                </div>
              </div>

              <div class="md:col-span-2 rounded-xl border border-gray-200 dark:border-neutral-700 p-3">
                <div class="flex items-center justify-between gap-2">
                  <div class="text-xs font-semibold">Paste dari Excel/CSV (kolom fleksibel)</div>
                  <button class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700" @click="togglePasteHelp = !togglePasteHelp">
                    {{ togglePasteHelp ? 'Tutup Bantuan' : 'Cara Pakai' }}
                  </button>
                </div>
                <div v-if="togglePasteHelp" class="text-[11px] text-gray-500 mt-2">
                  Tempel data dengan header seperti: <b>santriId</b> atau <b>nama</b>, lalu <b>tugas</b>, <b>harian</b>, <b>pts</b>, <b>pas</b>, opsional <b>proyek</b>, <b>lainnya</b>, <b>catatan</b>.
                  Baris akan dicocokkan berdasarkan <i>santriId</i> (prioritas) atau <i>nama</i> jika id tidak ada.
                </div>
                <textarea v-model="qiPaste" rows="4" placeholder='Contoh:
santriId,nama,tugas,harian,pts,pas,catatan
abc123,Ahmad,80,90,85,88,rajin'
                  class="mt-2 w-full rounded border border-gray-200 dark:border-neutral-700 p-2 text-sm"></textarea>
                <div class="mt-2 text-right">
                  <button class="px-3 py-1.5 text-xs rounded border border-gray-200 dark:border-neutral-700" @click="applyPaste">Terapkan Paste</button>
                </div>
              </div>
            </div>

            <!-- Grid -->
            <div class="p-4 overflow-auto">
              <table class="min-w-full text-sm">
                <thead class="bg-gray-50 dark:bg-neutral-900/40">
                  <tr>
                    <th class="px-3 py-2 text-left w-56">Santri</th>
                    <th class="px-3 py-2 text-left w-40">Maskan/Kamar</th>
                    <th class="px-3 py-2 text-center w-20">Tugas</th>
                    <th class="px-3 py-2 text-center w-20">Harian</th>
                    <th class="px-3 py-2 text-center w-20">PTS</th>
                    <th class="px-3 py-2 text-center w-20">PAS</th>
                    <th class="px-3 py-2 text-center w-20">Akhir</th>
                    <th class="px-3 py-2 text-center w-16">Pred</th>
                    <th class="px-3 py-2 text-left">Catatan</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-neutral-700">
                  <tr v-for="s in qiPagedSantri" :key="s.id">
                    <td class="px-3 py-2">
                      <div class="font-medium truncate">{{ s.santri }}</div>
                      <div class="text-[11px] text-gray-500 truncate">Jenjang: {{ s.jenjang || '-' }}</div>
                    </td>
                    <td class="px-3 py-2 text-[12px]">{{ s.maskan || '-' }} · {{ s.kamar || '-' }}</td>

                    <td class="px-1 py-1 text-center"><input v-model.number="draft[s.id].tugas" type="number" min="0" max="100" class="w-16 text-center border-gray-200 rounded border dark:border-neutral-700"/></td>
                    <td class="px-1 py-1 text-center"><input v-model.number="draft[s.id].harian" type="number" min="0" max="100" class="w-16 text-center border-gray-200 rounded border dark:border-neutral-700"/></td>
                    <td class="px-1 py-1 text-center"><input v-model.number="draft[s.id].pts" type="number" min="0" max="100" class="w-16 text-center border-gray-200 rounded border dark:border-neutral-700"/></td>
                    <td class="px-1 py-1 text-center"><input v-model.number="draft[s.id].pas" type="number" min="0" max="100" class="w-16 text-center border-gray-200 rounded border dark:border-neutral-700"/></td>

                    <td class="px-3 py-2 text-center font-semibold">{{ previewAkhir(s.id) }}</td>
                    <td class="px-3 py-2 text-center">{{ previewPredikat(s.id) }}</td>

                    <td class="px-3 py-2"><input v-model.trim="draft[s.id].catatan" type="text" class="w-64 rounded border-gray-200 border dark:border-neutral-700"/></td>
                  </tr>
                  <tr v-if="!qiPagedSantri.length"><td colspan="9" class="px-3 py-6 text-center text-gray-500">Tidak ada data pada halaman ini.</td></tr>
                </tbody>
              </table>
            </div>

            <!-- Footer -->
            <div class="p-4 border-t dark:border-neutral-700 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div class="text-xs text-gray-500">
                Ditampilkan: {{ qiPagedSantri.length }} dari {{ qiFilteredSantri.length }} santri
              </div>
              <div class="flex items-center gap-2">
                <div class="text-xs">Hal: {{ qiPage }} / {{ qiTotalPages || 1 }}</div>
                <button class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700" :disabled="qiPage<=1" @click="qiPage--">Prev</button>
                <button class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700" :disabled="qiPage>=qiTotalPages" @click="qiPage++">Next</button>
                <button :disabled="!selectedMapelId" @click="saveQuickInput" class="px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">Simpan (Halaman ini)</button>
                <button :disabled="!selectedMapelId" @click="saveQuickInputAll" class="px-3 py-1.5 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">Simpan Semua (Terfilter)</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </teleport>

    <!-- ====== MODAL: Bulk Edit Nilai (Terpilih) ====== -->
    <teleport to="body">
      <div v-if="showBulkEdit" class="fixed inset-0 z-[93]">
        <div class="absolute inset-0 bg-black/40" @click="showBulkEdit=false"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-xl dark:bg-neutral-800 dark:border-neutral-700">
            <div class="p-4 border-b dark:border-neutral-700 flex items-center justify-between">
              <h3 class="font-semibold">Edit Mass — {{ selectedCount }} santri</h3>
              <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700" @click="showBulkEdit=false">
                <Icon icon="lucide:x" class="size-4"/>
              </button>
            </div>

            <form class="p-4 grid grid-cols-2 gap-2" @submit.prevent="applyBulkEditAndMaybeSave(true)">
              <div class="col-span-2 text-xs text-gray-500">
                Hanya field yang diisi di bawah yang akan diterapkan. Centang <b>Timpa</b> untuk menimpa nilai yang sudah terisi.
              </div>
              <div><label class="text-xs">Tugas</label><input v-model.number="bulkForm.tugas" type="number" min="0" max="100" class="mt-1 w-full rounded border p-2 border-gray-200 dark:border-neutral-700"/></div>
              <div><label class="text-xs">Harian</label><input v-model.number="bulkForm.harian" type="number" min="0" max="100" class="mt-1 w-full rounded border p-2 border-gray-200 dark:border-neutral-700"/></div>
              <div><label class="text-xs">PTS</label><input v-model.number="bulkForm.pts" type="number" min="0" max="100" class="mt-1 w-full rounded border p-2 border-gray-200 dark:border-neutral-700"/></div>
              <div><label class="text-xs">PAS</label><input v-model.number="bulkForm.pas" type="number" min="0" max="100" class="mt-1 w-full rounded border p-2 border-gray-200 dark:border-neutral-700"/></div>
              <div><label class="text-xs">Proyek</label><input v-model.number="bulkForm.proyek" type="number" min="0" max="100" class="mt-1 w-full rounded border p-2 border-gray-200 dark:border-neutral-700"/></div>
              <div><label class="text-xs">Lainnya</label><input v-model.number="bulkForm.lainnya" type="number" min="0" max="100" class="mt-1 w-full rounded border p-2 border-gray-200 dark:border-neutral-700"/></div>
              <div class="col-span-2"><label class="text-xs">Catatan</label><input v-model.trim="bulkForm.catatan" class="mt-1 w-full rounded border p-2 border-gray-200 dark:border-neutral-700"/></div>

              <div class="col-span-2 flex items-center justify-between pt-1">
                <label class="flex items-center gap-2 text-xs">
                  <input type="checkbox" v-model="bulkOverwrite">
                  <span>Timpa nilai yang sudah terisi (overwrite)</span>
                </label>
                <div class="space-x-2">
                  <button type="button" class="px-3 py-1.5 text-xs rounded border border-gray-200 dark:border-neutral-700"
                          @click="applyBulkEditAndMaybeSave(false)">Terapkan</button>
                  <button type="submit" class="px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700">
                    Terapkan & Simpan
                  </button>
                </div>
              </div>
            </form>

            <div class="p-4 border-t dark:border-neutral-700 text-right">
              <button class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700" @click="showBulkEdit=false">Tutup</button>
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
import { useNuxtApp } from '#app'
import { ref as dref, update } from 'firebase/database'
import { useSantri } from '~/composables/data/useSantri'
import { usePelajaran, makeTermKey, type GradeRecord } from '~/composables/data/usePelajaran'

definePageMeta({ layout: 'app', layoutProps: { title: 'Nilai' } })

/* ========= SOURCES ========= */
const { rows: santriRows, fetchSantri, subscribeSantri, unsubscribeSantri } = useSantri()
const {
  subjects, subscribeSubjects, unbindSubjects,
  nilaiMap, subscribeNilai, unsubscribeNilai, saveNilai, bulkSaveNilai,
  readWeights, saveWeights, DEFAULT_WEIGHTS, getSubject,
  createSubject, updateSubject, deleteSubject
} = usePelajaran()

/* ========= FILTERS ========= */
const q = ref('')
const selectedJenjang = ref<'all'|'SD'|'SMP'|'SMA'|'SMK'>('all')
const selectedMaskan = ref<'all'|string>('all')
const predikatFilter = ref<'all'|'A'|'B'|'C'|'D'|'E'>('all')

const selectedMapelId = ref('')
const tahunAwal = ref<number>(new Date().getMonth() >= 6 ? new Date().getFullYear() : new Date().getFullYear()-1)
const semester = ref<'Ganjil'|'Genap'>(new Date().getMonth() >=6 ? 'Ganjil' : 'Genap')
const termKey = computed(() => makeTermKey(tahunAwal.value, semester.value))

/* ========= BOBOT ========= */
const weights = reactive({ ...DEFAULT_WEIGHTS })
async function loadWeights(){
  if (!selectedMapelId.value) return
  Object.assign(weights, await readWeights(termKey.value, selectedMapelId.value))
}

/* Subscribe nilai saat mapel/term ganti */
watch([selectedMapelId, termKey], async ([mid])=>{
  unsubscribeNilai()
  selected.value = [] // reset selection
  if (mid) { subscribeNilai(termKey.value, mid); await loadWeights() }
})

/* ========= SANTRI FILTERED + PAGINATION ========= */
const maskanOptions = computed(()=> {
  const s = new Set<string>()
  santriRows.value.forEach(x => (x.maskan||'').trim() && s.add((x.maskan||'').trim()))
  return Array.from(s).sort((a,b)=>a.localeCompare(b))
})

function byPredikat(id: string){
  return (nilaiMap.value[id]?.predikat || previewPredikat(id)) as 'A'|'B'|'C'|'D'|'E'
}

const filteredSantri = computed(()=> {
  let list = santriRows.value.slice()
  if (selectedJenjang.value !== 'all') list = list.filter(s => (s.jenjang||'').toUpperCase().includes(selectedJenjang.value))
  if (selectedMaskan.value !== 'all') list = list.filter(s => (s.maskan||'') === selectedMaskan.value)
  const s = q.value.trim().toLowerCase()
  if (s) list = list.filter(x => [x.santri, x.maskan, x.kamar].some(v => (v||'').toLowerCase().includes(s)))
  if (selectedMapelId.value && predikatFilter.value !== 'all') list = list.filter(x => byPredikat(x.id) === predikatFilter.value)
  return list.sort((a,b)=> (a.santri||'').localeCompare(b.santri||''))
})
const totalFiltered = computed(()=> filteredSantri.value.length)

/* Pagination */
const pageSize = ref(20)
const page = ref(1)
const totalPages = computed(()=> Math.max(1, Math.ceil(filteredSantri.value.length / pageSize.value)))
watch([filteredSantri, pageSize], ()=> { page.value = 1 })
const pagedSantri = computed(()=> {
  const start = (page.value - 1) * pageSize.value
  return filteredSantri.value.slice(start, start + pageSize.value)
})

/* ========= DRAFT NILAI ========= */
const draft = reactive<Record<string, GradeRecord>>({})
function ensureDraftFor(id:string){
  const curr = nilaiMap.value[id] || {}
  draft[id] = draft[id] || {}
  draft[id].tugas = draft[id].tugas ?? curr.tugas ?? 0
  draft[id].harian= draft[id].harian?? curr.harian?? 0
  draft[id].pts   = draft[id].pts   ?? curr.pts   ?? 0
  draft[id].pas   = draft[id].pas   ?? curr.pas   ?? 0
  draft[id].proyek= draft[id].proyek?? curr.proyek
  draft[id].lainnya=draft[id].lainnya?? curr.lainnya
  draft[id].catatan=draft[id].catatan?? curr.catatan ?? ''
}
watch([nilaiMap, pagedSantri], ()=> { for (const s of pagedSantri.value) ensureDraftFor(s.id) })

/* Preview lokal */
function previewAkhir(id:string){
  const d = draft[id] || {}, m = nilaiMap.value[id] || {}
  const comp = { tugas:Number(d.tugas??m.tugas??0), harian:Number(d.harian??m.harian??0), pts:Number(d.pts??m.pts??0), pas:Number(d.pas??m.pas??0), proyek:d.proyek??m.proyek, lainnya:d.lainnya??m.lainnya }
  const w = { ...weights }
  const total = Math.max(1,(w.tugas||0)+(w.harian||0)+(w.pts||0)+(w.pas||0)+(w.proyek||0)+(w.lainnya||0))
  const val = (comp.tugas||0)*(w.tugas||0)+(comp.harian||0)*(w.harian||0)+(comp.pts||0)*(w.pts||0)+(comp.pas||0)*(w.pas||0)+(comp.proyek||0)*(w.proyek||0)+(comp.lainnya||0)*(w.lainnya||0)
  return Math.round(Math.max(0, Math.min(100, val/total)))
}
function previewPredikat(id:string){
  const akhir = previewAkhir(id)
  const kkm = getSubject(selectedMapelId.value)?.kkm
  if (!kkm) return akhir>=92?'A':akhir>=83?'B':akhir>=75?'C':akhir>=65?'D':'E'
  const span = 100-kkm, A=kkm+span*0.8, B=kkm+span*0.6, C=kkm+span*0.4, D=kkm
  return akhir>=A?'A':akhir>=B?'B':akhir>=C?'C':akhir>=D?'D':'E'
}

/* Actions */
async function saveOne(id:string){ if (!selectedMapelId.value) return; await saveNilai(termKey.value, selectedMapelId.value, id, { ...draft[id] }) }
async function saveAll(){
  if (!selectedMapelId.value) return
  const payload:Record<string,GradeRecord>={}
  for (const s of pagedSantri.value) payload[s.id] = { ...draft[s.id] }
  await bulkSaveNilai(termKey.value, selectedMapelId.value, payload)
}

/* Export/Import CSV */
const currentMapelName = computed(()=> subjects.value.find(m=>m.id===selectedMapelId.value)?.name || '-')
function exportCSV(){
  const safeName = (currentMapelName.value || '').toString().replace(/\s+/g,'_') || 'mapel'
  const header = ['santriId','nama','maskan','kamar','tugas','harian','pts','pas','akhir','predikat','catatan']
  const lines=[header.join(',')]
  for (const s of filteredSantri.value) {
    const n = nilaiMap.value[s.id] || {}
    const d = draft[s.id] || {}
    const akhir = previewAkhir(s.id), pred = previewPredikat(s.id)
    const row = [s.id,s.santri||'',s.maskan||'',s.kamar||'',d.tugas??n.tugas??0,d.harian??n.harian??0,d.pts??n.pts??0,d.pas??n.pas??0,akhir,pred,(d.catatan??n.catatan??'')].map(x=>`"${String(x).replace(/"/g,'""')}"`).join(',')
    lines.push(row)
  }
  const blob = new Blob([lines.join('\n')], { type:'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`nilai_${termKey.value}_${safeName}.csv`; a.click(); URL.revokeObjectURL(url)
}
const importInput = ref<HTMLInputElement|null>(null)
function triggerImport(){ importInput.value?.click() }
async function importCSV(ev:Event){
  const file = (ev.target as HTMLInputElement).files?.[0]; if (!file || !selectedMapelId.value) return
  const txt = await file.text(); const rows = txt.split(/\r?\n/).filter(Boolean); const header = rows.shift(); if (!header) return
  const idx=(h:string)=> header.split(',').findIndex(x=>x.replace(/"/g,'').trim().toLowerCase()===h)
  const iId=idx('santriid'), iT=idx('tugas'), iH=idx('harian'), iPts=idx('pts'), iPas=idx('pas'), iC=idx('catatan'), iPro=idx('proyek'), iLain=idx('lainnya')
  const payload:Record<string,GradeRecord>={}
  for (const line of rows) {
    const cols = line.split(',').map(c=>c.replace(/^"|"$/g,'').replace(/""/g,'"'))
    const sid = cols[iId]; if (!sid) continue
    payload[sid] = {
      tugas:Number(cols[iT]||0), harian:Number(cols[iH]||0), pts:Number(cols[iPts]||0), pas:Number(cols[iPas]||0),
      ...(iPro>=0 ? { proyek:Number(cols[iPro]||0) } : {}), ...(iLain>=0 ? { lainnya:Number(cols[iLain]||0) } : {}),
      catatan: cols[iC]||''
    }
  }
  await bulkSaveNilai(termKey.value, selectedMapelId.value, payload)
}

/* ===== Delete Nilai (Terpilih) – modal & logic ===== */
const showDeleteModal = ref(false)
const deleteConfirmText = ref('')
const deleting = ref(false)

const selectedSantriNames = computed(() =>
  santriRows.value
    .filter(s => selectedSet.value.has(s.id))
    .map(s => s.santri || '(tanpa nama)')
)

const selectedPreviewNames = computed(() => selectedSantriNames.value.slice(0, 5))

const canDelete = computed(() =>
  !!selectedCount.value &&
  !!selectedMapelId.value &&
  deleteConfirmText.value.toUpperCase() === 'HAPUS'
)

function openDeleteModal(){
  if (!selectedCount.value || !selectedMapelId.value) {
    alert('Pilih mapel & data dulu.')
    return
    }
  deleteConfirmText.value = ''
  showDeleteModal.value = true
}
function closeDeleteModal(){ if (!deleting.value) showDeleteModal.value = false }

async function performDeleteSelected(){
  if (!canDelete.value || deleting.value) return
  deleting.value = true
  try {
    const base = dref($realtimeDb, `alberr/nilai/${termKey.value}/${selectedMapelId.value}`)
    const updates: Record<string, null> = {}
    for (const id of selected.value) updates[id] = null
    await update(base, updates)

    // Bersihkan draft & pilihan lokal
    for (const id of selected.value) { delete draft[id] }
    selected.value = []

    showDeleteModal.value = false
    alert('Nilai terpilih dihapus.')
  } catch (e:any) {
    alert('Gagal menghapus nilai: ' + (e?.message || e))
  } finally {
    deleting.value = false
  }
}

/* ===== Mapel Modal state (CRUD with pagination) ===== */
const showSubjects = ref(false)
function openSubjects(){ showSubjects.value = true }

const subQ = ref(''); const subJenjang = ref<'all'|'SD'|'SMP'|'SMA'|'SMK'>('all')
const subjectsFiltered = computed(()=> {
  let list = subjects.value.slice()
  if (subJenjang.value !== 'all') list = list.filter(m => (m.jenjang||'').toUpperCase().includes(subJenjang.value))
  const s = subQ.value.trim().toLowerCase()
  if (s) list = list.filter(m => [m.name,m.code].some(v => (v||'').toLowerCase().includes(s)))
  return list
})
const subPage = ref(1); const subPageSize = ref(10)
const subTotalPages = computed(()=> Math.max(1, Math.ceil(subjectsFiltered.value.length / subPageSize.value)))
watch([subjectsFiltered, subPageSize], ()=> { subPage.value = 1 })
const pagedSubjects = computed(()=> {
  const start = (subPage.value-1)*subPageSize.value
  return subjectsFiltered.value.slice(start, start+subPageSize.value)
})

/* Sub-form (create/edit) */
const showSubForm = ref(false)
const subFormMode = ref<'create'|'edit'>('create')
const subForm = reactive<{ id?:string; name:string; code:string; jenjang:string; kkm:number }>({ name:'', code:'', jenjang:'', kkm:70 })
function openSubForm(m?:any){
  subFormMode.value = m ? 'edit' : 'create'
  Object.assign(subForm, m ? { id:m.id, name:m.name||'', code:m.code||'', jenjang:m.jenjang||'', kkm: m.kkm ?? 70 } : { id:undefined, name:'', code:'', jenjang:'', kkm:70 })
  showSubForm.value = true
}
function closeSubForm(){ showSubForm.value = false }
async function submitSubForm(){
  if (!subForm.name.trim()) return
  if (subFormMode.value==='create') {
    await createSubject({ name: subForm.name, code: subForm.code, jenjang: subForm.jenjang as any, kkm: Number(subForm.kkm) })
  } else {
    await updateSubject(subForm.id!, { name: subForm.name, code: subForm.code, jenjang: subForm.jenjang as any, kkm: Number(subForm.kkm) })
  }
  showSubForm.value = false
}
async function removeSubject(id:string){ if (confirm('Hapus mapel ini?')) await deleteSubject(id) }

/* ===== Edit Nilai Modal ===== */
const showEditNilai = ref(false)
const editSantri = ref<any>(null)
function openEditNilai(id:string){
  editSantri.value = santriRows.value.find(x=>x.id===id) || null
  if (editSantri.value) { ensureDraftFor(id); showEditNilai.value = true }
}

/* ===== Bobot modal ===== */
const showWeights = ref(false)
const weightForm = reactive({ tugas:30, harian:20, pts:20, pas:30, proyek:0, lainnya:0 })
function openWeights(){ if (!selectedMapelId.value) return alert('Pilih mapel dulu.'); Object.assign(weightForm, weights); showWeights.value = true }
async function saveWeightForm(){ await saveWeights(termKey.value, selectedMapelId.value, weightForm as any); await loadWeights(); showWeights.value=false }

/* ===== Row expand (desktop) & Statistik ===== */
const rowExpandedId = ref<string|null>(null)
function toggleRow(id: string){ rowExpandedId.value = rowExpandedId.value === id ? null : id }
const stats = computed(() => {
  const ids = filteredSantri.value.map(s => s.id)
  let total = 0
  const dist: Record<'A'|'B'|'C'|'D'|'E', number> = { A:0,B:0,C:0,D:0,E:0 }
  for (const id of ids) {
    const a = previewAkhir(id); total += a
    const p = previewPredikat(id) as 'A'|'B'|'C'|'D'|'E'
    dist[p]++
  }
  const avg = Math.round(total / Math.max(1, ids.length))
  return { avg, dist, count: ids.length }
})

/* ===== Ellipsis & Selection ===== */
const showKebab = ref(false)
const showBulkMenu = ref(false)

const selected = ref<string[]>([])
const selectedSet = computed(()=> new Set(selected.value))
const selectedCount = computed(()=> selected.value.length)
function isSelected(id:string){ return selectedSet.value.has(id) }
function toggleSelect(id:string){
  const idx = selected.value.indexOf(id)
  if (idx>=0) selected.value.splice(idx,1)
  else selected.value.push(id)
}
const isAllPageSelected = computed(()=> pagedSantri.value.length>0 && pagedSantri.value.every(s=>selectedSet.value.has(s.id)))
function toggleSelectAllPage(){
  if (isAllPageSelected.value){
    selected.value = selected.value.filter(id => !pagedSantri.value.some(s=>s.id===id))
  } else {
    const add = pagedSantri.value.map(s=>s.id).filter(id=>!selectedSet.value.has(id))
    selected.value = selected.value.concat(add)
  }
}
watch([selectedMapelId, termKey], ()=>{ selected.value = [] })

/* ===== Quick Entry ===== */
const showQuickInput = ref(false)
const qiQ = ref('')
const qiPage = ref(1)
const qiPageSize = ref(20)
const qiMass = reactive<GradeRecord>({})
const qiPaste = ref('')
const togglePasteHelp = ref(false)

function openQuickInput(){
  if (!selectedMapelId.value) { alert('Pilih mapel dulu.'); return }
  const source = qiFilteredSantri.value // pastikan draft utk item yg akan muncul
  for (const s of source) ensureDraftFor(s.id)
  qiPage.value = 1
  showQuickInput.value = true
}
function closeQuickInput(){ showQuickInput.value = false }
function openQuickInputSelected(){ if (!selectedCount.value) return; openQuickInput() }

/* Quick Input list = terpilih jika ada, kalau tidak pakai yang terfilter umum */
const qiFilteredSantri = computed(()=>{
  const baseIds = selectedCount.value ? new Set(selected.value) : null
  let list = santriRows.value.filter(s => !baseIds || baseIds.has(s.id))
  if (selectedJenjang.value !== 'all') list = list.filter(s => (s.jenjang||'').toUpperCase().includes(selectedJenjang.value))
  if (selectedMaskan.value !== 'all') list = list.filter(s => (s.maskan||'') === selectedMaskan.value)
  const s = qiQ.value.trim().toLowerCase()
  if (s) list = list.filter(x => [x.santri, x.maskan, x.kamar].some(v => (v||'').toLowerCase().includes(s)))
  return list.sort((a,b)=> (a.santri||'').localeCompare(b.santri||''))
})
const qiTotalPages = computed(()=> Math.max(1, Math.ceil(qiFilteredSantri.value.length / qiPageSize.value)))
watch([qiFilteredSantri, qiPageSize], ()=> { qiPage.value = 1 })
const qiPagedSantri = computed(()=>{
  const start = (qiPage.value - 1) * qiPageSize.value
  const pageItems = qiFilteredSantri.value.slice(start, start + qiPageSize.value)
  for (const s of pageItems) ensureDraftFor(s.id)
  return pageItems
})

function applyMassFill(){
  const keys: (keyof GradeRecord)[] = ['tugas','harian','pts','pas','proyek','lainnya']
  for (const s of qiPagedSantri.value) {
    ensureDraftFor(s.id)
    for (const k of keys) {
      const val = (qiMass as any)[k]
      if (val === undefined || val === null || val === '') continue
      const curr = (draft[s.id] as any)[k]
      if (curr === undefined || curr === null || curr === '') {
        (draft[s.id] as any)[k] = Number(val)
      }
    }
  }
}

function applyPaste(){
  if (!qiPaste.value.trim()) return
  const lines = qiPaste.value.trim().split(/\r?\n/).filter(Boolean)
  const header = lines.shift()
  if (!header) return
  const sep = header.includes('\t') ? '\t' : ','
  const hcols = header.split(sep).map(h=>h.trim().replace(/^"|"$/g,'').toLowerCase())

  const idx = (name:string)=> hcols.findIndex(h => h === name)
  const iId = idx('santriid')
  const iNama = idx('nama')
  const iT = idx('tugas'), iH = idx('harian'), iPts = idx('pts'), iPas = idx('pas')
  const iProy = idx('proyek'), iLain = idx('lainnya'), iC = idx('catatan')

  const byName = new Map<string, string>()
  for (const s of santriRows.value) {
    const nm = (s.santri||'').trim().toLowerCase()
    if (nm) byName.set(nm, s.id)
  }

  for (const line of lines){
    const cols = line.split(sep).map(c=>c.replace(/^"|"$/g,'').replace(/""/g,'"'))
    let sid = iId>=0 ? (cols[iId]||'').trim() : ''
    if (!sid && iNama>=0) {
      const nm = (cols[iNama]||'').trim().toLowerCase()
      sid = byName.get(nm) || ''
    }
    if (!sid) continue
    ensureDraftFor(sid)
    if (iT>=0) draft[sid].tugas = Number(cols[iT]||0)
    if (iH>=0) draft[sid].harian = Number(cols[iH]||0)
    if (iPts>=0) draft[sid].pts = Number(cols[iPts]||0)
    if (iPas>=0) draft[sid].pas = Number(cols[iPas]||0)
    if (iProy>=0 && cols[iProy] !== '') draft[sid].proyek = Number(cols[iProy]||0)
    if (iLain>=0 && cols[iLain] !== '') draft[sid].lainnya = Number(cols[iLain]||0)
    if (iC>=0) draft[sid].catatan = String(cols[iC]||'')
  }
}

async function saveQuickInput(){
  if (!selectedMapelId.value) return
  const payload: Record<string, GradeRecord> = {}
  for (const s of qiPagedSantri.value) payload[s.id] = { ...draft[s.id] }
  await bulkSaveNilai(termKey.value, selectedMapelId.value, payload)
}
async function saveQuickInputAll(){
  if (!selectedMapelId.value) return
  const payload: Record<string, GradeRecord> = {}
  for (const s of qiFilteredSantri.value) { ensureDraftFor(s.id); payload[s.id] = { ...draft[s.id] } }
  await bulkSaveNilai(termKey.value, selectedMapelId.value, payload)
}

/* ===== Bulk Edit (Terpilih) ===== */
const showBulkEdit = ref(false)
const bulkForm = reactive<GradeRecord>({})
const bulkOverwrite = ref(false)
function openBulkEdit(){
  if (!selectedCount.value) return
  Object.assign(bulkForm, { tugas:undefined, harian:undefined, pts:undefined, pas:undefined, proyek:undefined, lainnya:undefined, catatan:'' })
  bulkOverwrite.value = false
  showBulkEdit.value = true
}
function applyBulkEditAndMaybeSave(saveNow:boolean){
  const keys: (keyof GradeRecord)[] = ['tugas','harian','pts','pas','proyek','lainnya','catatan']
  for (const id of selected.value){
    ensureDraftFor(id)
    for (const k of keys){
      const nv = (bulkForm as any)[k]
      if (nv === undefined || nv === null || nv === '') continue
      const curr = (draft[id] as any)[k]
      if (bulkOverwrite.value || curr === undefined || curr === null || curr === ''){
        (draft[id] as any)[k] = (k==='catatan') ? String(nv) : Number(nv)
      }
    }
  }
  if (saveNow) saveSelected()
  showBulkEdit.value = false
}
async function saveSelected(){
  if (!selectedMapelId.value) return
  const payload: Record<string, GradeRecord> = {}
  for (const id of selected.value){ ensureDraftFor(id); payload[id] = { ...draft[id] } }
  await bulkSaveNilai(termKey.value, selectedMapelId.value, payload)
}

/* ===== Delete Nilai (Terpilih) ===== */
const { $realtimeDb } = useNuxtApp() as any
async function confirmDeleteSelected(){
  if (!selectedCount.value || !selectedMapelId.value) return
  if (!confirm(`Hapus nilai ${selectedCount.value} santri untuk mapel ini?`)) return
  const base = dref($realtimeDb, `alberr/nilai/${termKey.value}/${selectedMapelId.value}`)
  const updates: Record<string, null> = {}
  for (const id of selected.value) updates[id] = null
  await update(base, updates)
  for (const id of selected.value) { delete draft[id] }
  selected.value = []
}

/* ===== Lifecycle ===== */
onMounted(async ()=>{ subscribeSubjects(); subscribeSantri(); await fetchSantri() })
onUnmounted(()=>{ unbindSubjects(); unsubscribeSantri(); unsubscribeNilai() })
</script>

<style scoped>
.shadow-xs{ box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05); }
</style>
