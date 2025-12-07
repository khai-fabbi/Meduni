<script setup lang="ts">
useSeoMeta({
  title: "Thông báo",
  description: "Thông báo của bạn",
});

definePageMeta({
  layout: "profile",
});

const notifications = ref([
  {
    id: 1,
    title: "Khoá học mới đã được thêm vào",
    message: "Khoá học 'AI trong Y tế' đã được thêm vào danh sách khoá học của bạn",
    time: "2 giờ trước",
    read: false,
    type: "course",
  },
  {
    id: 2,
    title: "Chứng nhận đã sẵn sàng",
    message: "Chứng nhận hoàn thành khoá học 'Y tế cộng đồng' đã sẵn sàng để tải xuống",
    time: "1 ngày trước",
    read: false,
    type: "certificate",
  },
  {
    id: 3,
    title: "Nhắc nhở học tập",
    message: "Bạn có bài học mới chưa hoàn thành trong khoá học 'Lộ trình học tập'",
    time: "2 ngày trước",
    read: true,
    type: "reminder",
  },
  {
    id: 4,
    title: "Thanh toán thành công",
    message: "Thanh toán cho khoá học 'AI trong Y tế' đã được xử lý thành công",
    time: "3 ngày trước",
    read: true,
    type: "payment",
  },
  {
    id: 5,
    title: "Cập nhật hệ thống",
    message: "Hệ thống đã được cập nhật với nhiều tính năng mới. Hãy khám phá ngay!",
    time: "5 ngày trước",
    read: true,
    type: "system",
  },
]);
</script>

<template>
  <div class="bg-white rounded-sm p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Thông báo</h1>
      <UButton color="neutral" variant="ghost" size="sm">Đánh dấu tất cả đã đọc</UButton>
    </div>

    <div class="space-y-3">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="p-4 rounded-lg border"
        :class="notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'"
      >
        <div class="flex items-start gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-semibold">{{ notification.title }}</h3>
              <UBadge v-if="!notification.read" color="primary" size="xs">Mới</UBadge>
            </div>
            <p class="text-gray-600 text-sm mb-2">{{ notification.message }}</p>
            <p class="text-gray-400 text-xs">{{ notification.time }}</p>
          </div>
          <UButton
            v-if="!notification.read"
            color="neutral"
            variant="ghost"
            size="xs"
            icon="i-lucide-check"
          >
            Đánh dấu đã đọc
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

