<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import { motion } from 'motion-v'
import PopularArticleItem from '~/components/article/PopularArticleItem.vue'

interface RelatedArticle {
  id: number
  title: string
  date: string
  slug: string
  image: string
}

const items = ref<BreadcrumbItem[]>([
  {
    label: 'Trang chủ',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: 'Y tế cộng đồng',
    to: '/y-te-cong-dong'
  },
  {
    label: 'Chi tiết bài viết',
    to: '#'
  }
])

const relatedArticles: RelatedArticle[] = [
  {
    id: 10,
    title: 'AI là gì? Ứng dụng của trí tuệ nhân tạo trong đời sống...',
    date: '15/10/2024',
    slug: 'ai-la-gi-ung-dung-cua-tri-tue-nhan-tao-trong-doi-song',
    image: 'https://images.unsplash.com/photo-1764076327046-fe35f955cba1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 11,
    title: 'Top 7 công cụ AI miễn phí giúp bạn học nhanh, làm...',
    date: '15/10/2024',
    slug: 'top-7-cong-cu-ai-mien-phi-giup-ban-hoc-nhanh-lam',
    image: 'https://images.unsplash.com/photo-1764076327046-fe35f955cba1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 12,
    title: 'ChatGPT có thể làm được gì? 10 cách sử dụng AI bạ...',
    date: '15/10/2024',
    slug: 'chatgpt-co-the-lam-duoc-gi-10-cach-su-dung-ai-ban',
    image: 'https://images.unsplash.com/photo-1764076327046-fe35f955cba1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 13,
    title: 'Liệu AI có thay thế con người trong tương lai?',
    date: '15/10/2024',
    slug: 'lieu-ai-co-the-thay-the-con-nguoi-trong-tuong-lai',
    image: 'https://images.unsplash.com/photo-1764076327046-fe35f955cba1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 14,
    title: 'Làm sao để bắt đầu học AI từ con số 0?',
    date: '15/10/2024',
    slug: 'lam-sao-de-bat-dau-hoc-ai-tu-con-so-0',
    image: 'https://images.unsplash.com/photo-1764076327046-fe35f955cba1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
]
</script>

<template>
  <UContainer class="space-y-6 mb-10 md:mb-20">
    <UBreadcrumb
      :items="items"
    />

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
      <div class="lg:col-span-3">
        <Heading
          variant="h3"
          as="h1"
          class="text-primary"
        >
          Trí tuệ nhân tạo đang thay đổi cách con người làm việc ra sao?
        </Heading>
        <p class="text-sm text-muted mt-4">
          Thứ bảy, 22/03/2025 - 21:33
        </p>
      </div>
      <div class="lg:col-span-1">
        <motion.div
          class="sticky top-28 space-y-6"
          :initial="{ opacity: 0, x: 20 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.5, delay: 0.3, ease: 'easeOut' }"
        >
          <SharedFacebookCard />
          <div
            class="bg-white rounded-lg shadow-md p-4"
          >
            <Heading
              variant="h4"
              as="h4"
              class="mb-4 py-2 pl-5 relative before:content-[''] before:block before:absolute before:left-0 before:top-0 before:h-full before:w-1.5 before:bg-primary"
            >
              Bài đọc liên quan
            </Heading>

            <div class="space-y-0">
              <PopularArticleItem
                v-for="article in relatedArticles"
                :key="article.id"
                :title="article.title"
                :image="article.image ?? ''"
                :date="article.date"
                :to="`/y-te-cong-dong/${article.slug}`"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </UContainer>
</template>
