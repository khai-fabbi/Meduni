<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import { motion } from 'motion-v'
import CourseOverview from '~/components/course/CourseOverview.vue'
import CourseContent from '~/components/course/CourseContent.vue'
import CourseDetails from '~/components/course/CourseDetails.vue'
import InstructorInfo from '~/components/course/InstructorInfo.vue'
import SharedConfettiEffect from '~/components/shared/ConfettiEffect.vue'
import { services } from '~/services'
import { cartService } from '~/services/cart'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'
import type { CourseDetail, Chapter as ApiChapter, Lesson as ApiLesson } from '~/types/course'
import type { CartApiItem, SePayTransactionResponse } from '~/types/cart'
import { PaymentStatus } from '~/types/cart'
import { getLinkFromS3, formatDuration } from '~/utils/helpers'

const route = useRoute()
const courseId = route.params.id as string

interface Lesson {
  title: string
  duration: string
  lesson_order: number
  lesson_type: number
  lesson_id: string
}

interface Chapter {
  id: number
  title: string
  lessons: Lesson[]
  totalLessons: number
  totalDuration: string
}

const {
  data: courseData,
  pending: isLoadingCourse,
  error: courseError,
  refresh: refreshCourse
} = await services.courses.getCourseById(courseId)

if (!courseData.value) {
  throw createError({
    statusCode: HttpCode.NOT_FOUND,
    statusMessage: 'Không tìm thấy dữ liệu',
    fatal: true
  })
}
const course = computed(() => {
  if (!courseData.value?.data) {
    return null
  }
  const apiCourse = courseData.value.data as unknown as CourseDetail
  return {
    id: apiCourse.course_id,
    image: apiCourse.course_image ? getLinkFromS3(apiCourse.course_image) : '',
    tag: apiCourse.category?.category_name || apiCourse.category_name || '',
    title: apiCourse.course_name,
    overview: apiCourse.description || '',
    language: 'Tiếng Việt',
    totalLessons: apiCourse.info?.total_lesson || 0,
    difficulty: 'Trình độ Trung bình',
    duration: formatDuration(apiCourse.info?.total_duration || 0),
    certificate: 'Khi khóa học kết thúc'
  }
})

const chapters = computed<Chapter[]>(() => {
  if (!courseData.value?.data) {
    return []
  }
  const apiCourse = courseData.value.data as unknown as CourseDetail
  if (!apiCourse.chapters || !Array.isArray(apiCourse.chapters)) {
    return []
  }

  return apiCourse.chapters.map((chapter: ApiChapter, index: number) => {
    const chapterLessons = chapter.lessons || []
    const totalDuration = chapterLessons.reduce((sum: number, lesson: ApiLesson) => {
      return sum + (lesson.lesson_duration || 0)
    }, 0)

    return {
      id: index + 1,
      title: chapter.chapter_name,
      totalLessons: chapterLessons.length,
      totalDuration: formatDuration(totalDuration),
      lessons: chapterLessons.map((lesson: ApiLesson) => ({
        lesson_id: lesson.lesson_id,
        title: lesson.lesson_name,
        duration: formatDuration(lesson.lesson_duration || 0),
        lesson_order: lesson.lesson_order,
        lesson_type: lesson.lesson_type
      }))
    }
  })
})

const instructor = {
  name: courseData.value?.data?.teacher?.teacher_name || '',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  description: 'Tại Học viện Med AI, Đội ngũ phát triển hệ tư duy lôi và phương pháp khoa học giúp cha mẹ đồng hành hiệu quả cùng con.',
  greeting: 'Xin chào! Mình là trợ lý MEDUNI. Nếu bạn thắc mắc bất cứ điều gì MEDUNI, hãy đặt câu hỏi để mình ai giới đẹp hoặc tư vấn nga',
  stats: [
    'Hàng tháng, 40.000-60.000 khách hàng tham dự các chương trình trực tuyến miễn phí dành cho cha mẹ do các giảng viên trực tiếp chia sẻ.',
    'Gần 50.000 khách hàng đã và đang tham gia các chương trình trực tuyến hàng tháng.',
    'Hàng chục nghìn gia đình đã và đang chuyển hóa tích cực 5 lan tỏa giá trị tích cực tới cộng đồng & xã hội.'
  ]
}

const items = computed<BreadcrumbItem[]>(() => [
  {
    label: 'Trang chủ',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: 'Khoá học',
    to: '/khoa-hoc'
  },
  {
    label: course.value?.title || 'Chi tiết khóa học',
    to: '#'
  }
])

