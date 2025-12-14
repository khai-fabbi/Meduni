<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'
import ChapterIcon from '~/assets/icons/chapter.svg'

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
const activeChapter = ref<string[]>(['0'])
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

  activeChapter.value = ['2']
})

const progress = 50
</script>

<template>
  <div class="bg-white h-fit rounded-lg shadow-md p-4 md:p-5 space-y-6 sticky top-28">
    <div class="flex items-center pb-2 justify-between border-b border-neutral-200">
      <Heading
        variant="h4"
        class="text-primary"
      >
        Video khoá học
      </Heading>

      <div
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
            stroke="var(--color-primary-100)"
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
            :stroke-dashoffset="100 - progress"
            stroke-linecap="round"
            class="transition-all duration-300"
          />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-base font-black text-primary ">
            {{ progress }}<span class="text-[10px] relative -top-1">%</span>
          </span>
        </div>
      </div>
    </div>

    <UAccordion
      v-model="activeChapter"
      :items="accordionItems"
      type="multiple"
      :ui="{
        root: 'bg-white rounded-sm md:rounded-sm overflow-hidden',
        leadingIcon: 'size-5 md:size-6',
        item: 'border-0',
        label: 'text-base md:text-xl font-semibold',
        header: 'py-1 rounded-sm md:py-1 px-3 md:px-4 cursor-pointer transition-colors data-[state=open]:bg-neutral-200',
        trigger: 'gap-3 md:gap-4 cursor-pointer',
        trailingIcon: 'size-6',
        content: 'py-1'
      }"
    >
      <template #content="{ item }">
        <ul class="space-y-1">
          <li
            v-for="lesson in item.lessons"
            :key="lesson.id"
          >
            <NuxtLink
              :to="`/khoa-hoc/${courseId}/bai-hoc/${lesson.id}`"
              :class="[
                'flex rounded-sm items-center gap-4 min-h-14 md:min-h-15 px-3 md:px-5 hover:bg-primary-50 hover:text-primary transition-colors',
                lesson.id === currentLessonId ? 'bg-primary-50 text-primary' : ''
              ]"
            >
              <UIcon
                :name="lesson.id === currentLessonId ? 'i-lucide-circle-pause' : 'i-lucide-circle-play'"
                class="size-5 animate-stroke-draw"
              />
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
