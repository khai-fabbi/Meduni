/**
 * User Profile Types
 */

export interface UserInfoResponse {
  userId: string
  user_name: string
  email: string
  phone: string
  country_number?: string
  avatar: string
  gender: number // 0 = undefined, 1 = Female, 2 = Male
  birthday: number // Unix timestamp
  address: string
  country: string
  province: string
  district: string
  user_target?: string // Goal của user
  customer_id?: number
  partition_key?: number
  business_staff_name?: string
  consultants_name?: string
  customer_care_staff_name?: string
  total_cart?: number
  user_pending_gifts?: string[]
  favorite_courses?: string[]
}

export interface UpdateUserInfoRequest {
  user_id?: string
  user_name?: string
  phone?: string
  avatar?: string
  gender?: number
  birthday?: number // Unix timestamp in seconds
  address?: string
  country?: string
  country_number?: string
  province?: string
  district?: string
  user_target?: string // Goal của user
}

export interface UpdateUserInfoResponse {
  userId: string
  user_name: string
  email: string
}

export interface UpdatePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface UpdatePasswordResponse {
  userId: string
  user_name: string
  email: string
}

export interface CountryResponse {
  country_code: string
  country_name: string
  provinces: ProvinceResponse[]
}

export interface ProvinceResponse {
  province_code: string
  province_name: string
  districts: DistrictResponse[]
}

export interface DistrictResponse {
  district_code: string
  district_name: string
}

export interface UploadPreSignedUrlResponse {
  request_id: string
  data: {
    url: string
    fields: {
      bucket: string
      key: string
      policy: string
      x_amz_algorithm: string
      x_amz_credential: string
      x_amz_date: string
      x_amz_signature: string
    }
  }
}
