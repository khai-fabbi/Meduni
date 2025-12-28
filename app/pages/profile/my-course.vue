<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import type { MyCourse } from '~/types/course'
import type { ApiResponse } from '~/types/common'
import { PAGE_DEFAULT } from '~/utils/constants'
import { formatDuration, getLinkFromS3 } from '~/utils/helpers'
import DocumentDone from '~/assets/icons/document-done.svg'
import { ApiEndpoint } from '~/utils/apiEndpoint'

useSeoMeta({
  title: 'Khoá học đã mua',
  description: 'Khoá học của bạn'
})

const items = ref<BreadcrumbItem[]>([
  {
    label: 'Trang chủ',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: 'Hồ sơ',
    to: '/profile'
  },
  {
    label: 'Khoá học đã mua',
    to: '#'
  }
])

definePageMeta({
  layout: 'profile',
  middleware: 'auth'
})

const page = ref(1)
const isLoading = ref(true)
const courses = ref<MyCourse[]>([])
const totalRecords = ref(0)
const toast = useToast()

// Fetch courses from API
async function fetchCourses() {
  try {
    isLoading.value = true
    const { $api } = useNuxtApp()
    const response = await $api<ApiResponse<MyCourse[]>>(ApiEndpoint.Courses.GetMyCourses, {
      method: 'GET',
      query: {
        page_number: page.value,
        page_size: PAGE_DEFAULT,
        sort: 1 // 1: ngày mua, 2: tiến độ giảm, 3: tiến độ tăng, 4: học gần đây
      }
    })

    if (response.data) {
      courses.value = response.data
      // Handle pagination - API doc shows page object with current, total, per_page
      // But old code uses page_number, page_size, total_records
      if (response.page) {
        totalRecords.value = response.page.total || response.page.total_records || response.data.length || 0
      } else {
        totalRecords.value = response.data.length
      }
    }
  } catch (error) {
    console.error('Error fetching courses:', error)
    toast.add({
      title: 'Lỗi',
      description: 'Không thể tải danh sách khóa học',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

// Watch page changes
watch(page, () => {
  fetchCourses()
})

onMounted(() => {
  fetchCourses()
})

// Computed for course display
const isEmpty = computed(() => !isLoading.value && courses.value.length === 0)

// Format course image URL
const getCourseImage = (imagePath: string) => {
  if (!imagePath) return '/images/course/course-placeholder.png'
  return getLinkFromS3(imagePath)
}

// Format duration
const formatCourseDuration = (seconds?: number) => {
  if (!seconds) return '0 phút'
  return formatDuration(seconds)
}
</script>

<template>
  <div class="space-y-6">
    <UBreadcrumb
      :items="items"
      class="md:hidden mb-0"
    />
    <Heading
      variant="h3"
    >
      Khoá học đã mua
    </Heading>

    <div class="pb-4">
      <div
        v-if="isEmpty"
        class="bg-white rounded-sm text-center py-12"
      >
        <p class="text-neutral-500 text-lg">
          Bạn chưa mua khoá học nào
        </p>
      </div>

      <div
        v-else
        class="space-y-4"
      >
        <SkeletonCourse v-if="isLoading" />

        <template v-else>
          <div
            v-for="course in courses"
            :key="course.id"
            class="bg-white rounded-sm flex flex-col md:flex-row md:items-center gap-4 p-4"
          >
            <NuxtImg
              :src="getCourseImage(course.course_image)"
              :alt="course.course_name"
              class="w-full md:w-48 h-32 md:h-28 object-cover rounded-lg shrink-0"
            />

            <div class="flex-1 min-w-0">
              <h3 class="font-bold md:text-base text-lg mb-2">
                {{ course.course_name }}
              </h3>
              <p class="text-sm md:text-xs mb-3">
                Giảng viên: {{ course.teacher_name || 'TS Bùi Văn Khoa' }}
              </p>
              <div class="flex flex-wrap gap-2">
                <UBadge
                  color="primary"
                  variant="outline"
                  size="md"
                  class="bg-certificate-badge border-0 py-2 px-4"
                >
                  {{ course.info?.total_chapter ?? 0 }} chương
                </UBadge>
                <UBadge
                  color="primary"
                  variant="outline"
                  size="md"
                  class="bg-certificate-badge border-0 py-2 px-4"
                >
                  {{ course.info?.total_lesson ?? 0 }} bài giảng
                </UBadge>
                <UBadge
                  color="primary"
                  variant="outline"
                  size="md"
                  class="bg-certificate-badge border-0 py-2 px-4"
                >
                  {{ course.info?.total_exercise ?? 0 }} bài tập
                </UBadge>
                <UBadge
                  color="primary"
                  variant="outline"
                  size="md"
                  class="bg-certificate-badge border-0 py-2 px-4"
                >
                  Thời lượng {{ formatCourseDuration(course.info?.total_duration) }}
                </UBadge>
              </div>
            </div>

            <div class="flex gap-6 shrink-0 md:justify-center justify-between">
              <SharedProcessLearning :progress="course.progress" />

              <!-- Button -->
              <UButton
                v-if="course.progress === 100"
                color="primary"
                variant="outline"
                size="lg"
                class="text-base md:w-auto w-full h-12 md:h-12 justify-center items-center"
                disabled
              >
                Hoàn thành
                <DocumentDone class="w-6 h-6 mr-2" />
              </UButton>
              <UButton
                v-else
                color="primary"
                size="lg"
                class="w-38 h-12 text-base text-right md:text-center justify-center items-center"
                :to="`/khoa-hoc/${course.course_id}`"
              >
                Tiếp tục học
              </UButton>
            </div>
          </div>
        </template>
      </div>

      <div
        v-if="totalRecords > PAGE_DEFAULT"
        class="mt-6 flex md:justify-end md:mr-4 justify-center"
      >
        <UPagination
          v-model:page="page"
          :total="totalRecords"
          :page-size="PAGE_DEFAULT"
        />
      </div>
    </div>
  </div>
</template>
