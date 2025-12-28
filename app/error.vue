<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

useSeoMeta({
  title: props.error?.statusCode === HttpCode.NOT_FOUND ? 'Không tìm thấy trang' : 'Lỗi máy chủ',
  description: props.error?.message
})

const statusCode = computed(() => props.error?.statusCode || 500)

const errorConfig = computed(() => {
  if (statusCode.value === 404) {
    return {
      title: '404',
      heading: 'Không tìm thấy trang',
      message: 'Chúng tôi không thể tìm thấy trang bạn đang tìm kiếm...'
    }
  }
  return {
    title: '500',
    heading: 'Lỗi máy chủ',
    message: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau...'
  }
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div>
    <AppHeader />

    <div class="relative h-screen flex items-center justify-center overflow-hidden">
      <NuxtImg
        src="/bg_error_not_found.png"
        alt="Error background"
        class="absolute inset-0 w-full h-full object-cover object-center md:object-cover"
        :class="{
          'object-top': true,
          'md:object-center': true
        }"
        :placeholder="[20, 5]"
      />

      <div class="relative z-10 text-center px-4 pt-0 pb-8 md:pb-12 w-full">
        <h1 class="text-[8rem] md:text-[18rem] font-extrabold text-white mb-2 md:mb-4 drop-shadow-lg leading-none">
          {{ errorConfig.title }}
        </h1>
        <h2 class="text-2xl md:text-[2rem] font-bold text-white mb-2 md:mb-4">
          {{ errorConfig.heading }}
        </h2>
        <p class="text-sm md:text-xl text-white/90 mb-6 md:mb-8 w-full mx-auto px-2">
          {{ errorConfig.message }}
        </p>
        <UButton
          to="/"
          color="primary"
          size="xl"
          class="bg-white justify-center rounded-full text-primary hover:bg-white/90 font-semibold w-full md:w-60 h-12 md:h-15 text-sm md:text-base"
          trailing-icon="i-lucide-arrow-right"
          @click="handleError"
        >
          Quay lại trang chủ
        </UButton>
      </div>
    </div>

    <AppFooter />
  </div>
</template>
