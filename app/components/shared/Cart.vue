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
  indirectCommission?: number
  directCommission?: number
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
                to="/khoa-hoc/1"
                class="flex gap-4 items-center flex-1 min-w-0"
              >

                <NuxtImg
                  :src="item.image"
                  :alt="item.title"
                  class="w-20 h-16 md:w-40 md:h-30 object-cover rounded-lg shrink-0"
                />

                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-base md:text-2xl text-primary mb-1 line-clamp-2">
                    {{ item.title }}
                  </h3>
                  <p class="text-sm md:text-lg mb-1 line-clamp-1">
                    Giảng viên: {{ formatInstructor(item.instructor) }}
                  </p>
                  <p class="text-xs md:text-base text-neutral-600">
                    {{ item.videoCount }} video • {{ item.duration }}
                  </p>
                </div>
              </NuxtLink>
            </div>

            <div class="flex items-center justify-between md:flex-col md:items-end gap-1 shrink-0 pl-8 md:pl-0">
              <span class="text-lg md:text-xl font-bold text-secondary">
                {{ formatPrice(item.price) }}
              </span>
              <span class="text-sm md:text-lg text-neutral-400 line-through">
                {{ formatPrice(item.originalPrice) }}
              </span>
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
            :disabled="selectedItems.length === 0"
            class="w-full md:w-40 h-14 text-center font-semibold text-base flex justify-center"
            @click="handleCheckout"
          >
            Mua ngay
          </UButton>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="cartItems.length > 0"
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
          :disabled="selectedItems.length === 0"
          class="h-12 px-6 font-semibold text-base shrink-0"
          @click="handleCheckout"
        >
          Mua ngay
        </UButton>
      </div>
    </div>
  </div>
</template>
