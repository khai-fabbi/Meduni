<script setup lang="ts">
import type { FormSubmitEvent, BreadcrumbItem } from '@nuxt/ui'
import {
  profileSchema,
  type ChangePasswordWithOldSchema,
  type ProfileSchema
} from '~/utils/schema/profile'
import { userService } from '~/services/user'
import { getAvatarUrl } from '~/utils/helpers'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { CalendarDate } from '@internationalized/date'

dayjs.extend(customParseFormat)

interface CountryApiResponse {
  label: string
  id: string
  label_local?: string
  dial_code?: string
  provinces?: Array<{
    province_code: string
    province_name: string
    districts?: Array<{
      district_code: string
      district_name: string
    }>
  }>
}

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
  layout: 'profile',
  middleware: 'auth'
})

interface CountryOption {
  label: string
  value: string
}

const countries = ref<CountryOption[]>([])
const provincesMap = ref<Map<string, string>>(new Map())
const districtsMap = ref<Map<string, string>>(new Map())

const genders = [
  { label: 'Nam', value: Gender.Male },
  { label: 'Nữ', value: Gender.Female }
]

const isEditing = ref(false)
const isLoading = ref(false)
const isFetching = ref(false)
const isChangingPassword = ref(false)
const changePasswordModalOpen = ref(false)
const toast = useToast()

const profileForm = reactive<ProfileSchema>({
  goal: '',
  fullName: '',
  dateOfBirth: '',
  gender: undefined,
  phone: '',
  email: '',
  country: '',
  province: '',
  district: '',
  address: ''
})

const avatar = ref('')
const avatarInput = ref<HTMLInputElement | null>(null)
const originalFormData = ref<ProfileSchema | null>(null)
const currentUserId = ref<string>('')
const datePickerOpen = ref(false)
const isUploadingAvatar = ref(false)
const uploadedAvatarPath = ref<string>('')

const dateOfBirthCalendar = computed({
  get: () => {
    if (!profileForm.dateOfBirth) return null
    const date = dayjs(profileForm.dateOfBirth, 'DD/MM/YYYY', true)
    if (date.isValid()) {
      return new CalendarDate(date.year(), date.month() + 1, date.get('date'))
    }
    return null
  },
  set: (value: CalendarDate | null) => {
    if (value) {
      const dateObj = new Date(value.year, value.month - 1, value.day)
      const dayjsDate = dayjs(dateObj)
      if (dayjsDate.isValid()) {
        profileForm.dateOfBirth = dayjsDate.format('DD/MM/YYYY')
      }
    } else {
      profileForm.dateOfBirth = ''
    }
    datePickerOpen.value = false
  }
})

const countryDisplayName = computed(() => {
  if (!profileForm.country) return ''
  const country = countries.value.find(c => c.value === profileForm.country)
  return country?.label || profileForm.country
})

function triggerAvatarSelect() {
  if (!isEditing.value) return
  avatarInput.value?.click()
}

async function handleAvatarChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !isEditing.value) return

  // Hiển thị preview tạm ngay khi chọn file
  avatar.value = URL.createObjectURL(file)

  try {
    isUploadingAvatar.value = true

    // Upload file lên S3 và lấy key về
    const avatarKey = await userService.uploadAvatar(file)

    // Lưu key từ S3 để gửi khi submit form
    uploadedAvatarPath.value = avatarKey

    // Giữ preview tạm (URL.createObjectURL) để hiển thị ngay
    // Không cập nhật với URL từ S3 vì có thể chưa sẵn sàng
    // Preview sẽ được giữ cho đến khi submit form thành công

    toast.add({
      title: 'Upload thành công',
      description: 'Ảnh đại diện đã được cập nhật',
      color: 'success'
    })
  } catch (error) {
    console.error('Error uploading avatar:', error)
    // Giữ preview tạm nếu upload thất bại
    toast.add({
      title: 'Upload thất bại',
      description: 'Không thể upload ảnh đại diện. Vui lòng thử lại.',
      color: 'error'
    })
    // Xóa key nếu upload thất bại
    uploadedAvatarPath.value = ''
  } finally {
    isUploadingAvatar.value = false
    if (avatarInput.value) {
      avatarInput.value.value = ''
    }
  }
}

