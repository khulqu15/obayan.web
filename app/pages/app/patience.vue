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
            Total Entri: {{ totalEntries }}, Poin (-): <span class="text-rose-600">{{ totalMinus }}</span>,
            Poin (+): <span class="text-emerald-600">{{ totalPlus }}</span>
          </div>
        </div>
      </div>
    </details>

    <!-- ====== TABLE (desktop) – default OPEN ====== -->
    <details class="group mt-4 hidden md:block rounded-2xl border border-gray-200 bg-white dark:bg-neutral-800 overflow-hidden" open>
      <summary class="flex items-center justify-between p-4 cursor-pointer select-none">
        <div class="font-semibold">Daftar & Input Entri</div>
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
                      @click="saveSelected(); showBulkMenu=false">Simpan Entri (Terpilih)</button>
              <div class="my-1 border-t dark:border-neutral-700"></div>
              <button class="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-neutral-700 rounded-lg"
                      @click="openDeleteMonthSelected(); showBulkMenu=false">Hapus Semua Entri Bulan Ini (Terpilih)</button>
            </div>
          </div>
        </div>

        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-neutral-900/40">
            <tr>
              <th class="px-3 py-2 w-10"><input type="checkbox" :checked="isAllPageSelected" @change="toggleSelectAllPage"></th>
              <th class="px-3 py-2 text-left w-56">Santri</th>
              <th class="px-3 py-2 text-left w-40">Maskan/Kamar</th>
              <th class="px-3 py-2 text-center w-24">Saldo Bulan</th>
              <th class="px-3 py-2 text-center w-28">Tipe</th>
              <th class="px-3 py-2 text-center w-36">Kategori</th>
              <th class="px-3 py-2 text-center w-28">Level</th>
              <th class="px-3 py-2 text-left">Judul</th>
              <th class="px-3 py-2 text-center w-24">Poin</th>
              <th class="px-3 py-2 text-center w-28">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-neutral-700">
            <template v-for="s in pagedSantri" :key="s.id">
              <tr>
                <td class="px-3 py-2"><input type="checkbox" :checked="isSelected(s.id)" @change="toggleSelect(s.id)"></td>

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

                <td class="px-3 py-2 text-center font-semibold"
                    :class="saldoBySantri[s.id] >= 0 ? 'text-emerald-600' : 'text-rose-600'">
                  {{ saldoBySantri[s.id] ?? 0 }}
                </td>

                <!-- Input cepat entri -->
                <td class="px-1 py-1 text-center">
                  <select v-model="draft[s.id].type" class="w-28 text-xs p-1 rounded border border-gray-200 dark:border-neutral-700">
                    <option value="pelanggaran">Pelanggaran</option>
                    <option value="keteladanan">Keteladanan</option>
                  </select>
                </td>
                <td class="px-1 py-1 text-center">
                  <select v-model="draft[s.id].category" class="w-36 text-xs p-1 rounded border border-gray-200 dark:border-neutral-700">
                    <option v-for="c in categories" :key="c" :value="c">{{ labelCategory(c) }}</option>
                  </select>
                </td>
                <td class="px-1 py-1 text-center">
                  <select v-model="draft[s.id].severity" class="w-28 text-xs p-1 rounded border border-gray-200 dark:border-neutral-700">
                    <option>Ringan</option><option>Sedang</option><option>Berat</option>
                  </select>
                </td>

                <td class="px-1 py-1 text-left">
                  <input v-model.trim="draft[s.id].title" placeholder="Judul singkat" class="w-72 text-sm rounded border border-gray-200 dark:border-neutral-700 px-2 py-1"/>
                </td>

                <td class="px-1 py-1 text-center">
                  <input v-model.number="draft[s.id].points" type="number" class="w-24 text-center border-gray-200 rounded border dark:border-neutral-700"/>
                </td>

                <td class="px-3 py-2 text-center">
                  <div class="flex items-center gap-1 justify-center">
                    <button class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700" @click="saveOne(s.id)">Simpan</button>
                    <button class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700" @click="openEditFirst(s.id)">Edit</button>
                  </div>
                </td>
              </tr>

              <!-- Detail: daftar entri bulan ini untuk santri -->
              <tr v-show="rowExpandedId===s.id">
                <td></td>
                <td colspan="9" class="bg-gray-50 dark:bg-neutral-900/40">
                  <div class="p-4 space-y-2">
                    <div v-if="(entriesBySantri.get(s.id)?.length || 0)===0" class="text-sm text-gray-500">Belum ada entri pada bulan ini.</div>
                    <div v-for="e in entriesBySantri.get(s.id) || []" :key="e.id"
                         class="rounded-lg border border-gray-200 dark:border-neutral-700 p-3 flex items-start gap-3">
                      <div class="min-w-0">
                        <div class="text-sm font-medium truncate">{{ e.title || '(tanpa judul)' }}</div>
                        <div class="text-[11px] text-gray-500">
                          {{ new Date(e.createdAt as number).toLocaleString() }} •
                          <span class="capitalize">{{ e.type }}</span> •
                          {{ labelCategory(e.category) }} •
                          {{ e.severity }}
                        </div>
                        <div class="text-xs mt-1 whitespace-pre-line">{{ e.desc || '' }}</div>
                      </div>
                      <div class="ml-auto text-right">
                        <div :class="[ 'font-semibold', e.points>=0 ? 'text-emerald-600' : 'text-rose-600' ]">{{ e.points }}</div>
                        <div class="text-xs mt-1"><span :class="chipStatus(e.status)">{{ labelStatus(e.status) }}</span></div>
                        <div class="mt-2 flex items-center gap-1 justify-end">
                          <button class="px-2 py-1 text-[11px] rounded border" @click="toReview(e)" v-if="e.status==='open'">Review</button>
                          <button class="px-2 py-1 text-[11px] rounded bg-blue-600 text-white" @click="closeCase(e)" v-if="e.status==='review'">Selesai</button>
                          <button class="px-2 py-1 text-[11px] rounded border text-rose-600" @click="voidCase(e)" v-if="e.status!=='void'">Void</button>
                          <button class="px-2 py-1 text-[11px] rounded border" @click="openEdit(e)">Edit</button>
                          <button class="px-2 py-1 text-[11px] rounded border text-rose-600" @click="removeEntry(e)">Hapus</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>

            <tr v-if="!pagedSantri.length"><td colspan="10" class="px-3 py-6 text-center text-gray-500">Tidak ada data pada halaman ini.</td></tr>
          </tbody>
        </table>
      </div>

      <!-- footer controls -->
      <div class="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-t border-gray-200 dark:border-neutral-700">
        <div class="text-xs text-gray-500">
          Term: <b>{{ termKey }}</b> • Periode: <b>{{ bulanLabel[bulan-1] }} {{ tahun }}</b>
        </div>
        <div class="flex items-center gap-2">
          <select v-model.number="pageSize" class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700">
            <option :value="10">10</option><option :value="20">20</option><option :value="50">50</option><option :value="100">100</option>
          </select>
          <div class="text-xs">Hal: {{ page }} / {{ totalPages || 1 }}</div>
          <button class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700" :disabled="page<=1" @click="page--">Prev</button>
          <button class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700" :disabled="page>=totalPages" @click="page++">Next</button>
          <button @click="saveAll" class="px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700">Simpan Semua (Halaman)</button>
        </div>
      </div>
    </details>

    <!-- ===== Mobile Cards (default OPEN) ===== -->
    <details class="group mt-4 md:hidden rounded-xl border border-gray-200 bg-white dark:bg-neutral-800" open>
      <summary class="flex items-center justify-between p-4 cursor-pointer select-none">
        <div class="font-semibold">Daftar & Input Entri</div>
        <Icon icon="lucide:chevron-down" class="size-5 text-gray-500 transition group-open:rotate-180"/>
      </summary>

      <div class="border-t border-gray-200 dark:border-neutral-700 p-4 space-y-3">
        <div v-for="s in pagedSantri" :key="s.id" class="rounded-xl border border-gray-200 dark:border-neutral-700">
          <details class="group" open>
            <summary class="flex items-start justify-between gap-2 p-4 cursor-pointer select-none">
              <div class="flex items-start gap-2">
                <input type="checkbox" class="mt-1" :checked="isSelected(s.id)" @change="toggleSelect(s.id)">
                <div class="min-w-0">
                  <div class="font-medium truncate">{{ s.santri }}</div>
                  <div class="text-[11px] text-gray-500">{{ s.maskan || '-' }} • {{ s.kamar || '-' }}</div>
                  <div class="text-[11px]">Saldo: <b :class="saldoBySantri[s.id] >= 0 ? 'text-emerald-600' : 'text-rose-600'">{{ saldoBySantri[s.id] ?? 0 }}</b></div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-xs">{{ bulanLabel[bulan-1] }} {{ tahun }}</div>
              </div>
            </summary>

            <div class="border-t border-gray-200 dark:border-neutral-700 p-4 space-y-2">
              <div class="grid grid-cols-2 gap-2">
                <select v-model="draft[s.id].type" class="text-xs rounded border border-gray-200 dark:border-neutral-700">
                  <option value="pelanggaran">Pelanggaran</option>
                  <option value="keteladanan">Keteladanan</option>
                </select>
                <select v-model="draft[s.id].category" class="text-xs rounded border border-gray-200 dark:border-neutral-700">
                  <option v-for="c in categories" :key="c" :value="c">{{ labelCategory(c) }}</option>
                </select>
                <select v-model="draft[s.id].severity" class="text-xs rounded border border-gray-200 dark:border-neutral-700">
                  <option>Ringan</option><option>Sedang</option><option>Berat</option>
                </select>
                <input v-model.trim="draft[s.id].title" placeholder="Judul" class="rounded border border-gray-200 dark:border-neutral-700 px-2 py-1"/>
                <input v-model.number="draft[s.id].points" type="number" placeholder="Poin" class="rounded border border-gray-200 dark:border-neutral-700 px-2 py-1"/>
              </div>
              <div class="mt-2 flex items-center justify-end gap-2">
                <button class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700" @click="openEditFirst(s.id)">Modal</button>
                <button class="px-2 py-1 text-xs rounded bg-blue-600 text-white" @click="saveOne(s.id)">Simpan</button>
              </div>

              <div class="pt-3">
                <div class="text-xs text-gray-500 mb-1">Entri bulan ini</div>
                <div v-for="e in entriesBySantri.get(s.id) || []" :key="e.id" class="rounded border border-gray-200 dark:border-neutral-700 p-2 text-xs flex items-start gap-2">
                  <div class="min-w-0">
                    <div class="font-medium truncate">{{ e.title || '(tanpa judul)' }}</div>
                    <div class="text-[10px] text-gray-500">{{ new Date(e.createdAt as number).toLocaleString() }} • {{ labelCategory(e.category) }} • {{ e.severity }}</div>
                  </div>
                  <div class="ml-auto text-right">
                    <div :class="[ 'font-semibold', e.points>=0 ? 'text-emerald-600' : 'text-rose-600' ]">{{ e.points }}</div>
                    <div class="mt-1 flex items-center gap-1 justify-end">
                      <button class="px-2 py-1 rounded border" @click="openEdit(e)">Edit</button>
                      <button class="px-2 py-1 rounded border text-rose-600" @click="removeEntry(e)">Hapus</button>
                    </div>
                  </div>
                </div>
                <div v-if="!(entriesBySantri.get(s.id)?.length)" class="text-xs text-gray-500">—</div>
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

    <!-- ===== Modal: Create/Edit (pakai yang lama, dipakai saat Edit entri) ===== -->
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
                  <label class="text-xs">Poin</label>
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

