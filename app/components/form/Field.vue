<template>
  <label class="block">
    <span class="text-xs text-gray-600 dark:text-neutral-300">
      {{ label }} <span v-if="required" class="text-red-600">*</span>
    </span>
    <input
      class="mt-1 w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      @input="onInput"
    />
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
  label: string
  placeholder?: string
  required?: boolean
  inputmode?: string
  upper?: boolean
  as?: 'input'|'textarea'
}>()
const emit = defineEmits<{ 'update:modelValue':[string] }>()
function onInput(e: Event){
  const el = e.target as HTMLInputElement
  let v = el.value || ''
  if (props.upper) v = v.toUpperCase()
  emit('update:modelValue', v)
}
</script>
