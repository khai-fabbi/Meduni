<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import { formatDate } from '~/utils/date'
import Ring from '~/assets/icons/ring.svg'
import { PAGE_DEFAULT } from '~/utils/constants'

useSeoMeta({
  title: 'Danh sách thông báo',
  description: 'Thông báo của bạn'
})

definePageMeta({
  layout: 'profile'
})

enum NotificationTab {
  GENERAL = 'general',
  PERSONAL = 'personal'
}

const tabItems = [
  {
    label: 'Thông báo chung',
    value: NotificationTab.GENERAL
  },
  {
    label: 'Thông báo cá nhân',
    value: NotificationTab.PERSONAL
  }
] satisfies TabsItem[]

const activeTab = ref<NotificationTab>(NotificationTab.GENERAL)
const isLoading = ref(true)
const page = ref(1)

const notifications = ref([
  {
    id: 1,
    title: 'Khóa học đã mua',
    message: 'Bạn đã mua Khóa học 1 thành công! Học ngay cùng Minh Trí Thành nào!',
    createdAt: '2023-09-19T20:00:00',
    isRead: false,
    courseId: 1,
    type: 'course'
  },
  {
    id: 2,
    title: 'Sắp đến hạn thanh toán',
    message: 'Chỉ còn 7 ngày nữa là đến hạn thanh toán chương trình Đường Đến Tim Con, vui lòng hoàn thành thanh toán đúng hạn!',
    createdAt: '2023-09-19T20:00:00',
    isRead: true,
    courseId: 2,
    type: 'payment'
  },
  {
    id: 3,
    title: 'Sắp đến hạn thanh toán',
    message: 'Chỉ còn 3 ngày nữa là đến hạn thanh toán chương trình Đường Đến Tim Con, vui lòng hoàn thành thanh toán đúng hạn!',
    createdAt: '2023-09-19T20:00:00',
    isRead: true,
    courseId: 3,
    type: 'payment'
  },
  {
    id: 4,
    title: 'Sắp đến hạn thanh toán',
    message: 'Hôm nay là hạn thanh toán của chương trình Đường Đến Tim Con, vui lòng hoàn thành thanh toán trong hôm nay để tiếp tục học!',
    createdAt: '2023-09-19T20:00:00',
    isRead: true,
    courseId: 4,
    type: 'payment'
  },
  {
    id: 5,
    title: 'Sắp đến hạn thanh toán',
    message: 'Hôm nay là hạn thanh toán của chương trình Đường Đến Tim Con, vui lòng hoàn thành thanh toán trong hôm nay để tiếp tục học!',
    createdAt: '2023-09-19T20:00:00',
    isRead: true,
    courseId: 5,
    type: 'payment'
  },
  {
    id: 6,
    title: 'Thanh toán trả góp đã quá hạn',
    message: 'Ngày đến hạn thanh toán đã qua, và bạn có 15 ngày để thanh toán trước khi khóa học Đường Đến Tim Con bị vô hiệu hóa!',
    createdAt: '2023-09-19T20:00:00',
    isRead: true,
    courseId: 6,
    type: 'payment'
  },
  {
    id: 7,
    title: 'Sắp đến hạn thanh toán',
    message: 'Hôm nay là hạn thanh toán của chương trình Đường Đến Tim Con, vui lòng hoàn thành thanh toán trong hôm nay để tiếp tục học!',
    createdAt: '2023-09-19T20:00:00',
    isRead: true,
    courseId: 7,
    type: 'payment'
  },
  {
    id: 8,
    title: 'Sắp đến hạn thanh toán',
    message: 'Hôm nay là hạn thanh toán của chương trình Đường Đến Tim Con, vui lòng hoàn thành thanh toán trong hôm nay để tiếp tục học!',
    createdAt: '2023-09-19T20:00:00',
    isRead: true,
    courseId: 8,
    type: 'payment'
  },
  {
    id: 9,
    title: 'Thanh toán trả góp đã quá hạn',
    message: 'Ngày đến hạn thanh toán đã qua, và bạn có 15 ngày để thanh toán trước khi khóa học Đường Đến Tim Con bị vô hiệu hóa!',
    createdAt: '2023-09-19T20:00:00',
    isRead: true,
    courseId: 9,
    type: 'payment'
  },
  {
    id: 10,
    title: 'Thanh toán trả góp đã quá hạn',
    message: 'Ngày đến hạn thanh toán đã qua, và bạn có 15 ngày để thanh toán trước khi khóa học Đường Đến Tim Con bị vô hiệu hóa!',
    createdAt: '2023-09-19T20:00:00',
    isRead: true,
    courseId: 10,
    type: 'payment'
  },
  {
    id: 11,
    title: 'Thanh toán trả góp đã quá hạn',
    message: 'Ngày đến hạn thanh toán đã qua, và bạn có 15 ngày để thanh toán trước khi khóa học Đường Đến Tim Con bị vô hiệu hóa!',
    createdAt: '2023-09-19T20:00:00',
    isRead: true,
    courseId: 11,
    type: 'payment'
  }
])

onMounted(async () => {
  isLoading.value = false
})

function formatNotificationDate(date: string): string {
  return formatDate(date, 'DD/MM/YYYY HH:mm')
}

function getNotificationUrl(notification: typeof notifications.value[0]): string {
  if (notification.type === 'course' && 'courseId' in notification && notification.courseId) {
    return '/profile/courses'
  }
  if (notification.type === 'payment') {
    return '/profile/cart'
  }
  return '/profile/notifications'
}
</script>

<template>
  <div class="space-y-6">
    <Heading
      variant="h3"
    >
      Danh sách thông báo
    </Heading>
    <div class="bg-white rounded-sm p-6">
      <UTabs
        v-model="activeTab"
        :items="tabItems"
        variant="link"
        :ui="{
          list: 'justify-start border-b-0 cursor-pointer',
          trigger: 'text-base font-medium rounded-none border-none data-[active]:text-primary cursor-pointer',
          indicator: 'h-0.5 bg-primary'
        }"
        class="mb-6"
      />

      <div class="space-y-0">
        <SkeletonNotification v-if="isLoading" />

        <template v-else>
          <NuxtLink
            v-for="notification in notifications"
            :key="notification.id"
            :to="getNotificationUrl(notification)"
            class="flex items-center gap-4 py-4 border-b border-neutral-300 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div class="shrink-0 flex items-center">
              <Ring class="w-8 h-8 text-orange-300" />
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4 mb-1">
                <h3
                  class="text-base"
                  :class="!notification.isRead ? 'text-primary font-bold' : 'text-default'"
                >
                  {{ notification.title }}
                </h3>
                <div class="flex items-center gap-2 shrink-0">
                  <span
                    v-if="!notification.isRead"
                    class="w-2 h-2 bg-red-500 rounded-full"
                  />
                  <span class="text-sm text-neutral-500 whitespace-nowrap">
                    {{ formatNotificationDate(notification.createdAt) }}
                  </span>
                </div>
              </div>
              <p
                class="text-base"
                :class="!notification.isRead ? 'text-default' : 'text-neutral-500'"
              >
                {{ notification.message }}
              </p>
            </div>
          </NuxtLink>
        </template>
      </div>

      <div
        v-if="notifications.length > PAGE_DEFAULT"
        class="mt-6 mx-auto flex"
      >
        <UPagination
          v-model:page="page"
          class="mx-auto"
          :total="notifications.length"
          :page-size="PAGE_DEFAULT"
        />
      </div>
    </div>
  </div>
</template>
