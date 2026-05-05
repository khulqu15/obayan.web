<template>
  <div class="min-h-screen bg-gray-100 text-gray-800 dark:bg-neutral-950 dark:text-neutral-200">
    <AppLoading
      v-if="authLoading"
      :force="true"
      label="Memuat dashboard"
      sublabel="Menyiapkan sesi dan hak akses"
    />

    <div v-else class="min-h-screen">
      <div
        v-if="rightOpen"
        class="fixed inset-0 z-[65] bg-black/20 backdrop-blur-[1px] lg:hidden"
        @click="rightOpen = false"
      />

      <!-- Top Navbar -->
      <header class="fixed inset-x-0 top-0 z-[80] px-3 pt-3 lg:px-4">
        <div class="mx-auto flex h-16 max-w-[1920px] items-center justify-between rounded-3xl border border-white/70 bg-white/90 px-3 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.18)] backdrop-blur dark:border-white/10 dark:bg-neutral-900/85 dark:shadow-[0_14px_36px_-14px_rgba(0,0,0,0.55)]">
          <div class="flex min-w-0 items-center gap-2 lg:gap-3">
            <button
              type="button"
              class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 lg:hidden dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              @click="openMobileMenu(true)"
              aria-label="Buka menu"
            >
              <Icon icon="lucide:menu" class="h-4 w-4" />
            </button>

            <div class="flex min-w-0 items-center gap-3">
              <div class="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                <img :src="appLogo" :alt="`Logo ${clientDisplayName}`" class="h-9 w-9 object-contain" />
              </div>

              <div class="min-w-0">
                <p class="truncate text-sm font-bold text-gray-900 dark:text-white">
                  {{ titleSidebar }}
                </p>
                <p class="truncate text-xs text-gray-500 dark:text-neutral-400">
                  {{ subtitileSidebar }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 lg:gap-3">
            <div class="hidden items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500 md:flex dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
              <span class="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
              {{ tokenUser?.role || 'guest' }}
            </div>

            <button
              type="button"
              class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              @click="rightOpen = !rightOpen"
              aria-label="Buka notifikasi"
            >
              <Icon icon="iconamoon:notification-light" class="h-5 w-5" />
            </button>

            <div class="relative">
              <button
                type="button"
                class="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-2 py-1.5 shadow-sm transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                @click.stop="accountOpen = !accountOpen"
                aria-label="Account menu"
              >
                <img :src="user.avatar" alt="Avatar" class="h-8 w-8 rounded-xl object-cover" />

                <div class="hidden min-w-0 text-left sm:block">
                  <div class="truncate text-xs font-semibold text-gray-900 dark:text-white">
                    {{ user.name }}
                  </div>
                  <div class="truncate text-[11px] text-gray-500 dark:text-neutral-400">
                    {{ user.email }}
                  </div>
                </div>

                <Icon icon="lucide:chevron-down" class="hidden h-4 w-4 text-gray-400 sm:block" />
              </button>

              <div
                v-if="accountOpen"
                class="account-popover absolute right-0 top-[calc(100%+10px)] z-[90] w-72 overflow-hidden rounded-3xl border border-gray-200 bg-white p-2 shadow-[0_24px_48px_-18px_rgba(15,23,42,0.25)] dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-[0_24px_48px_-18px_rgba(0,0,0,0.55)]"
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
                    v-for="item in accountMenu.filter(i => i.label !== 'Logout')"
                    :key="item.label"
                    :to="item.href"
                    class="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="accountOpen = false"
                  >
                    <Icon :icon="item.icon" class="h-4 w-4" />
                    {{ item.label }}
                  </NuxtLink>

                  <button
                    type="button"
                    class="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20"
                    @click="openLogoutModal"
                  >
                    <Icon icon="lucide:log-out" class="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Desktop Sidebar -->
      <aside class="fixed bottom-4 left-4 top-[84px] z-[75] hidden w-[280px] lg:block">
        <div class="flex h-full flex-col overflow-hidden rounded-[30px] border border-white/10 bg-neutral-950/95 shadow-[0_30px_60px_-16px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <div class="border-b border-white/10 px-4 py-4">
            <div class="rounded-[22px] border border-white/10 bg-white/5 p-3">
              <div class="flex items-center gap-3">
                <img :src="user.avatar" alt="Avatar" class="h-11 w-11 rounded-2xl object-cover ring-2 ring-white/10" />
                <div class="min-w-0">
                  <div class="truncate text-sm font-semibold text-white">{{ user.name }}</div>
                  <div class="truncate text-xs text-neutral-400">{{ user.email }}</div>
                </div>
              </div>
            </div>
          </div>

          <nav class="flex-1 overflow-y-auto px-3 py-3 cms-scrollbar">
            <div
              v-if="sidebarGroups.length === 0"
              class="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center text-sm text-neutral-400"
            >
              Belum ada menu yang bisa diakses.
            </div>

            <div v-else class="space-y-3">
              <section
                v-for="group in sidebarGroups"
                :key="group.title"
                class="rounded-3xl border border-white/8 bg-white/3 p-2"
              >
                <button
                  type="button"
                  class="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left"
                  @click="toggleGroup(groupKey(group))"
                >
                  <div class="flex items-center gap-2">
                    <span
                      class="inline-block h-2 w-2 rounded-full"
                      :class="isGroupActive(group) ? 'bg-green-400 shadow-[0_0_0_6px_rgba(96,165,250,0.14)]' : 'bg-neutral-600'"
                    />
                    <span class="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                      {{ group.title }}
                    </span>
                  </div>

                  <Icon
                    icon="lucide:chevron-down"
                    class="h-4 w-4 text-neutral-500 transition-transform"
                    :class="isCollapsed(groupKey(group)) ? '-rotate-90' : 'rotate-0'"
                  />
                </button>

                <div v-if="!isCollapsed(groupKey(group))" class="mt-1 space-y-1 px-1 pb-1">
                  <NuxtLink
                    v-for="item in group.items"
                    :key="item.href"
                    :to="item.href"
                    :class="menuClass(item)"
                    @click="handleNavClick(item.href, $event)"
                  >
                    <span class="flex min-w-0 items-center gap-3">
                      <span :class="menuIconClass(item)">
                        <Icon v-if="item.icon" :icon="item.icon" class="h-4 w-4" />
                      </span>
                      <span class="truncate text-sm font-medium">{{ item.label }}</span>
                    </span>

                    <Icon
                      v-if="isItemActive(route.path, item.href)"
                      icon="lucide:chevron-right"
                      class="h-4 w-4 shrink-0 text-green-300"
                    />
                  </NuxtLink>
                </div>
              </section>
            </div>
          </nav>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="pb-[108px] pl-3 pr-3 pt-[92px] transition-all duration-300 lg:pb-4 lg:pl-[308px] lg:pr-4">
        <div class="mx-auto max-w-[1920px]">
          <div class="h-[calc(100dvh-200px)] overflow-hidden rounded-[30px] border border-white/70 bg-white/92 shadow-[0_24px_50px_-18px_rgba(15,23,42,0.18)] backdrop-blur dark:border-white/10 dark:bg-neutral-900/92 dark:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)] lg:h-[calc(100vh-108px)]">
            <div class="flex h-full min-h-0">
              <div ref="mainScrollEl" class="min-w-0 flex-1 overflow-y-auto" @scroll.passive="handleMainScroll">
                <template v-if="!isProtectedRoute(route.path) || !aclReady || hasAccessTo(route.path)">
                  <div class="min-h-full">
                    <slot />
                  </div>
                </template>

                <template v-else>
                  <div class="grid min-h-[calc(100vh-108px)] place-items-center p-8">
                    <div class="max-w-md text-center">
                      <div class="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-[22px] bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-300">
                        <Icon icon="lucide:shield-alert" class="h-7 w-7" />
                      </div>

                      <h2 class="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                        Akses Ditolak
                      </h2>

                      <p class="mt-2 text-sm text-gray-500 dark:text-neutral-400">
                        Menu dan halaman hanya tampil sesuai hak akses user yang sedang login.
                      </p>

                      <NuxtLink
                        :to="firstAllowedPath || '/app'"
                        class="mt-5 inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                      >
                        <Icon icon="lucide:arrow-left" class="h-4 w-4" />
                        Kembali ke halaman yang diizinkan
                      </NuxtLink>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Right Notification Panel -->
      <aside
        :class="[
          'fixed bottom-4 right-3 top-[84px] z-[76] w-[340px] transition-transform duration-300 lg:right-4',
          rightOpen ? 'translate-x-0' : 'translate-x-[112%]'
        ]"
      >
        <div class="flex h-full flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/95 shadow-[0_24px_50px_-18px_rgba(15,23,42,0.18)] backdrop-blur dark:border-white/10 dark:bg-neutral-900/95 dark:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]">
          <div class="flex items-center justify-between border-b border-gray-200 px-4 py-4 dark:border-neutral-800">
            <div>
              <div class="text-sm font-bold text-gray-900 dark:text-white">Notifikasi</div>
              <div class="text-xs text-gray-500 dark:text-neutral-400">Ringkas dan fokus</div>
            </div>

            <button
              type="button"
              class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              @click="rightOpen = false"
            >
              <Icon icon="lucide:x" class="h-4 w-4" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto">
            <WidgetNotificationView />
          </div>
        </div>
      </aside>

      <!-- Mobile Bottom Navigation -->
      <nav class="fixed inset-x-3 bottom-3 z-[78] lg:hidden">
        <div class="rounded-[30px] border border-white/10 bg-neutral-950/95 p-2 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.65)] backdrop-blur-xl">
          <div class="grid grid-cols-5 gap-1">
            <button
              v-for="item in mobileBottomItems"
              :key="item.href"
              type="button"
              class="group flex min-w-0 flex-col items-center justify-center rounded-[22px] px-2 py-2.5 text-center transition"
              :class="isItemActive(route.path, item.href)
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
                : 'text-neutral-400 hover:bg-white/6 hover:text-white'"
              @click="handleMobileMenuItemClick(item.href)"
            >
              <Icon :icon="item.icon || 'lucide:circle'" class="h-5 w-5 shrink-0" />
              <span class="mt-1 max-w-full truncate text-[10px] font-black leading-none">
                {{ item.label }}
              </span>
            </button>

            <button
              type="button"
              class="group flex min-w-0 flex-col items-center justify-center rounded-[22px] px-2 py-2.5 text-center transition"
              :class="mobileMenuOpen
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
                : 'text-neutral-400 hover:bg-white/6 hover:text-white'"
              @click="openMobileMenu(false)"
            >
              <Icon icon="lucide:grid-3x3" class="h-5 w-5 shrink-0" />
              <span class="mt-1 text-[10px] font-black leading-none">Menu</span>
            </button>
          </div>
        </div>
      </nav>

      <!-- Mobile Bottom Sheet Menu -->
      <Teleport to="body">
        <div v-if="mobileMenuOpen" class="fixed inset-0 z-[120] lg:hidden">
          <div class="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm" @click="closeMobileMenu"></div>

          <section
            class="absolute inset-x-0 bottom-0 overflow-hidden rounded-t-[34px] border border-white/10 bg-neutral-950/95 shadow-[0_-28px_70px_-26px_rgba(0,0,0,0.75)] backdrop-blur-xl transition-all duration-300"
            :class="mobileSheetExpanded ? 'max-h-[88dvh]' : 'max-h-[56dvh]'"
            @touchstart.passive="handleMobileSheetTouchStart"
            @touchend.passive="handleMobileSheetTouchEnd"
          >
            <button
              type="button"
              class="flex w-full items-center justify-center px-4 pb-2 pt-3"
              @click="toggleMobileSheet"
              aria-label="Tarik menu"
            >
              <span class="h-1.5 w-14 rounded-full bg-neutral-700"></span>
            </button>

            <div class="border-b border-white/10 px-4 pb-4">
              <div class="flex items-center justify-between gap-3">
                <div class="flex min-w-0 items-center gap-3">
                  <img
                    :src="user.avatar"
                    alt="Avatar"
                    class="h-12 w-12 rounded-[20px] object-cover ring-2 ring-white/10"
                  />

                  <div class="min-w-0">
                    <h3 class="truncate text-base font-black text-white">
                      Menu Dashboard
                    </h3>
                    <p class="truncate text-xs text-neutral-400">
                      {{ user.name }} · {{ tokenUser?.role || 'guest' }}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-neutral-200 transition hover:bg-white/10 hover:text-white"
                  @click="closeMobileMenu"
                >
                  <Icon icon="lucide:x" class="h-4 w-4" />
                </button>
              </div>

              <div class="mt-4">
                <div class="relative">
                  <Icon icon="lucide:search" class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                  <input
                    v-model.trim="mobileMenuSearch"
                    type="search"
                    placeholder="Cari menu..."
                    class="h-12 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-neutral-500 focus:border-green-400/60 focus:bg-white/10 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)]"
                  />
                </div>
              </div>
            </div>

            <div class="max-h-[calc(88dvh-150px)] overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-4 cms-scrollbar">
              <div v-if="!mobileSheetExpanded && !mobileMenuSearch" class="space-y-4">
                <div>
                  <div class="mb-3 flex items-center justify-between">
                    <p class="text-xs font-black uppercase tracking-[0.18em] text-neutral-500">
                      Menu Cepat
                    </p>

                    <button
                      type="button"
                      class="text-xs font-bold text-green-400 hover:text-green-300"
                      @click="mobileSheetExpanded = true"
                    >
                      Lihat semua
                    </button>
                  </div>

                  <div class="grid grid-cols-4 gap-3">
                    <button
                      v-for="item in mobileQuickSheetItems"
                      :key="item.href"
                      type="button"
                      class="group rounded-[24px] border p-3 text-left transition"
                      :class="isItemActive(route.path, item.href)
                        ? 'border-green-400/30 bg-green-500/15 text-green-200 shadow-[0_18px_45px_-28px_rgba(34,197,94,0.65)]'
                        : 'border-white/8 bg-white/[0.035] text-neutral-300 hover:border-white/14 hover:bg-white/[0.07] hover:text-white'"
                      @click="handleMobileMenuItemClick(item.href)"
                    >
                      <span
                        class="grid h-11 w-11 place-items-center rounded-2xl"
                        :class="isItemActive(route.path, item.href)
                          ? 'bg-green-600 text-white'
                          : 'bg-white/[0.06] text-neutral-400 ring-1 ring-white/10'"
                      >
                        <Icon :icon="item.icon || 'lucide:circle'" class="h-5 w-5" />
                      </span>

                      <span class="mt-2 block truncate text-[11px] font-black">
                        {{ item.label }}
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
                        Tarik ke atas untuk semua menu
                      </p>
                      <p class="mt-1 text-xs leading-5 text-neutral-400">
                        Bisa juga klik garis kecil di atas seperti gaya iPhone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="space-y-4">
                <section
                  v-for="group in mobileFilteredGroups"
                  :key="`mobile-${group.title}`"
                  class="rounded-3xl border border-white/8 bg-white/[0.03] p-2"
                >
                  <div class="flex items-center gap-2 px-3 py-2">
                    <span
                      class="h-2 w-2 rounded-full"
                      :class="isGroupActive(group) ? 'bg-green-400 shadow-[0_0_0_6px_rgba(74,222,128,0.14)]' : 'bg-neutral-600'"
                    ></span>
                    <p class="text-[11px] font-black uppercase tracking-[0.18em] text-neutral-400">
                      {{ group.title }}
                    </p>
                  </div>

                  <div class="grid gap-1">
                    <button
                      v-for="item in group.items"
                      :key="`mobile-${item.href}`"
                      type="button"
                      class="flex items-center justify-between rounded-[22px] px-3 py-3 text-left transition focus:outline-none"
                      :class="mobileMenuItemClass(item)"
                      @click="handleMobileMenuItemClick(item.href)"
                    >
                      <span class="flex min-w-0 items-center gap-3">
                        <span
                          class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl transition"
                          :class="isItemActive(route.path, item.href)
                            ? 'bg-green-500/18 text-green-200'
                            : 'bg-white/[0.04] text-neutral-400'"
                        >
                          <Icon :icon="item.icon || 'lucide:circle'" class="h-5 w-5" />
                        </span>

                        <span class="min-w-0">
                          <span class="block truncate text-sm font-medium">
                            {{ item.label }}
                          </span>
                          <span class="block truncate text-[11px] text-neutral-500">
                            {{ item.href }}
                          </span>
                        </span>
                      </span>

                      <Icon
                        v-if="isItemActive(route.path, item.href)"
                        icon="lucide:chevron-right"
                        class="h-4 w-4 shrink-0 text-green-300"
                      />
                    </button>
                  </div>
                </section>

                <div
                  v-if="!mobileFilteredGroups.length"
                  class="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-4 py-10 text-center"
                >
                  <Icon icon="lucide:search-x" class="mx-auto h-9 w-9 text-neutral-500" />
                  <p class="mt-3 text-sm font-bold text-neutral-200">
                    Menu tidak ditemukan
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
      <!-- Footer Logo Desktop Only -->
      <div
        class="fixed bottom-5 left-1/2 z-[79] hidden scale-75 -translate-x-1/2 transition-all duration-500 ease-out lg:block"
        :class="footerLogoVisible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-8 opacity-0'"
      >
        <div class="relative">
          <div class="pointer-events-none absolute inset-x-3 bottom-0 -z-10 h-16 overflow-hidden rounded-full blur-md">
            <div class="absolute bottom-0 left-1/2 h-12 w-24 -translate-x-1/2 animate-pulse rounded-full bg-linear-to-t from-orange-600 via-amber-400 to-transparent opacity-70"></div>
            <div class="absolute bottom-1 left-[28%] h-10 w-8 animate-bounce rounded-full bg-linear-to-t from-red-600 via-orange-400 to-transparent opacity-70 blur-sm"></div>
            <div class="absolute bottom-0 left-[45%] h-14 w-10 animate-pulse rounded-full bg-linear-to-t from-orange-600 via-yellow-300 to-transparent opacity-80 blur-sm"></div>
            <div class="absolute bottom-1 right-[26%] h-11 w-8 animate-bounce rounded-full bg-linear-to-t from-red-500 via-amber-400 to-transparent opacity-70 blur-sm [animation-delay:180ms]"></div>
            <div class="absolute bottom-0 left-1/2 h-8 w-32 -translate-x-1/2 rounded-full bg-orange-500/40 blur-xl"></div>
          </div>

          <div class="pointer-events-none absolute inset-x-0 -top-5 -z-10 mx-auto h-10 w-36">
            <span class="absolute left-4 top-5 h-1.5 w-1.5 animate-ping rounded-full bg-orange-400 opacity-70"></span>
            <span class="absolute left-16 top-2 h-1 w-1 animate-ping rounded-full bg-yellow-300 opacity-80 [animation-delay:250ms]"></span>
            <span class="absolute right-8 top-6 h-1.5 w-1.5 animate-ping rounded-full bg-red-400 opacity-60 [animation-delay:420ms]"></span>
            <span class="absolute right-16 top-1 h-1 w-1 animate-ping rounded-full bg-amber-300 opacity-70 [animation-delay:650ms]"></span>
          </div>

          <NuxtLink
            to="https://obayan.id"
            aria-label="Obayan"
            class="group relative flex items-center gap-3 overflow-hidden rounded-full border border-white/80 bg-white/90 px-4 py-2.5 shadow-[0_20px_45px_-18px_rgba(15,23,42,0.35)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white dark:border-white/10 dark:bg-neutral-900/90 dark:hover:bg-neutral-900"
          >
            <div class="pointer-events-none absolute inset-0 bg-linear-to-r from-orange-500/10 via-yellow-300/10 to-red-500/10 opacity-0 transition duration-300 group-hover:opacity-100"></div>

            <span class="relative grid h-10 w-10 place-items-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-orange-200/60 dark:bg-neutral-950 dark:ring-orange-500/20">
              <span class="pointer-events-none absolute inset-x-1 bottom-0 h-4 animate-pulse rounded-full bg-linear-to-t from-orange-500/40 to-transparent blur-sm"></span>
              <img src="/logo.png" alt="Obayan" class="relative h-8 w-8 object-contain transition duration-300 group-hover:scale-110" />
            </span>

            <span class="relative hidden pr-1 text-left sm:block">
              <span class="block text-xs font-black leading-none text-slate-900 dark:text-white">
                Powered by Obayan
              </span>
              <span class="mt-1 block text-[10px] font-bold leading-none text-slate-400 dark:text-neutral-500">
                Smart Education System
              </span>
            </span>
          </NuxtLink>
        </div>
      </div>

      <!-- Logout Modal -->
      <Teleport to="body">
        <div v-if="logoutOpen" class="fixed inset-0 z-[100]">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="logoutOpen = false" />

          <div class="relative mx-auto mt-24 w-[92%] max-w-md">
            <div class="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
              <div class="p-6">
                <div class="flex items-start gap-4">
                  <div class="shrink-0 rounded-2xl bg-rose-100 p-3 dark:bg-rose-900/20">
                    <Icon icon="lucide:log-out" class="h-6 w-6 text-rose-600 dark:text-rose-400" />
                  </div>

                  <div>
                    <h3 class="text-base font-bold text-gray-900 dark:text-white">
                      Konfirmasi Keluar
                    </h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                      Anda akan keluar dari dashboard. Pastikan tidak ada perubahan yang belum disimpan.
                    </p>
                  </div>
                </div>

                <div class="mt-6 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    @click="logoutOpen = false"
                  >
                    Batal
                  </button>

                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
                    @click="doLogout"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { get, off, onValue, ref as dbRef } from 'firebase/database'
