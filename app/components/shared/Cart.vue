<script setup lang="ts">
export interface CartItem {
  id: number
  cartId?: string
  course_id: string
  title: string
  instructor: string | string[]
  price: number
  originalPrice: number
  image: string
  videoCount: number
  duration: string
  selected?: boolean
  indirectCommission?: number
  directCommission?: number
}

interface Props {
  items: CartItem[]
  isProfileCart?: boolean
  finalTotal?: number
}

const props = withDefaults(defineProps<Props>(), {
  isProfileCart: false,
  finalTotal: 0
})

const emit = defineEmits<{
  'update:items': [items: CartItem[]]
  'checkout': [items: CartItem[]]
  'delete': [cartId: string, item: CartItem]
}>()

const router = useRouter()
const cartStore = useCartStore()
const checkoutModalOpen = ref(false)
const deleteModalOpen = ref(false)
const itemToDelete = ref<CartItem | null>(null)

const paymentAmount = computed(() => {
  return props.finalTotal > 0 ? props.finalTotal : totalPrice.value
})

const paymentContent = ref('PKG48603F5DE61B')
const bankAccount = ref('999999999')
const bankName = ref('Ngân hàng TMCP Việt Nam Thịnh Vượng (VPB)')
const accountHolder = ref('VU VAN KHAI')
const qrCodeUrl = ref('https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=payment')

const cartItems = computed({
  get: () => props.items,
  set: value => emit('update:items', value)
})

const allSelected = computed({
  get: () => cartItems.value.every(item => item.selected),
  set: (value) => {
    cartItems.value = cartItems.value.map(item => ({
      ...item,
      selected: value
    }))
  }
})

const selectedItems = computed(() => cartItems.value.filter(item => item.selected))

const totalPrice = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + item.price, 0)
})

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(price)
}

function formatInstructor(instructor: string | string[]): string {
  if (Array.isArray(instructor)) {
    return instructor.join(', ')
  }
  return instructor
}

function toggleItem(id: number) {
  cartItems.value = cartItems.value.map(item =>
    item.id === id ? { ...item, selected: !item.selected } : item
  )
}

function handleCheckout() {
  if (props.isProfileCart) {
    // Lưu selected cart_ids vào store
    const selectedIds = selectedItems.value
      .map(item => item.cartId || item.id.toString())
      .filter(Boolean)

    if (selectedIds.length > 0) {
      cartStore.setSelectedCartIds(selectedIds)
    }
    router.push('/carts')
  } else {
    if (props.finalTotal > 0) {
      checkoutModalOpen.value = true
    }
  }
}

const isCheckoutDisabled = computed(() => {
  if (props.isProfileCart) {
    return selectedItems.value.length === 0
  }
  return selectedItems.value.length === 0 || props.finalTotal <= 0
})

function handleDeleteClick(item: CartItem) {
  itemToDelete.value = item
  deleteModalOpen.value = true
}

function confirmDelete() {
  if (!itemToDelete.value || !itemToDelete.value.cartId) {
    return
  }

  emit('delete', itemToDelete.value.cartId, itemToDelete.value)
  deleteModalOpen.value = false
  itemToDelete.value = null
}

function cancelDelete() {
  deleteModalOpen.value = false
  itemToDelete.value = null
}
</script>

