export type PlainSession = {
  sub?: string
  uid?: string
  role?: string
  name?: string
  email?: string
  phone?: string
  waliPhone?: string
  waliName?: string
  santriId?: string
  santriName?: string
  allowedRoutes?: string[]
  iat?: number
  exp?: number
}

export function useAuthSession(clientName: string) {
  const AUTH_KEY = `${clientName}:auth`
  const PASSPHRASE = `${clientName}-admin-secret`
  const SALT = `${clientName}-static-salt`
  const ITER = 120_000

  async function deriveKey(pass: string, salt: string) {
    const enc = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(pass), { name: 'PBKDF2' }, false, ['deriveKey'])
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: enc.encode(salt), iterations: ITER, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    )
  }

  function fromB64(b64: string) {
    return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)).buffer
  }

  function isLikelyEncryptedToken(raw: string) {
    try {
      const o = JSON.parse(raw)
      return !!(o && typeof o === 'object' && o.iv && o.ct)
    } catch {
      return false
    }
  }

  async function decryptJSON(serialized: string) {
    const obj = JSON.parse(serialized)
    const key = await deriveKey(PASSPHRASE, SALT)
    const iv = new Uint8Array(fromB64(obj.iv))
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, fromB64(obj.ct))
    return JSON.parse(new TextDecoder().decode(plain))
  }

  async function readAuthToken(): Promise<PlainSession | null> {
    const raw = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY)
    if (!raw) return null
    try {
      if (isLikelyEncryptedToken(raw)) {
        return (await decryptJSON(raw)) as PlainSession
      }
      return JSON.parse(raw) as PlainSession
    } catch {
      return null
    }
  }

  return { readAuthToken }
}