import { useRoute, useRouter } from 'vue-router'
import { useRuntimeConfig, useNuxtApp, useHead, useState, useSeoMeta } from 'nuxt/app'

type Item = {
  label: string
  href: string
  icon?: string
}

type SidebarGroup = {
  title: string
  key?: string
  items: Item[]
}

type PlainSession = {
  sub?: string
  uid?: string
  role?: string
  name?: string
  email?: string
  phone?: string
  waliPhone?: string
  waliName?: string
  santriId?: string
  santriName?: string
  allowedRoutes?: string[]
  iat?: number
  exp?: number
}

type AccountItem = {
  label: 'Profile' | 'Settings' | 'Logout'
  icon: string
  href: string
}

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { $realtimeDb, $auth } = useNuxtApp() as any

const clientName = String(config.public.clientName || 'alinayah')

const siteUrl = String(config.public.siteUrl || 'https://alinayah.sencra.io')
const siteName = String(config.public.siteName || 'Pondok Pesantren Al-Inayah')
const siteDescription = String(config.public.siteDescription || '')
const twitterSite = String(config.public.twitterSite || '@alinayah')

const appName = String(config.public.appName || 'SINAYAH')
const clientDisplayName = String(config.public.clientDisplayName || 'Al-Inayah')
const appSubtitle = String(config.public.appSubtitle || 'SIAKAD Ponpes. AL-INAYAH')
const appLogo = String(config.public.appLogo || '/assets/logo.png')
const appThemeColor = String(config.public.appThemeColor || '#0ea5e9')