const title = computed(() => course.value ? `${course.value.title} - MedUni.ai` : 'Chi tiết khóa học - MedUni.ai')
const description = computed(() => course.value?.overview || '')

useSeoMeta({
  title: title.value,
  ogTitle: title.value,
  description: description.value,
  ogDescription: description.value
})

const courseInfo = computed(() => ({
  courseId: courseId,
  language: course.value?.language || '',
  totalLessons: course.value?.totalLessons || 0,
  difficulty: course.value?.difficulty || '',
  duration: course.value?.duration || '',
  certificate: course.value?.certificate || ''
}))

const isOwned = computed(() => !!courseData.value?.data?.my_course_id)
const firstLessonId = computed(() => chapters.value[0]?.lessons[0]?.lesson_id?.toString() || '')

const toast = useToast()
const authStore = useAuthStore()
const cartStore = useCartStore()
const isAddingToCart = ref(false)
const confettiRef = ref<InstanceType<typeof SharedConfettiEffect> | null>(null)

const confirmPaymentModalOpen = ref(false)
const paymentModalOpen = ref(false)
const isCreatingTransaction = ref(false)
const transactionData = ref<SePayTransactionResponse | null>(null)
const pollingInterval = ref<NodeJS.Timeout | null>(null)
const paymentStatus = ref<PaymentStatus>(PaymentStatus.PENDING)

const coursePrice = computed(() => {
  if (!courseData.value?.data) return 0
  const apiCourse = courseData.value.data as unknown as CourseDetail

  if (apiCourse.effective_duration && apiCourse.effective_duration.length > 0) {
    const defaultDuration = apiCourse.effective_duration.find(d => d.is_default)
    if (defaultDuration) {
      return defaultDuration.price
    }
    const firstDuration = apiCourse.effective_duration[0]
    if (firstDuration) {
      return firstDuration.price
    }
  }

  return apiCourse.price || 0
})

const originalPrice = computed(() => {
  if (!courseData.value?.data) return 0
  const apiCourse = courseData.value.data as unknown as CourseDetail
  return apiCourse.price || 0
})

const finalPrice = computed(() => {
  return coursePrice.value
})

const discount = computed(() => {
  const discountAmount = originalPrice.value - finalPrice.value
  return Math.max(0, discountAmount)
})