definePageMeta({ layout: 'app', layoutProps: { title: 'Buku Sabar' } })

/* ===== Sources ===== */
const { rows: santriRows, fetchSantri, subscribeSantri, unsubscribeSantri } = useSantri()
const {
  rows, subscribePatience, unsubscribePatience,
  createPatience, updatePatience, deletePatience,
  chipStatus, labelStatus, labelCategory, makeTermKey
} = usePatience()

/* ===== Term & Bulan ===== */
const tahunAwal = ref<number>(new Date().getMonth() >= 6 ? new Date().getFullYear() : new Date().getFullYear()-1)
const semester = ref<'Ganjil'|'Genap'>(new Date().getMonth() >= 6 ? 'Ganjil' : 'Genap')
const termKey = computed(()=> makeTermKey(tahunAwal.value, semester.value))

const now = new Date()
const bulanLabel = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
const bulan = ref<number>(now.getMonth()+1)
const tahun = ref<number>(now.getFullYear())

const monthFrom = computed(()=> new Date(tahun.value, bulan.value-1, 1, 0,0,0,0).getTime())
const monthTo   = computed(()=> new Date(tahun.value, bulan.value,   0, 23,59,59,999).getTime())
function reloadMonth(){ subscribePatience({ limit: 5000, from: monthFrom.value, to: monthTo.value, term: termKey.value }) }
watch([bulan, tahun, termKey], () => reloadMonth())

