<script setup lang="ts">
import type { TabsItem, BreadcrumbItem } from '@nuxt/ui'
import Star from '~/assets/icons/star.svg'

useSeoMeta({
  title: 'Lộ trình học tập',
  description: 'Lộ trình học tập của bạn'
})

const items = ref<BreadcrumbItem[]>([
  {
    label: 'Trang chủ',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: 'Hồ sơ',
    to: '/profile'
  },
  {
    label: 'Lộ trình học tập',
    to: '#'
  }
])

definePageMeta({
  layout: 'profile'
})

enum LearningPathTab {
  LEARNING = 'learning',
  SAVED = 'saved',
  COMPLETED = 'completed',
  ASSESSMENT = 'assessment'
}

const tabItems = [
  {
    label: 'Đang học',
    value: LearningPathTab.LEARNING
  },
  {
    label: 'Đã lưu',
    value: LearningPathTab.SAVED
  },
  {
    label: 'Hoàn thành',
    value: LearningPathTab.COMPLETED
  },
  {
    label: 'Đánh giá kiến thức, kỹ năng',
    value: LearningPathTab.ASSESSMENT
  }
] satisfies TabsItem[]

const activeTab = ref<LearningPathTab>(LearningPathTab.ASSESSMENT)
const searchQuery = ref('')
const progressFilter = ref('all')
const levelFilter = ref('all')
const levelSetCompleted = ref(false)
const sortBy = ref('newest')
const isLoading = ref(true)

const progressOptions = [
  { label: 'Tiến trình: Tất cả', value: 'all' },
  { label: 'Tiến trình: Người mới', value: 'beginner' },
  { label: 'Tiến trình: Thân thiết', value: 'familiar' },
  { label: 'Tiến trình: Trung cấp', value: 'intermediate' },
  { label: 'Tiến trình: Nâng cao', value: 'advanced' }
]

const levelOptions = [
  { label: 'Cấp độ cao nhất: Tất cả', value: 'all' },
  { label: 'Cấp độ cao nhất: Người mới', value: 'beginner' },
  { label: 'Cấp độ cao nhất: Thân thiết', value: 'familiar' },
  { label: 'Cấp độ cao nhất: Trung cấp', value: 'intermediate' },
  { label: 'Cấp độ cao nhất: Nâng cao', value: 'advanced' }
]

const sortOptions = [
  { label: 'Lọc theo: Cập nhật mới nhất', value: 'newest' },
  { label: 'Lọc theo: Cập nhật cũ nhất', value: 'oldest' },
  { label: 'Lọc theo: Điểm cao nhất', value: 'score-desc' },
  { label: 'Lọc theo: Điểm thấp nhất', value: 'score-asc' }
]

const allSkills = ref([
  {
    id: 1,
    name: 'Generative AI Agents',
    score: 124,
    level: 'Người mới',
    progress: 25,
    updatedAt: '2024-01-15T10:00:00',
    levelSetCompleted: false
  },
  {
    id: 2,
    name: 'Machine Learning Basics',
    score: 124,
    level: 'Trung cấp',
    progress: 50,
    updatedAt: '2024-01-20T14:30:00',
    levelSetCompleted: true
  },
  {
    id: 3,
    name: 'Deep Learning Fundamentals',
    score: 16,
    level: 'Thân thiết',
    progress: 20,
    updatedAt: '2024-01-10T09:15:00',
    levelSetCompleted: false
  },
  {
    id: 4,
    name: 'Natural Language Processing',
    score: 124,
    level: 'Người mới',
    progress: 75,
    updatedAt: '2024-01-25T16:45:00',
    levelSetCompleted: true
  },
  {
    id: 5,
    name: 'Computer Vision',
    score: 124,
    level: 'Trung cấp',
    progress: 40,
    updatedAt: '2024-01-18T11:20:00',
    levelSetCompleted: false
  },
  {
    id: 6,
    name: 'Neural Networks',
    score: 124,
    level: 'Thân thiết',
    progress: 60,
    updatedAt: '2024-01-22T13:10:00',
    levelSetCompleted: true
  },
  {
    id: 7,
    name: 'Reinforcement Learning',
    score: 124,
    level: 'Thân thiết',
    progress: 30,
    updatedAt: '2024-01-12T08:30:00',
    levelSetCompleted: false
  },
  {
    id: 8,
    name: 'Data Science',
    score: 200,
    level: 'Nâng cao',
    progress: 80,
    updatedAt: '2024-01-28T17:00:00',
    levelSetCompleted: true
  }
])

function getLevelValue(level: string): string {
  switch (level) {
    case 'Người mới':
      return 'beginner'
    case 'Thân thiết':
      return 'familiar'
    case 'Trung cấp':
      return 'intermediate'
    case 'Nâng cao':
      return 'advanced'
    default:
      return ''
  }
}

