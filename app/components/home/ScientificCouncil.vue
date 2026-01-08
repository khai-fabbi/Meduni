<script setup lang="ts">
const scientificCouncilMembers = [
  {
    id: 1,
    name: 'BSCKI. PHẠM LY',
    image: '/home/scientific/bscki-pham-ly.png',
    description: 'CEO & Fouder của Le\'Bali Skinlab'
  },
  {
    id: 2,
    name: 'BS. MAI VĂN QUỐC',
    image: '/home/scientific/bs-mai-van-quoc.png',
    description: 'CEO & Fouder của Hoàn Mỹ Hospital'
  },
  {
    id: 3,
    name: 'BS. HUỆ MINH',
    image: '/home/scientific/bs-hue-minh.png',
    description: 'Giám đốc viện sắc đẹp Hoàng Minh'
  },
  {
    id: 4,
    name: 'BSCKI. TRẦN GIA QUỐC BẢO',
    image: '/home/scientific/bscki-tran-gia-quoc-bao.png',
    description: 'Bác sĩ bệnh viện Y học cổ truyền'
  }
]
const breakpoints = useBreakpoints({
  xl: 1280
})

const isXlScreen = breakpoints.greaterOrEqual('xl')
const shouldShowArrows = computed(() => {
  if (isXlScreen.value && scientificCouncilMembers.length <= 4) {
    return false
  }
  return true
})
</script>

<template>
  <UContainer class="py-6 mb-6 space-y-2 md:py-8">
    <div class="space-y-2">
      <Heading
        variant="h3"
      >
        <span class="text-secondary">Hội đồng</span> khoa học
      </Heading>
      <p class="text-base md:text-lg">
        Khám phá cơ hội nghề nghiệp cùng các chuyên gia hàng đầu
      </p>
    </div>

    <UCarousel
      v-slot="{ item }"
      :items="scientificCouncilMembers"
      :arrows="shouldShowArrows"
      wheel-gestures
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
        item: 'md:basis-1/3 xl:basis-1/4',
        container: 'py-3 relative',
        prev: 'sm:start-6 2xl:-start-5',
        next: 'sm:end-6 2xl:-end-5',
        dots: 'absolute bottom-[calc(100%+14px)] justify-end',
        dot: 'w-4 h-2 bg-neutral-300 data-[state=active]:bg-primary data-[state=active]:w-13 transition-all md:w-6 data-[state=active]:w-10'
      }"
      dots
    >
      <div class="flex overflow-hidden relative gap-4 items-center bg-white rounded-lg border border-white shadow-sm">
        <NuxtImg
          :src="item.image"
          :alt="item.name"
          width="234"
          height="auto"
          class="rounded-lg w-full aspect-[0.75] object-cover object-top-center"
          lazy
        />
        <div class="absolute bottom-0 left-0 p-4 w-full rounded-b-sm backdrop-blur-sm bg-white/60">
          <Heading variant="h5">
            {{ item.name }}
          </Heading>
          <p class="text-base">
            {{ item.description }}
          </p>
        </div>
      </div>
    </UCarousel>
  </UContainer>
</template>
