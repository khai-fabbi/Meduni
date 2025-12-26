import { authService } from './auth'
import { contactService } from './contact'
import { newsService } from './news'
import { userService } from './user'
import { coursesService } from './courses'

export const services = {
  auth: authService,
  contact: contactService,
  news: newsService,
  user: userService,
  courses: coursesService
}
