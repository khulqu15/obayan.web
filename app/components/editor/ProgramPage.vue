<template>
  <div>
    <div class="flex gap-1 border-b flex-wrap border-gray-200 dark:border-neutral-800 sticky top-0 z-10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur">
      <button
        v-for="t in tabs" :key="t"
        class="px-3 py-2 text-xs rounded-t-lg"
        :class="activeTab === t ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800'"
        @click="activeTab=t"
      >{{ t }}</button>

      <div class="ml-auto flex flex-wrap gap-2 mb-2">
        <button class="px-2 py-1 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700" @click="resetToDefault">Isi Default</button>
        <button class="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700" @click="save">Simpan</button>
      </div>
    </div>

    <div v-show="activeTab==='Hero'" class="mt-3 grid md:grid-cols-2 gap-4">
      <div class="md:col-span-2 grid md:grid-cols-2 gap-3">
        <div class="md:col-span-2">
          <label class="text-xs text-gray-500">Gambar Cover (URL/Upload)</label>
          <div class="mt-1 flex items-center gap-2">
            <input v-model.trim="form.hero.cover" placeholder="/assets/images/activity2.jpg"
                   class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"/>
            <label class="inline-flex items-center gap-2 px-2 py-1 text-xs rounded border border-gray-200 border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer">
              <input type="file" accept="image/*" class="hidden" @change="onPickImage($event,(u)=>form.hero.cover=u,'hero.cover')"/>
              Unggah
            </label>
            <button v-if="form.hero.cover" class="px-2 py-1 text-xs rounded border border-gray-200 border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800" @click="form.hero.cover=''">Hapus</button>
          </div>
          <p class="mt-1 text-[11px] text-gray-500">Saran 1920×700. Disimpan ke Firebase Storage.</p>
        </div>
        <div>
          <div class="text-xs text-gray-500 flex items-center justify-between">
            <span>Pratinjau</span>
            <span v-if="uploading['hero.cover']" class="inline-flex items-center gap-1 text-amber-600">
              <span class="inline-block size-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></span> Mengunggah…
            </span>
          </div>
          <div class="mt-1 relative h-28 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800">
            <img v-if="form.hero.cover" :src="form.hero.cover" class="w-full h-full object-cover"/>
            <div v-else class="w-full h-full grid place-items-center text-xs text-gray-400">Tidak ada gambar</div>
          </div>
        </div>
      </div>

      <div>
        <label class="text-xs text-gray-500">Badge</label>
        <input v-model.trim="form.hero.badge" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"/>
      </div>
      <div>
        <label class="text-xs text-gray-500">Judul</label>
        <input v-model.trim="form.hero.title" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"/>
      </div>
      <div class="md:col-span-2">
        <label class="text-xs text-gray-500">Subjudul</label>
        <textarea v-model.trim="form.hero.subtitle" rows="2" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"></textarea>
      </div>
      <div class="md:col-span-2">
        <label class="text-xs text-gray-500">Tinggi Hero (sm / lg)</label>
        <div class="mt-1 grid grid-cols-2 gap-2">
          <input v-model.trim="form.hero.heightSm" placeholder="40vh" class="rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"/>
          <input v-model.trim="form.hero.heightLg" placeholder="52vh" class="rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"/>
        </div>
      </div>
    </div>

    <div v-show="activeTab==='Stats'" class="mt-3 space-y-3">
      <div class="flex items-center justify-between">
        <p class="text-xs text-gray-500">Statistik Ringkas (max 4 direkomendasikan)</p>
        <button class="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800" @click="form.stats.push({label:'Baru',value:'—',icon:'ph:star'})">Tambah</button>
      </div>
      <div class="grid sm:grid-cols-1 lg:grid-cols-2 gap-3">
        <div v-for="(s,i) in form.stats" :key="'st'+i" class="rounded-xl border border-gray-200 dark:border-neutral-700 p-3">
          <label class="text-xs text-gray-500">Label</label>
          <input v-model.trim="s.label" class="mt-1 w-full rounded-md border px-3 py-2 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700"/>
          <label class="text-xs text-gray-500 mt-2 block">Nilai</label>
          <input v-model.trim="s.value" class="mt-1 w-full rounded-md border px-3 py-2 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700"/>
          <label class="text-xs text-gray-500 mt-2 block">Icon (Iconify)</label>
          <div class="mt-1 flex items-center gap-2">
            <div class="w-full">
                <Icon :icon="s.icon" class="text-2xl text-gray-500"/>
            </div>
            <button class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-neutral-700" @click="openIconPicker({type:'stat', index:i})">Pilih</button>
          </div>
          <div class="mt-2 flex gap-1">
            <button class="px-2 py-1 text-xs rounded border border-gray-200" @click="move(form.stats,i,-1)" :disabled="i===0">↑</button>
            <button class="px-2 py-1 text-xs rounded border border-gray-200" @click="move(form.stats,i,+1)" :disabled="i===form.stats.length-1">↓</button>
            <button class="px-2 py-1 text-xs rounded border border-gray-200 text-rose-600" @click="form.stats.splice(i,1)">Hapus</button>
          </div>
        </div>
      </div>
    </div>

    <div v-show="activeTab==='Filters'" class="mt-3 grid md:grid-cols-2 gap-4">
      <div>
        <label class="text-xs text-gray-500">Daftar Jenjang</label>
        <div class="mt-1 space-y-2">
          <div v-for="(l,i) in form.filters.levels" :key="'lv'+i" class="flex gap-2">
            <input v-model.trim="form.filters.levels[i]" class="flex-1 rounded-md border px-3 py-2 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700"/>
            <button class="px-2 py-1 text-xs rounded border border-gray-200" @click="move(form.filters.levels,i,-1)" :disabled="i===0">↑</button>
            <button class="px-2 py-1 text-xs rounded border border-gray-200" @click="move(form.filters.levels,i,+1)" :disabled="i===form.filters.levels.length-1">↓</button>
            <button class="px-2 py-1 text-xs rounded border border-gray-200 text-rose-600" @click="form.filters.levels.splice(i,1)">Hapus</button>
          </div>
          <button class="px-2 py-1 text-xs rounded border border-gray-200" @click="form.filters.levels.push('Baru')">Tambah Jenjang</button>
        </div>
      </div>
      <div>
        <label class="text-xs text-gray-500">Daftar Kategori</label>
        <div class="mt-1 space-y-2">
          <div v-for="(c,i) in form.filters.categories" :key="'ct'+i" class="flex gap-2">
            <input v-model.trim="form.filters.categories[i]" class="flex-1 rounded-md border px-3 py-2 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700"/>
            <button class="px-2 py-1 text-xs rounded border border-gray-200" @click="move(form.filters.categories,i,-1)" :disabled="i===0">↑</button>
            <button class="px-2 py-1 text-xs rounded border border-gray-200" @click="move(form.filters.categories,i,+1)" :disabled="i===form.filters.categories.length-1">↓</button>
            <button class="px-2 py-1 text-xs rounded border border-gray-200 text-rose-600" @click="form.filters.categories.splice(i,1)">Hapus</button>
          </div>
          <button class="px-2 py-1 text-xs rounded border border-gray-200" @click="form.filters.categories.push('Baru')">Tambah Kategori</button>
        </div>
      </div>
    </div>

    <div v-show="activeTab==='Programs'" class="mt-3 space-y-3">
      <div class="flex items-center justify-between">
        <p class="text-xs text-gray-500">Daftar Program</p>
        <button class="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 dark:border-neutral-700" @click="addProgram">Tambah Program</button>
      </div>

      <div v-for="(p,i) in form.programs" :key="p.id" class="rounded-xl border border-gray-200 dark:border-neutral-700 p-3">
        <div class="grid md:grid-cols-3 gap-3">
          <div class="md:col-span-2 grid md:grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-gray-500">Judul</label>
              <input v-model.trim="p.title" class="mt-1 w-full rounded-md border px-3 py-2 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700"/>
            </div>
            <div>
              <label class="text-xs text-gray-500">Intensitas/Waktu</label>
              <input v-model.trim="p.intensity" class="mt-1 w-full rounded-md border px-3 py-2 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700"/>
            </div>
            <div>
              <label class="text-xs text-gray-500">Jenjang</label>
              <input v-model.trim="p.level" list="lvls" class="mt-1 w-full rounded-md border px-3 py-2 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700"/>
              <datalist id="lvls">
                <option v-for="l in form.filters.levels" :key="l" :value="l"/>
              </datalist>
            </div>
            <div>
              <label class="text-xs text-gray-500">Kategori</label>
              <input v-model.trim="p.category" list="cats" class="mt-1 w-full rounded-md border px-3 py-2 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700"/>
              <datalist id="cats">
                <option v-for="c in form.filters.categories" :key="c" :value="c"/>
              </datalist>
            </div>
            <div class="md:col-span-2">
              <label class="text-xs text-gray-500">Deskripsi</label>
              <textarea v-model.trim="p.desc" rows="2" class="mt-1 w-full rounded-md border px-3 py-2 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700"></textarea>
            </div>
          </div>

          <div>
            <label class="text-xs text-gray-500">Cover</label>
            <div class="mt-1 flex items-center gap-2">
              <input v-model.trim="p.cover" placeholder="/assets/images/gallery/1.jpg" class="w-full rounded-md border px-3 py-2 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700"/>
              <label class="inline-flex items-center gap-2 px-2 py-1 text-xs rounded border border-gray-200 border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer">
                <input type="file" accept="image/*" class="hidden" @change="onPickImage($event,(u)=>p.cover=u,`programs.${i}.cover`)"/>
                Unggah
              </label>
            </div>
            <div class="mt-1 relative h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800">
              <img v-if="p.cover" :src="p.cover" class="w-full h-full object-cover"/>
              <div v-else class="w-full h-full grid place-items-center text-[11px] text-gray-400">Tidak ada gambar</div>
              <div v-if="uploading[`programs.${i}.cover`]" class="absolute inset-0 grid place-items-center bg-black/20">
                <span class="inline-block size-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-2 flex flex-wrap items-center gap-1">
          <button class="px-2 py-1 text-xs rounded border border-gray-200" @click="move(form.programs,i,-1)" :disabled="i===0">Naik</button>
          <button class="px-2 py-1 text-xs rounded border border-gray-200" @click="move(form.programs,i,+1)" :disabled="i===form.programs.length-1">Turun</button>
          <button class="px-2 py-1 text-xs rounded border border-gray-200 text-rose-600" @click="form.programs.splice(i,1)">Hapus</button>
        </div>
      </div>
    </div>

    <div v-show="activeTab==='Curriculum'" class="mt-3 space-y-3">
      <div class="flex items-center justify-between">
        <p class="text-xs text-gray-500">Kurikulum per Jenjang</p>
        <button class="px-2 py-1 text-xs rounded border border-gray-200" @click="addCurriculum">Tambah</button>
      </div>

      <div v-for="(k,i) in form.curriculum" :key="'cur'+i" class="rounded-xl border border-gray-200 dark:border-neutral-700 p-3">
        <div class="grid md:grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-gray-500">Jenjang/Level</label>
            <input v-model.trim="k.level" class="mt-1 w-full rounded-md border px-3 py-2 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700"/>
          </div>
          <div>
            <label class="text-xs text-gray-500">Subjudul</label>
            <input v-model.trim="k.subtitle" class="mt-1 w-full rounded-md border px-3 py-2 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700"/>
          </div>
          <div>
            <label class="text-xs text-gray-500">Icon</label>
            <div class="mt-1 flex items-center gap-2">
              <input v-model.trim="k.icon" class="flex-1 rounded-md border px-3 py-2 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700"/>
              <button class="px-2 py-1 text-xs rounded border border-gray-200" @click="openIconPicker({type:'curriculum', index:i})">Pilih</button>
            </div>
          </div>
          <div class="md:col-span-3">
            <label class="text-xs text-gray-500">Deskripsi</label>
            <textarea v-model.trim="k.description" rows="2" class="mt-1 w-full rounded-md border px-3 py-2 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700"></textarea>
          </div>
          <div>
            <label class="text-xs text-gray-500">Materi Utama (1/baris)</label>
            <textarea v-model.trim="k.subjectsText" rows="4" class="mt-1 w-full rounded-md border px-3 py-2 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700" placeholder="Aqidah Akhlak&#10;Fiqih&#10;…"></textarea>
          </div>
          <div>
            <label class="text-xs text-gray-500">Kitab (1/baris)</label>
            <textarea v-model.trim="k.booksText" rows="4" class="mt-1 w-full rounded-md border px-3 py-2 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700" placeholder="Safinatun Najah&#10;Taqrib&#10;…"></textarea>
          </div>
        </div>

        <div class="mt-2 flex flex-wrap items-center gap-1">
          <button class="px-2 py-1 text-xs rounded border border-gray-200" @click="move(form.curriculum,i,-1)" :disabled="i===0">Naik</button>
          <button class="px-2 py-1 text-xs rounded border border-gray-200" @click="move(form.curriculum,i,+1)" :disabled="i===form.curriculum.length-1">Turun</button>
          <button class="px-2 py-1 text-xs rounded border border-gray-200 text-rose-600" @click="form.curriculum.splice(i,1)">Hapus</button>
        </div>
      </div>
    </div>

    <div v-show="activeTab==='Timetable'" class="mt-3">
      <div class="flex items-center justify-between">
        <p class="text-xs text-gray-500">Contoh Jadwal Harian</p>
        <button class="px-2 py-1 text-xs rounded border border-gray-200" @click="form.schedule.push({ time:'05.00', title:'Kegiatan', note:'' })">Tambah</button>
      </div>
      <div class="mt-2 grid sm:grid-cols-1 lg:grid-cols-2 gap-2">
        <div v-for="(s,i) in form.schedule" :key="'sch'+i" class="rounded-xl border border-gray-200 dark:border-neutral-700 p-3">
          <input v-model.trim="s.time" class="w-full rounded-md border px-2 py-1 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700"/>
          <input v-model.trim="s.title" class="mt-1 w-full rounded-md border px-2 py-1 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700"/>
          <input v-model.trim="s.note" class="mt-1 w-full rounded-md border px-2 py-1 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700"/>
          <div class="mt-2 flex gap-1">
            <button class="px-2 py-1 text-xs rounded border border-gray-200" @click="move(form.schedule,i,-1)" :disabled="i===0">↑</button>
            <button class="px-2 py-1 text-xs rounded border border-gray-200" @click="move(form.schedule,i,+1)" :disabled="i===form.schedule.length-1">↓</button>
            <button class="px-2 py-1 text-xs rounded border border-gray-200 text-rose-600" @click="form.schedule.splice(i,1)">Hapus</button>
          </div>
        </div>
      </div>
    </div>

    <div v-show="activeTab==='FAQ'" class="mt-3">
      <div class="flex items-center justify-between">
        <p class="text-xs text-gray-500">FAQ</p>
        <button class="px-2 py-1 text-xs rounded border border-gray-200" @click="form.faqs.push({ q:'Pertanyaan?', a:'Jawaban.' })">Tambah</button>
      </div>
      <div class="mt-2 space-y-2">
        <div v-for="(f,i) in form.faqs" :key="'faq'+i" class="rounded-xl border border-gray-200 dark:border-neutral-700 p-3">
          <input v-model.trim="f.q" class="w-full rounded-md border px-3 py-2 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700" placeholder="Pertanyaan"/>
          <textarea v-model.trim="f.a" rows="2" class="mt-2 w-full rounded-md border px-3 py-2 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700" placeholder="Jawaban"></textarea>
          <div class="mt-2 flex gap-1">
            <button class="px-2 py-1 text-xs rounded border border-gray-200" @click="move(form.faqs,i,-1)" :disabled="i===0">↑</button>
            <button class="px-2 py-1 text-xs rounded border border-gray-200" @click="move(form.faqs,i,+1)" :disabled="i===form.faqs.length-1">↓</button>
            <button class="px-2 py-1 text-xs rounded border border-gray-200 text-rose-600" @click="form.faqs.splice(i,1)">Hapus</button>
          </div>
        </div>
      </div>
    </div>

    <div v-show="activeTab==='CTA'" class="mt-3 grid md:grid-cols-2 gap-3">
      <div class="md:col-span-2">
        <label class="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="form.cta.enabled" class="rounded border border-gray-200-gray-300"/>
          Tampilkan CTA
        </label>
      </div>
      <div>
        <label class="text-xs text-gray-500">Judul</label>
        <input v-model.trim="form.cta.title" class="mt-1 w-full rounded-md border px-3 py-2 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700"/>
      </div>
      <div>
        <label class="text-xs text-gray-500">Subjudul</label>
        <input v-model.trim="form.cta.subtitle" class="mt-1 w-full rounded-md border px-3 py-2 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700"/>
      </div>
      <div>
        <label class="text-xs text-gray-500">Teks Tombol</label>
        <input v-model.trim="form.cta.buttonText" class="mt-1 w-full rounded-md border px-3 py-2 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700"/>
      </div>
      <div>
        <label class="text-xs text-gray-500">Link Tombol</label>
        <input v-model.trim="form.cta.buttonHref" placeholder="/ppdb" class="mt-1 w-full rounded-md border px-3 py-2 border-gray-200 text-sm dark:bg-neutral-900 dark:border-neutral-700"/>
      </div>
    </div>


    <!-- PREVIEW -->
    <div v-show="activeTab==='Preview'" class="mt-3">
      <div class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60">
        <div class="relative">
          <div class="absolute inset-0">
            <img v-if="form.hero.cover" :src="form.hero.cover" class="w-full h-56 sm:h-64 object-cover opacity-80"/>
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10"/>
          </div>
          <div class="relative h-56 sm:h-64 flex items-end px-4 sm:px-6 lg:px-8">
            <div class="mb-6">
              <p class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-blue-200">
                <span class="inline-block size-2 rounded-full bg-blue-400" /> {{ form.hero.badge || 'Pondok Pesantren Alberr' }}
              </p>
              <h3 class="mt-1 text-2xl font-bold text-white">{{ form.hero.title || 'Pelajari Program' }}</h3>
              <p class="mt-1 text-blue-100">{{ form.hero.subtitle || 'Integrasi diniyah–akademik–karakter' }}</p>
            </div>
          </div>
        </div>
        <div class="p-4 sm:p-6">
          <div class="grid sm:grid-cols-1 lg:grid-cols-2 gap-3">
            <div v-for="s in form.stats.slice(0,4)" :key="s.label" class="rounded-xl border border-gray-200 dark:border-neutral-700 p-4">
              <div class="text-xs text-gray-500">{{ s.label }}</div>
              <div class="text-xl font-bold">{{ s.value }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notes -->
    <div class="mt-4 flex flex-wrap gap-2">
      <p v-if="savedNote" class="text-[11px] text-emerald-600">{{ savedNote }}</p>
      <p v-if="errNote" class="text-[11px] text-rose-600">{{ errNote }}</p>
    </div>

    <!-- Icon Picker Modal (Local + Online Iconify) -->
    <div v-if="iconModal.show" class="fixed inset-0 z-[1002] bg-black/30 backdrop-blur-sm flex items-start justify-center py-16 px-4" @click.self="closeIconPicker">
      <div class="w-full max-w-3xl rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700">
        <div class="p-4 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
          <h3 class="text-base font-semibold">Pilih Icon</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="closeIconPicker">×</button>
        </div>
        <div class="p-4 space-y-3">
          <div class="inline-flex bg-white/80 border border-gray-200 rounded-lg p-1 shadow-xs dark:bg-neutral-800/70 dark:border-neutral-700">
            <button v-for="t in iconModal.tabs" :key="t" @click="iconModal.activeTab=t"
              :class="['px-3 py-1.5 rounded-md text-sm', iconModal.activeTab===t ? 'bg-gray-900 text-white dark:bg-neutral-200 dark:text-neutral-900' : 'text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700']">
              {{ t }}
            </button>
          </div>

          <div class="flex gap-2">
            <input v-model.trim="iconModal.query" type="text" placeholder="Cari icon…" class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800" @input="onSearchInput" @keydown.enter.prevent="searchOnline(true)"/>
            <button v-if="iconModal.allowOnline" class="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 text-sm" :disabled="iconModal.loading" @click="searchOnline()">
              {{ iconModal.loading ? 'Mencari…' : 'Cari Online' }}
            </button>
          </div>

          <div class="max-h-[420px] overflow-auto rounded-lg border border-gray-200 dark:border-neutral-800 p-3">
            <div class="grid sm:grid-cols-6 grid-cols-4 gap-3">
              <button v-for="name in iconModal.visible" :key="name" @click="chooseIcon(name)" type="button" class="group p-3 rounded-xl border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 text-xs flex flex-col items-center gap-2">
                <ClientOnly><Icon :icon="name" width="24" height="24"/></ClientOnly>
                <span class="truncate w-full text-center" :title="name">{{ name }}</span>
              </button>
            </div>
            <p v-if="!iconModal.visible.length" class="text-sm text-gray-500 mt-3">Tidak ada icon.</p>
          </div>

          <div v-if="iconModal.allowOnline && iconModal.total > iconModal.limit" class="mt-3 flex items-center justify-between text-xs text-gray-600 dark:text-neutral-300">
            <span>Menampilkan {{ Math.min(iconModal.total, iconModal.start + 1) }}–{{ Math.min(iconModal.total, iconModal.start + iconModal.limit) }} dari {{ iconModal.total }}</span>
            <div class="inline-flex gap-2">
              <button type="button" class="px-2 py-1 rounded border border-gray-200 border-gray-200 dark:border-neutral-700 disabled:opacity-50" :disabled="iconModal.start===0||iconModal.loading" @click="prevPage">Prev</button>
              <button type="button" class="px-2 py-1 rounded border border-gray-200 border-gray-200 dark:border-neutral-700 disabled:opacity-50" :disabled="iconModal.start+iconModal.limit>=iconModal.total||iconModal.loading" @click="nextPage">Next</button>
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-gray-200 dark:border-neutral-800 flex justify-end">
          <button class="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700" @click="closeIconPicker">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useWeb } from '~/composables/data/useWeb'

