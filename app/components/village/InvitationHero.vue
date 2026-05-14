<template>
  <section
    id="culture"
    aria-label="Organisasi dan Komunitas Desa"
    class="relative isolate overflow-hidden bg-slate-50 py-20 text-slate-950 sm:py-24"
  >
    <!-- Background -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[44px_44px] opacity-40"></div>
      <div class="absolute -left-32 top-0 h-[480px] w-[480px] rounded-full bg-blue-100 blur-3xl"></div>
      <div class="absolute -right-32 bottom-0 h-[480px] w-[480px] rounded-full bg-cyan-200/60 blur-3xl"></div>
      <div class="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 blur-3xl"></div>
    </div>

    <div class="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <!-- Left Content -->
      <div>
        <div class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-xs font-black text-blue-700 shadow-sm backdrop-blur">
          <ClientOnly>
            <Icon :icon="c.eyebrowIcon" class="h-4 w-4" />
          </ClientOnly>
          {{ c.eyebrow }}
        </div>

        <h2 class="mt-6 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
          {{ c.title }}
          <span class="bg-linear-to-r from-blue-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
            {{ c.highlight }}
          </span>
        </h2>
        <!-- Organization Pills -->
        <div
          v-if="hasMultipleOrganizations"
          class="mt-7 flex flex-wrap gap-2"
        >
          <button
            v-for="(item, index) in organizationSlides"
            :key="item.id"
            type="button"
            class="inline-flex h-10 items-center gap-2 rounded-2xl border px-4 text-sm font-bold transition"
            :class="activeIndex === index
              ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'border-slate-200 bg-white/80 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'"
            @click="setActiveOrganization(index)"
          >
            <ClientOnly>
              <Icon :icon="getOrganizationIcon(item)" class="h-4 w-4" />
            </ClientOnly>
            {{ item.displayName }}
          </button>
        </div>

        <!-- Active Info -->
        <div
          v-if="activeOrganization"
          class="mt-6 rounded-[1.75rem] border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-xl sm:p-5"
        >
          <div class="flex items-start gap-4">
            <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600">
              <ClientOnly>
                <Icon :icon="getOrganizationIcon(activeOrganization)" class="h-5 w-5" />
              </ClientOnly>
            </div>

            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <p class="text-sm font-black text-slate-950">
                  {{ activeOrganization.displayName }}
                </p>

                <span class="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-blue-700">
                  {{ getOrganizationTypeLabel(activeOrganization.organizationType) }}
                </span>
              </div>

              <p class="mt-1 text-sm leading-6 text-slate-500">
                {{ activeOrganization.shortDescription || activeOrganization.description || 'Informasi organisasi desa.' }}
              </p>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            :href="c.primaryCta.href"
            :target="isExternalHref(c.primaryCta.href) ? '_blank' : undefined"
            :rel="isExternalHref(c.primaryCta.href) ? 'noopener' : undefined"
            class="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-black text-white shadow-xl shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            {{ c.primaryCta.label }}
            <ClientOnly>
              <Icon icon="lucide:arrow-up-right" class="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </ClientOnly>
          </a>

          <button
            v-if="c.secondaryCta.label"
            type="button"
            class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-5 text-sm font-black text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            @click="copySecondary"
          >
            {{ copied ? 'Berhasil Disalin' : c.secondaryCta.label }}
            <ClientOnly v-if="c.secondaryCta.icon">
              <Icon :icon="copied ? 'lucide:check' : c.secondaryCta.icon" class="h-4 w-4" />
            </ClientOnly>
          </button>
        </div>

        <!-- Mini Stats Desktop -->
        <div class="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
          <article
            v-for="item in c.stats"
            :key="item.label"
            class="rounded-[1.35rem] border border-slate-200 bg-white/75 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5"
          >
            <p class="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
              {{ item.label }}
            </p>
            <p class="mt-1 text-base font-black text-slate-950">
              {{ item.value }} 
            </p>
          </article>
        </div>
      </div>

      <!-- Right Organization Slider -->
      <div class="relative min-h-[560px] lg:min-h-[640px]">
        <!-- Floating Badge -->
        <div
          class="absolute right-4 top-0 z-30 hidden rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-black text-blue-700 shadow-xl shadow-slate-900/10 backdrop-blur sm:inline-flex lg:-right-4 lg:-top-8"
        >
          {{ hasMultipleOrganizations ? `${organizationSlides.length} Organisasi Aktif` : c.floatingBadge }}
        </div>

        <div class="relative mx-auto max-w-2xl">
          <div class="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200/40 blur-3xl sm:h-[520px] sm:w-[520px]"></div>

          <!-- Slider Wrapper -->
          <div
            class="relative overflow-hidden rounded-[2.25rem] border border-white bg-white p-2 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.65)]"
            @mouseenter="pauseAutoSlide"
            @mouseleave="resumeAutoSlide"
          >
            <div
              class="flex transition-transform duration-500 ease-out"
              :style="{ transform: `translateX(-${activeIndex * 100}%)` }"
            >
              <article
                v-for="item in organizationSlides"
                :key="item.id"
                class="min-w-full"
              >
                <div class="relative overflow-hidden rounded-[1.85rem] bg-slate-100">
                  <div class="relative h-[420px] sm:h-[500px] lg:h-[560px]">
                    <!-- Main Image -->
                    <img
                      :src="getSafeImageSrc(item, getActiveOrganizationImage(item))"
                      :alt="item.displayName"
                      class="absolute inset-0 h-full w-full object-cover transition duration-700"
                      @load="onImageLoad(item, getActiveOrganizationImage(item))"
                      @error="onImageError($event, item, getActiveOrganizationImage(item))"
                    >

                    <!-- Soft Overlay -->
                    <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent"></div>
                    <div class="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/45 via-transparent to-transparent"></div>

                    <!-- Top Badges -->
                    <div class="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
                      <span class="rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-black text-white backdrop-blur">
                        {{ getOrganizationTypeLabel(item.organizationType) }}
                      </span>

                      <span
                        v-if="item.isFeatured"
                        class="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-black text-white shadow-lg shadow-blue-900/20"
                      >
                        Featured
                      </span>

                      <span
                        v-if="getOrganizationImages(item).length > 1"
                        class="rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-black text-white backdrop-blur"
                      >
                        {{ getOrganizationImages(item).length }} Foto
                      </span>
                    </div>

                    <!-- Auto Image Progress -->
                    <div
                      v-if="getAvailableOrganizationImages(item).length > 1"
                      class="pointer-events-auto absolute bottom-5 right-5 z-40 w-[min(280px,calc(100%-2rem))] rounded-3xl border border-white/20 bg-white/15 p-3 shadow-2xl backdrop-blur-xl"
                    >
                      <div class="flex items-center justify-between gap-3">
                        <p class="text-xs font-black text-white">
                          Foto {{ getActiveImageIndex(item) + 1 }}/{{ getAvailableOrganizationImages(item).length }}
                        </p>

                        <button
                          type="button"
                          class="grid h-7 w-7 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white hover:text-slate-950"
                          @click.stop.prevent="toggleAutoSlide"
                        >
                          <ClientOnly>
                            <Icon
                              :icon="isAutoPaused ? 'lucide:play' : 'lucide:pause'"
                              class="h-3.5 w-3.5"
                            />
                          </ClientOnly>
                        </button>
                      </div>

                      <div class="mt-3 grid gap-1.5" :style="{ gridTemplateColumns: `repeat(${getAvailableOrganizationImages(item).length}, minmax(0, 1fr))` }">
                        <button
                          v-for="(image, imageIndex) in getAvailableOrganizationImages(item)"
                          :key="`${item.id}-progress-${image}`"
                          type="button"
                          class="h-1.5 overflow-hidden rounded-full bg-white/30"
                          @click.stop.prevent="setActiveImage(item, imageIndex)"
                        >
                          <span
                            class="block h-full rounded-full transition-all duration-300"
                            :class="getActiveImageIndex(item) === imageIndex ? 'bg-white' : 'bg-transparent'"
                            :style="{ width: getActiveImageIndex(item) === imageIndex ? '100%' : '0%' }"
                          ></span>
                        </button>
                      </div>
                    </div>
                    <!-- Bottom Content -->
                    <div class="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-5 sm:p-6">
                      <div class="max-w-xl">
                        <div class="mb-4 grid h-14 w-14 place-items-center overflow-hidden rounded-2xl border border-white/20 bg-white/15 text-white backdrop-blur">
                          <img
                            v-if="item.logoUrl"
                            :src="getSafeImageSrc(item, item.logoUrl)"
                            :alt="item.displayName"
                            class="h-10 w-10 rounded-xl object-contain"
                            @load="onImageLoad(item, item.logoUrl)"
                            @error="onImageError($event, item, item.logoUrl)"
                          >
                          <ClientOnly v-else>
                            <Icon :icon="getOrganizationIcon(item)" class="h-7 w-7" />
                          </ClientOnly>
                        </div>

                        <h3 class="text-2xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                          {{ item.displayName }}
                        </h3>

                        <p class="mt-3 line-clamp-3 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                          {{ getOrganizationDescriptionText(item) }}
                        </p>

                        <div class="pointer-events-auto mt-5 flex flex-wrap gap-2">
                          <a
                            v-if="resolveOrganizationHref(item)"
                            :href="resolveOrganizationHref(item)"
                            :target="isExternalHref(resolveOrganizationHref(item)) ? '_blank' : undefined"
                            :rel="isExternalHref(resolveOrganizationHref(item)) ? 'noopener' : undefined"
                            class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-white px-4 text-xs font-black text-slate-950 transition hover:bg-blue-50 hover:text-blue-700"
                          >
                            Lihat Detail
                            <ClientOnly>
                              <Icon icon="lucide:arrow-up-right" class="h-4 w-4" />
                            </ClientOnly>
                          </a>

                          <button
                            v-if="resolveOrganizationContact(item)"
                            type="button"
                            class="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 text-xs font-black text-white backdrop-blur transition hover:bg-white/20"
                            @click="copyText(resolveOrganizationContact(item))"
                          >
                            Salin Kontak
                            <ClientOnly>
                              <Icon icon="lucide:copy" class="h-4 w-4" />
                            </ClientOnly>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <!-- Arrows: only if multiple -->
            <template v-if="hasMultipleOrganizations">
              <button
                type="button"
                class="absolute left-4 top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-white/20 text-white shadow-xl backdrop-blur transition hover:bg-white hover:text-slate-950"
                aria-label="Organisasi sebelumnya"
                @click="prevOrganization({resetImage: true})"
              >
                <ClientOnly>
                  <Icon icon="lucide:chevron-left" class="h-5 w-5" />
                </ClientOnly>
              </button>

              <button
                type="button"
                class="absolute right-4 top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-white/20 text-white shadow-xl backdrop-blur transition hover:bg-white hover:text-slate-950"
                aria-label="Organisasi berikutnya"
                @click="nextOrganization({ resetImage: true })"
              >
                <ClientOnly>
                  <Icon icon="lucide:chevron-right" class="h-5 w-5" />
                </ClientOnly>
              </button>
            </template>
          </div>

          <!-- Dots: only if multiple -->
          <div
            v-if="hasMultipleOrganizations"
            class="mt-5 flex items-center justify-center gap-2"
          >
            <button
              v-for="(_, index) in organizationSlides"
              :key="index"
              type="button"
              class="h-2 rounded-full transition"
              :class="activeIndex === index
                ? 'w-10 bg-blue-600'
                : 'w-2 bg-slate-300 hover:bg-blue-300'"
              :aria-label="`Pilih organisasi ${index + 1}`"
              @click="setActiveOrganization(index)"
            ></button>
          </div>

          <!-- Thumbnail List: only if multiple -->
          <div
            v-if="hasMultipleOrganizations"
            class="mt-5 grid gap-3 sm:grid-cols-3"
          >
            <button
              v-for="(item, index) in organizationSlides.slice(0, 3)"
              :key="`thumb-${item.id}`"
              type="button"
              class="group flex items-center gap-3 rounded-2xl border bg-white/80 p-2 text-left shadow-sm backdrop-blur transition hover:-translate-y-0.5"
              :class="activeIndex === index
                ? 'border-blue-300 ring-4 ring-blue-100'
                : 'border-slate-200 hover:border-blue-200'"
              @click="setActiveOrganization(index)"
            >
              <div class="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                <img
                  :src="getSafeImageSrc(item, getOrganizationCover(item))"
                  :alt="item.displayName"
                  class="h-full w-full object-cover"
                  @load="onImageLoad(item, getOrganizationCover(item))"
                  @error="onImageError($event, item, getOrganizationCover(item))"
                >

                <span
                  v-if="getAvailableOrganizationImages(item).length > 1"
                  class="rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-black text-white backdrop-blur"
                >
                  {{ getAvailableOrganizationImages(item).length }} Foto
                </span>
              </div>

              <div class="min-w-0">
                <p class="truncate text-xs font-black text-slate-950">
                  {{ item.displayName }}
                </p>
                <p class="truncate text-[11px] font-semibold text-slate-500">
                  {{ getOrganizationTypeLabel(item.organizationType) }}
                </p>
              </div>
            </button>
          </div>
        </div>

        <!-- Mobile mini info -->
        <div class="mt-6 grid gap-3 sm:hidden">
          <article
            v-for="item in c.stats"
            :key="`mobile-${item.label}`"
            class="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p class="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
              {{ item.label }}
            </p>
            <p class="mt-1 text-base font-black text-slate-950">
              {{ item.value }}
            </p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import type { OrganizationItem, OrganizationType } from '../../../types/organization'
