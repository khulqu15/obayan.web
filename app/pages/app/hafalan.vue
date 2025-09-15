<template>
  <section class="p-6">
    <div class="flex items-center gap-2 mb-3">
      <h1 class="text-xl font-semibold">Hafalan Santri (Per Bulan)</h1>
      <span class="text-sm text-gray-500 dark:text-neutral-400">({{ totalFiltered }} santri)</span>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div class="flex flex-wrap items-center gap-2">
        <div class="relative">
          <Icon icon="lucide:search" class="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input v-model="q" type="search" placeholder="Cari santri / maskan / kamar…"
                 class="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700 w-60"/>
        </div>

        <select v-model="selectedJenjang" class="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700">
          <option value="all">Semua Jenjang</option><option>SD</option><option>SMP</option><option>SMA</option><option>SMK</option>
        </select>
        <select v-model="selectedMaskan" class="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700">
          <option value="all">Semua Maskan</option>
          <option v-for="m in maskanOptions" :key="m" :value="m">{{ m }}</option>
        </select>

        <!-- Bulan / Tahun -->
        <select v-model.number="bulan" class="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700">
          <option v-for="(m,i) in bulanLabel" :key="i" :value="i+1">{{ m }}</option>
        </select>
        <input v-model.number="tahun" type="number" class="w-24 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700" />
        <button @click="reloadMonth" class="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700">Terapkan</button>

        <!-- Kebab -->
        <div class="relative">
          <button @click="showKebab=!showKebab" class="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-neutral-700">
            <Icon icon="lucide:more-horizontal" class="size-5"/>
          </button>
          <div v-if="showKebab" class="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 bg-white shadow-lg dark:bg-neutral-800 dark:border-neutral-700 z-10">
            <button class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-700 rounded-lg" @click="exportCSV(); showKebab=false">Export CSV</button>
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

    <!-- Ringkasan -->
    <details class="group mt-4 rounded-xl border border-gray-200 bg-white dark:bg-neutral-800" open>
      <summary class="flex items-center justify-between gap-2 p-4 cursor-pointer select-none">
        <div class="font-semibold">Ringkasan — {{ bulanLabel[bulan-1] }} {{ tahun }}</div>
        <Icon icon="lucide:chevron-down" class="size-5 text-gray-500 transition group-open:rotate-180"/>
      </summary>
      <div class="border-t border-gray-200 dark:border-neutral-700 p-4 grid grid-cols-2 md:grid-cols-6 gap-3 text-sm">
        <div class="rounded-lg border border-gray-200 dark:border-neutral-700 p-4">
          <div class="text-gray-500">Total Entri</div>
          <div class="text-lg font-semibold">{{ totalEntries }}</div>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-neutral-700 p-4">
          <div class="text-gray-500">Avg Skor</div>
          <div class="text-lg font-semibold">{{ avgScore }}</div>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-neutral-700 p-4">
          <div class="text-gray-500">Pending</div>
          <div class="text-lg font-semibold">{{ stat.pending }}</div>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-neutral-700 p-4">
          <div class="text-gray-500">Diterima</div>
          <div class="text-lg font-semibold">{{ stat.accepted }}</div>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-neutral-700 p-4">
          <div class="text-gray-500">Revisi</div>
          <div class="text-lg font-semibold">{{ stat.revisi }}</div>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-neutral-700 p-4">
          <div class="text-gray-500">Ditolak</div>
          <div class="text-lg font-semibold">{{ stat.rejected }}</div>
        </div>
      </div>
    </details>

    <!-- Tabel Desktop -->
    <details class="group mt-4 hidden md:block rounded-2xl border border-gray-200 bg-white dark:bg-neutral-800 overflow-hidden" open>
      <summary class="flex items-center justify-between p-4 cursor-pointer select-none">
        <div class="font-semibold">Daftar & Input Hafalan</div>
        <Icon icon="lucide:chevron-down" class="size-5 text-gray-500 transition group-open:rotate-180"/>
      </summary>

      <div class="border-t border-gray-200 dark:border-neutral-700 p-4 overflow-auto">
        <!-- Bulk bar -->
        <div v-if="selectedCount" class="mb-3 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs dark:border-blue-900/50 dark:bg-blue-900/20">
          <div><b>{{ selectedCount }}</b> baris dipilih</div>
          <div class="flex items-center gap-2">
            <button class="px-2 py-1 rounded border border-blue-200 dark:border-blue-800" @click="saveSelected">Simpan Entri (Terpilih)</button>
            <button class="px-2 py-1 rounded border border-rose-300 text-rose-700 dark:border-rose-900/50" @click="openDeleteMonthSelected">Hapus Entri Bulan Ini</button>
          </div>
        </div>

        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-neutral-900/40">
            <tr>
              <th class="px-3 py-2 w-10"><input type="checkbox" :checked="isAllPageSelected" @change="toggleSelectAllPage"></th>
              <th class="px-3 py-2 text-left w-56">Santri</th>
              <th class="px-3 py-2 text-left w-40">Maskan/Kamar</th>
              <th class="px-3 py-2 text-center w-24"># Entri</th>
              <th class="px-3 py-2 text-center w-24">Avg Skor</th>

              <th class="px-3 py-2 text-center w-28">Tipe</th>

              <!-- Meta ringkas per tipe -->
              <th class="px-3 py-2 text-left w-40">Surah/Kitab/Mapel</th>
              <th class="px-3 py-2 text-center w-36">Rentang / Materi</th>

              <th class="px-3 py-2 text-center w-20">Skor</th>
              <th class="px-3 py-2 text-left w-36">Evaluator</th>
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
                <td class="px-3 py-2 text-center font-semibold">{{ (entriesBySantri.get(s.id)?.length)||0 }}</td>
                <td class="px-3 py-2 text-center font-semibold">{{ avgBySantri[s.id] ?? 0 }}</td>

                <!-- Input cepat -->
                <td class="px-1 py-1 text-center">
                  <select v-model="draft[s.id].type" class="w-28 text-xs rounded border border-gray-200 dark:border-neutral-700">
                    <option value="alquran">Al-Qur'an</option><option value="kitab">Kitab</option><option value="pelajaran">Pelajaran</option>
                  </select>
                </td>
                <td class="px-1 py-1">
                  <input v-if="draft[s.id].type==='alquran'" v-model.trim="draft[s.id].metaQ.surah" placeholder="Surah"
                         class="w-40 text-sm rounded border border-gray-200 dark:border-neutral-700 px-2 py-1"/>
                  <input v-else-if="draft[s.id].type==='kitab'" v-model.trim="draft[s.id].metaK.kitab" placeholder="Kitab"
                         class="w-40 text-sm rounded border border-gray-200 dark:border-neutral-700 px-2 py-1"/>
                  <input v-else v-model.trim="draft[s.id].metaP.mapel" placeholder="Mapel"
                         class="w-40 text-sm rounded border border-gray-200 dark:border-neutral-700 px-2 py-1"/>
                </td>
                <td class="px-1 py-1 text-center">
                  <div v-if="draft[s.id].type==='alquran'" class="flex items-center gap-1 justify-center">
                    <input v-model.number="draft[s.id].metaQ.ayatFrom" type="number" placeholder="Ayat dari" class="w-20 text-center rounded border border-gray-200 dark:border-neutral-700 px-2 py-1"/>
                    <span class="text-xs">-</span>
                    <input v-model.number="draft[s.id].metaQ.ayatTo" type="number" placeholder="Ayat s/d" class="w-20 text-center rounded border border-gray-200 dark:border-neutral-700 px-2 py-1"/>
                  </div>
                  <div v-else-if="draft[s.id].type==='kitab'" class="flex items-center gap-1 justify-center">
                    <input v-model.number="draft[s.id].metaK.halamanFrom" type="number" placeholder="Hal dari" class="w-20 text-center rounded border border-gray-200 dark:border-neutral-700 px-2 py-1"/>
                    <span class="text-xs">-</span>
                    <input v-model.number="draft[s.id].metaK.halamanTo" type="number" placeholder="Hal s/d" class="w-20 text-center rounded border border-gray-200 dark:border-neutral-700 px-2 py-1"/>
                  </div>
                  <input v-else v-model.trim="draft[s.id].metaP.materi" placeholder="Materi"
                         class="w-36 text-sm rounded border border-gray-200 dark:border-neutral-700 px-2 py-1"/>
                </td>

                <td class="px-1 py-1 text-center">
                  <input v-model.number="draft[s.id].score" type="number" min="0" max="100" class="w-20 text-center rounded border border-gray-200 dark:border-neutral-700"/>
                </td>
                <td class="px-1 py-1">
                  <input v-model.trim="draft[s.id].evaluator" placeholder="Ustadz/Guru" class="w-36 text-sm rounded border border-gray-200 dark:border-neutral-700 px-2 py-1"/>
                </td>

                <td class="px-3 py-2 text-center">
                  <div class="flex items-center gap-1 justify-center">
                    <button class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700" @click="saveOne(s.id)">Simpan</button>
                    <button class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700" @click="openEditFirst(s.id)">Modal</button>
                  </div>
                </td>
              </tr>

              <!-- Detail entri bulan ini untuk santri -->
              <tr v-show="rowExpandedId===s.id">
                <td></td>
                <td colspan="10" class="bg-gray-50 dark:bg-neutral-900/40">
                  <div class="p-4 space-y-2">
                    <div v-if="(entriesBySantri.get(s.id)?.length||0)===0" class="text-sm text-gray-500">Belum ada entri bulan ini.</div>
                    <div v-for="e in entriesBySantri.get(s.id) || []" :key="e.id"
                         class="rounded-lg border border-gray-200 dark:border-neutral-700 p-3 flex items-start gap-3">
                      <div class="min-w-0">
                        <div class="text-sm font-medium truncate">{{ material(e) }}</div>
                        <div class="text-[11px] text-gray-500">
                          {{ new Date(e.submittedAt as number).toLocaleString() }} •
                          <span class="capitalize">{{ e.type }}</span> •
                          Skor: <b>{{ e.score ?? '-' }}</b> • Pred: <b>{{ e.predikat || '-' }}</b>
                        </div>
                        <div class="text-xs mt-1 whitespace-pre-line">{{ e.note || '' }}</div>
                        <div v-if="e.audioUrl" class="mt-2"><audio :src="e.audioUrl" controls class="w-full"></audio></div>
                      </div>
                      <div class="ml-auto text-right">
                        <div class="text-xs"><span :class="chipStatus(e.status)">{{ labelStatus(e.status) }}</span></div>
                        <div class="mt-2 flex items-center gap-1 justify-end">
                          <button v-if="e.status==='pending'||e.status==='revisi'" class="px-2 py-1 text-[11px] rounded bg-blue-600 text-white" @click="accept(e)">Terima</button>
                          <button v-if="e.status==='pending'" class="px-2 py-1 text-[11px] rounded border" @click="askRevisi(e)">Revisi</button>
                          <button class="px-2 py-1 text-[11px] rounded border text-rose-600" @click="reject(e)">Tolak</button>
                          <button class="px-2 py-1 text-[11px] rounded border" @click="openEdit(e)">Edit</button>
                          <button class="px-2 py-1 text-[11px] rounded border text-rose-600" @click="removeEntry(e)">Hapus</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>

            <tr v-if="!pagedSantri.length"><td colspan="11" class="px-3 py-6 text-center text-gray-500">Tidak ada data.</td></tr>
          </tbody>
        </table>
      </div>

      <div class="p-4 border-t border-gray-200 dark:border-neutral-700 flex items-center justify-end gap-2">
        <select v-model.number="pageSize" class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700">
          <option :value="10">10</option><option :value="20">20</option><option :value="50">50</option><option :value="100">100</option>
        </select>
        <div class="text-xs">Hal: {{ page }} / {{ totalPages || 1 }}</div>
        <button class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700" :disabled="page<=1" @click="page--">Prev</button>
        <button class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700" :disabled="page>=totalPages" @click="page++">Next</button>
        <button class="px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700" @click="saveAll">Simpan Semua (Halaman)</button>
      </div>
    </details>

    <!-- Mobile (ringkas) -->
    <details class="group mt-4 md:hidden rounded-xl border border-gray-200 bg-white dark:bg-neutral-800" open>
      <summary class="flex items-center justify-between p-4 cursor-pointer select-none">
        <div class="font-semibold">Daftar & Input Hafalan</div>
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
                  <div class="text-[11px]"># Entri: <b>{{ (entriesBySantri.get(s.id)?.length)||0 }}</b> • Avg: <b>{{ avgBySantri[s.id] ?? 0 }}</b></div>
                </div>
              </div>
              <div class="text-right text-xs">{{ bulanLabel[bulan-1] }} {{ tahun }}</div>
            </summary>

            <div class="border-t border-gray-200 dark:border-neutral-700 p-4 space-y-2">
              <div class="grid grid-cols-2 gap-2">
                <select v-model="draft[s.id].type" class="text-xs rounded border border-gray-200 dark:border-neutral-700">
                  <option value="alquran">Al-Qur'an</option><option value="kitab">Kitab</option><option value="pelajaran">Pelajaran</option>
                </select>

                <template v-if="draft[s.id].type==='alquran'">
                  <input v-model.trim="draft[s.id].metaQ.surah" placeholder="Surah" class="rounded border border-gray-200 dark:border-neutral-700 px-2 py-1"/>
                  <input v-model.number="draft[s.id].metaQ.ayatFrom" type="number" placeholder="Ayat dr" class="rounded border border-gray-200 dark:border-neutral-700 px-2 py-1"/>
                  <input v-model.number="draft[s.id].metaQ.ayatTo"   type="number" placeholder="Ayat sd" class="rounded border border-gray-200 dark:border-neutral-700 px-2 py-1"/>
                </template>

                <template v-else-if="draft[s.id].type==='kitab'">
                  <input v-model.trim="draft[s.id].metaK.kitab" placeholder="Kitab" class="rounded border border-gray-200 dark:border-neutral-700 px-2 py-1"/>
                  <input v-model.number="draft[s.id].metaK.halamanFrom" type="number" placeholder="Hal dr" class="rounded border border-gray-200 dark:border-neutral-700 px-2 py-1"/>
                  <input v-model.number="draft[s.id].metaK.halamanTo"   type="number" placeholder="Hal sd" class="rounded border border-gray-200 dark:border-neutral-700 px-2 py-1"/>
                </template>

                <template v-else>
                  <input v-model.trim="draft[s.id].metaP.mapel" placeholder="Mapel" class="rounded border border-gray-200 dark:border-neutral-700 px-2 py-1"/>
                  <input v-model.trim="draft[s.id].metaP.materi" placeholder="Materi" class="rounded border border-gray-200 dark:border-neutral-700 px-2 py-1"/>
                </template>

                <input v-model.number="draft[s.id].score" type="number" min="0" max="100" placeholder="Skor" class="rounded border border-gray-200 dark:border-neutral-700 px-2 py-1"/>
                <input v-model.trim="draft[s.id].evaluator" placeholder="Evaluator" class="rounded border border-gray-200 dark:border-neutral-700 px-2 py-1"/>
              </div>

              <div class="mt-2 flex items-center justify-end gap-2">
                <button class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700" @click="openEditFirst(s.id)">Modal</button>
                <button class="px-2 py-1 text-xs rounded bg-blue-600 text-white" @click="saveOne(s.id)">Simpan</button>
              </div>

              <div class="pt-3">
                <div class="text-xs text-gray-500 mb-1">Entri bulan ini</div>
                <div v-for="e in entriesBySantri.get(s.id) || []" :key="e.id" class="rounded border border-gray-200 dark:border-neutral-700 p-2 text-xs">
                  <div class="font-medium truncate">{{ material(e) }}</div>
                  <div class="text-[10px] text-gray-500">{{ new Date(e.submittedAt as number).toLocaleString() }} • Skor {{ e.score ?? '-' }} • {{ labelStatus(e.status) }}</div>
                  <div class="mt-1 flex items-center gap-1 justify-end">
                    <button class="px-2 py-1 rounded border" @click="openEdit(e)">Edit</button>
                    <button class="px-2 py-1 rounded border text-rose-600" @click="removeEntry(e)">Hapus</button>
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

    <!-- Modal: Create/Edit (pakai yg lama, dipanggil saat Edit/Modal) -->
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
              <!-- Santri (autocomplete) -->
              <div>
                <label class="text-xs text-gray-600 dark:text-neutral-300">Santri</label>
                <div class="relative">
                  <input v-model="form.name" @focus="sFocus=true" @blur="setTimeout(()=>sFocus=false,200)" @input="sQuery=form.name"
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
              </div>

              <div v-else-if="form.type==='kitab'" class="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div class="sm:col-span-2"><label class="text-xs">Kitab</label><input v-model.trim="form.metaK.kitab" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/></div>
                <div><label class="text-xs">Hal Dari</label><input v-model.number="form.metaK.halamanFrom" type="number" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/></div>
                <div><label class="text-xs">Hal Sampai</label><input v-model.number="form.metaK.halamanTo" type="number" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/></div>
              </div>

              <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div><label class="text-xs">Mapel</label><input v-model.trim="form.metaP.mapel" placeholder="Bahasa Arab" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/></div>
                <div class="sm:col-span-2"><label class="text-xs">Materi</label><input v-model.trim="form.metaP.materi" placeholder="Fi'il Madhi" class="mt-1 w-full rounded border border-gray-200 dark:border-neutral-700 px-3 py-2"/></div>
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

    <!-- Modal: Hapus entri bulan ini (Terpilih) -->
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
                Tindakan ini akan menghapus <b>semua entri</b> bulan ini milik santri terpilih.
              </div>
              <div>
                <label class="text-xs text-gray-500">Ketik <b>HAPUS</b> untuk konfirmasi</label>
                <input v-model.trim="deleteMonthConfirm" placeholder="HAPUS" class="mt-1 w-full rounded border p-2 border-gray-200 dark:border-neutral-700"/>
              </div>
            </div>

            <div class="p-4 border-t dark:border-neutral-700 flex items-center justify-between">
              <button class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700" :disabled="deleting" @click="closeDeleteMonth">Batal</button>
              <button class="px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
                      :disabled="deleteMonthConfirm.toUpperCase()!=='HAPUS' || deleting"
                      @click="performDeleteMonthSelected">
                <span v-if="!deleting">Hapus</span><span v-else>Menghapus…</span>
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
import { useHafalan, type HafalanEntry, type HafalanStatus, type HafalanType } from '~/composables/data/useHafalan'

