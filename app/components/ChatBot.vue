<script setup lang="ts">
interface Message {
  id: string
  role: 'user' | 'assistant'
  parts: Array<{
    type: 'text'
    text: string
  }>
}

// Type cho UIMessage từ Nuxt UI ChatMessages actions
interface UIMessage {
  id: string
  role: 'user' | 'assistant'
  parts?: Array<{
    type: string
    text?: string
    [key: string]: unknown
  }>
  [key: string]: unknown
}

const isOpen = ref(false)
const messages = ref<Message[]>([])
const status = ref<'submitted' | 'streaming' | 'ready' | 'error'>('ready')
const input = ref('')
const showWelcomeAlert = ref(false)

const toast = useToast()
const { copy: copyToClipboard } = useClipboard()

// Khởi tạo với tin nhắn chào mừng
onMounted(() => {
  messages.value = [
    {
      id: crypto.randomUUID(),
      role: 'assistant',
      parts: [
        {
          type: 'text',
          text: 'Xin chào! Tôi là chatbot hỗ trợ của MedUni.vn. Tôi có thể giúp gì cho bạn?'
        }
      ]
    }
  ]

  // Hiển thị welcome alert sau 2 giây
  setTimeout(() => {
    showWelcomeAlert.value = true
  }, 1000)
})

const sendMessage = async () => {
  if (!input.value.trim() || status.value === 'submitted' || status.value === 'streaming') {
    return
  }

  const userMessage: Message = {
    id: crypto.randomUUID(),
    role: 'user',
    parts: [
      {
        type: 'text',
        text: input.value.trim()
      }
    ]
  }

  messages.value.push(userMessage)
  const messageText = input.value.trim()
  input.value = ''
  status.value = 'submitted'

  // Giả lập response từ API (bạn có thể thay thế bằng API call thực tế)
  setTimeout(() => {
    status.value = 'streaming'

    // Giả lập streaming response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        parts: [
          {
            type: 'text',
            text: `Cảm ơn bạn đã hỏi về: "${messageText}". Tôi là chatbot demo của MedUni.vn. Tính năng này đang được phát triển để hỗ trợ bạn tốt hơn.`
          }
        ]
      }
      messages.value.push(assistantMessage)
      status.value = 'ready'
    }, 1000)
  }, 500)
}

const handleSubmit = () => {
  sendMessage()
}

// Hàm lấy text từ message parts
const getMessageText = (message: UIMessage): string => {
  // UIMessage từ Nuxt UI có cấu trúc tương tự Message interface
  if (message?.parts && Array.isArray(message.parts)) {
    return message.parts
      .filter(part => part.type === 'text' && part.text)
      .map(part => part.text || '')
      .join('\n')
  }
  return ''
}

// Hàm copy message text vào clipboard
const handleCopyMessage = async (e: MouseEvent, message: UIMessage) => {
  e.preventDefault()
  e.stopPropagation()

  try {
    const textToCopy = getMessageText(message)
    if (!textToCopy) {
      toast.add({
        title: 'Lỗi',
        description: 'Không có nội dung để sao chép',
        color: 'error'
      })
      return
    }

    await copyToClipboard(textToCopy)
    toast.add({
      title: 'Đã sao chép',
      description: 'Nội dung tin nhắn đã được sao chép vào clipboard',
      color: 'success'
    })
  } catch (error) {
    console.error('Failed to copy text:', error)
    toast.add({
      title: 'Lỗi',
      description: 'Không thể sao chép nội dung',
      color: 'error'
    })
  }
}
</script>

<template>
  <div class="fixed right-3 bottom-3 z-50">
    <UPopover
      v-model:open="isOpen"
      :popper="{
        placement: 'top-end',
        strategy: 'fixed'
      }"

      :content="{ side: 'top', sideOffset: -120 }"
    >
      <div class="relative">
        <NuxtImg
          src="/chatbot.png"
          alt="Trợ lý AI MedUni"
          class="h-auto w-25"
        />

        <!-- Welcome Alert -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-x-2 -translate-y-2"
          enter-to-class="opacity-100 translate-x-0 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-x-0 translate-y-0"
          leave-to-class="opacity-0 translate-x-2 -translate-y-2"
        >
          <div
            v-if="showWelcomeAlert"
            class="absolute z-[-1] right-[70%] bottom-[70%] mr-3 w-[280px]"
            @click.stop
          >
            <UAlert
              title="Xin chào!"
              description="Mình là trợ lý MEDUNI. Bạn cần giúp gì không?"
              color="primary"
              icon="i-lucide-sparkles"
              :close="{
                variant: 'ghost'
              }"
              :ui="{
                root: 'bg-white/90 backdrop-blur-xs text-default'
              }"
              @update:open="showWelcomeAlert = false"
            />
          </div>
        </Transition>
      </div>

      <template #content>
        <div class="w-[90vw] max-w-[400px] h-[80vh] max-h-[600px] flex flex-col bg-white dark:bg-neutral-900 rounded-lg shadow-xl overflow-hidden">
          <!-- Header -->
          <div class="flex justify-between items-center px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <div class="flex gap-3 items-center">
              <div class="flex justify-center items-center w-10 h-10 rounded-full bg-primary-500">
                <UIcon
                  name="i-lucide-bot"
                  class="w-6 h-6 text-white"
                />
              </div>
              <div>
                <h3 class="text-sm font-semibold">
                  Trợ lý AI MedUni
                </h3>
                <p class="text-xs text-neutral-500">
                  Luôn sẵn sàng hỗ trợ
                </p>
              </div>
            </div>
            <UButton
              icon="i-lucide-x"
              color="primary"
              variant="ghost"
              size="md"
              @click="isOpen = false"
            />
          </div>

          <!-- Messages Area -->
          <div class="overflow-y-auto flex-1 max-h-full">
            <UChatMessages
              :messages="messages"
              :status="status"
              :should-auto-scroll="true"
              :should-scroll-to-bottom="false"
              auto-scroll-icon="i-lucide-chevron-down"
              class="my-4 h-full"
              :assistant="{
                side: 'left',
                variant: 'outline',
                avatar: {
                  icon: 'i-lucide-bot'
                },
                actions: [
                  {
                    label: 'Sao chép',
                    icon: 'i-lucide-copy',
                    onClick: handleCopyMessage
                  }
                ]
              }"
            />
          </div>

          <!-- Input Area -->
          <div class="p-4 border-t border-neutral-200 dark:border-neutral-800">
            <UChatPrompt
              v-model="input"
              :disabled="status === 'submitted' || status === 'streaming'"
              placeholder="Nhập tin nhắn của bạn..."
              @submit="handleSubmit"
            >
              <UChatPromptSubmit
                :status="status"
                icon="i-lucide-send"
                submitted-icon="i-lucide-ban"
                @stop="status = 'ready'"
              />
            </UChatPrompt>
          </div>
        </div>
      </template>
    </UPopover>
  </div>
</template>

<style scoped>
/* Đảm bảo scroll container hoạt động đúng */
:deep(.chat-messages-viewport) {
  height: 100%;
  overflow-y: auto;
}

/* Đảm bảo UChatMessages có thể scroll */
:deep([data-slot="viewport"]) {
  height: 100%;
  overflow-y: auto;
}
</style>
