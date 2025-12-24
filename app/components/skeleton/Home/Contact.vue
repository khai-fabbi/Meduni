<template>
  <UContainer class="py-8 space-y-7.5 md:py-8 mb-6">
    <USkeleton class="h-10 md:h-12 w-1/3 mx-auto" />
    <div class="max-w-7xl w-full mx-auto flex gap-4 flex-col-reverse md:flex-row items-center">
      <div class="rounded-lg bg-white p-4 md:px-7.5 md:py-5 md:max-w-[808px] w-full">
        <div class="space-y-4">
          <USkeleton class="h-8 w-1/2" />
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-5/6" />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <USkeleton
              v-for="i in 4"
              :key="i"
              class="h-12 w-full"
            />
          </div>
          <USkeleton class="h-32 w-full mt-4" />
          <USkeleton class="h-12 w-48 mx-auto mt-4 rounded-full" />
        </div>
      </div>

      <div class="bg-contact-info w-full md:max-w-[390px] rounded-lg h-fit text-white p-4 md:px-7.5 md:py-4">
        <div class="space-y-4">
          <USkeleton class="h-8 w-1/2 bg-white/20" />
          <USkeleton class="h-4 w-3/4 bg-white/20" />
          <div class="space-y-4 mt-6">
            <div
              v-for="i in 2"
              :key="i"
              class="p-3 border border-neutral-200 bg-white/10 rounded-lg"
            >
              <USkeleton class="h-6 w-32 bg-white/20" />
              <USkeleton class="h-5 w-40 mt-2 bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<style scoped>
.bg-contact-info {
  background-image: url('/home/learn-with-global-experts.jpg');
  background-size: cover;
  background-position: center;
  box-shadow: inset 0 0 0 2000px rgba(27, 143, 243, 0.3);
}
</style>

