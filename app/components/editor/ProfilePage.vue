<template>
  <div>
    <!-- Sticky Tabs -->
    <div class="flex gap-1 border-b flex-wrap border-gray-200 dark:border-neutral-800 sticky top-0 z-10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="px-3 py-2 text-xs rounded-t-lg"
        :class="activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800'"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>

      <div class="ml-auto flex flex-wrap gap-2 mb-2">
        <button class="px-2 py-1 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700" @click="resetToDefault">
          Isi Default
        </button>
        <button class="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700" @click="save">
          Simpan
        </button>
      </div>
    </div>

    <!-- HERO -->
    <div v-show="activeTab === 'Hero'" class="mt-3 grid md:grid-cols-2 gap-4">
      <div class="md:col-span-2 grid md:grid-cols-3 gap-3">
        <div class="md:col-span-2">
          <label class="text-xs text-gray-500">Gambar Cover (URL/Upload)</label>
          <div class="mt-1 flex items-center gap-2">
            <input
              v-model.trim="form.hero.cover"
              placeholder="/assets/images/profile.png (atau URL upload)"
              class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"
            />
            <label class="inline-flex items-center gap-2 px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer">
              <input type="file" accept="image/*" class="hidden" @change="onPickImage($event, (url)=>form.hero.cover=url, 'hero.cover')" />
              Unggah
            </label>
            <button
              v-if="form.hero.cover"
              class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800"
              @click="form.hero.cover = ''"
            >
              Hapus
            </button>
          </div>
          <p class="mt-1 text-[11px] text-gray-500">Saran 1920×800px (JPG/PNG). Upload menyesuaikan halaman aktif.</p>
        </div>

        <div>
          <div class="text-xs text-gray-500 flex items-center justify-between">
            <span>Pratinjau</span>
            <span v-if="uploading['hero.cover']" class="inline-flex items-center gap-1 text-amber-600">
              <span class="inline-block size-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></span>
              Mengunggah…
            </span>
          </div>
          <div class="mt-1 relative h-28 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800">
            <img v-if="form.hero.cover" :src="form.hero.cover" alt="preview" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full grid place-items-center text-xs text-gray-400">Tidak ada gambar</div>
          </div>
        </div>
      </div>

      <div>
        <label class="text-xs text-gray-500">Badge</label>
        <input v-model.trim="form.hero.badge" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
      </div>
      <div>
        <label class="text-xs text-gray-500">Judul Utama</label>
        <input v-model.trim="form.hero.title" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
      </div>
      <div class="md:col-span-2">
        <label class="text-xs text-gray-500">Subjudul</label>
        <textarea v-model.trim="form.hero.subtitle" rows="2" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"></textarea>
      </div>

      <div class="md:col-span-2">
        <label class="text-xs text-gray-500">Tinggi Hero (mobile / desktop)</label>
        <div class="mt-1 grid grid-cols-2 gap-2">
          <input v-model.trim="form.hero.heightSm" placeholder="44vh" class="rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
          <input v-model.trim="form.hero.heightLg" placeholder="56vh" class="rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
        </div>
      </div>

      <!-- PREVIEW hero besar -->
      <div class="md:col-span-2">
        <div class="mt-2 relative rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700">
          <div class="absolute inset-0">
            <img v-if="form.hero.cover" :src="form.hero.cover" alt="preview" class="w-full h-full object-cover opacity-80" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
          </div>
          <div class="relative h-56 sm:h-64 lg:h-72 flex items-end px-4 sm:px-6 lg:px-8">
            <div class="mb-6">
              <p class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-blue-200">
                <span class="inline-block size-2 rounded-full bg-blue-400" />
                {{ form.hero.badge || 'Profil Pondok Pesantren Alberr' }}
              </p>
              <h3 class="mt-1 text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                {{ form.hero.title || 'Mencetak berilmu, beradab, dan mandiri' }}
              </h3>
              <p class="mt-1 text-blue-100">{{ form.hero.subtitle || 'Berlandaskan Al-Qur’an dan Sunnah…' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SAMBUTAN -->
    <div v-show="activeTab === 'Sambutan'" class="mt-3 grid md:grid-cols-2 gap-4">
      <div>
        <label class="text-xs text-gray-500">Foto Pengasuh</label>
        <div class="mt-1 flex items-center gap-2">
          <input v-model.trim="form.sambutan.img" placeholder="/assets/images/kyai.jpg" class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
          <label class="inline-flex items-center gap-2 px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer">
            <input type="file" accept="image/*" class="hidden" @change="onPickImage($event, (url)=>form.sambutan.img=url, 'sambutan.img')" />
            Unggah
          </label>
        </div>
        <div class="mt-1 relative h-28 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800">
          <img v-if="form.sambutan.img" :src="form.sambutan.img" alt="" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full grid place-items-center text-xs text-gray-400">Tidak ada gambar</div>
          <div v-if="uploading['sambutan.img']" class="absolute inset-0 grid place-items-center bg-black/20">
            <span class="inline-block size-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          </div>
        </div>
      </div>
      <div>
        <label class="text-xs text-gray-500">Judul Sambutan</label>
        <input v-model.trim="form.sambutan.title" placeholder="Sambutan Pengasuh" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
        <label class="text-xs text-gray-500 mt-3 block">Penutup/Tanda Tangan</label>
        <input v-model.trim="form.sambutan.signer" placeholder="— KH. Izud" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
      </div>
      <div class="md:col-span-2">
        <label class="text-xs text-gray-500">Isi Sambutan</label>
        <textarea v-model.trim="form.sambutan.content" rows="6" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"></textarea>
      </div>
    </div>

    <!-- VISI & MISI -->
    <div v-show="activeTab === 'Visi & Misi'" class="mt-3 space-y-4">
      <div>
        <label class="text-xs text-gray-500">Visi</label>
        <textarea v-model.trim="form.visi" rows="3" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"></textarea>
      </div>

      <div>
        <div class="flex items-center justify-between">
          <label class="text-xs text-gray-500">Misi (satu baris per item)</label>
          <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  @click="form.misi.push('Misi baru')">Tambah</button>
        </div>
        <div class="mt-2 space-y-2">
          <div v-for="(m, i) in form.misi" :key="'m'+i" class="flex items-center gap-2">
            <input v-model.trim="form.misi[i]" class="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
            <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50" @click="move(form.misi, i, -1)" :disabled="i===0">↑</button>
            <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50" @click="move(form.misi, i, +1)" :disabled="i===form.misi.length-1">↓</button>
            <button class="px-2 py-1 text-xs rounded border text-rose-600 hover:bg-rose-50" @click="form.misi.splice(i,1)">Hapus</button>
          </div>
        </div>
      </div>

      <div>
        <label class="text-xs text-gray-500">Motto</label>
        <input v-model.trim="form.motto" placeholder="Berilmu • Beradab • Mandiri" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
      </div>
    </div>

    <!-- SEJARAH -->
    <div v-show="activeTab === 'Sejarah'" class="mt-3 space-y-3">
      <p class="text-xs text-gray-500">Paragraf Sejarah</p>
      <div v-for="(p, i) in form.sejarah" :key="'p'+i" class="flex items-start gap-2">
        <textarea v-model.trim="form.sejarah[i]" rows="3" class="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"></textarea>
        <div class="flex flex-col gap-1">
          <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50" @click="move(form.sejarah, i, -1)" :disabled="i===0">↑</button>
          <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50" @click="move(form.sejarah, i, +1)" :disabled="i===form.sejarah.length-1">↓</button>
          <button class="px-2 py-1 text-xs rounded border text-rose-600 hover:bg-rose-50" @click="form.sejarah.splice(i,1)">Hapus</button>
        </div>
      </div>
      <div class="flex gap-2">
        <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50" @click="form.sejarah.push('Paragraf baru…')">Tambah Paragraf</button>
        <button v-if="form.sejarah.length>0" class="px-2 py-1 text-xs rounded border text-rose-600 hover:bg-rose-50" @click="form.sejarah.pop()">Hapus Terakhir</button>
      </div>
    </div>

    <!-- MATERI -->
    <div v-show="activeTab === 'Materi'" class="mt-3">
      <div class="flex items-center justify-between">
        <p class="text-xs text-gray-500">Daftar Materi</p>
        <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50" @click="form.materi.push('Materi baru')">Tambah</button>
      </div>
      <div class="mt-2 grid sm:grid-cols-1 md:grid-cols-2 gap-2">
        <div v-for="(m,i) in form.materi" :key="'materi'+i" class="flex items-center gap-2">
          <input v-model.trim="form.materi[i]" class="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
          <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50" @click="move(form.materi, i, -1)" :disabled="i===0">↑</button>
          <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50" @click="move(form.materi, i, +1)" :disabled="i===form.materi.length-1">↓</button>
          <button class="px-2 py-1 text-xs rounded border text-rose-600 hover:bg-rose-50" @click="form.materi.splice(i,1)">Hapus</button>
        </div>
      </div>
    </div>

    <!-- KITAB -->
    <div v-show="activeTab === 'Kitab'" class="mt-3">
      <div class="flex items-center justify-between">
        <p class="text-xs text-gray-500">Daftar Kitab</p>
        <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50" @click="form.kitab.push('Nama kitab')">Tambah</button>
      </div>
      <div class="mt-2 grid sm:grid-cols-1 md:grid-cols-2 gap-2">
        <div v-for="(k,i) in form.kitab" :key="'kitab'+i" class="flex items-center gap-2">
          <input v-model.trim="form.kitab[i]" class="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
          <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50" @click="move(form.kitab, i, -1)" :disabled="i===0">↑</button>
          <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50" @click="move(form.kitab, i, +1)" :disabled="i===form.kitab.length-1">↓</button>
          <button class="px-2 py-1 text-xs rounded border text-rose-600 hover:bg-rose-50" @click="form.kitab.splice(i,1)">Hapus</button>
        </div>
      </div>
    </div>

    <!-- STRUKTUR -->
    <div v-show="activeTab === 'Struktur'" class="mt-3 space-y-3">
      <div
        v-for="(s, i) in form.struktur"
        :key="'str'+i"
        class="rounded-lg border border-gray-200 dark:border-neutral-800 p-3"
      >
        <div class="grid md:grid-cols-3 gap-3">
          <div>
            <label class="text-xs text-gray-500">Foto</label>
            <div class="mt-1 flex items-center gap-2">
              <input v-model.trim="s.img" placeholder="URL foto" class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
              <label class="inline-flex items-center gap-2 px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer">
                <input type="file" accept="image/*" class="hidden" @change="onPickImage($event, (url)=>s.img=url, `struktur.${i}.img`)" />
                Unggah
              </label>
            </div>
            <div class="mt-1 relative h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800">
              <img v-if="s.img" :src="s.img" alt="" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full grid place-items-center text-[11px] text-gray-400">Tidak ada foto</div>
              <div v-if="uploading[`struktur.${i}.img`]" class="absolute inset-0 grid place-items-center bg-black/20">
                <span class="inline-block size-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              </div>
            </div>
          </div>

          <div>
            <label class="text-xs text-gray-500">Nama</label>
            <input v-model.trim="s.nama" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-500">Jabatan</label>
            <input v-model.trim="s.jabatan" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
        </div>

        <div class="mt-2 flex flex-wrap items-center gap-1">
          <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50" @click="move(form.struktur, i, -1)" :disabled="i===0">Naik</button>
          <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50" @click="move(form.struktur, i, +1)" :disabled="i===form.struktur.length-1">Turun</button>
          <button class="px-2 py-1 text-xs rounded border text-rose-600 hover:bg-rose-50" @click="form.struktur.splice(i,1)">Hapus</button>
        </div>
      </div>

      <div class="flex gap-2">
        <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50" @click="form.struktur.push({ nama:'Nama', jabatan:'Jabatan', img:'' })">Tambah Anggota</button>
        <button v-if="form.struktur.length>0" class="px-2 py-1 text-xs rounded border text-rose-600 hover:bg-rose-50" @click="form.struktur.pop()">Hapus Terakhir</button>
      </div>
    </div>

    <!-- TINGKATAN -->
    <div v-show="activeTab === 'Tingkatan'" class="mt-3 space-y-3">
      <div
        v-for="(t, i) in form.tingkatan"
        :key="'ting'+i"
        class="rounded-lg border border-gray-200 dark:border-neutral-800 p-3"
      >
        <div class="grid md:grid-cols-3 gap-3">
          <div>
            <label class="text-xs text-gray-500">Icon (Iconify)</label>
            <div class="mt-1 flex items-center gap-2">
              <div class="inline-flex items-center gap-2 flex-1">
                <input v-model.trim="t.icon" placeholder="ph:book" class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
                <ClientOnly>
                  <Icon v-if="t.icon" :icon="t.icon" class="size-5 shrink-0" />
                </ClientOnly>
              </div>
              <button type="button" class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800"
                      @click="openIconPicker({ index: i })">
                Pilih
              </button>
            </div>
          </div>
          <div>
            <label class="text-xs text-gray-500">Judul</label>
            <input v-model.trim="t.title" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label class="text-xs text-gray-500">Deskripsi</label>
            <input v-model.trim="t.desc" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
        </div>

        <div class="mt-2 flex items-center gap-1">
          <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50" @click="move(form.tingkatan, i, -1)" :disabled="i===0">Naik</button>
          <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50" @click="move(form.tingkatan, i, +1)" :disabled="i===form.tingkatan.length-1">Turun</button>
          <button class="px-2 py-1 text-xs rounded border text-rose-600 hover:bg-rose-50" @click="form.tingkatan.splice(i,1)">Hapus</button>
        </div>
      </div>

      <div class="flex gap-2">
        <button class="px-2 py-1 text-xs rounded border hover:bg-gray-50" @click="form.tingkatan.push({ title:'Ibtidaiyah', desc:'...', icon:'ph:book' })">Tambah Tingkatan</button>
        <button v-if="form.tingkatan.length>0" class="px-2 py-1 text-xs rounded border text-rose-600 hover:bg-rose-50" @click="form.tingkatan.pop()">Hapus Terakhir</button>
      </div>
    </div>

    <!-- PREVIEW ringkas -->
    <div v-show="activeTab === 'Preview'" class="mt-3">
      <div class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur">
        <div class="relative">
          <div class="absolute inset-0">
            <img v-if="form.hero.cover" :src="form.hero.cover" class="w-full h-56 sm:h-64 object-cover opacity-80" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
          </div>
          <div class="relative h-56 sm:h-64 flex items-end px-4 sm:px-6 lg:px-8">
            <div class="mb-6">
              <p class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-blue-200">
                <span class="inline-block size-2 rounded-full bg-blue-400" />
                {{ form.hero.badge || 'Profil Pondok Pesantren Alberr' }}
              </p>
              <h3 class="mt-1 text-xl sm:text-2xl font-bold text-white">{{ form.hero.title || 'Mencetak berilmu, beradab, dan mandiri' }}</h3>
              <p class="mt-1 text-blue-100">{{ form.hero.subtitle || 'Berlandaskan Al-Qur’an dan Sunnah…' }}</p>
            </div>
          </div>
        </div>

        <div class="p-4 sm:p-6">
          <section class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-4 sm:p-6">
            <div class="flex items-start gap-4">
              <img v-if="form.sambutan.img" :src="form.sambutan.img" class="w-16 h-16 rounded-xl object-cover border-2 border-blue-600/70 shadow" />
              <div class="min-w-0">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white">{{ form.sambutan.title || 'Sambutan Pengasuh' }}</h4>
                <p class="mt-2 text-gray-600 dark:text-neutral-300 line-clamp-3">{{ form.sambutan.content || '—' }}</p>
                <p class="mt-2 text-xs text-gray-500 dark:text-neutral-400">{{ form.sambutan.signer || '—' }}</p>
              </div>
            </div>
          </section>

          <section class="grid md:grid-cols-3 gap-4 mt-4">
            <div class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-4">
              <h5 class="font-semibold text-gray-900 dark:text-white">Visi</h5>
              <p class="mt-2 text-sm text-gray-600 dark:text-neutral-300 line-clamp-5">{{ form.visi || '—' }}</p>
            </div>
            <div class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-4 md:col-span-2">
              <h5 class="font-semibold text-gray-900 dark:text-white">Misi</h5>
              <ul class="mt-2 text-sm text-gray-600 dark:text-neutral-300 list-disc list-inside">
                <li v-for="(m,i) in form.misi.slice(0,4)" :key="'pv-m'+i">{{ m }}</li>
              </ul>
            </div>
          </section>

          <section class="mt-4">
            <h5 class="font-semibold text-gray-900 dark:text-white">Materi ({{ form.materi.length }})</h5>
            <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              <div v-for="(m,i) in form.materi.slice(0,6)" :key="'pv-mat'+i" class="text-sm px-3 py-2 rounded border border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60">
                {{ m }}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- Notes -->
    <div class="mt-4 flex flex-wrap gap-2">
      <p v-if="savedNote" class="text-[11px] text-emerald-600">{{ savedNote }}</p>
      <p v-if="errNote" class="text-[11px] text-rose-600">{{ errNote }}</p>
    </div>

    <!-- Icon Picker Modal -->
    <div
      v-if="iconModal.show"
      class="fixed left-0 top-0 w-full z-[1002] h-screen flex items-start py-24 overflow-y-auto justify-center bg-black/0 px-4"
      @click.self="closeIconPicker"
    >
      <div class="w-full max-w-3xl rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700">
        <div class="p-4 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
          <h3 class="text-base font-semibold">Pilih Icon</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="closeIconPicker">×</button>
        </div>

        <div class="p-4 space-y-3">
          <div class="inline-flex bg-white/80 border border-gray-200 rounded-lg p-1 shadow-xs dark:bg-neutral-800/70 dark:border-neutral-700">
            <button
              v-for="t in iconModal.tabs"
              :key="t"
              @click="iconModal.activeTab = t"
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
              placeholder="Cari icon (e.g. book, school, leaf)"
              class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800"
              @input="onSearchInput"
              @keydown.enter.prevent="searchOnline(true)"
            />
            <button
              v-if="iconModal.allowOnline"
              class="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 text-sm"
              :disabled="iconModal.loading"
              @click="searchOnline()"
              title="Cari via Iconify API"
            >
              {{ iconModal.loading ? 'Mencari…' : 'Cari Online' }}
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
            <p v-if="!iconModal.visible.length" class="text-sm text-gray-500 mt-3">Tidak ada icon.</p>
          </div>

          <div
            class="mt-3 flex items-center justify-between text-xs text-gray-600 dark:text-neutral-300"
            v-if="iconModal.allowOnline && iconModal.total > iconModal.limit"
          >
            <span>
              Menampilkan
              {{ Math.min(iconModal.total, iconModal.start + 1) }}–{{ Math.min(iconModal.total, iconModal.start + iconModal.limit) }}
              dari {{ iconModal.total }}
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
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useWeb } from '~/composables/data/useWeb'

type Struktur = { nama: string; jabatan: string; img: string }
type Tingkatan = { title: string; desc: string; icon: string }
type Shape = {
  hero: { cover: string; badge: string; title: string; subtitle: string; heightSm: string; heightLg: string }
  sambutan: { img: string; title: string; content: string; signer: string }
  visi: string
  misi: string[]
  motto: string
  sejarah: string[]
  materi: string[]
  kitab: string[]
  struktur: Struktur[]
  tingkatan: Tingkatan[]
}

defineOptions({ name: 'EditorProfilePages' })

const props = defineProps<{
  section: { id: string; key: string; props?: Partial<Shape> },
  pagePath?: string
}>()

const defaults: Shape = {
  hero: {
    cover: '/assets/images/profile.png',
    badge: 'Profil Pondok Pesantren Alberr',
    title: 'Mencetak berilmu, beradab, dan mandiri',
    subtitle: 'Berlandaskan Al-Qur’ān dan Sunnah, mengintegrasikan diniyah, akademik, dan keterampilan abad 21.',
    heightSm: '44vh',
    heightLg: '56vh'
  },
  sambutan: {
    img: '/assets/images/kyai.jpg',
    title: 'Sambutan Pengasuh',
    content:
      'Alhamdulillāh, Pondok Pesantren Alberr berkomitmen melahirkan santri yang mendalam ilmunya, kokoh akhlaknya, dan tangguh menghadapi tantangan zaman. Melalui disiplin, adab, dan ikhtiar berkelanjutan, kami berharap para santri menjadi pribadi yang bermanfaat bagi umat.',
    signer: '— KH. Izud'
  },
  visi: 'Mencetak generasi berilmu, berakhlak karimah, dan berdaya saing global berlandaskan Al-Qur’ān dan Sunnah.',
  misi: [
    'Penguatan ilmu diniyah & adab santri',
    'Integrasi akademik modern & evaluasi terstandar',
    'Pembinaan karakter & kepemimpinan',
    'Literasi digital, komunikasi, dan kolaborasi',
    'Khidmah sosial & kemitraan alumni'
  ],
  motto: 'Berilmu • Beradab • Mandiri',
  sejarah: [
    'Pondok Pesantren Al-Berr berdiri pada tahun 2010 M dengan tekad menghadirkan pendidikan Islam yang menanamkan akhlak mulia…',
    'Perjalanan Al-Berr dimulai dengan sangat sederhana—hanya berawal dari sebuah gazebo dan masjid kecil sebagai pusat kegiatan santri…',
    'Dengan visi mencetak generasi yang berakhlak mulia, mandiri, dan bermanfaat, Pondok Pesantren Al-Berr terus melangkah maju…'
  ],
  materi: [
    'Tahfidz & Tahsin Al-Qur’ān',
    'Fiqih, Aqidah, Akhlak',
    'Nahwu & Sharaf',
    'Tafsir & Hadits',
    'Bahasa Arab & Inggris',
    'Sains & Matematika'
  ],
  kitab: [
    'Al-Jurumiyah', 'Imrithi', 'Alfiyah Ibnu Malik',
    'Fathul Qarib', 'Bulughul Maram', 'Tafsir Jalalain',
    'Riyadhus Shalihin', 'Ushul Tsalatsah'
  ],
  struktur: [
    { nama: 'KH. Izud', jabatan: 'Pengasuh', img: '/assets/images/kyai.jpg' }
  ],
  tingkatan: [
    { title: 'Ibtidaiyah', desc: 'Fokus adab, tahsin, pondasi diniyah', icon: 'ph:book' },
    { title: 'Tsanawiyah', desc: 'Integrasi diniyah-akademik & bahasa', icon: 'ph:chalkboard' },
    { title: 'Aliyah', desc: 'Pendalaman kitab, sains & leadership', icon: 'ph:graduation-cap' }
  ]
}

function merge(base: Shape, patch?: Partial<Shape>): Shape {
  return {
    hero: {
      cover: patch?.hero?.cover ?? base.hero.cover,
      badge: patch?.hero?.badge ?? base.hero.badge,
      title: patch?.hero?.title ?? base.hero.title,
      subtitle: patch?.hero?.subtitle ?? base.hero.subtitle,
      heightSm: patch?.hero?.heightSm ?? base.hero.heightSm,
      heightLg: patch?.hero?.heightLg ?? base.hero.heightLg
    },
    sambutan: {
      img: patch?.sambutan?.img ?? base.sambutan.img,
      title: patch?.sambutan?.title ?? base.sambutan.title,
      content: patch?.sambutan?.content ?? base.sambutan.content,
      signer: patch?.sambutan?.signer ?? base.sambutan.signer
    },
    visi: patch?.visi ?? base.visi,
    misi: Array.isArray(patch?.misi) && patch!.misi!.length ? patch!.misi! : [...base.misi],
    motto: patch?.motto ?? base.motto,
    sejarah: Array.isArray(patch?.sejarah) && patch!.sejarah!.length ? patch!.sejarah! : [...base.sejarah],
    materi: Array.isArray(patch?.materi) && patch!.materi!.length ? patch!.materi! : [...base.materi],
    kitab: Array.isArray(patch?.kitab) && patch!.kitab!.length ? patch!.kitab! : [...base.kitab],
    struktur: Array.isArray(patch?.struktur) && patch!.struktur!.length ? patch!.struktur! : [...base.struktur],
    tingkatan: Array.isArray(patch?.tingkatan) && patch!.tingkatan!.length ? patch!.tingkatan! : [...base.tingkatan],
  }
}

const form = reactive<Shape>(merge(defaults, props.section?.props))

const savedNote = ref(''); const errNote = ref('')
const tabs = ['Hero', 'Sambutan', 'Visi & Misi', 'Sejarah', 'Materi', 'Kitab', 'Struktur', 'Tingkatan', 'Preview'] as const
const activeTab = ref<typeof tabs[number]>('Hero')

watch(() => props.section?.props, (p) => { Object.assign(form, merge(defaults, p)) })

/* ==== Web context ==== */
const web = useWeb()
function normalize(p?: string) {
  const n = p || '/profile'
  return web?.normalizePath ? web.normalizePath(String(n)) : String(n)
}

/* ==== State: uploading indicator ==== */
const uploading = reactive<Record<string, boolean>>({})

/* ==== Helpers ==== */
function move<T>(arr: T[], index: number, delta: number) {
  const ni = index + delta
  if (ni < 0 || ni >= arr.length) return
  const [it] = arr.splice(index, 1)
  arr.splice(ni, 0, it!)
}

async function onPickImage(ev: Event, setter: (url: string)=>void, key: string) {
  const input = ev.target as HTMLInputElement
  const file = input.files?.[0]; if (!file) return
  uploading[key] = true
  try {
    const path = normalize(props.pagePath || '/profile')
    web?.setActivePath?.(path)
    const up = await web.uploadMedia(file, {
      folder: 'media',                 // hasil: alberr/web/media/<pathKey>/
      pathOverride: path,              // simpan sesuai halaman
      filenamePrefix: key.replace(/[^a-z0-9_-]/gi, '-') // rapikan nama file
    })
    if (up?.url) setter(up.url)
  } catch (e:any) {
    errNote.value = e?.message || 'Gagal upload'
    setTimeout(()=> (errNote.value=''), 1700)
  } finally {
    uploading[key] = false
    input.value = ''
  }
}

/* ==== Save / Reset ==== */
async function save() {
  try {
    errNote.value = ''
    const path = normalize(props.pagePath || '/profile')
    web?.setActivePath?.(path) // sinkronkan currentPath di composable
    await web.updateSection(
      props.section.id,
      { props: JSON.parse(JSON.stringify(form)) },
      path // override target path
    )
    savedNote.value = 'Tersimpan.'; setTimeout(() => (savedNote.value = ''), 1500)
  } catch (e:any) {
    errNote.value = e?.message || 'Gagal menyimpan'
  }
}

function resetToDefault() {
  Object.assign(form, JSON.parse(JSON.stringify(defaults)))
  activeTab.value = 'Hero'
}

/* ========= ICON PICKER (Iconify) ========= */
type Target = { index: number }

const iconModal = reactive({
  show: false,
  tabs: ['Local', 'Online'] as const,
  activeTab: 'Local' as 'Local' | 'Online',
  query: '',
  visible: [] as string[],
  allowOnline: true,
  loading: false,
  total: 0,
  limit: 48,
  start: 0,
  controller: null as AbortController | null,
  target: null as Target | null,
  localAll: [] as string[],
})

/* Seed local icons */
iconModal.localAll = [
  // phosphor
  'ph:book','ph:chalkboard','ph:graduation-cap','ph:student','ph:medal','ph:handshake','ph:scroll','ph:book-open',
  // lucide
  'lucide:book','lucide:school','lucide:graduation-cap','lucide:users','lucide:feather',
  // mdi
  'mdi:school-outline','mdi:book-open-variant','mdi:account-group-outline','mdi:medal-outline','mdi:leaf',
  // tabler
  'tabler:book-2','tabler:certificate','tabler:sparkles','tabler:users',
  // material/ic
  'material-symbols:school-outline','material-symbols:menu-book-outline','ic:baseline-emoji-people'
]

function openIconPicker(target: Target) {
  iconModal.target = target
  iconModal.show = true
  iconModal.activeTab = 'Local'
  iconModal.query = ''
  filterLocal()
}

function closeIconPicker() {
  try { iconModal.controller?.abort?.() } catch {}
  iconModal.controller = null
  iconModal.show = false
  iconModal.visible = []
  iconModal.query = ''
  iconModal.total = 0
  iconModal.start = 0
}

function chooseIcon(name: string) {
  if (!iconModal.target) return
  const idx = iconModal.target.index
  if (form.tingkatan[idx]) form.tingkatan[idx]!.icon = name
  closeIconPicker()
}

/* Local search */
function filterLocal() {
  const q = iconModal.query.trim().toLowerCase()
  const base = iconModal.localAll
  iconModal.visible = q ? base.filter(n => n.toLowerCase().includes(q)) : base.slice(0, iconModal.limit)
  iconModal.total = iconModal.visible.length
}

/* Tab change */
watch(() => iconModal.activeTab, (t) => {
  if (t === 'Local') {
    filterLocal()
  } else {
    searchOnline(true)
  }
})

function onSearchInput() {
  if (iconModal.activeTab === 'Local') filterLocal()
}

/* Online search via Iconify API */
let searchDebounce: number | null = null as unknown as number
function resetOnlinePaging() {
  iconModal.start = 0
  iconModal.total = 0
}
async function searchOnline(reset = true) {
  if (!iconModal.allowOnline) return
  if (typeof window === 'undefined') return
  const q = iconModal.query.trim()
  if (!q) {
    resetOnlinePaging()
    return filterLocal()
  }
  if (reset) iconModal.start = 0
  if (searchDebounce) window.clearTimeout(searchDebounce)
  searchDebounce = window.setTimeout(async () => {
    try {
      iconModal.controller?.abort?.()
    } catch {}
    iconModal.controller = new AbortController()
    iconModal.loading = true
    try {
      const prefixes = ['mdi','tabler','material-symbols','ic','ph','lucide']
      const url = `https://api.iconify.design/search` +
        `?query=${encodeURIComponent(q)}` +
        `&limit=${encodeURIComponent(iconModal.limit)}` +
        `&start=${encodeURIComponent(iconModal.start)}` +
        `&prefixes=${encodeURIComponent(prefixes.join(','))}`
      const res = await fetch(url, { headers: { Accept: 'application/json' }, signal: iconModal.controller.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json() as { icons?: string[]; total?: number; limit?: number; start?: number }
      const hits = Array.isArray(data.icons) ? data.icons : []
      iconModal.visible = hits
      iconModal.total = Number(data.total || hits.length || 0)
      if (typeof data.limit === 'number') iconModal.limit = data.limit
      if (typeof data.start === 'number') iconModal.start = data.start
      if (!hits.length) filterLocal()
    } catch (e:any) {
      if (e?.name !== 'AbortError') {
        console.error('Iconify /search error:', e)
        filterLocal()
      }
    } finally {
      iconModal.loading = false
    }
  }, 220) as unknown as number
}

function prevPage() {
  if (iconModal.start === 0) return
  iconModal.start = Math.max(0, iconModal.start - iconModal.limit)
  searchOnline(false)
}
function nextPage() {
  if (iconModal.start + iconModal.limit >= iconModal.total) return
  iconModal.start = iconModal.start + iconModal.limit
  searchOnline(false)
}
</script>
