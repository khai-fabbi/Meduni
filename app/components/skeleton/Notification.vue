<template>
  <div class="space-y-0">
    <div
      v-for="i in 6"
      :key="i"
      class="flex items-start gap-4 py-4 border-b border-neutral-300 last:border-b-0"
    >
      <div class="shrink-0 mt-1">
        <USkeleton class="size-5 rounded-full" />
      </div>

      <div class="flex-1 min-w-0 space-y-2">
        <div class="flex items-start justify-between gap-4">
          <USkeleton class="h-5 w-48" />
          <USkeleton class="h-4 w-32" />
        </div>
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-3/4" />
      </div>
    </div>
  </div>
</template>


