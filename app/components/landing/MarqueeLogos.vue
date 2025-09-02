<template>
  <section aria-label="Trusted by" class="py-6">
    <div class="text-center mb-6 text-sm font-medium text-gray-500 dark:text-neutral-400">
        Dipercaya oleh
    </div>
    <div class="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative overflow-hidden">
        <div :style="{ animationDuration: dur }" class="flex justify-center items-center w-full gap-10">
          <img v-for="src in validLogos" :key="src" :src="src" :alt="altFrom(src)"
               class="h-10 sm:h-12 opacity-80 hover:opacity-100 transition-opacity"
               loading="lazy" decoding="async" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const manifestUrl = '/assets/images/logos/clients/manifest.json'
const raw = ref<string[]>([])
const valid = ref<string[]>([])

onMounted(async () => {
  try {
    const r = await fetch(manifestUrl, { cache: 'no-store' })
    if (!r.ok) throw new Error('manifest fetch failed')
    const list = (await r.json()) as string[]
    const unique = Array.from(new Set(list)).filter(Boolean)

    unique.forEach((src) => {
      const img = new Image()
      img.onload = () => valid.value.push(src)
      img.onerror = () => {} // skip
      img.src = src
    })
  } catch {
    // fallback kosong
  }
})

const validLogos = computed(() => Array.from(new Set(valid.value)))
const dur = computed(() => `${Math.max(18, validLogos.value.length * 5)}s`)
function altFrom(src: string) {
  const f = src.split('/').pop() || ''
  return f.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ')
}
</script>

<style scoped>
.marquee-track{ display:flex; gap:2rem; will-change:transform; animation:oby-marquee linear infinite; }
.marquee-track img{ flex:0 0 auto; }
.marquee-track--dupe{ position:absolute; inset:0; transform:translateX(100%); animation-name:oby-marquee-dupe; }
@keyframes oby-marquee{ from{ transform:translateX(0) } to{ transform:translateX(-100%) } }
@keyframes oby-marquee-dupe{ from{ transform:translateX(0) } to{ transform:translateX(-100%) } }
</style>