const filteredSkills = computed(() => {
  let result = [...allSkills.value]

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(skill =>
      skill.name.toLowerCase().includes(query)
    )
  }

  if (progressFilter.value !== 'all') {
    result = result.filter(skill =>
      getLevelValue(skill.level) === progressFilter.value
    )
  }

  if (levelFilter.value !== 'all') {
    result = result.filter(skill =>
      getLevelValue(skill.level) === levelFilter.value
    )
  }

  if (levelSetCompleted.value) {
    result = result.filter(skill => skill.levelSetCompleted)
  }

  if (sortBy.value === 'newest') {
    result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  } else if (sortBy.value === 'oldest') {
    result.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
  } else if (sortBy.value === 'score-desc') {
    result.sort((a, b) => b.score - a.score)
  } else if (sortBy.value === 'score-asc') {
    result.sort((a, b) => a.score - b.score)
  }

  return result
})

onMounted(async () => {
  isLoading.value = false
})
</script>

<template>
  <div class="space-y-6">
    <UBreadcrumb
      :items="items"
      class="md:hidden"
    />
    <Heading
      variant="h3"
    >
      Lộ trình học tập
    </Heading>

    <div class="bg-white rounded-sm p-6">
      <div class="mb-6">
        <div class="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
          <UTabs
            v-model="activeTab"
            :items="tabItems"
            variant="link"
            :ui="{
              list: 'justify-start border-b-0 cursor-pointer flex-nowrap',
              trigger: 'text-sm md:text-base font-medium rounded-none border-none data-[active]:text-primary cursor-pointer whitespace-nowrap px-3 md:px-4 py-2 !min-w-max',
              indicator: 'h-0.5 bg-primary'
            }"
            class="w-full"
          />
        </div>
      </div>

      <div class="mb-6">
        <div class="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between flex-wrap">
          <div class="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full md:w-auto">
            <div class="w-full md:w-auto">
              <UInput
                v-model="searchQuery"
                placeholder="Tìm kiếm kiến thức, kỹ năng"
                icon="i-lucide-search"
                size="xl"
                class="w-full h-12 md:w-75"
              />
            </div>
            <UButton
              color="primary"
              size="lg"
              class="shrink-0 w-full sm:w-full md:w-30 h-12 text-center justify-center"
            >
              Tìm kiếm
            </UButton>
          </div>
          <div class="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full md:w-auto">
            <USelect
              v-model="progressFilter"
              :items="progressOptions"
              size="lg"
              class="w-full sm:w-auto"
            />
            <USelect
              v-model="levelFilter"
              :items="levelOptions"
              size="lg"
              class="w-full sm:w-auto"
            />
            <div class="flex items-center w-full sm:w-auto">
              <UCheckbox
                v-model="levelSetCompleted"
                label="LevelSet completed"
                size="lg"
                class="w-full sm:w-auto"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <h2 class="text-lg font-semibold">
              Kỹ năng với tiến trình gần đây nhất
            </h2>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-info"
                class="w-4 h-4 sm:w-5 sm:h-5 text-primary cursor-pointer shrink-0"
              />
              <span class="text-base text-primary">Về điểm số kỹ năng</span>
            </div>
          </div>
          <USelect
            v-model="sortBy"
            :items="sortOptions"
            size="lg"
            class="w-full sm:w-auto sm:min-w-[200px]"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <template v-if="isLoading">
          <SkeletonLearningPath />
        </template>

        <template v-else>
          <div
            v-for="skill in filteredSkills"
            :key="skill.id"
            class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex items-start gap-3 mb-3">
              <Star class="w-5 h-5 shrink-0 mt-0.5" />
              <h3 class="font-semibold text-base flex-1">
                {{ skill.name }}
              </h3>
            </div>

            <div class="mb-3">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-sm text-gray-600">Điểm của bạn:</span>
                <span class="text-sm font-semibold">{{ skill.score }}</span>
                <UBadge
                  variant="outline"
                  size="sm"
                  class="bg-neutral-300 mt-1 mb-1 ml-4 mr-4 text-ui-text text-xs font-semibold"
                >
                  {{ skill.level }}
                </UBadge>
              </div>
              <div class="flex gap-1 w-full">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="flex-1 h-2 rounded-sm transition-all duration-300"
                  :class="skill.progress >= (i - 1) * 25 ? 'bg-primary' : 'bg-gray-200'"
                />
              </div>
            </div>

            <a
              href="#"
              class="inline-flex items-center text-base text-primary"
            >
              Xem các đề xuất
              <UIcon
                name="i-lucide-arrow-right"
                class="w-4 h-4 ml-2"
              />
            </a>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
