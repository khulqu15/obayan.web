<template>
  <main class="min-h-screen bg-[#f7faf8] pt-12 text-slate-950">
    <!-- Tenant checking -->
    <section
      v-if="tenantChecking"
      class="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4"
    >
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-green-200/50 blur-3xl"></div>
        <div class="absolute right-[-120px] top-32 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl"></div>
        <div class="absolute bottom-[-160px] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-lime-100/70 blur-3xl"></div>
      </div>

      <div class="relative w-full max-w-md rounded-[2rem] border border-white/80 bg-white/90 p-6 text-center shadow-[0_24px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-700">
          <svg class="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
          </svg>
        </div>

        <h1 class="mt-5 text-2xl font-black tracking-tight text-slate-950">
          Sebentar ya...
        </h1>

        <p class="mt-2 text-sm leading-6 text-slate-500">
          Kami sedang memeriksa data tenant sebelum membuka halaman pembayaran.
        </p>

        <div class="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
          /{{ tenantSlug }}
        </div>
      </div>
    </section>

    <!-- Tenant not found -->
    <section
      v-else-if="!tenantReady"
      class="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4"
    >
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-green-200/50 blur-3xl"></div>
        <div class="absolute right-[-120px] top-32 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl"></div>
        <div class="absolute bottom-[-160px] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-lime-100/70 blur-3xl"></div>
      </div>

      <div class="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_24px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div class="relative bg-slate-950 p-6 text-white sm:p-8">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,.35),transparent_30%),radial-gradient(circle_at_85%_30%,rgba(16,185,129,.22),transparent_35%)]"></div>

          <div class="relative">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-green-200">
              <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4m0 4h.01M10.3 4.6 2.9 17.2A2 2 0 0 0 4.6 20h14.8a2 2 0 0 0 1.7-2.8L13.7 4.6a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>

            <h1 class="mt-5 text-3xl font-black tracking-tight">
              Tenant belum ditemukan
            </h1>

            <p class="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Sepertinya link pembayaran ini belum terhubung dengan data tenant yang valid di Obayan.
            </p>
          </div>
        </div>

        <div class="p-6 sm:p-8">
          <div class="rounded-3xl border border-slate-100 bg-slate-50 p-5">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Tenant yang dicari
            </p>

            <p class="mt-2 text-lg font-black text-slate-950">
              /{{ tenantSlug }}
            </p>

            <p class="mt-3 text-sm leading-6 text-slate-500">
              {{ tenantCheckError || tenantMissingReason || 'Data tenant atau settings belum tersedia.' }}
            </p>
          </div>

          <div class="mt-5 grid gap-3 sm:grid-cols-2">
            <a
              href="https://obayan.id"
              class="inline-flex items-center justify-center rounded-2xl bg-green-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-green-600/20 transition hover:-translate-y-0.5 hover:bg-green-700"
            >
              Kembali ke Obayan
            </a>

            <a
              href="https://wa.me/62895321848133"
              target="_blank"
              class="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              Hubungi Admin
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Payment page -->
    <section v-else class="relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-green-200/50 blur-3xl"></div>
        <div class="absolute right-[-120px] top-32 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl"></div>
        <div class="absolute bottom-[-160px] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-lime-100/70 blur-3xl"></div>
      </div>

      <div class="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <!-- Top bar -->
        <header class="mb-5 rounded-[2rem] border border-white/80 bg-white/85 p-4 shadow-[0_20px_70px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-600/20">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path d="M5 7.5A3.5 3.5 0 0 1 8.5 4h7A3.5 3.5 0 0 1 19 7.5v9A3.5 3.5 0 0 1 15.5 20h-7A3.5 3.5 0 0 1 5 16.5v-9Z" stroke="currentColor" stroke-width="1.8" />
                  <path d="M8.5 9h7M8.5 12.5h7M8.5 16h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </div>

              <div>
                <p class="text-xs font-bold uppercase tracking-[0.2em] text-green-700">
                  Obayan Payment
                </p>
                <h1 class="mt-0.5 text-xl font-black tracking-tight text-slate-950">
                  Aktivasi Langganan
                </h1>
              </div>
            </div>

            <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div
                v-if="withoutPayment"
                class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-black text-amber-700"
              >
                WITHOUT_PAYMENT aktif
              </div>

              <div v-else class="rounded-2xl bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
                Midtrans aktif
              </div>

              <div class="rounded-2xl border border-slate-200 bg-white px-4 py-2">
                <p class="text-xs text-slate-500">Tenant</p>
                <p class="text-sm font-bold text-slate-950">
                  {{ form.tenantName || tenantDisplayName }}
                </p>
              </div>
            </div>
          </div>
        </header>

        <!-- Hero -->
        <section class="mb-5 overflow-hidden rounded-[2rem] bg-slate-950 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
          <div class="relative p-5 text-white sm:p-7 lg:p-8">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,197,94,.32),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(16,185,129,.22),transparent_30%)]"></div>

            <div class="relative grid gap-6 lg:grid-cols-[1fr_280px] lg:items-end">
              <div>
                <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-green-100">
                  <span class="h-1.5 w-1.5 rounded-full bg-green-400"></span>
                  Obayan Payment
                </div>

                <h2 class="max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
                  Pembayaran langganan Obayan jadi lebih mudah dan cepat
                </h2>

                <p class="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                  {{ withoutPayment
                    ? 'Mode demo aktif: invoice akan dibuat tanpa membuka Midtrans, lalu otomatis tersimpan sebagai PDF dan JPG.'
                    : 'Form ini membantu membuat invoice dan kontrak layanan Obayan dengan lebih rapi.' }}
                </p>
              </div>

              <div class="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p class="text-xs font-medium text-slate-300">Link tenant</p>
                <p class="mt-1 truncate text-sm font-bold text-white">
                  /{{ tenantSlug }}
                </p>

                <div class="mt-4 rounded-2xl bg-white/10 p-3">
                  <p class="text-xs text-slate-300">Rekomendasi</p>
                  <p class="mt-1 text-sm font-bold text-green-200">
                    Tahunan lebih hemat 2 bulan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Stepper -->
        <nav class="mb-5 grid gap-2 rounded-[1.6rem] border border-white/80 bg-white/85 p-2 shadow-sm backdrop-blur sm:grid-cols-3">
          <button
            v-for="item in steps"
            :key="item.value"
            type="button"
            class="group flex items-center gap-3 rounded-[1.25rem] px-4 py-3 text-left transition"
            :class="step === item.value ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'text-slate-600 hover:bg-slate-50'"
            @click="goToStep(item.value)"
          >
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-black"
              :class="step === item.value ? 'bg-white text-green-700' : 'bg-slate-100 text-slate-500 group-hover:bg-white'"
            >
              {{ item.value }}
            </span>

            <span>
              <span
                class="block text-sm font-black"
                :class="step === item.value ? 'text-white' : 'text-slate-950'"
              >
                {{ item.title }}
              </span>
              <span
                class="block text-xs"
                :class="step === item.value ? 'text-green-100' : 'text-slate-500'"
              >
                {{ item.subtitle }}
              </span>
            </span>
          </button>
        </nav>

        <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <!-- Main card -->
          <section class="rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-[0_24px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6 lg:p-7">
            <!-- STEP 1 -->
            <div v-if="step === 1" class="space-y-7">
              <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 class="text-2xl font-black tracking-tight">Data pemesan</h3>
                  <p class="mt-1 text-sm text-slate-500">
                    Isi data PIC yang akan menerima invoice dan akses aktivasi.
                  </p>
                </div>

                <span class="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  Langkah 1 dari 3
                </span>
              </div>

              <div class="rounded-[1.6rem] border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
                <div class="grid gap-4">
                  <div>
                    <label class="mb-1.5 block text-sm font-bold text-slate-800">Nama lembaga</label>
                    <input
                      v-model="form.tenantName"
                      type="text"
                      placeholder="Misalnya: Pondok Pesantren Al Inayah"
                      :class="inputClass(errors.tenantName)"
                      @blur="touch('tenantName')"
                    >
                    <p v-if="errors.tenantName" class="mt-1.5 text-xs font-semibold text-red-600">{{ errors.tenantName }}</p>
                    <p v-else class="mt-1.5 text-xs leading-5 text-slate-500">Nama ini akan muncul di invoice.</p>
                  </div>

                  <div class="grid gap-4 md:grid-cols-3">
                    <div>
                      <label class="mb-1.5 block text-sm font-bold text-slate-800">Nama PIC</label>
                      <input
                        v-model="form.picName"
                        type="text"
                        placeholder="Misalnya: Bu Indah"
                        :class="inputClass(errors.picName)"
                        @blur="touch('picName')"
                      >
                      <p v-if="errors.picName" class="mt-1.5 text-xs font-semibold text-red-600">{{ errors.picName }}</p>
                    </div>

                    <div>
                      <label class="mb-1.5 block text-sm font-bold text-slate-800">Jabatan</label>
                      <input
                        v-model="form.picPosition"
                        type="text"
                        placeholder="Misalnya: Bendahara"
                        :class="inputClass(errors.picPosition)"
                        @blur="touch('picPosition')"
                      >
                      <p v-if="errors.picPosition" class="mt-1.5 text-xs font-semibold text-red-600">{{ errors.picPosition }}</p>
                    </div>

                    <div>
                      <label class="mb-1.5 block text-sm font-bold text-slate-800">WhatsApp</label>
                      <input
                        v-model="form.picWhatsapp"
                        type="tel"
                        inputmode="tel"
                        placeholder="Contoh: 0822-3264-7500"
                        :class="inputClass(errors.picWhatsapp)"
                        @blur="touch('picWhatsapp')"
                      >
                      <p v-if="errors.picWhatsapp" class="mt-1.5 text-xs font-semibold text-red-600">{{ errors.picWhatsapp }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Package -->
              <div class="space-y-4">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 class="text-2xl font-black tracking-tight">Pilih paket</h3>
                    <p class="mt-1 text-sm text-slate-500">
                      Harga sudah pakai promo launching.
                    </p>
                  </div>

                  <div
                    v-if="requiresSantriCount"
                    class="w-full rounded-[1.4rem] border border-green-100 bg-green-50 p-3 sm:w-64"
                  >
                    <label class="mb-1.5 block text-sm font-bold text-slate-800">Jumlah santri/siswa</label>
                    <input
                      v-model.number="form.santriCount"
                      type="number"
                      min="0"
                      placeholder="Contoh: 150"
                      :class="inputClass(errors.santriCount)"
                      @blur="touch('santriCount')"
                    >
                    <p v-if="errors.santriCount" class="mt-1.5 text-xs font-semibold text-red-600">{{ errors.santriCount }}</p>
                  </div>
                </div>

                <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
                  <button
                    v-for="pkg in packageList"
                    :key="pkg.id"
                    type="button"
                    class="group relative overflow-hidden rounded-[1.5rem] border bg-white p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)]"
                    :class="packageCardClass(pkg.id)"
                    @click="selectPackage(pkg.id)"
                  >
                    <div class="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <p class="text-base font-black text-slate-950">
                          {{ pkg.name }}
                        </p>
                        <p class="mt-0.5 text-xs font-semibold text-slate-500">
                          {{ pkg.subtitle }}
                        </p>
                      </div>

                      <span
                        class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border"
                        :class="form.packageId === pkg.id ? 'border-green-600 bg-green-600 text-white' : 'border-slate-200 bg-white text-transparent'"
                      >
                        <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clip-rule="evenodd" />
                        </svg>
                      </span>
                    </div>

                    <div class="space-y-1">
                      <p class="text-xs font-bold text-slate-400 line-through">
                        {{ formatIDR(pkg.regularMonthlyPrice) }}
                      </p>

                      <p class="text-xl font-black tracking-tight text-slate-950">
                        {{ formatIDR(pkg.baseMonthlyPrice) }}
                      </p>

                      <p class="text-xs text-slate-500">
                        {{ pkg.isOneTime ? 'one-time' : '/ bulan' }}
                        <span v-if="pkg.perSantriPrice > 0">
                          + {{ formatIDR(pkg.perSantriPrice) }}/santri
                        </span>
                      </p>
                    </div>

                    <div class="mt-4 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700">
                      {{ pkg.promoLabel }}
                    </div>

                    <ul class="mt-4 space-y-2">
                      <li
                        v-for="feature in pkg.features.slice(0, 3)"
                        :key="feature"
                        class="flex gap-2 text-xs leading-5 text-slate-600"
                      >
                        <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500"></span>
                        <span>{{ feature }}</span>
                      </li>
                    </ul>
                  </button>
                </div>
              </div>

              <!-- Duration -->
              <div class="grid gap-3 md:grid-cols-2">
                <label
                  class="cursor-pointer rounded-[1.5rem] border bg-white p-4 transition hover:shadow-sm"
                  :class="form.duration === 'monthly' ? 'border-green-500 bg-green-50 ring-4 ring-green-100' : 'border-slate-200'"
                >
                  <input
                    v-model="form.duration"
                    type="radio"
                    value="monthly"
                    class="sr-only"
                    :disabled="selectedPackage.isOneTime"
                  >

                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <p class="font-black text-slate-950">Bulanan</p>
                      <p class="mt-1 text-sm text-slate-500">Mulai dulu, fleksibel.</p>
                    </div>

                    <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      Flexible
                    </span>
                  </div>
                </label>

                <label
                  class="cursor-pointer rounded-[1.5rem] border bg-white p-4 transition hover:shadow-sm"
                  :class="form.duration === 'yearly' ? 'border-green-500 bg-green-50 ring-4 ring-green-100' : 'border-slate-200'"
                >
                  <input
                    v-model="form.duration"
                    type="radio"
                    value="yearly"
                    class="sr-only"
                    :disabled="selectedPackage.isOneTime"
                  >

                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <p class="font-black text-slate-950">Tahunan</p>
                      <p class="mt-1 text-sm text-slate-500">{{ yearlyDurationDescription }}</p>
                    </div>

                    <span class="rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
                      Hemat
                    </span>
                  </div>
                </label>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-bold text-slate-800">Mulai kontrak</label>
                  <input
                    v-model="form.contractStart"
                    type="date"
                    :class="inputClass(errors.contractStart)"
                    @blur="touch('contractStart')"
                  >
                  <p v-if="errors.contractStart" class="mt-1.5 text-xs font-semibold text-red-600">{{ errors.contractStart }}</p>
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-bold text-slate-800">Berakhir kontrak</label>
                  <input
                    v-model="form.contractEnd"
                    type="date"
                    readonly
                    class="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-500 outline-none"
                  >
                  <p class="mt-1.5 text-xs leading-5 text-slate-500">Terisi otomatis.</p>
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-bold text-slate-800">Catatan tambahan</label>
                <textarea
                  v-model="form.requestNote"
                  rows="3"
                  placeholder="Misalnya: mau request import Excel, custom laporan, atau integrasi WhatsApp."
                  class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                ></textarea>
                <p class="mt-1.5 text-xs leading-5 text-slate-500">Opsional. Request di luar paket akan dianalisis terpisah.</p>
              </div>

              <div
                v-if="errors.general"
                class="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700"
              >
                {{ errors.general }}
              </div>

              <div class="flex justify-end">
                <button
                  type="button"
                  class="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-green-600/20 transition hover:-translate-y-0.5 hover:bg-green-700"
                  @click="nextToTerms"
                >
                  Lanjut
                  <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 10a1 1 0 0 1 1-1h9.59l-3.3-3.3a1 1 0 1 1 1.42-1.4l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.42-1.4l3.3-3.3H4a1 1 0 0 1-1-1Z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- STEP 2 -->
            <div v-else-if="step === 2" class="space-y-6">
              <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 class="text-2xl font-black tracking-tight">Terms & Conditions</h3>
                  <p class="mt-1 text-sm text-slate-500">
                    Baca ringkasannya, lalu setujui sebelum pembayaran.
                  </p>
                </div>

                <span class="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  Langkah 2 dari 3
                </span>
              </div>

              <div class="rounded-[1.6rem] border border-slate-100 bg-slate-50 p-3">
                <div class="max-h-[540px] space-y-2 overflow-y-auto pr-1">
                  <details
                    v-for="(term, index) in OBAYAN_TERMS_SECTIONS"
                    :key="term.title"
                    class="group rounded-2xl border border-slate-100 bg-white p-4 open:shadow-sm"
                    :open="index < 3"
                  >
                    <summary class="flex cursor-pointer list-none items-center justify-between gap-4">
                      <span class="font-black text-slate-950">{{ term.title }}</span>

                      <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-open:rotate-180">
                        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M5.2 7.2a1 1 0 0 1 1.4 0L10 10.6l3.4-3.4a1 1 0 1 1 1.4 1.4l-4.1 4.1a1 1 0 0 1-1.4 0L5.2 8.6a1 1 0 0 1 0-1.4Z" clip-rule="evenodd" />
                        </svg>
                      </span>
                    </summary>

                    <p class="mt-3 text-sm leading-6 text-slate-600">
                      {{ term.body }}
                    </p>
                  </details>
                </div>
              </div>

              <label
                class="flex cursor-pointer gap-4 rounded-[1.5rem] border p-4 transition"
                :class="errors.termsAccepted ? 'border-red-200 bg-red-50' : form.termsAccepted ? 'border-green-500 bg-green-50 ring-4 ring-green-100' : 'border-slate-200 bg-white hover:bg-slate-50'"
              >
                <input
                  v-model="form.termsAccepted"
                  type="checkbox"
                  class="mt-1 h-5 w-5 rounded border-slate-300 text-green-600 focus:ring-green-500"
                  @change="touch('termsAccepted')"
                >

                <span>
                  <span class="block text-sm font-black text-slate-950">
                    Saya setuju dengan ketentuan layanan Obayan.
                  </span>
                  <span class="mt-1 block text-sm leading-6 text-slate-500">
                    Saya memahami bahwa request di luar paket akan dibahas sebagai pekerjaan tambahan.
                  </span>
                  <span v-if="errors.termsAccepted" class="mt-2 block text-xs font-semibold text-red-600">
                    {{ errors.termsAccepted }}
                  </span>
                </span>
              </label>

              <div
                v-if="errors.general"
                class="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700"
              >
                {{ errors.general }}
              </div>

              <div
                v-if="paymentFallbackMessage"
                class="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-800"
              >
                {{ paymentFallbackMessage }}
              </div>

              <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  class="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                  @click="step = 1"
                >
                  Kembali
                </button>

                <button
                  type="button"
                  class="rounded-2xl bg-green-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-green-600/20 transition hover:-translate-y-0.5 hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                  :disabled="!form.termsAccepted"
                  @click="nextToPayment"
                >
                  Lanjut invoice
                </button>
              </div>
            </div>

            <!-- STEP 3 -->
            <div v-else class="space-y-6">
              <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 class="text-2xl font-black tracking-tight">Invoice & pembayaran</h3>
                  <p class="mt-1 text-sm text-slate-500">
                    Cek ringkasan tagihan sebelum generate invoice.
                  </p>
                </div>

                <span class="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  Langkah 3 dari 3
                </span>
              </div>

              <div class="overflow-hidden rounded-[1.6rem] border border-slate-100 bg-white shadow-sm">
                <div class="bg-slate-950 p-5 text-white">
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p class="text-xs font-bold uppercase tracking-[0.2em] text-green-300">
                        Invoice
                      </p>
                      <h4 class="mt-2 text-2xl font-black">
                        {{ currentInvoice?.invoiceNo || 'Preview invoice' }}
                      </h4>
                    </div>

                    <span
                      class="w-fit rounded-full px-3 py-1 text-xs font-black"
                      :class="statusClass"
                    >
                      {{ currentInvoice?.status || 'draft' }}
                    </span>
                  </div>
                </div>

                <div class="grid gap-3 p-4 md:grid-cols-2">
                  <div class="rounded-3xl bg-slate-50 p-4">
                    <p class="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                      Ditagihkan kepada
                    </p>
                    <p class="mt-3 font-black text-slate-950">{{ form.tenantName }}</p>
                    <p class="mt-1 text-sm text-slate-500">{{ form.picName }} · {{ form.picPosition }}</p>
                    <p class="text-sm text-slate-500">{{ form.picWhatsapp }}</p>
                  </div>

                  <div class="rounded-3xl bg-green-50 p-4">
                    <p class="text-xs font-bold uppercase tracking-[0.16em] text-green-700">
                      Kontrak
                    </p>
                    <div class="mt-3 space-y-1 text-sm text-slate-700">
                      <p>Mulai: <b>{{ form.contractStart }}</b></p>
                      <p>Berakhir: <b>{{ form.contractEnd }}</b></p>
                      <p>Durasi: <b>{{ pricing.durationLabel }}</b></p>
                    </div>
                  </div>
                </div>

                <div class="border-t border-slate-100 p-4">
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p class="text-lg font-black">
                        {{ selectedPackage.name }}
                      </p>
                      <p class="mt-1 text-sm text-slate-500">
                        {{ selectedPackage.subtitle }}
                      </p>
                      <p v-if="requiresSantriCount" class="mt-1 text-xs font-semibold text-slate-500">
                        {{ form.santriCount }} santri/siswa
                      </p>
                    </div>

                    <p class="text-xl font-black text-green-700">
                      {{ formatIDR(pricing.total) }}
                    </p>
                  </div>

                  <div class="mt-4 rounded-3xl bg-slate-50 p-4">
                    <PriceLine label="Harga normal" :value="formatIDR(pricing.regularSubtotal)" muted />
                    <PriceLine label="Subtotal promo" :value="formatIDR(pricing.subtotal)" />

                    <PriceLine
                      v-if="pricing.launchingDiscount > 0"
                      label="Diskon launching"
                      :value="`-${formatIDR(pricing.launchingDiscount)}`"
                      success
                    />

                    <PriceLine
                      v-if="pricing.yearlyDiscount > 0"
                      label="Diskon tahunan"
                      :value="`-${formatIDR(pricing.yearlyDiscount)}`"
                      success
                    />

                    <div class="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                      <span class="font-black text-slate-950">Total</span>
                      <span class="text-2xl font-black text-green-700">
                        {{ formatIDR(pricing.total) }}
                      </span>
                    </div>
                  </div>

                  <div
                    v-if="currentInvoice"
                    class="mt-4 rounded-3xl border border-green-100 bg-green-50 p-4 text-sm leading-6 text-green-800"
                  >
                    Invoice sudah dibuat. Kamu bisa membuka preview, save PDF, atau save JPG.
                  </div>
                </div>
              </div>

              <div
                v-if="errors.general"
                class="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700"
              >
                {{ errors.general }}
              </div>

              <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  class="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                  @click="step = 2"
                >
                  Kembali
                </button>

                <div class="flex flex-col gap-3 sm:flex-row">
                  <button
                    v-if="currentInvoice"
                    type="button"
                    class="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                    @click="invoiceModalOpen = true"
                  >
                    Lihat Invoice
                  </button>

                  <button
                    type="button"
                    class="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-green-600/20 transition hover:-translate-y-0.5 hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                    :disabled="submitting || exporting"
                    @click="generateInvoiceAndPay"
                  >
                    <svg v-if="submitting" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
                    </svg>

                    {{ submitting
                      ? 'Sedang membuat invoice...'
                      : withoutPayment
                        ? 'Generate invoice tanpa payment'
                        : currentInvoice
                          ? 'Bayar sekarang'
                          : 'Generate invoice & bayar' }}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- Sidebar summary -->
          <aside class="h-fit rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-[0_24px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:sticky lg:top-5">
            <div class="rounded-[1.6rem] bg-slate-950 p-5 text-white">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-bold uppercase tracking-[0.2em] text-green-300">
                    Ringkasan
                  </p>
                  <h3 class="mt-2 text-xl font-black">{{ selectedPackage.name }}</h3>
                  <p class="mt-1 text-sm text-slate-300">{{ selectedPackage.subtitle }}</p>
                </div>

                <span class="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-green-100">
                  {{ selectedPackage.badge }}
                </span>
              </div>

              <div class="mt-5 rounded-3xl bg-white/10 p-4">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-300">Normal</span>
                  <span class="font-semibold text-slate-300 line-through">
                    {{ formatIDR(pricing.regularMonthlyUnitPrice) }}
                  </span>
                </div>

                <div class="mt-2 flex items-end justify-between gap-3">
                  <span class="text-sm text-slate-300">Promo</span>
                  <span class="text-2xl font-black">
                    {{ formatIDR(pricing.monthlyUnitPrice) }}
                  </span>
                </div>

                <p class="mt-1 text-right text-xs text-slate-400">
                  {{ selectedPackage.isOneTime ? 'one-time payment' : '/ bulan' }}
                </p>
              </div>
            </div>

            <div class="mt-5 space-y-3">
              <PriceLine label="Subtotal promo" :value="formatIDR(pricing.subtotal)" />

              <PriceLine
                v-if="pricing.launchingDiscount > 0"
                label="Diskon launching"
                :value="`-${formatIDR(pricing.launchingDiscount)}`"
                success
              />

              <PriceLine
                v-if="pricing.yearlyDiscount > 0"
                label="Diskon tahunan"
                :value="`-${formatIDR(pricing.yearlyDiscount)}`"
                success
              />

              <div class="flex items-center justify-between rounded-3xl bg-green-50 p-4">
                <span class="font-black text-slate-950">Total</span>
                <span class="text-xl font-black text-green-700">
                  {{ formatIDR(pricing.total) }}
                </span>
              </div>
            </div>

            <div
              v-if="withoutPayment"
              class="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-4"
            >
              <p class="text-sm font-black text-amber-800">
                Mode tanpa payment
              </p>
              <p class="mt-1 text-sm leading-6 text-amber-700">
                Invoice akan otomatis dibuat sebagai paid/demo, disimpan, lalu diunduh PDF dan JPG.
              </p>
            </div>

            <div class="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p class="text-sm font-black text-slate-950">
                Info kecil
              </p>
              <p class="mt-1 text-sm leading-6 text-slate-500">
                Request tambahan tetap bisa diajukan, tapi akan dibuatkan estimasi terpisah agar scope tetap rapi.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- Invoice Modal -->
    <Teleport to="body">
      <div v-if="invoiceModalOpen && currentInvoice" class="fixed inset-0 z-[120] overflow-y-auto bg-slate-950/70 px-4 py-8 backdrop-blur-sm">
        <div class="mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
          <div class="flex flex-col gap-3 bg-slate-950 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-green-300">
                Invoice Preview
              </p>
              <h3 class="mt-1 text-xl font-black">
                {{ currentInvoice.invoiceNo }}
              </h3>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="rounded-2xl bg-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white/20 disabled:opacity-60"
                :disabled="exporting"
                @click="downloadInvoicePdf(false)"
              >
                Save PDF
              </button>

              <button
                type="button"
                class="rounded-2xl bg-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white/20 disabled:opacity-60"
                :disabled="exporting"
                @click="downloadInvoiceJpg(false)"
              >
                Save JPG
              </button>

              <span
                v-if="exporting"
                class="inline-flex items-center rounded-2xl bg-amber-400/15 px-3 py-2 text-xs font-black text-amber-200"
              >
                {{ exportMessage || 'Preparing export...' }}
              </span>

              <button
                type="button"
                class="rounded-2xl bg-white px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-green-100"
                @click="invoiceModalOpen = false"
              >
                Tutup
              </button>
            </div>
          </div>

          <div
            ref="invoiceModalBodyRef"
            class="invoice-modal-scroll max-h-[78vh] overflow-y-auto overscroll-contain bg-slate-100 p-4 sm:p-6"
          >
            <div class="mx-auto w-full max-w-[794px] overflow-hidden rounded-3xl bg-white shadow-xl">
              <InvoiceContent
                :invoice="currentInvoice"
                :form-data="form"
                :selected-package-data="selectedPackage"
                :pricing-data="pricing"
                :requires-santri-count="requiresSantriCount"
              />
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Hidden export area -->
    <div
      v-if="currentInvoice"
      class="invoice-export-wrapper pointer-events-none fixed left-0 top-0 w-[794px] bg-white text-slate-950"
    >
      <div ref="invoiceExportArea" class="bg-white">
        <InvoiceContent
          :invoice="currentInvoice"
          :form-data="form"
          :selected-package-data="selectedPackage"
          :pricing-data="pricing"
          :requires-santri-count="requiresSantriCount"
        />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { ref as dbRef, get } from 'firebase/database'
import {
  OBAYAN_TERMS_SECTIONS,
  type PaymentPackageId,
  type BillingDuration,
  calculateContractEndDate,
  calculateInvoice,
  formatIDR,
  normalizeTenantPricingConfig,
  normalizeYearlyChargedMonths,
  resolvePaymentPackages,
  sanitizeTenantSlug,
  titleCaseTenant,
  todayInputDate
} from '../../../utils/obayanPayment'
import { useSettings } from '~/composables/data/useSettings'
import { usePayment } from '~/composables/data/usePayment'

declare global {
  interface Window {
    snap?: any
  }
}

type StepValue = 1 | 2 | 3

type ErrorKey =
  | 'tenantName'
  | 'picName'
  | 'picPosition'
  | 'picWhatsapp'
  | 'santriCount'
  | 'contractStart'
  | 'termsAccepted'
  | 'general'

const route = useRoute()
const runtime = useRuntimeConfig()
const { $realtimeDb } = useNuxtApp() as any

const tenantChecking = ref(true)
const tenantReady = ref(false)
const tenantMissingReason = ref('')
const tenantCheckError = ref('')

const rawTenant = computed(() => String(route.params.tenant || 'obayan'))
const tenantSlug = computed(() => sanitizeTenantSlug(rawTenant.value))

const withoutPayment = computed(() => {
  const value = (runtime.public as any).withoutPayment

  return value === true || value === 'true' || value === '1'
})

const invoiceExportArea = ref<HTMLElement | null>(null)
const invoiceModalBodyRef = ref<HTMLElement | null>(null)
const invoiceModalOpen = ref(false)
const exporting = ref(false)
const exportMessage = ref('')
const paymentFallbackMessage = ref('')

const downloadedInvoiceKeys = ref<Set<string>>(new Set())

const { settings, load: loadSettings } = useSettings({
  path: `/${tenantSlug.value}/settings`,
  debounceMs: 900
})

const {
  createInvoice,
  updateInvoiceStatus,
  activateTenantSubscription
} = usePayment(tenantSlug.value)

const steps = [
  { value: 1 as StepValue, title: 'Data & Paket', subtitle: 'PIC, paket, kontrak' },
  { value: 2 as StepValue, title: 'Terms', subtitle: 'Persetujuan layanan' },
  { value: 3 as StepValue, title: 'Payment', subtitle: 'Invoice & modal' }
]

const step = ref<StepValue>(1)
const submitting = ref(false)

const form = reactive({
  tenantName: titleCaseTenant(tenantSlug.value),
  picName: '',
  picPosition: '',
  picWhatsapp: '',
  packageId: 'standard' as PaymentPackageId,
  duration: 'yearly' as BillingDuration,
  santriCount: 0,
  requestNote: '',
  contractStart: todayInputDate(),
  contractEnd: '',
  termsAccepted: false
})

const touched = reactive<Record<ErrorKey, boolean>>({
  tenantName: false,
  picName: false,
  picPosition: false,
  picWhatsapp: false,
  santriCount: false,
  contractStart: false,
  termsAccepted: false,
  general: false
})

const errors = reactive<Record<ErrorKey, string>>({
  tenantName: '',
  picName: '',
  picPosition: '',
  picWhatsapp: '',
  santriCount: '',
  contractStart: '',
  termsAccepted: '',
  general: ''
})

const currentInvoice = ref<any | null>(null)

const tenantPricingConfig = computed(() => {
  return normalizeTenantPricingConfig((settings.value as any)?.pricing)
})

const yearlyChargedMonths = computed(() => {
  return normalizeYearlyChargedMonths(tenantPricingConfig.value.yearlyChargedMonths)
})

const paymentPackages = computed(() => resolvePaymentPackages(tenantPricingConfig.value))
const packageList = computed(() => {
  const packages = Object.values(paymentPackages.value)
  const enabledPackages = packages.filter((pkg) => pkg.enabled !== false)

  return enabledPackages.length ? enabledPackages : packages
})
const selectedPackage = computed(() => {
  return paymentPackages.value[form.packageId] || packageList.value[0] || paymentPackages.value.standard
})
const requiresSantriCount = computed(() => selectedPackage.value.perSantriPrice > 0)
const yearlyDurationDescription = computed(() => {
  return `Bayar ${yearlyChargedMonths.value} bulan, aktif 12 bulan.`
})

const pricing = computed(() => {
  return calculateInvoice({
    packageId: form.packageId,
    duration: form.duration,
    santriCount: form.santriCount,
    packages: paymentPackages.value,
    yearlyChargedMonths: yearlyChargedMonths.value
  })
})

const tenantDisplayName = computed(() => {
  const s = settings.value as any

  return (
    s.clientDisplayName ||
    s.appName ||
    s.siteName ||
    s.name ||
    titleCaseTenant(tenantSlug.value)
  )
})

const pageUrl = computed(() => {
  const siteUrl = String(
    (runtime.public as any).siteUrl ||
    (runtime.public as any).appUrl ||
    'https://obayan.id'
  ).replace(/\/$/, '')

  return `${siteUrl}${route.fullPath}`
})

const seoTitle = computed(() => {
  return `Aktivasi Langganan ${tenantDisplayName.value} | Obayan Payment`
})

const seoDescription = computed(() => {
  return `Halaman aktivasi langganan Obayan untuk ${tenantDisplayName.value}. Pilih paket, setujui ketentuan layanan, lalu lanjutkan pembayaran dengan aman.`
})

const seoImage = computed(() => {
  const s = settings.value as any

  return (
    s.ogImage ||
    s.appLogo ||
    s.logo ||
    s.siteLogo ||
    '/favicon.png'
  )
})

const faviconUrl = computed(() => {
  const s = settings.value as any

  return (
    s.favicon ||
    s.favIcon ||
    s.appIcon ||
    s.appLogo ||
    '/favicon.ico'
  )
})

useHead(() => ({
  htmlAttrs: {
    lang: 'id'
  },

  title: seoTitle.value,

  meta: [
    { name: 'description', content: seoDescription.value },
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'theme-color', content: '#16a34a' },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: seoTitle.value },
    { property: 'og:description', content: seoDescription.value },
    { property: 'og:url', content: pageUrl.value },
    { property: 'og:image', content: seoImage.value },
    { property: 'og:site_name', content: 'Obayan' },
    { property: 'og:locale', content: 'id_ID' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seoTitle.value },
    { name: 'twitter:description', content: seoDescription.value },
    { name: 'twitter:image', content: seoImage.value }
  ],

  link: [
    { rel: 'canonical', href: pageUrl.value },
    { rel: 'icon', type: 'image/x-icon', href: faviconUrl.value },
    { rel: 'shortcut icon', href: faviconUrl.value },
    { rel: 'apple-touch-icon', href: faviconUrl.value }
  ]
}))

