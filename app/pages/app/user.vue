<template>
  <div class="min-h-full bg-transparent text-gray-800 dark:text-neutral-200">
    <div class="mx-auto max-w-[1720px] space-y-6 p-5 md:p-8 xl:p-10">
      <section class="relative overflow-hidden rounded-[32px] border border-green-100 bg-gradient-to-br from-green-600 via-emerald-600 to-lime-500 p-5 text-white shadow-[0_24px_60px_-18px_rgba(22,163,74,0.35)] md:p-8">
        <div class="absolute inset-0 opacity-20">
          <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white blur-3xl"></div>
          <div class="absolute bottom-0 left-8 h-32 w-32 rounded-full bg-lime-100 blur-3xl"></div>
        </div>

        <div class="relative z-10 grid gap-5 xl:grid-cols-[1.2fr,0.8fr] xl:items-end">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
              <span class="inline-block h-2 w-2 rounded-full bg-lime-300"></span>
              Access Control Workspace
            </div>
            <h1 class="mt-4 text-2xl font-black tracking-tight md:text-4xl">Manajemen User</h1>
            <p class="mt-3 max-w-2xl text-sm leading-6 text-green-50/95 md:text-base">
              Kelola akun, role, status aktif, hak akses sidebar, dan tindakan keamanan dalam satu workspace yang lebih cepat, rapi, dan nyaman dipakai.
            </p>

            <div class="mt-5 flex flex-wrap gap-2">
              <span class="rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-semibold ring-1 ring-white/15">Sticky workspace bar</span>
              <span class="rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-semibold ring-1 ring-white/15">Responsive admin panel</span>
              <span class="rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-semibold ring-1 ring-white/15">Scoped access modal</span>
              <span class="rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-semibold ring-1 ring-white/15">Cleaner CRUD flow</span>
            </div>
          </div>

          <div class="grid gap-3 lg:grid-cols-3 grid-cols-1">
            <div class="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
              <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-green-100">Total User</div>
              <div class="mt-2 text-2xl font-black">{{ visibleRows.length }}</div>
              <div class="mt-1 text-xs text-green-50/90">akun terdaftar di sistem</div>
            </div>
            <div class="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
              <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-green-100">User Aktif</div>
              <div class="mt-2 text-2xl font-black">{{ activeUsers }}</div>
              <div class="mt-1 text-xs text-green-50/90">akun yang masih dapat mengakses</div>
            </div>
            <div class="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
              <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-green-100">Hasil Filter</div>
              <div class="mt-2 text-2xl font-black">{{ filteredRows.length }}</div>
              <div class="mt-1 text-xs text-green-50/90">data sesuai pencarian</div>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <article class="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Admin</p>
              <p class="mt-2 text-3xl font-black tracking-tight text-gray-900 dark:text-white">{{ roleCounts.admin }}</p>
            </div>
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300">
              <ClientOnly><Icon icon="lucide:shield-check" class="h-5 w-5" /></ClientOnly>
            </div>
          </div>
          <p class="mt-4 text-sm text-gray-500 dark:text-neutral-400">Akun dengan kontrol penuh dan akses konfigurasi utama.</p>
        </article>

        <article class="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Pengurus</p>
              <p class="mt-2 text-3xl font-black tracking-tight text-gray-900 dark:text-white">{{ roleCounts.pengurus }}</p>
            </div>
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-emerald-600 text-white dark:bg-emerald-900/20 dark:text-white">
              <ClientOnly><Icon icon="lucide:users" class="h-5 w-5" /></ClientOnly>
            </div>
          </div>
          <p class="mt-4 text-sm text-gray-500 dark:text-neutral-400">Akun operasional harian yang mengelola proses dan monitoring.</p>
        </article>

        <article class="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Wali</p>
              <p class="mt-2 text-3xl font-black tracking-tight text-gray-900 dark:text-white">{{ roleCounts.wali }}</p>
            </div>
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
              <ClientOnly><Icon icon="lucide:user-round" class="h-5 w-5" /></ClientOnly>
            </div>
          </div>
          <p class="mt-4 text-sm text-gray-500 dark:text-neutral-400">Akun wali santri dengan akses terbatas dan lebih terarah.</p>
        </article>

        <article class="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Non-aktif</p>
              <p class="mt-2 text-3xl font-black tracking-tight text-gray-900 dark:text-white">{{ inactiveUsers }}</p>
            </div>
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">
              <ClientOnly><Icon icon="lucide:user-x" class="h-5 w-5" /></ClientOnly>
            </div>
          </div>
          <p class="mt-4 text-sm text-gray-500 dark:text-neutral-400">Akun yang disuspend atau belum diaktifkan kembali.</p>
        </article>
      </section>

      <section class="grid min-w-0 max-w-full gap-6 xl:grid-cols-1">
        <div class="space-y-6">
          <div class="sticky top-4 z-20 rounded-[28px] border border-gray-200/80 bg-white/92 p-4 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/92">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 class="text-base font-bold text-gray-900 dark:text-white">Workspace Aksi</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Kontrol utama untuk pencarian, filter, refresh, dan pembuatan akun.</p>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <button
                  @click="fetchUsers"
                  class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  :disabled="loading"
                >
                  <ClientOnly><Icon icon="lucide:refresh-cw" class="mr-2 h-4 w-4" /></ClientOnly>
                  Muat Ulang
                </button>
                <button
                  @click="openCreate"
                  class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                >
                  <ClientOnly><Icon icon="lucide:user-plus" class="mr-2 h-4 w-4" /></ClientOnly>
                  Tambah User
                </button>
              </div>
            </div>

            <div class="mt-4 grid gap-3 md:grid-cols-[1.15fr,0.85fr] xl:grid-cols-[1.2fr,0.8fr]">
              <div class="relative">
                <ClientOnly><Icon icon="lucide:search" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /></ClientOnly>
                <input
                  v-model.trim="search"
                  type="text"
                  placeholder="Cari nama, email, no HP, atau role..."
                  class="block w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div class="grid gap-3 sm:grid-cols-2">
                <select
                  v-model="roleFilter"
                  class="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                >
                  <option value="all">Semua Role</option>
                  <option value="admin">Admin</option>
                  <option value="pengurus">Pengurus</option>
                  <option value="wali">Wali</option>
                </select>
                <select
                  v-model="statusFilter"
                  class="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                >
                  <option value="all">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Non-aktif</option>
                </select>
              </div>
            </div>

            <div class="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span class="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <ClientOnly><Icon icon="lucide:filter" class="h-3.5 w-3.5" /></ClientOnly>
                {{ filteredRows.length }} user tampil
              </span>
              <span v-if="error" class="font-medium text-rose-600 dark:text-rose-300">{{ error }}</span>
              <span v-if="loading" class="font-medium text-gray-500 dark:text-neutral-400">Memuat data...</span>
            </div>
          </div>

          <section class="rounded-[30px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Direktori User</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Lihat, ubah, dan tindak lanjuti akun berdasarkan kebutuhan operasional.</p>
              </div>
              <div class="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-neutral-400">
                <span class="rounded-full bg-gray-100 px-2.5 py-1 dark:bg-neutral-800">Sortable</span>
                <span class="rounded-full bg-gray-100 px-2.5 py-1 dark:bg-neutral-800">Role switch</span>
                <span class="rounded-full bg-gray-100 px-2.5 py-1 dark:bg-neutral-800">Access control</span>
              </div>
            </div>

            <div class="mt-5 overflow-x-auto max-w-full rounded-[26px] border border-gray-200 dark:border-neutral-800">
              <DataTable
                title="Semua User"
                :rows="filteredRows"
                :columns="columns"
                :rowKey="(r) => r.uid"
                :show-actions="true"
                :selectable="false"
                export-filename="data-user"
              >
                <template #cell-role="{ row }">
                  <div class="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                    <select
                      class="rounded-2xl bg-transparent px-3 py-1.5 text-sm font-medium outline-none"
                      :value="row.role"
                      @change="onChangeRole(row, ($event.target as HTMLSelectElement).value as any)"
                    >
                      <option value="admin">Admin</option>
                      <option value="pengurus">Pengurus</option>
                      <option value="wali">Wali</option>
                    </select>
                  </div>
                </template>

                <template #cell-isActive="{ row }">
                  <button
                    @click="toggleActive(row)"
                    class="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold transition"
                    :class="row.isActive ? 'bg-emerald-500 text-white dark:bg-emerald-900/20' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'"
                  >
                    <span class="mr-1.5 inline-block h-2 w-2 rounded-full" :class="row.isActive ? 'bg-white' : 'bg-amber-500'"></span>
                    {{ row.isActive ? 'Aktif' : 'Non-aktif' }}
                  </button>
                </template>

                <template #cell-allowedRoutes="{ row }">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-700 dark:bg-neutral-800 dark:text-neutral-200">
                      {{ row.allowedRoutes?.length ?? defaultRoleCount(row.role) }} Akses
                    </span>
                    <button
                      @click="openAccess(row)"
                      class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      Kelola
                    </button>
                  </div>
                </template>

                <template #cell-action="{ row }">
                  <div class="relative flex justify-end">
                    <button
                      type="button"
                      @click.stop="toggleActionMenu(row, $event)"
                      class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                      aria-label="Aksi user"
                    >
                      <ClientOnly>
                        <Icon icon="lucide:ellipsis-vertical" class="h-4 w-4" />
                      </ClientOnly>
                    </button>

                    <Teleport to="body">
                      <div
                        v-if="activeActionId === row.uid"
                        :style="actionMenuStyle"
                        class="fixed z-[9999] w-52 overflow-hidden rounded-2xl border border-gray-200 bg-white p-1 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900"
                        @click.stop
                      >
                        <button
                          type="button"
                          @click="handleAction(() => openEdit(row))"
                          class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        >
                          <ClientOnly><Icon icon="lucide:pencil" class="h-4 w-4" /></ClientOnly>
                          Edit
                        </button>

                        <button
                          type="button"
                          @click="handleAction(() => openReset(row))"
                          class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-amber-700 transition hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-900/10"
                        >
                          <ClientOnly><Icon icon="lucide:key-round" class="h-4 w-4" /></ClientOnly>
                          Reset Password
                        </button>

                        <button
                          type="button"
                          @click="handleAction(() => openDelete(row))"
                          class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-700 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-900/10"
                        >
                          <ClientOnly><Icon icon="lucide:user-x" class="h-4 w-4" /></ClientOnly>
                          Non-aktifkan
                        </button>

                        <div class="my-1 border-t border-gray-100 dark:border-neutral-800"></div>

                        <button
                          type="button"
                          @click="handleAction(() => openDeletePermanent(row))"
                          class="flex w-full items-center gap-2 rounded-xl bg-rose-600 px-3 py-2 text-left text-sm font-semibold text-white transition hover:bg-rose-700"
                        >
                          <ClientOnly><Icon icon="lucide:trash-2" class="h-4 w-4" /></ClientOnly>
                          Hapus Permanen
                        </button>
                      </div>
                    </Teleport>
                  </div>
                </template>
              </DataTable>
            </div>
          </section>
        </div>

        <aside class="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <section class="rounded-[30px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Ringkasan Operasional</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Sorotan cepat agar tim tahu apa yang perlu ditindaklanjuti.</p>
              </div>
              <div class="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <ClientOnly><Icon icon="lucide:activity" class="h-3.5 w-3.5" /></ClientOnly>
                Insight
              </div>
            </div>

            <div class="mt-5 space-y-3">
              <article class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="flex items-start gap-3">
                  <div class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300">
                    <ClientOnly><Icon icon="lucide:key-round" class="h-5 w-5" /></ClientOnly>
                  </div>
                  <div>
                    <div class="text-sm font-bold text-gray-900 dark:text-white">Hak akses perlu dijaga ketat</div>
                    <div class="mt-1 text-sm text-gray-600 dark:text-neutral-300">Gunakan default role saat perlu cepat, lalu sesuaikan access hanya untuk modul yang benar-benar dibutuhkan.</div>
                  </div>
                </div>
              </article>

              <article class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="flex items-start gap-3">
                  <div class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                    <ClientOnly><Icon icon="lucide:mail-warning" class="h-5 w-5" /></ClientOnly>
                  </div>
                  <div>
                    <div class="text-sm font-bold text-gray-900 dark:text-white">Reset password secukupnya</div>
                    <div class="mt-1 text-sm text-gray-600 dark:text-neutral-300">Gunakan reset email untuk akun login aktif agar lebih aman dibanding membagikan password manual berulang kali.</div>
                  </div>
                </div>
              </article>

              <article class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="flex items-start gap-3">
                  <div class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">
                    <ClientOnly><Icon icon="lucide:shield-alert" class="h-5 w-5" /></ClientOnly>
                  </div>
                  <div>
                    <div class="text-sm font-bold text-gray-900 dark:text-white">Hapus permanen dengan hati-hati</div>
                    <div class="mt-1 text-sm text-gray-600 dark:text-neutral-300">Gunakan soft delete untuk operasional normal. Hard delete sebaiknya hanya untuk data yang memang harus dihapus total.</div>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section class="rounded-[30px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Distribusi Role</h3>
            <div class="mt-5 space-y-4">
              <div v-for="item in roleSummary" :key="item.key" class="space-y-2">
                <div class="flex items-center justify-between gap-3">
                  <span class="text-sm font-semibold text-gray-700 dark:text-neutral-200">{{ item.label }}</span>
                  <span class="text-sm font-black text-gray-900 dark:text-white">{{ item.count }}</span>
                </div>
                <div class="h-2 rounded-full bg-gray-200 dark:bg-neutral-800">
                  <div class="h-2 rounded-full" :class="item.barClass" :style="{ width: item.width }"></div>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </div>

    <ModalShell v-model="showForm" :title="formMode === 'create' ? 'Tambah User' : 'Ubah User'">
      <div class="space-y-5">
        <div class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
          <div class="flex items-start gap-3">
            <div class="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
              <ClientOnly><Icon :icon="formMode === 'create' ? 'lucide:user-plus' : 'lucide:user-cog'" class="h-5 w-5" /></ClientOnly>
            </div>
            <div>
              <div class="text-sm font-bold text-gray-900 dark:text-white">{{ formMode === 'create' ? 'Buat akun baru' : 'Perbarui akun' }}</div>
              <div class="mt-1 text-sm text-gray-600 dark:text-neutral-300">Isi informasi dasar lalu tentukan role akun sesuai kebutuhan.</div>
            </div>
          </div>
        </div>

        <form class="space-y-4" @submit.prevent="submitForm">
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Nama</label>
              <input v-model.trim="form.displayName" required class="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Email (login)</label>
              <input v-model.trim="form.email" type="email" class="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">No HP</label>
              <input v-model.trim="form.phone" class="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Role</label>
              <select v-model="form.role" class="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-white">
                <option value="admin">Admin</option>
                <option value="pengurus">Pengurus</option>
                <option value="wali">Wali</option>
              </select>
            </div>
          </div>

          <div v-if="formMode === 'create'" class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
            <label class="flex items-start gap-3">
              <input id="create-auth" type="checkbox" v-model="form.createAuth" class="mt-0.5 rounded border-gray-300" />
              <span>
                <span class="block text-sm font-semibold text-gray-900 dark:text-white">Buat akun Auth sekarang</span>
                <span class="mt-1 block text-xs text-gray-500 dark:text-neutral-400">Disarankan untuk akun yang akan langsung dipakai login.</span>
              </span>
            </label>
          </div>

          <div v-if="formMode === 'create' && form.createAuth" class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">Password (opsional)</label>
            <div class="relative">
              <input
                v-model.trim="form.password"
                :type="showPass ? 'text' : 'password'"
                placeholder="Kosongkan untuk auto-generate (12 karakter)"
                class="block w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
              <button type="button" @click="showPass = !showPass" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200">
                <ClientOnly><Icon :icon="showPass ? 'ph:eye-slash' : 'ph:eye'" class="h-5 w-5" /></ClientOnly>
              </button>
            </div>
            <p class="mt-2 text-[11px] text-gray-500 dark:text-neutral-400">Jika dikosongkan, sistem akan membuat password acak 12 karakter.</p>
          </div>

          <p v-if="formError" class="text-sm text-rose-600 dark:text-rose-300">{{ formError }}</p>

          <div v-if="createdTempPassword" class="rounded-[22px] border border-emerald-200 bg-emerald-50 p-4 text-sm dark:border-emerald-900/40 dark:bg-emerald-900/10">
            <div><strong>Password sementara:</strong> <code>{{ createdTempPassword }}</code></div>
            <div class="mt-3">
              <button type="button" @click="downloadCred" class="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700">Download credential</button>
            </div>
          </div>
        </form>
      </div>

      <template #footer>
        <button @click="showForm = false" class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="saving" @click="submitForm" class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60">
          {{ saving ? 'Menyimpan…' : formMode === 'create' ? 'Simpan' : 'Update' }}
        </button>
      </template>
    </ModalShell>

    <ModalShell v-model="showAccess" title="Kelola Hak Akses">
      <div class="space-y-5 overflow-y-auto max-h-[70vh]">
        <div class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div class="text-sm font-bold text-gray-900 dark:text-white">{{ current?.displayName || 'User' }}</div>
              <div class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Atur modul yang boleh diakses user ini.</div>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <button @click="applyRoleDefault" class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800">Default Role</button>
              <button @click="selectAll" class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800">Pilih Semua</button>
              <button @click="clearAll" class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800">Kosongkan</button>
            </div>
          </div>
        </div>

        <div class="grid gap-4 xl:grid-cols-[1fr,0.8fr]">
          <div class="max-h-[52vh] overflow-auto rounded-[24px] border border-gray-200 dark:border-neutral-800">
            <div v-for="group in groups" :key="group.title" class="border-b border-gray-200 last:border-b-0 dark:border-neutral-800">
              <div class="sticky top-0 z-10 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-900 dark:bg-neutral-900 dark:text-white">{{ group.title }}</div>
              <div class="grid gap-2 p-4 sm:grid-cols-2">
                <label v-for="item in group.items" :key="item.href" class="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-3 text-sm transition hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                  <input type="checkbox" class="mt-0.5 rounded border-gray-300" :value="item.href" v-model="accessBuffer" />
                  <span>
                    <span class="block font-semibold text-gray-900 dark:text-white">{{ item.label }}</span>
                    <span class="mt-1 block text-xs text-gray-500 dark:text-neutral-400">{{ item.href }}</span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="rounded-[22px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
              <div class="text-sm font-bold text-gray-900 dark:text-white">Ringkasan Akses</div>
              <div class="mt-1 text-sm text-gray-500 dark:text-neutral-400">{{ accessBuffer.length }} route dipilih untuk user ini.</div>
              <div class="mt-4 flex max-h-[36vh] flex-wrap gap-2 overflow-auto">
                <span v-for="path in accessBuffer" :key="path" class="rounded-full bg-green-50 px-3 py-1.5 text-[11px] font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-300">{{ path }}</span>
                <span v-if="!accessBuffer.length" class="text-sm text-gray-500 dark:text-neutral-400">Belum ada akses dipilih.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <button @click="showAccess = false" class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="savingAccess" @click="saveAccess" class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60">
          {{ savingAccess ? 'Menyimpan…' : 'Simpan Akses' }}
        </button>
      </template>
    </ModalShell>

    <ModalShell v-model="showReset" title="Reset Password">
      <div class="space-y-4">
        <div class="rounded-[22px] border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900/40 dark:bg-amber-900/10">
          <div class="font-semibold text-amber-800 dark:text-amber-200">Konfirmasi reset password</div>
          <div class="mt-1 text-amber-700 dark:text-amber-300">Tautan reset password akan dikirim ke email login user.</div>
        </div>
        <div class="space-y-2 text-sm">
          <p>Email tujuan:</p>
          <p class="font-semibold">{{ current?.email || '—' }}</p>
          <p v-if="!current?.email" class="text-amber-600 dark:text-amber-300">User ini tidak punya email login.</p>
        </div>
      </div>
      <template #footer>
        <button @click="showReset = false" class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="resetting || !current?.email" @click="doReset" class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60">
          {{ resetting ? 'Mengirim…' : 'Kirim Email Reset' }}
        </button>
      </template>
    </ModalShell>

    <ModalShell v-model="showDelete" title="Non-aktifkan User">
      <div class="space-y-4 text-sm">
        <div class="rounded-[22px] border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-900/10">
          <div class="font-semibold text-amber-800 dark:text-amber-200">Soft delete</div>
          <div class="mt-1 text-amber-700 dark:text-amber-300">User akan dinonaktifkan tetapi data tetap tersimpan di database.</div>
        </div>
        <p>Non-aktifkan akses untuk <strong>{{ current?.displayName }}</strong>?</p>
      </div>
      <template #footer>
        <button @click="showDelete = false" class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="deleting" @click="confirmDeleteSoft" class="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60">
          {{ deleting ? 'Memproses…' : 'Non-aktifkan' }}
        </button>
      </template>
    </ModalShell>

    <ModalShell v-model="showDeletePermanent" title="Hapus Permanen User">
      <div class="space-y-4 text-sm">
        <div class="rounded-[22px] border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/40 dark:bg-rose-900/10">
          <div class="font-semibold text-rose-800 dark:text-rose-200">Peringatan permanen</div>
          <div class="mt-1 text-rose-700 dark:text-rose-300">Tindakan ini menghapus data user dari database secara permanen dan tidak bisa dibatalkan.</div>
        </div>
        <p>Nama: <strong>{{ current?.displayName }}</strong></p>
        <label class="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/60">
          <input type="checkbox" v-model="confirmPermanent" class="mt-0.5 rounded border-gray-300" />
          <span>Saya paham dan setuju menghapus permanen user ini.</span>
        </label>
      </div>
      <template #footer>
        <button @click="showDeletePermanent = false" class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800">Batal</button>
        <button :disabled="deleting || !confirmPermanent" @click="confirmDeleteHard" class="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60">
          {{ deleting ? 'Menghapus…' : 'Hapus Permanen' }}
        </button>
      </template>
    </ModalShell>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, reactive, ref } from 'vue'
