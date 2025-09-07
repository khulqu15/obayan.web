<!-- pages/profile.vue -->
<template>
  <section ref="wrapEl" id="profile" class="relative overflow-hidden dark:bg-neutral-900 bg-gray-100">
    <!-- Subtle BG grid + blobs -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div ref="bg1" class="absolute top-10 -left-24 w-[42rem] h-[42rem] rounded-full opacity-40 blur-3xl
                           bg-gradient-to-br from-blue-200 to-blue-200 dark:from-blue-900/40 dark:to-blue-900/30
                           will-change-transform" />
      <div ref="bg2" class="absolute bottom-10 -right-24 w-[36rem] h-[36rem] rounded-full opacity-30 blur-3xl
                           bg-gradient-to-tr from-blue-100 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/30
                           will-change-transform" />
      <div class="absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent_80%)]">
        <div class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,0,0,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,.06)_1px,transparent_1px)] bg-[size:32px_32px]
                    dark:bg-[linear-gradient(to_right,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.06)_1px,transparent_1px)]" />
      </div>
    </div>

    <!-- HERO -->
    <div class="relative">
      <div class="absolute inset-0">
        <img :src="cfg.hero.cover" alt="Profil Pondok" class="w-full heroH object-cover opacity-80"
             :style="{'--hero-sm': cfg.hero.heightSm, '--hero-lg': cfg.hero.heightLg}" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
      </div>
      <div class="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 heroH flex items-end"
           :style="{'--hero-sm': cfg.hero.heightSm, '--hero-lg': cfg.hero.heightLg}">
        <div class="mb-10">
          <p class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-blue-200">
            <span class="inline-block size-2 rounded-full bg-blue-400" />
            {{ cfg.hero.badge }}
          </p>
          <h1 class="mt-2 text-3xl sm:text-5xl font-bold leading-tight text-white">
            {{ cfg.hero.title }}
          </h1>
          <p class="mt-2 text-blue-100 max-w-3xl">
            {{ cfg.hero.subtitle }}
          </p>
          <div class="mt-5 flex flex-wrap gap-2">
            <NuxtLink to="#sambutan" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700">
              Lihat Sambutan
            </NuxtLink>
            <NuxtLink to="#struktur" class="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 backdrop-blur px-4 py-2.5 text-sm font-medium text-white hover:bg-white/20">
              Struktur Organisasi
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- BODY -->
    <div class="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
      <div v-if="pending" class="grid gap-6">
        <div class="h-48 sm:h-56 rounded-2xl bg-gray-200/60 dark:bg-neutral-800/60 animate-pulse" />
        <div class="h-40 rounded-2xl bg-gray-200/60 dark:bg-neutral-800/60 animate-pulse" />
        <div class="h-64 rounded-2xl bg-gray-200/60 dark:bg-neutral-800/60 animate-pulse" />
      </div>

      <div v-else class="grid lg:grid-cols-12 gap-8 items-start relative">
        <!-- LEFT -->
        <div class="lg:col-span-7 space-y-10">

          <!-- Sambutan -->
          <section id="sambutan" class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-6">
            <div class="flex items-start gap-5">
              <img :src="cfg.sambutan.img" alt="Pengasuh" class="w-24 h-24 rounded-2xl object-cover border-4 border-blue-600/70 shadow" />
              <div class="min-w-0">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ cfg.sambutan.title }}</h2>
                <p class="mt-2 text-gray-600 dark:text-neutral-300 leading-relaxed">
                  {{ cfg.sambutan.content }}
                </p>
                <p class="mt-3 text-sm text-gray-500 dark:text-neutral-400">{{ cfg.sambutan.signer }}</p>
              </div>
            </div>
          </section>

          <!-- Visi / Misi / Motto -->
          <section id="visi-misi" class="grid md:grid-cols-3 gap-4">
            <div class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Visi</h3>
              <p class="mt-2 text-gray-600 dark:text-neutral-300">{{ cfg.visi }}</p>
            </div>
            <div class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-6 md:col-span-2">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Misi</h3>
              <ul class="mt-2 space-y-2 list-disc list-inside text-gray-600 dark:text-neutral-300">
                <li v-for="(m,i) in cfg.misi" :key="i">{{ m }}</li>
              </ul>
            </div>
            <div class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-6 md:col-span-3">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Motto</h3>
              <p class="mt-1 italic text-blue-600 dark:text-blue-400 font-semibold">“{{ cfg.motto }}”</p>
            </div>
          </section>

          <!-- Sejarah -->
          <section id="history">
            <div class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-6 space-y-4">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Sejarah Singkat</h3>
              <p v-for="(p, i) in cfg.sejarah" :key="i" class="text-gray-600 dark:text-neutral-300 leading-relaxed">
                {{ p }}
              </p>
            </div>
          </section>

          <!-- Materi -->
          <section id="materi" class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-6">
            <div class="flex items-center justify-between gap-3 mb-3">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Materi yang Dipelajari</h3>
              <span class="text-xs text-gray-500 dark:text-neutral-400">{{ cfg.materi.length }} topik</span>
            </div>
            <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div v-for="m in cfg.materi" :key="m" class="group rounded-xl border border-gray-200 dark:border-neutral-700 p-4 bg-white/70 dark:bg-neutral-800/60 hover:shadow transition">
                <ClientOnly><Icon icon="ph:book-open" class="size-6 text-blue-600 dark:text-blue-400" /></ClientOnly>
                <p class="mt-2 text-sm text-gray-700 dark:text-neutral-300">{{ m }}</p>
              </div>
            </div>
          </section>

          <!-- Kitab -->
          <section id="kitab" class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-6">
            <div class="flex items-center justify-between gap-3 mb-3">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Kitab yang Dipelajari</h3>
              <span class="text-xs text-gray-500 dark:text-neutral-400">{{ cfg.kitab.length }} kitab</span>
            </div>
            <ul class="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              <li v-for="k in cfg.kitab" :key="k" class="rounded-xl border border-gray-200 dark:border-neutral-700 p-4 bg-white/70 dark:bg-neutral-800/60 hover:shadow transition">
                <ClientOnly><Icon icon="ph:scroll" class="mr-2 text-blue-600 dark:text-blue-400 inline-block" /></ClientOnly>
                <span class="text-sm text-gray-700 dark:text-neutral-300">{{ k }}</span>
              </li>
            </ul>
          </section>

        </div>

        <div class="lg:col-span-5">
          <div class="lg:sticky lg:top-[var(--sticky-top,88px)] lg:space-y-6 self-start">
            <section id="struktur" class="rounded-3xl overflow-hidden border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 shadow-lg will-change-transform" ref="cardTilt">
              <div class="p-6">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Struktur Organisasi</h3>
                <p class="text-xs text-gray-500 dark:text-neutral-400">Pengasuh, pembina, dan pengelola kependidikan</p>
                <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div v-for="s in cfg.struktur" :key="s.nama + s.jabatan" class="group p-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 hover:shadow transition">
                    <img :src="s.img" alt="" class="w-16 h-16 rounded-xl object-cover border-2 border-blue-600/70 mx-auto" />
                    <p class="mt-3 text-sm font-semibold text-gray-900 dark:text-white text-center truncate">{{ s.nama }}</p>
                    <p class="text-[11px] text-blue-600 dark:text-blue-400 text-center">{{ s.jabatan }}</p>
                  </div>
                </div>
              </div>
            </section>
            <section id="tingkatan" class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-6 mt-4">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Tingkatan Pendidikan</h3>
              <div class="grid sm:grid-cols-2 gap-3">
                <div v-for="t in cfg.tingkatan" :key="t.title" class="rounded-xl border border-gray-200 dark:border-neutral-700 p-4 bg-white/70 dark:bg-neutral-800/60 hover:shadow transition">
                  <ClientOnly><Icon :icon="t.icon" class="size-6 text-blue-600 dark:text-blue-400" /></ClientOnly>
                  <h4 class="mt-2 font-semibold text-gray-900 dark:text-white">{{ t.title }}</h4>
                  <p class="text-sm text-gray-600 dark:text-neutral-400 mt-1">{{ t.desc }}</p>
                </div>
              </div>
            </section>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'
