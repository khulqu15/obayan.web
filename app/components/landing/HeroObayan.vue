<template>
    <section id="home" class="relative overflow-hidden pt-36 pb-24 sm:pt-40">
        <!-- Background: gradient + dots -->
        <div class="absolute inset-0 -z-10">
            <div class="h-full w-full bg-gradient-to-b from-emerald-50/60 via-white to-white dark:from-emerald-900/20 dark:via-neutral-900 dark:to-neutral-950" />
            <div class="pointer-events-none absolute inset-0
            [background-image:radial-gradient(rgba(16,185,129,0.08)_1px,transparent_1px)]
            [background-size:18px_18px]" />
        </div>
        <!-- Abstract hero image -->
        <div class="absolute top-32 right-0 h-full w-1/2 -z-0 hidden lg:block" aria-hidden="true">
            <img src="/assets/images/hero.png" alt="Obayan dashboard background" class="w-full h-full object-cover object-left rounded-l-3xl opacity-90" />
        </div>
        <div class="relative max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid lg:grid-cols-12 gap-12 items-center">
                <!-- LEFT: Copy -->
                <div class="lg:col-span-6">
                    <h1 class="text-4xl sm:text-6xl font-extrabold leading-[1.05] tracking-tight text-gray-900 dark:text-white">
                        <span class="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">
                  Platform Pesantren Modern
                </span>
                        <br class="hidden sm:block" /> yang <span class="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-neutral-300">ramah dipakai</span>
                    </h1>
                    <p class="mt-5 text-gray-700 dark:text-neutral-300 text-base sm:text-lg max-w-2xl">
                        Obayan menyatukan web profile, SIAKAD, pembayaran, akademik, absensi
                        <span class="font-semibold">RFID &amp; Fingerprint (ToriID)</span>, kunjungan, pelanggaran, hingga perizinan dalam satu portal yang ringan &amp; menyenangkan.
                    </p>
                    <!-- CTA -->
                    <div class="mt-7 flex flex-wrap gap-3">
                        <a href="#demo" class="inline-flex items-center justify-center rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 text-sm font-semibold transition focus:outline-hidden focus:ring-2 focus:ring-emerald-400">
                  Coba Demo Sekarang
                </a>
                        <a href="#features" class="inline-flex items-center justify-center rounded-2xl border border-gray-300 dark:border-neutral-700 px-5 py-3 text-sm font-semibold text-gray-800 dark:text-neutral-100 hover:bg-gray-50 dark:hover:bg-neutral-800 transition">
                  Lihat Fitur
                </a>
                    </div>
                    <!-- Stats -->
                    <dl class="mt-10 grid grid-cols-3 max-w-xl gap-4">
                        <div class="rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center shadow-sm">
                            <dt class="text-[11px] uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                    Tenant aktif
                  </dt>
                            <dd class="text-2xl font-bold tabular-nums">100+</dd>
                        </div>
                        <div class="rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center shadow-sm">
                            <dt class="text-[11px] uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                    Scan harian
                  </dt>
                            <dd class="text-2xl font-bold tabular-nums">50K+</dd>
                        </div>
                        <div class="rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center shadow-sm">
                            <dt class="text-[11px] uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                    Uptime
                  </dt>
                            <dd class="text-2xl font-bold tabular-nums">99.9%</dd>
                        </div>
                    </dl>
                </div>
                <div class="lg:col-span-6 lg:hidden block">
                    <div class="relative" @mousemove="onMove" @mouseleave="onLeave">
                        <!-- glow -->
                        <div class="absolute -inset-6 rounded-[2rem] bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20 blur-2xl -z-10"></div>
                        <div class="group rounded-3xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-2xl p-4 transition-transform will-change-transform" :style="tiltStyle">
                            <div class="relative overflow-hidden rounded-2xl">
                                <img src="/assets/images/hero.png" alt="Obayan dashboard" class="hidden lg:block w-full rounded-2xl object-cover select-none" draggable="false" />
                                <img src="/assets/images/hero-obayan.png" alt="Obayan dashboard" class="block lg:hidden w-full rounded-2xl object-cover select-none" draggable="false" />
                                <div class="pointer-events-none absolute -top-1/3 -left-1/3 w-[140%] h-[140%] rotate-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700" aria-hidden="true">
                                    <div class="w-full h-full bg-gradient-to-r from-white/0 via-white/25 to-white/0 blur-xl"></div>
                                </div>
                                <div class="absolute bottom-4 left-4 rounded-full bg-white/80 dark:bg-neutral-900/70 backdrop-blur px-3 py-1.5 border border-gray-200/70 dark:border-neutral-700 shadow-sm">
                                    <span class="relative inline-flex size-2 mr-1 align-middle">
                            <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 animate-ping"></span>
                                    <span class="relative inline-flex rounded-full bg-emerald-600 size-2"></span>
                                    </span>
                                    <span class="text-[12px] font-medium text-gray-800 dark:text-neutral-100">Realtime sinkron</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import {
        Icon
    } from "@iconify/vue"
    import {
        ref
    } from "vue"
    const tiltStyle = ref < Record < string,
        string >> ({})
    function onMove(e: MouseEvent) {
        const card = (e.currentTarget as HTMLElement).querySelector('.group') as HTMLElement
        if (!card) return
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const rotateY = ((x / rect.width) - 0.5) * 8 // max 8deg
        const rotateX = -((y / rect.height) - 0.5) * 8
        tiltStyle.value = {
            transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
        }
    }
    function onLeave() {
        tiltStyle.value = {
            transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg)',
            transition: 'transform .35s ease'
        }
    }
</script>