const statusClass = computed(() => {
  const status = currentInvoice.value?.status

  if (status === 'paid') return 'bg-green-100 text-green-700'
  if (status === 'demo_paid') return 'bg-amber-100 text-amber-700'
  if (status === 'failed' || status === 'expired' || status === 'cancelled') return 'bg-red-100 text-red-700'
  if (status === 'pending') return 'bg-amber-100 text-amber-700'

  return 'bg-white/10 text-slate-200'
})

watch(
  packageList,
  (packages) => {
    if (packages.some((pkg) => pkg.id === form.packageId)) return

    form.packageId = packages[0]?.id || 'standard'
  },
  { immediate: true }
)

watch(
  () => settings.value,
  () => {
    if (!tenantReady.value) return

    if (!form.tenantName || form.tenantName === titleCaseTenant(tenantSlug.value)) {
      form.tenantName = tenantDisplayName.value
    }
  },
  { deep: true, immediate: true }
)

watch(
  () => [form.contractStart, form.duration, form.packageId],
  () => {
    if (selectedPackage.value.isOneTime) {
      form.duration = 'yearly'
    }

    form.contractEnd = calculateContractEndDate({
      startDate: form.contractStart,
      duration: form.duration,
      packageId: form.packageId
    })
  },
  { immediate: true }
)

