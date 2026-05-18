<template>
  <div
    ref="canvasWrapEl"
    class="relative h-full min-h-[520px] w-full overflow-hidden rounded-[27px] bg-white dark:bg-neutral-950"
  >
    <!-- Floating Toolbar -->
    <div class="pointer-events-none absolute left-4 top-4 z-30 flex max-w-[calc(100%-2rem)] flex-wrap items-center gap-2">
      <div class="pointer-events-auto flex items-center gap-1 rounded-2xl border border-gray-200 bg-white/90 p-1 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90">
        <button
          type="button"
          class="inline-flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-bold text-gray-700 transition hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
          @click="addRect"
        >
          <Icon icon="lucide:square" class="h-4 w-4" />
          Rect
        </button>

        <button
          type="button"
          class="inline-flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-bold text-gray-700 transition hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
          @click="addText"
        >
          <Icon icon="lucide:type" class="h-4 w-4" />
          Text
        </button>

        <button
          type="button"
          class="inline-flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-bold text-gray-700 transition hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
          @click="addImageByUrl"
        >
          <Icon icon="lucide:image-plus" class="h-4 w-4" />
          Image
        </button>
      </div>

      <div class="pointer-events-auto flex items-center gap-1 rounded-2xl border border-gray-200 bg-white/90 p-1 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90">
        <button
          type="button"
          class="inline-flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-bold text-gray-700 transition hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
          @click="saveCanvas(true)"
        >
          <Icon :icon="saving ? 'lucide:loader-2' : 'lucide:save'" class="h-4 w-4" :class="saving ? 'animate-spin' : ''" />
          Save
        </button>

        <button
          type="button"
          class="inline-flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-bold text-gray-700 transition hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
          @click="exportJson"
        >
          <Icon icon="lucide:file-json" class="h-4 w-4" />
          JSON
        </button>

        <button
          type="button"
          class="inline-flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-bold text-gray-700 transition hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
          @click="exportPng"
        >
          <Icon icon="lucide:image-down" class="h-4 w-4" />
          PNG
        </button>
      </div>
    </div>

    <!-- Canvas Info -->
    <div class="pointer-events-none absolute right-4 top-4 z-30 hidden max-w-[280px] rounded-2xl border border-gray-200 bg-white/90 px-3 py-2 text-xs shadow-sm backdrop-blur md:block dark:border-neutral-800 dark:bg-neutral-900/90">
      <div class="flex items-center gap-2 font-bold text-gray-800 dark:text-neutral-100">
        <Icon icon="lucide:route" class="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
        <span class="truncate">{{ selectedPath }}</span>
      </div>

      <div class="mt-1 flex items-center gap-2 text-gray-500 dark:text-neutral-400">
        <span>{{ activeBreakpoint }}</span>
        <span>•</span>
        <span>{{ stageConfig.width }} × {{ stageConfig.height }}</span>
        <span>•</span>
        <span>{{ saveLabel }}</span>
      </div>
    </div>

    <!-- Vue Konva Stage -->
    <v-stage
      ref="stageRef"
      :config="stageConfig"
      @mousedown="handleStagePointerDown"
      @touchstart="handleStagePointerDown"
    >
      <v-layer>
        <!-- Transparent background rect, supaya klik area kosong bisa deselect -->
        <v-rect
          :config="{
            x: 0,
            y: 0,
            width: stageConfig.width,
            height: stageConfig.height,
            fill: 'rgba(255,255,255,0)'
          }"
        />

        <!-- Starter / saved elements -->
        <template v-for="element in elements" :key="element.id">
          <v-rect
            v-if="element.type === 'rect'"
            :config="rectConfig(element)"
            @click="selectElement(element.id)"
            @tap="selectElement(element.id)"
            @dragend="handleDragEnd(element.id, $event)"
          />

          <v-text
            v-else-if="element.type === 'text'"
            :config="textConfig(element)"
            @click="selectElement(element.id)"
            @tap="selectElement(element.id)"
            @dblclick="editText(element.id)"
            @dbltap="editText(element.id)"
            @dragend="handleDragEnd(element.id, $event)"
          />

          <template v-else-if="element.type === 'image'">
            <v-image
              v-if="imageCache[element.id]"
              :config="imageConfig(element)"
              @click="selectElement(element.id)"
              @tap="selectElement(element.id)"
              @dragend="handleDragEnd(element.id, $event)"
            />

            <v-rect
              v-else
              :config="imagePlaceholderConfig(element)"
              @click="selectElement(element.id)"
              @tap="selectElement(element.id)"
              @dragend="handleDragEnd(element.id, $event)"
            />

            <v-text
              v-if="!imageCache[element.id]"
              :config="{
                x: element.x + 18,
                y: element.y + 18,
                text: 'Loading image...',
                fontSize: 14,
                fill: '#6b7280',
                listening: false
              }"
            />
          </template>
        </template>

        <!-- Selection Box -->
        <v-rect
          v-if="selectedBox"
          :config="{
            x: selectedBox.x,
            y: selectedBox.y,
            width: selectedBox.width,
            height: selectedBox.height,
            stroke: '#16a34a',
            strokeWidth: 2,
            dash: [8, 6],
            listening: false
          }"
        />
      </v-layer>
    </v-stage>

    <!-- Empty State -->
    <div
      v-if="!elements.length"
      class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
    >
      <div class="max-w-sm rounded-[28px] border border-dashed border-gray-300 bg-white/85 px-6 py-5 text-center shadow-sm backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/85">
        <div class="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300">
          <Icon icon="lucide:pen-tool" class="h-6 w-6" />
        </div>

        <p class="mt-4 text-sm font-black text-gray-900 dark:text-white">
          Canvas masih kosong
        </p>

        <p class="mt-1 text-xs leading-5 text-gray-500 dark:text-neutral-400">
          Tambahkan text, shape, atau image dari toolbar kiri atas.
        </p>
      </div>
    </div>

    <!-- Properties Mini Panel -->
    <div
      v-if="selectedElement"
      class="absolute bottom-4 right-4 z-40 w-[min(340px,calc(100%-2rem))] overflow-hidden rounded-[28px] border border-gray-200 bg-white/95 shadow-2xl backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95"
    >
      <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
        <div class="min-w-0">
          <p class="truncate text-sm font-black text-gray-900 dark:text-white">
            {{ selectedElement.name || selectedElement.type }}
          </p>
          <p class="text-xs text-gray-500 dark:text-neutral-400">
            {{ selectedElement.type }} • {{ selectedElement.id }}
          </p>
        </div>

        <button
          type="button"
          class="grid h-9 w-9 place-items-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
          @click="selectedId = null"
        >
          <Icon icon="lucide:x" class="h-4 w-4" />
        </button>
      </div>

      <div class="space-y-3 p-4">
        <div class="grid grid-cols-2 gap-3">
          <label class="space-y-1">
            <span class="text-xs font-bold text-gray-500 dark:text-neutral-400">X</span>
            <input
              v-model.number="selectedElement.x"
              type="number"
              class="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
            />
          </label>

          <label class="space-y-1">
            <span class="text-xs font-bold text-gray-500 dark:text-neutral-400">Y</span>
            <input
              v-model.number="selectedElement.y"
              type="number"
              class="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
            />
          </label>

          <label class="space-y-1">
            <span class="text-xs font-bold text-gray-500 dark:text-neutral-400">Width</span>
            <input
              v-model.number="selectedElement.width"
              type="number"
              class="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
            />
          </label>

          <label class="space-y-1">
            <span class="text-xs font-bold text-gray-500 dark:text-neutral-400">Height</span>
            <input
              v-model.number="selectedElement.height"
              type="number"
              class="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
            />
          </label>
        </div>

        <label v-if="selectedElement.type !== 'image'" class="flex items-center justify-between gap-3">
          <span class="text-xs font-bold text-gray-500 dark:text-neutral-400">Color</span>
          <input
            v-model="selectedElement.fill"
            type="color"
            class="h-10 w-16 rounded-xl border border-gray-200 bg-transparent dark:border-neutral-700"
          />
        </label>

        <label v-if="selectedElement.type === 'text'" class="space-y-1">
          <span class="text-xs font-bold text-gray-500 dark:text-neutral-400">Text</span>
          <textarea
            v-model="selectedElement.text"
            rows="3"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
          ></textarea>
        </label>

        <label v-if="selectedElement.type === 'text'" class="space-y-1">
          <span class="text-xs font-bold text-gray-500 dark:text-neutral-400">Font Size</span>
          <input
            v-model.number="selectedElement.fontSize"
            type="number"
            class="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
          />
        </label>

        <label v-if="selectedElement.type === 'image'" class="space-y-1">
          <span class="text-xs font-bold text-gray-500 dark:text-neutral-400">Image URL</span>
          <input
            v-model.trim="selectedElement.url"
            type="url"
            class="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
            @change="reloadImage(selectedElement)"
          />
        </label>

        <div class="flex items-center justify-end gap-2 border-t border-gray-200 pt-3 dark:border-neutral-800">
          <button
            type="button"
            class="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            @click="duplicateSelected"
          >
            <Icon icon="lucide:copy" class="h-4 w-4" />
            Duplicate
          </button>

          <button
            type="button"
            class="inline-flex h-10 items-center gap-2 rounded-xl bg-rose-600 px-3 text-xs font-bold text-white transition hover:bg-rose-700"
            @click="deleteSelected"
          >
            <Icon icon="lucide:trash-2" class="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div
      v-if="toast"
      class="absolute bottom-4 left-4 z-50 rounded-2xl border border-gray-200 bg-white/95 px-4 py-3 text-sm font-bold text-gray-800 shadow-lg backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95 dark:text-neutral-100"
    >
      {{ toast }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute, useRuntimeConfig } from '#imports'
