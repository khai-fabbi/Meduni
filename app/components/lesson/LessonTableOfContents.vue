<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'
import ChapterIcon from '~/assets/icons/chapter.svg'
import PlayCircleIcon from '~/assets/icons/play-circle.svg'

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

interface Props {
  chapters: Chapter[]
  courseId: string
  currentLessonId: number
}

const props = defineProps<Props>()

const accordionItems = shallowRef<AccordionItem[]>([])

onMounted(() => {
  accordionItems.value = props.chapters.map(chapter => ({
    label: chapter.title,
    icon: ChapterIcon,
    ...chapter,
    lessons: chapter.lessons.map(lesson => ({
      icon: 'i-lucide-play',
      ...lesson
    }))
  }))
})

const totalLessons = computed(() => {
  return props.chapters.reduce((acc, ch) => acc + ch.totalLessons, 0)
})
</script>

<template>
  <div class="bg-white h-fit rounded-lg shadow-md p-4 md:p-6 space-y-6 sticky top-28">
    <div class="flex items-center justify-between mb-4">
      <Heading
        variant="h4"
        class="text-primary"
      >
        Video khoá học
      </Heading>
      <UBadge
        color="primary"
        variant="subtle"
        size="lg"
      >
        {{ totalLessons }}
      </UBadge>
    </div>

    <UAccordion
      :items="accordionItems"
      type="multiple"
      :ui="{
        root: 'bg-white rounded-sm md:rounded-lg overflow-hidden',
        leadingIcon: 'size-5 md:size-6',
        item: 'border-neutral-200',
        label: 'text-base md:text-xl font-bold data-[state=open]:text-primary',
        header: 'py-1 md:py-2 px-3 md:px-5 cursor-pointer transition-colors data-[state=open]:text-primary data-[state=open]:bg-primary-light',
        trigger: 'gap-3 md:gap-4 cursor-pointer'
      }"
    >
      <template #content="{ item }">
        <ul>
          <li
            v-for="lesson in item.lessons"
            :key="lesson.id"
          >
            <NuxtLink
              :to="`/khoa-hoc/${courseId}/bai-hoc/${lesson.id}`"
              :class="[
                'flex items-center gap-4 min-h-15 md:min-h-16 px-3 md:px-5 border-b border-neutral-200 hover:bg-primary-50 hover:text-primary transition-colors',
                lesson.id === currentLessonId ? 'bg-primary-50 text-primary' : ''
              ]"
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
</template>
