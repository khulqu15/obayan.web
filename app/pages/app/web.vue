<template>
  <div class="p-4">
    <div class="grid grid-cols-12 gap-4">
      <aside v-show="ui.showSidebar" class="col-span-12 lg:col-span-3">
        <div class="rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden">
          <div class="p-3 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
            <h2 class="font-semibold text-sm">Halaman</h2>
            <div class="flex items-center gap-1">
              <button class="px-2 py-1 text-xs rounded border dark:border-neutral-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800" @click="openNewPage">Baru</button>
              <button class="px-2 py-1 text-xs rounded border dark:border-neutral-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800" @click="reloadPages">Muat Ulang</button>
            </div>
          </div>
          <div class="p-3 border-b border-gray-200 dark:border-neutral-700">
            <div class="relative">
              <Icon icon="lucide:search" class="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input v-model="qPage" type="search" placeholder="Cari path/title…" class="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 w-full bg-white dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none">
            </div>
          </div>
          <ul class="max-h-[60vh] overflow-auto divide-y dark:divide-neutral-800">
            <li v-for="p in filteredPages" :key="p.pathKey"
                class="p-3 text-sm cursor-pointer border-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800"
                :class="isCurrent(p) ? 'bg-blue-50/60 dark:bg-blue-950/20' : ''"
                @click="selectPath(p.path)">
              <div class="flex items-center justify-between">
                <div class="min-w-0">
                  <p class="font-medium truncate">{{ p.title || p.path }}</p>
                  <p class="text-[11px] text-gray-500 dark:text-neutral-400 truncate">{{ p.path }}</p>
                </div>
                <span class="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded border border-gray-200"
                      :class="p.status==='published' ? 'border-emerald-300 text-emerald-700 dark:text-emerald-300' : 'border-amber-300 text-amber-700 dark:text-amber-300'">
                  {{ p.status==='published' ? 'Published' : 'Draft' }}
                </span>
              </div>
            </li>
          </ul>
        </div>
      </aside>

      <main :class="ui.showSidebar ? 'col-span-12 lg:col-span-9' : 'col-span-12'">
        <div class="rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3 flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 flex-wrap">
            <h1 class="text-base font-semibold">Editor Halaman</h1>
            <span class="text-sm text-gray-500">{{ currentPath }}</span>
            <a :href="currentPath" target="_blank" class="text-xs px-2 py-1 rounded border hover:bg-gray-50 border-gray-200 dark:border-neutral-700 dark:hover:bg-neutral-800">
              Lihat Halaman
            </a>
          </div>
          <div class="flex flex-wrap gap-1">
            <button class="text-xs px-2 py-1 rounded border hover:bg-gray-50 border-gray-200 dark:border-neutral-700 dark:hover:bg-neutral-800" @click="ui.showSidebar = !ui.showSidebar">
              {{ ui.showSidebar ? 'Sembunyikan Sidebar' : 'Tampilkan Sidebar' }}
            </button>
            <button class="text-xs px-2 py-1 rounded border hover:bg-gray-50 border-gray-200 dark:border-neutral-700 dark:hover:bg-neutral-800" @click="ui.showMeta = !ui.showMeta">
              {{ ui.showMeta ? 'Sembunyikan Meta' : 'Tampilkan Meta' }}
            </button>
            <button class="text-xs px-2 py-1 rounded border hover:bg-gray-50 border-gray-200 dark:border-neutral-700 dark:hover:bg-neutral-800" @click="openRenamePage" :disabled="!meta">Rename</button>
            <button class="text-xs px-2 py-1 rounded border hover:bg-gray-50 border-gray-200 dark:border-neutral-700 dark:hover:bg-neutral-800" @click="openClonePage" :disabled="!meta">Clone</button>
            <button class="text-xs px-2 py-1 rounded border text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20" @click="askDeletePage" :disabled="!meta">Hapus</button>
            <button class="text-xs px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700" @click="publish" :disabled="!meta || meta?.status==='published'">Publish</button>
          </div>
        </div>

        <div class="mt-4 grid gap-4 lg:grid-cols-5">
          <section v-show="ui.showMeta" class="lg:col-span-2 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4">
            <h3 class="font-semibold">Meta</h3>
            <div class="mt-3 space-y-3">
              <div>
                <label class="text-xs text-gray-500">Path</label>
                <input type="text" :value="currentPath" readonly class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700">
              </div>
              <div>
                <label class="text-xs text-gray-500">Judul</label>
                <input type="text" v-model.trim="formMeta.title" @input="debouncedSaveMeta()" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
              </div>
              <div>
                <label class="text-xs text-gray-500">Deskripsi</label>
                <textarea rows="3" v-model.trim="formMeta.description" @input="debouncedSaveMeta()" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"></textarea>
              </div>
              <div class="flex items-center justify-between">
                <label class="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" :checked="meta?.status==='published'" @change="toggleStatus" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                  Published
                </label>
                <span class="text-xs text-gray-500">Status saat ini: <b>{{ meta?.status || 'draft' }}</b></span>
              </div>

              <div class="pt-2 border-t border-gray-200 dark:border-neutral-800">
                <label class="text-xs text-gray-500">OG Image</label>
                <div class="mt-1 flex items-center gap-3">
                  <input ref="ogPicker" type="file" accept="image/*" class="hidden" @change="onPickOg">
                  <button class="px-2 py-1 text-xs rounded-md border hover:bg-gray-50 border-gray-200 dark:border-neutral-700 dark:hover:bg-neutral-800" @click="ogPicker?.click()">Upload</button>
                  <button v-if="meta?.ogImage" class="px-2 py-1 text-xs rounded-md border text-rose-600 hover:bg-rose-50 dark:border-neutral-700 dark:hover:bg-neutral-800" @click="removeOg">Hapus</button>
                </div>
                <div v-if="meta?.ogImage" class="mt-2">
                  <img :src="meta.ogImage" alt="OG" class="w-full rounded-lg border border-gray-200 dark:border-neutral-700">
                </div>
              </div>
            </div>
          </section>

          <section :class="ui.showMeta ? 'lg:col-span-3' : 'lg:col-span-5'" class="rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <input v-model.trim="newSection.key" placeholder="Key komponen (mis. HeaderHero, InfoHero)" class="pl-3 pr-3 py-2 text-sm rounded-lg border w-64 border-gray-200 dark:bg-neutral-900 dark:border-neutral-700 focus:outline-none">
                <button class="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700" @click="addNewSection" :disabled="!newSection.key">Tambah</button>
              </div>
            </div>

            <div class="flex gap-1 flex-wrap mt-3 mb-1">
              <button v-for="tab in sortedSections" :key="tab.id"
                      class="px-3 py-2 text-xs rounded-lg"
                      :class="activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-300'"
                      @click="activeTab = tab.key">
                {{ tab.key }}
              </button>
            </div>

            <div class="mt-4 space-y-3">
              <div v-for="(s, i) in sortedSections" :key="s.id" :class="{'hidden': s.key != activeTab}" class="rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
                <div class="p-3 flex items-center flex-wrap justify-between gap-2 border-b border-gray-200 dark:border-neutral-800">
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="inline-flex items-center justify-center w-6 h-6 text-[11px] rounded bg-gray-100 dark:bg-neutral-800">{{ i+1 }}</span>
                      <input v-model.trim="localEdits[s.id].key" class="px-2 py-1 rounded border border-gray-200 text-sm w-48 dark:bg-neutral-900 dark:border-neutral-700" @change="saveSection(s.id, { key: localEdits[s.id].key })">
                      <span class="text-[11px] text-gray-500">ID: {{ s.id }}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-1">
                    <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50 border-gray-200 dark:border-neutral-700 dark:hover:bg-neutral-800" :disabled="i===0" @click="moveUp(s.id)">
                      <Icon icon="lucide:arrow-up" class="size-4" />
                    </button>
                    <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50 border-gray-200 dark:border-neutral-700 dark:hover:bg-neutral-800" :disabled="i===sortedSections.length-1" @click="moveDown(s.id)">
                      <Icon icon="lucide:arrow-down" class="size-4" />
                    </button>
                    <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50 border-gray-200 dark:border-neutral-700 dark:hover:bg-neutral-800" @click="duplicateSec(s.id)">Duplikat</button>
                    <button class="px-2 py-1 text-xs rounded border text-rose-600 hover:bg-rose-50 dark:border-neutral-700 dark:hover:bg-neutral-800" @click="deleteSec(s.id)">Hapus</button>
                    <label class="inline-flex items-center gap-1 text-xs ml-2">
                      <input type="checkbox" v-model="localEdits[s.id].enabled" @change="saveSection(s.id, { enabled: localEdits[s.id].enabled })" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                      Aktif
                    </label>
                  </div>
                </div>

                <div class="p-3">
                  <EditorHeaderHero v-if="s.key === 'HeaderHero'" :section="s" />
                  <EditorInfoHero v-else-if="s.key === 'InfoHero'" :section="s" />
                  <EditorInvitationHero v-else-if="s.key === 'InvitationHero'" :section="s" />
                  <EditorFacilityHero v-else-if="s.key === 'HeroFacilityHero'" :section="s" />
                  <EditorBlogHero v-else-if="s.key === 'BlogHero'" :section="s" />
                  <EditorNewsPage v-else-if="s.key === 'NewsPage'" :section="s" :pagePath="currentPath" :web="web"/>
                  <EditorGalleryPage v-else-if="s.key === 'GalleryPage'" :section="s" :pagePath="currentPath" :web="web"/>
                  <EditorProfilePage v-else-if="s.key === 'ProfilePage'" :section="s" :pagePath="currentPath" :web="web"/>
                  <EditorProgramPage v-else-if="s.key === 'ProgramPage'" :section="s" :pagePath="currentPath" :web="web"/>
                  <template v-else>
                    <label class="text-xs text-gray-500">Props (JSON)</label>
                    <textarea v-model="localEdits[s.id].propsText" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm min-h-28 font-mono dark:bg-neutral-900 dark:border-neutral-700" @input="validateJson(s.id)"></textarea>
                    <div class="mt-1 flex items-center justify-between">
                      <p class="text-[11px]" :class="jsonErrors[s.id] ? 'text-rose-600' : 'text-emerald-600'">
                        {{ jsonErrors[s.id] ? jsonErrors[s.id] : 'JSON valid' }}
                      </p>
                      <div class="flex items-center gap-2">
                        <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50 border-gray-200 dark:border-neutral-700 dark:hover:bg-neutral-800" @click="resetPropsFromServer(s.id)">
                          Reset
                        </button>
                        <button class="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700" :disabled="!!jsonErrors[s.id]" @click="saveProps(s.id)">
                          Simpan Props
                        </button>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>

    <!-- Modals -->
    <teleport to="body">
      <!-- New Page -->
      <div v-if="modal.newPage" class="fixed inset-0 z-[100]">
        <div class="absolute inset-0 bg-black/40" @click="modal.newPage=false"></div>
        <div class="absolute inset-0 p-4 flex items-center justify-center">
          <div class="w-full max-w-md rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
            <div class="p-4 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
              <h3 class="font-semibold">Halaman Baru</h3>
              <button class="p-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-800" @click="modal.newPage=false">
                <Icon icon="lucide:x" class="size-4" />
              </button>
            </div>
            <div class="p-4 space-y-3">
              <div>
                <label class="text-xs text-gray-500">Path</label>
                <input v-model.trim="formNew.path" placeholder="/, /profile, /program" class="mt-1 w-full rounded border px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
              </div>
              <div>
                <label class="text-xs text-gray-500">Judul</label>
                <input v-model.trim="formNew.title" class="mt-1 w-full rounded border px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
              </div>
              <div>
                <label class="text-xs text-gray-500">Deskripsi</label>
                <textarea v-model.trim="formNew.description" rows="2" class="mt-1 w-full rounded border px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"></textarea>
              </div>
            </div>
            <div class="p-4 border-t dark:border-neutral-700 flex items-center justify-end gap-2">
              <button class="px-3 py-1.5 rounded border hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800" @click="modal.newPage=false">Batal</button>
              <button class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700" @click="createPageNow">Buat</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Rename -->
      <div v-if="modal.rename" class="fixed inset-0 z-[100]">
        <div class="absolute inset-0 bg-black/40" @click="modal.rename=false"></div>
        <div class="absolute inset-0 p-4 flex items-center justify-center">
          <div class="w-full max-w-md rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
            <div class="p-4 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
              <h3 class="font-semibold">Rename Path</h3>
              <button class="p-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-800" @click="modal.rename=false">
                <Icon icon="lucide:x" class="size-4" />
              </button>
            </div>
            <div class="p-4 space-y-3">
              <div>
                <label class="text-xs text-gray-500">Path Lama</label>
                <input :value="currentPath" readonly class="mt-1 w-full rounded border px-3 py-2 text-sm bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700">
              </div>
              <div>
                <label class="text-xs text-gray-500">Path Baru</label>
                <input v-model.trim="formRename.newPath" placeholder="/profile, /program" class="mt-1 w-full rounded border px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
              </div>
            </div>
            <div class="p-4 border-t dark:border-neutral-700 flex items-center justify-end gap-2">
              <button class="px-3 py-1.5 rounded border hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800" @click="modal.rename=false">Batal</button>
              <button class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700" @click="renameNow">Rename</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Clone -->
      <div v-if="modal.clone" class="fixed inset-0 z-[100]">
        <div class="absolute inset-0 bg-black/40" @click="modal.clone=false"></div>
        <div class="absolute inset-0 p-4 flex items-center justify-center">
          <div class="w-full max-w-md rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
            <div class="p-4 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
              <h3 class="font-semibold">Clone Halaman</h3>
              <button class="p-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-800" @click="modal.clone=false">
                <Icon icon="lucide:x" class="size-4" />
              </button>
            </div>
            <div class="p-4 space-y-3">
              <div>
                <label class="text-xs text-gray-500">Sumber</label>
                <input :value="currentPath" readonly class="mt-1 w-full rounded border px-3 py-2 text-sm bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700">
              </div>
              <div>
                <label class="text-xs text-gray-500">Path Baru</label>
                <input v-model.trim="formClone.dstPath" placeholder="/new-page" class="mt-1 w-full rounded border px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700">
              </div>
            </div>
            <div class="p-4 border-t dark:border-neutral-700 flex items-center justify-end gap-2">
              <button class="px-3 py-1.5 rounded border hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800" @click="modal.clone=false">Batal</button>
              <button class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700" @click="cloneNow">Clone</button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWeb } from '~/composables/data/useWeb'

