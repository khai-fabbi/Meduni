<script setup lang="ts">
export interface CartItem {
  id: number
  title: string
  instructor: string | string[]
  price: number
  originalPrice: number
  image: string
  videoCount: number
  duration: string
  selected?: boolean
}

interface Props {
  items: CartItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:items': [items: CartItem[]]
  'checkout': [items: CartItem[]]
}>()

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
  emit('checkout', selectedItems.value)
}
</script>

<template>
  <div class="bg-white rounded-sm pb-10">
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
      <div class="flex items-center justify-between h-18 rounded-sm rounded-b-none bg-primary-light">
        <div class="flex items-center gap-3 px-4">
          <UIcon
            name="i-lucide-shopping-cart"
            class="size-5 text-secondary"
          />
          <span class="text-lg">
            <span class="font-bold">{{ cartItems.length }} sản phẩm</span> đã được thêm vào giỏ hàng
          </span>
        </div>
        <span class="text-lg font-medium px-4">
          Giá tiền
        </span>
      </div>

      <div class="space-y-4">
        <div
          v-for="item in cartItems"
          :key="item.id"
          class="flex items-center gap-4 p-4 rounded-lg"
        >
          <UCheckbox
            color="secondary"
            :model-value="item.selected"
            @update:model-value="toggleItem(item.id)"
          />

          <NuxtImg
            :src="item.image"
            :alt="item.title"
            class="w-32 h-24 object-cover rounded-lg shrink-0"
          />

          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-2xl text-primary mb-1">
              {{ item.title }}
            </h3>
            <p class="text-lg mb-1">
              Giảng viên: {{ formatInstructor(item.instructor) }}
            </p>
            <p class="text-base text-neutral-600">
              {{ item.videoCount }} video • {{ item.duration }}
            </p>
          </div>

          <div class="flex flex-col items-end gap-1 shrink-0">
            <span class="text-xl font-bold text-secondary">
              {{ formatPrice(item.price) }}
            </span>
            <span class="text-lg text-neutral-400 line-through">
              {{ formatPrice(item.originalPrice) }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between pt-6 border-t border-neutral-300 ps-4 pe-4">
        <UCheckbox
          v-model="allSelected"
          :label="`Chọn tất cả (${selectedItems.length})`"
          color="secondary"
        />

        <div class="flex items-center">
          <div class="text-right pr-7.5">
            <p class="text-lg mb-1">
              Tổng tiền tạm tính: <span class="text-secondary font-bold">
                {{ formatPrice(totalPrice) }}
              </span>
            </p>
          </div>
          <UButton
            color="primary"
            size="lg"
            :disabled="selectedItems.length === 0"
            class="w-40 h-14 text-center font-semibold text-base flex justify-center"
            @click="handleCheckout"
          >
            Mua ngay
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
