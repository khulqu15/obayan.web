<template>
  <teleport to="body">
    <transition name="fade" appear>
      <div
        v-if="visible"
        class="fixed inset-0 z-[9999] flex items-center justify-center"
        aria-live="polite" :aria-label="label"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-[#121EA1]/85 via-[#2D3FFF]/90 to-[#FF7F00]/85"></div>
        <div class="absolute inset-0 opacity-15" style="background-image:
          linear-gradient(to right,rgba(255,255,255,.25) 1px,transparent 1px),
          linear-gradient(to bottom,rgba(255,255,255,.25) 1px,transparent 1px);
          background-size:22px 22px;">
        </div>
        <div class="relative mx-4 rounded-2xl max-w-sm w-full bg-white/90 backdrop-blur p-5 shadow-2xl ring-1 ring-white/50 text-center">
        <img src="/logo.png" class="w-20 inline-block mx-auto mb-3" alt="Alberr Logo">
        <h1 class="mb-4 font-semibold">ALBERR</h1>
          <div class="items-center justify-center gap-3 text-center">
            <ClientOnly class="inline-block">
              <Icon icon="line-md:loading-twotone-loop" class="size-8 text-[#2D3FFF]" />
              <template #fallback>
                <span class="inline-block size-8 rounded-full border-2 border-[#2D3FFF] border-t-transparent animate-spin"/>
              </template>
            </ClientOnly>
            <div>
              <p class="text-sm font-semibold text-gray-800">{{ label }}</p>
              <p v-if="sublabel" class="text-xs text-gray-500">{{ sublabel }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = withDefaults(defineProps<{
  force?: boolean
  label?: string
  sublabel?: string
}>(), {
  force: undefined,
  label: 'Loading...',
  sublabel: 'Harap tunggu sebentar'
})

const state = useState<boolean>('pageLoading', () => false)
const visible = computed(() => props.force ?? state.value)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease, transform .18s ease }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: scale(.98) }
</style>
