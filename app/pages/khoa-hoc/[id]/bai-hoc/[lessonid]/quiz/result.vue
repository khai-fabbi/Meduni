<script setup lang="ts">
import { services } from '~/services'

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
  return exerciseIdValue ? exerciseIdValue.replace(/\/quiz$/, '') : ''
})

// Get myCourseId from course data
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
const myCourseId = computed(() => courseData.value?.data?.my_course_id)

if (!exerciseId.value) {
  throw createError({
    statusCode: HttpCode.NOT_FOUND,
    statusMessage: 'Không tìm thấy bài tập',
    fatal: true
  })
}

// Fetch exercise data with all submissions
const isLoading = ref(true)
type ExerciseSubmission = {
  id: string
  exercise_id: string
  exercise_name: string
  questions: Array<{
    question_id?: string
    question: string
    question_type: number
    multiple_choice_type: number
    answers: Array<{
      answer_id?: string
      content: string
      is_choose?: boolean
      result?: boolean
    }>
  }>
  submit_date?: string
  submit_time?: number
  time_remaining: number
  is_complete: boolean
}

type ExerciseResponse = {
  data: ExerciseSubmission[]
}

const exerciseData = ref<ExerciseResponse | null>(null)

try {
  // Use myCourseId if available, otherwise use courseId
  const courseIdForApi = myCourseId.value || courseId
  const response = await services.courses.getExercise(courseIdForApi, exerciseId.value)
  exerciseData.value = response.data ? { data: response.data } : null
  isLoading.value = false
} catch {
  isLoading.value = false
  throw createError({
    statusCode: HttpCode.NOT_FOUND,
    statusMessage: 'Không tìm thấy bài tập',
    fatal: true
  })
}

interface Question {
  id: number
  text: string
  options: Array<{
    id: string
    text: string
    isSelected?: boolean
    isCorrect?: boolean
  }>
}

interface QuizResult {
  submissionNumber: number
  answers: Record<number, string>
  correctCount: number
  totalQuestions: number
  timeSpent: number
  submittedAt: number
  score?: number
  passed?: boolean
  resultId?: string
}

// Map exercise submissions to results
const submissions = computed(() => {
  if (!exerciseData.value?.data) return []

  // Sort by submit_time descending (newest first)
  const sorted = [...exerciseData.value.data].sort((a, b) => {
    const timeA = a.submit_time || 0
    const timeB = b.submit_time || 0
    return timeB - timeA
  })

  return sorted.filter(sub => sub.is_complete && sub.submit_time !== undefined)
})

// Map questions from first submission (all submissions have same questions structure)
const questions = computed<Question[]>(() => {
  const submission = submissions.value[0]
  if (!submission?.questions) return []

  return submission.questions.map((q, index) => ({
    id: index + 1,
    text: q.question,
    options: q.answers.map((answer, ansIndex) => ({
      id: String.fromCharCode(65 + ansIndex),
      text: answer.content,
      isSelected: answer.is_choose || false,
      isCorrect: answer.result || false
    }))
  }))
})

// Calculate score for each submission
const calculateScore = (submission: ExerciseSubmission) => {
  let correctCount = 0
  let totalCount = 0

  submission.questions.forEach((question) => {
    if (question.question_type === 2) { // Multiple choice
      totalCount++
      const selectedAnswers = question.answers.filter(ans => ans.is_choose)
      const correctAnswers = question.answers.filter(ans => ans.result)

      if (question.multiple_choice_type === 1) { // Single choice
        const selected = selectedAnswers[0]
        if (selected && selected.result) {
          correctCount++
        }
      } else { // Multiple choice
        const selectedIds = selectedAnswers.map(ans => ans.answer_id || ans.content)
        const correctIds = correctAnswers.map(ans => ans.answer_id || ans.content)
        if (selectedIds.length === correctIds.length
          && selectedIds.every(id => correctIds.includes(id))) {
          correctCount++
        }
      }
    }
  })

  return { correctCount, totalCount }
}

const resultsWithScores = computed(() => {
  return submissions.value.map((submission, index) => {
    const score = calculateScore(submission)
    const initialTime = 600 // Default time, should come from exercise config
    const timeSpent = initialTime - (submission.time_remaining || 0)

    return {
      submissionNumber: submissions.value.length - index,
      submission,
      correctCount: score.correctCount,
      totalQuestions: score.totalCount,
      timeSpent,
      submittedAt: submission.submit_date ? new Date(submission.submit_date).getTime() : Date.now(),
      submitDate: submission.submit_date
    }
  })
})

const expandedSubmissions = ref<Record<number, boolean>>({})

// Expand the latest submission by default
onMounted(() => {
  if (import.meta.client && resultsWithScores.value && resultsWithScores.value.length > 0) {
    const latestSubmission = resultsWithScores.value[0]
    if (latestSubmission) {
      expandedSubmissions.value[latestSubmission.submissionNumber] = true
    }
  }
})

