<template>
  <section
    class="min-h-full bg-neutral-50"
    :style="themeVars"
  >
    <!-- Toast -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-3 opacity-0 sm:translate-x-3 sm:translate-y-0"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-to-class="translate-y-3 opacity-0 sm:translate-x-3 sm:translate-y-0"
      >
        <div
          v-if="toast.show"
          class="fixed right-4 top-4 z-[9999] w-[calc(100%-2rem)] max-w-sm"
        >
          <div
            class="rounded-3xl border bg-white/95 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl"
            :class="toast.type === 'success' ? 'border-emerald-200' : 'border-red-200'"
          >
            <div class="flex items-start gap-3">
              <div
                class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
                :class="toast.type === 'success'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'"
              >
                <Icon
                  :icon="toast.type === 'success'
                    ? 'solar:check-circle-bold-duotone'
                    : 'solar:danger-circle-bold-duotone'"
                  class="h-6 w-6"
                />
              </div>

              <div class="min-w-0 flex-1">
                <p class="text-sm font-black text-neutral-950">
                  {{ toast.title }}
                </p>
                <p class="mt-1 text-sm font-semibold leading-6 text-neutral-500">
                  {{ toast.message }}
                </p>
              </div>

              <button
                type="button"
                class="grid h-8 w-8 shrink-0 place-items-center rounded-xl text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                @click="closeToast"
              >
                <Icon icon="solar:close-circle-bold-duotone" class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <div class="space-y-5 p-4 sm:p-6">
      <!-- Header -->
      <section class="relative overflow-hidden rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <div class="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--brand-soft)] blur-3xl"></div>

        <div class="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-start gap-4">
            <div class="grid h-14 w-14 shrink-0 place-items-center rounded-3xl bg-[var(--brand)] text-white shadow-sm">
              <Icon :icon="profile.icon" class="h-7 w-7" />
            </div>

            <div class="min-w-0">
              <div class="mb-2 flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[var(--brand)]">
                  {{ profile.badge }}
                </span>

                <span class="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-bold text-neutral-500">
                  Tenant: {{ tenantSlug }}
                </span>
              </div>

              <h1 class="text-2xl font-black tracking-tight text-neutral-950 sm:text-3xl">
                {{ profile.title }}
              </h1>

              <p class="mt-2 max-w-3xl text-sm font-medium leading-7 text-neutral-500 sm:text-base">
                {{ profile.description }}
              </p>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-black text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
              @click="reloadNews"
            >
              <Icon
                icon="solar:refresh-bold-duotone"
                class="h-5 w-5"
                :class="isLoading ? 'animate-spin' : ''"
              />
              Refresh
            </button>

            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-4 py-2.5 text-sm font-black text-white transition hover:bg-neutral-800"
              @click="openCreate"
            >
              <Icon icon="solar:add-circle-bold-duotone" class="h-5 w-5" />
              {{ profile.createLabel }}
            </button>
          </div>
        </div>
      </section>

      <!-- Toolbar -->
      <section class="rounded-[2rem] border border-neutral-200 bg-white p-4 shadow-sm">
        <div class="grid gap-3 lg:grid-cols-[1fr_180px_160px]">
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
              <Icon icon="solar:magnifer-linear" class="h-5 w-5" />
            </div>

            <input
              v-model.trim="search"
              type="text"
              :placeholder="profile.searchPlaceholder"
              class="block w-full rounded-2xl border border-neutral-200 bg-neutral-50 py-3 pl-12 pr-4 text-sm font-semibold text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[var(--brand)] focus:bg-white focus:ring-4 focus:ring-[var(--brand-ring)]"
            >
          </div>

          <select
            v-model="selectedCategory"
            class="block w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-bold text-neutral-700 outline-none transition focus:border-[var(--brand)] focus:bg-white focus:ring-4 focus:ring-[var(--brand-ring)]"
          >
            <option value="all">Semua Kategori</option>
            <option
              v-for="category in categoryOptions"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>

          <select
            v-model="selectedStatus"
            class="block w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-bold text-neutral-700 outline-none transition focus:border-[var(--brand)] focus:bg-white focus:ring-4 focus:ring-[var(--brand-ring)]"
          >
            <option value="all">Semua Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
      </section>

      <!-- Error -->
      <div
        v-if="visibleError"
        class="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-700"
      >
        {{ visibleError }}
      </div>

      <!-- Stats -->
      <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="stat in stats"
          :key="stat.label"
          class="rounded-[1.75rem] border border-neutral-200 bg-white p-5 shadow-sm"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-bold text-neutral-500">
                {{ stat.label }}
              </p>
              <h2 class="mt-3 text-3xl font-black text-neutral-950">
                {{ stat.value }}
              </h2>
            </div>

            <div class="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
              <Icon :icon="stat.icon" class="h-6 w-6" />
            </div>
          </div>

          <p class="mt-4 text-xs font-semibold leading-5 text-neutral-500">
            {{ stat.description }}
          </p>
        </article>
      </section>

      <!-- Loading -->
      <section
        v-if="isLoading"
        class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        <div
          v-for="item in 6"
          :key="item"
          class="h-80 animate-pulse rounded-[2rem] border border-neutral-200 bg-white p-4"
        >
          <div class="h-40 rounded-3xl bg-neutral-100"></div>
          <div class="mt-4 h-4 w-2/3 rounded-full bg-neutral-100"></div>
          <div class="mt-3 h-3 w-full rounded-full bg-neutral-100"></div>
          <div class="mt-2 h-3 w-4/5 rounded-full bg-neutral-100"></div>
        </div>
      </section>

      <!-- Empty -->
      <section
        v-else-if="filteredNews.length === 0"
        class="rounded-[2rem] border border-dashed border-neutral-300 bg-white p-10 text-center shadow-sm"
      >
        <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-neutral-100 text-neutral-500">
          <Icon icon="solar:document-add-bold-duotone" class="h-8 w-8" />
        </div>

        <h2 class="mt-5 text-xl font-black text-neutral-950">
          Belum ada berita
        </h2>

        <p class="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-neutral-500">
          {{ profile.emptyDescription }}
        </p>

        <button
          type="button"
          class="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-black text-white transition hover:bg-neutral-800"
          @click="openCreate"
        >
          <Icon icon="solar:add-circle-bold-duotone" class="h-5 w-5" />
          {{ profile.createLabel }}
        </button>
      </section>

      <!-- News Grid -->
      <section
        v-else
        class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        <article
          v-for="item in pagedNews"
          :key="item.id"
          class="group overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div class="relative h-48 bg-neutral-100">
            <img
              v-if="item.cover"
              :src="item.cover"
              :alt="item.title"
              class="h-full w-full object-cover"
            >

            <div
              v-else
              class="flex h-full w-full items-center justify-center bg-neutral-100 text-neutral-400"
            >
              <Icon icon="solar:gallery-wide-bold-duotone" class="h-10 w-10" />
            </div>

            <div class="absolute left-3 top-3 flex flex-wrap gap-2">
              <span class="rounded-full bg-neutral-950/80 px-3 py-1 text-xs font-black text-white backdrop-blur">
                {{ item.category || profile.defaultCategory }}
              </span>

              <span
                class="rounded-full px-3 py-1 text-xs font-black backdrop-blur"
                :class="statusClass(item.status)"
              >
                {{ statusLabel(item.status) }}
              </span>
            </div>
          </div>

          <div class="p-5">
            <div class="mb-3 flex items-center justify-between gap-3">
              <p class="truncate text-xs font-black uppercase tracking-[0.14em] text-[var(--brand)]">
                {{ item.tenantSlug || tenantSlug }}
              </p>

              <p class="shrink-0 text-xs font-bold text-neutral-400">
                {{ formatDate(item.publishedAt) }}
              </p>
            </div>

            <h3 class="line-clamp-2 text-lg font-black leading-7 text-neutral-950">
              {{ item.title }}
            </h3>

            <p class="mt-2 line-clamp-3 text-sm font-medium leading-6 text-neutral-500">
              {{ item.excerpt || plainTextFromContent(item.content).slice(0, 140) || 'Belum ada ringkasan.' }}
            </p>

            <div
              v-if="item.tags.length"
              class="mt-4 flex flex-wrap gap-1.5"
            >
              <span
                v-for="tag in item.tags.slice(0, 3)"
                :key="tag"
                class="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-bold text-neutral-500"
              >
                #{{ tag }}
              </span>
            </div>

            <div class="mt-5 flex items-center gap-2">
              <button
                type="button"
                class="inline-flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-black text-neutral-600 transition hover:bg-neutral-50"
                @click="openEdit(item)"
              >
                <Icon icon="solar:pen-2-bold-duotone" class="h-4 w-4" />
                Edit
              </button>

              <button
                type="button"
                class="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-100"
                @click="openDelete(item)"
              >
                <Icon icon="solar:trash-bin-trash-bold-duotone" class="h-4 w-4" />
                Hapus
              </button>

              <NuxtLink
                :to="publicNewsUrl(item)"
                class="ms-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-black text-neutral-600 transition hover:bg-neutral-50"
              >
                Lihat
                <Icon icon="solar:arrow-right-linear" class="h-4 w-4" />
              </NuxtLink>
            </div>
          </div>
        </article>
      </section>

      <!-- Pagination -->
      <div
        v-if="hasMore && !isLoading"
        class="flex justify-center"
      >
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-black text-neutral-700 transition hover:bg-neutral-50"
          @click="page += 1"
        >
          <Icon icon="solar:alt-arrow-down-bold-duotone" class="h-5 w-5" />
          Muat Lainnya
        </button>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showForm"
          class="fixed inset-0 z-[9990] overflow-y-auto bg-neutral-950/50 p-3 backdrop-blur-sm sm:p-5"
        >
          <div class="mx-auto min-h-full max-w-6xl py-4">
            <div class="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-2xl">
              <!-- Modal Header -->
              <div class="sticky top-0 z-10 border-b border-neutral-200 bg-white/95 px-5 py-4 backdrop-blur-xl">
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="text-xs font-black uppercase tracking-[0.16em] text-[var(--brand)]">
                      {{ profile.name }}
                    </p>
                    <h2 class="text-xl font-black text-neutral-950">
                      {{ formMode === 'create' ? profile.createLabel : 'Edit Berita' }}
                    </h2>
                  </div>

                  <button
                    type="button"
                    class="grid h-10 w-10 place-items-center rounded-2xl text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
                    @click="closeForm"
                  >
                    <Icon icon="solar:close-circle-bold-duotone" class="h-6 w-6" />
                  </button>
                </div>

                <!-- Stepper -->
                <div class="mt-5">
                  <div class="mb-3 flex items-center justify-between gap-3">
                    <p class="text-xs font-black uppercase tracking-[0.16em] text-neutral-400">
                      Step {{ formStep }} dari {{ formSteps.length }}
                    </p>

                    <p class="text-xs font-black text-[var(--brand)]">
                      {{ formStepProgress }}%
                    </p>
                  </div>

                  <div class="h-2 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      class="h-full rounded-full bg-[var(--brand)] transition-all duration-300"
                      :style="{ width: `${formStepProgress}%` }"
                    ></div>
                  </div>

                  <div class="mt-4 grid gap-2 sm:grid-cols-4">
                    <button
                      v-for="step in formSteps"
                      :key="step.value"
                      type="button"
                      class="rounded-2xl border p-3 text-left transition"
                      :class="step.value === formStep
                        ? 'border-[var(--brand)] bg-[var(--brand-soft)] ring-4 ring-[var(--brand-ring)]'
                        : step.value < formStep
                          ? 'border-emerald-200 bg-emerald-50'
                          : 'border-neutral-200 bg-white hover:bg-neutral-50'"
                      @click="goToFormStep(step.value)"
                    >
                      <div class="flex items-center justify-between gap-2">
                        <div
                          class="grid h-9 w-9 place-items-center rounded-xl"
                          :class="step.value === formStep
                            ? 'bg-white text-[var(--brand)]'
                            : step.value < formStep
                              ? 'bg-white text-emerald-600'
                              : 'bg-neutral-100 text-neutral-400'"
                        >
                          <Icon
                            :icon="step.value < formStep ? 'solar:check-circle-bold-duotone' : step.icon"
                            class="h-5 w-5"
                          />
                        </div>

                        <span class="text-xs font-black text-neutral-400">
                          0{{ step.value }}
                        </span>
                      </div>

                      <p class="mt-2 text-sm font-black text-neutral-950">
                        {{ step.title }}
                      </p>
                      <p class="mt-1 text-xs font-semibold leading-5 text-neutral-500">
                        {{ step.description }}
                      </p>
                    </button>
                  </div>
                </div>
              </div>

              <form class="p-5" @submit.prevent="submitForm">
                <!-- Step 1: Informasi -->
                <div v-if="formStep === 1" class="space-y-5">
                  <div class="rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-5">
                    <div class="flex items-start gap-4">
                      <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[var(--brand)] shadow-sm">
                        <Icon icon="solar:document-add-bold-duotone" class="h-5 w-5" />
                      </div>

                      <div>
                        <h3 class="text-base font-black text-neutral-950">
                          Informasi Berita
                        </h3>
                        <p class="mt-1 text-sm font-medium leading-6 text-neutral-500">
                          Isi judul, slug, kategori, status, jadwal terbit, dan tag artikel.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="grid gap-4 lg:grid-cols-2">
                    <div>
                      <label class="mb-2 block text-sm font-black text-neutral-700">
                        Judul
                      </label>
                      <input
                        v-model.trim="form.title"
                        type="text"
                        required
                        :placeholder="profile.titlePlaceholder"
                        class="block w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-800 outline-none transition focus:border-[var(--brand)] focus:bg-white focus:ring-4 focus:ring-[var(--brand-ring)]"
                        @input="syncSlugFromTitle"
                      >
                      <p v-if="formTouched && !form.title.trim()" class="mt-2 text-xs font-bold text-red-600">
                        Judul wajib diisi.
                      </p>
                    </div>

                    <div>
                      <label class="mb-2 block text-sm font-black text-neutral-700">
                        Kategori
                      </label>

                      <input
                        v-model.trim="form.category"
                        list="news-category-options"
                        type="text"
                        placeholder="Contoh: Informasi Desa"
                        class="block w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-800 outline-none transition focus:border-[var(--brand)] focus:bg-white focus:ring-4 focus:ring-[var(--brand-ring)]"
                      >

                      <datalist id="news-category-options">
                        <option
                          v-for="category in categoryOptions"
                          :key="category"
                          :value="category"
                        />
                      </datalist>

                      <p class="mt-2 text-xs font-semibold leading-5 text-neutral-500">
                        Jika kategori belum ada, sistem akan membuat kategori baru saat berita disimpan.
                      </p>
                    </div>

                    <div>
                      <label class="mb-2 block text-sm font-black text-neutral-700">
                        Status
                      </label>
                      <select
                        v-model="form.status"
                        class="block w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-800 outline-none transition focus:border-[var(--brand)] focus:bg-white focus:ring-4 focus:ring-[var(--brand-ring)]"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="scheduled">Scheduled</option>
                      </select>
                    </div>

                    <div>
                      <label class="mb-2 block text-sm font-black text-neutral-700">
                        Tanggal Terbit
                      </label>
                      <input
                        v-model="publishedAtLocal"
                        type="datetime-local"
                        class="block w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-800 outline-none transition focus:border-[var(--brand)] focus:bg-white focus:ring-4 focus:ring-[var(--brand-ring)]"
                      >
                    </div>

                    <div>
                      <label class="mb-2 block text-sm font-black text-neutral-700">
                        Tag
                      </label>

                      <div class="rounded-2xl border border-neutral-200 bg-neutral-50 p-2 transition focus-within:border-[var(--brand)] focus-within:bg-white focus-within:ring-4 focus-within:ring-[var(--brand-ring)]">
                        <div class="flex min-h-[42px] flex-wrap items-center gap-2">
                          <span
                            v-for="tag in form.tags"
                            :key="tag"
                            class="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-black text-white"
                          >
                            #{{ tag }}

                            <button
                              type="button"
                              class="grid h-4 w-4 place-items-center rounded-full text-white/70 hover:text-white"
                              @click="removeTag(tag)"
                            >
                              <Icon icon="solar:close-circle-bold-duotone" class="h-4 w-4" />
                            </button>
                          </span>

                          <input
                            v-model.trim="form.tagInput"
                            type="text"
                            placeholder="Ketik tag lalu Enter / Spasi"
                            class="min-w-[180px] flex-1 border-0 bg-transparent px-2 py-2 text-sm font-semibold text-neutral-800 outline-none placeholder:text-neutral-400"
                            @keydown.enter.prevent="addTagFromInput"
                            @keydown.space.prevent="addTagFromInput"
                            @keydown.,.prevent="addTagFromInput"
                            @blur="addTagFromInput"
                            @paste="onPasteTags"
                          >
                        </div>
                      </div>

                      <p class="mt-2 text-xs font-semibold leading-5 text-neutral-500">
                        Tekan Enter, Spasi, atau koma untuk menambahkan tag.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label class="mb-2 block text-sm font-black text-neutral-700">
                      Ringkasan
                    </label>
                    <textarea
                      v-model.trim="form.excerpt"
                      rows="4"
                      :placeholder="profile.excerptPlaceholder"
                      class="block w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold leading-6 text-neutral-800 outline-none transition focus:border-[var(--brand)] focus:bg-white focus:ring-4 focus:ring-[var(--brand-ring)]"
                    ></textarea>
                  </div>
                </div>

                <!-- Step 2: Gambar -->
                <div v-if="formStep === 2" class="space-y-5">
                  <div class="rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-5">
                    <div class="flex items-start gap-4">
                      <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[var(--brand)] shadow-sm">
                        <Icon icon="solar:gallery-wide-bold-duotone" class="h-5 w-5" />
                      </div>

                      <div>
                        <h3 class="text-base font-black text-neutral-950">
                          Gambar Cover
                        </h3>
                        <p class="mt-1 text-sm font-medium leading-6 text-neutral-500">
                          Upload file ke Cloudinary atau gunakan link gambar langsung. URL hasil Cloudinary/link akan disimpan ke database.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="grid gap-5 lg:grid-cols-[1fr_320px]">
                    <div class="space-y-4">
                      <div class="grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          class="rounded-2xl border p-4 text-left transition"
                          :class="coverMode === 'upload'
                            ? 'border-[var(--brand)] bg-[var(--brand-soft)] ring-4 ring-[var(--brand-ring)]'
                            : 'border-neutral-200 bg-white hover:bg-neutral-50'"
                          @click="setCoverMode('upload')"
                        >
                          <div class="grid h-11 w-11 place-items-center rounded-2xl bg-white text-[var(--brand)] shadow-sm">
                            <Icon icon="solar:upload-square-bold-duotone" class="h-6 w-6" />
                          </div>
                          <p class="mt-3 text-sm font-black text-neutral-950">
                            Upload File
                          </p>
                        </button>

                        <button
                          type="button"
                          class="rounded-2xl border p-4 text-left transition"
                          :class="coverMode === 'url'
                            ? 'border-[var(--brand)] bg-[var(--brand-soft)] ring-4 ring-[var(--brand-ring)]'
                            : 'border-neutral-200 bg-white hover:bg-neutral-50'"
                          @click="setCoverMode('url')"
                        >
                          <div class="grid h-11 w-11 place-items-center rounded-2xl bg-white text-[var(--brand)] shadow-sm">
                            <Icon icon="solar:link-bold-duotone" class="h-6 w-6" />
                          </div>
                          <p class="mt-3 text-sm font-black text-neutral-950">
                            Link Langsung
                          </p>
                        </button>
                      </div>

                      <div v-if="coverMode === 'upload'" class="rounded-[1.75rem] border border-neutral-200 bg-white p-5">
                        <input
                          ref="coverInput"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          class="hidden"
                          @change="onPickCover"
                        >

                        <button
                          type="button"
                          class="flex w-full flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-neutral-300 bg-neutral-50 px-5 py-8 text-center transition hover:border-[var(--brand)] hover:bg-white"
                          @click="triggerPickCover"
                        >
                          <div class="grid h-14 w-14 place-items-center rounded-3xl bg-white text-[var(--brand)] shadow-sm">
                            <Icon icon="solar:cloud-upload-bold-duotone" class="h-7 w-7" />
                          </div>

                          <p class="mt-4 text-sm font-black text-neutral-950">
                            Pilih gambar cover
                          </p>
                          <p class="mt-1 text-xs font-semibold leading-5 text-neutral-500">
                            JPG, PNG, atau WebP. Maksimal 5 MB.
                          </p>
                        </button>

                        <div v-if="coverFile" class="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                          <div class="min-w-0">
                            <p class="truncate text-sm font-black text-neutral-800">
                              {{ coverFile.name }}
                            </p>
                            <p class="text-xs font-semibold text-neutral-500">
                              {{ formatFileSize(coverFile.size) }}
                            </p>
                          </div>

                          <button
                            type="button"
                            class="grid h-9 w-9 place-items-center rounded-xl text-red-600 transition hover:bg-red-50"
                            @click="clearCover"
                          >
                            <Icon icon="solar:trash-bin-trash-bold-duotone" class="h-5 w-5" />
                          </button>
                        </div>

                        <div v-if="imageUploadError" class="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                          {{ imageUploadError }}
                        </div>
                      </div>

                      <div v-if="coverMode === 'url'" class="rounded-[1.75rem] border border-neutral-200 bg-white p-5">
                        <label class="mb-2 block text-sm font-black text-neutral-700">
                          URL Gambar
                        </label>
                        <input
                          v-model.trim="form.cover"
                          type="url"
                          placeholder="https://example.com/gambar.jpg"
                          class="block w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-800 outline-none transition focus:border-[var(--brand)] focus:bg-white focus:ring-4 focus:ring-[var(--brand-ring)]"
                        >
