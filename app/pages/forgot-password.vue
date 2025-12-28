<script setup lang="ts">
import type { FormSubmitEvent, TabsItem } from '@nuxt/ui'

import {
  forgotPasswordEmailSchema,
  forgotPasswordPhoneSchema,
  type ForgotPasswordEmailSchema,
  type ForgotPasswordPhoneSchema
} from '~/utils/schema/forgot-password'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Quên mật khẩu',
  description: 'Khôi phục mật khẩu của bạn'
})

const toast = useToast()

enum ForgotPasswordType {
  PHONE = 'phone',
  EMAIL = 'email'
}

const loginItems = [
  {
    label: 'Email',
    value: ForgotPasswordType.EMAIL,
    icon: 'i-lucide-mail',
    slot: 'email' as const
  },
  {
    label: 'Số điện thoại',
    value: ForgotPasswordType.PHONE,
    icon: 'i-lucide-phone',
    slot: 'phone' as const
  }
] satisfies TabsItem[]

const forgotPasswordType = ref<ForgotPasswordType>(ForgotPasswordType.EMAIL)
const isLoading = ref(false)
const showOTPModal = ref(false)
const showChangePasswordModal = ref(false)
const otpVerified = ref(false)

const emailForm = reactive({
  email: 'test@example.com'
})

const phoneForm = reactive({
  phone: '0909090909'
})

async function sendOTP() {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    toast.add({
      title: 'OTP đã được gửi',
      description: 'Vui lòng kiểm tra email/số điện thoại của bạn',
      color: 'success'
    })

    showOTPModal.value = true
  } catch (error) {
    toast.add({
      title: 'Gửi OTP thất bại',
      description: error instanceof Error ? error.message : 'Có lỗi xảy ra',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

function handleResendOTP() {
  sendOTP()
}

async function onSubmitEmail(
  payload: FormSubmitEvent<ForgotPasswordEmailSchema>
) {
  emailForm.email = payload.data.email
  await sendOTP()
}

async function onSubmitPhone(
  payload: FormSubmitEvent<ForgotPasswordPhoneSchema>
) {
  phoneForm.phone = payload.data.phone
  await sendOTP()
}

async function onSubmitOTP(payload: FormSubmitEvent<{ otp: number[] }>) {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (payload.data.otp.join('') === '123456') {
      otpVerified.value = true
      showOTPModal.value = false
      showChangePasswordModal.value = true

      toast.add({
        title: 'Xác thực thành công',
        description: 'Vui lòng nhập mật khẩu mới',
        color: 'success'
      })
    } else {
      toast.add({
        title: 'Mã OTP không đúng',
        description: 'Vui lòng thử lại',
        color: 'error'
      })
    }
  } catch (error) {
    toast.add({
      title: 'Xác thực thất bại',
      description: error instanceof Error ? error.message : 'Có lỗi xảy ra',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

async function onSubmitChangePassword(
  payload: FormSubmitEvent<{
    newPassword: string
    confirmPassword: string
  }>
) {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    toast.add({
      title: 'Đổi mật khẩu thành công',
      description: 'Bạn có thể đăng nhập với mật khẩu mới',
      color: 'success'
    })

    showChangePasswordModal.value = false
    await navigateTo('/login')
  } catch (error) {
    toast.add({
      title: 'Đổi mật khẩu thất bại',
      description: error instanceof Error ? error.message : 'Có lỗi xảy ra',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

const contactInfo = computed(() => {
  return forgotPasswordType.value === ForgotPasswordType.EMAIL
    ? emailForm.email
    : phoneForm.phone
})

const contactType = computed<'email' | 'phone'>(() => {
  return forgotPasswordType.value === ForgotPasswordType.EMAIL
    ? 'email'
    : 'phone'
})
</script>

<template>
  <div class="w-full space-y-8">
    <div class="text-center md:space-y-4">
      <AppLogo class="w-76 h-auto mx-auto" />

      <h1
        class="mt-12 md:text-5xl text-4xl font-bold dark:text-white text-primary"
      >
        Quên mật khẩu
      </h1>

      <p class="md:text-lg text-base text-default">
        Nhập địa chỉ email đăng ký hoặc số điện thoại của bạn để lấy lại mật
        khẩu!
      </p>
    </div>

    <UTabs
      v-model="forgotPasswordType"
      :ui="{
        trigger: 'flex-1 text-lg',
        indicator: 'h-0.5'
      }"
      default-value="phone"
      :items="loginItems"
      variant="link"
      class="w-full gap-4 text-lg"
    >
      <template #phone>
        <UForm
          :schema="forgotPasswordPhoneSchema"
          :state="phoneForm"
          class="flex flex-col gap-4 flex-1"
          :disabled="isLoading"
          @submit="onSubmitPhone"
        >
          <UFormField
            label="Số điện thoại"
            name="phone"
          >
            <UInput
              v-model="phoneForm.phone"
              class="w-full"
              placeholder="Nhập số điện thoại của bạn"
              size="xl"
              icon="i-lucide-phone"
              :ui="{ root: 'h-12 text-lg', base: 'h-full' }"
            />
          </UFormField>

          <UButton
            type="submit"
            size="xl"
            class="w-full min-h-14 text-lg"
            block
            :loading="isLoading"
          >
            Gửi mã OTP
          </UButton>
        </UForm>
      </template>

      <template #email>
        <UForm
          :schema="forgotPasswordEmailSchema"
          :state="emailForm"
          class="flex flex-col gap-4 flex-1"
          :disabled="isLoading"
          @submit="onSubmitEmail"
        >
          <UFormField
            label="Email"
            name="email"
          >
            <UInput
              v-model="emailForm.email"
              class="w-full"
              size="xl"
              placeholder="Nhập email của bạn"
              icon="i-lucide-mail"
            />
          </UFormField>

          <UButton
            type="submit"
            size="xl"
            class="w-full min-h-14 text-lg"
            block
            :loading="isLoading && !showChangePasswordModal && !showOTPModal"
          >
            Gửi mã OTP
          </UButton>
        </UForm>
      </template>
    </UTabs>

    <div class="text-center">
      <ULink
        to="/login"
        class="text-primary font-semibold animate-link-underline"
      >
        Quay lại đăng nhập
      </ULink>
    </div>

    <AuthOtpModal
      v-model:open="showOTPModal"
      :contact-info="contactInfo"
      :contact-type="contactType"
      :loading="isLoading"
      @submit="onSubmitOTP"
      @resend="handleResendOTP"
    />

    <AuthChangePasswordModal
      v-model:open="showChangePasswordModal"
      :loading="isLoading"
      @submit="onSubmitChangePassword"
    />
  </div>
</template>
