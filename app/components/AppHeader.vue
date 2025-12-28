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
  {
    label: 'E-Learning',
    to: '/e-learning'
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
    active: item.to === '/khoa-hoc' ? route.path.startsWith('/khoa-hoc') : route.path === item.to
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
      onSelect: async () => {
        await authStore.logout()
        toast.add({
          title: 'Đăng xuất thành công',
          description: 'Bạn đã đăng xuất thành công',
          color: 'success'
        })
        router.push('/')
      }
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
  // const count = parseInt(user.value.total_cart, 10)
  // return isNaN(count) ? 0 : count
  return 0
})

const userAvatar = computed(() => {
  return user.value?.avatar || ''
})
</script>

<template>
  <UHeader class="rounded-b-xl border-b-none shadow-lg h-16 md:h-[100px] bg-white header-compact">
    <template #left>
      <div class="flex items-center gap-3 md:gap-4 lg:gap-6 min-w-0">
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
              list: 'gap-1 lg:gap-2 xl:gap-0'
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
      <div class="flex items-center justify-end gap-2 md:gap-3 min-w-0 shrink">
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
        <div class="flex items-center gap-2 md:gap-3 min-w-0">
          <ClientOnly>
            <template v-if="isLoggedIn">
              <div class="hidden lg:flex items-center gap-2 xl:gap-3 min-w-0">
                <span class="text-sm xl:text-base text-default whitespace-nowrap">
                  Chào, <span class="font-bold">{{ userLastName }}</span>
                </span>
                <UDropdownMenu
                  :items="userMenuItems"
                  :popper="{ placement: 'bottom-end' }"
                >
                  <button class="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 border border-neutral-300 rounded-full bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-200 transition-colors cursor-pointer shrink-0 overflow-hidden">
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
                class="lg:hidden cursor-pointer hover:bg-gray-100"
              >
                <button class="flex items-center justify-center w-9 h-9 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer shrink-0 overflow-hidden">
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
                class="lg:hidden cursor-pointer"
                size="sm"
              />

              <div class="hidden lg:flex items-center gap-2 md:gap-3 min-w-0">
                <UButton
                  label="Đăng ký"
                  variant="subtle"
                  class="min-h-10 lg:min-h-12 max-w-[100px] lg:max-w-[120px] text-sm lg:text-base shrink-0"
                  to="/signup"
                  size="xl"
                  block
                />
                <UButton
                  label="Đăng nhập"
                  variant="solid"
                  to="/login"
                  class="min-h-10 lg:min-h-12 max-w-[100px] lg:max-w-[120px] text-sm lg:text-base shrink-0"
                  size="xl"
                  block
                />
              </div>
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

      <UCollapsible
        v-if="isLoggedIn"
        class=""
      >
        <UButton
          class="text-base font-medium uppercase px-2 w-full group"
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
            class="w-full flex items-center justify-between text-base font-medium uppercase py-1 px-1.5 text-default hover:text-primary transition-colors"
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
              class="flex items-center gap-2 text-base font-medium uppercase py-1 px-1.5 text-default hover:text-primary transition-colors"
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

<style>
@media (max-width: 1600px) and (min-width: 1300px) {
  .header-compact [data-slot="left"] {
    flex: 0 0.1 auto !important;
    min-width: 0 !important;
    overflow: hidden !important;
  }

  .header-compact [data-slot="right"] {
    flex: 0 0.1 auto !important;
    min-width: 0 !important;
    margin: auto;
  }
}

@media (max-width: 1300px) {
  .header-search-btn,
  .header-separator-1 {
    display: none !important;
  }

  .header-compact [data-slot="right"] {
    justify-content: flex-start !important;
  }
}
</style>
