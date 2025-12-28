<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { profileMenuItems } from '~/utils/constants'

const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()

const showLogoutModal = ref(false)
const isLoggingOut = ref(false)

async function handleLogout() {
  isLoggingOut.value = true
  try {
    await authStore.logout()
    toast.add({
      title: 'Đăng xuất thành công',
      description: 'Bạn đã đăng xuất thành công',
      color: 'success'
    })
    showLogoutModal.value = false
    router.push('/')
  } catch {
    toast.add({
      title: 'Đăng xuất thất bại',
      description: 'Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại',
      color: 'error'
    })
  } finally {
    isLoggingOut.value = false
  }
}

function handleLogoutClick() {
  showLogoutModal.value = true
}

const logoutItem: NavigationMenuItem = {
  label: 'Đăng xuất',
  icon: 'i-lucide-log-out',
  class:
    'text-red-500 cursor-pointer hover:text-red-500 hover:bg-red-500/10 hover:[&>span]:text-red-500',
  onSelect: handleLogoutClick
}

const items = ref<NavigationMenuItem[][]>([
  [...profileMenuItems, logoutItem]
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

  <!-- Logout Confirmation Modal -->
  <SharedConfirmModal
    v-model:open="showLogoutModal"
    title="Xác nhận đăng xuất"
    description="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?"
    :loading="isLoggingOut"
    @confirm="handleLogout"
    @close="showLogoutModal = false"
  />
</template>