import { Icon } from '@iconify/vue'
import DataTable from '~/components/widget/DataTable.vue'
import ModalShell from '~/components/widget/ModalShell.vue'
import { useUser, type UserRow, ROLE_DEFAULT_ROUTES, ALL_SIDEBAR_GROUPS } from '~/composables/data/useUser'

definePageMeta({ layout: 'app', layoutProps: { title: 'Hak Akses' } })

const {
  rows, loading, error, fetchUsers,
  createUserProfile, updateUser, deleteUserSoft, deleteUserPermanent,
  setRole, setAllowedRoutes, setActive,
  sendReset, downloadPasswordFile, createdTempPassword
} = useUser()

function onActionOutsideClick() {
  closeActionMenu()
}

onMounted(() => {
  fetchUsers()
  window.addEventListener('click', onActionOutsideClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', onActionOutsideClick)
})

const search = ref('')
const roleFilter = ref<'all' | 'admin' | 'pengurus' | 'wali'>('all')
const statusFilter = ref<'all' | 'active' | 'inactive'>('all')

const activeActionId = ref<string | null>(null)
const actionMenuTop = ref(0)
const actionMenuLeft = ref(0)

const actionMenuStyle = computed(() => ({
  top: `${actionMenuTop.value}px`,
  left: `${actionMenuLeft.value}px`
}))

function toggleActionMenu(row: UserRow, event: MouseEvent) {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()

  const menuWidth = 208
  const gap = 8

  activeActionId.value = activeActionId.value === row.uid ? null : row.uid

  actionMenuTop.value = rect.bottom + gap
  actionMenuLeft.value = Math.max(12, rect.right - menuWidth)
}

function closeActionMenu() {
  activeActionId.value = null
}

function handleAction(callback: () => void) {
  closeActionMenu()
  callback()
}

const PROTECTED_EMAILS = new Set([
  'team.sencra@gmail.com'
])

function normalizeEmail(value?: string | null) {
  return String(value || '').trim().toLowerCase()
}

function isProtectedUser(row?: UserRow | null) {
  if (!row) return false

  const role = String((row as any)?.role || '').trim().toLowerCase()
  const email = normalizeEmail(row.email)

  return role === 'superadmin' || PROTECTED_EMAILS.has(email)
}

const visibleRows = computed(() => {
  return rows.value.filter((row) => !isProtectedUser(row))
})

const activeUsers = computed(() => visibleRows.value.filter((row) => row.isActive).length)
const inactiveUsers = computed(() => visibleRows.value.filter((row) => !row.isActive).length)
const roleCounts = computed(() => ({
  admin: visibleRows.value.filter((row) => row.role === 'admin').length,
  pengurus: visibleRows.value.filter((row) => row.role === 'pengurus').length,
  wali: visibleRows.value.filter((row) => row.role === 'wali').length,
}))

const roleSummary = computed(() => {
  const total = Math.max(visibleRows.value.length, 1)
  return [
    { key: 'admin', label: 'Admin', count: roleCounts.value.admin, width: `${(roleCounts.value.admin / total) * 100}%`, barClass: 'bg-sky-500' },
    { key: 'pengurus', label: 'Pengurus', count: roleCounts.value.pengurus, width: `${(roleCounts.value.pengurus / total) * 100}%`, barClass: 'bg-emerald-500' },
    { key: 'wali', label: 'Wali', count: roleCounts.value.wali, width: `${(roleCounts.value.wali / total) * 100}%`, barClass: 'bg-amber-500' },
  ]
})

const filteredRows = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return visibleRows.value.filter((row) => {
    const matchKeyword =
      !keyword ||
      [row.displayName, row.email, row.phone, row.role].some((value) =>
        String(value || '').toLowerCase().includes(keyword)
      )

    const matchRole = roleFilter.value === 'all' || row.role === roleFilter.value

    const matchStatus =
      statusFilter.value === 'all' ||
      (statusFilter.value === 'active' ? row.isActive : !row.isActive)

    return matchKeyword && matchRole && matchStatus
  })
})

