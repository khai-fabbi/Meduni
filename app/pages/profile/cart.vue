<script setup lang="ts">
import type { CartItem } from '~/components/shared/Cart.vue'

useSeoMeta({
  title: 'Giỏ hàng',
  description: 'Giỏ hàng của bạn'
})

definePageMeta({
  layout: 'profile'
})

const isLoading = ref(true)

const cartItems = ref<CartItem[]>([
  {
    id: 1,
    title: 'Ứng dụng AI tạo sinh trong doanh nghiệp',
    instructor: 'Nguyễn Kim Anh',
    price: 5000000,
    originalPrice: 7600000,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56',
    videoCount: 32,
    duration: '12 giờ 7 phút',
    selected: true
  },
  {
    id: 2,
    title: 'Quản trị nhân sự tinh gọn bằng AI',
    instructor: ['Nguyễn Ngọc Lệ', 'Wilson Lieu', 'Nguyễn Quỳnh Giao'],
    price: 4900000,
    originalPrice: 6500000,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    videoCount: 32,
    duration: '8 giờ 27 phút',
    selected: true
  },
  {
    id: 3,
    title: 'Giải mã sức mạnh AI',
    instructor: 'Ngô Xuân Bách',
    price: 5100000,
    originalPrice: 8400000,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    videoCount: 32,
    duration: '9 giờ 15 phút',
    selected: true
  }
])

onMounted(async () => {
  isLoading.value = false
})

function handleCheckout(items: CartItem[]) {
  console.log('Checkout items:', items)
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">
      Giỏ hàng
    </h1>

    <template v-if="isLoading">
      <div class="bg-white rounded-sm pb-10">
        <div class="space-y-6">
          <div class="flex items-center justify-between h-18 rounded-sm rounded-b-none bg-primary-light">
            <div class="flex items-center gap-3 px-4">
              <USkeleton class="size-5 rounded" />
              <USkeleton class="h-5 w-64" />
            </div>
            <USkeleton class="h-5 w-20 px-4" />
          </div>

          <div class="space-y-4 px-4">
            <div
              v-for="i in 3"
              :key="i"
              class="flex items-center gap-4 p-4 rounded-lg"
            >
              <USkeleton class="size-5 rounded" />
              <USkeleton class="w-32 h-24 rounded-lg shrink-0" />
              <div class="flex-1 min-w-0 space-y-2">
                <USkeleton class="h-7 w-3/4" />
                <USkeleton class="h-5 w-1/2" />
                <USkeleton class="h-4 w-2/3" />
              </div>
              <div class="flex flex-col items-end gap-1 shrink-0">
                <USkeleton class="h-6 w-24" />
                <USkeleton class="h-5 w-20" />
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-6 border-t border-neutral-300 px-4">
            <USkeleton class="h-5 w-32" />
            <div class="flex items-center gap-4">
              <div class="text-right pr-7.5">
                <USkeleton class="h-5 w-48 mb-1" />
                <USkeleton class="h-8 w-40" />
              </div>
              <USkeleton class="w-40 h-14 rounded" />
            </div>
          </div>
        </div>
      </div>
    </template>

    <SharedCart
      v-else
      :items="cartItems"
      @update:items="cartItems = $event"
      @checkout="handleCheckout"
    />
  </div>
</template>
