import { cartService } from '~/services/cart'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'
import type { CartApiItem } from '~/types/cart'

/**
 * Composable for handling add to cart functionality
 * @returns Object containing addToCart function and loading state
 */
export function useAddToCart() {
  const toast = useToast()
  const authStore = useAuthStore()
  const cartStore = useCartStore()

  // Track loading state per course
  const loadingCourses = ref<Record<string, boolean>>({})

  /**
   * Check if a course is currently being added to cart
   */
  const isLoading = (courseId: string) => {
    return loadingCourses.value[courseId] || false
  }

  /**
   * Add a course to cart
   * @param courseId - The ID of the course to add
   */
  const addToCart = async (courseId: string) => {
    // Check if course is already in cart
    if (cartStore.isCourseInCart(courseId)) {
      toast.add({
        title: 'Thông báo',
        description: 'Khóa học đã có trong giỏ hàng',
        color: 'warning'
      })
      return
    }

    try {
      loadingCourses.value[courseId] = true
      await cartService.addToCart(courseId)

      // Update cart count in auth store
      authStore.updateCartCount(1)

      // Refresh cart items from API
      try {
        const cartResponse = await cartService.getList()
        if (cartResponse.data?.carts) {
          const newCartItem = cartResponse.data.carts.find(
            (item: CartApiItem) => item.course_id === courseId
          )
          if (newCartItem) {
            cartStore.addCartItem(newCartItem)
          } else {
            cartStore.setCartApiItems(cartResponse.data.carts)
          }
        }
      } catch (error) {
        console.error('Error fetching cart after add:', error)
      }

      // Show success toast
      toast.add({
        title: 'Thành công',
        description: 'Đã thêm khóa học vào giỏ hàng',
        color: 'success'
      })
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.add({
        title: 'Lỗi',
        description: 'Không thể thêm khóa học vào giỏ hàng. Vui lòng thử lại.',
        color: 'error'
      })
      throw error
    } finally {
      loadingCourses.value[courseId] = false
    }
  }

  return {
    addToCart,
    isLoading,
    loadingCourses: readonly(loadingCourses)
  }
}
