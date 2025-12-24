<template>
  <div class="h-[550px] md:h-[650px] bg-neutral-200">
    <UContainer class="flex items-center h-full">
      <div class="flex-2 flex flex-col gap-4">
        <USkeleton class="w-32 h-12" />
        <USkeleton class="h-16 md:h-20 w-3/4" />
        <USkeleton class="h-16 md:h-20 w-2/3" />
        <USkeleton class="h-14 w-64 rounded-full mt-4" />
      </div>
      <div class="hidden md:flex-3 md:flex items-center justify-center">
        <USkeleton class="w-full h-[550px] rounded-lg" />
      </div>
    </UContainer>
  </div>
</template>