const columns = [
  { key: 'displayName', label: 'Nama', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'phone', label: 'No HP', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'isActive', label: 'Status', sortable: true },
  { key: 'allowedRoutes', label: 'Akses Sidebar' },
]

const showForm = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const saving = ref(false)
const formError = ref<string | null>(null)
const current = ref<UserRow | null>(null)
const showPass = ref(false)

const form = reactive<{
  displayName: string
  email?: string
  phone?: string
  role: 'admin' | 'pengurus' | 'wali'
  createAuth: boolean
  password?: string
}>({
  displayName: '',
  email: '',
  phone: '',
  role: 'wali',
  createAuth: true,
  password: '',
})

function defaultRoleCount(role: 'admin' | 'pengurus' | 'wali') {
  return ROLE_DEFAULT_ROUTES[role].length
}

function resetForm() {
  form.displayName = ''
  form.email = ''
  form.phone = ''
  form.role = 'wali'
  form.createAuth = true
  form.password = ''
  formError.value = null
}

function openCreate() {
  formMode.value = 'create'
  current.value = null
  createdTempPassword.value = ''
  resetForm()
  showForm.value = true
}

function openEdit(row: UserRow) {
  if (isProtectedUser(row)) return

  formMode.value = 'edit'
  current.value = row
  createdTempPassword.value = ''
  form.displayName = row.displayName
  form.email = row.email
  form.phone = row.phone
  form.role = row.role
  form.createAuth = false
  form.password = ''
  formError.value = null
  showForm.value = true
}