type Program = {
  id: string
  title: string
  level: string
  category: string
  desc: string
  intensity: string
  cover: string
}
type Curriculum = {
  level: string
  subtitle: string
  icon: string
  description: string
  subjectsText?: string  // editor only
  booksText?: string     // editor only
  subjects?: string[]    // saved
  books?: string[]       // saved
}
type Shape = {
  hero: { cover: string; badge: string; title: string; subtitle: string; heightSm: string; heightLg: string }
  stats: { label: string; value: string; icon: string }[]
  filters: { levels: string[]; categories: string[] }
  programs: Program[]
  curriculum: Curriculum[]
  schedule: { time: string; title: string; note: string }[]
  faqs: { q: string; a: string }[]
  cta: { enabled: boolean; title: string; subtitle: string; buttonText: string; buttonHref: string }
}

const props = defineProps<{ section: { id: string; key: string; props?: Partial<Shape> }, pagePath?: string }>()

const defaults: Shape = {
  hero: {
    cover: '/assets/images/activity2.jpg',
    badge: 'Pondok Pesantren Alberr',
    title: 'Pelajari Program',
    subtitle: 'Integrasi diniyah–akademik–karakter: kurikulum terpadu, tahfidz, bahasa, kepemimpinan, kewirausahaan.',
    heightSm: '40vh',
    heightLg: '52vh'
  },
  stats: [
    { label: 'Target Hafalan', value: '5–15 Juz', icon: 'ph:book-open-text' },
    { label: 'Bahasa Asing', value: 'Arab & Inggris', icon: 'ph:translate' },
    { label: 'Ekstrakurikuler', value: '10+ Klub', icon: 'ph:medal-military' },
    { label: 'Jenjang', value: 'SMP–SMA', icon: 'ph:student' }
  ],
  filters: { levels: ['SMP', 'SMA'], categories: ['Tahfidz','Bahasa','Kepemimpinan','Akademik','Keterampilan'] },
  programs: [],
  curriculum: [
    {
      level: 'SMP ALBERR',
      subtitle: 'Fokus pembentukan dasar diniyah & akademik',
      icon: 'ph:student',
      description: 'Pondok Pesantren Modern Terpadu untuk SMP',
      subjectsText: 'Aqidah Akhlak\nFiqih\nHadits\nBahasa Arab Dasar\nMatematika & IPA',
      booksText: 'Safinatun Najah\nTaqrib\nAmtsilati Dasar'
    }
  ],
  schedule: [
    { time: '03.30', title: 'Qiyamul Lail & Tahajjud', note: 'Shalat malam & doa' },
    { time: '04.30', title: 'Shalat Subuh & Kultum', note: 'Kajian singkat' },
    { time: '07.00', title: 'KBM Akademik', note: 'Mapel umum + diniyah' },
    { time: '17.00', title: 'Halaqah Tahfidz', note: 'Setoran & murajaah' },
    { time: '20.00', title: 'Pengajian Kitab', note: 'Kajian kitab bersama Kyai' },
    { time: '22.00', title: 'Istirahat Malam', note: 'Tidur' }
  ],
  faqs: [
    { q: 'Apakah ada target hafalan?', a: 'SMP min 5 juz, SMA min 10 juz.' }
  ],
  cta: { enabled: true, title: 'Siap bergabung dengan program AlBerr?', subtitle: 'Daftar PPDB Online tahun ajaran berjalan.', buttonText: 'Daftar Sekarang', buttonHref: '#' },
}

