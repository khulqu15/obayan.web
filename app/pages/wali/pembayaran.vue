<template>
  <section class="space-y-6 p-4 md:p-6">
    <!-- Hero -->
    <div class="relative overflow-hidden rounded-[32px] border border-green-100 bg-gradient-to-br from-green-600 via-green-600 to-lime-500 p-5 text-white shadow-[0_24px_70px_-28px_rgba(22,163,74,0.55)] dark:border-neutral-800 md:p-7">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-white blur-3xl"></div>
        <div class="absolute -bottom-14 left-8 h-40 w-40 rounded-full bg-lime-200 blur-3xl"></div>
      </div>

      <div class="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div class="min-w-0">
          <div class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold ring-1 ring-white/20 backdrop-blur">
            <span class="h-2 w-2 rounded-full bg-lime-300"></span>
            Pembayaran Wali
          </div>

          <h1 class="mt-4 text-2xl font-black tracking-tight md:text-4xl">
            Pembayaran Santri
          </h1>

          <p class="mt-2 max-w-xl text-sm leading-6 text-green-50/90 md:text-base">
            Pantau SPP, biaya kegiatan, daftar ulang, dan pembayaran lain secara realtime.
          </p>
        </div>

        <div class="min-w-0 rounded-[28px] bg-white/13 p-4 ring-1 ring-white/15 backdrop-blur lg:w-[380px]">
          <label class="text-xs font-bold text-green-50/80">Santri Terhubung</label>

          <select
            v-model="selectedSantriId"
            class="mt-2 h-12 w-full rounded-2xl border border-white/20 bg-white/15 px-4 text-sm font-bold text-white outline-none backdrop-blur focus:border-white/60"
          >
            <option
              v-for="s in santriProfiles"
              :key="s.id"
              :value="s.id"
              class="text-slate-900"
            >
              {{ santriNameOf(s) }}
            </option>
          </select>

          <div class="mt-3 grid grid-cols-3 gap-2">
            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ formatShortMoney(unpaidTotal) }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Tagihan</div>
            </div>

            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ paymentRows.length }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Data</div>
            </div>

            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ paidRate }}%</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Lunas</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div
      v-if="!loading && santriProfiles.length === 0"
      class="rounded-[32px] border border-dashed border-slate-300 bg-white p-10 text-center dark:border-neutral-700 dark:bg-neutral-900"
    >
      <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300">
        <Icon icon="ph:user-circle-duotone" class="h-9 w-9" />
      </div>

      <h2 class="mt-4 text-lg font-black text-slate-900 dark:text-white">
        Data santri belum terhubung
      </h2>

      <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-neutral-400">
        Akun wali ini belum memiliki santri yang terhubung. Silakan hubungi admin.
      </p>
    </div>

    <template v-else>
      <!-- Summary -->
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                Belum Lunas
              </div>
              <div class="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {{ formatMoney(unpaidTotal) }}
              </div>
              <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                Total tagihan aktif yang belum selesai.
              </p>
            </div>

            <div class="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
              <Icon icon="akar-icons:money" class="h-6 w-6" />
            </div>
          </div>
        </div>

        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                Lunas
              </div>
              <div class="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {{ formatMoney(paidTotal) }}
              </div>
              <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                Total pembayaran yang sudah lunas.
              </p>
            </div>

            <div class="grid h-12 w-12 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
              <Icon icon="ph:check-circle-duotone" class="h-6 w-6" />
            </div>
          </div>
        </div>

        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                Menunggu
              </div>
              <div class="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {{ pendingRows.length }}
              </div>
              <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                Pembayaran menunggu verifikasi admin.
              </p>
            </div>

            <div class="grid h-12 w-12 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
              <Icon icon="ph:clock-duotone" class="h-6 w-6" />
            </div>
          </div>
        </div>

        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                Jatuh Tempo
              </div>
              <div class="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {{ overdueRows.length }}
              </div>
              <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                Tagihan melewati batas pembayaran.
              </p>
            </div>

            <div class="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">
              <Icon icon="ph:warning-circle-duotone" class="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <!-- AI Insight -->
      <div class="grid gap-4 xl:grid-cols-[1fr,0.85fr]">
        <div class="relative overflow-hidden rounded-[32px] border border-green-100 bg-gradient-to-br from-slate-950 via-green-950 to-green-900 p-5 text-white shadow-sm dark:border-neutral-800">
          <div class="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-green-300/20 blur-3xl"></div>

          <div class="relative z-10">
            <div class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black ring-1 ring-white/15">
              <Icon icon="ph:sparkle-duotone" class="h-4 w-4" />
              Smart Payment Insight
            </div>

            <h2 class="mt-4 text-xl font-black">
              {{ paymentInsight.title }}
            </h2>

            <p class="mt-2 text-sm leading-6 text-white/75">
              {{ paymentInsight.desc }}
            </p>

            <div class="mt-5 grid gap-3 sm:grid-cols-3">
              <div class="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                <div class="text-lg font-black">{{ paymentHealthScore }}/100</div>
                <div class="mt-0.5 text-[11px] font-bold text-white/65">Health Score</div>
              </div>

              <div class="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                <div class="text-lg font-black">{{ nextDueLabel }}</div>
                <div class="mt-0.5 text-[11px] font-bold text-white/65">Tagihan Terdekat</div>
              </div>

              <div class="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                <div class="text-lg font-black">{{ paymentRows.length }}</div>
                <div class="mt-0.5 text-[11px] font-bold text-white/65">Total Invoice</div>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 class="text-base font-black text-slate-900 dark:text-white">
                Rekomendasi Sistem
              </h2>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                Prioritas pembayaran otomatis.
              </p>
            </div>
          </div>

          <div class="space-y-3">
            <div
              v-for="item in recommendations"
              :key="item.title"
              :class="['rounded-[24px] border p-4', item.cardClass]"
            >
              <div class="flex items-start gap-3">
                <div :class="['grid h-10 w-10 shrink-0 place-items-center rounded-2xl', item.iconClass]">
                  <Icon :icon="item.icon" class="h-5 w-5" />
                </div>

                <div class="min-w-0">
                  <div class="font-black text-slate-900 dark:text-white">
                    {{ item.title }}
                  </div>
                  <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                    {{ item.desc }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="rounded-[32px] border border-white/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.3fr,0.7fr,0.7fr,0.7fr,0.55fr]">
          <div class="relative">
            <input
              v-model="filters.q"
              type="text"
              placeholder="Cari SPP, daftar ulang, kegiatan, invoice..."
              class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:ring-green-500/10"
            />
            <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Icon icon="lucide:search" class="h-4 w-4" />
            </span>
          </div>

          <select
            v-model="filters.category"
            class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          >
            <option value="semua">Semua Kategori</option>
            <option value="spp">SPP</option>
            <option value="lainnya">Biaya Lain</option>
          </select>

          <select
            v-model="filters.status"
            class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          >
            <option value="semua">Semua Status</option>
            <option value="belum lunas">Belum Lunas</option>
            <option value="menunggu verifikasi">Menunggu</option>
            <option value="lunas">Lunas</option>
            <option value="jatuh tempo">Jatuh Tempo</option>
          </select>

          <select
            v-model="filters.year"
            class="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          >
            <option value="semua">Semua Tahun</option>
            <option
              v-for="year in yearOptions"
              :key="year"
              :value="year"
            >
              {{ year }}
            </option>
          </select>

          <button
            type="button"
            @click="resetFilters"
            class="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Reset
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          @click="activeTab = tab.key"
          :class="[
            'shrink-0 rounded-2xl px-4 py-2.5 text-sm font-black transition',
            activeTab === tab.key
              ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800'
          ]"
        >
          {{ tab.label }}
          <span
            :class="[
              'ml-1 rounded-full px-2 py-0.5 text-[11px]',
              activeTab === tab.key
                ? 'bg-white/18 text-white'
                : 'bg-slate-100 text-slate-500 dark:bg-neutral-800 dark:text-neutral-400'
            ]"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Payment List -->
      <div class="grid gap-4 xl:grid-cols-[1fr,0.82fr]">
        <div class="rounded-[32px] border border-white/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex flex-col gap-3 border-b border-slate-100 p-5 dark:border-neutral-800 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-base font-black text-slate-900 dark:text-white">
                Daftar Tagihan
              </h2>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                Menampilkan {{ visibleRows.length }} pembayaran.
              </p>
            </div>

            <button
              type="button"
              @click="exportCSV"
              class="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <Icon icon="ph:download-simple-duotone" class="h-4 w-4" />
              Export CSV
            </button>
          </div>

          <div v-if="loading" class="grid gap-3 p-5">
            <div
              v-for="i in 5"
              :key="i"
              class="h-28 animate-pulse rounded-[26px] bg-slate-100 dark:bg-neutral-800"
            ></div>
          </div>

          <div
            v-else-if="visibleRows.length === 0"
            class="p-10 text-center"
          >
            <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
              <Icon icon="akar-icons:money" class="h-8 w-8" />
            </div>

            <h3 class="mt-4 text-lg font-black text-slate-900 dark:text-white">
              Tidak ada tagihan
            </h3>

            <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
              Data pembayaran akan tampil otomatis ketika tersedia.
            </p>
          </div>

          <div v-else class="divide-y divide-slate-100 dark:divide-neutral-800">
            <div
              v-for="row in visibleRows"
              :key="row._uid"
              class="p-5 transition hover:bg-slate-50/70 dark:hover:bg-neutral-800/40"
            >
              <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div class="flex min-w-0 gap-3">
                  <div :class="['grid h-12 w-12 shrink-0 place-items-center rounded-2xl', categoryIconClass(row)]">
                    <Icon :icon="isSpp(row) ? 'ph:calendar-check-duotone' : 'ph:receipt-duotone'" class="h-6 w-6" />
                  </div>

                  <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                      <h3 class="truncate text-base font-black text-slate-900 dark:text-white">
                        {{ paymentTitle(row) }}
                      </h3>

                      <span :class="['rounded-full px-2.5 py-1 text-[11px] font-black capitalize', paymentStatusClass(row)]">
                        {{ computedStatus(row) }}
                      </span>
                    </div>

                    <div class="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-neutral-400">
                      <span>{{ isSpp(row) ? 'SPP Bulanan' : 'Biaya Lain' }}</span>
                      <span>•</span>
                      <span>{{ periodLabel(row) }}</span>
                      <span>•</span>
                      <span>Jatuh tempo: {{ formatDate(extractDueDate(row)) }}</span>
                    </div>

                    <p
                      v-if="row.keterangan || row.description || row.note"
                      class="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-neutral-400"
                    >
                      {{ row.keterangan || row.description || row.note }}
                    </p>
                  </div>
                </div>

                <div class="shrink-0 text-left lg:text-right">
                  <div class="text-xl font-black text-slate-900 dark:text-white">
                    {{ formatMoney(extractAmount(row)) }}
                  </div>

                  <div class="mt-3 flex flex-wrap gap-2 lg:justify-end">
                    <button
                      type="button"
                      @click="openInvoice(row)"
                      class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      Detail
                    </button>

                    <button
                      type="button"
                      @click="downloadInvoice(row)"
                      class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      Invoice
                    </button>

                    <button
                      v-if="computedStatus(row) !== 'lunas'"
                      type="button"
                      @click="openPay(row)"
                      class="rounded-xl bg-green-600 px-3 py-2 text-xs font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                    >
                      Bayar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel -->
        <div class="space-y-4">
          <!-- SPP Panel -->
          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  SPP Bulanan
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Ringkasan pembayaran SPP.
                </p>
              </div>

              <span class="rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
                {{ paymentGroups.spp.length }} data
              </span>
            </div>

            <div v-if="paymentGroups.spp.length === 0" class="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400">
              Belum ada data SPP.
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="row in paymentGroups.spp.slice(0, 5)"
                :key="row._uid"
                class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <div class="truncate font-black text-slate-900 dark:text-white">
                      {{ periodLabel(row) }}
                    </div>
                    <div class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                      {{ paymentTitle(row) }}
                    </div>
                  </div>

                  <span :class="['rounded-full px-2.5 py-1 text-[11px] font-black capitalize', paymentStatusClass(row)]">
                    {{ computedStatus(row) }}
                  </span>
                </div>

                <div class="mt-2 font-black text-slate-900 dark:text-white">
                  {{ formatMoney(extractAmount(row)) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Method Panel -->
          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="mb-4">
              <h2 class="text-base font-black text-slate-900 dark:text-white">
                Metode Pembayaran
              </h2>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                Pilihan umum pembayaran di Indonesia.
              </p>
            </div>

            <div class="grid gap-3">
              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="flex items-center gap-3">
                  <div class="grid h-10 w-10 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    <Icon icon="ri:qr-code-line" class="h-5 w-5" />
                  </div>
                  <div>
                    <div class="font-black text-slate-900 dark:text-white">QRIS</div>
                    <div class="text-xs text-slate-500 dark:text-neutral-400">Scan melalui mobile banking/e-wallet.</div>
                  </div>
                </div>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="flex items-center gap-3">
                  <div class="grid h-10 w-10 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    <Icon icon="ph:bank-duotone" class="h-5 w-5" />
                  </div>
                  <div>
                    <div class="font-black text-slate-900 dark:text-white">Transfer Bank / VA</div>
                    <div class="text-xs text-slate-500 dark:text-neutral-400">Gunakan rekening atau Virtual Account.</div>
                  </div>
                </div>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="flex items-center gap-3">
                  <div class="grid h-10 w-10 place-items-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                    <Icon icon="ph:upload-simple-duotone" class="h-5 w-5" />
                  </div>
                  <div>
                    <div class="font-black text-slate-900 dark:text-white">Upload Bukti</div>
                    <div class="text-xs text-slate-500 dark:text-neutral-400">Kirim link bukti transfer untuk verifikasi admin.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Other Fees -->
          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Biaya Lain
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Kegiatan, seragam, kitab, daftar ulang.
                </p>
              </div>

              <span class="rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
                {{ paymentGroups.other.length }} data
              </span>
            </div>

            <div v-if="paymentGroups.other.length === 0" class="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400">
              Belum ada biaya lain.
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="row in paymentGroups.other.slice(0, 5)"
                :key="row._uid"
                class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <div class="truncate font-black text-slate-900 dark:text-white">
                      {{ paymentTitle(row) }}
                    </div>
                    <div class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                      {{ formatDate(extractDueDate(row)) }}
                    </div>
                  </div>

                  <span :class="['rounded-full px-2.5 py-1 text-[11px] font-black capitalize', paymentStatusClass(row)]">
                    {{ computedStatus(row) }}
                  </span>
                </div>

                <div class="mt-2 font-black text-slate-900 dark:text-white">
                  {{ formatMoney(extractAmount(row)) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Invoice Modal -->
    <div
      v-if="invoiceOpen && selectedPayment"
      class="fixed inset-0 z-[9999] overflow-y-auto p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Tutup modal"
        @click="closeInvoice"
      ></button>

      <div class="relative z-10 flex min-h-full items-center justify-center">
        <div class="w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
          <div class="border-b border-slate-100 p-5 dark:border-neutral-800">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-xs font-black uppercase tracking-[0.14em] text-green-600 dark:text-green-400">
                  Invoice Pembayaran
                </div>
                <h3 class="mt-1 text-xl font-black text-slate-900 dark:text-white">
                  {{ paymentTitle(selectedPayment) }}
                </h3>
              </div>

              <button
                type="button"
                @click="closeInvoice"
                class="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                <Icon icon="lucide:x" class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div class="max-h-[75vh] space-y-4 overflow-y-auto p-5">
            <div class="grid gap-3 sm:grid-cols-2">
              <InfoBox label="Nama Santri" :value="santriNameOf(currentSantri)" />
              <InfoBox label="Kategori" :value="isSpp(selectedPayment) ? 'SPP Bulanan' : 'Biaya Lain'" />
              <InfoBox label="Periode" :value="periodLabel(selectedPayment)" />
              <InfoBox label="Jatuh Tempo" :value="formatDate(extractDueDate(selectedPayment))" />
              <InfoBox label="Status" :value="computedStatus(selectedPayment)" />
              <InfoBox label="Nominal" :value="formatMoney(extractAmount(selectedPayment))" />
            </div>

            <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
              <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                Keterangan
              </div>
              <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                {{ selectedPayment.keterangan || selectedPayment.description || selectedPayment.note || 'Tidak ada keterangan tambahan.' }}
              </p>
            </div>

            <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
              <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                Informasi Pembayaran
              </div>

              <div class="mt-3 grid gap-3 sm:grid-cols-2">
                <InfoBox label="Bank" :value="selectedPayment.bankName || selectedPayment.bank || defaultBank.bankName" />
                <InfoBox label="No. Rekening / VA" :value="selectedPayment.vaNumber || selectedPayment.virtualAccount || selectedPayment.accountNumber || defaultBank.accountNumber" />
                <InfoBox label="Atas Nama" :value="selectedPayment.accountName || defaultBank.accountName" />
                <InfoBox label="Kode Invoice" :value="invoiceCode(selectedPayment)" />
              </div>
            </div>
          </div>

          <div class="flex flex-wrap justify-end gap-2 border-t border-slate-100 p-5 dark:border-neutral-800">
            <button
              type="button"
              @click="downloadInvoice(selectedPayment)"
              class="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Download Invoice
            </button>

            <button
              v-if="computedStatus(selectedPayment) !== 'lunas'"
              type="button"
              @click="openPay(selectedPayment)"
              class="rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
            >
              Bayar Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pay Modal -->
    <div
      v-if="payOpen && selectedPayment"
      class="fixed inset-0 z-[9999] overflow-y-auto p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Tutup modal"
        @click="closePay"
      ></button>

      <div class="relative z-10 flex min-h-full items-center justify-center">
        <div class="w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
          <div class="border-b border-slate-100 p-5 dark:border-neutral-800">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-xs font-black uppercase tracking-[0.14em] text-green-600 dark:text-green-400">
                  Konfirmasi Pembayaran
                </div>
                <h3 class="mt-1 text-xl font-black text-slate-900 dark:text-white">
                  {{ paymentTitle(selectedPayment) }}
                </h3>
              </div>

              <button
                type="button"
                @click="closePay"
                class="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                <Icon icon="lucide:x" class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div class="max-h-[75vh] space-y-4 overflow-y-auto p-5">
            <div class="rounded-[26px] border border-green-100 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/10">
              <div class="text-xs font-black text-green-700 dark:text-green-300">
                Nominal Pembayaran
              </div>
              <div class="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                {{ formatMoney(extractAmount(selectedPayment)) }}
              </div>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="flex items-center gap-3">
                  <div class="grid h-10 w-10 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    <Icon icon="ph:bank-duotone" class="h-5 w-5" />
                  </div>

                  <div class="min-w-0">
                    <div class="text-xs font-bold text-slate-500 dark:text-neutral-400">Bank / VA</div>
                    <div class="truncate font-black text-slate-900 dark:text-white">
                      {{ selectedPayment.bankName || selectedPayment.bank || defaultBank.bankName }}
                    </div>
                    <div class="truncate text-sm font-bold text-slate-600 dark:text-neutral-300">
                      {{ selectedPayment.vaNumber || selectedPayment.virtualAccount || selectedPayment.accountNumber || defaultBank.accountNumber }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div class="flex items-center gap-3">
                  <div class="grid h-10 w-10 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    <Icon icon="ri:qr-code-line" class="h-5 w-5" />
                  </div>

                  <div class="min-w-0">
                    <div class="text-xs font-bold text-slate-500 dark:text-neutral-400">QRIS</div>
                    <div class="truncate font-black text-slate-900 dark:text-white">
                      {{ selectedPayment.qrisUrl || selectedPayment.qrisImage ? 'Tersedia' : 'Belum tersedia' }}
                    </div>
                    <a
                      v-if="selectedPayment.qrisUrl || selectedPayment.qrisImage"
                      :href="selectedPayment.qrisUrl || selectedPayment.qrisImage"
                      target="_blank"
                      class="text-sm font-bold text-green-700 hover:underline dark:text-green-300"
                    >
                      Buka QRIS
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <a
              v-if="selectedPayment.paymentUrl || selectedPayment.checkoutUrl"
              :href="selectedPayment.paymentUrl || selectedPayment.checkoutUrl"
              target="_blank"
              class="flex items-center justify-between rounded-[24px] bg-green-600 p-4 text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
            >
              <div>
                <div class="font-black">Bayar melalui payment gateway</div>
                <div class="mt-0.5 text-xs text-white/75">Midtrans / Xendit / payment link</div>
              </div>
              <Icon icon="lucide:external-link" class="h-5 w-5" />
            </a>

            <form class="space-y-4" @submit.prevent="submitConfirmation">
              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
                  Metode Pembayaran
                </label>
                <select
                  v-model="confirmForm.method"
                  required
                  class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                >
                  <option value="transfer">Transfer Bank</option>
                  <option value="qris">QRIS</option>
                  <option value="va">Virtual Account</option>
                  <option value="cash">Tunai ke Admin</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
                  Nama Pengirim
                </label>
                <input
                  v-model.trim="confirmForm.senderName"
                  type="text"
                  placeholder="Nama pemilik rekening / e-wallet"
                  class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
                  Link Bukti Transfer
                </label>
                <input
                  v-model.trim="confirmForm.proofUrl"
                  type="url"
                  placeholder="https://..."
                  class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
                <p class="mt-1.5 text-xs text-slate-500 dark:text-neutral-400">
                  Upload bukti ke penyimpanan gambar/file, lalu tempel link di sini.
                </p>
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-slate-700 dark:text-neutral-300">
                  Catatan
                </label>
                <textarea
                  v-model.trim="confirmForm.note"
                  rows="3"
                  placeholder="Contoh: Transfer BCA pukul 10.30 WIB"
                  class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                ></textarea>
              </div>

              <div
                v-if="confirmError"
                class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300"
              >
                {{ confirmError }}
              </div>

              <button
                type="submit"
                :disabled="confirmLoading"
                class="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Icon
                  v-if="confirmLoading"
                  icon="ph:spinner-gap-duotone"
                  class="h-5 w-5 animate-spin"
                />
                <Icon
                  v-else
                  icon="ph:upload-simple-duotone"
                  class="h-5 w-5"
                />
                {{ confirmLoading ? 'Mengirim...' : 'Kirim Konfirmasi' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div
      v-if="successOpen"
      class="fixed inset-0 z-[9999] overflow-y-auto p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Tutup modal"
        @click="successOpen = false"
      ></button>

      <div class="relative z-10 flex min-h-full items-center justify-center">
        <div class="w-full max-w-md rounded-[32px] border border-green-100 bg-white p-6 text-center shadow-2xl dark:border-green-900/40 dark:bg-neutral-900">
          <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
            <Icon icon="ph:check-circle-duotone" class="h-9 w-9" />
          </div>

          <h3 class="mt-5 text-xl font-black text-slate-900 dark:text-white">
            Konfirmasi Terkirim
          </h3>

          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-neutral-300">
            Bukti pembayaran berhasil dikirim dan menunggu verifikasi admin.
          </p>

          <button
            type="button"
            @click="successOpen = false"
            class="mt-5 w-full rounded-2xl bg-green-600 px-4 py-3 text-sm font-black text-white transition hover:bg-green-700"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { getDatabase, onValue, push, ref as dbRef, set, update } from 'firebase/database'
import { useNuxtApp, useRuntimeConfig, useState } from 'nuxt/app'

definePageMeta({
  layout: 'wali'
})

type AnyRow = Record<string, any>

type SantriProfile = AnyRow & {
  id: string
  _uid: string
  _path?: string
}

type RecommendationItem = {
  title: string
  desc: string
  icon: string
  cardClass: string
  iconClass: string
}

const config = useRuntimeConfig()
const { $realtimeDb } = useNuxtApp() as any
const sessionUser = useState<any>('sessionUser', () => ({}))

const clientName = String(config.public.clientName || 'alinayah')

const defaultBank = {
  bankName: String(config.public.paymentBankName || 'Bank Lembaga'),
  accountNumber: String(config.public.paymentAccountNumber || 'Hubungi Admin'),
  accountName: String(config.public.paymentAccountName || 'Bendahara Lembaga')
}

const loading = ref(true)
const selectedSantriId = ref('')
const santriProfiles = ref<SantriProfile[]>([])
const paymentRawRows = ref<AnyRow[]>([])

const activeTab = ref<'semua' | 'spp' | 'lainnya' | 'belum' | 'lunas' | 'riwayat'>('semua')

const filters = ref({
  q: '',
  category: 'semua',
  status: 'semua',
  year: 'semua'
})

const invoiceOpen = ref(false)
const payOpen = ref(false)
const successOpen = ref(false)
const selectedPayment = ref<AnyRow | null>(null)

const confirmLoading = ref(false)
const confirmError = ref('')

const confirmForm = ref({
  method: 'transfer',
  senderName: '',
  proofUrl: '',
  note: ''
})

let unsubscribers: Array<() => void> = []
let stopSessionWatch: (() => void) | null = null

const PAYMENT_PATHS = [
  'payment',
  'payments',
  'pembayaran',
  'tagihan',
  'spp',
  'finance/invoices'
]

const currentSantri = computed(() => {
  return santriProfiles.value.find((item) => item.id === selectedSantriId.value) || santriProfiles.value[0] || null
})

const paymentRows = computed(() => {
  return sortRowsByDateDesc(
    paymentRawRows.value.filter((row) => belongsToCurrentSantri(row))
  )
})

const filteredRows = computed(() => {
  return paymentRows.value
    .filter((row) => {
      if (filters.value.q.trim()) {
        const q = normalizeText(filters.value.q)
        const text = normalizeText([
          paymentTitle(row),
          row.keterangan,
          row.description,
          row.note,
          row.invoiceCode,
          row.invoiceNumber,
          periodLabel(row)
        ].join(' '))

        if (!text.includes(q)) return false
      }

      if (filters.value.category !== 'semua') {
        if (filters.value.category === 'spp' && !isSpp(row)) return false
        if (filters.value.category === 'lainnya' && isSpp(row)) return false
      }

      if (filters.value.status !== 'semua') {
        const status = computedStatus(row)

        if (filters.value.status === 'jatuh tempo') {
          if (!isOverdue(row)) return false
        } else if (status !== filters.value.status) {
          return false
        }
      }

      if (filters.value.year !== 'semua') {
        const year = new Date(extractDueDate(row) || extractDate(row)).getFullYear()
        if (String(year) !== String(filters.value.year)) return false
      }

      return true
    })
})

const visibleRows = computed(() => {
  if (activeTab.value === 'spp') return filteredRows.value.filter(isSpp)
  if (activeTab.value === 'lainnya') return filteredRows.value.filter((row) => !isSpp(row))
  if (activeTab.value === 'belum') return filteredRows.value.filter((row) => computedStatus(row) !== 'lunas')
  if (activeTab.value === 'lunas') return filteredRows.value.filter((row) => computedStatus(row) === 'lunas')
  if (activeTab.value === 'riwayat') return filteredRows.value.filter((row) => computedStatus(row) === 'lunas' || computedStatus(row) === 'menunggu verifikasi')
  return filteredRows.value
})

const paidRows = computed(() => paymentRows.value.filter((row) => computedStatus(row) === 'lunas'))
const unpaidRows = computed(() => paymentRows.value.filter((row) => computedStatus(row) !== 'lunas'))
const pendingRows = computed(() => paymentRows.value.filter((row) => computedStatus(row) === 'menunggu verifikasi'))
const overdueRows = computed(() => paymentRows.value.filter((row) => isOverdue(row) && computedStatus(row) !== 'lunas'))

const paidTotal = computed(() => paidRows.value.reduce((sum, row) => sum + extractAmount(row), 0))
const unpaidTotal = computed(() => unpaidRows.value.reduce((sum, row) => sum + extractAmount(row), 0))

const paidRate = computed(() => {
  if (!paymentRows.value.length) return 0
  return Math.round((paidRows.value.length / paymentRows.value.length) * 100)
})

const paymentGroups = computed(() => {
  return {
    spp: paymentRows.value.filter(isSpp),
    other: paymentRows.value.filter((row) => !isSpp(row))
  }
})

const yearOptions = computed(() => {
  const years = new Set<string>()

  for (const row of paymentRows.value) {
    const date = extractDueDate(row) || extractDate(row)
    if (date) years.add(String(new Date(date).getFullYear()))
  }

  return Array.from(years).sort((a, b) => Number(b) - Number(a))
})

const tabs = computed(() => [
  { key: 'semua' as const, label: 'Semua', count: filteredRows.value.length },
  { key: 'spp' as const, label: 'SPP', count: filteredRows.value.filter(isSpp).length },
  { key: 'lainnya' as const, label: 'Biaya Lain', count: filteredRows.value.filter((row) => !isSpp(row)).length },
  { key: 'belum' as const, label: 'Belum Lunas', count: filteredRows.value.filter((row) => computedStatus(row) !== 'lunas').length },
  { key: 'lunas' as const, label: 'Lunas', count: filteredRows.value.filter((row) => computedStatus(row) === 'lunas').length },
  { key: 'riwayat' as const, label: 'Riwayat', count: filteredRows.value.filter((row) => computedStatus(row) === 'lunas' || computedStatus(row) === 'menunggu verifikasi').length }
])

const nextDueRow = computed(() => {
  return unpaidRows.value
    .filter((row) => extractDueDate(row))
    .sort((a, b) => extractDueDate(a) - extractDueDate(b))[0] || null
})

const nextDueLabel = computed(() => {
  if (!nextDueRow.value) return '—'
  return formatDate(extractDueDate(nextDueRow.value))
})

const paymentHealthScore = computed(() => {
  if (!paymentRows.value.length) return 75

  let score = 100

  score -= Math.min(45, overdueRows.value.length * 15)
  score -= Math.min(25, pendingRows.value.length * 5)

  const unpaidRatio = unpaidRows.value.length / paymentRows.value.length
  score -= Math.round(unpaidRatio * 25)

  return Math.max(10, Math.min(100, score))
})

const paymentInsight = computed(() => {
  if (!paymentRows.value.length) {
    return {
      title: 'Belum ada data pembayaran',
      desc: 'Sistem belum menemukan tagihan untuk santri ini. Data akan muncul otomatis ketika admin membuat invoice.'
    }
  }

  if (overdueRows.value.length > 0) {
    return {
      title: 'Ada tagihan jatuh tempo',
      desc: `Terdapat ${overdueRows.value.length} tagihan yang melewati batas pembayaran. Prioritaskan pembayaran terdekat agar administrasi tetap aman.`
    }
  }

  if (unpaidTotal.value > 0) {
    return {
      title: 'Masih ada tagihan aktif',
      desc: `Total tagihan belum lunas sebesar ${formatMoney(unpaidTotal.value)}. Wali dapat melihat detail dan mengirim bukti pembayaran pada halaman ini.`
    }
  }

  return {
    title: 'Pembayaran dalam kondisi baik',
    desc: 'Tidak ada tagihan aktif yang perlu dibayar saat ini. Riwayat pembayaran tetap dapat dipantau dari tab lunas atau riwayat.'
  }
})

const recommendations = computed<RecommendationItem[]>(() => {
  const items: RecommendationItem[] = []

  if (overdueRows.value.length > 0) {
    items.push({
      title: 'Prioritaskan tagihan jatuh tempo',
      desc: `Bayar ${overdueRows.value.length} tagihan jatuh tempo terlebih dahulu agar tidak menumpuk.`,
      icon: 'ph:warning-circle-duotone',
      cardClass: 'border-rose-100 bg-rose-50/70 dark:border-rose-900/30 dark:bg-rose-900/10',
      iconClass: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
    })
  }

  if (paymentGroups.value.spp.some((row) => computedStatus(row) !== 'lunas')) {
    items.push({
      title: 'SPP bulanan perlu dicek',
      desc: 'Ada SPP yang belum lunas. Selesaikan SPP lebih dulu karena termasuk pembayaran rutin.',
      icon: 'ph:calendar-check-duotone',
      cardClass: 'border-green-100 bg-green-50/70 dark:border-green-900/30 dark:bg-green-900/10',
      iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })
  }

  if (pendingRows.value.length > 0) {
    items.push({
      title: 'Menunggu verifikasi admin',
      desc: `${pendingRows.value.length} pembayaran sudah dikonfirmasi dan sedang menunggu validasi admin.`,
      icon: 'ph:clock-duotone',
      cardClass: 'border-green-100 bg-green-50/70 dark:border-green-900/30 dark:bg-green-900/10',
      iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })
  }

  if (!items.length) {
    items.push({
      title: 'Administrasi aman',
      desc: 'Belum ada pembayaran yang membutuhkan perhatian khusus saat ini.',
      icon: 'ph:check-circle-duotone',
      cardClass: 'border-green-100 bg-green-50/70 dark:border-green-900/30 dark:bg-green-900/10',
      iconClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
    })
  }

  return items
})

function resetFilters() {
  filters.value = {
    q: '',
    category: 'semua',
    status: 'semua',
    year: 'semua'
  }

  activeTab.value = 'semua'
}

function clearSubscriptions() {
  for (const unsubscribe of unsubscribers) {
    try {
      unsubscribe()
    } catch {}
  }

  unsubscribers = []
}

function resolveSantriIdsFromSession() {
  const ids = new Set<string>()
  const session = sessionUser.value || {}

  if (Array.isArray(session.santriIds)) {
    for (const id of session.santriIds) {
      if (id) ids.add(String(id))
    }
  }

  if (session.santriId) ids.add(String(session.santriId))

  return Array.from(ids)
}

function setupRealtime() {
  if (!$realtimeDb) {
    loading.value = false
    return
  }

  clearSubscriptions()

  const santriIds = resolveSantriIdsFromSession()

  if (!santriIds.length) {
    santriProfiles.value = []
    selectedSantriId.value = ''
    paymentRawRows.value = []
    loading.value = false
    return
  }

  loading.value = true
  santriProfiles.value = []

  for (const id of santriIds) {
    const unsubscribe = onValue(dbRef($realtimeDb, `${clientName}/santri/${id}`), (snap) => {
      const raw = snap.val()

      if (raw) {
        upsertSantriProfile({
          id,
          _uid: id,
          _path: `${clientName}/santri/${id}`,
          ...raw
        })

        if (!selectedSantriId.value) selectedSantriId.value = id
      }

      loading.value = false
    })

    unsubscribers.push(unsubscribe)
  }

  for (const path of PAYMENT_PATHS) {
    subscribeDeep(`${clientName}/${path}`)
  }
}

function subscribeDeep(path: string) {
  if (!$realtimeDb) return

  const unsubscribe = onValue(dbRef($realtimeDb, path), (snap) => {
    const rows = flattenRecords(snap.val(), [path], 0)
    const otherRows = paymentRawRows.value.filter((row) => !String(row._path || '').startsWith(path))
    paymentRawRows.value = [...otherRows, ...rows]
    loading.value = false
  })

  unsubscribers.push(unsubscribe)
}

function upsertSantriProfile(profile: SantriProfile) {
  const index = santriProfiles.value.findIndex((item) => item.id === profile.id)

  if (index >= 0) {
    santriProfiles.value[index] = profile
  } else {
    santriProfiles.value.push(profile)
  }
}

function flattenRecords(value: any, path: string[] = [], depth = 0): AnyRow[] {
  if (!value || depth > 7) return []

  if (Array.isArray(value)) {
    return value.flatMap((item, index) => flattenRecords(item, [...path, String(index)], depth + 1))
  }

  if (typeof value !== 'object') return []

  const objectValue = value as AnyRow
  const lastPath = path[path.length - 1] || ''
  const pathText = path.join('/')

  if (looksLikePaymentRecord(objectValue)) {
    return [
      {
        _uid: objectValue.id || objectValue.key || lastPath || pathText,
        _path: pathText,
        _pathParts: path,
        ...objectValue
      }
    ]
  }

  const nested: AnyRow[] = []

  for (const [key, childValue] of Object.entries(objectValue)) {
    if (childValue && typeof childValue === 'object') {
      nested.push(...flattenRecords(childValue, [...path, key], depth + 1))
    }
  }

  return nested
}

function looksLikePaymentRecord(row: AnyRow) {
  const keys = Object.keys(row)

  return keys.some((key) => [
    'santriId',
    'idSantri',
    'santri_id',
    'studentId',
    'namaSantri',
    'santriName',
    'santri',
    'amount',
    'jumlah',
    'total',
    'nominal',
    'tagihan',
    'spp',
    'invoiceCode',
    'invoiceNumber',
    'paymentUrl',
    'checkoutUrl',
    'vaNumber',
    'virtualAccount',
    'qrisUrl',
    'status',
    'dueDate',
    'tanggalJatuhTempo'
  ].includes(key))
}

function belongsToCurrentSantri(row: AnyRow) {
  const santri = currentSantri.value
  const selectedId = selectedSantriId.value

  if (!santri || !selectedId) return false

  const idCandidates = [
    row.santriId,
    row.idSantri,
    row.santri_id,
    row.studentId,
    row.siswaId,
    row.uid,
    row.userId
  ]
    .map((value) => String(value || '').trim())
    .filter(Boolean)

  if (idCandidates.includes(selectedId)) return true

  const path = String(row._path || '')
  if (path.split('/').includes(selectedId)) return true

  const santriName = santriNameOf(santri)

  const nameCandidates = [
    row.santri,
    row.nama,
    row.namaSantri,
    row.santriName,
    row.studentName,
    row.name
  ]

  return nameCandidates.some((name) => normalizeText(name) && normalizeText(name) === normalizeText(santriName))
}

function santriNameOf(santri?: AnyRow | null) {
  if (!santri) return sessionUser.value?.santriName || 'Santri'
  return santri.santri || santri.nama || santri.namaSantri || santri.name || sessionUser.value?.santriName || 'Santri'
}

function normalizeText(value?: any) {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function extractNumber(value: any) {
  const numberValue = Number(String(value ?? '').replace(/[^\d.-]/g, ''))
  return Number.isFinite(numberValue) ? numberValue : 0
}

function extractAmount(row: AnyRow) {
  return extractNumber(row.amount ?? row.jumlah ?? row.total ?? row.nominal ?? row.tagihan ?? row.sisa ?? row.billAmount)
}

function extractDate(row: AnyRow) {
  const candidates = [
    row.date,
    row.tanggal,
    row.createdAt,
    row.updatedAt,
    row.at,
    row.timestamp,
    row.time
  ]

  for (const value of candidates) {
    const parsed = parseDateValue(value)
    if (parsed) return parsed
  }

  return Date.now()
}

function extractDueDate(row: AnyRow) {
  const candidates = [
    row.dueDate,
    row.tanggalJatuhTempo,
    row.jatuhTempo,
    row.deadline,
    row.batasBayar,
    row.expiredAt,
    row.expiryDate
  ]

  for (const value of candidates) {
    const parsed = parseDateValue(value)
    if (parsed) return parsed
  }

  return extractDate(row)
}

function parseDateValue(value: any) {
  if (!value) return 0

  if (typeof value === 'number') {
    if (value < 10_000_000_000) return value * 1000
    return value
  }

  if (typeof value === 'string') {
    const parsed = new Date(value).getTime()
    return Number.isNaN(parsed) ? 0 : parsed
  }

  if (typeof value === 'object') {
    if (value._seconds) return Number(value._seconds) * 1000
    if (typeof value.toMillis === 'function') return value.toMillis()
  }

  return 0
}

function sortRowsByDateDesc(rows: AnyRow[]) {
  return [...rows].sort((a, b) => extractDueDate(b) - extractDueDate(a))
}

function paymentTitle(row: AnyRow) {
  return row.title || row.namaTagihan || row.name || row.jenis || row.category || row.kategori || row.description || 'Tagihan Pembayaran'
}

function isSpp(row: AnyRow) {
  const text = normalizeText([
    row.category,
    row.kategori,
    row.jenis,
    row.title,
    row.namaTagihan,
    row.name,
    row.description,
    row._path
  ].join(' '))

  return text.includes('spp') || text.includes('syahriyah') || text.includes('bulanan') || text.includes('uang sekolah')
}

function periodLabel(row: AnyRow) {
  if (row.periode) return String(row.periode)
  if (row.period) return String(row.period)
  if (row.month && row.year) return `${monthName(Number(row.month))} ${row.year}`
  if (row.bulan && row.tahun) return `${monthName(Number(row.bulan))} ${row.tahun}`

  const date = extractDueDate(row)
  if (!date) return 'Periode belum tersedia'

  return new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric'
  }).format(new Date(date))
}

function monthName(month: number) {
  const safeMonth = Math.max(1, Math.min(12, month))
  return new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(2025, safeMonth - 1, 1))
}

function computedStatus(row: AnyRow) {
  const status = normalizeText(row.status || row.paymentStatus || row.state)

  if (status.includes('lunas') || status.includes('paid') || status.includes('success')) return 'lunas'
  if (status.includes('verifikasi') || status.includes('pending') || status.includes('menunggu')) return 'menunggu verifikasi'
  if (isOverdue(row)) return 'jatuh tempo'

  const amount = extractAmount(row)
  const paid = extractNumber(row.paid ?? row.dibayar ?? row.terbayar)

  if (amount > 0 && paid >= amount) return 'lunas'

  return 'belum lunas'
}

function isOverdue(row: AnyRow) {
  const status = normalizeText(row.status || row.paymentStatus || row.state)

  if (status.includes('lunas') || status.includes('paid') || status.includes('success')) return false
  if (status.includes('verifikasi') || status.includes('pending') || status.includes('menunggu')) return false

  const due = extractDueDate(row)

  if (!due) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueDate = new Date(due)
  dueDate.setHours(0, 0, 0, 0)

  return dueDate.getTime() < today.getTime()
}

function paymentStatusClass(row: AnyRow) {
  const status = computedStatus(row)

  if (status === 'lunas') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (status === 'menunggu verifikasi') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (status === 'jatuh tempo') return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
  return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
}

function categoryIconClass(row: AnyRow) {
  if (isSpp(row)) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
}

function invoiceCode(row: AnyRow) {
  return row.invoiceCode || row.invoiceNumber || row.code || `INV-${String(row._uid || '').slice(-8).toUpperCase()}`
}

function formatDate(value?: number) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium'
  }).format(new Date(value))
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value || 0)
}

function formatShortMoney(value: number) {
  if (!value) return '0'
  if (value >= 1_000_000) return `${Math.round(value / 100_000) / 10}jt`
  if (value >= 1_000) return `${Math.round(value / 1000)}rb`
  return String(value)
}

function openInvoice(row: AnyRow) {
  selectedPayment.value = row
  invoiceOpen.value = true
}

function closeInvoice() {
  invoiceOpen.value = false
}

function openPay(row: AnyRow) {
  selectedPayment.value = row
  payOpen.value = true
  invoiceOpen.value = false
  confirmError.value = ''
  confirmForm.value = {
    method: 'transfer',
    senderName: sessionUser.value?.name || '',
    proofUrl: '',
    note: ''
  }
}

function closePay() {
  payOpen.value = false
  confirmError.value = ''
}

async function submitConfirmation() {
  if (!selectedPayment.value || !currentSantri.value) return

  confirmError.value = ''

  if (!confirmForm.value.method) {
    confirmError.value = 'Metode pembayaran wajib dipilih.'
    return
  }

  if (!confirmForm.value.proofUrl && confirmForm.value.method !== 'cash') {
    confirmError.value = 'Link bukti pembayaran wajib diisi.'
    return
  }

  confirmLoading.value = true

  try {
    const db = getDatabase()
    const now = Date.now()
    const payment = selectedPayment.value

    const confirmationRef = push(dbRef(db, `${clientName}/paymentConfirmations`))

    const payload = {
      id: confirmationRef.key,
      paymentId: payment.id || payment._uid,
      paymentPath: payment._path || '',
      invoiceCode: invoiceCode(payment),
      santriId: selectedSantriId.value,
      santriName: santriNameOf(currentSantri.value),
      waliName: sessionUser.value?.name || currentSantri.value?.walisantri || '',
      waliPhone: sessionUser.value?.waliPhone || currentSantri.value?.nohp || currentSantri.value?.wali_nohp || '',
      title: paymentTitle(payment),
      amount: extractAmount(payment),
      method: confirmForm.value.method,
      senderName: confirmForm.value.senderName,
      proofUrl: confirmForm.value.proofUrl,
      note: confirmForm.value.note,
      status: 'menunggu verifikasi',
      createdAt: now,
      updatedAt: now
    }

    await set(confirmationRef, payload)

    if (payment._path) {
      await update(dbRef(db, payment._path), {
        status: 'menunggu verifikasi',
        confirmationId: confirmationRef.key,
        proofUrl: confirmForm.value.proofUrl || null,
        paymentMethod: confirmForm.value.method,
        confirmedAt: now,
        updatedAt: now
      })
    }

    payOpen.value = false
    successOpen.value = true
  } catch (e: any) {
    confirmError.value = e?.message || 'Gagal mengirim konfirmasi pembayaran.'
  } finally {
    confirmLoading.value = false
  }
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = filename

  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()

  URL.revokeObjectURL(url)
}

function downloadInvoice(row: AnyRow) {
  const content = [
    'INVOICE PEMBAYARAN',
    '==============================',
    `Kode Invoice : ${invoiceCode(row)}`,
    `Nama Santri  : ${santriNameOf(currentSantri.value)}`,
    `Pembayaran   : ${paymentTitle(row)}`,
    `Kategori     : ${isSpp(row) ? 'SPP Bulanan' : 'Biaya Lain'}`,
    `Periode      : ${periodLabel(row)}`,
    `Jatuh Tempo  : ${formatDate(extractDueDate(row))}`,
    `Status       : ${computedStatus(row)}`,
    `Nominal      : ${formatMoney(extractAmount(row))}`,
    '',
    'INFORMASI PEMBAYARAN',
    '==============================',
    `Bank         : ${row.bankName || row.bank || defaultBank.bankName}`,
    `No Rek/VA    : ${row.vaNumber || row.virtualAccount || row.accountNumber || defaultBank.accountNumber}`,
    `Atas Nama    : ${row.accountName || defaultBank.accountName}`,
    '',
    `Tanggal Cetak: ${new Date().toLocaleString('id-ID')}`
  ].join('\n')

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  saveBlob(blob, `invoice_${invoiceCode(row)}.txt`)
}

function toCsvCell(value: unknown) {
  const text = String(value ?? '')

  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }

  return text
}

function exportCSV() {
  const headers = [
    'Invoice',
    'Santri',
    'Pembayaran',
    'Kategori',
    'Periode',
    'Jatuh Tempo',
    'Nominal',
    'Status'
  ]

  const lines = visibleRows.value.map((row) => [
    invoiceCode(row),
    santriNameOf(currentSantri.value),
    paymentTitle(row),
    isSpp(row) ? 'SPP' : 'Biaya Lain',
    periodLabel(row),
    formatDate(extractDueDate(row)),
    extractAmount(row),
    computedStatus(row)
  ].map(toCsvCell).join(','))

  const csv = '\uFEFF' + [headers.join(','), ...lines].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })

  saveBlob(blob, 'pembayaran_wali.csv')
}

onMounted(() => {
  stopSessionWatch = watch(
    () => JSON.stringify({
      santriId: sessionUser.value?.santriId || '',
      santriIds: sessionUser.value?.santriIds || []
    }),
    () => {
      setupRealtime()
    },
    { immediate: true }
  )
})

onBeforeUnmount(() => {
  clearSubscriptions()

  if (stopSessionWatch) {
    stopSessionWatch()
    stopSessionWatch = null
  }
})
</script>