<template>
  <div class="bg-white rounded-sm pb-10">
    <div class="space-y-6">
      <div class="flex items-center justify-between h-18 rounded-sm rounded-b-none bg-primary-light">
        <div class="flex items-center gap-3 px-4">
          <USkeleton class="size-5 rounded" />
          <USkeleton class="h-5 w-64" />
        </div>
        <USkeleton class="h-5 w-20 px-4" />
      </div>

      <div class="space-y-4 px-4">
        <div
          v-for="i in 3"
          :key="i"
          class="flex items-center gap-4 p-4 rounded-lg"
        >
          <USkeleton class="size-5 rounded" />
          <USkeleton class="w-32 h-24 rounded-lg shrink-0" />
          <div class="flex-1 min-w-0 space-y-2">
            <USkeleton class="h-7 w-3/4" />
            <USkeleton class="h-5 w-1/2" />
            <USkeleton class="h-4 w-2/3" />
          </div>
          <div class="flex flex-col items-end gap-1 shrink-0">
            <USkeleton class="h-6 w-24" />
            <USkeleton class="h-5 w-20" />
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between pt-6 border-t border-neutral-300 px-4">
        <USkeleton class="h-5 w-32" />
        <div class="flex items-center gap-4">
          <div class="text-right pr-7.5">
            <USkeleton class="h-5 w-48 mb-1" />
            <USkeleton class="h-8 w-40" />
          </div>
          <USkeleton class="w-40 h-14 rounded" />
        </div>
      </div>
    </div>
  </div>
</template>

