<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import { motion } from 'motion-v'
import PopularArticleItem from '~/components/article/PopularArticleItem.vue'
import { services } from '~/services'
import type { MostViewedNews } from '~/types/news'
import { formatDate, DATE_FORMAT } from '~/utils/date'
import { getLinkFromS3 } from '~/utils/helpers'

const route = useRoute()
const newsId = route.params.id as string

// Fetch news detail
const {
  data: newsDetailData,
  pending: isLoadingDetail,
  error: detailError,
  refresh: refreshDetail
} = await services.news.getDetail(newsId)

// Fetch most viewed articles for related articles
const {
  data: mostViewedData,
  pending: isLoadingMostViewed
} = await services.news.getMostViewed()

// News detail
const newsDetail = computed(() => newsDetailData.value?.data)

// Breadcrumb items
const items = computed<BreadcrumbItem[]>(() => [
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
    label: newsDetail.value?.title || 'Chi tiết bài viết',
    to: '#'
  }
])

// SEO Meta
useSeoMeta({
  title: newsDetail.value?.title || 'Chi tiết bài viết',
  description: newsDetail.value?.short_description || '',
  ogTitle: newsDetail.value?.title || 'Chi tiết bài viết',
  ogDescription: newsDetail.value?.short_description || '',
  ogImage: newsDetail.value?.cover_image
    ? getLinkFromS3(newsDetail.value.cover_image)
    : ''
})

// Format date
const formattedDate = computed(() => {
  if (!newsDetail.value?.created_at) return ''
  const date = new Date(newsDetail.value.created_at)
  const dayNames = [
    'Chủ nhật',
    'Thứ hai',
    'Thứ ba',
    'Thứ tư',
    'Thứ năm',
    'Thứ sáu',
    'Thứ bảy'
  ]
  const dayName = dayNames[date.getDay()]
  const dateStr = formatDate(newsDetail.value.created_at, DATE_FORMAT.SLASH)
  const timeStr = formatDate(newsDetail.value.created_at, DATE_FORMAT.TIME)
  return `${dayName}, ${dateStr} - ${timeStr}`
})

// Related articles (most viewed)
const relatedArticles = computed(() => {
  if (!mostViewedData.value?.data) return []
  return mostViewedData.value.data.slice(0, 5).map((news: MostViewedNews) => ({
    id: news.news_id,
    title: news.title,
    date: formatDate(news.created_at, DATE_FORMAT.SLASH),
    slug: news.news_id,
    image: getLinkFromS3(news.cover_image)
  }))
})
</script>

<template>
  <UContainer class="space-y-6 mb-10 md:mb-20">
    <UBreadcrumb
      :items="items"
    />

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
      <div class="lg:col-span-3">
        <!-- Loading state -->
        <UIcon
          v-if="isLoadingDetail"
          name="i-lucide-loader-circle"
          class="animate-spin size-10 text-primary mx-auto block"
        />

        <!-- Error state -->
        <div
          v-else-if="detailError"
          class="flex justify-center items-center py-20"
        >
          <div class="text-center">
            <p class="text-error mb-4">
              Có lỗi xảy ra khi tải dữ liệu
            </p>
            <UButton @click="refreshDetail()">
              Thử lại
            </UButton>
          </div>
        </div>

        <!-- Content -->
        <div v-else-if="newsDetail">
          <Heading
            variant="h3"
            as="h1"
            class="text-primary"
          >
            {{ newsDetail.title }}
          </Heading>

          <div class="flex justify-between items-center gap-2">
            <p class="text-sm text-muted mt-4">
              {{ formattedDate }}
            </p>

            <!-- view count -->
            <div class="flex items-center gap-1.5">
              <UIcon
                name="i-lucide-eye"
                class="size-4 text-muted"
              />
              <p class="text-sm font-medium text-muted">
                {{ newsDetail.view_count }}
              </p>
            </div>
          </div>

          <!-- Cover image -->
          <div
            v-if="newsDetail.cover_image"
            class="mt-6 w-full aspect-video rounded-lg overflow-hidden"
          >
            <NuxtImg
              :src="getLinkFromS3(newsDetail.cover_image)"
              :alt="newsDetail.title"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <!-- Content -->
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div
            class="mt-6 prose prose-lg max-w-none post-content"
            v-html="newsDetail.content"
          />
        </div>

        <!-- Not found -->
        <div
          v-else
          class="flex justify-center items-center py-20"
        >
          <p class="text-secondary">
            Không tìm thấy bài viết
          </p>
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
              Bài đọc liên quan
            </Heading>

            <!-- Loading state -->
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

            <!-- Related articles -->
            <div
              v-else-if="relatedArticles.length > 0"
              class="space-y-0"
            >
              <PopularArticleItem
                v-for="article in relatedArticles"
                :key="article.id"
                :title="article.title"
                :image="article.image ?? ''"
                :date="article.date"
                :to="`/y-te-cong-dong/${article.slug}`"
              />
            </div>

            <!-- Empty state -->
            <div
              v-else
              class="py-4 text-center text-secondary text-sm"
            >
              Chưa có bài viết liên quan
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </UContainer>
</template>

<style>
.post-content {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 20px;
  color: #000;
}

.post-content p {
  margin-bottom: 16px;
}

.post-content p:last-of-type {
  margin-bottom: 0;
}

.post-content img {
  max-width: 670px;
  margin: 0 auto;
  width: 100%;
  border-radius: 4px;
  display: block;
}

.post-content img + span {
  max-width: 670px;
  margin: 0 auto;
  display: block;
  font-size: 16px;
  font-style: italic;
}

.post-content strong {
  font-size: 18px;
  font-weight: 700;
}

.post-content .show-movie {
  position: relative;
  display: block;
  cursor: pointer;
}

.post-content .show-movie::after {
  content: '';
  position: absolute;
  width: 68px;
  height: 48px;
  background: url(../img/news/detail/btn-play.png) no-repeat center/100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.post-content .show-movie + span {
  max-width: 670px;
  margin: 0 auto;
  display: block;
  font-size: 16px;
  font-style: italic;
}
</style>
