import type { NavigationMenuItem } from '@nuxt/ui'

export const profileMenuItems: NavigationMenuItem[] = [
  {
    label: 'Thông tin cá nhân',
    icon: 'i-lucide-book-open',
    to: '/profile'
  },
  {
    label: 'Thông báo',
    icon: 'i-lucide-bell',
    to: '/profile/notifications'
  },
  {
    label: 'Giỏ hàng',
    icon: 'i-lucide-shopping-cart',
    to: '/profile/cart'
  },
  {
    label: 'Chứng nhận của bạn',
    icon: 'i-lucide-award',
    to: '/profile/certificates'
  },
  {
    label: 'Khoá học đã mua',
    icon: 'i-lucide-book',
    to: '/profile/my-course'
  },
  {
    label: 'Lộ trình học tập',
    icon: 'i-lucide-route',
    to: '/profile/learning-paths'
  }
]
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
export const PAGE_DEFAULT = 10