const firebaseRoot = clientName
const userPath = `${firebaseRoot}/users`

const AUTH_KEY = `${clientName}:auth`
const PASSPHRASE = `${clientName}-admin-secret`
const SALT = `${clientName}-static-salt`
const STORAGE_KEY = `${clientName}:sidebar:collapsed`

const titleSidebar = ref(appName)
const subtitileSidebar = ref(appSubtitle)

const rightOpen = ref(false)
const accountOpen = ref(false)
const logoutOpen = ref(false)
const mainScrollEl = ref<HTMLElement | null>(null)
const footerLogoVisible = ref(true)
const lastMainScrollTop = ref(0)

const mobileMenuOpen = ref(false)
const mobileSheetExpanded = ref(false)
const mobileMenuSearch = ref('')
const mobileTouchStartY = ref(0)

let footerScrollTimer: ReturnType<typeof setTimeout> | null = null
let searchDebounce: ReturnType<typeof setTimeout> | null = null

const authLoading = useState<boolean>('authLoading', () => true)
const sessionUser = useState<any>('sessionUser', () => ({}))
const tokenUser = ref<{ uid: string; email: string; role: string; name: string; allowedRoutes: string[] } | null>(null)
const aclReady = ref(false)

const ITER = 120_000

let aclRef: ReturnType<typeof dbRef> | null = null
let profileRef: ReturnType<typeof dbRef> | null = null

