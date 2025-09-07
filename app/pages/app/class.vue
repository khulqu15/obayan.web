<template>
  <div class="p-4">
    <!-- ===================== LIST VIEW ===================== -->
    <template v-if="!kode">
      <div class="w-full flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="flex items-center gap-2">
          <h1 class="text-xl font-semibold">Kelas</h1>
          <span class="text-sm text-gray-500 dark:text-neutral-400">({{ filtered.length }})</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="relative">
            <Icon icon="lucide:search" class="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              v-model="q"
              type="search"
              placeholder="Cari kelas…"
              class="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-100 bg-white dark:bg-neutral-800 dark:border-neutral-700 w-64
                     focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <select
            v-model="selectedCategory"
            class="px-3 py-2 text-sm rounded-lg border border-gray-100 bg-white dark:bg-neutral-800 dark:border-neutral-700"
          >
            <option value="all">Semua Kategori</option>
            <option value="putra">Putra</option>
            <option value="putri">Putri</option>
            <option value="campuran">Campuran</option>
          </select>

          <label class="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" v-model="showArchived" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
            Tampilkan Arsip
          </label>

          <button
            @click="openCreateClass"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            <Icon icon="lucide:plus" class="size-4" /> Kelas Baru
          </button>
        </div>
      </div>

      <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="c in filtered"
          :key="c.id"
          class="group rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-xs dark:bg-neutral-800 dark:border-neutral-700"
          @click="goDetailByCode(c.code)"
        >
          <div class="relative h-28">
            <img v-if="c.coverUrl" :src="c.coverUrl" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full" :style="{ background: c.color || '#2563eb' }"></div>

            <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div class="absolute bottom-2 left-3 right-3 text-white">
              <div class="flex items-center justify-between">
                <div class="min-w-0">
                  <h3 class="font-semibold leading-tight truncate">{{ c.title }}</h3>
                  <p class="text-xs opacity-90 truncate">
                    <span v-if="c.level">{{ c.level }}</span>
                    <span v-if="c.level && c.section"> · </span>
                    <span v-if="c.section">{{ c.section }}</span>
                  </p>
                </div>
                <button class="p-1.5 rounded-md hover:bg-white/10" @click.stop="openMenu(c, $event)">
                  <Icon icon="lucide:more-vertical" class="size-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          <div class="p-3 flex items-center justify-between">
            <span class="inline-flex items-center gap-1 text-xs rounded-md px-2 py-1 border dark:border-neutral-700" :class="badgeClass(c.category)">
              <Icon :icon="badgeIcon(c.category)" class="size-3.5" />
              {{ labelCategory(c.category) }}
            </span>
            <span class="text-xs text-gray-500 dark:text-neutral-400">
              Kode: <b>{{ c.code }}</b>
            </span>
          </div>

          <div class="px-3 pb-3 text-xs text-gray-500 dark:text-neutral-400 flex items-center justify-between">
            <span v-if="c.room">Ruang: {{ c.room }}</span>
            <span v-if="c.archived" class="text-rose-500">Diarsipkan</span>
          </div>
        </div>
      </div>

      <!-- Context Menu (LIST) -->
      <teleport to="body">
        <div
          v-if="menu.open"
          class="fixed z-[80] min-w-48 rounded-lg border border-gray-100 bg-white shadow-lg dark:bg-neutral-800 dark:border-neutral-700"
          :style="{ left: menu.x + 'px', top: menu.y + 'px' }"
          @click.stop
        >
          <div class="px-3 py-2 text-xs text-gray-500 dark:text-neutral-400 border-b dark:border-neutral-700">
            {{ menu.current?.title }}
          </div>
          <ul class="py-1 text-sm">
            <li>
              <button class="w-full text-left px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-neutral-700" @click="editCurrentClass">
                Edit
              </button>
            </li>
            <li v-if="!menu.current?.archived">
              <button class="w-full text-left px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-neutral-700" @click="archiveCurrentClass">
                Arsipkan
              </button>
            </li>
            <li v-else>
              <button class="w-full text-left px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-neutral-700" @click="unarchiveCurrentClass">
                Keluarkan dari Arsip
              </button>
            </li>
            <li>
              <button class="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-rose-600 dark:hover:bg-neutral-700" @click="deleteCurrentClass">
                Hapus
              </button>
            </li>
          </ul>
        </div>
      </teleport>

      <!-- Modal Create/Edit Class -->
      <teleport to="body">
        <div v-if="classModal.open" class="fixed inset-0 z-[90]">
          <div class="absolute inset-0 bg-black/40" @click="closeClassModal"></div>
          <div class="absolute inset-0 flex items-center justify-center p-4">
            <div class="w-full max-w-lg rounded-2xl border border-gray-100 bg-white shadow-xl dark:bg-neutral-800 dark:border-neutral-700">
              <div class="p-4 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
                <h3 class="font-semibold">{{ classModal.mode === 'create' ? 'Kelas Baru' : 'Edit Kelas' }}</h3>
                <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700" @click="closeClassModal">
                  <Icon icon="lucide:x" class="size-4" />
                </button>
              </div>

              <form class="p-4 space-y-3 max-h-[80vh] overflow-y-auto scrollbar-none" @submit.prevent="saveClassModal">
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Cover</label>
                  <div class="mt-1 flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      @change="onPickClassCover"
                      class="block w-full text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-gray-100
                             dark:file:bg-neutral-700 dark:file:text-neutral-200"
                    />
                    <button
                      v-if="classCoverPreview"
                      type="button"
                      class="px-2 py-1 text-xs rounded-md border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
                      @click="clearClassCover"
                    >
                      Hapus
                    </button>
                  </div>
                  <div v-if="classCoverPreview" class="mt-2 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700">
                    <img :src="classCoverPreview" alt="cover" class="w-full h-36 object-cover">
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label class="text-xs text-gray-500 dark:text-neutral-400">Nama Kelas</label>
                    <input
                      v-model.trim="classForm.title"
                      type="text"
                      class="mt-1 w-full rounded-md border-gray-300 border bg-white dark:bg-neutral-900 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      required
                    />
                  </div>
                  <div>
                    <label class="text-xs text-gray-500 dark:text-neutral-400">Level/Paralel</label>
                    <input
                      v-model.trim="classForm.level"
                      type="text"
                      placeholder="Contoh: 1 SMP A"
                      class="mt-1 w-full rounded-md border-gray-300 border bg-white dark:bg-neutral-900 dark:border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label class="text-xs text-gray-500 dark:text-neutral-400">Kategori</label>
                    <select
                      v-model="classForm.category"
                      class="mt-1 w-full rounded-md border-gray-300 border bg-white dark:bg-neutral-900 dark:border-neutral-700 px-3 py-2 text-sm"
                    >
                      <option value="putra">Putra</option>
                      <option value="putri">Putri</option>
                      <option value="campuran">Campuran</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-xs text-gray-500 dark:text-neutral-400">Ruang</label>
                    <input
                      v-model.trim="classForm.room"
                      type="text"
                      class="mt-1 w-full rounded-md border-gray-300 border bg-white dark:bg-neutral-900 dark:border-neutral-700 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label class="text-xs text-gray-500 dark:text-neutral-400">Warna</label>
                    <input
                      v-model="classForm.color"
                      type="color"
                      class="mt-1 h-9 rounded-md border w-full bg-white border-gray-300 dark:bg-neutral-900 dark:border-neutral-700 px-1 py-1 text-sm"
                    />
                  </div>
                  <div>
                    <label class="text-xs text-gray-500 dark:text-neutral-400">Kode Kelas</label>
                    <input
                      v-model.trim="classForm.code"
                      type="text"
                      placeholder="Auto jika kosong"
                      class="mt-1 w-full rounded-md border-gray-300 border bg-white dark:bg-neutral-900 dark:border-neutral-700 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div class="flex items-center justify-end pt-1">
                  <button type="submit" class="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                    <Icon v-if="savingClass" icon="ph:spinner" class="size-4 animate-spin" />
                    <span>{{ savingClass ? 'Menyimpan…' : (classModal.mode==='create' ? 'Simpan' : 'Update') }}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </teleport>
    </template>

    <!-- ===================== DETAIL VIEW ===================== -->
    <template v-else>
      <div v-if="kode && !klass" class="rounded-xl border p-4 dark:border-neutral-700">
        Kelas dengan kode <b>{{ kode }}</b> tidak ditemukan atau sedang memuat...
      </div>

      <div v-else class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-semibold">{{ klass?.title }}</h1>
            <p class="text-sm text-gray-500 dark:text-neutral-400">
              <span v-if="klass?.level">{{ klass.level }}</span>
              <span v-if="klass?.level && klass?.section"> · </span>
              <span v-if="klass?.section">{{ klass.section }}</span>
              <span v-if="klass?.room"> · Ruang {{ klass.room }}</span>
              <span class="ml-2">Kode: <b>{{ klass?.code }}</b></span>
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button class="px-3 py-1.5 rounded-lg border dark:border-neutral-700" @click="goBack">Kembali</button>
          </div>
        </div>

        <div class="h-36 w-full rounded-2xl overflow-hidden border border-gray-100 dark:border-neutral-700 relative">
          <img v-if="klass?.coverUrl" :src="klass.coverUrl" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full" :style="{ background: klass?.color || '#2563eb' }"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>

        <!-- Tabs -->
        <div class="border-b border-gray-100 dark:border-neutral-700 flex gap-3 text-sm items-center">
          <button
            v-for="t in tabs"
            :key="t"
            class="px-3 py-2 -mb-px"
            :class="tab===t ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 dark:text-neutral-400'"
            @click="tab=t"
          >
            {{ t }}
          </button>
          <div class="flex-1" />
          <button v-if="tab==='Tugas'" class="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700" @click="openTaskModal()">
            <Icon icon="lucide:plus" class="inline-block mr-1 -mt-0.5" /> Tugas Baru
          </button>
          <button v-if="tab==='Materi'" class="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700" @click="openMaterialModal()">
            <Icon icon="lucide:plus" class="inline-block mr-1 -mt-0.5" /> Materi Baru
          </button>
          <button v-if="tab==='Forum'" class="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700" @click="openPostModal()">
            <Icon icon="lucide:plus" class="inline-block mr-1 -mt-0.5" /> Posting
          </button>
        </div>

        <div>
          <!-- Stream -->
          <div v-if="tab==='Stream'" class="grid gap-3">
            <div
              v-for="item in latestFeed"
              :key="item.key"
              class="rounded-xl border border-gray-200 p-3 bg-white dark:bg-neutral-800 dark:border-neutral-700"
            >
              <div class="text-xs text-gray-500 dark:text-neutral-400">{{ item.type }} • {{ formatDateTime(item.createdAt) }}</div>
              <div class="mt-1 font-medium">{{ item.title }}</div>
              <div class="text-sm text-gray-600 dark:text-neutral-300" v-if="item.desc">{{ item.desc }}</div>
            </div>
            <div v-if="!latestFeed.length" class="text-sm text-gray-500 dark:text-neutral-400">Belum ada aktivitas.</div>
          </div>

          <!-- Tugas -->
          <div v-else-if="tab==='Tugas'" class="grid gap-3">
            <div
              v-for="t in tasks"
              :key="t.id"
              class="rounded-xl border border-gray-200 p-3 bg-white dark:bg-neutral-800 dark:border-neutral-700"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="font-semibold truncate">{{ t.title }}</div>
                  <div class="text-xs text-gray-500 dark:text-neutral-400 mt-0.5" v-if="t.dueAt">Deadline: {{ formatDateTime(t.dueAt) }}</div>
                  <div class="text-sm text-gray-600 dark:text-neutral-300 mt-1" v-if="t.desc">{{ t.desc }}</div>
                </div>
                <div class="shrink-0 flex gap-2">
                  <button class="px-2 py-1 text-xs rounded-md border dark:border-neutral-700" @click="openTaskModal(t)">Edit</button>
                  <button class="px-2 py-1 text-xs rounded-md border text-rose-600 dark:border-neutral-700" @click="deleteTask(t.id)">Hapus</button>
                </div>
              </div>
            </div>
            <div v-if="!tasks.length" class="text-sm text-gray-500 dark:text-neutral-400">Belum ada tugas.</div>
          </div>

          <!-- Materi -->
          <div v-else-if="tab==='Materi'" class="grid gap-3">
            <div
              v-for="m in materials"
              :key="m.id"
              class="rounded-xl border border-gray-200 p-3 bg-white dark:bg-neutral-800 dark:border-neutral-700"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="font-semibold truncate">{{ m.title }}</div>
                  <div class="text-sm text-gray-600 dark:text-neutral-300 mt-1" v-if="m.desc">{{ m.desc }}</div>
                  <a v-if="m.fileUrl" :href="m.fileUrl" target="_blank" class="text-xs text-blue-600 underline mt-2 inline-block">Lihat / Unduh</a>
                </div>
                <div class="shrink-0 flex gap-2">
                  <button class="px-2 py-1 text-xs rounded-md border dark:border-neutral-700" @click="openMaterialModal(m)">Edit</button>
                  <button class="px-2 py-1 text-xs rounded-md border text-rose-600 dark:border-neutral-700" @click="deleteMaterial(m.id)">Hapus</button>
                </div>
              </div>
            </div>
            <div v-if="!materials.length" class="text-sm text-gray-500 dark:text-neutral-400">Belum ada materi.</div>
          </div>

          <!-- Forum -->
          <div v-else-if="tab==='Forum'" class="grid gap-3">
            <div
              v-for="p in posts"
              :key="p.id"
              class="rounded-xl border border-gray-200 p-3 bg-white dark:bg-neutral-800 dark:border-neutral-700"
            >
              <div class="text-xs text-gray-500 dark:text-neutral-400">{{ formatDateTime(p.createdAt) }}</div>
              <div class="font-semibold mt-0.5 truncate">{{ p.title }}</div>
              <div class="text-sm text-gray-600 dark:text-neutral-300 mt-1" v-if="p.content">{{ p.content }}</div>
              <div class="mt-2 flex gap-2">
                <button class="px-2 py-1 text-xs rounded-md border dark:border-neutral-700" @click="openPostModal(p)">Edit</button>
                <button class="px-2 py-1 text-xs rounded-md border text-rose-600 dark:border-neutral-700" @click="deletePost(p.id)">Hapus</button>
              </div>
            </div>
            <div v-if="!posts.length" class="text-sm text-gray-500 dark:text-neutral-400">Belum ada diskusi.</div>
          </div>

          <!-- ===================== ANGGOTA ===================== -->
          <div v-else-if="tab==='Anggota'" class="grid lg:grid-cols-12 gap-4">
            <!-- Kiri: sumber santri (belum anggota) + multi-select -->
            <div class="lg:col-span-7 space-y-3">
              <div class="rounded-xl border border-gray-200 p-3 bg-white dark:bg-neutral-800 dark:border-neutral-700">
                <div class="flex flex-wrap items-center gap-2">
                  <!-- Autocomplete add-one -->
                  <div class="relative">
                    <Icon icon="lucide:user-plus" class="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      v-model="autocompleteQuery"
                      type="search"
                      placeholder="Tambah cepat: ketik nama/ortu/kamar lalu Enter"
                      @keydown.enter.prevent="handleAutocompleteEnter"
                      @input="showAutocomplete = true"
                      class="w-80 pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-100 bg-white
                             dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                    <!-- dropdown suggestion -->
                    <div
                      v-if="showAutocomplete && autocompleteQuery && filteredSuggestions.length"
                      class="absolute z-20 mt-1 w-[28rem] rounded-lg border border-gray-200 bg-white shadow-lg
                             dark:bg-neutral-800 dark:border-neutral-700 max-h-72 overflow-y-auto"
                    >
                      <button
                        v-for="opt in filteredSuggestions"
                        :key="opt.id"
                        type="button"
                        class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-neutral-700"
                        :disabled="addingIds.has(opt.id)"
                        @click="addMembers([opt.id]); resetAutocomplete()"
                      >
                        <div class="font-medium truncate">{{ opt.santri }}</div>
                        <div class="text-xs text-gray-500 dark:text-neutral-400 truncate">
                          {{ opt.walisantri || '-' }} · Gen {{ opt.gen || '-' }} · {{ opt.kamar || '-' }}
                        </div>
                      </button>
                    </div>
                  </div>

                  <!-- Filter daftar -->
                  <div class="relative">
                    <Icon icon="lucide:search" class="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      v-model="santriFilter"
                      type="search"
                      placeholder="Cari santri (belum anggota)…"
                      class="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-100 bg-white dark:bg-neutral-800 dark:border-neutral-700 w-64
                             focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>

                  <div class="ml-auto flex items-center gap-2">
                    <label class="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        v-model="selectAllVisible"
                        @change="toggleSelectAllVisible"
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      >
                      Pilih semua tampak
                    </label>
                    <button
                      :disabled="!selectedAddIds.size"
                      class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-lg
                             bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                      @click="addMembers(Array.from(selectedAddIds))"
                    >
                      <Icon icon="lucide:user-plus" class="size-4" /> Tambah terpilih ({{ selectedAddIds.size }})
                    </button>
                  </div>
                </div>
              </div>

              <div class="rounded-xl border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700 overflow-hidden">
                <div class="px-3 py-2 text-xs text-gray-500 dark:text-neutral-400 border-b dark:border-neutral-700">
                  {{ availableSantri.length }} santri belum bergabung
                </div>
                <div class="max-h-[60vh] overflow-y-auto divide-y divide-gray-100 dark:divide-neutral-700">
                  <label
                    v-for="s in visibleAvailableSantri"
                    :key="s.id"
                    class="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700/50"
                  >
                    <input
                      type="checkbox"
                      :value="s.id"
                      :checked="selectedAddIds.has(s.id)"
                      @change="toggleSelectOne(s.id, $event)"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div class="min-w-0">
                      <div class="font-medium truncate">{{ s.santri }}</div>
                      <div class="text-xs text-gray-500 dark:text-neutral-400 truncate">
                        {{ s.walisantri || '-' }} · Gen {{ s.gen || '-' }} · {{ s.kamar || '-' }}
                      </div>
                    </div>
                    <button
                      type="button"
                      class="ml-auto px-2 py-1 text-xs rounded-md border dark:border-neutral-700 disabled:opacity-50"
                      :disabled="addingIds.has(s.id)"
                      @click.stop.prevent="addMembers([s.id])"
                    >
                      <span v-if="addingIds.has(s.id)">
                        <Icon icon="ph:spinner" class="size-3 animate-spin" />
                      </span>
                      <span v-else>Tambah</span>
                    </button>
                  </label>
                  <div v-if="!visibleAvailableSantri.length" class="p-3 text-sm text-gray-500 dark:text-neutral-400">
                    Tidak ada hasil. Coba ubah kata kunci.
                  </div>
                </div>
              </div>
            </div>

            <!-- Kanan: daftar anggota -->
            <div class="lg:col-span-5 space-y-3">
              <div class="rounded-xl border border-gray-200 p-3 bg-white dark:bg-neutral-800 dark:border-neutral-700">
                <div class="flex items-center gap-2">
                  <Icon icon="lucide:users" class="size-4" />
                  <div class="font-medium">Anggota Kelas</div>
                  <div class="text-xs text-gray-500 dark:text-neutral-400">({{ membersDetailed.length }})</div>
                  <div class="ml-auto relative">
                    <Icon icon="lucide:search" class="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      v-model="memberFilter"
                      type="search"
                      placeholder="Cari anggota…"
                      class="pl-8 pr-3 py-1.5 text-sm rounded-lg border border-gray-100 bg-white dark:bg-neutral-800 dark:border-neutral-700 w-56
                             focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                </div>
              </div>

              <div class="rounded-xl border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700 overflow-hidden">
                <div class="max-h-[60vh] overflow-y-auto divide-y divide-gray-100 dark:divide-neutral-700">
                  <div
                    v-for="m in visibleMembers"
                    :key="m.id"
                    class="flex items-center gap-3 px-3 py-2"
                  >
                    <div class="min-w-0">
                      <div class="font-medium truncate">{{ m.santri }}</div>
                      <div class="text-xs text-gray-500 dark:text-neutral-400 truncate">
                        {{ m.walisantri || '-' }} · Gen {{ m.gen || '-' }} · {{ m.kamar || '-' }}
                      </div>
                    </div>
                    <button
                      type="button"
                      class="ml-auto px-2 py-1 text-xs rounded-md border text-rose-600 dark:border-neutral-700"
                      :disabled="removingIds.has(m.id)"
                      @click="removeMember(m.id)"
                    >
                      <span v-if="removingIds.has(m.id)">
                        <Icon icon="ph:spinner" class="size-3 animate-spin" />
                      </span>
                      <span v-else>Hapus</span>
                    </button>
                  </div>
                  <div v-if="!visibleMembers.length" class="p-3 text-sm text-gray-500 dark:text-neutral-400">
                    Belum ada anggota.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- =================== END ANGGOTA =================== -->
        </div>
      </div>

      <!-- Item Modal (Tugas/Materi/Forum) -->
      <teleport to="body">
        <div v-if="itemModal.open" class="fixed inset-0 z-[90]">
          <div class="absolute inset-0 bg-black/40" @click="closeItemModal" />
          <div class="absolute inset-0 flex items-center justify-center p-4">
            <div class="w-full max-w-lg rounded-2xl border border-gray-100 bg-white shadow-xl dark:bg-neutral-800 dark:border-neutral-700">
              <div class="p-4 border-b border-gray-200 dark:border-neutral-700 font-semibol flex justify-between">
                <div>
                  {{ itemModal.title }}
                </div>
                <div @click="closeItemModal"><Icon icon="material-symbols:close-rounded" width="24" height="24" /></div>
              </div>
              <form class="p-4 space-y-3 max-h-[80vh] overflow-y-auto scrollbar-none" @submit.prevent="saveItemModal">
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400">Judul</label>
                  <input v-model.trim="itemForm.title" type="text" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" required />
                </div>

                <template v-if="itemModal.kind==='Tugas'">
                  <div>
                    <label class="text-xs text-gray-500 dark:text-neutral-400">Deskripsi</label>
                    <textarea v-model.trim="itemForm.desc" rows="3" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
                  </div>
                  <div>
                    <label class="text-xs text-gray-500 dark:text-neutral-400">Deadline</label>
                    <input v-model="itemForm.due" type="datetime-local" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
                  </div>
                </template>

                <template v-else-if="itemModal.kind==='Materi'">
                  <div>
                    <label class="text-xs text-gray-500 dark:text-neutral-400">Deskripsi</label>
                    <textarea v-model.trim="itemForm.desc" rows="3" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
                  </div>
                  <div>
                    <label class="text-xs text-gray-500 dark:text-neutral-400">File</label>
                    <input type="file" @change="onPickItemFile" class="mt-1 block w-full text-sm" />
                    <div v-if="itemFileName" class="text-xs mt-1 text-gray-500 dark:text-neutral-400">Terpilih: {{ itemFileName }}</div>
                  </div>
                </template>

                <template v-else-if="itemModal.kind==='Forum'">
                  <div>
                    <label class="text-xs text-gray-500 dark:text-neutral-400">Isi</label>
                    <textarea v-model.trim="itemForm.content" rows="4" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:border-neutral-700" />
                  </div>
                </template>

                <div class="flex justify-end w-full pt-1 gap-2">
                  <button @click="closeClassModal" type="button" class="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-neutral-800 text-gray-800 dark:text-neutral-200 flex self-end">
                    Tutup
                  </button>
                  <button type="submit" class="px-3 py-1.5 rounded-lg bg-blue-600 text-white flex self-end">
                    <Icon v-if="savingItem" icon="ph:spinner" class="size-4 animate-spin" />
                    <span>{{ savingItem ? 'Menyimpan…' : 'Simpan' }}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </teleport>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onMounted, onUnmounted, ref, reactive, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  useClass,
  type ClassItem,
  type ClassCategory,
  type TaskItem,
  type MaterialItem,
  type PostItem
} from '~/composables/data/useClass'
import { useSantri, type SantriRow } from '~/composables/data/useSantri'
import { ref as dbRef, onValue, off, update, get } from 'firebase/database'
import { useNuxtApp } from '#app'

