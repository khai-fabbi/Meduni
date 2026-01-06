<script setup lang="ts">
import { motion } from 'motion-v'
import { useIntervalFn } from '@vueuse/core'
import { services } from '~/services'

definePageMeta({
  middleware: 'auth'
})
const route = useRoute()
const courseId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : String(route.params.id || '1')
const lessonId = Array.isArray(route.params.lessonid)
  ? route.params.lessonid[0]
  : String(route.params.lessonid || '1')
const exerciseId = computed(() => {
  const id = route.query.exercise_id
  const exerciseIdValue = Array.isArray(id) ? id[0] : String(id || '')
  // Remove /quiz if it exists at the end of exercise_id
  return exerciseIdValue ? exerciseIdValue.replace(/\/quiz$/, '') : ''
})

// Get myCourseId from query params or course data
const myCourseIdFromQuery = computed(() => {
  const id = route.query.my_course_id
  return Array.isArray(id) ? id[0] : String(id || '')
})

// Get myCourseId from course data if not in query
if (!courseId) {
  throw createError({
    statusCode: HttpCode.NOT_FOUND,
    statusMessage: 'Không tìm thấy khóa học',
    fatal: true
  })
}
const {
  data: courseData
} = await services.courses.getCourseById(courseId)
const myCourseIdFromData = computed(() => courseData.value?.data?.my_course_id)

// Use myCourseId from query if available, otherwise use from course data
const myCourseId = computed(() => myCourseIdFromQuery.value || myCourseIdFromData.value)

const exerciseIdValue = exerciseId.value
if (!exerciseIdValue) {
  throw createError({
    statusCode: HttpCode.NOT_FOUND,
    statusMessage: 'Không tìm thấy bài tập',
    fatal: true
  })
}

// Fetch exercise data
const isLoading = ref(true)
type ExerciseData = {
  id: string
  exercise_id: string
  exercise_name: string
  chapter_id?: string
  course_id: string
  lesson_id: string
  my_course_id: string
  exercise_type: number
  file_uploads?: string[]
  teacher_id?: string[]
  questions: Array<{
    id: number
    question: string
    question_type: number
    multiple_choice_type: number
    answers: Array<{
      content: string
      is_choose: boolean
    }>
  }>
  time_remaining: number
  is_complete?: boolean
  submit_date?: string
  submit_time?: number
}

const exerciseData = ref<ExerciseData | null>(null)
const previousSubmission = ref<ExerciseData | null>(null)

try {
  if (!exerciseIdValue) {
    throw new Error('Missing required parameters')
  }
  // Use myCourseId if available, otherwise use courseId
  const courseIdForApi = myCourseId.value || courseId
  const response = await services.courses.getExercise(courseIdForApi, exerciseIdValue)
  const allSubmissions = response.data || []

  // Phần tử 0 luôn là câu hỏi (chưa submit)
  // Phần tử 1 là câu trả lời gần nhất (submission mới nhất)
  if (allSubmissions.length > 1) {
    // Có submissions cũ, lấy phần tử gần item 0 nhất (index 1) làm câu trả lời gần nhất
    previousSubmission.value = allSubmissions[1] as ExerciseData
  }

  // Phần tử 0 là câu hỏi để làm bài
  exerciseData.value = allSubmissions[0] as ExerciseData || null

  // Nếu quiz đã hoàn thành (is_complete = true), redirect đến result page
  if (exerciseData.value?.is_complete === true) {
    const resultUrl = `/khoa-hoc/${courseId}/bai-hoc/${lessonId}/quiz/result?exercise_id=${exerciseIdValue}${myCourseId.value ? `&my_course_id=${myCourseId.value}` : ''}`
    await navigateTo(resultUrl)
  } else {
    isLoading.value = false
  }
} catch {
  isLoading.value = false
  throw createError({
    statusCode: HttpCode.NOT_FOUND,
    statusMessage: 'Không tìm thấy bài tập',
    fatal: true
  })
}

const currentQuestion = ref(1)
const totalQuestions = computed(() => {
  return exerciseData.value?.questions?.length || 0
})
const timeRemaining = ref(600)
const selectedAnswer = ref<string | null>(null)
const answeredQuestions = ref<Record<number, boolean>>({})
const questionAnswers = ref<Record<number, string>>({})

