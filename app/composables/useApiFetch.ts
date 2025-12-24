import type { UseFetchOptions } from '#app'
import type { FetchError } from 'ofetch'

interface CustomError {
  message: string
  statusCode: number
}

/**
 * Custom composable to wrap `useFetch` with default options for your API.
 * @param url API endpoint, for example: '/users'
 * @param options useFetch options
 */
export function useApiFetch<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {}
) {
  const config = useRuntimeConfig()

  // Creating default options
  const defaults: UseFetchOptions<T> = {
    // Setting baseURL for plugin interceptors to work
    baseURL: config.public.apiUrl as string,

    $fetch: useNuxtApp().$api as typeof $fetch

    // Automatically refresh when the token changes (example)
    // watch: [useCookie(COOKIE_KEYS.ACCESS_TOKEN)],

    // You can add other default options here
  }

  // Merging default options and user-provided options
  const params = { ...defaults, ...options }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useFetch<T, FetchError<CustomError>>(url, params as any)
}