onMounted(async () => {
  if (import.meta.client && authStore.isAuthenticated) {
    try {
      const cartResponse = await cartService.getList()
      if (cartResponse.data?.carts) {
        cartStore.setCartApiItems(cartResponse.data.carts)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }
})

async function handleAddToCart(courseId: string) {
  if (cartStore.isCourseInCart(courseId)) {
    toast.add({
      title: 'Thông báo',
      description: 'Khóa học đã có trong giỏ hàng',
      color: 'warning'
    })
    return
  }

  try {
    isAddingToCart.value = true
    await cartService.addToCart(courseId)

    authStore.updateCartCount(1)

    try {
      const cartResponse = await cartService.getList()
      if (cartResponse.data?.carts) {
        const newCartItem = cartResponse.data.carts.find((item: CartApiItem) => item.course_id === courseId)
        if (newCartItem) {
          cartStore.addCartItem(newCartItem)
        } else {
          cartStore.setCartApiItems(cartResponse.data.carts)
        }
      }
    } catch (error) {
      console.error('Error fetching cart after add:', error)
    }

    toast.add({
      title: 'Thành công',
      description: 'Đã thêm khóa học vào giỏ hàng',
      color: 'success'
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
    toast.add({
      title: 'Lỗi',
      description: 'Không thể thêm khóa học vào giỏ hàng. Vui lòng thử lại.',
      color: 'error'
    })
  } finally {
    isAddingToCart.value = false
  }
}

function handleBuyNow() {
  confirmPaymentModalOpen.value = true
}

async function confirmPayment() {
  try {
    isCreatingTransaction.value = true

    let cartId: string | null = null

    if (!cartStore.isCourseInCart(courseId)) {
      await cartService.addToCart(courseId)

      const cartResponse = await cartService.getList()
      if (cartResponse.data?.carts) {
        const newCartItem = cartResponse.data.carts.find((item: CartApiItem) => item.course_id === courseId)
        if (newCartItem) {
          cartId = newCartItem.cart_id
          cartStore.addCartItem(newCartItem)
        }
      }
    } else {
      const existingItem = cartStore.cartApiItems.find(item => item.course_id === courseId)
      if (existingItem) {
        cartId = existingItem.cart_id
      }
    }

    if (!cartId) {
      throw new Error('Không tìm thấy cart_id')
    }

    const requestBody = {
      language: 'vn' as const,
      carts: [cartId]
    }

    const response = await cartService.createSePayTransaction(requestBody)

    if (response && response.data) {
      transactionData.value = response.data
      paymentStatus.value = PaymentStatus.PENDING

      confirmPaymentModalOpen.value = false
      paymentModalOpen.value = true

      startPollingTransactionStatus(response.data.transaction_id)
    } else {
      throw new Error('Không nhận được dữ liệu từ API')
    }
  } catch (error: unknown) {
    console.error('Error creating transaction:', error)
    const errorMessage = (error as { data?: { error?: { message?: string } } })?.data?.error?.message || 'Không thể tạo giao dịch thanh toán. Vui lòng thử lại.'
    toast.add({
      title: 'Lỗi',
      description: errorMessage,
      color: 'error'
    })
    confirmPaymentModalOpen.value = false
  } finally {
    isCreatingTransaction.value = false
  }
}

function startPollingTransactionStatus(transactionId: string) {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
  }

  pollingInterval.value = setInterval(async () => {
    try {
      const response = await cartService.getTransactionStatus(transactionId)

      if (response && response.data) {
        paymentStatus.value = response.data.payment_status

        if (response.data.payment_status === PaymentStatus.SUCCESS) {
          stopPolling()
          paymentModalOpen.value = false
          await nextTick()
          confettiRef.value?.trigger()
          toast.add({
            title: 'Thành công',
            description: 'Thanh toán thành công!',
            color: 'success'
          })
          await refreshCourse()
        } else if (response.data.payment_status === PaymentStatus.FAILED) {
          stopPolling()
          toast.add({
            title: 'Thất bại',
            description: 'Giao dịch thanh toán thất bại',
            color: 'error'
          })
        }
      }
    } catch (error) {
      console.error('Error checking transaction status:', error)
    }
  }, 2000)
}

function stopPolling() {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
}

onUnmounted(() => {
  stopPolling()
})

const qrCodeUrl = computed(() => transactionData.value?.qr_code_url || transactionData.value?.qr_code_data || 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=payment')
const totalAmount = computed(() => transactionData.value?.total_amount || coursePrice.value)

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(price)
}
</script>

<template>
  <UContainer class="mb-10 md:mb-20">
    <UBreadcrumb
      :items="items"
    />

    <div
      v-if="isLoadingCourse"
      class="flex justify-center items-center py-20"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="animate-spin size-10 text-primary"
      />
    </div>

    <!-- Error state -->
    <div
      v-else-if="courseError"
      class="flex justify-center items-center py-20"
    >
      <div class="text-center">
        <p class="text-error mb-4">
          Có lỗi xảy ra khi tải dữ liệu
        </p>
        <UButton @click="refreshCourse()">
          Thử lại
        </UButton>
      </div>
    </div>

    <div
      v-else-if="course"
      class="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] 2xl:grid-cols-[1fr_530px] gap-6 md:gap-7"
    >
      <div class="space-y-6">
        <motion.div
          class="overflow-hidden rounded-lg"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5 }"
        >
          <NuxtImg
            :src="course.image || '/images/course/course-placeholder.png'"
            :alt="course.title"
            class="w-full h-auto object-cover"
            quality="100"
            :placeholder="[50, 25]"
          />
        </motion.div>

        <motion.div
          class="space-y-4"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.1 }"
        >
          <UBadge
            color="secondary"
            size="lg"
            variant="subtle"
            class="rounded-sm"
          >
            {{ course.tag }}
          </UBadge>

          <Heading
            variant="h3"
            as="h1"
            class="text-primary"
          >
            {{ course.title }}
          </Heading>
        </motion.div>

        <motion.div
          v-if="course.overview"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.2 }"
        >
          <CourseOverview :overview="course.overview" />
        </motion.div>

        <motion.div
          v-if="chapters.length > 0"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.3 }"
        >
          <CourseContent
            :chapters="chapters"
            :course-id="courseId"
            :is-owned="isOwned"
          />
        </motion.div>
      </div>

      <div class="space-y-6">
        <motion.div
          :initial="{ opacity: 0, x: 20 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.5, delay: 0.2 }"
        >
          <CourseDetails
            :course-info="courseInfo"
            :is-owned="isOwned"
            :first-lesson-id="firstLessonId"
            :is-loading="isAddingToCart"
            @add-to-cart="handleAddToCart"
            @buy-now="handleBuyNow"
          />
        </motion.div>

        <motion.div
          :initial="{ opacity: 0, x: 20 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.5, delay: 0.3 }"
        >
          <InstructorInfo
            :name="instructor.name"
            :avatar="instructor.avatar"
            :description="instructor.description"
            :stats="instructor.stats"
          />
        </motion.div>
      </div>
    </div>

    <div
      v-else
      class="flex justify-center items-center py-20"
    >
      <p class="text-secondary">
        Không tìm thấy khóa học
      </p>
    </div>

    <UModal
      v-model:open="confirmPaymentModalOpen"
      :ui="{
        content: 'sm:max-w-2xl',
        header: 'border-b-0 justify-center',
        body: 'items-center border-0',
        footer: 'border-0 items-center mx-auto'
      }"
    >
      <template #header>
        <div class="flex items-center justify-center gap-3">
          <UIcon
            name="i-lucide-alert-circle"
            class="size-6 text-primary"
          />
          <h3 class="text-lg font-bold text-center">
            Xác nhận thanh toán
          </h3>
        </div>
      </template>

      <template #body>
        <div class="space-y-4">
          <p class="text-base text-neutral-600 text-center">
            Vui lòng kiểm tra lại thông tin đơn hàng trước khi thanh toán
          </p>
          <div class="bg-neutral-50 rounded-lg p-4 space-y-3">
            <div>
              <p class="font-semibold text-base mb-2">
                Khóa học
              </p>
              <p class="text-base text-neutral-700 font-bold">
                {{ course?.title }}
              </p>
            </div>
            <div class="space-y-2">
              <div
                v-if="discount > 0"
                class="flex justify-between items-center"
              >
                <span class="text-sm text-neutral-600">
                  Giá gốc:
                </span>
                <span class="text-sm font-medium text-neutral-700 line-through">
                  {{ formatPrice(originalPrice) }}
                </span>
              </div>
              <div class="flex justify-between items-center pt-2 border-t border-neutral-200">
                <span class="text-base font-semibold text-neutral-800">
                  Tổng thanh toán:
                </span>
                <span class="text-lg font-bold text-primary">
                  {{ formatPrice(finalPrice) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex gap-5 justify-center">
          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            class="min-w-64 px-10 py-5 text-center justify-center"
            @click="confirmPaymentModalOpen = false"
          >
            Hủy bỏ
          </UButton>
          <UButton
            color="primary"
            size="lg"
            class="min-w-64 px-10 py-5 text-center justify-center"
            :loading="isCreatingTransaction"
            @click="confirmPayment"
          >
            Xác nhận thanh toán
          </UButton>
        </div>
      </template>
    </UModal>

    <UModal
      v-model:open="paymentModalOpen"
      :ui="{
        content: 'sm:max-w-2xl',
        header: 'border-b-0 justify-center',
        body: 'border-0 items-center',
        footer: 'border-0 items-center mx-auto'
      }"
    >
      <template #header>
        <div class="flex items-center justify-center gap-3">
          <UIcon
            name="i-lucide-check-circle"
            class="size-6 text-success"
          />
          <h3 class="text-lg font-bold text-center">
            Giao dịch đã được tạo thành công
          </h3>
        </div>
      </template>

      <template #body>
        <div class="space-y-4">
          <p class="text-base text-neutral-600 text-center">
            Vui lòng quét mã QR để tiến hành thanh toán
          </p>

          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-neutral-700">
              Trạng thái:
            </span>
            <span class="text-sm text-neutral-600">
              Chờ thanh toán
            </span>
            <UIcon
              name="i-lucide-loader-circle"
              class="size-4 text-primary animate-spin"
            />
          </div>

          <div class="flex justify-center">
            <div class="bg-white rounded-lg p-4 border-2 border-neutral-200">
              <NuxtImg
                :src="qrCodeUrl"
                alt="QR Code"
                class="w-64 h-64"
              />
            </div>
          </div>

          <!-- Total amount -->
          <div class="bg-primary-50 rounded-lg p-4 border border-primary-200">
            <p class="text-base font-semibold text-primary-700 text-center">
              Tổng thanh toán: {{ formatPrice(totalAmount) }}
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex gap-5 justify-center">
          <UButton
            color="neutral"
            size="lg"
            class="min-w-64 px-10 py-5 text-center justify-center"
            @click="paymentModalOpen = false; stopPolling()"
          >
            Đóng
          </UButton>
        </div>
      </template>
    </UModal>

    <SharedConfettiEffect
      ref="confettiRef"
      :auto-trigger="false"
    />
  </UContainer>
</template>
