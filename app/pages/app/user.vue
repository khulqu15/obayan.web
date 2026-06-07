<template>
  <div class="min-h-full bg-slate-50 text-slate-800 dark:bg-neutral-950 dark:text-neutral-100">
    <div class="mx-auto max-w-[1680px] space-y-5 p-4 sm:p-6 lg:p-8">
      <section class="relative overflow-hidden rounded-[32px] border border-green-100 bg-white shadow-[0_24px_70px_-36px_rgba(15,23,42,0.35)] dark:border-neutral-800 dark:bg-neutral-900">
        <div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-green-200/50 blur-3xl dark:bg-green-900/20"></div>
        <div class="pointer-events-none absolute -bottom-28 left-12 h-72 w-72 rounded-full bg-green-100/70 blur-3xl dark:bg-green-900/10"></div>
        <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-400"></div>

        <div class="relative p-5 sm:p-6 lg:p-7">
          <div class="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div class="max-w-3xl">
              <div class="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-300">
                <Icon icon="lucide:shield-check" class="h-3.5 w-3.5" />
                Paket {{ packageLabel }} · Scoped Role Access
              </div>

              <h1 class="mt-4 text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Manajemen Hak Akses
              </h1>

              <p class="mt-3 text-sm leading-6 text-slate-500 dark:text-neutral-400 sm:text-base">
                Admin tenant dapat membuat user dan mengatur role sesuai paket. Setiap perubahan role otomatis mengunci ulang akses berdasarkan paket agar Basic tidak kembali ke default akses global.
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <div class="min-w-[140px] rounded-[24px] border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/50">
                <p class="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">User</p>
                <p class="mt-1 text-2xl font-black text-slate-950 dark:text-white">{{ visibleRows.length }}</p>
              </div>

              <div class="min-w-[140px] rounded-[24px] border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/50">
                <p class="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Aktif</p>
                <p class="mt-1 text-2xl font-black text-green-600 dark:text-green-400">{{ activeUsers }}</p>
              </div>

              <div class="min-w-[140px] rounded-[24px] border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/50">
                <p class="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Hasil</p>
                <p class="mt-1 text-2xl font-black text-slate-950 dark:text-white">{{ filteredRows.length }}</p>
              </div>
            </div>
          </div>

          <div class="mt-5 flex flex-wrap gap-2">
            <span
              v-for="chip in policyChips"
              :key="chip"
              class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-neutral-800 dark:text-neutral-300"
            >
              {{ chip }}
            </span>
          </div>
        </div>
      </section>

      <section class="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-5">
        <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 class="text-lg font-black text-slate-950 dark:text-white">
              Direktori User
            </h2>
            <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
              Kelola akun, status, role, dan akses sidebar dalam satu tabel.
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              :disabled="loading"
              class="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              @click="fetchUsers"
            >
              <Icon icon="lucide:refresh-cw" class="mr-2 h-4 w-4" />
              Muat Ulang
            </button>

            <button
              type="button"
              class="inline-flex h-11 items-center justify-center rounded-2xl bg-green-600 px-4 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
              @click="openCreate"
            >
              <Icon icon="lucide:user-plus" class="mr-2 h-4 w-4" />
              Tambah User
            </button>
          </div>
        </div>

        <div class="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div class="relative min-w-0 flex-1">
            <Icon icon="lucide:search" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              v-model.trim="search"
              type="search"
              placeholder="Cari nama, email, no HP, atau role..."
              class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-900"
            />
          </div>

          <div class="flex flex-col gap-3 sm:flex-row lg:w-auto">
            <select
              v-model="roleFilter"
              class="h-12 min-w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black capitalize text-slate-700 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-900 sm:min-w-[180px]"
            >
              <option value="all">Semua Role</option>
              <option
                v-for="role in roleOptions"
                :key="role"
                :value="role"
              >
                {{ roleLabel(role) }}
              </option>
            </select>

            <select
              v-model="statusFilter"
              class="h-12 min-w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black text-slate-700 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-900 sm:min-w-[180px]"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Non-aktif</option>
            </select>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
            <Icon icon="lucide:filter" class="h-3.5 w-3.5" />
            {{ filteredRows.length }} user tampil
          </span>

          <span class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-neutral-800 dark:text-neutral-300">
            Admin {{ defaultRoutesForRole('admin').length }} akses
          </span>

          <span class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-neutral-800 dark:text-neutral-300">
            Pengurus {{ defaultRoutesForRole('pengurus').length }} akses
          </span>

          <span
            v-if="loading"
            class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500 dark:bg-neutral-800 dark:text-neutral-400"
          >
            Memuat data...
          </span>

          <span
            v-if="error"
            class="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 dark:bg-rose-900/20 dark:text-rose-300"
          >
            {{ error }}
          </span>
        </div>
      </section>

      <section class="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div class="flex flex-col gap-3 border-b border-slate-200 p-5 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 class="text-base font-black text-slate-950 dark:text-white">
              Tabel User
            </h3>
            <p class="mt-1 text-sm text-slate-500 dark:text-neutral-400">
              Role switch otomatis reset akses sesuai paket {{ packageLabel }}.
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <span class="rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
              {{ activeUsers }} aktif
            </span>
            <span class="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
              {{ inactiveUsers }} non-aktif
            </span>
          </div>
        </div>

        <div class="overflow-x-auto p-3 sm:p-4">
          <DataTable
            title="User"
            :rows="filteredRows"
            :columns="columns"
            :rowKey="(row) => row.uid"
            :show-actions="true"
            :selectable="false"
            export-filename="data-user"
          >
            <template #cell-displayName="{ row }">
              <div class="flex min-w-[220px] items-center gap-3">
                <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-green-50 text-sm font-black text-green-700 ring-1 ring-green-100 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-900/40">
                  {{ initials(row.displayName || row.email) }}
                </div>

                <div class="min-w-0">
                  <p class="truncate text-sm font-black text-slate-950 dark:text-white">
                    {{ row.displayName || 'Tanpa Nama' }}
                  </p>
                  <p class="mt-0.5 truncate text-xs font-medium text-slate-500 dark:text-neutral-400">
                    {{ row.uid }}
                  </p>
                </div>
              </div>
            </template>

            <template #cell-email="{ row }">
              <div class="min-w-[190px]">
                <p class="truncate text-sm font-bold text-slate-700 dark:text-neutral-200">
                  {{ row.email || '-' }}
                </p>
              </div>
            </template>

            <template #cell-phone="{ row }">
              <span class="text-sm font-semibold text-slate-500 dark:text-neutral-400">
                {{ row.phone || '-' }}
              </span>
            </template>

            <template #cell-role="{ row }">
              <div
                v-if="canManageRole && !isProtectedUser(row)"
                class="inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-neutral-700 dark:bg-neutral-800"
              >
                <select
                  :value="safeRoleForPackage(row.role)"
                  class="rounded-xl bg-transparent px-3 py-1.5 text-sm font-black capitalize text-slate-700 outline-none dark:text-neutral-200"
                  @change="onChangeRole(row, ($event.target as HTMLSelectElement).value as Role)"
                >
                  <option
                    v-for="role in roleOptions"
                    :key="role"
                    :value="role"
                  >
                    {{ roleLabel(role) }}
                  </option>
                </select>
              </div>

              <span v-else :class="rolePillClass(row.role)">
                {{ roleLabel(safeRoleForPackage(row.role)) }}
              </span>
            </template>

            <template #cell-accessPlan="{ row }">
              <div class="flex min-w-[210px] flex-wrap items-center gap-2">
                <span class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700 dark:bg-neutral-800 dark:text-neutral-200">
                  {{ rowAccessCount(row) }} akses
                </span>

                <span
                  v-if="!row.allowedRoutes?.length"
                  class="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
                >
                  default paket
                </span>

                <button
                  v-if="canManageUserAccess && !isProtectedUser(row)"
                  type="button"
                  class="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="openAccess(row)"
                >
                  Kelola
                </button>
              </div>
            </template>

            <template #cell-isActive="{ row }">
              <button
                type="button"
                :disabled="!canManageUserAccess || isProtectedUser(row)"
                :class="row.isActive ? activePillClass : inactivePillClass"
                @click="toggleActive(row)"
              >
                <span
                  class="mr-2 h-2 w-2 rounded-full"
                  :class="row.isActive ? 'bg-white' : 'bg-amber-500'"
                ></span>
                {{ row.isActive ? 'Aktif' : 'Non-aktif' }}
              </button>
            </template>

            <template #cell-action="{ row }">
              <div class="relative flex justify-end">
                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                  aria-label="Aksi user"
                  @click.stop="toggleActionMenu(row, $event)"
                >
                  <Icon icon="lucide:ellipsis-vertical" class="h-4 w-4" />
                </button>

                <Teleport to="body">
                  <div
                    v-if="activeActionId === row.uid"
                    :style="actionMenuStyle"
                    class="fixed z-[9999] w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900"
                    @click.stop
                  >
                    <button
                      type="button"
                      class="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      @click="handleAction(() => openEdit(row))"
                    >
                      <Icon icon="lucide:pencil" class="h-4 w-4" />
                      Edit User
                    </button>

                    <button
                      type="button"
                      class="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-amber-700 transition hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-900/10"
                      @click="handleAction(() => openReset(row))"
                    >
                      <Icon icon="lucide:key-round" class="h-4 w-4" />
                      Reset Password
                    </button>

                    <button
                      type="button"
                      class="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      @click="handleAction(() => applyRoleDefaultToRow(row))"
                    >
                      <Icon icon="lucide:lock-keyhole" class="h-4 w-4" />
                      Reset Akses Paket
                    </button>

                    <div class="my-1 border-t border-slate-100 dark:border-neutral-800"></div>

                    <button
                      type="button"
                      class="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-rose-700 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-900/10"
                      @click="handleAction(() => openDelete(row))"
                    >
                      <Icon icon="lucide:user-x" class="h-4 w-4" />
                      Non-aktifkan
                    </button>

                    <button
                      v-if="canManageUserAccess"
                      type="button"
                      class="flex w-full items-center gap-2 rounded-xl bg-rose-600 px-3 py-2.5 text-left text-sm font-bold text-white transition hover:bg-rose-700"
                      @click="handleAction(() => openDeletePermanent(row))"
                    >
                      <Icon icon="lucide:trash-2" class="h-4 w-4" />
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

    <ModalShell v-model="showForm" :title="formMode === 'create' ? 'Tambah User' : 'Edit User'">
      <form class="space-y-5" @submit.prevent="submitForm">
        <div class="rounded-[24px] border border-green-100 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-900/10">
          <div class="flex items-start gap-3">
            <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-green-700 ring-1 ring-green-100 dark:bg-neutral-900 dark:ring-green-900/40">
              <Icon :icon="formMode === 'create' ? 'lucide:user-plus' : 'lucide:user-cog'" class="h-5 w-5" />
            </div>

            <div>
              <p class="text-sm font-black text-slate-950 dark:text-white">
                {{ formMode === 'create' ? 'Buat akun baru' : 'Perbarui akun' }}
              </p>
              <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                Role yang dapat dipilih mengikuti paket {{ packageLabel }}. Akses otomatis mengikuti default role.
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Nama
            </label>
            <input
              v-model.trim="form.displayName"
              type="text"
              class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              placeholder="Pak Fauzi SMK"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Email Login
            </label>
            <input
              v-model.trim="form.email"
              type="email"
              class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              placeholder="user.school@ponpes.obayan.id"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              No HP
            </label>
            <input
              v-model.trim="form.phone"
              type="text"
              class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              placeholder="+62 812-3456-7890"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Role
            </label>
            <select
              v-if="canManageRole"
              v-model="form.role"
              class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black capitalize outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              <option
                v-for="role in roleOptions"
                :key="role"
                :value="role"
              >
                {{ roleLabel(role) }}
              </option>
            </select>

            <div
              v-else
              class="flex h-12 items-center rounded-2xl border border-slate-200 bg-slate-100 px-4 text-sm font-black capitalize text-slate-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            >
              {{ roleLabel(form.role) }}
            </div>
          </div>
        </div>

        <div class="rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-950/50">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <label class="flex items-start gap-3">
              <input
                v-model="form.createAuth"
                type="checkbox"
                :disabled="formMode === 'edit'"
                class="mt-1 rounded border-slate-300 text-green-600 focus:ring-green-500 disabled:opacity-50"
              />
              <span>
                <span class="block text-sm font-black text-slate-950 dark:text-white">
                  Buat akun Firebase Auth
                </span>
                <span class="mt-1 block text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Aktifkan untuk user yang langsung login. Jika email sudah ada di Auth, gunakan reset/sinkronisasi UID.
                </span>
              </span>
            </label>

            <span class="rounded-full bg-white px-3 py-1.5 text-xs font-black text-green-700 ring-1 ring-slate-200 dark:bg-neutral-900 dark:ring-neutral-800">
              {{ defaultRoutesForRole(form.role).length }} akses default
            </span>
          </div>
        </div>

        <div v-if="formMode === 'create' && form.createAuth">
          <label class="mb-1.5 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            Password
          </label>

          <div class="relative">
            <input
              v-model.trim="form.password"
              :type="showPass ? 'text' : 'password'"
              class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm font-semibold outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              placeholder="Kosongkan untuk auto generate"
            />

            <button
              type="button"
              class="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-neutral-700 dark:hover:text-white"
              @click="showPass = !showPass"
            >
              <Icon :icon="showPass ? 'lucide:eye-off' : 'lucide:eye'" class="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          v-if="formError"
          class="rounded-[22px] border border-rose-200 bg-rose-50 p-4 text-sm font-semibold leading-6 text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300"
        >
          {{ formError }}

          <div v-if="isAlreadyInUseError" class="mt-3 space-y-3">
            <p class="text-xs leading-5">
              Email sudah ada di Firebase Auth, tetapi belum sinkron ke database users.
              Karena mode ini client-only, masukkan password lama akun tersebut lalu klik Simpan lagi.
              Jika password tidak diketahui, kirim reset password terlebih dahulu.
            </p>

            <button
              type="button"
              :disabled="!form.email"
              class="inline-flex items-center rounded-2xl bg-amber-500 px-3 py-2 text-xs font-black text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
              @click="sendReset(normalizeEmail(form.email))"
            >
              <Icon icon="lucide:key-round" class="mr-2 h-3.5 w-3.5" />
              Kirim Reset Password
            </button>
          </div>
        </div>

        <div
          v-if="createdTempPassword"
          class="rounded-[22px] border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900/40 dark:bg-green-900/10 dark:text-green-200"
        >
          <p class="font-black">Password sementara berhasil dibuat</p>
          <code class="mt-2 block rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-800 dark:bg-neutral-900 dark:text-white">
            {{ createdTempPassword }}
          </code>

          <button
            type="button"
            class="mt-3 inline-flex items-center rounded-2xl bg-green-600 px-3 py-2 text-xs font-black text-white transition hover:bg-green-700"
            @click="downloadCred"
          >
            <Icon icon="lucide:download" class="mr-2 h-3.5 w-3.5" />
            Download Credential
          </button>
        </div>
      </form>

      <template #footer>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          @click="showForm = false"
        >
          Batal
        </button>

        <button
          type="button"
          :disabled="saving"
          class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          @click="submitForm"
        >
          {{ saving ? 'Menyimpan...' : formMode === 'create' ? 'Simpan User' : 'Update User' }}
        </button>
      </template>
    </ModalShell>

    <ModalShell v-model="showAccess" title="Kelola Hak Akses">
      <div class="space-y-5">
        <div class="rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-950/50">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p class="text-sm font-black text-slate-950 dark:text-white">
                {{ current?.displayName || 'User' }}
              </p>
              <p class="mt-1 text-sm text-slate-500 dark:text-neutral-400">
                {{ accessBuffer.length }} route dipilih dari paket {{ packageLabel }}.
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                @click="applyRoleDefault"
              >
                Default Role
              </button>

              <button
                type="button"
                class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                @click="selectAll"
              >
                Pilih Paket
              </button>

              <button
                type="button"
                class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                @click="clearAll"
              >
                Kosongkan
              </button>
            </div>
          </div>
        </div>

        <div class="max-h-[62vh] overflow-auto rounded-[24px] border border-slate-200 dark:border-neutral-800">
          <section
            v-for="group in availableGroups"
            :key="group.title"
            class="border-b border-slate-200 last:border-b-0 dark:border-neutral-800"
          >
            <div class="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
              <p class="text-sm font-black text-slate-950 dark:text-white">
                {{ group.title }}
              </p>
            </div>

            <div class="grid grid-cols-1 gap-2 p-4 lg:grid-cols-2">
              <label
                v-for="item in group.items"
                :key="item.href"
                class="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:border-green-200 hover:bg-green-50 dark:border-neutral-800 dark:bg-neutral-950/50 dark:hover:border-green-900/60 dark:hover:bg-green-900/10"
              >
                <input
                  v-model="accessBuffer"
                  type="checkbox"
                  :value="item.href"
                  class="mt-1 rounded border-slate-300 text-green-600 focus:ring-green-500"
                />

                <span class="min-w-0">
                  <span class="block truncate text-sm font-black text-slate-950 dark:text-white">
                    {{ item.label }}
                  </span>
                  <span class="mt-1 block truncate text-xs font-semibold text-slate-500 dark:text-neutral-400">
                    {{ item.href }}
                  </span>
                </span>
              </label>
            </div>
          </section>
        </div>
      </div>

      <template #footer>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          @click="showAccess = false"
        >
          Batal
        </button>

        <button
          type="button"
          :disabled="savingAccess"
          class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          @click="saveAccess"
        >
          {{ savingAccess ? 'Menyimpan...' : 'Simpan Akses' }}
        </button>
      </template>
    </ModalShell>

    <ModalShell v-model="showReset" title="Reset Password">
      <div class="space-y-4">
        <div class="rounded-[24px] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-200">
          Link reset password akan dikirim ke email user.
        </div>

        <div>
          <p class="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Email</p>
          <p class="mt-2 text-sm font-black text-slate-950 dark:text-white">
            {{ current?.email || '-' }}
          </p>
        </div>
      </div>

      <template #footer>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          @click="showReset = false"
        >
          Batal
        </button>

        <button
          type="button"
          :disabled="resetting || !current?.email"
          class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          @click="doReset"
        >
          {{ resetting ? 'Mengirim...' : 'Kirim Reset' }}
        </button>
      </template>
    </ModalShell>

    <ModalShell v-model="showDelete" title="Non-aktifkan User">
      <div class="space-y-4 text-sm">
        <div class="rounded-[24px] border border-amber-200 bg-amber-50 p-4 leading-6 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-200">
          User akan dinonaktifkan, tetapi data tetap tersimpan.
        </div>

        <p>
          Non-aktifkan <strong>{{ current?.displayName || '-' }}</strong>?
        </p>
      </div>

      <template #footer>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          @click="showDelete = false"
        >
          Batal
        </button>

        <button
          type="button"
          :disabled="deleting"
          class="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-4 py-2.5 text-sm font-black text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
          @click="confirmDeleteSoft"
        >
          {{ deleting ? 'Memproses...' : 'Non-aktifkan' }}
        </button>
      </template>
    </ModalShell>

    <ModalShell v-model="showDeletePermanent" title="Hapus Permanen User">
      <div class="space-y-4 text-sm">
        <div class="rounded-[24px] border border-rose-200 bg-rose-50 p-4 leading-6 text-rose-800 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-200">
          Tindakan ini menghapus data user secara permanen dari database.
        </div>

        <p>
          Hapus permanen <strong>{{ current?.displayName || '-' }}</strong>?
        </p>

        <label class="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-950/50">
          <input
            v-model="confirmPermanent"
            type="checkbox"
            class="mt-1 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
          />
          <span>Saya paham dan setuju menghapus user ini secara permanen.</span>
        </label>
      </div>

      <template #footer>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          @click="showDeletePermanent = false"
        >
          Batal
        </button>

        <button
          type="button"
          :disabled="deleting || !confirmPermanent"
          class="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          @click="confirmDeleteHard"
        >
          {{ deleting ? 'Menghapus...' : 'Hapus Permanen' }}
        </button>
      </template>
    </ModalShell>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRuntimeConfig, useState } from 'nuxt/app'
