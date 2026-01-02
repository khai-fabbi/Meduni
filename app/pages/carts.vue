<script setup lang="ts">
import type { CartItem } from '~/components/shared/Cart.vue'
import type { BreadcrumbItem } from '@nuxt/ui'
import type { CartApiItem, SePayTransactionResponse, InvoiceInfo } from '~/types/cart'
import { PaymentStatus } from '~/types/cart'
import type { Course } from '~/types/course'
import type { CommissionRates } from '~/types/referral'
import { cartService } from '~/services/cart'
import { coursesService } from '~/services/courses'
import { userService } from '~/services/user'
import { getLinkFromS3, formatDuration } from '~/utils/helpers'
import CourseCard from '~/components/course/CourseCard.vue'
// TODO: Mã giảm giá - tạm thời comment vì chưa cần dùng
// import DiscountTagIcon from '~/assets/icons/discount-tag.svg'
import ScanIcon from '~/assets/icons/scan.svg'

definePageMeta({
  middleware: 'auth'
})

useSeoMeta({
  title: 'Giỏ hàng',
  description: 'Giỏ hàng của bạn'
})

const items = ref<BreadcrumbItem[]>([
  {
    label: 'Trang chủ',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: 'Giỏ hàng',
    to: '#'
  }
])

const isLoading = ref(true)
const isLoadingRecommendedCourses = ref(true)
const cartItems = ref<CartItem[]>([])
const cartApiItems = ref<CartApiItem[]>([]) // Lưu lại để lấy category_id và course_id
const recommendedCourses = ref<Array<{
  id: string
  title: string
  duration: string
  price: number
  image?: string
  to?: string
  is_owned?: boolean
}>>([])
const commissionRates = ref<CommissionRates | null>(null)
const toast = useToast()

/**
 * Tính commission dựa trên giá và commission rates
 * @param price - Giá khóa học (sau khi giảm giá)
 * @param rates - Commission rates từ API
 * @returns Object chứa directCommission và indirectCommission
 */
function calculateCommission(price: number, rates: CommissionRates | null): { directCommission: number, indirectCommission: number } {
  if (!rates) {
    return { directCommission: 0, indirectCommission: 0 }
  }

  // Hoa hồng trực tiếp = giá * level_1_rate
  const directCommission = Math.round(price * (rates.level_1 || 0))

  // Hoa hồng gián tiếp = giá * (level_2_rate + level_3_rate)
  const indirectRate = (rates.level_2 || 0) + (rates.level_3 || 0)
  const indirectCommission = Math.round(price * indirectRate)

  return { directCommission, indirectCommission }
}

/**
 * Map từ CartApiItem sang CartItem format để tương thích với SharedCart component
 */
function mapCartItem(apiItem: CartApiItem, index: number): CartItem {
  // Tạo id từ cart_id hoặc index nếu cart_id không parse được thành số
  let id: number
  const parsedId = parseInt(apiItem.cart_id, 10)
  if (!isNaN(parsedId)) {
    id = parsedId
  } else {
    // Sử dụng hash của cart_id string để tạo id number
    id = Math.abs(apiItem.cart_id.split('').reduce((acc, char) => {
      const hash = ((acc << 5) - acc) + char.charCodeAt(0)
      return hash & hash
    }, 0)) || index + 1
  }

  // Format duration từ study_duration (giây) sang phút
  const duration = apiItem.study_duration
    ? formatDuration(apiItem.study_duration)
    : '0 phút'

  // Tính tổng duration từ effective_duration array nếu có
  const totalDuration = apiItem.effective_duration && apiItem.effective_duration.length > 0
    ? apiItem.effective_duration.reduce((sum, d) => sum + d, 0)
    : apiItem.study_duration || 0

  // Tính giá sau khi giảm giá
  const finalPrice = apiItem.total_price || apiItem.course_price

  // Tính commission dựa trên giá và commission rates
  const { directCommission, indirectCommission } = calculateCommission(finalPrice, commissionRates.value)

  return {
    id,
    cartId: apiItem.cart_id, // Lưu cart_id gốc để match lại
    course_id: apiItem.course_id, // Lưu course_id để dùng cho link và check
    title: apiItem.course_name,
    instructor: apiItem.teacher_name || 'Giảng viên',
    price: finalPrice, // Giá sau khi giảm giá
    originalPrice: apiItem.course_price, // Giá gốc (giá thật)
    image: apiItem.thumbnail ? getLinkFromS3(apiItem.thumbnail) : '/images/course/course-placeholder.png',
    videoCount: apiItem.chapter_count || 0,
    duration: totalDuration > 0 ? formatDuration(totalDuration) : duration,
    selected: true, // Mặc định tất cả đều được chọn
    indirectCommission,
    directCommission
  }
}