watch(
  () => ({ ...form }),
  () => {
    validateTouchedFields()
    currentInvoice.value = null
  },
  { deep: true }
)

onMounted(() => {
  checkTenantAndSettings()
})

async function checkTenantAndSettings() {
  tenantChecking.value = true
  tenantReady.value = false
  tenantMissingReason.value = ''
  tenantCheckError.value = ''

  try {
    if (!$realtimeDb) {
      tenantCheckError.value = 'Koneksi database belum siap. Coba refresh halaman beberapa saat lagi.'
      return
    }

    const tenantPath = tenantSlug.value
    const settingsPath = `${tenantPath}/settings`

    const [tenantSnap, settingsSnap] = await Promise.all([
      get(dbRef($realtimeDb, tenantPath)),
      get(dbRef($realtimeDb, settingsPath))
    ])

    if (!tenantSnap.exists()) {
      tenantMissingReason.value = `Tenant "${tenantSlug.value}" belum terdaftar di sistem Obayan.`
      return
    }

    if (!settingsSnap.exists()) {
      tenantMissingReason.value = `Tenant "${tenantSlug.value}" sudah ada, tapi data settings belum tersedia.`
      return
    }

    tenantReady.value = true
    loadSettings()
  } catch (error: any) {
    tenantCheckError.value =
      error?.message ||
      'Kami belum bisa memeriksa data tenant saat ini. Coba refresh halaman beberapa saat lagi.'
  } finally {
    tenantChecking.value = false
  }
}