definePageMeta({ layout: 'app', layoutProps: { title: 'Hafalan' } })

/* Sources */
const { rows: santriRows, fetchSantri, subscribeSantri, unsubscribeSantri } = useSantri()
const { rows, subscribeHafalan, unsubscribeHafalan, createHafalan, updateHafalan, deleteHafalan, setStatus, materialLabel } = useHafalan()

/* Periode (bulan) */
const now = new Date()
const bulanLabel = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
const bulan = ref<number>(now.getMonth()+1)
const tahun = ref<number>(now.getFullYear())
const monthFrom = computed(()=> new Date(tahun.value, bulan.value-1, 1, 0,0,0,0).getTime())
const monthTo   = computed(()=> new Date(tahun.value, bulan.value,   0, 23,59,59,999).getTime())
function reloadMonth(){ subscribeHafalan({ limit: 5000, from: monthFrom.value, to: monthTo.value }) }
watch([bulan, tahun], () => reloadMonth())

/* Filters Santri */
const q = ref('')
const selectedJenjang = ref<'all'|'SD'|'SMP'|'SMA'|'SMK'>('all')
const selectedMaskan = ref<'all'|string>('all')
const maskanOptions = computed(() => {
  const s = new Set<string>()
  santriRows.value.forEach(x => (x.maskan||'').trim() && s.add((x.maskan||'').trim()))
  return Array.from(s).sort((a,b)=>a.localeCompare(b))
})

