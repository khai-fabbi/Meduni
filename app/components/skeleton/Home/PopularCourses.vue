<template>
  <UContainer class="py-6 space-y-5 md:py-15">
    <USkeleton class="h-10 md:h-12 w-1/2 mx-auto" />

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="i in 4"
        :key="i"
        class="bg-white rounded-lg overflow-hidden"
      >
        <USkeleton class="w-full aspect-video" />
        <div class="p-4 space-y-3">
          <USkeleton class="h-6 w-3/4" />
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-5/6" />
          <div class="flex items-center justify-between pt-2">
            <USkeleton class="h-6 w-20" />
            <USkeleton class="h-10 w-32 rounded" />
          </div>
        </div>
      </div>
    </div>
  </UContainer>
</template>