function normalizeCurriculum(c: Curriculum): Curriculum {
  return {
    ...c,
    subjects: c.subjects ?? (c.subjectsText ? c.subjectsText.split('\n').map(s=>s.trim()).filter(Boolean) : []),
    books: c.books ?? (c.booksText ? c.booksText.split('\n').map(s=>s.trim()).filter(Boolean) : [])
  }
}
function denormalizeCurriculum(c: Curriculum): Curriculum {
  return {
    ...c,
    subjectsText: (c.subjects?.length ? c.subjects : c.subjectsText?.split('\n') || []).join('\n'),
    booksText: (c.books?.length ? c.books : c.booksText?.split('\n') || []).join('\n')
  }
}

function merge(base: Shape, patch?: Partial<Shape>): Shape {
  const p = patch || {}
  return {
    hero: { ...base.hero, ...(p.hero || {}) },
    stats: Array.isArray(p.stats) && p.stats.length ? p.stats : base.stats,
    filters: {
      levels: Array.isArray(p.filters?.levels) && p.filters!.levels!.length ? p.filters!.levels! : base.filters.levels,
      categories: Array.isArray(p.filters?.categories) && p.filters!.categories!.length ? p.filters!.categories! : base.filters.categories
    },
    programs: Array.isArray(p.programs) ? p.programs : base.programs,
    curriculum: (Array.isArray(p.curriculum) && p.curriculum.length ? p.curriculum : base.curriculum).map(denormalizeCurriculum),
    schedule: Array.isArray(p.schedule) && p.schedule.length ? p.schedule : base.schedule,
    faqs: Array.isArray(p.faqs) && p.faqs.length ? p.faqs : base.faqs,
    cta: { ...base.cta, ...(p.cta || {}) },
  }
}

