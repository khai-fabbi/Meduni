import { defineStore } from 'pinia'
import type { LoginRequest } from '~/types/auth'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '~/utils/auth'
import type { UserInfoResponse } from '~/types/user'
import type { ApiResponse } from '~/types/common'
import { authService } from '~/services/auth'
import { userService } from '~/services/user'
import { getAvatarUrl } from '~/utils/helpers'
import { ApiEndpoint } from '~/utils/apiEndpoint'

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
     * Fetch user info từ API
     * @param accessToken - Optional access token, nếu không có sẽ lấy từ cookie
     */
    async fetchUserInfo(accessToken?: string) {
      try {
        const token = accessToken || useCookie(ACCESS_TOKEN_KEY).value
        if (!token) {
          throw new Error('No access token available')
        }

        const { $api } = useNuxtApp()
        const response = await $api<ApiResponse<UserInfoResponse>>(
          ApiEndpoint.User.GetInfo,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (response.data) {
          const userData = response.data

          this.user = {
            ...userData,
            avatar: getAvatarUrl(userData.avatar)
          }
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error)
        throw error
      }
    },

    /**
     * Login với email hoặc phone
     */
    async login(payload: LoginRequest) {
      this.isLoading = true
      try {
        const response = await authService.login(payload)
        const loginData = response.data
        if (!loginData) {
          throw new Error('No login data received')
        }

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

        try {
          const userInfoResponse = await userService.getInfo(loginData.accessToken)

          // Cập nhật state với thông tin user
          if (userInfoResponse.data) {
            this.user = {
              ...userInfoResponse.data,
              avatar: getAvatarUrl(userInfoResponse.data.avatar)
            }
          }
          this.isAuthenticated = true
        } catch {
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
    },

    /**
     * Update cart count trong user info
     * @param delta - Số lượng thay đổi (dương để tăng, âm để giảm)
     */
    updateCartCount(delta: number) {
      if (!this.user) {
        return
      }

      const currentCount = this.user.total_cart || 0
      const newCount = Math.max(0, currentCount + delta)
      this.user.total_cart = newCount
    }
  },
  persist: true
})
