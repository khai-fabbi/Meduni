<script setup lang="ts">
import { motion } from 'motion-v'

useSeoMeta({
  title: 'AI trong Y tế',
  description: 'Khám phá ứng dụng của Trí tuệ Nhân tạo trong lĩnh vực Y tế và chăm sóc sức khỏe',
  ogTitle: 'AI trong Y tế',
  ogDescription: 'Khám phá ứng dụng của Trí tuệ Nhân tạo trong lĩnh vực Y tế và chăm sóc sức khỏe'
})

const aiApplications = [
  {
    id: 1,
    title: 'Chẩn đoán Y khoa Thông minh',
    description: 'AI giúp phân tích hình ảnh y tế như X-quang, CT scan, MRI với độ chính xác cao, hỗ trợ bác sĩ phát hiện sớm các bệnh lý như ung thư, bệnh tim mạch.',
    icon: 'i-lucide-scan',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0',
    color: 'primary'
  },
  {
    id: 2,
    title: 'Dự đoán và Phòng ngừa Bệnh tật',
    description: 'Sử dụng Machine Learning để phân tích dữ liệu sức khỏe, dự đoán nguy cơ bệnh tật và đưa ra các khuyến nghị phòng ngừa cá nhân hóa.',
    icon: 'i-lucide-brain',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0',
    color: 'secondary'
  },
  {
    id: 3,
    title: 'Hỗ trợ Quyết định Lâm sàng',
    description: 'Hệ thống AI cung cấp thông tin và gợi ý điều trị dựa trên triệu chứng, tiền sử bệnh và các nghiên cứu y khoa mới nhất.',
    icon: 'i-lucide-stethoscope',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0',
    color: 'primary'
  },
  {
    id: 4,
    title: 'Phát triển Thuốc và Nghiên cứu',
    description: 'AI tăng tốc quá trình phát triển thuốc mới bằng cách phân tích hàng triệu hợp chất, dự đoán hiệu quả và tác dụng phụ.',
    icon: 'i-lucide-flask-conical',
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0',
    color: 'secondary'
  }
]

const benefits = [
  {
    title: 'Độ chính xác cao',
    description: 'Giảm tỷ lệ chẩn đoán sai, tăng độ chính xác lên đến 95%',
    icon: 'i-lucide-target'
  },
  {
    title: 'Tiết kiệm thời gian',
    description: 'Rút ngắn thời gian phân tích từ vài giờ xuống còn vài phút',
    icon: 'i-lucide-clock'
  },
  {
    title: 'Cá nhân hóa điều trị',
    description: 'Đề xuất phác đồ điều trị phù hợp với từng bệnh nhân',
    icon: 'i-lucide-user-check'
  },
  {
    title: 'Tiếp cận rộng rãi',
    description: 'Mang dịch vụ y tế chất lượng đến vùng sâu vùng xa',
    icon: 'i-lucide-globe'
  }
]
</script>

