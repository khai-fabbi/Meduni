<script setup lang="ts">
useSeoMeta({
  title: "Khoá học đã mua",
  description: "Khoá học của bạn",
});

definePageMeta({
  layout: "profile",
});

const courses = ref([
  {
    id: 1,
    title: "AI trong Y tế",
    instructor: "TS. Nguyễn Văn B",
    progress: 75,
    totalLessons: 24,
    completedLessons: 18,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
    lastAccessed: "2 ngày trước",
    status: "in-progress",
  },
  {
    id: 2,
    title: "Y tế cộng đồng",
    instructor: "PGS. Trần Thị C",
    progress: 100,
    totalLessons: 16,
    completedLessons: 16,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400",
    lastAccessed: "1 tuần trước",
    status: "completed",
  },
  {
    id: 3,
    title: "Lộ trình học tập chuyên sâu",
    instructor: "TS. Lê Văn D",
    progress: 30,
    totalLessons: 32,
    completedLessons: 10,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
    lastAccessed: "3 ngày trước",
    status: "in-progress",
  },
  {
    id: 4,
    title: "Chăm sóc sức khoẻ cơ bản",
    instructor: "BS. Phạm Thị E",
    progress: 0,
    totalLessons: 12,
    completedLessons: 0,
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400",
    lastAccessed: "Chưa bắt đầu",
    status: "not-started",
  },
]);
</script>

<template>
  <div class="bg-white rounded-sm p-6">
    <h1 class="text-2xl font-bold mb-6">Khoá học đã mua</h1>

    <div v-if="courses.length === 0" class="text-center py-12">
      <p class="text-gray-500">Bạn chưa mua khoá học nào</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="course in courses"
        :key="course.id"
        class="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
      >
        <img
          :src="course.image"
          :alt="course.title"
          class="w-full h-48 object-cover"
        />
        <div class="p-4">
          <div class="flex items-start justify-between mb-2">
            <h3 class="font-semibold text-lg">{{ course.title }}</h3>
            <UBadge
              :color="
                course.status === 'completed'
                  ? 'success'
                  : course.status === 'in-progress'
                    ? 'primary'
                    : 'neutral'
              "
              size="sm"
            >
              {{
                course.status === "completed"
                  ? "Hoàn thành"
                  : course.status === "in-progress"
                    ? "Đang học"
                    : "Chưa bắt đầu"
              }}
            </UBadge>
          </div>
          <p class="text-gray-600 text-sm mb-4">
            Giảng viên: {{ course.instructor }}
          </p>

          <div class="mb-4">
            <div class="flex justify-between text-sm mb-1">
              <span>Tiến độ</span>
              <span class="font-semibold">{{ course.progress }}%</span>
            </div>
            <UProgress :value="course.progress" />
            <p class="text-xs text-gray-500 mt-1">
              {{ course.completedLessons }}/{{ course.totalLessons }} bài học đã
              hoàn thành
            </p>
          </div>

          <div
            class="flex items-center justify-between text-sm text-gray-600 mb-4"
          >
            <span>Truy cập lần cuối: {{ course.lastAccessed }}</span>
          </div>

          <UButton color="primary" block>Tiếp tục học</UButton>
        </div>
      </div>
    </div>
  </div>
</template>
