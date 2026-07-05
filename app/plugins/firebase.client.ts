import { defineNuxtPlugin, useRoute } from 'nuxt/app'

type FirebaseServices = {
  firestoreDb: unknown
  realtimeDb: unknown
  auth: unknown
  googleProvider: unknown
  storage: unknown
}

const firebaseConfig = {
  apiKey: 'AIzaSyBYoGN_ayC7GFWIeTSdKkh4vl022YYJEqw',
  authDomain: 'hayago-42fbf.firebaseapp.com',
  databaseURL: 'https://hayago-42fbf-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'hayago-42fbf',
  storageBucket: 'hayago-42fbf.appspot.com',
  messagingSenderId: '806345285802',
  appId: '1:806345285802:web:872dc1e96765093dff30d3',
  measurementId: 'G-S2ZSFSY0JQ'
}

let servicesPromise: Promise<FirebaseServices> | null = null

function routeNeedsFirebase(path: string) {
  return (
    path === '/app' ||
    path.startsWith('/app/') ||
    /^\/[^/]+\/(?:payment|setting)(?:\/|$)/.test(path)
  )
}

async function loadFirebaseServices() {
  servicesPromise ||= Promise.all([
    import('firebase/app'),
    import('firebase/firestore'),
    import('firebase/database'),
    import('firebase/auth'),
    import('firebase/storage')
  ]).then(([
    appModule,
    firestoreModule,
    databaseModule,
    authModule,
    storageModule
  ]) => {
    const app = appModule.getApps().length
      ? appModule.getApp()
      : appModule.initializeApp(firebaseConfig)

    const auth = authModule.getAuth(app)

    auth.useDeviceLanguage()

    return {
      firestoreDb: firestoreModule.getFirestore(app),
      realtimeDb: databaseModule.getDatabase(app),
      auth,
      googleProvider: new authModule.GoogleAuthProvider(),
      storage: storageModule.getStorage(app)
    }
  })

  return servicesPromise
}

function provideFirebase(nuxtApp: any, services: FirebaseServices) {
  if (!nuxtApp.$realtimeDb) nuxtApp.provide('realtimeDb', services.realtimeDb)
  if (!nuxtApp.$firestoreDb) nuxtApp.provide('firestoreDb', services.firestoreDb)
  if (!nuxtApp.$auth) nuxtApp.provide('auth', services.auth)
  if (!nuxtApp.$googleProvider) nuxtApp.provide('googleProvider', services.googleProvider)
  if (!nuxtApp.$storage) nuxtApp.provide('storage', services.storage)

  nuxtApp.auth ||= services.auth
  nuxtApp.googleProvider ||= services.googleProvider
}

async function ensureFirebase(nuxtApp: any, path: string) {
  if (!routeNeedsFirebase(path)) return

  const services = await loadFirebaseServices()
  provideFirebase(nuxtApp, services)
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const route = useRoute()

  await ensureFirebase(nuxtApp, route.path)

  nuxtApp.hook('app:router:beforeEach', async (to) => {
    await ensureFirebase(nuxtApp, to.path)
  })
})
