import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '~/utils/auth'
import { userService } from '~/services/user'
import { getAvatarUrl } from '~/utils/helpers'

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  const accessTokenCookie = useCookie(ACCESS_TOKEN_KEY)

  // Nếu có token trong cookie nhưng chưa có user info (sau khi F5)
  // hoặc user info đã bị clear, thì fetch lại
  if (accessTokenCookie.value) {
    // Nếu chưa có user hoặc user đã bị clear, fetch lại
    if (!authStore.user) {
      try {
        const response = await userService.getInfo()
        console.log('response:', response)
        if (response.data) {
          const userData = response.data
          authStore.user = {
            ...userData,
            avatar: getAvatarUrl(userData.avatar)
          }
          authStore.isAuthenticated = true
        }
      } catch (error) {
        // Token không hợp lệ hoặc đã hết hạn, clear state và cookie
        console.error('Failed to fetch user info on init:', error)
        authStore.user = null
        authStore.isAuthenticated = false
        accessTokenCookie.value = null
        const refreshTokenCookie = useCookie(REFRESH_TOKEN_KEY)
        refreshTokenCookie.value = null
      }
    } else {
      // Đã có user từ persisted state, chỉ cần đảm bảo isAuthenticated = true
      authStore.isAuthenticated = true
    }
  } else {
    // Không có token, clear state (trường hợp user đã logout ở tab khác)
    if (authStore.user || authStore.isAuthenticated) {
      authStore.user = null
      authStore.isAuthenticated = false
    }
  }
})
