<!-- components/MaintenanceGame.vue -->
<template>
  <div class="relative overflow-hidden p-4 sm:p-6">
    <!-- HUD -->
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div class="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-blue-100 800 dark:bg-blue-900/40 dark:100">
        <Icon icon="ph:game-controller-duotone" class="size-5" />
        <span class="text-sm font-semibold">Catch the Gems</span>
      </div>

      <div class="flex items-center gap-2 text-sm">
        <span class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 bg-emerald-100 700 dark:bg-emerald-900/40 dark:200">
          <Icon icon="ph:timer-duotone" class="size-4" />
          {{ timeLeft }}s
        </span>
        <span class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 bg-blue-100 700 dark:bg-blue-900/40 dark:200">
          <Icon icon="ph:trophy-duotone" class="size-4" />
          {{ score }}
        </span>
        <span v-if="combo>=2" class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200">
          <Icon icon="ph:fire-duotone" class="size-4" />
          x{{ combo }} combo
        </span>
      </div>
    </div>

    <div ref="arenaRef" class="relative w-full h-[360px] sm:h-[420px] rounded-2xl ring-1 ring-inset ring-emerald-200/70 bg-linear-to-b from-emerald-50/80 to-blue-50/60 dark:from-neutral-800 dark:to-neutral-900 overflow-hidden select-none" @click="spawnTap($event)" >
      <transition-group name="pop" tag="div">
        <button v-for="item in items" :key="item.id" class="absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl p-2 sm:p-2.5 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md shadow-md hover:scale-110 active:scale-95 transition" :style="{ left: item.x + 'px', top: item.y + 'px' }" @click.stop="collect(item.id)" @touchstart.stop.prevent="collect(item.id)" :aria-label="item.kind" >
          <Icon :icon="iconFor(item.kind)" class="size-6 sm:size-7" :class="item.kind==='bomb' ? 'text-rose-500' : 'text-green-600'" />
        </button>
      </transition-group>

      <div v-if="state==='idle'" class="absolute inset-0 grid place-items-center">
        <div class="text-center">
          <p class="text-sm 900/70 dark:text-neutral-300">Klik/tap permata & bintang. Hindari bom!</p>
          <button @click="start()" class="mt-3 inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 font-semibold bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 transition shadow-lg shadow-emerald-500/20" >
            <Icon icon="ph:play-duotone" class="size-5" />
            Mulai Game (30s)
          </button>
        </div>
      </div>

      <div v-if="state==='done'" class="absolute inset-0 grid place-items-center">
        <div class="text-center rounded-2xl px-5 py-4 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md ring-1 ring-neutral-200/60 dark:ring-neutral-700">
          <h3 class="text-lg font-bold text-green-900 dark:100">Waktu Habis!</h3>
          <p class="mt-1 text-sm text-green-900/70 dark:text-neutral-300">Skor kamu: <span class="font-semibold">{{ score }}</span></p>
          <button @click="start()" class="mt-3 inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 font-semibold bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition shadow-lg shadow-blue-600/20" >
            <Icon icon="ph:arrow-counter-clockwise-duotone" class="size-5" />
            Main Lagi
          </button>
        </div>
      </div>
    </div>

    <p class="mt-3 text-xs text-center 900/60 dark:text-neutral-400">
      Tip: klik cepat beberapa item berurutan untuk menaikkan <span class="font-semibold">combo</span> dan bonus skor 💎
    </p>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { ref, onMounted, onBeforeUnmount } from 'vue'

type Kind = 'gem' | 'star' | 'bomb'
type Item = { id: number, kind: Kind, x: number, y: number, vy: number }

const props = defineProps<{ duration?: number }>()
const duration = props.duration ?? 30

const arenaRef = ref<HTMLElement | null>(null)
const items = ref<Item[]>([])
const nextId = ref(1)

const score = ref(0)
const combo = ref(0)
const timeLeft = ref(duration)
const state = ref<'idle'|'play'|'done'>('idle')

let raf = 0
let ticker = 0
let lastTs = 0
let spawnClock = 0
let intervalTimer: number | undefined

