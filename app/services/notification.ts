import type {
  Notification,
  NotificationListParams,
  MarkAsReadRequest,
  MarkAsReadResponse
} from '~/types/notification'
import type { ApiResponse } from '~/types/common'
import { ACCESS_TOKEN_KEY } from '~/utils/auth'

export const notificationService = {
  /**
   * Lấy danh sách thông báo
   * @param params - Tham số phân trang và lọc
   */
  getList: async (params?: NotificationListParams) => {
    const config = useRuntimeConfig()
    const searchApiUrl = config.public.apiSearchEndpoint as string

    if (!searchApiUrl) {
      throw new Error('NUXT_PUBLIC_API_SEARCH_ENDPOINT is not configured')
    }

    const queryParams = new URLSearchParams()

    if (params?.mode) {
      queryParams.append('mode', params.mode)
    }
    if (params?.type) {
      queryParams.append('type', params.type)
    }
    if (params?.page_number) {
      queryParams.append('page_number', params.page_number.toString())
    }
    if (params?.page_size) {
      queryParams.append('page_size', params.page_size.toString())
    }

    const endpointPath = ApiEndpoint.Notifications.GetList.replace('/api/v1', '')
    const url = queryParams.toString()
      ? `${endpointPath}?${queryParams.toString()}`
      : endpointPath

    // Use search API endpoint instead of regular API endpoint
    return $fetch<ApiResponse<Notification[]>>(url, {
      baseURL: searchApiUrl,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${useCookie(ACCESS_TOKEN_KEY).value || ''}`
      }
    })
  },

  /**
   * Lấy chi tiết thông báo
   * @param notificationId - ID thông báo
   */
  getDetail: async (notificationId: string) => {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Notification>>(
      ApiEndpoint.Notifications.GetDetail(notificationId),
      {
        method: 'GET'
      }
    )
  },

  /**
   * Đánh dấu thông báo đã đọc
   * @param notificationIds - Danh sách ID thông báo
   */
  markAsRead: async (notificationIds: string[]) => {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<MarkAsReadResponse>>(
      ApiEndpoint.Notifications.MarkAsRead,
      {
        method: 'POST',
        body: {
          notification_ids: notificationIds
        } as MarkAsReadRequest
      }
    )
  }
}
