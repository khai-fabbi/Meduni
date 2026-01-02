import { chatbotService } from '~/services/chatbot'

export const useChatbot = () => {
  const sendMessage = async (message: string, conversationId?: string, transcript?: string) => {
    const response = await chatbotService.sendMessage({ message, conversationId, transcript })
    console.log('response', response)

    return response
  }

  return {
    sendMessage
  }
}