const iconFor = (k: Kind) => {
  if (k === 'gem') return 'ph:diamond-duotone'
  if (k === 'star') return 'ph:star-duotone'
  return 'ph:skull-duotone'
}

function reset() {
  items.value = []
  nextId.value = 1
  score.value = 0
  combo.value = 0
  timeLeft.value = duration
  state.value = 'idle'
  cancelAnimationFrame(raf)
  clearInterval(intervalTimer)
}

function start() {
  reset()
  state.value = 'play'
  lastTs = performance.now()
  spawnClock = 0
  raf = requestAnimationFrame(loop)

  intervalTimer = window.setInterval(() => {
    if (timeLeft.value > 0) timeLeft.value--
    if (timeLeft.value <= 0) {
      end()
    }
  }, 1000)
}

function end() {
  state.value = 'done'
  cancelAnimationFrame(raf)
  clearInterval(intervalTimer)
}

function spawn(kind?: Kind) {
  const arena = arenaRef.value
  if (!arena) return
  const rect = arena.getBoundingClientRect()
  const x = Math.random() * rect.width
  const y = -20
  let k: Kind
  if (kind) k = kind
  else {
    const r = Math.random()
    k = r < 0.5 ? 'gem' : r < 0.85 ? 'star' : 'bomb'
  }
  const vy = 60 + Math.random() * 120 // px/s
  items.value.push({ id: nextId.value++, kind: k, x, y, vy })
}

function collect(id: number) {
  if (state.value !== 'play') return
  const i = items.value.findIndex(el => el.id === id)
  if (i === -1) return
  const it = items.value[i]
  items.value.splice(i, 1)

  if (it!.kind === 'bomb') {
    // penalty
    combo.value = 0
    score.value = Math.max(0, score.value - 5)
  } else {
    combo.value = Math.min(10, combo.value + 1)
    const base = it!.kind === 'gem' ? 3 : 2
    score.value += base + Math.floor(combo.value * 0.6)
    // occasional bonus time
    if (Math.random() < 0.12) timeLeft.value = Math.min(duration, timeLeft.value + 1)
  }
}

function spawnTap(e: MouseEvent) {
  if (state.value !== 'play') return
  // small feedback spawn (star) where user taps
  const arena = arenaRef.value
  if (!arena) return
  const rect = arena.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  items.value.push({ id: nextId.value++, kind: 'star', x, y, vy: 0 })
  // auto-collect tapped star
  setTimeout(() => collect(nextId.value - 1), 50)
}

function loop(ts: number) {
  const dt = Math.min(0.032, (ts - lastTs) / 1000) // clamp dt
  lastTs = ts
  spawnClock += dt
  ticker += dt

  // Spawn pacing: more intense over time
  const rate = Math.max(0.35, 0.9 - (duration - timeLeft.value) * 0.02)
  if (spawnClock >= rate) {
    spawn()
    if (Math.random() < 0.25) spawn('gem')
    spawnClock = 0
  }

  // Move items
  const arena = arenaRef.value
  const rect = arena?.getBoundingClientRect()
  items.value = items.value
    .map(it => {
      if (it.vy > 0) it.y += it.vy * dt
      return it
    })
    .filter(it => {
      if (!rect) return true
      const out = it.y < rect.height + 30
      if (!out && it.kind !== 'bomb') {
        combo.value = 0 // miss breaks combo
      }
      return out
    })

  raf = requestAnimationFrame(loop)
}

onMounted(() => {
  // auto start on desktop; keep idle on mobile until user interacts
  if (window.matchMedia('(pointer:fine)').matches) {
    setTimeout(() => start(), 400)
  }
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  clearInterval(intervalTimer)
})
</script>

<style scoped>
.pop-enter-active, .pop-leave-active { transition: all .18s ease; }
.pop-enter-from { transform: translate(-50%,-50%) scale(.6); opacity: 0; }
.pop-leave-to   { transform: translate(-50%,-50%) scale(.6); opacity: 0; }
</style>
