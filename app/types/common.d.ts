export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T>
  & U[keyof U]

export type ResultResponse<D> = {
  code?: HttpCode
  message?: string
  data: D
}
export type ErrorResponse<D> = {
  error: {
    code: HttpCode
    message: D
  }
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  request_id: string
  data: T
  error?: {
    code: string
    message: string
  }
}