import { useWeb } from '~/composables/data/useWeb'

type BreakpointKey = 'desktop' | 'tablet' | 'mobile'
type ElementType = 'rect' | 'text' | 'image'

type CanvasElement = {
  id: string
  type: ElementType
  name?: string
  x: number
  y: number
  width: number
  height: number
  fill?: string
  text?: string
  fontSize?: number
  fontFamily?: string
  fontStyle?: string
  cornerRadius?: number
  url?: string
  opacity?: number
}

const route = useRoute()
const config = useRuntimeConfig()
const web = useWeb() as any

const canvasWrapEl = ref<HTMLElement | null>(null)
const stageRef = ref<any>(null)

const elements = ref<CanvasElement[]>([])
const selectedId = ref<string | null>(null)
const saving = ref(false)
const toast = ref('')
const saveLabel = ref('Ready')
const hydrated = ref(false)

const imageCache = reactive<Record<string, HTMLImageElement | null>>({})

let resizeObserver: ResizeObserver | null = null
let saveTimer: ReturnType<typeof setTimeout> | null = null
let toastTimer: ReturnType<typeof setTimeout> | null = null

const stageConfig = reactive({
  width: 900,
  height: 560
})

const selectedPath = computed(() => {
  const fromRoute = String(route.query.path || web?.currentPath?.value || '/')
  return normalizePath(fromRoute)
})

