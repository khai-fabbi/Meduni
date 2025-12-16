<script setup lang="ts">
export interface JSConfettiApi {
  JSConfetti: {
    new (): {
      addConfetti: (options?: {
        emojis?: string[]
        confettiColors?: string[]
        confettiRadius?: number
        confettiNumber?: number
        confettiWind?: number
      }) => void
    }
  }
}

declare global {
  interface Window extends JSConfettiApi {}
}

const props = withDefaults(defineProps<{
  autoTrigger?: boolean
  colors?: string[]
  radius?: number
  number?: number
  wind?: number
}>(), {
  autoTrigger: false,
  colors: () => [
    '#ff0a54',
    '#ff477e',
    '#ff7096',
    '#ff85a1',
    '#fbb1bd',
    '#f9bec7'
  ],
  radius: 6,
  number: 100,
  wind: 10
})

const { onLoaded } = useScriptNpm<JSConfettiApi>({
  packageName: 'js-confetti',
  file: 'dist/js-confetti.browser.js',
  version: '0.12.0',
  scriptOptions: {
    use() {
      return { JSConfetti: window.JSConfetti }
    },
    bundle: true
  }
})

const triggerConfetti = () => {
  onLoaded(({ JSConfetti }) => {
    const confetti = new JSConfetti()
    confetti.addConfetti({
      confettiColors: props.colors,
      confettiRadius: props.radius,
      confettiNumber: props.number,
      confettiWind: props.wind
    })
  })
}

defineExpose({
  trigger: triggerConfetti
})

onMounted(() => {
  if (props.autoTrigger) {
    triggerConfetti()
  }
})
</script>

<template>
  <div />
</template>

