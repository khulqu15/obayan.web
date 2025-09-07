// composables/data/useWeb.ts
// Lightweight CMS for site pages (meta + ordered sections) using Firebase RTDB + Storage.
// Data shape:
// alberr/web/pages/{pathKey}/meta
// alberr/web/pages/{pathKey}/sections/{sectionId}
// alberr/web/pages/{pathKey}/sectionsOrder: string[]
//
// Recommended RTDB rules (add indexes):
// {
//   "rules": {
//     ".read": true,
//     ".write": true,
//     "alberr": {
//       "web": {
//         "pages": {
//           ".indexOn": ["meta/path", "meta/title"]
//         }
//       }
//     }
//   }
// }
// Storage rules (dev): allow read, write: if true;

import { ref, computed, onUnmounted } from 'vue'
import { useNuxtApp } from '#app'
import {
  ref as dref,
  query as dquery,
  orderByChild,
  onValue,
  off,
  push,
  set,
  update,
  remove,
  serverTimestamp,
  get
} from 'firebase/database'
import {
  ref as sref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'

/* =======================
 * Types
 * ======================= */

export type WebStatus = 'draft' | 'published'

export type WebPageMeta = {
  path: string
  pathKey: string
  title: string
  description?: string
  ogImage?: string | null
  ogImagePath?: string | null
  status?: WebStatus
  createdAt?: number | { '.sv': 'timestamp' }
  updatedAt?: number | { '.sv': 'timestamp' }
}

export type WebSection = {
  id: string
  key: string                 // component name e.g., "HeaderHero" / "HeroHeaderHero"
  enabled: boolean
  order: number               // numeric fallback order
  props?: Record<string, any> | null
  createdAt?: number | { '.sv': 'timestamp' }
  updatedAt?: number | { '.sv': 'timestamp' }
}

export type WebPage = {
  meta: WebPageMeta | null
  sections: WebSection[]
  sectionsOrder: string[]     // first-class order source
}

/* =======================
 * Helpers
 * ======================= */

function normalizePath(p?: string) {
  let v = (p || '/').trim()
  if (!v.startsWith('/')) v = '/' + v
  // collapse multiple slashes
  v = v.replace(/\/+/g, '/')
  // keep root "/" or remove trailing slash
  if (v !== '/' && v.endsWith('/')) v = v.slice(0, -1)
  return v
}

export function pathToKey(path: string) {
  const p = normalizePath(path)
  if (p === '/') return 'home'
  return p.replace(/^\//, '').replace(/\//g, '__')
}

export function keyToPath(key: string) {
  if (!key || key === 'home') return '/'
  return '/' + key.replace(/__+/g, '/')
}

export function safeJSON<T = any>(v: any, fallback: T): T {
  try {
    if (typeof v === 'string') return JSON.parse(v) as T
    if (typeof v === 'object' && v !== null) return v as T
    return fallback
  } catch {
    return fallback
  }
}

/* =======================
 * Composable
 * ======================= */

export function useWeb() {
  const nuxt = useNuxtApp() as any
  const { $realtimeDb, $storage } = nuxt
  const isClient = typeof window !== 'undefined'

  const loading = ref(false)
  const error = ref<unknown>(null)

  /* ===== List: pages ===== */

  const pages = ref<WebPageMeta[]>([])
  const listUnsub = ref<null | (() => void)>(null)

  function unbindPages() {
    if (listUnsub.value) {
      try { listUnsub.value() } catch {}
      listUnsub.value = null
    }
  }

  function subscribePages() {
    if (!isClient || !$realtimeDb) return
    unbindPages()
    const baseRef = dref($realtimeDb, 'alberr/web/pages')
    // order by meta/path for stable listing
    const qRef = dquery(baseRef, orderByChild('meta/path'))
    const handler = onValue(qRef, (snap) => {
      const arr: WebPageMeta[] = []
      snap.forEach((ch: any) => {
        const key = ch.key as string
        const node = ch.val() || {}
        const m = node.meta || {}
        // harden missing fields
        const pathKey = m.pathKey || key
        const path = m.path || keyToPath(pathKey)
        arr.push({
          path,
          pathKey,
          title: m.title || path,
          description: m.description || '',
          ogImage: m.ogImage ?? null,
          ogImagePath: m.ogImagePath ?? null,
          status: (m.status as WebStatus) || 'draft',
          createdAt: m.createdAt,
          updatedAt: m.updatedAt
        })
      })
      arr.sort((a, b) => (a.path || '').localeCompare(b.path || ''))
      pages.value = arr
    }, (e) => (error.value = e))
    listUnsub.value = () => off(qRef, 'value', handler as any)
  }

  /* ===== Detail: current page ===== */

  const currentPath = ref<string>('/')
  const currentKey = computed(() => pathToKey(currentPath.value))

  const meta = ref<WebPageMeta | null>(null)
  const sections = ref<WebSection[]>([])
  const sectionsOrder = ref<string[]>([])

  const detailUnsubs: Array<() => void> = []

  function unbindDetail() {
    while (detailUnsubs.length) {
      try { detailUnsubs.pop()?.() } catch {}
    }
    meta.value = null
    sections.value = []
    sectionsOrder.value = []
  }

  function setActivePath(p: string) {
    currentPath.value = normalizePath(p)
  }

  async function ensurePage(path: string, init?: Partial<WebPageMeta>) {
    const key = pathToKey(path)
    const mRef = dref($realtimeDb, `alberr/web/pages/${key}/meta`)
    const snap = await get(mRef)
    if (!snap.exists()) {
      const payload: WebPageMeta = {
        path: normalizePath(path),
        pathKey: key,
        title: init?.title || keyToPath(key),
        description: init?.description || '',
        ogImage: null,
        ogImagePath: null,
        status: (init?.status as WebStatus) || 'draft',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      await set(mRef, payload)
    }
    return key
  }

  async function subscribePage(path: string) {
    if (!isClient || !$realtimeDb) return
    unbindDetail()
    const normalized = normalizePath(path)
    currentPath.value = normalized
    const key = await ensurePage(normalized)

    // meta
    const mRef = dref($realtimeDb, `alberr/web/pages/${key}/meta`)
    const hM = onValue(mRef, (s) => {
      const v = s.val() || null
      meta.value = v
    })
    detailUnsubs.push(() => off(mRef, 'value', hM as any))

    // sections
    const sRef = dref($realtimeDb, `alberr/web/pages/${key}/sections`)
    const hS = onValue(sRef, (s) => {
      const arr: WebSection[] = []
      s.forEach((ch: any) => {
        const v = ch.val() || {}
        arr.push({
          id: ch.key as string,
          key: v.key,
          enabled: v.enabled !== false,
          order: Number(v.order) || 0,
          props: v.props || null,
          createdAt: v.createdAt,
          updatedAt: v.updatedAt
        })
      })
      sections.value = arr
    })
    detailUnsubs.push(() => off(sRef, 'value', hS as any))

    // sectionsOrder
    const oRef = dref($realtimeDb, `alberr/web/pages/${key}/sectionsOrder`)
    const hO = onValue(oRef, (s) => {
      const val = s.val()
      sectionsOrder.value = Array.isArray(val) ? (val as string[]) : []
    })
    detailUnsubs.push(() => off(oRef, 'value', hO as any))
  }

  const sortedSections = computed(() => {
    const order = sectionsOrder.value
    const map = new Map(sections.value.map(s => [s.id, s]))
    if (!order?.length) {
      return sections.value
        .slice()
        .sort((a, b) => a.order - b.order || a.key.localeCompare(b.key))
    }
    const arranged: WebSection[] = []
    for (const id of order) {
      const s = map.get(id)
      if (s) arranged.push(s)
    }
    // include new sections not yet in order
    for (const s of sections.value) {
      if (!order.includes(s.id)) arranged.push(s)
    }
    return arranged
  })

  const enabledSections = computed(() => sortedSections.value.filter(s => s.enabled))

  /* ===== Meta ops ===== */

  async function upsertMeta(patch: Partial<WebPageMeta>) {
    const key = currentKey.value
    const node = dref($realtimeDb, `alberr/web/pages/${key}/meta`)
    const data: any = { updatedAt: serverTimestamp() }
    if (patch.title !== undefined) data.title = patch.title
    if (patch.description !== undefined) data.description = patch.description
    if (patch.status !== undefined) data.status = patch.status
    if (patch.ogImage !== undefined) data.ogImage = patch.ogImage
    if (patch.ogImagePath !== undefined) data.ogImagePath = patch.ogImagePath
    // keep path/pathKey consistent
    if (patch.path !== undefined) {
      data.path = normalizePath(patch.path)
      data.pathKey = pathToKey(data.path)
    }
    await update(node, data)
  }

  async function uploadOgImage(file: File) {
    if (!isClient || !$storage) return { url: '', path: '' }
    const key = currentKey.value
    const ext = (file.name?.split('.').pop() || 'jpg').toLowerCase()
    const path = `alberr/web/media/${key}/og_${Date.now()}.${ext}`
    const sr = sref($storage, path)
    const snap = await uploadBytes(sr, file, { contentType: file.type || 'image/jpeg' })
    const url = await getDownloadURL(sref($storage, snap.metadata.fullPath))
    return { url, path: snap.metadata.fullPath }
  }

  async function deleteOgImage(path?: string | null) {
    if (!isClient || !$storage || !path) return
    try { await deleteObject(sref($storage, path)) } catch {}
  }

  /* ===== Sections ops ===== */

  async function addSection(input: { key: string; props?: any; enabled?: boolean; index?: number }) {
    const key = currentKey.value
    const base = dref($realtimeDb, `alberr/web/pages/${key}/sections`)
    const node = push(base)
    const id = node.key as string
    const nextOrder = sections.value.length ? Math.max(...sections.value.map(s => s.order)) + 1 : 1

    await set(node, {
      key: input.key,
      enabled: input.enabled ?? true,
      order: nextOrder,
      props: input.props ?? null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    // maintain order array
    const orderArr = sectionsOrder.value.slice()
    const idx = typeof input.index === 'number' ? Math.max(0, Math.min(input.index, orderArr.length)) : orderArr.length
    orderArr.splice(idx, 0, id)
    await set(dref($realtimeDb, `alberr/web/pages/${key}/sectionsOrder`), orderArr)
    return id
  }

  async function updateSection(
    id: string,
    patch: { key?: string; enabled?: boolean; props?: any },
    pathOverride?: string
  ) {
    const targetKey = pathOverride ? pathToKey(normalizePath(pathOverride)) : currentKey.value
    const node = dref($realtimeDb, `alberr/web/pages/${targetKey}/sections/${id}`)
    const data: any = { updatedAt: serverTimestamp() }
    if (patch.key !== undefined) data.key = patch.key
    if (patch.enabled !== undefined) data.enabled = !!patch.enabled
    if (patch.props !== undefined) data.props = patch.props ?? null
    await update(node, data)
  }

  async function setSectionEnabled(id: string, enabled: boolean) {
    await updateSection(id, { enabled })
  }

  async function duplicateSection(id: string) {
    const src = sections.value.find(s => s.id === id)
    if (!src) return null
    const cloneProps = src.props ? JSON.parse(JSON.stringify(src.props)) : null
    const insertAfter = sectionsOrder.value.length
      ? Math.max(0, sectionsOrder.value.indexOf(id) + 1)
      : sortedSections.value.findIndex(s => s.id === id) + 1
    const newId = await addSection({
      key: src.key,
      props: cloneProps,
      enabled: src.enabled,
      index: insertAfter
    })
    return newId
  }

  async function deleteSection(id: string) {
    const key = currentKey.value
    await remove(dref($realtimeDb, `alberr/web/pages/${key}/sections/${id}`))
    const orderArr = sectionsOrder.value.slice().filter(x => x !== id)
    await set(dref($realtimeDb, `alberr/web/pages/${key}/sectionsOrder`), orderArr)
  }

  async function reorderSections(newOrder: string[]) {
    const key = currentKey.value
    const clean = newOrder.filter(Boolean)
    await set(dref($realtimeDb, `alberr/web/pages/${key}/sectionsOrder`), clean)

    // optional: sync numeric order (nice for fallback/queries)
    const updates: Record<string, any> = {}
    clean.forEach((id, i) => {
      updates[`alberr/web/pages/${key}/sections/${id}/order`] = i + 1
      updates[`alberr/web/pages/${key}/sections/${id}/updatedAt`] = serverTimestamp()
    })
    if (Object.keys(updates).length) {
      await update(dref($realtimeDb), updates)
    }
  }

  async function moveSection(id: string, dir: 'up' | 'down') {
    // ensure we have a concrete order array
    let order = sectionsOrder.value.slice()
    if (!order.length) {
      order = sortedSections.value.map(s => s.id)
    }
    const idx = order.indexOf(id)
    if (idx < 0) return
    const ni = dir === 'up' ? Math.max(0, idx - 1) : Math.min(order.length - 1, idx + 1)
    if (ni === idx) return
    const [moved] = order.splice(idx, 1)
    order.splice(ni, 0, moved!)
    await reorderSections(order)
  }

  async function uploadMedia(
    file: File,
    opts?: { folder?: string; pathOverride?: string; filenamePrefix?: string }
  ) {
    if (!isClient || !$storage) return { url: '', path: '' }
    const key = opts?.pathOverride ? pathToKey(normalizePath(opts.pathOverride)) : currentKey.value
    const ext = (file.name?.split('.').pop() || 'bin').toLowerCase()
    const stamp = Date.now()
    const prefix = (opts?.filenamePrefix || '').replace(/[^a-z0-9_-]/gi, '')
    const fname = `${prefix ? prefix + '_' : ''}${stamp}.${ext}`
    const folder = (opts?.folder ?? 'media').replace(/^\/+|\/+$/g, '')
    const path = folder
      ? `alberr/web/${folder}/${key}/${fname}`
      : `alberr/web/${key}/${fname}`

    const sr = sref($storage, path)
    const snap = await uploadBytes(sr, file, { contentType: file.type || 'application/octet-stream' })
    const url = await getDownloadURL(sref($storage, snap.metadata.fullPath))
    return { url, path: snap.metadata.fullPath }
  }

  async function deleteMedia(path?: string | null) {
    if (!isClient || !$storage || !path) return
    try { await deleteObject(sref($storage, path)) } catch {}
  }

  async function createPage(input: { path: string; title?: string; description?: string; status?: WebStatus }) {
    const normalized = normalizePath(input.path)
    const key = await ensurePage(normalized, input)
    return key
  }

  async function deletePage(path: string) {
    const key = pathToKey(path)
    await remove(dref($realtimeDb, `alberr/web/pages/${key}`))
  }

  async function renamePage(oldPath: string, newPath: string) {
    const oldP = normalizePath(oldPath)
    const newP = normalizePath(newPath)
    if (oldP === newP) return
    const oldKey = pathToKey(oldP)
    const newKey = pathToKey(newP)

    const srcRef = dref($realtimeDb, `alberr/web/pages/${oldKey}`)
    const snap = await get(srcRef)
    if (!snap.exists()) return
    const data = snap.val()

    // write new with patched meta
    await set(dref($realtimeDb, `alberr/web/pages/${newKey}`), {
      ...data,
      meta: {
        ...(data?.meta || {}),
        path: newP,
        pathKey: newKey,
        updatedAt: serverTimestamp()
      }
    })

    // remove old
    await remove(srcRef)
  }

  async function clonePage(srcPath: string, dstPath: string) {
    const srcP = normalizePath(srcPath)
    const dstP = normalizePath(dstPath)
    const srcKey = pathToKey(srcP)
    const dstKey = pathToKey(dstP)
    if (srcKey === dstKey) return

    const srcRef = dref($realtimeDb, `alberr/web/pages/${srcKey}`)
    const snap = await get(srcRef)
    if (!snap.exists()) return

    const data = snap.val()
    const cloned = {
      meta: {
        ...(data?.meta || {}),
        path: dstP,
        pathKey: dstKey,
        status: 'draft',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      sections: data?.sections || null,
      sectionsOrder: data?.sectionsOrder || null
    }
    await set(dref($realtimeDb, `alberr/web/pages/${dstKey}`), cloned)
  }

  async function getPageSnapshot(path: string): Promise<WebPage> {
    const key = pathToKey(path)
    const base = dref($realtimeDb, `alberr/web/pages/${key}`)
    const snap = await get(base)
    const node = snap.val() || {}
    const meta: WebPageMeta | null = node.meta || null
    const sectionsObj = node.sections || {}
    const sections: WebSection[] = Object.keys(sectionsObj).map((id) => ({
      id,
      key: sectionsObj[id]?.key,
      enabled: sectionsObj[id]?.enabled !== false,
      order: Number(sectionsObj[id]?.order) || 0,
      props: sectionsObj[id]?.props || null,
      createdAt: sectionsObj[id]?.createdAt,
      updatedAt: sectionsObj[id]?.updatedAt
    }))
    const sectionsOrder: string[] = Array.isArray(node.sectionsOrder) ? node.sectionsOrder : []
    return { meta, sections, sectionsOrder }
  }

  async function publishPage(path?: string) {
    const p = normalizePath(path || currentPath.value)
    const key = pathToKey(p)
    await update(dref($realtimeDb, `alberr/web/pages/${key}/meta`), {
      status: 'published',
      updatedAt: serverTimestamp()
    })
  }

  onUnmounted(() => {
    unbindPages()
    unbindDetail()
  })

  return {
    loading, error,
    pages, subscribePages, unbindPages,
    currentPath, currentKey, meta, sections, sectionsOrder,
    sortedSections, enabledSections,
    subscribePage, unbindDetail,
    upsertMeta, uploadOgImage, deleteOgImage,
    addSection, updateSection, setSectionEnabled,
    duplicateSection, deleteSection, reorderSections, moveSection: moveSection,
    uploadMedia, deleteMedia,
    createPage, deletePage, renamePage, clonePage,
    getPageSnapshot, publishPage,
    normalizePath, pathToKey, keyToPath, safeJSON,
    setActivePath
  }
}
