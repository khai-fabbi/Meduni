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
</script>

<template>
  <article class="flex overflow-hidden flex-col h-full bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-secondary/15 group">
    <NuxtLink
      to="#"
      class="block"
    >
      <div class="overflow-hidden w-full aspect-video">
        <NuxtImg
          :src="image ?? '/images/course/course-placeholder.png'"
          alt="Course Image"
          class="object-cover transition-all duration-300 size-full group-hover:scale-110"
          quality="100"
          :placeholder="[50, 25]"
        />
      </div>
    </NuxtLink>

    <div class="flex justify-between items-center px-4 pt-4">
      <div class="flex gap-1.5 items-center">
        <UIcon
          name="i-lucide-clock"
          class="size-4 md:size-5 text-secondary"
        />
        <span class="text-base md:text-lg">{{ duration }}</span>
      </div>

      <div class="text-right">
        <p class="text-xl font-bold md:text-2xl text-secondary">
          {{ isOwned ? 'Đã sở hữu' : formatPrice(price) }}
        </p>
      </div>
    </div>

    <div class="flex flex-col flex-1 p-4 pt-0 mt-1">
      <NuxtLink
        :to="to ?? '#'"
        class="block"
      >
        <Heading
          variant="h5"
          as="h5"
          class="transition-colors line-clamp-1 group-hover:text-secondary"
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
      <div class="flex gap-4 mt-4">
        <UButton
          :to="to ?? '#'"
          color="primary"
          size="xl"
          block
          class="mt-auto text-lg font-bold bg-gradient-to-b md:text-xl rounded-4xl min-h-12 from-primary-500 to-primary-700 hover:from-primary-700 hover:to-primary-500 md:min-h-15"
        >
          Mua ngay
        </UButton>
        <UButton
          variant="outline"
          color="secondary"
          size="xl"
          class="rounded-full shrink-0 size-15"
          block
        >
          <ShoppingCartCheckIn class="size-6" />
        </UButton>
      </div>
    </div>
  </article>
</template>