function touch(field: ErrorKey) {
  touched[field] = true
  validateField(field)
}

function inputClass(error?: string) {
  return [
    'w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400',
    error
      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
      : 'border-slate-200 focus:border-green-500 focus:ring-4 focus:ring-green-100'
  ].join(' ')
}

function packageCardClass(id: PaymentPackageId) {
  if (form.packageId === id) {
    return 'border-green-500 bg-green-50/60 ring-4 ring-green-100'
  }

  return 'border-slate-200'
}

function selectPackage(id: PaymentPackageId) {
  form.packageId = id

  if (paymentPackages.value[id]?.isOneTime) {
    form.duration = 'yearly'
  }

  validateTouchedFields()
}

function validatePhone(value: string) {
  const clean = String(value || '').replace(/[^\d+]/g, '')
  return /^(08|\+?628)\d{7,12}$/.test(clean)
}

function validateField(field: ErrorKey) {
  if (field === 'tenantName') {
    errors.tenantName = form.tenantName.trim()
      ? ''
      : 'Nama tenant belum terisi. Contoh: Pondok Pesantren Al Inayah.'
  }

  if (field === 'picName') {
    errors.picName = form.picName.trim().length >= 3
      ? ''
      : 'Nama PIC minimal 3 karakter ya.'
  }

  if (field === 'picPosition') {
    errors.picPosition = form.picPosition.trim()
      ? ''
      : 'Jabatan PIC wajib diisi, misalnya Bendahara atau Admin Yayasan.'
  }

  if (field === 'picWhatsapp') {
    errors.picWhatsapp = validatePhone(form.picWhatsapp)
      ? ''
      : 'Nomor WhatsApp belum valid. Gunakan format 08xx atau 628xx.'
  }

  if (field === 'santriCount') {
    errors.santriCount = requiresSantriCount.value && Number(form.santriCount || 0) <= 0
      ? 'Masukkan jumlah santri/siswa agar invoice lebih akurat.'
      : ''
  }

  if (field === 'contractStart') {
    errors.contractStart = form.contractStart && form.contractEnd
      ? ''
      : 'Tanggal kontrak belum lengkap.'
  }

  if (field === 'termsAccepted') {
    errors.termsAccepted = form.termsAccepted
      ? ''
      : 'Terms & Conditions wajib disetujui sebelum pembayaran.'
  }
}

