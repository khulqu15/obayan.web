// composables/data/useBook.ts
import { ref, computed } from 'vue'
import { useNuxtApp } from '#app'
import {
  ref as dbRef,
  onValue,
  off,
  push,
  set,
  update as rtdbUpdate,
  remove,
  DataSnapshot
} from 'firebase/database'
import {
  ref as sRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'

export const BOOK_CATEGORIES = ['Buku', 'Kitab', 'Modul', 'Lainnya'] as const
export type BookCategory = typeof BOOK_CATEGORIES[number]

export type BookItem = {
  id: string
  title: string
  author?: string
  category: BookCategory
  year?: number | null
  pages?: number | null
  tags?: string[]
  description?: string
  aktif?: boolean
  pdfUrl?: string | null
  pdfPath?: string | null
  coverUrl?: string | null
  coverPath?: string | null
  createdAt: number
  updatedAt: number
}

type CreatePayload = {
  title: string
  author?: string
  category: BookCategory
  year?: number | null
  pages?: number | null
  tags?: string[]
  description?: string
  aktif?: boolean
  pdfFile?: File
  coverFile?: File
}

type UpdatePayload = Partial<CreatePayload> & {
  removePdf?: boolean
  removeCover?: boolean
}

const BOOKS_NODE = 'obayan/library/books'

export function useBook() {
  const { $realtimeDb, $storage } = useNuxtApp()

  // ===== STATE =====
  const items = ref<BookItem[]>([])
  const loading = ref(false)
  const _off = ref<null | (() => void)>(null)

  // Filter/search
  const q = ref('')
  const fCategory = ref<BookCategory | 'all'>('all')
  const fAktif = ref<'all' | 'aktif' | 'nonaktif'>('all')

  const filtered = computed(() => {
    const qq = q.value.trim().toLowerCase()
    return items.value
      .filter((b) => (fCategory.value === 'all' ? true : b.category === fCategory.value))
      .filter((b) =>
        fAktif.value === 'all' ? true : (fAktif.value === 'aktif' ? (b.aktif ?? true) : (b.aktif === false))
      )
      .filter((b) => {
        if (!qq) return true
        const hay = [
          b.title,
          b.author,
          b.category,
          b.tags?.join(' ') ?? '',
          String(b.year ?? ''),
          String(b.pages ?? '')
        ]
          .join(' ')
          .toLowerCase()
        return hay.includes(qq)
      })
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
  })

  // ===== SUBSCRIBE LIST =====
  function subscribeAll() {
    if (!($realtimeDb)) return
    const node = dbRef($realtimeDb, BOOKS_NODE)
    loading.value = true
    const handler = onValue(
      node,
      (snap: DataSnapshot) => {
        const val = snap.val() || {}
        const out: BookItem[] = Object.keys(val).map((id) => ({ id, ...val[id] }))
        items.value = out
        loading.value = false
      },
      () => {
        loading.value = false
      }
    )
    _off.value = () => off(node, 'value', handler as any)
  }
  function unbindList() {
    if (_off.value) {
      try { _off.value() } catch {}
      _off.value = null
    }
  }

  // ===== HELPERS =====
  function findById(id: string) {
    return items.value.find((x) => x.id === id)
  }
  function safeName(name: string) {
    return name.replace(/[^\w.\-]+/g, '_')
  }

  // ===== CREATE =====
  async function createBook(payload: CreatePayload) {
    if (!payload.title) throw new Error('Judul wajib diisi')
    const now = Date.now()

    // 1) buat id
    const newRef = push(dbRef($realtimeDb, BOOKS_NODE))
    const id = newRef.key!
    // 2) siapkan upload (opsional)
    let pdfUrl: string | null = null
    let pdfPath: string | null = null
    let coverUrl: string | null = null
    let coverPath: string | null = null

    if (payload.pdfFile) {
      pdfPath = `alberr/library/books/${id}/${Date.now()}_${safeName(payload.pdfFile.name)}`
      await uploadBytes(sRef($storage, pdfPath), payload.pdfFile)
      pdfUrl = await getDownloadURL(sRef($storage, pdfPath))
    }
    if (payload.coverFile) {
      coverPath = `alberr/library/books/${id}/cover_${Date.now()}_${safeName(payload.coverFile.name)}`
      await uploadBytes(sRef($storage, coverPath), payload.coverFile)
      coverUrl = await getDownloadURL(sRef($storage, coverPath))
    }

    // 3) tulis data
    const data: BookItem = {
      id,
      title: payload.title,
      author: payload.author || '',
      category: payload.category,
      year: payload.year ?? null,
      pages: payload.pages ?? null,
      tags: payload.tags ?? [],
      description: payload.description || '',
      aktif: payload.aktif ?? true,
      pdfUrl,
      pdfPath,
      coverUrl,
      coverPath,
      createdAt: now,
      updatedAt: now
    }
    await set(newRef, data)
    return id
  }

  // ===== UPDATE =====
  async function updateBook(id: string, payload: UpdatePayload) {
    const cur = findById(id)
    if (!cur) throw new Error('Data buku tidak ditemukan.')

    const now = Date.now()
    const updates: any = {
      updatedAt: now
    }

    // meta
    if (payload.title !== undefined) updates.title = payload.title
    if (payload.author !== undefined) updates.author = payload.author
    if (payload.category !== undefined) updates.category = payload.category
    if (payload.year !== undefined) updates.year = payload.year ?? null
    if (payload.pages !== undefined) updates.pages = payload.pages ?? null
    if (payload.tags !== undefined) updates.tags = payload.tags ?? []
    if (payload.description !== undefined) updates.description = payload.description ?? ''
    if (payload.aktif !== undefined) updates.aktif = payload.aktif

    // files: PDF
    if (payload.removePdf) {
      if (cur.pdfPath) {
        try { await deleteObject(sRef($storage, cur.pdfPath)) } catch {}
      }
      updates.pdfUrl = null
      updates.pdfPath = null
    } else if (payload.pdfFile) {
      // replace
      if (cur.pdfPath) {
        try { await deleteObject(sRef($storage, cur.pdfPath)) } catch {}
      }
      const pdfPath = `library/books/${id}/${Date.now()}_${safeName(payload.pdfFile.name)}`
      await uploadBytes(sRef($storage, pdfPath), payload.pdfFile)
      const pdfUrl = await getDownloadURL(sRef($storage, pdfPath))
      updates.pdfPath = pdfPath
      updates.pdfUrl = pdfUrl
    }

    // files: COVER
    if (payload.removeCover) {
      if (cur.coverPath) {
        try { await deleteObject(sRef($storage, cur.coverPath)) } catch {}
      }
      updates.coverUrl = null
      updates.coverPath = null
    } else if (payload.coverFile) {
      if (cur.coverPath) {
        try { await deleteObject(sRef($storage, cur.coverPath)) } catch {}
      }
      const coverPath = `library/books/${id}/cover_${Date.now()}_${safeName(payload.coverFile.name)}`
      await uploadBytes(sRef($storage, coverPath), payload.coverFile)
      const coverUrl = await getDownloadURL(sRef($storage, coverPath))
      updates.coverPath = coverPath
      updates.coverUrl = coverUrl
    }

    await rtdbUpdate(dbRef($realtimeDb, `${BOOKS_NODE}/${id}`), updates)
  }

  // ===== DELETE =====
  async function deleteBook(id: string) {
    const cur = findById(id)
    if (!cur) return
    // hapus file di Storage
    try {
      if (cur.pdfPath) await deleteObject(sRef($storage, cur.pdfPath))
    } catch {}
    try {
      if (cur.coverPath) await deleteObject(sRef($storage, cur.coverPath))
    } catch {}
    // hapus node RTDB
    await remove(dbRef($realtimeDb, `${BOOKS_NODE}/${id}`))
  }

  return {
    // state
    items, loading,
    // filters
    filtered, q, fCategory, fAktif,
    // crud
    subscribeAll, unbindList,
    createBook, updateBook, deleteBook,
    // consts
    BOOKS_NODE, BOOK_CATEGORIES
  }
}