import { Icon } from '@iconify/vue'
import DataTable from '~/components/widget/DataTable.vue'
import ModalShell from '~/components/widget/ModalShell.vue'
import { useUser, type UserRow, ALL_SIDEBAR_GROUPS } from '~/composables/data/useUser'

definePageMeta({
  layout: 'app',
  layoutProps: { title: 'Hak Akses' }
})

type Role = 'admin' | 'pengurus' | 'wali'
type RoleFilter = 'all' | Role
type StatusFilter = 'all' | 'active' | 'inactive'

const config = useRuntimeConfig()

const {
  rows,
  loading,
  error,
  fetchUsers,
  createUserProfile,
  updateUser,
  deleteUserSoft,
  deleteUserPermanent,
  setRole,
  setAllowedRoutes,
  setActive,
  sendReset,
  downloadPasswordFile,
  createdTempPassword
} = useUser()

const sessionUser = useState<any>('sessionUser', () => ({}))

const BASIC_ROLE_ROUTES: Record<Role, string[]> = {
  admin: [
    '/app',
    '/app/news',
    '/app/gallery',
    '/app/profile',
    '/app/web',
    '/app/user',
    '/app/contact',
    '/app/navbar',
    '/app/registration',
    '/app/announcement'
  ],
  pengurus: [
    '/app/news',
    '/app/gallery',
    '/app/announcement',
    '/app/agenda',
    '/app/registration'
  ],
  wali: [
    '/wali',
    '/wali/santri',
    '/wali/pembayaran',
    '/wali/pengumuman'
  ]
}

