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

const { data: navigation } = await useAsyncData(
  'navigation',
  async () => {
    try {
      const data = await queryCollectionNavigation('docs')
      return data.find(item => item.path === '/docs')?.children || []
    } catch (error) {
      console.warn('Failed to load navigation:', error)
      return []
    }
  },
  {
    default: () => []
  }
)

const links = [
  {
    label: 'Giới thiệu',
    icon: 'i-lucide-book',
    to: '/gioi-thieu'
  },
  {
    label: 'E-Learning',
    icon: 'i-lucide-book',
    to: '/docs/getting-started'
  },
  {
    label: 'Khoá học',
    icon: 'i-lucide-book',
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
  }
]

provide('navigation', navigation)
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
        :navigation="navigation"
        :links="links"
        :fuse="{ resultLimit: 42 }"
        :color-mode="false"
        placeholder="Tìm kiếm nội dung"
      />
    </ClientOnly>
  </UApp>
</template>