/* ===== Filters (Santri) ===== */
const q = ref('')
const selectedJenjang = ref<'all'|'SD'|'SMP'|'SMA'|'SMK'>('all')
const selectedMaskan = ref<'all'|string>('all')

const maskanOptions = computed(()=> {
  const s = new Set<string>()
  santriRows.value.forEach(x => (x.maskan||'').trim() && s.add((x.maskan||'').trim()))
  return Array.from(s).sort((a,b)=>a.localeCompare(b))
})

/* ===== Derive: entries bulan & indeks by santri ===== */
const monthEntries = computed<PatienceEntry[]>(() => rows.value.slice()) // sudah difilter by subscribe (range+term)
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
const totalMinus = computed(()=> monthEntries.value.filter(x=>x.points<0).reduce((a,b)=>a+(b.points||0),0))
const totalPlus  = computed(()=> monthEntries.value.filter(x=>x.points>0).reduce((a,b)=>a+(b.points||0),0))

/* ===== Santri list + paginate ===== */
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
const totalPages = computed(()=> Math.max(1, Math.ceil(filteredSantri.value.length / pageSize.value)))
watch([filteredSantri, pageSize], ()=> { page.value = 1 })
const pagedSantri = computed(()=> {
  const start = (page.value - 1) * pageSize.value
  return filteredSantri.value.slice(start, start + pageSize.value)
})