const toggleEdit = () => {
  if (isEditing.value) {
    if (originalFormData.value) {
      Object.assign(profileForm, originalFormData.value)
    }
    uploadedAvatarPath.value = ''
    if (avatarInput.value) {
      avatarInput.value.value = ''
    }
  } else {
    originalFormData.value = { ...profileForm }
  }
  isEditing.value = !isEditing.value
}

async function fetchUserInfo() {
  try {
    isFetching.value = true
    const response = await userService.getInfo()
    console.log(response)

    const userData = response.data

    currentUserId.value = userData.userId

    profileForm.fullName = userData.user_name || ''
    profileForm.email = userData.email || ''
    profileForm.phone = userData.phone || ''
    profileForm.address = userData.address || ''
    profileForm.goal = userData.user_target || ''

    if (userData.country) {
      profileForm.country = userData.country
    } else {
      profileForm.country = ''
    }

    if (userData.district) {
      const provinceName = provincesMap.value.get(userData.district)
      profileForm.province = provinceName || userData.district
    } else {
      profileForm.province = ''
    }

    if (userData.province) {
      const districtName = districtsMap.value.get(userData.province)
      profileForm.district = districtName || userData.province
    } else {
      profileForm.district = ''
    }

    if (userData.birthday) {
      const date = dayjs.unix(userData.birthday)
      if (date.isValid()) {
        profileForm.dateOfBirth = date.format('DD/MM/YYYY')
      }
    }

    if (userData.gender !== undefined && userData.gender !== null) {
      if (userData.gender === 0) {
        profileForm.gender = Gender.Female
      } else if (userData.gender === 1 || userData.gender === 2) {
        profileForm.gender = Gender.Male
      } else {
        profileForm.gender = undefined
      }
    } else {
      profileForm.gender = undefined
    }

    avatar.value = getAvatarUrl(userData.avatar)

    originalFormData.value = { ...profileForm }
  } catch (error) {
    console.error('Error fetching user info:', error)
    toast.add({
      title: 'Lỗi tải thông tin',
      description: 'Không thể tải thông tin người dùng',
      color: 'error'
    })
  } finally {
    isFetching.value = false
  }
}

async function fetchCountries() {
  try {
    const response = await userService.getCountries()
    const countriesData = response.data as unknown as CountryApiResponse[]

    countries.value = countriesData.map(country => ({
      label: country.label,
      value: country.id
    }))

    countriesData.forEach((country) => {
      if (country.provinces) {
        country.provinces.forEach((province) => {
          provincesMap.value.set(province.province_code, province.province_name)

          if (province.districts) {
            province.districts.forEach((district) => {
              districtsMap.value.set(district.district_code, district.district_name)
            })
          }
        })
      }
    })
  } catch (error) {
    console.error('Error fetching countries:', error)
  }
}

onMounted(async () => {
  await fetchCountries()
  await fetchUserInfo()
})

