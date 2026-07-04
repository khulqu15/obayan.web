import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRuntimeConfig, useState } from 'nuxt/app'

const JAKARTA_TIMEZONE_OFFSET = '+07:00'

function normalizeExpiryValue(value: unknown) {
  const raw = String(value ?? '').trim()
  const disabledValues = ['', 'null', 'false', '0', 'none', 'off']

  if (disabledValues.includes(raw.toLowerCase())) return null

  return raw
}

function parseExpiryDate(value: string | null) {
  if (!value) return null

  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value)
  const date = new Date(dateOnly ? `${value}T00:00:00${JAKARTA_TIMEZONE_OFFSET}` : value)

  if (Number.isNaN(date.getTime())) return null

  return date
}

function formatExpiryDate(date: Date | null) {
  if (!date) return ''

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
    timeZone: 'Asia/Jakarta'
  }).format(date)
}

export function useSaasExpiry() {
  const config = useRuntimeConfig()
  const now = ref(Date.now())
  const realtimeExpiresAt = useState<unknown>('saasRealtimeExpiresAt', () => undefined)
  let timer: ReturnType<typeof setInterval> | undefined

  const rawExpiresAt = computed(() => {
    const source =
      realtimeExpiresAt.value !== undefined
        ? realtimeExpiresAt.value
        : config.public.saasExpiresAt

    return normalizeExpiryValue(source)
  })
  const expiresAt = computed(() => parseExpiryDate(rawExpiresAt.value))
  const isExpired = computed(() => {
    if (!expiresAt.value) return false

    return now.value >= expiresAt.value.getTime()
  })
  const formattedExpiresAt = computed(() => formatExpiryDate(expiresAt.value))

  onMounted(() => {
    timer = setInterval(() => {
      now.value = Date.now()
    }, 60_000)
  })

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
  })

  function setRealtimeExpiresAt(value: unknown) {
    realtimeExpiresAt.value = value
  }

  return {
    rawExpiresAt,
    expiresAt,
    formattedExpiresAt,
    isExpired,
    setRealtimeExpiresAt
  }
}