/* ===== Draft entri per-santri (input cepat) ===== */
type DraftEntry = {
  type: 'pelanggaran'|'keteladanan'
  category: PatienceCategory
  severity: 'Ringan'|'Sedang'|'Berat'
  title: string
  points: number
  desc?: string
  reportedBy?: string
  handledBy?: string
  location?: string
}
const categories: PatienceCategory[] = ['adab','kedisiplinan','kebersihan','ibadah','akademik','lainnya']
const draft = reactive<Record<string, DraftEntry>>({})
function ensureDraftFor(id:string){
  draft[id] = draft[id] || { type:'pelanggaran', category:'kedisiplinan', severity:'Ringan', title:'', points:0, desc:'', reportedBy:'', handledBy:'', location:'' }
}
watch(pagedSantri, ()=> { for (const s of pagedSantri.value) ensureDraftFor(s.id) })

/* Helpers */
function selectedMonthMidTs(){ return new Date(tahun.value, bulan.value-1, 15, 12, 0, 0, 0).getTime() }

/* ===== Selection ===== */
const selected = ref<string[]>([])
const selectedSet = computed(()=> new Set(selected.value))
const selectedCount = computed(()=> selected.value.length)
function isSelected(id:string){ return selectedSet.value.has(id) }
function toggleSelect(id:string){
  const i = selected.value.indexOf(id)
  if (i>=0) selected.value.splice(i,1); else selected.value.push(id)
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

/* ===== Row expand ===== */
const rowExpandedId = ref<string|null>(null)
function toggleRow(id: string){ rowExpandedId.value = rowExpandedId.value === id ? null : id }

/* ===== CRUD cepat ===== */
async function saveOne(id:string){
  ensureDraftFor(id)
  const d = draft[id]
  if (!d.title?.trim() && !Number(d.points)) { alert('Isi minimal judul atau poin.'); return }
  const s = santriRows.value.find(x=>x.id===id)
  if (!s) return
  await createPatience({
    santriId: id,
    name: s.santri || 'Santri',
    type: d.type,
    category: d.category,
    severity: d.severity,
    title: d.title?.trim() || '',
    desc: d.desc?.trim(),
    points: Number(d.points||0),
    reportedBy: d.reportedBy?.trim(),
    handledBy: d.handledBy?.trim(),
    location: d.location?.trim(),
    status: 'open',
    term: termKey.value,
    createdAt: selectedMonthMidTs(),   // penting: simpan ke bulan yang dipilih
    evidenceFile: undefined
  } as any)
  // reset ringan
  d.title=''; d.points=0
}

async function saveAll(){
  for (const s of pagedSantri.value){ await saveOne(s.id) }
}

async function saveSelected(){
  if (!selectedCount.value) return alert('Pilih minimal satu santri.')
  for (const id of selected.value){ await saveOne(id) }
}

/* ===== Delete semua entri bulan ini (selected) ===== */
const showKebab = ref(false)
const showBulkMenu = ref(false)
const showDeleteMonth = ref(false)
const deleteMonthConfirm = ref('')
const deleting = ref(false)
function openDeleteMonthSelected(){
  if (!selectedCount.value) { alert('Pilih santri dulu.'); return }
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
    alert('Semua entri bulan ini untuk santri terpilih telah dihapus.')
  } catch(e:any){
    alert('Gagal menghapus sebagian entri: ' + (e?.message || e))
  } finally { deleting.value = false }
}