// Map exercise data to questions
interface ApiQuestion {
  id: number
  question: string
  question_type: number
  multiple_choice_type: number
  answers: Array<{
    content: string
    is_choose: boolean
  }>
}

interface Question {
  id: number
  questionId: string
  text: string
  options: Array<{
    id: string
    answerId?: string
    text: string
  }>
}

const questions = computed<Question[]>(() => {
  if (!exerciseData.value?.questions) return []

  return (exerciseData.value.questions as ApiQuestion[]).map((q: ApiQuestion, index: number) => ({
    id: q.id || index + 1,
    questionId: `question_${q.id || index + 1}`,
    text: q.question,
    options: q.answers.map((answer, ansIndex: number) => ({
      id: String.fromCharCode(65 + ansIndex), // A, B, C, D...
      answerId: `answer_${ansIndex}`,
      text: answer.content
    }))
  }))
})

// Initialize time remaining from API
watch(() => exerciseData.value?.time_remaining, (time) => {
  if (time !== undefined && time > 0) {
    timeRemaining.value = time
  }
}, { immediate: true })

// Don't pre-fill answers when retaking quiz - let user start fresh
// Previous answers are only displayed for reference, not auto-selected

watch(currentQuestion, (newQuestion) => {
  const currentQ = questions.value[newQuestion - 1]
  const qId = currentQ?.id || newQuestion
  selectedAnswer.value = questionAnswers.value[qId] || null
})

// Question interface is used in computed questions

const goToQuestion = (questionNumber: number) => {
  if (selectedAnswer.value) {
    questionAnswers.value[currentQuestion.value] = selectedAnswer.value
  }
  currentQuestion.value = questionNumber
  selectedAnswer.value = questionAnswers.value[questionNumber] || null
}

const nextQuestion = () => {
  if (selectedAnswer.value) {
    answeredQuestions.value[currentQuestion.value] = true
    questionAnswers.value[currentQuestion.value] = selectedAnswer.value
    if (currentQuestion.value < totalQuestions.value) {
      currentQuestion.value++
      selectedAnswer.value = questionAnswers.value[currentQuestion.value] || null
    } else if (allQuestionsAnswered.value) {
      submitQuiz()
    }
  }
}

const previousQuestion = () => {
  if (selectedAnswer.value) {
    questionAnswers.value[currentQuestion.value] = selectedAnswer.value
  }
  if (currentQuestion.value > 1) {
    currentQuestion.value--
    selectedAnswer.value = questionAnswers.value[currentQuestion.value] || null
  }
}

const isSubmitting = ref(false)
const submitQuiz = async () => {
  if (isSubmitting.value) return

  isSubmitting.value = true
  try {
    const exercise = exerciseData.value
    if (!exercise || !exerciseIdValue) {
      throw new Error('Missing exercise data')
    }
    // Use myCourseId if available, otherwise use courseId
    const courseIdForApi = myCourseId.value || courseId

    // Prepare questions with selected answers
    const updatedQuestions = exercise.questions.map((q, index) => {
      const selectedAnswerId = questionAnswers.value[q.id || index + 1]

      // Update answers with is_choose based on selected option
      const updatedAnswers = q.answers.map((answer, ansIndex) => {
        const optionId = String.fromCharCode(65 + ansIndex)
        return {
          content: answer.content,
          is_choose: optionId === selectedAnswerId
        }
      })

      return {
        id: q.id || index + 1,
        question: q.question,
        question_type: q.question_type,
        multiple_choice_type: q.multiple_choice_type,
        answers: updatedAnswers
      }
    })

    // Prepare exercise data for submission
    const submitData: ExerciseData = {
      ...exercise,
      questions: updatedQuestions,
      time_remaining: 0,
      file_uploads: exercise.file_uploads || []
    }

    // Submit exercise
    await services.courses.submitExercise(
      courseIdForApi,
      exerciseIdValue,
      submitData
    )

    // Navigate to result page with exercise_id
    // Result page will fetch data from API, no need to save to cookie
    navigateTo(`/khoa-hoc/${courseId}/bai-hoc/${lessonId}/quiz/result?exercise_id=${exerciseIdValue}`)
  } catch {
    isSubmitting.value = false
    const toast = useToast()
    toast.add({
      title: 'Lỗi',
      description: 'Không thể nộp bài. Vui lòng thử lại.',
      color: 'error'
    })
  }
}

