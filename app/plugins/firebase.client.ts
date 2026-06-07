import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'
import { defineNuxtPlugin } from 'nuxt/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

export default defineNuxtPlugin(() => {
    const firebaseConfig = {
        apiKey: "AIzaSyBYoGN_ayC7GFWIeTSdKkh4vl022YYJEqw",
        authDomain: "hayago-42fbf.firebaseapp.com",
        databaseURL: "https://hayago-42fbf-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "hayago-42fbf",
        storageBucket: "hayago-42fbf.appspot.com",
        messagingSenderId: "806345285802",
        appId: "1:806345285802:web:872dc1e96765093dff30d3",
        measurementId: "G-S2ZSFSY0JQ"
    }

    const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

    const secondaryApp = getApps().find((item) => item.name === '__secondary__') || initializeApp(firebaseConfig, '__secondary__')

    const fdb = getFirestore(app)
    const rtdb = getDatabase(app)
    const auth = getAuth(app)
    const secondaryAuth = getAuth(secondaryApp)
    const storage = getStorage(app)

    auth.useDeviceLanguage()
    secondaryAuth.useDeviceLanguage()

    const googleProvider = new GoogleAuthProvider()

    return {
        provide: {
        firestoreDb: fdb,
        realtimeDb: rtdb,
        auth,
        secondaryAuth,
        googleProvider,
        storage
        }
    }
})