<template>
  <main class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 py-12 md:py-20">
      <UContainer>
        <motion.div
          class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6 }"
        >
          <div class="space-y-6">
            <UBadge
              color="primary"
              size="lg"
              variant="soft"
              class="w-fit"
            >
              Công nghệ Y tế
            </UBadge>

            <Heading
              variant="h1"
              as="h1"
              class="text-primary"
            >
              Trí tuệ Nhân tạo trong Y tế
            </Heading>

            <p class="text-lg md:text-xl text-default leading-relaxed">
              Khám phá cách AI đang cách mạng hóa ngành y tế, từ chẩn đoán chính xác đến điều trị cá nhân hóa,
              mang lại hy vọng mới cho hàng triệu bệnh nhân trên toàn thế giới.
            </p>

            <div class="flex flex-wrap gap-4">
              <UButton
                to="/khoa-hoc"
                size="xl"
                color="primary"
                trailing-icon="i-lucide-arrow-right"
                class="min-h-14"
              >
                Khám phá khóa học
              </UButton>
              <UButton
                to="/gioi-thieu"
                size="xl"
                variant="outline"
                color="primary"
                class="min-h-14"
              >
                Tìm hiểu thêm
              </UButton>
            </div>
          </div>

          <div class="relative">
            <motion.div
              :initial="{ opacity: 0, scale: 0.9 }"
              :animate="{ opacity: 1, scale: 1 }"
              :transition="{ duration: 0.6, delay: 0.2 }"
            >
              <NuxtImg
                src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0"
                alt="AI trong Y tế"
                class="rounded-2xl shadow-2xl w-full h-auto"
                quality="90"
                :placeholder="[50, 25]"
              />
            </motion.div>
          </div>
        </motion.div>
      </UContainer>
    </section>

    <!-- Applications Section -->
    <section class="py-12 md:py-20 bg-white">
      <UContainer>
        <motion.div
          class="text-center mb-12 md:mb-16"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6 }"
        >
          <Heading
            variant="h2"
            as="h2"
            class="text-primary mb-4"
          >
            Ứng dụng AI trong Y tế
          </Heading>
          <p class="text-lg text-default max-w-3xl mx-auto">
            Các ứng dụng thực tế của AI đang thay đổi cách chúng ta chẩn đoán, điều trị và phòng ngừa bệnh tật
          </p>
        </motion.div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <motion.div
            v-for="(app, index) in aiApplications"
            :key="app.id"
            class="group"
            :initial="{ opacity: 0, y: 30 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: index * 0.1 }"
          >
            <div
              class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-200 h-full flex flex-col"
            >
              <div class="relative h-48 md:h-64 overflow-hidden">
                <NuxtImg
                  :src="app.image"
                  :alt="app.title"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  quality="85"
                  :placeholder="[50, 25]"
                />
                <div
                  :class="[
                    'absolute top-4 right-4 p-3 rounded-full',
                    app.color === 'primary' ? 'bg-primary-500/90' : 'bg-secondary-500/90'
                  ]"
                >
                  <UIcon
                    :name="app.icon"
                    class="text-white text-2xl"
                  />
                </div>
              </div>

              <div class="p-6 md:p-8 flex-1 flex flex-col">
                <Heading
                  variant="h3"
                  as="h3"
                  :class="[
                    'mb-4',
                    app.color === 'primary' ? 'text-primary' : 'text-secondary'
                  ]"
                >
                  {{ app.title }}
                </Heading>
                <p class="text-default leading-relaxed flex-1">
                  {{ app.description }}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </UContainer>
    </section>

    <!-- Benefits Section -->
    <section class="py-12 md:py-20 bg-gradient-to-br from-neutral-50 to-primary-50">
      <UContainer>
        <motion.div
          class="text-center mb-12 md:mb-16"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6 }"
        >
          <Heading
            variant="h2"
            as="h2"
            class="text-primary mb-4"
          >
            Lợi ích của AI trong Y tế
          </Heading>
          <p class="text-lg text-default max-w-3xl mx-auto">
            Những cải tiến đáng kể mà AI mang lại cho hệ thống chăm sóc sức khỏe
          </p>
        </motion.div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <motion.div
            v-for="(benefit, index) in benefits"
            :key="index"
            class="bg-white rounded-xl p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow duration-300"
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: index * 0.1 }"
          >
            <div class="flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
              <UIcon
                :name="benefit.icon"
                class="text-primary text-2xl"
              />
            </div>
            <Heading
              variant="h4"
              as="h4"
              class="text-primary mb-3"
            >
              {{ benefit.title }}
            </Heading>
            <p class="text-default text-sm leading-relaxed">
              {{ benefit.description }}
            </p>
          </motion.div>
        </div>
      </UContainer>
    </section>

    <!-- CTA Section -->
    <section class="py-12 md:py-20 bg-gradient-to-r from-primary-600 to-primary-700">
      <UContainer>
        <motion.div
          class="text-center text-white"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6 }"
        >
          <Heading
            variant="h2"
            as="h2"
            class="text-white mb-4"
          >
            Sẵn sàng bắt đầu hành trình với AI?
          </Heading>
          <p class="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Tham gia các khóa học về AI trong Y tế tại MedUni để nắm vững công nghệ tương lai của ngành y tế
          </p>
          <UButton
            to="/khoa-hoc"
            size="xl"
            variant="solid"
            trailing-icon="i-lucide-arrow-right"
            class="min-h-14 bg-white text-primary hover:bg-white/90"
          >
            Xem khóa học ngay
          </UButton>
        </motion.div>
      </UContainer>
    </section>
  </main>
</template>
