<script setup lang="ts">
import CartIcon from '~/assets/icons/cart.svg'
import UserIcon from '~/assets/icons/user.svg'
import { profileMenuItems } from '~/utils/constants'

const route = useRoute()
const authStore = useAuthStore()
const { user, isLoggedIn } = storeToRefs(authStore)
const router = useRouter()
const toast = useToast()
const baseItems = [
  {
    label: 'Giới thiệu',
    to: '/gioi-thieu'
  },
  // {
  //   label: 'E-Learning',
  //   to: '/e-learning'
  // },
  {
    label: 'E-Learning',
    to: '/khoa-hoc'
  },
  {
    label: 'AI trong Y tế',
    to: '/ai-trong-y-te'
  },
  {
    label: 'Y tế cộng đồng',
    to: '/y-te-cong-dong'
  }
]

const items = computed(() => {
  const result = baseItems.map(item => ({
    ...item,
    active: item.to === '/khoa-hoc' ? route.path.startsWith('/khoa-hoc') : route.path === item.to
  }))

  return result
})

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

const userMenuItems = computed(() => [
  [
    {
      label: 'Hồ sơ',
      icon: UserIcon,
      to: '/profile'
    },
    {
      label: 'Khoá học của tôi',
      icon: 'i-lucide-zap',
      to: '/my-course'
    }
  ],
  [
    {
      label: 'Đăng xuất',
      icon: 'i-lucide-log-out',
      color: 'error',
      onSelect: handleLogoutClick
    }
  ]
])

const profileMenuLinks = computed(() =>
  profileMenuItems
    .filter(item => item.to)
    .map(item => ({
      ...item,
      to: item.to as string
    }))
)

const userLastName = computed(() => {
  if (!user.value?.user_name) return ''
  const names = user.value.user_name.split(' ').filter((n: string) => n.length > 0)
  if (names.length >= 2) {
    return names[names.length - 1]
  }
  return names[0] || ''
})

const cartCount = computed(() => {
  if (!user.value?.total_cart) return 0
  const count = user.value.total_cart
  return count || 0
})

const userAvatar = computed(() => {
  return user.value?.avatar || ''
})
</script>

