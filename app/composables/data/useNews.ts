import { ref, computed, onMounted, watch } from 'vue'
import { Node } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Youtube from '@tiptap/extension-youtube'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'

export type NewsContentTiptap = { kind: 'tiptap'; json?: any; html?: string }
export type NewsContentHtml   = { kind: 'html'; html: string }
export type NewsContent       = NewsContentTiptap | NewsContentHtml | string | null

export type NewsAuthor = {
  uid?: string
  name?: string
  email?: string
  role?: string
  avatar?: string
}

export type NewsItem = {
  id: string
  slug: string
  title: string
  excerpt?: string
  cover?: string
  category?: string
  tags: string[]
  publishedAt: number
  readTime?: number
  content?: NewsContent
  author?: NewsAuthor
  updatedBy?: NewsAuthor
  createdAt?: number
  updatedAt?: number
  segment?: 'TK' | 'SD' | 'SMP' | 'Madin' | 'Pondok' | 'Umum'
  coverPublicId?: string
}

function slugify(s: string) {
  return (s || '')
    .toLowerCase()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .slice(0, 120)
}

function textFromTiptapJSON(json: any): string {
  try {
    const walk = (node: any): string => {
      if (!node) return ''
      let out = ''
      if (typeof node.text === 'string') out += node.text + ' '
      if (Array.isArray(node.content)) for (const c of node.content) out += walk(c)
      return out
    }
    return walk(json || {})
  } catch { return '' }
}

function estimateReadTimeFromTiptap(json?: any, html?: string) {
  const text = (json ? textFromTiptapJSON(json) : '') ||
               (html ? String(html).replace(/<[^>]+>/g, ' ') : '')
  const words = (text.match(/\w+/g) || []).length
  return Math.max(1, Math.round(words / 200))
}

const PdfEmbed = Node.create({
  name: 'pdfEmbed',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: '' },
      title: { default: 'Dokumen PDF' }
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="pdf-embed"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      {
        'data-type': 'pdf-embed',
        'data-src': HTMLAttributes.src || '',
        'data-title': HTMLAttributes.title || 'Dokumen PDF',
        class: 'pdf-embed'
      },
      ['div', { class: 'pdf-embed-title' }, HTMLAttributes.title || 'Dokumen PDF'],
      [
        'iframe',
        {
          src: HTMLAttributes.src || '',
          loading: 'lazy',
          class: 'pdf-embed-frame'
        }
      ]
    ]
  }
})

const MapEmbed = Node.create({
  name: 'mapEmbed',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: {
        default: ''
      },
      title: {
        default: 'Lokasi Google Maps'
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="map-embed"]'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      {
        'data-type': 'map-embed',
        'data-src': HTMLAttributes.src || '',
        'data-title': HTMLAttributes.title || 'Lokasi Google Maps',
        class: 'map-embed'
      },
      ['div', { class: 'map-embed-title' }, HTMLAttributes.title || 'Lokasi Google Maps'],
      [
        'iframe',
        {
          src: HTMLAttributes.src || '',
          loading: 'lazy',
          class: 'map-embed-frame',
          allowfullscreen: 'true',
          referrerpolicy: 'no-referrer-when-downgrade'
        }
      ]
    ]
  }
})

function tiptapExtensions() {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
      bulletList: {
        keepMarks: true,
        keepAttributes: false
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false
      }
    }),

    Image.configure({
      inline: false,
      allowBase64: false,
      HTMLAttributes: {
        class: 'editor-image'
      }
    }),

    Link.configure({
      openOnClick: true,
      autolink: true,
      HTMLAttributes: {
        class: 'news-content-link',
        target: '_blank',
        rel: 'noopener noreferrer'
      }
    }),

    Youtube.configure({
      controls: true,
      nocookie: true,
      allowFullscreen: true,
      width: 640,
      height: 360,
      HTMLAttributes: {
        class: 'youtube-embed'
      }
    }),

    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class: 'editor-table'
      }
    }),

    TableRow,
    TableHeader,
    TableCell,
    PdfEmbed,
    MapEmbed
  ]
}

function cleanForFirebase<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_key, val) => {
      if (val === undefined) return null
      return val
    })
  )
}

