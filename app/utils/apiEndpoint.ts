const prefix = '/api/v1'

export const ApiEndpoint = {
  Auth: {
    Login: `${prefix}/auth/login`,
    Register: `${prefix}/auth/register`,
    VerifyRegister: `${prefix}/auth/register-account`,
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
  },
  Courses: {
    GetList: `${prefix}/courses`,
    GetDetail: (courseId: string) => `${prefix}/courses/${courseId}`,
    GetMyCourses: `${prefix}/user/courses`,
    GetCertificate: (myCourseId: string) => `${prefix}/${myCourseId}/certificate`,
    GetCertificates: `${prefix}/user/certificates`,
    GetCategories: `${prefix}/categories`,
    GetLessonDetail: (myCourseId: string, lessonId: string) =>
      `${prefix}/user/courses/${myCourseId}/lessons/${lessonId}`
  },
  User: {
    GetInfo: `${prefix}/user/info`,
    UpdateInfo: `${prefix}/user/update-info`,
    UpdatePassword: `${prefix}/user/update-password`,
    GetCountries: `${prefix}/user/country`,
    ReferralInfo: `${prefix}/user/referral/info`
  },
  Common: {
    UploadPreSignedUrl: `${prefix}/common/upload-pre-signed-url`
  },
  Notifications: {
    GetList: `${prefix}/notifications`,
    GetDetail: (notificationId: string) => `${prefix}/notifications/${notificationId}`,
    MarkAsRead: `${prefix}/notifications/read`
  },
  Cart: {
    GetList: `${prefix}/cart`,
    Add: `${prefix}/cart`,
    Update: `${prefix}/cart`,
    Delete: `${prefix}/cart`,
    Estimate: `${prefix}/cart/est-cart`,
    ApplyDiscount: `${prefix}/packages/apply-discount`
  },
  Payment: {
    SePayTransaction: `${prefix}/sepay/transaction`,
    SePayTransactionStatus: (transactionId: string) => `${prefix}/sepay/transaction/${transactionId}/status`
  }
}