const url = computed(() => new URL(route.fullPath || '/', siteUrl).toString())

useSeoMeta({
  title: siteName,
  description: siteDescription,
  ogTitle: siteName,
  ogDescription: siteDescription,
  ogType: 'website',
  ogUrl: url.value,
  ogImage: appLogo,
  twitterCard: 'summary_large_image',
  twitterSite,
  themeColor: appThemeColor,
  robots: 'index, follow'
})

useHead({
  link: [{ rel: 'canonical', href: url.value }]
})

const ADMIN_SIDEBAR: SidebarGroup[] = [
  {
    title: 'Beranda',
    items: [
      { label: 'Dashboard', href: '/app', icon: 'lucide:layout-dashboard' },
      { label: 'Berita Informasi', href: '/app/news', icon: 'hugeicons:news' },
      { label: 'Pengumuman', href: '/app/announcement', icon: 'lucide:info' },
      { label: 'Agenda', href: '/app/agenda', icon: 'solar:calendar-line-duotone' }
    ]
  },
  {
    title: 'Form',
    items: [
      { label: 'Registrasi Putra', href: '/app/registration', icon: 'fluent:form-24-regular' },
      { label: 'Registrasi Putri', href: '/app/registration-girl', icon: 'fluent:form-24-regular' }
    ]
  },
  {
    title: 'Kesantrian',
    items: [
      { label: 'Santri', href: '/app/santri', icon: 'lucide:users' },
      { label: 'Maskan Kamar', href: '/app/maskan', icon: 'lucide:bed' },
      { label: 'Kelas', href: '/app/class', icon: 'streamline:class-lesson' },
      { label: 'Wali Santri', href: '/app/wali', icon: 'lucide:user-round' }
    ]
  },
  {
    title: 'Rutinitas',
    items: [
      { label: 'Galeri', href: '/app/gallery', icon: 'streamline-flex:gallery' },
      { label: 'Absensi Harian', href: '/app/absen', icon: 'hugeicons:note-03' },
      { label: 'Kunjungan', href: '/app/kunjungan', icon: 'material-symbols:parent-child-dining-outline-rounded' },
      { label: 'Jadwal Piket', href: '/app/picket', icon: 'lucide:calendar-days' },
      { label: 'Registrasi RFID', href: '/app/setting-rfid', icon: 'ri:rfid-fill' }
    ]
  },
  {
    title: 'Keamanan',
    items: [
      { label: 'Pelanggaran', href: '/app/faults', icon: 'mingcute:fault-line' },
      { label: 'Perizinan', href: '/app/izin', icon: 'solar:letter-linear' }
    ]
  },
  {
    title: 'Akademik',
    items: [
      { label: 'Buku / Kitab', href: '/app/book', icon: 'ion:book-outline' },
      { label: 'Nilai', href: '/app/nilai', icon: 'solar:chart-linear' },
      { label: 'Hafalan', href: '/app/hafalan', icon: 'ooui:italic-arab-keheh-jeem' },
      { label: 'Guru', href: '/app/teacher', icon: 'tabler:chalkboard-teacher' }
    ]
  },
  {
    title: 'Ketertiban',
    items: [
      { label: 'Buku Sabar', href: '/app/patience', icon: 'dinkie-icons:translate-arabic-latin' }
    ]
  },
  {
    title: 'Keuangan',
    items: [
      { label: 'Pembayaran', href: '/app/payment', icon: 'akar-icons:money' },
      { label: 'Laporan Keuangan', href: '/app/report-money', icon: 'streamline-plump:file-report' }
    ]
  },
  {
    title: 'Pengaturan',
    items: [
      { label: 'Profil', href: '/app/profile', icon: 'iconamoon:profile' },
      { label: 'Kontak', href: '/app/contact', icon: 'hugeicons:contact-01' },
      { label: 'Navbar', href: '/app/navbar', icon: 'tabler:menu-3' },
      { label: 'Hak Akses', href: '/app/user', icon: 'solar:key-broken' },
      { label: 'Website', href: '/app/web', icon: 'icon-park-outline:web-page' }
    ]
  }
]

