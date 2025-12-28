export const ACCESS_TOKEN_KEY = 'access_token'
export const REFRESH_TOKEN_KEY = 'refresh_token'
export const EXPIRES_IN_KEY = 'expires_in'

export enum ERROR_TYPE {
  INPUT_ERROR = 'INPUT_ERROR'
}

export enum REGISTER_ERROR_CODES {
  ERROR2_215 = 'ERROR2_215',
  ERROR2_216 = 'ERROR2_216'
}

export function removeToken() {
  const accessToken = useCookie(ACCESS_TOKEN_KEY)
  accessToken.value = null
  const refreshToken = useCookie(REFRESH_TOKEN_KEY)
  refreshToken.value = null
}
