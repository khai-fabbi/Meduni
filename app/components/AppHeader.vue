<script setup lang="ts">
const route = useRoute();
const authStore = useAuthStore();
const { user, isLoggedIn } = storeToRefs(authStore);
const router = useRouter();

const items = computed(() => [
  {
    label: "Giới thiệu",
    to: "/gioi-thieu",
  },
  {
    label: "E-Learning",
    to: "/docs",
    active: route.path.startsWith("/docs"),
  },
  {
    label: "Khoá học",
    to: "/pricing",
  },
  {
    label: "AI trong Y tế",
    to: "/blog",
  },
  {
    label: "Y tế cộng đồng",
    to: "/changelog",
  },
]);

const userMenuItems = [
  [
    {
      label: "Hồ sơ",
      icon: "i-lucide-user",
      to: "/profile",
    },
    {
      label: "Cài đặt",
      icon: "i-lucide-settings",
      to: "/settings",
    },
  ],
  [
    {
      label: "Đăng xuất",
      icon: "i-lucide-log-out",
      color: "error",
      onSelect: () => {
        authStore.logout();
        router.push("/");
      },
    },
  ],
];

const userInitials = computed(() => {
  if (!user.value?.name) return "U";
  const names = user.value.name.split(" ").filter((n) => n.length > 0);
  if (names.length >= 2) {
    const first = names[0]?.[0];
    const last = names[names.length - 1]?.[0];
    if (first && last) {
      return (first + last).toUpperCase();
    }
  }
  const first = names[0]?.[0];
  if (first) {
    return first.toUpperCase();
  }
  return "U";
});
</script>

<template>
  <UHeader class="rounded-b-xl border-b-none shadow-lg h-16 md:h-[100px]">
    <template #left>
      <NuxtLink
        to="/"
        class="shrink-0 flex hover:opacity-80 transition-opacity"
      >
        <AppLogo class="w-[120px] h-auto md:w-[200px]" />
      </NuxtLink>
    </template>
    <div class="flex-1 flex items-center gap-4">
      <UNavigationMenu
        :items="items"
        variant="link"
        :ui="{
          linkLabel: 'text-base font-medium uppercase',
          link: 'py-1 px-1.5 text-default animate-link-underline data-[active]:text-primary',
          list: 'gap-2',
        }"
      />
    </div>

    <template #right>
      <UContentSearchButton
        label="Tìm kiếm nội dung"
        class="hidden rounded-md lg:flex"
        variant="ghost"
        color="primary"
      />
      <UColorModeButton />

      <ClientOnly>
        <template v-if="isLoggedIn">
          <UDropdownMenu
            :items="userMenuItems"
            :popper="{ placement: 'bottom-end' }"
          >
            <UAvatar
              :alt="user?.name || 'User'"
              size="xl"
              class="cursor-pointer"
            >
              <span class="text-sm font-semibold">{{ userInitials }}</span>
            </UAvatar>
          </UDropdownMenu>
        </template>

        <template v-else>
          <UButton
            icon="i-lucide-log-in"
            variant="ghost"
            to="/login"
            class="lg:hidden"
          />

          <UButton
            label="Đăng ký"
            variant="subtle"
            class="hidden lg:inline-flex min-h-12 max-w-[120px]"
            to="/signup"
            size="xl"
            block
          />
          <UButton
            label="Đăng nhập"
            variant="solid"
            to="/login"
            class="hidden lg:inline-flex min-h-12 max-w-[120px]"
            size="xl"
            block
          />
        </template>
      </ClientOnly>
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />

      <USeparator class="my-6" />

      <template v-if="isLoggedIn">
        <div class="flex items-center gap-3 mb-4">
          <UAvatar :alt="user?.name || 'User'" size="md">
            <span class="text-sm font-semibold">{{ userInitials }}</span>
          </UAvatar>
          <div class="flex-1">
            <p class="font-medium text-sm">{{ user?.name || "Người dùng" }}</p>
            <p class="text-xs text-default">{{ user?.email || user?.phone }}</p>
          </div>
        </div>
        <UButton
          label="Hồ sơ"
          variant="ghost"
          to="/profile"
          block
          class="mb-2"
        />
        <UButton
          label="Cài đặt"
          variant="ghost"
          to="/settings"
          block
          class="mb-2"
        />
        <UButton
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
        <UButton label="Đăng ký" variant="outline" to="/signup" block />
      </template>
    </template>
  </UHeader>
</template>
