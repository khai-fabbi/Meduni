<script setup lang="ts">
import DigitizingKnowledge from '~/assets/icons/digitizing-knowledge.svg'
import PersonalizedLearning from '~/assets/icons/personalized-learning.svg'
import VirtualSimulation from '~/assets/icons/virtual-simulation.svg'
import HospitalNetwork from '~/assets/icons/hospital-network.svg'
import GlobalReach from '~/assets/icons/global-reach.svg'

const developmentOrientations = [
  {
    title: 'Số hóa tri thức y khoa chuẩn mực',
    description: 'Hệ thống hóa và chuẩn hóa bài giảng, quy trình thực hành, phác đồ và kiến thức chuyên môn theo chuẩn quốc tế.',
    icon: DigitizingKnowledge
  },
  {
    title: 'Cá nhân hóa lộ trình học bằng AI',
    description: 'Ứng dụng AI để phân tích năng lực, mức độ hiểu bài và tự động gợi ý lộ trình học phù hợp với từng bác sĩ, điều dưỡng, kỹ thuật viên y tế và sinh viên y khoa.',
    icon: PersonalizedLearning
  },
  {
    title: 'Mô phỏng và thực hành số hóa',
    description: 'Kết hợp AI – 3D – mô phỏng để tạo môi trường học tập thực hành an toàn, hiệu quả, giảm phụ thuộc vào điều kiện bệnh viện đông đúc.',
    icon: VirtualSimulation
  },
  {
    title: 'Kết nối hệ sinh thái bệnh viện – trường y – tổ chức y tế',
    description: 'Tạo không gian chia sẻ tri thức và phát triển nghề nghiệp cho cộng đồng y khoa.',
    icon: HospitalNetwork
  },
  {
    title: 'Hướng đến tiêu chuẩn khu vực và quốc tế',
    description: 'Định hướng xây dựng MedUni.ai trở thành nền tảng LMS y khoa hàng đầu tại Đông Nam Á, đóng góp vào sự phát triển của nhân lực y tế chất lượng cao',
    icon: GlobalReach
  }
]
</script>

<template>
  <div class="flex flex-col gap-6 items-center md:gap-7.5">
    <Heading>
      Định hướng phát triển
    </Heading>
    <ul class="flex flex-wrap justify-center">
      <li
        v-for="(orientation, idx) in developmentOrientations"
        :key="idx"
        class="w-full md:w-1/2 xl:w-1/3"
      >
        <div class="h-auto md:h-[-webkit-fill-available] flex gap-4 md:gap-5 border border-primary rounded-lg m-3.5 bg-gradient-to-b from-primary-50 to-transparent p-4">
          <div class="flex relative justify-center items-center p-2 rounded-lg bg-primary size-16 md:size-20">
            <component
              :is="orientation.icon"
              class="size-10 text-primary"
            />
          </div>
          <div class="flex flex-col flex-1 gap-2 mb-4">
            <h3 class="text-xl font-bold leading-tight md:text-2xl">
              {{ orientation.title }}
            </h3>
            <p class="text-sm md:text-base">
              {{ orientation.description }}
            </p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