const PACKAGE_ROLES: Record<string, Role[]> = {
  basic: ['admin', 'pengurus', 'wali'],
  standard: ['admin', 'pengurus', 'wali'],
  pro: ['admin', 'pengurus', 'wali'],
  advance: ['admin', 'pengurus', 'wali'],
  full: ['admin', 'pengurus', 'wali']
}

const packageName = computed(() => {
  return String(
    config.public.accessPackage ||
    config.public.packageName ||
    config.public.subscriptionPackage ||
    'basic'
  )
    .trim()
    .toLowerCase()
})

const packageLabel = computed(() => {
  const name = packageName.value

  if (name === 'basic') return 'Basic'
  if (name === 'standard') return 'Standard'
  if (name === 'pro') return 'Pro'
  if (name === 'advance') return 'Advance'
  if (name === 'full') return 'Full Access'

  return name.charAt(0).toUpperCase() + name.slice(1)
})

const roleOptions = computed<Role[]>(() => {
  return PACKAGE_ROLES[packageName.value] || PACKAGE_ROLES.basic
})

const policyChips = computed(() => [
  `Admin: ${defaultRoutesForRole('admin').length} akses`,
  `Pengurus: ${defaultRoutesForRole('pengurus').length} akses`,
  `Wali: ${defaultRoutesForRole('wali').length} akses`,
  'Role change otomatis reset akses'
])

