<template>
  <div class="min-h-screen bg-neutral-100">
    <!-- Header -->
    <div class="px-4 md:px-6 py-4 mt-6 mb-0">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <div class="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
          <USkeleton class="w-32 md:w-44 h-10 rounded shrink-0" />
          <USkeleton class="h-6 md:h-8 flex-1 max-w-xs" />
        </div>
        <USkeleton class="w-36 md:w-44 h-12 rounded shrink-0" />
      </div>
    </div>

    <!-- Results Content -->
    <div class="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div class="space-y-4">
        <!-- Result Cards -->
        <div
          v-for="i in 2"
          :key="i"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <!-- Card Header -->
          <div class="p-4 md:p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <USkeleton class="h-6 md:h-7 w-32" />
                <div class="flex items-center gap-4">
                  <USkeleton class="h-5 w-24" />
                  <USkeleton class="h-5 w-40" />
                </div>
              </div>
              <USkeleton class="size-5 rounded" />
            </div>
          </div>

          <!-- Expanded Content (only for first card) -->
          <div v-if="i === 1" class="px-4 md:px-6 pb-4 md:pb-6 space-y-6">
            <div v-for="q in 3" :key="q" class="space-y-4">
              <USkeleton class="h-6 w-24" />
              <USkeleton class="h-5 w-full" />
              <USkeleton class="h-5 w-3/4 mb-4" />

              <!-- Answer Options -->
              <div class="space-y-3">
                <div
                  v-for="opt in 4"
                  :key="opt"
                  class="p-4 rounded-lg border-2 border-neutral-200"
                >
                  <div class="flex items-start gap-3">
                    <USkeleton class="h-5 w-5 shrink-0" />
                    <USkeleton class="h-5 flex-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
