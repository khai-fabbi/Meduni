<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7.5">
    <div
      v-for="i in count"
      :key="i"
      class="h-full overflow-hidden"
    >
      <!-- Image skeleton -->
      <USkeleton class="w-full aspect-video rounded-lg" />

      <!-- Content skeleton -->
      <div class="flex flex-col gap-1 py-4">
        <!-- Date skeleton -->
        <div class="flex items-center gap-2">
          <USkeleton class="size-5 rounded" />
          <USkeleton class="h-4 w-24 rounded" />
        </div>

        <!-- Title skeleton -->
        <USkeleton class="h-6 w-full rounded mt-1" />
        <USkeleton class="h-6 w-3/4 rounded" />

        <!-- Description skeleton -->
        <USkeleton class="h-4 w-full rounded mt-2" />
        <USkeleton class="h-4 w-full rounded" />
        <USkeleton class="h-4 w-2/3 rounded" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  count?: number
}

withDefaults(defineProps<Props>(), {
  count: 9
})
</script>
