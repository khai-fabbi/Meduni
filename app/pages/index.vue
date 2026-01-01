<script setup lang="ts">
useSeoMeta({
  title: 'Trang chủ',
  description: 'Trang chủ của MedUni.vn'
})
</script>

<template>
  <main>
    <HomeBanner />

    <HomeTranningProgram />

    <LazyHomeAchievementsAchieved />

    <LazyHomeScientificCouncil />
    <LazyHomeLearnWithGlobalExperts />

    <!-- <SkeletonHomePopularCourses /> -->
    <LazyHomePopularCourses />

    <LazyHomeContact />

    <!-- <SkeletonHomeNews  /> -->
    <LazyHomeNews />
  </main>
</template>
