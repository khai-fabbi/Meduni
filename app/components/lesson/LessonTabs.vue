<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

interface Props {
  content: string
  summary: string
}

defineProps<Props>()

const tabItems: TabsItem[] = [
  {
    label: 'Nội dung',
    value: 'content'
  },
  {
    label: 'Tóm tắt',
    value: 'summary'
  }
]

const activeTab = ref('content')
</script>

<template>
  <div>
    <UTabs
      v-model="activeTab"
      :items="tabItems"
      variant="link"
      :ui="{
        list: 'justify-start border-neutral-300',
        trigger: 'text-neutral-600 cursor-pointer text-base md:text-lg font-medium rounded-none border-none data-[active]:text-primary px-4 py-2',
        indicator: 'h-0.5 bg-primary'
      }"
      class="mb-4"
    />

    <div class="mt-4">
      <div
        v-if="activeTab === 'content'"
        class="prose prose-sm md:prose-base max-w-none"
      >
        <p class="text-base md:text-lg leading-relaxed whitespace-pre-line">
          {{ content }}
        </p>
      </div>

      <div
        v-else
        class="prose prose-sm md:prose-base max-w-none"
      >
        <p class="text-base md:text-lg leading-relaxed whitespace-pre-line">
          {{ summary }}
        </p>
      </div>
    </div>
  </div>
</template>
