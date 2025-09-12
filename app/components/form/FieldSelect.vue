<template>
  <label class="block">
    <span class="text-xs text-gray-600 dark:text-neutral-300">
      {{ label }} <span v-if="required" class="text-red-600">*</span>
    </span>
    <select
      class="mt-1 w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
      :value="modelValue"
      :required="required"
      @change="(e:any)=>emit('update:modelValue', e.target.value)"
    >
      <option value="">— Pilih —</option>
      <option v-for="[v,l] in options" :key="v" :value="v">{{ l }}</option>
    </select>
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue?: string, label: string, options: [string,string][], required?: boolean }>()
const emit = defineEmits<{ 'update:modelValue':[string] }>()
</script>
