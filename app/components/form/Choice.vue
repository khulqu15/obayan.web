<template>
  <label class="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-neutral-700 px-3 py-1.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800">
    <input type="radio" class="rounded" :name="name" :checked="modelValue===value" @change="emit('update:modelValue', value)" />
    <span class="text-sm">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: any, value: any, label: string, name: string }>()
const emit = defineEmits<{ 'update:modelValue':[any] }>()
</script>
