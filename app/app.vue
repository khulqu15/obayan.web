<template>
  <div>
    <NuxtLoadingIndicator :color="settings.primaryColor || '#2563eb'" :height="3" :throttle="0" :duration="2000" />
    <AppLoading :force="forced" label="Memuat..." sublabel="Menyiapkan halaman" />
    <NuxtLayout v-bind="page?.meta?.layoutProps">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick, watch, onBeforeUnmount } from 'vue'
import { useSettings } from '~/composables/data/useSettings'
import { ref as dbRef, onValue, off } from 'firebase/database'

const page = useRoute()
const forced = ref(false)

const { settings, load } = useSettings('/alberr/settings')
function hexToRgbStr(hex: string) {
  let c = (hex || '').replace('#',''); if (!c) return '37,99,235'
  if (c.length === 3) c = c.split('').map(h => h+h).join('')
  const r = parseInt(c.slice(0,2),16), g = parseInt(c.slice(2,4),16), b = parseInt(c.slice(4,6),16)
  return `${r}, ${g}, ${b}`
}
function getContrastYIQ(hex: string) {
  const c = (hex || '').replace('#','') || '2563eb'
  const r = parseInt(c.slice(0,2),16), g = parseInt(c.slice(2,4),16), b = parseInt(c.slice(4,6),16)
  const yiq = (r*299 + g*587 + b*114)/1000
  return yiq >= 128 ? '#000' : '#fff'
}

function applyPrimary(hex?: string) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const h = hex || '#2563eb'
  root.style.setProperty('--app-primary', h)
  root.style.setProperty('--app-primary-rgb', hexToRgbStr(h))
  root.style.setProperty('--auto-text-on-primary', getContrastYIQ(h))
}
function applySecondary(hex?: string) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const h = hex || '#10b981' /* emerald-500 default */
  root.style.setProperty('--app-secondary', h)
  root.style.setProperty('--app-secondary-rgb', hexToRgbStr(h))
  root.style.setProperty('--auto-text-on-secondary', getContrastYIQ(h))
}
function applyTheme(theme?: 'light'|'dark'|'system') {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const setDark = (d: boolean) => d ? root.classList.add('dark') : root.classList.remove('dark')
  if (theme === 'dark') setDark(true)
  else if (theme === 'light') setDark(false)
  else {
    const mq = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)')
    setDark(!!mq && mq.matches)
  }
}
function applyFontScale(scale?: number) {
  if (typeof document === 'undefined') return
  const s = Number(scale || 1)
  document.documentElement.style.setProperty('--app-font-scale', String(s))
  document.documentElement.style.setProperty('font-size', `${(16 * s).toFixed(2)}px`)
}
function applyDensity(density?: 'comfortable'|'compact') {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-density', density === 'comfortable' ? 'comfortable' : 'compact')
}

let rtdbRef: ReturnType<typeof dbRef> | null = null
const cb = (snap: any) => {
  const v = snap?.val?.() ?? snap?.val?.call?.(snap) ?? snap?.val?.() // guard
  const s = v || {}
  applyPrimary(s.primaryColor)
  applySecondary(s.secondaryColor)
  applyTheme(s.theme)
  applyFontScale(s.fontScale)
  applyDensity(s.density)
}

onMounted(() => {
  applyPrimary('#2563eb')
  applySecondary('#10b981')
  applyTheme('system')
  applyFontScale(1)
  applyDensity('comfortable')

  const { $realtimeDb } = useNuxtApp() as any
  rtdbRef = dbRef($realtimeDb, '/alberr/settings')
  onValue(rtdbRef, cb, (err) => console.error('RTDB settings error:', err))
})

onBeforeUnmount(() => {
  if (rtdbRef) off(rtdbRef, 'value', cb)
})

</script>

<style>
:root {
  --app-primary: #2563eb;
  --app-primary-rgb: 37, 99, 235;
  --auto-text-on-primary: #fff;

  --app-secondary: #9333ea;
  --app-secondary-rgb: 147, 51, 234;
  --auto-text-on-secondary: #fff;
}

