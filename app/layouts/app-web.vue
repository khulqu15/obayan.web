<template>
  <div class="min-h-screen overflow-hidden bg-gray-100 text-gray-800 dark:bg-neutral-950 dark:text-neutral-200">
    <!-- Top Navbar -->
    <header class="fixed inset-x-0 top-0 z-[80] px-3 pt-3 xl:px-4">
      <div class="mx-auto flex h-16 max-w-[1920px] items-center justify-between rounded-[30px] border border-white/70 bg-white/90 px-3 shadow-[0_14px_34px_-18px_rgba(15,23,42,0.25)] backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/88">
        <div class="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 xl:hidden dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            @click="openMobilePathSheet(true)"
            aria-label="Buka daftar path"
          >
            <Icon icon="lucide:menu" class="h-4 w-4" />
          </button>

          <NuxtLink
            to="/app"
            class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <Icon icon="lucide:arrow-left" class="h-4 w-4" />
            <span class="hidden sm:inline">Dashboard</span>
          </NuxtLink>

          <div class="hidden h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm lg:grid dark:border-neutral-700 dark:bg-neutral-900">
            <img :src="appLogo" :alt="appName" class="h-9 w-9 object-contain" />
          </div>

          <div class="hidden min-w-0 lg:block">
            <p class="truncate text-sm font-black text-gray-900 dark:text-white">
              Website Content Manager
            </p>
            <p class="truncate text-xs text-gray-500 dark:text-neutral-400">
              {{ clientDisplayName }} • {{ selectedPath }}
            </p>
          </div>

          <div class="min-w-0 lg:hidden">
            <p class="max-w-[170px] truncate text-sm font-black text-gray-900 dark:text-white sm:max-w-[260px]">
              {{ activePageTitle }}
            </p>
            <p class="max-w-[170px] truncate text-xs text-gray-500 dark:text-neutral-400 sm:max-w-[260px]">
              {{ selectedPath }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <a
            :href="previewHref"
            target="_blank"
            class="hidden h-10 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:inline-flex dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <Icon icon="lucide:external-link" class="h-4 w-4" />
            Preview
          </a>

          <div class="relative">
            <button
              type="button"
              class="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-2 py-1.5 shadow-sm transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
              @click.stop="accountOpen = !accountOpen"
              aria-label="Account menu"
            >
              <img :src="user.avatar" alt="Avatar" class="h-8 w-8 rounded-xl object-cover" />

              <div class="hidden min-w-0 text-left md:block">
                <div class="max-w-[140px] truncate text-xs font-bold text-gray-900 dark:text-white">
                  {{ user.name }}
                </div>
                <div class="max-w-[140px] truncate text-[11px] text-gray-500 dark:text-neutral-400">
                  {{ user.email }}
                </div>
              </div>

              <Icon icon="lucide:chevron-down" class="hidden h-4 w-4 text-gray-400 sm:block" />
            </button>

            <div
              v-if="accountOpen"
              class="account-menu-panel absolute right-0 top-[calc(100%+10px)] z-[95] w-72 overflow-hidden rounded-[28px] border border-gray-200 bg-white p-2 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div class="rounded-2xl bg-gray-50 p-3 dark:bg-neutral-800">
                <div class="flex items-center gap-3">
                  <img :src="user.avatar" alt="Avatar" class="h-11 w-11 rounded-2xl object-cover" />

                  <div class="min-w-0">
                    <div class="truncate text-sm font-bold text-gray-900 dark:text-white">
                      {{ user.name }}
                    </div>
                    <div class="truncate text-xs text-gray-500 dark:text-neutral-400">
                      {{ user.email }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-2 space-y-1">
                <NuxtLink
                  to="/app/profile"
                  class="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="accountOpen = false"
                >
                  <Icon icon="iconamoon:profile" class="h-4 w-4" />
                  Profil
                </NuxtLink>

                <NuxtLink
                  to="/app"
                  class="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="accountOpen = false"
                >
                  <Icon icon="lucide:layout-dashboard" class="h-4 w-4" />
                  Dashboard
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Desktop Sidebar Path Manager -->
    <aside class="fixed bottom-4 left-4 top-[84px] z-[75] hidden w-[320px] xl:block">
      <div class="flex h-full flex-col overflow-hidden rounded-[34px] border border-white/10 bg-neutral-950/96 shadow-[0_32px_70px_-18px_rgba(0,0,0,0.64)] backdrop-blur-xl">
        <div class="border-b border-white/10 p-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="inline-flex items-center gap-2 rounded-full bg-green-500/12 px-3 py-1 text-[11px] font-bold text-green-300 ring-1 ring-green-400/20">
                <span class="h-2 w-2 rounded-full bg-green-400"></span>
                Obayan CMS
              </div>

              <h2 class="mt-3 text-lg font-black text-white">List Path</h2>
              <p class="mt-1 text-xs text-neutral-500">
                {{ pageItems.length }} halaman • {{ publishedCount }} published
              </p>
            </div>
          </div>

          <div class="mt-4 flex items-center gap-2">
            <button
              type="button"
              class="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-black text-neutral-950 transition hover:bg-green-50"
              @click="openCreateModal"
            >
              <Icon icon="lucide:file-plus-2" class="h-4 w-4" />
              Tambah Path
            </button>

            <button
              type="button"
              class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
              @click="reloadPages"
            >
              <Icon icon="lucide:refresh-cw" class="h-4 w-4" />
            </button>
          </div>

          <div class="relative mt-4">
            <Icon icon="lucide:search" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              v-model.trim="searchQuery"
              type="search"
              placeholder="Cari path atau title..."
              class="h-11 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-neutral-500 focus:border-green-400/60 focus:bg-white/10"
            />
          </div>
        </div>

        <div class="flex-1 overflow-y-auto px-3 py-3 cms-scrollbar">
          <div v-if="!filteredPages.length" class="rounded-3xl border border-white/10 bg-white/5 px-4 py-8 text-center">
            <Icon icon="lucide:file-search" class="mx-auto h-8 w-8 text-neutral-500" />
            <p class="mt-3 text-sm font-semibold text-neutral-300">Path tidak ditemukan</p>
            <p class="mt-1 text-xs text-neutral-500">Coba kata kunci lain.</p>
          </div>

          <div v-else class="space-y-2">
            <article
              v-for="item in filteredPages"
              :key="item.path"
              class="path-menu-keep relative rounded-[24px] border p-3 transition"
              :class="isActivePath(item.path)
                ? 'border-green-400/30 bg-green-500/15 shadow-[0_18px_45px_-28px_rgba(34,197,94,0.6)]'
                : 'border-white/8 bg-white/[0.035] hover:border-white/14 hover:bg-white/[0.07]'"
            >
              <div class="flex items-start gap-3">
                <button type="button" class="flex min-w-0 flex-1 items-start gap-3 text-left" @click="selectPath(item.path)">
                  <div
                    class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
                    :class="isActivePath(item.path)
                      ? 'bg-green-500 text-white'
                      : 'bg-white/[0.07] text-neutral-300 ring-1 ring-white/10'"
                  >
                    <Icon :icon="item.path === '/' ? 'lucide:home' : 'lucide:file-text'" class="h-4 w-4" />
                  </div>

                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                      <p class="truncate text-sm font-bold text-white">{{ item.title }}</p>
                      <span
                        class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
                        :class="item.status === 'published'
                          ? 'bg-green-400/12 text-green-300'
                          : 'bg-amber-400/12 text-amber-300'"
                      >
                        {{ item.status === 'published' ? 'Live' : 'Draft' }}
                      </span>
                    </div>

                    <p class="mt-1 truncate text-xs text-neutral-400">{{ item.path }}</p>
                    <p class="mt-1 text-[11px] text-neutral-500">
                      {{ item.protected ? 'Default path' : 'Custom path' }}
                    </p>
                  </div>
                </button>

                <div class="relative shrink-0">
                  <button
                    type="button"
                    class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-neutral-200 transition hover:bg-white/10"
                    @click.stop="toggleMenu(item.path)"
                  >
                    <Icon icon="lucide:ellipsis" class="h-4 w-4" />
                  </button>

                  <div
                    v-if="activeMenuPath === item.path"
                    class="absolute right-0 top-[calc(100%+8px)] z-30 w-44 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 p-1.5 shadow-2xl"
                  >
                    <button
                      type="button"
                      class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-neutral-200 transition hover:bg-white/5"
                      @click="openEditModal(item)"
                    >
                      <Icon icon="lucide:pencil-line" class="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      type="button"
                      class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold transition"
                      :class="item.protected
                        ? 'cursor-not-allowed text-neutral-500'
                        : 'text-rose-300 hover:bg-rose-500/10'"
                      @click="!item.protected && openDeleteModal(item)"
                    >
                      <Icon icon="lucide:trash-2" class="h-4 w-4" />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>

        <div class="border-t border-white/10 p-3">
          <a
            :href="previewHref"
            target="_blank"
            class="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
          >
            <Icon icon="lucide:external-link" class="h-4 w-4" />
            Preview Halaman Aktif
          </a>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <main class="h-[100dvh] min-w-0 overflow-hidden px-3 pb-[108px] pt-[92px] transition-all duration-300 xl:pb-4 xl:pl-[347px] xl:pr-4">
      <div class="mx-auto h-full max-w-[1920px] min-w-0">
        <div class="flex h-full min-h-0 flex-col overflow-hidden rounded-[34px] border border-white/70 bg-white/92 shadow-[0_24px_55px_-20px_rgba(15,23,42,0.2)] backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/92">
          <div class="shrink-0 border-b border-gray-200 bg-white/90 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/90">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    <Icon icon="lucide:pen-tool" class="mr-1.5 h-3.5 w-3.5" />
                    Content Workspace
                  </span>

                  <span class="truncate rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700 dark:bg-neutral-800 dark:text-neutral-200">
                    {{ selectedPath }}
                  </span>

                  <span
                    v-if="activePage"
                    class="rounded-full px-3 py-1 text-xs font-bold"
                    :class="activePage.status === 'published'
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'"
                  >
                    {{ activePage.status }}
                  </span>
                </div>

                <h1 class="mt-2 truncate text-xl font-black tracking-tight text-gray-900 dark:text-white">
                  {{ activePageTitle }}
                </h1>
              </div>

              <div class="hidden items-center gap-2 md:flex">
                <button
                  type="button"
                  class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  :disabled="!activePage"
                  @click="openEditModal(activePage)"
                >
                  <Icon icon="lucide:pencil-line" class="h-4 w-4" />
                  Edit Path
                </button>

                <button
                  type="button"
                  class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                  @click="openCreateModal"
                >
                  <Icon icon="lucide:file-plus-2" class="h-4 w-4" />
                  New Path
                </button>
              </div>
            </div>
          </div>

          <div ref="mainScrollEl" class="min-h-0 flex-1 overflow-y-auto cms-light-scrollbar" data-web-editor-main>
            <slot />
          </div>
        </div>
      </div>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="fixed inset-x-3 bottom-3 z-[78] xl:hidden">
      <div class="rounded-[30px] border border-white/10 bg-neutral-950/95 p-2 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.65)] backdrop-blur-xl">
        <div class="grid grid-cols-5 gap-1">
          <button
            v-for="item in mobileNavItems"
            :key="item.key"
            type="button"
            class="group flex min-w-0 flex-col items-center justify-center rounded-[22px] px-2 py-2.5 text-center transition"
            :class="mobileActive(item.key)
              ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
              : 'text-neutral-400 hover:bg-white/6 hover:text-white'"
            @click="handleMobileNav(item.key)"
          >
            <Icon :icon="item.icon" class="h-5 w-5 shrink-0" />
            <span class="mt-1 max-w-full truncate text-[10px] font-black leading-none">
              {{ item.label }}
            </span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile Path Bottom Sheet -->
    <Teleport to="body">
      <div v-if="mobilePathSheetOpen" class="fixed inset-0 z-[120] xl:hidden">
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-neutral-950/65 backdrop-blur-sm"
          @click="closeMobilePathSheet"
        ></div>

        <section
          class="absolute inset-x-0 bottom-0 flex flex-col overflow-hidden rounded-t-[34px] border border-white/10 bg-neutral-950/95 shadow-[0_-28px_70px_-26px_rgba(0,0,0,0.75)] backdrop-blur-xl transition-[height] duration-300 ease-out"
          :class="mobilePathSheetExpanded ? 'h-[88dvh]' : 'h-[58dvh]'"
        >
          <!-- Drag Handle Area -->
          <div
            class="shrink-0 cursor-grab active:cursor-grabbing"
            @touchstart.passive="handleMobileSheetTouchStart"
            @touchend.passive="handleMobileSheetTouchEnd"
          >
            <button
              type="button"
              class="flex w-full items-center justify-center px-4 pb-2 pt-3"
              @click="toggleMobilePathSheet"
              aria-label="Tarik menu"
            >
              <span class="h-1.5 w-14 rounded-full bg-neutral-700 transition group-hover:bg-neutral-600"></span>
            </button>
          </div>

          <!-- Header -->
          <div class="shrink-0 border-b border-white/10 px-4 pb-4">
            <div class="flex items-center justify-between gap-3">
              <div class="flex min-w-0 items-center gap-3">
                <img
                  :src="user.avatar"
                  alt="Avatar"
                  class="h-12 w-12 rounded-[20px] object-cover ring-2 ring-white/10"
                />

                <div class="min-w-0">
                  <h3 class="truncate text-base font-black text-white">
                    Website Paths
                  </h3>
                  <p class="truncate text-xs text-neutral-400">
                    {{ clientDisplayName }} • {{ selectedPath }}
                  </p>
                </div>
              </div>

              <button
                type="button"
                class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-neutral-200 transition hover:bg-white/10 hover:text-white"
                @click="closeMobilePathSheet"
              >
                <Icon icon="lucide:x" class="h-4 w-4" />
              </button>
            </div>

            <div class="mt-4 grid grid-cols-[minmax(0,1fr),auto] gap-2">
              <div class="relative">
                <Icon
                  icon="lucide:search"
                  class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
                />

                <input
                  v-model.trim="mobilePathSearch"
                  type="search"
                  placeholder="Cari path atau title..."
                  class="h-12 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-neutral-500 focus:border-green-400/60 focus:bg-white/10 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)]"
                />
              </div>

              <button
                type="button"
                class="h-12 w-full place-items-center items-center justify-center gap-3 flex rounded-2xl bg-white text-neutral-950 transition hover:bg-green-50"
                @click="openCreateModal"
              >
                <Icon icon="lucide:file-plus-2" class="h-4 w-4" />
                Tambah Path
              </button>
            </div>
          </div>

          <!-- Scroll Body -->
          <div
            class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-4 mobile-path-scroll"
          >
            <!-- Collapsed Quick View -->
            <div v-if="!mobilePathSheetExpanded && !mobilePathSearch" class="space-y-4">
              <div>
                <div class="mb-3 flex items-center justify-between">
                  <p class="text-xs font-black uppercase tracking-[0.18em] text-neutral-500">
                    Path Cepat
                  </p>

                  <button
                    type="button"
                    class="text-xs font-bold text-green-400 transition hover:text-green-300"
                    @click="mobilePathSheetExpanded = true"
                  >
                    Lihat semua
                  </button>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <button
                    v-for="item in mobileQuickPages"
                    :key="`quick-${item.path}`"
                    type="button"
                    class="group rounded-[24px] border p-3 text-left transition active:scale-[0.98]"
                    :class="isActivePath(item.path)
                      ? 'border-green-400/30 bg-green-500/15 text-green-200 shadow-[0_18px_45px_-28px_rgba(34,197,94,0.65)]'
                      : 'border-white/8 bg-white/[0.035] text-neutral-300 hover:border-white/14 hover:bg-white/[0.07] hover:text-white'"
                    @click="selectPath(item.path)"
                  >
                    <span
                      class="grid h-11 w-11 place-items-center rounded-2xl"
                      :class="isActivePath(item.path)
                        ? 'bg-green-600 text-white'
                        : 'bg-white/[0.06] text-neutral-400 ring-1 ring-white/10'"
                    >
                      <Icon :icon="item.path === '/' ? 'lucide:home' : 'lucide:file-text'" class="h-5 w-5" />
                    </span>

                    <span class="mt-3 block truncate text-sm font-black">
                      {{ item.title }}
                    </span>

                    <span class="mt-1 block truncate text-[11px] text-neutral-500">
                      {{ item.path }}
                    </span>
                  </button>
                </div>
              </div>

              <div class="rounded-[28px] border border-green-400/20 bg-green-500/10 p-4">
                <div class="flex items-start gap-3">
                  <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-green-600 text-white">
                    <Icon icon="lucide:hand" class="h-5 w-5" />
                  </div>

                  <div class="min-w-0">
                    <p class="text-sm font-black text-white">
                      Tarik ke atas untuk semua path
                    </p>
                    <p class="mt-1 text-xs leading-5 text-neutral-400">
                      Bisa juga klik garis kecil di atas seperti gaya iPhone.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Expanded Full List -->
            <div v-else class="space-y-2">
              <article
                v-for="item in mobileFilteredPages"
                :key="`mobile-path-${item.path}`"
                class="path-menu-keep relative rounded-[24px] border p-3 transition"
                :class="isActivePath(item.path)
                  ? 'border-green-400/30 bg-green-500/15 shadow-[0_18px_45px_-28px_rgba(34,197,94,0.6)]'
                  : 'border-white/8 bg-white/[0.035] hover:border-white/14 hover:bg-white/[0.07]'"
              >
                <div class="flex items-start gap-3">
                  <button
                    type="button"
                    class="flex min-w-0 flex-1 items-start gap-3 text-left"
                    @click="selectPath(item.path)"
                  >
                    <div
                      class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
                      :class="isActivePath(item.path)
                        ? 'bg-green-500 text-white'
                        : 'bg-white/[0.07] text-neutral-300 ring-1 ring-white/10'"
                    >
                      <Icon :icon="item.path === '/' ? 'lucide:home' : 'lucide:file-text'" class="h-4 w-4" />
                    </div>

                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-2">
                        <p class="truncate text-sm font-bold text-white">
                          {{ item.title }}
                        </p>

                        <span
                          class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
                          :class="item.status === 'published'
                            ? 'bg-green-400/12 text-green-300'
                            : 'bg-amber-400/12 text-amber-300'"
                        >
                          {{ item.status === 'published' ? 'Live' : 'Draft' }}
                        </span>
                      </div>

                      <p class="mt-1 truncate text-xs text-neutral-400">
                        {{ item.path }}
                      </p>

                      <p class="mt-1 text-[11px] text-neutral-500">
                        {{ item.protected ? 'Default path' : 'Custom path' }}
                      </p>
                    </div>
                  </button>

                  <div class="relative shrink-0">
                    <button
                      type="button"
                      class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-neutral-200 transition hover:bg-white/10"
                      @click.stop="toggleMenu(item.path)"
                    >
                      <Icon icon="lucide:ellipsis" class="h-4 w-4" />
                    </button>

                    <div
                      v-if="activeMenuPath === item.path"
                      class="absolute right-0 top-[calc(100%+8px)] z-30 w-44 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 p-1.5 shadow-2xl"
                    >
                      <button
                        type="button"
                        class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-neutral-200 transition hover:bg-white/5"
                        @click="openEditModal(item)"
                      >
                        <Icon icon="lucide:pencil-line" class="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        type="button"
                        class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold transition"
                        :class="item.protected
                          ? 'cursor-not-allowed text-neutral-500'
                          : 'text-rose-300 hover:bg-rose-500/10'"
                        @click="!item.protected && openDeleteModal(item)"
                      >
                        <Icon icon="lucide:trash-2" class="h-4 w-4" />
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </article>

              <div
                v-if="!mobileFilteredPages.length"
                class="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-4 py-10 text-center"
              >
                <Icon icon="lucide:file-search" class="mx-auto h-9 w-9 text-neutral-500" />
                <p class="mt-3 text-sm font-bold text-neutral-200">
                  Path tidak ditemukan
                </p>
                <p class="mt-1 text-xs text-neutral-500">
                  Coba kata kunci lain.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Teleport>

    <!-- Create / Edit Modal -->
    <Teleport to="body">
      <div v-if="showFormModal" class="fixed inset-0 z-[999]">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeFormModal" />

        <div class="relative mx-auto mt-16 w-[92%] max-w-lg">
          <div class="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
            <div class="border-b border-gray-200 px-5 py-4 dark:border-neutral-800">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="text-lg font-black text-gray-900 dark:text-white">
                    {{ formMode === 'create' ? 'Tambah Path Baru' : 'Edit Path' }}
                  </div>
                  <div class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                    Kelola path, title, dan status halaman.
                  </div>
                </div>

                <button
                  type="button"
                  class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="closeFormModal"
                >
                  <Icon icon="lucide:x" class="h-4 w-4" />
                </button>
              </div>
            </div>

            <div class="space-y-4 p-5">
              <div>
                <label class="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Path
                </label>
                <input
                  v-model.trim="form.path"
                  type="text"
                  placeholder="/about atau /program"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Judul Halaman
                </label>
                <input
                  v-model.trim="form.title"
                  type="text"
                  placeholder="Contoh: Program Unggulan"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
                  Status
                </label>
                <select
                  v-model="form.status"
                  class="block h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div
                v-if="formError"
                class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300"
              >
                {{ formError }}
              </div>
            </div>

            <div class="flex items-center justify-end gap-2 border-t border-gray-200 px-5 py-4 dark:border-neutral-800">
              <button
                type="button"
                class="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                @click="closeFormModal"
              >
                Batal
              </button>

              <button
                type="button"
                class="inline-flex h-11 items-center justify-center rounded-2xl bg-green-600 px-4 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:opacity-60"
                :disabled="saving"
                @click="submitForm"
              >
                {{ saving ? 'Menyimpan...' : formMode === 'create' ? 'Buat Path' : 'Simpan Perubahan' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete Modal -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-[100]">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeDeleteModal" />

        <div class="relative mx-auto mt-24 w-[92%] max-w-md">
          <div class="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
            <div class="p-6">
              <div class="flex items-start gap-4">
                <div class="shrink-0 rounded-2xl bg-rose-100 p-3 dark:bg-rose-900/20">
                  <Icon icon="lucide:trash-2" class="h-6 w-6 text-rose-600 dark:text-rose-400" />
                </div>

                <div>
                  <h3 class="text-base font-black text-gray-900 dark:text-white">Hapus Path</h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                    Yakin ingin menghapus path
                    <span class="font-bold text-gray-900 dark:text-white">{{ targetItem?.path }}</span>?
                  </p>
                  <p class="mt-2 text-xs text-gray-500 dark:text-neutral-500">
                    Aksi ini akan menghapus konfigurasi halaman dari CMS.
                  </p>
                </div>
              </div>

              <div class="mt-6 flex items-center justify-end gap-2">
                <button
                  type="button"
                  class="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="closeDeleteModal"
                >
                  Batal
                </button>

                <button
                  type="button"
                  class="inline-flex h-11 items-center justify-center rounded-2xl bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
                  :disabled="saving"
                  @click="confirmDelete"
                >
                  {{ saving ? 'Menghapus...' : 'Hapus' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute, useRouter } from 'vue-router'
import { useRuntimeConfig, useState, useHead } from 'nuxt/app'
import { useWeb } from '~/composables/data/useWeb'

type PageRow = {
  path: string
  pathKey: string
  title: string
  status: 'draft' | 'published'
  protected: boolean
  raw?: any
}

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const clientDisplayName = String(config.public.clientDisplayName || 'Al-Inayah')
const appName = String(config.public.appName || 'SINAYAH')
const appLogo = String(config.public.appLogo || '/assets/logo.png')
const siteUrl = String(config.public.siteUrl || 'https://alinayah.sencra.io').replace(/\/$/, '')
useHead({
  link: [
    { rel: 'icon', href: appLogo },
    { rel: 'shortcut icon', href: appLogo },
    { rel: 'apple-touch-icon', href: appLogo }
  ]
})
const sessionUser = useState<any>('sessionUser', () => ({}))

const user = computed(() => ({
  name: sessionUser.value?.name || sessionUser.value?.displayName || 'Admin',
  email: sessionUser.value?.email || 'admin@obayan.id',
  avatar: sessionUser.value?.avatar || sessionUser.value?.photoURL || '/assets/pp.jpg'
}))

const web = useWeb() as any
const {
  pages,
  subscribePages,
  normalizePath,
  currentPath,
  createPage,
  renamePage,
  deletePage,
  upsertMeta
} = web

const DEFAULT_LOCKED_PATHS = new Set([
  '/',
  '/news',
  '/gallery',
  '/profile',
  '/contact',
  '/program'
])

const accountOpen = ref(false)
const searchQuery = ref('')
const mobilePathSearch = ref('')
const activeMenuPath = ref<string | null>(null)
const mainScrollEl = ref<HTMLElement | null>(null)

const mobilePathSheetOpen = ref(false)
const mobilePathSheetExpanded = ref(false)
const mobileTouchStartY = ref(0)

const showFormModal = ref(false)
const showDeleteModal = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const saving = ref(false)
const formError = ref('')
const targetItem = ref<PageRow | null>(null)

const form = reactive({
  path: '',
  title: '',
  status: 'draft' as 'draft' | 'published'
})

const selectedPath = computed(() => normalizePath(String(route.query.path || currentPath.value || '/')))

const pageItems = computed<PageRow[]>(() => {
  const fromDb = (pages.value || []).map((item: any) => {
    const path = normalizePath(item.path || '/')
    const protectedFlag =
      Boolean(item?.isDefault) ||
      Boolean(item?.default) ||
      Boolean(item?.system) ||
      DEFAULT_LOCKED_PATHS.has(path)

    const metaTitle = String(item?.meta?.title || '').trim()
    const rootTitle = String(item?.title || '').trim()
    const metaStatus = item?.meta?.status
    const rootStatus = item?.status

    return {
      path,
      pathKey: item.pathKey || path.replace(/\W+/g, '-') || 'root',

      title: metaTitle || rootTitle || humanizePath(path),
      status: metaStatus === 'published'
        ? 'published'
        : metaStatus === 'draft'
          ? 'draft'
          : rootStatus === 'published'
            ? 'published'
            : 'draft',

      protected: protectedFlag,
      raw: item
    }
  })

  return fromDb.sort((a, b) => {
    if (a.path === '/') return -1
    if (b.path === '/') return 1
    return a.path.localeCompare(b.path)
  })
})

const filteredPages = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()

  if (!q) return pageItems.value

  return pageItems.value.filter((item) => {
    return [item.path, item.title, item.status].join(' ').toLowerCase().includes(q)
  })
})

const mobileFilteredPages = computed(() => {
  const q = mobilePathSearch.value.trim().toLowerCase()

  if (!q) return pageItems.value

  return pageItems.value.filter((item) => {
    return [item.path, item.title, item.status].join(' ').toLowerCase().includes(q)
  })
})

const mobileQuickPages = computed(() => {
  const active = pageItems.value.find((item) => item.path === selectedPath.value)
  const home = pageItems.value.find((item) => item.path === '/')
  const news = pageItems.value.find((item) => item.path === '/news')
  const gallery = pageItems.value.find((item) => item.path === '/gallery')

  const preferred = [active, home, news, gallery].filter(Boolean) as PageRow[]
  const seen = new Set<string>()

  return [...preferred, ...pageItems.value].filter((item) => {
    if (seen.has(item.path)) return false
    seen.add(item.path)
    return true
  }).slice(0, 6)
})

const publishedCount = computed(() => {
  return pageItems.value.filter((item) => item.status === 'published').length
})

const activePage = computed<PageRow | null>(() => {
  return pageItems.value.find((item) => item.path === selectedPath.value) || null
})

const activePageTitle = computed(() => {
  return activePage.value?.title || 'Website Editor'
})

const previewHref = computed(() => {
  const p = selectedPath.value || '/'
  return `${siteUrl}${p === '/' ? '/' : p}`
})

const mobileNavItems = [
  { key: 'paths', label: 'Pages', icon: 'lucide:files' },
  { key: 'editor', label: 'Editor', icon: 'lucide:pen-tool' },
  { key: 'meta', label: 'SEO', icon: 'lucide:badge-info' },
  { key: 'preview', label: 'View', icon: 'lucide:external-link' },
  { key: 'dashboard', label: 'Home', icon: 'lucide:layout-dashboard' }
] as const

function humanizePath(path: string) {
  if (path === '/') return 'Home'

  return path
    .replace(/^\//, '')
    .split('/')
    .filter(Boolean)
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join(' ')
}

function selectPath(path: string) {
  const nextPath = normalizePath(path)

  currentPath.value = nextPath
  activeMenuPath.value = null

  router.replace({
    query: {
      ...route.query,
      path: nextPath
    }
  })

  closeMobilePathSheet()

  requestAnimationFrame(() => {
    mainScrollEl.value?.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

function isActivePath(path: string) {
  return normalizePath(path) === selectedPath.value
}

function setActiveWebPath(path: string) {
  const nextPath = normalizePath(path)

  currentPath.value = nextPath
  ;(web as any)?.setActivePath?.(nextPath)

  router.replace({
    query: {
      ...route.query,
      path: nextPath
    }
  })
}

function reloadPages() {
  activeMenuPath.value = null
  subscribePages?.()
}

function toggleMenu(path: string) {
  activeMenuPath.value = activeMenuPath.value === path ? null : path
}

function resetForm() {
  form.path = ''
  form.title = ''
  form.status = 'draft'
  formError.value = ''
  targetItem.value = null
}

function openCreateModal() {
  activeMenuPath.value = null
  formMode.value = 'create'
  resetForm()
  form.path = '/new-page'
  form.title = 'New Page'
  showFormModal.value = true
}

function openEditModal(item?: PageRow | null) {
  const source = item || activePage.value
  if (!source) return

  activeMenuPath.value = null
  formMode.value = 'edit'
  resetForm()

  targetItem.value = source
  form.path = source.path
  form.title = source.title
  form.status = source.status

  showFormModal.value = true
}

function openDeleteModal(item: PageRow) {
  if (item.protected) return

  activeMenuPath.value = null
  targetItem.value = item
  showDeleteModal.value = true
}

function closeFormModal() {
  showFormModal.value = false
  resetForm()
}

function closeDeleteModal() {
  showDeleteModal.value = false
  targetItem.value = null
}

function validateForm() {
  const path = normalizePath(form.path || '/')

  if (!path) {
    formError.value = 'Path wajib diisi.'
    return false
  }

  if (!path.startsWith('/')) {
    formError.value = 'Path harus diawali dengan "/".'
    return false
  }

  if (!/^\/[a-zA-Z0-9\-\/]*$/.test(path)) {
    formError.value = 'Path hanya boleh berisi huruf, angka, tanda "-" dan "/".'
    return false
  }

  if (!form.title.trim()) {
    formError.value = 'Judul halaman wajib diisi.'
    return false
  }

  formError.value = ''
  return true
}

async function submitForm() {
  if (!validateForm()) return

  saving.value = true
  formError.value = ''

  try {
    const nextPath = normalizePath(form.path)
    const nextTitle = form.title.trim() || humanizePath(nextPath)
    const nextStatus = form.status === 'published' ? 'published' : 'draft'

    if (formMode.value === 'create') {
      await createPage({
        path: nextPath,
        title: nextTitle,
        description: '',
        status: nextStatus
      })

      setActiveWebPath(nextPath)

      await upsertMeta({
        title: nextTitle,
        status: nextStatus
      })

      selectPath(nextPath)
    } else if (targetItem.value) {
      const oldPath = targetItem.value.path

      if (nextPath !== oldPath) {
        await renamePage(oldPath, nextPath)
      }

      setActiveWebPath(nextPath)

      await upsertMeta({
        title: nextTitle,
        status: nextStatus
      })

      selectPath(nextPath)
    }

    reloadPages()
    closeFormModal()
  } catch (error: any) {
    formError.value = error?.message || 'Terjadi kesalahan saat menyimpan path.'
  } finally {
    saving.value = false
  }
}

async function confirmDelete() {
  if (!targetItem.value || targetItem.value.protected) return

  saving.value = true

  try {
    const deletedPath = targetItem.value.path

    await deletePage(deletedPath)
    reloadPages()

    if (selectedPath.value === deletedPath) {
      selectPath('/')
    }

    closeDeleteModal()
  } catch (error: any) {
    formError.value = error?.message || 'Gagal menghapus path.'
  } finally {
    saving.value = false
  }
}

function openMobilePathSheet(expanded = false) {
  mobilePathSheetOpen.value = true
  mobilePathSheetExpanded.value = expanded
  accountOpen.value = false
}

function closeMobilePathSheet() {
  mobilePathSheetOpen.value = false
  mobilePathSheetExpanded.value = false
  mobilePathSearch.value = ''
}

function toggleMobilePathSheet() {
  mobilePathSheetExpanded.value = !mobilePathSheetExpanded.value
}

function handleMobileSheetTouchStart(event: TouchEvent) {
  mobileTouchStartY.value = event.touches?.[0]?.clientY || 0
}

function handleMobileSheetTouchEnd(event: TouchEvent) {
  const endY = event.changedTouches?.[0]?.clientY || 0
  const delta = endY - mobileTouchStartY.value

  if (delta < -32) {
    mobilePathSheetExpanded.value = true
    return
  }

  if (delta > 70) {
    if (mobilePathSheetExpanded.value) {
      mobilePathSheetExpanded.value = false
    } else {
      closeMobilePathSheet()
    }
  }
}

function mobileActive(key: string) {
  if (key === 'paths') return mobilePathSheetOpen.value
  if (key === 'preview') return false
  if (key === 'dashboard') return false
  return false
}

function handleMobileNav(key: string) {
  if (key === 'paths') {
    openMobilePathSheet(false)
    return
  }

  if (key === 'preview') {
    window.open(previewHref.value, '_blank', 'noopener,noreferrer')
    return
  }

  if (key === 'dashboard') {
    router.push('/app')
    return
  }

  const selectorMap: Record<string, string> = {
    editor: '[data-web-editor-main]',
    meta: '[data-web-meta-panel]'
  }

  const selector = selectorMap[key]
  const target = selector ? document.querySelector(selector) as HTMLElement | null : null

  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    mainScrollEl.value?.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function onGlobalClick(event: MouseEvent) {
  const target = event.target as HTMLElement

  if (!target.closest('[aria-label="Account menu"]') && !target.closest('.account-menu-panel')) {
    accountOpen.value = false
  }

  if (!target.closest('.path-menu-keep')) {
    activeMenuPath.value = null
  }
}

function onEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeMobilePathSheet()
    accountOpen.value = false
    activeMenuPath.value = null

    if (showFormModal.value) closeFormModal()
    if (showDeleteModal.value) closeDeleteModal()
  }
}

watch(
  () => route.query.path,
  (value) => {
    const nextPath = normalizePath(String(value || '/'))

    if (nextPath !== currentPath.value) {
      currentPath.value = nextPath
    }
  },
  { immediate: true }
)

watch(mobilePathSearch, (value) => {
  if (value.trim()) {
    mobilePathSheetExpanded.value = true
  }
})

onMounted(() => {
  subscribePages?.()
  window.addEventListener('click', onGlobalClick)
  window.addEventListener('keydown', onEscape)
})

onUnmounted(() => {
  window.removeEventListener('click', onGlobalClick)
  window.removeEventListener('keydown', onEscape)
})
</script>

<style scoped>
.cms-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgb(64 64 64) transparent;
}

.cms-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.cms-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.cms-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgb(64 64 64);
}

.cms-light-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgb(203 213 225) transparent;
}

.cms-light-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.cms-light-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.cms-light-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgb(203 213 225);
}

:deep(.cms-light-scrollbar *) {
  scroll-margin-top: 96px;
}

.mobile-path-scroll {
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  scrollbar-width: thin;
  scrollbar-color: rgb(34 197 94) transparent;
}

.mobile-path-scroll::-webkit-scrollbar {
  width: 6px;
}

.mobile-path-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.mobile-path-scroll::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgb(34 197 94);
}
</style>