const viewerEmail = computed(() => {
  return normalizeEmail(
    sessionUser.value?.email ||
    sessionUser.value?.user?.email ||
    sessionUser.value?.auth?.email ||
    ''
  )
})

const viewerRole = computed(() => {
  return String(
    sessionUser.value?.role ||
    sessionUser.value?.user?.role ||
    sessionUser.value?.claims?.role ||
    ''
  )
    .trim()
    .toLowerCase()
})

const viewerRow = computed(() => {
  const email = viewerEmail.value
  if (!email) return null

  return rows.value.find((row) => normalizeEmail(row.email) === email) || null
})

const effectiveViewerRole = computed(() => {
  return String(viewerRole.value || viewerRow.value?.role || '')
    .trim()
    .toLowerCase()
})

const canManageRole = computed(() => {
  return (
    effectiveViewerRole.value === 'superadmin' ||
    effectiveViewerRole.value === 'admin' ||
    viewerEmail.value === 'team.sencra@gmail.com'
  )
})

const canManageUserAccess = computed(() => {
  return (
    effectiveViewerRole.value === 'superadmin' ||
    effectiveViewerRole.value === 'admin' ||
    viewerEmail.value === 'team.sencra@gmail.com'
  )
})

const PROTECTED_EMAILS = new Set(['team.sencra@gmail.com'])

