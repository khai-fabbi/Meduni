<script setup lang="ts">
interface Props {
  name: string
  avatar: string
  description: string
  stats: string[]
}

defineProps<Props>()
</script>

<template>
  <div class="bg-white sticky top-28 rounded-lg shadow-md px-4 py-6 md:shadow-lg md:px-5 md:py-7 space-y-4">
    <Heading
      variant="h5"
      as="h4"
      class="mb-4 text-primary"
    >
      Thông tin Giảng viên
    </Heading>

    <div class="flex items-start gap-4">
      <UAvatar
        :alt="name"
        class="size-14"
      />
      <div class="flex-1 space-y-2">
        <span class="text-neutral-600">Chuyên gia</span>
        <p class="font-semibold text-xl">
          {{ name }}
        </p>
      </div>
    </div>

    <div class="space-y-4">
      <div class="space-y-3">
        <Heading variant="h5">
          Chuyên gia hàng đầu
        </Heading>
        <p class="text-base md:text-lg">
          {{ description }}
        </p>
      </div>

      <div class="space-y-3">
        <Heading variant="h5">
          Đáng tin cậy
        </Heading>
        <ul class="space-y-2 text-base md:text-lg">
          <li
            v-for="(stat, index) in stats"
            :key="index"
            class="flex items-start gap-2"
          >
            <UIcon
              name="i-lucide-check"
              class="size-4 md:size-5 text-green-500 shrink-0 mt-1"
            />
            <span>{{ stat }}</span>
          </li>
        </ul>
      </div>

      <div class="flex items-center gap-4 pt-2">
        <UButton
          icon="i-lucide-facebook"
          color="primary"
          variant="subtle"
          size="lg"
          aria-label="Facebook"
        />
        <UButton
          icon="i-lucide-youtube"
          color="primary"
          variant="subtle"
          size="lg"
          aria-label="YouTube"
        />
      </div>
    </div>
  </div>
</template>