isValidUrl
                        <p class="mt-2 text-xs font-semibold leading-5 text-neutral-500">
                          Link ini akan disimpan langsung ke database tanpa upload ke Cloudinary.
                        </p>
                      </div>
                    </div>

                    <aside class="rounded-[1.75rem] border border-neutral-200 bg-white p-4">
                      <p class="mb-3 text-sm font-black text-neutral-950">
                        Preview Cover
                      </p>

                      <div class="h-56 overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-neutral-100">
                        <img
                          v-if="coverPreviewUrl"
                          :src="coverPreviewUrl"
                          alt="Cover preview"
                          class="h-full w-full object-cover"
                        >
                        <div v-else class="flex h-full w-full flex-col items-center justify-center text-neutral-400">
                          <Icon icon="solar:gallery-wide-bold-duotone" class="h-10 w-10" />
                          <p class="mt-2 text-xs font-bold">
                            Belum ada gambar
                          </p>
                        </div>
                      </div>

                      <button
                        v-if="coverPreviewUrl"
                        type="button"
                        class="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-black text-neutral-700 transition hover:bg-neutral-50"
                        @click="clearCover"
                      >
                        <Icon icon="solar:trash-bin-trash-bold-duotone" class="h-5 w-5" />
                        Hapus Cover
                      </button>
                    </aside>
                  </div>
                </div>

                <!-- Step 3: Konten -->
                <div v-if="formStep === 3" class="space-y-5">
                  <div class="rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-5">
                    <div class="flex items-start gap-4">
                      <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[var(--brand)] shadow-sm">
                        <Icon icon="solar:pen-new-square-bold-duotone" class="h-5 w-5" />
                      </div>

                      <div>
                        <h3 class="text-base font-black text-neutral-950">
                          Konten Berita
                        </h3>
                        <p class="mt-1 text-sm font-medium leading-6 text-neutral-500">
                          Tulis isi berita menggunakan editor. Konten akan disimpan sebagai JSON dan HTML Tiptap.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div class="mb-2 flex items-center justify-between gap-3">
                      <label class="block text-sm font-black text-neutral-700">
                        Konten
                      </label>

                      <span class="text-xs font-bold text-neutral-400">
                        Estimasi baca: {{ readTime }} menit
                      </span>
                    </div>

                    <ClientOnly>
                      <div class="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
                        <div
                          v-if="editor"
                          class="flex flex-wrap gap-1 border-b border-neutral-200 bg-neutral-50 p-2"
                        >
                          <button
                            v-for="button in editorButtons"
                            :key="button.label"
                            type="button"
                            class="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black transition"
                            :class="button.active()
                              ? 'bg-neutral-900 text-white'
                              : 'text-neutral-600 hover:bg-white hover:text-neutral-950'"
                            @click="button.action"
                          >
                            <Icon :icon="button.icon" class="h-4 w-4" />
                            {{ button.label }}
                          </button>
                          <input
                            ref="editorImageInput"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            class="hidden"
                            @change="onPickEditorImage"
                          />

                          <button
                            type="button"
                            class="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black text-neutral-600 transition hover:bg-white hover:text-neutral-950"
                            @click="triggerEditorImageUpload"
                          >
                            <Icon icon="solar:cloud-upload-bold-duotone" class="h-4 w-4" />
                            Upload Image
                          </button>

                          <button
                            type="button"
                            class="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black text-neutral-600 transition hover:bg-white hover:text-neutral-950"
                            @click="openMediaModal('image-url')"
                          >
                            <Icon icon="solar:gallery-add-bold-duotone" class="h-4 w-4" />
                            Image URL
                          </button>

                          <button
                            type="button"
                            class="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black text-neutral-600 transition hover:bg-white hover:text-neutral-950"
                            @click="openMediaModal('pdf')"
                          >
                            <Icon icon="solar:file-text-bold-duotone" class="h-4 w-4" />
                            PDF
                          </button>

                          <button
                            type="button"
                            class="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black text-neutral-600 transition hover:bg-white hover:text-neutral-950"
                            @click="openMediaModal('youtube')"
                          >
                            <Icon icon="solar:video-frame-play-horizontal-bold-duotone" class="h-4 w-4" />
                            YouTube
                          </button>

                          <button
                            type="button"
                            class="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black text-neutral-600 transition hover:bg-white hover:text-neutral-950"
                            @click="openMediaModal('map')"
                          >
                            <Icon icon="solar:map-point-bold-duotone" class="h-4 w-4" />
                            Map
                          </button>
                        </div>

                        <EditorContent
                          v-if="editor"
                          :editor="editor"
                          class="editor-content min-h-[420px] p-4"
                        />
                      </div>
                    </ClientOnly>
                  </div>
                </div>

                <!-- Step 4: Review -->
                <div v-if="formStep === 4" class="space-y-5">
                  <div class="rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-5">
                    <div class="flex items-start gap-4">
                      <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[var(--brand)] shadow-sm">
                        <Icon icon="solar:clipboard-check-bold-duotone" class="h-5 w-5" />
                      </div>

                      <div>
                        <h3 class="text-base font-black text-neutral-950">
                          Review & Simpan
                        </h3>
                        <p class="mt-1 text-sm font-medium leading-6 text-neutral-500">
                          Periksa kembali data berita sebelum disimpan ke database.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="grid gap-5 lg:grid-cols-[320px_1fr]">
                    <div class="overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white">
                      <div class="h-52 bg-neutral-100">
                        <img
                          v-if="coverPreviewUrl"
                          :src="coverPreviewUrl"
                          alt="Preview cover"
                          class="h-full w-full object-cover"
                        >
                        <div v-else class="flex h-full w-full items-center justify-center text-neutral-400">
                          <Icon icon="solar:gallery-wide-bold-duotone" class="h-10 w-10" />
                        </div>
                      </div>

                      <div class="p-5">
                        <span class="rounded-full bg-neutral-900 px-3 py-1 text-xs font-black text-white">
                          {{ form.category }}
                        </span>

                        <h3 class="mt-4 text-lg font-black leading-7 text-neutral-950">
                          {{ form.title || 'Judul berita' }}
                        </h3>

                        <p class="mt-2 text-sm font-medium leading-6 text-neutral-500">
                          {{ form.excerpt || 'Ringkasan berita akan tampil di sini.' }}
                        </p>
                      </div>
                    </div>

                    <div class="rounded-[1.75rem] border border-neutral-200 bg-white p-5">
                      <div class="grid gap-4">
                        <ReviewRow label="Slug" :value="form.slug || '-'" />
                        <ReviewRow label="Status" :value="statusLabel(form.status)" />
                        <ReviewRow label="Tanggal Terbit" :value="formatDate(form.publishedAt)" />
                        <ReviewRow label="Tag" :value="form.tags.join(', ') || '-'" />
                        <ReviewRow label="Cover Mode" :value="coverMode === 'upload' ? 'Upload Cloudinary' : 'Link Langsung'" />
                        <ReviewRow label="Estimasi Baca" :value="`${readTime} menit`" />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  v-if="formError"
                  class="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
                >
                  {{ formError }}
                </div>

                <!-- Footer Navigation -->
                <div class="mt-6 flex flex-col-reverse gap-3 border-t border-neutral-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-black text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="formStep === 1 || saving || imageUploading"
                    @click="prevFormStep"
                  >
                    <Icon icon="solar:arrow-left-linear" class="h-5 w-5" />
                    Kembali
                  </button>

                  <div class="flex flex-col-reverse gap-3 sm:flex-row">
                    <button
                      type="button"
                      class="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-black text-neutral-700 transition hover:bg-neutral-50"
                      @click="closeForm"
                    >
                      Batal
                    </button>

                    <button
                      v-if="formStep < formSteps.length"
                      type="button"
                      class="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-black text-white transition hover:bg-neutral-800"
                      @click="nextFormStep"
                    >
                      Lanjutkan
                      <Icon icon="solar:arrow-right-linear" class="h-5 w-5" />
                    </button>

                    <button
                      v-else
                      type="submit"
                      :disabled="saving || imageUploading"
                      class="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-black text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Icon
                        :icon="saving || imageUploading ? 'solar:refresh-bold-duotone' : 'solar:diskette-bold-duotone'"
                        class="h-5 w-5"
                        :class="saving || imageUploading ? 'animate-spin' : ''"
                      />
                      {{ imageUploading ? 'Upload gambar...' : saving ? 'Menyimpan...' : formMode === 'create' ? 'Terbitkan' : 'Update Berita' }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Insert Media Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showMediaModal"
          class="fixed inset-0 z-[9992] flex items-center justify-center bg-neutral-950/50 p-4 backdrop-blur-sm"
        >
          <div class="w-full max-w-xl rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-2xl">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs font-black uppercase tracking-[0.16em] text-[var(--brand)]">
                  Tiptap Media
                </p>
                <h2 class="mt-1 text-xl font-black text-neutral-950">
                  {{ mediaTitle }}
                </h2>
              </div>

              <button
                type="button"
                class="grid h-10 w-10 place-items-center rounded-2xl text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
                @click="closeMediaModal"
              >
                <Icon icon="solar:close-circle-bold-duotone" class="h-6 w-6" />
              </button>
            </div>

            <div class="mt-5 space-y-4">
              <div>
                <label class="mb-2 block text-sm font-black text-neutral-700">
                  URL / Embed
                </label>

                <textarea
                  v-model.trim="mediaForm.url"
                  rows="4"
                  :placeholder="mediaPlaceholder"
                  class="block w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold leading-6 text-neutral-800 outline-none transition focus:border-[var(--brand)] focus:bg-white focus:ring-4 focus:ring-[var(--brand-ring)]"
                ></textarea>
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-neutral-700">
                  Title / Alt Text
                </label>

                <input
                  v-model.trim="mediaForm.title"
                  type="text"
                  placeholder="Opsional"
                  class="block w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-800 outline-none transition focus:border-[var(--brand)] focus:bg-white focus:ring-4 focus:ring-[var(--brand-ring)]"
                >
              </div>

              <div
                v-if="mediaError"
                class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
              >
                {{ mediaError }}
              </div>
            </div>

            <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-black text-neutral-700 transition hover:bg-neutral-50"
                @click="closeMediaModal"
              >
                Batal
              </button>

              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-black text-white transition hover:bg-neutral-800"
                @click="confirmInsertMedia"
              >
                <Icon icon="solar:add-circle-bold-duotone" class="h-5 w-5" />
                Insert
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showDelete"
          class="fixed inset-0 z-[9991] flex items-center justify-center bg-neutral-950/50 p-4 backdrop-blur-sm"
        >
          <div class="w-full max-w-md rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-2xl">
            <div class="grid h-14 w-14 place-items-center rounded-3xl bg-red-50 text-red-600">
              <Icon icon="solar:trash-bin-trash-bold-duotone" class="h-7 w-7" />
            </div>

            <h2 class="mt-5 text-xl font-black text-neutral-950">
              Hapus Berita?
            </h2>

            <p class="mt-2 text-sm font-medium leading-6 text-neutral-500">
              Berita <strong class="text-neutral-900">{{ selectedNews?.title }}</strong> akan dihapus. Tindakan ini tidak dapat dibatalkan.
            </p>

            <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-black text-neutral-700 transition hover:bg-neutral-50"
                @click="showDelete = false"
              >
                Batal
              </button>

              <button
                type="button"
                :disabled="deleting"
                class="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                @click="confirmDelete"
              >
                <Icon
                  :icon="deleting ? 'solar:refresh-bold-duotone' : 'solar:trash-bin-trash-bold-duotone'"
                  class="h-5 w-5"
                  :class="deleting ? 'animate-spin' : ''"
                />
                {{ deleting ? 'Menghapus...' : 'Hapus' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import { Node, mergeAttributes } from '@tiptap/core'
import { useNews } from '../../composables/data/useNewsSQL'
import { useCloudinaryUpload } from '../../composables/useCloudinaryUpload'
import { computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, reactive, ref, shallowRef, unref, watch } from 'vue'
import {
  useHead,
  useRequestURL,
  useRuntimeConfig,
  useSeoMeta
} from 'nuxt/app'

definePageMeta({
  layout: 'app',
  layoutProps: {
    title: 'Berita Informasi'
  }
})

type Mode = 'martopuro' | 'obayan'
type ToastType = 'success' | 'error'
type NewsStatus = 'published' | 'draft' | 'scheduled'

type NewsContent =
  | string
  | {
      kind?: string
      json?: any
      html?: string
    }

type NewsItem = {
  id: string
  title: string
  slug: string
  excerpt: string
  cover: string
  category: string
  tags: string[]
  status: NewsStatus
  publishedAt: number
  readTime: number
  tenantSlug?: string
  content?: NewsContent
  createdAt?: number
  updatedAt?: number
}

type NewsPayload = {
  tenantSlug: string
  title: string
  slug: string
  excerpt: string
  cover: string
  category: string
  tags: string[]
  status: NewsStatus
  publishedAt: number
  readTime: number
  content: {
    kind: 'tiptap'
    json: any
    html: string
  }
}

const config = useRuntimeConfig()
const requestUrl = useRequestURL()

/**
 * Pastikan composable ini tersedia.
 * Disarankan path:
 * composables/data/useNewsSQL.ts
 *
 * Nuxt akan auto-import useNewsSQL().
 */
const newsSQL = useNews() as any

const editor = shallowRef<Editor | null>(null)

const search = ref('')
const selectedCategory = ref('all')
const selectedStatus = ref<'all' | NewsStatus>('all')
const page = ref(1)
const pageSize = 12

const showForm = ref(false)
const showDelete = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const saving = ref(false)
const deleting = ref(false)
const formError = ref('')
const selectedNews = ref<NewsItem | null>(null)
const manualSlugEdited = ref(false)

type CoverMode = 'upload' | 'url'

const {
  uploading: imageUploading,
  uploadError: imageUploadError,
  uploadImage
} = useCloudinaryUpload()

const formStep = ref(1)
const formTouched = ref(false)

const coverMode = ref<CoverMode>('upload')
const coverInput = ref<HTMLInputElement | null>(null)
const coverFile = shallowRef<File | null>(null)
const coverLocalPreview = ref('')

const formSteps = [
  {
    value: 1,
    title: 'Informasi',
    description: 'Judul & metadata',
    icon: 'solar:document-add-bold-duotone'
  },
  {
    value: 2,
    title: 'Gambar',
    description: 'Cover berita',
    icon: 'solar:gallery-wide-bold-duotone'
  },
  {
    value: 3,
    title: 'Konten',
    description: 'Isi artikel',
    icon: 'solar:pen-new-square-bold-duotone'
  },
  {
    value: 4,
    title: 'Review',
    description: 'Cek & simpan',
    icon: 'solar:clipboard-check-bold-duotone'
  }
]

const formStepProgress = computed(() => {
  return Math.round((formStep.value / formSteps.length) * 100)
})

const coverPreviewUrl = computed(() => {
  if (coverMode.value === 'upload') {
    return coverLocalPreview.value || form.cover
  }

  return form.cover
})

const toast = reactive({
  show: false,
  type: 'success' as ToastType,
  title: '',
  message: ''
})

let toastTimer: ReturnType<typeof setTimeout> | null = null

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  cover: '',
  category: '',
  tags: [] as string[],
  tagInput: '',
  status: 'published' as NewsStatus,
  publishedAt: Date.now()
})

type MediaType = 'image-url' | 'pdf' | 'youtube' | 'map'

const showMediaModal = ref(false)
const mediaType = ref<MediaType>('image-url')
const mediaError = ref('')
const editorImageInput = ref<HTMLInputElement | null>(null)

const mediaForm = reactive({
  url: '',
  title: ''
})

const mediaTitle = computed(() => {
  if (mediaType.value === 'image-url') return 'Insert Image URL'
  if (mediaType.value === 'pdf') return 'Insert PDF'
  if (mediaType.value === 'youtube') return 'Insert YouTube'
  return 'Insert Google Map'
})

const mediaPlaceholder = computed(() => {
  if (mediaType.value === 'image-url') return 'https://example.com/image.jpg'
  if (mediaType.value === 'pdf') return 'https://example.com/file.pdf atau iframe embed'
  if (mediaType.value === 'youtube') return 'https://www.youtube.com/watch?v=...'
  return 'Paste Google Maps embed URL atau iframe'
})

const hostname = computed(() => {
  return String(requestUrl.hostname || '')
    .replace(/^www\./, '')
    .toLowerCase()
})

const clientName = computed(() => {
  return String(config.public.clientName || '')
    .trim()
    .toLowerCase()
})

const mode = computed<Mode>(() => {
  if (hostname.value.includes('martopuro')) return 'martopuro'
  if (clientName.value.includes('martopuro')) return 'martopuro'

  return 'obayan'
})

const isMartopuro = computed(() => mode.value === 'martopuro')

const tenantSlug = computed(() => {
  if (isMartopuro.value) return 'martopuro'
  return String(config.public.clientName || 'obayan').trim().toLowerCase()
})

const profile = computed(() => {
  if (isMartopuro.value) {
    return {
      name: 'Desa Martopuro',
      title: 'Berita Informasi Desa',
      badge: 'Village News',
      icon: 'solar:buildings-3-bold-duotone',
      description:
        'Kelola berita, agenda, pengumuman, layanan publik, dan informasi resmi Desa Martopuro.',
      createLabel: 'Tulis Berita Desa',
      searchPlaceholder: 'Cari berita desa, pengumuman, layanan...',
      emptyDescription:
        'Belum ada berita desa. Mulai publikasikan informasi resmi, kegiatan, atau pengumuman untuk warga.',
      defaultCategory: 'Informasi Desa',
      titlePlaceholder: 'Contoh: Pemerintah Desa Martopuro Mengadakan Kegiatan Kerja Bakti',
      excerptPlaceholder:
        'Tulis ringkasan singkat agar warga mudah memahami isi berita...',
      publicBase: '/news',
      brand: '#2563eb',
      brandSoft: '#eff6ff',
      brandRing: 'rgba(37, 99, 235, 0.14)',
      categories: [
        'Informasi Desa',
        'Pengumuman',
        'Kegiatan Desa',
        'Layanan Publik',
        'Pembangunan',
        'APBDes',
        'UMKM',
        'Kesehatan',
        'Pendidikan'
      ]
    }
  }

  return {
    name: 'Obayan',
    title: 'Berita Informasi Obayan',
    badge: 'Platform News',
    icon: 'solar:widget-5-bold-duotone',
    description: 'Kelola berita, update produk, artikel edukasi, case study, dan informasi resmi platform Obayan.',
    createLabel: 'Tulis Artikel',
    searchPlaceholder: 'Cari artikel, update produk, tutorial...',
    emptyDescription:
      'Belum ada artikel. Mulai publikasikan update produk, tutorial, atau informasi resmi Obayan.',
    defaultCategory: 'Update Produk',
    titlePlaceholder: 'Contoh: Obayan Merilis Modul Website Desa dan Pesantren',
    excerptPlaceholder:
      'Tulis ringkasan artikel agar pembaca memahami poin utamanya...',
    publicBase: '/news',
    brand: '#58cc02',
    brandSoft: '#f0fdf4',
    brandRing: 'rgba(88, 204, 2, 0.16)',
    categories: [
      'Update Produk',
      'Pengumuman',
      'Tutorial',
      'Case Study',
      'Edukasi',
      'Website',
      'SIAKAD',
      'CBT',
      'Pembayaran'
    ]
  }
})

const themeVars = computed<Record<string, string>>(() => ({
  '--brand': profile.value.brand,
  '--brand-soft': profile.value.brandSoft,
  '--brand-ring': profile.value.brandRing
}))

const categoryOptions = computed(() => profile.value.categories)

const rawItems = computed<any[]>(() => {
  const direct =
    unref(newsSQL.items) ||
    unref(newsSQL.news) ||
    unref(newsSQL.rows) ||
    unref(newsSQL.data)

  if (Array.isArray(direct)) return direct
  if (Array.isArray(direct?.data)) return direct.data

  return []
})

const isLoading = computed(() => {
  return Boolean(unref(newsSQL.pending) || unref(newsSQL.loading))
})

const visibleError = computed(() => {
  const value =
    unref(newsSQL.error) ||
    unref(newsSQL.errorMessage) ||
    ''

  if (!value) return ''
  if (typeof value === 'string') return value
  return value?.message || 'Terjadi kesalahan saat memuat berita.'
})

const normalizedNews = computed<NewsItem[]>(() => {
  return rawItems.value
    .map(normalizeNewsItem)
    .filter((item) => {
      if (!item.id) return false

      const itemTenant = String(item.tenantSlug || tenantSlug.value).toLowerCase()
      return itemTenant === tenantSlug.value || !item.tenantSlug
    })
    .sort((a, b) => Number(b.publishedAt || 0) - Number(a.publishedAt || 0))
})

const filteredNews = computed(() => {
  const q = search.value.trim().toLowerCase()

  return normalizedNews.value.filter((item) => {
    const matchSearch =
      !q ||
      [
        item.title,
        item.slug,
        item.excerpt,
        item.category,
        ...item.tags
      ]
        .join(' ')
        .toLowerCase()
        .includes(q)

    const matchCategory =
      selectedCategory.value === 'all' ||
      item.category === selectedCategory.value

    const matchStatus =
      selectedStatus.value === 'all' ||
      item.status === selectedStatus.value

    return matchSearch && matchCategory && matchStatus
  })
})

const pagedNews = computed(() => {
  return filteredNews.value.slice(0, page.value * pageSize)
})

const hasMore = computed(() => {
  return pagedNews.value.length < filteredNews.value.length
})

const stats = computed(() => {
  const total = normalizedNews.value.length
  const published = normalizedNews.value.filter((item) => item.status === 'published').length
  const draft = normalizedNews.value.filter((item) => item.status === 'draft').length
  const scheduled = normalizedNews.value.filter((item) => item.status === 'scheduled').length

  return [
    {
      label: 'Total Berita',
      value: String(total),
      icon: 'solar:documents-bold-duotone',
      description: isMartopuro.value
        ? 'Total berita dan informasi Desa Martopuro.'
        : 'Total artikel dan berita Obayan.'
    },
    {
      label: 'Published',
      value: String(published),
      icon: 'solar:check-circle-bold-duotone',
      description: 'Konten yang sudah dapat ditampilkan publik.'
    },
    {
      label: 'Draft',
      value: String(draft),
      icon: 'solar:document-add-bold-duotone',
      description: 'Konten yang masih dalam proses penulisan.'
    },
    {
      label: 'Scheduled',
      value: String(scheduled),
      icon: 'solar:calendar-mark-bold-duotone',
      description: 'Konten yang dijadwalkan untuk terbit.'
    }
  ]
})

const publishedAtLocal = computed({
  get() {
    const date = new Date(form.publishedAt || Date.now())
    const pad = (value: number) => String(value).padStart(2, '0')

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  },
  set(value: string) {
    const time = value ? new Date(value).getTime() : Date.now()
    if (!Number.isNaN(time)) form.publishedAt = time
  }
})

const readTime = computed(() => {
  const text = editor.value?.getText() || ''
  return estimateReadTime(text)
})

const editorButtons = computed(() => {
  const ed = editor.value

  if (!ed) return []

  return [
    {
      label: 'P',
      icon: 'solar:text-bold-duotone',
      active: () => ed.isActive('paragraph'),
      action: () => ed.chain().focus().setParagraph().run()
    },
    {
      label: 'H2',
      icon: 'solar:text-square-bold-duotone',
      active: () => ed.isActive('heading', { level: 2 }),
      action: () => ed.chain().focus().toggleHeading({ level: 2 }).run()
    },
    {
      label: 'H3',
      icon: 'solar:text-square-2-bold-duotone',
      active: () => ed.isActive('heading', { level: 3 }),
      action: () => ed.chain().focus().toggleHeading({ level: 3 }).run()
    },
    {
      label: 'Bold',
      icon: 'solar:text-bold-bold-duotone',
      active: () => ed.isActive('bold'),
      action: () => ed.chain().focus().toggleBold().run()
    },
    {
      label: 'Italic',
      icon: 'solar:text-italic-bold-duotone',
      active: () => ed.isActive('italic'),
      action: () => ed.chain().focus().toggleItalic().run()
    },
    {
      label: 'List',
      icon: 'solar:list-bold-duotone',
      active: () => ed.isActive('bulletList'),
      action: () => ed.chain().focus().toggleBulletList().run()
    },
    {
      label: 'Number',
      icon: 'solar:list-down-bold-duotone',
      active: () => ed.isActive('orderedList'),
      action: () => ed.chain().focus().toggleOrderedList().run()
    },
    {
      label: 'Quote',
      icon: 'solar:quote-up-bold-duotone',
      active: () => ed.isActive('blockquote'),
      action: () => ed.chain().focus().toggleBlockquote().run()
    },
    {
      label: 'Undo',
      icon: 'solar:undo-left-bold-duotone',
      active: () => false,
      action: () => ed.chain().focus().undo().run()
    },
    {
      label: 'Redo',
      icon: 'solar:undo-right-bold-duotone',
      active: () => false,
      action: () => ed.chain().focus().redo().run()
    }
  ]
})

watch(search, () => {
  page.value = 1
})

watch(selectedCategory, () => {
  page.value = 1
})

watch(selectedStatus, () => {
  page.value = 1
})

useSeoMeta({
  title: () => `${profile.value.title} · ${profile.value.name}`,
  description: () => profile.value.description,
  ogTitle: () => `${profile.value.title} · ${profile.value.name}`,
  ogDescription: () => profile.value.description,
  robots: 'noindex, nofollow',
  themeColor: () => profile.value.brand
})

useHead(() => ({
  htmlAttrs: {
    lang: 'id'
  },
  meta: [
    {
      name: 'theme-color',
      content: profile.value.brand
    }
  ]
}))

onMounted(async () => {
  ensureEditor()
  await reloadNews()
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

const PdfEmbed = Node.create({
  name: 'pdfEmbed',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null
      },
      title: {
        default: 'PDF Document'
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[data-type="pdf-embed"]'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'iframe',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'pdf-embed',
        src: HTMLAttributes.src,
        title: HTMLAttributes.title || 'PDF Document',
        class: 'tiptap-embed tiptap-pdf',
        loading: 'lazy'
      })
    ]
  },

  addCommands() {
    return {
      setPdfEmbed:
        (attrs: any) =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
            attrs
          })
        }
    } as any
  }
})

