<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import { motion } from 'motion-v'
import ArticleCard from '~/components/article/ArticleCard.vue'
import PopularArticleItem from '~/components/article/PopularArticleItem.vue'

const title = 'Y tế cộng đồng - MedUni.ai'
const description = 'Khám phá các bài viết về y tế cộng đồng, trí tuệ nhân tạo trong y tế và các chủ đề liên quan.'

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

const items = ref<BreadcrumbItem[]>([
  {
    label: 'Trang chủ',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: 'Y tế cộng đồng',
    icon: 'i-lucide-history',
    to: '/y-te-cong-dong'
  }
])

interface Article {
  id: number
  title: string
  description: string
  date: string
  image: string
  slug: string
}

interface PopularArticle {
  id: number
  title: string
  date: string
  slug: string
}

const articles: Article[] = [
  {
    id: 1,
    title: 'Trí tuệ nhân tạo đang thay đổi cách con người làm việc ra sao?',
    description: 'Trí tuệ nhân tạo đang thay đổi cách con người làm việc, từ việc tự động hóa các quy trình đơn giản đến hỗ trợ ra quyết định chiến lược.',
    date: '15/10/2024',
    slug: 'tri-tue-nhan-tao-dang-thay-doi-cach-con-nguoi-lam-viec-ra-sao',
    image: 'https://images.unsplash.com/photo-1764076327046-fe35f955cba1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 2,
    title: '5 công cụ AI miễn phí giúp tăng hiệu suất làm việc mỗi ngày',
    description: 'Các công cụ AI miễn phí có thể giúp bạn tiết kiệm thời gian và làm việc thông minh hơn mỗi ngày.',
    slug: '5-cong-cu-ai-mien-phi-giup-tang-hieu-suat-lam-viec-moi-ngay',
    date: '15/10/2024',
    image: 'https://images.unsplash.com/photo-1761839257469-96c78a7c2dd3?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 3,
    title: 'AI trong giáo dục: Học thông minh hơn, cá nhân hóa hơn',
    description: 'Trí tuệ nhân tạo giúp cá nhân hóa việc học tập và tạo ra môi trường giáo dục hiệu quả hơn.',
    slug: 'ai-trong-giao-duc-hoc-thong-minh-hon-ca-nhan-hoa-hon',
    date: '15/10/2024',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 4,
    title: 'ChatGPT và các trợ lý AI – Bạn đã khai thác đúng cách chưa?',
    description: 'Các trợ lý AI như ChatGPT có thể hỗ trợ bạn trong việc viết email, lập kế hoạch, học tập và lập trình.',
    slug: 'chatgpt-va-cac-tro-ly-ai-ban-da-khai-thac-dung-cach-chua',
    date: '15/10/2024',
    image: 'https://plus.unsplash.com/premium_photo-1683121710572-7723bd2e235d?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 5,
    title: 'Doanh nghiệp nhỏ có nên ứng dụng AI không? Lợi ích & lưu ý',
    description: 'AI không chỉ dành cho các doanh nghiệp lớn. Các doanh nghiệp nhỏ cũng có thể hưởng lợi từ AI để tối ưu chi phí, chăm sóc khách hàng và năng suất.',
    slug: 'doanh-nghiep-nho-co-nen-ung-dung-ai-khong-loi-ich-va-luu-y',
    date: '15/10/2024',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 6,
    title: 'OpenAI, Google, Meta: Cuộc đua AI năm 2025 đang diễn ra thế nào?',
    description: 'Các gã khổng lồ công nghệ liên tục ra mắt các mô hình AI tiên tiến, tạo nên cuộc đua AI sôi động trong năm 2025.',
    slug: 'openai-google-meta-cuoc-dua-ai-nam-2025-dang-dien-ra-the-nao',
    date: '15/10/2024',
    image: 'https://images.unsplash.com/photo-1666597107756-ef489e9f1f09?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 7,
    title: 'AI tạo sinh: Tương lai của sáng tạo nội dung',
    description: 'AI tạo sinh đang thay đổi cách chúng ta tạo ra nội dung, từ hình ảnh, âm nhạc, tổng hợp giọng nói đến lập trình.',
    slug: 'ai-tao-sinh-tuong-lai-cua-sang-tao-noi-dung',
    date: '15/10/2024',
    image: 'https://images.unsplash.com/photo-1764076327046-fe35f955cba1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 8,
    title: 'AI kết hợp IoT – Xu hướng mới trong tự động hóa và thành phố thông minh',
    description: 'Sự kết hợp giữa AI và IoT cho phép các thiết bị thông minh học hỏi, vận hành tự động và tương tác linh hoạt, tạo nền tảng cho các thành phố thông minh hiện đại.',
    slug: 'ai-ket-hop-iot-xu-huong-moi-trong-tu-dong-hoa-va-thanh-pho-thong-minh',
    date: '15/10/2024',
    image: 'https://images.unsplash.com/photo-1764076327046-fe35f955cba1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 9,
    title: 'Tương lai nào cho AI tại Việt Nam? Cơ hội và thách thức',
    description: 'Việt Nam đang tích cực ứng dụng AI vào nhiều lĩnh vực như giáo dục, y tế, nông nghiệp, nhưng vẫn còn nhiều thách thức về nhân lực, dữ liệu và chính sách.',
    slug: 'tuong-lai-nao-cho-ai-tai-viet-nam-co-hoi-va-thach-thuc',
    date: '15/10/2024',
    image: 'https://images.unsplash.com/photo-1764076327046-fe35f955cba1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
]

const popularArticles: PopularArticle[] = [
  {
    id: 10,
    title: 'AI là gì? Ứng dụng của trí tuệ nhân tạo trong đời sống...',
    date: '15/10/2024',
    slug: 'ai-la-gi-ung-dung-cua-tri-tue-nhan-tao-trong-doi-song'
  },
  {
    id: 11,
    title: 'Top 7 công cụ AI miễn phí giúp bạn học nhanh, làm...',
    date: '15/10/2024',
    slug: 'top-7-cong-cu-ai-mien-phi-giup-ban-hoc-nhanh-lam'
  },
  {
    id: 12,
    title: 'ChatGPT có thể làm được gì? 10 cách sử dụng AI bạ...',
    date: '15/10/2024',
    slug: 'chatgpt-co-the-lam-duoc-gi-10-cach-su-dung-ai-ban'
  },
  {
    id: 13,
    title: 'Liệu AI có thay thế con người trong tương lai?',
    date: '15/10/2024',
    slug: 'lieu-ai-co-the-thay-the-con-nguoi-trong-tuong-lai'
  },
  {
    id: 14,
    title: 'Làm sao để bắt đầu học AI từ con số 0?',
    date: '15/10/2024',
    slug: 'lam-sao-de-bat-dau-hoc-ai-tu-con-so-0'
  }
]

const currentPage = ref(1)
</script>

<template>
  <UContainer class="space-y-6 mb-10 md:mb-20">
    <UBreadcrumb
      :items="items"
    />
    <Heading
      variant="h3"
      as="h1"
      class="text-primary"
    >
      Y tế cộng đồng
    </Heading>
    <div class="mt-7.5 grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
      <div class="lg:col-span-3">
        <motion.div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7.5"
          :initial="false"
          :animate="{ opacity: 1 }"
          :transition="{ staggerChildren: 0.1, delayChildren: 0.1 }"
        >
          <motion.div
            v-for="(article, index) in articles"
            :key="article.id"
            :initial="{ opacity: 0, y: 30, scale: 0.9 }"
            :animate="{ opacity: 1, y: 0, scale: 1 }"
            :transition="{
              duration: 0.5,
              delay: index * 0.05,
              ease: 'easeOut'
            }"
          >
            <ArticleCard
              :title="article.title"
              :description="article.description"
              :date="article.date"
              :image="article.image ?? ''"
              :to="`/y-te-cong-dong/${article.slug}`"
            />
          </motion.div>
        </motion.div>
        <div class="mt-8 flex justify-center">
          <UPagination
            v-model:page="currentPage"
            :total="articles.length"
            :page-size="PAGE_DEFAULT"
          />
        </div>
      </div>

      <div class="lg:col-span-1">
        <motion.div
          class="bg-white rounded-lg shadow-md p-6 sticky top-28"
          :initial="{ opacity: 0, x: 20 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.5, delay: 0.3, ease: 'easeOut' }"
        >
          <Heading
            variant="h5"
            as="h2"
            class="mb-6 text-primary"
          >
            Bài đọc được quan tâm
          </Heading>

          <div class="space-y-0">
            <PopularArticleItem
              v-for="article in popularArticles"
              :key="article.id"
              :title="article.title"
              :date="article.date"
              :to="`/y-te-cong-dong/${article.slug}`"
            />
          </div>
        </motion.div>
      </div>
    </div>
  </UContainer>
</template>