import { useOrganizationsSQL } from '../../composables/data/useOrganizationsSQL'

type StatItem = {
  label: string
  value: string
}

type CtaItem = {
  label: string
  href: string
  icon?: string
}

type OrganizationHeroProps = {
  eyebrow?: string
  eyebrowIcon?: string
  title?: string
  highlight?: string
  subtitle?: string
  floatingBadge?: string
  primaryCta?: CtaItem
  secondaryCta?: CtaItem
  stats?: StatItem[]
  organizations?: OrganizationItem[]
}

const props = defineProps<OrganizationHeroProps>()

const {
  organizations,
  featuredOrganizations
} = useOrganizationsSQL()

const activeIndex = ref(0)
const copied = ref(false)

const activeImageIndexes = ref<Record<string, number>>({})
const autoSlideMs = 4000
const autoSlideTimer = ref<ReturnType<typeof window.setInterval> | null>(null)
const isAutoPaused = ref(false)

const loadedImageByOrganization = ref<Record<string, string>>({})
const failedImageMap = ref<Record<string, boolean>>({})
const globalLoadedImage = ref('')
const defaultFallbackImage = '/assets/images/village/martopuro-hero.jpg'

const fallbackOrganization: OrganizationItem = {
  id: 'fallback-culture',
  tenantId: 'fallback',
  parentId: null,
  organizationType: 'culture',
  name: 'Martopuro Culture Fest',
  displayName: 'Martopuro Culture Fest',
  slug: 'martopuro-culture-fest',
  shortDescription: 'Wadah kegiatan budaya, musik, UMKM, dan kuliner lokal Martopuro.',
  description:
    'Parade seni tradisi, UMKM lokal, pentas musik, lomba warga, dan kuliner khas dalam satu perayaan meriah. Ikuti informasi terbaru dan rangkaian acara melalui kanal resmi desa.',
  logoUrl: null,
  coverUrl: 'https://martopuro.sencra.io/assets/culturefest/2.JPG',
  email: null,
  phone: null,
  whatsapp: null,
  websiteUrl: 'https://instagram.com/martopuroculturefest',
  address: 'Desa Martopuro',
  latitude: null,
  longitude: null,
  contact: {},
  addressConfig: {},
  social: {
    instagram: '@martopuroculturefest'
  },
  operationalHours: {},
  metadata: {
    ctaLabel: 'Buka Instagram',
    ctaHref: 'https://instagram.com/martopuroculturefest',
    images: [
      'https://martopuro.sencra.io/assets/culturefest/2.JPG',
      'https://martopuro.sencra.io/assets/culturefest/0.JPG',
      'https://martopuro.sencra.io/assets/culturefest/1.JPG',
      'https://martopuro.sencra.io/assets/culturefest/2.JPG'
    ]
  },
  status: 'active',
  isFeatured: true,
  sortOrder: 1,
  createdAt: Date.now(),
  updatedAt: Date.now()
}

