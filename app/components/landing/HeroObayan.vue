<template>
    <section id="home" class="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-base-100">
        <div class="absolute inset-0 -z-20 overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,197,94,0.16),transparent_28%),radial-gradient(circle_at_82%_24%,rgba(16,185,129,0.10),transparent_26%),linear-gradient(180deg,#f7fff9_0%,#ffffff_45%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_18%_18%,rgba(34,197,94,0.12),transparent_28%),linear-gradient(180deg,#06110b_0%,#0a0f0d_55%,#090909_100%)]" />
            <div class="absolute inset-0 bg-[radial-gradient(rgba(34,197,94,0.10)_1px,transparent_1px)] opacity-70 [background-size:22px_22px]" />

            <div class="bg-blob absolute -left-24 top-[13%] h-72 w-72 rounded-full bg-green-300/30 blur-3xl dark:bg-green-500/10" />
            <div class="bg-blob bg-blob-delay-1 absolute right-24 top-[18%] h-80 w-80 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-400/10" />
            <div class="bg-blob bg-blob-delay-2 absolute -bottom-28 left-[38%] h-80 w-80 rounded-full bg-lime-200/30 blur-3xl dark:bg-lime-300/10" />
        </div>

        <!-- Left decoration: Wali App -->
        <div
            class="pointer-events-none absolute inset-y-0 left-0 md:top-0 -top-72 z-0 flex w-full items-center overflow-hidden lg:left-[-5%]"
            aria-hidden="true"
        >
            <div class="relative flex w-full [perspective:1600px]">
                <Transition name="flip-left" mode="out-in">
                    <div :key="waliDecorImage.src" class="decor-flip-frame flex w-full justify-start">
                        <div class="decor-float-left flex w-full justify-start">
                            <img
                                :src="waliDecorImage.src"
                                :alt="waliDecorImage.alt"
                                draggable="false"
                                class="decor-image ml-[-34%] w-[82%] select-none rounded-xl skew-6 opacity-80 shadow-2xl shadow-green-900/15 ring-1 ring-white/50 [backface-visibility:hidden] [mask-image:linear-gradient(to_bottom,black_0%,black_78%,transparent_100%)] dark:opacity-60 dark:ring-white/10 sm:ml-[-24%] sm:w-[62%] sm:opacity-85 md:ml-[-16%] md:w-[50%] md:opacity-90 lg:ml-0 lg:w-[35%] lg:opacity-80"
                            >
                        </div>
                    </div>
                </Transition>
            </div>
        </div>

        <!-- Right decoration: Admin App -->
        <div
            class="pointer-events-none absolute inset-y-0 right-0 z-0 flex md:bottom-0 -bottom-36 w-full items-center justify-end overflow-hidden lg:right-[-5%]"
            aria-hidden="true"
        >
            <div class="relative flex w-full justify-end [perspective:1600px]">
                <Transition name="flip-right" mode="out-in">
                    <div :key="adminDecorImage.src" class="decor-flip-frame flex w-full justify-end">
                        <div class="decor-float-right flex w-full justify-end">
                            <img
                                :src="adminDecorImage.src"
                                :alt="adminDecorImage.alt"
                                draggable="false"
                                class="decor-image mr-[-34%] w-[82%] select-none rounded-xl -skew-6 opacity-80 shadow-2xl shadow-green-900/15 ring-1 ring-white/50 [backface-visibility:hidden] [mask-image:linear-gradient(to_bottom,black_0%,black_78%,transparent_100%)] dark:opacity-60 dark:ring-white/10 sm:mr-[-24%] sm:w-[62%] sm:opacity-85 md:mr-[-16%] md:w-[50%] md:opacity-90 lg:mr-0 lg:w-[35%] lg:opacity-80"
                            >
                        </div>
                    </div>
                </Transition>
            </div>
        </div>

        <div class="relative z-10 mb-12 w-full max-w-[61.8rem] px-4 text-center sm:mb-20">
            <div class="relative inline-block overflow-hidden rounded-[2rem] border border-white/50 bg-white/55 p-8 shadow-2xl shadow-green-900/5 backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-950/45 sm:p-10 lg:p-12">
                <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/55 via-white/20 to-green-100/20 dark:from-white/10 dark:via-transparent dark:to-green-500/10" />

                <div class="relative">
                    <div class="inline-block rounded-xl bg-green-600/10 px-4 py-1 text-green-700 ring-1 ring-green-600/10 dark:text-green-300">
                        <div class="flex items-center justify-center gap-3 text-sm font-medium">
                            <Icon icon="vaadin:academy-cap" width="16" height="16" />
                            Digital Akademik
                        </div>
                    </div>

                    <div>
                        <h2 class="mx-auto mt-5 mb-4 max-w-3xl text-balance text-2xl font-semibold leading-[1.04] tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
                            Satu ruang digital untuk <br>
                            <span class="bg-gradient-to-r from-green-600 via-emerald-500 to-green-500 bg-clip-text font-bold text-transparent">
                                pendidikan yang lebih cerdas
                            </span>
                        </h2>

                        <p class="mx-auto mt-2 mb-7 max-w-xl text-sm leading-7 text-gray-600 dark:text-neutral-300 sm:text-base">
                            Inovasi terjaga, solusi tertata
                        </p>

                        <div class="flex flex-wrap items-center justify-center gap-3">
                            <button class="btn rounded-xl border-0 bg-green-600 px-5 py-2 text-white shadow-xl shadow-green-500/20 transition duration-300 hover:-translate-y-0.5 hover:bg-green-700">
                                Mulai Sekarang
                            </button>

                            <button class="btn rounded-xl border-0 bg-gray-200 px-5 py-2 text-gray-800 transition duration-300 hover:-translate-y-0.5 hover:bg-gray-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
                                Pelajari
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="pointer-events-none absolute inset-x-0 bottom-0 h-[42vh] min-h-[300px] overflow-hidden">
            <svg
                class="absolute inset-0 h-full w-full"
                viewBox="0 0 1200 420"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient id="tailGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#22c55e" stop-opacity="0.04" />
                        <stop offset="48%" stop-color="#22c55e" stop-opacity="0.36" />
                        <stop offset="100%" stop-color="#16a34a" stop-opacity="1" />
                    </linearGradient>

                    <filter id="tailGlow" x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur stdDeviation="3.8" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <path
                    ref="motionPath"
                    :d="currentRoute.d"
                    fill="none"
                    stroke="transparent"
                    stroke-width="1"
                />

                <polyline
                    ref="tailLine"
                    fill="none"
                    stroke="url(#tailGradient)"
                    stroke-width="7.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    filter="url(#tailGlow)"
                />

                <g ref="arrowHead">
                    <path
                        d="M -10 -10 L 13 0 L -10 10 L -8 0 Z"
                        fill="#16a34a"
                        filter="url(#tailGlow)"
                    />
                </g>
            </svg>

            <div class="absolute inset-0 hidden sm:block">
                <div
                    v-if="activeBadge"
                    class="flow-badge is-active absolute inline-flex items-center gap-2 rounded-2xl border border-green-100 bg-white/95 px-3 py-2 text-xs font-bold text-green-700 shadow-xl shadow-green-100/50 backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/90 dark:text-green-300"
                    :style="{
                        left: `${(badgePosition.x / VIEWBOX_W) * 100}%`,
                        top: `${(badgePosition.y / VIEWBOX_H) * 100}%`
                    }"
                >
                    <span class="grid size-6 place-items-center rounded-xl bg-green-600 text-white">
                        <Icon :icon="activeBadge.icon" width="14" height="14" />
                    </span>
                    {{ activeBadge.label }}
                </div>
            </div>

            <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent dark:from-neutral-950" />
        </div>
    </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { Ref } from 'vue'

