import { defineStore } from 'pinia'
import type { LoginRequest } from '~/types/auth'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '~/utils/auth'
import { authService } from '~/services/auth'

interface User {
  userId: string
  user_name: string
  email: string
  phone?: string
  avatar?: string
  total_cart?: string
  total_notification?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    accessToken: null as string | null,
    refreshToken: null as string | null,
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

        // Lưu user profile
        const user: User = {
          userId: loginData.userId,
          user_name: loginData.user_name,
          email: loginData.email,
          total_cart: loginData.total_cart,
          total_notification: loginData.total_notification
        }

        // Lưu tokens vào cookie
        const accessTokenCookie = useCookie(ACCESS_TOKEN_KEY, {
          secure: true,
          sameSite: 'strict'
        })
        const refreshTokenCookie = useCookie(REFRESH_TOKEN_KEY, {
          secure: true,
          sameSite: 'strict'
        })

        accessTokenCookie.value = loginData.accessToken
        refreshTokenCookie.value = loginData.refreshToken

        // Cập nhật state
        this.user = user
        this.accessToken = loginData.accessToken
        this.refreshToken = loginData.refreshToken
        this.isAuthenticated = true

        return { success: true, user }
      } catch (error) {
        this.isAuthenticated = false
        this.user = null
        this.accessToken = null
        this.refreshToken = null
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        if (this.accessToken) {
          await authService.logout()
        }
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        // Clear state
        this.user = null
        this.accessToken = null
        this.refreshToken = null
        this.isAuthenticated = false

        // Clear cookies
        const accessTokenCookie = useCookie(ACCESS_TOKEN_KEY)
        const refreshTokenCookie = useCookie(REFRESH_TOKEN_KEY)
        accessTokenCookie.value = null
        refreshTokenCookie.value = null
      }
    },

    initializeAuth() {
      const accessTokenCookie = useCookie(ACCESS_TOKEN_KEY)
      const refreshTokenCookie = useCookie(REFRESH_TOKEN_KEY)

      if (accessTokenCookie.value && refreshTokenCookie.value) {
        this.accessToken = accessTokenCookie.value
        this.refreshToken = refreshTokenCookie.value
        // Note: User profile should be fetched from API if needed
        // For now, we'll keep isAuthenticated as false until user profile is loaded
        this.isAuthenticated = !!this.accessToken
      }
    }
  }
})
