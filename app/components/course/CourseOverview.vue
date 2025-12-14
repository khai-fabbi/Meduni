<script setup lang="ts">
interface Props {
  overview: string
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-4">
    <Heading
      variant="h5"
      as="h4"
    >
      Tổng quan về khóa học
    </Heading>
    <p class="text-base leading-relaxed">
      {{ overview }}
    </p>
  </div>
</template>
