<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import { motion } from 'motion-v'
import LessonInfo from '~/components/lesson/LessonInfo.vue'
import LessonTabs from '~/components/lesson/LessonTabs.vue'
import LessonTableOfContents from '~/components/lesson/LessonTableOfContents.vue'
import type { LessonResourceLink } from '~/components/shared/LessonResources.vue'
import { services } from '~/services'
import type { CourseDetail, Chapter as ApiChapter, Lesson as ApiLesson, LessonDetail } from '~/types/course'
import { getLinkFromS3, formatDuration } from '~/utils/helpers'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const pathParts = route.path.split('/').filter(Boolean)
const courseId = computed(() => String(route.params.id || pathParts[1] || '1'))
const lessonId = computed(() => String(route.params.lessonid || pathParts[3] || route.params.id || '1'))

// Fetch course detail
const {
  data: courseData,
  pending: isLoadingCourse,
  error: courseError,
  refresh: refreshCourse
} = await services.courses.getCourseById(courseId.value)
const myCourseId = computed(() => courseData.value?.data?.my_course_id)

if (!myCourseId.value) {
  throw createError({
    statusCode: HttpCode.NOT_FOUND,
    statusMessage: 'Không tìm thấy khóa học',
    fatal: true
  })
}
// Fetch lesson detail
const {
  data: lessonData,
  pending: isLoadingLesson,
  error: lessonError,
  refresh: refreshLesson
} = await services.courses.getLessonById(myCourseId.value, lessonId.value)

// Check if data exists
if (!courseData.value) {
  throw createError({
    statusCode: HttpCode.NOT_FOUND,
    statusMessage: 'Không tìm thấy khóa học',
    fatal: true
  })
}

if (!lessonData.value) {
  throw createError({
    statusCode: HttpCode.NOT_FOUND,
    statusMessage: 'Không tìm thấy bài học',
    fatal: true
  })
}

interface Lesson {
  id: string
  title: string
  duration: string
  videoUrl: string
  description: string
  content: string
  summary: string
  statusText?: string
  document?: LessonResourceLink
  quiz?: LessonResourceLink
}

interface Chapter {
  id: number
  title: string
  lessons: Lesson[]
  totalLessons: number
  totalDuration: string
}

// Map course data
const course = computed(() => {
  if (!courseData.value?.data) return null
  const apiCourse = courseData.value.data as unknown as CourseDetail
  return apiCourse
})

// Map lesson data
const currentLesson = computed<Lesson>(() => {
  const apiLesson = lessonData.value?.data as LessonDetail | undefined
  const defaultLesson: Lesson = {
    id: lessonId.value,
    title: apiLesson?.lesson_name || 'Tác động của AI đến hoạt động kinh doanh',
    duration: apiLesson?.lesson_duration
      ? formatDuration(apiLesson.lesson_duration)
      : '05:00',
    videoUrl: apiLesson?.lesson_path
      ? getLinkFromS3(apiLesson.lesson_path)
      : 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: apiLesson?.description || '',
    content: apiLesson?.description
      || 'Video này là một phần của: Ứng dụng AI Chìa khóa kinh doanh bứt phá. Khóa học này sẽ giúp bạn hiểu rõ về tác động của trí tuệ nhân tạo đến hoạt động kinh doanh hiện đại. Chúng ta sẽ khám phá cách AI đang thay đổi cách các doanh nghiệp vận hành, từ tự động hóa quy trình đến phân tích dữ liệu thông minh.',
    summary: apiLesson?.description
      || 'Bài học này tập trung vào việc phân tích tác động của AI đến các hoạt động kinh doanh. Chúng ta sẽ tìm hiểu về tự động hóa, phân tích dữ liệu, và trải nghiệm khách hàng được cá nhân hóa. Ngoài ra, bài học cũng đề cập đến những thách thức mà doanh nghiệp phải đối mặt khi áp dụng AI.',
    statusText: apiLesson?.is_locked ? 'Đã khóa' : undefined,
    document: apiLesson?.lesson_material && Array.isArray(apiLesson.lesson_material) && apiLesson.lesson_material.length > 0
      ? {
          id: `doc-${apiLesson.lesson_id}`,
          title: 'Xem tài liệu tham khảo',
          documentUrl: '#',
          done: false,
          icon: 'i-lucide-message-square-text'
        }
      : undefined,
    quiz: undefined // Mock data nếu cần
  }
  return defaultLesson
})

