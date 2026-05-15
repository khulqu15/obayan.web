<template>
    <div>
        <AppNavbar v-if="isObayanDomain"/>
        <AppNavbarVillage v-if="isMartopuroDomain"/>
        <slot />
        <AppFooter v-if="isObayanDomain" />
        <AppFooterVillage v-if="isMartopuroDomain" />
    </div>
</template>

<script setup lang="ts">
import { useRequestURL } from "nuxt/app"
import { computed } from "vue"

const isMartopuroDomain = computed(() => {
    const requestUrl = useRequestURL()
    const currentHostname = String(requestUrl.hostname || '').replace(/^www\./, '').toLowerCase()
    return (
        currentHostname === 'martopuro.com' ||
        currentHostname === 'localhost' ||
        currentHostname === '127.0.0.1' ||
        currentHostname === 'railway.app'
    )
})

const isObayanDomain = computed(() => {
    const requestUrl = useRequestURL()
    const currentHostname = String(requestUrl.hostname || '').replace(/^www\./, '').toLowerCase()
    return currentHostname === 'obayan.id' || currentHostname === 'obayan.sencra.io'
})
</script>