definePageMeta({ layout: 'app', layoutProps: { title: 'Kelas' } })

const route = useRoute()
const router = useRouter()
const addingIds = ref<Set<string>>(new Set())
const removingIds = ref<Set<string>>(new Set())
const membershipKey = ref<string>('')

/** ===== useClass (list + detail + CRUD) ===== */
const {
  // List
  filtered, q, selectedCategory, showArchived, subscribeAll,
  createClass, updateClass, deleteClass, archiveClass,
  // Detail
  klass, tasks, materials, posts, latestFeed, subscribeByCode, unbindDetail,
  // Detail CRUD
  createTask, updateTask, deleteTask,
  createMaterial, updateMaterial, deleteMaterial,
  createPost, updatePost, deletePost, currentCode, currentId
} = useClass()

/** ===== Santri source ===== */
const { rows: santriRows, subscribeSantri, unsubscribeSantri } = useSantri()

/** ===== Router state ===== */
const kode = ref<string | null>(null)
watch(
  () => route.query.kode,
  async (v) => {
    kode.value = typeof v === 'string' ? v.toUpperCase() : null
    if (kode.value) {
      await subscribeByCode(kode.value)
    } else {
      unbindDetail()
    }
  },
  { immediate: true }
)

/** ===== LIST VIEW: context menu & class modal ===== */
const menu = reactive<{ open:boolean; x:number; y:number; current:ClassItem|null }>({ open:false, x:0, y:0, current:null })
function openMenu(c: ClassItem, e: MouseEvent) {
  menu.current = c
  const el = (e.currentTarget as HTMLElement) ?? (e.target as HTMLElement)
  const rect = el.getBoundingClientRect()
  const MENU_W = 220, MENU_H = 200, PAD = 8
  let x = rect.right + 4, y = rect.bottom + 6
  if (x + MENU_W + PAD > window.innerWidth)  x = Math.max(PAD, window.innerWidth - MENU_W - PAD)
  if (y + MENU_H + PAD > window.innerHeight) y = Math.max(PAD, window.innerHeight - MENU_H - PAD)
  menu.x = x; menu.y = y; menu.open = true
  const close = () => (menu.open = false)
  window.addEventListener('click', close, { once: true })
  window.addEventListener('keydown', (ke) => ke.key === 'Escape' && close(), { once: true })
}