const courseInfo = computed(() => {
  return {
    totalVideos: course.value?.info?.total_lesson,
    totalDuration: course.value?.info?.total_duration
      ? formatDuration(course.value?.info?.total_duration)
      : '0 phút',
    courseTitle: course.value?.course_name
  }
})

// Breadcrumbs
const breadcrumbs = computed<BreadcrumbItem[]>(() => [
  {
    label: 'Trang chủ',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: course.value?.course_name || 'Khoá học',
    to: `/khoa-hoc/${courseId.value}`
  },
  {
    label: currentLesson.value.title || 'Chi tiết bài giảng'
  }
])

// Map chapters from API
const chapters = computed<Chapter[]>(() => {
  if (!course.value?.chapters) return []
  return course.value.chapters?.map((chapter: ApiChapter, chapterIndex: number) => {
    const chapterLessons = chapter.lessons || []
    const totalDuration = chapterLessons.reduce((sum: number, lesson: ApiLesson) => {
      return sum + (lesson.lesson_duration || 0)
    }, 0)

    return {
      id: chapterIndex + 1,
      title: chapter.chapter_name,
      totalLessons: chapterLessons.length,
      totalDuration: formatDuration(totalDuration),
      lessons: chapterLessons.map((lesson: ApiLesson) => {
        const isCurrentLesson = lesson.lesson_id == lessonId.value
        return {
          id: lesson.lesson_id.toString(),
          title: lesson.lesson_name,
          duration: formatDuration(lesson.lesson_duration || 0),
          description: '',
          videoUrl: '',
          content: '',
          summary: '',
          statusText: isCurrentLesson ? 'Đang phát' : undefined,
          document: undefined, // Mock data nếu cần
          quiz: undefined // Mock data nếu cần
        }
      })
    }
  })
})

// Loading state
const isLoading = computed(() => isLoadingCourse.value || isLoadingLesson.value)
const hasError = computed(() => courseError.value || lessonError.value)

// SEO
const title = computed(() => `${currentLesson.value.title}`)
const description = computed(() => currentLesson.value.summary || '')

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
      :items="breadcrumbs"
    />

    <!-- Loading state -->
    <div
      v-if="isLoading"
      class="flex justify-center items-center py-20"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="animate-spin size-10 text-primary"
      />
    </div>

    <!-- Error state -->
    <div
      v-else-if="hasError"
      class="flex justify-center items-center py-20"
    >
      <div class="text-center">
        <p class="mb-4 text-error">
          Có lỗi xảy ra khi tải dữ liệu
        </p>
        <div class="flex gap-2 justify-center">
          <UButton
            v-if="courseError"
            @click="refreshCourse()"
          >
            Thử lại khóa học
          </UButton>
          <UButton
            v-if="lessonError"
            @click="refreshLesson()"
          >
            Thử lại bài học
          </UButton>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div
      v-else
      class="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] 2xl:grid-cols-[1fr_530px] gap-6 md:gap-7"
    >
      <div>
        <motion.div
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5 }"
        >
          <PlayerVideo :src="getLinkFromS3(lessonData?.data?.lesson_path || '')" />
          <!-- <LessonVideo :video-url="currentLesson.videoUrl" /> -->
        </motion.div>

        <motion.div
          :initial="{ opacity: 0, x: -100 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.3, ease: 'easeOut', delay: 0.1 }"
          class="mt-6"
        >
          <LessonInfo
            :course-id="courseId"
            :description="currentLesson.description"
            :total-videos="courseInfo.totalVideos || 0"
            :total-duration="courseInfo.totalDuration"
            :title="currentLesson.title"
            :course-title="courseInfo.courseTitle || ''"
          />
        </motion.div>

        <motion.div
          :initial="{ opacity: 0, x: -100 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.3, ease: 'easeOut', delay: 0.2 }"
          class="mt-3"
        >
          <LessonTabs
            :content="currentLesson.content"
            :summary="currentLesson.summary"
          />
        </motion.div>
      </div>

      <motion.div
        :initial="{ opacity: 0, x: -100 }"
        :animate="{ opacity: 1, x: 0 }"
        :transition="{ duration: 0.3, ease: 'easeOut', delay: 0.1 }"
      >
        <LessonTableOfContents
          :chapters="chapters"
          :course-id="courseId"
          :current-lesson-id="lessonId"
        />
      </motion.div>
    </div>
  </UContainer>
</template>
