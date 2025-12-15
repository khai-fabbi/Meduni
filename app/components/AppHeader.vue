<script setup lang="ts">
import CartIcon from '~/assets/icons/cart.svg'
import UserIcon from '~/assets/icons/user.svg'

const route = useRoute()
const authStore = useAuthStore()
const { user, isLoggedIn } = storeToRefs(authStore)
const router = useRouter()

const baseItems = [
  {
    label: 'Giới thiệu',
    to: '/gioi-thieu'
  },
  {
    label: 'E-Learning',
    to: '/docs'
  },
  {
    label: 'Khoá học',
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
    active: item.to === '/docs' ? route.path.startsWith('/docs') : route.path === item.to
  }))

  return result
})

const userMenuItems = computed(() => [
  [
    {
      label: 'Hồ sơ',
      icon: UserIcon,
      to: '/profile'
    }
  ],
  [
    {
      label: 'Đăng xuất',
      icon: 'i-lucide-log-out',
      color: 'error',
      onSelect: () => {
        authStore.logout()
        router.push('/')
      }
    }
  ]
])

const isProfileMenuOpen = ref(false)

const profileSubMenuItems = [
  {
    label: 'Thông tin cá nhân',
    to: '/profile'
  },
  {
    label: 'Thông báo',
    to: '/profile/notifications'
  },
  {
    label: 'Giỏ hàng',
    to: '/carts'
  },
  {
    label: 'Chứng nhận của bạn',
    to: '/profile/certificates'
  },
  {
    label: 'Khoá học đã mua',
    to: '/profile/courses'
  },
  {
    label: 'Lộ trình học tập',
    to: '/profile/learning-paths'
  }
]

const userLastName = computed(() => {
  if (!user.value?.name) return ''
  const names = user.value.name.split(' ').filter(n => n.length > 0)
  if (names.length >= 2) {
    return names[names.length - 1]
  }
  return names[0] || ''
})

const cartCount = ref(2)
</script>

<template>
  <UHeader class="rounded-b-xl border-b-none shadow-lg h-16 md:h-[100px] bg-white">
    <template #left>
      <div class="flex items-center gap-3 md:gap-4 lg:gap-6 shrink-0">
        <NuxtLink
          to="/"
          class="shrink-0 flex hover:opacity-80 transition-opacity"
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
              list: 'gap-1 lg:gap-2'
            }"
          />
          <template #fallback>
            <div class="hidden lg:flex items-center gap-2 xl:gap-4">
              <template
                v-for="(item, index) in baseItems"
                :key="index"
              >
                <NuxtLink
                  :to="item.to"
                  class="text-sm xl:text-base font-medium uppercase py-1 px-1 lg:px-1.5 text-default"
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
      <div class="flex items-center justify-start lg:justify-end gap-2 md:gap-3 shrink-0">
        <UContentSearchButton
          label="Tìm kiếm nội dung"
          class="flex rounded-md w-5 h-5 text-neutral-600 px-0 lg:px-auto"
          variant="ghost"
        />
        <span class="hidden lg:block text-line-gray shrink-0">|</span>
        <ClientOnly>
          <NuxtLink
            to="/carts"
            class="relative flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
          >
            <CartIcon class="size-5 lg:size-6" />
            <span
              v-if="cartCount > 0"
              class="absolute top-1 right-0.5 lg:top-0.5 lg:right-0 flex items-center justify-center size-3 lg:size-4 px-1 text-xs font-semibold text-white bg-cart-badge rounded-full"
            >
              {{ cartCount }}
            </span>
          </NuxtLink>
        </ClientOnly>
        <span class="hidden lg:block text-line-gray shrink-0">|</span>
        <div class="flex items-center gap-2 md:gap-3 shrink-0">
          <ClientOnly>
            <template v-if="isLoggedIn">
              <div class="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
                <span class="text-sm xl:text-base text-default whitespace-nowrap">
                  Chào, <span class="font-bold">{{ userLastName }}</span>
                </span>
                <UDropdownMenu
                  :items="userMenuItems"
                  :popper="{ placement: 'bottom-end' }"
                >
                  <button class="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 border border-neutral-300 rounded-full bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-200 transition-colors cursor-pointer shrink-0">
                    <UserIcon
                      class="size-5 lg:size-6 text-default"
                    />
                  </button>
                </UDropdownMenu>
              </div>
              <UDropdownMenu
                :items="userMenuItems"
                :popper="{ placement: 'bottom-end' }"
                class="lg:hidden cursor-pointer hover:bg-gray-100"
              >
                <button class="flex items-center justify-center w-9 h-9 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer shrink-0">
                  <UserIcon
                    class="w-4 h-4 text-default"
                  />
                </button>
              </UDropdownMenu>
            </template>

            <template v-else>
              <UButton
                icon="i-lucide-log-in"
                variant="ghost"
                to="/login"
                class="lg:hidden cursor-pointer"
                size="sm"
              />

              <UButton
                label="Đăng ký"
                variant="subtle"
                class="hidden lg:inline-flex min-h-10 lg:min-h-12 max-w-[100px] lg:max-w-[120px] text-sm lg:text-base shrink-0"
                to="/signup"
                size="xl"
                block
              />
              <UButton
                label="Đăng nhập"
                variant="solid"
                to="/login"
                class="hidden lg:inline-flex min-h-10 lg:min-h-12 max-w-[100px] lg:max-w-[120px] text-sm lg:text-base shrink-0"
                size="xl"
                block
              />
            </template>
          </ClientOnly>
        </div>
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
            class="block text-base font-medium uppercase py-1 px-1.5 text-default hover:text-primary transition-colors"
            :class="{ 'text-primary': item.active || route.path === item.to }"
          >
            {{ item.label }}
          </NuxtLink>
        </template>
      </div>

      <div
        v-if="isLoggedIn"
        class="space-y-2"
      >
        <button
          class="w-full flex items-center justify-between text-base font-medium uppercase py-1 px-1.5 text-default hover:text-primary transition-colors"
          @click="isProfileMenuOpen = !isProfileMenuOpen"
        >
          <span>Hồ sơ</span>
          <UIcon
            :name="isProfileMenuOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
            class="w-4 h-4 transition-transform"
          />
        </button>
        <div
          v-show="isProfileMenuOpen"
          class="pl-4 mt-2 space-y-2"
        >
          <NuxtLink
            v-for="subItem in profileSubMenuItems"
            :key="subItem.to"
            :to="subItem.to"
            class="block text-base font-medium uppercase py-1 px-1.5 text-default hover:text-primary transition-colors"
            :class="{ 'text-primary': route.path === subItem.to || (subItem.to !== '/profile' && route.path.startsWith(subItem.to)) }"
          >
            {{ subItem.label }}
          </NuxtLink>
        </div>
      </div>

      <template v-if="isLoggedIn">
        <UButton
          class="mt-3"
          label="Đăng xuất"
          variant="outline"
          block
          @click="
            authStore.logout();
            router.push('/');
          "
        />
      </template>

      <template v-else>
        <UButton
          label="Đăng nhập"
          variant="solid"
          to="/login"
          block
          class="mb-3"
        />
        <UButton
          label="Đăng ký"
          variant="outline"
          to="/signup"
          block
        />
      </template>
    </template>
  </UHeader>
</template>