function editCurrentClass(){ if (menu.current) openEditClass(menu.current); menu.open=false }
async function deleteCurrentClass(){
  if (!menu.current) return
  if (confirm(`Hapus kelas "${menu.current.title}"?`)) await deleteClass(menu.current.id)
  menu.open=false
}
async function archiveCurrentClass(){ if (menu.current) await archiveClass(menu.current.id, true); menu.open=false }
async function unarchiveCurrentClass(){ if (menu.current) await archiveClass(menu.current.id, false); menu.open=false }

async function resolveMembershipKey() {
  const idKey = currentId.value || ''
  const codeKey = (klass.value?.code || currentCode.value || '').toString()
  let chosen = idKey || codeKey
  try {
    if (codeKey) {
      const sCode = await get(dbRef($realtimeDb, `alberr/class_members/${codeKey}`))
      if (sCode.exists()) chosen = codeKey
    }
  } catch (e) {
    console.warn('resolveMembershipKey:', e)
  }
  membershipKey.value = chosen
  bindMembers(chosen)
}

watch([currentId, currentCode], () => { resolveMembershipKey() })
watch(klass, () => { resolveMembershipKey() })

const classModal = reactive<{ open:boolean; mode:'create'|'edit'; id?:string }>(
  { open:false, mode:'create', id: undefined }
)
const classForm = reactive<{ title:string; level:string; category:ClassCategory; room:string; color:string; code:string }>(
  { title:'', level:'', category:'campuran', room:'', color:'#2563eb', code:'' }
)
const classCoverFile = ref<File|null>(null)
const classCoverPreview = ref<string|null>(null)
const savingClass = ref(false)

