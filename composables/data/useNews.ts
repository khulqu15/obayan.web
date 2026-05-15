import type { NewsItem, NewsListResponse } from '~/types/news'

export function useNews() {
  const runtime = useRuntimeConfig()
  const route = useRoute()
  const router = useRouter()

  const tenantSlug = computed(() => {
    return String(runtime.public.clientName || 'martopuro')
      .trim()
      .toLowerCase()
  })

  const q = ref('')
  const selectedCategory = ref('')
  const selectedTags = ref<Set<string>>(new Set())
  const sortBy = ref<'newest' | 'oldest' | 'title'>('newest')

  const page = ref(1)
  const pageSize = ref(6)

  const activeSlug = computed(() => {
    const value = route.query.news
    return typeof value === 'string' ? value : ''
  })

  const { tenantApiUrl } = useAppApi()
  
  const apiUrl = computed(() => {
    return tenantApiUrl(tenantSlug.value, `/news`)
  })

  const {
    data,
    pending,
    error,
    refresh
  } = useFetch<NewsListResponse>(apiUrl, {
    key: computed(() => `tenant-news-${tenantSlug.value}`),
    query: computed(() => ({
      status: 'published',
      limit: 100,
      sort: 'newest'
    })),
    watch: [tenantSlug],
    default: () => ({
      data: [],
      meta: {
        page: 1,
        limit: 100,
        total: 0,
        totalPages: 1
      }
    })
  })

  const items = computed<NewsItem[]>(() => data.value?.data || [])

  const isDetail = computed(() => Boolean(activeSlug.value))

  const current = computed(() => {
    if (!activeSlug.value) return null

    return items.value.find((item) => item.slug === activeSlug.value) || null
  })

  const categories = computed(() => {
    return Array.from(
      new Map(
        items.value
          .filter((item) => item.category && item.categorySlug)
          .map((item) => [item.categorySlug, item.category])
      ).values()
    )
  })

  const allTags = computed(() => {
    return Array.from(
      new Set(items.value.flatMap((item) => item.tags || []))
    )
  })

  const filtered = computed(() => {
    let rows = [...items.value]

    const keyword = q.value.trim().toLowerCase()

    if (keyword) {
      rows = rows.filter((item) => {
        return [
          item.title,
          item.descriptionCard,
          item.descriptionContent,
          item.category,
          ...(item.tags || [])
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(keyword)
      })
    }

    if (selectedCategory.value) {
      rows = rows.filter((item) => item.category === selectedCategory.value)
    }

    if (selectedTags.value.size) {
      rows = rows.filter((item) => {
        return item.tags?.some((tag) => selectedTags.value.has(tag))
      })
    }

    if (sortBy.value === 'newest') {
      rows.sort((a, b) => b.publishedAt - a.publishedAt)
    }

    if (sortBy.value === 'oldest') {
      rows.sort((a, b) => a.publishedAt - b.publishedAt)
    }

    if (sortBy.value === 'title') {
      rows.sort((a, b) => a.title.localeCompare(b.title))
    }

    return rows
  })

  const paged = computed(() => {
    return filtered.value.slice(0, page.value * pageSize.value)
  })

  const hasMore = computed(() => {
    return paged.value.length < filtered.value.length
  })

  const renderedDetailHtml = computed(() => {
    if (!current.value) return ''

    return current.value.descriptionContent || '<p>Belum ada konten berita.</p>'
  })

  function toggleTag(tag: string) {
    const next = new Set(selectedTags.value)

    if (next.has(tag)) {
      next.delete(tag)
    } else {
      next.add(tag)
    }

    selectedTags.value = next
    page.value = 1
  }

  function resetFilters() {
    q.value = ''
    selectedCategory.value = ''
    selectedTags.value = new Set()
    sortBy.value = 'newest'
    page.value = 1
  }

  async function openDetail(slug: string) {
    await router.push({
      query: {
        ...route.query,
        news: slug
      }
    })
  }

  async function backToList() {
    const query = { ...route.query }
    delete query.news

    await router.push({ query })
  }

  watch([q, selectedCategory, selectedTags, sortBy], () => {
    page.value = 1
  })

  return {
    tenantSlug,

    pending,
    error,
    refresh,

    items,

    q,
    selectedCategory,
    selectedTags,
    sortBy,

    categories,
    allTags,

    toggleTag,
    resetFilters,

    filtered,
    paged,
    hasMore,
    page,
    pageSize,

    isDetail,
    current,
    openDetail,
    backToList,
    renderedDetailHtml
  }
}