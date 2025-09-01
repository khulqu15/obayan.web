<template>
  <section class="p-6 space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-semibold">Manajemen Maskan & Kamar</h1>
      <button @click="openMaskanCreate" class="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">
        + Tambah Maskan
      </button>
    </div>

    <div class="flex items-center gap-2 text-xs">
      <span class="text-gray-600 dark:text-neutral-300">Filter Tipe:</span>
      <button
        v-for="t in tipeTabs"
        :key="t.value"
        @click="activeTipe = t.value"
        :class="['px-3 py-1.5 rounded border', activeTipe === t.value
          ? 'bg-blue-600 text-white border-blue-600'
          : 'border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800']">
        {{ t.label }}
      </button>
    </div>

    <DataTable
      title="Daftar Maskan"
      :rows="filteredMaskan"
      :columns="columns"
      :rowKey="(r) => r.id"
    >
      <template #cell-name="{ row: m }">
        <div class="font-semibold">Maskan {{ m.name }}</div>
        <div class="text-xs text-gray-500">{{ m.deskripsi || '—' }}</div>
      </template>

      <template #cell-tipe="{ row: m }">
        <span class="inline-flex items-center text-xs px-2 py-0.5 rounded border border-gray-200 dark:border-neutral-700">
          {{ m.tipe }}
        </span>
      </template>

      <template #cell-pj="{ row: m }">
        <div class="flex items-center gap-2">
            <div>
            <div class="text-sm">{{ displayPjName(m.pj) || '—' }}</div>
            <div v-if="m.pj?.santriId" class="text-[11px] text-gray-500">terhubung ke data santri</div>
            </div>
            <button @click="openMaskanEditPj(m)" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
            Ubah PJ
            </button>
        </div>
    </template>

      <template #cell-rooms="{ row: m }">
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-700 dark:text-neutral-300">{{ m.rooms.length }} kamar</span>
          <button
            @click="openRooms(m)"
            class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
            Kelola
          </button>
        </div>

        <div v-show="!isMobile && expanded.has(m.id)" class="mt-2 rounded-lg border border-gray-200 dark:border-neutral-700 overflow-hidden">
          <div class="bg-gray-50 dark:bg-neutral-900/40 px-3 py-2 text-xs font-medium">
            Kamar di Maskan {{ m.name }} ({{ m.tipe }})
          </div>
          <div class="p-3 space-y-3">
            <div class="flex flex-wrap items-end gap-2">
              <div class="flex items-center gap-2">
                <div>
                    <p for="no_room">Nomor Kamar</p>
                    <input id="no_room" v-model="roomForm.number" placeholder="Nomor kamar" class="px-2 py-1 text-xs rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
                </div>
                <div>
                    <p for="capacity">Kapasitas</p>
                    <input id="capacity" v-model.number="roomForm.capacity" type="number" min="0" placeholder="Kapasitas" class="w-24 px-2 py-1 text-xs rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
                </div>
                <label class="inline-flex items-center gap-1 text-xs">
                  <input type="checkbox" v-model="roomForm.active" />
                  Aktif
                </label>
                <button @click="quickAddRoom(m)" class="text-xs px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700">Tambah</button>
              </div>

              <div class="ml-auto flex items-center gap-2">
                <input v-model.number="genStart" type="number" min="1" placeholder="Mulai" class="w-20 px-2 py-1 text-xs rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
                <input v-model.number="genEnd" type="number" :min="genStart" placeholder="Selesai" class="w-20 px-2 py-1 text-xs rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
                <input v-model="genPrefix" placeholder="Prefix (opsional)" class="w-28 px-2 py-1 text-xs rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
                <button @click="generateRooms(m)" class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
                  Generate
                </button>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full text-xs">
                <thead>
                  <tr class="text-left">
                    <th class="px-3 py-2">Nomor</th>
                    <th class="px-3 py-2">Kapasitas</th>
                    <th class="px-3 py-2">PJ</th>
                    <th class="px-3 py-2">Aktif</th>
                    <th class="px-3 py-2 w-28">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-neutral-800">
                  <tr v-for="r in m.rooms" :key="r.id">
                    <td class="px-3 py-2">{{ r.number }}</td>
                    <td class="px-3 py-2">{{ r.capacity ?? 0 }}</td>
                    <td class="px-3 py-2">
                        <div class="flex items-center gap-2">
                            <span>{{ displayPjName(r.pj) || '—' }}</span>
                            <button @click="openRoomEditPj(m, r)" class="text-[11px] px-2 py-0.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Ubah</button>
                        </div>
                    </td>
                    <td class="px-3 py-2">
                      <span :class="['text-xs px-2 py-0.5 rounded', r.active !== false ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300']">
                        {{ r.active !== false ? 'Aktif' : 'Nonaktif' }}
                      </span>
                    </td>
                    <td class="px-3 py-2">
                      <div class="flex items-center gap-1">
                        <button @click="openRoomEdit(m, r)" class="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800">Edit</button>
                        <button @click="openRoomDelete(m, r)" class="px-2 py-1 rounded border border-gray-200 text-rose-600 hover:bg-rose-50 dark:border-neutral-700 dark:hover:bg-rose-900/20">Hapus</button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="!m.rooms.length">
                    <td colspan="4" class="px-3 py-3 text-gray-500">Belum ada kamar.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>

      <template #cell-action="{ row: m }">
        <div class="flex items-center gap-2">
          <button @click="openMaskanEdit(m)" class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Edit</button>
          <button @click="openMaskanDelete(m)" class="text-xs px-2 py-1 rounded border border-gray-200 text-rose-600 hover:bg-rose-50 dark:border-neutral-700 dark:hover:bg-rose-900/20">Hapus</button>
        </div>
      </template>
    </DataTable>

    <ModalShell v-model="showPjMaskan" :title="maskanForPj ? `Ubah Penanggung Jawab - Maskan ${maskanForPj.name}` : 'Ubah Penanggung Jawab'">
  <div class="space-y-3">
    <!-- Search santri -->
    <div>
      <label class="text-xs text-gray-600 dark:text-neutral-300">Cari Santri</label>
      <input v-model.trim="pjQuery" placeholder="ketik nama santri…" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
      <div v-if="pjQuery && pjCandidates.length" class="mt-2 max-h-48 overflow-auto rounded border border-gray-200 dark:border-neutral-700 divide-y dark:divide-neutral-800">
        <button
          v-for="s in pjCandidates"
          :key="s.id"
          @click="selectPjFromSantri(s)"
          class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800"
        >
          <div class="text-sm font-medium">{{ s.santri }}</div>
          <div class="text-[11px] text-gray-500">Gen {{ s.gen || '-' }} • {{ (s.kamar||'-') }} {{ (s.maskan||'') }}</div>
        </button>
      </div>
      <div v-else-if="pjQuery" class="mt-2 text-xs text-gray-500">Tidak ditemukan.</div>
    </div>

    <!-- Ringkasan pilihan -->
    <div v-if="pjSelection.santriId" class="flex items-center justify-between text-sm px-3 py-2 rounded border border-emerald-300 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-900/20">
      <div>Dipilih: <strong>{{ displayPjName(pjSelection) }}</strong> (terhubung)</div>
      <button @click="clearPjSelection" class="text-xs underline">Hapus pilihan</button>
    </div>

    <!-- Manual override -->
    <div>
      <label class="text-xs text-gray-600 dark:text-neutral-300">Atau isi manual</label>
      <input v-model.trim="pjSelection.name" placeholder="nama penanggung jawab" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
      <textarea v-model.trim="pjSelection.note" rows="2" placeholder="catatan (opsional)" class="mt-2 w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"></textarea>
    </div>
  </div>

  <template #footer>
    <button @click="showPjMaskan=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
    <button :disabled="pjSaving" @click="savePjMaskan" class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
      {{ pjSaving ? 'Menyimpan…' : 'Simpan' }}
    </button>
  </template>
