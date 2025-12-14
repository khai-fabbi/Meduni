<script setup lang="ts">
interface Props {
  videoUrl: string
}

defineProps<Props>()
</script>

<template>
  <div class="overflow-hidden rounded-lg bg-black aspect-video">
    <iframe
      :src="videoUrl"
      class="w-full h-full"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </div>
</template>

