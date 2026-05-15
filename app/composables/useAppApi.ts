export function useAppApi() {
  const runtime = useRuntimeConfig()

    const apiRemoteEnabled = computed(() => {
        const value = String(runtime.public.apiRemoteEnabled || 'false').trim().toLowerCase()
        return ['true', '1', 'yes', 'on'].includes(value)
    })

    const apiBaseUrl = computed(() => {
        return String(runtime.public.apiBaseUrl || '')
        .trim()
        .replace(/\/$/, '')
    })

    function apiUrl(path: string) {
        const normalizedPath = path.startsWith('/') ? path : `/${path}`
        if (!apiRemoteEnabled.value || !apiBaseUrl.value) return normalizedPath
        return `${apiBaseUrl.value}${normalizedPath}`
    }

    function tenantApiUrl(tenantSlug: string, path: string) {
        const normalizedPath = path.startsWith('/') ? path : `/${path}`
        return apiUrl(`/api/tenants/${tenantSlug}${normalizedPath}`)
    }

    return {
        apiRemoteEnabled,
        apiBaseUrl,
        apiUrl,
        tenantApiUrl
    }
}