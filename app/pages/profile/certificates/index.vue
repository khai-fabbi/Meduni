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
const isLoading = ref(true)

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
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400',
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

onMounted(async () => {
  isLoading.value = false
})
</script>

<template>
  <div>
    <Heading
      variant="h3"
      class="font-extrabold mb-6 md:text-start text-center"
    >
      Chứng nhận của bạn
    </Heading>

    <div class="pb-4">
      <div
        v-if="certificates.length === 0"
        class="bg-white rounded-sm text-center py-12"
      >
        <p class="text-neutral-500 text-lg">
          Bạn chưa có chứng nhận nào
        </p>
      </div>

      <div
        v-else
        class="space-y-4"
      >
        <SkeletonCertificate v-if="isLoading" />

        <template v-else>
          <div
            v-for="certificate in certificates"
            :key="certificate.id"
            class="bg-white rounded-sm flex flex-col md:flex-row md:items-center gap-4 p-4"
          >
            <NuxtImg
              :src="certificate.image"
              :alt="certificate.title"
              class="w-full md:w-48 h-32 md:h-28 object-cover rounded-lg shrink-0"
            />

            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-base md:text-2xl mb-2">
                {{ certificate.title }}
              </h3>
              <p class="text-xs md:text-lg  mb-3">
                Giảng viên: {{ certificate.instructor }}
              </p>
              <div class="flex flex-wrap gap-2">
                <UBadge
                  color="primary"
                  variant="outline"
                  size="md"
                  class="bg-certificate-badge border-0 py-2 px-4 cursor-pointer"
                >
                  {{ certificate.chapters }} chương
                </UBadge>
                <UBadge
                  color="primary"
                  variant="outline"
                  size="md"
                  class="bg-certificate-badge border-0 py-2 px-4 cursor-pointer"
                >
                  {{ certificate.lessons }} bài giảng
                </UBadge>
                <UBadge
                  color="primary"
                  variant="outline"
                  size="md"
                  class="bg-certificate-badge border-0 py-2 px-4 cursor-pointer"
                >
                  {{ certificate.exercises }} bài tập
                </UBadge>
                <UBadge
                  color="primary"
                  variant="outline"
                  size="md"
                  class="bg-certificate-badge border-0 py-2 px-4 cursor-pointer"
                >
                  Thời lượng {{ certificate.duration }}
                </UBadge>
              </div>
            </div>

            <div class="shrink-0">
              <UButton
                color="primary"
                size="lg"
                class="text-base md:w-39 md:h-12 w-full h-10 justify-center items-center"
                :to="`/profile/certificates/${certificate.id}`"
              >
                Xem chứng nhận
              </UButton>
            </div>
          </div>
        </template>
      </div>

      <div
        v-if="certificates.length > PAGE_DEFAULT"
        class="mt-6 flex md:justify-end md:mr-4 justify-center"
      >
        <UPagination
          v-model:page="page"
          :total="certificates.length"
          :page-size="PAGE_DEFAULT"
        />
      </div>
    </div>
  </div>
</template>
