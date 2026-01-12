import { chatbotService } from '~/services/chatbot'
import type { Message } from '~/services/chatbot'

interface SendChatbotMessageOptions {
  /**
   * Có tự động mở chatbot popover không
   * @default false
   */
  autoOpen?: boolean
  /**
   * Có hiển thị toast error không
   * @default true
   */
  showErrorToast?: boolean
}

export const useChatbot = () => {
  const chatbotStore = useChatbotStore()
  const toast = useToast()

  /**
   * Gửi message đến chatbot service (low-level API call)
   */
  const sendMessage = async (message: string, conversationId?: string | null, transcript?: string): Promise<Message> => {
    const response = await chatbotService.sendMessage({
      message,
      conversationId: conversationId || undefined,
      transcript
    })

    return response
  }

  /**
   * Gửi message đến chatbot với đầy đủ logic: add message, update status, handle errors
   * @param messageText - Nội dung message cần gửi
   * @param options - Các tùy chọn bổ sung
   */
  const sendChatbotMessage = async (messageText: string, options: SendChatbotMessageOptions = {}) => {
    const { autoOpen = false, showErrorToast = true } = options

    // Kiểm tra nếu đang submit thì không cho gửi tiếp
    if (chatbotStore.status === 'submitted') {
      return
    }

    // Mở chatbot nếu chưa mở và autoOpen = true
    if (autoOpen && !chatbotStore.isOpen) {
      chatbotStore.openChatbot()
    }

    const trimmedMessage = messageText.trim()
    if (!trimmedMessage) {
      return
    }

    // Thêm user message vào store
    chatbotStore.addUserMessage(trimmedMessage)
    chatbotStore.setSubmitted()

    try {
      // Gửi message đến chatbot API
      const response = await sendMessage(trimmedMessage, chatbotStore.conversationId)

      // Cập nhật conversation ID nếu nhận được từ API
      if (response.conversation_id) {
        chatbotStore.setConversationId(response.conversation_id)
      }

      // Thêm assistant response vào store
      if (response.answer) {
        chatbotStore.addAssistantMessage(response.answer)
      } else {
        chatbotStore.addAssistantMessage('Xin lỗi, tôi không thể xử lý câu hỏi này. Vui lòng thử lại.')
      }

      chatbotStore.setReady()
    } catch (error) {
      console.error('Error sending message:', error)
      chatbotStore.setError()

      // Thêm error message
      chatbotStore.addAssistantMessage('Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.')

      if (showErrorToast) {
        toast.add({
          title: 'Lỗi',
          description: 'Không thể gửi tin nhắn. Vui lòng thử lại.',
          color: 'error'
        })
      }

      // Reset status after error
      setTimeout(() => {
        chatbotStore.setReady()
      }, 2000)
    }
  }

  return {
    sendMessage,
    sendChatbotMessage
  }
}