/* Entries bulan ini & indeks */
const monthEntries = computed<HafalanEntry[]>(() => rows.value.slice())
const entriesBySantri = computed<Map<string, HafalanEntry[]>>(() => {
  const m = new Map<string, HafalanEntry[]>()
  for (const e of monthEntries.value){ const arr = m.get(e.santriId)||[]; arr.push(e); m.set(e.santriId, arr) }
  for (const [k, arr] of m) arr.sort((a,b)=>(b.submittedAt as number)-(a.submittedAt as number))
  return m
})
const avgBySantri = computed<Record<string, number>>(() => {
  const o: Record<string, number> = {}
  for (const [sid, list] of entriesBySantri.value){
    const sc = list.map(x=>Number(x.score||0))
    o[sid] = sc.length ? Math.round(sc.reduce((a,b)=>a+b,0)/sc.length) : 0
  }
  return o
})
const totalEntries = computed(()=> monthEntries.value.length)
const stat = computed(()=> ({
  pending: monthEntries.value.filter(x=>x.status==='pending').length,
  accepted: monthEntries.value.filter(x=>x.status==='accepted').length,
  revisi: monthEntries.value.filter(x=>x.status==='revisi').length,
  rejected: monthEntries.value.filter(x=>x.status==='rejected').length,
}))
const avgScore = computed(()=> {
  const sc = monthEntries.value.map(x=>Number(x.score||0))
  return sc.length ? Math.round(sc.reduce((a,b)=>a+b,0)/sc.length) : 0
})

