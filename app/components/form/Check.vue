<template>
  <label class="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-neutral-700 px-3 py-1.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800">
    <input type="checkbox" class="rounded" :checked="checked" @change="toggle" />
    <span class="text-sm">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: any[], value: any, label: string }>()
const emit = defineEmits<{ 'update:modelValue':[any[]] }>()
const checked = computed(()=> props.modelValue.includes(props.value))
function toggle(){
  const set = new Set(props.modelValue)
  set.has(props.value) ? set.delete(props.value) : set.add(props.value)
  emit('update:modelValue', Array.from(set))
}
</script>
