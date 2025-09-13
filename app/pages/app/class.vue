<template>
  <div class="p-4">
    <!-- ===================== HEADER & TOOLS ===================== -->
    <div class="w-full flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center gap-2">
        <h1 class="text-xl font-semibold">Kelas</h1>
        <span class="text-sm text-gray-500 dark:text-neutral-400">({{ filtered.length }})</span>
      </div>

      <div class="flex items-center gap-2">
        <div class="relative">
          <Icon icon="lucide:search" class="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            v-model="q"
            type="search"
            placeholder="Cari kelas…"
            class="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-100 bg-white dark:bg-neutral-800 dark:border-neutral-700 w-64
                   focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <select
          v-model="selectedCategory"
          class="px-3 py-2 text-sm rounded-lg border border-gray-100 bg-white dark:bg-neutral-800 dark:border-neutral-700"
        >
          <option value="all">Semua Kategori</option>
          <option value="putra">Putra</option>
          <option value="putri">Putri</option>
          <option value="campuran">Campuran</option>
        </select>

        <label class="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="showArchived" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
          Tampilkan Arsip
        </label>

        <button
          @click="openCreateClass"
          class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          <Icon icon="lucide:plus" class="size-4" /> Kelas Baru
        </button>
      </div>
    </div>

    <!-- ===================== ACCORDION LIST ===================== -->
    <div class="mt-4 space-y-3">
      <div
        v-for="c in filtered"
        :key="c.id"
        class="rounded-2xl border border-gray-100 bg-white shadow-xs dark:bg-neutral-800 dark:border-neutral-700 overflow-hidden"
      >
        <!-- Header -->
        <button
          class="w-full flex items-stretch text-left"
          @click="toggleExpand(c.id)"
        >
          <div class="relative h-20 w-32 shrink-0">
            <img v-if="c.coverUrl" :src="c.coverUrl" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full" :style="{ background: c.color || '#2563eb' }"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent"></div>
          </div>

          <div class="flex-1 p-3">
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <h3 class="font-semibold truncate">{{ c.title }}</h3>
                  <span
                    class="inline-flex items-center gap-1 text-xs rounded-md px-2 py-1 border dark:border-neutral-700"
                    :class="badgeClass(c.category)"
                  >
                    <Icon :icon="badgeIcon(c.category)" class="size-3.5" />
                    {{ labelCategory(c.category) }}
                  </span>
                  <span v-if="c.archived" class="text-[11px] text-rose-500 border border-rose-200/30 rounded px-1.5 py-0.5">Diarsipkan</span>
                </div>
                <p class="text-xs text-gray-500 dark:text-neutral-400 truncate">
                  <span v-if="c.level">{{ c.level }}</span>
                  <span v-if="c.level && c.section"> · </span>
                  <span v-if="c.section">{{ c.section }}</span>
                  <span v-if="c.room"> · Ruang {{ c.room }}</span>
                  <span class="ml-2">Kode: <b>{{ c.code }}</b></span>
                </p>
              </div>

              <div class="flex items-center gap-2">
                <button
                  class="px-2 py-1.5 text-xs rounded-md border border-gray-200 dark:border-neutral-700"
                  @click.stop="openEditClass(c)"
                >
                  Edit
                </button>
                <button
                  class="px-2 py-1.5 text-xs rounded-md border border-gray-200 dark:border-neutral-700 text-rose-600"
                  @click.stop="confirmDeleteClass(c)"
                >
                  Hapus
                </button>
                <button
                  class="px-2 py-1.5 text-xs rounded-md border border-gray-200 dark:border-neutral-700"
                  @click.stop="toggleArchive(c)"
                >
                  {{ c.archived ? 'Keluarkan Arsip' : 'Arsipkan' }}
                </button>

                <Icon
                  :icon="expandedId===c.id ? 'lucide:chevron-up' : 'lucide:chevron-down'"
                  class="size-5 text-gray-500"
                />
              </div>
            </div>
          </div>
        </button>

        <!-- Detail (Collapsible) -->
        <div v-show="expandedId===c.id" class="border-t border-gray-100 dark:border-neutral-700 p-3">
          <div class="flex items-center gap-2">
            <div class="font-medium flex items-center gap-2">
              <Icon icon="lucide:users" class="size-4" />
              Anggota Kelas
              <span class="text-xs text-gray-500">{{ membersDetailed.length }}</span>
            </div>
            <div class="ml-auto flex items-center gap-2">
              <div class="relative">
                <Icon icon="lucide:search" class="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  v-model="memberFilter"
                  type="search"
                  placeholder="Cari anggota…"
                  class="pl-8 pr-3 py-1.5 text-sm rounded-lg border border-gray-100 bg-white dark:bg-neutral-800 dark:border-neutral-700 w-56
                         focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
              <button
                class="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                @click="openAddMembers(c.id)"
              >
                <Icon icon="lucide:user-plus" class="inline-block mr-1 -mt-0.5" /> Tambah Anggota
              </button>
            </div>
          </div>

          <div class="mt-3 rounded-xl border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700 overflow-hidden">
            <div class="max-h-[55vh] overflow-y-auto divide-y divide-gray-100 dark:divide-neutral-700">
              <div
                v-for="m in visibleMembers"
                :key="m.id"
                class="flex items-center gap-3 px-3 py-2"
              >
                <div class="min-w-0">
                  <div class="font-medium truncate">{{ m.santri }}</div>
                  <div class="text-xs text-gray-500 dark:text-neutral-400 truncate">
                    {{ m.walisantri || '-' }} · Gen {{ m.gen || '-' }} · {{ m.kamar || '-' }}
                  </div>
                </div>
                <button
                  type="button"
                  class="ml-auto px-2 py-1 text-xs rounded-md border border-gray-200 text-rose-600 dark:border-neutral-700"
                  :disabled="removingIds.has(m.id)"
                  @click="removeMemberFrom(c.id, m.id)"
                >
                  <span v-if="removingIds.has(m.id)">
                    <Icon icon="ph:spinner" class="size-3 animate-spin" />
                  </span>
                  <span v-else>Hapus</span>
                </button>
              </div>
              <div v-if="!visibleMembers.length" class="p-3 text-sm text-gray-500 dark:text-neutral-400">
                Belum ada anggota.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!filtered.length" class="p-6 text-sm text-gray-500 dark:text-neutral-400 border rounded-xl dark:border-neutral-700">
        Tidak ada kelas.
      </div>
    </div>

    <!-- ===================== MODAL: CREATE/EDIT CLASS ===================== -->
    <teleport to="body">
      <div v-if="classModal.open" class="fixed inset-0 z-[90]">
        <div class="absolute inset-0 bg-black/40" @click="closeClassModal"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-lg rounded-2xl border border-gray-100 bg-white shadow-xl dark:bg-neutral-800 dark:border-neutral-700">
            <div class="p-4 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
              <h3 class="font-semibold">{{ classModal.mode === 'create' ? 'Kelas Baru' : 'Edit Kelas' }}</h3>
              <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700" @click="closeClassModal">
                <Icon icon="lucide:x" class="size-4" />
              </button>
            </div>

            <form class="p-4 space-y-3 max-h-[80vh] overflow-y-auto scrollbar-none" @submit.prevent="saveClassModal">
              <!-- ...di dalam <form class="p-4 ..."> -->
              <div class="grid grid-cols-1 gap-2">
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Sampul Kelas (opsional)</label>

                  <!-- Preview area -->
                  <div class="mt-2 flex items-start gap-3">
                    <!-- Kotak preview 16:9 -->
                    <div class="relative w-48 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900">
                      <div class="w-full aspect-video">
                        <img
                          v-if="classForm.coverPreview"
                          :src="classForm.coverPreview"
                          alt="Preview sampul baru"
                          class="w-full h-full object-cover"
                        />
                        <img
                          v-else-if="classModal.mode==='edit' && classForm.initialCoverUrl && !classForm.removeCover"
                          :src="classForm.initialCoverUrl"
                          alt="Sampul saat ini"
                          class="w-full h-full object-cover"
                        />
                        <div v-else class="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          Tidak ada sampul
                        </div>
                      </div>
                    </div>

                    <!-- Controls -->
                    <div class="flex-1 flex flex-col gap-2">
                      <label class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 cursor-pointer w-fit">
                        <Icon icon="lucide:upload" class="size-4" />
                        <span class="text-sm">Pilih Gambar</span>
                        <input type="file" accept="image/*" class="hidden" @change="onCoverInput" />
                      </label>

                      <div class="flex items-center gap-2">
                        <!-- Hapus pilihan file baru -->
                        <button
                          v-if="classForm.coverPreview"
                          type="button"
                          class="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-700 text-rose-600"
                          @click="clearNewCover"
                        >
                          <Icon icon="lucide:trash-2" class="inline size-4 mr-1 -mt-0.5" /> Batalkan Gambar
                        </button>

                        <!-- Toggle hapus cover lama (hanya mode edit, saat tidak ada file baru & cover lama ada) -->
                        <button
                          v-if="classModal.mode==='edit' && !classForm.coverPreview && classForm.initialCoverUrl"
                          type="button"
                          class="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-700"
                          :class="classForm.removeCover ? 'text-rose-600 border-rose-200/40' : ''"
                          @click="markRemoveExistingCover"
                        >
                          <Icon :icon="classForm.removeCover ? 'lucide:check-circle-2' : 'lucide:trash-2'" class="inline size-4 mr-1 -mt-0.5" />
                          {{ classForm.removeCover ? 'Akan dihapus' : 'Hapus Sampul' }}
                        </button>
                      </div>

                      <p class="text-[11px] text-gray-500 dark:text-neutral-400">
                        Rekomendasi rasio 16:9. File gambar akan otomatis diunggah saat menyimpan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Nama Kelas</label>
                  <input
                    v-model.trim="classForm.title"
                    type="text"
                    class="mt-1 w-full rounded-md border-gray-300 border bg-white dark:bg-neutral-900 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    required
                  />
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Level/Paralel</label>
                  <input
                    v-model.trim="classForm.level"
                    type="text"
                    placeholder="Contoh: 1 SMP A"
                    class="mt-1 w-full rounded-md border-gray-300 border bg-white dark:bg-neutral-900 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Kategori</label>
                  <select
                    v-model="classForm.category"
                    class="mt-1 w-full rounded-md border-gray-300 border bg-white dark:bg-neutral-900 dark:border-neutral-700 px-3 py-2 text-sm"
                  >
                    <option value="putra">Putra</option>
                    <option value="putri">Putri</option>
                    <option value="campuran">Campuran</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Ruang</label>
                  <input
                    v-model.trim="classForm.room"
                    type="text"
                    class="mt-1 w-full rounded-md border-gray-300 border bg-white dark:bg-neutral-900 dark:border-neutral-700 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Warna</label>
                  <input
                    v-model="classForm.color"
                    type="color"
                    class="mt-1 h-9 rounded-md border w-full bg-white border-gray-300 dark:bg-neutral-900 dark:border-neutral-700 px-1 py-1 text-sm"
                  />
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Kode Kelas</label>
                  <input
                    v-model.trim="classForm.code"
                    type="text"
                    placeholder="Auto jika kosong (acak unik)"
                    class="mt-1 w-full rounded-md border-gray-300 border bg-white dark:bg-neutral-900 dark:border-neutral-700 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div class="flex items-center justify-end pt-1">
                <button type="submit" class="px-3 py-1.5 flex items-center rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                  <Icon v-if="savingClass" icon="ph:spinner" class="size-4 animate-spin" />
                  <span>{{ savingClass ? 'Menyimpan…' : (classModal.mode==='create' ? 'Simpan' : 'Update') }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </teleport>

    <!-- ===================== MODAL: TAMBAH ANGGOTA ===================== -->
    <teleport to="body">
      <div v-if="addModal.open" class="fixed inset-0 z-[90]">
        <div class="absolute inset-0 bg-black/40" @click="closeAddMembers"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white shadow-xl dark:bg-neutral-800 dark:border-neutral-700">
            <div class="p-4 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
              <h3 class="font-semibold">Tambah Anggota</h3>
              <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700" @click="closeAddMembers">
                <Icon icon="lucide:x" class="size-4" />
              </button>
            </div>

            <div class="p-4 space-y-3">
              <div class="flex items-center gap-2">
                <div class="relative">
                  <Icon icon="lucide:search" class="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    v-model="addModal.q"
                    type="search"
                    placeholder="Cari santri (nama/ortu/kamar/gen)…"
                    class="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-100 bg-white dark:bg-neutral-800 dark:border-neutral-700 w-80"
                  />
                </div>
                <div class="text-xs text-gray-500 dark:text-neutral-400">
                  Terpilih: {{ addModal.selected.size }}
                </div>
                <div class="ml-auto">
                  <button
                    class="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    :disabled="!addModal.selected.size"
                    @click="commitAddMembers"
                  >
                    Tambahkan ({{ addModal.selected.size }})
                  </button>
                </div>
              </div>

              <div class="rounded-xl border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700 overflow-hidden">
                <div class="max-h-[60vh] overflow-y-auto divide-y divide-gray-100 dark:divide-neutral-700">
                  <label
                    v-for="s in availableForAdd"
                    :key="s.id"
                    class="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700/50"
                  >
                    <input
                      type="checkbox"
                      :checked="addModal.selected.has(s.id)"
                      @change="toggleSelectAdd(s.id, $event)"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div class="min-w-0">
                      <div class="font-medium truncate">{{ s.santri }}</div>
                      <div class="text-xs text-gray-500 dark:text-neutral-400 truncate">
                        {{ s.walisantri || '-' }} · Gen {{ s.gen || '-' }} · {{ s.kamar || '-' }}
                      </div>
                    </div>
                  </label>
                  <div v-if="!availableForAdd.length" class="p-3 text-sm text-gray-500 dark:text-neutral-400">
                    Tidak ada hasil / semua sudah menjadi anggota.
                  </div>
                </div>
              </div>
            </div>

            <div class="p-4 border-t border-gray-200 dark:border-neutral-700 flex justify-end">
              <button class="px-3 py-1.5 rounded-lg border dark:border-neutral-700" @click="closeAddMembers">Tutup</button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onMounted, onUnmounted, ref, reactive, computed } from 'vue'
