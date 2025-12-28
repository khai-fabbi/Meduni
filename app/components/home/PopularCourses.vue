<script setup lang="ts">
import PopularCourseCard from '../course/PopularCourseCard.vue'

const popularCourses = [
  {
    id: 1,
    title: 'Khóa học AI trong Y tế - Cơ bản',
    description: 'Khóa học cung cấp kiến thức nền tảng về ứng dụng trí tuệ nhân tạo trong lĩnh vực y tế, giúp bạn hiểu rõ các khái niệm cơ bản và cách thức AI được áp dụng để cải thiện chất lượng chăm sóc sức khỏe.',
    duration: '10 giờ',
    price: 2990000,
    image: '/images/course/course-placeholder.png',
    to: '#'
  },
  {
    id: 2,
    title: 'Deep Learning cho Chẩn đoán Y khoa',
    description: 'Học cách sử dụng các mô hình deep learning để phân tích hình ảnh y tế, chẩn đoán bệnh và hỗ trợ các bác sĩ trong việc đưa ra quyết định chính xác hơn. Khóa học bao gồm các case study thực tế từ các bệnh viện hàng đầu.',
    duration: '15 giờ',
    price: 3990000,
    image: '/images/course/course-placeholder.png',
    to: '#'
  },
  {
    id: 3,
    title: 'Machine Learning ứng dụng trong Y tế',
    description: 'Khám phá các thuật toán machine learning được sử dụng để dự đoán bệnh, phân loại bệnh nhân và tối ưu hóa quy trình điều trị. Khóa học phù hợp cho cả người mới bắt đầu và những ai đã có kinh nghiệm.',
    duration: '12 giờ',
    price: 3490000,
    image: '/images/course/course-placeholder.png',
    to: '#'
  },
  {
    id: 4,
    title: 'Xử lý ảnh Y tế với AI',
    description: 'Học các kỹ thuật xử lý và phân tích ảnh y tế như X-ray, CT scan, MRI bằng công nghệ AI. Khóa học cung cấp kiến thức từ cơ bản đến nâng cao về computer vision trong y tế.',
    duration: '8 giờ',
    price: 2490000,
    image: '/images/course/course-placeholder.png',
    to: '#'
  },
  {
    id: 5,
    title: 'AI trong Quản lý Bệnh viện',
    description: 'Tìm hiểu cách ứng dụng AI để tối ưu hóa quy trình quản lý bệnh viện, lập lịch khám bệnh, quản lý tài nguyên và cải thiện trải nghiệm của bệnh nhân. Khóa học kết hợp lý thuyết và thực hành.',
    duration: '14 giờ',
    price: 3790000,
    image: '/images/course/course-placeholder.png',
    to: '#'
  },
  {
    id: 6,
    title: 'Phân tích Dữ liệu Y tế với Python',
    description: 'Học cách sử dụng Python để phân tích dữ liệu y tế lớn, tìm kiếm patterns và insights quan trọng. Khóa học bao gồm các thư viện như Pandas, NumPy, Matplotlib và các công cụ visualization chuyên dụng.',
    duration: '16 giờ',
    price: 4290000,
    image: '/images/course/course-placeholder.png',
    to: '#'
  }
]
</script>

<template>
  <UContainer class="py-6 space-y-5 md:py-15">
    <Heading class="text-center">
      Khoá học <span class="text-secondary">được mua nhiều nhất</span>
    </Heading>

    <UCarousel
      v-slot="{ item }"
      :items="popularCourses"
      wheel-gestures
      arrows
      :prev="{
        icon: 'i-lucide-chevron-left',
        color: 'primary',
        variant: 'subtle',
        class: 'shadow-sm'
      }"
      :next="{
        icon: 'i-lucide-chevron-right',
        color: 'primary',
        variant: 'subtle',
        class: 'shadow-sm'
      }"
      :ui="{
        item: 'md:basis-[28.5%] xl:basis-[28.5%]',
        container: 'py-3 relative',
        arrows: 'md:hidden',
        prev: 'sm:start-6',
        next: 'sm:end-6'
      }"
    >
      <PopularCourseCard
        :title="item.title"
        :description="item.description"
        :duration="item.duration"
        :price="item.price"
        :image="item.image"
        :to="item.to"
      />
    </UCarousel>
  </UContainer>
</template>
