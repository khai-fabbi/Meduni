<script setup lang="ts">
interface Props {
  title: string
  duration: string
  price: number
  image?: string
  to?: string
  isOwned?: boolean
}

const props = defineProps<Props>()

const formatPrice = (price: number) => {
  if (price === 0) {
    return 'Miễn phí'
  }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const durationFormatted = computed(() => formatDuration(Number(props.duration)))
</script>

<template>
  <NuxtLink
    :to="to ?? '#'"
    class="block bg-white h-full rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:shadow-secondary/15 transition-all duration-300 cursor-pointer group"
  >
    <div class="overflow-hidden w-full aspect-video">
      <NuxtImg
        :src="image ?? '/images/course/course-placeholder.png'"
        alt="Course Image"
        class="size-full object-cover group-hover:scale-110 transition-all duration-300"
        quality="80"
        :placeholder="[50, 25]"
        loading="lazy"
      />
    </div>

    <div class="p-4 flex flex-col gap-3">
      <Heading
        variant="h5"
        as="h5"
        class="flex-1 min-h-11 md:min-h-12.5 line-clamp-2 group-hover:text-secondary transition-colors"
      >
        {{ title }}
      </Heading>

      <div class="mt-auto flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <UIcon
            name="i-lucide-clock"
            class="size-4 md:size-5 text-secondary"
          />
          <span class="text-base md:text-lg">{{ durationFormatted }}</span>
        </div>

        <div class="text-right">
          <p class="text-xl md:text-2xl font-bold text-secondary">
            {{ isOwned ? 'Đã sở hữu' : formatPrice(price) }}
          </p>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