const DEFAULT_WALI_ROUTES = ['/wali', '/wali/santri', '/wali/pembayaran', '/wali/pengumuman']

const WALI_SIDEBAR: SidebarGroup[] = [
  {
    title: 'Wali',
    items: [
      { label: 'Beranda', href: '/wali', icon: 'lucide:house' },
      { label: 'Santri', href: '/wali/santri', icon: 'lucide:user-round' },
      { label: 'Pembayaran', href: '/wali/pembayaran', icon: 'akar-icons:money' },
      { label: 'Pengumuman', href: '/wali/pengumuman', icon: 'lucide:megaphone' },
      { label: 'Akademik', href: '/wali/akademik', icon: 'solar:chart-linear' },
      { label: 'Perizinan', href: '/wali/perizinan', icon: 'solar:letter-linear' },
      { label: 'Kunjungan', href: '/wali/kunjungan', icon: 'material-symbols:parent-child-dining-outline-rounded' }
    ]
  }
]

const collapsedGroups = useState<Record<string, boolean>>('sidebarCollapsed', () => ({}))

function handleMainScroll(event?: Event) {
  const target = (event?.target as HTMLElement | null) || mainScrollEl.value
  if (!target) return

  const currentTop = target.scrollTop
  const diff = currentTop - lastMainScrollTop.value

  if (currentTop <= 8) {
    footerLogoVisible.value = true
    lastMainScrollTop.value = currentTop
    return
  }

  if (Math.abs(diff) < 6) return

  footerLogoVisible.value = diff < 0
  lastMainScrollTop.value = currentTop

  if (footerScrollTimer) clearTimeout(footerScrollTimer)

  footerScrollTimer = setTimeout(() => {
    if (mainScrollEl.value && mainScrollEl.value.scrollTop <= 8) {
      footerLogoVisible.value = true
    }
  }, 160)
}

