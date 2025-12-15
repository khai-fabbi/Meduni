<script setup lang="ts">
import ProgramNumber1 from '~/assets/icons/program-number-1.svg'
import ProgramNumber2 from '~/assets/icons/program-number-2.svg'
import ProgramNumber3 from '~/assets/icons/program-number-3.svg'

import CertificateReputation from '~/assets/icons/certificate-reputation.svg'
import Expert from '~/assets/icons/expert.svg'
import ModernManagement from '~/assets/icons/modern-management.svg'
import IntegratedTechnology from '~/assets/icons/integrated-technology.svg'

const trainingPrograms = [
  {
    title: 'Kiến thức y học cơ sở',
    description: 'Xây dựng nền tảng kiến thức cốt lõi và phát triển tư duy thông qua các bài giảng chuyên ngành.'
  },
  {
    title: 'Kiểm tra kiến thức sau mỗi bài học',
    description: 'Áp dụng kiến thức vào thực tế qua các bài Quiz sau mỗi bài giảng và khi hoàn thành khoá học.'
  },
  {
    title: 'Chuyên khoa và tốt nghiệp',
    description: 'Kiến thức vững chắc, bám sát thực tế giúp bạn khi tốt nghiệp khoá học sẽ có lượng kiến thức phong phú và sát với thực tiễn.'
  }
]

const benefits = [
  {
    title: 'Chứng chỉ uy tín',
    description: 'Viện nghiên cứu điện tử, Tin học & Tự động hoá',
    icon: CertificateReputation
  },
  {
    title: 'Chuyên gia đầu ngành',
    description: 'Khóa học theo chuẩn quốc tế từ các đại học hàng đầu thế giới',
    icon: Expert
  },
  {
    title: 'Quản trị y tế hiện đại',
    description: 'Top các đơn vị đào tạo ứng dụng AI hàng đầu',
    icon: ModernManagement
  },
  {
    title: 'Tích hợp công nghệ AI',
    description: 'Trợ lý AI hỗ trợ học tập, cập nhật kiến thức 24/',
    icon: IntegratedTechnology
  }
]
</script>

<template>
  <UContainer class="py-6 md:py-15">
    <div class="flex flex-col lg:flex-row gap-6 md:gap-7.5">
      <section class="lg:flex-2 space-y-4 lg:pr-9">
        <Heading
          variant="h1"
          as="h2"
          class="text-secondary"
        >
          <span class="text-default text-xl md:text-[2rem] block">Chương trình</span>đào tạo khác biệt
        </Heading>
        <p class="text-base md:text-xl">
          Phá vỡ lối mòn học tập cũ – chương trình được thiết kế thực tiễn, cá nhân hoá, giúp bạn làm chủ công nghệ AI một cách nhanh chóng và hiệu quả.
        </p>

        <ul class="space-y-4">
          <li
            v-for="(program, idx) in trainingPrograms"
            :key="program.title"
          >
            <div class="flex gap-2.5">
              <ProgramNumber1
                v-if="idx === 0"
                class="size-6 md:size-8 shrink-0"
              />
              <ProgramNumber2
                v-if="idx === 1"
                class="size-6 md:size-8 shrink-0"
              />
              <ProgramNumber3
                v-if="idx === 2"
                class="size-6 md:size-8 shrink-0"
              />
              <div class="space-y-1.5">
                <Heading
                  variant="h5"
                >
                  {{ program.title }}
                </Heading>
                <p class="text-base md:text-lg">
                  {{ program.description }}
                </p>
              </div>
            </div>
          </li>
        </ul>
      </section>

      <section class="lg:flex-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="benefit in benefits"
          :key="benefit.title"
          class="bg-card flex flex-col items-center bg-white rounded-lg p-4 shadow-md sm:p-5 md:p-6"
        >
          <div class="size-16 sm:size-20 mb-4 sm:mb-7 flex items-center justify-center rounded-full bg-gradient-to-b from-primary to-primary-700">
            <component
              :is="benefit.icon"
              class="size-10 sm:size-12"
            />
          </div>
          <Heading
            variant="h4"
            class="text-center"
          >
            {{ benefit.title }}
          </Heading>
          <p class="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg text-center max-w-75">
            {{ benefit.description }}
          </p>
        </div>
      </section>
    </div>
  </UContainer>
</template>

<style scoped>
  .bg-card {
    position: relative;
  }
  .bg-card::before {
    content: '';
    position: absolute;
    display: block;
    left: 0;
    right: 0;
    bottom: -3px;
    width: 100%;
    height: 100%;
    border-radius: 1.2rem;
    z-index: -1;
    background: linear-gradient(to bottom, #e1eeff, #0064BA);
  }
  @media (min-width: 640px) {
    .bg-card::before {
      bottom: -4px;
      border-radius: 1.3rem;
    }
  }
</style>