import { useNuxtApp } from '#app'
import { ref as dbRef, onValue, off, update, get } from 'firebase/database'
import {
  useClass,
  type ClassItem,
  type ClassCategory
} from '~/composables/data/useClass'
import { useSantri, type SantriRow } from '~/composables/data/useSantri'

definePageMeta({ layout: 'app', layoutProps: { title: 'Kelas' } })

/** ===== useClass (list & CRUD kelas) ===== */
const {
  filtered, q, selectedCategory, showArchived,
  subscribeAll, createClass, updateClass, deleteClass, archiveClass
} = useClass()

/** ===== Santri source ===== */
const { rows: santriRows, subscribeSantri, unsubscribeSantri } = useSantri()

/** ===== Accordion State ===== */
const expandedId = ref<string | null>(null)
const memberIds = ref<string[]>([])
const memberFilter = ref('')
const removingIds = ref<Set<string>>(new Set())
let stopMembers: (() => void) | null = null
const { $realtimeDb } = useNuxtApp()

function bindMembers(classId: string) {
  unbindMembers()
  const r = dbRef($realtimeDb, `alberr/class_members/${classId}`)
  const handler = (snap:any) => {
    const val = snap.val() || {}
    memberIds.value = Object.keys(val)
  }
  onValue(r, handler)
  stopMembers = () => off(r, 'value', handler)
}
function unbindMembers(){ if (stopMembers) { stopMembers(); stopMembers = null } memberIds.value = [] }

