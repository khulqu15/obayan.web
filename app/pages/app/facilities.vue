<template>
  <section class="min-h-full bg-neutral-50" :style="themeVars">
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
        <div v-if="toast.show" class="fixed right-4 top-4 z-[9999] w-[calc(100%-2rem)] max-w-sm">
          <div
            class="rounded-3xl border bg-white/95 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl"
            :class="toast.type === 'success' ? 'border-emerald-200' : 'border-red-200'"
          >
            <div class="flex items-start gap-3">
              <div
                class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
                :class="toast.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'"
              >
                <Icon
                  :icon="toast.type === 'success' ? 'solar:check-circle-bold-duotone' : 'solar:danger-circle-bold-duotone'"
                  class="h-6 w-6"
                />
              </div>

              <div class="min-w-0 flex-1">
                <p class="text-sm font-black text-neutral-950">{{ toast.title }}</p>
                <p class="mt-1 text-sm font-semibold leading-6 text-neutral-500">{{ toast.message }}</p>
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
              @click="reloadFacilities"
            >
              <Icon icon="solar:refresh-bold-duotone" class="h-5 w-5" :class="isLoading ? 'animate-spin' : ''" />
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
        <div class="grid gap-3 lg:grid-cols-[1fr_220px_180px_180px]">
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
              <Icon icon="solar:magnifer-linear" class="h-5 w-5" />
            </div>

            <input
              v-model.trim="search"
              type="text"
              :placeholder="profile.searchPlaceholder"
              class="input-field py-3 pl-12"
            >
          </div>

          <select v-model="selectedType" class="input-field">
            <option value="all">Semua Tipe</option>
            <option v-for="item in typeOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </option>
          </select>

          <select v-model="selectedStatus" class="input-field">
            <option value="all">Semua Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select v-model="sortBy" class="input-field">
            <option value="sort_order">Sort Order</option>
            <option value="title">Title A-Z</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </section>

      <!-- Error -->
      <div v-if="visibleError" class="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-700">
        {{ visibleError }}
      </div>

      <!-- Stats -->
      <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article v-for="stat in stats" :key="stat.label" class="rounded-[1.75rem] border border-neutral-200 bg-white p-5 shadow-sm">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-bold text-neutral-500">{{ stat.label }}</p>
              <h2 class="mt-3 text-3xl font-black text-neutral-950">{{ stat.value }}</h2>
            </div>

            <div class="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
              <Icon :icon="stat.icon" class="h-6 w-6" />
            </div>
          </div>

          <p class="mt-4 text-xs font-semibold leading-5 text-neutral-500">{{ stat.description }}</p>
        </article>
      </section>

      <!-- Loading -->
      <section v-if="isLoading" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div v-for="item in 6" :key="item" class="h-96 animate-pulse rounded-[2rem] border border-neutral-200 bg-white p-4">
          <div class="h-48 rounded-3xl bg-neutral-100"></div>
          <div class="mt-4 h-4 w-2/3 rounded-full bg-neutral-100"></div>
          <div class="mt-3 h-3 w-full rounded-full bg-neutral-100"></div>
          <div class="mt-2 h-3 w-4/5 rounded-full bg-neutral-100"></div>
        </div>
      </section>

      <!-- Empty -->
      <section
        v-else-if="filteredFacilities.length === 0"
        class="rounded-[2rem] border border-dashed border-neutral-300 bg-white p-10 text-center shadow-sm"
      >
        <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-neutral-100 text-neutral-500">
          <Icon icon="solar:map-point-wave-bold-duotone" class="h-8 w-8" />
        </div>

        <h2 class="mt-5 text-xl font-black text-neutral-950">Belum ada fasilitas</h2>

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

      <!-- Grid -->
      <section v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="item in pagedFacilities"
          :key="item.id"
          class="group overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div class="relative h-52 bg-neutral-100">
            <img
              v-if="getFacilityCover(item)"
              :src="getFacilityCover(item)"
              :alt="item.title"
              class="h-full w-full object-cover"
            >

            <div v-else class="flex h-full w-full items-center justify-center bg-neutral-100 text-neutral-400">
              <Icon :icon="item.icon || defaultIconByType(item.facilityType)" class="h-10 w-10" />
            </div>

            <div class="absolute left-3 top-3 flex flex-wrap gap-2">
              <span class="rounded-full bg-neutral-950/80 px-3 py-1 text-xs font-black text-white backdrop-blur">
                {{ facilityTypeLabel(item.facilityType) }}
              </span>

              <span class="rounded-full px-3 py-1 text-xs font-black backdrop-blur" :class="statusClass(item.status)">
                {{ item.status }}
              </span>

              <span v-if="item.isFeatured" class="rounded-full bg-blue-600 px-3 py-1 text-xs font-black text-white backdrop-blur">
                Featured
              </span>
            </div>

            <span
              v-if="getFacilityImages(item).length > 1"
              class="absolute bottom-3 right-3 rounded-full bg-neutral-950/80 px-3 py-1 text-xs font-black text-white backdrop-blur"
            >
              {{ getFacilityImages(item).length }} Foto
            </span>
          </div>

          <div class="p-5">
            <div class="mb-3 flex items-center justify-between gap-3">
              <p class="truncate text-xs font-black uppercase tracking-[0.14em] text-[var(--brand)]">
                {{ tenantSlug }}
              </p>

              <p class="shrink-0 text-xs font-bold text-neutral-400">
                Urutan {{ item.sortOrder || 0 }}
              </p>
            </div>

            <h3 class="line-clamp-2 text-lg font-black leading-7 text-neutral-950">
              {{ item.title }}
            </h3>

            <div class="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-black text-[var(--brand)]">
              <Icon :icon="item.icon || defaultIconByType(item.facilityType)" class="h-4 w-4" />
              {{ facilityTypeLabel(item.facilityType) }}
            </div>

            <p class="mt-2 line-clamp-3 text-sm font-medium leading-6 text-neutral-500">
              {{ item.subtitle || stripHtml(item.contentHtml || '').slice(0, 140) || 'Belum ada deskripsi.' }}
            </p>

            <div class="mt-4 grid gap-2 text-xs font-semibold text-neutral-500">
              <div v-if="item.phone || item.whatsapp" class="flex items-center gap-2">
                <Icon icon="solar:phone-bold-duotone" class="h-4 w-4 text-neutral-400" />
                <span class="truncate">{{ item.whatsapp || item.phone }}</span>
              </div>

              <div v-if="item.address" class="flex items-center gap-2">
                <Icon icon="solar:map-point-bold-duotone" class="h-4 w-4 text-neutral-400" />
                <span class="truncate">{{ item.address }}</span>
              </div>
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
                :to="`/facilities/${item.slug}`"
                target="_blank"
                class="ms-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-black text-neutral-600 transition hover:bg-neutral-50"
              >
                Buka
                <Icon icon="solar:arrow-right-linear" class="h-4 w-4" />
              </NuxtLink>
            </div>
          </div>
        </article>
      </section>

      <!-- Pagination -->
      <div v-if="hasMore && !isLoading" class="flex justify-center">
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
        <div v-if="showForm" class="fixed inset-0 z-[9990] overflow-y-auto bg-neutral-950/50 p-3 backdrop-blur-sm sm:p-5">
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
                      {{ formMode === 'create' ? profile.createLabel : 'Edit Fasilitas' }}
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
                    <div class="h-full rounded-full bg-[var(--brand)] transition-all duration-300" :style="{ width: `${formStepProgress}%` }"></div>
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
                          <Icon :icon="step.value < formStep ? 'solar:check-circle-bold-duotone' : step.icon" class="h-5 w-5" />
                        </div>

                        <span class="text-xs font-black text-neutral-400">0{{ step.value }}</span>
                      </div>

                      <p class="mt-2 text-sm font-black text-neutral-950">{{ step.title }}</p>
                      <p class="mt-1 text-xs font-semibold leading-5 text-neutral-500">{{ step.description }}</p>
                    </button>
                  </div>
                </div>
              </div>

              <form class="p-5" @submit.prevent="submitForm">
                <!-- Step 1 -->
                <div v-if="formStep === 1" class="space-y-5">
                  <div class="rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-5">
                    <div class="flex items-start gap-4">
                      <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[var(--brand)] shadow-sm">
                        <Icon icon="solar:map-point-wave-bold-duotone" class="h-5 w-5" />
                      </div>

                      <div>
                        <h3 class="text-base font-black text-neutral-950">Identitas Fasilitas</h3>
                        <p class="mt-1 text-sm font-medium leading-6 text-neutral-500">
                          Isi nama, slug, tipe fasilitas, icon, status, featured, dan urutan tampil.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="grid gap-4 lg:grid-cols-2">
                    <div>
                      <label class="mb-2 block text-sm font-black text-neutral-700">Nama Fasilitas</label>
                      <input
                        v-model.trim="form.title"
                        type="text"
                        required
                        placeholder="Contoh: Puskesmas Pembantu Martopuro"
                        class="input-field"
                        @input="syncSlugFromTitle"
                      >
                      <p v-if="formTouched && !form.title.trim()" class="mt-2 text-xs font-bold text-red-600">
                        Nama fasilitas wajib diisi.
                      </p>
                    </div>

                    <div>
                      <label class="mb-2 block text-sm font-black text-neutral-700">Slug</label>
                      <input
                        v-model.trim="form.slug"
                        type="text"
                        required
                        placeholder="puskesmas-pembantu-martopuro"
                        class="input-field"
                        @input="manualSlugEdited = true"
                      >
                    </div>

                    <div>
                      <label class="mb-2 block text-sm font-black text-neutral-700">Tipe Fasilitas</label>
                      <select v-model="form.facilityType" class="input-field">
                        <option v-for="item in typeOptions" :key="item.value" :value="item.value">
                          {{ item.label }}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label class="mb-2 block text-sm font-black text-neutral-700">Icon Fasilitas</label>

                      <button
                        type="button"
                        class="flex w-full items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-left transition hover:border-[var(--brand)] hover:bg-white focus:border-[var(--brand)] focus:bg-white focus:ring-4 focus:ring-[var(--brand-ring)]"
                        @click="openIconPicker"
                      >
                        <span class="flex min-w-0 items-center gap-3">
                          <span class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[var(--brand)] shadow-sm">
                            <Icon :icon="form.icon || defaultIconByType(form.facilityType)" class="h-6 w-6" />
                          </span>

                          <span class="min-w-0">
                            <span class="block text-sm font-black text-neutral-900">{{ form.icon || 'Pilih icon' }}</span>
                            <span class="block truncate text-xs font-semibold text-neutral-500">Klik untuk mencari icon dari Iconify API</span>
                          </span>
                        </span>

                        <Icon icon="solar:magnifer-linear" class="h-5 w-5 shrink-0 text-neutral-400" />
                      </button>
                    </div>

                    <div>
                      <label class="mb-2 block text-sm font-black text-neutral-700">Status</label>
                      <select v-model="form.status" class="input-field">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div>
                      <label class="mb-2 block text-sm font-black text-neutral-700">Sort Order</label>
                      <input v-model.number="form.sortOrder" type="number" min="0" class="input-field">
                    </div>

                    <div class="lg:col-span-2">
                      <label class="inline-flex cursor-pointer items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                        <input v-model="form.isFeatured" type="checkbox" class="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900">
                        <span>
                          <span class="block text-sm font-black text-neutral-800">Tampilkan sebagai Featured</span>
                          <span class="block text-xs font-semibold text-neutral-500">Fasilitas akan diprioritaskan di section public website.</span>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Step 2 -->
                <div v-if="formStep === 2" class="space-y-5">
                  <div class="rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-5">
                    <div class="flex items-start gap-4">
                      <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[var(--brand)] shadow-sm">
                        <Icon icon="solar:gallery-wide-bold-duotone" class="h-5 w-5" />
                      </div>

                      <div>
                        <h3 class="text-base font-black text-neutral-950">Media Fasilitas</h3>
                        <p class="mt-1 text-sm font-medium leading-6 text-neutral-500">
                          Upload banyak gambar ke Cloudinary atau tambahkan link langsung. Semua gambar disimpan di <code>metadata.images</code> dan gambar pertama menjadi <code>imageUrl</code>.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="grid gap-5 lg:grid-cols-[1fr_340px]">
                    <div class="space-y-5">
                      <div class="rounded-[1.75rem] border border-neutral-200 bg-white p-5">
                        <div class="grid gap-4 lg:grid-cols-2">
                          <div>
                            <label class="mb-2 block text-sm font-black text-neutral-700">Logo URL</label>
                            <input v-model.trim="form.logoUrl" type="url" placeholder="https://..." class="input-field">
                          </div>

                          <div>
                            <label class="mb-2 block text-sm font-black text-neutral-700">Website URL</label>
                            <input v-model.trim="form.websiteUrl" type="url" placeholder="https://..." class="input-field">
                          </div>
                        </div>
                      </div>

                      <div class="rounded-[1.75rem] border border-neutral-200 bg-white p-5">
                        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h4 class="text-sm font-black text-neutral-950">Multiple Images</h4>
                            <p class="mt-1 text-xs font-semibold leading-5 text-neutral-500">Gambar pertama otomatis menjadi cover utama.</p>
                          </div>

                          <div class="flex flex-wrap gap-2">
                            <input
                              ref="imagesInput"
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              multiple
                              class="hidden"
                              @change="onPickImages"
                            >

                            <button type="button" class="inline-flex items-center gap-2 rounded-2xl bg-neutral-900 px-4 py-2.5 text-sm font-black text-white" @click="triggerPickImages">
                              <Icon icon="solar:cloud-upload-bold-duotone" class="h-5 w-5" />
                              Upload
                            </button>

                            <button type="button" class="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-black text-neutral-700" @click="showImageUrlForm = !showImageUrlForm">
                              <Icon icon="solar:link-bold-duotone" class="h-5 w-5" />
                              Link
                            </button>
                          </div>
                        </div>

                        <div v-if="showImageUrlForm" class="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
                          <div class="grid gap-2 sm:grid-cols-[1fr_auto]">
                            <input v-model.trim="imageUrlDraft" type="url" placeholder="https://example.com/image.jpg" class="input-field bg-white">

                            <button type="button" class="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-4 py-2.5 text-sm font-black text-white" @click="addImageUrl">
                              Tambah
                            </button>
                          </div>
                        </div>

                        <div v-if="form.images.length" class="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          <article v-for="(image, index) in form.images" :key="image.id" class="group overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
                            <div class="relative h-36 bg-neutral-100">
                              <img :src="image.preview || image.url" :alt="`Image ${index + 1}`" class="h-full w-full object-cover">

                              <span v-if="index === 0" class="absolute left-2 top-2 rounded-full bg-neutral-950 px-2.5 py-1 text-[10px] font-black text-white">
                                Cover
                              </span>
                            </div>

                            <div class="flex items-center justify-between gap-2 p-2">
                              <button type="button" class="rounded-xl px-3 py-2 text-xs font-black text-neutral-600 transition hover:bg-white" :disabled="index === 0" @click="moveImage(index, -1)">
                                ←
                              </button>

                              <button type="button" class="rounded-xl px-3 py-2 text-xs font-black text-neutral-600 transition hover:bg-white" :disabled="index === form.images.length - 1" @click="moveImage(index, 1)">
                                →
                              </button>

                              <button type="button" class="rounded-xl px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-50" @click="removeImage(index)">
                                Hapus
                              </button>
                            </div>
                          </article>
                        </div>

                        <div v-else class="mt-5 rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-neutral-400">
                          <Icon icon="solar:gallery-add-bold-duotone" class="mx-auto h-10 w-10" />
                          <p class="mt-2 text-sm font-bold">Belum ada gambar.</p>
                        </div>

                        <div v-if="imageUploadError" class="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                          {{ imageUploadError }}
                        </div>
                      </div>
                    </div>

                    <aside class="rounded-[1.75rem] border border-neutral-200 bg-white p-4">
                      <p class="mb-3 text-sm font-black text-neutral-950">Preview Cover</p>

                      <div class="h-64 overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-neutral-100">
                        <img v-if="coverPreviewUrl" :src="coverPreviewUrl" alt="Cover preview" class="h-full w-full object-cover">
                        <div v-else class="flex h-full w-full flex-col items-center justify-center text-neutral-400">
                          <Icon icon="solar:gallery-wide-bold-duotone" class="h-10 w-10" />
                          <p class="mt-2 text-xs font-bold">Belum ada gambar</p>
                        </div>
                      </div>

                      <div class="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                        <p class="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">Total Gambar</p>
                        <p class="mt-1 text-2xl font-black text-neutral-950">{{ form.images.length }}</p>
                      </div>
                    </aside>
                  </div>
                </div>

                <!-- Step 3 -->
                <div v-if="formStep === 3" class="space-y-5">
                  <div class="rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-5">
                    <div class="flex items-start gap-4">
                      <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[var(--brand)] shadow-sm">
                        <Icon icon="solar:pen-new-square-bold-duotone" class="h-5 w-5" />
                      </div>

                      <div>
                        <h3 class="text-base font-black text-neutral-950">Deskripsi, Lokasi & Kontak</h3>
                        <p class="mt-1 text-sm font-medium leading-6 text-neutral-500">
                          Isi ringkasan, alamat, koordinat, kontak, dan deskripsi lengkap menggunakan Tiptap editor.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="grid gap-4 lg:grid-cols-2">
                    <div class="lg:col-span-2">
                      <label class="mb-2 block text-sm font-black text-neutral-700">Subtitle / Deskripsi Singkat</label>
                      <textarea v-model.trim="form.subtitle" rows="3" placeholder="Ringkasan singkat untuk card dan section homepage." class="textarea-field"></textarea>
                    </div>

                    <div class="lg:col-span-2">
                      <label class="mb-2 block text-sm font-black text-neutral-700">Alamat</label>
                      <textarea v-model.trim="form.address" rows="3" class="textarea-field"></textarea>
                    </div>

                    <div>
                      <label class="mb-2 block text-sm font-black text-neutral-700">Latitude</label>
                      <input v-model.trim="form.latitude" type="text" placeholder="-7.1234567" class="input-field">
                    </div>

                    <div>
                      <label class="mb-2 block text-sm font-black text-neutral-700">Longitude</label>
                      <input v-model.trim="form.longitude" type="text" placeholder="112.1234567" class="input-field">
                    </div>

                    <div>
                      <label class="mb-2 block text-sm font-black text-neutral-700">Email</label>
                      <input v-model.trim="form.email" type="email" class="input-field">
                    </div>

                    <div>
                      <label class="mb-2 block text-sm font-black text-neutral-700">Phone</label>
                      <input v-model.trim="form.phone" type="text" class="input-field">
                    </div>

                    <div>
                      <label class="mb-2 block text-sm font-black text-neutral-700">WhatsApp</label>
                      <input v-model.trim="form.whatsapp" type="text" class="input-field">
                    </div>

                    <div>
                      <label class="mb-2 block text-sm font-black text-neutral-700">Website URL</label>
                      <input v-model.trim="form.websiteUrl" type="url" placeholder="https://..." class="input-field">
                    </div>
                  </div>

                  <div>
                    <div class="mb-2 flex items-center justify-between gap-3">
                      <label class="block text-sm font-black text-neutral-700">Deskripsi Lengkap</label>
                      <span class="text-xs font-bold text-neutral-400">Estimasi baca: {{ readTime }} menit</span>
                    </div>

                    <ClientOnly>
                      <div class="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white">
                        <!-- Compact toolbar -->
                        <div v-if="editor" class="flex items-center gap-1 border-b border-neutral-200 bg-neutral-50 p-2">
                          <button
                            v-for="button in primaryEditorButtons"
                            :key="button.label"
                            type="button"
                            class="editor-btn group relative"
                            :class="button.active() ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-white hover:text-neutral-950'"
                            @click="button.action"
                          >
                            <Icon :icon="button.icon" class="h-4 w-4" />
                            <span class="editor-tooltip">{{ button.label }}</span>
                          </button>

                          <div class="ms-auto flex items-center gap-1">
                            <button type="button" class="editor-btn group relative text-neutral-600 hover:bg-white hover:text-neutral-950" @click="triggerEditorImageUpload">
                              <Icon icon="solar:cloud-upload-bold-duotone" class="h-4 w-4" />
                              <span class="editor-tooltip">Upload Image</span>
                            </button>

                            <div class="relative">
                              <button type="button" class="editor-btn group relative text-neutral-600 hover:bg-white hover:text-neutral-950" @click="moreToolbarOpen = !moreToolbarOpen">
                                <Icon icon="solar:menu-dots-bold" class="h-4 w-4" />
                                <span class="editor-tooltip">More Tools</span>
                              </button>

                              <Transition
                                enter-active-class="transition duration-150 ease-out"
                                enter-from-class="translate-y-1 opacity-0"
                                enter-to-class="translate-y-0 opacity-100"
                                leave-active-class="transition duration-100 ease-in"
                                leave-from-class="translate-y-0 opacity-100"
                                leave-to-class="translate-y-1 opacity-0"
                              >
                                <div v-if="moreToolbarOpen" class="absolute right-0 top-11 z-40 w-64 rounded-3xl border border-neutral-200 bg-white p-2 shadow-[0_24px_80px_rgba(15,23,42,0.16)]">
                                  <button
                                    v-for="button in secondaryEditorButtons"
                                    :key="button.label"
                                    type="button"
                                    class="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-bold text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-950"
                                    @click="runMoreEditorAction(button.action)"
                                  >
                                    <Icon :icon="button.icon" class="h-5 w-5 text-neutral-400" />
                                    {{ button.label }}
                                  </button>

                                  <div class="my-2 border-t border-neutral-100"></div>

                                  <button
                                    v-for="item in mediaMenu"
                                    :key="item.type"
                                    type="button"
                                    class="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-bold text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-950"
                                    @click="openMediaFromMore(item.type)"
                                  >
                                    <Icon :icon="item.icon" class="h-5 w-5 text-neutral-400" />
                                    {{ item.label }}
                                  </button>
                                </div>
                              </Transition>
                            </div>
                          </div>

                          <input ref="editorImageInput" type="file" accept="image/jpeg,image/jpg,image/png,image/webp" class="hidden" @change="onPickEditorImage">
                        </div>

                        <div class="relative bg-white" @contextmenu.prevent="openEditorContextMenu" @click="contextToolbarOpen = false">
                          <EditorContent v-if="editor" :editor="editor" class="editor-content min-h-[420px] p-4" />

                          <!-- Right click context menu -->
                          <Transition
                            enter-active-class="transition duration-150 ease-out"
                            enter-from-class="scale-95 opacity-0"
                            enter-to-class="scale-100 opacity-100"
                            leave-active-class="transition duration-100 ease-in"
                            leave-from-class="scale-100 opacity-100"
                            leave-to-class="scale-95 opacity-0"
                          >
                            <div
                              v-if="contextToolbarOpen"
                              class="fixed z-[10000] w-64 rounded-3xl border border-neutral-200 bg-white p-2 shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
                              :style="{ left: `${contextToolbar.x}px`, top: `${contextToolbar.y}px` }"
                              @click.stop
                            >
                              <p class="px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-neutral-400">Quick Editor</p>

                              <button
                                v-for="button in contextEditorButtons"
                                :key="button.label"
                                type="button"
                                class="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-950"
                                @click="runContextAction(button.action)"
                              >
                                <Icon :icon="button.icon" class="h-5 w-5 text-neutral-400" />
                                {{ button.label }}
                              </button>
                            </div>
                          </Transition>
                        </div>

                        <div class="flex flex-col gap-2 border-t border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
                          <span>Toolbar compact. Klik ellipsis untuk media, PDF, YouTube, Map, undo, redo.</span>
                          <span>Klik kanan di editor untuk quick menu.</span>
                        </div>
                      </div>
                    </ClientOnly>
                  </div>
                </div>

                <!-- Step 4 -->
                <div v-if="formStep === 4" class="space-y-5">
                  <div class="rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-5">
                    <div class="flex items-start gap-4">
                      <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[var(--brand)] shadow-sm">
                        <Icon icon="solar:clipboard-check-bold-duotone" class="h-5 w-5" />
                      </div>

                      <div>
                        <h3 class="text-base font-black text-neutral-950">Review & Simpan</h3>
                        <p class="mt-1 text-sm font-medium leading-6 text-neutral-500">Periksa kembali data fasilitas sebelum disimpan.</p>
                      </div>
                    </div>
                  </div>

                  <div class="grid gap-5 lg:grid-cols-[340px_1fr]">
                    <div class="overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white">
                      <div class="h-56 bg-neutral-100">
                        <img v-if="coverPreviewUrl" :src="coverPreviewUrl" alt="Preview cover" class="h-full w-full object-cover">
                        <div v-else class="flex h-full w-full items-center justify-center text-neutral-400">
                          <Icon icon="solar:gallery-wide-bold-duotone" class="h-10 w-10" />
                        </div>
                      </div>

                      <div class="p-5">
                        <span class="rounded-full bg-neutral-900 px-3 py-1 text-xs font-black text-white">
                          {{ facilityTypeLabel(form.facilityType) }}
                        </span>

                        <h3 class="mt-4 text-lg font-black leading-7 text-neutral-950">
                          {{ form.title || 'Nama fasilitas' }}
                        </h3>

                        <p class="mt-2 text-sm font-medium leading-6 text-neutral-500">
                          {{ form.subtitle || 'Ringkasan fasilitas akan tampil di sini.' }}
                        </p>
                      </div>
                    </div>

                    <div class="rounded-[1.75rem] border border-neutral-200 bg-white p-5">
                      <div class="grid gap-4">
                        <ReviewRow label="Slug" :value="form.slug || '-'" />
                        <ReviewRow label="Status" :value="form.status" />
                        <ReviewRow label="Featured" :value="form.isFeatured ? 'Ya' : 'Tidak'" />
                        <ReviewRow label="Sort Order" :value="String(form.sortOrder || 0)" />
                        <ReviewRow label="Total Gambar" :value="`${form.images.length} gambar`" />
                        <ReviewRow label="Kontak" :value="form.whatsapp || form.phone || form.email || '-'" />
                        <ReviewRow label="Koordinat" :value="form.latitude && form.longitude ? `${form.latitude}, ${form.longitude}` : '-'" />
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="formError" class="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
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
                      {{ imageUploading ? 'Upload gambar...' : saving ? 'Menyimpan...' : formMode === 'create' ? 'Simpan Fasilitas' : 'Update Fasilitas' }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Icon Picker Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showIconPicker" class="fixed inset-0 z-[9993] overflow-y-auto bg-neutral-950/50 p-3 backdrop-blur-sm sm:p-5">
          <div class="mx-auto flex min-h-full max-w-5xl items-center py-4">
            <div class="w-full overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-2xl">
              <!-- Header -->
              <div class="border-b border-neutral-200 bg-white/95 p-5 backdrop-blur-xl">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="text-xs font-black uppercase tracking-[0.16em] text-[var(--brand)]">Iconify Icon Picker</p>
                    <h2 class="mt-1 text-xl font-black text-neutral-950">Pilih Icon Fasilitas</h2>
                    <p class="mt-1 text-sm font-medium leading-6 text-neutral-500">Cari icon dari Iconify API, filter berdasarkan icon set, lalu pilih icon untuk fasilitas.</p>
                  </div>

                  <button type="button" class="grid h-10 w-10 place-items-center rounded-2xl text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950" @click="closeIconPicker">
                    <Icon icon="solar:close-circle-bold-duotone" class="h-6 w-6" />
                  </button>
                </div>

                <!-- Search + Filters -->
                <div class="mt-5 grid gap-3 lg:grid-cols-[1fr_220px_220px_auto]">
                  <div class="relative">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
                      <Icon icon="solar:magnifer-linear" class="h-5 w-5" />
                    </div>

                    <input
                      v-model.trim="iconQuery"
                      type="text"
                      placeholder="Cari: hospital, school, store, car, water..."
                      class="input-field py-3 pl-12"
                      @keydown.enter.prevent="searchIconifyIcons"
                    >
                  </div>

                  <select v-model="iconPrefix" class="input-field">
                    <option value="all">Semua Icon Set</option>
                    <option v-for="collection in filteredIconCollections" :key="collection.prefix" :value="collection.prefix">
                      {{ collection.name }} ({{ collection.prefix }})
                    </option>
                  </select>

                  <select v-model="iconCategory" class="input-field">
                    <option value="all">Semua Kategori</option>
                    <option v-for="category in iconCategoryOptions" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>

                  <button
                    type="button"
                    :disabled="iconLoading"
                    class="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-black text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                    @click="searchIconifyIcons"
                  >
                    <Icon :icon="iconLoading ? 'solar:refresh-bold-duotone' : 'solar:magnifer-bold-duotone'" class="h-5 w-5" :class="iconLoading ? 'animate-spin' : ''" />
                    Cari
                  </button>
                </div>

                <!-- Selected preview -->
                <div class="mt-4 flex flex-wrap items-center gap-2">
                  <span class="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-black text-neutral-500">Selected:</span>
                  <span class="inline-flex items-center gap-2 rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-black text-[var(--brand)]">
                    <Icon :icon="form.icon || defaultIconByType(form.facilityType)" class="h-4 w-4" />
                    {{ form.icon || '-' }}
                  </span>
                  <span v-if="iconTotal" class="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-black text-neutral-500">
                    {{ iconTotal }} hasil
                  </span>
                </div>
              </div>

              <!-- Body -->
              <div class="max-h-[62vh] overflow-y-auto p-5">
                <div v-if="iconError" class="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                  {{ iconError }}
                </div>

                <div v-if="iconLoading" class="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9">
                  <div v-for="item in 45" :key="item" class="h-24 animate-pulse rounded-3xl border border-neutral-200 bg-neutral-100"></div>
                </div>

                <div v-else-if="iconResults.length === 0" class="rounded-[2rem] border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
                  <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-white text-neutral-400">
                    <Icon icon="solar:gallery-minimalistic-bold-duotone" class="h-8 w-8" />
                  </div>

                  <h3 class="mt-4 text-lg font-black text-neutral-950">Belum ada icon</h3>
                  <p class="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-neutral-500">Masukkan keyword pencarian, misalnya <b>hospital</b>, <b>school</b>, <b>store</b>, <b>car</b>, atau <b>water</b>.</p>
                </div>

                <div v-else class="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9">
                  <button
                    v-for="iconName in iconResults"
                    :key="iconName"
                    type="button"
                    class="group relative flex h-24 flex-col items-center justify-center gap-2 rounded-3xl border p-2 text-center transition hover:-translate-y-0.5 hover:shadow-md"
                    :class="form.icon === iconName
                      ? 'border-[var(--brand)] bg-[var(--brand-soft)] ring-4 ring-[var(--brand-ring)]'
                      : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'"
                    @click="selectIcon(iconName)"
                  >
                    <Icon :icon="iconName" class="h-7 w-7" :class="form.icon === iconName ? 'text-[var(--brand)]' : 'text-neutral-700'" />
                    <span class="max-w-full truncate text-[10px] font-black text-neutral-500">{{ iconName }}</span>

                    <span v-if="form.icon === iconName" class="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-[var(--brand)] text-white">
                      <Icon icon="solar:check-circle-bold" class="h-4 w-4" />
                    </span>
                  </button>
                </div>
              </div>

              <!-- Footer -->
              <div class="flex flex-col-reverse gap-3 border-t border-neutral-200 bg-neutral-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <p class="text-xs font-semibold leading-5 text-neutral-500">Tips: gunakan icon set <b>Solar</b> atau <b>Lucide</b> agar style visual tetap clean dan konsisten.</p>

                <div class="flex gap-2">
                  <button type="button" class="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-black text-neutral-700 transition hover:bg-neutral-50" @click="closeIconPicker">
                    Batal
                  </button>

                  <button type="button" class="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-black text-white transition hover:bg-neutral-800" @click="closeIconPicker">
                    Pakai Icon
                    <Icon icon="solar:check-circle-bold-duotone" class="h-5 w-5" />
                  </button>
                </div>
              </div>
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
        <div v-if="showMediaModal" class="fixed inset-0 z-[9992] flex items-center justify-center bg-neutral-950/50 p-4 backdrop-blur-sm">
          <div class="w-full max-w-xl rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-2xl">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs font-black uppercase tracking-[0.16em] text-[var(--brand)]">Tiptap Media</p>
                <h2 class="mt-1 text-xl font-black text-neutral-950">{{ mediaTitle }}</h2>
              </div>

              <button type="button" class="grid h-10 w-10 place-items-center rounded-2xl text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950" @click="closeMediaModal">
                <Icon icon="solar:close-circle-bold-duotone" class="h-6 w-6" />
              </button>
            </div>

            <div class="mt-5 space-y-4">
              <div>
                <label class="mb-2 block text-sm font-black text-neutral-700">URL / Embed</label>
                <textarea v-model.trim="mediaForm.url" rows="4" :placeholder="mediaPlaceholder" class="textarea-field"></textarea>
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-neutral-700">Title / Alt Text</label>
                <input v-model.trim="mediaForm.title" type="text" placeholder="Opsional" class="input-field">
              </div>

              <div v-if="mediaError" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {{ mediaError }}
              </div>
            </div>

            <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" class="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-black text-neutral-700 transition hover:bg-neutral-50" @click="closeMediaModal">
                Batal
              </button>

              <button type="button" class="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-black text-white transition hover:bg-neutral-800" @click="confirmInsertMedia">
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
        <div v-if="showDelete" class="fixed inset-0 z-[9991] flex items-center justify-center bg-neutral-950/50 p-4 backdrop-blur-sm">
          <div class="w-full max-w-md rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-2xl">
            <div class="grid h-14 w-14 place-items-center rounded-3xl bg-red-50 text-red-600">
              <Icon icon="solar:trash-bin-trash-bold-duotone" class="h-7 w-7" />
            </div>

            <h2 class="mt-5 text-xl font-black text-neutral-950">Hapus Fasilitas?</h2>

            <p class="mt-2 text-sm font-medium leading-6 text-neutral-500">
              Fasilitas <strong class="text-neutral-900">{{ selectedFacility?.title }}</strong> akan dihapus. Tindakan ini tidak dapat dibatalkan.
            </p>

            <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" class="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-black text-neutral-700 transition hover:bg-neutral-50" @click="showDelete = false">
                Batal
              </button>

              <button
                type="button"
                :disabled="deleting"
                class="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                @click="confirmDelete"
              >
                <Icon :icon="deleting ? 'solar:refresh-bold-duotone' : 'solar:trash-bin-trash-bold-duotone'" class="h-5 w-5" :class="deleting ? 'animate-spin' : ''" />
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
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Node, mergeAttributes } from '@tiptap/core'
import { computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, reactive, ref, shallowRef, unref, watch } from 'vue'
import { useHead, useRequestURL, useRuntimeConfig, useSeoMeta } from 'nuxt/app'
import type {
  CreateFacilityPayload,
  FacilityItem,
  FacilityListResponse,
  FacilityStatus,
  FacilityType,
  UpdateFacilityPayload
} from '~/types/facility'
import { useCloudinaryUpload } from '~/composables/useCloudinaryUpload'