const MapEmbed = Node.create({
  name: 'mapEmbed',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null
      },
      title: {
        default: 'Map Location'
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[data-type="map-embed"]'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'iframe',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'map-embed',
        src: HTMLAttributes.src,
        title: HTMLAttributes.title || 'Map Location',
        class: 'tiptap-embed tiptap-map',
        loading: 'lazy',
        allowfullscreen: 'true',
        referrerpolicy: 'no-referrer-when-downgrade'
      })
    ]
  },

  addCommands() {
    return {
      setMapEmbed:
        (attrs: any) =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
            attrs
          })
        }
    } as any
  }
})

function ensureEditor() {
  if (editor.value) return

  editor.value = new Editor({
    content: '<p></p>',
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3]
        }
      }),

      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: 'rounded-2xl border border-neutral-200'
        }
      }),

      Youtube.configure({
        controls: true,
        nocookie: true,
        HTMLAttributes: {
          class: 'rounded-2xl overflow-hidden'
        }
      }),

      PdfEmbed,
      MapEmbed
    ],
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[320px] prose prose-neutral max-w-none'
      }
    }
  })
}

async function reloadNews() {
  try {
    const fn =
      newsSQL.loadNews ||
      newsSQL.fetchNews ||
      newsSQL.fetchItems ||
      newsSQL.refresh

    if (typeof fn === 'function') {
      await fn({
        tenantSlug: tenantSlug.value
      })
    }
  } catch (error: any) {
    showToast(
      'error',
      'Gagal Memuat Berita',
      error?.message || 'Data berita gagal dimuat.'
    )
  }
}

