<script setup lang="ts">
import { motion } from 'motion-v'
import CourseCard from '~/components/course/CourseCard.vue'

const route = useRoute()
const router = useRouter()

const title = 'Tất cả khóa học - MedUni.ai'
const description = 'Khám phá các khóa học về trí tuệ nhân tạo, công nghệ và y tế. Trang bị kiến thức, kỹ năng và tư duy công nghệ cho thế hệ tương lai.'

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

const selectedCategory = ref<string>((route.query.category as string) || 'all')
const searchQuery = ref<string>((route.query.q as string) || '')
const page = ref<number>(Number(route.query.page) || 1)
const itemsPerPage = ref<number>(20)

const updateQueryParams = () => {
  const query: Record<string, string> = {}

  if (selectedCategory.value !== 'all') {
    query.category = selectedCategory.value
  }

  if (searchQuery.value.trim()) {
    query.q = searchQuery.value.trim()
  }

  if (page.value > 1) {
    query.page = page.value.toString()
  }

  router.push({
    query,
    path: route.path
  })
}

const debouncedUpdateQuery = useDebounceFn(() => {
  updateQueryParams()
}, 300)

watch(selectedCategory, () => {
  page.value = 1
  updateQueryParams()
})

watch(searchQuery, () => {
  page.value = 1
  debouncedUpdateQuery()
})

watch(page, () => {
  updateQueryParams()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

watch(() => route.query, (newQuery) => {
  const category = (newQuery.category as string) || 'all'
  const q = (newQuery.q as string) || ''
  const pageNum = Number(newQuery.page) || 1

  if (selectedCategory.value !== category) {
    selectedCategory.value = category
  }

  if (searchQuery.value !== q) {
    searchQuery.value = q
  }

  if (page.value !== pageNum) {
    page.value = pageNum
  }
})

const categories = [
  { id: 'all', label: 'Tất cả khóa học' },
  { id: 'software', label: 'Kỹ thuật phần mềm & CNTT' },
  { id: 'business', label: 'Kinh Doanh' },
  { id: 'marketing', label: 'Bán hàng & tiếp thị' }
]

const courses = [
  {
    id: 1,
    title: 'Chiến lược trí tuệ nhân tạo dành cho lãnh đạo',
    duration: '13 giờ 24 phút',
    price: 7200000,
    category: 'business'
  },
  {
    id: 2,
    title: 'Khóa đào tạo AI cho marketer không muốn bị tụt lại',
    duration: '13 giờ 24 phút',
    price: 6700000,
    category: 'marketing'
  },
  {
    id: 3,
    title: 'Chiến lược Marketing thời đại AI',
    duration: '11 giờ 15 phút',
    price: 5500000,
    category: 'marketing'
  },
  {
    id: 4,
    title: 'Bứt phá hiệu suất công việc - Chương trình đào tạo Micro MBA AI',
    duration: '8 giờ 00 phút',
    price: 12200000,
    category: 'business'
  },
  {
    id: 5,
    title: 'Ứng dụng AI tạo sinh trong doanh nghiệp',
    duration: '13 giờ 24 phút',
    price: 8200000,
    category: 'business'
  },
  {
    id: 6,
    title: 'Quản trị nhân sự tinh gọn bằng AI',
    duration: '7 giờ 44 phút',
    price: 8900000,
    category: 'business'
  },
  {
    id: 7,
    title: 'Giải mã sức mạnh AI',
    duration: '11 giờ 22 phút',
    price: 4700000,
    category: 'software'
  },
  {
    id: 8,
    title: 'Xu hướng ứng dụng trí tuệ nhân tạo trong hoạt động sáng tạo nội dung',
    duration: '8 giờ 24 phút',
    price: 7500000,
    category: 'marketing'
  }
]

const filteredCourses = computed(() => {
  let result = courses

  if (selectedCategory.value !== 'all') {
    result = result.filter(course => course.category === selectedCategory.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(course =>
      course.title.toLowerCase().includes(query)
    )
  }

  return result
})

const paginatedCourses = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredCourses.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredCourses.value.length / itemsPerPage.value)
})

watch(totalPages, (newTotal) => {
  if (page.value > newTotal && newTotal > 0) {
    page.value = 1
  }
})

const activeCategoryClass = computed(() => {
  return `bg-gradient-to-b from-primary-500 to-primary-700 font-semibold`
})
</script>

<template>
  <UContainer class="py-6 md:py-10">
    <div class="space-y-6 md:space-y-8">
      <div
        class="space-y-2"
      >
        <Heading
          variant="h3"
          as="h1"
        >
          Tất cả <span class="text-primary">khóa học</span>
        </Heading>
        <motion.p
          class="text-base"
          :initial="{ opacity: 0, y: 10 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.2, ease: 'easeOut' }"
        >
          Trang bị kiến thức, kỹ năng và tư duy công nghệ cho thế hệ tương lai.
        </motion.p>
      </div>

      <motion.div
        class="flex flex-col md:flex-row gap-4 md:items-center md:justify-between"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.3, ease: 'easeOut' }"
      >
        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="category in categories"
            :key="category.id"
            :variant="selectedCategory === category.id ? 'solid' : 'outline'"
            :color="selectedCategory === category.id ? 'primary' : 'neutral'"
            size="xl"
            class="px-3.5 rounded-sm font-medium md:rounded-md md:min-h-12 "
            :ui="{
              base: `bg-white ring-neutral-400 ${selectedCategory === category.id ? activeCategoryClass : ''}`
            }"
            @click="selectedCategory = category.id"
          >
            {{ category.label }}
          </UButton>
        </div>

        <div class="flex-1 md:max-w-xs">
          <UInput
            v-model="searchQuery"
            placeholder="Tìm kiếm khóa học"
            icon="i-lucide-search"
            size="md"
            class="w-full"
            :ui="{
              base: 'bg-white'
            }"
          />
        </div>
      </motion.div>

      <motion.div
        v-if="filteredCourses.length === 0"
        class="text-center py-12"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.4 }"
      >
        <p class="text-muted flex items-center justify-center gap-2">
          <UIcon
            name="i-lucide-search"
            class="size-6 text-muted"
          />
          Không tìm thấy khóa học nào
        </p>
      </motion.div>

      <div v-else>
        <motion.div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          :initial="false"
          :animate="{ opacity: 1 }"
          :transition="{ staggerChildren: 0.1, delayChildren: 0.1 }"
        >
          <motion.div
            v-for="(course, index) in paginatedCourses"
            :key="course.id"
            :initial="{ opacity: 0, y: 30, scale: 0.9 }"
            :animate="{ opacity: 1, y: 0, scale: 1 }"
            :transition="{
              duration: 0.5,
              delay: index * 0.05,
              ease: 'easeOut'
            }"
          >
            <CourseCard
              :title="course.title"
              :duration="course.duration"
              :price="course.price"
            />
          </motion.div>
        </motion.div>

        <div
          class="mt-8 flex justify-center"
        >
          <UPagination
            v-model:page="page"
            :items-per-page="itemsPerPage"
            :total="filteredCourses.length"
          />
        </div>
      </div>
    </div>
  </UContainer>
</template>
