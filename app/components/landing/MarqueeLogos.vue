<template>
  <section aria-label="Trusted by" class="py-6">
    <div class="mb-6 text-center text-sm font-medium text-gray-500 dark:text-neutral-400">
      Dipercaya oleh
    </div>

    <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <div class="relative overflow-visible">
        <div class="flex w-full flex-wrap items-center justify-center gap-x-10 gap-y-6">
          <div
            v-for="(client, index) in validClients"
            :key="client.src"
            class="group relative flex h-16 items-center justify-center"
            :style="{ '--wave-delay': `${index * 140}ms` }"
          >
            <!-- Tooltip -->
            <div
              class="pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 translate-y-1 scale-95 whitespace-nowrap rounded-xl border border-gray-100 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 opacity-0 shadow-xl shadow-gray-900/10 transition-all duration-300 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-100"
            >
              {{ client.name }}

              <span
                class="absolute left-1/2 top-full size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-gray-100 bg-white dark:border-white/10 dark:bg-neutral-900"
              />
            </div>

            <!-- Logo -->
            <div class="logo-wave flex h-14 items-center justify-center">
              <img
                :src="client.src"
                :alt="client.name"
                class="max-h-10 w-auto select-none object-contain opacity-70 grayscale transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0 sm:max-h-12"
                loading="lazy"
                decoding="async"
                draggable="false"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

type ClientLogo = {
  src: string
  name: string
}

const manifestUrl = '/assets/images/logos/clients/manifest.json'

const valid = ref<ClientLogo[]>([])

const fallbackLogos = [
  '/assets/images/logos/clients/1.png',
  '/assets/images/logos/clients/2.png',
  '/assets/images/logos/clients/4.png',
  '/assets/images/logos/clients/3.png',
  '/assets/images/logos/clients/5.png',
]

const clientNameMap: Record<string, string> = {
  '1.png': 'Al-Berr, Pandaan',
  '4.png': 'Al-Ladunni, Purwosari',
  '3.png': 'Al-Inayah, Purwosari',
  '5.png': 'SMKN 1 Purwosari',
  '2.png': 'SMPN 3 Purwosari',
}

onMounted(async () => {
  try {
    const r = await fetch(manifestUrl, { cache: 'no-store' })
    if (!r.ok) throw new Error('manifest fetch failed')

    const list = (await r.json()) as string[]
    const unique = Array.from(new Set(list)).filter(Boolean)

    validateLogos(unique.length ? unique : fallbackLogos)
  } catch {
    validateLogos(fallbackLogos)
  }
})

function validateLogos(list: string[]) {
  list.forEach((src) => {
    const img = new Image()

    img.onload = () => {
      const fileName = src.split('/').pop() || ''

      valid.value.push({
        src,
        name: clientNameMap[fileName] || altFrom(src),
      })
    }

    img.onerror = () => {
      // skip broken image
    }

    img.src = src
  })
}

const validClients = computed(() => {
  const map = new Map<string, ClientLogo>()

  valid.value.forEach((item) => {
    map.set(item.src, item)
  })

  return Array.from(map.values())
})

function altFrom(src: string) {
  const f = src.split('/').pop() || ''

  return f
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}
</script>

<style scoped>
.logo-wave {
  animation: clientLogoWave 3.8s ease-in-out infinite;
  animation-delay: var(--wave-delay);
  will-change: transform;
}

@keyframes clientLogoWave {
  0%,
  100% {
    transform: translateY(0);
  }

  18% {
    transform: translateY(-7px);
  }

  36% {
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .logo-wave {
    animation: none !important;
  }
}
</style>