<template>
    <header class="fixed inset-x-0 top-0 z-50 border-t-4 border-slate-900 bg-white/90 shadow-sm backdrop-blur-2xl">
        <nav class="mx-auto flex h-[60px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <!-- Brand -->
            <NuxtLink to="/" class="flex min-w-0 items-center gap-3">
                <div class="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <img :src="appLogo" :alt="appName" class="h-8 w-8 object-contain" />
                </div>
                <div class="min-w-0 leading-tight">
                    <p class="truncate text-[15px] font-black text-slate-900">
                        {{ appName }}
                    </p>
                    <p class="hidden truncate text-xs font-medium text-slate-500 sm:block">
                        Kecamatan Purwosari, Kab. Pasuruan
                    </p>
                </div>
            </NuxtLink>
            <!-- Desktop Menu -->
            <div class="hidden items-center gap-1 lg:flex">
                <NuxtLink v-for="item in mainLinks" :key="item.label" :to="item.href" class="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
                    {{ item.label }}
                </NuxtLink>
                <!-- Mega Menu Lembaga -->
                <div class="group/lembaga relative inline-flex">
                    <button type="button" class="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-200">
                        Lembaga
                        <Icon icon="lucide:chevron-down" class="h-4 w-4 transition group-hover/lembaga:rotate-180" />
                    </button>
                    <div class="pointer-events-none invisible fixed left-1/2 top-16 z-50 w-[min(1120px,calc(100vw-2rem))] -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition duration-200 group-hover/lembaga:pointer-events-auto group-hover/lembaga:visible group-hover/lembaga:translate-y-0 group-hover/lembaga:opacity-100">
                        <div class="overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white/95 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl">
                            <div class="mb-4 flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                <div>
                                    <p class="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                                        Kelembagaan Desa
                                    </p>
                                    <h3 class="mt-1 text-lg font-black text-slate-950">
                                        Struktur Lembaga & Organisasi Desa
                                    </h3>
                                </div>
                                <NuxtLink to="/lembaga" class="hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 md:inline-flex">
                                    Lihat Semua
                                </NuxtLink>
                            </div>
                            <div class="grid gap-x-8 gap-y-2 md:grid-cols-2 xl:grid-cols-3">
                                <NuxtLink v-for="item in lembagaLinks" :key="item.label" :to="item.href" class="group/item flex items-start gap-3 rounded-2xl p-3 transition hover:bg-blue-50">
                                    <div class="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-600 transition group-hover/item:bg-blue-600 group-hover/item:text-white">
                                        <Icon :icon="item.icon" class="h-4 w-4" />
                                    </div>
                                    <div class="min-w-0">
                                        <p class="text-sm font-black uppercase tracking-[0.02em] text-slate-800 group-hover/item:text-blue-700">
                                            {{ item.label }}
                                        </p>
                                        <p class="mt-1 line-clamp-1 text-sm text-slate-500">
                                            {{ item.desc }}
                                        </p>
                                    </div>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Dropdown Fasilitas -->
                <div class="group/fasilitas relative inline-flex">
                    <button type="button" class="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
                        Fasilitas
                        <Icon icon="lucide:chevron-down" class="h-4 w-4 transition group-hover/fasilitas:rotate-180" />
                    </button>
                    <div class="invisible absolute left-0 top-[calc(100%+0.5rem)] z-50 w-72 translate-y-2 rounded-[1.25rem] border border-slate-200 bg-white/95 p-2 opacity-0 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl transition duration-200 group-hover/fasilitas:visible group-hover/fasilitas:translate-y-0 group-hover/fasilitas:opacity-100">
                        <NuxtLink v-for="item in fasilitasLinks" :key="item.label" :to="item.href" class="group/item flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700">
                            <div class="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-slate-500 transition group-hover/item:bg-blue-600 group-hover/item:text-white">
                                <Icon :icon="item.icon" class="h-4 w-4" />
                            </div>
                            <span>{{ item.label }}</span>
                        </NuxtLink>
                    </div>
                </div>
                <div class="group/potensi relative inline-flex">
                    <button type="button" class="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
                        Potensi
                        <Icon icon="lucide:chevron-down" class="h-4 w-4 transition group-hover/potensi:rotate-180" />
                    </button>
                    <div class="invisible absolute left-0 top-[calc(100%+0.5rem)] z-50 w-80 translate-y-2 rounded-[1.25rem] border border-slate-200 bg-white/95 p-2 opacity-0 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl transition duration-200 group-hover/potensi:visible group-hover/potensi:translate-y-0 group-hover/potensi:opacity-100">
                        <NuxtLink v-for="item in potensiLinks" :key="item.label" :to="item.href" class="group/item flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700">
                            <div class="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-slate-500 transition group-hover/item:bg-blue-600 group-hover/item:text-white">
                                <Icon :icon="item.icon" class="h-4 w-4" />
                            </div>
                            <span>{{ item.label }}</span>
                        </NuxtLink>
                    </div>
                </div>
                <NuxtLink v-for="item in rightLinks" :key="item.label" :to="item.href" class="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
                    {{ item.label }}
                </NuxtLink>
            </div>
            <!-- CTA -->
            <div class="hidden items-center gap-2 lg:flex">
                <NuxtLink to="/layanan/surat" class="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
                    Ajukan Surat
                </NuxtLink>
            </div>
            <!-- Mobile Toggle -->
            <button id="martopuro-mobile-toggle" type="button" class="hs-collapse-toggle grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 lg:hidden" aria-expanded="false" aria-controls="martopuro-mobile-menu"
                aria-label="Toggle navigation" data-hs-collapse="#martopuro-mobile-menu">
                <Icon icon="lucide:menu" class="block h-5 w-5 hs-collapse-open:hidden" />
                <Icon icon="lucide:x" class="hidden h-5 w-5 hs-collapse-open:block" />
            </button>
        </nav>
        <!-- Mobile Menu -->
        <div id="martopuro-mobile-menu" class="hs-collapse hidden border-t border-slate-100 bg-white/95 px-4 pb-4 pt-2 backdrop-blur-2xl lg:hidden" aria-labelledby="martopuro-mobile-toggle">
            <div class="mx-auto grid max-w-7xl gap-2">
                <NuxtLink v-for="item in mobileLinks" :key="item.label" :to="item.href" class="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700">
                    <span>{{ item.label }}</span>
                    <Icon icon="lucide:chevron-right" class="h-4 w-4" />
                </NuxtLink>
                <NuxtLink to="/layanan/surat" class="mt-2 inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
                    Ajukan Surat
                </NuxtLink>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useRuntimeConfig } from 'nuxt/app'

