<template>
    <div class="relative overflow-hidden bg-white/90 dark:bg-neutral-900  dark:border-neutral-800" id="news">
        <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 -top-40 h-64 bg-gradient-to-b from-blue-100/70 to-transparent dark:from-emerald-900/20" />
        <div class="max-w-[85rem] relative mx-auto min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-6">
            <!-- heading -->
            <div class="grid lg:grid-cols-12 gap-6">
                <div class="lg:col-span-7">
                    <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Kegiatan Harian & Mingguan Santri
                    </h1>
                    <p class="mt-3 text-gray-600 dark:text-neutral-300 max-w-2xl">
                        Pantau jadwal kajian, ibadah, dan aktivitas santri Pondok Pesantren Alberr Pandaan secara teratur. Temukan kegiatan yang sesuai dengan minat dan kebutuhan Anda.
                    </p>
                </div>
            </div>
            <div class="grid grid-cols-12 gap-6 mt-8">
                <div class="col-span-12">
                    <div class="flex flex-wrap items-center gap-2">
                        <div class="hs-dropdown [--strategy:fixed] relative inline-flex">
                            <button type="button" class="hs-dropdown-toggle inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-700"
                                aria-haspopup="menu" aria-expanded="false">
                    <span class="inline-block w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    {{ selectedCategory }}
                    <svg class="size-4 text-gray-500 dark:text-neutral-400 hs-dropdown-open:rotate-180 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6"/></svg>
                  </button>
                            <div class="hs-dropdown-menu mt-2 w-56 z-20 hidden rounded-lg border border-gray-200 bg-white p-2 shadow-md dark:bg-neutral-800 dark:border-neutral-700">
                                <label v-for="cat in categoriesUi" :key="cat" class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer">
                      <input
                        type="radio"
                        class="shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600"
                        name="blog-category"
                        :value="cat"
                        :checked="selectedCategory === cat"
                        @change="setCategory(cat)"
                      >
                      <span class="text-sm text-gray-800 dark:text-neutral-200">{{ cat }}</span>
                    </label>
                            </div>
                        </div>
                        <div class="hs-dropdown [--strategy:fixed] relative inline-flex">
                            <button type="button" class="hs-dropdown-toggle inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-700"
                                aria-haspopup="menu" aria-expanded="false">
                    Tags
                    <span v-if="selectedTags.size" class="inline-flex items-center rounded-full bg-blue-600 text-white text-[11px] px-1.5 py-0.5">{{ selectedTags.size }}</span>
                    <svg class="size-4 text-gray-500 dark:text-neutral-400 hs-dropdown-open:rotate-180 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6"/></svg>
                  </button>
                            <div class="hs-dropdown-menu mt-2 w-64 z-20 hidden rounded-lg border border-gray-200 bg-white p-2 shadow-md dark:bg-neutral-800 dark:border-neutral-700">
                                <div class="max-h-60 overflow-auto pr-1">
                                    <label v-for="tag in tagsUi" :key="tag" class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer">
                        <input
                          type="checkbox"
                          class="shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600"
                          :checked="selectedTags.has(tag)"
                          @change="toggleTag(tag)"
                        >
                        <span class="text-sm text-gray-800 dark:text-neutral-200">#{{ tag }}</span>
                      </label>
                                </div>
                                <div class="mt-2 flex justify-between gap-2">
                                    <button @click="clearTags" class="text-xs px-2 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700 text-gray-700 dark:text-neutral-200">Clear</button>
                                    <button @click="applyFilters" class="text-xs px-2 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700">Apply</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lg:col-span-6 col-span-12">
                    <div class="card-blog max-h-[34rem] min-h-[34rem] overflow-hidden relative h-full w-full border rounded-xl border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 backdrop-blur-sm hover:shadow-md transition-shadow">
                        <img class="card-blog-image transition-all" src="/assets/images/activity.jpg" alt="">
                        <div class="card-blog-content p-5 overflow-hidden">
                            <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-lg text-xs font-medium bg-blue-100 dark:bg-blue-800/30 mb-3">Tahfidz</span>
                            <h1 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Tahfidz Berbasis Target & Analitik: Metrik Hafalan yang Membumi</h1>
                            <div class="flex justify-between items-center flex-wrap mt-3">
                                <div class="flex-grow flex gap-1">
                                    <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-md text-xs font-medium border border-gray-200 bg-white text-gray-800 shadow-2xs dark:bg-neutral-900 dark:border-neutral-700 dark:text-white">tahfidz</span>
                                    <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-md text-xs font-medium border border-gray-200 bg-white text-gray-800 shadow-2xs dark:bg-neutral-900 dark:border-neutral-700 dark:text-white">murajaah</span>
                                    <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-md text-xs font-medium border border-gray-200 bg-white text-gray-800 shadow-2xs dark:bg-neutral-900 dark:border-neutral-700 dark:text-white">edtech</span>
                                </div>
                                <div class="flex-grow md:w-auto w-full text-right">
                                    <span class="text-sm text-gray-800 dark:text-white">12 Agustus 2025 15:30</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-span-12 lg:col-span-6 space-y-4">
                    <div v-if="slides.length" class="w-full bg-white rounded-lg shadow-md dark:bg-neutral-800" :data-hs-carousel="JSON.stringify(hsOptions)">
                        <div class="relative">
                            <div class="hs-carousel relative overflow-hidden w-full min-h-64 bg-white rounded-lg dark:bg-neutral-900">
                                <div class="hs-carousel-body absolute top-0 bottom-0 start-0 flex flex-nowrap transition-transform duration-700 opacity-0">
                                    <div v-for="post in slides" :key="post.id" class="hs-carousel-slide">
                                        <article class="flex justify-center h-full p-0">
                                            <div class="relative h-full w-full overflow-hidden rounded-lg">
                                                <img :src="post.cover" :alt="post.title" class="absolute inset-0 h-full w-full object-cover">
                                                <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent"></div>
                                                <div class="relative h-full p-5 flex flex-col justify-end">
                                                    <div class="flex flex-wrap items-center gap-2">
                                                        <span class="inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-full bg-white/10 ring-1 ring-white/20 text-white">
                                                            {{ post.category }}
                                                        </span>
                                                        <span v-for="t in post.tags" :key="t" class="text-[11px] text-white/90">#{{ t }}</span>
                                                    </div>
                                                    <h3 class="mt-2 text-white text-lg sm:text-xl font-semibold leading-snug line-clamp-2">
                                                        <a :href="post.href" class="hover:underline">{{ post.title }}</a>
                                                    </h3>
                                                    <p class="mt-1 text-white/90 line-clamp-2">{{ post.excerpt }}</p>
                                                    <div class="mt-3 flex items-center gap-3 text-xs text-white/85">
                                                        <span>{{ post.dateText }}</span>
                                                        <span>•</span>
                                                        <span>{{ post.readTime }} min read</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </div>
                                </div>
                            </div>
                            <button type="button" class="hs-carousel-prev hs-carousel-disabled:opacity-50 disabled:pointer-events-none absolute inset-y-0 start-0 inline-flex justify-center items-center w-11.5 h-full text-gray-800 hover:bg-gray-800/10 focus:outline-hidden focus:bg-gray-800/10 rounded-s-lg dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10">
                                <span class="text-2xl" aria-hidden="true">
                                    <svg class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6"/>
                                    </svg>
                                </span>
                                <span class="sr-only">Previous</span>
                            </button>
                            <button type="button" class="hs-carousel-next hs-carousel-disabled:opacity-50 disabled:pointer-events-none absolute inset-y-0 end-0 inline-flex justify-center items-center w-11.5 h-full text-gray-800 hover:bg-gray-800/10 focus:outline-hidden focus:bg-gray-800/10 rounded-e-lg dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10">
                                <span class="sr-only">Next</span>
                                <span class="text-2xl" aria-hidden="true">
                                    <svg class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6"/>
                                    </svg>
                                </span>
                            </button>
                            <div class="hs-carousel-pagination flex justify-center absolute bottom-3 start-0 end-0 space-x-2"></div>
                        </div>
                    </div>
                    <div class="grid sm:grid-cols-2 gap-3">
                        <a v-for="post in miniList" :key="post.id" :href="post.href" class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700">
                            <img :src="post.cover" class="size-14 rounded-md object-cover" alt="">
                            <div>
                                <p class="text-xs text-gray-500 dark:text-neutral-400">{{ post.category }} • {{ post.readTime }}m</p>
                                <h4 class="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{{ post.title }}</h4>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {
        ref,
        computed,
        watch,
        nextTick,
        onMounted
    } from 'vue'
    type Post = {
        id: string
        title: string
        href: string
        excerpt: string
        cover: string
        dateText: string
        readTime: number
        category: string
        tags: string[]
    }
    /* sample data kiri (slider & mini list) */
    const allPosts = ref < Post[] > ([{
            id: 'p-01',
            title: 'Integrasi Diniyah & Literasi Digital: Model Kelas Hybrid',
            href: '#',
            excerpt: 'Kurikulum diniyah diperkaya literasi digital...',
            cover: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1200&auto=format&fit=crop',
            dateText: '10 Agustus 2025',
            readTime: 7,
            category: 'Pendidikan',
            tags: ['kurikulum', 'digital', 'inovasi']
        },
        {
            id: 'p-02',
            title: 'Analitik Tahfidz: Metrik Hafalan yang Membumi',
            href: '#',
            excerpt: 'Mengukur kualitas setoran & murajaah...',
            cover: '/assets/images/activity2.jpg',
            dateText: '5 Agustus 2025',
            readTime: 6,
            category: 'Tahfidz',
            tags: ['tahfidz', 'murajaah', 'edtech']
        },
        {
            id: 'p-03',
            title: 'Ekosistem E-Learning Pesantren: SIAKAD dan E-Library',
            href: '#',
            excerpt: 'Bangun ekosistem pembelajaran digital...',
            cover: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop',
            dateText: '1 Agustus 2025',
            readTime: 8,
            category: 'Teknologi',
            tags: ['e-learning', 'siakad', 'library']
        },
        {
            id: 'p-04',
            title: 'Muhadhoroh: Public Speaking Santri',
            href: '#',
            excerpt: 'Jadwal & rubrik penilaian sederhana...',
            cover: 'https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?q=80&w=1200&auto=format&fit=crop',
            dateText: '28 Juli 2025',
            readTime: 5,
            category: 'Kegiatan Santri',
            tags: ['muhadhoroh', 'soft-skill']
        },
        {
            id: 'p-05',
            title: 'Manajemen Asrama: Disiplin & Kemandirian',
            href: '#',
            excerpt: 'Checklist harian asrama...',
            cover: '/assets/images/activity1.jpg',
            dateText: '25 Juli 2025',
            readTime: 4,
            category: 'Kepesantrenan',
            tags: ['asrama', 'disiplin']
        },
        {
            id: 'p-06',
            title: 'Perpustakaan Aktif & Literasi Santri',
            href: '#',
            excerpt: 'Strategi kurasi koleksi...',
            cover: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
            dateText: '22 Juli 2025',
            readTime: 6,
            category: 'Sumber Daya',
            tags: ['perpustakaan', 'literasi']
        },
        {
            id: 'p-07',
            title: 'Olahraga Santri: Kurikulum Kebugaran',
            href: '#',
            excerpt: 'Template mingguan latihan fisik...',
            cover: '/assets/images/activity2.jpg',
            dateText: '18 Juli 2025',
            readTime: 3,
            category: 'Ekstrakurikuler',
            tags: ['olahraga', 'kebugaran']
        },
        {
            id: 'p-08',
            title: 'Zakat & Donasi Digital: QRIS & VA',
            href: '#',
            excerpt: 'Alur dan pelaporan ringkas donasi...',
            cover: 'https://images.unsplash.com/photo-1604594849809-dfedbc827105?q=80&w=1200&auto=format&fit=crop',
            dateText: '15 Juli 2025',
            readTime: 5,
            category: 'Keuangan',
            tags: ['qris', 'donasi']
        },
        { id:'p-09', title:'KIR Pesantren: Riset Sains Sederhana Berbasis Kitab', href:'#', excerpt:'Contoh proyek riset ringan untuk menumbuhkan rasa ingin tahu.', cover:'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop', dateText:'10 Juli 2025', readTime:6, category:'Ekstrakurikuler', tags:['kir','sains'] },
        { id:'p-10', title:'Etika Digital Santri: Adab Gawai & Internet Sehat', href:'#', excerpt:'Panduan adab bermedia sosial, menjaga fokus, dan literasi informasi.', cover:'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop', dateText:'7 Juli 2025', readTime:4, category:'Karakter', tags:['adab','digital'] },

    ])
    /* filters state */
    const selectedCategory = ref < 'Semua' | string > ('Semua')
    const selectedTags = ref < Set < string >> (new Set())
    const pendingTags = ref < Set < string >> (new Set()) // untuk dropdown sebelum apply
    const categoriesUi = computed(() => {
        return ['Semua', ...Array.from(new Set(allPosts.value.map(p => p.category))).sort()]
    })
    const tagsUi = computed(() => Array.from(new Set(allPosts.value.flatMap(p => p.tags))).sort((a, b) => a.localeCompare(b)))
    function setCategory(cat: string) {
        selectedCategory.value = (cat as any)
    }
    function toggleTag(tag: string) {
        const next = new Set(pendingTags.value.size ? pendingTags.value : selectedTags.value)
        next.has(tag) ? next.delete(tag) : next.add(tag)
        pendingTags.value = next
    }
    function clearTags() {
        pendingTags.value = new Set()
    }
    function applyFilters() {
        if (pendingTags.value.size) selectedTags.value = new Set(pendingTags.value)
        else selectedTags.value = new Set()
    }
    function resetFilters() {
        selectedCategory.value = 'Semua'
        selectedTags.value = new Set()
        pendingTags.value = new Set()
    }
    /* derived lists */
    const filtered = computed(() => {
        const catOk = (p: Post) => selectedCategory.value === 'Semua' || p.category === selectedCategory.value
        const tagsOk = (p: Post) => Array.from(selectedTags.value).every(t => p.tags.includes(t))
        return allPosts.value.filter(p => catOk(p) && tagsOk(p))
    })
    const slides = computed(() => filtered.value.slice(0, 4))
    const miniList = computed(() => filtered.value.slice(4, 10))
    /* @preline/carousel options */
    const hsOptions = {
        isAutoPlay: true,
        interval: 3800,
        isInfinite: true,
        slidesView: 1,
        gap: 16,
        breakpoints: {
            640: {
                slidesView: 2,
                gap: 16
            },
            1024: {
                slidesView: 2,
                gap: 16
            },
            1280: {
                slidesView: 3,
                gap: 16
            }
        },
        loadingClasses: 'opacity-0'
    }
    /* init / reinit carousel */
    async function initCarousel() {
        try {
            // prefer module package
            const mod = await
            import ('@preline/carousel')
            // some builds export autoInit, some rely on HSStaticMethods
            // @ts-ignore
            mod.autoInit?.()
            // @ts-ignore
            window.HSStaticMethods?.autoInit?.()
        } catch {
            const {
                HSStaticMethods
            } = await
            import ('preline')
            HSStaticMethods?.autoInit?.()
            // @ts-ignore
            window.HSStaticMethods?.autoInit?.()
        }
    }
    onMounted(() => {
        initCarousel()
    })
    watch([slides, miniList], async() => {
        await nextTick();
        initCarousel()
    })
</script>

<style>
    .card-blog-image {
        width: 100%;
        height: 65%;
        object-fit: cover;
        object-position: center;
    }
    .card-blog:hover .card-blog-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }
    .card-blog:hover .card-blog-content {
        position: absolute;
        bottom: 2%;
        left: 2%;
        width: 96%;
        border-radius: 16px;
        background: white;
    }
    .dark .card-blog:hover .card-blog-content {
        background: rgba(23, 23, 23, 0.8);
        backdrop-filter: blur(6px);
    }
</style>
