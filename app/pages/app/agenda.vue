<template>
  <div class="p-4">
    <!-- Header controls -->
    <div class="w-full flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center gap-2">
        <button type="button"
          class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-lg border border-gray-100 bg-white hover:bg-gray-50
                 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700"
          @click="prevMonth">
          <Icon icon="mingcute:left-fill" width="16" height="16" />
        </button>
        <div class="px-3 py-2 text-sm font-semibold rounded-xl border border-gray-100 bg-white dark:bg-neutral-800 dark:border-neutral-700">
          {{ monthTitle }}
        </div>
        <button type="button"
          class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-lg border border-gray-100 bg-white hover:bg-gray-50
                 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700"
          @click="nextMonth">
          <Icon icon="mingcute:right-fill" width="16" height="16" />
        </button>
        <button type="button"
          class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-lg border border-gray-100 bg-white hover:bg-gray-50
                 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700"
          @click="goToday">
          Today
        </button>
      </div>

      <div class="flex items-center gap-2">
        <div class="relative">
          <Icon icon="lucide:search" class="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input v-model="q" type="search" placeholder="Cari agenda…"
            class="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-100 bg-white dark:bg-neutral-800 dark:border-neutral-700 w-64
                   focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
        </div>
        <button @click="openCreateForDate(currentISO)"
          class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-lg bg-blue-600 hover:bg-gray-50
                 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700">
          <Icon icon="lucide:plus" class="size-4" /> Agenda Baru
        </button>
      </div>
    </div>

    <div class="mt-4 hidden lg:grid grid-cols-7 text-[12px] text-gray-500 dark:text-neutral-400">
      <div v-for="d in weekdayNames" :key="d" class="px-2 py-1">{{ d }}</div>
    </div>

    <div class="hidden lg:grid grid-cols-7 border-t border-gray-100 border-l mt-1 rounded-lg overflow-hidden
                dark:border-neutral-700">
      <div v-for="cell in monthCells" :key="cell.key"
        class="min-h-[120px] border-b border-r p-2 border-gray-100 relative bg-white dark:bg-neutral-800
               dark:border-neutral-700"
        :class="{
          'bg-blue-50/50 dark:bg-blue-950/30': isToday(cell.dateISO),
          'text-gray-400 dark:text-neutral-500': cell.outside
        }"
        @click.left="openCreateForDate(cell.dateISO)"
        @contextmenu.prevent="openContextMenu($event, cell.dateISO)"
      >
        <div class="text-xs font-medium mb-1">{{ dayOfMonth(cell.dateISO) }}</div>

        <ul class="space-y-1">
          <li v-for="a in eventsOf(cell.dateISO)" :key="a.id" class="group px-2 py-1 rounded-md text-[12px] cursor-pointer border overflow-hidden bg-gradient-to-r from-white to-white hover:from-blue-50 hover:to-blue-50 dark:from-neutral-800 dark:to-neutral-800 dark:hover:from-neutral-700 dark:hover:to-neutral-700"    :style="{ borderColor: a.color || '#3b82f6' }"    @click.stop="openDetail(a)"    @contextmenu.prevent.stop="openContextMenu($event, cell.dateISO, a)">
            <div class="flex items-center">
                <span class="inline-block w-2 h-2 rounded-full mr-1 align-middle" :style="{ background: a.color || '#3b82f6' }"></span> <span class="text-[0.7rem]">{{ aTime(a) }}</span>
            </div>
            <span class="align-middle truncate">{{ a.title }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="lg:hidden mt-3 space-y-3">
      <div v-for="cell in monthCells" :key="cell.key" class="rounded-xl border bg-white dark:bg-neutral-800 dark:border-neutral-700">
        <div class="px-3 py-2 flex items-center justify-between">
          <div class="text-sm font-medium" :class="cell.outside ? 'text-gray-400 dark:text-neutral-500' : ''">
            {{ prettyDate(cell.dateISO) }}
          </div>
          <button class="text-xs px-2 py-1 rounded-md border hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
                  @click="openCreateForDate(cell.dateISO)">
            Tambah
          </button>
        </div>
        <ul v-if="eventsOf(cell.dateISO).length" class="divide-y dark:divide-neutral-700">
          <li v-for="a in eventsOf(cell.dateISO)" :key="a.id"
              class="px-3 py-2 text-sm flex items-start gap-2 overflow-hidden"
              @click="openDetail(a)"
              @contextmenu.prevent="openContextMenu($event, cell.dateISO, a)"
          >
            <span class="inline-block w-2.5 h-2.5 rounded-full mt-1" :style="{ background: a.color || '#3b82f6' }"></span>
            <div class="min-w-0">
              <p class="truncate">{{ a.title }}</p>
              <p class="text-[12px] text-gray-500 dark:text-neutral-400">{{ aTime(a, true) }} <span v-if="a.location">· {{ a.location }}</span></p>
            </div>
          </li>
        </ul>
        <div v-else class="px-3 pb-3 text-[12px] text-gray-500 dark:text-neutral-400">Tidak ada agenda.</div>
      </div>
    </div>

    <!-- Context Menu -->
    <teleport to="body">
      <div v-show="ctx.open"
           class="fixed z-[80] min-w-40 max-h-[80vh] overflow-y-auto rounded-lg border border-gray-100 bg-white shadow-lg dark:bg-neutral-800 dark:border-neutral-700"
           :style="{ left: ctx.x + 'px', top: ctx.y + 'px' }"
           @click.stop
      >
        <div class="px-3 py-2 text-xs text-gray-500 dark:text-neutral-400 border-b border-gray-100 dark:border-neutral-700">
          {{ prettyDate(ctx.dateISO) }}
        </div>
        <ul class="py-1 text-sm">
          <li>
            <button class="w-full text-left px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-neutral-700"
                    @click="createFromContext">Tambah Agenda</button>
          </li>
          <li v-if="ctx.agenda">
            <button class="w-full text-left px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-neutral-700"
                    @click="editFromContext">Edit</button>
          </li>
          <li v-if="ctx.agenda">
            <button class="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-rose-600 dark:hover:bg-neutral-700"
                    @click="deleteFromContext">Hapus</button>
          </li>
          <li v-if="ctx.agenda">
            <div class="px-3 py-1.5 flex items-center gap-2">
              <input v-model="ctx.moveTo" type="date"
                     class="w-full rounded-md border bg-white dark:bg-neutral-800 dark:border-neutral-700 text-sm px-2 py-1" />
              <button class="px-2 py-1 text-xs rounded-md border hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
                      @click="moveFromContext">Pindah</button>
            </div>
          </li>
        </ul>
      </div>
    </teleport>

    <teleport to="body">
      <div v-if="modal.open" class="fixed inset-0 z-[90]">
        <div class="absolute inset-0 bg-black/40" @click="closeModal"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-lg rounded-2xl border border-gray-100 bg-white shadow-xl dark:bg-neutral-800 dark:border-neutral-700">
            <div class="p-4 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
              <h3 class="font-semibold">{{ modal.mode === 'create' ? 'Agenda Baru' : 'Detail Agenda' }}</h3>
              <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700" @click="closeModal">
                <Icon icon="lucide:x" class="size-4" />
              </button>
            </div>

            <form class="p-4 space-y-3 max-h-[80vh] overflow-y-auto scrollbar-none" @submit.prevent="saveModal">
                <div>
                    <label class="text-xs text-gray-500 dark:text-neutral-400">Thumbnail</label>
                    <div class="mt-1 flex items-center gap-3">
                        <input type="file" accept="image/*"
                            @change="onPickThumb"
                            class="block w-full text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-gray-100
                                    dark:file:bg-neutral-700 dark:file:text-neutral-200" />
                        <button v-if="thumbPreview" type="button"
                                class="px-2 py-1 text-xs rounded-md border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
                                @click="clearThumb">Hapus</button>
                    </div>
                    <div v-if="thumbPreview" class="mt-2 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700">
                        <img :src="thumbPreview" alt="thumb" class="w-full h-36 object-cover">
                    </div>
                </div>
              <div>
                <label class="text-xs text-gray-500 dark:text-neutral-400">Judul</label>
                <input v-model.trim="form.title" type="text" class="mt-1 w-full rounded-md border-gray-300 border bg-white dark:bg-neutral-900 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" required />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Tanggal & Waktu Mulai</label>
                  <input v-model="form.start" type="datetime-local" class="mt-1 w-full rounded-md border-gray-300 border bg-white dark:bg-neutral-900 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Tanggal & Waktu Selesai</label>
                  <input v-model="form.end" type="datetime-local" class="mt-1 w-full rounded-md border-gray-300 border bg-white dark:bg-neutral-900 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Lokasi</label>
                  <input v-model.trim="form.location" type="text" class="mt-1 w-full rounded-md border-gray-300 border bg-white dark:bg-neutral-900 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Warna</label>
                  <input v-model="form.color" type="color"  class="mt-1 h-9 rounded-md border w-full bg-white border-gray-300 dark:bg-neutral-900 dark:border-neutral-700 px-1 py-1 text-sm" />
                </div>
              </div>

              <div>
                <label class="text-xs text-gray-500 dark:text-neutral-400">Catatan</label>
                <textarea v-model.trim="form.desc" rows="3" class="mt-1 w-full rounded-md border-gray-300 border bg-white dark:bg-neutral-900 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"></textarea>
              </div>

              <div class="flex items-center justify-between pt-1">
                <label class="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" v-model="form.allDay" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  Acara sehari penuh
                </label>
                <div class="flex items-center gap-2">
                  <button v-if="modal.mode==='detail'" type="button"
                    class="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-rose-600 dark:border-neutral-700 dark:hover:bg-neutral-700"
                    @click="deleteCurrent">Hapus</button>
                  <button type="submit"
                    class="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                      <Icon v-if="saving" icon="ph:spinner" class="size-4 animate-spin" />
                      <span>{{ saving ? 'Menyimpan…' : (modal.mode==='create' ? 'Simpan' : 'Update') }}</span>
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { computed, onMounted, reactive, ref,  watchEffect } from 'vue'
import { useAgenda, type AgendaItem } from '~/composables/data/useAgenda'

definePageMeta({ layout: 'app', layoutProps: { title: 'Agenda' } })

const { rows, byDate, subscribeMonth, createAgenda, updateAgenda, deleteAgenda, moveAgenda } = useAgenda()

const today = new Date()
const view = reactive({ year: today.getFullYear(), month: today.getMonth() })
const q = ref('')
const thumbFile = ref<File | null>(null)
const thumbPreview = ref<string | null>(null)

const monthTitle = computed(() => {
  const d = new Date(view.year, view.month, 1)
  return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
})
const weekdayNames = ['Min','Sen','Sel','Rab','Kam','Jum','Sab']

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function startOfMonthOffset(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}
function toISODate(y:number, m:number, d:number) {
  return new Date(y, m, d).toISOString().slice(0,10)
}
function onPickThumb(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0] || null
  thumbFile.value = f
  thumbPreview.value = f ? URL.createObjectURL(f) : null
}
function clearThumb() {
  thumbFile.value = null
  thumbPreview.value = null
}
const currentISO = toISODate(today.getFullYear(), today.getMonth(), today.getDate())