function normalizeEmail(value?: string | null) {
  return String(value || '').trim().toLowerCase()
}

function normalizePath(value?: string | null) {
  const path = String(value || '').trim()

  if (!path) return '/'

  try {
    const url = new URL(path, 'https://local.test')
    return url.pathname.replace(/\/+$/, '') || '/'
  } catch {
    return path.replace(/\/+$/, '') || '/'
  }
}

function uniqRoutes(values: string[]) {
  return Array.from(new Set(values.map(normalizePath).filter(Boolean)))
}

function normalizeRole(value?: string | null): Role {
  const role = String(value || '').trim().toLowerCase()

  if (role === 'admin') return 'admin'
  if (role === 'pengurus') return 'pengurus'
  if (role === 'wali') return 'wali'

  return 'wali'
}

function safeRoleForPackage(value?: string | null): Role {
  const role = normalizeRole(value)

  if (roleOptions.value.includes(role)) return role

  return roleOptions.value[0] || 'wali'
}

function roleLabel(role?: string | null) {
  const normalizedRole = normalizeRole(role)

  if (normalizedRole === 'admin') return 'Admin'
  if (normalizedRole === 'pengurus') return 'Pengurus'
  return 'Wali'
}

function allAdminRoutes() {
  return uniqRoutes(
    ALL_SIDEBAR_GROUPS.flatMap((group: any) => {
      return (group.items || []).map((item: any) => item.href)
    })
  )
}