.bg-primary,
[class*="bg-blue-"] { 
  background-color: var(--app-primary) !important;
  color: var(--auto-text-on-primary, #fff);
}
.bg-primary .text-primary,
[class*="bg-blue-"] .text-primary,
[class*="bg-blue-"] [class*="text-blue-"] {
  color: inherit !important;
}

[class*="bg-blue-"]     { background-color: var(--app-primary) !important; }
[class*="text-blue-"]   { color: var(--app-primary) !important; }
[class*="border-blue-"] { border-color: var(--app-primary) !important; }
[class*="ring-blue-"]   { --tw-ring-color: var(--app-primary) !important;}

[class*="bg-emerald-"]     { background-color: var(--app-secondary) !important; }
[class*="text-emerald-"]   { color: var(--app-secondary) !important; }
[class*="border-emerald-"] { border-color: var(--app-secondary) !important; }
[class*="ring-emerald-"]   { --tw-ring-color: var(--app-secondary) !important; }

.bg-primary,
[class*="bg-blue-"] {
  background-color: var(--app-primary) !important;
  color: var(--auto-text-on-primary, #fff);
}

.bg-primary .text-primary,
[class*="bg-blue-"] .text-primary,
[class*="bg-blue-"] [class*="text-blue-"] {
  color: inherit !important;
}

.bg-secondary,
[class*="bg-emerald-"] {
  background-color: var(--app-secondary) !important;
  color: var(--auto-text-on-secondary, #fff);
}

.bg-secondary .text-secondary,
[class*="bg-emerald-"] .text-secondary,
[class*="bg-emerald-"] [class*="text-emerald-"] {
  color: inherit !important;
}

html[data-density="comfortable"] {
  --density-scale: 1.2;
}

html[data-density="comfortable"] button,
html[data-density="comfortable"] .btn,
html[data-density="comfortable"] input,
html[data-density="comfortable"] select,
html[data-density="comfortable"] textarea {
  padding-block: calc(0.5rem * var(--density-scale)) !important;   /* kira-kira dari 0.5rem → 0.6rem */
  padding-inline: calc(0.75rem * var(--density-scale)) !important; /* 0.75rem → 0.9rem */
  min-height: calc(2.25rem * var(--density-scale)) !important;     /* 2.25rem → 2.7rem */
  border-radius: calc(0.5rem * var(--density-scale)) !important;
}

html[data-density="comfortable"] .p-3 { padding: 0.9rem !important; }
html[data-density="comfortable"] .p-4 { padding: 1.2rem !important; }
html[data-density="comfortable"] .p-5 { padding: 1.5rem !important; }
html[data-density="comfortable"] .p-6 { padding: 1.8rem !important; }

html[data-density="comfortable"] .px-3 { padding-left: 0.9rem !important;  padding-right: 0.9rem !important; }
html[data-density="comfortable"] .px-4 { padding-left: 1.2rem !important;  padding-right: 1.2rem !important; }
html[data-density="comfortable"] .px-5 { padding-left: 1.5rem !important;  padding-right: 1.5rem !important; }
html[data-density="comfortable"] .px-6 { padding-left: 1.8rem !important;  padding-right: 1.8rem !important; }

html[data-density="comfortable"] .py-2 { padding-top: 0.6rem !important;   padding-bottom: 0.6rem !important; } /* 0.5 → 0.6 */
html[data-density="comfortable"] .py-3 { padding-top: 0.9rem !important;   padding-bottom: 0.9rem !important; }
html[data-density="comfortable"] .py-4 { padding-top: 1.2rem !important;   padding-bottom: 1.2rem !important; }
html[data-density="comfortable"] .py-5 { padding-top: 1.5rem !important;   padding-bottom: 1.5rem !important; }
html[data-density="comfortable"] .py-6 { padding-top: 1.8rem !important;   padding-bottom: 1.8rem !important; }

html[data-density="comfortable"] .gap-2 { gap: 0.625rem !important; }
html[data-density="comfortable"] .gap-3 { gap: 0.9rem !important; }
html[data-density="comfortable"] .gap-4 { gap: 1.2rem !important; }
html[data-density="comfortable"] .gap-5 { gap: 1.5rem !important; }
html[data-density="comfortable"] .gap-6 { gap: 1.8rem !important; }

html[data-density="comfortable"] table tr > th,
html[data-density="comfortable"] table tr > td {
  padding: 0.9rem 1.0rem !important; /* default ~0.5–0.75 → jadi lebih lega */
}

html[data-density="comfortable"] .badge, 
html[data-density="comfortable"] .tag {
  padding: 0.25rem 0.75rem !important;
  border-radius: 9999px !important;
  font-size: 0.8rem !important;
}
</style>
