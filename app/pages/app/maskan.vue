<template>
  <section class="p-6 space-y-4">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <h1 class="text-lg font-semibold">Daftar Kamar</h1>
      <div class="flex items-center gap-2">
        <button
          @click="openAddMaskan"
          class="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">
          + Tambah Maskan
        </button>
        <button
          @click="openMaskanManager"
          class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
          Kelola Struktur Maskan
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-2 items-center text-xs">
      <span class="text-gray-600 dark:text-neutral-300">Tipe:</span>
      <button
        v-for="t in tipeTabs"
        :key="t.value"
        @click="activeTipe = t.value"
        :class="['px-3 py-1.5 rounded border', activeTipe === t.value
          ? 'bg-blue-600 text-white border-blue-600'
          : 'border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800']">
        {{ t.label }}
      </button>

      <div class="w-px h-4 bg-gray-200 dark:bg-neutral-700 mx-1" />

      <label class="text-gray-600 dark:text-neutral-300">Maskan:</label>
      <select v-model="activeMaskan" class="px-2 py-1.5 rounded border border-gray-200 dark:border-neutral-700 dark:bg-neutral-900">
        <option value="ALL">Semua</option>
        <option v-for="m in maskanOptions" :key="m.id" :value="m.id">Maskan {{ m.name }}</option>
      </select>

      <div class="w-px h-4 bg-gray-200 dark:bg-neutral-700 mx-1" />

      <input v-model.trim="q" placeholder="Cari kamar / santri…" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 dark:bg-neutral-900 w-64" />
    </div>

    <!-- Table -->
    <div class="overflow-auto max-h-[70vh] rounded-xl border border-gray-200 dark:border-neutral-700 bg-white/60 dark:bg-neutral-900/40">
      <table class="min-w-full text-xs sm:text-sm">
        <colgroup>
          <col class="w-[18%]">
          <col class="w-[10%]">
          <col class="w-[22%]">
          <col class="w-[22%]">
          <col class="w-[10%]">
          <col class="w-[18%]">
        </colgroup>

        <thead class="bg-gray-50/80 dark:bg-neutral-900/60 sticky top-0 z-10 backdrop-blur">
          <tr class="text-left text-[11px] uppercase tracking-wide text-gray-500 dark:text-neutral-400">
            <th class="px-3 py-3">Maskan</th>
            <th class="px-3 py-3">Kamar</th>
            <th class="px-3 py-3">Ketua</th>
            <th class="px-3 py-3">Terisi</th>
            <th class="px-3 py-3">Status</th>
            <th class="px-3 py-3 text-right">Aksi</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200 dark:divide-neutral-800">
          <tr
            v-for="r in filteredRooms"
            :key="rowKey(r)"
            class="hover:bg-gray-50/70 dark:hover:bg-neutral-900/40 transition-colors">
            <!-- Maskan -->
            <td class="px-3 py-3 align-middle">
              <div class="font-medium">Maskan {{ r.maskanName }}</div>
              <div class="text-[11px] text-gray-500 dark:text-neutral-400">{{ r.tipe }}</div>
            </td>

            <!-- Kamar -->
            <td class="px-3 py-3 align-middle">
              <div class="font-semibold text-base tabular-nums">{{ r.number }}</div>
            </td>

            <!-- Ketua -->
            <td class="px-3 py-3 align-middle">
              <div class="flex items-center gap-2">
                <span class="truncate max-w-[14rem]">{{ displayPjName(r.pj) || '—' }}</span>
                <button
                  class="inline-flex items-center justify-center rounded-md border border-gray-200 dark:border-neutral-700 p-1 hover:bg-gray-50 dark:hover:bg-neutral-800"
                  @click="openSetKetua(r)"
                  title="Ubah ketua">
                  <svg class="size-4" viewBox="0 0 24 24" fill="none"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="currentColor" stroke-width="1.5"/></svg>
                </button>
              </div>
            </td>

            <!-- Terisi (x/y + progress) -->
            <td class="px-3 py-3 align-middle">
              <div class="flex items-center gap-3">
                <span class="tabular-nums text-sm">{{ capacityStat(r).text }}</span>
                <div v-if="capacityStat(r).pct != null" class="flex-1 h-2 rounded-full bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                  <div class="h-full rounded-full"
                      :class="capacityStat(r).pct < 80 ? 'bg-emerald-500' : (capacityStat(r).pct < 100 ? 'bg-amber-500' : 'bg-rose-500')"
                      :style="{ width: capacityStat(r).pct + '%' }"></div>
                </div>
              </div>
            </td>

            <!-- Status -->
            <td class="px-3 py-3 align-middle">
              <span :class="[
                  'px-2 py-0.5 rounded text-xs font-medium',
                  r.active
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                ]">
                {{ r.active ? 'Aktif' : 'Nonaktif' }}
              </span>
            </td>

            <!-- Aksi: tombol utama + kebab menu -->
            <td class="px-3 py-3 align-middle">
              <div class="relative flex justify-end items-center gap-1.5" data-row-menu>
                <!-- tombol utama -->
                <button
                  @click="openResidents(r)"
                  class="px-2.5 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                  Penghuni
                </button>

                <!-- kebab trigger -->
                <button
                  @click.stop="toggleMenu(rowKey(r))"
                  class="px-2 py-1.5 rounded-md border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800"
                  :aria-expanded="openMenuId===rowKey(r)">
                  <svg class="size-4" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>
                </button>

                <!-- dropdown -->
                <div
                  v-show="openMenuId===rowKey(r)"
                  class="absolute right-0 top-full mt-2 w-48 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg overflow-hidden z-20"
                  @keydown.esc.stop="closeMenu()"
                >
                  <button @click="openSetKetua(r); closeMenu()"
                          class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-neutral-800">
                    Set Ketua
                  </button>
                  <button @click="openRoomEdit(r); closeMenu()"
                          class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-neutral-800">
                    Edit Kamar
                  </button>
                  <button @click="openRoomCreate(r); closeMenu()"
                          class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-neutral-800">
                    Tambah Kamar
                  </button>
                  <button @click="openRoomDelete(r); closeMenu()"
                          class="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">
                    Hapus Kamar
                  </button>
                </div>
              </div>
            </td>
          </tr>

          <tr v-if="!filteredRooms.length">
            <td colspan="6" class="px-3 py-10 text-center text-gray-500">
              Tidak ada data kamar yang cocok.
            </td>
          </tr>
        </tbody>
      </table>
    </div>


    <ModalShell size="2xl" v-model="showKetua" :title="roomForKetua ? `Ubah Ketua Kamar ${roomForKetua.number} • Maskan ${roomForKetua.maskanName}` : 'Ubah Ketua Kamar'">
      <div v-if="roomForKetua" class="space-y-3">
        <p class="text-xs text-gray-600 dark:text-neutral-300">Pilih dari penghuni kamar ini:</p>
        <div class="max-h-60 overflow-auto rounded border border-gray-200 dark:border-neutral-700 divide-y dark:divide-neutral-800">
          <button
            v-for="s in roomForKetua.santri"
            :key="s.id"
            @click="selectKetua(s)"
            class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800 border-b border-gray-200"
          >
            <div class="text-sm font-medium">{{ s.santri }}</div>
            <div class="text-[11px] text-gray-500">Gen {{ s.gen || '-' }}</div>
          </button>
        </div>
        <div class="text-xs text-gray-600 dark:text-neutral-300">Atau isi manual:</div>
        <input v-model.trim="ketuaManual.name" placeholder="Nama ketua" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
        <input v-model.trim="ketuaManual.note" placeholder="Catatan (opsional)" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
      </div>
      <template #footer>
        <button @click="showKetua=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="savingKetua" @click="saveKetua" class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
          {{ savingKetua ? 'Menyimpan…' : 'Simpan' }}
        </button>
      </template>
    </ModalShell>

    <ModalShell size="2xl" v-model="showResidents" :title="roomForResidents ? `Penghuni Kamar ${roomForResidents.number} • Maskan ${roomForResidents.maskanName}` : 'Penghuni Kamar'">
      <div v-if="roomForResidents" class="grid sm:grid-cols-2 gap-4">
        <div class="space-y-2">
          <div class="text-xs font-semibold">Penghuni saat ini</div>
          <div class="max-h-72 overflow-auto rounded border border-gray-200 dark:border-neutral-700 divide-y dark:divide-neutral-800">
            <div v-for="s in roomForResidents.santri" :key="s.id" class="flex items-center justify-between px-3 py-2 border-b border-gray-200">
              <div>
                <div class="text-sm font-medium">{{ s.santri }}</div>
                <div class="text-[11px] text-gray-500">Gen {{ s.gen || '-' }}</div>
              </div>
              <button
                :disabled="residentsSaving"
                @click="removeResident(s)"
                class="text-[11px] px-2 py-1 rounded border border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-900/20 disabled:opacity-60">
                Hapus
              </button>
            </div>
            <div v-if="!roomForResidents.santri.length" class="px-3 py-2 text-sm text-gray-500">Belum ada santri di kamar ini.</div>
          </div>
        </div>
        <div class="space-y-2">
          <div class="text-xs font-semibold">Tambah penghuni</div>
          <input v-model.trim="addQuery" placeholder="Cari nama santri…" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          <div class="text-[11px] text-gray-500">Hanya menampilkan santri yang belum di kamar ini & cocok tipe.</div>
          <div class="max-h-72 overflow-auto rounded border border-gray-200 dark:border-neutral-700 divide-y dark:divide-neutral-800">
            <div v-for="s in addCandidates" :key="s.id" class="flex border-b border-gray-200 items-center justify-between px-3 py-2">
              <div>
                <div class="text-sm font-medium">{{ s.santri }}</div>
                <div class="text-[11px] text-gray-500">Gen {{ s.gen || '-' }} <span v-if="s.kamar || s.maskan">• sekarang: {{ s.maskan || '-' }} {{ s.kamar || '' }}</span></div>
              </div>
              <button
                :disabled="residentsSaving"
                @click="addResident(s)"
                class="text-[11px] px-2 py-1 rounded border border-emerald-300 w-full px-3 py-2 rounded border border-gray-200 dark:border-neutral-700 dark:bg-neutral-900700 hover:bg-emerald-50 dark:border-emerald-900/40 dark:w-full px-3 py-2 rounded border border-gray-200 dark:border-neutral-700 dark:bg-neutral-900300 dark:hover:bg-emerald-900/20 disabled:opacity-60">
                Tambahkan
              </button>
            </div>
            <div v-if="!addCandidates.length" class="px-3 py-2 text-sm text-gray-500">Tidak ada kandidat.</div>
          </div>
        </div>
      </div>
      <template #footer>
        <button @click="showResidents=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Tutup</button>
      </template>
    </ModalShell>

    <ModalShell v-model="showMaskanForm" :title="maskanFormMode==='create' ? 'Tambah Maskan' : 'Ubah Maskan'">
      <form class="space-y-3" @submit.prevent="submitMaskanForm">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs">Nama Maskan (A/B/C...)</label>
            <input v-model.trim="maskanForm.name" required class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs">Tipe</label>
            <select v-model="maskanForm.tipe" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
              <option value="Putra">Putra</option>
              <option value="Putri">Putri</option>
            </select>
          </div>
          <div class="sm:col-span-2">
            <label class="text-xs">Deskripsi</label>
            <textarea v-model.trim="maskanForm.deskripsi" rows="2" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"></textarea>
          </div>
        </div>
        <div v-if="maskanFormMode==='edit'" class="rounded-xl border border-amber-300 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-900/10 p-3">
          <label class="inline-flex items-start gap-2 text-sm">
            <input type="checkbox" v-model="renameCascade" />
            <span>
              Perbarui nama maskan pada <b>semua santri</b> yang saat ini ter-set ke
              <b>Maskan {{ renameOldName }}</b> menjadi <b>Maskan {{ maskanForm.name || '(kosong)' }}</b>.
              <div class="text-[11px] mt-1 text-amber-700">
                Perubahan ini menyentuh <b>{{ renameAffectedCount }}</b> santri.
              </div>
            </span>
          </label>
        </div>
        <p v-if="maskanFormError" class="text-sm text-rose-600">{{ maskanFormError }}</p>
      </form>
      <template #footer>
        <button @click="showMaskanForm=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="maskanSaving" @click="submitMaskanForm" class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
          {{ maskanSaving ? 'Menyimpan…' : (maskanFormMode==='create' ? 'Tambah' : 'Simpan') }}
        </button>
      </template>
    </ModalShell>

    <!-- Modal: Maskan Manager -->
    <ModalShell size="3xl" v-model="showMaskanManager" title="Kelola Struktur Maskan">
      <div class="space-y-4">
        <!-- Tabs + Actions -->
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="inline-flex p-1 rounded-2xl bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
            <button
              v-for="t in tipeTabs"
              :key="t.value"
              @click="activeTipeMgr = t.value"
              class="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
              :class="activeTipeMgr===t.value
                      ? 'bg-white dark:bg-neutral-900 shadow-sm'
                      : 'text-gray-600 dark:text-neutral-300 hover:bg-white/50 dark:hover:bg-neutral-700/50'">
              {{ t.label }}
            </button>
          </div>

          <div class="flex items-center gap-2">
            <button @click="openAddMaskan" class="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">+ Maskan</button>
            <button @click="fetchMaskan" class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
              Muat Ulang
            </button>
          </div>
        </div>

        <!-- Grid Cards -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="m in maskanRowsMgr"
            :key="m.id"
            class="group rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/50 shadow-sm hover:shadow-md transition-all">

            <!-- Header ala Duolingo (gradient biru/emerald) -->
            <div
              class="rounded-t-2xl px-4 py-3 text-white"
              :class="m.tipe==='Putra'
                      ? 'bg-gradient-to-r from-blue-600 to-emerald-500'
                      : 'bg-gradient-to-r from-emerald-600 to-blue-500'">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm/5 font-semibold">Maskan {{ m.name }}</div>
                  <div class="text-[11px]/4 opacity-90">{{ m.tipe }}</div>
                </div>
                <!-- Icon -->
                <svg class="size-5 opacity-90" viewBox="0 0 24 24" fill="none">
                  <path d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8zm2-4h12l2 4H4l2-4z" stroke="currentColor" stroke-width="1.5"/>
                </svg>
              </div>
            </div>

            <!-- Body: stats + actions -->
            <div class="p-4 space-y-3">
              <!-- Stats -->
              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="rounded-lg bg-gray-50 dark:bg-neutral-800 p-2">
                  <div class="text-[11px] text-gray-500 dark:text-neutral-400">Kamar</div>
                  <div class="font-semibold">{{ maskanStat(m).rooms }}</div>
                </div>
                <div class="rounded-lg bg-gray-50 dark:bg-neutral-800 p-2">
                  <div class="text-[11px] text-gray-500 dark:text-neutral-400">Kapasitas</div>
                  <div class="font-semibold">{{ maskanStat(m).capacity }}</div>
                </div>
                <div class="rounded-lg bg-gray-50 dark:bg-neutral-800 p-2">
                  <div class="text-[11px] text-gray-500 dark:text-neutral-400">Terisi</div>
                  <div class="font-semibold">{{ maskanStat(m).occupied }}</div>
                </div>
              </div>

              <!-- Progress -->
              <div v-if="maskanStat(m).pct!=null" class="flex items-center gap-3">
                <span class="text-xs tabular-nums">{{ maskanStat(m).occupied }}/{{ maskanStat(m).capacity }}</span>
                <div class="flex-1 h-2 rounded-full bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                  <div
                    class="h-full rounded-full transition-[width]"
                    :class="maskanStat(m).pct < 80 ? 'bg-emerald-500' : (maskanStat(m).pct < 100 ? 'bg-amber-500' : 'bg-rose-500')"
                    :style="{ width: maskanStat(m).pct + '%' }" />
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-wrap gap-1.5">
                <button @click="openMaskanEdit(m)" class="text-[11px] px-2.5 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Edit</button>
                <button @click="openBlankRoomCreate(m)" class="text-[11px] px-2.5 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">+ Kamar</button>
                <button @click="toggleGenForm(m.id)" class="text-[11px] px-2.5 py-1.5 rounded border border-emerald-300 w-full px-3 py-2 rounded border border-gray-200 dark:border-neutral-700 dark:bg-neutral-900700 hover:bg-emerald-50 dark:border-emerald-900/40 dark:w-full px-3 py-2 rounded border border-gray-200 dark:border-neutral-700 dark:bg-neutral-900300 dark:hover:bg-emerald-900/20">
                  Batch Generate
                </button>
                <button @click="openMaskanDelete(m)" class="text-[11px] px-2.5 py-1.5 rounded border border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-900/20">Hapus</button>
              </div>

              <!-- Batch Generate form (collapse) -->
              <div v-show="showGenFor===m.id" class="rounded-xl border border-emerald-300/50 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-900/10 p-3 space-y-2">
                <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 items-end">
                  <div>
                    <label class="text-[11px] text-gray-600 dark:text-neutral-300">Prefix</label>
                    <input v-model.trim="genForm.prefix" class="w-full px-3 py-2 rounded border border-gray-200 dark:border-neutral-700 dark:bg-neutral-900" placeholder="A- / K-" />
                  </div>
                  <div>
                    <label class="text-[11px] text-gray-600 dark:text-neutral-300">Start</label>
                    <input v-model.number="genForm.start" type="number" min="1" class="w-full px-3 py-2 rounded border border-gray-200 dark:border-neutral-700 dark:bg-neutral-900" />
                  </div>
                  <div>
                    <label class="text-[11px] text-gray-600 dark:text-neutral-300">End</label>
                    <input v-model.number="genForm.end" type="number" min="1" class="w-full px-3 py-2 rounded border border-gray-200 dark:border-neutral-700 dark:bg-neutral-900" />
                  </div>
                  <div>
                    <label class="text-[11px] text-gray-600 dark:text-neutral-300">Capacity</label>
                    <input v-model.number="genForm.capacity" type="number" min="0" class="w-full px-3 py-2 rounded border border-gray-200 dark:border-neutral-700 dark:bg-neutral-900" />
                  </div>
                  <div class="flex items-center gap-2">
                    <input id="gen-active" type="checkbox" v-model="genForm.active" />
                    <label for="gen-active" class="text-[12px]">Aktif</label>
                  </div>
                </div>
                <div class="flex justify-end gap-2">
                  <button @click="cancelGenForm" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 text-xs">Batal</button>
                  <button :disabled="genSaving" @click="doBatchGenerate(m)" class="px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 text-xs">
                    {{ genSaving ? 'Menggenerate…' : 'Generate' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!maskanRowsMgr.length" class="text-sm text-gray-500 dark:text-neutral-400 p-8 text-center col-span-full">
            Belum ada maskan pada filter ini.
          </div>
        </div>
      </div>
    </ModalShell>

    <!-- Modal: Hapus Maskan -->
    <ModalShell v-model="showMaskanDelete" title="Hapus Maskan">
      <div class="rounded-xl border border-rose-300 dark:border-rose-900/40 bg-rose-50/70 dark:bg-rose-900/10 p-3 text-rose-800 dark:text-rose-200">
        <div class="font-semibold">Tindakan ini permanen.</div>
        <ul class="list-disc pl-5 text-sm mt-1 space-y-1">
          <li>Semua kamar / room di dalam <b>Maskan {{ maskanCurrent?.name }}</b> akan dihapus.</li>
          <li>Jumlah kamar: <b>{{ maskanCurrent?.rooms?.length || 0 }}</b></li>
          <li>Santri yang saat ini ditempatkan di maskan ini: <b>{{ deleteAffectedSantriCount }}</b></li>
        </ul>
      </div>

      <div class="mt-3">
        <label class="inline-flex items-start gap-2 text-sm">
          <input type="checkbox" v-model="clearResidentsOnDelete" />
          <span>Kosongkan penempatan santri (set <code>maskan</code> & <code>kamar</code> menjadi kosong) untuk seluruh santri di maskan ini sebelum penghapusan.</span>
        </label>
      </div>

      <template #footer>
        <button @click="showMaskanDelete=false" class="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="maskanDeleting" @click="confirmMaskanDelete" class="px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60">
          {{ maskanDeleting ? 'Menghapus…' : 'Hapus' }}
        </button>
      </template>
    </ModalShell>


    <!-- Modal: Tambah/Ubah Kamar -->
    <ModalShell v-model="showRoomForm" :title="roomFormMode==='create' ? `Tambah Kamar • Maskan ${maskanForRoom?.name || '-'}` : `Ubah Kamar • Maskan ${maskanForRoom?.name || '-'}`">
      <form class="space-y-3" @submit.prevent="submitRoomForm">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="text-xs">Nomor Kamar</label>
            <input v-model.trim="roomEditForm.number" required class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs">Kapasitas</label>
            <input v-model.number="roomEditForm.capacity" type="number" min="0" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div class="flex items-end">
            <label class="inline-flex items-center gap-2 text-xs">
              <input type="checkbox" v-model="roomEditForm.active" />
              Aktif
            </label>
          </div>
        </div>
        <p v-if="roomFormError" class="text-sm text-rose-600">{{ roomFormError }}</p>
      </form>
      <template #footer>
        <button @click="showRoomForm=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="roomSaving" @click="submitRoomForm" class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
          {{ roomSaving ? 'Menyimpan…' : (roomFormMode==='create' ? 'Tambah' : 'Simpan') }}
        </button>
      </template>
    </ModalShell>

    <!-- Modal: Hapus Kamar -->
    <ModalShell v-model="showRoomDelete" title="Hapus Kamar">
      <p class="text-sm">
        Hapus kamar <strong>{{ roomCurrent?.number }}</strong> dari Maskan {{ maskanForRoom?.name }}?
      </p>
      <template #footer>
        <button @click="showRoomDelete=false" class="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="roomDeleting" @click="confirmRoomDelete" class="px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60">
          {{ roomDeleting ? 'Menghapus…' : 'Hapus' }}
        </button>
      </template>
    </ModalShell>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import ModalShell from '~/components/widget/ModalShell.vue'
import { useMaskan, type MaskanRow, type KamarRow } from '~/composables/data/useMaskan'
import { useSantri } from '~/composables/data/useSantri'
import { useNuxtApp } from '#app'
import { ref as dbRef, update as rtdbUpdate } from 'firebase/database'

definePageMeta({ layout: 'app', layoutProps: { title: 'Kamar' } })

// data sources
const {
  rows: maskanRows,
  fetchMaskan,
  createMaskan, updateMaskan, deleteMaskan,
  createRoom, updateRoom, deleteRoom,
  batchGenerateRooms
} = useMaskan()
const { rows: santriRows, fetchSantri, /* optional */ updateSantri } = useSantri() as any

const showMaskanManager = ref(false)
const activeTipeMgr = ref<typeof tipeTabs[number]['value']>('ALL')
const renameCascade = ref(true)
const renameOldName = ref('')

const renameAffectedCount = computed(() => {
  if (!renameOldName.value) return 0
  const oldN = norm(renameOldName.value).replace(/^maskan\s+/i, '')
  return santriRows.value.filter((s:any) =>
    norm(s.maskan).replace(/^maskan\s+/i, '') === oldN
  ).length
})

function openMaskanManager() {
  activeTipeMgr.value = 'ALL'
  showMaskanManager.value = true
}

const maskanRowsMgr = computed(() => {
  return maskanRows.value.filter(m => activeTipeMgr.value==='ALL' ? true : m.tipe===activeTipeMgr.value)
})

function maskanStat(m: MaskanRow) {
  const rooms = m.rooms.length
  const capacity = m.rooms.reduce((a, r) => a + Number(r.capacity || 0), 0)
  const occupied = santriRows.value.filter((s:any) =>
    m.rooms.some(r => belongsToRoom(s, m, r))
  ).length
  const pct = capacity ? Math.min(100, Math.round((occupied / capacity) * 100)) : null
  return { rooms, capacity, occupied, pct }
}

function openMaskanEdit(m: MaskanRow) {
  activeMaskan.value = m.id
  openEditMaskan()
}
function openMaskanDelete(m: MaskanRow) {
  activeMaskan.value = m.id
  openDeleteMaskan()
}

function openBlankRoomCreate(m: MaskanRow) {
  maskanForRoom.value = m
  roomFormMode.value = 'create'
  roomCurrent.value = null
  roomEditForm.number = ''
  roomEditForm.capacity = 0
  roomEditForm.active = true
  roomFormError.value = null
  showRoomForm.value = true
}

const showGenFor = ref<string | null>(null)
const genSaving = ref(false)
const genForm = reactive({
  prefix: '',
  start: 1,
  end: 10,
  capacity: 0,
  active: true,
})

function toggleGenForm(id: string) {
  showGenFor.value = showGenFor.value === id ? null : id
}
function cancelGenForm() {
  showGenFor.value = null
}

async function doBatchGenerate(m: MaskanRow) {
  if (!m?.id) return
  genSaving.value = true
  try {
    await batchGenerateRooms(m.id, Number(genForm.start || 1), Number(genForm.end || 0), {
      prefix: genForm.prefix || '',
      capacity: Number(genForm.capacity || 0),
      active: !!genForm.active,
      tipeInherit: true,
    })
    await fetchMaskan()
    showGenFor.value = null
  } finally {
    genSaving.value = false
  }
}

onMounted(async () => { 
  await Promise.all([fetchMaskan(), fetchSantri()]) 
  document.addEventListener('click', onDocClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocClick)
})

// filters
const tipeTabs = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Putra', value: 'Putra' },
  { label: 'Putri', value: 'Putri' },
] as const
const activeTipe = ref<typeof tipeTabs[number]['value']>('ALL')
const activeMaskan = ref<'ALL' | string>('ALL')
const q = ref('')

// maskan options for select
const maskanOptions = computed(() =>
  maskanRows.value
    .map(m => ({ id: m.id, name: m.name }))
    .sort((a,b)=>a.name.localeCompare(b.name,'id'))
)

// helpers
function displayPjName(pj?: { name?: string, santriId?: string }) {
  if (!pj) return ''
  const found = santriRows.value.find(s => s.id === pj.santriId)
  return (found?.santri || pj.name || '').trim()
}
function norm(x: any) { return (x ?? '').toString().trim().toLowerCase() }
function belongsToRoom(s: any, m: MaskanRow, r: KamarRow) {
  const sMaskan = norm((s.maskan || '').replace(/^maskan\s+/i, ''))
  const sKamar = norm(s.kamar)
  return sKamar === norm(r.number) && sMaskan === norm(m.name)
}

function rowKey(r: RoomView) {
  return `${r.maskanId}:${r.id}`
}
function capacityStat(r: RoomView) {
  const cap = Number(r.capacity || 0)
  const used = Number(r.santri?.length || 0)
  if (!cap) return { text: String(used), pct: null as number | null }
  const pct = Math.min(100, Math.round((used / cap) * 100))
  return { text: `${used}/${cap}`, pct }
}

const openMenuId = ref<string | null>(null)
function toggleMenu(id: string) {
  openMenuId.value = openMenuId.value === id ? null : id
}
function closeMenu() {
  openMenuId.value = null
}
function onDocClick(e: MouseEvent) {
  const t = e.target as HTMLElement
  if (!t.closest('[data-row-menu]')) closeMenu()
}

// build flattened room list with residents
type RoomView = {
  id: string
  number: string
  capacity?: number
  active?: boolean
  pj?: { santriId?: string; name?: string; note?: string }
  maskanId: string
  maskanName: string
  tipe: 'Putra' | 'Putri'
  santri: any[]
}
const roomsFlat = computed<RoomView[]>(() => {
  const out: RoomView[] = []
  for (const m of maskanRows.value) {
    for (const r of m.rooms) {
      const santri = santriRows.value.filter(s => belongsToRoom(s, m, r))
      out.push({
        id: r.id,
        number: r.number,
        capacity: r.capacity,
        active: r.active !== false,
        pj: r.pj,
        maskanId: m.id,
        maskanName: m.name,
        tipe: m.tipe,
        santri,
      })
    }
  }
  return out.sort((a,b) => {
    const n = a.maskanName.localeCompare(b.maskanName, 'id')
    if (n !== 0) return n
    const na = Number(a.number), nb = Number(b.number)
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
    return a.number.localeCompare(b.number, 'id')
  })
})

// apply filters
const filteredRooms = computed(() => {
  const qq = norm(q.value)
  return roomsFlat.value.filter(r => {
    if (activeTipe.value !== 'ALL' && r.tipe !== activeTipe.value) return false
    if (activeMaskan.value !== 'ALL' && r.maskanId !== activeMaskan.value) return false
    if (!qq) return true
    const ketua = displayPjName(r.pj).toLowerCase()
    const hay = [
      r.number, r.maskanName, ketua,
      ...r.santri.map((s: any) => (s.santri || '').toLowerCase())
    ].join(' ')
    return hay.includes(qq)
  })
})

/* -------------------- Modal: Ketua -------------------- */
const showKetua = ref(false)
const roomForKetua = ref<RoomView | null>(null)
const ketuaManual = reactive<{ name?: string; note?: string }>({})
const savingKetua = ref(false)

function openSetKetua(r: RoomView) {
  roomForKetua.value = r
  ketuaManual.name = r.pj?.name || ''
  ketuaManual.note = r.pj?.note || ''
  showKetua.value = true
}
function selectKetua(s: any) {
  ketuaManual.name = s.santri
  saveKetua(s.id)
}
async function saveKetua(santriId?: string) {
  if (!roomForKetua.value) return
  savingKetua.value = true
  try {
    const payload: any = {
      pj: {
        santriId: santriId ?? (roomForKetua.value.pj?.santriId || ''),
        name: ketuaManual.name ?? '',
        note: ketuaManual.note ?? '',
      }
    }
    await updateRoom(roomForKetua.value.maskanId, roomForKetua.value.id, payload)
    showKetua.value = false
  } finally {
    savingKetua.value = false
  }
}

/* -------------------- Modal: Penghuni -------------------- */
const showResidents = ref(false)
const roomForResidents = ref<RoomView | null>(null)
const addQuery = ref('')
const residentsSaving = ref(false)

function openResidents(r: RoomView) {
  roomForResidents.value = r
  addQuery.value = ''
  showResidents.value = true
}

const addCandidates = computed(() => {
  if (!roomForResidents.value) return []
  const q = addQuery.value.trim().toLowerCase()
  const inThisRoom = new Set(roomForResidents.value.santri.map((s:any)=>s.id))
  return santriRows.value
    .filter(s => !inThisRoom.has(s.id))
    .filter(s => (s.tipe || roomForResidents.value!.tipe)
                    ? ((s.tipe || roomForResidents.value!.tipe) === roomForResidents.value!.tipe)
                    : true)
    .filter(s => !q ? true : (s.santri || '').toLowerCase().includes(q))
    .slice(0, 30)
})

async function addResident(s: any) {
  if (!roomForResidents.value) return
  residentsSaving.value = true
  try {
    await setSantriRoom(s.id, roomForResidents.value.maskanName, roomForResidents.value.number)
    await fetchSantri()
  } finally {
    residentsSaving.value = false
  }
}

async function removeResident(s: any) {
  if (!roomForResidents.value) return
  residentsSaving.value = true
  try {
    await setSantriRoom(s.id, '', '')
    await fetchSantri()
  } finally {
    residentsSaving.value = false
  }
}

async function setSantriRoom(santriId: string, maskanName: string, roomNumber: string) {
  if (typeof updateSantri === 'function') {
    await updateSantri(santriId, { maskan: maskanName || '', kamar: roomNumber || '' })
    return
  }
  const { $realtimeDb } = useNuxtApp()
  const multi: Record<string, any> = {}
  multi[`alberr/santri/${santriId}/maskan`] = maskanName || ''
  multi[`alberr/santri/${santriId}/kamar`] = roomNumber || ''
  await rtdbUpdate(dbRef($realtimeDb), multi)
}

/* -------------------- Modal: Maskan (CRUD) -------------------- */
const showMaskanForm = ref(false)
const maskanFormMode = ref<'create'|'edit'>('create')
const maskanSaving = ref(false)
const maskanFormError = ref<string | null>(null)
const maskanCurrent = ref<any>(null)
const showMaskanDelete = ref(false)
const maskanDeleting = ref(false)

const maskanForm = reactive<{ name: string; tipe: 'Putra'|'Putri'; deskripsi?: string }>({
  name: '', tipe: 'Putra', deskripsi: ''
})

function openAddMaskan() {
  maskanFormMode.value = 'create'
  maskanForm.name = ''
  maskanForm.tipe = 'Putra'
  maskanForm.deskripsi = ''
  maskanFormError.value = null
  showMaskanForm.value = true
}
function openEditMaskanRow(m: any) { // (opsional) jika ingin panggil dari row
  activeMaskan.value = m.maskanId
  openEditMaskan()
}
function openEditMaskan() {
  showMaskanManager.value = false
  if (activeMaskan.value === 'ALL') return
  const m = maskanRows.value.find(x => x.id === activeMaskan.value)
  if (!m) return
  maskanFormMode.value = 'edit'
  maskanCurrent.value = m
  maskanForm.name = m.name
  maskanForm.tipe = m.tipe
  maskanForm.deskripsi = m.deskripsi ?? ''
  maskanFormError.value = null
  renameOldName.value = m.name
  renameCascade.value = true
  showMaskanForm.value = true
}
function openDeleteMaskanRow(m: any) { // (opsional) jika ingin panggil dari row
  activeMaskan.value = m.maskanId
  openDeleteMaskan()
}

async function renameSantriMaskan(oldName: string, newName: string) {
  const { $realtimeDb } = useNuxtApp()
  const multi: Record<string, any> = {}

  const oldN = norm(oldName).replace(/^maskan\s+/i, '')
  for (const s of santriRows.value) {
    if (norm(s.maskan).replace(/^maskan\s+/i, '') === oldN) {
      multi[`alberr/santri/${s.id}/maskan`] = newName
      // kamar tetap dipertahankan
    }
  }
  if (Object.keys(multi).length) {
    await rtdbUpdate(dbRef($realtimeDb), multi)
  }
}

function openDeleteMaskan() {
  showMaskanManager.value = false
  if (activeMaskan.value === 'ALL') return
  const m = maskanRows.value.find(x => x.id === activeMaskan.value)
  if (!m) return
  maskanCurrent.value = m
  clearResidentsOnDelete.value = true
  showMaskanDelete.value = true
}

async function submitMaskanForm() {
  if (!maskanForm.name?.trim()) {
    maskanFormError.value = 'Nama maskan wajib diisi.'
    return
  }
  maskanSaving.value = true
  try {
    const newName = maskanForm.name.trim()
    const payload = {
      name: newName,
      tipe: maskanForm.tipe,
      deskripsi: maskanForm.deskripsi ?? '',
    }

    if (maskanFormMode.value === 'create') {
      const newId = await createMaskan(payload)
      if (newId) activeMaskan.value = newId
    } else if (maskanCurrent.value?.id) {
      const oldName = renameOldName.value
      await updateMaskan(maskanCurrent.value.id, payload)
      if (renameCascade.value && oldName && newName &&
          norm(oldName) !== norm(newName)) {
        await renameSantriMaskan(oldName, newName)
        await fetchSantri()
      }
    }
    showMaskanForm.value = false
  } catch (e: any) {
    maskanFormError.value = e?.message ?? 'Gagal menyimpan'
  } finally {
    maskanSaving.value = false
  }
}

const clearResidentsOnDelete = ref(true)
const deleteAffectedSantriCount = computed(() => {
  if (!maskanCurrent.value) return 0
  const target = norm(maskanCurrent.value.name).replace(/^maskan\s+/i, '')
  return santriRows.value.filter((s:any) =>
    norm(s.maskan).replace(/^maskan\s+/i, '') === target
  ).length
})

async function clearSantriForMaskan(m: MaskanRow) {
  const { $realtimeDb } = useNuxtApp()
  const multi: Record<string, any> = {}
  const target = norm(m.name).replace(/^maskan\s+/i, '')
  for (const s of santriRows.value) {
    if (norm(s.maskan).replace(/^maskan\s+/i, '') === target) {
      multi[`alberr/santri/${s.id}/maskan`] = ''
      multi[`alberr/santri/${s.id}/kamar`] = ''
    }
  }
  if (Object.keys(multi).length) {
    await rtdbUpdate(dbRef($realtimeDb), multi)
  }
}

async function confirmMaskanDelete() {
  if (!maskanCurrent.value?.id) return
  maskanDeleting.value = true
  try {
    if (clearResidentsOnDelete.value) {
      await clearSantriForMaskan(maskanCurrent.value)
      await fetchSantri()
    }
    await deleteMaskan(maskanCurrent.value.id)
    showMaskanDelete.value = false
    activeMaskan.value = 'ALL'
  } finally {
    maskanDeleting.value = false
  }
}

const showRoomForm = ref(false)
const roomFormMode = ref<'create'|'edit'>('create')
const roomSaving = ref(false)
const roomFormError = ref<string | null>(null)
const showRoomDelete = ref(false)
const roomDeleting = ref(false)

const roomCurrent = ref<RoomView | null>(null)
const maskanForRoom = ref<MaskanRow | null>(null)
const roomEditForm = reactive<{ number: string; capacity: number; active: boolean }>({
  number: '', capacity: 0, active: true
})

function getMaskanById(id: string | null) {
  if (!id) return null
  return maskanRows.value.find(x => x.id === id) || null
}

function openRoomCreate(r: RoomView) {
  maskanForRoom.value = getMaskanById(r.maskanId)
  if (!maskanForRoom.value) return
  roomFormMode.value = 'create'
  roomCurrent.value = null
  roomEditForm.number = ''
  roomEditForm.capacity = 0
  roomEditForm.active = true
  roomFormError.value = null
  showRoomForm.value = true
}
function openRoomEdit(r: RoomView) {
  maskanForRoom.value = getMaskanById(r.maskanId)
  roomFormMode.value = 'edit'
  roomCurrent.value = r
  roomEditForm.number = r.number
  roomEditForm.capacity = Number(r.capacity ?? 0)
  roomEditForm.active = r.active !== false
  roomFormError.value = null
  showRoomForm.value = true
}
function openRoomDelete(r: RoomView) {
  maskanForRoom.value = getMaskanById(r.maskanId)
  roomCurrent.value = r
  showRoomDelete.value = true
}

async function submitRoomForm() {
  if (!maskanForRoom.value) return
  const num = (roomEditForm.number || '').trim()
  if (!num) {
    roomFormError.value = 'Nomor kamar wajib diisi.'
    return
  }
  // Cegah duplikat nomor di maskan yang sama
  const dup = maskanForRoom.value.rooms.some(r =>
    (roomFormMode.value === 'edit' ? r.id !== roomCurrent.value?.id : true) &&
    String(r.number).trim().toLowerCase() === num.toLowerCase()
  )
  if (dup) {
    roomFormError.value = 'Nomor kamar sudah ada di maskan ini.'
    return
  }

  roomSaving.value = true
  try {
    if (roomFormMode.value === 'create') {
      await createRoom(maskanForRoom.value.id, {
        number: num,
        capacity: Number(roomEditForm.capacity ?? 0),
        active: !!roomEditForm.active,
        tipe: maskanForRoom.value.tipe
      })
    } else if (roomCurrent.value) {
      await updateRoom(maskanForRoom.value.id, roomCurrent.value.id, {
        number: num,
        capacity: Number(roomEditForm.capacity ?? 0),
        active: !!roomEditForm.active
      })
    }
    showRoomForm.value = false
  } catch (e: any) {
    roomFormError.value = e?.message ?? 'Gagal menyimpan kamar'
  } finally {
    roomSaving.value = false
  }
}

async function confirmRoomDelete() {
  if (!maskanForRoom.value?.id || !roomCurrent.value?.id) return
  roomDeleting.value = true
  try {
    await deleteRoom(maskanForRoom.value.id, roomCurrent.value.id)
    showRoomDelete.value = false
  } finally {
    roomDeleting.value = false
  }
}
</script>
