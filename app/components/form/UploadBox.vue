<template>
  <div class="space-y-1.5">
    <span class="text-xs text-gray-600 dark:text-neutral-300">{{ label }}</span>
    <div
      class="relative rounded-xl border border-dashed border-gray-300 dark:border-neutral-700 p-4 bg-white/70 dark:bg-neutral-900/60 text-sm flex items-center justify-between gap-3"
      @dragover.prevent
      @drop.prevent="onDrop"
    >
      <div class="flex items-center gap-3">
        <div class="shrink-0 rounded-md bg-gray-100 dark:bg-neutral-800 p-2">📎</div>
        <div v-if="fileBox?.file">
          <p class="font-medium text-gray-900 dark:text-white truncate max-w-[18rem]">{{ fileBox.file.name }}</p>
          <p class="text-[12px] text-gray-500 dark:text-neutral-400">{{ Math.round((fileBox.file.size||0)/1024) }} KB</p>
        </div>
        <div v-else>
          <p class="text-gray-700 dark:text-neutral-200">Tarik & lepas file ke sini</p>
          <p class="text-[12px] text-gray-500 dark:text-neutral-400">atau klik tombol di kanan</p>
        </div>
      </div>
      <div>
        <label class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 px-3 py-2 text-sm font-medium hover:bg-white dark:hover:bg-neutral-800">
          <input type="file" class="hidden" :accept="accept.join(',')" @change="onPick" />
          Pilih File
        </label>
      </div>
    </div>
    <div v-if="fileBox?.url" class="mt-2">
      <img :src="fileBox.url" class="max-h-28 rounded-lg border border-gray-200 dark:border-neutral-700" @error="hide($event)" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: {file: File|null, url: string|null}, label: string, accept?: string[] }>()
const emit = defineEmits<{ 'update:modelValue':[ {file: File|null, url: string|null} ] }>()
const fileBox = computed(()=>props.modelValue)
function onPick(e:any){ const f = e.target.files?.[0]||null; emit('update:modelValue', f?{file:f,url:URL.createObjectURL(f)}:{file:null,url:null}) }
function onDrop(e:DragEvent){ const f = e.dataTransfer?.files?.[0]||null; emit('update:modelValue', f?{file:f,url:URL.createObjectURL(f)}:{file:null,url:null}) }
function hide(e:any){ e.target.style.display='none' }
</script>