function resetClassForm() {
  classForm.title=''; classForm.level=''; classForm.category='campuran'; classForm.room=''; classForm.color='#2563eb'; classForm.code=''
}
function openCreateClass() {
  resetClassForm(); clearClassCover(); classModal.mode='create'; classModal.open=true; classModal.id=undefined
}
function openEditClass(c: ClassItem) {
  resetClassForm(); clearClassCover(); classModal.mode='edit'; classModal.open=true; classModal.id=c.id
  classForm.title=c.title || ''; classForm.level=c.level || ''; classForm.category=c.category; classForm.room=c.room || ''; classForm.color=c.color || '#2563eb'; classForm.code=c.code || ''
  classCoverPreview.value = c.coverUrl || null
}
async function saveClassModal() {
  if (savingClass.value) return
  savingClass.value = true
  try {
    if (classModal.mode === 'create') {
      await createClass({
        title: classForm.title,
        level: classForm.level,
        category: classForm.category,
        room: classForm.room,
        color: classForm.color,
        code: classForm.code || undefined,
        coverFile: classCoverFile.value || undefined
      })
    } else if (classModal.mode === 'edit' && classModal.id) {
      await updateClass(classModal.id, {
        title: classForm.title,
        level: classForm.level,
        category: classForm.category,
        room: classForm.room,
        color: classForm.color,
        code: classForm.code || undefined,
        coverFile: classCoverFile.value || undefined
      })
    }
    classModal.open = false
    clearClassCover()
  } finally {
    savingClass.value = false
  }
}
function closeClassModal(){ classModal.open=false }
function onPickClassCover(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0] || null
  classCoverFile.value = f
  classCoverPreview.value = f ? URL.createObjectURL(f) : null
}
function clearClassCover() { classCoverFile.value=null; classCoverPreview.value=null }

