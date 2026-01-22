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
  isLoading?: boolean
}

defineProps<Props>()

defineEmits<{
  'add-to-cart': [courseId: string]
  'buy-now': [courseId: string]
}>()
</script>

<template>
  <div class="sticky top-28 px-4 py-6 space-y-6 bg-white rounded-lg shadow-md md:shadow-lg md:px-5 md:py-7">
    <Heading
      variant="h5"
      as="h4"
    >
      Chi tiết khóa học bao gồm:
    </Heading>
    <USeparator />

    <div class="space-y-4 text-base md:space-y-7.5 md:text-lg">
      <div class="flex gap-3 items-center">
        <VolumeIcon class="size-5 md:size-6" />
        <span>Ngôn ngữ:</span>
        <span class="font-semibold">{{ courseInfo.language }}</span>
      </div>
      <div class="flex gap-2 items-center md:gap-3">
        <BookIcon class="size-5 md:size-6" />
        <span>Số bài học:</span>
        <span class="font-semibold">{{ courseInfo.totalLessons }}</span>
      </div>
      <div class="flex gap-2 items-center md:gap-3">
        <DifficultyIcon class="size-5 md:size-6" />
        <span>Độ khó:</span>
        <span class="font-semibold">{{ courseInfo.difficulty }}</span>
      </div>
      <div class="flex gap-2 items-center md:gap-3">
        <TimeIcon class="size-5 md:size-6" />
        <span>Thời gian:</span>
        <span class="font-semibold">{{ courseInfo.duration }}</span>
      </div>
      <div class="flex flex-wrap gap-2 items-center md:gap-3">
        <CertificateIcon class="size-5 md:size-6" />
        <span>Giấy chứng nhận:</span>
        <span class="font-semibold">{{ courseInfo.certificate }}</span>
      </div>
    </div>

    <USeparator />
    <template v-if="isOwned">
      <UButton
        label="Bắt đầu học"
        color="primary"
        size="xl"
        block
        class="bg-gradient-to-b min-h-12 md:min-h-14 from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800"
        icon="i-lucide-book-open"
        :to="`/khoa-hoc/${courseInfo.courseId}/bai-hoc/${firstLessonId}`"
      />
    </template>
    <template v-else>
      <div class="space-y-3">
        <UButton
          :label="isLoading ? 'Đang xử lý...' : 'Thêm vào giỏ hàng'"
          color="primary"
          size="xl"
          block
          :loading="isLoading"
          :disabled="isLoading"
          class="text-base text-white bg-gradient-to-b rounded-full shadow-md transition-all min-h-12 md:min-h-14 from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 hover:shadow-lg"
          icon="i-lucide-shopping-cart"
          @click="$emit('add-to-cart', courseInfo.courseId)"
        />
        <UButton
          label="Mua ngay"
          color="secondary"
          size="xl"
          block
          class="text-base text-white bg-gradient-to-b rounded-full shadow-md transition-all min-h-12 md:min-h-14 from-secondary-500 to-secondary-700 hover:from-secondary-600 hover:to-secondary-800 hover:shadow-lg"
          icon="i-lucide-book-open"
          @click="$emit('buy-now', courseInfo.courseId)"
        />
      </div>
    </template>
  </div>
</template>
