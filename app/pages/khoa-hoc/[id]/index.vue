<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import { motion } from 'motion-v'
import CourseOverview from '~/components/course/CourseOverview.vue'
import CourseContent from '~/components/course/CourseContent.vue'
import CourseDetails from '~/components/course/CourseDetails.vue'
import InstructorInfo from '~/components/course/InstructorInfo.vue'
import { services } from '~/services'
import type { CourseDetail, Chapter as ApiChapter, Lesson as ApiLesson } from '~/types/course'
import { getLinkFromS3, formatDuration } from '~/utils/helpers'

const route = useRoute()
const courseId = route.params.id as string

interface Lesson {
  id: number
  title: string
  duration: string
}

interface Chapter {
  id: number
  title: string
  lessons: Lesson[]
  totalLessons: number
  totalDuration: string
}

// Fetch course detail
const {
  data: courseData,
  pending: isLoadingCourse,
  error: courseError,
  refresh: refreshCourse
} = await services.courses.getCourseById(courseId)

if (!courseData.value) {
  throw createError({
    statusCode: HttpCode.NOT_FOUND,
    statusMessage: 'Không tìm thấy dữ liệu',
    fatal: true
  })
}
// Map API data to component format
const course = computed(() => {
  if (!courseData.value?.data) {
    return null
  }
  const apiCourse = courseData.value.data as unknown as CourseDetail
  return {
    id: apiCourse.course_id,
    image: apiCourse.course_image ? getLinkFromS3(apiCourse.course_image) : '',
    tag: apiCourse.category?.category_name || apiCourse.category_name || '',
    title: apiCourse.course_name,
    overview: apiCourse.description || '',
    language: 'Tiếng Việt',
    totalLessons: apiCourse.info?.total_lesson || 0,
    difficulty: 'Trình độ Trung bình',
    duration: formatDuration(apiCourse.info?.total_duration || 0),
    certificate: 'Khi khóa học kết thúc'
  }
})

// Map chapters from API to component format
const chapters = computed<Chapter[]>(() => {
  if (!courseData.value?.data) {
    return []
  }
  const apiCourse = courseData.value.data as unknown as CourseDetail
  if (!apiCourse.chapters || !Array.isArray(apiCourse.chapters)) {
    return []
  }

  return apiCourse.chapters.map((chapter: ApiChapter, index: number) => {
    const chapterLessons = chapter.lessons || []
    const totalDuration = chapterLessons.reduce((sum: number, lesson: ApiLesson) => {
      return sum + (lesson.lesson_duration || 0)
    }, 0)

    return {
      id: index + 1,
      title: chapter.chapter_name,
      totalLessons: chapterLessons.length,
      totalDuration: formatDuration(totalDuration),
      lessons: chapterLessons.map((lesson: ApiLesson, lessonIndex: number) => ({
        id: lessonIndex + 1,
        title: lesson.lesson_name,
        duration: formatDuration(lesson.lesson_duration || 0)
      }))
    }
  })
})

// Mock instructor data (không có trong API)
const instructor = {
  name: courseData.value?.data?.teacher?.teacher_name || '',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  description: 'Tại Học viện Med AI, Đội ngũ phát triển hệ tư duy lôi và phương pháp khoa học giúp cha mẹ đồng hành hiệu quả cùng con.',
  greeting: 'Xin chào! Mình là trợ lý MEDUNI. Nếu bạn thắc mắc bất cứ điều gì MEDUNI, hãy đặt câu hỏi để mình ai giới đẹp hoặc tư vấn nga',
  stats: [
    'Hàng tháng, 40.000-60.000 khách hàng tham dự các chương trình trực tuyến miễn phí dành cho cha mẹ do các giảng viên trực tiếp chia sẻ.',
    'Gần 50.000 khách hàng đã và đang tham gia các chương trình trực tuyến hàng tháng.',
    'Hàng chục nghìn gia đình đã và đang chuyển hóa tích cực 5 lan tỏa giá trị tích cực tới cộng đồng & xã hội.'
  ]
}

const isOwned = ref(false)

// Breadcrumbs
const items = computed<BreadcrumbItem[]>(() => [
  {
    label: 'Trang chủ',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: 'Khoá học',
    to: '/khoa-hoc'
  },
  {
    label: course.value?.title || 'Chi tiết khóa học',
    to: '#'
  }
])

// SEO
const title = computed(() => course.value ? `${course.value.title} - MedUni.ai` : 'Chi tiết khóa học - MedUni.ai')
const description = computed(() => course.value?.overview || '')

useSeoMeta({
  title: title.value,
  ogTitle: title.value,
  description: description.value,
  ogDescription: description.value
})
</script>

<template>
  <UContainer class="mb-10 md:mb-20">
    <UBreadcrumb
      :items="items"
    />

    <!-- Loading state -->
    <div
      v-if="isLoadingCourse"
      class="flex justify-center items-center py-20"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="animate-spin size-10 text-primary"
      />
    </div>

    <!-- Error state -->
    <div
      v-else-if="courseError"
      class="flex justify-center items-center py-20"
    >
      <div class="text-center">
        <p class="text-error mb-4">
          Có lỗi xảy ra khi tải dữ liệu
        </p>
        <UButton @click="refreshCourse()">
          Thử lại
        </UButton>
      </div>
    </div>

    <!-- Content -->
    <div
      v-else-if="course"
      class="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] 2xl:grid-cols-[1fr_530px] gap-6 md:gap-7"
    >
      <div class="space-y-6">
        <motion.div
          class="overflow-hidden rounded-lg"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5 }"
        >
          <NuxtImg
            :src="course.image || '/images/course/course-placeholder.png'"
            :alt="course.title"
            class="w-full h-auto object-cover"
            quality="100"
            :placeholder="[50, 25]"
          />
        </motion.div>

        <motion.div
          class="space-y-4"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.1 }"
        >
          <UBadge
            color="secondary"
            size="lg"
            variant="subtle"
            class="rounded-sm"
          >
            {{ course.tag }}
          </UBadge>

          <Heading
            variant="h3"
            as="h1"
            class="text-primary"
          >
            {{ course.title }}
          </Heading>

          <!-- <p
            v-if="course.subtitle"
            class="text-lg text-muted"
          >
            {{ course.subtitle }}
          </p> -->
        </motion.div>

        <motion.div
          v-if="course.overview"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.2 }"
        >
          <CourseOverview :overview="course.overview" />
        </motion.div>

        <motion.div
          v-if="chapters.length > 0"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.3 }"
        >
          <CourseContent :chapters="chapters" />
        </motion.div>
      </div>

      <div class="space-y-6">
        <motion.div
          :initial="{ opacity: 0, x: 20 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.5, delay: 0.2 }"
        >
          <CourseDetails
            :language="course.language"
            :total-lessons="course.totalLessons"
            :difficulty="course.difficulty"
            :duration="course.duration"
            :certificate="course.certificate"
            :is-owned="isOwned"
          />
        </motion.div>

        <motion.div
          :initial="{ opacity: 0, x: 20 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.5, delay: 0.3 }"
        >
          <InstructorInfo
            :name="instructor.name"
            :avatar="instructor.avatar"
            :description="instructor.description"
            :stats="instructor.stats"
          />
        </motion.div>
      </div>
    </div>

    <!-- Not found -->
    <div
      v-else
      class="flex justify-center items-center py-20"
    >
      <p class="text-secondary">
        Không tìm thấy khóa học
      </p>
    </div>
  </UContainer>
</template>
