import type { ListNews, MostViewedNews, News, NewsDetail } from '~/types/news'
import type { ApiResponse } from '~/types/common'
import type { Ref } from 'vue'

export const newsService = {
  getList: (page?: number | Ref<number>, limit?: number) => {
    return useApiFetch<ApiResponse<ListNews>>(ApiEndpoint.News.GetList, {
      query: computed(() => ({
        ...(page && { page: unref(page) }),
        ...(limit && { limit })
      }))
    })
  },
  getMostViewed: () => {
    return useApiFetch<ApiResponse<MostViewedNews[]>>(ApiEndpoint.News.MostViewed)
  },
  getLatest: () => {
    return useApiFetch<ApiResponse<News[]>>(ApiEndpoint.News.Latest, {
      query: {
        page_size: 8
      },
      server: false,
      lazy: true
    })
  },
  getDetail: (newsId: string) => {
    return useApiFetch<ApiResponse<NewsDetail>>(ApiEndpoint.News.GetDetail(newsId))
  }
}
