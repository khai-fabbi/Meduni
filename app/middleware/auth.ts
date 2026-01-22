export default defineNuxtRouteMiddleware((to, _from) => {
  const accessToken = useCookie(ACCESS_TOKEN_KEY).value

  if (!accessToken && to.path !== '/login') {
    // Lưu current path vào query redirect để quay lại sau khi login
    return navigateTo({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    })
  }
})