function roleHome(role?: string) {
  return role === 'wali' ? '/wali' : '/app'
}

function normalize(path: string) {
  try {
    const u = new URL(path, 'http://x')
    return u.pathname.replace(/\/+$/, '') || '/'
  } catch {
    return (path || '').replace(/\/+$/, '') || '/'
  }
}

function isProtectedRoute(path: string) {
  return path.startsWith('/app') || path.startsWith('/wali')
}

function isAllowed(path: string, allowed: string[]) {
  const a = normalize(path)
  const list = (allowed || []).map(normalize)

  return list.some((r) => {
    if (r === '/app' || r === '/wali') return a === r
    return a === r || (r !== '/' && a.startsWith(r + '/'))
  })
}

function coerceRoutes(v: any): string[] {
  if (Array.isArray(v)) return v.map(String)
  if (v && typeof v === 'object') return Object.values(v).filter((x) => typeof x === 'string').map(String)
  return []
}

function uniq(arr: string[]) {
  return Array.from(new Set(arr.map(normalize)))
}

function groupKey(g: SidebarGroup) {
  return g.key ?? g.title.toLowerCase().trim().replace(/[^\w]+/g, '-')
}

function isCollapsed(key: string) {
  return collapsedGroups.value[key] ?? false
}

function persistCollapsed() {
  if (!process.client) return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsedGroups.value))
  } catch {}
}

function toggleGroup(key: string) {
  collapsedGroups.value[key] = !isCollapsed(key)
  persistCollapsed()
}

function getSidebarForRole(role?: string, currentPath?: string) {
  if (role === 'wali') return WALI_SIDEBAR

  if (role === 'admin' || role === 'superadmin' || role === 'operator' || role === 'staff' || role === 'pengurus') {
    return ADMIN_SIDEBAR
  }

  return currentPath?.startsWith('/wali') ? WALI_SIDEBAR : ADMIN_SIDEBAR
}

const effectiveAllowedRoutes = computed<string[]>(() => {
  const role = tokenUser.value?.role
  const raw = tokenUser.value?.allowedRoutes
  const routes = Array.isArray(raw) ? uniq(raw.map(String)) : []

  if (routes.length) return routes

  if (role === 'wali') return DEFAULT_WALI_ROUTES
  if (['admin', 'superadmin', 'operator', 'staff', 'pengurus'].includes(role || '')) return ['/app']

  return []
})

const rawSidebar = computed<SidebarGroup[]>(() => getSidebarForRole(tokenUser.value?.role, route.path))

const sidebarGroups = computed<SidebarGroup[]>(() => {
  const routes = effectiveAllowedRoutes.value

  return rawSidebar.value
    .map((g) => ({
      ...g,
      items: g.items.filter((it) => isAllowed(it.href, routes))
    }))
    .filter((g) => g.items.length > 0)
})

const allMenuPaths = computed(() => rawSidebar.value.flatMap((g) => g.items.map((i) => i.href)))

const flatSidebarItems = computed<Item[]>(() => {
  return sidebarGroups.value.flatMap((group) => group.items)
})

const firstAllowedPath = computed<string | null>(() => {
  const role = tokenUser.value?.role
  const allowed = effectiveAllowedRoutes.value

  if (role === 'wali') return '/wali'
  if (!allowed.length) return null
  if (allowed.some((a) => normalize(a) === '/app')) return '/app'

  for (const p of allMenuPaths.value) {
    if (isAllowed(p, allowed)) return p
  }

  return null
})

function hasAccessTo(path: string) {
  return isAllowed(path, effectiveAllowedRoutes.value)
}

function isItemActive(currentPath: string, href: string) {
  const a = normalize(currentPath)
  const b = normalize(href)

  if (b === '/app' || b === '/wali') return a === b

  return a === b || a.startsWith(b + '/')
}

function isGroupActive(g: SidebarGroup) {
  return g.items?.some((i) => isItemActive(route.path, i.href)) ?? false
}

function menuClass(item: Item) {
  const active = isItemActive(route.path, item.href)

  return [
    'flex items-center justify-between rounded-[22px] px-3 py-3 text-sm transition focus:outline-none',
    active
      ? 'bg-green-600/18 text-white ring-1 ring-green-500/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
      : 'text-neutral-300 hover:bg-white/6 hover:text-white'
  ].join(' ')
}

function menuIconClass(item: Item) {
  const active = isItemActive(route.path, item.href)

  return [
    'inline-flex h-9 w-9 items-center justify-center rounded-2xl transition',
    active ? 'bg-green-500/18 text-green-200' : 'bg-white/[0.04] text-neutral-400'
  ].join(' ')
}

function uniqueItems(items: Item[]) {
  const seen = new Set<string>()

  return items.filter((item) => {
    const key = normalize(item.href)

    if (seen.has(key)) return false

    seen.add(key)
    return true
  })
}

const mobileBottomItems = computed<Item[]>(() => {
  const role = tokenUser.value?.role
  const homeHref = role === 'wali' ? '/wali' : '/app'
  const items = flatSidebarItems.value
  const active = items.find((item) => isItemActive(route.path, item.href))

  const preferred = [
    items.find((item) => normalize(item.href) === normalize(homeHref)),
    active,
    items.find((item) => item.href.includes('/news') || item.href.includes('/pengumuman') || item.href.includes('/announcement')),
    items.find((item) => item.href.includes('/santri') || item.href.includes('/wali/santri')),
    items.find((item) => item.href.includes('/payment') || item.href.includes('/pembayaran'))
  ].filter(Boolean) as Item[]

  return uniqueItems([...preferred, ...items]).slice(0, 4)
})