/**
 * Fetch commission rates từ referral API
 */
async function fetchCommissionRates() {
  try {
    const response = await userService.getReferralInfo()
    if (response && response.data && response.data.commission_rates) {
      commissionRates.value = response.data.commission_rates
    }
  } catch (error) {
    console.error('Error fetching commission rates:', error)
    // Không hiển thị toast vì đây không phải lỗi nghiêm trọng
    // Nếu không có commission rates thì commission sẽ = 0
    commissionRates.value = null
  }
}

/**
 * Fetch cart items from API
 */
async function fetchCartItems() {
  try {
    isLoading.value = true
    const cartStore = useCartStore()
    const response = await cartService.getList()

    // API response structure: { data: { total: number, carts: CartApiItem[] } }
    if (response && response.data && response.data.carts) {
      if (Array.isArray(response.data.carts)) {
        // Lưu cartApiItems để dùng cho similar courses
        cartApiItems.value = response.data.carts
        // Lưu vào store để dùng ở payment-success
        cartStore.setCartApiItems(response.data.carts)
        // Map cart items với commission rates đã fetch
        cartItems.value = response.data.carts.map((item, index) => mapCartItem(item, index))

        // Nếu có selected cart IDs trong store, chỉ chọn các items đã được chọn ở profile/cart
        if (cartStore.selectedCartIds.length > 0) {
          const selectedIds = cartStore.selectedCartIds
          cartItems.value = cartItems.value.map(item => ({
            ...item,
            selected: selectedIds.includes(item.cartId || '') || selectedIds.includes(item.id.toString())
          }))
          // Clear selected IDs sau khi đã áp dụng
          cartStore.clearSelectedCartIds()
        }
      } else {
        cartItems.value = []
      }
    } else {
      cartItems.value = []
    }
  } catch (error) {
    console.error('Error fetching cart items:', error)
    toast.add({
      title: 'Lỗi',
      description: 'Không thể tải danh sách giỏ hàng',
      color: 'error'
    })
    cartItems.value = []
  } finally {
    isLoading.value = false
  }
}

const selectedItems = computed(() => cartItems.value.filter(item => item.selected))

const totalPrice = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + item.price, 0)
})

const originalTotalPrice = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + item.originalPrice, 0)
})

const discount = computed(() => {
  return originalTotalPrice.value - totalPrice.value
})

const indirectCommission = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + (item.indirectCommission || 0), 0)
})

const directCommission = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + (item.directCommission || 0), 0)
})

const useDirectCommission = ref(true)

const paymentMethod = ref('qr')
// TODO: Mã giảm giá - tạm thời comment vì chưa cần dùng
// const promoCode = ref('')
// const applyingDiscount = ref(false)
// const discountError = ref('')
// const appliedDiscount = ref<{
//   discount_code: string
//   discount_percentage: number
//   discount_amount: number
//   final_price: number
// } | null>(null)
const requestVATInvoice = ref(false)
const checkoutModalOpen = ref(false)
const isCreatingTransaction = ref(false)
const transactionData = ref<SePayTransactionResponse | null>(null)
const pollingInterval = ref<NodeJS.Timeout | null>(null)
const paidCartIds = ref<string[]>([])
const router = useRouter()

// VAT Invoice form fields
const vatTaxCode = ref('')
const vatEmail = ref('')
const vatName = ref('')
const vatAddress = ref('')
const vatDeliveryAddress = ref('')
const vatConfirmInfo = ref(false)

// Payment data từ API (sẽ được set sau khi gọi API)
// Lấy bank account đầu tiên từ array bank_accounts
const firstBankAccount = computed(() => {
  if (transactionData.value?.bank_accounts && transactionData.value.bank_accounts.length > 0) {
    return transactionData.value.bank_accounts[0]
  }
  return null
})