</ModalShell>


<ModalShell v-model="showPjRoom" :title="maskanForRoomPj && roomForPj ? `Ubah PJ - Maskan ${maskanForRoomPj.name} / Kamar ${roomForPj.number}` : 'Ubah Penanggung Jawab Kamar'">
  <div class="space-y-3">
    <div>
      <label class="text-xs text-gray-600 dark:text-neutral-300">Cari Santri</label>
      <input v-model.trim="pjQuery" placeholder="ketik nama santri…" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
      <div v-if="pjQuery && pjCandidates.length" class="mt-2 max-h-48 overflow-auto rounded border border-gray-200 dark:border-neutral-700 divide-y dark:divide-neutral-800">
        <button
          v-for="s in pjCandidates"
          :key="s.id"
          @click="selectPjFromSantri(s)"
          class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800"
        >
          <div class="text-sm font-medium">{{ s.santri }}</div>
          <div class="text-[11px] text-gray-500">Gen {{ s.gen || '-' }} • {{ (s.kamar||'-') }} {{ (s.maskan||'') }}</div>
        </button>
      </div>
      <div v-else-if="pjQuery" class="mt-2 text-xs text-gray-500">Tidak ditemukan.</div>
    </div>

    <div v-if="pjSelection.santriId" class="flex items-center justify-between text-sm px-3 py-2 rounded border border-emerald-300 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-900/20">
      <div>Dipilih: <strong>{{ displayPjName(pjSelection) }}</strong> (terhubung)</div>
      <button @click="clearPjSelection" class="text-xs underline">Hapus pilihan</button>
    </div>

    <div>
      <label class="text-xs text-gray-600 dark:text-neutral-300">Atau isi manual</label>
      <input v-model.trim="pjSelection.name" placeholder="nama penanggung jawab" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
      <textarea v-model.trim="pjSelection.note" rows="2" placeholder="catatan (opsional)" class="mt-2 w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"></textarea>
    </div>
  </div>

  <template #footer>
    <button @click="showPjRoom=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
    <button :disabled="pjSaving" @click="savePjRoom" class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
      {{ pjSaving ? 'Menyimpan…' : 'Simpan' }}
    </button>
  </template>
