import { defineNuxtPlugin } from '#app'

const TIME_OUT = 30 * 1000
export default defineNuxtPlugin((_nuxtApp) => {
  const toast = useToast()
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiUrl as string

  const apiFetcher = $fetch.create({
    baseURL: apiBaseUrl,
    timeout: TIME_OUT,
    // headers: {
    //   'Content-Type': 'application/json'
    // },
    onRequest({ options }) {
      const existingAuth = options.headers?.get('Authorization')
      if (!existingAuth) {
        const authToken = useCookie(ACCESS_TOKEN_KEY).value
        if (authToken) {
          options.headers = options.headers || new Headers()
          options.headers.set('Authorization', `Bearer ${authToken}`)
        }
      }

      if (options.body && ['POST', 'PUT', 'PATCH'].includes(options.method || '')) {
        if (!options.headers?.get('Content-Type')) {
          options.headers = options.headers || new Headers()
          options.headers.set('Content-Type', 'application/json')
        }
      }
    },
    async onResponseError({ response, request, options }) {
      switch (response.status) {
        case HttpCode.UNAUTHORIZED:

          console.log('request:', request, options)
          // removeAccessToken()
          if (import.meta.client) {
            authStore.logout()
          }
          // await _nuxtApp.runWithContext(() => navigateTo('/'))
          break
        default:
          break
      }
    },

    onRequestError({ error }) {
      console.error('Request error:', error)
      toast.add({
        title: 'Request error',
        description: 'Request error',
        color: 'error'
      })
    }
  })

  // Provide the configured instance to the entire application
  return {
    provide: {
      api: apiFetcher
    }
  }
})
