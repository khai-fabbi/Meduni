<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import { motion } from 'motion-v'
import CourseOverview from '~/components/course/CourseOverview.vue'
import CourseContent from '~/components/course/CourseContent.vue'
import CourseDetails from '~/components/course/CourseDetails.vue'
import InstructorInfo from '~/components/course/InstructorInfo.vue'

const route = useRoute()
const courseId = route.params.id

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

const items = ref<BreadcrumbItem[]>([
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
    label: 'Chi tiết khóa học',
    to: '#'
  }
])

const isOwned = ref(false)

const course = ref({
  id: courseId,
  image: 'https://images.unsplash.com/photo-1674027444485-cec3da58eef4?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  tag: 'Kinh Doanh',
  title: 'Chiến lược trí tuệ nhân tạo dành cho lãnh đạo',
  subtitle: 'Tầm nhìn – Chiến lược - Thực thi Doanh nghiệp đột phá dẫn đầu kỷ nguyên số',
  overview: 'Khóa học giúp bạn nắm bắt tư duy và công cụ AI hiện đại để tối ưu vận hành, nâng cao hiệu quả marketing và bứt phá doanh thu. Dành cho chủ doanh nghiệp, nhà quản lý và người khởi nghiệp muốn dẫn đầu xu hướng công nghệ, ứng dụng AI vào thực tiễn kinh doanh một cách thông minh và hiệu quả.',
  language: 'Tiếng Việt',
  totalLessons: 16,
  difficulty: 'Trình độ Cao',
  duration: '17 giờ 43 phút',
  certificate: 'Khi khóa học kết thúc',
  instructor: {
    name: 'Vũ Văn Khải',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Tại Học viện Med AI, A.Khải và đội ngũ phát triển hệ tư duy lôi và phương pháp khoa học giúp cha mẹ đồng hành hiệu quả cùng con.',
    greeting: 'Xin chào! Mình là trợ lý MEDUNI. Nếu bạn thắc mắc bất cứ điều gì MEDUNI, hãy đặt câu hỏi để mình ai giới đẹp hoặc tư vấn nga',
    stats: [
      'Hàng tháng, 40.000-60.000 khách hàng tham dự các chương trình trực tuyến miễn phí dành cho cha mẹ do cô Lanh trực tiếp chia sẻ.',
      'Gần 50.000 khách hàng đã và đang tham gia các chương trình trực tuyến hàng tháng.',
      'Hàng chục nghìn gia đình đã và đang chuyển hóa tích cực 5 lan tỏa giá trị tích cực tới cộng đồng & xã hội.'
    ]
  }
})

const chapters: Chapter[] = [
  {
    id: 1,
    title: 'Chương 1 Giới thiệu về Ứng dụng AI',
    totalLessons: 4,
    totalDuration: '16 phút',
    lessons: [
      {
        id: 1,
        title: 'Giới thiệu ứng dụng AI cho người mới bắt đầu',
        duration: '03:17'
      },
      {
        id: 2,
        title: 'Làm quen với ứng dụng AI',
        duration: '03:17'
      },
      {
        id: 3,
        title: 'Cách sử dụng AI làm chìa khóa kinh doanh',
        duration: '03:17'
      },
      {
        id: 4,
        title: 'Tóm tắt bài học và những điều cần lưu ý',
        duration: '03:17'
      }
    ]
  },
  {
    id: 2,
    title: 'Chương 2 Làm quen với ứng dụng AI',
    totalLessons: 4,
    totalDuration: '16 phút',
    lessons: [
      {
        id: 5,
        title: 'Bài học 5',
        duration: '03:17'
      },
      {
        id: 6,
        title: 'Bài học 6',
        duration: '03:17'
      },
      {
        id: 7,
        title: 'Bài học 7',
        duration: '03:17'
      },
      {
        id: 8,
        title: 'Bài học 8',
        duration: '03:17'
      }
    ]
  }
]

const title = computed(() => `${course.value.title} - MedUni.ai`)
const description = computed(() => course.value.overview)

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

    <div class="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] 2xl:grid-cols-[1fr_530px] gap-6 md:gap-7">
      <div class="space-y-6">
        <motion.div
          class="overflow-hidden rounded-lg"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5 }"
        >
          <NuxtImg
            :src="course.image"
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

          <p class="text-lg text-muted">
            {{ course.subtitle }}
          </p>
        </motion.div>

        <motion.div
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.2 }"
        >
          <CourseOverview :overview="course.overview" />
        </motion.div>

        <motion.div
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
            :name="course.instructor.name"
            :avatar="course.instructor.avatar"
            :description="course.instructor.description"
            :stats="course.instructor.stats"
          />
        </motion.div>
      </div>
    </div>
  </UContainer>
</template>