/* ===== Edit via modal (pakai form bawaan) ===== */
const showForm = ref(false)
const formMode = ref<'create'|'edit'>('create')
const saving = ref(false)
const editing = ref<PatienceEntry|null>(null)
const evidenceFile = ref<File|null>(null)
const form = reactive<any>({
  name:'', santriId:'', type:'pelanggaran',
  category:'kedisiplinan', severity:'Ringan',
  title:'', desc:'', points:-1,
  reportedBy:'', handledBy:'', location:''
})
function resetForm(){
  Object.assign(form, { name:'', santriId:'', type:'pelanggaran', category:'kedisiplinan', severity:'Ringan', title:'', desc:'', points:-1, reportedBy:'', handledBy:'', location:'' })
  evidenceFile.value = null
}
function onPickEvidence(ev: Event){ evidenceFile.value = (ev.target as HTMLInputElement).files?.[0] || null }
function openEditFirst(id:string){
  const first = (entriesBySantri.value.get(id) || [])[0]
  if (!first) { alert('Belum ada entri pada bulan ini.'); return }
  openEdit(first)
}
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
  if (!form.name?.trim() || !form.title?.trim()) { alert('Nama & Judul wajib.'); return }
  saving.value = true
  try {
    if (formMode.value==='edit' && editing.value) {
      await updatePatience(editing.value.id, {
        santriId: form.santriId, name: form.name.trim(), type: form.type,
        category: form.category, severity: form.severity,
        title: form.title.trim(), desc: form.desc?.trim(), points: Number(form.points||0),
        reportedBy: form.reportedBy?.trim(), handledBy: form.handledBy?.trim(), location: form.location?.trim(),
        term: termKey.value,
        evidenceFile: evidenceFile.value || undefined
      } as any)
      showForm.value = false
    }
  } finally { saving.value = false }
}

/* ===== Row actions pada detail ===== */
async function toReview(e: PatienceEntry){ await updatePatience(e.id, { status: 'review' }) }
async function closeCase(e: PatienceEntry){ await updatePatience(e.id, { status: 'closed' }) }
async function voidCase(e: PatienceEntry){ if (confirm('Jadikan VOID entri ini?')) await updatePatience(e.id, { status: 'void' }) }
async function removeEntry(e: PatienceEntry){ if (confirm(`Hapus entri: ${e.title}?`)) await deletePatience(e.id) }

/* ===== Export CSV (bulan+term) ===== */
function exportCSV(){
  const header = ['term','bulan','tahun','santriId','nama','saldo_bulan','tipe','kategori','level','judul','poin','status','waktu']
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
          termKey.value, bulanLabel[bulan.value-1], tahun.value, s.id, s.santri||'', saldo,
          e.type, e.category, e.severity, e.title, e.points, e.status, new Date(e.createdAt as number).toISOString()
        ].map(x => `"${String(x).replace(/"/g,'""')}"`)
        lines.push(cols.join(','))
      }
    }
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob); const a = document.createElement('a')
  a.href = url; a.download = `patience_${termKey.value}_${tahun.value}-${String(bulan.value).padStart(2,'0')}.csv`; a.click(); URL.revokeObjectURL(url)
}

/* ===== Autocomplete Santri pada modal ===== */
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
  reloadMonth()
})
onUnmounted(() => { unsubscribeSantri(); unsubscribePatience() })
</script>

<style scoped>
.shadow-xs{ box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05); }
</style>