import { useWeb } from '~/composables/data/useWeb'
import { onValue, ref as dref } from 'firebase/database'

defineOptions({ name: 'ProfilePage' })
const web = useWeb()

type MetaShape = {
  title?: string
  description?: string
  ogImage?: string | null
  status?: 'draft' | 'published'
}

type Struktur = { nama: string; jabatan: string; img: string }
type Tingkatan = { title: string; desc: string; icon: string }
type Shape = {
  hero: { cover: string; badge: string; title: string; subtitle: string; heightSm: string; heightLg: string }
  sambutan: { img: string; title: string; content: string; signer: string }
  visi: string
  misi: string[]
  motto: string
  sejarah: string[]
  materi: string[]
  kitab: string[]
  struktur: Struktur[]
  tingkatan: Tingkatan[]
}

const DEFAULTS: Shape = {
  hero: {
    cover: '/assets/images/profile.png',
    badge: 'Profil Pondok Pesantren Alberr',
    title: 'Mencetak berilmu, beradab, dan mandiri',
    subtitle: 'Berlandaskan Al-Qur’ān dan Sunnah, mengintegrasikan diniyah, akademik, dan keterampilan abad 21.',
    heightSm: '44vh',
    heightLg: '56vh'
  },
  sambutan: {
    img: '/assets/images/kyai.jpg',
    title: 'Sambutan Pengasuh',
    content:
      'Alhamdulillāh, Pondok Pesantren Alberr berkomitmen melahirkan santri yang mendalam ilmunya, kokoh akhlaknya, dan tangguh menghadapi tantangan zaman. Melalui disiplin, adab, dan ikhtiar berkelanjutan, kami berharap para santri menjadi pribadi yang bermanfaat bagi umat.',
    signer: '— KH. Izud'
  },
  visi: 'Mencetak generasi berilmu, berakhlak karimah, dan berdaya saing global berlandaskan Al-Qur’ān dan Sunnah.',
  misi: [
    'Penguatan ilmu diniyah & adab santri',
    'Integrasi akademik modern & evaluasi terstandar',
    'Pembinaan karakter & kepemimpinan',
    'Literasi digital, komunikasi, dan kolaborasi',
    'Khidmah sosial & kemitraan alumni'
  ],
  motto: 'Berilmu • Beradab • Mandiri',
  sejarah: [
    'Pondok Pesantren Al-Berr berdiri pada tahun 2010 M dengan tekad menghadirkan pendidikan Islam yang menanamkan akhlak mulia, kemandirian, serta penguasaan ilmu agama.',
    'Perjalanan Al-Berr dimulai dengan sederhana—berawal dari sebuah gazebo dan masjid kecil sebagai pusat kegiatan santri, lalu berkembang dengan dukungan masyarakat.',
    'Dengan visi mencetak generasi berakhlak mulia, mandiri, dan bermanfaat, Al-Berr terus melangkah maju.'
  ],
  materi: [
    'Tahfidz & Tahsin Al-Qur’ān',
    'Fiqih, Aqidah, Akhlak',
    'Nahwu & Sharaf',
    'Tafsir & Hadits',
    'Bahasa Arab & Inggris',
    'Sains & Matematika'
  ],
  kitab: [
    'Al-Jurumiyah', 'Imrithi', 'Alfiyah Ibnu Malik',
    'Fathul Qarib', 'Bulughul Maram', 'Tafsir Jalalain',
    'Riyadhus Shalihin', 'Ushul Tsalatsah'
  ],
  struktur: [
    { nama: 'KH. Izud', jabatan: 'Pengasuh', img: '/assets/images/kyai.jpg' }
  ],
  tingkatan: [
    { title: 'Ibtidaiyah', desc: 'Fokus adab, tahsin, pondasi diniyah', icon: 'ph:book' },
    { title: 'Tsanawiyah', desc: 'Integrasi diniyah-akademik & bahasa', icon: 'ph:chalkboard' },
    { title: 'Aliyah', desc: 'Pendalaman kitab, sains & leadership', icon: 'ph:graduation-cap' }
  ]
}

