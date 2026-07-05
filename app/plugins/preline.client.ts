import { nextTick } from 'vue'
import { defineNuxtPlugin } from 'nuxt/app'

type PrelineModule = {
  HSStaticMethods?: {
    autoInit?: () => void
  }
}

let prelinePromise: Promise<PrelineModule> | null = null
let initTimer: ReturnType<typeof window.setTimeout> | null = null

function scheduleIdle(callback: () => void) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout: 1200 })
    return
  }

  window.setTimeout(callback, 120)
}

async function initPreline() {
  prelinePromise ||= import('preline') as Promise<PrelineModule>

  const mod = await prelinePromise
  const methods = window.HSStaticMethods || mod.HSStaticMethods

  methods?.autoInit?.()
}

export default defineNuxtPlugin((nuxtApp) => {
  const queueInit = () => {
    if (initTimer) window.clearTimeout(initTimer)

    initTimer = window.setTimeout(() => {
      scheduleIdle(async () => {
        await nextTick()
        await initPreline()
      })
    }, 32)
  }

  nuxtApp.hook('app:mounted', queueInit)
  nuxtApp.hook('page:finish', queueInit)
})