function resetForm() {
  formStep.value = 1
  formTouched.value = false

  form.title = ''
  form.slug = ''
  form.excerpt = ''
  form.cover = ''
  form.category = profile.value.defaultCategory
  form.tags = []
  form.tagInput = ''
  form.status = 'published'
  form.publishedAt = Date.now()

  formError.value = ''
  selectedNews.value = null
  manualSlugEdited.value = false

  coverMode.value = 'upload'
  coverFile.value = null
  coverLocalPreview.value = ''

  if (coverInput.value) {
    coverInput.value.value = ''
  }

  ensureEditor()
  editor.value?.commands.setContent('<p></p>')
}

function openCreate() {
  formMode.value = 'create'
  resetForm()
  showForm.value = true

  nextTick(() => {
    ensureEditor()
    editor.value?.commands.focus()
  })
}

function openEdit(item: NewsItem) {
  formMode.value = 'edit'
  formStep.value = 1
  formTouched.value = false

  selectedNews.value = item
  form.title = item.title
  form.slug = item.slug
  form.excerpt = item.excerpt || ''
  form.cover = item.cover || ''
  form.category = item.category || profile.value.defaultCategory
  form.tags = [...(item.tags || [])]
  form.tagInput = ''
  form.status = item.status || 'published'
  form.publishedAt = item.publishedAt || Date.now()

  formError.value = ''
  manualSlugEdited.value = true

  coverMode.value = item.cover ? 'url' : 'upload'
  coverFile.value = null
  coverLocalPreview.value = ''

  if (coverInput.value) {
    coverInput.value.value = ''
  }

  ensureEditor()
  const rawItem = item as any

  setEditorContent(
    rawItem.content ||
    rawItem.descriptionContent ||
    '<p></p>'
  )

  showForm.value = true
}

