<template>
  <div class="p-5 md:p-8 text-gray-800 dark:text-neutral-200">
    <!-- Page Head -->
    <div class="flex items-center gap-3 mb-6">
      <ClientOnly>
        <Icon icon="ph:layout" class="size-6" />
      </ClientOnly>
      <div>
        <h1 class="text-xl font-semibold">Navbar Editor</h1>
        <p class="text-sm text-gray-500 dark:text-neutral-400">Kelola brand, tautan, dan mega menu untuk AppNavbar.vue</p>
      </div>
      <span class="ml-auto inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full"
            :class="isDirty ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300' : 'bg-emerald-100 text-green-700 dark:bg-emerald-500/10 dark:text-green-300'">
        <ClientOnly><Icon :icon="isDirty ? 'lucide:dot' : 'lucide:check'" class="size-3"/></ClientOnly>
        {{ isDirty ? 'Perubahan belum disimpan' : 'Tersimpan' }}
      </span>
      <button @click="saveAll" :disabled="saving" class="ml-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60">
        <ClientOnly><Icon icon="lucide:save" class="size-4"/></ClientOnly>
        {{ saving ? 'Menyimpan...' : 'Simpan' }}
      </button>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <!-- Brand -->
      <section class="col-span-12 lg:col-span-6">
        <div class="rounded-xl border border-gray-200 dark:border-neutral-700 p-4 bg-white dark:bg-neutral-900">
          <h2 class="font-semibold mb-3">Brand</h2>
          <div class="grid grid-cols-2 gap-3">
            <label class="block">
              <span class="text-sm">Nama Brand</span>
              <input v-model="form.brand" type="text" class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40" placeholder="Pondok Pesantren ALBERR"/>
            </label>
            <label class="block">
              <span class="text-sm">Brand Short</span>
              <input v-model="form.brandShorten" type="text" class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40" placeholder="ALBERR"/>
            </label>
          </div>
        </div>
      </section>

      <!-- Cover Ponpes -->
      <section class="col-span-12 lg:col-span-6">
        <div class="rounded-xl border border-gray-200 dark:border-neutral-700 p-4 bg-white dark:bg-neutral-900">
          <div class="flex items-center justify-between mb-3">
            <h2 class="font-semibold">Cover Ponpes</h2>
            <button class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800" @click="() => coverInput?.click()">
              <ClientOnly><Icon icon="lucide:upload" class="size-4"/></ClientOnly>
              Upload Gambar
            </button>
            <input ref="coverInput" type="file" accept="image/*" class="hidden" @change="onUploadCoverPonpes"/>
          </div>
          <div class="grid grid-cols-12 gap-3 items-start">
            <div class="col-span-12 md:col-span-7">
              <div class="aspect-[16/9] rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
                <img v-if="form.coverPonpes" :src="form.coverPonpes" alt="Cover Ponpes" class="w-full h-full object-cover"/>
                <div v-else class="text-sm text-gray-500">Belum ada gambar</div>
              </div>
            </div>
            <div class="col-span-12 md:col-span-5 space-y-3">
              <div v-if="upload.cover.active" class="space-y-2">
                <p class="text-xs text-gray-500">Mengupload: {{ upload.cover.progress }}%</p>
                <div class="w-full h-2 rounded bg-gray-200 dark:bg-neutral-700 overflow-hidden">
                  <div class="h-full bg-blue-600" :style="{ width: upload.cover.progress + '%' }"></div>
                </div>
              </div>
              <p class="text-xs text-gray-500 break-all">URL: <span class="">{{ form.coverPonpes || '-' }}</span></p>
            </div>
          </div>
        </div>
      </section>

      <!-- Nav Links -->
      <section class="col-span-12 lg:col-span-6">
        <div class="rounded-xl border border-gray-200 dark:border-neutral-700 p-4 bg-white dark:bg-neutral-900">
          <div class="flex items-center justify-between mb-3">
            <h2 class="font-semibold">Nav Links</h2>
            <button class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800" @click="addLink"><ClientOnly><Icon icon="lucide:plus" class="size-4"/></ClientOnly>Tambah</button>
          </div>
          <div class="space-y-2">
            <div v-for="(l,i) in form.navLinks" :key="i" class="rounded-lg border border-gray-200 dark:border-neutral-700 p-3 flex items-center gap-2">
              <ClientOnly><Icon :icon="l.icon||'ph:dot-outline'" class="size-5 text-gray-600"/></ClientOnly>
              <input v-model="l.label" class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 flex-1" placeholder="Label"/>
              <input v-model="l.href" class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 flex-1" placeholder="/path#anchor"/>
              <button class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800" @click="openIconPicker((icon) => l.icon = icon)">
                <ClientOnly><Icon icon="lucide:square-pen" class="size-4"/></ClientOnly>
                Icon
              </button>
              <button class="inline-flex items-center gap-2 px-2.5 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700" @click="form.navLinks.splice(i,1)"><ClientOnly><Icon icon="lucide:trash" class="size-4"/></ClientOnly></button>
            </div>
          </div>
        </div>
      </section>

      <!-- Mega Menu -->
      <section class="col-span-12 lg:col-span-6">
        <div class="rounded-xl border border-gray-200 dark:border-neutral-700 p-4 bg-white dark:bg-neutral-900">
          <div class="flex items-center justify-between mb-3">
            <h2 class="font-semibold">Mega Menu</h2>
            <button class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800" @click="addGroup"><ClientOnly><Icon icon="lucide:plus" class="size-4"/></ClientOnly>Tambah Grup</button>
          </div>

          <div class="space-y-5">
            <div v-for="(g,gidx) in form.megaMenu" :key="gidx" class="rounded-lg border border-gray-200 dark:border-neutral-700 p-3">
              <div class="flex items-center gap-3 mb-3">
                <input v-model="g.title" class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 font-medium"/>
                <button class="ml-auto btn-danger" @click="form.megaMenu.splice(gidx,1)"><ClientOnly><Icon icon="lucide:trash" class="size-4"/></ClientOnly></button>
              </div>

              <div class="space-y-2">
                <div v-for="(it,idx) in g.items" :key="idx" class="rounded-lg border border-gray-200 dark:border-neutral-700 p-3">
                  <div class="flex items-center gap-2">
                    <ClientOnly><Icon :icon="it.icon||'ph:square'" class="size-5 text-gray-600"/></ClientOnly>
                    <input v-model="it.label" class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 flex-1" placeholder="Label"/>
                    <button class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800" @click="() => openItemModal(gidx, idx)"><ClientOnly><Icon icon="lucide:maximize" class="size-4"/></ClientOnly>Edit</button>
                    <button class="inline-flex items-center gap-2 px-2.5 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700" @click="g.items.splice(idx,1)"><ClientOnly><Icon icon="lucide:trash" class="size-4"/></ClientOnly></button>
                  </div>
                  <div class="mt-2 text-xs text-gray-500 truncate">{{ it.desc || '—' }} | {{ it.href || '#' }}</div>
                </div>
                <button class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800" @click="g.items.push(defaultItem())"><ClientOnly><Icon icon="lucide:plus" class="size-4"/></ClientOnly>Tambah Item</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA & PPDB -->
      <section class="col-span-12">
        <div class="rounded-xl border border-gray-200 dark:border-neutral-700 p-4 bg-white dark:bg-neutral-900">
          <h2 class="font-semibold mb-3">CTA & PPDB</h2>
          <div class="grid grid-cols-12 gap-3">
            <div class="col-span-12 md:col-span-6 space-y-2">
              <label class="block"><span class="text-sm">PPDB Title</span><input v-model="form.ppdbCta.title" class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40"/></label>
              <label class="block"><span class="text-sm">PPDB Desc</span><input v-model="form.ppdbCta.desc" class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40"/></label>
              <label class="block"><span class="text-sm">PPDB Link</span><input v-model="form.ppdbCta.href" class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40"/></label>
              <div class="flex items-center gap-2">
                <button class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800" @click="() => ppdbInput?.click()"><ClientOnly><Icon icon="lucide:image-up" class="size-4"/></ClientOnly>Ubah Gambar</button>
                <input ref="ppdbInput" type="file" accept="image/*" class="hidden" @change="onUploadPPDB"/>
                <span class="text-xs text-gray-500">{{ form.ppdbCta.image?.split('?')[0] || 'Belum ada gambar' }}</span>
              </div>
              <div v-if="upload.ppdb.active" class="space-y-2">
                <p class="text-xs text-gray-500">Mengupload: {{ upload.ppdb.progress }}%</p>
                <div class="w-full h-2 rounded bg-gray-200 dark:bg-neutral-700 overflow-hidden">
                  <div class="h-full bg-blue-600" :style="{ width: upload.ppdb.progress + '%' }"></div>
                </div>
              </div>
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="aspect-[16/9] rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
                <img v-if="form.ppdbCta.image" :src="form.ppdbCta.image" alt="PPDB" class="w-full h-full object-cover"/>
                <div v-else class="text-sm text-gray-500">Belum ada gambar</div>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <div class="flex flex-wrap justify-between items-center gap-3 mb-3">
              <h3 class="font-medium mb-2">CTA Buttons</h3>
              <button class="mt-2 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 focus:outline-hidden focus:border-blue-600 focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-blue-500 dark:hover:border-blue-600 dark:focus:text-blue-500 dark:focus:border-blue-600" @click="form.ctaButtons.push({ label: 'Baru', href: '#', style: 'outline' })"><ClientOnly><Icon icon="lucide:plus" class="size-4"/></ClientOnly>Tambah CTA</button>
            </div>
            <div class="space-y-2">
              <div v-for="(b, i) in form.ctaButtons" :key="i" class="flex items-center gap-2">
                <select v-model="b.style" class="px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 w-32">
                  <option value="primary">primary</option>
                  <option value="outline">outline</option>
                </select>
                <input v-model="b.label" class="px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 flex-1" placeholder="Label"/>
                <input v-model="b.href" class="px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 flex-1" placeholder="/route"/>
                <button class="inline-flex items-center gap-2 px-2.5 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700" @click="form.ctaButtons.splice(i,1)"><ClientOnly><Icon icon="lucide:trash" class="size-4"/></ClientOnly></button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Item Fullscreen Modal -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="modal.open" class="fixed inset-0 z-[60]">
          <div class="absolute inset-0 bg-black/60" @click="closeItemModal"/>
          <div class="absolute inset-0 p-4 md:p-8 overflow-y-auto">
            <div class="max-w-3xl mx-auto rounded-2xl bg-white dark:bg-neutral-900 border mt-12 border-gray-200 dark:border-neutral-700 shadow-xl">
              <div class="p-4 border-b border-gray-200 dark:border-neutral-700 flex items-center gap-3">
                <ClientOnly><Icon icon="lucide:layers" class="size-5"/></ClientOnly>
                <h3 class="font-semibold">Edit Item — {{ activeItem?.label }}</h3>
                <button class="ml-auto btn-ghost" @click="closeItemModal"><ClientOnly><Icon icon="lucide:x" class="size-5"/></ClientOnly></button>
              </div>
              <div class="p-4 space-y-4">
                <div class="grid grid-cols-12 gap-4">
                  <div class="col-span-12 md:col-span-7 space-y-3">
                    <label class="block">
                      <span class="text-sm">Label</span>
                      <input v-model="activeItem!.label" class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40"/>
                    </label>
                    <label class="block">
                      <span class="text-sm">Deskripsi</span>
                      <textarea v-model="activeItem!.desc" class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 min-h-[90px]"/>
                    </label>
                    <label class="block">
                      <span class="text-sm">Link</span>
                      <input v-model="activeItem!.href" class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40" placeholder="#"/>
                    </label>
                    <div class="flex items-center gap-2">
                      <button class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800" @click="openIconPicker((i) => activeItem!.icon = i)">
                        <ClientOnly><Icon :icon="activeItem?.icon || 'ph:square'" class="size-4"/></ClientOnly>
                        Pilih Icon
                      </button>
                      <span class="text-xs text-gray-500">{{ activeItem?.icon || '-' }}</span>
                    </div>
                  </div>
                  <div class="col-span-12 md:col-span-5">
                    <div class="aspect-[16/10] rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
                      <img v-if="activeItem?.cover" :src="activeItem?.cover" class="w-full h-full object-cover" alt="Item cover"/>
                      <div v-else class="text-sm text-gray-500">Belum ada cover</div>
                    </div>
                    <div class="mt-3 flex items-center gap-2">
                      <button class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800" @click="() => itemCoverInput?.click()"><ClientOnly><Icon icon="lucide:image-up" class="size-4"/></ClientOnly>Upload Cover</button>
                      <input ref="itemCoverInput" type="file" accept="image/*" class="hidden" @change="onUploadItemCover"/>
                    </div>
                    <div v-if="upload.item.active" class="mt-2 space-y-2">
                      <p class="text-xs text-gray-500">Mengupload: {{ upload.item.progress }}%</p>
                      <div class="w-full h-2 rounded bg-gray-200 dark:bg-neutral-700 overflow-hidden">
                        <div class="h-full bg-blue-600" :style="{ width: upload.item.progress + '%' }"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="p-4 border-t border-gray-200 dark:border-neutral-700 flex items-center justify-end gap-2">
                <button class="inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800" @click="closeItemModal">Tutup</button>
                <button class="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60" @click="applyItemModal">Simpan Item</button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <Teleport to="body">
      <transition name="fade">
        <div v-if="iconPicker.open" class="fixed inset-0 z-[70]">
          <div class="absolute inset-0 bg-black/60" @click="closeIconPicker"/>
          <div class="absolute inset-0 p-4 md:p-8 overflow-y-auto">
            <div class="max-w-4xl mx-auto rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 shadow-xl">
              <div class="p-4 border-b border-gray-200 dark:border-neutral-700 flex items-center gap-3">
                <ClientOnly><Icon icon="lucide:search" class="size-5"/></ClientOnly>
                <h3 class="font-semibold">Pilih Icon (Iconify API)</h3>
                <button class="ml-auto btn-ghost" @click="closeIconPicker"><ClientOnly><Icon icon="lucide:x" class="size-5"/></ClientOnly></button>
              </div>
              <div class="p-4 space-y-4">
                <div class="flex items-center gap-2">
                  <input v-model="iconPicker.query" @keydown.enter.prevent="searchIcons" class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 flex-1" placeholder="Cari mis. ph:book, lucide:home, heroicons:academic-cap"/>
                  <button class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800" @click="searchIcons"><ClientOnly><Icon icon="lucide:search" class="size-4"/></ClientOnly>Cari</button>
                </div>
                <p class="text-xs text-gray-500">Contoh koleksi: ph, lucide, mdi, heroicons, tabler, solar, hugeicons, material-symbols.</p>
                <div v-if="iconPicker.loading" class="text-sm text-gray-500">Memuat ikon...</div>
                <div v-else class="grid grid-cols-12 gap-2 max-h-[60vh] overflow-y-auto">
                  <button v-for="ic in iconPicker.results" :key="ic" class="col-span-3 sm:col-span-2 md:col-span-1 aspect-square rounded-lg border border-gray-200 dark:border-neutral-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-neutral-800"
                          @click="selectIcon(ic)">
                    <ClientOnly><Icon :icon="ic" class="size-6"/></ClientOnly>
                  </button>
                </div>
              </div>
              <div class="p-4 border-t border-gray-200 dark:border-neutral-700 text-right">
                <button class="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60" @click="closeIconPicker">Selesai</button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'
