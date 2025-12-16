<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import SharedConfettiEffect from '~/components/shared/ConfettiEffect.vue'

useSeoMeta({
  title: 'Thanh toán thành công',
  description: 'Đơn hàng đã thanh toán thành công'
})

const items = ref<BreadcrumbItem[]>([
  {
    label: 'Trang chủ',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: 'Thanh toán thành công',
    to: '#'
  }
])

const isLoading = ref(true)
const confettiRef = ref<InstanceType<typeof SharedConfettiEffect> | null>(null)

const recommendedCourses = ref([
  {
    id: 1,
    title: 'Chiến lược trí tuệ nhân tạo dành cho lãnh đạo',
    duration: '13 giờ 24 phút',
    price: 7200000,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56'
  },
  {
    id: 2,
    title: 'Khóa đào tạo AI cho marketer không muốn bị tụt lại',
    duration: '13 giờ 24 phút',
    price: 6700000,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'
  },
  {
    id: 3,
    title: 'Chiến lược Marketing thời đại AI',
    duration: '11 giờ 15 phút',
    price: 5500000,
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136'
  },
  {
    id: 4,
    title: 'Bứt phá hiệu suất công việc - Chương trình đào tạo Micro MBA AI',
    duration: '8 giờ 00 phút',
    price: 12200000,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56'
  }
])

const carouselRef = ref<HTMLElement | null>(null)

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
    nextTick(() => {
      confettiRef.value?.trigger()
    })
  }, 1000)
})
</script>

<template>
  <UContainer>
    <div class="space-y-6 py-6">
      <UBreadcrumb
        :items="items"
        class="mb-6"
      />

      <SkeletonPaymentInfo v-if="isLoading" />
      <div
        v-else
        class="flex flex-col items-center justify-center text-center space-y-6 py-12 pt-0"
      >
        <NuxtImg
          src="/Robot.png"
          alt="MEDUNI Robot"
          class="w-48 h-auto"
          quality="100"
        />

        <div class="space-y-4">
          <Heading
            variant="h4"
            class="text-primary font-bold"
          >
            Đơn hàng đã thanh toán thành công
          </Heading>

          <p class="text-base text-neutral-600 max-w-2xl mx-auto mb-5">
            Quý khách vui lòng chờ đợi trong ít phút. Hệ thống đang tiến hành đồng bộ chương trình học vào tài khoản của quý khách.
          </p>

          <p class="text-base text-neutral-600 max-w-2xl mx-auto">
            Nếu có vấn đề cần được hỗ trợ, quý khách vui lòng liên hệ đội ngũ CSKH Học Viện MEDUNI
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <UButton
            to="/khoa-hoc"
            color="primary"
            size="lg"
            block
            class="h-14 text-base font-semibold bg-button-gradient"
          >
            Tiếp tục mua sắm
          </UButton>

          <UButton
            to="/profile/courses"
            color="primary"
            variant="outline"
            size="lg"
            block
            class="h-14 text-base font-semibold"
          >
            Khoá học của tôi
          </UButton>
        </div>
      </div>

      <div class="mt-6">
        <Heading
          variant="h3"
          class="mb-2"
        >
          Khoá học tương tự
        </Heading>

        <div class="relative">
          <SkeletonRecommendedCourses v-if="isLoading" />
          <div
            v-else
            ref="carouselRef"
          >
            <UCarousel
              v-slot="{ item }"
              auto-height
              arrows
              :prev="{
                icon: 'i-lucide-chevron-left',
                color: 'primary',
                variant: 'solid'
              }"
              :next="{
                icon: 'i-lucide-chevron-right',
                color: 'primary',
                variant: 'solid'
              }"
              :items="recommendedCourses"
              :ui="{
                item: 'lg:basis-1/4',
                controls: 'md:absolute md:-top-6 md:right-12'
              }"
              class="w-full mx-auto"
            >
              <CourseCard
                :key="item.id"
                :title="item.title"
                :duration="item.duration"
                :price="item.price"
                :image="item.image"
                class="my-4"
              />
            </UCarousel>
          </div>
        </div>
      </div>
    </div>

    <SharedConfettiEffect
      ref="confettiRef"
      :auto-trigger="false"
    />
  </UContainer>
</template>
