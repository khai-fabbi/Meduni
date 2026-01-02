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
      class="py-12 text-center"
    >
      <p class="text-lg text-neutral-500">
        Giỏ hàng của bạn đang trống
      </p>
    </div>

    <div
      v-else
      class="space-y-6"
    >
      <div class="flex flex-col py-3 mb-0 h-auto rounded-sm rounded-b-none md:flex-row md:items-center md:justify-between md:h-18 bg-primary-light md:py-0 md:mb-6">
        <div class="flex gap-3 items-center px-3">
          <UIcon
            name="i-lucide-shopping-cart"
            class="size-5 text-secondary shrink-0"
          />
          <span class="text-sm md:text-lg">
            <span class="font-bold">{{ cartItems.length }} sản phẩm</span> đã được thêm vào giỏ hàng
          </span>
        </div>
        <span class="hidden px-3 mt-2 text-sm font-medium md:block md:text-lg md:mt-0">
          Giá tiền
        </span>
      </div>

      <div class="space-y-4">
        <template
          v-for="item in cartItems"
          :key="item.id"
        >
          <div
            class="flex flex-col gap-3 p-3 mb-0 rounded-lg md:flex-row md:items-center md:gap-4 md:pt-0 md:pb-0 md:mb-4"
          >
            <div class="flex flex-1 gap-4 items-center min-w-0">
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
                class="flex flex-1 gap-4 items-center min-w-0"
              >

                <NuxtImg
                  :src="item.image"
                  :alt="item.title"
                  class="object-cover w-20 h-16 rounded-sm md:w-40 md:h-30 md:rounded-lg shrink-0"
                  :placeholder="[20, 20]"
                  width="160"
                  height="120"
                  loading="lazy"
                />

                <div class="flex-1 min-w-0">
                  <h3 class="mb-1 text-base font-bold leading-tight md:text-2xl text-primary line-clamp-2">
                    {{ item.title }}
                  </h3>
                  <p class="mb-1 text-sm md:text-lg line-clamp-1">
                    Giảng viên: {{ formatInstructor(item.instructor) }}
                  </p>
                  <p class="text-xs md:text-base text-neutral-600">
                    {{ item.videoCount && item.videoCount > 0 ? `${item.videoCount} video` : '' }} • {{ item.duration }}
                  </p>
                </div>
              </NuxtLink>
            </div>

            <div class="flex gap-2 items-start pl-8 md:flex-col md:items-end shrink-0 md:pl-0">
              <div class="flex flex-col gap-1 items-end">
                <span class="text-lg font-bold md:text-xl text-secondary">
                  {{ formatPrice(item.price) }}
                </span>
                <span
                  v-if="item.originalPrice && item.originalPrice !== item.price"
                  class="text-sm line-through md:text-lg text-neutral-400"
                >
                  {{ formatPrice(item.originalPrice) }}
                </span>
              </div>
              <button
                type="button"
                class="relative z-10 p-2 pb-0 -mt-1 rounded-md transition-colors cursor-pointer shrink-0 text-neutral-500 hover:text-error hover:bg-neutral-100"
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

      <div class="hidden pt-4 md:flex md:items-center md:justify-between ps-4 pe-4 border-neutral-300">
        <UCheckbox
          v-model="allSelected"
          :ui="{
            base: 'size-5',
            indicator: 'size-5'
          }"
          :label="`Chọn tất cả (${selectedItems.length})`"
          color="secondary"
        />

        <div class="flex flex-row gap-4 items-center">
          <div class="pr-0 text-left md:text-right md:pr-7.5">
            <p class="mb-1 text-base md:text-lg">
              Tổng tiền tạm tính: <span class="font-bold text-secondary">
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
    class="fixed right-0 bottom-0 left-0 z-50 p-4 bg-white border-t shadow-lg border-neutral-300 md:hidden"
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
      <div class="flex gap-3 justify-between items-center">
        <div class="flex-1">
          <p class="mb-0.5 text-sm text-neutral-600">
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
      <div class="flex gap-3 items-center">
        <div class="flex justify-center items-center w-12 h-12 bg-red-100 rounded-full dark:bg-red-900/20">
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
      <p class="text-base leading-relaxed text-gray-700 dark:text-gray-300">
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
          class="px-8 text-base font-medium min-h-14"
          @click="cancelDelete"
        >
          Hủy
        </UButton>
        <UButton
          color="error"
          size="xl"
          class="px-10 text-base font-semibold min-h-14"
          @click="confirmDelete"
        >
          Xóa
        </UButton>
      </div>
    </template>
  </UModal>
</template>
