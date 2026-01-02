export interface Message {
  answer: string // answer from chatbot type object string
  conversation_id: string
  created_at: number
  message_id: string
}

export const chatbotService = {
  sendMessage: async (payload: { message: string, conversationId?: string, transcript?: string }) => {
    const config = useRuntimeConfig()
    const beCesintelligentUrl = config.public.beCesintelligentUrl as string
    const beCesintelligentApiKey = config.public.beCesintelligentApiKey as string

    const { transcript, message, conversationId } = payload

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const defaultArgs: any = {
      inputs: {},
      response_mode: 'blocking',
      user: getUser()
    }

    // Only add transcript to inputs if it exists (when in lesson video screen)
    if (transcript) {
      defaultArgs.inputs.transcript = transcript
    }

    return $fetch<Message>(`${beCesintelligentUrl}/v1/chat-messages`, {
      method: 'POST',
      body: JSON.stringify({
        ...defaultArgs,
        query: message,
        conversation_id: conversationId
      }),
      headers: new Headers({
        'Authorization': `Bearer ${beCesintelligentApiKey}`,
        'Content-Type': 'application/json'
      })
    })
  }
}

const CHATBOT_USER_KEY = 'chat-bot-user'
const getUser = () => {
  const user = localStorage.getItem(CHATBOT_USER_KEY)
  if (user) {
    return user
  }
  const newUser = crypto.randomUUID()
  localStorage.setItem(CHATBOT_USER_KEY, newUser.toString())
  return newUser
}