export const useNews = () => {
  const config = useRuntimeConfig()
  const clientName = config.public.clientName || 'alinayah'

  const pending = ref(false)
  const error = ref<string|null>(null)
  const items = ref<NewsItem[]>([])

  const q = ref('')
  const selectedCategory = ref<string>('')
  const selectedTags = ref<string[]>([])
  const sortBy = ref<'newest'|'oldest'|'title'>('newest')
  const page = ref(1)
  const pageSize = ref(12)

  const filtered = computed(() => {
    const mq = q.value.trim().toLowerCase()
    let out = items.value.filter(a => {
      const hay = [a.title, a.excerpt, ...(a.tags||[])].join(' ').toLowerCase()
      const matchQ = !mq || hay.includes(mq)
      const matchC = !selectedCategory.value || a.category === selectedCategory.value
      const matchT = selectedTags.value.length === 0 || selectedTags.value.every(t => a.tags?.includes(t))
      return matchQ && matchC && matchT
    })
    if (sortBy.value === 'newest') out.sort((a,b) => (b.publishedAt||0) - (a.publishedAt||0))
    if (sortBy.value === 'oldest') out.sort((a,b) => (a.publishedAt||0) - (b.publishedAt||0))
    if (sortBy.value === 'title')  out.sort((a,b) => a.title.localeCompare(b.title))
    return out
  })
  const paged = computed(() => filtered.value.slice(0, page.value * pageSize.value))
  const hasMore = computed(() => paged.value.length < filtered.value.length)

  function toggleTag(t: string) {
    const i = selectedTags.value.indexOf(t)
    if (i >= 0) selectedTags.value.splice(i,1); else selectedTags.value.push(t)
  }
  function resetFilters() {
    q.value = ''; selectedCategory.value = ''; selectedTags.value = []; sortBy.value = 'newest'; page.value = 1
  }

  const route = useRoute()
  const router = useRouter()
  const slug = computed(() => (route.query.slug as string | undefined) || '')
  const isDetail = computed(() => !!slug.value)
  const current = ref<NewsItem | null>(null)
  watch([slug, items], () => { current.value = items.value.find(x => x.slug === slug.value) || null }, { immediate: true })
  function openDetail(s: string) { router.push({ query: { ...route.query, slug: s } }) }
  function backToList() { const qy = { ...route.query } as any; delete qy.slug; router.push({ query: qy }) }

  const renderCache = new Map<string, string>()
  async function contentToHtml(content?: NewsContent): Promise<string> {
    if (!content) return ''
    let html = ''
    let key = ''

    if (typeof content === 'object' && (content as any).kind === 'tiptap') {
      const c = content as NewsContentTiptap
      if (c.html && c.html.trim()) {
        html = c.html
        key = 'tiptap-html:' + c.html.slice(0,120)
      } else if (c.json) {
        key = 'tiptap-json:' + JSON.stringify(c.json).slice(0,120)
        const { generateHTML } = await import('@tiptap/core')
        html = generateHTML(c.json, tiptapExtensions())
      }
    }

    if (!html && typeof content === 'string' && content.trim().startsWith('<')) {
      html = content
      key = 'str-html:' + content.slice(0,120)
    }

    if (!html && typeof content === 'object' && (content as any).kind === 'html') {
      const c = content as NewsContentHtml
      html = c.html || ''
      key = 'obj-html:' + (c.html || '').slice(0,120)
    }

    if (!html) return ''
    if (renderCache.has(key)) return renderCache.get(key)!
    const DOMPurify = (await import('isomorphic-dompurify')).default
    const safe = DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
      ADD_TAGS: ['iframe'],
      ADD_ATTR: [
        'allow',
        'allowfullscreen',
        'frameborder',
        'scrolling',
        'loading',
        'referrerpolicy',
        'src',
        'href',
        'target',
        'rel',
        'title',
        'alt',
        'width',
        'height',
        'class',
        'data-type',
        'data-src',
        'data-title',
        'data-public-id'
      ]
    })
    renderCache.set(key, safe)
    return safe
  }

  const renderedDetailHtml = ref<string>('')
  watch(current, async (val) => {
    renderedDetailHtml.value = val?.content ? await contentToHtml(val.content) : ''
  }, { immediate: true })

  async function loadNews() {
    pending.value = true
    error.value = null
    try {
      const { $realtimeDb } = useNuxtApp()
      const { get, ref: dbRef } = await import('firebase/database')
      const snap = await get(dbRef($realtimeDb, `${clientName}/news`))
      const val = snap.val() || {}
        
      const arr: NewsItem[] = Object.entries(val).map(([key, v]: any) => {
        let content: NewsContent | undefined
        if (v?.content?.kind === 'tiptap') {
          content = { kind: 'tiptap', json: v.content.json, html: v.content.html }
        } else if (v?.content?.html) {
          content = { kind: 'html', html: v.content.html }
        } else if (typeof v?.content === 'string') {
          content = v.content
        } else if (v?.html) {
          content = { kind: 'html', html: v.html }
        }

        const read = Number(v.readTime ?? estimateReadTimeFromTiptap(v?.content?.json, v?.content?.html))
        return {
          id: key,
          slug: v.slug || key,
          title: v.title || '',
          excerpt: v.excerpt || '',
          cover: v.cover || '',
          category: v.category || '',
          tags: Array.isArray(v.tags) ? v.tags : String(v.tags || '').split(',').map((s:string)=>s.trim()).filter(Boolean),
          publishedAt: Number(v.publishedAt || Date.now()),
          readTime: read || 3,
          content,
          author: v.author || undefined,
          updatedBy: v.updatedBy || undefined,
          createdAt: Number(v.createdAt || 0) || undefined,
          updatedAt: Number(v.updatedAt || 0) || undefined,
          segment: v.segment || 'Umum',
          coverPublicId: v.coverPublicId || '',
        }
      })
      items.value = arr.sort((a,b) => (b.publishedAt||0) - (a.publishedAt||0))
    } catch (e:any) {
      console.error(e)
      error.value = e?.message ?? 'Gagal memuat berita'
    } finally {
      pending.value = false
    }
  }
  onMounted(loadNews)

  async function createNews(payload: Omit<NewsItem, 'id'|'slug'|'readTime'> & {
    slug?: string
    publishedAt?: number
    readTime?: number
    content?: NewsContent
  }) {
    const { $realtimeDb } = useNuxtApp()
    const { push, set, ref: dbRef } = await import('firebase/database')

    const taken = new Set(items.value.map(n => n.slug))
    let base = slugify(payload.slug || payload.title)
    if (!base) base = 'news'
    let candidate = base, i = 2
    while (taken.has(candidate)) candidate = `${base}-${i++}`

    let content: NewsContent = payload.content || null
    let json: any = undefined
    let html: string | undefined

    if (content && typeof content === 'object' && (content as any).kind === 'tiptap') {
      json = (content as any).json
      html = (content as any).html
      if (!html && json) {
        const { generateHTML } = await import('@tiptap/core')
        html = generateHTML(json, tiptapExtensions())
      }
      content = { kind: 'tiptap', json, html }
    } else if (typeof content === 'string' && content.trim().startsWith('<')) {
      content = { kind: 'html', html: content }
    }

    const now = Date.now()
    const read = payload.readTime ?? estimateReadTimeFromTiptap(json, html)

    const listRef = dbRef($realtimeDb, `${clientName}/news`)
    const nodeRef = push(listRef)

    const data = cleanForFirebase({
      slug: candidate,
      title: payload.title || '',
      excerpt: payload.excerpt || '',
      cover: payload.cover || '',
      category: payload.category || '',
      tags: payload.tags || [],
      publishedAt: payload.publishedAt ?? now,
      readTime: read || 3,
      content,
      segment: (payload as any).segment || 'Umum',
      author: payload.author || null,
      createdAt: now,
      updatedAt: now,
      coverPublicId: (payload as any).coverPublicId || '',
    })

    await set(nodeRef, data)

    await loadNews()
    return nodeRef.key
  }
  
  async function updateNews(id: string, patch: Partial<NewsItem> & { slug?: string; content?: NewsContent }) {
    const { $realtimeDb } = useNuxtApp()
    const { update, ref: dbRef } = await import('firebase/database')
    const nodeRef = dbRef($realtimeDb, `${clientName}/news/${id}`)

    const data: any = {}
    if (patch.title !== undefined) data.title = patch.title
    if (patch.excerpt !== undefined) data.excerpt = patch.excerpt
    if (patch.cover !== undefined) data.cover = patch.cover
    if (patch.category !== undefined) data.category = patch.category
    if (patch.tags !== undefined) data.tags = patch.tags
    if (patch.publishedAt !== undefined) data.publishedAt = Number(patch.publishedAt)
    if (patch.readTime !== undefined) data.readTime = Number(patch.readTime)
    if (patch.slug) data.slug = slugify(patch.slug)
    if (patch.updatedBy !== undefined) data.updatedBy = patch.updatedBy
    if ((patch as any).segment !== undefined) data.segment = (patch as any).segment
    if ((patch as any).coverPublicId !== undefined) data.coverPublicId = (patch as any).coverPublicId
    data.updatedAt = Date.now()

    if (patch.content !== undefined) {
      let content: NewsContent = patch.content
      if (typeof content === 'object' && (content as any).kind === 'tiptap') {
        const c = content as NewsContentTiptap
        let html = c.html
        if (!html && c.json) {
          const [{ generateHTML }] = await Promise.all([import('@tiptap/core')])
          const StarterKit = (await import('@tiptap/starter-kit')).default
          html = generateHTML(c.json, [StarterKit])
        }
        content = { kind: 'tiptap', json: c.json, html }
        if (data.readTime === undefined) data.readTime = estimateReadTimeFromTiptap(c.json, html)
      } else if (typeof content === 'string' && content.trim().startsWith('<')) {
        content = { kind: 'html', html: content }
      }
      data.content = content
    }

    await update(nodeRef, cleanForFirebase(data))
    await loadNews()
  }

  async function deleteNews(id: string) {
    const { $realtimeDb } = useNuxtApp()
    const { remove, ref: dbRef } = await import('firebase/database')
    await remove(dbRef($realtimeDb, `${clientName}/news/${id}`))
    await loadNews()
  }

  const categories = computed(() => {
    return Array.from(
      new Set(
        items.value
          .map((item) => item.category)
          .filter(Boolean)
          .map((category) => String(category))
      )
    ).sort((a, b) => a.localeCompare(b))
  })

  const allTags = computed(() => {
    return Array.from(
      new Set(
        items.value
          .flatMap((item) => item.tags || [])
          .filter(Boolean)
          .map((tag) => String(tag))
      )
    ).sort((a, b) => a.localeCompare(b))
  })

  return {
    pending, error, items,
    q, selectedCategory, selectedTags, sortBy, page, pageSize,
    filtered, paged, hasMore, toggleTag, resetFilters,
    slug, isDetail, current, openDetail, backToList, renderedDetailHtml, contentToHtml,
    loadNews, createNews, updateNews, deleteNews, categories, allTags
  }
}
