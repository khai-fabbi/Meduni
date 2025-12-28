import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyRegisterRequest,
  VerifyRegisterResponse,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordVerifyRequest,
  ResetPasswordVerifyResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  LogoutResponse,
  ResendOtpRequest,
  ResendOtpResponse
} from '~/types/auth'
import type { ApiResponse } from '~/types/common'

export const authService = {
  /**
   * Đăng nhập
   * @param payload - Email hoặc phone + password
   */
  login: async (payload: LoginRequest) => {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<LoginResponse>>(ApiEndpoint.Auth.Login, {
      method: 'POST',
      body: payload
    })
  },

  /**
   * Đăng ký
   * @param payload - Thông tin đăng ký
   */
  register: async (payload: RegisterRequest) => {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<RegisterResponse>>(ApiEndpoint.Auth.Register, {
      method: 'POST',
      body: payload
    })
  },

  /**
   * Xác thực đăng ký
   * @param params - OTP từ SMS/Email
   */
  verifyRegister: async (params: VerifyRegisterRequest) => {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<VerifyRegisterResponse>>(
      `${ApiEndpoint.Auth.VerifyRegister}?token=${params.token}`,
      {
        method: 'GET'
      }
    )
  },

  /**
   * Refresh token
   * Token sẽ được tự động lấy từ cookie (refresh token)
   */
  refreshToken: async () => {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<RefreshTokenResponse>>(
      ApiEndpoint.Auth.RefreshToken,
      {
        method: 'GET'
      }
    )
  },

  /**
   * Quên mật khẩu
   * @param payload - Email hoặc phone
   */
  forgotPassword: async (payload: ForgotPasswordRequest) => {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<ForgotPasswordResponse>>(
      ApiEndpoint.Auth.ForgotPassword,
      {
        method: 'POST',
        body: payload
      }
    )
  },

  /**
   * Xác thực reset mật khẩu (verify OTP)
   * @param params - Token, OTP, và email/phone
   */
  resetPasswordVerify: async (params: ResetPasswordVerifyRequest) => {
    const { $api } = useNuxtApp()
    const queryParams = new URLSearchParams({
      token: params.token
    })
    if (params.phone) queryParams.append('phone', params.phone)
    if (params.email) queryParams.append('email', params.email)

    return $api<ApiResponse<ResetPasswordVerifyResponse>>(
      `${ApiEndpoint.Auth.ResetPasswordVerify}?${queryParams.toString()}`,
      {
        method: 'GET'
      }
    )
  },

  /**
   * Reset mật khẩu
   * @param payload - Mật khẩu mới và token
   */
  resetPassword: async (payload: ResetPasswordRequest) => {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<ResetPasswordResponse>>(
      ApiEndpoint.Auth.ResetPassword,
      {
        method: 'POST',
        body: payload
      }
    )
  },

  /**
   * Đăng xuất
   * Token sẽ được tự động lấy từ cookie
   */
  logout: async () => {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<LogoutResponse>>(ApiEndpoint.Auth.Logout, {
      method: 'POST'
    })
  },

  /**
   * Gửi lại OTP
   * @param params - Phone/Email và loại OTP
   */
  resendOtp: async (params: ResendOtpRequest) => {
    const { $api } = useNuxtApp()
    const queryParams = new URLSearchParams({
      otpType: params.otpType
    })
    if (params.phone) queryParams.append('phone', params.phone)
    if (params.email) queryParams.append('email', params.email)

    return $api<ApiResponse<ResendOtpResponse>>(
      `${ApiEndpoint.Auth.ResendOtp}?${queryParams.toString()}`,
      {
        method: 'GET'
      }
    )
  }
}
