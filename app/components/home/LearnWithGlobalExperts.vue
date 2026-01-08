<script setup lang="ts">
const tags = [
  'E-Learning',
  'Deep Learning',
  'Sale with AI',
  'Marketing',
  'Life skills'
]
const experts = [
  {
    name: 'Dr. Park Hyun-Woo',
    image: '/home/global/bac-si-Park-Hyun-Woo.png',
    description: 'Bác sĩ Chỉnh hình – Seoul National University Hospital'
  },
  {
    name: 'Dr. Jonathan Miller',
    image: '/home/global/bac-si-Jonathan-Miller.png',
    description: 'Bác sĩ tim mạch Mayo-Clinic Hoa kỳ'
  },
  {
    name: 'Bs. Phạm Ly',
    image: '/home/global/bac-si-Pham-Ly.png',
    description: 'CEO & Fouder của Le’Bali Skinlab'
  },
  {
    name: 'Gv. Phạm Việt Đức',
    image: '/home/global/giang-vien-Pham-Viet-Duc.png',
    description: 'Giảng viên'
  },
  {
    name: 'Gv. Nguyễn Thành Trung',
    image: '/home/global/giang-vien-nguyen-thanh-tung.png',
    description: 'Giảng viên'
  },
  {
    name: 'Gv. Nguyễn Kim Anh',
    image: '/home/global/giang-vien-nguyen-kim-anh.png',
    description: 'Giảng viên'
  },
  {
    name: 'Gv. Nguyễn Quốc Khánh',
    image: '/home/global/giang-vien-nguyen-quoc-khanh.png',
    description: 'Giảng viên'
  }
]
</script>

<template>
  <section class="section-background py-8 md:py-20">
    <UContainer class="space-y-4 md:space-y-7">
      <div class="space-y-4 md:space-y-7 text-center">
        <Heading class="text-white">
          Học hỏi từ những giảng viên quốc tế
        </Heading>
        <p class="text-base md:text-lg text-white">
          Với kinh nghiệm phong phú và khả năng truyền đạt xuất sắc, đội ngũ giảng viên của  MEDUNI sẽ là người đồng hành tin cậy, giúp bạn khai phá tiềm năng của mình trong lĩnh vực AI.
        </p>

        <ul class="flex flex-wrap gap-2 justify-center">
          <li
            v-for="tag in tags"
            :key="tag"
          >
            <UBadge
              :label="`# ${tag}`"
              color="primary"
              variant="subtle"
              size="xl"
              class="text-sm font-semibold md:text-base text-white border-2 border-white/20"
            />
          </li>
        </ul>
      </div>

      <!-- Slide -->
      <UCarousel
        v-slot="{ item }"
        :items="experts"
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
          item: 'md:basis-1/3 xl:basis-[22.5%]',
          container: 'py-3 relative',
          arrows: 'md:hidden',
          prev: 'sm:start-6',
          next: 'sm:end-6'
        }"
      >
        <div class="flex flex-col shadow-sm bg-white relative border-4 border-neutral-200 overflow-hidden rounded-lg">
          <NuxtImg
            :src="item.image"
            :alt="item.name"
            width="234"
            height="234"
            class="w-full aspect-[1.16] object-cover"
            lazy
          />
          <div class="w-full p-4 pt-2.5">
            <Heading
              variant="h5"
              class="text-secondary line-clamp-1"
            >
              {{ item.name }}
            </Heading>
            <p class="mt-2 text-base line-clamp-1">
              {{ item.description }}
            </p>
          </div>
        </div>
      </UCarousel>
    </UContainer>
  </section>
</template>

<style scoped>
  .section-background {
    background-image: url('/home/learn-with-global-experts.jpg');
    background-size: cover;
    background-position: center;
    box-shadow: inset 0 0 0 2000px rgba(27, 143, 243, 0.3);
  }
</style>
