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
import { PROGRESS_LOG_INTERVAL } from '~/utils/constants'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const pathParts = route.path.split('/').filter(Boolean)
const courseId = computed(() => String(route.params.id || pathParts[1] || '1'))
const lessonId = computed(() => String(route.params.lessonid || pathParts[3] || route.params.id || '1'))

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

const {
  data: myCourseData,
  pending: isLoadingMyCourse,
  error: myCourseError
} = await services.courses.getMyCourseDetail(myCourseId.value)

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

const course = computed(() => {
  if (!courseData.value?.data) return null
  const apiCourse = courseData.value.data as unknown as CourseDetail
  if (myCourseData.value?.data) {
    const myCourse = myCourseData.value.data
    apiCourse.progress = myCourse.progress || 0

    // Merge course_content from myCourseData to include is_complete and is_view
    if (myCourse.course_content && Array.isArray(myCourse.course_content) && apiCourse.chapters) {
      apiCourse.chapters = apiCourse.chapters.map((apiChapter: ApiChapter) => {
        // Find corresponding chapter in course_content
        const myChapter = myCourse.course_content?.find((ch: ApiChapter) => ch.chapter_id === apiChapter.chapter_id)
        if (myChapter && myChapter.lessons) {
          // Merge lessons with is_complete, is_view, and exercises from course_content
          return {
            ...apiChapter,
            is_complete: myChapter.is_complete,
            lessons: apiChapter.lessons.map((apiLesson: ApiLesson) => {
              const myLesson = myChapter.lessons.find((l: ApiLesson) => l.lesson_id === apiLesson.lesson_id)
              if (myLesson) {
                return {
                  ...apiLesson,
                  is_complete: myLesson.is_complete,
                  is_view: myLesson.is_view,
                  complete_at: myLesson.complete_at,
                  start_at: myLesson.start_at,
                  exercises: myLesson.exercises?.map((exercise: ApiLesson['exercises'][0] & { is_view?: boolean }) => ({
                    ...exercise,
                    is_view: exercise.is_view
                  })) || apiLesson.exercises
                }
              }
              return apiLesson
            })
          }
        }
        return apiChapter
      })
    } else if (myCourse.chapters && Array.isArray(myCourse.chapters)) {
      // Fallback: use chapters if course_content is not available
      apiCourse.chapters = myCourse.chapters
    }
  }
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
          document: undefined,
          quiz: undefined,
          is_complete: lesson.is_complete,
          is_view: lesson.is_view
        }
      })
    }
  })
})

const isLoading = computed(() => isLoadingCourse.value || isLoadingLesson.value || isLoadingMyCourse.value)
const hasError = computed(() => courseError.value || lessonError.value || myCourseError.value)

const videoPlayerRef = ref()
const isCompletingLesson = ref(false)
const hasCompletedLesson = ref(false)
const completionModalOpen = ref(false)
const joinLogHistoryId = ref<string | null>(null)
const hasCalledGetJoinLog = ref(false)
interface NextLesson {
  id: string
  title: string
}
const nextLesson = ref<NextLesson | null>(null)

const lastProgressLogTime = ref(0)

const findNextLesson = computed(() => {
  if (!course.value?.chapters) return null

  const allChapters = course.value.chapters
  let foundCurrent = false

  for (let chapterIndex = 0; chapterIndex < allChapters.length; chapterIndex++) {
    const chapter = allChapters[chapterIndex]
    if (!chapter) continue

    const lessons = chapter.lessons || []

    for (let lessonIndex = 0; lessonIndex < lessons.length; lessonIndex++) {
      if (lessons[lessonIndex]?.lesson_id === lessonId.value) {
        foundCurrent = true

        if (lessonIndex < lessons.length - 1) {
          const next = lessons[lessonIndex + 1]
          if (next) {
            return {
              id: next.lesson_id,
              title: next.lesson_name
            }
          }
        } else if (chapterIndex < allChapters.length - 1) {
          const nextChapter = allChapters[chapterIndex + 1]
          if (nextChapter) {
            const nextChapterLessons = nextChapter.lessons || []
            if (nextChapterLessons.length > 0) {
              const next = nextChapterLessons[0]
              if (next) {
                return {
                  id: next.lesson_id,
                  title: next.lesson_name
                }
              }
            }
          }
        }
        break
      }
    }
    if (foundCurrent) break
  }

  return null
})

async function handleTimeUpdate(currentTime: number, duration: number) {
  if (!lessonId.value || hasCompletedLesson.value || duration === 0) return

  // If user seeks backward, reset the tracking time
  if (currentTime < lastProgressLogTime.value) {
    lastProgressLogTime.value = currentTime
    return
  }

  // Calculate time difference since last log
  const timeDiff = currentTime - lastProgressLogTime.value

  // Call API every PROGRESS_LOG_INTERVAL seconds
  if (timeDiff >= PROGRESS_LOG_INTERVAL) {
    lastProgressLogTime.value = currentTime
    try {
      await services.courses.saveProgressLog(
        lessonId.value,
        currentTime,
        duration
      )
    } catch {
      // Silent fail for progress log
    }
  }
}

