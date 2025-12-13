import { defineStore } from 'pinia'

interface User {
  id: string
  email?: string
  phone?: string
  name?: string
}

interface LoginByEmailPayload {
  email: string
  password: string
}

interface LoginByPhonePayload {
  phone: string
  password: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    isAuthenticated: false,
    isLoading: false
  }),

  getters: {
    isLoggedIn: state => state.isAuthenticated && state.user !== null
  },

  actions: {
    async loginByEmail(payload: LoginByEmailPayload) {
      this.isLoading = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))

        const mockUser: User = {
          id: '1',
          email: payload.email,
          name: 'User Name'
        }

        const mockToken = 'mock-jwt-token-' + Date.now()

        this.user = mockUser
        this.token = mockToken
        this.isAuthenticated = true

        if (import.meta.client) {
          localStorage.setItem('auth_token', mockToken)
          localStorage.setItem('user', JSON.stringify(mockUser))
        }

        return { success: true, user: mockUser }
      } catch (error) {
        this.isAuthenticated = false
        this.user = null
        this.token = null
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async loginByPhone(payload: LoginByPhonePayload) {
      this.isLoading = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))

        const mockUser: User = {
          id: '1',
          phone: payload.phone,
          name: 'User Name'
        }

        const mockToken = 'mock-jwt-token-' + Date.now()

        this.user = mockUser
        this.token = mockToken
        this.isAuthenticated = true

        if (import.meta.client) {
          localStorage.setItem('auth_token', mockToken)
          localStorage.setItem('user', JSON.stringify(mockUser))
        }

        return { success: true, user: mockUser }
      } catch (error) {
        this.isAuthenticated = false
        this.user = null
        this.token = null
        throw error
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false

      if (import.meta.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      }
    },

    initializeAuth() {
      if (import.meta.client) {
        const token = localStorage.getItem('auth_token')
        const userStr = localStorage.getItem('user')

        if (token && userStr) {
          try {
            this.token = token
            this.user = JSON.parse(userStr)
            this.isAuthenticated = true
          } catch (error) {
            this.logout()
          }
        }
      }
    }
  }
})
