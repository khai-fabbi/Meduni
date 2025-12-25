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
      const authToken = useCookie(ACCESS_TOKEN_KEY).value
      if (authToken) {
        options.headers.set('Authorization', `Bearer ${authToken}`)
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