const tenantName = computed(() => {
  return String(
    config.public.clientName ||
    config.public.tenant ||
    config.public.siteName ||
    'obayan'
  ).toLowerCase()
})

const activeBreakpoint = computed<BreakpointKey>(() => {
  if (stageConfig.width <= 520) return 'mobile'
  if (stageConfig.width <= 920) return 'tablet'
  return 'desktop'
})

const storageKey = computed(() => {
  return `obayan:editor-canvas:${tenantName.value}:${selectedPath.value}:${activeBreakpoint.value}`
})

const selectedElement = computed<CanvasElement | null>(() => {
  return elements.value.find((item) => item.id === selectedId.value) || null
})

const selectedBox = computed(() => {
  const item = selectedElement.value
  if (!item) return null

  const width = item.type === 'text'
    ? Math.max(item.width || 180, estimateTextWidth(item))
    : item.width

  const height = item.type === 'text'
    ? Math.max(item.height || Number(item.fontSize || 24) * 1.4, Number(item.fontSize || 24) * 1.4)
    : item.height

  return {
    x: item.x - 6,
    y: item.y - 6,
    width: width + 12,
    height: height + 12
  }
})

function normalizePath(path: string) {
  const clean = String(path || '/').trim()

  if (!clean || clean === '/') return '/'

  return `/${clean}`
    .replace(/\/+/g, '/')
    .replace(/\/$/, '')
    .toLowerCase()
}