/* Santri list + paginate */
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
const pagedSantri = computed(()=> filteredSantri.value.slice((page.value-1)*pageSize.value, (page.value)*pageSize.value))

/* Draft input cepat */
type Draft = {
  type: HafalanType
  metaQ: { surah: string; ayatFrom?: number; ayatTo?: number }
  metaK: { kitab: string; halamanFrom?: number; halamanTo?: number }
  metaP: { mapel: string; materi: string }
  score?: number
  evaluator?: string
}
const draft = reactive<Record<string, Draft>>({})
function ensureDraftFor(id:string){
  draft[id] = draft[id] || { type:'alquran', metaQ:{ surah:'' }, metaK:{ kitab:'' }, metaP:{ mapel:'', materi:'' }, score:undefined, evaluator:'' }
}
watch(pagedSantri, ()=> { for (const s of pagedSantri.value) ensureDraftFor(s.id) })

/* Selection */
const selected = ref<string[]>([])
const selectedSet = computed(()=> new Set(selected.value))
const selectedCount = computed(()=> selected.value.length)
function isSelected(id:string){ return selectedSet.value.has(id) }
function toggleSelect(id:string){ const i=selected.value.indexOf(id); i>=0?selected.value.splice(i,1):selected.value.push(id) }
const isAllPageSelected = computed(()=> pagedSantri.value.length>0 && pagedSantri.value.every(s=>selectedSet.value.has(s.id)))
function toggleSelectAllPage(){
  if (isAllPageSelected.value){ selected.value = selected.value.filter(id=>!pagedSantri.value.some(s=>s.id===id)) }
  else { selected.value = Array.from(new Set([...selected.value, ...pagedSantri.value.map(s=>s.id)])) }
}