type Point = {
  x: number
  y: number
}

type FeatureBadge = Point & {
  label: string
  icon: string
}

type FlowRoute = {
  id: string
  d: string
  badges: FeatureBadge[]
}

type TrailPoint = Point & {
  t: number
}

type DecorImage = {
  src: string
  alt: string
}

const VIEWBOX_W = 1200
const VIEWBOX_H = 420

const motionPath: Ref<SVGPathElement | null> = ref(null)
const tailLine: Ref<SVGPolylineElement | null> = ref(null)
const arrowHead: Ref<SVGGElement | null> = ref(null)

const activeBadge = ref<{ label: string; icon: string } | null>(null)
const badgePosition = ref<Point>({ x: 0, y: 0 })

const adminImages: DecorImage[] = [
  { src: '/assets/images/dashboard-ui.png', alt: 'Tampilan dashboard admin' },
  { src: '/assets/images/news-ui.png', alt: 'Tampilan pengelolaan berita admin' },
  { src: '/assets/images/cms-ui.png', alt: 'Tampilan CMS admin' },
]

const waliImages: DecorImage[] = [
  { src: '/assets/images/wali-dashboard-ui.png', alt: 'Tampilan dashboard wali' },
  { src: '/assets/images/wali-santri-ui.png', alt: 'Tampilan data santri wali' },
  { src: '/assets/images/wali-payment-ui.png', alt: 'Tampilan pembayaran wali' },
]

const activeAdminIndex = ref(0)
const activeWaliIndex = ref(0)

const adminDecorImage = computed(() => adminImages[activeAdminIndex.value]!)
const waliDecorImage = computed(() => waliImages[activeWaliIndex.value]!)

