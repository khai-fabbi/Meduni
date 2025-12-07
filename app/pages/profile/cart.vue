<script setup lang="ts">
useSeoMeta({
  title: "Giỏ hàng",
  description: "Giỏ hàng của bạn",
});

definePageMeta({
  layout: "profile",
});

const cartItems = ref([
  {
    id: 1,
    title: "Khoá học AI trong Y tế",
    instructor: "TS. Nguyễn Văn B",
    price: 2990000,
    originalPrice: 3990000,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
    duration: "12 tuần",
  },
  {
    id: 2,
    title: "Y tế cộng đồng nâng cao",
    instructor: "PGS. Trần Thị C",
    price: 1990000,
    originalPrice: 2490000,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400",
    duration: "8 tuần",
  },
  {
    id: 3,
    title: "Lộ trình học tập chuyên sâu",
    instructor: "TS. Lê Văn D",
    price: 4990000,
    originalPrice: 5990000,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
    duration: "16 tuần",
  },
]);

const total = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price, 0);
});

const removeItem = (id: number) => {
  cartItems.value = cartItems.value.filter((item) => item.id !== id);
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};
</script>

<template>
  <div class="bg-white rounded-sm p-6">
    <h1 class="text-2xl font-bold mb-6">Giỏ hàng</h1>

    <div v-if="cartItems.length === 0" class="text-center py-12">
      <p class="text-gray-500">Giỏ hàng của bạn đang trống</p>
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="item in cartItems"
        :key="item.id"
        class="flex gap-4 p-4 border rounded-lg"
      >
        <img
          :src="item.image"
          :alt="item.title"
          class="w-32 h-24 object-cover rounded"
        />
        <div class="flex-1">
          <h3 class="font-semibold text-lg mb-1">{{ item.title }}</h3>
          <p class="text-gray-600 text-sm mb-2">
            Giảng viên: {{ item.instructor }}
          </p>
          <p class="text-gray-600 text-sm mb-3">
            Thời lượng: {{ item.duration }}
          </p>
          <div class="flex items-center gap-3">
            <span class="text-lg font-bold text-primary">{{
              formatPrice(item.price)
            }}</span>
            <span class="text-sm text-gray-400 line-through">{{
              formatPrice(item.originalPrice)
            }}</span>
          </div>
        </div>
        <UButton
          color="error"
          variant="ghost"
          icon="i-lucide-trash-2"
          @click="removeItem(item.id)"
        />
      </div>

      <div class="border-t pt-6 mt-6">
        <div class="flex justify-between items-center mb-4">
          <span class="text-lg font-semibold">Tổng cộng:</span>
          <span class="text-2xl font-bold text-primary">{{
            formatPrice(total)
          }}</span>
        </div>
        <UButton color="primary" size="lg" block>Thanh toán</UButton>
      </div>
    </div>
  </div>
</template>
