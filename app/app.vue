<template>
  <div>
    <NuxtLoadingIndicator color="#2563eb" :height="3" :throttle="0" :duration="2000" />
    <AppLoading :force="forced" label="Memuat..." sublabel="Menyiapkan halaman" />
    <NuxtLayout v-bind="page?.meta?.layoutProps">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick, watch, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

const page = useRoute()
const forced = ref(false)

</script>
