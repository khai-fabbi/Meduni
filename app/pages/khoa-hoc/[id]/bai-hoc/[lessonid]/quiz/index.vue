<script setup lang="ts">
import { motion } from 'motion-v'
import { useIntervalFn } from '@vueuse/core'

const route = useRoute()
const courseId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : String(route.params.id || '1')
const lessonId = Array.isArray(route.params.lessonid)
  ? route.params.lessonid[0]
  : String(route.params.lessonid || '1')

const isLoading = ref(true)
const currentQuestion = ref(1)
const totalQuestions = ref(10)
const timeRemaining = ref(600)
const selectedAnswer = ref<string | null>(null)
const answeredQuestions = ref<Record<number, boolean>>({})
const questionAnswers = ref<Record<number, string>>({})

watch(currentQuestion, (newQuestion) => {
  selectedAnswer.value = questionAnswers.value[newQuestion] || null
})

interface Question {
  id: number
  text: string
  options: Array<{ id: string, text: string }>
  correctAnswer: string
}

const questions = ref<Question[]>([
  {
    id: 1,
    text: 'Đâu là lý do quan trọng nhất để xây dựng prompt (lệnh/yêu cầu) rõ ràng và chi tiết khi làm việc với các mô hình AI?',
    options: [
      { id: 'A', text: 'Để tăng tốc độ xử lý của AI' },
      { id: 'B', text: 'Để giảm chi phí sử dụng AI' },
      {
        id: 'C',
        text: 'Để đảm bảo AI hiểu đúng ý định của người dùng và tạo ra đầu ra chính xác, giảm thiểu sự mơ hồ.'
      },
      { id: 'D', text: 'Để làm cho AI dễ sử dụng hơn' }
    ],
    correctAnswer: 'C'
  },
  {
    id: 2,
    text: 'Machine Learning là gì?',
    options: [
      { id: 'A', text: 'Một loại phần mềm máy tính' },
      {
        id: 'B',
        text: 'Một phương pháp cho phép máy tính học từ dữ liệu mà không cần lập trình rõ ràng'
      },
      { id: 'C', text: 'Một ngôn ngữ lập trình mới' },
      { id: 'D', text: 'Một loại phần cứng máy tính' }
    ],
    correctAnswer: 'B'
  },
  {
    id: 3,
    text: 'Deep Learning khác với Machine Learning truyền thống như thế nào?',
    options: [
      { id: 'A', text: 'Deep Learning chỉ hoạt động trên máy tính lớn' },
      {
        id: 'B',
        text: 'Deep Learning sử dụng các mạng neural nhiều lớp để học các đặc trưng phức tạp'
      },
      { id: 'C', text: 'Deep Learning không cần dữ liệu để học' },
      { id: 'D', text: 'Deep Learning chỉ dùng cho xử lý hình ảnh' }
    ],
    correctAnswer: 'B'
  },
  {
    id: 4,
    text: 'Natural Language Processing (NLP) được sử dụng chủ yếu để làm gì?',
    options: [
      { id: 'A', text: 'Xử lý và hiểu ngôn ngữ tự nhiên của con người' },
      { id: 'B', text: 'Tạo ra phần mềm mới' },
      { id: 'C', text: 'Quản lý cơ sở dữ liệu' },
      { id: 'D', text: 'Thiết kế giao diện người dùng' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 5,
    text: 'AI có thể thay thế hoàn toàn con người trong công việc không?',
    options: [
      { id: 'A', text: 'Có, AI có thể thay thế mọi công việc' },
      { id: 'B', text: 'Không, AI là công cụ hỗ trợ và bổ sung cho con người' },
      { id: 'C', text: 'Chỉ trong lĩnh vực công nghệ' },
      { id: 'D', text: 'Chỉ trong tương lai xa' }
    ],
    correctAnswer: 'B'
  },
  {
    id: 6,
    text: 'Neural Network là gì?',
    options: [
      { id: 'A', text: 'Một mạng lưới máy tính kết nối với nhau' },
      {
        id: 'B',
        text: 'Một mô hình toán học lấy cảm hứng từ cách hoạt động của não bộ con người'
      },
      { id: 'C', text: 'Một loại phần mềm quản lý mạng' },
      { id: 'D', text: 'Một giao thức mạng internet' }
    ],
    correctAnswer: 'B'
  },
  {
    id: 7,
    text: 'Supervised Learning là gì?',
    options: [
      { id: 'A', text: 'Học từ dữ liệu không có nhãn' },
      { id: 'B', text: 'Học từ dữ liệu có nhãn với sự giám sát' },
      { id: 'C', text: 'Học mà không cần dữ liệu' },
      { id: 'D', text: 'Học từ video trực tuyến' }
    ],
    correctAnswer: 'B'
  },
  {
    id: 8,
    text: 'Overfitting trong Machine Learning là gì?',
    options: [
      {
        id: 'A',
        text: 'Mô hình học quá tốt trên dữ liệu huấn luyện nhưng kém trên dữ liệu mới'
      },
      { id: 'B', text: 'Mô hình học quá chậm' },
      { id: 'C', text: 'Mô hình không học được gì' },
      { id: 'D', text: 'Mô hình học quá nhanh' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 9,
    text: 'Computer Vision là gì?',
    options: [
      { id: 'A', text: 'Một loại màn hình máy tính' },
      {
        id: 'B',
        text: 'Lĩnh vực AI giúp máy tính hiểu và xử lý hình ảnh, video'
      },
      { id: 'C', text: 'Một phần mềm chỉnh sửa ảnh' },
      { id: 'D', text: 'Một loại camera đặc biệt' }
    ],
    correctAnswer: 'B'
  },
  {
    id: 10,
    text: 'Reinforcement Learning hoạt động như thế nào?',
    options: [
      {
        id: 'A',
        text: 'Học từ phản hồi tích cực và tiêu cực thông qua tương tác với môi trường'
      },
      { id: 'B', text: 'Học từ dữ liệu có nhãn' },
      { id: 'C', text: 'Học từ dữ liệu không có nhãn' },
      { id: 'D', text: 'Học từ sách giáo khoa' }
    ],
    correctAnswer: 'A'
  }
])

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

interface QuizResult {
  submissionNumber: number
  answers: Record<number, string>
  correctCount: number
  totalQuestions: number
  timeSpent: number
  submittedAt: number
}

const submitQuiz = () => {
  // Calculate score
  let correctCount = 0
  for (let i = 1; i <= totalQuestions.value; i++) {
    const userAnswer = questionAnswers.value[i]
    const correctAnswer = questions.value[i - 1]?.correctAnswer
    if (userAnswer === correctAnswer) {
      correctCount++
    }
  }

  // Get existing results
  const storageKey = `quiz-results-${courseId}-${lessonId}`
  const existingResults = useCookie<QuizResult[]>(storageKey, {
    default: () => []
  })
  const results = existingResults.value || []

  // Create new result
  const initialTime = 600
  const timeSpent = initialTime - timeRemaining.value
  const newResult: QuizResult = {
    submissionNumber: results.length + 1,
    answers: { ...questionAnswers.value },
    correctCount,
    totalQuestions: totalQuestions.value,
    timeSpent,
    submittedAt: Date.now()
  }

  // Save result
  results.push(newResult)
  existingResults.value = results

  // Navigate to result page
  navigateTo(`/khoa-hoc/${courseId}/bai-hoc/${lessonId}/quiz/result`)
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

const quizTitle = computed(() => {
  const title = route.query.title || route.params.title
  return title ? String(title) : 'Bài tập chương 1: Thử nghiệm'
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
  questionAnswers.value[currentQuestion.value] = optionId
  answeredQuestions.value[currentQuestion.value] = true
}

onMounted(() => {
  // Simulate data loading
  setTimeout(() => {
    isLoading.value = false
  }, 800)
})
</script>

<template>
  <SkeletonQuiz v-if="isLoading" />

  <div
    v-else
    class="min-h-screen bg-neutral-100"
  >
    <div class="px-4 md:px-6 py-4 mt-6 mb-0">
      <div class="flex items-center justify-between max-w-7xl mx-auto gap-2 md:gap-4">
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
            {{ quizTitle }}
          </span>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <span class="text-sm md:text-lg font-semibold text-primary">
            {{ currentQuestion }}/{{ totalQuestions }}
          </span>
          <span class="text-dot-gray">•</span>
          <div class="flex items-center gap-1.5">
            <UIcon
              name="i-lucide-clock"
              class="size-3.5 md:size-4 text-primary"
            />
            <span class="text-sm md:text-lg font-semibold text-primary">
              {{ formatTime(timeRemaining) }}<span class="hidden md:inline"> phút</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        <motion.div
          :initial="{ opacity: 0, x: 100 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.3, ease: 'easeOut' }"
        >
          <div class="bg-white rounded-lg shadow-md p-5 md:p-8">
            <h2 class="text-xl md:text-2xl font-bold text-neutral-900 mb-3">
              Câu {{ currentQuestion }}
            </h2>
            <p class="text-base md:text-xl text-neutral-700 mb-3">
              {{ questions[currentQuestion - 1]?.text }}
            </p>

            <div class="space-y-4 mb-8">
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
                <div class="flex items-start gap-3">
                  <span class="font-semibold text-neutral-900">{{ option.id }}.</span>
                  <span class="text-base md:text-lg text-neutral-700 flex-1">{{ option.text }}</span>
                  <div
                    v-if="selectedAnswer === option.id"
                    class="size-6 rounded-full bg-primary flex items-center justify-center shrink-0"
                  >
                    <UIcon
                      name="i-lucide-check"
                      class="size-4 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <UButton
                v-if="currentQuestion > 1"
                icon="i-lucide-arrow-left"
                variant="outline"
                size="xl"
                class="bg-white text-base border border-primary text-primary hover:bg-neutral-50"
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
                  currentQuestion === totalQuestions ? !allQuestionsAnswered : !selectedAnswer
                "
                @click="nextQuestion"
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
          <div class="bg-white rounded-lg shadow-md p-5 space-y-6 sticky top-28">
            <div class="flex items-center justify-between">
              <div class="text-2xl md:text-3xl font-bold text-neutral-900">
                {{ formatTime(timeRemaining) }}
              </div>
              <UButton
                size="xl"
                class="bg-submit-button-gradient"
                :disabled="!allQuestionsAnswered"
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
                    class="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-secondary-500 flex items-center justify-center"
                  >
                    <UIcon
                      name="i-lucide-check"
                      class="size-2 text-white absolute top-1.75 right-1.75"
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