const mobileQuickSheetItems = computed<Item[]>(() => {
  return uniqueItems(flatSidebarItems.value).slice(0, 8)
})

const mobileFilteredGroups = computed<SidebarGroup[]>(() => {
  const q = mobileMenuSearch.value.trim().toLowerCase()

  if (!q) return sidebarGroups.value

  return sidebarGroups.value
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        return (
          item.label.toLowerCase().includes(q) ||
          item.href.toLowerCase().includes(q) ||
          group.title.toLowerCase().includes(q)
        )
      })
    }))
    .filter((group) => group.items.length > 0)
})

function openMobileMenu(expanded = false) {
  mobileMenuOpen.value = true
  mobileSheetExpanded.value = expanded
  accountOpen.value = false
  rightOpen.value = false
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
  mobileSheetExpanded.value = false
  mobileMenuSearch.value = ''
}

function toggleMobileSheet() {
  mobileSheetExpanded.value = !mobileSheetExpanded.value
}

function handleMobileSheetTouchStart(event: TouchEvent) {
  mobileTouchStartY.value = event.touches?.[0]?.clientY || 0
}

function handleMobileSheetTouchEnd(event: TouchEvent) {
  const endY = event.changedTouches?.[0]?.clientY || 0
  const delta = endY - mobileTouchStartY.value

  if (delta < -32) {
    mobileSheetExpanded.value = true
    return
  }

  if (delta > 70) {
    if (mobileSheetExpanded.value) {
      mobileSheetExpanded.value = false
    } else {
      closeMobileMenu()
    }
  }
}

function mobileMenuItemClass(item: Item) {
  const active = isItemActive(route.path, item.href)

  return active
    ? 'bg-green-600/18 text-white ring-1 ring-green-500/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
    : 'text-neutral-300 hover:bg-white/6 hover:text-white'
}

function handleMobileMenuItemClick(to: string) {
  if (!to || normalize(to) === normalize(route.path)) {
    closeMobileMenu()
    return
  }

  if (!hasAccessTo(to)) {
    enforceRouteAccess(route.path)
    return
  }

  closeMobileMenu()
  accountOpen.value = false
  rightOpen.value = false
  router.push(to)
}

const accountMenu = computed<AccountItem[]>(() => {
  const base = tokenUser.value?.role === 'wali' || route.path.startsWith('/wali') ? '/wali' : '/app'

  return [
    { label: 'Profile', icon: 'lucide:user', href: `${base}/profile` },
    // { label: 'Settings', icon: 'lucide:settings-2', href: `${base}/setting` },
    { label: 'Logout', icon: 'lucide:log-out', href: '#' }
  ]
})

const user = computed(() => ({
  name: sessionUser.value?.name || tokenUser.value?.name || 'Pengguna',
  email: sessionUser.value?.email || tokenUser.value?.email || '-',
  avatar: sessionUser.value?.avatar || '/assets/pp.jpg'
}))

function looksLikeEmail(v?: string) {
  return !!(v && v.includes('@') && !/^\s*-\s*$/.test(v))
}

function primaryContactFromSession(sess?: PlainSession | null) {
  if (!sess) return '-'
  if (looksLikeEmail(sess.email)) return String(sess.email)

  return (sess.phone || sess.waliPhone || '-').toString()
}

async function deriveKey(pass: string, salt: string) {
  const enc = new TextEncoder()

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(pass),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: ITER,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

function fromB64(b64: string) {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)).buffer
}

function isLikelyEncryptedToken(raw: string) {
  try {
    const o = JSON.parse(raw)
    return !!(o && typeof o === 'object' && o.iv && o.ct)
  } catch {
    return false
  }
}

async function decryptJSON(serialized: string) {
  const obj = JSON.parse(serialized)
  const key = await deriveKey(PASSPHRASE, SALT)
  const iv = new Uint8Array(fromB64(obj.iv))
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, fromB64(obj.ct))

  return JSON.parse(new TextDecoder().decode(plain))
}

async function readAuthToken(): Promise<PlainSession | null> {
  const raw = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY)

  if (!raw) return null

  try {
    if (isLikelyEncryptedToken(raw)) {
      return (await decryptJSON(raw)) as PlainSession
    }

    return JSON.parse(raw) as PlainSession
  } catch {
    return null
  }
}

function applyProfile(uid: string, v: any) {
  const nextName = v?.displayName || v?.name || sessionUser.value?.name || tokenUser.value?.name || 'Pengguna'
  const nextEmail = v?.email || sessionUser.value?.email || tokenUser.value?.email || '-'
  const nextAvatar = v?.avatar || sessionUser.value?.avatar || '/assets/pp.jpg'

  sessionUser.value = {
    ...(sessionUser.value || {}),
    uid,
    name: nextName,
    email: nextEmail,
    avatar: nextAvatar
  }

  if (tokenUser.value) {
    tokenUser.value = {
      ...tokenUser.value,
      name: nextName,
      email: nextEmail
    }
  }
}

async function startProfileWatcher(uid?: string | null) {
  if (!uid) return

  try {
    if (profileRef) off(profileRef)
  } catch {}

  profileRef = dbRef($realtimeDb, `${userPath}/${uid}`)

  try {
    const snap = await get(profileRef)
    if (snap.exists()) applyProfile(uid, snap.val())
  } catch {}

  onValue(profileRef, (snap) => applyProfile(uid, snap.val()))
}

