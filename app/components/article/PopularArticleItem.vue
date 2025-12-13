<script setup lang="ts">
import CalendarIcon from '~/assets/icons/calendar.svg'

interface Props {
  title: string
  date: string
  image: string
  to: string
}

defineProps<Props>()
</script>

<template>
  <NuxtLink
    :to="to ?? '#'"
    class="block py-3 group border-b border-neutral-200 last:border-b-0 transition-colors"
  >

    <div class="flex items-center gap-3">
      <div class="w-25 rounded-sm aspect-[1.5] md:w-30 object-cover overflow-hidden shrink-0">
        <NuxtImg
          :src="image"
          alt="Article Image"
          class="size-full object-cover group-hover:filter group-hover:brightness-90 group-hover:scale-110 transition-all duration-300"
          :placeholder="[20, 5]"
        />
      </div>

      <div class="h-full flex flex-col justify-between">
        <Heading
          variant="h6"
          class="line-clamp-2 mb-2 font-semibold flex-1 md:!text-base group-hover:text-secondary transition-colors"
        >
          {{ title }}
        </Heading>
        <div class="flex items-center gap-2 text-sm text-secondary">
          <CalendarIcon class="size-5" />
          <span class="leading-none">{{ date }}</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