const featurePool = [
  { label: 'Website', icon: 'ph:globe' },
  { label: 'SIAKAD', icon: 'ph:chalkboard-teacher' },
  { label: 'Portal', icon: 'ph:users-three' },
  { label: 'Absensi', icon: 'ph:qr-code' },
  { label: 'PPDB', icon: 'ph:note-pencil' },
  { label: 'Data', icon: 'ph:database' },
  { label: 'Insight', icon: 'ph:chart-line-up' },
  { label: 'Komunikasi', icon: 'ph:megaphone' },
]

const DURATION = 7800
const CORNER_RADIUS = 44
const BADGE_TRIGGER_DISTANCE = 38
const DECOR_INTERVAL = 9000

const trailPoints: TrailPoint[] = []

let rafId = 0
let cycleStartedAt = 0
let routeIndex = 0
let decorTimer: ReturnType<typeof setInterval> | null = null
let passedBadgeIndexes = new Set<number>()

const currentRoute = ref<FlowRoute>(makeRandomRoute())

function randomBetween(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min))
}

function sampleFeatures(count: number) {
  const shuffled = [...featurePool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function buildRoundedPath(points: Point[], radius = 32) {
  if (points.length < 2) return ''

  let d = `M ${points[0]!.x} ${points[0]!.y}`

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1]!
    const current = points[i]!
    const next = points[i + 1]!

    const v1 = {
      x: current.x - prev.x,
      y: current.y - prev.y,
    }

    const v2 = {
      x: next.x - current.x,
      y: next.y - current.y,
    }

    const len1 = Math.hypot(v1.x, v1.y)
    const len2 = Math.hypot(v2.x, v2.y)

    if (!len1 || !len2) continue

    const r = Math.min(radius, len1 / 2, len2 / 2)

    const p1 = {
      x: current.x - (v1.x / len1) * r,
      y: current.y - (v1.y / len1) * r,
    }

    const p2 = {
      x: current.x + (v2.x / len2) * r,
      y: current.y + (v2.y / len2) * r,
    }

    d += ` L ${p1.x} ${p1.y}`
    d += ` Q ${current.x} ${current.y} ${p2.x} ${p2.y}`
  }

  const last = points[points.length - 1]!
  d += ` L ${last.x} ${last.y}`

  return d
}

function makeRandomRoute(): FlowRoute {
  routeIndex += 1

  const yStart = randomBetween(330, 376)
  const xA = randomBetween(260, 430)
  const yA = randomBetween(165, 235)
  const xB = randomBetween(560, 720)
  const yB = randomBetween(270, 340)

  const useExtraBend = Math.random() > 0.48

  const points: Point[] = useExtraBend
    ? [
        { x: -140, y: yStart },
        { x: xA, y: yStart },
        { x: xA, y: yA },
        { x: xB, y: yA },
        { x: xB, y: yB },
        { x: randomBetween(850, 960), y: yB },
        { x: randomBetween(850, 960), y: randomBetween(190, 260) },
        { x: 1340, y: randomBetween(190, 260) },
      ]
    : [
        { x: -140, y: yStart },
        { x: xA, y: yStart },
        { x: xA, y: yA },
        { x: xB, y: yA },
        { x: xB, y: yB },
        { x: 1340, y: yB },
      ]

  const features = sampleFeatures(points.length - 2)

  const badges: FeatureBadge[] = points.slice(1, -1).map((p, index) => ({
    x: p.x,
    y: p.y,
    label: features[index]?.label || 'Fitur',
    icon: features[index]?.icon || 'ph:sparkle',
  }))

  return {
    id: `route-${routeIndex}`,
    d: buildRoundedPath(points, CORNER_RADIUS),
    badges,
  }
}

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function resetCycle(time: number) {
  const nextRoute = makeRandomRoute()

  currentRoute.value = nextRoute

  if (motionPath.value) {
    motionPath.value.setAttribute('d', nextRoute.d)
  }

  cycleStartedAt = time
  activeBadge.value = null
  passedBadgeIndexes = new Set()
  trailPoints.length = 0

  if (tailLine.value) {
    tailLine.value.setAttribute('points', '')
  }
}