function closeForm() {
  showForm.value = false
  formError.value = ''
}

function openDelete(item: NewsItem) {
  selectedNews.value = item
  showDelete.value = true
}

function validateCurrentFormStep() {
  formTouched.value = true
  formError.value = ''

  if (formStep.value === 1) {
    if (!form.title.trim()) {
      formError.value = 'Judul wajib diisi.'
      return false
    }

    if (!form.slug.trim()) {
      form.slug = slugify(form.title)
    }

    if (!form.category) {
      formError.value = 'Kategori wajib dipilih.'
      return false
    }

    return true
  }

  if (formStep.value === 2) {
    if (coverMode.value === 'url' && form.cover && !isValidUrl(form.cover)) {
      formError.value = 'URL gambar tidak valid.'
      return false
    }

    return true
  }

  if (formStep.value === 3) {
    const text = editor.value?.getText().trim() || ''

    if (text.length < 10) {
      formError.value = 'Konten berita minimal 10 karakter.'
      return false
    }

    return true
  }

  return true
}

function validateAllFormSteps() {
  const current = formStep.value

  for (const step of formSteps) {
    formStep.value = step.value

    if (!validateCurrentFormStep()) {
      return false
    }
  }

  formStep.value = current
  formError.value = ''

  return true
}

function nextFormStep() {
  if (!validateCurrentFormStep()) return

  formTouched.value = false
  formError.value = ''
  formStep.value = Math.min(formStep.value + 1, formSteps.length)
}