definePageMeta({
  layout: 'app',
  layoutProps: {
    title: 'Facilities'
  }
})

type ToastType = 'success' | 'error'
type Mode = 'martopuro' | 'obayan'
type MediaType = 'image-url' | 'pdf' | 'youtube' | 'map'

type ImageDraft = {
  id: string
  url: string
  preview: string
  file: File | null
  source: 'url' | 'file'
}

type IconifyCollection = {
  prefix: string
  name: string
  total?: number
  category?: string
}

type IconifySearchResponse = {
  icons?: string[]
  total?: number
  limit?: number
  start?: number
  collections?: Record<string, any>
}

const config = useRuntimeConfig()
const requestUrl = useRequestURL()
const editor = shallowRef<Editor | null>(null)

const {
  uploading: imageUploading,
  uploadError: imageUploadError,
  uploadImage
} = useCloudinaryUpload()

const hostname = computed(() => String(requestUrl.hostname || '').replace(/^www\./, '').toLowerCase())
const clientName = computed(() => String(config.public.clientName || '').trim().toLowerCase())

const mode = computed<Mode>(() => {
  if (hostname.value.includes('martopuro')) return 'martopuro'
  if (clientName.value.includes('martopuro')) return 'martopuro'
  return 'obayan'
})

const isMartopuro = computed(() => mode.value === 'martopuro')
const tenantSlug = computed(() => {
  if (hostname.value.includes('martopuro')) return 'martopuro'
  if (hostname.value.includes('obayan')) return 'obayan'
  return clientName.value || 'martopuro'
})

