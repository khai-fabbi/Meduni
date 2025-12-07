<script setup lang="ts">
const columns = [
  {
    label: "Resources",
    children: [
      {
        label: "Help center",
      },
      {
        label: "Docs",
      },
      {
        label: "Roadmap",
      },
      {
        label: "Changelog",
      },
    ],
  },
  {
    label: "Liên kết nhanh",
    children: [
      {
        label: "Trang chủ",
      },
      {
        label: "Về chúng tôi",
      },
      {
        label: "Danh sách chương trình",
      },
      {
        label: "Chương trình của tôi",
      },
      {
        label: "Liên hệ",
      },
    ],
  },
  {
    label: "Về chúng tôi",
    children: [
      {
        label: "Điều khoản sử dụng",
      },
      {
        label: "Chính sách riêng tư",
      },
      {
        label: "Chính sách thanh toán",
      },
      {
        label: "Hồ sơ năng lực",
      },
    ],
  },
];

const toast = useToast();

const email = ref("");
const loading = ref(false);

function onSubmit() {
  loading.value = true;

  toast.add({
    title: "Subscribed!",
    description: "You've been subscribed to our newsletter.",
  });
}
</script>

<template>
  <USeparator icon="i-simple-icons-nuxtdotjs" class="h-px" />

  <UFooter :ui="{ top: 'border-b border-default' }">
    <template #top>
      <UContainer>
        <UFooterColumns :columns="columns">
          <template #right>
            <form @submit.prevent="onSubmit">
              <UFormField
                name="email"
                label="Đăng ký Học viện của chúng tôi để nhận thêm các bản cập nhật trong tương lai"
              >
                <UInput
                  v-model="email"
                  type="email"
                  class="w-full"
                  placeholder="Nhập email của bạn"
                >
                  <template #trailing>
                    <UIcon name="i-lucide-send" class="size-5 text-primary" />
                  </template>
                </UInput>
              </UFormField>
            </form>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <p class="text-muted text-sm">
        © 2023 Học viện MEDUNI. All rights reserved. MST: 0111091161 - Cấp tại
        Sở tài chính thành phố Hà Nội
      </p>
    </template>

    <template #right>
      <UButton
        to="https://go.nuxt.com/discord"
        target="_blank"
        icon="i-simple-icons-discord"
        aria-label="Nuxt on Discord"
        color="neutral"
        variant="ghost"
      />
      <UButton
        to="https://go.nuxt.com/x"
        target="_blank"
        icon="i-simple-icons-x"
        aria-label="Nuxt on X"
        color="neutral"
        variant="ghost"
      />
      <UButton
        to="https://github.com/nuxt-ui-templates/saas"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="Nuxt UI on GitHub"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
