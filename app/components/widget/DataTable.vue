<template>
  <div class="relative isolate w-full min-w-0 max-w-full overflow-visible rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
    <div class="border-b border-gray-100 bg-white/90 p-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <div class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
              <Icon icon="lucide:table-2" class="size-5" />
            </div>

            <div class="min-w-0">
              <h3 class="truncate text-base font-extrabold tracking-tight text-gray-900 dark:text-white">
                {{ title }}
              </h3>
              <p class="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                {{ filtered.length }} data ditemukan
              </p>
            </div>
          </div>
        </div>

        <div class="flex min-w-0 flex-wrap items-center gap-2">
          <slot name="toolbar-left"></slot>

          <template v-if="showPageSize">
            <div class="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800">
              <span class="text-xs font-medium text-gray-500 dark:text-neutral-400">Tampilkan</span>
              <select
                v-model.number="pageSize"
                class="bg-transparent text-xs font-semibold text-gray-700 outline-none dark:text-neutral-200"
              >
                <option v-for="n in pageSizeOptionsSafe" :key="n" :value="n">
                  {{ n }}
                </option>
              </select>
            </div>
          </template>

          <div v-if="showSearch" class="relative">
            <input
              v-model="q"
              type="search"
              placeholder="Cari data..."
              class="h-10 w-full max-w-full rounded-2xl border border-gray-200 bg-gray-50 pl-10 pr-10 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 sm:w-64 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:bg-neutral-900"
            />
            <Icon
              icon="lucide:search"
              class="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400"
            />
            <button
              v-if="q"
              type="button"
              @click="q = ''"
              class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
            >
              <Icon icon="lucide:x" class="size-4" />
            </button>
          </div>

          <div v-if="showExport" class="relative">
            <button
              ref="exportButtonRef"
              type="button"
              @click="toggleExportMenu"
              class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <Icon icon="lucide:download" class="size-4" />
              Export
              <Icon icon="lucide:chevron-down" class="size-4" />
            </button>

            <Teleport to="body">
              <div
                v-if="showExportMenu"
                :style="exportMenuStyle"
                class="fixed z-[9999] w-44 overflow-hidden rounded-2xl border border-gray-200 bg-white p-1 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900"
              >
                <button
                  type="button"
                  @click="exportCsv"
                  class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <Icon icon="lucide:file-text" class="size-4" />
                  CSV
                </button>

                <button
                  type="button"
                  @click="exportExcel"
                  class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <Icon icon="lucide:file-spreadsheet" class="size-4" />
                  Excel
                </button>

                <button
                  type="button"
                  @click="exportPdf"
                  class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <Icon icon="lucide:file-down" class="size-4" />
                  PDF
                </button>
              </div>
            </Teleport>
          </div>

          <slot name="toolbar-right"></slot>
        </div>
      </div>
    </div>

    <div class="hidden min-w-0 max-w-full sm:block">
      <div class="datatable-scroll w-full max-w-full overflow-x-auto overflow-y-visible overscroll-x-contain">
        <table class="w-max min-w-full table-auto text-sm">
          <thead class="sticky top-0 z-10 bg-gray-50 text-gray-500 dark:bg-neutral-950 dark:text-neutral-400">
            <tr class="text-left">
              <th v-if="selectable" class="sticky left-0 z-20 w-12 bg-gray-50 px-4 py-3 dark:bg-neutral-950">
                <input
                  type="checkbox"
                  :checked="allChecked"
                  class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  @change="toggleAll"
                />
              </th>

              <th
                v-for="c in columns"
                :key="c.key"
                class="whitespace-nowrap px-4 py-3 text-xs font-extrabold uppercase tracking-[0.14em]"
                :class="c.sortable ? 'cursor-pointer select-none hover:text-green-700 dark:hover:text-green-300' : ''"
                @click="sort(c)"
              >
                <div class="inline-flex items-center gap-1.5">
                  <slot :name="`head-${c.key}`">{{ c.label }}</slot>

                  <template v-if="c.sortable">
                    <Icon
                      v-if="sortKey === c.key"
                      :icon="asc ? 'lucide:chevron-up' : 'lucide:chevron-down'"
                      class="size-4"
                    />
                    <Icon
                      v-else
                      icon="lucide:chevrons-up-down"
                      class="size-3.5 opacity-40"
                    />
                  </template>
                </div>
              </th>

              <th
                v-if="showActions"
                class="sticky right-0 z-20 whitespace-nowrap bg-gray-50 px-4 py-3 text-xs font-extrabold uppercase tracking-[0.14em] dark:bg-neutral-950"
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="row in paged"
              :key="rowKeySafe(row)"
              class="border-t border-gray-100 transition hover:bg-green-50/40 dark:border-neutral-800 dark:hover:bg-green-900/10"
            >
              <td
                v-if="selectable"
                class="sticky left-0 z-10 bg-white px-4 py-3 dark:bg-neutral-900"
              >
                <input
                  type="checkbox"
                  v-model="selectedIds"
                  :value="rowKeySafe(row)"
                  class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </td>

              <td
                v-for="c in columns"
                :key="c.key"
                class="max-w-[320px] whitespace-nowrap px-4 py-3 text-gray-700 dark:text-neutral-200"
              >
                <div class="truncate max-w-[300px]">
                  <slot :name="`cell-${c.key}`" :row="row">
                    {{ row[c.key] ?? '—' }}
                  </slot>
                </div>
              </td>

              <td
                v-if="showActions"
                class="sticky right-0 z-10 bg-white px-4 py-3 dark:bg-neutral-900"
              >
                <slot name="cell-action" :row="row">
                  <button class="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold transition hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
                    Detail
                  </button>
                </slot>
              </td>
            </tr>

            <tr v-if="!paged.length">
              <td
                :colspan="columns.length + (selectable ? 1 : 0) + (showActions ? 1 : 0)"
                class="px-4 py-12 text-center"
              >
                <div class="mx-auto grid max-w-sm place-items-center">
                  <div class="grid h-14 w-14 place-items-center rounded-2xl bg-gray-50 text-gray-400 dark:bg-neutral-800">
                    <Icon icon="lucide:database-x" class="size-7" />
                  </div>
                  <p class="mt-3 text-sm font-semibold text-gray-700 dark:text-neutral-200">
                    Tidak ada data
                  </p>
                  <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                    Coba ubah filter atau kata pencarian.
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="sorted.length" class="border-t border-gray-100 bg-gray-50/70 px-4 py-2 text-xs text-gray-500 dark:border-neutral-800 dark:bg-neutral-950/60 dark:text-neutral-400">
        Geser horizontal untuk melihat kolom yang terlalu lebar.
      </div>
    </div>

    <!-- Mobile Card List -->
    <div class="space-y-3 p-4 sm:hidden">
      <div
        v-for="row in paged"
        :key="rowKeySafe(row)"
        class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="font-bold text-gray-900 dark:text-white">
              <slot name="cell-santri" :row="row">
                {{ row.displayName ?? row.name ?? row.santri ?? row.title ?? 'Data' }}
              </slot>
            </div>

            <div class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
              <slot name="cell-walisantri" :row="row">
                {{ row.email ?? row.walisantri ?? row.role ?? '—' }}
              </slot>
            </div>
          </div>

          <div v-if="selectable" class="shrink-0 pt-1">
            <input
              type="checkbox"
              v-model="selectedIds"
              :value="rowKeySafe(row)"
              class="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
          </div>
        </div>

        <div class="mt-4 grid grid-cols-[0.8fr,1.2fr] gap-x-3 gap-y-2">
          <template v-for="c in mobileCols" :key="c.key">
            <div class="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-neutral-500">
              {{ c.label }}
            </div>
            <div class="break-words text-sm font-medium text-gray-800 dark:text-neutral-100">
              <slot :name="`cell-${c.key}`" :row="row">
                {{ row[c.key] ?? '—' }}
              </slot>
            </div>
          </template>
        </div>

        <div v-if="showActions" class="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-3 dark:border-neutral-800">
          <slot name="cell-action" :row="row">
            <button class="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold transition hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
              Detail
            </button>
          </slot>
        </div>
      </div>

      <div v-if="!paged.length" class="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-neutral-700 dark:text-neutral-400">
        Tidak ada data
      </div>
    </div>

    <!-- Pager -->
    <div class="flex flex-col gap-3 border-t border-gray-100 bg-white px-4 py-4 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
      <div>
        Menampilkan
        <span class="font-bold text-gray-900 dark:text-white">
          {{ paged.length ? start + 1 : 0 }}–{{ Math.min(end, sorted.length) }}
        </span>
        dari
        <span class="font-bold text-gray-900 dark:text-white">{{ sorted.length }}</span>
        data
      </div>

      <div class="flex items-center justify-between gap-2 sm:justify-end">
        <button
          class="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 font-semibold transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          :disabled="page === 1"
          @click="page--"
        >
          <Icon icon="lucide:chevron-left" class="size-4" />
          Prev
        </button>

        <span class="rounded-xl bg-gray-50 px-3 py-2 font-semibold dark:bg-neutral-800">
          Hal {{ totalPages ? page : 0 }}/{{ totalPages || 1 }}
        </span>

        <button
          class="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 font-semibold transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          :disabled="page === totalPages || !totalPages"
          @click="page++"
        >
          Next
          <Icon icon="lucide:chevron-right" class="size-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

