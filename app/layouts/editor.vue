<!-- layouts/editor.vue -->
<template>
  <div class="min-h-screen overflow-hidden bg-gray-100 text-gray-800 dark:bg-neutral-950 dark:text-neutral-200">
    <!-- Top Navbar -->
    <header class="fixed inset-x-0 top-0 z-[90] px-3 pt-3 xl:px-4">
      <div class="mx-auto flex h-16 max-w-[1920px] items-center justify-between rounded-[30px] border border-white/70 bg-white/90 px-3 shadow-[0_14px_34px_-18px_rgba(15,23,42,0.25)] backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/88">
        <!-- Left -->
        <div class="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 xl:hidden dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            aria-label="Buka panel editor"
            @click="openMobilePanel"
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
            <img
              v-if="!logoError"
              :src="appLogo"
              :alt="appName"
              class="h-9 w-9 object-contain"
              @error="logoError = true"
            />

            <div
              v-else
              class="grid h-9 w-9 place-items-center rounded-xl bg-green-600 text-sm font-black text-white"
            >
              O
            </div>
          </div>

          <div class="hidden min-w-0 lg:block">
            <p class="truncate text-sm font-black text-gray-900 dark:text-white">
              Obayan Website Editor
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

        <!-- Center Tools -->
        <nav class="hidden items-center rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-neutral-800 dark:bg-neutral-950 lg:flex">
          <button
            v-for="tool in tools"
            :key="tool.key"
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm transition"
            :class="activeTool === tool.key
              ? 'bg-white text-green-700 shadow-sm dark:bg-neutral-800 dark:text-green-300'
              : 'text-gray-500 hover:bg-white hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'"
            :aria-label="tool.label"
            :title="tool.label"
            @click="activeTool = tool.key"
          >
            <Icon :icon="tool.icon" class="h-4 w-4" />
          </button>
        </nav>

        <!-- Right Actions -->
        <div class="flex items-center gap-2">
          <a
            :href="previewHref"
            target="_blank"
            class="hidden h-10 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:inline-flex dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <Icon icon="lucide:external-link" class="h-4 w-4" />
            Preview
          </a>

          <button
            type="button"
            class="hidden h-10 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 md:inline-flex dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            :disabled="saving || !activePage"
            @click="saveAsDraft"
          >
            <Icon icon="lucide:save" class="h-4 w-4" />
            Draft
          </button>

          <button
            type="button"
            class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-green-600 px-3 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="saving || !activePage"
            @click="publishPage"
          >
            <Icon :icon="saving ? 'lucide:loader-2' : 'lucide:send'" class="h-4 w-4" :class="saving ? 'animate-spin' : ''" />
            <span class="hidden sm:inline">{{ saving ? 'Saving...' : 'Publish' }}</span>
          </button>

          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            :aria-label="isDark ? 'Light mode' : 'Dark mode'"
            @click="toggleTheme"
          >
            <Icon :icon="isDark ? 'lucide:sun' : 'lucide:moon'" class="h-4 w-4" />
          </button>

          <div class="editor-menu-keep relative">
            <button
              type="button"
              class="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-2 py-1.5 shadow-sm transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
              aria-label="Account menu"
              @click.stop="accountOpen = !accountOpen"
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
              class="absolute right-0 top-[calc(100%+10px)] z-[120] w-72 overflow-hidden rounded-[28px] border border-gray-200 bg-white p-2 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900"
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

    <!-- Desktop Left Panel -->
    <aside class="fixed bottom-4 left-4 top-[84px] z-[75] hidden w-[332px] xl:block">
      <div class="flex h-full flex-col overflow-hidden rounded-[34px] border border-white/10 bg-neutral-950/96 shadow-[0_32px_70px_-18px_rgba(0,0,0,0.64)] backdrop-blur-xl">
        <div class="border-b border-white/10 p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="inline-flex items-center gap-2 rounded-full bg-green-500/12 px-3 py-1 text-[11px] font-bold text-green-300 ring-1 ring-green-400/20">
                <span class="h-2 w-2 rounded-full bg-green-400"></span>
                Obayan CMS
              </div>

              <h2 class="mt-3 text-lg font-black text-white">
                {{ activePanelTitle }}
              </h2>

              <p class="mt-1 text-xs text-neutral-500">
                {{ pageItems.length }} pages • {{ publishedCount }} published
              </p>
            </div>

            <button
              type="button"
              class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
              @click="reloadPages"
            >
              <Icon icon="lucide:refresh-cw" class="h-4 w-4" />
            </button>
          </div>

          <div class="mt-4 grid grid-cols-3 gap-1 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
            <button
              v-for="panel in panels"
              :key="panel.key"
              type="button"
              class="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl text-xs font-black transition"
              :class="activePanel === panel.key
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
                : 'text-neutral-400 hover:bg-white/5 hover:text-white'"
              @click="activePanel = panel.key"
            >
              <Icon :icon="panel.icon" class="h-4 w-4" />
              {{ panel.shortLabel }}
            </button>
          </div>

          <div class="relative mt-4">
            <Icon icon="lucide:search" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              v-model.trim="search"
              type="search"
              placeholder="Cari page, layer, asset..."
              class="h-11 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-neutral-500 focus:border-green-400/60 focus:bg-white/10"
            />
          </div>

          <button
            v-if="activePanel === 'pages'"
            type="button"
            class="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-black text-neutral-950 transition hover:bg-green-50"
            @click="openPageForm('create')"
          >
            <Icon icon="lucide:file-plus-2" class="h-4 w-4" />
            Tambah Path
          </button>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto px-3 py-3 editor-dark-scrollbar">
          <!-- Pages -->
          <div v-if="activePanel === 'pages'" class="space-y-2">
            <article
              v-for="item in filteredPages"
              :key="item.path"
              class="editor-menu-keep group relative rounded-[24px] border p-3 transition"
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
                    @click.stop="togglePageMenu(item.path)"
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
                      @click="openPageForm('edit', item)"
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

            <EmptyState v-if="!filteredPages.length" title="Path tidak ditemukan" description="Coba kata kunci lain." icon="lucide:file-search" dark />
          </div>

          <!-- Layers -->
          <div v-else-if="activePanel === 'layers'" class="space-y-2">
            <button
              v-for="layer in filteredLayers"
              :key="layer.id"
              type="button"
              class="flex w-full items-center gap-3 rounded-[22px] border border-white/8 bg-white/[0.035] p-3 text-left transition hover:border-white/14 hover:bg-white/[0.07]"
              :class="layer.selected ? 'border-green-400/30 bg-green-500/15' : ''"
            >
              <div class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/[0.07] text-neutral-300 ring-1 ring-white/10">
                <Icon :icon="layer.icon" class="h-4 w-4" />
              </div>

              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-bold text-white">
                  {{ layer.name }}
                </p>
                <p class="mt-0.5 truncate text-xs text-neutral-500">
                  {{ layer.type }}
                </p>
              </div>

              <Icon v-if="layer.locked" icon="lucide:lock" class="h-4 w-4 text-neutral-500" />
            </button>

            <EmptyState v-if="!filteredLayers.length" title="Layer kosong" description="Belum ada section/layer dari halaman aktif." icon="lucide:layers-3" dark />
          </div>

          <!-- Assets -->
          <div v-else class="grid grid-cols-2 gap-3">
            <button
              v-for="asset in filteredAssets"
              :key="asset.id"
              type="button"
              class="group overflow-hidden rounded-[24px] border border-white/8 bg-white/[0.035] text-left transition hover:border-white/14 hover:bg-white/[0.07]"
            >
              <div class="grid aspect-square place-items-center bg-white/[0.04]">
                <img
                  v-if="asset.url"
                  :src="asset.url"
                  :alt="asset.name"
                  class="h-full w-full object-cover"
                />
                <Icon v-else :icon="asset.icon" class="h-8 w-8 text-neutral-400" />
              </div>

              <div class="border-t border-white/8 px-3 py-2">
                <p class="truncate text-xs font-bold text-white">
                  {{ asset.name }}
                </p>
                <p class="mt-0.5 truncate text-[11px] text-neutral-500">
                  {{ asset.type }}
                </p>
              </div>
            </button>

            <EmptyState v-if="!filteredAssets.length" title="Asset kosong" description="Upload asset dari halaman editor." icon="lucide:image" dark class="col-span-2" />
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Editor Canvas -->
    <main class="h-[100dvh] min-w-0 overflow-hidden px-3 pb-[94px] pt-[92px] transition-all duration-300 xl:pb-4 xl:pl-[352px] xl:pr-[344px] 2xl:pr-[364px]">
      <div class="mx-auto h-full max-w-[1920px] min-w-0">
        <div class="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[34px] border border-white/70 bg-white/92 shadow-[0_24px_55px_-20px_rgba(15,23,42,0.2)] backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/92">
          <!-- Canvas Toolbar -->
          <div class="shrink-0 border-b border-gray-200 bg-white/90 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/90">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    <Icon icon="lucide:pen-tool" class="mr-1.5 h-3.5 w-3.5" />
                    Canvas Workspace
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

              <div class="flex flex-wrap items-center gap-2">
                <select
                  v-model="activeBreakpoint"
                  class="h-11 rounded-2xl border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 outline-none transition focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                >
                  <option value="desktop">Desktop · 1440</option>
                  <option value="tablet">Tablet · 834</option>
                  <option value="mobile">Mobile · 390</option>
                </select>

                <div class="flex h-11 items-center gap-1 rounded-2xl border border-gray-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-900">
                  <button
                    type="button"
                    class="grid h-9 w-9 place-items-center rounded-xl text-gray-600 transition hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    @click="zoomOut"
                  >
                    <Icon icon="lucide:minus" class="h-4 w-4" />
                  </button>

                  <span class="min-w-12 text-center text-xs font-black text-gray-500 dark:text-neutral-400">
                    {{ zoom }}%
                  </span>

                  <button
                    type="button"
                    class="grid h-9 w-9 place-items-center rounded-xl text-gray-600 transition hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    @click="zoomIn"
                  >
                    <Icon icon="lucide:plus" class="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  class="hidden h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 md:inline-flex dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  @click="resetZoom"
                >
                  <Icon icon="lucide:scan" class="h-4 w-4" />
                  Fit
                </button>
              </div>
            </div>
          </div>

          <!-- Canvas Body -->
          <div class="min-h-0 flex-1 overflow-auto bg-gray-100 p-6 editor-light-scrollbar dark:bg-neutral-950">
            <div class="mx-auto flex min-h-full w-max items-start justify-center pb-16">
              <div
                :style="canvasScaleStyle"
                class="origin-top rounded-[28px] border border-gray-300 bg-white shadow-2xl shadow-gray-300/60 dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-black/40"
              >
                <div
                  :style="artboardStyle"
                  class="relative overflow-hidden rounded-[27px] bg-white dark:bg-neutral-950"
                >
                  <div
                    class="pointer-events-none absolute inset-0 opacity-[0.28] dark:opacity-[0.14]"
                    style="background-image: linear-gradient(to right, rgba(115,115,115,.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(115,115,115,.18) 1px, transparent 1px); background-size: 24px 24px;"
                  />

                  <slot
                    :selected-path="selectedPath"
                    :active-page="activePage"
                    :active-tool="activeTool"
                    :active-breakpoint="activeBreakpoint"
                    :artboard="artboard"
                    :zoom="zoom"
                  />

                  <div class="pointer-events-none absolute bottom-4 left-4 rounded-2xl border border-gray-200 bg-white/85 px-3 py-2 text-xs font-semibold text-gray-500 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/85 dark:text-neutral-400">
                    <div class="flex items-center gap-2">
                      <Icon icon="lucide:mouse-pointer-2" class="h-3.5 w-3.5" />
                      {{ activeToolLabel }} • {{ activeBreakpointLabel }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Status Bar -->
          <div class="shrink-0 border-t border-gray-200 bg-white/90 px-4 py-2 text-xs text-gray-500 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-400">
            <div class="flex items-center justify-between gap-3">
              <div class="flex min-w-0 items-center gap-3">
                <span class="inline-flex items-center gap-1.5">
                  <span class="h-2 w-2 rounded-full bg-green-500"></span>
                  Ready
                </span>
                <span class="hidden sm:inline">
                  {{ activePageTitle }}
                </span>
              </div>

              <div class="flex items-center gap-3">
                <span>{{ artboard.width }} × {{ artboard.height }}</span>
                <span>{{ zoom }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Right Properties Panel -->
    <aside class="fixed bottom-4 right-4 top-[84px] z-[75] hidden w-[320px] 2xl:block">
      <div class="flex h-full flex-col overflow-hidden rounded-[34px] border border-white/70 bg-white/92 shadow-[0_24px_55px_-20px_rgba(15,23,42,0.2)] backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/92">
        <div class="border-b border-gray-200 p-4 dark:border-neutral-800">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 class="text-sm font-black text-gray-900 dark:text-white">
                Properties
              </h2>
              <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                Frame, responsive, appearance
              </p>
            </div>

            <span class="rounded-xl bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-500 dark:bg-neutral-800 dark:text-neutral-400">
              Frame
            </span>
          </div>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto editor-light-scrollbar">
          <section class="border-b border-gray-200 p-4 dark:border-neutral-800">
            <h3 class="mb-3 text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Layout
            </h3>

            <div class="grid grid-cols-2 gap-3">
              <label class="space-y-1">
                <span class="text-xs font-semibold text-gray-500 dark:text-neutral-400">Width</span>
                <input
                  v-model.number="artboard.width"
                  type="number"
                  class="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:focus:bg-neutral-900"
                />
              </label>

              <label class="space-y-1">
                <span class="text-xs font-semibold text-gray-500 dark:text-neutral-400">Height</span>
                <input
                  v-model.number="artboard.height"
                  type="number"
                  class="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:focus:bg-neutral-900"
                />
              </label>
            </div>
          </section>

          <section class="border-b border-gray-200 p-4 dark:border-neutral-800">
            <h3 class="mb-3 text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Responsive
            </h3>

            <div class="space-y-2">
              <button
                v-for="breakpoint in breakpoints"
                :key="breakpoint.key"
                type="button"
                class="flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-sm font-semibold transition"
                :class="activeBreakpoint === breakpoint.key
                  ? 'border-green-500 bg-green-600 text-white shadow-lg shadow-green-500/20'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800'"
                @click="selectBreakpoint(breakpoint.key)"
              >
                <span class="inline-flex items-center gap-2">
                  <Icon :icon="breakpoint.icon" class="h-4 w-4" />
                  {{ breakpoint.label }}
                </span>

                <span class="text-xs opacity-80">
                  {{ breakpoint.width }}px
                </span>
              </button>
            </div>
          </section>

          <section class="border-b border-gray-200 p-4 dark:border-neutral-800">
            <h3 class="mb-3 text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-neutral-500">
              Appearance
            </h3>

            <div class="space-y-3">
              <label class="flex items-center justify-between gap-3">
                <span class="text-sm font-semibold text-gray-700 dark:text-neutral-200">Canvas grid</span>

                <button
                  type="button"
                  class="relative inline-flex h-7 w-12 items-center rounded-full transition"
                  :class="showGrid ? 'bg-green-600' : 'bg-gray-200 dark:bg-neutral-700'"
                  @click="showGrid = !showGrid"
                >
                  <span
                    class="inline-block h-5 w-5 rounded-full bg-white shadow transition"
                    :class="showGrid ? 'translate-x-6' : 'translate-x-1'"
                  ></span>
                </button>
              </label>

              <label class="space-y-1">
                <span class="text-xs font-semibold text-gray-500 dark:text-neutral-400">Zoom</span>
                <input
                  v-model.number="zoom"
                  type="range"
                  min="30"
                  max="200"
                  step="10"
                  class="w-full accent-green-600"
                />
              </label>
            </div>
          </section>

          <section class="p-4">
            <button
              type="button"
              class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:opacity-60"
              :disabled="saving || !activePage"
              @click="publishPage"
            >
              <Icon :icon="saving ? 'lucide:loader-2' : 'lucide:send'" class="h-4 w-4" :class="saving ? 'animate-spin' : ''" />
              Publish Page
            </button>

            <button
              type="button"
              class="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              :disabled="saving || !activePage"
              @click="saveAsDraft"
            >
              <Icon icon="lucide:save" class="h-4 w-4" />
              Save as Draft
            </button>
          </section>
        </div>
      </div>
    </aside>

    <!-- Mobile Bottom Navigation -->
    <nav class="fixed inset-x-3 bottom-3 z-[80] xl:hidden">
      <div class="rounded-[30px] border border-white/10 bg-neutral-950/95 p-2 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.65)] backdrop-blur-xl">
        <div class="grid grid-cols-5 gap-1">
          <button
            v-for="item in mobileNavItems"
            :key="item.key"
            type="button"
            class="group flex min-w-0 flex-col items-center justify-center rounded-[22px] px-2 py-2.5 text-center transition"
            :class="mobileActive === item.key
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

    <!-- Mobile Panel Sheet -->
    <Teleport to="body">
      <div v-if="mobilePanelOpen" class="fixed inset-0 z-[130] xl:hidden">
        <div class="absolute inset-0 bg-neutral-950/65 backdrop-blur-sm" @click="closeMobilePanel"></div>

        <section class="absolute inset-x-0 bottom-0 flex h-[78dvh] flex-col overflow-hidden rounded-t-[34px] border border-white/10 bg-neutral-950/96 shadow-[0_-28px_70px_-26px_rgba(0,0,0,0.75)] backdrop-blur-xl">
          <div class="shrink-0 px-4 pb-3 pt-3">
            <div class="mx-auto mb-3 h-1.5 w-14 rounded-full bg-neutral-700"></div>

            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <h3 class="truncate text-base font-black text-white">
                  {{ activePanelTitle }}
                </h3>
                <p class="truncate text-xs text-neutral-400">
                  {{ selectedPath }}
                </p>
              </div>

              <button
                type="button"
                class="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-neutral-200 transition hover:bg-white/10"
                @click="closeMobilePanel"
              >
                <Icon icon="lucide:x" class="h-4 w-4" />
              </button>
            </div>

            <div class="mt-4 grid grid-cols-3 gap-1 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
              <button
                v-for="panel in panels"
                :key="`mobile-${panel.key}`"
                type="button"
                class="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl text-xs font-black transition"
                :class="activePanel === panel.key
                  ? 'bg-green-600 text-white'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'"
                @click="activePanel = panel.key"
              >
                <Icon :icon="panel.icon" class="h-4 w-4" />
                {{ panel.shortLabel }}
              </button>
            </div>

            <div class="relative mt-3">
              <Icon icon="lucide:search" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <input
                v-model.trim="search"
                type="search"
                placeholder="Cari..."
                class="h-11 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-neutral-500 focus:border-green-400/60 focus:bg-white/10"
              />
            </div>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto px-4 pb-6 editor-dark-scrollbar">
            <div v-if="activePanel === 'pages'" class="space-y-2">
              <button
                v-for="item in filteredPages"
                :key="`mobile-page-${item.path}`"
                type="button"
                class="flex w-full items-start gap-3 rounded-[24px] border p-3 text-left transition"
                :class="isActivePath(item.path)
                  ? 'border-green-400/30 bg-green-500/15'
                  : 'border-white/8 bg-white/[0.035]'"
                @click="selectPath(item.path)"
              >
                <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/[0.07] text-neutral-300 ring-1 ring-white/10">
                  <Icon :icon="item.path === '/' ? 'lucide:home' : 'lucide:file-text'" class="h-4 w-4" />
                </div>

                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-bold text-white">
                    {{ item.title }}
                  </p>
                  <p class="mt-1 truncate text-xs text-neutral-400">
                    {{ item.path }}
                  </p>
                </div>
              </button>
            </div>

            <div v-else-if="activePanel === 'layers'" class="space-y-2">
              <button
                v-for="layer in filteredLayers"
                :key="`mobile-layer-${layer.id}`"
                type="button"
                class="flex w-full items-center gap-3 rounded-[24px] border border-white/8 bg-white/[0.035] p-3 text-left"
              >
                <Icon :icon="layer.icon" class="h-5 w-5 text-neutral-300" />
                <span class="min-w-0 flex-1 truncate text-sm font-bold text-white">{{ layer.name }}</span>
              </button>
            </div>

            <div v-else class="grid grid-cols-2 gap-3">
              <button
                v-for="asset in filteredAssets"
                :key="`mobile-asset-${asset.id}`"
                type="button"
                class="overflow-hidden rounded-[24px] border border-white/8 bg-white/[0.035] text-left"
              >
                <div class="grid aspect-square place-items-center bg-white/[0.04]">
                  <img v-if="asset.url" :src="asset.url" :alt="asset.name" class="h-full w-full object-cover" />
                  <Icon v-else :icon="asset.icon" class="h-8 w-8 text-neutral-400" />
                </div>

                <div class="px-3 py-2">
                  <p class="truncate text-xs font-bold text-white">{{ asset.name }}</p>
                </div>
              </button>
            </div>
          </div>
        </section>
      </div>
    </Teleport>

    <!-- Page Form Modal -->
    <Teleport to="body">
      <div v-if="formOpen" class="fixed inset-0 z-[150]">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closePageForm"></div>

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
                  @click="closePageForm"
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
                @click="closePageForm"
              >
                Batal
              </button>

              <button
                type="button"
                class="inline-flex h-11 items-center justify-center rounded-2xl bg-green-600 px-4 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:opacity-60"
                :disabled="saving"
                @click="submitPageForm"
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
      <div v-if="deleteOpen" class="fixed inset-0 z-[150]">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeDeleteModal"></div>

        <div class="relative mx-auto mt-24 w-[92%] max-w-md">
          <div class="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
            <div class="p-6">
              <div class="flex items-start gap-4">
                <div class="shrink-0 rounded-2xl bg-rose-100 p-3 dark:bg-rose-900/20">
                  <Icon icon="lucide:trash-2" class="h-6 w-6 text-rose-600 dark:text-rose-400" />
                </div>

                <div>
                  <h3 class="text-base font-black text-gray-900 dark:text-white">
                    Hapus Path
                  </h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                    Yakin ingin menghapus path
                    <span class="font-bold text-gray-900 dark:text-white">{{ targetPage?.path }}</span>?
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
import { computed, defineComponent, h, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead, useRuntimeConfig, useState } from '#imports'
import { useWeb } from '~/composables/data/useWeb'

type PageStatus = 'draft' | 'published'
type PanelKey = 'pages' | 'layers' | 'assets'
type ToolKey = 'select' | 'frame' | 'text' | 'shape' | 'hand' | 'comment'
type BreakpointKey = 'desktop' | 'tablet' | 'mobile'
type MobileNavKey = 'panel' | 'canvas' | 'preview' | 'theme' | 'dashboard'

type PageRow = {
  path: string
  pathKey: string
  title: string
  status: PageStatus
  protected: boolean
  raw?: any
}

type LayerRow = {
  id: string
  name: string
  type: string
  icon: string
  selected: boolean
  locked: boolean
  raw?: any
}

type AssetRow = {
  id: string
  name: string
  type: string
  icon: string
  url?: string
  raw?: any
}

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const web = useWeb() as any

const pages = web?.pages || ref<any[]>([])
const currentPath = web?.currentPath || ref('/')
const subscribePages = web?.subscribePages
const createPage = web?.createPage
const renamePage = web?.renamePage
const deletePage = web?.deletePage
const upsertMeta = web?.upsertMeta

const normalizePath = typeof web?.normalizePath === 'function'
  ? web.normalizePath
  : normalizePathLocal

const clientDisplayName = String(
  config.public.clientDisplayName ||
  config.public.siteName ||
  'Obayan'
)

const appName = String(
  config.public.appName ||
  config.public.siteName ||
  'Obayan CMS'
)

const appLogo = String(
  config.public.appLogo ||
  config.public.logo ||
  '/assets/logo-obayan.png'
)

const siteUrl = String(
  config.public.siteUrl ||
  config.public.publicSiteUrl ||
  ''
).replace(/\/$/, '')

useHead({
  title: `${appName} - Website Editor`,
  link: [
    { rel: 'icon', href: appLogo },
    { rel: 'shortcut icon', href: appLogo },
    { rel: 'apple-touch-icon', href: appLogo }
  ]
})

const DEFAULT_LOCKED_PATHS = new Set([
  '/',
  '/news',
  '/gallery',
  '/profile',
  '/contact',
  '/program'
])

const sessionUser = useState<any>('sessionUser', () => ({}))

const user = computed(() => ({
  name: sessionUser.value?.name || sessionUser.value?.displayName || 'Admin Obayan',
  email: sessionUser.value?.email || 'admin@obayan.id',
  avatar: sessionUser.value?.avatar || sessionUser.value?.photoURL || '/assets/pp.jpg'
}))

const tools: Array<{ key: ToolKey; label: string; icon: string }> = [
  { key: 'select', label: 'Select', icon: 'lucide:mouse-pointer-2' },
  { key: 'frame', label: 'Frame', icon: 'lucide:square-dashed' },
  { key: 'text', label: 'Text', icon: 'lucide:type' },
  { key: 'shape', label: 'Shape', icon: 'lucide:square' },
  { key: 'hand', label: 'Hand', icon: 'lucide:hand' },
  { key: 'comment', label: 'Comment', icon: 'lucide:message-circle' }
]

const panels: Array<{ key: PanelKey; label: string; shortLabel: string; icon: string }> = [
  { key: 'pages', label: 'Pages', shortLabel: 'Pages', icon: 'lucide:files' },
  { key: 'layers', label: 'Layers', shortLabel: 'Layer', icon: 'lucide:layers-3' },
  { key: 'assets', label: 'Assets', shortLabel: 'Asset', icon: 'lucide:image' }
]

const breakpoints: Array<{ key: BreakpointKey; label: string; width: number; height: number; icon: string }> = [
  { key: 'desktop', label: 'Desktop', width: 1440, height: 900, icon: 'lucide:monitor' },
  { key: 'tablet', label: 'Tablet', width: 834, height: 1112, icon: 'lucide:tablet' },
  { key: 'mobile', label: 'Mobile', width: 390, height: 844, icon: 'lucide:smartphone' }
]

const mobileNavItems: Array<{ key: MobileNavKey; label: string; icon: string }> = [
  { key: 'panel', label: 'Panel', icon: 'lucide:panel-left-open' },
  { key: 'canvas', label: 'Canvas', icon: 'lucide:pen-tool' },
  { key: 'preview', label: 'View', icon: 'lucide:external-link' },
  { key: 'theme', label: 'Mode', icon: 'lucide:moon-star' },
  { key: 'dashboard', label: 'Home', icon: 'lucide:layout-dashboard' }
]

const logoError = ref(false)
const accountOpen = ref(false)
const activePanel = ref<PanelKey>('pages')
const activeTool = ref<ToolKey>('select')
const activeBreakpoint = ref<BreakpointKey>('desktop')
const search = ref('')
const zoom = ref(80)
const saving = ref(false)
const activeMenuPath = ref<string | null>(null)
const mobilePanelOpen = ref(false)
const mobileActive = ref<MobileNavKey>('canvas')
const showGrid = ref(true)

const formOpen = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const formError = ref('')
const targetPage = ref<PageRow | null>(null)
const deleteOpen = ref(false)

const form = reactive({
  path: '',
  title: '',
  status: 'draft' as PageStatus
})

const activeBreakpointData = computed(() => {
  return breakpoints.find((item) => item.key === activeBreakpoint.value) || breakpoints[0]
})

const artboard = reactive({
  width: activeBreakpointData.value.width,
  height: activeBreakpointData.value.height
})

const selectedPath = computed(() => {
  return normalizePath(String(route.query.path || currentPath.value || '/'))
})

const rawPageRows = computed<any[]>(() => {
  return Array.isArray(pages.value) ? pages.value : []
})

const pageItems = computed<PageRow[]>(() => {
  return rawPageRows.value
    .map((item: any) => {
      const path = normalizePath(item.path || item.slug || '/')
      const metaTitle = String(item?.meta?.title || '').trim()
      const rootTitle = String(item?.title || item?.name || '').trim()
      const status = resolveStatus(item)

      return {
        path,
        pathKey: item.pathKey || item.key || path.replace(/\W+/g, '-') || 'root',
        title: metaTitle || rootTitle || humanizePath(path),
        status,
        protected: Boolean(item?.isDefault || item?.default || item?.system || DEFAULT_LOCKED_PATHS.has(path)),
        raw: item
      }
    })
    .sort((a, b) => {
      if (a.path === '/') return -1
      if (b.path === '/') return 1
      return a.path.localeCompare(b.path)
    })
})

const activePage = computed<PageRow | null>(() => {
  return pageItems.value.find((item) => item.path === selectedPath.value) || null
})

const activePageTitle = computed(() => {
  return activePage.value?.title || 'Website Editor'
})

const publishedCount = computed(() => {
  return pageItems.value.filter((item) => item.status === 'published').length
})

const filteredPages = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  if (!keyword) return pageItems.value

  return pageItems.value.filter((item) => {
    return [item.title, item.path, item.status].join(' ').toLowerCase().includes(keyword)
  })
})

