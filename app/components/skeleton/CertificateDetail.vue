<template>
  <div class="max-w-4xl mx-auto">
    <div class="p-8 md:p-12">
      <!-- Illustration Section Skeleton -->
      <div class="relative mb-8 flex justify-center items-center min-h-[300px] md:min-h-[400px]">
        <div class="relative w-full max-w-md">
          <USkeleton class="w-24 h-32 md:w-32 md:h-40 rounded-lg" />
          <USkeleton class="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-64 md:w-64 md:h-80 rounded-lg" />
        </div>
      </div>

      <!-- Text Section Skeleton -->
      <div class="text-center space-y-4">
        <USkeleton class="h-8 md:h-10 w-3/4 mx-auto" />
        <USkeleton class="h-8 md:h-10 w-2/3 mx-auto" />
        <USkeleton class="h-6 md:h-7 w-full max-w-2xl mx-auto" />
        <USkeleton class="h-6 md:h-7 w-5/6 max-w-2xl mx-auto" />
      </div>

      <!-- Button Skeleton -->
      <div class="mt-8 flex justify-center">
        <USkeleton class="w-64 h-14 rounded" />
      </div>
    </div>
  </div>
</template>


