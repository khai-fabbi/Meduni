<script setup lang="ts">
import CalendarIcon from '~/assets/icons/calendar.svg'

interface Props {
  title: string
  description: string
  date: string
  image: string
  to?: string
}

defineProps<Props>()
</script>

<template>
  <NuxtLink
    :to="to ?? '#'"
    class="h-full overflow-hidden hover:shadow-secondary/15 transition-all duration-300 cursor-pointer group block"
  >
    <div class="overflow-hidden w-full aspect-video rounded-lg">
      <NuxtImg
        :src="image"
        :alt="title"
        class="size-full object-cover group-hover:scale-110 transition-all duration-300"
        quality="100"
        :placeholder="[50, 25]"
      />
    </div>

    <div class="flex flex-col gap-1 py-2">
      <div class="flex items-center gap-2 text-sm text-secondary">
        <CalendarIcon class="size-5" />

        <span class="leading-none">{{ date }}</span>
      </div>

      <Heading
        variant="h6"
        as="h6"
        class="flex-1 font-semibold min-h-11 md:min-h-12.5 line-clamp-2 group-hover:text-secondary transition-colors"
      >
        {{ title }}
      </Heading>

      <p class="text-base text-neutral-600 line-clamp-3">
        {{ description }}
      </p>
    </div>
  </NuxtLink>
</template>
