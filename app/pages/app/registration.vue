<!-- /pages/app/registration.vue -->
<template>
  <div class="relative">
    <!-- Background deco ringan -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-white dark:bg-neutral-950
                  [background-image:radial-gradient(theme(colors.slate.200)_1px,transparent_1px)]
                  [background-size:18px_18px] [background-position:0_0]
                  dark:[background-image:radial-gradient(theme(colors.zinc.800/.35)_1px,transparent_1px)]"></div>
      <div class="absolute -top-32 -left-40 h-[520px] w-[520px] rounded-full blur-3xl
                  bg-[radial-gradient(closest-side,theme(colors.emerald.300/.30),transparent)]"></div>
      <div class="absolute -bottom-24 -right-40 h-[520px] w-[520px] rounded-full blur-3xl
                  bg-[radial-gradient(closest-side,theme(colors.violet.300/.30),transparent)]"></div>
    </div>

    <div class="p-6 space-y-6">
      <!-- HEADER -->
      <div class="flex items-start flex-wrap justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-400">
            <Icon icon="ph:student" class="size-4" />
            PPDB • {{ selectedYear }}/{{ Number(selectedYear) + 1 }}
          </div>
          <h1 class="text-xl sm:text-2xl font-bold mt-1">Pendaftaran Santri — Admin</h1>
          <p class="text-sm text-slate-600 dark:text-neutral-300">Kelola calon/diterima & lihat dokumen pendaftar. Terbagi Putra & Putri.</p>
        </div>

        <div class="shrink-0 flex items-center gap-2">
          <NuxtLink
            to="/registrationPPDB"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700">
            <Icon icon="ph:link-simple" class="size-4" /> Buka Form
          </NuxtLink>
          <button @click="copy(formUrl)"
                  class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-neutral-700 bg-white text-xs font-medium hover:bg-slate-50 dark:bg-neutral-900 dark:hover:bg-neutral-800">
            <Icon icon="ph:copy" class="size-4" /> Salin Link
          </button>
        </div>
      </div>

      <!-- FILTER BAR -->
      <section class="rounded-2xl border border-slate-200/70 dark:border-neutral-800 bg-white/85 dark:bg-neutral-900/80 backdrop-blur">
        <div class="p-4 sm:p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="flex items-center gap-2">
            <label class="text-xs text-slate-500 dark:text-neutral-400">Tahun</label>
            <select v-model="selectedYear"
                    class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm">
              <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <label class="text-xs text-slate-500 dark:text-neutral-400">Jenjang</label>
            <select v-model="filters.jenjang"
                    class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm">
              <option value="semua">Semua</option>
              <option v-for="j in jenjangOptions" :key="j" :value="j">{{ j }}</option>
            </select>
          </div>
          <div class="sm:col-span-2">
            <input v-model="filters.q" placeholder="Cari nama / wali / alamat / kamar / no HP…"
                   class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm" />
          </div>
        </div>
      </section>

      <!-- GRID PUTRA / PUTRI -->
      <div class="grid lg:grid-cols-2 gap-6 items-start">
        <!-- PUTRA COLUMN -->
        <section class="space-y-4 overflow-x-auto w-full">
          <header class="flex items-center gap-2">
            <div class="size-8 grid place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300">♂</div>
            <h2 class="text-base sm:text-lg font-semibold">Putra ({{ selectedYear }})</h2>
          </header>

          <!-- Calon Putra -->
          <div class="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white/85 dark:bg-neutral-900/80 backdrop-blur">
            <div class="p-4 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-neutral-800">
              <h3 class="font-semibold text-sm sm:text-base">Calon Putra</h3>
              <div class="flex items-center gap-2">
                <button @click="approveBulk(calonPutraFiltered.map(r=>r.id))"
                        :disabled="!calonPutraFiltered.length || savingBulk"
                        class="text-xs px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60">
                  Terima Semua ({{ calonPutraFiltered.length }})
                </button>
                <button @click="exportCSV(calonPutraFiltered, `calon_putra_${selectedYear}.csv`)"
                        class="text-xs px-3 py-1.5 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">
                  Export CSV
                </button>
              </div>
            </div>
            <div class="p-3">
              <DataTable
                title="Calon Putra"
                :rows="calonPutraFiltered"
                :columns="columnsCalon"
                :show-actions="true"
                :rowKey="(r) => r.id"
              >
                <template #cell-nohp="{ row }">
                  <a v-if="row.nohp" :href="`tel:${row.nohp}`" class="underline decoration-dotted">{{ row.nohp }}</a>
                  <span v-else class="text-slate-400">-</span>
                </template>
                <template #cell-status="{ row }">
                  <span class="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    Calon
                  </span>
                </template>
                <template #cell-kamar="{ row }">
                  {{ row.kamar || '-' }} <span v-if="row.maskan">- {{ row.maskan }}</span>
                </template>
                <template #cell-action="{ row }">
                  <div class="flex items-center flex-wrap gap-2">
                    <button @click="approve(row.id)"
                            class="text-xs px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700">Terima</button>
                    <button @click="openDocs(row.id)"
                            class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Dokumen</button>
                    <button @click="openEdit(row)"
                            class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Edit</button>
                    <button @click="openConfirm(row)"
                            class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">Hapus</button>
                  </div>
                </template>
              </DataTable>
            </div>
          </div>

          <!-- Diterima Putra -->
          <div class="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white/85 dark:bg-neutral-900/80 backdrop-blur">
            <div class="p-4 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-neutral-800">
              <h3 class="font-semibold text-sm sm:text-base">Santri Baru Putra</h3>
              <div class="flex items-center gap-2">
                <button @click="revertBulk(baruPutraFiltered.map(r=>r.id))"
                        :disabled="!baruPutraFiltered.length || savingBulkRevert"
                        class="text-xs px-3 py-1.5 rounded bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-60">
                  Jadikan Calon Semua ({{ baruPutraFiltered.length }})
                </button>
                <button @click="exportCSV(baruPutraFiltered, `santri_putra_${selectedYear}.csv`)"
                        class="text-xs px-3 py-1.5 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Export CSV</button>
              </div>
            </div>
            <div class="p-3">
              <DataTable
                title="Santri Baru Putra"
                :rows="baruPutraFiltered"
                :columns="columnsBaru"
                :show-actions="true"
                :rowKey="(r) => r.id"
              >
                <template #cell-nohp="{ row }">
                  <a v-if="row.nohp" :href="`tel:${row.nohp}`" class="underline decoration-dotted">{{ row.nohp }}</a>
                  <span v-else class="text-slate-400">-</span>
                </template>
                <template #cell-status="{ row }">
                  <span class="text-xs px-2 py-0.5 rounded bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                    Diterima
                  </span>
                </template>
                <template #cell-kamar="{ row }">
                  {{ row.kamar || '-' }} <span v-if="row.maskan">- {{ row.maskan }}</span>
                </template>
                <template #cell-action="{ row }">
                  <div class="flex items-center flex-wrap gap-2">
                    <button @click="revertToCalon(row.id)"
                            class="text-xs px-2 py-1 rounded bg-amber-600 text-white hover:bg-amber-700">Jadikan Calon</button>
                    <button @click="openDocs(row.id)"
                            class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Dokumen</button>
                    <button @click="openEdit(row)"
                            class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Edit</button>
                    <button @click="openConfirm(row)"
                            class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">Hapus</button>
                  </div>
                </template>
              </DataTable>
            </div>
          </div>
        </section>

        <!-- PUTRI COLUMN -->
        <section class="space-y-4">
          <header class="flex items-center gap-2">
            <div class="size-8 grid place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300">♀</div>
            <h2 class="text-base sm:text-lg font-semibold">Putri ({{ selectedYear }})</h2>
          </header>

          <!-- Calon Putri -->
          <div class="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white/85 dark:bg-neutral-900/80 backdrop-blur">
            <div class="p-4 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-neutral-800">
              <h3 class="font-semibold text-sm sm:text-base">Calon Putri</h3>
              <div class="flex items-center gap-2">
                <button @click="approveBulk(calonPutriFiltered.map(r=>r.id))"
                        :disabled="!calonPutriFiltered.length || savingBulk"
                        class="text-xs px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60">
                  Terima Semua ({{ calonPutriFiltered.length }})
                </button>
                <button @click="exportCSV(calonPutriFiltered, `calon_putri_${selectedYear}.csv`)"
                        class="text-xs px-3 py-1.5 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">
                  Export CSV
                </button>
              </div>
            </div>
            <div class="p-3">
              <DataTable
                title="Calon Putri"
                :rows="calonPutriFiltered"
                :columns="columnsCalon"
                :show-actions="true"
                :rowKey="(r) => r.id"
              >
                <template #cell-nohp="{ row }">
                  <a v-if="row.nohp" :href="`tel:${row.nohp}`" class="underline decoration-dotted">{{ row.nohp }}</a>
                  <span v-else class="text-slate-400">-</span>
                </template>
                <template #cell-status="{ row }">
                  <span class="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    Calon
                  </span>
                </template>
                <template #cell-kamar="{ row }">
                  {{ row.kamar || '-' }} <span v-if="row.maskan">- {{ row.maskan }}</span>
                </template>
                <template #cell-action="{ row }">
                  <div class="flex items-center flex-wrap gap-2">
                    <button @click="approve(row.id)"
                            class="text-xs px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700">Terima</button>
                    <button @click="openDocs(row.id)"
                            class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Dokumen</button>
                    <button @click="openEdit(row)"
                            class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Edit</button>
                    <button @click="openConfirm(row)"
                            class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">Hapus</button>
                  </div>
                </template>
              </DataTable>
            </div>
          </div>

          <!-- Diterima Putri -->
          <div class="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white/85 dark:bg-neutral-900/80 backdrop-blur">
            <div class="p-4 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-neutral-800">
              <h3 class="font-semibold text-sm sm:text-base">Santri Baru Putri</h3>
              <div class="flex items-center gap-2">
                <button @click="revertBulk(baruPutriFiltered.map(r=>r.id))"
                        :disabled="!baruPutriFiltered.length || savingBulkRevert"
                        class="text-xs px-3 py-1.5 rounded bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-60">
                  Jadikan Calon Semua ({{ baruPutriFiltered.length }})
                </button>
                <button @click="exportCSV(baruPutriFiltered, `santri_putri_${selectedYear}.csv`)"
                        class="text-xs px-3 py-1.5 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Export CSV</button>
              </div>
            </div>
            <div class="p-3">
              <DataTable
                title="Santri Baru Putri"
                :rows="baruPutriFiltered"
                :columns="columnsBaru"
                :rowKey="(r) => r.id"
                :show-actions="true"
              >
                <template #cell-nohp="{ row }">
                  <a v-if="row.nohp" :href="`tel:${row.nohp}`" class="underline decoration-dotted">{{ row.nohp }}</a>
                  <span v-else class="text-slate-400">-</span>
                </template>
                <template #cell-status="{ row }">
                  <span class="text-xs px-2 py-0.5 rounded bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                    Diterima
                  </span>
                </template>
                <template #cell-kamar="{ row }">
                  {{ row.kamar || '-' }} <span v-if="row.maskan">- {{ row.maskan }}</span>
                </template>
                <template #cell-action="{ row }">
                  <div class="flex items-center flex-wrap gap-2">
                    <button @click="revertToCalon(row.id)"
                            class="text-xs px-2 py-1 rounded bg-amber-600 text-white hover:bg-amber-700">Jadikan Calon</button>
                    <button @click="openDocs(row.id)"
                            class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Dokumen</button>
                    <button @click="openEdit(row)"
                            class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Edit</button>
                    <button @click="openConfirm(row)"
                            class="text-xs px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">Hapus</button>
                  </div>
                </template>
              </DataTable>
            </div>
          </div>
        </section>
      </div>

      <!-- MODALS -->
      <ModalShell v-model="showForm" :title="formMode === 'edit' ? 'Ubah Data' : 'Tambah Pendaftar'">
        <form class="space-y-3 max-h-[60vh] overflow-y-auto scrollbar-none" @submit.prevent="saveRow">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-slate-600 dark:text-neutral-300">Gen</label>
              <input v-model.trim="form.gen" required class="w-full px-3 py-2 rounded border border-slate-200 dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
            <div>
              <label class="text-xs text-slate-600 dark:text-neutral-300">Nama Santri</label>
              <input v-model.trim="form.santri" required class="w-full px-3 py-2 rounded border border-slate-200 dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
            <div>
              <label class="text-xs text-slate-600 dark:text-neutral-300">Wali</label>
              <input v-model.trim="form.walisantri" class="w-full px-3 py-2 rounded border border-slate-200 dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
            <div>
              <label class="text-xs text-slate-600 dark:text-neutral-300">No. HP</label>
              <input v-model.trim="form.nohp" class="w-full px-3 py-2 rounded border border-slate-200 dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
            <div>
              <label class="text-xs text-slate-600 dark:text-neutral-300">Kamar</label>
              <input v-model.trim="form.kamar" class="w-full px-3 py-2 rounded border border-slate-200 dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
            <div>
              <label class="text-xs text-slate-600 dark:text-neutral-300">Jenjang</label>
              <input v-model.trim="form.jenjang" class="w-full px-3 py-2 rounded border border-slate-200 dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
            <div class="sm:col-span-2">
              <label class="text-xs text-slate-600 dark:text-neutral-300">Alamat</label>
              <textarea v-model.trim="form.alamat" rows="2"
                        class="w-full px-3 py-2 rounded border border-slate-200 dark:bg-neutral-900 dark:border-neutral-700"></textarea>
            </div>
            <div>
              <label class="text-xs text-slate-600 dark:text-neutral-300">Gender (L/P)</label>
              <input v-model.trim="form.gender" maxlength="1"
                     class="w-full px-3 py-2 rounded border border-slate-200 dark:bg-neutral-900 dark:border-neutral-700"
                     placeholder="L atau P" />
            </div>
            <div>
              <label class="text-xs text-slate-600 dark:text-neutral-300">Status</label>
              <select v-model="form.status"
                      class="w-full px-3 py-2 rounded border border-slate-200 dark:bg-neutral-900 dark:border-neutral-700">
                <option value="nonaktif">nonaktif (Calon)</option>
                <option value="">(Kosong) = Diterima</option>
              </select>
            </div>
          </div>
          <p v-if="formError" class="text-sm text-rose-600">{{ formError }}</p>
        </form>
        <template #footer>
          <button @click="showForm=false" class="px-3 py-1.5 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Batal</button>
          <button :disabled="saving" @click="saveRow" class="px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60">
            {{ saving ? 'Menyimpan…' : (formMode === 'edit' ? 'Update' : 'Simpan') }}
          </button>
        </template>
      </ModalShell>

      <ModalShell v-model="showDocs" title="Dokumen Pendaftar">
        <div class="space-y-3">
          <div v-if="docState.loading" class="text-sm text-slate-500">Memuat dokumen…</div>

          <div v-else-if="!docTabs.length" class="text-sm text-slate-500">
            Tidak ada dokumen.
          </div>

          <div v-else>
            <!-- Tabs -->
            <div class="overflow-x-auto">
              <nav class="flex items-center gap-1 border-b border-slate-200 dark:border-neutral-800">
                <button
                  v-for="(t, i) in docTabs"
                  :key="t.key"
                  @click="activeDocTab = i"
                  class="px-3 py-2 text-sm -mb-px rounded-t-lg"
                  :class="activeDocTab === i
                    ? 'border-b-2 border-slate-800 dark:border-neutral-200 text-slate-900 dark:text-neutral-100 font-medium'
                    : 'text-slate-500 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-neutral-200'"
                >
                  {{ t.label }}
                </button>
              </nav>
            </div>

            <!-- Viewer -->
            <div class="mt-3 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <div class="p-2">
                <div v-if="currentTab.isImage" class="w-full h-[60vh] grid place-items-center">
                  <img :src="currentTab.url" alt="" class="max-h-full max-w-full object-contain rounded-md" @error="() => {}" />
                </div>

                <div v-else-if="currentTab.isPdf" class="w-full h-[60vh]">
                  <iframe
                    :src="currentTab.viewerUrl"
                    class="w-full h-full rounded-md"
                    allowfullscreen
                    loading="lazy"
                  ></iframe>
                </div>

                <div v-else class="p-4 text-sm text-slate-600 dark:text-neutral-300">
                  File tidak dapat dipratinjau. 
                  <a :href="currentTab.url" target="_blank" class="underline decoration-dotted">Buka di tab baru</a>.
                </div>
              </div>

              <!-- Actions bawah viewer -->
              <div class="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 dark:border-neutral-800 px-3 py-2 text-xs">
                <div class="min-w-0 truncate text-slate-500 dark:text-neutral-400">
                  Sumber: 
                  <a :href="currentTab.url" target="_blank" class="underline decoration-dotted">{{ currentTab.url }}</a>
                </div>
                <div class="flex items-center gap-2">
                  <a :href="currentTab.url" target="_blank" class="px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">Buka</a>
                  <a :href="currentTab.url" download class="px-2 py-1 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">
                    Unduh
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <button @click="showDocs=false" class="px-3 py-1.5 rounded border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800">
            Tutup
          </button>
        </template>
      </ModalShell>

      <ModalShell v-model="showConfirm" title="Hapus Data">
        <p class="text-sm text-slate-700 dark:text-neutral-200">
          Hapus data <strong>{{ current?.santri }}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <template #footer>
          <button @click="showConfirm=false" class="px-3 py-1.5 rounded border border-slate-200 hover:bg-slate-50 dark:hover:bg-neutral-800">Batal</button>
          <button :disabled="deleting" @click="confirmDelete" class="px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60">
            {{ deleting ? 'Menghapus…' : 'Hapus' }}
          </button>
        </template>
      </ModalShell>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRuntimeConfig } from '#imports'