function toggleExpand(id: string) {
  expandedId.value === id ? (expandedId.value = null, unbindMembers())
                          : (expandedId.value = id, bindMembers(id))
}

/** ===== Members computed ===== */
const membersDetailed = computed<SantriRow[]>(() => {
  const set = new Set(memberIds.value)
  return santriRows.value.filter(s => set.has(s.id))
})
const visibleMembers = computed<SantriRow[]>(() => {
  const q = memberFilter.value.trim().toLowerCase()
  if (!q) return membersDetailed.value
  return membersDetailed.value.filter(s =>
    [s.santri, s.walisantri, s.kamar, s.gen].some(v => (v || '').toLowerCase().includes(q))
  )
})

/** ===== Add / Remove Members (per kelas) ===== */
async function addMembersTo(classId: string, ids: string[]) {
  if (!ids.length) return
  const payload: Record<string, any> = {}
  const now = Date.now()
  for (const sid of ids) {
    payload[`alberr/class_members/${classId}/${sid}`] = { addedAt: now }
    payload[`alberr/santri_classes/${sid}/${classId}`] = true
  }
  await update(dbRef($realtimeDb), payload)
}
async function removeMemberFrom(classId: string, santriId: string) {
  if (removingIds.value.has(santriId)) return
  removingIds.value.add(santriId)
  try {
    const payload: Record<string, any> = {}
    payload[`alberr/class_members/${classId}/${santriId}`] = null
    payload[`alberr/santri_classes/${santriId}/${classId}`] = null
    await update(dbRef($realtimeDb), payload)
  } finally {
    removingIds.value.delete(santriId)
  }
}

