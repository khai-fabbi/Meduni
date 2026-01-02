<script setup lang="ts">
import { services } from '~/services'
import { formatDate, DATE_FORMAT } from '~/utils/date'
import { getLinkFromS3 } from '~/utils/helpers'
import type { News } from '~/types/news'

interface NewsEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  image: string
  to?: string
}

interface Partner {
  id: number
  name: string
  logo?: string
}

// Fetch latest news from API
const {
  data: latestNewsData,
  pending: isLoadingNews,
  error: newsError
} = services.news.getLatest()

// Map API response to NewsEvent format
const newsEvents = computed<NewsEvent[]>(() => {
  if (!latestNewsData.value?.data) return []

  // The API returns ListNews[] according to type, but likely returns News[] directly
  // Handle both possible structures for safety
  const newsList = latestNewsData.value.data as News[]

  return newsList.map((news) => {
    const formattedDate = formatDate(news.created_at, DATE_FORMAT.SLASH)
    const formattedTime = formatDate(news.created_at, DATE_FORMAT.TIME)

    return {
      id: news.news_id,
      title: news.title,
      description: news.short_description || '',
      date: formattedDate,
      time: formattedTime,
      image: news.cover_image ? getLinkFromS3(news.cover_image) : '/images/course/course-placeholder.png',
      to: `/y-te-cong-dong/${news.news_id}`
    }
  })
})

const partners: Partner[] = [
  {
    id: 1,
    name: 'SỞ Y TẾ TỈNH KON TUM',
    logo: '/home/partner1.png'
  },
  {
    id: 2,
    name: 'SỞ Y TẾ TP HỒ CHÍ MINH',
    logo: '/home/partner2.png'
  },
  {
    id: 3,
    name: 'SỞ Y TẾ YÊN BÁI',
    logo: '/home/partner2.png'
  },
  {
    id: 4,
    name: 'SỞ Y TẾ TIỀN GIANG',
    logo: '/home/partner1.png'
  },
  {
    id: 5,
    name: 'CESGLOBAL',
    logo: '/home/partner2.png'
  },
  {
    id: 6,
    name: 'SULECO',
    logo: '/home/partner1.png'
  }
]
</script>

<template>
  <div class="bg-neutral-200">
    <UContainer class="py-6 space-y-5 md:py-15">
      <!-- Header Section -->
      <div class="flex flex-col gap-4 mb-0 md:flex-row md:items-start md:justify-between">
        <div class="flex-1">
          <Heading
            class="text-center md:text-left"
            variant="h3"
          >
            Tin tức chuyển động cùng <span class="text-secondary">MEDUNI</span>
          </Heading>
          <p class="max-w-2xl text-base text-center md:text-lg md:text-left">
            Cùng nhau cập nhật những tin tức AI mới nhất và trao đổi kiến thức quý báu. Đây là nơi bạn kết nối, học hỏi và phát triển cùng cộng đồng những người đam mê AI.
          </p>
        </div>
      </div>

      <!-- News Events Carousel -->
      <div class="rounded-lg">
        <div class="relative">
          <div
            ref="carouselRef"
          >
            <!-- Loading State -->
            <div
              v-if="isLoadingNews"
              class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              <div
                v-for="i in 4"
                :key="i"
                class="overflow-hidden h-full bg-white rounded-lg"
              >
                <USkeleton class="w-full rounded-t-lg aspect-video" />
                <div class="flex flex-col gap-1 p-4">
                  <div class="flex gap-2 items-center">
                    <USkeleton class="rounded size-5" />
                    <USkeleton class="w-24 h-4 rounded" />
                  </div>
                  <USkeleton class="mt-1 w-full h-6 rounded" />
                  <USkeleton class="w-3/4 h-6 rounded" />
                  <USkeleton class="mt-2 w-full h-4 rounded" />
                  <USkeleton class="w-full h-4 rounded" />
                  <USkeleton class="w-2/3 h-4 rounded" />
                </div>
              </div>
            </div>

            <!-- Error State -->
            <div
              v-else-if="newsError"
              class="flex flex-col justify-center items-center py-12 text-center"
            >
              <UIcon
                name="i-lucide-alert-circle"
                class="mb-4 size-12 text-neutral-400"
              />
              <p class="text-base text-neutral-600">
                Không thể tải tin tức. Vui lòng thử lại sau.
              </p>
            </div>

            <!-- News Carousel -->
            <UCarousel
              v-else-if="newsEvents.length > 0"
              v-slot="{ item }"
              auto-height
              arrows
              wheel-gestures
              :prev="{
                icon: 'i-lucide-chevron-left',
                color: 'primary',
                variant: 'solid'
              }"
              :next="{
                icon: 'i-lucide-chevron-right',
                color: 'primary',
                variant: 'solid'
              }"
              :items="newsEvents"
              :ui="{
                item: 'lg:basis-1/4',
                controls: 'md:absolute md:-top-6 md:right-12'
              }"
              class="mx-auto w-full"
            >
              <ArticleCard
                :key="item.id"
                :title="item.title"
                :description="item.description"
                :date="item.date"
                :image="item.image"
                :to="item.to"
                :with-padding-x="true"
                :with-rounded="true"
                :with-color-text="false"
                class="my-6 bg-white rounded-lg"
              />
            </UCarousel>

            <!-- Empty State -->
            <div
              v-else
              class="flex flex-col justify-center items-center py-12 text-center"
            >
              <UIcon
                name="i-lucide-newspaper"
                class="mb-4 size-12 text-neutral-400"
              />
              <p class="text-base text-neutral-600">
                Chưa có tin tức nào.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Partners Footer -->
      <div class="pt-8 border-t border-neutral-200">
        <UMarquee
          pause-on-hover
          :overlay="false"
          :ui="{ root: '[--gap:--spacing(6)] [--duration:30s]', content: 'w-auto py-2' }"
          :repeat="2"
        >
          <div
            v-for="partner in partners"
            :key="partner.id"
            class="flex items-center gap-3 md:gap-4 bg-white rounded-lg p-3 md:p-4 border border-neutral-200 shadow-partner-item hover:shadow transition-shadow shrink-0 min-w-[200px] md:min-w-[250px]"
          >
            <div
              class="flex justify-center items-center w-16 h-16 rounded-lg md:w-20 md:h-20 shrink-0 bg-neutral-100"
            >
              <NuxtImg
                :src="partner.logo"
                :alt="partner.name"
                class="object-contain p-2 size-full"
                lazy
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-base font-semibold leading-tight text-color-text-partner line-clamp-2">
                {{ partner.name }}
              </p>
            </div>
          </div>
        </UMarquee>
      </div>
    </UContainer>
  </div>
</template>