function validateTouchedFields() {
  ;(Object.keys(touched) as ErrorKey[]).forEach((key) => {
    if (touched[key]) validateField(key)
  })
}

function validateStepOne() {
  errors.general = ''

  const fields: ErrorKey[] = [
    'tenantName',
    'picName',
    'picPosition',
    'picWhatsapp',
    'contractStart'
  ]

  if (requiresSantriCount.value) fields.push('santriCount')

  fields.forEach((field) => {
    touched[field] = true
    validateField(field)
  })

  const hasError = fields.some((field) => Boolean(errors[field]))

  if (hasError) {
    errors.general = 'Ada data yang perlu dicek lagi. Lihat field yang berwarna merah ya.'
    return false
  }

  return true
}

function nextToTerms() {
  if (!validateStepOne()) return

  errors.general = ''
  step.value = 2
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function nextToPayment() {
  errors.general = ''
  touched.termsAccepted = true
  validateField('termsAccepted')

  if (errors.termsAccepted) {
    errors.general = 'Setujui Terms & Conditions terlebih dahulu sebelum lanjut invoice.'
    return
  }

  step.value = 3
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function goToStep(target: StepValue) {
  if (target === 1) {
    step.value = 1
    return
  }

  if (target === 2) {
    if (!validateStepOne()) return
    step.value = 2
    return
  }

  if (target === 3) {
    if (!validateStepOne()) return
    nextToPayment()
  }
}

function loadSnapScript() {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') return resolve()

    if (window.snap) {
      resolve()
      return
    }

    const clientKey = String(runtime.public.midtransClientKey || '')

    if (!clientKey) {
      reject(new Error('NUXT_PUBLIC_MIDTRANS_CLIENT_KEY belum diset di .env'))
      return
    }

    const isProduction = Boolean(runtime.public.midtransIsProduction)
    const src = isProduction
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js'

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)

    if (existing) {
      existing.onload = () => resolve()
      existing.onerror = () => reject(new Error('Gagal memuat Snap JS Midtrans'))
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.setAttribute('data-client-key', clientKey)
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Gagal memuat Snap JS Midtrans'))
    document.body.appendChild(script)
  })
}

function makeOrderId() {
  const now = Date.now()
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()

  return `OBY-${tenantSlug.value}-${now}-${random}`
}

function makeInvoiceNo(orderId: string) {
  const date = new Date()
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')

  return `INV/${tenantSlug.value.toUpperCase()}/${yyyy}${mm}${dd}/${orderId.slice(-6)}`
}

function buildInvoicePayload(status: 'waiting_payment' | 'paid' | 'demo_paid') {
  const orderId = makeOrderId()
  const invoiceNo = makeInvoiceNo(orderId)
  const now = Date.now()

  return {
    id: orderId,
    orderId,
    invoiceNo,
    tenant: tenantSlug.value,
    tenantName: form.tenantName,
    picName: form.picName,
    picPosition: form.picPosition,
    picWhatsapp: form.picWhatsapp,
    packageId: form.packageId,
    packageName: selectedPackage.value.name,
    packageSubtitle: selectedPackage.value.subtitle,
    duration: form.duration,
    durationLabel: pricing.value.durationLabel,
    santriCount: form.santriCount,
    requestNote: form.requestNote,
    contractStart: form.contractStart,
    contractEnd: form.contractEnd,
    pricing: {
      ...pricing.value
    },
    total: pricing.value.total,
    status,
    createdAt: now,
    updatedAt: now,
    source: withoutPayment.value ? 'without_payment' : 'midtrans',
    midtrans: withoutPayment.value
      ? {
          mode: 'without_payment',
          redirectUrl: '',
          token: ''
        }
      : null
  }
}

async function generateInvoiceAndPay() {
  errors.general = ''
  paymentFallbackMessage.value = ''

  if (!tenantReady.value) {
    errors.general = 'Tenant belum valid, jadi invoice belum bisa dibuat.'
    return
  }

  if (!validateStepOne()) return

  if (!form.termsAccepted) {
    step.value = 2
    nextToPayment()
    return
  }

  if (withoutPayment.value) {
    await generateWithoutPayment()
    return
  }

  await generateWithMidtrans()
}

async function generateWithoutPayment() {
  submitting.value = true
  paymentFallbackMessage.value = ''

  try {
    const invoice = buildInvoicePayload('demo_paid')

    currentInvoice.value = invoice
    invoiceModalOpen.value = true

    await persistInvoiceBestEffort(invoice, {
      status: 'paid',
      paymentResult: {
        source: 'without_payment',
        mode: 'demo',
        paidAt: Date.now()
      },
      activate: true
    })

    currentInvoice.value.status = 'paid'

    await autoExportPaidInvoice()
  } catch (error: any) {
    errors.general =
      error?.data?.message ||
      error?.statusMessage ||
      error?.message ||
      'Invoice tanpa payment belum bisa dibuat.'
  } finally {
    submitting.value = false
  }
}

async function generateWithMidtrans() {
  submitting.value = true
  paymentFallbackMessage.value = ''

  try {
    const response = await $fetch<any>('/api/payments/midtrans/create', {
      method: 'POST',
      body: {
        tenant: tenantSlug.value,
        tenantName: form.tenantName,
        picName: form.picName,
        picPosition: form.picPosition,
        picWhatsapp: form.picWhatsapp,
        packageId: form.packageId,
        duration: form.duration,
        santriCount: form.santriCount,
        requestNote: form.requestNote,
        contractStart: form.contractStart,
        contractEnd: form.contractEnd
      }
    })

    currentInvoice.value = response.invoice
    invoiceModalOpen.value = true

    await persistInvoiceBestEffort(response.invoice)
    await loadSnapScript()

    window.snap.pay(response.midtrans.token, {
      onSuccess: async (result: unknown) => {
        currentInvoice.value.status = 'paid'
        currentInvoice.value.paymentResult = result

        await updateInvoiceStatus(response.orderId, 'paid', result)
        await activateTenantSubscription(response.invoice, result)

        try {
          await autoExportPaidInvoice()
        } catch (downloadError) {
          console.error('Gagal auto download invoice:', downloadError)
          errors.general = 'Pembayaran berhasil, tapi invoice belum berhasil diunduh otomatis. Silakan gunakan tombol Save PDF/JPG.'
        }
      },

      onPending: async (result: unknown) => {
        currentInvoice.value.status = 'paid'
        await updateInvoiceStatus(response.orderId, 'paid', result)
      },

      onError: async (result: unknown) => {
        currentInvoice.value.status = 'failed'
        await updateInvoiceStatus(response.orderId, 'failed', result)
      },

      onClose: async () => {
        if (currentInvoice.value?.status === 'waiting_payment') {
          currentInvoice.value.status = 'paid'
          await updateInvoiceStatus(response.orderId, 'paid', {
            source: 'snap_closed_by_customer'
          })
        }
      }
    })
  } catch (error: any) {
    await generateStaticExportInvoice(error)
  } finally {
    submitting.value = false
  }
}

async function persistInvoiceBestEffort(
  invoice: any,
  options: {
    status?: 'waiting_payment' | 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled'
    paymentResult?: unknown
    activate?: boolean
  } = {}
) {
  try {
    await createInvoice(invoice)

    if (options.status) {
      await updateInvoiceStatus(invoice.orderId, options.status, options.paymentResult)
    }

    if (options.activate) {
      await activateTenantSubscription(
        {
          ...invoice,
          status: options.status || invoice.status
        },
        options.paymentResult
      )
    }

    return true
  } catch (error) {
    console.warn('Invoice tidak tersimpan ke database, lanjut export lokal:', error)
    return false
  }
}

async function generateStaticExportInvoice(error: any) {
  const invoice = currentInvoice.value || {
    ...buildInvoicePayload('waiting_payment'),
    source: 'static_export',
    midtrans: {
      mode: 'static_export',
      token: '',
      redirectUrl: '',
      serverError: getPaymentErrorMessage(error)
    }
  }

  currentInvoice.value = invoice
  invoiceModalOpen.value = true

  await persistInvoiceBestEffort(invoice)

  paymentFallbackMessage.value =
    'Server payment/Midtrans tidak tersedia, jadi invoice dibuat secara lokal. PDF dan JPG tetap bisa disimpan dari browser.'

  await autoDownloadInvoiceFiles()
}

function getPaymentErrorMessage(error: any) {
  return (
    error?.data?.message ||
    error?.statusMessage ||
    error?.message ||
    'Server payment tidak tersedia.'
  )
}

async function autoExportPaidInvoice() {
  if (!currentInvoice.value) return

  const status = currentInvoice.value.status
  if (status !== 'paid' && status !== 'demo_paid') return

  const orderId = String(currentInvoice.value.orderId || '')
  if (!orderId) return

  await autoDownloadInvoiceFiles()
}

async function autoDownloadInvoiceFiles() {
  if (!currentInvoice.value) return

  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 500))

  invoiceModalOpen.value = true

  try {
    await downloadInvoicePdf(true)
    await new Promise((resolve) => setTimeout(resolve, 250))
    await downloadInvoiceJpg(true)
  } catch (downloadError) {
    console.error('Gagal auto export invoice:', downloadError)
    paymentFallbackMessage.value =
      'Invoice sudah dibuat. Jika file belum otomatis terunduh, gunakan tombol Save PDF atau Save JPG.'
  }
}

