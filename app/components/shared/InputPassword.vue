<template>
  <UInput
    v-model="model"
    :type="show ? 'text' : 'password'"
    :autocomplete="autocomplete"
    :ui="{
      base: 'h-12'
    }"
  >
    <template #trailing>
      <UButton
        color="neutral"
        variant="link"
        size="sm"
        :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
        :aria-label="show ? 'Hide password' : 'Show password'"
        :aria-pressed="show"
        aria-controls="password"
        :ui="{
          leadingIcon: 'size-5'
        }"
        @click="show = !show"
      />
    </template>
  </UInput>
</template>

<script setup lang="ts">
const model = defineModel<string>({
  required: true
})

defineProps<{
  autocomplete?: string
}>()

const show = ref(false)
</script>

<style scoped>
/* Hide the password reveal button in Edge */
::-ms-reveal {
  display: none;
}
</style>