</ModalShell>


    <ModalShell v-model="showRoomsModal" :title="activeMaskan ? `Kamar Maskan ${activeMaskan.name} (${activeMaskan.tipe})` : 'Kamar'">
      <div v-if="activeMaskan">
        <div class="flex flex-wrap items-end gap-2 mb-3">
          <div class="flex items-center gap-2">
            <div>
                <label for="no_room">Nomor Kamar</label>
                <input id="no_room" v-model="roomForm.number" placeholder="Nomor kamar" class="px-2 py-1 text-xs rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
            <div>
                <label for="capacity">Kapasitas</label>
                <input id="capacity" v-model.number="roomForm.capacity" type="number" min="0" placeholder="Kapasitas" class="w-24 px-2 py-1 text-xs rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
            <label class="inline-flex items-center gap-1 text-xs">
              <input type="checkbox" v-model="roomForm.active" />
              Aktif
            </label>
            <button @click="quickAddRoom(activeMaskan)" class="text-xs px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700">Tambah</button>
          </div>
          <div class="ml-auto flex items-center gap-2">
            <input v-model.number="genStart" type="number" min="1" placeholder="Mulai" class="w-20 px-2 py-1 text-xs rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
            <input v-model.number="genEnd" type="number" :min="genStart" placeholder="Selesai" class="w-20 px-2 py-1 text-xs rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
            <input v-model="genPrefix" placeholder="Prefix (opsional)" class="w-28 px-2 py-1 text-xs rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700" />
            <button @click="generateRooms(activeMaskan)" class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
              Generate
            </button>
          </div>
        </div>

        <div class="overflow-x-auto -mx-1">
          <table class="min-w-full text-xs">
            <thead>
              <tr class="text-left">
                <th class="px-3 py-2">Nomor</th>
                <th class="px-3 py-2">Kapasitas</th>
                <th class="px-3 py-2">PJ</th>
                <th class="px-3 py-2">Aktif</th>
                <th class="px-3 py-2 w-28">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-neutral-800">
              <tr v-for="r in activeMaskan.rooms" :key="r.id">
                <td class="px-3 py-2">{{ r.number }}</td>
                <td class="px-3 py-2">{{ r.capacity ?? 0 }}</td>
                <td class="px-3 py-2">
                    <div class="flex items-center gap-2">
                        <span>{{ displayPjName(r.pj) || '—' }}</span>
                        <button @click="openRoomEditPj(m, r)" class="text-[11px] px-2 py-0.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Ubah</button>
                    </div>
                </td>
                <td class="px-3 py-2">
                  <span :class="['text-xs px-2 py-0.5 rounded', r.active !== false ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300']">
                    {{ r.active !== false ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </td>
                <td class="px-3 py-2">
                  <div class="flex items-center gap-1">
                    <button @click="openRoomEdit(activeMaskan, r)" class="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800">Edit</button>
                    <button @click="openRoomDelete(activeMaskan, r)" class="px-2 py-1 rounded border border-gray-200 text-rose-600 hover:bg-rose-50 dark:border-neutral-700 dark:hover:bg-rose-900/20">Hapus</button>
                  </div>
                </td>
              </tr>
              <tr v-if="!activeMaskan.rooms.length">
                <td colspan="4" class="px-3 py-3 text-gray-500">Belum ada kamar.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <template #footer>
        <button @click="showRoomsModal=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
          Tutup
        </button>
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
        <p v-if="maskanFormError" class="text-sm text-rose-600">{{ maskanFormError }}</p>
      </form>
      <template #footer>
        <button @click="showMaskanForm=false" class="px-3 py-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="maskanSaving" @click="submitMaskanForm" class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
          {{ maskanSaving ? 'Menyimpan…' : 'Simpan' }}
        </button>
      </template>
    </ModalShell>

    <ModalShell v-model="showMaskanDelete" title="Hapus Maskan">
      <p class="text-sm">
        Hapus <strong>Maskan {{ maskanCurrent?.name }}</strong> ({{ maskanCurrent?.tipe }})?
        <br />Tindakan ini juga menghapus <strong>{{ maskanCurrent?.rooms.length || 0 }}</strong> kamar di dalamnya.
      </p>
      <template #footer>
        <button @click="showMaskanDelete=false" class="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="maskanDeleting" @click="confirmMaskanDelete" class="px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60">
          {{ maskanDeleting ? 'Menghapus…' : 'Hapus' }}
        </button>
      </template>
    </ModalShell>

    <ModalShell v-model="showRoomForm" title="Ubah Kamar">
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
          <div class="flex items-end gap-2">
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
          {{ roomSaving ? 'Menyimpan…' : 'Simpan' }}
        </button>
      </template>
    </ModalShell>

    <!-- Modal Room: Delete -->
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
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import DataTable from '~/components/widget/DataTable.vue'
import ModalShell from '~/components/widget/ModalShell.vue'
import { useMaskan, type MaskanRow, type KamarRow } from '~/composables/data/useMaskan'
import { useSantri } from '~/composables/data/useSantri'

definePageMeta({ layout: 'app', layoutProps: { title: 'Maskan Kamar' } })

const { rows: santriRows, fetchSantri } = useSantri()

const { rows, loading, error,
  fetchMaskan, createMaskan, updateMaskan, deleteMaskan,
  createRoom, updateRoom, deleteRoom, batchGenerateRooms
} = useMaskan()

onMounted(async () => { await Promise.all([fetchMaskan(), fetchSantri()]) })

const tipeTabs = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Putra', value: 'Putra' },
  { label: 'Putri', value: 'Putri' },
] as const
const activeTipe = ref<typeof tipeTabs[number]['value']>('ALL')
const filteredMaskan = computed(() =>
  rows.value.filter(m => activeTipe.value === 'ALL' ? true : m.tipe === activeTipe.value)
)

const columns = [
  { key: 'name', label: 'Maskan', sortable: true },
  { key: 'tipe', label: 'Tipe', sortable: true },
  { key: 'pj', label: 'Penanggung Jawab' }, 
  { key: 'rooms', label: 'Kamar' },
]

const expanded = ref<Set<string>>(new Set())
const isMobile = ref(false)
const showRoomsModal = ref(false)
const activeMaskan = ref<MaskanRow | null>(null)

function updateIsMobile() {
  isMobile.value = window.matchMedia('(max-width: 639px)').matches
}
onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile)
})

