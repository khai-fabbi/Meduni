<template>
  <div class="space-y-4">
    <div
      v-for="i in 5"
      :key="i"
      class="bg-white rounded-sm flex flex-col md:flex-row md:items-center gap-4 p-4"
    >
      <USkeleton class="w-full md:w-48 h-32 md:h-28 rounded-lg shrink-0" />

      <div class="flex-1 min-w-0 space-y-3">
        <USkeleton class="h-6 md:h-8 w-3/4" />
        <USkeleton class="h-4 md:h-6 w-1/2" />
        <div class="flex flex-wrap gap-2">
          <USkeleton class="h-8 w-24 rounded" />
          <USkeleton class="h-8 w-28 rounded" />
          <USkeleton class="h-8 w-24 rounded" />
          <USkeleton class="h-8 w-40 rounded" />
        </div>
      </div>

      <div class="flex items-center gap-6 shrink-0 md:justify-center justify-between">
        <USkeleton class="size-13 rounded-full shrink-0" />
        <USkeleton class="w-38 h-12 rounded shrink-0" />
      </div>
    </div>
  </div>
</template>
