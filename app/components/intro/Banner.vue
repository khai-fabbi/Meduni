<script setup lang="ts"></script>

<template>
  <div class="relative">
    <NuxtImg
      src="/images/intro/banner.png"
      alt="Banner"
      class="w-full min-h-[300px] object-cover"
    />
    <div
      class="absolute left-1/2 -translate-x-1/2 bottom-1/2 translate-y-1/2 w-full max-w-[350px] md:max-w-lg"
    >
      <div
        class="flex flex-col gap-2 p-5 bg-white/80 rounded-lg md:rounded-2xl text-center backdrop-blur-[2px]"
      >
        <h1 class="text-2xl md:text-4xl font-bold text-primary">
          MEDUNI
        </h1>
        <p class="text-base md:text-2xl">
          AI Universal - AI University - AI Unicorn
        </p>
      </div>
    </div>
  </div>
</template>