/* Row expand */
const rowExpandedId = ref<string|null>(null)
function toggleRow(id: string){ rowExpandedId.value = rowExpandedId.value === id ? null : id }

/* Helpers */
const material = (e:HafalanEntry)=> materialLabel(e)
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
function labelStatus(s: HafalanStatus){ return s==='accepted'?'Diterima':s==='revisi'?'Revisi':s==='rejected'?'Ditolak':'Pending' }
function selectedMonthMidTs(){ return new Date(tahun.value, bulan.value-1, 15, 12, 0, 0, 0).getTime() }

/* CRUD cepat */
async function saveOne(id:string){
  ensureDraftFor(id)
  const d = draft[id]
  const s = santriRows.value.find(x=>x.id===id)
  if (!s) return
  // validasi ringan
  if (d.type==='alquran' && !d.metaQ.surah.trim()) return alert('Isi Surah.')
  if (d.type==='kitab'   && !d.metaK.kitab.trim()) return alert('Isi Kitab.')
  if (d.type==='pelajaran' && (!d.metaP.mapel.trim() || !d.metaP.materi.trim())) return alert('Isi Mapel & Materi.')

  const meta:any = d.type==='alquran' ? d.metaQ : d.type==='kitab' ? d.metaK : d.metaP
  await createHafalan({
    santriId: id,
    name: s.santri || 'Santri',
    type: d.type,
    meta,
    score: d.score,
    evaluator: d.evaluator?.trim(),
    note: '',
    status: 'pending',
    submittedAt: selectedMonthMidTs(),  // simpan ke bulan terpilih
    audioFile: undefined
  } as any)

  // reset ringan
  if (d.type==='alquran'){ d.metaQ.surah=''; d.metaQ.ayatFrom=undefined; d.metaQ.ayatTo=undefined }
  if (d.type==='kitab'){ d.metaK.kitab=''; d.metaK.halamanFrom=undefined; d.metaK.halamanTo=undefined }
  if (d.type==='pelajaran'){ d.metaP.mapel=''; d.metaP.materi='' }
  d.score = undefined
}