const profile = computed(() => {
  if (isMartopuro.value) {
    return {
      name: 'Desa Martopuro',
      title: 'Facilities Desa Martopuro',
      badge: 'Village Facilities',
      icon: 'solar:map-point-wave-bold-duotone',
      description: 'Kelola fasilitas publik Desa Martopuro seperti kesehatan, pasar, pendidikan, lapangan, ambulance, mobil siaga, HIPAM, dan fasilitas warga lainnya.',
      createLabel: 'Tambah Fasilitas',
      searchPlaceholder: 'Cari fasilitas, layanan, alamat, kesehatan, pasar...',
      emptyDescription: 'Belum ada fasilitas. Tambahkan fasilitas publik desa agar dapat ditampilkan di website.',
      brand: '#2563eb',
      brandSoft: '#eff6ff',
      brandRing: 'rgba(37, 99, 235, 0.14)'
    }
  }

  return {
    name: 'Obayan',
    title: 'Facilities Obayan',
    badge: 'Platform Facilities',
    icon: 'solar:widget-5-bold-duotone',
    description: 'Kelola fasilitas, layanan, aset publik, tempat, lokasi, dan resource tenant yang terhubung dengan ekosistem Obayan.',
    createLabel: 'Tambah Facility',
    searchPlaceholder: 'Cari facility, layanan, lokasi, resource...',
    emptyDescription: 'Belum ada facility. Tambahkan data fasilitas untuk digunakan pada website dan section public.',
    brand: '#58cc02',
    brandSoft: '#f0fdf4',
    brandRing: 'rgba(88, 204, 2, 0.16)'
  }
})

