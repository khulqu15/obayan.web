export default defineNuxtRouteMiddleware(() => {
    const runtime = useRuntimeConfig()
    const requestUrl = useRequestURL()

    const host = normalizeHost(requestUrl.hostname)

    const envClientName = normalizeTenantKey(
        String(runtime.public.clientName || '')
    )

    const tenantKey = resolveTenantKey(host, envClientName)

    const tenantHostState = useState<string>('tenant:host', () => '')
    const tenantKeyState = useState<string>('tenant:key', () => 'obayan')

    const isMartopuroState = useState<boolean>('tenant:isMartopuro', () => false)
    const isObayanState = useState<boolean>('tenant:isObayan', () => false)
    const isSencraState = useState<boolean>('tenant:isSencra', () => false)

    const isRailwayState = useState<boolean>('tenant:isRailway', () => false)

    tenantHostState.value = host
    tenantKeyState.value = tenantKey

    isMartopuroState.value = tenantKey === 'martopuro'
    isObayanState.value = tenantKey === 'obayan'
    isSencraState.value = tenantKey === 'sencra'

    isRailwayState.value = isRailwayDomain(host)
})

function normalizeHost(value: string) {
    return String(value || '')
        .replace(/^www\./, '')
        .replace(/:\d+$/, '')
        .trim()
        .toLowerCase()
}

function normalizeTenantKey(value: string) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, '')
}

function isRailwayDomain(host: string) {
    return (
        host === 'railway.app' ||
        host.endsWith('.railway.app') ||
        host.endsWith('.up.railway.app')
    )
}

function resolveTenantKey(host: string, envClientName: string) {
    /**
     * Important:
     * Railway domain dicek sebelum obayan,
     * karena domain seperti obayanweb-production.up.railway.app
     * mengandung kata "obayan".
     */
    if (isRailwayDomain(host)) return 'martopuro'
    if (host === 'martopuro.com' || host.endsWith('.martopuro.com') || host.includes('martopuro')) return 'martopuro'
    if (host === 'sencra.io' || host === 'sencra.com' || host.endsWith('.sencra.io') || host.endsWith('.sencra.com') || host.includes('sencra')) return 'sencra'
    if (host === 'obayan.id' || host.endsWith('.obayan.id') || host.includes('obayan')) return 'obayan'
    if (envClientName === 'martopuro') return 'martopuro'
    if (envClientName === 'sencra') return 'sencra'
    if (envClientName === 'obayan') return 'obayan'

    return envClientName || 'obayan'
}