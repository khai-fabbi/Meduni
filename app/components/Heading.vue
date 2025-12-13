<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
interface Props {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'h2',
  as: undefined
})

const tag = computed(() => props.as || props.variant)

const sizeClasses = {
  h1: 'text-4xl md:text-5xl',
  h2: 'text-3xl md:text-[2.5rem]',
  h3: 'text-2xl md:text-[2rem]',
  h4: 'text-xl md:text-2xl',
  h5: 'text-lg md:text-xl',
  h6: 'text-base md:text-lg'
}
</script>

<template>
  <component
    :is="tag"
    :class="[
      sizeClasses[variant],
      'leading-tight font-bold'
    ]"
  >
    <slot />
  </component>
</template>
