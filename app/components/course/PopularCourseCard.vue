<script setup lang="ts">
import ShoppingCartCheckIn from '~/assets/icons/shopping-cart-check-in.svg'

interface Props {
  title: string
  duration: string
  price: number
  description?: string
  image?: string
  to?: string
  isOwned?: boolean
}

defineProps<Props>()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}
</script>

<template>
  <article class="bg-white h-full rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:shadow-secondary/15 transition-all duration-300 group flex flex-col">
    <NuxtLink
      to="#"
      class="block"
    >
      <div class="overflow-hidden w-full aspect-video">
        <NuxtImg
          :src="image ?? '/images/course/course-placeholder.png'"
          alt="Course Image"
          class="size-full object-cover group-hover:scale-110 transition-all duration-300"
          quality="100"
          :placeholder="[50, 25]"
        />
      </div>
    </NuxtLink>

    <div class="px-4 pt-4 flex items-center justify-between">
      <div class="flex items-center gap-1.5">
        <UIcon
          name="i-lucide-clock"
          class="size-4 md:size-5 text-secondary"
        />
        <span class="text-base md:text-lg">{{ duration }}</span>
      </div>

      <div class="text-right">
        <p class="text-xl md:text-2xl font-bold text-secondary">
          {{ isOwned ? 'Đã sở hữu' : formatPrice(price) }}
        </p>
      </div>
    </div>

    <div class="p-4 pt-0 mt-1 flex flex-col flex-1">
      <NuxtLink
        :to="to ?? '#'"
        class="block"
      >
        <Heading
          variant="h5"
          as="h5"
          class="line-clamp-1 group-hover:text-secondary transition-colors"
        >
          {{ title }}
        </Heading>
      </NuxtLink>

      <p
        v-if="description"
        class="mt-1 text-sm md:text-base line-clamp-3"
      >
        {{ description }}
      </p>
      <div class="mt-4 flex gap-4">
        <UButton
          :to="to ?? '#'"
          color="primary"
          size="xl"
          block
          class="mt-auto text-lg md:text-xl font-bold rounded-4xl min-h-12 bg-gradient-to-b from-primary-500 to-primary-700 hover:from-primary-700 hover:to-primary-500 md:min-h-15"
        >
          Mua ngay
        </UButton>
        <UButton
          variant="outline"
          color="secondary"
          size="xl"
          class="shrink-0 size-15 rounded-full"
          block
        >
          <ShoppingCartCheckIn class="size-6" />
        </UButton>
      </div>
    </div>
  </article>
</template>
