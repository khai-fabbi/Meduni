<script setup lang="ts">
import CoreCompetenciesCardItem from './CoreCompetenciesCardItem.vue'
import PeopleTeam from '~/assets/icons/people-team.svg'
import PeopleTeamSetting from '~/assets/icons/people-team-setting.svg'
import TransferTechnology from '~/assets/icons/transfer-technology.svg'
import Network from '~/assets/icons/network.svg'
</script>

<template>
  <div>
    <Heading class="text-center">
      Năng lực cốt lõi
    </Heading>

    <div class="mt-7.5">
      <ul class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-7.5">
        <li>
          <CoreCompetenciesCardItem
            title="Đào tạo đa đối tượng ứng dụng AI"
            :icon="PeopleTeam"
          >
            <div class="space-y-2">
              <p>Học viện sở hữu hệ thống chương trình đào tạo được thiết kế chuyên biệt cho từng nhóm:</p>
              <ul class="list-disc list-inside grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-1">
                <li>Cơ quan nhà nước</li>
                <li>
                  Sinh viên & người đi làm
                </li>
                <li>Cán bộ quản lý & lãnh đạo cấp cao</li>
                <li>Trẻ em & học sinh</li>
                <li>Doanh nghiệp & tổ chức</li>
              </ul>
            </div>
          </CoreCompetenciesCardItem>
        </li>

        <li>
          <CoreCompetenciesCardItem
            title="Chuyển giao công nghệ & giải pháp AI"
            :icon="TransferTechnology"
          >
            <div>
              <p>
                Triển khai các sản phẩm AI thiết thực như: hệ thống LMS, trợ giảng thông minh, chatbot đa kênh, bộ nhân sự số AI…
              </p>
              <p>
                Tư vấn và xây dựng hệ thống ứng dụng AI nội bộ cho doanh nghiệp, trường học, tổ chức công.
                Đồng hành cùng các tổ chức trong hành trình chuyển đổi số hiệu quả.
              </p>
            </div>
          </CoreCompetenciesCardItem>
        </li>

        <li>
          <CoreCompetenciesCardItem
            title="Đội ngũ chuyên gia giàu kinh nghiệm"
            :icon="PeopleTeamSetting"
          >
            <ul class="list-disc list-inside space-y-1">
              <li>Hội tụ các chuyên gia hàng đầu trong giáo dục, công nghệ, chuyển đổi số và AI ứng dụng.</li>
              <li>Có kinh nghiệm làm việc với các tập đoàn lớn, cơ quan nhà nước và startup công nghệ.</li>
              <li>Năng lực thiết kế và triển khai chương trình đào tạo, tư vấn phù hợp với từng lĩnh vực.</li>
            </ul>
          </CoreCompetenciesCardItem>
        </li>

        <li>
          <CoreCompetenciesCardItem
            title="Hợp tác sâu rộng – kết nối hệ sinh thái"
            :icon="Network"
          >
            <ul class="list-disc list-inside space-y-1">
              <li>Hợp tác với các viện nghiên cứu, trường ĐH, doanh nghiệp công nghệ và tổ chức quốc tế.</li>
              <li>Chủ động chia sẻ tri thức, kết nối mạng lưới AI tại Việt Nam.</li>
              <li>Hỗ trợ lan tỏa các chương trình AI đến cộng đồng thông qua đào tạo, truyền thông và chuyển giao nội dung.</li>
            </ul>
          </CoreCompetenciesCardItem>
        </li>
      </ul>
    </div>
  </div>
</template>
