// composables/data/useClass.ts
import { ref, computed, onUnmounted } from 'vue'
import { useNuxtApp } from '#app'
import {
  ref as dref,
  query as dquery,
  orderByChild,
  equalTo,
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

/** ===== Types ===== */
export type ClassCategory = 'putra' | 'putri' | 'campuran'

export type ClassItem = {
  id: string
  title: string
  level?: string         // contoh: "1 SMP A"
  section?: string       // subbagian/label bebas
  category: ClassCategory
  room?: string
  color?: string
  code?: string
  coverUrl?: string
  coverPath?: string
  archived?: boolean
  createdAt?: number | { '.sv': 'timestamp' }
  updatedAt?: number | { '.sv': 'timestamp' }
}

export type CreateClassPayload = Omit<
  ClassItem,
  'id' | 'coverUrl' | 'coverPath' | 'archived' | 'createdAt' | 'updatedAt'
> & { coverFile?: File | null }

export type UpdateClassPayload =
  Partial<CreateClassPayload> & { archived?: boolean; removeCover?: boolean }

export type TaskItem = {
  id: string
  title: string
  desc?: string
  dueAt?: number | null
  createdAt?: number
  updatedAt?: number
}

export type MaterialItem = {
  id: string
  title: string
  desc?: string
  fileUrl?: string | null
  filePath?: string | null
  createdAt?: number
  updatedAt?: number
}

export type PostItem = {
  id: string
  title: string
  content?: string
  createdAt?: number
  updatedAt?: number
}

/** ===== Helpers ===== */
function genJoinCode(len = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // tanpa 0,O,1,I
  let s = ''
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return s
}

export function useClass() {
  const nuxtApp = useNuxtApp() as any
  const { $realtimeDb, $storage } = nuxtApp
  const isClient = typeof window !== 'undefined'

  /** ===== List view state ===== */
  const rows = ref<ClassItem[]>([])
  const loading = ref(false)
  const error = ref<unknown>(null)

  const q = ref('')
  const selectedCategory = ref<ClassCategory | 'all'>('all')
  const showArchived = ref(false)

  const listUnsub = ref<null | (() => void)>(null)

  function unbindList() {
    if (listUnsub.value) {
      listUnsub.value()
      listUnsub.value = null
    }
  }

  function bindOnValue(qRef: any) {
    const handler = onValue(
      qRef,
      (snap) => {
        const list: ClassItem[] = []
        snap.forEach((ch: any) => {
          const id = ch.key as string
          const d = ch.val() || {}
          list.push({
            id,
            title: d.title,
            level: d.level,
            section: d.section,
            category: d.category,
            room: d.room,
            color: d.color,
            code: d.code,
            coverUrl: d.coverUrl,
            coverPath: d.coverPath,
            archived: !!d.archived,
            createdAt: d.createdAt,
            updatedAt: d.updatedAt
          })
        })
        // urut: non-arsip dulu, lalu title
        list.sort(
          (a, b) =>
            (Number(!!a.archived) - Number(!!b.archived)) ||
            (a.title || '').localeCompare(b.title || '')
        )
        rows.value = list
      },
      (e) => (error.value = e)
    )
    return () => off(qRef, 'value', handler as any)
  }

  /** Subscribe semua kelas untuk grid list */
  function subscribeAll() {
    if (!isClient || !$realtimeDb) return
    unbindList()
    const baseRef = dref($realtimeDb, 'alberr/classes')
    const qRef = dquery(baseRef, orderByChild('title'))
    listUnsub.value = bindOnValue(qRef)
  }

  /** Filter untuk grid list (kategori/arsip/search) */
  const filtered = computed(() => {
    let list = rows.value.slice()
    if (selectedCategory.value !== 'all') {
      list = list.filter((x) => x.category === selectedCategory.value)
    }
    if (!showArchived.value) list = list.filter((x) => !x.archived)
    if (q.value.trim()) {
      const s = q.value.toLowerCase()
      list = list.filter(
        (x) =>
          (x.title || '').toLowerCase().includes(s) ||
          (x.level || '').toLowerCase().includes(s) ||
          (x.section || '').toLowerCase().includes(s) ||
          (x.room || '').toLowerCase().includes(s) ||
          (x.code || '').toLowerCase().includes(s)
      )
    }
    return list
  })

  /** ===== Storage helpers (cover & materi file) ===== */
  async function uploadCover(id: string, file: File) {
    if (!isClient || !$storage || !file) return { url: '', path: '' }
    const ext = file.name?.split('.').pop() || 'jpg'
    const path = `alberr/classes/${id}/cover_${Date.now()}.${ext}`
    const s = sref($storage, path)
    const snap = await uploadBytes(s, file, { contentType: file.type || 'image/jpeg' })
    const url = await getDownloadURL(sref($storage, snap.metadata.fullPath))
    return { url, path: snap.metadata.fullPath }
  }
  async function deleteCover(path?: string) {
    if (!isClient || !$storage || !path) return
    try {
      await deleteObject(sref($storage, path))
    } catch {}
  }

  async function uploadMaterialFile(cid: string, f: File) {
    const ext = f.name?.split('.').pop() || 'bin'
    const path = `alberr/classMaterials/${cid}/${Date.now()}.${ext}`
    const s = sref($storage, path)
    const snap = await uploadBytes(s, f, { contentType: f.type || 'application/octet-stream' })
    const url = await getDownloadURL(sref($storage, snap.metadata.fullPath))
    return { url, path: snap.metadata.fullPath }
  }
  async function deleteMaterialFile(path?: string) {
    if (!isClient || !$storage || !path) return
    try {
      await deleteObject(sref($storage, path))
    } catch {}
  }

  async function isCodeTaken(code: string) {
    const baseRef = dref($realtimeDb, 'alberr/classes')
    const qRef = dquery(baseRef, orderByChild('code'), equalTo(code))
    const snap = await get(qRef)
    return snap.exists()
  }
  async function getUniqueCode(initial?: string) {
    let code = (initial || genJoinCode()).toUpperCase()
    // loop kecil untuk jaga-jaga
    // eslint-disable-next-line no-constant-condition
    while (await isCodeTaken(code)) code = genJoinCode()
    return code
  }

  async function createClass(payload: CreateClassPayload) {
    loading.value = true
    try {
      const baseRef = dref($realtimeDb, 'alberr/classes')
      const draftRef = push(baseRef)
      const id = draftRef.key as string

      const code = await getUniqueCode(payload.code)

      await set(draftRef, {
        title: payload.title?.trim() || 'Kelas Baru',
        level: payload.level || '',
        section: payload.section || '',
        category: (payload.category || 'campuran') as ClassCategory,
        room: payload.room || '',
        color: payload.color || '#2563eb',
        code,
        coverUrl: null,
        coverPath: null,
        archived: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      if (payload.coverFile) {
        const up = await uploadCover(id, payload.coverFile)
        if (up.url) {
          await update(draftRef, { coverUrl: up.url, coverPath: up.path, updatedAt: serverTimestamp() })
        }
      }
      return id
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateClass(id: string, patch: UpdateClassPayload) {
    loading.value = true
    try {
      const nodeRef = dref($realtimeDb, `alberr/classes/${id}`)
      let curr: any
      try { curr = (await get(nodeRef)).val() } catch {}

      const data: any = { updatedAt: serverTimestamp() }

      if (patch.title     !== undefined) data.title    = patch.title?.trim()
      if (patch.level     !== undefined) data.level    = patch.level
      if (patch.section   !== undefined) data.section  = patch.section
      if (patch.category  !== undefined) data.category = patch.category
      if (patch.room      !== undefined) data.room     = patch.room
      if (patch.color     !== undefined) data.color    = patch.color
      if (patch.code      !== undefined) {
        const candidate = (patch.code || '').toUpperCase()
        data.code = candidate ? await getUniqueCode(candidate) : await getUniqueCode()
      }
      if (patch.archived  !== undefined) data.archived = !!patch.archived

      if (patch.removeCover && !patch.coverFile) {
        if (curr?.coverPath) await deleteCover(curr.coverPath)
        data.coverUrl = null
        data.coverPath = null
      }

      if (patch.coverFile) {
        if (curr?.coverPath) await deleteCover(curr.coverPath)
        const up = await uploadCover(id, patch.coverFile)
        if (up.url) {
          data.coverUrl = up.url
          data.coverPath = up.path
        }
      }

      await update(nodeRef, data)
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteClass(id: string) {
    loading.value = true
    try {
      const nodeRef = dref($realtimeDb, `alberr/classes/${id}`)
      let curr: any
      try {
        curr = (await get(nodeRef)).val()
      } catch {}
      if (curr?.coverPath) await deleteCover(curr.coverPath)
      await remove(nodeRef)
      await remove(dref($realtimeDb, `alberr/classTasks/${id}`))
      await remove(dref($realtimeDb, `alberr/classMaterials/${id}`))
      await remove(dref($realtimeDb, `alberr/classForum/${id}`))
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  async function archiveClass(id: string, archived = true) {
    await updateClass(id, { archived })
  }

  const currentCode = ref<string | null>(null)
  const currentId = ref<string | null>(null)
  const klass = ref<ClassItem | null>(null)

  const tasks = ref<TaskItem[]>([])
  const materials = ref<MaterialItem[]>([])
  const posts = ref<PostItem[]>([])

  const detailUnsubs: Array<() => void> = []

  function unbindDetail() {
    while (detailUnsubs.length) {
      const fn = detailUnsubs.pop()
      try { fn && fn() } catch {}
    }
    klass.value = null
    tasks.value = []
    materials.value = []
    posts.value = []
    currentId.value = null
  }

  async function subscribeByCode(kode: string) {
    if (!isClient || !$realtimeDb) return
    currentCode.value = (kode || '').toUpperCase()
    unbindDetail()

    const baseRef = dref($realtimeDb, 'alberr/classes')
    const qRef = dquery(baseRef, orderByChild('code'), equalTo(currentCode.value))
    const snap = await get(qRef)

    let firstId: string | null = null
    snap.forEach((ch: any) => {
      if (!firstId) firstId = ch.key as string
    })

    if (!firstId) {
      return
    }

    currentId.value = firstId

    const kRef = dref($realtimeDb, `alberr/classes/${firstId}`)
    const hK = onValue(kRef, (s) => {
      const d = s.val() || null
      klass.value = d
    })
    detailUnsubs.push(() => off(kRef, 'value', hK as any))

    const tRef = dref($realtimeDb, `alberr/classTasks/${firstId}`)
    const hT = onValue(tRef, (s) => {
      const arr: TaskItem[] = []
      s.forEach((ch: any) => arr.push({ id: ch.key, ...(ch.val() || {}) }))
      tasks.value = arr.sort((a, b) => (a.dueAt || 0) - (b.dueAt || 0))
    })
    detailUnsubs.push(() => off(tRef, 'value', hT as any))

    const mRef = dref($realtimeDb, `alberr/classMaterials/${firstId}`)
    const hM = onValue(mRef, (s) => {
      const arr: MaterialItem[] = []
      s.forEach((ch: any) => arr.push({ id: ch.key, ...(ch.val() || {}) }))
      materials.value = arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    })
    detailUnsubs.push(() => off(mRef, 'value', hM as any))

    const pRef = dref($realtimeDb, `alberr/classForum/${firstId}`)
    const hP = onValue(pRef, (s) => {
      const arr: PostItem[] = []
      s.forEach((ch: any) => arr.push({ id: ch.key, ...(ch.val() || {}) }))
      posts.value = arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    })
    detailUnsubs.push(() => off(pRef, 'value', hP as any))
  }

  const latestFeed = computed(() => {
    const feed = [
      ...tasks.value.map((t) => ({
        type: 'Tugas',
        title: t.title,
        desc: t.desc,
        createdAt: t.createdAt,
        key: 't-' + t.id
      })),
      ...materials.value.map((m) => ({
        type: 'Materi',
        title: m.title,
        desc: m.desc,
        createdAt: m.createdAt,
        key: 'm-' + m.id
      })),
      ...posts.value.map((p) => ({
        type: 'Forum',
        title: p.title,
        desc: p.content,
        createdAt: p.createdAt,
        key: 'p-' + p.id
      }))
    ]
    return feed.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 20)
  })

  async function createTask(input: { title: string; desc?: string; due?: string | null }) {
    if (!currentId.value) return
    const base = dref($realtimeDb, `alberr/classTasks/${currentId.value}`)
    const node = push(base)
    await set(node, {
      title: input.title,
      desc: input.desc || '',
      dueAt: input.due ? new Date(input.due).getTime() : null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  }
  async function updateTask(taskId: string, input: { title?: string; desc?: string; due?: string | null }) {
    if (!currentId.value) return
    const node = dref($realtimeDb, `alberr/classTasks/${currentId.value}/${taskId}`)
    const patch: any = { updatedAt: serverTimestamp() }
    if (input.title !== undefined) patch.title = input.title
    if (input.desc !== undefined) patch.desc = input.desc || ''
    if (input.due !== undefined) patch.dueAt = input.due ? new Date(input.due).getTime() : null
    await update(node, patch)
  }
  async function deleteTask(taskId: string) {
    if (!currentId.value) return
    await remove(dref($realtimeDb, `alberr/classTasks/${currentId.value}/${taskId}`))
  }

  async function createMaterial(input: { title: string; desc?: string; file?: File | null }) {
    if (!currentId.value) return
    const base = dref($realtimeDb, `alberr/classMaterials/${currentId.value}`)
    const node = push(base)
    let fileUrl: string | null = null
    let filePath: string | null = null
    if (input.file) {
      const up = await uploadMaterialFile(currentId.value, input.file)
      fileUrl = up.url
      filePath = up.path
    }
    await set(node, {
      title: input.title,
      desc: input.desc || '',
      fileUrl,
      filePath,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  }
  async function updateMaterial(materialId: string, input: { title?: string; desc?: string; file?: File | null }) {
    if (!currentId.value) return
    const node = dref($realtimeDb, `alberr/classMaterials/${currentId.value}/${materialId}`)
    const patch: any = { updatedAt: serverTimestamp() }

    if (input.title !== undefined) patch.title = input.title
    if (input.desc !== undefined) patch.desc = input.desc || ''

    if (input.file) {
      let curr: any
      try {
        curr = (await get(node)).val()
      } catch {}
      if (curr?.filePath) await deleteMaterialFile(curr.filePath)
      const up = await uploadMaterialFile(currentId.value, input.file)
      patch.fileUrl = up.url
      patch.filePath = up.path
    }

    await update(node, patch)
  }
  async function deleteMaterial(materialId: string) {
    if (!currentId.value) return
    const node = dref($realtimeDb, `alberr/classMaterials/${currentId.value}/${materialId}`)
    let curr: any
    try {
      curr = (await get(node)).val()
    } catch {}
    if (curr?.filePath) await deleteMaterialFile(curr.filePath)
    await remove(node)
  }

  async function createPost(input: { title: string; content?: string }) {
    if (!currentId.value) return
    const base = dref($realtimeDb, `alberr/classForum/${currentId.value}`)
    const node = push(base)
    await set(node, {
      title: input.title,
      content: input.content || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  }
  async function updatePost(postId: string, input: { title?: string; content?: string }) {
    if (!currentId.value) return
    const node = dref($realtimeDb, `alberr/classForum/${currentId.value}/${postId}`)
    const patch: any = { updatedAt: serverTimestamp() }
    if (input.title !== undefined) patch.title = input.title
    if (input.content !== undefined) patch.content = input.content || ''
    await update(node, patch)
  }
  async function deletePost(postId: string) {
    if (!currentId.value) return
    await remove(dref($realtimeDb, `alberr/classForum/${currentId.value}/${postId}`))
  }

  onUnmounted(() => {
    unbindList()
    unbindDetail()
  })

  return {
    rows,
    filtered,
    q,
    selectedCategory,
    showArchived,
    loading,
    error,
    subscribeAll,
    createClass,
    updateClass,
    deleteClass,
    archiveClass,

    currentCode,
    currentId,
    klass,
    tasks,
    materials,
    posts,
    latestFeed,
    subscribeByCode,
    unbindDetail,

    createTask,
    updateTask,
    deleteTask,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    createPost,
    updatePost,
    deletePost
  }
}
