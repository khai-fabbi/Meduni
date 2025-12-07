<script setup lang="ts"></script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-7.5">
    <div class="flex flex-col gap-7.5">
      <UPageCard
        class="shadow-lg ring-0 bg-white divide-y-0"
        :ui="{
          header: 'pb-0',
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
          Nam và khu vực. <br />
          <br />

          <strong>MedUni.ai</strong> cam kết trở thành cầu nối giữa khoa học –
          thực tiễn – công nghệ, giúp tri thức y khoa được truyền đạt một cách
          chính xác, nhân văn và hiệu quả nhất.
        </p>
      </UPageCard>

      <UPageCard
        class="shadow-lg ring-0 bg-white divide-y-0"
        :ui="{
          header: 'pb-0',
        }"
        spotlight
      >
        <template #title>
          <h2 class="text-3xl md:text-[40px] leading-none font-bold">
            Sứ mệnh
          </h2>
        </template>
        <ul class="list-disc list-inside text-base md:text-lg">
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
      </UPageCard>
    </div>
    <div class="flex flex-col gap-7.5">
      <UPageCard
        class="shadow-lg ring-0 bg-white divide-y-0"
        :ui="{
          header: 'pb-0',
        }"
        spotlight
      >
        <template #title>
          <h2 class="text-3xl md:text-[40px] leading-none font-bold">
            Tầm nhìn
          </h2>
        </template>
        <p class="text-base md:text-lg">
          Xây dựng
          <strong
            >hệ sinh thái đào tạo y khoa số hàng đầu Việt Nam và Đông Nam
            Á</strong
          >, nơi tinh hoa y học được chuyển giao chuẩn mực qua công nghệ hiện
          đại, thúc đẩy phát triển nhân lực y tế chuyên nghiệp – đạo đức – bền
          vững.
        </p>
      </UPageCard>

      <UPageCard
        class="shadow-lg ring-0 bg-white divide-y-0"
        :ui="{
          header: 'pb-0',
        }"
        spotlight
      >
        <template #title>
          <h2 class="text-3xl md:text-[40px] leading-none font-bold">
            Giá trị cốt lõi
          </h2>
        </template>
        <ul class="list-disc list-inside text-base md:text-lg">
          <li>
            <strong>Tinh hoa:</strong> Nội dung được chọn lọc và kiểm định
            nghiêm ngặt, bảo chứng bởi đội ngũ chuyên gia hàng đầu.
          </li>
          <li>
            <strong>Chính trực:</strong> Minh bạch, chuẩn xác và tuân thủ tuyệt
            đối các chuẩn mực đạo đức nghề y.
          </li>

          <li>
            <strong>Nhân văn:</strong> Lấy con người làm trung tâm: tôn trọng
            người học, phụng sự bệnh nhân.
          </li>

          <li>
            <strong>Đổi mới:</strong> Ứng dụng AI, dữ liệu và công nghệ tiên
            tiến nhằm liên tục nâng cao trải nghiệm học tập.
          </li>
          <li>
            <strong>Kết nối tri thức:</strong> Kết nối trường y – bệnh viện –
            chuyên gia – tổ chức để lan tỏa tri thức chuẩn hóa.
          </li>

          <li>
            <strong>Chất lượng:</strong> Cam kết tiêu chuẩn quốc tế trong nội
            dung, kỹ thuật, vận hành và trải nghiệm người học.
          </li>
        </ul>
      </UPageCard>
    </div>
  </div>
</template>
