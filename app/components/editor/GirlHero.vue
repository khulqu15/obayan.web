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
        <label class="text-xs text-gray-500">Eyebrow</label>
        <input v-model.trim="form.eyebrow" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
      </div>
      <div>
        <label class="text-xs text-gray-500">Judul</label>
        <input v-model.trim="form.title" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
      </div>
      <div class="sm:col-span-2">
        <label class="text-xs text-gray-500">Deskripsi</label>
        <textarea v-model.trim="form.description" rows="5" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"></textarea>
      </div>
    </div>

    <!-- CTA -->
    <div v-show="activeTab==='CTA'" class="mt-3 grid sm:grid-cols-2 gap-4">
      <!-- Lokasi -->
      <div class="space-y-2">
        <p class="text-xs font-semibold text-gray-700 dark:text-neutral-300">Button Lokasi</p>
        <div>
          <label class="text-xs text-gray-500">Label</label>
          <input v-model.trim="form.ctaLocation.label" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
        </div>
        <div>
          <label class="text-xs text-gray-500">Href (Maps)</label>
          <input v-model.trim="form.ctaLocation.href" placeholder="https://maps.app.goo.gl/..." class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
        </div>
        <div class="grid sm:grid-cols-[1fr_auto_auto] gap-2 items-end">
          <div>
            <label class="text-xs text-gray-500">Ikon</label>
            <div class="mt-1 flex items-center gap-2">
              <input v-model.trim="form.ctaLocation.icon" placeholder="ph:map-pin-area" class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
              <ClientOnly><Icon v-if="form.ctaLocation.icon" :icon="form.ctaLocation.icon" class="size-5 text-gray-600 dark:text-neutral-300" /></ClientOnly>
            </div>
          </div>
          <button type="button" class="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 text-sm"
                  @click="openIconPicker('loc')">Pilih Ikon</button>
          <button type="button" class="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 text-sm"
                  @click="form.ctaLocation.icon=''">Clear</button>
        </div>
      </div>

      <!-- Kontak -->
      <div class="space-y-2">
        <p class="text-xs font-semibold text-gray-700 dark:text-neutral-300">Button Kontak</p>
        <div>
          <label class="text-xs text-gray-500">Label</label>
          <input v-model.trim="form.ctaContact.label" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
        </div>
        <div>
          <label class="text-xs text-gray-500">Href (tel:)</label>
          <input v-model.trim="form.ctaContact.href" placeholder="tel:+62812..." class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
        </div>
        <div class="grid sm:grid-cols-[1fr_auto_auto] gap-2 items-end">
          <div>
            <label class="text-xs text-gray-500">Ikon</label>
            <div class="mt-1 flex items-center gap-2">
              <input v-model.trim="form.ctaContact.icon" placeholder="ph:phone-call" class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
              <ClientOnly><Icon v-if="form.ctaContact.icon" :icon="form.ctaContact.icon" class="size-5 text-gray-600 dark:text-neutral-300" /></ClientOnly>
            </div>
          </div>
          <button type="button" class="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 text-sm"
                  @click="openIconPicker('contact')">Pilih Ikon</button>
          <button type="button" class="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 text-sm"
                  @click="form.ctaContact.icon=''">Clear</button>
        </div>
      </div>
    </div>

    <!-- Media -->
    <div v-show="activeTab==='Media'" class="mt-3 grid sm:grid-cols-2 gap-4">
      <div class="sm:col-span-2">
        <label class="text-xs text-gray-500">Gambar (kanan)</label>
        <div class="mt-1">
          <input v-model.trim="form.image" placeholder="URL gambar atau upload…" class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
          <input type="file" accept="image/*" class="text-xs w-full mt-1" @change="(e:any)=>upload(e,'image')">
        </div>
        <div class="mt-2">
          <img v-if="form.image" :src="form.image" class="h-32 w-full object-cover rounded-lg border border-gray-200 dark:border-neutral-800" alt="preview">
        </div>
        <p v-if="progress['image']!=null" class="text-[11px] mt-1">Upload: {{ progress['image'] }}%</p>
      </div>
    </div>

    <!-- Preview -->
    <div v-show="activeTab==='Preview'" class="mt-4">
      <div class="rounded-xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
        <PondokPutriHero :override="heroProps" />
      </div>
      <p class="mt-2 text-[11px] text-gray-500">Preview menampilkan hasil sesuai data saat ini (belum tentu tersimpan).</p>
    </div>

    <!-- Notes -->
    <div class="mt-4 flex flex-wrap gap-2">
      <p v-if="savedNote" class="text-[11px] text-emerald-600">{{ savedNote }}</p>
      <p v-if="errNote" class="text-[11px] text-rose-600">{{ errNote }}</p>
    </div>

    <!-- ICON PICKER MODAL -->
    <div v-if="iconModal.show" class="fixed left-0 top-0 w-full z-[1002] h-screen flex items-start py-24 overflow-y-auto justify-center bg-black/30 px-4" @click.self="closeIconPicker">
      <div class="w-full max-w-3xl rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700">
        <div class="p-4 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
          <h3 class="text-base font-semibold">Select Icon</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="closeIconPicker">×</button>
        </div>

        <div class="p-4 space-y-3">
          <div class="inline-flex bg-white/80 border border-gray-200 rounded-lg p-1 shadow-xs dark:bg-neutral-800/70 dark:border-neutral-700">
            <button v-for="t in iconModal.tabs" :key="t" @click="setTab(t)"
              :class="['px-3 py-1.5 rounded-md text-sm',
                iconModal.activeTab===t ? 'bg-gray-900 text-white dark:bg-neutral-200 dark:text-neutral-900' :
                'text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700']">
              {{ t }}
            </button>
          </div>

          <div class="flex gap-2">
            <input v-model.trim="iconModal.query" type="text" placeholder="Search icons (e.g. map, phone)"
                   class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800"
                   @input="onSearchInput" @keydown.enter.prevent="searchOnline(true)" />
            <button v-if="iconModal.allowOnline" class="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 text-sm"
                    :disabled="iconModal.loading" @click="searchOnline()">
              {{ iconModal.loading ? 'Searching…' : 'Search Online' }}
            </button>
          </div>

          <div class="max-h-[420px] overflow-auto rounded-lg border border-gray-200 dark:border-neutral-800 p-3">
            <div class="grid sm:grid-cols-6 grid-cols-4 gap-3">
              <button v-for="name in iconModal.visible" :key="name" type="button" @click="chooseIcon(name)"
                      class="group p-3 rounded-xl border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 text-xs flex flex-col items-center gap-2">
                <ClientOnly><Icon :icon="name" width="22" height="22" /></ClientOnly>
                <span class="truncate w-full text-center" :title="name">{{ name }}</span>
              </button>
            </div>
            <p v-if="!iconModal.visible.length" class="text-sm text-gray-500 mt-3">No icons found.</p>
          </div>

          <div v-if="iconModal.allowOnline && iconModal.total > iconModal.limit"
               class="mt-3 flex items-center justify-between text-xs text-gray-600 dark:text-neutral-300">
            <span>Showing {{ Math.min(iconModal.total, iconModal.start + 1) }}–{{ Math.min(iconModal.total, iconModal.start + iconModal.limit) }} of {{ iconModal.total }}</span>
            <div class="inline-flex gap-2">
              <button class="px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 disabled:opacity-50"
                      :disabled="iconModal.start === 0 || iconModal.loading" @click="prevPage">Prev</button>
              <button class="px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 disabled:opacity-50"
                      :disabled="iconModal.start + iconModal.limit >= iconModal.total || iconModal.loading" @click="nextPage">Next</button>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-gray-200 dark:border-neutral-800 flex justify-end">
          <button class="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700" @click="closeIconPicker">Close</button>
        </div>
      </div>
    </div>
    <!-- /ICON PICKER MODAL -->
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue'
import PondokPutriHero from '~/components/hero/GirlHero.vue'
import { Icon } from '@iconify/vue'
import { useNuxtApp } from '#app'
import { ref as dbRef, update } from 'firebase/database'