const form = reactive<Shape>(merge(defaults, props.section?.props))
watch(() => props.section?.props, (p) => { Object.assign(form, merge(defaults, p)) })

const web = useWeb()
const uploading = reactive<Record<string, boolean>>({})
const savedNote = ref(''); const errNote = ref('')

const tabs = ['Hero','Stats','Filters','Programs','Curriculum','Timetable','FAQ','CTA','Preview'] as const
const activeTab = ref<typeof tabs[number]>('Hero')

function move<T>(arr: T[], i: number, d: number) {
  const ni = i + d; if (ni < 0 || ni >= arr.length) return
  const [it] = arr.splice(i,1); arr.splice(ni,0,it!)
}

async function onPickImage(ev: Event, setter:(u:string)=>void, key: string) {
  const input = ev.target as HTMLInputElement
  const file = input.files?.[0]; if (!file) return
  uploading[key] = true
  try {
    const up = await web.uploadMedia(file, { folder: 'media', filenamePrefix: 'program' })
    if (up?.url) setter(up.url)
  } catch (e:any) {
    errNote.value = e?.message || 'Gagal upload'
    setTimeout(()=> (errNote.value=''), 1700)
  } finally {
    uploading[key] = false
    input.value = ''
  }
}

function addProgram() {
  const id = String(Date.now())
  form.programs.push({
    id, title: 'Program Baru', level: form.filters.levels[0] || '', category: form.filters.categories[0] || '',
    desc: 'Deskripsi singkat…', intensity: '—', cover: ''
  })
}
function addCurriculum() {
  form.curriculum.push({ level: 'Level Baru', subtitle: '', icon: 'ph:book', description: '', subjectsText:'', booksText:'' })
}

