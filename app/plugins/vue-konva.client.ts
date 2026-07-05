import { defineNuxtPlugin, useRoute } from 'nuxt/app'

let installPromise: Promise<void> | null = null
let installed = false

function routeNeedsKonva(path: string) {
  return path === '/app/editor' || path.startsWith('/app/editor/')
}

async function installVueKonva(nuxtApp: any) {
  if (installed) return

  installPromise ||= import('vue-konva').then(({ default: VueKonva }) => {
    if (installed) return

    nuxtApp.vueApp.use(VueKonva)
    installed = true
  })

  await installPromise
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const route = useRoute()

  if (routeNeedsKonva(route.path)) {
    await installVueKonva(nuxtApp)
  }

  nuxtApp.hook('app:router:beforeEach', async (to) => {
    if (!routeNeedsKonva(to.path)) return

    await installVueKonva(nuxtApp)
  })
})
