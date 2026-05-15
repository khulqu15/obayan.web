import type { TenantSiteResponse } from '~/types/tenant-site'

export function useTenantSite() {
  const runtime = useRuntimeConfig()

  const tenantSlug = computed(() => {
    return String(runtime.public.clientName || 'martopuro')
      .trim()
      .toLowerCase()
  })

  const { tenantApiUrl } = useAppApi()

  const apiUrl = computed(() => {
    return tenantApiUrl(tenantSlug.value, '/site')
  })

  const {
    data,
    pending,
    error,
    refresh
  } = useFetch<TenantSiteResponse>(apiUrl, {
    key: computed(() => `tenant-site-${tenantSlug.value}`),
    watch: [tenantSlug],
    default: () => ({
      data: {
        id: '',
        name: '',
        displayName: '',
        slug: tenantSlug.value,
        tenantType: 'custom',
        domain: null,
        siteUrl: null,
        logoUrl: null,
        faviconUrl: null,
        ogImageUrl: null,
        primaryColor: null,
        description: null,
        status: 'active',

        theme: {},
        seo: {},
        hero: {},
        contact: {},
        statistic: {},
        culture: {},
        warta: {},
        footer: {},
        navigation: [],
        social: {},
        metadata: {}
      }
    })
  })

  const site = computed(() => data.value?.data)

  return {
    tenantSlug,
    site,
    pending,
    error,
    refresh
  }
}