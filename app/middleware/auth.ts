export default defineNuxtRouteMiddleware((to, _from) => {
  const accessToken = useCookie(ACCESS_TOKEN_KEY).value
  if (!accessToken && to.path !== '/login') {
    return navigateTo('/login')
  }
})
