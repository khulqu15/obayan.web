<template>
    <div>
      <AppNavbar/>
        <slot />
      <AppFooter/>
    </div>
</template>

<script setup lang="ts">
import { useRequestURL } from "nuxt/app"
import { computed } from "vue"

const requestUrl = useRequestURL()
const currentHostname = computed(() => {
  return String(requestUrl.hostname || '').replace(/^www\./, '').toLowerCase()
})

const isMartopuroDomain = computed(() => {
  const host = String(currentHostname.value || '')
    .replace(/^www\./, '')
    .replace(/:\d+$/, '')
    .toLowerCase()

  return (
    host === 'martopuro.com' ||
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === 'obayanweb-production.up.railway.app' ||
    host.endsWith('.up.railway.app')
  )
})

const isObayanDomain = computed(() => {
    const requestUrl = useRequestURL()
    const currentHostname = String(requestUrl.hostname || '').replace(/^www\./, '').toLowerCase()
    return currentHostname === 'obayan.id' || currentHostname === 'obayan.sencra.io'
})
</script>