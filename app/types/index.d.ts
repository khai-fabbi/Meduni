import type { ParsedContent } from '@nuxt/content'
import type { Avatar, Badge, Link } from '#ui/types'

export interface BlogPost extends ParsedContent {
  title: string
  description: string
  date: string
  image?: HTMLImageElement
  badge?: Badge
  authors?: ({
    name: string
    description?: string
    avatar: Avatar
  } & Link)[]
}

// Re-export auth types for easier imports
export type {
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
} from './auth'

// Re-export common types
export type { ApiResponse } from './common'

// Re-export news types
export type { News, ListNews } from './news'
