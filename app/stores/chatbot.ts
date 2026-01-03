import { defineStore } from 'pinia'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  parts: Array<{
    type: 'text'
    text: string
  }>
}

export const useChatbotStore = defineStore('chatbot', {
  state: () => ({
    messages: [] as ChatMessage[],
    conversationId: null as string | null
  }),

  getters: {
    /**
     * Check if conversation has messages
     */
    hasMessages: state => state.messages.length > 0
  },

  actions: {
    /**
     * Initialize với welcome message nếu chưa có messages
     */
    initializeMessages() {
      if (this.messages.length === 0) {
        this.messages = [
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
      }
    },

    /**
     * Add user message
     */
    addUserMessage(text: string) {
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        parts: [
          {
            type: 'text',
            text: text.trim()
          }
        ]
      }
      this.messages.push(userMessage)
    },

    /**
     * Add assistant message
     */
    addAssistantMessage(text: string) {
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        parts: [
          {
            type: 'text',
            text: text.trim()
          }
        ]
      }
      this.messages.push(assistantMessage)
    },

    /**
     * Set conversation ID
     */
    setConversationId(conversationId: string) {
      this.conversationId = conversationId
    },

    /**
     * Clear all messages và conversation ID (reset chat)
     */
    clearMessages() {
      this.messages = []
      this.conversationId = null
      this.initializeMessages()
    }
  },
  persist: true
})
