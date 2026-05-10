<template>
    <section id="home" aria-label="Hero Desa" class="relative isolate min-h-screen overflow-hidden bg-slate-50 text-slate-900">
        <div class="pointer-events-none absolute inset-0 -z-10">
            <div class="absolute inset-0 bg-[linear-linear(to_right,#e2e8f0_1px,transparent_1px),linear-linear(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[44px_44px] opacity-45"></div>
            <div class="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-cyan-200/60 blur-3xl"></div>
            <div class="absolute -right-24 bottom-0 h-[520px] w-[520px] rounded-full bg-blue-200/60 blur-3xl"></div>
            <div class="absolute left-1/2 top-1/3 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-white/80 blur-3xl"></div>
        </div>
        <div class="mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-4 py-28 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
            <div class="relative z-10">
                <div class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/90 px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm backdrop-blur">
                    <ClientOnly>
                        <Icon icon="lucide:badge-check" class="h-4 w-4" />
                    </ClientOnly>
                    {{ c.tagline }}
                </div>
                <h1 class="mt-6 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                    {{ c.titleMain }}
                    <span class="bg-linear-to-r from-blue-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
                        {{ c.titleHighlight }}
                    </span>
                </h1>
                <p class="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                    {{ c.subtitle }}
                </p>
                <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                    <a :href="c.ctaPrimary.href" class="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-black text-white shadow-xl shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700">
                        {{ c.ctaPrimary.label }}
                        <ClientOnly>
                        <Icon icon="lucide:arrow-up-right" class="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </ClientOnly>
                    </a>
                    <a :href="c.ctaSecondary.href" class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-5 text-sm font-black text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                        <ClientOnly>
                            <Icon icon="lucide:map" class="h-4 w-4" />
                        </ClientOnly>
                        {{ c.ctaSecondary.label }}
                    </a>
                </div>
                <!-- Search box -->
                <div class="mt-8 max-w-2xl rounded-[1.75rem] border border-slate-200 bg-white/80 p-2 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.45)] backdrop-blur-xl">
                    <form class="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]" @submit.prevent>
                        <div class="relative">
                            <ClientOnly>
                                <Icon icon="lucide:search" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            </ClientOnly>
                            <input type="search" class="h-12 w-full rounded-2xl border border-transparent bg-slate-50 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                :placeholder="c.searchPlaceholder" />
                        </div>
                        <button type="submit" class="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-blue-700">
                            Cari
                        </button>
                    </form>
                    <div class="mt-3 flex flex-wrap gap-2 px-1">
                        <a v-for="item in c.badges" :key="item.label" href="#" class="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                            <ClientOnly>
                                <Icon :icon="item.icon" class="h-3.5 w-3.5" />
                            </ClientOnly>
                            {{ item.label }}
                        </a>
                    </div>
                </div>
                <!-- Quick stats -->
                <div class="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
                    <article v-for="item in c.quicks" :key="item.label" class="rounded-[1.35rem] border border-slate-200 bg-white/75 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5">
                        <div class="flex items-start gap-3">
                            <div class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                                <ClientOnly>
                                    <Icon :icon="item.icon" class="h-5 w-5" />
                                </ClientOnly>
                            </div>
                            <div class="min-w-0">
                                <p class="truncate text-sm font-black text-slate-800">
                                    {{ item.label }}
                                </p>
                                <p class="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                    {{ item.value }}
                                </p>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
            <!-- Right visual -->
            <div class="relative z-10">
                <div class="absolute -left-8 top-14 z-20 hidden rounded-[1.25rem] border border-white/80 bg-white/90 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-xl md:block">
                    <div class="flex items-center gap-3">
                        <div class="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <ClientOnly>
                                <Icon icon="lucide:shield-check" class="h-5 w-5" />
                            </ClientOnly>
                        </div>
                        <div>
                            <p class="text-sm font-black text-slate-800">Layanan Terverifikasi</p>
                            <p class="mt-0.5 text-xs font-medium text-slate-500">Dikelola Pemerintah Desa</p>
                        </div>
                    </div>
                </div>
                <div class="absolute -bottom-8 right-0 z-20 hidden rounded-[1.25rem] border border-white/80 bg-white/90 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-xl md:block">
                    <div class="flex items-center gap-3">
                        <div class="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                            <ClientOnly>
                                <Icon icon="lucide:clipboard-list" class="h-5 w-5" />
                            </ClientOnly>
                        </div>
                        <div>
                            <p class="text-sm font-black text-slate-800">Administrasi Online</p>
                            <p class="mt-0.5 text-xs font-medium text-slate-500">Cepat, rapi, transparan</p>
                        </div>
                    </div>
                </div>
                <div class="absolute -right-4 -top-5 z-20 hidden rounded-full border border-white/80 bg-white/90 px-4 py-2 text-xs font-black text-blue-700 shadow-xl shadow-slate-900/10 backdrop-blur-xl sm:inline-flex">
                    Portal Desa Digital
                </div>
                <div class="relative mx-auto max-w-xl">
                    <div class="absolute -inset-4 rounded-[2.5rem] bg-linear-to-br from-blue-500/15 via-cyan-400/10 to-sky-300/20 blur-2xl"></div>
                    <div class="relative overflow-hidden rounded-4xl border border-white/80 bg-white p-2 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.65)]">
                        <div class="relative overflow-hidden rounded-[1.65rem]">
                            <img :src="c.bgImage" :alt="`Kantor atau potensi ${c.brand}`" class="h-[360px] w-full object-cover sm:h-[460px] lg:h-[520px]" />
                            <div class="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent p-5">
                                <div class="flex flex-wrap gap-2">
                                    <span v-for="stat in c.stats" :key="stat.label" class="rounded-2xl border border-white/15 bg-white/15 px-3 py-2 text-white backdrop-blur-md">
                                    <span class="block text-xs text-white/70">{{ stat.label }}</span>
                                    <span class="mt-0.5 block text-sm font-black">{{ stat.value }}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t from-white to-transparent"></div>
    </section>
