export default defineNuxtRouteMiddleware((to, _from) => {
  const accessToken = useCookie(ACCESS_TOKEN_KEY).value

  // Nếu đã đăng nhập
  if (accessToken) {
    // Kiểm tra xem có redirect query không
    const redirectPath = to.query.redirect as string

    // Nếu có redirect, chuyển về trang đó, không thì về trang chủ
    return navigateTo(redirectPath || '/')
  }
})
