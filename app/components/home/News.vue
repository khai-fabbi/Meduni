<script setup lang="ts">
interface NewsEvent {
  id: number
  title: string
  description: string
  date: string
  time: string
  image: string
  to?: string
}

const newsEvents: NewsEvent[] = [
  {
    id: 1,
    title: 'Chiến lược trí tuệ nhân tạo dành cho doanh nghiệp',
    description: 'Tầm nhìn - chiến lược - thực thi. Doanh nghiệp đột phá dẫn đầu kỷ nguyên số',
    date: '10/10/2025',
    time: '14:00 - 16:00',
    image: '/images/course/course-placeholder.png',
    to: '/blog/chien-luoc-tri-tue-nhan-tao'
  },
  {
    id: 2,
    title: 'Khóa đào tạo AI cho marketer không chuyên',
    description: 'Tầm nhìn - chiến lược - thực thi. Doanh nghiệp đột phá dẫn đầu kỷ nguyên số',
    date: '10/10/2025',
    time: '14:00 - 16:00',
    image: '/images/course/course-placeholder.png',
    to: '/blog/khoa-dao-tao-ai-marketer'
  },
  {
    id: 3,
    title: 'Chiến lược Marketing thời đại AI',
    description: 'Tầm nhìn - chiến lược - thực thi. Doanh nghiệp đột phá dẫn đầu kỷ nguyên số',
    date: '10/10/2025',
    time: '14:00 - 16:00',
    image: '/images/course/course-placeholder.png',
    to: '/blog/chien-luoc-marketing-ai'
  },
  {
    id: 4,
    title: 'Bứt phá hiệu suất công việc',
    description: 'Tầm nhìn - chiến lược - thực thi. Doanh nghiệp đột phá dẫn đầu kỷ nguyên số',
    date: '10/10/2025',
    time: '14:00 - 16:00',
    image: '/images/course/course-placeholder.png',
    to: '/blog/but-pha-hieu-suat-cong-viec'
  },
  {
    id: 5,
    title: 'Chiến lược trí tuệ nhân tạo dành cho doanh nghiệp',
    description: 'Tầm nhìn - chiến lược - thực thi. Doanh nghiệp đột phá dẫn đầu kỷ nguyên số',
    date: '10/10/2025',
    time: '14:00 - 16:00',
    image: '/images/course/course-placeholder.png',
    to: '/blog/chien-luoc-tri-tue-nhan-tao'
  },
  {
    id: 6,
    title: 'Khóa đào tạo AI cho marketer không chuyên',
    description: 'Tầm nhìn - chiến lược - thực thi. Doanh nghiệp đột phá dẫn đầu kỷ nguyên số',
    date: '10/10/2025',
    time: '14:00 - 16:00',
    image: '/images/course/course-placeholder.png',
    to: '/blog/khoa-dao-tao-ai-marketer'
  },
  {
    id: 7,
    title: 'Chiến lược Marketing thời đại AI',
    description: 'Tầm nhìn - chiến lược - thực thi. Doanh nghiệp đột phá dẫn đầu kỷ nguyên số',
    date: '10/10/2025',
    time: '14:00 - 16:00',
    image: '/images/course/course-placeholder.png',
    to: '/blog/chien-luoc-marketing-ai'
  },
  {
    id: 8,
    title: 'Bứt phá hiệu suất công việc',
    description: 'Tầm nhìn - chiến lược - thực thi. Doanh nghiệp đột phá dẫn đầu kỷ nguyên số',
    date: '10/10/2025',
    time: '14:00 - 16:00',
    image: '/images/course/course-placeholder.png',
    to: '/blog/but-pha-hieu-suat-cong-viec'
  }
]

interface Partner {
  id: number
  name: string
  logo?: string
}

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
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-0">
        <div class="flex-1">
          <Heading
            class="text-center md:text-left"
            variant="h3"
          >
            Tin tức chuyển động cùng <span class="text-secondary">MEDUNI</span>
          </Heading>
          <p class="text-xl md:text-lg text-center md:text-left max-w-2xl">
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
            <UCarousel
              v-slot="{ item }"
              auto-height
              arrows
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
              class="w-full mx-auto"
            >
              <ArticleCard
                :key="item.id"
                :title="item.title"
                :description="item.description"
                :date="item.date"
                :image="item.image"
                :with-padding-x="true"
                :with-rounded="true"
                :with-color-text="false"
                class="my-6 bg-white rounded-lg"
              />
            </UCarousel>
          </div>
        </div>
      </div>

      <!-- Partners Footer -->
      <div class="border-t border-neutral-200 pt-8">
        <UMarquee
          pause-on-hover
          :overlay="true"
          :ui="{ root: '[--gap:--spacing(6)] [--duration:30s]', content: 'w-auto py-2' }"
          :repeat="2"
        >
          <div
            v-for="partner in partners"
            :key="partner.id"
            class="flex items-center gap-3 md:gap-4 bg-white rounded-lg p-3 md:p-4 border border-neutral-200 shadow-partner-item hover:shadow-md transition-shadow shrink-0 min-w-[200px] md:min-w-[250px]"
          >
            <div
              class="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-lg bg-neutral-100 flex items-center justify-center"
            >
              <NuxtImg
                :src="partner.logo"
                :alt="partner.name"
                class="size-full object-contain p-2"
                lazy
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-base text-color-text-partner font-semibold leading-tight line-clamp-2">
                {{ partner.name }}
              </p>
            </div>
          </div>
        </UMarquee>
      </div>
    </UContainer>
  </div>
</template>
