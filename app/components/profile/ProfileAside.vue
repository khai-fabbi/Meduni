<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const authStore = useAuthStore()
const toast = useToast()
const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'Thông tin cá nhân',
      icon: 'i-lucide-book-open',
      to: '/profile'
    },
    {
      label: 'Thông báo',
      icon: 'i-lucide-bell',
      to: '/profile/notifications'
    },
    {
      label: 'Giỏ hàng',
      icon: 'i-lucide-shopping-cart',
      to: '/profile/cart'
    },
    {
      label: 'Chứng nhận của bạn',
      icon: 'i-lucide-award',
      to: '/profile/certificates'
    },
    {
      label: 'Khoá học đã mua',
      icon: 'i-lucide-book',
      to: '/profile/courses'
    },
    {
      label: 'Lộ trình học tập',
      icon: 'i-lucide-route',
      to: '/profile/learning-paths'
    },
    {
      label: 'Đăng xuất',
      icon: 'i-lucide-log-out',
      class:
        'text-red-500 cursor-pointer hover:text-red-500 hover:bg-red-500/10 hover:[&>span]:text-red-500',
      onSelect: () => {
        authStore.logout()
        navigateTo('/')
        toast.add({
          title: 'Đăng xuất thành công',
          description: 'Bạn đã đăng xuất thành công',
          color: 'success'
        })
      }
    }
  ]
])
</script>

<template>
  <UNavigationMenu
    orientation="vertical"
    :items="items"
    class="data-[orientation=vertical]:w-full p-6 bg-white rounded-sm sticky top-35"
    :ui="{
      list: 'space-y-2.5',
      link: 'text-base rounded-sm px-4 gap-3 min-h-14 text-default data-[active]:text-primary data-[active]:font-semibold data-[active]:bg-[#DFEEFF]',
      linkLeadingIcon: 'text-current'
    }"
  />
</template>
