<template>
  <div class="p-4 rounded-xl border border-gray-200 bg-white shadow-xs dark:bg-neutral-800 dark:border-neutral-700">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
      <h3 class="font-semibold text-gray-800 dark:text-neutral-100">{{ title }}</h3>

      <div class="flex items-center flex-wrap gap-2">
        <slot name="toolbar-left"></slot>

        <template v-if="showPageSize">
          <label class="text-xs text-gray-500 dark:text-neutral-400">Tampilkan</label>
          <select v-model="pageSize" class="px-2 py-1 text-xs rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
            <option v-for="n in pageSizeOptionsSafe" :key="n" :value="n">{{ n }}</option>
          </select>
        </template>

        <div v-if="showSearch" class="relative">
          <input
            v-model="q"
            type="search"
            placeholder="Cari..."
            class="pl-8 pr-8 py-1.5 w-56 text-xs rounded-md border border-gray-200 bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200"
          />
          <Icon icon="lucide:search" class="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <button
            v-if="q"
            @click="q=''"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <Icon icon="lucide:x" class="size-4" />
          </button>
        </div>

        <slot name="toolbar-right"></slot>
      </div>
    </div>

    <!-- TABLE (sm+) -->
    <div class="hidden sm:block overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="text-left text-gray-500 dark:text-neutral-400">
            <th v-if="selectable" class="px-3 py-2 w-10">
              <input type="checkbox" :checked="allChecked" @change="toggleAll" />
            </th>

            <th
              v-for="c in columns"
              :key="c.key"
              class="px-3 py-2 cursor-pointer select-none whitespace-nowrap"
              @click="sort(c)"
            >
              <div class="inline-flex items-center gap-1">
                <slot :name="`head-${c.key}`">{{ c.label }}</slot>
                <Icon v-if="sortKey === c.key" :icon="asc ? 'lucide:chevron-up' : 'lucide:chevron-down'" width="14" height="14" />
              </div>
            </th>

            <th v-if="showActions" class="px-3 py-2 whitespace-nowrap">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="row in paged"
            :key="rowKeySafe(row)"
            class="border-t border-gray-100 dark:border-neutral-700 hover:bg-gray-50/60 dark:hover:bg-neutral-800/60"
          >
            <td v-if="selectable" class="px-3 py-2">
              <input type="checkbox" v-model="selectedIds" :value="rowKeySafe(row)" />
            </td>

            <td v-for="c in columns" :key="c.key" class="px-3 py-2 whitespace-nowrap">
              <slot :name="`cell-${c.key}`" :row="row">{{ row[c.key] }}</slot>
            </td>

            <td v-if="showActions" class="px-3 py-2">
              <slot name="cell-action" :row="row">
                <button class="text-xs px-2 py-1 rounded border hover:bg-gray-50 dark:hover:bg-neutral-800">Detail</button>
              </slot>
            </td>
          </tr>

          <tr v-if="!paged.length">
            <td :colspan="columns.length + (selectable ? 1 : 0) + (showActions ? 1 : 0)" class="px-3 py-6 text-center text-gray-500 dark:text-neutral-400">
              Tidak ada data
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- CARD LIST (HP) -->
    <div class="sm:hidden space-y-3">
      <div
        v-for="row in paged"
        :key="rowKeySafe(row)"
        class="rounded-lg border border-gray-200 bg-white p-3 dark:bg-neutral-900 dark:border-neutral-700"
      >
        <!-- header kartu: nama & wali + checkbox (opsional) -->
        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="font-medium text-gray-800 dark:text-neutral-100">
              <slot name="cell-santri" :row="row">
                {{ row.santri ?? '—' }}
              </slot>
            </div>
            <div class="text-xs text-gray-500 dark:text-neutral-400">
              <slot name="cell-walisantri" :row="row">
                {{ row.walisantri ?? '—' }}
              </slot>
            </div>
          </div>
          <div v-if="selectable" class="shrink-0 pt-0.5">
            <input type="checkbox" v-model="selectedIds" :value="rowKeySafe(row)" />
          </div>
        </div>

        <!-- label–value kolom penting -->
        <div class="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
          <template v-for="c in mobileCols" :key="c.key">
            <div class="text-[11px] text-gray-500 dark:text-neutral-400">{{ c.label }}</div>
            <div class="text-sm text-gray-800 dark:text-neutral-100 break-words">
              <slot :name="`cell-${c.key}`" :row="row">{{ row[c.key] ?? '—' }}</slot>
            </div>
          </template>
        </div>

        <!-- ⬇️ TOMBOL AKSI DI MOBILE -->
        <div v-if="showActions" class="mt-3 flex flex-wrap gap-2">
          <slot name="cell-action" :row="row">
            <button class="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
              Detail
            </button>
          </slot>
        </div>
      </div>

      <div v-if="!paged.length" class="text-center text-sm text-gray-500 dark:text-neutral-400 py-6">
        Tidak ada data
      </div>
    </div>

    <!-- Pager -->
    <div class="flex items-center justify-between mt-4 text-xs text-gray-600 dark:text-neutral-400">
      <span>Menampilkan {{ paged.length ? start + 1 : 0 }}–{{ Math.min(end, filtered.length) }} dari {{ filtered.length }}</span>
      <div class="flex items-center gap-1">
        <button
          class="px-2 py-1 rounded border border-gray-200 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50"
          :disabled="page===1"
          @click="page--"
        >
          Prev
        </button>
        <span class="px-2">Hal {{ totalPages ? page : 0 }}/{{ totalPages || 1 }}</span>
        <button
          class="px-2 py-1 rounded border border-gray-200 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50"
          :disabled="page===totalPages || !totalPages"
          @click="page++"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, ref, watch } from 'vue'