const paymentContent = computed(() => {
  // Extract payment content từ qr_code_data hoặc qr_code_url
  // Format: "AIUNI30MJFNL3DOHGT59" (phần sau "des=")
  if (transactionData.value?.qr_code_data) {
    const match = transactionData.value.qr_code_data.match(/des=([^&]+)/)
    if (match && match[1]) {
      return match[1]
    }
  }
  // Fallback: tạo từ transaction_id
  if (transactionData.value?.transaction_id) {
    return transactionData.value.transaction_id.substring(0, 20).toUpperCase()
  }
  return 'PKG48603F5DE61B'
})

const bankAccount = computed(() => firstBankAccount.value?.account_number || '999999999')
const bankName = computed(() => firstBankAccount.value?.bank_full_name || 'Ngân hàng TMCP Việt Nam Thịnh Vượng (VPB)')
const accountHolder = computed(() => firstBankAccount.value?.account_holder_name || 'VU VAN KHAI')
const qrCodeUrl = computed(() => transactionData.value?.qr_code_url || transactionData.value?.qr_code_data || 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=payment')

const finalTotal = computed(() => {
  let total = totalPrice.value
  total -= discount.value
  total -= indirectCommission.value
  if (useDirectCommission.value) {
    total -= directCommission.value
  }
  // TODO: Trừ discount từ discount code nếu có - tạm thời comment vì chưa cần dùng
  // if (appliedDiscount.value) {
  //   total -= appliedDiscount.value.discount_amount
  // }
  return Math.max(0, total) // Đảm bảo không âm
})

const carouselRef = ref<HTMLElement | null>(null)

/**
 * Fetch recommended courses (courses thường được mua kèm)
 * Client-side only - lấy từ cart items với ignore và category_id
 */
async function fetchRecommendedCourses() {
  try {
    isLoadingRecommendedCourses.value = true

    // Lấy ignore (course_ids) và category_ids từ cartItems
    const ignoreIds = cartApiItems.value.map(item => item.course_id).filter(Boolean)
    const categoryIds = cartApiItems.value
      .map(item => item.category_id)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates

    if (ignoreIds.length === 0) {
      recommendedCourses.value = []
      return
    }

    const { data: responseData } = await coursesService.getList({
      page: 1,
      limit: 8,
      sort: 1,
      ignore: ignoreIds.join(','),
      ...(categoryIds.length > 0 && { category_id: categoryIds.join(',') })
    })

    if (responseData.value?.data?.data) {
      const courses = responseData.value.data.data as Course[]
      recommendedCourses.value = courses.map((course) => {
        // Lấy duration từ overview.study_duration (CourseCard sẽ tự format)
        const duration = course.overview?.study_duration || '0 giờ'

        // Lấy giá: nếu có effective_duration và length > 0 thì lấy price từ effective_duration, không thì lấy course.price
        let price = course.price || 0
        if (course.effective_duration && course.effective_duration.length > 0) {
          // Lấy giá từ effective_duration (có thể lấy giá đầu tiên hoặc giá mặc định)
          const defaultDuration = course.effective_duration.find(d => d.is_default)
          if (defaultDuration) {
            price = defaultDuration.price
          } else if (course.effective_duration[0]) {
            // Nếu không có is_default, lấy giá đầu tiên
            price = course.effective_duration[0].price
          }
        }

        return {
          id: course.course_id,
          title: course.course_name,
          duration,
          price,
          image: course.course_image ? getLinkFromS3(course.course_image) : undefined,
          to: `/khoa-hoc/${course.course_id}`,
          is_owned: course.is_owned || false
        }
      })
    } else {
      recommendedCourses.value = []
    }
  } catch (error) {
    console.error('Error fetching recommended courses:', error)
    recommendedCourses.value = []
  } finally {
    isLoadingRecommendedCourses.value = false
  }
}

async function handleDeleteItem(cartId: string, item: CartItem) {
  try {
    await cartService.deleteItem(cartId)

    cartItems.value = cartItems.value.filter(cartItem => cartItem.id !== item.id)
    cartApiItems.value = cartApiItems.value.filter(apiItem => apiItem.cart_id !== cartId)

    const cartStore = useCartStore()
    cartStore.cartApiItems = cartStore.cartApiItems.filter(apiItem => apiItem.cart_id !== cartId)

    // Update cart count in auth store
    const authStore = useAuthStore()
    authStore.updateCartCount(-1)

    toast.add({
      title: 'Thành công',
      description: 'Đã xóa sản phẩm khỏi giỏ hàng',
      color: 'success'
    })
  } catch (error) {
    console.error('Error deleting cart item:', error)
    toast.add({
      title: 'Lỗi',
      description: 'Không thể xóa sản phẩm khỏi giỏ hàng',
      color: 'error'
    })
  }
}

onMounted(async () => {
  // Fetch commission rates trước để có thể tính commission khi map cart items
  await fetchCommissionRates()
  // Sau đó fetch cart items (sẽ tự động tính commission trong mapCartItem)
  await fetchCartItems()
  // Cuối cùng fetch recommended courses
  await fetchRecommendedCourses()
})

/**
 * Tạo transaction và mở modal thanh toán
 */
async function handleCheckout() {
  if (finalTotal.value <= 0 || selectedItems.value.length === 0) {
    toast.add({
      title: 'Lỗi',
      description: 'Vui lòng chọn ít nhất một khóa học',
      color: 'error'
    })
    return
  }

  // Validate VAT invoice fields nếu checkbox được chọn
  if (requestVATInvoice.value) {
    if (!vatTaxCode.value.trim() || !vatEmail.value.trim() || !vatName.value.trim() || !vatAddress.value.trim() || !vatDeliveryAddress.value.trim()) {
      toast.add({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin hóa đơn VAT',
        color: 'error'
      })
      return
    }
    if (!vatConfirmInfo.value) {
      toast.add({
        title: 'Lỗi',
        description: 'Vui lòng xác nhận thông tin hóa đơn VAT',
        color: 'error'
      })
      return
    }
  }

  try {
    isCreatingTransaction.value = true

    // Lấy cart_ids từ selected items
    const cartIds = selectedItems.value
      .map(item => item.cartId)
      .filter(Boolean) as string[]

    if (cartIds.length === 0) {
      toast.add({
        title: 'Lỗi',
        description: 'Không có sản phẩm nào được chọn',
        color: 'error'
      })
      return
    }

    // Chuẩn bị request body
    const requestBody: {
      language: 'vn'
      carts: string[]
      invoice_info?: InvoiceInfo
    } = {
      language: 'vn',
      carts: cartIds
    }

    // Thêm invoice_info nếu requestVATInvoice = true
    if (requestVATInvoice.value) {
      requestBody.invoice_info = {
        tax_code: vatTaxCode.value.trim(),
        email: vatEmail.value.trim(),
        name: vatName.value.trim(),
        address: vatAddress.value.trim(),
        delivery_address: vatDeliveryAddress.value.trim()
      }
    }

    // Gọi API tạo transaction
    const response = await cartService.createSePayTransaction(requestBody)

    if (response && response.data) {
      transactionData.value = response.data
      paidCartIds.value = cartIds
      checkoutModalOpen.value = true

      startPollingTransactionStatus(response.data.transaction_id)
    } else {
      throw new Error('Không nhận được dữ liệu từ API')
    }
  } catch (error: unknown) {
    console.error('Error creating transaction:', error)
    const errorMessage = (error as { data?: { error?: { message?: string } } })?.data?.error?.message || 'Không thể tạo giao dịch thanh toán. Vui lòng thử lại.'
    toast.add({
      title: 'Lỗi',
      description: errorMessage,
      color: 'error'
    })
  } finally {
    isCreatingTransaction.value = false
  }
}

/**
 * Bắt đầu polling transaction status mỗi 2 giây
 */
function startPollingTransactionStatus(transactionId: string) {
  // Clear interval cũ nếu có
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
  }

  // Polling mỗi 2 giây
  pollingInterval.value = setInterval(async () => {
    try {
      const response = await cartService.getTransactionStatus(transactionId)

      if (response && response.data) {
        // payment_status: 0 = đang xử lý, 1 = thành công, 2 = thất bại
        const paymentStatus = response.data.payment_status

        if (paymentStatus === PaymentStatus.SUCCESS) {
          stopPolling()

          const cartStore = useCartStore()
          const authStore = useAuthStore()

          cartItems.value = cartItems.value.filter(item => !paidCartIds.value.includes(item.cartId || ''))
          cartApiItems.value = cartApiItems.value.filter(item => !paidCartIds.value.includes(item.cart_id))
          cartStore.cartApiItems = cartStore.cartApiItems.filter(item => !paidCartIds.value.includes(item.cart_id))

          if (authStore.user && paidCartIds.value.length > 0) {
            authStore.updateCartCount(-paidCartIds.value.length)
          }

          paidCartIds.value = []

          toast.add({
            title: 'Thành công',
            description: 'Thanh toán thành công!',
            color: 'success'
          })
          checkoutModalOpen.value = false
          router.push('/payment-success')
        } else if (paymentStatus === PaymentStatus.FAILED) {
          stopPolling()
          toast.add({
            title: 'Thất bại',
            description: 'Giao dịch thanh toán thất bại',
            color: 'error'
          })
        }
        // PENDING (0): tiếp tục polling
      }
    } catch (error) {
      console.error('Error checking transaction status:', error)
      // Không hiển thị toast để tránh spam, chỉ log error
    }
  }, 2000) // 2 giây
}

