<script setup lang="ts">
import type { FormSubmitEvent, BreadcrumbItem } from '@nuxt/ui'
import {
  profileSchema,
  type ChangePasswordWithOldSchema,
  type ProfileSchema
} from '~/utils/schema/profile'

useSeoMeta({
  title: 'Thông tin cá nhân',
  description: 'Thông tin cá nhân'
})

const items = ref<BreadcrumbItem[]>([
  {
    label: 'Trang chủ',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: 'Hồ sơ',
    to: '/profile'
  }
])

definePageMeta({
  layout: 'profile'
})

const countries = ['Việt Nam']
const genders = [
  { label: 'Nam', value: Gender.Male },
  { label: 'Nữ', value: Gender.Female }
]

const isEditing = ref(false)
const isLoading = ref(false)
const isChangingPassword = ref(false)
const changePasswordModalOpen = ref(false)
const toast = useToast()

const profileForm = reactive<ProfileSchema>({
  goal: 'Nâng cao kiến thức về AI trong Y tế và ứng dụng vào thực tế',
  fullName: 'Vũ Hữu Đồng',
  dateOfBirth: '15/05/1996',
  gender: Gender.Male,
  phone: '0901234567',
  email: 'vuhudong@example.com',
  country: 'Việt Nam',
  province: 'TP. Hà Nội',
  district: 'Quận Cầu Giấy',
  address: '123 Đường Phố Xuân Thủy, Phường Xuân Thủy, Quận Cầu Giấy, Hà Nội'
})

const avatar = ref('https://api.dicebear.com/7.x/avataaars/svg?seed=John')

const toggleEdit = () => {
  isEditing.value = !isEditing.value
}

async function onSubmit(payload: FormSubmitEvent<ProfileSchema>) {
  try {
    isLoading.value = true
    console.log('Submitted', payload.data)

    await new Promise(resolve => setTimeout(resolve, 1000))

    toast.add({
      title: 'Cập nhật thành công',
      description: 'Thông tin cá nhân đã được cập nhật thành công',
      color: 'success'
    })

    isEditing.value = false
  } catch (error) {
    toast.add({
      title: 'Cập nhật thất bại',
      description: error instanceof Error ? error.message : 'Có lỗi xảy ra',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

async function onChangePassword(
  payload: FormSubmitEvent<ChangePasswordWithOldSchema>
) {
  try {
    isChangingPassword.value = true
    console.log('Change password', payload.data)

    await new Promise(resolve => setTimeout(resolve, 1000))

    toast.add({
      title: 'Đổi mật khẩu thành công',
      description: 'Mật khẩu của bạn đã được thay đổi thành công',
      color: 'success'
    })

    changePasswordModalOpen.value = false
  } catch (error) {
    toast.add({
      title: 'Đổi mật khẩu thất bại',
      description: error instanceof Error ? error.message : 'Có lỗi xảy ra',
      color: 'error'
    })
  } finally {
    isChangingPassword.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <UBreadcrumb
      :items="items"
      class="md:hidden mb-0"
    />
    <div class="bg-white rounded-sm p-4 md:p-7.5">
      <div class="flex items-center justify-between mb-6 flex-wrap gap-2">
        <Heading
          variant="h3"
          class="shrink-0"
        >
          Thông tin cá nhân
        </Heading>
        <div class="flex items-center gap-3">
          <UButton
            v-if="!isEditing"
            color="primary"
            icon="i-lucide-edit"
            @click="toggleEdit"
          >
            Chỉnh sửa
          </UButton>
          <UButton
            color="primary"
            variant="subtle"
            icon="i-lucide-lock"
            @click="changePasswordModalOpen = true"
          >
            Đổi mật khẩu
          </UButton>
        </div>
      </div>

      <div class="space-y-6">
        <div class="flex items-center gap-6">
          <UAvatar
            :src="avatar"
            size="xl"
          />
          <div>
            <h2 class="text-xl font-semibold">
              {{ profileForm.fullName }}
            </h2>
            <p class="text-gray-500">
              {{ profileForm.email }}
            </p>
          </div>
        </div>

        <UForm
          :schema="profileSchema"
          :state="profileForm"
          class="flex flex-col gap-4"
          :disabled="!isEditing || isLoading"
          @submit="onSubmit"
        >
          <UFormField
            label="Mục tiêu"
            name="goal"
          >
            <UTextarea
              v-model="profileForm.goal"
              placeholder="Nhập mục tiêu của bạn"
              :disabled="!isEditing"
              size="xl"
              class="w-full"
            />
          </UFormField>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField
              label="Họ và tên"
              name="fullName"
              required
            >
              <UInput
                v-model="profileForm.fullName"
                placeholder="Nhập họ và tên"
                :disabled="!isEditing"
                size="xl"
                icon="i-lucide-user"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Ngày sinh"
              name="dateOfBirth"
            >
              <UInput
                v-model="profileForm.dateOfBirth"
                placeholder="DD/MM/YYYY"
                :disabled="!isEditing"
                size="xl"
                icon="i-lucide-calendar"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Giới tính"
              name="gender"
            >
              <USelect
                v-model="profileForm.gender"
                :items="genders"
                :disabled="!isEditing"
                size="xl"
                class="w-full min-h-12"
              />
            </UFormField>

            <UFormField
              label="Số điện thoại"
              name="phone"
            >
              <UInput
                v-model="profileForm.phone"
                placeholder="Nhập số điện thoại"
                :disabled="!isEditing"
                size="xl"
                icon="i-lucide-phone"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Email"
              name="email"
              required
            >
              <UInput
                v-model="profileForm.email"
                type="email"
                :disabled="true"
                size="xl"
                icon="i-lucide-mail"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Quốc gia"
              name="country"
            >
              <USelect
                v-model="profileForm.country"
                :items="countries"
                :disabled="true"
                size="xl"
                class="w-full min-h-12"
              />
            </UFormField>

            <UFormField
              label="Tỉnh (thành phố)"
              name="province"
            >
              <UInput
                v-model="profileForm.province"
                placeholder="Nhập tỉnh (thành phố)"
                :disabled="!isEditing"
                size="xl"
                icon="i-lucide-map-pin"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Quận (huyện)"
              name="district"
            >
              <UInput
                v-model="profileForm.district"
                placeholder="Nhập quận (huyện)"
                :disabled="!isEditing"
                size="xl"
                icon="i-lucide-map-pin"
                class="w-full"
              />
            </UFormField>
          </div>

          <UFormField
            label="Địa chỉ"
            name="address"
          >
            <UInput
              v-model="profileForm.address"
              placeholder="Nhập địa chỉ chi tiết"
              :disabled="!isEditing"
              size="xl"
              icon="i-lucide-map-pin"
              class="w-full"
            />
          </UFormField>

          <div
            v-if="isEditing"
            class="flex gap-3 pt-4"
          >
            <UButton
              type="submit"
              color="primary"
              size="xl"
              :loading="isLoading"
              :disabled="isLoading"
              icon="i-lucide-check"
              class="min-h-12"
            >
              Lưu thay đổi
            </UButton>
            <UButton
              type="button"
              color="neutral"
              variant="outline"
              size="xl"
              :disabled="isLoading"
              class="min-h-12"
              @click="toggleEdit"
            >
              Quay lại
            </UButton>
          </div>
        </UForm>
      </div>

      <ProfileChangePasswordModal
        v-model:open="changePasswordModalOpen"
        :loading="isChangingPassword"
        @submit="onChangePassword"
      />
    </div>
  </div>
</template>