/** ===== DETAIL VIEW: tabs & item modal ===== */
const tab = ref<'Stream'|'Tugas'|'Materi'|'Forum'|'Anggota'>('Stream')
const tabs = ['Stream','Tugas','Materi','Forum','Anggota'] as const

const itemModal = reactive<{ open:boolean; title:string; kind:'Tugas'|'Materi'|'Forum'; editingId?:string | null }>({
  open:false, title:'', kind:'Tugas', editingId:null
})
const itemForm = reactive<{ title:string; desc:string; due:string; content:string }>({
  title:'', desc:'', due:'', content:''
})
const savingItem = ref(false)
const itemFile = ref<File|null>(null)
const itemFileName = ref('')

function formatDateTime(ms?: number|null) {
  if (!ms) return '-'
  try { return new Date(ms).toLocaleString('id-ID') } catch { return '-' }
}

function badgeClass(cat: ClassCategory) {
  const base = 'border border-gray-200 px-2 py-1 rounded-md'
  switch (cat) {
    case 'putra': return `${base} text-emerald-700 dark:text-emerald-300`
    case 'putri': return `${base} text-pink-700 dark:text-pink-300`
    default:      return `${base} text-indigo-700 dark:text-indigo-300`
  }
}
function badgeIcon(cat: ClassCategory) {
  return cat === 'putra'
    ? 'lucide:badge-check'
    : cat === 'putri'
    ? 'lucide:sparkles'
    : 'lucide:users'
}
function labelCategory(cat: ClassCategory) {
  return cat === 'putra' ? 'Putra' : cat === 'putri' ? 'Putri' : 'Campuran'
}