function createId(prefix = 'el') {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function getStarterElements(): CanvasElement[] {
  const title = selectedPath.value === '/'
    ? 'Obayan Website'
    : selectedPath.value.replace('/', '').replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

  return [
    {
      id: createId('hero-bg'),
      type: 'rect',
      name: 'Hero Background',
      x: Math.max(32, stageConfig.width * 0.06),
      y: 96,
      width: Math.max(280, stageConfig.width * 0.58),
      height: 180,
      fill: '#16a34a',
      cornerRadius: 28,
      opacity: 0.95
    },
    {
      id: createId('hero-title'),
      type: 'text',
      name: 'Hero Title',
      x: Math.max(56, stageConfig.width * 0.06 + 32),
      y: 132,
      width: Math.max(220, stageConfig.width * 0.48),
      height: 50,
      text: title,
      fontSize: activeBreakpoint.value === 'mobile' ? 28 : 42,
      fontFamily: 'Inter',
      fontStyle: 'bold',
      fill: '#ffffff'
    },
    {
      id: createId('hero-subtitle'),
      type: 'text',
      name: 'Hero Subtitle',
      x: Math.max(56, stageConfig.width * 0.06 + 32),
      y: 194,
      width: Math.max(220, stageConfig.width * 0.44),
      height: 60,
      text: 'Edit canvas ini dengan drag, select, duplicate, dan save.',
      fontSize: activeBreakpoint.value === 'mobile' ? 14 : 18,
      fontFamily: 'Inter',
      fill: '#dcfce7'
    }
  ]
}

function rectConfig(item: CanvasElement) {
  return {
    x: item.x,
    y: item.y,
    width: item.width,
    height: item.height,
    fill: item.fill || '#3b82f6',
    cornerRadius: item.cornerRadius || 18,
    opacity: item.opacity ?? 1,
    draggable: true,
    shadowColor: 'rgba(15, 23, 42, 0.18)',
    shadowBlur: selectedId.value === item.id ? 14 : 8,
    shadowOffset: { x: 0, y: selectedId.value === item.id ? 8 : 4 },
    shadowOpacity: selectedId.value === item.id ? 0.28 : 0.16
  }
}

function textConfig(item: CanvasElement) {
  return {
    x: item.x,
    y: item.y,
    width: item.width,
    height: item.height,
    text: item.text || 'Text',
    fontSize: item.fontSize || 24,
    fontFamily: item.fontFamily || 'Inter',
    fontStyle: item.fontStyle || 'normal',
    fill: item.fill || '#111827',
    draggable: true,
    lineHeight: 1.2
  }
}

function imageConfig(item: CanvasElement) {
  return {
    x: item.x,
    y: item.y,
    width: item.width,
    height: item.height,
    image: imageCache[item.id],
    cornerRadius: item.cornerRadius || 20,
    draggable: true
  }
}

function imagePlaceholderConfig(item: CanvasElement) {
  return {
    x: item.x,
    y: item.y,
    width: item.width,
    height: item.height,
    fill: '#f3f4f6',
    stroke: '#d1d5db',
    strokeWidth: 1,
    cornerRadius: item.cornerRadius || 20,
    draggable: true
  }
}

function estimateTextWidth(item: CanvasElement) {
  const text = item.text || ''
  const fontSize = Number(item.fontSize || 24)

  return Math.min(
    Math.max(text.length * fontSize * 0.52, 80),
    item.width || stageConfig.width
  )
}

function selectElement(id: string) {
  selectedId.value = id
}

function handleStagePointerDown(event: any) {
  const stage = event?.target?.getStage?.()

  if (event?.target === stage) {
    selectedId.value = null
  }
}

function handleDragEnd(id: string, event: any) {
  const node = event?.target
  if (!node) return

  const target = elements.value.find((item) => item.id === id)
  if (!target) return

  target.x = Math.round(node.x())
  target.y = Math.round(node.y())

  selectedId.value = id
  scheduleSave()
}

function addRect() {
  const next: CanvasElement = {
    id: createId('rect'),
    type: 'rect',
    name: 'Rectangle',
    x: Math.max(40, Math.round(stageConfig.width * 0.12)),
    y: Math.max(60, Math.round(stageConfig.height * 0.18)),
    width: activeBreakpoint.value === 'mobile' ? 180 : 240,
    height: 130,
    fill: '#3b82f6',
    cornerRadius: 24
  }

  elements.value.push(next)
  selectedId.value = next.id
  showToast('Rectangle ditambahkan')
  scheduleSave()
}

function addText() {
  const next: CanvasElement = {
    id: createId('text'),
    type: 'text',
    name: 'Text',
    x: Math.max(40, Math.round(stageConfig.width * 0.14)),
    y: Math.max(80, Math.round(stageConfig.height * 0.24)),
    width: activeBreakpoint.value === 'mobile' ? 240 : 420,
    height: 60,
    text: 'Tulis konten di sini',
    fontSize: activeBreakpoint.value === 'mobile' ? 22 : 32,
    fontFamily: 'Inter',
    fontStyle: 'bold',
    fill: '#111827'
  }

  elements.value.push(next)
  selectedId.value = next.id
  showToast('Text ditambahkan')
  scheduleSave()
}

function addImageByUrl() {
  const url = window.prompt('Masukkan URL gambar Cloudinary / image URL:')

  if (!url) return

  const next: CanvasElement = {
    id: createId('image'),
    type: 'image',
    name: 'Image',
    x: Math.max(40, Math.round(stageConfig.width * 0.16)),
    y: Math.max(80, Math.round(stageConfig.height * 0.2)),
    width: activeBreakpoint.value === 'mobile' ? 220 : 320,
    height: activeBreakpoint.value === 'mobile' ? 160 : 220,
    url,
    cornerRadius: 24
  }

  elements.value.push(next)
  selectedId.value = next.id
  reloadImage(next)
  showToast('Image ditambahkan')
  scheduleSave()
}

function editText(id: string) {
  const target = elements.value.find((item) => item.id === id && item.type === 'text')
  if (!target) return

  const nextText = window.prompt('Edit text:', target.text || '')

  if (nextText === null) return

  target.text = nextText
  selectedId.value = id
  scheduleSave()
}

function duplicateSelected() {
  const item = selectedElement.value
  if (!item) return

  const duplicate: CanvasElement = {
    ...JSON.parse(JSON.stringify(item)),
    id: createId(item.type),
    name: `${item.name || item.type} Copy`,
    x: item.x + 24,
    y: item.y + 24
  }

  elements.value.push(duplicate)
  selectedId.value = duplicate.id

  if (duplicate.type === 'image') {
    reloadImage(duplicate)
  }

  showToast('Element diduplikasi')
  scheduleSave()
}

function deleteSelected() {
  if (!selectedId.value) return

  const targetId = selectedId.value
  elements.value = elements.value.filter((item) => item.id !== targetId)
  delete imageCache[targetId]
  selectedId.value = null
  showToast('Element dihapus')
  scheduleSave()
}

function reloadImage(item: CanvasElement) {
  if (!item.url || item.type !== 'image') return

  imageCache[item.id] = null

  const image = new window.Image()
  image.crossOrigin = 'anonymous'

  image.onload = () => {
    imageCache[item.id] = image
  }

  image.onerror = () => {
    imageCache[item.id] = null
    showToast('Gambar gagal dimuat')
  }

  image.src = item.url
}

function hydrateImages() {
  elements.value.forEach((item) => {
    if (item.type === 'image' && item.url) {
      reloadImage(item)
    }
  })
}

function scheduleSave() {
  if (!hydrated.value) return

  saveLabel.value = 'Saving...'

  if (saveTimer) {
    clearTimeout(saveTimer)
  }

  saveTimer = setTimeout(() => {
    saveCanvas(false)
  }, 500)
}

async function loadCanvas() {
  hydrated.value = false
  selectedId.value = null
  saveLabel.value = 'Loading...'

  let nextElements: CanvasElement[] | null = null

  if (process.client) {
    const raw = localStorage.getItem(storageKey.value)

    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed?.elements)) {
          nextElements = parsed.elements
        }
      } catch {
        nextElements = null
      }
    }
  }

  try {
    const remote = await $fetch<any>('/api/admin/web/editor/canvas', {
      method: 'GET',
      query: {
        path: selectedPath.value,
        breakpoint: activeBreakpoint.value
      }
    })

    if (Array.isArray(remote?.elements)) {
      nextElements = remote.elements
    }

    if (Array.isArray(remote?.data?.elements)) {
      nextElements = remote.data.elements
    }
  } catch {
    // Endpoint backend belum ada tidak masalah, fallback localStorage.
  }

  elements.value = nextElements || getStarterElements()

  await nextTick()
  hydrateImages()

  hydrated.value = true
  saveLabel.value = nextElements ? 'Loaded' : 'Starter'

  if (!nextElements) {
    scheduleSave()
  }
}

