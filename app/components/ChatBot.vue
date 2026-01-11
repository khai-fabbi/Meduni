<script setup lang="ts">
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

const chatbotStore = useChatbotStore()
const { messages, conversationId } = storeToRefs(chatbotStore)

const isOpen = ref(false)
const status = ref<'submitted' | 'ready' | 'error'>('ready')
const input = ref('')
const showWelcomeAlert = ref(false)

const toast = useToast()
const { copy: copyToClipboard } = useClipboard()

const { sendMessage: sendMessageToChatbot } = useChatbot()

// Khởi tạo messages từ store
onMounted(() => {
  chatbotStore.initializeMessages()

  // Hiển thị welcome alert sau 1 giây nếu chưa có messages từ user
  setTimeout(() => {
    const hasUserMessages = messages.value.some(msg => msg.role === 'user')
    if (!hasUserMessages) {
      showWelcomeAlert.value = true
    }
  }, 1000)
})

const sendMessage = async () => {
  if (!input.value.trim() || status.value === 'submitted') {
    return
  }

  const messageText = input.value.trim()
  input.value = ''

  // Add user message to store
  chatbotStore.addUserMessage(messageText)
  status.value = 'submitted'

  try {
    // Send message to chatbot API
    const response = await sendMessageToChatbot(messageText, conversationId.value)

    // Update conversation ID if received from API
    if (response.conversation_id) {
      chatbotStore.setConversationId(response.conversation_id)
    }

    // Add assistant response to store
    if (response.answer) {
      chatbotStore.addAssistantMessage(response.answer)
    } else {
      chatbotStore.addAssistantMessage('Xin lỗi, tôi không thể xử lý câu hỏi này. Vui lòng thử lại.')
    }

    status.value = 'ready'
  } catch (error) {
    console.error('Error sending message:', error)
    status.value = 'error'

    // Add error message
    chatbotStore.addAssistantMessage('Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.')

    toast.add({
      title: 'Lỗi',
      description: 'Không thể gửi tin nhắn. Vui lòng thử lại.',
      color: 'error'
    })

    // Reset status after error
    setTimeout(() => {
      status.value = 'ready'
    }, 2000)
  }
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
        <UTooltip text="Trợ lý AI MedUni">
          <NuxtImg
            src="/chatbot.png"
            alt="Trợ lý AI MedUni"
            class="h-auto transition-opacity cursor-pointer w-18 md:w-25 hover:opacity-90"
          />
        </UTooltip>

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
                root: 'bg-white/90 backdrop-blur-xs text-default shadow-lg'
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
          <div class="overflow-y-auto relative flex-1 max-h-full">
            <UChatMessages
              :messages="messages"
              :status="status"
              :should-auto-scroll="true"
              :should-scroll-to-bottom="true"
              auto-scroll-icon="i-lucide-chevron-down"
              class="py-4 h-full"
              :ui="{
                indicator: '*:bg-neutral-500!'
              }"
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
            >
              <!-- <template #indicator>
                <UButton
                  class="px-0"
                  color="neutral"
                  variant="link"
                  loading
                  loading-icon="i-lucide-loader"
                  label="Thinking..."
                />
              </template> -->
            </UChatMessages>
          </div>

          <!-- Input Area -->
          <div class="p-4 border-t border-neutral-200 dark:border-neutral-800">
            <UChatPrompt
              v-model="input"
              :disabled="status === 'submitted'"
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
