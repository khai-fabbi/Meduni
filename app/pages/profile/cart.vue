<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import type { CartItem } from '~/components/shared/Cart.vue'

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
    />
  </div>
</template>