async function saveCanvas(remoteSync = false) {
  if (!process.client) return

  saving.value = true

  const payload = {
    tenant: tenantName.value,
    path: selectedPath.value,
    breakpoint: activeBreakpoint.value,
    stage: {
      width: stageConfig.width,
      height: stageConfig.height
    },
    elements: elements.value,
    updatedAt: new Date().toISOString()
  }

  localStorage.setItem(storageKey.value, JSON.stringify(payload))

  if (remoteSync) {
    try {
      await $fetch('/api/admin/web/editor/canvas', {
        method: 'POST',
        body: payload
      })

      saveLabel.value = 'Synced'
      showToast('Canvas tersimpan ke backend')
    } catch {
      saveLabel.value = 'Local saved'
      showToast('Backend belum tersedia, tersimpan lokal')
    }
  } else {
    saveLabel.value = 'Local saved'
  }

  saving.value = false
}

function exportJson() {
  const payload = {
    tenant: tenantName.value,
    path: selectedPath.value,
    breakpoint: activeBreakpoint.value,
    stage: {
      width: stageConfig.width,
      height: stageConfig.height
    },
    elements: elements.value
  }

  const text = JSON.stringify(payload, null, 2)
  navigator.clipboard?.writeText(text)
  showToast('JSON disalin ke clipboard')
}

