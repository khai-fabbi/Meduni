<script setup lang="ts">
useSeoMeta({
  titleTemplate: 'Trang chủ - MedUni.ai',
  title: 'Trang chủ - MedUni.ai',
  ogTitle: 'Trang chủ - MedUni.ai',
  description: 'Trang chủ - MedUni.ai'
})
</script>

<template>
  <main>
    <HomeBanner />

    <HomeTranningProgram />

    <HomeAchievementsAchieved />

    <HomeScientificCouncil />
    <HomeLearnWithGlobalExperts />

    <!-- <SkeletonHomePopularCourses /> -->
    <HomePopularCourses />

    <HomeContact />

    <!-- <SkeletonHomeNews  /> -->
    <HomeNews />
  </main>
</template>