type CTA = { label: string; href: string; icon?: string }
type Shape = {
  eyebrow: string
  title: string
  description: string
  image: string
  ctaLocation: CTA
  ctaContact: CTA
}

const props = defineProps<{ section: { id: string; key: string; props?: Partial<Shape> } }>()

const defaults: Shape = {
  eyebrow: 'Informasi Pondok Putri',
  title: 'Pondok Pesantren ALBERR Putri',
  description:
    'Pondok Pesantren Al-Berr membuka unit pendidikan putri dengan sekitar 70 santri awal dan dibina ustadzah berkompeten. Mengusung kemandirian, disiplin, serta program pendidikan setara santri putra, unit ini menegaskan Al-Berr sebagai pesantren komprehensif bagi putra-putri. Kehadiran pondok putri menegaskan Al-Berr sebagai pesantren komprehensif yang melayani santri putra dan putri serta siap menghadapi tantangan zaman.',
  image: '/assets/images/gallery/5.jpg',
  ctaLocation: { label: 'Lihat Lokasi', href: 'https://maps.app.goo.gl/BTtkMt27swwav4TA8', icon: 'ph:map-pin-area' },
  ctaContact:  { label: 'Kontak Pengurus', href: 'tel:+6281234567890', icon: 'ph:phone-call' }
}

const tabs = ['Konten','CTA','Media','Preview'] as const
const activeTab = ref<typeof tabs[number]>('Konten')
const form = reactive<Shape>(merge(defaults, props.section?.props || {}))
const savedNote = ref(''); const errNote = ref(''); const progress = reactive<Record<string,number>>({})

watch(() => props.section?.props, (p) => {
  Object.assign(form, merge(defaults, p || {}))
})

function merge(b: Shape, p: Partial<Shape>): Shape {
  return {
    eyebrow: p.eyebrow ?? b.eyebrow,
    title: p.title ?? b.title,
    description: p.description ?? b.description,
    image: p.image ?? b.image,
    ctaLocation: { ...b.ctaLocation, ...(p.ctaLocation||{}) },
    ctaContact: { ...b.ctaContact, ...(p.ctaContact||{}) },
  }
}

