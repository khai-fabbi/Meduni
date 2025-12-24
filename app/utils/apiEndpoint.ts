const prefix = '/api/v1'

export const ApiEndpoint = {
  Auth: {
    Login: `${prefix}/auth/login`,
    Register: `${prefix}/auth/register`,
    VerifyRegister: `${prefix}/auth/verify-register`,
    RefreshToken: `${prefix}/auth/refresh-token`,
    ForgotPassword: `${prefix}/auth/forgot-password`,
    ResetPassword: `${prefix}/auth/reset-password`,
    ResetPasswordVerify: `${prefix}/auth/reset-password`,
    Logout: `${prefix}/auth/logout`,
    ResendOtp: `${prefix}/auth/resend-otp`
  },
  Profile: {
    GetProfile: `${prefix}/profile`
  },
  Contact: {
    GetContact: `${prefix}/contact`,
    PostContact: `${prefix}/contact`
  },
  News: {
    GetList: `${prefix}/news`,
    GetDetail: (newsId: string) => `${prefix}/news/${newsId}`,
    MostViewed: `${prefix}/news/most-viewed`,
    Latest: `${prefix}/news/latest`
  }
}
