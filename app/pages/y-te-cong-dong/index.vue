<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import { motion } from 'motion-v'
import ArticleCard from '~/components/article/ArticleCard.vue'
import PopularArticleItem from '~/components/article/PopularArticleItem.vue'
import { services } from '~/services'
import type { News } from '~/types/news'
import { formatDate, DATE_FORMAT } from '~/utils/date'

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

const route = useRoute()
const router = useRouter()
const PAGE_SIZE = 12

// Get page from route query, default to 1
const currentPage = computed(() => {
  const page = route.query.page
  return page ? Number(page) : 1
})

// Fetch news list with reactive page
const {
  data: newsData,
  pending: isLoadingNews,
  error: newsError,
  refresh: refreshNews
} = await services.news.getList(currentPage, PAGE_SIZE)

// Fetch most viewed articles
const {
  data: mostViewedData,
  pending: isLoadingMostViewed
} = await services.news.getMostViewed()

// Map News to Article format for ArticleCard
const articles = computed(() => {
  if (!newsData.value?.data) return []
  const responseData = newsData.value.data

  // Handle single ListNews object
  const listNews = responseData as { items?: News[], total?: number }
  const newsItems = listNews.items || []
  return newsItems.map(news => ({
    id: news.news_id,
    title: news.title,
    description: news.short_description || '',
    date: formatDate(news.created_at, DATE_FORMAT.SLASH),
    slug: news.news_id,
    image: getLinkFromS3(news.cover_image)
  }))
})

// Map News to PopularArticle format
const popularArticles = computed(() => {
  if (!mostViewedData.value?.data) return []
  const responseData = mostViewedData.value.data
  return responseData.map(mostViewedNews => ({
    id: mostViewedNews.news_id,
    title: mostViewedNews.title,
    date: formatDate(mostViewedNews.created_at, DATE_FORMAT.SLASH),
    slug: mostViewedNews.news_id,
    image: getLinkFromS3(mostViewedNews.cover_image)
  }))
})

// Pagination
const totalItems = computed(() => {
  if (!newsData.value?.data) return 0
  const responseData = newsData.value.data
  // Handle single ListNews object
  const listNews = responseData as { total?: number, items?: News[] }
  return listNews.total ?? 0
})

const updatePage = (page: number) => {
  router.push({
    query: { page: page.toString() }
  })
  // Scroll to top when page changes
  if (import.meta.client) {
    goToTop()
  }
}

// Watch for page changes and scroll to top
watch(currentPage, () => {
  if (import.meta.client) {
    goToTop()
  }
})
</script>

<template>
  <UContainer class="space-y-2 mb-10 md:mb-20">
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
        <SkeletonNews
          v-if="isLoadingNews"
          :count="PAGE_SIZE"
        />

        <div
          v-else-if="newsError"
          class="flex justify-center items-center py-20"
        >
          <div class="text-center">
            <p class="text-error mb-4">
              Có lỗi xảy ra khi tải dữ liệu
            </p>
            <UButton @click="refreshNews()">
              Thử lại
            </UButton>
          </div>
        </div>

        <motion.div
          v-else-if="articles.length > 0"
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

        <div
          v-else
          class="flex justify-center items-center py-20"
        >
          <p class="text-secondary">
            Chưa có bài viết nào
          </p>
        </div>

        <div
          v-if="articles.length > 0 && totalItems > PAGE_SIZE"
          class="mt-8 flex justify-center"
        >
          <UPagination
            :page="currentPage"
            :total="totalItems"
            :page-size="PAGE_SIZE"
            @update:page="updatePage"
          />
        </div>
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
              Bài đọc được quan tâm
            </Heading>

            <div
              v-if="isLoadingMostViewed"
              class="space-y-0 py-4"
            >
              <div
                v-for="i in 5"
                :key="i"
                class="animate-pulse py-3"
              >
                <div class="flex items-center gap-3">
                  <div class="w-25 h-16 bg-gray-200 rounded-sm" />
                  <div class="flex-1 space-y-2">
                    <div class="h-4 bg-gray-200 rounded w-full" />
                    <div class="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              </div>
            </div>

            <div
              v-else-if="popularArticles.length > 0"
              class="space-y-0"
            >
              <PopularArticleItem
                v-for="article in popularArticles"
                :key="article.id"
                :title="article.title"
                :image="article.image ?? ''"
                :date="article.date"
                :to="`/y-te-cong-dong/${article.slug}`"
              />
            </div>

            <div
              v-else
              class="py-4 text-center text-secondary text-sm"
            >
              Chưa có bài viết phổ biến
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </UContainer>
</template>
