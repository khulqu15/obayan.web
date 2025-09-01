import { ref as vRef } from 'vue'
import { child, get, ref as dbRef, set, update } from 'firebase/database'
import type { User } from 'firebase/auth'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, fetchSignInMethodsForEmail, updateProfile } from 'firebase/auth'

export type SantriBrief = {
  id: string
  status: string
  jenjang: string
  gen: string
  name: string
  kamar: string
  maskan: string
}

export type WaliRow = {
  id: string
  waliname: string
  nohp: string
  alamat: string
  santri: SantriBrief[]
}

export type SantriItem = {
  id: string
  nama: string
  jenjang: string
  alamat: string
  kamar?: string
  maskan?: string
  gen?: string
}


export type WaliProfile = {
  uid: string
  phone?: string
  email?: string
  waliname?: string
  nohp?: string
  alamat?: string
  santriIds: string[]
  createdAt: number
}

function normalizeName(name?: string): string {
  if (!name) return ''
  return name
    .normalize('NFKC')
    .replace(/\s+/g, ' ')
    .replace(/[^\p{L}\p{N}\s'.-]/gu, '')
    .trim()
    .toLowerCase()
}

function pickFirstNonEmpty(...vals: (string | number | undefined | null)[]): string {
  for (const v of vals) {
    if (v !== undefined && v !== null) {
      const s = String(v).trim()
      if (s !== '') return s
    }
  }
  return ''
}

function phoneToEmail(phone: string) {
  const digits = phone.replace(/[^0-9]/g, '').replace(/^0/, '62')
  return `${digits}-wali@alberr.sch.id`
}

function generatePassword(len = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*'
  let out = ''
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}


export const useWali = () => {
  const loading = vRef(false)
  const error = vRef<string | null>(null)
  const rows = vRef<WaliRow[]>([])
  const currentUser = vRef<User | null>(null)
  const suggestedSantri = vRef<SantriItem[]>([])
  const chosenSantri = vRef<SantriItem | null>(null)
  const activationPassword = vRef<string>('')

  const { $realtimeDb, auth } = useNuxtApp() as any

  async function fetchWali() {
    loading.value = true
    error.value = null
    try {
      const { $realtimeDb } = useNuxtApp()
      const snapshot = await get(child(dbRef($realtimeDb), 'alberr/santri'))
      const val = snapshot.val() || {}

      const map = new Map<string, WaliRow>()

      for (const [_, raw]: [string, any] of Object.entries(val)) {
        const walinameRaw =
          raw.walisantri ?? raw.wali ?? raw.ortu ?? ''
        const waliname = String(walinameRaw || '').trim()
        const key = normalizeName(waliname) || '__unknown__'

        const nohp = pickFirstNonEmpty(
          raw.nohp, raw.no_wa, raw.whatsapp
        )
        const alamat = pickFirstNonEmpty(
          raw.alamat
        )

        const brief: SantriBrief = {
            id: String(_ /* atau key, tergantung variabel destructuring kamu */), // <--- PENTING: isi id santri
            status: String(raw.status ?? '').trim(),
            jenjang: String(raw.jenjang ?? raw.jenjang_pendidikan ?? raw.kelas ?? '').trim(),
            gen: String(raw.gen ?? '').trim(),
            name: String(raw.santri ?? raw.nama ?? '').trim(),
            kamar: String(raw.kamar ?? raw.asrama ?? '').trim(),
            maskan: String(raw.maskan ?? '').trim(),
        }

        if (!map.has(key)) {
          map.set(key, {
            id: key,
            waliname: waliname || 'Tidak diketahui',
            nohp: String(nohp),
            alamat: String(alamat),
            santri: [brief],
          })
        } else {
          const existing = map.get(key)!
          if (!existing.nohp && nohp) existing.nohp = String(nohp)
          if (!existing.alamat && alamat) existing.alamat = String(alamat)

          const sig = (s: SantriBrief) =>
            `${s.name.toLowerCase()}|${s.gen.toLowerCase()}|${s.kamar.toLowerCase()}|${s.maskan.toLowerCase()}`
          const exists = new Set(existing.santri.map(sig))
          if (!exists.has(sig(brief))) existing.santri.push(brief)
        }
      }

      rows.value = Array.from(map.values()).sort((a, b) =>
        a.waliname.localeCompare(b.waliname, 'id')
      )
    } catch (e: any) {
      console.error(e)
      error.value = e?.message ?? 'Gagal memuat data wali'
    } finally {
      loading.value = false
    }
  }

  async function fetchAllSantri(): Promise<Record<string, any>> {
    const snap = await get(child(dbRef($realtimeDb), 'alberr/santri'))
    return snap.val() || {}
  }

  function normalize(s?: string) {
    return (s || '').normalize('NFKC').trim().toLowerCase()
  }

  async function searchSantri(term: string) {
    loading.value = true
    try {
      const all = await fetchAllSantri()
      const t = normalize(term)
      const rows: SantriItem[] = []
      for (const [id, raw] of Object.entries<any>(all)) {
        const nama = String(raw.santri ?? raw.nama ?? '').trim()
        const jenjang = String(raw.jenjang ?? raw.jenjang_pendidikan ?? raw.kelas ?? '').trim()
        const alamat = String(raw.alamat ?? '').trim()
        const kamar = String(raw.kamar ?? raw.asrama ?? '').trim()
        const maskan = String(raw.maskan ?? '').trim()
        const gen = String(raw.gen ?? '').trim()
        const sig = `${nama} ${jenjang} ${alamat}`.toLowerCase()
        if (!t || sig.includes(t)) rows.push({ id, nama, jenjang, alamat, kamar, maskan, gen })
      }
      suggestedSantri.value = rows.sort((a, b) => a.nama.localeCompare(b.nama, 'id'))
    } finally {
      loading.value = false
    }
  }

  async function guessSantriFromPhone(phone: string) {
    loading.value = true
    try {
      const all = await fetchAllSantri()
      const digits = phone.replace(/[^0-9]/g, '')
      const matches: SantriItem[] = []
      for (const [id, raw] of Object.entries<any>(all)) {
        const phones = [raw.nohp, raw.no_wa, raw.whatsapp, raw.wali_nohp, raw.wali_whatsapp].filter(Boolean).map((x: any) => String(x).replace(/[^0-9]/g, ''))
        if (phones.some((p: string) => p.endsWith(digits) || p.includes(digits))) {
          matches.push({
            id,
            nama: String(raw.santri ?? raw.nama ?? '').trim(),
            jenjang: String(raw.jenjang ?? raw.jenjang_pendidikan ?? raw.kelas ?? '').trim(),
            alamat: String(raw.alamat ?? '').trim(),
            kamar: String(raw.kamar ?? raw.asrama ?? '').trim(),
            maskan: String(raw.maskan ?? '').trim(),
            gen: String(raw.gen ?? '').trim()
          })
        }
      }
      suggestedSantri.value = matches.sort((a,b)=>a.nama.localeCompare(b.nama,'id'))
    } finally {
      loading.value = false
    }
  }

  async function loginWithPhonePassword(phone: string, password: string) {
    error.value = null
    loading.value = true
    try {
      const emailLike = phoneToEmail(phone)
      const userCred = await signInWithEmailAndPassword(auth, emailLike, password)
      currentUser.value = userCred.user
      return userCred.user
    } catch (e: any) {
      error.value = e?.message || 'Gagal masuk'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function loginWithEmail(email: string, password: string) {
    error.value = null
    loading.value = true
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password)
      currentUser.value = userCred.user
      return userCred.user
    } catch (e: any) {
      error.value = e?.message || 'Gagal masuk'
      throw e
    } finally {
      loading.value = false
    }
  }
  
  async function activateWali(opts: { phone?: string, email?: string, waliname: string, alamat?: string, santri: SantriItem, }) {
    const { phone, email, waliname, alamat, santri } = opts
    if (!santri?.id) throw new Error('Santri belum dipilih')
    loading.value = true
    error.value = null
    try {
      const createdPassword = generatePassword(12)
      activationPassword.value = createdPassword
      const authEmail = email?.trim() || phoneToEmail(phone || '')
      const methods = await fetchSignInMethodsForEmail(auth, authEmail)
      if (methods.length > 0) throw new Error('Akun sudah terdaftar. Silakan masuk.')
      const cred = await createUserWithEmailAndPassword(auth, authEmail, createdPassword)
      currentUser.value = cred.user
      const uid = cred.user.uid
      try { await updateProfile(cred.user, { displayName: waliname }) } catch {}
      const profile: WaliProfile = {
        uid,
        phone,
        email: email || undefined,
        waliname,
        nohp: phone,
        alamat,
        santriIds: [santri.id],
        createdAt: Date.now()
      }
      await set(dbRef($realtimeDb, `alberr/waliUsers/${uid}`), profile)
      await update(dbRef($realtimeDb, `alberr/santri/${santri.id}`), {
        wali_uid: uid,
        walisantri: waliname || undefined,
        wali_nohp: phone || undefined
      })
      chosenSantri.value = santri
      return { user: cred.user, password: createdPassword }
    } catch (e: any) {
      error.value = e?.message || 'Aktivasi gagal'
      throw e
    } finally {
      loading.value = false
    }
  }
  
  function downloadPasswordFile(phoneOrEmail: string, password: string) {
    const blob = new Blob([
      `Akun Wali Ponpes Alberr\n`+
      `=======================\n`+
      `Username : ${phoneOrEmail}\n`+
      `Password : ${password}\n`+
      `Tanggal : ${new Date().toLocaleString('id-ID')}\n`
    ], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'akun-wali.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return { rows, loading, error, fetchWali, downloadPasswordFile, suggestedSantri, chosenSantri, activationPassword, searchSantri, guessSantriFromPhone, loginWithPhonePassword, loginWithEmail, activateWali }
}
