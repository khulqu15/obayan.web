<template>
  <div class="min-h-full bg-transparent pb-28 text-gray-800 dark:text-neutral-200">
    <div class="mx-auto max-w-[1760px] space-y-6 p-4 md:p-6">
      <!-- Hero -->
      <section class="relative overflow-hidden rounded-[36px] border border-green-100 bg-gradient-to-br from-green-600 via-emerald-600 to-lime-500 p-5 text-white shadow-[0_24px_60px_-18px_rgba(22,163,74,0.38)] md:p-7">
        <div class="pointer-events-none absolute inset-0 opacity-20">
          <div class="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white blur-3xl"></div>
          <div class="absolute bottom-0 left-8 h-36 w-36 rounded-full bg-lime-100 blur-3xl"></div>
        </div>

        <div class="relative z-10 grid gap-6 xl:grid-cols-[1.15fr,0.85fr] xl:items-end">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold ring-1 ring-white/20 backdrop-blur">
              <span class="inline-block h-2 w-2 rounded-full bg-lime-300"></span>
              Navbar Editor Workspace
            </div>

            <h1 class="mt-4 text-2xl font-black tracking-tight md:text-4xl">
              Navbar Editor
            </h1>

            <p class="mt-3 max-w-2xl text-sm leading-6 text-green-50/95 md:text-base">
              Kelola brand, cover, tautan utama, mega menu, PPDB CTA, dan tombol aksi dengan layout editor yang lebih rapi, responsif, dan nyaman digunakan.
            </p>
          </div>

          <div class="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4">
            <StatCard label="Nav Links" :value="String(form.navLinks.length)" hint="tautan utama" />
            <StatCard label="Mega Menu" :value="String(totalMegaItems)" hint="item terkelola" />
            <StatCard label="CTA" :value="String(form.ctaButtons.length)" hint="tombol aktif" />
            <StatCard label="Status" :value="isDirty ? 'Draft' : 'Sinkron'" :hint="externalChanged ? 'ada update eksternal' : 'aman'" />
          </div>
        </div>
      </section>

      <!-- Alert -->
      <div v-if="note || uploadError" class="rounded-[24px] border px-4 py-3 text-sm font-semibold"
        :class="ok
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/10 dark:text-emerald-300'
          : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300'"
      >
        {{ note || uploadError }}
      </div>

      <!-- Main Layout -->
      <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr),420px]">
        <!-- Left Editor -->
        <div class="space-y-6">
          <!-- Brand + Cover -->
          <section class="rounded-[34px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <SectionHeader
              title="Brand & Cover"
              subtitle="Atur identitas navbar dan gambar showcase utama."
              icon="lucide:sparkles"
              badge="Identity"
            />

            <div class="mt-5 grid gap-5 lg:grid-cols-[0.88fr,1.12fr]">
              <div class="grid content-start gap-4">
                <Field label="Nama Brand">
                  <input v-model.trim="form.brand" :class="inputBase" placeholder="Pondok Pesantren ALINAYAH" />
                </Field>

                <Field label="Brand Short">
                  <input v-model.trim="form.brandShorten" :class="inputBase" placeholder="ALINAYAH" />
                </Field>
              </div>

              <ImagePickerCard
                title="Cover Ponpes"
                subtitle="Visual utama untuk showcase / hero navbar."
                input-id="navbar-cover-ponpes"
                :src="form.coverPonpes"
                :draft="mediaDraft.coverPonpes"
                :mode="mediaMode.coverPonpes"
                :busy="uploading"
                :target-active="uploadTarget === 'coverPonpes'"
                @change-mode="mediaMode.coverPonpes = $event"
                @update-draft="mediaDraft.coverPonpes = $event"
                @upload="onUploadCoverPonpes"
                @apply-url="applyMediaUrl('coverPonpes')"
                @remove="removeMedia('coverPonpes')"
              />
            </div>
          </section>

          <!-- Nav Links -->
          <section class="rounded-[34px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <SectionHeader
              title="Nav Links"
              subtitle="Tautan utama yang tampil pada navbar desktop dan mobile."
              icon="lucide:menu"
              badge="Main Nav"
            >
              <button
                type="button"
                class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                @click="addLink"
              >
                <Icon icon="lucide:plus" class="h-4 w-4" />
                Tambah Link
              </button>
            </SectionHeader>

            <div class="mt-5 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              <article
                v-for="(link, i) in form.navLinks"
                :key="`nav-link-${i}`"
                class="rounded-[28px] border border-gray-200 bg-gray-50 p-4 transition hover:border-green-200 hover:bg-green-50/40 dark:border-neutral-800 dark:bg-neutral-800/60 dark:hover:border-green-900/50 dark:hover:bg-green-900/10"
              >
                <div class="mb-4 flex items-start justify-between gap-3">
                  <div class="flex min-w-0 items-center gap-3">
                    <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-green-700 ring-1 ring-black/5 dark:bg-neutral-900 dark:text-green-300 dark:ring-white/10">
                      <Icon :icon="link.icon || 'ph:dot-outline'" class="h-5 w-5" />
                    </div>

                    <div class="min-w-0">
                      <p class="truncate text-sm font-black text-gray-900 dark:text-white">
                        {{ link.label || `Link ${i + 1}` }}
                      </p>
                      <p class="mt-0.5 truncate text-xs text-gray-500 dark:text-neutral-400">
                        {{ link.href || '#' }}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    class="grid h-9 w-9 place-items-center rounded-2xl border border-rose-200 bg-white text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10"
                    @click="removeLink(i)"
                  >
                    <Icon icon="lucide:trash-2" class="h-4 w-4" />
                  </button>
                </div>

                <div class="grid gap-3">
                  <input v-model.trim="link.label" :class="inputBase" placeholder="Label" />
                  <input v-model.trim="link.href" :class="inputBase" placeholder="/path#anchor" />

                  <button
                    type="button"
                    class="inline-flex h-11 items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="openIconPicker((icon) => (link.icon = icon))"
                  >
                    <span class="inline-flex min-w-0 items-center gap-2">
                      <Icon :icon="link.icon || 'ph:square'" class="h-4 w-4 shrink-0" />
                      <span class="truncate">{{ link.icon || 'Pilih Icon' }}</span>
                    </span>
                    <Icon icon="lucide:chevron-down" class="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </article>
            </div>
          </section>

          <!-- Mega Menu -->
          <section class="rounded-[34px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <SectionHeader
              title="Mega Menu"
              subtitle="Kelompokkan item agar struktur navigasi besar tetap mudah dikelola."
              icon="lucide:panel-top"
              badge="Dropdown"
            >
              <button
                type="button"
                class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                @click="addGroup"
              >
                <Icon icon="lucide:plus" class="h-4 w-4" />
                Tambah Grup
              </button>
            </SectionHeader>

            <div class="mt-5 grid gap-5">
              <article
                v-for="(group, gidx) in form.megaMenu"
                :key="`mega-group-${gidx}`"
                class="overflow-hidden rounded-[30px] border border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-800/60"
              >
                <div class="border-b border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                  <div class="grid gap-3 lg:grid-cols-[minmax(0,1fr),auto] lg:items-end">
                    <Field label="Judul Grup">
                      <input v-model.trim="group.title" :class="inputBase" placeholder="Pendidikan" />
                    </Field>

                    <div class="flex flex-wrap gap-2">
                      <button
                        type="button"
                        class="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        @click="addItem(gidx)"
                      >
                        Tambah Item
                      </button>

                      <button
                        type="button"
                        class="inline-flex h-11 items-center justify-center rounded-2xl bg-rose-600 px-4 text-sm font-bold text-white transition hover:bg-rose-700"
                        @click="removeGroup(gidx)"
                      >
                        Hapus Grup
                      </button>
                    </div>
                  </div>
                </div>

                <div class="grid gap-3 p-4 lg:grid-cols-2 2xl:grid-cols-3">
                  <article
                    v-for="(item, idx) in group.items"
                    :key="`mega-item-${gidx}-${idx}`"
                    class="group rounded-[24px] border border-gray-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <div class="flex items-start gap-3">
                      <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                        <Icon :icon="item.icon || 'ph:square'" class="h-5 w-5" />
                      </div>

                      <div class="min-w-0 flex-1">
                        <div class="truncate text-sm font-black text-gray-900 dark:text-white">
                          {{ item.label || 'Item tanpa judul' }}
                        </div>
                        <div class="mt-1 line-clamp-2 text-xs leading-5 text-gray-500 dark:text-neutral-400">
                          {{ item.desc || 'Belum ada deskripsi' }}
                        </div>
                        <div class="mt-1 truncate text-[11px] font-semibold text-green-700 dark:text-green-300">
                          {{ item.href || '#' }}
                        </div>
                      </div>
                    </div>

                    <div class="mt-4 flex gap-2">
                      <button
                        type="button"
                        class="inline-flex h-10 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        @click="openItemModal(gidx, idx)"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        class="inline-flex h-10 items-center justify-center rounded-2xl bg-rose-600 px-3 text-xs font-bold text-white transition hover:bg-rose-700"
                        @click="removeItem(gidx, idx)"
                      >
                        Hapus
                      </button>
                    </div>
                  </article>
                </div>
              </article>
            </div>
          </section>

          <!-- PPDB + CTA -->
          <section class="rounded-[34px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <SectionHeader
              title="PPDB CTA & Tombol"
              subtitle="Atur call-to-action utama dan tombol tambahan di area kanan navbar."
              icon="lucide:mouse-pointer-click"
              badge="Action"
            />

            <div class="mt-5 grid gap-6 xl:grid-cols-[minmax(0,1fr),minmax(360px,0.9fr)]">
              <div class="space-y-4">
                <Field label="PPDB Title">
                  <input v-model.trim="form.ppdbCta.title" :class="inputBase" />
                </Field>

                <Field label="PPDB Description">
                  <textarea v-model.trim="form.ppdbCta.desc" rows="4" :class="inputBase"></textarea>
                </Field>

                <Field label="PPDB Link">
                  <input v-model.trim="form.ppdbCta.href" :class="inputBase" />
                </Field>

                <ImagePickerCard
                  title="Gambar PPDB"
                  subtitle="Gambar untuk card CTA pendaftaran."
                  input-id="navbar-ppdb-image"
                  :src="form.ppdbCta.image"
                  :draft="mediaDraft.ppdbCta"
                  :mode="mediaMode.ppdbCta"
                  :busy="uploading"
                  :target-active="uploadTarget === 'ppdbCta'"
                  @change-mode="mediaMode.ppdbCta = $event"
                  @update-draft="mediaDraft.ppdbCta = $event"
                  @upload="onUploadPPDB"
                  @apply-url="applyMediaUrl('ppdbCta')"
                  @remove="removeMedia('ppdbCta')"
                />
              </div>

              <div class="space-y-4">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <h4 class="text-base font-black text-gray-900 dark:text-white">
                      CTA Buttons
                    </h4>
                    <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                      Tombol tambahan pada navbar.
                    </p>
                  </div>

                  <button
                    type="button"
                    class="inline-flex h-10 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-xs font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="addCTA"
                  >
                    Tambah CTA
                  </button>
                </div>

                <div class="grid gap-3">
                  <article
                    v-for="(button, i) in form.ctaButtons"
                    :key="`cta-${i}`"
                    class="rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
                  >
                    <div class="grid gap-3">
                      <select v-model="button.style" :class="inputBase">
                        <option value="primary">primary</option>
                        <option value="outline">outline</option>
                      </select>

                      <input v-model.trim="button.label" :class="inputBase" placeholder="Label" />
                      <input v-model.trim="button.href" :class="inputBase" placeholder="/route" />

                      <button
                        type="button"
                        class="inline-flex h-10 items-center justify-center rounded-2xl bg-rose-600 px-3 text-xs font-bold text-white transition hover:bg-rose-700"
                        @click="removeCTA(i)"
                      >
                        Hapus CTA
                      </button>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Preview -->
        <aside class="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <section class="rounded-[34px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <SectionHeader
              title="Live Preview"
              subtitle="Pratinjau ringkas navbar dan mega menu."
              icon="lucide:eye"
              badge="Preview"
            />

            <div class="mt-5 overflow-hidden rounded-[30px] border border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-800/60">
              <div class="border-b border-gray-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900">
                <div class="flex flex-wrap items-center gap-3">
                  <div class="truncate text-lg font-black tracking-tight text-gray-900 dark:text-white">
                    {{ form.brandShorten || 'BRAND' }}
                  </div>

                  <div class="ml-auto flex flex-wrap items-center gap-2">
                    <span
                      v-for="(link, i) in previewLinks"
                      :key="`preview-link-${i}`"
                      class="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] font-bold text-gray-700 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                    >
                      {{ link.label || 'Label' }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="p-4">
                <div class="aspect-[16/9] overflow-hidden rounded-[26px] bg-gray-100 dark:bg-neutral-800">
                  <img v-if="form.coverPonpes" :src="form.coverPonpes" alt="Preview cover" class="h-full w-full object-cover" />
                  <div v-else class="grid h-full place-items-center text-sm text-gray-500 dark:text-neutral-400">
                    Belum ada cover utama
                  </div>
                </div>

                <div class="mt-4 grid gap-3">
                  <article
                    v-for="group in previewGroups"
                    :key="`preview-group-${group.title}`"
                    class="rounded-[24px] border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <div class="text-sm font-black text-gray-900 dark:text-white">
                      {{ group.title || 'Group' }}
                    </div>

                    <div class="mt-3 space-y-2">
                      <div
                        v-for="item in group.items.slice(0, 3)"
                        :key="`${item.label}-${item.href}`"
                        class="flex items-start gap-3 rounded-2xl bg-gray-50 p-2 dark:bg-neutral-800"
                      >
                        <div class="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                          <Icon :icon="item.icon || 'ph:square'" class="h-4 w-4" />
                        </div>

                        <div class="min-w-0">
                          <div class="truncate text-sm font-bold text-gray-900 dark:text-white">
                            {{ item.label || 'Item' }}
                          </div>
                          <div class="truncate text-xs text-gray-500 dark:text-neutral-400">
                            {{ item.desc || 'Tanpa deskripsi' }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>

                <div class="mt-4 rounded-[26px] border border-green-100 bg-green-50/80 p-4 dark:border-green-900/30 dark:bg-green-900/10">
                  <div class="text-sm font-black text-green-800 dark:text-green-200">
                    {{ form.ppdbCta.title || 'PPDB CTA' }}
                  </div>

                  <div class="mt-1 text-sm leading-6 text-green-700 dark:text-green-300">
                    {{ form.ppdbCta.desc || 'Deskripsi CTA akan tampil di sini.' }}
                  </div>

                  <div class="mt-3 flex flex-wrap gap-2">
                    <span
                      v-for="(button, i) in form.ctaButtons"
                      :key="`preview-cta-${i}`"
                      class="rounded-full px-3 py-1.5 text-[11px] font-bold"
                      :class="button.style === 'primary'
                        ? 'bg-green-600 text-white'
                        : 'border border-green-300 text-green-800 dark:border-green-700 dark:text-green-200'"
                    >
                      {{ button.label || 'CTA' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="rounded-[34px] border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <SectionHeader
              title="Ringkasan"
              subtitle="Status struktur navbar saat ini."
              icon="lucide:list-checks"
              badge="Info"
            />

            <div class="mt-5 grid gap-3">
              <SummaryRow label="Brand" :value="form.brand || 'Belum diisi'" />
              <SummaryRow label="Mega Menu" :value="`${form.megaMenu.length} grup · ${totalMegaItems} item`" />
              <SummaryRow label="Upload" :value="uploading ? 'Sedang upload...' : 'Siap digunakan'" />
              <SummaryRow label="Status" :value="isDirty ? 'Perubahan belum disimpan' : 'Tersimpan'" />
            </div>
          </section>
        </aside>
      </section>
    </div>

    <!-- Fixed Bottom Action Bar -->
    <div class="fixed inset-x-3 bottom-3 z-[90] xl:left-[370px] xl:right-8">
      <div class="flex flex-col gap-3 rounded-[28px] border border-gray-200 bg-white/95 p-3 shadow-[0_-18px_60px_-28px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/95 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex min-w-0 items-center gap-3">
          <div
            class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
            :class="saving || uploading
              ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300'
              : isDirty
                ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300'
                : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'"
          >
            <Icon
              :icon="saving || uploading ? 'lucide:loader-circle' : isDirty ? 'lucide:triangle-alert' : 'lucide:badge-check'"
              class="h-5 w-5"
              :class="saving || uploading ? 'animate-spin' : ''"
            />
          </div>

          <div class="min-w-0">
            <p class="truncate text-sm font-black text-gray-900 dark:text-white">
              {{ saving ? 'Menyimpan perubahan...' : uploading ? 'Mengunggah gambar...' : 'Workspace Aksi' }}
            </p>
            <p class="truncate text-xs text-gray-500 dark:text-neutral-400">
              {{ isDirty ? 'Perubahan belum disimpan' : 'Perubahan tersimpan' }}
              <span v-if="externalChanged"> · Ada update eksternal</span>
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:flex sm:shrink-0 sm:items-center">
          <button
            type="button"
            class="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 text-xs font-black text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 sm:px-4 sm:text-sm"
            :disabled="saving || uploading"
            @click="resetToDefault"
          >
            Default
          </button>

          <button
            type="button"
            class="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 text-xs font-black text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 sm:px-4 sm:text-sm"
            :disabled="saving || uploading"
            @click="reloadFromDatabase"
          >
            Muat Ulang
          </button>

          <button
            type="button"
            class="inline-flex h-11 items-center justify-center rounded-2xl bg-green-600 px-3 text-xs font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[150px] sm:px-5 sm:text-sm"
            :disabled="saving || uploading || !isDirty"
            @click="saveAll"
          >
            {{ saving ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Mega Item Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="modal.open" class="fixed inset-0 z-[100]">
          <div class="absolute inset-0 bg-black/55 backdrop-blur-sm" @click="closeItemModal" />

          <div class="absolute inset-0 overflow-y-auto p-4 md:p-8">
            <div class="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-[34px] border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
              <div class="sticky top-0 z-10 border-b border-gray-200 bg-white/95 p-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3 class="text-base font-black text-gray-900 dark:text-white">
                      Edit Mega Menu Item
                    </h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                      Atur label, deskripsi, link, icon, dan cover item.
                    </p>
                  </div>

                  <button
                    type="button"
                    class="grid h-10 w-10 place-items-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="closeItemModal"
                  >
                    <Icon icon="lucide:x" class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div class="grid gap-0 lg:grid-cols-[1fr,0.88fr]">
                <div class="space-y-4 p-5">
                  <Field label="Label">
                    <input v-model.trim="itemDraft.label" :class="inputBase" />
                  </Field>

                  <Field label="Deskripsi">
                    <textarea v-model.trim="itemDraft.desc" rows="4" :class="inputBase"></textarea>
                  </Field>

                  <Field label="Link">
                    <input v-model.trim="itemDraft.href" :class="inputBase" placeholder="#" />
                  </Field>

                  <div class="rounded-[26px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                    <div class="flex items-center justify-between gap-3">
                      <div>
                        <div class="text-sm font-black text-gray-900 dark:text-white">Icon Item</div>
                        <div class="mt-1 text-xs text-gray-500 dark:text-neutral-400">Pilih icon yang paling relevan.</div>
                      </div>

                      <button
                        type="button"
                        class="inline-flex h-10 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        @click="openIconPicker((icon) => (itemDraft.icon = icon))"
                      >
                        Pilih Icon
                      </button>
                    </div>

                    <div class="mt-4 flex items-center gap-3">
                      <div class="grid h-12 w-12 place-items-center rounded-2xl bg-white text-gray-700 ring-1 ring-black/5 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-white/10">
                        <Icon :icon="itemDraft.icon || 'ph:square'" class="h-5 w-5" />
                      </div>
                      <div class="truncate text-sm text-gray-500 dark:text-neutral-400">
                        {{ itemDraft.icon || 'Belum dipilih' }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="border-t border-gray-200 p-5 dark:border-neutral-800 lg:border-l lg:border-t-0">
                  <ImagePickerCard
                    title="Cover Item"
                    subtitle="Cover khusus untuk item mega menu."
                    input-id="navbar-item-cover"
                    :src="itemDraft.cover || ''"
                    :draft="mediaDraft.itemCover"
                    :mode="mediaMode.itemCover"
                    :busy="uploading"
                    :target-active="uploadTarget === 'itemCover'"
                    @change-mode="mediaMode.itemCover = $event"
                    @update-draft="mediaDraft.itemCover = $event"
                    @upload="onUploadItemCover"
                    @apply-url="applyMediaUrl('itemCover')"
                    @remove="removeMedia('itemCover')"
                  />

                  <div class="mt-4 rounded-[26px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                    <div class="text-sm font-black text-gray-900 dark:text-white">Preview Item</div>

                    <div class="mt-4 flex items-start gap-3">
                      <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                        <Icon :icon="itemDraft.icon || 'ph:square'" class="h-5 w-5" />
                      </div>

                      <div class="min-w-0">
                        <div class="truncate text-sm font-black text-gray-900 dark:text-white">
                          {{ itemDraft.label || 'Item' }}
                        </div>
                        <div class="mt-1 text-sm leading-6 text-gray-600 dark:text-neutral-300">
                          {{ itemDraft.desc || 'Deskripsi item akan tampil di sini.' }}
                        </div>
                        <div class="mt-2 truncate text-xs text-gray-500 dark:text-neutral-400">
                          {{ itemDraft.href || '#' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="sticky bottom-0 z-10 border-t border-gray-200 bg-white/95 p-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95">
                <div class="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    class="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="closeItemModal"
                  >
                    Batal
                  </button>

                  <button
                    type="button"
                    class="inline-flex h-11 items-center justify-center rounded-2xl bg-green-600 px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                    @click="applyItemModal"
                  >
                    Simpan Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Icon Picker -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="iconPicker.open" class="fixed inset-0 z-[110]">
          <div class="absolute inset-0 bg-black/55 backdrop-blur-sm" @click="closeIconPicker" />

          <div class="absolute inset-0 overflow-y-auto p-4 md:p-8">
            <div class="mx-auto flex max-w-4xl flex-col overflow-hidden rounded-[34px] border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
              <div class="sticky top-0 z-10 border-b border-gray-200 bg-white/95 p-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95">
                <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 class="text-base font-black text-gray-900 dark:text-white">Pilih Icon</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Cari icon dari Iconify API.</p>
                  </div>

                  <button
                    type="button"
                    class="grid h-10 w-10 place-items-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="closeIconPicker"
                  >
                    <Icon icon="lucide:x" class="h-4 w-4" />
                  </button>
                </div>

                <div class="mt-4 flex gap-2">
                  <input
                    v-model.trim="iconPicker.query"
                    @keydown.enter.prevent="searchIcons"
                    class="block flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    placeholder="Cari mis. book, home, school"
                  />

                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="iconPicker.loading"
                    @click="searchIcons"
                  >
                    {{ iconPicker.loading ? 'Mencari...' : 'Cari' }}
                  </button>
                </div>
              </div>

              <div class="min-h-0 flex-1 overflow-y-auto p-4">
                <div v-if="iconPicker.loading" class="text-sm text-gray-500 dark:text-neutral-400">Memuat ikon...</div>

                <div v-else class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                  <button
                    v-for="icon in iconPicker.results"
                    :key="icon"
                    type="button"
                    class="group rounded-[22px] border border-gray-200 bg-gray-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-800/60 dark:hover:bg-neutral-800"
                    @click="selectIcon(icon)"
                  >
                    <div class="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-gray-700 ring-1 ring-black/5 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-white/10">
                      <Icon :icon="icon" class="h-5 w-5" />
                    </div>
                    <div class="mt-3 truncate text-[11px] font-medium text-gray-600 dark:text-neutral-300">{{ icon }}</div>
                  </button>
                </div>

                <p v-if="!iconPicker.loading && !iconPicker.results.length" class="mt-6 text-center text-sm text-gray-500 dark:text-neutral-400">
                  Belum ada hasil pencarian.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, defineComponent, h, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { off, onValue, ref as dbRef, set } from 'firebase/database'
import { useCloudinaryUpload } from '~/composables/useCloudinaryUpload'
import { useNuxtApp, useHead, useRuntimeConfig } from 'nuxt/app'

const config = useRuntimeConfig()

const clientName = String(config.public.clientName || 'alinayah')
const clientDisplayName = String(config.public.clientDisplayName || clientName)
const appLogo = String(config.public.appLogo || '/assets/logo.png')

const clientTitle = clientDisplayName
  .split(' ')
  .filter(Boolean)
  .join(' ')

const clientUpperName = clientTitle.toUpperCase()

useHead({
  title: `Navbar Editor | ${clientTitle}`,
  link: [{ rel: 'icon', href: appLogo }]
})

definePageMeta({
  layout: 'app',
  layoutProps: { title: 'Navbar' },
  ssr: false
})

type MediaKey = 'coverPonpes' | 'ppdbCta' | 'itemCover'
type MediaMode = 'upload' | 'url'

export type NavLink = {
  label: string
  href: string
  icon: string
}

export type MegaItem = {
  label: string
  icon: string
  desc?: string
  href?: string
  cover?: string
}

export type MegaGroup = {
  title: string
  items: MegaItem[]
}

type CtaButton = {
  label: string
  href: string
  style: 'primary' | 'outline'
}

const defaultItem = (): MegaItem => ({
  label: 'Item',
  icon: 'ph:square',
  desc: '',
  href: '#',
  cover: ''
})

const NAVBAR_PATH = `${clientName}/site/navbar`
const CLOUDINARY_NAVBAR_FOLDER = `${clientName}/navbar`
const { $realtimeDb } = useNuxtApp() as any
const { uploadImage, uploading, uploadError } = useCloudinaryUpload()
const modal = reactive({ open: false, gidx: -1, idx: -1 })
const itemDraft = reactive<MegaItem>(defaultItem())
const inputBase =
  'block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:bg-neutral-900'

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

const defaultLinks = (): NavLink[] => [
  { label: 'Beranda', href: '/#home', icon: 'ph:house' },
  { label: 'Tentang', href: '/#information', icon: 'ph:info' },
  { label: 'Fasilitas', href: '/#facility', icon: 'ph:buildings' },
  { label: 'Berita', href: '/#news', icon: 'ph:newspaper' },
  { label: 'Kontak', href: '/#contact', icon: 'ph:phone' }
]

const defaultGroups = (): MegaGroup[] => [
  {
    title: 'Pendidikan',
    items: [
      { label: `SMA ${clientUpperName}`, icon: 'ph:book-open-text', desc: `Sekolah Menengah Atas ${clientUpperName}`, href: '#', cover: '' },
      { label: `SMP ${clientUpperName}`, icon: 'ph:student', desc: `Sekolah Menengah Pertama ${clientUpperName}`, href: '#', cover: '' }
    ]
  },
  {
    title: 'Kegiatan Santri',
    items: [
      { label: 'Kajian Kitab', icon: 'ph:scroll', desc: 'Pendalaman kitab kuning', href: '#', cover: '' },
      { label: 'Muhadhoroh', icon: 'ph:megaphone-simple', desc: 'Latihan pidato & public speaking', href: '#', cover: '' },
      { label: 'Khidmah Sosial', icon: 'ph:handshake', desc: 'Pengabdian & kemasyarakatan', href: '#', cover: '' },
      { label: 'Rihlah / Daurah', icon: 'ph:globe-hemisphere-west', desc: 'Kegiatan luar asrama edukatif', href: '#', cover: '' }
    ]
  },
  {
    title: 'Program Khusus',
    items: [
      { label: 'Tahfidzul Quran', icon: 'mdi:religion-muslim', desc: 'Program penghafalan Al-Quran', href: '#', cover: '' },
      { label: 'Metode Amtsilati', icon: 'hugeicons:muslim', desc: 'Pendalaman nahwu-shorof', href: '#', cover: '' },
      { label: 'Bahasa Arab', icon: 'hugeicons:alphabet-arabic', desc: 'Kelas intensif bahasa Arab', href: '#', cover: '' },
      { label: 'BLK Komunitas TIK', icon: 'fluent:people-community-16-regular', desc: 'Pelatihan digital', href: '#', cover: '' }
    ]
  }
]

const makeDefaultForm = () => ({
  brand: `Pondok Pesantren ${clientUpperName}`,
  brandShorten: clientUpperName,
  coverPonpes: '',
  navLinks: defaultLinks(),
  megaMenu: defaultGroups(),
  ppdbCta: {
    title: 'PPDB Online 2025/2026',
    desc: 'Penerimaan Peserta Didik Baru. Daftar mudah & cepat secara online.',
    href: '/registrationPPDB',
    image: '/assets/images/activity.jpg'
  },
  ctaButtons: [
    { label: 'Login Wali', href: '/waliLogin', style: 'primary' as const }
  ] as CtaButton[]
})

const form = reactive(makeDefaultForm())
const original = ref('')
const saving = ref(false)
const ok = ref(false)
const note = ref('')
const externalChanged = ref(false)
const uploadTarget = ref<MediaKey | ''>('')

let mutedRemoteSync = false
let unsubscribeNavbar: null | (() => void) = null

const mediaMode = reactive<Record<MediaKey, MediaMode>>({
  coverPonpes: 'upload',
  ppdbCta: 'upload',
  itemCover: 'upload'
})

const mediaDraft = reactive<Record<MediaKey, string>>({
  coverPonpes: '',
  ppdbCta: '',
  itemCover: ''
})

const isDirty = computed(() => JSON.stringify(sanitizeForm()) !== original.value)
const totalMegaItems = computed(() => form.megaMenu.reduce((sum, group) => sum + group.items.length, 0))
const previewLinks = computed(() => form.navLinks.slice(0, 4))
const previewGroups = computed(() => form.megaMenu.slice(0, 2))

watch(
  () => form.coverPonpes,
  (value) => {
    mediaDraft.coverPonpes = value || ''
  },
  { immediate: true }
)

watch(
  () => form.ppdbCta.image,
  (value) => {
    mediaDraft.ppdbCta = value || ''
  },
  { immediate: true }
)

watch(
  () => itemDraft.cover,
  (value) => {
    mediaDraft.itemCover = value || ''
  }
)

function applyForm(next: ReturnType<typeof makeDefaultForm>) {
  form.brand = next.brand
  form.brandShorten = next.brandShorten
  form.coverPonpes = next.coverPonpes
  form.navLinks = clone(next.navLinks)
  form.megaMenu = clone(next.megaMenu)
  form.ppdbCta = clone(next.ppdbCta)
  form.ctaButtons = clone(next.ctaButtons)
}

function sanitizeForm(source = form) {
  return {
    brand: String(source.brand || '').trim(),
    brandShorten: String(source.brandShorten || '').trim(),
    coverPonpes: String(source.coverPonpes || '').trim(),
    navLinks: source.navLinks
      .map((link) => ({
        label: String(link.label || '').trim(),
        href: String(link.href || '').trim(),
        icon: String(link.icon || '').trim()
      }))
      .filter((link) => link.label || link.href || link.icon),
    megaMenu: source.megaMenu
      .map((group) => ({
        title: String(group.title || '').trim(),
        items: group.items
          .map((item) => ({
            label: String(item.label || '').trim(),
            icon: String(item.icon || '').trim(),
            desc: String(item.desc || '').trim(),
            href: String(item.href || '').trim(),
            cover: String(item.cover || '').trim()
          }))
          .filter((item) => item.label || item.desc || item.href || item.icon || item.cover)
      }))
      .filter((group) => group.title || group.items.length),
    ppdbCta: {
      title: String(source.ppdbCta.title || '').trim(),
      desc: String(source.ppdbCta.desc || '').trim(),
      href: String(source.ppdbCta.href || '').trim(),
      image: String(source.ppdbCta.image || '').trim()
    },
    ctaButtons: source.ctaButtons
      .map((button) => ({
        label: String(button.label || '').trim(),
        href: String(button.href || '').trim(),
        style: button.style === 'primary' ? 'primary' : 'outline'
      }))
      .filter((button) => button.label || button.href)
  }
}

async function syncFromDatabase() {
  if (!$realtimeDb) return

  if (unsubscribeNavbar) unsubscribeNavbar()

  const navbarRef = dbRef($realtimeDb, NAVBAR_PATH)

  unsubscribeNavbar = onValue(navbarRef, (snapshot) => {
    const raw = snapshot.val()
    const defaults = makeDefaultForm()

    const merged = raw
      ? {
          ...defaults,
          ...raw,
          ppdbCta: {
            ...defaults.ppdbCta,
            ...(raw.ppdbCta || {})
          },
          ctaButtons: Array.isArray(raw.ctaButtons) ? raw.ctaButtons : defaults.ctaButtons,
          navLinks: Array.isArray(raw.navLinks) ? raw.navLinks : defaults.navLinks,
          megaMenu: Array.isArray(raw.megaMenu) ? raw.megaMenu : defaults.megaMenu
        }
      : defaults

    const normalized = sanitizeForm(merged as ReturnType<typeof makeDefaultForm>)

    if (mutedRemoteSync) {
      original.value = JSON.stringify(normalized)
      mutedRemoteSync = false
      return
    }

    if (isDirty.value) {
      externalChanged.value = true
      return
    }

    applyForm(normalized as ReturnType<typeof makeDefaultForm>)
    original.value = JSON.stringify(normalized)
    externalChanged.value = false
  })
}

async function reloadFromDatabase() {
  note.value = ''
  ok.value = false
  externalChanged.value = false
  mutedRemoteSync = false
  await syncFromDatabase()
}

async function saveAll() {
  if (!$realtimeDb) return

  saving.value = true
  note.value = ''
  ok.value = false

  try {
    const payload = sanitizeForm()
    mutedRemoteSync = true

    await set(dbRef($realtimeDb, NAVBAR_PATH), clone(payload))

    applyForm(payload as ReturnType<typeof makeDefaultForm>)
    original.value = JSON.stringify(payload)
    externalChanged.value = false
    ok.value = true
    note.value = 'Perubahan navbar berhasil disimpan.'

    window.setTimeout(() => {
      note.value = ''
    }, 1800)
  } catch (error: any) {
    mutedRemoteSync = false
    ok.value = false
    note.value = error?.message || 'Gagal menyimpan perubahan.'
  } finally {
    saving.value = false
  }
}

function resetToDefault() {
  applyForm(makeDefaultForm())
}

function addLink() {
  form.navLinks.push({ label: 'Baru', href: '#', icon: 'ph:square' })
}

function removeLink(index: number) {
  form.navLinks.splice(index, 1)
}

function addGroup() {
  form.megaMenu.push({ title: 'Grup Baru', items: [defaultItem()] })
}

function removeGroup(index: number) {
  form.megaMenu.splice(index, 1)
}

function addItem(groupIndex: number) {
  form.megaMenu[groupIndex]?.items.push(defaultItem())
}

function removeItem(groupIndex: number, itemIndex: number) {
  form.megaMenu[groupIndex]?.items.splice(itemIndex, 1)
}

function addCTA() {
  form.ctaButtons.push({ label: 'Baru', href: '#', style: 'outline' })
}

function removeCTA(index: number) {
  form.ctaButtons.splice(index, 1)
}

/* Image upload like Blog editor */
const allowedImageTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

function validateImageFile(file: File) {
  if (!allowedImageTypes.has(file.type)) {
    return 'Format gambar harus JPG, PNG, atau WebP.'
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return 'Ukuran gambar maksimal 5 MB.'
  }

  return ''
}

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(String(value || ''))
}

function isLocalAssetUrl(value: string) {
  return String(value || '').startsWith('/')
}

function validateRemoteImageUrl(url: string) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image()

    const timer = window.setTimeout(() => {
      img.src = ''
      reject(new Error('Gambar terlalu lama dimuat. Pastikan link bisa diakses publik.'))
    }, 8000)

    img.onload = () => {
      window.clearTimeout(timer)

      if (!img.naturalWidth || !img.naturalHeight) {
        reject(new Error('Link tidak terbaca sebagai gambar valid.'))
        return
      }

      resolve()
    }

    img.onerror = () => {
      window.clearTimeout(timer)
      reject(new Error('Gambar tidak ditemukan atau link menolak akses gambar.'))
    }

    img.referrerPolicy = 'no-referrer'
    img.src = url
  })
}

async function uploadToCloudinary(file: File, key: MediaKey, folder: string) {
  const validation = validateImageFile(file)

  if (validation) {
    note.value = validation
    ok.value = false
    return ''
  }

  uploadTarget.value = key

  try {
    const result = await uploadImage(file, {
      folder,
      maxWidth: key === 'itemCover' ? 1200 : 1600,
      maxHeight: key === 'itemCover' ? 900 : 1000,
      quality: 0.84
    })

    return result.secure_url
  } catch (error: any) {
    note.value = error?.message || 'Gagal upload gambar.'
    ok.value = false
    return ''
  } finally {
    uploadTarget.value = ''
  }
}

async function onUploadCoverPonpes(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''

  if (!file) return

  const url = await uploadToCloudinary(file, 'coverPonpes', `${CLOUDINARY_NAVBAR_FOLDER}/cover-ponpes`)
  if (url) form.coverPonpes = url
}

async function onUploadPPDB(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''

  if (!file) return

  const url = await uploadToCloudinary(file, 'ppdbCta', `${CLOUDINARY_NAVBAR_FOLDER}/ppdb`)
  if (url) form.ppdbCta.image = url
}

async function onUploadItemCover(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''

  if (!file || !modal.open) return

  const url = await uploadToCloudinary(file, 'itemCover', `${CLOUDINARY_NAVBAR_FOLDER}/mega-items`)
  if (url) itemDraft.cover = url
}

async function applyMediaUrl(key: MediaKey) {
  const url = String(mediaDraft[key] || '').trim()

  if (!url) {
    note.value = 'URL gambar wajib diisi.'
    ok.value = false
    return
  }

  if (!isLocalAssetUrl(url) && !isHttpUrl(url)) {
    note.value = 'URL harus diawali http://, https://, atau /assets/.'
    ok.value = false
    return
  }

  try {
    if (isHttpUrl(url)) {
      await validateRemoteImageUrl(url)
    }

    if (key === 'coverPonpes') form.coverPonpes = url
    if (key === 'ppdbCta') form.ppdbCta.image = url
    if (key === 'itemCover') itemDraft.cover = url

    ok.value = true
    note.value = 'Link gambar berhasil digunakan. Klik Simpan untuk menyimpan.'
    window.setTimeout(() => {
      note.value = ''
    }, 1600)
  } catch (error: any) {
    ok.value = false
    note.value = error?.message || 'Link gambar invalid.'
  }
}

function removeMedia(key: MediaKey) {
  if (key === 'coverPonpes') form.coverPonpes = ''
  if (key === 'ppdbCta') form.ppdbCta.image = ''
  if (key === 'itemCover') itemDraft.cover = ''

  mediaDraft[key] = ''
}

function openItemModal(groupIndex: number, itemIndex: number) {
  modal.open = true
  modal.gidx = groupIndex
  modal.idx = itemIndex

  Object.assign(itemDraft, clone(form.megaMenu[groupIndex]?.items[itemIndex] || defaultItem()))
  mediaDraft.itemCover = itemDraft.cover || ''
}

function closeItemModal() {
  modal.open = false
  modal.gidx = -1
  modal.idx = -1

  Object.assign(itemDraft, defaultItem())
  mediaDraft.itemCover = ''
}

function applyItemModal() {
  if (modal.gidx < 0 || modal.idx < 0) return

  form.megaMenu[modal.gidx].items[modal.idx] = clone(itemDraft)
  closeItemModal()
}

/* Icon picker */
const iconPicker = reactive({
  open: false,
  query: '',
  results: [] as string[],
  loading: false,
  cb: null as null | ((icon: string) => void)
})

function openIconPicker(cb: (icon: string) => void) {
  iconPicker.open = true
  iconPicker.cb = cb
  iconPicker.query = ''
  iconPicker.results = [
    'ph:house',
    'ph:info',
    'ph:buildings',
    'ph:newspaper',
    'ph:phone',
    'ph:book-open-text',
    'ph:student',
    'ph:scroll',
    'lucide:home',
    'lucide:school',
    'lucide:book-open',
    'lucide:phone'
  ]
}

function closeIconPicker() {
  iconPicker.open = false
  iconPicker.cb = null
}

function selectIcon(icon: string) {
  iconPicker.cb?.(icon)
  closeIconPicker()
}

async function searchIcons() {
  const query = iconPicker.query.trim()
  if (!query) return

  iconPicker.loading = true

  try {
    const url = `https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=96&prefixes=ph,lucide,mdi,tabler,solar,hugeicons,material-symbols`
    const res = await fetch(url)
    const data = await res.json()

    iconPicker.results = Array.isArray(data?.icons) ? data.icons : []
  } catch {
    iconPicker.results = []
  } finally {
    iconPicker.loading = false
  }
}

/* Local helper components */
const StatCard = defineComponent({
  name: 'StatCard',
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    hint: { type: String, default: '' }
  },
  setup(props) {
    return () =>
      h('div', { class: 'rounded-[24px] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur' }, [
        h('div', { class: 'text-[11px] font-semibold uppercase tracking-[0.16em] text-green-100' }, props.label),
        h('div', { class: 'mt-2 truncate text-2xl font-black' }, props.value),
        h('div', { class: 'mt-1 truncate text-xs text-green-50/90' }, props.hint)
      ])
  }
})

const SectionHeader = defineComponent({
  name: 'SectionHeader',
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    icon: { type: String, default: 'lucide:sparkles' },
    badge: { type: String, default: '' }
  },
  setup(props, { slots }) {
    return () =>
      h('div', { class: 'flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between' }, [
        h('div', { class: 'flex min-w-0 items-start gap-3' }, [
          h('div', { class: 'grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' }, [
            h(Icon, { icon: props.icon, class: 'h-5 w-5' })
          ]),
          h('div', { class: 'min-w-0' }, [
            h('div', { class: 'flex flex-wrap items-center gap-2' }, [
              h('h3', { class: 'text-lg font-black text-gray-900 dark:text-white' }, props.title),
              props.badge
                ? h('span', { class: 'rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700 dark:bg-green-900/20 dark:text-green-300' }, props.badge)
                : null
            ]),
            h('p', { class: 'mt-1 text-sm leading-6 text-gray-500 dark:text-neutral-400' }, props.subtitle)
          ])
        ]),
        slots.default ? h('div', { class: 'shrink-0' }, slots.default()) : null
      ])
  }
})

const Field = defineComponent({
  name: 'Field',
  props: {
    label: { type: String, required: true }
  },
  setup(props, { slots }) {
    return () =>
      h('div', [
        h('label', { class: 'mb-1.5 block text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500' }, props.label),
        slots.default?.()
      ])
  }
})

const SummaryRow = defineComponent({
  name: 'SummaryRow',
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true }
  },
  setup(props) {
    return () =>
      h('div', { class: 'rounded-[24px] border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60' }, [
        h('div', { class: 'text-[11px] font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500' }, props.label),
        h('div', { class: 'mt-2 truncate text-sm font-black text-gray-900 dark:text-white' }, props.value)
      ])
  }
})

const ImagePickerCard = defineComponent({
  name: 'ImagePickerCard',
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    inputId: { type: String, required: true },
    src: { type: String, default: '' },
    draft: { type: String, default: '' },
    mode: { type: String as () => MediaMode, default: 'upload' },
    busy: { type: Boolean, default: false },
    targetActive: { type: Boolean, default: false }
  },
  emits: ['change-mode', 'update-draft', 'upload', 'apply-url', 'remove'],
  setup(props, { emit }) {
    return () =>
      h('div', { class: 'overflow-hidden rounded-[30px] border border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-800/60' }, [
        h('div', { class: 'border-b border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900' }, [
          h('div', { class: 'flex items-start justify-between gap-3' }, [
            h('div', [
              h('h4', { class: 'text-sm font-black text-gray-900 dark:text-white' }, props.title),
              h('p', { class: 'mt-1 text-xs leading-5 text-gray-500 dark:text-neutral-400' }, props.subtitle)
            ]),
            props.targetActive
              ? h(Icon, { icon: 'lucide:loader-circle', class: 'h-5 w-5 animate-spin text-green-600' })
              : h(Icon, { icon: 'lucide:image', class: 'h-5 w-5 text-green-600' })
          ])
        ]),
        h('div', { class: 'grid gap-4 p-4 md:grid-cols-[minmax(0,1fr),260px]' }, [
          h('div', { class: 'space-y-3' }, [
            h('div', { class: 'inline-flex rounded-2xl border border-gray-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-900' }, [
              h('button', {
                type: 'button',
                class: props.mode === 'upload'
                  ? 'rounded-xl bg-green-600 px-3 py-2 text-xs font-black text-white shadow-sm'
                  : 'rounded-xl px-3 py-2 text-xs font-black text-gray-500 dark:text-neutral-300',
                onClick: () => emit('change-mode', 'upload')
              }, 'Upload'),
              h('button', {
                type: 'button',
                class: props.mode === 'url'
                  ? 'rounded-xl bg-green-600 px-3 py-2 text-xs font-black text-white shadow-sm'
                  : 'rounded-xl px-3 py-2 text-xs font-black text-gray-500 dark:text-neutral-300',
                onClick: () => emit('change-mode', 'url')
              }, 'URL')
            ]),
            props.mode === 'upload'
              ? h('div', [
                  h('input', {
                    id: props.inputId,
                    type: 'file',
                    accept: 'image/jpeg,image/png,image/webp',
                    class: 'hidden',
                    onChange: (event: Event) => emit('upload', event)
                  }),
                  h('label', {
                    for: props.inputId,
                    class: 'flex cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-green-200 bg-green-50/70 px-4 py-8 text-center transition hover:bg-green-100 dark:border-green-900/40 dark:bg-green-900/10 dark:hover:bg-green-900/20'
                  }, [
                    h(Icon, { icon: 'lucide:upload-cloud', class: 'h-8 w-8 text-green-600 dark:text-green-300' }),
                    h('span', { class: 'mt-3 text-sm font-black text-gray-900 dark:text-white' }, 'Upload Gambar'),
                    h('span', { class: 'mt-1 text-xs text-gray-500 dark:text-neutral-400' }, 'JPG, PNG, WebP · Max 5 MB')
                  ])
                ])
              : h('div', { class: 'space-y-3' }, [
                  h('input', {
                    value: props.draft,
                    type: 'url',
                    placeholder: 'https://example.com/image.jpg atau /assets/image.jpg',
                    class: 'block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white',
                    onInput: (event: Event) => emit('update-draft', (event.target as HTMLInputElement).value)
                  }),
                  h('button', {
                    type: 'button',
                    disabled: props.busy || !props.draft,
                    class: 'inline-flex h-11 items-center justify-center rounded-2xl bg-green-600 px-4 text-sm font-black text-white transition hover:bg-green-700 disabled:opacity-60',
                    onClick: () => emit('apply-url')
                  }, 'Gunakan Link')
                ]),
            props.src
              ? h('button', {
                  type: 'button',
                  disabled: props.busy,
                  class: 'inline-flex h-10 items-center justify-center rounded-2xl border border-rose-200 bg-white px-4 text-xs font-black text-rose-700 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900/40 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-900/10',
                  onClick: () => emit('remove')
                }, 'Hapus Gambar')
              : null
          ]),
          h('div', { class: 'overflow-hidden rounded-[24px] border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900' }, [
            props.src
              ? h('img', { src: props.src, alt: props.title, class: 'h-full min-h-[220px] w-full object-cover' })
              : h('div', { class: 'grid h-full min-h-[220px] place-items-center p-5 text-center text-sm text-gray-500 dark:text-neutral-400' }, 'Belum ada gambar')
          ])
        ])
      ])
  }
})

onMounted(async () => {
  await syncFromDatabase()
})

onBeforeUnmount(() => {
  if (unsubscribeNavbar) unsubscribeNavbar()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>