const themeVars = computed<Record<string, string>>(() => ({
  '--brand': profile.value.brand,
  '--brand-soft': profile.value.brandSoft,
  '--brand-ring': profile.value.brandRing
}))

const apiUrl = computed(() => `/api/tenants/${tenantSlug.value}/facilities`)

const selectedType = ref<FacilityType | 'all'>('all')
const selectedStatus = ref<FacilityStatus | 'all'>('all')
const sortBy = ref<'newest' | 'oldest' | 'title' | 'sort_order'>('sort_order')

const {
  data: facilitiesResponse,
  pending,
  error,
  refresh
} = useFetch<FacilityListResponse>(apiUrl, {
  key: computed(() => `app-facilities-${tenantSlug.value}-${selectedStatus.value}-${selectedType.value}-${sortBy.value}`),
  query: computed(() => ({
    status: selectedStatus.value === 'all' ? 'all' : selectedStatus.value,
    type: selectedType.value === 'all' ? 'all' : selectedType.value,
    limit: 100,
    sort: sortBy.value
  })),
  watch: [tenantSlug, selectedStatus, selectedType, sortBy],
  default: () => ({
    data: [],
    meta: {
      page: 1,
      limit: 100,
      total: 0,
      totalPages: 1
    }
  })
})

const facilities = computed<FacilityItem[]>(() => facilitiesResponse.value?.data || [])
const isLoading = computed(() => Boolean(unref(pending)))
const visibleError = computed(() => {
  const value = unref(error)
  if (!value) return ''
  if (typeof value === 'string') return value
  return value?.message || 'Terjadi kesalahan saat memuat fasilitas.'
})

