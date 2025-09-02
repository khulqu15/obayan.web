<template>
  <section id="faq" class="py-24 relative overflow-hidden">
    <div class="absolute inset-0 -z-10">
      <div class="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(16,185,129,0.08)_1px,transparent_1px)] [background-size:18px_18px]" />
    </div>

    <div class="max-w-[70rem] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto">
        <h2 class="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight">
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">
            Pertanyaan yang Sering Diajukan
          </span>
        </h2>
        <p class="mt-3 text-sm text-gray-600 dark:text-neutral-400">Cari jawaban, klik untuk membuka.</p>
      </div>

      <div class="mt-6">
        <label class="sr-only" for="faq-search">Cari FAQ</label>
        <div class="relative">
          <input
            id="faq-search"
            v-model="query"
            type="text"
            placeholder="Cari topik (mis. pembayaran, absensi, integrasi)…"
            class="w-full rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <Icon icon="ph:magnifying-glass" class="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" aria-hidden="true" />
        </div>
      </div>

      <div class="mt-6 space-y-3">
        <details
          v-for="(f, i) in filteredFaqs"
          :key="i"
          ref="faqItems"
          class="group open:shadow-lg open:ring-1 open:ring-emerald-200/60 dark:open:ring-emerald-900/30 card p-0 overflow-hidden rounded-2xl border border-gray-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition"
          :id="slugify(f.q)"
          :open="isOpening(slugify(f.q))"
          @toggle="onToggle(slugify(f.q), $event)"
        >
          <summary
            class="cursor-pointer list-none select-none px-4 sm:px-5 py-4 flex items-start gap-3 hover:bg-gray-50/70 dark:hover:bg-neutral-800/60 transition"
          >
            <Icon
              icon="ph:caret-down-bold"
              class="size-5 mt-1 text-emerald-600 transition-transform duration-300 group-open:rotate-180"
              aria-hidden="true"
            />
            <span class="font-semibold flex-1 pr-8">{{ f.q }}</span>

            <button
              type="button"
              class="absolute right-3 top-3 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
              :aria-label="`Salin tautan ke: ${f.q}`"
              @click.stop="copyLink(slugify(f.q))"
            >
              <Icon :icon="copiedSlug===slugify(f.q) ? 'ph:check-bold' : 'ph:link-simple-bold'" class="size-4" />
            </button>
          </summary>

          <div class="px-4 sm:px-5 pb-5">
            <p class="text-sm text-gray-700 dark:text-neutral-300 leading-relaxed">
              {{ f.a }}
            </p>
          </div>
        </details>

        <div v-if="filteredFaqs.length === 0" class="rounded-2xl border border-dashed border-gray-300 dark:border-neutral-700 p-8 text-center">
          <p class="text-sm text-gray-600 dark:text-neutral-300">
            Tidak ditemukan. Coba kata kunci lain.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { useObayan } from '~/composables/useObayan'
import { useHead } from '#imports'

const { faqs } = useObayan()

/** Pencarian realtime */
const query = ref('')
const filteredFaqs = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return faqs
  return faqs.filter((f: any) =>
    [f.q, f.a].some((t: string) => (t || '').toLowerCase().includes(q))
  )
})

/** Slug util untuk id/anchor */
function slugify(s: string) {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80)
}

/** Deep-link: buka item sesuai hash */
const openingSlug = ref<string>('')        // slug yang harus dibuka saat load
const openStates = ref<Record<string, boolean>>({}) // simpan state open manual (agar idempoten)
const faqItems = ref<HTMLDetailsElement[]>([])
function isOpening(slug: string) {
  return !!openStates.value[slug] || openingSlug.value === slug
}

onMounted(async () => {
  const hash = decodeURIComponent((window.location.hash || '').replace('#', ''))
  if (hash) {
    openingSlug.value = hash
    openStates.value[hash] = true
    await nextTick()
    // scroll halus ke item
    const el = document.getElementById(hash)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
})

function onToggle(slug: string, e: Event) {
  const isOpen = (e.currentTarget as HTMLDetailsElement).open
  openStates.value[slug] = isOpen
}

/** Copy link per pertanyaan */
const copiedSlug = ref<string>('')
async function copyLink(slug: string) {
  const url = `${location.origin}${location.pathname}#${slug}`
  try {
    await navigator.clipboard.writeText(url)
    copiedSlug.value = slug
    setTimeout(() => (copiedSlug.value = ''), 1500)
    history.replaceState(null, '', `#${slug}`)
  } catch {
    // fallback: pilih & prompt
    prompt('Salin tautan ini:', url)
  }
}

/** JSON-LD FAQ (SEO) */
const faqSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f: any) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.a
    }
  }))
}))
useHead({
  script: [
    { type: 'application/ld+json', children: JSON.stringify(faqSchema.value) }
  ]
})
</script>