async function onSubmit(payload: FormSubmitEvent<ProfileSchema>) {
  try {
    isLoading.value = true

    let birthday: number | undefined
    if (payload.data.dateOfBirth) {
      const date = dayjs(payload.data.dateOfBirth, 'DD/MM/YYYY', true)
      if (date.isValid()) {
        birthday = date.unix()
      }
    }

    const countryCode = payload.data.country
    const provinceValue = payload.data.province
    const districtValue = payload.data.district

    let foundProvinceCode: string | undefined
    if (provinceValue) {
      for (const [code, name] of provincesMap.value.entries()) {
        if (name === provinceValue || code === provinceValue) {
          foundProvinceCode = code
          break
        }
      }
      if (!foundProvinceCode) {
        foundProvinceCode = provinceValue
      }
    }

    let foundDistrictCode: string | undefined
    if (districtValue) {
      for (const [code, name] of districtsMap.value.entries()) {
        if (name === districtValue || code === districtValue) {
          foundDistrictCode = code
          break
        }
      }
      if (!foundDistrictCode) {
        foundDistrictCode = districtValue
      }
    }

    const provinceCode = foundDistrictCode
    const districtCode = foundProvinceCode

    let genderValue: number | undefined
    if (payload.data.gender !== undefined) {
      if (payload.data.gender === Gender.Female) {
        genderValue = 0
      } else if (payload.data.gender === Gender.Male) {
        genderValue = 1
      }
    }

    const updatePayload = {
      user_id: currentUserId.value,
      user_name: payload.data.fullName,
      phone: payload.data.phone,
      gender: genderValue,
      birthday,
      address: payload.data.address,
      country: countryCode,
      country_number: '+84',
      province: provinceCode,
      district: districtCode,
      user_target: payload.data.goal,
      ...(uploadedAvatarPath.value && { avatar: uploadedAvatarPath.value })
    }

    await userService.updateInfo(updatePayload)

    toast.add({
      title: 'Cập nhật thành công',
      description: 'Thông tin cá nhân đã được cập nhật thành công',
      color: 'success'
    })

    originalFormData.value = { ...profileForm }
    uploadedAvatarPath.value = ''
    isEditing.value = false
    await fetchUserInfo()
  } catch (error) {
    console.log(error)

    toast.add({
      title: 'Cập nhật thất bại',
      description: 'Có lỗi xảy ra',
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

    const updatePasswordPayload = {
      currentPassword: payload.data.oldPassword,
      newPassword: payload.data.newPassword,
      confirmPassword: payload.data.confirmPassword
    }

    await userService.updatePassword(updatePasswordPayload)

    toast.add({
      title: 'Đổi mật khẩu thành công',
      description: 'Mật khẩu của bạn đã được thay đổi thành công',
      color: 'success'
    })

    changePasswordModalOpen.value = false
  } catch (error) {
    console.log(error)

    toast.add({
      title: 'Đổi mật khẩu thất bại',
      description: 'Mật khẩu cũ không đúng',
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
        <ClientOnly>
          <UUser class="items-center gap-6">
            <template #avatar>
              <div class="relative">
                <UAvatar
                  :src="avatar"
                  class="size-22"
                  :class="{ 'cursor-pointer': isEditing, 'opacity-50': isUploadingAvatar }"
                  @click="triggerAvatarSelect"
                />
                <UButton
                  v-if="isEditing"
                  color="primary"
                  size="sm"
                  class="absolute bottom-0 right-0 px-1 rounded-full size-8 shrink-0"
                  :disabled="isUploadingAvatar"
                  @click.stop="triggerAvatarSelect"
                >
                  <UIcon
                    v-if="!isUploadingAvatar"
                    name="i-lucide-camera"
                    class="size-6 shrink-0"
                  />
                  <UIcon
                    v-else
                    name="i-lucide-loader-2"
                    class="size-6 shrink-0 animate-spin"
                  />
                </UButton>
                <input
                  ref="avatarInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  :disabled="!isEditing || isUploadingAvatar"
                  @change="handleAvatarChange"
                >
              </div>
            </template>
            <template #description>
              <div class="flex flex-col gap-1">
                <p class="text-lg font-bold text-default">
                  {{ profileForm.fullName || '' }}
                </p>
                <div
                  v-if="profileForm.goal"
                  class="flex items-center gap-2"
                >
                  <UIcon
                    name="i-lucide-target"
                    class="w-6 h-6 text-primary"
                  />
                  <span class="line-clamp-2">{{ profileForm.goal }}</span>
                </div>
              </div>
            </template>
          </UUser>
          <template #fallback>
            <div class="flex items-center gap-6">
              <UAvatar class="size-22" />
              <div class="flex flex-col gap-1">
                <div class="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                <div class="h-4 w-48 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </template>
        </ClientOnly>

        <UForm
          :schema="profileSchema"
          :state="profileForm"
          class="flex flex-col gap-4"
          :disabled="!isEditing || isLoading || isFetching"
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
              <UPopover
                v-if="isEditing"
                v-model:open="datePickerOpen"
                :popper="{ placement: 'bottom-start' }"
              >
                <UInput
                  :model-value="profileForm.dateOfBirth"
                  placeholder="DD/MM/YYYY"
                  :disabled="!isEditing"
                  size="xl"
                  icon="i-lucide-calendar"
                  class="w-full [&>input]:text-left"
                  readonly
                  @click="datePickerOpen = true"
                />
                <template #content>
                  <div class="p-2">
                    <UCalendar
                      v-model="dateOfBirthCalendar"
                    />
                  </div>
                </template>
              </UPopover>
              <UInput
                v-else
                :model-value="profileForm.dateOfBirth"
                placeholder="DD/MM/YYYY"
                disabled
                size="xl"
                icon="i-lucide-calendar"
                class="w-full text-left"
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
                v-if="isEditing"
                v-model="profileForm.country"
                :items="countries"
                size="xl"
                class="w-full min-h-12"
              />
              <UInput
                v-else
                :model-value="countryDisplayName"
                disabled
                size="xl"
                icon="i-lucide-map-pin"
                class="w-full"
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
