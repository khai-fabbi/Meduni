/**
 * Authentication Types
 */

export interface LoginRequest {
  email?: string
  phone?: string
  password: string
}

export interface LoginResponse {
  userId: string
  user_name: string
  email: string
  accessToken: string
  refreshToken: string
  total_cart: string
  total_notification: string
}

export interface RegisterRequest {
  email: string
  phone: string
  password: string
  user_name: string
}

export type RegisterResponse = boolean

export interface VerifyRegisterRequest {
  otp: string
}

export type VerifyRegisterResponse = boolean

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export interface ForgotPasswordRequest {
  email?: string
  phone?: string
}

export type ForgotPasswordResponse = Record<string, never>

export interface ResetPasswordVerifyRequest {
  token: string
  otp: string
  phone?: string
  email?: string
}

export type ResetPasswordVerifyResponse = boolean

export interface ResetPasswordRequest {
  newPassword: string
  confirmPassword: string
  token: string
}

export interface ResetPasswordResponse {
  userId: string
  user_name: string
  email: string
}

export type LogoutResponse = boolean

export interface ResendOtpRequest {
  phone?: string
  email?: string
  otpType: 'register' | 'reset_password'
}

export type ResendOtpResponse = boolean