function openRooms(m: MaskanRow) {
  if (isMobile.value) {
    activeMaskan.value = m
    showRoomsModal.value = true
  } else {
    const s = new Set(expanded.value)
    s.has(m.id) ? s.delete(m.id) : s.add(m.id)
    expanded.value = s
  }
}

// -------- Quick add & generate rooms
const roomForm = reactive({ number: '', capacity: 0, active: true })
const genStart = ref<number | null>(1)
const genEnd = ref<number | null>(10)
const genPrefix = ref('')

async function quickAddRoom(m: MaskanRow) {
  const num = (roomForm.number ?? '').toString().trim()
  if (!num) return
  // Cegah duplikat nomor
  if (m.rooms.some(r => String(r.number).trim() === num)) return
  await createRoom(m.id, { number: num, capacity: Number(roomForm.capacity ?? 0), active: !!roomForm.active, tipe: m.tipe })
  roomForm.number = ''
}

async function generateRooms(m: MaskanRow) {
  const s = Number(genStart.value ?? 1)
  const e = Number(genEnd.value ?? s)
  if (Number.isNaN(s) || Number.isNaN(e) || e < s) return
  await batchGenerateRooms(m.id, s, e, { prefix: genPrefix.value, capacity: 0, active: true })
  // keep panel open
}