function defaultRoutesForRole(role?: string | null) {
  const normalizedRole = normalizeRole(role)

  if (packageName.value === 'basic') {
    return [...BASIC_ROLE_ROUTES[normalizedRole]]
  }

  if (packageName.value === 'standard') {
    if (normalizedRole === 'admin') {
      return uniqRoutes([
        ...BASIC_ROLE_ROUTES.admin,
        '/app/santri',
        '/app/wali',
        '/app/class',
        '/app/maskan'
      ])
    }

    if (normalizedRole === 'pengurus') {
      return uniqRoutes([
        ...BASIC_ROLE_ROUTES.pengurus,
        '/app/santri',
        '/app/class'
      ])
    }

    return [...BASIC_ROLE_ROUTES.wali]
  }

  if (packageName.value === 'pro' || packageName.value === 'advance' || packageName.value === 'full') {
    if (normalizedRole === 'admin') return allAdminRoutes()

    if (normalizedRole === 'pengurus') {
      return uniqRoutes(
        allAdminRoutes().filter((routePath) => {
          return !['/app/user', '/app/web', '/app/navbar'].includes(routePath)
        })
      )
    }

    return [...BASIC_ROLE_ROUTES.wali]
  }

  return [...BASIC_ROLE_ROUTES[normalizedRole]]
}

function packageAllowedRoutes() {
  return uniqRoutes(roleOptions.value.flatMap((role) => defaultRoutesForRole(role)))
}

function isProtectedUser(row?: UserRow | null) {
  if (!row) return false

  const role = String((row as any)?.role || '').trim().toLowerCase()
  const email = normalizeEmail(row.email)

  return role === 'superadmin' || PROTECTED_EMAILS.has(email)
}

function initials(value?: string | null) {
  const words = String(value || 'U')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('') || 'U'
}

const visibleRows = computed(() => rows.value.filter((row) => !isProtectedUser(row)))

const search = ref('')
const roleFilter = ref<RoleFilter>('all')
const statusFilter = ref<StatusFilter>('all')

const filteredRows = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return visibleRows.value.filter((row) => {
    const role = normalizeRole(row.role)

    const matchKeyword =
      !keyword ||
      [row.displayName, row.email, row.phone, role].some((value) => {
        return String(value || '').toLowerCase().includes(keyword)
      })

    const matchRole = roleFilter.value === 'all' || role === roleFilter.value

    const matchStatus =
      statusFilter.value === 'all' ||
      (statusFilter.value === 'active' ? row.isActive : !row.isActive)

    return matchKeyword && matchRole && matchStatus
  })
})

const activeUsers = computed(() => visibleRows.value.filter((row) => row.isActive).length)
const inactiveUsers = computed(() => visibleRows.value.filter((row) => !row.isActive).length)

const columns = computed<any[]>(() => [
  { key: 'displayName', label: 'User', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'phone', label: 'No HP', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'accessPlan', label: 'Akses', sortable: false },
  { key: 'isActive', label: 'Status', sortable: true }
])

