<script setup lang="ts">
import VolumeIcon from '~/assets/icons/volume.svg'
import BookIcon from '~/assets/icons/book.svg'
import DifficultyIcon from '~/assets/icons/difficulty.svg'
import TimeIcon from '~/assets/icons/time.svg'
import CertificateIcon from '~/assets/icons/certificate.svg'

interface CourseInfo {
  courseId: string
  language: string
  totalLessons: number
  difficulty: string
  duration: string
  certificate: string
}

interface Props {
  courseInfo: CourseInfo
  isOwned: boolean
  firstLessonId: string
}

defineProps<Props>()
</script>

<template>
  <div class="bg-white space-y-6 sticky top-28 rounded-lg shadow-md px-4 py-6 md:shadow-lg md:px-5 md:py-7">
    <Heading
      variant="h5"
      as="h4"
    >
      Chi tiết khóa học bao gồm:
    </Heading>
    <USeparator />

    <div class="space-y-4 md:space-y-7.5 text-base md:text-lg">
      <div class="flex items-center gap-3">
        <VolumeIcon class="size-5 md:size-6" />
        <span>Ngôn ngữ:</span>
        <span class="font-semibold">{{ courseInfo.language }}</span>
      </div>
      <div class="flex gap-2 md:gap-3 items-center">
        <BookIcon class="size-5 md:size-6" />
        <span>Số bài học:</span>
        <span class="font-semibold">{{ courseInfo.totalLessons }}</span>
      </div>
      <div class="flex gap-2 md:gap-3 items-center">
        <DifficultyIcon class="size-5 md:size-6" />
        <span>Độ khó:</span>
        <span class="font-semibold">{{ courseInfo.difficulty }}</span>
      </div>
      <div class="flex gap-2 md:gap-3 items-center">
        <TimeIcon class="size-5 md:size-6" />
        <span>Thời gian:</span>
        <span class="font-semibold">{{ courseInfo.duration }}</span>
      </div>
      <div class="flex flex-wrap gap-2 md:gap-3 items-center">
        <CertificateIcon class="size-5 md:size-6" />
        <span>Giấy chứng nhận:</span>
        <span class="font-semibold">{{ courseInfo.certificate }}</span>
      </div>
    </div>

    <USeparator />

    <UButton
      :label="isOwned ? 'Bắt đầu học' : 'Đăng ký khóa học'"
      color="primary"
      size="xl"
      block
      class="min-h-12 md:min-h-14 bg-gradient-to-b from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800"
      icon="i-lucide-book-open"
      :to="isOwned ? `/khoa-hoc/${courseInfo.courseId}/bai-hoc/${firstLessonId}` : '#'"
    />
  </div>
</template>
