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
            Support Center
          </div>

          <h1 class="mt-4 text-2xl font-black tracking-tight md:text-4xl">
            Kontak Lembaga
          </h1>

          <p class="mt-2 max-w-xl text-sm leading-6 text-green-50/90 md:text-base">
            Hubungi admin, pengurus, wali kelas, bendahara, atau lembaga pendidikan melalui kontak resmi dan chat realtime.
          </p>
        </div>

        <div class="min-w-0 rounded-[28px] bg-white/13 p-4 ring-1 ring-white/15 backdrop-blur lg:w-[390px]">
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
              <div class="text-lg font-black">{{ contactItems.length }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Kontak</div>
            </div>

            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ adminContacts.length }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Admin</div>
            </div>

            <div class="rounded-2xl bg-white/12 p-3 text-center">
              <div class="text-lg font-black">{{ chatMessages.length }}</div>
              <div class="mt-0.5 text-[11px] font-semibold text-green-50/80">Chat</div>
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
        Akun wali ini belum memiliki santri yang terhubung.
      </p>
    </div>

    <template v-else>
      <div v-if="loading" class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="i in 4"
          :key="i"
          class="h-36 animate-pulse rounded-[28px] bg-slate-100 dark:bg-neutral-800"
        ></div>
      </div>

      <template v-else>
        <!-- Summary -->
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Telepon
                </div>

                <div class="mt-2 truncate text-xl font-black text-slate-900 dark:text-white">
                  {{ institutionContact.phone || '—' }}
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Nomor resmi lembaga.
                </p>
              </div>

              <button
                type="button"
                @click="openPhone(institutionContact.phone)"
                class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 transition hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300"
              >
                <Icon icon="ph:phone-call-duotone" class="h-6 w-6" />
              </button>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  WhatsApp
                </div>

                <div class="mt-2 truncate text-xl font-black text-slate-900 dark:text-white">
                  {{ institutionContact.whatsapp || '—' }}
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Chat cepat via WhatsApp.
                </p>
              </div>

              <button
                type="button"
                @click="openWhatsApp(institutionContact.whatsapp, 'Assalamualaikum, saya wali santri ingin bertanya.')"
                class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-lime-50 text-lime-700 transition hover:bg-lime-100 dark:bg-lime-900/20 dark:text-lime-300"
              >
                <Icon icon="ic:baseline-whatsapp" class="h-6 w-6" />
              </button>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Email
                </div>

                <div class="mt-2 truncate text-xl font-black text-slate-900 dark:text-white">
                  {{ institutionContact.email || '—' }}
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Kontak administrasi resmi.
                </p>
              </div>

              <button
                type="button"
                @click="openEmail(institutionContact.email)"
                class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 transition hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300"
              >
                <Icon icon="ph:envelope-simple-duotone" class="h-6 w-6" />
              </button>
            </div>
          </div>

          <div class="rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="text-xs font-black uppercase tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  Alamat
                </div>

                <div class="mt-2 line-clamp-1 text-xl font-black text-slate-900 dark:text-white">
                  {{ institutionContact.address || '—' }}
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Lokasi lembaga pendidikan.
                </p>
              </div>

              <button
                type="button"
                @click="openMaps(institutionContact.mapsUrl || institutionContact.address)"
                class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-700 transition hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300"
              >
                <Icon icon="ph:map-pin-duotone" class="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <!-- Main Layout -->
        <div class="grid gap-4 xl:grid-cols-[0.9fr,1.1fr]">
          <!-- Contact Info -->
          <div class="space-y-4">
            <div class="relative overflow-hidden rounded-[32px] border border-white/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-green-100 blur-3xl dark:bg-green-900/20"></div>

              <div class="relative z-10">
                <div class="flex items-start gap-4">
                  <div class="grid h-16 w-16 shrink-0 place-items-center rounded-[24px] bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    <Icon icon="ph:buildings-duotone" class="h-8 w-8" />
                  </div>

                  <div class="min-w-0">
                    <div class="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
                      <Icon icon="ph:shield-check-duotone" class="h-4 w-4" />
                      Kontak Resmi
                    </div>

                    <h2 class="mt-3 text-xl font-black text-slate-900 dark:text-white">
                      {{ institutionContact.name }}
                    </h2>

                    <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                      {{ institutionContact.description }}
                    </p>
                  </div>
                </div>

                <div class="mt-5 space-y-3">
                  <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                    <div class="text-xs font-bold text-slate-500 dark:text-neutral-400">Jam Layanan</div>
                    <div class="mt-1 font-black text-slate-900 dark:text-white">
                      {{ institutionContact.serviceHours }}
                    </div>
                  </div>

                  <div class="rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                    <div class="text-xs font-bold text-slate-500 dark:text-neutral-400">Alamat Lengkap</div>
                    <div class="mt-1 text-sm font-bold leading-6 text-slate-900 dark:text-white">
                      {{ institutionContact.address }}
                    </div>
                  </div>
                </div>

                <div class="mt-5 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    @click="openWhatsApp(institutionContact.whatsapp, defaultWhatsappMessage)"
                    class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                  >
                    <Icon icon="ic:baseline-whatsapp" class="h-5 w-5" />
                    WhatsApp
                  </button>

                  <button
                    type="button"
                    @click="openMaps(institutionContact.mapsUrl || institutionContact.address)"
                    class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    <Icon icon="ph:map-pin-duotone" class="h-5 w-5" />
                    Buka Maps
                  </button>
                </div>
              </div>
            </div>

            <!-- Contact Toolbar -->
            <div class="rounded-[32px] border border-white/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="grid gap-3 md:grid-cols-[1fr,0.7fr]">
                <div class="relative">
                  <input
                    v-model="filters.q"
                    type="text"
                    placeholder="Cari admin, pengurus, bendahara, wali kelas..."
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
                  <option value="semua">Semua Kontak</option>
                  <option
                    v-for="category in categoryOptions"
                    :key="category"
                    :value="category"
                  >
                    {{ category }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Contact List -->
            <div class="rounded-[32px] border border-white/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="border-b border-slate-100 p-5 dark:border-neutral-800">
                <h2 class="text-base font-black text-slate-900 dark:text-white">
                  Daftar Kontak Admin & Pengurus
                </h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                  Pilih kontak sesuai kebutuhan wali santri.
                </p>
              </div>

              <div v-if="filteredContacts.length === 0" class="p-10 text-center">
                <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <Icon icon="ph:address-book-duotone" class="h-8 w-8" />
                </div>

                <h3 class="mt-4 text-lg font-black text-slate-900 dark:text-white">
                  Kontak tidak ditemukan
                </h3>

                <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                  Coba ubah kata kunci atau kategori.
                </p>
              </div>

              <div v-else class="divide-y divide-slate-100 dark:divide-neutral-800">
                <div
                  v-for="contact in filteredContacts"
                  :key="contact.id"
                  class="p-5 transition hover:bg-slate-50/70 dark:hover:bg-neutral-800/40"
                >
                  <div class="flex items-start gap-3">
                    <div :class="['grid h-12 w-12 shrink-0 place-items-center rounded-2xl', contactIconClass(contact.category)]">
                      <Icon :icon="contact.icon" class="h-6 w-6" />
                    </div>

                    <div class="min-w-0 flex-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <h3 class="font-black text-slate-900 dark:text-white">
                          {{ contact.name }}
                        </h3>

                        <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600 dark:bg-neutral-800 dark:text-neutral-300">
                          {{ contact.category }}
                        </span>
                      </div>

                      <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                        {{ contact.role || contact.description || 'Kontak lembaga pendidikan.' }}
                      </p>

                      <div class="mt-3 flex flex-wrap gap-2">
                        <button
                          v-if="contact.whatsapp || contact.phone"
                          type="button"
                          @click="openWhatsApp(contact.whatsapp || contact.phone, messageForContact(contact))"
                          class="inline-flex items-center gap-1.5 rounded-xl bg-green-50 px-3 py-2 text-xs font-black text-green-700 transition hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300"
                        >
                          <Icon icon="ic:baseline-whatsapp" class="h-4 w-4" />
                          WA
                        </button>

                        <button
                          v-if="contact.phone"
                          type="button"
                          @click="openPhone(contact.phone)"
                          class="inline-flex items-center gap-1.5 rounded-xl bg-green-50 px-3 py-2 text-xs font-black text-green-700 transition hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300"
                        >
                          <Icon icon="ph:phone-call-duotone" class="h-4 w-4" />
                          Telp
                        </button>

                        <button
                          v-if="contact.email"
                          type="button"
                          @click="openEmail(contact.email)"
                          class="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-2 text-xs font-black text-amber-700 transition hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300"
                        >
                          <Icon icon="ph:envelope-simple-duotone" class="h-4 w-4" />
                          Email
                        </button>

                        <button
                          type="button"
                          @click="selectChatTarget(contact)"
                          class="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                        >
                          <Icon icon="ph:chat-circle-text-duotone" class="h-4 w-4" />
                          Chat
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Chat -->
          <div class="rounded-[32px] border border-white/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 xl:sticky xl:top-6 xl:self-start">
            <div class="border-b border-slate-100 p-5 dark:border-neutral-800">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    <Icon icon="ph:chats-circle-duotone" class="h-4 w-4" />
                    Chat Message
                  </div>

                  <h2 class="mt-3 text-lg font-black text-slate-900 dark:text-white">
                    Chat dengan Admin / Pengurus
                  </h2>

                  <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                    Kirim pesan langsung terkait administrasi, santri, perizinan, pembayaran, atau kebutuhan lainnya.
                  </p>
                </div>

                <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <Icon icon="ph:headset-duotone" class="h-6 w-6" />
                </div>
              </div>

              <div class="mt-4 grid gap-3 md:grid-cols-[1fr,0.9fr]">
                <div>
                  <label class="mb-2 block text-xs font-black text-slate-500 dark:text-neutral-400">
                    Tujuan Chat
                  </label>

                  <select
                    v-model="selectedContactId"
                    class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option
                      v-for="contact in adminContacts"
                      :key="contact.id"
                      :value="contact.id"
                    >
                      {{ contact.name }} - {{ contact.category }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="mb-2 block text-xs font-black text-slate-500 dark:text-neutral-400">
                    Topik
                  </label>

                  <select
                    v-model="chatTopic"
                    class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="Administrasi">Administrasi</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Pembayaran">Pembayaran</option>
                    <option value="Perizinan">Perizinan</option>
                    <option value="Kunjungan">Kunjungan</option>
                    <option value="Pelanggaran">Pelanggaran</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>
            </div>

            <div
              ref="chatContainer"
              class="h-[430px] space-y-3 overflow-y-auto bg-slate-50 p-5 dark:bg-neutral-950/40"
            >
              <div
                v-if="chatMessages.length === 0"
                class="flex h-full items-center justify-center text-center"
              >
                <div>
                  <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    <Icon icon="ph:chat-circle-text-duotone" class="h-8 w-8" />
                  </div>

                  <h3 class="mt-4 text-base font-black text-slate-900 dark:text-white">
                    Belum ada pesan
                  </h3>

                  <p class="mt-1 max-w-xs text-sm leading-6 text-slate-500 dark:text-neutral-400">
                    Mulai percakapan dengan admin atau pengurus melalui form di bawah.
                  </p>
                </div>
              </div>

              <div
                v-for="message in chatMessages"
                :key="message.id"
                :class="[
                  'flex',
                  isMyMessage(message) ? 'justify-end' : 'justify-start'
                ]"
              >
                <div
                  :class="[
                    'max-w-[82%] rounded-[24px] px-4 py-3 shadow-sm',
                    isMyMessage(message)
                      ? 'rounded-br-md bg-green-600 text-white'
                      : 'rounded-bl-md border border-slate-100 bg-white text-slate-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200'
                  ]"
                >
                  <div
                    :class="[
                      'mb-1 text-[11px] font-black',
                      isMyMessage(message) ? 'text-green-50/80' : 'text-slate-400 dark:text-neutral-500'
                    ]"
                  >
                    {{ message.senderName || 'Pengirim' }} • {{ formatTime(message.createdAt) }}
                  </div>

                  <p class="whitespace-pre-line text-sm leading-6">
                    {{ message.text }}
                  </p>

                  <div
                    v-if="message.topic"
                    :class="[
                      'mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-black',
                      isMyMessage(message)
                        ? 'bg-white/15 text-white'
                        : 'bg-slate-100 text-slate-500 dark:bg-neutral-800 dark:text-neutral-400'
                    ]"
                  >
                    {{ message.topic }}
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-slate-100 p-5 dark:border-neutral-800">
              <div class="mb-3 flex gap-2 overflow-x-auto pb-1">
                <button
                  v-for="quick in quickMessages"
                  :key="quick"
                  type="button"
                  @click="chatText = quick"
                  class="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  {{ quick }}
                </button>
              </div>

              <form class="flex gap-2" @submit.prevent="sendChatMessage">
                <textarea
                  v-model.trim="chatText"
                  rows="2"
                  placeholder="Tulis pesan untuk admin/pengurus..."
                  class="min-h-12 flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-green-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                ></textarea>

                <button
                  type="submit"
                  :disabled="chatLoading || !chatText.trim()"
                  class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon
                    v-if="chatLoading"
                    icon="ph:spinner-gap-duotone"
                    class="h-5 w-5 animate-spin"
                  />
                  <Icon
                    v-else
                    icon="ph:paper-plane-tilt-duotone"
                    class="h-5 w-5"
                  />
                </button>
              </form>

              <p
                v-if="chatError"
                class="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300"
              >
                {{ chatError }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </template>

    <!-- Toast -->
    <div
      v-if="toastMessage"
      class="fixed bottom-24 left-1/2 z-[9999] w-[92%] max-w-sm -translate-x-1/2 rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white shadow-2xl"
    >
      {{ toastMessage }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { onValue, push, ref as dbRef, set, update } from 'firebase/database'
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

type ContactItem = {
  id: string
  name: string
  category: string
  role: string
  description: string
  phone: string
  whatsapp: string
  email: string
  address: string
  mapsUrl: string
  icon: string
  raw?: AnyRow
}

type ChatMessage = {
  id: string
  text: string
  senderId: string
  senderName: string
  senderRole: string
  receiverId: string
  receiverName: string
  topic: string
  santriId: string
  santriName: string
  createdAt: number
  status: string
}

const config = useRuntimeConfig()
const { $realtimeDb } = useNuxtApp() as any
const sessionUser = useState<any>('sessionUser', () => ({}))

const clientName = String(config.public.clientName || 'alinayah')
const clientDisplayName = String(config.public.clientDisplayName || config.public.siteName || 'Lembaga Pendidikan')

const loading = ref(true)
const selectedSantriId = ref('')
const santriProfiles = ref<SantriProfile[]>([])
const settingsRaw = ref<AnyRow>({})
const contactRawRows = ref<AnyRow[]>([])
const userRawRows = ref<AnyRow[]>([])

const selectedContactId = ref('')
const chatTopic = ref('Administrasi')
const chatText = ref('')
const chatLoading = ref(false)
const chatError = ref('')
const chatMessages = ref<ChatMessage[]>([])
const toastMessage = ref('')
const chatContainer = ref<HTMLElement | null>(null)

const filters = ref({
  q: '',
  category: 'semua'
})

let unsubscribers: Array<() => void> = []
let chatUnsubscribe: (() => void) | null = null
let stopSessionWatch: (() => void) | null = null
let toastTimer: ReturnType<typeof setTimeout> | null = null

const bucketMap = new Map<string, { target: typeof contactRawRows; rows: AnyRow[] }>()

const quickMessages = [
  'Assalamualaikum, saya ingin bertanya terkait administrasi santri.',
  'Mohon informasi perkembangan santri saya.',
  'Saya ingin konfirmasi pembayaran.',
  'Saya ingin bertanya terkait jadwal kunjungan.',
  'Saya ingin mengajukan pertanyaan terkait perizinan.'
]

const currentSantri = computed(() => {
  return santriProfiles.value.find((item) => item.id === selectedSantriId.value) || santriProfiles.value[0] || null
})

const defaultWhatsappMessage = computed(() => {
  return `Assalamualaikum, saya wali dari ${santriNameOf(currentSantri.value)} ingin bertanya kepada admin.`
})

const institutionContact = computed(() => {
  const settings = settingsRaw.value || {}
  const contact = settings.contact || settings.kontak || settings.profile || {}

  return {
    name: contact.name || settings.siteName || settings.namaLembaga || clientDisplayName || 'Lembaga Pendidikan',
    description: contact.description || settings.siteDescription || settings.deskripsi || 'Pusat informasi resmi untuk wali santri.',
    phone: contact.phone || contact.telepon || settings.phone || settings.telepon || '',
    whatsapp: contact.whatsapp || contact.wa || settings.whatsapp || settings.wa || contact.phone || settings.phone || '',
    email: contact.email || settings.email || '',
    address: contact.address || contact.alamat || settings.address || settings.alamat || 'Alamat lembaga belum diatur.',
    mapsUrl: contact.mapsUrl || contact.googleMaps || settings.mapsUrl || settings.googleMaps || '',
    serviceHours: contact.serviceHours || contact.jamLayanan || settings.serviceHours || 'Senin - Sabtu, 08.00 - 16.00'
  }
})

const defaultContacts = computed<ContactItem[]>(() => [
  {
    id: 'default-admin',
    name: 'Admin Lembaga',
    category: 'Admin',
    role: 'Informasi umum, akun wali, dan bantuan sistem.',
    description: 'Kontak utama untuk kebutuhan wali santri.',
    phone: institutionContact.value.phone,
    whatsapp: institutionContact.value.whatsapp,
    email: institutionContact.value.email,
    address: institutionContact.value.address,
    mapsUrl: institutionContact.value.mapsUrl,
    icon: 'ph:headset-duotone'
  },
  {
    id: 'default-bendahara',
    name: 'Bendahara / Keuangan',
    category: 'Keuangan',
    role: 'Konfirmasi SPP, tagihan, invoice, dan pembayaran.',
    description: 'Kontak untuk informasi pembayaran dan administrasi keuangan.',
    phone: institutionContact.value.phone,
    whatsapp: institutionContact.value.whatsapp,
    email: institutionContact.value.email,
    address: institutionContact.value.address,
    mapsUrl: institutionContact.value.mapsUrl,
    icon: 'akar-icons:money'
  },
  {
    id: 'default-pengurus',
    name: 'Pengurus Santri',
    category: 'Pengurus',
    role: 'Informasi harian, kedisiplinan, perizinan, dan kunjungan.',
    description: 'Kontak untuk kebutuhan komunikasi dengan pengurus.',
    phone: institutionContact.value.phone,
    whatsapp: institutionContact.value.whatsapp,
    email: institutionContact.value.email,
    address: institutionContact.value.address,
    mapsUrl: institutionContact.value.mapsUrl,
    icon: 'ph:users-three-duotone'
  }
])

const contactItems = computed<ContactItem[]>(() => {
  const rows: ContactItem[] = []

  for (const row of contactRawRows.value) {
    rows.push(normalizeContact(row, rows.length))
  }

  for (const row of userRawRows.value) {
    if (looksLikeAdminUser(row)) {
      rows.push(normalizeUserContact(row, rows.length))
    }
  }

  const merged = rows.filter((item) => item.name || item.phone || item.whatsapp || item.email)

  return merged.length ? dedupeContacts(merged) : defaultContacts.value
})

const adminContacts = computed(() => {
  const preferred = contactItems.value.filter((item) => {
    const category = normalizeText(item.category)
    return category.includes('admin') ||
      category.includes('pengurus') ||
      category.includes('wali kelas') ||
      category.includes('keuangan') ||
      category.includes('bendahara')
  })

  return preferred.length ? preferred : contactItems.value
})

const filteredContacts = computed(() => {
  return contactItems.value.filter((item) => {
    if (filters.value.category !== 'semua' && item.category !== filters.value.category) return false

    if (filters.value.q.trim()) {
      const q = normalizeText(filters.value.q)
      const text = normalizeText([
        item.name,
        item.category,
        item.role,
        item.description,
        item.phone,
        item.whatsapp,
        item.email,
        item.address
      ].join(' '))

      if (!text.includes(q)) return false
    }

    return true
  })
})

const categoryOptions = computed(() => {
  return Array.from(new Set(contactItems.value.map((item) => item.category).filter(Boolean))).sort()
})

const selectedContact = computed(() => {
  return adminContacts.value.find((item) => item.id === selectedContactId.value) || adminContacts.value[0] || null
})

const currentThreadId = computed(() => {
  const uid = getCurrentUid()
  const santriId = selectedSantriId.value || 'general'
  const contactId = selectedContact.value?.id || 'admin'

  return `${uid}_${santriId}_${safeKey(contactId)}`
})

watch(adminContacts, (contacts) => {
  if (!selectedContactId.value && contacts.length) {
    selectedContactId.value = contacts[0].id
  }
}, { immediate: true })

watch(
  () => currentThreadId.value,
  () => {
    setupChat()
  },
  { immediate: false }
)

watch(chatMessages, async () => {
  await nextTick()
  scrollChatToBottom()
})

function normalizeContact(row: AnyRow, index: number): ContactItem {
  const category = String(row.category || row.kategori || row.division || row.divisi || row.role || 'Kontak')

  return {
    id: String(row.id || row._uid || row.key || `contact-${index}`),
    name: String(row.name || row.nama || row.title || row.judul || 'Kontak Lembaga'),
    category,
    role: String(row.role || row.jabatan || row.position || row.description || row.keterangan || ''),
    description: String(row.description || row.keterangan || row.note || ''),
    phone: String(row.phone || row.telepon || row.telp || row.nohp || row.noHp || row.nomorHp || ''),
    whatsapp: String(row.whatsapp || row.wa || row.noWa || row.no_wa || row.phone || row.nohp || ''),
    email: String(row.email || row.mail || ''),
    address: String(row.address || row.alamat || ''),
    mapsUrl: String(row.mapsUrl || row.googleMaps || row.mapUrl || ''),
    icon: String(row.icon || iconByCategory(category)),
    raw: row
  }
}

function normalizeUserContact(row: AnyRow, index: number): ContactItem {
  const category = userCategory(row)

  return {
    id: String(row.uid || row.id || row._uid || row.key || `user-${index}`),
    name: String(row.name || row.displayName || row.nama || row.email || 'Admin'),
    category,
    role: String(row.roleName || row.role || row.jabatan || category),
    description: String(row.description || row.keterangan || ''),
    phone: String(row.phone || row.waliPhone || row.nohp || row.noHp || row.nomorHp || ''),
    whatsapp: String(row.whatsapp || row.wa || row.phone || row.nohp || ''),
    email: String(row.email || ''),
    address: String(row.address || row.alamat || ''),
    mapsUrl: '',
    icon: iconByCategory(category),
    raw: row
  }
}

function looksLikeAdminUser(row: AnyRow) {
  const text = normalizeText([
    row.role,
    row.roleName,
    row.jabatan,
    row.type,
    row.category,
    row.kategori,
    row.email
  ].join(' '))

  return text.includes('admin') ||
    text.includes('pengurus') ||
    text.includes('bendahara') ||
    text.includes('keuangan') ||
    text.includes('wali kelas') ||
    text.includes('superadmin')
}

function userCategory(row: AnyRow) {
  const text = normalizeText([row.role, row.roleName, row.jabatan, row.category, row.kategori].join(' '))

  if (text.includes('bendahara') || text.includes('keuangan')) return 'Keuangan'
  if (text.includes('wali kelas')) return 'Wali Kelas'
  if (text.includes('pengurus')) return 'Pengurus'
  if (text.includes('superadmin')) return 'Admin'

  return 'Admin'
}

function dedupeContacts(items: ContactItem[]) {
  const seen = new Set<string>()
  const result: ContactItem[] = []

  for (const item of items) {
    const key = normalizeText(`${item.name}-${item.category}-${item.phone}-${item.email}`)

    if (seen.has(key)) continue

    seen.add(key)
    result.push(item)
  }

  return result
}

function iconByCategory(category: string) {
  const text = normalizeText(category)

  if (text.includes('keuangan') || text.includes('bendahara')) return 'akar-icons:money'
  if (text.includes('wali kelas') || text.includes('akademik')) return 'ph:chalkboard-teacher-duotone'
  if (text.includes('pengurus')) return 'ph:users-three-duotone'
  if (text.includes('admin')) return 'ph:headset-duotone'
  if (text.includes('alamat') || text.includes('lokasi')) return 'ph:map-pin-duotone'

  return 'ph:address-book-duotone'
}

function contactIconClass(category: string) {
  const text = normalizeText(category)

  if (text.includes('keuangan') || text.includes('bendahara')) return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
  if (text.includes('wali kelas') || text.includes('akademik')) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  if (text.includes('pengurus')) return 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
  if (text.includes('admin')) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'

  return 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
}

function messageForContact(contact: ContactItem) {
  return `Assalamualaikum, saya wali dari ${santriNameOf(currentSantri.value)} ingin menghubungi ${contact.name} terkait ${contact.category}.`
}

function selectChatTarget(contact: ContactItem) {
  selectedContactId.value = contact.id
  chatTopic.value = contact.category || 'Administrasi'
  showToast(`Chat diarahkan ke ${contact.name}.`)
}

async function sendChatMessage() {
  chatError.value = ''

  if (!chatText.value.trim()) {
    chatError.value = 'Pesan tidak boleh kosong.'
    return
  }

  if (!$realtimeDb) {
    chatError.value = 'Koneksi database belum tersedia.'
    return
  }

  const uid = getCurrentUid()

  if (!uid) {
    chatError.value = 'Sesi wali tidak ditemukan. Silakan login ulang.'
    return
  }

  const target = selectedContact.value

  if (!target) {
    chatError.value = 'Tujuan chat belum tersedia.'
    return
  }

  chatLoading.value = true

  try {
    const now = Date.now()
    const threadPath = `${clientName}/waliChats/${currentThreadId.value}`
    const messageRef = push(dbRef($realtimeDb, `${threadPath}/messages`))

    const payload: ChatMessage = {
      id: messageRef.key || '',
      text: chatText.value.trim(),
      senderId: uid,
      senderName: sessionUser.value?.name || sessionUser.value?.displayName || 'Wali Santri',
      senderRole: 'wali',
      receiverId: target.id,
      receiverName: target.name,
      topic: chatTopic.value,
      santriId: selectedSantriId.value || '',
      santriName: santriNameOf(currentSantri.value),
      createdAt: now,
      status: 'sent'
    }

    await set(messageRef, payload)

    await update(dbRef($realtimeDb, threadPath), {
      threadId: currentThreadId.value,
      waliId: uid,
      waliName: sessionUser.value?.name || sessionUser.value?.displayName || 'Wali Santri',
      adminId: target.id,
      adminName: target.name,
      santriId: selectedSantriId.value || '',
      santriName: santriNameOf(currentSantri.value),
      topic: chatTopic.value,
      lastMessage: payload.text,
      lastMessageAt: now,
      updatedAt: now,
      status: 'open'
    })

    chatText.value = ''
    showToast('Pesan berhasil dikirim.')
  } catch (e: any) {
    chatError.value = e?.message || 'Gagal mengirim pesan.'
  } finally {
    chatLoading.value = false
  }
}

function setupChat() {
  if (!$realtimeDb) return

  if (chatUnsubscribe) {
    try {
      chatUnsubscribe()
    } catch {}

    chatUnsubscribe = null
  }

  chatMessages.value = []

  if (!getCurrentUid() || !selectedContact.value) return

  chatUnsubscribe = onValue(dbRef($realtimeDb, `${clientName}/waliChats/${currentThreadId.value}/messages`), (snap) => {
    const value = snap.val()
    const rows: ChatMessage[] = []

    if (value && typeof value === 'object') {
      for (const [id, raw] of Object.entries(value as Record<string, any>)) {
        rows.push({
          id: String((raw as AnyRow).id || id),
          text: String((raw as AnyRow).text || ''),
          senderId: String((raw as AnyRow).senderId || ''),
          senderName: String((raw as AnyRow).senderName || ''),
          senderRole: String((raw as AnyRow).senderRole || ''),
          receiverId: String((raw as AnyRow).receiverId || ''),
          receiverName: String((raw as AnyRow).receiverName || ''),
          topic: String((raw as AnyRow).topic || ''),
          santriId: String((raw as AnyRow).santriId || ''),
          santriName: String((raw as AnyRow).santriName || ''),
          createdAt: parseDateValue((raw as AnyRow).createdAt) || Date.now(),
          status: String((raw as AnyRow).status || 'sent')
        })
      }
    }

    chatMessages.value = rows.sort((a, b) => a.createdAt - b.createdAt)
  })
}

function scrollChatToBottom() {
  const el = chatContainer.value
  if (!el) return

  el.scrollTop = el.scrollHeight
}

function isMyMessage(message: ChatMessage) {
  return message.senderId === getCurrentUid() || message.senderRole === 'wali'
}

function clearSubscriptions() {
  for (const unsubscribe of unsubscribers) {
    try {
      unsubscribe()
    } catch {}
  }

  unsubscribers = []

  if (chatUnsubscribe) {
    try {
      chatUnsubscribe()
    } catch {}

    chatUnsubscribe = null
  }

  bucketMap.clear()
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

  const settingsUnsubscribe = onValue(dbRef($realtimeDb, `${clientName}/settings`), (snap) => {
    settingsRaw.value = snap.val() || {}
    loading.value = false
  })

  unsubscribers.push(settingsUnsubscribe)

  subscribeDeep(`${clientName}/contacts`, contactRawRows)
  subscribeDeep(`${clientName}/contact`, contactRawRows)
  subscribeDeep(`${clientName}/kontak`, contactRawRows)
  subscribeDeep(`${clientName}/pengurus`, contactRawRows)

  subscribeDeep(`${clientName}/users`, userRawRows)
  subscribeDeep(`${clientName}/user`, userRawRows)
  subscribeDeep(`${clientName}/adminUsers`, userRawRows)

  setTimeout(() => {
    loading.value = false
    setupChat()
  }, 1200)
}

function subscribeDeep(path: string, target: typeof contactRawRows) {
  if (!$realtimeDb) return

  const unsubscribe = onValue(dbRef($realtimeDb, path), (snap) => {
    bucketMap.set(path, {
      target,
      rows: flattenRecords(snap.val(), [path], 0)
    })

    rebuildTarget(target)
    loading.value = false
  })

  unsubscribers.push(unsubscribe)
}

function rebuildTarget(target: typeof contactRawRows) {
  const rows: AnyRow[] = []

  for (const bucket of bucketMap.values()) {
    if (bucket.target === target) {
      rows.push(...bucket.rows)
    }
  }

  target.value = rows
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

  if (looksLikeContactRecord(objectValue)) {
    return [
      {
        _uid: objectValue.id || objectValue.uid || objectValue.key || lastPath || pathText,
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

function looksLikeContactRecord(row: AnyRow) {
  const keys = Object.keys(row)

  return keys.some((key) => [
    'name',
    'nama',
    'displayName',
    'title',
    'judul',
    'role',
    'roleName',
    'jabatan',
    'category',
    'kategori',
    'phone',
    'telepon',
    'telp',
    'nohp',
    'noHp',
    'whatsapp',
    'wa',
    'email',
    'address',
    'alamat'
  ].includes(key))
}

function getCurrentUid() {
  return String(
    sessionUser.value?.uid ||
    sessionUser.value?.sub ||
    sessionUser.value?.id ||
    ''
  )
}

function santriNameOf(santri?: AnyRow | null) {
  if (!santri) return sessionUser.value?.santriName || 'Santri'
  return santri.santri || santri.nama || santri.namaSantri || santri.name || sessionUser.value?.santriName || 'Santri'
}

function safeKey(value: string) {
  return String(value || '')
    .replace(/[.#$/\[\]]/g, '_')
    .replace(/\s+/g, '_')
}

function normalizePhoneID(input?: string) {
  let digits = String(input || '').trim().replace(/[^\d]/g, '')

  if (!digits) return ''
  if (digits.startsWith('0062')) digits = '62' + digits.slice(4)
  if (digits.startsWith('62')) return digits
  if (digits.startsWith('8')) return '62' + digits
  if (digits.startsWith('0')) return '62' + digits.slice(1)

  return digits
}

function openWhatsApp(phone?: string, message?: string) {
  const normalized = normalizePhoneID(phone)

  if (!normalized) {
    showToast('Nomor WhatsApp belum tersedia.')
    return
  }

  const url = `https://wa.me/${normalized}?text=${encodeURIComponent(message || defaultWhatsappMessage.value)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

function openPhone(phone?: string) {
  const normalized = String(phone || '').trim()

  if (!normalized) {
    showToast('Nomor telepon belum tersedia.')
    return
  }

  window.location.href = `tel:${normalized}`
}

function openEmail(email?: string) {
  const target = String(email || '').trim()

  if (!target) {
    showToast('Email belum tersedia.')
    return
  }

  window.location.href = `mailto:${target}`
}

function openMaps(value?: string) {
  const target = String(value || '').trim()

  if (!target) {
    showToast('Alamat atau link maps belum tersedia.')
    return
  }

  if (target.startsWith('http')) {
    window.open(target, '_blank', 'noopener,noreferrer')
    return
  }

  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(target)}`, '_blank', 'noopener,noreferrer')
}

function showToast(message: string) {
  toastMessage.value = message

  if (toastTimer) clearTimeout(toastTimer)

  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 2200)
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

function formatTime(value?: number) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

function normalizeText(value?: any) {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
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

  if (toastTimer) {
    clearTimeout(toastTimer)
  }
})
</script>