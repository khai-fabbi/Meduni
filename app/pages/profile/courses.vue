<script setup lang="ts">
import { PAGE_DEFAULT } from '~/utils/constants'
import DocumentDone from '~/assets/icons/document-done.svg'

useSeoMeta({
  title: 'Khoá học đã mua',
  description: 'Khoá học của bạn'
})

definePageMeta({
  layout: 'profile'
})
onMounted(async () => {
  isLoading.value = false
})

const page = ref(1)
const isLoading = ref(true)

const courses = ref([
  {
    id: 1,
    title: 'Chiến lược trí tuệ nhân tạo dành cho lãnh đạo',
    instructor: 'TS Bùi Văn Khoa',
    progress: 24,
    chapters: 1,
    lessons: 15,
    exercises: 12,
    duration: '10 tiếng 20 phút',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    status: 'in-progress'
  },
  {
    id: 2,
    title: 'Khóa đào tạo AI cho marketer không muốn bị tụt lại',
    instructor: 'TS Bùi Văn Khoa',
    progress: 51,
    chapters: 1,
    lessons: 15,
    exercises: 12,
    duration: '10 tiếng 20 phút',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
    status: 'in-progress'
  },
  {
    id: 3,
    title: 'Chiến lược Marketing thời đại AI',
    instructor: 'TS Bùi Văn Khoa',
    progress: 100,
    chapters: 1,
    lessons: 15,
    exercises: 12,
    duration: '10 tiếng 20 phút',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400',
    status: 'completed'
  },
  {
    id: 4,
    title: 'Chiến lược Marketing thời đại AI',
    instructor: 'TS Bùi Văn Khoa',
    progress: 100,
    chapters: 1,
    lessons: 15,
    exercises: 12,
    duration: '10 tiếng 20 phút',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400',
    status: 'completed'
  },
  {
    id: 5,
    title: 'Chiến lược Marketing thời đại AI',
    instructor: 'TS Bùi Văn Khoa',
    progress: 100,
    chapters: 1,
    lessons: 15,
    exercises: 12,
    duration: '10 tiếng 20 phút',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400',
    status: 'completed'
  },
  {
    id: 1,
    title: 'Chiến lược trí tuệ nhân tạo dành cho lãnh đạo',
    instructor: 'TS Bùi Văn Khoa',
    progress: 24,
    chapters: 1,
    lessons: 15,
    exercises: 12,
    duration: '10 tiếng 20 phút',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    status: 'in-progress'
  },
  {
    id: 2,
    title: 'Khóa đào tạo AI cho marketer không muốn bị tụt lại',
    instructor: 'TS Bùi Văn Khoa',
    progress: 51,
    chapters: 1,
    lessons: 15,
    exercises: 12,
    duration: '10 tiếng 20 phút',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
    status: 'in-progress'
  },
  {
    id: 3,
    title: 'Chiến lược Marketing thời đại AI',
    instructor: 'TS Bùi Văn Khoa',
    progress: 100,
    chapters: 1,
    lessons: 15,
    exercises: 12,
    duration: '10 tiếng 20 phút',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400',
    status: 'completed'
  },
  {
    id: 4,
    title: 'Chiến lược Marketing thời đại AI',
    instructor: 'TS Bùi Văn Khoa',
    progress: 100,
    chapters: 1,
    lessons: 15,
    exercises: 12,
    duration: '10 tiếng 20 phút',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400',
    status: 'completed'
  },
  {
    id: 5,
    title: 'Chiến lược Marketing thời đại AI',
    instructor: 'TS Bùi Văn Khoa',
    progress: 100,
    chapters: 1,
    lessons: 15,
    exercises: 12,
    duration: '10 tiếng 20 phút',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400',
    status: 'completed'
  },
  {
    id: 1,
    title: 'Chiến lược trí tuệ nhân tạo dành cho lãnh đạo',
    instructor: 'TS Bùi Văn Khoa',
    progress: 24,
    chapters: 1,
    lessons: 15,
    exercises: 12,
    duration: '10 tiếng 20 phút',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    status: 'in-progress'
  }
])
</script>

<template>
  <div class="space-y-6">
    <Heading
      variant="h3"
    >
      Khoá học đã mua
    </Heading>

    <div class="pb-4">
      <div
        v-if="courses.length === 0"
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
              :src="course.image"
              :alt="course.title"
              class="w-full md:w-48 h-32 md:h-28 object-cover rounded-lg shrink-0"
            />

            <div class="flex-1 min-w-0">
              <h3 class="font-bold md:text-base text-lg mb-2">
                {{ course.title }}
              </h3>
              <p class="text-sm md:text-xs mb-3">
                Giảng viên: {{ course.instructor }}
              </p>
              <div class="flex flex-wrap gap-2">
                <UBadge
                  color="primary"
                  variant="outline"
                  size="md"
                  class="bg-certificate-badge border-0 py-2 px-4"
                >
                  {{ course.chapters }} chương
                </UBadge>
                <UBadge
                  color="primary"
                  variant="outline"
                  size="md"
                  class="bg-certificate-badge border-0 py-2 px-4"
                >
                  {{ course.lessons }} bài giảng
                </UBadge>
                <UBadge
                  color="primary"
                  variant="outline"
                  size="md"
                  class="bg-certificate-badge border-0 py-2 px-4"
                >
                  {{ course.exercises }} bài tập
                </UBadge>
                <UBadge
                  color="primary"
                  variant="outline"
                  size="md"
                  class="bg-certificate-badge border-0 py-2 px-4"
                >
                  Thời lượng {{ course.duration }}
                </UBadge>
              </div>
            </div>

            <div class="flex gap-6 shrink-0 md:justify-center justify-between">
              <!-- Circular Progress -->
              <div
                v-if="course.progress !== 100"
                class="relative size-13 shrink-0"
              >
                <svg
                  class="transform -rotate-90 w-full h-full"
                  viewBox="0 0 36 36"
                >
                  <!-- Inner circle -->
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    stroke-linecap="round"
                    fill="var(--color-progress-inner)"
                  />
                  <!-- Background circle -->
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#e2e8f0"
                    stroke-width="3"
                  />
                  <!-- Progress circle -->
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="var(--color-primary-500)"
                    stroke-width="3"
                    stroke-dasharray="100, 100"
                    :stroke-dashoffset="100 - course.progress"
                    stroke-linecap="round"
                    class="transition-all duration-300"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-base font-black text-primary">
                    {{ course.progress }}%
                  </span>
                </div>
              </div>

              <!-- Button -->
              <UButton
                v-if="course.status === 'completed'"
                color="primary"
                variant="outline"
                size="lg"
                class="text-base md:w-auto w-full h-12 md:h-12 justify-center items-center"
              >
                Hoàn thành
                <DocumentDone class="w-6 h-6 mr-2" />
              </UButton>
              <UButton
                v-else
                color="primary"
                size="lg"
                class="w-38 h-12 text-base text-right md:text-center justify-center items-center"
              >
                Tiếp tục học
              </UButton>
            </div>
          </div>
        </template>
      </div>

      <div
        v-if="courses.length > PAGE_DEFAULT"
        class="mt-6 flex md:justify-end md:mr-4 justify-center"
      >
        <UPagination
          v-model:page="page"
          :total="courses.length"
          :page-size="PAGE_DEFAULT"
        />
      </div>
    </div>
  </div>
</template>
