<template>
  <UContainer class="py-6 space-y-6 md:py-15 md:space-y-8">
    <div class="text-center space-y-2">
      <USkeleton class="h-10 md:h-12 w-3/4 mx-auto" />
      <USkeleton class="h-6 md:h-8 w-full max-w-[1000px] mx-auto" />
    </div>

    <section class="rounded-md bg-gradient-to-b from-secondary to-secondary-700 p-4">
      <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-7.5">
        <li
          v-for="i in 6"
          :key="i"
          class="space-y-2"
        >
          <USkeleton class="h-8 md:h-10 w-24 mx-auto" />
          <USkeleton class="h-4 md:h-5 w-full" />
        </li>
      </ul>
    </section>

    <div class="w-full h-full">
      <USkeleton class="w-full aspect-video rounded-md" />
    </div>
  </UContainer>
</template>

