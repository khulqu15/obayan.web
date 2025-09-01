import { ref, computed, onMounted, watch } from 'vue'

export type NewsContentTiptap = { kind: 'tiptap'; json?: any; html?: string }
export type NewsContentHtml   = { kind: 'html'; html: string }
export type NewsContent       = NewsContentTiptap | NewsContentHtml | string | null

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

export const useNews = () => {
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
        const [{ generateHTML }] = await Promise.all([import('@tiptap/core')])
        const StarterKit = (await import('@tiptap/starter-kit')).default
        html = generateHTML(c.json, [StarterKit])
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
    const safe = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })
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
      const snap = await get(dbRef($realtimeDb, 'alberr/news'))
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
          content
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

  async function createNews(payload: Omit<NewsItem, 'id'|'slug'|'readTime'|'publishedAt'> & {
    slug?: string; publishedAt?: number; readTime?: number; content?: NewsContent
  }) {
    const { $realtimeDb } = useNuxtApp()
    const { push, set, ref: dbRef } = await import('firebase/database')

    const taken = new Set(items.value.map(n => n.slug))
    let base = slugify(payload.slug || payload.title)
    if (!base) base = 'news'
    let candidate = base, i = 2
    while (taken.has(candidate)) candidate = `${base}-${i++}`

    let content: NewsContent = payload.content || null
    let json: any = undefined, html: string | undefined
    if (content && typeof content === 'object' && (content as any).kind === 'tiptap') {
      json = (content as any).json
      html = (content as any).html
      if (!html && json) {
        const [{ generateHTML }] = await Promise.all([import('@tiptap/core')])
        const StarterKit = (await import('@tiptap/starter-kit')).default
        html = generateHTML(json, [StarterKit])
      }
      content = { kind: 'tiptap', json, html }
    } else if (typeof content === 'string' && content.trim().startsWith('<')) {
      content = { kind: 'html', html: content }
    }

    const now = Date.now()
    const read = payload.readTime ?? estimateReadTimeFromTiptap(json, html)

    const listRef = dbRef($realtimeDb, 'alberr/news')
    const nodeRef = push(listRef)
    await set(nodeRef, {
      slug: candidate,
      title: payload.title || '',
      excerpt: payload.excerpt || '',
      cover: payload.cover || '',
      category: payload.category || '',
      tags: payload.tags || [],
      publishedAt: payload.publishedAt ?? now,
      readTime: read || 3,
      content
    })
    await loadNews()
    return nodeRef.key
  }

  async function updateNews(id: string, patch: Partial<NewsItem> & { slug?: string; content?: NewsContent }) {
    const { $realtimeDb } = useNuxtApp()
    const { update, ref: dbRef } = await import('firebase/database')
    const nodeRef = dbRef($realtimeDb, `alberr/news/${id}`)

    const data: any = {}
    if (patch.title !== undefined) data.title = patch.title
    if (patch.excerpt !== undefined) data.excerpt = patch.excerpt
    if (patch.cover !== undefined) data.cover = patch.cover
    if (patch.category !== undefined) data.category = patch.category
    if (patch.tags !== undefined) data.tags = patch.tags
    if (patch.publishedAt !== undefined) data.publishedAt = Number(patch.publishedAt)
    if (patch.readTime !== undefined) data.readTime = Number(patch.readTime)
    if (patch.slug) data.slug = slugify(patch.slug)

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

    await update(nodeRef, data)
    await loadNews()
  }

  async function deleteNews(id: string) {
    const { $realtimeDb } = useNuxtApp()
    const { remove, ref: dbRef } = await import('firebase/database')
    await remove(dbRef($realtimeDb, `alberr/news/${id}`))
    await loadNews()
  }

  return {
    pending, error, items,
    q, selectedCategory, selectedTags, sortBy, page, pageSize,
    filtered, paged, hasMore, toggleTag, resetFilters,
    slug, isDetail, current, openDetail, backToList, renderedDetailHtml, contentToHtml,
    loadNews, createNews, updateNews, deleteNews
  }
}
