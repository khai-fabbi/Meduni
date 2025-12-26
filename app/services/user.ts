import type {
  UserInfoResponse,
  UpdateUserInfoRequest,
  UpdateUserInfoResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  CountryResponse,
  UploadPreSignedUrlResponse
} from '~/types/user'
import type { ApiResponse } from '~/types/common'

/**
 * Format date theo chuẩn AWS X-Amz-Date: YYYYMMDDTHHMMSSZ
 * @param date - Date object (mặc định là hiện tại)
 * @returns String format: 20251226T082211Z
 */
function formatAmzDate(date: Date = new Date()): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
}
export const userService = {
  /**
   * Lấy thông tin người dùng
   */
  getInfo: async () => {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<UserInfoResponse>>(ApiEndpoint.User.GetInfo, {
      method: 'GET'
    })
  },

  /**
   * Cập nhật thông tin người dùng
   * @param payload - Thông tin cần cập nhật
   */
  updateInfo: async (payload: UpdateUserInfoRequest) => {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<UpdateUserInfoResponse>>(
      ApiEndpoint.User.UpdateInfo,
      {
        method: 'POST',
        body: payload
      }
    )
  },

  /**
   * Đổi mật khẩu
   * @param payload - Mật khẩu hiện tại và mật khẩu mới
   */
  updatePassword: async (payload: UpdatePasswordRequest) => {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<UpdatePasswordResponse>>(
      ApiEndpoint.User.UpdatePassword,
      {
        method: 'POST',
        body: payload
      }
    )
  },

  /**
   * Lấy danh sách quốc gia, tỉnh thành, quận huyện
   */
  getCountries: async () => {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<CountryResponse[]>>(ApiEndpoint.User.GetCountries, {
      method: 'GET'
    })
  },

  /**
   * Lấy pre-signed URL để upload avatar
   * @param fileType - Loại file (png, jpg, etc.)
   * @param fileName - Tên file (optional)
   */
  getUploadPreSignedUrl: async (fileType: string, fileName?: string) => {
    const { $api } = useNuxtApp()
    const params = new URLSearchParams({
      type: 'avatar',
      file_type: fileType
    })
    if (fileName) {
      params.append('file_name', fileName)
    }

    return $api<ApiResponse<UploadPreSignedUrlResponse['data']>>(
      `${ApiEndpoint.Common.UploadPreSignedUrl}?${params.toString()}`,
      {
        method: 'GET'
      }
    )
  },

  /**
   * Upload file lên S3 sử dụng pre-signed URL với POST multipart/form-data
   * @param file - File cần upload
   * @param uploadData - Dữ liệu từ pre-signed URL API (url và fields object)
   */
  uploadFileToS3: async (file: File, uploadData: UploadPreSignedUrlResponse['data']) => {
    const { url, fields } = uploadData

    if (!url || !fields) {
      throw new Error('Missing url or fields in pre-signed response')
    }

    const formData = new FormData()

    const amzDate = formatAmzDate()

    // Append các fields từ response (keys là lowercase với underscore)
    formData.append('key', fields.key)
    formData.append('policy', fields.policy)
    formData.append('X-Amz-Algorithm', fields.x_amz_algorithm)
    formData.append('X-Amz-Credential', fields.x_amz_credential)
    formData.append('X-Amz-Date', amzDate)
    formData.append('X-Amz-Signature', fields.x_amz_signature)

    // Content-Type cho file (image/png hoặc image/jpeg)
    const contentType = file.type || (file.name.endsWith('.png') ? 'image/png' : 'image/jpeg')
    formData.append('Content-Type', contentType)

    // Append file cuối cùng
    formData.append('file', file)

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to upload file to S3: ${response.status} ${response.statusText}. ${errorText}`)
    }

    return response
  },

  /**
   * Upload avatar (tổng hợp: lấy pre-signed URL và upload lên S3)
   * @param file - File avatar cần upload
   * @returns Key của file đã upload (ví dụ: "public/avatar/xxx.png")
   */
  uploadAvatar: async (file: File): Promise<string> => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'png'
    const fileType = fileExtension === 'jpg' || fileExtension === 'jpeg' ? 'jpg' : 'png'

    const preSignedResponse = await userService.getUploadPreSignedUrl(fileType, file.name)
    const responseData = preSignedResponse.data

    console.log('Pre-signed URL response:', responseData)

    // Validate response structure
    if (!responseData.url || !responseData.fields) {
      console.error('Invalid pre-signed URL response:', responseData)
      throw new Error('Invalid pre-signed URL response: missing url or fields')
    }

    // Validate các fields bắt buộc trong fields object (không cần x_amz_date vì sẽ tự generate)
    const { fields } = responseData
    if (!fields.key || !fields.policy || !fields.x_amz_algorithm || !fields.x_amz_credential || !fields.x_amz_signature) {
      console.error('Invalid fields in pre-signed URL response:', fields)
      throw new Error('Invalid pre-signed URL response: missing required fields')
    }
    await userService.uploadFileToS3(file, responseData)

    return fields.key
  }
}