function invoiceFilename(ext: 'pdf' | 'jpg') {
  const base = String(currentInvoice.value?.invoiceNo || 'invoice-obayan')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')

  return `${base}.${ext}`
}

function unlockModalScroll() {
  if (typeof document === 'undefined') return

  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
  document.body.style.pointerEvents = ''
}

async function waitForPaint() {
  await nextTick()
  await new Promise((resolve) => requestAnimationFrame(resolve))
  await new Promise((resolve) => setTimeout(resolve, 80))
}

async function createExportClone() {
  if (!invoiceExportArea.value) return null

  await waitForPaint()

  const clone = invoiceExportArea.value.cloneNode(true) as HTMLElement

  clone.style.width = '794px'
  clone.style.maxWidth = '794px'
  clone.style.minHeight = '1123px'
  clone.style.background = '#ffffff'
  clone.style.color = '#0f172a'
  clone.style.position = 'fixed'
  clone.style.left = '0'
  clone.style.top = '0'
  clone.style.zIndex = '-1'
  clone.style.opacity = '1'
  clone.style.pointerEvents = 'none'
  clone.style.transform = 'none'

  const wrapper = document.createElement('div')
  wrapper.style.position = 'fixed'
  wrapper.style.left = '0'
  wrapper.style.top = '0'
  wrapper.style.width = '794px'
  wrapper.style.background = '#ffffff'
  wrapper.style.zIndex = '-1'
  wrapper.style.opacity = '1'
  wrapper.style.pointerEvents = 'none'
  wrapper.style.transform = 'none'
  wrapper.appendChild(clone)

  document.body.appendChild(wrapper)

  await new Promise((resolve) => requestAnimationFrame(resolve))
  await new Promise((resolve) => setTimeout(resolve, 120))

  return {
    wrapper,
    element: clone
  }
}

function removeExportClone(wrapper?: HTMLElement | null) {
  if (!wrapper) return
  wrapper.remove()
}

async function downloadInvoicePdf(auto = false) {
  if (!currentInvoice.value) {
    errors.general = 'Invoice belum tersedia. Generate invoice terlebih dahulu.'
    return
  }

  const isAuto = auto === true
  const key = `${currentInvoice.value.orderId}:pdf`

  if (isAuto && downloadedInvoiceKeys.value.has(key)) return

  exporting.value = true
  exportMessage.value = 'Membuat PDF...'

  try {
    const { jsPDF } = await import('jspdf')

    const invoice = currentInvoice.value || {}
    const pkg = selectedPackage.value || {}
    const price = pricing.value || {}

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const marginX = 16
    const rightX = pageWidth - marginX

    let y = 18

    const green: [number, number, number] = [22, 163, 74]
    const dark: [number, number, number] = [15, 23, 42]
    const gray: [number, number, number] = [100, 116, 139]
    const slate100: [number, number, number] = [241, 245, 249]
    const slate200: [number, number, number] = [226, 232, 240]
    const white: [number, number, number] = [255, 255, 255]

    function setColor(color: [number, number, number]) {
      pdf.setTextColor(color[0], color[1], color[2])
    }

    function setFill(color: [number, number, number]) {
      pdf.setFillColor(color[0], color[1], color[2])
    }

    function setDraw(color: [number, number, number]) {
      pdf.setDrawColor(color[0], color[1], color[2])
    }

    function cleanText(value: unknown, fallback = '-') {
      const text = String(value ?? '').trim()
      return text || fallback
    }

    function safeMoney(value: unknown) {
      return formatIDR(Number(value || 0))
    }

    function wrapped(text: string, x: number, maxWidth: number, lineHeight = 5.5) {
      const lines = pdf.splitTextToSize(cleanText(text), maxWidth)
      pdf.text(lines, x, y)
      y += lines.length * lineHeight
    }

    function priceLine(
      label: string,
      value: string,
      options: { bold?: boolean; green?: boolean; muted?: boolean } = {}
    ) {
      pdf.setFont('helvetica', options.bold ? 'bold' : 'normal')
      pdf.setFontSize(options.bold ? 11 : 9.5)
      setColor(options.muted ? gray : dark)
      pdf.text(label, 116, y)

      setColor(options.green ? green : options.muted ? gray : dark)
      pdf.text(value, rightX, y, { align: 'right' })

      y += options.bold ? 8 : 6.5
    }

    function sectionTitle(title: string) {
      y += 5
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(12)
      setColor(dark)
      pdf.text(title, marginX, y)
      y += 7
    }

    // Header
    setFill(dark)
    pdf.rect(0, 0, pageWidth, 48, 'F')

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(10)
    pdf.setTextColor(134, 239, 172)
    pdf.text('OBAYAN INVOICE', marginX, 15)

    pdf.setFontSize(22)
    pdf.setTextColor(255, 255, 255)
    pdf.text('Invoice Pembayaran', marginX, 29)

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8.5)
    pdf.setTextColor(203, 213, 225)
    pdf.text('Invoice ini diterbitkan otomatis oleh sistem Obayan.', marginX, 38)

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(9)
    pdf.setTextColor(255, 255, 255)
    pdf.text(cleanText(invoice.status, 'DRAFT').toUpperCase(), rightX, 16, { align: 'right' })

    y = 62

    // Meta box
    setDraw(slate200)
    pdf.roundedRect(marginX, y, pageWidth - marginX * 2, 46, 4, 4, 'S')

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(7.5)
    setColor(gray)
    pdf.text('INVOICE NO.', marginX + 5, y + 9)
    pdf.text('ORDER ID', pageWidth / 2 + 4, y + 9)

    pdf.setFontSize(10)
    setColor(dark)
    pdf.text(cleanText(invoice.invoiceNo), marginX + 5, y + 18)
    pdf.text(cleanText(invoice.orderId), pageWidth / 2 + 4, y + 18)

    pdf.setFontSize(7.5)
    setColor(gray)
    pdf.text('DITAGIHKAN KEPADA', marginX + 5, y + 31)
    pdf.text('MASA KONTRAK', pageWidth / 2 + 4, y + 31)

    pdf.setFontSize(9.5)
    setColor(dark)
    pdf.text(cleanText(form.tenantName || invoice.tenantName), marginX + 5, y + 39)
    pdf.text(
      `${cleanText(form.contractStart || invoice.contractStart)} s/d ${cleanText(form.contractEnd || invoice.contractEnd)}`,
      pageWidth / 2 + 4,
      y + 39
    )

    y += 60

    // Customer
    sectionTitle('Data Pemesan')

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9.5)
    setColor(gray)

    wrapped(
      `${cleanText(form.picName || invoice.picName)} · ${cleanText(form.picPosition || invoice.picPosition)}`,
      marginX,
      pageWidth - marginX * 2
    )

    wrapped(
      `WhatsApp: ${cleanText(form.picWhatsapp || invoice.picWhatsapp)}`,
      marginX,
      pageWidth - marginX * 2
    )

    if (form.requestNote || invoice.requestNote) {
      wrapped(
        `Catatan: ${cleanText(form.requestNote || invoice.requestNote)}`,
        marginX,
        pageWidth - marginX * 2
      )
    }

    // Service
    sectionTitle('Detail Layanan')

    const tableY = y

    setFill(slate100)
    pdf.roundedRect(marginX, tableY, pageWidth - marginX * 2, 13, 3, 3, 'F')

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(9)
    setColor(dark)
    pdf.text('Layanan', marginX + 5, tableY + 8)
    pdf.text('Jumlah', rightX - 5, tableY + 8, { align: 'right' })

    y = tableY + 21

    const serviceTitle = `${cleanText(pkg.name || invoice.packageName)} - ${cleanText(pkg.subtitle || invoice.packageSubtitle)}`
    const serviceDetail = `${cleanText(price.durationLabel || invoice.durationLabel)}${
      requiresSantriCount.value
        ? ` · ${cleanText(form.santriCount || invoice.santriCount || 0)} santri/siswa`
        : ''
    }`

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(10)
    setColor(dark)
    wrapped(serviceTitle, marginX + 5, 112)

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8.5)
    setColor(gray)
    wrapped(serviceDetail, marginX + 5, 112)

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(10)
    setColor(dark)
    pdf.text(
      safeMoney(price.subtotal || invoice?.pricing?.subtotal || invoice.total),
      rightX - 5,
      tableY + 25,
      { align: 'right' }
    )

    y += 8
    setDraw(slate200)
    pdf.line(marginX, y, rightX, y)
    y += 12

    // Summary
    y = Math.max(y, 168)

    priceLine('Harga normal', safeMoney(price.regularSubtotal || invoice?.pricing?.regularSubtotal), { muted: true })
    priceLine('Subtotal promo', safeMoney(price.subtotal || invoice?.pricing?.subtotal))

    if (Number(price.launchingDiscount || invoice?.pricing?.launchingDiscount || 0) > 0) {
      priceLine(
        'Diskon launching',
        `-${safeMoney(price.launchingDiscount || invoice?.pricing?.launchingDiscount)}`,
        { green: true }
      )
    }

    if (Number(price.yearlyDiscount || invoice?.pricing?.yearlyDiscount || 0) > 0) {
      priceLine(
        'Diskon tahunan',
        `-${safeMoney(price.yearlyDiscount || invoice?.pricing?.yearlyDiscount)}`,
        { green: true }
      )
    }

    y += 2
    setDraw(slate200)
    pdf.line(116, y, rightX, y)
    y += 8

    priceLine(
      'Total Dibayar',
      safeMoney(price.total || invoice.total || invoice?.pricing?.total),
      { bold: true, green: true }
    )

    // Notes
    y += 10
    setFill(slate100)
    pdf.roundedRect(marginX, y, pageWidth - marginX * 2, 34, 4, 4, 'F')

    y += 9
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    setColor(gray)

    wrapped(
      'Invoice ini sah sebagai bukti pembayaran layanan Obayan setelah status pembayaran dinyatakan PAID.',
      marginX + 5,
      pageWidth - marginX * 2 - 10,
      4.8
    )

    wrapped(
      'Request tambahan di luar paket akan dianalisis dan ditagihkan secara terpisah apabila disetujui kedua pihak.',
      marginX + 5,
      pageWidth - marginX * 2 - 10,
      4.8
    )

    // Footer
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    setColor(gray)
    pdf.text('Generated by Obayan Payment', marginX, pageHeight - 10)
    pdf.text(new Date().toLocaleString('id-ID'), rightX, pageHeight - 10, { align: 'right' })

    pdf.save(invoiceFilename('pdf'))

    downloadedInvoiceKeys.value.add(key)
  } catch (error: any) {
    console.error('Gagal save PDF:', error)

    errors.general = error?.message
      ? `Gagal membuat PDF: ${error.message}`
      : 'Gagal membuat PDF. Pastikan package jspdf sudah terinstall.'
  } finally {
    exporting.value = false
    exportMessage.value = ''
    unlockModalScroll()

    await nextTick()
  }
}

