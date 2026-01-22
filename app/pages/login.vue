<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

useSeoMeta({
  title: 'Đăng nhập',
  description: 'Đăng nhập vào tài khoản của bạn để tiếp tục',
  ogTitle: 'Đăng nhập',
  ogDescription: 'Đăng nhập vào tài khoản của bạn để tiếp tục'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const emailSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().regex(PASSWORD_REGEX, 'Mật khẩu không hợp lệ.')
})

const emailForm = reactive({
  email: '',
  password: ''
})

async function onSubmitEmail(
  payload: FormSubmitEvent<z.output<typeof emailSchema>>
) {
  try {
    await authStore.login({
      email: payload.data.email,
      password: payload.data.password
    })

    toast.add({
      title: 'Đăng nhập thành công',
      description: 'Bạn đã đăng nhập thành công',
      color: 'success'
    })

    // Lấy redirect path từ query parameter
    const redirectPath = route.query.redirect as string

    // Redirect về trang trước đó hoặc trang chủ
    await router.push(redirectPath || '/')
  } catch {
    toast.add({
      title: 'Đăng nhập thất bại',
      description: 'Tài khoản hoặc mật khẩu không đúng',
      color: 'error'
    })
  }
}
</script>

<template>
  <div class="space-y-8 w-full">
    <div class="space-y-4 text-center">
      <AppLogo class="mx-auto h-auto w-76" />

      <h1
        class="mt-12 text-4xl font-bold md:text-5xl dark:text-white text-primary"
      >
        Đăng nhập
      </h1>

      <p class="text-base md:text-lg text-default">
        Chào mừng bạn đến với Học viện MEDUNI
      </p>
    </div>

    <UForm
      :schema="emailSchema"
      :state="emailForm"
      class="flex flex-col flex-1 gap-4"
      :disabled="authStore.isLoading"
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
          autocomplete="none"
        />
      </UFormField>
      <UFormField
        label="Mật khẩu"
        name="password"
      >
        <SharedInputPassword
          v-model="emailForm.password"
          class="w-full"
          size="xl"
          placeholder="Nhập mật khẩu"
          autocomplete="off"
        />
      </UFormField>

      <UButton
        type="submit"
        size="xl"
        class="w-full text-lg min-h-14"
        block
        :loading="authStore.isLoading"
      >
        Đăng nhập
      </UButton>
    </UForm>

    <div class="space-y-3 text-center">
      <ULink
        to="/forgot-password"
        class="font-semibold text-primary animate-link-underline"
      >Quên mật khẩu?</ULink>
      <p class="text-default">
        Bạn chưa có tài khoản?
        <ULink
          to="/signup"
          class="font-semibold text-primary animate-link-underline"
        >Đăng ký</ULink>
      </p>
    </div>
  </div>
</template>
