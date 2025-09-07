<template>
  <div class="p-6 space-y-6 text-gray-800 dark:text-neutral-300">
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-semibold">Kontak & Media Sosial</h1>
      <div class="flex gap-2">
        <button
          class="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
          @click="resetToDefault"
        >Isi Default</button>
        <button
          class="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          @click="save"
          :disabled="saving"
        >
          {{ saving ? 'Menyimpan…' : 'Simpan' }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Kontak -->
      <div class="lg:col-span-2 p-4 rounded-xl border border-gray-200 bg-white shadow-2xs dark:bg-neutral-800 dark:border-neutral-700 space-y-3">
        <h3 class="font-semibold">Informasi Kontak</h3>
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-gray-500 dark:text-neutral-400">Email</label>
            <input v-model.trim="form.contact.email" type="email" :class="inputBase" />
          </div>
          <div>
            <label class="text-xs text-gray-500 dark:text-neutral-400">Telepon</label>
            <input v-model.trim="form.contact.phone" type="text" :class="inputBase" />
          </div>
          <div>
            <label class="text-xs text-gray-500 dark:text-neutral-400">WA (intl)</label>
            <input v-model.trim="form.contact.waIntl" type="text" placeholder="62xxxxxxxxxx" :class="inputBase" />
          </div>
          <div>
            <label class="text-xs text-gray-500 dark:text-neutral-400">Petunjuk Arah (query)</label>
            <input v-model.trim="form.contact.mapQuery" type="text" :class="inputBase" />
          </div>
          <div class="sm:col-span-2">
            <label class="text-xs text-gray-500 dark:text-neutral-400">Alamat</label>
            <textarea v-model.trim="form.contact.address" rows="2" :class="inputBase"></textarea>
          </div>
          <div class="sm:col-span-2">
            <label class="text-xs text-gray-500 dark:text-neutral-400">Google Maps Embed SRC</label>
            <input
              v-model.trim="form.contact.mapEmbedSrc"
              type="text"
              :class="inputBase"
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <p class="text-[11px] text-gray-500 mt-1">Tempel nilai atribut <code>src</code> dari embed Google Maps.</p>
          </div>
        </div>

        <div class="pt-3 border-t border-gray-200 dark:border-neutral-700">
          <h4 class="font-medium mb-2">Jam Layanan</h4>
          <div class="space-y-2">
            <div v-for="(h, i) in form.contact.hours" :key="i" class="flex gap-2">
              <input
                v-model.trim="form.contact.hours[i]"
                :class="inputBase"
                class="flex-1"
                placeholder="cth: Senin–Jumat 08.00–15.30 WIB"
              />
              <button
                class="px-2 py-1 text-xs rounded-md border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
                @click="removeHour(i)"
              >Hapus</button>
            </div>
            <button
              class="px-2 py-1 text-xs rounded-md border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
              @click="form.contact.hours.push('')"
            >Tambah Baris</button>
          </div>
        </div>
      </div>

      <!-- Sosial -->
      <div class="p-4 rounded-xl border border-gray-200 bg-white shadow-2xs dark:bg-neutral-800 dark:border-neutral-700 space-y-3">
        <h3 class="font-semibold">Media Sosial</h3>
        <div class="space-y-3">
          <div
            v-for="(s, i) in form.socials"
            :key="i"
            class="rounded-lg border border-gray-200 p-3 dark:border-neutral-700"
          >
            <div class="grid gap-2">
              <div>
                <label class="text-xs text-gray-500 dark:text-neutral-400">Label</label>
                <input v-model.trim="form.socials[i].label" :class="inputBase" />
              </div>
              <div>
                <label class="text-xs text-gray-500 dark:text-neutral-400">URL</label>
                <input v-model.trim="form.socials[i].href" :class="inputBase" placeholder="https://..." />
              </div>
              <div>
                <label class="text-xs text-gray-500 dark:text-neutral-400">Icon (Iconify)</label>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="px-2 py-1 text-xs rounded-md border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
                    @click="openIconPicker(i)"
                  >Pilih</button>
                  <ClientOnly>
                    <Icon v-if="form.socials[i].icon" :icon="form.socials[i].icon" class="size-5 text-gray-700 dark:text-neutral-200" />
                  </ClientOnly>
                </div>
              </div>
              <div class="flex justify-end">
                <button
                  class="px-2 py-1 text-xs rounded-md border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
                  @click="form.socials.splice(i,1)"
                >Hapus</button>
              </div>
            </div>
          </div>
          <button
            class="w-full px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
            @click="addSocial"
          >Tambah Sosial</button>
        </div>

        <div class="pt-3 border-t border-gray-200 dark:border-neutral-700">
          <h3 class="font-semibold">Brand Footer (opsional)</h3>
          <div>
            <label class="text-xs text-gray-500 dark:text-neutral-400">Nama Brand</label>
            <input v-model.trim="form.footer.brand.name" :class="inputBase" />
          </div>
          <div class="mt-2">
            <label class="text-xs text-gray-500 dark:text-neutral-400">Deskripsi</label>
            <textarea v-model.trim="form.footer.brand.desc" rows="2" :class="inputBase"></textarea>
          </div>
        </div>
      </div>
    </div>

    <p v-if="note" class="text-[12px]" :class="ok ? 'text-emerald-600' : 'text-rose-600'">{{ note }}</p>

    <!-- Icon Picker Modal -->
    <div
      v-if="iconModal.show"
      class="fixed left-0 top-0 w-full z-[1002] h-screen flex items-start py-24 overflow-y-auto justify-center bg-black/0 px-4"
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
              placeholder="Search icons (e.g. instagram, youtube, phone)"
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
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import { ref as dbRef, get, update } from 'firebase/database'
import { Icon } from '@iconify/vue'

type Social = { label:string; href:string; icon:string }
type Shape = {
  contact: {
    address: string
    email: string
    phone: string
    waIntl: string
    mapEmbedSrc: string
    mapQuery: string
    hours: string[]
  },
  socials: Social[],
  footer: { brand: { name: string; desc: string } }
}

definePageMeta({ layout: 'app', layoutProps: { title: 'Kontak' } })

const year = new Date().getFullYear()
const defaults: Shape = {
  contact: {
    address: 'Jl. Pesantren No. 1, Pandaan, Pasuruan, Jawa Timur 67156',
    email: 'info@alberr.sch.id',
    phone: '085856376399',
    waIntl: '6285856376399',
    mapQuery: 'Pondok Pesantren Alberr, Pandaan, Pasuruan',
    mapEmbedSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.154822990777!2d112.68858257934568!3d-7.666498699999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7d9e72d847345%3A0xb58b63681aec9b37!2sPondok%20Pesantren%20ALBERR%20(Putra)%20-%20Karangjati%20Pandaan!5e0!3m2!1sid!2sid!4v1755450928977!5m2!1sid!2sid',
    hours: ['Senin–Jumat 08.00–15.30 WIB', 'Sabtu 08.00–12.00 WIB']
  },
  socials: [
    { label: 'Instagram', href: '#', icon: 'mdi:instagram' },
    { label: 'YouTube', href: '#', icon: 'mdi:youtube' },
    { label: 'Facebook', href: '#', icon: 'mdi:facebook' },
  ],
  footer: { brand: { name: 'ALBERR', desc: `© ${year} Ponpes Alberr.` } }
}

const form = reactive<Shape>(JSON.parse(JSON.stringify(defaults)))
const inputBase = 'py-2.5 px-3 w-full border border-gray-200 rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-700'
const saving = ref(false); const note = ref(''); const ok = ref(false)

/* === Icon Picker State === */
type TabName = 'Popular' | 'Online'
const iconModal = reactive({
  show: false,
  tabs: ['Popular', 'Online'] as TabName[],
  activeTab: 'Popular' as TabName,
  allowOnline: true,
  query: '',
  loading: false,
  limit: 72,
  start: 0,
  total: 0,
  visible: [] as string[],
  popular: [
    'mdi:instagram','mdi:youtube','mdi:facebook','mdi:twitter','mdi:tiktok',
    'mdi:whatsapp','mdi:telegram','mdi:linkedin','mdi:web','mdi:email',
    'mdi:phone','mdi:map-marker','ph:instagram-logo','ph:youtube-logo',
    'ph:facebook-logo','ph:whatsapp-logo','ph:telegram-logo','ph:globe',
    'ph:phone','ph:envelope-simple','ph:map-pin','mdi:school','mdi:google',
  ] as string[],
  targetIndex: -1
})

function setTab(t: TabName) {
  iconModal.activeTab = t
  if (t === 'Popular') {
    iconModal.visible = iconModal.popular.slice()
  } else if (t === 'Online') {
    // jangan fetch otomatis tanpa query; biar user ketik dulu
    iconModal.visible = []
  }
}

let iconSearchTimer: any = null
function onSearchInput() {
  iconModal.start = 0
  if (iconModal.activeTab !== 'Online') iconModal.activeTab = 'Online'
  if (iconSearchTimer) clearTimeout(iconSearchTimer)
  iconSearchTimer = setTimeout(() => searchOnline(), 400)
}

async function searchOnline(force = false) {
  if (!process.client) return
  if (!iconModal.allowOnline) return
  const q = iconModal.query.trim()
  if (!q && !force) return

  try {
    iconModal.loading = true
    const url = `https://api.iconify.design/search?query=${encodeURIComponent(q || 'logo')}&limit=${iconModal.limit}&start=${iconModal.start}`
    const res = await fetch(url)
    const json = await res.json().catch(() => ({}))
    const icons: string[] = Array.isArray(json?.icons) ? json.icons : []
    iconModal.visible = icons
    iconModal.total = Number(json?.total || icons.length || 0)
  } catch (e) {
    iconModal.visible = []
    iconModal.total = 0
  } finally {
    iconModal.loading = false
  }
}
function prevPage() {
  if (iconModal.start === 0) return
  iconModal.start = Math.max(0, iconModal.start - iconModal.limit)
  searchOnline(true)
}
function nextPage() {
  if (iconModal.start + iconModal.limit >= iconModal.total) return
  iconModal.start = iconModal.start + iconModal.limit
  searchOnline(true)
}
function openIconPicker(index: number) {
  iconModal.targetIndex = index
  iconModal.query = ''
  iconModal.start = 0
  iconModal.total = 0
  iconModal.activeTab = 'Popular'
  iconModal.visible = iconModal.popular.slice()
  iconModal.show = true
}
function closeIconPicker() {
  iconModal.show = false
  iconModal.targetIndex = -1
}
function chooseIcon(name: string) {
  if (iconModal.targetIndex >= 0) {
    form.socials[iconModal.targetIndex].icon = name
  }
  closeIconPicker()
}

/* === Form logic === */
function removeHour(i: number){ form.contact.hours.splice(i,1) }
function addSocial(){ form.socials.push({ label:'Instagram', href:'#', icon:'mdi:instagram' }) }
function resetToDefault(){ Object.assign(form, JSON.parse(JSON.stringify(defaults))) }

/* === RTDB load/save (/alberr/contact) === */
async function load() {
  try {
    const { $realtimeDb } = useNuxtApp() as any
    const snap = await get(dbRef($realtimeDb, 'alberr/contact'))
    if (snap.exists()) {
      const data = snap.val() as Partial<Shape>
      const merged = {
        ...defaults,
        ...data,
        contact: { ...defaults.contact, ...(data.contact || {}) },
        footer: { brand: { ...defaults.footer.brand, ...(data.footer?.brand || {}) } },
        socials: Array.isArray(data.socials) ? data.socials : defaults.socials
      }
      Object.assign(form, JSON.parse(JSON.stringify(merged)))
    }
  } catch (e) {
    // silent
  }
}
async function save() {
  try {
    saving.value = true; ok.value = false; note.value = ''
    const { $realtimeDb } = useNuxtApp() as any
    const payload = JSON.parse(JSON.stringify(form))
    await update(dbRef($realtimeDb), { 'alberr/contact': payload })
    ok.value = true; note.value = 'Tersimpan.'; setTimeout(()=>note.value='', 1500)
  } catch (e:any) {
    ok.value = false; note.value = e?.message || 'Gagal menyimpan'
  } finally {
    saving.value = false
  }
}
onMounted(load)
</script>