async function downloadInvoiceJpg(auto = false) {
  if (!currentInvoice.value) {
    errors.general = 'Invoice belum tersedia. Generate invoice terlebih dahulu.'
    return
  }

  const isAuto = auto === true
  const key = `${currentInvoice.value.orderId}:jpg`

  if (isAuto && downloadedInvoiceKeys.value.has(key)) return

  exporting.value = true
  exportMessage.value = 'Membuat JPG...'

  try {
    const invoice = currentInvoice.value || {}
    const pkg = selectedPackage.value || {}
    const price = pricing.value || {}

    const width = 1240
    const height = 1754
    const scale = 1

    const canvas = document.createElement('canvas')
    canvas.width = width * scale
    canvas.height = height * scale

    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Canvas tidak tersedia di browser ini.')
    }

    ctx.scale(scale, scale)

    const green = '#16a34a'
    const greenLight = '#dcfce7'
    const dark = '#0f172a'
    const slate = '#64748b'
    const slate100 = '#f1f5f9'
    const slate200 = '#e2e8f0'
    const white = '#ffffff'

    function cleanText(value: unknown, fallback = '-') {
      const text = String(value ?? '').trim()
      return text || fallback
    }

    function safeMoney(value: unknown) {
      return formatIDR(Number(value || 0))
    }

    function roundedRect(x: number, y: number, w: number, h: number, r: number, fill: string, stroke?: string) {
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.quadraticCurveTo(x + w, y, x + w, y + r)
      ctx.lineTo(x + w, y + h - r)
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
      ctx.lineTo(x + r, y + h)
      ctx.quadraticCurveTo(x, y + h, x, y + h - r)
      ctx.lineTo(x, y + r)
      ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.closePath()

      ctx.fillStyle = fill
      ctx.fill()

      if (stroke) {
        ctx.strokeStyle = stroke
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }

    function text(
      value: string,
      x: number,
      y: number,
      options: {
        size?: number
        weight?: string
        color?: string
        align?: CanvasTextAlign
        maxWidth?: number
      } = {}
    ) {
      ctx.font = `${options.weight || '400'} ${options.size || 24}px Arial, sans-serif`
      ctx.fillStyle = options.color || dark
      ctx.textAlign = options.align || 'left'
      ctx.textBaseline = 'top'
      ctx.fillText(value, x, y, options.maxWidth)
    }

    function wrapText(
      value: string,
      x: number,
      y: number,
      maxWidth: number,
      lineHeight: number,
      options: {
        size?: number
        weight?: string
        color?: string
      } = {}
    ) {
      const words = cleanText(value).split(' ')
      let line = ''
      let currentY = y

      ctx.font = `${options.weight || '400'} ${options.size || 24}px Arial, sans-serif`
      ctx.fillStyle = options.color || dark
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'

      for (const word of words) {
        const testLine = line ? `${line} ${word}` : word
        const metrics = ctx.measureText(testLine)

        if (metrics.width > maxWidth && line) {
          ctx.fillText(line, x, currentY)
          line = word
          currentY += lineHeight
        } else {
          line = testLine
        }
      }

      if (line) {
        ctx.fillText(line, x, currentY)
        currentY += lineHeight
      }

      return currentY
    }

    function priceLine(label: string, value: string, y: number, options: { bold?: boolean; green?: boolean; muted?: boolean } = {}) {
      text(label, 720, y, {
        size: options.bold ? 28 : 22,
        weight: options.bold ? '800' : '500',
        color: options.muted ? slate : dark
      })

      text(value, 1080, y, {
        size: options.bold ? 28 : 22,
        weight: options.bold ? '800' : '700',
        color: options.green ? green : options.muted ? slate : dark,
        align: 'right'
      })

      return y + (options.bold ? 42 : 34)
    }

    // Background
    ctx.fillStyle = white
    ctx.fillRect(0, 0, width, height)

    // Header
    ctx.fillStyle = dark
    ctx.fillRect(0, 0, width, 245)

    text('OBAYAN INVOICE', 80, 62, {
      size: 22,
      weight: '800',
      color: '#86efac'
    })

    text('Invoice Pembayaran', 80, 105, {
      size: 50,
      weight: '900',
      color: white
    })

    text('Invoice ini diterbitkan otomatis oleh sistem Obayan.', 80, 170, {
      size: 22,
      weight: '400',
      color: '#cbd5e1'
    })

    roundedRect(960, 60, 180, 48, 24, greenLight)
    text(cleanText(invoice.status, 'DRAFT').toUpperCase(), 1050, 74, {
      size: 20,
      weight: '900',
      color: green,
      align: 'center'
    })

    // Meta box
    roundedRect(80, 310, 1080, 215, 24, white, slate200)

    text('INVOICE NO.', 115, 345, {
      size: 18,
      weight: '800',
      color: slate
    })

    text(cleanText(invoice.invoiceNo), 115, 383, {
      size: 25,
      weight: '900',
      color: dark,
      maxWidth: 470
    })

    text('ORDER ID', 650, 345, {
      size: 18,
      weight: '800',
      color: slate
    })

    text(cleanText(invoice.orderId), 650, 383, {
      size: 25,
      weight: '900',
      color: dark,
      maxWidth: 470
    })

    text('DITAGIHKAN KEPADA', 115, 455, {
      size: 18,
      weight: '800',
      color: slate
    })

    text(cleanText(form.tenantName || invoice.tenantName), 115, 492, {
      size: 23,
      weight: '900',
      color: dark,
      maxWidth: 470
    })

    text('MASA KONTRAK', 650, 455, {
      size: 18,
      weight: '800',
      color: slate
    })

    text(`${cleanText(form.contractStart || invoice.contractStart)} s/d ${cleanText(form.contractEnd || invoice.contractEnd)}`, 650, 492, {
      size: 23,
      weight: '800',
      color: dark,
      maxWidth: 470
    })

    // Customer
    let y = 600

    text('Data Pemesan', 80, y, {
      size: 30,
      weight: '900',
      color: dark
    })

    y += 55

    y = wrapText(
      `${cleanText(form.picName || invoice.picName)} · ${cleanText(form.picPosition || invoice.picPosition)}`,
      80,
      y,
      1080,
      34,
      {
        size: 24,
        weight: '500',
        color: slate
      }
    )

    y = wrapText(`WhatsApp: ${cleanText(form.picWhatsapp || invoice.picWhatsapp)}`, 80, y + 6, 1080, 34, {
      size: 24,
      weight: '500',
      color: slate
    })

    if (form.requestNote || invoice.requestNote) {
      y = wrapText(`Catatan: ${cleanText(form.requestNote || invoice.requestNote)}`, 80, y + 6, 1080, 34, {
        size: 22,
        weight: '500',
        color: slate
      })
    }

    // Service table
    y += 45

    text('Detail Layanan', 80, y, {
      size: 30,
      weight: '900',
      color: dark
    })

    y += 55

    roundedRect(80, y, 1080, 70, 18, slate100)

    text('Layanan', 115, y + 24, {
      size: 22,
      weight: '900',
      color: dark
    })

    text('Jumlah', 1125, y + 24, {
      size: 22,
      weight: '900',
      color: dark,
      align: 'right'
    })

    y += 95

    const serviceTitle = `${cleanText(pkg.name || invoice.packageName)} - ${cleanText(pkg.subtitle || invoice.packageSubtitle)}`
    const serviceDetail = `${cleanText(price.durationLabel || invoice.durationLabel)}${
      requiresSantriCount.value
        ? ` · ${cleanText(form.santriCount || invoice.santriCount || 0)} santri/siswa`
        : ''
    }`

    const serviceStartY = y

    y = wrapText(serviceTitle, 115, y, 650, 34, {
      size: 24,
      weight: '900',
      color: dark
    })

    y = wrapText(serviceDetail, 115, y + 8, 650, 30, {
      size: 20,
      weight: '500',
      color: slate
    })

    text(safeMoney(price.subtotal || invoice?.pricing?.subtotal || invoice.total), 1125, serviceStartY, {
      size: 24,
      weight: '900',
      color: dark,
      align: 'right'
    })

    y += 45

    ctx.strokeStyle = slate200
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(80, y)
    ctx.lineTo(1160, y)
    ctx.stroke()

    // Summary
    y += 60
    y = Math.max(y, 1040)

    y = priceLine('Harga normal', safeMoney(price.regularSubtotal || invoice?.pricing?.regularSubtotal), y, {
      muted: true
    })

    y = priceLine('Subtotal promo', safeMoney(price.subtotal || invoice?.pricing?.subtotal), y)

    if (Number(price.launchingDiscount || invoice?.pricing?.launchingDiscount || 0) > 0) {
      y = priceLine(
        'Diskon launching',
        `-${safeMoney(price.launchingDiscount || invoice?.pricing?.launchingDiscount)}`,
        y,
        { green: true }
      )
    }

    if (Number(price.yearlyDiscount || invoice?.pricing?.yearlyDiscount || 0) > 0) {
      y = priceLine(
        'Diskon tahunan',
        `-${safeMoney(price.yearlyDiscount || invoice?.pricing?.yearlyDiscount)}`,
        y,
        { green: true }
      )
    }

    ctx.strokeStyle = slate200
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(720, y + 8)
    ctx.lineTo(1125, y + 8)
    ctx.stroke()

    y += 35

    priceLine('Total Dibayar', safeMoney(price.total || invoice.total || invoice?.pricing?.total), y, {
      bold: true,
      green: true
    })

    // Notes
    roundedRect(80, 1380, 1080, 135, 24, slate100)

    wrapText(
      'Invoice ini sah sebagai bukti pembayaran layanan Obayan setelah status pembayaran dinyatakan PAID.',
      115,
      1415,
      1000,
      28,
      {
        size: 20,
        weight: '500',
        color: slate
      }
    )

    wrapText(
      'Request tambahan di luar paket akan dianalisis dan ditagihkan secara terpisah apabila disetujui kedua pihak.',
      115,
      1470,
      1000,
      28,
      {
        size: 20,
        weight: '500',
        color: slate
      }
    )

    // Footer
    text('Generated by Obayan Payment', 80, 1680, {
      size: 18,
      weight: '500',
      color: slate
    })

    text(new Date().toLocaleString('id-ID'), 1160, 1680, {
      size: 18,
      weight: '500',
      color: slate,
      align: 'right'
    })

    const dataUrl = canvas.toDataURL('image/jpeg', 0.96)
    const link = document.createElement('a')

    link.href = dataUrl
    link.download = invoiceFilename('jpg')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    downloadedInvoiceKeys.value.add(key)
  } catch (error: any) {
    console.error('Gagal save JPG:', error)

    errors.general = error?.message
      ? `Gagal membuat JPG: ${error.message}`
      : 'Gagal membuat JPG. Cek console browser untuk detail error.'
  } finally {
    exporting.value = false
    exportMessage.value = ''
    unlockModalScroll()

    await nextTick()
  }
}

