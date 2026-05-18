// composables/data/useWebEditor.ts
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRuntimeConfig, useState } from 'nuxt/app'
import { useWeb } from '~/composables/data/useWeb'

type BreakpointKey = 'desktop' | 'tablet' | 'mobile'

export function useWebEditor() {
    const route = useRoute()
    const router = useRouter()
    const config = useRuntimeConfig()

    const web = useWeb() as any

    const {
        pages,
        subscribePages,
        normalizePath,
        currentPath,
        createPage,
        renamePage,
        deletePage,
        upsertMeta
    } = web

    const selectedPath = computed(() => {
        return normalizePath(String(route.query.path || currentPath.value || '/'))
    })

    const pageItems = computed(() => {
        return (pages.value || []).map((item: any) => {
            const path = normalizePath(item.path || '/')

            return {
                path,
                pathKey: item.pathKey || path.replace(/\W+/g, '-') || 'root',
                name: item?.meta?.title || item?.title || humanizePath(path),
                title: item?.meta?.title || item?.title || humanizePath(path),
                status: item?.meta?.status || item?.status || 'draft',
                protected: Boolean(item?.isDefault || item?.default || item?.system),
                raw: item
            }
        })
    })

    const activePage = computed(() => {
        return pageItems.value.find((item: any) => item.path === selectedPath.value) || null
    })

    const activePageSections = computed(() => {
        const sections = activePage.value?.raw?.sections || []

        if (!Array.isArray(sections)) return []

        return sections.map((section: any, index: number) => ({
            id: section.id || `section-${index}`,
            name: section.title || section.type || `Section ${index + 1}`,
            icon: section.icon || '▢',
            selected: false,
            locked: Boolean(section.locked),
            raw: section
        }))
    })

    const editorAssets = computed(() => {
        const assets = activePage.value?.raw?.assets || []

        if (!Array.isArray(assets)) return []

        return assets.map((asset: any, index: number) => ({
            id: asset.id || `asset-${index}`,
            name: asset.name || asset.filename || `Asset ${index + 1}`,
            icon: asset.type === 'image' ? '🖼️' : '◆',
            url: asset.url || '',
            raw: asset
        }))
    })

    async function selectPath(path: string) {
        const nextPath = normalizePath(path)

        currentPath.value = nextPath

        router.replace({
            query: {
                ...route.query,
                path: nextPath
            }
        })
    }

    async function publishPage() {
        await upsertMeta({
            title: activePage.value?.title || humanizePath(selectedPath.value),
            status: 'published'
        })

        await subscribePages?.()
    }

    async function saveDraft() {
        await upsertMeta({
            title: activePage.value?.title || humanizePath(selectedPath.value),
            status: 'draft'
        })

        await subscribePages?.()
    }

    async function saveCanvasSetting(payload: {
        breakpoint: BreakpointKey
        width: number
        height: number
        zoom: number
    }) {
        await $fetch('/api/admin/web/editor/canvas', {
        method: 'POST',
            body: {
                path: selectedPath.value,
                ...payload
            }
        })
    }

    function previewHref() {
        const siteUrl = String(config.public.siteUrl || '').replace(/\/$/, '')
        const path = selectedPath.value === '/' ? '/' : selectedPath.value

        return `${siteUrl}${path}`
    }

    function humanizePath(path: string) {
        if (path === '/') return 'Home'

        return path
            .replace(/^\//, '')
            .split('/')
            .filter(Boolean)
            .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
            .join(' ')
    }

    return {
        pages,
        pageItems,
        activePage,
        activePageSections,
        editorAssets,
        selectedPath,
        currentPath,
        normalizePath,
        subscribePages,
        createPage,
        renamePage,
        deletePage,
        upsertMeta,
        selectPath,
        publishPage,
        saveDraft,
        saveCanvasSetting,
        previewHref
    }
}