const monthCells = computed(() => {
  const y = view.year, m = view.month
  const dim = daysInMonth(y, m)
  const startOffset = startOfMonthOffset(y, m)
  const prevDim = daysInMonth(y, m - 1)
  const cells: Array<{ key:string; dateISO:string; outside:boolean }> = []
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = prevDim - i
    const dateISO = toISODate(y, m - 1, d)
    cells.push({ key: 'p'+d, dateISO, outside: true })
  }
  for (let d = 1; d <= dim; d++) {
    const dateISO = toISODate(y, m, d)
    cells.push({ key: 'c'+d, dateISO, outside: false })
  }
  while (cells.length % 7 !== 0) {
    const idx = cells.length - (startOffset + dim)
    const dateISO = toISODate(y, m + 1, idx + 1)
    cells.push({ key: 'n'+(idx+1), dateISO, outside: true })
  }
  while (cells.length < 42) {
    const idx = cells.length - (startOffset + dim)
    const dateISO = toISODate(y, m + 1, idx + 1)
    cells.push({ key: 'n2'+(idx+1), dateISO, outside: true })
  }

  if (!q.value) return cells
  const isMatchDate = (iso: string) => (byDate.value.get(iso) || []).some(a =>
    (a.title||'').toLowerCase().includes(q.value.toLowerCase()) ||
    (a.desc||'').toLowerCase().includes(q.value.toLowerCase()) ||
    (a.location||'').toLowerCase().includes(q.value.toLowerCase())
  )
  return cells.filter(c => isMatchDate(c.dateISO))
})

