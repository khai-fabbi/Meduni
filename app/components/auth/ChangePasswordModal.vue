<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import IconLock from '~/assets/icons/lock.svg'
import {
  changePasswordSchema,
  type ChangePasswordSchema
} from '~/utils/schema/forgot-password'

defineProps<{
  loading: boolean
  dismissible?: boolean
}>()

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{
  submit: [payload: FormSubmitEvent<ChangePasswordSchema>]
}>()

const changePasswordForm = reactive({
  newPassword: '',
  confirmPassword: ''
})

function handleSubmit(payload: FormSubmitEvent<ChangePasswordSchema>) {
  emit('submit', payload)
}

watch(open, (newValue) => {
  if (!newValue) {
    changePasswordForm.newPassword = ''
    changePasswordForm.confirmPassword = ''
  }
})

// TODO: Add password strength checker
function checkStrength(str: string) {
  const requirements = [
    { regex: /.{8,}/, text: 'Ít nhất 8 ký tự' },
    { regex: /\d/, text: 'Ít nhất 1 số' },
    { regex: /[a-z]/, text: 'Ít nhất 1 chữ thường' },
    { regex: /[A-Z]/, text: 'Ít nhất 1 chữ hoa' }
  ]

  return requirements.map(req => ({
    met: req.regex.test(str),
    text: req.text
  }))
}

const strength = computed(() => checkStrength(changePasswordForm.newPassword))
const score = computed(() => strength.value.filter(req => req.met).length)

const color = computed(() => {
  if (score.value === 0) return 'neutral'
  if (score.value <= 1) return 'error'
  if (score.value <= 2) return 'warning'
  if (score.value === 3) return 'warning'
  return 'success'
})
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      content: 'sm:max-w-lg text-center',
      header: 'hidden',
      footer: 'gap-6',
      overlay: 'bg-black/40 backdrop-blur-[2px]'
    }"
    :close="{
      class: 'hidden'
    }"
    title="Đổi mật khẩu"
    description="Đổi mật khẩu"
    :dismissible="dismissible"
  >
    <template #body>
      <div class="ring-10 ring-primary/10 rounded-full mx-auto w-fit my-8">
        <div
          class="flex size-13 justify-center items-center rounded-full bg-primary/20"
        >
          <IconLock class="size-8 animate-stroke-draw" />
        </div>
      </div>
      <div class="space-y-6">
        <div class="space-y-3">
          <h4 class="text-xl font-bold">
            Đổi mật khẩu
          </h4>
          <p class="">
            Vui lòng nhập lại mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        <UForm
          :schema="changePasswordSchema"
          :state="changePasswordForm"
          class="space-y-4 text-left"
          :disabled="loading"
          @submit="handleSubmit"
        >
          <UFormField
            label="Mật khẩu mới"
            name="newPassword"
          >
            <SharedInputPassword
              v-model="changePasswordForm.newPassword"
              class="w-full"
              size="xl"
              placeholder="Mật khẩu mới"
            />
          </UFormField>

          <UFormField
            label="Mật lại mật khẩu mới"
            name="confirmPassword"
          >
            <SharedInputPassword
              v-model="changePasswordForm.confirmPassword"
              class="w-full"
              size="xl"
              placeholder="Nhập lại mật khẩu mới"
            />
          </UFormField>

          <div class="space-y-3">
            <UProgress
              :color="color"
              :model-value="score"
              :max="4"
              size="sm"
            />
            <p
              id="password-strength"
              class="text-sm font-medium"
            >
              Mật khẩu bao gồm:
            </p>
            <ul
              class="space-y-1.5"
              aria-label="Password requirements"
            >
              <li
                v-for="(req, index) in strength"
                :key="index"
                class="flex items-center gap-0.5"
                :class="req.met ? 'text-success' : 'text-neutral-600'"
              >
                <UIcon
                  :name="
                    req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'
                  "
                  class="size-4 shrink-0"
                />

                <span class="text-xs font-light">
                  {{ req.text }}
                  <span class="sr-only">
                    {{
                      req.met ? " - Requirement met" : " - Requirement not met"
                    }}
                  </span>
                </span>
              </li>
            </ul>
          </div>

          <div class="space-x-4 mt-4 md:mt-8 flex">
            <UButton
              variant="outline"
              class="w-full min-h-14 text-lg"
              size="xl"
              block
              type="button"
              :disabled="loading"
              @click="open = false"
            >
              Quay lại
            </UButton>
            <UButton
              type="submit"
              size="xl"
              class="w-full min-h-14 text-lg"
              block
              :disabled="loading"
              :loading="loading"
            >
              Xác nhận
            </UButton>
          </div>
        </UForm>
      </div>
    </template>
  </UModal>
</template>