/**
 * Dừng polling transaction status
 */
function stopPolling() {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
}

/**
 * Cleanup khi component unmount
 */
onUnmounted(() => {
  stopPolling()
})

// TODO: Mã giảm giá - tạm thời comment vì chưa cần dùng
// async function applyPromoCode() {
//   if (!promoCode.value.trim()) {
//     return
//   }

//   // Lấy cart_ids từ selectedItems (phải có cartId)
//   const selectedCartIds = selectedItems.value
//     .map(item => item.cartId)
//     .filter(Boolean) as string[]

//   if (selectedCartIds.length === 0) {
//     toast.add({
//       title: 'Lỗi',
//       description: 'Vui lòng chọn ít nhất một khóa học',
//       color: 'error'
//     })
//     return
//   }

//   applyingDiscount.value = true
//   discountError.value = ''

//   try {
//     // Gọi API apply discount với cart_ids và discount_code
//     const response = await cartService.applyDiscount(selectedCartIds, promoCode.value.trim())

//     if (response.data && response.data.is_valid) {
//       appliedDiscount.value = {
//         discount_code: response.data.discount_code,
//         discount_percentage: response.data.discount_percentage,
//         discount_amount: response.data.discount_amount,
//         final_price: response.data.final_price
//       }
//       toast.add({
//         title: 'Thành công',
//         description: `Đã áp dụng mã giảm giá thành công! Giảm ${response.data.discount_percentage}%`,
//         color: 'success'
//       })
//     } else {
//       discountError.value = 'Mã giảm giá không hợp lệ'
//       appliedDiscount.value = null
//     }
//   } catch (error) {
//     console.error('Error applying discount code:', error)
//     let errorMessage = 'Mã giảm giá không hợp lệ hoặc đã hết hạn'
//     if (error && typeof error === 'object') {
//       const err = error as { response?: { data?: { message?: string } }, message?: string }
//       errorMessage = err?.response?.data?.message || err?.message || errorMessage
//     }
//     discountError.value = errorMessage
//     appliedDiscount.value = null
//     toast.add({
//       title: 'Lỗi',
//       description: errorMessage,
//       color: 'error'
//     })
//   } finally {
//     applyingDiscount.value = false
//   }
// }

