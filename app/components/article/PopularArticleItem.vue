<script setup lang="ts">
import CalendarIcon from '~/assets/icons/calendar.svg'

interface Props {
  title: string
  date: string
  to?: string
}

withDefaults(defineProps<Props>(), {
  to: '#'
})
</script>

<template>
  <NuxtLink
    :to="to"
    class="block py-3 border-b border-neutral-200 last:border-b-0 hover:text-secondary transition-colors"
  >
    <Heading
      variant="h6"
      as="h4"
      class="line-clamp-2 mb-2"
    >
      {{ title }}
    </Heading>
    <div class="flex items-center gap-2 text-sm text-secondary">
      <CalendarIcon class="size-5" />
      <span class="leading-none">{{ date }}</span>
    </div>
  </NuxtLink>
</template>
