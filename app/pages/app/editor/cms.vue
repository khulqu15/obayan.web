<template>
  <ClientOnly>
    <AppCanvas />

    <template #fallback>
      <div class="flex h-full min-h-[520px] w-full items-center justify-center">
        <div class="rounded-3xl border border-gray-200 bg-white px-6 py-5 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
          <p class="text-sm font-bold text-gray-900 dark:text-white">
            Loading editor canvas...
          </p>
          <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
            Menyiapkan Vue Konva workspace.
          </p>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'editor'
    // Jika middleware auth kamu sudah ada, aktifkan:
    // middleware: ['admin-auth']
})
</script>