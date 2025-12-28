<script setup lang="ts">
import { authService } from '~/services/auth'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { ChangePasswordSchema } from '~/utils/schema/forgot-password'
import AuthChangePasswordModal from '~/components/auth/ChangePasswordModal.vue'

definePageMeta({
  layout: 'blank',
  middleware: 'guest'
})

useSeoMeta({
  title: 'Xác thực mật khẩu',
  description: 'Xác thực mật khẩu'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

const token = computed(() => (route.query.token as string) || '')

const isLoading = ref(true)
const isResettingPassword = ref(false)
const verifyStatus = ref<'loading' | 'verified' | 'error'>('loading')
const errorMessage = ref('')
const showChangePasswordModal = ref(false)

// Bước 1: Verify token có hợp lệ hay không
async function handleVerifyToken() {
  if (!token.value) {
    verifyStatus.value = 'error'
    errorMessage.value = 'Token xác thực không hợp lệ'
    isLoading.value = false
    // setTimeout(() => {
    //   router.push('/forgot-password')
    // }, 3000)
    return
  }

  try {
    await authService.resetPasswordVerify({
      token: token.value
    })

    // Giả sử token hợp lệ, chuyển sang trạng thái verified
    verifyStatus.value = 'verified'
    showChangePasswordModal.value = true
  } catch (error) {
    verifyStatus.value = 'error'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorResponse = (error as any)?.data
    if (errorResponse?.error?.code === 'TOKEN_INVALID' || errorResponse?.error?.code === 'TOKEN_EXPIRED') {
      errorMessage.value = 'Token xác thực đã hết hạn hoặc không hợp lệ'
    } else {
      errorMessage.value = errorResponse?.error?.message || 'Token không hợp lệ. Vui lòng thử lại'
    }

    toast.add({
      title: 'Xác thực thất bại',
      description: 'Token xác thực đã hết hạn hoặc không hợp lệ',
      color: 'error'
    })

    // Redirect về forgot-password sau 3 giây
    setTimeout(() => {
      router.push('/forgot-password')
    }, 3000)
  } finally {
    isLoading.value = false
  }
}

// Bước 2: Xử lý đổi mật khẩu từ modal
async function onSubmitChangePassword(
  payload: FormSubmitEvent<ChangePasswordSchema>
) {
  isResettingPassword.value = true
  try {
    const response = await authService.resetPassword({
      newPassword: payload.data.newPassword,
      confirmPassword: payload.data.confirmPassword,
      token: token.value
    })

    if (response.data) {
      toast.add({
        title: 'Đổi mật khẩu thành công',
        description: 'Bạn có thể đăng nhập với mật khẩu mới',
        color: 'success'
      })

      showChangePasswordModal.value = false
      // Redirect đến trang login sau 2 giây
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorResponse = (error as any)?.data
    toast.add({
      title: 'Đổi mật khẩu thất bại',
      description: errorResponse?.error?.message || 'Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại',
      color: 'error'
    })
  } finally {
    isResettingPassword.value = false
  }
}

onMounted(() => {
  handleVerifyToken()
})
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <div class="text-center space-y-4 max-w-md px-4">
      <!-- Loading State - Bước 1: Đang verify token -->
      <template v-if="verifyStatus === 'loading'">
        <UIcon
          name="i-lucide-loader"
          class="animate-spin text-primary"
          size="60"
        />
        <p class="text-lg font-semibold text-primary animate-pulse">
          Đang xác thực token...
        </p>
      </template>

      <!-- Verified State - Token hợp lệ, đang chờ user nhập mật khẩu -->
      <template v-else-if="verifyStatus === 'verified'">
        <UIcon
          name="i-lucide-check-circle"
          class="text-green-500"
          size="60"
        />
        <p class="text-lg font-semibold text-green-500">
          Token hợp lệ!
        </p>
        <p class="text-default">
          Vui lòng nhập mật khẩu mới trong form bên dưới
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
          {{ errorMessage || 'Đã xảy ra lỗi. Đang chuyển đến trang quên mật khẩu...' }}
        </p>
      </template>
    </div>

    <!-- Modal đổi mật khẩu - Bước 2 -->
    <AuthChangePasswordModal
      v-model:open="showChangePasswordModal"
      :dismissible="false"
      :loading="isResettingPassword"
      @submit="onSubmitChangePassword"
    />
  </div>
</template>
