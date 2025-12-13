const prefix = '/api/v1'

export const ApiEndpoint = {
  Profile: {
    GetProfile: `${prefix}/profile`
  },
  Contact: {
    GetContact: `${prefix}/contact`,
    PostContact: `${prefix}/contact`
  }
}
