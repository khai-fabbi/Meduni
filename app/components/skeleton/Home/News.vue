<template>
  <div class="bg-neutral-200">
    <UContainer class="py-6 space-y-5 md:py-15">
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-0">
        <div class="flex-1">
          <USkeleton class="h-10 md:h-12 w-3/4 mb-3" />
          <USkeleton class="h-6 md:h-8 w-full max-w-2xl" />
        </div>
      </div>

      <div class="rounded-lg">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="i in 8"
            :key="i"
            class="bg-white rounded-lg overflow-hidden"
          >
            <USkeleton class="w-full aspect-video rounded-t-lg" />
            <div class="p-4 space-y-2">
              <USkeleton class="h-4 w-32" />
              <USkeleton class="h-6 w-3/4" />
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-5/6" />
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-neutral-200 pt-8">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div
            v-for="i in 6"
            :key="i"
            class="flex items-center gap-3 md:gap-4 bg-white rounded-lg p-3 md:p-4"
          >
            <USkeleton class="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-lg" />
            <USkeleton class="h-4 w-full" />
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

