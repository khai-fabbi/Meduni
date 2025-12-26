<template>
  <div class="bg-white h-full rounded-lg shadow-md overflow-hidden">
    <!-- Image skeleton -->
    <USkeleton class="w-full aspect-video rounded-t-lg" />

    <!-- Content skeleton -->
    <div class="p-4 flex flex-col gap-3">
      <!-- Title skeleton -->
      <USkeleton class="h-6 w-full rounded" />
      <USkeleton class="h-6 w-3/4 rounded" />

      <!-- Bottom section skeleton -->
      <div class="mt-auto flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <USkeleton class="size-5 rounded" />
          <USkeleton class="h-5 w-24 rounded" />
        </div>
        <USkeleton class="h-7 w-32 rounded" />
      </div>
    </div>
  </div>
</template>