const toggleSubmission = (submissionNumber: number) => {
  expandedSubmissions.value[submissionNumber] = !expandedSubmissions.value[submissionNumber]
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

const goBack = () => {
  navigateTo(`/khoa-hoc/${courseId}/bai-hoc/${lessonId}`)
}

const isRetrying = ref(false)
const retakeQuiz = async () => {
  if (isRetrying.value || !myCourseId.value || !exerciseId.value) return

  isRetrying.value = true
  try {
    // Use myCourseId from query if available, otherwise use courseId
    const courseIdForApi = myCourseId.value || courseId
    // Call retry API
    await services.courses.retryExercise(courseIdForApi, exerciseId.value)
    // Navigate back to quiz page with my_course_id if available
    const quizUrl = `/khoa-hoc/${courseId}/bai-hoc/${lessonId}/quiz?exercise_id=${exerciseId.value}${myCourseId.value ? `&my_course_id=${myCourseId.value}` : ''}`
    navigateTo(quizUrl)
  } catch {
    isRetrying.value = false
    const toast = useToast()
    toast.add({
      title: 'Lỗi',
      description: 'Không thể làm lại bài tập. Vui lòng thử lại.',
      color: 'error'
    })
  }
}

const getAnswerClass = (questionId: number, answerId: string, submission: ExerciseSubmission) => {
  const question = submission.questions[questionId - 1]
  if (!question) return 'border-neutral-200 bg-white'

  const option = question.answers.find((_, index) => String.fromCharCode(65 + index) === answerId)
  if (!option) return 'border-neutral-200 bg-white'

  const isSelected = option.is_choose || false
  const isCorrect = option.result || false

  // Selected and correct
  if (isSelected && isCorrect) {
    return 'border-green-500 bg-green-50'
  }
  // Selected but incorrect
  if (isSelected && !isCorrect) {
    return 'border-red-500 bg-red-50'
  }
  // Correct but not selected
  if (!isSelected && isCorrect) {
    return 'border-green-300 bg-green-50'
  }
  return 'border-neutral-200 bg-white'
}

const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <SkeletonQuizResult v-if="isLoading" />

  <div
    v-else
    class="min-h-screen bg-neutral-100"
  >
    <div class="px-4 md:px-6 py-4 mt-6 mb-0">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <div class="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
          <UButton
            icon="i-lucide-arrow-left"
            variant="solid"
            class="text-sm md:text-base bg-white text-neutral-900 hover:bg-neutral-50 border border-neutral-200 shrink-0"
            @click="goBack"
          >
            <span class="hidden md:inline">Quay lại bài giảng</span>
            <span class="md:hidden">Quay lại</span>
          </UButton>
          <span class="text-lg md:text-2xl font-bold text-primary line-clamp-1 flex-1 min-w-0">
            Kết quả chấm thi
          </span>
        </div>
        <UButton
          icon="i-lucide-clipboard-list"
          color="primary"
          size="xl"
          :loading="isRetrying"
          :disabled="isRetrying"
          @click="retakeQuiz"
        >
          Làm lại bài tập
        </UButton>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div
        v-if="!resultsWithScores || resultsWithScores.length === 0"
        class="bg-white rounded-lg shadow-md p-8 text-center"
      >
        <p class="text-neutral-600">
          Chưa có kết quả nào
        </p>
      </div>

      <div
        v-else
        class="space-y-4"
      >
        <div
          v-for="result in resultsWithScores"
          :key="result.submissionNumber"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div
            class="p-4 md:p-6 cursor-pointer hover:bg-neutral-50 transition-colors"
            @click="toggleSubmission(result.submissionNumber)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4 flex-wrap">
                <h3 class="text-lg md:text-xl font-bold text-primary">
                  Nộp bài lần {{ result.submissionNumber }}:
                </h3>
                <div class="flex items-center gap-4 text-sm md:text-base text-neutral-700 flex-wrap">
                  <span>Đúng: {{ result.correctCount }}/{{ result.totalQuestions }}</span>
                  <span v-if="result.submitDate">Thời gian nộp: {{ formatDate(result.submitDate) }}</span>
                  <!-- <span>Thời gian làm bài: {{ formatTime(result.timeSpent) }} phút</span> -->
                </div>
              </div>
              <UIcon
                :name="expandedSubmissions[result.submissionNumber] ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                class="size-5 text-neutral-600 shrink-0"
              />
            </div>
          </div>

          <div
            v-if="expandedSubmissions[result.submissionNumber]"
            class="px-4 md:px-6 pb-4 md:pb-6 space-y-6"
          >
            <div
              v-for="(question, index) in result.submission.questions"
              :key="question.question_id || index"
              class="space-y-4"
            >
              <h4 class="text-base md:text-lg font-semibold text-neutral-900">
                Câu {{ index + 1 }}
              </h4>
              <p class="text-sm md:text-base text-neutral-700 mb-4">
                {{ question.question }}
              </p>
              <div class="space-y-3">
                <div
                  v-for="(answer, ansIndex) in question.answers"
                  :key="answer.answer_id || ansIndex"
                  :class="[
                    'p-4 rounded-lg border-2 transition-all',
                    getAnswerClass(index + 1, String.fromCharCode(65 + ansIndex), result.submission)
                  ]"
                >
                  <div class="flex items-start gap-3">
                    <span class="font-semibold text-neutral-900">{{ String.fromCharCode(65 + ansIndex) }}.</span>
                    <span class="text-sm md:text-base text-neutral-700 flex-1">{{ answer.content }}</span>
                    <div
                      v-if="answer.is_choose"
                      class="shrink-0"
                    >
                      <UIcon
                        :name="answer.result ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
                        :class="answer.result ? 'text-green-500' : 'text-red-500'"
                        class="size-5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
