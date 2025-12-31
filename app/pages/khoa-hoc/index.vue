<script setup lang="ts">
import { motion } from 'motion-v'
import CourseCard from '~/components/course/CourseCard.vue'
import SkeletonCourseCard from '~/components/skeleton/CourseCard.vue'
import { services } from '~/services'
import type { Course } from '~/types/course'
import { getLinkFromS3, goToTop } from '~/utils/helpers'

const route = useRoute()
const router = useRouter()

const title = 'Tất cả khóa học - MedUni.ai'
const description = 'Khám phá các khóa học về trí tuệ nhân tạo, công nghệ và y tế. Trang bị kiến thức, kỹ năng và tư duy công nghệ cho thế hệ tương lai.'

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

const PAGE_SIZE = 16

// Get query params from route
const selectedCategory = computed(() => (route.query.category as string) || 'all')
const searchQuery = computed(() => (route.query.q as string) || '')
const currentPage = computed(() => {
  const page = route.query.page
  return page ? Number(page) : 1
})

// Build query params for API
const queryParams = computed(() => ({
  page: currentPage.value,
  limit: PAGE_SIZE,
  ...(selectedCategory.value !== 'all' && { category_id: selectedCategory.value }),
  ...(searchQuery.value.trim() && { keyword: searchQuery.value.trim() })
}))

// Fetch categories
const {
  data: categoriesData
} = await services.courses.getCategories()

// Fetch courses with reactive query
const {
  data: coursesData,
  pending: isLoadingCourses,
  error: coursesError,
  refresh: refreshCourses
} = await services.courses.getList(queryParams)

// Map categories from API
const categories = computed(() => {
  if (!categoriesData.value?.data) {
    return [{ id: 'all', label: 'Tất cả khóa học' }]
  }
  const apiCategories = categoriesData.value.data
  return [
    { id: 'all', label: 'Tất cả khóa học' },
    ...apiCategories.map(cat => ({
      id: cat.category_id,
      label: cat.category_name
    }))
  ]
})

// Map courses from API to CourseCard format
const courses = computed(() => {
  if (!coursesData.value?.data) return []
  const apiCourses = coursesData.value.data.data || []
  return apiCourses.map((course: Course) => ({
    id: course.course_id,
    title: course.course_name,
    duration: course.overview?.study_duration || '0 giờ',
    price: course.price || 0,
    image: course.course_image ? getLinkFromS3(course.course_image) : undefined,
    slug: course.slug || course.course_id,
    is_owned: course.is_owned
  }))
})

// Pagination
const totalItems = computed(() => {
  return coursesData.value?.data?.page?.total_records || 0
})

const updatePage = (page: number) => {
  router.push({
    query: {
      ...route.query,
      page: page.toString()
    }
  })
  if (import.meta.client) {
    goToTop()
  }
}

const updateCategory = (categoryId: string) => {
  router.push({
    query: {
      ...route.query,
      category: categoryId !== 'all' ? categoryId : undefined,
      page: undefined // Reset to page 1
    }
  })
  if (import.meta.client) {
    goToTop()
  }
}

const debouncedUpdateSearch = useDebounceFn((keyword: string) => {
  router.push({
    query: {
      ...route.query,
      q: keyword.trim() || undefined,
      page: undefined // Reset to page 1
    }
  })
  if (import.meta.client) {
    goToTop()
  }
}, 400)

// Watch for route query changes and scroll to top
watch(currentPage, () => {
  if (import.meta.client) {
    goToTop()
  }
})

const activeCategoryClass = computed(() => {
  return `bg-gradient-to-b from-primary-500 to-primary-700 font-semibold`
})
</script>

<template>
  <UContainer class="py-6 md:py-10">
    <div class="space-y-6 md:space-y-8">
      <div
        class="space-y-2"
      >
        <Heading
          variant="h3"
          as="h1"
        >
          Tất cả <span class="text-primary">khóa học</span>
        </Heading>
        <motion.p
          class="text-base"
          :initial="{ opacity: 0, y: 10 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.2, ease: 'easeOut' }"
        >
          Trang bị kiến thức, kỹ năng và tư duy công nghệ cho thế hệ tương lai.
        </motion.p>
      </div>

      <motion.div
        class="flex flex-col md:flex-row gap-4 md:items-start md:justify-between"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.3, ease: 'easeOut' }"
      >
        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="category in categories"
            :key="category.id"
            :variant="selectedCategory === category.id ? 'solid' : 'outline'"
            :color="selectedCategory === category.id ? 'primary' : 'neutral'"
            size="xl"
            class="px-3.5 rounded-sm font-medium md:rounded-md md:min-h-12"
            :ui="{
              base: `bg-white ring-neutral-400 ${selectedCategory === category.id ? activeCategoryClass : ''}`
            }"
            @click="updateCategory(category.id)"
          >
            {{ category.label }}
          </UButton>
        </div>

        <div class="shrink-0 md:max-w-xs">
          <UInput
            :model-value="searchQuery"
            placeholder="Tìm kiếm khóa học"
            icon="i-lucide-search"
            size="md"
            class="w-full"
            :ui="{
              base: 'bg-white'
            }"
            @update:model-value="debouncedUpdateSearch"
          >
            <template
              v-if="searchQuery?.length"
              #trailing
            >
              <UButton
                color="primary"
                variant="link"
                icon="i-lucide-circle-x"
                aria-label="Xóa tìm kiếm"
                @click="debouncedUpdateSearch('')"
              />
            </template>
          </UInput>
        </div>
      </motion.div>

      <!-- Loading state -->
      <div
        v-if="isLoadingCourses"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <SkeletonCourseCard
          v-for="i in PAGE_SIZE"
          :key="i"
        />
      </div>

      <!-- Error state -->
      <div
        v-else-if="coursesError"
        class="flex justify-center items-center py-20"
      >
        <div class="text-center">
          <p class="text-error mb-4">
            Có lỗi xảy ra khi tải dữ liệu
          </p>
          <UButton @click="refreshCourses()">
            Thử lại
          </UButton>
        </div>
      </div>

      <!-- Empty state -->
      <motion.div
        v-else-if="courses.length === 0"
        class="text-center py-12"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.4 }"
      >
        <p class="text-muted flex items-center justify-center gap-2">
          <UIcon
            name="i-lucide-search"
            class="size-6 text-muted"
          />
          Không tìm thấy khóa học nào
        </p>
      </motion.div>

      <!-- Courses list -->
      <div v-else>
        <motion.div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          :initial="false"
          :animate="{ opacity: 1 }"
          :transition="{ staggerChildren: 0.1, delayChildren: 0.1 }"
        >
          <motion.div
            v-for="(course, index) in courses"
            :key="course.id"
            :initial="{ opacity: 0, y: 30, scale: 0.9 }"
            :animate="{ opacity: 1, y: 0, scale: 1 }"
            :transition="{
              duration: 0.5,
              delay: index * 0.05,
              ease: 'easeOut'
            }"
          >
            <CourseCard
              :title="course.title"
              :duration="course.duration"
              :price="course.price"
              :image="course.image"
              :to="`/khoa-hoc/${course.id}`"
              :is-owned="course.is_owned || false"
            />
          </motion.div>
        </motion.div>

        <div
          v-if="totalItems > PAGE_SIZE"
          class="mt-8 flex justify-center"
        >
          <UPagination
            :page="currentPage"
            :total="totalItems"
            :page-size="PAGE_SIZE"
            @update:page="updatePage"
          />
        </div>
      </div>
    </div>
  </UContainer>
</template>
