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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async onResponseError({ response, request, options }) {
      const isLoginPath = request.toString().endsWith('/auth/login')
      if (response.status === HttpCode.NOT_FOUND) {
        // throw createError({
        //   statusCode: HttpCode.NOT_FOUND,
        //   statusMessage: 'Không tìm thấy dữ liệu',
        //   fatal: true
        // })
      } else if (response.status === HttpCode.UNAUTHORIZED && !isLoginPath) {
        console.log('request:: ', request)
        console.log('response:: ', response)

        removeToken()
        if (import.meta.client) {
          authStore.logout()
        }
        await _nuxtApp.runWithContext(() => navigateTo('/'))
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