async function saveAll(){ for (const s of pagedSantri.value){ await saveOne(s.id) } }
async function saveSelected(){
  if (!selectedCount.value) return alert('Pilih minimal satu santri.')
  for (const id of selected.value){ await saveOne(id) }
}

/* Delete semua entri bulan ini (selected) */
const showKebab = ref(false)
const showDeleteMonth = ref(false)
const deleteMonthConfirm = ref('')
const deleting = ref(false)
function openDeleteMonthSelected(){
  if (!selectedCount.value) { alert('Pilih santri dulu.'); return }
  deleteMonthConfirm.value=''; showDeleteMonth.value=true
}
function closeDeleteMonth(){ if (!deleting.value) showDeleteMonth.value=false }
async function performDeleteMonthSelected(){
  if (deleteMonthConfirm.value.toUpperCase()!=='HAPUS' || deleting.value) return
  deleting.value = true
  try{
    for (const id of selected.value){
      const list = (entriesBySantri.value.get(id) || [])
      for (const e of list){ await deleteHafalan(e.id) }
    }
    showDeleteMonth.value=false
    alert('Semua entri bulan ini untuk santri terpilih telah dihapus.')
  } catch(e:any){ alert('Sebagian gagal dihapus: ' + (e?.message||e)) }
  finally{ deleting.value=false }
}

