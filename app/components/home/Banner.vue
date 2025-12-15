<script setup lang="ts">
const items = [
  'https://png.pngtree.com/png-clipart/20240612/original/pngtree-automation-in-medical-research-ai-robots-streamline-laboratory-processes-png-image_15312496.png',
  'https://static.vecteezy.com/system/resources/previews/036/885/087/non_2x/ai-generated-ai-robot-cartoon-on-transparent-background-free-png.png',
  'https://static.vecteezy.com/system/resources/previews/036/885/074/non_2x/ai-generated-ai-robot-cartoon-on-transparent-background-free-png.png'
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
      <div class="bg-item-1 h-[550px] md:h-[650px]">
        <UContainer class="flex items-center h-full">
          <div class="flex-2 flex flex-col">
            <AppLogo class="h-12 w-fit" />
            <span class="mt-4.5 banner-text text-4xl md:text-6xl uppercase font-extrabold leading-normal select-none">
              VỮNG SỰ NGHIỆP <br> CHẮC TƯƠNG LAI<br>
            </span>
            <span class="banner-text-gradient select-none uppercase text-5xl md:text-9xl leading-none font-extrabold">
              <span class="text-4xl md:text-6xl leading-1">Cùng</span> AI
            </span>
            <NuxtLink to="/khoa-hoc">
              <UButton
                size="xl"
                class="mt-8 min-h-15 bg-gradient-to-b from-secondary to-secondary-700 hover:from-secondary-700 hover:to-secondary min-w-[280px] text-2xl justify-center w-fit text-white font-bold rounded-full"
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

          <div class="hidden md:flex-3 md:flex items-center justify-center">
            <NuxtImg
              :src="item"
              :alt="`Banner ${item}`"
              class="rounded-lg size-full h-[550px] object-contain"
              quality="100"
              width="100%"
              height="500"
              :placeholder="[20, 5]"
            />
          </div>
        </UContainer>
      </div>
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