import { ref as dbRef, onValue, off, set } from 'firebase/database'
import { ref as sRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

useHead({ title: 'Navbar Editor | Ponpes ALBERR', link: [{ rel: 'icon', href: '/assets/logo.png' }] })
definePageMeta({ layout: 'app', layoutProps: { title: 'Navbar' } })

export type NavLink = { label: string; href: string; icon: string }
export type MegaItem = { label: string; icon: string; desc?: string; href?: string; cover?: string }
export type MegaGroup = { title: string; items: MegaItem[] }

// Defaults
const defaultLinks = (): NavLink[] => [
  { label: 'Beranda', href: '/#home', icon: 'ph:house' },
  { label: 'Tentang', href: '/#information', icon: 'ph:info' },
  { label: 'Fasilitas', href: '/#facility', icon: 'ph:buildings' },
  { label: 'Berita', href: '/#news', icon: 'ph:newspaper' },
  { label: 'Kontak', href: '/#contact', icon: 'ph:phone' },
]

const defaultItem = (): MegaItem => ({ label: 'Item', icon: 'ph:square', desc: '', href: '#', cover: '' })
const defaultGroups = (): MegaGroup[] => ([
  {
    title: 'Pendidikan',
    items: [
      { label: 'SMA ALBERR', icon: 'ph:book-open-text', desc: 'Sekolah Menengah Atas ALBERR', href: '#', cover: '' },
      { label: 'SMP ALBERR', icon: 'ph:student', desc: 'Sekolah Menengah Pertama ALBERR', href: '#', cover: '' },
    ],
  },
  {
    title: 'Kegiatan Santri',
    items: [
      { label: 'Kajian Kitab', icon: 'ph:scroll', desc: 'Pendalaman kitab kuning', href: '#', cover: '' },
      { label: 'Muhadhoroh', icon: 'ph:megaphone-simple', desc: 'Latihan pidato & public speaking', href: '#', cover: '' },
      { label: 'Khidmah Sosial', icon: 'ph:handshake', desc: 'Pengabdian & kemasyarakatan', href: '#', cover: '' },
      { label: 'Rihlah / Daurah', icon: 'ph:globe-hemisphere-west', desc: 'Kegiatan luar asrama edukatif', href: '#', cover: '' },
    ],
  },
  {
    title: 'Program Khusus',
    items: [
      { label: 'Tahfidzul Quran', icon: 'mdi:religion-muslim', desc: 'Program penghafalan Al-Quran', href: '#', cover: '' },
      { label: 'Metode Baca Kitab Amtsilati', icon: 'hugeicons:muslim', desc: 'Pendalaman nahwu-shorof', href: '#', cover: '' },
      { label: 'Bahasa Arab', icon: 'hugeicons:alphabet-arabic', desc: 'Kelas intensif bhs Arab', href: '#', cover: '' },
      { label: 'BLK Komunitas TIK', icon: 'fluent:people-community-16-regular', desc: 'Pelatihan digital', href: '#', cover: '' },
    ],
  },
])

// Form state
const form = reactive({
  brand: 'Pondok Pesantren ALBERR',
  brandShorten: 'ALBERR',
  coverPonpes: '',
  navLinks: defaultLinks(),
  megaMenu: defaultGroups(),
  ppdbCta: {
    title: 'PPDB Online 2025/2026',
    desc: 'Penerimaan Peserta Didik Baru. Daftar mudah & cepat secara online.',
    href: '/registrationPPDB',
    image: '/assets/images/activity.jpg',
  },
  ctaButtons: [
    { label: 'Login Wali', href: '/waliLogin', style: 'primary' as const },
  ],
})

const original = ref<string>('')
const isDirty = computed(() => JSON.stringify(form) !== original.value)
const saving = ref(false)

const { $realtimeDb, $storage } = useNuxtApp() as any
const NAVBAR_PATH = 'alberr/site/navbar'

let unsub: any = null
onMounted(() => {
  if ($realtimeDb) {
    const r = dbRef($realtimeDb, NAVBAR_PATH)
    onValue(r, (snap) => {
      const val = snap.val()
      if (val) {
        Object.assign(form, {
          brand: val.brand ?? form.brand,
          brandShorten: val.brandShorten ?? form.brandShorten,
          coverPonpes: val.coverPonpes ?? form.coverPonpes,
          navLinks: Array.isArray(val.navLinks) ? val.navLinks : form.navLinks,
          megaMenu: Array.isArray(val.megaMenu) ? val.megaMenu : form.megaMenu,
          ppdbCta: { ...form.ppdbCta, ...(val.ppdbCta || {}) },
          ctaButtons: Array.isArray(val.ctaButtons) ? val.ctaButtons : form.ctaButtons,
        })
      }
      original.value = JSON.stringify(form)
    })
  }
})

onBeforeUnmount(() => { if (unsub && typeof unsub === 'function') unsub() })

// Save
async function saveAll() {
  if (!$realtimeDb) return alert('Firebase belum dikonfigurasi.')
  saving.value = true
  try {
    await set(dbRef($realtimeDb, NAVBAR_PATH), JSON.parse(JSON.stringify(form)))
    original.value = JSON.stringify(form)
  } finally {
    saving.value = false
  }
}

// Uploads
const coverInput = ref<HTMLInputElement | null>(null)
const ppdbInput = ref<HTMLInputElement | null>(null)
const itemCoverInput = ref<HTMLInputElement | null>(null)

const upload = reactive({
  cover: { active: false, progress: 0 },
  ppdb: { active: false, progress: 0 },
  item: { active: false, progress: 0 },
})

function doUpload(file: File, path: string, kind: 'cover'|'ppdb'|'item') {
  if (!$storage) return Promise.reject('Storage not ready')
  return new Promise<string>((resolve, reject) => {
    const storageRef = sRef($storage, path)
    const task = uploadBytesResumable(storageRef, file)
    upload[kind].active = true
    upload[kind].progress = 0

    task.on('state_changed', (snap) => {
      upload[kind].progress = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
    }, (err) => {
      upload[kind].active = false
      reject(err)
    }, async () => {
      const url = await getDownloadURL(task.snapshot.ref)
      upload[kind].active = false
      resolve(url)
    })
  })
}

async function onUploadCoverPonpes(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files?.length) return
  const f = files[0]!
  const url = await doUpload(f, `alberr/covers/ponpes-${Date.now()}-${f.name}`,'cover')
  form.coverPonpes = url
}

