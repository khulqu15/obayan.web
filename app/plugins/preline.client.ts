import { defineNuxtPlugin } from 'nuxt/app'

type IdleCallback = (callback: () => void, options?: { timeout?: number }) => number

function runWhenIdle(callback: () => void) {
  const requestIdleCallback = (window as unknown as { requestIdleCallback?: IdleCallback }).requestIdleCallback

  if (requestIdleCallback) {
    requestIdleCallback(callback, { timeout: 1800 })
    return
  }

  window.setTimeout(callback, 800)
}

export default defineNuxtPlugin((nuxtApp) => {
  let prelineReady: Promise<void> | null = null

  const initPreline = () => {
    const hs = (window as unknown as { HSStaticMethods?: { autoInit?: () => void } }).HSStaticMethods
    hs?.autoInit?.()
  }

  const loadPreline = () => {
    prelineReady ||= Promise.all([
      import('preline/dist'),
      import('preline')
    ])
      .then(([, preline]) => {
        preline.HSStaticMethods?.autoInit?.()
        initPreline()
      })
      .catch((error) => {
        console.error('[preline] failed to load', error)
      })

    return prelineReady
  }

  if (document.readyState === 'complete') {
    runWhenIdle(loadPreline)
  } else {
    window.addEventListener('load', () => runWhenIdle(loadPreline), { once: true })
  }

  nuxtApp.hook('page:finish', () => {
    prelineReady?.then(initPreline)
  })

  return {
    provide: {
      loadPreline
    }
  }
})
