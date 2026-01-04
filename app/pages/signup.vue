<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { signupSchema, type SignupSchema } from '~/utils/schema/signup'
import SharedConfettiEffect from '~/components/shared/ConfettiEffect.vue'
import { authService } from '~/services/auth'
import type { RegisterRequest } from '~/types'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

useSeoMeta({
  title: 'Đăng ký',
  description: 'Tạo tài khoản mới để bắt đầu',
  ogTitle: 'Đăng ký',
  ogDescription: 'Tạo tài khoản mới để bắt đầu'
})

const toast = useToast()
const confettiRef = ref<InstanceType<typeof SharedConfettiEffect> | null>(null)

const form = useTemplateRef('form')

const signupForm = reactive({
  username: '',
  phone: '',
  email: '',
  password: '',
  confirm_password: '',
  invite_code: ''
})

const isLoading = ref(false)

async function onSubmit(payload: FormSubmitEvent<SignupSchema>) {
  try {
    isLoading.value = true

    // Gọi API register
    const country_number = '+84'
    const phoneTrimmed = payload.data.phone.trim()
    const phoneProcessed = phoneTrimmed.startsWith('0')
      ? phoneTrimmed.substring(1)
      : phoneTrimmed
    const phoneConverted = country_number + phoneProcessed

    const registerPayload: RegisterRequest = {
      username: payload.data.username.trim(),
      email: payload.data.email.toLowerCase(),
      phone: phoneConverted,
      password: payload.data.password,
      verify_email: true,
      country_number,
      invite_code: payload.data.invite_code?.trim() || undefined
    }

    const response = await authService.register(registerPayload)

    if (response.data) {
      toast.add({
        title: 'Đăng ký thành công',
        description: 'Vui lòng kiểm tra email để xác thực tài khoản',
        color: 'success'
      })

      nextTick(() => {
        confettiRef.value?.trigger()
      })
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    interface ErrorResponseType {
      error: {
        code: string
      }
    }
    interface ErrorInputResponse {
      error: {
        property: string
        error: string
      }[]
      error_type: string
    }
    const mappingFieldError: Record<string, string> = {
      username: 'Tên người dùng',
      phone: 'Số điện thoại',
      email: 'Email',
      password: 'Mật khẩu',
      invite_code: 'Mã giới thiệu'
    }
    const errorResponse = error.data as ErrorResponseType | ErrorInputResponse
    if ((errorResponse as ErrorInputResponse)?.error_type === ERROR_TYPE.INPUT_ERROR) {
      const errors = (errorResponse as ErrorInputResponse).error

      const errorMessages = errors.map((error) => {
        const field = mappingFieldError[error.property]
        if (field) {
          return { name: error.property, message: `${field} không hợp lệ` }
        }
        return null
      })
      console.log('errorMessages:', errorMessages)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form.value?.setErrors(errorMessages.filter(Boolean) as any)
    } else if ((errorResponse as ErrorResponseType).error?.code === REGISTER_ERROR_CODES.ERROR2_215) {
      toast.add({
        title: 'Đăng ký thất bại',
        description: 'Email đã được sử dụng',
        color: 'error'
      })
    } else if ((errorResponse as ErrorResponseType).error?.code === REGISTER_ERROR_CODES.ERROR2_216) {
      toast.add({
        title: 'Đăng ký thất bại',
        description: 'Số điện thoại đã được sử dụng',
        color: 'error'
      })
    } else {
      toast.add({
        title: 'Đăng ký thất bại',
        description: 'Vui lòng kiểm tra lại thông tin đăng ký',
        color: 'error'
      })
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="space-y-6 w-full h-full">
    <div class="space-y-4 text-center">
      <AppLogo class="mx-auto h-auto w-76" />

      <h1
        class="mt-8 text-4xl font-bold md:text-5xl dark:text-white text-primary"
      >
        Đăng ký
      </h1>

      <p class="text-base md:text-lg text-default">
        Bạn hãy điền đầy đủ thông tin bên dưới để tiến hành đăng ký!
      </p>
    </div>

    <UForm
      ref="form"
      :schema="signupSchema"
      :state="signupForm"
      class="flex flex-col flex-1 gap-3"
      :disabled="isLoading"
      autocomplete="off"
      @submit="onSubmit"
    >
      <UFormField
        label="Họ và tên"
        name="username"
        required
      >
        <UInput
          v-model="signupForm.username"
          class="w-full"
          placeholder="Nhập họ và tên của bạn"
          size="xl"
          icon="i-lucide-user"
          autocomplete="off"
        />
      </UFormField>

      <UFormField
        label="Số điện thoại"
        name="phone"
        required
      >
        <UInput
          v-model="signupForm.phone"
          class="w-full"
          placeholder="Nhập số điện thoại của bạn"
          size="xl"
          icon="i-lucide-phone"
          autocomplete="off"
        />
      </UFormField>

      <UFormField
        label="Email"
        name="email"
        required
      >
        <UInput
          v-model="signupForm.email"
          class="w-full"
          placeholder="Nhập email của bạn"
          size="xl"
          icon="i-lucide-mail"
          autocomplete="off"
        />
      </UFormField>

      <UFormField
        label="Mật khẩu"
        name="password"
        required
        help="Mật khẩu phải có ít nhất 8 ký tự, 1 chữ thường và 1 số."
      >
        <SharedInputPassword
          v-model="signupForm.password"
          class="w-full"
          size="xl"
          placeholder="Nhập mật khẩu"
          autocomplete="new-password"
          maxlength="20"
        />
      </UFormField>

      <UFormField
        label="Nhập lại mật khẩu"
        name="confirmPassword"
        required
      >
        <SharedInputPassword
          v-model="signupForm.confirm_password"
          class="w-full"
          size="xl"
          placeholder="Nhập lại mật khẩu"
          autocomplete="new-password"
          maxlength="20"
        />
      </UFormField>

      <UFormField
        label="Mã giới thiệu"
        name="referralCode"
      >
        <UInput
          v-model="signupForm.invite_code"
          class="w-full"
          placeholder="Nhập mã giới thiệu (nếu có)"
          size="xl"
          icon="i-lucide-gift"
          autocomplete="off"
        />
      </UFormField>

      <UButton
        type="submit"
        size="xl"
        class="mt-2 w-full text-lg min-h-14"
        block
        :disabled="isLoading"
        :loading="isLoading"
      >
        Đăng ký
      </UButton>
    </UForm>

    <div class="block text-center md:hidden">
      <p class="text-default">
        Đã có tài khoản?
        <ULink
          to="/login"
          class="font-semibold text-primary animate-link-underline"
        >Đăng nhập</ULink>
      </p>
    </div>

    <SharedConfettiEffect
      ref="confettiRef"
      :auto-trigger="false"
    />
  </div>
</template>
