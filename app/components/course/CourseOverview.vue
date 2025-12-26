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
    <div
      class="text-base leading-relaxed"
      v-html="overview"
    />
  </div>
</template>
