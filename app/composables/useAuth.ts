import { useAuthStore } from '~/stores/auth'

/**
 * Composable để xử lý authentication logic
 */
export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  /**
   * Kiểm tra authentication và redirect nếu chưa đăng nhập
   */
  const checkAuth = (redirectPath?: string): boolean => {
    if (!authStore.isLoggedIn) {
      // Lưu current path để redirect về sau khi login
      const currentPath = redirectPath || router.currentRoute.value.fullPath

      router.push({
        path: '/login',
        query: {
          redirect: currentPath
        }
      })

      return false
    }

    return true
  }

  /**
   * Wrapper function để bọc các function cần authentication
   * Hỗ trợ cả sync và async functions
   *
   * @example
   * // Bọc sync function
   * const protectedFn = withAuth(() => { console.log('authenticated') })
   *
   * // Bọc async function
   * const protectedAsyncFn = withAuth(async (id: string) => { await api.call(id) })
   *
   * // Với custom redirect path
   * const protectedFn = withAuth(() => { ... }, '/custom-path')
   *
   * // Sử dụng
   * protectedFn() // Sẽ redirect nếu chưa đăng nhập
   */
  function withAuth<Args extends unknown[], Return>(
    fn: (...args: Args) => Return,
    redirectPath?: string
  ): (...args: Args) => Return | undefined {
    return (...args: Args) => {
      if (!checkAuth(redirectPath)) {
        return undefined
      }
      return fn(...args)
    }
  }

  /**
   * Async version của withAuth cho các action bất đồng bộ
   * @deprecated Sử dụng withAuth thay thế, nó hỗ trợ cả sync và async
   */
  const withAuthAsync = async <T>(
    action: () => Promise<T>,
    redirectPath?: string
  ): Promise<T | null> => {
    if (!checkAuth(redirectPath)) {
      return null
    }

    return await action()
  }

  return {
    withAuth,
    withAuthAsync,
    checkAuth,
    isLoggedIn: computed(() => authStore.isLoggedIn),
    user: computed(() => authStore.user)
  }
}
