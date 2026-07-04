<template>
  <main class="fixed inset-0 z-[9999] min-h-screen overflow-y-auto bg-gray-50 text-gray-800">
    <section class="mx-auto flex min-h-screen w-full max-w-4xl items-center px-4 py-8 sm:px-6">
      <div class="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl shadow-gray-200/60">
        <div class="h-1.5 bg-green-500"></div>

        <div class="grid gap-0 lg:grid-cols-[minmax(0,1fr),320px]">
          <div class="p-5 sm:p-7">
            <div class="flex items-center gap-3">
              <span class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
                <img :src="appLogo" :alt="`Logo ${clientDisplayName}`" class="h-full w-full object-contain" />
              </span>
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-gray-900">{{ clientDisplayName }}</p>
                <div class="mt-1 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-100">
                  <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  Out of service
                </div>
              </div>
            </div>

            <div class="mt-7 max-w-xl">
              <div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600 ring-1 ring-green-100">
                <Icon icon="ph:lock-key-duotone" class="size-7" />
              </div>
              <h1 class="text-2xl font-bold leading-tight tracking-normal text-gray-950 sm:text-3xl">
                Layanan sementara tidak aktif
              </h1>
              <p class="mt-3 text-sm leading-6 text-gray-600">
                Akses website {{ clientDisplayName }} sedang dijeda karena masa layanan telah berakhir.
                Hubungi tim support untuk reaktivasi atau perpanjangan layanan.
              </p>
            </div>

            <div class="mt-6 flex flex-wrap gap-2.5">
              <a
                v-if="whatsAppUrl"
                :href="whatsAppUrl"
                target="_blank"
                rel="noopener"
                class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-green-500 px-4 text-sm font-semibold text-white shadow-sm shadow-green-500/20 transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <Icon icon="mdi:whatsapp" class="size-4" />
                WhatsApp
              </a>
              <a
                :href="`mailto:${supportEmail}`"
                class="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <Icon icon="ph:envelope-simple" class="size-4" />
                Email
              </a>
            </div>
          </div>

          <aside class="border-t border-gray-200 bg-gray-50 p-5 sm:p-6 lg:border-l lg:border-t-0">
            <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <h2 class="text-sm font-bold text-gray-950">Detail layanan</h2>
              <dl class="mt-4 space-y-3 text-sm">
                <div class="flex items-center justify-between gap-4">
                  <dt class="text-gray-500">Status</dt>
                  <dd class="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-100">
                    <span class="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                    Tidak aktif
                  </dd>
                </div>
                <div v-if="expiredAtLabel" class="flex items-center justify-between gap-4">
                  <dt class="text-gray-500">Tanggal akhir</dt>
                  <dd class="text-right font-semibold text-gray-900">{{ expiredAtLabel }}</dd>
                </div>
              </dl>
            </div>

            <div class="mt-3 rounded-lg border border-green-100 bg-green-50 p-4 text-sm text-green-800">
              <div class="flex items-start gap-3">
                <Icon icon="ph:info" class="mt-0.5 size-4 shrink-0" />
                <p class="leading-6">
                  Data tetap aman dan akses akan kembali normal setelah layanan diaktifkan.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useRuntimeConfig } from 'nuxt/app'

defineProps<{
  expiredAtLabel?: string
}>()

const config = useRuntimeConfig()
const clientName = String(config.public.clientName || 'alinayah')
const clientDisplayName = String(config.public.clientDisplayName || config.public.siteName || clientName)
const appLogo = String(config.public.appLogo || '/assets/logo.png')
const supportEmail = String(config.public.saasSupportEmail || 'team-sencra@gmail.com')
const supportPhone = computed(() => {
  const raw = String(config.public.saasSupportWhatsapp || config.public.waIntl || '628970122305')
  return raw.replace(/\D/g, '')
})
const whatsAppUrl = computed(() => {
  if (!supportPhone.value) return ''

  const message = encodeURIComponent(`Halo, layanan SaaS ${clientDisplayName} perlu diaktifkan kembali.`)
  return `https://wa.me/${supportPhone.value}?text=${message}`
})
</script>
