<script setup lang="ts">
import PopularCourseCard from '../course/PopularCourseCard.vue'
import SkeletonCourseCard from '../skeleton/CourseCard.vue'
import { services } from '~/services'
import type { Course } from '~/types/course'
import { getLinkFromS3 } from '~/utils/helpers'

const { addToCart, isLoading } = useAddToCart()

// Fetch popular courses from API with limit=6 and sort=2
const {
  data: coursesData,
  pending: isLoadingCourses,
  error: coursesError
} = services.courses.getList({
  limit: 6,
  sort: 2
}, { server: false })

// Map courses from API to PopularCourseCard format
const popularCourses = computed(() => {
  if (!coursesData.value?.data) return []
  const apiCourses = coursesData.value.data.data || []
  return apiCourses.map((course: Course) => ({
    id: course.course_id,
    title: course.course_name,
    description: course.description || '',
    duration: course.overview?.study_duration || '0 giờ',
    price: course.price || 0,
    image: course.course_image ? getLinkFromS3(course.course_image) : '/images/course/course-placeholder.png',
    to: `/khoa-hoc/${course.course_id}`,
    isOwned: course.is_owned || false
  }))
})
</script>

<template>
  <UContainer class="py-6 space-y-5 md:py-15">
    <Heading class="text-center">
      Khoá học <span class="text-secondary">được mua nhiều nhất</span>
    </Heading>

    <!-- Loading State -->
    <div
      v-if="isLoadingCourses"
      class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <SkeletonCourseCard
        v-for="i in 3"
        :key="i"
      />
    </div>

    <!-- Error State -->
    <div
      v-else-if="coursesError"
      class="flex flex-col justify-center items-center py-12 text-center"
    >
      <UIcon
        name="i-lucide-alert-circle"
        class="mb-4 size-12 text-neutral-400"
      />
      <p class="text-base text-neutral-600">
        Không thể tải khóa học. Vui lòng thử lại sau.
      </p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="popularCourses.length === 0"
      class="flex flex-col justify-center items-center py-12 text-center"
    >
      <UIcon
        name="i-lucide-book-open"
        class="mb-4 size-12 text-neutral-400"
      />
      <p class="text-base text-neutral-600">
        Chưa có khóa học nào.
      </p>
    </div>

    <!-- Courses Carousel -->
    <UCarousel
      v-else
      v-slot="{ item }"
      :items="popularCourses"
      wheel-gestures
      arrows
      :prev="{
        icon: 'i-lucide-chevron-left',
        color: 'primary',
        variant: 'subtle',
        class: 'shadow-sm'
      }"
      :next="{
        icon: 'i-lucide-chevron-right',
        color: 'primary',
        variant: 'subtle',
        class: 'shadow-sm'
      }"
      :ui="{
        item: 'sm:basis-1/2 md:basis-[45%] lg:basis-1/3 xl:basis-[28.5%]',
        container: 'py-3 relative',
        arrows: 'md:hidden',
        prev: 'sm:start-6',
        next: 'sm:end-6'
      }"
    >
      <PopularCourseCard
        :title="item.title"
        :description="item.description"
        :duration="item.duration"
        :price="item.price"
        :image="item.image"
        :to="item.to"
        :is-owned="item.isOwned"
        :course-id="item.id"
        :is-loading="isLoading(item.id)"
        @add-to-cart="addToCart"
      />
    </UCarousel>
  </UContainer>
</template>