type Column = { key: string; label: string; sortable?: boolean }

const props = defineProps<{
  title: string
  rows: any[]
  columns: Column[]
  rowKey?: (row: any) => string|number

  /* opsi UI */
  selectable?: boolean
  showActions?: boolean
  showSearch?: boolean
  showPageSize?: boolean
  pageSizeOptions?: number[]

  /* integrasi selection (opsional) */
  selection?: Array<string|number>

  /* custom filter client-side (opsional) */
  clientFilter?: (row: any, q: string) => boolean

  /* kolom yang ditampilkan di HP (label–value) */
  mobileKeys?: string[]
}>()

const emit = defineEmits<{
  (e: 'update:selection', v: Array<string|number>): void
}>()

/* defaults */
const selectable = computed(() => props.selectable ?? true)
const showActions = computed(() => props.showActions ?? true)
const showSearch  = computed(() => props.showSearch  ?? true)
const showPageSize= computed(() => props.showPageSize?? true)
const pageSizeOptionsSafe = computed(() => (props.pageSizeOptions?.length ? props.pageSizeOptions : [5,10,20,50]))

/* state */
const q = ref('')
const page = ref(1)
const pageSize = ref(pageSizeOptionsSafe.value[1] || 10)
const sortKey = ref<string | null>(null)
const asc = ref(true)
const selectedIds = ref<Array<string|number>>((props.selection ?? []).slice())

const rowKeySafe = (row: any) => props.rowKey?.(row) ?? row.id ?? JSON.stringify(row)

/* sync selection (v-model:selection) */
watch(() => props.selection, v => { if (v) selectedIds.value = v.slice() }, { immediate: true })
watch(selectedIds, v => emit('update:selection', v))

/* reset halaman saat data / filter berubah */
watch([() => props.rows, q, pageSize], () => {
  page.value = 1
  const keys = new Set(props.rows.map(rowKeySafe))
  selectedIds.value = selectedIds.value.filter(id => keys.has(id))
})

/* filter */
const filtered = computed(() => {
  const s = q.value.trim().toLowerCase()
  if (!s) return props.rows
  if (props.clientFilter) return props.rows.filter(r => props.clientFilter!(r, s))
  return props.rows.filter(r => JSON.stringify(r).toLowerCase().includes(s))
})

/* sort */
const sorted = computed(() => {
  if (!sortKey.value) return filtered.value
  const arr = [...filtered.value]
  arr.sort((a, b) => {
    const A = a[sortKey.value as string]
    const B = b[sortKey.value as string]
    if (A === B) return 0
    return (A > B ? 1 : -1) * (asc.value ? 1 : -1)
  })
  return arr
})

/* paging */
const totalPages = computed(() => Math.ceil(sorted.value.length / pageSize.value))
const start = computed(() => (page.value - 1) * pageSize.value)
const end = computed(() => start.value + pageSize.value)
const paged = computed(() => sorted.value.slice(start.value, end.value))

/* header select all */
const allChecked = computed(() => {
  if (!selectable.value || !paged.value.length) return false
  const keys = paged.value.map(rowKeySafe)
  return keys.every(k => selectedIds.value.includes(k))
})

function sort(c: Column) {
  if (!c.sortable) return
  if (sortKey.value === c.key) asc.value = !asc.value
  else { sortKey.value = c.key; asc.value = true }
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
    selectedIds.value = selectedIds.value.filter(id => !remove.has(id))
  }
}

/* mobile visible cols */
const mobileCols = computed<Column[]>(() => {
  const want = props.mobileKeys && props.mobileKeys.length
    ? props.columns.filter(c => props.mobileKeys!.includes(c.key))
    : props.columns.filter(c => !['gen','status'].includes(c.key)).slice(0, 4)
  return want
})
</script>
