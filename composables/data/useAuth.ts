import type { CreateUserPayload, UserItem } from '~/types/rbac'

type AuthResponse = {
  data: UserItem
  message: string
}

export function useAuth() {
  const runtime = useRuntimeConfig()

  const tenantSlug = computed(() => {
    return String(runtime.public.clientName || 'martopuro')
      .trim()
      .toLowerCase()
  })

  const user = useState<UserItem | null>('auth:user', () => null)
  const pending = ref(false)
  const errorMessage = ref('')

  const isLoggedIn = computed(() => Boolean(user.value))
  const roles = computed(() => user.value?.roles || [])
  const permissions = computed(() => user.value?.permissions || [])

  function hasRole(roleCode: string) {
    return roles.value.some((role) => role.roleCode === roleCode)
  }

  function can(permissionCode: string) {
    return permissions.value.includes(permissionCode)
  }

  async function fetchMe() {
    try {
      const response = await $fetch<{ data: UserItem }>('/api/auth/me')
      user.value = response.data
      return response.data
    } catch {
      user.value = null
      return null
    }
  }

  async function login(payload: {
    email: string
    password: string
  }) {
    pending.value = true
    errorMessage.value = ''

    try {
      const response = await $fetch<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: {
          ...payload,
          tenantSlug: tenantSlug.value
        }
      })

      user.value = response.data

      return response.data
    } catch (error: any) {
      errorMessage.value =
        error?.data?.statusMessage ||
        error?.statusMessage ||
        'Login gagal. Periksa email dan password.'

      throw error
    } finally {
      pending.value = false
    }
  }

  async function register(payload: CreateUserPayload) {
    pending.value = true
    errorMessage.value = ''

    try {
      const response = await $fetch<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: {
          ...payload,
          tenantSlug: tenantSlug.value
        }
      })

      user.value = response.data

      return response.data
    } catch (error: any) {
      errorMessage.value =
        error?.data?.statusMessage ||
        error?.statusMessage ||
        'Registrasi gagal.'

      throw error
    } finally {
      pending.value = false
    }
  }

  async function logout() {
    await $fetch('/api/auth/logout', {
      method: 'POST'
    })

    user.value = null

    await navigateTo('/login')
  }

  return {
    tenantSlug,
    user,
    pending,
    errorMessage,

    isLoggedIn,
    roles,
    permissions,

    hasRole,
    can,

    fetchMe,
    login,
    register,
    logout
  }
}