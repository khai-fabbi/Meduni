<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, TabsItem } from '@nuxt/ui'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Login',
  description: 'Login to your account to continue'
})

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const emailSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().regex(PASSWORD_REGEX, 'Mật khẩu không hợp lệ')
})

const phoneSchema = z.object({
  phone: z.string().regex(/^[0-9]{8,11}$/, 'Số điện thoại không hợp lệ'),
  password: z.string().regex(PASSWORD_REGEX, 'Mật khẩu không hợp lệ')
})

const loginItems = [
  {
    label: 'Số điện thoại',
    value: LoginType.PHONE,
    icon: 'i-lucide-phone',
    slot: 'phone' as const
  },
  {
    label: 'Email',
    value: LoginType.EMAIL,
    icon: 'i-lucide-mail',
    slot: 'email' as const
  }
] satisfies TabsItem[]

const loginType = ref<LoginType>(LoginType.PHONE)

const emailForm = reactive({
  email: '',
  password: ''
})

const phoneForm = reactive({
  phone: '',
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

    await router.push('/')
  } catch {
    toast.add({
      title: 'Đăng nhập thất bại',
      description: 'Tài khoản hoặc mật khẩu không đúng',
      color: 'error'
    })
  }
}

async function onSubmitPhone(
  payload: FormSubmitEvent<z.output<typeof phoneSchema>>
) {
  try {
    await authStore.login({
      phone: payload.data.phone,
      password: payload.data.password
    })

    toast.add({
      title: 'Đăng nhập thành công',
      description: 'Bạn đã đăng nhập thành công',
      color: 'success'
    })

    await router.push('/')
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
  <div class="w-full space-y-8">
    <div class="text-center space-y-4">
      <AppLogo class="w-76 h-auto mx-auto" />

      <h1
        class="mt-12 md:text-5xl text-4xl font-bold dark:text-white text-primary"
      >
        Đăng nhập
      </h1>

      <p class="md:text-lg text-base text-default">
        Chào mừng bạn đến với Học viện MEDUNI
      </p>
    </div>

    <UTabs
      v-model="loginType"
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
          :schema="phoneSchema"
          :state="phoneForm"
          class="flex flex-col gap-4 flex-1"
          :disabled="authStore.isLoading"
          autocomplete="off"
          @submit="onSubmitPhone"
        >
          <UFormField
            label="Số điện thoại"
            name="phone"
            placeholder="Nhập số điện thoại của bạn"
          >
            <UInput
              v-model="phoneForm.phone"
              class="w-full"
              placeholder="Nhập số điện thoại của bạn"
              size="xl"
              icon="i-lucide-phone"
              autocomplete="off"
            />
          </UFormField>

          <UFormField
            label="Mật khẩu"
            name="password"
          >
            <SharedInputPassword
              v-model="phoneForm.password"
              class="w-full"
              size="xl"
              placeholder="Nhập mật khẩu"
              autocomplete="off"
            />
          </UFormField>

          <UButton
            type="submit"
            size="xl"
            class="w-full min-h-14 text-lg"
            block
            :loading="authStore.isLoading"
          >
            Đăng nhập
          </UButton>
        </UForm>
      </template>

      <template #email>
        <UForm
          :schema="emailSchema"
          :state="emailForm"
          class="flex flex-col gap-4 flex-1"
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
            <UInput
              v-model="emailForm.password"
              class="w-full"
              size="xl"
              type="password"
              placeholder="Nhập mật khẩu"
              autocomplete="off"
            />
          </UFormField>

          <UButton
            type="submit"
            size="xl"
            class="w-full min-h-14 text-lg"
            block
            :loading="authStore.isLoading"
          >
            Đăng nhập
          </UButton>
        </UForm>
      </template>
    </UTabs>

    <div class="text-center space-y-3">
      <ULink
        to="/forgot-password"
        class="text-primary font-semibold animate-link-underline"
      >Quên mật khẩu?</ULink>
      <p class="text-default">
        Bạn chưa có tài khoản?
        <ULink
          to="/signup"
          class="text-primary font-semibold animate-link-underline"
        >Đăng ký</ULink>
      </p>
    </div>
  </div>
</template>
