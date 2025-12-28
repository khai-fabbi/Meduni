<script setup lang="ts">
import type { FormSubmitEvent, TabsItem } from '@nuxt/ui'

import {
  forgotPasswordEmailSchema,
  forgotPasswordPhoneSchema,
  type ForgotPasswordEmailSchema,
  type ForgotPasswordPhoneSchema
} from '~/utils/schema/forgot-password'
import { authService } from '~/services/auth'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
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
    slot: 'phone' as const,
    disabled: true // Tạm thời disable số điện thoại,
  }
] satisfies TabsItem[]

const forgotPasswordType = ref<ForgotPasswordType>(ForgotPasswordType.EMAIL)
const isLoading = ref(false)

const emailForm = reactive({
  email: ''
})

const phoneForm = reactive({
  phone: ''
})

async function onSubmitEmail(
  payload: FormSubmitEvent<ForgotPasswordEmailSchema>
) {
  isLoading.value = true
  try {
    emailForm.email = payload.data.email

    const response = await authService.forgotPassword({
      email: payload.data.email
    })

    if (response.data !== undefined) {
      toast.add({
        title: 'Yêu cầu đã được gửi',
        description: 'Vui lòng kiểm tra hòm thư email của bạn để nhận link đặt lại mật khẩu',
        color: 'success',
        duration: 8_000
      })
    }
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorResponse = (error as any)?.data
    toast.add({
      title: 'Gửi yêu cầu thất bại',
      description: errorResponse?.error?.message || 'Email không tồn tại trong hệ thống. Vui lòng kiểm tra lại',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

async function onSubmitPhone(
  payload: FormSubmitEvent<ForgotPasswordPhoneSchema>
) {
  isLoading.value = true
  try {
    phoneForm.phone = payload.data.phone

    const response = await authService.forgotPassword({
      phone: payload.data.phone
    })

    if (response.data !== undefined) {
      toast.add({
        title: 'Yêu cầu đã được gửi',
        description: 'Vui lòng kiểm tra tin nhắn SMS của bạn để nhận mã OTP',
        color: 'success'
      })
    }
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorResponse = (error as any)?.data
    toast.add({
      title: 'Gửi yêu cầu thất bại',
      description: errorResponse?.error?.message || 'Số điện thoại không tồn tại trong hệ thống. Vui lòng kiểm tra lại',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}
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
          autocomplete="off"
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
              autocomplete="off"
            />
          </UFormField>

          <UButton
            type="submit"
            size="xl"
            class="w-full min-h-14 text-lg"
            block
            :loading="isLoading"
          >
            Gửi yêu cầu
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

    <!-- <AuthOtpModal
      v-model:open="showOTPModal"
      :contact-info="contactInfo"
      :contact-type="contactType"
      :loading="isLoading"
      @submit="onSubmitOTP"
      @resend="handleResendOTP"
    /> -->

    <!-- <AuthChangePasswordModal
      v-model:open="showChangePasswordModal"
      :loading="isLoading"
      @submit="onSubmitChangePassword"
    /> -->
  </div>
</template>
