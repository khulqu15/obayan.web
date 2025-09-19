<template>
  <div>
    <!-- Tabs -->
    <div class="flex gap-1 border-b flex-wrap border-gray-200 dark:border-neutral-800">
      <button v-for="t in tabs" :key="t" class="px-3 py-2 text-xs rounded-t-lg"
              :class="activeTab===t ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800'"
              @click="activeTab=t">
        {{ t }}
      </button>
      <div class="ml-auto flex gap-2 mb-2">
        <button class="px-2 py-1 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700" @click="resetToDefault">
          Isi Default
        </button>
        <button class="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700" @click="save">
          Simpan
        </button>
      </div>
    </div>

    <!-- Konten -->
    <div v-show="activeTab==='Konten'" class="mt-3 grid sm:grid-cols-2 gap-3">
      <div>
        <label class="text-xs text-gray-500">Eyebrow (badge kecil)</label>
        <input v-model.trim="form.eyebrow" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
      </div>
      <div>
        <label class="text-xs text-gray-500">Brand (akhir judul)</label>
        <input v-model.trim="form.brand" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
      </div>
      <div>
        <label class="text-xs text-gray-500">Judul: Prefix</label>
        <input v-model.trim="form.titlePrefix" placeholder="Ayo" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
      </div>
      <div>
        <label class="text-xs text-gray-500">Judul: Kata Di-underline</label>
        <input v-model.trim="form.titleUnderline" placeholder="Mondok" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
      </div>
      <div>
        <label class="text-xs text-gray-500">Judul: Sufiks</label>
        <input v-model.trim="form.titleSuffix" placeholder="di" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
      </div>
      <div class="sm:col-span-2">
        <label class="text-xs text-gray-500">Subjudul</label>
        <textarea v-model.trim="form.subtitle" rows="3" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"></textarea>
      </div>
    </div>

    <!-- CTA -->
    <div v-show="activeTab==='CTA'" class="mt-3 grid sm:grid-cols-2 gap-4">
      <!-- Primary -->
      <div class="space-y-2">
        <p class="text-xs font-semibold text-gray-700 dark:text-neutral-300">CTA Utama</p>
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-gray-500">Label</label>
            <input v-model.trim="form.primaryCTA.label" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
          </div>
          <div>
            <label class="text-xs text-gray-500">Href</label>
            <input v-model.trim="form.primaryCTA.href" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
          </div>
        </div>
        <div class="grid sm:grid-cols-[1fr_auto_auto] gap-2 items-center">
          <div>
            <div class="flex items-center gap-2">
              <ClientOnly><Icon v-if="form.primaryCTA.icon" :icon="form.primaryCTA.icon" class="size-5 text-gray-600 dark:text-neutral-300" /></ClientOnly>
            </div>
          </div>
          <button type="button" class="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 text-sm"
                  @click="openIconPicker('primary')">Pilih Ikon</button>
          <button type="button" class="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 text-sm"
                  @click="form.primaryCTA.icon=''">Clear</button>
        </div>
      </div>

      <!-- Secondary -->
      <div class="space-y-2">
        <p class="text-xs font-semibold text-gray-700 dark:text-neutral-300">CTA Sekunder</p>
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-gray-500">Label</label>
            <input v-model.trim="form.secondaryCTA.label" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
          </div>
          <div>
            <label class="text-xs text-gray-500">Href</label>
            <input v-model.trim="form.secondaryCTA.href" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
          </div>
        </div>
        <div class="grid sm:grid-cols-[1fr_auto_auto] gap-2 items-center">
          <div>
            <div class="flex items-center gap-2">
              <ClientOnly><Icon v-if="form.secondaryCTA.icon" :icon="form.secondaryCTA.icon" class="size-5 text-gray-600 dark:text-neutral-300" /></ClientOnly>
            </div>
          </div>
          <button type="button" class="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 text-sm"
                  @click="openIconPicker('secondary')">Pilih Ikon</button>
          <button type="button" class="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 text-sm"
                  @click="form.secondaryCTA.icon=''">Clear</button>
        </div>
      </div>
    </div>

    <!-- Hadist -->
    <div v-show="activeTab==='Hadist'" class="mt-3 grid sm:grid-cols-2 gap-3">
      <div class="sm:col-span-2">
        <label class="text-xs text-gray-500">Teks Arab</label>
        <textarea v-model.trim="form.hadithArabic" rows="2" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"></textarea>
      </div>
      <div class="sm:col-span-2">
        <label class="text-xs text-gray-500">Terjemah</label>
        <textarea v-model.trim="form.hadithTranslation" rows="3" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"></textarea>
      </div>
      <div>
        <label class="text-xs text-gray-500">Sumber (mis. HR. Muslim)</label>
        <input v-model.trim="form.hadithSource" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
      </div>
    </div>

    <!-- Media -->
    <div v-show="activeTab==='Media'" class="mt-3 grid sm:grid-cols-2 gap-4">
      <div class="sm:col-span-2">
        <label class="text-xs text-gray-500">Background</label>
        <div class="mt-1">
          <input v-model.trim="form.bg" placeholder="URL gambar atau upload…" class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
          <input type="file" accept="image/*" class="text-xs w-full mt-1" @change="(e:any)=>upload(e,'bg')">
        </div>
        <div class="mt-2">
          <img v-if="form.bg" :src="form.bg" class="h-28 w-full object-cover rounded-lg border border-gray-200 dark:border-neutral-800" alt="bg">
        </div>
        <p v-if="progress['bg']!=null" class="text-[11px] mt-1">Upload: {{ progress['bg'] }}%</p>
      </div>
      <div>
        <label class="text-xs text-gray-500">Pattern (opsional)</label>
        <div class="mt-1">
          <input v-model.trim="form.pattern" placeholder="/assets/pattern.png" class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
          <input type="file" accept="image/*" class="text-xs w-full mt-1" @change="(e:any)=>upload(e,'pattern')">
        </div>
        <div class="mt-2">
          <img v-if="form.pattern" :src="form.pattern" class="h-20 w-full object-cover rounded-lg border border-gray-200 dark:border-neutral-800" alt="pattern">
        </div>
        <p v-if="progress['pattern']!=null" class="text-[11px] mt-1">Upload: {{ progress['pattern'] }}%</p>
      </div>
    </div>

    <!-- Preview -->
    <div v-show="activeTab==='Preview'" class="mt-4">
      <div class="rounded-xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
        <InvitationHeroView :override="heroProps" />
      </div>
      <p class="mt-2 text-[11px] text-gray-500">Preview menampilkan hasil sesuai data saat ini (belum tentu tersimpan).</p>
    </div>

    <!-- Notes -->
    <div class="mt-4 flex flex-wrap gap-2">
      <p v-if="savedNote" class="text-[11px] text-emerald-600">{{ savedNote }}</p>
      <p v-if="errNote" class="text-[11px] text-rose-600">{{ errNote }}</p>
    </div>

    <!-- ICON PICKER MODAL -->
    <div
      v-if="iconModal.show"
      class="fixed left-0 top-0 w-full z-[1002] h-screen flex items-start py-24 overflow-y-auto justify-center bg-black/30 px-4"
      @click.self="closeIconPicker"
    >
      <div class="w-full max-w-3xl rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700">
        <div class="p-4 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
          <h3 class="text-base font-semibold">Select Icon</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="closeIconPicker">×</button>
        </div>

        <div class="p-4 space-y-3">
          <div class="inline-flex bg-white/80 border border-gray-200 rounded-lg p-1 shadow-xs dark:bg-neutral-800/70 dark:border-neutral-700">
            <button
              v-for="t in iconModal.tabs"
              :key="t"
              @click="setTab(t)"
              :class="[
                'px-3 py-1.5 rounded-md text-sm',
                iconModal.activeTab === t ? 'bg-gray-900 text-white dark:bg-neutral-200 dark:text-neutral-900' : 'text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700'
              ]"
            >
              {{ t }}
            </button>
          </div>

          <div class="flex gap-2">
            <input
              v-model.trim="iconModal.query"
              type="text"
              placeholder="Search icons (e.g. home, bolt, printer)"
              class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800"
              @input="onSearchInput"
              @keydown.enter.prevent="searchOnline(true)"
            />
            <button
              v-if="iconModal.allowOnline"
              class="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 text-sm"
              :disabled="iconModal.loading"
              @click="searchOnline()"
              title="Search online via Iconify API"
            >
              {{ iconModal.loading ? 'Searching…' : 'Search Online' }}
            </button>
          </div>

          <div class="max-h-[420px] overflow-auto rounded-lg border border-gray-200 dark:border-neutral-800 p-3">
            <div class="grid sm:grid-cols-6 grid-cols-4 gap-3">
              <button
                v-for="name in iconModal.visible"
                :key="name"
                type="button"
                @click="chooseIcon(name)"
                class="group p-3 rounded-xl border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 text-xs flex flex-col items-center gap-2"
              >
                <ClientOnly>
                  <Icon :icon="name" width="24" height="24" />
                </ClientOnly>
                <span class="truncate w-full text-center" :title="name">{{ name }}</span>
              </button>
            </div>
            <p v-if="!iconModal.visible.length" class="text-sm text-gray-500 mt-3">No icons found.</p>
          </div>

          <div
            class="mt-3 flex items-center justify-between text-xs text-gray-600 dark:text-neutral-300"
            v-if="iconModal.allowOnline && iconModal.total > iconModal.limit"
          >
            <span>
              Showing
              {{ Math.min(iconModal.total, iconModal.start + 1) }}–{{ Math.min(iconModal.total, iconModal.start + iconModal.limit) }}
              of {{ iconModal.total }}
            </span>
            <div class="inline-flex gap-2">
              <button
                type="button"
                class="px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 disabled:opacity-50"
                :disabled="iconModal.start === 0 || iconModal.loading"
                @click="prevPage"
              >
                Prev
              </button>
              <button
                type="button"
                class="px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 disabled:opacity-50"
                :disabled="iconModal.start + iconModal.limit >= iconModal.total || iconModal.loading"
                @click="nextPage"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-gray-200 dark:border-neutral-800 flex justify-end">
          <button class="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700" @click="closeIconPicker">
            Close
          </button>
        </div>
      </div>
    </div>
    <!-- /ICON PICKER MODAL -->
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue'
import InvitationHeroView from '~/components/hero/InvitationHero.vue'
import { Icon } from '@iconify/vue'
import { useWeb } from '~/composables/data/useWeb'

