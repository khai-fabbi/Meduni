<script setup lang="ts">
const items = [
  {
    no: 1,
    name: 'Banner 1',
    image: '/home/banner/hero-slide-1.png',
    slogan: 'Nâng tầm học tập Chuẩn mực Y khoa',
    description: 'Hệ thống đào tạo trực tuyến chuyên ngành Y học, nội dung chính thống, được thiết kế bởi đội ngũ chuyên gia và ứng dụng công nghệ số hiện đại.'
  },
  {
    no: 2,
    name: 'Banner 2',
    image: '/home/banner/hero-slide-2.png',
    slogan: 'Đào tạo Y khoa thời đại số',
    description: 'MedUni.ai - Nền tảng LMS chuyên sâu cho lĩnh vực Y học – học mọi lúc, mọi nơi với lộ trình rõ ràng, nội dung chuẩn hóa và chứng chỉ uy tín.'
  }
]
</script>

<template>
  <div class="">
    <UCarousel
      v-slot="{ item }"
      dots
      loop
      arrows
      auto-height
      :items="items"
      :prev="{
        icon: 'i-lucide-chevron-left',
        class: '!rounded-sm !bg-white/50'
      }"
      :next="{
        icon: 'i-lucide-chevron-right',
        class: '!rounded-sm !bg-white/50'
      }"
      :ui="{
        controls: 'absolute w-full bottom-6 md:bottom-7 md:right-20 md:w-30 shrink-0',
        dots: 'bottom-0 translate-y-1/2 w-full',
        dot: 'w-4 h-1.5 data-[state=active]:bg-primary data-[state=active]:w-8 transition-all'
      }"
    >
      <template v-if="item.no === 1">
        <div class="bg-item-1 min-h-[500px] h-[550px] md:h-[calc(90vh-100px)]">
          <UContainer class="flex items-center h-full">
            <div class="flex flex-col flex-[2.5]">
              <span class="text-4xl font-extrabold leading-normal uppercase select-none mt-4.5 banner-text md:text-6xl">
                {{ item.slogan }}
              </span>
              <p class="text-lg md:text-xl">
                {{ item.description }}
              </p>
              <NuxtLink to="/khoa-hoc">
                <UButton
                  size="xl"
                  class="mt-8 min-h-15 bg-gradient-to-b from-primary to-primary-700 hover:from-primary-700 hover:to-primary min-w-[350px] text-2xl justify-center w-fit text-white font-bold rounded-full"
                  color="primary"
                  trailing-icon="i-lucide-chevrons-right"
                  :ui="{
                    base: 'group',
                    trailingIcon: 'group-hover:translate-x-1 transition-transform animation-pulse'
                  }"
                >
                  KHÁM PHÁ KHOÁ HỌC
                </UButton>
              </NuxtLink>
            </div>

            <div class="hidden justify-end items-center md:flex-3 md:flex">
              <NuxtImg
                :src="item.image"
                :alt="item.name"
                class="object-contain rounded-lg size-full md:max-w-[90%]"
                quality="100"
                width="100%"
                height="550"
              />
            </div>
          </UContainer>
        </div>
      </template>

      <template v-if="item.no === 2">
        <div class="bg-item-1 min-h-[500px] h-[550px] md:h-[calc(90vh-100px)]">
          <UContainer class="flex items-center h-full">
            <div class="flex flex-col flex-2">
              <span class="text-4xl font-extrabold leading-normal uppercase select-none mt-4.5 banner-text md:text-6xl">
                {{ item.slogan }}
              </span>
              <p class="text-lg md:text-xl">
                {{ item.description }}
              </p>
              <NuxtLink to="/gioi-thieu">
                <UButton
                  size="xl"
                  class="mt-8 md:min-h-15 bg-gradient-to-b from-secondary to-secondary-700 hover:from-secondary-700 hover:to-secondary min-w-[280px] text-2xl justify-center w-fit text-white font-bold rounded-full"
                  color="secondary"
                  trailing-icon="i-lucide-arrow-right"
                  :ui="{
                    base: 'group',
                    trailingIcon: 'group-hover:translate-x-1 transition-transform animation-pulse'
                  }"
                >
                  Tìm hiểu ngay
                </UButton>
              </NuxtLink>
            </div>

            <div class="hidden justify-end items-center md:flex-3 md:flex">
              <NuxtImg
                :src="item.image"
                :alt="item.name"
                class="object-contain rounded-lg size-full md:max-w-4/5"
                quality="100"
                width="100%"
                height="500"
                :placeholder="[20, 5]"
              />
            </div>
          </UContainer>
        </div>
      </template>
    </UCarousel>
  </div>
</template>

<style scoped>
.bg-item-1 {
  background-image: url('/home/banner/background-slide-1.png');
  background-size: cover;
  background-position: center;
}

.banner-text {
  background: linear-gradient(to bottom, #1B8FF3 0%, #0064BA 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.banner-text-gradient {
  background: linear-gradient(to bottom, #A25A40 0%, #793C26 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 1px 2px rgba(162, 90, 64, 0.15)) drop-shadow(0 2px 4px rgba(162, 90, 64, 0.1));
}
</style>
