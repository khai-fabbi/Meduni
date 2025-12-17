<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div
      v-for="i in 4"
      :key="i"
      class="space-y-3"
    >
      <USkeleton class="w-full h-48 rounded-lg" />
      <USkeleton class="h-6 w-full" />
      <USkeleton class="h-5 w-2/3" />
      <USkeleton class="h-6 w-1/2" />
    </div>
  </div>
</template>
