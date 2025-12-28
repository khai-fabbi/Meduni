<script setup lang="ts">
import StarsIcon from '~/assets/icons/stars.svg'

interface Props {
  courseId: string
  keywords: string[]
  totalVideos: number
  totalDuration: string
  title: string
  courseTitle: string
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap gap-2">
      <UButton
        v-for="keyword in keywords"
        :key="keyword"
        color="primary"
        variant="soft"
        size="xl"
        class="rounded-md text-sm md:text-base min-h-10 md:min-h-12"
        :icon="StarsIcon"
      >
        {{ keyword }}
      </UButton>
    </div>

    <Heading
      variant="h3"
      as="h1"
    >
      {{ title }}
    </Heading>

    <p class="text-base">
      Video này là một phần của: <NuxtLink
        :to="`/khoa-hoc/${courseId}`"
        class="animate-link-underline text-primary font-semibold"
      >{{ courseTitle }}</NuxtLink>
    </p>

    <div class="flex items-center gap-3 text-sm md:text-base text-neutral-600">
      <span>{{ totalVideos }} video</span>
      <span>•</span>
      <span>{{ totalDuration }}</span>
    </div>
  </div>
</template>
