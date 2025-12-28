<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'
import ChapterIcon from '~/assets/icons/chapter.svg'
import PlayCircleIcon from '~/assets/icons/play-circle.svg'

interface Lesson {
  title: string
  duration: string
  lesson_order: number
  lesson_type: number
  lesson_id: string
}

interface Chapter {
  id: number
  title: string
  lessons: Lesson[]
  totalLessons: number
  totalDuration: string
}

interface Props {
  chapters: Chapter[]
  courseId: string
  isOwned?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOwned: false
})

const items = shallowRef<AccordionItem[]>([])

onMounted(() => {
  items.value = props.chapters.map(chapter => ({
    label: chapter.title,
    icon: ChapterIcon,
    ...chapter,
    lessons: chapter.lessons.map(lesson => ({
      icon: 'i-lucide-play',
      ...lesson
    }))
  }))
})
</script>

<template>
  <div class="space-y-4">
    <Heading
      variant="h5"
      as="h4"
    >
      Nội dung khóa học
    </Heading>
    <div class="space-y-2">
      <UAccordion
        :items="items"
        type="multiple"
        :ui="{
          root: 'bg-white rounded-sm md:rounded-lg overflow-hidden',
          leadingIcon: 'size-5 md:size-6',
          item: 'border-neutral-200',
          label: 'text-base md:text-xl font-bold data-[state=open]:text-primary',
          header: 'py-1 md:py-2 px-3 md:px-5 cursor-pointer transition-colors data-[state=open]:text-primary data-[state=open]:bg-primary-light',
          trigger: 'gap-3 md:gap-4 cursor-pointer',
          trailingIcon: 'size-6'
        }"
      >
        <template #content="{ item }">
          <ul>
            <li
              v-for="lesson in item.lessons"
              :key="lesson.lesson_id"
            >
              <NuxtLink
                :to="`/khoa-hoc/${courseId}/bai-hoc/${lesson.lesson_id}`"
                class="flex items-center gap-4 min-h-15 md:min-h-16 px-3 md:px-5 border-b border-neutral-200 hover:bg-primary-50 hover:text-primary transition-colors"
                :class="[isOwned ? 'cursor-pointer' : 'cursor-default']"
              >
                <PlayCircleIcon class="size-5" />
                <span class="text-base md:text-lg flex-1 font-medium line-clamp-1">
                  {{ lesson.title }}
                </span>
                <span class="text-sm md:text-base font-semibold text-neutral-600">
                  {{ lesson.duration }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </template>
      </UAccordion>
    </div>
  </div>
</template>
