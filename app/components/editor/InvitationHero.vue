<template>
  <div>
    <div class="flex gap-1 border-b flex-wrap border-gray-200 dark:border-neutral-800">
      <button v-for="t in tabs" :key="t" class="px-3 py-2 text-xs rounded-t-lg" :class="activeTab===t ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800'" @click="activeTab=t">
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

    <div v-show="activeTab==='CTA'" class="mt-3 grid sm:grid-cols-2 gap-3">
      <div>
        <label class="text-xs text-gray-500">CTA Utama - Label</label>
        <input v-model.trim="form.primaryCTA.label" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
      </div>
      <div>
        <label class="text-xs text-gray-500">CTA Utama - Href</label>
        <input v-model.trim="form.primaryCTA.href" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
      </div>
      <div>
        <label class="text-xs text-gray-500">CTA Sekunder - Label</label>
        <input v-model.trim="form.secondaryCTA.label" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
      </div>
      <div>
        <label class="text-xs text-gray-500">CTA Sekunder - Href</label>
        <input v-model.trim="form.secondaryCTA.href" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
      </div>
    </div>

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

    <div class="mt-4 flex flex-wrap gap-2">
      <p v-if="savedNote" class="text-[11px] text-emerald-600">{{ savedNote }}</p>
      <p v-if="errNote" class="text-[11px] text-rose-600">{{ errNote }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useWeb } from '~/composables/data/useWeb'

type CTA = { label: string; href: string }
type Shape = {
  eyebrow: string
  titlePrefix: string
  titleUnderline: string
  titleSuffix: string
  brand: string
  subtitle: string
  primaryCTA: CTA
  secondaryCTA: CTA
  bg: string
  pattern: string
}

const props = defineProps<{ section: { id: string; key: string; props?: Partial<Shape> } }>()

const defaults: Shape = {
  eyebrow: 'Ajakan Kebaikan',
  titlePrefix: 'Ayo',
  titleUnderline: 'Mondok',
  titleSuffix: 'di',
  brand: 'Ponpes Alberr',
  subtitle: 'Lingkungan yang menumbuhkan adab, ilmu, dan kemandirian. Kurikulum diniyah & formal terpadu, pembinaan tahfidz, serta program kepemimpinan dan pengabdian.',
  primaryCTA: { label: 'Al Berr', href: '/profile' },
  secondaryCTA: { label: 'Pelajari lebih lanjut', href: '/program' },
  bg: '/assets/images/profile.png',
  pattern: '/assets/pattern.png'
}

const tabs = ['Konten','CTA','Media'] as const
const activeTab = ref<typeof tabs[number]>('Konten')
const form = reactive<Shape>(merge(defaults, props.section?.props || {}))
const savedNote = ref(''); const errNote = ref(''); const progress = reactive<Record<string,number>>({})

watch(() => props.section?.props, (p) => {
  Object.assign(form, merge(defaults, p || {}))
})

function merge(b: Shape, p: Partial<Shape>): Shape {
  return {
    eyebrow: p.eyebrow ?? b.eyebrow,
    titlePrefix: p.titlePrefix ?? b.titlePrefix,
    titleUnderline: p.titleUnderline ?? b.titleUnderline,
    titleSuffix: p.titleSuffix ?? b.titleSuffix,
    brand: p.brand ?? b.brand,
    subtitle: p.subtitle ?? b.subtitle,
    primaryCTA: { ...b.primaryCTA, ...(p.primaryCTA||{}) },
    secondaryCTA: { ...b.secondaryCTA, ...(p.secondaryCTA||{}) },
    bg: p.bg ?? b.bg,
    pattern: p.pattern ?? b.pattern,
  }
}

const { updateSection } = useWeb()

async function save() {
  try {
    errNote.value = ''
    await updateSection(props.section.id, { props: JSON.parse(JSON.stringify(form)) })
    savedNote.value = 'Tersimpan.'; setTimeout(()=>savedNote.value='', 1500)
  } catch (e:any) {
    errNote.value = e?.message || 'Gagal menyimpan'
  }
}

function resetToDefault() {
  Object.assign(form, JSON.parse(JSON.stringify(defaults)))
  activeTab.value = 'Konten'
}

async function upload(e: Event, key: 'bg'|'pattern') {
  const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return
  progress[key] = 0
  try {
    const { getStorage, ref, uploadBytesResumable, getDownloadURL } = await import('firebase/storage')
    const storage = getStorage()
    const path = `alberr/web/infohero/${Date.now()}_${file.name.replace(/\s+/g,'_')}`
    const r = ref(storage, path)
    const task = uploadBytesResumable(r, file, { contentType: file.type })
    await new Promise<void>((res, rej) => {
      task.on('state_changed',
        s => progress[key] = Math.round(100 * s.bytesTransferred / s.totalBytes),
        rej,
        async () => { (form as any)[key] = await getDownloadURL(task.snapshot.ref); res() })
    })
  } catch (e:any) {
    errNote.value = e?.message || 'Upload gagal'
  } finally {
    setTimeout(()=>{ delete progress[key] }, 1200)
    ;(e.target as HTMLInputElement).value = ''
  }
}
</script>