type CTA = { label: string; href: string; icon?: string }
type EditorShape = {
  eyebrow: string; titlePrefix: string; titleUnderline: string; titleSuffix: string; brand: string; subtitle: string;
  primaryCTA: CTA; secondaryCTA: CTA;
  bg: string; pattern: string;
  hadithArabic: string; hadithTranslation: string; hadithSource: string;
}

const props = defineProps<{ section: { id: string; key: string; props?: Partial<EditorShape> } }>()

/* ===== DEFAULTS (dipakai hanya untuk nilai yang belum ada) ===== */
const defaults: EditorShape = {
  eyebrow: 'Ajakan Kebaikan',
  titlePrefix: 'Ayo',
  titleUnderline: 'Mondok',
  titleSuffix: 'di',
  brand: 'Ponpes Alberr',
  subtitle: 'Lingkungan yang menumbuhkan adab, ilmu, dan kemandirian. Kurikulum diniyah & formal terpadu, pembinaan tahfidz, serta program kepemimpinan dan pengabdian.',
  primaryCTA: { label: 'Al Berr', href: '/profile', icon: 'ph:student' },
  secondaryCTA: { label: 'Pelajari lebih lanjut', href: '/program', icon: 'ph:arrow-right' },
  bg: '/assets/images/profile.png',
  pattern: '/assets/pattern.png',
  hadithArabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
  hadithTranslation: '“Barangsiapa menempuh jalan untuk mencari ilmu, Allah akan mudahkan baginya jalan menuju Surga.”',
  hadithSource: 'HR. Muslim'
}

