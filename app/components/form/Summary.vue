<template>
  <div class="flex justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-1">
    <dt class="text-gray-600 dark:text-neutral-300">{{ k }}</dt>
    <dd class="font-medium text-gray-900 dark:text-white text-right truncate">{{ v || '—' }}</dd>
  </div>
</template>

<script setup lang="ts">
defineProps<{ k?: string, v?: string }>()
</script>
