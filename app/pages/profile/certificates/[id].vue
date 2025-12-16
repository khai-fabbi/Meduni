<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const route = useRoute()
const certificateId = route.params.id
const isLoading = ref(true)

useSeoMeta({
  title: 'Chi tiết chứng nhận',
  description: 'Chi tiết chứng nhận của bạn'
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
    label: 'Chứng nhận',
    to: '/profile/certificates'
  },
  {
    label: 'Chi tiết chứng nhận',
    to: '#'
  }
])

definePageMeta({
  layout: 'profile'
})

// Mock data - trong thực tế sẽ fetch từ API dựa trên certificateId
const certificateDetail = ref({
  id: certificateId,
  title: 'CHÚC MỪNG BẠN ĐÃ ĐĂNG KÝ THÀNH CÔNG THAM GIA MEDUNI.VN',
  body: 'Chúc bạn học được nhiều kiến thức, kỹ năng và có những trải nghiệm học tập tuyệt vời cùng đội ngũ giảng viên xuất sắc hàng đầu tại Việt Nam.',
  image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
  courseTitle: 'Đồng Hành Cùng AI – Dễ Hiểu, Dễ Học, Miễn Phí',
  instructor: 'TS Bùi Văn Khoa',
  certificateId: 'CERT-2024-001',
  issuedDate: '15/12/2024'
})

onMounted(async () => {
  isLoading.value = false
})
</script>

<template>
  <div class="space-y-6">
    <UBreadcrumb
      :items="items"
      class="md:hidden mb-0"
    />
    <Heading
      variant="h3"
    >
      Chứng nhận của bạn
    </Heading>

    <div class="bg-white rounded-sm p-6">
      <SkeletonCertificateDetail v-if="isLoading" />

      <div
        v-else
        class="max-w-4xl mx-auto"
      >
        <!-- Certificate Card -->
        <div class="">
          <!-- Illustration Section -->
          <div class="relative mb-8 flex justify-center items-center min-h-[300px] md:min-h-[400px]">
            <!-- Optional: Background Image -->
            <NuxtImg
              v-if="certificateDetail.image"
              :src="certificateDetail.image"
              :alt="certificateDetail.courseTitle"
              class="absolute inset-0 w-full h-full object-cover opacity-10 rounded-lg"
            />
            <!-- Main Illustration Container -->
            <div class="relative w-full max-w-md z-10">
              <!-- Robot -->
              <div class="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                <div class="relative">
                  <!-- Robot Body -->
                  <div class="w-24 h-32 md:w-32 md:h-40 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center relative">
                    <!-- Robot Head -->
                    <div class="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full border-4 border-yellow-400 mb-2 flex items-center justify-center">
                      <div class="w-3 h-3 md:w-4 md:h-4 bg-black rounded-full" />
                      <div class="w-3 h-3 md:w-4 md:h-4 bg-black rounded-full absolute right-2" />
                    </div>
                    <!-- Robot Badge -->
                    <div class="absolute top-2 right-2 w-6 h-6 md:w-8 md:h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span class="text-xs md:text-sm font-bold">★</span>
                    </div>
                  </div>
                  <!-- Speech Bubble -->
                  <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-white rounded-lg px-3 py-2 shadow-md">
                    <span class="text-sm md:text-base font-bold text-secondary-500">MEDUNI AI</span>
                    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
                  </div>
                </div>
              </div>

              <!-- Tablet/Screen -->
              <div class="absolute right-0 top-1/2 -translate-y-1/2 z-0">
                <div class="relative">
                  <!-- Tablet Frame -->
                  <div class="w-48 h-64 md:w-64 md:h-80 bg-neutral-800 rounded-lg shadow-2xl p-3 md:p-4">
                    <!-- Screen Content -->
                    <div class="w-full h-full bg-white rounded flex flex-col items-center justify-center p-4 relative">
                      <!-- Graduation Cap -->
                      <div class="absolute -top-6 -left-4 w-12 h-12 md:w-16 md:h-16">
                        <div class="w-full h-8 bg-primary-600 rounded-t-lg" />
                        <div class="w-full h-4 bg-primary-800 rounded-b-lg" />
                        <div class="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full" />
                      </div>

                      <!-- Brain Icon -->
                      <div class="mb-4">
                        <div class="w-16 h-16 md:w-20 md:h-20 bg-primary-100 rounded-full flex items-center justify-center">
                          <UIcon
                            name="i-lucide-brain"
                            class="w-10 h-10 md:w-12 md:h-12 text-primary-600"
                          />
                        </div>
                      </div>

                      <!-- MEDUNI Logo -->
                      <div class="mb-2">
                        <span class="text-lg md:text-xl font-bold text-primary-600">MEDUNI</span>
                      </div>

                      <!-- Lines (text representation) -->
                      <div class="w-full space-y-1">
                        <div class="h-1 bg-neutral-200 rounded w-full" />
                        <div class="h-1 bg-neutral-200 rounded w-3/4 mx-auto" />
                        <div class="h-1 bg-neutral-200 rounded w-5/6 mx-auto" />
                      </div>

                      <!-- A+ Grade -->
                      <div class="absolute -bottom-4 -right-4 bg-yellow-400 rounded-lg p-2 shadow-lg transform rotate-12">
                        <div class="bg-white rounded px-2 py-1">
                          <span class="text-2xl md:text-3xl font-bold text-neutral-800">A+</span>
                        </div>
                        <div class="absolute -top-1 -right-1 w-3 h-3 bg-neutral-400 rounded-full" />
                      </div>
                    </div>
                  </div>

                  <!-- Decorative Elements -->
                  <div class="absolute -top-8 -right-8 w-16 h-16 md:w-20 md:h-20 opacity-50">
                    <div class="w-full h-full bg-green-400 rounded-full blur-xl" />
                  </div>
                  <div class="absolute -bottom-4 -right-12 w-12 h-12 md:w-16 md:h-16 opacity-50">
                    <div class="w-full h-full bg-purple-400 rounded-full blur-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Text Section -->
          <div class="text-center space-y-4">
            <h2 class="text-2xl md:text-3xl font-extrabold leading-tight">
              {{ certificateDetail.title }}
            </h2>

            <p class="text-lg max-w-2xl mx-auto leading-relaxed">
              {{ certificateDetail.body }}
            </p>
          </div>

          <!-- Button -->
          <div class="mt-8 flex justify-center">
            <UButton
              color="primary"
              class="text-base md:w-71 md:h-12 w-full h-10 justify-center items-center"
              to=""
            >
              Xem khoá học dành cho bạn
              <UIcon
                name="i-lucide-arrow-right"
                class="ml-2 w-6 h-6"
              />
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