/* Row actions */
async function accept(e:HafalanEntry){ await setStatus(e.id, 'accepted') }
async function askRevisi(e:HafalanEntry){ await setStatus(e.id, 'revisi') }
async function reject(e:HafalanEntry){ await setStatus(e.id, 'rejected') }
async function removeEntry(e:HafalanEntry){ if (confirm(`Hapus hafalan ${e.name}?`)) await deleteHafalan(e.id) }

/* Modal Form (pakai dari versi lama, disesuaikan) */
const showForm = ref(false)
const formMode = ref<'create'|'edit'>('create')
const saving = ref(false)
const audioFile = ref<File|null>(null)
const editing = ref<HafalanEntry|null>(null)
const form = reactive<any>({
  name:'', santriId:'', type:'alquran', score:undefined, evaluator:'', note:'',
  metaQ:{ surah:'', ayatFrom:undefined, ayatTo:undefined },
  metaK:{ kitab:'', halamanFrom:undefined, halamanTo:undefined },
  metaP:{ mapel:'', materi:'' }
})
function resetForm(){
  Object.assign(form,{ name:'', santriId:'', type:'alquran', score:undefined, evaluator:'', note:'',
    metaQ:{ surah:'', ayatFrom:undefined, ayatTo:undefined },
    metaK:{ kitab:'', halamanFrom:undefined, halamanTo:undefined },
    metaP:{ mapel:'', materi:'' }
  })
  audioFile.value=null
}
function onPickAudio(ev: Event){ audioFile.value = (ev.target as HTMLInputElement).files?.[0] || null }
function openEditFirst(id:string){
  const first = (entriesBySantri.value.get(id) || [])[0]
  if (!first) { alert('Belum ada entri pada bulan ini.'); return }
  openEdit(first)
}
function openEdit(e:HafalanEntry){
  formMode.value='edit'; resetForm(); editing.value=e
  form.name=e.name; form.santriId=e.santriId; form.type=e.type; form.score=e.score; form.evaluator=e.evaluator||''; form.note=e.note||''
  if (e.type==='alquran') form.metaQ = { ...(e.meta as any) }
  else if (e.type==='kitab') form.metaK = { ...(e.meta as any) }
  else form.metaP = { ...(e.meta as any) }
  showForm.value=true
}
function closeForm(){ showForm.value=false }
async function submitForm(){
  if (!form.name?.trim()) { alert('Nama wajib diisi'); return }
  saving.value=true
  try{
    if (formMode.value==='edit' && editing.value){
      const patch:any = {
        score: form.score, evaluator: form.evaluator?.trim(), note: form.note?.trim(),
        meta: form.type==='alquran' ? form.metaQ : form.type==='kitab' ? form.metaK : form.metaP
      }
      if (audioFile.value) patch.audioFile = audioFile.value
      await updateHafalan(editing.value.id, patch)
      showForm.value=false
    }
  } finally { saving.value=false }
}

const sFocus = ref(false); const sQuery = ref('')
const norm = (s?: any) => String(s ?? '').normalize('NFKC').trim().toLowerCase()
const sOptions = computed(() => {
  const q = norm(sQuery.value); if (!q) return []
  return santriRows.value.filter(s => norm(s.santri).includes(q) || norm(s.maskan).includes(q) || norm(s.kamar).includes(q)).slice(0,20)
})
function pickSantri(s:any){ form.santriId=s.id; form.name=s.santri; sQuery.value=''; sFocus.value=false }

onMounted(async ()=> { subscribeSantri(); await fetchSantri(); reloadMonth() })
onUnmounted(()=>{ unsubscribeSantri(); unsubscribeHafalan() })
</script>

<style scoped>
.shadow-xs{ box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05); }
</style>
