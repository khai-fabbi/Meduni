<script setup lang="ts">
import LogoMeduni from '~/assets/icons/logo-meduni.svg'

const toast = useToast()
const footerBottomBg = '#00294C'

const email = ref('')
const loading = ref(false)

const quickLinks = [
  { label: 'Trang chủ' },
  { label: 'Về chúng tôi' },
  { label: 'Danh sách chương trình' },
  { label: 'Chương trình của tôi' },
  { label: 'Liên hệ' }
]

const aboutLinks = [
  { label: 'Điều khoản sử dụng' },
  { label: 'Chính sách riêng tư' },
  { label: 'Chính sách thanh toán' },
  { label: 'Hồ sơ năng lực' }
]

const socials = [
  { icon: 'i-simple-icons-facebook' },
  { icon: 'i-simple-icons-youtube' },
  { icon: 'i-simple-icons-android' },
  { icon: 'i-simple-icons-apple' }
]

function onSubmit() {
  loading.value = true

  toast.add({
    title: 'Subscribed!',
    description: 'You\'ve been subscribed to our newsletter.'
  })
}
</script>

<template>
  <div
    class="bg-cover bg-no-repeat text-white rounded-t-4xl"
    style="background-image: url('/bg-footer.png')"
  >
    <UContainer class="py-10">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
        <div class="space-y-4 max-w-xl">
          <LogoMeduni class="w-48 h-auto" />
          <p class="text-base leading-6">
            Đào tạo AI ứng dụng thực tiễn, giúp cá nhân và tổ chức làm chủ công nghệ, đổi mới sáng tạo và thúc đẩy chuyển đổi số quốc gia.
          </p>
          <div class="space-y-2 text-base leading-6">
            <div class="flex items-start gap-2">
              <UIcon
                name="i-lucide-map-pin"
                :size="24"
                class="shrink-0 mt-1"
              />
              <span>Tầng 9, Viện Điện tử, Tin học, Tự động hoá, Bộ Công Thương, 156A Quán Thánh, Ba Đình, Hà Nội</span>
            </div>
            <div class="flex items-start gap-2">
              <UIcon
                name="i-lucide-map-pin"
                :size="24"
                class="shrink-0 mt-1"
              />
              <span>Tầng 20, TT hỗ trợ Khởi nghiệp Sáng tạo Quốc gia, Bộ Khoa học Công Nghệ, 115 Trần Duy Hưng, Yên Hoà, Hà Nội</span>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-semibold">
            Liên kết nhanh
          </h3>
          <div class="space-y-3">
            <p
              v-for="item in quickLinks"
              :key="item.label"
              class="text-base cursor-pointer hover:text-primary-100 transition-colors"
            >
              {{ item.label }}
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-semibold">
            Về chúng tôi
          </h3>
          <div class="space-y-3">
            <p
              v-for="item in aboutLinks"
              :key="item.label"
              class="text-base cursor-pointer hover:text-primary-100 transition-colors"
            >
              {{ item.label }}
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-semibold">
            Đăng ký nhận bản tin
          </h3>
          <p class="text-base leading-6">
            Đăng ký Học viện của chúng tôi để nhận thêm các bản cập nhật trong tương lai
          </p>
          <form
            class="space-y-4"
            @submit.prevent="onSubmit"
          >
            <UInput
              v-model="email"
              type="email"
              placeholder="Nhập Email của bạn"
              class="w-full bg-white/90 text-neutral-900 rounded-[0.75rem]"
            >
              <template #trailing>
                <button
                  type="submit"
                  class="flex items-center justify-center"
                  :disabled="loading"
                >
                  <UIcon
                    name="i-lucide-send"
                    class="size-5 text-primary"
                  />
                </button>
              </template>
            </UInput>
          </form>
          <div class="flex items-center gap-4">
            <a
              v-for="(item, index) in socials"
              :key="index"
              class="flex items-center justify-center size-8 rounded-full bg-white text-primary transition-colors"
              href="#"
            >
              <UIcon
                :name="item.icon"
                class="size-4"
              />
            </a>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
  <div
    class="text-neutral-200 text-center text-sm py-3"
    :style="{ backgroundColor: footerBottomBg }"
  >
    © 2023 Học viện MEDUNI. All rights reserved. MST: 0111091161 - Cấp tại Sở tài chính thành phố Hà Nội
  </div>
</template>