const tabs = ['Konten','CTA','Hadist','Media','Preview'] as const
const activeTab = ref<typeof tabs[number]>('Konten')

/* ===== MERGE helper ===== */
function merge(b: EditorShape, p?: Partial<EditorShape>): EditorShape {
  const x = p || {}
  return {
    eyebrow: x.eyebrow ?? b.eyebrow,
    titlePrefix: x.titlePrefix ?? b.titlePrefix,
    titleUnderline: x.titleUnderline ?? b.titleUnderline,
    titleSuffix: x.titleSuffix ?? b.titleSuffix,
    brand: x.brand ?? b.brand,
    subtitle: x.subtitle ?? b.subtitle,
    primaryCTA: { ...b.primaryCTA, ...(x.primaryCTA||{}) },
    secondaryCTA: { ...b.secondaryCTA, ...(x.secondaryCTA||{}) },
    bg: x.bg ?? b.bg,
    pattern: x.pattern ?? b.pattern,
    hadithArabic: x.hadithArabic ?? b.hadithArabic,
    hadithTranslation: x.hadithTranslation ?? b.hadithTranslation,
    hadithSource: x.hadithSource ?? b.hadithSource
  }
}
const clone = <T,>(v:T)=>JSON.parse(JSON.stringify(v))

/* ===== STATE editor (selalu di-hydrate dari props.section.props) ===== */
const form = reactive<EditorShape>(merge(defaults, props.section?.props))
watch(() => props.section?.props, (p) => { Object.assign(form, merge(defaults, p)) })