type Column = {
  key: string
  label: string
  sortable?: boolean
}

type RowKey = string | number

const props = withDefaults(defineProps<{
  title: string
  rows: any[]
  columns: Column[]
  rowKey?: (row: any) => RowKey
  selectable?: boolean
  showActions?: boolean
  showSearch?: boolean
  showPageSize?: boolean
  showExport?: boolean
  exportFilename?: string
  pageSizeOptions?: number[]
  selection?: RowKey[]
  clientFilter?: (row: any, q: string) => boolean
  mobileKeys?: string[]
}>(), {
  selectable: true,
  showActions: true,
  showSearch: true,
  showPageSize: true,
  showExport: true,
  exportFilename: 'data-table'
})

const emit = defineEmits<{
  (e: 'update:selection', v: RowKey[]): void
}>()

const selectable = computed(() => props.selectable)
const showActions = computed(() => props.showActions)
const showSearch = computed(() => props.showSearch)
const showPageSize = computed(() => props.showPageSize)
const showExport = computed(() => props.showExport)

const pageSizeOptionsSafe = computed(() => {
  return props.pageSizeOptions?.length ? props.pageSizeOptions : [5, 10, 20, 50, 100]
})

const q = ref('')
const page = ref(1)
const pageSize = ref(pageSizeOptionsSafe.value[1] || 10)
const sortKey = ref<string | null>(null)
const asc = ref(true)
const selectedIds = ref<RowKey[]>((props.selection ?? []).slice())
const showExportMenu = ref(false)

