<script setup lang="ts">
import type { CartItem } from '~/components/shared/Cart.vue'

useSeoMeta({
  title: 'Giỏ hàng',
  description: 'Giỏ hàng của bạn'
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

const indirectCommission = ref(255500)
const directCommission = ref(74900)
const useDirectCommission = ref(true)

const paymentMethod = ref('onepay')
const promoCode = ref('')
const requestVATInvoice = ref(false)

const finalTotal = computed(() => {
  let total = totalPrice.value
  total -= discount.value
  total -= indirectCommission.value
  if (useDirectCommission.value) {
    total -= directCommission.value
  }
  return total
})

const carouselRef = ref<HTMLElement | null>(null)

const scrollCarousel = (direction: 'left' | 'right') => {
  if (!carouselRef.value) return
  const scrollAmount = 320
  const currentScroll = carouselRef.value.scrollLeft
  const newScroll = direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount
  carouselRef.value.scrollTo({
    left: newScroll,
    behavior: 'smooth'
  })
}

const recommendedCourses = ref([
  {
    id: 1,
    title: 'Chiến lược trí tuệ nhân tạo dành cho lãnh đạo',
    duration: '13 giờ 24 phút',
    price: 7200000,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56'
  },
  {
    id: 2,
    title: 'Khóa đào tạo AI cho marketer không muốn bị tụt lại',
    duration: '13 giờ 24 phút',
    price: 6700000,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'
  },
  {
    id: 3,
    title: 'Chiến lược Marketing thời đại AI',
    duration: '11 giờ 15 phút',
    price: 5500000,
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136'
  },
  {
    id: 4,
    title: 'Bứt phá hiệu suất công việc - Chương trình đào tạo Micro MBA AI',
    duration: '8 giờ 00 phút',
    price: 12200000,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56'
  }
])

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(price)
}

onMounted(async () => {
  isLoading.value = false
})

function handleCheckout(items: CartItem[]) {
  console.log('Checkout items:', items)
}

function applyPromoCode() {
  console.log('Apply promo code:', promoCode.value)
}
</script>

<template>
  <UContainer>
    <div class="space-y-6 py-6">
      <div class="flex items-center gap-2 text-sm">
        <NuxtLink
          to="/"
          class="text-default hover:text-primary transition-colors"
        >
          Trang chủ
        </NuxtLink>
        <span class="text-neutral-400">></span>
        <span class="text-primary font-medium">Giỏ hàng</span>
      </div>

      <Heading variant="h3">
        Giỏ hàng
      </Heading>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="w-auto">
          <SkeletonCart v-if="isLoading" />
          <SharedCart
            v-else
            :items="cartItems"
            @update:items="cartItems = $event"
            @checkout="handleCheckout"
          />
        </div>

        <div class="lg:sticky h-fit lg:max-w-100">
          <div class="bg-white rounded-sm p-6 space-y-6">
            <Heading
              variant="h4"
              class="text-primary"
            >
              Thông tin thanh toán
            </Heading>

            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-base">Giá tiền:</span>
                <span class="text-base font-medium">{{ formatPrice(originalTotalPrice) }}</span>
              </div>
              <div class="flex justify-between text-secondary">
                <span class="text-base">Khuyến mãi:</span>
                <span class="text-base font-medium">- {{ formatPrice(discount) }}</span>
              </div>
              <div class="flex justify-between text-secondary">
                <span class="text-base">Hoa hồng gián tiếp:</span>
                <span class="text-base font-medium">- {{ formatPrice(indirectCommission) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UCheckbox
                    v-model="useDirectCommission"
                    :ui="{
                      base: 'size-4',
                      indicator: 'size-4'
                    }"
                  />
                  <span class="text-base">Hoa hồng trực tiếp:</span>
                </div>
                <span class="text-base font-medium text-secondary">- {{ formatPrice(directCommission) }}</span>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex gap-2">
                <UInput
                  v-model="promoCode"
                  placeholder="Mã giảm giá"
                  class="flex-1"
                />
                <UButton
                  color="primary"
                  @click="applyPromoCode"
                >
                  Áp dụng
                </UButton>
              </div>
            </div>

            <USeparator />

            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold">Tổng thanh toán:</span>
              <span class="text-2xl font-bold text-primary">{{ formatPrice(finalTotal) }}</span>
            </div>

            <div class="space-y-4">
              <div>
                <p class="text-base font-medium mb-3">
                  Phương thức thanh toán
                </p>
                <div class="space-y-2">
                  <button
                    :class="[
                      'w-full flex items-center justify-between p-3 rounded-md border transition-colors',
                      paymentMethod === 'onepay' ? 'border-primary bg-primary-50' : 'border-neutral-300 hover:border-primary'
                    ]"
                    @click="paymentMethod = 'onepay'"
                  >
                    <div class="flex items-center gap-2">
                      <div
                        :class="[
                          'size-4 rounded-full border-2 flex items-center justify-center',
                          paymentMethod === 'onepay' ? 'border-primary' : 'border-neutral-400'
                        ]"
                      >
                        <div
                          v-if="paymentMethod === 'onepay'"
                          class="size-2 rounded-full bg-primary"
                        />
                      </div>
                      <span class="text-base">Onepay</span>
                    </div>
                    <span
                      v-if="paymentMethod === 'onepay'"
                      class="text-sm text-neutral-500"
                    >Mặc định</span>
                  </button>
                  <button
                    :class="[
                      'w-full flex items-center justify-between p-3 rounded-md border transition-colors',
                      paymentMethod === 'qr' ? 'border-primary bg-primary-50' : 'border-neutral-300 hover:border-primary'
                    ]"
                    @click="paymentMethod = 'qr'"
                  >
                    <div class="flex items-center gap-2">
                      <div
                        :class="[
                          'size-4 rounded-full border-2 flex items-center justify-center',
                          paymentMethod === 'qr' ? 'border-primary' : 'border-neutral-400'
                        ]"
                      >
                        <div
                          v-if="paymentMethod === 'qr'"
                          class="size-2 rounded-full bg-primary"
                        />
                      </div>
                      <span class="text-base">Thanh toán mã QR</span>
                    </div>
                  </button>
                </div>
              </div>

              <UCheckbox
                v-model="requestVATInvoice"
                label="Yêu cầu xuất hóa đơn VAT"
                :ui="{
                  base: 'size-4',
                  indicator: 'size-4'
                }"
              />
            </div>

            <UButton
              color="primary"
              size="lg"
              block
              class="h-14 text-base font-semibold"
              :disabled="selectedItems.length === 0"
              @click="handleCheckout(selectedItems)"
            >
              Tiến hành thanh toán
            </UButton>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <Heading
          variant="h4"
          class="text-primary"
        >
          Khoá học thường được mua kèm
        </Heading>

        <div class="relative">
          <button
            class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
            @click="scrollCarousel('left')"
          >
            <UIcon
              name="i-lucide-chevron-left"
              class="w-5 h-5 text-default"
            />
          </button>
          <div
            ref="carouselRef"
            class="overflow-x-auto scrollbar-hide scroll-smooth"
          >
            <div class="flex gap-6 pb-4">
              <CourseCard
                v-for="course in recommendedCourses"
                :key="course.id"
                :title="course.title"
                :duration="course.duration"
                :price="course.price"
                :to="`/khoa-hoc/${course.id}`"
                class="min-w-[280px] md:min-w-[320px]"
              />
            </div>
          </div>
          <button
            class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
            @click="scrollCarousel('right')"
          >
            <UIcon
              name="i-lucide-chevron-right"
              class="w-5 h-5 text-default"
            />
          </button>
        </div>
      </div>
    </div>
  </UContainer>
</template>
