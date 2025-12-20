<script setup lang="ts">
const route = useRoute()
const courseId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : String(route.params.id || '1')
const lessonId = Array.isArray(route.params.lessonid)
  ? route.params.lessonid[0]
  : String(route.params.lessonid || '1')

interface Question {
  id: number
  text: string
  options: Array<{ id: string, text: string }>
  correctAnswer: string
}

interface QuizResult {
  submissionNumber: number
  answers: Record<number, string>
  correctCount: number
  totalQuestions: number
  timeSpent: number
  submittedAt: number
}

const isLoading = ref(true)

const questions: Question[] = [
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
]

// Get results from cookie
const storageKey = `quiz-results-${courseId}-${lessonId}`
const resultsCookie = useCookie<QuizResult[]>(storageKey, {
  default: () => []
})
const results = computed(() => {
  if (!resultsCookie.value || !Array.isArray(resultsCookie.value)) {
    return []
  }
  return resultsCookie.value
})

const expandedSubmissions = ref<Record<number, boolean>>({})

// Expand the latest submission by default
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false

    if (import.meta.client && results.value && results.value.length > 0) {
      const latestSubmission = results.value[results.value.length - 1]
      if (latestSubmission) {
        expandedSubmissions.value[latestSubmission.submissionNumber] = true
      }
    }
  }, 800)
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

const retakeQuiz = () => {
  navigateTo(`/khoa-hoc/${courseId}/bai-hoc/${lessonId}/quiz`)
}

const isAnswerCorrect = (questionId: number, answerId: string) => {
  const question = questions.find(q => q.id === questionId)
  return question?.correctAnswer === answerId
}

const isAnswerSelected = (questionId: number, answerId: string, result: QuizResult) => {
  return result.answers[questionId] === answerId
}

const getAnswerClass = (questionId: number, answerId: string, result: QuizResult) => {
  const isCorrect = isAnswerCorrect(questionId, answerId)
  const isSelected = isAnswerSelected(questionId, answerId, result)

  // Always show correct answer with green border (regardless of user selection)
  if (isSelected && isCorrect) {
    return 'border-answer-correct bg-answer-correct'
  }
  // Show selected incorrect answer with red border
  if (isSelected && !isCorrect) {
    return 'border-answer-incorrect bg-answer-incorrect'
  }
  return 'border-neutral-200 bg-white'
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
          @click="retakeQuiz"
        >
          Làm lại bài tập
        </UButton>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div
        v-if="!results || results.length === 0"
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
          v-for="result in results.slice().reverse()"
          :key="result.submissionNumber"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div
            class="p-4 md:p-6 cursor-pointer hover:bg-neutral-50 transition-colors"
            @click="toggleSubmission(result.submissionNumber)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <h3 class="text-lg md:text-xl font-bold text-primary">
                  Nộp bài lần {{ result.submissionNumber }}:
                </h3>
                <div class="flex items-center gap-4 text-sm md:text-base text-neutral-700">
                  <span>Đúng: {{ result.correctCount }}/{{ result.totalQuestions }}</span>
                  <span>Thời gian làm bài: {{ formatTime(result.timeSpent) }} phút</span>
                </div>
              </div>
              <UIcon
                :name="expandedSubmissions[result.submissionNumber] ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                class="size-5 text-neutral-600"
              />
            </div>
          </div>

          <div
            v-if="expandedSubmissions[result.submissionNumber]"
            class="px-4 md:px-6 pb-4 md:pb-6 space-y-6"
          >
            <div
              v-for="question in questions"
              :key="question.id"
              class="space-y-4"
            >
              <h4 class="text-base md:text-lg font-semibold text-neutral-900">
                Câu {{ question.id }}
              </h4>
              <p class="text-sm md:text-base text-neutral-700 mb-4">
                {{ question.text }}
              </p>
              <div class="space-y-3">
                <div
                  v-for="option in question.options"
                  :key="option.id"
                  :class="[
                    'p-4 rounded-lg border-2 transition-all',
                    getAnswerClass(question.id, option.id, result)
                  ]"
                >
                  <div class="flex items-start gap-3">
                    <span class="font-semibold text-neutral-900">{{ option.id }}.</span>
                    <span class="text-sm md:text-base text-neutral-700 flex-1">{{ option.text }}</span>
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