const organizationSource = computed(() => {
  if (props.organizations?.length) return props.organizations

  if (featuredOrganizations.value.length) return featuredOrganizations.value

  return organizations.value
})

function getOrganizationDescriptionText(item: OrganizationItem) {
  return htmlToPlainText(
    item.shortDescription ||
    item.description ||
    'Organisasi aktif yang terhubung dengan tenant desa.'
  )
}

function htmlToPlainText(value?: string | null) {
  const html = String(value || '').trim()

  if (!html) return ''

  /**
   * Client-side: pakai DOMParser agar entity seperti &nbsp; &amp; ikut dibaca.
   * Ini lebih rapi daripada regex biasa.
   */
  if (typeof window !== 'undefined') {
    const doc = new DOMParser().parseFromString(html, 'text/html')

    doc.querySelectorAll('script, style, iframe, object, embed').forEach((el) => {
      el.remove()
    })

    return (doc.body.textContent || '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  /**
   * SSR fallback.
   * Aman untuk display text karena hasilnya tetap masuk ke {{ }} Vue,
   * bukan v-html.
   */
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

const organizationSlides = computed(() => {
  const source = organizationSource.value.length
    ? organizationSource.value
    : [fallbackOrganization]

  return dedupeOrganizations(source)
    .filter((item) => item.status === 'active')
    .sort((a, b) => {
      const sortA = Number(a.sortOrder || 0)
      const sortB = Number(b.sortOrder || 0)

      if (sortA !== sortB) return sortA - sortB

      return String(a.displayName || a.name).localeCompare(String(b.displayName || b.name))
    })
})

const hasMultipleOrganizations = computed(() => {
  return organizationSlides.value.length > 1
})

const activeOrganization = computed(() => {
  return organizationSlides.value[activeIndex.value] || organizationSlides.value[0] || fallbackOrganization
})

const c = computed(() => {
  const org = activeOrganization.value
  const typeLabel = getOrganizationTypeLabel(org.organizationType)

  const primaryCta = props.primaryCta || resolvePrimaryCta(org)
  const secondaryCta = props.secondaryCta || resolveSecondaryCta(org)

  return {
    eyebrow: props.eyebrow || typeLabel,
    eyebrowIcon: props.eyebrowIcon || getOrganizationIcon(org),
    title: props.title || 'Organisasi & Komunitas ',
    highlight: props.highlight || 'Desa',
    subtitle:
      props.subtitle ||
      org.description ||
      org.shortDescription ||
      'Kenali organisasi, komunitas, dan lembaga aktif yang mendukung pelayanan, budaya, ekonomi, dan kegiatan warga desa.',
    floatingBadge:
      props.floatingBadge ||
      org.displayName ||
      'Organisasi Desa',
    primaryCta,
    secondaryCta,
    stats: props.stats?.length
      ? props.stats
      : resolveStats()
  }
})

watch(organizationSlides, (items) => {
  if (!items.length) {
    activeIndex.value = 0
    return
  }

  if (activeIndex.value > items.length - 1) {
    activeIndex.value = 0
  }

  const currentOrganization = items[activeIndex.value]

  if (currentOrganization && typeof activeImageIndexes.value[currentOrganization.id] === 'undefined') {
    activeImageIndexes.value = {
      ...activeImageIndexes.value,
      [currentOrganization.id]: 0
    }
  }

  restartAutoSlide()
}, {
  immediate: true
})

onMounted(() => {
  startAutoSlide()
})

onBeforeUnmount(() => {
  clearAutoSlide()
})

type SlideActionOptions = {
  resetImage?: boolean
  restart?: boolean
}

function setActiveOrganization(index: number, options: SlideActionOptions = {}) {
  if (!organizationSlides.value.length) return

  const safeIndex = Math.max(0, Math.min(index, organizationSlides.value.length - 1))
  const target = organizationSlides.value[safeIndex]

  activeIndex.value = safeIndex

  if (target && options.resetImage !== false) {
    activeImageIndexes.value = {
      ...activeImageIndexes.value,
      [target.id]: 0
    }
  }

  if (options.restart !== false) {
    restartAutoSlide()
  }
}

function nextOrganization(options: SlideActionOptions = {}) {
  if (!hasMultipleOrganizations.value) return

  const nextIndex = (activeIndex.value + 1) % organizationSlides.value.length

  setActiveOrganization(nextIndex, {
    resetImage: options.resetImage ?? true,
    restart: options.restart
  })
}

function prevOrganization(options: SlideActionOptions = {}) {
  if (!hasMultipleOrganizations.value) return

  const prevIndex =
    activeIndex.value === 0
      ? organizationSlides.value.length - 1
      : activeIndex.value - 1

  setActiveOrganization(prevIndex, {
    resetImage: options.resetImage ?? true,
    restart: options.restart
  })
}

function dedupeOrganizations(items: OrganizationItem[]) {
  const map = new Map<string, OrganizationItem>()

  for (const item of items) {
    const key = String(item.id || item.slug || item.name)
      .trim()
      .toLowerCase()

    if (!key) continue
    if (map.has(key)) continue

    map.set(key, item)
  }

  return Array.from(map.values())
}

function normalizeImageUrl(value: unknown) {
  return String(value || '').trim()
}

function isFailedImage(url: string) {
  return Boolean(failedImageMap.value[url])
}

function getOrganizationImages(item: OrganizationItem) {
  const metadataImages = Array.isArray(item.metadata?.images)
    ? item.metadata.images
    : []

  const images = [
    item.coverUrl,
    ...metadataImages,
    item.logoUrl
  ]
    .map(normalizeImageUrl)
    .filter(Boolean)

  const uniqueImages = Array.from(new Set(images))

  return uniqueImages.length
    ? uniqueImages
    : [defaultFallbackImage]
}

function getAvailableOrganizationImages(item: OrganizationItem) {
  const images = getOrganizationImages(item)
    .filter((image) => !isFailedImage(image))

  if (images.length) return images

  const loadedByOrg = loadedImageByOrganization.value[item.id]

  if (loadedByOrg) return [loadedByOrg]
  if (globalLoadedImage.value) return [globalLoadedImage.value]

  return [defaultFallbackImage]
}

function getOrganizationCover(item: OrganizationItem) {
  return getAvailableOrganizationImages(item)[0]
}

function getActiveImageIndex(item: OrganizationItem) {
  const images = getAvailableOrganizationImages(item)
  const index = activeImageIndexes.value[item.id] || 0

  if (index > images.length - 1) return 0

  return index
}

function getActiveOrganizationImage(item: OrganizationItem) {
  const images = getAvailableOrganizationImages(item)
  return images[getActiveImageIndex(item)] || images[0] || defaultFallbackImage
}

function isActiveImage(item: OrganizationItem, image: string) {
  return getActiveOrganizationImage(item) === image
}

function setActiveImageByUrl(item: OrganizationItem, image: string) {
  const images = getAvailableOrganizationImages(item)
  const index = images.findIndex((url) => url === image)

  if (index < 0) return

  setActiveImage(item, index)
}

function getSafeImageSrc(item: OrganizationItem, image?: string) {
  const currentImage = normalizeImageUrl(image)

  if (currentImage && !isFailedImage(currentImage)) {
    return currentImage
  }

  return (
    loadedImageByOrganization.value[item.id] ||
    globalLoadedImage.value ||
    getAvailableOrganizationImages(item)[0] ||
    defaultFallbackImage
  )
}

function setActiveImage(
  item: OrganizationItem,
  imageIndex: number,
  options: SlideActionOptions = {}
) {
  const images = getAvailableOrganizationImages(item)
  const safeIndex = Math.max(0, Math.min(imageIndex, images.length - 1))

  activeImageIndexes.value = {
    ...activeImageIndexes.value,
    [item.id]: safeIndex
  }

  if (options.restart !== false) {
    restartAutoSlide()
  }
}

function onImageLoad(item: OrganizationItem, image?: string) {
  const url = normalizeImageUrl(image)

  if (!url || isFailedImage(url)) return

  loadedImageByOrganization.value = {
    ...loadedImageByOrganization.value,
    [item.id]: url
  }

  if (!globalLoadedImage.value) {
    globalLoadedImage.value = url
  }
}

function onImageError(event: Event, item: OrganizationItem, image?: string) {
  const failedUrl = normalizeImageUrl(image)

  if (failedUrl) {
    failedImageMap.value = {
      ...failedImageMap.value,
      [failedUrl]: true
    }
  }

  const target = event.target as HTMLImageElement
  const fallback =
    loadedImageByOrganization.value[item.id] ||
    globalLoadedImage.value ||
    getAvailableOrganizationImages(item).find((url) => url !== failedUrl) ||
    defaultFallbackImage

  if (target && target.src !== fallback) {
    target.src = fallback
  }
}

function clearAutoSlide() {
  if (!autoSlideTimer.value) return

  window.clearInterval(autoSlideTimer.value)
  autoSlideTimer.value = null
}

function startAutoSlide() {
  if (typeof window === 'undefined') return

  clearAutoSlide()

  autoSlideTimer.value = window.setInterval(() => {
    if (isAutoPaused.value) return

    advanceAutoSlide()
  }, autoSlideMs)
}

function restartAutoSlide() {
  if (typeof window === 'undefined') return
  if (isAutoPaused.value) return

  startAutoSlide()
}

function pauseAutoSlide() {
  isAutoPaused.value = true
}

function resumeAutoSlide() {
  isAutoPaused.value = false
  restartAutoSlide()
}

function toggleAutoSlide() {
  isAutoPaused.value = !isAutoPaused.value

  if (!isAutoPaused.value) {
    restartAutoSlide()
  }
}

function advanceAutoSlide() {
  const currentOrganization = activeOrganization.value

  if (!currentOrganization) return

  const images = getAvailableOrganizationImages(currentOrganization)
  const currentImageIndex = getActiveImageIndex(currentOrganization)
  const hasNextImage = images.length > 1 && currentImageIndex < images.length - 1

  /**
   * 1 organization:
   * image 1 -> image 2 -> image 3 -> back to image 1
   */
  if (hasNextImage) {
    setActiveImage(currentOrganization, currentImageIndex + 1, {
      restart: false
    })

    return
  }

  /**
   * Setelah semua image organization tampil,
   * baru pindah ke organization berikutnya.
   */
  if (hasMultipleOrganizations.value) {
    nextOrganization({
      resetImage: true,
      restart: false
    })

    return
  }

  /**
   * Kalau cuma ada 1 organization,
   * ulangi gambar dari awal.
   */
  setActiveImage(currentOrganization, 0, {
    restart: false
  })
}

function getOrganizationIcon(item: OrganizationItem) {
  const icon = item.metadata?.icon

  if (typeof icon === 'string' && icon) return icon

  const map: Record<OrganizationType, string> = {
    government: 'lucide:landmark',
    village_government: 'lucide:building-2',
    bumdes: 'lucide:briefcase-business',
    youth: 'lucide:users-round',
    women: 'lucide:heart-handshake',
    community: 'lucide:users',
    religious: 'lucide:mosque',
    education: 'lucide:graduation-cap',
    health: 'lucide:heart-pulse',
    umkm: 'lucide:store',
    tourism: 'lucide:map-pin',
    culture: 'lucide:sparkles',
    security: 'lucide:shield-check',
    custom: 'lucide:layers'
  }

  return map[item.organizationType] || 'lucide:layers'
}

function getOrganizationTypeLabel(type: OrganizationType) {
  const map: Record<OrganizationType, string> = {
    government: 'Pemerintahan',
    village_government: 'Pemerintah Desa',
    bumdes: 'BUMDes',
    youth: 'Karang Taruna',
    women: 'PKK / Perempuan',
    community: 'Komunitas',
    religious: 'Keagamaan',
    education: 'Pendidikan',
    health: 'Kesehatan',
    umkm: 'UMKM',
    tourism: 'Wisata',
    culture: 'Budaya',
    security: 'Keamanan',
    custom: 'Organisasi'
  }

  return map[type] || 'Organisasi'
}

function resolvePrimaryCta(item: OrganizationItem): CtaItem {
  const label = item.metadata?.ctaLabel
  const href = item.metadata?.ctaHref

  if (typeof label === 'string' && typeof href === 'string') {
    return {
      label,
      href,
      icon: 'lucide:arrow-up-right'
    }
  }

  if (item.websiteUrl) {
    return {
      label: 'Kunjungi Website',
      href: item.websiteUrl,
      icon: 'lucide:globe'
    }
  }

  const instagramUrl = resolveInstagramUrl(item)

  if (instagramUrl) {
    return {
      label: 'Buka Instagram',
      href: instagramUrl,
      icon: 'lucide:instagram'
    }
  }

  return {
    label: 'Lihat Informasi',
    href: '#culture',
    icon: 'lucide:arrow-up-right'
  }
}

function resolveSecondaryCta(item: OrganizationItem): CtaItem {
  const contact = resolveOrganizationContact(item)

  if (contact) {
    return {
      label: contact,
      href: '#',
      icon: 'lucide:copy'
    }
  }

  return {
    label: '',
    href: '#',
    icon: 'lucide:copy'
  }
}

function resolveInstagramUrl(item: OrganizationItem) {
  const instagram =
    item.metadata?.instagram ||
    item.social?.instagram

  if (typeof instagram !== 'string' || !instagram) return ''

  if (instagram.startsWith('http')) return instagram

  return `https://instagram.com/${instagram.replace('@', '')}`
}

function resolveOrganizationHref(item: OrganizationItem) {
  return (
    item.metadata?.ctaHref ||
    item.websiteUrl ||
    resolveInstagramUrl(item) ||
    ''
  )
}

function resolveOrganizationContact(item: OrganizationItem) {
  return (
    item.whatsapp ||
    item.phone ||
    item.email ||
    item.social?.instagram ||
    item.metadata?.instagram ||
    ''
  )
}

function resolveStats(): StatItem[] {
  const total = organizationSlides.value.length
  const featured = organizationSlides.value.filter((item) => item.isFeatured).length
  const types = new Set(organizationSlides.value.map((item) => item.organizationType)).size

  return [
    {
      label: 'Organisasi',
      value: `${total} Aktif`
    },
    {
      label: 'Featured',
      value: `${featured} Utama`
    },
    {
      label: 'Kategori',
      value: `${types} Jenis`
    }
  ]
}

function isExternalHref(value?: string) {
  return Boolean(value && /^https?:\/\//i.test(value))
}

async function copySecondary() {
  const text = resolveOrganizationContact(activeOrganization.value)

  if (!text) return

  await copyText(text)
}

async function copyText(value: string) {
  copied.value = true

  try {
    await navigator.clipboard.writeText(value)
  } catch {}

  window.setTimeout(() => {
    copied.value = false
  }, 1400)
}
</script>

<style scoped>
.bg-size-\[44px_44px\] {
  background-size: 44px 44px;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>