function resetItemForm() { itemForm.title=''; itemForm.desc=''; itemForm.due=''; itemForm.content=''; itemFile.value=null; itemFileName.value='' }
function closeItemModal(){ itemModal.open=false }
function onPickItemFile(e: Event){ const f=(e.target as HTMLInputElement).files?.[0]||null; itemFile.value=f; itemFileName.value=f?f.name:'' }

function openTaskModal(row?: TaskItem) {
  resetItemForm(); itemModal.kind='Tugas'; itemModal.title=row?'Edit Tugas':'Tugas Baru'; itemModal.editingId=row?.id||null
  if (row){ itemForm.title=row.title; itemForm.desc=row.desc||''; itemForm.due=row.dueAt?new Date(row.dueAt).toISOString().slice(0,16):'' }
  itemModal.open=true
}
function openMaterialModal(row?: MaterialItem) {
  resetItemForm(); itemModal.kind='Materi'; itemModal.title=row?'Edit Materi':'Materi Baru'; itemModal.editingId=row?.id||null
  if (row){ itemForm.title=row.title; itemForm.desc=row.desc||'' }
  itemModal.open=true
}
function openPostModal(row?: PostItem) {
  resetItemForm(); itemModal.kind='Forum'; itemModal.title=row?'Edit Post':'Posting Baru'; itemModal.editingId=row?.id||null
  if (row){ itemForm.title=row.title; itemForm.content=row.content||'' }
  itemModal.open=true
}