const search = ref('')
const page = ref(1)
const pageSize = 12

const showForm = ref(false)
const showDelete = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const saving = ref(false)
const deleting = ref(false)
const formError = ref('')
const selectedFacility = ref<FacilityItem | null>(null)
const manualSlugEdited = ref(false)

const formStep = ref(1)
const formTouched = ref(false)
const imagesInput = ref<HTMLInputElement | null>(null)
const imageUrlDraft = ref('')
const showImageUrlForm = ref(false)
const iconManuallySelected = ref(false)

const moreToolbarOpen = ref(false)
const contextToolbarOpen = ref(false)
const contextToolbar = reactive({ x: 0, y: 0 })

const showMediaModal = ref(false)
const mediaType = ref<MediaType>('image-url')
const mediaError = ref('')
const editorImageInput = ref<HTMLInputElement | null>(null)
const mediaForm = reactive({ url: '', title: '' })

const toast = reactive({
  show: false,
  type: 'success' as ToastType,
  title: '',
  message: ''
})
let toastTimer: ReturnType<typeof setTimeout> | null = null

const showIconPicker = ref(false)
const iconQuery = ref('facility')
const iconPrefix = ref('lucide')
const iconCategory = ref('all')
const iconLoading = ref(false)
const iconCollectionsLoading = ref(false)
const iconError = ref('')
const iconResults = ref<string[]>([])
const iconCollections = ref<IconifyCollection[]>([])
const iconTotal = ref(0)
let iconSearchTimer: ReturnType<typeof setTimeout> | null = null

const preferredIconPrefixes = ['solar', 'lucide', 'mdi', 'tabler', 'material-symbols', 'heroicons', 'ph', 'fluent']
const fallbackIconCollections = computed<IconifyCollection[]>(() => [
  { prefix: 'solar', name: 'Solar', category: 'General' },
  { prefix: 'lucide', name: 'Lucide', category: 'General' },
  { prefix: 'mdi', name: 'Material Design Icons', category: 'General' },
  { prefix: 'tabler', name: 'Tabler Icons', category: 'General' },
  { prefix: 'material-symbols', name: 'Material Symbols', category: 'General' },
  { prefix: 'heroicons', name: 'Heroicons', category: 'General' },
  { prefix: 'ph', name: 'Phosphor', category: 'General' },
  { prefix: 'fluent', name: 'Fluent UI', category: 'General' }
])

const availableIconCollections = computed(() => iconCollections.value.length ? iconCollections.value : fallbackIconCollections.value)
const iconCategoryOptions = computed(() => Array.from(new Set(availableIconCollections.value.map((item) => item.category).filter(Boolean))).sort() as string[])
const filteredIconCollections = computed(() => {
  if (iconCategory.value === 'all') return availableIconCollections.value
  return availableIconCollections.value.filter((item) => item.category === iconCategory.value)
})

const typeOptions: { label: string; value: FacilityType; icon: string }[] = [
  { label: 'Kesehatan', value: 'health', icon: 'lucide:hospital' },
  { label: 'Pasar', value: 'market', icon: 'lucide:store' },
  { label: 'Pendidikan', value: 'education', icon: 'lucide:school' },
  { label: 'Olahraga / Lapangan', value: 'sport', icon: 'lucide:trophy' },
  { label: 'Darurat', value: 'emergency', icon: 'lucide:ambulance' },
  { label: 'Transportasi', value: 'transport', icon: 'lucide:car' },
  { label: 'Air Bersih', value: 'water', icon: 'lucide:droplets' },
  { label: 'Pelayanan Publik', value: 'public_service', icon: 'lucide:clipboard-list' },
  { label: 'Kantor', value: 'office', icon: 'lucide:building-2' },
  { label: 'Tempat Ibadah', value: 'worship', icon: 'lucide:landmark' },
  { label: 'Wisata', value: 'tourism', icon: 'lucide:map-pin' },
  { label: 'Keamanan', value: 'security', icon: 'lucide:shield-check' },
  { label: 'Custom', value: 'custom', icon: 'lucide:layers' }
]

