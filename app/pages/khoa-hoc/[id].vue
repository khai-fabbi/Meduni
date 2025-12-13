<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const items = ref<BreadcrumbItem[]>([
  {
    label: 'Trang chủ',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: 'Khoá học',
    to: '/khoa-hoc'
  },
  {
    label: 'Chi tiết khóa học',
    to: '#'
  }
])
</script>

<template>
  <UContainer class="space-y-6 mb-10 md:mb-20">
    <UBreadcrumb
      :items="items"
    />
  </UContainer>
</template>
