import { ref } from 'vue'

export type AppRepositoryRow<T> = {
  id: string
  data: T
  createdAt?: string
  updatedAt?: string
  expiresAt?: string | null
}

export type UseAppRepositoryOptions = {
  client?: string
  realtime?: boolean
}

export function useAppRepository<T extends Record<string, any>>(
  collection: string,
  options: UseAppRepositoryOptions = {}
) {
  const rows = ref<AppRepositoryRow<T>[]>([])
  const current = ref<AppRepositoryRow<T> | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  function query(extra: Record<string, any> = {}) {
    return {
      collection,
      ...(options.client ? { client: options.client } : {}),
      ...extra
    }
  }

  async function list(params: Record<string, any> = {}) {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ rows: AppRepositoryRow<T>[] }>('/api/repository', {
        query: query(params)
      })
      rows.value = response.rows || []
      return rows.value
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Gagal memuat data.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function get(id: string) {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ row: AppRepositoryRow<T> }>('/api/repository', {
        query: query({ id })
      })
      current.value = response.row
      return response.row
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Gagal memuat detail data.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function create(payload: T, params: Record<string, any> = {}) {
    const response = await $fetch<{ row: AppRepositoryRow<T> }>('/api/repository', {
      method: 'POST',
      query: query({
        realtime: options.realtime !== false,
        ...params
      }),
      body: payload
    })
    await list()
    return response.row
  }

  async function update(id: string, payload: Partial<T>, params: Record<string, any> = {}) {
    const response = await $fetch<{ row: AppRepositoryRow<T> }>('/api/repository', {
      method: 'POST',
      query: query({
        id,
        method: 'update',
        realtime: options.realtime !== false,
        ...params
      }),
      body: payload
    })
    await list()
    return response.row
  }

  async function remove(id: string, mode: 'soft' | 'hard' = 'soft') {
    await $fetch('/api/repository', {
      method: 'POST',
      query: query({
        id,
        method: 'delete',
        mode
      })
    })
    await list()
  }

  return {
    rows,
    current,
    loading,
    error,
    list,
    get,
    create,
    update,
    remove
  }
}
