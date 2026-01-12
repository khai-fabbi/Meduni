<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'
import ChapterIcon from '~/assets/icons/chapter.svg'
import LessonResources, { type LessonResourceLink } from '~/components/shared/LessonResources.vue'
import LearningDoneIcon from '~/assets/icons/learning_done.svg'

interface Lesson {
  id: string
  title: string
  duration: string
  statusText?: string
  document?: LessonResourceLink
  quiz?: LessonResourceLink[]
  is_complete?: boolean
  is_view?: boolean
}

interface Chapter {
  id: number
  title: string
  lessons: Lesson[]
  totalLessons: number
  totalDuration: string
  chapterQuiz?: LessonResourceLink[]
}

interface Props {
  chapters: Chapter[]
  courseId: string
  currentLessonId: string
  progress?: number
}

const props = withDefaults(defineProps<Props>(), {
  progress: 0
})

const accordionItems = shallowRef<AccordionItem[]>([])
const activeChapter = ref<string[]>(['0'])
const scrollContainer = ref<HTMLElement | null>(null)

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
  // Find active chapter
  const foundChapterIndex = props.chapters.findIndex(chapter => chapter.lessons.some(lesson => lesson.id === props.currentLessonId)) || 0
  activeChapter.value = [foundChapterIndex.toString()]

  // Scroll to active chapter within the container only
  setTimeout(() => {
    const activeChapterElement = document.getElementById(`lesson-${props.currentLessonId}`)
    if (activeChapterElement && scrollContainer.value) {
      const container = scrollContainer.value
      const elementTop = activeChapterElement.offsetTop
      const elementHeight = activeChapterElement.offsetHeight
      const containerHeight = container.clientHeight
      const scrollTop = elementTop - (containerHeight / 2) + (elementHeight / 2)

      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      })
    }
  }, 300)
})
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

      <SharedProcessLearning
        v-if="props.progress < 100"
        :progress="props.progress"
      />
      <div
        v-else
        class="flex items-center gap-2 shrink-0 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full"
      >
        <UIcon
          name="i-lucide-check-circle"
          class="size-4 text-emerald-600 shrink-0"
        />
        <span class="text-sm font-semibold text-emerald-700 whitespace-nowrap">
          Đã hoàn thành
        </span>
      </div>
    </div>
    <div
      ref="scrollContainer"
      class="md:h-[calc(80vh-200px)] min-h-[520px] overflow-y-auto"
    >
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
                :id="`lesson-${lesson.id}`"
                :class="[
                  lesson.id === currentLessonId
                    ? 'bg-sky-100'
                    : (lesson.quiz && lesson.quiz.length > 0 ? lesson.quiz.every((q: LessonResourceLink) => q.done) : false) || lesson.is_complete
                      ? 'bg-learning-done hover:bg-learning-done'
                      : ''
                ]"
                class="-scroll-mt-30"
              >
                <NuxtLink
                  :to="`/khoa-hoc/${courseId}/bai-hoc/${lesson.id}`"
                  :class="[
                    'flex rounded-sm items-center gap-4 min-h-14 md:min-h-15 px-3 md:px-5 hover:bg-primary-50 hover:text-primary transition-colors',
                    lesson.id === currentLessonId
                      ? 'bg-sky-100'
                      : (lesson.quiz && lesson.quiz.length > 0 ? lesson.quiz.every((q: LessonResourceLink) => q.done) : false) || lesson.is_complete
                        ? 'bg-learning-done hover:bg-learning-done'
                        : ''
                  ]"
                >
                  <div
                    class="text-primary flex items-center gap-2"
                  >
                    <UIcon
                      v-if="lesson.id === currentLessonId"
                      name="i-lucide-circle-pause"
                      class="size-5"
                    />
                    <LearningDoneIcon
                      v-else-if="(lesson.quiz && lesson.quiz.length > 0 ? lesson.quiz.every((q: LessonResourceLink) => q.done) : false) || lesson.is_complete"
                      class="size-5"
                    />
                    <UIcon
                      v-else
                      name="i-lucide-circle-play"
                      class="size-5"
                    />
                  </div>
                  <span class="text-base md:text-lg flex-1 font-medium line-clamp-1">
                    {{ lesson.title }}
                  </span>
                  <span class="text-sm md:text-base font-semibold text-neutral-600">
                    {{ lesson.duration }}
                  </span>
                </NuxtLink>

                <div
                  v-if="lesson.document || (lesson.quiz && lesson.quiz.length > 0)"
                  class="px-3 md:px-5 pt-2"
                >
                  <LessonResources
                    :document="lesson.document"
                    :quiz="lesson.quiz"
                    :is-active="lesson.id === currentLessonId"
                    :is-lesson-completed="lesson.is_complete === true"
                  />
                </div>
              </li>
            </template>
            <!-- Chapter Quiz -->
            <template
              v-if="item.chapterQuiz && item.chapterQuiz.length > 0"
            >
              <li
                v-for="quizItem in item.chapterQuiz"
                :key="quizItem.id"
                :class="[
                  'px-3 md:px-5 pt-2',
                  quizItem.done ? 'bg-learning-done hover:bg-learning-done' : ''
                ]"
              >
                <LessonResources
                  :quiz="[quizItem]"
                  :is-lesson-completed="true"
                />
              </li>
            </template>
          </ul>
        </template>
      </UAccordion>
    </div>
  </div>
</template>
