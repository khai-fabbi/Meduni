import { defineStore } from 'pinia'
import type { CartApiItem } from '~/types/cart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    selectedCartIds: [] as string[],
    cartApiItems: [] as CartApiItem[] // Lưu cart items để dùng cho recommended courses
  }),

  getters: {
    /**
     * Check xem course đã có trong cart chưa (theo course_id)
     */
    isCourseInCart: state => (courseId: string) => {
      return state.cartApiItems.some(item => item.course_id === courseId)
    }
  },

  actions: {
    /**
     * Set selected cart IDs từ profile cart
     */
    setSelectedCartIds(cartIds: string[]) {
      this.selectedCartIds = cartIds
    },

    /**
     * Clear selected cart IDs
     */
    clearSelectedCartIds() {
      this.selectedCartIds = []
    },

    /**
     * Set cart API items để dùng cho recommended courses
     * Chỉ thêm các items chưa tồn tại (theo cart_id)
     */
    setCartApiItems(items: CartApiItem[]) {
      // Lấy danh sách cart_ids hiện có
      const existingCartIds = new Set(this.cartApiItems.map(item => item.cart_id))

      // Chỉ thêm các items chưa tồn tại
      const newItems = items.filter(item => !existingCartIds.has(item.cart_id))

      // Merge với items hiện có
      this.cartApiItems = [...this.cartApiItems, ...newItems]
    },

    /**
     * Clear cart API items
     */
    clearCartApiItems() {
      this.cartApiItems = []
    },

    /**
     * Add single cart item vào store
     * @param item - Cart item từ API
     */
    addCartItem(item: CartApiItem) {
      // Check xem đã tồn tại chưa (theo cart_id)
      const exists = this.cartApiItems.some(existingItem => existingItem.cart_id === item.cart_id)
      if (!exists) {
        this.cartApiItems.push(item)
      }
    }
  }
})
