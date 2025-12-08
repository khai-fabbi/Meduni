<script setup lang="ts">
useSeoMeta({
  title: 'Lộ trình học tập',
  description: 'Lộ trình học tập của bạn'
})

definePageMeta({
  layout: 'profile'
})

const learningPaths = ref([
  {
    id: 1,
    title: 'Lộ trình AI trong Y tế',
    description: 'Từ cơ bản đến nâng cao về ứng dụng AI trong lĩnh vực y tế',
    totalCourses: 5,
    completedCourses: 2,
    estimatedTime: '6 tháng',
    progress: 40,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    courses: [
      { name: 'AI cơ bản trong Y tế', status: 'completed' },
      { name: 'Xử lý dữ liệu y tế', status: 'completed' },
      { name: 'Machine Learning nâng cao', status: 'in-progress' },
      { name: 'Deep Learning ứng dụng', status: 'not-started' },
      { name: 'Dự án thực tế', status: 'not-started' }
    ]
  },
  {
    id: 2,
    title: 'Lộ trình Y tế cộng đồng',
    description: 'Nâng cao kiến thức về y tế cộng đồng và chăm sóc sức khoẻ',
    totalCourses: 4,
    completedCourses: 1,
    estimatedTime: '4 tháng',
    progress: 25,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
    courses: [
      { name: 'Y tế cộng đồng cơ bản', status: 'completed' },
      { name: 'Dịch tễ học', status: 'in-progress' },
      { name: 'Sức khoẻ môi trường', status: 'not-started' },
      { name: 'Quản lý y tế cộng đồng', status: 'not-started' }
    ]
  }
])
</script>

<template>
  <div class="bg-white rounded-sm p-6">
    <h1 class="text-2xl font-bold mb-6">
      Lộ trình học tập
    </h1>

    <div
      v-if="learningPaths.length === 0"
      class="text-center py-12"
    >
      <p class="text-gray-500">
        Bạn chưa có lộ trình học tập nào
      </p>
    </div>

    <div
      v-else
      class="space-y-6"
    >
      <div
        v-for="path in learningPaths"
        :key="path.id"
        class="border rounded-lg overflow-hidden"
      >
        <div class="flex gap-4 p-4">
          <img
            :src="path.image"
            :alt="path.title"
            class="w-32 h-32 object-cover rounded"
          >
          <div class="flex-1">
            <h3 class="font-semibold text-lg mb-1">
              {{ path.title }}
            </h3>
            <p class="text-gray-600 text-sm mb-3">
              {{ path.description }}
            </p>

            <div class="mb-3">
              <div class="flex justify-between text-sm mb-1">
                <span>Tiến độ</span>
                <span class="font-semibold">{{ path.progress }}%</span>
              </div>
              <UProgress :value="path.progress" />
              <p class="text-xs text-gray-500 mt-1">
                {{ path.completedCourses }}/{{ path.totalCourses }} khoá học đã hoàn thành
              </p>
            </div>

            <div class="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <span>Thời gian ước tính: {{ path.estimatedTime }}</span>
            </div>

            <div class="space-y-2">
              <div
                v-for="(course, index) in path.courses"
                :key="index"
                class="flex items-center gap-2 text-sm"
              >
                <UIcon
                  :name="course.status === 'completed' ? 'i-lucide-check-circle' : course.status === 'in-progress' ? 'i-lucide-play-circle' : 'i-lucide-circle'"
                  :class="course.status === 'completed' ? 'text-green-500' : course.status === 'in-progress' ? 'text-blue-500' : 'text-gray-300'"
                  class="w-4 h-4"
                />
                <span :class="course.status === 'completed' ? 'line-through text-gray-400' : ''">
                  {{ course.name }}
                </span>
              </div>
            </div>

            <UButton
              color="primary"
              class="mt-4"
            >
              Tiếp tục lộ trình
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