const formSteps = [
  { value: 1, title: 'Identitas', description: 'Nama & tipe', icon: 'solar:map-point-wave-bold-duotone' },
  { value: 2, title: 'Media', description: 'Logo & gambar', icon: 'solar:gallery-wide-bold-duotone' },
  { value: 3, title: 'Konten', description: 'Deskripsi & kontak', icon: 'solar:pen-new-square-bold-duotone' },
  { value: 4, title: 'Review', description: 'Cek & simpan', icon: 'solar:clipboard-check-bold-duotone' }
]

const form = reactive({
  facilityType: 'custom' as FacilityType,
  title: '',
  subtitle: '',
  slug: '',
  icon: '' as string | null,
  logoUrl: '',
  websiteUrl: '',
  email: '',
  phone: '',
  whatsapp: '',
  address: '',
  latitude: '',
  longitude: '',
  status: 'active' as FacilityStatus,
  isFeatured: true,
  sortOrder: 0,
  images: [] as ImageDraft[]
})

const formStepProgress = computed(() => Math.round((formStep.value / formSteps.length) * 100))
const coverPreviewUrl = computed(() => form.images[0]?.preview || form.images[0]?.url || '')
const readTime = computed(() => estimateReadTime(editor.value?.getText() || ''))

const filteredFacilities = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return facilities.value
    .filter((item) => {
      if (!keyword) return true

      return [
        item.title,
        item.subtitle,
        item.slug,
        item.facilityType,
        item.address,
        item.phone,
        item.whatsapp,
        item.email,
        stripHtml(item.contentHtml || '')
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(keyword)
    })
    .sort((a, b) => {
      if (sortBy.value === 'title') return String(a.title || '').localeCompare(String(b.title || ''))
      if (sortBy.value === 'newest') return Number(b.createdAt || 0) - Number(a.createdAt || 0)
      if (sortBy.value === 'oldest') return Number(a.createdAt || 0) - Number(b.createdAt || 0)

      const sortA = Number(a.sortOrder || 0)
      const sortB = Number(b.sortOrder || 0)
      if (sortA !== sortB) return sortA - sortB
      return String(a.title || '').localeCompare(String(b.title || ''))
    })
})

const pagedFacilities = computed(() => filteredFacilities.value.slice(0, page.value * pageSize))
const hasMore = computed(() => pagedFacilities.value.length < filteredFacilities.value.length)

const stats = computed(() => {
  const rows = facilities.value
  const active = rows.filter((item) => item.status === 'active').length
  const featured = rows.filter((item) => item.isFeatured).length
  const withImages = rows.filter((item) => getFacilityImages(item).length).length
  const categories = new Set(rows.map((item) => item.facilityType)).size

  return [
    { label: 'Total Fasilitas', value: String(rows.length), icon: 'solar:map-point-wave-bold-duotone', description: 'Total fasilitas pada tenant ini.' },
    { label: 'Active', value: String(active), icon: 'solar:check-circle-bold-duotone', description: 'Fasilitas aktif yang bisa ditampilkan.' },
    { label: 'Featured', value: String(featured), icon: 'solar:star-fall-bold-duotone', description: 'Diprioritaskan pada section public.' },
    { label: 'Kategori', value: String(categories || withImages), icon: 'solar:widget-5-bold-duotone', description: 'Variasi tipe fasilitas tenant.' }
  ]
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

const mediaMenu = [
  { label: 'Image URL', icon: 'solar:gallery-add-bold-duotone', type: 'image-url' as MediaType },
  { label: 'PDF', icon: 'solar:file-text-bold-duotone', type: 'pdf' as MediaType },
  { label: 'YouTube', icon: 'solar:video-frame-play-horizontal-bold-duotone', type: 'youtube' as MediaType },
  { label: 'Map', icon: 'solar:map-point-bold-duotone', type: 'map' as MediaType }
]

const primaryEditorButtons = computed(() => {
  const ed = editor.value
  if (!ed) return []

  return [
    { label: 'Paragraph', icon: 'solar:text-bold-duotone', active: () => ed.isActive('paragraph'), action: () => ed.chain().focus().setParagraph().run() },
    { label: 'Heading 2', icon: 'solar:text-square-bold-duotone', active: () => ed.isActive('heading', { level: 2 }), action: () => ed.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: 'Bold', icon: 'solar:text-bold-bold-duotone', active: () => ed.isActive('bold'), action: () => ed.chain().focus().toggleBold().run() },
    { label: 'Italic', icon: 'solar:text-italic-bold-duotone', active: () => ed.isActive('italic'), action: () => ed.chain().focus().toggleItalic().run() },
    { label: 'Bullet List', icon: 'solar:list-bold-duotone', active: () => ed.isActive('bulletList'), action: () => ed.chain().focus().toggleBulletList().run() }
  ]
})

const secondaryEditorButtons = computed(() => {
  const ed = editor.value
  if (!ed) return []

  return [
    { label: 'Heading 3', icon: 'solar:text-square-2-bold-duotone', action: () => ed.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: 'Number List', icon: 'solar:list-down-bold-duotone', action: () => ed.chain().focus().toggleOrderedList().run() },
    { label: 'Quote', icon: 'solar:quote-up-bold-duotone', action: () => ed.chain().focus().toggleBlockquote().run() },
    { label: 'Undo', icon: 'solar:undo-left-bold-duotone', action: () => ed.chain().focus().undo().run() },
    { label: 'Redo', icon: 'solar:undo-right-bold-duotone', action: () => ed.chain().focus().redo().run() }
  ]
})

const contextEditorButtons = computed(() => {
  const ed = editor.value
  if (!ed) return []

  return [
    { label: 'Bold', icon: 'solar:text-bold-bold-duotone', action: () => ed.chain().focus().toggleBold().run() },
    { label: 'Italic', icon: 'solar:text-italic-bold-duotone', action: () => ed.chain().focus().toggleItalic().run() },
    { label: 'Quote', icon: 'solar:quote-up-bold-duotone', action: () => ed.chain().focus().toggleBlockquote().run() },
    { label: 'Image URL', icon: 'solar:gallery-add-bold-duotone', action: () => openMediaModal('image-url') },
    { label: 'PDF / YouTube / Map', icon: 'solar:menu-dots-bold', action: () => { moreToolbarOpen.value = true } }
  ]
})

watch([search, selectedType, selectedStatus, sortBy], () => { page.value = 1 })
watch(iconQuery, () => {
  if (!showIconPicker.value) return
  if (iconSearchTimer) clearTimeout(iconSearchTimer)
  iconSearchTimer = setTimeout(() => searchIconifyIcons(), 450)
})
watch([iconPrefix, iconCategory], () => {
  if (!showIconPicker.value) return
  searchIconifyIcons()
})
watch(() => form.facilityType, (type) => {
  if (iconManuallySelected.value) return
  form.icon = defaultIconByType(type)
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
  htmlAttrs: { lang: 'id' },
  meta: [{ name: 'theme-color', content: profile.value.brand }]
}))

onMounted(() => {
  ensureEditor()
})

onBeforeUnmount(() => {
  editor.value?.destroy()

  for (const image of form.images) {
    revokeObjectURL(image.preview)
  }
})

const PdfEmbed = Node.create({
  name: 'pdfEmbed',
  group: 'block',
  atom: true,
  addAttributes() {
    return { src: { default: null }, title: { default: 'PDF Document' } }
  },
  parseHTML() { return [{ tag: 'iframe[data-type="pdf-embed"]' }] },
  renderHTML({ HTMLAttributes }) {
    return ['iframe', mergeAttributes(HTMLAttributes, {
      'data-type': 'pdf-embed',
      src: HTMLAttributes.src,
      title: HTMLAttributes.title || 'PDF Document',
      class: 'tiptap-embed tiptap-pdf',
      loading: 'lazy'
    })]
  },
  addCommands() {
    return {
      setPdfEmbed: (attrs: any) => ({ commands }: any) => commands.insertContent({ type: this.name, attrs })
    } as any
  }
})

const MapEmbed = Node.create({
  name: 'mapEmbed',
  group: 'block',
  atom: true,
  addAttributes() {
    return { src: { default: null }, title: { default: 'Map Location' } }
  },
  parseHTML() { return [{ tag: 'iframe[data-type="map-embed"]' }] },
  renderHTML({ HTMLAttributes }) {
    return ['iframe', mergeAttributes(HTMLAttributes, {
      'data-type': 'map-embed',
      src: HTMLAttributes.src,
      title: HTMLAttributes.title || 'Map Location',
      class: 'tiptap-embed tiptap-map',
      loading: 'lazy',
      allowfullscreen: 'true',
      referrerpolicy: 'no-referrer-when-downgrade'
    })]
  },
  addCommands() {
    return {
      setMapEmbed: (attrs: any) => ({ commands }: any) => commands.insertContent({ type: this.name, attrs })
    } as any
  }
})

function ensureEditor() {
  if (editor.value) return

  editor.value = new Editor({
    content: '<p></p>',
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-blue-600 underline underline-offset-4' }
      }),
      Placeholder.configure({ placeholder: 'Tulis deskripsi lengkap fasilitas di sini...' }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: { class: 'rounded-2xl border border-neutral-200' }
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
        HTMLAttributes: { class: 'rounded-2xl overflow-hidden' }
      }),
      PdfEmbed,
      MapEmbed
    ],
    editorProps: {
      attributes: { class: 'outline-none min-h-[320px] prose prose-neutral max-w-none' }
    }
  })
}