const exportButtonRef = ref<HTMLButtonElement | null>(null)

const exportMenuTop = ref(0)
const exportMenuLeft = ref(0)

const exportMenuStyle = computed(() => ({
  top: `${exportMenuTop.value}px`,
  left: `${exportMenuLeft.value}px`
}))

function updateExportMenuPosition() {
  const button = exportButtonRef.value
  if (!button) return

  const rect = button.getBoundingClientRect()
  const menuWidth = 176
  const gap = 8

  exportMenuTop.value = rect.bottom + gap
  exportMenuLeft.value = Math.max(12, rect.right - menuWidth)
}

function toggleExportMenu() {
  showExportMenu.value = !showExportMenu.value

  if (showExportMenu.value) {
    updateExportMenuPosition()
  }
}

function closeExportMenu() {
  showExportMenu.value = false
}

function onGlobalClick(event: MouseEvent) {
  const target = event.target as Node
  const button = exportButtonRef.value

  if (button && button.contains(target)) return

  closeExportMenu()
}

onMounted(() => {
  window.addEventListener('scroll', updateExportMenuPosition, true)
  window.addEventListener('resize', updateExportMenuPosition)
  window.addEventListener('click', onGlobalClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateExportMenuPosition, true)
  window.removeEventListener('resize', updateExportMenuPosition)
  window.removeEventListener('click', onGlobalClick)
})

const rowKeySafe = (row: any): RowKey => {
  return props.rowKey?.(row) ?? row.id ?? row.uid ?? row.key ?? JSON.stringify(row)
}

watch(
  () => props.selection,
  (v) => {
    if (v) selectedIds.value = v.slice()
  },
  { immediate: true }
)

watch(selectedIds, (v) => emit('update:selection', v))

watch([() => props.rows, q, pageSize], () => {
  page.value = 1
  const keys = new Set(props.rows.map(rowKeySafe))
  selectedIds.value = selectedIds.value.filter((id) => keys.has(id))
})