const showPjMaskan = ref(false)
const maskanForPj = ref<MaskanRow | null>(null)
const showPjRoom = ref(false)
const maskanForRoomPj = ref<MaskanRow | null>(null)
const roomForPj = ref<KamarRow | null>(null)
const pjQuery = ref('')
const pjSelection = reactive<{ santriId?: string, name?: string, note?: string }>({})
const pjCandidates = computed(() => {
  const q = pjQuery.value.trim().toLowerCase()
  if (!q) return []
  return santriRows.value
    .filter(s =>
      (s.santri || '').toLowerCase().includes(q) ||
      (s.kamar || '').toLowerCase().includes(q) ||
      (s.maskan || '').toLowerCase().includes(q)
    )
    .slice(0, 12)
})

const showMaskanForm = ref(false)
const maskanFormMode = ref<'create'|'edit'>('create')
const maskanSaving = ref(false)
const maskanFormError = ref<string | null>(null)
const maskanCurrent = ref<MaskanRow | null>(null)
const maskanForm: any = reactive<{ name: string; tipe: 'Putra'|'Putri'; deskripsi?: string }>({
  name: '', tipe: 'Putra', deskripsi: ''
})

function displayPjName(pj?: { name?: string, santriId?: string }) {
  if (!pj) return ''
  const fromSantri = santriRows.value.find(s => s.id === pj.santriId)
  return (fromSantri?.santri || pj.name || '').trim()
}

function openMaskanCreate() {
  maskanFormMode.value = 'create'
  maskanForm.name = ''
  maskanForm.tipe = 'Putra'
  maskanForm.deskripsi = ''
  maskanFormError.value = null
  showMaskanForm.value = true
}
function openMaskanEdit(m: MaskanRow) {
  maskanFormMode.value = 'edit'
  maskanCurrent.value = m
  maskanForm.name = m.name
  maskanForm.tipe = m.tipe
  maskanForm.deskripsi = m.deskripsi ?? ''
  maskanFormError.value = null
  showMaskanForm.value = true
}

function selectPjFromSantri(s: any) {
  pjSelection.santriId = s.id
  pjSelection.name = s.santri
  pjQuery.value = ''
}

function clearPjSelection() {
  pjSelection.santriId = undefined
}

function openMaskanEditPj(m: MaskanRow) {
  maskanForPj.value = m
  pjQuery.value = ''
  pjSelection.santriId = m.pj?.santriId
  pjSelection.name = m.pj?.name || displayPjName(m.pj)
  pjSelection.note = m.pj?.note
  showPjMaskan.value = true
}

function openRoomEditPj(m: MaskanRow, r: KamarRow) {
  maskanForRoomPj.value = m
  roomForPj.value = r
  pjQuery.value = ''
  pjSelection.santriId = r.pj?.santriId
  pjSelection.name = r.pj?.name || displayPjName(r.pj)
  pjSelection.note = r.pj?.note
  showPjRoom.value = true
}

