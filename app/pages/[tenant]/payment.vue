<template>
  <main class="min-h-screen bg-[#f7faf8] text-slate-950 pt-12">
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
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"/>
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
              <path d="M12 9v4m0 4h.01M10.3 4.6 2.9 17.2A2 2 0 0 0 4.6 20h14.8a2 2 0 0 0 1.7-2.8L13.7 4.6a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
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

        <p class="mt-5 text-center text-xs leading-5 text-slate-400">
          Jika kamu merasa link ini benar, kemungkinan data tenant belum dibuat atau settings belum dipublish.
        </p>
      </div>
    </div>
  </section>
    <section v-else class="relative overflow-hidden">
      <!-- Soft background -->
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
                  <path d="M5 7.5A3.5 3.5 0 0 1 8.5 4h7A3.5 3.5 0 0 1 19 7.5v9A3.5 3.5 0 0 1 15.5 20h-7A3.5 3.5 0 0 1 5 16.5v-9Z" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M8.5 9h7M8.5 12.5h7M8.5 16h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
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
              <div class="rounded-2xl bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
                Promo launching aktif
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
                  Pilih paket, isi data, lalu bayar.
                </h2>

                <p class="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                  Form ini membantu membuat invoice dan kontrak layanan Obayan dengan lebih rapi.
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

              <!-- PIC form -->
              <div class="rounded-[1.6rem] border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
                <div class="grid gap-4">
                  <FieldShell
                    label="Nama lembaga"
                    :error="errors.tenantName"
                    hint="Nama ini akan muncul di invoice."
                  >
                    <input
                      v-model="form.tenantName"
                      type="text"
                      placeholder="Misalnya: Pondok Pesantren Al Inayah"
                      :class="inputClass(errors.tenantName)"
                      @blur="touch('tenantName')"
                    >
                  </FieldShell>

                  <div class="grid gap-4 md:grid-cols-3">
                    <FieldShell label="Nama PIC" :error="errors.picName">
                      <input
                        v-model="form.picName"
                        type="text"
                        placeholder="Misalnya: Bu Indah"
                        :class="inputClass(errors.picName)"
                        @blur="touch('picName')"
                      >
                    </FieldShell>

                    <FieldShell label="Jabatan" :error="errors.picPosition">
                      <input
                        v-model="form.picPosition"
                        type="text"
                        placeholder="Misalnya: Bendahara"
                        :class="inputClass(errors.picPosition)"
                        @blur="touch('picPosition')"
                      >
                    </FieldShell>

                    <FieldShell label="WhatsApp" :error="errors.picWhatsapp">
                      <input
                        v-model="form.picWhatsapp"
                        type="tel"
                        inputmode="tel"
                        placeholder="Contoh: 0822-3264-7500"
                        :class="inputClass(errors.picWhatsapp)"
                        @blur="touch('picWhatsapp')"
                      >
                    </FieldShell>
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
                    <FieldShell label="Jumlah santri/siswa" :error="errors.santriCount">
                      <input
                        v-model.number="form.santriCount"
                        type="number"
                        min="0"
                        placeholder="Contoh: 150"
                        :class="inputClass(errors.santriCount)"
                        @blur="touch('santriCount')"
                      >
                    </FieldShell>
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
                          <path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clip-rule="evenodd"/>
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
                      <p class="mt-1 text-sm text-slate-500">Bayar 10 bulan, aktif 12 bulan.</p>
                    </div>

                    <span class="rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
                      Hemat
                    </span>
                  </div>
                </label>
              </div>

              <!-- Date + note -->
              <div class="grid gap-4 md:grid-cols-2">
                <FieldShell label="Mulai kontrak" :error="errors.contractStart">
                  <input
                    v-model="form.contractStart"
                    type="date"
                    :class="inputClass(errors.contractStart)"
                    @blur="touch('contractStart')"
                  >
                </FieldShell>

                <FieldShell label="Berakhir kontrak" hint="Terisi otomatis.">
                  <input
                    v-model="form.contractEnd"
                    type="date"
                    readonly
                    class="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-500 outline-none"
                  >
                </FieldShell>
              </div>

              <FieldShell label="Catatan tambahan" hint="Opsional. Request di luar paket akan dianalisis terpisah.">
                <textarea
                  v-model="form.requestNote"
                  rows="3"
                  placeholder="Misalnya: mau request import Excel, custom laporan, atau integrasi WhatsApp."
                  class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                ></textarea>
              </FieldShell>

              <AlertBox v-if="errors.general" type="error" :message="errors.general" />

              <div class="flex justify-end">
                <button
                  type="button"
                  class="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-green-600/20 transition hover:-translate-y-0.5 hover:bg-green-700"
                  @click="nextToTerms"
                >
                  Lanjut
                  <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 10a1 1 0 0 1 1-1h9.59l-3.3-3.3a1 1 0 1 1 1.42-1.4l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.42-1.4l3.3-3.3H4a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
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
                          <path fill-rule="evenodd" d="M5.2 7.2a1 1 0 0 1 1.4 0L10 10.6l3.4-3.4a1 1 0 1 1 1.4 1.4l-4.1 4.1a1 1 0 0 1-1.4 0L5.2 8.6a1 1 0 0 1 0-1.4Z" clip-rule="evenodd"/>
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

              <AlertBox v-if="errors.general" type="error" :message="errors.general" />

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
                  Lanjut pembayaran
                </button>
              </div>
            </div>

            <!-- STEP 3 -->
            <div v-else class="space-y-6">
              <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 class="text-2xl font-black tracking-tight">Invoice & pembayaran</h3>
                  <p class="mt-1 text-sm text-slate-500">
                    Cek ringkasan tagihan sebelum membuka Midtrans.
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
                    <PriceRow label="Harga normal" :value="formatIDR(pricing.regularSubtotal)" muted />
                    <PriceRow label="Subtotal promo" :value="formatIDR(pricing.subtotal)" />

                    <PriceRow
                      v-if="pricing.launchingDiscount > 0"
                      label="Diskon launching"
                      :value="`-${formatIDR(pricing.launchingDiscount)}`"
                      success
                    />

                    <PriceRow
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
                    v-if="currentInvoice?.midtrans?.redirectUrl"
                    class="mt-4 rounded-3xl border border-green-100 bg-green-50 p-4 text-sm leading-6 text-green-800"
                  >
                    Link pembayaran sudah dibuat.
                    <a
                      :href="currentInvoice.midtrans.redirectUrl"
                      target="_blank"
                      class="font-black underline"
                    >
                      Buka payment page
                    </a>
                  </div>
                </div>
              </div>

              <AlertBox v-if="errors.general" type="error" :message="errors.general" />

              <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  class="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                  @click="step = 2"
                >
                  Kembali
                </button>

                <button
                  type="button"
                  class="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-green-600/20 transition hover:-translate-y-0.5 hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                  :disabled="submitting"
                  @click="generateInvoiceAndPay"
                >
                  <svg v-if="submitting" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"/>
                  </svg>

                  {{ submitting ? 'Sedang membuat invoice...' : currentInvoice ? 'Bayar sekarang' : 'Generate invoice & bayar' }}
                </button>
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
              <PriceRow label="Subtotal promo" :value="formatIDR(pricing.subtotal)" />

              <PriceRow
                v-if="pricing.launchingDiscount > 0"
                label="Diskon launching"
                :value="`-${formatIDR(pricing.launchingDiscount)}`"
                success
              />

              <PriceRow
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
    <div
  v-if="currentInvoice"
  class="fixed left-[-9999px] top-0 w-[794px] bg-white text-slate-950"