<template>
  <div class="bg-white rounded-sm md:pb-10">
    <div
      v-if="cartItems.length === 0"
      class="text-center py-12"
    >
      <p class="text-neutral-500 text-lg">
        Giỏ hàng của bạn đang trống
      </p>
    </div>

    <div
      v-else
      class="space-y-6"
    >
      <div class="flex flex-col md:flex-row md:items-center md:justify-between h-auto md:h-18 rounded-sm rounded-b-none bg-primary-light py-3 md:py-0 mb-0 md:mb-6">
        <div class="flex items-center gap-3 px-3">
          <UIcon
            name="i-lucide-shopping-cart"
            class="size-5 text-secondary shrink-0"
          />
          <span class="text-sm md:text-lg">
            <span class="font-bold">{{ cartItems.length }} sản phẩm</span> đã được thêm vào giỏ hàng
          </span>
        </div>
        <span class="hidden md:block text-sm md:text-lg font-medium px-3 mt-2 md:mt-0">
          Giá tiền
        </span>
      </div>

      <div class="space-y-4">
        <template
          v-for="item in cartItems"
          :key="item.id"
        >
          <div
            class="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 p-3 md:pt-0 md:pb-0 rounded-lg mb-0 md:mb-4"
          >
            <div class="flex gap-4 items-center flex-1 min-w-0">
              <UCheckbox
                color="secondary"
                :model-value="item.selected"
                class="shrink-0"
                :ui="{
                  base: 'size-5',
                  indicator: 'size-5'
                }"
                @update:model-value="toggleItem(item.id)"
              />
              <NuxtLink
                :to="`/khoa-hoc/${item.course_id}`"
                class="flex gap-4 items-center flex-1 min-w-0"
              >

                <NuxtImg
                  :src="item.image"
                  :alt="item.title"
                  class="w-20 h-16 md:w-40 md:h-30 object-cover md:rounded-lg rounded-sm shrink-0"
                  :placeholder="[20, 20]"
                  width="160"
                  height="120"
                  loading="lazy"
                />

                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-base leading-tight md:text-2xl text-primary mb-1 line-clamp-2">
                    {{ item.title }}
                  </h3>
                  <p class="text-sm md:text-lg mb-1 line-clamp-1">
                    Giảng viên: {{ formatInstructor(item.instructor) }}
                  </p>
                  <p class="text-xs md:text-base text-neutral-600">
                    {{ item.videoCount && item.videoCount > 0 ? `${item.videoCount} video` : '' }} • {{ item.duration }}
                  </p>
                </div>
              </NuxtLink>
            </div>

            <div class="flex items-start gap-2 md:flex-col md:items-end shrink-0 pl-8 md:pl-0">
              <div class="flex flex-col items-end gap-1">
                <span class="text-lg md:text-xl font-bold text-secondary">
                  {{ formatPrice(item.price) }}
                </span>
                <span
                  v-if="item.originalPrice && item.originalPrice !== item.price"
                  class="text-sm md:text-lg text-neutral-400 line-through"
                >
                  {{ formatPrice(item.originalPrice) }}
                </span>
              </div>
              <button
                type="button"
                class="shrink-0 text-neutral-500 hover:text-error p-2 pb-0 rounded-md hover:bg-neutral-100 transition-colors relative z-10 cursor-pointer -mt-1"
                @click.stop.prevent="handleDeleteClick(item)"
              >
                <UIcon
                  name="i-lucide-x"
                  class="size-5"
                />
              </button>
            </div>
          </div>
          <USeparator />
        </template>
      </div>

      <div class="hidden md:flex md:items-center md:justify-between pt-4 ps-4 pe-4 border-neutral-300">
        <UCheckbox
          v-model="allSelected"
          :ui="{
            base: 'size-5',
            indicator: 'size-5'
          }"
          :label="`Chọn tất cả (${selectedItems.length})`"
          color="secondary"
        />

        <div class="flex flex-row items-center gap-4">
          <div class="text-left md:text-right pr-0 md:pr-7.5">
            <p class="text-base md:text-lg mb-1">
              Tổng tiền tạm tính: <span class="text-secondary font-bold">
                {{ formatPrice(totalPrice) }}
              </span>
            </p>
          </div>
          <UButton
            color="primary"
            size="lg"
            :disabled="isCheckoutDisabled"
            :class="[
              'w-full md:w-40 h-14 text-center font-semibold text-base flex justify-center',
              isCheckoutDisabled && !props.isProfileCart && props.finalTotal <= 0 ? 'opacity-50' : ''
            ]"
            @click="handleCheckout"
          >
            Mua ngay
          </UButton>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="cartItems.length > 0 && isProfileCart"
    class="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-300 p-4 z-50 md:hidden shadow-lg"
  >
    <div class="space-y-3">
      <UCheckbox
        v-model="allSelected"
        :label="`Chọn tất cả (${selectedItems.length})`"
        color="secondary"
        class="w-full"
        :ui="{
          base: 'size-5',
          indicator: 'size-5'
        }"
      />
      <div class="flex items-center justify-between gap-3">
        <div class="flex-1">
          <p class="text-sm text-neutral-600 mb-0.5">
            Tổng tiền tạm tính:
          </p>
          <p class="text-lg font-bold text-secondary">
            {{ formatPrice(totalPrice) }}
          </p>
        </div>
        <UButton
          color="primary"
          size="lg"
          :disabled="isCheckoutDisabled"
          :class="[
            'h-12 px-6 font-semibold text-base shrink-0',
            isCheckoutDisabled && !props.isProfileCart && props.finalTotal <= 0 ? 'opacity-50' : ''
          ]"
          @click="handleCheckout"
        >
          Mua ngay
        </UButton>
      </div>
    </div>
  </div>

  <SharedPaymentModal
    v-model="checkoutModalOpen"
    :payment-amount="paymentAmount"
    :payment-content="paymentContent"
    :bank-account="bankAccount"
    :bank-name="bankName"
    :account-holder="accountHolder"
    :qr-code-url="qrCodeUrl"
  />

  <UModal
    v-model:open="deleteModalOpen"
    :ui="{
      content: 'sm:max-w-lg',
      overlay: 'bg-black/40 backdrop-blur-[2px]',
      body: 'py-8 px-6',
      header: 'pb-6 pt-6 px-6',
      footer: 'pt-6 px-6 pb-6',
      title: 'text-xl font-bold text-gray-900 dark:text-white',
      description: 'text-base text-gray-600 dark:text-gray-400'
    }"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20">
          <UIcon
            name="i-lucide-alert-triangle"
            class="w-6 h-6 text-red-600 dark:text-red-400"
          />
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">
          Xác nhận xóa
        </h3>
      </div>
    </template>

    <template #body>
      <p class="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
        Bạn có chắc chắn muốn xóa sản phẩm
        <span class="font-semibold text-gray-900 dark:text-white">{{ itemToDelete?.title }}</span>
        khỏi giỏ hàng?
      </p>
    </template>

    <template #footer>
      <div class="flex gap-4 justify-end w-full">
        <UButton
          color="neutral"
          variant="outline"
          size="xl"
          class="min-h-14 px-8 text-base font-medium"
          @click="cancelDelete"
        >
          Hủy
        </UButton>
        <UButton
          color="error"
          size="xl"
          class="min-h-14 px-10 text-base font-semibold"
          @click="confirmDelete"
        >
          Xóa
        </UButton>
      </div>
    </template>
  </UModal>
</template>