/* ====== useWeb API (single source of truth) ====== */
const { updateSection, uploadMedia } = useWeb()

/* ====== Preview props (read-only) ====== */
const heroProps = computed(() => ({
  bg: form.bg,
  pattern: form.pattern,
  eyebrow: form.eyebrow,
  preText: form.titlePrefix,
  highlightText: form.titleUnderline,
  suffixText: form.titleSuffix,
  brandText: form.brand,
  subtitle: form.subtitle,
  ctaPrimary: form.primaryCTA,
  ctaSecondary: form.secondaryCTA,
  hadithArabic: form.hadithArabic,
  hadithTranslation: form.hadithTranslation,
  hadithSource: form.hadithSource
}))

/* ====== Save (langsung ke section props) ====== */
const savedNote = ref(''); const errNote = ref('')
async function save() {
  try {
    errNote.value = ''
    await updateSection(props.section.id, { props: clone(form) })
    savedNote.value = 'Tersimpan.'; setTimeout(()=>savedNote.value='', 1400)
  } catch (e:any) {
    errNote.value = e?.message || 'Gagal menyimpan'
  }
}

/* ====== Reset ke default (opsional) ====== */
function resetToDefault() { Object.assign(form, clone(defaults)); activeTab.value='Konten' }

/* ====== Upload media (via useWeb.uploadMedia) ====== */
const progress = reactive<Record<'bg'|'pattern', number|undefined>>({ bg: undefined, pattern: undefined })
async function upload(e: Event, key: 'bg'|'pattern') {
  const file = (e.target as HTMLInputElement).files?.[0]; (e.target as HTMLInputElement).value=''
  if (!file) return
  try {
    progress[key] = 5
    const up = await uploadMedia(file)
    if (up?.url) (form as any)[key] = up.url
    progress[key] = 100
    setTimeout(()=>progress[key]=undefined, 900)
  } catch (err:any) {
    errNote.value = err?.message || 'Upload gagal'
    progress[key] = undefined
  }
}