async function save() {
  try {
    errNote.value = ''
    // normalize curriculum lists
    const payload: Shape = JSON.parse(JSON.stringify({
      ...form,
      curriculum: form.curriculum.map(normalizeCurriculum)
    }))
    const path = web.normalizePath?.(props.pagePath || '/program') || '/program'
    web.setActivePath?.(path)
    await web.updateSection(props.section.id, { props: payload }, path)
    savedNote.value = 'Tersimpan.'; setTimeout(() => (savedNote.value = ''), 1500)
  } catch (e:any) {
    errNote.value = e?.message || 'Gagal menyimpan'
  }
}
function resetToDefault() {
  Object.assign(form, merge(defaults))
  activeTab.value = 'Hero'
}

/* ===== Icon Picker (Local + Iconify API) ===== */
type PickerTarget = { type: 'stat' | 'curriculum'; index: number }
const iconModal = reactive({
  show: false,
  tabs: ['Local','Online'] as const,
  activeTab: 'Local' as 'Local'|'Online',
  query: '',
  visible: [] as string[],
  allowOnline: true,
  loading: false,
  total: 0, limit: 48, start: 0,
  controller: null as AbortController | null,
  target: null as PickerTarget | null,
  localAll: [
    'ph:book','ph:book-open-text','ph:translate','ph:medal-military','ph:student','ph:clock',
    'lucide:book','lucide:school','lucide:graduation-cap','lucide:users',
    'mdi:school-outline','mdi:book-open-variant','mdi:medal-outline',
    'tabler:book-2','tabler:certificate','tabler:sparkles'
  ]
})
function openIconPicker(target: PickerTarget) {
  iconModal.target = target
  iconModal.show = true
  iconModal.activeTab = 'Local'
  iconModal.query = ''
  filterLocal()
}
function closeIconPicker() {
  try { iconModal.controller?.abort?.() } catch {}
  iconModal.controller = null; iconModal.show = false; iconModal.visible = []; iconModal.query=''; iconModal.total=0; iconModal.start=0
}
function chooseIcon(name: string) {
  if (!iconModal.target) return
  if (iconModal.target.type === 'stat') {
    const i = iconModal.target.index; if (form.stats[i]) form.stats[i].icon = name
  } else {
    const i = iconModal.target.index; if (form.curriculum[i]) form.curriculum[i].icon = name
  }
  closeIconPicker()
}
function filterLocal() {
  const q = iconModal.query.trim().toLowerCase()
  const base = iconModal.localAll
  iconModal.visible = q ? base.filter(n => n.toLowerCase().includes(q)) : base.slice(0, iconModal.limit)
  iconModal.total = iconModal.visible.length
}
watch(() => iconModal.activeTab, (t) => { if (t==='Local') filterLocal(); else searchOnline(true) })
function onSearchInput() { if (iconModal.activeTab==='Local') filterLocal() }
function resetOnlinePaging(){ iconModal.start=0; iconModal.total=0 }
let searchDebounce: number | null = null as unknown as number
async function searchOnline(reset=true){
  if (!iconModal.allowOnline || typeof window==='undefined') return
  const q = iconModal.query.trim(); if (!q){ resetOnlinePaging(); return filterLocal() }
  if (reset) iconModal.start=0
  if (searchDebounce) window.clearTimeout(searchDebounce)
  searchDebounce = window.setTimeout(async ()=>{
    try { iconModal.controller?.abort?.() } catch {}
    iconModal.controller = new AbortController(); iconModal.loading = true
    try {
      const prefixes = ['mdi','tabler','material-symbols','ic','ph','lucide']
      const url = `https://api.iconify.design/search?query=${encodeURIComponent(q)}&limit=${encodeURIComponent(iconModal.limit)}&start=${encodeURIComponent(iconModal.start)}&prefixes=${encodeURIComponent(prefixes.join(','))}`
      const res = await fetch(url, { headers: { Accept:'application/json' }, signal: iconModal.controller.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json() as { icons?: string[]; total?: number; limit?: number; start?: number }
      const hits = Array.isArray(data.icons) ? data.icons : []
      iconModal.visible = hits; iconModal.total = Number(data.total || hits.length || 0)
      if (typeof data.limit==='number') iconModal.limit=data.limit
      if (typeof data.start==='number') iconModal.start=data.start
      if (!hits.length) filterLocal()
    } catch(e) { if ((e as any)?.name!=='AbortError') filterLocal() }
    finally { iconModal.loading = false }
  }, 220) as unknown as number
}
function prevPage(){ if (iconModal.start===0) return; iconModal.start = Math.max(0, iconModal.start - iconModal.limit); searchOnline(false) }
function nextPage(){ if (iconModal.start + iconModal.limit >= iconModal.total) return; iconModal.start += iconModal.limit; searchOnline(false) }
</script>