>
  <div
    ref="invoicePrintArea"
    class="bg-white p-10"
  >
    <div class="flex items-start justify-between border-b border-slate-200 pb-6">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.22em] text-green-700">
          Obayan Invoice
        </p>
        <h1 class="mt-2 text-3xl font-black text-slate-950">
          Invoice Pembayaran
        </h1>
        <p class="mt-2 text-sm text-slate-500">
          Invoice ini diterbitkan otomatis oleh sistem Obayan.
        </p>
      </div>

      <div class="text-right">
        <p class="text-sm font-bold text-slate-500">Status</p>
        <p class="mt-1 rounded-full bg-green-100 px-4 py-1 text-sm font-black text-green-700">
          PAID
        </p>
      </div>
    </div>

    <div class="mt-8 grid grid-cols-2 gap-6">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
          Invoice No.
        </p>
        <p class="mt-2 text-lg font-black">
          {{ currentInvoice.invoiceNo }}
        </p>
      </div>

      <div>
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
          Order ID
        </p>
        <p class="mt-2 text-lg font-black">
          {{ currentInvoice.orderId }}
        </p>
      </div>

      <div>
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
          Ditagihkan Kepada
        </p>
        <p class="mt-2 font-black">
          {{ form.tenantName }}
        </p>
        <p class="mt-1 text-sm text-slate-600">
          {{ form.picName }} · {{ form.picPosition }}
        </p>
        <p class="text-sm text-slate-600">
          {{ form.picWhatsapp }}
        </p>
      </div>

      <div>
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
          Masa Kontrak
        </p>
        <p class="mt-2 text-sm text-slate-700">
          Mulai: <b>{{ form.contractStart }}</b>
        </p>
        <p class="text-sm text-slate-700">
          Berakhir: <b>{{ form.contractEnd }}</b>
        </p>
        <p class="text-sm text-slate-700">
          Durasi: <b>{{ pricing.durationLabel }}</b>
        </p>
      </div>
    </div>

    <div class="mt-8 overflow-hidden rounded-2xl border border-slate-200">
      <table class="w-full border-collapse text-left text-sm">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-5 py-4 font-black text-slate-700">Layanan</th>
            <th class="px-5 py-4 text-right font-black text-slate-700">Jumlah</th>
          </tr>
        </thead>

        <tbody>
          <tr class="border-t border-slate-200">
            <td class="px-5 py-5">
              <p class="font-black text-slate-950">
                {{ selectedPackage.name }} - {{ selectedPackage.subtitle }}
              </p>
              <p class="mt-1 text-xs text-slate-500">
                {{ pricing.durationLabel }}
                <span v-if="requiresSantriCount">
                  · {{ form.santriCount }} santri/siswa
                </span>
              </p>
            </td>
            <td class="px-5 py-5 text-right font-black">
              {{ formatIDR(pricing.subtotal) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-8 ml-auto w-full max-w-sm space-y-3">
      <PriceRow label="Harga normal" :value="formatIDR(pricing.regularSubtotal)" muted />
      <PriceRow label="Subtotal promo" :value="formatIDR(pricing.subtotal)" />

      <PriceRow
        v-if="pricing.launchingDiscount > 0"
        label="Diskon launching"
        :value="`-${formatIDR(pricing.launchingDiscount)}`"
        success
      />

      <PriceRow
        v-if="pricing.yearlyDiscount > 0"
        label="Diskon tahunan"
        :value="`-${formatIDR(pricing.yearlyDiscount)}`"
        success
      />

      <div class="flex items-center justify-between border-t border-slate-200 pt-4">
        <span class="text-lg font-black">Total Dibayar</span>
        <span class="text-2xl font-black text-green-700">
          {{ formatIDR(pricing.total) }}
        </span>
      </div>
    </div>

    <div class="mt-10 rounded-2xl bg-slate-50 p-5 text-xs leading-6 text-slate-500">
      <p>
        Invoice ini sah sebagai bukti pembayaran layanan Obayan setelah status pembayaran dinyatakan PAID.
      </p>
      <p class="mt-2">
        Request tambahan di luar paket akan dianalisis dan ditagihkan secara terpisah apabila disetujui kedua pihak.
      </p>
    </div>
  </div>
</div>
  </main>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { ref as dbRef, get } from 'firebase/database'
import {
  PAYMENT_PACKAGES,
  OBAYAN_TERMS_SECTIONS,
  type PaymentPackageId,
  type BillingDuration,
  calculateContractEndDate,
  calculateInvoice,
  formatIDR,
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

const FieldShell = defineComponent({
  name: 'FieldShell',
  props: {
    label: { type: String, required: true },
    error: { type: String, default: '' },
    hint: { type: String, default: '' }
  },
  setup(props, { slots }) {
    return () => h('label', { class: 'block' }, [
      h('span', { class: 'mb-1.5 block text-sm font-bold text-slate-800' }, props.label),
      slots.default?.(),
      props.error
        ? h('span', { class: 'mt-1.5 block text-xs font-semibold text-red-600' }, props.error)
        : props.hint
          ? h('span', { class: 'mt-1.5 block text-xs leading-5 text-slate-500' }, props.hint)
          : null
    ])
  }
})

const PriceRow = defineComponent({
  name: 'PriceRow',
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

const AlertBox = defineComponent({
  name: 'AlertBox',
  props: {
    type: { type: String, default: 'error' },
    message: { type: String, required: true }
  },
  setup(props) {
    return () => h('div', {
      class: props.type === 'error'
        ? 'rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700'
        : 'rounded-3xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold leading-6 text-green-700'
    }, props.message)
  }
})

const route = useRoute()
const runtime = useRuntimeConfig()

const { $realtimeDb } = useNuxtApp() as any

const tenantChecking = ref(true)
const tenantReady = ref(false)
const tenantMissingReason = ref('')
const tenantCheckError = ref('')

const rawTenant = computed(() => String(route.params.tenant || 'obayan'))
const tenantSlug = computed(() => sanitizeTenantSlug(rawTenant.value))

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

    // Baru load settings setelah tenant benar-benar valid
    loadSettings()
  } catch (e: any) {
    tenantCheckError.value =
      e?.message ||
      'Kami belum bisa memeriksa data tenant saat ini. Coba refresh halaman beberapa saat lagi.'
  } finally {
    tenantChecking.value = false
  }
}

const invoicePrintArea = ref<HTMLElement | null>(null)
const downloadedInvoiceOrderIds = ref<Set<string>>(new Set())

const { settings, load: loadSettings } = useSettings({
  path: `/${tenantSlug.value}/settings`,
  debounceMs: 900
})

const { createInvoice, updateInvoiceStatus, activateTenantSubscription } = usePayment(tenantSlug.value)

const steps = [
  { value: 1 as StepValue, title: 'Data & Paket', subtitle: 'PIC, paket, kontrak' },
  { value: 2 as StepValue, title: 'Terms', subtitle: 'Persetujuan layanan' },
  { value: 3 as StepValue, title: 'Payment', subtitle: 'Invoice & Midtrans' }
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

const packageList = computed(() => Object.values(PAYMENT_PACKAGES))
const selectedPackage = computed(() => PAYMENT_PACKAGES[form.packageId])
const requiresSantriCount = computed(() => selectedPackage.value.perSantriPrice > 0)

const pricing = computed(() => {
  return calculateInvoice({
    packageId: form.packageId,
    duration: form.duration,
    santriCount: form.santriCount
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
    {
      name: 'description',
      content: seoDescription.value
    },
    {
      name: 'robots',
      content: 'noindex, nofollow'
    },
    {
      name: 'theme-color',
      content: '#16a34a'
    },

    // Open Graph
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:title',
      content: seoTitle.value
    },
    {
      property: 'og:description',
      content: seoDescription.value
    },
    {
      property: 'og:url',
      content: pageUrl.value
    },
    {
      property: 'og:image',
      content: seoImage.value
    },
    {
      property: 'og:site_name',
      content: 'Obayan'
    },
    {
      property: 'og:locale',
      content: 'id_ID'
    },

    // Twitter / X
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: seoTitle.value
    },
    {
      name: 'twitter:description',
      content: seoDescription.value
    },
    {
      name: 'twitter:image',
      content: seoImage.value
    }
  ],

  link: [
    {
      rel: 'canonical',
      href: pageUrl.value
    },
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: faviconUrl.value
    },
    {
      rel: 'shortcut icon',
      href: faviconUrl.value
    },
    {
      rel: 'apple-touch-icon',
      href: faviconUrl.value
    }
  ]
}))

const statusClass = computed(() => {
  const status = currentInvoice.value?.status

  if (status === 'paid') return 'bg-green-100 text-green-700'
  if (status === 'failed' || status === 'expired' || status === 'cancelled') return 'bg-red-100 text-red-700'
  if (status === 'pending') return 'bg-amber-100 text-amber-700'

  return 'bg-white/10 text-slate-200'
})

async function autoDownloadPaidInvoice() {
  if (!currentInvoice.value) return
  if (currentInvoice.value.status !== 'paid') return

  const orderId = String(currentInvoice.value.orderId || '')
  if (!orderId) return

  // Biar tidak download dobel kalau callback terpanggil ulang
  if (downloadedInvoiceOrderIds.value.has(orderId)) return
  downloadedInvoiceOrderIds.value.add(orderId)

  await nextTick()

  // Kasih jeda kecil agar DOM invoice hidden benar-benar sudah render
  await new Promise((resolve) => setTimeout(resolve, 350))

  if (!invoicePrintArea.value) return

  const html2pdf = (await import('html2pdf.js')).default

  const filename = `${currentInvoice.value.invoiceNo || 'invoice-obayan'}.pdf`

  await html2pdf()
    .set({
      margin: 8,
      filename,
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    })
    .from(invoicePrintArea.value)
    .save()
}

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

  if (PAYMENT_PACKAGES[id].isOneTime) {
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
    errors.general = 'Setujui Terms & Conditions terlebih dahulu sebelum lanjut pembayaran.'
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

async function generateInvoiceAndPay() {
  errors.general = ''
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

  submitting.value = true

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

    await createInvoice(response.invoice)
    await loadSnapScript()

    window.snap.pay(response.midtrans.token, {
      onSuccess: async (result: unknown) => {
            currentInvoice.value.status = 'paid'
            currentInvoice.value.paymentResult = result

            await updateInvoiceStatus(response.orderId, 'paid', result)
            await activateTenantSubscription(response.invoice, result)
            try {
                await autoDownloadPaidInvoice()
            } catch (downloadError) {
                console.error('Gagal auto download invoice:', downloadError)
                errors.general = 'Pembayaran berhasil, tapi invoice belum berhasil diunduh otomatis. Silakan cek data invoice di sistem.'
            }
        },

      onPending: async (result: unknown) => {
        currentInvoice.value.status = 'pending'
        await updateInvoiceStatus(response.orderId, 'pending', result)
      },

      onError: async (result: unknown) => {
        currentInvoice.value.status = 'failed'
        await updateInvoiceStatus(response.orderId, 'failed', result)
      },

      onClose: async () => {
        if (currentInvoice.value?.status === 'waiting_payment') {
          currentInvoice.value.status = 'pending'
          await updateInvoiceStatus(response.orderId, 'pending', {
            source: 'snap_closed_by_customer'
          })
        }
      }
    })
  } catch (e: any) {
    errors.general = e?.data?.message || e?.statusMessage || e?.message || 'Pembayaran belum bisa dibuat. Coba cek konfigurasi Midtrans atau koneksi server.'
  } finally {
    submitting.value = false
  }
}
</script>