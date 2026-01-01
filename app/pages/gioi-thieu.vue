<script setup lang="ts">
useSeoMeta({
  title: 'Giới thiệu',
  description: 'Giới thiệu về MedUni.vn'
})
</script>

<template>
  <main>
    <IntroBanner />
    <UContainer class="py-6 md:py-20">
      <div class="space-y-6 md:space-y-20">
        <IntroAbout />
        <IntroDevelopmentOrientation />
        <IntroInstituteExecutiveBoard />
        <IntroCoreCompetencies />
        <div class="flex flex-col gap-4 md:gap-7.5 md:flex-row">
          <div class="flex-1 space-y-4 md:space-y-6">
            <IntroExpert />
            <IntroAIForHealthcare />
          </div>
          <div class="flex-1">
            <IntroPublicHealth />
          </div>
        </div>
        <IntroStudentFeedback />
      </div>
    </UContainer>
  </main>
</template>
