<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'
import ChapterIcon from '~/assets/icons/chapter.svg'
import LessonResources, { type LessonResourceLink } from '~/components/shared/LessonResources.vue'
import LearningDoneIcon from '~/assets/icons/learning_done.svg'

interface Lesson {
  id: number
  title: string
  duration: string
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

      <SharedProcessLearning :progress="progress" />
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
          <template
            v-for="lesson in item.lessons"
            :key="lesson.id"
          >
            <li
              :class="[
                lesson.quiz?.done
                  ? 'bg-learning-done'
                  : lesson.id === currentLessonId
                    ? 'bg-sky-100'
                    : ''
              ]"
            >
              <NuxtLink
                :to="`/khoa-hoc/${courseId}/bai-hoc/${lesson.id}`"
                :class="[
                  'flex rounded-sm items-center gap-4 min-h-14 md:min-h-15 px-3 md:px-5 hover:bg-primary-50 hover:text-primary transition-colors',
                  lesson.quiz?.done ? 'bg-learning-done hover:bg-learning-done' : (lesson.id === currentLessonId ? 'bg-sky-100' : '')
                ]"
              >
                <div
                  v-if="lesson.quiz?.done"
                  class="size-5"
                >
                  <LearningDoneIcon />
                </div>
                <div
                  v-else-if="lesson.id === currentLessonId"
                  class="size-5 animate-stroke-draw"
                >
                  <UIcon name="i-lucide-circle-pause" />
                </div>
                <div
                  v-else
                  class="size-5 text-primary"
                >
                  <UIcon name="i-lucide-circle-play" />
                </div>
                <span class="text-base md:text-lg flex-1 font-medium line-clamp-1">
                  {{ lesson.title }}
                </span>
                <span class="text-sm md:text-base font-semibold text-neutral-600">
                  {{ lesson.duration }}
                </span>
              </NuxtLink>

              <div
                v-if="lesson.document || lesson.quiz"
                class="px-3 md:px-5 pt-2"
              >
                <LessonResources
                  :document="lesson.document"
                  :quiz="lesson.quiz"
                  :is-active="lesson.id === currentLessonId"
                />
              </div>
            </li>
          </template>
        </ul>
      </template>
    </UAccordion>
  </div>
</template>