import EditorHeaderHero from '~/components/editor/HeaderHero.vue'
import EditorInfoHero from '~/components/editor/InfoHero.vue'
import EditorInvitationHero from '~/components/editor/InvitationHero.vue'
import EditorFacilityHero from '~/components/editor/FacilityHero.vue'
import EditorBlogHero from '~/components/editor/BlogHero.vue'
import EditorNewsPage from '~/components/editor/NewsPage.vue'

definePageMeta({ layout: 'app', layoutProps: { title: 'Website' } })

const activeTab = ref<string>('') 

const {
  pages, subscribePages,
  meta, sections, sortedSections,
  subscribePage,
  upsertMeta, uploadOgImage, deleteOgImage,
  addSection, updateSection, duplicateSection, deleteSection,
  moveSection,
  createPage, deletePage, renamePage, clonePage, publishPage,
  normalizePath, currentPath, currentKey
} = useWeb()

const web = useWeb()
const ensureActivePath = (p = currentPath.value) => {
  ;(web as any)?.setActivePath?.(p)
}

const ui = reactive({ showSidebar: true, showMeta: true })

const route = useRoute()
const router = useRouter()
watch(() => route.query.path, (p) => {
  const np = normalizePath(String(p || '/'))
  if (np !== currentPath.value) currentPath.value = np
}, { immediate: true })
watch(currentPath, async (p) => {
  await subscribePage(p)
  hydrateMetaForm()
  await nextTick()
}, { immediate: true })
function selectPath(p: string) { router.replace({ query: { ...route.query, path: normalizePath(p) } }) }
function isCurrent(p: any) { return normalizePath(p.path) === currentPath.value }

