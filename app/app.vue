<script setup lang="ts">
const colorMode = useColorMode()

const color = computed(() =>
  colorMode.value === 'dark' ? '#020618' : 'white'
)

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  titleTemplate: 'MEDUNI - AI-Powered Medical Transcription',
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/saas-light.png',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/saas-light.png',
  twitterCard: 'summary_large_image'
})

const links = [
  {
    label: 'Giới thiệu',
    icon: 'i-lucide-zap',
    to: '/gioi-thieu'
  },
  {
    label: 'E-Learning',
    icon: 'i-lucide-graduation-cap',
    to: '/e-learning'
  },
  {
    label: 'Khoá học',
    icon: 'i-lucide-tv-minimal-play',
    to: '/khoa-hoc'
  },
  {
    label: 'AI trong Y tế',
    icon: 'i-lucide-pencil',
    to: '/ai-trong-y-te'
  },
  {
    label: 'Y tế cộng đồng',
    icon: 'i-lucide-history',
    to: '/y-te-cong-dong'
  },
  {
    label: 'Trang cá nhân',
    icon: 'i-lucide-user-circle',
    to: '/profile'
  }

]
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ClientOnly>
      <LazyUContentSearch
        shortcut="meta_k"
        :links="links"
        :fuse="{ resultLimit: 42 }"
        :color-mode="false"
        placeholder="Tìm kiếm nội dung"
      />
    </ClientOnly>
  </UApp>
</template>