function rowAccessCount(row: UserRow) {
  if (Array.isArray(row.allowedRoutes) && row.allowedRoutes.length) {
    return uniqRoutes(row.allowedRoutes).length
  }

  return defaultRoutesForRole(row.role).length
}

function rolePillClass(role?: string | null) {
  const normalizedRole = normalizeRole(role)
  const base = 'inline-flex items-center rounded-full px-3 py-1.5 text-xs font-black capitalize '

  if (normalizedRole === 'admin') {
    return base + 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300'
  }

  if (normalizedRole === 'pengurus') {
    return base + 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  }

  return base + 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
}

const activePillClass =
  'inline-flex items-center rounded-full bg-green-600 px-3 py-1.5 text-xs font-black text-white transition disabled:cursor-default disabled:opacity-80 enabled:hover:bg-green-700'

const inactivePillClass =
  'inline-flex items-center rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700 transition disabled:cursor-default disabled:opacity-80 enabled:hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300'

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
  const menuWidth = 224
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

const showForm = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const saving = ref(false)
const formError = ref<string | null>(null)
const current = ref<UserRow | null>(null)
const showPass = ref(false)

const form = reactive<{
  displayName: string
  email: string
  phone: string
  role: Role
  createAuth: boolean
  password: string
}>({
  displayName: '',
  email: '',
  phone: '',
  role: 'pengurus',
  createAuth: true,
  password: ''
})

const isAlreadyInUseError = computed(() => {
  const message = String(formError.value || '').toLowerCase()

  return (
    message.includes('already') ||
    message.includes('in-use') ||
    message.includes('email-already-in-use') ||
    message.includes('sudah digunakan')
  )
})

function resetForm() {
  form.displayName = ''
  form.email = ''
  form.phone = ''
  form.role = roleOptions.value.includes('pengurus') ? 'pengurus' : roleOptions.value[0] || 'wali'
  form.createAuth = true
  form.password = ''
  formError.value = null
  showPass.value = false
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

  form.displayName = row.displayName || ''
  form.email = row.email || ''
  form.phone = row.phone || ''
  form.role = safeRoleForPackage(row.role)
  form.createAuth = false
  form.password = ''
  formError.value = null

  showForm.value = true
}

function validateForm() {
  if (!form.displayName.trim()) return 'Nama wajib diisi.'

  if (form.createAuth && !form.email.trim()) {
    return 'Email wajib diisi jika akun Auth dibuat.'
  }

  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    return 'Format email belum valid.'
  }

  if (!roleOptions.value.includes(form.role)) {
    return `Role ${form.role} tidak tersedia untuk paket ${packageLabel.value}.`
  }

  if (formMode.value === 'create' && form.email.trim()) {
    const duplicate = rows.value.find((row) => normalizeEmail(row.email) === normalizeEmail(form.email))

    if (duplicate) {
      return `Email ${form.email} sudah ada di database user. Gunakan menu edit atau reset password pada user tersebut.`
    }
  }

  return null
}

async function resolveCreatedUid(result: any, email?: string) {
  const directUid =
    result?.uid ||
    result?.id ||
    result?.user?.uid ||
    result?.profile?.uid ||
    result?.data?.uid

  if (directUid) return String(directUid)

  await fetchUsers()

  const found = rows.value.find((row) => normalizeEmail(row.email) === normalizeEmail(email))

  return found?.uid ? String(found.uid) : ''
}

async function submitForm() {
  const validationError = validateForm()

  if (validationError) {
    formError.value = validationError
    return
  }

  saving.value = true
  formError.value = null

  try {
    const selectedRole = canManageRole.value ? safeRoleForPackage(form.role) : 'wali'
    const selectedRoutes = defaultRoutesForRole(selectedRole)

    if (formMode.value === 'create') {
      const result = await createUserProfile({
        displayName: form.displayName.trim(),
        email: normalizeEmail(form.email) || undefined,
        phone: form.phone.trim() || undefined,
        role: selectedRole,
        allowedRoutes: selectedRoutes,
        createAuth: !!form.createAuth,
        password: form.password.trim() || undefined
      } as any)

      const createdUid = await resolveCreatedUid(result, normalizeEmail(form.email))
      
      if (createdUid) {
        await setAllowedRoutes(createdUid, selectedRoutes)
      }

      await fetchUsers()
      showForm.value = false
      return
    }

    if (current.value?.uid) {
      if (isProtectedUser(current.value)) {
        formError.value = 'Akun sistem tidak dapat diubah.'
        return
      }

      const previousRole = safeRoleForPackage(current.value.role)

      await updateUser(current.value.uid, {
        displayName: form.displayName.trim(),
        email: normalizeEmail(form.email),
        phone: form.phone.trim()
      })

      if (canManageRole.value && previousRole !== selectedRole) {
        await setRoleWithPackageDefault(current.value, selectedRole)
      }

      await fetchUsers()
      showForm.value = false
    }
  } catch (err: any) {
    formError.value = friendlyError(err)
  } finally {
    saving.value = false
  }
}

