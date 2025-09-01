<template>
  <div class="space-y-5 p-6 text-gray-600 dark:text-gray-100">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold">Settings</h1>
        <p class="text-xs text-gray-500 dark:text-neutral-400">Kelola tampilan, notifikasi, dan preferensi sistem</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="exportJson"
          class="text-xs px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800"
        >
          Export JSON
        </button>
        <input ref="fileInput" type="file" class="hidden" accept="application/json" @change="importJson" />
        <button
          @click="fileInput?.click()"
          class="text-xs px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Import JSON
        </button>
        <button
          :disabled="resetting"
          @click="confirmReset"
          class="text-xs px-3 py-1.5 rounded border border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-900/20 disabled:opacity-60"
        >
          {{ resetting ? 'Resetting…' : 'Reset to Default' }}
        </button>
      </div>
    </div>

    <div v-if="error" class="p-3 rounded border border-rose-200 bg-rose-50 text-rose-700 text-sm dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300">
      {{ error }}
    </div>
    <div v-if="loading" class="text-sm text-gray-500">Memuat settings…</div>

    <div v-else class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
      <!-- Appearance -->
      <div class="rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-5 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold">Appearance</h2>
          <span class="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300">
            Live Preview
          </span>
        </div>

        <div class="space-y-3">
          <div class="grid grid-cols-1 gap-3">
            <div>
              <label class="text-xs text-gray-600 dark:text-neutral-300">Primary Color</label>
              <div class="flex items-center gap-2">
                <input type="color" v-model="settings.primaryColor" class="h-9 w-12 rounded cursor-pointer border border-gray-200 dark:border-neutral-700" />
                <input v-model="settings.primaryColor" placeholder="#2563eb"
                  class="flex-1 px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700 text-xs" />
              </div>
            </div>
            <div>
                <label class="text-xs text-gray-600 dark:text-neutral-300">Secondary Color</label>
                <div class="flex items-center gap-2">
                <input type="color" v-model="settings.secondaryColor"
                        class="h-9 w-12 rounded cursor-pointer border border-gray-200 dark:border-neutral-700" />
                <input v-model="settings.secondaryColor" placeholder="#9333ea"
                        class="flex-1 px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700 text-xs" />
                </div>
            </div>
            <div>
              <label class="text-xs text-gray-600 dark:text-neutral-300">Theme</label>
              <div class="flex gap-2">
                <button
                  v-for="opt in themeOptions" :key="opt.value"
                  @click="settings.theme = opt.value"
                  :class="[
                    'px-3 py-1.5 rounded border text-xs',
                    settings.theme === opt.value
                      ? 'border-blue-600 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800'
                  ]"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">Font Scale ({{ settings.fontScale.toFixed(2) }}×)</label>
            <input type="range" min="0.85" max="1.30" step="0.05" v-model.number="settings.fontScale" class="w-full" />
          </div>

          <div>
            <label class="text-xs text-gray-600 dark:text-neutral-300">UI Density</label>
            <div class="flex gap-2">
              <button
                v-for="d in densityOptions" :key="d.value"
                @click="settings.density = d.value"
                :class="[
                  'px-3 py-1.5 rounded border text-xs',
                  settings.density === d.value
                    ? 'border-blue-600 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800'
                ]"
              >
                {{ d.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications -->
      <div class="rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-5 space-y-4">
        <h2 class="font-semibold">Notifications</h2>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium">Email Notifications</p>
              <p class="text-xs text-gray-500 dark:text-neutral-400">Kirim ringkasan dan alert via email</p>
            </div>
            <label class="inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.emailNotifications" class="sr-only peer" />
              <div class="w-10 h-5 bg-gray-200 peer-checked:bg-blue-600 rounded-full relative transition-colors">
                <div class="absolute top-0.5 left-0.5 h-4 w-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
              </div>
            </label>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-gray-600 dark:text-neutral-300">Email Utama</label>
              <input type="email" v-model.trim="settings.emailPrimary" placeholder="admin@contoh.com"
                class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700 text-sm" />
            </div>
            <div>
              <label class="text-xs text-gray-600 dark:text-neutral-300">Daily Summary Time</label>
              <input type="time" v-model="settings.emailDailyTime"
                class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700 text-sm" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-gray-600 dark:text-neutral-300">Critical Alert Threshold</label>
              <input type="number" min="0" v-model.number="settings.criticalThreshold"
                class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700 text-sm" />
            </div>
            <div>
              <label class="text-xs text-gray-600 dark:text-neutral-300">Notify on</label>
              <select v-model="settings.notifyOn" class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700 text-sm">
                <option value="always">Always</option>
                <option value="only-critical">Only Critical</option>
                <option value="digest">Digest Only</option>
              </select>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              :disabled="testingEmail || !settings.emailNotifications || !settings.emailPrimary"
              @click="testEmail"
              class="text-xs px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-60"
            >
              {{ testingEmail ? 'Testing…' : 'Send Test Email' }}
            </button>
            <span v-if="emailToast" class="text-xs text-emerald-600 dark:text-emerald-400">{{ emailToast }}</span>
          </div>
        </div>
      </div>

      <!-- System & Locale -->
      <div class="rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-5 space-y-4">
        <h2 class="font-semibold">System & Locale</h2>
        <div class="space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-gray-600 dark:text-neutral-300">Locale</label>
              <select v-model="settings.locale"
                class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700 text-sm">
                <option value="id-ID">Indonesia (id-ID)</option>
                <option value="en-US">English (en-US)</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-gray-600 dark:text-neutral-300">Date Format</label>
              <input v-model.trim="settings.dateFormat" placeholder="dd/MM/yyyy"
                class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700 text-sm" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-gray-600 dark:text-neutral-300">Timezone</label>
              <input v-model.trim="settings.timezone" placeholder="Asia/Jakarta"
                class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700 text-sm" />
            </div>
            <div>
              <label class="text-xs text-gray-600 dark:text-neutral-300">Page Size (DataTable)</label>
              <input type="number" min="5" max="200" v-model.number="settings.pageSize"
                class="w-full px-3 py-2 rounded border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700 text-sm" />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium">Experimental: Smooth Animations</p>
              <p class="text-xs text-gray-500 dark:text-neutral-400">Aktifkan transisi halus UI</p>
            </div>
            <label class="inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.smoothAnimations" class="sr-only peer" />
              <div class="w-10 h-5 bg-gray-200 peer-checked:bg-blue-600 rounded-full relative transition-colors">
                <div class="absolute top-0.5 left-0.5 h-4 w-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
              </div>
            </label>
          </div>
        </div>

        <div class="pt-3 border-t border-dashed border-gray-200 dark:border-neutral-800">
          <div class="flex items-center justify-between">
            <div class="text-xs text-gray-500 dark:text-neutral-400">
              Status:
              <span v-if="saving">Menyimpan…</span>
              <span v-else-if="savedFlash" class="text-emerald-600 dark:text-emerald-400">Tersimpan</span>
              <span v-else>Idle</span>
            </div>
            <div class="text-[10px] text-gray-400 dark:text-neutral-500">
              Updated: {{ lastUpdatedLabel }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Reset -->
    <ModalShell v-model="showConfirmReset" title="Reset Settings">
      <p class="text-sm text-gray-700 dark:text-neutral-200">
        Yakin ingin mengembalikan seluruh pengaturan ke *default*? Tindakan ini akan menimpa setelan saat ini.
      </p>
      <template #footer>
        <button @click="showConfirmReset=false" class="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800">
          Batal
        </button>
        <button :disabled="resetting" @click="doReset" class="px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60">
          {{ resetting ? 'Mereset…' : 'Reset' }}
        </button>
      </template>
    </ModalShell>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import ModalShell from '~/components/widget/ModalShell.vue'
import { useSettings } from '~/composables/data/useSettings'

definePageMeta({ layout: 'app', layoutProps: { title: 'Settings' } })

const {
  settings,
  loading,
  saving,
  error,
  lastUpdatedAt,
  load,
  saveNow,
  exportJson,
  importFromFile,
  resetToDefault
} = useSettings('/alberr/settings')

const fileInput = ref<HTMLInputElement | null>(null)
const emailToast = ref<string>('')
const testingEmail = ref(false)
const showConfirmReset = ref(false)
const resetting = ref(false)
const savedFlash = ref(false)

const themeOptions = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' }
]
const densityOptions = [
  { label: 'Comfortable', value: 'comfortable' },
  { label: 'Compact', value: 'compact' }
]

const lastUpdatedLabel = computed(() => {
  if (!lastUpdatedAt.value) return '—'
  const d = new Date(lastUpdatedAt.value)
  return d.toLocaleString(settings.value.locale || 'id-ID', { hour12: false })
})

function flashSaved() {
  savedFlash.value = true
  setTimeout(() => (savedFlash.value = false), 1200)
}

function applyTheme(theme: string) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else if (theme === 'light') {
    root.classList.remove('dark')
  } else {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    if (mq.matches) root.classList.add('light')
    else root.classList.remove('light')
  }
}

function applyPrimary(color: string) {
  if (typeof document === 'undefined') return
  document.documentElement.style.setProperty('--app-primary', color || '#2563eb')
}

function applyFontScale(scale: number) {
  if (typeof document === 'undefined') return
  const base = 16
  document.documentElement.style.setProperty('font-size', `${(base * (scale || 1)).toFixed(2)}px`)
}

watch(saving, (now, prev) => { if (prev && !now) flashSaved() })

onMounted(() => {
    load()
    watch(() => settings.value.theme, v => applyTheme(v), { immediate: true })
    watch(() => settings.value.primaryColor, v => applyPrimary(v), { immediate: true })
    watch(() => settings.value.fontScale, v => applyFontScale(v), { immediate: true })
})

async function testEmail() {
  testingEmail.value = true
  setTimeout(() => {
    emailToast.value = `Test email terkirim ke ${settings.value.emailPrimary || '(kosong)'} (simulasi)`
    testingEmail.value = false
    setTimeout(() => (emailToast.value = ''), 2500)
  }, 800)
}

function importJson(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  importFromFile(input.files[0]!)
  input.value = ''
}

function confirmReset() {
  showConfirmReset.value = true
}

async function doReset() {
  resetting.value = true
  try {
    await resetToDefault()
    showConfirmReset.value = false
  } finally {
    resetting.value = false
  }
}

function exportJsonWrapped() { exportJson() }
const save = () => saveNow()
</script>

<style>
.btn-primary {
  background-color: var(--app-primary);
  color: white;
}
a { accent-color: var(--app-primary); }
input[type="range"] { accent-color: var(--app-primary); }
</style>
