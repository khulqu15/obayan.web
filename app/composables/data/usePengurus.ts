import { useState } from '#imports'

export type PengurusToday = {
  present: number
  total: number
  ts: number
}

export const usePengurus = () => {
  const today = useState<PengurusToday>('pengurus:today', () => ({ present: 0, total: 0, ts: Date.now() }))
  const _subId = useState<number | null>('pengurus:subId', () => null)

  async function fetchAbsensiToday() {
    if (!today.value || today.value.total === 0) {
      const total = 24
      const present = Math.max(0, Math.min(total, Math.round(total * (0.75 + Math.random() * 0.2)))) // 75–95%
      today.value = { present, total, ts: Date.now() }
    }
    return today.value
  }

  function subscribeAbsensiLive(intervalMs = 15_000) {
    if (!process.client) return () => {}
    if (_subId.value) return () => unsubscribeAbsensiLive()

    const id = window.setInterval(() => {
      if (!today.value || today.value.total === 0) return
      const dir = Math.random() > 0.5 ? 1 : -1
      let present = today.value.present + dir * (Math.random() > 0.7 ? 1 : 0)
      present = Math.max(0, Math.min(today.value.total, present))
      today.value = { present, total: today.value.total, ts: Date.now() }
    }, intervalMs)

    _subId.value = id
    return () => unsubscribeAbsensiLive()
  }

  function unsubscribeAbsensiLive() {
    if (!process.client) return
    if (_subId.value) {
      clearInterval(_subId.value)
      _subId.value = null
    }
  }

  const current = today

  return {
    today,
    current,
    fetchAbsensiToday,
    subscribeAbsensiLive,
    unsubscribeAbsensiLive,
  }
}