async function handleFinishedNinetyPercent() {
  if (!myCourseId.value || !courseId.value || !lessonId.value || hasCompletedLesson.value || isCompletingLesson.value) {
    return
  }

  isCompletingLesson.value = true

  try {
    const response = await services.courses.completeLesson(
      lessonId.value,
      courseId.value,
      myCourseId.value
    )

    hasCompletedLesson.value = true

    if (response.data) {
      if (response.data.progress !== undefined) {
        if (courseData.value?.data) {
          const apiCourse = courseData.value.data as unknown as CourseDetail
          apiCourse.progress = response.data.progress
        }
        if (myCourseData.value?.data) {
          myCourseData.value.data.progress = response.data.progress
        }
      }

      if (response.data.course_content) {
        if (courseData.value?.data) {
          const apiCourse = courseData.value.data as unknown as CourseDetail
          apiCourse.chapters = response.data.course_content
        }
        // Update myCourseData to reflect the changes
        if (myCourseData.value?.data) {
          myCourseData.value.data.course_content = response.data.course_content
          // Also update chapters if it exists
          if (myCourseData.value.data.chapters) {
            myCourseData.value.data.chapters = response.data.course_content
          }
        }
      }

      // Reset progress log to 0 after completing lesson
      const apiLesson = lessonData.value?.data as LessonDetail | undefined
      const duration = apiLesson?.lesson_duration || 0
      if (duration > 0) {
        try {
          await services.courses.saveProgressLog(
            lessonId.value,
            0,
            duration
          )
        } catch {
          // Silent fail for progress log reset
        }
      }
    }
  } catch {
    hasCompletedLesson.value = false
  } finally {
    isCompletingLesson.value = false
  }
}

function goToNextLesson() {
  if (nextLesson.value) {
    navigateTo(`/khoa-hoc/${courseId.value}/bai-hoc/${nextLesson.value.id}`)
  }
  completionModalOpen.value = false
}

function closeCompletionModal() {
  completionModalOpen.value = false
}

async function handleVideoEnded() {
  if (!hasCompletedLesson.value && !isCompletingLesson.value) {
    await handleFinishedNinetyPercent()
  }

  if (hasCompletedLesson.value) {
    nextLesson.value = findNextLesson.value
    completionModalOpen.value = true
  }

  if (joinLogHistoryId.value && myCourseId.value && lessonId.value) {
    try {
      await services.courses.updateJoinLog(myCourseId.value, lessonId.value, joinLogHistoryId.value)
    } catch {
      // Silent fail for join log update
    }
  }
}

watch(() => lessonData.value?.data, (newLesson) => {
  if (newLesson) {
    const apiLesson = newLesson as LessonDetail
    hasCompletedLesson.value = apiLesson.is_completed || false
  }
}, { immediate: true })

onMounted(async () => {
  if (myCourseId.value && lessonId.value && !hasCalledGetJoinLog.value) {
    try {
      const response = await services.courses.getJoinLog(myCourseId.value, lessonId.value)
      if (response.data) {
        joinLogHistoryId.value = response.data.history_id
        hasCalledGetJoinLog.value = true
        await nextTick()
        if (videoPlayerRef.value) {
          if (response.data.position > 0) {
            videoPlayerRef.value.seek(response.data.position)
          }
        }
      }
    } catch {
      // Silent fail for join log
    }
  }
})

watch([myCourseId, lessonId], async ([newMyCourseId, newLessonId], [_oldMyCourseId, oldLessonId]) => {
  if (newMyCourseId && newLessonId) {
    // Reset progress log time when lesson changes
    if (oldLessonId !== newLessonId) {
      lastProgressLogTime.value = 0
      hasCompletedLesson.value = false
    }

    // Only call GetJoinLog if we don't have history_id yet (first time for this lesson)
    if (!joinLogHistoryId.value) {
      try {
        const response = await services.courses.getJoinLog(newMyCourseId, newLessonId)
        if (response.data) {
          joinLogHistoryId.value = response.data.history_id
          hasCalledGetJoinLog.value = true
          await nextTick()
          if (videoPlayerRef.value) {
            if (response.data.position > 0) {
              videoPlayerRef.value.seek(response.data.position)
            }
            videoPlayerRef.value.play()
          }
        }
      } catch {
        // Silent fail for join log
      }
    } else {
      // If we already have history_id, just play the video
      await nextTick()
      if (videoPlayerRef.value) {
        videoPlayerRef.value.play()
      }
    }
  }
})

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
          <PlayerVideo
            ref="videoPlayerRef"
            :src="getLinkFromS3(lessonData?.data?.lesson_path || '')"
            @time-update="handleTimeUpdate"
            @finished-ninety-percent="handleFinishedNinetyPercent"
            @ended="handleVideoEnded"
          />
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
          :progress="course?.progress || 0"
        />
      </motion.div>
    </div>

    <UModal
      v-model:open="completionModalOpen"
      :ui="{
        content: 'sm:max-w-lg',
        header: 'border-b-0 justify-center',
        body: 'items-center border-0',
        footer: 'border-0 items-center'
      }"
    >
      <template #header>
        <div class="flex gap-3 justify-center items-center">
          <UIcon
            name="i-lucide-check-circle"
            class="size-8 text-success"
          />
          <h3 class="text-xl font-bold text-center">
            Bạn đã hoàn thành bài giảng
          </h3>
        </div>
      </template>

      <template #body>
        <div class="space-y-4 text-center">
          <p
            v-if="nextLesson"
            class="text-base text-neutral-700"
          >
            Bài tiếp theo: <strong>{{ nextLesson.title }}</strong>
          </p>
          <p
            v-else
            class="text-base text-neutral-700"
          >
            Bạn đã hoàn thành tất cả các bài học trong khóa học này!
          </p>
        </div>
      </template>

      <template #footer>
        <div class="flex gap-4 justify-center w-full">
          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            class="min-w-32 text-center justify-center items-center"
            @click="closeCompletionModal"
          >
            Đóng
          </UButton>
          <UButton
            v-if="nextLesson"
            color="primary"
            size="lg"
            class="min-w-32 text-center justify-center items-center"
            @click="goToNextLesson"
          >
            Bài tiếp theo
          </UButton>
        </div>
      </template>
    </UModal>
  </UContainer>
</template>
