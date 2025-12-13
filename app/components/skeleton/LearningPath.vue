<template>
  <div
    v-for="i in 12"
    :key="i"
    class="bg-white border border-gray-200 rounded-lg p-4"
  >
    <div class="flex items-start gap-3 mb-3">
      <USkeleton class="w-5 h-5 rounded shrink-0" />
      <USkeleton class="h-5 flex-1" />
    </div>

    <div class="mb-3">
      <div class="flex items-center gap-2 mb-2">
        <USkeleton class="h-4 w-24" />
        <USkeleton class="h-4 w-8" />
        <USkeleton class="h-5 w-20 rounded" />
      </div>
      <div class="flex gap-1 w-full">
        <USkeleton
          v-for="j in 4"
          :key="j"
          class="flex-1 h-2 rounded-sm"
        />
      </div>
    </div>

    <USkeleton class="h-5 w-32" />
  </div>
</template>
