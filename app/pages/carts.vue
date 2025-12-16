<script setup lang="ts">
import type { CartItem } from '~/components/shared/Cart.vue'
import type { BreadcrumbItem } from '@nuxt/ui'
import DiscountTagIcon from '~/assets/icons/discount-tag.svg'
import ScanIcon from '~/assets/icons/scan.svg'

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
    selected: true,
    indirectCommission: 42500,
    directCommission: 12500
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
    selected: true,
    indirectCommission: 41650,
    directCommission: 12250
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
    selected: true,
    indirectCommission: 43350,
    directCommission: 12750
  },
  {
    id: 4,
    title: 'Ứng dụng AI tạo sinh trong doanh nghiệp',
    instructor: 'Nguyễn Kim Anh',
    price: 5000000,
    originalPrice: 7600000,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56',
    videoCount: 32,
    duration: '12 giờ 7 phút',
    selected: true,
    indirectCommission: 42500,
    directCommission: 12500
  },
  {
    id: 5,
    title: 'Quản trị nhân sự tinh gọn bằng AI',
    instructor: ['Nguyễn Ngọc Lệ', 'Wilson Lieu', 'Nguyễn Quỳnh Giao'],
    price: 4900000,
    originalPrice: 6500000,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    videoCount: 32,
    duration: '8 giờ 27 phút',
    selected: true,
    indirectCommission: 41650,
    directCommission: 12250
  },
  {
    id: 6,
    title: 'Giải mã sức mạnh AI',
    instructor: 'Ngô Xuân Bách',
    price: 5100000,
    originalPrice: 8400000,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    videoCount: 32,
    duration: '9 giờ 15 phút',
    selected: true,
    indirectCommission: 43350,
    directCommission: 12750
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

const indirectCommission = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + (item.indirectCommission || 0), 0)
})

const directCommission = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + (item.directCommission || 0), 0)
})

const useDirectCommission = ref(true)

const paymentMethod = ref('qr')
const promoCode = ref('')
const requestVATInvoice = ref(false)
const checkoutModalOpen = ref(false)

const paymentContent = ref('PKG48603F5DE61B')
const bankAccount = ref('999999999')
const bankName = ref('Ngân hàng TMCP Việt Nam Thịnh Vượng (VPB)')
const accountHolder = ref('VU VAN KHAI')
const qrCodeUrl = ref('https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=payment')

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
  },
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

function handleCheckout() {
  if (finalTotal.value > 0) {
    checkoutModalOpen.value = true
  }
}

function applyPromoCode() {
  console.log('Apply promo code:', promoCode.value)
}
</script>

<template>
  <UContainer>
    <div class="space-y-6 mb-6">
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
          />
        </div>

        <div class="lg:sticky lg:top-28 h-fit w-full max-w-[95%] mx-auto lg:w-auto lg:max-w-100 lg:mx-0">
          <SkeletonPaymentInfo v-if="isLoading" />
          <div
            v-else
            class="bg-white rounded-sm p-6 px-3 space-y-6"
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
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
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

            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <span class="text-lg">Mã giảm giá</span>
              </div>
              <div class="flex gap-2">
                <UInput
                  v-model="promoCode"
                  placeholder="Mã giảm giá"
                  class="flex-1 h-12 text-base"
                >
                  <template #leading>
                    <DiscountTagIcon class="size-5" />
                  </template>
                </UInput>
                <UButton
                  class="text-base bg-button-gradient"
                  color="primary"
                  @click="applyPromoCode"
                >
                  Áp dụng
                </UButton>
              </div>
            </div>

            <USeparator />

            <div class="flex justify-between items-center">
              <span class="text-lg">Tổng thanh toán:</span>
              <span class="text-2xl font-bold text-secondary">{{ formatPrice(finalTotal) }}</span>
            </div>

            <div class="space-y-4">
              <div>
                <p class="text-lg mb-3 font-semibold">
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
                    <div class="flex items-center gap-2">
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
                        class="size-2 rounded-full bg-primary"
                      />
                    </div>
                  </button>
                </div>
              </div>

              <UCheckbox
                v-model="requestVATInvoice"
                label="Yêu cầu xuất hóa đơn VAT"
                :ui="{
                  base: 'size-6',
                  indicator: 'size-6',
                  label: 'cursor-pointer font-semibold',
                  wrapper: 'semibold text-lg font-semibold',
                  root: 'items-center'
                }"
              />
            </div>

            <UButton
              color="primary"
              size="lg"
              block
              class="h-14 text-base font-semibold bg-button-gradient"
              :disabled="selectedItems.length === 0"
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
            v-if="isLoading"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div
              v-for="i in 4"
              :key="i"
              class="space-y-3"
            >
              <USkeleton class="w-full h-48 rounded-lg" />
              <USkeleton class="h-6 w-full" />
              <USkeleton class="h-5 w-2/3" />
              <USkeleton class="h-6 w-1/2" />
            </div>
          </div>
          <div
            v-else
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
                item: 'lg:basis-1/4',
                controls: 'md:absolute md:-top-6 md:right-12'
              }"
              class="w-full mx-auto"
            >
              <CourseCard
                :key="item.id"
                :title="item.title"
                :duration="item.duration"
                :price="item.price"
                :image="item.image"
                class="my-4"
              />
            </UCarousel>
          </div>
        </div>
      </div>
    </div>

    <SharedPaymentModal
      v-model="checkoutModalOpen"
      :payment-amount="finalTotal"
      :payment-content="paymentContent"
      :bank-account="bankAccount"
      :bank-name="bankName"
      :account-holder="accountHolder"
      :qr-code-url="qrCodeUrl"
    />
  </UContainer>
</template>
