export interface ContactRequest {
  full_name: string
  phone: string
  email: string
  message: string
  reason: number
  contact_type: string
  country_number: string
}

interface ContactResponse {
  message: string
}

export const contactService = {
  postContact: async (payload: ContactRequest) => {
    const { $api } = useNuxtApp()
    return $api<ContactResponse>(ApiEndpoint.Contact.SendContact, {
      method: 'POST',
      body: payload
    })
  }
}