async function submitForm() {
  if (!form.displayName?.trim()) {
    formError.value = 'Nama wajib diisi.'
    return
  }

  saving.value = true
  try {
    if (formMode.value === 'create') {
      await createUserProfile({
        displayName: form.displayName.trim(),
        email: form.email?.trim() || undefined,
        phone: form.phone?.trim() || undefined,
        role: form.role,
        createAuth: !!form.createAuth,
        password: form.password?.trim() || undefined,
      })
      await fetchUsers()
    } else if (current.value?.uid) {
      if (isProtectedUser(current.value)) {
        formError.value = 'Akun sistem tidak dapat diubah.'
        return
      }
      await updateUser(current.value.uid, {
        displayName: form.displayName.trim(),
        email: form.email?.trim(),
        phone: form.phone?.trim(),
        role: form.role,
      })
      await fetchUsers()
    }
    showForm.value = false
  } catch (error: any) {
    formError.value = error?.message ?? 'Gagal menyimpan.'
  } finally {
    saving.value = false
  }
}

function downloadCred() {
  const username = form.email?.trim() || form.phone?.trim() || '(username)'
  if (!username || !createdTempPassword.value) return
  downloadPasswordFile(username, createdTempPassword.value)
}

async function onChangeRole(row: UserRow, role: 'admin' | 'pengurus' | 'wali') {
  if (isProtectedUser(row)) return

  await setRole(row.uid, role, true)
  await fetchUsers()
}

