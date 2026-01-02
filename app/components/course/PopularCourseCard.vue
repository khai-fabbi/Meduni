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
  courseId: string
  isLoading?: boolean
}

const props = defineProps<Props>()

defineEmits<{
  'add-to-cart': [courseId: string]
}>()

const formatPrice = (price: number) => {
  if (price === 0) {
    return 'Miễn phí'
  }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}
const durationFormatted = computed(() => formatDuration(Number(props.duration)))
</script>

<template>
  <article class="flex overflow-hidden flex-col h-full bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-secondary/15 group">
    <NuxtLink
      :to="to ?? '#'"
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
        <span class="text-base md:text-lg">{{ durationFormatted }}</span>
      </div>

      <div class="text-right">
        <p class="text-xl font-bold md:text-2xl text-secondary">
          {{ formatPrice(price) }}
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

      <div
        v-if="description"
        class="mt-1 text-sm md:text-base line-clamp-3"
        v-html="description"
      />
      <div class="flex gap-4 mt-4">
        <UButton
          v-if="isOwned"
          color="secondary"
          size="xl"
          block
          icon="i-lucide-check"
          class="mt-auto text-lg font-bold bg-gradient-to-b md:text-xl rounded-4xl min-h-12 from-secondary-500 to-secondary-700 hover:from-secondary-700 hover:to-secondary-500 md:min-h-15"
          :to="to ?? '#'"
        >
          Đã sở hữu
        </UButton>
        <UButton
          v-else
          color="primary"
          size="xl"
          block
          trailing-icon="i-lucide-chevrons-right"
          class="mt-auto text-lg font-bold bg-gradient-to-b group md:text-xl rounded-4xl min-h-12 from-primary-500 to-primary-700 hover:from-primary-700 hover:to-primary-500 md:min-h-15"
          :ui="{
            trailingIcon: 'ms-0 transition-all group-hover:ms-1 group-hover:size-7 group-hover:animate-pulse'
          }"
          :to="to ?? '#'"
        >
          Mua ngay
        </UButton>
        <UButton
          variant="outline"
          color="secondary"
          size="xl"
          class="rounded-full size-12 shrink-0 md:size-15"
          block
          :disabled="isOwned || isLoading"
          @click="$emit('add-to-cart', props.courseId)"
        >
          <UIcon
            v-if="isLoading"
            name="i-lucide-loader"
            class="animate-spin size-6"
          />
          <ShoppingCartCheckIn
            v-else
            class="size-6"
          />
        </UButton>
      </div>
    </div>
  </article>
</template>
