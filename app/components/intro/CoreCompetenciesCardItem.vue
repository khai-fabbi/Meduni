<script setup lang="ts">
defineProps<{
  title: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any
}>()
</script>

<template>
  <div class="bg-competency transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1 h-[-webkit-fill-available] text-white p-6 rounded-lg overflow-hidden relative">
    <div class="space-y-2">
      <Heading
        variant="h6"
        as="h6"
        class="max-w-4/5"
      >
        {{ title }}
      </Heading>
      <div class="sm:max-w-[92%]">
        <slot />
      </div>
    </div>
    <div class="absolute top-3 right-3">
      <component
        :is="icon"
        class="md:size-15 size-12"
      />
    </div>
  </div>
</template>

<style scoped>
.bg-competency {
  position: relative;
  background-image: url('/images/intro/bg-card.png');
  background-size: cover;
  background-position: center;
  box-shadow: inset 0 0 0 2000px rgba(27, 143, 243, 0.3);
}
</style>
