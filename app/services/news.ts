import type { News, ListNews } from '~/types/news'
import type { ApiResponse } from '~/types/common'

export const newsService = {
  getList: () => {
    return useApiFetch<ApiResponse<ListNews[]>>(ApiEndpoint.News.GetList)
  },
  getMostViewed: () => {
    return useApiFetch<ApiResponse<ListNews[]>>(ApiEndpoint.News.MostViewed)
  },
  getLatest: () => {
    return useApiFetch<ApiResponse<ListNews[]>>(ApiEndpoint.News.Latest)
  },
  getDetail: (newsId: string) => {
    return useApiFetch<ApiResponse<News>>(ApiEndpoint.News.GetDetail(newsId))
  }
}