async function saveItemModal() {
  if (savingItem.value) return
  savingItem.value = true
  try {
    if (itemModal.kind === 'Tugas') {
      if (!itemModal.editingId) await createTask({ title: itemForm.title, desc: itemForm.desc, due: itemForm.due || null })
      else await updateTask(itemModal.editingId, { title: itemForm.title, desc: itemForm.desc, due: itemForm.due || null })
    } else if (itemModal.kind === 'Materi') {
      if (!itemModal.editingId) await createMaterial({ title: itemForm.title, desc: itemForm.desc, file: itemFile.value })
      else await updateMaterial(itemModal.editingId, { title: itemForm.title, desc: itemForm.desc, file: itemFile.value || undefined })
    } else {
      if (!itemModal.editingId) await createPost({ title: itemForm.title, content: itemForm.content })
      else await updatePost(itemModal.editingId, { title: itemForm.title, content: itemForm.content })
    }
    closeItemModal()
  } finally {
    savingItem.value = false
  }
}

/** ===== Anggota: state & helpers ===== */
const { $realtimeDb } = useNuxtApp()

// id santri yang menjadi anggota kelas ini
const memberIds = ref<string[]>([])
let stopMembers: (() => void) | null = null

function bindMembers(key: string) {
  unbindMembers()
  if (!key) return
  const r = dbRef($realtimeDb, `alberr/class_members/${key}`)
  const handler = (snap:any) => {
    const val = snap.val() || {}
    memberIds.value = Object.keys(val)
  }
  onValue(r, handler)
  stopMembers = () => off(r, 'value', handler)
}