/* ---------------- Sidebar search ---------------- */
const qPage = ref('')
const filteredPages = computed(() => {
  const q = qPage.value.trim().toLowerCase()
  if (!q) return pages.value
  return pages.value.filter(p =>
    (p.path || '').toLowerCase().includes(q) ||
    (p.title || '').toLowerCase().includes(q)
  )
})

/* ---------------- Meta form ---------------- */
const formMeta = reactive<{ title: string; description: string }>({ title: '', description: '' })
function hydrateMetaForm() {
  formMeta.title = meta.value?.title || ''
  formMeta.description = meta.value?.description || ''
}
let metaSaveTimer: any = null
function debouncedSaveMeta() {
  clearTimeout(metaSaveTimer)
  metaSaveTimer = setTimeout(() => {
    upsertMeta({ title: formMeta.title, description: formMeta.description })
  }, 450)
}
function toggleStatus(e: Event) {
  const checked = (e.target as HTMLInputElement).checked
  upsertMeta({ status: checked ? 'published' : 'draft' })
}
const ogPicker = ref<HTMLInputElement | null>(null)
async function onPickOg(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0] || null
  if (!f) return
  const up = await uploadOgImage(f)
  if (up.url) await upsertMeta({ ogImage: up.url, ogImagePath: up.path })
  if (ogPicker.value) ogPicker.value.value = ''
}
async function removeOg() {
  if (!meta.value?.ogImagePath) { await upsertMeta({ ogImage: null, ogImagePath: null }); return }
  try { await deleteOgImage(meta.value.ogImagePath) } catch {}
  await upsertMeta({ ogImage: null, ogImagePath: null })
}

