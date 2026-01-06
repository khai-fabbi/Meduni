<script setup lang="ts">
export interface LessonResourceLink {
  id: string
  title: string
  to?: string
  done: boolean
  is_complete?: boolean | null
  metaText?: string
  icon?: string
  documentUrl?: string
}

interface Props {
  document?: LessonResourceLink
  quiz?: LessonResourceLink[]
  isActive?: boolean
  isLessonCompleted?: boolean
}

defineProps<Props>()

const handleDocumentClick = (documentUrl?: string) => {
  if (documentUrl && import.meta.client) {
    window.open(documentUrl, '_blank')
  }
}
</script>

<template>
  <div
    v-if="document || (quiz && quiz.length > 0)"
    class="space-y-2 pb-3"
  >
    <div
      v-if="document"
      :class="[
        'rounded-lg border border-white/70 overflow-hidden',
        isActive ? 'bg-sky-100' : 'bg-white/60'
      ]"
    >
      <component
        :is="document.documentUrl ? 'div' : (document.to ? 'NuxtLink' : 'div')"
        :to="document.to"
        class="flex items-center gap-3 px-4 py-3 cursor-pointer"
        :class="document.to || document.documentUrl ? 'hover:bg-white/70 transition-colors' : ''"
        @click="handleDocumentClick(document.documentUrl)"
      >
        <div class="shrink-0">
          <div class="size-5 text-primary">
            <UIcon :name="document.icon || 'i-lucide-file-text'" />
          </div>
        </div>

        <div class="min-w-0 flex-1">
          <div class="text-sm md:text-base font-semibold text-primary line-clamp-1">
            {{ document.title }}
          </div>
          <div
            v-if="document.metaText"
            class="text-xs md:text-sm text-muted line-clamp-1"
          >
            {{ document.metaText }}
          </div>
        </div>

        <div class="shrink-0 flex items-center gap-2">
          <div
            v-if="document.done"
            class="size-6 text-primary"
          >
            <UIcon
              name="i-lucide-arrow-right"
              class="size-6"
            />
          </div>
          <div
            v-else-if="document.to || document.documentUrl"
            class="size-6 text-neutral-800"
          >
            <UIcon
              name="i-lucide-arrow-right"
              class="size-6"
            />
          </div>
        </div>
      </component>
    </div>

    <template v-if="quiz && quiz.length > 0">
      <div
        v-for="quizItem in quiz"
        :key="quizItem.id"
        :class="[
          'rounded-lg border border-white/70 overflow-hidden',
          isActive ? 'bg-sky-100' : 'bg-white/60',
          !isLessonCompleted ? 'opacity-50' : ''
        ]"
      >
        <NuxtLink
          v-if="isLessonCompleted"
          :to="quizItem.to"
          class="flex items-center gap-3 px-4 py-3 cursor-pointer"
          :class="quizItem.to ? 'hover:bg-white/70 transition-colors' : ''"
        >
          <div class="shrink-0">
            <div class="size-5 text-primary">
              <UIcon :name="quizItem.icon || 'i-lucide-clipboard-list'" />
            </div>
          </div>

          <div class="min-w-0 flex-1">
            <div class="text-sm md:text-base font-semibold text-primary line-clamp-1">
              Làm bài tập: {{ quizItem.title }}
            </div>
            <div
              v-if="quizItem.metaText"
              class="text-xs font-bold md:text-sm text-muted line-clamp-1"
            >
              {{ quizItem.metaText }}
            </div>
          </div>

          <div class="shrink-0 flex items-center gap-2">
            <div
              v-if="quizItem.done"
              class="size-6 text-emerald-600"
            >
              <UIcon
                name="i-lucide-check"
                class="size-6"
              />
            </div>
            <div
              v-else-if="quizItem.to"
              class="size-6 text-primary"
            >
              <UIcon
                name="i-lucide-arrow-right"
                class="size-6"
              />
            </div>
          </div>
        </NuxtLink>
        <div
          v-else
          class="flex items-center gap-3 px-4 py-3 cursor-not-allowed"
        >
          <div class="shrink-0">
            <div class="size-5 text-primary">
              <UIcon :name="quizItem.icon || 'i-lucide-clipboard-list'" />
            </div>
          </div>

          <div class="min-w-0 flex-1">
            <div class="text-sm md:text-base font-semibold text-primary line-clamp-1">
              <span v-if="!quizItem?.metaText">Làm bài tập:</span> {{ quizItem.title }}
            </div>
            <div
              v-if="quizItem.metaText"
              class="text-xs md:text-sm font-bold text-muted line-clamp-1"
            >
              {{ quizItem.metaText }}
            </div>
          </div>

          <div class="shrink-0 flex items-center gap-2">
            <div
              v-if="quizItem.done"
              class="size-6 text-emerald-600"
            >
              <UIcon
                name="i-lucide-check"
                class="size-6"
              />
            </div>
            <div
              v-else-if="quizItem.to"
              class="size-6 text-primary"
            >
              <UIcon
                name="i-lucide-arrow-right"
                class="size-6"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