function isToday(iso: string) { return iso === currentISO }
function dayOfMonth(iso: string) { return Number(iso.slice(-2)) }
function prettyDate(iso: string) {
  const d = new Date(iso); return d.toLocaleDateString('id-ID', { weekday:'short', day:'2-digit', month:'short' })
}
function eventsOf(iso: string) { return (byDate.value.get(iso) || []) as AgendaItem[] }
function aTime(a: AgendaItem, verbose = false) {
  const hasTime = a.start.includes('T')
  if (!hasTime || a.allDay) return verbose ? 'Seharian' : ''
  const t = a.start.slice(11, 16)
  return verbose ? t : t
}

function prevMonth() {
  if (view.month === 0) { view.month = 11; view.year -= 1 } else view.month -= 1
}
function nextMonth() {
  if (view.month === 11) { view.month = 0; view.year += 1 } else view.month += 1
}
function goToday() {
  view.year = today.getFullYear(); view.month = today.getMonth()
}

const ctx = reactive<{ open:boolean; x:number; y:number; dateISO:string; agenda:AgendaItem|null; moveTo:string }>(
  { open:false, x:0, y:0, dateISO: currentISO, agenda:null, moveTo:'' }
)
function openContextMenu(e: MouseEvent, dateISO: string, agenda?: AgendaItem) {
  closeContext()
  ctx.open = true
  ctx.x = e.clientX + 2
  ctx.y = e.clientY + 2
  ctx.dateISO = dateISO
  ctx.agenda = agenda || null
  ctx.moveTo = dateISO
  window.addEventListener('click', closeContext, { once: true })
}
function closeContext() { ctx.open = false }

