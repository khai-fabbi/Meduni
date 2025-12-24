<template>
  <UContainer class="py-6 space-y-2 md:py-8 mb-6">
    <div class="space-y-2">
      <USkeleton class="h-8 md:h-10 w-1/3" />
      <USkeleton class="h-6 md:h-8 w-1/2" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="i in 4"
        :key="i"
        class="bg-white rounded-lg overflow-hidden"
      >
        <USkeleton class="w-full aspect-[0.75] rounded-lg" />
        <div class="p-4 space-y-2">
          <USkeleton class="h-6 w-3/4" />
          <USkeleton class="h-4 w-full" />
        </div>
      </div>
    </div>
  </UContainer>
</template>

