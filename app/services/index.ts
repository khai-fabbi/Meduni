import { authService } from './auth'
import { contactService } from './contact'
import { newsService } from './news'

export const services = {
  auth: authService,
  contact: contactService,
  news: newsService
}