function applyAllowedRoutes(uid: string, routesRaw: any) {
  const coerced = uniq(coerceRoutes(routesRaw))

  const prev = tokenUser.value || {
    uid,
    email: $auth?.currentUser?.email || '-',
    name: $auth?.currentUser?.displayName || 'Pengguna',
    role: 'wali',
    allowedRoutes: []
  }

  const fallbackDefault =
    prev.role === 'wali'
      ? DEFAULT_WALI_ROUTES
      : (['admin', 'superadmin', 'operator', 'staff', 'pengurus'].includes(prev.role) ? ['/app'] : [])

  const nextAllowed = coerced.length ? coerced : fallbackDefault

  tokenUser.value = {
    ...prev,
    uid,
    allowedRoutes: nextAllowed
  }

  aclReady.value = true
  enforceRouteAccess(route.path)
}

async function startAclWatcher(uidHint?: string | null) {
  let uid = uidHint || $auth?.currentUser?.uid || null

  if (!uid) {
    await new Promise<void>((resolve) => {
      const unsub = onAuthStateChanged(
        $auth,
        (u) => {
          uid = u?.uid || null
          unsub()
          resolve()
        },
        () => resolve()
      )
    })
  }

  if (!uid) {
    aclReady.value = true
    return
  }

  aclRef = dbRef($realtimeDb, `${userPath}/${uid}/allowedRoutes`)
  const r = aclRef

  try {
    const snap = await get(r)
    if (snap.exists()) applyAllowedRoutes(uid, snap.val())
    else applyAllowedRoutes(uid, [])
  } catch {
    applyAllowedRoutes(uid, [])
  }

  onValue(r, (snap) => applyAllowedRoutes(uid!, snap.val()))
}

function enforceRouteAccess(path: string) {
  if (!isProtectedRoute(path)) return
  if (!aclReady.value) return

  if (!tokenUser.value) {
    if (normalize(path) !== '/cakAdmin') router.replace('/cakAdmin')
    return
  }

  if (hasAccessTo(path)) return

  const fallback = firstAllowedPath.value || roleHome(tokenUser.value.role)

  if (normalize(path) !== normalize(fallback)) {
    router.replace(fallback)
  }
}

function handleNavClick(to: string, e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()

  if (!to || to === route.path) return

  if (!hasAccessTo(to)) {
    enforceRouteAccess(route.path)
    return
  }

  closeMobileMenu()
  accountOpen.value = false
  router.push(to)
}

function openLogoutModal() {
  accountOpen.value = false
  logoutOpen.value = true
}

async function doLogout() {
  try {
    if (aclRef) off(aclRef)
  } catch {}

  try {
    if (profileRef) off(profileRef)
  } catch {}

  try {
    await signOut($auth)
  } catch {}

  localStorage.removeItem(AUTH_KEY)
  sessionStorage.removeItem(AUTH_KEY)
  tokenUser.value = null
  sessionUser.value = {} as any
  logoutOpen.value = false
  router.replace('/cakAdmin')
}

function handleWindowClick(e: MouseEvent) {
  const target = e.target as HTMLElement | null

  if (!target) return

  if (!target.closest('[aria-label="Account menu"]') && !target.closest('.account-popover')) {
    accountOpen.value = false
  }
}

function handleWindowKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return

  closeMobileMenu()
  rightOpen.value = false
  accountOpen.value = false
  logoutOpen.value = false
}

onMounted(async () => {
  nextTick(() => {
    lastMainScrollTop.value = mainScrollEl.value?.scrollTop || 0
    footerLogoVisible.value = true
  })

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) collapsedGroups.value = JSON.parse(saved)
  } catch {}

  try {
    const sess = await readAuthToken()
    if (!sess) throw new Error('no token')

    const now = Math.floor(Date.now() / 1000)
    if (!sess.exp || now >= sess.exp) throw new Error('expired')

    const uid = sess.uid || sess.sub || 'wali'
    const role = sess.role || (route.path.startsWith('/wali') ? 'wali' : 'admin')
    const name = sess.name || sess.waliName || sess.santriName || 'Wali'
    const contact = primaryContactFromSession(sess)

    tokenUser.value = {
      uid,
      email: contact,
      role,
      name,
      allowedRoutes: Array.isArray(sess.allowedRoutes) ? sess.allowedRoutes : []
    }

    await nextTick()

    if (uid) {
      await startAclWatcher(uid)
      await startProfileWatcher(uid)
    } else {
      applyAllowedRoutes(uid, tokenUser.value?.allowedRoutes || [])
    }

    const landing = firstAllowedPath.value || roleHome(role)

    if (['/', '/login', '/cakAdmin'].includes(normalize(route.path)) && normalize(route.path) !== normalize(landing)) {
      router.replace(landing)
    } else {
      enforceRouteAccess(route.path)
    }
  } catch {
    localStorage.removeItem(AUTH_KEY)
    sessionStorage.removeItem(AUTH_KEY)
    aclReady.value = true
  } finally {
    authLoading.value = false
  }

  window.addEventListener('click', handleWindowClick)
  window.addEventListener('keydown', handleWindowKeydown)
})

watch(() => route.fullPath, () => {
  rightOpen.value = false
  accountOpen.value = false
  closeMobileMenu()
  enforceRouteAccess(route.path)
})

watch(mobileMenuSearch, () => {
  if (searchDebounce) clearTimeout(searchDebounce)

  searchDebounce = setTimeout(() => {
    if (mobileMenuSearch.value.trim()) {
      mobileSheetExpanded.value = true
    }
  }, 120)
})

watch(collapsedGroups, persistCollapsed, { deep: true })

onUnmounted(() => {
  if (footerScrollTimer) {
    clearTimeout(footerScrollTimer)
  }

  if (searchDebounce) {
    clearTimeout(searchDebounce)
  }

  try {
    if (aclRef) off(aclRef)
  } catch {}

  try {
    if (profileRef) off(profileRef)
  } catch {}

  window.removeEventListener('click', handleWindowClick)
  window.removeEventListener('keydown', handleWindowKeydown)
})
</script>

<style scoped>
.cms-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgb(64 64 64) transparent;
}

.cms-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.cms-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.cms-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgb(64 64 64);
}

.cms-mobile-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgb(203 213 225) transparent;
}

.cms-mobile-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.cms-mobile-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.cms-mobile-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgb(203 213 225);
}
</style>