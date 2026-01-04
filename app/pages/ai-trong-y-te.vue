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
    image: 'https://plus.unsplash.com/premium_photo-1698421947098-d68176a8f5b2?q=80&w=1052&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    <section class="relative py-12 bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 md:py-20">
      <UContainer>
        <motion.div
          class="grid grid-cols-1 gap-8 items-center lg:grid-cols-2 md:gap-12"
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

            <p class="text-lg leading-relaxed md:text-xl text-default">
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
                src="https://plus.unsplash.com/premium_photo-1681843039768-0e22b7a031d5?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="AI trong Y tế"
                class="w-full h-auto rounded-2xl shadow-2xl"
                quality="100"
                :placeholder="[50, 25]"
              />
            </motion.div>
          </div>
        </motion.div>
      </UContainer>
    </section>

    <!-- Applications Section -->
    <section class="py-12 bg-white md:py-20">
      <UContainer>
        <motion.div
          class="mb-12 text-center md:mb-16"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6 }"
        >
          <Heading
            variant="h2"
            as="h2"
            class="mb-4 text-primary"
          >
            Ứng dụng AI trong Y tế
          </Heading>
          <p class="mx-auto max-w-3xl text-lg text-default">
            Các ứng dụng thực tế của AI đang thay đổi cách chúng ta chẩn đoán, điều trị và phòng ngừa bệnh tật
          </p>
        </motion.div>

        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          <motion.div
            v-for="(app, index) in aiApplications"
            :key="app.id"
            class="group"
            :initial="{ opacity: 0, y: 30 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: index * 0.1 }"
          >
            <div
              class="flex overflow-hidden flex-col h-full bg-white rounded-2xl border shadow-lg transition-all duration-300 hover:shadow-xl border-neutral-200"
            >
              <div class="overflow-hidden relative h-48 md:h-64">
                <NuxtImg
                  :src="app.image"
                  :alt="app.title"
                  class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  quality="85"
                  :placeholder="[50, 25]"
                />
                <div
                  :class="[
                    'absolute size-12 flex items-center justify-center top-4 right-4 p-3 rounded-full',
                    app.color === 'primary' ? 'bg-primary-500/90' : 'bg-secondary-500/90'
                  ]"
                >
                  <UIcon
                    :name="app.icon"
                    class="text-2xl text-white"
                  />
                </div>
              </div>

              <div class="flex flex-col flex-1 p-6 md:p-8">
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
                <p class="flex-1 leading-relaxed text-default">
                  {{ app.description }}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </UContainer>
    </section>

    <!-- Benefits Section -->
    <section class="py-12 bg-gradient-to-br md:py-20 from-neutral-50 to-primary-50">
      <UContainer>
        <motion.div
          class="mb-12 text-center md:mb-16"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6 }"
        >
          <Heading
            variant="h2"
            as="h2"
            class="mb-4 text-primary"
          >
            Lợi ích của AI trong Y tế
          </Heading>
          <p class="mx-auto max-w-3xl text-lg text-default">
            Những cải tiến đáng kể mà AI mang lại cho hệ thống chăm sóc sức khỏe
          </p>
        </motion.div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
          <motion.div
            v-for="(benefit, index) in benefits"
            :key="index"
            class="p-6 bg-white rounded-xl shadow-md transition-shadow duration-300 md:p-8 hover:shadow-lg"
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: index * 0.1 }"
          >
            <div class="flex justify-center items-center mb-4 w-16 h-16 rounded-full bg-primary-100">
              <UIcon
                :name="benefit.icon"
                class="text-2xl text-primary"
              />
            </div>
            <Heading
              variant="h4"
              as="h4"
              class="mb-3 text-primary"
            >
              {{ benefit.title }}
            </Heading>
            <p class="text-sm leading-relaxed text-default">
              {{ benefit.description }}
            </p>
          </motion.div>
        </div>
      </UContainer>
    </section>

    <!-- CTA Section -->
    <section class="py-12 bg-gradient-to-r md:py-20 from-primary-600 to-primary-700">
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
            class="mb-4 text-white"
          >
            Sẵn sàng bắt đầu hành trình với AI?
          </Heading>
          <p class="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            Tham gia các khóa học về AI trong Y tế tại MedUni để nắm vững công nghệ tương lai của ngành y tế
          </p>
          <UButton
            to="/khoa-hoc"
            size="xl"
            variant="solid"
            trailing-icon="i-lucide-arrow-right"
            class="bg-white min-h-14 text-primary hover:bg-white/90"
          >
            Xem khóa học ngay
          </UButton>
        </motion.div>
      </UContainer>
    </section>
  </main>
</template>
