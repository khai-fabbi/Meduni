<script setup lang="ts">
useSeoMeta({
  titleTemplate: 'Trang chủ - MedUni.ai',
  title: 'Trang chủ - MedUni.ai',
  ogTitle: 'Trang chủ - MedUni.ai',
  description: 'Trang chủ - MedUni.ai'
})

const isLoading = ref(true)

onMounted(() => {
  isLoading.value = false
})
</script>

<template>
  <main>
    <SkeletonHomeBanner v-if="isLoading" />
    <HomeBanner v-else />

    <SkeletonHomeTranningProgram v-if="isLoading" />
    <HomeTranningProgram v-else />

    <SkeletonHomeAchievementsAchieved v-if="isLoading" />
    <HomeAchievementsAchieved v-else />

    <SkeletonHomeScientificCouncil v-if="isLoading" />
    <HomeScientificCouncil v-else />

    <SkeletonHomeLearnWithGlobalExperts v-if="isLoading" />
    <HomeLearnWithGlobalExperts v-else />

    <SkeletonHomePopularCourses v-if="isLoading" />
    <HomePopularCourses v-else />

    <SkeletonHomeContact v-if="isLoading" />
    <HomeContact v-else />

    <SkeletonHomeNews v-if="isLoading" />
    <HomeNews v-else />
  </main>
</template>
