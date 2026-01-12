import { defineStore } from 'pinia'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  parts: Array<{
    type: 'text'
    text: string
  }>
}

export type ChatbotStatus = 'submitted' | 'ready' | 'error'

export const useChatbotStore = defineStore('chatbot', {
  state: () => ({
    messages: [] as ChatMessage[],
    conversationId: null as string | null,
    isOpen: false as boolean,
    status: 'ready' as ChatbotStatus
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
    },

    /**
     * Mở chatbot popover
     */
    openChatbot() {
      this.isOpen = true
    },

    /**
     * Đóng chatbot popover
     */
    closeChatbot() {
      this.isOpen = false
    },

    /**
     * Toggle chatbot popover (mở nếu đang đóng, đóng nếu đang mở)
     */
    toggleChatbot() {
      this.isOpen = !this.isOpen
    },

    /**
     * Set status của chatbot
     */
    setStatus(status: ChatbotStatus) {
      this.status = status
    },

    /**
     * Set status thành ready
     */
    setReady() {
      this.status = 'ready'
    },

    /**
     * Set status thành submitted
     */
    setSubmitted() {
      this.status = 'submitted'
    },

    /**
     * Set status thành error
     */
    setError() {
      this.status = 'error'
    }
  }
})