const heroProps = computed(() => JSON.parse(JSON.stringify(form)))

/** SAVE -> /alberr/web/pages/home/sections/<uuid>/props */
async function save() {
  try {
    errNote.value = ''
    const { $realtimeDb } = useNuxtApp()

    const cleanId = (props.section?.id || '').replace(/^\/+|\/+$/g, '')
    const nodePath = cleanId.startsWith('home/sections/')
      ? `alberr/web/pages/${cleanId}/props`
      : `alberr/web/pages/home/sections/${cleanId}/props`

    await update(dbRef($realtimeDb), { [nodePath]: heroProps.value })
    savedNote.value = 'Tersimpan.'; setTimeout(()=>savedNote.value='', 1500)
  } catch (e:any) {
    errNote.value = e?.message || 'Gagal menyimpan'
  }
}

/** Upload image ke Firebase Storage */
async function upload(e: Event, key: 'image') {
  const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return
  progress[key] = 0
  try {
    const { getStorage, ref, uploadBytesResumable, getDownloadURL } = await import('firebase/storage')
    const storage = getStorage()
    const path = `alberr/web/pondokputrihero/${Date.now()}_${file.name.replace(/\s+/g,'_')}`
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

/* ===== Icon Picker (ringkas, dengan dukungan online Iconify) ===== */
type IconTab = 'All' | 'Phosphor' | 'Lucide' | 'Material'
type Target = 'loc' | 'contact'
const iconModal = reactive({
  show:false, target:'loc' as Target,
  tabs:['All','Phosphor','Lucide','Material'] as IconTab[],
  activeTab:'All' as IconTab,
  query:'', loading:false, allowOnline:true,
  visible:[] as string[], total:0, start:0, limit:48
})
const localIcons = ref<string[]>([
  'ph:map-pin-area','ph:map-trifold','ph:map-pin','ph:phone-call','ph:phone','ph:whatsapp-logo',
  'lucide:map-pin','lucide:phone','lucide:navigation-2',
  'mdi:map-marker','mdi:phone','mdi:whatsapp'
])
function openIconPicker(t:Target){ iconModal.target=t; iconModal.show=true; iconModal.query=''; setTab(iconModal.activeTab); iconModal.visible=filterLocal(iconModal.activeTab,''); iconModal.total=iconModal.visible.length }
function closeIconPicker(){ iconModal.show=false }
function setTab(tab:IconTab){ iconModal.activeTab=tab; iconModal.start=0; iconModal.visible=filterLocal(tab,iconModal.query); iconModal.total=iconModal.visible.length }
function filterLocal(tab:IconTab,q:string){
  const prefix = tab==='Phosphor'?'ph:' : tab==='Lucide'?'lucide:' : tab==='Material'?'mdi:' : ''
  return localIcons.value.filter(n => (!prefix || n.startsWith(prefix)) && (!q || n.toLowerCase().includes(q.toLowerCase())))
}
let si:any
function onSearchInput(){ clearTimeout(si); si=setTimeout(()=>{ iconModal.visible=filterLocal(iconModal.activeTab,iconModal.query); iconModal.total=iconModal.visible.length },200) }
async function searchOnline(force=false){
  try{
    iconModal.loading=true
    const q = iconModal.query.trim()
    if(!q && !force){ iconModal.visible=filterLocal(iconModal.activeTab,''); iconModal.total=iconModal.visible.length; return }
    const prefixes = iconModal.activeTab==='Phosphor'?'ph' : iconModal.activeTab==='Lucide'?'lucide' : iconModal.activeTab==='Material'?'mdi' : undefined
    const params = new URLSearchParams({ query:q||'', limit:String(iconModal.limit), start:String(iconModal.start) })
    if(prefixes) params.set('prefixes', prefixes)
    const res = await fetch(`https://api.iconify.design/search?${params.toString()}`)
    if(!res.ok) throw new Error('Iconify error')
    const data = await res.json() as { total?:number; start?:number; limit?:number; icons?:string[] }
    iconModal.visible = Array.isArray(data.icons) ? data.icons : []
    iconModal.total = typeof data.total==='number' ? data.total : iconModal.visible.length
    iconModal.start = typeof data.start==='number' ? data.start : 0
    iconModal.limit = typeof data.limit==='number' ? data.limit : 48
    if(!iconModal.visible.length){ iconModal.visible=filterLocal(iconModal.activeTab,q); iconModal.total=iconModal.visible.length; iconModal.start=0 }
  }catch{ iconModal.visible=filterLocal(iconModal.activeTab,iconModal.query); iconModal.total=iconModal.visible.length; iconModal.start=0 }
  finally{ iconModal.loading=false }
}
function nextPage(){ iconModal.start=Math.min(iconModal.start+iconModal.limit, Math.max(0,iconModal.total-iconModal.limit)); searchOnline(true) }
function prevPage(){ iconModal.start=Math.max(0, iconModal.start-iconModal.limit); searchOnline(true) }
function chooseIcon(name:string){
  if(iconModal.target==='loc') form.ctaLocation.icon = name
  else form.ctaContact.icon = name
  closeIconPicker()
}
</script>
