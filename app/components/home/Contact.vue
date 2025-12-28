<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { contactSchema, type ContactSchema } from '~/utils/schema/contact'
import { contactService } from '~/services/contact'

const isLoading = ref(false)
const toast = useToast()

const CONTACT_SOCIALS = [
  { icon: 'i-simple-icons-facebook' },
  { icon: 'i-simple-icons-youtube' },
  { icon: 'i-simple-icons-android' },
  { icon: 'i-simple-icons-apple' }
]

const contactForm = reactive<ContactSchema>({
  fullName: '',
  phone: '',
  email: '',
  requirement: '',
  message: ''
})

async function onSubmit(payload: FormSubmitEvent<ContactSchema>) {
  try {
    isLoading.value = true

    // Map form data to API format
    const apiPayload = {
      name: payload.data.fullName,
      phone: payload.data.phone,
      email: payload.data.email || '',
      message: `Yêu cầu: ${payload.data.requirement}\n\nLời nhắn: ${payload.data.message}`
    }

    await contactService.postContact(apiPayload)

    toast.add({
      title: 'Gửi thành công',
      description: 'Chúng tôi đã nhận được thông tin liên hệ của bạn. Chúng tôi sẽ phản hồi sớm nhất có thể.',
      color: 'success'
    })

    // Reset form
    contactForm.fullName = ''
    contactForm.phone = ''
    contactForm.email = ''
    contactForm.requirement = ''
    contactForm.message = ''
  } catch (error) {
    toast.add({
      title: 'Gửi thất bại',
      description: error instanceof Error ? error.message : 'Có lỗi xảy ra khi gửi thông tin liên hệ',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UContainer class="py-8 space-y-7.5 md:py-8 mb-6">
    <Heading
      variant="h3"
      class="text-center"
    >
      Thông tin liên hệ
    </Heading>
    <div class="max-w-7xl w-full mx-auto flex gap-4 flex-col-reverse md:flex-row items-center overflow-hidden">
      <!-- left section -->
      <div class="rounded-lg bg-white p-4 md:px-7.5 md:py-5 md:max-w-[808px]">
        <div class="md:max-w-5/6">
          <Heading variant="h4">
            Liên hệ ngay với chúng tôi
          </Heading>
          <p class="mt-1">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn trên hành trình khám phá và làm chủ AI. Đừng ngần ngại liên hệ để được tư vấn chi tiết về các khóa học, chương trình đào tạo hoặc các giải pháp tùy chỉnh phù hợp với nhu cầu của bạn.
          </p>

          <!-- Form Contact -->
          <UForm
            :schema="contactSchema"
            :state="contactForm"
            class="flex flex-col gap-4 mt-6"
            :disabled="isLoading"
            @submit="onSubmit"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField
                label="Họ và tên"
                name="fullName"
                required
              >
                <UInput
                  v-model="contactForm.fullName"
                  placeholder="Nhập họ và tên"
                  :disabled="isLoading"
                  size="xl"
                  icon="i-lucide-user"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="Số điện thoại"
                name="phone"
                required
              >
                <UInput
                  v-model="contactForm.phone"
                  placeholder="Nhập số điện thoại"
                  :disabled="isLoading"
                  size="xl"
                  icon="i-lucide-phone"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="Email"
                name="email"
              >
                <UInput
                  v-model="contactForm.email"
                  type="email"
                  placeholder="Nhập email (không bắt buộc)"
                  :disabled="isLoading"
                  size="xl"
                  icon="i-lucide-mail"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="Yêu cầu"
                name="requirement"
                required
              >
                <UInput
                  v-model="contactForm.requirement"
                  placeholder="Nhập yêu cầu của bạn"
                  :disabled="isLoading"
                  size="xl"
                  icon="i-lucide-file-text"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="Lời nhắn"
                name="message"
                required
                class="md:col-span-2"
              >
                <UTextarea
                  v-model="contactForm.message"
                  placeholder="Nhập lời nhắn của bạn"
                  :disabled="isLoading"
                  size="xl"
                  class="w-full"
                  :rows="5"
                />
              </UFormField>
            </div>

            <div class="flex justify-center pt-4">
              <UButton
                type="submit"
                color="secondary"
                size="xl"
                :loading="isLoading"
                :disabled="isLoading"
                icon="i-lucide-send"
                block
                class="min-h-12 max-w-[190px] rounded-full bg-gradient-to-b from-secondary-500 to-secondary-700"
              >
                Gửi thông tin
              </UButton>
            </div>
          </UForm>
        </div>
      </div>

      <!-- right section -->
      <div class="bg-contact-info w-full md:max-w-[390px] rounded-lg h-fit text-white p-4 md:px-7.5 md:py-4 md:-ml-32">
        <div class="space-y-2">
          <Heading variant="h4">
            Thông tin hỗ trợ
          </Heading>
          <p class="text-base md:text-lg">
            Chúng thôi luôn ở đây để hỗ trợ bạn
          </p>
        </div>

        <!-- contact info -->
        <div class="mt-6 space-y-4">
          <div class="flex items-center gap-3 p-3 border border-neutral-200 bg-white/10 rounded-lg backdrop-blur-sm">
            <UIcon
              name="i-lucide-phone"
              class="w-6 h-6 shrink-0"
            />
            <div>
              <p class="text-base md:text-lg font-semibold">
                Số điện thoại
              </p>
              <p class="text-base md:text-lg">
                1900 1234
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 p-3 border border-neutral-200 bg-white/10 rounded-lg backdrop-blur-sm">
            <UIcon
              name="i-lucide-mail"
              class="w-6 h-6 shrink-0"
            />
            <div>
              <p class="text-base md:text-lg font-semibold">
                Email
              </p>
              <p class="text-base md:text-lg">
                support@example.com
              </p>
            </div>
          </div>

          <USeparator class="my-6 border-neutral-100" />
          <div class="space-y-1">
            <p class="text-base md:text-lg font-semibold">
              Theo dõi chúng tôi
            </p>
            <div class="flex items-center gap-3">
              <NuxtLink
                v-for="(item, index) in CONTACT_SOCIALS"
                :key="index"
                to="#"
              >
                <UButton
                  :icon="item.icon"
                  variant="ghost"
                  class="text-white"
                  :ui="{
                    leadingIcon: 'size-6'
                  }"
                />
                <!-- <UIcon
                  :name="item.icon"
                  class="size-6"
                /> -->
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<style scoped>
.bg-contact-info {
  background-image: url('/home/learn-with-global-experts.jpg');
  background-size: cover;
  background-position: center;
  box-shadow: inset 0 0 0 2000px rgba(27, 143, 243, 0.3);
}
</style>