const PriceLine = defineComponent({
  name: 'PriceLine',
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    success: { type: Boolean, default: false },
    muted: { type: Boolean, default: false }
  },
  setup(props) {
    return () => h('div', {
      class: [
        'flex items-center justify-between gap-4 text-sm',
        props.success ? 'text-green-700' : props.muted ? 'text-slate-400' : 'text-slate-700'
      ]
    }, [
      h('span', {}, props.label),
      h('span', {
        class: [
          'font-bold',
          props.muted ? 'line-through' : ''
        ]
      }, props.value)
    ])
  }
})

const InvoiceContent = defineComponent({
  name: 'InvoiceContent',
  props: {
    invoice: {
      type: Object,
      required: true
    },
    formData: {
      type: Object,
      required: true
    },
    selectedPackageData: {
      type: Object,
      required: true
    },
    pricingData: {
      type: Object,
      required: true
    },
    requiresSantriCount: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    return () => {
      const invoice = props.invoice as any
      const formData = props.formData as any
      const selectedPackageData = props.selectedPackageData as any
      const pricingData = props.pricingData as any

      return h('div', { class: 'bg-white p-10 text-slate-950' }, [
        h('div', { class: 'flex items-start justify-between border-b border-slate-200 pb-6' }, [
          h('div', {}, [
            h('p', { class: 'text-xs font-bold uppercase tracking-[0.22em] text-green-700' }, 'Obayan Invoice'),
            h('h1', { class: 'mt-2 text-3xl font-black text-slate-950' }, 'Invoice Pembayaran'),
            h('p', { class: 'mt-2 text-sm text-slate-500' }, 'Invoice ini diterbitkan otomatis oleh sistem Obayan.')
          ]),

          h('div', { class: 'text-right' }, [
            h('p', { class: 'text-sm font-bold text-slate-500' }, 'Status'),
            h(
              'p',
              { class: 'mt-1 rounded-full bg-green-100 px-4 py-1 text-sm font-black text-green-700' },
              String(invoice?.status || 'draft').toUpperCase()
            )
          ])
        ]),

        h('div', { class: 'mt-8 grid grid-cols-2 gap-6' }, [
          h('div', {}, [
            h('p', { class: 'text-xs font-bold uppercase tracking-[0.18em] text-slate-400' }, 'Invoice No.'),
            h('p', { class: 'mt-2 text-lg font-black' }, invoice?.invoiceNo || '-')
          ]),

          h('div', {}, [
            h('p', { class: 'text-xs font-bold uppercase tracking-[0.18em] text-slate-400' }, 'Order ID'),
            h('p', { class: 'mt-2 text-lg font-black' }, invoice?.orderId || '-')
          ]),

          h('div', {}, [
            h('p', { class: 'text-xs font-bold uppercase tracking-[0.18em] text-slate-400' }, 'Ditagihkan Kepada'),
            h('p', { class: 'mt-2 font-black' }, formData?.tenantName || invoice?.tenantName || '-'),
            h(
              'p',
              { class: 'mt-1 text-sm text-slate-600' },
              `${formData?.picName || invoice?.picName || '-'} · ${formData?.picPosition || invoice?.picPosition || '-'}`
            ),
            h('p', { class: 'text-sm text-slate-600' }, formData?.picWhatsapp || invoice?.picWhatsapp || '-')
          ]),

          h('div', {}, [
            h('p', { class: 'text-xs font-bold uppercase tracking-[0.18em] text-slate-400' }, 'Masa Kontrak'),
            h('p', { class: 'mt-2 text-sm text-slate-700' }, [
              'Mulai: ',
              h('b', {}, formData?.contractStart || invoice?.contractStart || '-')
            ]),
            h('p', { class: 'text-sm text-slate-700' }, [
              'Berakhir: ',
              h('b', {}, formData?.contractEnd || invoice?.contractEnd || '-')
            ]),
            h('p', { class: 'text-sm text-slate-700' }, [
              'Durasi: ',
              h('b', {}, pricingData?.durationLabel || invoice?.durationLabel || '-')
            ])
          ])
        ]),

        h('div', { class: 'mt-8 overflow-hidden rounded-2xl border border-slate-200' }, [
          h('table', { class: 'w-full border-collapse text-left text-sm' }, [
            h('thead', { class: 'bg-slate-50' }, [
              h('tr', {}, [
                h('th', { class: 'px-5 py-4 font-black text-slate-700' }, 'Layanan'),
                h('th', { class: 'px-5 py-4 text-right font-black text-slate-700' }, 'Jumlah')
              ])
            ]),

            h('tbody', {}, [
              h('tr', { class: 'border-t border-slate-200' }, [
                h('td', { class: 'px-5 py-5' }, [
                  h(
                    'p',
                    { class: 'font-black text-slate-950' },
                    `${selectedPackageData?.name || invoice?.packageName || '-'} - ${selectedPackageData?.subtitle || invoice?.packageSubtitle || '-'}`
                  ),
                  h(
                    'p',
                    { class: 'mt-1 text-xs text-slate-500' },
                    `${pricingData?.durationLabel || invoice?.durationLabel || '-'}${
                      props.requiresSantriCount
                        ? ` · ${formData?.santriCount || invoice?.santriCount || 0} santri/siswa`
                        : ''
                    }`
                  )
                ]),

                h(
                  'td',
                  { class: 'px-5 py-5 text-right font-black' },
                  formatIDR(pricingData?.subtotal || invoice?.pricing?.subtotal || invoice?.total || 0)
                )
              ])
            ])
          ])
        ]),

        h('div', { class: 'mt-8 ml-auto w-full max-w-sm space-y-3' }, [
          h(PriceLine, {
            label: 'Harga normal',
            value: formatIDR(pricingData?.regularSubtotal || invoice?.pricing?.regularSubtotal || 0),
            muted: true
          }),

          h(PriceLine, {
            label: 'Subtotal promo',
            value: formatIDR(pricingData?.subtotal || invoice?.pricing?.subtotal || 0)
          }),

          Number(pricingData?.launchingDiscount || invoice?.pricing?.launchingDiscount || 0) > 0
            ? h(PriceLine, {
                label: 'Diskon launching',
                value: `-${formatIDR(pricingData?.launchingDiscount || invoice?.pricing?.launchingDiscount || 0)}`,
                success: true
              })
            : null,

          Number(pricingData?.yearlyDiscount || invoice?.pricing?.yearlyDiscount || 0) > 0
            ? h(PriceLine, {
                label: 'Diskon tahunan',
                value: `-${formatIDR(pricingData?.yearlyDiscount || invoice?.pricing?.yearlyDiscount || 0)}`,
                success: true
              })
            : null,

          h('div', { class: 'flex items-center justify-between border-t border-slate-200 pt-4' }, [
            h('span', { class: 'text-lg font-black' }, 'Total Dibayar'),
            h(
              'span',
              { class: 'text-2xl font-black text-green-700' },
              formatIDR(pricingData?.total || invoice?.total || invoice?.pricing?.total || 0)
            )
          ])
        ]),

        h('div', { class: 'mt-10 rounded-2xl bg-slate-50 p-5 text-xs leading-6 text-slate-500' }, [
          h('p', {}, 'Invoice ini sah sebagai bukti pembayaran layanan Obayan setelah status pembayaran dinyatakan PAID.'),
          h('p', { class: 'mt-2' }, 'Request tambahan di luar paket akan dianalisis dan ditagihkan secara terpisah apabila disetujui kedua pihak.')
        ])
      ])
    }
  }
})

</script>

<style scoped>
.invoice-modal-scroll {
  -webkit-overflow-scrolling: touch;
  scrollbar-gutter: stable;
}

.invoice-export-wrapper {
  opacity: 0.01;
  z-index: -1;
}
</style>