import { Icon } from '@iconify/vue'
import DataTable from '~/components/widget/DataTable.vue'
import ModalShell from '~/components/widget/ModalShell.vue'
import { useSantri, type SantriRow } from '~/composables/data/useSantri'

definePageMeta({ layout: 'app', layoutProps: { title: 'Pendaftaran' } })

/** ===== Composable ===== */
const { rows, fetchSantri, updateSantri, deleteSantri, getSantriById } = useSantri()

/** ===== Header helpers ===== */
const config = useRuntimeConfig()
const formUrl = computed(() =>
  new URL('/registrationPPDB', config.public.siteUrl || window?.location?.origin || '').toString()
)
async function copy(t: string){ try { await navigator.clipboard.writeText(t) } catch {} }

/** ===== Filters ===== */
const filters = reactive<{ q: string; jenjang: string }>({ q: '', jenjang: 'semua' })
const yearOptions = computed(() => {
  const ys = Array.from(new Set((rows.value || []).map(r => String(r.gen || '').trim()).filter(Boolean)))
  // urut desc
  return ys.sort((a,b) => Number(b) - Number(a))
})
const selectedYear = ref<string>('')
onMounted(async () => {
  await fetchSantri()
  selectedYear.value = yearOptions.value[0] || new Date().getFullYear().toString()
})

