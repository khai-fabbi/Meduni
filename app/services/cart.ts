import type {
  CartListData,
  CartEstimateResponse,
  CartApplyDiscountResponse,
  SePayTransactionRequest,
  SePayTransactionResponse,
  TransactionStatusResponse
} from '~/types/cart'
import type { CoursesList } from '~/types/course'
import type { ApiResponse } from '~/types/common'
import { ApiEndpoint } from '~/utils/apiEndpoint'

export const cartService = {
  /**
   * Lấy danh sách giỏ hàng
   */
  getList: async () => {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<CartListData>>(ApiEndpoint.Cart.GetList, {
      method: 'GET'
    })
  },

  /**
   * Thêm khóa học vào giỏ hàng
   * @param courseId - ID khóa học cần thêm
   */
  addToCart: async (courseId: string) => {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<any>>(ApiEndpoint.Cart.Add, {
      method: 'POST',
      body: {
        course_info: [
          {
            course_id: courseId
          }
        ]
      }
    })
  },

  /**
   * Áp dụng mã giảm giá cho cart
   * Sử dụng API /v1/cart/apply-discount với cart_ids và discount_code
   */
  applyDiscount: async (cartIds: string[], discountCode: string) => {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<CartApplyDiscountResponse>>(ApiEndpoint.Cart.ApplyDiscount, {
      method: 'POST',
      body: {
        cart_ids: cartIds,
        discount_code: discountCode
      }
    })
  },

  /**
   * Ước tính giỏ hàng với mã giảm giá
   */
  estimateCart: async (cartIds: string[], couponCode?: string) => {
    const { $api } = useNuxtApp()
    const query: Record<string, string> = {
      cart_ids: cartIds.join(',')
    }
    if (couponCode) {
      query.coupon_code = couponCode
    }
    return $api<ApiResponse<CartEstimateResponse>>(ApiEndpoint.Cart.Estimate, {
      method: 'GET',
      query
    })
  },

  /**
   * Lấy danh sách khóa học thường được mua kèm
   */
  getRecommendedCourses: async () => {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<CoursesList>>(ApiEndpoint.Courses.GetList, {
      method: 'GET',
      query: {
        page_number: 1,
        page_size: 8,
        sort: 1 // Sắp xếp theo tổng mua (phổ biến nhất)
      }
    })
  },

  /**
   * Tạo giao dịch thanh toán SePay
   * @param request - Thông tin transaction request
   */
  createSePayTransaction: async (request: SePayTransactionRequest) => {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<SePayTransactionResponse>>(ApiEndpoint.Payment.SePayTransaction, {
      method: 'POST',
      body: request
    })
  },

  /**
   * Kiểm tra trạng thái giao dịch
   * Chỉ dùng API sepay/transaction/{id}/status
   * @param transactionId - ID giao dịch
   */
  getTransactionStatus: async (transactionId: string) => {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<TransactionStatusResponse>>(
      ApiEndpoint.Payment.SePayTransactionStatus(transactionId),
      {
        method: 'GET'
      }
    )
  },

  /**
   * Xóa sản phẩm khỏi giỏ hàng
   * Sử dụng PUT với amount: 0 để xóa item
   * @param cartId - ID giỏ hàng cần xóa
   */
  deleteItem: async (cartId: string) => {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<{ carts: unknown[], count: number }>>(ApiEndpoint.Cart.Update, {
      method: 'PUT',
      body: {
        cart_id: cartId,
        amount: 0
      }
    })
  }
}
