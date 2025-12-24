<template>
  <section class="section-background py-8 md:py-20">
    <UContainer class="space-y-4 md:space-y-7">
      <div class="space-y-4 md:space-y-7 text-center">
        <USkeleton class="h-10 md:h-12 w-3/4 mx-auto" />
        <USkeleton class="h-6 md:h-8 w-full max-w-2xl mx-auto" />
        <div class="flex flex-wrap gap-2 justify-center">
          <USkeleton
            v-for="i in 5"
            :key="i"
            class="h-8 w-24 rounded"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="i in 4"
          :key="i"
          class="bg-white rounded-lg overflow-hidden"
        >
          <USkeleton class="w-full aspect-[1.16]" />
          <div class="p-4 space-y-2">
            <USkeleton class="h-6 w-3/4" />
            <USkeleton class="h-4 w-full" />
          </div>
        </div>
      </div>
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