function exportPng() {
  const stage = stageRef.value?.getNode?.()

  if (!stage) {
    showToast('Stage belum siap')
    return
  }

  const dataUrl = stage.toDataURL({
    pixelRatio: 2
  })

  const link = document.createElement('a')
  link.download = `obayan-${selectedPath.value.replace(/\W+/g, '-') || 'home'}-${activeBreakpoint.value}.png`
  link.href = dataUrl
  link.click()

  showToast('PNG berhasil diexport')
}

function showToast(message: string) {
  toast.value = message

  if (toastTimer) {
    clearTimeout(toastTimer)
  }

  toastTimer = setTimeout(() => {
    toast.value = ''
  }, 2200)
}

function handleResize() {
  const el = canvasWrapEl.value
  if (!el) return

  const rect = el.getBoundingClientRect()

  stageConfig.width = Math.max(320, Math.round(rect.width))
  stageConfig.height = Math.max(480, Math.round(rect.height))
}

function handleKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null
    const tagName = target?.tagName?.toLowerCase()

    if (['input', 'textarea', 'select'].includes(tagName || '')) return

    if (event.key === 'Delete' || event.key === 'Backspace') {
        deleteSelected()
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'd') {
        event.preventDefault()
        duplicateSelected()
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        saveCanvas(true)
    }

    if (event.key === 'Escape') selectedId.value = null
}

watch(
    () => [selectedPath.value, activeBreakpoint.value],
    () => {
        loadCanvas()
    }
)

watch(
    elements,
    () => {
        if (!hydrated.value) return
        hydrateImages()
        scheduleSave()
    },
    { deep: true }
)

onMounted(async () => {
    web?.subscribePages?.()

    await nextTick()
    handleResize()

    resizeObserver = new ResizeObserver(() => {
        handleResize()
    })

    if (canvasWrapEl.value) {
        resizeObserver.observe(canvasWrapEl.value)
    }

    window.addEventListener('keydown', handleKeydown)

    await loadCanvas()
})

onUnmounted(() => {
    resizeObserver?.disconnect()
    window.removeEventListener('keydown', handleKeydown)

    if (saveTimer) clearTimeout(saveTimer)
    if (toastTimer) clearTimeout(toastTimer)
})
</script>