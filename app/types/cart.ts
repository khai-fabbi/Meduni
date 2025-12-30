/**
 * Cart Types
 */

export interface CartApiItem {
  amount: number
  cart_id: string
  cart_status: number
  category_id: string
  category_name: string
  chapter_count: number
  course_id: string
  course_name: string
  course_price: number
  course_status: number
  created_at: string
  effective_duration: number[]
  expire_time: number
  gifts: unknown[]
  is_vip: boolean
  payment_method: string
  rate_avg: number
  study_duration: number
  teacher_name: string
  thumbnail: string
  total_price: number
  total_rate: number
}

export interface CartListData {
  total: number
  carts: CartApiItem[]
}

export interface CartListResponse {
  data: CartListData
}

export interface CartEstimateResponse {
  subtotal: number
  discount: number
  coupon_discount: number
  total: number
  items: Array<{
    cart_id: string
    course_name: string
    original_price: number
    discount_price: number
  }>
}

export interface CartApplyDiscountRequest {
  cart_ids: string[]
  discount_code: string
}

export interface CartApplyDiscountResponse {
  cart_ids: string[]
  original_price: number
  promotional_price: number
  discount_code: string
  discount_percentage: number
  discount_amount: number
  final_price: number
  is_valid: boolean
}

/**
 * Invoice Info cho VAT
 */
export interface InvoiceInfo {
  tax_code: string // Mã số thuế (max 30 chars)
  email: string // Email nhận hóa đơn (max 255 chars, email format)
  name: string // Tên doanh nghiệp/cá nhân (max 255 chars)
  delivery_address: string // Địa chỉ nhận hóa đơn VAT (max 255 chars)
  address: string // Địa chỉ doanh nghiệp/cá nhân (max 255 chars)
}

/**
 * Request body cho SePay transaction
 */
export interface SePayTransactionRequest {
  language: 'vn' | 'en'
  carts: string[] // Array of cart_ids
  invoice_info?: InvoiceInfo // Optional, chỉ khi requestVATInvoice = true
}

/**
 * Bank Account từ API response
 */
export interface BankAccount {
  id: string
  account_holder_name: string
  account_number: string
  bank_full_name: string
  bank_short_name: string
  bank_code: string
  bank_bin: string
  label: string
  active: string
  accumulated: string
  last_transaction: string
  created_at: string
}

/**
 * Response từ SePay transaction API
 */
export interface SePayTransactionResponse {
  transaction_id: string
  payment_url?: string
  qr_code_url?: string
  qr_code_data?: string
  total_amount: number
  currency: string
  payment_status: string
  total_course: number
  discount: number
  bank_accounts: BankAccount[]
  created_at: string
}

/**
 * Payment Status Enum
 * 0: đang xử lý (PENDING)
 * 1: thành công (SUCCESS)
 * 2: thất bại (FAILED)
 */
export enum PaymentStatus {
  PENDING = 0,
  SUCCESS = 1,
  FAILED = 2
}

/**
 * Transaction status response
 */
export interface TransactionStatusResponse {
  transaction_id: string
  payment_status: PaymentStatus // 0: đang xử lý, 1: thành công, 2: thất bại
  amount?: number
  total_amount?: number
  created_at: string
  updated_at?: string
}