const pjSaving = ref(false)
async function savePjMaskan() {
  if (!maskanForPj.value?.id) return
  pjSaving.value = true
  try {
    await updateMaskan(maskanForPj.value.id, { pj: { ...pjSelection } })
    showPjMaskan.value = false
  } finally {
    pjSaving.value = false
  }
}

async function savePjRoom() {
  if (!maskanForRoomPj.value?.id || !roomForPj.value?.id) return
  pjSaving.value = true
  try {
    await updateRoom(maskanForRoomPj.value.id, roomForPj.value.id, { pj: { ...pjSelection } })
    showPjRoom.value = false
  } finally {
    pjSaving.value = false
  }
}

async function submitMaskanForm() {
  if (!maskanForm.name?.trim()) {
    maskanFormError.value = 'Nama maskan wajib diisi.'
    return
  }
  maskanSaving.value = true
  try {
    const payload: any = {
      name: maskanForm.name.trim(),
      tipe: maskanForm.tipe,
      deskripsi: maskanForm.deskripsi ?? '',
    }

    if ('pj' in maskanForm) {
      payload.pj = maskanForm.pj
        ? {
            santriId: maskanForm.pj.santriId ?? '',
            name: maskanForm.pj.name ?? '',
            note: maskanForm.pj.note ?? '',
          }
        : null
    }

    if (maskanFormMode.value === 'create') {
      await createMaskan(payload)
    } else if (maskanCurrent.value?.id) {
      await updateMaskan(maskanCurrent.value.id, payload)
    }

    showMaskanForm.value = false
  } catch (e: any) {
    maskanFormError.value = e?.message ?? 'Gagal menyimpan'
  } finally {
    maskanSaving.value = false
  }
}

const showMaskanDelete = ref(false)
const maskanDeleting = ref(false)

function openMaskanDelete(m: MaskanRow) {
  maskanCurrent.value = m
  showMaskanDelete.value = true
}

async function confirmMaskanDelete() {
  if (!maskanCurrent.value?.id) return
  maskanDeleting.value = true
  try {
    await deleteMaskan(maskanCurrent.value.id)
    showMaskanDelete.value = false
  } finally {
    maskanDeleting.value = false
  }
}

const showRoomForm = ref(false)
const roomSaving = ref(false)
const roomFormError = ref<string | null>(null)
const roomCurrent = ref<KamarRow | null>(null)
const maskanForRoom = ref<MaskanRow | null>(null)
const roomEditForm = reactive<{ number: string; capacity: number; active: boolean }>({
  number: '', capacity: 0, active: true
})

function openRoomEdit(m: MaskanRow, r: KamarRow) {
  maskanForRoom.value = m
  roomCurrent.value = r
  roomEditForm.number = r.number
  roomEditForm.capacity = Number(r.capacity ?? 0)
  roomEditForm.active = r.active !== false
  roomFormError.value = null
  showRoomForm.value = true
}
async function submitRoomForm() {
  if (!maskanForRoom.value?.id || !roomCurrent.value?.id) return
  if (!roomEditForm.number.trim()) {
    roomFormError.value = 'Nomor kamar wajib diisi.'
    return
  }
  // Cegah duplikat nomor (kecuali jika nomor tdk berubah)
  const dup = maskanForRoom.value.rooms.some(r =>
    r.id !== roomCurrent.value!.id && String(r.number).trim() === roomEditForm.number.trim()
  )
  if (dup) {
    roomFormError.value = 'Nomor kamar sudah ada.'
    return
  }
  roomSaving.value = true
  try {
    await updateRoom(maskanForRoom.value.id, roomCurrent.value.id, {
      number: roomEditForm.number.trim(),
      capacity: Number(roomEditForm.capacity ?? 0),
      active: !!roomEditForm.active,
    })
    showRoomForm.value = false
  } catch (e: any) {
    roomFormError.value = e?.message ?? 'Gagal menyimpan kamar'
  } finally {
    roomSaving.value = false
  }
}

const showRoomDelete = ref(false)
const roomDeleting = ref(false)
function openRoomDelete(m: MaskanRow, r: KamarRow) {
  maskanForRoom.value = m
  roomCurrent.value = r
  showRoomDelete.value = true
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