function merge(base: Shape, patch?: Partial<Shape>): Shape {
  if (!patch) return base
  return {
    hero: { ...base.hero, ...(patch.hero || {}) },
    sambutan: { ...base.sambutan, ...(patch.sambutan || {}) },
    visi: patch.visi ?? base.visi,
    misi: Array.isArray(patch.misi) && patch.misi.length ? patch.misi : base.misi,
    motto: patch.motto ?? base.motto,
    sejarah: Array.isArray(patch.sejarah) && patch.sejarah.length ? patch.sejarah : base.sejarah,
    materi: Array.isArray(patch.materi) && patch.materi.length ? patch.materi : base.materi,
    kitab: Array.isArray(patch.kitab) && patch.kitab.length ? patch.kitab : base.kitab,
    struktur: Array.isArray(patch.struktur) && patch.struktur.length ? patch.struktur : base.struktur,
    tingkatan: Array.isArray(patch.tingkatan) && patch.tingkatan.length ? patch.tingkatan : base.tingkatan
  }
}

const pageMeta = reactive<Required<MetaShape>>({
  title: 'Profil Pondok Pesantren Alberr',
  description: 'Profil resmi Pondok Pesantren Alberr: visi, misi, sejarah, struktur, dan program pendidikan.',
  ogImage: '/assets/logo.png',
  status: 'draft'
})

watch(() => web?.meta?.value, (m: any) => {
  if (!m) return
  if (m.title) pageMeta.title = m.title
  if (m.description) pageMeta.description = m.description
  if (m.ogImage) pageMeta.ogImage = m.ogImage
  if (m.status) pageMeta.status = m.status
}, { immediate: true })

/** ====== CMS Bind: ambil path dinamis & subscribe ====== */
const route = useRoute()
const runtime = useRuntimeConfig()
const siteUrl = runtime.public?.siteUrl || ''