watch(sortedSections, (list) => {
  const keys = list.map(s => s.key)
  if (!keys.length) {
    activeTab.value = ''
    return
  }
  if (!keys.includes(activeTab.value)) {
    activeTab.value = keys[0]! // pick pertama
  }
}, { immediate: true })

watch(currentPath, async (p) => {
  activeTab.value = ''
  await subscribePage(p)
  hydrateMetaForm()
  await nextTick()
}, { immediate: true })

const newSection = reactive<{ key: string }>({ key: '' })
async function addNewSection() {
  const key = newSection.key.trim()
  if (!key) return
  ensureActivePath()
  await addSection({ key, enabled: true })
  activeTab.value = key
  await nextTick()
}
const localEdits = reactive<Record<string, { key: string; enabled: boolean; propsText: string }>>({})
const jsonErrors = reactive<Record<string, string | ''>>({})
watch(sections, (list) => {
  for (const s of list) {
    if (!localEdits[s.id]) {
      localEdits[s.id] = {
        key: s.key,
        enabled: s.enabled,
        propsText: s.props ? JSON.stringify(s.props, null, 2) : ''
      }
      jsonErrors[s.id] = ''
    }
  }
  // cleanup removed
  const ids = new Set(list.map(s => s.id))
  for (const k of Object.keys(localEdits)) if (!ids.has(k)) delete localEdits[k]
}, { immediate: true })