function matchSearch(r: SantriRow, q: string) {
  if (!q) return true
  const s = q.toLowerCase()
  const hay = [
    r.santri, r.walisantri, r.nohp, r.kamar, (r as any).maskan, r.alamat, r.jenjang, r.gen, r.status
  ].map(v => String(v || '').toLowerCase()).join(' | ')
  return hay.includes(s)
}
function matchJenjang(r: SantriRow, jj: string) {
  if (jj === 'semua') return true
  return String(r.jenjang || '').toLowerCase() === jj.toLowerCase()
}

/** ===== Gender & Status logic ===== */
/* Default: jika gender bukan 'P', dianggap PUTRA */
const isPutri = (r: SantriRow) => String((r as any).gender).toUpperCase() === 'P'
const isPutra = (r: SantriRow) => !isPutri(r)
/* Status: calon jika 'nonaktif'; diterima jika bukan 'nonaktif' (termasuk kosong) */
const isCalon = (r: SantriRow) => String(r.status).toLowerCase() === 'nonaktif'
const isBaru  = (r: SantriRow) => !isCalon(r)

/** ===== Base filtered by Year+Query+Jenjang ===== */
const baseFiltered = computed(() =>
  (rows.value || [])
    .filter(r => String(r.gen || '') === String(selectedYear.value || ''))
    .filter(r => matchSearch(r, filters.q))
    .filter(r => matchJenjang(r, filters.jenjang))
)

