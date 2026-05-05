<!-- /components/editor/InfoHero.vue -->

<template>
  <section class="relative overflow-hidden rounded-4xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
    <!-- Header -->
    <div class="relative overflow-hidden border-b border-gray-200 bg-linear-to-br from-green-50 via-white to-lime-50 px-5 py-5 dark:border-neutral-800 dark:from-green-950/20 dark:via-neutral-900 dark:to-neutral-900 md:px-6">
      <div class="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-green-300/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-20 left-8 h-40 w-40 rounded-full bg-lime-300/20 blur-3xl"></div>

      <div class="relative z-10 flex flex-col gap-5">
        <div class="min-w-0">
          <div class="inline-flex items-center gap-2 rounded-full border border-green-100 bg-white/80 px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm backdrop-blur dark:border-green-900/40 dark:bg-neutral-900/70 dark:text-green-300">
            <span class="h-2 w-2 rounded-full bg-green-500"></span>
            Info Section Editor
          </div>

          <h2 class="mt-4 text-xl font-black tracking-tight text-gray-950 dark:text-white">
            Kelola Informasi Keunggulan
          </h2>

          <p class="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
            Atur teks pengantar, alasan memilih lembaga, visi, dan misi dengan tampilan editor yang lebih mudah dipahami.
          </p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="relative z-10 mt-5 flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-black transition"
          :class="activeTab === tab.key
            ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
            : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white'"
          @click="activeTab = tab.key"
        >
          <Icon :icon="tab.icon" class="h-4 w-4" />
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Notices -->
    <div v-if="savedNote || errNote" class="px-5 pt-5 md:px-6">
      <div
        v-if="savedNote"
        class="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 dark:border-green-900/40 dark:bg-green-900/10 dark:text-green-300"
      >
        {{ savedNote }}
      </div>

      <div
        v-if="errNote"
        class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300"
      >
        {{ errNote }}
      </div>
    </div>

    <div class="p-5 pb-28 md:p-6 md:pb-28">
      <!-- Konten -->
      <div v-show="activeTab === 'Konten'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-linear-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Konten Pembuka
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Bagian ini tampil sebagai teks utama sebelum daftar keunggulan, visi, dan misi.
              </p>
            </div>

            <div class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm ring-1 ring-green-100 dark:bg-neutral-900 dark:text-green-300 dark:ring-green-900/40">
              <span class="h-2 w-2 rounded-full bg-green-500"></span>
              Basic Content
            </div>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50 md:col-span-2">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Heading Prefix
            </label>
            <input
              v-model.trim="form.headingPrefix"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Kenapa Memilih"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50 md:col-span-2">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Brand Text
            </label>
            <input
              v-model.trim="form.brandText"
              class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Pondok Al-Inayah"
            />
          </div>

          <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50 md:col-span-2">
            <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Subtitle
            </label>
            <textarea
              v-model.trim="form.subtitle"
              rows="5"
              class="block w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              placeholder="Deskripsi singkat informasi lembaga..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Reasons -->
      <div v-show="activeTab === 'Reasons'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-linear-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Alasan Memilih
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Tambahkan daftar keunggulan lembaga. Setiap item memiliki icon, judul, dan deskripsi.
              </p>
            </div>

            <button
              type="button"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
              @click="addReason"
            >
              <Icon icon="lucide:plus" class="h-4 w-4" />
              Tambah Alasan
            </button>
          </div>
        </div>

        <div class="grid gap-4 xl:grid-cols-2">
          <article
            v-for="(reason, index) in form.reasons"
            :key="'reason-' + index"
            class="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
              <div class="flex items-center justify-between gap-3">
                <div class="flex min-w-0 items-center gap-3">
                  <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    <Icon :icon="reason.icon || 'ph:info'" class="h-5 w-5" />
                  </div>

                  <div class="min-w-0">
                    <h4 class="truncate text-sm font-black text-gray-900 dark:text-white">
                      Reason {{ index + 1 }}
                    </h4>
                    <p class="mt-0.5 truncate text-xs text-gray-500 dark:text-neutral-400">
                      {{ reason.title || 'Belum ada judul' }}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
                  @click="removeReason(index)"
                >
                  <Icon icon="lucide:trash-2" class="h-4 w-4" />
                </button>
              </div>
            </div>

            <div class="space-y-4 p-4">
              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Icon
                </label>

                <button
                  type="button"
                  class="flex h-12 w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="openIconPicker({ kind: 'reasons', index })"
                >
                  <span class="inline-flex min-w-0 items-center gap-2">
                    <Icon :icon="reason.icon || 'ph:info'" class="h-5 w-5 shrink-0" />
                    <span class="truncate">{{ reason.icon || 'Pilih Icon' }}</span>
                  </span>
                  <Icon icon="lucide:chevron-down" class="h-4 w-4 shrink-0 text-gray-400" />
                </button>
              </div>

              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Judul
                </label>
                <input
                  v-model.trim="reason.title"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="Judul keunggulan"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Deskripsi
                </label>
                <textarea
                  v-model.trim="reason.desc"
                  rows="4"
                  class="block w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="Deskripsi singkat keunggulan"
                ></textarea>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Visi & Misi -->
      <div v-show="activeTab === 'Visi & Misi'" class="space-y-5">
        <div class="rounded-[28px] border border-green-100 bg-linear-to-br from-green-50 via-white to-lime-50 p-5 dark:border-green-900/30 dark:from-green-900/10 dark:via-neutral-900 dark:to-neutral-900">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Visi dan Misi
              </h3>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Atur visi utama dan beberapa misi lembaga secara rapi.
              </p>
            </div>

            <button
              type="button"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
              @click="addMission"
            >
              <Icon icon="lucide:plus" class="h-4 w-4" />
              Tambah Misi
            </button>
          </div>
        </div>

        <div class="rounded-[28px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
          <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
            Visi
          </label>
          <textarea
            v-model.trim="form.visi"
            rows="5"
            class="block w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            placeholder="Tuliskan visi lembaga..."
          ></textarea>
        </div>

        <div class="grid gap-4 xl:grid-cols-2">
          <article
            v-for="(mission, index) in form.misi"
            :key="'mission-' + index"
            class="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
              <div class="flex items-center justify-between gap-3">
                <div class="flex min-w-0 items-center gap-3">
                  <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    <Icon :icon="mission.icon || 'ph:check-circle'" class="h-5 w-5" />
                  </div>

                  <div class="min-w-0">
                    <h4 class="truncate text-sm font-black text-gray-900 dark:text-white">
                      Misi {{ index + 1 }}
                    </h4>
                    <p class="mt-0.5 truncate text-xs text-gray-500 dark:text-neutral-400">
                      {{ mission.title || 'Belum ada judul' }}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
                  @click="removeMission(index)"
                >
                  <Icon icon="lucide:trash-2" class="h-4 w-4" />
                </button>
              </div>
            </div>

            <div class="space-y-4 p-4">
              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Icon
                </label>

                <button
                  type="button"
                  class="flex h-12 w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="openIconPicker({ kind: 'misi', index })"
                >
                  <span class="inline-flex min-w-0 items-center gap-2">
                    <Icon :icon="mission.icon || 'ph:check-circle'" class="h-5 w-5 shrink-0" />
                    <span class="truncate">{{ mission.icon || 'Pilih Icon' }}</span>
                  </span>
                  <Icon icon="lucide:chevron-down" class="h-4 w-4 shrink-0 text-gray-400" />
                </button>
              </div>

              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Judul
                </label>
                <input
                  v-model.trim="mission.title"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="Judul misi"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Deskripsi
                </label>
                <textarea
                  v-model.trim="mission.desc"
                  rows="4"
                  class="block w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  placeholder="Deskripsi singkat misi"
                ></textarea>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>

    <!-- Icon Picker Modal -->
    <Teleport to="body">
      <div
        v-if="iconModal.show"
        class="fixed inset-0 z-[1002] overflow-y-auto bg-black/45 px-4 py-20 backdrop-blur-sm"
        @click.self="closeIconPicker"
      >
        <div class="mx-auto w-full max-w-4xl overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
          <div class="flex items-start justify-between gap-3 border-b border-gray-200 px-5 py-4 dark:border-neutral-800">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">
                Select Icon
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                Pilih icon untuk alasan atau misi.
              </p>
            </div>

            <button
              type="button"
              class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              @click="closeIconPicker"
            >
              <Icon icon="lucide:x" class="h-4 w-4" />
            </button>
          </div>

          <div class="space-y-4 p-5">
            <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div class="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                <button
                  v-for="tab in iconModal.tabs"
                  :key="tab"
                  type="button"
                  class="rounded-xl px-4 py-2 text-xs font-bold transition"
                  :class="iconModal.activeTab === tab
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-200'
                    : 'text-gray-500 dark:text-neutral-300'"
                  @click="setIconTab(tab)"
                >
                  {{ tab }}
                </button>
              </div>

              <div class="flex flex-1 gap-2 md:max-w-xl">
                <input
                  v-model.trim="iconModal.query"
                  type="text"
                  placeholder="Search icon, mis. book, student, leaf"
                  class="h-11 flex-1 rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  @input="onSearchInput"
                  @keydown.enter.prevent="searchOnline(true)"
                />

                <button
                  v-if="iconModal.allowOnline"
                  type="button"
                  class="inline-flex h-11 items-center justify-center rounded-2xl bg-green-600 px-4 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
                  :disabled="iconModal.loading"
                  @click="searchOnline()"
                >
                  {{ iconModal.loading ? 'Searching…' : 'Search' }}
                </button>
              </div>
            </div>

            <div class="max-h-[420px] overflow-auto rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-950/40">
              <div class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                <button
                  v-for="name in iconModal.visible"
                  :key="name"
                  type="button"
                  class="group flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-3 text-xs transition hover:-translate-y-0.5 hover:bg-green-50 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-green-900/10"
                  @click="chooseIcon(name)"
                >
                  <Icon :icon="name" width="26" height="26" />
                  <span class="w-full truncate text-center" :title="name">{{ name }}</span>
                </button>
              </div>

              <p v-if="!iconModal.visible.length" class="py-10 text-center text-sm text-gray-500 dark:text-neutral-400">
                No icons found.
              </p>
            </div>

            <div
              v-if="iconModal.allowOnline && iconModal.total > iconModal.limit"
              class="flex items-center justify-between text-xs text-gray-600 dark:text-neutral-300"
            >
              <span>
                Showing {{ Math.min(iconModal.total, iconModal.start + 1) }}–{{ Math.min(iconModal.total, iconModal.start + iconModal.limit) }}
                of {{ iconModal.total }}
              </span>

              <div class="inline-flex gap-2">
                <button
                  type="button"
                  class="rounded-xl border border-gray-200 px-3 py-2 font-bold disabled:opacity-50 dark:border-neutral-700"
                  :disabled="iconModal.start === 0 || iconModal.loading"
                  @click="prevPage"
                >
                  Prev
                </button>
                <button
                  type="button"
                  class="rounded-xl border border-gray-200 px-3 py-2 font-bold disabled:opacity-50 dark:border-neutral-700"
                  :disabled="iconModal.start + iconModal.limit >= iconModal.total || iconModal.loading"
                  @click="nextPage"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Sticky Save Bar -->
    <div class="fixed inset-x-3 bottom-3 z-[90] xl:left-[370px] xl:right-8">
      <div class="flex flex-col gap-3 rounded-[24px] border border-gray-200 bg-white p-3 shadow-[0_-18px_50px_-28px_rgba(15,23,42,0.35)] dark:border-neutral-800 dark:bg-neutral-950 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <div
            class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl"
            :class="saving
              ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300'
              : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'"
          >
            <Icon
              :icon="saving ? 'lucide:loader-circle' : 'lucide:badge-check'"
              class="h-5 w-5"
              :class="saving ? 'animate-spin' : ''"
            />
          </div>

          <div class="min-w-0">
            <p class="text-sm font-black text-gray-900 dark:text-white">
              {{ saving ? 'Menyimpan perubahan...' : 'Perubahan siap disimpan' }}
            </p>
          </div>
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <button
            type="button"
            class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            :disabled="saving"
            @click="resetToDefault"
          >
            <Icon icon="lucide:rotate-ccw" class="h-4 w-4" />
            <span class="hidden sm:inline">Isi Default</span>
            <span class="sm:hidden">Default</span>
          </button>

          <button
            type="button"
            class="inline-flex h-11 min-w-[120px] items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="saving"
            @click="save"
          >
            <Icon
              :icon="saving ? 'lucide:loader-circle' : 'lucide:save'"
              class="h-4 w-4"
              :class="saving ? 'animate-spin' : ''"
            />
            {{ saving ? 'Saving...' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { reactive, ref, watch } from 'vue'
import { useWeb } from '~/composables/data/useWeb'

type Reason = {
  title: string
  desc: string
  icon: string
}

type Mission = {
  title: string
  desc: string
  icon: string
}

type Shape = {
  headingPrefix: string
  brandText: string
  subtitle: string
  reasons: Reason[]
  visi: string
  misi: Mission[]
  profilHref: string
}

type Target = {
  kind: 'reasons' | 'misi'
  index: number
}

const props = defineProps<{
  section: {
    id: string
    key: string
    props?: Partial<Shape>
  }
  pagePath?: string
}>()

const tabs = [
  { key: 'Konten', label: 'Konten', icon: 'lucide:type' },
  { key: 'Reasons', label: 'Alasan', icon: 'lucide:sparkles' },
  { key: 'Visi & Misi', label: 'Visi & Misi', icon: 'lucide:target' }
] as const

type TabKey = typeof tabs[number]['key']

const activeTab = ref<TabKey>('Konten')

const defaults: Shape = {
  headingPrefix: 'Kenapa Memilih',
  brandText: 'Pondok Al-Inayah',
  subtitle: 'Perpaduan diniyah dan umum, pembinaan akhlak, serta layanan digital yang memudahkan wali santri.',
  reasons: [
    {
      title: 'Pusat Pendidikan Akhlaq dan Ilmu Pengetahuan',
      desc: 'Membentuk generasi berilmu dan berakhlak mulia sebagai bekal kehidupan.',
      icon: 'ph:student'
    },
    {
      title: 'Integrasi Ilmu Agama dan Umum',
      desc: 'Menggabungkan kurikulum agama dan umum secara harmonis dan seimbang.',
      icon: 'ph:book-open-text'
    },
    {
      title: 'Pendidikan Salaf dan Modern yang Terpadu',
      desc: 'Memadukan metode tradisional pesantren dan pendekatan modern berbasis teknologi.',
      icon: 'ph:chalkboard-teacher'
    },
    {
      title: 'Pembelajaran Siswa Aktif dengan Presentasi',
      desc: 'Mendorong siswa berperan aktif melalui diskusi, presentasi, dan praktik langsung.',
      icon: 'ph:megaphone'
    },
    {
      title: 'Program Cepat Belajar Kitab Kuning Metode Amtsilati',
      desc: 'Pendekatan sistematis untuk memahami kitab kuning dengan lebih cepat dan mudah.',
      icon: 'ph:book-bookmark'
    },
    {
      title: 'Pesantren yang Asri dan Bersih',
      desc: 'Lingkungan hijau, fasilitas terawat, serta budaya menjaga kebersihan dan kenyamanan.',
      icon: 'ph:leaf'
    }
  ],
  visi: 'Mencetak generasi berilmu, berakhlak karimah, dan berdaya saing global berlandaskan Al-Qur’an dan Sunnah.',
  misi: [
    {
      title: 'Manajemen Terpadu',
      desc: 'Menerapkan sistem manajemen terpadu untuk mewujudkan tata kelola pesantren yang efektif dan efisien.',
      icon: 'ph:gear-six'
    },
    {
      title: 'Pendidikan Islam Terpadu',
      desc: 'Menerapkan pendidikan Islam terpadu yang berorientasi pada pembentukan akhlaq mulia.',
      icon: 'ph:book-open-text'
    },
    {
      title: 'Jaringan Kerja Sama',
      desc: 'Mengembangkan dan meningkatkan jaringan kerja sama dengan berbagai pihak secara berkelanjutan.',
      icon: 'ph:handshake'
    },
    {
      title: 'Hubungan Kekeluargaan',
      desc: 'Meningkatkan hubungan kekeluargaan yang harmonis antar santri, pengasuh, dan masyarakat.',
      icon: 'ph:users-three'
    },
    {
      title: 'Kreatifitas & Kemandirian',
      desc: 'Mendorong kreatifitas dan kemandirian santri melalui program inovatif dan kewirausahaan.',
      icon: 'ph:lightbulb'
    },
    {
      title: 'Pengembangan Potensi',
      desc: 'Mengembangkan potensi yang dimiliki untuk dimanfaatkan sebagai sumber daya yang bermanfaat.',
      icon: 'ph:plant'
    }
  ],
  profilHref: '/profile'
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

function merge(base: Shape, patch: Partial<Shape>): Shape {
  return {
    headingPrefix: patch.headingPrefix ?? base.headingPrefix,
    brandText: patch.brandText ?? base.brandText,
    subtitle: patch.subtitle ?? base.subtitle,
    reasons: Array.isArray(patch.reasons) && patch.reasons.length
      ? clone(patch.reasons)
      : clone(base.reasons),
    visi: patch.visi ?? base.visi,
    misi: Array.isArray(patch.misi) && patch.misi.length
      ? clone(patch.misi)
      : clone(base.misi),
    profilHref: patch.profilHref ?? base.profilHref
  }
}

const form = reactive<Shape>(merge(defaults, props.section?.props || {}))

const savedNote = ref('')
const errNote = ref('')
const saving = ref(false)

watch(
  () => props.section?.props,
  (nextProps) => {
    Object.assign(form, merge(defaults, nextProps || {}))
  }
)

const webApi = useWeb()

watch(
  () => props.pagePath,
  (pagePath) => {
    ;(webApi as any)?.setActivePath?.(pagePath)
  },
  { immediate: true }
)

const { updateSection } = webApi

function clearSavedNote() {
  setTimeout(() => {
    savedNote.value = ''
  }, 1500)
}

async function save() {
  try {
    saving.value = true
    errNote.value = ''

    await updateSection(props.section.id, {
      props: clone(form)
    })

    savedNote.value = 'Tersimpan.'
    clearSavedNote()
  } catch (error: any) {
    errNote.value = error?.message || 'Gagal menyimpan.'
  } finally {
    saving.value = false
  }
}

function resetToDefault() {
  Object.assign(form, clone(defaults))
  activeTab.value = 'Konten'
  savedNote.value = 'Form dikembalikan ke default.'
  clearSavedNote()
}

function addReason() {
  form.reasons.push({
    title: 'Judul Keunggulan',
    desc: 'Tulis deskripsi singkat keunggulan di sini.',
    icon: 'ph:info'
  })
}

function removeReason(index: number) {
  form.reasons.splice(index, 1)
}

function addMission() {
  form.misi.push({
    title: 'Misi',
    desc: 'Tulis deskripsi singkat misi di sini.',
    icon: 'ph:check-circle'
  })
}

function removeMission(index: number) {
  form.misi.splice(index, 1)
}

/* ===== Icon Picker ===== */
const iconModal = reactive({
  show: false,
  tabs: ['Local', 'Online'] as const,
  activeTab: 'Local' as 'Local' | 'Online',
  query: '',
  visible: [] as string[],
  allowOnline: true,
  loading: false,
  total: 0,
  limit: 72,
  start: 0,
  controller: null as AbortController | null,
  target: null as Target | null,
  localAll: [
    'ph:student',
    'ph:book-open-text',
    'ph:chalkboard-teacher',
    'ph:megaphone',
    'ph:book-bookmark',
    'ph:leaf',
    'ph:gear-six',
    'ph:handshake',
    'ph:users-three',
    'ph:lightbulb',
    'ph:plant',
    'ph:calendar-check',
    'ph:check-circle',
    'ph:info',
    'lucide:search',
    'lucide:home',
    'lucide:book',
    'lucide:school',
    'lucide:leaf',
    'lucide:users',
    'lucide:bolt',
    'mdi:school-outline',
    'mdi:book-open-variant',
    'mdi:handshake-outline',
    'mdi:leaf',
    'mdi:account-group-outline',
    'mdi:lightbulb-on-outline',
    'tabler:book-2',
    'tabler:leaf',
    'tabler:users',
    'tabler:sparkles',
    'tabler:certificate',
    'material-symbols:school-outline',
    'material-symbols:library-books-outline',
    'ic:baseline-emoji-people'
  ] as string[]
})

function openIconPicker(target: Target) {
  iconModal.target = target
  iconModal.show = true
  iconModal.activeTab = 'Local'
  iconModal.query = ''
  iconModal.start = 0
  iconModal.total = 0
  filterLocal()
}

function closeIconPicker() {
  try {
    iconModal.controller?.abort?.()
  } catch {}

  iconModal.controller = null
  iconModal.show = false
  iconModal.visible = []
  iconModal.query = ''
  iconModal.total = 0
  iconModal.start = 0
  iconModal.target = null
}

function chooseIcon(name: string) {
  if (!iconModal.target) return

  if (iconModal.target.kind === 'reasons') {
    if (form.reasons[iconModal.target.index]) {
      form.reasons[iconModal.target.index]!.icon = name
    }
  }

  if (iconModal.target.kind === 'misi') {
    if (form.misi[iconModal.target.index]) {
      form.misi[iconModal.target.index]!.icon = name
    }
  }

  closeIconPicker()
}

function setIconTab(tab: 'Local' | 'Online') {
  iconModal.activeTab = tab

  if (tab === 'Local') {
    filterLocal()
  } else {
    searchOnline(true)
  }
}

function filterLocal() {
  const query = iconModal.query.trim().toLowerCase()
  const base = iconModal.localAll

  iconModal.visible = query
    ? base.filter((name) => name.toLowerCase().includes(query))
    : base.slice(0, iconModal.limit)

  iconModal.total = iconModal.visible.length
}

function onSearchInput() {
  iconModal.start = 0

  if (iconModal.activeTab === 'Local') {
    filterLocal()
  } else {
    searchOnline(true)
  }
}

let searchDebounce: any = null

async function searchOnline(reset = true) {
  if (!iconModal.allowOnline) return
  if (typeof window === 'undefined') return

  const query = iconModal.query.trim()

  if (!query) {
    filterLocal()
    return
  }

  if (reset) {
    iconModal.start = 0
    iconModal.total = 0
  }

  if (searchDebounce) {
    window.clearTimeout(searchDebounce)
  }

  searchDebounce = window.setTimeout(async () => {
    try {
      iconModal.controller?.abort?.()
    } catch {}

    iconModal.controller = new AbortController()
    iconModal.loading = true

    try {
      const prefixes = ['mdi', 'tabler', 'material-symbols', 'ic', 'ph', 'lucide']

      const url =
        `https://api.iconify.design/search` +
        `?query=${encodeURIComponent(query)}` +
        `&limit=${encodeURIComponent(iconModal.limit)}` +
        `&start=${encodeURIComponent(iconModal.start)}` +
        `&prefixes=${encodeURIComponent(prefixes.join(','))}`

      const response = await fetch(url, {
        headers: {
          Accept: 'application/json'
        },
        signal: iconModal.controller.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json() as {
        icons?: string[]
        total?: number
        limit?: number
        start?: number
      }

      const hits = Array.isArray(data.icons) ? data.icons : []

      iconModal.visible = hits
      iconModal.total = Number(data.total || hits.length || 0)

      if (typeof data.limit === 'number') {
        iconModal.limit = data.limit
      }

      if (typeof data.start === 'number') {
        iconModal.start = data.start
      }

      if (!hits.length) {
        filterLocal()
      }
    } catch (error: any) {
      if (error?.name !== 'AbortError') {
        console.error('Iconify /search error:', error)
        filterLocal()
      }
    } finally {
      iconModal.loading = false
    }
  }, 220)
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