// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/app')) return

  const authLoading = useState<boolean>('authLoading', () => true)
  const authChecked = useState<boolean>('authChecked', () => false)
  const isAuthed    = useState<boolean>('isAuthed', () => false)
  const sessionUser = useState<any>('sessionUser', () => null)

  // ===== ACL utils (HOISTED) =====
  function normalize(p: string): string {
    try {
      const u = new URL(p, 'http://x')
      const path = u.pathname.replace(/\/+$/, '')
      return path === '' ? '/' : path
    } catch {
      const path = (p || '').replace(/\/+$/, '')
      return path || '/'
    }
  }
  function isPathAllowed(path: string, allowed: string[] = []): boolean {
    const a = normalize(path)
    return allowed.some((b) => {
      const r = normalize(b)
      if (r === '/app') return a === r || a.startsWith('/app')
      return a === r || a.startsWith(r + '/')
    })
  }
  function bestAllowed(allowed?: string[]): string {
    const list = Array.isArray(allowed) && allowed.length ? allowed : ['/app']
    return list[0] || '/app'
  }

  if (process.server) {
    authLoading.value = true
    return
  }

  // Sudah pernah cek & sudah punya session di state
  if (authChecked.value && isAuthed.value && sessionUser.value) {
    const ok = isPathAllowed(to.path, sessionUser.value?.allowedRoutes || [])
    if (!ok) return navigateTo(bestAllowed(sessionUser.value?.allowedRoutes))
    authLoading.value = false
    return
  }

  authLoading.value = true

  // ===== Crypto utils =====
  const AUTH_KEY   = 'alberr:auth'
  const PASSPHRASE = 'alberr-admin-secret'
  const SALT       = 'alberr-static-salt'
  const ITER       = 120_000

  function fromB64(b64: string) {
    return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)).buffer
  }
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
  async function decryptJSON(serialized: string) {
    const obj = JSON.parse(serialized)
    const key = await deriveKey(PASSPHRASE, SALT)
    const iv  = new Uint8Array(fromB64(obj.iv))
    const pt  = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, fromB64(obj.ct))
    return JSON.parse(new TextDecoder().decode(pt))
  }

  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) throw new Error('no token')

    const data = await decryptJSON(raw)
    const now  = Math.floor(Date.now() / 1000)
    if (!data?.exp || now >= data.exp) throw new Error('expired')

    sessionUser.value = data
    isAuthed.value = true

    // Scope check pada rute yang dituju
    const ok = isPathAllowed(to.path, Array.isArray(data.allowedRoutes) ? data.allowedRoutes : [])
    if (!ok) return navigateTo(bestAllowed(data.allowedRoutes))
  } catch {
    isAuthed.value = false
    sessionUser.value = null
    authChecked.value = true
    authLoading.value = false
    if (to.path !== '/cakAdmin') return navigateTo('/cakAdmin')
    return
  } finally {
    authChecked.value = true
    authLoading.value = false
  }
})
