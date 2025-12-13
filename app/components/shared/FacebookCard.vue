<script setup lang="ts">
</script>

<template>
  <div class="bg-facebook-card rounded-sm shadow-md p-2 text-white flex items-center gap-2">
    <div class="size-20 p-1 shrink-0 flex items-center justify-center bg-white rounded">
      <AppLogoSimple class="w-full" />
    </div>
    <div class="space-y-2">
      <Heading
        variant="h6"
        class="text-white"
      >
        Học Viện MEDUNI
      </Heading>

      <div class="flex items-center flex-wrap gap-2">
        <UButton
          size="sm"
          class="bg-[#1761F7] text-sm rounded font-semibold shrink-0"
        >
          <UIcon
            name="i-simple-icons-facebook"
            class="size-5"
          />
          Theo dõi
        </UButton>
        <span>
          12.5k lượt theo dõi
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-facebook-card {
  background: linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('/images/bg-facebook-card.png') no-repeat center center;
  background-size: cover;
}
</style>