const goBack = () => {
  navigateTo(`/khoa-hoc/${courseId}/bai-hoc/${lessonId}`)
}

const { pause } = useIntervalFn(() => {
  if (timeRemaining.value > 0) {
    timeRemaining.value--
  } else {
    pause()
    // Auto submit when time is up
    if (allQuestionsAnswered.value) {
      submitQuiz()
    }
  }
}, 1000)

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:00`
}

const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Map previous submission questions for display
const previousAnswers = computed(() => {
  if (!previousSubmission.value?.questions) return []

  return previousSubmission.value.questions.map((q, index) => ({
    id: q.id || index + 1,
    question: q.question,
    answers: q.answers.map((answer, ansIndex) => ({
      id: String.fromCharCode(65 + ansIndex), // A, B, C, D...
      content: answer.content,
      is_choose: answer.is_choose
    }))
  }))
})

const quizTitle = computed(() => {
  return exerciseData.value?.exercise_name || route.query.title || 'Bài tập'
})

const allQuestionsAnswered = computed(() => {
  for (let i = 1; i <= totalQuestions.value; i++) {
    if (!answeredQuestions.value[i]) {
      return false
    }
  }
  return true
})

const selectAnswer = (optionId: string) => {
  selectedAnswer.value = optionId
  const currentQId = questions.value[currentQuestion.value - 1]?.id || currentQuestion.value
  questionAnswers.value[currentQId] = optionId
  answeredQuestions.value[currentQId] = true
}

onMounted(() => {
  // Data is already loaded from API
})
</script>

<template>
  <SkeletonQuiz v-if="isLoading" />

  <div
    v-else
    class="min-h-screen bg-neutral-100"
  >
    <div class="px-4 py-4 mt-6 mb-0 md:px-6">
      <div class="flex gap-2 justify-between items-center mx-auto max-w-7xl md:gap-4">
        <div class="flex flex-1 gap-2 items-center min-w-0 md:gap-4">
          <UButton
            icon="i-lucide-arrow-left"
            variant="solid"
            class="text-sm bg-white border md:text-base text-neutral-900 hover:bg-neutral-50 border-neutral-200 shrink-0"
            @click="goBack"
          >
            <span class="hidden md:inline">Quay lại bài giảng</span>
            <span class="md:hidden">Quay lại</span>
          </UButton>
          <span class="flex-1 min-w-0 text-lg font-bold md:text-2xl text-primary line-clamp-1">
            {{ quizTitle }}
          </span>
        </div>
        <div class="flex gap-2 items-center shrink-0">
          <span class="text-sm font-semibold md:text-lg text-primary">
            {{ currentQuestion }}/{{ totalQuestions }}
          </span>
          <span class="text-dot-gray">•</span>
          <div class="flex gap-1.5 items-center">
            <UIcon
              name="i-lucide-clock"
              class="size-3.5 md:size-4 text-primary"
            />
            <span class="text-sm font-semibold md:text-lg text-primary">
              {{ formatTime(timeRemaining) }}<span class="hidden md:inline"> phút</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="px-4 py-6 mx-auto max-w-7xl md:px-6">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        <motion.div
          :initial="{ opacity: 0, x: 100 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.3, ease: 'easeOut' }"
        >
          <div class="p-5 bg-white rounded-lg shadow-md md:p-8">
            <h2 class="mb-3 text-xl font-bold md:text-2xl text-neutral-900">
              Câu {{ currentQuestion }}
            </h2>
            <p class="mb-3 text-base md:text-xl text-neutral-700">
              {{ questions[currentQuestion - 1]?.text }}
            </p>

            <!-- Previous Answer Display -->
            <div
              v-if="previousSubmission && previousAnswers[currentQuestion - 1]"
              class="mb-6"
            >
              <p class="mb-3 text-sm font-bold md:text-base">
                Câu trả lời cũ - Nộp vào {{ formatDate(previousSubmission.submit_date) }}
              </p>
              <div class="space-y-2">
                <div
                  v-for="answer in (previousAnswers[currentQuestion - 1]?.answers || [])"
                  :key="answer.id"
                  :class="[
                    'p-3 rounded-lg border-2',
                    answer.is_choose
                      ? 'border-primary bg-sky-100'
                      : 'border-neutral-200 bg-white'
                  ]"
                >
                  <div class="flex gap-3 items-start">
                    <span class="font-semibold text-neutral-900">{{ answer.id }}.</span>
                    <span class="flex-1 text-base md:text-lg text-neutral-700">{{ answer.content }}</span>
                    <div
                      v-if="answer.is_choose"
                      class="flex justify-center items-center rounded-full size-6 bg-primary shrink-0"
                    >
                      <UIcon
                        name="i-lucide-check"
                        class="text-white size-4"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p class="mb-4 text-base font-semibold md:text-lg text-neutral-900">
              Trả lời:
            </p>

            <div class="mb-8 space-y-4">
              <div
                v-for="option in questions[currentQuestion - 1]?.options"
                :key="option.id"
                :class="[
                  'p-4 rounded-lg border-2 cursor-pointer transition-all',
                  selectedAnswer === option.id
                    ? 'border-primary bg-sky-100'
                    : 'border-neutral-200 bg-white hover:shadow-[0px_4px_8px_0px_#00144514]'
                ]"
                @click="selectAnswer(option.id)"
              >
                <div class="flex gap-3 items-start">
                  <span class="font-semibold text-neutral-900">{{ option.id }}.</span>
                  <span class="flex-1 text-base md:text-lg text-neutral-700">{{ option.text }}</span>
                  <div
                    v-if="selectedAnswer === option.id"
                    class="flex justify-center items-center rounded-full size-6 bg-primary shrink-0"
                  >
                    <UIcon
                      name="i-lucide-check"
                      class="text-white size-4"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-between items-center">
              <UButton
                v-if="currentQuestion > 1"
                icon="i-lucide-arrow-left"
                variant="outline"
                size="xl"
                class="text-base bg-white border border-primary text-primary hover:bg-neutral-50"
                @click="previousQuestion"
              >
                Quay lại
              </UButton>
              <div
                v-else
                class="flex-1"
              />
              <UButton
                :color="currentQuestion === totalQuestions ? undefined : 'primary'"
                size="xl"
                :class="currentQuestion === totalQuestions ? 'bg-submit-button-gradient' : ''"
                :disabled="
                  currentQuestion === totalQuestions ? (!allQuestionsAnswered || isSubmitting) : !selectedAnswer
                "
                :loading="currentQuestion === totalQuestions && isSubmitting"
                @click="currentQuestion === totalQuestions ? submitQuiz() : nextQuestion()"
              >
                {{ currentQuestion === totalQuestions ? 'Nộp bài' : 'Tiếp theo' }}
                <template #trailing>
                  <UIcon
                    name="i-lucide-arrow-right"
                    class="size-5"
                  />
                </template>
              </UButton>
            </div>
          </div>
        </motion.div>

        <motion.div
          :initial="{ opacity: 0, x: 100 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.3, ease: 'easeOut', delay: 0.1 }"
        >
          <div class="sticky top-28 p-5 space-y-6 bg-white rounded-lg shadow-md">
            <div class="flex justify-between items-center">
              <div class="text-2xl font-bold md:text-3xl text-neutral-900">
                {{ formatTime(timeRemaining) }}
              </div>
              <UButton
                size="xl"
                class="bg-submit-button-gradient"
                :disabled="!allQuestionsAnswered || isSubmitting"
                :loading="isSubmitting"
                @click="submitQuiz"
              >
                Nộp bài
                <template #trailing>
                  <UIcon
                    name="i-lucide-arrow-right"
                    class="size-5"
                  />
                </template>
              </UButton>
            </div>

            <div class="cursor-pointer">
              <div class="grid grid-cols-5 gap-2">
                <button
                  v-for="num in totalQuestions"
                  :key="num"
                  :class="[
                    'px-2 py-2 rounded-sm transition-colors overflow-hidden relative cursor-pointer text-default text-sm font-semibold border',
                    currentQuestion === num || answeredQuestions[num]
                      ? 'border-secondary-500'
                      : 'border-neutral-300 text-neutral-900 hover:bg-neutral-50'
                  ]"
                  @click="goToQuestion(num)"
                >
                  Câu {{ num }}
                  <div
                    v-if="answeredQuestions[num]"
                    class="flex absolute -top-1.5 -right-1.5 justify-center items-center rounded-full size-5 bg-secondary-500"
                  >
                    <UIcon
                      name="i-lucide-check"
                      class="absolute text-white size-2 top-1.75 right-1.75"
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
</template>