<template>
  <UHeader
    class="rounded-b-xl border-b-none shadow-lg h-16 md:h-[100px] bg-white header-compact"
    :ui="{
      right: 'shrink-0'
    }"
  >
    <template #left>
      <div class="flex gap-3 items-center min-w-0 md:gap-4 lg:gap-6">
        <NuxtLink
          to="/"
          class="flex transition-opacity shrink-0 hover:opacity-80"
        >
          <AppLogo class="w-[120px] h-auto md:w-[200px]" />
        </NuxtLink>
        <ClientOnly>
          <UNavigationMenu
            :items="items"
            variant="link"
            class="hidden lg:flex"
            :ui="{
              linkLabel: 'text-sm lg:text-base font-medium uppercase',
              link: 'py-1 px-1 lg:px-1.5 text-default animate-link-underline data-[active]:text-primary',
              list: 'gap-1 lg:gap-2 xl:gap-0'
            }"
          />
          <template #fallback>
            <div class="hidden gap-2 items-center lg:flex xl:gap-4">
              <template
                v-for="(item, index) in baseItems"
                :key="index"
              >
                <NuxtLink
                  :to="item.to"
                  class="px-1 py-1 text-sm font-medium uppercase xl:text-base lg:px-1.5 text-default"
                >
                  {{ item.label }}
                </NuxtLink>
              </template>
            </div>
          </template>
        </ClientOnly>
      </div>
    </template>

    <template #right>
      <div
        class="flex gap-2 justify-end items-center min-w-0 md:gap-3 shrink-0"
        :class="{ 'md:pr-5': !isLoggedIn }"
      >
        <ClientOnly>
          <NuxtLink
            to="/carts"
            class="flex relative justify-center items-center w-9 h-9 rounded-md transition-colors lg:w-10 lg:h-10 hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
          >
            <CartIcon class="size-5 lg:size-6" />
            <span
              v-if="cartCount > 0"
              class="flex absolute right-0.5 top-1 justify-center items-center px-1 text-xs font-semibold text-white rounded-full lg:top-0.5 lg:right-0 size-3 lg:size-4 bg-cart-badge"
            >
              {{ cartCount }}
            </span>
          </NuxtLink>
          <span class="hidden lg:block text-line-gray shrink-0">|</span>
          <div class="flex gap-2 items-center min-w-0 md:gap-3">
            <template v-if="isLoggedIn">
              <div class="hidden gap-2 items-center min-w-0 lg:flex xl:gap-3">
                <span class="text-sm whitespace-nowrap xl:text-base text-default">
                  Chào, <span class="font-bold">{{ userLastName }}</span>
                </span>
                <UDropdownMenu
                  :items="userMenuItems"
                  :popper="{ placement: 'bottom-end' }"
                >
                  <button class="flex overflow-hidden justify-center items-center w-10 h-10 rounded-full border transition-colors cursor-pointer lg:w-12 lg:h-12 border-neutral-300 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-200 shrink-0">
                    <UAvatar
                      :src="userAvatar"
                      :alt="user?.user_name || 'User'"
                      class="w-full h-full"
                    />
                  </button>
                </UDropdownMenu>
              </div>
              <UDropdownMenu
                :items="userMenuItems"
                :popper="{ placement: 'bottom-end' }"
                class="cursor-pointer lg:hidden hover:bg-gray-100"
              >
                <button class="flex overflow-hidden justify-center items-center w-9 h-9 rounded-md transition-colors cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0">
                  <UAvatar
                    :src="userAvatar"
                    :alt="user?.user_name || 'User'"
                    class="w-full h-full"
                  />
                </button>
              </UDropdownMenu>
            </template>

            <template v-else>
              <UButton
                icon="i-lucide-log-in"
                variant="ghost"
                to="/login"
                class="cursor-pointer lg:hidden"
                size="sm"
              />

              <div class="hidden gap-2 items-center lg:flex md:gap-3">
                <UButton
                  label="Đăng ký"
                  variant="subtle"
                  class="text-sm min-h-10 lg:min-h-12 max-w-25 shrink-0"
                  to="/signup"
                  size="xl"
                  block
                />
                <UButton
                  label="Đăng nhập"
                  variant="solid"
                  to="/login"
                  class="text-sm min-h-10 lg:min-h-12 max-w-25 shrink-0"
                  size="xl"
                  block
                />
              </div>
            </template>
          </div>
        </ClientOnly>
      </div>
    </template>

    <template #body>
      <div class="space-y-2">
        <template
          v-for="(item, index) in items"
          :key="index"
        >
          <NuxtLink
            :to="item.to"
            class="block px-1.5 py-1 text-base font-medium uppercase transition-colors text-default hover:text-primary"
            :class="{ 'text-primary': item.active || route.path === item.to }"
          >
            {{ item.label }}
          </NuxtLink>
        </template>
      </div>

      <UCollapsible
        v-if="isLoggedIn"
        class=""
      >
        <UButton
          class="px-2 w-full text-base font-medium uppercase group"
          label="Hồ sơ"
          color="neutral"
          variant="ghost"
          trailing-icon="i-lucide-chevron-down"
          :ui="{
            trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
          }"
          block
        />

        <!-- <template #trigger="{ toggle }">
          <button
            class="flex justify-between items-center px-1.5 py-1 w-full text-base font-medium uppercase transition-colors text-default hover:text-primary"
            @click="toggle"
          >
            <span>Hồ sơ</span>
            <UIcon
              :name="isProfileMenuOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
              class="w-4 h-4 transition-transform"
            />
          </button>
        </template> -->
        <template #content>
          <div class="pl-4 mt-2 space-y-2">
            <NuxtLink
              v-for="subItem in profileMenuLinks"
              :key="String(subItem.to)"
              :to="subItem.to as string"
              class="flex gap-2 items-center px-1.5 py-1 text-base font-medium uppercase transition-colors text-default hover:text-primary"
              :class="{ 'text-primary': route.path === subItem.to || (subItem.to !== '/profile' && route.path.startsWith(subItem.to)) }"
            >
              <UIcon
                v-if="subItem.icon && typeof subItem.icon === 'string'"
                :name="subItem.icon"
                class="w-4 h-4 text-current"
              />
              {{ subItem.label }}
            </NuxtLink>
          </div>
        </template>
      </UCollapsible>

      <template v-if="isLoggedIn">
        <UButton
          class="mt-3"
          label="Đăng xuất"
          variant="outline"
          block
          @click="handleLogoutClick"
        />
      </template>

      <template v-else>
        <UButton
          label="Đăng nhập"
          variant="solid"
          to="/login"
          block
          class="my-3"
        />
        <UButton
          label="Đăng ký"
          variant="outline"
          to="/signup"
          block
        />
      </template>
    </template>

    <!-- Logout Confirmation Modal -->
    <SharedConfirmModal
      v-model:open="showLogoutModal"
      title="Xác nhận đăng xuất"
      description="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?"
      :loading="isLoggingOut"
      @confirm="handleLogout"
      @close="showLogoutModal = false"
    />
  </UHeader>
</template>

<style>
@media (max-width: 1600px) and (min-width: 1300px) {
  .header-compact [data-slot="left"] {
    flex: 0 0.1 auto !important;
    min-width: 0 !important;
    overflow: hidden !important;
  }
}
</style>
