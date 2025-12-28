import { defineStore } from 'pinia'
import type { LoginRequest } from '~/types/auth'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '~/utils/auth'
import { authService } from '~/services/auth'
import { userService } from '~/services/user'
import { getAvatarUrl } from '~/utils/helpers'
import type { UserInfoResponse } from '~/types/user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as UserInfoResponse | null,
    isAuthenticated: false,
    isLoading: false
  }),

  getters: {
    isLoggedIn: state => state.isAuthenticated && state.user !== null
  },
  actions: {
    /**
     * Login với email hoặc phone
     */
    async login(payload: LoginRequest) {
      this.isLoading = true
      try {
        const response = await authService.login(payload)
        const loginData = response.data
        if (loginData) {
          // Lưu token vào cookie
          const accessTokenCookie = useCookie(ACCESS_TOKEN_KEY, {
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7 // 7 days
          })
          accessTokenCookie.value = loginData.accessToken

          const refreshTokenCookie = useCookie(REFRESH_TOKEN_KEY, {
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30 // 30 days
          })
          refreshTokenCookie.value = loginData.refreshToken

          const userInfoResponse = await userService.getInfo(loginData.accessToken)

          // Cập nhật state với thông tin user
          if (userInfoResponse.data) {
            this.user = {
              ...userInfoResponse.data,
              avatar: getAvatarUrl(userInfoResponse.data.avatar)
            }
          }
          this.isAuthenticated = true
        }

        return { success: true, user: this.user }
      } catch (error) {
        this.isAuthenticated = false
        this.user = null
        // Clear cookies nếu có lỗi
        const accessTokenCookie = useCookie(ACCESS_TOKEN_KEY)
        accessTokenCookie.value = null
        const refreshTokenCookie = useCookie(REFRESH_TOKEN_KEY)
        refreshTokenCookie.value = null
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      this.isLoading = true
      try {
        if (this.isAuthenticated) {
          await authService.logout()
        }
      } catch (error) {
        console.error('Logout error:', error)
        this.user = null
        this.isAuthenticated = false

        // Clear cookies
        removeToken()
      } finally {
        // Clear state
        this.user = null
        this.isAuthenticated = false

        // Clear cookies
        removeToken()

        this.isLoading = false
      }
    }
  },
  persist: true
})
