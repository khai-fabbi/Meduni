<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const items = ref<BreadcrumbItem[]>([
  {
    label: 'Trang chủ',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: 'Y tế cộng đồng',
    icon: 'i-lucide-history',
    to: '/y-te-cong-dong'
  },
  {
    label: 'Chi tiết bài viết',
    to: '#'
  }
])
</script>

<template>
  <UContainer class="space-y-6 mb-10 md:mb-20">
    <UBreadcrumb
      :items="items"
    />

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
      <div class="lg:col-span-3">
        <Heading
          variant="h3"
          as="h1"
          class="text-primary"
        >
          Trí tuệ nhân tạo đang thay đổi cách con người làm việc ra sao?
        </Heading>
      </div>
      <div class="lg:col-span-1">
        <Heading
          variant="h3"
          as="h1"
          class="text-primary"
        >
          Bài viết liên quan
        </Heading>
      </div>
    </div>
  </UContainer>
</template>