async function reloadFacilities() {
  try {
    await refresh()
  } catch (error: any) {
    showToast('error', 'Gagal Memuat Fasilitas', error?.message || 'Data fasilitas gagal dimuat.')
  }
}

function resetForm() {
  formStep.value = 1
  formTouched.value = false

  form.facilityType = 'custom'
  form.title = ''
  form.subtitle = ''
  form.slug = ''
  form.icon = defaultIconByType('custom')
  form.logoUrl = ''
  form.websiteUrl = ''
  form.email = ''
  form.phone = ''
  form.whatsapp = ''
  form.address = ''
  form.latitude = ''
  form.longitude = ''
  form.status = 'active'
  form.isFeatured = true
  form.sortOrder = 0

  for (const image of form.images) revokeObjectURL(image.preview)
  form.images = []

  formError.value = ''
  selectedFacility.value = null
  manualSlugEdited.value = false
  showImageUrlForm.value = false
  imageUrlDraft.value = ''
  iconManuallySelected.value = false
  moreToolbarOpen.value = false
  contextToolbarOpen.value = false

  if (imagesInput.value) imagesInput.value.value = ''

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

function openEdit(item: FacilityItem) {
  formMode.value = 'edit'
  formStep.value = 1
  formTouched.value = false
  selectedFacility.value = item

  form.facilityType = item.facilityType || 'custom'
  form.title = item.title || ''
  form.subtitle = item.subtitle || ''
  form.slug = item.slug || ''
  form.icon = item.icon || defaultIconByType(item.facilityType || 'custom')
  form.logoUrl = item.logoUrl || ''
  form.websiteUrl = item.websiteUrl || ''
  form.email = item.email || ''
  form.phone = item.phone || ''
  form.whatsapp = item.whatsapp || ''
  form.address = item.address || ''
  form.latitude = item.latitude === null || typeof item.latitude === 'undefined' ? '' : String(item.latitude)
  form.longitude = item.longitude === null || typeof item.longitude === 'undefined' ? '' : String(item.longitude)
  form.status = item.status || 'active'
  form.isFeatured = Boolean(item.isFeatured)
  form.sortOrder = Number(item.sortOrder || 0)

  for (const image of form.images) revokeObjectURL(image.preview)
  form.images = getFacilityImages(item).map((url) => ({
    id: createLocalId(),
    url,
    preview: url,
    file: null,
    source: 'url' as const
  }))

  formError.value = ''
  manualSlugEdited.value = true
  iconManuallySelected.value = Boolean(item.icon)

  ensureEditor()

  if (item.contentJson) {
    editor.value?.commands.setContent(item.contentJson)
  } else if (item.contentHtml) {
    editor.value?.commands.setContent(item.contentHtml)
  } else {
    editor.value?.commands.setContent('<p></p>')
  }

  showForm.value = true
}

function closeForm() {
  showForm.value = false
  formError.value = ''
  moreToolbarOpen.value = false
  contextToolbarOpen.value = false
}

function openDelete(item: FacilityItem) {
  selectedFacility.value = item
  showDelete.value = true
}

function validateCurrentFormStep() {
  formTouched.value = true
  formError.value = ''

  if (formStep.value === 1) {
    if (!form.title.trim()) {
      formError.value = 'Nama fasilitas wajib diisi.'
      return false
    }

    if (!form.slug.trim()) {
      form.slug = slugify(form.title)
    }

    form.slug = slugify(form.slug)

    if (!form.slug) {
      formError.value = 'Slug fasilitas tidak valid.'
      return false
    }

    return true
  }

  if (formStep.value === 2) {
    if (form.logoUrl && !isValidUrl(form.logoUrl)) {
      formError.value = 'Logo URL tidak valid.'
      return false
    }

    if (form.websiteUrl && !isValidUrl(form.websiteUrl)) {
      formError.value = 'Website URL tidak valid.'
      return false
    }

    return true
  }

  if (formStep.value === 3) {
    if (form.email && !isValidEmail(form.email)) {
      formError.value = 'Format email tidak valid.'
      return false
    }

    if (form.latitude && Number.isNaN(Number(form.latitude))) {
      formError.value = 'Latitude harus berupa angka.'
      return false
    }

    if (form.longitude && Number.isNaN(Number(form.longitude))) {
      formError.value = 'Longitude harus berupa angka.'
      return false
    }

    const text = editor.value?.getText().trim() || ''

    if (text.length < 10) {
      formError.value = 'Deskripsi lengkap minimal 10 karakter.'
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

async function submitForm() {
  formError.value = ''

  if (!validateAllFormSteps()) return

  saving.value = true

  try {
    ensureEditor()

    const uploadedImages = await resolveImagesBeforeSubmit()
    const html = editor.value?.getHTML() || '<p></p>'
    const json = editor.value?.getJSON() || {}

    const previousMetadata = selectedFacility.value?.metadata || {}

    const payload: CreateFacilityPayload | UpdateFacilityPayload = {
      facilityType: form.facilityType,
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || null,
      slug: slugify(form.slug || form.title),
      icon: form.icon || defaultIconByType(form.facilityType),
      logoUrl: form.logoUrl.trim() || null,
      imageUrl: uploadedImages[0] || null,
      contentHtml: html,
      contentJson: json,
      address: form.address.trim() || null,
      latitude: parseNullableNumber(form.latitude),
      longitude: parseNullableNumber(form.longitude),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      whatsapp: form.whatsapp.trim() || null,
      websiteUrl: form.websiteUrl.trim() || null,
      contact: {
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        whatsapp: form.whatsapp.trim() || null
      },
      operationalHours: selectedFacility.value?.operationalHours || previousMetadata.operationalHours || {},
      metadata: {
        ...previousMetadata,
        images: uploadedImages,
        descriptionJson: json,
        descriptionHtml: html,
        updatedFrom: 'app-facilities',
        icon: form.icon || defaultIconByType(form.facilityType)
      },
      status: form.status,
      isFeatured: form.isFeatured,
      sortOrder: Number(form.sortOrder || 0)
    }

    if (formMode.value === 'create') {
      await $fetch(apiUrl.value, {
        method: 'POST',
        body: payload
      })

      showToast('success', 'Fasilitas Berhasil Dibuat', 'Data fasilitas berhasil disimpan.')
    } else if (selectedFacility.value) {
      await $fetch(`${apiUrl.value}/${selectedFacility.value.id}`, {
        method: 'PUT',
        body: payload
      })

      showToast('success', 'Fasilitas Berhasil Diupdate', 'Perubahan fasilitas berhasil disimpan.')
    }

    showForm.value = false
    await reloadFacilities()
  } catch (error: any) {
    const message = error?.data?.statusMessage || error?.data?.message || error?.statusMessage || error?.message || 'Gagal menyimpan fasilitas.'
    formError.value = message
    showToast('error', 'Gagal Menyimpan', message)
  } finally {
    saving.value = false
  }
}

async function confirmDelete() {
  if (!selectedFacility.value) return

  deleting.value = true

  try {
    await $fetch(`${apiUrl.value}/${selectedFacility.value.id}`, {
      method: 'DELETE'
    })

    showDelete.value = false
    showToast('success', 'Fasilitas Dihapus', 'Data fasilitas berhasil dihapus.')
    await reloadFacilities()
  } catch (error: any) {
    showToast('error', 'Gagal Menghapus', error?.message || 'Data fasilitas gagal dihapus.')
  } finally {
    deleting.value = false
  }
}

function triggerPickImages() {
  imagesInput.value?.click()
}

function onPickImages(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])

  for (const file of files) {
    if (!file.type.startsWith('image/')) continue

    const preview = URL.createObjectURL(file)

    form.images.push({
      id: createLocalId(),
      url: '',
      preview,
      file,
      source: 'file'
    })
  }

  if (imagesInput.value) imagesInput.value.value = ''
}

function addImageUrl() {
  const url = imageUrlDraft.value.trim()

  if (!url || !isValidUrl(url)) {
    showToast('error', 'URL Tidak Valid', 'Masukkan link gambar yang valid.')
    return
  }

  form.images.push({
    id: createLocalId(),
    url,
    preview: url,
    file: null,
    source: 'url'
  })

  imageUrlDraft.value = ''
  showImageUrlForm.value = false
}

function removeImage(index: number) {
  const [removed] = form.images.splice(index, 1)
  if (removed?.file && removed.preview) revokeObjectURL(removed.preview)
}

function moveImage(index: number, direction: -1 | 1) {
  const target = index + direction
  if (target < 0 || target >= form.images.length) return

  const current = form.images[index]
  const other = form.images[target]

  form.images[index] = other
  form.images[target] = current
}

async function resolveImagesBeforeSubmit() {
  const urls: string[] = []

  for (const image of form.images) {
    if (image.source === 'url' && image.url) {
      urls.push(image.url)
      continue
    }

    if (image.file) {
      const result = await uploadImage(image.file, {
        folder: `${tenantSlug.value}/facilities`,
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.82,
        maxBytes: 5 * 1024 * 1024
      })

      urls.push(result.secure_url)
      continue
    }

    if (image.url) urls.push(image.url)
  }

  return Array.from(new Set(urls))
}

function getFacilityImages(item: FacilityItem) {
  const metadataImages = Array.isArray(item.metadata?.images) ? item.metadata.images : []

  const images = [
    item.imageUrl,
    ...metadataImages
  ]
    .map((value) => String(value || '').trim())
    .filter(Boolean)

  return Array.from(new Set(images))
}

function getFacilityCover(item: FacilityItem) {
  return getFacilityImages(item)[0] || item.logoUrl || ''
}

function syncSlugFromTitle() {
  if (manualSlugEdited.value && form.slug) return
  form.slug = slugify(form.title)
}

function facilityTypeLabel(type: FacilityType) {
  return typeOptions.find((item) => item.value === type)?.label || 'Fasilitas'
}

function defaultIconByType(type: FacilityType) {
  return typeOptions.find((item) => item.value === type)?.icon || 'lucide:layers'
}

function statusClass(status: FacilityStatus) {
  if (status === 'active') return 'bg-emerald-100/90 text-emerald-800'
  return 'bg-neutral-100/90 text-neutral-700'
}

function openEditorContextMenu(event: MouseEvent) {
  contextToolbar.x = Math.min(event.clientX, window.innerWidth - 280)
  contextToolbar.y = Math.min(event.clientY, window.innerHeight - 360)
  contextToolbarOpen.value = true
  moreToolbarOpen.value = false
}

function runMoreEditorAction(action: () => void) {
  action()
  moreToolbarOpen.value = false
}

function runContextAction(action: () => void) {
  action()
  contextToolbarOpen.value = false
}

function openMediaFromMore(type: MediaType) {
  moreToolbarOpen.value = false
  openMediaModal(type)
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
      folder: `${tenantSlug.value}/facilities/content`,
      maxWidth: 1600,
      maxHeight: 1600,
      quality: 0.82,
      maxBytes: 5 * 1024 * 1024
    })

    editor.value?.chain().focus().setImage({ src: result.secure_url, alt: file.name }).run()
    showToast('success', 'Gambar Ditambahkan', 'Gambar berhasil diupload dan dimasukkan ke editor.')
  } catch (error: any) {
    showToast('error', 'Upload Gagal', error?.message || 'Gambar gagal diupload.')
  } finally {
    if (editorImageInput.value) editorImageInput.value.value = ''
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
    editor.value?.chain().focus().setImage({ src: url, alt: mediaForm.title || 'Image' }).run()
  }

  if (mediaType.value === 'pdf') {
    ;(editor.value?.commands as any).setPdfEmbed({ src: embedPdfUrl(url), title: mediaForm.title || 'PDF Document' })
  }

  if (mediaType.value === 'youtube') {
    editor.value?.chain().focus().setYoutubeVideo({ src: url, width: 720, height: 405 }).run()
  }

  if (mediaType.value === 'map') {
    ;(editor.value?.commands as any).setMapEmbed({ src: url, title: mediaForm.title || 'Map Location' })
  }

  closeMediaModal()
}

