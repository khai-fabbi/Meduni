<script setup lang="ts">
import { PAGE_DEFAULT } from '~/utils/constants'

useSeoMeta({
  title: 'Chứng nhận của bạn',
  description: 'Chứng nhận đã hoàn thành'
})

definePageMeta({
  layout: 'profile'
})

const page = ref(1)
const isLoading = ref(false)

const certificates = ref([
  {
    id: 1,
    title: 'Đồng Hành Cùng AI – Dễ Hiểu, Dễ Học, Miễn Phí',
    instructor: 'TS Bùi Văn Khoa',
    chapters: 1,
    lessons: 15,
    exercises: 12,
    duration: '10 tiếng 20 phút',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    certificateId: 'CERT-2024-001',
    issuedDate: '15/12/2024'
  },
  {
    id: 2,
    title: 'Đồng Hành Cùng AI – Dễ Hiểu, Dễ Học, Miễn Phí',
    instructor: 'TS Bùi Văn Khoa',
    chapters: 1,
    lessons: 15,
    exercises: 12,
    duration: '10 tiếng 20 phút',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
    certificateId: 'CERT-2024-002',
    issuedDate: '10/11/2024'
  },
  {
    id: 3,
    title: 'Đồng Hành Cùng AI – Dễ Hiểu, Dễ Học, Miễn Phí',
    instructor: 'TS Bùi Văn Khoa',
    chapters: 1,
    lessons: 15,
    exercises: 12,
    duration: '10 tiếng 20 phút',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400',
    certificateId: 'CERT-2024-003',
    issuedDate: '05/10/2024'
  },
  {
    id: 4,
    title: 'Đồng Hành Cùng AI – Dễ Hiểu, Dễ Học, Miễn Phí',
    instructor: 'TS Bùi Văn Khoa',
    chapters: 1,
    lessons: 15,
    exercises: 12,
    duration: '10 tiếng 20 phút',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
    certificateId: 'CERT-2024-004',
    issuedDate: '01/09/2024'
  },
  {
    id: 5,
    title: 'Đồng Hành Cùng AI – Dễ Hiểu, Dễ Học, Miễn Phí',
    instructor: 'TS Bùi Văn Khoa',
    chapters: 1,
    lessons: 15,
    exercises: 12,
    duration: '10 tiếng 20 phút',
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400',
    certificateId: 'CERT-2024-005',
    issuedDate: '25/08/2024'
  }
])
</script>

<template>
  <div>
    <h1 class="text-[2rem] font-extrabold mb-6">
      Chứng nhận của bạn
    </h1>

    <div class="bg-white rounded-sm p-6">
      <div
        v-if="certificates.length === 0"
        class="text-center py-12"
      >
        <p class="text-neutral-500 text-lg">
          Bạn chưa có chứng nhận nào
        </p>
      </div>

      <div
        v-else
        class="space-y-4"
      >
        <div
          v-for="certificate in certificates"
          :key="certificate.id"
          class="flex flex-col md:flex-row md:items-center gap-4 p-4 border-b border-neutral-300 last:border-b-0"
        >
          <NuxtImg
            :src="certificate.image"
            :alt="certificate.title"
            class="w-full md:w-48 h-32 md:h-28 object-cover rounded-lg shrink-0"
          />

          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-xl md:text-2xl text-primary mb-2">
              {{ certificate.title }}
            </h3>
            <p class="text-base md:text-lg text-neutral-600 mb-3">
              Giảng viên: {{ certificate.instructor }}
            </p>
            <div class="flex flex-wrap gap-2">
              <UBadge
                color="primary"
                variant="outline"
                size="sm"
              >
                {{ certificate.chapters }} chương
              </UBadge>
              <UBadge
                color="primary"
                variant="outline"
                size="sm"
              >
                {{ certificate.lessons }} bài giảng
              </UBadge>
              <UBadge
                color="primary"
                variant="outline"
                size="sm"
              >
                {{ certificate.exercises }} bài tập
              </UBadge>
              <UBadge
                color="primary"
                variant="outline"
                size="sm"
              >
                Thời lượng {{ certificate.duration }}
              </UBadge>
            </div>
          </div>

          <div class="shrink-0">
            <UButton
              color="primary"
              size="lg"
              class="w-full md:w-auto"
            >
              Xem chứng nhận
            </UButton>
          </div>
        </div>
      </div>

      <div class="mt-6 mx-auto flex">
        <UPagination
          v-model:page="page"
          class="mx-auto"
          :total="certificates.length"
          :page-size="PAGE_DEFAULT"
        />
      </div>
    </div>
  </div>
</template>

