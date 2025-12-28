<script setup lang="ts">
</script>

<template>
  <div>
    <AppHeader />

    <UMain class="md:py-10 py-4">
      <UContainer>
        <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,390px)_1fr] gap-8">
          <aside class="max-w-[390px] hidden lg:block">
            <ProfileAside />
          </aside>
          <main>
            <slot />
          </main>
        </div>
      </UContainer>
    </UMain>

    <AppFooter />
  </div>
</template>