function absUrl(u?: string | null) {
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u
  try { return new URL(u, siteUrl || (typeof window !== 'undefined' ? window.location.origin : '/')).toString() }
  catch { return u }
}

// gunakan path aktual halaman agar cocok dengan editor (yang menyimpan pakai pagePath)
const pagePath = computed(() => {
  const raw = route?.path || '/profile'
  return web.normalizePath?.(raw) ?? raw
})

const cfg = reactive<Shape>({ ...DEFAULTS })
const pending = ref(true)

// ambil props section key 'ProfilePages' (case tolerant)
const sectionProps = computed<Partial<Shape> | null>(() => {
  const list = (web.sortedSections?.value || web.sections?.value || []) as any[]
  const found =
    list.find(s => String(s?.key).toLowerCase() === 'profilepages') ||
    list.find(s => String(s?.key).toLowerCase() === 'profilepage') ||
    list.find(s => String(s?.key).toLowerCase() === 'profile') ||
    null
  return (found?.props || null) as Partial<Shape> | null
})

// subscribe ketika path berubah
watch(pagePath, async (p) => {
  try {
    pending.value = true
    await web.subscribePage(p)
  } catch (e) {
    // noop
  } finally {
    pending.value = false
  }
}, { immediate: true })

// apply props setiap sections update
watch(sectionProps, (props) => {
  Object.assign(cfg, merge(DEFAULTS, props || undefined))
}, { immediate: true })

onBeforeUnmount(() => {
  try { web.unbindDetail?.() } catch {}
})

/** ====== Small parallax candy ====== */
const wrapEl = ref<HTMLElement | null>(null)
const bg1 = ref<HTMLElement | null>(null)
const bg2 = ref<HTMLElement | null>(null)
const cardTilt = ref<HTMLElement | null>(null)

let raf = 0
let mx = 0, my = 0, sy = 0
function loop() {
  const dx = (mx - 0.5)
  const dy = (my - 0.5)
  if (bg1.value) bg1.value.style.transform = `translate3d(${dx * -20}px, ${dy * -20}px, 0) scale(1.06)`
  if (bg2.value) bg2.value.style.transform = `translate3d(${dx * 16}px, ${dy * 16}px, 0) scale(1.04)`
  if (cardTilt.value) {
    const tiltX = dy * 2.5
    const tiltY = dx * -2.5
    cardTilt.value.style.transform = `translateY(${sy * -0.04}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
  }
  raf = requestAnimationFrame(loop)
}
function onMouse(e: MouseEvent) {
  const rect = (wrapEl.value as HTMLElement).getBoundingClientRect()
  mx = (e.clientX - rect.left) / rect.width
  my = (e.clientY - rect.top) / rect.height
}
function onScroll() { sy = window.scrollY || 0 }

const { $realtimeDb } = useNuxtApp() as any


onMounted(() => {
  if (!$realtimeDb) return
  const node = dref($realtimeDb, 'alberr/web/profile/meta')
  const handler = onValue(node, (snap) => {
    const v = (snap.val() || {}) as MetaShape
    if (v.title) pageMeta.title = v.title
    if (v.description) pageMeta.description = v.description
    if (v.ogImage) pageMeta.ogImage = v.ogImage
    if (v.status) pageMeta.status = v.status as any
  })
  window.addEventListener('mousemove', onMouse, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  loop()
})
onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouse)
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(raf)
})
const canonical = computed(() => {
  try { return new URL(route.fullPath || '/', siteUrl).toString() }
  catch { return siteUrl || '/' }
})

useSeoMeta({
  title: computed(() => pageMeta.title),
  description: computed(() => pageMeta.description),
  ogTitle: computed(() => pageMeta.title),
  ogDescription: computed(() => pageMeta.description),
  ogType: 'website',
  ogUrl: canonical,
  ogImage: computed(() => absUrl(pageMeta.ogImage) || absUrl('/assets/logo.png')),
  twitterCard: 'summary_large_image',
  themeColor: '#0ea5e9',
  robots: computed(() => pageMeta.status === 'published' ? 'index, follow' : 'noindex, nofollow')
})

useHead({
  link: [{ rel: 'canonical', href: canonical.value }],
  script: [{
    type: 'application/ld+json',
    children: computed(() => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageMeta.title,
      description: pageMeta.description,
      url: canonical.value,
      image: absUrl(pageMeta.ogImage) ? [absUrl(pageMeta.ogImage)] : []
    }))
  }]
})
</script>

<style scoped>
.heroH { height: var(--hero-sm); }
@media (min-width: 640px) {
  .heroH { height: var(--hero-lg); }
}
#profile [ref="cardTilt"] { transform-style: preserve-3d; transition: transform 120ms ease-out; }
</style>
