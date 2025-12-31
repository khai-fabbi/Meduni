<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import type { CartItem } from '~/components/shared/Cart.vue'
import type { CartApiItem } from '~/types/cart'
import type { CommissionRates } from '~/types/referral'
import { cartService } from '~/services/cart'
import { userService } from '~/services/user'
import { getLinkFromS3, formatDuration } from '~/utils/helpers'

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
    label: 'Hồ sơ',
    to: '/profile'
  },
  {
    label: 'Giỏ hàng',
    to: '#'
  }
])

definePageMeta({
  layout: 'profile',
  middleware: 'auth'
})

const isLoading = ref(true)
const cartItems = ref<CartItem[]>([])
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
    selected: true,
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
    const response = await cartService.getList()

    // API response structure: { data: { total: number, carts: CartApiItem[] } }
    if (response && response.data && response.data.carts) {
      if (Array.isArray(response.data.carts)) {
        // Map cart items với commission rates đã fetch
        cartItems.value = response.data.carts.map((item, index) => mapCartItem(item, index))
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

async function handleDeleteItem(cartId: string, item: CartItem) {
  try {
    await cartService.deleteItem(cartId)

    cartItems.value = cartItems.value.filter(cartItem => cartItem.id !== item.id)

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
})

function handleCheckout(items: CartItem[]) {
  console.log('Checkout items:', items)
}
</script>

<template>
  <div class="space-y-6">
    <UBreadcrumb
      :items="items"
      class="md:hidden mb-0"
    />
    <Heading
      variant="h3"
    >
      Giỏ hàng
    </Heading>

    <SkeletonCart v-if="isLoading" />

    <SharedCart
      v-else
      :items="cartItems"
      :is-profile-cart="true"
      @update:items="cartItems = $event"
      @checkout="handleCheckout"
      @delete="handleDeleteItem"
    />
  </div>
</template>