function prevFormStep() {
  formTouched.value = false
  formError.value = ''
  formStep.value = Math.max(formStep.value - 1, 1)
}

function goToFormStep(targetStep: number) {
  if (targetStep <= formStep.value) {
    formTouched.value = false
    formError.value = ''
    formStep.value = targetStep
    return
  }

  nextFormStep()
}

function setCoverMode(mode: CoverMode) {
  coverMode.value = mode
  formError.value = ''
}

function triggerPickCover() {
  coverInput.value?.click()
}

function onPickCover(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] || null

  if (!file) return

  coverFile.value = file

  if (coverLocalPreview.value) {
    URL.revokeObjectURL(coverLocalPreview.value)
  }

  coverLocalPreview.value = URL.createObjectURL(file)
  formError.value = ''
}

function clearCover() {
  coverFile.value = null
  form.cover = ''

  if (coverLocalPreview.value) {
    URL.revokeObjectURL(coverLocalPreview.value)
  }

  coverLocalPreview.value = ''

  if (coverInput.value) {
    coverInput.value.value = ''
  }
}

function addTagFromInput() {
  const raw = form.tagInput.trim()

  if (!raw) return

  const tags = raw
    .split(/[,\s]+/)
    .map((tag) => normalizeTag(tag))
    .filter(Boolean)

  for (const tag of tags) {
    if (!form.tags.includes(tag)) {
      form.tags.push(tag)
    }
  }

  form.tagInput = ''
}