const layers = computed<LayerRow[]>(() => {
  const raw = activePage.value?.raw || {}
  const source = getSectionList(raw)

  if (!source.length) {
    return [
      {
        id: 'root',
        name: activePageTitle.value,
        type: 'page',
        icon: 'lucide:panel-top',
        selected: true,
        locked: true,
        raw
      }
    ]
  }

  return source.map((section: any, index: number) => {
    const type = String(section?.type || section?.component || section?.name || 'section')

    return {
      id: String(section?.id || section?.uid || `${type}-${index}`),
      name: String(section?.title || section?.label || humanizePath(type) || `Section ${index + 1}`),
      type,
      icon: sectionIcon(type),
      selected: index === 0,
      locked: Boolean(section?.locked || section?.system),
      raw: section
    }
  })
})

const filteredLayers = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  if (!keyword) return layers.value

  return layers.value.filter((item) => {
    return [item.name, item.type].join(' ').toLowerCase().includes(keyword)
  })
})

const assets = computed<AssetRow[]>(() => {
  const raw = activePage.value?.raw || {}
  const source = getAssetList(raw)

  return source.map((asset: any, index: number) => {
    const url = String(asset?.url || asset?.src || asset?.image || asset?.secure_url || '')
    const type = String(asset?.type || asset?.resource_type || guessAssetType(url))

    return {
      id: String(asset?.id || asset?.uid || asset?.public_id || `asset-${index}`),
      name: String(asset?.name || asset?.filename || asset?.title || `Asset ${index + 1}`),
      type,
      icon: assetIcon(type),
      url,
      raw: asset
    }
  })
})