const modal = reactive<{ open:boolean; mode:'create'|'detail'; currentId?:string }>(
  { open:false, mode:'create', currentId: undefined }
)
const form = reactive<{ title:string; desc:string; start:string; end:string; allDay:boolean; color:string; location:string }>(
  { title:'', desc:'', start:'', end:'', allDay:false, color:'#3b82f6', location:'' }
)

function resetForm() {
  form.title=''; form.desc=''; form.start=''; form.end=''; form.allDay=false; form.color='#3b82f6'; form.location=''
}
function openCreateForDate(dateISO: string) {
  closeContext()
  resetForm()
  clearThumb()
  form.start = dateISO + 'T08:00'
  form.end   = dateISO + 'T09:00'
  modal.mode = 'create'
  modal.currentId = undefined
  modal.open = true
}
function openDetail(a: AgendaItem) {
  closeContext()
  modal.mode = 'detail'
  modal.currentId = a.id
  form.title = a.title
  form.desc  = a.desc || ''
  form.start = a.start.includes('T') ? a.start.slice(0,16) : a.start + 'T08:00'
  form.end   = a.end?.includes('T') ? a.end.slice(0,16) : (a.end ? a.end + 'T09:00' : '')
  form.allDay= !!a.allDay
  form.color = a.color || '#3b82f6'
  form.location = a.location || ''
  modal.open = true
  thumbPreview.value = a.thumbUrl || null
  thumbFile.value = null
}
function closeModal() { modal.open = false }
const saving = ref(false)

async function saveModal() {
  if (saving.value) return
  saving.value = true
  try {
    if (modal.mode === 'create') {
      await createAgenda({
        title: form.title,
        desc: form.desc,
        start: form.start || (currentISO + 'T08:00'),
        end: form.end || undefined,
        allDay: form.allDay,
        color: form.color,
        location: form.location,
        thumbnailFile: thumbFile.value || null
      })
    } else if (modal.mode === 'detail' && modal.currentId) {
      await updateAgenda(modal.currentId, {
        title: form.title,
        desc: form.desc,
        start: form.start,
        end: form.end || undefined,
        allDay: form.allDay,
        color: form.color,
        location: form.location,
        thumbnailFile: thumbFile.value || undefined
      })
    }
    modal.open = false
    thumbFile.value = null
    thumbPreview.value = null
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}

async function deleteCurrent() {
  if (!modal.currentId) return
  if (confirm('Hapus agenda ini?')) {
    await deleteAgenda(modal.currentId)
    modal.open = false
  }
}

function createFromContext() { openCreateForDate(ctx.dateISO) }
function editFromContext()   { if (ctx.agenda) openDetail(ctx.agenda) }
async function deleteFromContext() { if (ctx.agenda && confirm('Hapus agenda ini?')) await deleteAgenda(ctx.agenda.id); closeContext() }
async function moveFromContext()   { if (ctx.agenda && ctx.moveTo) await moveAgenda(ctx.agenda.id, ctx.moveTo); closeContext() }


watchEffect(() => {
  subscribeMonth(view.year, view.month)
})

onMounted(() => {
  // Preline auto init if needed
  // @ts-ignore
  window.HSStaticMethods?.autoInit?.()
})
</script>
