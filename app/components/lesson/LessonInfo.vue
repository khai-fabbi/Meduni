<script setup lang="ts">
import StarsIcon from '~/assets/icons/stars.svg'
import { services } from '~/services'
import type { ContentByKeywordAiResponse } from '~/types/course'

interface Props {
  courseId: string
  totalVideos: number
  totalDuration: string
  title: string
  courseTitle: string
  description: string
}

const props = defineProps<Props>()
const { sendChatbotMessage } = useChatbot()

const contentByKeywordAi = ref<ContentByKeywordAiResponse | null>(null)
const loading = ref(false)
onMounted(async () => {
  if (props.description) {
    loading.value = true
    try {
      const response = await services.courses.getContentByKeywordAi({
        inputs: {
          transcript: props.description || '',
          hint: 'true'
        },
        query: 'cái này là thử nghiệm',
        response_mode: 'blocking',
        conversation_id: '',
        user: 'niggas'
      })
      contentByKeywordAi.value = response
    } catch (error) {
      console.error('error - keyword:', error)
    } finally {
      loading.value = false
    }
  }
})

const contentByKeywordAiData = computed(() => {
  if (!contentByKeywordAi.value?.answer) {
    return []
  }

  try {
    let answerData: unknown = contentByKeywordAi.value.answer

    // Try to parse if it's a string
    if (typeof answerData === 'string') {
      try {
        const parsed = JSON.parse(answerData)
        // If result is still a string, it might be double-encoded
        if (typeof parsed === 'string') {
          answerData = JSON.parse(parsed)
        } else {
          answerData = parsed
        }
      } catch (parseError) {
        // If parsing fails, log and return empty array
        console.error('Error parsing JSON string:', parseError, 'Raw answer:', answerData)
        return []
      }
    }

    const results = answerData as { options?: { question: string, describe: string }[] }
    return results.options || []
  } catch (error) {
    console.error('Error parsing contentByKeywordAi answer:', error, contentByKeywordAi.value.answer)
    return []
  }
})

const handleClickKeyword = async (keyword: { question: string, describe: string }) => {
  await sendChatbotMessage(keyword.describe, { autoOpen: true })
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap gap-2">
      <template v-if="loading">
        <USkeleton
          v-for="i in 5"
          :key="i"
          class="h-10 rounded-md w-30 bg-neutral-300!"
        />
      </template>
      <template v-else>
        <UButton
          v-for="
            (keyword,
             index)
              in
                contentByKeywordAiData"
          :key="index"
          color="primary"
          variant="soft"
          size="xl"
          class="text-sm rounded-md md:text-base min-h-10 md:min-h-12"
          :icon="StarsIcon"
          @click="handleClickKeyword(keyword)"
        >
          {{ keyword.question }}
        </UButton>
      </template>
    </div>

    <Heading
      variant="h3"
      as="h1"
    >
      {{ title }}
    </Heading>

    <p class="text-base">
      Video này là một phần của: <NuxtLink
        :to="`/khoa-hoc/${courseId}`"
        class="font-semibold animate-link-underline text-primary"
      >{{ courseTitle }}</NuxtLink>
    </p>

    <div class="flex gap-3 items-center text-sm md:text-base text-neutral-600">
      <span>{{ totalVideos }} video</span>
      <span>•</span>
      <span>{{ totalDuration }}</span>
    </div>
  </div>
</template>