const filteredAssets = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  if (!keyword) return assets.value

  return assets.value.filter((item) => {
    return [item.name, item.type, item.url].join(' ').toLowerCase().includes(keyword)
  })
})

const activePanelTitle = computed(() => {
  return panels.find((panel) => panel.key === activePanel.value)?.label || 'Panel'
})

const activeToolLabel = computed(() => {
  return tools.find((tool) => tool.key === activeTool.value)?.label || 'Select'
})

const activeBreakpointLabel = computed(() => {
  return `${activeBreakpointData.value.label} ${activeBreakpointData.value.width}px`
})

const artboardStyle = computed(() => ({
  width: `${Math.max(320, Number(artboard.width) || activeBreakpointData.value.width)}px`,
  height: `${Math.max(480, Number(artboard.height) || activeBreakpointData.value.height)}px`
}))

const canvasScaleStyle = computed(() => ({
  transform: `scale(${zoom.value / 100})`
}))

const previewHref = computed(() => {
  const path = selectedPath.value === '/' ? '/' : selectedPath.value
  return siteUrl ? `${siteUrl}${path}` : path
})

const isDark = ref(false)

function resolveStatus(item: any): PageStatus {
  const status = item?.meta?.status || item?.status

  return status === 'published' ? 'published' : 'draft'
}

