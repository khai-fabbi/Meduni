<script setup lang="ts">
const executiveBoard = [
  {
    name: 'Vũ Hữu Đồng',
    role: 'Giám đốc Điều hành',
    description: 'Chịu trách nhiệm chiến lược tổng thể, định hướng tầm nhìn và phát triển hệ sinh thái đào tạo y khoa số.',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Phạm Thị Hương',
    role: 'Giám đốc Học thuật',
    description: 'Phụ trách kiểm định chất lượng nội dung, kết nối chuyên gia và xây dựng chuẩn học thuật cho các chương trình đào tạo.',
    image: 'https://images.unsplash.com/photo-1728577740843-5f29c7586afe?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Vũ Văn Khải',
    role: 'Giám đốc Công nghệ',
    description: 'Xây dựng nền tảng LMS, tích hợp AI, cá nhân hóa lộ trình học và phát triển hệ thống mô phỏng y khoa.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=761&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Đoàn Văn Trung',
    role: 'Giám đốc Vận hành',
    description: 'Quản lý vận hành nền tảng, dịch vụ học viên, tổ chức thi - kiểm tra – cấp chứng chỉ và quản lý quy trình học tập.',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Nguyễn Quang Tân',
    role: 'Giám đốc Phát triển Đối tác',
    description: 'Kết nối các bệnh viện, trường y, hiệp hội y khoa và các tổ chức trong - ngoài nước để xây dựng mạng lưới đào tạo bền vững.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
]
</script>

<template>
  <div class="space-y-6">
    <div class="text-center space-y-2">
      <Heading>
        Ban điều hành viện
      </Heading>
      <p class="text-base">
        Ban Điều Hành MedUni.ai là đội ngũ kết hợp giữa <strong>chuyên môn y khoa, công nghệ, quản trị giáo dục và nghiên cứu phát triển hệ thống đào tạo số</strong>.
      </p>
    </div>

    <ul class="flex flex-wrap justify-center">
      <li
        v-for="(member, idx) in executiveBoard"
        :key="idx"
        class="w-full md:w-1/2 xl:w-1/3"
      >
        <div
          class="h-[-webkit-fill-available] relative flex flex-col gap-4 rounded-xl mx-3.5 my-10 md:my-12 bg-white shadow-lg p-6 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 md:-translate-y-1/3">
            <div
              class="p-0.5 size-28 md:size-40 rounded-full bg-gradient-to-r from-secondary-500 to-secondary-300 transition-all duration-300 hover:scale-110 hover:rotate-[5deg]"
            >
              <UAvatar
                :src="member.image"
                class="size-full"
                :alt="member.name"
              />
            </div>
          </div>
          <div class="flex gap-4 mt-10 md:mt-0 md:ml-44">
            <div class="flex-1 flex flex-col gap-2 md:gap-4">
              <span class="text-base md:text-lg">
                {{ member.role }}
              </span>
              <h3 class="text-xl md:text-2xl leading-tight font-bold">
                {{ member.name }}
              </h3>
            </div>
          </div>
          <p class="text-base md:text-lg">
            {{ member.description }}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
