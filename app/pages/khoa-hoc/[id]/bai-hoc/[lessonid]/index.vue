<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import { motion } from 'motion-v'
import LessonInfo from '~/components/lesson/LessonInfo.vue'
import LessonTabs from '~/components/lesson/LessonTabs.vue'
import LessonTableOfContents from '~/components/lesson/LessonTableOfContents.vue'
import type { LessonResourceLink } from '~/components/shared/LessonResources.vue'

const route = useRoute()
const pathParts = route.path.split('/').filter(Boolean)
const courseId = computed(() => String(route.params.id || pathParts[1] || '1'))
const lessonId = computed(() => String(route.params.lessonid || pathParts[3] || route.params.id || '1'))

interface Lesson {
  id: number
  title: string
  duration: string
  videoUrl: string
  content: string
  summary: string
  keywords: string[]
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

const items = ref<BreadcrumbItem[]>([
  {
    label: 'Trang chủ',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: 'Ứng dụng AI trong Y tế',
    to: '/khoa-hoc/1'
  },
  {
    label: 'Chi tiết bài giảng',
    to: '#'
  }
])

const currentLesson = ref<Lesson>({
  id: Number(lessonId),
  title: 'Tác động của AI đến hoạt động kinh doanh',
  duration: '05:00',
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  keywords: ['AI', 'Kinh doanh', 'Tự động hóa', 'Phân tích dữ liệu'],
  content: 'Video này là một phần của: Ứng dụng AI Chìa khóa kinh doanh bứt phá. Khóa học này sẽ giúp bạn hiểu rõ về tác động của trí tuệ nhân tạo đến hoạt động kinh doanh hiện đại. Chúng ta sẽ khám phá cách AI đang thay đổi cách các doanh nghiệp vận hành, từ tự động hóa quy trình đến phân tích dữ liệu thông minh.',
  summary: 'Bài học này tập trung vào việc phân tích tác động của AI đến các hoạt động kinh doanh. Chúng ta sẽ tìm hiểu về tự động hóa, phân tích dữ liệu, và trải nghiệm khách hàng được cá nhân hóa. Ngoài ra, bài học cũng đề cập đến những thách thức mà doanh nghiệp phải đối mặt khi áp dụng AI.'
})

const courseInfo = ref({
  totalVideos: 32,
  totalDuration: '5 giờ 7 phút',
  courseTitle: 'Ứng dụng AI Chìa khóa kinh doanh bứt phá'
})

const chapters = computed<Chapter[]>(() => [
  {
    id: 1,
    title: 'Chào mừng',
    totalLessons: 1,
    totalDuration: '5 phút',
    lessons: [
      {
        id: 1,
        title: 'Chào mừng đến với khóa học',
        duration: '05:00',
        videoUrl: '',
        keywords: [],
        content: '',
        summary: ''
      }
    ]
  },
  {
    id: 2,
    title: 'Giới thiệu về AI',
    totalLessons: 3,
    totalDuration: '15 phút',
    lessons: [
      {
        id: 2,
        title: 'AI là gì?',
        duration: '05:00',
        videoUrl: '',
        keywords: [],
        content: '',
        summary: ''
      },
      {
        id: 3,
        title: 'Lịch sử phát triển AI',
        duration: '05:00',
        videoUrl: '',
        keywords: [],
        content: '',
        summary: ''
      },
      {
        id: 4,
        title: 'Ứng dụng AI trong thực tế',
        duration: '05:00',
        videoUrl: '',
        keywords: [],
        content: '',
        summary: ''
      }
    ]
  },
  {
    id: 3,
    title: 'Tác động và ứng dụng của AI',
    totalLessons: 2,
    totalDuration: '10 phút',
    lessons: [
      {
        id: 5,
        title: 'Tác động của AI đến hoạt động kinh doanh',
        duration: '05:00',
        videoUrl: '',
        keywords: [],
        content: '',
        summary: ''
      },
      {
        id: 6,
        title: 'Ứng dụng AI trong marketing',
        duration: '05:00',
        videoUrl: '',
        keywords: [],
        content: '',
        summary: ''
      }
    ]
  },
  {
    id: 4,
    title: 'Các khái niệm cơ bản của AI',
    totalLessons: 4,
    totalDuration: '20 phút',
    lessons: [
      {
        id: 7,
        title: 'Machine Learning cơ bản',
        duration: '05:00',
        videoUrl: '',
        keywords: [],
        content: '',
        summary: ''
      },
      {
        id: 8,
        title: 'Deep Learning',
        duration: '05:00',
        videoUrl: '',
        keywords: [],
        content: '',
        summary: ''
      },
      {
        id: 9,
        title: 'Neural Networks',
        duration: '05:00',
        videoUrl: '',
        keywords: [],
        content: '',
        summary: ''
      },
      {
        id: 10,
        title: 'Natural Language Processing',
        duration: '05:00',
        videoUrl: '',
        keywords: [],
        content: '',
        summary: ''
      }
    ]
  },
  {
    id: 5,
    title: 'AI cho doanh nghiệp',
    totalLessons: 2,
    totalDuration: '12 phút',
    lessons: [
      {
        id: 11,
        title: 'Trí tuệ nhân tạo cho doanh nghiệp',
        duration: '07:00',
        videoUrl: '',
        keywords: [],
        content: '',
        summary: '',
        statusText: '7 phút',
        document: {
          id: 'doc-11-1',
          title: 'Xem tài liệu tham khảo',
          documentUrl: 'https://example.com/document-11',
          done: false,
          icon: 'i-lucide-message-square-text'
        },
        quiz: {
          id: 'quiz-11-1',
          title: 'Làm bài tập: Quiz 1 (10/10)',
          to: `/khoa-hoc/${courseId.value}/bai-hoc/11/quiz`,
          done: true
        }
      },
      {
        id: 12,
        title: 'Tác động của AI đến hoạt động kinh doanh',
        duration: '05:00',
        videoUrl: '',
        keywords: [],
        content: '',
        summary: '',
        statusText: 'Đang phát • Còn 5 phút',
        document: {
          id: 'doc-12-1',
          title: 'Xem tài liệu tham khảo',
          documentUrl: 'https://example.com/document-12',
          done: false,
          icon: 'i-lucide-message-square-text'
        },
        quiz: {
          id: 'quiz-12-1',
          title: 'Làm bài tập: Quiz 2',
          to: `/khoa-hoc/${courseId.value}/bai-hoc/12/quiz`,
          done: false
        }
      }
    ]
  }
])

const title = computed(() => `${currentLesson.value.title} - MedUni.ai`)

useSeoMeta({
  title: title.value,
  ogTitle: title.value,
  description: currentLesson.value.summary,
  ogDescription: currentLesson.value.summary
})
</script>

<template>
  <UContainer class="mb-10 md:mb-20">
    <UBreadcrumb
      :items="items"
    />

    <div class="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] 2xl:grid-cols-[1fr_530px] gap-6 md:gap-7">
      <div>
        <motion.div
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5 }"
        >
          <PlayerVideo />
          <!-- <LessonVideo :video-url="currentLesson.videoUrl" /> -->
        </motion.div>

        <motion.div
          :initial="{ opacity: 0, x: -100 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.3, ease: 'easeOut', delay: 0.1 }"
          class="mt-6"
        >
          <LessonInfo
            :keywords="currentLesson.keywords"
            :total-videos="courseInfo.totalVideos"
            :total-duration="courseInfo.totalDuration"
            :title="currentLesson.title"
            :course-title="courseInfo.courseTitle"
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
          :current-lesson-id="currentLesson.id"
        />
      </motion.div>
    </div>
  </UContainer>
</template>
