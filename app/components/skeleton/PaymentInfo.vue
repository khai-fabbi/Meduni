<template>
  <div class="bg-white rounded-sm p-6 px-3 space-y-6">
    <USkeleton class="h-7 w-40" />
    <div class="space-y-3">
      <div class="flex justify-between">
        <USkeleton class="h-5 w-24" />
        <USkeleton class="h-5 w-32" />
      </div>
      <div class="flex justify-between">
        <USkeleton class="h-5 w-28" />
        <USkeleton class="h-5 w-28" />
      </div>
      <div class="flex justify-between">
        <USkeleton class="h-5 w-36" />
        <USkeleton class="h-5 w-32" />
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <USkeleton class="size-4 rounded" />
          <USkeleton class="h-5 w-36" />
        </div>
        <USkeleton class="h-5 w-28" />
      </div>
    </div>
    <div class="space-y-3">
      <div class="flex gap-2">
        <USkeleton class="h-10 flex-1 rounded" />
        <USkeleton class="h-10 w-24 rounded" />
      </div>
    </div>
    <USeparator />
    <div class="flex justify-between items-center">
      <USkeleton class="h-6 w-40" />
      <USkeleton class="h-8 w-36" />
    </div>
    <div class="space-y-4">
      <div>
        <USkeleton class="h-5 w-44 mb-3" />
        <div class="space-y-2">
          <USkeleton class="h-12 w-full rounded-md" />
          <USkeleton class="h-12 w-full rounded-md" />
        </div>
      </div>
      <div class="flex items-center gap-2">
        <USkeleton class="size-4 rounded" />
        <USkeleton class="h-5 w-40" />
      </div>
    </div>
    <USkeleton class="h-14 w-full rounded" />
  </div>
</template>
