<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import type { Course, CoursesList } from '~/types/course'
import type { ApiResponse } from '~/types/common'
import SharedConfettiEffect from '~/components/shared/ConfettiEffect.vue'
import CourseCard from '~/components/course/CourseCard.vue'
import { getLinkFromS3 } from '~/utils/helpers'
import { ApiEndpoint } from '~/utils/apiEndpoint'
import { useCartStore } from '~/stores/cart'

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
const isLoadingRecommendedCourses = ref(true)
const confettiRef = ref<InstanceType<typeof SharedConfettiEffect> | null>(null)

const recommendedCourses = ref<Array<{
  id: string
  title: string
  duration: string
  price: number
  image?: string
  to?: string
}>>([])

const carouselRef = ref<HTMLElement | null>(null)

async function fetchRecommendedCourses() {
  try {
    isLoadingRecommendedCourses.value = true

    const cartStore = useCartStore()
    const { $api } = useNuxtApp()

    const ignoreIds = cartStore.cartApiItems
      .map(item => item.course_id)
      .filter(id => id && typeof id === 'string' && id.trim() !== '')

    console.log('cartApiItems:', cartStore.cartApiItems)
    console.log('ignoreIds:', ignoreIds)

    const queryParams: Record<string, string | number> = {
      page_number: 1,
      page_size: 8,
      sort: 1
    }

    if (ignoreIds.length > 0) {
      queryParams.ignore = ignoreIds.join(',')
    }

    const response = await $api<ApiResponse<CoursesList>>(ApiEndpoint.Courses.GetList, {
      method: 'GET',
      query: queryParams
    })

    if (response?.data?.data) {
      const courses = response.data.data as Course[]
      recommendedCourses.value = courses.map((course) => {
        const duration = course.overview?.study_duration || '0 giờ'

        let price = course.price || 0
        if (course.effective_duration && course.effective_duration.length > 0) {
          const defaultDuration = course.effective_duration.find(d => d.is_default)
          if (defaultDuration) {
            price = defaultDuration.price
          } else if (course.effective_duration[0]) {
            price = course.effective_duration[0].price
          }
        }

        return {
          id: course.course_id,
          title: course.course_name,
          duration,
          price,
          image: course.course_image ? getLinkFromS3(course.course_image) : undefined,
          to: `/khoa-hoc/${course.course_id}`,
          is_owned: course.is_owned || false
        }
      })
    } else {
      recommendedCourses.value = []
    }
  } catch (error) {
    console.error('Error fetching recommended courses:', error)
    recommendedCourses.value = []
  } finally {
    isLoadingRecommendedCourses.value = false
  }
}

onMounted(async () => {
  if (import.meta.client) {
    await fetchRecommendedCourses()
  }

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
            to="/profile/my-course"
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
          <div
            v-if="isLoadingRecommendedCourses"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div
              v-for="i in 4"
              :key="i"
              class="space-y-3"
            >
              <USkeleton class="w-full h-48 rounded-lg" />
              <USkeleton class="h-6 w-full" />
              <USkeleton class="h-5 w-2/3" />
              <USkeleton class="h-6 w-1/2" />
            </div>
          </div>
          <div
            v-else-if="recommendedCourses.length > 0"
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
                item: 'basis-1/2 sm:basis-1/3 md:basis-1/2 lg:basis-1/3 xl:basis-1/4',
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
                :to="item.to"
                :is-owned="item.is_owned || false"
                class="my-4"
              />
            </UCarousel>
          </div>
          <div
            v-else
            class="text-center py-8 text-neutral-500"
          >
            Không có khóa học đề xuất
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