// function removeDiscountCode() {
//   promoCode.value = ''
//   appliedDiscount.value = null
//   discountError.value = ''
//   toast.add({
//     title: 'Thông báo',
//     description: 'Đã xóa mã giảm giá',
//     color: 'info'
//   })
// }
</script>

<template>
  <UContainer>
    <div class="mb-6 space-y-6">
      <UBreadcrumb
        :items="items"
      />

      <Heading
        variant="h3"
        class="text-primary"
      >
        Giỏ hàng
      </Heading>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_25rem] gap-6">
        <div class="min-w-0">
          <SkeletonCart v-if="isLoading" />
          <SharedCart
            v-else
            :items="cartItems"
            :is-profile-cart="false"
            :final-total="finalTotal"
            @update:items="cartItems = $event"
            @checkout="handleCheckout"
            @delete="handleDeleteItem"
          />
        </div>

        <div class="lg:sticky lg:top-28 h-fit w-full max-w-[95%] mx-auto lg:w-auto lg:max-w-100 lg:mx-0">
          <SkeletonPaymentInfo v-if="isLoading" />
          <div
            v-else
            class="p-6 px-3 space-y-6 bg-white rounded-sm"
          >
            <Heading
              variant="h5"
            >
              Thông tin thanh toán
            </Heading>

            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-lg">Giá tiền:</span>
                <span class="text-lg font-bold">{{ formatPrice(originalTotalPrice) }}</span>
              </div>
              <div class="flex justify-between text-secondary">
                <span class="text-lg">Khuyến mãi:</span>
                <span class="text-lg font-medium">- {{ formatPrice(discount) }}</span>
              </div>
              <div class="flex justify-between text-secondary">
                <span class="text-lg">Hoa hồng gián tiếp:</span>
                <span class="text-lg font-medium">- {{ formatPrice(indirectCommission) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <div class="flex gap-2 items-center">
                  <UCheckbox
                    id="direct-commission"
                    v-model="useDirectCommission"
                    :ui="{
                      base: 'size-4',
                      indicator: 'size-4'
                    }"
                  />
                  <label
                    for="direct-commission"
                    class="text-lg cursor-pointer"
                  >Hoa hồng trực tiếp:</label>
                </div>
                <span class="text-lg font-medium text-secondary">- {{ formatPrice(directCommission) }}</span>
              </div>
            </div>

            <!-- TODO: Mã giảm giá - tạm thời comment vì chưa cần dùng -->
            <!-- <div class="space-y-3">
              <div class="flex gap-2 items-center">
                <span class="text-lg">Mã giảm giá</span>
              </div>
              <div class="flex gap-2">
                <UInput
                  v-model="promoCode"
                  placeholder="Mã giảm giá"
                  class="flex-1 h-12 text-base"
                  :disabled="applyingDiscount || !!appliedDiscount"
                  @keyup.enter="applyPromoCode"
                >
                  <template #leading>
                    <DiscountTagIcon class="size-5" />
                  </template>
                </UInput>
                <UButton
                  v-if="!appliedDiscount"
                  class="text-base bg-button-gradient"
                  color="primary"
                  :disabled="!promoCode.trim() || applyingDiscount || selectedItems.length === 0"
                  @click="applyPromoCode"
                >
                  <span v-if="applyingDiscount">Đang xử lý...</span>
                  <span v-else>Áp dụng</span>
                </UButton>
                <UButton
                  v-else
                  class="text-base"
                  color="error"
                  variant="outline"
                  @click="removeDiscountCode"
                >
                  Xóa
                </UButton>
              </div>
              <div
                v-if="discountError"
                class="text-sm text-red-500"
              >
                {{ discountError }}
              </div>
              <div
                v-if="appliedDiscount"
                class="text-sm font-medium text-green-600"
              >
                ✓ Đã áp dụng mã giảm giá
              </div>
            </div>

            <div
              v-if="appliedDiscount"
              class="space-y-3"
            >
              <div class="flex justify-between text-green-600">
                <span class="text-lg">Mã giảm giá ({{ appliedDiscount.discount_percentage }}%):</span>
                <span class="text-lg font-medium">- {{ formatPrice(appliedDiscount.discount_amount) }}</span>
              </div>
            </div> -->

            <USeparator />

            <div class="flex justify-between items-center">
              <span class="text-lg">Tổng thanh toán:</span>
              <span class="text-2xl font-bold text-secondary">{{ formatPrice(finalTotal) }}</span>
            </div>

            <div class="space-y-4">
              <div>
                <p class="mb-3 text-lg font-semibold">
                  Phương thức thanh toán
                </p>
                <div class="space-y-2">
                  <button
                    :class="[
                      'w-full flex items-center justify-between p-3 rounded-md border transition-colors cursor-pointer',
                      paymentMethod === 'qr' ? 'border-primary bg-primary-50' : 'border-neutral-300 hover:border-primary'
                    ]"
                    @click="paymentMethod = 'qr'"
                  >
                    <div class="flex gap-2 items-center">
                      <ScanIcon class="size-5" />
                      <span class="text-base font-semibold">Thanh toán mã QR</span>
                    </div>
                    <div
                      :class="[
                        'size-4 rounded-full border-2 flex items-center justify-center',
                        paymentMethod === 'qr' ? 'border-primary' : 'border-neutral-400'
                      ]"
                    >
                      <div
                        v-if="paymentMethod === 'qr'"
                        class="rounded-full size-2 bg-primary"
                      />
                    </div>
                  </button>
                </div>
              </div>

              <div class="space-y-4">
                <!-- <UCheckbox
                  v-model="requestVATInvoice"
                  label="Yêu cầu xuất hóa đơn VAT"
                  :ui="{
                    base: 'size-6',
                    indicator: 'size-6',
                    label: 'cursor-pointer font-semibold',
                    wrapper: 'semibold text-lg font-semibold',
                    root: 'items-center'
                  }"
                /> -->

                <!-- VAT Invoice Form -->
                <div
                  v-if="requestVATInvoice"
                  class="pl-8 space-y-4 border-l-2 border-primary-200"
                >
                  <UInput
                    v-model="vatTaxCode"
                    placeholder="Mã số thuế"
                    maxlength="30"
                    class="w-full h-12 text-base"
                  />
                  <UInput
                    v-model="vatEmail"
                    type="email"
                    placeholder="Email nhận hóa đơn"
                    maxlength="255"
                    class="w-full h-12 text-base"
                  />
                  <UInput
                    v-model="vatName"
                    placeholder="Tên doanh nghiệp/cá nhân"
                    maxlength="255"
                    class="w-full h-12 text-base"
                  />
                  <UInput
                    v-model="vatAddress"
                    placeholder="Địa chỉ doanh nghiệp/cá nhân"
                    maxlength="255"
                    class="w-full h-12 text-base"
                  />
                  <UInput
                    v-model="vatDeliveryAddress"
                    placeholder="Địa chỉ nhận hóa đơn VAT"
                    maxlength="255"
                    class="w-full h-12 text-base"
                  />
                  <UCheckbox
                    v-model="vatConfirmInfo"
                    label="Tôi xác nhận các thông tin trên đã chính xác để xuất hóa đơn VAT"
                    :ui="{
                      base: 'size-4',
                      indicator: 'size-4',
                      label: 'text-sm cursor-pointer'
                    }"
                    class="w-full"
                  />
                </div>
              </div>
            </div>

            <UButton
              color="primary"
              size="lg"
              block
              class="h-14 text-base font-semibold bg-button-gradient"
              :disabled="selectedItems.length === 0 || isCreatingTransaction"
              :loading="isCreatingTransaction"
              @click="handleCheckout"
            >
              Tiến hành thanh toán
            </UButton>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <Heading
          variant="h3"
          class="mb-2"
        >
          Khoá học thường được mua kèm
        </Heading>

        <div class="relative">
          <div
            v-if="isLoadingRecommendedCourses"
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div
              v-for="i in 4"
              :key="i"
              class="space-y-3"
            >
              <USkeleton class="w-full h-48 rounded-lg" />
              <USkeleton class="w-full h-6" />
              <USkeleton class="w-2/3 h-5" />
              <USkeleton class="w-1/2 h-6" />
            </div>
          </div>
          <div
            v-else-if="recommendedCourses.length > 0"
            ref="carouselRef"
          >
            <UCarousel
              v-slot="{ item }"
              auto-height
              arrows
              :prev="{
                icon: 'i-lucide-chevron-left',
                color: 'primary',
                variant: 'solid'
              }"
              :next="{
                icon: 'i-lucide-chevron-right',
                color: 'primary',
                variant: 'solid'
              }"
              :items="recommendedCourses"
              :ui="{
                item: 'basis-1/2 sm:basis-1/3 md:basis-1/2 lg:basis-1/3 xl:basis-1/4',
                controls: 'md:absolute md:-top-6 md:right-12'
              }"
              class="mx-auto w-full"
            >
              <CourseCard
                :key="item.id"
                :title="item.title"
                :duration="item.duration"
                :price="item.price"
                :image="item.image"
                :to="item.to"
                :is-owned="item.is_owned || false"
                class="my-4"
              />
            </UCarousel>
          </div>
          <div
            v-else
            class="py-8 text-center text-neutral-500"
          >
            Không có khóa học đề xuất
          </div>
        </div>
      </div>
    </div>

    <SharedPaymentModal
      v-model="checkoutModalOpen"
      :payment-amount="transactionData?.total_amount || finalTotal"
      :payment-content="paymentContent"
      :bank-account="bankAccount"
      :bank-name="bankName"
      :account-holder="accountHolder"
      :qr-code-url="qrCodeUrl"
      @update:model-value="(value) => {
        checkoutModalOpen = value
        if (!value) {
          stopPolling()
        }
      }"
    />
  </UContainer>
</template>