const classModal = reactive<{ open:boolean; mode:'create'|'edit'; id?:string }>(
  { open:false, mode:'create', id: undefined }
)
const classForm = reactive<{
  title: string
  level: string
  category: ClassCategory
  room: string
  color: string
  code: string
  coverFile: File | null
  coverPreview: string | null      // URL.createObjectURL untuk file baru
  initialCoverUrl: string | null   // cover yang sudah ada (saat edit)
  removeCover: boolean             // hapus cover yang lama
}>({
  title:'', level:'', category:'campuran', room:'', color:'#2563eb', code:'',
  coverFile: null, coverPreview: null, initialCoverUrl: null, removeCover: false
})
const savingClass = ref(false)

function resetClassForm() {
  classForm.title=''; classForm.level=''; classForm.category='campuran'
  classForm.room=''; classForm.color='#2563eb'; classForm.code=''
  if (classForm.coverPreview) URL.revokeObjectURL(classForm.coverPreview)
  classForm.coverFile = null
  classForm.coverPreview = null
  classForm.initialCoverUrl = null
  classForm.removeCover = false
}

function openCreateClass() {
  resetClassForm()
  classModal.mode='create'
  classModal.open=true
  classModal.id=undefined
}

function openEditClass(c: ClassItem) {
  resetClassForm()
  classModal.mode='edit'
  classModal.open=true
  classModal.id=c.id
  classForm.title=c.title || ''
  classForm.level=c.level || ''
  classForm.category=c.category
  classForm.room=c.room || ''
  classForm.color=c.color || '#2563eb'
  classForm.code=c.code || ''
  classForm.initialCoverUrl = c.coverUrl || null
}

