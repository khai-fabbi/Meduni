import type { ApiResponse } from './common'

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  COURSE = 'COURSE',
  PAYMENT = 'PAYMENT',
  PROMOTION = 'PROMOTION',
  REVIEW = 'REVIEW',
  EXERCISE = 'EXERCISE',
  PAYMENT_INSTALLMENT = 'PAYMENT_INSTALLMENT',
  USER = 'USER',
  HAS_CERTIFICATE = 'HAS_CERTIFICATE'
}

export interface NotificationContent {
  msg_code?: string
  params?: {
    value1?: string
    value2?: string
    value3?: string
    value4?: string
    [key: string]: string | undefined
  }
}

export interface Notification {
  notification_id: string
  title: string
  content: NotificationContent
  type: NotificationType
  is_read: boolean
  is_new?: boolean
  created_at: string
  data?: Record<string, any>
  actions?: Array<{
    label: string
    action: string
    url: string
  }>
}

export interface NotificationListParams {
  mode?: string
  type?: string
  page_number?: number
  page_size?: number
}

export interface NotificationListResponse {
  data: Notification[]
  page?: {
    current: number
    total: number
    per_page: number
  }
}

export interface MarkAsReadRequest {
  notification_ids: string[]
}

export interface MarkAsReadResponse {
  success: boolean
  message?: string
}
