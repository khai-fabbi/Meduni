<script setup lang="ts">
import type { TabsItem, BreadcrumbItem } from '@nuxt/ui'
import type { Notification } from '~/types/notification'
import { NotificationType } from '~/types/notification'
import { formatDate, DATE_FORMAT } from '~/utils/date'
import Ring from '~/assets/icons/ring.svg'
import { PAGE_DEFAULT } from '~/utils/constants'
import { notificationService } from '~/services/notification'

useSeoMeta({
  title: 'Danh sách thông báo',
  description: 'Thông báo của bạn'
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
  },
  {
    label: 'Danh sách thông báo',
    to: '#'
  }
])

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
const totalRecords = ref(0)
const notifications = ref<Notification[]>([])
const toast = useToast()

// Fetch notifications from API
async function fetchNotifications() {
  try {
    isLoading.value = true
    const response = await notificationService.getList({
      mode: 'list',
      type: activeTab.value === NotificationTab.PERSONAL ? 'user' : 'common',
      page_number: page.value,
      page_size: PAGE_DEFAULT
    })

    if (response.data) {
      notifications.value = response.data
      // Calculate total records - API might return pagination info differently
      totalRecords.value = response.data.length >= PAGE_DEFAULT
        ? (page.value * PAGE_DEFAULT) + response.data.length
        : (page.value - 1) * PAGE_DEFAULT + response.data.length
    }
  } catch (error) {
    console.error('Error fetching notifications:', error)
    toast.add({
      title: 'Lỗi',
      description: 'Không thể tải danh sách thông báo',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

// Mark notification as read
async function markAsRead(notificationId: string, event?: Event) {
  if (event) {
    event.stopPropagation()
    event.preventDefault()
  }

  try {
    await notificationService.markAsRead([notificationId])
    const index = notifications.value.findIndex(n => n.notification_id === notificationId)
    if (index !== -1 && notifications.value[index]) {
      notifications.value[index].is_read = true
    }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    toast.add({
      title: 'Lỗi',
      description: 'Không thể đánh dấu thông báo đã đọc',
      color: 'error'
    })
  }
}

// Mark all as read
async function markAllAsRead() {
  const unreadNotifications = notifications.value.filter(n => !n.is_read)
  if (unreadNotifications.length === 0) return

  try {
    const ids = unreadNotifications.map(n => n.notification_id)
    await notificationService.markAsRead(ids)
    notifications.value = notifications.value.map(n => ({
      ...n,
      is_read: true
    }))
    toast.add({
      title: 'Thành công',
      description: 'Đã đánh dấu tất cả thông báo đã đọc',
      color: 'success'
    })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    toast.add({
      title: 'Lỗi',
      description: 'Không thể đánh dấu tất cả thông báo đã đọc',
      color: 'error'
    })
  }
}

// Format notification content
function getNotificationContent(content: Notification['content']): string {
  if (!content || !content.msg_code) {
    return ''
  }

  // Simple content formatting - can be enhanced with i18n later
  if (content.params) {
    // Try to format based on msg_code if needed
    // For now, just return a simple message
    return `Thông báo: ${content.msg_code}`
  }

  return ''
}

// Get notification title
function getNotificationTitle(notification: Notification): string {
  if (notification.title) {
    return notification.title
  }

  // Fallback to type-based title
  switch (notification.type) {
    case NotificationType.COURSE:
      return 'Thông báo khóa học'
    case NotificationType.PAYMENT:
      return 'Thông báo thanh toán'
    case NotificationType.PROMOTION:
      return 'Thông báo khuyến mãi'
    case NotificationType.REVIEW:
      return 'Thông báo đánh giá'
    case NotificationType.EXERCISE:
      return 'Thông báo bài tập'
    case NotificationType.PAYMENT_INSTALLMENT:
      return 'Thông báo trả góp'
    case NotificationType.USER:
      return 'Thông báo cá nhân'
    case NotificationType.HAS_CERTIFICATE:
      return 'Thông báo chứng chỉ'
    default:
      return 'Thông báo hệ thống'
  }
}

// Get notification message
function getNotificationMessage(notification: Notification): string {
  const content = getNotificationContent(notification.content)
  if (content) {
    return content
  }

  // Try to extract from content params
  if (notification.content?.params) {
    const params = notification.content.params
    // Simple message construction
    const values = Object.values(params).filter(Boolean) as string[]
    return values.length > 0 ? values.join(' ') : 'Thông báo mới'
  }

  return 'Thông báo mới'
}

// Format date
function formatNotificationDate(date: string): string {
  return formatDate(date, DATE_FORMAT.DATE_TIME)
}

// Get notification URL based on type and actions
function getNotificationUrl(notification: Notification): string {
  // Check if notification has actions
  if (notification.actions && notification.actions.length > 0 && notification.actions[0]) {
    return notification.actions[0].url
  }

  // Fallback to type-based routing
  switch (notification.type) {
    case NotificationType.COURSE:
      return '/profile/my-course'
    case NotificationType.PAYMENT:
    case NotificationType.PAYMENT_INSTALLMENT:
      return '/profile/cart'
    default:
      return '/profile/notifications'
  }
}

// Handle tab change
async function handleTabChange(newTab: NotificationTab) {
  activeTab.value = newTab
  page.value = 1
  await fetchNotifications()
}

// Handle page change
async function handlePageChange(newPage: number) {
  page.value = newPage
  await fetchNotifications()
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Watch for tab changes
watch(activeTab, handleTabChange)

onMounted(async () => {
  await fetchNotifications()
})
</script>

<template>
  <div class="space-y-6">
    <UBreadcrumb
      :items="items"
      class="md:hidden mb-0"
    />
    <Heading
      variant="h3"
    >
      Danh sách thông báo
    </Heading>
    <div class="bg-white rounded-sm p-6">
      <div class="flex items-center justify-between mb-6">
        <UTabs
          v-model="activeTab"
          :items="tabItems"
          variant="link"
          :ui="{
            list: 'justify-start border-b-0 cursor-pointer',
            trigger: 'text-base font-medium rounded-none border-none data-[active]:text-primary cursor-pointer',
            indicator: 'h-0.5 bg-primary'
          }"
        />
        <UButton
          v-if="notifications.some(n => !n.is_read)"
          variant="ghost"
          size="sm"
          @click="markAllAsRead"
        >
          Đánh dấu tất cả đã đọc
        </UButton>
      </div>

      <div class="space-y-0">
        <SkeletonNotification v-if="isLoading" />

        <template v-else-if="notifications.length > 0">
          <NuxtLink
            v-for="notification in notifications"
            :key="notification.notification_id"
            :to="getNotificationUrl(notification)"
            class="flex items-center gap-4 py-4 border-b border-neutral-300 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer group"
            @click="!notification.is_read && markAsRead(notification.notification_id, $event)"
          >
            <div class="shrink-0 flex items-center">
              <Ring class="w-8 h-8 text-orange-300" />
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4 mb-1">
                <h3
                  class="text-base"
                  :class="!notification.is_read ? 'text-primary font-bold' : 'text-default'"
                >
                  {{ getNotificationTitle(notification) }}
                </h3>
                <div class="flex items-center gap-2 shrink-0">
                  <span
                    v-if="!notification.is_read"
                    class="w-2 h-2 bg-red-500 rounded-full"
                  />
                  <span class="text-sm text-neutral-500 whitespace-nowrap">
                    {{ formatNotificationDate(notification.created_at) }}
                  </span>
                </div>
              </div>
              <p
                class="text-base"
                :class="!notification.is_read ? 'text-default' : 'text-neutral-500'"
              >
                {{
                  getNotificationMessage(notification)
                }}
              </p>
            </div>
          </NuxtLink>
        </template>

        <div
          v-else
          class="text-center py-12"
        >
          <p class="text-neutral-500">
            Không có thông báo nào
          </p>
        </div>
      </div>

      <div
        v-if="totalRecords > PAGE_DEFAULT"
        class="mt-6 mx-auto flex"
      >
        <UPagination
          :page="page"
          class="mx-auto"
          :total="totalRecords"
          :page-size="PAGE_DEFAULT"
          @update:page="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>
