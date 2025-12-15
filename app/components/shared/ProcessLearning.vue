<script setup lang="ts">
interface Props {
  progress: number
}

const props = defineProps<Props>()
</script>

<template>
  <div
    v-if="props.progress < 100"
    class="relative size-13 shrink-0"
  >
    <svg
      class="transform -rotate-90 w-full h-full"
      viewBox="0 0 36 36"
    >
      <circle
        cx="18"
        cy="18"
        r="14"
        stroke-linecap="round"
        fill="var(--color-progress-inner)"
      />
      <circle
        cx="18"
        cy="18"
        r="16"
        fill="none"
        stroke="var(--color-primary-100)"
        stroke-width="3"
      />
      <circle
        cx="18"
        cy="18"
        r="16"
        fill="none"
        stroke="var(--color-primary-500)"
        stroke-width="3"
        stroke-dasharray="100, 100"
        :stroke-dashoffset="100 - progress"
        stroke-linecap="round"
        class="transition-all duration-300"
      />
    </svg>
    <div class="absolute inset-0 flex items-center justify-center">
      <span class="text-base font-black text-primary ">
        {{ progress }}<span class="text-[10px] relative -top-1">%</span>
      </span>
    </div>
  </div>
</template>
