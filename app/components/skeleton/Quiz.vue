<template>
  <div class="min-h-screen bg-neutral-100">
    <!-- Header -->
    <div class="px-4 md:px-6 py-4 mt-6 mb-0">
      <div
        class="flex items-center justify-between max-w-7xl mx-auto gap-2 md:gap-4"
      >
        <div class="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
          <USkeleton class="w-32 md:w-44 h-10 rounded shrink-0" />
          <USkeleton class="h-6 md:h-8 flex-1 max-w-md" />
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <USkeleton class="h-5 md:h-6 w-12" />
          <USkeleton class="size-2 rounded-full" />
          <USkeleton class="h-5 md:h-6 w-20 md:w-32" />
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        <!-- Question Section -->
        <div class="bg-white rounded-lg shadow-md p-5 md:p-8">
          <USkeleton class="h-7 md:h-8 w-24 mb-3" />
          <USkeleton class="h-5 md:h-6 w-full mb-2" />
          <USkeleton class="h-5 md:h-6 w-3/4 mb-6" />

          <!-- Answer Options -->
          <div class="space-y-4 mb-8">
            <div
              v-for="i in 4"
              :key="i"
              class="p-4 rounded-lg border-2 border-neutral-200"
            >
              <div class="flex items-start gap-3">
                <USkeleton class="h-5 w-5 shrink-0" />
                <USkeleton class="h-5 flex-1" />
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex items-center justify-between">
            <USkeleton class="w-28 h-12 rounded" />
            <USkeleton class="w-32 h-12 rounded" />
          </div>
        </div>

        <!-- Sidebar -->
        <div class="bg-white rounded-lg shadow-md p-5 space-y-6 sticky top-28">
          <div class="flex items-center justify-between">
            <USkeleton class="h-8 md:h-10 w-32" />
            <USkeleton class="w-28 h-12 rounded" />
          </div>

          <!-- Question Grid -->
          <div class="grid grid-cols-5 gap-2">
            <USkeleton v-for="num in 10" :key="num" class="h-10 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
