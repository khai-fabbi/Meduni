<script setup lang="ts">
import CalendarIcon from '~/assets/icons/calendar.svg'

interface Props {
  title: string
  description: string
  date: string
  image: string
  to?: string
  withPaddingX?: boolean
  withRounded?: boolean
  withColorText?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  withPaddingX: false,
  withRounded: false,
  withColorText: true
})
</script>

<template>
  <NuxtLink
    :to="to ?? '#'"
    class="h-full overflow-hidden hover:shadow-secondary/15 transition-all duration-300 cursor-pointer group block"
  >
    <div
      class="overflow-hidden w-full aspect-video"
      :class="{ 'rounded-t-lg': props.withRounded, 'rounded-lg': !props.withRounded }"
    >
      <NuxtImg
        :src="image"
        :alt="title"
        class="size-full object-cover group-hover:scale-110 transition-all duration-300"
        quality="100"
        :placeholder="[50, 25]"
      />
    </div>

    <div
      class="flex flex-col gap-1 py-4"
      :class="{ 'px-4': props.withPaddingX }"
    >
      <div class="flex items-center gap-2 text-sm text-secondary">
        <CalendarIcon class="size-5" />

        <span class="leading-none">{{ date }}</span>
      </div>

      <Heading
        variant="h5"
        as="h5"
        class="flex-1 font-semibold min-h-11 md:min-h-12.5 line-clamp-2 group-hover:text-secondary transition-colors"
      >
        {{ title }}
      </Heading>

      <p
        class="text-base line-clamp-3"
        :class="{ 'text-neutral-600': props.withColorText }"
      >
        {{ description }}
      </p>
    </div>
  </NuxtLink>
</template>