function validateJson(id: string) {
  const t = localEdits[id]?.propsText || ''
  if (!t.trim()) { jsonErrors[id] = ''; return }
  try { JSON.parse(t); jsonErrors[id] = '' } catch (e:any) { jsonErrors[id] = e?.message || 'JSON invalid' }
}
async function saveSection(id: string, patch: { key?: string; enabled?: boolean }) {
  ensureActivePath()
  await updateSection(id, patch)
}
async function saveProps(id: string) {
  if (jsonErrors[id]) return
  ensureActivePath()
  const t = localEdits[id]?.propsText || ''
  const props = t.trim() ? JSON.parse(t) : null
  await updateSection(id, { props })
}
function resetPropsFromServer(id: string) {
  const s = sections.value.find(x => x.id === id)
  if (!s) return
  localEdits[id]!.propsText = s.props ? JSON.stringify(s.props, null, 2) : ''
  jsonErrors[id] = ''
}
async function duplicateSec(id: string) {
  ensureActivePath()
  const src = sections.value.find(x => x.id === id)
  await duplicateSection(id)
  if (src?.key) activeTab.value = src.key 
}
async function deleteSec(id: string) { 
  if (!confirm('Hapus section ini?')) return; 
  ensureActivePath(); 
  await deleteSection(id) 
}
async function moveUp(id: string) { 
  ensureActivePath(); 
  await moveSection(id, 'up') 
}
async function moveDown(id: string) { 
  ensureActivePath(); 
  await moveSection(id, 'down') 
}

const modal = reactive<{ newPage: boolean; rename: boolean; clone: boolean }>({ newPage: false, rename: false, clone: false })
const formNew = reactive<{ path: string; title: string; description: string }>({ path: '/', title: '', description: '' })
function openNewPage() { formNew.path = '/'; formNew.title = ''; formNew.description = ''; modal.newPage = true }
async function createPageNow() {
  const p = normalizePath(formNew.path || '/')
  await createPage({ path: p, title: formNew.title, description: formNew.description, status: 'draft' })
  modal.newPage = false
  selectPath(p)
}
function openRenamePage() { formRename.newPath = currentPath.value; modal.rename = true }
const formRename = reactive<{ newPath: string }>({ newPath: '/' })
async function renameNow() {
  const np = normalizePath(formRename.newPath || '/')
  const old = currentPath.value
  if (np === old) { modal.rename = false; return }
  await renamePage(old, np)
  modal.rename = false
  selectPath(np)
}
function openClonePage() { formClone.dstPath = '/'; modal.clone = true }
const formClone = reactive<{ dstPath: string }>({ dstPath: '/' })
async function cloneNow() {
  const dst = normalizePath(formClone.dstPath || '/')
  await clonePage(currentPath.value, dst)
  modal.clone = false
  selectPath(dst)
}
async function askDeletePage() {
  if (!confirm(`Hapus halaman "${currentPath.value}" beserta seluruh section?`)) return
  await deletePage(currentPath.value)
  selectPath('/')
}
async function publish() { 
  ensureActivePath(); 
  await publishPage(currentPath.value) 
}
async function reloadPages() { subscribePages() }
watch(currentPath, (p) => {
  ensureActivePath(p)
})
onMounted(() => { subscribePages() })
</script>