function onPasteTags(event: ClipboardEvent) {
  const text = event.clipboardData?.getData('text') || ''

  if (!text.includes(',') && !text.includes(' ')) return

  event.preventDefault()

  const tags = text
    .split(/[,\s]+/)
    .map((tag) => normalizeTag(tag))
    .filter(Boolean)

  for (const tag of tags) {
    if (!form.tags.includes(tag)) {
      form.tags.push(tag)
    }
  }

  form.tagInput = ''
}

function removeTag(tag: string) {
  form.tags = form.tags.filter((item) => item !== tag)
}

function normalizeTag(value: string) {
  return String(value || '')
    .trim()
    .replace(/^#/, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-_]/g, '')
    .toLowerCase()
}

function triggerEditorImageUpload() {
  editorImageInput.value?.click()
}

async function onPickEditorImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] || null

  if (!file) return

  try {
    const result = await uploadImage(file, {
      folder: `${tenantSlug.value}/news/content`,
      maxWidth: 1600,
      maxHeight: 1600,
      quality: 0.82,
      maxBytes: 5 * 1024 * 1024
    })

    editor.value
      ?.chain()
      .focus()
      .setImage({
        src: result.secure_url,
        alt: file.name
      })
      .run()

    showToast(
      'success',
      'Gambar Ditambahkan',
      'Gambar berhasil diupload ke Cloudinary dan dimasukkan ke konten.'
    )
  } catch (error: any) {
    showToast(
      'error',
      'Upload Gagal',
      error?.message || 'Gambar gagal diupload.'
    )
  } finally {
    if (editorImageInput.value) {
      editorImageInput.value.value = ''
    }
  }
}

function openMediaModal(type: MediaType) {
  mediaType.value = type
  mediaForm.url = ''
  mediaForm.title = ''
  mediaError.value = ''
  showMediaModal.value = true
}

function closeMediaModal() {
  showMediaModal.value = false
  mediaError.value = ''
}

function confirmInsertMedia() {
  mediaError.value = ''

  const rawUrl = mediaForm.url.trim()
  const url = extractIframeSrc(rawUrl)

  if (!url || !isValidUrl(url)) {
    mediaError.value = 'URL atau iframe embed tidak valid.'
    return
  }

  ensureEditor()

  if (mediaType.value === 'image-url') {
    editor.value
      ?.chain()
      .focus()
      .setImage({
        src: url,
        alt: mediaForm.title || 'Image'
      })
      .run()
  }

  if (mediaType.value === 'pdf') {
    ;(editor.value?.commands as any).setPdfEmbed({
      src: url,
      title: mediaForm.title || 'PDF Document'
    })
  }

  if (mediaType.value === 'youtube') {
    editor.value
      ?.chain()
      .focus()
      .setYoutubeVideo({
        src: url,
        width: 720,
        height: 405
      })
      .run()
  }

  if (mediaType.value === 'map') {
    ;(editor.value?.commands as any).setMapEmbed({
      src: url,
      title: mediaForm.title || 'Map Location'
    })
  }

  closeMediaModal()
}

function extractIframeSrc(value: string) {
  const source = String(value || '').trim()

  const match = source.match(/src=["']([^"']+)["']/i)

  return match?.[1] || source
}