type NavItem = {
    label: string
    href: string
    icon? : any
    desc? : string
}
const config = useRuntimeConfig()
const appName = computed(() => {
    return String(config.public.appName || config.public.clientDisplayName || 'Desa Martopuro')
})
const appLogo = computed(() => {
    return String(config.public.appLogo || 'https://martopuro.sencra.io/martopuro-logo.png')
})
  
const mainLinks: NavItem[] = [{
        label: 'Profil',
        href: '/profil'
    },
    {
        label: 'Berita',
        href: '/berita'
    }
]
const lembagaLinks: NavItem[] = [{
        label: 'BPD',
        href: '/lembaga/bpd',
        icon: 'lucide:book-open',
        desc: 'Badan Permusyawaratan Desa'
    },
    {
        label: 'LPMD',
        href: '/lembaga/lpmd',
        icon: 'lucide:blocks',
        desc: 'Lembaga Pemberdayaan Masyarakat Desa'
    },
    {
        label: 'BHABINKAMTIBMAS',
        href: '/lembaga/bhabinkamtibmas',
        icon: 'lucide:shield-check',
        desc: 'Bhayangkara Pembina Keamanan dan Ketertiban Masyarakat'
    },
    {
        label: 'PKK',
        href: '/lembaga/pkk',
        icon: 'lucide:badge-check',
        desc: 'Pemberdayaan Kesejahteraan Keluarga'
    },
    {
        label: 'BABINSA',
        href: '/lembaga/babinsa',
        icon: 'lucide:badge-check',
        desc: 'Bintara Pembina Desa'
    },
    {
        label: 'LINMAS',
        href: '/lembaga/linmas',
        icon: 'lucide:circle-help',
        desc: 'Perlindungan Masyarakat'
    },
    {
        label: 'HIPPA',
        href: '/lembaga/hippa',
        icon: 'lucide:at-sign',
        desc: 'Himpunan Petani Pemakai Air'
    },
    {
        label: 'HIPPAM',
        href: '/lembaga/hippam',
        icon: 'lucide:users-round',
        desc: 'Himpunan Penduduk Pemakai Air Minum'
    },
    {
        label: 'GAPOKTAN',
        href: '/lembaga/gapoktan',
        icon: 'lucide:users-round',
        desc: 'Gabungan Kelompok Tani'
    },
    {
        label: 'KOPWAN',
        href: '/lembaga/kopwan',
        icon: 'lucide:users-round',
        desc: 'Koperasi Wanita'
    },
    {
        label: 'KARANGTARUNA',
        href: '/lembaga/karang-taruna',
        icon: 'lucide:circle-help',
        desc: 'Organisasi Desa'
    },
    {
        label: 'PUSTU',
        href: '/lembaga/pustu',
        icon: 'lucide:at-sign',
        desc: 'Puskesmas Pembantu'
    },
    {
        label: 'POSYANDU',
        href: '/lembaga/posyandu',
        icon: 'lucide:users-round',
        desc: 'Pos Pelayanan Terpadu'
    },
    {
        label: 'PAUD',
        href: '/lembaga/paud',
        icon: 'lucide:users-round',
        desc: 'Pendidikan Anak Usia Dini'
    },
    {
        label: 'BUMDES',
        href: '/lembaga/bumdes',
        icon: 'lucide:users-round',
        desc: 'Badan Usaha Milik Desa'
    }
]
const fasilitasLinks: NavItem[] = [{
        label: 'Kesehatan',
        href: '/fasilitas/kesehatan',
        icon: 'lucide:hospital'
    },
    {
        label: 'Pasar',
        href: '/fasilitas/pasar',
        icon: 'lucide:store'
    },
    {
        label: 'Pendidikan',
        href: '/fasilitas/pendidikan',
        icon: 'lucide:school'
    },
    {
        label: 'Lapangan',
        href: '/fasilitas/lapangan',
        icon: 'lucide:map'
    },
    {
        label: 'Ambulance',
        href: '/fasilitas/ambulance',
        icon: 'lucide:ambulance'
    },
    {
        label: 'Mobil Siaga',
        href: '/fasilitas/mobil-siaga',
        icon: 'lucide:car'
    },
    {
        label: 'HIPAM',
        href: '/fasilitas/hipam',
        icon: 'lucide:droplets'
    }
]
const potensiLinks: NavItem[] = [{
        label: 'Prestasi',
        href: '/potensi/prestasi',
        icon: 'lucide:trophy'
    },
    {
        label: 'Industri',
        href: '/potensi/industri',
        icon: 'lucide:factory'
    },
    {
        label: 'Koperasi',
        href: '/potensi/koperasi',
        icon: 'lucide:hand-coins'
    },
    {
        label: 'Pariwisata',
        href: '/potensi/pariwisata',
        icon: 'lucide:map-pin'
    },
    {
        label: 'Perikanan',
        href: '/potensi/perikanan',
        icon: 'lucide:fish'
    },
    {
        label: 'Pertanian & Perkebunan',
        href: '/potensi/pertanian-perkebunan',
        icon: 'lucide:wheat'
    },
    {
        label: 'Perkebunan',
        href: '/potensi/perkebunan',
        icon: 'lucide:sprout'
    },
    {
        label: 'Ekonomi Kreatif',
        href: '/potensi/ekonomi-kreatif',
        icon: 'lucide:palette'
    }
]
const rightLinks: NavItem[] = [{
        label: 'Status Desa',
        href: '/status-desa'
    },
    {
        label: 'APBDes',
        href: '/apbdes'
    }
]
const mobileLinks = computed < NavItem[] > (() => {
    return [
        ...mainLinks,
        {
            label: 'Lembaga',
            href: '/lembaga'
        },
        {
            label: 'Fasilitas',
            href: '/fasilitas'
        },
        {
            label: 'Potensi',
            href: '/potensi'
        },
        ...rightLinks
    ]
})
</script>