function unbindMembers(){ if (stopMembers) { stopMembers(); stopMembers = null } }

watch(klass, (k) => {
  if (k?.id) bindMembers(k.id)
  else unbindMembers()
})

// detail anggota (gabung id -> SantriRow)
const membersDetailed = computed<SantriRow[]>(() => {
  const set = new Set(memberIds.value)
  return santriRows.value.filter(s => set.has(s.id))
})

// santri yang belum jadi anggota
const availableSantri = computed<SantriRow[]>(() => {
  const set = new Set(memberIds.value)
  return santriRows.value.filter(s => !set.has(s.id))
})

/* Autocomplete add-one */
const autocompleteQuery = ref('')
const showAutocomplete = ref(false)
const filteredSuggestions = computed(() => {
  const q = autocompleteQuery.value.trim().toLowerCase()
  if (!q) return []
  return availableSantri.value
    .filter(s =>
      [s.santri, s.walisantri, s.kamar, s.gen].some(v => (v || '').toLowerCase().includes(q))
    )
    .slice(0, 12)
})
function resetAutocomplete() {
  autocompleteQuery.value = ''
  showAutocomplete.value = false
}
function handleAutocompleteEnter() {
  const first = filteredSuggestions.value[0]
  if (first) addMembers([first.id])
  resetAutocomplete()
}

/* Multi-select daftar available */
const santriFilter = ref('')
const memberFilter = ref('')

const visibleAvailableSantri = computed(() => {
  const q = santriFilter.value.trim().toLowerCase()
  const base = availableSantri.value
  if (!q) return base.slice(0, 300)
  return base.filter(s =>
    [s.santri, s.walisantri, s.kamar, s.gen].some(v => (v || '').toLowerCase().includes(q))
  ).slice(0, 300)
})
const visibleMembers = computed(() => {
  const q = memberFilter.value.trim().toLowerCase()
  const base = membersDetailed.value
  if (!q) return base
  return base.filter(s =>
    [s.santri, s.walisantri, s.kamar, s.gen].some(v => (v || '').toLowerCase().includes(q))
  )
})

const selectedAddIds = ref<Set<string>>(new Set())
const selectAllVisible = ref(false)
function toggleSelectAllVisible() {
  const next = new Set(selectedAddIds.value)
  if (selectAllVisible.value) {
    visibleAvailableSantri.value.forEach(s => next.add(s.id))
  } else {
    visibleAvailableSantri.value.forEach(s => next.delete(s.id))
  }
  selectedAddIds.value = next
}
function toggleSelectOne(id: string, ev: Event) {
  const checked = (ev.target as HTMLInputElement).checked
  const next = new Set(selectedAddIds.value)
  checked ? next.add(id) : next.delete(id)
  selectedAddIds.value = next
}

function toast(msg: string) {
  console.log(msg)
}

async function addMembers(ids: string[]) {
  const key = membershipKey.value
  if (!key || !ids?.length) return

  const existing = new Set(memberIds.value)
  const toAdd = ids.filter(id => !existing.has(id))
  if (!toAdd.length) return

  const payload: Record<string, any> = {}
  const now = Date.now()

  for (const sid of toAdd) {
    // tulis ke key aktif (id atau code)
    payload[`alberr/class_members/${key}/${sid}`] = { addedAt: now }
    // index balik selalu pakai id (stabil)
    if (currentId.value) payload[`alberr/santri_classes/${sid}/${currentId.value}`] = true
  }

  // OPTIONAL MIGRATION: kalau key=code dan id tersedia, mirror ke id juga
  if (key === currentCode.value && currentId.value) {
    for (const sid of toAdd) {
      payload[`alberr/class_members/${currentId.value}/${sid}`] = { addedAt: now }
    }
  }

  await update(dbRef($realtimeDb), payload)
}

async function removeMember(santriId: string) {
  const key = membershipKey.value
  if (!key) return

  const payload: Record<string, any> = {}
  payload[`alberr/class_members/${key}/${santriId}`] = null
  if (currentId.value) payload[`alberr/santri_classes/${santriId}/${currentId.value}`] = null

  // OPTIONAL MIGRATION: hapus mirror di id bila key=code
  if (key === currentCode.value && currentId.value) {
    payload[`alberr/class_members/${currentId.value}/${santriId}`] = null
  }

  await update(dbRef($realtimeDb), payload)
}

/** ===== Common actions ===== */
function goDetailByCode(code?: string) { if (!code) return; router.push({ path: '/app/class', query: { kode: code } }) }
function goBack(){ router.push({ path: '/app/class' }) }

/** ===== Lifecycle ===== */
onMounted(() => {
  // list kelas
  subscribeAll()
  // santri source untuk anggota
  subscribeSantri()
  // preline (opsional)
  // @ts-ignore
  window.HSStaticMethods?.autoInit?.()
})
onUnmounted(() => {
  unbindDetail()
  unbindMembers()
  unsubscribeSantri()
})
</script>

<style scoped>
.shadow-xs { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
</style>