const jenjangOptions = computed(() => {
  const arr = (rows.value || [])
    .filter(r => String(r.gen || '') === String(selectedYear.value || ''))
    .map(r => String(r.jenjang || '').trim())
    .filter(Boolean)
  return Array.from(new Set(arr))
})

/** ===== Split: Putra/Putri → Calon/Baru ===== */
const putraFiltered = computed(() => baseFiltered.value.filter(isPutra))
const putriFiltered = computed(() => baseFiltered.value.filter(isPutri))

const calonPutraFiltered = computed(() => putraFiltered.value.filter(isCalon))
const baruPutraFiltered  = computed(() => putraFiltered.value.filter(isBaru))
const calonPutriFiltered = computed(() => putriFiltered.value.filter(isCalon))
const baruPutriFiltered  = computed(() => putriFiltered.value.filter(isBaru))

/** ===== Columns ===== */
const columnsCommon = [
  { key: 'gen', label: 'Gen', sortable: true },
  { key: 'santri', label: 'Santri', sortable: true },
  { key: 'walisantri', label: 'Wali', sortable: true },
  { key: 'nohp', label: 'No. HP', sortable: true },
  { key: 'kamar', label: 'Kamar', sortable: true },
  { key: 'alamat', label: 'Alamat', sortable: true },
  { key: 'jenjang', label: 'Jenjang', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
]
const columnsCalon = columnsCommon
const columnsBaru  = columnsCommon

/** ===== Bulk actions ===== */
const savingBulk = ref(false)
async function approveBulk(ids: string[]) {
  if (!ids.length) return
  savingBulk.value = true
  try {
    for (const id of ids) {
      // remove 'status' → diterima
      await updateSantri(id, { status: null as any }, { refresh: false })
    }
  } finally {
    savingBulk.value = false
    await fetchSantri()
  }
}

const savingBulkRevert = ref(false)
async function revertBulk(ids: string[]) {
  if (!ids.length) return
  savingBulkRevert.value = true
  try {
    for (const id of ids) {
      await updateSantri(id, { status: 'nonaktif', kamar: '-', maskan: '' }, { refresh: false })
    }
  } finally {
    savingBulkRevert.value = false
    await fetchSantri()
  }
}

/** ===== Row actions ===== */
async function approve(id: string) {
  await updateSantri(id, { status: null as any })
}
async function revertToCalon(id: string) {
  await updateSantri(id, { status: 'nonaktif', kamar: '-', maskan: '' })
}

/** ===== CRUD (Edit/Delete) ===== */
const showForm = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const formError = ref<string | null>(null)
const saving = ref(false)
const current = ref<SantriRow | null>(null)
const form = reactive<Omit<SantriRow, 'id'>>({
  gen: new Date().getFullYear().toString(), santri: '', walisantri: '', nohp: '',
  kamar: '', alamat: '', status: 'nonaktif', jenjang: '', maskan: '', gender: 'L'
})

function openEdit(r: SantriRow) {
  formMode.value = 'edit'; current.value = r
  form.gen = String(r.gen || '')
  form.santri = r.santri || ''
  form.walisantri = r.walisantri || ''
  form.nohp = r.nohp || ''
  form.kamar = r.kamar || ''
  form.alamat = r.alamat || ''
  form.status = String(r.status ?? '')
  form.jenjang = r.jenjang || ''
  form.maskan = r.maskan || ''
  form.gender = (r as any).gender || ''
  formError.value = null; showForm.value = true
}

async function saveRow(){
  if (!form.santri?.trim()) { formError.value = 'Nama santri wajib diisi.'; return }
  if (!form.gen?.trim())     { formError.value = 'Gen wajib diisi.'; return }
  saving.value = true
  try {
    if (formMode.value === 'edit' && current.value?.id) {
      await updateSantri(current.value.id, { ...form })
    } else {
      // gunakan createSantri jika butuh tambah data baru
      // (tidak diekspor dari useSantri di snippet ini; bisa ditambahkan jika perlu)
      formError.value = 'Mode tambah belum diaktifkan.'
    }
    showForm.value = false
  } catch (e:any) {
    formError.value = e?.message ?? 'Gagal menyimpan data'
  } finally {
    saving.value = false
  }
}

const showConfirm = ref(false)
const deleting = ref(false)
function openConfirm(r: SantriRow){ current.value = r; showConfirm.value = true }
async function confirmDelete(){
  if (!current.value?.id) return
  deleting.value = true
  try { await deleteSantri(current.value.id); showConfirm.value = false } finally { deleting.value = false }
}

/** ===== Dokumen Modal ===== */
const showDocs = ref(false)
const docState = reactive<{ loading: boolean; dok: any | null }>({ loading: false, dok: null })
const activeDocTab = ref(0)

function buildViewerUrl(url: string) {
  const s = String(url || '')
  if (!s) return ''
  if (s.includes('drive.google.com')) {
    const m = s.match(/\/file\/d\/([^/]+)\//)
    if (m?.[1]) return `https://drive.google.com/file/d/${m[1]}/preview`
    const id = s.match(/[?&]id=([^&]+)/)?.[1]
    if (id) return `https://drive.google.com/file/d/${id}/preview`
  }
  if (/\.pdf(\?|$)/i.test(s)) return s
  return s
}

const docTabs = computed(() => {
  const d = docState.dok || {}
  const raw = [
    { key: 'kkUrl',     label: 'Kartu Keluarga',  url: d.kkUrl || '' },
    { key: 'akteUrl',   label: 'Akte Kelahiran',  url: d.akteUrl || '' },
    { key: 'raportUrl', label: 'Raport Terakhir', url: d.raportUrl || '' },
    { key: 'fotoUrl',   label: 'Pas Foto 3x4',    url: d.fotoUrl || '' },
  ].filter(it => !!it.url)

  return raw.map(it => {
    const url = String(it.url)
    const isImage = /\.(png|jpe?g|webp|gif|bmp|svg)(\?|$)/i.test(url)
    const isPdf   = /\.pdf(\?|$)/i.test(url) || url.includes('drive.google.com')
    return {
      ...it,
      isImage,
      isPdf,
      viewerUrl: isImage ? url : buildViewerUrl(url)
    }
  })
})

const currentTab = computed(() => docTabs.value[activeDocTab.value] || { url:'', isImage:false, isPdf:false, viewerUrl:'', label:'-' })
const allDocEmpty = computed(() => !docTabs.value.length)

const docItems = computed(() => {
  const d = docState.dok || {}
  const items = [
    { key:'kkUrl',    label:'Kartu Keluarga', url: d.kkUrl || '' },
    { key:'akteUrl',  label:'Akte Kelahiran', url: d.akteUrl || '' },
    { key:'raportUrl',label:'Raport Terakhir', url: d.raportUrl || '' },
    { key:'fotoUrl',  label:'Pas Foto 3x4', url: d.fotoUrl || '' },
  ]
  return items.map(it => ({
    ...it,
    isImage: /\.(jpg|jpeg|png|webp|gif)$/i.test(String(it.url || ''))
  }))
})

async function openDocs(id: string){
  showDocs.value = true
  activeDocTab.value = 0
  docState.loading = true
  docState.dok = null
  try {
    const full = await getSantriById(id)
    docState.dok = full?.dokumen || null
    if (activeDocTab.value >= docTabs.value.length) activeDocTab.value = 0
  } finally {
    docState.loading = false
  }
}

/** ===== CSV Export (ringkas) ===== */
const csvHeaders = ['gen','santri','walisantri','nohp','kamar','alamat','status','jenjang'] as const
function mapRowToCsv(r: SantriRow){
  return {
    gen: r.gen ?? '', santri: r.santri ?? '', walisantri: r.walisantri ?? '', nohp: r.nohp ?? '',
    kamar: r.kamar ?? '', alamat: r.alamat ?? '', status: r.status ?? '', jenjang: r.jenjang ?? ''
  } as Record<(typeof csvHeaders)[number], any>
}
function toCSV(source: SantriRow[]){
  const esc = (v:any) => { const s=String(v??''); const needs=/[",\n]/.test(s); const x=s.replace(/"/g,'""'); return needs?`"${x}"`:x }
  const head = csvHeaders.join(',')
  const body = source.map(r => csvHeaders.map(h => esc(mapRowToCsv(r)[h])).join(',')).join('\n')
  return head + '\n' + body
}
function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
}
function exportCSV(source: SantriRow[], filename: string) {
  const csv = toCSV(source); const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }); downloadBlob(filename, blob)
}
</script>
