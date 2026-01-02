<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { contactSchema, type ContactSchema } from '~/utils/schema/contact'
import { contactService, type ContactRequest } from '~/services/contact'

const isLoading = ref(false)
const toast = useToast()

// Cookie để chống spam - thời hạn 5 phút (300 giây)
const contactSubmitCookie = useCookie('contact_form_submitted', {
  maxAge: 300, // 5 phút
  sameSite: 'strict',
  secure: true
})

const CONTACT_SOCIALS = [
  { icon: 'i-simple-icons-facebook' },
  { icon: 'i-simple-icons-youtube' },
  { icon: 'i-simple-icons-android' },
  { icon: 'i-simple-icons-apple' }
]

const CONTACT_REASON_OPTIONS = [
  {
    value: 1,
    label: 'Cần liên hệ phòng kinh doanh'
  },
  {
    value: 2,
    label: 'Cần liên hệ phòng kế toán'
  },
  {
    value: 3,
    label: 'Cần liên hệ phòng đào tạo'
  },
  {
    value: 4,
    label: 'Cần liên hệ chuyên gia'
  },
  {
    value: 5,
    label: 'Cần tư vấn về chương trình'
  },
  {
    value: 6,
    label: 'Khác...'
  }
]

const contactForm = reactive<ContactSchema>({
  fullName: '',
  phone: '',
  email: '',
  reason: 6,
  message: ''
})

async function onSubmit(payload: FormSubmitEvent<ContactSchema>) {
  // Kiểm tra cookie chống spam
  if (contactSubmitCookie.value) {
    toast.add({
      title: 'Vui lòng đợi',
      description: 'Bạn đã gửi form liên hệ gần đây. Vui lòng đợi 5 phút trước khi gửi lại.',
      color: 'warning'
    })
    return
  }

  isLoading.value = true
  try {
    // Gọi API register
    const country_number = '+84'
    const phoneTrimmed = payload.data.phone.trim()
    const phoneProcessed = phoneTrimmed.startsWith('0')
      ? phoneTrimmed.substring(1)
      : phoneTrimmed
    const phoneConverted = country_number + phoneProcessed
    const contactPayload: ContactRequest = {
      full_name: payload.data.fullName,
      phone: phoneConverted,
      email: payload.data.email ?? '',
      reason: payload.data.reason ?? 6,
      message: payload.data.message,
      contact_type: 'general',
      country_number
    }

    await contactService.postContact(contactPayload)

    // Lưu cookie sau khi submit thành công - thời hạn 5 phút
    contactSubmitCookie.value = 'submitted'

    toast.add({
      title: 'Gửi thành công',
      description: 'Chúng tôi đã nhận được thông tin liên hệ của bạn. Chúng tôi sẽ phản hồi sớm nhất có thể.',
      color: 'success'
    })

    // Reset form
    contactForm.fullName = ''
    contactForm.phone = ''
    contactForm.email = ''
    contactForm.reason = undefined
    contactForm.message = ''
  } catch {
    toast.add({
      title: 'Gửi thất bại',
      description: 'Có lỗi xảy ra khi gửi thông tin liên hệ',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UContainer class="py-8 mb-6 space-y-7.5 md:py-8">
    <Heading
      variant="h3"
      class="text-center"
    >
      Thông tin liên hệ
    </Heading>
    <div class="flex overflow-hidden flex-col-reverse gap-4 items-center mx-auto w-full max-w-7xl md:flex-row">
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
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                name="reason"
                required
              >
                <USelect
                  v-model="contactForm.reason"
                  :items="CONTACT_REASON_OPTIONS"
                  placeholder="Chọn yêu cầu"
                  :disabled="isLoading"
                  size="xl"
                  class="w-full min-h-12"
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
          <div class="flex gap-3 items-center p-3 rounded-lg border backdrop-blur-sm border-neutral-200 bg-white/10">
            <UIcon
              name="i-lucide-phone"
              class="w-6 h-6 shrink-0"
            />
            <div>
              <p class="text-base font-semibold md:text-lg">
                Số điện thoại
              </p>
              <p class="text-base md:text-lg">
                1900 1234
              </p>
            </div>
          </div>

          <div class="flex gap-3 items-center p-3 rounded-lg border backdrop-blur-sm border-neutral-200 bg-white/10">
            <UIcon
              name="i-lucide-mail"
              class="w-6 h-6 shrink-0"
            />
            <div>
              <p class="text-base font-semibold md:text-lg">
                Email
              </p>
              <p class="text-base md:text-lg">
                support@example.com
              </p>
            </div>
          </div>

          <USeparator class="my-6 border-neutral-100" />
          <div class="space-y-1">
            <p class="text-base font-semibold md:text-lg">
              Theo dõi chúng tôi
            </p>
            <div class="flex gap-3 items-center">
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
