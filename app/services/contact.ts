interface ContactRequest {
  name: string
  email: string
  phone: string
  message: string
}

interface ContactResponse {
  message: string
}

export const contactService = {
  getContact: async () => {
    return useApiFetch<ContactResponse>(ApiEndpoint.Contact.GetContact)
  },
  postContact: async (payload: ContactRequest) => {
    const { $api } = useNuxtApp()
    return $api<ContactResponse>(ApiEndpoint.Contact.PostContact, {
      method: 'POST',
      body: payload
    })
  }
}
