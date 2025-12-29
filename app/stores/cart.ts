import { defineStore } from 'pinia'
import type { CartApiItem } from '~/types/cart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    selectedCartIds: [] as string[],
    cartApiItems: [] as CartApiItem[] // Lưu cart items để dùng cho recommended courses
  }),

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
    }
  }
})