async function toggleActive(row: UserRow) {
  if (isProtectedUser(row)) return

  await setActive(row.uid, !row.isActive)
  await fetchUsers()
}

const showAccess = ref(false)
const savingAccess = ref(false)
const groups = ALL_SIDEBAR_GROUPS
const accessBuffer = ref<string[]>([])

function openAccess(row: UserRow) {
  if (isProtectedUser(row)) return

  current.value = row
  const routes = row.allowedRoutes?.length ? row.allowedRoutes : ROLE_DEFAULT_ROUTES[row.role]
  accessBuffer.value = [...routes]
  showAccess.value = true
}

function selectAll() {
  accessBuffer.value = groups.flatMap((group) => group.items.map((item) => item.href))
}
function clearAll() {
  accessBuffer.value = []
}
function applyRoleDefault() {
  if (!current.value) return
  accessBuffer.value = [...ROLE_DEFAULT_ROUTES[current.value.role]]
}

async function saveAccess() {
  if (!current.value) return
  if (isProtectedUser(current.value)) return

  savingAccess.value = true
  try {
    await setAllowedRoutes(current.value.uid, [...new Set(accessBuffer.value)])
    await fetchUsers()
    showAccess.value = false
  } finally {
    savingAccess.value = false
  }
}

const showReset = ref(false)
const resetting = ref(false)
function openReset(row: UserRow) {
  if (isProtectedUser(row)) return

  current.value = row
  showReset.value = true
}
async function doReset() {
  if (!current.value?.email) return
  if (isProtectedUser(current.value)) return

  resetting.value = true
  try {
    await sendReset(current.value.email)
    showReset.value = false
  } finally {
    resetting.value = false
  }
}

const showDelete = ref(false)
const deleting = ref(false)
function openDelete(row: UserRow) {
  if (isProtectedUser(row)) return

  current.value = row
  showDelete.value = true
}
async function confirmDeleteSoft() {
  if (!current.value?.uid) return
  if (isProtectedUser(current.value)) return

  deleting.value = true
  try {
    await deleteUserSoft(current.value.uid)
    await fetchUsers()
    showDelete.value = false
  } finally {
    deleting.value = false
  }
}

const showDeletePermanent = ref(false)
const confirmPermanent = ref(false)
function openDeletePermanent(row: UserRow) {
  if (isProtectedUser(row)) return

  current.value = row
  confirmPermanent.value = false
  showDeletePermanent.value = true
}
async function confirmDeleteHard() {
  if (!current.value?.uid) return
  if (isProtectedUser(current.value)) return

  deleting.value = true
  try {
    await deleteUserPermanent(current.value.uid)
    await fetchUsers()
    showDeletePermanent.value = false
  } finally {
    deleting.value = false
  }
}
</script>