function normalizePathLocal(path: string) {
  const clean = String(path || '/').trim()

  if (!clean || clean === '/') return '/'

  return `/${clean}`
    .replace(/\/+/g, '/')
    .replace(/\/$/, '')
    .toLowerCase()
}

function humanizePath(path: string) {
  if (!path || path === '/') return 'Home'

  return path
    .replace(/^\//, '')
    .replace(/[-_]/g, ' ')
    .split('/')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

function getSectionList(raw: any) {
  const candidates = [
    raw?.sections,
    raw?.blocks,
    raw?.components,
    raw?.content?.sections,
    raw?.content?.blocks,
    raw?.layout?.sections
  ]

  return candidates.find((item) => Array.isArray(item)) || []
}

function getAssetList(raw: any) {
  const candidates = [
    raw?.assets,
    raw?.media,
    raw?.images,
    raw?.content?.assets,
    raw?.content?.media
  ]

  return candidates.find((item) => Array.isArray(item)) || []
}

function sectionIcon(type: string) {
  const key = type.toLowerCase()

  if (key.includes('hero')) return 'lucide:sparkles'
  if (key.includes('navbar') || key.includes('header')) return 'lucide:panel-top'
  if (key.includes('footer')) return 'lucide:panel-bottom'
  if (key.includes('gallery') || key.includes('image')) return 'lucide:images'
  if (key.includes('news') || key.includes('blog')) return 'lucide:newspaper'
  if (key.includes('text')) return 'lucide:type'
  if (key.includes('button') || key.includes('cta')) return 'lucide:mouse-pointer-click'

  return 'lucide:box'
}

function assetIcon(type: string) {
  const key = type.toLowerCase()

  if (key.includes('image')) return 'lucide:image'
  if (key.includes('video')) return 'lucide:video'
  if (key.includes('pdf') || key.includes('document')) return 'lucide:file-text'

  return 'lucide:file'
}

function guessAssetType(url: string) {
  const clean = url.toLowerCase()

  if (/\.(png|jpg|jpeg|webp|gif|svg)$/.test(clean)) return 'image'
  if (/\.(mp4|webm|mov)$/.test(clean)) return 'video'
  if (/\.pdf$/.test(clean)) return 'document'

  return 'asset'
}

function isActivePath(path: string) {
  return normalizePath(path) === selectedPath.value
}

function setActivePath(path: string) {
  const nextPath = normalizePath(path)

  currentPath.value = nextPath
  web?.setActivePath?.(nextPath)

  router.replace({
    query: {
      ...route.query,
      path: nextPath
    }
  })
}

function selectPath(path: string) {
  setActivePath(path)
  closeMobilePanel()
  activeMenuPath.value = null
}

function reloadPages() {
  activeMenuPath.value = null
  subscribePages?.()
}

function togglePageMenu(path: string) {
  activeMenuPath.value = activeMenuPath.value === path ? null : path
}

function selectBreakpoint(key: BreakpointKey) {
  activeBreakpoint.value = key

  const selected = breakpoints.find((item) => item.key === key)
  if (!selected) return

  artboard.width = selected.width
  artboard.height = selected.height
}

function zoomIn() {
  zoom.value = Math.min(200, zoom.value + 10)
}

function zoomOut() {
  zoom.value = Math.max(30, zoom.value - 10)
}

function resetZoom() {
  zoom.value = activeBreakpoint.value === 'desktop' ? 80 : activeBreakpoint.value === 'tablet' ? 70 : 90
}

function openMobilePanel() {
  mobilePanelOpen.value = true
  mobileActive.value = 'panel'
}

function closeMobilePanel() {
  mobilePanelOpen.value = false
}

function handleMobileNav(key: MobileNavKey) {
  mobileActive.value = key

  if (key === 'panel') {
    openMobilePanel()
    return
  }

  if (key === 'preview') {
    window.open(previewHref.value, '_blank')
    return
  }

  if (key === 'theme') {
    toggleTheme()
    return
  }

  if (key === 'dashboard') {
    router.push('/app')
  }
}

function openPageForm(mode: 'create' | 'edit', page?: PageRow | null) {
  activeMenuPath.value = null
  formError.value = ''
  formMode.value = mode
  targetPage.value = page || null

  if (mode === 'create') {
    form.path = '/new-page'
    form.title = 'New Page'
    form.status = 'draft'
  } else if (page) {
    form.path = page.path
    form.title = page.title
    form.status = page.status
  }

  formOpen.value = true
}

function closePageForm() {
  formOpen.value = false
  formError.value = ''
  targetPage.value = null
}

function validateForm() {
  const path = normalizePath(form.path)

  if (!path.startsWith('/')) {
    formError.value = 'Path harus diawali dengan "/".'
    return false
  }

  if (!/^\/[a-z0-9\-\/]*$/i.test(path)) {
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

async function submitPageForm() {
  if (!validateForm()) return

  saving.value = true

  try {
    const nextPath = normalizePath(form.path)
    const nextTitle = form.title.trim() || humanizePath(nextPath)
    const nextStatus = form.status === 'published' ? 'published' : 'draft'

    if (formMode.value === 'create') {
      if (typeof createPage !== 'function') {
        throw new Error('createPage belum tersedia di useWeb().')
      }

      await createPage({
        path: nextPath,
        title: nextTitle,
        description: '',
        status: nextStatus
      })

      setActivePath(nextPath)

      if (typeof upsertMeta === 'function') {
        await upsertMeta({
          title: nextTitle,
          status: nextStatus
        })
      }
    } else if (targetPage.value) {
      const oldPath = targetPage.value.path

      if (nextPath !== oldPath) {
        if (typeof renamePage !== 'function') {
          throw new Error('renamePage belum tersedia di useWeb().')
        }

        await renamePage(oldPath, nextPath)
      }

      setActivePath(nextPath)

      if (typeof upsertMeta === 'function') {
        await upsertMeta({
          title: nextTitle,
          status: nextStatus
        })
      }
    }

    await subscribePages?.()
    closePageForm()
  } catch (error: any) {
    formError.value = error?.message || 'Gagal menyimpan halaman.'
  } finally {
    saving.value = false
  }
}

function openDeleteModal(page: PageRow) {
  if (page.protected) return

  activeMenuPath.value = null
  targetPage.value = page
  deleteOpen.value = true
}

function closeDeleteModal() {
  deleteOpen.value = false
  targetPage.value = null
}

async function confirmDelete() {
  if (!targetPage.value || targetPage.value.protected) return

  saving.value = true

  try {
    if (typeof deletePage !== 'function') {
      throw new Error('deletePage belum tersedia di useWeb().')
    }

    const deletedPath = targetPage.value.path

    await deletePage(deletedPath)
    await subscribePages?.()

    if (selectedPath.value === deletedPath) {
      selectPath('/')
    }

    closeDeleteModal()
  } finally {
    saving.value = false
  }
}

async function publishPage() {
  if (!activePage.value || typeof upsertMeta !== 'function') return

  saving.value = true

  try {
    setActivePath(activePage.value.path)

    await upsertMeta({
      title: activePage.value.title,
      status: 'published'
    })

    await subscribePages?.()
  } finally {
    saving.value = false
  }
}

async function saveAsDraft() {
  if (!activePage.value || typeof upsertMeta !== 'function') return

  saving.value = true

  try {
    setActivePath(activePage.value.path)

    await upsertMeta({
      title: activePage.value.title,
      status: 'draft'
    })

    await subscribePages?.()
  } finally {
    saving.value = false
  }
}

function toggleTheme() {
  isDark.value = !isDark.value
  applyTheme()
}

function applyTheme() {
  if (!process.client) return

  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('obayan-editor-theme', isDark.value ? 'dark' : 'light')
}

function initTheme() {
  if (!process.client) return

  const saved = localStorage.getItem('obayan-editor-theme')

  if (saved === 'dark') {
    isDark.value = true
  } else if (saved === 'light') {
    isDark.value = false
  } else {
    isDark.value = window.matchMedia?.('(prefers-color-scheme: dark)').matches || false
  }

  applyTheme()
}

function loadSessionUser() {
  $fetch('/api/auth/me')
    .then((response: any) => {
      if (response) {
        sessionUser.value = response
      }
    })
    .catch(() => {
      // Biarkan fallback user tetap jalan kalau endpoint auth belum dibuat.
    })
}

function onGlobalClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null

  if (target?.closest('.editor-menu-keep')) return

  accountOpen.value = false
  activeMenuPath.value = null
}

function onEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape') return

  accountOpen.value = false
  activeMenuPath.value = null
  mobilePanelOpen.value = false
  formOpen.value = false
  deleteOpen.value = false
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

watch(activeBreakpoint, (key) => {
  const selected = breakpoints.find((item) => item.key === key)

  if (!selected) return

  artboard.width = selected.width
  artboard.height = selected.height
})

watch(showGrid, () => {
  // Disediakan agar state grid reaktif jika nanti mau dihubungkan ke page editor.
})

onMounted(() => {
  initTheme()
  loadSessionUser()
  subscribePages?.()

  window.addEventListener('click', onGlobalClick)
  window.addEventListener('keydown', onEscape)
})

onUnmounted(() => {
  window.removeEventListener('click', onGlobalClick)
  window.removeEventListener('keydown', onEscape)
})

const EmptyState = defineComponent({
  name: 'EmptyState',
  props: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    dark: { type: Boolean, default: false }
  },
  setup(props) {
    return () => h(
      'div',
      {
        class: props.dark
          ? 'rounded-3xl border border-white/10 bg-white/5 px-4 py-8 text-center'
          : 'rounded-3xl border border-gray-200 bg-gray-50 px-4 py-8 text-center dark:border-neutral-800 dark:bg-neutral-900'
      },
      [
        h(Icon, {
          icon: props.icon,
          class: props.dark
            ? 'mx-auto h-8 w-8 text-neutral-500'
            : 'mx-auto h-8 w-8 text-gray-400 dark:text-neutral-500'
        }),
        h(
          'p',
          {
            class: props.dark
              ? 'mt-3 text-sm font-semibold text-neutral-300'
              : 'mt-3 text-sm font-semibold text-gray-700 dark:text-neutral-200'
          },
          props.title
        ),
        h(
          'p',
          {
            class: props.dark
              ? 'mt-1 text-xs text-neutral-500'
              : 'mt-1 text-xs text-gray-500 dark:text-neutral-500'
          },
          props.description
        )
      ]
    )
  }
})
</script>

<style scoped>
.editor-dark-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgb(64 64 64) transparent;
}

.editor-dark-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.editor-dark-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.editor-dark-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgb(64 64 64);
}

.editor-light-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgb(203 213 225) transparent;
}

.editor-light-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.editor-light-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.editor-light-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgb(203 213 225);
}

:deep(.editor-light-scrollbar *) {
  scroll-margin-top: 96px;
}

@media (max-width: 1279px) {
  :deep(body) {
    overscroll-behavior-y: contain;
  }
}
</style>