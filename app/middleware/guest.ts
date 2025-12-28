export default defineNuxtRouteMiddleware((_to, _from) => {
  const accessToken = useCookie(ACCESS_TOKEN_KEY).value

  // Nếu đã đăng nhập, redirect về trang chủ
  if (accessToken) {
    return navigateTo('/')
  }
})