function animate(time: number) {
  if (!motionPath.value || !tailLine.value || !arrowHead.value) {
    rafId = requestAnimationFrame(animate)
    return
  }

  if (!cycleStartedAt) {
    cycleStartedAt = time
  }

  const elapsed = time - cycleStartedAt

  if (elapsed >= DURATION) {
    resetCycle(time)
    rafId = requestAnimationFrame(animate)
    return
  }

  const progress = elapsed / DURATION
  const path = motionPath.value
  const totalLength = path.getTotalLength()
  const currentLength = totalLength * progress

  const point = path.getPointAtLength(currentLength)
  const nextPoint = path.getPointAtLength(Math.min(totalLength, currentLength + 2))

  const angle =
    Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI)

  const last = trailPoints[trailPoints.length - 1]

  if (!last || distance(last, point) > 2.25) {
    trailPoints.push({
      x: point.x,
      y: point.y,
      t: time,
    })
  }

  tailLine.value.setAttribute(
    'points',
    trailPoints.map((p) => `${p.x},${p.y}`).join(' ')
  )

  arrowHead.value.setAttribute(
    'transform',
    `translate(${point.x} ${point.y}) rotate(${angle})`
  )

  for (let i = 0; i < currentRoute.value.badges.length; i++) {
    const badge = currentRoute.value.badges[i]

    if (!passedBadgeIndexes.has(i) && badge && distance(point, badge) < BADGE_TRIGGER_DISTANCE) {
      passedBadgeIndexes.add(i)
      activeBadge.value = {
        label: badge.label,
        icon: badge.icon,
      }
      break
    }
  }

  if (activeBadge.value) {
    badgePosition.value = {
      x: Math.min(point.x + 42, VIEWBOX_W - 96),
      y: Math.max(point.y - 34, 30),
    }
  }

  rafId = requestAnimationFrame(animate)
}

function startDecorFlip() {
  decorTimer = setInterval(() => {
    activeAdminIndex.value = (activeAdminIndex.value + 1) % adminImages.length
    activeWaliIndex.value = (activeWaliIndex.value + 1) % waliImages.length
  }, DECOR_INTERVAL)
}

onMounted(() => {
  rafId = requestAnimationFrame(animate)
  startDecorFlip()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)

  if (decorTimer) {
    clearInterval(decorTimer)
    decorTimer = null
  }
})
</script>

<style scoped>
.bg-blob {
  animation: blobFloat 12s ease-in-out infinite;
}

.bg-blob-delay-1 {
  animation-delay: 3s;
}

.bg-blob-delay-2 {
  animation-delay: 4s;
}

.decor-image {
  -webkit-user-drag: none;
  user-select: none;
  will-change: transform, opacity, filter;
}

.decor-float-left {
  animation: decorFloatLeft 7.5s ease-in-out infinite;
}

.decor-float-right {
  animation: decorFloatRight 8.25s ease-in-out infinite;
}

.flip-left-enter-active,
.flip-left-leave-active,
.flip-right-enter-active,
.flip-right-leave-active {
  transition:
    opacity 720ms ease,
    filter 720ms ease,
    transform 920ms cubic-bezier(0.22, 1, 0.36, 1);
  transform-style: preserve-3d;
  will-change: transform, opacity, filter;
}

.flip-left-enter-from {
  opacity: 0;
  filter: blur(14px);
  transform: translate3d(-38px, 14px, 0) rotateY(-76deg) scale(0.96);
}

.flip-left-leave-to {
  opacity: 0;
  filter: blur(12px);
  transform: translate3d(26px, -10px, 0) rotateY(64deg) scale(0.96);
}

.flip-right-enter-from {
  opacity: 0;
  filter: blur(14px);
  transform: translate3d(38px, 14px, 0) rotateY(76deg) scale(0.96);
}

.flip-right-leave-to {
  opacity: 0;
  filter: blur(12px);
  transform: translate3d(-26px, -10px, 0) rotateY(-64deg) scale(0.96);
}

.flow-badge {
  transform: translate(-50%, -50%) scale(0.96);
  opacity: 0;
  filter: blur(1px);
  transition:
    opacity 520ms ease,
    filter 520ms ease,
    transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform, opacity, left, top;
}

.flow-badge.is-active {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  filter: blur(0);
}

@keyframes blobFloat {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  25% {
    transform: translate3d(18px, -12px, 0) scale(1.04);
  }

  50% {
    transform: translate3d(-12px, 14px, 0) scale(0.98);
  }

  75% {
    transform: translate3d(12px, 8px, 0) scale(1.02);
  }
}

@keyframes decorFloatLeft {
  0%,
  100% {
    transform: translate3d(0, 0, 0) rotateZ(0deg);
  }

  50% {
    transform: translate3d(10px, -14px, 0) rotateZ(-1.2deg);
  }
}

@keyframes decorFloatRight {
  0%,
  100% {
    transform: translate3d(0, 0, 0) rotateZ(0deg);
  }

  50% {
    transform: translate3d(-10px, -16px, 0) rotateZ(1.2deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .bg-blob,
  .decor-float-left,
  .decor-float-right {
    animation: none !important;
  }

  .flip-left-enter-active,
  .flip-left-leave-active,
  .flip-right-enter-active,
  .flip-right-leave-active,
  .flow-badge {
    transition-duration: 0.01ms !important;
  }

  * {
    scroll-behavior: auto !important;
  }
}
</style>