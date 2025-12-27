<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import type { CertificateListItem } from '~/types/course'
import type { ApiResponse } from '~/types/common'
import { ApiEndpoint } from '~/utils/apiEndpoint'
import { formatDate } from '~/utils/date'

useSeoMeta({
  title: 'Chứng nhận của bạn',
  description: 'Chứng nhận đã hoàn thành'
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
    label: 'Chứng nhận của bạn',
    to: '#'
  }
])

definePageMeta({
  layout: 'profile'
})

const isLoading = ref(true)
const certificates = ref<CertificateListItem[]>([])
const toast = useToast()

// Fetch certificates from API
async function fetchCertificates() {
  try {
    isLoading.value = true
    const { $api } = useNuxtApp()
    const response = await $api<ApiResponse<CertificateListItem[]>>(
      ApiEndpoint.Courses.GetCertificates,
      {
        method: 'GET'
      }
    )

    if (response.data) {
      certificates.value = response.data
    }
  } catch (error) {
    console.error('Error fetching certificates:', error)
    toast.add({
      title: 'Lỗi',
      description: 'Không thể tải danh sách chứng nhận',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

// Format completion date
const formatCompletionDate = (dateString: string) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return formatDate(date, 'DD/MM/YYYY')
  } catch {
    return dateString
  }
}

// Computed for empty state
const isEmpty = computed(() => !isLoading.value && certificates.value.length === 0)

onMounted(() => {
  fetchCertificates()
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

    <div class="pb-4">
      <div
        v-if="isEmpty"
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
            :key="certificate.my_course_id"
            class="bg-white rounded-sm flex flex-col md:flex-row md:items-center gap-4 p-4"
          >
            <NuxtImg
              src="/images/course/course-placeholder.png"
              :alt="certificate.course_name"
              class="w-full md:w-48 h-32 md:h-28 object-cover rounded-lg shrink-0"
            />

            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-base md:text-2xl mb-2">
                {{ certificate.course_name }}
              </h3>
              <p class="text-xs md:text-lg mb-3">
                Hoàn thành: {{ formatCompletionDate(certificate.completion_date) }}
              </p>
              <div class="flex flex-wrap gap-2">
                <UBadge
                  color="primary"
                  variant="outline"
                  size="md"
                  class="bg-certificate-badge border-0 py-2 px-4 cursor-pointer"
                >
                  Tiến độ: {{ certificate.progress }}%
                </UBadge>
              </div>
            </div>

            <div class="shrink-0">
              <UButton
                color="primary"
                size="lg"
                class="text-base md:w-39 md:h-12 w-full h-10 justify-center items-center"
                :to="`/profile/certificates/${certificate.my_course_id}`"
              >
                Xem chứng nhận
              </UButton>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