const filtered = computed(() => {
  const s = q.value.trim().toLowerCase()

  if (!s) return props.rows

  if (props.clientFilter) {
    return props.rows.filter((row) => props.clientFilter!(row, s))
  }

  return props.rows.filter((row) => {
    return props.columns.some((column) => {
      const value = row[column.key]
      return String(value ?? '').toLowerCase().includes(s)
    })
  })
})

const sorted = computed(() => {
  if (!sortKey.value) return filtered.value

  const arr = [...filtered.value]

  arr.sort((a, b) => {
    const A = normalizeSortValue(a[sortKey.value as string])
    const B = normalizeSortValue(b[sortKey.value as string])

    if (A === B) return 0
    return (A > B ? 1 : -1) * (asc.value ? 1 : -1)
  })

  return arr
})

const totalPages = computed(() => Math.ceil(sorted.value.length / pageSize.value))
const start = computed(() => (page.value - 1) * pageSize.value)
const end = computed(() => start.value + pageSize.value)
const paged = computed(() => sorted.value.slice(start.value, end.value))

const allChecked = computed(() => {
  if (!selectable.value || !paged.value.length) return false

  const keys = paged.value.map(rowKeySafe)
  return keys.every((key) => selectedIds.value.includes(key))
})

const mobileCols = computed<Column[]>(() => {
  if (props.mobileKeys?.length) {
    return props.columns.filter((column) => props.mobileKeys!.includes(column.key))
  }

  return props.columns
    .filter((column) => !['id', 'uid', 'createdAt', 'updatedAt'].includes(column.key))
    .slice(0, 5)
})

function normalizeSortValue(value: any) {
  if (value === null || value === undefined) return ''

  if (typeof value === 'number') return value

  const asNumber = Number(value)
  if (!Number.isNaN(asNumber) && String(value).trim() !== '') {
    return asNumber
  }

  return String(value).toLowerCase()
}

function sort(column: Column) {
  if (!column.sortable) return

  if (sortKey.value === column.key) {
    asc.value = !asc.value
  } else {
    sortKey.value = column.key
    asc.value = true
  }

  page.value = 1
}

function toggleAll(e: Event) {
  if (!selectable.value) return

  const checked = (e.target as HTMLInputElement).checked
  const keys = paged.value.map(rowKeySafe)

  if (checked) {
    selectedIds.value = Array.from(new Set([...selectedIds.value, ...keys]))
  } else {
    const remove = new Set(keys)
    selectedIds.value = selectedIds.value.filter((id) => !remove.has(id))
  }
}

function exportRows() {
  return sorted.value.map((row) => {
    const out: Record<string, string> = {}

    for (const column of props.columns) {
      out[column.label] = formatExportValue(row[column.key])
    }

    return out
  })
}

function formatExportValue(value: any) {
  if (value === null || value === undefined) return ''

  if (Array.isArray(value)) {
    return value.join(', ')
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}

function safeFileName(value?: string) {
  return String(value || props.exportFilename || props.title || 'data-table')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'data-table'
}

function downloadBlob(content: BlobPart, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')

  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  URL.revokeObjectURL(url)
}

function csvEscape(value: string) {
  const text = String(value ?? '')
  return `"${text.replace(/"/g, '""')}"`
}

function exportCsv() {
  showExportMenu.value = false

  const rows = exportRows()
  const headers = props.columns.map((column) => column.label)

  const csv = [
    headers.map(csvEscape).join(','),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(','))
  ].join('\n')

  downloadBlob(
    `\uFEFF${csv}`,
    `${safeFileName()}.csv`,
    'text/csv;charset=utf-8;'
  )
}
</script>

<style scoped>
.datatable-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgb(34 197 94) rgb(243 244 246);
}

.datatable-scroll::-webkit-scrollbar {
  height: 10px;
}

.datatable-scroll::-webkit-scrollbar-track {
  background: rgb(243 244 246);
}

.datatable-scroll::-webkit-scrollbar-thumb {
  background: rgb(34 197 94);
  border-radius: 999px;
  border: 2px solid rgb(243 244 246);
}

.dark .datatable-scroll {
  scrollbar-color: rgb(34 197 94) rgb(38 38 38);
}

.dark .datatable-scroll::-webkit-scrollbar-track {
  background: rgb(38 38 38);
}

.dark .datatable-scroll::-webkit-scrollbar-thumb {
  border-color: rgb(38 38 38);
}
</style>