function extractIframeSrc(value: string) {
  const source = String(value || '').trim()
  const match = source.match(/src=["']([^"']+)["']/i)
  return match?.[1] || source
}

function embedPdfUrl(url: string) {
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/)
  if (driveMatch?.[1]) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`
  return url
}

async function openIconPicker() {
  showIconPicker.value = true
  iconError.value = ''

  if (!iconCollections.value.length) await fetchIconifyCollections()
  await searchIconifyIcons()
}

function closeIconPicker() {
  showIconPicker.value = false
  iconError.value = ''
}

function selectIcon(iconName: string) {
  form.icon = iconName
  iconManuallySelected.value = true
}

async function fetchIconifyCollections() {
  iconCollectionsLoading.value = true

  try {
    const prefixes = preferredIconPrefixes.join(',')
    const response = await $fetch<Record<string, any>>(`https://api.iconify.design/collections?prefixes=${encodeURIComponent(prefixes)}`)

    iconCollections.value = Object.entries(response || {})
      .map(([prefix, info]) => ({
        prefix,
        name: String(info?.name || prefix),
        total: Number(info?.total || 0),
        category: String(info?.category || 'General')
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  } catch {
    iconCollections.value = fallbackIconCollections.value
  } finally {
    iconCollectionsLoading.value = false
  }
}

async function searchIconifyIcons() {
  const query = iconQuery.value.trim() || 'facility'

  iconLoading.value = true
  iconError.value = ''

  try {
    const params = new URLSearchParams()
    params.set('query', query)
    params.set('limit', '96')

    if (iconPrefix.value !== 'all') params.set('prefix', iconPrefix.value)
    else params.set('prefixes', preferredIconPrefixes.join(','))

    if (iconCategory.value !== 'all') params.set('category', iconCategory.value)

    const response = await $fetch<IconifySearchResponse>(`https://api.iconify.design/search?${params.toString()}`)

    iconResults.value = Array.from(new Set(response.icons || []))
    iconTotal.value = Number(response.total || iconResults.value.length)
  } catch (error: any) {
    iconResults.value = []
    iconTotal.value = 0
    iconError.value = error?.message || 'Gagal mengambil icon dari Iconify API.'
  } finally {
    iconLoading.value = false
  }
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

function stripHtml(value: string) {
  return String(value || '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function estimateReadTime(text: string) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function parseNullableNumber(value: string) {
  const trimmed = String(value || '').trim()
  if (!trimmed) return null

  const number = Number(trimmed)
  return Number.isNaN(number) ? null : number
}

function createLocalId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function revokeObjectURL(value: string) {
  if (value && value.startsWith('blob:')) URL.revokeObjectURL(value)
}

function showToast(type: ToastType, title: string, message: string) {
  if (toastTimer) clearTimeout(toastTimer)
  toast.type = type
  toast.title = title
  toast.message = message
  toast.show = true
  toastTimer = setTimeout(() => { toast.show = false }, 3500)
}

function closeToast() {
  if (toastTimer) clearTimeout(toastTimer)
  toast.show = false
}

const ReviewRow = defineComponent({
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true }
  },
  setup(props) {
    return () => h('div', {
      class: 'flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3'
    }, [
      h('span', { class: 'text-sm font-bold text-neutral-500' }, props.label),
      h('span', { class: 'min-w-0 truncate text-right text-sm font-black text-neutral-950' }, props.value)
    ])
  }
})
</script>

<style scoped>
.input-field {
  display: block;
  width: 100%;
  border-radius: 1rem;
  border: 1px solid rgb(229 229 229);
  background: rgb(250 250 250);
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(38 38 38);
  outline: none;
  transition: 160ms ease;
}

.input-field:focus {
  border-color: var(--brand);
  background: white;
  box-shadow: 0 0 0 4px var(--brand-ring);
}

.textarea-field {
  display: block;
  width: 100%;
  border-radius: 1rem;
  border: 1px solid rgb(229 229 229);
  background: rgb(250 250 250);
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.6;
  color: rgb(38 38 38);
  outline: none;
  transition: 160ms ease;
}

.textarea-field:focus {
  border-color: var(--brand);
  background: white;
  box-shadow: 0 0 0 4px var(--brand-ring);
}

.editor-btn {
  position: relative;
  display: inline-flex;
  height: 2.25rem;
  width: 2.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 900;
  transition: 160ms ease;
}

.editor-tooltip {
  pointer-events: none;
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  z-index: 50;
  min-width: max-content;
  transform: translateX(-50%) translateY(4px);
  border-radius: 0.75rem;
  background: rgb(23 23 23);
  padding: 0.4rem 0.6rem;
  font-size: 0.7rem;
  font-weight: 800;
  color: white;
  opacity: 0;
  transition: 120ms ease;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.18);
}

.editor-btn:hover .editor-tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.editor-content :deep(.ProseMirror) {
  min-height: 420px;
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
</style>