async function onUploadPPDB(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files?.length) return
  const f = files[0]!
  const url = await doUpload(f, `ppdb/${Date.now()}-${f.name}`,'ppdb')
  form.ppdbCta.image = url
}

async function onUploadItemCover(e: Event) {
  if (!activeItem) return
  const files = (e.target as HTMLInputElement).files
  if (!files?.length) return
  const f = files[0]!
  const url = await doUpload(f, `alberr/mega/${Date.now()}-${f.name}`,'item')
  activeItem.value!.cover = url
}

function addGroup() { form.megaMenu.push({ title: 'Grup Baru', items: [defaultItem()] }) }
function addLink() { form.navLinks.push({ label: 'Baru', href: '#', icon: 'ph:square' }) }

const modal = reactive({ open: false, gidx: -1, idx: -1 })
const activeItem = computed<MegaItem | null>(() => {
  if (modal.gidx < 0 || modal.idx < 0) return null
  return form.megaMenu[modal.gidx]?.items?.[modal.idx] || null
})
function openItemModal(gidx: number, idx: number) { modal.open = true; modal.gidx = gidx; modal.idx = idx }
function closeItemModal() { modal.open = false; modal.gidx = -1; modal.idx = -1 }
function applyItemModal() { closeItemModal() }

const iconPicker = reactive({ open: false, query: '', results: [] as string[], loading: false, cb: null as null | ((icon: string)=>void) })
function openIconPicker(cb: (icon: string)=>void) { iconPicker.open = true; iconPicker.cb = cb; iconPicker.query=''; iconPicker.results=[] }
function closeIconPicker() { iconPicker.open = false; iconPicker.cb = null }
function selectIcon(ic: string) { iconPicker.cb?.(ic); closeIconPicker() }

async function searchIcons() {
  if (!iconPicker.query) return
  iconPicker.loading = true
  try {
    const url = `https://api.iconify.design/search?query=${encodeURIComponent(iconPicker.query)}&limit=100`
    const res = await fetch(url)
    const data = await res.json()
    iconPicker.results = Array.isArray(data?.icons) ? data.icons : []
  } catch (e) {
    console.error(e)
    iconPicker.results = []
  } finally {
    iconPicker.loading = false
  }
}

// Reusable classes
const inputBase = 'w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40'

</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>