/* ===== ICON PICKER (lokal + online) — tetap sama ===== */
type IconTab = 'All' | 'Phosphor' | 'Lucide' | 'Material' | 'Logos'
type IconTarget = 'primary' | 'secondary'
const iconModal = reactive({
  show: false,
  target: 'primary' as IconTarget,
  tabs: ['All','Phosphor','Lucide','Material','Logos'] as IconTab[],
  activeTab: 'All' as IconTab,
  query: '',
  loading: false,
  allowOnline: true,
  visible: [] as string[],
  total: 0,
  start: 0,
  limit: 48,
})
const localIcons = ref<string[]>([
  'ph:student','ph:book-open-text','ph:house','ph:gear','ph:arrow-right','ph:printer','ph:bell','ph:calendar','ph:check-circle',
  'lucide:home','lucide:settings','lucide:school','lucide:bell','lucide:calendar','lucide:arrow-right','lucide:printer',
  'mdi:home','mdi:cog','mdi:school','mdi:bell','mdi:calendar','mdi:arrow-right','mdi:printer',
  'logos:nuxt-icon','logos:vue','logos:firebase','logos:tailwindcss'
])
function openIconPicker(target: IconTarget) { iconModal.target=target; iconModal.show=true; iconModal.query=''; iconModal.start=0; setTab(iconModal.activeTab); iconModal.visible=filterLocal(iconModal.activeTab,''); iconModal.total=iconModal.visible.length }
function closeIconPicker() { iconModal.show=false }
function setTab(tab: IconTab){ iconModal.activeTab=tab; iconModal.start=0; iconModal.visible=filterLocal(tab, iconModal.query); iconModal.total=iconModal.visible.length }
function filterLocal(tab: IconTab, q: string){ const prefix = tab==='Phosphor'?'ph:':tab==='Lucide'?'lucide:':tab==='Material'?'mdi:':tab==='Logos'?'logos:':''; return localIcons.value.filter(n => (!prefix||n.startsWith(prefix)) && (!q || n.toLowerCase().includes(q.toLowerCase()))) }
let si:any
function onSearchInput(){ clearTimeout(si); si=setTimeout(()=>{ iconModal.visible=filterLocal(iconModal.activeTab, iconModal.query); iconModal.total=iconModal.visible.length }, 200) }
async function searchOnline(force=false){
  try {
    iconModal.loading = true
    const q = iconModal.query.trim()
    if (!q && !force) { iconModal.visible=filterLocal(iconModal.activeTab,''); iconModal.total=iconModal.visible.length; return }
    const prefixes = iconModal.activeTab==='Phosphor'?'ph':iconModal.activeTab==='Lucide'?'lucide':iconModal.activeTab==='Material'?'mdi':iconModal.activeTab==='Logos'?'logos':undefined
    const params = new URLSearchParams({ query: q||'', limit: String(iconModal.limit), start: String(iconModal.start) })
    if (prefixes) params.set('prefixes', prefixes)
    const res = await fetch(`https://api.iconify.design/search?${params.toString()}`)
    if (!res.ok) throw new Error('Iconify API error')
    const data = await res.json() as { total?: number; start?: number; limit?: number; icons?: string[] }
    iconModal.visible = Array.isArray(data.icons) ? data.icons : []
    iconModal.total = typeof data.total==='number' ? data.total : iconModal.visible.length
    iconModal.start = typeof data.start==='number' ? data.start : 0
    iconModal.limit = typeof data.limit==='number' ? data.limit : 48
    if (!iconModal.visible.length) { iconModal.visible=filterLocal(iconModal.activeTab, q); iconModal.total=iconModal.visible.length; iconModal.start=0 }
  } catch {
    iconModal.visible=filterLocal(iconModal.activeTab, iconModal.query); iconModal.total=iconModal.visible.length; iconModal.start=0
  } finally { iconModal.loading=false }
}
function nextPage(){ iconModal.start = Math.min(iconModal.start + iconModal.limit, Math.max(0, iconModal.total - iconModal.limit)); searchOnline(true) }
function prevPage(){ iconModal.start = Math.max(0, iconModal.start - iconModal.limit); searchOnline(true) }
function chooseIcon(name: string){ if (iconModal.target==='primary') form.primaryCTA.icon = name; else form.secondaryCTA.icon = name; closeIconPicker() }
</script>