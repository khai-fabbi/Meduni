<script setup lang="ts">
import { motion } from 'motion-v'
import CourseCard from '~/components/course/CourseCard.vue'
import SkeletonCourseCard from '~/components/skeleton/CourseCard.vue'
import { services } from '~/services'
import { getLinkFromS3, goToTop } from '~/utils/helpers'

const route = useRoute()
const router = useRouter()

const title = 'Khóa học của tôi'
const description = 'Xem và tiếp tục học các khóa học bạn đã sở hữu. Theo dõi tiến độ và hoàn thành các khóa học của bạn.'

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

definePageMeta({
  middleware: 'auth'
})

const PAGE_SIZE = 16

// Get query params from route
const searchQuery = computed(() => (route.query.q as string) || '')
const currentPage = computed(() => {
  const page = route.query.page
  return page ? Number(page) : 1
})

// Build query params for API
const queryParams = computed(() => ({
  page: currentPage.value,
  limit: PAGE_SIZE,
  ...(searchQuery.value.trim() && { keyword: searchQuery.value.trim() })
}))

// Fetch my courses with reactive query
const {
  data: coursesData,
  pending: isLoadingCourses,
  error: coursesError,
  refresh: refreshCourses
} = await services.courses.getMyCourses(queryParams)

// Map courses from API to CourseCard format
const courses = computed(() => {
  if (!coursesData.value?.data) return []
  const apiCourses = coursesData.value.data || []
  return apiCourses.map(course => ({
    id: course.course_id,
    title: course.course_name,
    duration: course.info?.total_duration?.toString() || '0',
    image: course.course_image ? getLinkFromS3(course.course_image) : undefined,
    price: 0,
    is_owned: true
  }))
})

// Pagination
const totalItems = computed(() => {
  return coursesData.value?.page?.total_records || 0
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
</script>

<template>
  <UContainer class="py-6 md:py-10">
    <div class="space-y-6 md:space-y-8">
      <div class="flex flex-wrap justify-between items-end gap-6">
        <div
          class="space-y-2"
        >
          <Heading
            variant="h3"
            as="h1"
          >
            Khóa học <span class="text-primary">của tôi</span>
          </Heading>
          <motion.p
            class="text-base"
            :initial="{ opacity: 0, y: 10 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: 0.2, ease: 'easeOut' }"
          >
            Xem và tiếp tục học các khóa học bạn đã sở hữu.
          </motion.p>
        </div>

        <motion.div
          class="flex flex-col md:flex-row gap-4 md:items-start"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.3, ease: 'easeOut' }"
        >
          <div class="w-full md:max-w-xs">
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
      </div>

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
            name="i-lucide-book-open"
            class="size-6 text-muted"
          />
          Không tìm thấy khóa học
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
              :is-owned="true"
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