function onCoverInput(ev: Event) {
  const file = (ev.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (classForm.coverPreview) URL.revokeObjectURL(classForm.coverPreview)
  classForm.coverFile = file
  classForm.coverPreview = URL.createObjectURL(file)
  classForm.removeCover = false
}

function clearNewCover() {
  if (classForm.coverPreview) URL.revokeObjectURL(classForm.coverPreview)
  classForm.coverPreview = null
  classForm.coverFile = null
}

function markRemoveExistingCover() {
  classForm.removeCover = !classForm.removeCover
}

async function saveClassModal() {
  if (savingClass.value) return
  savingClass.value = true
  try {
    if (classModal.mode === 'create') {
      await createClass({
        title: classForm.title,
        level: classForm.level,
        category: classForm.category,
        room: classForm.room,
        color: classForm.color,
        code: classForm.code || undefined,
        coverFile: classForm.coverFile || undefined
      })
    } else if (classModal.mode === 'edit' && classModal.id) {
      await updateClass(classModal.id, {
        title: classForm.title,
        level: classForm.level,
        category: classForm.category,
        room: classForm.room,
        color: classForm.color,
        code: classForm.code || undefined,
        coverFile: classForm.coverFile || undefined,
        removeCover: classForm.removeCover
      })
    }
    closeClassModal()
  } finally {
    savingClass.value = false
  }
}

function closeClassModal(){
  if (classForm.coverPreview) URL.revokeObjectURL(classForm.coverPreview)
  classModal.open=false
}

async function confirmDeleteClass(c: ClassItem) {
  if (confirm(`Hapus kelas "${c.title}"?`)) {
    await deleteClass(c.id)
    if (expandedId.value === c.id) { expandedId.value = null; unbindMembers() }
  }
}
async function toggleArchive(c: ClassItem) {
  await archiveClass(c.id, !c.archived)
}

/** ===== Modal: Tambah Anggota ===== */
const addModal = reactive<{ open:boolean; classId:string; selected:Set<string>; q:string; existing:Set<string> }>(
  { open:false, classId:'', selected:new Set(), q:'', existing:new Set() }
)

async function openAddMembers(classId: string) {
  addModal.open = true
  addModal.classId = classId
  addModal.selected = new Set()
  addModal.q = ''
  // ambil anggota terkini (agar available list akurat meski panel lain terbuka)
  try {
    const s = await get(dbRef($realtimeDb, `alberr/class_members/${classId}`))
    const ids = s.exists() ? Object.keys(s.val() || {}) : []
    addModal.existing = new Set(ids)
  } catch { addModal.existing = new Set() }
}
function closeAddMembers(){ addModal.open=false }

const availableForAdd = computed<SantriRow[]>(() => {
  const q = addModal.q.trim().toLowerCase()
  return santriRows.value
    .filter(s => !addModal.existing.has(s.id))
    .filter(s => !q || [s.santri, s.walisantri, s.kamar, s.gen].some(v => (v || '').toLowerCase().includes(q)))
    .slice(0, 500)
})
function toggleSelectAdd(id: string, ev: Event) {
  const checked = (ev.target as HTMLInputElement).checked
  const next = new Set(addModal.selected)
  checked ? next.add(id) : next.delete(id)
  addModal.selected = next
}
async function commitAddMembers() {
  await addMembersTo(addModal.classId, Array.from(addModal.selected))
  closeAddMembers()
  // jika sedang expanded pada kelas ini, daftar anggota otomatis terbarui via onValue
}

/** ===== Badges & helpers ===== */
function badgeClass(cat: ClassCategory) {
  const base = 'border border-gray-200 px-2 py-1 rounded-md'
  switch (cat) {
    case 'putra': return `${base} text-emerald-700 dark:text-emerald-300`
    case 'putri': return `${base} text-pink-700 dark:text-pink-300`
    default:      return `${base} text-indigo-700 dark:text-indigo-300`
  }
}
function badgeIcon(cat: ClassCategory) {
  return cat === 'putra'
    ? 'lucide:badge-check'
    : cat === 'putri'
    ? 'lucide:sparkles'
    : 'lucide:users'
}
function labelCategory(cat: ClassCategory) {
  return cat === 'putra' ? 'Putra' : cat === 'putri' ? 'Putri' : 'Campuran'
}

/** ===== Lifecycle ===== */
onMounted(() => {
  subscribeAll()
  subscribeSantri()
})
onUnmounted(() => {
  unbindMembers()
  unsubscribeSantri()
})
</script>

<style scoped>
.shadow-xs { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
</style>