</template>

<script setup lang="ts">
    import {
        computed
    } from 'vue'
    import {
        Icon
    } from '@iconify/vue'
    type Stat = {
        label: string
        value: string
    }
    type Quick = {
        label: string
        value: string
        icon: string
    }
    type CTA = {
        label: string
        href: string
    }
    type Badge = {
        label: string
        icon: string
    }
    type HeaderHeroProps = {
        brand ? : string
        bgImage ? : string
        titleMain ? : string
        titleHighlight ? : string
        tagline ? : string
        subtitle ? : string
        photos ? : string[]
        waIntl ? : string
        ctaPrimary ? : CTA
        ctaSecondary ? : CTA
        ctaPPDB ? : CTA
        badges ? : Badge[]
        stats ? : Stat[]
        quicks ? : Quick[]
        searchPlaceholder ? : string
    }
    type HeaderHeroComputed = Required < HeaderHeroProps >
        const defaults: HeaderHeroComputed = {
            brand: 'Desa Martopuro',
            bgImage: '/assets/images/village/martopuro-hero.jpg',
            titleMain: 'Selamat Datang di Desa ',
            titleHighlight: 'Martopuro',
            tagline: 'Portal Resmi Pemerintah Desa',
            subtitle: 'Akses informasi terbaru, layanan administrasi online, potensi UMKM, wisata, serta agenda kegiatan desa dalam satu portal digital yang cepat, rapi, dan transparan.',
            photos: [
                '/assets/images/desa-1.jpg',
                '/assets/images/desa-2.jpg',
                '/assets/images/desa-3.jpg'
            ],
            waIntl: '',
            ctaPrimary: {
                label: 'Ajukan Surat Online',
                href: '/layanan'
            },
            ctaSecondary: {
                label: 'Lihat Profil Desa',
                href: '/profile'
            },
            ctaPPDB: {
                label: 'Daftar',
                href: '/registration'
            },
            badges: [{
                    label: 'Surat Keterangan',
                    icon: 'lucide:file-check-2'
                },
                {
                    label: 'Direktori UMKM',
                    icon: 'lucide:store'
                },
                {
                    label: 'Agenda Desa',
                    icon: 'lucide:calendar-days'
                },
                {
                    label: 'Wisata',
                    icon: 'lucide:map-pin'
                }
            ],
            stats: [{
                    label: 'UMKM',
                    value: '35+'
                },
                {
                    label: 'Layanan',
                    value: '12'
                },
                {
                    label: 'Agenda',
                    value: 'Aktif'
                }
            ],
            quicks: [{
                    label: 'Jam Layanan Kantor',
                    value: 'Senin–Jumat • 08.00–15.00',
                    icon: 'lucide:clock-3'
                },
                {
                    label: 'UMKM Terdaftar',
                    value: '35 usaha lokal aktif',
                    icon: 'lucide:store'
                },
                {
                    label: 'Nomor Darurat',
                    value: '112 • 0812-xxxx-xxxx',
                    icon: 'lucide:phone-call'
                }
            ],
            searchPlaceholder: 'Cari layanan, berita, agenda, UMKM...'
        }
    const props = defineProps < HeaderHeroProps > ()
    const c = computed < HeaderHeroComputed > (() => {
        return {
            brand: props.brand || defaults.brand,
            bgImage: props.bgImage || defaults.bgImage,
            titleMain: props.titleMain || defaults.titleMain,
            titleHighlight: props.titleHighlight || defaults.titleHighlight,
            tagline: props.tagline || defaults.tagline,
            subtitle: props.subtitle || defaults.subtitle,
            photos: props.photos?.length ? props.photos : defaults.photos,
            waIntl: props.waIntl || defaults.waIntl,
            ctaPrimary: {
                ...defaults.ctaPrimary,
                ...(props.ctaPrimary || {})
            },
            ctaSecondary: {
                ...defaults.ctaSecondary,
                ...(props.ctaSecondary || {})
            },
            ctaPPDB: {
                ...defaults.ctaPPDB,
                ...(props.ctaPPDB || {})
            },
            badges: props.badges?.length ? props.badges : defaults.badges,
            stats: props.stats?.length ? props.stats : defaults.stats,
            quicks: props.quicks?.length ? props.quicks : defaults.quicks,
            searchPlaceholder: props.searchPlaceholder || defaults.searchPlaceholder
        }
    })
</script>

<style scoped>
    .bg-size-\[44px_44px\] {
        background-size: 44px 44px;
    }
</style>