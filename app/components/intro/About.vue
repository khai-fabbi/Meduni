<script setup lang="ts">
import Excellence from '~/assets/icons/excellence.svg'

import Integrity from '~/assets/icons/integrity.svg'

import Humanity from '~/assets/icons/humanity.svg'
import Innovation from '~/assets/icons/innovation.svg'

import Knowledge from '~/assets/icons/knowledge.svg'

import Quality from '~/assets/icons/quality.svg'

const coreValues = [
  {
    title: 'Tinh hoa',
    description: 'Nội dung được chọn lọc và kiểm định nghiêm ngặt, bảo chứng bởi đội ngũ chuyên gia hàng đầu.',
    icon: Excellence
  },
  {
    title: 'Chính trực',
    description: 'Minh bạch, chuẩn xác và tuân thủ tuyệt đối các chuẩn mực đạo đức nghề y.',
    icon: Integrity
  },
  {
    title: 'Nhân văn',
    description: 'Lấy con người làm trung tâm: tôn trọng người học, phụng sự bệnh nhân.',
    icon: Humanity
  },
  {
    title: 'Đổi mới',
    description: 'Ứng dụng AI, dữ liệu và công nghệ tiên tiến nhằm liên tục nâng cao trải nghiệm học tập.',
    icon: Innovation
  },
  {
    title: 'Kết nối tri thức',
    description: 'Kết nối trường y – bệnh viện – chuyên gia – tổ chức để lan tỏa tri thức chuẩn hóa.',
    icon: Knowledge
  },
  {
    title: 'Chất lượng',
    description: 'Cam kết tiêu chuẩn quốc tế trong nội dung, kỹ thuật, vận hành và trải nghiệm người học.',
    icon: Quality
  }
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-7.5">
    <div class="flex flex-col gap-7.5">
      <UPageCard
        class="shadow-lg ring-0 bg-white divide-y-0"
        :ui="{
          header: 'pb-0'
        }"
        spotlight
      >
        <template #title>
          <h2 class="text-3xl md:text-[40px] leading-none font-bold">
            Về chúng tôi
          </h2>
        </template>
        <p class="text-base md:text-lg">
          <strong>MedUni.ai</strong> là nền tảng đào tạo y khoa số tiên phong,
          hội tụ tri thức, kinh nghiệm và chuẩn mực đạo đức nghề y từ các giáo
          sư, bác sĩ đầu ngành. Chúng tôi mang đến hệ sinh thái học tập được cá
          nhân hóa bằng AI, chuẩn hóa bằng chuyên môn và nâng tầm bằng công
          nghệ, nhằm góp phần kiến tạo đội ngũ nhân lực y tế tinh hoa cho Việt
          Nam và khu vực. <br>
          <br>

          <strong>MedUni.ai</strong> cam kết trở thành cầu nối giữa khoa học –
          thực tiễn – công nghệ, giúp tri thức y khoa được truyền đạt một cách
          chính xác, nhân văn và hiệu quả nhất.
        </p>
      </UPageCard>

      <UPageCard
        class="shadow-lg ring-0 bg-white divide-y-0"
        :ui="{
          header: 'pb-0'
        }"
        spotlight
      >
        <template #title>
          <h2 class="text-3xl md:text-[40px] leading-none font-bold">
            Sứ mệnh
          </h2>
        </template>
        <div class="flex gap-6">
          <ul class="list-disc list-inside text-base md:text-lg flex-1 text-justify shrink-0">
            <li>
              <strong>Kết nối tri thức thực hành</strong> từ những chuyên gia,
              giáo sư, bác sĩ đầu ngành.
            </li>
            <li>
              <strong>Ứng dụng AI</strong> để cá nhân hóa lộ trình học tập, gia
              tăng hiệu quả tự học và thực hành lâm sàng.
            </li>
            <li>
              <strong>Kiến tạo môi trường đào tạo chuẩn mực, nhân văn</strong>,
              phù hợp với đặc thù nghề y.
            </li>
            <li>
              <strong>Góp phần phát triển hệ thống y tế bền vững</strong> bằng
              việc chuẩn hóa đào tạo, nâng cao năng lực đội ngũ y tế.
            </li>
          </ul>

          <NuxtImg
            src="/images/intro/meduni-logo.png"
            class="object-contain z-10 xl:block hidden w-2/5 xl:w-[48%] -mt-8"
            alt="Global"
            loading="lazy"
          />
        </div>
      </UPageCard>
    </div>
    <div class="flex flex-col gap-7.5">
      <UPageCard
        class="shadow-lg ring-0 bg-white divide-y-0"
        :ui="{
          header: 'pb-0'
        }"
        spotlight
      >
        <template #title>
          <h2 class="text-3xl md:text-[40px] leading-none font-bold">
            Tầm nhìn
          </h2>
        </template>
        <div class="p-4 bg-intro-card rounded-lg overflow-hidden relative flex items-center gap-2.5">
          <p class="text-base md:text-lg text-white relative z-10 text-justify">
            Xây dựng
            <strong>hệ sinh thái đào tạo y khoa số hàng đầu Việt Nam và Đông Nam
              Á</strong>, nơi tinh hoa y học được chuyển giao chuẩn mực qua công nghệ hiện
            đại, thúc đẩy phát triển nhân lực y tế chuyên nghiệp – đạo đức – bền
            vững.
          </p>
          <NuxtImg
            src="/images/intro/globe.png"
            class="h-25 z-10 object-contain xl:block hidden"
            alt="Global"
          />
        </div>
      </UPageCard>

      <UPageCard
        class="shadow-lg ring-0 bg-white divide-y-0"
        :ui="{
          header: 'pb-0'
        }"
        spotlight
      >
        <template #title>
          <h2 class="text-3xl md:text-[40px] leading-none font-bold">
            Giá trị cốt lõi
          </h2>
        </template>
        <ul class="text-base md:text-lg space-y-6 md:space-y-4">
          <li
            v-for="value in coreValues"
            :key="value.title"
            class="flex items-center flex-wrap gap-2 md:gap-4 xl:flex-nowrap"
          >
            <div class="bg-intro-card w-50 h-12 md:h-15 rounded-full overflow-hidden bg-primary flex items-center justify-center gap-2 md:gap-2.5 shrink-0">
              <component
                :is="value.icon"
                class="size-6 text-white z-2"
              />
              <span class="font-semibold text-base md:text-xl text-white z-3">{{ value.title }}</span>
            </div>
            <p class="text-base rounded-lg md:rounded-full px-4 py-1.5 md:px-7.5 border-primary border-2 min-h-15 flex items-center bg-[#DFEEFF]">
              {{ value.description }}
            </p>
          </li>
        </ul>
      </UPageCard>
    </div>
  </div>
</template>

<style scoped>
.bg-intro-card {
  position: relative;
}

.bg-intro-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/images/intro/bg-card.png') no-repeat center center;
  background-size: cover;
  background-position: center;
  opacity: 0.9;
  z-index: 0;
}
</style>
