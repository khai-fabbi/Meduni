<script setup lang="ts">
import { authService } from '~/services/auth'

definePageMeta({
  layout: 'blank',
  middleware: 'guest'
})

useSeoMeta({
  title: 'Xác thực tài khoản',
  description: 'Xác thực tài khoản',
  ogTitle: 'Xác thực tài khoản',
  ogDescription: 'Xác thực tài khoản'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

const token = computed(() => (route.query.token as string) || '')
const isLoading = ref(true)
const verifyStatus = ref<'loading' | 'success' | 'error'>('loading')
const errorMessage = ref('')

async function handleVerifyToken() {
  if (!token.value) {
    verifyStatus.value = 'error'
    errorMessage.value = 'Token xác thực không hợp lệ'
    isLoading.value = false
    setTimeout(() => {
      router.push('/login')
    }, 3000)
    return
  }

  try {
    const response = await authService.verifyRegister({ token: token.value })

    if (response.data) {
      verifyStatus.value = 'success'
      toast.add({
        title: 'Xác thực thành công',
        description: 'Tài khoản của bạn đã được kích hoạt thành công',
        color: 'success'
      })

      // Redirect đến trang login sau 2 giây
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  } catch (error) {
    verifyStatus.value = 'error'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorResponse = (error as any)?.data
    if (errorResponse?.error?.code === 'OTP_EXPIRED' || errorResponse?.error?.code === 'OTP_INVALID') {
      errorMessage.value = 'Token xác thực đã hết hạn hoặc không hợp lệ'
    } else {
      errorMessage.value = errorResponse?.error?.message || 'Xác thực thất bại. Vui lòng thử lại'
    }

    toast.add({
      title: 'Xác thực thất bại',
      description: errorMessage.value,
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  handleVerifyToken()
})
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <div class="text-center space-y-4 max-w-md px-4">
      <!-- Loading State -->
      <template v-if="verifyStatus === 'loading'">
        <UIcon
          name="i-lucide-loader"
          class="animate-spin text-primary"
          size="60"
        />
        <p class="text-lg font-semibold text-primary animate-pulse">
          Đang xác thực tài khoản...
        </p>
      </template>

      <!-- Success State -->
      <template v-else-if="verifyStatus === 'success'">
        <UIcon
          name="i-lucide-check-circle"
          class="text-green-500"
          size="60"
        />
        <p class="text-lg font-semibold text-green-500">
          Xác thực thành công!
        </p>
        <p class="text-default">
          Tài khoản của bạn đã được kích hoạt. Đang chuyển đến trang đăng nhập...
        </p>
      </template>

      <!-- Error State -->
      <template v-else-if="verifyStatus === 'error'">
        <UIcon
          name="i-lucide-x-circle"
          class="text-red-500"
          size="60"
        />
        <p class="text-lg font-semibold text-red-500">
          Xác thực thất bại
        </p>
        <p class="text-default">
          {{ errorMessage || 'Đã xảy ra lỗi. Đang chuyển đến trang đăng nhập...' }}
        </p>
      </template>
    </div>
  </div>
</template>
