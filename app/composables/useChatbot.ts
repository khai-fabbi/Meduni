import { chatbotService } from '~/services/chatbot'
import type { Message } from '~/services/chatbot'

export const useChatbot = () => {
  const sendMessage = async (message: string, conversationId?: string | null, transcript?: string): Promise<Message> => {
    const response = await chatbotService.sendMessage({
      message,
      conversationId: conversationId || undefined,
      transcript
    })

    return response
  }

  return {
    sendMessage
  }
}
