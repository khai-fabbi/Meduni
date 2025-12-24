<template>
  <UContainer class="py-6 space-y-6 md:py-15 md:space-y-8">
    <div class="space-y-4">
      <USkeleton class="h-10 md:h-12 w-1/2 mx-auto" />
      <USkeleton class="h-6 md:h-8 w-3/4 mx-auto" />
    </div>

    <div class="lg:flex gap-8">
      <section class="lg:flex-2 space-y-4">
        <div
          v-for="i in 3"
          :key="i"
          class="flex gap-4"
        >
          <USkeleton class="w-12 h-12 shrink-0 rounded-full" />
          <div class="flex-1 space-y-2">
            <USkeleton class="h-6 w-3/4" />
            <USkeleton class="h-4 w-full" />
            <USkeleton class="h-4 w-5/6" />
          </div>
        </div>
      </section>

      <section class="lg:flex-3 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 lg:mt-0">
        <div
          v-for="i in 4"
          :key="i"
          class="bg-white rounded-lg p-4 md:p-6 space-y-4"
        >
          <USkeleton class="w-16 h-16 mx-auto rounded-full" />
          <USkeleton class="h-6 w-3/4 mx-auto" />
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-5/6 mx-auto" />
        </div>
      </section>
    </div>
  </UContainer>
</template>