function friendlyError(err: any) {
  const raw = String(err?.message || err || 'Gagal menyimpan user.')
  const lower = raw.toLowerCase()

  if (
    lower.includes('auth/email-already-in-use') ||
    lower.includes('email-already-in-use') ||
    lower.includes('already') ||
    lower.includes('in-use')
  ) {
    return `Email ${form.email || 'ini'} sudah terdaftar di Firebase Auth. Sinkronkan UID Auth lama ke database users atau hapus Auth lama sebelum dibuat ulang.`
  }

  return raw
}

function downloadCred() {
  const username = form.email.trim() || form.phone.trim() || '(username)'

  if (!username || !createdTempPassword.value) return

  downloadPasswordFile(username, createdTempPassword.value)
}

async function setRoleWithPackageDefault(row: UserRow, role: Role) {
  if (!canManageRole.value) return
  if (isProtectedUser(row)) return
  if (!roleOptions.value.includes(role)) return

  const routes = defaultRoutesForRole(role)

  await setRole(row.uid, role, false)
  await setAllowedRoutes(row.uid, routes)
}

async function onChangeRole(row: UserRow, role: Role) {
  if (!canManageRole.value) return
  if (isProtectedUser(row)) return
  if (!roleOptions.value.includes(role)) return

  const currentRole = safeRoleForPackage(row.role)

  if (currentRole === role) return

  const confirmed = window.confirm(
    `Ganti role ${row.displayName || row.email || 'user'} menjadi ${roleLabel(role)}?\n\nAkses akan otomatis direset ke default Paket ${packageLabel.value}: ${defaultRoutesForRole(role).length} akses.`
  )

  if (!confirmed) {
    await fetchUsers()
    return
  }

  try {
    await setRoleWithPackageDefault(row, role)
    await fetchUsers()
  } catch (err: any) {
    formError.value = friendlyError(err)
    await fetchUsers()
  }
}

async function applyRoleDefaultToRow(row: UserRow) {
  if (!canManageRole.value) return
  if (isProtectedUser(row)) return

  const role = safeRoleForPackage(row.role)

  const confirmed = window.confirm(
    `Reset akses ${row.displayName || row.email || 'user'} ke default ${roleLabel(role)} Paket ${packageLabel.value}?`
  )

  if (!confirmed) return

  await setAllowedRoutes(row.uid, defaultRoutesForRole(role))
  await fetchUsers()
}

async function toggleActive(row: UserRow) {
  if (!canManageUserAccess.value) return
  if (isProtectedUser(row)) return

  await setActive(row.uid, !row.isActive)
  await fetchUsers()
}

const showAccess = ref(false)
const savingAccess = ref(false)
const accessBuffer = ref<string[]>([])

const availableGroups = computed(() => {
  const allowed = new Set(packageAllowedRoutes().map(normalizePath))
  const selected = new Set(accessBuffer.value.map(normalizePath))

  return ALL_SIDEBAR_GROUPS
    .map((group: any) => ({
      ...group,
      items: (group.items || []).filter((item: any) => {
        const href = normalizePath(item.href)
        return allowed.has(href) || selected.has(href)
      })
    }))
    .filter((group: any) => group.items.length > 0)
})

function openAccess(row: UserRow) {
  if (!canManageUserAccess.value) return
  if (isProtectedUser(row)) return

  current.value = row
  accessBuffer.value = row.allowedRoutes?.length
    ? uniqRoutes(row.allowedRoutes)
    : defaultRoutesForRole(row.role)

  showAccess.value = true
}

function selectAll() {
  accessBuffer.value = uniqRoutes(
    availableGroups.value.flatMap((group: any) => {
      return group.items.map((item: any) => item.href)
    })
  )
}

function clearAll() {
  accessBuffer.value = []
}

function applyRoleDefault() {
  if (!current.value) return

  accessBuffer.value = defaultRoutesForRole(current.value.role)
}

async function saveAccess() {
  if (!canManageUserAccess.value) return
  if (!current.value) return
  if (isProtectedUser(current.value)) return

  const packageRoutes = new Set(packageAllowedRoutes().map(normalizePath))
  const sanitizedRoutes = uniqRoutes(accessBuffer.value).filter((routePath) => {
    return packageRoutes.has(normalizePath(routePath))
  })

  savingAccess.value = true

  try {
    await setAllowedRoutes(current.value.uid, sanitizedRoutes)
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
  if (!canManageUserAccess.value) return
  if (isProtectedUser(row)) return

  current.value = row
  confirmPermanent.value = false
  showDeletePermanent.value = true
}

async function confirmDeleteHard() {
  if (!current.value?.uid) return
  if (!confirmPermanent.value) return
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