async function resolveCoverUrlBeforeSubmit() {
  if (coverMode.value === 'url') {
    const url = form.cover.trim()

    if (url && !isValidUrl(url)) {
      throw new Error('URL gambar tidak valid.')
    }

    return url
  }

  if (!coverFile.value) {
    return form.cover.trim()
  }

  const result = await uploadImage(coverFile.value, {
    folder: `${tenantSlug.value}/news/covers`,
    maxWidth: 1600,
    maxHeight: 1600,
    quality: 0.82,
    maxBytes: 5 * 1024 * 1024
  })

  form.cover = result.secure_url

  return result.secure_url
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

function formatFileSize(bytes: number) {
  if (!bytes) return '0 KB'

  const kb = bytes / 1024

  if (kb < 1024) return `${Math.round(kb)} KB`

  return `${(kb / 1024).toFixed(1)} MB`
}

async function submitForm() {
  formError.value = ''

  if (!validateAllFormSteps()) return

  saving.value = true

  try {
    ensureEditor()

    const coverUrl = await resolveCoverUrlBeforeSubmit()

    const html = editor.value?.getHTML() || '<p></p>'
    const json = editor.value?.getJSON() || {}

    const payload: NewsPayload = {
      tenantSlug: tenantSlug.value,
      title: form.title.trim(),
      slug: slugify(form.slug || form.title),
      excerpt: form.excerpt.trim(),
      cover: coverUrl,
      category: form.category || profile.value.defaultCategory,
      tags: form.tags,
      status: form.status,
      publishedAt: form.publishedAt || Date.now(),
      readTime: estimateReadTime(editor.value?.getText() || ''),
      content: {
        kind: 'tiptap',
        json,
        html
      }
    }

    if (formMode.value === 'create') {
      await callCreateNews(payload)

      showToast(
        'success',
        'Berita Berhasil Dibuat',
        coverMode.value === 'upload' && coverFile.value
          ? 'Gambar berhasil diupload ke Cloudinary dan berita berhasil disimpan.'
          : 'Berita berhasil disimpan ke database.'
      )
    } else if (selectedNews.value) {
      await callUpdateNews(selectedNews.value.id, payload)

      showToast(
        'success',
        'Berita Berhasil Diupdate',
        coverMode.value === 'upload' && coverFile.value
          ? 'Gambar baru berhasil diupload ke Cloudinary dan berita berhasil diupdate.'
          : 'Perubahan berita berhasil disimpan.'
      )
    }

    showForm.value = false
    await reloadNews()
  } catch (error: any) {
    const message =
      error?.data?.statusMessage ||
      error?.data?.message ||
      error?.statusMessage ||
      error?.message ||
      'Gagal menyimpan berita.'

    formError.value = message

    showToast(
      'error',
      'Gagal Menyimpan',
      message
    )
  } finally {
    saving.value = false
  }
}

async function confirmDelete() {
  if (!selectedNews.value) return

  deleting.value = true

  try {
    await callDeleteNews(selectedNews.value.id)

    showDelete.value = false

    showToast(
      'success',
      'Berita Dihapus',
      'Data berita berhasil dihapus.'
    )

    await reloadNews()
  } catch (error: any) {
    showToast(
      'error',
      'Gagal Menghapus',
      error?.message || 'Data berita gagal dihapus.'
    )
  } finally {
    deleting.value = false
  }
}

async function callCreateNews(payload: NewsPayload) {
  const fn =
    newsSQL.createNews ||
    newsSQL.createItem

  if (typeof fn !== 'function') {
    throw new Error('Function createNews tidak ditemukan di useNewsSQL.')
  }

  if (!payload) {
    throw new Error('Payload berita tidak boleh kosong.')
  }

  return await fn(payload)
}

async function callUpdateNews(id: string, payload: NewsPayload) {
  const fn =
    newsSQL.updateNews ||
    newsSQL.updateItem

  if (typeof fn !== 'function') {
    throw new Error('Function updateNews tidak ditemukan di useNewsSQL.')
  }

  if (!id) {
    throw new Error('ID berita tidak ditemukan.')
  }

  if (!payload) {
    throw new Error('Payload berita tidak boleh kosong.')
  }

  return await fn(id, payload)
}

async function callDeleteNews(id: string) {
  const fn =
    newsSQL.deleteNews ||
    newsSQL.removeNews ||
    newsSQL.deleteItem ||
    newsSQL.remove ||
    newsSQL.destroy

  if (typeof fn !== 'function') {
    throw new Error('Function deleteNews tidak ditemukan di useNewsSQL.')
  }

  return await fn(id)
}

function normalizeNewsItem(item: any): NewsItem {
  const content = normalizeContent(item?.content || item?.body || item?.description)
  const publishedAt = normalizeDate(item?.publishedAt || item?.published_at || item?.createdAt || item?.created_at)

  return {
    id: String(item?.id || item?.uuid || item?._id || ''),
    title: String(item?.title || 'Tanpa Judul'),
    slug: String(item?.slug || slugify(item?.title || 'tanpa-judul')),
    excerpt: String(item?.excerpt || item?.summary || ''),
    cover: String(item?.cover || item?.coverUrl || item?.cover_url || item?.image || ''),
    category: String(item?.category || profile.value.defaultCategory),
    tags: normalizeTags(item?.tags),
    status: normalizeStatus(item?.status),
    publishedAt,
    readTime: Number(item?.readTime || item?.read_time || estimateReadTime(plainTextFromContent(content))),
    tenantSlug: String(item?.tenantSlug || item?.tenant_slug || ''),
    content,
    createdAt: normalizeDate(item?.createdAt || item?.created_at),
    updatedAt: normalizeDate(item?.updatedAt || item?.updated_at)
  }
}

function normalizeStatus(value: any): NewsStatus {
  const status = String(value || 'published').toLowerCase()

  if (status === 'draft') return 'draft'
  if (status === 'scheduled') return 'scheduled'

  return 'published'
}

function normalizeDate(value: any) {
  if (!value) return Date.now()

  if (typeof value === 'number') {
    if (value < 10_000_000_000) return value * 1000
    return value
  }

  const parsed = new Date(value).getTime()
  return Number.isNaN(parsed) ? Date.now() : parsed
}

function normalizeTags(value: any): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return normalizeTags(parsed)
    } catch {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    }
  }

  return []
}

function normalizeContent(value: any): NewsContent {
  if (!value) return { kind: 'tiptap', html: '<p></p>' }

  if (typeof value === 'object') return value

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (typeof parsed === 'object') return parsed
    } catch {
      return value
    }
  }

  return String(value)
}

function setEditorContent(content?: NewsContent) {
  ensureEditor()

  if (!content) {
    editor.value?.commands.setContent('<p></p>')
    return
  }

  if (typeof content === 'string') {
    editor.value?.commands.setContent(content.trim() || '<p></p>')
    return
  }

  if (content.kind === 'tiptap' && content.json) {
    editor.value?.commands.setContent(content.json)
    return
  }

  if (content.html) {
    editor.value?.commands.setContent(content.html)
    return
  }

  editor.value?.commands.setContent('<p></p>')
}

function syncSlugFromTitle() {
  if (formMode.value === 'edit') return
  if (manualSlugEdited.value && form.slug) return

  form.slug = slugify(form.title)
}

function slugify(value: string) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function tagsFromInput(value: string) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function plainTextFromContent(content?: NewsContent) {
  if (!content) return ''

  if (typeof content === 'string') {
    return content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  }

  if (content.html) {
    return content.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  }

  return ''
}

function estimateReadTime(text: string) {
  const words = String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(1, Math.ceil(words / 200))
}

function formatDate(value: number) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value || Date.now()))
}

function statusLabel(status: NewsStatus) {
  if (status === 'draft') return 'Draft'
  if (status === 'scheduled') return 'Scheduled'
  return 'Published'
}

function statusClass(status: NewsStatus) {
  if (status === 'draft') return 'bg-amber-100/90 text-amber-800'
  if (status === 'scheduled') return 'bg-blue-100/90 text-blue-800'
  return 'bg-emerald-100/90 text-emerald-800'
}

function publicNewsUrl(item: NewsItem) {
  return `${profile.value.publicBase}?slug=${encodeURIComponent(item.slug)}`
}

function showToast(type: ToastType, title: string, message: string) {
  if (toastTimer) clearTimeout(toastTimer)

  toast.type = type
  toast.title = title
  toast.message = message
  toast.show = true

  toastTimer = setTimeout(() => {
    toast.show = false
  }, 3500)
}

function closeToast() {
  if (toastTimer) clearTimeout(toastTimer)
  toast.show = false
}

const ReviewRow = defineComponent({
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },
  setup(props) {
    return () =>
      h('div', {
        class: 'flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3'
      }, [
        h('span', {
          class: 'text-sm font-bold text-neutral-500'
        }, props.label),
        h('span', {
          class: 'min-w-0 truncate text-right text-sm font-black text-neutral-950'
        }, props.value)
      ])
  }
})
</script>

<style scoped>
.editor-content :deep(.ProseMirror) {
  min-height: 320px;
  outline: none;
}

.editor-content :deep(.ProseMirror p) {
  margin: 0.75rem 0;
}

.editor-content :deep(.ProseMirror h2) {
  margin: 1.25rem 0 0.75rem;
  font-size: 1.5rem;
  font-weight: 900;
  line-height: 1.25;
}

.editor-content :deep(.ProseMirror h3) {
  margin: 1rem 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 900;
  line-height: 1.3;
}

.editor-content :deep(.ProseMirror ul),
.editor-content :deep(.ProseMirror ol) {
  margin: 0.75rem 0;
  padding-left: 1.25rem;
}

.editor-content :deep(.ProseMirror blockquote) {
  margin: 1rem 0;
  border-left: 4px solid #171717;
  padding-left: 1rem;
  color: #525252;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.editor-content :deep(.ProseMirror img) {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
  border-radius: 1rem;
}

.editor-content :deep(.ProseMirror iframe) {
  width: 100%;
  min-height: 380px;
  margin: 1rem 0;
  border: 0;
  border-radius: 1rem;
  background: #f5f5f5;
}

.editor-content :deep(.ProseMirror .tiptap-pdf) {
  min-height: 520px;
}

.editor-content :deep(.ProseMirror .tiptap-map) {
  min-height: 420px;
}
</style>